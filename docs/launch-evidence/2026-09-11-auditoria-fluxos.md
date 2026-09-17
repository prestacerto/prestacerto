# PrestaCerto — auditoria funcional de cliente e prestador

Data: 11/09/2026. Escopo exclusivo: PrestaCerto. Cadu AI e Sima Creators não foram alterados.

## Evidência no navegador

As contas e os objetos são identificados como TESTE QA. Nenhuma compra foi realizada, nenhum usuário real recebeu proposta ou mensagem.

| Fluxo | Resultado observado | Ambiente |
| --- | --- | --- |
| Cadastro cliente | Conta criada pela página /register?role=client; sessão aberta; painel de contratação zerado | Produção |
| Cadastro vazio | Erros de nome, e-mail e senha visíveis | Produção |
| Publicação vazia | Mensagem exigindo descrição com pelo menos 20 caracteres | Produção |
| Rascunho do projeto | Título, descrição e orçamento preservados após recarregar | Produção |
| Publicação cliente | Confirmação visível, detalhe público e gestão acessíveis | Produção |
| Cadastro prestador | Conta criada pelo formulário, painel profissional correto | Produção |
| Perfil profissional | Nome, título, bio, cidade/UF salvos e mostrados no detalhe do serviço | Produção + versão local |
| Proposta vazia | Erro visível de mensagem incompleta | Produção |
| Proposta válida | Uma proposta registrada; formulário substituído por acompanhamento, evitando reenvio pela página | Produção |
| Recebimento da proposta | Cliente vê remetente QA, mensagem e valor de R$100 | Produção |
| Conversa | Mensagem prestador→cliente e resposta cliente→prestador visíveis após navegação | Prestador versão local corrigida; cliente produção |
| Aceite | Proposta passa a aceita e projeto a em andamento | Produção |
| Conclusão | Cliente conclui projeto; status Concluído | Produção, sem pagamento |
| Oferta de serviço | Criada pelo formulário, listada e mostrada no detalhe público com proprietário correto | Versão local corrigida, banco real |
| Edição de oferta | Preço de teste alterado de R$100 para R$120 e confirmado na lista e detalhe | Versão local corrigida |
| Pausa/reativação | Status alterna na lista; serviço pausado retorna página não encontrada e noindex para visitante | Versão local corrigida |
| Cancelar exclusão | Confirmação é exibida e cancelamento preserva o serviço | Versão local corrigida |
| Botão do proprietário | Editar meu serviço abre o formulário do objeto correto | Versão local corrigida |
| Proteção de edição | Conta cliente recebe página não encontrada ao tentar editar o serviço do prestador | Versão local corrigida |
| Bloqueio administrativo | Cliente comum não acessa /admin e é redirecionado ao login | Produção |
| Página não encontrada | Texto em português; botão Voltar ao início funciona | Versão local corrigida |
| Catálogo e busca | Oferta pausada ausente da pesquisa; termo preservado e estado sem resultados com saída para publicar projeto | Versão local corrigida |
| Exclusão final | Serviço excluído com confirmação; lista vazia confirmada | Produção final |
| Navegação celular | Menu do painel inclui todas as seções; atalhos incluem serviços, mensagens e perfil; sem overflow horizontal em 390px | Versão local corrigida |

## Correções

1. Restauradas criação, edição, lista, pausa, ativação e exclusão de serviços. Mutações autenticadas filtram proprietário e exigem confirmação de linha do banco.
2. Navegação móvel inclui serviços, perfil e mensagens; retirado main aninhado e ampliados alvos de toque.
3. Login/cadastro de usuário autenticado respeitam destino interno seguro. Business não assume papel de contratante por engano.
4. Chat usa endpoint protegido com validação de participante e bloqueio de envio simultâneo; mensagem só é limpa após confirmação.
5. Benchmark não inventa preços quando faltam registros e informa amostra, insuficiência e falhas. Filtro de experiência sem efeito removido.
6. Formulário de contato e Certo AI tratam falha, timeout e resposta inválida, preservando o texto e liberando nova tentativa.
7. Checkout legado com sucesso simulado redireciona para planos. Detalhe de projeto segue pagamento direto, sem checkout Mercado Pago legado.
8. Meta recebe eventos de lead confirmado e início de checkout; compra exige confirmação live verificada no ledger Assiny, consentimento e deduplicação por transação/provider.
9. Business, ajuda, termos, privacidade e histórias foram alinhados aos recursos operacionais existentes. Removidos destinos inexistentes e promessas não implementadas.
10. Service worker não é registrado em desenvolvimento, evitando JavaScript/CSS antigos nos testes locais. Cálculos extremos e preços inferiores a um centavo são rejeitados.

