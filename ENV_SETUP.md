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

## Vercel Deployment

Você precisa configurar estas variáveis no painel do Vercel:

**Settings → Environment Variables**

```
NEXT_PUBLIC_SUPABASE_URL = https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ... (marcar como Secret)
ANTHROPIC_API_KEY = sk-ant-... (marcar como Secret)
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
NEXT_PUBLIC_SITE_URL = https://seu-dominio.com
```

## Build Localmente

```bash
npm install
npm run build
npm run start
```

Se receber erro `supabaseUrl is required`, verifique se o `.env.local` está configurado corretamente.
