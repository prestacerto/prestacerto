import test from 'node:test';
import assert from 'node:assert/strict';
import { authDestination, planDestination, selectedPlanFromDestination, safeDestination, registrationRole } from '../src/lib/auth/destination';

test('paid plan survives login, registration and return without changing destination', () => {
  for (const plan of ['pro', 'business'] as const) {
    const destination = planDestination(plan);
    const login = new URL(authDestination('login', destination), 'https://prestacerto.com.br');
    const register = new URL(authDestination('register', login.searchParams.get('next')!), 'https://prestacerto.com.br');
    assert.equal(safeDestination(register.searchParams.get('next')), destination);
    assert.equal(selectedPlanFromDestination(destination), plan);
    assert.equal(register.searchParams.get('role'), null);
    assert.equal(registrationRole(destination), 'freelancer');
  }
});

test('explicit account roles and publication intent take precedence over the plan default', () => {
  assert.equal(registrationRole(planDestination('business'), 'client'), 'client');
  assert.equal(registrationRole('/publicar-projeto'), 'client');
  assert.equal(registrationRole('/publicar-projeto', 'freelancer'), 'freelancer');
});

test('unknown plans and external destinations do not become checkout intent', () => {
  assert.equal(planDestination('admin'), '/plans');
  for (const input of ['https://other.example/plans?plan=pro', '//other.example/plans?plan=pro', '/dashboard?plan=pro', '/plans?plan=admin']) {
    assert.equal(selectedPlanFromDestination(input), null);
  }
});
