---
sprint: 043
slug: proof-run
owner: Maintainer
last_updated: 2026-08-01
status: active
plan_commit: 96d93ea
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-043 — Proof Run

> **Theme:** SPRINT-042 fixed the landing path that stranded SPRINT-041's night run, and could not
> test it — the sprint that ships the fix cannot be the sprint that proves it. This sprint is the
> proof. Its two tasks are chosen to be genuinely disjoint so the run must fan out, dispatch into
> worktrees, and land both units through the merge-back queue: the exact sequence that failed before.
> The work itself closes the last two open debts; the *run* is the deliverable.

## Scope

**In:** an **observed** third source for the declaration cross-check — actual changed files vs declared
`Layers:`, the one source that cannot be forgotten (T1) · atomic write for the generated index, so a
failed generation leaves the previous file intact rather than a plausible truncated one (T2) · and
executing both **unattended**, as the end-to-end proof that a night run can now finish (TASK-134).

**Out (deferred):** **TD-014** (night-run.md length) — its trigger is a third embedded snippet and
neither task adds one; re-review already scheduled for SPRINT-044 · a **6–8h sizing standard** — this
run produces calibration row two, and two rows is still not a series · any change to what the
allowlist *derivation* says: this sprint **tests** SPRINT-042 T1's rule, it does not revise it, because
revising the thing under test would forfeit the experiment.

## Plan

### T1 — Add an observed third source to the declaration cross-check `[size: M · risk: low · class: execution · AFK]`
Layers: `scripts/qa-check.sh` · `scripts/lib/check-layers-observed.sh` · `docs/QA.md` · `evals/run-layers-observed-fixtures.sh`
Depends-on: none

TD-022 · L-074. SPRINT-042 gave `Layers:` a second source — files named in each task's DoD prose — and
it was defeated the day it shipped, because both sources are predictions written by one author at one
moment. Two documents written by one person at one time are one source in two places. The escape is an
**observation**: compare what actually changed against what was declared. Unlike the first two it
cannot be forgotten, because it reads history rather than intent.

**Acceptance:** against a fixture reproducing SPRINT-042's own miss — a file created during
implementation and never declared — the gate FAILs naming that file; against a sprint whose declaration
matches its real diff, it passes.

**DoD:**
- [ ] The gate compares the changed-file set for an active sprint against the union of its tasks'
      declared `Layers:`, reporting any file changed but undeclared
- [ ] The comparison base is the sprint's recorded plan commit, so "changed this sprint" needs no
      second source of truth
- [ ] Coordinator close-bookkeeping files are excluded **with a stated reason**, never silently — a
      silent exclusion list is how the observed source drifts back toward being an authored one
- [ ] Leg follows the existing text-lint idiom (`ok`/`bad` helpers, named finding, never a bare FAIL)
- [ ] **Negative-tested per check**, each failing with its own named finding, using SPRINT-042's real
      recorded miss as the must-FAIL fixture. Run bare, never piped (L-057)
- [ ] Fixtures **retained** in the eval set (L-058)
- [ ] `docs/QA.md` leg inventory updated
<!-- QA: this IS a gate — the must-FAIL fixtures are the bar, not optional (CLAUDE.md). -->

### T2 — Make the generated index survive a failed write `[size: S · risk: low · class: execution · AFK]`
Layers: `scripts/gen-index.sh`
Depends-on: none

TD-021. A disk-full failure during SPRINT-041's close truncated the generated index from 34 lines to
12 and left a **syntactically valid file** — nothing was wrong, there was simply less of it. The gate
caught it as "index STALE", which was the right alarm for the wrong reason and only fired because the
truncation happened to also break staleness parity. Write to a temporary file in the same directory
and move it into place, so a failed generation cannot publish a partial result at all.

**Acceptance:** a generation interrupted mid-write leaves the previous index byte-identical; a normal
run still regenerates it correctly.

**DoD:**
- [ ] Generation writes to a temporary file in the same directory, then moves it into place
- [ ] **Failure path exercised on real input**: simulate a mid-write failure and confirm the previous
      file survives byte-identical — proving the normal path still works is not the test
- [ ] A normal run still produces an index identical to what it produced before the change
- [ ] If same-directory rename is not atomic on the target filesystem, that limit is **stated** rather
      than claimed away

## Owner-action checklist
<!-- Non-dev actions a human must do. These gate the unattended run; none is a dev task. -->
- [ ] **Reinstall the plugin so the installed version reaches 1.24.0** — pre-flight's skill-freshness
      check BLOCKs today (installed 1.23.0 ≠ repo 1.24.0), and it is right to: a night run executes the
      *installed* skill, so firing now would run SPRINT-042's fix-free procedure against a repo that
      has it. This is the one item that makes the whole proof meaningless if skipped.
- [ ] **Push the plan-locked commit before firing** — agent worktrees fork from the remote default
      branch, so an unpushed plan commit leaves them on a stale base (dispatch.md's declared-base rule).
- [ ] **Build the allowlist per night-run.md Part 1's four sources** — including source 2, the
      merge-back path. This is the artefact under test; deriving it from the old single-source habit
      would test nothing.
- [ ] **Fire the trigger** with the explicit `unattended` signal.

## Decisions (pre-locked)

- **D1** — **`TECH-DEBT.md` is coordinator-owned at close; no task declares or edits it.** Each task
  would naturally mark its own `TD-NNN`, which makes the ledger a shared file and forces the two tasks
  sequential. Since the point of this sprint is to exercise *parallel* dispatch and the merge-back
  queue, the marking moves to close instead. L-071 applied at planning time rather than discovered at
  merge time.
- **D2** — **This sprint runs unattended**, and the cost is accepted deliberately. Fan-out on two small
  tasks is exactly the trade L-073 warns against; the justification is not efficiency but that
  SPRINT-042 T1 is currently an **untested claim**, and only a real run can falsify it.
- **D3** — The sprint file is **coordinator-owned**. Agents never edit it, which keeps the one
  genuinely shared artefact out of the worktree merge entirely.
- **D4** — A denial during this run is a **result, not a failure of the sprint**. It is recorded against
  which of the four allowlist sources failed to derive the command, because that is the finding the
  experiment exists to produce.

## Assumptions

- **A1** — The installed plugin matches the repo manifest at trigger time. *Confirm: pre-flight's
  skill-freshness check, which currently BLOCKs and must read PASS before firing.*
- **A2** — The plan commit is pushed, so worktree agents fork from a base containing this Plan.
  *Confirm: pre-flight base-ref check against live HEAD.*
- **A3** — T1 and T2 share no file, so the dispatch preflight computes both at rank 0 and the run fans
  out. *Confirm: pre-dispatch preflight reports two rank-0 tasks and no shared-file finding.*

## Execution Log

<!-- Append-only, dated. The Plan is frozen at promote — log here rather than editing § Plan. -->

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->
