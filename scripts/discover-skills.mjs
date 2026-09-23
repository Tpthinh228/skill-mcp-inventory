import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  DATA_DIR, readJson, writeJson, exists, parseFrontmatter, redactHome,
  classify, classifySubs, emptyGithub, emptyEffectiveness, slugId, slug,
} from './lib.mjs';

const errors = [];

function claudeMemSkillRoots() {
  const home = process.env.USERPROFILE || process.env.HOME || '';
  const base = path.join(home, '.codex', 'plugins', 'cache', 'claude-mem-local', 'claude-mem');
  if (!exists(base)) return [];
  try {
    return fs.readdirSync(base, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => path.join(base, e.name, 'skills'))
      .filter(s => exists(s))
      .map(s => ['codex plugins: claude-mem', s, 'global']);
  } catch { return []; }
}

function skillRoots() {
  const home = process.env.USERPROFILE || process.env.HOME || '';
  const roots = [
    ['.agents/skills (global)', path.join(home, '.agents', 'skills'), 'global'],
    ['.claude/skills (global)', path.join(home, '.claude', 'skills'), 'global'],
    ['.codex/skills (global)', path.join(home, '.codex', 'skills'), 'global'],
    ['.config/opencode/skills (global)', path.join(home, '.config', 'opencode', 'skills'), 'global'],
    ['.opencode/skills (global)', path.join(home, '.opencode', 'skills'), 'global'],
    ['.cursor/skills (global)', path.join(home, '.cursor', 'skills'), 'global'],
    // package-managed skill stores (superpowers, ponytail)
    ['opencode packages: superpowers', path.join(home, '.cache', 'opencode', 'packages', 'superpowers@git+https_', 'github.com', 'obra', 'superpowers.git', 'node_modules', 'superpowers', 'skills'), 'global'],
    ['opencode packages: ponytail', path.join(home, '.cache', 'opencode', 'packages', '@dietrichgebert', 'ponytail@latest', 'node_modules', '@dietrichgebert', 'ponytail', 'skills'), 'global'],
    // project-local
    ['.agents/skills (project)', path.join(process.cwd(), '.agents', 'skills'), 'project'],
    ['skills (project)', path.join(process.cwd(), 'skills'), 'project'],
    ['.claude/skills (project)', path.join(process.cwd(), '.claude', 'skills'), 'project'],
    ['.opencode/skills (project)', path.join(process.cwd(), '.opencode', 'skills'), 'project'],
    ['docs/skills (project)', path.join(process.cwd(), 'docs', 'skills'), 'project'],
    ...claudeMemSkillRoots(),
  ];
  return roots.filter(([, dir]) => exists(dir));
}

