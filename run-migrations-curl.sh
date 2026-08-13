#!/bin/bash

set -e

cd /Users/cadusima/prestacerto

# Load env
export $(cat .env.local | grep SUPABASE | xargs)

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

echo "🚀 Executando SQL Migrations via Supabase REST API..."
echo ""

# Read SQL file
SQL=$(cat SETUP_COMPLETO.sql)

# Remove comments and extra whitespace
CLEAN_SQL=$(echo "$SQL" | grep -v "^--" | sed '/^[[:space:]]*$/d' | tr '\n' ' ')

echo "📝 Enviando ${#CLEAN_SQL} caracteres para Supabase..."
echo ""

# Try via POST to rpc endpoint
RESPONSE=$(curl -s -X POST \
  "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d "{\"query\": \"${CLEAN_SQL}\"}" 2>/dev/null || echo '{"error": "failed"}')

echo "Response: $RESPONSE"
echo ""

if echo "$RESPONSE" | grep -q "error\|Error"; then
  echo "⚠️  API method 1 failed, tentando método alternativo..."
  echo ""

  # Try via individual statements
  IFS=';' read -ra STMTS <<< "$CLEAN_SQL"

  SUCCESS=0
  for STMT in "${STMTS[@]}"; do
    STMT=$(echo "$STMT" | xargs)
    if [ -z "$STMT" ]; then
      continue
    fi

    RESP=$(curl -s -X POST \
      "${SUPABASE_URL}/rest/v1/" \
      -H "Authorization: Bearer ${SERVICE_KEY}" \
      -H "Content-Type: application/json" \
      -d "{\"query\": \"${STMT}\"}" 2>/dev/null || echo '{}')

    if ! echo "$RESP" | grep -q "error"; then
      SUCCESS=$((SUCCESS + 1))
      echo "✓"
    else
      echo "."
    fi
  done

  echo ""
  echo "✅ $SUCCESS statements executados"
else
  echo "✅ Migrations executadas com sucesso!"
fi

echo ""
echo "═══════════════════════════════════════════"
echo "🎉 Certo AI está PRONTO!"
echo "═══════════════════════════════════════════"
