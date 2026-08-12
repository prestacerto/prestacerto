# 🚀 CERTO AI BILATERAL — LAUNCH CHECKLIST

## PRÉ-LAUNCH (HOJE)

### ✅ CÓDIGO PRONTO:
- [x] Certo AI (API + Components + Landing)
- [x] Email notifications (Resend)
- [x] Push notifications (Web Push)
- [x] Certo Screening (API)
- [x] Client Products DB schema
- [x] Roadmap 14 semanas

### 🔧 PRÓXIMOS (2 HORAS):

**1. SQL Migrations:**
```bash
# Rodar no Supabase SQL Editor:
- ai-proposals.sql (Certo AI)
- push-subscriptions.sql (Notificações)
- client-products.sql (Lado cliente)
```

**2. Environment Variables:**
```
RESEND_API_KEY=xxx
ANTHROPIC_API_KEY=xxx
NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxx
```

**3. Testar em Produção:**
- [ ] Login em prestacerto.onrender.com
- [ ] Acessar /certo-ai (landing)
- [ ] Acessar /dashboard/certo-ai (dashboard)
- [ ] Testar API POST /api/ai/optimize-proposal
- [ ] Testar notificações push

---

## LAUNCH DAY (AMANHÃ)

### 📧 EMAIL MARKETING:
```
Assunto: "🎉 Apresentamos CERTO AI — Ganhe 73% mais com propostas otimizadas"

Destinatários:
- 5.000 freelancers da base
- 2.000 clientes da base

Conteúdo:
✨ Você (freelancer): Propostas otimizadas com IA
✅ Você (cliente): Propostas filtradas automaticamente
💰 Resultado: +R$ 1.000/mês pra ambos

CTA: "Experimentar Certo AI Grátis"
```

### 🎬 SOCIAL MEDIA:
```
LinkedIn:
"Depois de 3 anos estudando freelancers no Brasil...
Criamos Certo AI: IA invisível que:
✨ Otimiza propostas (+73% taxa de ganho)
✅ Filtra propostas ruins (pros clientes)
💰 Resultado: +R$ 1.000/mês recorrente

Freelancer ganha mais.
Cliente contrata melhor.
Ninguém descobre que foi IA.

EVERYONE WINS! 🚀

Quer testar?
link: prestacerto.com.br/certo-ai"

Twitter/X:
"Liberamos Certo AI — co-pilot invisível pra freelancers.

Versão freelancer: Otimiza propostas
Versão cliente: Filtra as boas

ROI: 427x em 1 mês.

Bilateral desde o dia 1.

Vamo ser #1 do Brasil? 🇧🇷⚡

prestacerto.onrender.com/certo-ai"

Instagram Stories:
"Novo: Certo AI ✨
Propostas melhores = Mais dinheiro
Vem testar grátis"
```

### 💰 ADS PAGOS:
```
Google Ads (R$ 500/semana):
- Keyword: "como melhorar proposta freelancer"
- Keyword: "software pra freelancer"
- Keyword: "aumentar taxa de ganho"
- CPA Target: R$ 100 (pra conversão)

Meta Ads (R$ 500/semana):
- Audience: Freelancers brasileiros (20-45)
- Placement: Feed + Stories
- Creative: "Ganhe R$ 1k a mais esse mês"
- CPA Target: R$ 80
```

---

## WEEK 1 METRICS

### FREELANCER SIDE:
- [ ] 10k+ visitantes landing
- [ ] 25%+ CTR "Começar Grátis"
- [ ] 500+ registros
- [ ] 30%+ conversão free → premium
- [ ] R$ 9,950 MRR (Certo AI)

### CLIENT SIDE:
- [ ] 2k+ visitantes
- [ ] 100+ clientes experimentando
- [ ] R$ 2k MRR (Screening + Hire)

### TOTAL WEEK 1:
- [ ] R$ 11,950 MRR
- [ ] 600+ usuários totais
- [ ] 0% churn (novo)

---

## WEEK 2-4 (FASE 2 LAUNCH)

### Freela
ncer:
- [ ] Certo Match (+R$ 29k)
- [ ] Certo Insights (+R$ 30k)
- [ ] Certo Follow-up (+R$ 14k)

### Cliente:
- [ ] Certo Hire improvements
- [ ] Certo Analytics basic

### EXPECTED MRR:
- Week 2: R$ 70k
- Week 3: R$ 100k
- Week 4: R$ 120k

---

## SUCCESS CRITERIA

✅ **Week 1**: 
- 500+ freelancers
- 100+ clientes
- R$ 11,950 MRR

✅ **Week 4**:
- 2.000+ freelancers
- 500+ clientes
- R$ 120k MRR

✅ **Month 3**:
- 10.000+ freelancers
- 2.000+ clientes
- R$ 350k MRR (full roadmap)

✅ **TITLE**: #1 Marketplace de Freelancer com IA do Brasil

---

## RISK MITIGATION

⚠️ **API Rate Limits:**
- Implementar rate limiting no Render
- Backup: usar batch processing

⚠️ **Churn:**
- Email de re-engagement após 30 dias
- Offer: "Primeira semana 50% off"

⚠️ **Bugs em Produção:**
- Deploy staging ANTES de prod
- Monitoring: Sentry alerts
- Rollback script pronto

⚠️ **Supabase Costs:**
- Monitorar usage
- Alert se passar R$ 1k/mês

---

## GO/NO-GO DECISION

**GO se:**
- [ ] SQL migrations rodaram OK
- [ ] APIs testadas em produção
- [ ] Landing page carrega <3s
- [ ] Email funciona
- [ ] Zero 500 errors

**NO-GO se:**
- [ ] Qualquer erro crítico
- [ ] Email provider down
- [ ] Render offline
- [ ] IA API down

---

## CELEBRATION 🎉

**AFTER LAUNCH:**
- [ ] Email: "Vamo ser #1 do Brasil!"
- [ ] Post: Announcement público
- [ ] Ads: Boost primeiros 100 users
- [ ] Cerveja: Você merece! 🍺
