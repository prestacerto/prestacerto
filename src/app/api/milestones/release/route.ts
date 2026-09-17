import { unavailableAssinyOperation } from '@/lib/payments/availability';
// Never infer ownership from an x-user-id header or simulate a financial release.
export async function POST() {
  return unavailableAssinyOperation('A liberação por etapas pelo Assiny ainda não está ativa. Nenhum pagamento foi liberado por esta solicitação.');
}
