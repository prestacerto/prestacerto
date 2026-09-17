# Assiny — recebimento seguro de eventos, 09/09/2026

## Estado

Persistência, deduplicação, ordenação e vínculo interno por assinatura implementados e aplicados ao banco real. Checkout permanece desativado. Nenhuma compra, geração de cobrança ou entrega originada no provedor foi executada. A validação desta entrega usa eventos sintéticos e fixtures isoladas.

O painel correto de produtor, localizado pelo link do site oficial, é https://admin.assiny.com.br/login. O endereço app.assiny.com.br usado no material antigo não resolveu DNS nesta sessão. O painel da Assiny e https://platform.openai.com/login pediram login; as sessões disponíveis não permitiram acessar integrações ou credenciais. Não enviar chaves pelo chat.

## Mudanças

- `assiny_events` registra eventos normalizados e seu hash. Não armazena payload bruto nem informações de cartão. Chave composta por modo e identificador do evento.
- `assiny_subscriptions` acompanha cada assinatura, seu último evento, estado, plano e vínculo verificado à conta.
- Uma função transacional recebe o evento, identifica repetições/conflitos, atualiza a assinatura e recalcula o maior plano entre as assinaturas ativas vinculadas ao usuário.
- Entregas simultâneas são serializadas durante a curta transação no banco. Eventos anteriores ao último ficam marcados como stale. Estados contraditórios no mesmo instante ficam em conflito; não são ordenados arbitrariamente.
- Cancelar uma assinatura Pro não remove o acesso de outra Pro ativa. Se Business termina mas Pro continua, o usuário volta a Pro; sem assinaturas ativas, volta a free.
- Cadastro não recebe mais plano por correspondência de e-mail em pending_subscriptions. A função histórica agora preserva o novo perfil sem atribuir o plano. A tabela histórica foi mantida para conciliação; antes da migração estava vazia e os 46 perfis eram gratuitos.
- Não existe endpoint público para vincular assinatura. A função interna `bind_verified_assiny_subscription` exige referência e identificação da verificação feita por operador confiável. Não verifica um comprovante por conta própria: o operador deve comprovar a propriedade da compra/conta antes de usá-la. Atribuição automática após checkout continua pendente.
- O vínculo é imutável; tentativas de transferir uma assinatura para outro usuário são recusadas, inclusive após exclusão do usuário original.
- RLS habilitada em ambas as tabelas. Nenhuma permissão para anon/authenticated. Funções SECURITY INVOKER, search_path vazio, EXECUTE somente para service_role. As APIs autorizam a entrega antes de usar o cliente administrativo.
- Modo padrão `test`: mantém registros separados e nunca altera perfis. `ASSINY_INTEGRATION_VERIFIED=true` seleciona modo live. O checkout requer esse sinal, `ASSINY_CHECKOUT_ENABLED=true`, segredo e credencial privada Supabase.
- O modo vem exclusivamente do servidor; campos mode/user_id do payload não concedem acesso.
- Autenticação aceita os headers já suportados (`x-assiny-token`, `x-assinify-token`, `x-webhook-secret`). Segredo na URL deixou de ser aceito, evitando cadastro de URLs com credenciais em logs/histórico. O formato suportado pelo provedor ainda precisa ser confirmado.
- Falha no banco responde 500 para permitir repetição. Conflito responde 409. Repetições e eventos antigos persistidos respondem 200 sem reaplicar benefícios.

## Contrato provisório, ainda não certificado com Assiny

O parser exige evento suportado, e-mail, plano exato pro/business, identificador da assinatura, identificador do evento e instante com fuso. Identificador aceito em `event_id`, `webhook_id` ou `data.event_id`; instante em `occurred_at`, `event_created_at` ou `data.occurred_at`. Não se usa horário de chegada como substituto da ordem real. Datas inválidas/futuras e IDs excessivos são rejeitados.

Esses campos constituem o contrato provisório deste adaptador; não são uma afirmação sobre o payload real da Assiny. Não foi localizada documentação oficial suficiente para certificar os campos. Um evento autenticado real pode exigir adaptação. Não copiar exemplos de Assinafy/AssinaJá: são empresas diferentes.

## Validação realizada

