# Sales Agent for PMEs - Setup Guide

## 🚀 Quick Start

### 1. Configurar ambiente
```bash
cp .env.local.example .env.local
# Preencha:
# - NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY (do seu projeto Supabase)
# - ANTHROPIC_API_KEY (do console da Anthropic)
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Rodar dev server
```bash
npm run dev
```

### 4. Acessar
- Landing page: http://localhost:3000/sales-agent
- Demo chat com agente: [integrado na landing page]
- API: POST http://localhost:3000/api/sales-agent

## 🧠 Como funciona o agente

### Fluxo
1. Usuário descreve um prospect (empresa, setor, dor)
2. Agente Claude analisa e faz perguntas clarificadoras
3. Gera estratégia de outreach personalizada
4. Cria template de mensagem (email/whatsapp)
5. Qualifica o lead (hot/warm/cold) com score

### Exemplo de uso
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Agência de marketing com 5 pessoas. Quer vender SEO para PMEs. Como prospeitar?"
    }
  ]
}
```

**Resposta**: Agente gera estratégia completa de prospecção

## 📊 Próximas fases

**Fase 2**: Dashboard de config + webhooks para n8n
**Fase 3**: Stripe billing + analytics avançado

## 🔑 Environment Variables Necessários

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `ANTHROPIC_API_KEY` | ✅ Sim | Chave da API Anthropic |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Sim | Chave anon do Supabase |

## 🧪 Testando localmente

```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Testar API
curl -X POST http://localhost:3000/api/sales-agent \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Sou consultor de RH. Quero vender cursos de liderança para startups tech. Como começo?"
    }]
  }'
```

