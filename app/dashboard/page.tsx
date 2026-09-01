import DashboardClient from './dashboard-client';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Portal do cliente | Cadu AI', robots: { index: false, follow: false } };

export default async function DashboardPage() {
  // TODO: Implementar autenticação real (Supabase, NextAuth, etc)
  const user = { fullName: 'Gestor', email: 'gestor@imobiliaria.com.br' };
  return <DashboardClient userName={user.fullName ?? user.email.split('@')[0]} userEmail={user.email} />;
}
