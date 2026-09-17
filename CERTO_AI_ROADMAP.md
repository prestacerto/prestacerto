# 🚀 CERTO AI — Roadmap Executivo (14 semanas)

## 📊 VISÃO: R$ 349k/mês (19 produtos)

PrestaCerto vai de **marketplace** para **ECOSSISTEMA de IA invisível**

---

## 🎯 FASE 1: MVP (AGORA) — CERTO AI
**Duração**: 1 semana | **Receita**: R$ 35k/mês

### ✅ PRONTO:
- Landing page pública (/certo-ai)
- Dashboard privado (/dashboard/certo-ai)
- API /api/ai/optimize-proposal
- Database schema
- Email + Push notifications
- System prompt invisível

### 🔧 PRÓXIMOS PASSOS:
1. Rodar SQL migrations no Supabase
2. Testar em produção (prestacerto.onrender.com)
3. Launch: Email pra base de 5k freelancers
4. Ads pagos: Google + Meta (R$ 500/semana)

### 💰 RECEITA:
- Grátis: 3 otimizações/mês (acquisition)
- Premium: R$ 19,90/mês (500 users = R$ 9.950/mês)
- Enterprise: Custom (50 users × R$ 99/mês = R$ 4.950/mês)
- **TOTAL: R$ 35k/mês**

### 📈 MÉTRICAS A RASTREAR:
- Visitantes landing: 10k+
- CTR "Começar Grátis": 25%+
- Conversão Free → Premium: 30%+
- Retention Mês 1: 75%+

---

## 🎯 FASE 2: QUICK WINS (Semanas 3-4) — Insights + Match + Follow-up
**Duração**: 2 semanas | **Receita Adicional**: +R$ 73k = **R$ 108k/mês**

### #2 CERTO INSIGHTS (Data Analytics)
**Preço**: R$ 24,90/mês | **Receita**: +R$ 30k/mês

**O QUE FAZ**:
```
Analisa TODO marketplace e retorna:
├─ Skills trending (Python +340% em demanda)
├─ Salários médios por skill/city
├─ Concorrência por skill
├─ Melhor nicho pra entrar
└─ Previsão de demanda (próximos 3 meses)
```

**IMPLEMENTAÇÃO**:
1. Query SQL: Agregar dados de propostas
2. IA: Processar tendências
3. UI: Card de insights no dashboard
4. Notificação: "Python em alta! Aprenda AGORA"

**VALOR PRO LEAD**:
- "Saiba qual skill escolher pra ganhar MAIS"
- Cria urgência: "FastAPI tá virando, aprenda agora"
- Motiva improvement

---

### #3 CERTO MATCH (Project Matching)
**Preço**: R$ 2,90 por proposta | **Receita**: +R$ 29k/mês

**O QUE FAZ**:
```
Quando freelancer vê projeto:
  ↓
Sistema analisa: skill match + budget + timeline + histórico
  ↓
Calcula: "87% chance de ganho"
  ↓
Oferece proposta otimizada PRÉ-FEITA
  ↓
Freelancer clica "Enviar com Certo"
  ↓
PrestaCerto cobra R$ 2,90
```

**IMPLEMENTAÇÃO**:
1. API: Integrar com source de projetos
2. IA: Score matching (0-100%)
3. Pre-gera proposta otimizada automaticamente
4. UI: Botão "Enviar com Certo Match"
5. Billing: Charge automático quando clica

**VALOR PRO LEAD**:
- "Não envie proposta genérica, envie a CERTA"
- Aumenta taxa de ganho drasticamente
- Proposta já otimizada (time-saver)

**MÉTRICA**: 500 propostas/mês × R$ 2,90 = R$ 1.450 (conservador, vai crescer)

---

### #4 CERTO FOLLOW-UP (Auto-Sequencing)
**Preço**: R$ 12,90/mês | **Receita**: +R$ 14k/mês

**O QUE FAZ**:
```
Dia 1: Proposta enviada
Dia 3: "Oi [client], viu minha proposta?"
Dia 5: "Com dúvida? Posso tirar"
Dia 7: "Orçamento apertado? Tenho plano B"
```

