# PrestaCerto — capacidade, Assiny, avaliações e Google Ads

## Teste de carga pública em produção

Executado em 12/09/2026 contra `https://prestacerto.com.br`, antes das novas mudanças de assinatura/avaliação/Ads. Evidência completa: `2026-09-12-load-baseline.json`. Script reproduzível: `scripts/load-public.mjs`.

| Etapa | Taxa programada | Duração programada | Requisições | Falhas | p95 da resposta completa |
| --- | ---: | ---: | ---: | ---: | ---: |
| Aquecimento | 2/s | 20 s | 40 | 0 | 1.090 ms |
| Etapa 2 | 5/s | 30 s | 150 | 0 | 631 ms |
| Etapa 3 | 10/s | 30 s | 300 | 0 | 583 ms |
| Etapa 4 | 20/s | 30 s | 600 | 0 | 634 ms |

Resultado agregado: **1.090 respostas HTTP 200**, nenhuma iteração descartada, p50 **383 ms**, p95 **655 ms**, p99 **897 ms**, p95 até o primeiro cabeçalho **417 ms**. Pico observado de **16 requisições simultaneamente em andamento**. HTML transferido: 90.599.872 bytes. Os cabeçalhos `x-vercel-cache` retornaram `MISS` nas requisições.

As rotas alternadas foram `/`, `/para-clientes`, `/para-prestadores`, `/plans`, `/services`, `/projects`, `/services?q=design` e `/projects?q=marketing`. A verificação exige HTTP 200, H1, referência à marca e ausência de marcadores de erro de renderização. Consultas dos logs de erro da Vercel durante e após a execução não retornaram registros na janela consultada.

Proteções do teste: GET somente; sem cadastro, e-mail, pagamento, IA ou publicação; máximo de 40 requisições simultâneas; timeout de 10 segundos; interrupção caso a janela de 30 respostas contenha duas falhas ou p95 acima de cinco segundos.

### Interpretação e limites

- Evidência de funcionamento dessas páginas e buscas sob a taxa e duração medidas; não estabelece um limite máximo de usuários nem garantia de disponibilidade.
- Requisições HTTP não equivalem a usuários simultâneos. O teste não executa JavaScript do navegador, não baixa todos os recursos visuais e não mede LCP/INP ou redes móveis.
- Não testa volume de escritas autenticadas, disputa por projetos, SMTP, checkout Assiny, pagamentos reais ou chamadas de IA.
- O gerador é uma única máquina. Não representa geografia distribuída nem carga sustentada por horas.
- `MISS` no cache de resposta não prova ausência de outros caches internos. A aplicação usa tratamento de erro de consulta que pode produzir estado vazio; a ausência de erro HTTP isoladamente não prova integridade dos resultados do banco. A auditoria funcional de contas/projetos/propostas do dia 11 complementa essa leitura, sem substituir teste sob carga de cada escrita.
- Nenhuma proteção WAF foi desativada e nenhum serviço de monitoramento pago foi contratado.