- 35 testes automatizados aprovados: validação antiga atualizada, oito testes novos de handler/contrato, testes de IA, planos e propostas.
- TypeScript e ESLint dos arquivos modificados aprovados.
- SQL com ROLLBACK antes e depois da aplicação: bloqueio de tomada de plano por e-mail; permissões; isolamento test/live; vínculo verificado; bloqueio de transferência; repetições; conflitos; ordenação; cancelamento por assinatura; prioridade Business/Pro e retorno ao gratuito.
- Concorrência real: 12 conexões entregaram o mesmo evento test, uma processou e 11 identificaram duplicata; exatamente um evento salvo. Registros temporários removidos, sem criar contas ou chamar o provedor. Evidência: `launch-evidence/2026-09-09-assiny-concurrency.json`.
- Advisors: zero ERROR, mesmos três WARN anteriores de INSERT público em formulários/visitas. Evidência: `launch-evidence/2026-09-09-assiny-security.json`.

Para repetir a suíte local: `node --require ./scripts/register-test-typescript.cjs --test __tests__/assiny-validation.test.ts __tests__/assiny-ledger.test.cjs __tests__/certo-ai-budget.test.cjs __tests__/plan-resolution.test.cjs __tests__/proposal-routes.test.cjs`.

## Publicação

A primeira tentativa de publicação foi bloqueada pela Vercel por autoria do commit anterior (`Claude Code <code@anthropic.com>`, herdado da configuração Git global). Esta implementação é atribuída a Codex, como os commits anteriores do projeto, sem alterar a configuração global do usuário. O bloqueio não alterou o domínio publicado.

A nova tentativa terminou e foi associada a prestacerto.com.br: deployment `dpl_9dZnZccV5xgJKhoshbcAXMAJ2QSV`, URL imutável https://prestacerto-1g9hco9kh-prestacerto1.vercel.app. Build e TypeScript remotos aprovados. Cinco verificações de diagnóstico/bloqueio do webhook e checkout passaram após a publicação, além das 13 verificações públicas. Evidências em `launch-evidence/2026-09-09-assiny-production.json` e `2026-09-09-assiny-public.json`.

## Pendências para ativação

1. Acesso ao painel confirmado em 09/09: organização SIMA MIDIAS LTDA, projeto Sima Midias, papel Owner. Produto PrestaCerto publicado com ofertas Pro (`ea5a3151-adc5-403f-adec-85c2ca6c801d`), Business (`2a179bd8-be01-4acd-89ac-e29dfe8d546e`) e Certo AI (`fc1ea248-f035-463b-afb3-42abd7bcfa71`). O webhook `prestacerto` esta ativo em `https://prestacerto.com.br/api/webhooks/assiny`, com header privado `x-assiny-token` configurado no Assiny e `ASSINY_WEBHOOK_SECRET` configurado no Vercel em 2026-09-09 16:30 UTC. O painel exige verificacao de identidade de cada socio administrador para ativar o checkout; conclusao pelo proprio responsavel ainda pendente. Tambem falta confirmar a estrutura dos eventos reais, identificadores estaveis, timestamp, produto/oferta e limites de repeticao. Nenhum documento de identidade, credencial financeira ou cobranca foi enviado nesta inspecao.
2. Validar eventos de aprovação, renovação, expiração, cancelamento e reembolso com a origem real. A semântica de cancelamento imediato versus fim do período pago precisa ser definida com os campos reais.
3. Implementar vínculo automático seguro com a conta (referência de checkout comprovada pelo servidor/provedor ou verificação de propriedade). E-mail em evento/cadastro sozinho não basta. Até lá, vínculo apenas por conciliação interna confiável.
4. Definir validade do período pago e reconciliação de eventos perdidos. Hoje o estado segue o último evento conhecido e não há rotina de expiração automática por paid-through. Não ativar vendas sem resolver isso.
5. Configurar credencial administrativa Supabase e segredo no servidor, testar primeiro em modo test e verificar persistência. Só depois validar live e habilitar checkout.
6. OpenAI: falta credencial e primeira chamada controlada. Esta migração não ativa a IA nem altera seus limites.

## Aplicação e rollback

Migração `20260909151701_assiny_event_ledger.sql` aplicada por PostgreSQL com verificação TLS, em transação. Não foi registrado automaticamente o histórico de migrações do CLI. Não reaplicar as criações sem revisar o estado existente.

Rollback da aplicação: deployment anterior `dpl_EUxRdUCYVKSvApAEfxqRbVKSnikS`. Manter checkout e modo live desativados em rollback, pois o código anterior faz atualização por e-mail. Preservar os registros financeiros e a remoção da atribuição por e-mail. Não apagar tabelas nem reativar a trigger antiga para reverter uma interface.
