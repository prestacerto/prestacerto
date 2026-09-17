# FASE 2 LAUNCH — 8 Produtos IA no Assinify
**Data:** 17 de setembro, 2026  
**Status:** Implementação Iniciada  
**Objetivo:** 8 produtos LIVE com checkout no Assinify  

---

## LISTA DE PRODUTOS (8 TOTAIS)

| # | Nome | Preço | Tipo | ID do Produto |
|----|------|-------|------|---------------|
| 1 | Dashboard IA | R$ 49,90 | Mensalidade | `dashboard-ia` |
| 2 | Certo Insights | R$ 24,90 | Mensalidade | `insights` |
| 3 | Certo Badge | R$ 19,90 | Mensalidade | `badge` |
| 4 | Certo Certificação | R$ 29,90 | Valor Único | `certificacao` |
| 5 | Biblioteca de Propostas IA | R$ 19,90 | Mensalidade | `biblioteca-proposta` |
| 6 | Certo Portfolio IA | R$ 12,90 | Mensalidade | `portfolio-ia` |
| 7 | Certo Follow-up IA | R$ 12,90 | Mensalidade | `followup-ia` |
| 8 | Certo Contra-proposta IA | R$ 9,90 | Mensalidade | `contra-proposta-ia` |

**MRR Estimado:** R$ 149,30/produto × usuários = R$ 149,30 por usuário ativo  
**One-time Certificação:** R$ 29,90 por venda  

---

## PASSO-A-PASSO DE IMPLEMENTAÇÃO

### FASE 1: Criar Produtos no Assinify (30 min)

1. **Acesse o painel:** https://admin.assiny.com.br/login
2. **Navegue para:** Produto → PrestaCerto → Ofertas
3. **Para CADA produto abaixo, clique em "Criar Nova Oferta":**

#### TEMPLATE PARA CADA PRODUTO

```
Nome: [conforme tabela acima]
Descrição: [vide seção DESCRIÇÕES]
Preço: R$ [conforme tabela]
Recorrência: [Mensal OU Única]
Moeda: BRL
```

---

## DESCRIÇÕES DOS PRODUTOS

### 1. Dashboard IA
**Preço:** R$ 49,90/mês  
**Descrição:** Analytics completo com recomendações inteligentes de propostas  
**Features:**
- Analytics em tempo real
- Recomendações de propostas por skill
- ROI por skill com gráficos
- Relatórios mensais exportáveis
- Benchmark contra freelancers da sua região

### 2. Certo Insights  
**Preço:** R$ 24,90/mês  
**Descrição:** Market intelligence — skills em alta, tendências e análise de competição  
**Features:**
- Skills em alta demanda em tempo real
- Análise de competição por skill
- Preços recomendados do mercado
- Alertas de oportunidades quentes
- Relatório semanal de trends

### 3. Certo Badge
**Preço:** R$ 19,90/mês  
**Descrição:** Badges verificados que aumentam confiança (Verified, Top, Quality)  
**Features:**
- Badge Verified Developer
- Badge Top Developer  
- Badge Quality Work
- Destaque no perfil com selo verificado
- Validação mensal automática

### 4. Certo Certificação
**Preço:** R$ 29,90 (valor único)  
**Descrição:** Certificação permanente de skills, válida por 24 meses  
**Features:**
- Certificado verificado emitido por PrestaCerto
- Visível por 24 meses
- Compartilhável em LinkedIn e redes
- Download em PDF customizável
- Sem renovação necessária

### 5. Biblioteca de Propostas IA
**Preço:** R$ 19,90/mês  
**Descrição:** Arquivo de propostas vencedoras + 500+ templates IA por skill  
**Features:**
- Propostas vencedoras filtradas por skill
- 500+ templates inteligentes
- Busca por cliente/setor/projeto
- Análise de sucesso (taxa de ganho)
- Download em PDF e Word

### 6. Certo Portfolio IA
**Preço:** R$ 12,90/mês  
**Descrição:** Portfolio automático gerado por IA, atualizado continuamente  
**Features:**
- Geração automática a partir de projetos
- Atualização contínua conforme trabalho novo
- 10+ temas profissionais
- URL customizada (seu-portfolio.prestacerto.com)
- Analytics de visitantes

### 7. Certo Follow-up IA
**Preço:** R$ 12,90/mês  
**Descrição:** Sequência automática inteligente de contatos após propostas  
**Features:**
- Automação de seguimentos com IA
- Timing inteligente (qual hora enviar)
- Personalização automática por cliente
- Rastreamento de respostas
- Relatório de conversão por campanhas

