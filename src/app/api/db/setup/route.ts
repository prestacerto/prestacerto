import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Verifica se tabelas existem tentando fazer um SELECT
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Supabase não configurado', success: false },
        { status: 500 }
      );
    }

    // Faz um test select em cada tabela
    const tables = ['projects', 'proposals', 'transactions'];
    const results: Array<{ table: string; exists?: boolean; status?: number; error?: string }> = [];

    for (const table of tables) {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/${table}?limit=1`, {
          headers: {
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
          },
        });

        results.push({
          table,
          exists: res.ok,
          status: res.status,
        });
      } catch (e) {
        results.push({ table, exists: false, error: String(e) });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Verificação de tabelas completa',
      tables: results,
      note: 'Execute migrations.sql no Supabase SQL Editor se tabelas não existem',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
