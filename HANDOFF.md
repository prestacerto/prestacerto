> **Estado de 10/09/2026:** correções publicadas em `dpl_HJ6nq1G1bEaQspkvRawpyU4CNxP6`, branch `codex/prestacerto-go-live-20260910`, commit `509b2c3`. Fonte nesta cópia isolada; detalhes em [docs/LAUNCH_STATUS_2026-09-10.md](docs/LAUNCH_STATUS_2026-09-10.md). 58 testes aprovados; 32 verificações finais e 13 de autorização aprovadas. Checkout/IA ainda dependem de validação Assiny e credenciais. As referências abaixo são históricas.

> **Atualização de 09/09/2026:** código atual em `/Users/cadusima/Documents/Codex/prestacerto-ajustes`. Estado vigente em [relatório geral](docs/LAUNCH_STATUS_2026-09-09.md), [Certo AI](docs/CERTO_AI_MONETIZATION_2026-09-09.md) e [Assiny](docs/ASSINY_INTEGRATION_2026-09-09.md). Fluxo gratuito verificado; cota/custo da IA e eventos idempotentes por assinatura implementados. Atribuição de plano por e-mail desativada. Deployment vigente: `dpl_9dZnZccV5xgJKhoshbcAXMAJ2QSV`. Geração real e checkout continuam desativados: faltam credenciais, contrato real do provedor, vínculo automático e validade do período pago. Os painéis Assiny/OpenAI pediram login. O restante deste documento é histórico.

# PrestaCerto — Handoff técnico

Documento para quem for continuar o trabalho (pessoa ou assistente). Estado
verificado em 08/09/2026.

## 1. Onde está o código

| Onde | O que tem | Confiável? |
|---|---|---|
| `~/Documents/Codex/prestacerto-PROD` (esta pasta) | **Código real de produção** + correções de 04–05/set. Versionado em git local (1 commit). | ✅ Sim — é a fonte da verdade |
| `~/Documents/Codex/prestacerto-codigo-completo.zip` | Cópia da pasta acima, sem `node_modules`, `.next`, `.env`, `.git`, `.vercel` | ✅ Sim |
| Vercel, projeto `prestacerto1/prestacerto` | O que está no ar em prestacerto.com.br | ✅ Sim |
| GitHub `prestacerto/prestacerto` (branch `main`) | **Outro projeto** (`sites-project`, framework `vinext`) | ❌ Não use — não é o site |
| `~/Documents/Codex/2026-08-25/.../prestacerto_live` | Mesmo projeto errado do GitHub | ❌ Não use |

**Por que existe essa confusão:** o site foi deployado por `vercel deploy` direto
de um diretório que não existe mais. O código só sobreviveu dentro do Vercel; foi
baixado de lá pela API (`GET /v6/deployments/{id}/files`) em 04/set. O GitHub
nunca recebeu o site real.

## 2. Stack e hospedagem

- **Next.js 16.2** (App Router; `middleware.ts` virou `src/proxy.ts` — leia `AGENTS.md`)
- **Supabase** — projeto `taktwwwpcyxhyylzmgho` (região sa-east-1). Auth + Postgres + RLS.
- **Vercel** — projeto `prestacerto`, time `prestacerto1`. Build: `next build`. Framework preset: Next.js.
- **Assiny** (`pay.assiny.com.br`) — checkout de assinatura, **webhook-only** (não tem API de consulta).
- Domínio: `prestacerto.com.br`

Deploy: `cd prestacerto-PROD && npx vercel --prod --yes` (o CLI já está logado e a
pasta já está linkada ao projeto certo via `.vercel/project.json`).

## 3. Rollback

Deployment de produção anterior a qualquer alteração desta sessão:

- **id:** `dpl_43SsW9eB6irHn6HLHcTtDCW7ueMH`
- **url:** `https://prestacerto-oiv8ai2kk-prestacerto1.vercel.app`
- **data:** 01/09/2026, status Ready

Para voltar: Vercel → Deployments → esse deployment → ⋯ → **Instant Rollback**
(ou `npx vercel rollback <url>`). O banco não foi alterado de forma destrutiva
(só uma tabela nova + trigger, ver §5), então rollback do código é suficiente.

## 4. O que foi alterado em 04–05/set (já no ar)

| Arquivo | Mudança |
|---|---|
| `src/app/api/webhooks/assinify/route.ts` | **Novo.** Recebe eventos do Assiny e ativa/cancela plano em `profiles.plan`. Se o e-mail ainda não tem conta, grava em `pending_subscriptions`. |
| `src/app/api/webhooks/assiny/route.ts` | **Novo.** Alias do acima (o painel do Assiny foi cadastrado com esta grafia). |
| `src/lib/plans-data.ts` | Pro e Business saíram de `comingSoon`; ganharam `checkoutUrl` (links do Assiny) e features reais. `getCheckoutUrl()` aceita override por env `NEXT_PUBLIC_ASSINY_CHECKOUT_PRO/BUSINESS`. |
| `src/components/plan-cta.tsx` | Botão vira "Assinar {plano}" → link do Assiny quando há `checkoutUrl`. Sem link, cai na lista de interesse (comportamento anterior). |
| `src/components/plans-section.tsx` | Badge "LISTA DE INTERESSE" → "MAIS POPULAR" quando o plano está ativo. |
| `src/app/(public)/plans/page.tsx` | **Página virou pública** (antes exigia login e expulsava clientes). Textos "sem cobrança / planos não ativos" reescritos. |
| `src/app/page.tsx` | Textos "beta gratuito / planos não ativos / só serão oferecidos" reescritos — contradiziam o checkout ativo. |
| `src/app/api/projects/create/route.ts` e `create-with-options/route.ts` | Falha ao criar perfil **não bloqueia mais** a publicação; segue com `user_metadata`. |
| `supabase/migrations/0042_assinify_subscriptions.sql` | **Novo.** Tabela `pending_subscriptions` + trigger `apply_pending_subscription_on_profile` (aplica plano pago quando a conta é criada depois do pagamento). |

