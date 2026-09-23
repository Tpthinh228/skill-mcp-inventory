import { readFileSync, writeFileSync } from 'fs';
const s = JSON.parse(readFileSync('data/skills.json', 'utf8'));
const m = JSON.parse(readFileSync('data/mcp.json', 'utf8'));
const c = JSON.parse(readFileSync('data/categories.json', 'utf8'));
const meta = JSON.parse(readFileSync('data/meta.json', 'utf8'));
const all = [...s, ...m];
const withStars = all.filter(x => x.github.stars != null).sort((a, b) => b.github.stars - a.github.stars);
const noStars = all.filter(x => x.github.stars == null);
const effAvg = Math.round(all.reduce((t, x) => t + (x.effectiveness.score || 0), 0) / all.length);
const eff = { high: 0, medium: 0, low: 0, unknown: 0 };
for (const x of all) eff[x.effectiveness.level] = (eff[x.effectiveness.level] || 0) + 1;
const L = [];
const p = (...xs) => L.push(...xs);

p('# INVENTORY REPORT');
p('');
p(`> Sinh từ data thật ngày \`${meta.lastBuilt}\` — không có giá trị nào được suy đoán. Stars chỉ hiển thị khi có \`starsFetchedAt\`; thiếu → unknown.`);
p('');
p('## 1. Phương pháp');
p('');
p('1. **Discovery** — quét skill roots (`.agents`, `.claude`, `.codex`, opencode config + cache superpowers/ponytail, project roots) đọc frontmatter SKILL.md; quét MCP ở `.claude.json`, `config.toml`, `opencode.json(c)`, Claude Desktop, project `.mcp.json`.');
p('2. **Classification** — score keyword theo nội dung (name+description+body), không theo tên file.');
p('3. **Stars/repo** — chỉ resolve repo từ git source trong config hoặc `repository` field qua npm/pypi registry; fetch GitHub API (cache 24h, fallback `pickGh` khi rate-limit/404). Không fetch được → `stars=null` + `starsReason`.');
p('4. **Verification** — mỗi record có `status/sources/evidence/lastVerified`; home path → `~`, secret → `«redacted»`.');
p('5. **Effectiveness v1** — reliability30 + docs25 + maintenance20 + compat10 + practical15; **stars loại khỏi input**; thiếu bằng chứng → component bị loại khỏi maxPossible; chưa smoke test → `tested:false`.');
p('');
p('## 2. Tổng quan');
p('');
p('| Metric | Value |');
p('|---|---|');
p(`| Skills | ${meta.counts.skills} (installed ${meta.counts.skillsInstalled}) |`);
p(`| MCP servers | ${meta.counts.mcp} (configured ${meta.counts.mcpConfigured}) |`);
p(`| Categories | ${meta.counts.categories} |`);
p(`| Verified records | ${meta.counts.verified} / ${meta.counts.skills + meta.counts.mcp} |`);
p(`| GitHub stars có timestamp | ${meta.counts.withStars} |`);
p(`| Effectiveness avg | ${effAvg}/100 |`);
p(`| high / medium / low+unknown | ${eff.high} / ${eff.medium} / ${eff.low + eff.unknown} |`);
p('');
p('## 3. Categories');
p('');
p('| Category | Skills | MCP | Verified |');
p('|---|---|---|---|');
for (const cat of c) {
  const sk = s.filter(x => x.category === cat.name).length;
  const mc = m.filter(x => x.category === cat.name).length;
  p(`| ${cat.name} | ${sk} | ${mc} | ${cat.verified} |`);
}
p('');
p(`## 4. Top skills theo GitHub stars (starsFetchedAt = ${meta.lastGithubSync})`);
p('');
p('| Skill | Stars | Repo | Eff | Verified |');
p('|---|---|---|---|---|');
const seen = new Set();
for (const x of withStars.filter(v => v.id?.startsWith('skill'))) {
  const key = x.github.repo;
  if (seen.has(key)) continue;
  seen.add(key);
  p(`| ${x.name} | ${x.github.stars.toLocaleString()} | ${x.github.owner}/${x.github.repo} | ${x.effectiveness.score ?? 'null'} | ${x.verification.status} |`);
  if (seen.size >= 8) break;
}
p('');
p('## 5. Toàn bộ MCP');
p('');
p('| MCP | Category | Stars | Install | Verified |');
p('|---|---|---|---|---|');
for (const x of m) {
  const stars = x.github.stars != null
    ? x.github.stars.toLocaleString()
    : 'unknown' + (x.github.starsReason ? ` (${x.github.starsReason})` : '');
  p(`| ${x.name} | ${x.category} | ${stars} | ${x.installCommand || '—'} | ${x.verification.status} |`);
}
p('');
p('## 6. Skill theo category');
p('');
for (const cat of c) {
  const list = s.filter(x => x.category === cat.name);
  if (!list.length) continue;
  p(`### ${cat.name} (${list.length})`);
  p('');
  p(list.map(x => `${x.name} [${x.effectiveness.score ?? '?'}]`).join(', '));
  p('');
}
p('## 7. Effectiveness distribution');
p('');
p(`- **high (${eff.high})**: ${bucketsNames(all, 'high').slice(0, 12).join(', ')}${eff.high > 12 ? '…' : ''}`);
p(`- **medium (${eff.medium})**: ${bucketsNames(all, 'medium').slice(0, 12).join(', ')}${eff.medium > 12 ? '…' : ''}`);
p(`- **low/unknown**: ${eff.low + eff.unknown}`);
p('');
p('## 8. Stars known/unknown');
p('');
p(`- **Có stars + timestamp**: ${withStars.length} — ${withStars.map(x => x.name).slice(0, 8).join(', ')}…`);
p(`- **Unknown**: ${noStars.length} — lý do: ${[...new Set(noStars.map(x => x.github.starsReason || x.github.error || 'no-repo'))].join('; ')}`);
p('');
p('## 9. Giới hạn (honest gaps)');
p('');
p('1. **MCP tools/prompts/resources = []** — chưa enumerate server thật (không spawn subprocess).');
p('2. **Effectiveness chưa có smoke test** — mọi item `tested:false`, basis từ docs/activity/compat.');
p('3. **Stars unauthenticated** (60 req/h) — `GITHUB_TOKEN` nếu có ở env tăng quota; token không bao giờ ghi vào data.');
p('4. **Không phải mọi skill có repo** — không marketplace source → stars unknown theo design.');
p('5. **Description MCP** thiếu config → `descriptionInferred: true` (qua package name).');
p('6. **authRequired** chỉ true khi config khai báo — không suy diễn từ tên package.');
p('');
p('## 10. Verification summary');
p('');
p('| Status | Count |');
p('|---|---|');
p(`| verified | ${meta.counts.verified} |`);
p(`| partial | ${meta.counts.partial} |`);
p(`| unverified | ${meta.counts.unverified} |`);
p('');
writeFileSync('INVENTORY_REPORT.md', L.join('\n') + '\n');
console.log('INVENTORY_REPORT.md written,', L.length, 'lines');

function bucketsNames(arr, level) {
  return arr.filter(x => x.effectiveness.level === level).map(x => x.name);
}
