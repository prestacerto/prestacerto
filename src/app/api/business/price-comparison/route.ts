import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill');
    const city = searchParams.get('city');

    if (!skill || !city) {
      return NextResponse.json({ error: 'Missing skill or city' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: insights } = await supabase
      .from('price_insights')
      .select('*')
      .eq('skill_name', skill)
      .eq('city', city)
      .single();

    if (!insights) {
      return NextResponse.json({
        status: 'no_data',
        message: `Sem dados de preço para ${skill} em ${city} ainda`
      });
    }

    return NextResponse.json({
      skill,
      city,
      avg_price_cents: insights.avg_price_cents,
      min_price_cents: insights.min_price_cents,
      max_price_cents: insights.max_price_cents,
      freelancers_count: insights.freelancers_count,
      your_position: 'competitive' // calcular depois com dados do user
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
