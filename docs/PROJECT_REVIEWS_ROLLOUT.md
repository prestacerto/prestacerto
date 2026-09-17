# Avaliações de projetos — PrestaCerto

Implementação de 12/09/2026. **A migration ainda não foi aplicada ao banco de produção.** Os testes locais e o build não comprovam ativação no Supabase publicado.

## Comportamento

- Uma avaliação por projeto, enviada pelo cliente dono do projeto depois da conclusão (`closed`).
- Destinatário obtido da proposta aceita; IDs de autor e destinatário não são aceitos como entrada da API.
- Nota inteira de 1 a 5; comentário opcional de até 2.000 caracteres. Nenhuma exigência de nota positiva ou de plano pago.
- A Data API permite leitura somente ao autor e ao destinatário. O formulário usa a sessão normal do cliente para inserir, com RLS e trigger de validação no banco.
- As páginas públicas consultam pelo servidor e projetam somente identificador da avaliação, nota, comentário e data. O autor é identificado como “Cliente do projeto”; IDs do projeto/autor, nome e contato do cliente não são publicados.
- A credencial privilegiada já existente permanece exclusivamente no servidor; não é enviada ao navegador nem registrada neste documento.
- As regras do banco impedem autoavaliação, avaliação de outro cliente, avaliação de projeto em aberto e duplicidade, inclusive no caso de envios concorrentes.
- As contas autenticadas não recebem permissão para alterar ou apagar a avaliação. Moderação e resposta do prestador não fazem parte desta entrega.
- Nenhuma avaliação fictícia, média pré-preenchida ou atualização artificial de `profiles.rating` é gerada.

## Pré-requisitos e aplicação

1. Confirmar o banco utilizado pela variável de produção `NEXT_PUBLIC_SUPABASE_URL`: `taktwwwpcyxhyylzmgho.supabase.co`. O projeto homônimo `vkekntnrhnucxfbxqoyg` não deve receber esta migration.
2. Inspecionar o schema real antes de aplicar: `projects(id, client_id, status)`, `proposals(id, project_id, freelancer_id, status)`, `profiles(id)`, tipos UUID e os valores reais de status.
3. Confirmar a ausência de `public.reviews` e revisar as políticas/grants/triggers existentes de projetos e propostas. Deve haver no máximo uma proposta aceita por projeto. A migration não tenta corrigir ou apagar dados preexistentes ambíguos.
4. Revisar e aplicar **somente** a nova migration cujo nome termina em `_client_project_reviews.sql`. Não aplicar `0002_reviews_payments_teams.sql`: ela mistura funcionalidades antigas de avaliações, pagamentos e equipes.
5. Verificar RLS e permissões de `anon`, `authenticated` e `service_role`, além do trigger `validate_client_project_review`. A criação da tabela e seus privilégios ocorrem na mesma transação.
6. Executar advisors de segurança/desempenho no projeto correto; verificar o índice por destinatário/data e o índice unique de projeto.
7. Publicar o código correspondente e verificar as páginas com sessão de cliente, prestador e visitante. Não é necessário `REVIEWS_ENABLED` para o novo fluxo: disponibilidade depende de schema/acesso reais.

Consulta preliminar que não retorna dados pessoais:

```sql
select to_regclass('public.reviews') as reviews_table;
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('projects', 'proposals', 'profiles')
  and column_name in ('id', 'client_id', 'status', 'project_id', 'freelancer_id')
order by table_name, ordinal_position;
select count(*) as projects_with_multiple_accepted_proposals
from (
  select project_id from public.proposals
  where status = 'accepted' group by project_id having count(*) > 1
) ambiguous;
select tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename in ('projects', 'proposals', 'reviews');
```

## Validação

O harness SQL isolado usa PostgreSQL via PGlite, com roles e fixtures locais; nenhum dado real é criado por esse teste. Ele deve validar acesso de participante e terceiro, autor/destinatário derivados, estados do projeto, unicidade e grants por coluna. Não substitui teste das políticas já instaladas no banco em produção.

Executado nesta entrega: **34 assertivas PostgreSQL passaram**, usando a migration `20260912073848_client_project_reviews.sql` e as políticas/triggers de core do repositório. O cenário de dois envios verifica o índice unique; PGlite serializa as queries e não reproduz a disputa de locks entre duas conexões remotas.

```sh
# Dependência opcional de teste, fora do projeto de produção:
npm install --prefix /tmp/prestacerto-sql-qa --no-audit --no-fund --save-exact @electric-sql/pglite@0.5.8
PGLITE_MODULE=/tmp/prestacerto-sql-qa/node_modules/@electric-sql/pglite node scripts/test-project-reviews-sql.cjs
node --test __tests__/project-reviews.test.cjs __tests__/review-form.test.cjs __tests__/review-availability.test.cjs
```

Os testes de API verificam autenticação, validação estrita de entrada, erro de infraestrutura, projeto incorreto/incompleto, prestador aceito e conflitos de gravação. O formulário deve manter nota/comentário em erro, impedir envio duplicado, encerrar carregamento após timeout e só exibir sucesso quando houver confirmação com ID.

Se a tabela ou integração não estiver disponível, a interface mantém um estado de indisponibilidade. Não deve substituir uma falha por zero avaliações nem oferecer confirmação fictícia. O código pode ser publicado antes da tabela, mas isso **não ativa** avaliações; a liberação funcional permanece condicionada à aplicação e verificação da migration.

Não publicar uma avaliação QA no catálogo real para demonstrar funcionamento. Uma avaliação real só deve ser escrita por um cliente sobre sua experiência real; cenários de teste pertencem ao banco isolado.

Referência: [Row Level Security do Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).
