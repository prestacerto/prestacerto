import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: courses } = await supabase
      .from('academy_courses')
      .select('*, enrollments(count)')
      .order('created_at', { ascending: false });

    const { data: enrolled } = await supabase
      .from('academy_enrollments')
      .select('course_id')
      .eq('user_id', user.id);

    const enrolledIds = enrolled?.map((e) => e.course_id) || [];

    return NextResponse.json({
      courses: (courses || []).map((c) => ({
        ...c,
        enrolled: enrolledIds.includes(c.id),
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { course_id } = body;

    const { data, error } = await supabase
      .from('academy_enrollments')
      .insert({
        user_id: user.id,
        course_id,
        enrolled_at: new Date(),
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ enrollment: data?.[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
