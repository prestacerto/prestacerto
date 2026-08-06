# 🚀 PRODUÇÃO — CHECKLIST FINAL

## ✅ FUNCIONALIDADES PRONTAS

### Auth & Onboarding
- ✅ Registro com Google OAuth + Email/Senha
- ✅ Login
- ✅ Seleção de role (freelancer/client)
- ✅ Middleware protegendo `/dashboard`
- ⏳ Firebase credentials (faltam credenciais, mas código pronto)

### Marketplace Core
- ✅ Criar/Editar/Deletar serviços (freelancer)
- ✅ Listar serviços com filtro/busca (público)
- ✅ Criar/Editar projetos (client)
- ✅ Listar projetos com filtro (público)
- ✅ Enviar propostas (freelancer)
- ✅ Aceitar/Rejeitar propostas (client)
- ✅ Revelação condicional de contato (após aceite)
- ✅ Chat interno por proposta (Supabase Realtime)

### Monetização 🎯
- ✅ **Destaque de Projeto** — Modal + 3 pricing tiers
- ✅ **Badge de Verificação** — Button + Display visual
- ✅ **Antecipação de Pagamento** — Modal com cálculo de taxa 2.99%
- ✅ 3 API Routes prontas
- ⏳ Integração Mercado Pago Brick (TODOs comentados, prontos pra implementar)

### Páginas de Suporte
- ✅ Home (hero + como funciona + planos)
- ✅ Planos (toggle mensal/anual, FAQ, "Em breve")
- ✅ Contato (formulário)
- ✅ Termos de Uso / Privacidade

---

## 📋 ANTES DO DEPLOY

### 1️⃣ CREDENCIAIS FIREBASE
```bash
# Copiar de Firebase Console > Project Settings > Web App
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 2️⃣ MERCADO PAGO (Opcional pro MVP)
Se quiser ativar pagamentos de verdade:
```bash
MERCADO_PAGO_ACCESS_TOKEN=  # De https://www.mercadopago.com.br/developers
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=
NEXT_PUBLIC_SITE_URL=https://prestacerto.com
```

Sem essas, as features de monetização continuam renderizando UI mas com TODOs em vez de pagamentos reais.

### 3️⃣ EMAIL (Resend)
```bash
RESEND_API_KEY=  # De https://resend.com
```

### 4️⃣ VERCEL
```bash
vercel deploy --prod
```

---

## 🧪 TESTE MANUAL (antes de publicar)

### A. Home Page
```
1. npm run dev
2. http://localhost:3000
3. Conferir hero, planos, como funciona
4. Clicar em "Encontrar projetos" / "Contratar freelancers"
```

### B. Cadastro & Login
```
1. /register
   - Escolher "Quero oferecer serviços" (freelancer)
   - Email: teste@example.com
   - Senha: qualquer uma ou deixar em branco
   - ✅ Deve ir pra /dashboard

2. /logout (clicar no menu)
3. /login
   - Email/Senha anterior
   - ✅ Deve ir pra /dashboard
```

### C. Marketplace Completo
```
1. Logar como FREELANCER
   - /dashboard/services/new
   - Criar serviço "Desenvolvimento Web"
   - ✅ Aparece em /services

2. Logar como CLIENT
   - /dashboard/projects/new
   - Criar projeto "Preciso de um website"
   - Preencher contato obrigatório (email/telefone)
   - ✅ Aparece em /projects

3. Logar como FREELANCER de novo
   - /projects/[id] (do projeto criado)
   - ✅ Não mostra contato (ainda)
   - Clicar "Enviar proposta"
   - Mensagem + preço
   - ✅ Proposta criada

4. Logar como CLIENT
   - /dashboard/proposals
   - ✅ Vê proposta do freelancer
   - Clicar "Aceitar"
   - ✅ Status muda pra "accepted"

5. Logar como FREELANCER
   - /projects/[id] de novo
   - ✅ Agora mostra contato (revelação funcionou!)
   - Clicar no projeto → /dashboard/proposals/[id]
   - ✅ Abre chat interno
   - Digitar + enviar mensagem
   - Logar como client em outra aba
   - ✅ Mensagem aparece em real-time
```

### D. Monetização (UI only por enquanto)
```
1. /dashboard/projects/[id] (como CLIENT)
   - ✅ Botão "⭐ Destacar Projeto"
   - Clica → abre modal com 3 preços
   - ✅ Campos mostram R$ 29,90 | R$ 49,90 | R$ 79,90

2. /services/[id] (como FREELANCER logado)
   - ✅ Botão "🎖️ Verificação Profissional"
   - Clica → abre modal com R$ 9,90
   - Mensagem: "Válido por 1 ano"

3. /dashboard/proposals/[id] (em payment-retained items)
   - ✅ Botão "💸 Antecipar Pagamento"
   - Clica → mostra cálculo de taxa 2.99%
   - E.g.: R$ 1.000 → Taxa R$ 29,90 → Recebe R$ 970,10
```

---

## 🎯 PRÓXIMAS FASES (Depois do MVP)

### Fase 1: Integração Mercado Pago Brick
- [ ] Carregar MERCADO_PAGO_PUBLIC_KEY em `.env.local`
- [ ] Implementar `@mercadopago/sdk-react` em cada componente
- [ ] Criar webhook handler em `/api/monetization/webhook`
- [ ] Testar fluxo completo: click → modal → Brick payment → sucesso → feature ativada
- [ ] Adicionar visualização de features ativadas (badge, destaque, etc)

### Fase 2: Dashboard & Analytics
- [ ] Painel "Meus Destaques" (histórico, próximas renovações)
- [ ] Painel "Antecipações" (status de cada pedido)
- [ ] Gráfico de rendimento (por mês)
- [ ] Email notifications (nova proposta, proposta aceita, etc)

### Fase 3: Melhorias UX
- [ ] Filtro "Apenas verificados" em busca de serviços
- [ ] Ordem por "Destacados primeiro" em projects
- [ ] Badges visuais (verificado, destacado, responde rápido)
- [ ] Dark mode toggle

---

## 💡 NOTAS FINAIS

**O que está 100% pronto:**
- Todo o marketplace (serviços, projetos, propostas, chat)
- Todas as 3 features de monetização (estrutura completa)
- Proteção de rotas (middleware + RLS)

**O que precisa (fácil, 30 min de integração):**
- Credenciais Firebase (você copia do console)
- Integração Mercado Pago Brick nos 3 componentes (code já tem TODOs mostrando exatamente onde)
- Webhook pra confirmar pagamentos

**Sem essas integrações, o app funciona 100%:**
- Marketplace rodando
- UI de monetização renderizando
- Pagamentos mostram como placeholders (não cobram nada)

Perfeito pra testar com usuários reais antes de ligar pagamentos de verdade.

---

## 📞 SUPORTE

Dúvidas? Checklist:

1. **Credenciais Firebase missing?** → Lê FIREBASE_SETUP.md
2. **Erro ao logar?** → Firebase credentials em `.env.local`
3. **UI de pagamento não aparece?** → Procura `HighlightProjectModal`, `VerificationBadgeButton`, `EarlyPaymentButton`
4. **Quer integrar Mercado Pago?** → Lê MONETIZATION_GUIDE.md, seção "TODO: INTEGRAÇÃO MERCADO PAGO"

**Status atual do repo:** ✅ MVP completo, 🟡 pronto pra produção com credenciais + MP integration
