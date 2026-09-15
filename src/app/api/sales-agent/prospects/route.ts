import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    let query = supabase
      .from('sales_agent_leads')
      .select('*')
      .eq('user_id', userId)
      .order('score', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: prospects, error } = await query.limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      prospects: prospects || [],
    });
  } catch (error) {
    console.error('Error fetching prospects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prospects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, company, email, phone, source } = body;

    if (!userId || !name || !company) {
      return NextResponse.json(
        { error: 'User ID, name, and company are required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data: prospect, error } = await supabase
      .from('sales_agent_leads')
      .insert({
        user_id: userId,
        name,
        company,
        email,
        phone,
        source: source || 'manual',
        status: 'pending',
        score: 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      prospect,
    });
  } catch (error) {
    console.error('Error creating prospect:', error);
    return NextResponse.json(
      { error: 'Failed to create prospect' },
      { status: 500 }
    );
  }
}
