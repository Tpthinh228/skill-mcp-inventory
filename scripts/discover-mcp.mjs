import path from 'node:path';
import fs from 'node:fs';
import {
  DATA_DIR, readJson, writeJson, exists, redactValue, redactHome,
  classify, classifySubs, emptyGithub, emptyEffectiveness, slugId,
} from './lib.mjs';

const errors = [];
const records = new Map();

// User-provided provenance for local/exe MCP servers (no package registry repo).
const KNOWN_MCP_REPOS = {
  officecli: { repo: 'https://github.com/iOfficeAI/OfficeCLI', source: 'user-provided provenance' },
  'word-document-server': { repo: 'https://github.com/GongRzhe/Office-Word-MCP-Server', source: 'user-provided provenance' },
  gitnexus: { repo: 'https://github.com/abhigyanpatwari/GitNexus', source: 'user-provided provenance' },
};

function add(partial) {
  const key = partial.name.toLowerCase();
  if (records.has(key)) {
    const r = records.get(key);
    if (!r.configPaths.includes(partial.configPath)) r.configPaths.push(partial.configPath);
    if (!r.hosts.includes(partial.host)) r.hosts.push(partial.host);
    return;
  }
  const known = KNOWN_MCP_REPOS[key];
  const repoUrl = partial.repoUrl || known?.repo || null;
  records.set(key, {
    id: slugId('mcp', key),
    name: partial.name,
    displayName: partial.name,
    category: 'Other',
    description: '',
    status: partial.status || 'configured',
    transport: partial.transport || 'stdio',
    command: partial.command || null,
    args: partial.args || [],
    package: partial.package || null,
    packageManager: partial.packageManager || null,
    configPath: partial.configPath,
    configPaths: [partial.configPath],
    hosts: [partial.host],
    repoUrl,
    docsUrl: null,
    installCommand: partial.installCommand || null,
    usageExample: null,
    authRequired: !!partial.authRequired,
    authMethod: partial.authMethod || null,
    tools: [], resources: [], prompts: [],
    enumerationNote: 'Tools/resources not enumerated (server not queried during scan).',
    github: { ...emptyGithub(), ...(repoUrl ? parseGh(repoUrl) : {}) },
    githubSource: known?.source || null,
    configSnippet: partial.configSnippet || null,
    evidence: partial.evidence || {},
    effectiveness: emptyEffectiveness(),
    verification: { status: 'verified', sources: [partial.host, partial.configPath], lastVerified: null },
    sources: [`${partial.host}: ${partial.configPath}`],
  });
}

