import test from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_PROJECT } from '../src/lib/projects/publication';
import { GUEST_PROJECT_DRAFT_KEY, readLatestProjectDraft, writeProjectDraft, type ProjectDraft } from '../src/lib/projects/draft';

const now = Date.parse('2026-09-10T15:00:00Z');
const accountKey = 'prestacerto:project-draft:account';
const guestKey = GUEST_PROJECT_DRAFT_KEY;
const draft = (title: string, savedAt = now): ProjectDraft => ({ version: 1, savedAt, idea: title, step: 2, formData: { ...EMPTY_PROJECT, title, description: 'Um projeto preparado antes de entrar na conta.', budget: '2500' } });
function storage(entries: Array<[string, unknown]>) {
  const values = new Map(entries.map(([key, value]) => [key, typeof value === 'string' ? value : JSON.stringify(value)]));
  return { values, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
}

test('login restores the newer guest project instead of an older account draft', () => {
  const store = storage([[accountKey, draft('Antigo', now - 3600000)], [guestKey, draft('Novo')]]);
  const restored = readLatestProjectDraft(store, accountKey, guestKey, now);
  assert.equal(restored?.formData.title, 'Novo');
  assert.equal(restored?.step, 2);
  assert.ok(store.values.has(guestKey), 'reading must not remove the only current copy');
});

test('an expired account draft does not hide a valid guest draft', () => {
  const store = storage([[accountKey, draft('Expirado', now - 86400000)], [guestKey, draft('Novo')]]);
  assert.equal(readLatestProjectDraft(store, accountKey, guestKey, now)?.formData.title, 'Novo');
  assert.ok(!store.values.has(accountKey));
  assert.ok(store.values.has(guestKey));
});

test('a newer account draft remains selected over an older guest draft', () => {
  const store = storage([[accountKey, draft('Conta recente')], [guestKey, draft('Visitante antigo', now - 3600000)]]);
  assert.equal(readLatestProjectDraft(store, accountKey, guestKey, now)?.formData.title, 'Conta recente');
});

test('invalid storage entries are handled independently and never block the valid fallback', () => {
  for (const invalid of ['{broken', null, { ...draft('Errado'), savedAt: 'yesterday' }, { ...draft('Errado'), formData: [] }, { ...draft('Errado'), version: 2 }]) {
    const store = storage([[accountKey, invalid], [guestKey, draft('Válido')]]);
    assert.equal(readLatestProjectDraft(store, accountKey, guestKey, now)?.formData.title, 'Válido');
    assert.ok(!store.values.has(accountKey));
  }
  const store = storage([[accountKey, draft('Válido')], [guestKey, '{broken']]);
  assert.equal(readLatestProjectDraft(store, accountKey, guestKey, now)?.formData.title, 'Válido');
});

test('unavailable storage allows the form to start empty', () => {
  assert.equal(readLatestProjectDraft({ getItem() { throw new Error('Storage blocked'); }, removeItem() {} }, accountKey, guestKey, now), null);
});

test('migration only removes the guest copy after the account copy has been saved', () => {
  const prepared = draft('Novo');
  const store = storage([[guestKey, prepared]]);
  assert.throws(() => writeProjectDraft({ setItem() { throw new Error('Quota exceeded'); }, removeItem: store.removeItem }, accountKey, prepared, guestKey), /Quota exceeded/);
  assert.ok(store.values.has(guestKey));
  writeProjectDraft(store, accountKey, prepared, guestKey);
  assert.deepEqual(JSON.parse(store.values.get(accountKey)!), prepared);
  assert.ok(!store.values.has(guestKey));
});
