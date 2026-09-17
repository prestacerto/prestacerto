import test from 'node:test';
import assert from 'node:assert/strict';
import { safeDestination, authDestination } from '../src/lib/auth/destination';
import { validatePublication, projectInsertPayload } from '../src/lib/projects/publication';
const now = new Date('2026-09-08T15:00:00Z');
const valid = { title: 'Site para minha clínica', description: 'Preciso de um site com agendamento e contato por WhatsApp.', budget: '2500.50', deadline: '2026-09-18', skills: ['React',' SEO ', 'React'], category: 'desenvolvimento' };
test('login and confirmation return to the intended local project route', () => {
 assert.equal(safeDestination('/publicar-projeto'), '/publicar-projeto');
 const url = new URL(authDestination('register','/publicar-projeto'), 'https://prestacerto.com.br');
 assert.equal(url.searchParams.get('next'), '/publicar-projeto');assert.equal(url.searchParams.get('role'),'client');
});
test('return paths cannot redirect to a different origin', () => {
 for (const next of ['https://evil.test','//evil.test','/\\evil.test','/%5cevil.test','/%2fevil.test','/\nevil.test','javascript:alert(1)','%','']) assert.equal(safeDestination(next),'/dashboard', next);
 assert.equal(safeDestination('/projects?q=design'),'/projects?q=design');
});
test('inserts use the actual database columns, BRL values and open status', () => {
 const parsed=validatePublication(valid,now);assert.ok(parsed.data);
 assert.deepEqual(projectInsertPayload('owner-id',3,parsed.data), { client_id:'owner-id',category_id:3,title:valid.title,description:valid.description,skills:['React','SEO'],budget_min:2500.5,budget_max:2500.5,deadline_days:10,status:'open' });
});
test('invalid budgets and text are rejected before a database write', () => {
 for (const change of [{budget:0},{budget:-10},{budget:Infinity},{budget:true},{budget:''},{budget:100000000},{title:'Oi'},{description:'curta'},{skills:Array(21).fill(0).map((_,i)=>String(i))}]) assert.ok(validatePublication({...valid,...change},now).error);
});
test('dates must exist and cannot be in the past or beyond two years', () => {
 for(const deadline of ['2026-02-31','2026-09-07','2029-01-01','ontem']) assert.ok(validatePublication({...valid,deadline},now).error,deadline);
 assert.equal(validatePublication({...valid,deadline:''},now).data?.deadlineDays,null);
});
test('enabling client use is explicit and does not accept truthy strings', () => {
 assert.equal(validatePublication({...valid,alsoHire:'true'},now).data?.alsoHire,false);
 assert.equal(validatePublication({...valid,alsoHire:true},now).data?.alsoHire,true);
});
