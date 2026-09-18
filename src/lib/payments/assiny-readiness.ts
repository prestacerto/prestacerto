import 'server-only';
import { hasServiceCredentials } from '@/lib/supabase/service';

// Enable only after a real authenticated test event has been persisted successfully.
export function isAssinyCheckoutReady() {
  return process.env.ASSINY_CHECKOUT_ENABLED === 'true'
    && process.env.ASSINY_INTEGRATION_VERIFIED === 'true'
    && hasServiceCredentials()
    && Boolean(process.env.ASSINY_WEBHOOK_SECRET || process.env.ASSINY_WEBHOOK_SECRET);
}
