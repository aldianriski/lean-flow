---
sprint: 177
slug: spec-fix-and-detached-preflight
owner: Maintainer
last_updated: 2026-11-15
status: closed
plan_commit: 0ba7c901fea805fdfa09f72ad897eadac49c219e
gates_signed: G1,G2 @ 54ebcdb5
update_trigger: sprint execute/close events
---

# SPRINT-177 — Fix TASK-367's Spec, Then Let the Caller Declare Detachment

> **Theme:** TASK-367's launcher fix is owner-ruled (2026-11-14), but its Touches and Done-when still carry dead paths and a question that is already closed. Wave 1 fixes the spec. Wave 2 builds the `--detached` flag, so a complete pre-flight gate runs only when the caller has declared detachment.

## Scope

**In:** TASK-665 (fix TASK-367's stale text) · TASK-367 (the `--detached` launcher flag, its fixtures and docs).
**Out (deferred):** the cost side of the gate (TD-090, TD-117, TD-171) · EPIC-025 Sprint B (workdoo) · the v2.24.0 push (owner action).

## Members

- docs/work/todo/TASK-665-fix-task-367-stale-touches-and-done-when-before-promotion.md
- docs/work/todo/TASK-367-let-the-caller-declare-detachment-so-the-pre-flight-gate-can-run-complete.md

## Plan

### T1 — Fix TASK-367's stale Touches, Done-when, state note, Tracker and depends-on `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/work/todo/TASK-367-let-the-caller-declare-detachment-so-the-pre-flight-gate-can-run-complete.md`
Depends-on: none
Cites: TASK-665, `evals/run-night-run-gate-exception-fixtures.sh` (deleted, named only as the dead path) · `evals/run-night-run-rollup-fixtures.sh` · `evals/night-run-rollup.test.ts`, `docs/adr/ADR-042-the-command-ceiling-is-a-foreground-limit.md`, `docs/work/done/TASK-661-run-single-family-conformance-cases-on-a-reduced-spec.md`
Tier P. TASK-367's Done-when is frozen at `plan_commit`. Its edits (box (a), box (d), the `:589` reference) are made only after a `scope-change` Log entry naming TASK-367 and T1 (what broke, impact, re-confirm G2 for the wave-2 task), committed before or with the first Done-when edit. The wave-2 task does not build until its G2 is signed on the fixed text.

**Acceptance:** TASK-367 names only existing paths and the `--detached` flag, and `check-sprint-by-reference.ts --scope-change` reports TASK-367 covered by the scope-change entry.

### T2 — Add the `--detached` launcher flag so the pre-flight gate can run complete `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/night-run.sh` · `scripts/qa-check.sh` · `evals/night-run-detached.test.ts` · `skills/orchestrator/references/night-run.md` · `CHANGELOG.md`
Depends-on: T1
Cites: TASK-367, `docs/adr/ADR-042-the-command-ceiling-is-a-foreground-limit.md`, `docs/adr/ADR-050-proof-bar-scales-with-consequence.md`, `docs/research/logs/qa-gate-timing.md`
Tier G, other-G bar (D2). The member's `class: decision` is advisory (ADR-010): the decision is ruled, so the Plan runs it as execution. The raise is set inline on the one pre-flight gate call, never exported. Prune unused Layers tokens at G2 (L-240).

**Acceptance:** a `--detached` launch runs the gate with both limits raised, a launch without it does not and refuses by name, and both arms of the `[ -f scripts/qa-check.sh ]` test are exercised.

## Decisions (pre-locked)

- **D1** — Owner ruling 2026-11-15, verbatim "Promote now (Recommended)": promote in parallel with workdoo Sprint B (EPIC-025 D9, frozen 2.23.0 worktree). Verbatim "Both, in order (Recommended)": wave 1 T1, wave 2 T2, one sprint.
- **D2** — Owner ruling 2026-11-15, verbatim "Claude builds, Codex reviews (Recommended)": a Sonnet worker builds, Codex reviews at most 2 rounds. Verbatim "Other G (Recommended)": T2 takes the other-G bar (ADR-050): a must-FAIL fixture, one real detached run, no mutation campaign, no mandatory isolated review. The census ruled the launcher maintainer-only. T2 stays size M.
- **D3** — No new `.sh` (owner ruling 2026-09-09). T2's fixtures are a Bun TypeScript test, `evals/night-run-detached.test.ts`; `night-run.sh` is edited in place.
- **D4** — Net-zero rule: T2 adds nothing to `.claude/CONTEXT.md` or `.claude/CLAUDE.md` (150 of 150 lines; token budget 12683 of 12691). If a cap check fails mid-build, stop and ask.
- **D5** — T1 alone edits TASK-367's spec text; T2 only ticks boxes. Coordinator writes (Log, status moves) commit as bare `sprint(177):`; tasks commit as `sprint(177) Tn: …`.
- **D6** — Owner ruling 2026-11-15, verbatim "T2's G2 after T1 lands (Recommended)": G1 is signed for both; G2 for T1 first; T2's G2 on the fixed Done-when after T1 is committed. `gates_signed` is recorded only once both G2s are signed.

## Assumptions

- **A1** — Only the Done-when body is frozen; Touches, Why, Assumes, Tracker and frontmatter edits need no entry. *Confirm: T1's run of `check-sprint-by-reference.ts`.*
- **A2** — A bun test can drive `night-run.sh` against a stub repo whose stub `qa-check.sh` echoes its received environment. *Confirm: T2's first red test.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-177-spec-fix-and-detached-preflight.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/work/done/TASK-367-let-the-caller-declare-detachment-so-the-pre-flight-gate-can-run-complete.md` | T1 | Dead paths, the stale line reference, box (a) and box (d) fixed under a logged scope-change, so the build ran on a spec naming only live paths and the ruled flag. | Low | `check-sprint-by-reference.ts --scope-change` 4 pass, 0 fail; `test -e` on every Touches path; Codex R2 CLEAR |
| `docs/work/done/TASK-665-fix-task-367-stale-touches-and-done-when-before-promotion.md` | T1 | Done-when ticked with evidence. | Low | same as above |
| `scripts/night-run.sh` | T2 | New `--detached` flag raises both gate limits inline on the one pre-flight call, never exported. The undeclared arm is bounded through the real `timeout` and refuses by name; a truncated or exit-124 gate is refused on both arms ahead of any `gate_exceptions:` grant. | High | `evals/night-run-detached.test.ts` 17/0; seed proofs; one real detached run; Codex R1 and R2, owner-settled |
| `scripts/qa-check.sh` | T2 | Two messages name the `--detached` flag. | Low | `night-run-detached.test.ts`; QA-CHECK 233/0 off-host |
| `evals/night-run-detached.test.ts` | T2 | New Bun test, 17 cases: both arms of the `qa-check.sh` test, the refusal by name, both guards, the lookup-only knob. Portable to Linux. | High | 17 pass, 0 fail; off-host `bun test` 638/0 |
| `skills/orchestrator/references/night-run.md` | T2 | Part 2 says the caller declares detachment; it does not claim a harness-background run counts. | Low | wiring read; `check-doc-caps.ts` 0 FAIL |
| `CHANGELOG.md` | T2 | `[Unreleased]` entry for the flag. | Low | read against the diff |

## Retro

**Verdict.** TASK-665 and TASK-367 are done, every box ticked. `night-run.sh` now takes `--detached`: the caller declares detachment and the pre-flight gate runs with both limits raised to 1800 s, set inline and never exported. An undeclared slow gate refuses by name instead of being killed. System verify, off-host `QA_FULL=1` on `65e98125`: `QA-CHECK: 233 pass, 0 fail`, `bun test` 638 pass, 0 fail (621 plus the 17 new cases, so the test is portable to Linux). T2's review closed owner-settled, not CLEAR.

**Delivery.** Claude Sonnet workers built both, serially (W1 T1, W2 T2 under `/tdd`). Codex reviewed: T1 R1 NOT CLEAR (1 Med, a loosened frozen criterion), R2 CLEAR; T2 R1 NOT CLEAR (3 High, 1 Med, all fixed in the one retry), R2 raised one new High, and the owner settled it and one follow-on finding by popup. T2 took the other-G bar (D2): a must-FAIL fixture, seed proofs, one real run. No release is cut here: a feature change to a maintainer-only script plus a shipped `night-run.md` paragraph rides the next release, v2.24.0, prepared and unpushed.

**Cost.** Coordinator plus 2 Sonnet builders and 4 Codex review rounds; no token or dollar figure is recorded in the Log, so unavailable. By commit count, `plan_commit^` to HEAD before this close: 8 commits, 2 task work (`sprint(177) Tn:`) and 6 coordinator bookkeeping (`sprint(177):`), for 2 members.

**Retrieval check.** Yes, once. L-237 (a G2 design that paraphrases a frozen Done-when can loosen it, and the builder follows it) and L-088 (do not reinterpret a frozen DoD) both applied to T1's G2 settlement, which exempted a new path from "only paths that exist". Codex caught it before commit. L-237 bumped to count 3.

**Worked**
- The G2 builder-check settled 5 contradictions and 7 questions before either build; the three value questions went to the owner as one popup.
- Codex caught what the author could not: the loosened criterion in T1, and in T2 an unbounded no-timeout host, a skipped wait check and a detached exit 124 that bypassed the guard.
- Neutering each guard in turn reddened exactly its own cases while the sibling stayed green.
- The real detached run finished with a verdict, no kill and no stray gate processes.
- D4 held: nothing was added to CONTEXT or CLAUDE.md.

**Friction**
- T2's first no-timeout fixture was Windows-only (a Git-for-Windows `/usr/bin`, `pwd -W`, a `;` PATH) and would have failed the Linux gate; the review caught it before commit.
- A test-only knob first controlled execution, so a wrapper could skip the bound; it became `NIGHT_RUN_TIMEOUT_LOOKUP`, lookup-only.
- The real exercise did not show completion past the old 520 s budget, because the gate finished in about 490 s. The fixtures cover the timeout path only.
- The seed proofs ran on earlier hashes, before the lookup-only knob change; that change touched only the timeout lookup.

**Pattern candidate** (surface to user, `docs/LEARNINGS.md`)
- L-237 now has three sightings (count 3), the first where the loosening came from a G2 settlement of a Done-when rather than a design paragraph. Already promoted to `builder-check.md`; its scope holds.

**Routing** (filed above, STANDARD §10)
- Shipped: CHANGELOG [Unreleased] already carries T2's entry (read against the diff); T1 edits a task file only, so no entry.
- Tech debt: none new. Gate completion past the old budget is the measurement TD-090 and TD-117 already own (their route named TASK-367's re-measure); a one-line note on TD-117 records that TASK-367 landed without that evidence. TD-171 is conformance-fixture cost, a different cost. TD-315 (8 tokens of headroom) is unchanged.
- Follow-ups: none. No real one exists beyond TD-117's measurement.
- Learnings: L-320 new (a test-only seam must not widen what production runs), L-321 new (a fixture must run on every host the gate runs on). Bumped: L-237 to count 3.
- Handoff reconciliation: no `handoff` entry in the log, so nothing to make `spent`. No `epic:` on this sprint, so no rollup.
