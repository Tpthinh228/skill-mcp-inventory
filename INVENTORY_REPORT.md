# INVENTORY REPORT

> Sinh từ data thật ngày `2026-09-23T03:04:08.678Z` — không có giá trị nào được suy đoán. Stars chỉ hiển thị khi có `starsFetchedAt`; thiếu → unknown.

## 1. Phương pháp

1. **Discovery** — quét skill roots (`.agents`, `.claude`, `.codex`, opencode config + cache superpowers/ponytail, project roots) đọc frontmatter SKILL.md; quét MCP ở `.claude.json`, `config.toml`, `opencode.json(c)`, Claude Desktop, project `.mcp.json`.
2. **Classification** — score keyword theo nội dung (name+description+body), không theo tên file.
3. **Stars/repo** — chỉ resolve repo từ git source trong config hoặc `repository` field qua npm/pypi registry; fetch GitHub API (cache 24h, fallback `pickGh` khi rate-limit/404). Không fetch được → `stars=null` + `starsReason`.
4. **Verification** — mỗi record có `status/sources/evidence/lastVerified`; home path → `~`, secret → `«redacted»`.
5. **Effectiveness v1** — reliability30 + docs25 + maintenance20 + compat10 + practical15; **stars loại khỏi input**; thiếu bằng chứng → component bị loại khỏi maxPossible; chưa smoke test → `tested:false`.

## 2. Tổng quan

| Metric | Value |
|---|---|
| Skills | 67 (installed 67) |
| MCP servers | 7 (configured 7) |
| Categories | 11 |
| Verified records | 74 / 74 |
| GitHub stars có timestamp | 23 |
| Effectiveness avg | 74/100 |
| high / medium / low+unknown | 10 / 64 / 0 |

## 3. Categories

| Category | Skills | MCP | Verified |
|---|---|---|---|
| Development | 36 | 0 | 36 |
| AI Agent | 13 | 1 | 14 |
| UI/UX | 5 | 0 | 5 |
| Browser / Web | 3 | 1 | 4 |
| Git / GitHub | 4 | 0 | 4 |
| DevOps / Infrastructure | 2 | 1 | 3 |
| Office / Docs | 1 | 2 | 3 |
| Security | 2 | 0 | 2 |
| Data | 1 | 0 | 1 |
| 3D / Creative | 0 | 1 | 1 |
| Other | 0 | 1 | 1 |

## 4. Top skills theo GitHub stars (starsFetchedAt = 2026-09-23T03:04:07.037Z)

| Skill | Stars | Repo | Eff | Verified |
|---|---|---|---|---|
| brainstorming | 290,246 | obra/superpowers | 68 | verified |
| ponytail | 144,482 | DietrichGebert/ponytail | 68 | verified |

## 5. Toàn bộ MCP

| MCP | Category | Stars | Install | Verified |
|---|---|---|---|---|
| blender | 3D / Creative | 29,206 | uvx mcp-for-blender | verified |
| chrome-devtools | Browser / Web | 52,489 | npx -y chrome-devtools-mcp@latest | verified |
| filesystem | DevOps / Infrastructure | 90,555 | npx -y @modelcontextprotocol/server-filesystem | verified |
| gitnexus | Other | unknown (No public repository could be resolved from verified sources.) | — | verified |
| node_repl | AI Agent | unknown (No public repository could be resolved from verified sources.) | — | verified |
| officecli | Office / Docs | unknown (No public repository could be resolved from verified sources.) | — | verified |
| word-document-server | Office / Docs | unknown (No public repository could be resolved from verified sources.) | — | verified |

## 6. Skill theo category

### Development (36)

api-and-interface-design [79], brainstorming [68], code-review-and-quality [79], code-simplification [79], constraint-driven-development [79], debugging-and-error-recovery [79], deprecation-and-migration [79], design-system [79], documentation-and-adrs [79], finishing-a-development-branch [68], frontend-ui-engineering [79], gitnexus-debugging [79], gitnexus-exploring [79], gitnexus-impact-analysis [79], gitnexus-pdg-query [79], gitnexus-plan [60], gitnexus-refactoring [79], gitnexus-review [60], gitnexus-taint-analysis [79], gitnexus-work [60], idea-refine [79], img2threejs [79], incremental-implementation [79], interview-me [79], observability-and-instrumentation [79], ponytail [68], ponytail-audit [68], ponytail-review [83], receiving-code-review [68], requesting-code-review [83], source-driven-development [79], spec-driven-development [79], systematic-debugging [83], test-driven-development [83], verification-before-completion [68], writing-plans [68]

### AI Agent (13)

context-engineering [79], dispatching-parallel-agents [83], executing-plans [68], find-skills [79], gitnexus-guide [60], gitnexus-lfg [60], planning-and-task-breakdown [79], ponytail-gain [68], ponytail-help [68], subagent-driven-development [90], using-agent-skills [60], using-superpowers [68], writing-skills [83]

### UI/UX (5)

banner-design [60], brand [79], design [88], ui-styling [79], ui-ux-pro-max [79]

### Browser / Web (3)

browser-testing-with-devtools [88], browser-use [79], performance-optimization [79]

### Git / GitHub (4)

git-workflow-and-versioning [79], gitnexus-cli [60], ponytail-debt [68], using-git-worktrees [68]

### DevOps / Infrastructure (2)

ci-cd-and-automation [79], shipping-and-launch [79]

### Office / Docs (1)

officecli [69]

### Security (2)

doubt-driven-development [79], security-and-hardening [79]

### Data (1)

slides [79]

## 7. Effectiveness distribution

- **high (10)**: dispatching-parallel-agents, ponytail-review, requesting-code-review, subagent-driven-development, systematic-debugging, test-driven-development, writing-skills, blender, chrome-devtools, filesystem
- **medium (64)**: api-and-interface-design, banner-design, brainstorming, brand, browser-testing-with-devtools, browser-use, ci-cd-and-automation, code-review-and-quality, code-simplification, constraint-driven-development, context-engineering, debugging-and-error-recovery…
- **low/unknown**: 0

## 8. Stars known/unknown

- **Có stars + timestamp**: 23 — brainstorming, dispatching-parallel-agents, executing-plans, finishing-a-development-branch, receiving-code-review, requesting-code-review, subagent-driven-development, systematic-debugging…
- **Unknown**: 51 — lý do: No public repository identified for this skill location.; No public repository could be resolved from verified sources.

## 9. Giới hạn (honest gaps)

1. **MCP tools/prompts/resources = []** — chưa enumerate server thật (không spawn subprocess).
2. **Effectiveness chưa có smoke test** — mọi item `tested:false`, basis từ docs/activity/compat.
3. **Stars unauthenticated** (60 req/h) — `GITHUB_TOKEN` nếu có ở env tăng quota; token không bao giờ ghi vào data.
4. **Không phải mọi skill có repo** — không marketplace source → stars unknown theo design.
5. **Description MCP** thiếu config → `descriptionInferred: true` (qua package name).
6. **authRequired** chỉ true khi config khai báo — không suy diễn từ tên package.

## 10. Verification summary

| Status | Count |
|---|---|
| verified | 74 |
| partial | 0 |
| unverified | 0 |

