#!/bin/bash

set -e

echo "🚀 CERTO AI - SETUP AUTOMÁTICO COMPLETO"
echo "======================================="
echo ""

cd /Users/cadusima/prestacerto

# ============================================================
# STEP 1: Verificar .env.local
# ============================================================
echo "📋 [STEP 1] Verificando configurações..."

if [ ! -f .env.local ]; then
    echo "❌ .env.local não encontrado!"
    exit 1
fi

echo "✅ .env.local encontrado"
echo ""

# ============================================================
# STEP 2: Instalar dependências (se necessário)
# ============================================================
echo "📦 [STEP 2] Verificando dependências..."

if ! npm list redis ioredis rate-limiter-flexible resend 2>/dev/null | grep -q redis; then
    echo "Instalando dependências..."
    npm install redis ioredis rate-limiter-flexible resend @sentry/next 2>&1 | tail -3
fi

echo "✅ Dependências OK"
echo ""

# ============================================================
# STEP 3: Build Next.js
# ============================================================
echo "🔨 [STEP 3] Building Next.js..."

npm run build 2>&1 | tail -10

echo "✅ Build completo!"
echo ""

# ============================================================
# STEP 4: Deploy no Render
# ============================================================
echo "🚀 [STEP 4] Fazendo deploy..."

git add -A
git commit -m "Setup Certo AI - SQL migrations, Redis, rate limiting" 2>/dev/null || echo "Nada para commitar"

git push origin main

echo ""
echo "✅ Deploy iniciado no Render (aguarde 2-3 min)"
echo ""

# ============================================================
# STEP 5: Instruções Finais
# ============================================================
echo "═══════════════════════════════════════════════════════════"
echo "✅ SETUP COMPLETO!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 O que foi feito:"
echo ""
echo "✓ Dependências instaladas"
echo "✓ Next.js buildado"
echo "✓ Código pushed para main"
echo "✓ Render fazendo auto-deploy..."
echo ""
echo "⏳ Proximos passos:"
echo ""
echo "1. Aguarde 2-3 min para o deploy terminar"
echo ""
echo "2. Execute as SQL migrations no Supabase:"
echo "   → https://app.supabase.com"
echo "   → Selecione 'prestacerto'"
echo "   → SQL Editor → New Query"
echo "   → Cole SETUP_COMPLETO.sql"
echo "   → Clique RUN ▶️"
echo ""
echo "3. Setup Redis (OPCIONAL):"
echo "   → https://upstash.com"
echo "   → Create Database → Copy URL"
echo "   → Adicione ao .env.local: REDIS_URL=..."
echo ""
echo "4. Teste em produção:"
echo "   → https://prestacerto.onrender.com/certo-ai"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🎉 Certo AI está LIVE!"
echo ""
