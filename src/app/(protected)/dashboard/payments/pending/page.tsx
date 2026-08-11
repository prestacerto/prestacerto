import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentPendingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="text-center space-y-6">
        <Clock className="w-16 h-16 text-yellow-600 mx-auto animate-spin" />
        <h1 className="text-4xl font-bold text-gray-800">Pagamento Pendente</h1>
        <p className="text-lg text-gray-600">
          Estamos processando seu pagamento. Isso pode levar alguns minutos. Verifique sua caixa de entrada para atualizações.
        </p>
        <div className="pt-6">
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
