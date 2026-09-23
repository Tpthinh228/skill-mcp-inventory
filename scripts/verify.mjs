import path from 'node:path';
import { DATA_DIR, readJson, writeJson } from './lib.mjs';

const now = new Date().toISOString();

function verifyRecord(r, kind) {
  const sources = [];
  let level = 'unverified';
  const evidence = [];

  if (kind === 'skill') {
    const locs = r.locations || [];
    if (locs.some(l => l.hasSkillMd)) {
      evidence.push('SKILL.md present on disk');
      sources.push(...(r.sources || []));
      level = 'verified';
    }
    if (r.description) evidence.push('frontmatter description present');
    if (r.repoUrl) {
      if (r.github?.error) {
        evidence.push(`repo resolution failed: ${r.github.error}`);
        level = level === 'verified' ? 'partial' : level;
      } else {
        evidence.push('GitHub repo metadata fetched');
        sources.push(`github:${r.github.owner}/${r.github.repo}`);
      }
    }
    if (level === 'unverified' && evidence.length) level = 'partial';
  } else {
    sources.push(...(r.configPaths || [r.configPath]).map(p => `config:${p}`));
    evidence.push(`declared in ${r.hosts?.join(', ') || r.host || 'config'}`);
    if (r.command || r.url || r.configSnippet) {
      evidence.push('command/args present in config');
      level = 'verified';
    } else {
      level = 'partial';
    }
    if (r.packageUrl && !r.github?.error) evidence.push('package resolved via registry');
    if (r.github?.error === 'not-found') {
      evidence.push('repository could not be verified (404)');
      level = level === 'verified' ? 'partial' : level;
    }
    if (r.evidence?.enabled === false) evidence.push('explicitly disabled in config');
  }

  r.verification = {
    status: level,
    sources: [...new Set(sources)],
    evidence,
    lastVerified: now,
  };
  return r;
}

function main() {
  const skills = (readJson(path.join(DATA_DIR, 'skills.json'), []) || []).map(r => verifyRecord(r, 'skill'));
  const mcps = (readJson(path.join(DATA_DIR, 'mcp.json'), []) || []).map(r => verifyRecord(r, 'mcp'));
  writeJson(path.join(DATA_DIR, 'skills.json'), skills);
  writeJson(path.join(DATA_DIR, 'mcp.json'), mcps);
  const count = (list, s) => list.filter(r => r.verification.status === s).length;
  console.log(`verify: skills=${skills.length} (${count(skills, 'verified')} verified, ${count(skills, 'partial')} partial, ${count(skills, 'unverified')} unverified)`);
  console.log(`verify: mcp=${mcps.length} (${count(mcps, 'verified')} verified, ${count(mcps, 'partial')} partial, ${count(mcps, 'unverified')} unverified)`);
}

main();
