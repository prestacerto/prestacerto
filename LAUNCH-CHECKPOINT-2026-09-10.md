# PrestaCerto — checkpoint de publicação

Publicado no domínio principal em 10 de setembro de 2026.
Deployment: https://prestacerto-32anrbwhb-prestacerto1.vercel.app

Auditoria detalhada: `docs/AUDITORIA_LANCAMENTO_2026-09-10.md`. Código desta publicação em `prestacerto-auditoria`, branch `codex/auditoria-lancamento-20260910`.

## Verificado

- Build local e Vercel concluídos.
- 58 testes CommonJS e 39 testes TypeScript passaram.
- 27 verificações autenticadas em produção após o deploy; projeto, propostas, mensagens, aceite e conclusão aprovados. Dados de teste removidos.
- 11 verificações de entradas inválidas e acesso restrito aprovadas.
- 180 leituras HTTP 200, até cinco simultâneas, sem erros. É uma carga pequena, não uma certificação de capacidade para grandes campanhas.
- Selo amarelo com coroa do Pro a R$ 59,90 conferido no navegador desktop e mobile.
- Seis páginas públicas responderam 200; sete rotas recusaram visitantes com 401.
- HTTPS, canonical principal e redirecionamento www 308 verificados.
- Endpoints antigos de checkout selecionados desativados sem excluir histórico.
- Operações de reserva e liberação não podem registrar movimentação fictícia.
- Termos distinguem pagamento direto de futura retenção via Assiny.
- Currículo pago sinalizado como indisponível; rodapé do cliente não anuncia ferramentas exclusivas de prestadores.

## Não concluído — não anunciar como disponível

- Webhook Assiny tem credenciais configuradas, mas a integração live ainda não está validada. Checkout depende da verificação pessoal dos sócios no Assiny.
- Contrato de eventos Assiny, identificação segura do assinante e ciclo completo de pagamento ainda precisam de validação.
- Painel exclusivo do proprietário, métricas financeiras reais e validação da identidade do dono ainda pendentes.
- Certo AI sem credencial de produção; currículo sem entrega implementada.
- Remoção integral de referências e caminhos legados de pagamento ainda pendente.
- Revisão visual realizada nos planos; auditoria visual integral de todas as páginas continua fora desta validação.
- Os testes WhatsApp verificam autenticação de notificações, não entrega de mensagens nem matching/IA.

## Recuperação

Se houver regressão crítica em login/publicação de projetos, reverter pela Vercel à implantação anterior que estava ativa antes deste checkpoint. Nenhuma migração de banco foi aplicada nesta entrega; registros financeiros não foram excluídos.
