import { createServiceClient } from './supabase/service';

export async function checkActiveSubscription(userId: string): Promise<{
  hasActiveSubscription: boolean;
  subscription: any | null;
  remainingSeats: number;
}> {
  try {
    const supabase = createServiceClient();

    const { data: subscription } = await supabase
      .from('stripe_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      return {
        hasActiveSubscription: false,
        subscription: null,
        remainingSeats: 0,
      };
    }

    return {
      hasActiveSubscription: true,
      subscription,
      remainingSeats: subscription.seats_purchased,
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return {
      hasActiveSubscription: false,
      subscription: null,
      remainingSeats: 0,
    };
  }
}

export async function incrementUsageMetric(
  userId: string,
  metricType: 'leads_qualified' | 'messages_sent' | 'prospects_generated',
  quantity: number = 1
): Promise<boolean> {
  try {
    const supabase = createServiceClient();

    // Get current billing period
    const today = new Date();
    const billingPeriodStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const billingPeriodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const { error } = await supabase
      .from('stripe_usage_records')
      .insert({
        user_id: userId,
        metric_type: metricType,
        quantity,
        billing_period_start: billingPeriodStart.toISOString().split('T')[0],
        billing_period_end: billingPeriodEnd.toISOString().split('T')[0],
      });

    if (error) {
      console.error('Error recording usage:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error incrementing usage metric:', error);
    return false;
  }
}

export function getPerformanceBonusPercentage(
  plan: 'starter' | 'professional' | 'enterprise'
): number {
  switch (plan) {
    case 'starter':
      return 0; // No performance bonus
    case 'professional':
      return 10; // 10% cashback
    case 'enterprise':
      return 20; // 20% cashback
    default:
      return 0;
  }
}
