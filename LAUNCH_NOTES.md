# PrestaCerto — notas de lançamento

## O que foi corrigido nesta entrega

A página inicial foi reconstruída para voltar a funcionar como um marketplace de serviços. Ela agora apresenta a proposta de valor, busca/descoberta de prestadores, categorias, profissionais em destaque, fluxo de contratação, prova de confiança e uma entrada clara para o Certo AI. A tela técnica de APIs deixou de ser a experiência principal do visitante.

O cabeçalho global foi alinhado à direção visual clara dos esboços, com navegação orientada a marketplace, CTA de cadastro e modo claro/noturno. O botão de tema mantém o comportamento de lua no modo claro e sol no modo noturno, com label acessível e persistência administrada pelo `next-themes`.

O Certo AI passou a usar uma integração server-side consistente, com validação de entrada, limite de uso, preservação explícita de fatos e comparação entre o rascunho original e a sugestão. O freelancer revisa, edita e aprova antes de enviar; a IA não envia a proposta sozinha e não deve inventar experiência, portfólio ou resultados.

A página pública do Certo AI foi reescrita com linguagem de benefício verificável, removendo claims numéricos não comprovados. A calculadora de precificação, a página Mercado e a página Como funciona foram validadas na prévia e permanecem conectadas à navegação global.

O SEO técnico foi ampliado com metadados globais, domínio canônico `www`, schema de Organização e Website, `robots.txt` atualizado e sitemap automático. O sitemap inclui páginas públicas e combinações locais de categoria/cidade geradas por `landing-data.ts`, além de revalidação periódica.

As landing pages regionais de contratação agora têm conteúdo específico de cidade/categoria, links para outras regiões, FAQ, dados estruturados e formulário de captação com nome e e-mail conectado ao endpoint de contato existente. O template evita manutenção manual de dezenas de páginas.

A configuração de cache do Next.js foi corrigida para não aplicar `no-store` às páginas e aos assets estáticos. Imagens remotas usam `remotePatterns` e TTL de cache. O build passou com as variáveis de ambiente de validação.

## Variáveis necessárias no Render ou no novo provedor

Não commite valores reais no GitHub. Configure as variáveis no painel do provedor:

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL pública do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Operações server-side protegidas |
| `OPENAI_API_KEY` | Certo AI server-side |
| `NEXT_PUBLIC_SITE_URL` | URL canônica, preferencialmente `https://www.prestacerto.com.br` |
| `NEXT_PUBLIC_APP_URL` | URL pública usada pelo Next.js |
| `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` | Rate limiting de IA, leads e propostas |
| Variáveis do Mercado Pago, Google, e-mail e demais integrações | Conforme os fluxos que forem ativados |

O repositório recebido tinha `ANTHROPIC_API_KEY` no grupo de ambiente do Render, mas a implementação corrigida desta entrega utiliza `OPENAI_API_KEY`. Adicione a variável no provedor ou altere o adaptador server-side antes de ativar o Certo AI em produção.

## Validação realizada

O comando `npm run build` concluiu com as rotas públicas, APIs, `/robots.txt` e `/sitemap.xml` listados. O repositório ainda possui erros históricos de lint e type checking fora desta entrega; o `next.config.js` mantém `ignoreBuildErrors: true`, portanto recomenda-se sanear o legado em um ciclo separado antes de tornar o CI estrito.

O build local foi executado apenas com valores fictícios de ambiente. Isso valida compilação e roteamento, mas não substitui um teste com Supabase, Redis, e-mail, Mercado Pago e OpenAI reais em ambiente de staging.

## Hospedagem recomendada

Para um público principalmente brasileiro e sem Vercel, a recomendação técnica é testar Fly.io na região `gru` (São Paulo), com uma máquina sempre ligada, health check, restart automático e Cloudflare para DNS/CDN. Render continua útil como staging, mas a documentação consultada não lista região brasileira para serviços web. Railway também não listou São Paulo na documentação consultada. AWS São Paulo é uma alternativa de maior disponibilidade e controle, mas exige mais operação.

A latência final do login depende também da região do Supabase. O app e o banco devem ficar próximos; mover apenas o Next.js para São Paulo não resolve uma autenticação que continua atravessando outra região.

## Roadmap dos módulos Certo

O núcleo de aquisição e ativação vem primeiro: marketplace, páginas regionais, calculadora, Mercado, Como funciona, Certo AI básico e badge básico. Depois entram Trending, Preço, Negotiation, Dashboard, Portfolio e Mentorship. Match, Timing, Follow-up, Archive, Certification, Network VIP e Escrow devem ser ativados com métricas reais, consentimento, regras de privacidade, suporte e validação financeira/operacional.

Nenhum percentual de conversão, taxa de ganho, ROI ou economia deve ser publicado como fato antes de haver amostra suficiente e metodologia documentada. Dados públicos de Mercado, benchmark e insights devem ser agregados e anonimizados.
