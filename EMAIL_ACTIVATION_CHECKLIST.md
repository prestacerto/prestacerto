# Email Automation — Checklist de Ativação

**Status**: 🔨 Implementado, aguardando ativação

## ✅ O que foi feito

- [x] Templates de e-mails (CLIENTE + PRESTADOR) — 5 steps cada
- [x] Queue system (Supabase)
- [x] Cron job (Vercel)
- [x] API Route `/api/cron/email` com security
- [x] Integração com registro (quando usuário se registra, cria 5 e-mails automáticos)
- [x] Resend integration
- [x] `.env.example` atualizado
- [x] Setup documentation

## 🔗 Arquivos criados/modificados

### Novos arquivos
```
src/lib/email/
  ├── queue.ts          # Funções de fila (Supabase)
  └── templates.ts      # Templates dos 10 e-mails

src/app/api/cron/
  └── email/route.ts    # Cron job horário

supabase/migrations/
  └── create_email_queue_table.sql  # Schema

EMAIL_AUTOMATION_SETUP.md          # Documentação completa
EMAIL_ACTIVATION_CHECKLIST.md      # Este arquivo
test-email-queue.sh                # Script de teste
.env.example                       # Atualizado
vercel.json                        # Cron config
```

### Modificados
```
src/app/api/auth/register/route.ts  # Integração com registro
```

## 📋 Checklist de Ativação

### Fase 1: Preparação (15 min)

- [ ] **1.1** Instalar dependências (já feito)
  ```bash
  npm install resend
  ```

- [ ] **1.2** Gerar `CRON_SECRET`
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- [ ] **1.3** Adicionar ao `.env.local`
  ```
  RESEND_API_KEY=re_xxxxxxxx   # De https://resend.com/api-keys
  CRON_SECRET=seu-secret-aqui
  ```

- [ ] **1.4** Testar localmente
  ```bash
  npm run dev
  ./test-email-queue.sh http://localhost:3000 seu-secret-aqui
  ```

### Fase 2: Banco de Dados (5 min)

