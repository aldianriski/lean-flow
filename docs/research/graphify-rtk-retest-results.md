---
owner: Maintainer
last_updated: 2026-11-20
update_trigger: A run or a coordinator dispatch is booked to the ledger, or TASK-678 closes
status: current
id: graphify-rtk-retest-results
tags: [tooling]
domain: knowledge
related: [graphify-rtk-retest-questions, graphify-workdoo-test, rtk-trial-verdict]
---

# graphify and RTK re-test — ledger and run results

> The SPRINT-182 ledger. Cap 8.00 USD; 0.50 USD is held back for scoring. A run starts only if ledger +
> its `--max-budget-usd` + 0.50 is at most 8.00 and its `--max-budget-usd` is at least 0.30 (the probe refuses
> otherwise). Runs book `total_cost_usd` (basis `actual`). Coordinator Sonnet dispatches book reported tokens
> x 3.00 USD/MTok (basis `estimate`, conservative). A run with no `result` event or no `total_cost_usd` is
> written as `UNPRICED` and blocks all later runs until the row is reconciled by a new row.

Fixture commit: `46043cf5` (questions, key and frozen run rules, committed before any arm ran).

Smoke runs (T1, plain config, held-out prompts, not scored): `plain-smoke` 0.0450 USD, 52,858 tokens, 1 Grep call, no
hook events, 5.9 s, answer correct (200 `{status:'ok', version}`; 503 `unavailable` on a failed query). The model skipped
the quote-or-NONE line, so `plain-smoke2` asked it alone: **NONE** (0.0282 USD). Config sources from the init event:
`memory_paths` holds only workdoo's project auto-memory directory, which does not exist; skills and plugins are
built-in only, with no graphify or rtk entry. The plain arm is uncontaminated, so the per-run `CLAUDE_CONFIG_DIR`
fallback is not needed. Snapshot HEAD and `git status --porcelain --ignored` equalled the baseline after both runs.

## Ledger

<!-- LEDGER-ROWS: the probe appends one row after the header; keep the table contiguous. -->

| time | item | kind | USD | basis | cumulative |
|---|---|---|---|---|---|
| 2026-11-20T03:41:00Z | T1 builder (fixture, key, probe; 153,486 reported tokens × 3.00 USD/MTok) | dispatch | 0.4605 | estimate | 0.4605 |
| 2026-11-20T03:47:00Z | T1 key check (blind second pass; 94,674 reported tokens × 3.00 USD/MTok) | dispatch | 0.2840 | estimate | 0.7445 |
| 2026-11-20T03:43:43.262Z | plain-smoke | run | 0.0450 | actual | 0.7895 |
| 2026-11-20T03:44:22.223Z | plain-smoke2 | run | 0.0282 | actual | 0.8177 |
| 2026-11-20T03:47:35.863Z | plain-1 | run | 0.3171 | actual | 1.1348 |
| 2026-11-20T03:49:55.256Z | graphify-1 | run | 0.2584 | actual | 1.3932 |
| 2026-11-20T03:51:16.956Z | graphify-2 | run | 0.1989 | actual | 1.5921 |
| 2026-11-20T03:52:14.067Z | plain-2 | run | 0.1990 | actual | 1.7911 |
| 2026-11-20T03:58:00Z | T2 blind scorer (68,949 reported tokens × 3.00 USD/MTok) | dispatch | 0.2068 | estimate | 1.9979 |
| 2026-11-20T05:31:59.886Z | rtk-cap | run | 0.0701 | actual | 2.0680 |
| 2026-11-20T05:32:46.440Z | plain-3 | run | 0.2383 | actual | 2.3063 |
| 2026-11-20T05:33:42.163Z | rtk-1 | run | 0.2682 | actual | 2.5745 |
| 2026-11-20T05:34:40.378Z | rtk-2 | run | 0.1854 | actual | 2.7599 |
| 2026-11-20T05:35:29.734Z | plain-4 | run | 0.2046 | actual | 2.9645 |
| 2026-11-20T05:40:00Z | T3 blind scorer (69,121 reported tokens × 3.00 USD/MTok) | dispatch | 0.2074 | estimate | 3.1719 |
| 2026-11-20T05:37:37.203Z | rtk-cap2 | run | 0.0410 | actual | 3.2129 |

