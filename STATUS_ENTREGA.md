# PrestaCerto — continuidade da entrega

## Fonte de trabalho

Código real em `prestacerto-ajustes`, branch `codex/ajustes-azul-e-falhas`, baseado nos commits locais de `prestacerto-PROD`. O GitHub existente não foi sobrescrito.

## Correções implementadas

- As páginas de contratação por categoria/cidade usam o cliente público do Supabase com RLS. O filtro considera a categoria e a cidade, com contagens reais; retiradas estatísticas fixas e garantias sem base.
- Páginas de mercado abrem sem chave administrativa. Orçamentos públicos são identificados como orçamentos da categoria, podendo incluir outras cidades. Valores de contratos só são consultados quando existe credencial de servidor e só são exibidos com amostra suficiente.
- Perfil público usa UUID e campos realmente presentes no banco. A rota antiga `/profile/[id]` redireciona para `/perfil/[id]`; saiu o perfil fictício. A base atual não tem `username`, `headline`, avaliações agregadas nem `profile_id` em serviços.
- A área administrativa exige autenticação e autorização no servidor. O painel do dono sinaliza ausência de configuração sem transformar indicadores indisponíveis em zero; consultas reais continuam dependendo da credencial privada.
- Webhook Assiny exige segredo; rejeita produtos desconhecidos e não promove um plano quando a gravação falha. Não registra e-mails ou payloads completos em logs.
- Novas assinaturas ficam indisponíveis no site até que credenciais, segredo e teste real estejam prontos. Cadastro grátis continua disponível. Isso não cancela contratos existentes nem desativa links externos no painel Assiny.

## Experiência implementada

- Página inicial azul e branca, navegação preservada, busca real por `q`, oito áreas de serviço, cadastro de clientes e profissionais, calculadora e planos.
- Instagram @prestacerto no rodapé; marca sem botão aninhado em link; zoom do navegador liberado; tema claro por padrão.
- Certo Match: até cinco projetos classificados pela proporção de habilidades em comum, com motivos. Não recomenda projetos próprios nem aqueles com proposta não retirada. É correspondência de habilidades, não probabilidade de ganhar nem inferência de IA.
- Certo Preço/Calc: cálculo transparente com custos, renda, horas e reserva informada pelo usuário. Sem médias fabricadas, impostos fixos presumidos ou diferença entre reais e centavos.
- Certo Timing: compara prazos de execução. A API não retorna mais horário aleatório nem promessa de aumento da taxa de ganho.

## Bloqueios confirmados

Em 08/09/2026 a conexão Supabase e a sessão no painel informaram ausência de acesso ao projeto `taktwwwpcyxhyylzmgho`. O usuário confirmou que não tem acesso à conta proprietária neste momento.

Na Vercel estavam ausentes as credenciais de servidor e o segredo do webhook. A chave publicável funciona para leituras públicas. Não criar, substituir ou expor segredos no código.

Para liberar assinaturas:

1. Acessar a conta proprietária do Supabase. Validar RLS e proteção contra alteração de `profiles.plan` por usuários comuns.
2. Revisar o trigger `apply_pending_subscription`: ele deve usar o e-mail confirmado de `auth.users`, não confiar no e-mail editável de `profiles`, e considerar eventos anteriores e a assinatura correta.
3. Configurar `SUPABASE_SECRET_KEY` (ou a `SUPABASE_SERVICE_ROLE_KEY` correta) na Vercel, somente no servidor.
4. Configurar `ASSINY_WEBHOOK_SECRET` e o mesmo segredo no envio do Assiny. O handler aceita `x-assiny-token`, o header legado `x-assinify-token` ou `x-webhook-secret`; prefira header à querystring.
5. Obter um evento real de teste autenticado, confirmar nomes e estrutura dos eventos, produto/plano e identificador de assinatura. O repasse anterior diz explicitamente que o payload real ainda não foi observado.
6. Validar gravação, renovação, cancelamento, reembolso, entregas repetidas e fora de ordem. O handler ainda não mantém um histórico transacional de eventos para reconciliar entregas fora de ordem; finalizar esse controle antes de liberar cobrança.
7. Somente após esses testes definir `ASSINY_CHECKOUT_ENABLED=true` e republicar. Esse sinalizador é intencionalmente desligado por padrão.

