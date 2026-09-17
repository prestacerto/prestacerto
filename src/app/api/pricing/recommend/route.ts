import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { estimateProjectPrice } from '@/lib/pricing-estimate';
const schema=z.object({monthlyCosts:z.number().finite().min(0).max(1e9),monthlyIncome:z.number().finite().min(0).max(1e9),billableHours:z.number().finite().positive().max(744),projectHours:z.number().finite().positive().max(1e6),reservePercent:z.number().finite().min(0).lt(100)});
export async function POST(req:NextRequest){
 const parsed=schema.safeParse(await req.json().catch(()=>null));
 if(!parsed.success)return NextResponse.json({error:'Informe custos, renda desejada, horas faturáveis, horas do projeto e reserva para taxas.'},{status:400});
 const result=estimateProjectPrice(parsed.data);
 return NextResponse.json({success:true,...result,basis:'user_inputs',currency:'BRL',note:'Estimativa de custos, não uma previsão de preços de mercado.'});
}
