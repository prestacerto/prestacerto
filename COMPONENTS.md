# Componentes Reutilizáveis - Certo AI Ecosystem

Biblioteca completa de 8 componentes TypeScript/React para uso em todos os 27 produtos do Certo AI.

## Arquivos

- **`components.tsx`** - Componentes prontos para importação
- **`components.example.tsx`** - Exemplos de uso
- **`COMPONENTS.md`** - Esta documentação

## Os 8 Componentes

### 1. ProductCard
Card visual para produtos com imagem, título, descrição e preço.

```tsx
<ProductCard
  title="Certo AI Pro"
  description="Acelerador de vendas com IA"
  imageUrl="https://..."
  price={299}
  badge={<ProductBadge status="live" />}
  onClick={() => {}}
/>
```

**Props:**
- `title: string` - Título do produto
- `description: string` - Descrição curta
- `imageUrl?: string` - URL da imagem
- `price?: number` - Preço em BRL
- `badge?: ReactNode` - Badge customizado
- `onClick?: () => void` - Callback ao clicar
- `isLoading?: boolean` - Estado de carregamento

---

### 2. SubscriptionButton
Botão para assinar planos (integra com Assinify futuramente).

```tsx
<SubscriptionButton
  text="Assinar Plano Pro"
  plan="Pro"
  price="R$ 299/mês"
  onClick={handleSubscribe}
  variant="primary"
  size="lg"
/>
```

**Props:**
- `text?: string` - Texto do botão (padrão: "Assinar Plano")
- `plan?: string` - Nome do plano
- `price?: number | string` - Preço exibido
- `onClick?: () => void | Promise<void>` - Handler do click
- `isLoading?: boolean` - Estado de carregamento
- `disabled?: boolean` - Desabilitar botão
- `variant?: 'primary' | 'secondary' | 'outline'` - Estilo
- `size?: 'sm' | 'md' | 'lg'` - Tamanho

---

### 3. PricingDisplay
Exibe preços formatados com suporte a múltiplas moedas.

```tsx
<PricingDisplay
  amount={299}
  currency="BRL"
  label="Plano Anual"
  billingPeriod="yearly"
  showLabel
  size="lg"
/>
```

**Props:**
- `amount: number` - Valor em cents
- `currency?: 'BRL' | 'USD' | 'EUR'` - Moeda (padrão: BRL)
- `locale?: string` - Locale para formatação (padrão: pt-BR)
- `size?: 'sm' | 'md' | 'lg'` - Tamanho
- `showLabel?: boolean` - Mostrar label
- `label?: string` - Texto do label
- `billingPeriod?: 'monthly' | 'yearly' | 'one-time'` - Período
- `compact?: boolean` - Modo compacto (só o preço)

---

### 4. AnalyticsChart
Gráficos de visualização de dados (bar/line/pie).

```tsx
<AnalyticsChart
  title="Receita Mensal"
  data={[
    { label: 'Jan', value: 2400 },
    { label: 'Fev', value: 3200 },
  ]}
  type="bar"
  height={250}
  maxValue={5000}
/>
```

**Props:**
- `title: string` - Título do gráfico
- `data: DataPoint[]` - Dados (label, value, color)
- `type?: 'bar' | 'line' | 'pie'` - Tipo (padrão: bar)
- `height?: number` - Altura em pixels
- `isLoading?: boolean` - Estado de carregamento
- `maxValue?: number` - Valor máximo para escala

---

### 5. UserAccessCheck
Renderização condicional baseada em acesso do usuário.

```tsx
<UserAccessCheck
  hasAccess={userHasAccess}
  userId="user-123"
  productId="certo-ai"
  fallback={<p>Sem acesso</p>}
  onAccessDenied={() => console.log('Denied')}
>
  <div>Conteúdo exclusivo</div>
</UserAccessCheck>
```

**Props:**
- `hasAccess: boolean` - Usuário tem acesso?
- `userId?: string` - ID do usuário
- `productId?: string` - ID do produto
- `children?: ReactNode` - Conteúdo se tem acesso
- `fallback?: ReactNode` - Conteúdo se não tem acesso
- `onAccessDenied?: () => void` - Callback ao negar

---

### 6. WebhookStatus
Indicador de status da conexão webhook.

```tsx
<WebhookStatus
  status="connected"
  webhookUrl="https://api.exemplo.com/webhooks"
  lastCheck={new Date()}
  verbose
  size="md"
/>
```

**Props:**
- `status: 'connected' | 'disconnected' | 'error' | 'pending'` - Status
- `webhookUrl?: string` - URL do webhook
- `lastCheck?: Date` - Data última verificação
- `size?: 'sm' | 'md' | 'lg'` - Tamanho
- `verbose?: boolean` - Mostrar detalhes

