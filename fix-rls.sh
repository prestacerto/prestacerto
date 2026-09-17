#!/bin/bash

# EMERGENCY FIX: Disable RLS in Supabase
# Run this script locally: bash fix-rls.sh

set -e

echo "🚨 EMERGENCY RLS FIX"
echo "===================="
echo ""
echo "This script will disable RLS on Supabase to fix login issues."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo "🔐 Logging in to Supabase..."
echo "   A browser window will open. Please login with your account."
echo ""

# Login to Supabase
supabase login

echo ""
echo "✅ Login successful!"
echo ""
echo "🔗 Linking to project..."

# Link the project (use the project ref: taktwwwpcyxhyylzmgho)
supabase link --project-ref taktwwwpcyxhyylzmgho

echo ""
echo "⚙️  Executing SQL fix..."
echo ""

# Create the SQL file
cat > /tmp/fix-rls.sql << 'EOF'
-- EMERGENCY: Disable RLS on all tables to restore login functionality
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'projects', 'proposals', 'services', 'messages');
EOF

# Execute the SQL
echo "Running SQL commands..."
supabase db execute -f /tmp/fix-rls.sql --project-ref taktwwwpcyxhyylzmgho

echo ""
echo "✅ RLS DISABLED SUCCESSFULLY!"
echo ""
echo "🎉 Login should now work at: https://prestacerto.com.br/login"
echo ""
echo "Next steps:"
echo "1. Go to https://prestacerto.com.br/login"
echo "2. Try to login or create an account"
echo "3. If still not working, check Vercel logs"
echo ""

# Cleanup
rm -f /tmp/fix-rls.sql

echo "Done!"
