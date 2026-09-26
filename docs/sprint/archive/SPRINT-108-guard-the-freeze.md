---
sprint: 108
slug: guard-the-freeze
owner: Maintainer
last_updated: 2026-09-26
status: closed
gates_signed: G1,G2 @ 96865d2
plan_commit: 96865d2
close_commit: 379fa24
update_trigger: sprint execute/close events
---

# SPRINT-108 — Guard the Freeze

> **Theme:** SPRINT-107 closed with its freeze checker reported CLEAR, but a worktree-isolated outside
> review on 2026-09-26 found three ways fences and comments still hide an edit, one path spelling that
> turns both harnesses red on the owner's Windows host, and a locale-sorted knowledge index that
> reddens the default gate there. The freeze is ADR-047's whole promise, so it gets fixed before
> anything else is built on the store.

## Scope

**In:** the by-reference freeze checker's fence, comment and path handling, plus its two unguarded
spots (`TASK-388`) · a locale-independent knowledge index (`TASK-389`).

**Out (deferred):** `TD-182` (one scope-change entry excuses later edits: needs a spec ruling) · `TD-183`
(slugless member skipped silently) · `TD-184` (box re-indentation) · `TD-185` (uncommitted member baseline)
· `TD-180` (the `s13` locale fixture) · the pre-existing Windows reds in `v1-to-v2` and `work-store`
fixtures (same at `9d8658a`).

## Plan

### T1 — Stop fences and comments from hiding edits from the by-reference freeze checker `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/lib/check-sprint-by-reference.ts` · `evals/run-by-reference-fixtures.ts` · `evals/fixtures/by-reference/` ·
  `evals/run-orchestrator-store-fixtures.ts` · `skills/lean-doc-generator/references/sprint-by-reference.md`
Depends-on: none
Cites: `TASK-388` · `ADR-047` · SPRINT-107 outside review (2026-09-26) findings 1–5

Tier G. Fence closing follows CommonMark; comments and fences only decide where a section *ends*,
while the compared Done-when text stays raw (D1). Paths are resolved to their real spelling before
anything is made relative, so an 8.3 short name and git's toplevel agree.

**Acceptance:** each hiding shape the review reproduced now reports `FREEZE-EDIT`, and both checker
harnesses are green under this host's default TMP.

**DoD:**
- [x] Nested fence in Done when (four-backtick fence around a three-backtick one holding a `## ` line) + a post-promote box edit → `FREEZE-EDIT`; same shape unedited → clean — *Verify: retained must-FAIL fixture + sibling* ✓ `nested-fence-hides-heading-then-edited` + `-clean`, and one-clause seeds for run-length (P1) and trailing whitespace (P2, P9), each reddening only its case
- [x] A fenced example `scope-change` entry in the log does not excuse a real edit → `FREEZE-EDIT` — *Verify: retained must-FAIL fixture + sibling* ✓ `log-fenced-example-scope-change-hidden` + plain-fence sibling; P9 and P8 cover the info-string and indented-closer shapes
- [x] A `## ` line inside an HTML comment does not end Done when; an edit below it **and** an edit inside it → `FREEZE-EDIT` — *Verify: retained must-FAIL fixtures + sibling* ✓ `comment-guidance-edit-below` · `-edit-inside` (D1 raw) · `-clean`; seeds C and D and round-2 seed (k) each redden exactly these
- [x] An unticked box with a ` ✓` tail → `FREEZE-EDIT`; removing the unticked-box check reddens exactly this case — *Verify: fixture + seeded break* ✓ `unticked-box-with-check-tail`; seed dropping the clause reddens only it (builder, reviewer 1)
- [x] A sprint path spelled differently from git's toplevel runs without `CHECK-ERROR`: `run-by-reference-fixtures` and `run-orchestrator-store-fixtures` print `0 fail` under the default TMP on this host — *Verify: both verdict lines* ✓ coordinator on main, default 8.3 TMP: `127 pass, 0 fail` · `42 pass, 0 fail`; `alias-path` junction case clean; live SPRINT-107 close `11 pass, 0 fail`
- [x] The orchestrator-store host check reads the checker's verdict line; a checker that prints none makes the case FAIL — *Verify: seeded no-verdict checker* ✓ no-verdict stub reddens e2e-14, e2e-20 and the return-to-backlog case (NO-VERDICT)
- [x] Seeded-break proof per new check, under one stated hash convention; worktree-isolated outside review CLEAR — *Verify: review entry in the Execution Log* ✓ under A6 (owner, see the log): seeds (a)–(q) restored to the HEAD blob; round-3 review replaced by a coordinator check (127/0)

### T2 — Make the knowledge index byte-identical under any locale `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `scripts/gen-index.sh` · `docs/knowledge-index.md` · `evals/run-gen-index-locale-fixtures.ts` ·
  `evals/fixtures/gen-index-locale/` · `scripts/qa-check.sh`
Depends-on: none
Cites: `TASK-389` · SPRINT-107 outside review finding 4 · `3ae370d` · `b952f44`

Tier X. The file order comes from a shell glob, which sorts by the caller's locale. Pin the collation
for that enumeration only: `scripts/qa-check.sh` reads the vocab variables from this script, so nothing may leak.

**Acceptance:** the committed index passes `--check` under `LC_ALL=C` and under `en_US.UTF-8`, and
the default gate's `knowledge index` check is green on this host.

