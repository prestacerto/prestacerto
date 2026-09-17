# Certo AI ativado no PrestaCerto

Publicado no domínio https://prestacerto.com.br em 11/09/2026, commit 440ec23 e deployment dpl_6cP81Prj7UGCySY4e1wwK2ZVcCJ6.

- Chave exclusiva PrestaCerto - Certo AI producao, restrita a requisições de Chat Completions; guardada como Secret somente em Production. O segredo não está neste repositório.
- Modelo gpt-4o-mini, até 400 tokens na reescrita e 500 no briefing.
- Reserva de orçamento atômica antes de chamar o provedor; por mês, tetos de US$0,30 no Grátis, US$2 no Pro, US$5 no Business e US$100 agregados para estas funções do PrestaCerto. Até 3 solicitações gratuitas por recurso.
- Reescrita e briefing retornaram HTTP200 com respostas reais usando conta autenticada. Nenhum projeto publicado nem mensagem enviada a terceiros pelo teste.
- JSON malformado/incompleto, números inválidos ou resposta truncada/filtrada não retornam falso sucesso. O texto do usuário é preservado em caso de erro. A validação de estrutura não substitui revisão factual pelo usuário.
- Timeout do editor alinhado ao servidor; 16 testes de IA, TypeScript e lint passaram antes da publicação.

Evidência: launch-evidence/2026-09-11-certo-ai-live.json.

Nenhuma configuração, chave ou código do projeto separado Cadu AI foi alterada. A chave da integração foi criada e instalada exclusivamente para PrestaCerto.

A correção de prazo pago Assiny é outro conjunto de alterações; não foi incluída neste deploy antes da aplicação da migration correspondente no banco.