- [ ] **2.1** Executar SQL no Supabase
  - Abra [Supabase Dashboard](https://app.supabase.com)
  - **SQL Editor**
  - Copie todo o conteúdo de `supabase/migrations/create_email_queue_table.sql`
  - Execute

- [ ] **2.2** Verificar criação
  ```sql
  SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
  WHERE TABLE_NAME = 'email_queue';
  ```
  Deve retornar 1 linha.

### Fase 3: Deploy (10 min)

- [ ] **3.1** Commit & push
  ```bash
  git add -A
  git commit -m "feat: email automation (Resend + Vercel Cron)"
  git push
  ```

- [ ] **3.2** Vercel deploy automático
  - Aguarde deploy no Vercel Dashboard
  - Verifique se passou (✅ Production)

- [ ] **3.3** Adicionar variáveis no Vercel
  - [Vercel Dashboard](https://vercel.com)
  - PrestaCerto → **Settings** → **Environment Variables**
  - Adicione:
    ```
    RESEND_API_KEY = re_xxxxxxxx
    CRON_SECRET = seu-secret-aqui
    ```

### Fase 4: Cron Job (5 min)

- [ ] **4.1** Registrar Cron no Vercel
  - Vercel Dashboard → PrestaCerto → **Settings** → **Cron Jobs**
  - Clique em **+ Create Cron**
  - **URL**: `https://prestacerto.com.br/api/cron/email`
  - **Schedule**: `0 * * * *` (toda hora)
  - **Authorization Header**: `Bearer {CRON_SECRET}`

OU

- [ ] **4.1 ALT** Se Vercel ler `vercel.json`:
  - Já tá configurado
  - Vercel pega automaticamente no próximo deploy

### Fase 5: Teste E2E (10 min)

- [ ] **5.1** Registrar usuário de teste
  - Vá em `/para-clientes`
  - Registre: `teste@seu-dominio.com` / `senha123`
  - Role `client`

- [ ] **5.2** Verificar fila criada
  - Supabase → **Table Editor** → `email_queue`
  - Filtre: `email = 'teste@seu-dominio.com'`
  - Deve haver **5 linhas** (steps 0-4)

- [ ] **5.3** Forçar envio de teste
  ```sql
  UPDATE email_queue 
  SET send_at = NOW() - interval '1 hour'
  WHERE email = 'teste@seu-dominio.com' AND status = 'pending'
  LIMIT 1;
  ```

- [ ] **5.4** Chamar Cron
  ```bash
  curl -X POST https://prestacerto.com.br/api/cron/email \
    -H "Authorization: Bearer seu-secret-aqui"
  ```

- [ ] **5.5** Verificar entrega
  - Resend Dashboard: https://resend.com/emails
  - Verifique se e-mail aparece (talvez demora 30s)
  - Supabase: `SELECT * FROM email_queue WHERE email = 'teste@seu-dominio.com' AND status = 'sent';`
  - Deve ter `status = 'sent'` com `sent_at` preenchido

- [ ] **5.6** Receber no e-mail
  - Abra a caixa de entrada
  - Deve ter e-mail de "PrestaCerto <noreply@prestacerto.com.br>"
  - Subject: "Bem-vindo à PrestaCerto 👋"

### Fase 6: Validação (5 min)

- [ ] **6.1** Registrar usuário PRESTADOR
  - Vá em `/para-prestadores`
  - Registre outro usuário
  - Verifique se 5 e-mails são criados (sequence = 'PRESTADOR')

- [ ] **6.2** Verificar timestamps
  - Step 0: `send_at` = agora
  - Step 1: `send_at` = agora + 1 dia
  - Step 2: `send_at` = agora + 3 dias
  - Step 3: `send_at` = agora + 5 dias
  - Step 4: `send_at` = agora + 7 dias

- [ ] **6.3** Verificar segurança
  - Tente chamar `/api/cron/email` sem Bearer token
  - Deve retornar `401 Unauthorized`

## 🎯 Status Esperado Após Ativação

### Linha do tempo real
- **T+0min** — Usuário registra → E-mail de boas-vindas imediato
- **T+1dia 09:00** — Automático: "Como funciona"
- **T+3dias 09:00** — Automático: "Como escolher"
- **T+5dias 09:00** — Automático: "Categorias populares"
- **T+7dias 09:00** — Automático: "Suporte"

### Monitoramento
```sql
-- Ver fila total
SELECT COUNT(*) as total FROM email_queue;

-- Ver próximos pra enviar
SELECT COUNT(*) as proximos 
FROM email_queue 
WHERE status = 'pending' AND send_at <= NOW();

-- Histórico de envios
SELECT COUNT(*) as enviados 
FROM email_queue 
WHERE status = 'sent';
```

## 🚨 Se algo der errado

### "RESEND_API_KEY is undefined"
- Verifique `.env.local`
- Reinicie `npm run dev`
- Teste: `console.log(process.env.RESEND_API_KEY)` no `/api/cron/email`

### Cron não roda
- Verifique Vercel Logs: `vercel logs --live`
- Verifique se `CRON_SECRET` está correto
- Tente chamar manualmente com curl

### Emails não saem
- Verificar `status = 'pending'` no Supabase
- Verificar `send_at` tá no passado
- Verificar API da Resend (status page)
- Verificar lixo/spam

### Tabela não existe
- Supabase pode ter erro na migração
- Tente criar manualmente no SQL Editor

## 📞 Próximas Fases

### Phase 2: Inteligência (quando tiver volume)
- Cancelar sequência se usuário age
- Sequences condicionais
- Reativação

### Phase 3: Analytics
- Open rates
- Click rates
- Conversão

### Phase 4: Migração Cloudflare (futuro)
- Vercel Cron → Cloudflare Cron
- Supabase → D1
- Mesmo código, só muda banco

---

**Desenvolvido por**: Claude Haiku 4.5
**Data**: 2026-09-17
**Próximo checkpoint**: Após ativar e testar tudo, reporte status aqui.
