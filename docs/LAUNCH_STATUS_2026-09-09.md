# PrestaCerto — estado verificado em 09/09/2026

## Entrega atual

**Fluxo gratuito do marketplace publicado e verificado pela aplicação e pelo banco real. Monetização e geração por IA ainda desativadas.**

- Código atual: `/Users/cadusima/Documents/Codex/prestacerto-ajustes`.
- Produção: https://prestacerto.com.br
- Deployment final: `dpl_9dZnZccV5xgJKhoshbcAXMAJ2QSV`, READY, alias principal confirmado.
- Referência imutável: https://prestacerto-1g9hco9kh-prestacerto1.vercel.app
- O diretório `prestacerto-PROD` e o material em Downloads são cópias anteriores. O GitHub mencionado no handoff antigo não foi sobrescrito.

## Certo AI — atualização desta entrega

A reserva atômica, os tetos de custo e a unificação das três rotas de reescrita foram implementados e aplicados ao banco. Teste de 12 solicitações simultâneas autorizou somente três. Nesta atualização, passaram 19 testes automatizados, nove verificações autenticadas de IA/interface e 13 verificações públicas após o deploy final. Veja [o relatório da monetização](CERTO_AI_MONETIZATION_2026-09-09.md). A ativação real continua dependente de credenciais e da validação de cobrança descritas abaixo.

## Assiny — atualização de eventos

Persistência atômica, deduplicação, ordem dos eventos e vínculo por assinatura implementados. Atribuição automática por e-mail removida. Modo de teste isolado, sem concessão de planos. Foram aprovados 35 testes automatizados e o teste de 12 entregas simultâneas gerou um registro e 11 duplicatas. Veja [o relatório Assiny](ASSINY_INTEGRATION_2026-09-09.md); integração real, vínculo automático e validade do período pago continuam pendentes.

## Banco recuperado

A conexão Supabase do aplicativo e a sessão `cadusima / Grupo Sima` continuam sem acesso administrativo pelo painel ao projeto `taktwwwpcyxhyylzmgho`. Porém, foi recuperada uma conexão direta PostgreSQL a partir da configuração histórica do próprio projeto. Conexão autenticada como postgres, com verificação de certificado e hostname; nenhum segredo foi colocado no código ou neste relatório.

O histórico do Claude registra, em 03/08, a orientação de criar uma organização PrestaCerto e depois mostra o endereço deste banco. Isso distingue a organização original de Grupo Sima; não identifica, por si só, o e-mail proprietário.

Antes da correção, o banco tinha 46 perfis e nenhum projeto, proposta ou mensagem. Faltavam permissões SELECT/INSERT/UPDATE para authenticated nas tabelas centrais, apesar de existirem políticas RLS. Não era necessário trocar de banco nem usar uma chave administrativa no navegador.

## Correções entregues

- APIs de propostas e conversas usam a sessão autenticada e RLS.
- Permissões de perfil, projeto, proposta, conversa e serviço restauradas com colunas limitadas. Usuários comuns não podem alterar plan, email/identidade, dono dos registros nem avaliações de serviços.
- Removidos privilégios TRUNCATE/REFERENCES/TRIGGER de tabelas públicas para clientes e execução pública de funções administrativas antigas.
- Regras de propostas verificam dono, projeto aberto, preço e texto; plano gratuito respeita três propostas por mês, com trava para concorrência.
- Aceite muda projeto para in_progress e recusa propostas concorrentes na mesma transação. Freelancer não pode aceitar a própria proposta; índice impede dois aceites no mesmo projeto.
- Telas restauradas: gerenciamento do projeto pelo cliente e lista de propostas enviadas. Painel aponta para revisão de propostas; conversas incluem ambos os participantes, inclusive antes do aceite.
- Conclusão funciona com `MARKETPLACE_PAYMENT_MODE=direct`, configurado em produção: pagamento combinado diretamente, sem captura/intermediação. Removidas promessas de retenção de pagamento desse fluxo. Formulário de avaliações permanece oculto até a integração correspondente estar pronta.
- Botões de proposta/aceite/conclusão/mensagem voltam a funcionar após falhas de rede, sem apagar o texto.
- Tabela profile_views ativada: inserção de identificador diário opaco, sem IP; leitura somente pelo dono; instante da visita não pode ser escolhido pelo cliente. Visita repetida testada como duplicata.
- Campos headline e resume_url adicionados ao perfil para compatibilidade com a edição existente.
- Business agora é resolvido de profiles.plan, a mesma fonte atualizada pelo webhook Assiny. O módulo legado deixava o usuário cair em free ao consultar user_subscriptions, tabela ausente no banco.
- A rota /api/ai/improve-proposal informa 503 quando faltam credenciais e interrompe uso gratuito se não conseguir consultar a cota.

## Verificações e limites

