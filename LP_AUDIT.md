# Auditoria das landing pages regionais

O artefato compartilhado contém uma página de índice de campanhas com o título `URLs das Landing Pages — PrestaCerto`. A estrutura informada é de **105 páginas no total**, organizadas em **7 categorias** e **15 cidades**, com indicação de ISR de 1 hora para dados frescos.

O padrão de URL mostrado é `https://prestacerto.com.br/contratar/[categoria]/[cidade]`, por exemplo `contratar/desenvolvimento-web/sao-paulo`, `contratar/desenvolvimento-web/rio-de-janeiro` e outras combinações regionais. O artefato também prevê uma experiência operacional de copiar cada URL para campanhas de Google Ads, Meta Ads e TikTok Ads.

No código local já existe a rota dinâmica `src/app/(public)/contratar/[categoria]/[cidade]/page.tsx`, portanto a lógica regional foi incorporada ao projeto. A pendência é confirmar se o conjunto completo de 7 categorias × 15 cidades e o índice visual de URLs do artefato estão presentes no sitemap e no deploy oficial. O domínio atual ainda serve a versão antiga no Render, então essas LPs não podem ser consideradas publicadas para o público até a nova versão substituir o artefato de produção.


## Confirmação no código

A fonte `src/lib/data/landing-data.ts` contém exatamente 15 cidades — São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba, Porto Alegre, Recife, Fortaleza, Salvador, Brasília, Campinas, Manaus, Florianópolis, Goiânia, Natal e Maceió — e 7 categorias — desenvolvimento web, mobile, design gráfico, redação e conteúdo, tradução, marketing digital e agentes de IA. `getAllLandingCombinations()` gera o produto cartesiano dessas listas, totalizando **105 combinações**, e `src/app/sitemap.ts` inclui cada URL `/contratar/[categoria]/[cidade]` no sitemap.
