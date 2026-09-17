# OpenAI Integration Guide

## Overview

Complete typed integration of Anthropic's Claude AI for the PrestaCerto AI products ecosystem:

- **Insights**: Market intelligence with skill trends
- **Badge**: Badge evaluation and achievement tracking  
- **Portfolio**: Portfolio optimization recommendations
- **Contrato**: Counter-proposal generation for negotiations

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   React Components                           │
│  (AIInsightsWidget, BadgeEvaluator, etc)                    │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│              Next.js API Routes (/api/ai/*)                 │
│  - /api/ai/insights    - /api/ai/badge                      │
│  - /api/ai/portfolio   - /api/ai/contrato                   │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│            OpenAI Service Layer (src/lib)                    │
│                                                              │
│  - TypedPrompts (system + user)                             │
│  - Error Handling (try-catch, validation)                   │
│  - Caching (Redis via Upstash)                              │
│  - JSON Parsing (with fallbacks)                            │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│         Anthropic Claude 3.5 Sonnet API                      │
└─────────────────────────────────────────────────────────────┘
```

## Files Created

### Core Service
- **`src/lib/openai-service.ts`** - Main service class with all AI methods
- **`src/lib/openai-init.ts`** - Auto-initialization helper
- **`src/lib/openai-service.test.ts`** - Examples and test cases

### API Routes
- **`src/app/api/ai/insights/route.ts`** - POST /api/ai/insights
- **`src/app/api/ai/badge/route.ts`** - POST /api/ai/badge
- **`src/app/api/ai/portfolio/route.ts`** - POST /api/ai/portfolio
- **`src/app/api/ai/contrato/route.ts`** - POST /api/ai/contrato

### Components
- **`src/components/ai-insights-widget.tsx`** - Example React component

## Setup

### 1. Environment Variables

Add to `.env.local`:

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...

# Optional (for caching)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

### 2. Dependencies

Already included in `package.json`:
- `@anthropic-ai/sdk`
- `@upstash/redis`
- `zod` (for validation)

### 3. Auto-Initialization

The service auto-initializes on module load (server-side only).

If needed, manually initialize:

```typescript
import { initOpenAIService } from '@/lib/openai-service';

initOpenAIService({
  apiKey: process.env.ANTHROPIC_API_KEY,
  redisUrl: process.env.UPSTASH_REDIS_REST_URL,
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN,
});
```

## Usage

### Basic Usage (From API Routes)

All endpoints follow the same pattern:

```bash
POST /api/ai/insights
Content-Type: application/json

{
  "userId": "user-123",
  "skills": ["React", "Node.js"],
  "experience": 5,
  "currentMarket": "Brasil"
}
```

### Advanced Usage (Direct Service)

```typescript
import { getOpenAIService } from '@/lib/openai-service';
import type { InsightsInput } from '@/lib/openai-service';

const aiService = getOpenAIService();

const insights = await aiService.generateInsights({
  userId: 'user-123',
  skills: ['React', 'Next.js'],
  experience: 5,
});
```

### In React Components

```typescript
const [insights, setInsights] = useState(null);

const generateInsights = async () => {
  const response = await fetch('/api/ai/insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'user-123',
      skills: ['React', 'Next.js'],
      experience: 5,
    }),
  });

  const result = await response.json();
  setInsights(result.data);
};
```

## API Endpoints

### POST /api/ai/insights

**Input:**
```typescript
{
  userId: string;
  skills: string[];
  experience: number;
  currentMarket?: string;
  topCompetitors?: string[];
}
```

**Output:**
```typescript
{
  trendingSkills: Array<{
    skill: string;
    demand: "high" | "medium" | "low";
    avgRate: number;
    recommendedRate: number;
    growth: number;
  }>;
  marketAnalysis: string;
  recommendations: string[];
  opportunityScore: number;
}
```

### POST /api/ai/badge

**Input:**
```typescript
{
  userId: string;
  stats: {
    completedProjects: number;
    avgRating: number;
    responseTime: number;
    isVerified: boolean;
    yearsExperience: number;
  };
  portfolio?: string;
}
```

**Output:**
```typescript
{
  badges: Array<{
    type: "verified" | "top" | "quality" | "senior" | "expert";
    score: number;
    rationale: string;
  }>;
  nextMilestone: {
    badge: string;
    progress: number;
    recommendation: string;
  };
}
```

### POST /api/ai/portfolio

**Input:**
```typescript
{
  userId: string;
  projects: Array<{
    title: string;
    description: string;
    skills: string[];
    result: string;
    budget?: number;
  }>;
  bio?: string;
  targetAudience?: string;
}
```

**Output:**
```typescript
{
  summary: string;
  highlights: string[];
  seoTags: string[];
  improvementSuggestions: string[];
}
```

### POST /api/ai/contrato

**Input:**
```typescript
{
  clientProposal: string;
  userProfile: {
    skills: string[];
    experience: number;
    avgRate: number;
  };
  projectContext?: string;
}
```

**Output:**
```typescript
{
  counterProposal: string;
  keyPoints: string[];
  riskAnalysis: string[];
  negotiationTips: string[];
}
```

## Caching Strategy

### Redis Caching
- **Insights**: Cached by skills list (TTL: 1 hour)
- **Badge**: Cached by stats object (TTL: 1 hour)
- **Portfolio**: Cached by project titles (TTL: 1 hour)
- **Contrato**: No caching (always fresh)

### Manual Cache Management
```typescript
const aiService = getOpenAIService();

// Clear specific product cache
await aiService.clearCache('insights', 'user-123');
```

## Error Handling

All methods throw descriptive errors:

```typescript
try {
  const insights = await aiService.generateInsights(input);
} catch (error) {
  console.error('Failed to generate insights:', error.message);
  // Error messages include:
  // - Missing API key
  // - API rate limits
  // - Invalid input
  // - JSON parse errors
  // - Cache failures (non-fatal)
}
```

## Prompts Architecture

Each product has a **typed system prompt** and **typed user prompt**:

```typescript
const SYSTEM_PROMPTS = {
  insights: "Expert market analyst...",
  badge: "Expert evaluator...",
  // ...
};

const USER_PROMPTS = {
  insights: (input) => `Analise o mercado...`,
  // ...
};
```

### Why This Approach?
✅ Type-safe: All inputs validated  
✅ Consistent: Same prompt structure for all products  
✅ Testable: Can mock prompts in tests  
✅ Maintainable: Centralized prompt management  
✅ Scalable: Easy to add new products  

## Model Configuration

Currently using: **Claude 3.5 Sonnet** (claude-3-5-sonnet-20241022)

- **Max tokens**: Varies by product (1500-2000)
- **Temperature**: Default (0.7)
- **Top P**: Default (1.0)

To change model, edit `openai-service.ts`:

```typescript
const response = await this.client.messages.create({
  model: "claude-3-opus-20250219", // Change here
  max_tokens: 2000,
  // ...
});
```

## Performance Metrics

### Expected Response Times (with Redis cache)
- **Insights**: 2-3s (first call), <100ms (cached)
- **Badge**: 1-2s (first call), <100ms (cached)
- **Portfolio**: 2-3s (first call), <100ms (cached)
- **Contrato**: 3-5s (always fresh, no cache)

### Cost Estimation (Claude 3.5 Sonnet)
- Input: $3 / 1M tokens
- Output: $15 / 1M tokens

**Estimate per call:**
- Insights: ~$0.0001-0.0005
- Badge: ~$0.00005-0.0003
- Portfolio: ~$0.0001-0.0005
- Contrato: ~$0.0002-0.001

## Testing

### Run Examples
```bash
npm test src/lib/openai-service.test.ts
```

### Manual Testing
```bash
curl -X POST http://localhost:3000/api/ai/insights \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-123",
    "skills": ["React", "Next.js"],
    "experience": 5
  }'
```

## Monitoring & Logging

Add logging to track usage:

```typescript
initOpenAIService({
  apiKey: process.env.ANTHROPIC_API_KEY,
  logger: winston.createLogger({
    // your logger config
  }),
});
```

The service logs:
- Cache hits/misses
- API errors
- Processing times
- Cache operations

## Troubleshooting

### "API key not set"
- Check `ANTHROPIC_API_KEY` in `.env.local`
- Restart dev server after changing env vars

### Cache not working
- Verify Redis credentials
- Check `UPSTASH_REDIS_REST_URL` and token
- Redis errors are non-fatal (falls back to fresh requests)

### Slow responses
- First call to a product is slower (API call)
- Subsequent calls should be faster (cache hit)
- Monitor API rate limits

### JSON parse errors
- Service validates JSON responses
- If parsing fails, error includes the raw response
- Check prompt formatting in `openai-service.ts`

## Next Steps

1. **Integration with Products**
   - Hook up insights widget to dashboard
   - Add badge evaluation to profile system
   - Integrate portfolio optimization into editor

2. **Analytics & Tracking**
   - Track which products are most used
   - Monitor API costs
   - Measure user engagement

3. **Advanced Features**
   - Batch processing for multiple users
   - Scheduled insights updates
   - Real-time market data integration

4. **Frontend Implementation**
   - Create badge showcase component
   - Build insights dashboard
   - Implement portfolio builder with AI suggestions

## Support

For issues or questions about the OpenAI integration:
1. Check logs in server console
2. Review error messages returned by API
3. Verify API key and Redis credentials
4. Test with examples in `openai-service.test.ts`
