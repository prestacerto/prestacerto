# Assiny e acesso administrativo — 11/09/2026

## Correções

- O provedor usa `approved_purchase`, `data.client`, `data.offer.subscription` e `data.transaction`. O adaptador anterior esperava nomes e posições diferentes. O novo adaptador valida organização, projeto, produto, oferta, moeda, recorrência, valor e estado financeiro.
- Pro: R$ 59,90/mês. Business: R$ 139,90/mês, valor confirmado tanto no painel quanto no checkout público; a apresentação de R$ 139 foi corrigida.
- Identidade do evento financeiro deriva do tipo de evento e UUID da transação. Reenvios não criam outra aprovação. Estornos sem assinatura no payload são conciliados com a aprovação da mesma transação, jamais por correspondência de e-mail.
- O checkout exige sessão verificada no servidor e gera uma referência opaca autenticada por AES-GCM em `utm_content`, campo documentado pelo Assiny. A confirmação autenticada verifica essa referência antes de chamar a função interna de vínculo. O navegador não escolhe a conta beneficiária, preço ou permissão.
- Eventos de teste continuam isolados de assinaturas live. Contratos antigos são aceitos somente no modo test. Eventos de ciclo de assinatura sem contrato confirmado retornam erro explícito.
- Corpo dos webhooks passa pelo leitor limitado por tamanho durante o recebimento. Aberturas de checkout recebem limite por conta.
- Admin adicional pode receber a concessão `prestacerto_admin_role` em `app_metadata`, campo controlado pelo servidor. `user_metadata` nunca é usado para conceder acesso. A autenticação é revalidada com `getUser()`.

## Acesso solicitado

A conta administrativa pedida pelo proprietário já existia no Auth. A credencial informada foi aplicada e a concessão administrativa foi adicionada preservando os outros metadados. Login, `getUser()` e concessão foram verificados. Não foi enviado e-mail nem gravada senha neste repositório.

A tarefa de provisionamento foi executada uma única vez no ambiente da hospedagem com variáveis exclusivas daquele build. O build normal voltou a executar apenas `next build`. O comando `admin:provision` requer configuração explícita e não expõe uma rota administrativa pública.

## Estado externo confirmado

- O painel Assiny ainda mostra: “Para ativar o checkout, precisamos verificar a identidade de cada sócio administrador.” O formulário público do checkout carregar não comprova a liberação para processar pagamentos.
- A sessão Supabase aberta em Grupo Sima não possui acesso ao banco efetivamente usado em produção (`taktwwwpcyxhyylzmgho`). O outro projeto chamado prestacerto é diferente e não foi conectado ao site. A credencial existente na hospedagem permitiu o provisionamento sem troca de banco.
- A exportação de variáveis do Vercel mascara a chave sensível. Uma tentativa local com esse marcador foi recusada; isso não era evidência de falha da credencial real. O provisionamento remoto e login confirmaram o acesso real.

## Validação e condições restantes

O formato foi implementado conforme a documentação oficial, com dados sintéticos nos testes. Não houve compra real nem aprovação manual de cobrança. Continuam necessárias a liberação cadastral do Assiny, uma entrega autenticada do provedor comprovando pagamento e vínculo à conta, e a confirmação do contrato de renovação/cancelamento antes de habilitar cobrança pública. As flags de checkout e integração verificada continuam desligadas.

Fontes do contrato: [compra aprovada](https://assiny.gitbook.io/assiny-docs/webhooks/payloads/compra-aprovada), [estorno](https://assiny.gitbook.io/assiny-docs/webhooks/payloads/compra-reembolsada), [chargeback](https://assiny.gitbook.io/assiny-docs/webhooks/payloads/chargeback), [metadata](https://assiny.gitbook.io/assiny-docs/webhooks/estrutura-dos-dados/metadata).

## Publicação e evidência final

Publicação `dpl_448xJ5wUQzC1VeBKN5T7kddqxe4r`, compilação remota aprovada, promovida para https://prestacerto.com.br em 11/09/2026. URL imutável: https://prestacerto-1p8alfzac-prestacerto1.vercel.app.

- 118 testes locais aprovados e TypeScript sem erros.
- Validação na publicação de teste: login e painel administrativo com dados reais; cinco verificações do receptor com eventos sintéticos autenticados — aprovação registrada em modo test, duplicata idempotente, estorno conciliado pela transação, oferta desconhecida rejeitada e token inválido rejeitado. Nenhum evento live foi criado.
- Depois da promoção: 13 verificações públicas/autorização aprovadas e oito verificações específicas de admin, login, logout, preço Business e bloqueio de checkout não verificado aprovadas.
- Os dois eventos sintéticos (aprovação e estorno) permanecem identificados como `mode=test` no ledger, sem usuários beneficiados e sem receita. Identificador da transação na evidência abaixo.
- Não foi efetuada cobrança real, enviado convite por e-mail ou alterado o cadastro de identidade do responsável no Assiny.

Evidências: `launch-evidence/2026-09-11-assiny-native-preview.json` e `launch-evidence/2026-09-11-admin-payments-production.json`. Rollback anterior: `dpl_E1mYEPg6UZsAKi9U7d8oubp13X5Y`.
