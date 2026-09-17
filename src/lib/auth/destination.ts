export const PUBLISH_PROJECT_PATH = "/publicar-projeto";

export function planDestination(plan: string) {
  return plan === 'pro' || plan === 'business' ? `/plans?plan=${plan}#continuar-assinatura` : '/plans';
}

export function selectedPlanFromDestination(destination: string): 'pro' | 'business' | null {
  const url = new URL(safeDestination(destination), 'https://prestacerto.com.br');
  const plan = url.searchParams.get('plan');
  return url.pathname === '/plans' && (plan === 'pro' || plan === 'business') ? plan : null;
}

// Only return a path on this site, including after URL decoding.
export function safeDestination(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string" || value.length > 2048) return fallback;
  try {
    const decoded = decodeURIComponent(value);
    if (!decoded.startsWith("/") || decoded.startsWith("//") || /[\\\u0000-\u0020]/.test(decoded)) return fallback;
    const url = new URL(value, "https://prestacerto.com.br");
    return url.origin === "https://prestacerto.com.br" ? `${url.pathname}${url.search}${url.hash}` : fallback;
  } catch { return fallback; }
}

export function registrationRole(next: string, requested?: string | null): 'client' | 'freelancer' {
  if (requested === 'client' || requested === 'freelancer') return requested;
  const destination = safeDestination(next);
  return destination === PUBLISH_PROJECT_PATH || destination.startsWith('/dashboard/projects/new') ? 'client' : 'freelancer';
}

export function authDestination(mode: "login" | "register", next: string) {
  const destination = safeDestination(next);
  const params = new URLSearchParams({ next: destination });
  if (registrationRole(destination) === 'client') params.set('role', 'client');
  return `/${mode}?${params}`;
}
