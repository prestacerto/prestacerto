import type { Metadata } from 'next';
import { requireAdmin } from '../chatgpt-auth';
import DashboardClient from '../dashboard/dashboard-client';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Administração | Cadu AI', robots: { index: false, follow: false } };

export default async function AdminPage() {
  const user = await requireAdmin();
  return <DashboardClient userName={user.fullName ?? user.email.split('@')[0]} userEmail={user.email} />;
}
