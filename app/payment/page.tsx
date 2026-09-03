'use client';
import EscrowPaymentIntegrated from '../components/EscrowPaymentIntegrated';

export default function PaymentPage() {
  return <EscrowPaymentIntegrated proposalId="prop_1" amount={5000} />;
}
