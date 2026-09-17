import { unavailableAssinyOperation } from '@/lib/payments/availability';
// Only Assiny will be enabled, after checkout and resume delivery are validated.
export async function POST() {
  return unavailableAssinyOperation('O Certo Currículo está em preparação. Nenhuma cobrança foi criada.');
}
