import test from 'node:test';
import assert from 'node:assert/strict';
import { readSearchParams, searchPageHref, searchTextFilter } from '../src/lib/search-pagination';

test('search page rejects invalid offsets and bounds user supplied text', () => {
  for (const page of ['-1', '1.5', 'abc', '', '0']) assert.equal(readSearchParams({ page }).page, 1);
  assert.equal(readSearchParams({ page: '9'.repeat(400) }).page, 10000);
  assert.equal(readSearchParams({ page: ['2', '7'], q: [' design ', 'ignored'] }).page, 2);
  assert.equal(readSearchParams({ q: [' design ', 'ignored'] }).query, 'design');
  assert.equal(readSearchParams({ q: 'a'.repeat(300) }).query.length, 100);
});

test('pagination keeps the query and category while returning page one to its clean URL', () => {
  const second = new URL(searchPageHref('/services', 2, 'design & criação', 'design-grafico'), 'https://prestacerto.com.br');
  assert.equal(second.searchParams.get('q'), 'design & criação');
  assert.equal(second.searchParams.get('categoria'), 'design-grafico');
  assert.equal(second.searchParams.get('page'), '2');
  assert.equal(searchPageHref('/projects', 1, '', ''), '/projects');
  assert.equal(searchPageHref('/projects', 3, '', ''), '/projects?page=3');
});

test('PostgREST search treats punctuation as data and includes descriptions and skills', () => {
  assert.equal(searchTextFilter(' design '), 'title.ilike."%design%",description.ilike."%design%",skills.cs."{\\"design\\"}"');
  const hostile = searchTextFilter('a"),is_active.eq.false,(');
  assert.ok(hostile.startsWith('title.ilike."%a\\"),is_active.eq.false,(%"'));
  assert.ok(hostile.includes('description.ilike.'));
  assert.ok(hostile.includes('skills.cs.'));
});
