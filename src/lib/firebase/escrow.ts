import { db } from './client';
import { collection, doc, setDoc, updateDoc, getDoc, query, where, getDocs, Timestamp, writeBatch } from 'firebase/firestore';
import { COLLECTIONS } from './firestore-schema';

export type EscrowStatus = 'pending' | 'held' | 'released' | 'refunded' | 'disputed';

export interface EscrowTransaction {
  id: string;
  proposal_id: string;
  project_id: string;
  client_id: string;
  freelancer_id: string;
  amount: number; // Original amount
  escrow_fee_percent: number; // 4% default
  escrow_fee_amount: number; // Amount × 0.04
  net_amount: number; // Amount - escrow_fee (what freelancer receives)
  status: EscrowStatus;
  created_at: Timestamp;
  released_at?: Timestamp;
  refunded_at?: Timestamp;
  mercado_pago_payment_id?: string;
  notes?: string;
}

/**
 * Create escrow transaction when client pays
 * Holds the funds until project is marked complete
 */
export async function createEscrowTransaction(
  proposalId: string,
  projectId: string,
  clientId: string,
  freelancerId: string,
  amount: number,
  mercadoPagoPaymentId: string,
  feePercent: number = 0.04
): Promise<string> {
  const escrowFee = amount * feePercent;
  const netAmount = amount - escrowFee;

  const escrowRef = doc(collection(db, COLLECTIONS.ESCROW_TRANSACTIONS));

  const transaction: EscrowTransaction = {
    id: escrowRef.id,
    proposal_id: proposalId,
    project_id: projectId,
    client_id: clientId,
    freelancer_id: freelancerId,
    amount,
    escrow_fee_percent: feePercent,
    escrow_fee_amount: escrowFee,
    net_amount: netAmount,
    status: 'held',
    created_at: Timestamp.now(),
    mercado_pago_payment_id: mercadoPagoPaymentId,
  };

  await setDoc(escrowRef, transaction);
  return escrowRef.id;
}

/**
 * Release funds to freelancer after project is complete
 * Called when client confirms project is done
 */
export async function releaseEscrowFunds(escrowTransactionId: string): Promise<void> {
  const escrowRef = doc(db, COLLECTIONS.ESCROW_TRANSACTIONS, escrowTransactionId);
  const docSnap = await getDoc(escrowRef);

  if (!docSnap.exists()) {
    throw new Error('Escrow transaction not found');
  }

  const escrow = docSnap.data() as EscrowTransaction;

  if (escrow.status !== 'held') {
    throw new Error('Escrow transaction is not in held status');
  }

  // TODO: Integrar com Mercado Pago
  // 1. Transferir net_amount para conta do freelancer via Mercado Pago
  // 2. Guardar o transfer_id da MP
  // 3. Atualizar status pra 'released'

  await updateDoc(escrowRef, {
    status: 'released' as EscrowStatus,
    released_at: Timestamp.now(),
  });
}

/**
 * Refund to client if project is not completed
 */
export async function refundEscrow(
  escrowTransactionId: string,
  reason: string
): Promise<void> {
  const escrowRef = doc(db, COLLECTIONS.ESCROW_TRANSACTIONS, escrowTransactionId);
  const docSnap = await getDoc(escrowRef);

  if (!docSnap.exists()) {
    throw new Error('Escrow transaction not found');
  }

  const escrow = docSnap.data() as EscrowTransaction;

  // TODO: Integrar com Mercado Pago
  // 1. Reembolsar amount (completo) para conta do cliente
  // 2. Guardar refund_id da MP
  // 3. Atualizar status pra 'refunded'

  await updateDoc(escrowRef, {
    status: 'refunded' as EscrowStatus,
    refunded_at: Timestamp.now(),
    notes: reason,
  });
}

/**
 * Mark transaction as disputed (for customer service review)
 */
export async function disputeEscrow(
  escrowTransactionId: string,
  reason: string
): Promise<void> {
  const escrowRef = doc(db, COLLECTIONS.ESCROW_TRANSACTIONS, escrowTransactionId);

  await updateDoc(escrowRef, {
    status: 'disputed' as EscrowStatus,
    notes: reason,
  });
}

/**
 * Get escrow transaction details
 */
export async function getEscrowTransaction(
  escrowTransactionId: string
): Promise<EscrowTransaction | null> {
  const docSnap = await getDoc(doc(db, COLLECTIONS.ESCROW_TRANSACTIONS, escrowTransactionId));

  if (!docSnap.exists()) return null;
  return docSnap.data() as EscrowTransaction;
}

/**
 * Get all escrow transactions for a freelancer (received payments held in escrow)
 */
export async function getFreelancerEscrowTransactions(
  freelancerId: string
): Promise<EscrowTransaction[]> {
  const q = query(
    collection(db, COLLECTIONS.ESCROW_TRANSACTIONS),
    where('freelancer_id', '==', freelancerId)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as EscrowTransaction);
}

/**
 * Get all escrow transactions for a client (payments they've made)
 */
export async function getClientEscrowTransactions(
  clientId: string
): Promise<EscrowTransaction[]> {
  const q = query(
    collection(db, COLLECTIONS.ESCROW_TRANSACTIONS),
    where('client_id', '==', clientId)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as EscrowTransaction);
}

/**
 * Calculate total amount held in escrow (for dashboard)
 */
export async function getTotalEscrowHeld(freelancerId: string): Promise<number> {
  const transactions = await getFreelancerEscrowTransactions(freelancerId);
  return transactions
    .filter(t => t.status === 'held')
    .reduce((sum, t) => sum + t.net_amount, 0);
}

/**
 * Get escrow transaction by proposal ID
 */
export async function getEscrowByProposal(proposalId: string): Promise<EscrowTransaction | null> {
  const q = query(
    collection(db, COLLECTIONS.ESCROW_TRANSACTIONS),
    where('proposal_id', '==', proposalId)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length === 0) return null;

  return querySnapshot.docs[0].data() as EscrowTransaction;
}
