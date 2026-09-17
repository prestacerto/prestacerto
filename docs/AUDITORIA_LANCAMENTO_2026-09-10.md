# Auditoria do lançamento — 10 de setembro de 2026

## Escopo e estado

Site: https://prestacerto.com.br. A auditoria cobre o marketplace principal, autenticação, publicação, propostas, mensagens, conclusão, proteções de entrada e caminhos antigos de ativação paga. Não é uma certificação de todas as integrações e rotas experimentais existentes no repositório.

A cópia de trabalho é `prestacerto-auditoria`, baseada em `bd04a1a`, com as alterações não commitadas da última publicação preservadas. A cópia anterior permanece intacta.

## Correções

- Recuperação de senha usa a API pública de autenticação, sem exigir credencial administrativa. Valida email, limita tentativas e preserva o destino `/reset-password`.
- Login, cadastro, reenvio de confirmação, publicação, propostas, mensagens e formulários recebem limites de frequência. Redis, quando configurado, aplica o limite entre instâncias; sem Redis há um limite local com memória limitada. O limite local **não é uma quota global**.
- Leitura de JSON limita tanto o tamanho declarado quanto o corpo transmitido. JSON inválido, arrays e valores nulos recebem erro de validação.
- Notificações internas exigem segredo. A criação de propostas e mensagens não espera indefinidamente por um envio de notificação.
- O formulário de redefinição libera o botão após uma falha de conexão.
- O selo “Mais escolhido” do Pro usa amarelo e ícone de coroa; preço permanece R$ 59,90 por mês.
- Sete rotas antigas de ativação de produtos pagos foram fechadas: não podem liberar benefícios nem registrar receita com base apenas em um pedido do navegador. O fluxo de confirmação do Assiny permanece separado.

## Evidências executadas

- 58 testes CJS aprovados e 39 testes TypeScript aprovados: **97 testes locais**.
- TypeScript sem erros e compilação local de produção concluída. O primeiro build foi interrompido por um link de dependências fora da raiz; dependências foram copiadas para a cópia isolada e o build passou.
- Teste real anterior ao novo deploy: três contas descartáveis e um projeto explicitamente fictício; 27 verificações aprovadas. Cadastro, sessão, publicação, página pública, proposta, duplicata, isolamento de terceiros, mensagens, aceite, mudança de estado, conclusão e login.
- Remoção confirmada das contas, mensagens e projeto temporários. Nenhuma cobrança real foi criada pelo teste.
- Suíte transacional de permissões do banco passou e foi revertida com `ROLLBACK`. Verifica campos protegidos, limite gratuito de propostas e isolamento das conversas.
- As 33 tabelas públicas inspecionadas têm RLS habilitada. Isso, isoladamente, não prova que todas as políticas de tabelas experimentais sejam adequadas.

Evidências detalhadas ficam em `launch-evidence/2026-09-10-marketplace-before-deploy.json` e `launch-evidence/2026-09-10-database-permissions.json`.

## Pendências para cobrar por planos

1. O painel autenticado do Assiny continua mostrando a exigência de verificar a identidade de cada sócio administrador para ativar o checkout. A confirmação pessoal deve ser concluída pelo responsável no link já enviado ao usuário.
2. O webhook PrestaCerto está cadastrado e habilitado no Assiny. Ainda falta validar uma entrega real do provedor, os identificadores e o vínculo seguro da assinatura à conta do comprador. As flags de checkout e integração verificada permanecem desligadas até concluir esse fluxo.
3. Certo AI depende de configuração do provedor de IA e validação de geração real. Não consta chave de provedor de IA na lista de variáveis da produção consultada nesta auditoria. Certo Currículo pago também permanece indisponível.

## Limites antes de ampliar tráfego

A aprovação funcional não mede capacidade máxima. O teste de tráfego desta rodada é deliberadamente pequeno, apenas de leitura, com até cinco requisições simultâneas e interrupção em erro de servidor ou timeout. Não demonstra capacidade para campanhas de qualquer tamanho.

Redis/distribuição dos limites, proteção contra abuso direto dos formulários públicos, métricas de erro e latência e alertas operacionais precisam ser considerados antes de ampliar tráfego agressivamente. Não foi criado monitor recorrente nem gasto com anúncios nesta rodada.

## Publicação

Publicação concluída no Vercel (`READY`) e associada ao domínio principal: `dpl_E1mYEPg6UZsAKi9U7d8oubp13X5Y`, URL imutável https://prestacerto-32anrbwhb-prestacerto1.vercel.app.

Validação da versão publicada:

- 13 verificações públicas e de rejeição de usuários anônimos aprovadas.
- Novo teste completo autenticado: 27 verificações aprovadas; contas, mensagens e projeto fictício removidos novamente.
- 11 verificações de entradas inválidas e rotas restritas aprovadas.
- 180 leituras das páginas públicas: todas HTTP 200, em etapas com 1, 3 e 5 requisições simultâneas. Na etapa de cinco, 100 respostas, mediana de 325 ms e percentil 95 de 842 ms. Não houve timeout nem erro de servidor. Esse resultado não estima capacidade máxima nem cobre milhares de usuários simultâneos.
- Conferência visual no navegador: selo amarelo com coroa e Pro a R$ 59,90. Os botões pagos continuam corretamente indisponíveis.
- Diagnóstico do webhook: credenciais presentes, integração live ainda não validada. O script de diagnóstico foi ajustado para distinguir essas duas informações.

Evidências adicionais: `2026-09-10-marketplace-after-deploy.json`, `2026-09-10-input-guards.json`, `2026-09-10-bounded-traffic.json` e `2026-09-10-payments-readiness.json`, em `launch-evidence/`.

Rollback técnico disponível: a publicação anterior `dpl_EKFHk8Xu21E5Qrgp8jnxpZT5sgyJ`. Nenhuma migração persistente foi aplicada nesta rodada.
