import 'server-only';
import { hasServiceCredentials } from '@/lib/supabase/service';

// Enable only after a real authenticated test event has been persisted successfully.
export function isAssinyCheckoutReady() {
  return process.env.ASSINIFY_CHECKOUT_ENABLED === 'true'
    && process.env.ASSINIFY_INTEGRATION_VERIFIED === 'true'
    && hasServiceCredentials()
    && Boolean(process.env.ASSINIFY_WEBHOOK_SECRET || process.env.ASSINIFY_WEBHOOK_SECRET);
}
