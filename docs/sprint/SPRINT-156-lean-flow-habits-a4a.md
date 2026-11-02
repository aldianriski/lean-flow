---
sprint: 156
slug: lean-flow-habits-a4a
stream: s3-expertise
epic: EPIC-023
owner: Maintainer
last_updated: 2026-11-02
status: active
plan_commit: ea07afd0
update_trigger: sprint execute/close events
---

# SPRINT-156 — S3: Three lean-flow Habits, Measured as A4a

> **Theme:** A2 showed lean-flow below plain Claude Code (78.1% against 89.6%) at several times its tokens, and the gap is made of
> lean-flow's own habits, not wrong code: sessions park writing probes outside the repo, designs list files the change does not
> need and pay a revise round, and a small task pays for the whole loop. This sprint fixes all three in the skills and measures
> them once, as arm A4a against A2 (EPIC-023 D11, D12).

## Scope

**In:** the popup-stop fix (T1, TASK-573) · designs that declare only the files a change needs (T2, TASK-575) · a light path for
small coding tasks (T3, TASK-576) · Amendment 7 and the 32-slot arm A4a against A2, ruled by the pre-registered procedure (T4,
TASK-574).
**Out (deferred):** S3a's brief fields and S3b's pilot reviewers (after A4a) · workdoo-specific fixes (owner: lean-flow first) ·
any harness change beyond what Amendment 7 needs · a release (D6: only on a passing arm).

## Members

- docs/work/todo/TASK-573-stop-headless-sessions-parking-on-out-of-tree-probes.md
- docs/work/todo/TASK-575-a-coding-task-declares-only-the-files-its-change-needs.md
- docs/work/todo/TASK-576-give-small-coding-tasks-a-light-path-through-the-loop.md
- docs/work/todo/TASK-574-measure-the-popup-stop-fix-as-arm-a4a-vs-a2.md

## Plan

### T1 — Stop sessions parking a headless run on probes written outside the repo `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `skills/` · `CHANGELOG.md` · `docs/research/`
Depends-on: none
Cites: TASK-573 · L-272 · `docs/research/logs/ab-measurements-a2.md` § Report 2026-11-02
The parked sessions' streams were swept, so the cause comes from a fresh headless run on a task that parked, on a research copy
of its A2 snapshot. The fix is skill text that keeps a probe inside the working tree or on the repo's own test runner.

**Acceptance:** the tasks that parked re-run headless with the fixed plugin and stop at no popup.

### T2 — A coding task's design declares only the files its change needs `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `skills/` · `CHANGELOG.md`
Depends-on: T1
Cites: TASK-575 · EPIC-023 D12
82 of 93 measured lean-flow sessions failed G2's first scope check, reaching for the task file, product docs and flow docs. The
cause is quoted from a kept stream; the fix keeps ticking as coordinator bookkeeping outside the design's file list.

**Acceptance:** re-run on the same tasks, the first G2 scope check passes.

### T3 — Give small coding tasks a light path through the loop `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `skills/` · `CHANGELOG.md` · `README.md`
Depends-on: T2
Cites: TASK-576 · `.claude/CLAUDE.md` § Design Principles (human-gated)
A2's plan phase alone costs about what A0 spends on a whole task. A small, low-risk task keeps G1 as a short confirm and gets a
design note only where risk or size calls for one; no gate is self-approved. Whether this fits the D9 trial protocol is settled
at this task's G2.

**Acceptance:** the same tasks re-run cost less, with every grader still passing.

### T4 — Measure the three fixes as arm A4a against A2 `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `evals/ab/` · `docs/research/logs/ab-measurements-a4a.md` · `docs/epic/EPIC-023-specific-not-short.md`
Depends-on: T1, T2, T3
Cites: TASK-574 · `evals/ab/PREREGISTRATION.md` Amendment 6 · EPIC-023 D8, D10, D12
A4a is A2's frozen snapshots with the plugin pinned at the commit carrying all three fixes, so no new setup runs. Amendment 7 is
signed before any trial; validity on its own 32 slots first, then the ruling against A2.

**Acceptance:** A4a's 32 slots are scored under a signed Amendment 7 in their own log, and the log records the ruling against A2.

## Decisions (pre-locked)

- **D1** — One arm for three fixes (owner, EPIC-023 D12). T1-T3 land in that order and A4a pins the commit after T3; S4's
  leave-one-out attributes the effect.
- **D2** — Shared files: `skills/` and `CHANGELOG.md` are touched by T1, T2 and T3, in that commit order (sequential, no parallel
  build). `docs/research/` is T1's alone.
- **D3** — Every diagnosis and re-run uses a research copy of an A2 snapshot and a pinned clone of the plugin, never a frozen arm
  snapshot and never the live checkout from an interactive session (L-277).
- **D4** — While A4a's trials measure wall time, this machine runs no build, gate or selftest, and the full run goes to the
  owner's terminal with Git's `usr\bin` on PATH (L-275).
- **D5** — All four tasks are decision-class, so Claude builds them; any execution-class piece split out at G2 is Codex-built
  and Claude-reviewed (owner ruling 2026-11-02).

## Assumptions

- **A1** — `run-trial.ts` without `--measured` runs one headless trial of an A/B task on a given arm and keeps its stream, which is
  enough for T1-T3's diagnoses and re-runs. *Confirm: its arguments, at G2.*
- **A2** — The trial's allowed layers are the task's real scope, so a design listing the task file is an adopter-real failure, not
  a harness artifact. *Confirm: the D9 protocol text, at T2's G2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-156-lean-flow-habits-a4a.md`](logs/SPRINT-156-lean-flow-habits-a4a.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
