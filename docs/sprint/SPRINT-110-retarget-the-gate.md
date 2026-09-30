---
sprint: 110
slug: retarget-the-gate
epic: EPIC-017
owner: Maintainer
last_updated: 2026-09-30
status: closed
plan_commit: 4ddc80d
gates_signed: G1,G2 @ 04e517c
update_trigger: sprint execute/close events
---

# SPRINT-110 — Retarget the Gate

> **Theme:** `EPIC-017`'s fourth member, and the next leg of the path to `2.0.0`
> (`390 ∥ 391 → 383 · 392 → 381 → 380 → 371 → 372 → 373`). SPRINT-109 moved four guards onto member files.
> This sprint moves the rest of the gate: the two layers guards first, then the conformance engine,
> `qa-check.sh` and `night-run.sh`, which still read the v1 layout and so check nothing on a by-reference
> sprint. After it, `381` is unblocked, and then `380` (delete `TODO.md`).

## Scope

**In:** check-layers-completeness reads member files (`TASK-390`) · check-layers-observed reads member files
(`TASK-391`) · the conformance engine's `TODO.md` rules re-pointed at the store, with task files exempt from the
ownership header (`TASK-383`) · `qa-check.sh`'s TODO legs and `night-run.sh`'s `reap()` read the store (`TASK-392`).

**Out (deferred):** `TASK-381` (eval inventory, after this sprint) · `TASK-380` (delete `TODO.md`) · `TASK-384`
(dispositions for the four soft OVER-CAP files and the TD-174 forcing function) · `TASK-378` · `TASK-379` · `TASK-370` ·
`TD-188` (the shared member lookup drops an ambiguous id; T1/T2 import it read-only) · `TD-194` (worktrees cannot run
`typecheck`: D5 works around it, and does not fix it) · any release (D3).

## Members

- docs/work/todo/TASK-390-retarget-layers-completeness-onto-member-files.md
- docs/work/todo/TASK-391-retarget-layers-observed-onto-member-files.md
- docs/work/todo/TASK-383-retarget-conformance-and-gate-wiring.md
- docs/work/todo/TASK-392-retarget-qa-check-and-night-run.md

## Plan

### T1 — Retarget check-layers-completeness onto member task files `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/lib/check-layers-completeness.ts` · `evals/run-layers-completeness-fixtures.sh` ·
  `evals/layers-completeness.test.ts` · `evals/layers-completeness-differential.ts` · `evals/fixtures/layers-completeness/`
Depends-on: none
Cites: `TASK-390` · EPIC-017 scope 4 · Codex r1 F1 · L-058 · L-166 · L-186 · `scripts/lib/sprint-members.ts` (imported, read-only)

Tier G. The guard compares what a task's DoD and Acceptance prose implies against its `Layers:`. On a
by-reference sprint that prose lives in the member's `## Done when`, so the guard reads a Plan with no DoD
and passes without examining anything.

**Acceptance:** on a v2 sprint, the guard reads each member's `## Done when` against the Layers that govern it, and
reddens on a planted undeclared file with its named finding. It also reddens on a sprint with no inline Plan
instead of passing vacuously. An isolated outside review is CLEAR.

### T2 — Retarget check-layers-observed onto member task files `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/lib/check-layers-observed.ts` · `evals/run-layers-observed-fixtures.sh` ·
  `evals/run-layers-observed-differential.ts` · `evals/fixtures/layers-observed/` · `evals/layers-observed.test.ts` (new)
Depends-on: none
Cites: `TASK-391` · EPIC-017 scope 4 · Codex r1 F1 · ADR-039 · L-166 · L-186 · `scripts/lib/sprint-members.ts` (imported, read-only)

Tier G. Leg 15 attributes each commit to a task and checks the files it touched against that task's `Layers:`.
On a v2 sprint, a task is a member file, and a sprint with no inline Plan gives the guard nothing to attribute to.

