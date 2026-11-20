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
| 2026-11-20T08:48:39.541Z | T4 sm-graphify | run | 0.1824 | actual | 3.7990 |
| 2026-11-20T08:51:40.811Z | T4 sm-rtk | run | 0.3880 | actual | 4.1870 |
| 2026-11-20T08:52:51.820Z | T4 sm-plain | run | 0.2081 | actual | 4.3951 |
| 2026-11-20T08:53:30.010Z | T4 cap-rtk (VOID) | run | 0.0709 | actual | 4.4660 |
| 2026-11-20T08:57:28.456Z | T5 B1-S4-P | run | 0.3437 | actual | 4.8097 |
| 2026-11-20T09:00:01.870Z | T5 B1-S4-G | run | 0.2959 | actual | 5.1056 |
| 2026-11-20T09:01:05.426Z | T5 B1-S4-R (void overturned: `cd src && cat ../supabase/…` resolves inside the export; fence fixed to follow cd) | run | 0.2853 | actual | 5.3909 |
| 2026-11-20T09:03:11.884Z | T5 B2-S6-P | run | 0.2848 | actual | 5.6757 |
| 2026-11-20T09:04:16.979Z | T5 B2-S6-R | run | 0.3023 | actual | 5.9780 |
| 2026-11-20T09:06:02.182Z | T5 B2-S6-G (void overturned: the flagged `../copy` was text inside a python heredoc the permission layer denied; it ran nothing) | run | 0.2708 | actual | 6.2488 |
| 2026-11-20T09:08:39.348Z | T5 B3-S1-G | run | 0.2244 | actual | 6.4732 |
| 2026-11-20T09:09:55.515Z | T5 B3-S1-P | run | 0.2484 | actual | 6.7216 |
| 2026-11-20T09:11:36.636Z | T5 B3-S1-R (void overturned: a grep pattern for PEPPER or SECRET over in-export docs/SETUP.md, not a secret-file read) | run | 0.3287 | actual | 7.0503 |
| 2026-11-20T13:44:58.891Z | T5 B4-S3-G | run | 0.1859 | actual | 6.9075 |
| 2026-11-20T13:45:59.262Z | T5 B4-S3-P | run | 0.1826 | actual | 7.0901 |
| 2026-11-20T13:48:19.550Z | T5 B5-S5-P (void overturned: the flagged ~ was text inside heredoc edit attempts the permission layer refused; nothing ran) | run | 0.4407 | actual | 7.5308 |
| 2026-11-20T13:52:17.480Z | T5 B5-S5-G (void overturned: the flagged ~ was text inside heredoc edit attempts the permission layer refused; nothing ran) | run | 0.4683 | actual | 7.9991 |
| 2026-11-20T13:55:29.137Z | T5 B6-S2-G | run | 0.2255 | actual | 8.5533 |
| 2026-11-20T13:56:28.821Z | T5 B6-S2-P (void overturned: the flagged /m/ was a grep pattern over in-export test/e2e, read as an MSYS drive path) | run | 0.2596 | actual | 8.8129 |
| 2026-11-20 | T5 blind scorer, 15 plans (137,348 reported tokens × 3.00 USD/MTok) | dispatch | 0.4120 | estimate | 9.2249 |

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

### Arms and price gate (T4, 2026-11-20)

All on the SPARE (#5, never scored). Global hashes (~/.claude CLAUDE.md, settings.json, the skills/graphify tree, %APPDATA%
tk) were taken before and after each arm's install and removal: unchanged.

- **graphify 0.9.103:** `graphify update .` code-only ("no LLM needed") with `.graphifyignore` (public/, test-results/): 9,149 nodes, 27,515 edges, 324 communities, 67 s; then `graphify install --project` (root CLAUDE.md section, skill registration in the tracked .claude/CLAUDE.md, .claude/settings.json PreToolUse hooks Bash|Grep and Read/Glob, SessionStart hook, project skill). Removal by checkout + clean: `--ignored` status empty, tree equal to the export's commit. The project CLAUDE.md edit is reverted after the arm's run (the export is deleted after it).
- **RTK full v1.1.0** (`D:	ools
tk-full.1.0`, PATH prefix on the child only): trusted `.rtk/pipeline.toml` (terse + posthook, strip-line-numbers and json-reads on; `rtk pipeline validate` ok), `rtk init --auto-patch` project mode (CLAUDE.md block + .rtk/filters.toml), PreToolUse Bash hook in the export's `.claude/settings.local.json`. Read/Grep compression untestable in v1.1.0 (no Claude Code PostToolUse processor). Removal round-trip clean.

