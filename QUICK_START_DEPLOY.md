# 🚀 GUIA RÁPIDO — Do 0 ao Ar em 30 MIN

## PASSO 1: Preparar Supabase (5 min)

1. Acesse [supabase.com](https://supabase.com) → seu projeto
2. Vá em **SQL Editor**
3. **Copie e cole** cada arquivo abaixo em ordem:
   - `supabase/migrations/0013_referral_gamification_system.sql`
   - `supabase/migrations/0014_whatsapp_integration.sql`
   - `supabase/migrations/0015_urgent_priority_monetization.sql`
   - `supabase/migrations/0016_monetization_all_features.sql`
   - `supabase/migrations/0017_gamification_notifications.sql`
4. Click **Run** pra cada uma
5. Pronto! ✅

## PASSO 2: Gerar VAPID Keys (2 min)

```bash
npm install -g web-push
web-push generate-vapid-keys
```

Copie pra `.env.local`:
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=ABC123...
VAPID_PRIVATE_KEY=XYZ789...
```

## PASSO 3: Testar Localmente (5 min)

```bash
npm run dev
# http://localhost:3000
```

## PASSO 4: Deploy Vercel (5 min)

```bash
npm install -g vercel
vercel --prod
```

## PASSO 5: Testar em Produção

Acesse seu domínio e teste:
- [ ] Login funciona
- [ ] Dashboard pronto
- [ ] Certo AI responde
- [ ] Push notification pede permissão

## 🎉 PRONTO! Site está no ar! 🚀

