---
sprint: 176
slug: coordinator-reference-for-lanes
owner: Maintainer
last_updated: 2026-11-15
status: active
plan_commit: 411b135b
update_trigger: sprint execute/close events
---

# SPRINT-176 — A Coordinator Reference for Multi-Session Work

> **Theme:** Ship a generic coordinator reference for multi-session work, taken from the bloodlines coordinator-and-lane run (2026-11-14/15). It carries a scoped one-session rule, cross-lane shared-file hunk approval and per-lane id booking that extends L-143, then a replay of the real run against it.
> Consumer evidence (ADR-053 §4), prose only: no script, checker or ledger field.

## Scope

**In:** TASK-662 (the reference and the scoped rule) · TASK-663 (hunk approval and id booking) · TASK-664 (the replay proof).
**Out (deferred):** TASK-367 (owner ruling 2026-11-15, "Keep out (Recommended)": its Touches and Done-when are fixed first, and it goes in a later sprint) · EPIC-025 Sprint B (workdoo) · any script that derives ids.

## Members

- docs/work/todo/TASK-662-coordinator-reference-and-scoped-rule.md
- docs/work/todo/TASK-663-cross-lane-hunk-approval-and-id-booking.md
- docs/work/todo/TASK-664-coordinator-reference-replay-proof.md

## Plan

### T1 — Add the coordinator reference and scope the one-session rule `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/coordinator.md` · `skills/orchestrator/SKILL.md` · `.claude/CONTEXT.md` · `README.md` · `CHANGELOG.md` · `docs/LEARNINGS.md` · `skills/prime/SKILL.md` · `skills/handoff/SKILL.md` · `skills/flow/SKILL.md` · `skills/orchestrator/references/dispatch.md`
Depends-on: none
Cites: TASK-662, `references/dispatch.md`
Multi-session coordination has no shipped text and the one-session rule is in no shipped surface. The last four Layers are the wiring-check reads, each changed or recorded "no change needed"; prune unused tokens at G2. Per-task meta: its `## Assumes` line "Builds after EPIC-025 Sprint B closes" is superseded by D2.

**Acceptance:** the reference exists and is reachable from the orchestrator SKILL.md pointer and CONTEXT Streams.

### T2 — Add cross-lane hunk approval and id booking, extending L-143 `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/coordinator.md` · `.claude/CONTEXT.md` · `skills/task-decomposer/references/task-file.md` · `CHANGELOG.md`
Depends-on: T1
Cites: TASK-663, TASK-662, `skills/orchestrator/SKILL.md`, `references/dispatch.md`, `.claude/CLAUDE.md`
L-143 is right inside one tree and blind to other lanes; the coordinator's booking prevented a real collision. Per-task meta: its `## Assumes` line "Builds after EPIC-025 Sprint B closes" is superseded by D2.

**Acceptance:** both sections exist and the single-tree id derivation is unchanged.

### T3 — Replay the real lane briefs and id allocation against the reference `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/work/evidence/TASK-664/` · `TECH-DEBT.md`
Depends-on: T1, T2
Cites: TASK-664, `coord.txt`, `mobile.txt`, `web.txt`, `extract.ts`
A behaviour shipped spec-only is the L-007 anti-pattern; the reference is credible only if the real run fits it. Evidence home resolved to `docs/work/evidence/TASK-NNN/` (STANDARD §11, ADR-056), confirm at G2; `TECH-DEBT.md` only for gap TDs.
Box 1's evidence copy is done early, in wave 1, by the coordinator, from the coordinator session's scratchpad digests (`coord.txt`, `mobile.txt`, `web.txt`; `extract.ts` re-extracts them from the bloodlines project transcripts). Its `## Assumes` build-after line is superseded by D2.

**Acceptance:** the message-type table has no unaccounted in-scope requirement, and the produced brief and allocation are compared with the real ones.

## Decisions (pre-locked)

- **D1** — Shared files, single owner and commit order: `coordinator.md` T1 creates, T2 extends; `CONTEXT.md` T1 edits § Streams, T2 edits § Gates (separate hunks); `CHANGELOG.md` T1 then T2, one entry each. Stage per hunk (`git add -p`), read `git diff --cached`. Commits are `sprint(176) Tn: …`; only the promote moves are bare.
- **D2** — Owner ruling 2026-11-15, verbatim "Frozen 2.23.0 worktree (Recommended)" (EPIC-025 D9, `d170295e`): Sprint B loads lean-flow from a frozen worktree, so TASK-662..664 may build now. Each task's `## Assumes` line "Builds after EPIC-025 Sprint B closes" is superseded; the task files are not rewritten.
- **D3** — T1 and T2 change shipped skills, so each takes a Codex review before sign-off, at most 2 rounds (the tasks' G2 cap). Builder choice is ruled at G2. T3 is Tier X.
- **D4** — Owner ruling 2026-11-15, verbatim "Net-zero rule (Recommended)": T1 and T2 add no new line to the always-loaded docs (`.claude/CONTEXT.md` 150 of 150, `.claude/CLAUDE.md` 79 of 80). They append to existing bullets, about 440 characters in total; the SKILL.md pointer replaces an existing line (140 of 140). If a cap check fails mid-build, stop and ask.

## Assumptions

- **A1** — No script derives a next id. *Confirm: T2 at G2, by reading the id-parsing scripts (a first grep found only the conformance engine's retention read of the highest id).*
- **A2** — Both always-loaded additions fit the token-budget headroom (about 170 tokens). *Confirm: `check-doc-caps.ts` at T1 and T2.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-176-coordinator-reference-for-lanes.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. -->
