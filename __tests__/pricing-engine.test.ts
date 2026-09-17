import test from 'node:test';
import assert from 'node:assert/strict';
import {
  estimateProjectPrice,
  PricingInput,
} from '../src/lib/pricing-estimate';
import {
  PLANS,
  YEARLY_PLANS,
  ADD_ONS,
  BUNDLES,
  formatPrice,
  calculateDiscount,
  getAllPlans,
  getPlanById,
  getAddOnById,
  getMonthlyEquivalent,
  Plan,
} from '../src/lib/plans/pricing';

// ============= PRICING ESTIMATE TESTS =============

test('Pricing Estimate - Basic calculation with no reserve', () => {
  const input: PricingInput = {
    monthlyCosts: 3000,
    monthlyIncome: 5000,
    billableHours: 100,
    projectHours: 20,
    reservePercent: 0,
  };

  const result = estimateProjectPrice(input);

  assert.deepEqual(result, { hourly: 80, project: 1600 });
});

test('Pricing Estimate - With 20% reserve', () => {
  const input: PricingInput = {
    monthlyCosts: 3000,
    monthlyIncome: 5000,
    billableHours: 100,
    projectHours: 20,
    reservePercent: 20,
  };

  const result = estimateProjectPrice(input);

  assert.deepEqual(result, { hourly: 100, project: 2000 });
});

test('Pricing Estimate - With 50% reserve', () => {
  const input: PricingInput = {
    monthlyCosts: 2000,
    monthlyIncome: 3000,
    billableHours: 160,
    projectHours: 40,
    reservePercent: 50,
  };

  const result = estimateProjectPrice(input);

  // (2000 + 3000) / 160 / (1 - 0.5) = 5000 / 160 / 0.5 = 62.5 hourly
  // 62.5 * 40 = 2500 project
  assert.ok(result !== null);
  assert.ok(result!.hourly === 63 || result!.hourly === 62.50);
});

test('Pricing Estimate - Zero billable hours returns null', () => {
  const input: PricingInput = {
    monthlyCosts: 3000,
    monthlyIncome: 5000,
    billableHours: 0,
    projectHours: 20,
    reservePercent: 0,
  };

  const result = estimateProjectPrice(input);

  assert.equal(result, null);
});

test('Pricing Estimate - Zero project hours returns null', () => {
  const input: PricingInput = {
    monthlyCosts: 3000,
    monthlyIncome: 5000,
    billableHours: 100,
    projectHours: 0,
    reservePercent: 0,
  };

  const result = estimateProjectPrice(input);

  assert.equal(result, null);
});

test('Pricing Estimate - 100% reserve returns null (impossible)', () => {
  const input: PricingInput = {
    monthlyCosts: 3000,
    monthlyIncome: 5000,
    billableHours: 100,
    projectHours: 20,
    reservePercent: 100,
  };

  const result = estimateProjectPrice(input);

  assert.equal(result, null);
});

test('Pricing Estimate - Negative costs returns null', () => {
  const input: PricingInput = {
    monthlyCosts: -1000,
    monthlyIncome: 5000,
    billableHours: 100,
    projectHours: 20,
    reservePercent: 0,
  };

  const result = estimateProjectPrice(input);

  assert.equal(result, null);
});

test('Pricing Estimate - NaN input returns null', () => {
  const input: PricingInput = {
    monthlyCosts: NaN,
    monthlyIncome: 5000,
    billableHours: 100,
    projectHours: 20,
    reservePercent: 0,
  };

  const result = estimateProjectPrice(input);

  assert.equal(result, null);
});

test('Pricing Estimate - Result rounds up to 2 decimals', () => {
  const input: PricingInput = {
    monthlyCosts: 1000,
    monthlyIncome: 2000,
    billableHours: 133, // Will produce decimals
    projectHours: 10,
    reservePercent: 0,
  };

  const result = estimateProjectPrice(input);

  assert.ok(result !== null);
  assert.ok(result!.hourly % 1 <= 0.01, 'Hourly should be rounded');
  assert.ok(result!.project % 1 <= 0.01, 'Project should be rounded');
});

test('Pricing Estimate - Very high billable hours works', () => {
  const input: PricingInput = {
    monthlyCosts: 5000,
    monthlyIncome: 10000,
    billableHours: 1000,
    projectHours: 100,
    reservePercent: 0,
  };

  const result = estimateProjectPrice(input);

  assert.ok(result !== null);
  assert.ok(result!.hourly > 0);
  assert.ok(result!.project > 0);
});