## T2 — graphify arm run results

Order plain-1, graphify-1, graphify-2, plain-2; the snapshot was reset to the baseline before each run and graphify
was re-installed for each graphify run (graphify 0.9.103: `graphify update .` with `.graphifyignore` = `.claude/worktrees/`,
0 LLM tokens, 5,880 nodes, 16,662 edges, 263 communities, 58 s then 22 s; then `graphify install --project`, which wrote
a root `CLAUDE.md` graphify section, a registration in the tracked `.claude/CLAUDE.md`, `.claude/settings.json` PreToolUse
hooks on `Bash|Grep` and `Read|Glob` plus a SessionStart hook, and `.claude/skills/`).

| Run | Correct (of 6) | Tokens (bar unit) | USD | Tool calls | Hook events | Nudges | graphify queries | Wall |
|---|---|---|---|---|---|---|---|---|
| plain-1 | 6 | 296,527 | 0.3171 | Grep 5, Read 10 | 0 | 0 | 0 | 48.5 s |
| graphify-1 | 6 | 381,198 | 0.2584 | Bash 6, Read 5 | 22 | 1 | 1 | 42.5 s |
| graphify-2 | 6 | 248,932 | 0.1989 | Bash 7 | 14 | 3 | 0 | 40.9 s |
| plain-2 | 6 | 221,618 | 0.1990 | Grep 8, Read 7 | 0 | 0 | 0 | 43.5 s |

- **Correctness:** plain 12/12, graphify 12/12 (blind Sonnet scorer, labels R1–R4 shuffled, tool names redacted; map
  R1 = graphify-2, R2 = plain-1, R3 = plain-2, R4 = graphify-1, held by the coordinator).
- **Tokens:** plain mean 259,073, graphify mean 315,065 → **1.216×** plain. Gap 55,993; spread plain 74,909, graphify
  132,266.
- **USD (reported beside it):** plain mean 0.2581, graphify mean 0.2287 → 0.886×. Gap −0.0294; spread plain 0.1181,
  graphify 0.0595.
- **Hook evidence:** both graphify runs carry `hook_response` events with additionalContext (1 and 3 nudges), so both are
  counted runs; the agent ran one `graphify query` in 13 Bash calls across the two runs. Plain runs: no graphify or rtk
  call (not void).
- **Side effect:** `graphify install --project` also refreshed the global `~/.claude/skills/graphify` from 0.8.13 to
  0.9.103 (the owner had upgraded the package). `~/.claude/CLAUDE.md` and `settings.json` hashes were unchanged and no
  hook was added; runs load no user skills (init skill lists).
- Snapshot HEAD 884d897 and `git status --porcelain --ignored` equalled the baseline after the reverts.

## T3 — RTK arm run results

RTK full edition **v1.1.0** (stable, 2026-10-25, the newest at least 14 days old; sha256 `c9a8f7a8…a6f` matched
`checksums.txt`; BUSL-1.1 engine terms in `LICENSE-ENGINE`), unpacked to `D:	ools
tk-full.1.0`, separate from the
OSS v1.1.0 install, which is untouched. Per RTK run, project-scoped in the snapshot: a trusted `.rtk/pipeline.toml`
(`extends = ["rtk:terse", "rtk:posthook"]`, `[override]` enabling `strip-line-numbers` and `json-reads`; `rtk pipeline
show` resolved both), `rtk init --auto-patch` in project mode (it wrote a root `CLAUDE.md` block and
`.rtk/filters.toml` and reported "hooks: NOT registered"), and the PreToolUse Bash hook
(`D:/tools/rtk-full/1.1.0/rtk.exe hook claude`) hand-wired into the snapshot's `.claude/settings.local.json`. The PATH
override applied to the RTK child process only. `%APPDATA%
tk` was unchanged by the setup.

**Not testable in v1.1.0 (scope-change 2026-11-20, owner: "Test what v1.1.0 supports"):** neither v1.1.0 nor v1.2.0 has a
Claude Code PostToolUse processor (`rtk hook` handles PreToolUse only), so built-in Read/Grep output cannot be compressed.
The posthook rules resolve, but nothing in Claude Code calls them.

