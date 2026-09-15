import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, manual = false } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Get user's agent config
    const { data: config, error: configError } = await supabase
      .from('sales_agent_configs')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (configError || !config) {
      return NextResponse.json(
        { error: 'No agent configuration found' },
        { status: 404 }
      );
    }

    // Create run record
    const { data: run, error: runError } = await supabase
      .from('agent_runs')
      .insert({
        user_id: userId,
        config_id: config.id,
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (runError || !run) {
      return NextResponse.json(
        { error: 'Failed to create run record' },
        { status: 500 }
      );
    }

    // Get prospects that need contact (limit to prospects_per_day)
    const { data: prospects, error: prospectsError } = await supabase
      .from('sales_agent_leads')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['pending', 'contacted'])
      .limit(config.prospects_per_day || 10);

    if (prospectsError) {
      await supabase
        .from('agent_runs')
        .update({
          status: 'failed',
          error_message: prospectsError.message,
          completed_at: new Date().toISOString(),
        })
        .eq('id', run.id);

      return NextResponse.json(
        { error: 'Failed to fetch prospects' },
        { status: 500 }
      );
    }

    // Process each prospect
    let leadsQualified = 0;
    let messagesSent = 0;
    const results = [];

    for (const prospect of prospects || []) {
      try {
        // Create system prompt based on config
        const systemPrompt = `Você é um agente de vendas B2B especializado em ${config.icp_description || 'prospecção de clientes'}.

Seu objetivo é:
1. Analisar se o prospect se encaixa no perfil desejado
2. Qualificar o lead com score de 0-100
3. Gerar uma mensagem de contato personalizada

Perfis de interesse: ${config.target_personas?.join(', ') || 'Não especificado'}

Canais disponíveis: ${config.channels?.join(', ') || 'email'}

Responda SEMPRE em JSON com este formato:
{
  "qualified": true/false,
  "score": número 0-100,
  "reasoning": "explicação breve",
  "message": "mensagem personalizada de contato"
}`;

        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 500,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: `Analise este prospect para nosso programa de vendas:

Nome: ${prospect.name}
Empresa: ${prospect.company}
Email: ${prospect.email}
Telefone: ${prospect.phone}
Dados: ${prospect.raw_data || 'Não disponível'}`,
            },
          ],
        });

        const textContent = response.content.find((c) => c.type === 'text');
        if (!textContent || textContent.type !== 'text') {
          throw new Error('Invalid response from Claude');
        }

        let analysisResult;
        try {
          // Extract JSON from response
          const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('No JSON found in response');
          }
          analysisResult = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('Failed to parse Claude response:', textContent.text);
          analysisResult = {
            qualified: false,
            score: 0,
            reasoning: 'Falha ao processar resposta',
            message: '',
          };
        }

        // Update prospect with analysis
        await supabase
          .from('sales_agent_leads')
          .update({
            score: analysisResult.score || 0,
            status: analysisResult.qualified ? 'qualified' : 'pending',
            updated_at: new Date().toISOString(),
          })
          .eq('id', prospect.id);

        // Log if qualified
        if (analysisResult.qualified) {
          leadsQualified++;

          // Create message record
          await supabase
            .from('sales_agent_messages')
            .insert({
              user_id: userId,
              lead_id: prospect.id,
              channel: config.channels?.[0] || 'email',
              message_content: analysisResult.message,
              status: 'drafted',
              created_at: new Date().toISOString(),
            });

          messagesSent++;
        }

        // Log run activity
        await supabase
          .from('agent_run_logs')
          .insert({
            run_id: run.id,
            user_id: userId,
            log_type: analysisResult.qualified ? 'qualified' : 'analyzed',
            message: `Prospect ${prospect.name} - Score: ${analysisResult.score}`,
            prospect_id: prospect.id,
          });

        results.push({
          prospect_id: prospect.id,
          name: prospect.name,
          qualified: analysisResult.qualified,
          score: analysisResult.score,
        });
      } catch (error) {
        console.error(`Error processing prospect ${prospect.id}:`, error);

        await supabase
          .from('agent_run_logs')
          .insert({
            run_id: run.id,
            user_id: userId,
            log_type: 'error',
            message: `Erro ao processar ${prospect.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            prospect_id: prospect.id,
          });
      }
    }

    // Update run with results
    await supabase
      .from('agent_runs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        leads_discovered: prospects?.length || 0,
        leads_qualified: leadsQualified,
        messages_sent: messagesSent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', run.id);

    // Update schedule's next_run_at if this was a scheduled run
    if (!manual) {
      const { data: schedule } = await supabase
        .from('agent_schedules')
        .select('*')
        .eq('config_id', config.id)
        .single();

      if (schedule) {
        const nextRun = calculateNextRun(schedule.frequency, schedule.day_of_week, schedule.time_of_day);
        await supabase
          .from('agent_schedules')
          .update({
            last_run_at: new Date().toISOString(),
            next_run_at: nextRun.toISOString(),
          })
          .eq('id', schedule.id);
      }
    }

    return NextResponse.json({
      success: true,
      run_id: run.id,
      prospects_processed: prospects?.length || 0,
      leads_qualified: leadsQualified,
      messages_sent: messagesSent,
      results,
    });
  } catch (error) {
    console.error('Agent run error:', error);
    return NextResponse.json(
      { error: 'Failed to run agent' },
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
    next.setDate(next.getDate() + 3); // Every 3 days approximately
  }

  return next;
}
