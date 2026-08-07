-- PrestaCerto — ranking público de indicação, em cima da tabela `referrals`
-- que já existe (0006). De propósito: só um nível — quem indica ganha pela
-- própria indicação direta, nunca por quem a pessoa indicada indicou depois.
-- Isso não é só escolha de produto: um esquema em cadeia (ganhar por
-- recrutar recrutador) é ilegal no Brasil (Lei 1.521/51).
--
-- Rode depois de 0007_monetization_aggressive_top3.sql.

-- Ranking é dado público de propósito (parte da mecânica de competição) —
-- só nome e contagem, nunca e-mail/id/valor de recompensa.
create or replace view referral_leaderboard with (security_invoker = on) as
select
  p.id as referrer_id,
  p.full_name,
  count(*) as completed_referrals
from referrals r
join profiles p on p.id = r.referrer_id
where r.status = 'paid'
  and r.action_type = 'first_project'
  and date_trunc('month', r.paid_at) = date_trunc('month', now())
group by p.id, p.full_name
order by completed_referrals desc, p.full_name
limit 10;

grant select on referral_leaderboard to anon, authenticated;

-- Um indicado só pode ter uma indicação registrada (a primeira que chegar)
-- — necessário pro "on conflict do nothing" abaixo funcionar, e evita dois
-- indicadores diferentes disputando recompensa pela mesma pessoa.
alter table referrals add constraint referrals_referee_id_key unique (referee_id);

-- Captura a indicação direto no cadastro, via raw_user_meta_data — evita
-- depender de uma chamada autenticada logo após o signUp (que falha
-- silenciosamente se a confirmação de e-mail estiver ligada, porque não
-- existe sessão ainda nesse momento).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  referrer uuid;
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'client'),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
  );

  referrer := nullif(new.raw_user_meta_data ->> 'referrer_id', '')::uuid;
  if referrer is not null and referrer <> new.id then
    insert into public.referrals (referrer_id, referee_id, action_type, reward, status)
    values (referrer, new.id, 'first_project', 49.0, 'pending')
    on conflict (referee_id) do nothing;
  end if;

  return new;
end;
$$;
