const {spawnSync}=require('node:child_process');
const {randomBytes}=require('node:crypto');
const values={SIMA_AI_API_URL:'https://prestacerto.com.br/api/support/engine',SIMA_AI_API_KEY:randomBytes(32).toString('hex'),SIMA_AI_TENANT_ID:'prestacerto',SIMA_AI_MODEL:'gpt-4.1-mini'};
for(const [key,value] of Object.entries(values)){
 const args=['env','add',key,'production','--sensitive'];
 const r=spawnSync('node_modules/.bin/vercel',args,{input:value,encoding:'utf8'});
 if(r.status!==0){console.error('Configuration failed for '+key+'. Inspect Vercel; no secret printed.');process.exit(1)}
 console.log('Configured '+key);
}
