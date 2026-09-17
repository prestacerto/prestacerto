const aliases: Record<string, string> = {'nodejs':'node.js','node js':'node.js','reactjs':'react','react.js':'react','nextjs':'next.js','next js':'next.js','js':'javascript','ts':'typescript'};
export function normalizeSkill(value: string) {
  const key=value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ');
  return aliases[key] ?? key;
}
export function skillCompatibility(required: string[], available: string[]) {
  const needs=[...new Map(required.filter(s=>typeof s==='string' && s.trim()).map(s=>[normalizeSkill(s),s.trim()])).entries()];
  const have=new Set(available.filter(s=>typeof s==='string').map(normalizeSkill));
  const matched=needs.filter(([key])=>have.has(key)).map(([,label])=>label);
  const missing=needs.filter(([key])=>!have.has(key)).map(([,label])=>label);
  return {score:needs.length ? Math.round(matched.length/needs.length*100) : null,matched,missing,total:needs.length};
}
export function rankProjectMatches<T extends {id:string;skills:string[];created_at:string}>(projects:T[],skills:string[],excludedIds: string[] = []) {
  const excluded=new Set(excludedIds);
  return projects.filter(p=>!excluded.has(p.id)).map(project=>({project,...skillCompatibility(project.skills ?? [],skills)}))
    .filter(match=>match.matched.length>0)
    .sort((a,b)=>(b.score ?? 0)-(a.score ?? 0) || b.matched.length-a.matched.length || b.project.created_at.localeCompare(a.project.created_at))
    .slice(0,5);
}
