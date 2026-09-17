#!/usr/bin/env node

/**
 * Script para gerar URLs de checkout Assinify para os 8 produtos FASE 3
 *
 * USO:
 *   node scripts/generate-assinify-links.js
 *
 * OUTPUT:
 *   Exibe template .env com as variáveis configuradas
 *
 * PRÓXIMO PASSO:
 *   1. Acessar https://admin.assiny.com.br/login
 *   2. Para cada produto, criar uma oferta (offer)
 *   3. Copiar o link do checkout público
 *   4. Colar o link no template gerado abaixo
 */

const products = [
  {
    env: 'NEXT_PUBLIC_ASSINY_CHECKOUT_ESCROW',
    name: 'Escrow',
    price: '5% comissão',
    description: 'Sistema de escrow para transações seguras',
  },
  {
    env: 'NEXT_PUBLIC_ASSINY_CHECKOUT_MILESTONES',
    name: 'Milestones',
    price: '2% comissão',
    description: 'Gerenciador de milestones de projeto',
  },
  {
    env: 'NEXT_PUBLIC_ASSINY_CHECKOUT_ANALYTICS_CLIENTE',
    name: 'Analytics Cliente',
    price: 'R$ 49,90/mês',
    description: 'Dashboard de analytics para clientes',
  },
  {
    env: 'NEXT_PUBLIC_ASSINY_CHECKOUT_CONTRATO_IA',
    name: 'Contrato IA',
    price: 'R$ 24,90/mês',
    description: 'Geração de contratos com IA',
  },
  {
    env: 'NEXT_PUBLIC_ASSINY_CHECKOUT_QA_AUTOMATICO',
    name: 'QA Automático',
    price: 'R$ 34,90/mês',
    description: 'Testes automáticos e QA',
  },
  {
    env: 'NEXT_PUBLIC_ASSINY_CHECKOUT_VIP_NETWORK',
    name: 'VIP Network',
    price: 'R$ 999,90/mês',
    description: 'Rede exclusiva de professionals VIP',
  },
  {
    env: 'NEXT_PUBLIC_ASSINY_CHECKOUT_COMMUNITY',
    name: 'Community Pro',
    price: 'R$ 39,90/mês',
    description: 'Comunidade profissional com benefícios',
  },
];

console.log('═══════════════════════════════════════════════════════════════');
console.log('   ASSINIFY - GERAR LINKS DE CHECKOUT PARA FASE 3');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('INSTRUÇÃO: Acessar https://admin.assiny.com.br/login\n');
console.log('Organização: SIMA MIDIAS LTDA');
console.log('Projeto: Sima Midias\n');

console.log('Para cada produto abaixo:\n');
console.log('1. Criar novo "Offer" (oferta)');
console.log('2. Configurar nome, preço e recorrência');
console.log('3. Copiar link do checkout público');
console.log('4. Colar na variável ENV correspondente\n');

console.log('═══════════════════════════════════════════════════════════════\n');

products.forEach((product, idx) => {
  console.log(`${idx + 1}. ${product.name}`);
  console.log(`   Preço: ${product.price}`);
  console.log(`   Descrição: ${product.description}`);
  console.log(`   ENV VAR: ${product.env}`);
  console.log(`   Padrão: https://pay.assiny.com.br/{account_id}/node/{offer_id}\n`);
});

console.log('═══════════════════════════════════════════════════════════════\n');
console.log('TEMPLATE .ENV.LOCAL (copie e preencha)\n');

console.log('# FASE 3: Client Products - Assinify Links');
console.log('# Gerado: ' + new Date().toISOString() + '\n');

products.forEach((product) => {
  console.log(`${product.env}=https://pay.assiny.com.br/{account_id}/node/{offer_id}`);
});

console.log('\n═══════════════════════════════════════════════════════════════\n');

console.log('CHECKLIST:\n');
products.forEach((product, idx) => {
  console.log(`[ ] ${idx + 1}. ${product.name} - ${product.price}`);
});

console.log('\n═══════════════════════════════════════════════════════════════\n');

console.log('DEPOIS DE PREENCHER:');
console.log('1. Copiar variáveis para .env.local');
console.log('2. Copiar variáveis para Vercel (Project Settings > Environment Variables)');
console.log('3. Fazer deploy: git push ou vercel --prod');
console.log('4. Testar links em /client-products');
console.log('\n');
