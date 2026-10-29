---
sprint: 148
slug: rules-protocol-and-a-whole-gate
epic: EPIC-023
owner: Maintainer
last_updated: 2026-10-29
status: closed
plan_commit: a241c29e
gates_signed: G1,G2 @ 0c33d7ce
update_trigger: sprint execute/close events
---

# SPRINT-148 — Rules, Protocol and a Whole Gate

> **Theme:** EPIC-023's S0 moves from foundations to the parts the A/B depends on: the clinic repo gets its full rule set
> and a complete business spec, and the harness gets the unattended trial protocol with the D9 G2 exception. Beside
> them, the off-host gate stops skipping `bun test`. SPRINT-147's close had to run that stage by hand, and every later
> close would have to as well.

## Scope

**In:** the clinic repo's remaining rules (cancellation window, daily cap, patient record required) and its completed
spec, including the time-zone fact SPRINT-147 surfaced (T1, TASK-535) · the trial protocol: G1 pre-signed, G2 under the
D9 exception with file-scope and behaviour-scope checks, and the popup-park branch, exercised on the fixture repo only
(T2, TASK-542) · `gate-remote.ts` runs and judges both stages of the declared gate (T3, TASK-531, TD-279) · it reads the
last verdict line, closes its exit codes and warns on a dirty tree (T4, TASK-532, TD-268).
**Out (deferred):** TASK-536..541, 543..545 (blocked on T1 or later S0 work) · TASK-546 (ready, not chosen) · TASK-367,
402, 489, 498 (blocked) and TASK-507, 523 (`needs-info`).

## Members

- docs/work/todo/TASK-535-add-clinic-ab-remaining-rules-and-spec.md
- docs/work/todo/TASK-542-implement-ab-trial-protocol-with-d9-g2.md
- docs/work/todo/TASK-531-gate-remote-runs-the-declared-gate-s-bun-test-stage.md
- docs/work/todo/TASK-532-gate-remote-reads-the-last-verdict-and-closes-its-exit-codes.md

## Plan

### T1 — Add the clinic repo's remaining rules and complete its spec `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/work/todo/TASK-535-add-clinic-ab-remaining-rules-and-spec.md`
  · `docs/work/in_progress/TASK-535-add-clinic-ab-remaining-rules-and-spec.md`
  · `docs/work/done/TASK-535-add-clinic-ab-remaining-rules-and-spec.md`
Depends-on: none
Cites: `TASK-535` · EPIC-023 D3 · `lean-flow-3-foundation.md` (in `docs/research/`; D7) · `ab-clinic-builder-brief.md` (in `docs/research/logs/`)

The rule set and the spec are what the business-rule and lost-detail measures stand on. The app lives outside this repo,
so the in-repo footprint is the member file. The owner's realism review closes it, including where the clinic's working
hours live in time (the SPRINT-147 note on the task).

**Acceptance:** the clinic repo enforces at least five invariants end-to-end with tests, and the external spec records
goal, flows, invariants, quality attributes, non-goals and the facts not visible in code, signed off as realistic by the owner.

### T2 — Implement the unattended trial protocol with the D9 G2 exception `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `evals/ab/` · `docs/research/logs/ab-measurements.md`
  · `docs/work/todo/TASK-542-implement-ab-trial-protocol-with-d9-g2.md`
  · `docs/work/in_progress/TASK-542-implement-ab-trial-protocol-with-d9-g2.md`
  · `docs/work/done/TASK-542-implement-ab-trial-protocol-with-d9-g2.md`