Metodologia baseada na [orientação de testes de carga de aplicações da Vercel](https://vercel.com/kb/guide/how-to-effectively-load-test-your-vercel-application) e na [política de testes de carga](https://vercel.com/kb/guide/what-s-vercel-s-policy-regarding-load-testing-deployments).

## Acesso ao banco e ativação

A variável de produção da Vercel confirma `taktwwwpcyxhyylzmgho.supabase.co`. A conexão MCP recusou uma consulta simples de leitura com erro de permissão. A sessão aberta do Supabase mostra apenas a organização Grupo Sima, cujo projeto também chamado prestacerto tem identificador **diferente**, `vkekntnrhnucxfbxqoyg`. Esse outro projeto não foi alterado. Foi solicitado acesso à conta que administra o banco efetivamente utilizado em produção.

As novas migrations de avaliações e prazo pago só podem ser consideradas ativas após aplicação, verificação de schema e testes no banco correto. Até lá, resultado local não significa ativação em produção.

Validação SQL local executada: **34 assertivas de avaliações** e **8 grupos de verificação do ciclo Assiny**, sem falhas. Os cenários cobrem regras de acesso e duplicidade das avaliações, guarda de reconciliação de assinaturas existentes, backfill histórico, preservação de benefícios independentes, idempotência, prazo mensal e quotas. O teste usa PostgreSQL em memória via PGlite; o agendamento `pg_cron` ainda precisa ser instalado e verificado no Supabase correto.

A CLI Supabase também foi verificada; não tem token de acesso configurado. Nenhuma chave do servidor foi exposta ao navegador para contornar essa limitação.

## Contrato Assiny consultado

O webhook existente `prestacerto` está habilitado e vinculado exclusivamente ao produto PrestaCerto. A tela confirma seleção de eventos de assinatura cancelada, renovada e reativada, além dos eventos de compra. Nenhuma configuração do webhook foi alterada. O formulário mostra a seção de teste, mas não expõe controle de envio/preview; os logs consultados dos últimos 30 dias não retornaram eventos. Portanto, a lista da interface confirma a existência dos eventos, mas não estabelece por si só os nomes e campos JSON do payload.

## Google Ads

Para ativação são necessários o identificador AW e os rótulos das ações separadas de lead e compra. O usuário informou que irá buscar a tag. A presença de GA4 ou de uma tag geral não prova a configuração de uma ação de conversão do Google Ads. Nenhum identificador ou rótulo deve ser inventado.

## Validação conjunta do código

- Suíte integrada final: **260 testes passaram**, sem falhas, cancelamentos ou testes ignorados, em 21,5 segundos (`/tmp/prestacerto-integrations-repro-20260912.tap`).
- TypeScript, ESLint dos arquivos alterados, `git diff --check` e build local de produção passaram.
- A primeira execução integrada encontrou um mock da página de projeto desatualizado, corrigido para a nova seção de avaliações. Também apresentou falha isolada de arquivo no runner de Google Ads sem diagnóstico; esta não se reproduziu com/sem o registrador TypeScript nem na suíte completa final. Não foi atribuída a uma causa sem evidência, e nenhuma assertion foi relaxada.
- O build ainda registra avisos de tentativa de renderização estática em rotas que consultam cookies; concluiu com essas rotas identificadas como dinâmicas.

O código mantém `ASSINY_ACCESS_LIFECYCLE_ENABLED` desligado por padrão, preservando o comportamento atual até o rollout de banco verificado. O benefício de indicação usa o novo RPC assim que existe, com fallback legado somente para função ausente e flag desligada, evitando perda de benefícios no intervalo de ativação.

Cancelar a recorrência na Assiny e aplicar a rotina de prazo encerra o acesso ao final da última janela paga, depois da migração. **O parser dos eventos nativos de cancelamento/renovação/reativação permanece dependente de um payload oficial verificável**; não foi inventado um contrato JSON. A regra de mês calendário baseada no timestamp de aprovação é local e explícita, não um campo de fim de período certificado pela Assiny. Assinaturas live já vinculadas exigem reconciliação do plano base e período antes da migration.

Guias operacionais: `docs/GOOGLE_ADS_CONVERSIONS.md`, `docs/PROJECT_REVIEWS_ROLLOUT.md` e `docs/launch-evidence/2026-09-12-assiny-lifecycle.md`.

## Publicação do código

Código `5482bd1` publicado e promovido para `prestacerto.com.br` em 12/09/2026: deployment `dpl_FemU4P3JEfXZReDvDV4qD9APfKfK`. Build remoto READY; candidato validado com a CLI autenticada da Vercel (a URL imutável tem proteção de acesso). As duas landings e planos responderam 200 com H1/título corretos, e a API de avaliações recusou POST sem sessão com 401. Após promoção, as três páginas públicas foram conferidas novamente no domínio principal.

Essa publicação entrega o código e suas proteções de indisponibilidade. Não ativa migrations, cron ou conversões do Google Ads: persistem as dependências de acesso ao Supabase correto, reconciliação/contrato Assiny e AW/rótulos descritas acima.
