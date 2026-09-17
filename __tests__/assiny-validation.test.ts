import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAssinyEvent, resolveAssinyPlan, validWebhookToken } from '../src/lib/payments/assiny';

const payment = {event_id:'test-event',occurred_at:'2026-09-01T12:00:00Z',event:'subscription.paid',customer:{email:'CLIENTE@example.com'},plan:{name:'PrestaCerto Business'},subscription:{id:'test-subscription'}};
test('only authenticated tokens are accepted',()=>{
  assert.equal(validWebhookToken('',null),false);
  assert.equal(validWebhookToken('test-secret','wrong-secret'),false);
  assert.equal(validWebhookToken('test-secret','test-secret'),true);
});
test('approved Business event keeps the paid tier and normalizes the email',()=>{
  assert.deepEqual(parseAssinyEvent(payment),{kind:'subscription',event:'subscription.paid',email:'cliente@example.com',plan:'business',active:true,subscriptionId:'test-subscription',eventId:'test-event',occurredAt:'2026-09-01T12:00:00.000Z'});
});
test('unpaid subscription creation never grants a paid plan',()=>{
  assert.equal(parseAssinyEvent({...payment,event:'subscription.created'}).kind,'ignored');
});
test('unrecognized event names cannot pass substring checks',()=>{
  for(const event of ['subscription.inactive','subscription.not_approved','subscription.deactivated']) assert.equal(parseAssinyEvent({...payment,event}).kind,'ignored');
});
test('unknown products never silently become Pro',()=>{
  for(const name of ['Produto qualquer','Professional tools','Improvement','Business coaching']) assert.equal(resolveAssinyPlan(name),null);
  assert.deepEqual(parseAssinyEvent({...payment,plan:{name:'Outro produto'}}),{kind:'invalid',reason:'unknown_plan'});
});
test('events must identify the subscription and customer',()=>{
  assert.deepEqual(parseAssinyEvent({...payment,subscription:undefined,id:'transaction-not-subscription'}),{kind:'invalid',reason:'missing_subscription_id'});
  assert.equal(parseAssinyEvent({...payment,customer:{email:'invalid'}}).kind,'invalid');
});
test('refunds deactivate instead of activating',()=>{
  const result=parseAssinyEvent({...payment,event:'payment.refunded'});
  assert.equal(result.kind,'subscription');
  if(result.kind==='subscription') assert.equal(result.active,false);
});
test('malformed payloads are rejected',()=>{
  for(const payload of [null,[],true,'text',{}]) assert.equal(parseAssinyEvent(payload).kind,'invalid');
});
