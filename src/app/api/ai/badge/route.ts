/**
 * POST /api/ai/badge
 * Evaluate and generate badges for freelancer
 */

import { NextRequest, NextResponse } from "next/server";
import { getOpenAIService } from "@/lib/openai-service";
import type { BadgeInput } from "@/lib/openai-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.userId || !body.stats) {
      return NextResponse.json(
        { error: "Missing required fields: userId, stats" },
        { status: 400 }
      );
    }

    const input: BadgeInput = {
      userId: body.userId,
      stats: {
        completedProjects: body.stats.completedProjects || 0,
        avgRating: body.stats.avgRating || 0,
        responseTime: body.stats.responseTime || 0,
        isVerified: body.stats.isVerified || false,
        yearsExperience: body.stats.yearsExperience || 0,
      },
      portfolio: body.portfolio,
    };

    const aiService = getOpenAIService();
    const badges = await aiService.evaluateBadges(input);

    return NextResponse.json(
      {
        success: true,
        data: badges,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Badge API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to evaluate badges",
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
