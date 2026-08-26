import { requireChatGPTUser } from '../chatgpt-auth';
import DashboardClient from './dashboard-client';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Portal do cliente | Cadu AI', robots: { index: false, follow: false } };

export default async function DashboardPage() {
  const user = await requireChatGPTUser('/dashboard');
  return <DashboardClient userName={user.fullName ?? user.email.split('@')[0]} userEmail={user.email} />;
}
