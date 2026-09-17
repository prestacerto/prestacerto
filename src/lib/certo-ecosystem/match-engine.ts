// CERTO MATCH - IA Matching Engine
// Analisa projeto + profile do freelancer, recomenda chance de ganho

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ProjectData {
  title: string;
  description: string;
  budget: number;
  skills_required: string[];
  duration: string;
  experience_level: 'entry' | 'intermediate' | 'expert';
  client_country: string;
}

export interface FreelancerProfile {
  skills: string[];
  hourly_rate: number;
  total_projects: number;
  success_rate: number;
  avg_rating: number;
  years_experience: number;
  portfolio_items: number;
  response_time_hours: number;
  specialization: string;
}

export interface MatchScore {
  overallScore: number; // 0-100
  winChance: number; // 0-100
  matchBreakdown: {
    skillsMatch: number;
    rateMatch: number;
    experienceMatch: number;
    portfolioMatch: number;
    ratingMatch: number;
  };
  recommendedBid: number;
  competitorAnalysis: {
    estimatedCompetitors: number;
    avgCompetitorRating: number;
    avgCompetitorBid: number;
  };
  recommendations: string[];
  shouldApply: boolean;
}

export async function calculateMatchScore(
  project: ProjectData,
  freelancer: FreelancerProfile
): Promise<MatchScore> {
  // 1️⃣ SKILLS MATCH
  const projectSkillsSet = new Set(project.skills_required.map(s => s.toLowerCase()));
  const freelancerSkillsSet = new Set(freelancer.skills.map(s => s.toLowerCase()));

  let matchedSkills = 0;
  projectSkillsSet.forEach(skill => {
    if (freelancerSkillsSet.has(skill)) matchedSkills++;
  });

  const skillsMatch = projectSkillsSet.size > 0
    ? (matchedSkills / projectSkillsSet.size) * 100
    : 50;

  // 2️⃣ RATE MATCH
  const projectHourlyBudget = project.budget / (parseInt(project.duration) || 40);
  const rateRatio = freelancer.hourly_rate / projectHourlyBudget;

  let rateMatch = 100;
  if (rateRatio > 1.5) rateMatch = 30; // Muito caro
  else if (rateRatio > 1.2) rateMatch = 60;
  else if (rateRatio > 0.8) rateMatch = 100; // Perfeito
  else if (rateRatio > 0.5) rateMatch = 70; // Mais barato (bom)
  else rateMatch = 50; // Muito barato (suspeito)

  // 3️⃣ EXPERIENCE MATCH
  const experienceMatch = Math.min(
    100,
    (freelancer.years_experience / 5) * 100 +
    (freelancer.total_projects / 100) * 10
  );

  // 4️⃣ PORTFOLIO MATCH
  const portfolioMatch = Math.min(
    100,
    (freelancer.portfolio_items / 10) * 100
  );

  // 5️⃣ RATING MATCH
  const ratingMatch = freelancer.avg_rating * 20; // 0-5 stars -> 0-100

  // 6️⃣ CALCULAR SCORE GERAL (weighted)
  const overallScore = Math.round(
    skillsMatch * 0.35 +
    rateMatch * 0.20 +
    experienceMatch * 0.15 +
    portfolioMatch * 0.15 +
    ratingMatch * 0.15
  );

  // 7️⃣ WIN CHANCE (combina rating + response time + success rate)
  const winChance = Math.round(
    freelancer.avg_rating / 5 * 40 + // Rating (0-40)
    Math.min(40, (freelancer.success_rate || 70) / 2) + // Success rate (0-40)
    Math.min(20, freelancer.response_time_hours <= 2 ? 20 : 10) // Response time (0-20)
  );

  // 8️⃣ RECOMMENDED BID
  const recommendedBid = Math.round(
    freelancer.hourly_rate * parseInt(project.duration) *
    (winChance / 100) * // Multiplicador baseado em win chance
    1.1 // +10% pra ter margem
  );

  // 9️⃣ COMPETITOR ANALYSIS (simulado)
  const estimatedCompetitors = Math.max(
    5,
    Math.round(freelancer.avg_rating > 4.5 ? 20 : 50)
  );

  const recommendations: string[] = [];

  if (skillsMatch < 70) {
    recommendations.push("⚠️ Você não tem todas as skills. Destaque o que você sabe.");
  }
  if (rateMatch < 70) {
    recommendations.push("💰 Seu rate é alto. Considere fazer uma proposta menor para este.");
  }
  if (freelancer.response_time_hours > 12) {
    recommendations.push("⏱️ Responda rápido! Seu tempo de resposta é alto.");
  }
  if (winChance > 70) {
    recommendations.push("🔥 Alta chance! Envie uma proposta forte.");
  }
  if (overallScore > 80) {
    recommendations.push("✨ Você é perfeito para este projeto!");
  }

  return {
    overallScore,
    winChance: Math.min(100, winChance),
    matchBreakdown: {
      skillsMatch: Math.round(skillsMatch),
      rateMatch: Math.round(rateMatch),
      experienceMatch: Math.round(experienceMatch),
      portfolioMatch: Math.round(portfolioMatch),
      ratingMatch: Math.round(ratingMatch),
    },
    recommendedBid,
    competitorAnalysis: {
      estimatedCompetitors,
      avgCompetitorRating: 4.3,
      avgCompetitorBid: recommendedBid * 1.1,
    },
    recommendations,
    shouldApply: overallScore > 60 && winChance > 40,
  };
}

// Use OpenAI pra análise mais profunda (optional)
export async function getAIInsights(
  project: ProjectData,
  match: MatchScore
): Promise<string[]> {
  try {
    const prompt = `
Analise este match entre projeto e freelancer:

PROJETO:
- Título: ${project.title}
- Orçamento: $${project.budget}
- Skills: ${project.skills_required.join(', ')}
- Nível: ${project.experience_level}

MATCH SCORE: ${match.overallScore}/100
WIN CHANCE: ${match.winChance}%
RECOMENDADO COBRAR: $${match.recommendedBid}

Dê 3 insights práticos em português pra melhorar a chance de ganho.
Responda em formato de lista (cada insight em uma linha).
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content || '';
    return content.split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    console.error('Erro ao obter insights AI:', error);
    return match.recommendations;
  }
}