// Git-marketplace provenance (from codex config.toml marketplaces) — discovered config evidence
const KNOWN_REPOS = [
  { match: /superpowers/, repo: 'https://github.com/obra/superpowers', source: '~/.codex/config.toml marketplaces.superpowers-dev (git source)' },
  { match: /ponytail/, repo: 'https://github.com/DietrichGebert/ponytail', source: '~/.codex/config.toml marketplaces.ponytail (git source)' },
  { match: /^ui-ux-pro-max$/, repo: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill', source: 'user-provided provenance' },
  { match: /claude-mem/, repo: 'https://github.com/thedotmack/claude-mem', source: '~/.codex/config.toml marketplaces.claude-mem-local (git source)' },
  { match: /^officecli$/, repo: 'https://github.com/iOfficeAI/OfficeCLI', source: 'user-provided provenance' },
  { match: /^gitnexus-/, repo: 'https://github.com/abhigyanpatwari/GitNexus', source: 'user-provided provenance' },
  { match: /^agent-reach$/, repo: 'https://github.com/Panniantong/agent-reach', source: 'user-provided provenance' },
  { match: /^browser-use$/, repo: 'https://github.com/browser-use/browser-use', source: 'user-provided provenance' },
  { match: /^agency-agents$/, repo: 'https://github.com/msitarzewski/agency-agents', source: 'user-provided provenance' },
  // addyosmani/agent-skills — 24 of 25 pack skills (tdd omitted: package path already maps to superpowers)
  {
    match: /^(using-agent-skills|interview-me|idea-refine|spec-driven-development|constraint-driven-development|planning-and-task-breakdown|incremental-implementation|context-engineering|source-driven-development|doubt-driven-development|frontend-ui-engineering|api-and-interface-design|browser-testing-with-devtools|debugging-and-error-recovery|code-review-and-quality|code-simplification|security-and-hardening|performance-optimization|git-workflow-and-versioning|ci-cd-and-automation|deprecation-and-migration|documentation-and-adrs|observability-and-instrumentation|shipping-and-launch)$/,
    repo: 'https://github.com/addyosmani/agent-skills',
    source: 'user-provided provenance',
  },
];

function discoverOne(dir, rootLabel, scope) {
  const md = path.join(dir, 'SKILL.md');
  const name = path.basename(dir);
  if (!exists(md)) {
    return { name, missingSkillMd: true, dir, rootLabel, scope };
  }
  let text = '';
  try { text = fs.readFileSync(md, 'utf8'); } catch (e) {
    errors.push(`read failed: ${redactHome(md)}: ${e.message}`);
    return { name, missingSkillMd: true, dir, rootLabel, scope };
  }
  const { data, body } = parseFrontmatter(text);
  const display = data.name || name;
  const description = data.description || '';
  const purpose = description.split('.')[0] || description || `Skill: ${display}`;
  const category = classify(display, description, body.slice(0, 800));
  const subcategories = classifySubs(display, description);
  const hasUsage = /##\s*(usage|how to use|examples?|when to use)/i.test(body);
  const hasInstall = /##\s*(install|setup|getting started)/i.test(body);
  let repoUrl = null, repoSource = null;
  for (const k of KNOWN_REPOS) {
    if (k.match.test(display) || k.match.test(rootLabel)) { repoUrl = k.repo; repoSource = k.source; break; }
  }
  const scopePath = redactHome(dir);
  const parent = rootLabel.startsWith('opencode packages: ')
    ? rootLabel.slice('opencode packages: '.length)
    : rootLabel.startsWith('codex plugins: ')
      ? rootLabel.slice('codex plugins: '.length)
      : null;
  return {
    name: display,
    skillDirName: name,
    description,
    purpose,
    category,
    subcategories,
    skillPath: scopePath,
    rootLabel,
    parent,
    scope,
    hasSkillMd: true,
    bodyLength: body.trim().length,
    hasUsage,
    hasInstall,
    frontmatterName: data.name || null,
    repoUrl,
    repoSource,
    bodyExcerpt: body.trim().slice(0, 400),
  };
}

function main() {
  const found = [];
  for (const [label, dir, scope] of skillRoots()) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch (e) { errors.push(`list failed: ${redactHome(dir)}: ${e.message}`); continue; }
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      if (ent.name.startsWith('.')) continue;
      found.push(discoverOne(path.join(dir, ent.name), label, scope));
    }
  }

  // dedupe by skill dir name → merge locations
  const map = new Map();
  for (const f of found) {
    const key = slug(f.skillDirName || f.name);
    if (!map.has(key)) {
      map.set(key, {
        id: slugId('skill', key),
        name: f.name,
        displayName: f.name,
        category: f.category || 'Other',
        subcategories: f.subcategories || [],
        purpose: f.purpose || '',
        description: f.description || '',
        status: f.missingSkillMd ? 'unknown' : 'installed',
        scope: f.scope,
        sourceType: f.repoUrl ? 'github' : 'local',
        repoUrl: f.repoUrl || null,
        docsUrl: null,
        packageUrl: null,
        installCommand: null,
        usageExample: null,
        skillPath: f.skillPath || null,
        parent: f.parent || null,
        paths: [],
        locations: [],
        version: null,
        github: { ...emptyGithub(), ...(f.repoUrl ? parseGithub(f.repoUrl) : {}) },
        githubSource: f.repoSource || null,
        evidence: {
          hasSkillMd: !!f.hasSkillMd,
          hasUsage: !!f.hasUsage,
          hasInstall: !!f.hasInstall,
          bodyLength: f.bodyLength || 0,
          descriptionPresent: !!f.description,
        },
        descriptionExcerpt: f.bodyExcerpt || '',
        effectiveness: emptyEffectiveness(),
        tags: f.subcategories || [],
        sources: [f.rootLabel],
        verification: { status: f.missingSkillMd ? 'unverified' : 'verified', sources: [f.rootLabel], lastVerified: null },
        _rawMissing: !!f.missingSkillMd,
      });
      const r = map.get(key);
      r.paths.push(f.skillPath);
      r.locations.push({ path: f.skillPath, root: f.rootLabel, scope: f.scope, hasSkillMd: !f.missingSkillMd });
      if (r.locations.length > 1) r.scope = 'both';
      if (!r.description && f.description) { r.description = f.description; r.purpose = f.purpose; }
      if (f.repoUrl && !r.repoUrl) { r.repoUrl = f.repoUrl; r.githubSource = f.repoSource; r.github = { ...emptyGithub(), ...parseGithub(f.repoUrl) }; r.sourceType = 'github'; }
    } else {
      const r = map.get(key);
      r.paths.push(f.skillPath);
      r.locations.push({ path: f.skillPath, root: f.rootLabel, scope: f.scope, hasSkillMd: !f.missingSkillMd });
      if (r.locations.length > 1) r.scope = 'both';
      if (!r.sources.includes(f.rootLabel)) r.sources.push(f.rootLabel);
      if (f.parent && !r.parent) r.parent = f.parent;
      if (f.repoUrl && !r.repoUrl) { r.repoUrl = f.repoUrl; r.githubSource = f.repoSource; r.github = { ...emptyGithub(), ...parseGithub(f.repoUrl) }; r.sourceType = 'github'; }
    }
  }

  const skills = [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  for (const s of skills) {
    if (s._rawMissing && s.locations.every(l => !l.hasSkillMd)) s.status = 'unknown';
    else if (s.locations.some(l => l.hasSkillMd)) s.status = 'installed';
    delete s._rawMissing;
    s.installCommand = s.repoUrl ? `git clone ${s.repoUrl}.git` : null;
  }

  writeJson(path.join(DATA_DIR, 'skills.json'), skills);
  writeJson(path.join(DATA_DIR, 'scan-errors.json'), {
    lastScan: new Date().toISOString(),
    os: `${os.type()} ${os.release()}`,
    node: process.version,
    errors,
    skillRootsUsed: skillRoots().map(([label, dir]) => ({ label, path: redactHome(dir) })),
  });
  console.log(`skills discovered: ${skills.length} (raw entries: ${found.length}), errors: ${errors.length}`);
}

function parseGithub(url) {
  const m = /github\.com\/([^/]+)\/([^/#?]+)/.exec(url || '');
  return m ? { owner: m[1], repo: m[2].replace(/\.git$/, '') } : {};
}

main();