Depends-on: none
Cites: `TASK-542` · EPIC-023 D4 · `lean-flow-3-foundation.md` (in `docs/research/`; D9) · `night-run.md` (Part 0, in the orchestrator skill's references)

A1+ trials run the lean-flow loop unattended, and G2's subject is produced inside the trial, so the eval-only exception
must be built and proven before any real trial. Fixture repo only (R-c). Maintainer-only harness code, never a gate leg.

**Acceptance:** on the fixture repo, a design outside `Layers:` and a design doing an out-of-scope behaviour each leave G2
unsigned and the trial not-passed, an in-scope control is signed, and a trial that raises a popup is parked and recorded.

### T3 — Make gate-remote run and judge the declared gate's bun test stage `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `scripts/gate-remote.ts` · `evals/gate-remote.test.ts` · `TECH-DEBT.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-531-gate-remote-runs-the-declared-gate-s-bun-test-stage.md`
  · `docs/work/in_progress/TASK-531-gate-remote-runs-the-declared-gate-s-bun-test-stage.md`
  · `docs/work/done/TASK-531-gate-remote-runs-the-declared-gate-s-bun-test-stage.md`
Depends-on: none
Cites: `TASK-531` · TD-279 · ADR-033 · `package.json`

The declared gate chains `qa-check.sh && bun test`, and the off-host verify runs only the first. A defect fix of an existing
maintainer tool, unfrozen under ADR-053.

**Acceptance:** one VPS run prints a verdict for both stages and exits 0 only when both pass; a failing `bun test` under a
passing qa-check exits non-zero.

### T4 — Make gate-remote read the last verdict, close its exit codes, and warn on a dirty tree `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `scripts/gate-remote.ts` · `scripts/qa-verdict.ts` · `evals/gate-remote.test.ts` · `evals/qa-verdict.test.ts`
  · `TECH-DEBT.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-532-gate-remote-reads-the-last-verdict-and-closes-its-exit-codes.md`
  · `docs/work/in_progress/TASK-532-gate-remote-reads-the-last-verdict-and-closes-its-exit-codes.md`
  · `docs/work/done/TASK-532-gate-remote-reads-the-last-verdict-and-closes-its-exit-codes.md`
Depends-on: T3
Cites: `TASK-532` · TD-268

Same tool as T3, so it follows T3 in the same tree. The exit-code set and the last-line rule close TD-268.

**Acceptance:** the verdict is the last `QA-CHECK:` line, every exit code is in the stated closed set, and a dirty tree
prints one warning while a clean tree prints none.

## Decisions (pre-locked)

- **D1** — `scripts/gate-remote.ts`, `evals/gate-remote.test.ts`, `TECH-DEBT.md` and `CHANGELOG.md` are shared by T3 and T4,
  owned in that order (T4 depends on T3), sequential in the main tree. T1 and T2 share nothing with each other or with
  T3/T4, so they may run in parallel. Status moves, Log and sprint-file edits commit as bare `sprint(148):` (L-238), and
  so does a tick on a member in a folder its `Layers:` does not name (L-258). A file a task turns out to need joins its
  `Layers:` by scope-change first (L-229).
- **D2** — T2, T3 and T4 are maintainer-only tooling, Other G (ADR-050): a retained must-FAIL fixture per check with a
  green control, one real run, coordinator self-review. T1 is X. No task edits a shipped skill. Any outside review
  runs under the owner's gauntlet rhythm: at most 2 rounds, the rest carried as G2 notes.
- **D3** — Nothing here is frozen under ADR-053: T2 extends the hand-run measurement harness, and T3/T4 are defect fixes of
  an existing tool. No new guard, ledger, field or `.sh`.
- **D4** — Before ticking, run every check that reads a touched file (L-251). At close, system verify runs both stages of the
  declared gate: once T3 lands it does so through `gate-remote.ts` itself, otherwise `bun test` runs by hand (TD-279).
  Prose in governed artifacts names files only when it means them (L-261).

## Assumptions

- **A1** — The clinic repo and its cluster still work from SPRINT-147's state (`D:\Research\clinic-ab\`, `.pgdata/` stopped).
  *Confirm: T1 build, first step.*
- **A2** — The VPS gate runner is reachable with the key route in the owner's memory. *Confirmed 2026-10-29 (three runs).*
- **A3** — The time zone the clinic's hours live in is an owner ruling, not a builder choice. *Confirm: T1 G2 popup.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-148-rules-protocol-and-a-whole-gate.md`](logs/SPRINT-148-rules-protocol-and-a-whole-gate.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/gate-remote.ts` | T3 · T4 | runs and judges both declared stages, each from its own log; the last verdict line counts; exits 0/1/2/5 only; warns on a dirty tree; each stage's command pinned to its declared text | Med | 90/0 across the two test files, full `bun test` 589/0; VPS 330/0 + 589/0 at `9c31e4e7` |
| `evals/gate-remote.test.ts` | T3 · T4 | stubbed-transport cases for every stage verdict, the stage-list pin and its mutations, the closed exit set, the dirty-tree warning | Low | runs in `bun test` |
| `scripts/qa-verdict.ts` · `evals/qa-verdict.test.ts` | T4 | `judgeOutput()` reads the LAST verdict line (TD-268), with two-order tests | Low | the caller grep found the three named callers only |
| `TECH-DEBT.md` | T3 · T4 · close | TD-279 and TD-268 resolved; TD-281 and TD-282 filed | Low | — |
| `CHANGELOG.md` | T3 · T4 · close | three [Unreleased] lines, maintainer-only | Low | — |
| `evals/ab/` (lib/protocol.ts · lib/ · run-trial.ts · selftest.ts · arms/smoke-a1.json · fixtures/) | T2 | the D9 two-phase trial protocol: G1 pre-signed, G2 by scope check + isolated judge, post-build breach diff, popup park, synced-plugin clear | Med | selftest 16/16 free (coordinator re-run); P5 judge refuse/sign; P6 re-run valid, parked |
| `docs/research/logs/ab-measurements.md` | T2 | smoke rows from P4 and the two P6 runs, tagged not a measurement (scope-change) | Low | appended by the harness |
| `docs/work/backlog/TASK-544-freeze-ab-pre-registration.md` | close | note: under `acceptEdits` a lean-flow arm parks on Bash, so the pre-registration fixes the permission mode | Low | — |
| `docs/LEARNINGS.md` · `docs/knowledge-index.md` | close | L-262 filed, L-261 to count 2; index regenerated | Low | merge-check 5/5 |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
**Outcome** — 4 of 4 members delivered (TASK-535, 542, 531, 532); 19 of 19 DoD boxes ticked, each re-verified by the coordinator
rather than taken from a builder's report. The clinic A/B repo enforces five invariants test-first, with a complete spec the owner
signed as realistic. The D9 trial protocol runs end to end on the fixture repo. The off-host gate now runs and judges both stages
of the declared gate, so this was the first close whose system verify ran `bun test` through the tool (TD-279, TD-268 resolved).
System verify: VPS 330/0 + 589/0 at `9c31e4e7`, exit 0.

**Retrieval check** — four misses of rules on record. (1) The consequence records were bulleted prose with out-of-vocabulary
tokens, so `check-review-depth` saw none of them. That repeats SPRINT-147's miss (L-261 → count 2). (2) Pre-locked D2 said
"coordinator self-review", but the dispatch classifier makes every task here `behaviour:material`. Writing the records
correctly exposed three owed reviews, which ran at close and found four real defects: the cap race, the router envelope, the
unpinned stage command, a mislabelled rc. (3) Builder briefs named the tests but not `tsc`, twice (L-262). (4) The VPS memory
still listed TD-224/225 as open host FAILs; they were resolved at SPRINT-115, and the memory was corrected.

**Cost** — coordinator plus sub-agents: four builder checks about 219k tokens; T1 builder about 140k, T2 about 172k, T3/T4 about
123k (each including its fix round); T2 review with re-review about 87k; close reviews about 66k (T3/T4) and 75k (T1). About 881k
sub-agent tokens in all. Paid smoke trials on haiku plus two sonnet judge calls cost cents under the subscription login. Five VPS gate
runs: one red on a builder's typecheck slip. The coordinator session is unmetered.

**Worked**
- Builder checks caught 9 contradictions in the T1 and T2 designs while they were still sentences; T4's came back with nothing important.
- The real P6 run found what no free check could: the CLI syncs account plugins into an isolated config between phases. The existing init
  check caught it, and the owner ruled a fix before any trial counts.
- Every scoped review found something, and each ran in a context that had not written the code: T2's signing inputs failed open
  twice, and the close reviews found the four defects above.

**Friction**
- Records written for the checker were read only by the author until close (L-261). Reading the checker before writing the Retro
  is what found them.
- Two builders committed type errors that their tests could not see (L-262). The VPS gate caught one, post-merge `merge-check` the other.
- A lean-flow arm under `acceptEdits` parks on any Bash call (TASK-544 note). The protocol worked; the arm's permission mode is undecided.

**Pattern candidate**
- L-262: a builder brief that touches `.ts` names `bunx tsc --noEmit` before commit.
- L-261 (count 2, due at the next promote): a line a checker greps at column 1 is a structured field, so write it in the checker's vocabulary or as plain words.
