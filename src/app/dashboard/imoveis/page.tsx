import { Metadata } from 'next';
import SellerDashboard from '@/components/imoveis/SellerDashboard';
import MyProperties from '@/components/imoveis/MyProperties';
import NewPropertyButton from '@/components/imoveis/NewPropertyButton';

export const metadata: Metadata = {
  title: 'Meus Imóveis | SeuImóvel',
  description: 'Gerencie seus imóveis listados',
};

export default function SellerPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Meus Imóveis</h1>
            <p className="text-gray-600 mt-2">Gerencie seus anúncios e visualize estatísticas</p>
          </div>
          <NewPropertyButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <SellerDashboard />
        </div>

        <MyProperties />
      </div>
    </main>
  );
}