## Próximas funcionalidades solicitadas

- Visitas semanais ao perfil e notificações: dependem da estrutura de armazenamento e de regras de acesso, deduplicação e privacidade. Não exibir contagens simuladas. A API informa indisponibilidade se o armazenamento não puder ser usado.
- E-mail diário e envio programado: dependem do provedor, agendamento e consentimento/configuração do destinatário; não foram ativados nem enviados e-mails nesta entrega.
- Recomendação de preço por mercado e horário de receptividade: exigem amostras reais e validação. Não prometer ganhos ou percentuais de contratação.
- Feed visual de portfólios e curadoria semanal: precisam de portfólios publicados e critérios editoriais.
- Badges verificados: exigem regras verificáveis. Destaque pago deve ter rótulo próprio, sem sugerir identidade verificada ou mérito comprado.
- As receitas e aumentos de conversão apresentados nas ideias são hipóteses de negócio, não resultados medidos.

## Validação

Testes de regressão cobrem autenticação do webhook, eventos sem pagamento, produtos desconhecidos, payloads inválidos, normalização de habilidades, limites de recomendações e cálculo de preço sem valores infinitos. Foram aprovados 14 testes automatizados. A compilação local e a da Vercel terminaram sem erros. A revisão estática dos novos módulos também passou. As validações HTTP locais confirmaram páginas públicas, perfil real, rejeição de perfil inexistente, bloqueio de webhook sem credencial, autenticação de matching e cálculo válido/inválido. Não foram feitos pagamentos, envios de e-mail ou cadastro de contas de teste.

## Modelo comercial proposto pelo proprietário (a validar)

| Produto | Preço proposto | Projeção enviada |
| --- | --- | --- |
| Certo AI | R$ 19,90/mês | R$ 35 mil/mês |
| Certo Match | R$ 2,90/proposta | R$ 29 mil/mês |
| Certo Timing | R$ 9,90/mês | R$ 18 mil/mês |
| Certo Preço | R$ 14,90/mês | R$ 22 mil/mês |
| Certo Badge | R$ 19,90/mês | R$ 25 mil/mês |

A soma informada é R$ 129 mil/mês, antes de validar demanda, clientes pagantes, custos e sobreposição de pacotes. Também foi proposto adicional de destaque de R$ 9,90/mês, somando R$ 29,80 com Certo AI. Definir a diferença entre esse adicional e Certo Badge antes de configurar ofertas. Nenhum desses valores novos foi ativado como cobrança nesta entrega.

## Referência de retorno antes desta entrega

Produção verificada na Vercel: `dpl_3AHzenqXjdnfSe9vrYjJbJ39ZXWS`, URL `https://prestacerto-35yjtv745-prestacerto1.vercel.app`, Ready, 05/09/2026. Essa é a referência imediata anterior desta entrega; é mais recente que a referência antiga de 01/09 do repasse.

## Publicação concluída

- Data: 08/09/2026.
- Deployment: `dpl_J6BKyLZNqyCPGuiUn6wg5ikPcbSZ`, READY.
- URL: https://prestacerto.com.br
- Referência imutável: https://prestacerto-pc20ol0i3-prestacerto1.vercel.app
- Commit da aplicação publicada: `5461022`.
- Verificados no domínio com HTTP 200: início, planos, serviços, calculadora, Certo Preço, contratação de desenvolvimento em São Paulo, contratação de design no Rio de Janeiro e mercado de desenvolvimento em São Paulo. Perfil inexistente retorna 404.
- O início contém o novo visual. Início e planos não possuem links clicáveis para checkout do Assiny. A consulta de estado do webhook confirma `configured: false`, coerente com o bloqueio informado.
- O painel de admin e a ativação de assinaturas NÃO estão concluídos, pois dependem do acesso ao Supabase indisponível. As funcionalidades futuras listadas acima não foram declaradas prontas.


