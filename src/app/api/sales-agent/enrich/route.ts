import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { enrichProspect, scoreProspectByEnrichment } from '@/lib/enrichment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, prospectId } = body;

    if (!userId || !prospectId) {
      return NextResponse.json(
        { error: 'User ID and prospect ID are required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Get prospect
    const { data: prospect, error: prospectError } = await supabase
      .from('sales_agent_leads')
      .select('*')
      .eq('id', prospectId)
      .eq('user_id', userId)
      .single();

    if (prospectError || !prospect) {
      return NextResponse.json(
        { error: 'Prospect not found' },
        { status: 404 }
      );
    }

    // Enrich the prospect
    const enrichedData = await enrichProspect(
      prospect.name,
      prospect.company,
      prospect.email,
      prospect.phone
    );

    // Calculate enrichment score
    const enrichmentScore = scoreProspectByEnrichment(enrichedData);

    // Update prospect with enriched data
    await supabase
      .from('sales_agent_leads')
      .update({
        raw_data: JSON.stringify({
          ...prospect.raw_data ? JSON.parse(typeof prospect.raw_data === 'string' ? prospect.raw_data : '{}') : {},
          ...enrichedData,
        }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', prospectId);

    return NextResponse.json({
      success: true,
      prospect_id: prospectId,
      enriched_data: enrichedData,
      enrichment_score: enrichmentScore,
    });
  } catch (error) {
    console.error('Enrichment error:', error);
    return NextResponse.json(
      { error: 'Failed to enrich prospect' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Get prospects without enrichment
    const { data: prospects, error } = await supabase
      .from('sales_agent_leads')
      .select('*')
      .eq('user_id', userId)
      .is('raw_data', null)
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      prospects: prospects || [],
    });
  } catch (error) {
    console.error('Error fetching unenriched prospects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prospects' },
      { status: 500 }
    );
  }
}
