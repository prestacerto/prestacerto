# PrestaCerto — Status de Desenvolvimento

## ✅ O que tá PRONTO

### Fundação
- [x] Schema Supabase com RLS (Row Level Security) em todas as tabelas
- [x] Next.js 14+ com TypeScript + Tailwind + shadcn/ui
- [x] Middleware protegendo `/dashboard` (3 camadas de auth)
- [x] `.env.local` com credenciais Supabase

### Autenticação
- [x] Login/Register com email+senha
- [x] Forgot password
- [x] Google OAuth
- [x] Profile creation automático ao registrar

### Features de Produto
- [x] **Services** — CRUD freelancer (novo/editar/deletar/buscar/filtrar)
- [x] **Projects** — CRUD cliente (novo/editar/ver detalhes)
- [x] **Proposals** — freelancer propõe em projeto, cliente aceita/rejeita
- [x] **Project Contacts** — revelação condicional de contato (só após aceite)
- [x] **Messages/Chat** — conversa por proposta, Supabase Realtime
- [x] **Dashboard Overview** — página principal com resumos
- [x] **Team** — página de time
- [x] **Plans** — página de planos com captura de "avise-me"
- [x] **Contato** — formulário de contato
- [x] **Mercado Pago** — OAuth integrado, checkout pronto

### Segurança
- [x] Auth em middleware + Server Components + Route Handlers (3 camadas)
- [x] RLS em `profiles`, `services`, `projects`, `proposals`, `project_contacts`, `messages`
- [x] Validação de input em todas as rotas
- [x] Session refresh automático
- [x] Proteção contra CSRF/XSS via framework

---

## 🔄 O que FALTA (mínimo pra MVP)

### Dev/Deploy (HOJE)
- [ ] Rodar `npm run build` e confirmar zero erros
- [ ] Criar repo GitHub
- [ ] Push do código pro GitHub
- [ ] Deploy na Vercel + adicionar env vars (Supabase URL + key + Mercado Pago creds)

### Após Deploy (próximas fases)
- [ ] **Testes E2E** — Playwright/Cypress (fluxo completo: sign up → criar serviço → criar projeto → propor → aceitar → contato visível → chat → payment)
- [ ] **Email templates** — resend.com (já integrado, precisa de config)
- [ ] **Observability** — Sentry ou similar pra monitorar erros em produção
- [ ] **Admin panel** (futuro) — `/admin` com acesso a dados (MRR, churn, users, etc)

---

## 🚨 Questões de Negócio Resolvidas

### Pagamento
✅ **Intermediado via Mercado Pago** (não é PIX direto):
- Cliente não envia PIX pro freelancer direto
- Submete pagamento via Mercado Pago (integrado)
- Freelancer recebe após aprovação
- PrestaCerto pode reter % como taxa (configurable)
- Seguro contra scam (cliente tá protegido)

### Contato
✅ **Revelação condicional**:
- Projeto publica SEM contato visível
- Após cliente ACEITAR proposta, contato fica visível só pro freelancer
- Impedido por RLS — mesmo com exploit na API, banco nega acesso

### Chat
✅ **Isolado por proposta**:
- Conversa só existe se proposta existe
- Só participantes da proposta veem/escrevem
- Realtime via Supabase

---

## 📋 Checklist Final (20 min)

- [ ] `npm run build` → zero erros
- [ ] Criar repo GitHub: `gh repo create prestacerto --public`
- [ ] `git remote add origin ...` (URL do repo)
- [ ] `git push origin main`
- [ ] Vercel: conectar repo → deploy automático
- [ ] Vercel: Settings → Environment Variables → adicionar:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - (Mercado Pago creds — se faz checkout real)

---

## 🎯 Próximos Passos (Pós-MVP)

1. **Testes** — validar fluxo completo antes de anunciar
2. **Refinamento UX** — dark mode, mobile, responsividade
3. **Admin panel** — visualizar métricas, bloquear usuários
4. **Webhooks** — Mercado Pago → marcar projeto como `closed` após pagamento

---

**Feito em:** 2026-08-03  
**Dev server rodando em:** http://localhost:3000  
**Status:** 🟢 Pronto pra deploy
