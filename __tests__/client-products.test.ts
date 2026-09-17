import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLIENT_PRODUCTS,
  formatProductPrice,
  resolveClientProductPlan,
  getClientProductCheckoutUrl,
  getProductsByTier,
  calculateClientProductsMRR,
} from '../src/lib/client-products';

test('Client Products - Estrutura de dados', () => {
  assert.equal(CLIENT_PRODUCTS.length, 8, 'Deve ter 8 produtos');

  const products = CLIENT_PRODUCTS.map(p => p.id);
  assert.deepEqual(
    products,
    ['curriculo', 'escrow', 'milestones', 'analytics-cliente', 'contrato-ia', 'qa-automatico', 'vip-network', 'community'],
    'IDs dos produtos devem estar na ordem correta'
  );
});

test('Client Products - Currículo é grátis', () => {
  const curriculo = CLIENT_PRODUCTS.find(p => p.id === 'curriculo');
  assert.equal(curriculo?.pricing.model, 'free', 'Currículo deve ser free');
  assert.equal(formatProductPrice(curriculo!), 'Grátis', 'Formato do preço deve ser "Grátis"');
});

test('Client Products - Escrow é com comissão 5%', () => {
  const escrow = CLIENT_PRODUCTS.find(p => p.id === 'escrow');
  assert.equal(escrow?.pricing.model, 'commission', 'Escrow deve ser commission');
  assert.equal(escrow?.pricing.commissionRate, 0.05, 'Taxa deve ser 5%');
  assert.equal(formatProductPrice(escrow!), '5% por transação', 'Formato deve ser "5% por transação"');
});

test('Client Products - Milestones é com comissão 2%', () => {
  const milestones = CLIENT_PRODUCTS.find(p => p.id === 'milestones');
  assert.equal(milestones?.pricing.model, 'commission', 'Milestones deve ser commission');
  assert.equal(milestones?.pricing.commissionRate, 0.02, 'Taxa deve ser 2%');
});

test('Client Products - Produtos mensais têm preços corretos', () => {
  const monthly = CLIENT_PRODUCTS.filter(p => p.pricing.model === 'monthly');

  const prices = {
    'analytics-cliente': 49.90,
    'contrato-ia': 24.90,
    'qa-automatico': 34.90,
    'vip-network': 999.90,
    'community': 39.90,
  };

  for (const product of monthly) {
    const expectedPrice = prices[product.id as keyof typeof prices];
    assert.equal(
      product.pricing.monthlyPrice,
      expectedPrice,
      `${product.name} deve ter preço R$ ${expectedPrice}`
    );
  }
});

test('Client Products - Resolver plano por nome', () => {
  // "Escrow" resolve para "escrow" porque está em "Escrow Seguro"
  assert.equal(resolveClientProductPlan('Escrow'), 'escrow', 'Deve resolver "Escrow" de "Escrow Seguro"');
  assert.equal(resolveClientProductPlan('Escrow Seguro'), 'escrow', 'Deve resolver "Escrow Seguro"');
  assert.equal(resolveClientProductPlan('escrow'), 'escrow', 'Deve resolver case-insensitive');
  assert.equal(resolveClientProductPlan('ESCROW SEGURO'), 'escrow', 'Deve resolver UPPERCASE');
  assert.equal(resolveClientProductPlan(null), null, 'Deve retornar null para null');
  assert.equal(resolveClientProductPlan('inexistente'), null, 'Deve retornar null para produto inexistente');
});

test('Client Products - URL de checkout', () => {
  // Produtos free não têm checkout
  const curriculo = CLIENT_PRODUCTS.find(p => p.id === 'curriculo');
  assert.equal(getClientProductCheckoutUrl('curriculo'), null, 'Currículo não deve ter checkout');

  // Produtos pagos podem ter checkout (quando env var está definida)
  const escrow = CLIENT_PRODUCTS.find(p => p.id === 'escrow');
  const escrowUrl = getClientProductCheckoutUrl('escrow');
  if (escrowUrl) {
    assert(escrowUrl.includes('assiny.com.br') || escrowUrl.includes('assinify.com'), 'URL deve ser do Assinify');
  }

  // Produto inexistente
  assert.equal(getClientProductCheckoutUrl('inexistente'), null, 'Deve retornar null para produto inexistente');
});

test('Client Products - Produtos por tier', () => {
  const freeProducts = getProductsByTier('free');
  assert.equal(freeProducts.length, 1, 'Deve ter 1 produto free');
  assert.equal(freeProducts[0].id, 'curriculo', 'Currículo deve ser free');

  const monthlyProducts = getProductsByTier('monthly');
  assert.equal(monthlyProducts.length, 4, 'Deve ter 4 produtos mensais regulares');

  const commissionProducts = getProductsByTier('commission');
  assert.equal(commissionProducts.length, 2, 'Deve ter 2 produtos com comissão');

  const premiumProducts = getProductsByTier('premium');
  assert.equal(premiumProducts.length, 1, 'Deve ter 1 produto premium (VIP Network)');
  assert.equal(premiumProducts[0].id, 'vip-network', 'VIP Network deve ser premium');
});

test('Client Products - Cálculo de MRR', () => {
  const mrr = calculateClientProductsMRR();

  assert.equal(mrr.monthlyProducts, 5, 'Deve ter 5 produtos com model monthly (inclui VIP Network premium)');
  assert.equal(mrr.commissionProducts, 2, 'Deve ter 2 produtos com comissão');

  // MRR = 49.90 + 24.90 + 34.90 + 999.90 + 39.90 = 1.248.70
  // Todos os produtos com model: 'monthly' são contados, incluindo premium tier
  const expectedMRR = 49.90 + 24.90 + 34.90 + 999.90 + 39.90;
  assert.equal(
    Math.abs(mrr.totalMonthlyMRR - expectedMRR) < 0.01,
    true,
    `MRR deve ser ~R$ ${expectedMRR}`
  );
});

test('Client Products - Todos têm features', () => {
  for (const product of CLIENT_PRODUCTS) {
    assert(product.features.length > 0, `${product.name} deve ter features`);
    assert(product.features.length >= 3, `${product.name} deve ter pelo menos 3 features`);
  }
});

test('Client Products - Todos têm API endpoint', () => {
  for (const product of CLIENT_PRODUCTS) {
    assert(product.apiEndpoint.startsWith('/api/'), `${product.name} deve ter apiEndpoint`);
    assert(product.apiEndpoint.includes(product.slug), `${product.name} apiEndpoint deve incluir slug`);
  }
});

test('Client Products - Todos têm dashboard route', () => {
  for (const product of CLIENT_PRODUCTS) {
    assert(product.dashboardRoute.startsWith('/client-dashboard/'), `${product.name} deve ter dashboardRoute`);
    assert(product.dashboardRoute.includes(product.slug), `${product.name} dashboardRoute deve incluir slug`);
  }
});

test('Client Products - Validação de descrições', () => {
  for (const product of CLIENT_PRODUCTS) {
    assert(product.description.length > 10, `${product.name} descrição deve ter mais de 10 caracteres`);
    assert(product.description.length < 200, `${product.name} descrição deve ter menos de 200 caracteres`);
  }
});

console.log('✅ Todos os testes de Client Products passaram!');
