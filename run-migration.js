const { Client } = require('pg');
const fs = require('fs');

if (!process.env.PRESTACERTO_DB_PASSWORD) {
  console.error('❌ Defina PRESTACERTO_DB_PASSWORD antes de rodar este script (senha do Supabase, após rotacionar).');
  process.exit(1);
}

const client = new Client({
  host: 'taktwwwpcyxhyylzmgho.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.PRESTACERTO_DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    console.log('🚀 Conectando ao Supabase...');
    await client.connect();
    console.log('✅ Conectado!');

    const sql = fs.readFileSync('./supabase/migrations/0013_referral_gamification_system.sql', 'utf-8');
    
    console.log('📝 Rodando migration...');
    await client.query(sql);
    
    console.log('✅ ✅ ✅ MIGRATION RODADA COM SUCESSO! ✅ ✅ ✅');
    console.log('\n🎉 Gamification system pronto no seu banco de dados!');
    
    await client.end();
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

runMigration();