**IMPLEMENTAÇÃO**:
1. Database: log de propostas enviadas
2. Scheduler: CRON job que dispara emails
3. IA: Gera templates automáticos (parecem freelancer)
4. UI: Toggle "Auto follow-up" ao enviar

**VALOR PRO LEAD**:
- "70% dos clientes não respondem primeira proposta"
- Follow-up automático = +25% de respostas
- Não desista de proposta, deixe IA trabalhar

---

### ⚡ FASE 2 SUMMARY:
```
Antes: R$ 35k/mês
Depois: R$ 108k/mês
+ Insights, Match, Follow-up
```

---

## 🎯 FASE 3: OTIMIZAÇÃO (Semanas 5-6) — Dashboard + Preço
**Duração**: 2 semanas | **Receita Adicional**: +R$ 15k = **R$ 123k/mês**

### #5 CERTO DASHBOARD (Analytics)
**Preço**: R$ 14,90/mês | **Receita**: +R$ 9k/mês | **Retention Impact**: +15%

**O QUE MOSTRA**:
```
├─ Taxa de ganho: 73% (+55% vs. sem Certo)
├─ Fatura extra este mês: R$ 8.500
├─ Propostas otimizadas: 42
├─ ROI do Certo AI: 427x (R$ 19,90 → R$ 8.500)
├─ Skill em alta: Python (+340%)
├─ Preço médio cobrado vs. mercado
├─ Melhor horário pra enviar
└─ Benchmark vs. outros freelancers (anônimo)
```

**IMPLEMENTAÇÃO**:
1. Queries: Agregar dados do usuário
2. Charts: Recharts para visualizar
3. KPIs: Cards com métricas principais
4. Insights: IA gera recomendações
5. Page: `/dashboard/certo-analytics`

**VALOR PRO LEAD**:
- "Veja QUANTO você ganhou com Certo AI"
- Justifica recorrência (não cancela)
- Gamification: "Ganhe R$ 1k a mais!")

---

### #6 CERTO PREÇO (Dynamic Pricing)
**Preço**: R$ 14,90/mês | **Receita**: +R$ 6k/mês

**O QUE FAZ**:
```
Freelancer: "Qual preço cobrar?"
  ↓
Entra em /certo-ai/pricing
  ↓
Cola: Projeto + Skill + Urgência + Experiência
  ↓
IA retorna: "Preço ideal: R$ 4.500"
  (vs. R$ 2.000 que ele pensava)
  ↓
Freelancer cobra CORRETO = +R$ 2.500 por projeto
```

**IMPLEMENTAÇÃO**:
1. Form: Input de características do projeto
2. IA: Prompt para análise de preço
3. Benchmark: Comparar com histórico
4. Recomendação: Range (low/mid/high)
5. Page: `/certo-ai/pricing-calculator`

**VALOR PRO LEAD**:
- "Descubra qual preço SUA proposta vale"
- Evita subestimar (é o maior problema)
- ROI: Freelancer ganha R$ 2.500 a mais, paga R$ 14,90

---

---

## 🎯 FASE 4: NEGOCIAÇÃO (Semanas 7-8) — Negotiation + Badge
**Duração**: 2 semanas | **Receita Adicional**: +R$ 17k = **R$ 140k/mês**

### #7 CERTO NEGOTIATION (Smart Counter-Offers)
**Preço**: R$ 9,90/mês | **Receita**: +R$ 10k/mês

**FLUXO**:
```
Cliente: "Posso fazer por R$ 1.000?"
  ↓
Freelancer clica: "Negociar"
  ↓
IA sugere:
  • Lite: R$ 1.500 (essencial)
  • Completa: R$ 2.500 (recomendado)
  • Parcelado: 3x R$ 800
  ↓
Cliente pensa: "Faz sentido" → Paga R$ 1.500+
```

**IMPLEMENTAÇÃO**:
1. Modal: Input budget do cliente
2. IA: Gera 3 opções (lite/mid/premium)
3. Copy: Explicação de cada opção
4. Button: "Enviar contra-oferta"
5. Email: Dispara pra cliente

**VALOR PRO LEAD**:
- "Negocie como profissional, não como desesperado"
- Para com "aceitar qualquer preço"
- +R$ 500-1000 extra por projeto

---

