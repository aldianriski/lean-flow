---
sprint: 109
slug: unlock-the-critical-path
epic: EPIC-017
owner: Maintainer
last_updated: 2026-09-28
status: active
plan_commit: 1834c83
update_trigger: sprint execute/close events
---

# SPRINT-109 — Unlock the Critical Path

> **Theme:** `EPIC-017`'s third member, and the first one chosen by the path to `2.0.0` rather than by
> readiness. The path runs `377 → 383 → 381 → 380 → 371 → 372 → 373`, and two of its inputs are decisions
> no guard work can start without: what the standard now *says* about the store (`TASK-377`), and what a
> cap *measures* (`TASK-364`). Two guard retargets that only need the store run alongside them (`TASK-382` ·
> `TASK-387`). After this sprint, `378` · `379` · `384` are unblocked, and so is `383` once `390`/`391` land.

## Scope

**In:** STANDARD amended for the store, with the spec MAJOR bumped (`TASK-377`) · a token budget over the
always-loaded read set, plus the ADR that supersedes ADR-015/017/019 (`TASK-364`) · the authority and
task-origin guards read task files (`TASK-382`) · the dod-delta and verify-reaches guards read member files
(`TASK-387`).

**Out (deferred):** `TASK-390` / `TASK-391` (the two layers guards, split from `TASK-363` at this promote,
kept for the next sprint) · `TASK-370` (the rest of migrate's proof) · `TASK-384` (closing the four soft
OVER-CAP rows by disposition, which depends on 364 and 377) · `TD-187` (the S11.TDDELETE false negative,
filed at this promote) · any release (D2).

## Members

- docs/work/todo/TASK-377-amend-standard-for-the-store.md
- docs/work/todo/TASK-364-budget-the-consumed-resource.md
- docs/work/todo/TASK-382-retarget-task-metadata-guards.md
- docs/work/todo/TASK-387-retarget-dod-delta-and-verify-reaches.md

## Plan

### T1 — Amend STANDARD for the work-item store and bump the spec MAJOR `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `docs/work/README.md`
Depends-on: none
Cites: `TASK-377` · EPIC-017 D1 · D2 · ADR-045 · ADR-046 · ADR-047

Tier P. The standard is the SSOT (ADR-023), and it still places `TODO.md` and describes a sprint by copy.
Every guard retarget after this sprint cites it, so it goes first. The hand-off list of conformance rules
that still point at `TODO.md` is what `TASK-383` starts from.

**Acceptance:** §2 · §9 · §10 · §11 describe the store, the spec version is a MAJOR with a breaking
CHANGELOG entry, and `TASK-383` has a named list of the rules it must retarget.

### T2 — Budget the tokens the always-loaded read set actually consumes `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `scripts/lib/check-doc-caps.sh` · `scripts/lib/check-doc-caps.ts` · `evals/run-doc-caps-fixtures.sh` · `evals/doc-caps.test.ts` ·
  `evals/run-doc-caps-differential.ts` · `evals/fixtures/doc-caps/` · `spec/STANDARD.md` (after T1, D1) ·
  `docs/adr/` (new ADR) · `docs/DECISIONS.md`
Depends-on: T1 on `spec/STANDARD.md` only (D1)
Cites: `TASK-364` · EPIC-017 D3 · ADR-015 · ADR-017 · ADR-019 · TD-174

Tier G. The cap counts newlines, and a file can grow 2.62× while its line count holds flat. So the check
measures what a session actually pays for, with a named tokenizer, and keeps line counts as a secondary
signal. The ADR records why the three cap ADRs are superseded.

**Acceptance:** `check-doc-caps` reports a token figure for the always-loaded read set and names its
tokenizer, a retained must-FAIL fixture reddens on an over-budget set, and the superseding ADR is indexed.

### T3 — Retarget the task-metadata guards onto the store `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/lib/check-authority.sh` · `scripts/lib/check-authority.ts` · `scripts/lib/check-task-origin.sh` ·
  `scripts/lib/prose-density-baseline.txt` · `evals/run-authority-fixtures.sh` · `evals/authority.test.ts` ·
  `evals/run-authority-differential.ts` · `evals/run-task-origin-fixtures.sh` · `evals/fixtures/authority/` ·
  `evals/fixtures/task-origin/`
Depends-on: none
Cites: `TASK-382` · Codex r1 F1 · L-058 · L-166 · L-186

Tier G. Both guards read `authority:` / `origin:` from a Plan's `### Tn` blocks. A v2 sprint has none, so
right now both pass without examining anything.

**Acceptance:** on a v2 tree with no `### Tn` headings, each guard examines the member task files and
reddens on a planted violation with its named finding, and an isolated outside review is CLEAR.

### T4 — Retarget the dod-delta and verify-reaches guards onto member files `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/lib/check-dod-delta.ts` · `scripts/lib/check-verify-reaches.sh` ·
  `evals/run-dod-delta-fixtures.sh` · `evals/dod-delta.test.ts` · `evals/run-verify-reaches-fixtures.sh` ·
  `evals/fixtures/dod-delta/` · `evals/fixtures/verify-reaches/`
Depends-on: none
Cites: `TASK-387` · Codex r1 F1 · r2 R2-3c · L-166 · L-186

Tier G. The DoD boxes and `Verify:` clauses these guards count now live in member files' `## Done when`,
not in the Plan. A guard still reading the Plan finds nothing on a v2 sprint and passes vacuously.

**Acceptance:** on a v2 sprint with no inline Plan, both guards count member-file boxes and `Verify:`
clauses and redden on a planted violation with a named finding, and an isolated outside review is CLEAR.

## Decisions (pre-locked)
- **D1** — `spec/STANDARD.md` is shared by T1 and T2. **T1 owns it.** T2's section lands after T1's
  MAJOR commit, as its own hunk, staged per hunk (L-042).
- **D2** — The repo stays mixed and runs the installed 1.66.x skills (SPRINT-108 D2 carries). There is no
  release at close, because `CHANGELOG.md [Unreleased]` holds the 2.0 candidate.
- **D3** — No new `.sh` file (owner rule, 2026-09-09). T2–T4 edit the existing sh+ts pairs; any new harness
  or checker logic is TypeScript on Bun.
- **D4** — `TASK-363` (size L) was split at this promote into `TASK-390` and `TASK-391`, one per guard. Both
  stay in the backlog (owner, 2026-09-28).

## Assumptions
- **A1** — The spec MAJOR bump from `0.11.0` means `1.0.0` (semver's MAJOR for a `0.x` line), not `0.12.0`.
  *Confirm: owner, at G2 (T1).*
- **A2** — A tokenizer can be named and run while `package.json` keeps zero dependencies (ADR-032's
  no-install premise). *Confirm: G2 (T2). If none fits, that is a ruling, not a quiet new dependency.*
- **A3** — The four T3/T4 guards find the members of a v2 sprint through `sprint:` stamps and `## Members`,
  the two indices ADR-047 defines, and need no third index. *Confirm: T3/T4 recon, before building.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-109-unlock-the-critical-path.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
