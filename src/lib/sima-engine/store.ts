import 'server-only';
export type Environment = 'test' | 'production';
export interface EngineStore {
  read<T>(path: string): Promise<T | null>;
  create(path: string, value: unknown): Promise<boolean>;
  remove(path: string): Promise<void>;
  latest<T>(prefix: string): Promise<T | null>;
}
// Atomic INSERT uses the database PK, never Storage upload semantics.
const BROKER = 'https://jsgqcjvlmpuzcepxilpx.supabase.co/functions/v1/sima-engine-store';
const MAX_BYTES = 110_000;
async function boundedResponse(response: Response): Promise<Record<string, unknown>> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('STORAGE_UNAVAILABLE');
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); throw new Error('STORAGE_UNAVAILABLE'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const result: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('STORAGE_UNAVAILABLE');
  return result as Record<string, unknown>;
}
export async function engineStore(environment: Environment): Promise<EngineStore> {
  const key = process.env.SIMA_ENGINE_STORE_KEY;
  if (!key || !/^[A-Za-z0-9_-]{32,160}$/.test(key) || !['test', 'production'].includes(environment)) throw new Error('STORAGE_UNAVAILABLE');
  async function invoke(operation: string, path: string, value?: unknown) {
    try {
      const body = JSON.stringify({ environment, operation, path, ...(operation === 'create' ? { value } : {}) });
      if (Buffer.byteLength(body, 'utf8') > MAX_BYTES) throw new Error('STORAGE_UNAVAILABLE');
      const response = await fetch(BROKER, {
        method: 'POST', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(8000),
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body,
      });
      if (!response.ok) throw new Error('STORAGE_UNAVAILABLE');
      return await boundedResponse(response);
    } catch { throw new Error('STORAGE_UNAVAILABLE'); }
  }
  return {
    async read<T>(path: string) {
      const result = await invoke('read', path);
      if (!Object.hasOwn(result, 'value')) throw new Error('STORAGE_UNAVAILABLE');
      return result.value as T | null;
    },
    async create(path: string, value: unknown) {
      const result = await invoke('create', path, value);
      if (typeof result.created !== 'boolean') throw new Error('STORAGE_UNAVAILABLE');
      return result.created;
    },
    async remove(path: string) {
      const result = await invoke('remove', path);
      if (result.removed !== true) throw new Error('STORAGE_UNAVAILABLE');
    },
    async latest<T>(path: string) {
      const result = await invoke('latest', path);
      if (!Object.hasOwn(result, 'value')) throw new Error('STORAGE_UNAVAILABLE');
      return result.value as T | null;
    },
  };
}
