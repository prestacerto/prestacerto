# Configuração do WhatsApp Business API

## Resumo Executivo

O PrestaCerto está integrado com WhatsApp Business API para permitir que clientes descrevam seus projetos por WhatsApp, recebendo recomendações de freelancers em tempo real — sem sair do app.

Fluxo:
1. Cliente envia mensagem descrevendo projeto (ex: "Preciso de um desenvolvedor React pro meu app")
2. IA (Claude) analisa a mensagem e extrai: categoria, orçamento, prazo, habilidades
3. Sistema busca top 3 freelancers compatíveis no banco de dados
4. Resposta automática retorna via WhatsApp com links aos freelancers

## Pré-requisitos

- [Meta Business Account](https://business.facebook.com) (gratuito)
- [WhatsApp Business Account](https://business.facebook.com/wa/)
- App registrado na Meta (para obter credenciais)
- Número de telefone verificado

## Passo a passo: Obter credenciais

### 1. Criar/Acessar Meta Business Account

1. Acesse https://business.facebook.com
2. Crie uma conta ou use uma existente
3. Vá para **Settings > Business Settings**

### 2. Registrar App na Meta

1. Vá para https://developers.facebook.com
2. **My Apps > Create App**
3. Escolha **Business** como tipo
4. Preencha nome: `prestacerto-whatsapp`
5. Adicione produto **WhatsApp** ao app

### 3. Obter credenciais

No dashboard do app (Developers.facebook.com → seu app):

- **Phone Number ID**: Settings → WhatsApp Business Account → Phone Number ID
- **Access Token**: Settings → User Access Tokens (ou App Access Tokens com permissões `whatsapp_business_messaging`)
- **Verify Token**: Você cria um valor arbitrário (ex: `prestacerto_webhook_token_2026`)

### 4. Adicionar Webhook

No dashboard do app:

1. Vá para **Settings → Webhooks**
2. Edite a subscrição de `messages`
3. **Callback URL**: `https://seu-dominio.com/api/whatsapp/webhook`
4. **Verify Token**: Cole o valor que você criou
5. Ative subscrições para:
   - `messages` (mensagens chegando)
   - `message_template_status_update` (status de templates)

### 5. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# WhatsApp Business API
WHATSAPP_PHONE_ID=seu_phone_id
WHATSAPP_ACCESS_TOKEN=seu_access_token
WHATSAPP_VERIFY_TOKEN=seu_verify_token

# Claude API (já deve estar configurado)
ANTHROPIC_API_KEY=sk-ant-...
```

## Testar a integração

### 1. Verificar webhook

```bash
curl -X GET "https://seu-dominio.com/api/whatsapp/webhook" \
  -d "hub.mode=subscribe" \
  -d "hub.challenge=test_challenge_value" \
  -d "hub.verify_token=prestacerto_webhook_token_2026"
```

Resposta esperada: `test_challenge_value`

### 2. Enviar mensagem de teste via cURL

```bash
curl -X POST "https://graph.instagram.com/v18.0/PHONE_ID/messages" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "55YYXXXXXXXXX",
    "type": "text",
    "text": {
      "body": "Preciso de um desenvolvedor React para um e-commerce"
    }
  }'
```

### 3. Monitorar logs

```bash
# Em produção (Vercel):
vercel logs

# Em desenvolvimento:
npm run dev
# Busque por "Webhook error" ou "Message processing error"
```

## Segurança

### HMAC-SHA256 Validation

O arquivo `src/app/api/whatsapp/webhook/route.ts` valida assinatura de webhook:

- Pega header `X-Hub-Signature-256` da Meta
- Calcula HMAC-SHA256 do body usando `WHATSAPP_APP_SECRET`
- Rejeita se não bater

**TODO**: implementar validação completa (ver comentário no código)

```typescript
function validateWebhookSignature(req: NextRequest, body: any): boolean {
  const signature = req.headers.get("X-Hub-Signature-256");
  // Comparar com HMAC-SHA256(body, app_secret)
}
```

### Rate Limiting

Adicione rate-limit no Upstash Redis:

```typescript
const rateLimiter = Ratelimit.create({
  prefix: "whatsapp",
  sliding_window: {
    interval: 60, // 1 minuto
    requests: 100, // 100 mensagens por minuto
  },
});

const { success } = await rateLimiter.limit(phoneNumber);
if (!success) return NextResponse.json({ error: "Rate limited" }, { status: 429 });
```

## Analytics

Todas as interações são logadas em `whatsapp_interactions`:

```sql
SELECT 
  date(created_at) as dia,
  COUNT(*) as total_mensagens,
  COUNT(DISTINCT phone_number) as usuarios_unicos,
  AVG(freelancers_returned) as media_freelancers
FROM whatsapp_interactions
GROUP BY date(created_at)
ORDER BY dia DESC;
```

## Troubleshooting

### "Invalid signature" (403)

- Verifique se `WHATSAPP_VERIFY_TOKEN` está correto
- Confirme que webhook é acessível publicamente (não localhost)

### "Freelancers not found"

- Verifique se há freelancers com `role='freelancer'` e `is_active=true` no banco
- Ajuste filtros em `findCompatibleFreelancers()`

### "WhatsApp API error: 403"

- Confirme que `WHATSAPP_ACCESS_TOKEN` é válido
- Verifique permissões no App Dashboard (precisa `whatsapp_business_messaging`)
- Teste token via:
  ```bash
  curl -H "Authorization: Bearer TOKEN" \
    https://graph.instagram.com/debug_token?input_token=TOKEN
  ```

### IA não entendeu a mensagem

- A IA volta um fallback com `confidence: 30`
- Verifique logs de erro do Claude API
- Confirme que `ANTHROPIC_API_KEY` está válido

## Próximos passos

1. **Integração de pagamento**: Adicionar Mercado Pago na conversa
2. **Template de mensagens**: Usar templates aprovados pela Meta (mais confiável que text livre)
3. **Escalonamento humano**: Se IA não entender, escalar pra agente humano (QueueIt, Intercom)
4. **Analytics avançado**: Dashboard de funnels (mensagem → match → proposta → contratação)

## Docs de referência

- [Meta WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Webhook Events](https://developers.facebook.com/docs/whatsapp/webhooks/components)
- [Sending Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/messages)
