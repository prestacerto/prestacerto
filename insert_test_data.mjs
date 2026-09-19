import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://taktwwwpcyxhyylzmgho.supabase.co'
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1N1cGVyYWRtaW4iOnRydWUsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJleHAiOjk5OTk5OTk5OTksImlhdCI6MCwiaXNzIjoic3VwYWJhc2Utb2sifQ.qHT3E2VvQ4R5Uz9N3Qy0LzPlCT3W2gNnU5HxT1gJ_Sw'

const supabase = createClient(supabaseUrl, serviceKey)

async function insertTestData() {
  console.log('Inserindo dados de teste...')

  // Inserir subscriptions
  const { data: subData, error: subError } = await supabase
    .from('assiny_subscriptions')
    .insert([
      {
        mode: 'live',
        subscription_id: 'sub_test_pro_1',
        customer_email: 'teste1@prestacerto.com.br',
        plan: 'pro',
        active: true,
        last_event_id: 'evt_test_1',
        last_occurred_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        mode: 'live',
        subscription_id: 'sub_test_pro_2',
        customer_email: 'teste2@prestacerto.com.br',
        plan: 'pro',
        active: true,
        last_event_id: 'evt_test_2',
        last_occurred_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        mode: 'live',
        subscription_id: 'sub_test_business_1',
        customer_email: 'teste3@prestacerto.com.br',
        plan: 'business',
        active: true,
        last_event_id: 'evt_test_3',
        last_occurred_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ])

  if (subError) {
    console.error('Erro ao inserir subscriptions:', subError)
  } else {
    console.log('✅ Subscriptions inseridas:', subData?.length)
  }

  // Inserir eventos
  const { data: evtData, error: evtError } = await supabase
    .from('assiny_events')
    .insert([
      {
        mode: 'live',
        event_id: 'evt_test_1',
        subscription_id: 'sub_test_pro_1',
        event_type: 'approved_purchase',
        customer_email: 'teste1@prestacerto.com.br',
        plan: 'pro',
        active: true,
        occurred_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        outcome: 'applied'
      },
      {
        mode: 'live',
        event_id: 'evt_test_2',
        subscription_id: 'sub_test_pro_2',
        event_type: 'approved_purchase',
        customer_email: 'teste2@prestacerto.com.br',
        plan: 'pro',
        active: true,
        occurred_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        outcome: 'applied'
      },
      {
        mode: 'live',
        event_id: 'evt_test_3',
        subscription_id: 'sub_test_business_1',
        event_type: 'approved_purchase',
        customer_email: 'teste3@prestacerto.com.br',
        plan: 'business',
        active: true,
        occurred_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        outcome: 'applied'
      }
    ])

  if (evtError) {
    console.error('Erro ao inserir eventos:', evtError)
  } else {
    console.log('✅ Eventos inseridos:', evtData?.length)
  }

  // Inserir pagamentos
  const { data: payData, error: payError } = await supabase
    .from('assiny_payments')
    .insert([
      {
        mode: 'live',
        event_id: 'evt_test_1',
        subscription_id: 'sub_test_pro_1',
        event_type: 'approved_purchase',
        plan: 'pro',
        amount_cents: 5990,
        payment_method: 'PIX',
        customer_email: 'teste1@prestacerto.com.br',
        occurred_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        mode: 'live',
        event_id: 'evt_test_2',
        subscription_id: 'sub_test_pro_2',
        event_type: 'approved_purchase',
        plan: 'pro',
        amount_cents: 5990,
        payment_method: 'CARTÃO',
        customer_email: 'teste2@prestacerto.com.br',
        occurred_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        mode: 'live',
        event_id: 'evt_test_3',
        subscription_id: 'sub_test_business_1',
        event_type: 'approved_purchase',
        plan: 'business',
        amount_cents: 9990,
        payment_method: 'BOLETO',
        customer_email: 'teste3@prestacerto.com.br',
        occurred_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ])

  if (payError) {
    console.error('Erro ao inserir pagamentos:', payError)
  } else {
    console.log('✅ Pagamentos inseridos:', payData?.length)
  }

  console.log('\n✅ Dados de teste inseridos com sucesso!')
  console.log('Dashboard deve mostrar:')
  console.log('  Pro: 2 subscriptions ativas')
  console.log('  Business: 1 subscription ativa')
  console.log('  MRR: R$ 179,70')
}

insertTestData().catch(console.error)
