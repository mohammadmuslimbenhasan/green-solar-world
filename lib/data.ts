import {
  categories,
  collections,
  products,
  type Category,
  type Collection,
  type CollectionSlug,
  type Product,
} from '@/data/catalog';
import {
  productContent,
  productMetaTitle,
  productMetaDescription,
  type ProductContent,
} from '@/data/product-content';
import { reviews as bundledReviews, type Review } from '@/data/reviews';
import { defaultSiteSettings, type SiteSettings } from '@/data/site-settings';
import { getSupabase } from '@/lib/supabase';

// Build/request-time accessor for the catalog.
// If Supabase env vars are set, we try to read the live catalog; ANY failure falls
// back to the bundled seed data so the site always builds and renders — with or
// without env vars. Pages layer ISR (revalidate = 300) on top of this.


type Catalog = {
  collections: Collection[];
  categories: Category[];
  products: Product[];
};

let cache: Catalog | null = null;

export async function getCatalog(): Promise<Catalog> {
  if (cache) return cache;

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: c, error: ce } = await supabase.from('collections').select('*');
      if (!ce && c && c.length > 0) {
        const { data: cats, error: kate } = await supabase.from('categories').select('*');
        const { data: prods, error: pe } = await supabase.from('products').select('*');
        if (!kate && !pe && cats && prods) {
          cache = {
            collections: c as Collection[],
            categories: cats as Category[],
            // Supabase rows carry image_url; the site works with `image`.
            products: (prods as (Product & { image_url?: string | null })[]).map((p) => ({
              ...p,
              image: p.image ?? p.image_url ?? null,
            })),
          };
          return cache;
        }
      }
    } catch {
      // fall through to bundled data
    }
  }

  cache = { collections, categories, products };
  return cache;
}

export async function getCollection(slug: string): Promise<Collection | undefined> {
  const c = await getCatalog();
  return c.collections.find((x) => x.slug === slug);
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const c = await getCatalog();
  return c.categories.find((x) => x.slug === slug);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const c = await getCatalog();
  return c.products.find((x) => x.slug === slug);
}

export async function categoriesByCollection(slug: CollectionSlug): Promise<Category[]> {
  const c = await getCatalog();
  return c.categories.filter((x) => x.collection === slug);
}

export async function productsByCollection(slug: CollectionSlug): Promise<Product[]> {
  const c = await getCatalog();
  return c.products.filter((x) => x.collection === slug);
}

export async function relatedProducts(product: Product, count = 4): Promise<Product[]> {
  const c = await getCatalog();
  const same = c.products.filter((x) => x.category === product.category && x.slug !== product.slug);
  const rest = c.products.filter((x) => x.category !== product.category && x.slug !== product.slug);
  return [...same, ...rest].slice(0, count);
}

export async function featuredProducts(): Promise<Product[]> {
  const c = await getCatalog();
  return c.products.filter((x) => x.featured);
}

/**
 * Full SEO/content payload for a product: generated from the bundled templates,
 * overridden by Supabase columns (meta_title, meta_description, long_description,
 * faqs) when the admin has edited them.
 */
export async function getProductContent(slug: string): Promise<(Product & { content: ProductContent }) | undefined> {
  const product = await getProduct(slug);
  if (!product) return undefined;
  const generated = productContent(product);
  const content: ProductContent = {
    ...generated,
    intro: product.long_description ?? generated.intro,
    faqs: product.faqs && product.faqs.length > 0 ? product.faqs : generated.faqs,
  };
  return { ...product, content };
}

export function computedMetaTitle(p: Product): string {
  return p.meta_title ?? productMetaTitle(p);
}

export function computedMetaDescription(p: Product): string {
  return p.meta_description ?? productMetaDescription(p);
}

/** Approved reviews — from Supabase when configured, else the bundled Google reviews. */
export async function getReviews(): Promise<Review[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('author_name, rating, text, source')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((r) => ({
          authorName: r.author_name,
          rating: r.rating,
          text: r.text,
          source: r.source,
        }));
      }
    } catch {
      // fall through
    }
  }
  return bundledReviews;
}

/** Site settings — Supabase overrides bundled defaults. */
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (!error && data) {
        const merged = { ...defaultSiteSettings } as SiteSettings;
        for (const row of data) {
          const key = row.key as keyof SiteSettings;
          if (key in merged && typeof row.value === 'string') merged[key] = row.value;
        }
        return merged;
      }
    } catch {
      // fall through
    }
  }
  return { ...defaultSiteSettings };
}
