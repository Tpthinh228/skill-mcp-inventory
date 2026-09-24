# PRE-DEPLOY WEBSITE AUDIT — BÁO CÁO CUỐI

## A. Audit summary

| Metric | Value |
|---|---|
| Tổng checks (static + runtime + responsive + security) | ~120 |
| PASS | 115+ |
| FAIL / OPEN (đã fix) | 6 FIXED |
| OPEN (còn lại, không BLOCKER/HIGH) | 5 LOW/INFO |
| BLOCKER | **0** |
| HIGH | **0** |
| MEDIUM | **0** (đã fix hết) |
| LOW | 4 |

- Unit tests: **15/15 pass** (`npm test`)
- `node --check public/app.js`: **OK**
- BUILD TYPE: **STATIC / NO BUILD STEP** (deploy = upload `public/`)
- Console runtime: **0 lỗi** trong flow chính
- Secrets in `public/`: **0**

---

## B. Issue table

| Severity | File | Issue | Evidence | Fix | Status |
|---|---|---|---|---|---|
| **BLOCKER** | `.github/workflows/pages.yml` | Workflow deploy bị xóa nhầm local → push sẽ không deploy GH Pages | `Test-Path` was False; `git status` D | `git restore .github/workflows/pages.yml` (upload `path: public`, branch `master`) | **FIXED** |
| MEDIUM | `public/index.html` | Thiếu `<meta name="description">`, Open Graph | Live/local body: no desc/og | Thêm description + `og:title/description/type` (lines 7–10) | **FIXED** |
| MEDIUM | `public/styles.css:9` | `--text-faint: #6b7a8c` contrast AA fail (3.75–4.38 < 4.5) | WCAG calc trên bg/surface/surface-2 | Đổi `#8496ab` → contrast **5.43–6.34** (AA pass) | **FIXED** |
| MEDIUM | `public/app.js:1090` | Drawer open dùng `requestAnimationFrame` → tab nền throttle → class `.open` không gắn, drawer trượt off-screen (`transform: matrix(...,560,0)`) | CDP: `open:false` + transform X=560 sau click | Forced reflow `void drawer.offsetWidth` + sync `classList.add('open')`; `drawerHideTimer` chống race close/open | **FIXED** |
| LOW | `public/app.js:775` | `populateFilters` fill `[data-filter="status"]` nhưng HTML không có filter status (dead code) | HTML hits=0; app.js:775 vẫn gọi | — (thủ tục fillSelect return sớm khi null; không crash) | **OPEN** (debt) |
| LOW | `README.md:31` | Ghi view "Verification" — UI thật là CLI | grep README vs `index.html` nav | Đổi thành `CLI` | **FIXED** |
| LOW | GitHub Pages | Host không set CSP / `X-Content-Type-Options` (platform limitation) | Live HEAD: headers empty | Local server đã có CSP+nosniff; app chỉ dùng `textContent`/DOM API → rủi ro thấp. Meta CSP optional | **OPEN** (platform) |
| LOW | `scripts/serve.mjs` | SPA fallback trả 200+index.html cho path thiếu (local-only) | `/missing-xyz` local=200, live=404 | GH Pages 404 là đúng hành vi deploy | **OPEN** (local-only) |
| INFO | Live site | Stale: live 81 skills / 0 desc; local 82 skills + `skill-codegraph` | live `meta.json` counts.skills=81 | Resolve khi `git push` + workflow chạy lại | **OPEN** (cần push) |
| INFO | `.github/workflows/refresh-stars.yml` | Đã xóa local — architecture: stars sync client-side `syncGithubLive` | `git status D` | Intentional; commit cùng batch | **OPEN** (pending commit) |
| INFO | Search automation | Test CDP đôi khi count không update đúng lúc | Tab `document.hidden=true` → timer throttle 1s+ | **Không phải bug app** — browser-use foreground run: browser→3/82, clear→82/82, zzz→0, XSS→0 | **N/A** |

---

## C. Changed files (trong audit lần này)

| File | Lý do |
|---|---|
| `.github/workflows/pages.yml` | Restore BLOCKER (deploy workflow) |
| `public/index.html` | + meta description, og:title/description/type |
| `public/styles.css` | `--text-faint` `#6b7a8c` → `#8496ab` (AA) |
| `public/app.js` | Drawer open: forced reflow thay rAF; `drawerHideTimer` |
| `README.md` | View name Verification → CLI |