11. Página não encontrada em português com links de saída; indisponibilidade de avaliações não é apresentada como zero avaliações.

## Verificações técnicas

- Baseline anterior: 191 testes passaram.
- Suíte final: 233 testes passaram, zero falhas.
- TypeScript sem erros; ESLint dos arquivos alterados sem erros; git diff --check limpo.
- Build local de produção passou; build Vercel e validação da publicação serão registrados abaixo.
- Varredura GET limitada a 110 URLs, concorrência 2: sem status HTTP >=400 e sem âncoras ausentes detectadas. Não é teste de carga. Páginas protegidas podem redirecionar para login; respostas HTTP200 transmitidas em streaming não provam conteúdo válido. A validação funcional acima é separada.
- Testes automatizados de erro de rede, timeout, consentimento e eventos usam mocks controlados. Não equivalem à confirmação de recebimento nos painéis Google/Meta.

## Limites e pendências conhecidas

- Google Ads AW, GTM e TikTok não têm identificadores configurados; GA4 e Meta existentes permanecem. Nenhum ID foi inventado.
- Contrato nativo de cancelamento/expiração Assiny ainda não está implementado; ledger atual não registra fim do período pago. Nenhuma migration antiga foi aplicada nesta auditoria.
- Purchase no navegador depende de retorno no mesmo navegador em até 24h e aprovação posterior ao checkout. Renovação sem retorno e compra concluída em outro navegador não são cobertas.
- Tabela pública de avaliações indisponível no banco observado (PGRST205). A interface corrigida mostra indisponibilidade, sem inventar contagem; não houve criação de tabela.
- Entrega de e-mail, retomada por link real de recuperação e cobrança real não foram repetidas nesta auditoria. Os cadastros observados abriram sessão diretamente.
- Não foi executado teste de carga nem garantia de capacidade para determinado volume de tráfego.
- O teste de consulta administrativa ao Supabase MCP retornou falta de permissão. Não há UI para exclusão de projeto; o projeto QA foi concluído e seu histórico permanece identificado. Não alegar remoção desse registro.

## Objetos QA para rastreabilidade

- Projeto: d0e4e170-7233-4910-8650-58390fffee71 — concluído.
- Proposta/conversa: 4f8a8fc1-b32e-4eca-93e4-ffd58de4d548 — exclusiva entre as duas contas QA.
- Serviço: 2e42ced1-fe75-4656-8643-fb2e75ab4380 — excluído pela interface em produção, com confirmação de lista vazia.
- Prestador: 41909b19-7e54-493e-a0cd-e0b6b3a876ed — conta TESTE QA, não profissional real. Título, bio e cidade foram removidos após o teste; o perfil não consta no sitemap final.

## Publicação

Publicação concluída e verificada em https://prestacerto.com.br.

- Commits de implementação: `552adb4` e `8a71ff4`.
- Deploy final: `dpl_F85fizfvhJ5kysKgPCfUj4Z5UnFG`.
- Versão imutável: https://prestacerto-3g36a7mrm-prestacerto1.vercel.app.
- Build Vercel passou. Promoção para o domínio principal concluída.
- Verificação imutável: landing de clientes200, sitemap200, endereço inexistente404 com texto em português; no primeiro candidato também foram verificados status Assiny401 sem login e checkout307 para planos.
- Produção: nova gestão de serviços acessível; cliente bloqueado na edição de serviço alheio; prestador reativou oferta, abriu detalhe correto e excluiu o serviço com confirmação. Avaliações indisponíveis aparecem sem contador.
- Projeto QA concluído; serviço QA excluído; apresentação profissional QA limpa. Contas e histórico de conversa/projeto permanecem identificados como teste.
- Sitemap final: 47 URLs, as duas landings incluídas, sem rotas privadas nem UUIDs do projeto, serviço e perfil QA.
- Nova varredura após a publicação: 110 URLs, nenhum erro HTTP, fallback de erro de aplicação/404 transmitido ou âncora inválida detectados. Redirecionamento ao login foi considerado acesso protegido, não teste completo da área privada.
- A sessão QA foi encerrada. Servidor local de teste interrompido.

O resultado comprova os fluxos descritos; as pendências acima continuam explícitas. Não equivale a garantia de disponibilidade, capacidade de tráfego ou funcionamento de módulos ainda sem integração.
