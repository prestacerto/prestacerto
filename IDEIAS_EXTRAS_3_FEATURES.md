# ✨ 3 IDEIAS EXTRAS: FEATURES COM MOAT

**Resgatar das demandas do usuário**  
**Status:** 🟢 Aprovadas pra roadmap  
**Timeline:** Paralelo à Friction Reduction  

---

## 1️⃣ PARCERIA ALURA/ROCKETSEAT (Afiliado)

**O Quê:** Integrar cursos das edtechs brasileiras top (Alura, Rocketseat) como "Cursos Recomendados" no perfil do freelancer

**Por Quê:**
- Udemy é genérico (vem de fora)
- Alura/Rocketseat são BRASILEIRAS, reconhecidas aqui
- Comissão de afiliado (~15-20% do curso vendido)
- Diferencial real vs Upwork/Fiverr

**Onde:**
- `/src/components/profiles/recommended-courses.tsx`
- Dashboard freelancer: "Aprimorar Skills"
- Badge "Recomendado" próximo ao curso

**API Integration:**
```typescript
// Alura/Rocketseat via API deles
const recommendCourses = async (skills: string[]) => {
  // GET https://api.alura.com.br/courses?skills=react,node
  // Retorna array de cursos com affiliate_link
  
  return {
    course_id: "react-avancado",
    title: "React Avançado com Hooks",
    provider: "Alura",
    price: 99,
    affiliate_link: "https://alura.com.br/...",
    commission: 14.85 // 15% de R$ 99
  }
}
```

**Database:**
```sql
create table affiliate_partnerships (
  id uuid primary key,
  provider text not null, -- 'alura' | 'rocketseat' | 'udemy'
  course_id text not null,
  title text,
  price numeric(10,2),
  commission_rate numeric(3,2), -- 0.15 = 15%
  affiliate_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table course_clicks (
  id uuid primary key,
  freelancer_id uuid not null references profiles(id),
  course_id text not null,
  clicked_at timestamptz default now()
);

create table affiliate_revenue (
  id uuid primary key,
  freelancer_id uuid not null references profiles(id),
  provider text,
  course_id text,
  commission numeric(10,2),
  confirmed_at timestamptz, -- Alura confirma depois de 30 dias
  created_at timestamptz default now()
);
```

**Esforço:** 8h (integração API + webhook de comissão)  
**Revenue:** +R$ 30-80k/ano (passivo, bom pra freelancer também)

---

## 2️⃣ SELO "DISPONÍVEL AGORA" (Pago)

**O Quê:** Inverso de "Urgente do projeto"  
Freelancer marca "Disponível Agora" = aparece em destaque por X dias

**Por Quê:**
- Clientes com PRESSA agora veem: "Quem tá livre agora?"
- Freelancer com demanda baixa paga pra entrar na frente
- Diferente de "Boost" (que é pra serviço). Isso é pra DISPONIBILIDADE.

**Visual:**
```
┌─────────────────────────────────┐
│ 🟢 DISPONÍVEL AGORA             │
│ João está procurando projetos   │
│ Tempo resposta: <1h             │
│ ⭐⭐⭐⭐⭐ (4.9) 47 reviews      │
│                                 │
│ [Ver Perfil] [Convidar]        │
└─────────────────────────────────┘
```

**Database:**
```sql
create table availability_ads (
  id uuid primary key,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  started_at timestamptz default now(),
  expires_at timestamptz not null,
  cost numeric(10,2) not null, -- R$ 49/3 dias, R$ 99/7 dias
  status text default 'active', -- 'active' | 'expired' | 'paused'
  created_at timestamptz default now()
);
```

**Pricing:**
- 3 dias: R$ 49
- 7 dias: R$ 99
- 14 dias: R$ 169 (melhor preço)

**Esforço:** 6h  
**Revenue:** +R$ 80-150k/ano

---

## 3️⃣ RECIBO/RELATÓRIO IR ANUAL

**O Quê:** Gerar PDF formatado pra Declaração de IR do freelancer  
```
┌────────────────────────────────────────┐
│ PRESTACERTO                            │
│ RELATÓRIO ANUAL 2024 — DECLARAÇÃO IR   │
│                                        │
│ Freelancer: João da Silva              │
│ CPF: 111.222.333-44                   │
│                                        │
│ RESUMO FINANCEIRO 2024                 │
│ ─────────────────────────────────────  │
│ Total Bruto (GMV):        R$ 45.230,00 │
│ Comissão PrestaCerto (5%):  R$ 2.261,50│
│ Impostos Retidos:           R$ 4.523,00│
│ TOTAL LÍQUIDO:             R$ 38.445,50│
│                                        │
│ DETALHAMENTO POR MÊS                   │
│ Jan: R$ 3.200   Fev: R$ 3.100  ...     │
│                                        │
│ TRANSAÇÕES (12 meses, 45 projetos)    │
│ [Tabela: Data | Projeto | Valor | Fee]│
│                                        │
│ Exportar para Excel?  [Sim]  [Não]     │
└────────────────────────────────────────┘
```

**Por Quê:**
- Ninguém mais no mercado oferece
- Freelancer economiza HORAS com contador
- Utilitário que retém usuário no site
- Gera confiança (transparência total)

**API:**
```typescript
GET /api/reporting/annual-report?year=2024

Response:
{
  freelancer_id: "...",
  year: 2024,
  total_gross: 45230.00,
  total_commission: 2261.50,
  total_taxes_withheld: 4523.00,
  total_net: 38445.50,
  
  monthly_breakdown: [
    { month: 1, gross: 3200, commission: 160, taxes: 320, net: 2720 },
    ...
  ],
  
  transactions: [
    { date: "2024-01-15", project: "Desenvolver app React", client: "ABC Corp", amount: 2500, fee_pct: 5 },
    ...
  ],
  
  // PDF pronto pra baixar
  pdf_url: "https://cdn.prestacerto.com/reports/...",
  
  // Excel export
  excel_url: "https://cdn.prestacerto.com/reports/..."
}
```

**Database:** usa `payment_ledger` + `transactions` já existentes  

**Esforço:** 5h (gerar PDF + Excel)  
**Revenue:** +R$ 0 (retém usuário, reduz churn = indireto)

---

## 📋 ADIÇÕES AO ROADMAP FRICTION REDUCTION

Inserir nas **Semanas 3-4** (paralelo):

| Feature | Timeline | Effort | Revenue |
|---------|----------|--------|---------|
| Parceria Alura/Rocketseat | Semana 3 | 8h | +R$ 30-80k |
| Selo "Disponível Agora" | Semana 3 | 6h | +R$ 80-150k |
| Recibo IR Anual | Semana 3-4 | 5h | Retém + Churn |

**NOVO TOTAL IMPACTO:**
- **Friction Reduction (12 features):** +R$ 2.0-3.7M/ano
- **Extras (3 features):** +R$ 110-230k/ano
- **GRAND TOTAL:** **+R$ 2.1-3.9M/ano**

---

## 🚀 PRONTO PRA SOMAR!

Quer que implemente esses 3 extras paralelo com os Quick Wins?

