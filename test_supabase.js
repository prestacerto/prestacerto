const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://taktxxxpcyxhyylzmgho.supabase.co',
  'sb_publishable_ArMX97jGsCK0jbe3Opd74g_ZNY2WQ36'
);

async function test() {
  console.log('🧪 Testando Supabase...\n');
  
  // Testa conexão
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'debug@teste.com',
      password: 'TestDebug123!'
    });
    
    if (error) {
      console.log('❌ Erro:', error.message);
      console.log('Código:', error.status);
    } else {
      console.log('✅ Signup OK!');
      console.log('Session:', data.session ? 'SIM' : 'NÃO (email confirmation ativado!)');
    }
  } catch (err) {
    console.log('💥 Erro crítico:', err.message);
  }
}

test();
