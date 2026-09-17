# Metering de IA

O PrestaCerto registra cada resposta bem-sucedida dos provedores na tabela `ai_usage_events`. A gravação acontece somente no servidor, via `SUPABASE_SERVICE_ROLE_KEY`, e não inclui prompts, respostas, telefones, e-mails ou chaves.

## Aplicação

1. Aplique `supabase/migrations/0041_ai_metering.sql` no projeto Supabase.
2. Confira os preços ativos em `ai_model_prices`. Para trocar um preço, encerre a linha vigente preenchendo `effective_to` e insira uma nova linha com `effective_from`.
3. Como alternativa operacional imediata, defina `AI_MODEL_PRICES_JSON` no ambiente do servidor. A configuração de ambiente tem prioridade sobre o banco.
4. Faça um novo deploy. O painel `/admin` passa a mostrar custo em USD, chamadas e tokens.

As visões `ai_usage_by_day` e `ai_usage_by_month` agregam chamadas, tokens e custo por projeto, produto, empresa (`organization_id`), conta e usuário. Elas e as tabelas base não concedem acesso a `anon` ou `authenticated`; leituras administrativas usam a service role depois da autorização de administrador.

Se a tabela ainda não existir ou o Supabase estiver temporariamente indisponível, a chamada de IA não falha. O erro de observabilidade é registrado no log do servidor e a resposta ao usuário continua normalmente.

## Cobertura atual

- OpenAI: briefing de projeto e melhoria/reescrita de proposta, pelo helper central do Certo AI.
- Anthropic: oito pontos de chamada entre otimização, comparação e dicas de proposta; screening de propostas; e análise de escopo do WhatsApp.
- Admin: custo do mês, chamadas, tokens e custo por produto no período selecionado.

Os demais produtos citados no planejamento do ecossistema não estavam presentes neste workspace e, por isso, não receberam integrações fictícias. Quando seus repositórios forem adicionados, reutilize `recordAiUsage` depois da resposta do provedor, passando o `product` correto e os identificadores disponíveis.
