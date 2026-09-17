#!/bin/bash
# Deploy script for CERTO Ecosystem with Assinify integration
# Usage: ./scripts/deploy-assinify.sh

set -e

echo "🚀 CERTO Ecosystem Deployment Script"
echo "===================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ ERROR: .env.local not found!"
    echo "Please create .env.local with Assinify links first."
    echo ""
    echo "Required variables:"
    echo "- ASSINIFY_WEBHOOK_SECRET"
    echo "- NEXT_PUBLIC_ASSINIFY_MATCH"
    echo "- NEXT_PUBLIC_ASSINIFY_PRECO"
    echo "- NEXT_PUBLIC_ASSINIFY_TIMING"
    echo "... (all 27 products)"
    exit 1
fi

echo "✅ .env.local found"

# Count Assinify links
ASSINIFY_COUNT=$(grep -c "NEXT_PUBLIC_ASSINIFY_" .env.local || true)
echo "✅ Found $ASSINIFY_COUNT Assinify product links"

if [ "$ASSINIFY_COUNT" -lt 27 ]; then
    echo "⚠️  WARNING: Expected 27 product links, found $ASSINIFY_COUNT"
    echo "Please add remaining links to .env.local"
fi

echo ""
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful"

echo ""
echo "🧪 Running tests..."
npm test -- --passWithNoTests

echo ""
echo "✅ Deployment ready!"
echo ""
echo "Next steps:"
echo "1. Review CERTO_ECOSYSTEM_MASTER_2026-09-17.md"
echo "2. Verify webhook URL: /api/webhooks/assinify"
echo "3. Configure in Assinify dashboard: https://admin.assiny.com.br"
echo "4. Push to production: git push && git push heroku main"
echo ""
echo "Monitor at: /admin/analytics"
