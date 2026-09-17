import { redirect } from 'next/navigation';

// Retired prototype: only the verified Assiny flow may start a subscription.
export default function LegacyCheckoutPage() {
  redirect('/plans');
}
