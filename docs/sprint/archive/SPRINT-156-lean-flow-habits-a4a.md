---
sprint: 156
slug: lean-flow-habits-a4a
stream: s3-expertise
epic: EPIC-023
owner: Maintainer
last_updated: 2026-11-02
status: closed
close_commit: 0c556367
plan_commit: ea07afd0
gates_signed: G1,G2 @ 7f770538
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
  · `docs/work/todo/TASK-573-stop-headless-sessions-parking-on-out-of-tree-probes.md`
  · `docs/work/in_progress/TASK-573-stop-headless-sessions-parking-on-out-of-tree-probes.md`
  · `docs/work/done/TASK-573-stop-headless-sessions-parking-on-out-of-tree-probes.md`
Depends-on: none
Cites: TASK-573 · L-272 · `docs/research/logs/ab-measurements-a2.md` § Report 2026-11-02
The parked sessions' streams are kept, so the cause is quoted from them (scope-change 2026-11-02). The fix is skill text that keeps a
probe inside the working tree or on the repo's own test runner, else a judgment tick.

**Acceptance:** the tasks that parked re-run headless with the fixed plugin and stop at no popup.

### T2 — A coding task's design declares only the files its change needs `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `skills/` · `CHANGELOG.md`
Depends-on: T1
Cites: TASK-575 · EPIC-023 D12
82 of 93 measured lean-flow sessions failed G2's first scope check, reaching for the task file, product docs and flow docs. The
cause is quoted from a kept stream; the fix keeps ticking as coordinator bookkeeping outside the design's file list.

**Acceptance:** re-run on the same tasks, the first G2 scope check passes.

### T3 — Give small coding tasks a light path through the loop `[size: M · risk: med · class: decision · HITL · J2]` — cancelled at G2 (scope-change 2026-11-02, TASK-576 in `cancel/`)
Layers: `skills/` · `CHANGELOG.md` · `README.md`
Depends-on: T2
Cites: TASK-576 · `.claude/CLAUDE.md` § Design Principles (human-gated) · `cancel/` · `.out-of-scope/` (its cancellation, scope-change 2026-11-02)
A2's plan phase alone costs about what A0 spends on a whole task. A small, low-risk task keeps G1 as a short confirm and gets a
design note only where risk or size calls for one; no gate is self-approved. Whether this fits the D9 trial protocol is settled
at this task's G2.

**Acceptance:** the same tasks re-run cost less, with every grader still passing.

### T4 — Measure the three fixes as arm A4a against A2 `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `evals/ab/` · `docs/research/logs/ab-measurements-a4a.md` · `docs/epic/EPIC-023-specific-not-short.md`
Depends-on: T1, T2
Cites: TASK-574 · `evals/ab/PREREGISTRATION.md` Amendment 6 · EPIC-023 D8, D10, D12
A4a is A2's frozen snapshots with the plugin pinned at the commit carrying T1's and T2's fixes, so no new setup runs. Amendment 7 is
signed before any trial; validity on its own 32 slots first, then the ruling against A2.

**Acceptance:** A4a's 32 slots are scored under a signed Amendment 7 in their own log, and the log records the ruling against A2.

## Decisions (pre-locked)

- **D1** — One arm for two fixes (owner, EPIC-023 D12 and D13). T1 then T2 land, and A4a pins the commit after T2; S4's
  leave-one-out attributes the effect.
