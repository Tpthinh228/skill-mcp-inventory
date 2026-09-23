const I18N = {
  vi: {
    'lang.group': 'Ngôn ngữ',
    'skip': 'Bỏ qua tới nội dung chính',
    'nav.main': 'Điều hướng chính',
    'nav.overview': 'Tổng quan',
    'nav.skills': 'Kỹ năng',
    'nav.mcp': 'MCP',
    'nav.categories': 'Danh mục',
    'nav.repos': 'Kho mã nguồn',
    'nav.cli': 'CLI',
    'cli.intro': 'Lệnh cài đặt dòng lệnh cho các AI coding CLI. Lấy từ tài liệu chính thức — chọn lệnh khớp OS của bạn.',
    'cli.docs': 'Tài liệu',
    'cli.copy': 'Sao chép',
    'cli.bin': 'Sau khi cài: ',
    'loading': 'đang tải…',
    'noData': 'chưa có dữ liệu',
    'search.ph': 'Tìm theo tên, mô tả, danh mục…',
    'search.label': 'Tìm trong kiểm kê',
    'copied': 'Đã sao chép ✓',
    'copy.failed': 'Sao chép thất bại — chọn thủ công',
    'banner.loading': 'Đang quét… tải dữ liệu kiểm kê.',
    'banner.error': 'Không tải được dữ liệu kiểm kê: ${e}. Chạy npm run inventory:all',
    'banner.rate': 'Không lấy được metadata GitHub (giới hạn tốc độ). Đồng bộ gần nhất: ${d}',
    'banner.scanWarn': '${n} cảnh báo quét.',
    'panel.categories': 'Danh mục',
    'cap.cats': 'Số lượng mỗi danh mục',
    'cap.skills': 'Kỹ năng đã phát hiện',
    'cap.mcp': 'Máy chủ MCP đã phát hiện',
    'cap.repos': 'Kho mã nguồn GitHub trong kiểm kê',
    'th.category': 'Danh mục',
    'th.skills': 'Kỹ năng',
    'th.total': 'Tổng',
    'th.verified': 'Đã xác minh',
    'th.status': 'Trạng thái',
    'th.source': 'Nguồn',
    'th.tested': 'Đã kiểm thử',
    'th.sort': 'Sắp xếp',
    'th.purpose': 'Mục đích',
    'th.links': 'Liên kết',
    'th.transport': 'Giao thức',
    'th.tools': 'Công cụ',
    'th.repo': 'Kho mã nguồn',
    'th.lang': 'Ngôn ngữ',
    'th.license': 'Giấy phép',
    'th.release': 'Bản phát hành mới',
    'th.commit': 'Commit gần nhất',
    'th.usedBy': 'Được dùng bởi',
    'common.all': 'Tất cả',
    'filter.hasGithub': 'Có GitHub',
    'filter.byCat': 'Lọc kỹ năng theo danh mục',
    'filter.byStatus': 'Lọc kỹ năng theo trạng thái',
    'filter.bySource': 'Lọc kỹ năng theo nguồn',
    'filter.byCatMcp': 'Lọc MCP theo danh mục',
    'filter.byStatusMcp': 'Lọc MCP theo trạng thái',
    'filter.byHost': 'Lọc MCP theo host',
    'filter.sortSkills': 'Sắp xếp kỹ năng',
    'filter.sortMcp': 'Sắp xếp máy chủ MCP',
    'filter.sortRepos': 'Sắp xếp kho mã nguồn',
    'sort.name': 'Tên',
    'sort.stars': 'Sao',
    'sort.eff': 'Hiệu quả',
    'sort.updated': 'Cập nhật gần nhất',
    'drawer.detail': 'Chi tiết',
    'drawer.close': 'Đóng',
    'drawer.closeAria': 'Đóng chi tiết',
    'status.installed': '● Đã cài',
    'status.configured': '● Đã cấu hình',
    'status.available': '○ Khả dụng',
    'status.disabled': '◐ Đã tắt',
    'status.unknown': '? Không rõ',
    'ver.verified': '✓ Đã xác minh',
    'ver.partial': '◐ Một phần',
    'ver.unverified': '? Chưa xác minh',
    'eff.notScored': '? Chưa chấm điểm',
    'eff.aria': 'Hiệu quả ${s} trên 100, ${lv}',
    'stars.exact': 'đúng ${s} sao (lấy lúc ${d})',
    'stars.unknownReason.noRepo': 'Không xác định được repo công khai',
    'stars.unknownReason.default': 'Chưa xác minh',
    'stars.unknown': '★ không rõ',
    'kpi.skills': 'Kỹ năng',
    'kpi.skills.hint': '${n} phát hiện',
    'kpi.mcp': 'MCP',
    'kpi.mcp.hint': '${n} phát hiện',
    'kpi.verRepos': 'Repo đã xác minh',
    'kpi.verRepos.hint': '${n} chưa có repo xác minh',
    'kpi.tested': 'Đã kiểm thử',
    'kpi.tested.hint': 'hạng mục smoke test',
    'kpi.categories': 'Danh mục',
    'kpi.categories.hint': 'nhóm phân loại',
    'kpi.unver': 'Hạng mục chưa xác minh',
    'kpi.unver.hint': 'một phần + chưa xác minh',
    'empty.skills': 'Chưa phát hiện kỹ năng nào',
    'empty.skillsHint': 'Chạy quét: npm run inventory:scan',
    'empty.mcp': 'Chưa phát hiện máy chủ MCP',
    'empty.mcpHint': 'Chạy quét: npm run inventory:scan',
    'empty.repos': 'Không có kho mã nguồn khớp',
    'empty.reposHint': 'Chỉ liệt kê repo khi resolve được từ config hoặc package registry.',
    'cat.meta': '${t} hạng mục · ${s} kỹ năng · ${m} MCP · ${v} đã xác minh',
    'cat.viewSkills': 'Xem kỹ năng',
    'cat.viewMcp': 'Xem MCP',
    'dr.testedOn': '✓ Đã kiểm thử',
    'dr.testedOff': '○ Chưa kiểm thử',
    'dr.status': 'Trạng thái',
    'dr.purpose': 'Mục đích',
    'dr.purposeSrc': 'Mô tả theo GitHub',
    'dr.whyCat': 'Vì sao vào danh mục này',
    'dr.whyCatBody': 'Phân loại là “${c}” theo nội dung skill (tên, mô tả, thân SKILL.md) — không theo tên file.',
    'dr.subcats': ' Danh mục phụ: ${s}.',
    'dr.lives': 'Nơi lưu trữ',
    'dr.scope': 'Phạm vi',
    'dr.paths': 'Đường dẫn',
    'dr.locations': 'Vị trí',
    'dr.install': 'Cài đặt',
    'dr.noInstall': 'Không có lệnh cài đã xác minh — skill có trên đĩa (local).',
    'dr.copyInstall': 'Sao chép lệnh cài',
    'dr.usage': 'Sử dụng',
    'dr.usageYes': 'SKILL.md có hướng dẫn sử dụng — mở file skill để xem quy trình đầy đủ.',
    'dr.usageNo': 'Không phát hiện mục sử dụng riêng trong SKILL.md.',
    'dr.config': 'Cấu hình',
    'dr.transport': 'Giao thức',
    'dr.hosts': 'Host',
    'dr.cfgPaths': 'Đường dẫn cấu hình',
    'dr.command': 'Lệnh',
    'dr.args': 'Tham số',
    'dr.package': 'Gói',
    'dr.pkgMgr': 'Trình quản lý gói',
    'dr.auth': 'Xác thực',
    'dr.authReq': 'yêu cầu',
    'dr.authNo': 'không khai báo trong config',
    'dr.copyConfig': 'Sao chép cấu hình',
    'dr.copyCmd': 'Sao chép lệnh',
    'dr.noPkgInstall': 'Không có lệnh cài gói đã xác minh (config local/binary).',
    'dr.tools': 'Công cụ / tài nguyên / prompt',
    'dr.notEnum': 'Chưa liệt kê.',
    'dr.github': 'GitHub',
    'dr.repo': 'Kho mã nguồn',
    'dr.starsExact': 'Sao (chính xác)',
    'dr.starsFmt': 'Sao (định dạng)',
    'dr.forks': 'Forks',
    'dr.issues': 'Vấn đề mở',
    'dr.license': 'Giấy phép',
    'dr.language': 'Ngôn ngữ',
    'dr.lastPush': 'Push gần nhất',
    'dr.latestRel': 'Bản phát hành mới',
    'dr.fetchedAt': 'Lúc lấy dữ liệu',
    'dr.source': 'Nguồn',
    'dr.repoFail': 'Không xác minh được kho mã nguồn — sao = không rõ.',
    'dr.repoBtn': 'Kho GitHub',
    'dr.docsBtn': 'Tài liệu',
    'dr.pkgBtn': 'Gói',
    'dr.relBtn': 'Bản phát hành mới',
    'dr.eff': 'Hiệu quả',
    'dr.confidence': 'độ tin cậy: ${c}',
    'dr.framework': 'Khung: ${f}',
    'dr.reliability': 'Độ tin cậy',
    'dr.documentation': 'Tài liệu',
    'dr.maintenance': 'Bảo trì',
    'dr.compatibility': 'Tương thích',
    'dr.practical': 'Thực dụng',
    'dr.raw': 'Tổng thô',
    'dr.starsNote': 'Sao không bao giờ được dùng trong điểm này.',
    'dr.srcVer': 'Nguồn & xác minh',
    'dr.lastVerLine': 'Xác minh lần cuối: ${d} · trạng thái: ${s}',
    'dr.note': 'Ghi chú',
    'dr.inferred': 'Mô tả suy ra bằng chứng cấu hình cục bộ (đánh dấu inferred), không lấy từ tài liệu upstream.',
    'row.locs': '${n} vị trí',
    'skill.parent': 'thuộc bộ ${p}',
    'skill.openParent': '→ skill gốc: ${p}',
    'dr.children': 'Nhánh con (${n})',
    'skill.expand': 'Mở nhánh con',
    'skill.collapse': 'Thu nhánh con',
    'row.items': '${n} hạng mục',
    'openDetails': 'Mở chi tiết ${n}',
    'openRepo': 'Mở ${n} trên GitHub',
    'searchHint': 'Nhập để tìm…',
    'meta.sync': 'đồng bộ GitHub: ${d}',
    'level.high': 'cao',
    'level.medium': 'trung bình',
    'level.low': 'thấp',
    'level.unknown': 'không rõ',
    'conf.high': 'cao',
    'conf.medium': 'trung bình',
    'conf.low': 'thấp',
    'cat.Development': 'Phát triển',
    'cat.AI Agent': 'AI Agent',
    'cat.Browser / Web': 'Trình duyệt / Web',
    'cat.DevOps / Infrastructure': 'DevOps / Hạ tầng',
    'cat.Git / GitHub': 'Git / GitHub',
    'cat.Security': 'Bảo mật',
    'cat.Office / Docs': 'Văn phòng / Tài liệu',
    'cat.Other': 'Khác',
    'cat.UI/UX': 'UI/UX',
    'cat.3D / Creative': '3D / Sáng tạo',
    'cat.Data': 'Dữ liệu',
    'status.installed.raw': 'Đã cài',
    'status.configured.raw': 'Đã cấu hình',
    'status.available.raw': 'Khả dụng',
    'status.disabled.raw': 'Đã tắt',
    'status.unknown.raw': 'Không rõ',
  },
  en: {
    'lang.group': 'Language',
    'skip': 'Skip to main content',
    'nav.main': 'Main navigation',
    'nav.overview': 'Overview',
    'nav.skills': 'Skills',
    'nav.mcp': 'MCP',
    'nav.categories': 'Categories',
    'nav.repos': 'Repositories',
    'nav.cli': 'CLI',
    'cli.intro': 'Install commands for AI coding CLIs. Taken from official docs — pick the command that matches your OS.',
    'cli.docs': 'Docs',
    'cli.copy': 'Copy',
    'cli.bin': 'After install: ',
    'loading': 'loading…',
    'noData': 'no data',
    'search.ph': 'Search name, description, category…',
    'search.label': 'Search inventory',
    'copied': 'Copied ✓',
    'copy.failed': 'Copy failed — select manually',
    'banner.loading': 'Scanning… loading inventory data.',
    'banner.error': 'Inventory data unavailable: ${e}. Run npm run inventory:all',
    'banner.rate': 'GitHub metadata unavailable (rate limit). Last successful sync: ${d}',
    'banner.scanWarn': '${n} scan warning(s).',
    'panel.categories': 'Categories',
    'cap.cats': 'Counts per category',
    'cap.skills': 'Discovered skills',
    'cap.mcp': 'Discovered MCP servers',
    'cap.repos': 'GitHub repositories referenced by inventory',
    'th.category': 'Category',
    'th.skills': 'Skills',
    'th.total': 'Total',
    'th.verified': 'Verified',
    'th.status': 'Status',
    'th.source': 'Source',
    'th.tested': 'Tested',
    'th.sort': 'Sort',
    'th.purpose': 'Purpose',
    'th.links': 'Links',
    'th.transport': 'Transport',
    'th.tools': 'Tools',
    'th.repo': 'Repository',
    'th.lang': 'Language',
    'th.license': 'License',
    'th.release': 'Latest release',
    'th.commit': 'Last commit',
    'th.usedBy': 'Used by',
    'common.all': 'All',
    'filter.hasGithub': 'Has GitHub',
    'filter.byCat': 'Filter skills by category',
    'filter.byStatus': 'Filter skills by status',
    'filter.bySource': 'Filter skills by source',
    'filter.byCatMcp': 'Filter MCP by category',
    'filter.byStatusMcp': 'Filter MCP by status',
    'filter.byHost': 'Filter MCP by host',
    'filter.sortSkills': 'Sort skills',
    'filter.sortMcp': 'Sort MCP servers',
    'filter.sortRepos': 'Sort repositories',
    'sort.name': 'Name',
    'sort.stars': 'Stars',
    'sort.eff': 'Effectiveness',
    'sort.updated': 'Last updated',
    'drawer.detail': 'Detail',
    'drawer.close': 'Close',
    'drawer.closeAria': 'Close detail',
    'status.installed': '● Installed',
    'status.configured': '● Configured',
    'status.available': '○ Available',
    'status.disabled': '◐ Disabled',
    'status.unknown': '? Unknown',
    'ver.verified': '✓ Verified',
    'ver.partial': '◐ Partial',
    'ver.unverified': '? Unverified',
    'eff.notScored': '? Not scored',
    'eff.aria': 'Effectiveness ${s} of 100, ${lv}',
    'stars.exact': '${s} stars exactly (fetched ${d})',
    'stars.unknownReason.noRepo': 'No public repo identified',
    'stars.unknownReason.default': 'Not verified',
    'stars.unknown': '★ unknown',
    'kpi.skills': 'Skills',
    'kpi.skills.hint': '${n} discovered',
    'kpi.mcp': 'MCP Servers',
    'kpi.mcp.hint': '${n} discovered',
    'kpi.verRepos': 'Verified Repos',
    'kpi.verRepos.hint': '${n} without verified repo',
    'kpi.tested': 'Tested',
    'kpi.tested.hint': 'smoke-tested items',
    'kpi.categories': 'Categories',
    'kpi.categories.hint': 'classification groups',
    'kpi.unver': 'Unverified items',
    'kpi.unver.hint': 'partial + unverified',
    'empty.skills': 'No skills discovered',
    'empty.skillsHint': 'Run inventory scan: npm run inventory:scan',
    'empty.mcp': 'No MCP servers discovered',
    'empty.mcpHint': 'Run inventory scan: npm run inventory:scan',
    'empty.repos': 'No repositories match',
    'empty.reposHint': 'Repos are only listed when resolved from config or package registry.',
    'cat.meta': '${t} items · ${s} skills · ${m} MCP · ${v} verified',
    'cat.viewSkills': 'View skills',
    'cat.viewMcp': 'View MCP',
    'dr.testedOn': '✓ Tested',
    'dr.testedOff': '○ Not Tested',
    'dr.status': 'Status',
    'dr.purpose': 'Purpose',
    'dr.purposeSrc': 'Description on GitHub',
    'dr.whyCat': 'Why this category',
    'dr.whyCatBody': 'Classified as “${c}” from skill content (name, description, SKILL.md body) — not filename.',
    'dr.subcats': ' Subcategories: ${s}.',
    'dr.lives': 'Where it lives',
    'dr.scope': 'Scope',
    'dr.paths': 'Paths',
    'dr.locations': 'Locations',
    'dr.install': 'Install',
    'dr.noInstall': 'No verified install command — skill present on disk (local).',
    'dr.copyInstall': 'Copy install command',
    'dr.usage': 'Usage',
    'dr.usageYes': 'Usage guidance found in SKILL.md — open the skill file for the full workflow.',
    'dr.usageNo': 'No dedicated usage section detected in SKILL.md.',
    'dr.config': 'Config',
    'dr.transport': 'Transport',
    'dr.hosts': 'Host(s)',
    'dr.cfgPaths': 'Config path(s)',
    'dr.command': 'Command',
    'dr.args': 'Args',
    'dr.package': 'Package',
    'dr.pkgMgr': 'Package manager',
    'dr.auth': 'Auth',
    'dr.authReq': 'required',
    'dr.authNo': 'not declared in config',
    'dr.copyConfig': 'Copy config',
    'dr.copyCmd': 'Copy command',
    'dr.noPkgInstall': 'No verified package install command (local/binary config).',
    'dr.tools': 'Tools / resources / prompts',
    'dr.notEnum': 'Not enumerated.',
    'dr.github': 'GitHub',
    'dr.repo': 'Repository',
    'dr.starsExact': 'Stars (exact)',
    'dr.starsFmt': 'Stars (formatted)',
    'dr.forks': 'Forks',
    'dr.issues': 'Open issues',
    'dr.license': 'License',
    'dr.language': 'Language',
    'dr.lastPush': 'Last push',
    'dr.latestRel': 'Latest release',
    'dr.fetchedAt': 'Fetched at',
    'dr.source': 'Source',
    'dr.repoFail': 'Repository could not be verified — stars = unknown.',
    'dr.repoBtn': 'GitHub Repository',
    'dr.docsBtn': 'Documentation',
    'dr.pkgBtn': 'Package',
    'dr.relBtn': 'Latest Release',
    'dr.eff': 'Effectiveness',
    'dr.confidence': 'confidence: ${c}',
    'dr.framework': 'Framework: ${f}',
    'dr.reliability': 'Reliability',
    'dr.documentation': 'Documentation',
    'dr.maintenance': 'Maintenance',
    'dr.compatibility': 'Compatibility',
    'dr.practical': 'Practical',
    'dr.raw': 'Raw',
    'dr.starsNote': 'Stars are never used in this score.',
    'dr.srcVer': 'Sources & verification',
    'dr.lastVerLine': 'Last verified: ${d} · status: ${s}',
    'dr.note': 'Note',
    'dr.inferred': 'Description is inferred from local config evidence (marked inferred), not fetched from upstream documentation.',
    'row.locs': '${n} location(s)',
    'skill.parent': 'part of ${p}',
    'skill.openParent': '→ parent skill: ${p}',
    'dr.children': 'Child branches (${n})',
    'skill.expand': 'Show child branches',
    'skill.collapse': 'Hide child branches',
    'row.items': '${n} item(s)',
    'openDetails': 'Open details for ${n}',
    'openRepo': 'Open ${n} on GitHub',
    'searchHint': 'Type to search…',
  },
};