- Builds locais e remotos aprovados, incluindo TypeScript.
- ESLint dos arquivos alterados aprovado; aviso preexistente do React Hook Form no formulário de proposta permanece documentado na entrega anterior.
- Nove testes automatizados de handlers e resolução de planos aprovados.
- Testes SQL no banco real, em transações com ROLLBACK: criação de perfis/serviços/projetos, limite mensal, propostas, mensagens, bloqueio de terceiros, aceite, conclusão, proteção de plano/email e visitas privadas. Foram repetidos após a aplicação das permissões.
- **36 verificações em produção aprovadas** com contas temporárias: cadastro/sessão de três contas, publicação, proposta, listagem, conversa, bloqueio de terceiros, aceite, páginas renderizadas, conclusão, painéis e visitas com deduplicação.
- Esses testes foram feitos por HTTP autenticado, validação do HTML renderizado e consultas ao banco; não equivalem a uma sessão manual completa de cliques em navegador móvel.
- Contas, sessões, mensagens, propostas, projetos e serviços de teste foram removidos. A primeira limpeza identificou uma dependência de FK, corrigida com exclusão dos próprios registros de teste na ordem apropriada. Conferência final: 46 perfis originais, nenhum projeto/proposta/mensagem de teste.
- Treze verificações públicas e de autorização anônima repetidas no domínio após a publicação.
- Advisors de segurança: nenhum ERROR. Restam avisos de INSERT público intencional em contact_messages, plan_interest_leads e profile_views. Eles não significam auditoria de segurança completa; formulários públicos continuam sujeitos a abuso e precisam de acompanhamento de volume.
- Nenhuma cobrança foi feita. Mensagens do teste foram trocadas exclusivamente entre contas temporárias controladas, com endereços example.invalid; nenhum contato real foi destinatário.

Evidências: `docs/launch-evidence/2026-09-09-core-production.json`, `2026-09-09-public-final.json`, `2026-09-09-security-advisors.json`. Estado anterior do esquema salvo nos arquivos database-before e database-details-before; não contêm dados pessoais de usuários nem credenciais.

## Migrações aplicadas

1. `20260909142505_restore_core_marketplace_permissions.sql`
2. `20260909143624_activate_profile_views.sql`
3. `20260909144027_harden_legacy_function_search_paths.sql`
4. `20260909144926_certo_ai_atomic_budget.sql`
5. `20260909151701_assiny_event_ledger.sql`

Aplicadas por conexão PostgreSQL direta em transações. Os arquivos são a trilha de aplicação; não se pressupõe registro automático no histórico do CLI Supabase. Não rodar novamente o primeiro arquivo sem revisar triggers/índices já existentes. Restaurar apenas deployment não desfaz migração do banco; não reverter as permissões de segurança como parte de um rollback de interface.

## Bloqueios para monetização e lançamento completo de todos os recursos

- Credencial privada Supabase no servidor para webhook/admin; a conexão recuperada ao banco não é uma chave service_role do Supabase.
- Segredo do webhook Assiny e evento real validado. Persistência/idempotência e vínculo interno por assinatura foram implementados; falta certificar o contrato do provedor, associar automaticamente a compra à conta e definir validade/reconciliação do período pago. Checkout continua desativado; resposta HTTP 200 do diagnóstico não comprova ativação de planos.
- OPENAI_API_KEY ou configuração final do provedor de IA. Não houve chamada paga de geração nesta entrega.
- As tabelas ai_usage_events, ai_model_prices e certo_ai_requests foram criadas. Cota e teto financeiro foram verificados com banco real e provedor simulado; falta a primeira geração autenticada com provedor real e conferência do custo. A tabela antiga certo_ai_usage deixou de ser usada por estas rotas.
- Auth público informa confirmação automática de e-mail. A atribuição de plano por correspondência de e-mail foi desativada; qualquer vínculo futuro exige comprovar propriedade da compra/conta. A configuração de Auth do painel não foi alterada.
- Escrow, avaliações, múltiplos usuários Business, notificações externas e demais módulos do roadmap não foram certificados como operacionais.
- Não há base para projeções como R$ 515 mil/mês nem para percentuais de melhora de contratação; esses números do documento antigo são hipóteses.

## Próxima prioridade

Prioridade atual: lançamento do PrestaCerto com os fluxos gratuitos essenciais. Monetização, melhorias opcionais e Sinal Meet ficam para a sequência. O domínio público permanece no deployment já validado; esta atualização documental não exige nova publicação.

## Rechecagem e acesso à Assiny — 09/09, 16:08 UTC

As 13 verificações públicas passaram novamente; cobrança continua desativada. Evidência: `launch-evidence/2026-09-09-launch-recheck.json`. As 36 verificações autenticadas descritas acima são da execução anterior de hoje, não foram repetidas nesta rechecagem.

O usuario disponibilizou uma sessao autenticada Assiny. Organizacao SIMA MIDIAS LTDA, projeto Sima Midias, acesso Owner visivel. Produto PrestaCerto publicado com ofertas Pro, Business e Certo AI. O webhook `prestacerto` continua ativo em `https://prestacerto.com.br/api/webhooks/assiny`; em 2026-09-09 16:30 UTC foi configurado um header privado no Assiny e a variavel `ASSINY_WEBHOOK_SECRET` no Vercel. O painel informa que a ativacao do checkout depende da verificacao de identidade de cada socio administrador. Essa etapa deve ser concluida pelo proprio responsavel na Assiny. Nenhum documento, credencial financeira ou cobranca foi enviado nesta inspecao. O login e o segredo do webhook nao certificam a integracao nem resolvem as demais pendencias de monetizacao.
