// Read-only checks. Does not create accounts, proposals, messages or payments.
const origin = (process.argv[2] || 'https://prestacerto.com.br').replace(/\/$/, '');
const id = '11111111-1111-4111-8111-111111111111';
const checks = [
  ...['/', '/publicar-projeto', '/projects', '/services', '/plans', '/ferramentas/propostas'].map(path => ({ path, method:'GET', expected:200 })),
  ...[
    ['/api/proposals','GET'], ['/api/proposals','POST'],
    [`/api/proposals/${id}`,'GET'], [`/api/proposals/${id}/accept`,'POST'],
    [`/api/proposals/${id}/messages`,'GET'], [`/api/proposals/${id}/messages`,'POST'],
    ['/api/projects/create','POST'],
  ].map(([path,method]) => ({path,method,expected:401})),
];
const results = await Promise.all(checks.map(async check => {
  try {
    const res = await fetch(origin + check.path, { method:check.method, redirect:'manual', signal:AbortSignal.timeout(20000) });
    return {...check,actual:res.status,pass:res.status===check.expected};
  } catch(error) {return {...check,pass:false,error:error.message};}
}));
const res = await fetch(origin + '/api/webhooks/assiny', {signal:AbortSignal.timeout(20000)});
const payments = await res.json();
console.log(JSON.stringify({checkedAt:new Date().toISOString(),origin,results,webhookConfigured:payments.configured===true,paymentsLiveValidated:payments.liveValidated===true,limits:'Webhook credentials do not prove checkout readiness. Checks only public pages and anonymous authorization. Authenticated writes, database permissions and real payments require separate verification.'},null,2));
if(results.some(result=>!result.pass))process.exitCode=1;
