/**
 * POST /api/ai/contrato
 * Generate counter-proposal for freelancer
 */

import { NextRequest, NextResponse } from "next/server";
import { getOpenAIService } from "@/lib/openai-service";
import type { ContractInput } from "@/lib/openai-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.clientProposal || !body.userProfile) {
      return NextResponse.json(
        { error: "Missing required fields: clientProposal, userProfile" },
        { status: 400 }
      );
    }

    const input: ContractInput = {
      clientProposal: body.clientProposal,
      userProfile: {
        skills: Array.isArray(body.userProfile.skills) ? body.userProfile.skills : [],
        experience: body.userProfile.experience || 0,
        avgRate: body.userProfile.avgRate || 0,
      },
      projectContext: body.projectContext,
    };

    const aiService = getOpenAIService();
    const proposal = await aiService.generateCounterProposal(input);

    return NextResponse.json(
      {
        success: true,
        data: proposal,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contrato API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate counter-proposal",
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