test('Pricing Estimate - Very low billable hours (but > 0) works', () => {
  const input: PricingInput = {
    monthlyCosts: 100,
    monthlyIncome: 100,
    billableHours: 1,
    projectHours: 1,
    reservePercent: 0,
  };

  const result = estimateProjectPrice(input);

  assert.ok(result !== null);
  assert.ok(result!.hourly === 200);
  assert.ok(result!.project === 200);
});

test('Pricing Estimate - No income still works', () => {
  const input: PricingInput = {
    monthlyCosts: 3000,
    monthlyIncome: 0,
    billableHours: 100,
    projectHours: 20,
    reservePercent: 0,
  };

  const result = estimateProjectPrice(input);

  assert.ok(result !== null);
  assert.deepEqual(result, { hourly: 30, project: 600 });
});

// ============= PRICING PLANS TESTS =============

test('Pricing Plans - Free plan has no cost', () => {
  const plan = PLANS.free;

  assert.equal(plan.price, 0);
  assert.equal(plan.features.projects, 2);
  assert.equal(plan.features.proposals, 5);
  assert.equal(plan.features.jobMatching, false);
});

test('Pricing Plans - Pro plan is highlighted', () => {
  const plan = PLANS.pro;

  assert.equal(plan.highlighted, true);
  assert.ok(plan.features.jobMatching);
});

test('Pricing Plans - Premium plan allows unlimited projects', () => {
  const plan = PLANS.premium;

  assert.equal(plan.features.projects, -1);
  assert.equal(plan.features.proposals, -1);
});

test('Pricing Plans - Enterprise has all features', () => {
  const plan = PLANS.enterprise;

  assert.equal(plan.features.projects, -1);
  assert.equal(plan.features.teamMembers, -1);
  assert.ok(plan.features.dedicatedSupport);
  assert.ok(plan.features.customIntegrations);
  assert.ok(plan.features.sso);
});

test('Pricing Plans - Yearly plans have discount', () => {
  const starterMonthly = PLANS.starter.price;
  const starterYearly = YEARLY_PLANS.starter_yearly.price;

  // 20% discount = 80% of annual cost
  const expectedYearly = (starterMonthly * 12 * 80) / 100;

  assert.equal(
    starterYearly,
    expectedYearly,
    'Yearly plan should have 20% discount'
  );
  assert.equal(YEARLY_PLANS.starter_yearly.discount, 20);
});

test('Pricing Plans - Premium yearly has 25% discount', () => {
  const premiumMonthly = PLANS.premium.price;
  const premiumYearly = YEARLY_PLANS.premium_yearly.price;

  const expectedYearly = (premiumMonthly * 12 * 75) / 100;

  assert.equal(premiumYearly, expectedYearly, 'Premium yearly should have 25% discount');
  assert.equal(YEARLY_PLANS.premium_yearly.discount, 25);
});

test('Pricing Plans - Add-ons have correct billing periods', () => {
  assert.equal(ADD_ONS.extra_projects_5.billingPeriod, 'monthly');
  assert.equal(ADD_ONS.featured_boost.billingPeriod, 'one-time');
  assert.equal(ADD_ONS.priority_support.billingPeriod, 'monthly');
  assert.equal(ADD_ONS.cv_maker.billingPeriod, 'one-time');
});

test('Pricing Plans - Bundles save money', () => {
  const bundle = BUNDLES.pro_boost;

  assert.ok(
    bundle.bundlePrice < bundle.basePrice,
    'Bundle should be cheaper than buying separately'
  );
  assert.ok(bundle.savings > 0);
});

test('Pricing Plans - Format price converts cents to BRL', () => {
  const formatted = formatPrice(2990);

  assert.ok(
    formatted.includes('29,90') || formatted.includes('29.90'),
    'Should format as BRL currency'
  );
});

test('Pricing Plans - Calculate discount is accurate', () => {
  const basePrice = 10000;
  const discountedPrice = 8000; // 20% discount

  const discount = calculateDiscount(basePrice, discountedPrice);

  assert.equal(discount, 20);
});

test('Pricing Plans - Get all plans returns all plans', () => {
  const allPlans = getAllPlans();

  assert.ok(allPlans.length > 5);
  assert.ok(
    allPlans.some((p) => p.id === 'free'),
    'Should include free plan'
  );
  assert.ok(
    allPlans.some((p) => p.id === 'pro_yearly'),
    'Should include yearly plans'
  );
});

test('Pricing Plans - Get plan by ID returns correct plan', () => {
  const plan = getPlanById('pro');

  assert.equal(plan?.name, 'Pro');
  assert.equal(plan?.price, 2990);
});

test('Pricing Plans - Get plan by ID returns undefined for invalid ID', () => {
  const plan = getPlanById('nonexistent');

  assert.equal(plan, undefined);
});

