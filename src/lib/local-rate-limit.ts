// Bounded fallback per server instance. Distributed enforcement still uses Redis.
// Reject new keys at capacity instead of allowing arbitrary clients to evict limits.
export function createLocalLimiter(requests: number, windowMs: number, maxKeys = 10000, now = Date.now) {
  const buckets = new Map<string, { count: number; reset: number }>();
  let nextSweep = 0;
  return {
    async limit(key: string) {
      const time = now();
      if (time >= nextSweep) {
        for (const [id, bucket] of buckets) if (bucket.reset <= time) buckets.delete(id);
        nextSweep = time + Math.min(windowMs, 60000);
      }
      let bucket = buckets.get(key);
      if (bucket && bucket.reset <= time) { buckets.delete(key); bucket = undefined; }
      if (!bucket) {
        if (buckets.size >= maxKeys) return { success: false, remaining: 0, reset: time + 60000 };
        bucket = { count: 0, reset: time + windowMs };
        buckets.set(key, bucket);
      }
      if (bucket.count >= requests) return { success: false, remaining: 0, reset: bucket.reset };
      bucket.count++;
      return { success: true, remaining: requests - bucket.count, reset: bucket.reset };
    },
  };
}
