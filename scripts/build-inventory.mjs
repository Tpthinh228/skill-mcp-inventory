import path from 'node:path';
import fs from 'node:fs';
import { ROOT, DATA_DIR, readJson, writeJson, redactHome, redactValue } from './lib.mjs';

// Effectiveness framework: score ONLY from evidenced components.
// Reliability 0-30, Documentation 0-25, Maintenance 0-20, Compatibility 0-10, Practical 0-15
// Stars are NEVER an input.

function scoreRecord(r, kind) {
  const basis = [];
  let reliability = 0, documentation = 0, maintenance = 0, compatibility = 0, practical = 0;
  let maxPossible = 100;
  let componentsAvailable = 5;

  // Reliability
  if (kind === 'skill') {
    if ((r.locations || []).some(l => l.hasSkillMd)) { reliability = 30; basis.push('skill file present on disk (installed)'); }
    else if ((r.locations || []).length) { reliability = 10; basis.push('directory found but SKILL.md missing'); }
    if (r.status === 'unknown') { reliability = Math.min(reliability, 10); }
  } else {
    if (r.status === 'configured' || r.status === 'installed') { reliability = 30; basis.push('valid server entry found in tool config'); }
    else if (r.status === 'disabled') { reliability = 10; basis.push('server present but disabled'); }
    if (r.command || r.configSnippet) { basis.push('command/args declared'); }
    else { reliability = Math.min(reliability, 15); basis.push('no runnable command resolved'); }
  }

  // Documentation
  const ev = r.evidence || {};
  if (kind === 'skill') {
    if (ev.descriptionPresent) { documentation += 8; basis.push('description present'); }
    if (ev.hasUsage) { documentation += 10; basis.push('usage/when-to-use section present'); }
    if (ev.hasInstall) { documentation += 7; basis.push('install section present'); }
    if (r.docsUrl) { documentation = Math.max(documentation, 20); }
  } else {
    if (r.packageUrl) { documentation += 10; basis.push('package page resolvable'); }
    if (r.docsUrl) { documentation += 10; }
    if (r.configSnippet || r.command) { documentation += 5; basis.push('config sample derivable from local config'); }
    if (r.repoUrl) documentation += 5;
  }
  documentation = Math.min(25, documentation);

  // Maintenance (repo evidence only — no repo ⇒ component unavailable, not zeroed)
  if (r.github?.lastCommit && !r.github.error) {
    const days = (Date.now() - Date.parse(r.github.lastCommit)) / 86400000;
    maintenance = days <= 90 ? 20 : days <= 180 ? 14 : days <= 365 ? 8 : 3;
    basis.push(`last push ${new Date(r.github.lastCommit).toISOString().slice(0, 10)}`);
    if (r.github.latestRelease) { maintenance = Math.min(20, maintenance + 2); basis.push(`release ${r.github.latestRelease}`); }
  } else {
    componentsAvailable--;
    maxPossible -= 20;
    basis.push('maintenance: no verified repo activity data');
  }

  // Compatibility
  if (kind === 'mcp') {
    if (r.verification.status === 'verified') { compatibility = 10; basis.push('MCP config verified against known schema'); }
    else { compatibility = 5; basis.push('MCP config partially verified'); }
    if (r.status === 'disabled') compatibility = Math.min(compatibility, 5);
  } else {
    if (r.verification.status === 'verified') { compatibility = 10; basis.push('skill structure verified'); }
    else { compatibility = 5; }
  }

  // Practical validation
  if (r.smokeTest?.passed) { practical = 15; basis.push('smoke test passed'); }
  else if (ev.hasUsage || r.usageExample) { practical = 5; basis.push('usage example available (not executed)'); }
  else { practical = 0; basis.push('no test/demo evidence'); }

  const score = Math.round(((reliability + documentation + maintenance + compatibility + practical) / maxPossible) * 100);
  const tested = !!r.smokeTest?.passed;
  const hasRepoData = !!(r.github?.lastCommit && !r.github.error);

  let level, confidence;
  if (score >= 75 && (hasRepoData || tested)) { level = 'high'; confidence = (hasRepoData && r.verification.status === 'verified') ? 'high' : 'medium'; }
  else if (score >= 50) { level = 'medium'; confidence = 'medium'; }
  else if (r.verification.status === 'unverified' && !hasRepoData && !tested) { level = 'unknown'; confidence = 'low'; }
  else { level = 'low'; confidence = 'low'; }

  if (level === 'unknown') {
    return {
      score: null, level: 'unknown', confidence: 'low',
      basis: ['not tested', 'insufficient verified evidence'],
      tested, testResult: r.smokeTest?.result || null,
      components: { reliability, documentation, maintenance, compatibility, practical, maxPossible, componentsAvailable },
      framework: 'v1 (reliability30+docs25+maintenance20+compat10+practical15; stars excluded)',
    };
  }

  return {
    score, level, confidence, basis,
    tested, testResult: r.smokeTest?.result || null,
    components: { reliability, documentation, maintenance, compatibility, practical, maxPossible, componentsAvailable },
    framework: 'v1 (reliability30+docs25+maintenance20+compat10+practical15; stars excluded)',
  };
}

