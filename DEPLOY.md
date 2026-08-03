# Guia de Deploy — PrestaCerto

## 📋 Antes de fazer deploy

**Status atual:**
- ✅ Supabase schema criado e testado
- ✅ `.env.local` atualizado com credenciais
- ✅ Build compilou sem erros
- ✅ Dev server rodando em `http://localhost:3000`

---

## 🚀 Deploy em 5 passos (15 min)

### 1️⃣ Criar repo no GitHub

```bash
gh repo create prestacerto --public
```

Copia a URL que aparece (ex: `git@github.com:seu-user/prestacerto.git`)

### 2️⃣ Adicionar remoto e fazer push

```bash
cd /Users/cadusima/prestacerto
git remote add origin <URL-DO-REPO>
git push -u origin main
```

### 3️⃣ Conectar Vercel

1. Vai em **vercel.com**
2. Clica "Add New..." → "Project"
3. Seleciona seu repo `prestacerto`
4. Clica "Import"
5. **Aguarda deploy automático** (3-5 min)

### 4️⃣ Adicionar Environment Variables na Vercel

No dashboard do Vercel, vai em **Settings → Environment Variables**

Adiciona estas 2:
```
NEXT_PUBLIC_SUPABASE_URL = https://taktxxxpcyxhyylzmgho.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_ArMX97jGsCK0jbe3Opd74g_ZNY2WQ36
```

**Depois de adicionar, Vercel redeploy automaticamente.**

### 5️⃣ Pronto! 🎉

Seu site tá ao vivo em: `https://prestacerto.vercel.app` (ou seu próprio domínio)

---

## 📝 Checklist

- [ ] GitHub repo criado
- [ ] Código pusheado
- [ ] Vercel projeto criado
- [ ] Env vars configuradas
- [ ] Deploy verde (sem erros)
- [ ] Testar login em produção
- [ ] Testar criar serviço
- [ ] Testar criar projeto

---

## 🔧 Troubleshooting

### Erro: "Supabase project not found"
→ Verifica se `NEXT_PUBLIC_SUPABASE_URL` tá correto em Vercel Settings

### Erro: "Auth failed"
→ Verifica se `NEXT_PUBLIC_SUPABASE_ANON_KEY` tá correto

### Erro: Build falha com "Cannot find module"
→ Roda `npm install` local, depois `git add package-lock.json && git commit && git push`

---

## 🌍 Domínio customizado (opcional)

Se quer `prestacerto.com` em vez de `.vercel.app`:

1. Vercel Settings → Domains
2. Adiciona seu domínio
3. Segue instruções de DNS (adiciona record no seu registrador)
4. ~10 min e pronto

---

## 📊 Monitoramento (pós-deploy)

Recomendado adicionar:
- **Sentry** (erro tracking)
- **PostHog** (analytics)
- **Vercel Analytics** (performance)

Mas não é crítico pro MVP.

---

**Status:** Pronto pra deploy ✅
