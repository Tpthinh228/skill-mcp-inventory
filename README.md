# Skill & MCP Inventory Dashboard

Website kiểm kê & phân loại toàn bộ **AI Skills** và **MCP servers** trong môi trường hiện tại — dữ liệu lấy bằng scan thật từ filesystem/config, không hard-code.

## Chạy nhanh

```bash
npm run inventory:all   # scan + github + verify + build
npm run serve           # → http://localhost:4173
npm test                # discovery/data/security/github tests
```

Hoặc một lệnh: `npm start`.

## Scripts

| Script | Chức năng |
|---|---|
| `npm run inventory:scan` | Quét skill roots + MCP configs → `data/skills.json`, `data/mcp.json` |
| `npm run inventory:github` | Resolve package (npm/pypi registry) → repo → fetch GitHub API (cache 24h) |
| `npm run inventory:verify` | Ghi `verification.status/sources/lastVerified` theo bằng chứng |
| `npm run inventory:build` | Chấm effectiveness + categories + sources + meta, copy sang `public/data/` |
| `npm run inventory:all` | Chạy đủ 4 bước trên |
| `npm run serve` | Static server + `POST /api/rescan` (nút Refresh trong UI) |
| `npm test` | `node --test` — discovery, security, data-integrity, github fallback |

## Nguồn dữ liệu (không bịa)

- **Skills**: `~/.agents/skills`, `~/.claude/skills`, `~/.codex/skills`, `~/.config/opencode/skills`, cache packages opencode (superpowers, ponytail), project-local roots.
- **MCP**: `~/.claude.json`, `~/.codex/config.toml`, `~/.config/opencode/opencode.json(c)`, Claude Desktop config, project `.mcp.json`/`mcp.json`.
- **Stars/repo**: GitHub API (unauthenticated, hoặc `GITHUB_TOKEN` nếu có ở env — **không bao giờ** ghi token vào data). Repo chỉ được resolve từ: (a) git source trong config, (b) `repository` field từ npm/pypi registry.
- Không xác minh được → `stars = null` + lý do (`starsReason`), hiển thị "★ unknown".

## Bảng điều khiển

Overview · Skills · MCP · Categories · Repositories · Verification — search (debounce 150ms), filter (category/status/source/has-GitHub/verified/tested), sort (name/stars/effectiveness/updated), detail drawer (focus trap, Esc), copy install/config, empty state, rate-limit banner, responsive (desktop sidebar → mobile top-nav).

## Hiệu quả (effectiveness)

Framework v1, **stars không bao giờ là input**:

```
Reliability 30 + Documentation 25 + Maintenance 20 + Compatibility 10 + Practical 15
```

Component Maintenance chỉ tính khi có repo activity verified; thiếu bằng chứng → component bị loại khỏi maxPossible (không tự chấm 0 rồi quy về tổng). Chưa test → `tested: false`, basis ghi "no test/demo evidence". Chi tiết: `scripts/build-inventory.mjs`.

## Security

- Dữ liệu render bằng `textContent`/DOM API (không `innerHTML` với data) → không XSS.
- CSP qua server: `default-src 'self'` (+ `style-src 'unsafe-inline'` cho meter width do JS set).
- URL phải qua allow-list protocol (`http/https/mailto`) trước khi mở.
- `redactHome`/`redactValue`: mask `C:\Users\<name>` → `~`, mask key dạng `*KEY|TOKEN|SECRET|PASS*` → `«redacted»`.
- Install command chỉ hiển thị/copy, không bao giờ tự chạy từ browser.
- Path local hiển thị dạng `~/...` trên UI.

## Cấu trúc

```
skill-mcp-inventory/
├── README.md
├── package.json
├── scripts/          # discover-skills, discover-mcp, github-metadata, verify, build-inventory, serve
├── data/             # skills.json, mcp.json, categories.json, sources.json, meta.json + caches
├── public/           # index.html, app.js, styles.css (+ data/ copy khi build)
├── tests/            # discovery, security, data-integrity, github
├── SCHEMA.md         # định nghĩa record
└── INVENTORY_REPORT.md
```