function smokeTestMcp(r) {
  // Safe local smoke test: does the declared command/runner exist on PATH?
  // Never executes commands from JSON data.
  return null; // documented as not executed — no fabricated results
}

// Public payload only: drop local machine fields, keep site-needed public data.
function sanitizeSkillForPublic(s) {
  const out = { ...s };
  delete out.skillPath;
  delete out.paths;
  out.locations = (s.locations || []).map(({ path: _p, ...rest }) => rest);
  out.sources = (s.sources || []).map(redactHome);
  if (out.verification) out.verification = {
    ...out.verification,
    sources: (out.verification.sources || []).map(redactHome),
  };
  return redactValue(out);
}

function basenamePath(v) {
  if (/^[A-Za-z]:[\\/]*$|^\\\\+$|^\/+$/.test(String(v))) return '.';
  const parts = String(v).split(/[\\/]/).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : v;
}

function sanitizeSnippetPaths(v) {
  if (typeof v === 'string') {
    if (/^[A-Za-z]:[\\/]|^\\\\|^\/|~[\\/]|AppData|Users[\\/]|\/home\/|\/Users\//.test(v)) return basenamePath(v);
    return redactHome(v);
  }
  if (Array.isArray(v)) return v.map(sanitizeSnippetPaths);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, sanitizeSnippetPaths(val)]));
  }
  return v;
}

