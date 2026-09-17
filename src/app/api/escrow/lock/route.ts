import { unavailableAssinyOperation } from '@/lib/payments/availability';
export async function POST() {
  return unavailableAssinyOperation('A reserva de valores pelo Assiny ainda não está ativa. Nenhum valor foi bloqueado por esta solicitação.');
}
