# PrestaCerto

Marketplace de freelancers com modelo por assinatura — sem comissão por
projeto. Next.js 16 (App Router) + Supabase + Mercado Pago.

## Stack

- **Next.js 16** (App Router, Turbopack, `proxy.ts` — o antigo Middleware)
- **Tailwind CSS 4 + shadcn/ui (Base UI)** para o visual
- **Supabase** — autenticação (e-mail/senha + Google), Postgres, RLS
- **Mercado Pago** — split payment com **retenção**: o cliente paga e o
  valor fica reservado pelo próprio Mercado Pago (não pela PrestaCerto) até
  o cliente confirmar a entrega; só então cai na conta do freelancer. Se
  ninguém confirmar em 5 dias, a retenção expira e o valor volta pro
  cliente. A PrestaCerto nunca chega a receber ou guardar o dinheiro.
- **Resend** — e-mails transacionais (convite de equipe, notificações,
  contato)

## O que já funciona

- Home, categorias, busca de serviços/projetos, `/plans`, `/como-funciona`,
  `/ajuda` (central de ajuda), `/contato` (formulário → `contact_messages`)
- Cadastro/login (e-mail/senha e Google), rota `/dashboard/*` protegida por
  `src/proxy.ts` + RLS
- Dashboard: visão geral, meus serviços (criar/editar/pausar/excluir), meus
  projetos, minhas propostas, minha equipe
- Publicar projeto, enviar proposta, cliente aceita proposta (as demais são
  recusadas automaticamente e o projeto vira "em andamento")
- Chat por proposta (`/dashboard/messages/[proposalId]`) entre cliente e
  freelancer — não é realtime, atualiza ao recarregar a página
- Revelação de contato: assim que a proposta é aceita, o freelancer vê o
  e-mail/telefone que o cliente informou ao publicar o projeto
- Pagamento retido via Mercado Pago: freelancer conecta a própria conta MP,
  cliente paga com cartão dentro do site (Card Payment Brick), o valor fica
  reservado até o cliente confirmar a entrega — só então é liberado pro
  freelancer. Se ninguém confirmar em 5 dias, a retenção expira sozinha e o
  valor volta pro cliente (com lembrete por e-mail perto do prazo)
- Cliente marca o projeto como concluído (isso libera o pagamento retido);
  as duas partes se avaliam (1-5 estrelas + comentário), a nota do perfil é
  recalculada automaticamente
- Badge de verificado nos perfis com plano Pro/Business
- Plano Business: criar equipe, convidar até 5 pessoas por e-mail
- Notificações por e-mail (via Resend, best-effort — se falhar, a ação
  principal já aconteceu de qualquer forma): nova proposta recebida, proposta
  aceita, nova mensagem no chat, pagamento aprovado, projeto concluído
- Botões "Assinar Pro/Business" capturam interesse em `plan_interest_leads`
  (não há cobrança automática ainda — ver abaixo)
- Monetização à la carte, ainda como placeholder (grava no banco mas não
  cobra de verdade — ver `TODO` em cada rota): destacar projeto
  (`/api/monetization/highlight`), selo de verificado
  (`/api/monetization/verify`) e antecipação de recebimento
  (`/api/monetization/early-payment`)

## O que fica pra depois

- Cobrança real e recorrente da assinatura (Pro/Business) — hoje o clique em
  "Quero assinar" só registra o interesse do usuário, alguém precisa entrar
  em contato manualmente pra ativar
- Refresh automático do `access_token` do Mercado Pago quando expira (~180
  dias — passado isso o freelancer precisa reconectar)
- Agregador de "Vagas externas" — página placeholder por enquanto
- Chat em tempo real (hoje precisa recarregar a página pra ver mensagem nova)

## Configurando o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. **SQL Editor → New query**: rode as migrations em `supabase/migrations/`
   em ordem numérica (0001 → 0004).
3. Em **Authentication → Providers**, confirme "Email" habilitado (e
   Google, se for usar o login social).
4. Em **Project Settings → API**, copie a **Project URL**, a **anon public
   key** e a **service_role key** (secreta — nunca commite).
5. `cp .env.local.example .env.local` e preencha as chaves do Supabase.

## Configurando o Mercado Pago

O pagamento usa retenção (captura manual): o cliente autoriza o cartão, o
valor fica reservado pelo Mercado Pago, e só é capturado (liberado pro
freelancer) quando o cliente confirma a entrega —
ver `src/lib/payments/mercadopago.ts` pros detalhes e limitações conhecidas.

