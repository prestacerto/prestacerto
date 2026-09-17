// TIMING ANALYZER
// Analyzes project timelines, deadlines, and response patterns

export interface ProjectTimeline {
  projectId: string;
  createdAt: Date;
  deadline: Date;
  estimatedDuration: number; // hours
  posted: Date;
}

export interface FreelancerTiming {
  averageResponseTime: number; // hours
  responseCount: number;
  acceptanceRate: number; // percentage 0-100
  completionRate: number; // percentage 0-100
}

export interface TimingAnalysis {
  hoursUntilDeadline: number;
  competitionIntensity: "low" | "medium" | "high";
  optimalResponseWindow: {
    startMinutes: number;
    endMinutes: number;
  };
  timeScore: number; // 0-100
  recommendations: string[];
}

export function analyzeProjectTiming(
  timeline: ProjectTimeline,
  competitorCount: number = 10
): TimingAnalysis {
  const now = new Date();
  const hoursUntilDeadline =
    (timeline.deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Competition intensity based on competitor count
  let competitionIntensity: "low" | "medium" | "high" = "medium";
  if (competitorCount < 5) competitionIntensity = "low";
  else if (competitorCount > 30) competitionIntensity = "high";

  // Optimal response window (respond early, within first hour typically gets best results)
  const optimalResponseWindow = {
    startMinutes: 5,
    endMinutes: 60,
  };

  // Time score calculation
  let timeScore = 100;

  // Penalty for very short deadlines
  if (hoursUntilDeadline < 1) timeScore -= 40; // Very urgent
  else if (hoursUntilDeadline < 6) timeScore -= 20;
  else if (hoursUntilDeadline < 24) timeScore -= 10;

  // Bonus for moderate time
  if (hoursUntilDeadline > 72) timeScore += 10;

  // Competition impact
  if (competitionIntensity === "high") timeScore -= 20;
  else if (competitionIntensity === "low") timeScore += 15;

  // Ensure score is within bounds
  timeScore = Math.max(0, Math.min(100, timeScore));

  const recommendations: string[] = [];

  if (hoursUntilDeadline < 1) {
    recommendations.push(
      "🔴 Responda IMEDIATAMENTE! Projeto fecha em menos de 1 hora."
    );
  } else if (hoursUntilDeadline < 6) {
    recommendations.push("⚠️ Prazo muito curto. Responda nos próximos 30 min.");
  } else if (hoursUntilDeadline > 72) {
    recommendations.push(
      "⏰ Você tem tempo. Responda nos próximos dias para não perder."
    );
  }

  if (competitionIntensity === "high") {
    recommendations.push(
      "📊 Muita concorrência. Faça uma proposta diferenciada e personalizada."
    );
  } else if (competitionIntensity === "low") {
    recommendations.push("✨ Pouca concorrência! Você tem boas chances.");
  }

  if (hoursUntilDeadline > 0 && hoursUntilDeadline <= 48) {
    recommendations.push("⚡ Responda nos primeiros 30 minutos para destaque.");
  }

  return {
    hoursUntilDeadline: Math.round(hoursUntilDeadline * 100) / 100,
    competitionIntensity,
    optimalResponseWindow,
    timeScore: Math.round(timeScore),
    recommendations,
  };
}

export function analyzeFreelancerResponseTiming(
  timing: FreelancerTiming,
  projectTimeline: ProjectTimeline,
  competitorCount: number = 10
): {
  responseTimeScore: number;
  winProbability: number;
  recommendations: string[];
} {
  const now = new Date();
  const hoursUntilDeadline =
    (projectTimeline.deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Response time score
  let responseTimeScore = 100;

  if (timing.averageResponseTime <= 0.5) responseTimeScore = 100; // Lightning fast
  else if (timing.averageResponseTime <= 2) responseTimeScore = 90;
  else if (timing.averageResponseTime <= 6) responseTimeScore = 70;
  else if (timing.averageResponseTime <= 12) responseTimeScore = 50;
  else if (timing.averageResponseTime <= 24) responseTimeScore = 30;
  else responseTimeScore = 10;

  // Win probability based on response time, acceptance rate, and competition
  const responseBonus = (responseTimeScore / 100) * 30; // 0-30 points
  const acceptanceBonus = (timing.acceptanceRate / 100) * 30; // 0-30 points
  const completionBonus = (timing.completionRate / 100) * 20; // 0-20 points
  const competitionPenalty = Math.min(20, competitorCount / 2); // 0-20 penalty

  const winProbability = Math.round(
    responseBonus +
      acceptanceBonus +
      completionBonus +
      10 -
      competitionPenalty
  );

  const recommendations: string[] = [];

  if (timing.averageResponseTime <= 2) {
    recommendations.push(
      "🚀 Sua velocidade de resposta é EXCELENTE! Mantenha assim."
    );
  } else if (timing.averageResponseTime > 12) {
    recommendations.push(
      "⏰ Tente responder mais rápido (em menos de 12 horas)."
    );
  }

  if (timing.acceptanceRate > 70) {
    recommendations.push(
      "✅ Sua taxa de aceitação é ótima. Continue com essa qualidade."
    );
  } else if (timing.acceptanceRate < 30) {
    recommendations.push(
      "📋 Melhore suas propostas - muitas são rejeitadas. Estude os casos."
    );
  }

  if (timing.completionRate > 90) {
    recommendations.push(
      "🏆 Você completa quase TODOS os projetos! Clientes confiam em você."
    );
  }

  if (
    hoursUntilDeadline < 6 &&
    timing.averageResponseTime > 6 &&
    timing.responseCount > 0
  ) {
    recommendations.push(
      "⚡ Prazo curto + sua resposta lenta = baixa chance. Acelere agora!"
    );
  }

  return {
    responseTimeScore: Math.round(responseTimeScore),
    winProbability: Math.max(0, Math.min(100, winProbability)),
    recommendations,
  };
}

export function calculateOptimalResponseTiming(
  projectTimeline: ProjectTimeline,
  freelancerTiming: FreelancerTiming,
  competitorCount: number = 10
): {
  shouldRespond: boolean;
  bestTimeToRespond: string;
  urgencyLevel: "critical" | "high" | "medium" | "low";
} {
  const now = new Date();
  const hoursUntilDeadline =
    (projectTimeline.deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Urgency levels
  let urgencyLevel: "critical" | "high" | "medium" | "low" = "medium";
  if (hoursUntilDeadline < 1) urgencyLevel = "critical";
  else if (hoursUntilDeadline < 6) urgencyLevel = "high";
  else if (hoursUntilDeadline > 48) urgencyLevel = "low";

  // Decision to respond
  const hasTimeToRespond =
    hoursUntilDeadline > freelancerTiming.averageResponseTime / 60;
  const shouldRespond =
    hasTimeToRespond && freelancerTiming.acceptanceRate > 20;

  // Best time to respond
  let bestTimeToRespond = "Nos próximos 30 minutos";
  if (urgencyLevel === "critical") {
    bestTimeToRespond = "AGORA - Projeto fecha em menos de 1 hora";
  } else if (urgencyLevel === "high") {
    bestTimeToRespond = "Nos próximos 30 minutos - Prazo muito curto";
  } else if (urgencyLevel === "medium") {
    bestTimeToRespond = "Na próxima 1 hora - Responda antes que concorrentes";
  } else {
    bestTimeToRespond = "Nos próximos 2 dias - Você tem tempo";
  }

  return {
    shouldRespond,
    bestTimeToRespond,
    urgencyLevel,
  };
}
