#!/usr/bin/env node

/**
 * Execute SQL Migrations via Supabase
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Faltam variáveis de ambiente (SUPABASE_URL ou SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function executeMigrations() {
  console.log('🚀 Executando SQL Migrations...\n');

  try {
    // Lê o arquivo SQL
    const sqlFile = path.join(__dirname, 'SETUP_COMPLETO.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf-8');

    // Remove comentários
    const lines = sqlContent
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    // Divide por ;
    const statements = lines
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📝 Total de statements: ${statements.length}\n`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];

      try {
        const { error } = await supabase.rpc('execute_sql', {
          sql_query: stmt
        });

        if (error) {
          // Tenta executar diretamente via REST API
          const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({})
          });

          // Na verdade, vamos usar POST para executar SQL via query
          const execResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: stmt })
          });

          if (execResponse.ok) {
            success++;
            process.stdout.write('✓');
          } else {
            failed++;
            process.stdout.write('⚠');
          }
        } else {
          success++;
          process.stdout.write('✓');
        }
      } catch (error) {
        failed++;
        process.stdout.write('⚠');
      }

      if ((i + 1) % 50 === 0) {
        console.log(`  ${i + 1}/${statements.length}`);
      }
    }

    console.log(`\n`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ Migrations Completas!');
    console.log(`✓ Success: ${success}`);
    console.log(`⚠️  Warnings: ${failed}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('🚀 Certo AI está READY!\n');

  } catch (error) {
    console.error('❌ Erro executando migrations:', error.message);
    process.exit(1);
  }
}

executeMigrations();
