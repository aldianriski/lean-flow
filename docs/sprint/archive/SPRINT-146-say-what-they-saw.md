---
sprint: 146
slug: say-what-they-saw
owner: Maintainer
last_updated: 2026-10-28
status: closed
gates_signed: G1,G2 @ bc4da31a
plan_commit: 623017fb
close_commit: cc021660
update_trigger: sprint execute/close events
---

# SPRINT-146 — Say What They Saw

> **Theme:** Three guards report more than they checked. The reaper can call a run exhausted while its own DoD line
> shows open boxes, the revise-ceiling check prints a bare PASS over a count that nothing mechanical writes, and the
> declared gate skips the whole TypeScript suite without a word when its first stage fails. This sprint makes each one
> report what it actually saw: one fixes the verdict, and two make a limit visible instead of silent.

## Scope

**In:** `reap()` names an open DoD box that no counted unit covers instead of ending a clean `PLAN_EXHAUSTED` (T1,
TD-201) · the revise-ceiling verdict states that its retry count is model-reported, and TD-152's detection limit resolves
as accepted (T2) · `qa-verdict.ts` says when the chained `bun test` stage will not run (T3, TD-155).
**Out (deferred):** TASK-527 (cancelled at intake: a promote-time guard is new machinery under ADR-053) · the Windows
gate-cost rows TD-090, TD-117, TD-171 (TASK-367, blocked) · the checker-accuracy rows TD-148, TD-153, TD-134, TD-061,
TD-081 · TASK-367, 402, 489, 498 (blocked) and TASK-507, 523 (`needs-info`).

## Members

- docs/work/todo/TASK-528-reap-names-an-uncovered-open-dod-box.md
- docs/work/todo/TASK-529-revise-ceiling-verdict-names-model-reported-retries.md
- docs/work/todo/TASK-530-qa-verdict-names-a-skipped-bun-test.md

## Plan

### T1 — Make reap() name an uncovered open DoD box `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `scripts/night-run.sh` · `evals/run-reap-terminal-fixtures.sh` · `CHANGELOG.md` · `TECH-DEBT.md`
  · `scripts/lib/sprint-members-cli.ts` · `skills/orchestrator/references/night-run.md`
  · `docs/work/todo/TASK-528-reap-names-an-uncovered-open-dod-box.md`
  · `docs/work/in_progress/TASK-528-reap-names-an-uncovered-open-dod-box.md`
  · `docs/work/done/TASK-528-reap-names-an-uncovered-open-dod-box.md`
Depends-on: none
Cites: `TASK-528` · TD-201 · TD-199 · ADR-016

