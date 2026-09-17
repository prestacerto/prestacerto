import { validateLandingLead, type LandingJourney, type LandingLead } from './landing-leads-validation';
import { EMPTY_PROJECT, PROJECT_CATEGORIES } from './projects/publication';
import type { ProjectDraft } from './projects/draft';

export const LANDING_HANDOFF_KEY = 'prestacerto:landing-handoff';
const LIFETIME = 24 * 60 * 60 * 1000;
type Handoff = { version: 1; savedAt: number; lead: LandingLead; categorySlug?: string };

// Contact details stay in this tab for the next form, never in URLs or analytics.
export function saveLandingHandoff(lead: LandingLead, categorySlug?: string): boolean {
  try {
    window.sessionStorage.setItem(LANDING_HANDOFF_KEY, JSON.stringify({ version: 1, savedAt: Date.now(), lead, categorySlug }));
    return true;
  } catch { return false; }
}

export function readLandingHandoff(journey?: LandingJourney, email?: string | null, now = Date.now()): Handoff | null {
  try {
    const raw = window.sessionStorage.getItem(LANDING_HANDOFF_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const validated = validateLandingLead(saved?.lead);
    if (saved?.version !== 1 || !Number.isFinite(saved.savedAt) || saved.savedAt > now || now - saved.savedAt >= LIFETIME || !validated.success) {
      window.sessionStorage.removeItem(LANDING_HANDOFF_KEY);
      return null;
    }
    if ((journey && validated.data.journey !== journey) || (email !== undefined && validated.data.email !== email?.trim().toLowerCase())) return null;
    return { version: 1, savedAt: saved.savedAt, lead: validated.data, categorySlug: typeof saved.categorySlug === 'string' ? saved.categorySlug.slice(0, 120) : undefined };
  } catch { return null; }
}

export function clearLandingHandoff(id: string) {
  try {
    if (readLandingHandoff()?.lead.id === id) window.sessionStorage.removeItem(LANDING_HANDOFF_KEY);
  } catch { /* An unavailable browser store must not undo a completed action. */ }
}

export function landingProjectDraft(handoff: Handoff): ProjectDraft | null {
  const { lead } = handoff;
  if (lead.journey !== 'client') return null;
  const description = [lead.description, `Local do serviço: ${lead.location}`, lead.deadline ? `Prazo informado: ${lead.deadline}` : ''].filter(Boolean).join('\n\n');
  const category = Object.entries(PROJECT_CATEGORIES).find(([, slug]) => slug && slug === handoff.categorySlug)?.[0] || 'geral';
  // A free-text deadline is kept verbatim for review. Budget and date need the person's decision.
  return { version: 1, savedAt: handoff.savedAt, idea: description, step: 2, formData: { ...EMPTY_PROJECT, title: lead.service.slice(0, 120), description, category } };
}

export function landingProfileSuggestions(lead: LandingLead) {
  const location = /^([\p{L} .'-]{2,80})\s*[/,–-]\s*(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$/iu.exec(lead.location);
  return { fullName: lead.name.slice(0, 80), headline: lead.service.slice(0, 100), bio: (lead.experience || '').slice(0, 600), city: location?.[1].trim() || '', state: location?.[2].toUpperCase() || '' };
}
