# Objective

Deploy "Skill & MCP Inventory Dashboard" (`C:\Users\Tan\Downloads\new\web\skill-mcp-inventory`) thành static web production an toàn theo `TASK_DEPLOY_WEB_REMOVE_PERSONAL_DATA.md` (Phase 1–10: backup → scan → làm sạch → sanitize pipeline → build/test → privacy gate → deploy → post-deploy → report), kèm UI/i18n purpose VI-EN.

# Important Details

- User language: Vietnamese — trả lời tiếng Việt; ponytail mode `full`.
- Spec: không bịa dữ liệu (stars cần `starsFetchedAt`; stars không là input effectiveness); secrets/home-path redact; tests privacy phải pass trước deploy.
- Test: `node --test tests/*.test.mjs` — chạy tuần tự sau `inventory:all` (không song song; race `data/*.json`).
- Sau sửa discovery: `npm run inventory:all` (không chỉ `inventory:build`); sau sửa app.js: `node --check public/app.js`.
- User: **không lạm dụng skill trình duyệt** — chỉ xài browser khi cần; báo reload thay vì verify tự động.
- Serve: `scripts/serve.mjs` port **4173**; i18n dict `I18N` trong app.js; `localStorage['inv-lang']` mặc định `'vi'`.
- **Không phải git repo** — deploy target do user chọn; lần hỏi gần nhất user chọn **"Chưa deploy"**.
- 9 skill không repo **giữ loại** khỏi web (`data/skills-no-repo.json`): `banner-design, brand, browser-use, design, design-system, find-skills, img2threejs, slides, ui-styling`.
- Leaks đã fix: `configSnippet` home-path (root-cause: build snippet không qua `redactHome`; JSON-escaped path cần parse JSON rồi sanitize node); `meta.json` có os/node/skillRoots.path; skills có skillPath/paths/locations.path; sources skillRoots.path; command `~\AppData\...`.
- `SECRET_KEY` đỏ exact/suffix: `/(^|_)(api[_-]?key|key|token|secret|password|passwd|auth|authorization|credential|cookie|session)s?$/i` — match `GITHUB_TOKEN` nhưng không redact nhầm `configKey`.
- Drive root (`C:\`) trong snippet → `basenamePath` trả `'.'`.
- GitHub: `gh` login `Tpthinh228` (repo scope); repos: `tpthinh228.github.io`, `NTE`.

# Work State

## Completed

- Phase 1: backup 36 file → `C:\Users\Tan\Downloads\new\web\backup-skill-mcp-20260923-150913`.
- Phase 2: quét — 43 path match, 0 email, 0 secret thật.
- Phase 3–4 code:
  - `scripts/discover-mcp.mjs`: configSnippet/command/args qua `redactHome`.
  - `scripts/lib.mjs`: `SECRET_KEY` suffix-match (GITHUB_TOKEN pass, configKey không).
  - `scripts/build-inventory.mjs`: `sanitizeSkillForPublic`, `sanitizeMcpForPublic` + `basenamePath` + `sanitizeSnippetPaths`, `sanitizeMetaForPublic` (bỏ os/node/skillRoots), `sanitizeSourcesForPublic` (skillRoots chỉ label); copy sang `public/data/` qua sanitize.
  - `public/app.js`: ẩn dòng env nếu thiếu `meta.os`/`meta.node`.
  - `tests/security.test.mjs`: test `'public payload has no absolute local paths or machine metadata'`.
- Phase 5: full `inventory:all` → **78 skills** (9 no-repo excluded), **7 mcp**, 10 categories, 84 stars; `node --check` OK; **25/25 tests pass**.
- Phase 6 privacy gate `public/`: grep `C:\Users|AppData|/home/|/Users/|tokens|email` → **CLEAN**; 6 JSON valid; skillsNoPath=0; artifact 9 file ~370KB.
- Local preview: health 200, index 200, skills/meta 200 trên `:4173`.
- User quyết: **Chưa deploy**; **giữ loại 9 skill không repo**.

## Active / Blocked

- Phase 7–10 **chưa làm** — chờ lệnh deploy + target (repo mới + Pages / subfolder `tpthinh228.github.io` / hosting khác).
- `DEPLOY_PRIVACY_REPORT.md` chưa viết (Phase 10, sau deploy).

# Next Move

1. Khi user bảo deploy: chọn target → push **chỉ `public/`** → bật Pages → Phase 8 post-check URL nhạy cảm (`/.env`, `/package.json`, …) → Phase 10 `DEPLOY_PRIVACY_REPORT.md`.
2. Không deploy khi privacy gate FAIL.

# Relevant Files

| Path | Role |
|------|------|
| `..\TASK_DEPLOY_WEB_REMOVE_PERSONAL_DATA.md` | Task 10 phase |
| `..\backup-skill-mcp-20260923-150913\` | Backup Phase 1 |
| `scripts\lib.mjs` | `redactHome`, `SECRET_KEY`, `redactValue` |
| `scripts\discover-mcp.mjs` | MCP scan + snippet redact |
| `scripts\build-inventory.mjs` | Sanitize public payload |
| `scripts\serve.mjs` | Preview :4173 |
| `tests\security.test.mjs` | Privacy tests (25 suite) |
| `public\app.js` | SPA + i18n + drawer |
| `public\data\*.json` | Payload đã sanitize (CLEAN) |
| `data\skills-no-repo.json` | 9 skill bị loại |
| `PROGRESS.md` | File này |
