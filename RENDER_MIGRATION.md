# 🚀 Guia de Migração para Render

**Status**: Pronto para migração do Vercel → Render  
**Data**: 2026-08-12

---

## 📋 PRÉ-REQUISITOS

- [ ] Conta no Render (https://render.com)
- [ ] Repositório GitHub conectado
- [ ] Variáveis de ambiente anotadas
- [ ] Database Supabase já configurado

---

## 1️⃣ CONFIGURAR RENDER

### Passo 1: Criar Web Service

```
1. Acesse https://dashboard.render.com
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Selecione a branch (main/master)
5. Nome: prestacerto
6. Runtime: Node
7. Build command: npm run build
8. Start command: npm start
```

### Passo 2: Variáveis de Ambiente

Vá em **Settings** → **Environment** e adicione:

```bash
# Next.js
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://seu-app.onrender.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxxxx

# Email (Nodemailer)
EMAIL_HOST=smtp.seuservidor.com
EMAIL_PORT=587
EMAIL_USER=seu-email@empresa.com
EMAIL_PASSWORD=sua-senha
EMAIL_FROM=noreply@prestacerto.com.br
EMAIL_SECURE=false

# Stripe (quando configurado)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Database Backups (opcional)
DATABASE_BACKUP_ENABLED=true
```

### Passo 3: Cron Jobs (opcional)

Se usar cron para emails diários:

```bash
# Settings → Cron Jobs

# Daily project match email (9 AM)
0 9 * * * curl https://seu-app.onrender.com/api/cron/daily-projects

# Weekly leaderboard email (Monday 10 AM)
0 10 * * 1 curl https://seu-app.onrender.com/api/cron/weekly-leaderboard
```

---

## 2️⃣ CONFIGURAR BUILD

### Arquivo: `render.yaml` (opcional, na raiz)

```yaml
services:
  - type: web
    name: prestacerto
    env: node
    plan: standard
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_SITE_URL
        value: https://prestacerto.onrender.com

  - type: postgresql
    name: prestacerto-db
    plan: standard
    ipAllowList: []
```

### Arquivo: `package.json` (verificar scripts)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "engines": {
    "node": "18.x || 20.x"
  }
}
```

---

## 3️⃣ DATABASE MIGRATIONS

### Executar SQL no Supabase

Dentro do Supabase Dashboard → SQL Editor:

```sql
-- 1. Copiar e colar conteúdo de:
-- src/lib/supabase/profile-views.sql

-- 2. Copiar e colar conteúdo de:
-- src/lib/supabase/business-tracking.sql

-- 3. Verificar se criou:
SELECT COUNT(*) FROM profile_views;
SELECT COUNT(*) FROM transactions;
SELECT COUNT(*) FROM proposal_tracking;
```

---

## 4️⃣ DEPLOY INICIAL

### No Render:

```
1. Vai aparecer "New Deployment"
2. Selecione a branch (main)
3. Clique "Deploy"
4. Aguarde ~5-10 minutos
```

### Status no terminal (Render):

```
Building...
Running npm install
Running npm run build
Starting application on port 10000
Application is running
```

---

## 5️⃣ VERIFICAR PÓS-DEPLOY

### Testar URLs (substitua por seu domínio Render)

```bash
# Substituir: https://seu-app.onrender.com

# 1. Homepage
curl -s https://seu-app.onrender.com | grep -q "PrestaCerto" && echo "✅ OK"

# 2. Checkout
curl -s https://seu-app.onrender.com/checkout | grep -q "Checkout" && echo "✅ OK"

# 3. API
curl -s https://seu-app.onrender.com/api/business/stats \
  -H "Authorization: Bearer TOKEN" | jq '.' && echo "✅ OK"

# 4. Landing Page
curl -s https://seu-app.onrender.com/landing/designer/sao-paulo | \
  grep -q "designer" && echo "✅ OK"
```

### No browser:

```
✅ /checkout                    → Deve carregar em < 2s
✅ /billing                     → Deve carregar em < 2s
✅ /plans                       → Deve carregar em < 2s
✅ /landing/designer/sao-paulo  → Deve carregar em < 1.5s
✅ /dashboard                   → Deve carregar com dados
```

---

## 6️⃣ CONFIGURAR DOMÍNIO CUSTOMIZADO

### No Render:

```
1. Settings → Custom Domain
2. Adicione: prestacerto.com.br (ou seu domínio)
3. Render vai dar instruções de DNS
4. Adicione os registros CNAME no seu DNS
5. Aguarde propagação (5-30 min)
```

### Exemplo de DNS (Hostinger/etc):

```
CNAME: prestacerto → seu-app-xxxxx.onrender.com
```

---

## 7️⃣ MONITORAMENTO

### Habilitar no Render:

```
1. Settings → Monitoring
2. Ativar:
   ✅ Error tracking
   ✅ Health checks
   ✅ Performance monitoring
