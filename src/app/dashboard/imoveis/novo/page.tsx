import { Metadata } from 'next';
import CreatePropertyForm from '@/components/imoveis/CreatePropertyForm';

export const metadata: Metadata = {
  title: 'Publicar Novo Imóvel | SeuImóvel',
  description: 'Crie um anúncio para seu imóvel',
};

export default function NewPropertyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Publicar Novo Imóvel</h1>
          <p className="text-gray-600 mb-8">Preencha as informações do seu imóvel</p>

          <CreatePropertyForm />
        </div>
      </div>
    </main>
  );
}
