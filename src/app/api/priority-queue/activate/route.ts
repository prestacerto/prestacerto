import { unavailableAssinyOperation } from '@/lib/payments/availability';

// Retired direct activation: a client request is not proof of payment.
export async function POST() { return unavailableAssinyOperation(); }