## Banners e título da página inicial — 8 de setembro de 2026

- Banner enviado com a profissional de óculos na seção principal, ao lado da busca.
- Segundo banner enviado, com a profissional de notebook, na seção para prestadores de serviços.
- Arquivos originais PNG preservados, incluindo transparência. O enquadramento na página aproveita a área da arte e se adapta ao celular.
- Título atualizado conforme solicitado: “Você tem um plano? Temos alguém certo para realizar.”

Publicação dos banners confirmada no domínio em 8 de setembro de 2026. Deployment `dpl_SwitH9KpLckJCiGPhGDPXyHw378d`, estado Ready, código `4c06359`. Compilação e verificação de código concluídas sem erros. Verificação no domínio confirmou o título solicitado, os dois elementos de imagem e resposta HTTP 200 dos dois PNGs, com conteúdo idêntico aos arquivos enviados.


## Revisão de UX, SEO, planos e painel do dono — 8 de setembro de 2026

### Implementação

- Página inicial reorganizada com mais branco, azul nos pontos de ação e navegação simplificada. A ação principal é publicar projeto grátis; profissionais têm um caminho próprio para criar perfil.
- Os dois banners originais e o título solicitado foram preservados. Busca por serviço, perguntas frequentes e escolha do tipo de cadastro foram conferidas no navegador.
- CNPJ **68.949.661/0001-00** incluído no rodapé e nos dados estruturados da organização, conforme informação do proprietário.
- Pro destacado em azul com **Mais escolhido**; o proprietário confirmou que é o plano mais assinado. Pro e Business têm botões próprios e destinos distintos no Assiny, sujeitos à trava de ativação existente. Não houve liberação de cobrança.
- Painel do dono em `/admin`, com proteção de proprietário no servidor e API sem cache. Mostra perfis, projetos, propostas, serviços, distribuição dos planos, atividade recente e situação das integrações. Oferece períodos de 7, 30 e 90 dias e atualização opcional a cada minuto.
- A receita permanece indisponível até existir conciliação com pagamentos confirmados. Contagem de perfis por plano não é apresentada como receita. Sem acesso privado ao banco, os indicadores exibem “—”, não números simulados.
- Diretório `/contratar`, oito páginas de especialidades e revisão das 120 combinações de especialidade/cidade, com orientação específica de contratação e navegação entre categorias e cidades.
- Títulos, descrições e endereços canônicos revisados; perfis e anúncios usam conteúdo próprio nos metadados. A calculadora duplicada aponta para seu endereço principal. Páginas privadas, ferramentas ainda sem dados e páginas de mercado sem amostra local suficiente recebem indicação de não indexação.
- Sitemap atualizado com páginas públicas e registros acessíveis pelas regras públicas do banco, sem datas de atualização inventadas. JSON-LD protegido contra inserção de tags; a busca estruturada utiliza o parâmetro real `q`.
- Eventos `home_cta_click` e `home_search_submit` preparados para o Google Analytics com consentimento; não enviam o texto digitado na busca. Aumento de conversão e posicionamento no Google ainda precisam ser medidos.

### Limites atuais

A consulta de configuração da Vercel nesta revisão confirmou `ADMIN_EMAIL` e Google Analytics presentes. Credencial privada do Supabase, segredo do webhook e liberação de checkout continuam ausentes. O acesso com uma conta de proprietário e os indicadores reais não foram testados, pois o acesso ao projeto Supabase segue indisponível. O endpoint administrativo rejeita visitantes sem autenticação. A verificação do Search Console não está configurada por variável de ambiente; isso não permite concluir se existe uma verificação externa por DNS.

As pendências de segurança, integração e teste real de pagamentos descritas acima continuam obrigatórias antes de habilitar novas cobranças. Não foram feitos pagamentos, novos cadastros ou envios de mensagens. O GitHub existente não foi sobrescrito.

### Critérios de SEO utilizados