| Smoke run | USD | Tokens | First-turn cache (create/read) | Tools | Hooks / nudges / rewrites / graphify queries | Void |
|---|---|---|---|---|---|---|
| sm-graphify | 0.1824 | 226,130 | 8,895 / 11,223 | Bash 5, Read 7 | 12 / 1 / 0 / 2 | no |
| sm-rtk | 0.3880 | 483,757 | 8,713 / 11,223 | Bash 11, Write 4 (all blocked: "No such tool available: Write") | 11 / 0 / 10 / 0 | no |
| sm-plain | 0.2081 | 257,532 | 8,183 / 11,223 | Bash 7 | 0 / 0 / 0 / 0 | no |

The RTK-arm agent tried to implement rather than only plan (4 blocked Write calls), plausibly prompted by the rtk instructions `rtk init` writes into the project CLAUDE.md; recorded as arm behaviour.

**RTK capability run** `cap-rtk` (unscored, own prompt, 0.0709 USD): `rtk --version` → `rtk 1.1.0`; `rtk init --show` printed in-run ("Hook: not found", because v1.1.0 inspects only global settings, though the project hook fired); `ls -la src/app/api/v1/me` and `ls -la src/lib` were rewritten and compressed, the second cut; `rtk recall d981e63f113a7245` returned the 11 hidden entries; `rtk git add .` → "Permission to use Bash with command rtk git add . has been denied". **Information-loss audit procedure proven once:** the 50 shown + 11 recalled entries equal the 61 entries of the raw listing in the unmodified export (PASS). The probe voided this run because its fence treated the read-only `rtk init --show` as mutating; unscored, so no repeat; the fence now exempts `rtk init --show` (self-test re-run ALL PASS).

**Price gate: PASS.** max smoke price 0.3880 × 18 × 1.25 = 8.73 + scorer 2.00 + hold-back 1.50 = 12.23 ≤ remaining 27.53 → T5 proceeds without asking. T4 lines 0.8494 USD ≤ 1.50.

MDD recomputed from the smoke runs (appended; three DIFFERENT arms on one scenario, so it mixes arm effect with run noise): tokens 162,300, USD 0.1294.

### Paid set (T5, 2026-11-20)

Execution order as run: block order PGR, PRG, GPR, then GRP, RPG and RGP without R, after the owner's futility ruling. Each run used a fresh history-free export of its scenario's parent, with one export on disk at a time. The coordinator launched every run with `--max-budget-usd 1.50`. † marks a run the probe flagged void, where the coordinator overturned the flag as a fence false positive. The reason is in its ledger row and summary, and the fence was fixed and the run replayed each time. graphify showed a hook nudge in every run, so there was no arm failure. Scoring was one blind Sonnet pass over all 15 plans: labels Q01–Q15 shuffled with seed `4b8f3b40-t5`, tool names redacted, and three "run the tool's update" clauses removed as arm cues; it used 137,348 tokens. F1 is computed by script from its mapping.

