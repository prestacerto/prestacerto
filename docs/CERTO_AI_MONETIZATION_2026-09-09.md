# Certo AI — preparação da monetização em 09/09/2026

## Estado real

Código e banco preparados para reescrita com cota atômica. Geração real e cobrança permanecem desativadas: a Vercel não tem OPENAI_API_KEY, credencial privada Supabase nem segredo Assiny. Não houve chamada paga nem compra de teste. Resultados de geração nos testes automatizados são mocks explicitamente controlados.

## Implementação

- Três rotas de reescrita (`ai/improve-proposal`, `certo-ai/rewrite-proposal`, `ai/optimize-proposal`) chamam a mesma proteção antes do provedor.
- Plano vem de profiles.plan, lido no banco no momento da reserva. Free: três solicitações de reescrita por mês UTC. Briefings têm três solicitações gratuitas independentes, compartilhando o teto financeiro. Pro e Business não usam a cota gratuita; têm teto financeiro.
- Reserva de US$ 0,01 por tentativa. Uso final confirmado substitui a reserva pelo custo calculado dos tokens; sem confirmação, a reserva permanece. Isso impede que timeouts ou falhas de gravação liberem chamadas gratuitas. Tentativas enviadas podem consumir cota mesmo quando a resposta se perde; a interface informa isso.
- Tetos iniciais de custo: Free US$ 0,30, Pro US$ 2, Business US$ 5 por usuário/mês; US$ 100 para o conjunto destas chamadas no mês. São limites operacionais, não preços de venda. Alterações exigem revisão da função no banco. As vendas continuam fechadas até a definição e divulgação dos limites comerciais.
- Trava transacional global curta serializa apenas reserva e contabilização, não a geração. Chamadas em diferentes instâncias compartilham o mesmo limite. Há índice por data/usuário. Reavaliar contenção e agregação mensal antes de grande escala.
- Modelo limitado a gpt-4o-mini no endpoint oficial; entrada serializada limitada a 24.000 bytes, saída a 500 tokens, timeout de 25 segundos e nenhuma repetição automática. Outro modelo/endpoint exige revisão do orçamento e fica bloqueado por padrão.
- Preço conservador de entrada sem desconto de cache: US$ 0,15/milhão; saída US$ 0,60/milhão, conferidos na [documentação oficial do modelo](https://developers.openai.com/api/docs/models/gpt-4o-mini). Mudanças de preço exigem revisão; o teto é uma estimativa operacional baseada nessa tabela.
- Criadas ai_model_prices e ai_usage_events para a medição existente. A proteção financeira usa certo_ai_requests como fonte autoritativa; o registro analítico secundário pode falhar sem liberar a reserva. certo_ai_usage antiga continua ausente e já não é necessária para estas rotas.
- RLS habilitada; navegador não pode ler, inserir, liquidar ou apagar reservas. Funções SECURITY INVOKER com search_path vazio e EXECUTE somente para service_role. Não são armazenados rascunhos na tabela de reservas.
- Usuários conectados acessam o editor em /certo-ai#reescrever; o formulário do marketplace mostra cota restante e link para planos quando a cota acaba. Telas duplicadas do otimizador e coach reutilizam a interface real. Removidos resultados prontos, taxas de ganho inventadas, fallback para demo e preços avulsos contraditórios. O botão de reescrita não bloqueia o gratuito antes de consultar o servidor.
- Endpoint demo responde 410. Comparações/dicas legadas respondem 503 e não chamam Anthropic. Screening tem trava explícita e permanece desativado; CERTO_AI_SCREENING_ENABLED não deve ser ligado antes da implementação de autorização, cota e testes próprios.

## Evidências

- 19 testes automatizados aprovados: dez de IA, nove de propostas/planos.
- Testes SQL com ROLLBACK antes e depois da aplicação: permissões, três tentativas, cota independente de briefing, liquidação idempotente, Pro, Business, mudança de mês e teto global.
- Concorrência real no PostgreSQL: 12 pedidos em conexões separadas, 3 autorizados e 9 bloqueados. Conta e reservas de teste removidas. Arquivo: `launch-evidence/2026-09-09-ai-concurrency.json`.
- Build local e build Vercel aprovados, incluindo TypeScript. ESLint sem erros; permanece o aviso preexistente de memoização do React Hook Form.
- Deployment final `dpl_EUxRdUCYVKSvApAEfxqRbVKSnikS`, alias prestacerto.com.br confirmado. Nove verificações autenticadas aprovadas: todas as rotas mostram indisponibilidade configurada, demo encerrada, editor renderizado em /certo-ai, nenhuma reserva sem credenciais e conta temporária removida. Treze verificações públicas aprovadas. Evidências: `launch-evidence/2026-09-09-ai-production.json` e `2026-09-09-ai-public.json`. Estes testes não comprovam geração ou cobrança real.
- Advisors: zero ERROR e os mesmos três WARN anteriores para formulários/visitas públicos; nenhum aviso novo nas tabelas e funções de IA.

## Atualização posterior da cobrança

Persistência, idempotência, ordenação e vínculo interno por assinatura foram implementados; a trigger de atribuição por e-mail foi desativada. Veja [o estado atual do Assiny](ASSINY_INTEGRATION_2026-09-09.md). A lista abaixo registra as dependências identificadas antes dessa correção; contrato real, vínculo automático e validade do período pago ainda precisam ser resolvidos.

## Dependências identificadas na etapa inicial

1. Configurar credenciais privadas no ambiente correto e testar geração real com conta controlada, conferindo reserva, tokens, custo e resultado. A senha de conexão direta do banco não deve ser colocada na aplicação como substituta da chave administrativa.
2. Validar uma entrega autenticada do Assiny usando o formato real do provedor. A busca pública não encontrou documentação técnica suficiente para assumir campos/eventos. O parser atual permanece uma hipótese de integração.
3. Implementar histórico idempotente de eventos, ordenação e vínculo por assinatura. Hoje o webhook compara e-mail/plano e pode tratar cancelamentos de assinaturas diferentes do mesmo plano como equivalentes. Não habilitar checkout nesse estado.
4. Confirmar propriedade do e-mail ou implementar vínculo seguro à conta: o Auth está com confirmação automática e a trigger histórica de pending_subscriptions atribui plano por e-mail. Uma data de confirmação automática não comprova posse da caixa postal.
5. Validar pagamento, renovação, cancelamento e reembolso ponta a ponta antes de habilitar ASSINY_CHECKOUT_ENABLED. Nenhuma compra real está autorizada por estes testes técnicos.

## Aplicação e rollback

Migração `20260909144926_certo_ai_atomic_budget.sql` aplicada ao projeto taktwwwpcyxhyylzmgho por PostgreSQL com validação TLS, em transação. Não presumir registro em supabase_migrations: não foi utilizado db push. Não reaplicar sem verificar a existência das funções/tabela (criação sem IF NOT EXISTS para as reservas).

Rollback de aplicação: deployment anterior `dpl_8PnmKxUa7PyFUCxPxRHCDxj3vaN8`. As novas tabelas podem permanecer, sem interferir no marketplace gratuito. Manter IA e checkout desativados se voltar ao código anterior, que não possui a mesma proteção. Não apagar o histórico financeiro para realizar rollback.