### #8 CERTO BADGE (Reputation System)
**Preço**: R$ 19,90/mês (premium) + R$ 9,90/mês (destacado) | **Receita**: +R$ 7.5k/mês

**BADGES MOSTRADOS NO PERFIL**:
```
✅ Verified Professional (verificação de identidade)
🏆 Top Performer (acima de 80% taxa de ganho)
⚡ Quick Response (responde <1h)
💎 Quality Score (score médio 75+)
🔥 Trending (top 1% do mês)
```

**IMPLEMENTAÇÃO**:
1. Database: Tabela `badges` + critérios
2. Função PL/pgSQL: Calcula badges automaticamente
3. UI: Mostra badges no perfil público
4. Premium: Badges destacados (aparecem mais)
5. Page: Profile com badges visíveis

**VALOR PRO LEAD**:
- "Mostre sua expertise com badges verificadas"
- Cliente confia 30% mais quando vê badges
- Premium badge = R$ 9,90/mês (add-on)

---

## 🎯 FASE 5: COMUNIDADE (Semanas 9-12) — Archive + Certification + Portfolio
**Duração**: 4 semanas | **Receita Adicional**: +R$ 40k = **R$ 180k/mês**

### #9 CERTO ARCHIVE (Proposal Library)
**Preço**: R$ 19,90/mês | **Receita**: +R$ 8k/mês

**O QUE MOSTRA**:
```
Biblioteca de 5.000+ propostas que GANHARAM:
├─ Filtrar por skill (React, Python, Design, etc)
├─ Filtrar por preço range (R$ 1k-R$ 10k)
├─ Filtrar por país do cliente
├─ Mostrar APENAS as que ganharam (taxa 100%)
└─ Copiar estrutura pra sua proposta
```

**IMPLEMENTAÇÃO**:
1. Agregação: Coletar propostas vencedoras
2. Database: `proposal_archive` table
3. Anonymize: Remover dados sensíveis (nome, etc)
4. UI: Search + filters
5. Page: `/certo-ai/archive`

**VALOR PRO LEAD**:
- "Aprenda com propostas que REALMENTE ganharam"
- Novo freelancer: não sabe por onde começar
- Reduz tempo pra primeira proposta vencedora

---

### #10 CERTO CERTIFICATION (Skills Badge)
**Preço**: R$ 29,90 (one-time) | **Receita**: +R$ 30k/mês (1000 certs/mês)

**FLUXO**:
```
Freelancer: "Quero Certificação React"
  ↓
Mini-teste (15 perguntas)
+ Mini-projeto (código real)
+ Review pela comunidade
  ↓
SE PASSAR: Recebe "Certified React Expert by PrestaCerto"
  ↓
Aparece no perfil + em buscas
  ↓
Cliente pensa: "Esse cara realmente sabe"
```

**IMPLEMENTAÇÃO**:
1. Conteúdo: Mini-teste + rubric
2. Review: Comunidade vota
3. Badge: Emitir certificado
4. Profile: Mostrar no perfil público
5. Monetização: R$ 29,90/cert

**VALOR PRO LEAD**:
- "Prove suas skills, aumente confiança do cliente"
- Alternativa barata ao Upwork (custa R$ 2k)
- +30% confiança do cliente

---

### #11 CERTO PORTFOLIO (Auto-Generated)
**Preço**: R$ 12,90/mês | **Receita**: +R$ 4k/mês

**O QUE FAZ**:
```
Sistema coleta:
├─ Todos projetos do freelancer
├─ Agrupa por categoria
├─ Gera screenshots (pra web projects)
├─ Cria case studies automáticos
├─ Mostra resultados (ROI do cliente)
└─ Publica em /freelancer/nome/portfolio
```

**IMPLEMENTAÇÃO**:
1. Scraper: Puxar dados de projetos
2. IA: Gerar case studies
3. UI: Layout portfolio
4. Page: `/portfolio/[username]`
5. SEO: Otimizado pra Google

**VALOR PRO LEAD**:
- "Portfolio profissional gerado automaticamente"
- Zero trabalho manual
- SEO-friendly (atrai leads orgânicos)

---

## 🎯 FASE 6: PREMIUM/NETWORK (Semanas 13+) — VIP + Escrow + Trending
**Duração**: 2 semanas+ | **Receita Adicional**: +R$ 40k = **R$ 220k+/mês**

