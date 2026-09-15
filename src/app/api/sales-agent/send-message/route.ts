import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { sendEmail, sendWhatsApp, interpolateTemplate } from '@/lib/messaging';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, leadId, channel, message, templateId } = body;

    if (!userId || !leadId) {
      return NextResponse.json(
        { error: 'User ID and lead ID are required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Get lead
    const { data: lead, error: leadError } = await supabase
      .from('sales_agent_leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', userId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Prepare message
    const finalMessage = templateId
      ? interpolateTemplate(message, {
          name: lead.name,
          company: lead.company,
          email: lead.email,
          phone: lead.phone,
        })
      : message;

    let success = false;
    let deliveryStatus = 'failed';

    if (channel === 'email') {
      if (!lead.email) {
        return NextResponse.json(
          { error: 'Lead does not have an email address' },
          { status: 400 }
        );
      }

      const emailSubject = message.split('\n')[0]; // First line as subject
      success = await sendEmail(lead.email, emailSubject, finalMessage);
      deliveryStatus = success ? 'sent' : 'failed';
    } else if (channel === 'whatsapp') {
      if (!lead.phone) {
        return NextResponse.json(
          { error: 'Lead does not have a phone number' },
          { status: 400 }
        );
      }

      success = await sendWhatsApp(lead.phone, finalMessage);
      deliveryStatus = success ? 'sent' : 'failed';
    } else {
      return NextResponse.json({ error: 'Invalid channel' }, { status: 400 });
    }

    // Log message in database
    const { data: messageRecord, error: messageError } = await supabase
      .from('sales_agent_messages')
      .insert({
        user_id: userId,
        lead_id: leadId,
        channel,
        message_content: finalMessage,
        template_id: templateId,
        status: deliveryStatus,
        sent_at: success ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (messageError) {
      console.error('Failed to log message:', messageError);
    }

    // Update lead status if message sent
    if (success) {
      await supabase
        .from('sales_agent_leads')
        .update({
          status: 'contacted',
          last_contacted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', leadId);
    }

    return NextResponse.json({
      success,
      message_id: messageRecord?.id,
      status: deliveryStatus,
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const leadId = searchParams.get('leadId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    let query = supabase
      .from('sales_agent_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (leadId) {
      query = query.eq('lead_id', leadId);
    }

    const { data: messages, error } = await query.limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      messages: messages || [],
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