```

### Integrar Sentry (recomendado):

```
1. npm install @sentry/nextjs
2. Criar conta em sentry.io
3. Adicionar SENTRY_AUTH_TOKEN no .env
4. next.config.js vai autoconfigar
```

---

## 8️⃣ VARIÁVEIS QUE MUDAM

### De Vercel para Render:

| Variável | Vercel | Render |
|----------|--------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://prestacerto.vercel.app` | `https://seu-app.onrender.com` |
| `NODE_ENV` | production | production |
| `PORT` | 3000 (auto) | 10000 (auto) |

### Certificado HTTPS:

✅ Render gera automaticamente (Let's Encrypt)  
✅ Não precisa fazer nada

---

## 9️⃣ PLANOS RENDER

| Plano | CPU | RAM | Preço | Para |
|-------|-----|-----|-------|------|
| **Free** | Shared | 512MB | $0 | Teste |
| **Starter** | Shared | 1GB | $7/mês | MVP |
| **Standard** | 0.5 | 2GB | $12/mês | Produção |
| **Pro** | 1 | 4GB | $29/mês | Scale |

**Recomendação**: Standard ($12/mês) para produção

---

## 🔟 TROUBLESHOOTING

### Erro: "Build failed"

```bash
# Check logs no Render
# Se npm install falhar:
# 1. Deletar package-lock.json
# 2. Rodar: npm install
# 3. Commit e push
# 4. Redeploy
```

### Erro: "Database connection timeout"

```bash
# Verificar:
1. SUPABASE_URL está correto?
2. SUPABASE_ANON_KEY está correto?
3. Firewall do Supabase permite Render?
   → Supabase Dashboard → SQL Editor → 
     Toque em Database → Connection strings → 
     Ativar "Allow all IP addresses"
```

### Erro: "Email não envia"

```bash
# Verificar:
1. EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD
2. PORT 587 (TLS) ou 465 (SSL)?
3. Host permite SMTP desde Render?
```

### Build slow

```bash
# Render cache:
# Settings → Deploy Hook
# Toda commit vai triggar novo build
# Otimizar Next.js:
# - next/image optimization
# - Dynamic imports
# - Code splitting
```

---

## 1️⃣1️⃣ GITHUB ACTIONS (CI/CD)

Criar `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Trigger Render deployment
        run: |
          curl -X POST https://api.render.com/deploy/srv-xxxxx?key=${{ secrets.RENDER_DEPLOY_KEY }}
```

---

## 1️⃣2️⃣ CHECKLIST PRÉ-DEPLOY

- [ ] Todas as variáveis .env configuradas
- [ ] Migrations SQL executadas no Supabase
- [ ] Build local funciona: `npm run build && npm start`
- [ ] Repositório GitHub conectado
- [ ] Node version ≥ 18
- [ ] Domínio customizado configurado (opcional)
- [ ] Email SMTP testado
- [ ] Stripe keys configuradas (se usar)
- [ ] Health check: `GET /api/health` retorna 200

---

## 1️⃣3️⃣ COMANDOS RENDER

```bash
# Redeployar
curl -X POST https://api.render.com/deploy/srv-xxxxx?key=RENDER_KEY

# Ver logs
# Render Dashboard → Logs

# Restart service
# Render Dashboard → Settings → Restart
```

---

## 1️⃣4️⃣ MIGRATE DO VERCEL

### Passo a Passo:

```bash
# 1. Clone seu repo (já tem Render conectado)
git clone https://github.com/seu-user/prestacerto.git
cd prestacerto

# 2. Verifica build local
npm install
npm run build
npm start

# 3. Push para main (dispara deploy no Render)
git add .
git commit -m "Deploy ready for Render"
git push origin main

# 4. Aguarda Render fazer build (~5-10 min)
# Acompanhe em: https://dashboard.render.com

# 5. Teste em seu domínio Render
# https://seu-app-xxxxx.onrender.com
```

---

## 1️⃣5️⃣ ESTIMATIVA DE CUSTO (Render)

| Serviço | Custo |
|---------|-------|
| Web Service (Standard) | $12/mês |
| Database (Supabase) | ~$25/mês (sem usar BD do Render) |
| Email (Nodemailer) | $0-20/mês (depende volume) |
| **TOTAL** | **~$37-57/mês** |

---

## 📞 SUPORTE RENDER

- **Docs**: https://render.com/docs
- **Status**: https://render.com/status
- **Support**: https://render.com/support

---

## ✅ VOCÊ ESTÁ PRONTO!

Todas as 18 features estão prontas para Render:

✅ Monetização (Checkout + Billing)  
✅ Tração (Landing pages + Feed)  
✅ Retenção (Dashboard + Alertas)  
✅ Engagement (Leaderboard + Comunidade)  

**Próximo passo**: Deploy e validar em produção! 🚀

---

**Criado**: 2026-08-12  
**Ready**: 100%