let lang = localStorage.getItem('inv-lang') === 'en' ? 'en' : 'vi';

function t(key, vars) {
  let s = (I18N[lang] && I18N[lang][key]) ?? I18N.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll('${' + k + '}', v);
  return s;
}
function setLang(next) {
  lang = next === 'en' ? 'en' : 'vi';
  localStorage.setItem('inv-lang', lang);
  document.documentElement.lang = lang;
  $$('.lang-btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  applyStaticI18n();
  closeDrawer();
  renderAll();
}
function catLabel(name) {
  if (!name) return name;
  return lang === 'vi' ? t('cat.' + name) : name;
}
function levelLabel(level) {
  if (!level) return level;
  if (lang === 'vi') return t('level.' + level);
  return level;
}
function confLabel(c) {
  if (!c) return c;
  return lang === 'vi' ? t('conf.' + c) : c;
}
function statusLabel(s) {
  if (!s) return s;
  if (lang === 'vi') {
    const raw = t('status.' + s + '.raw');
    if (raw !== 'status.' + s + '.raw') {
      const icon = (I18N.vi['status.' + s] || '').match(/^[●○◐?]/);
      return (icon ? icon[0] + ' ' : '') + raw;
    }
  }
  return t('status.' + s);
}
function applyStaticI18n() {
  $$('[data-i18n]').forEach(n => { n.textContent = t(n.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(n => { n.placeholder = t(n.dataset.i18nPh); });
  $$('[data-i18n-aria]').forEach(n => { n.setAttribute('aria-label', t(n.dataset.i18nAria)); });
}

const state = {
  skills: [], mcp: [], categories: [], sources: null, meta: null,
  purposeVi: {},
  view: 'overview',
  query: '',
  filters: { skills: {}, mcp: {} },
  sorts: { skills: 'name', mcp: 'name', repos: 'stars' },
  expanded: new Set(),
  loading: false,
  loadError: null,
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'text') node.textContent = v;
    else if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else node.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

// ---------- helpers ----------
function fmtStars(n) {
  if (n == null) return null;
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'm';
  if (n >= 1e4) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return n.toLocaleString('en-US');
}
function fmtDate(iso) {
  if (!iso) return '—';
  try { return new Date(iso).toISOString().slice(0, 16).replace('T', ' '); } catch { return '—'; }
}
function badge(text, cls = '', icon = null) {
  return el('span', { class: `badge ${cls}`.trim() },
    icon ? el('span', { class: 'dot', 'aria-hidden': 'true' }) : null,
    icon && !text ? icon : text);
}
function verifyBadge(status) {
  const map = { verified: 'ok', partial: 'warn', unverified: 'bad' };
  return badge(t('ver.' + (status || 'unverified')), map[status] || '');
}
function effMeter(ef) {
  if (ef.score == null) return el('span', { class: 'badge warn', title: ef.basis.join('; ') }, t('eff.notScored'));
  const cls = ef.score >= 75 ? 'ok' : ef.score >= 50 ? 'info' : 'warn';
  return el('span', { class: 'meter' },
    el('span', { class: 'bar', role: 'img', 'aria-label': t('eff.aria', { s: ef.score, lv: ef.level }) },
      el('span', { class: 'fill', style: `width:${ef.score}%` })),
    el('span', { class: 'num', text: `${ef.score}/100` }),
    badge(levelLabel(ef.level), cls));
}
function starsCell(g) {
  if (g.owner && typeof g.stars === 'number')
    return el('span', { class: 'stars', title: t('stars.exact', { s: g.stars, d: fmtDate(g.starsFetchedAt) }) }, '★ ' + fmtStars(g.stars));
  const reason = g.starsReason || (g.error === 'no-repo' ? t('stars.unknownReason.noRepo') : t('stars.unknownReason.default'));
  return el('span', { class: 'stars dim', title: reason }, t('stars.unknown'));
}
function linkBtn(label, href, attrs = {}) {
  if (!href) return null;
  const safe = sanitizeUrl(href);
  if (!safe) return null;
  return el('a', { class: 'btn btn-sm', href: safe, target: '_blank', rel: 'noopener noreferrer', ...attrs }, label);
}
function sanitizeUrl(href) {
  try {
    const u = new URL(href, location.origin);
    if (!['http:', 'https:', 'mailto:'].includes(u.protocol)) return null;
    return u.href;
  } catch { return null; }
}
async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    toast(btn ? t('copied') : t('copied'));
  } catch { toast(t('copy.failed')); }
}
function toast(msg) {
  $$('.toast').forEach(x => x.remove());
  const node = el('div', { class: 'toast', role: 'status' }, msg);
  document.body.append(node);
  setTimeout(() => node.remove(), 2200);
}
function emptyState(title, hint) {
  return el('div', { class: 'empty', role: 'status' },
    el('div', { class: 'big', text: title }),
    el('div', { text: hint }));
}
function debounce(fn, ms) {
  let x; return (...a) => { clearTimeout(x); x = setTimeout(() => fn(...a), ms); };
}
function matchesQuery(q, ...parts) {
  if (!q) return true;
  const hay = parts.filter(Boolean).join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).every(w => hay.includes(w));
}

function purposeText(item, kind) {
  const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
  const clean = s => cap((s || '').replace(/^["'>\s]+/, '').replace(/\s+/g, ' ').trim());
  if (lang === 'vi') {
    if (kind === 'skill' && state.purposeVi?.[item.id]) return clean(state.purposeVi[item.id]);
    if (kind === 'mcp' && item.descriptionInferred) {
      const pkg = item.package ? ` (gói ${item.package})` : '';
      return `Máy chủ MCP "${item.name}"${pkg} được cấu hình${item.command ? ` qua lệnh ${item.command}` : ''}. Mô tả suy ra từ cấu hình cục bộ — không lấy từ tài liệu gốc.`;
    }
  }
  const ghDesc = item.github?.description;
  if (kind === 'skill' && ghDesc) return clean(ghDesc);
  if (kind === 'mcp' && ghDesc && !item.descriptionInferred) return clean(ghDesc);
  return clean(kind === 'skill' ? (item.purpose || item.description) : item.description);
}

function purposeSummary(item) {
  const full = purposeText(item, 'skill') || '—';
  const m = full.match(/^(.{10,140}?[.!?])(\s|$)/);
  if (m) return m[1];
  return full.length > 140 ? full.slice(0, 137).trimEnd() + '…' : full;
}

function purposeDetail(item, kind) {
  const clean = s => (s || '').replace(/\s+/g, ' ').trim();
  const outer = clean(kind === 'skill' ? purposeSummary(item) : purposeText(item, kind)).toLowerCase();
  const parts = [];
  if (kind === 'skill') {
    if (lang === 'vi') {
      const vi = clean(state.purposeVi?.[item.id]);
      if (vi) parts.push(vi);
      else {
        const gh = clean(item.github?.description);
        const desc = clean(item.description);
        if (gh) parts.push(gh);
        if (desc && desc.toLowerCase() !== gh.toLowerCase()) parts.push(desc);
      }
    } else {
      const gh = clean(item.github?.description);
      const desc = clean(item.description);
      if (gh) parts.push(gh);
      if (desc && desc.toLowerCase() !== gh.toLowerCase()) parts.push(desc);
    }
  } else {
    const t = clean(purposeText(item, 'mcp'));
    if (t) parts.push(t);
  }
  const detail = parts.filter(Boolean).join('\n\n');
  if (!detail) return '';
  if (detail.toLowerCase() === outer) return '';
  if (detail.toLowerCase().startsWith(outer) && detail.length - outer.length < 40) return '';
  if (detail.length <= outer.length) return '';
  return detail;
}

function findParentSkill(item) {
  if (!item.parent) return null;
  const p = state.skills.find(s => s.name === item.parent && s.id !== item.id)
    || state.skills.find(s => s.name === item.parent);
  return p && p.id !== item.id ? p : null;
}
function findChildSkills(item) {
  return state.skills
    .filter(s => s.parent === item.name && s.id !== item.id)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ---------- load ----------
async function load() {
  state.loading = true;
  renderBanner();
  try {
    const [skills, mcp, categories, sources, meta, purposeVi] = await Promise.all(
      ['skills', 'mcp', 'categories', 'sources', 'meta', 'purpose-vi'].map(f =>
        fetch(`data/${f}.json?t=${Date.now()}`, { cache: 'no-store' }).then(r => {
          if (!r.ok) throw new Error(`${f}.json: HTTP ${r.status}`);
          return r.json();
        })
      )
    );
    Object.assign(state, { skills, mcp, categories, sources, meta, purposeVi, loadError: null });
    applyGhLiveCache();
  } catch (e) {
    state.loadError = e.message;
  }
  state.loading = false;
  renderAll();
  syncGithubLive();
  setInterval(syncGithubLive, 180_000);
}

// Cache stars live → localStorage để reload vẫn thấy số mới.
const GH_LIVE_KEY = 'inv-gh-live';
function applyGhLiveCache() {
  let cache;
  try { cache = JSON.parse(localStorage.getItem(GH_LIVE_KEY) || '{}'); } catch { return; }
  for (const item of [...state.skills, ...state.mcp]) {
    const key = item.github?.owner && item.github?.repo
      ? `${item.github.owner}/${item.github.repo}` : null;
    const hit = key && cache[key];
    if (hit?.patch) item.github = { ...item.github, ...hit.patch };
    if (key && hit?.etag) ghLive.etags[key] = hit.etag;
  }
}
function saveGhLive(key, etag, patch) {
  let cache;
  try { cache = JSON.parse(localStorage.getItem(GH_LIVE_KEY) || '{}'); } catch { cache = {}; }
  cache[key] = { etag, patch, at: Date.now() };
  try { localStorage.setItem(GH_LIVE_KEY, JSON.stringify(cache)); } catch { /* quota */ }
}

// Web tự đồng bộ stars/forks mỗi 3 phút. ETag → 304 không tốn quota; 403/429 → dừng.
const ghLive = { busy: false, limited: false, etags: {} };
async function syncGithubLive() {
  if (ghLive.busy || ghLive.limited || state.loading || document.hidden) return;
  ghLive.busy = true;
  try {
    const byRepo = new Map();
    for (const item of [...state.skills, ...state.mcp]) {
      if (!item.github?.owner || !item.github?.repo) continue;
      const key = `${item.github.owner}/${item.github.repo}`;
      if (!byRepo.has(key)) byRepo.set(key, []);
      byRepo.get(key).push(item);
    }
    let updated = 0;
    for (const [key, items] of byRepo) {
      const headers = { Accept: 'application/vnd.github+json' };
      if (ghLive.etags[key]) headers['If-None-Match'] = ghLive.etags[key];
      let res;
      try {
        res = await fetch(`https://api.github.com/repos/${key}`, { headers });
      } catch { break; }
      if (res.status === 403 || res.status === 429) { ghLive.limited = true; break; }
      if (res.status === 304) continue;
      if (!res.ok) continue;
      const etag = res.headers.get('etag');
      if (etag) ghLive.etags[key] = etag;
      const j = await res.json();
      const now = new Date().toISOString();
      const patch = {
        stars: j.stargazers_count,
        forks: j.forks_count,
        issues: j.open_issues_count,
        description: j.description || null,
        starsFetchedAt: now,
        lastCommit: j.pushed_at,
        license: j.license?.spdx_id || null,
        language: j.language,
        error: null,
        starsReason: null,
      };
      for (const item of items) item.github = { ...item.github, ...patch };
      saveGhLive(key, etag || null, patch);
      updated++;
    }
    if (updated) {
      if (state.meta) state.meta.lastGithubSync = new Date().toISOString();
      renderAll();
    }
  } finally {
    ghLive.busy = false;
  }
}

// ---------- render ----------
function renderAll() {
  renderBanner();
  renderMeta();
  renderOverview();
  populateFilters();
  renderSkills();
  renderMcp();
  renderCategories();
  renderRepos();
  renderCli();
}

function renderMeta() {
  const m = state.meta;
  $('#sync-info').textContent = m ? t('meta.sync', { d: fmtDate(m.lastGithubSync) }) : '';
}

function renderBanner() {
  const slot = $('#banner-slot');
  slot.replaceChildren();
  if (state.loading) { slot.append(el('div', { class: 'banner' }, t('banner.loading'))); return; }
  if (state.loadError) {
    slot.append(el('div', { class: 'banner error', role: 'alert' },
      t('banner.error', { e: state.loadError })));
    return;
  }
  const m = state.meta;
  if (m?.githubRateLimited) {
    slot.append(el('div', { class: 'banner', role: 'status' },
      t('banner.rate', { d: fmtDate(m.lastGithubSync) })));
  }
  if (m?.scanErrors?.length) {
    slot.append(el('div', { class: 'banner', role: 'status' },
      t('banner.scanWarn', { n: m.scanErrors.length })));
  }
}

function renderOverview() {
  const m = state.meta;
  const c = m?.counts || {};
  const kpis = [
    [t('kpi.skills'), c.skills ?? '—', t('kpi.skills.hint', { n: c.skillsInstalled ?? 0 })],
    [t('kpi.mcp'), c.mcp ?? '—', t('kpi.mcp.hint', { n: c.mcpConfigured ?? 0 })],
    [t('kpi.verRepos'), c.reposVerified ?? '—', t('kpi.verRepos.hint', { n: c.reposUnverified ?? 0 })],
    [t('kpi.tested'), c.tested ?? '—', t('kpi.tested.hint')],
    [t('kpi.categories'), c.categories ?? '—', t('kpi.categories.hint')],
    [t('kpi.unver'), (c.partial ?? 0) + (c.unverified ?? 0), t('kpi.unver.hint')],
  ];
  $('#kpis').replaceChildren(...kpis.map(([label, value, hint]) =>
    el('div', { class: 'kpi' },
      el('div', { class: 'label', text: label }),
      el('div', { class: 'value', text: String(value) }),
      el('div', { class: 'hint', text: hint }))));

  const maxTotal = Math.max(1, ...state.categories.map(x => x.total));
  $('#ov-cats').replaceChildren(...state.categories.map(c2 =>
    el('tr', { tabindex: '0', onclick: () => go('categories'), onkeydown: e => e.key === 'Enter' && go('categories') },
      el('td', { class: 'name', text: c2.name }),
      el('td', { class: 'mono', text: String(c2.skills) }),
      el('td', { class: 'mono', text: String(c2.mcp) }),
      el('td', { class: 'mono', text: `${c2.total} / ${maxTotal}` }),
      el('td', { class: 'mono', text: String(c2.verified) }))));
}

// ---------- filters ----------
function populateFilters() {
  for (const scope of ['skills', 'mcp']) {
    const root = $(`.filters[data-scope="${scope}"]`);
    if (!root) continue;
    const items = scope === 'skills' ? state.skills : state.mcp;
    const cats = [...new Set(items.map(i => i.category))].sort();
    const statuses = [...new Set(items.map(i => i.status))].sort();
    const srcKey = i => scope === 'skills'
      ? (i.github?.owner ? `${i.github.owner}/${i.github.repo}` : 'local')
      : i;
    const sources2 = [...new Set(items.map(srcKey))].sort();
    fillSelect($('[data-filter="category"]', root), cats, catLabel);
    fillSelect($('[data-filter="status"]', root), statuses, s =>
      lang === 'vi' ? (I18N.vi['status.' + s] || s) : s);
    fillSelect($('[data-filter="source"]', root), sources2);
  }
}
function fillSelect(sel, values, labelFn) {
  if (!sel) return;
  const cur = sel.value;
  const lab = labelFn || (v => v);
  sel.replaceChildren(el('option', { value: '' }, t('common.all')), ...values.map(v => el('option', { value: v }, lab(v))));
  sel.value = values.includes(cur) ? cur : '';
}

function readFilters(scope) {
  const root = $(`.filters[data-scope="${scope}"]`);
  const f = {};
  if (!root) return f;
  $$('[data-filter]', root).forEach(input => {
    const key = input.dataset.filter;
    f[key] = input.type === 'checkbox' ? input.checked : input.value;
  });
  const sortSel = $('[data-sort]', root);
  if (sortSel) state.sorts[scope] = sortSel.value;
  return f;
}

function applyFilters(items, f, scope) {
  return items.filter(it => {
    if (!matchesQuery(state.query, it.name, it.displayName, it.description, it.purpose,
      purposeText(it, scope === 'mcp' ? 'mcp' : 'skill'),
      it.category, (it.tags || []).join(' '),
      scope === 'mcp' ? (it.hosts || []).join(' ') : '', it.command, it.package)) return false;
    if (f.category && it.category !== f.category) return false;
    if (f.status && it.status !== f.status) return false;
    if (f.source) {
      const key = scope === 'skills'
        ? (it.github?.owner ? `${it.github.owner}/${it.github.repo}` : 'local')
        : it;
      const list = scope === 'skills' ? [key] : (it.hosts || []);
      if (!list.includes(f.source)) return false;
    }
    if (f.hasGithub && !(it.github?.owner && !it.github.error)) return false;
    if (f.verified && it.verification?.status !== 'verified') return false;
    if (f.tested && !it.effectiveness?.tested) return false;
    return true;
  });
}

function sortItems(items, key) {
  const arr = [...items];
  const stars = x => (typeof x.github?.stars === 'number' ? x.github.stars : -1);
  const eff = x => (x.effectiveness?.score ?? -1);
  const upd = x => Date.parse(x.github?.lastCommit || 0) || 0;
  const cmp = {
    name: (a, b) => a.name.localeCompare(b.name),
    stars: (a, b) => stars(b) - stars(a) || a.name.localeCompare(b.name),
    effectiveness: (a, b) => eff(b) - eff(a) || a.name.localeCompare(b.name),
    updated: (a, b) => upd(b) - upd(a) || a.name.localeCompare(b.name),
    status: (a, b) => String(a.status).localeCompare(String(b.status)) || a.name.localeCompare(b.name),
    category: (a, b) => String(a.category).localeCompare(String(b.category)) || a.name.localeCompare(b.name),
  };
  return arr.sort(cmp[key] || cmp.name);
}

function linksCell(item) {
  return el('span', { class: 'badges' },
    linkBtn('GitHub', item.repoUrl),
    linkBtn(t('dr.docsBtn'), item.docsUrl),
    linkBtn(t('dr.pkgBtn'), item.packageUrl));
}

// ---------- lists ----------
function isExpanded(key) {
  return !!state.query || state.expanded.has(key);
}
function toggleExpand(key) {
  if (state.expanded.has(key)) state.expanded.delete(key);
  else state.expanded.add(key);
  renderSkills();
}

function repoGroupLabel(repoUrl) {
  return (repoUrl || '').split('/').pop().replace(/\.git$/, '');
}

function groupSample(items) {
  return items.find(i => i.github?.owner && typeof i.github.stars === 'number')
    || items.find(i => i.repoUrl)
    || items[0];
}

function groupSkillRows(rows, sortKey) {
  const kidsOf = new Map();
  const roots = [];
  for (const it of rows) {
    if (it.parent && it.parent !== it.name) {
      if (!kidsOf.has(it.parent)) kidsOf.set(it.parent, []);
      kidsOf.get(it.parent).push(it);
    } else roots.push(it);
  }
  const tops = [];
  const repoBuckets = new Map();
  for (const r of roots) {
    const kids = kidsOf.get(r.name);
    if (kids && kids.length) {
      const expanded = isExpanded(r.name);
      const entries = [{ kind: 'group', name: r.name, count: kids.length + 1, expanded, childKey: r.name, sample: r }];
      if (expanded) sortItems(kids, sortKey).forEach(k => entries.push({ kind: 'item', item: k, depth: 1, groupLabel: r.name }));
      tops.push({ label: r.name, entries });
      kidsOf.delete(r.name);
      continue;
    }
    if (r.repoUrl) {
      if (!repoBuckets.has(r.repoUrl)) repoBuckets.set(r.repoUrl, []);
      repoBuckets.get(r.repoUrl).push(r);
    } else {
      tops.push({ label: r.name, entries: [{ kind: 'item', item: r, depth: 0, expandable: false, expanded: false, childKey: null }] });
    }
  }
  for (const [repo, items] of repoBuckets) {
    const key = `repo:${repo}`;
    const name = repoGroupLabel(repo);
    const expanded = isExpanded(key);
    const entries = [{ kind: 'group', name, count: items.length, expanded, childKey: key, sample: groupSample(items) }];
    if (expanded) sortItems(items, sortKey).forEach(k => entries.push({ kind: 'item', item: k, depth: 1, groupLabel: name }));
    tops.push({ label: name, entries });
  }
  for (const pname of [...kidsOf.keys()]) {
    const kids = kidsOf.get(pname);
    const expanded = isExpanded(pname);
    const entries = [{ kind: 'group', name: pname, count: kids.length, expanded, childKey: pname, sample: groupSample(kids) }];
    if (expanded) sortItems(kids, sortKey).forEach(k => entries.push({ kind: 'item', item: k, depth: 1, groupLabel: pname }));
    tops.push({ label: pname, entries });
  }
  tops.sort((a, b) => a.label.localeCompare(b.label));
  return tops.flatMap(t => t.entries);
}

function renderSkills() {
  const f = readFilters('skills');
  const rows = sortItems(applyFilters(state.skills, f, 'skills'), state.sorts.skills);
  $(`.filters[data-scope="skills"] [data-count]`).textContent = `${rows.length} / ${state.skills.length}`;
  const grouped = groupSkillRows(rows, state.sorts.skills);
  const tbody = $('#skills-rows');
  tbody.replaceChildren(...grouped.map(entry => {
    if (entry.kind === 'group') {
      const g = entry.sample || {};
      return el('tr', {
        class: 'group-row expandable', tabindex: '0', role: 'button',
        'aria-expanded': String(!!entry.expanded),
        'aria-label': `${entry.expanded ? t('skill.collapse') : t('skill.expand')}: ${entry.name}`,
        onclick: () => toggleExpand(entry.childKey),
        onkeydown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(entry.childKey); } },
      },
        el('td', { class: 'name' },
          el('span', { class: 'chev', 'aria-hidden': 'true' }, entry.expanded ? '▾' : '▸'),
          ' ', `${entry.name} (${entry.count})`),
        el('td', null, badge(catLabel(g.category || '—'), 'accent')),
        el('td', { class: 'dim' }, el('div', { class: 'purpose' + (g.id === 'skill-ponytail' ? ' strong' : ''), text: purposeSummary(g) })),
        el('td', null, starsCell(g.github || {})),
        el('td', null, linksCell(g)),
        el('td', null, g.name ? el('button', {
          class: 'btn btn-sm', type: 'button', text: t('drawer.detail'),
          onclick: e => { e.stopPropagation(); openDrawer('skill', g); },
        }) : null));
    }
    const s = entry.item;
    const onParentClick = entry.expandable
      ? () => toggleExpand(entry.childKey)
      : () => openDrawer('skill', s);
    return el('tr', {
      tabindex: '0', role: 'button',
      'aria-expanded': entry.expandable ? String(!!entry.expanded) : null,
      'aria-label': entry.expandable
        ? `${entry.expanded ? t('skill.collapse') : t('skill.expand')}: ${s.name}`
        : t('openDetails', { n: s.name }),
      class: entry.depth ? 'depth-1' : (entry.expandable ? 'expandable' : null),
      onclick: onParentClick,
      onkeydown: e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onParentClick(); }
      },
    },
      el('td', { class: 'name' },
        entry.expandable ? el('span', { class: 'chev', 'aria-hidden': 'true' }, entry.expanded ? '▾' : '▸') : null,
        ' ',
        s.name,
        entry.depth
          ? el('div', { class: 'sub' }, t('skill.parent', { p: entry.groupLabel || s.parent || '' }))
          : null),
      el('td', null, badge(catLabel(s.category), 'accent')),
      el('td', { class: 'dim' }, el('div', { class: 'purpose' + (s.id === 'skill-ponytail' ? ' strong' : ''), text: purposeSummary(s) })),
      el('td', null, starsCell(s.github)),
      el('td', null, linksCell(s)),
      el('td', null, el('button', {
        class: 'btn btn-sm', type: 'button', text: t('drawer.detail'),
        onclick: e => { e.stopPropagation(); openDrawer('skill', s); },
      })));
  }));
  const empty = $('#skills-empty');
  empty.replaceChildren();
  if (!state.loading && !state.loadError && rows.length === 0)
    empty.append(emptyState(t('empty.skills'), t('empty.skillsHint')));
}

function renderMcp() {
  const f = readFilters('mcp');
  const rows = sortItems(applyFilters(state.mcp, f, 'mcp'), state.sorts.mcp);
  $(`.filters[data-scope="mcp"] [data-count]`).textContent = `${rows.length} / ${state.mcp.length}`;
  const tbody = $('#mcp-rows');
  tbody.replaceChildren(...rows.map(m => el('tr', {
    tabindex: '0', role: 'button', 'aria-label': t('openDetails', { n: m.name }),
    onclick: () => openDrawer('mcp', m),
    onkeydown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer('mcp', m); } },
  },
    el('td', { class: 'name' }, m.name),
    el('td', null, badge(catLabel(m.category), 'accent')),
    el('td', { class: 'mono' }, m.transport),
    el('td', { class: 'mono dim' }, String(m.tools?.length ?? 0)),
    el('td', null, starsCell(m.github)),
    el('td', null, linksCell(m)))));
  const empty = $('#mcp-empty');
  empty.replaceChildren();
  if (!state.loading && !state.loadError && rows.length === 0)
    empty.append(emptyState(t('empty.mcp'), t('empty.mcpHint')));
}

