-- Categoria dedicada pra "agentes de IA como serviço" — pedido de automação
-- com IA cresceu 118% no Fiverr e 109% no Upwork em 2026 (pesquisa de
-- mercado, agosto/2026). Formalizar a categoria agora, antes da
-- concorrência brasileira fazer isso.

insert into categories (slug, name, sort_order)
values ('agentes-ia', 'Agentes de IA & Automação', 7)
on conflict (slug) do nothing;
