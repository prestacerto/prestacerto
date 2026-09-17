# Landing pages regionais para prestadores

## Rota

As páginas usam a rota `/prestadores/[cidade]`. A primeira URL para campanhas é:

`/prestadores/sao-paulo`

O template usa a fonte central `src/lib/data/landing-data.ts`. Para uma nova cidade, inclua uma entrada em `CIDADES` com o slug, nome exibido e UF. A página, os metadados e a geração estática passam a reconhecer o novo slug automaticamente.

## Campanhas e atribuição

Os links podem usar UTMs usuais (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`). Ao enviar o formulário, a origem e os UTMs informados são armazenados junto à mensagem de contato. O formulário exige consentimento explícito para o contato por e-mail e informa como cancelar.

## Conteúdo e dados

Use somente fatos verificáveis sobre cada cidade. Não adicione números de demanda, renda, taxa de conversão ou depoimentos sem uma fonte aprovada. A prova social do site permanece limitada às marcas já autorizadas na home.
