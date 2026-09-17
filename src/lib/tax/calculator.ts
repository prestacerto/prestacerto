// Cálculo de IR progressivo + INSS para freelancers Brasil

export type TaxBreakdown = {
  grossIncome: number;
  inssRate: number;
  inssCalculated: number;
  irRate: number;
  irCalculated: number;
  otherDeductions: number;
  liquidIncome: number;
  shouldSaveMonthly: number;
  taxNotes: string[];
};

// Tabela IR 2024 (simplificado para devs/freelancers)
const IR_BRACKETS_2024 = [
  { min: 0, max: 1903.98, rate: 0 },
  { min: 1903.99, max: 2826.65, rate: 0.075 },
  { min: 2826.66, max: 3751.05, rate: 0.15 },
  { min: 3751.06, max: 4664.68, rate: 0.225 },
  { min: 4664.69, max: Infinity, rate: 0.275 },
];

// Dedução padrão por tipo de trabalho
const STANDARD_DEDUCTIONS = {
  freelancer_dev: 1200,
  freelancer_designer: 1000,
  freelancer_consultant: 1500,
  freelancer_other: 800,
};

export function calculateIR(grossIncome: number): number {
  // Para simplificar: usa IR progressivo simples
  for (const bracket of IR_BRACKETS_2024) {
    if (grossIncome >= bracket.min && grossIncome <= bracket.max) {
      // Calcula o imposto da faixa anterior até o valor atual
      let ir = 0;
      let previousMax = 0;

      for (let i = 0; i < IR_BRACKETS_2024.indexOf(bracket) + 1; i++) {
        const currentBracket = IR_BRACKETS_2024[i];
        const bracketMax =
          grossIncome < currentBracket.max ? grossIncome : currentBracket.max;
        const bracketMin =
          previousMax > currentBracket.min ? previousMax : currentBracket.min;

        if (bracketMax > bracketMin) {
          ir += (bracketMax - bracketMin) * currentBracket.rate;
        }
        previousMax = bracketMax;
      }

      return Math.max(0, ir);
    }
  }
  return 0;
}

export function calculateINSS(grossIncome: number): number {
  // INSS: 11% do valor bruto (simplificado, sem teto)
  return grossIncome * 0.11;
}

export function calculateTaxBreakdown(
  grossIncome: number,
  workType: keyof typeof STANDARD_DEDUCTIONS = "freelancer_other",
  otherDeductions = 0
): TaxBreakdown {
  // Calcula IR e INSS
  const irCalculated = calculateIR(grossIncome);
  const inssCalculated = calculateINSS(grossIncome);

  // Deduções
  const standardDeduction = STANDARD_DEDUCTIONS[workType];
  const totalDeductions = standardDeduction + otherDeductions;

  // Renda líquida = Bruta - IR - INSS - Deduções
  const liquidIncome = grossIncome - irCalculated - inssCalculated;

  // Quanto guardar mensalmente pra imposto de renda (ao final do ano)
  // Recomendação: 30% da renda bruta pra freelancers
  const shouldSaveMonthly = grossIncome * 0.3;

  // Taxa efetiva de IR
  const irRate = grossIncome > 0 ? (irCalculated / grossIncome) * 100 : 0;

  const notes: string[] = [];
  if (irRate > 15) {
    notes.push("⚠️ Você está em faixa alta de IR. Considere abrir empresa.");
  }
  if (grossIncome < 1903.98) {
    notes.push("✅ Isento de IR neste mês!");
  }
  if (grossIncome < 2000) {
    notes.push("💡 Dica: Próximo mês gaste mais pra atingir melhor faixa");
  }

  return {
    grossIncome,
    inssRate: 11,
    inssCalculated: Math.round(inssCalculated * 100) / 100,
    irRate: Math.round(irRate * 100) / 100,
    irCalculated: Math.round(irCalculated * 100) / 100,
    otherDeductions: totalDeductions,
    liquidIncome: Math.round(liquidIncome * 100) / 100,
    shouldSaveMonthly: Math.round(shouldSaveMonthly * 100) / 100,
    taxNotes: notes,
  };
}

export function getRecommendedEmergencyFund(
  monthlyIncome: number
): {
  threeMonths: number;
  sixMonths: number;
  twelveMonths: number;
} {
  return {
    threeMonths: monthlyIncome * 3,
    sixMonths: monthlyIncome * 6,
    twelveMonths: monthlyIncome * 12,
  };
}
