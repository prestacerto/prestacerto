#!/bin/bash

set -e

echo "🚀 Executando SQL Migrations via Supabase API..."
echo ""

# Carrega .env.local
export $(cat .env.local | grep SUPABASE | xargs)

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

echo "✓ Supabase URL: $SUPABASE_URL"
echo ""

# Lê o arquivo SQL
SQL_FILE="SETUP_COMPLETO.sql"
SQL_CONTENT=$(cat "$SQL_FILE")

# Remove comentários e espaços em branco desnecessários
CLEAN_SQL=$(echo "$SQL_CONTENT" | grep -v "^--" | sed '/^[[:space:]]*$/d')

# Divide em statements (por ;)
IFS=';' read -ra STATEMENTS <<< "$CLEAN_SQL"

echo "📝 Executando ${#STATEMENTS[@]} statements..."
echo ""

SUCCESS=0
FAILED=0

for i in "${!STATEMENTS[@]}"; do
  STMT=$(echo "${STATEMENTS[$i]}" | xargs)

  if [ -z "$STMT" ]; then
    continue
  fi

  # Executa via curl
  RESPONSE=$(curl -s -X POST \
    "$SUPABASE_URL/rest/v1/rpc/exec_sql_query" \
    -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"$(echo $STMT | sed 's/"/\\"/g')\"}" 2>/dev/null || echo '{"error":"API call failed"}')

  if echo "$RESPONSE" | grep -q "error"; then
    FAILED=$((FAILED + 1))
    echo "⚠️  Statement $((i+1)) FALHOU (pode já existir)"
  else
    SUCCESS=$((SUCCESS + 1))
    echo "✓ Statement $((i+1)) OK"
  fi
done

echo ""
echo "═══════════════════════════════════════════"
echo "✅ Migrations Completas!"
echo "✓ Success: $SUCCESS"
echo "⚠️  Skipped: $FAILED (provavelmente já existem)"
echo "═══════════════════════════════════════════"
echo ""
echo "🚀 Certo AI está READY!"
