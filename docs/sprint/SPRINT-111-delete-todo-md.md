---
sprint: 111
slug: delete-todo-md
epic: EPIC-017
owner: Maintainer
last_updated: 2026-09-30
status: active
update_trigger: sprint execute/close events
---

# SPRINT-111 — Delete TODO.md

> **Theme:** `EPIC-017`'s fifth member, aimed at **Closed-when 2**: `TODO.md` deleted, and no executable reading it.
> SPRINT-109 and SPRINT-110 moved six guards and the gate onto the store. This sprint proves `migrate` on a real copy (`TASK-370`),
> reconciles the eval inventory (`TASK-381`), retires every remaining `TODO.md` reader together with `S11.TODOCAP` (`TASK-394`),
> then migrates this repo's last 15 legacy tasks and deletes the file (`TASK-380`). After it, `371` waits only on `378` · `379` · `384`.

## Scope

**In:** `migrate` verified on a copy of this repo, including an interrupted run (`TASK-370`) · every eval harness the guard tasks
touched owns a v2 fixture that varies the selection (`TASK-381`) · zero non-test `TODO.md` readers, S11.TODOCAP retired with a spec
MINOR (`TASK-394`) · this repo migrated, `TODO.md` deleted, full gate green (`TASK-380`).

**Out (deferred):** `TASK-378` · `TASK-379` · `TASK-384` (the other inputs of `371`) · `TASK-393` (TS engine port, after 2.0) ·
`TD-206` (the prune's "live-named"; TASK-359/360/374 are held until it is ruled) · `TD-188` · `TD-196`…`208` except TD-203, which
`TASK-394` retires · any release (D3).

## Members

- docs/work/todo/TASK-370-migrate-v1-repo-onto-the-store.md
- docs/work/todo/TASK-381-reconcile-eval-inventory.md
- docs/work/todo/TASK-394-retire-every-todo-md-reader.md
- docs/work/todo/TASK-380-migrate-lean-flow-and-delete-todo.md

## Plan

### T1 — Prove migrate on a real copy, including an interrupted run `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `skills/lean-doc-generator/SKILL.md` · `skills/lean-doc-generator/references/migration-map.md` ·
  `evals/run-v1-to-v2-fixtures.ts` · `evals/fixtures/v1-to-v2/`
Depends-on: none
Cites: `TASK-370` · EPIC-017 D7 · D8 · ADR-046 · L-007 · L-016 · `TODO.md` (named in the member's Done when, not touched)

Tier X. `migrate` is the only 2.x path onto the store, and this sprint then runs it on this repo. Its SPRINT-106 proof left two boxes open: the
ticked-box count on a real copy (17 → 0 then, because of member conflicts), and the claim that an interrupted run re-runs to the same tree.

**Acceptance:** on a copy of this repo, the id sets are equal both ways and the ticked-box count is equal before and after (including
an active-sprint fixture), and a killed-then-resumed run produces the same tree as an uninterrupted one, retained as a fixture.

### T2 — Reconcile the eval inventory against the guard tasks `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `evals/assert-boundary-park.sh` · `evals/assert-noaction-park.sh` · `evals/assert-park-revisit.sh` ·
  `evals/selftest-assert-boundary-park.sh` · `evals/selftest-assert-judgement-retry.sh` · `evals/selftest-assert-noaction-park.sh` ·
  `evals/selftest-assert-park-revisit.sh` · `evals/night-run-rollup.test.ts` · `evals/run-night-run-rollup-fixtures.sh` ·
  `evals/run-night-run-rollup-differential-parity.ts` · `evals/run-foreign-repo-fixtures.sh` · `evals/run-s2-placement-fixtures.sh` ·
  `evals/run-sprint-family-fixtures.sh` · `evals/run-sprint-family-spec-reduction-fixtures.ts`
Depends-on: none
Cites: `TASK-381` · Codex r1 F3 · L-186 · L-198

Tier G. The guard retargets (382 · 387 · 390 · 391 · 383 · 392) each owned their own harnesses. This inventory proves no harness
that reads the v1 shape fell between them. It must be derived by two selectors, because one selector agrees with itself (L-198).

**Acceptance:** a two-selector inventory of `evals/` exists and every file is owned by a guard task or retargeted here, and each
retargeted harness has a v2 fixture that varies the selection.

### T3 — Retire or retarget every TODO.md reader, and retire S11.TODOCAP `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/qa-check.sh` · `scripts/lib/conformance-engine.sh` · `scripts/lib/check-layers-completeness.sh` ·
  `scripts/lib/check-layers-observed.sh` · `scripts/lib/check-layers-observed.ts` · `scripts/lib/check-prose-density.ts` ·
  `scripts/lib/check-task-origin.sh` · `scripts/lib/prose-density-baseline.txt` · `spec/STANDARD.md` · `spec/CHANGELOG.md` ·
  `evals/run-qa-store-legs-fixtures.ts` · `evals/run-sprint-family-fixtures.sh` · `evals/run-conformance-engine-fixtures.sh`
Depends-on: T1 · T2 (shared `evals/run-sprint-family-fixtures.sh` with T2; TASK-394's `depends-on`)
Cites: `TASK-394` · TD-203 · SPRINT-110 R2 · ADR-043 · ADR-049 · `TODO.md` (named, not touched)

Tier G. Closed-when 2 is measured by the absence of readers, not by the file's absence. So the census comes first, and it uses
two selectors: a literal `TODO.md` match and the concepts that stand for it (Backlog, the Active Sprint pointer). Each hit is then a
reader to retarget or retire, a test, or allowlisted text (`migrate`'s procedure, a bare existence check, v1-refusal text).

**Acceptance:** zero non-test readers by two selectors, S11.TODOCAP retired with the spec saying so (a MINOR), legs 3/5/8 and
leg 7's TD-aging half dispositioned, and an isolated outside review CLEAR.

### T4 — Migrate this repo onto the store and delete TODO.md `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `TODO.md` · `docs/work/backlog/` · `TECH-DEBT.md`
Depends-on: T1 · T3 (TASK-380's `depends-on`)
Cites: `TASK-380` · EPIC-017 Closed-when 2 · ADR-046 · D8

Tier G. The 15 legacy tasks still in `TODO.md` (including TASK-345/348/357, which own four `high` debt rows) move through `migrate`
itself. That is the tool's second real input after T1's copy. Then the file goes. `TECH-DEBT.md` is in Layers because its owner
pointers to those three tasks must still resolve.

**Acceptance:** `TODO.md` is gone, every legacy task is a store file with its id, the owner pointers still resolve, and the full
gate is green, read from its own verdict line.

## Decisions (pre-locked)
- **D1** — `TASK-380` was split at this promote into `380` (migrate + delete) and `TASK-394` (readers + S11.TODOCAP), because it was
  size L at pull time (owner, 2026-09-30).
- **D2** — No new `.sh` file; executable logic is TypeScript on Bun (owner rule 2026-09-09). ADR-049 governs any runtime question.
- **D3** — No release at close (repo mixed until T4, then v2-only, still running installed 1.66.x skills); `[Unreleased]` holds 2.0.
- **D4** — After each merge the coordinator runs the fast cross-cutting legs on `main` (L-218), and inspects worktrees only by
  `git -C` (L-219). Before recommending anything that changes what an adopter runs, it reads that entry point's ADR (L-220).
- **D5** — `TASK-359/360/374` stay until `TD-206` is ruled (owner, SPRINT-110 close).

## Assumptions
- **A1** — The 15 legacy tasks in `TODO.md` migrate without owner-resolved conflicts. *Confirm: T1's dry run on a copy, then T4's plan
  step (migrate is plan → approve → apply).*
- **A2** — Retiring S11.TODOCAP is a spec MINOR (0.12.0 → 0.13.0), not a MAJOR: it removes a rule for a layout 0.12.0 already retired.
  *Confirm: T3 recon against spec/CHANGELOG.md's versioning note, at G2.*
- **A3** — No `skills/` file is a real TODO.md reader. The 14 skill hits are refusal text, `migrate`'s procedure, or templates for v1
  adopters. *Confirm: T3 recon. A real reader is a scope-change adding it to T3's Layers.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-111-delete-todo-md.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
