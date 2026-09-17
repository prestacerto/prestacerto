# Email Automation Setup — PrestaCerto

**Stack**: Resend (emails) + Vercel Serverless (API Routes) + Supabase (database)

## 1. Database Setup

### Criar tabela no Supabase

1. Abra [Supabase Dashboard](https://app.supabase.com) → seu projeto
2. Vá em **SQL Editor**
3. Copie e execute o SQL de `supabase/migrations/create_email_queue_table.sql`

Isso cria:
- `email_queue` — fila de e-mails pendentes
- Índices — queries rápidas
- Trigger — `updated_at` automático

### Verificar criação
```sql
SELECT * FROM email_queue LIMIT 1;
```

## 2. Environment Variables

Adicionar ao `.env.local`:

```bash
# Resend (email service)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx  # De https://resend.com/api-keys

# Vercel Cron (security)
CRON_SECRET=your-very-secret-random-token-here
```

**Como gerar CRON_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Deploy & Cron Setup

### Push pra Vercel
```bash
git add .
git commit -m "chore: add email automation (Resend + Cron)"
git push
```

### Registrar Cron Job no Vercel

1. Abra [Vercel Dashboard](https://vercel.com)
2. Selecione projeto PrestaCerto
3. Vá em **Settings** → **Cron Jobs**
4. Clique em **+ Create Cron**
5. Configure:
   - **URL**: `https://prestacerto.com.br/api/cron/email` (ou seu domínio)
   - **Schedule**: `0 * * * *` (toda hora, minuto 0)
   - **Authorization Header**: `Bearer {CRON_SECRET}`

Ou atualize o `vercel.json` que já foi criado:
```json
{
  "crons": [{
    "path": "/api/cron/email",
    "schedule": "0 * * * *"
  }]
}
```

Vercel ler esse arquivo automaticamente no próximo deploy.

## 4. Email Templates

Templates definidos em `src/lib/email/templates.ts`:

### CLIENTE (clientes que contratam)
- **Step 0** (Imediato): Bem-vindo
- **Step 1** (Dia 1): Como funciona
- **Step 2** (Dia 3): Como escolher
- **Step 3** (Dia 5): Categorias populares
- **Step 4** (Dia 7): Suporte

### PRESTADOR (freelancers)
- **Step 0** (Imediato): Bem-vindo
- **Step 1** (Dia 1): Completar perfil
- **Step 2** (Dia 3): Conseguir clientes
- **Step 3** (Dia 5): Quanto cobrar
- **Step 4** (Dia 7): Plano Pro

## 5. Testing

### Teste Local (sem Cron)

```bash
# Chamar manualmente a rota de envio
curl -X POST http://localhost:3000/api/cron/email \
  -H "Authorization: Bearer seu-secret-aqui" \
  -H "Content-Type: application/json"
```

Resposta esperada:
```json
{
  "success": true,
  "sent": 2,
  "failed": 0,
  "total": 2
}
```

### Teste End-to-End

1. **Registrar usuário** via `/para-clientes` ou `/para-prestadores`
2. **Verificar fila**:
```sql
SELECT * FROM email_queue WHERE email = 'seu@email.com';
```

Devem aparecer 5 linhas (uma pra cada step, com `send_at` em horários diferentes).

3. **Forçar envio** (mudar `send_at` pro passado pra testar):
```sql
UPDATE email_queue 
SET send_at = NOW() - interval '1 hour'
WHERE email = 'seu@email.com' AND status = 'pending';
```

4. **Chamar cron**:
```bash
curl -X POST http://localhost:3000/api/cron/email \
  -H "Authorization: Bearer seu-secret"
```

5. **Verificar se foi enviado**:
```sql
SELECT * FROM email_queue WHERE email = 'seu@email.com' AND status = 'sent';
```

Devem estar marcadas como `sent` com `sent_at` preenchido.

## 6. Monitoramento

### Resend Dashboard
- [resend.com/emails](https://resend.com/emails) — histórico de envios
- Bounce rates, delivery status, etc.

### Logs do Vercel
```bash
# Terminal
vercel logs --live
```

### Verificar fila de pendentes
```sql
SELECT COUNT(*) FROM email_queue WHERE status = 'pending';

-- Ver próximos pra enviar
SELECT * FROM email_queue 
WHERE status = 'pending' 
AND send_at <= NOW()
ORDER BY send_at ASC;
```

## 7. Futura Migração (Cloudflare)

Estrutura pronta pra migrar:
- `src/lib/email/queue.ts` — abstração de fila (só muda Supabase → D1)
- `src/lib/email/templates.ts` — templates (sem dependências externas)
- `src/app/api/cron/email/route.ts` — handler (vira Cloudflare Worker)

Quando migrar pra Cloudflare:
1. Mude `queue.ts` pra usar D1 em vez de Supabase
2. Mude `route.ts` pra ser um Cloudflare Worker
3. Registre em `wrangler.toml` em vez de `vercel.json`

Tudo mais fica igual.

## Troubleshooting

### "RESEND_API_KEY not found"
- Verificar `.env.local` tem a chave
- Reiniciar dev server

### Emails não saem
- Verificar `status = 'pending'` no Supabase
- Verificar `send_at` tá no passado
- Chamar `/api/cron/email` manualmente
- Verificar logs no Vercel

### Fila travada
- Marcar como failed: `UPDATE email_queue SET status = 'failed' WHERE ...`
- Retentar: `UPDATE email_queue SET status = 'pending' WHERE email = '...'`

## Próximos Passos (Phase 2)

Depois da base funcionar, adicionar:

1. **Triggers inteligentes**
   - Cancelar sequência CLIENTE se publicar projeto
   - Cancelar sequência PRESTADOR se completar perfil

2. **Sequências condicionais**
   - Onboarding pós-primeira-ação
   - Reativação (30+ dias sem login)

3. **A/B Testing**
   - Teste de subject lines
   - Teste de timing (horários)

4. **Analytics**
   - Open rates (via Resend tracking)
   - Click rates
   - Conversion funnel

---

**Desenvolvido por**: Claude Haiku 4.5 + Cadu
**Última atualização**: 2026-09-17