1. Crie uma aplicação em
   [mercadopago.com.br/developers/panel/app](https://www.mercadopago.com.br/developers/panel/app).
2. Copie **Client ID** e **Client Secret** (credenciais de teste pra testar
   sem dinheiro real, de produção quando for pra valer) e a **Public Key**
   da aplicação.
3. Em **Webhooks → Configurar notificações**, cole
   `https://SEU-DOMINIO/api/mercadopago/webhook` e copie a chave secreta
   gerada — **obrigatória em produção** (sem ela o webhook recusa qualquer
   notificação, ver `route.ts`).
4. Preencha no `.env.local`: `MERCADOPAGO_CLIENT_ID`,
   `MERCADOPAGO_CLIENT_SECRET`, `MERCADOPAGO_WEBHOOK_SECRET`,
   `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` (a public key da aplicação, usada no
   navegador pro formulário de cartão) e `MP_TOKEN_ENCRYPTION_KEY` (gere com
   `openssl rand -base64 32` — criptografa o token de cada freelancer
   conectado).
5. **Importante, antes de aceitar cartão real:** o campo que ativa a
   retenção (`capture_mode: "manual"` na API de Orders) veio da
   documentação pública do Mercado Pago, não foi confirmado contra o
   sandbox deles. Rode uma transação de teste e confirme que o pagamento
   fica com status retido (não aprovado direto) antes de ligar isso pra
   usuário real.
6. Pro lembrete automático de retenção prestes a expirar
   (`/api/cron/payment-reminders`, configurado em `vercel.json`), defina
   `CRON_SECRET` no `.env.local` — é o valor que a Vercel Cron manda no
   header `Authorization` quando dispara.

## Configurando o Resend (e-mails transacionais)

Usado pra: convite de equipe, notificação de nova proposta/aceite/mensagem/
pagamento/conclusão, e notificação de mensagem do formulário de contato.

1. Crie uma conta em [resend.com](https://resend.com).
2. Em **Domains**, adicione `prestacerto.com.br` (ou o domínio que for usar)
   e configure os registros DNS (SPF/DKIM) que eles indicarem — sem isso os
   e-mails caem em spam ou nem saem. Enquanto o domínio não está verificado,
   dá pra testar com o remetente `onboarding@resend.dev`.
3. Em **API Keys**, gere uma chave.
4. Preencha `RESEND_API_KEY`, `RESEND_FROM_EMAIL` e `RESEND_CONTACT_EMAIL`
   (pra onde vão as mensagens de `/contato`) no `.env.local`.
5. Sem `RESEND_API_KEY` configurada, tudo continua funcionando normalmente —
   só não sai nenhum e-mail automático (convites de equipe continuam com o
   link pra copiar em `/dashboard/team`).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy

1. Suba o código pra um repositório e importe na [Vercel](https://vercel.com).
2. Adicione todas as variáveis do `.env.local` no projeto da Vercel — troque
   `NEXT_PUBLIC_SITE_URL` pela URL final do site (ex.: `https://prestacerto.com.br`).
3. Se for usar login com Google, adicione a URL final em
   **Authentication → URL Configuration → Redirect URLs** no Supabase.
4. Atualize a URL de webhook no painel do Mercado Pago e troque para
   credenciais de produção quando for aceitar pagamentos reais.
5. O domínio em si (compra + DNS) é feito fora daqui, no registrador
   (ex.: registro.br) e no painel **Domains** da Vercel.
6. **Cold start:** o site fica vazio (sem serviços/projetos) até alguém
   cadastrar de verdade — antes de divulgar, vale publicar alguns
   serviços/projetos reais (seus, de conhecidos, de beta testers) pra não
   parecer abandonado pro primeiro visitante. Evite dado fake — quebra a
   mesma confiança que o "zero comissão" tenta construir.

## Estrutura do projeto

```
src/
  app/
    (public)/          páginas públicas: projetos, serviços, vagas, convite
    (auth)/              login, cadastro, recuperação de senha
    (protected)/          dashboard (protegido por src/proxy.ts)
    api/
      mercadopago/          OAuth + checkout (retido) + webhook
      monetization/          destaque/verificação/antecipação (placeholder)
      cron/                   lembrete de retenção prestes a expirar
      proposals/             criar/aceitar proposta
      projects/[id]/complete   encerrar projeto (libera pagamento retido)
      reviews/                 criar avaliação
      team/                    criar equipe, convites
  components/           componentes de UI (inclui monetization/, team/, ui/)
  lib/
    actions/             Server Actions (projetos)
    auth/                 getAuthenticatedUser / getProfile
    crypto/                criptografia do token do Mercado Pago
    payments/              wrapper da API do Mercado Pago
    supabase/               clientes Supabase (browser, servidor, service role)
  proxy.ts               guarda de sessão pra /dashboard/*
supabase/
  migrations/            0001 schema inicial · 0002 reviews/pagamento/equipe
                         · 0003 retenção de pagamento · 0004 monetização
```
// rebuild trigger
// rebuild trigger Tue Aug 11 20:41:33 -03 2026
