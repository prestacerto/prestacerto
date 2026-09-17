/**
 * POST /api/ai/insights
 * Generate market insights for freelancer
 */

import { NextRequest, NextResponse } from "next/server";
import { getOpenAIService } from "@/lib/openai-service";
import type { InsightsInput } from "@/lib/openai-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.userId || !body.skills || !Array.isArray(body.skills)) {
      return NextResponse.json(
        { error: "Missing required fields: userId, skills (array)" },
        { status: 400 }
      );
    }

    const input: InsightsInput = {
      userId: body.userId,
      skills: body.skills,
      experience: body.experience || 0,
      currentMarket: body.currentMarket,
      topCompetitors: body.topCompetitors,
    };

    const aiService = getOpenAIService();
    const insights = await aiService.generateInsights(input);

    return NextResponse.json(
      {
        success: true,
        data: insights,
        cached: false, // Would need to track this
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Insights API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate insights",
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
