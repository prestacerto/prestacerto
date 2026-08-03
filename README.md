# PrestaCerto

Marketplace de freelancers com modelo por assinatura — sem comissão por
projeto. Next.js 16 (App Router) + Supabase + Mercado Pago.

## Stack

- **Next.js 16** (App Router, Turbopack, `proxy.ts` — o antigo Middleware)
- **Tailwind CSS 4 + shadcn/ui (Base UI)** para o visual
- **Supabase** — autenticação (e-mail/senha + Google), Postgres, RLS
- **Mercado Pago** — split payment: o pagamento vai direto pra conta do
  freelancer, a PrestaCerto nunca recebe nem retém o valor
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
- Pagamento protegido via Mercado Pago (split payment): freelancer conecta a
  própria conta MP, cliente paga pelo checkout, dinheiro cai direto pra ele
- Cliente marca o projeto como concluído; as duas partes se avaliam
  (1-5 estrelas + comentário), a nota do perfil é recalculada automaticamente
- Badge de verificado nos perfis com plano Pro/Business
- Plano Business: criar equipe, convidar até 5 pessoas por e-mail
- Notificações por e-mail (via Resend, best-effort — se falhar, a ação
  principal já aconteceu de qualquer forma): nova proposta recebida, proposta
  aceita, nova mensagem no chat, pagamento aprovado, projeto concluído
- Botões "Assinar Pro/Business" capturam interesse em `plan_interest_leads`
  (não há cobrança automática ainda — ver abaixo)

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
