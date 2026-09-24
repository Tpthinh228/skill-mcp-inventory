# Skill & MCP Inventory Dashboard

Website kiểm kê & phân loại **AI Skills** và **MCP servers** — dữ liệu là các file JSON trong `public/data/`, bạn cập nhật tay theo schema, web chỉ đọc và hiển thị.

## Chạy nhanh

```bash
npm run serve           # → http://localhost:4173
npm test                # data-integrity + security
```

## Cập nhật nội dung

1. Sửa trực tiếp `public/data/skills.json` / `public/data/mcp.json` (mỗi phần tử 1 entry, xem schema trong file sẵn có).
2. `npm run recount` — tự đếm lại `meta.json` → `counts` và `categories.json` từ 2 file danh sách.
3. `npm test` — bắt lỗi lệch counts / sai schema / rò rỉ secret.
4. `git push` — GitHub Pages tự cập nhật.

## Scripts

| Script | Chức năng |
|---|---|
| `npm run serve` | Static server local (CSP + `/api/health`) |
| `npm run recount` | Đọc `public/data/{skills,mcp}.json` → ghi lại `meta.json` counts + `categories.json` |
| `npm test` | `node --test` — data-integrity + security |

Stars/forks tự đồng bộ live trên client mỗi 3 phút (GitHub API, ETag).

## Lượt truy cập (Firebase)

Sidebar hiển thị tổng lượt mở trang (Realtime Database, Spark free):

1. [Firebase Console](https://console.firebase.google.com) → **Add project** (bỏ qua Analytics) → **Realtime Database** → **Create database** (chọn region bất kỳ) → mode **Test mode** tạm thời.
2. **Project settings** → Your apps → **Web** (`</>`) → đăng ký app → copy config → dán vào `public/firebase-config.js`.
3. **Rules** (Realtime Database → Rules) — chỉ cho phép +1, không xoá/ghi tuỳ ý:

```json
{
  "rules": {
    "visitors/count": {
      ".read": true,
      ".write": "!data.exists() || (newData.isNumber() && newData.val() === data.val() + 1)"
    }
  }
}
```

4. `npm run serve` → kiểm tra số trong sidebar hiện lên rồi **Publish** rules.
5. Chưa cấu hình / offline → hiện `—`, không lỗi.

Config web Firebase là public theo thiết kế — Security Rules mới là lớp bảo vệ. Ceiling: rules chặn tăng >1 mỗi lần ghi nhưng không chặn spam nhiều request; nếu cần hạn chế rate, thêm Cloudflare/bỏ qua tuỳ mức độ.

## Bảng điều khiển

Overview · Skills · MCP · Categories · Repositories · CLI — search (debounce 150ms), filter (category/source/has-GitHub/verified/tested), sort (name/stars/effectiveness/updated), detail drawer (focus trap, Esc), copy install/config, empty state, rate-limit banner, responsive (desktop sidebar → mobile top-nav).

Giao diện có 2 ngôn ngữ VI/EN (nút góc header): mục đích skill dịch trong `public/data/purpose-vi.json` (kỹ thuật giữ tiếng Anh); khi VI, cột "Mục đích" bảng cũng dùng bản dịch.

## Deploy

`git push` → GitHub Actions (`.github/workflows/pages.yml`) upload `public/` lên GitHub Pages.

## Hiệu quả (effectiveness)

Framework v1 (field do dữ liệu entry mang theo, **stars không bao giờ là input**):

```
Reliability 30 + Documentation 25 + Maintenance 20 + Compatibility 10 + Practical 15
```

Component Maintenance chỉ tính khi có repo activity verified; thiếu bằng chứng → component bị loại khỏi maxPossible. Chưa test → `tested: false`.

## Security

- Dữ liệu render bằng `textContent`/DOM API (không `innerHTML` với data) → không XSS.
- CSP qua server: `default-src 'self'` (+ `connect-src` cho `api.github.com`), `style-src 'unsafe-inline'`.
- URL phải qua allow-list protocol (`http/https/mailto`) trước khi mở.
- `redactHome`/`redactValue` trong `scripts/lib.mjs`: mask path home → `~`, mask key dạng `*KEY|TOKEN|SECRET|PASS*` → `«redacted»`.
- Test `security.test.mjs` quét `public/data/*.json` không được chứa secret/path máy cá nhân.
- Install command chỉ hiển thị/copy, không bao giờ tự chạy từ browser.

## Cấu trúc

```
skill-mcp-inventory/
├── README.md · AUDIT_REPORT.md · package.json
├── .github/workflows/  # pages.yml (deploy)
├── scripts/            # serve, recount, lib
├── public/             # index.html, app.js, styles.css, logos/ (sticker)
│   └── data/           # skills.json, mcp.json, categories.json, sources.json, meta.json, purpose-vi.json
│   └── firebase-config.js  # config Firebase (điền tay, xem mục "Lượt truy cập")
└── tests/              # data-integrity, security, helpers
```
