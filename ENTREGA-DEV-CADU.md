# ENTREGA AO DEV — PrestaCerto + Cadu

Snapshot local de 12/09/2026. Leia este documento primeiro; documentos históricos com títulos FINAL/100% não comprovam prontidão atual.

## O que está neste pacote

Código completo da aplicação, assets públicos, dependências declaradas/lockfile, migrações existentes, testes e documentação. Inclui alterações locais preexistentes de outras tarefas. Não é exportação de banco de dados, backup de clientes nem cópia de todas as configurações de produção. Não inclui segredos, histórico Git, dependências instaladas ou artefatos de build.

## Stack e execução

Next.js 16.2.12, React 19.2.4, TypeScript, Tailwind, Supabase e Vercel. Use Node compatível com o package.json/Next; o ambiente de trabalho desta entrega usou Node 24.

```sh
npm ci
npm run dev
npm run build
node --test __tests__/cadu-support.test.cjs
```

O teste visual scripts/check-cadu-ui.cjs referencia um caminho local do Playwright: adapte para a instalação do dev. Configurações, integrações e credenciais precisam ser obtidas com o proprietário por canal seguro; não colocar chaves no código ou no chat.

## Onde começar na integração

- src/components/support/cadu-widget.tsx: widget e eventos.
- src/app/api/support/chat/route.ts: API pública protegida.
- src/app/api/support/engine/route.ts: motor interno autenticado.
- src/app/api/support/handoff/route.ts: registro de atendimento humano.
- src/lib/support/knowledge.ts: conhecimento e instruções.
- src/lib/support/chat.ts: contrato, assinatura e transporte.
- src/lib/support/storage.ts: armazenamento privado e quotas.
- docs/CADU_SUPPORT_INTEGRATION.md: evidências, resultados, restrições e rollback.

## Acessos externos necessários

Solicitar convite ao projeto Vercel prestacerto (scope prestacerto1) e ao Supabase do PrestaCerto. Segredos de produção: SIMA_AI_API_URL, SIMA_AI_API_KEY, SIMA_AI_TENANT_ID, SIMA_AI_MODEL, OPENAI_API_KEY e SUPABASE_SECRET_KEY; configurações públicas do Supabase também são necessárias. Outras features dependem das respectivas variáveis existentes. Não executar configure-cadu-env.cjs para substituir chaves já configuradas.

Não há remote Git configurado neste checkout. O ZIP não concede acesso aos serviços. O dono deve convidar o dev separadamente; não compartilhar a conta pessoal.

## Publicação

Deploy direto via Vercel CLI autenticada, não via GitHub Actions neste fluxo. Domínio https://prestacerto.com.br. Última versão desta integração: dpl_AugnVZzsqbi4nRtvFRg9tC1KXH73. Conferir versão atual antes de publicar; o ZIP pode ficar desatualizado.

## Prioridades para o dev

1. Implementar/adotar rate limiter distribuído próprio para produção, sem depender de reservas em Storage; limitar handoff globalmente e proteger contra automação abusiva.
2. Certificar 100 usuários recebendo respostas reais simultaneamente em ambiente de carga isolado. O teste final existente foi de 100 requisições com proteção ativa: 39 respostas, 61 bloqueios e zero 5xx, não 100 respostas garantidas.
3. Configurar retenção/limpeza das conversas e métricas; validar recebimento de notificações pela equipe. Handoff gravado não equivale a e-mail entregue.
4. Para centralizar no SimaAI, implantar API multi-tenant real com autenticação por tenant, isolamento de dados e gestão de conhecimento. Hoje o runtime é dedicado ao PrestaCerto.
5. Testar cadastro, compra e atribuição ponta a ponta com sandbox, sem emitir cobranças reais. Não rodar scripts SQL históricos de desativação de RLS ou setup sem revisão e backup.

## Divisão sugerida de trabalho

Dev: infraestrutura, contrato de integração, persistência, monitoramento, segurança e certificação de carga.
SimaAI: comportamento consultivo, conhecimento verificável por empresa, objeções/upsell, critérios de recomendação entre empresas e avaliação de qualidade. Nenhuma recomendação entre empresas autoriza transferir dados do visitante sem consentimento.
