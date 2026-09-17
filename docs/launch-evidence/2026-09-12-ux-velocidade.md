# UX, velocidade e SEO — 12/09/2026

## Implementação

- Cabeçalho/rodapé públicos deixam de consultar a conta durante SSR. A apresentação personalizada usa uma única consulta compartilhada à API privada `/api/auth/navigation`, depois de montar a interface. Retorna apenas autenticação e papel permitido, sem dados pessoais; cache no-store e Vary Cookie. Rotas protegidas preservam suas verificações no servidor e RLS. Landings não fazem essa consulta.
- A home é pré-renderizada e ambas as landings usam ISR de 300 segundos, confirmado no manifest do build. Categorias usam cliente anônimo, apenas campos públicos, cache com chave por projeto e TTL de cinco minutos. Falhas não são armazenadas como catálogo vazio no cache da função. Não foi habilitado cache público para respostas de conta.
- Banners existentes passam a um diretório versionado, com cache de um ano/immutable. Nenhum pixel foi recriado; WebP na home ganhou srcset responsivo além do AVIF. URLs antigas continuam disponíveis.
- Landings: benefícios concretos, próximo passo explícito, duas etapas, detalhes opcionais recolhidos, atalho de atendimento remoto e validação que abre o campo opcional antes de focá-lo. Cancelamento ao sair da página e confirmação de sucesso estritamente booleana. Nenhum projeto é publicado pelo formulário de interesse.
- Metadados de paginação/detalhes inexistentes agora são noindex explícitos, sem canonical fictício. Consultas de sitemap em paralelo; inventário público e URLs reais preservados. Relatório específico em `2026-09-12-technical-seo.md`.

## Validação antes da publicação

- Build de produção passou; home estática e landings com revalidate=300 no `.next/prerender-manifest.json`.
- **282 testes passaram**, sem falhas/ignorados/cancelamentos; log `/tmp/prestacerto-speed-tests-final-20260912.tap`. TypeScript, ESLint dos arquivos alterados e diff check passaram.
- A primeira suíte encontrou oito falhas de harness por novas dependências/AbortController ausentes no VM. Os mocks foram atualizados sem remover assertions; a execução completa posterior passou.
- Navegador real em 390×844: ambas as jornadas com H1 único, sem overflow horizontal; CTA leva ao formulário. Formulário vazio exibe erros e foca nome; contato válido avança aos dados de projeto. Não foi enviado lead nem publicado projeto no teste. Desktop conferido separadamente.
- Baseline HTTP anterior: `2026-09-12-speed-before.json`, cinco GETs sequenciais por rota, mesma máquina. Não mede LCP/INP/CLS, conversão, ranking ou usuários simultâneos. A comparação posterior deve manter esse limite.

## Dependências mantidas

AW e rótulos de lead/compra aguardam o usuário. Avaliações e prazo Assiny dependem da migration no banco correto e validação operacional; o contrato nativo de cancelamento continua pendente. A revisão de UX/performance não remove esses bloqueios.

## Publicado e conferido no domínio oficial

Commit de entrega `6c5127f`, deployment `dpl_FYEuF7VXxsuedsVgd5xzETeHwKcd`, promovido para `https://prestacerto.com.br`. Build remoto READY e validação autenticada do candidato concluídos antes da promoção. A home mantém o layout aprovado pelo usuário. O último ajuste mobile do estado de erro de navegação entrou no build remoto definitivo; a suíte valida a fonte atual.

| Página | Resposta inicial antes (mediana) | Depois (mediana) | HTML antes (bytes) | HTML depois (bytes) |
| --- | ---: | ---: | ---: | ---: |
| `/` | 220 ms | 74 ms | 130,374 | 119,492 |
| `/para-clientes` | 480 ms | 60 ms | 108,922 | 98,776 |
| `/para-prestadores` | 422 ms | 56 ms | 120,498 | 110,360 |

Cinco GETs anônimos sequenciais por página, feitos da mesma máquina antes e depois, sem parâmetros artificiais de cache. A primeira resposta de cada página após a publicação veio como PRERENDER; as quatro seguintes como HIT. Antes, todas eram MISS. Todas as 30 respostas da comparação foram HTTP 200. É evidência de resposta inicial do HTML e de cache, **não de tempo total de carregamento no celular ou de Core Web Vitals**.

No navegador real publicado: home sem overflow, ambas as imagens carregadas pelas URLs versionadas e visual aprovado preservado. Na conferência HTTP: API de navegação sem conta retorna apenas signedIn=false/role=null e private,no-store; imagem versionada confirma max-age=31536000,immutable; sitemap com 45 páginas; plans e robots acessíveis; paginações/detalhes inexistentes anunciam somente noindex, sem canonical fictício. A consulta de logs de erro na janela de seis minutos não retornou registros.

## Cópia de entrega e Git

O arquivo de configuração do Git na pasta original ficou marcado pelo macOS como iCloud dataless; leituras bloquearam na sincronização. Foi solicitada sua recuperação com brctl, sem sobrescrever a configuração. Para publicar o código já testado, criamos uma cópia local isolada em `/Users/cadusima/.codex/workspaces/prestacerto-delivery-20260912`, conferindo SHA-256 de 979 arquivos. Foram excluídos .git, builds/dependências, .env e caches gerados. Registro: `2026-09-12-delivery-copy.json`.

A cópia recebeu commit próprio, corretamente atribuído a Codex, e usa o mesmo projeto Vercel PrestaCerto. Nenhum remoto foi substituído nem outro produto alterado. A pasta original preserva as alterações de fonte; o cache TypeScript foi regenerado depois da tentativa interrompida de restaurá-lo.