The reaper builds its unattempted list from counted units only, so an open box on a member no `Tn` cites is invisible
and the run can end `PLAN_EXHAUSTED` (reproduced by SPRINT-110's outside review). Which of Part 0b's five terminal states the new
line maps to is decided at G2 (A1); no sixth state.

**Acceptance:** a log with an uncovered open member box never ends `PLAN_EXHAUSTED`, and every archived real run keeps
its recorded terminal state.

### T2 — Make the revise-ceiling verdict say its retry count is model-reported `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `scripts/night-run.sh` · `evals/run-revise-loop-ceiling-fixtures.sh` · `evals/fixtures/revise-loop-ceiling/`
  · `CHANGELOG.md` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-529-revise-ceiling-verdict-names-model-reported-retries.md`
  · `docs/work/in_progress/TASK-529-revise-ceiling-verdict-names-model-reported-retries.md`
  · `docs/work/done/TASK-529-revise-ceiling-verdict-names-model-reported-retries.md`
Depends-on: T1
Cites: `TASK-529` · TD-152 · ADR-022

A retry fires inside one model turn, so no mechanism can force it through a recorded door; the fix stops the verdict
claiming a check it cannot make, and the detection limit is accepted (owner ruling). Depends on T1 for the order of
`scripts/night-run.sh` (D1).

**Acceptance:** no bare `PASS … within ADR-022` line remains; the scoped line carries the right count on SPRINT-066,
SPRINT-067 and one archived log without retry lines.

### T3 — Make qa-verdict.ts say when the chained bun test will not run `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `scripts/qa-verdict.ts` · `evals/qa-verdict.test.ts` · `CHANGELOG.md` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-530-qa-verdict-names-a-skipped-bun-test.md`
  · `docs/work/in_progress/TASK-530-qa-verdict-names-a-skipped-bun-test.md`
  · `docs/work/done/TASK-530-qa-verdict-names-a-skipped-bun-test.md`
Depends-on: none
Cites: `TASK-530` · TD-155 · ADR-033 · `package.json`

The declared gate chains `qa-verdict.ts … && bun test`; a non-zero first stage skips every TypeScript test in silence.
The chain and its exit semantics stay as they are (no ADR-033 amendment); only the skip becomes visible.

**Acceptance:** a real truncated gate run prints the skip line and exits non-zero; a real passing run prints none.

## Decisions (pre-locked)

- **D1** — `scripts/night-run.sh` (T1, T2), `CHANGELOG.md` and `TECH-DEBT.md` (all three) are shared, owned in T order:
  execution is sequential in the main tree (T1 → T2 → T3). Status moves, Log and sprint-file edits commit as bare
  `sprint(146):` (L-238), and so does a tick on a member sitting in a folder its `Layers:` does not name (L-258). A file
  a task turns out to need (the rollup checker pair, `night-run.md`) joins its `Layers:` by scope-change first (L-229).
- **D2** — All three are maintainer-only guards (`night-run.md` line 15: the scripts it names are lean-flow's own;
  `qa-verdict.ts` is this repo's gate), so each takes the Other-G bar: a retained must-FAIL fixture with a green sibling
  control, one run on the real artifact, and coordinator self-review (ADR-050). A task that edits a shipped skill file
  (T1, if `night-run.md` changes) also takes the Codex review loop, cap 2 rounds.
- **D3** — All three are defect fixes of existing guards, unfrozen under ADR-053; none adds a guard, leg, ledger or
  field. Existing `.sh` files are edited in place; no new `.sh`.
- **D4** — Before ticking, run every check that reads the touched file, each as itself (L-251); the full `QA_FULL=1`
  gate runs on the VPS runner at close.

## Assumptions

- **A1** — An uncovered open box maps to one of the five existing terminal states; `HARD_FAILURE` is the likely fit,
  since `unattempted` → `BUDGET_STOP` misnames a Plan defect as a budget stop. *Confirm: T1 G2.*
- **A2** — No reader parses the revise-ceiling PASS line past its `PASS revise-loop-ceiling` prefix, so rewording its
  tail changes no tally. *Confirm: T2 G2, by a census of every reader.*
- **A3** — A small `QA_BUDGET_SECONDS` truncates a real gate run on this host, giving T3 its real-artifact case.
  *Confirm: T3 build.*
- **A4** — The archived logs hold at least one real night-run with a recorded terminal state for T1's real-artifact run.
  *Confirm: T1 G2, by census.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-146-say-what-they-saw.md`](logs/SPRINT-146-say-what-they-saw.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/night-run.sh` | T1 · T2 | reap() names an uncovered open member box and ends HARD_FAILURE instead of PLAN_EXHAUSTED; the revise-ceiling PASS states its count is model-reported | Med | reap-terminal and revise-loop harnesses, red then green |
| `scripts/lib/sprint-members-cli.ts` | T1 | new `uncovered` mode; `counts` output byte-identical (the conformance engine parses it) | Low | reap-terminal harness; Codex R1 item 3 |
| `skills/orchestrator/references/night-run.md` | T1 | the uncovered line in Part 4 and its cause in Part 0b's HARD_FAILURE row | Low | Codex R1 CLEAR |
| `evals/run-reap-terminal-fixtures.sh` | T1 | three must-FAIL cases and two controls | Low | red on the old code |
| `evals/run-revise-loop-ceiling-fixtures.sh` · `evals/fixtures/revise-loop-ceiling/` | T2 | four scoped-PASS cases, two fixture logs, README index | Low | red before the change |
| `scripts/qa-verdict.ts` | T3 | chain-aware notice naming the `&&` stage a non-zero exit skips | Low | qa-verdict tests 26/0; seeded removal |
| `evals/qa-verdict.test.ts` | T3 | nine notice tests; CLI spawns scrub the inherited lifecycle variable | Low | 0 stray notices with and without the variable |
| `TECH-DEBT.md` · `CHANGELOG.md` | T1 · T2 · T3 | TD-201 and TD-155 resolved, TD-152 accepted; three `[Unreleased]` bullets | Low | read-through |
| `.claude/CONTEXT.md` · `docs/LEARNINGS.md` | coordinator | L-258 placed in CONTEXT at promote, moved to LEARNINGS edit-safety at system verify (token budget) | Low | doc-caps token budget ~12688 of 12691 |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Outcome** — 3 of 3 members delivered (TASK-528, 529, 530); 18 of 18 DoD boxes ticked. System verify on the VPS gate
FAILed once on `7a4cfb2d` (token budget; T1's missing review line), both coordinator misses, fixed and passed 314/0 on
`834e237d` and again on the final tree `c01a64f5`. Each guard now reports what it saw: the reaper cannot call a run
exhausted over an open box, the retry ceiling says its count is model-reported, and a failed gate names the `bun test`
it skips. One intake task (TASK-527) was cancelled as new machinery under ADR-053.

**Retrieval check** — four misses, all of rules already on record. The intake Codex review ran after `approve`, against
the standing owner rule that it runs before. TASK-529's frozen box copied "the only two logs with retry lines" from a TD
row without a query; SPRINT-123 has them too (L-130). T3's ruling R3 read the running script from an environment variable
without asking who inherits it, and the tests' child processes did (edit-safety (d), L-067). The promote ran the cap check
before its own governance edit to an always-loaded file, the new L-260. L-251, L-257 and L-258's route-free rule were
applied and held.

**Cost** — coordinator inline (Opus). Sub-agents: Codex intake R1 and R2 (~17k, ~19k), three Sonnet builder checks
(~52k–55k each), three Sonnet builders (T1 ~114k, T2 ~98k, T3 ~71k), Codex T1 R1 (~23k). Gate: four VPS launches, one
stopped by low host memory before a verdict, one red, two green. Coordinator tokens were not measured.

**Worked**
- Recon before decomposition found two of the five chosen TD rows already fixed, and the Codex intake review then caught a
  freeze breach and three missing real-artifact runs before the Plan froze.
- The builder checks turned up a false notice under `bun run gate` and an unreachable population (SPRINT-088 is v1), both
  settled at G2 rather than after the build.
- The VPS `bun run test` run for T3's real artifact surfaced T3's own environment leak.

**Friction**
- System verify was red on two coordinator writes, not on any build.
- The off-host system verify never runs `bun test`; the TypeScript suite ran only because T3's box asked for it (TD-279).

**Buckets** — Shipped → CHANGELOG `[Unreleased]` (three lines). Tech debt → TD-279 (system verify off-host skips the
declared gate's `bun test` stage). Follow-ups → none. Learnings → L-260 (a promote-time edit lands after the scan that
measured its file).
