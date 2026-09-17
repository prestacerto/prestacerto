// A small read-only concurrency smoke test, not a capacity certification.
// At most five in-flight requests; stop at the first server error or timeout.
const fs=require('node:fs');
const {setTimeout:pause}=require('node:timers/promises');
const base='https://prestacerto.com.br';
const paths=['/','/projects','/services','/publicar-projeto','/plans'];
(async()=>{
  const report={base,startedAt:new Date().toISOString(),kind:'bounded read-only smoke',maxConcurrency:5,maxRequests:180,stages:[],aborted:false};
  let total=0;
  for(const concurrency of [1,3,5]){
    const samples=[];const started=performance.now();
    for(let batch=0;batch<20;batch++){
      const time=performance.now();
      const results=await Promise.all(Array.from({length:concurrency},async()=>{
        const path=paths[total++%paths.length];const start=performance.now();
        try{const response=await fetch(base+path,{signal:AbortSignal.timeout(10000)});await response.arrayBuffer();return {path,status:response.status,ms:Math.round(performance.now()-start)};}
        catch{return {path,status:0,ms:Math.round(performance.now()-start)};}
      }));
      samples.push(...results);
      if(results.some(r=>r.status===0||r.status>=500)){report.aborted=true;break;}
      await pause(Math.max(0,1000-(performance.now()-time)));
    }
    const times=samples.map(r=>r.ms).sort((a,b)=>a-b);
    const stage={concurrency,count:samples.length,durationMs:Math.round(performance.now()-started),p50Ms:times[Math.floor(times.length*.5)],p95Ms:times[Math.min(times.length-1,Math.floor(times.length*.95))],statuses:samples.reduce((acc,r)=>(acc[r.status]=(acc[r.status]||0)+1,acc),{}),samples};
    report.stages.push(stage);console.log(JSON.stringify({...stage,samples:undefined}));
    if(report.aborted)break;
  }
  report.finishedAt=new Date().toISOString();
  fs.mkdirSync('launch-evidence',{recursive:true});fs.writeFileSync('launch-evidence/2026-09-10-bounded-traffic.json',JSON.stringify(report,null,2));
  if(report.aborted)process.exitCode=1;
})().catch(error=>{console.error('Traffic check failed',error.message);process.exitCode=1;});
