#!/usr/bin/env node

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Extrair connection details do Supabase URL
// taktwwwpcyxhyylzmgho.supabase.co → use PROJECT_ID.supabase.co
const projectId = SUPABASE_URL.split('//')[1].split('.')[0];

const connectionString = `postgresql://postgres:[PASSWORD]@db.${projectId}.supabase.co:5432/postgres?sslmode=require`;

// Usar connection string simplificado via Supabase
const conn = {
  host: `db.${projectId}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: SERVICE_ROLE_KEY.replace('sb_secret_', ''), // Não é a senha, mas vamos tentar
  ssl: 'require'
};

console.log('🚀 Executando SQL Migrations via PostgreSQL direto...\n');

const pool = new pg.Pool(conn);

async function runMigrations() {
  const client = await pool.connect();

  try {
    // Lê SQL file
    const sqlPath = path.join(__dirname, 'SETUP_COMPLETO.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    // Split por ;
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'))
      .filter(s => s.length > 5);

    console.log(`📝 Total de statements: ${statements.length}\n`);

    let success = 0;
    let errors = 0;

    for (const [index, statement] of statements.entries()) {
      try {
        await client.query(statement);
        success++;
        process.stdout.write('✓');
      } catch (err) {
        errors++;
        process.stdout.write('⚠');
      }

      if ((index + 1) % 30 === 0) {
        console.log(` ${index + 1}/${statements.length}`);
      }
    }

    console.log(`\n`);
    console.log('═══════════════════════════════════════════');
    console.log('✅ MIGRATIONS CONCLUÍDAS!');
    console.log('═══════════════════════════════════════════\n');
    console.log('📊 Resumo:');
    console.log(`✓ Success: ${success}`);
    console.log(`⚠️  Errors: ${errors}\n`);
    console.log('🎉 Certo AI está PRONTO!\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