Removido: `vercel.json` do projeto errado (forçava `outputDirectory: .next` e
quebrava o build). Backup em `$TMPDIR/vercel-backup/` da sessão de 04/set.

## 5. Estado do banco (Supabase `taktwwwpcyxhyylzmgho`)

Aplicado manualmente pelo SQL Editor em 05/set (a migration 0042 acima):

- `public.pending_subscriptions` criada, RLS ligado, sem policies (só a service role escreve)
- trigger `apply_pending_subscription_on_profile` em `profiles` (BEFORE INSERT)
- `GRANT ALL` na tabela para `service_role`, `postgres`, `authenticated`

RLS de `profiles` permite `INSERT` com `auth.uid() = id` (migration 0035).
`projects` tem 2 policies de INSERT via `auth.uid()`.

## 6. ⚠️ BLOQUEADOR ATUAL — falta uma variável de ambiente

**`SUPABASE_SERVICE_ROLE_KEY` não está configurada em produção.** Só existem
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_EMAIL`,
`NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`.

Sem ela, quebra tudo que usa `createServiceClient()` (`src/lib/supabase/service.ts`):

| Efeito | Rota | Status hoje |
|---|---|---|
| **240 landing pages de SEO** (todas no sitemap) | `/contratar/[categoria]/[cidade]`, `/mercado/[categoria]/[cidade]` | **HTTP 500** |
| Perfis públicos de freelancer | `/perfil/[handle]` | **HTTP 500** |
| Ativação automática do plano após pagamento | webhook `/api/webhooks/assiny` | recebe (200) mas **não grava** — venda fica só no log |
| Painel admin "Centro de comando" | `/admin` → `/api/admin/overview` | "Unexpected end of JSON input" |

Isso **já estava assim antes** desta sessão (não foi introduzido aqui).

**Como corrigir (só o dono da conta pode — é credencial):**

1. Supabase → projeto `taktwwwpcyxhyylzmgho` → Settings → **API Keys** → aba
   **"Legacy anon, service_role API keys"** → linha **`service_role`** → clicar
   **Reveal** e depois no ícone de copiar. ⚠️ O botão Copy da linha `anon` fica
   visível o tempo todo; o da `service_role` só aparece após Reveal — **não
   confundir** (foi o erro cometido em 05/set: a anon acabou cadastrada no lugar).
2. Vercel → `prestacerto` → Settings → Environment Variables → Add:
   nome `SUPABASE_SERVICE_ROLE_KEY`, tipo Secret, ambiente **Production**.
3. Redeploy: `npx vercel --prod --yes`.
4. Validar: `curl -s -o /dev/null -w "%{http_code}" https://prestacerto.com.br/contratar/desenvolvimento-web/sao-paulo` deve virar `200`.

Outras ~30 variáveis são lidas pelo código (Mercado Pago, Stripe, e-mail,
WhatsApp, Anthropic, Upstash, VAPID…) e também não estão configuradas — cada
integração correspondente está inativa. Lista completa:
`grep -rhoP "process\.env\.[A-Z_]+" src/ | sort -u`.

## 7. Assiny (assinaturas)

- Webhook cadastrado no painel: `https://prestacerto.com.br/api/webhooks/assiny`, 17 eventos.
- Também existe um webhook para Pushcut (notificação no celular).
- Checkouts: Pro `https://pay.assiny.com.br/ba2d4a/node/rtlXli` (R$ 59,90/mês),
  Business `https://pay.assiny.com.br/e7ab2f/node/nS2aYi` (R$ 139/mês).
- Segurança opcional: definir `ASSINIFY_WEBHOOK_SECRET` no Vercel e o mesmo
  valor no header `x-assinify-token` (ou `?secret=`) no painel do Assiny.
- O payload real do Assiny **não foi observado** — o handler procura e-mail e
  plano em vários caminhos comuns e loga tudo com prefixo `[ASSINIFY]`. Após a
  primeira venda real, conferir os logs do Vercel e ajustar `pick()` se preciso.

## 8. Pendências conhecidas (não bloqueiam venda)

- GitHub `prestacerto/prestacerto` aponta para o projeto errado. Decidir se
  sobrescreve `main` com este código (recomendado) ou cria repo novo.
- Não há `SUPABASE_SERVICE_ROLE_KEY` → ver §6.
- Não há CI. Deploy é manual pelo CLI.
- `/setup`, `/leaderboard/weekly`, `/market/dashboard` retornam 404 **de
  propósito** (`notFound()` no código).

## 9. Como validar rápido

```bash
for p in / /plans /register /contratar/desenvolvimento-web/sao-paulo /perfil/x /api/webhooks/assiny; do
  printf "%-42s %s\n" "$p" "$(curl -s -o /dev/null -w "%{http_code}" "https://prestacerto.com.br$p")"
done
```

Esperado com a chave configurada: tudo `200` (perfil inexistente pode dar `404`).
