# PrestaCerto — verificação e publicação de 10/09/2026

## Estado

Correções publicadas em https://prestacerto.com.br. Deployment `dpl_HJ6nq1G1bEaQspkvRawpyU4CNxP6`, READY, domínio oficial atualizado. O lançamento integral ainda depende de acessos e validação externa; não considerar a monetização concluída.

Versão imutável: https://prestacerto-oyx210ntb-prestacerto1.vercel.app. Rollback de aplicação: `dpl_9dZnZccV5xgJKhoshbcAXMAJ2QSV` (https://prestacerto-1g9hco9kh-prestacerto1.vercel.app). Nenhuma migração de banco nesta execução.

## Fonte e isolamento

A fonte correta foi confirmada pelo deployment vigente `dpl_9dZnZccV5xgJKhoshbcAXMAJ2QSV` e pelo handoff atualizado de 09/09. O código atual estava em `prestacerto-ajustes`; `prestacerto-PROD` é uma cópia antiga. Foi criada a branch isolada `codex/prestacerto-go-live-20260910` a partir de `df2b583`. Nenhum código de outros produtos ou PRs foi incorporado.

Commit das correções: `509b2c3`. Autoria vinculada à conta Vercel autenticada do proprietário e committer Codex. Isso corrige a configuração herdada `Claude Code <code@anthropic.com>`, que fazia a Vercel bloquear o deploy por autoria não reconhecida. O histórico anterior não foi reescrito.

## Correções

- Preferências de cookies agora usam o mesmo estado inicial no servidor e no navegador. A preferência salva é aplicada após a hidratação. O erro React #418 foi reproduzido no domínio antes da correção; teste local de recusa e recarregamento passou sem erros.
- Eventos de cadastro, compra e demais eventos não são enviados por funções de analytics sem consentimento. Atribuição por campanha só é gravada após consentimento.
- Service worker não guarda mais HTML autenticado, respostas de API nem dados RSC. Apenas os arquivos estáticos versionados do Next são cacheados. Na ativação, remove o cache antigo do PrestaCerto. Offline exibe página neutra, sem recuperar outra sessão.
- Redirecionamentos de login preservam o caminho e parâmetros de consulta. Cookies renovados e cabeçalhos de segurança são mantidos também em redirecionamentos por papel de usuário.
- A política de conteúdo permite imagens do Supabase e conexões de tempo real ao projeto correto, além das origens de imagem já usadas pelo produto.
- O separador “OU” do login só aparece quando o login Google está habilitado. O convite de instalação informa que projetos e mensagens precisam de conexão.

## Validação desta execução

- 58 testes automatizados aprovados, incluindo novos testes de consentimento, cache privado e redirecionamentos de sessão.
- Build local de produção aprovado, incluindo TypeScript. Preview remoto `dpl_ChTTgLocGEzHaTCtRqRw7Fpdz3qV` aprovado (READY), protegido pela autenticação da Vercel. ESLint dos arquivos alterados sem erros.
- 32 verificações HTTP aprovadas antes e depois da publicação: páginas essenciais, páginas regionais, ferramentas, robots, sitemap, manifest, saúde, validação de campos e rejeição de acessos indevidos. O 503 de webhook não configurado é uma indisponibilidade esperada, não evidência de cobrança funcionando.
- Mais 13 verificações públicas e de autorização anônima do script existente aprovadas antes e depois da publicação.
- Navegador: descrição e revisão de projeto, orçamento obrigatório, passagem para cadastro com papel cliente, troca cadastro/login mantendo destino e recuperação do botão após login inválido.
- Tela de celular em 390×844: sem overflow horizontal no cadastro. Página inicial local em 1280 px: sem overflow ou imagens quebradas, sem erros no console após recarregar com cookies recusados. Após o deploy, a home de produção passou em 1280 px e 390 px, sem overflow; nenhuma imagem quebrada ou erro no console. Preferência de cookies persistida e login sem separador órfão confirmados.
- Service worker publicado contém `prestacerto-static-v2`; cabeçalho publicado permite o WebSocket correto do Supabase. Redirecionamento real de `/dashboard/projects?status=open` preserva o parâmetro no destino de login.
- Os testes autenticados completos com criação, proposta, conversa, aceite e conclusão são evidência histórica de 09/09 (36 verificações); não foram repetidos nesta execução. Nenhuma conta, projeto ou mensagem de produção foi criada nesta execução.

## Bloqueios externos confirmados

1. **Assiny:** sessão disponível, organização SIMA MIDIAS LTDA, projeto Sima Midias. O painel continua exigindo verificação de identidade de cada sócio administrador para ativar o checkout. O responsável precisa concluir essa etapa na Assiny.
2. **Supabase:** o conector retornou sem permissão para `taktwwwpcyxhyylzmgho`. A Vercel não tem `SUPABASE_SECRET_KEY` nem `SUPABASE_SERVICE_ROLE_KEY`. Isso impede a operação administrativa do webhook e partes do admin; não substituir por chave pública nem expor chave privada no navegador.
3. **IA:** as credenciais do provedor real não estão configuradas. Não foi executada geração paga. A preparação de cotas existente passou nos testes; a geração real permanece indisponível.

## Trabalho ainda necessário para monetização

Depois dos acessos, validar o formato real dos eventos Assiny, associação segura da compra à conta, validade do período pago e pagamento/renovação/cancelamento/reembolso ponta a ponta. Só então habilitar a cobrança. Os controles de idempotência já existentes foram testados, mas fixtures sintéticas não comprovam compatibilidade real com o provedor. Múltiplos usuários Business e demais recursos não certificados não devem ser tratados como entregues.
