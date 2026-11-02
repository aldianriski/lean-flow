---
id: TASK-596
title: "The sprint checker reports LOG-REWRITTEN for an Execution Log that was only appended to"
type: bug
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: triage-bug
state: ready
depends-on: []
---

# TASK-596 — The sprint checker reports LOG-REWRITTEN for an Execution Log that was only appended to

## Symptom
`scripts/lib/check-sprint-by-reference.ts` reports `LOG-REWRITTEN` for a sprint Execution Log that was only appended to,
so a green sprint close turns red with a finding that names the wrong cause.

- **Severity:** medium
- **Blast radius:** the sprint freeze check, both in a sprint close and in `scripts/lib/conformance-engine.sh`, which
  spawns this checker. It fires only when a baseline read is needed (a Done-when change). A freeze-edit that a
  scope-change entry covers would still fail.
- **Reported:** 2026-11-01 by the maintainer (from the SPRINT-155 close)

## Repro
1. Check out commit `16f28eaa`.
2. Run `bun scripts/lib/check-sprint-by-reference.ts docs/sprint/SPRINT-155-consumer-docs-codex-built.md`.
3. It reports `LOG-REWRITTEN docs/sprint/logs/SPRINT-155-consumer-docs-codex-built.md`.
4. Compare `git diff 2ea2af75 16f28eaa -- docs/sprint/logs/SPRINT-155-consumer-docs-codex-built.md`: a pure append
   (109 lines added, 0 removed).

## Expected
No `LOG-REWRITTEN` for an append-only log.

## Actual
`LOG-REWRITTEN` for the SPRINT-155 log. The baseline text the checker compares against starts
`# SPRINT-154 — Execution Log`, which is another sprint's log. The remote gate at that close read `QA-CHECK: 352 pass, 2 fail`.

## Evidence
- `docs/work/evidence/TASK-596/sprint-155-close-gate-output.md`: the remote gate excerpt from the SPRINT-155 close
  (host redacted), the append-only diff, and `git log --follow` listing SPRINT-154's log path in the SPRINT-155 log's history.

## Root cause
The reporter's suspected cause is confirmed. The checker built its set of historical log paths from
`git log --follow`, and `--follow` reads a new log written from the shared template as a **copy** of a sibling
sprint's log. The SPRINT-155 log's add in `2ea2af75` (its own `plan_commit`) is reported as `C065` from
`docs/sprint/logs/SPRINT-154-a2-migrate-arm.md`, which was untouched and still present. Every commit older than that
belongs to SPRINT-154's log, so its path entered `logPaths`. At `2ea2af75` both logs are in the tree, and `fileAt`
returns the first known path in `ls-tree` order. SPRINT-154 sorts first, so the baseline was SPRINT-154's log, which is
not a prefix of SPRINT-155's, and the checker reported `LOG-REWRITTEN`. It also discarded every entry of the log,
including the scope-change that covers TASK-564.

Confirmed by a tagged probe at the baseline read: `path=docs/sprint/logs/SPRINT-154-a2-migrate-arm.md`, with the baseline
starting `# SPRINT-154 — Execution Log`. The SPRINT-155 log's own text at `2ea2af75` is a prefix of today's
(`own155prefix=true`), which falsifies "the log really changed". → `docs/work/evidence/TASK-596/diagnose-baseline-probe.md`

## Fix
`scripts/lib/check-sprint-by-reference.ts:310-324`, the `follow` helper. It now reads `--name-status` and stops the walk at
the first `C` (copy) entry, keeping that commit's destination path and dropping the older commits, which are the copy
source's history. A rename (`git mv`, archiving) shows as `R` and is still followed. The same helper builds the
sprint file's own history (`hist` → the PLAN-COMMIT-LATE signals), so a sprint file `--follow` read as a copy is also
no longer read through another sprint's commits.

## Regression test
`evals/run-by-reference-fixtures.ts`: helpers `PRIOR_LOG` / `followsPrior` and two cases in the TD-285 block. A prior
sprint's log (`docs/sprint/logs/SPRINT-900-prior.md`, derived from SPRINT-901's log) is committed before the promote, so
`--follow` reads SPRINT-901's log as its copy and the prior path sorts first in the `plan_commit` tree. Each case asserts
that selection before running, so it cannot pass vacuously.
- `log-copied-from-prior-sprint-logged-edit` (claim case): an append-only log with a scope-change covering a Done-when
  edit. Expected `[]`. The unfixed checker (blob `2dfeb365`) returns `[FREEZE-EDIT TASK-901, LOG-REWRITTEN]`, the
  reported symptom.
- `log-copied-from-prior-sprint-old-entry-reworded` (sibling control): the same history with a past entry really
  reworded. Expected `[FREEZE-EDIT TASK-901, LOG-REWRITTEN]` on both the old and the fixed checker.

Full run with the fix: `by-reference-fixtures: 166 pass, 0 fail`. Mutation: deleting the one `C` break line (landing
confirmed by `diff`, 618 → 617 lines, still parses) reddens only the claim case. The sibling and 7 rename/archive
controls stay green. The restore was proven by `git hash-object` (`dac0d0ea`). Still open for the consequential-G bar: a
worktree-isolated outside review (ADR-050).

## Prevention
- The failure class is **`git log --follow` taken as identity**. `--follow` is a similarity guess, and every sprint log and
  sprint file starts from the same template, so a "copy" from a sibling is the expected outcome, not a corner case.
  Any future `--follow` over templated docs should end the walk at a `C` the way `follow` now does.
- The latent sibling: `fileAt`'s first-known-path-in-tree pick would still choose wrongly if two paths in the set ever
  coexisted at one commit. With copies cut, the set holds only this file's own renames, which never coexist.
- Out of scope, noted for /triage: `FREEZE-EDIT TASK-563` on the same repro is a separate finding. Tick evidence that runs
  onto continuation lines changes the line count, which `sameDoneWhen` treats as an edit. TD-285 mentions this only as
  the trigger, and no TD row tracks it.

## Done when
- [x] On the repro at `16f28eaa`, the checker no longer reports `LOG-REWRITTEN` for the SPRINT-155 log. ✓ evidence § 4
- [x] A retained must-FAIL fixture: an append-only log whose `git log --follow` history also names another sprint's log
      produces no `LOG-REWRITTEN`, and a log that really was rewritten still does. ✓ evidence § 5
- [x] Root cause, fix, regression test and prevention are written into this item; TD-285 is closed against it. ✓ `TECH-DEBT.md` TD-285

## Touches
`scripts/lib/check-sprint-by-reference.ts` · `evals/fixtures/by-reference/` · `TECH-DEBT.md` (TD-285)

## Assumes
- **next:** /diagnose
- Suspected cause (the reporter's guess, not confirmed): `git log --follow` links two sprint logs that share the template
  header, and the baseline is read from the other sprint's path.
- Tier G, consequential: `conformance-engine.sh` executes this checker (ADR-050), so the fix takes the full bar.

## Tracker
TD-285 (`TECH-DEBT.md`) · bug report from the SPRINT-155 close, 2026-11-01