function renderCategories() {
  $('#cat-grid').replaceChildren(...state.categories.map(c =>
    el('div', { class: 'card' },
      el('h3', { text: catLabel(c.name) }),
      el('div', { class: 'meta' }, t('cat.meta', { t: c.total, s: c.skills, m: c.mcp, v: c.verified })),
      el('div', { class: 'cat-bar', role: 'img', 'aria-label': `${c.skills} / ${c.mcp}` },
        el('span', { class: 's', style: `width:${(c.skills / c.total) * 100}%` }),
        el('span', { class: 'm', style: `width:${(c.mcp / c.total) * 100}%` })),
      el('div', { class: 'row-actions' },
        el('button', {
          class: 'btn btn-sm', type: 'button',
          onclick: () => { setFilter('skills', 'category', c.name); go('skills'); },
        }, t('cat.viewSkills')),
        el('button', {
          class: 'btn btn-sm', type: 'button',
          onclick: () => { setFilter('mcp', 'category', c.name); go('mcp'); },
        }, t('cat.viewMcp'))))));
}

function repoAgg() {
  const map = new Map();
  const push = (item) => {
    const g = item.github;
    if (!g?.owner) return;
    const key = `${g.owner}/${g.repo}`;
    if (!map.has(key)) map.set(key, {
      owner: g.owner, repo: g.repo, url: item.repoUrl || `https://github.com/${g.owner}/${g.repo}`,
      ...g, usedBy: [],
    });
    map.get(key).usedBy.push(item.name);
  };
  state.skills.forEach(push);
  state.mcp.forEach(push);
  return [...map.values()];
}

