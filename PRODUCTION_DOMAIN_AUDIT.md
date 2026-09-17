# Auditoria do domínio oficial

Data: 18 de agosto de 2026.

O endereço `https://www.prestacerto.com.br` está acessível em HTTPS, mas ainda serve a versão antiga que exibe “PrestaCerto - APIs Live” no corpo principal. A home antiga possui o header, o controle lua/sol e links de marketplace, porém não está servindo a nova home premium criada na prévia temporária.

Conclusão: o domínio e o certificado estão ativos; o trabalho pendente é substituir o destino de deploy/artefato antigo pela versão revisada. Não se deve alterar DNS antes de garantir backup da versão atual e configuração de produção, porque o domínio já está funcionando e a mudança deve ser reversível.


## Infraestrutura observada

Os headers do domínio indicam `x-render-origin-server: Render`, `x-powered-by: Next.js` e Cloudflare na borda. Portanto, o domínio aponta atualmente para um serviço Next.js no Render; a substituição pode ser feita atualizando o deploy nesse provedor ou migrando o destino com uma alteração controlada de DNS. O certificado HTTPS e o proxy Cloudflare já estão operacionais.


## GitHub e envio

A sessão autenticada do GitHub está aberta no repositório correto `prestacerto/prestacerto`. O fluxo web de upload está disponível, mas o campo aceita múltiplos arquivos sem o atributo de diretório; portanto, ele não é adequado para enviar o projeto inteiro preservando a estrutura de `src`, `public` e `supabase`. O commit local da versão preparada já foi criado sobre a base pública do repositório. A publicação deve usar push/integração de repositório ou um fluxo que preserve pastas, e não um upload achatado pelo navegador.
