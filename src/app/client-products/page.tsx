import { ClientProductsHub } from '@/components/client-products-hub';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Products | PrestaCerto',
  description: '8 produtos para clientes com APIs, dashboards e checkout integrado',
};

export default function ClientProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ClientProductsHub />
    </div>
  );
}
