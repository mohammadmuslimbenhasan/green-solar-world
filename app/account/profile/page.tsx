import { createSupabaseServer } from '@/lib/supabase-server';
import ProfileForm from '@/components/account/ProfileForm';

export const dynamic = 'force-dynamic';

export default async function AccountProfilePage() {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, company_name, phone')
    .eq('id', user!.id)
    .single();

  return (
    <div className="rounded-2xl border border-line bg-white p-7">
      <h2 className="mb-5 font-display text-xl font-bold text-ink">Profile</h2>
      <ProfileForm
        initial={{
          full_name: profile?.full_name ?? '',
          company_name: profile?.company_name ?? '',
          phone: profile?.phone ?? '',
        }}
      />
    </div>
  );
}