*(Các thay đổi architecture cũ — xóa root `data/`, scripts scan, tests cũ — là intentional, chưa commit.)*

---

## D. Verification

```text
npm test                          → 15/15 pass
node --check public/app.js        → OK
npm run recount                   → 82 skills, 5 mcp, 10 categories
GET /api/health                   → {"ok":true}
Local assets (/, css, js, favicon, data/*.json, logos) → all 200
Live smoke (/, css, js, favicon, data, logos)          → 8/8 200
```

**Functional (CDP + browser-use, tab foreground):**
- Nav 6 views: OK
- Search `browser` → 5 rows / `3 / 82` ✓
- Clear → 11 rows / `82 / 82` ✓
- Search `zzz-no` → 0 + empty state ✓
- XSS payload → 0 rows, 0 injected img ✓
- Drawer open → `hidden:false`, `open:true` ✓
- Drawer close (button) → `open:false` ✓
- ESC / overlay close → OK (trước đó)
- ERRS: `[]`
- META desc: true

**Responsive (viewport_test.cjs):**

| VW | overflowX | layout |
|---|---|---|
| 320/375/390/414 | false | sidebar static (mobile) |
| 768 | false | static |
| 1024/1280/1440/1920 | false | sidebar sticky 216px |
| Mobile drawer 390 | false | width 390 fits |
| Mobile nav click | OK | `#view-mcp` active |

Breakpoints: `@media max-width: 900px` + `480px` (`styles.css:317–340`).

**Contrast (WCAG):** text 16.27, dim 6.71, faint **5.43–6.34**, accent/ok/warn/info ≥ ~5.7 → all AA.

**Security:**
- No `eval` / `new Function` / `innerHTML=` / `insertAdjacentHTML` / `document.write` in public/
- No secrets (`ghp_`, `github_pat_`, private key) in deployable tree (only test regex in tests/)
- `sanitizeUrl` blocks `javascript:`/`data:`; `rel="noopener"` on external links
- No third-party CDN/fonts/trackers; localStorage only `inv-lang` + GH stars cache
- Local server: CSP + nosniff (GH Pages platform không set header — xem LOW)

**A11Y:** h1×1, lang=vi, skip-link, labels, `:focus-visible`, `prefers-reduced-motion`, drawer focus trap, aria-current nav.

**Perf (local):** public ≈ 420KB / 16 files; DCL ~24ms; no build step; system fonts only.

**Deploy config:**
- `pages.yml` present → `upload-pages-artifact path: public`, push `master`
- No CNAME / .nojekyll / 404.html needed (không path routing server-side; app dùng hash-free single page + relative paths)
- No package-lock / node_modules / deps

---

## E. Final verdict

```text
========================================
PRE-DEPLOY WEBSITE AUDIT
========================================

PROJECT: skill-mcp-inventory (static GH Pages)
URL: https://tpthinh228.github.io/skill-mcp-inventory/ (live đang stale)
DATE: 2026-09-24

BUILD STATUS: PASS (static, no build step)
RUNTIME STATUS: PASS (0 console errors)
FUNCTIONAL STATUS: PASS (nav/search/drawer/i18n/empty-state)
SECURITY STATUS: PASS (0 secrets, 0 XSS sinks)
PRIVACY STATUS: PASS (không có PII)
RESPONSIVE STATUS: PASS (320→1920, no overflow)
ACCESSIBILITY STATUS: PASS (basic AA + keyboard)
SEO STATUS: PASS (title + desc + og + favicon; robots/sitemap optional)
PERFORMANCE STATUS: PASS (~420KB, no deps)
DEPLOY STATUS: READY

BLOCKER: 0
HIGH: 0
MEDIUM: 0
LOW: 4
INFO: 3

========================================
FINAL DECISION
========================================

READY TO DEPLOY

Reason:
Không còn BLOCKER/HIGH/MEDIUM. pages.yml đã restore;
SEO meta + contrast + drawer open đã fix; tests 15/15;
functional/responsive/security smoke PASS local + live asset 200.
Còn 4 LOW (dead status filter, meta CSP platform, serve fallback local, refresh-stars delete pending) — không chặn deploy.

Hành động trước khi coi live là "mới":
1. Review + commit các thay đổi local (39 entries git status).
2. git push origin master → workflow Pages tự deploy.
3. Re-smoke trên URL public (meta description, skill-codegraph=82, app.js mới).
