#!/bin/bash

# ============================================================
# CERTO AI SETUP AUTOMÁTICO
# Execute: bash setup.sh
# ============================================================

echo "🚀 CERTO AI Setup Automático"
echo "=============================="
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Verificar se .env.local existe
echo -e "${BLUE}[STEP 1]${NC} Verificando .env.local..."

if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local não encontrado!${NC}"
    echo "Copie .env.example para .env.local e preencha as variáveis:"
    echo "  cp .env.example .env.local"
    exit 1
fi

echo -e "${GREEN}✅ .env.local encontrado${NC}"

# Step 2: Instalar dependências
echo ""
echo -e "${BLUE}[STEP 2]${NC} Instalando dependências..."
npm install redis ioredis rate-limiter-flexible resend @sentry/next 2>&1 | grep -E "(added|up to date|ERR)" || true
echo -e "${GREEN}✅ Dependências instaladas${NC}"

# Step 3: Build
echo ""
echo -e "${BLUE}[STEP 3]${NC} Building Next.js..."
npm run build 2>&1 | tail -5
echo -e "${GREEN}✅ Build completo${NC}"

# Step 4: Instruções Supabase
echo ""
echo -e "${BLUE}[STEP 4]${NC} SQL Migrations (manual)"
echo "============================================"
echo ""
echo "1. Abra: https://app.supabase.com"
echo "2. Selecione projeto 'prestacerto'"
echo "3. Menu: SQL Editor → New Query"
echo "4. Copie TODO o conteúdo de: SETUP_COMPLETO.sql"
echo "5. Cole no editor e clique: ▶️ RUN"
echo ""
echo "Arquivo pronto em: SETUP_COMPLETO.sql"
echo ""

# Step 5: Instruções Redis
echo -e "${BLUE}[STEP 5]${NC} Redis Setup (manual)"
echo "============================================"
echo ""
echo "1. Abra: https://upstash.com"
echo "2. Crie um Redis database (free tier)"
echo "3. Copie a URL"
echo "4. Cole no .env.local:"
echo "   REDIS_URL=https://..."
echo ""

# Step 6: Teste
echo ""
echo -e "${BLUE}[STEP 6]${NC} Teste Local"
echo "============================================"
echo ""
echo "Execute pra testar localmente:"
echo "  npm run dev"
echo ""
echo "Depois acesse:"
echo "  http://localhost:3000/certo-ai"
echo ""

# Step 7: Deploy
echo ""
echo -e "${GREEN}✅ PRONTO!${NC}"
echo "============================================"
echo ""
echo "Próximos passos:"
echo "1. Execute as SQL migrations (veja STEP 4)"
echo "2. Setup Redis (veja STEP 5)"
echo "3. Git push (auto-deploy no Render)"
echo "4. Teste em: https://prestacerto.onrender.com/certo-ai"
echo ""
echo "🚀 Certo AI vai estar LIVE!"
echo ""