test('Pricing Plans - Get add-on by ID returns correct add-on', () => {
  const addon = getAddOnById('priority_support');

  assert.equal(addon?.name, 'Suporte Prioritário');
  assert.equal(addon?.billingPeriod, 'monthly');
});

test('Pricing Plans - Get monthly equivalent for yearly plan', () => {
  const yearly = 28900;
  const monthly = getMonthlyEquivalent(yearly, 'yearly');

  assert.ok(monthly < yearly);
  assert.ok(monthly > 0);
});

test('Pricing Plans - Get monthly equivalent for monthly plan', () => {
  const monthly = 2990;
  const equivalent = getMonthlyEquivalent(monthly, 'monthly');

  assert.equal(equivalent, monthly);
});

test('Pricing Plans - Get monthly equivalent for one-time returns 0', () => {
  const oneTime = 1490;
  const equivalent = getMonthlyEquivalent(oneTime, 'one-time');

  assert.equal(equivalent, 0);
});

test('Pricing Plans - Bundle savings calculation is correct', () => {
  const bundle = BUNDLES.ultimate_setup;

  const calculatedSavings = bundle.basePrice - bundle.bundlePrice;

  assert.equal(calculatedSavings, bundle.savings);
});

test('Pricing Plans - All plans have valid prices', () => {
  const allPlans = getAllPlans();

  allPlans.forEach((plan) => {
    assert.ok(
      Number.isFinite(plan.price),
      `Plan ${plan.id} should have finite price`
    );
    assert.ok(plan.price >= 0, `Plan ${plan.id} should have non-negative price`);
  });
});

test('Pricing Plans - Add-on prices are reasonable', () => {
  Object.values(ADD_ONS).forEach((addon) => {
    assert.ok(
      Number.isFinite(addon.price),
      `Add-on ${addon.id} should have finite price`
    );
    assert.ok(addon.price > 0, `Add-on ${addon.id} should have positive price`);
  });
});

test('Pricing Plans - Team members feature scales with plan', () => {
  assert.ok(PLANS.free.features.teamMembers < PLANS.starter.features.teamMembers);
  assert.ok(PLANS.starter.features.teamMembers < PLANS.pro.features.teamMembers);
  assert.ok(PLANS.pro.features.teamMembers < PLANS.premium.features.teamMembers);
});

test('Pricing Plans - Project limits increase with plan tier', () => {
  const projectLimits = [
    PLANS.free.features.projects,
    PLANS.starter.features.projects,
    PLANS.pro.features.projects,
    PLANS.premium.features.projects,
  ];

  // Each should be >= previous (allowing for -1 = unlimited)
  for (let i = 1; i < projectLimits.length; i++) {
    const prev = projectLimits[i - 1] === -1 ? Infinity : projectLimits[i - 1];
    const curr = projectLimits[i] === -1 ? Infinity : projectLimits[i];
    assert.ok(curr >= prev, `Plan tier should have more projects`);
  }
});

test('Pricing Plans - Starter plan is cheaper than Pro', () => {
  assert.ok(PLANS.starter.price < PLANS.pro.price);
});

test('Pricing Plans - Pro plan is cheaper than Premium', () => {
  assert.ok(PLANS.pro.price < PLANS.premium.price);
});

test('Pricing Plans - Premium plan is cheaper than Enterprise', () => {
  assert.ok(PLANS.premium.price < PLANS.enterprise.price);
});

test('Pricing Plans - Bundle saves more than individual items', () => {
  const bundle = BUNDLES.portfolio_pro;

  // Get the individual costs
  const proPlan = PLANS.pro.price;
  const portfolioAddon = ADD_ONS.portfolio_premium.price;

  const separateTotal = proPlan + portfolioAddon;

  assert.ok(
    bundle.bundlePrice < separateTotal,
    'Bundle should be cheaper'
  );
});

test('Pricing Plans - All plan IDs are unique', () => {
  const allPlans = getAllPlans();
  const ids = allPlans.map((p) => p.id);
  const uniqueIds = new Set(ids);

  assert.equal(
    ids.length,
    uniqueIds.size,
    'All plan IDs should be unique'
  );
});

test('Pricing Plans - Pricing is in valid range for market', () => {
  // Basic sanity checks for pricing (all prices in BRL cents)
  assert.ok(PLANS.free.price === 0);
  assert.ok(PLANS.starter.price > 0 && PLANS.starter.price < 10000); // Less than R$ 100
  assert.ok(PLANS.pro.price > 1000 && PLANS.pro.price < 50000); // R$ 10-500
  assert.ok(PLANS.premium.price > 5000 && PLANS.premium.price < 100000); // R$ 50-1000
});
