# Conversões do Google Ads — PrestaCerto

Configuração preparada em 12/09/2026. O ID AW e os labels reais ainda precisam ser fornecidos pelo responsável pela conta. Nenhum identificador de Google Ads foi criado ou presumido.

## Valores necessários

Copie os dois `send_to` dos snippets das ações de conversão: um de **Lead/formulário enviado** e outro de **Compra/assinatura paga**. Ambos devem apontar para o mesmo ID AW; os labels devem ser diferentes.

| Variável pública | Conteúdo |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_TAG_ID` | ID completo `AW-…` do snippet Google Ads |
| `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL` | Apenas a parte após `/` no `send_to` da ação Lead |
| `NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL` | Apenas a parte após `/` no `send_to` da ação Compra |

O ID AW não é o número da conta Google Ads com hífens, o ID GA4 nem um ID GTM. Não substituir `NEXT_PUBLIC_GA_ID` ou os IDs Meta existentes. Não é necessário adicionar um segundo carregador gtag.js ou um container GTM.

Bloco para preencher com valores fornecidos, antes do build de produção:

```dotenv
NEXT_PUBLIC_GOOGLE_TAG_ID=
NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=
NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL=
```

Variáveis `NEXT_PUBLIC_*` são incorporadas pelo Next.js durante o build. Alterações exigem novo build/deploy. Deixe Ads vazio em ambientes de teste que não devam registrar conversões reais. Não colocar os identificadores fictícios dos testes automatizados na configuração do site.

## O que cada ação mede

| Ação | Momento do disparo | Dados enviados ao Google Ads |
| --- | --- | --- |
| Lead | Resposta de sucesso da persistência em `/api/landing-leads`, para cliente ou prestador | `send_to` do Lead e `transaction_id` formado por `lead:` + UUID daquele envio |
| Compra | Retorno de checkout Assiny iniciado neste navegador em até 24 horas, depois de a API confirmar aprovação no ledger live, ativa e vinculada à conta autenticada | `send_to` da Compra, `transaction_id` da aprovação, preço verificado da oferta em `value` e `currency: BRL` |

Visita, clique no CTA, preenchimento parcial, cadastro, início de checkout e resposta de erro não são essas conversões. O Lead não recebe valor monetário inventado. A Compra não usa preço enviado pelo navegador; o valor vem da confirmação do servidor e exclui possíveis taxas adicionais do checkout.

O uso de `gtag('event', 'conversion', { send_to, ... })` segue a [documentação oficial de conversões](https://developers.google.com/tag-platform/devguides/conversions). O evento GA4 equivalente continua sendo enviado explicitamente à propriedade GA4, sem substituir o evento Ads nem o Meta.

## Consentimento e duplicações

- Nenhuma conversão é enviada sem consentimento de medição/marketing. Revogar o consentimento descarta eventos ainda pendentes.
- Filas e marcadores são independentes para GA4, Meta e Google Ads. O marcador Ads inclui a ação de destino e o identificador da transação.
- Repetir a resposta de sucesso, recarregar ou voltar ao site não repete uma conversão já despachada para a mesma ação naquele navegador.
- O Google Ads também recebe `transaction_id`, com até 64 caracteres e sem identificação pessoal, conforme a [documentação de deduplicação](https://support.google.com/google-ads/answer/6386790?hl=en).
- O payload Ads não inclui nome, e-mail, telefone, descrição do projeto, UTM livre ou query string. Este código não configura conversões otimizadas nem transmite `user_data`.
- Labels ausentes/invalidamente formatados não geram eventos. Se Lead e Compra tiverem o mesmo label, ambos ficam desabilitados para evitar misturar objetivos.

## CSP e validação

A política de conteúdo permite os endpoints Ads somente quando `NEXT_PUBLIC_GOOGLE_TAG_ID` contém um AW válido. Os endpoints seguem a [lista oficial do Google](https://developers.google.com/tag-platform/security/guides/csp#google_ads), com domínios nacionais explícitos para Brasil (`google.com.br`) além dos globais. Se surgirem coletas por outro domínio nacional, revisar o bloqueio observado antes de ampliar a política.

Os testes locais usam identificadores fictícios e provedores simulados; não enviam leads nem cobranças reais:

```sh
node --test __tests__/google-ads.test.cjs __tests__/analytics.test.cjs __tests__/funnel.test.cjs __tests__/payment-conversions.test.cjs __tests__/conversion-continuity.test.cjs __tests__/session.test.cjs
```

Após receber os IDs e publicar, verificar o carregamento único de gtag, os dois destinos exatos e a ausência de bloqueios de CSP no Tag Assistant/DevTools. Inspeção de página ou clique em Assinar não deve registrar Compra. Não é necessário fabricar uma compra para validar o código; a próxima compra legítima confirmada pode comprovar a recepção no Ads.

A medição atual depende do retorno ao mesmo navegador; não cobre renovação automática sem visita, outro navegador ou consentimento recusado. Não importar o mesmo evento GA4 como outra conversão primária sem revisar a duplicidade com a ação Ads direta. Não foram alteradas ações, orçamento, campanhas ou configurações da conta Google Ads por este trabalho.
