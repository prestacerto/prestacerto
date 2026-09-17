# Auditoria técnica SEO — 12/09/2026

Correções locais, sem commit/deploy pelo agente. Escopo: metadados de serviços/projetos e sitemap. Não houve alteração em landings, layout, header, consultas globais, banco ou conteúdo comercial.

## Evidência antes da alteração

Crawl anônimo com identificação Googlebot de **45 URLs de páginas do sitemap público**: todas responderam HTTP 200, sem noindex. Canonicals coincidiram com as URLs, considerando a equivalência da barra final na raiz. O XML também contém duas URLs de imagem, não contadas como páginas. Resultado bruto disponível em `/tmp/prestacerto-seo-crawl-20260912.json`.

Buscas `/services?q=web` e `/projects?categoria=design` já enviam `noindex, follow` para robots e Googlebot, com canonical limpo. Login e publicação já são noindex; páginas privadas não entram no sitemap. Slugs desconhecidos de categoria, artigo e perfil retornaram 404. URLs legadas de perfil e privacidade redirecionam permanentemente. Não havia justificativa para mudar robots.txt ou criar novas páginas por palavras-chave.

Achado: `/services?page=10000` e `/projects?page=10000` anunciavam canonical próprio e metadados de indexação, seguidos pelo noindex tardio de `notFound()`. Detalhes inexistentes também combinavam metadados gerais de indexação com o noindex do erro. Essas respostas foram observadas como HTTP 200 com streaming, inclusive para Googlebot.

## Correções

- Metadados de paginação consultam a existência do resultado antes de anunciar a página. Página inexistente recebe título de erro, noindex explícito para robots/Googlebot e não emite canonical fictício. A renderização continua chamando `notFound()`. Paginação válida conserva canonical próprio; buscas filtradas continuam noindex.
- Metadados e página compartilham a consulta por `React.cache`, limitada ao request, usando os mesmos filtros e página. A primeira página não ganhou consulta adicional de metadados.
- Detalhes inexistentes de serviço/projeto recebem metadados de erro sem canonical. Serviços inativos e projetos encerrados têm noindex explícito também para Googlebot. Canonicals válidos usam o ID devolvido pelo banco, para não transformar variações de caixa na URL em identidades distintas.
- Sitemap lê categorias, serviços, perfis e projetos concorrentemente. A paginação de 1.000 registros continua sequencial dentro de cada tabela; filtros de publicação, perfis com conteúdo, inventário regional real e RLS permanecem. Não foram adicionados `lastmod` artificiais.

A correção elimina os sinais contraditórios de metadados; **não promete transformar todo `notFound()` com streaming em status HTTP 404**. O Next pode enviar o status antes de resolver conteúdo assíncrono. Mantivemos o streaming: desabilitá-lo globalmente prejudicaria o tempo inicial de resposta. Google documenta que consegue processar metadados emitidos pelo Next no corpo quando renderiza JavaScript; noindex explícito continua sendo o sinal de exclusão. Validar as respostas finais no candidato após o build coordenado pelo agente principal.

## Testes

```sh
node --test __tests__/seo-route-metadata.test.cjs __tests__/sitemap-inventory.test.cjs
node --require ./scripts/register-test-typescript.cjs --test __tests__/seo-discovery.test.ts __tests__/search-pagination.test.ts
npx eslint src/app/sitemap.ts 'src/app/(public)/services/page.tsx' 'src/app/(public)/services/[id]/page.tsx' 'src/app/(public)/projects/page.tsx' 'src/app/(public)/projects/[id]/page.tsx'
git diff --check
```

**7 novos testes CJS + 11 testes TS existentes passaram; ESLint dos cinco arquivos e diff check passaram.** Os testes executam os exports reais de metadados e sitemap com dependências isoladas; verificam ausência de canonical/index em páginas inexistentes, mesma consulta entre metadata/page, IDs canônicos, paginação completa de 1.001 serviços, exclusão de registros privados/fechados/vazios e concorrência das leituras. Não medimos ganho de ranking, tráfego, conversão ou milissegundos de produção nesta subtarefa.

Fontes consultadas: documentação Next 16.2.12 empacotada no projeto (`generate-metadata.md`, `sitemap.md`, `robots.md`); [Google: canonicals e sitemap](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Google: noindex precisa ser acessível ao crawler](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [Google: lastmod verificável](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). A skill `marketing:seo-audit` orientou a revisão técnica dentro do escopo solicitado, sem pesquisa de concorrentes ou conteúdo em massa.