function renderRepos() {
  const root = $('.filters[data-scope="repos"]');
  const sortKey = $('[data-sort]', root)?.value || 'stars';
  state.sorts.repos = sortKey;
  const items = sortItems(repoAgg().map(r => ({ ...r, name: `${r.owner}/${r.repo}`, effectiveness: { score: null }, status: '' })), sortKey);
  const filtered = items.filter(r => matchesQuery(state.query, r.owner, r.repo, r.language, r.license, r.usedBy.join(' ')));
  $('[data-count]', root).textContent = `${filtered.length} / ${items.length}`;
  $('#repo-rows').replaceChildren(...filtered.map(r => el('tr', {
    tabindex: '0', onclick: () => { const u = sanitizeUrl(r.url); if (u) window.open(u, '_blank', 'noopener'); },
    onkeydown: e => { if (e.key === 'Enter') { const u = sanitizeUrl(r.url); if (u) window.open(u, '_blank', 'noopener'); } },
    'aria-label': t('openRepo', { n: `${r.owner}/${r.repo}` }),
  },
    el('td', { class: 'name mono' }, `${r.owner}/${r.repo}`),
    el('td', null, starsCell(r)),
    el('td', { class: 'mono' }, r.forks != null ? String(r.forks) : '—'),
    el('td', null, badge(r.language || '—')),
    el('td', { class: 'mono' }, r.license || '—'),
    el('td', { class: 'mono' }, r.latestRelease || '—'),
    el('td', { class: 'mono dim nowrap' }, fmtDate(r.lastCommit)),
    el('td', { class: 'dim' }, t('row.items', { n: r.usedBy.length })))));
  const empty = $('#repo-empty');
  empty.replaceChildren();
  if (!state.loading && !state.loadError && filtered.length === 0)
    empty.append(emptyState(t('empty.repos'), t('empty.reposHint')));
}

