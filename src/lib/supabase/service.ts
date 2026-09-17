import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from './config';

export class ServiceConfigurationError extends Error {
  constructor() {
    super('A credencial de servidor do Supabase está ausente ou inválida.');
    this.name = 'ServiceConfigurationError';
  }
}

export function hasServiceCredentials() {
  const key = process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) return false;
  if (key.startsWith('sb_secret_')) return true;
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString());
    return payload.role === 'service_role' && payload.ref === new URL(SUPABASE_URL).hostname.split('.')[0];
  } catch { return false; }
}

// Only server code that already authorized its caller may use this client.
export function createServiceClient() {
  if (!hasServiceCredentials()) throw new ServiceConfigurationError();
  return createSupabaseClient(
    SUPABASE_URL,
    (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)!.trim(),
    { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } },
  );
}
