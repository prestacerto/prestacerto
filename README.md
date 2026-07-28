# PrestaCerto

Marketplace de freelancers com modelo por assinatura — sem comissão por
projeto. Next.js 16 (App Router) + Supabase + Mercado Pago.

## Stack

- **Next.js 16** (App Router, Turbopack, `proxy.ts` — o antigo Middleware)
- **Tailwind CSS 4 + shadcn/ui (Base UI)** para o visual
- **Supabase** — autenticação (e-mail/senha + Google), Postgres, RLS
- **Mercado Pago** — split payment: o pagamento vai direto pra conta do
  freelancer, a PrestaCerto nunca recebe nem retém o valor
- **Resend** — envio dos e-mails de convite de equipe

## O que já funciona

- Home, categorias, busca de serviços/projetos, planos (Grátis, Pro R$49,
  Business R$129)
- Cadastro/login (e-mail/senha e Google), rota `/dashboard/*` protegida por
  `src/proxy.ts` + RLS
- Publicar projeto, enviar proposta, cliente aceita proposta (as demais são
  recusadas automaticamente e o projeto vira "em andamento")
- Pagamento protegido via Mercado Pago (split payment): freelancer conecta a
  própria conta MP, cliente paga pelo checkout, dinheiro cai direto pra ele
- Cliente marca o projeto como concluído; as duas partes se avaliam
  (1-5 estrelas + comentário), a nota do perfil é recalculada automaticamente
- Badge de verificado nos perfis com plano Pro/Business
- Plano Business: criar equipe, convidar até 5 pessoas por e-mail (via Resend,
  com o link de convite disponível como alternativa se preferir mandar por
  outro canal)

## O que fica pra depois

- Cobrança real da assinatura (Pro/Business) — hoje só mostra o preço
- Refresh automático do `access_token` do Mercado Pago quando expira (~180
  dias — passado isso o freelancer precisa reconectar)
- Agregador de "Vagas externas" — página placeholder por enquanto
- Página `/plans` dedicada (hoje só existe a seção de planos na home)

## Configurando o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. **SQL Editor → New query**: rode `supabase/migrations/0001_init.sql` e
   depois `supabase/migrations/0002_reviews_payments_teams.sql`, nessa ordem.
3. Em **Authentication → Providers**, confirme "Email" habilitado (e
   Google, se for usar o login social).
4. Em **Project Settings → API**, copie a **Project URL**, a **anon public
   key** e a **service_role key** (secreta — nunca commite).
5. `cp .env.local.example .env.local` e preencha as chaves do Supabase.

## Configurando o Mercado Pago

1. Crie uma aplicação em
   [mercadopago.com.br/developers/panel/app](https://www.mercadopago.com.br/developers/panel/app)
   e ative **Checkout Pro**.
2. Copie **Client ID** e **Client Secret** (credenciais de teste pra testar
   sem dinheiro real, de produção quando for pra valer).
3. Em **Webhooks → Configurar notificações**, cole
   `https://SEU-DOMINIO/api/mercadopago/webhook`, marque o evento `payment`
   e copie a chave secreta gerada.
4. Preencha `MERCADOPAGO_CLIENT_ID`, `MERCADOPAGO_CLIENT_SECRET` e
   `MERCADOPAGO_WEBHOOK_SECRET` no `.env.local`.
5. **Importante:** esse fluxo (conectar conta → aceitar proposta → pagar →
   webhook atualiza o status) não foi testado de ponta a ponta com uma conta
   real — o código segue a documentação oficial do Mercado Pago, mas rode o
   fluxo completo no modo de teste antes de aceitar pagamentos reais.

## Configurando o Resend (convites de equipe por e-mail)

1. Crie uma conta em [resend.com](https://resend.com).
2. Em **Domains**, adicione `prestacerto.com.br` (ou o domínio que for usar)
   e configure os registros DNS (SPF/DKIM) que eles indicarem — sem isso os
   e-mails caem em spam ou nem saem. Enquanto o domínio não está verificado,
   dá pra testar com o remetente `onboarding@resend.dev`.
3. Em **API Keys**, gere uma chave.
4. Preencha `RESEND_API_KEY` e `RESEND_FROM_EMAIL` no `.env.local`.
5. Sem essa chave configurada, os convites continuam funcionando
   normalmente — só não sai o e-mail automático, e o link fica disponível
   pra copiar em `/dashboard/team`.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy

1. Suba o código pra um repositório e importe na [Vercel](https://vercel.com).
2. Adicione todas as variáveis do `.env.local` no projeto da Vercel — troque
   `NEXT_PUBLIC_SITE_URL` pela URL final do site.
3. Se for usar login com Google, adicione a URL final em
   **Authentication → URL Configuration → Redirect URLs** no Supabase.
4. Atualize a URL de webhook no painel do Mercado Pago e troque para
   credenciais de produção quando for aceitar pagamentos reais.

## Estrutura do projeto

```
src/
  app/
    (public)/          páginas públicas: projetos, serviços, vagas, convite
    (auth)/              login, cadastro, recuperação de senha
    (protected)/          dashboard (protegido por src/proxy.ts)
    api/
      mercadopago/          OAuth + checkout + webhook
      proposals/             criar/aceitar proposta
      projects/[id]/complete   encerrar projeto
      reviews/                 criar avaliação
      team/                    criar equipe, convites
  components/           componentes de UI (inclui team/, ui/)
  lib/
    actions/             Server Actions (projetos)
    auth/                 getAuthenticatedUser / getProfile
    payments/              wrapper da API do Mercado Pago
    supabase/               clientes Supabase (browser, servidor, service role)
  proxy.ts               guarda de sessão pra /dashboard/*
supabase/
  migrations/            0001 (schema inicial), 0002 (reviews/pagamento/equipe)
```