| # | Run | USD | Tokens | Wall s | First-turn cache (create/read) | Tools | Hooks / nudges / rewrites / graphify queries | Code key / planned / matched | F1 | Tests found | K | C |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | B1-S4-P | 0.3437 | 306,304 | 84 | 8,178 / 11,223 | Grep 3, Bash 11 | 0 / 0 / 0 / 0 | 8 / 11 / 8 (2 equiv) | 0.842 | 4/5 | 1.00 | **0.921** |
| 2 | B1-S4-G | 0.2959 | 404,814 | 73 | 8,889 / 11,223 | Bash 9, Grep 4 | 13 / 1 / 0 / 1 | 8 / 8 / 8 (2 equiv) | 1.000 | 4/5 | 1.00 | **1.000** |
| 3 | B1-S4-R † | 0.2853 | 390,600 | 57 | 8,706 / 11,223 | Grep 6, Glob 1, Read 9, Bash 3 | 3 / 0 / 3 / 0 | 8 / 9 / 8 (2 equiv) | 0.941 | 3/5 | 1.00 | **0.971** |
| 4 | B2-S6-P | 0.2848 | 396,385 | 64 | 8,232 / 11,223 | Grep 1, Bash 8, Read 3, Write 1 | 0 / 0 / 0 / 0 | 7 / 7 / 5 (1 equiv) | 0.714 | 0/0 | 0.90 | **0.807** |
| 5 | B2-S6-R | 0.3023 | 404,106 | 58 | 8,762 / 11,223 | Grep 2, Read 4, Bash 6 | 6 / 0 / 4 / 0 | 7 / 8 / 5 (1 equiv) | 0.667 | 0/0 | 0.90 | **0.783** |
| 6 | B2-S6-G † | 0.2708 | 386,313 | 61 | 8,942 / 11,223 | Bash 10, Grep 1 | 11 / 1 / 0 / 1 | 7 / 8 / 5 (1 equiv) | 0.667 | 0/0 | 1.00 | **0.833** |
| 7 | B3-S1-G | 0.2244 | 207,084 | 58 | 8,947 / 11,223 | Bash 4, Grep 2, Read 8 | 14 / 1 / 0 / 1 | 7 / 8 / 7 (2 equiv) | 0.933 | 3/7 | 0.80 | **0.867** |
| 8 | B3-S1-P | 0.2484 | 236,821 | 70 | 8,237 / 11,223 | Grep 1, Bash 8 | 0 / 0 / 0 / 0 | 7 / 7 / 7 (2 equiv) | 1.000 | 3/7 | 0.90 | **0.950** |
| 9 | B3-S1-R † | 0.3287 | 298,517 | 93 | 8,765 / 11,223 | Grep 1, Bash 5, Read 10 | 5 / 0 / 5 / 0 | 7 / 8 / 7 (2 equiv) | 0.933 | 3/7 | 0.90 | **0.917** |
| 10 | B4-S3-G | 0.1859 | 163,214 | 60 | 8,888 / 11,223 | Bash 4, Grep 1, Write 2, Edit 11 | 5 / 1 / 0 / 1 | 7 / 9 / 7 (1 equiv) | 0.875 | 0/2 | 0.90 | **0.888** |
| 11 | B4-S3-P | 0.1826 | 183,138 | 53 | 8,179 / 11,223 | Grep 5, Read 3, Bash 3 | 0 / 0 / 0 / 0 | 7 / 9 / 7 (1 equiv) | 0.875 | 0/2 | 0.90 | **0.888** |
| 12 | B5-S5-P † | 0.4407 | 492,152 | 131 | 8,299 / 11,223 | Bash 10, Grep 1, Write 3 | 0 / 0 / 0 / 0 | 8 / 10 / 8 (5 equiv) | 0.889 | 1/5 | 0.70 | **0.794** |
| 13 | B5-S5-G † | 0.4683 | 483,156 | 163 | 9,008 / 11,223 | Bash 13, Grep 2, Write 6 | 15 / 1 / 0 / 1 | 8 / 10 / 8 (5 equiv) | 0.889 | 1/5 | 0.80 | **0.844** |
| 14 | B6-S2-G | 0.2255 | 312,283 | 56 | 9,004 / 11,223 | Bash 9, Grep 1 | 10 / 1 / 0 / 1 | 9 / 8 / 8 (0 equiv) | 0.941 | 4/7 | 0.80 | **0.871** |
| 15 | B6-S2-P † | 0.2596 | 310,144 | 49 | 8,294 / 11,223 | Grep 2, Bash 7, Read 3 | 0 / 0 / 0 / 0 | 9 / 7 / 7 (0 equiv) | 0.875 | 5/7 | 0.70 | **0.788** |

Every arm, plain included, tried to edit files despite the plan-only prompt: Write, `cat >` heredocs and python edits. The permission layer refused all of them.

