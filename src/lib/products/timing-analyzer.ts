// CERTO TIMING - Timing Analyzer
// Analisa quando é melhor enviar propostas

export interface TimingData {
  clientId: string;
  responseHistory: Array<{
    sentAt: Date;
    respondedAt?: Date;
    responseTimeHours?: number;
  }>;
  timezone: string;
}

export interface TimingRecommendation {
  bestDay: string;
  bestHour: number;
  successProbability: number;
  waitDays: number;
  boostPercentage: number;
  reasoning: string;
}

export function analyzeTiming(data: TimingData): TimingRecommendation {
  if (!data.responseHistory.length) {
    return getDefaultTiming();
  }

  // Analisar padrão de respostas
  const responseDays = data.responseHistory
    .filter((r) => r.respondedAt)
    .map((r) => r.respondedAt!.getDay());

  const responseHours = data.responseHistory
    .filter((r) => r.responseTimeHours)
    .map((r) => r.responseTimeHours!);

  // Dia mais comum
  const dayFrequency = responseDays.reduce(
    (acc, day) => {
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const bestDay = Object.entries(dayFrequency).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];

  // Hora mais comum
  const avgResponseHour = Math.round(
    responseHours.reduce((a, b) => a + b, 0) / responseHours.length
  );

  // Sucesso baseado em padrão
  const successResponses = data.responseHistory.filter((r) => r.respondedAt).length;
  const successRate = (successResponses / data.responseHistory.length) * 100;

  const dayNames = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  return {
    bestDay: dayNames[parseInt(bestDay)],
    bestHour: avgResponseHour,
    successProbability: Math.round(successRate),
    waitDays: 3,
    boostPercentage: 35,
    reasoning: `Cliente responde melhor às ${avgResponseHour}h nas ${dayNames[parseInt(bestDay)]}.`,
  };
}

function getDefaultTiming(): TimingRecommendation {
  return {
    bestDay: "Terça",
    bestHour: 10,
    successProbability: 50,
    waitDays: 3,
    boostPercentage: 15,
    reasoning: "Sem histórico. Recomendação padrão: terça-feira às 10h.",
  };
}
