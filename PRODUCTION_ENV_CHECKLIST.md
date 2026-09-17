# Checklist de ambiente de produção

Configure estes valores somente no servidor de hospedagem ou no painel do provedor. Nunca faça commit do arquivo `.env.local` e nunca coloque chaves service role, Mercado Pago secret, Resend ou ADMIN_EMAIL em código do navegador.

| Variável | Obrigatória | Uso |
|---|---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL pública do projeto Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Autenticação e operações públicas com RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Consultas de servidor, pagamentos e dashboard admin; nunca expor ao cliente. |
| `NEXT_PUBLIC_APP_URL` | Sim | URL oficial `https://prestacerto.com.br`. |
| `NEXT_PUBLIC_SITE_URL` | Sim | Redirects públicos e Mercado Pago. |
| `ADMIN_EMAIL` | Sim | E-mail do proprietário para bootstrap do acesso ao painel, ou substitua por registro em `admin_users`. |
| `MERCADOPAGO_CLIENT_ID` | Quando pagamentos | Credencial da aplicação Mercado Pago. |
| `MERCADOPAGO_CLIENT_SECRET` | Quando pagamentos | Segredo server-side do Mercado Pago. |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Quando checkout | Chave pública para o checkout no navegador. |
| `MERCADOPAGO_WEBHOOK_SECRET` | Quando pagamentos | Validação de notificações do webhook. |
| `MP_TOKEN_ENCRYPTION_KEY` | Quando split/contas conectadas | Criptografia dos tokens de conexão; não alterar depois de dados reais salvos. |
| `RESEND_API_KEY` | Quando e-mail transacional | Convites e notificações. |
| `RESEND_FROM_EMAIL` | Quando e-mail transacional | Remetente de domínio verificado. |
| `OPENAI_API_KEY` | Quando Certo AI | Otimização segura de propostas. |
| `ANTHROPIC_API_KEY` | Apenas legado | Rota legada de otimização; preferir consolidar no endpoint atual. |
| `CRON_SECRET` | Quando jobs | Protege lembretes e rotinas internas. |

## Antes do DNS

Aplicar as migrations aprovadas no Supabase de produção, configurar URLs de redirect de autenticação para `https://prestacerto.com.br` e `https://prestacerto.com.br/callback`, configurar SMTP, verificar o webhook do Mercado Pago e registrar o administrador na tabela `admin_users` ou definir `ADMIN_EMAIL` no servidor.

## Ordem operacional

Primeiro criar o serviço permanente e configurar as variáveis. Depois fazer um deploy de teste no subdomínio do provedor, validar health check, cadastro, login, troca de tema, favicon, Certo AI, checkout e painel admin. Só então apontar o DNS do Registro.br e testar o domínio oficial em HTTPS.