// ---------- drawer ----------
let lastFocus = null;
function openDrawer(kind, item) {
  lastFocus = document.activeElement;
  const drawer = $('#drawer');
  const overlay = $('#overlay');
  drawer.hidden = false; overlay.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add('open'); overlay.classList.add('open'); });
  $('#drawer-title').textContent = item.displayName || item.name;
  $('#drawer-body').replaceChildren(...drawerSections(kind, item));
  $('#drawer-close').focus();
  document.addEventListener('keydown', drawerKeys);
}
function closeDrawer() {
  const drawer = $('#drawer');
  const overlay = $('#overlay');
  if (drawer.hidden) return;
  drawer.classList.remove('open'); overlay.classList.remove('open');
  document.removeEventListener('keydown', drawerKeys);
  setTimeout(() => { drawer.hidden = true; overlay.hidden = true; }, 180);
  if (lastFocus?.focus) lastFocus.focus();
}
function drawerKeys(e) {
  if (e.key === 'Escape') { closeDrawer(); return; }
  if (e.key !== 'Tab') return;
  const focusables = $$('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])', $('#drawer'))
    .filter(n => !n.disabled && n.offsetParent !== null);
  if (!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function kv(pairs) {
  return el('dl', { class: 'kv' }, ...pairs.flatMap(([k, v]) =>
    v == null || v === '' || v === false ? [] : [el('dt', { text: k }), el('dd', { text: String(v) })]));
}
function section(title, ...content) {
  return el('section', null, el('h3', { text: title }), ...content);
}

function drawerSections(kind, item) {
  const out = [];
  out.push(section(t('dr.status'),
    el('div', { class: 'badges' },
      verifyBadge(item.verification.status),
      badge(item.effectiveness?.tested ? t('dr.testedOn') : t('dr.testedOff'), item.effectiveness?.tested ? 'ok' : 'warn'),
      badge(catLabel(item.category), 'accent')),
    kind === 'skill' && item.parent && item.parent !== item.name ? (() => {
      const parent = findParentSkill(item);
      if (!parent) return null;
      return el('div', { class: 'row-actions', style: 'margin-top:6px' },
        el('button', {
          class: 'btn btn-sm', type: 'button', text: t('skill.openParent', { p: item.parent }),
          onclick: () => openDrawer('skill', parent),
        }));
    })() : null));

  if (kind === 'skill') {
    const children = findChildSkills(item);
    if (children.length) {
      out.push(section(t('dr.children', { n: children.length }),
        el('div', { class: 'row-actions' },
          ...children.map(c => el('button', {
            class: 'btn btn-sm', type: 'button', text: c.name,
            onclick: () => openDrawer('skill', c),
          })))));
    }
  }

  const purposeDetailText = purposeDetail(item, kind);
  if (purposeDetailText) {
    out.push(section(t('dr.purpose'),
      el('p', { style: 'margin:0;white-space:pre-line', text: purposeDetailText }),
      item.repoUrl ? el('div', { class: 'row-actions', style: 'margin-top:6px' },
        linkBtn(t('dr.purposeSrc'), item.repoUrl)) : null));
  }

  if (kind === 'skill') {
    out.push(section(t('dr.install'), item.installCommand
      ? el('pre', { class: 'snippet', text: item.installCommand })
      : el('p', { class: 'dim', style: 'margin:0', text: t('dr.noInstall') }),
      item.installCommand ? el('div', { class: 'row-actions' },
        el('button', { class: 'btn btn-sm', type: 'button', onclick: e => copyText(item.installCommand, e.target) }, t('dr.copyInstall'))) : null));
  } else {
    out.push(section(t('dr.config'),
      kv([
        [t('dr.transport'), item.transport],
        [t('dr.hosts'), (item.hosts || []).join(', ')],
        [t('dr.command'), item.command],
        [t('dr.args'), (item.args || []).join(' ')],
        [t('dr.package'), item.package ? `${item.package}${item.version ? '@' + item.version : ''}` : null],
        [t('dr.pkgMgr'), item.packageManager],
        [t('dr.auth'), item.authRequired ? (item.authMethod || t('dr.authReq')) : t('dr.authNo')],
      ]),
      item.configSnippet ? el('pre', { class: 'snippet', text: item.configSnippet }) : null,
      el('div', { class: 'row-actions' },
        item.configSnippet ? el('button', { class: 'btn btn-sm', type: 'button', onclick: e => copyText(item.configSnippet, e.target) }, t('dr.copyConfig')) : null,
        item.command ? el('button', {
          class: 'btn btn-sm', type: 'button',
          onclick: e => copyText(`${item.command} ${(item.args || []).join(' ')}`.trim(), e.target),
        }, t('dr.copyCmd')) : null)));
    out.push(section(t('dr.install'), item.installCommand
      ? el('pre', { class: 'snippet', text: item.installCommand })
      : el('p', { class: 'dim', style: 'margin:0', text: t('dr.noPkgInstall') }),
      item.installCommand ? el('div', { class: 'row-actions' },
        el('button', { class: 'btn btn-sm', type: 'button', onclick: e => copyText(item.installCommand, e.target) }, t('dr.copyInstall'))) : null));
    out.push(section(t('dr.tools'),
      el('p', { style: 'margin:0', class: 'dim', text: item.enumerationNote || t('dr.notEnum') })));
  }

  const g = item.github;
  out.push(section(t('dr.github'),
    g.owner && !g.error ? kv([
      [t('dr.repo'), `${g.owner}/${g.repo}`],
      [t('dr.starsExact'), typeof g.stars === 'number' ? String(g.stars) : t('status.unknown')],
      [t('dr.starsFmt'), typeof g.stars === 'number' ? fmtStars(g.stars) : t('status.unknown')],
      [t('dr.forks'), g.forks != null ? String(g.forks) : null],
      [t('dr.issues'), g.issues != null ? String(g.issues) : null],
      [t('dr.license'), g.license],
      [t('dr.language'), g.language],
      [t('dr.lastPush'), g.lastCommit ? fmtDate(g.lastCommit) : null],
      [t('dr.latestRel'), g.latestRelease],
      [t('dr.fetchedAt'), g.starsFetchedAt ? fmtDate(g.starsFetchedAt) : null],
    ]) : el('p', { style: 'margin:0', class: 'dim', text: g.starsReason || t('dr.repoFail') }),
    el('div', { class: 'row-actions' },
      linkBtn(t('dr.repoBtn'), item.repoUrl),
      linkBtn(t('dr.docsBtn'), item.docsUrl),
      linkBtn(t('dr.pkgBtn'), item.packageUrl),
      g.owner && !g.error && item.github?.latestRelease
        ? linkBtn(t('dr.relBtn'), `https://github.com/${g.owner}/${g.repo}/releases`) : null)));

  if (item.descriptionInferred) {
    out.push(section(t('dr.note'), el('p', { class: 'dim', style: 'margin:0', text: t('dr.inferred') })));
  }
  return out;
}

const CLIS = [
  {
    id: 'opencode',
    name: 'OpenCode',
    slug: 'opencode',
    bin: 'opencode',
    docs: 'https://opencode.ai',
    cmds: [
      ['npm', 'npm install -g @opencode-ai/cli@next'],
      ['script', 'curl -fsSL https://raw.githubusercontent.com/opencode-ai/opencode/refs/heads/main/install | bash'],
      ['Homebrew', 'brew install opencode-ai/tap/opencode'],
    ],
  },
  {
    id: 'codex',
    name: 'Codex',
    slug: 'openai',
    bin: 'codex',
    docs: 'https://github.com/openai/codex',
    cmds: [
      ['npm', 'npm install -g @openai/codex'],
      ['Homebrew', 'brew install --cask codex'],
    ],
  },
  {
    id: 'antigravity',
    name: 'Antigravity CLI',
    slug: 'antigravity',
    bin: 'agy',
    docs: 'https://antigravity.google',
    cmds: [
      ['macOS/Linux', 'curl -fsSL https://antigravity.google/cli/install.sh | bash'],
      ['Windows', 'install.cmd → ~/.local/bin/agy'],
    ],
  },
  {
    id: 'mimo',
    name: 'MiMo Code CLI',
    slug: 'mimo',
    bin: 'mimo',
    docs: 'https://mimo.xiaomi.com',
    cmds: [
      ['macOS/Linux', 'curl -fsSL https://mimo.xiaomi.com/install | bash'],
      ['Windows', 'powershell -ep Bypass -c "irm https://mimo.xiaomi.com/install.ps1 | iex"'],
      ['npm', 'npm install -g @mimo-ai/cli'],
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek CLI',
    slug: 'deepseek',
    bin: 'deepseek',
    docs: 'https://pypi.org/project/deepseek-cli/',
    cmds: [
      ['pip', 'pip install deepseek-cli'],
    ],
    note: 'Gói cộng đồng trên PyPI (PierrunoYT) — không phải CLI chính thức của DeepSeek.',
    noteEn: 'Community package on PyPI (PierrunoYT) — not DeepSeek’s official CLI.',
  },
  {
    id: 'claude',
    name: 'Claude Code',
    slug: 'anthropic',
    bin: 'claude',
    docs: 'https://github.com/anthropics/claude-code',
    cmds: [
      ['npm', 'npm install -g @anthropic-ai/claude-code'],
    ],
  },
  {
    id: 'aider',
    name: 'Aider',
    slug: 'aider',
    bin: 'aider',
    docs: 'https://aider.chat',
    cmds: [
      ['pip', 'python -m pip install aider-install && aider-install'],
    ],
  },
];

function cliLogo(slug, name) {
  const fb = el('span', { class: 'cli-logo fb', 'aria-hidden': 'true', text: name[0] });
  if (!slug) return fb;
  const img = el('img', {
    class: 'cli-logo', src: `https://cdn.simpleicons.org/${slug}`, alt: '',
    width: '24', height: '24', loading: 'lazy', decoding: 'async',
  });
  img.addEventListener('error', () => img.replaceWith(fb));
  return img;
}

function renderCli() {
  const root = $('#cli-grid');
  if (!root) return;
  root.replaceChildren(...CLIS.map(c => el('div', { class: 'card' },
    el('div', { class: 'cli-head' },
      cliLogo(c.slug, c.name),
      el('h3', { text: c.name })),
    ...c.cmds.map(([label, cmd]) => el('div', { class: 'cli-cmd' },
      el('div', { class: 'cli-cmd-label mono', text: label }),
      el('pre', { class: 'snippet', text: cmd }),
      el('div', { class: 'row-actions' },
        el('button', {
          class: 'btn btn-sm', type: 'button',
          onclick: e => copyText(cmd, e.target),
        }, t('cli.copy'))))),
    c.note ? el('p', { class: 'meta dim', text: lang === 'vi' ? c.note : (c.noteEn || c.note), style: 'margin:8px 0 0' }) : null,
    el('div', { class: 'row-actions' },
      el('span', { class: 'meta mono dim', text: `${t('cli.bin')}${c.bin}` }),
      linkBtn(t('cli.docs'), c.docs)))));
}

// ---------- nav ----------
function go(view) {
  state.view = view;
  $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
  $$('.nav button').forEach(b => {
    const active = b.dataset.view === view;
    b.setAttribute('aria-current', active ? 'page' : 'false');
    if (!active) b.removeAttribute('aria-current');
  });
  if (view === 'repos') renderRepos();
}
function setFilter(scope, key, value) {
  const root = $(`.filters[data-scope="${scope}"]`);
  const input = root && $(`[data-filter="${key}"]`, root);
  if (input) { input.value = value; if (input.type === 'checkbox') input.checked = !!value; }
}

// ---------- events ----------
function bind() {
  $$('.nav button').forEach(b => b.addEventListener('click', () => go(b.dataset.view)));
  $$('.lang-btn').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang !== lang) setLang(b.dataset.lang);
  }));
  const onQuery = debounce(v => {
    state.query = v;
    renderSkills(); renderMcp(); renderRepos();
  }, 150);
  $('#global-search').addEventListener('input', e => onQuery(e.target.value));

  for (const scope of ['skills', 'mcp', 'repos']) {
    const root = $(`.filters[data-scope="${scope}"]`);
    if (!root) continue;
    root.addEventListener('change', () => {
      if (scope === 'skills') renderSkills();
      else if (scope === 'mcp') renderMcp();
      else renderRepos();
    });
  }
  $$('th[data-th]').forEach(th => {
    th.addEventListener('click', () => {
      const scope = th.closest('.view').id.replace('view-', '');
      state.sorts[scope] = th.dataset.th;
      const root = $(`.filters[data-scope="${scope}"] [data-sort]`);
      if (root && [...root.options].some(o => o.value === th.dataset.th)) root.value = th.dataset.th;
      if (scope === 'skills') renderSkills();
      else if (scope === 'mcp') renderMcp();
      else renderRepos();
    });
  });

  $('#drawer-close').addEventListener('click', closeDrawer);
  $('#overlay').addEventListener('click', closeDrawer);
}

document.documentElement.lang = lang;
$$('.lang-btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
applyStaticI18n();
bind();
load();
