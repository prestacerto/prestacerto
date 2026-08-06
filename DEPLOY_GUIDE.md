# 🚀 DEPLOYMENT — GUIA PASSO A PASSO

## 1️⃣ PRÉ-REQUISITOS

### Conta Vercel
- [ ] Sign up em https://vercel.com
- [ ] Conectar GitHub (se usar Git)
- [ ] Criar novo projeto

### Credenciais Necessárias

Você precisa de **3 conjuntos de credenciais** pra produção:

#### A) Firebase (Obrigatório)
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

**Como pegar:**
1. Ir em https://console.firebase.google.com/
2. Projeto → Settings ⚙️ → General
3. "Web" → copiar o objeto de configuração
4. Colar em `.env.local` localmente
5. Depois copiar pra Vercel Environment Variables

#### B) Supabase (Legado - ainda usado em algumas rotas)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Como pegar:**
1. Ir em https://supabase.com/dashboard/
2. Projeto → Settings → API
3. Copiar URL e "anon" key

#### C) Resend (Email - Opcional pro MVP)
```
RESEND_API_KEY
```
Se não usar, deixe em branco — emails não vão funcionar mas a app continua.

---

## 2️⃣ DEPLOY LOCAL (ANTES DE VERCEL)

### Testar Build
```bash
npm run build
```

**Se falhar:** Revisar erros de TypeScript/ESLint. Se passar → próximo passo.

### Testar Production Locally
```bash
npm run build
npm start
```

Visitar http://localhost:3000 e testar:
- [ ] Home carrega
- [ ] /register carrega
- [ ] /login carrega
- [ ] Navegação funciona

---

## 3️⃣ SETUP VERCEL

### Opção A: CLI (Mais rápido)

```bash
npm i -g vercel
vercel
```

**Prompts:**
```
? Set up and deploy "~/prestacerto"? Yes
? Which scope? [seu-username]
? Detected Next.js. OK to proceed? Yes
? Link to existing project? No
? What's your project's name? prestacerto
? In which directory is your code? ./
? Want to modify vercel.json? No
? Create GitHub repository? (Yes) ← se quiser CI/CD
```

### Opção B: Web Dashboard (Mais visual)

1. Ir em https://vercel.com/new
2. Conectar GitHub → selecionar repo
3. "Import" → cria projeto automaticamente

---

## 4️⃣ ADICIONAR ENVIRONMENT VARIABLES

### Via CLI
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# ... repita pra cada variável
```

### Via Dashboard
1. Projeto → Settings → Environment Variables
2. Clicar "+Add"
3. Copiar/colar cada variável

**⚠️ IMPORTANTE:**
- Variáveis `NEXT_PUBLIC_*` aparecem no frontend (seguro)
- Variáveis sem prefixo ficam privadas no servidor (muito importante pra tokens)
- Use `.env.local` nunca com `.env` — `.env` foi feito pra versionamento, `.env.local` não

---

## 5️⃣ FAZER DEPLOY

### Primeira vez (CLI)
```bash
vercel --prod
```

### Updates (Git push)
Se conectou GitHub e configurou auto-deploy:
```bash
git push origin main
```
Vercel compila e deploya automaticamente. Checkar em https://vercel.com/dashboard

---

## 6️⃣ CHECKLIST PÓS-DEPLOY

- [ ] Site abre em https://prestacerto.vercel.app
- [ ] Home page carrega sem erros
- [ ] Consola do navegador sem erros críticos (avisos de Supabase são ok)
- [ ] /register e /login carregam
- [ ] Botão "Entrar" leva pra login
- [ ] Navegação funciona (Serviços, Projetos, Planos)

**Verificar no navegador:**
```javascript
// F12 → Console → testar se Firebase carregou
console.log(window.firebase ? '✅ Firebase OK' : '❌ Firebase missing')
```

---

## 7️⃣ DOMÍNIO CUSTOMIZADO (Opcional)

### Adicionar seu domínio
1. Projeto → Settings → Domains
2. Clicar "Add"
3. Entrar domínio (ex: www.prestacerto.com)
4. Seguir instruções de DNS da sua registradora

---

## 8️⃣ CI/CD AUTOMÁTICO

Se conectou GitHub:
- Cada push → branch automático deployment
- Merge pra main → production deployment automático
- Rollback fácil se algo quebrar

**Preview URLs:**
```
main = https://prestacerto.vercel.app
feature/x = https://prestacerto-feature-x.vercel.app
```

---

## 🆘 TROUBLESHOOTING

### "Cannot find module '@/lib/firebase'"
→ Build error. Verificar import paths no `.ts`/`.tsx`

### "NEXT_PUBLIC_FIREBASE_* is undefined"
→ Variáveis de ambiente não carregadas. Ir em Settings → Environment Variables e revisar

### "Firebase initialization failed"
→ Credenciais inválidas ou ausentes. Verificar valores copiados de Firebase Console

### Site fica branco
→ JS error. Abrir F12 Console e procurar red errors

### Build demora muito (>5 min)
→ Normal primeira vez. Se ficar muito tempo, cancelar e tentar de novo

---

## 📋 CHECKLIST FINAL

Antes de comunicar publicamente:

- [ ] `.env.local` criado com credenciais reais
- [ ] `npm run build` passa sem erros
- [ ] `npm start` funciona localmente
- [ ] Vercel project criado
- [ ] Todas as env vars adicionadas
- [ ] Deploy inicial feito (`vercel --prod`)
- [ ] URL pública acessível
- [ ] Home page e auth carregam sem erros
- [ ] No console: sem erros críticos (avisos ok)
- [ ] Domínio apontado (opcional)

---

## 💡 PRÓXIMAS FASES

1. **Integração Mercado Pago Brick** (30 min)
   - Adicionar `MERCADO_PAGO_PUBLIC_KEY` em env vars
   - Integrar nos 3 componentes de monetização
   - Testar fluxo completo

2. **Analytics/Logging** (1-2 horas)
   - Adicionar Sentry ou equivalente
   - Logs de erros automáticos
   - Alertas quando algo quebra

3. **Performance** (1-2 horas)
   - Minify/bundle size audit
   - Image optimization
   - Cache headers

---

**Dúvidas?** Ver DEPLOYMENT_CHECKLIST.md ou rodar:
```bash
vercel help
```
