# 🚨 DEBUG — Erro "Failed to fetch" do Supabase

## ❌ Problema Identificado
- Supabase não tá respondendo
- Erro: `fetch failed` (código 0)
- Isso bloqueia registro/login

## ✅ Solução (3 passos)

### 1️⃣ Verificar Projeto Supabase
```
1. Vai em https://supabase.com/dashboard
2. Loga com sua conta
3. Procura o projeto "prestacerto"
4. Verifica se tá ATIVO (não pausado)
5. Se tá pausado → ATIVA
```

### 2️⃣ Aplicar Migration (se não foi aplicada)
```
1. No dashboard Supabase → SQL Editor
2. Cria nova query
3. Copia TODO O CONTEÚDO de: supabase/migrations/0001_init.sql
4. Cola e EXECUTA
5. Aguarda terminar (pode demorar 30s)
```

### 3️⃣ Verificar Email Confirmation
```
1. Settings → Auth
2. Procura "Email Confirmations"
3. Se ativado → DESATIVA
4. Salva
```

### 4️⃣ Testar
```
1. Volta pro site: https://prestacerto.vercel.app
2. Tenta criar conta de novo
3. Se funcionar → PRONTO! 🎉
```

---

**Quando terminar esses passos, me avisa pra testar o fluxo completo!**

