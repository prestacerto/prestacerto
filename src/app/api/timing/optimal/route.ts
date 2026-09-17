import { NextResponse } from 'next/server';
export async function POST(){
 return NextResponse.json({success:false,code:'INSUFFICIENT_DATA',optimal_time:null,confidence:null,auto_scheduler_enabled:false,message:'Ainda não há dados suficientes para estimar receptividade. Confira os prazos publicados em /dashboard/timing.'},{status:503});
}
