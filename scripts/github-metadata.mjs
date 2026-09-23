import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { DATA_DIR, readJson, writeJson, redactHome } from './lib.mjs';

const GH_API = 'https://api.github.com';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || null;
const errors = [];
const notes = [];

const cache = readJson(path.join(DATA_DIR, 'github-cache.json'), { entries: {} });
if (!cache.entries) cache.entries = {};

function headers() {
  const h = { Accept: 'application/vnd.github+json', 'User-Agent': 'skill-mcp-inventory-scan' };
  if (TOKEN) h.Authorization = `Bearer ${TOKEN}`;
  return h;
}

async function gh(pathname) {
  const res = await fetch(GH_API + pathname, { headers: headers() });
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get('x-ratelimit-remaining');
    const err = new Error(`rate limited (HTTP ${res.status}, remaining=${remaining})`);
    err.rateLimited = true;
    throw err;
  }
  if (res.status === 404) { const e = new Error('not found (404)'); e.notFound = true; throw e; }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchRepo(owner, repo) {
  const key = `${owner}/${repo}`.toLowerCase();
  const hit = cache.entries[key];
  if (hit && Date.now() - Date.parse(hit.fetchedAt) < CACHE_TTL_MS && hit.ok) {
    return { ...hit, cached: true };
  }
  try {
    const [meta, release] = await Promise.all([
      gh(`/repos/${owner}/${repo}`),
      gh(`/repos/${owner}/${repo}/releases/latest`).catch(() => null),
    ]);
    const entry = {
      ok: true,
      owner: meta.owner.login,
      repo: meta.name,
      stars: meta.stargazers_count,
      forks: meta.forks_count,
      issues: meta.open_issues_count,
      license: meta.license?.spdx_id || null,
      language: meta.language,
      lastCommit: meta.pushed_at,
      latestRelease: release?.tag_name || null,
      starsFetchedAt: new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
      htmlUrl: meta.html_url,
      description: meta.description,
      archived: meta.archived,
      error: null,
    };
    cache.entries[key] = entry;
    return entry;
  } catch (e) {
    const prev = cache.entries[key];
    const entry = {
      ok: false,
      error: e.rateLimited ? 'rate-limited' : (e.notFound ? 'not-found' : e.message),
      stars: null,
      starsReason: e.rateLimited ? 'GitHub API rate limit reached'
        : e.notFound ? 'Repository does not exist or is private'
        : `GitHub API error: ${e.message}`,
      starsFetchedAt: null,
      fetchedAt: new Date().toISOString(),
      cachedAt: prev?.starsFetchedAt || null,
      cachedStars: prev?.ok ? prev.stars : null,
    };
    errors.push({ repo: key, error: entry.error });
    return entry;
  }
}

// Resolve npm/pypi package → repository URL (verifiable source: registry metadata)
async function resolvePackage(pkg, pm) {
  const key = `pkg:${pm}:${pkg}`.toLowerCase();
  const hit = cache.entries[key];
  if (hit && Date.now() - Date.parse(hit.fetchedAt) < CACHE_TTL_MS && hit.ok) return { ...hit, cached: true };
  try {
    let repoUrl = null, packageUrl = null, version = null;
    const base = pkg.replace(/@(latest|next|beta|alpha|canary|rc|dev)$/i, '');
    if (pm === 'npm') {
      const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(base).replace('%40', '@')}/latest`);
      if (!res.ok) throw new Error(`npm registry HTTP ${res.status}`);
      const j = await res.json();
      version = j.version || null;
      packageUrl = `https://www.npmjs.com/package/${base}`;
      const r = typeof j.repository === 'string' ? j.repository : j.repository?.url;
      if (r) repoUrl = String(r).replace(/^git\+/, '').replace(/\.git$/, '').replace(/^git:\/\//, 'https://');
    } else if (pm === 'pypi') {
      const res = await fetch(`https://pypi.org/pypi/${pkg}/json`);
      if (!res.ok) throw new Error(`pypi HTTP ${res.status}`);
      const j = await res.json();
      version = j.info?.version || null;
      packageUrl = `https://pypi.org/project/${pkg}/`;
      const r = j.info?.project_urls?.Homepage || j.info?.project_urls?.Source || j.info?.home_page || j.info?.project_url;
      if (r && /^https?:/.test(r)) repoUrl = r;
      if (repoUrl && /pypi\.org\/project/.test(repoUrl)) repoUrl = null;
    } else return null;
    const entry = { ok: true, repoUrl, packageUrl, version, fetchedAt: new Date().toISOString() };
    cache.entries[key] = entry;
    return entry;
  } catch (e) {
    const entry = { ok: false, error: e.message, repoUrl: null, packageUrl: null, version: null, fetchedAt: new Date().toISOString() };
    errors.push({ package: `${pm}:${pkg}`, error: e.message });
    return entry;
  }
}

