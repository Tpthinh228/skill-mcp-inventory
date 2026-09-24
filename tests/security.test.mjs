import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { redactValue, redactHome, escapeHtml, sanitizeProbe } from './helpers.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'data', f), 'utf8'));

test('home paths are redacted', () => {
  const home = process.env.USERPROFILE || process.env.HOME;
  const out = redactHome(path.join(home, '.config', 'secret.key'));
  assert.ok(!out.includes(home.replace(/\\/g, '')) || out.startsWith('~'), 'home replaced');
  assert.ok(!/C:\\Users\\[^\\]+/i.test(out), 'no raw user path');
});

test('redactHome strips JSON-escaped Windows user paths', () => {
  const home = process.env.USERPROFILE || process.env.HOME || '';
  if (!home || !home.includes('\\')) return;
  const escaped = JSON.stringify({ command: `${home}\\AppData\\Local\\tool.exe` });
  const out = redactHome(escaped);
  assert.ok(!out.includes('Users'), `escaped home must be redacted: ${out}`);
  assert.ok(out.includes('~'), 'tilde form kept');
  assert.ok(!/C:\\+Users\\+/i.test(out), 'no Windows user path left');
});

test('secret-like keys are redacted', () => {
  const out = redactValue({
    API_KEY: 'abc', token: 't', password: 'p', command: 'npx foo',
    nested: { GITHUB_TOKEN: 'g', ok: 'v' },
  });
  assert.equal(out.API_KEY, '«redacted»');
  assert.equal(out.token, '«redacted»');
  assert.equal(out.password, '«redacted»');
  assert.equal(out.nested.GITHUB_TOKEN, '«redacted»');
  assert.equal(out.command, 'npx foo');
  assert.equal(out.nested.ok, 'v');
});

test('data files contain no secrets or raw home paths', () => {
  for (const f of ['skills.json', 'mcp.json', 'sources.json', 'meta.json', 'categories.json']) {
    const raw = fs.readFileSync(path.join(ROOT, 'public', 'data', f), 'utf8');
    const home = (process.env.USERPROFILE || '').replace(/\\/g, '\\');
    if (home) {
      // allow "~\" style only; raw C:\Users\<name> must not appear (plain or JSON-escaped)
      assert.ok(!raw.includes(process.env.USERPROFILE), `${f} must not contain raw userprofile`);
      assert.ok(!raw.includes(process.env.USERPROFILE.replace(/\\/g, '\\\\')), `${f} must not contain JSON-escaped userprofile`);
    }
    assert.ok(!/C:\\+Users\\+/i.test(raw), `${f} must not contain Windows user path`);
    assert.ok(!/(ghp_|github_pat_|sk-[A-Za-z0-9]{20,})/.test(raw), `${f} must not contain token-like strings`);
    assert.ok(!/"apiKey"\s*:\s*"(?!«redacted»)[^"]+"/.test(raw), `${f} must not contain apiKey values`);
  }
});

test('public payload has no absolute local paths or machine metadata', () => {
  const pub = path.join(ROOT, 'public', 'data');
  const patterns = [
    [/C:\\+Users\\+/i, 'raw Windows user path'],
    [/C:\\\//, 'raw drive root path'],
    [/\/Users\/[^/\s]+/, 'macOS user path'],
    [/\/home\/[^/\s]+/, 'Linux home path'],
    [/(ghp_|github_pat_|sk-[A-Za-z0-9]{20,})/, 'token-like string'],
    [/Bearer\s+[A-Za-z0-9._-]+/, 'bearer token'],
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  ];
  const pubFiles = ['skills.json', 'mcp.json', 'sources.json', 'meta.json', 'categories.json', 'purpose-vi.json'];
  for (const f of pubFiles) {
    const p = path.join(pub, f);
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, 'utf8');
    for (const [re, label] of patterns) {
      assert.ok(!re.test(raw), `public/${f} must not contain ${label}`);
    }
    if (process.env.USERPROFILE) {
      assert.ok(!raw.includes(process.env.USERPROFILE), `public/${f} must not contain raw userprofile`);
    }
  }
  const meta = JSON.parse(fs.readFileSync(path.join(pub, 'meta.json'), 'utf8'));
  assert.ok(!('os' in meta) && !('node' in meta), 'public meta must not expose machine os/node');
  assert.ok(!meta.skillRoots?.some(r => r.path), 'public meta skillRoots must not expose paths');
  const skills = JSON.parse(fs.readFileSync(path.join(pub, 'skills.json'), 'utf8'));
  for (const s of skills) {
    assert.ok(!('skillPath' in s) && !('paths' in s), `${s.id}: public skill must not expose skillPath/paths`);
    for (const loc of s.locations || []) assert.ok(!('path' in loc), `${s.id}: public location must not expose path`);
  }
  const sources = JSON.parse(fs.readFileSync(path.join(pub, 'sources.json'), 'utf8'));
  for (const r of sources.skillRoots || []) assert.ok(!r.path, 'public sources skillRoot must not expose path');
  const mcps = JSON.parse(fs.readFileSync(path.join(pub, 'mcp.json'), 'utf8'));
  for (const m of mcps) {
    if (m.command) assert.ok(!/[\\/]/.test(m.command) || !/Users|AppData|home/i.test(m.command), `${m.id}: command path sanitized`);
    if (m.configSnippet) assert.ok(!/C:\\+Users|AppData/i.test(m.configSnippet), `${m.id}: configSnippet sanitized`);
  }
});

test('escapeHtml neutralizes XSS payloads', () => {
  const payload = `<img src=x onerror="alert('1')">&lt;script&gt;`;
  const out = escapeHtml(payload);
  assert.ok(!out.includes('<img'), 'no raw tag');
  assert.ok(!out.includes('"'), 'quotes escaped');
  assert.ok(out.includes('&lt;img') || out.includes('&lt;'), 'escaped form present');
});

test('URL sanitizer rejects javascript: and data:', () => {
  assert.equal(sanitizeProbe('javascript:alert(1)'), null);
  assert.equal(sanitizeProbe('data:text/html,<script>'), null);
  assert.equal(sanitizeProbe('vbscript:x'), null);
  assert.ok(sanitizeProbe('https://github.com/obra/superpowers'));
});

test('descriptionInferred markers are flagged', () => {
  const mcp = read('mcp.json');
  for (const m of mcp) {
    if (m.descriptionInferred) assert.match(m.description, /inferred/i);
  }
});
