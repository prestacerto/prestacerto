# Trigger de criação automática de perfil

A migration `supabase/migrations/0036_auto_create_profile.sql` configura o trigger `on_auth_user_created` na tabela `auth.users`.

## O que ela faz

Após cada cadastro, a função `public.handle_new_user()` cria uma linha em `public.profiles` usando:

- `auth.users.id` como `profiles.id`;
- e-mail normalizado em minúsculas;
- `raw_user_meta_data.role`, aceitando somente `freelancer`, `client` ou `both`;
- `raw_user_meta_data.full_name`, com fallback para a parte anterior ao `@` do e-mail;
- `raw_user_meta_data.referrer_id`, resolvendo primeiro um código público em `referral_codes` e aceitando UUIDs antigos quando válidos;
- plano inicial `free`;
- `ON CONFLICT (id) DO NOTHING`, para não duplicar perfil.

A migration também faz backfill de usuários que já existem no Auth, mas ainda não possuem perfil. Quando o cadastro vem de um link de indicação válido, ela registra uma indicação direta pendente; a recompensa só deve ser liberada após o primeiro pagamento aprovado.

## Como aplicar no Supabase

1. Abra o projeto correto no Supabase.
2. Entre em **SQL Editor** e crie uma nova query.
3. Copie todo o conteúdo de `supabase/migrations/0036_auto_create_profile.sql`.
4. Execute uma única vez.
5. Confira em **Database → Functions/Triggers** se existe `public.handle_new_user` e o trigger `on_auth_user_created` em `auth.users`.

Não substitua as chaves do projeto no arquivo e não execute o SQL em outro banco.

## Como testar

Crie uma conta de teste pela página `/register?role=freelancer` e outra pela página `/register?role=client`, usando e-mails diferentes. Confirme o e-mail caso a confirmação esteja habilitada. Depois, no SQL Editor, consulte:

```sql
select id, email, role, full_name, plan, created_at
from public.profiles
order by created_at desc
limit 10;
```

O primeiro usuário deve aparecer com `role = 'freelancer'` e o segundo com `role = 'client'`. Para testar indicação, use um link no formato `/register?ref=CODIGO_PUBLICO`; o código precisa existir em `public.referral_codes` e a linha em `public.referrals` deve começar como `pending`. Para testar idempotência, não execute novamente o cadastro com o mesmo e-mail; o Auth já considera e-mail duplicado um erro esperado. O trigger, porém, não cria duas linhas para o mesmo `id`.

## Observação sobre OAuth

O cadastro por e-mail já envia `role` e `full_name` nos metadados do Supabase. O Google OAuth ainda deve ser validado separadamente, porque o provedor não recebe automaticamente a escolha de papel feita na tela. Até essa etapa, o trigger usa `freelancer` como fallback seguro para contas sociais sem `role` no metadata.

## Verificação de segurança

A função usa `SECURITY DEFINER` e `search_path` fixo para conseguir inserir no perfil durante o trigger sem depender da sessão anônima. Ela não recebe SQL ou dados arbitrários do usuário. As políticas RLS continuam protegendo leituras e alterações feitas pela aplicação.
