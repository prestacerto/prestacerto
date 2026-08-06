import { db } from './client';
import { collection, doc, updateDoc, getDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { COLLECTIONS } from './firestore-schema';

export interface FeaturedListing {
  freelancer_id: string;
  plan_type: 'featured_basic' | 'featured_pro'; // Basic: 1 featured, Pro: 5 featured
  price: number; // R$39 ou R$79
  featured_until: Timestamp;
  created_at: Timestamp;
  is_active: boolean;
  featured_slots: number; // Quantos projects podem estar featured
}

/**
 * Create featured listing subscription for a freelancer
 * @param freelancerId - Freelancer ID
 * @param planType - 'featured_basic' (R$39/mês, 1 slot) or 'featured_pro' (R$79/mês, 5 slots)
 * @param mercadoPagoPaymentId - Payment confirmation from Mercado Pago
 */
export async function createFeaturedListing(
  freelancerId: string,
  planType: 'featured_basic' | 'featured_pro',
  mercadoPagoPaymentId: string
): Promise<void> {
  const prices = {
    featured_basic: 39.0,
    featured_pro: 79.0,
  };

  const slots = {
    featured_basic: 1,
    featured_pro: 5,
  };

  const featuredRef = doc(db, COLLECTIONS.FEATURED_LISTINGS, freelancerId);

  // 30 days from now
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);

  await updateDoc(featuredRef, {
    freelancer_id: freelancerId,
    plan_type: planType,
    price: prices[planType],
    featured_until: Timestamp.fromDate(futureDate),
    created_at: Timestamp.now(),
    is_active: true,
    featured_slots: slots[planType],
    mercado_pago_payment_id: mercadoPagoPaymentId,
  }).catch(async () => {
    // If doc doesn't exist, create it
    await updateDoc(featuredRef, {
      freelancer_id: freelancerId,
      plan_type: planType,
      price: prices[planType],
      featured_until: Timestamp.fromDate(futureDate),
      created_at: Timestamp.now(),
      is_active: true,
      featured_slots: slots[planType],
      mercado_pago_payment_id: mercadoPagoPaymentId,
    });
  });
}

/**
 * Check if freelancer has active featured listing
 */
export async function hasActiveFeaturedListing(freelancerId: string): Promise<boolean> {
  const featuredRef = doc(db, COLLECTIONS.FEATURED_LISTINGS, freelancerId);
  const docSnap = await getDoc(featuredRef);

  if (!docSnap.exists()) return false;

  const data = docSnap.data() as FeaturedListing;
  return data.is_active && data.featured_until.toDate() > new Date();
}

/**
 * Get featured freelancers (for homepage showcase)
 */
export async function getFeaturedFreelancers(limit: number = 6): Promise<string[]> {
  const q = query(
    collection(db, COLLECTIONS.FEATURED_LISTINGS),
    where('is_active', '==', true)
  );

  const querySnapshot = await getDocs(q);
  const now = new Date();

  const featured = querySnapshot.docs
    .filter(doc => {
      const data = doc.data() as FeaturedListing;
      return data.featured_until.toDate() > now;
    })
    .map(doc => doc.id)
    .slice(0, limit);

  return featured;
}

/**
 * Get featured listing details
 */
export async function getFeaturedListing(freelancerId: string): Promise<FeaturedListing | null> {
  const featuredRef = doc(db, COLLECTIONS.FEATURED_LISTINGS, freelancerId);
  const docSnap = await getDoc(featuredRef);

  if (!docSnap.exists()) return null;
  return docSnap.data() as FeaturedListing;
}

/**
 * Renew featured listing (auto-renew or manual)
 */
export async function renewFeaturedListing(
  freelancerId: string,
  mercadoPagoPaymentId: string
): Promise<void> {
  const featuredRef = doc(db, COLLECTIONS.FEATURED_LISTINGS, freelancerId);
  const docSnap = await getDoc(featuredRef);

  if (!docSnap.exists()) {
    throw new Error('Featured listing not found');
  }

  const currentListing = docSnap.data() as FeaturedListing;
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);

  await updateDoc(featuredRef, {
    featured_until: Timestamp.fromDate(futureDate),
    mercado_pago_payment_id: mercadoPagoPaymentId,
    last_renewed_at: Timestamp.now(),
  });
}

/**
 * Cancel featured listing
 */
export async function cancelFeaturedListing(freelancerId: string): Promise<void> {
  const featuredRef = doc(db, COLLECTIONS.FEATURED_LISTINGS, freelancerId);
  await updateDoc(featuredRef, {
    is_active: false,
  });
}
