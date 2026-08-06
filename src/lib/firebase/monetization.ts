import { db } from "./client";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

/**
 * Monetization features for PrestaCerto
 * 1. Project Highlight (cliente paga)
 * 2. Freelancer Verification (freelancer paga)
 * 3. Early Payment (freelancer paga pra receber antes)
 */

export interface HighlightPurchase {
  projectId: string;
  amount: number; // R$ 29,90 ou similar
  highlightedUntil: Timestamp;
  mercadoPagoPaymentId: string;
  createdAt: Timestamp;
}

export interface VerificationBadge {
  freelancerId: string;
  verified: boolean;
  verifiedAt: Timestamp;
  verificationCost: number; // R$ 9,90
  mercadoPagoPaymentId: string;
}

export interface EarlyPaymentRequest {
  proposalId: string;
  freelancerId: string;
  originalAmount: number;
  earlyPaymentFee: number; // 2.99% ou taxa fixa
  netAmount: number;
  requestedAt: Timestamp;
  status: "pending" | "captured" | "failed";
}

// ============================================================
// PROJECT HIGHLIGHT
// ============================================================

export async function addProjectHighlight(
  projectId: string,
  daysHighlighted: number = 7,
  mercadoPagoPaymentId: string
): Promise<void> {
  const highlightedUntil = Timestamp.fromDate(
    new Date(Date.now() + daysHighlighted * 24 * 60 * 60 * 1000)
  );

  await updateDoc(doc(db, "projects", projectId), {
    is_featured: true,
    featured_until: highlightedUntil,
    mercado_pago_highlight_payment: mercadoPagoPaymentId,
  });
}

export async function removeProjectHighlight(projectId: string): Promise<void> {
  await updateDoc(doc(db, "projects", projectId), {
    is_featured: false,
    featured_until: null,
  });
}

// ============================================================
// FREELANCER VERIFICATION BADGE
// ============================================================

export async function addVerificationBadge(
  freelancerId: string,
  mercadoPagoPaymentId: string
): Promise<void> {
  await updateDoc(doc(db, "profiles", freelancerId), {
    is_verified: true,
    verified_at: Timestamp.now(),
    mercado_pago_verification_payment: mercadoPagoPaymentId,
  });
}

// ============================================================
// EARLY PAYMENT REQUEST
// ============================================================

export async function createEarlyPaymentRequest(
  proposalId: string,
  freelancerId: string,
  amount: number,
  feePercentage: number = 0.0299 // 2.99%
): Promise<string> {
  const fee = amount * feePercentage;
  const netAmount = amount - fee;

  const earlyPaymentRef = await db
    .collection("early_payment_requests")
    .add({
      proposal_id: proposalId,
      freelancer_id: freelancerId,
      original_amount: amount,
      early_payment_fee: fee,
      net_amount: netAmount,
      requested_at: Timestamp.now(),
      status: "pending",
    });

  return earlyPaymentRef.id;
}

export async function updateEarlyPaymentStatus(
  requestId: string,
  status: "pending" | "captured" | "failed",
  mercadoPagoPaymentId?: string
): Promise<void> {
  const data: any = { status };
  if (mercadoPagoPaymentId) {
    data.mercado_pago_payment_id = mercadoPagoPaymentId;
  }
  await updateDoc(doc(db, "early_payment_requests", requestId), data);
}
