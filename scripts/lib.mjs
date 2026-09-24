import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function readJson(p, fallback = null) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}
export function writeJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
export function exists(p) { try { fs.accessSync(p); return true; } catch { return false; } }

export function parseFrontmatter(text) {
  text = text.replace(/^﻿/, '');
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return { data: {}, body: text };
  const data = {};
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const c = line.indexOf(':');
    if (c <= 0) continue;
    const key = line.slice(0, c).trim();
    let val = line.slice(c + 1).trim();
    if (val === '>' || val === '|' || val === '>-' || val === '|-') {
      const block = [];
      let j = i + 1;
      while (j < lines.length && (/^\s+/.test(lines[j]) || lines[j] === '')) {
        block.push(lines[j]);
        j++;
      }
      i = j - 1;
      const folded = val.startsWith('>');
      const textVal = block
        .map(s => s.trim())
        .filter((s, idx, a) => !(s === '' && (idx === 0 || idx === a.length - 1)))
        .join(folded ? ' ' : '\n')
        .trim();
      if (val.endsWith('-')) data[key] = textVal.replace(/\s+$/, '');
      else data[key] = textVal;
      continue;
    }
    data[key] = val.replace(/^["']|["']$/g, '');
  }
  return { data, body: text.slice(m[0].length) };
}

export function redactHome(p) {
  if (!p || typeof p !== 'string') return p;
  const home = process.env.USERPROFILE || process.env.HOME || '';
  let out = p;
  if (home) {
    out = out.split(home).join('~');
    out = out.split(home.replace(/\\/g, '\\\\')).join('~');
  }
  return out
    .replace(/\/home\/[^/\s"']+/g, '~')
    .replace(/C:\\+Users\\+[^\\/"']+/gi, '~');
}

const SECRET_KEY = /(^|_)(api[_-]?key|key|token|secret|password|passwd|auth|authorization|credential|cookie|session)s?$/i;
export function redactValue(obj) {
  if (obj == null) return obj;
  if (typeof obj === 'string') return redactHome(obj);
  if (Array.isArray(obj)) return obj.map(redactValue);
  if (typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (SECRET_KEY.test(k) && typeof v === 'string' && v.length > 0) out[k] = '«redacted»';
      else out[k] = redactValue(v);
    }
    return out;
  }
  return obj;
}

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

export function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const CATEGORY_RULES = [
  ['Git / GitHub', /\bgit(hub)?\b|pull request|worktree|version control|git workflow/i],
  ['Security', /\bsecurity\b|secure cod|\bxss\b|\bauth\b|authenticat|authoriz|vulnerab|threat model|\bsecrets?\b|dependency audit|owasp|hardening/i],
  ['Browser / Web', /browser|chrome|scrap|web(page|site)?\b|\bcdp\b|screenshot|devtools|navigation|playwright|puppeteer/i],
  ['Office / Docs', /\bword\b|docx|\bexcel\b|xlsx|pptx|\boffice\b|officecli|\bpdf\b/i],
  ['DevOps / Infrastructure', /docker|kubernetes|\bk8s\b|ci\/cd|deploy|monitor|cloud|server management|infrastructure|pipeline|\bdevops\b|filesystem/i],
  ['3D / Creative', /blender|\b3d\b|model(ing)?\b|render|animation|shader|mesh|lighting/i],
  ['UI/UX', /\bui\b|\bux\b|design system|accessib|responsive|visual (design|identity)|frontend design|banner|\blogo\b|typography|\bbrand\b/i],
  ['Data', /\bsql\b|spreadsheet|\betl\b|data analys|visuali[sz]|chart/i],
  ['AI Agent', /\bagents?\b|\bskills?\b|prompt|planning|reasoning|orchestrat|context manag|memory|subagent|brainstorm|task decomposition|opencode|claude|codex/i],
  ['Development', /cod(e|ing)|refactor|debug|\btdd\b|architect|backend|frontend|node\.?js|\brust\b|python|typescript|\bapi\b|interface|implement|programm|lint|typecheck|simplif|code review|quality|\btests?\b/i],
  ['Research / Documentation', /research|technical documentation|report generat|summariz|spec-driven|\badrs?\b|knowledge/i],
];

export function classify(...parts) {
  const text = parts.filter(Boolean).join(' ');
  let best = null, bestScore = 0;
  for (const [cat, re] of CATEGORY_RULES) {
    const g = new RegExp(re.source, 'gi');
    let score = 0, m;
    while ((m = g.exec(text)) && score < 50) { score++; if (m[0] === '') g.lastIndex++; }
    if (score > bestScore) { bestScore = score; best = cat; }
  }
  return best || 'Other';
}

export function classifySubs(...parts) {
  const text = parts.filter(Boolean).join(' ').toLowerCase();
  const subs = [];
  const table = [
    ['coding', /cod(e|ing)|programm/], ['refactoring', /refactor/], ['debugging', /debug/],
    ['testing', /test/], ['tdd', /\btdd\b/], ['code review', /code review|review/],
    ['architecture', /architect/], ['frontend', /frontend/], ['backend', /backend/],
    ['Node.js', /node\.?js/], ['Rust', /rust/], ['Python', /python/], ['TypeScript', /typescript/],
    ['Git', /\bgit\b/], ['GitHub', /github/], ['worktree', /worktree/], ['PR', /pull request|\bpr\b/],
    ['commit', /commit/], ['release', /release/],
    ['planning', /plan/], ['reasoning workflow', /reason/], ['agent orchestration', /orchestr/],
    ['memory', /memory/], ['context management', /context/],
    ['accessibility', /accessib|a11y/], ['responsive UI', /responsive/], ['dashboard', /dashboard/],
    ['Docker', /docker/], ['CI/CD', /ci\/cd|pipeline/], ['deployment', /deploy/], ['monitoring', /monitor/],
    ['SQL', /\bsql\b/], ['data analysis', /data analys/], ['visualization', /visuali/],
    ['secure coding', /secure cod|hardening/], ['auth', /auth/], ['dependency audit', /audit|vulnerab/],
    ['secrets', /secret/], ['threat modeling', /threat/],
    ['Blender', /blender/], ['modeling', /model(ing)?\b/], ['rendering', /render/], ['animation', /animat/],
    ['web research', /research/], ['technical documentation', /document|docs?/], ['summarization', /summar/],
    ['browser automation', /browser|cdp|devtools/],
  ];
  for (const [name, re] of table) if (re.test(text)) subs.push(name);
  return subs.slice(0, 8);
}

export function emptyGithub() {
  return {
    owner: null, repo: null, stars: null, forks: null, issues: null, license: null,
    language: null, lastCommit: null, latestRelease: null, starsFetchedAt: null,
    error: null, starsReason: null,
  };
}
export function emptyEffectiveness() {
  return { score: null, level: 'unknown', confidence: 'low', basis: [], tested: false, testResult: null, components: null };
}

export function slugId(prefix, s) { return `${prefix}-${slug(s)}`; }
