import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickGh, ghFromUrl } from '../scripts/github-metadata.mjs';

test('github URL parsing', () => {
  assert.deepEqual(ghFromUrl('https://github.com/obra/superpowers'), { owner: 'obra', repo: 'superpowers' });
  assert.deepEqual(ghFromUrl('https://github.com/x/y.git#branch'), { owner: 'x', repo: 'y' });
  assert.equal(ghFromUrl('https://gitlab.com/x/y'), null);
  assert.equal(ghFromUrl(null), null);
});

test('rate-limited fetch → stars unknown with reason (never fabricated)', () => {
  const out = pickGh({ ok: false, error: 'rate-limited', starsReason: 'GitHub API rate limit reached' });
  assert.equal(out.stars, null);
  assert.equal(out.starsFetchedAt, null);
  assert.equal(out.error, 'rate-limited');
  assert.match(out.starsReason, /rate limit/i);
});

test('missing repo → stars unknown with reason', () => {
  const out = pickGh({ ok: false, error: 'not-found', starsReason: 'Repository does not exist or is private' });
  assert.equal(out.stars, null);
  assert.equal(out.error, 'not-found');
  assert.ok(out.starsReason);
});

test('stale cache used only when live fetch fails, with reason attached', () => {
  const out = pickGh({
    ok: false, error: 'rate-limited', starsReason: 'GitHub API rate limit reached',
    cachedStars: 42, cachedAt: '2026-01-01T00:00:00.000Z',
  });
  assert.equal(out.stars, 42);
  assert.equal(out.starsFetchedAt, '2026-01-01T00:00:00.000Z');
  assert.match(out.starsReason, /stale cache/);
});

test('successful fetch maps all fields', () => {
  const out = pickGh({
    ok: true, owner: 'a', repo: 'b', stars: 10, forks: 2, issues: 3,
    license: 'MIT', language: 'TS', lastCommit: '2026-09-01T00:00:00Z',
    latestRelease: 'v1.0.0', starsFetchedAt: '2026-09-23T00:00:00Z',
  });
  assert.equal(out.stars, 10);
  assert.equal(out.license, 'MIT');
  assert.equal(out.latestRelease, 'v1.0.0');
  assert.equal(out.error, null);
});
