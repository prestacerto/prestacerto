import { z } from 'zod';

export const milestoneSchema = z.object({
  title: z.string().trim().min(2).max(120),
  amount: z.number().nonnegative().max(10_000_000).nullable(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
});

export const agreementInputSchema = z.object({
  scope: z.string().trim().max(4000),
  totalAmount: z.number().nonnegative().max(10_000_000).nullable(),
  deadlineDays: z.number().int().min(1).max(3650).nullable(),
  paymentTerms: z.string().trim().max(2000),
  milestones: z.array(milestoneSchema).max(30),
});

export type AgreementInput = z.infer<typeof agreementInputSchema>;
export type Milestone = z.infer<typeof milestoneSchema>;

export type AgreementRow = {
  id: string;
  proposal_id: string;
  project_id: string;
  client_id: string;
  freelancer_id: string;
  scope: string;
  total_amount: number | string | null;
  deadline_days: number | null;
  payment_terms: string;
  milestones: Milestone[];
  version: number;
  client_accepted_at: string | null;
  freelancer_accepted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Agreement = Omit<AgreementRow, 'total_amount'> & { total_amount: number | null };

export function normalizeAgreement(row: AgreementRow): Agreement {
  return {
    ...row,
    total_amount: row.total_amount === null ? null : Number(row.total_amount),
    milestones: Array.isArray(row.milestones) ? row.milestones : [],
  };
}

// Tabela ausente = migration 20260918233000 ainda não aplicada. Não é erro do usuário.
export function isMissingAgreementTable(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return error.code === '42P01' || error.code === 'PGRST202' || /project_agreements|save_project_agreement|ensure_project_agreement|accept_project_agreement/.test(error.message ?? '') && /does not exist|not find|schema cache/i.test(error.message ?? '');
}
