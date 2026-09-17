# Redesign das landings — 11/09/2026

As páginas `/para-clientes` e `/para-prestadores` passaram a apresentar primeiro os benefícios e as etapas da jornada. O formulário aparece depois desse conteúdo; os CTAs levam diretamente ao cartão do formulário. As imagens decorativas existentes do hero usam AVIF, com aproximadamente 29 KB e 22 KB. A identificação do público e as perguntas frequentes foram preservadas, sem acrescentar provas sociais ou promessas sem evidência.

Código: `c19fcd9` implementa o redesign; `4336d9c` ajusta apenas o layout no breakpoint `md` e a tipografia.

## Validação registrada

- 45 testes de `conversion-continuity` e `landing-leads-routes` passaram; ESLint dos três arquivos alterados e TypeScript também passaram.
- Revisão no navegador em 390 px e 1280 px; a última revisão em 948 px confirmou ausência de overflow horizontal.
- Nas duas jornadas, o envio vazio mostrou a validação e levou o foco ao nome. A segunda etapa do prestador foi conferida sem envio real de lead.
- Título, descrição, canonical, H1, FAQ e sitemap foram validados no SSR local pela revisão Hegel.

## Publicação

`c19fcd9` já foi publicado no deployment `dpl_39gaivUMX7bqKjAhsizFnL8s9Wye`.

`4336d9c` foi compilado, verificado no deployment isolado e promovido para `https://prestacerto.com.br` no deployment `dpl_7TTP9Wtu2CzhGR82gzWy4x3QnCfW` ([URL imutável](https://prestacerto-dugtfn70i-prestacerto1.vercel.app)). Após a promoção, ambas as páginas públicas responderam HTTP 200 com o novo layout, um H1 e o canonical correto; o sitemap público inclui as duas URLs. As duas páginas foram abertas no navegador com as imagens carregadas.

Não foi medida a taxa de conversão nem executada uma nova rodada de Lighthouse. O escopo não alterou backend, pagamentos ou outros projetos.
