# Cadu — integração PrestaCerto

Data: 12/09/2026. Implementação no projeto Vercel `prestacerto`, checkout `prestacerto-lancamento-20260911`.

## Arquitetura entregue

Widget → POST /api/support/chat → motor de tenant no servidor → modelo de IA.

- Tenant fixo `prestacerto`; não é selecionável pelo visitante.
- Runtime dedicado hospedado no próprio PrestaCerto. Não representa a disponibilização de uma API SaaS multi-tenant externa do SimaAI. O site SimaAI não foi modificado nesta entrega.
- Variáveis de produção protegidas: SIMA_AI_API_URL, SIMA_AI_API_KEY, SIMA_AI_TENANT_ID, SIMA_AI_MODEL. O motor usa a OPENAI_API_KEY já existente no servidor. Nenhuma dessas chaves é enviada ao navegador.
- URL configurada: https://prestacerto.com.br/api/support/engine. A chamada interna evita uma viagem HTTP ao próprio servidor; o adaptador também aceita um serviço externo com o contrato `prestacerto-support-v1`.
- Motor protegido por comparação constante da chave e tenant. Histórico assinado, limitado e vinculado ao tenant e ao público. Mensagens de sistema do visitante são ignoradas pelo motor.
- Bucket privado Supabase `sima-prestacerto-support`, somente credencial de servidor: conversas em `conversations/AAAA-MM-DD/`, reservas em `limits/`. Nenhuma política pública de leitura foi criada.
- O bucket pertence ao Supabase do PrestaCerto, não ao banco do SimaAI. Não existe acesso do modelo ao painel, a contas, pagamentos ou ferramentas administrativas.

## Interface e conhecimento

- Widget em /, /para-clientes, /para-prestadores, /plans e /ajuda. /planos redireciona para /plans.
- Fluxos separados para cliente/prestador, texto puro, CTAs locais fixos, loading, timeout, erro com preservação do rascunho, diálogo acessível por teclado.
- O launcher se posiciona acima do aviso de privacidade quando ele está presente.
- Conhecimento versionado em src/lib/support/knowledge.ts. Preços/benefícios derivam de src/lib/plans-data.ts, usado pela página oficial de planos. Não é um crawler nem treinamento permanente do modelo.
- Orientação consultiva: benefício relevante e próximo passo; sem promessa de contratação, escassez artificial ou confirmação de transações. Perguntas desconhecidas são encaminhadas à equipe.

## Handoff e eventos

- POST /api/support/handoff registra em contact_messages usando a credencial de servidor, após validação, origem e limitação. Não abre permissões anônimas na tabela.
- Compartilhamento do contexto exige seleção explícita da caixa de consentimento no widget.
- Notificação usa a integração de e-mail existente, em caráter best-effort. Sucesso significa pedido gravado; não prova entrega à caixa de e-mail nem atendimento humano já iniciado.
- Um registro real de QA foi criado, claramente marcado como teste e não como lead. Não apagar silenciosamente.
- Eventos via analytics existente, respeitando consentimento: cadu_open, cadu_message, cadu_cta_click, cadu_plan_click, cadu_registration_started, cadu_handoff.
- Cadastro iniciado é emitido no primeiro input de /register após CTA de perfil, com atribuição de até 30 minutos. Não equivale a cadastro concluído ou compra.
- Mensagens/transcrições não são enviadas aos eventos de marketing.

## Limites e operação

- Até 15 reservas por IP/minuto e até 1.000 por dia UTC no tenant. Colisões nas reservas aleatórias podem recusar antes desses tetos: são limites máximos, não franquias garantidas.
- Sem tentativas automáticas repetidas. Um bloqueio de armazenamento retorna 429 na reserva; falha de armazenamento/modelo impede resposta de sucesso.
- Input 1.500 caracteres; histórico de até oito mensagens; saída do modelo até 350 tokens; timeout do modelo 10 segundos.
- Limite do handoff: 3/hora/IP por instância. Ainda não é uma quota distribuída de handoff.
- Observabilidade: logs support_response com latência/tokens; support_error com categoria sem transcript. Registros completos privados no bucket.
- Retenção/limpeza automática do bucket ainda não foi configurada. Definir política operacional e limpeza antes de ampliar volume. A equipe com acesso administrativo ao Supabase pode consultar os registros; não foi criado um painel analítico novo nesta integração.

