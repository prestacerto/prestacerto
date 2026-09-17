# Landings, retomada de cadastro e funil — PrestaCerto

## Entrega
- /para-clientes e /para-prestadores: formulário em duas etapas antes da conta, categorias do banco, validação de campos, consentimento de privacidade, loading, tentativa novamente e idempotência por UUID.
- Lead persistido na tabela contact_messages antes do sucesso. Caixa privada em /admin/leads para super_admin, com status manual novo/em_atendimento/convertido. Não publica projetos nem envia propostas automaticamente.
- /dashboard/profile reativada com autenticação, noindex e confirmação de gravação real. Próximo passo do painel depende do perfil/projetos existentes.
- Retomada do lead no cadastro e na revisão do projeto/perfil: apenas na mesma aba, até 24 horas, sem dados pessoais na URL. Dados já digitados e rascunhos anteriores têm prioridade. Não inventa orçamento/data.
- Sitemap inclui ambas as landings; rotas privadas e páginas vazias permanecem fora da indexação. Nenhuma data artificial de lastmod.
- Busca pública paginada em 24 resultados (+1 para verificar a próxima página), ordenação estável e pesquisa de título/descrição/habilidade exata.
- Imagens menores em celular, scripts de medição após consentimento e registro do service worker após carregamento/ociosidade.

## Eventos do funil
Eventos enviados ao Google Analytics configurado somente com consentimento:

1. presta_certo_landing_view
2. presta_certo_cta_click
3. presta_certo_form_start
4. presta_certo_form_error
5. presta_certo_lead_success
6. presta_certo_journey_switch
7. presta_certo_registration_success
8. presta_certo_project_published
9. presta_certo_profile_completed

Cadastros/projetos/perfis só geram o evento correspondente após resposta de sucesso. O perfil completo exige nome, título profissional, apresentação e cidade/local de atendimento; uma foto e um plano pago não são necessários. O status convertido da caixa de leads é uma classificação manual e não substitui esses eventos.

Dimensões: journey, source e device; campaign_id/adgroup_id/ad_id aceitam somente IDs numéricos. A atribuição é preservada por até 24 horas na aba. Os eventos não incluem nome, e-mail, telefone, descrição, dados livres de UTM, parâmetros completos de URL ou identificadores de clique.

Para anúncios Google, usar o sufixo de URL (ajustar a campanha real na conta):

```
utm_source=google&utm_medium=cpc&campaign_id={campaignid}&adgroup_id={adgroupid}&ad_id={creative}
```

As novas dimensões/eventos podem ser usados em uma exploração de funil no GA4. A implementação do site não cria campanhas nem muda lances. A atribuição em outro dispositivo/aba não é garantida; bloqueio de analytics ou ausência de consentimento impede medição. Contagem é de eventos e deve ser lida com as regras de usuários/sessões da ferramenta.

## Validação antes da publicação
- Bateria automatizada ampliada: 191 testes passaram; TypeScript sem erros.
- UI local: ambas as landings inspecionadas em 390x844; prestadores também em 1365x900. H1 único, conteúdo sem rolagem horizontal. Formulário vazio e erro real de integração local mantiveram dados e permitiram nova tentativa.
- Rotas de leads testadas com banco/notificador simulados: sucesso só após persistência, concorrência/deduplicação, falhas, autorização e atualização concorrente do status.
- Nenhum projeto/proposta real foi criado nos testes desta entrega.

## Operação
O banco e a caixa administrativa são o destino durável dos leads. O notificador de e-mail é opcional e depende da configuração Resend; não declarar e-mail entregue sem essa configuração. Pagamento de assinatura inicial foi confirmado pelo proprietário em teste próprio anterior. Esta entrega parte do código de produção, sem a migração de expiração de cobrança ainda não aplicada no outro checkout.

## Publicação confirmada

- Código principal: 8ca757d; ajuste final de contraste: ccfd738.
- Ambas as rotas públicas retornaram HTTP200, title/meta próprios, H1 único e canonical correto.
- Sitemap de produção: 45URLs, zero duplicadas, duas landings presentes e nenhuma rota administrativa/cadastro/login.
- Dois contatos identificados como testes técnicos foram gravados no banco; retry do cliente retornou sucesso sem duplicação. Nenhum projeto/proposta foi criado.
- Conta administrativa autorizada acessou /admin/leads e visualizou exatamente os dois contatos. Status do prestador foi alterado para em_atendimento, recarregado e confirmado; depois restaurado para novo. Acesso anônimo ao endpoint retorna403.
- Página /dashboard/profile carregou o editor e os dados da conta autenticada. Nenhum dado do perfil desse administrador foi alterado no teste.
- Medição Lighthouse móvel, mesma ferramenta: desempenho81→98; acessibilidade91→96; boas práticas100→100; SEO100→100. LCP2,5s→2,3s; TBT600ms→40ms; CLS0. É medição de laboratório, não garantia de posições no Google nem medição de usuários reais.
- O único item de contraste indicado nessa medição (rodapé cinza-claro) foi corrigido depois em ccfd738. A pontuação96 foi medida antes dessa correção.