function parseGh(url) {
  const m = /github\.com\/([^/]+)\/([^/#?]+)/.exec(url || '');
  return m ? { owner: m[1], repo: m[2].replace(/\.git$/, '') } : {};
}

function npmPackageOf(command, args = []) {
  // npx -y pkg ... | npm exec pkg
  if (/(^|[\\/])npx(\.cmd)?$/i.test(command || '') || command === 'npx') {
    const rest = args.filter(a => !a.startsWith('-') && !a.startsWith('http'));
    return rest[0] ? { pkg: rest[0], pm: 'npm' } : null;
  }
  if (/(^|[\\/])uvx(\.exe)?$/i.test(command || '') || command === 'uvx') {
    const rest = args.filter(a => !a.startsWith('-'));
    return rest[0] ? { pkg: rest[0], pm: 'pypi' } : null;
  }
  return null;
}

function ingestClaudeDesktop() {
  const p = path.join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json');
  if (!exists(p)) return;
  const cfg = readJson(p, null);
  if (!cfg?.mcpServers) return;
  for (const [name, s] of Object.entries(cfg.mcpServers)) {
    const np = npmPackageOf(s.command, s.args);
    add({
      name, host: 'Claude Desktop', configPath: redactHome(p),
      command: redactHome(s.command), args: (s.args || []).map(redactHome),
      transport: s.type || (s.url ? 'sse' : 'stdio'),
      status: 'configured', package: np?.pkg || null, packageManager: np?.pm || null,
      installCommand: np ? `${np.pm === 'pypi' ? 'uvx' : 'npx -y'} ${np.pkg}` : null,
      configSnippet: redactHome(JSON.stringify({ [name]: { command: s.command, args: s.args || [] } })),
      evidence: { configKey: 'mcpServers', declaredTransport: s.type || 'stdio' },
    });
  }
}

function ingestClaudeCode() {
  const p = path.join(process.env.USERPROFILE || '', '.claude.json');
  if (!exists(p)) return;
  const cfg = readJson(p, null);
  for (const [name, s] of Object.entries(cfg?.mcpServers || {})) {
    const np = npmPackageOf(s.command, s.args);
    add({
      name, host: 'Claude Code', configPath: '~/.claude.json',
      command: redactHome(s.command), args: (s.args || []).map(redactHome),
      transport: s.type || (s.url ? 'sse' : 'stdio'),
      status: 'configured', package: np?.pkg || null, packageManager: np?.pm || null,
      installCommand: np ? `${np.pm === 'pypi' ? 'uvx' : 'npx -y'} ${np.pkg}` : null,
      configSnippet: redactHome(JSON.stringify({ [name]: { command: s.command, args: s.args || [] } })),
      evidence: { configKey: 'mcpServers', declaredTransport: s.type || 'stdio' },
    });
  }
  // project-scoped
  for (const [proj, v] of Object.entries(cfg?.projects || {})) {
    for (const [name, s] of Object.entries(v.mcpServers || {})) {
      const np = npmPackageOf(s.command, s.args);
      add({
        name, host: 'Claude Code (project)', configPath: `${redactHome(proj)} → ~/.claude.json`,
        command: redactHome(s.command), args: (s.args || []).map(redactHome),
        transport: s.type || 'stdio', status: 'configured',
        package: np?.pkg || null, packageManager: np?.pm || null,
        installCommand: np ? `${np.pm === 'pypi' ? 'uvx' : 'npx -y'} ${np.pkg}` : null,
        configSnippet: null, evidence: { configKey: `projects["${proj}"].mcpServers` },
      });
    }
  }
}

function parseTomlServers(text, configPath) {
  // minimal extraction of [mcp_servers.NAME] blocks
  const servers = [];
  const re = /\[mcp_servers\.([^\]]+)\]([\s\S]*?)(?=\n\[|$)/g;
  let m;
  while ((m = re.exec(text))) {
    const name = m[1].trim().replace(/^["']|["']$/g, '');
    if (name.includes('.')) continue; // nested table e.g. [mcp_servers.x.env], not a server
    const block = m[2];
    const cmd = /(?:^|\n)\s*command\s*=\s*(['"])(.*?)\1/.exec(block);
    const argsM = /(?:^|\n)\s*args\s*=\s*\[([\s\S]*?)\]/.exec(block);
    const urlM = /(?:^|\n)\s*url\s*=\s*(['"])(.*?)\1/.exec(block);
    let args = [];
    if (argsM) args = [...argsM[1].matchAll(/(['"])(.*?)\1/g)].map(x => x[2]);
    const envKeyM = new RegExp(`\\[mcp_servers\\.${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.env\\]([\\s\\S]*?)(?=\\n\\[|$)`, 'i').exec(text);
    const env = {};
    if (envKeyM) {
      for (const line of envKeyM[1].split('\n')) {
        const kv = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/.exec(line);
        if (kv) env[kv[1]] = SECRETISH(kv[1]) ? '«redacted»' : kv[2].replace(/^['"]|['"]$/g, '');
      }
    }
    servers.push({
      name, command: cmd ? cmd[2] : (urlM ? null : null), args,
      url: urlM ? urlM[2] : null, env, configPath,
    });
  }
  return servers;
}
const SECRETISH = k => /(KEY|TOKEN|SECRET|PASS|AUTH|CRED)/i.test(k);

function ingestCodex() {
  const p = path.join(process.env.USERPROFILE || '', '.codex', 'config.toml');
  if (!exists(p)) return;
  const text = readRaw(p);
  for (const s of parseTomlServers(text, '~/.codex/config.toml')) {
    const np = npmPackageOf(s.command, s.args);
    add({
      name: s.name, host: 'Codex', configPath: '~/.codex/config.toml',
      command: redactHome(s.command), args: s.args.map(redactHome),
      transport: s.url ? 'streamable-http' : 'stdio',
      status: 'configured',
      package: np?.pkg || null, packageManager: np?.pm || null,
      installCommand: np ? `${np.pm === 'pypi' ? 'uvx' : 'npx -y'} ${np.pkg}` : null,
      configSnippet: s.command
        ? redactHome(JSON.stringify({ [s.name]: { command: s.command, args: s.args } }, null, 2))
        : null,
      authRequired: false,
      evidence: { configKey: `mcp_servers.${s.name}`, envKeys: Object.keys(s.env || {}) },
    });
  }
}
function readRaw(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } }

function ingestOpencode() {
  for (const file of ['opencode.json', 'opencode.jsonc']) {
    const p = path.join(process.env.USERPROFILE || '', '.config', 'opencode', file);
    if (!exists(p)) continue;
    // strip // comments for jsonc (naive, good enough for this config)
    let raw = readFileSyncSafe(p);
    raw = raw.replace(/^\s*\/\/.*$/gm, '');
    let cfg;
    try { cfg = JSON.parse(raw); }
    catch (e) { errors.push(`parse failed: ~/.config/opencode/${file}: ${e.message}`); continue; }
    for (const [name, s] of Object.entries(cfg?.mcp || {})) {
      const cmd = Array.isArray(s.command) ? s.command[0] : s.command;
      const args = Array.isArray(s.command) ? s.command.slice(1) : [];
      const np = npmPackageOf(cmd, args);
      const env = s.environment ? Object.fromEntries(Object.entries(s.environment).map(([k, v]) =>
        [k, SECRETISH(k) ? '«redacted»' : redactHome(String(v))])) : {};
      add({
        name, host: 'OpenCode', configPath: `~/.config/opencode/${file}`,
        command: redactHome(cmd || null), args: args.map(redactHome),
        transport: s.type === 'remote' ? 'streamable-http' : 'stdio',
        status: s.enabled === false ? 'disabled' : 'configured',
        package: np?.pkg || null, packageManager: np?.pm || null,
        installCommand: np ? `${np.pm === 'pypi' ? 'uvx' : 'npx -y'} ${np.pkg}` : null,
        configSnippet: redactHome(JSON.stringify({ mcp: { [name]: s } }, null, 2)),
        evidence: { configKey: `mcp.${name}`, enabled: s.enabled !== false, envKeys: Object.keys(s.environment || {}) },
      });
      if (s.enabled === false) { const r = records.get(name.toLowerCase()); if (r) r.status = 'disabled'; }
    }
  }
}
function readFileSyncSafe(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } }

function ingestProjectConfigs() {
  const candidates = ['.mcp.json', 'mcp.json', '.cursor/mcp.json', '.vscode/mcp.json'];
  for (const rel of candidates) {
    const p = path.join(process.cwd(), rel);
    if (!exists(p)) continue;
    const cfg = readJson(p, null);
    const servers = cfg?.mcpServers || cfg?.servers || {};
    for (const [name, s] of Object.entries(servers)) {
      const np = npmPackageOf(s.command, s.args || []);
      add({
        name, host: 'Project', configPath: rel,
        command: redactHome(s.command), args: (s.args || []).map(redactHome),
        transport: s.type || (s.url ? 'sse' : 'stdio'), status: 'configured',
        package: np?.pkg || null, packageManager: np?.pm || null,
        installCommand: np ? `${np.pm === 'pypi' ? 'uvx' : 'npx -y'} ${np.pkg}` : null,
        configSnippet: null, evidence: { configKey: rel },
      });
    }
  }
}

function main() {
  ingestClaudeDesktop();
  ingestClaudeCode();
  ingestCodex();
  ingestOpencode();
  ingestProjectConfigs();

  const list = [...records.values()];
  for (const r of list) {
    if (r.configSnippet) r.configSnippet = redactHome(r.configSnippet);
    if (r.command) r.command = redactHome(r.command);
    if (Array.isArray(r.args)) r.args = r.args.map(redactHome);
    const cat = classify(r.name, r.description, r.command, r.package, r.host, r.configSnippet);
    r.category = cat;
    r.subcategories = classifySubs(r.name, r.package, r.host);
    // honest description derived from local config evidence (marked inferred)
    if (!r.description) {
      const what = r.package
        ? `MCP server "${r.name}" (package ${r.package})`
        : `MCP server "${r.name}"`;
      const cmd = r.command ? ` via command \`${String(r.command).split(/[\\/]/).pop()}\`` : '';
      r.description = `${what} configured in ${r.hosts.join(', ')}${cmd}. Description inferred from local configuration — not fetched from upstream docs.`;
      r.descriptionInferred = true;
    }
    r.verification.sources = [...new Set([...(r.verification.sources || []), ...r.hosts.map(h => `config in ${h}`)])];
  }
  list.sort((a, b) => a.name.localeCompare(b.name));
  writeJson(path.join(DATA_DIR, 'mcp.json'), list);
  writeJson(path.join(DATA_DIR, 'scan-errors-mcp.json'), { lastScan: new Date().toISOString(), errors });
  console.log(`mcp servers discovered: ${list.length}, errors: ${errors.length}`);
}

main();
