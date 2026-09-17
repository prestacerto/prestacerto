import test from 'node:test';
import assert from 'node:assert/strict';
import { hasPublicProfileContent, regionalDiscoveryPaths, indexingRobots, serializeJsonLd, type DiscoveryProfile } from '../src/lib/seo/discovery';
import { defaultMetadata, getPageMetadata, describePage } from '../src/lib/seo/metadata';

import { getLandingCity, getLandingCategory } from '../src/lib/data/landing-data';

const profile: DiscoveryProfile = { id: 'provider', full_name: 'Profissional', bio: null, city: 'São Paulo', state: 'SP', role: 'freelancer' };
const service = { id: 'service', freelancer_id: profile.id, category_id: 1 };
const categories = [{ id: 1, slug: 'desenvolvimento-web' }];

test('regional discovery requires an actual local professional and active service input', () => {
  assert.deepEqual(regionalDiscoveryPaths([profile], [service, { ...service, id: 'other' }], categories), ['/contratar/desenvolvimento-web/sao-paulo']);
  for (const changed of [{ state: 'RJ' }, { city: 'Cidade inexistente' }, { role: 'client' }, { full_name: ' ' }]) assert.deepEqual(regionalDiscoveryPaths([{ ...profile, ...changed }], [service], categories), []);
  assert.deepEqual(regionalDiscoveryPaths([profile], [], categories), []);
  assert.deepEqual(regionalDiscoveryPaths([], [service], categories), []);
  assert.deepEqual(regionalDiscoveryPaths([profile], [service], [{ id: 1, slug: 'unknown' }]), []);
});

test('a public name alone is not enough to index an empty professional profile', () => {
  assert.equal(hasPublicProfileContent(profile, false), false);
  assert.equal(hasPublicProfileContent(profile, true), true);
  assert.equal(hasPublicProfileContent({ full_name: 'Pessoa', bio: 'Serviços descritos pelo profissional.' }, false), true);
  assert.equal(hasPublicProfileContent({ full_name: ' ', bio: 'Uma descrição' }, true), false);
});

test('noindex also applies to Googlebot rather than inheriting an index directive', () => {
  assert.deepEqual(indexingRobots(false), { index: false, follow: true, googleBot: { index: false, follow: true } });
});

test('user supplied JSON-LD cannot close the script element and still round-trips', () => {
  const data = { name: '</script><img src=x onerror=alert(1)>', bio: 'Texto com aspas " e <símbolos>' };
  const encoded = serializeJsonLd(data);
  assert.ok(!encoded.includes('<'));
  assert.deepEqual(JSON.parse(encoded), data);
});

test('page canonicals and social URLs agree and long descriptions end at a word boundary', () => {
  const metadata = getPageMetadata('Portfólio profissional', 'Descrição específica', '/portfolio/perfil-publico');
  assert.equal(metadata.alternates?.canonical, 'https://prestacerto.com.br/portfolio/perfil-publico');
  assert.equal(metadata.openGraph?.url, metadata.alternates?.canonical);
  assert.ok(describePage('<p>Uma descrição longa para a página. </p>'.repeat(15), '').length <= 160);
  assert.ok(!describePage('<b>Serviço</b> profissional', '').includes('<'));
});

test('Search Console ownership token is rendered alongside configured verification', () => {
  assert.ok(Array.isArray(defaultMetadata.verification?.google));
  assert.ok(defaultMetadata.verification.google.includes('LUQhgWrOAVm9cJfSvC3qYrPxRniLb41KsHQZNMwg3Qg'));
});

test('search titles and social previews use the brand once and bypass inherited templates', () => {
  for (const input of ['Planos', 'Planos | PrestaCerto']) {
    const result = getPageMetadata(input, 'Compare planos', '/plans');
    assert.deepEqual(result.title, { absolute: 'Planos | PrestaCerto' });
    assert.equal(result.openGraph?.title, 'Planos | PrestaCerto');
    assert.equal(result.twitter?.title, 'Planos | PrestaCerto');
  }
});

test('unknown and inherited object keys are not valid city or category routes', () => {
  for (const slug of ['constructor', 'toString', '__proto__', 'cidade-inexistente']) {
    assert.equal(getLandingCity(slug), undefined);
    assert.equal(getLandingCategory(slug), undefined);
    assert.deepEqual(regionalDiscoveryPaths([profile], [service], [{ id: 1, slug }]), []);
  }
  assert.equal(getLandingCity('sao-paulo')?.state, 'SP');
  assert.equal(getLandingCategory('mobile')?.label, 'Desenvolvedor Mobile');
});
