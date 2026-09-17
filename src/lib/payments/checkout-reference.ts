import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { z } from 'zod';
import type { PaidPlan } from './assiny';

const claims = z.object({ userId: z.string().uuid(), plan: z.enum(['pro', 'business']), issuedAt: z.number().int().positive() });
const MAX_AGE_MS = 14 * 86400000;
function key(secret: string) {
  if (secret.length < 32) throw new Error('Checkout signing key is not configured');
  return createHash('sha256').update('prestacerto-checkout-v1\0').update(secret).digest();
}

// The public checkout receives an opaque reference, not a user ID or secret.
// utm_content is echoed by Assiny in data.metadata (documented provider field).
export function createCheckoutReference(userId: string, plan: PaidPlan, secret: string, now = Date.now()) {
  const data = claims.parse({ userId, plan, issuedAt: now });
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(secret), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
  return ['pc1', iv.toString('base64url'), encrypted.toString('base64url'), cipher.getAuthTag().toString('base64url')].join('.');
}

export function verifyCheckoutReference(reference: string, plan: PaidPlan, secret: string, paymentTime: string): string | null {
  try {
    if (reference.length > 600) return null;
    const parts = reference.split('.');
    if (parts.length !== 4 || parts[0] !== 'pc1' || parts.slice(1).some(part => !/^[\w-]+$/.test(part))) return null;
    const iv = Buffer.from(parts[1], 'base64url'), tag = Buffer.from(parts[3], 'base64url');
    if (iv.length !== 12 || tag.length !== 16) return null;
    const decipher = createDecipheriv('aes-256-gcm', key(secret), iv);
    decipher.setAuthTag(tag);
    const data = claims.parse(JSON.parse(Buffer.concat([decipher.update(Buffer.from(parts[2], 'base64url')), decipher.final()]).toString('utf8')));
    const paidAt = Date.parse(paymentTime);
    if (!Number.isFinite(paidAt) || data.plan !== plan || paidAt < data.issuedAt - 300000 || paidAt > data.issuedAt + MAX_AGE_MS) return null;
    return data.userId;
  } catch { return null; }
}
