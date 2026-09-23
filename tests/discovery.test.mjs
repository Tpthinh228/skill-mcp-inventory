import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter, classify, slug } from '../scripts/lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'));

test('frontmatter parses name/description', () => {
  const { data, body } = parseFrontmatter('---\nname: foo\ndescription: does bar\n---\n# Hi');
  assert.equal(data.name, 'foo');
  assert.equal(data.description, 'does bar');
  assert.match(body, /# Hi/);
});

test('frontmatter unfolds folded description (yaml >)', () => {
  const src = [
    '---',
    'name: ponytail',
    'description: >',
    '  Forces the laziest solution that actually works, simplest, shortest, most',
    '  minimal. Channels a senior dev.',
    '---',
    'body',
  ].join('\n');
  const { data } = parseFrontmatter(src);
  assert.ok(data.description.startsWith('Forces the laziest solution'), data.description);
  assert.notEqual(data.description, '>');
  const purpose = data.description.split('.')[0];
  assert.ok(purpose.length > 10, purpose);
});

test('classification by content, not filename', () => {
  assert.equal(classify('x', 'guides git worktree usage'), 'Git / GitHub');
  assert.equal(classify('x', 'fix XSS and harden auth'), 'Security');
  assert.equal(classify('chrome-devtools-mcp', 'browser cdp'), 'Browser / Web');
  assert.equal(classify('random-thing-no-match-xyz'), 'Other');
});

test('discovery found skills with deduped locations', () => {
  const skills = read('skills.json');
  assert.ok(skills.length > 0, 'must discover skills');
  const ids = new Set(skills.map(s => s.id));
  assert.equal(ids.size, skills.length, 'ids unique');
  for (const s of skills) {
    assert.ok(s.name, 'name present');
    assert.ok(s.category, 'category present');
    assert.ok(Array.isArray(s.locations) && s.locations.length > 0, 'has locations');
    assert.ok(s.verification.status, 'has verification');
  }
  // duplicate skill present in multiple roots should be one record with >1 location
  const multi = skills.filter(s => s.locations.length > 1);
  assert.ok(multi.length > 0, 'expected at least one skill discovered in multiple roots');
});

test('discovery found MCP servers from real configs', () => {
  const mcp = read('mcp.json');
  assert.ok(mcp.length > 0, 'must discover MCP servers');
  const names = mcp.map(m => m.name);
  assert.equal(new Set(names).size, names.length, 'no duplicate server names');
  assert.ok(!names.some(n => n.includes('.env')), 'nested [mcp_servers.x.env] tables must not become servers');
  for (const m of mcp) {
    assert.ok(m.transport, 'transport declared');
    assert.ok(['stdio', 'sse', 'streamable-http', 'unknown'].includes(m.transport), `transport valid: ${m.transport}`);
    assert.ok((m.configPaths || []).length > 0, 'config path recorded');
    assert.ok(m.description, 'description present (may be inferred)');
  }
});

test('category classification coverage', () => {
  const skills = read('skills.json');
  const mcp = read('mcp.json');
  for (const it of [...skills, ...mcp]) {
    assert.ok(it.category && it.category.length > 0, `${it.name} has category`);
  }
  const cats = read('categories.json');
  const sum = cats.reduce((a, c) => a + c.total, 0);
  assert.equal(sum, skills.length + mcp.length, 'category totals match');
});
