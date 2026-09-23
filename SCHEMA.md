# Data Schema

Mọi field sinh từ scan thật. Rule chung: **không có giá trị nào được suy đoán** — không xác minh được thì để `null` + lý do, không điền placeholder.

## Skill (`data/skills.json`)

| Field | Type | Ý nghĩa / nguồn |
|---|---|---|
| `id` | string | `skill-<slug>` unique |
| `name`, `displayName` | string | từ frontmatter `name` của SKILL.md (fallback: tên thư mục) |
| `category` | string | phân loại theo **nội dung** (score keyword trên name+description+body), không theo tên file |
| `subcategories` | string[] | keyword phụ |
| `purpose` | string | câu đầu của description |
| `description` | string | frontmatter `description` |
| `status` | `installed\|available\|disabled\|unknown` | `installed` nếu tồn tại SKILL.md |
| `scope` | `global\|project\|both\|unknown` | `both` khi skill xuất hiện ở nhiều roots |
| `sourceType` | `local\|github\|npm\|other\|unknown` | `github` khi resolve được repo |
| `repoUrl` | string\|null | chỉ khi có nguồn: git marketplace trong config |
| `installCommand` | string\|null | `git clone <repo>` **chỉ khi** repo verified |
| `skillPath` / `paths` | string | đã redact home → `~` |
| `locations[]` | `{path, root, scope, hasSkillMd}` | mỗi nơi phát hiện |
| `evidence` | object | `hasSkillMd/hasUsage/hasInstall/descriptionPresent/…` — input effectiveness |
| `github` | object | xem §GitHub |
| `effectiveness` | object | xem §Effectiveness |
| `verification` | `{status, sources[], evidence[], lastVerified}` | `verified\|partial\|unverified` |
| `tags` | string[] | = subcategories |

## MCP (`data/mcp.json`)

| Field | Type | Nguồn |
|---|---|---|
| `name` | string | key trong config (`mcpServers.*`, `mcp_servers.*`, `mcp.*`) |
| `status` | `installed\|configured\|available\|disabled\|unknown` | `configured` khi có entry; `disabled` khi `enabled:false` |
| `transport` | `stdio\|sse\|streamable-http\|unknown` | từ config (`type`, `url`, command array) |
| `command`, `args[]` | string | trích từ config, đã redact |
| `package`, `packageManager` | string\|null | suy từ `npx -y <pkg>` / `uvx <pkg>` trong args |
| `packageUrl`, `version` | string\|null | npm/pypi **registry API** |
| `hosts[]` | string[] | tool khai báo config (Claude Code, Codex, OpenCode…) |
| `configPaths[]`, `configSnippet` | string | vị trí + snippet (env secret → `«redacted»`) |
| `installCommand` | string\|null | `npx -y …` / `uvx …` — chỉ suy từ args đã verify |
| `tools/resources/prompts` | array | **luôn `[]`** khi chưa enumerate server thật; ghi `enumerationNote` |
| `authRequired` | bool | chỉ `true` nếu config khai báo |
| `description` | string | từ config evidence; nếu tự suy → `descriptionInferred: true` + ghi rõ trong text |
| `github`, `effectiveness`, `verification` | object | như Skill |

## GitHub block (chung)

```jsonc
{
  "owner": null,            // chỉ có khi fetch OK
  "repo": null,
  "stars": null,            // number CHỈ KHI starsFetchedAt != null, KHÔNG GIẢ
  "forks": null, "issues": null, "license": null, "language": null,
  "lastCommit": null,       // pushed_at
  "latestRelease": null,    // release tag (null nếu repo không có release)
  "starsFetchedAt": null,   // timestamp lần fetch stars
  "error": null,            // "no-repo" | "rate-limited" | "not-found" | message
  "starsReason": null       // lý do stars = unknown / dùng stale cache
}
```

Fallback (rate limit/private): `stars = null`, `starsReason` ghi lý do; nếu cache cũ còn → giữ `cachedStars` + `starsReason = "stale cache (live fetch failed)"`. **Không bao giờ** điền số từ trí nhớ.

## Effectiveness block

```jsonc
{
  "score": 79,              // 0–100 hoặc null (unknown)
  "level": "high|medium|low|unknown",
  "confidence": "low|medium|high",
  "basis": ["…"],           // bằng chứng thật đã dùng
  "tested": false,          // true CHỈ khi smoke test chạy thật
  "components": {           // contribution từng thành phần
    "reliability": 30, "documentation": 25, "maintenance": 20,
    "compatibility": 10, "practical": 5,
    "maxPossible": 80,      // maintenance lack → -20 (loại component, không chấm 0)
    "componentsAvailable": 4
  },
  "framework": "v1 (…; stars excluded)"
}
```

## Files khác

- `categories.json` — `[{name, skills, mcp, total, verified}]`
- `sources.json` — roots/configs/registry APIs đã scan + ghi chú method
- `meta.json` — `lastScan/lastBuilt/lastGithubSync`, OS/node, lỗi scan/GitHub, `counts`
- `github-cache.json` — cache 24h (repo + package→repo)
- `github-errors.json` — lỗi API lần chạy gần nhất (`rateLimited` flag cho UI banner)
