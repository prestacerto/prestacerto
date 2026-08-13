import { BusinessDashboard } from '@/components/business/BusinessDashboard';

export const metadata = {
  title: 'Certo AI - PrestaCerto',
  description: 'Dashboard de propostas otimizadas com IA invisível'
};

export default function CertoAIPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certo AI</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Otimizador de propostas com inteligência artificial invisível
        </p>
      </div>

      <BusinessDashboard />
    </div>
  );
}
