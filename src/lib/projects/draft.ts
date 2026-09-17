import { EMPTY_PROJECT, type ProjectInput } from './publication';

const DRAFT_LIFETIME_MS = 86400000;
export const GUEST_PROJECT_DRAFT_KEY = 'prestacerto:project-draft:guest';

export type ProjectDraft = {
  version: 1;
  savedAt: number;
  idea: string;
  step: 1 | 2;
  formData: ProjectInput;
};

type DraftStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function parseDraft(raw: string, now: number): ProjectDraft | null {
  try {
    const saved = JSON.parse(raw);
    if (!saved || saved.version !== 1 || !Number.isFinite(saved.savedAt)
      || saved.savedAt > now || now - saved.savedAt >= DRAFT_LIFETIME_MS
      || !saved.formData || typeof saved.formData !== 'object' || Array.isArray(saved.formData)) return null;

    const formData = { ...EMPTY_PROJECT };
    for (const key of Object.keys(formData) as Array<keyof ProjectInput>) {
      if (typeof saved.formData[key] === 'string') formData[key] = saved.formData[key].slice(0, 10000);
    }
    return {
      version: 1,
      savedAt: saved.savedAt,
      idea: typeof saved.idea === 'string' ? saved.idea.slice(0, 10000) : '',
      step: saved.step === 2 ? 2 : 1,
      formData,
    };
  } catch {
    return null;
  }
}

// A visitor may have prepared a newer project while an older account draft
// remains in this browser. Validate each independently before choosing one.
export function readLatestProjectDraft(storage: Pick<DraftStorage, 'getItem' | 'removeItem'>, draftKey: string, fallbackKey?: string, now = Date.now()): ProjectDraft | null {
  let latest: ProjectDraft | null = null;
  for (const key of new Set([draftKey, ...(fallbackKey ? [fallbackKey] : [])])) {
    try {
      const raw = storage.getItem(key);
      if (!raw) continue;
      const draft = parseDraft(raw, now);
      if (!draft) {
        storage.removeItem(key);
        continue;
      }
      if (!latest || draft.savedAt > latest.savedAt) latest = draft;
    } catch { /* An inaccessible draft must not prevent reading the other key. */ }
  }
  return latest;
}

export function writeProjectDraft(storage: Pick<DraftStorage, 'setItem' | 'removeItem'>, draftKey: string, draft: ProjectDraft, migratedKey?: string) {
  storage.setItem(draftKey, JSON.stringify(draft));
  // Keep the visitor's copy if saving to the signed-in account fails.
  if (migratedKey && migratedKey !== draftKey) {
    try { storage.removeItem(migratedKey); } catch { /* The account copy is already saved. */ }
  }
}

// Session storage keeps the current tab's draft across login when persistent
// storage is blocked or full. Compare every available store before restoring.
export function readLatestProjectDraftFromStores(stores: ReadonlyArray<Pick<DraftStorage, 'getItem' | 'removeItem'>>, draftKey: string, fallbackKey?: string, now = Date.now()): ProjectDraft | null {
  let latest: ProjectDraft | null = null;
  for (const storage of stores) {
    const draft = readLatestProjectDraft(storage, draftKey, fallbackKey, now);
    if (draft && (!latest || draft.savedAt > latest.savedAt)) latest = draft;
  }
  return latest;
}

export function writeProjectDraftToStores(stores: ReadonlyArray<Pick<DraftStorage, 'setItem' | 'removeItem'>>, draftKey: string, draft: ProjectDraft, migratedKey?: string) {
  for (const storage of stores) {
    try {
      writeProjectDraft(storage, draftKey, draft);
      // Once the account copy exists, remove visitor copies from both stores so
      // a later account on this browser cannot inherit an already-claimed draft.
      if (migratedKey && migratedKey !== draftKey) {
        for (const candidate of stores) {
          try { candidate.removeItem(migratedKey); } catch { /* The account copy is safe. */ }
        }
      }
      return;
    } catch { /* Try the current tab's storage before interrupting navigation. */ }
  }
  throw new Error('PROJECT_DRAFT_STORAGE_UNAVAILABLE');
}
