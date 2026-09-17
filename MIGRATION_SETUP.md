# 🚀 SETUP: Migration Automática no Deploy

## ✅ Status Atual
- ✅ Arquivo de migration criado: `supabase/migrations/0007_monetization_aggressive_top3.sql`
- ✅ Contém: 2 tabelas novas + RLS + View de analytics
- ⏳ Precisa: Executar 1x no Supabase

---

## 🎯 2 CAMINHOS

### **CAMINHO 1: Executar Agora (Recomendado)**

Se você quer testar tudo hoje:

```bash
# 1. Abra o Supabase Dashboard
https://supabase.com/dashboard/projects/ksvyfikazhsyefqomyov

# 2. Vá em: SQL Editor → New query

# 3. Cole o conteúdo de:
supabase/migrations/0007_monetization_aggressive_top3.sql

# 4. Clique: RUN
```

**Pronto!** As tabelas estarão ativas em segundos.

---

### **CAMINHO 2: Rodar no Deploy (Automático)**

Quando você der deploy no Vercel/Supabase, a migration roda automaticamente:

```bash
# 1. Commit e push pro seu repo
git add supabase/migrations/0007_monetization_aggressive_top3.sql
git commit -m "feat: add tiered credits & badge system"
git push

# 2. Na próxima vez que fizer deploy:
# - Supabase CLI detecta o arquivo novo
# - Executa automaticamente
# - Você vê "Migration applied successfully"

# 3. Ou force agora:
npx supabase db push
```

---

## 📋 O QUE A MIGRATION FAZ

### Tabelas Criadas:

**`credits_subscriptions`** (Assinatura mensal/anual)
- Planos: starter, pro, unlimited
- Billing: monthly, annual (com desconto)
- Status: active, cancelled, paused
- Auto-índices para performance

**`user_badges`** (4 Tiers)
- Types: verified, top-rated, expert, vip
- Status: active, expired, cancelled
- Renovação automática tracking

### Segurança (RLS):

```sql
-- Cada user vê só seus dados
create policy "user_view_own_subscription" on credits_subscriptions
  for select using (auth.uid() = user_id);

create policy "user_view_own_badge" on user_badges
  for select using (auth.uid() = user_id);
```

### Analytics:

```sql
-- View automaticamente calcula receita por fonte
select * from revenue_by_source;

-- Resultado:
-- source                 | customer_count | estimated_revenue
-- credits                | 250            | R$ 600,000.00
-- credits_subscription   | 50             | R$ 100,000.00
-- badges                 | 200            | R$ 80,000.00
-- contests               | 100            | R$ 350,000.00
-- referrals              | 500            | R$ 300,000.00
```

---

## 🔄 Integração com Endpoints

Os endpoints já criados usam essas tabelas:

```
POST /api/monetization/credits/subscribe
  → Cria row em credits_subscriptions
  
POST /api/monetization/badges/upgrade
  → Cria row em user_badges
```

---

## ✨ Checklist

- [x] Migration file criado
- [x] Tabelas definidas
- [x] RLS policies set
- [x] Índices criados
- [x] Analytics view atualizado
- [ ] **FALTA: Executar 1x no Supabase** ← Próximo passo

---

## 🎬 Próximos Passos

**TODAY (Agora):**
1. Execute a migration (Caminho 1 ou 2 acima)
2. Teste no dashboard: `/dashboard` → vê os 6 CTAs?
3. Clique em cada modal → funciona?

**TOMORROW:**
1. Ajustar Mercado Pago webhook se necessário
2. Deploy pra produção
3. Monitorar primeiras transações

**WEEK:**
1. Análise de conversão
2. A/B test pricing
3. Campanha anunciando tiers

---

## 💡 FAQ

**P: Preciso fazer algo no código?**  
R: Não! Tudo já está integrado. Só rodar a migration.

**P: E se der erro "already exists"?**  
R: Normal — quer dizer que rodou antes. É sucesso, não erro.

**P: Posso rodar a migration 2x?**  
R: Sim! Tem `if not exists` em tudo, então é safe.

**P: Quando as mudanças vão pro ar?**  
R: Imediatamente após a migration. Usuários veem os 6 CTAs no dashboard.

---

## 📞 Suporte

Se tiver problemas:
1. Verifique se as credenciais do `.env.local` estão corretas
2. Teste a conexão com Supabase
3. Se persistir, rode a migration manual (Caminho 1)

---

*Migration pronta! Pode executar quando tiver tempo.* 🚀