Capability run `rtk-cap` (unscored, own prompt, 0.0701 USD): `rtk --version` printed `rtk 1.1.0` in-run; `ls -la server`
was rewritten to `rtk ls` and cut (`[+5 hidden: rtk recall 34c391b5ff3126fd]`); that `rtk recall` returned the 5 hidden
lines; `rtk git add .` was denied ("Permission to use Bash with command rtk git add . has been denied"). A second capability run `rtk-cap2` (0.0410 USD) printed `rtk --version` (`rtk 1.1.0`) and `rtk init --show` in-run; the latter reports "Hook: not found" and "settings.json: PreToolUse hook missing" because v1.1.0 only inspects the global settings, although the project hook fired in every RTK run.

Pre-flight before plain-3: remaining 5.93 USD ≥ 4 × T2's highest run (0.3171) plus the scorer. Order plain-3, rtk-1,
rtk-2, plain-4; snapshot reset to the baseline before each, RTK re-set-up per RTK run.

| Run | Correct (of 6) | Tokens | USD (bar unit) | Tool calls | RTK rewrites | Wall |
|---|---|---|---|---|---|---|
| plain-3 | 6 | 316,909 | 0.2383 | Grep 9, Read 9 | — | 33.5 s |
| rtk-1 | 6 | 275,686 | 0.2682 | Bash 1, Read 12, Grep 6 | 1 | 41.4 s |
| rtk-2 | 6 | 277,693 | 0.1854 | Bash 6 | 3 | 42.7 s |
| plain-4 | 6 | 261,590 | 0.2046 | Grep 9, Read 8 | — | 40.7 s |

- **Correctness:** plain 12/12, RTK 12/12 (blind Sonnet scorer, labels shuffled, tool names redacted, terseness not
  scored; map R1 = plain-4, R2 = rtk-2, R3 = plain-3, R4 = rtk-1). The scorer flagged no missing information.
- **USD:** plain mean 0.2215, RTK mean 0.2268 → **1.024×** plain. Gap +0.0054; RTK's own two runs differ by 0.0828.
- **Tokens (recorded beside it):** plain mean 289,250, RTK mean 276,690 → 0.957×.
- **Rewrites:** 4 across the two RTK runs. The agent did most of its work with the Read and Grep tools, which v1.1.0
  cannot reach.
- Snapshot HEAD 884d897 and `git status --porcelain --ignored` equalled the baseline after every revert.

## Bloodlines web re-test (SPRINT-183)

Cap 32.00 USD, hold-back 1.50 (spendable 30.50). Per-task caps: T1 2.50, T2 2.50, T3 5.00, T4 1.50, T5 the rest.

### Ledger

| time | item | kind | USD | basis | cumulative |
|---|---|---|---|---|---|
| 2026-11-20 | T1 pool draw, leak-grep, export recipe | coordinator | 0.00 | read-only git | 0.00 |
| 2026-11-20 | T1 builder (pool, leak grep, export recipe; 96,898 reported tokens × 3.00 USD/MTok) | dispatch | 0.2907 | estimate | 0.2907 |
| 2026-11-20 | T1 key-aware audit, candidates 1-3 (108,232 tokens) | dispatch | 0.3247 | estimate | 0.6154 |
| 2026-11-20 | T1 key-aware audit, candidates 4-6 (106,746 tokens) | dispatch | 0.3202 | estimate | 0.9356 |
| 2026-11-20 | T1 key-aware audit, candidates 7-9 (89,136 tokens) | dispatch | 0.2674 | estimate | 1.2030 |
| 2026-11-20 | T2 key worker (keys, descriptions, frozen rules; 180,952 tokens) | dispatch | 0.5429 | estimate | 1.7459 |
| 2026-11-20 | T2 blind description check (64,746 tokens) | dispatch | 0.1942 | estimate | 1.9401 |
| 2026-11-20T08:22:34.499Z | T3 pre-S2 | run | 0.3842 | actual | 2.3243 |
| 2026-11-20T08:24:14.134Z | T3 pre-S4 (VOID) | run | 0.3898 | actual | 2.7141 |
| 2026-11-20T08:25:54.907Z | T3 pre-S4-r | run | 0.3314 | actual | 3.0455 |
| 2026-11-20 | T3 probe builder (run.ts + self-test; 124,248 tokens) | dispatch | 0.3727 | estimate | 3.4182 |
| 2026-11-20 | T3 blind pre-screen scorer (66,126 tokens) | dispatch | 0.1984 | estimate | 3.6166 |

