import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="text-center space-y-6">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
        <h1 className="text-4xl font-bold text-gray-800">Pagamento Aprovado! 🎉</h1>
        <p className="text-lg text-gray-600">
          Seu pagamento foi processado com sucesso. Suas propostas foram adicionadas à sua conta.
        </p>
        <div className="pt-6">
          <Link href="/dashboard">
            <Button className="bg-green-600 hover:bg-green-700">
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
