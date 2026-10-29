---
sprint: 147
slug: first-trial-first-slice
epic: EPIC-023
owner: Maintainer
last_updated: 2026-10-29
status: closed
close_commit: 751df00d
gates_signed: G1,G2 @ 309860a7
plan_commit: 7691cdc3
update_trigger: sprint execute/close events
---

# SPRINT-147 — First Trial, First Slice

> **Theme:** EPIC-023's S0 baseline stands on two things nothing else can start without: a harness that can run one
> pinned, isolated trial and measure it, and a second real repo on a different stack. This sprint builds both. The
> tracer goes first because it settles the biggest unknown, whether a headless trial reports its own token cost.

## Scope

**In:** the A/B harness tracer on a fixture repo, with pinned and verified plugin and models, access and config
isolation proven by leak-detecting controls, and graded, costed run records (T1, TASK-533) · the clinic repo's booking
slice (Vue 3 + Vite + Go chi + PostgreSQL), with two tested invariants and at least three non-standard conventions
recorded in an external spec (T2, TASK-534).
**Out (deferred):** TASK-535..545 (blocked on these two) · TASK-546 (L-217 re-placement, ready, owner ruled it a
separate task) · TASK-531, 532 (gate-remote, ready, not chosen) · TASK-367, 402, 489, 498 (blocked) and TASK-507, 523
(`needs-info`).

## Members

- docs/work/todo/TASK-533-run-one-pinned-isolated-measured-ab-trial.md
- docs/work/todo/TASK-534-build-clinic-ab-booking-slice.md

## Plan

### T1 — Run one pinned, isolated, measured A/B trial on a fixture repo `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `evals/ab/` · `docs/research/logs/ab-measurements.md` · `evals/run-emitter-column-fixtures.ts`
  · `docs/work/todo/TASK-533-run-one-pinned-isolated-measured-ab-trial.md`
  · `docs/work/in_progress/TASK-533-run-one-pinned-isolated-measured-ab-trial.md`
  · `docs/work/done/TASK-533-run-one-pinned-isolated-measured-ab-trial.md`
Depends-on: none
Cites: `TASK-533` · EPIC-023 · `docs/research/lean-flow-3-foundation.md` §7 · ADR-050 · ADR-053

Every later S0 task stands on a trial that can be pinned, isolated, graded and costed. The fixture repo keeps the A/B
repos untouched until the pre-registration freezes (R-c). TypeScript on Bun; no new `.sh`.

**Acceptance:** one command runs a smoke trial on a fixture-repo copy and appends a graded, costed run record, and
each refusing check (plugin pin, access, config, graders) has a must-FAIL fixture beside a passing control.

### T2 — Build the clinic A/B repo's booking slice `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `docs/research/logs/ab-clinic-builder-brief.md`
  · `docs/work/todo/TASK-534-build-clinic-ab-booking-slice.md`
  · `docs/work/in_progress/TASK-534-build-clinic-ab-booking-slice.md`
  · `docs/work/done/TASK-534-build-clinic-ab-booking-slice.md`
Depends-on: none
Cites: `TASK-534` · EPIC-023 D3 · `lean-flow-3-foundation.md` (in `docs/research/`; D7, and its §4 is what the brief excludes) · intake I-1

