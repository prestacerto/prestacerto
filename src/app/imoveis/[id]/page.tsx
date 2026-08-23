import { Metadata } from 'next';
import PropertyDetails from '@/components/imoveis/PropertyDetails';
import PropertyImages from '@/components/imoveis/PropertyImages';
import PropertyInfo from '@/components/imoveis/PropertyInfo';
import ScheduleVisit from '@/components/imoveis/ScheduleVisit';
import ContactSeller from '@/components/imoveis/ContactSeller';

export const metadata: Metadata = {
  title: 'Detalhes do Imóvel | SeuImóvel',
  description: 'Veja mais detalhes, fotos e agende uma visita.',
};

interface PropertyPageProps {
  params: {
    id: string;
  };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyImages propertyId={params.id} />
            <PropertyDetails propertyId={params.id} />
            <PropertyInfo propertyId={params.id} />
          </div>
          <div className="space-y-4">
            <ContactSeller propertyId={params.id} />
            <ScheduleVisit propertyId={params.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