function sanitizeMcpForPublic(m) {
  const out = redactValue({ ...m });
  if (out.command && /[\\/]/.test(out.command)) out.command = basenamePath(out.command);
  if (Array.isArray(out.args)) {
    out.args = out.args.map(a => (typeof a === 'string' && /[\\/]/.test(a) && a.length > 2 ? basenamePath(a) : redactHome(a)));
  }
  if (out.configSnippet) {
    try { out.configSnippet = JSON.stringify(sanitizeSnippetPaths(JSON.parse(out.configSnippet))); }
    catch { out.configSnippet = redactHome(out.configSnippet); }
    if (/C:\\Users|AppData|\/home\/|\/Users\//i.test(out.configSnippet)) out.configSnippet = null;
  }
  return out;
}

function sanitizeMetaForPublic(meta) {
  const { os: _os, node: _node, skillRoots: _roots, ...rest } = meta;
  return rest;
}

function sanitizeSourcesForPublic(sources) {
  return {
    ...sources,
    skillRoots: (sources.skillRoots || []).map(({ label }) => ({ label })),
  };
}

function main() {
  const allSkills = readJson(path.join(DATA_DIR, 'skills.json'), []) || [];
  // Publish only skills with a verified repo/install link; keep the rest for offline analysis.
  const skills = allSkills.filter(s => s.repoUrl);
  const excluded = allSkills.filter(s => !s.repoUrl);
  writeJson(path.join(DATA_DIR, 'skills-no-repo.json'), excluded);
  const SKIP_MCP = new Set(['node_repl', 'filesystem']);
  const mcps = (readJson(path.join(DATA_DIR, 'mcp.json'), []) || [])
    .filter(m => !SKIP_MCP.has(m.name) && m.id !== 'mcp-node-repl' && m.id !== 'mcp-filesystem');
  const now = new Date().toISOString();

  for (const s of skills) s.effectiveness = scoreRecord(s, 'skill');
  for (const m of mcps) { smokeTestMcp(m); m.effectiveness = scoreRecord(m, 'mcp'); }

  // categories aggregate
  const cats = {};
  const bump = (name, kind) => {
    if (!cats[name]) cats[name] = { name, skills: 0, mcp: 0, total: 0, verified: 0 };
    cats[name][kind]++;
    cats[name].total++;
  };
  for (const s of skills) { bump(s.category, 'skills'); if (s.verification.status === 'verified') cats[s.category].verified++; }
  for (const m of mcps) { bump(m.category, 'mcp'); if (m.verification.status === 'verified') cats[m.category].verified++; }
  const categories = Object.values(cats).sort((a, b) => b.total - a.total);

  const scan = readJson(path.join(DATA_DIR, 'scan-errors.json'), {});
  const ghErr = readJson(path.join(DATA_DIR, 'github-errors.json'), {});

  const meta = {
    lastScan: scan.lastScan || now,
    lastBuilt: now,
    lastGithubSync: ghErr.lastRun || null,
    os: scan.os || null,
    node: scan.node || null,
    githubAuthenticated: !!ghErr.authenticated,
    githubRateLimited: !!ghErr.rateLimited,
    scanErrors: scan.errors || [],
    mcpScanErrors: (readJson(path.join(DATA_DIR, 'scan-errors-mcp.json'), {}) || {}).errors || [],
    githubErrors: ghErr.errors || [],
    skillRoots: scan.skillRootsUsed || [],
    counts: {
      skills: skills.length,
      skillsExcludedNoRepo: excluded.length,
      skillsInstalled: skills.filter(s => s.status === 'installed').length,
      mcp: mcps.length,
      mcpConfigured: mcps.filter(m => m.status === 'configured').length,
      categories: categories.length,
      reposVerified: [...skills, ...mcps].filter(x => x.github?.owner && !x.github?.error).length,
      reposUnverified: [...skills, ...mcps].filter(x => !x.github?.owner || x.github?.error).length,
      verified: [...skills, ...mcps].filter(x => x.verification.status === 'verified').length,
      partial: [...skills, ...mcps].filter(x => x.verification.status === 'partial').length,
      unverified: [...skills, ...mcps].filter(x => x.verification.status === 'unverified').length,
      tested: [...skills, ...mcps].filter(x => x.effectiveness.tested).length,
      withStars: [...skills, ...mcps].filter(x => typeof x.github?.stars === 'number').length,
    },
  };

  const sources = {
    lastBuilt: now,
    skillRoots: meta.skillRoots,
    mcpConfigs: [
      ...new Set([...mcps.flatMap(m => m.configPaths || [m.configPath]).filter(Boolean)]),
    ],
    registryApis: ['https://registry.npmjs.org', 'https://pypi.org/pypi/<pkg>/json'],
    githubApi: 'https://api.github.com/repos/<owner>/<repo>',
    notes: [
      'All values are produced by local scan scripts; nothing is hardcoded.',
      'GitHub stars fetched only for repos resolved from config git sources or package registry metadata.',
      'Token (if any) is read from environment at runtime and never written to data files.',
    ],
  };

  writeJson(path.join(DATA_DIR, 'skills.json'), skills);
  writeJson(path.join(DATA_DIR, 'skills-no-repo.json'), excluded);
  writeJson(path.join(DATA_DIR, 'mcp.json'), mcps);
  writeJson(path.join(DATA_DIR, 'categories.json'), categories);
  writeJson(path.join(DATA_DIR, 'sources.json'), sources);
  writeJson(path.join(DATA_DIR, 'meta.json'), meta);

  // expose data to static site (privacy-sanitized public payload)
  const pubData = path.join(ROOT, 'public', 'data');
  fs.mkdirSync(pubData, { recursive: true });
  const publicPayload = {
    'skills.json': skills.map(sanitizeSkillForPublic),
    'mcp.json': mcps.map(sanitizeMcpForPublic),
    'categories.json': categories,
    'sources.json': sanitizeSourcesForPublic(sources),
    'meta.json': sanitizeMetaForPublic(meta),
  };
  for (const [f, data] of Object.entries(publicPayload)) {
    writeJson(path.join(pubData, f), data);
  }
  console.log(`build: ${meta.counts.skills} skills (${excluded.length} no-repo excluded), ${meta.counts.mcp} mcp, ${meta.counts.categories} categories`);
}

main();