- **D2** — Shared files: `skills/` and `CHANGELOG.md` are touched by T1 then T2, in that commit order (sequential, no parallel
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
| `skills/orchestrator/SKILL.md` | T1, T2, TASK-578 | probes stay in the working tree; a design lists only what the change needs inside its layers; reports carry a Progress line | med | dev re-runs 5/5, arm A4a |
| `CHANGELOG.md` | T1, T2, T4, TASK-578 | `[Unreleased]` Changed lines and the A4a measurement | low | read-through |
| `evals/ab/analyze.ts` · `lib/analyze.ts` · `selftest.ts` | T4 | `--comparator <arm>` for a ruling against A2 | med | selftest 75/75, S70 must-FAIL seed |
| `evals/ab/arms/*-a4a*` · `schedule-a4a.json` · `hash-prereg.ts` | T4 | arm A4a on A2's snapshots, plugin pinned at `56964ce2` | med | build-slots 32/32 |
| `evals/ab/PREREGISTRATION.md` | T4 | Amendment 7, owner-signed | high | hash recorded, Codex 2 rounds |
| `docs/research/logs/ab-measurements-a4a.md` | T4 | freeze line, 33 rows, report and ruling | med | analyze VALID |
| `docs/epic/EPIC-023-specific-not-short.md` | coordinator | D11-D15, S3 mark | low | triage coverage |
| `.out-of-scope/light-path-small-tasks.md` | T3 | the light path rejected at G2 | low | read-through |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Outcome** — 3 of 4 members delivered (TASK-573, 575, 574); TASK-576 cancelled at G2 (its cost premise was the trial protocol,
not lean-flow). Two lean-flow habits fixed in `skills/orchestrator/SKILL.md`: probes stay inside the working tree (TASK-573), and
a design declares only what the change needs inside the declared layers (TASK-575). On five development re-runs the first G2
scope check passed 5 of 5 (82 of 93 failed before), with no park and about a third lower cost. Arm A4a: 32/32 VALID, 90.6%
against A2's 78.1%, gain +12.5 [3.1, 21.9], no symptom regression (business +11.1, scope +9.4), above A0 (89.6%), cost 0.55x
A1; 1 park of 32 (A2 3), 0 slots with an out-of-tree probe. Ruled ship-eligible, tuning-sensitive (the eleven untouched tasks
tie A2 at 90.9%, a ceiling); owner rules it ships (EPIC-023 D15). Quick one-off TASK-578 (reports carry a Progress line)
landed beside the Plan.

**Retrieval check** — one miss, one hold. Missed: TASK-573 said the parked sessions' streams were swept; the coordinator had looked
in the wrong directory, and every stream was kept (`D:\ab-work\kept\`). Held: the design-phase recon used those streams to name
the causes before any paid reproduction, saving about ten runs, and the verifier was proven on A2's log before reading the re-runs.

**Cost** — development re-runs $7.62 (five slots); A4a scored $45.55 + $1.20 infra (A2 $64.81). Codex: three builder checks
169.8k, the `--comparator` build 82.8k, Amendment 7 review 121.1k (two rounds), the process review 98.1k (471.8k in all). Owner
time: the pilot start, popup rulings and two signatures; the full arm ran unattended (detached driver, exit watcher, push
notification), finishing about 45 minutes before its estimate.

**Worked**
- Kept streams as the diagnosis source: causes quoted, not guessed, and cheap.
- Development runs as the iteration loop, then one bundled arm (now EPIC-023 D14).
- Codex as builder for the execution piece, with a must-FAIL seed before landing.

**Friction**
- Two waits of about two hours (A2, A4a); the process ruling (D14) and TASK-577 (parallel trials) answer it.
- Commits under a `Tn` subject that moved or ticked a member file failed `layers observed`; bookkeeping commits carry the
  coordinator subject `sprint(N):`.
- The harness's design scope check does not exempt `docs/work/` while its post-run breach check does (14 of 82 first-round
  refusals were the task file alone).
- The untouched-task secondary was set at +0.10 on tasks where A2 already scored 90.9%, so it could not be met; a secondary's
  bar is checked against the comparator's ceiling before it is frozen (L-279).
- A log append in `d52bf3a0` left a truncated copy of its entry; the log is append-only, so it stays, with a note.

**Pattern candidates**
- L-278 (count 1): lean-flow sessions wrote throwaway probes outside the repo in 54% of A1 and 56% of A2 sessions against 6% of A0;
  measure a habit across all kept streams, not only the sessions where it failed visibly. A4a: 0 of 32.
- L-279 (count 1): a predeclared threshold on a subset is checked against the comparator's ceiling there before freezing.

**Buckets routed** — Shipped: CHANGELOG [Unreleased] (TASK-573, 575, 578; A4a measured). Tech debt: TD-286, the design scope check
vs the post-run breach check on `docs/work/` (frozen rule; fix in a later amendment). Follow-ups: TASK-577 (parallel trials), TASK-579
and TASK-580 (bundle 2), TASK-581 (bundle 2's arm). Learnings: L-278, L-279.
