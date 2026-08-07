# 🔧 GUIA RÁPIDO: Fixar Supabase RLS

## Problema
Dashboard vazio porque queries retornam "permission denied" (code 42501). Supabase RLS não está configurado.

## Solução: 5 minutos

### 1️⃣ Acessar Supabase Console
- [Supabase Dashboard](https://supabase.com/dashboard)
- Login com suas credenciais
- Clique no projeto **PrestaCerto**

### 2️⃣ Ir pra SQL Editor
- Esquerda > **SQL Editor**
- Ou clique no ícone `{}`

### 3️⃣ Copiar & Executar este SQL

```sql
-- ATIVAR RLS EM TODAS AS TABELAS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES PARA PROJECTS
-- ============================================

-- Usuários autenticados podem ver seus próprios projetos
CREATE POLICY "authenticated_can_view_own_projects"
ON public.projects
FOR SELECT
USING (auth.uid() = user_id);

-- Usuários autenticados podem criar projects
CREATE POLICY "authenticated_can_create_projects"
ON public.projects
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Usuários autenticados podem editar seus próprios projects
CREATE POLICY "authenticated_can_update_own_projects"
ON public.projects
FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- POLICIES PARA PROPOSALS
-- ============================================

-- Usuários autenticados podem ver proposals que enviaram ou receberam
CREATE POLICY "authenticated_can_view_own_proposals"
ON public.proposals
FOR SELECT
USING (
  auth.uid() = freelancer_id OR 
  auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id)
);

-- Usuários autenticados podem criar proposals
CREATE POLICY "authenticated_can_create_proposals"
ON public.proposals
FOR INSERT
WITH CHECK (auth.uid() = freelancer_id);

-- Usuários autenticados podem editar suas próprias proposals
CREATE POLICY "authenticated_can_update_own_proposals"
ON public.proposals
FOR UPDATE
USING (auth.uid() = freelancer_id);

-- ============================================
-- POLICIES PARA SERVICES
-- ============================================

-- Qualquer um pode ver serviços públicos
CREATE POLICY "anyone_can_view_services"
ON public.services
FOR SELECT
USING (true);

-- Usuários autenticados podem criar serviços
CREATE POLICY "authenticated_can_create_services"
ON public.services
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Usuários autenticados podem editar seus próprios serviços
CREATE POLICY "authenticated_can_update_own_services"
ON public.services
FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- POLICIES PARA MESSAGES
-- ============================================

-- Usuários autenticados podem ver messages que enviaram/receberam
CREATE POLICY "authenticated_can_view_own_messages"
ON public.messages
FOR SELECT
USING (
  auth.uid() = sender_id OR 
  auth.uid() = receiver_id
);

-- Usuários autenticados podem criar messages
CREATE POLICY "authenticated_can_create_messages"
ON public.messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- ============================================
-- POLICIES PARA RATINGS
-- ============================================

-- Qualquer um pode ver ratings (públicos)
CREATE POLICY "anyone_can_view_ratings"
ON public.ratings
FOR SELECT
USING (true);

-- Usuários autenticados podem criar ratings
CREATE POLICY "authenticated_can_create_ratings"
ON public.ratings
FOR INSERT
WITH CHECK (auth.uid() = reviewer_id);
```

### 4️⃣ Executar
1. Cole tudo no SQL Editor
2. Clique **Run** (ou Ctrl+Enter)
3. Espera terminar (deve ser instantâneo)

### 5️⃣ Testar
- Volte pro site
- Faça refresh no dashboard
- Projects/Proposals/Services devem aparecer agora

---

## ⚠️ Importante

- Se tiver **mais colunas** nas tabelas, ajuste as policies conforme necessário
- Exemplo: se `projects` tem coluna `is_public: boolean`, pode adicionar:
  ```sql
  CREATE POLICY "public_can_view_public_projects"
  ON public.projects
  FOR SELECT
  USING (is_public = true);
  ```

- Depois de executar, verifique em **Database** > **Policies** se as policies estão lá

---

## Se der erro

### "Relation doesn't exist"
- Tabela pode ter nome diferente (ex: `project` vs `projects`)
- Verifique em **Database** > **Tables**

### "permission denied"
- Refresh a página
- Logout/login novamente
- Clear cookies/cache

### Policies criadas mas ainda não funcionam
- Verifique se RLS está ENABLED (passo 1)
- Revise a lógica das policies
- Teste com `SELECT * FROM projects;` no SQL Editor como admin

---

**Quando tiver feito, avisa que testou e funcionou. Aí a gente vai pro próximo blocker: Signup em Produção.**