**Acceptance:** on a v2 sprint, a commit attributed to a member that touches a file outside its Layers reddens
with its named finding. A sprint with no inline Plan reddens instead of passing vacuously. An isolated outside
review is CLEAR.

### T3 — Retarget the conformance engine onto the store `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-conformance-engine-fixtures.sh` ·
  `evals/run-sprint-family-fixtures.sh` · `evals/run-ownership-header-fixtures.sh`
Depends-on: T1 · T2 (TASK-383's `depends-on`) · T4 (owns `scripts/lib/sprint-members-cli.ts`, G2 ruling R3)
Cites: `TASK-383` · its hand-off list (SPRINT-109 T1, `3c85e84`) · `spec/STANDARD.md` 0.12.0 §2 · §9 · §10 · §11 · ADR-045 · ADR-047 · D2 · `TODO.md` (named, not touched)

Tier G. The engine is what ships the standard to consumers, and seven of its rules still read `TODO.md` or a
Plan-copied DoD. On a v2 tree, each either FAILs on a file that no longer exists or checks nothing. Its
`_own_docs` sweep adds about 28 header FAILs on task files, which D2 rules exempt.

**Acceptance:** every rule on the hand-off list reads the store (or is retired with its replacement named), each
has a retained must-FAIL fixture, task files are exempt from S1.LAW3/S3.SCHEMA, and an isolated outside review
is CLEAR.

### T4 — Retarget qa-check and night-run onto the store `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/qa-check.sh` · `scripts/night-run.sh` · `evals/run-night-run-rollup-fixtures.sh` ·
  `evals/night-run-rollup.test.ts` · `evals/fixtures/night-run-rollup/` · `scripts/lib/sprint-members-cli.ts` (new) ·
  `evals/run-reap-terminal-fixtures.sh` · `evals/run-night-run-outcome-fixtures.sh` · `evals/fixtures/night-run-outcome/` ·
  `evals/run-revise-loop-ceiling-fixtures.sh` · `evals/fixtures/night-run-reaper/` · `skills/orchestrator/references/night-run.md` ·
  `evals/run-qa-store-legs-fixtures.ts` (new)
Depends-on: T1 · T2 (TASK-392's `depends-on`)
Cites: `TASK-392` · night-run.md Part 4 (in Layers: its :516 is stale) · ADR-047 · L-020 · `TODO.md` (named, not touched)

Tier G. The gate's TODO-hygiene and Active Sprint legs read `TODO.md`, and `reap()` counts boxes in the sprint
file. So on a by-reference sprint the gate checks nothing and a night run reports `0 of 0`. The prose contract
(night-run.md Part 4) already counts member `## Done when` boxes, and the script follows it.

**Acceptance:** on a v2 tree, the gate's store legs and `reap()` count member files and redden on a planted
violation with a named finding, `reap()` matches a hand count on a real sprint, and an isolated outside review
is CLEAR.

## Decisions (pre-locked)
- **D1** — **`.ts` gates, carried from SPRINT-109's TASK-382 ruling** (owner, 2026-09-29). A Done-when's "(sh + ts)" is
  met by the checker `qa-check.sh` runs. Each `.sh` stays a Plan-path oracle for its differential, and the differential
  names the member exclusion. No new `.sh`, and no new shell logic (owner rule, 2026-09-09).
- **D2** — **The store is exempt from the ownership header** (owner, 2026-09-29, recorded in TASK-383). Task files carry
  their own schema (ADR-045) and status is the folder, so a `last_updated` there would be a second status source.
- **D3** — No release at close. The repo stays mixed and runs the installed 1.66.x skills. `CHANGELOG.md [Unreleased]`
  holds the 2.0 candidate (carried from SPRINT-109 D2).
- **D4** — `TASK-383` was split at this promote into `383` (engine) and `392` (qa-check, night-run), one per surface
  (owner, 2026-09-29). `380` and `381` now depend on both.
- **D5** — **After each merge, the coordinator runs the fast cross-cutting legs on `main`**: `typecheck` · corpus
  metadata · `gen-index --check` · layers-completeness over the sprint file. Not only the task's harness. This is L-218
  applied, because SPRINT-109 carried four such FAILs to its close.
- **D6** — `scripts/lib/sprint-members.ts` is shared, read-only. T1–T4 import it and none edits it. `TD-188` stays out of
  scope, and a guard that needs it fixed raises a scope-change.

## Assumptions
- **A1** — On a v2 sprint, the governing Layers for a member come from the Plan block whose `Cites:` names it. When a
  sprint has no inline Plan, they come from the member's `## Touches`. *Confirm: T1/T2 recon, before building (SPRINT-109's
  A3 was false because a premise of shape went unchecked).*
- **A2** — `TASK-363`'s stale candidate-file inventory (15 → 24 · 38 · 50, by selector) is re-derived per guard.
  *Confirm: T1/T2 recon, two selection routes (L-198).*
- **A3** — T3 changes where rules read, not what they mean, so `spec/STANDARD.md` §14 needs no edit. *Confirm: T3 recon. If
  a rule is retired (`S11.TODOCAP`), §14's row changes, and that is a scope-change adding the spec to T3's Layers.*
- **A4** — T4's `qa-check.sh` edits are confined to the store legs. T1/T2 need no change to how the gate invokes them.
  *Confirm: T1/T2 recon. If either needs `qa-check.sh`, T4 owns the file and theirs lands as its own hunk (L-042).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-110-retarget-the-gate.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/lib/conformance-engine.sh` | T3 | S9/S10/S11/S3 rules read the store; `bun-required` (ADR-049); task files exempt (D2); §11 store prune | High (Tier G, adopter-facing) | 3 harnesses green · seeds · v1 parity 354+109 · review CLEAR |
| `evals/run-sprint-family-fixtures.sh` · `run-ownership-header-fixtures.sh` · `run-conformance-engine-fixtures.sh` | T3 | ~72 retained v2 cases (sprint-family is opt-in, 3 → ~8 min) | Low | verdict lines |
| `docs/adr/ADR-049-*.md` · `docs/DECISIONS.md` · README · CHANGELOG | T3 (coordinator) | a v2 tree requires `bun` (R4) | Med (consumer-facing) | read-through |
| `TECH-DEBT.md` · `docs/work/backlog/TASK-393-*.md` | T3 (coordinator) | TD-204…208; the TS engine port after 2.0 (R6) | Low | — |
| `scripts/lib/sprint-members-cli.ts` (new) | T4 | `kind · members · counts · active` for shell callers; named exits 2/3/64 (R3, T3 consumes it) | High (Tier G, shared) | 36/0 · seeds · review CLEAR |
| `scripts/night-run.sh` · `skills/orchestrator/references/night-run.md` | T4 | `reap()` counts member Done-when boxes on v2; the stale :516 fixed | High (Tier G) | reap/outcome/revise-loop green · seeds |
| `scripts/qa-check.sh` | T4 | leg 2g/7 read the store; legs 3/5/8 only while TODO.md exists (R2); new harness registered | High (Tier G) | store-legs 36/0 · rollup green |
| `evals/run-qa-store-legs-fixtures.ts` (new) · reap/rollup harnesses + fixture trees | T4 | retained must-FAIL per leg, selection varied | Low | verdict lines |
| `TECH-DEBT.md` · `docs/work/backlog/TASK-380-*.md` | T4 | TD-200…203; TD-203 handed to TASK-380 (owner) | Low | — |
| `scripts/lib/check-layers-completeness.ts` | T1 | member-layers-incomplete · member-layers-undeclared (R1) over member `## Done when` | High (Tier G) | 25 tests · diff 16/16 · seeds A/B · review CLEAR |
| `evals/layers-completeness*.ts` · runner floor 19→25 · 3 member fixture trees | T1 | member cases; differential excludes member-* by name (D1) | Low | runner verdict |
| `TECH-DEBT.md` | T1 | TD-199 from the outside review (census-zero) | Low | — |
| `scripts/lib/check-layers-observed.ts` | T2 | member-out-of-layers · member-layers-undeclared (R1) · members-derived atClose · `--no-members` for the oracle diff | High (Tier G) | 13 tests · diff 29/29 · seeds S1–S5 · review CLEAR |
| `evals/layers-observed.test.ts` (new) · `evals/run-layers-observed-fixtures.sh` · `…-differential.ts` | T2 | TS member cases wired into the runner; exclusion named | Low | runner verdict |
| `TECH-DEBT.md` | T2 | TD-196/197/198 from the outside review (census-zero) | Low | — |

## Retro

**Shipped** → `CHANGELOG.md` § SPRINT-110. All four members are in `done/`, with `## Done when` 8 of 8 (390: 2 · 391: 2 · 392: 2 ·
383: 2), derived by `sprint-members-cli.ts counts` → `dod 8 0`, `units 4 4`.
**System-verify:** default profile, detached: `QA-CHECK: 284 pass, 3 fail`, TRUNCATED at 529 s against the 520 s budget with 7
harnesses named as unrun.
- `qa-check-budget-exceeded` is the truncation itself (ADR-042). The 7 unrun harnesses, each run as its own call: night-run-outcome,
  foreign-repo, dispatch-preflight and conformance-engine all `all green` · store-readers `21 pass, 0 fail` · store-writers `29 pass,
  0 fail` · qa-store-legs `36 pass, 0 fail`.
- prose-density and layers-observed FAIL on `docs/epic/EPIC-016-…md`. That is another session's uncommitted edit (the workdoo
  SPRINT-008/009 rollup), confirmed by `git diff`, and not this sprint's (owner: record as foreign, close).
