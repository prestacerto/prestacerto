# ✅ Render Configuration Checklist

## Já Configurado ✓
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ ANTHROPIC_API_KEY (Claude)
- ✅ GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
- ✅ NEXT_PUBLIC_LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET
- ✅ NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY / MERCADO_PAGO_ACCESS_TOKEN

## Falta Validar/Completar

### 1. VAPID Keys (Push Notifications)
Gere em: https://vapidkeys.com/ ou use:
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

### 2. Resend (Email)
- Adicione: `RESEND_API_KEY` 
- Conta: https://resend.com
- Copie a API key da dashboard

### 3. Stripe (Pagamentos - Opcional por enquanto)
- `STRIPE_PUBLIC_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### 4. ADMIN_SETUP_KEY
```
ADMIN_SETUP_KEY=your-super-secret-key-here
```

---

## Como Adicionar no Render Dashboard

1. Acesse: https://dashboard.render.com
2. Selecione seu serviço **prestacerto**
3. Vá em **Environment** na sidebar
4. Clique em **Edit Environment Group** (env_group_prod)
5. Adicione cada variável com seu valor
6. Clique **Save**
7. Render fará redeploy automaticamente

---

## Validar se Está Tudo Ok

Acesse: https://prestacerto.onrender.com/api/business/revenue

Se retornar JSON (mesmo vazio), tudo está conectado! ✓

---

## Comando Rápido via Render CLI

Se tiver `render` CLI instalado:

```bash
render env-vars set \
  NEXT_PUBLIC_VAPID_PUBLIC_KEY="your_key" \
  VAPID_PRIVATE_KEY="your_key" \
  RESEND_API_KEY="your_key" \
  ADMIN_SETUP_KEY="your_key"
```

---

**Status**: Site está online e rodando em produção ✓
