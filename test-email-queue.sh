#!/bin/bash

# Script pra testar email automation localmente
# Uso: ./test-email-queue.sh

set -e

echo "🚀 Email Automation Test Suite"
echo "================================"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="${1:-http://localhost:3000}"
CRON_SECRET="${2:-your-secret-token-here}"

echo -e "${BLUE}Base URL:${NC} $BASE_URL"
echo -e "${BLUE}CRON_SECRET:${NC} $CRON_SECRET"
echo ""

# 1. Testar se o servidor tá rodando
echo -e "${BLUE}1️⃣  Verificando servidor...${NC}"
if ! curl -s "$BASE_URL/api/health" > /dev/null 2>&1; then
  echo -e "${RED}❌ Servidor não tá rodando em $BASE_URL${NC}"
  echo "   Inicie com: npm run dev"
  exit 1
fi
echo -e "${GREEN}✅ Servidor respondendo${NC}"
echo ""

# 2. Chamar cron job manualmente
echo -e "${BLUE}2️⃣  Chamando Cron Job (/api/cron/email)...${NC}"
CRON_RESPONSE=$(curl -s -X POST "$BASE_URL/api/cron/email" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json")

echo "Resposta:"
echo "$CRON_RESPONSE" | jq . 2>/dev/null || echo "$CRON_RESPONSE"
echo ""

# 3. Verificar se sucesso
if echo "$CRON_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Cron job executado com sucesso${NC}"
else
  echo -e "${RED}⚠️  Cron job pode ter falhado${NC}"
  echo "   Verifique os logs do servidor"
fi

echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo "1. Registre um usuário em /para-clientes ou /para-prestadores"
echo "2. Execute: psql '<seu-connection-string>' -c 'SELECT * FROM email_queue;'"
echo "3. Verifique se 5 linhas foram criadas (uma por step)"
echo "4. Modifique send_at pro passado: UPDATE email_queue SET send_at = NOW() - interval '1 hour' WHERE email = 'seu@email.com';"
echo "5. Execute este script novamente pra enviar os e-mails"
echo "6. Verifique status em: SELECT * FROM email_queue WHERE email = 'seu@email.com' AND status = 'sent';"
echo ""
echo -e "${GREEN}✅ Setup completo!${NC}"
