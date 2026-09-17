import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId, userName } = await req.json();

    const referralLink = `https://prestacerto.com.br/register?ref=${userId}`;
    const shortCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    return NextResponse.json({
      success: true,
      referral_link: referralLink,
      short_code: shortCode,
      share_message: `${userName} te indicou pra PrestaCerto! ${referralLink}`,
      qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(referralLink)}`,
      earnings_per_referral: 'R$ 49/indicação convertida',
      commission_rate: '10% do faturamento do indicado PARA SEMPRE',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