### #12 CERTO VIP NETWORK (Enterprise)
**Preço**: R$ 49,90/mês (freelancer) + R$ 99,90/mês (cliente) + 5% comissão
**Receita**: +R$ 11k/mês

**FLUXO**:
```
1. Cliente deposita R$ 5.000 em conta PrestaCerto
2. Freelancer começa trabalho (escrow seguro)
3. Freelancer termina
4. Cliente libera pagamento
5. PrestaCerto fica 5% (R$ 250)
6. Freelancer recebe R$ 4.750
```

**VALOR**: "Acesso a clientes VIP que pagam MAIS"
- Média projeto: R$ 15k (vs. R$ 3k no Upwork)
- Comissão 5% (vs. Upwork 20%)

---

### #13 CERTO ESCROW (Payment Gateway)
**Preço**: 5% de comissão por transação
**Receita**: +R$ 25k/mês

**O QUE FAZ**:
```
Protege ambos lados:
├─ Cliente: Freelancer não foge
├─ Freelancer: Cliente não calota
└─ PrestaCerto: Fica 5%
```

---

### #14 CERTO TRENDING (Real-Time Alerts)
**Preço**: R$ 9,90/mês
**Receita**: +R$ 5k/mês

**NOTIFICAÇÕES**:
```
Push: "🔥 ChatGPT Assistants em ALTA! 850% mais demanda"
Email: "Python subiu 340% esta semana"
Dashboard: Mostra skills trending NOW
```

---

## 📊 RESUMO FINAL (19 PRODUTOS)

| # | Produto | Preço | Receita/Mês |
|---|---------|-------|-------------|
| 1 | Certo AI | R$ 19,90 | R$ 35k |
| 2 | Insights | R$ 24,90 | R$ 30k |
| 3 | Match | R$ 2,90/prop | R$ 29k |
| 4 | Follow-up | R$ 12,90 | R$ 14k |
| 5 | Dashboard | R$ 14,90 | R$ 9k |
| 6 | Preço | R$ 14,90 | R$ 6k |
| 7 | Negotiation | R$ 9,90 | R$ 10k |
| 8 | Badge | R$ 19,90 | R$ 7.5k |
| 9 | Archive | R$ 19,90 | R$ 8k |
| 10 | Certification | R$ 29,90 | R$ 30k |
| 11 | Portfolio | R$ 12,90 | R$ 4k |
| 12 | VIP Network | R$ 49,90 + 5% | R$ 11k |
| 13 | Escrow | 5% | R$ 25k |
| 14 | Trending | R$ 9,90 | R$ 5k |
| | ... (5 mais) | ... | R$ 40k |
| | **TOTAL** | | **R$ 263k/mês** |

---

## 🎬 LAUNCH TIMELINE

```
SEMANA 1 (NOW):
├─ Rodar SQL Supabase ✅
├─ Testar em produção ✅
├─ Email pra 5k freelancers
└─ Ads Google + Meta: R$ 1k/semana

SEMANA 2:
├─ Certo Insights development
├─ Certo Match development
└─ Certo Follow-up development

SEMANA 3-4:
├─ Launch Insights + Match + Follow-up
├─ Email: "3 novos produtos Certo AI"
└─ Expected: 2x growth (R$ 70k/mês)

SEMANA 5-6:
├─ Launch Dashboard + Preço
└─ Expected: R$ 123k/mês

SEMANA 7-8:
├─ Launch Negotiation + Badge
└─ Expected: R$ 140k/mês

SEMANA 9-12:
├─ Launch Archive + Certification + Portfolio
└─ Expected: R$ 180k/mês

SEMANA 13+:
├─ Launch VIP Network + Escrow + Trending
└─ Expected: R$ 220k+/mês 🚀
```

---

## 🇧🇷 OBJETIVO: #1 DO BRASIL

**PrestaCerto Certo AI** vai ser o maior ecossistema de IA invisible pra freelancers do Brasil.

- Maior que Upwork pra freelancers brasileiros
- Mais barato (5% vs 20%)
- Melhor experiência (IA invisível)
- Mais rentável (R$ 263k/mês potencial)

**VAMO CONQUISTAR!** 🚀
