import test from 'node:test';
import assert from 'node:assert/strict';
import {estimateProjectPrice} from '../src/lib/pricing-estimate';
const base={monthlyCosts:3000,monthlyIncome:5000,billableHours:100,projectHours:20,reservePercent:0};
test('price stays in BRL and uses the entered project hours',()=>assert.deepEqual(estimateProjectPrice(base),{hourly:80,project:1600}));
test('zero hours, invalid reserves and non-finite input cannot produce Infinity',()=>{
 for(const changed of [{billableHours:0},{projectHours:0},{reservePercent:100},{monthlyIncome:NaN},{monthlyCosts:-1},{monthlyIncome:1e308},{billableHours:1e-308},{projectHours:1e308}])assert.equal(estimateProjectPrice({...base,...changed}),null);
});
test('the reserve is provided by the user',()=>assert.deepEqual(estimateProjectPrice({...base,reservePercent:20}),{hourly:100,project:2000}));
