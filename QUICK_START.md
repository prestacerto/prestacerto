# 🚀 QUICK START - Deploy em 3 passos

**Tempo**: ~30 minutos  
**Dificuldade**: ⭐ Fácil  
**Resultado**: App rodando no Render

---

## PASSO 1: SQL Migrations (Supabase)

### Acesse Supabase Dashboard

```
1. Abra https://app.supabase.com
2. Selecione seu projeto PrestaCerto
3. Clique em "SQL Editor" (esquerda)
4. Clique em "+ New Query"
```

### Execute 3 SQLs (copy-paste):

**Query 1**: Copiar tudo de `src/lib/supabase/profile-views.sql`
- Cole no SQL Editor
- Clique "Run"
- Resultado: ✅ "Success"

**Query 2**: Copiar tudo de `src/lib/supabase/business-tracking.sql`
- Cole no SQL Editor
- Clique "Run"
- Resultado: ✅ "Success"

**Query 3**: Copiar tudo de `src/lib/supabase/streaks.sql`
- Cole no SQL Editor
- Clique "Run"
- Resultado: ✅ "Success"

**Query 4**: Copiar e colar isso:
```sql
CREATE TABLE IF NOT EXISTS project_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  project_id uuid NOT NULL REFERENCES projects(id),
  interaction_type TEXT DEFAULT 'swipe_like',
  created_at TIMESTAMP DEFAULT now()
);

CREATE UNIQUE INDEX idx_project_interests_unique 
ON project_interests(user_id, project_id);
```
- Cole no SQL Editor
- Clique "Run"
- Resultado: ✅ "Success"

---

## PASSO 2: Variáveis de Ambiente (Render)

### Acesse Render Dashboard

```
1. Abra https://dashboard.render.com
2. Clique em "New +" → "Web Service"
3. Conecte GitHub
4. Selecione repositório: prestacerto
5. Selecione branch: main
```

### Preencha configurações:

- **Name**: prestacerto
- **Runtime**: Node
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Plan**: Standard ($12/mês)

### Clique em "Advanced" → "Environment Variables"

Adicione TODAS estas (copy-paste cada uma):

```
NODE_ENV=production

NEXT_PUBLIC_SITE_URL=https://YOUR-APP-NAME.onrender.com
(substitua YOUR-APP-NAME pelo seu)

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
(copiar de Supabase → Settings → API)

NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxx
(copiar de Supabase → Settings → API)

SUPABASE_SERVICE_ROLE_KEY=xxxxxxx
(copiar de Supabase → Settings → API)

EMAIL_HOST=smtp.seuservidor.com
EMAIL_PORT=587
EMAIL_USER=seu-email@empresa.com
EMAIL_PASSWORD=sua-senha
EMAIL_FROM=noreply@prestacerto.com.br
EMAIL_SECURE=false
```

### Clique "Create Web Service"

Aguarde ~5-10 minutos enquanto compila.

Você verá nos Logs:
```
Building...
Running npm install
Running npm run build
Starting application on port 10000
✅ Application is running
```

---

## PASSO 3: Validar em Produção

### Quando estiver verde no Render:

Abra seu app:
```
https://SEU-APP-NAME.onrender.com/checkout
```

### Teste essas coisas (5 min):

```
✅ Tela carrega em < 2 segundos?

✅ Clique em plano "Pro":
   - Botão fica destacado?
   - Resumo atualiza?

✅ Clique em add-on "Suporte Prioritário":
   - Checkbox marca?
   - Resumo atualiza?

✅ Clique em "Continuar para Revisão":
   - Vai pra próxima tela?

✅ Clique em "Continuar para Pagamento":
   - Mostra tela de sucesso?
```

Se tudo funcionar: ✅ **PRONTO!**

Se algo quebrar: Vire mais abaixo no "TROUBLESHOOTING"

---

## EXTRAS: Testar outras URLs

```
Checkout:  https://seu-app.onrender.com/checkout
Billing:   https://seu-app.onrender.com/billing
Swipe:     https://seu-app.onrender.com/explore/swipe
Landing:   https://seu-app.onrender.com/landing/designer/sao-paulo
Leaderboard: https://seu-app.onrender.com/leaderboard/weekly
Community: https://seu-app.onrender.com/community
```

Tudo deve funcionar sem erros.

---

## 🚨 TROUBLESHOOTING

### "Build failed"

```
1. Abra Render → Logs (topo da página)
2. Procure por "Error:"
3. Se disser:
   - "npm install failed" → Node version errado
   - "npm run build failed" → TypeScript error
4. Solução: verificar git push ou chamar supporte
```

### "Application crashed"

```
1. Render → Logs
2. Procure por "ECONNREFUSED" → Database offline
3. Solução: 
   - Ir em Supabase → Settings → Database
   - Verificar se está ativo
```

### "Email not sending"

```
Por enquanto, isso não é crítico.
(Vamos configurar depois quando tiver Stripe)
```

---

## ✅ QUANDO TUDO ESTIVER OK

Você tem:
- ✅ 20+ features rodando em produção
- ✅ Database seguro e performático
- ✅ Gamification (Streaks + Swipes)
- ✅ Checkout funcionando
- ✅ Landing pages otimizadas

**Próximas semanas**:
1. Configurar Stripe (payment processor)
2. A/B test das features
3. Monitorar analytics
4. Escalar usuários

---

## 📞 PRECISA DE AJUDA?

Se algo não funcionar:
- Escreva a mensagem de erro
- Diga qual URL estava testando
- Compartilhe screenshot se houver

Temos documentação completa em:
- `RENDER_MIGRATION.md` — Guia Render detalhado
- `DEPLOYMENT_CHECKLIST.md` — Checklist completo
- `IMPLEMENTATION_SUMMARY.md` — Resumo técnico

---

**Tempo esperado**: 30 minutos  
**Dificuldade**: Fácil (copy-paste + cliques)  
**Resultado**: App em produção 🚀