### 8. Certo Contra-proposta IA
**Preço:** R$ 9,90/mês  
**Descrição:** Gerador de contra-ofertas com análise de mercado  
**Features:**
- Análise de mercado em tempo real
- Contra-ofertas sugeridas automaticamente
- Assistência em negociação (tática + linguagem)
- Histórico de negociações
- Sugestão de preço dinâmico com IA

---

## FASE 2: Coletar Links de Checkout (15 min)

Após criar CADA produto no Assinify:

1. **Copie o link de checkout** (formato: `https://pay.assiny.com.br/{account_id}/node/{product_id}`)
2. **Cole em `.env.local` com este formato:**

```bash
# Env vars para FASE 2 (copie e cole após criar os produtos no Assinify)

# Dashboard IA
NEXT_PUBLIC_ASSINY_DASHBOARD_IA=https://pay.assiny.com.br/ACCOUNT_ID/node/PRODUCT_ID

# Certo Insights
NEXT_PUBLIC_ASSINY_INSIGHTS=https://pay.assiny.com.br/ACCOUNT_ID/node/PRODUCT_ID

# Certo Badge
NEXT_PUBLIC_ASSINY_BADGE=https://pay.assiny.com.br/ACCOUNT_ID/node/PRODUCT_ID

# Certo Certificação
NEXT_PUBLIC_ASSINY_CERTIFICACAO=https://pay.assiny.com.br/ACCOUNT_ID/node/PRODUCT_ID

# Biblioteca de Propostas IA
NEXT_PUBLIC_ASSINY_BIBLIOTECA_PROPOSTA=https://pay.assiny.com.br/ACCOUNT_ID/node/PRODUCT_ID

# Certo Portfolio IA
NEXT_PUBLIC_ASSINY_PORTFOLIO_IA=https://pay.assiny.com.br/ACCOUNT_ID/node/PRODUCT_ID

# Certo Follow-up IA
NEXT_PUBLIC_ASSINY_FOLLOWUP_IA=https://pay.assiny.com.br/ACCOUNT_ID/node/PRODUCT_ID

# Certo Contra-proposta IA
NEXT_PUBLIC_ASSINY_CONTRA_PROPOSTA_IA=https://pay.assiny.com.br/ACCOUNT_ID/node/PRODUCT_ID
```

---

## FASE 3: Deploy e Validação (10 min)

1. **Copie todas as env vars para Vercel:**
   - Dashboard Vercel → Settings → Environment Variables
   - Cole as 8 env vars
   - Redeploy

2. **Teste os links:**
   - Acesse: `/admin/fase2/produtos`
   - Verifique que todos os 8 produtos mostram "✓ Ativo"
   - Clique em cada link para validar que abre o Assinify

3. **Teste checkout:**
   - Clique em um link de produto
   - Preencha formulário no Assinify
   - Valide que webhook chega em `/api/webhooks/assinify`

---

## CHECKLIST DE CONCLUSÃO

- [ ] 8 produtos criados no Assinify
- [ ] 8 links de checkout coletados
- [ ] 8 env vars adicionadas a `.env.local`
- [ ] Redeploy feito em Vercel
- [ ] Dashboard `/admin/fase2/produtos` mostra 8 produtos "✓ Ativo"
- [ ] Cada link abre checkout no Assinify
- [ ] Webhook funcionando (teste 1 compra sintética)

---

## PRÓXIMAS FASES

### FASE 3: Marketing + Landpage
- [ ] Criar seção FASE 2 na home
- [ ] Email campaign anunciando os 8 produtos
- [ ] Google Ads segmentado por produto

### FASE 4: Integração + Features
- [ ] Implementar lógica de cada dashboard (PHASE 3 dev)
- [ ] Ativar acesso aos features após pagamento
- [ ] Analytics de uso

### FASE 5: Scaling
- [ ] A/B testing de preços
- [ ] Bundles (combos de produtos com desconto)
- [ ] Upsell automático

---

## LINKS ÚTEIS

- **Painel Assiny:** https://admin.assiny.com.br/login
- **Docs:** https://assiny.gitbook.io/assiny-docs
- **Dashboard Admin PrestaCerto:** `/admin/fase2/produtos`
- **Checkout Test:** https://pay.assiny.com.br

---

**Responsável:** Cadu  
**Deadline:** 17/set/2026 (hoje)  
**Status:** Em andamento ⏳
