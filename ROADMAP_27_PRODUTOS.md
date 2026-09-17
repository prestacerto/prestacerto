# 🚀 ROADMAP 27 PRODUTOS — CERTO ECOSYSTEM

## STATUS: EM IMPLEMENTAÇÃO 🔨

**Data:** 2026-09-17  
**Objetivo:** Ir de R$ 0 → R$ 500k/mês em 4 meses  
**Tipo:** Ecossistema (não marketplace)

---

## 📊 ARQUITETURA COMPARTILHADA

### Base de Dados (Supabase)
```
certo_products (todas as 27 products)
├─ user_subscriptions (qual user tem qual product)
├─ usage_metrics (tracking de uso)
├─ product_analytics (dados de cada product)
└─ ecosystem_points (pontos/gamification)
```

### API Routes Pattern
```
/api/products/[productId]/calculate
/api/products/[productId]/analytics
/api/products/[productId]/webhook
```

### Frontend Pattern
```
/dashboard/[productId]/page.tsx
/dashboard/products/all
/dashboard/products/bundles
```

---

## 🎯 FASE 1 (SEMANA 1-2): TOP 3 + BASE

| # | Produto | Status | Receita | Complexidade |
|---|---------|--------|---------|--------------|
| 1 | **CERTO MATCH** | 🔨 | R$ 29k/mês | Alta |
| 2 | **CERTO PREÇO** | ⏳ | R$ 22k/mês | Média |
| 3 | **CERTO TIMING** | ⏳ | R$ 18k/mês | Média |

**Subtotal Fase 1:** R$ 69k/mês potencial

---

## 🧠 FASE 2 (SEMANA 3-6): INTELIGÊNCIA

| # | Produto | Status | Receita | Complexidade |
|---|---------|--------|---------|--------------|
| 4 | Dashboard IA | ⏳ | R$ 25k/mês | Média |
| 5 | Insights | ⏳ | R$ 30k/mês | Alta |
| 6 | Badge | ⏳ | R$ 25k/mês | Baixa |
| 7 | Certificação | ⏳ | R$ 60k/mês | Alta |
| 8 | Biblioteca Proposta | ⏳ | R$ 20k/mês | Média |
| 9 | Portfolio IA | ⏳ | R$ 15k/mês | Média |
| 10 | Follow-up IA | ⏳ | R$ 16k/mês | Média |
| 11 | Contra-proposta IA | ⏳ | R$ 14k/mês | Média |

**Subtotal Fase 2:** R$ 205k/mês acumulado

---

## 💼 FASE 3 (SEMANA 7-10): SEUS PRODUTOS

| # | Produto | Status | Receita | Complexidade |
|---|---------|--------|---------|--------------|
| 12 | Certo Currículo | ⏳ | R$ 25k/mês | Baixa |
| 13 | Escrow | ⏳ | R$ 25k/mês | Alta |
| 14 | Milestones | ⏳ | R$ 20k/mês | Alta |
| 15 | Analytics Cliente | ⏳ | R$ 10k/mês | Média |
| 16 | Contrato IA | ⏳ | R$ 12k/mês | Média |
| 17 | QA Automático | ⏳ | R$ 8k/mês | Alta |
| 18 | VIP | ⏳ | R$ 50k/mês | Média |
| 19 | Community | ⏳ | R$ 15k/mês | Média |

**Subtotal Fase 3:** R$ 365k/mês acumulado

---

## 🎓 FASE 4 (SEMANA 11-14): COMUNIDADE + BASE

| # | Produto | Status | Receita | Complexidade |
|---|---------|--------|---------|--------------|
| 20 | Academy | ⏳ | R$ 40k/mês | Alta |
| 21 | Templates | ⏳ | R$ 15k/mês | Baixa |
| 22 | Invoice | ⏳ | R$ 10k/mês | Baixa |
| 23 | Cold Email | ⏳ | R$ 40k/mês | Média |
| 24 | Tax | 🔨 | R$ 150k/mês | Média |
| 25 | Certo Destaque | ⏳ | R$ 30k/mês | Baixa |
| 26 | Certo Candidato | ⏳ | R$ 20k/mês | Baixa |
| 27 | Certo Premium | ⏳ | R$ 35k/mês | Baixa |

**Subtotal Fase 4:** R$ 745k/mês acumulado (projeção conservadora)

---

## 🌐 ECOSSISTEMA (MÊS 5+)

- [ ] CERTO TOKENS (gamification)
- [ ] CERTO GUILD (agrupamentos por skill)
- [ ] CERTO REFERRAL (indicações)
- [ ] CERTO PARTNER (integrações)

**Projeção:** R$ 500k-1M/mês

---

## 🛠️ STATUS IMPLEMENTAÇÃO

### Completos (🟢)
- [ ] Arquitetura base (schemas)
- [ ] Auth system (reutilizar de PrestaCerto)
- [ ] Payment system (Stripe/MP)

### Em Progresso (🔨)
- [x] CERTO TAX (estrutura criada)

### Não Iniciado (⏳)
- [ ] 26 produtos restantes

---

## 💾 PRÓXIMOS PASSOS

1. ✅ Finalizar CERTO TAX
2. ⏳ Implementar CERTO MATCH
3. ⏳ Implementar CERTO PREÇO
4. ⏳ Implementar CERTO TIMING
5. ... (24 mais)

---

**Última atualização:** 2026-09-17  
**Próxima review:** Após implementação Fase 1
