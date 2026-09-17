import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentFailurePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <div className="text-center space-y-6">
        <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
        <h1 className="text-4xl font-bold text-gray-800">Pagamento Recusado</h1>
        <p className="text-lg text-gray-600">
          Infelizmente, seu pagamento não foi aprovado. Por favor, verifique seus dados e tente novamente.
        </p>
        <div className="pt-6 space-x-4">
          <Link href="/dashboard/connects/buy">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Tentar Novamente
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
