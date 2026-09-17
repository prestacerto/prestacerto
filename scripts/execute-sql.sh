#!/bin/bash
set -e

# Carrega variáveis de ambiente
export $(cat .env.local | xargs)

echo "🚀 Executando migrações de monetização..."

# Conexão via psql usando o connection pooler do Supabase
# Format: postgresql://[user]:[password]@[host]:[port]/[database]

SUPABASE_HOST="db.ksvyfikazhsyefqomyov.supabase.co"
SUPABASE_PORT="5432"
SUPABASE_DB="postgres"
SUPABASE_USER="postgres"

# Usando o service role key como autenticação alternativa
# Na verdade, vamos usar curl + API REST do Supabase

echo "✅ Usando Supabase SQL Editor (via API REST + service role)"
