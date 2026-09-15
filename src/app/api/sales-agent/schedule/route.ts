import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: schedule, error } = await supabase
      .from('agent_schedules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows found"
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      schedule: schedule || null,
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, frequency, time_of_day, day_of_week } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Get user's config
    const { data: config, error: configError } = await supabase
      .from('sales_agent_configs')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (configError || !config) {
      return NextResponse.json(
        { error: 'No agent configuration found' },
        { status: 404 }
      );
    }

    // Calculate next run time
    const nextRun = calculateNextRun(frequency, day_of_week, time_of_day);

    // Check if schedule exists
    const { data: existingSchedule } = await supabase
      .from('agent_schedules')
      .select('id')
      .eq('user_id', userId)
      .single();

    let schedule;

    if (existingSchedule) {
      // Update existing
      const { data, error } = await supabase
        .from('agent_schedules')
        .update({
          frequency,
          time_of_day,
          day_of_week,
          next_run_at: nextRun.toISOString(),
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      schedule = data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('agent_schedules')
        .insert({
          user_id: userId,
          config_id: config.id,
          frequency,
          time_of_day,
          day_of_week,
          next_run_at: nextRun.toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      schedule = data;
    }

    return NextResponse.json({
      success: true,
      schedule,
    });
  } catch (error) {
    console.error('Error saving schedule:', error);
    return NextResponse.json(
      { error: 'Failed to save schedule' },
      { status: 500 }
    );
  }
}

function calculateNextRun(
  frequency: string,
  dayOfWeek?: number,
  timeOfDay?: string
): Date {
  const now = new Date();
  const [hours, minutes] = (timeOfDay || '09:00').split(':').map(Number);

  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);

  if (frequency === 'daily') {
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
  } else if (frequency === 'weekly' && typeof dayOfWeek === 'number') {
    const daysUntil = (dayOfWeek - next.getDay() + 7) % 7;
    next.setDate(next.getDate() + (daysUntil === 0 && next <= now ? 7 : daysUntil));
  } else if (frequency === 'twice-weekly') {
    next.setDate(next.getDate() + 3);
  }

  return next;
}
