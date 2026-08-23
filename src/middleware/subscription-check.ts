import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function checkSubscriptionMiddleware(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Check for active subscription
    const { data: subscription } = await supabase
      .from('stripe_subscriptions')
      .select('*, stripe_plans(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription. Please upgrade to access this feature.' },
        { status: 402 }
      );
    }

    // Check if subscription has expired
    if (new Date(subscription.current_period_end) < new Date()) {
      return NextResponse.json(
        { error: 'Subscription expired. Please renew to continue.' },
        { status: 402 }
      );
    }

    // Add subscription info to request headers for downstream processing
    const response = NextResponse.next();
    response.headers.set('x-subscription-id', subscription.id.toString());
    response.headers.set('x-subscription-plan', subscription.stripe_plans?.id || 'unknown');
    response.headers.set('x-seats-purchased', subscription.seats_purchased.toString());

    return response;
  } catch (error) {
    console.error('Subscription check error:', error);
    return NextResponse.json(
      { error: 'Failed to verify subscription' },
      { status: 500 }
    );
  }
}
