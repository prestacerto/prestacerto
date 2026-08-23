import { Metadata } from 'next';
import SearchHero from '@/components/imoveis/SearchHero';
import PropertyGrid from '@/components/imoveis/PropertyGrid';

export const metadata: Metadata = {
  title: 'Buscar Imóveis | SeuImóvel',
  description: 'Encontre o imóvel perfeito. Venda, aluguel e mais.',
};

export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <SearchHero />
      <div className="container mx-auto px-4 py-8">
        <PropertyGrid />
      </div>
    </main>
  );
}
