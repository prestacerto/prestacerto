# Plano mobile do PrestaCerto

## Diagnóstico atual

O projeto web já possui `public/manifest.json`, `service-worker.js` e `sw.js`, além de atalhos para Dashboard, Projetos e Checkout. Porém, os arquivos de imagem declarados no manifest (`icon-192.png`, `icon-512.png`, versões maskable, screenshots e atalhos) não estão presentes no diretório `public` atual. O PWA precisa ser corrigido antes de ser considerado uma experiência instalável profissional.

## Direção recomendada

A primeira etapa deve ser uma PWA instalável e responsiva, com o mesmo domínio e backend. Ela valida aquisição, retenção, notificações, propostas e mensagens sem criar uma segunda base de produto. Depois da validação, a mesma experiência pode ser empacotada em Expo para iOS e Android, compartilhando Supabase, APIs, eventos de analytics e regras de negócio.

## MVP mobile prioritário

O lado do cliente deve permitir publicar projeto, receber propostas, filtrar profissionais, conversar e acompanhar contratação. O lado do prestador deve permitir ver projetos compatíveis, usar Certo AI, enviar proposta, receber mensagens, consultar ganhos e acompanhar visualizações do perfil. Ambos devem receber notificações configuráveis e acessar indicações.

## Requisitos de qualidade

A marca deve usar azul elétrico, azul-marinho e branco, com dark mode como padrão e alternância claro/escuro persistente. O app deve ter loading states, estados vazios, feedback de ação, acessibilidade, deep links e nenhuma métrica ou conteúdo fictício. O ícone de app deve usar a logo oficial do PrestaCerto, incluindo favicon, PWA e ícones nativos.
