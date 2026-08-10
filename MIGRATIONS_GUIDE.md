# 🚀 Guia de Execução das Migrations

## Passo 1: Acessar Supabase Console

1. Vá para https://app.supabase.com
2. Selecione o projeto `prestacerto`
3. Clique em **SQL Editor** (lado esquerdo)

## Passo 2: Executar Migration 0029 (Conectar/Propostas)

1. Clique em **New Query**
2. Cole o conteúdo de: `supabase/migrations/0029_connects_proposal_limits.sql`
3. Clique em **▶ Run** (canto inferior direito)
4. Aguarde a mensagem **✓ Success**

## Passo 3: Executar Migration 0030 (Priority Queue)

1. Clique em **New Query**
2. Cole o conteúdo de: `supabase/migrations/0030_priority_queue.sql`
3. Clique em **▶ Run**
4. Aguarde **✓ Success**

## Passo 4: Verificar Criação das Tabelas

Execute esta query pra confirmar:

```sql
-- Verificar Conectar tables
SELECT tablename FROM pg_tables WHERE tablename LIKE 'user_connects%' OR tablename LIKE 'connects_%';

-- Verificar Priority Queue tables
SELECT tablename FROM pg_tables WHERE tablename LIKE 'priority_queue%';
```

Deve retornar:
- ✓ user_connects_quota
- ✓ connects_transactions
- ✓ connects_packages
- ✓ connects_purchases
- ✓ priority_queue_subscriptions
- ✓ priority_queue_purchases

## ⚠️ IMPORTANTE

Se receber erro de "tabela já existe", é seguro ignorar (já foi criada em execução anterior).

Se receber erro de função duplicada, também é seguro ignorar.

## Próximo Passo

Depois de executar ambas, volte aqui e avise:
```
✅ Migrations executadas com sucesso!
```
