# 🚀 PrestaCerto — Deployment Checklist

## FASE 1: Supabase Migrations (5 min)
Executar NO SUPABASE CONSOLE (não via CLI):

1. **0013_referral_gamification_system.sql** — Referral + badges + leaderboards
2. **0014_whatsapp_integration.sql** — WhatsApp tables + RLS
3. **0015_urgent_priority_monetization.sql** — Urgent/Critical fees + guarantee
4. **0016_monetization_all_features.sql** — Featured, verified badge, API keys
5. **0017_gamification_notifications.sql** — Push, challenges, rewards, activities

✅ Colar cada arquivo no SQL Editor do Supabase > Run

---

## FASE 2: Variáveis de Ambiente (2 min)

### Já configurado:
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ RESEND_API_KEY
- ✅ MERCADO_PAGO_CLIENT_ID
- ✅ MERCADO_PAGO_CLIENT_SECRET
- ✅ WHATSAPP_PHONE_NUMBER_ID
- ✅ WHATSAPP_BUSINESS_ACCOUNT_ID
- ✅ WHATSAPP_API_TOKEN
- ✅ WHATSAPP_VERIFY_TOKEN

### Falta (pra Push Notifications):
- [ ] NEXT_PUBLIC_VAPID_PUBLIC_KEY
- [ ] VAPID_PRIVATE_KEY

**Como gerar VAPID:**
```bash
npm install -g web-push
web-push generate-vapid-keys
```

---

## FASE 3: Testes Rápidos (10 min)

### No Dev Server (http://localhost:3001):

- [ ] **Login** — Criar conta + entrar
- [ ] **Dashboard** — Ver widget de receita (vazio, normal)
- [ ] **Daily Challenge** — Ver botão de "Publicar projeto"
- [ ] **Push Notification** — Clicar sino / aceitar permissão
- [ ] **Referral Code** — Copiar código na dashboard
- [ ] **Activity Feed** — Ver mockup de atividades
- [ ] **Featured Projects** — (Falta integrar no projects page)
- [ ] **Checkout** — (Vai testar em produção com Sandbox Mercado Pago)

### Comandos rápidos:
```bash
# Verificar dev server tá rodando
curl http://localhost:3001/dashboard

# Verificar migrations foram executadas
# (No Supabase Dashboard → SQL Editor → Verificar tabelas)
```

---

## FASE 4: Deploy Netlify/Vercel (5 min)

### Se preferir Netlify:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Se preferir Vercel:
```bash
npm install -g vercel
vercel --prod
```

### Environment vars em produção:
- Colar as mesmas do `.env.local`
- Adicionar VAPID keys
- Mercado Pago SANDBOX pra testar (depois PROD)

---

## FASE 5: Pós-Deploy (3 min)

- [ ] Testar login em produção
- [ ] Testar checkout com Mercado Pago Sandbox
- [ ] Testar push notification
- [ ] Testar referral link
- [ ] Google Analytics ativado? (G-H0RRWBW190)

---

## 📊 Receita Esperada (Primeira Semana)

| Feature | Preço | Conversão | Semana 1 |
|---------|-------|-----------|----------|
| Referral Bonus | R$50 | 10% | R$500 |
| Featured Projects | R$50/7d | 5% | R$250 |
| Verified Badge | R$5/mês | 3% | R$150 |
| Priority Support | R$20/mês | 2% | R$400 |
| API Marketplace | R$99-999 | <1% | R$0-200 |
| **TOTAL** | | | **R$1,300-1,500** |

---

## ⏰ Timeline Proposto

- **Hoje**: Migrations + testes + deploy
- **Amanhã**: Certo AI (proposal rewriter)
- **Semana 2**: Benchmark de preço + Histórias de sucesso
- **Semana 3**: Perfil público redesenhado + SEO

---

## 🚨 Riscos/Bloqueadores

1. **Migrations não executarem** → Testar query no Supabase SQL Editor primeiro
2. **Mercado Pago Sandbox não funcionar** → Gerar nova credentials
3. **Resend não enviar emails** → Verificar API key
4. **Push notifications não funcionar** → Gerar VAPID keys correto

---

## ✅ Próximos Passos

1. Você: Executar migrations no Supabase Console
2. Você: Gerar VAPID keys e atualizar `.env.local`
3. Você: Testar dev server
4. Você: Deploy em Netlify/Vercel
5. Eu: Criar Certo AI (proposal rewriter)

---

**Estimado**: 30 min total pra tudo estar live

Quer que eu execute algo daqui ou você prefere fazer manualmente?