**graphify vs plain** (n = 6 paired scenarios; threshold 2·s/√6):

| Scenario | d C | d tokens | d USD |
|---|---|---|---|
| S4 | +0.079 | +98,510 | -0.0477 |
| S6 | +0.026 | -10,072 | -0.0140 |
| S1 | -0.083 | -29,737 | -0.0240 |
| S3 | +0.000 | -19,924 | +0.0033 |
| S5 | +0.050 | -8,996 | +0.0276 |
| S2 | +0.083 | +2,139 | -0.0341 |

| Metric | plain mean | d̄ | s | 2·s/√n | effect size d̄/s | d̄ vs plain mean | leg |
|---|---|---|---|---|---|---|---|
| C | 0.858 | +0.026 | 0.062 | 0.051 | +0.42 | +3.0% | tie |
| tokens | 320,824 | +5,320 | 46,910 | 38,302 | +0.11 | +1.7% | tie |
| USD | 0.2933 | -0.0148 | 0.0271 | 0.0221 | -0.55 | -5.0% | tie |

**RTK vs plain (owner stopped RTK after block 3)** (n = 3 paired scenarios; threshold 2·s/√3):

| Scenario | d C | d tokens | d USD |
|---|---|---|---|
| S4 | +0.050 | +84,296 | -0.0583 |
| S6 | -0.024 | +7,721 | +0.0175 |
| S1 | -0.033 | +61,696 | +0.0803 |

| Metric | plain mean | d̄ | s | 2·s/√n | effect size d̄/s | d̄ vs plain mean | leg |
|---|---|---|---|---|---|---|---|
| C | 0.893 | -0.002 | 0.046 | 0.053 | -0.05 | -0.3% | tie |
| tokens | 313,170 | +51,238 | 39,344 | 45,431 | +1.30 | +16.4% | real, higher |
| USD | 0.2923 | +0.0131 | 0.0694 | 0.0801 | +0.19 | +4.5% | tie |

**Minimum detectable difference, recomputed from the paid set.** This is the 2-SE threshold the verdicts used:

| Arm | C | Tokens | USD |
|---|---|---|---|
| graphify | 0.051 | 38,302 | 0.0221 |
| RTK (n = 3) | 0.053 | 45,431 | 0.0801 |

The frozen pre-run token figure (48,300) was smaller than the paired spread this repo shows.

**Ceiling rule:** plain's mean C over graphify's six scenarios is 0.858, below 0.9, so the correctness-gain leg is live, not void.

**RTK information-loss audit (every cut in every RTK run).** There were 5 cuts, and the agent recalled none of them. For each cut, `rtk recall <id>` returned the hidden lines, and the agent's original command was re-run in an unmodified export of that parent. In all 5, the shown and recalled lines together cover every file token of the raw output (0 missing). Hidden lines were then checked against the key's files and symbols:

| Run | Cut | Hidden | Raw tokens missing | Hidden lines bearing on the key |
|---|---|---|---|---|
| B1-S4-R | 747efb38 (`ls supabase/migrations`, test dirs) | 105 | 0 | **1 loss:** `20261004020000_payments_only_server_succeeds.sql`, a key file. The agent had already read it directly earlier in the run, and its plan covers it by equivalence. `…_add_payment_data_to_payments.sql` matched only the generic word `payments`; judged no bearing |
| B1-S4-R | eb15861a (test dirs) | 2 | 0 | none |
| B2-S6-R | 474cbeab (touring component dirs) | 3 | 0 | none |
| B3-S1-R | c3c604eb (`ls docs .claude supabase …`) | 203 | 0 | **1 loss:** `20260330000000_email_queue.sql`, which defines the key symbol `email_queue`. Six more matched only `page` or `email`; judged no bearing |
| B3-S1-R | 0ba3dc21 (rate-limit grep) | 154 | 0 | **1 loss:** the same `email_queue` migration line. Six generic matches judged no bearing |

The frozen rule counts "any dropped line bearing on a key file, symbol or key point" as a loss, "whether or not C fell". By that rule the audit finds 3 losses. None of them lowered C: B1-S4-R scored 0.971 and B3-S1-R 0.917.
