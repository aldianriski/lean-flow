---
sprint: 108
slug: guard-the-freeze
owner: Maintainer
last_updated: 2026-09-26
status: active
plan_commit: [sha — set at promote]
close_commit: [sha — set at close]
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
- [ ] Nested fence in Done when (four-backtick fence around a three-backtick one holding a `## ` line) + a post-promote box edit → `FREEZE-EDIT`; same shape unedited → clean — *Verify: retained must-FAIL fixture + sibling*
- [ ] A fenced example `scope-change` entry in the log does not excuse a real edit → `FREEZE-EDIT` — *Verify: retained must-FAIL fixture + sibling*
- [ ] A `## ` line inside an HTML comment does not end Done when; an edit below it **and** an edit inside it → `FREEZE-EDIT` — *Verify: retained must-FAIL fixtures + sibling*
- [ ] An unticked box with a ` ✓` tail → `FREEZE-EDIT`; removing the unticked-box check reddens exactly this case — *Verify: fixture + seeded break*
- [ ] A sprint path spelled differently from git's toplevel runs without `CHECK-ERROR`: `run-by-reference-fixtures` and `run-orchestrator-store-fixtures` print `0 fail` under the default TMP on this host — *Verify: both verdict lines*
- [ ] The orchestrator-store host check reads the checker's verdict line; a checker that prints none makes the case FAIL — *Verify: seeded no-verdict checker*
- [ ] Seeded-break proof per new check, under one stated hash convention; worktree-isolated outside review CLEAR — *Verify: review entry in the Execution Log*

### T2 — Make the knowledge index byte-identical under any locale `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `scripts/gen-index.sh` · `docs/knowledge-index.md` · `evals/run-gen-index-locale-fixtures.ts` ·
`evals/fixtures/gen-index-locale/` · `scripts/qa-check.sh`
Depends-on: none
Cites: `TASK-389` · SPRINT-107 outside review finding 4 · `3ae370d` · `b952f44`

Tier X. The file order comes from a shell glob, which sorts by the caller's locale. Pin the collation
for that enumeration only: `qa-check.sh` reads the vocab variables from this script, so nothing may leak.

**Acceptance:** the committed index passes `--check` under `LC_ALL=C` and under `en_US.UTF-8`, and
the default gate's `knowledge index` check is green on this host.

**DoD:**
- [ ] `sh scripts/gen-index.sh --check` exits 0 under `LC_ALL=C` and under `LC_ALL=en_US.UTF-8` — *Verify: both runs*
- [ ] The collation pin does not reach the caller: a variable read after sourcing the vocab shows the caller's locale unchanged — *Verify: fixture*
- [ ] Retained TS fixture: file names that collate differently yield the same index under both locales, registered in `qa-check.sh` — *Verify: harness verdict line*

## Decisions (pre-locked)
- **D1** — An edit inside an HTML comment in `## Done when` still counts as `FREEZE-EDIT`: masking finds section boundaries only, the compared text stays raw (owner ruling, 2026-09-26).
- **D2** — The repo stays mixed and runs the installed 1.66.x skills (SPRINT-107 D4 carries). Tasks are tracked in `TODO.md`; no release at close, since `CHANGELOG.md [Unreleased]` holds the 2.0 candidate.
- **D3** — The four scoped-out review findings are TD rows (`TD-182`…`185`), not sprint work (owner, G1).

## Assumptions
- **A1** — `realpathSync.native` expands an 8.3 short name to the spelling `git rev-parse --show-toplevel` prints. *Confirm: T1, on this host.*
- **A2** — The shell glob's collation is the index's only locale-dependent step. *Confirm: T2, regenerated diff under both locales is empty.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-108-guard-the-freeze.md`, created lazily at the
> first entry (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
