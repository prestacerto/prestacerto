#!/bin/bash

# ===== SETUP PRODUCTION - TUDO AUTOMÁTICO =====

echo "🚀 CONFIGURANDO PRESTACERTO PRODUCTION..."

# 1. Install dependencies
echo "📦 Instalando dependências..."
npm install upstash-redis @upstash/ratelimit sentry-node compression

# 2. Environment setup
echo "🔐 Criando .env.production..."
cat > .env.production << EOF
# SUPABASE PRO (configure com suas credenciais)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# UPSTASH REDIS (configure com suas credenciais)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# ANTHROPIC API (configure com sua chave)
ANTHROPIC_API_KEY=sk-ant-your-key
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# MERCADOPAGO
MERCADOPAGO_ACCESS_TOKEN=your-token

# APP CONFIG
NEXT_PUBLIC_APP_URL=https://prestacerto.com.br
NODE_ENV=production

# PERFORMANCE
RATE_LIMIT_REQUESTS=10000
RATE_LIMIT_WINDOW=60000
CACHE_TTL=3600
REDIS_ENABLED=true
EOF

echo "✅ .env.production criado!"
echo ""
echo "⚠️  PRÓXIMOS PASSOS MANUAIS:"
echo "1. Vai em https://supabase.com/dashboard e upgrade pro plano Pro"
echo "2. Vai em https://upstash.com e cria Redis DB"
echo "3. Vai em https://console.anthropic.com e adiciona créditos"
echo "4. Vai em https://developers.mercadopago.com e pega seu token"
echo "5. Substitui os valores NO .env.production"
echo ""
echo "6. Depois roda: npm run build && git push"
echo ""
echo "🎉 PRONTO! Site vai rodar SEM TRAVAR!"
