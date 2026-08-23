import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createServiceClient();

    switch (event.type) {
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await supabase
          .from('stripe_subscriptions')
          .update({
            status: subscription.status as string,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await supabase
          .from('stripe_subscriptions')
          .update({
            status: 'cancelled',
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await supabase
          .from('stripe_invoices')
          .upsert(
            {
              stripe_invoice_id: invoice.id,
              stripe_subscription_id: invoice.subscription as string,
              amount_total: invoice.total || 0,
              amount_paid: invoice.amount_paid || 0,
              status: 'paid',
              paid_at: invoice.status_transitions.paid_at ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() : new Date().toISOString(),
              invoice_pdf_url: invoice.hosted_invoice_url || '',
            },
            { onConflict: 'stripe_invoice_id' }
          );
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await supabase
          .from('stripe_invoices')
          .upsert(
            {
              stripe_invoice_id: invoice.id,
              stripe_subscription_id: invoice.subscription as string,
              amount_total: invoice.total || 0,
              status: 'open',
            },
            { onConflict: 'stripe_invoice_id' }
          );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
