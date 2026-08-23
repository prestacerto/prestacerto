import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: subscription } = await supabase
      .from('stripe_subscriptions')
      .select('*, stripe_plans(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      return NextResponse.json({ subscription: null });
    }

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });
  try {
    const body = await request.json();
    const { userId, action, newPlanId, seats } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data: subscription, error: subError } = await supabase
      .from('stripe_subscriptions')
      .select('stripe_subscription_id, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    let result;

    switch (action) {
      case 'upgrade':
      case 'downgrade': {
        if (!newPlanId) {
          return NextResponse.json({ error: 'New plan ID is required' }, { status: 400 });
        }

        const { data: newPlan } = await supabase
          .from('stripe_plans')
          .select('id')
          .eq('id', newPlanId)
          .single();

        if (!newPlan) {
          return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }

        result = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          items: [
            {
              id: (await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)).items.data[0].id,
              price: newPlanId,
            },
          ],
          proration_behavior: action === 'upgrade' ? 'create_prorations' : 'none',
        });

        await supabase
          .from('stripe_subscriptions')
          .update({ plan_id: newPlanId })
          .eq('stripe_subscription_id', subscription.stripe_subscription_id);

        break;
      }

      case 'update-seats': {
        if (!seats || seats < 1) {
          return NextResponse.json({ error: 'Valid seats number is required' }, { status: 400 });
        }

        result = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          items: [
            {
              id: (await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)).items.data[0].id,
              quantity: seats,
            },
          ],
        });

        await supabase
          .from('stripe_subscriptions')
          .update({ seats_purchased: seats })
          .eq('stripe_subscription_id', subscription.stripe_subscription_id);

        break;
      }

      case 'cancel': {
        result = await stripe.subscriptions.del(subscription.stripe_subscription_id);

        await supabase
          .from('stripe_subscriptions')
          .update({
            status: 'cancelled',
            canceled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.stripe_subscription_id);

        break;
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Subscription update error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
