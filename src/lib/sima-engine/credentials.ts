// Tenant credentials come from two environment variables:
// SIMA_ENGINE_CREDENTIALS (the original array) and SIMA_ENGINE_CREDENTIALS_EXTRA
// (additional entries). Both hold JSON arrays of {tenant, environment, sha256}.
// The extra variable exists because sensitive Vercel variables cannot be read back,
// so new tenants can be added without rewriting the original value.
export function engineCredentials(): string {
  const entries: unknown[] = [];
  for (const raw of [process.env.SIMA_ENGINE_CREDENTIALS, process.env.SIMA_ENGINE_CREDENTIALS_EXTRA]) {
    if (!raw) continue;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) entries.push(...parsed);
    } catch {
      // ignore malformed values; the remaining source still applies
    }
  }
  return JSON.stringify(entries);
}
