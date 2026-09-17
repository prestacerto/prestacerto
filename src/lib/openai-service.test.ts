/**
 * OpenAI Service Tests & Examples
 *
 * Run: npm test src/lib/openai-service.test.ts
 */

import { getOpenAIService, initOpenAIService } from "@/lib/openai-service";
import type {
  InsightsInput,
  BadgeInput,
  PortfolioInput,
  ContractInput,
} from "@/lib/openai-service";

/**
 * Example: Initialize service
 */
export function exampleInitializeService() {
  initOpenAIService({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
    redisUrl: process.env.UPSTASH_REDIS_REST_URL,
    redisToken: process.env.UPSTASH_REDIS_REST_TOKEN,
    cacheTTL: 3600,
  });
}

/**
 * Example: Generate Insights
 */
export async function exampleGenerateInsights() {
  const aiService = getOpenAIService();

  const input: InsightsInput = {
    userId: "user-123",
    skills: ["React", "Next.js", "TypeScript"],
    experience: 5,
    currentMarket: "Brasil",
    topCompetitors: ["dev1", "dev2", "dev3"],
  };

  try {
    const insights = await aiService.generateInsights(input);

    console.log("=== INSIGHTS ===");
    console.log(`Opportunity Score: ${insights.opportunityScore}`);
    console.log("\nTrending Skills:");
    insights.trendingSkills.forEach((skill) => {
      console.log(`- ${skill.skill} (${skill.demand})`);
      console.log(`  Avg Rate: R$ ${skill.avgRate}`);
      console.log(`  Recommended: R$ ${skill.recommendedRate}`);
      console.log(`  Growth: +${skill.growth}%`);
    });
    console.log("\nMarket Analysis:", insights.marketAnalysis);
    console.log("\nRecommendations:");
    insights.recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec}`);
    });

    return insights;
  } catch (error) {
    console.error("Failed to generate insights:", error);
    throw error;
  }
}

/**
 * Example: Evaluate Badges
 */
export async function exampleEvaluateBadges() {
  const aiService = getOpenAIService();

  const input: BadgeInput = {
    userId: "user-123",
    stats: {
      completedProjects: 45,
      avgRating: 4.8,
      responseTime: 2.5, // hours
      isVerified: true,
      yearsExperience: 5,
    },
    portfolio: "https://example.com/portfolio",
  };

  try {
    const badges = await aiService.evaluateBadges(input);

    console.log("=== BADGES ===");
    console.log("Earned Badges:");
    badges.badges.forEach((badge) => {
      console.log(`- ${badge.type} (Score: ${badge.score})`);
      console.log(`  Rationale: ${badge.rationale}`);
    });

    console.log("\nNext Milestone:");
    console.log(`- Badge: ${badges.nextMilestone.badge}`);
    console.log(`- Progress: ${badges.nextMilestone.progress}%`);
    console.log(`- Recommendation: ${badges.nextMilestone.recommendation}`);

    return badges;
  } catch (error) {
    console.error("Failed to evaluate badges:", error);
    throw error;
  }
}

/**
 * Example: Optimize Portfolio
 */
export async function exampleOptimizePortfolio() {
  const aiService = getOpenAIService();

  const input: PortfolioInput = {
    userId: "user-123",
    projects: [
      {
        title: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform",
        skills: ["React", "Node.js", "MongoDB"],
        result: "Increased sales by 40%",
        budget: 15000,
      },
      {
        title: "Mobile App",
        description: "Developed a React Native mobile app",
        skills: ["React Native", "Firebase"],
        result: "10k+ downloads",
      },
    ],
    bio: "Full-stack developer with 5 years experience",
    targetAudience: "Startups and SMBs",
  };

  try {
    const portfolio = await aiService.optimizePortfolio(input);

    console.log("=== PORTFOLIO OPTIMIZATION ===");
    console.log("Professional Summary:");
    console.log(portfolio.summary);

    console.log("\nHighlights:");
    portfolio.highlights.forEach((h) => {
      console.log(`- ${h}`);
    });

    console.log("\nSEO Tags:");
    console.log(portfolio.seoTags.join(", "));

    console.log("\nImprovement Suggestions:");
    portfolio.improvementSuggestions.forEach((s, i) => {
      console.log(`${i + 1}. ${s}`);
    });

    return portfolio;
  } catch (error) {
    console.error("Failed to optimize portfolio:", error);
    throw error;
  }
}

/**
 * Example: Generate Counter-Proposal
 */
export async function exampleGenerateCounterProposal() {
  const aiService = getOpenAIService();

  const input: ContractInput = {
    clientProposal: `
    Projeto: Website redesign
    Budget: R$ 3000
    Timeline: 2 semanas
    Escopo: Homepage, About, Services pages
    Revisões: 3 rounds
    `,
    userProfile: {
      skills: ["React", "Next.js", "Tailwind CSS", "UX Design"],
      experience: 5,
      avgRate: 150, // R$ per hour
    },
    projectContext:
      "Client is a SaaS startup looking for a modern, responsive website",
  };

  try {
    const proposal = await aiService.generateCounterProposal(input);

    console.log("=== COUNTER-PROPOSAL ===");
    console.log("Proposal:");
    console.log(proposal.counterProposal);

    console.log("\nKey Points:");
    proposal.keyPoints.forEach((point) => {
      console.log(`- ${point}`);
    });

    console.log("\nRisk Analysis:");
    proposal.riskAnalysis.forEach((risk) => {
      console.log(`- ${risk}`);
    });

    console.log("\nNegotiation Tips:");
    proposal.negotiationTips.forEach((tip) => {
      console.log(`- ${tip}`);
    });

    return proposal;
  } catch (error) {
    console.error("Failed to generate counter-proposal:", error);
    throw error;
  }
}

/**
 * Example: Clear Cache
 */
export async function exampleClearCache() {
  const aiService = getOpenAIService();

  try {
    await aiService.clearCache("insights", "user-123");
    console.log("Cache cleared for user-123 insights");
  } catch (error) {
    console.error("Failed to clear cache:", error);
  }
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log("Starting OpenAI Service Examples...\n");

  exampleInitializeService();

  try {
    await exampleGenerateInsights();
    console.log("\n---\n");

    await exampleEvaluateBadges();
    console.log("\n---\n");

    await exampleOptimizePortfolio();
    console.log("\n---\n");

    await exampleGenerateCounterProposal();
    console.log("\n---\n");

    await exampleClearCache();

    console.log("\nAll examples completed!");
  } catch (error) {
    console.error("Error running examples:", error);
  }
}