**DoD:**
- [x] `sh scripts/gen-index.sh --check` exits 0 under `LC_ALL=C` and under `LC_ALL=en_US.UTF-8` — *Verify: both runs* ✓ builder: both `PASS … knowledge index current`, rc=0; coordinator on main, host default locale: rc=0
- [x] The collation pin does not reach the caller: a variable read after sourcing the vocab shows the caller's locale unchanged — *Verify: fixture* ✓ under A3 (owner ruling, see the log): the caller's locale is unchanged in both real invocation shapes, the subprocess `--check` and the vocab grep (fixture cases `no-leak-subprocess` and `no-leak-vocab-grep`, PASS)
- [x] Retained TS fixture: file names that collate differently yield the same index under both locales, registered in `scripts/qa-check.sh` — *Verify: harness verdict line* ✓ `gen-index-locale-fixtures: 5 pass, 0 fail` on main; the locale control shows the raw glob order differs on this host; always-on profile, leg 12

## Decisions (pre-locked)
- **D1** — An edit inside an HTML comment in `## Done when` still counts as `FREEZE-EDIT`: masking finds section boundaries only, the compared text stays raw (owner ruling, 2026-09-26).
- **D2** — The repo stays mixed and runs the installed 1.66.x skills (SPRINT-107 D4 carries). Tasks are tracked in `TODO.md`; no release at close, since `CHANGELOG.md [Unreleased]` holds the 2.0 candidate.
- **D3** — The four scoped-out review findings are TD rows (`TD-182`…`185`), not sprint work (owner, G1).

## Assumptions
- **A1** — `realpathSync.native` expands an 8.3 short name to the spelling `git rev-parse --show-toplevel` prints. *Confirm: T1, on this host.*
- **A2** — The shell glob's collation is the index's only locale-dependent step. *Confirm: T2, regenerated diff under both locales is empty.*

## Execution Log

> **Lives in its own file** — `docs/sprint/archive/logs/SPRINT-108-guard-the-freeze.md`, created lazily at the
> first entry (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/lib/check-sprint-by-reference.ts` | T1 | CommonMark fence closing, block-comment scanner, real-path spelling, A5 (comment-stripped excuses, tolerant heading names, `LOG-HEADING-CHANGED`) | High | 127/0 retained; seeds (a)–(q) |
| `evals/run-by-reference-fixtures.ts` | T1 | 73 → 127 cases: fence, comment, code-span, heading, log-baseline and alias-path shapes, each with a sibling | Med | same |
| `evals/run-orchestrator-store-fixtures.ts` | T1 | host check requires the verdict line (`NO-VERDICT`) | Low | 42/0; no-verdict stub seed |
| `skills/lean-doc-generator/references/sprint-by-reference.md` | T1 | step 3 states the fence/comment rules and A5 | Low | read-through |
| `scripts/gen-index.sh` | T2 | byte-order enumeration via a scoped `LC_ALL=C sort` | Low | `--check` rc=0 under both locales |
| `evals/run-gen-index-locale-fixtures.ts` · `evals/fixtures/gen-index-locale/` | T2 | retained locale proof + leak checks | Low | 5/0; locale control |
| `scripts/qa-check.sh` | T2 | registers the locale harness always-on | Low | full gate 276/2 (both explained) |

## Retro

**Shipped** → `CHANGELOG.md` § SPRINT-108. Both tasks are done; Plan DoD 10 of 10. T1 was accepted under A6 (owner), and T2's
no-leak box under A3.
**System-verify:** `QA_FULL=1` gate `276 pass, 2 fail`, up from `259 pass, 6 fail` on `1777e0a` on this host. The two failures:
- prose density on this file's own line 53: fixed in `165a569`, and the check is now 0 FAIL
- the known TD-167 timing flake, PASS when run alone (third sighting logged)

**Tech debt** → `TD-182`…`185` (filed at G1) · `TD-186` (list-item containers and `<pre>` blocks, census zero) ·
TD-167 sighting. **Follow-ups** → none. **Learnings** → `L-217` (Tier G review needs a threat model and a stop rule).

**Retrieval check:** yes. L-165 (outside review for every Tier G change) was followed, but nothing bounded how many rounds it
takes, and L-186's selection rule caught the round-1 fixture conflation only once a reviewer applied it. L-217 is the gap.

**Cost:** coordinator plus 9 dispatched agents: 2 builders (T1: 3 revise rounds, about 1.58M tokens; T2: about 190k) and 4 reviews
(about 590k), for about 2.4M sub-agent tokens in all. Roughly 80% of the delivered value came from about 20% of that: the first T1 pass and T2.
The fence, comment and code-span rounds closed shapes that no live file carries. That cost is the case for L-217.

**Worked**
- Test-first with a sibling control per case, plus one-clause seeds. Each round's fixtures were red before the fix,
  and seeds exposed three fixtures that did not discriminate before they could ship.
- Parallel worktree dispatch for disjoint tasks (T1 ∥ T2) with coordinator-owned ticks and the log.
- Asking the owner at each exhausted retry instead of pressing on.

**Friction**
- An open-ended review brief ("hunt for new silent misses") with no stop rule, which drove three rounds.
- The coordinator's round-1 brief said raw lines for the whole scanner, which designed round 2's regressions in.
- The coordinator wrote a DoD premise from memory ("sourcing the vocab"). It needed A3.
- An Edit anchored on a line's tail appended evidence without flipping the box. It was caught only by counting.

**Pattern candidate** → `L-217` (count 1).