The A/B needs a second stack with real business rules. The app lives outside this repo (`D:\Research\clinic-ab\`, spec
in `D:\Research\clinic-ab-spec\`); the only in-repo file is the retained builder brief, which shows it excluded 3.0
material.

**Acceptance:** a clean checkout of the clinic repo books an appointment end-to-end, its tests enforce no double
booking and per-doctor working hours, and the external spec names at least three conventions with where each shows.

## Decisions (pre-locked)

- **D1** — T1 and T2 share no file, so they may run in parallel. Status moves, Log and sprint-file edits commit as
  bare `sprint(147):` (L-238), and so does a tick on a member in a folder its `Layers:` does not name (L-258). A file a
  task turns out to need joins its `Layers:` by scope-change first (L-229).
- **D2** — T1 is maintainer-only tooling, Other G (ADR-050): a retained must-FAIL fixture per refusing check with a
  green control, one real run, coordinator self-review. T2 is X. Neither edits a shipped skill. Any outside review runs
  under the owner's gauntlet rhythm: at most 2 rounds, the rest carried as G2 notes.
- **D3** — Neither task is frozen under ADR-053: the harness is measurement run by hand, never a gate or `qa-check.sh`
  leg, and adds no guard, ledger or field to the governance surface.
- **D4** — Before ticking, run every check that reads a touched file (L-251); the full `QA_FULL=1` gate runs on the VPS
  runner at close.

## Assumptions

- **A1** — `claude -p … --output-format stream-json` reports token usage per run. *Confirm: T1 build; if not, T1 stops
  for an owner ruling (D5 depends on it).*
- **A2** — Trials authenticate through a credentials-only entry in the isolated config. *Confirm: owner names the paying
  account (subscription or API key) at T1 G1.*
- **A3** — Toolchain present: Go 1.26.4 · PostgreSQL 18.3 · Docker 29.7 · Bun 1.3.14 · Node 22. *Confirmed 2026-10-29.*
- **A4** — `D:\Research\clinic-ab\` and `D:\Research\clinic-ab-spec\` do not exist yet. *Confirmed 2026-10-29.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-147-first-trial-first-slice.md`](logs/SPRINT-147-first-trial-first-slice.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `evals/ab/` (run-trial.ts · selftest.ts · lib/ · arms/ · fixtures/) | T1 | the A/B harness tracer: pinned, isolated, graded, costed trials; self-tests run by hand, never in the gate | Med | selftest 7/7 free, 11/11 paid, re-run by the coordinator; 8 harness mutations each reddened their check |
| `docs/research/logs/ab-measurements.md` | T1 | the A/B measurement log; smoke rows only, tagged not a measurement | Low | rows from P4 runs |
| `evals/run-emitter-column-fixtures.ts` | T1 | one out-of-scope rule for `evals/ab/` (scope-change) | Low | 9/0; a probe file outside `evals/ab/` still reddens the population leg |
| `docs/research/logs/ab-clinic-builder-brief.md` | T2 | the clinic builder brief, retained verbatim as evidence that the build saw no 3.0 material | Low | 0 hits on the excluded tokens; committed before dispatch (`1320bb88`) |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
**Outcome** — 2 of 2 members delivered (TASK-533, 534); 11 of 11 DoD boxes ticked, each re-verified by the coordinator
rather than taken from a builder's report. EPIC-023's S0 now has its two foundations: a harness that runs one pinned,
isolated, graded and costed trial (self-tests 7/7 free, 11/11 paid, about $0.004 a smoke trial on haiku), and a second
real repo on another stack (Vue 3 + Go chi + PostgreSQL) whose booking path works end-to-end with both invariants
red-before-green. System verify: the VPS gate was red once on three coordinator misses, then 327/0 on `95cd0746`; `bun test`
563/0 locally, because the VPS route does not run it (TD-279).

**Retrieval check** — three misses, all of rules on record. A `consequence` line carried trailing prose, though the
vocabulary is fixed (`check-review-depth.sh`). Tick evidence and a scope-change entry used file- and directory-shaped tokens
that the layers checkers parse: L-108's family, on the author's side (L-261). Closing on the VPS verdict alone would have
skipped `bun test`; TD-279 was read in time, at close.

**Cost** — coordinator plus 4 sub-agents in the sprint: T1 builder about 156k tokens, T2 builder about 94k, two builder
checks about 53k and 54k (about 357k sub-agent tokens in all). Paid smoke trials about $0.03 on haiku under the subscription
login. Pre-sprint intake (Codex rounds, research) is outside this figure. The coordinator session is unmetered.

**Worked**
- G2 probes before the design was signed. Three cheap headless calls showed that the owner's own config runs in `auto` and
  lets outside reads through, that an isolated config loads nothing of the user's, and that `result` carries usage. Each fact
  changed the design before any code. The product's launcher already refuses any mode but `dontAsk`.
- Builder checks caught 11 contradictions across the two designs (a pin that hashed only tracked files, an unpaired leak
  probe, a page leg with no automated test) while they were still sentences.
- Not trusting the reports. The T2 re-run reproduced every claim and added the manual page booking, which surfaced the time
  zone gap.

**Friction**
- System verify red on three of my own text tokens (L-261), and a promote-check FAIL on a bare-name `Cites:` (TD-280).
- The local full gate cannot finish inside 1200 s on this host, so every complete verdict needs the VPS, and the VPS
  verdict needs a separate `bun test` (TD-279, TASK-531 in the backlog).

**Pattern candidate**
- L-261: prose that a guard parses is a structured field, so a path-shaped token in it is a claim the guard will check.