## Evidências e limites dos testes

- Build Vercel e TypeScript passaram. ESLint dos arquivos da integração passou.
- Oito testes automatizados passaram: configuração fail-closed, assinatura e isolamento, fornecedor incorreto, acesso não autenticado, reservas concorrentes, throttle de armazenamento, frontend e 100 sessões simuladas.
- Adaptador simulado: pico 100, zero erros, p50 32,77 ms, p95 33,81 ms. Não mede latência real de modelo/armazenamento.
- Chrome: cinco páginas em 390×844 e 1440×1000; diálogo cabe na tela, rascunho preservado no erro, retorno de sucesso e contexto de handoff validados com transporte simulado.
- IA real: pergunta sobre Pro retornou 200 em 5,22 s externos / 4,115 s servidor, 911 tokens de entrada e 117 de saída. Pergunta pedindo confirmação de pagamento e clientes de outra empresa retornou recusa adequada em 4,23 s.
- Motor sem credencial: 401. Handoff real corrigido: 201, success:true.
- Primeira carga real de 100 requisições de um gerador: 16 respostas, 9 bloqueios 429 e 75 erros 503. Segunda: 24 respostas, 18 bloqueios, 58 erros. Logs identificaram limite 429 do Storage; a implementação foi corrigida para reduzir operações e traduzir a recusa de capacidade corretamente. Esses resultados iniciais NÃO são aprovação de capacidade.
- Reteste final no domínio: 100 requisições concorrentes, 39 respostas 200, 61 recusas 429, zero 5xx e zero erro de rede. Duração 5,59 s; respostas bem-sucedidas p50 4,315 s, p95 4,598 s. O IP visto pelo servidor não foi instrumentado nesse teste; um gerador de carga não comprova um único IP de saída. Não usar a quantidade de respostas para inferir a franquia por IP.
- Validação final em produção: diálogo abre em 390 e 1440 pixels, inclusive com aviso de cookies. Regressão de sobreposição também testada localmente com banner de 240 px.
- Cem usuários distribuídos recebendo respostas de IA simultaneamente ainda não foram certificados. Não anunciar esse SLA a clientes.

## Custo observado

Primeiro smoke: (911 × US$0,40 + 117 × US$1,60) / 1.000.000 = aproximadamente US$0,000552 de modelo. Estimativa pelos tokens, não valor faturado auditado; não inclui Vercel, Supabase, impostos nem câmbio. Conversas maiores custam mais.

Fonte de tarifa verificada em 12/09/2026: https://developers.openai.com/api/docs/models/gpt-4.1-mini.

## Publicação e reversão

- Domínio: https://prestacerto.com.br.
- Versão final publicada: dpl_AugnVZzsqbi4nRtvFRg9tC1KXH73, https://prestacerto-de1k181h0-prestacerto1.vercel.app.
- Versão anterior à integração: dpl_FYEuF7VXxsuedsVgd5xzETeHwKcd (prestacerto-2kfrld5gw-prestacerto1.vercel.app).
- Reversão de emergência: `vercel promote <deployment-anterior> --yes`, após conferir mudanças concorrentes. Isso não apaga registros nem variáveis novas.
- Reverter/desativar se chat impedir navegação/cadastro ou aparecer vazamento. Investigar aumento persistente de 5xx e latência acima de 10 s. Bloqueios 429 esperados devem ser separados dos erros.
- Há mudanças preexistentes de outras tarefas no checkout, preservadas. Não foi realizado commit amplo nem reset do repositório.
