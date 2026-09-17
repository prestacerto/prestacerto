// Bounded, read-only arrival-rate test. Never calls checkout, AI, auth or writes.
import { writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { setTimeout as sleep } from 'node:timers/promises';

const base = new URL(process.env.LOAD_BASE_URL || 'https://prestacerto.com.br');
if (!['prestacerto.com.br', 'localhost', '127.0.0.1'].includes(base.hostname)
    && !/^prestacerto-[a-z0-9]+-prestacerto1\.vercel\.app$/.test(base.hostname)) {
  throw new Error('Only the PrestaCerto application is allowed.');
}
const output = process.env.LOAD_OUTPUT || '/tmp/prestacerto-load-public.json';
const stages = [{ rps: 2, seconds: 20 }, { rps: 5, seconds: 30 }, { rps: 10, seconds: 30 }, { rps: 20, seconds: 30 }];
const routes = [
  { path: '/', kind: 'landing' },
  { path: '/para-clientes', kind: 'landing' },
  { path: '/para-prestadores', kind: 'landing' },
  { path: '/plans', kind: 'landing' },
  { path: '/services', kind: 'catalogue' },
  { path: '/projects', kind: 'catalogue' },
  { path: '/services?q=design', kind: 'search' },
  { path: '/projects?q=marketing', kind: 'search' },
];
const records = [], stageResults = [], inflight = new Set();
let abortReason = null, maximumConcurrency = 0, scheduled = 0, dropped = 0;
const runId = `prestacerto-load-${new Date().toISOString()}`;
const start = performance.now();
const percentile = (values, p) => values.length ? Math.round([...values].sort((a,b) => a-b)[Math.min(values.length-1, Math.ceil(p*values.length)-1)]) : null;
function metrics(rows) {
  return { requests: rows.length, failures: rows.filter(r => !r.ok).length,
    p50Ms: percentile(rows.map(r => r.durationMs), .5), p95Ms: percentile(rows.map(r => r.durationMs), .95),
    p99Ms: percentile(rows.map(r => r.durationMs), .99), ttfbP95Ms: percentile(rows.map(r => r.ttfbMs), .95),
    bytes: rows.reduce((sum, r) => sum+r.bytes, 0),
    statuses: rows.reduce((sum, r) => { sum[r.status] = (sum[r.status] || 0)+1; return sum; }, {}),
    cache: rows.reduce((sum, r) => { sum[r.cache] = (sum[r.cache] || 0)+1; return sum; }, {}) };
}
async function request(route, stage) {
  const begin = performance.now();
  let status = 0, bytes = 0, cache = 'unknown', ttfbMs = 0, error = null;
  try {
    const response = await fetch(new URL(route.path, base), {
      signal: AbortSignal.timeout(10000), redirect: 'manual',
      headers: { 'User-Agent': 'PrestaCerto-Owner-Capacity-Audit/1.0', 'x-test-run': runId, Accept: 'text/html' },
    });
    status = response.status; cache = response.headers.get('x-vercel-cache') || 'none';
    ttfbMs = performance.now()-begin;
    const html = await response.text(); bytes = Buffer.byteLength(html);
    if (status !== 200) error = `http_${status}`;
    else if (!/<h1(?:\s|>)/i.test(html) || !/Presta\s?Certo/i.test(html)) error = 'unexpected_document';
    else if (/NEXT_HTTP_ERROR_FALLBACK|Application error:|An error occurred in the Server Components render|id="__next_error__"/.test(html)) error = 'application_error';
  } catch (e) { error = e.name || 'request_failed'; }
  records.push({ stage, ...route, status, cache, bytes, ttfbMs, durationMs: performance.now()-begin, ok: !error, error });
  const recent = records.slice(-30);
  if (recent.length === 30 && recent.filter(r => !r.ok).length >= 2) abortReason ||= 'At least two errors in the last 30 requests';
  if (recent.length === 30 && percentile(recent.map(r => r.durationMs), .95) > 5000) abortReason ||= 'Rolling p95 exceeded five seconds';
}
for (const [stageIndex, stage] of stages.entries()) {
  const begin = performance.now(), before = records.length, dropsBefore = dropped;
  const count = stage.rps * stage.seconds;
  console.log(`Stage ${stageIndex+1}: ${stage.rps} requests/second for ${stage.seconds}s`);
  for (let i=0; i<count && !abortReason; i++) {
    await sleep(Math.max(0, begin + i*1000/stage.rps-performance.now()));
    if (abortReason) break;
    scheduled++;
    if (inflight.size >= 40) { dropped++; continue; }
    const route = routes[(scheduled-1)%routes.length];
    const job = request(route, stageIndex+1).finally(() => inflight.delete(job));
    inflight.add(job); maximumConcurrency = Math.max(maximumConcurrency, inflight.size);
  }
  await Promise.all(inflight);
  const result = { stage: stageIndex+1, ...stage, elapsedSeconds: (performance.now()-begin)/1000,
    dropped: dropped-dropsBefore, ...metrics(records.slice(before)) };
  stageResults.push(result); console.log(JSON.stringify(result));
  if (abortReason) break;
}
const report = { runId, base: base.origin, completedAt: new Date().toISOString(),
  methodology: 'Single-origin HTTP HTML reads, paced open arrival model. No browser JavaScript/assets, authenticated writes, email, payment or AI traffic. Cache and DB result correctness require separate verification.',
  guardrails: { maxInflight: 40, timeoutMs: 10000, rollingSample: 30, abortAtFailures: 2, abortP95Ms: 5000 },
  elapsedSeconds: (performance.now()-start)/1000, maximumConcurrency, scheduled, dropped, abortReason,
  overall: metrics(records), stages: stageResults,
  routes: routes.map(route => ({...route,...metrics(records.filter(r => r.path===route.path))})),
  failures: records.filter(r => !r.ok),
};
writeFileSync(output, JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({ output, ...report.overall, maximumConcurrency, dropped, abortReason }));
process.exitCode = abortReason || dropped || report.overall.failures ? 1 : 0;
