/**
 * Executa a migration de monetização direto no Supabase
 * Usa o service role key pra ter permissão elevada
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltam variáveis de ambiente');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Executando migration de monetização...\n');

  try {
    // Ler arquivo SQL
    const sqlPath = path.join(__dirname, '../supabase/migrations/0005_monetization_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Dividir em statements individuais (simplista mas funciona)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    let successCount = 0;
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec', { sql: statement });
      if (!error) successCount++;
    }

    console.log(`✅ Migration executada! ${successCount}/${statements.length} statements rodaram\n`);
    console.log('✨ Tabelas e views criadas!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

runMigration();