### Pool (9 candidates, last 12 months, drawn 2026-11-20)

| # | sha | parent | type | subject | code files | test files | top-level dirs (src/x/y) |
|---|---|---|---|---|---|---|---|
| 1 | 2263c84d2279 | b7c9481ef5f1 | fix | fix(auth): a password change needs a one-time code emailed to the member (TASK-201) | 7 | 7 | 5 sub-dirs under src |
| 2 | f0f771defbf7 | dc89bff3db0c | fix | fix(member): one membership pick, and only ACTIVE counts as verified (TASK-200) | 9 | 7 | 6 sub-dirs under src |
| 3 | 584a2926f281 | 191166625ad3 | fix | fix(auth): shared parseSafeNext closes /\evil.com open redirect in login/register/callback (SPRINT-088 T1) | 7 | 2 | 3 sub-dirs under src |
| 4 | e76250d6f6f4 | 6c7b342b7516 | fix | fix(payments): payable = ISSUED or DRAFT; VOID locked at the DB; zero-row flips logged (SPRINT-087 T7) | 7 | 5 | 6 sub-dirs under src |
| 5 | 4b7d89403b52 | bafc2daf1f64 | feat | feat(api): avatar, verification email and password routes for the mobile app (TASK-186) | 9 | 8 | 6 sub-dirs under src |
| 6 | 5bd2abc3c1f7 | 340cd11b0132 | feat | feat(touring): SOS to Telegram safety groups, chapter link by one-time code (TASK-108) | 14 | 9 | 5 sub-dirs under src |
| 7 | 85b2ac8e7368 | 4191dffb73e6 | feat | feat(auth): suspended and terminated memberships lose console, officer actions and chapter data (SPRINT-085 T1) | 15 | 7 | 8 sub-dirs under src |
| 8 | 2161c4fadff2 | 990ac2e2e83f | feat | feat(app): members download and update the Android app from the web (TASK-194) | 5 | 5 | 5 sub-dirs under src |
| 9 | b0cbadbfd0b9 | eebcb01ddcc5 | refactor | refactor(touring): share the sticky bar, place search and form pieces with the create wizard (TASK-148) | 5 | 0 | 1 sub-dirs under src |

### Widening reserve (next 4 by recency, not in the pool)

| # | sha | parent | type | subject | code files | test files | top-level dirs (src/x/y) |
|---|---|---|---|---|---|---|---|
| 1 | 4e2fc8bcf5bc | 990ac2e2e83f | feat | feat(touring): crew contacts read for a ride's own people (TASK-193) | 5 | 3 | 4 sub-dirs under src |
| 2 | 364db1e19012 | a18bbfa747db | feat | feat(072-T1): evict the role cache on every privilege change | 7 | 1 | 6 sub-dirs under src |
| 3 | 65d2b3a48b53 | dd50fd35ee64 | feat | feat(touring): HQ queue section, HQ duty card, pages and actions, reachability (SPRINT-092 T5) | 13 | 6 | 4 sub-dirs under src |
| 4 | 9ffd0feb8820 | cf17c60d9823 | feat | feat(touring): route points and stops you can tap, with a card (TASK-178) | 15 | 5 | 3 sub-dirs under src |

Counts exclude tests, lockfiles, generated files, dist/build and snapshots; secret-pattern paths are excluded from every read. Leak-grep full hit lists: scratch `t1-leakgrep.md` (not committed).

### Dispositions (key-aware audit, 2026-11-20)

Every export removes the planning trees (docs/work, docs/sprint, docs/epic), TECH-DEBT.md, TODO.md, docs/TODO.md,
docs/CHANGELOG.md, docs/changelog, .claude/settings.local.json and supabase/.temp, plus the secret patterns, for all arms.