**Statuses:**
- `connected` (verde) - Webhook funcionando
- `disconnected` (cinza) - Desconectado
- `error` (vermelho) - Erro de conexão
- `pending` (azul) - Aguardando resposta

---

### 7. RevenueMeter
Medidor de progresso para MRR/receita com trend.

```tsx
<RevenueMeter
  current={15000}
  target={20000}
  label="MRR Atual"
  currency="R$"
  trend={12}
  showPercentage
  size="lg"
/>
```

**Props:**
- `current: number` - Receita atual
- `target: number` - Meta de receita
- `currency?: string` - Símbolo de moeda (padrão: R$)
- `label?: string` - Rótulo (padrão: MRR)
- `showPercentage?: boolean` - Mostrar % de progress
- `size?: 'sm' | 'md' | 'lg'` - Tamanho
- `trend?: number` - Variação percentual
- `animated?: boolean` - Animar barra

---

### 8. ProductBadge
Badge de status do produto (Live/Building/Planned/Beta/Deprecated).

```tsx
<ProductBadge
  status="live"
  text="Ao Vivo"
  size="md"
  showIcon
/>
```

**Props:**
- `status: 'live' | 'building' | 'planned' | 'beta' | 'deprecated'` - Status
- `text?: string` - Texto customizado
- `size?: 'sm' | 'md' | 'lg'` - Tamanho
- `showIcon?: boolean` - Mostrar ícone

**Statuses:**
- `live` (verde) - Em produção
- `building` (azul) - Em desenvolvimento
- `planned` (cinza) - No roadmap
- `beta` (âmbar) - Versão beta
- `deprecated` (vermelho) - Descontinuado

---

## Features Comuns

### TypeScript
Todos os componentes têm tipos TypeScript completos:

```tsx
import { ProductCard, SubscriptionButton } from './components';
// TypeScript reconhece props e erros de compilação
```

### Tailwind CSS
Estilização com Tailwind + dark mode suportado:

```tsx
// Automaticamente adapta cores para light/dark mode
<ProductCard title="..." /> // Responde ao dark mode
```

### Acessibilidade (WCAG)
- ARIA labels e roles
- Semantic HTML
- Keyboard navigation
- Screen reader friendly

```tsx
// Exemplos integrados:
- role="button", tabIndex, onKeyDown para interatividade
- aria-label, aria-busy, aria-live para contexto
- <article>, <section>, <button> semânticos
```

### Prop Drilling
Customização flexível via props:

```tsx
<ProductCard
  className="custom-class"
  isLoading={isLoading}
  onClick={handleClick}
  // Todos os componentes aceitam className extra
/>
```

### Dark Mode
Suporte automático a dark mode via Tailwind:

```html
<!-- dark:bg-slate-900 automático em modo escuro -->
<!-- Funciona com system preference ou classe .dark -->
```

---

## Integração com Assinify

O `SubscriptionButton` foi desenhado para integrar com Assinify:

```tsx
const handleSubscribe = async () => {
  try {
    const response = await fetch('/api/assinify/checkout', {
      method: 'POST',
      body: JSON.stringify({
        plan: 'pro',
        product: 'certo-ai',
        // Usar env vars do Assinify
      }),
    });
    const { checkoutUrl } = await response.json();
    window.location.href = checkoutUrl;
  } catch (error) {
    console.error('Erro na assinatura:', error);
  }
};

<SubscriptionButton
  onClick={handleSubscribe}
  isLoading={isLoading}
/>
```

---

## Exemplo Completo

Veja `components.example.tsx` para exemplo completo de página de produto usando todos os 8 componentes.

---

## Checklist de Uso

- [ ] Importar componentes de `./components.tsx`
- [ ] Passar props requeridas (TypeScript avisa se faltar)
- [ ] Customizar com `className` se necessário
- [ ] Testar dark mode
- [ ] Testar acessibilidade (keyboard, screen reader)
- [ ] Integrar com Assinify para botões de subscription
- [ ] Verificar responsividade em mobile/tablet/desktop

---

## Notas

1. **Português (pt-BR)**: Todos os labels e mensagens padrão estão em português
2. **Reutilizável**: Copie `components.tsx` para qualquer um dos 27 produtos
3. **Sem dependências externas**: Só precisa React + Tailwind
4. **TypeScript**: Todos os tipos inclusos, seguro para refatoring
5. **Acessível**: Segue WCAG 2.1 AA em toda a biblioteca

---

## Suporte

Para adicionar novos componentes ou customizações:

1. Atualize `components.tsx` com nova lógica
2. Adicione exemplo em `components.example.tsx`
3. Documente props aqui em `COMPONENTS.md`
4. Sincronize com todos os 27 produtos

---

**Versão:** 1.0  
**Data:** 2026-09-17  
**Mantido por:** Cadu (Certo AI)
