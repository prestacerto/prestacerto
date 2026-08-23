# Environment Setup Guide

## Local Development

```bash
cp .env.local.example .env.local
```

Preencha com suas credenciais reais:
- `NEXT_PUBLIC_SUPABASE_URL` - URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anon do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chave service role do Supabase (nunca commite!)
- `ANTHROPIC_API_KEY` - Sua chave de API da Anthropic
- `STRIPE_PUBLIC_KEY` - Chave pública do Stripe (para checkout)
- `STRIPE_SECRET_KEY` - Chave secreta do Stripe (nunca commite!)
- `STRIPE_WEBHOOK_SECRET` - Secret do webhook do Stripe (para validar eventos)
- `ADMIN_INIT_KEY` - Chave para inicializar planos de preço

## Vercel Deployment

Você precisa configurar estas variáveis no painel do Vercel:

**Settings → Environment Variables**

```
NEXT_PUBLIC_SUPABASE_URL = https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ... (marcar como Secret)
ANTHROPIC_API_KEY = sk-ant-... (marcar como Secret)
STRIPE_PUBLIC_KEY = pk_live_... (chave pública do Stripe)
STRIPE_SECRET_KEY = sk_live_... (marcar como Secret)
STRIPE_WEBHOOK_SECRET = whsec_... (marcar como Secret)
ADMIN_INIT_KEY = seu_key_aleatorio (marcar como Secret)
NEXT_PUBLIC_SITE_URL = https://seu-dominio.com
```

**Importante:** Sem estas variáveis, o build falhará pois as rotas da API tentam instanciar o cliente Supabase durante o build.

## Netlify Deployment

Configure no painel do Netlify:

**Site settings → Build & deploy → Environment**

```
NEXT_PUBLIC_SUPABASE_URL = https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ...
ANTHROPIC_API_KEY = sk-ant-...
STRIPE_PUBLIC_KEY = pk_live_...
STRIPE_SECRET_KEY = sk_live_...
STRIPE_WEBHOOK_SECRET = whsec_...
ADMIN_INIT_KEY = seu_key_aleatorio
NEXT_PUBLIC_SITE_URL = https://seu-dominio.com
```

## Build Localmente

```bash
npm install
npm run build
npm run start
```

Se receber erro `supabaseUrl is required`, verifique se o `.env.local` está configurado corretamente.