| # | Disposition | Extra scrub (all arms) | Why |
|---|---|---|---|
| 1 | **scenario** (clean) | — | Only motivation survives (openapi-auth notes re-auth is recommended); no code, stub or doc names the emailed code. |
| 2 | **scenario** (clean) | — | Comments describe the old oldest-membership rule (the defect), not the fix. |
| 3 | **scenario** (clean) | — | The existing `login-redirect.ts` already checks backslashes: ordinary context in a file the change edits, equal for all arms. |
| 4 | **scenario** (clean) | — | The parent states the opposite rule; nothing sketches DRAFT as payable. |
| 8 | **scenario** (clean) | — | No file at the parent references the endpoint, bucket, script or page. |
| 9 | **scenario** (keep-with-scrub) | `docs/research/touring-mobile-ux.md` | That research doc ties the sticky bar, map-first search and SessionForm to the wizard; the TASK-148 src comments describe wizard helpers, not the extraction. |
| 5 | spare (smoke only, unscored) | — | `docs/openapi.yaml` and a src comment name `POST /me/avatar`; removing them would break the tree, so it cannot be a scored scenario. |
| 6 | **skip** | — | src comments in the edited file name TASK-108 and the missing group adapters; the PRD states the requirement. |
| 7 | **skip** | — | src and migration comments name the TD-011 gap and `src/proxy.ts`; not removable without editing code. |

Six scenarios: #1, #2, #3, #4 (fix), #8 (feature), #9 (refactor). Reserve 4 un-audited, for T3 swaps under the same rules.

### Freeze (T2, 2026-11-20)

Scenarios S1–S6 = #1, #2, #3, #4, #8, #9; SPARE = #5 (smoke only). Descriptions, keys and frozen rules are in
`bloodlines-retest-scenarios.md`, frozen in commit **634a74fb** (blob 529a1633). Coordinator leak-grep: first run 2 hits
(`verified` allowlisted, `label` removed from S6's description and key), second run PASS with 0 unallowed hits. Blind check
(fresh Sonnet, descriptions + allowlist + one export per parent, never the key): every description answerable, no
give-away, all 16 allowlist words ordinary. Block assignment (seed 4b8f3b40): PGR S4 · PRG S6 · GPR S1 · GRP S3 · RPG S5 ·
RGP S2. Minimum detectable differences frozen: tokens 48,300, USD 0.0628; C not estimable before the pre-screen.

### Pre-screen gate (T3, 2026-11-20)

Two plain runs on the two scenarios with the most code files across the most directories (S2: 9 code files, S4: 8),
each in a fresh history-free export, scored blind (labels P1/P2, tool names redacted); F1 by script from the scorer's
mapping (docs and generated files excluded as the frozen rules say).

| Run | USD | Tokens | First-turn cache (create/read) | Tools | Code: key / planned / matched | P | R | F1 | K | C |
|---|---|---|---|---|---|---|---|---|---|---|
| pre-S2 | 0.3842 | 543,232 | 8,287 / 11,223 | Grep 20, Read 12, Glob 3 | 9 / 9 / 8 | 0.889 | 0.889 | 0.889 | 0.80 | **0.844** |
| pre-S4 | 0.3898 | 528,853 | 8,172 / 11,223 | Grep 11, Read 11, Glob 2, Bash 1 | VOID: attempted `git log` (denied by the deny list; void under the signed G2 rule), repeated once | | | | | |
| pre-S4-r | 0.3314 | 433,358 | 8,180 / 11,223 | Bash 7, Read 5, Grep 3 | 8 / 11 / 8 (2 by equivalence) | 0.727 | 1.000 | 0.842 | 0.80 | **0.821** |

**Gate: PASS** — plain scored below 0.9 on both screened scenarios (0.844, 0.821), so no swap and no STOP; the test
proceeds to T4. Pre-screen runs only gate and price; they are never controls (each scenario gets a fresh plain run in T5).

Minimum detectable differences recomputed (appended beside the frozen ones, never edits; two runs on DIFFERENT scenarios,
so the spread mixes scenario and run noise and over-states run noise): tokens 89,712 (frozen 48,300); USD
0.0431 (frozen 0.0628); C 0.019 (first estimate; frozen "not estimable before the pre-screen"). A plain run
on this repo costs about 0.33–0.39 USD at 430–540K tokens (workdoo: 0.20–0.32 USD at 220–320K).