URLs canônicas, títulos descritivos e sitemap com informações reais seguem as orientações oficiais do Google: [guia inicial de SEO](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [criação de sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) e [dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). Isso prepara as páginas para rastreamento; não garante indexação nem posição nos resultados.


### Validação local da revisão

- Compilação de produção concluída, incluindo verificação de tipos. Verificação estática aprovada nos 43 arquivos TypeScript alterados ou novos.
- 145 rotas conferidas, incluindo o diretório, os oito hubs e as 120 páginas de contratação por cidade; títulos, descrição, canonical, H1 e JSON-LD validados nos critérios automatizados. Sem falhas na execução final.
- Sitemap com 207 URLs únicas no momento da consulta, sem datas `lastmod` artificiais. A quantidade pode variar conforme os registros públicos do banco.
- API administrativa devolve 403 para visitante; `/admin` redireciona ao login. Rotas inexistentes devolvem 404.
- Navegador: desktop, 390 px e 320 px sem transbordamento horizontal na página inicial. Conferidos contraste dos CTAs, plano Pro, CNPJ, abertura do FAQ, busca por `q` e pré-seleção de cliente/profissional no cadastro. Nenhum formulário de cadastro foi enviado.


### Publicação da revisão de UX, SEO e CNPJ

Publicada e conferida no domínio em 08/09/2026: deployment `dpl_7JXr9royPSkPAkitKX18rMmwfthP`, código `636abc4`, referência https://prestacerto-j7wztn8wj-prestacerto1.vercel.app. As 145 rotas e os 207 endereços do sitemap passaram na verificação de produção. CNPJ e selo do Pro confirmados no HTML publicado. A primeira tentativa foi bloqueada por autoria incorreta herdada da configuração global do Git; a autoria deste trabalho foi corrigida para Codex, sem alterar identidade de terceiros ou permissões da Vercel.

## Navegação e publicação de projetos — continuação em 08/09/2026

- Nova entrada `/publicar-projeto`: visitantes podem preparar o projeto antes do cadastro, com revisão e publicação explícita após entrar na conta.
- Fluxo manual direto; assistência de escrita por IA opcional para quem está autenticado, com limite de espera e retorno ao texto original em caso de falha. O orçamento é informado pelo usuário.
- Rascunho local por até 24 horas, com opção de descarte, separado por conta após entrar. O rascunho não é enviado ao servidor antes da publicação (exceto se o usuário autenticado solicitar a assistência de IA).
- Destino preservado no login, cadastro, confirmação e reenvio de confirmação; caminhos externos ou malformados são rejeitados.
- Envio corrigido para as colunas efetivamente presentes no projeto Supabase: a consulta pública confirmou a ausência de `projects.category`, `budget_cents` e `deadline`. A inserção usa orçamento em reais, `category_id`, `deadline_days` e status `open`.
- A gravação usa a sessão autenticada e as regras de propriedade do banco, sem depender de credencial administrativa. A API não tenta inserir repetidamente em esquemas incompatíveis.
- Profissionais podem optar explicitamente por também contratar, passando a ter o papel `both`. A alteração é limitada ao próprio perfil e preserva acesso às ferramentas de freelancer. Não concede acesso administrativo nem altera plano pago.
- Tela de sucesso com acesso ao projeto publicado e seção “Meus projetos” no painel. A consulta pública dos detalhes deixa de depender da relação `project_google_data`, que não existe no banco atual. Recursos opcionais não impedem a leitura do projeto.
- Menu no celular fecha ao selecionar destino e oferece publicação; links do painel usam navegação do Next sem recarga integral. Indicadores de carregamento adicionados às rotas principais. Consultas repetidas de autenticação/perfil são deduplicadas apenas dentro da mesma renderização, sem compartilhar sessões entre usuários.
- Testes unitários cobrem retorno seguro após autenticação, limites de orçamento/texto/habilidades, datas válidas, opção explícita de contratar e formato de gravação compatível com o banco.

A navegação, restauração de rascunho, pré-seleção de cliente e formulário foram conferidos localmente em desktop, 390 px e 320 px. Não foi publicado projeto fictício nem criada conta de teste. O envio real com uma conta do proprietário ainda precisa ser exercitado por ele; as credenciais dessa conta não foram usadas nesta revisão.

### Publicação e conferência final do fluxo de projetos

- Publicação concluída em 08/09/2026, código `3b48004`, deployment `dpl_QUyDyp6oQa1gFQMSTgrz8HPRnB5b`, estado READY.
- Referência imutável: https://prestacerto-9j1lhl5gf-prestacerto1.vercel.app. Os domínios `prestacerto.com.br` e `www.prestacerto.com.br` apontam para esta versão.
- Compilação final de produção aprovada; verificação estática dos 34 arquivos TypeScript alterados ou novos sem erros ou avisos; seis testes unitários de publicação e autenticação aprovados.
- Nove verificações HTTP passaram tanto localmente quanto no domínio publicado: início, formulário, proteção da criação de projetos, proteção do admin, rejeição de cadastro/reenvio incompletos, retorno seguro de autenticação e continuidade entre login e cadastro. Nenhum e-mail foi enviado pelos testes.
- No navegador, o botão da página inicial publicada abriu `/publicar-projeto`, com título “Conte o que você precisa.” e formulário em branco. Rascunho, revisão, retorno do cadastro e menu móvel foram exercitados localmente, inclusive em 320 px e 390 px. O rascunho de teste foi descartado.
- Limite da validação: a inserção final de um projeto com conta real não foi executada. A compatibilidade das colunas foi verificada por consultas de leitura; as permissões efetivas de gravação dessa conta ainda dependem do primeiro envio real. Não foi criado anúncio público fictício.
- Rollback imediatamente anterior: `dpl_7JXr9royPSkPAkitKX18rMmwfthP`, código `636abc4`. As pendências de credencial privada, ativação de pagamentos e indicadores reais do proprietário permanecem descritas acima.

## Certo Propostas — retenção e benefício dos planos, 08/09/2026

### Recurso implementado

- Nova ferramenta pública em `/ferramentas/propostas`, acessível pela página inicial, menu, rodapé e painel. Metadados próprios, conteúdo explicativo e inclusão no sitemap.
- Quatro modelos de partida: sites, design, marketing e serviços. O usuário informa profissional, cliente, escopo, itens, quantidades, valores, prazo e condições de pagamento. A ferramenta não é apresentada como IA e não inventa preços.
- Prévia imediata, cópia do texto e PDF gratuito sem cadastro. O documento gratuito leva a assinatura PrestaCerto, criando uma oportunidade de divulgação orgânica quando o próprio usuário o compartilhar.
- Biblioteca de até 30 propostas por conta neste navegador, com rascunho da edição, reutilização para novos clientes, situação e data de retorno. Propostas marcadas como enviadas geram lembretes dentro da ferramenta quando a data chega. Valores em negociação são calculados dos registros locais e não são apresentados como receita recebida.
- Dados locais separados por conta; importação de propostas feitas como visitante exige ação explícita. Não há sincronização entre dispositivos. Limpar os dados do navegador remove a biblioteca; os PDFs podem ser guardados pelo usuário.
- Monetização integrada aos planos existentes: Pro e Business podem gerar PDF com nome de marca e escolha entre azul, marinho e verde, sem assinatura PrestaCerto. A versão gratuita permite experimentar a prévia. A exportação de marca exige usuário autenticado e plano consultado no servidor; informações `paid` ou `plan` enviadas pelo navegador não concedem acesso.
- A proposta é um documento para o usuário revisar e enviar. Não cria proposta no marketplace, não manda mensagens, não agenda envio automático e não processa pagamentos.

### Validações

- Seis novos testes cobrem centavos e quantidades, limites de dados, planos autorizados, datas e lembretes, rascunhos incompletos e geração de PDF de uma ou mais páginas.
- PDFs gratuito, com marca e longo foram gerados e lidos; acentos, total e assinatura conferidos. Documento longo teve três páginas, sem texto fora dos limites. O documento padrão foi renderizado e inspecionado visualmente.
- Dez verificações HTTP locais passaram: página, início, planos, sitemap, rejeição de dados inválidos e valores negativos, autenticação de exportação com marca, origem externa, limite de tamanho e download real do PDF gratuito.
- Navegador: criação, salvamento, edição, lembrete com data vencida, restauração após recarregar, reutilização limpando cliente/data e exportação gratuita conferidos. A prévia Pro mantém o botão bloqueado para visitantes. Layout conferido em 390 px e 320 px.
- Nenhuma conta, projeto público, proposta do marketplace ou cobrança foi criada pelos testes. Não houve envio de mensagens. Exportação autenticada com conta Pro real não foi exercitada; a geração de marca foi testada isoladamente e a rejeição de visitantes foi conferida na API.

### Conferência atual do banco e pagamentos

Após o proprietário informar que o banco já foi ajustado, a conferência confirmou que as páginas públicas e o formulário respondem normalmente. A configuração de produção da Vercel ainda não lista credencial privada do Supabase, segredo do Assiny ou liberação de checkout, e `/api/webhooks/assiny` informa `configured: false`. O conector Supabase disponível nesta sessão continua sem permissão para acessar o projeto. Isso limita a confirmação administrativa; não prova que nenhuma alteração foi feita diretamente no banco.

Por isso, o novo benefício foi integrado aos planos sem habilitar novas cobranças. Preços dos planos mantidos: Pro R$ 59,90/mês e Business R$ 139/mês. A integração de pagamentos e a leitura administrativa completa seguem pendentes de configuração e teste real. Dependências do PDF: pdf-lib e fontkit; fontes Lato com licença OFL incluída em `src/assets/fonts/lato/OFL.txt`.

### Publicação confirmada do Certo Propostas

- Código `da8a338`, deployment `dpl_7kUh3rfYM1y2oaG8DT6UauSNk2Gv`, READY em produção em 08/09/2026. Referência imutável: https://prestacerto-6l6r06ele-prestacerto1.vercel.app.
- Aliases `prestacerto.com.br` e `www.prestacerto.com.br` confirmados nesta versão. O menu da página inicial abriu a ferramenta publicada em https://prestacerto.com.br/ferramentas/propostas; visual e formulário em branco conferidos no navegador.
- Compilação final e verificação estática aprovadas. As dez verificações HTTP do Certo Propostas passaram na versão compilada e no domínio público, incluindo PDF real com a origem correta, resposta privada sem cache e rejeição do benefício Pro para visitante. Nove verificações anteriores de publicação de projetos e autenticação também passaram nos dois ambientes.
- PDF gerado pelo domínio com 20.518 bytes, contendo os valores de demonstração e assinatura da versão gratuita. A geração do documento não cria registro no marketplace nem envia mensagem ao cliente.
- Nenhuma dependência nova do PDF apareceu nos alertas da consulta de vulnerabilidades. O projeto já tinha alertas em outras dependências; esta verificação não equivale a uma auditoria de segurança completa.
- Rollback imediatamente anterior: `dpl_QUyDyp6oQa1gFQMSTgrz8HPRnB5b`, código `3b48004`.

## Certo Oportunidades e visualizações do perfil — 08/09/2026

- O antigo Certo Match foi transformado em Certo Oportunidades dentro de `/dashboard/match`. A tela usa os projetos abertos reais e as habilidades dos serviços ativos do profissional.
- Incluídos busca por palavra/habilidade, orçamento mínimo, projetos salvos, contagem de oportunidades abertas e indicação de projetos publicados desde a última visita. Projetos próprios e projetos para os quais a conta já enviou proposta são excluídos.
- Salvos e data da última visita ficam no navegador, com limite de 100 identificadores. A tela informa que o percentual representa correspondência de habilidades, não probabilidade de contratação. Nenhum projeto ou percentual é inventado.
- Visualizações do perfil ligadas à página pública e ao painel do freelancer. A própria visita do dono não conta. O identificador diário é opaco, salvo em cookie protegido, e nenhum endereço IP é armazenado.
- O plano gratuito mostra o total dos últimos sete dias. Pro e Business mostram o histórico diário e a comparação com os sete dias anteriores. Os benefícios foram incluídos na descrição única dos planos.
- Nova migration `0043_opportunities_profile_views.sql` cria a tabela, permissões mínimas, regras de leitura pelo dono e limite de uma contagem por navegador/perfil/dia.
- O banco publicado consultado em 08/09/2026 ainda devolve `PGRST205` para `profile_views`. O conector e a ferramenta de linha de comando não têm acesso administrativo ao projeto para aplicar a migration. Até ela ser aplicada, o painel mostra claramente que a métrica aguarda atualização do banco e o endpoint de contagem devolve indisponibilidade; não mostra zero falso.
- Compilação de produção, verificação estática e três testes do cálculo de compatibilidade aprovados. Os testes confirmam aliases exatos, não inflação por habilidades repetidas, exclusão de propostas anteriores e limite do ranking existente.

### Publicação da experiência de oportunidades

- Aplicação publicada em produção em 08/09/2026: código `825237d`, deployment `dpl_FZgTLTSWZK6F1ET7xcdKoSZYzEAq`, estado READY, referência imutável https://prestacerto-nyzyyb5p7-prestacerto1.vercel.app.
- No domínio principal, início e planos responderam 200; a área de oportunidades redirecionou visitante para login preservando o destino. Os benefícios “Certo Oportunidades” e “Evolução diária das visualizações do perfil” foram confirmados no HTML publicado.
- A API de visualizações rejeitou identificador inválido com 400 e origem externa com 403. O registro real permanece indisponível até a migration da tabela ser aplicada no Supabase.
- Rollback imediatamente anterior: `dpl_7kUh3rfYM1y2oaG8DT6UauSNk2Gv`, código `da8a338`.

## Correção do fluxo de propostas — 09/09/2026

Publicadas correções de sessão em listagem/criação/detalhes/aceite/mensagens de propostas, preço opcional, proteção de participantes e recuperação do formulário em falhas de rede. Deployment `dpl_3XfSiFU86HSJwjWymUAud1tXQY8h`, READY, alias principal confirmado. Seis testes de handlers, build e 13 verificações HTTP em produção passaram. Limites: testes autenticados com banco simulado; nenhuma contratação real ou cobrança executada. Acesso ao Supabase de produção continua negado pela conta atual. Detalhes e evidências em `docs/LAUNCH_STATUS_2026-09-09.md`.

## Banco recuperado e fluxo gratuito verificado — 09/09/2026

Acesso direto ao PostgreSQL correto recuperado com certificado validado. Aplicadas três migrações de permissões, visualizações e proteção de funções; preservados os 46 perfis. Telas de gerenciamento de projetos e propostas restauradas, conversas para cliente/profissional e conclusão em modo direto habilitadas. Business consulta profiles.plan. Deployment final `dpl_8PnmKxUa7PyFUCxPxRHCDxj3vaN8`, READY. Trinta e seis verificações autenticadas em produção passaram, com limpeza de todos os registros de teste. Pagamentos/IA continuam pendentes de credenciais e configuração adicional; diagnóstico completo e limites em `docs/LAUNCH_STATUS_2026-09-09.md`.


## Certo AI — 09/09/2026

Publicado no deployment `dpl_EUxRdUCYVKSvApAEfxqRbVKSnikS`: cota atômica nas três rotas de reescrita, orçamento por plano e global, contabilização de tokens, editor em /certo-ai para conta conectada e retirada de demonstrações com resultados inventados. Migração aplicada e testes aprovados (19 automatizados; concorrência 3/12; 9 verificações autenticadas e 13 públicas). Geração real e cobrança continuam desativadas. Pendências e rollback em `docs/CERTO_AI_MONETIZATION_2026-09-09.md`.


## Assiny — 09/09/2026

Publicado `dpl_9dZnZccV5xgJKhoshbcAXMAJ2QSV`: persistência atômica de eventos, deduplicação, ordenação, vínculo verificado por assinatura, separação test/live e retirada de atribuição por e-mail. Migração aplicada. 35 testes automatizados, concorrência 1 evento/12 entregas, cinco verificações de webhook/checkout e 13 públicas aprovadas. Pagamentos reais continuam fechados; dependências em `docs/ASSINY_INTEGRATION_2026-09-09.md`.
