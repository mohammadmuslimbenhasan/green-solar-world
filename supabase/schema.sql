-- Green Solar World Inc. — Supabase schema (Phase 2)
-- Run this in the Supabase SQL editor FIRST, then run seed.sql.
-- After registering your first user via /register, promote them to admin:
--   update profiles set role = 'admin' where id = '<user-uuid>';

create extension if not exists "uuid-ossp";

-- ─── Collections (top-level product collections) ────────────────────────────
create table if not exists public.collections (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  "shortName" text,
  tagline text,
  description text,
  created_at timestamptz not null default now()
);

-- ─── Categories (subcategories within a collection) ─────────────────────────
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  collection text not null references public.collections(slug) on delete cascade,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists categories_collection_idx on public.categories(collection);

-- ─── Products ────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  sku text unique not null,
  name text not null,
  collection text not null references public.collections(slug) on delete cascade,
  category text not null references public.categories(slug) on delete cascade,
  price numeric(10,2) not null check (price >= 0),
  "compareAt" numeric(10,2) check ("compareAt" is null or "compareAt" >= price),
  featured boolean not null default false,
  short text not null,
  description text not null,
  specs jsonb not null default '[]'::jsonb,
  stock text not null default 'in-stock'
    check (stock in ('in-stock','low-stock','made-to-order')),
  -- SEO / content (Phase 2)
  meta_title text,
  meta_description text,
  long_description text,
  faqs jsonb not null default '[]'::jsonb,
  image_url text,                      -- optional; falls back to generated SVG art
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_collection_idx on public.products(collection);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_featured_idx on public.products(featured) where featured = true;

-- ─── Profiles (1:1 with auth.users) ─────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  phone text,
  role text not null default 'customer' check (role in ('admin','customer')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: is the current user an admin? (security definer to avoid recursive RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ─── Reviews (Google reviews + admin-curated; shown sitewide) ───────────────
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  text text not null,
  source text not null default 'google',
  is_approved boolean not null default true,
  product_id uuid references public.products(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ─── Site settings (key/value; admin-editable) ──────────────────────────────
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null
);

-- ─── Homepage sections (admin-editable content blocks) ──────────────────────
create table if not exists public.homepage_sections (
  id uuid primary key default uuid_generate_v4(),
  section_key text unique not null,
  title text not null,
  subtitle text,
  body jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order int not null default 0
);

-- ─── Orders (wholesale phone/online order requests) ──────────────────────────
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  company text,
  contact_name text not null,
  phone text not null,
  email text,
  notes text,
  items jsonb not null,               -- [{ slug, sku, name, qty, price }]
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null default 30,
  total numeric(10,2) not null,
  status text not null default 'pending'
    check (status in ('pending','confirmed','ready_for_pickup','shipped','completed','cancelled')),
  note text,                          -- internal admin note (not shown to customers)
  created_at timestamptz not null default now()
);

-- ─── Inquiries (contact form) ────────────────────────────────────────────────
create table if not exists public.inquiries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  handled boolean not null default false,   -- admin "mark handled" flag
  created_at timestamptz not null default now()
);

-- ─── Row Level Security ──────────────────────────────────────────────────────
alter table public.collections enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.orders enable row level security;
alter table public.inquiries enable row level security;

-- Catalog: public read; admin write
create policy "anon read collections" on public.collections
  for select to anon, authenticated using (true);
create policy "admin write collections" on public.collections
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "anon read categories" on public.categories
  for select to anon, authenticated using (true);
create policy "admin write categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "anon read products" on public.products
  for select to anon, authenticated using (true);
create policy "admin write products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Profiles: read own + admin reads all; users update own (not their role)
create policy "profiles select own or admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles update own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "admin update profiles" on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
-- Profile row is created by the handle_new_user trigger (security definer).

-- Reviews: anon reads approved; admin manages all
create policy "anon read approved reviews" on public.reviews
  for select to anon, authenticated using (is_approved = true or public.is_admin());
create policy "admin write reviews" on public.reviews
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Settings & homepage sections: public read, admin write
create policy "anon read site_settings" on public.site_settings
  for select to anon, authenticated using (true);
create policy "admin write site_settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "anon read homepage_sections" on public.homepage_sections
  for select to anon, authenticated using (true);
create policy "admin write homepage_sections" on public.homepage_sections
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Orders: signed-in users insert/select their own; anon can insert phone orders
-- (user_id stays null); admin manages all. Orders are never anon-readable.
create policy "users insert own orders" on public.orders
  for insert to authenticated
  with check (user_id = auth.uid());
create policy "anon insert phone orders" on public.orders
  for insert to anon
  with check (user_id is null);
create policy "users select own orders" on public.orders
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "admin manage orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Inquiries: anyone can submit; only admin reads
create policy "anyone insert inquiries" on public.inquiries
  for insert to anon, authenticated with check (true);
create policy "admin read inquiries" on public.inquiries
  for select to authenticated using (public.is_admin());
