import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { skillCompatibility } from '@/lib/matching/skills';
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { getMyServices } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';
const input=z.object({projectId:z.string().uuid()});
export async function POST(req:NextRequest){
  const user=await getAuthenticatedUser();
  if(!user) return NextResponse.json({error:'Entre na sua conta.'},{status:401});
  const parsed=input.safeParse(await req.json().catch(()=>null));
  if(!parsed.success) return NextResponse.json({error:'Informe um projeto válido.'},{status:400});
  const db=await createClient();
  const [{data:project,error},services]=await Promise.all([
    db.from('projects').select('id,skills').eq('id',parsed.data.projectId).eq('status','open').maybeSingle(),getMyServices(user.id),
  ]);
  if(error) return NextResponse.json({error:'Não foi possível consultar o projeto.'},{status:503});
  if(!project) return NextResponse.json({error:'Projeto não encontrado.'},{status:404});
  const result=skillCompatibility(project.skills ?? [],services.filter(s=>s.is_active).flatMap(s=>s.skills ?? []));
  return NextResponse.json({success:true,match_score:result.score,matched_skills:result.matched,missing_skills:result.missing,basis:'skill_coverage',note:'Compatibilidade de habilidades, não probabilidade de contratação.'});
}
