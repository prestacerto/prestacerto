import { db } from './client';
import { doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { COLLECTIONS } from './firestore-schema';

export interface PortfolioPremium {
  freelancer_id: string;
  plan_type: 'portfolio_standard' | 'portfolio_pro'; // Standard: 3 featured, Pro: 10 featured
  price: number; // R$39 ou R$79
  featured_projects_slots: number;
  portfolio_until: Timestamp;
  created_at: Timestamp;
  is_active: boolean;
}

/**
 * Create portfolio premium subscription
 * @param freelancerId - Freelancer ID
 * @param planType - 'portfolio_standard' (R$39/mês, 3 slots) or 'portfolio_pro' (R$79/mês, 10 slots)
 * @param mercadoPagoPaymentId - Payment confirmation
 */
export async function createPortfolioPremium(
  freelancerId: string,
  planType: 'portfolio_standard' | 'portfolio_pro',
  mercadoPagoPaymentId: string
): Promise<void> {
  const prices = {
    portfolio_standard: 39.0,
    portfolio_pro: 79.0,
  };

  const slots = {
    portfolio_standard: 3,
    portfolio_pro: 10,
  };

  const portfolioRef = doc(db, COLLECTIONS.PORTFOLIO_PREMIUM, freelancerId);

  // 30 days from now
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);

  await updateDoc(portfolioRef, {
    freelancer_id: freelancerId,
    plan_type: planType,
    price: prices[planType],
    featured_projects_slots: slots[planType],
    portfolio_until: Timestamp.fromDate(futureDate),
    created_at: Timestamp.now(),
    is_active: true,
    mercado_pago_payment_id: mercadoPagoPaymentId,
  }).catch(async () => {
    // If doc doesn't exist, create it
    await updateDoc(portfolioRef, {
      freelancer_id: freelancerId,
      plan_type: planType,
      price: prices[planType],
      featured_projects_slots: slots[planType],
      portfolio_until: Timestamp.fromDate(futureDate),
      created_at: Timestamp.now(),
      is_active: true,
      mercado_pago_payment_id: mercadoPagoPaymentId,
    });
  });
}

/**
 * Get available portfolio premium slots
 */
export async function getPortfolioSlots(freelancerId: string): Promise<number> {
  const portfolioRef = doc(db, COLLECTIONS.PORTFOLIO_PREMIUM, freelancerId);
  const docSnap = await getDoc(portfolioRef);

  if (!docSnap.exists()) return 0;

  const data = docSnap.data() as PortfolioPremium;
  if (!data.is_active || data.portfolio_until.toDate() < new Date()) return 0;

  return data.featured_projects_slots;
}

/**
 * Get portfolio premium details
 */
export async function getPortfolioPremium(freelancerId: string): Promise<PortfolioPremium | null> {
  const portfolioRef = doc(db, COLLECTIONS.PORTFOLIO_PREMIUM, freelancerId);
  const docSnap = await getDoc(portfolioRef);

  if (!docSnap.exists()) return null;
  return docSnap.data() as PortfolioPremium;
}

/**
 * Cancel portfolio premium
 */
export async function cancelPortfolioPremium(freelancerId: string): Promise<void> {
  const portfolioRef = doc(db, COLLECTIONS.PORTFOLIO_PREMIUM, freelancerId);
  await updateDoc(portfolioRef, {
    is_active: false,
  });
}
