# Assiny: validade do acesso pago e cancelamento

**Status: implementação local, NÃO APLICADA no Supabase e rollout desligado.** Projeto correto: `taktwwwpcyxhyylzmgho`. A conta Supabase acessível nesta auditoria não administra esse projeto. Não houve alteração remota, evento de pagamento enviado nem cancelamento real. O agente principal coordena aplicação e deploy.

A migration `20260912073037_assiny_access_lifecycle.sql` foi criada com `npx supabase migration new assiny_access_lifecycle` (CLI 2.113.0). O esquema anterior `20260909151701_assiny_event_ledger.sql` foi auditado diretamente; a migration antiga, não aplicada, de outro checkout não foi transplantada.

## Contrato confirmado e limite da automação

A [compra aprovada oficial](https://assiny.gitbook.io/assiny-docs/webhooks/payloads/compra-aprovada) usa `approved_purchase`, `offer.subscription.id/recurrence/cycle`, `transaction.id/status/updated_at`. O parser continua exigindo oferta, produto, projeto e organização verificados, BRL, preço esperado, assinatura mensal e status `paid`. A vinculação continua exigindo checkout assinado de um usuário autenticado ou reconciliação independente por operador; e-mail correspondente não concede acesso.

A [estrutura da transação](https://assiny.gitbook.io/assiny-docs/webhooks/estrutura-dos-dados/transaction) define `updated_at` como atualização da transação, não como `paid_at`. Não documenta o fim do período da assinatura. `smart_installment.next_charge` pertence ao parcelamento inteligente e não é usado como fim do acesso.

**Regra local explícita para novos pagamentos mensais: `paid_through = transaction.updated_at + 1 mês calendário em UTC`.** É uma regra de acesso adotada pela aplicação com o melhor timestamp disponível, não um período certificado pelo provedor. Preserva o horário UTC e limita o dia ao último dia do mês: 31/jan → 28/fev (29 em ano bissexto). Cada nova compra calcula seu próprio prazo; não soma um mês ao prazo salvo nem usa a chegada do webhook. Ciclos posteriores não inventam um aniversário ausente no contrato. Assinaturas já vinculadas exigem um prazo independente revisado antes da migração.

O painel autenticado e a [integração oficial Curseduca](https://assiny.gitbook.io/assiny-docs/integracoes/curseduca) confirmam os rótulos “Assinatura cancelada” e “Renovação de Assinatura”, mas não fornecem o nome técnico do evento nem seu JSON. Nenhum payload real estava disponível nos logs acessíveis. O parser nativo continua retornando **422** para eventos de lifecycle desconhecidos. Não foi inventado `subscription_cancelled`, e o ciclo completo de cancelamento nativo **não está validado**. É necessário obter um exemplo autenticado do JSON de cancelamento/renovação/reativação para ampliar o parser com segurança.

Mesmo sem esse webhook, cancelar a recorrência no painel Assiny ou deixar de ter uma nova compra aprovada faz o acesso terminar automaticamente na última janela paga. `refused` continua reconhecido e ignorado sem ampliar essa janela. O SQL aceita os eventos internos/legados explícitos de cancelamento, suspensão e expiração para preservar o prazo existente; o parser legado é restrito ao modo de teste. `subscription.activated` e `subscription.renewed` sozinhos deixaram de autorizar pagamento. Estorno/chargeback confirmado revoga imediatamente. Não existe nova API pública de cancelamento nem integração de API Assiny presumida.

## Implementação e segurança

- `paid_through`, último pagamento, cancelamento e revogação ficam no ledger. Duplicata e conflito de hash mantêm a mesma identidade; evento antigo não renova acesso. Mudanças financeiras conservam o vínculo verificado.
- `billing_private.assiny_plan_baselines` preserva grants não Assiny. A primeira vinculação captura a base antes de conceder o plano pago; outra assinatura não pode transformar o cache pago em grant permanente. Recompensas de indicação passam pelo RPC restrito `grant_non_assiny_plan` assim que o RPC está instalado, inclusive antes de ligar a flag de leitura.
- A migration adquire o mesmo advisory lock do ingest/bind e também o lock da tabela **antes** do guard. Um webhook/bind concorrente não pode inserir um vínculo entre a verificação e a substituição das funções. O teste local cobre os guards; não simula concorrência entre conexões do Supabase.
- Todo usuário live já vinculado requer base revisada, e cada assinatura vinculada requer `assiny_window_reconciliation` com período, referência e operador. Sem esses registros a transação aborta com `assiny_existing_bindings_require_base_plan_and_period_reconciliation`. Nenhum prazo de cliente existente é inferido ao habilitar a migration.
- `get_effective_plan` autoriza somente `auth.uid() = p_user_id`. Anônimo, UID ausente e outro usuário são recusados. Tabelas privadas têm RLS, sem grants para browser; mutações são restritas a `service_role`/operador. Funções internas têm `search_path` vazio. O wrapper precisa `SECURITY DEFINER` para consultar o ledger privado, com grants explícitos e verificação de UID.
- `getUserPlan` e `getProfile` normalizam o prazo; PDF e gates de API que já usam esses helpers acompanham o plano efetivo. Trigger de propostas, reserva atômica de IA e a policy existente de criação de equipe consultam prazo na própria autorização. Assim, a segurança não depende da pontualidade do cron. Badges públicos e relatórios usam `profiles.plan`, atualizado pelo cron, com atraso esperado de até um minuto.
- `expire_assiny_access()` atualiza o cache sem login/webhook novo. É idempotente e preserva o maior plano independente ou ainda pago. A confirmação de checkout exige período válido e ausência de revogação assim que o RPC está instalado, inclusive antes de ligar a flag de leitura.

## Preflight e aplicação pelo proprietário

Consultas iniciais somente leitura, sem e-mail ou nome:

```sql
select mode, count(*) total,
  count(*) filter (where user_id is not null) vinculadas,
  count(*) filter (where user_id is null) sem_vinculo,
  count(*) filter (where active) flag_ativa
from public.assiny_subscriptions group by mode;
select plan, count(*) perfis from public.profiles group by plan;
select mode,event_type,outcome,count(*) eventos,min(occurred_at) primeiro,max(occurred_at) ultimo
from public.assiny_events group by mode,event_type,outcome order by mode,event_type,outcome;
```

1. Confirmar o projeto `taktwwwpcyxhyylzmgho`, backup e acesso de proprietário. Revisar cada vínculo live com dados da compra/assinatura e origem do grant. Antes do marcador `OPERATOR RECONCILIATION POINT` na migration, adicionar inserts exatos e revisados nas duas tabelas privadas criadas acima do marcador: uma base por usuário e um período por assinatura. `paid_through = null` somente quando a ausência de acesso estiver comprovada. Não remover o guard para adivinhar `free`, copiar `profiles.plan` ou aplicar mês retroativamente a vínculos existentes.
2. Executar a migration revisada; o próprio arquivo contém `BEGIN/COMMIT`, inclusive para uso no SQL Editor. Confirmar os planos e prazos esperados dos clientes existentes. Os dados sem vínculo podem ganhar prazo calculado a partir do registro histórico, mas continuam sem conceder acesso a conta alguma. Não há claim por e-mail.
3. Executar `supabase/operations/assiny-expiry-cron.sql` como proprietário no projeto correto. Ele instala `pg_cron` se necessário e agenda `select public.expire_assiny_access();` a cada minuto com nome estável `prestacerto-assiny-expiry`. Repetir a configuração atualiza o job existente. Não requer Edge Function, `pg_net`, token HTTP ou variável secreta nova. Conferir `cron.job` e ao menos uma execução agendada com `status = succeeded` em `cron.job_run_details`. Guia vigente: [Supabase Cron Quickstart](https://supabase.com/docs/guides/cron/quickstart).
4. Validar o RPC como usuário autenticado, rejeição de outro UID, quota após prazo vencido e execução do cron antes de definir **`ASSINY_ACCESS_LIFECYCLE_ENABLED=true`** no servidor e fazer deploy. A variável é uma chave de rollout, **não prova instalação da migration nem saúde do cron**. Com ela ausente/false, as leituras de plano/status mantêm o comportamento prévio e não consultam colunas/RPCs novos; isso permite releases independentes. Indicações tentam primeiro `grant_non_assiny_plan`, para preservar grants durante a troca: somente `PGRST202` (função ausente) com flag desligada permite o caminho antigo. Falha de rede, permissão, SQL ou função ausente com flag ligada não permitem fallback. Com true, erro no RPC não recai no cache pago: retorna Free; erro na consulta de confirmação retorna 503.
5. Manter `ASSINY_WEBHOOK_SECRET`, integração verificada, checkout assinado e credenciais de servidor existentes. Não alterar preços ou IDs de oferta. Obter o JSON nativo de cancelamento para uma integração posterior validada por fixture. Monitorar falhas/atrasos do job e webhooks 422/500; interrupção do cron não deve autorizar prazo vencido pelas regras atualizadas.

Aplicar SQL muda imediatamente as quotas do banco; coordenar a habilitação da aplicação na mesma janela de release. Não habilitar a variável antes dessa validação. Desligá-la depois de aplicar o banco não reverte as regras SQL nem é rollback completo; preservar o ledger e corrigir a configuração pela frente.

## Verificação local reproduzível

```sh
PGLITE_MODULE_PATH=/tmp/prestacerto-sql-qa-20260912/node_modules/@electric-sql/pglite \
  node scripts/test-assiny-lifecycle-sql.cjs
node --test __tests__/assiny-ledger.test.cjs __tests__/plan-resolution.test.cjs __tests__/payment-conversions.test.cjs __tests__/assiny-referral-rollout.test.cjs
node --require ./scripts/register-test-typescript.cjs --test __tests__/assiny-native.test.ts __tests__/assiny-validation.test.ts
npx eslint src/lib/auth/getUser.ts src/lib/plans/features.ts src/lib/supabase/referrals.ts src/lib/payments/assiny.ts src/app/api/payments/assiny-status/route.ts
```

O harness versionado usa Postgres real em memória via PGlite 0.5.8 instalado **fora** do projeto, sem conexão remota. Também aceita um módulo PGlite resolvível normalmente quando `PGLITE_MODULE_PATH` não está definido. Executa o esquema essencial existente, a migration nova e os SQLs de teste dentro de transações revertidas. As verificações incluem: guard de base e período, reconciliação explícita, backfill não vinculado, grants independentes, Jan31/ano bissexto/fuso/virada de ano, duplicata/conflito/stale, cancelamento/estorno/chargeback, múltiplos planos, fallback, cron idempotente, UID/roles, e execução real das quotas de propostas/IA e policy de equipe com cache propositalmente vencido.

Resultado local: **8 grupos SQL, 34 testes CJS e 14 testes TS passaram; ESLint dos cinco arquivos passou.** PGlite não implementa o worker `pg_cron`; instalação, credenciais do agendador e execução recorrente permanecem verificações do proprietário no Supabase. Não houve teste de webhook de cancelamento real, chamada de cobrança, schema remoto ou alteração em outro projeto.
