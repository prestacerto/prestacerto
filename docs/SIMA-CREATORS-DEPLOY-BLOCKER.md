# Sima Creators: publicação do broker

O tenant `simacreators` já está implementado no motor e a função web está publicada. O smoke autenticado retornou `503 ENGINE_UNAVAILABLE` porque o broker Supabase ainda valida caminhos somente para `prestacerto` e `sinalmeet`.

Atualização necessária na função `sima-engine-store`:

- incluir `simacreators` na expressão `safePath`;
- incluir `simacreators` na expressão que autoriza `remove` de locks;
- incluir `simacreators` na expressão que autoriza `latest` de turnos;
- republicar a função no projeto Supabase que hospeda o broker;
- repetir o smoke em `/api/v1/engine/test/chat` com a credencial privada de teste.

As expressões devem aceitar exatamente `^(prestacerto|sinalmeet|simacreators)/...$`. Não ampliar para curingas nem expor a chave do broker. Depois da republicação, os testes esperados são HTTP 200 para Sima Creators, HTTP 403 para tenant divergente e replay idempotente sem nova inferência.
