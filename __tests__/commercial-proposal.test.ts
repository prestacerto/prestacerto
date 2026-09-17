import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
import { blankProposal, canUseBrandedProposal, commercialProposalSchema, editorDraftSchema, exportSchema, followUpsDue, parseProposalLibrary, proposalAsText, proposalTotalCents, saoPauloDate, type CommercialProposal, type SavedProposal } from '../src/lib/tools/commercial-proposal';
import { createProposalPdf } from '../src/lib/tools/proposal-pdf';

const sample: CommercialProposal = {
  provider: 'Estúdio Ação', client: 'Clínica São João', title: 'Site institucional com agendamento',
  scope: 'Criação de um site responsivo com cinco páginas e formulário de contato. Inclui duas rodadas de revisão e publicação. O cliente fornece textos, fotos e acesso à hospedagem.',
  items: [{ description: 'Design e desenvolvimento do site', quantity: 1, unitPrice: 2500.50 }, { description: 'Página adicional', quantity: 2, unitPrice: 350.25 }],
  deliveryDays: 20, validDays: 7, paymentNotes: '50% na aprovação da proposta e 50% na entrega. Pagamento via Pix, conforme combinado com o cliente.',
};
const saved: SavedProposal = { id: '16e48cfe-3369-4c0e-87b6-8b72b42f75bf', proposal: sample, status: 'sent', followUp: '2026-09-08', updatedAt: '2026-09-08T12:00:00.000Z' };

test('total em centavos mantém quantidades e centavos sem arredondamentos financeiros incorretos', () => {
  assert.equal(proposalTotalCents(sample.items), 320100);
  assert.equal(proposalTotalCents([{ description: 'Teste', quantity: 3, unitPrice: .1 }]), 30);
  assert.match(proposalAsText(sample), /3\.201,00/);
});
test('documento rejeita valores negativos, fracionados indevidos, infinito, total excessivo e escopo vazio', () => {
  assert.equal(commercialProposalSchema.safeParse(sample).success, true);
  for (const unitPrice of [-1, 0, .001, Infinity, NaN]) assert.equal(commercialProposalSchema.safeParse({ ...sample, items: [{ ...sample.items[0], unitPrice }] }).success, false);
  assert.equal(commercialProposalSchema.safeParse({ ...sample, items: [{ ...sample.items[0], quantity: 1000, unitPrice: 999999 }] }).success, false);
  assert.equal(commercialProposalSchema.safeParse({ ...sample, scope: '' }).success, false);
});
test('recurso de marca aceita apenas planos existentes Pro e Business, sem confiar em sinal do pedido', () => {
  for (const plan of ['free', null, undefined, 'admin', true, { plan: 'pro' }]) assert.equal(canUseBrandedProposal(plan), false);
  for (const plan of ['pro', 'business']) assert.equal(canUseBrandedProposal(plan), true);
  assert.deepEqual(exportSchema.parse({ proposal: sample, paid: true, plan: 'pro' }), { proposal: sample, variant: 'standard', color: 'blue' });
  assert.equal(exportSchema.safeParse({ proposal: sample, variant: 'anything' }).success, false);
});
test('biblioteca valida dados locais, datas reais e tamanho; lembrete considera apenas enviada com data vencida', () => {
  assert.equal(parseProposalLibrary('invalid').length, 0);
  assert.equal(parseProposalLibrary(JSON.stringify([{ ...saved, followUp: '2026-02-30' }, saved])).length, 1);
  assert.equal(parseProposalLibrary(JSON.stringify(Array(40).fill(saved))).length, 30);
  assert.equal(followUpsDue([saved, { ...saved, status: 'approved' }, { ...saved, followUp: '2026-09-09' }, { ...saved, followUp: '' }], '2026-09-08').length, 1);
  assert.equal(saoPauloDate(new Date('2026-09-09T01:00:00Z')), '2026-09-08');
});
test('rascunho incompleto pode ser restaurado, mas não exportado como proposta pronta', () => {
  const draft = { proposal: blankProposal(), activeId: null, status: 'draft', followUp: '' };
  assert.equal(editorDraftSchema.safeParse(draft).success, true);
  assert.equal(commercialProposalSchema.safeParse(draft.proposal).success, false);
});
test('PDF gratuito e PDF de marca geram documentos válidos; texto longo usa múltiplas páginas', async () => {
  const free = await createProposalPdf(sample);
  const brand = await createProposalPdf(sample, true, 'navy');
  const large = await createProposalPdf({ ...sample, scope: 'Escopo detalhado, revisão e entrega. '.repeat(100), items: Array.from({ length: 12 }, (_, i) => ({ description: `Entrega ${i + 1}: ${'Detalhes do serviço '.repeat(8)}`, quantity: 1, unitPrice: 100 })) });
  const freeDoc = await PDFDocument.load(free), brandDoc = await PDFDocument.load(brand), largeDoc = await PDFDocument.load(large);
  assert.equal(freeDoc.getTitle(), sample.title);
  assert.equal(freeDoc.getAuthor(), 'Estúdio Ação');
  assert.match(freeDoc.getCreator() || '', /PrestaCerto/);
  assert.doesNotMatch(brandDoc.getCreator() || '', /PrestaCerto/);
  assert.ok(largeDoc.getPageCount() > 1);
  await writeFile('/tmp/prestacerto-proposta-exemplo.pdf', free);
  await writeFile('/tmp/prestacerto-proposta-marca.pdf', brand);
  await writeFile('/tmp/prestacerto-proposta-longa.pdf', large);
});