function ghFromUrl(url) {
  const m = /github\.com\/([^/]+)\/([^/#?]+)/.exec(url || '');
  return m ? { owner: m[1], repo: m[2].replace(/\.git$/, '') } : null;
}

async function main() {
  const skills = readJson(path.join(DATA_DIR, 'skills.json'), []) || [];
  const mcps = readJson(path.join(DATA_DIR, 'mcp.json'), []) || [];

  // 1) resolve packages for MCPs (skip local binaries without package)
  for (const m of mcps) {
    if (m.package && m.packageManager) {
      const p = await resolvePackage(m.package, m.packageManager);
      if (p?.ok) {
        if (!m.packageUrl) m.packageUrl = p.packageUrl;
        if (p.version) m.version = p.version;
        if (p.repoUrl && ghFromUrl(p.repoUrl)) {
          m.repoUrl = m.repoUrl || p.repoUrl;
          m.githubSource = `package registry (${m.packageManager}): ${m.package}`;
        }
      } else if (p) {
        m.packageResolveError = p.error;
      }
    }
    if (m.repoUrl) {
      const g = ghFromUrl(m.repoUrl);
      if (g) {
        const meta = await fetchRepo(g.owner, g.repo);
        m.github = { ...m.github, ...pickGh(meta) };
        m.githubSource = m.githubSource || `repo from config (${m.host})`;
        if (!meta.ok && meta.error === 'rate-limited') notes.push('GitHub rate limit hit; some stars unknown.');
      }
    } else {
      m.github.error = m.github.error || 'no-repo';
      m.github.starsReason = m.github.starsReason || 'No public repository could be resolved from verified sources.';
    }
  }

  // 2) skills: repo from repoUrl (git marketplace evidence)
  for (const s of skills) {
    if (s.repoUrl) {
      const g = ghFromUrl(s.repoUrl);
      if (g) {
        const meta = await fetchRepo(g.owner, g.repo);
        s.github = { ...s.github, ...pickGh(meta) };
        if (!meta.ok) s.github.error = meta.error;
      }
    } else {
      s.github.error = s.github.error || 'no-repo';
      s.github.starsReason = s.github.starsReason || 'No public repository identified for this skill location.';
    }
  }

  writeJson(path.join(DATA_DIR, 'skills.json'), skills);
  writeJson(path.join(DATA_DIR, 'mcp.json'), mcps);
  writeJson(path.join(DATA_DIR, 'github-cache.json'), cache);
  writeJson(path.join(DATA_DIR, 'github-errors.json'), {
    lastRun: new Date().toISOString(), errors, notes,
    rateLimited: errors.some(e => e.error === 'rate-limited'),
    authenticated: !!TOKEN,
  });
  const withStars = [...skills, ...mcps].filter(x => typeof x.github?.stars === 'number').length;
  console.log(`github metadata: ${withStars} items with verified stars; errors: ${errors.length}`);
}

function pickGh(meta) {
  if (!meta.ok) return {
    stars: null, starsFetchedAt: null, error: meta.error, starsReason: meta.starsReason,
    ...(meta.cachedStars != null ? { stars: meta.cachedStars, starsFetchedAt: meta.cachedAt, starsReason: 'stale cache (live fetch failed)' } : {}),
  };
  return {
    owner: meta.owner, repo: meta.repo, stars: meta.stars, forks: meta.forks, issues: meta.issues,
    license: meta.license, language: meta.language, lastCommit: meta.lastCommit,
    latestRelease: meta.latestRelease, starsFetchedAt: meta.starsFetchedAt,
    description: meta.description || null,
    htmlUrl: meta.htmlUrl || null,
    error: null, starsReason: null,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(e => { console.error(e); process.exit(1); });
}

export { pickGh, ghFromUrl };
