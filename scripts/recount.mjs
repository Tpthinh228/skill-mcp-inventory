import path from 'node:path';
import { ROOT, readJson, writeJson } from './lib.mjs';

// Recompute meta.counts + categories.json from the hand-edited public data files.
// Run after editing public/data/skills.json or public/data/mcp.json: npm run recount
const PUB = path.join(ROOT, 'public', 'data');

const skills = readJson(path.join(PUB, 'skills.json'), []) || [];
const mcps = readJson(path.join(PUB, 'mcp.json'), []) || [];

const cats = {};
const bump = (name, kind) => {
  if (!cats[name]) cats[name] = { name, skills: 0, mcp: 0, total: 0, verified: 0 };
  cats[name][kind]++;
  cats[name].total++;
};
const isVerified = x => x.verification?.status === 'verified';
for (const s of skills) {
  const c = s.category || 'Other';
  bump(c, 'skills');
  if (isVerified(s)) cats[c].verified++;
}
for (const m of mcps) {
  const c = m.category || 'Other';
  bump(c, 'mcp');
  if (isVerified(m)) cats[c].verified++;
}
const categories = Object.values(cats).sort((a, b) => b.total - a.total);
writeJson(path.join(PUB, 'categories.json'), categories);

const all = [...skills, ...mcps];
const meta = readJson(path.join(PUB, 'meta.json'), {});
meta.counts = {
  ...(meta.counts || {}),
  skills: skills.length,
  skillsInstalled: skills.filter(s => s.status === 'installed').length,
  mcp: mcps.length,
  mcpConfigured: mcps.filter(m => m.status === 'configured').length,
  categories: categories.length,
  reposVerified: all.filter(x => x.github?.owner && !x.github?.error).length,
  reposUnverified: all.filter(x => !x.github?.owner || x.github?.error).length,
  verified: all.filter(isVerified).length,
  partial: all.filter(x => x.verification?.status === 'partial').length,
  unverified: all.filter(x => x.verification?.status === 'unverified').length,
  tested: all.filter(x => x.effectiveness?.tested).length,
  withStars: all.filter(x => typeof x.github?.stars === 'number').length,
};
writeJson(path.join(PUB, 'meta.json'), meta);

console.log(`recount: ${meta.counts.skills} skills, ${meta.counts.mcp} mcp, ${meta.counts.categories} categories`);
