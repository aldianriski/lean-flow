---
id: TASK-484
title: "the host's merge-back check runs a fixed set of cross-cutting legs, and the coordinator ticks there"
sprint: SPRINT-138
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-483]
---

# TASK-484 — the host's merge-back check runs a fixed set of cross-cutting legs, and the coordinator ticks there

## Why
ADR-053 admitted on a **repeated workflow failure** (L-218 ×3 · L-224 ×9 · L-238 ×2). System verify was red at close in at least
5 of the last 8 sprints, each time on a leg no per-task check ran, and the prose rule in `dispatch.md` reached none of them.
SPRINT-137 also left merged, reviewed work unticked across a session boundary. It is a wrapper around existing checkers only, with
no new check, gate leg or ledger. Tier G (other) for lean-flow's command; the shipped `dispatch.md` change takes the Codex review
loop. It follows TASK-483's `dispatch.md` integration. Review cap 2.
Consumer: an adopter gets the procedure. Run the host's documented merge-back check, or the discovered gate (§ System verify's
discovery order) when none is documented, and tick at acceptance. lean-flow's command is only the example.

## Done when
- [x] lean-flow's command runs typecheck · prose-density · layers-completeness · layers-observed · scope-change over the active ✓ `3ccfa36f` + `f7a642be`: `bun scripts/merge-check.ts` runs the five legs with the gate's own checkers and arguments (scope-change on active sprints only), prints each result, exits non-zero on any FAIL or not-runnable leg; on main at f7a642be: 5 green · 0 skipped · 0 failed
      sprint(s), dispatching the same checkers with the same arguments the gate uses. It prints each one's result and exits non-zero
      on any FAIL or on any leg it could not run (a missing tool FAILs, never skips).
- [x] One table-driven test makes each dispatched leg fail in turn and checks that the named failure propagates, plus an ✓ evals/merge-check.test.ts 24/0: one table-driven case per leg failing in turn, an unavailable-leg case, a green control, SKIP-only and exit-0-with-FAIL cases; one Leg table feeds the code and the per-block comparison against qa-check.sh; removing any argument reddened the suite (mutation check, file restored)
      unavailable-leg case and a green control. The checker/argument wiring is compared against the gate's own invocation, not
      re-tested per checker.
- [x] Local cost (wall-clock and peak memory, at least 3 runs) is recorded before `dispatch.md` names the command. ✓ measured before dispatch.md named it on main (log entry `8129d71d`): 3 runs 17.5–23.0 s, exit 0; peak about 185 MB (wrapper about 60 + typecheck about 124), checker legs 64–81 MB, at 0.46–1.23 GB free
- [x] `dispatch.md`: the post-merge line requires the host's documented merge-back check and its agreed fixed set (replacing "never ✓ `1efdd16e` + `f7a642be`: the post-merge line requires the host's documented merge-back check (fixed set agreed by the host maintainer, recorded in its docs), falling back to the discovered gate (repo-wide over unit-only); rule 5 ticks at merge-back acceptance in the same session; lean-flow only as the example. Codex round 2 CLEAR
      a hand-picked subset"), falling back to the discovered gate when the host documents none. Rule 5 (Tick) says verified boxes are
      ticked at merge-back acceptance, in the same session. lean-flow's command and five legs appear only as the example.
- [ ] Used at every merge-back from its availability through the validation sprint's close, observed at least once (logged). A
      cross-cutting FAIL that system verify finds in one of the five legs on the same revision is investigated, and any wrapper
      defect fixed, before this task is accepted.
- [x] Consumer path: applied read-only to workdoo, which documents no merge-back check, the wording resolves to its discovered gate. ✓ workdoo (read-only) documents no merge-back check, so the wording falls to the discovered gate, and "repo-wide over unit-only" picks its `verify` script over `test` (bun test)
- [ ] README and CHANGELOG describe the merge-back and tick change.

## Touches
a new `scripts/` TypeScript command · its test · `skills/orchestrator/references/dispatch.md` · README · CHANGELOG

## Assumes
- The fixed set is the five legs that reddened a merge or a close, each sighted at least twice: typecheck (SPRINT-109 · 137),
  prose-density (124 · 125 · 135), layers-completeness (125 · 132), layers-observed (131 · 133), scope-change (127 · 137).
  knowledge-index and doc-caps stay out (no such evidence). Out of scope: changing `qa-check.sh`.
- The in-worktree typecheck question (TASK-483) bears on local cost; an unrunnable leg FAILs by name rather than skipping.
- Shipped wording is host-generic; workdoo is read, never written.

## Tracker
- L-218 · L-224 · L-238 · owner selection 2026-10-24 (candidate A, plus tick-at-acceptance); intake draft reviewed by Codex
  2026-10-24 (APPROVE WITH FIXES, folded in)
