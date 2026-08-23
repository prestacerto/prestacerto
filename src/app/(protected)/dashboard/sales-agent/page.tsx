import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/get-user';
import { SalesAgentDashboard } from '@/components/sales-agent/dashboard';

export default async function SalesAgentPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Agente de Vendas IA</h1>
          <p className="text-slate-600 mt-2">Configure e controle seu agente SDR automático</p>
        </div>

        <SalesAgentDashboard userId={user.id} />
      </div>
    </div>
  );
}
