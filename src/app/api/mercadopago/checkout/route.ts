import { unavailableAssinyOperation } from '@/lib/payments/availability';
// Legacy gateway retired. Assiny replacement requires verified product delivery.
export async function POST() { return unavailableAssinyOperation(); }
