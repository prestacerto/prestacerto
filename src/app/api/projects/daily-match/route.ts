import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { getMyServices, listOpenProjects, getMyProjects, getMyProposals } from '@/lib/supabase/queries';
import { rankProjectMatches } from '@/lib/matching/skills';
export async function GET(){
 const user=await getAuthenticatedUser();
 if(!user) return NextResponse.json({error:'Não autenticado'},{status:401});
 const [services,projects,own,proposals]=await Promise.all([getMyServices(user.id),listOpenProjects({}),getMyProjects(user.id),getMyProposals(user.id)]);
 const matches=rankProjectMatches(projects,services.filter(s=>s.is_active).flatMap(s=>s.skills ?? []),[...own.map(p=>p.id),...proposals.filter(p=>p.status!=='withdrawn').map(p=>p.project?.id).filter((id):id is string=>Boolean(id))]);
 const records=matches.map(m=>({...m.project,match_score:m.score,matched_skills:m.matched}));
 return NextResponse.json({success:true,daily_match:records[0]??null,matches:records,basis:'skill_coverage'});
}
