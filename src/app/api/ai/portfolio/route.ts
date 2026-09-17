/**
 * POST /api/ai/portfolio
 * Optimize freelancer portfolio
 */

import { NextRequest, NextResponse } from "next/server";
import { getOpenAIService } from "@/lib/openai-service";
import type { PortfolioInput } from "@/lib/openai-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.userId || !body.projects || !Array.isArray(body.projects)) {
      return NextResponse.json(
        { error: "Missing required fields: userId, projects (array)" },
        { status: 400 }
      );
    }

    const input: PortfolioInput = {
      userId: body.userId,
      projects: body.projects.map((p: Record<string, unknown>) => ({
        title: p.title || "",
        description: p.description || "",
        skills: Array.isArray(p.skills) ? p.skills : [],
        result: p.result || "",
        budget: p.budget as number | undefined,
      })),
      bio: body.bio,
      targetAudience: body.targetAudience,
    };

    const aiService = getOpenAIService();
    const portfolio = await aiService.optimizePortfolio(input);

    return NextResponse.json(
      {
        success: true,
        data: portfolio,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Portfolio API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to optimize portfolio",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: "Use POST method" },
    { status: 405 }
  );
}
