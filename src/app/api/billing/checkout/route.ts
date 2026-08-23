import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planId, successUrl, cancelUrl } = body;

    if (!userId || !planId) {
      return NextResponse.json(
        { error: 'User ID and Plan ID are required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('stripe_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Get or create Stripe customer
    let { data: customer } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id, email')
      .eq('user_id', userId)
      .single();

    let stripeCustomerId: string;

    if (!customer) {
      // Create new Stripe customer
      const { data: userData } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single();

      const stripeCustomer = await stripe.customers.create({
        email: userData?.email || `user-${userId}@prestacerto.com`,
        metadata: { user_id: userId },
      });

      stripeCustomerId = stripeCustomer.id;

      // Save to database
      await supabase
        .from('stripe_customers')
        .insert({
          user_id: userId,
          stripe_customer_id: stripeCustomerId,
          email: stripeCustomer.email,
          billing_name: userData?.full_name,
        });
    } else {
      stripeCustomerId = customer.stripe_customer_id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: plan.currency.toLowerCase(),
            product_data: {
              name: plan.name,
              description: plan.description || '',
            },
            unit_amount: plan.base_price,
            recurring: {
              interval: plan.billing_interval as 'month' | 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_URL}/dashboard/sales-agent?checkout=success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_URL}/pricing`,
      metadata: {
        user_id: userId,
        plan_id: planId,
      },
    });

    return NextResponse.json({ session_id: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
