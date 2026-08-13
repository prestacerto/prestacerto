import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { amount } = body;

    const monthlyPayment = Math.floor(amount * 1.03);
    const taxFee = Math.floor(amount * 0.02);
    const totalCost = monthlyPayment + taxFee;

    const { data, error } = await supabase
      .from('loan_requests')
      .insert({
        user_id: user.id,
        requested_amount: amount * 100,
        monthly_payment: monthlyPayment * 100,
        tax_fee: taxFee * 100,
        status: 'pending',
        interest_rate: 3,
        created_at: new Date(),
      })
      .select();

    if (error) throw error;

    return NextResponse.json({
      loan: data?.[0],
      totalCost,
      monthlyPayment,
      taxFee,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data } = await supabase
      .from('loan_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ loans: data || [] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
