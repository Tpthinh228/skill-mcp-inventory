import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'data', f), 'utf8'));
const GH_RE = /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+$/;

test('no fake stars: stars are null or numbers with fetch timestamp', () => {
  const items = [...read('skills.json'), ...read('mcp.json')];
  for (const it of items) {
    const g = it.github;
    assert.ok(g, `${it.name}: github block exists`);
    if (typeof g.stars === 'number') {
      assert.ok(g.stars >= 0 && Number.isInteger(g.stars), `${it.name}: stars integer >= 0`);
      assert.ok(g.starsFetchedAt, `${it.name}: stars require starsFetchedAt`);
      assert.ok(g.owner && g.repo, `${it.name}: stars require owner/repo`);
      assert.equal(g.error, null, `${it.name}: stars present implies no error`);
    } else {
      assert.equal(g.stars, null, `${it.name}: non-number stars must be null (unknown)`);
      assert.ok(g.starsReason || g.error, `${it.name}: unknown stars must carry a reason`);
    }
  }
});

test('no fake repos: repoUrl must be valid https github URL or null', () => {
  const items = [...read('skills.json'), ...read('mcp.json')];
  for (const it of items) {
    if (it.repoUrl) assert.match(it.repoUrl, GH_RE, `${it.name}: repoUrl valid`);
    if (it.github.owner) assert.ok(it.github.repo, `${it.name}: owner implies repo`);
  }
});

test('no fake install commands: must derive from verified sources', () => {
  const skills = read('skills.json');
  for (const s of skills) {
    if (s.installCommand) {
      assert.match(s.installCommand, /^git clone https:\/\/github\.com\//, `${s.name}: skill install is git clone of verified repo`);
      assert.ok(s.repoUrl, `${s.name}: install implies repoUrl`);
    }
  }
  const mcp = read('mcp.json');
  for (const m of mcp) {
    if (m.installCommand) {
      assert.match(m.installCommand, /^(npx|uvx) /, `${m.name}: install from npx/uvx`);
      assert.ok(m.package, `${m.name}: install implies package`);
      // package must have been resolved (registry) or come from config args
      assert.ok(m.packageUrl || m.configSnippet || m.command, `${m.name}: package provenance`);
    } else {
      assert.ok(m.command || m.configSnippet, `${m.name}: no install command requires local config evidence`);
    }
  }
});

test('status values are from the allowed enum', () => {
  const allowedS = new Set(['installed', 'available', 'disabled', 'unknown']);
  const allowedM = new Set(['installed', 'configured', 'available', 'disabled', 'unknown']);
  for (const s of read('skills.json')) assert.ok(allowedS.has(s.status), `${s.name}: ${s.status}`);
  for (const m of read('mcp.json')) assert.ok(allowedM.has(m.status), `${m.name}: ${m.status}`);
});

test('verification status enum + lastVerified present after verify', () => {
  const allowed = new Set(['verified', 'partial', 'unverified']);
  for (const it of [...read('skills.json'), ...read('mcp.json')]) {
    assert.ok(allowed.has(it.verification.status), `${it.name}: ${it.verification.status}`);
    assert.ok(it.verification.lastVerified, `${it.name}: lastVerified set`);
    assert.ok(Array.isArray(it.verification.sources));
  }
});

test('effectiveness never derived from stars alone', () => {
  for (const it of [...read('skills.json'), ...read('mcp.json')]) {
    const ef = it.effectiveness;
    assert.ok(ef.framework, `${it.name}: framework declared`);
    assert.ok(Array.isArray(ef.basis) && ef.basis.length > 0, `${it.name}: basis non-empty`);
    if (ef.score == null) assert.equal(ef.level, 'unknown');
    if (ef.score != null) {
      assert.ok(ef.score >= 0 && ef.score <= 100, `${it.name}: score 0-100`);
      // components must exist for scored items
      assert.ok(ef.components, `${it.name}: components recorded`);
    }
  }
});

test('meta counts match data', () => {
  const meta = read('meta.json');
  const skills = read('skills.json');
  const mcp = read('mcp.json');
  assert.equal(meta.counts.skills, skills.length);
  assert.equal(meta.counts.mcp, mcp.length);
  assert.ok(meta.lastScan, 'lastScan present');
});
