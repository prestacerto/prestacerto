import { notFound, redirect } from 'next/navigation';
import { getAdminContext } from '@/lib/auth/admin';
import { AdminLeads } from '@/components/admin/admin-leads';
import { getNoIndexMetadata } from '@/lib/seo/metadata';
export const dynamic = 'force-dynamic';
export const metadata = getNoIndexMetadata('Leads recebidos');
export default async function LeadsPage() {
  const admin = await getAdminContext();
  if (!admin) redirect('/login?next=/admin/leads');
  if (admin.role !== 'super_admin') notFound();
  return <AdminLeads />;
}
