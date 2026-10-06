import { createSupabaseServer } from '@/lib/supabase-server';
import { AdminHeader, Table, Badge } from '@/components/admin/ui';
import { RoleButton } from '@/components/admin/RoleButton';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  // profiles has no email column; auth admin API is service-role only,
  // so we list what profiles carries and note the uuid.
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, company_name, phone, role, created_at')
    .order('created_at', { ascending: false });

  return (
    <>
      <AdminHeader
        title="Customers"
        description="Registered accounts. Promote a trusted account to admin below."
      />
      <Table head={['Name', 'Company', 'Phone', 'Role', 'Joined', 'Actions']}>
        {(profiles ?? []).map((p) => (
          <tr key={p.id}>
            <td className="px-4 py-3">
              <p className="font-medium text-ink">{p.full_name || '—'}</p>
              <p className="font-mono text-[11px] text-ink/35">{p.id.slice(0, 8)}…</p>
            </td>
            <td className="px-4 py-3 text-ink/60">{p.company_name ?? '—'}</td>
            <td className="px-4 py-3 text-ink/60">{p.phone ?? '—'}</td>
            <td className="px-4 py-3">
              <Badge tone={p.role === 'admin' ? 'amber' : 'gray'}>{p.role}</Badge>
            </td>
            <td className="px-4 py-3 text-ink/60">
              {new Date(p.created_at).toLocaleDateString('en-CA')}
            </td>
            <td className="px-4 py-3">
              <RoleButton id={p.id} role={p.role} name={p.full_name ?? p.id.slice(0, 8)} />
            </td>
          </tr>
        ))}
        {(!profiles || profiles.length === 0) && (
          <tr><td colSpan={6} className="px-4 py-10 text-center text-ink/40">No registered customers yet.</td></tr>
        )}
      </Table>
    </>
  );
}
