import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('freelancer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const portfolioUrl = `https://portfolio.${process.env.NEXT_PUBLIC_DOMAIN}/${user.id}`;

    await supabase.from('user_products').upsert({
      user_id: user.id,
      product_name: 'CERTO Portfolio',
      status: 'active',
      portfolio_url: portfolioUrl,
      updated_at: new Date(),
    });

    return NextResponse.json({ url: portfolioUrl, projects: projects || [] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