- No FAIL was introduced by a merge. D5's post-merge checks caught nothing, because nothing slipped (L-218 applied).

**Tech debt** → `TD-196`…`208` (filed at the four outside reviews and two owner rulings). **Follow-ups** → `TASK-393` (the TS
engine port after 2.0, filed mid-sprint, origin `manual`). **Learnings** → `L-219` · `L-220`.

**Retrieval check:** yes. R3 was recommended without reading ADR-043, which governs the very entry point it changed. It was caught while
briefing T3, before any build (L-220). L-218 and L-217 were both applied and held: every merge was followed by the cross-cutting checks,
and every Tier G review was one bounded round.

**Cost:** coordinator plus 5 recon agents (~92k · 132k · 56k and two smaller), 5 builder runs (T1 ~135k · T2 ~129k · T4 ~217k, one
aborted at 0 work · T3 ~336k across a stall and a resume) and 4 isolated reviews (~60k · 60k · 60k · 90k), about 1.4M sub-agent tokens
in all. Wall-clock went mostly to the gate (one default run, 529 s + 7 harnesses at ~6 min) and to T3's 8-minute harness.

**Worked**
- Recon before G2 refuted A1 and found two readers the hand-off missed (`S9.TWOFILES`, leg 2g), before anything was built.
- Threat model + stop rule + census for every review: 4 of 4 CLEAR in one round, 13 census-zero shapes sent to TD, not into rounds.
- The worktree-base guard caught a wrong-base dispatch before any work was done.
- Verifying a "failed" agent's disk state rather than its report saved T3's 539 lines (edit-safety (c)).

**Friction**
- The coordinator's `cd` into a worktree moved the session's checkout, and the next dispatch branched from it (L-219).
- R3 conflicted with ADR-043 and cost an extra ruling round (L-220).
- T3's builder sat silent in a multi-minute foreground harness until the watchdog killed it. It was resumed with "commit first,
  background the long runs".
- The default gate now truncates by design, so every close carries a manual follow-up run of the unrun harnesses.

**Pattern candidate** → `L-219` · `L-220` (count 1 each).
