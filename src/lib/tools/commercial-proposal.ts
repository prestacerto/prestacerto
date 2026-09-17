import { z } from 'zod';

export const proposalItemSchema = z.object({
  description: z.string().trim().min(2, 'Descreva cada entrega.').max(180),
  quantity: z.number().int().min(1).max(1000),
  unitPrice: z.number().finite().min(0.01, 'Informe o valor de cada entrega.').max(999999.99)
    .refine(n => Math.abs(n * 100 - Math.round(n * 100)) < 0.00001, 'Use até duas casas decimais.'),
});

const proposalFields = z.object({
  provider: z.string().trim().min(2, 'Informe seu nome ou o nome da empresa.').max(100),
  client: z.string().trim().min(2, 'Informe o nome do cliente.').max(100),
  title: z.string().trim().min(5, 'Dê um título para a proposta.').max(120),
  scope: z.string().trim().min(20, 'Descreva o escopo com pelo menos 20 caracteres.').max(4000),
  items: z.array(proposalItemSchema).min(1).max(12),
  deliveryDays: z.number().int().min(1).max(730),
  validDays: z.number().int().min(1).max(90),
  paymentNotes: z.string().trim().min(5, 'Informe as condições de pagamento.').max(1000),
});
export const commercialProposalSchema = proposalFields.refine(p => proposalTotalCents(p.items) <= 9999999999, 'O valor total excede o limite da ferramenta.');

export type CommercialProposal = z.infer<typeof commercialProposalSchema>;
export type ProposalItem = z.infer<typeof proposalItemSchema>;
export const brandColors = { blue: '#2454e8', navy: '#142d53', green: '#14705a' } as const;
export type BrandColor = keyof typeof brandColors;
export const exportSchema = z.object({
  proposal: commercialProposalSchema,
  variant: z.enum(['standard', 'brand']).default('standard'),
  color: z.enum(['blue', 'navy', 'green']).default('blue'),
});
export const proposalStatuses = { draft: 'Rascunho', sent: 'Enviada', approved: 'Aprovada', declined: 'Não aprovada' } as const;
export type ProposalStatus = keyof typeof proposalStatuses;

export function proposalTotalCents(items: ProposalItem[]) {
  return items.reduce((sum, item) => sum + Math.round(item.unitPrice * 100) * item.quantity, 0);
}
export function formatMoney(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}
export function canUseBrandedProposal(plan: unknown) { return plan === 'pro' || plan === 'business'; }
export function saoPauloDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
function validCalendarDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
}
export const savedProposalSchema = z.object({
  id: z.string().uuid(), proposal: commercialProposalSchema,
  status: z.enum(['draft', 'sent', 'approved', 'declined']),
  followUp: z.string().refine(value => value === '' || validCalendarDate(value)),
  updatedAt: z.string().datetime(),
});
export type SavedProposal = z.infer<typeof savedProposalSchema>;
export const editorDraftSchema = z.object({
  proposal: proposalFields.extend({
    provider: z.string().max(100), client: z.string().max(100), title: z.string().max(120), scope: z.string().max(4000), paymentNotes: z.string().max(1000),
    items: z.array(proposalItemSchema.extend({ description: z.string().max(180), quantity: z.number().int().min(0).max(1000), unitPrice: z.number().finite().min(0).max(999999.99) })).min(1).max(12),
    deliveryDays: z.number().int().min(0).max(730), validDays: z.number().int().min(0).max(90),
  }),
  activeId: z.string().uuid().nullable(), status: savedProposalSchema.shape.status,
  followUp: savedProposalSchema.shape.followUp,
});
export function parseProposalLibrary(raw: string | null): SavedProposal[] {
  if (!raw || raw.length > 500000) return [];
  try {
    const list: unknown = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.slice(0, 30).flatMap(value => { const parsed = savedProposalSchema.safeParse(value); return parsed.success ? [parsed.data] : []; });
  } catch { return []; }
}
export function followUpsDue(items: SavedProposal[], today: string) {
  return items.filter(item => item.status === 'sent' && item.followUp !== '' && item.followUp <= today);
}
export function proposalAsText(p: CommercialProposal) {
  return [
    `PROPOSTA COMERCIAL — ${p.title}`, `De: ${p.provider}`, `Para: ${p.client}`,
    '', 'OBJETIVO E ESCOPO', p.scope, '', 'ENTREGAS E INVESTIMENTO',
    ...p.items.map(item => `${item.description} | ${item.quantity} × ${formatMoney(Math.round(item.unitPrice * 100))} = ${formatMoney(Math.round(item.unitPrice * 100) * item.quantity)}`),
    `Total: ${formatMoney(proposalTotalCents(p.items))}`, '',
    `Prazo: ${p.deliveryDays} dias corridos após aprovação e recebimento dos materiais necessários.`,
    `Proposta válida por ${p.validDays} dias a partir do envio.`, '',
    'CONDIÇÕES DE PAGAMENTO', p.paymentNotes, '',
    'PRÓXIMO PASSO', 'Confirme o escopo, o prazo e o investimento com o profissional para iniciar.',
  ].join('\n');
}
export function blankProposal(): CommercialProposal {
  return { provider: '', client: '', title: '', scope: '', items: [{ description: '', quantity: 1, unitPrice: 0 }], deliveryDays: 15, validDays: 7, paymentNotes: '' };
}
export const proposalTemplates = [
  { id: 'website', name: 'Site & tecnologia', title: 'Desenvolvimento de site', scope: 'Desenvolvimento de um site para apresentar o negócio e facilitar o contato com os clientes. Descreva aqui as páginas, funcionalidades, materiais necessários e o número de revisões incluídas.', delivery: 'Desenvolvimento do site' },
  { id: 'design', name: 'Design & marca', title: 'Criação de identidade visual', scope: 'Criação de uma identidade visual alinhada ao posicionamento do negócio. Especifique as peças, os formatos de entrega, as etapas de aprovação e o número de revisões incluídas.', delivery: 'Identidade visual' },
  { id: 'marketing', name: 'Marketing & conteúdo', title: 'Produção de conteúdo', scope: 'Planejamento e produção de conteúdo para os canais do cliente. Defina os canais, a quantidade de peças, o período de trabalho e o processo de aprovação. Informe separadamente se há verba de mídia.', delivery: 'Pacote de conteúdo' },
  { id: 'service', name: 'Outros serviços', title: 'Prestação de serviço', scope: 'Descreva o resultado esperado, o que está incluído no serviço, as responsabilidades de cada parte e o que será entregue. Especifique materiais, deslocamentos e revisões, quando aplicável.', delivery: 'Execução do serviço' },
] as const;
