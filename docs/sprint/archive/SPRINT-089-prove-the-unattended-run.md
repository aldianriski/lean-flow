---
sprint: 089
slug: prove-the-unattended-run
epic: EPIC-015
owner: Maintainer
last_updated: 2026-08-27
status: closed
gates_signed: G1,G2 @ db656ff
plan_commit: 5f0682b
close_commit: cc46d18
update_trigger: sprint execute/close events
---

# SPRINT-089 — Prove the Unattended Run

> **Theme:** SPRINT-088 built the whole autonomy apparatus — authority classes, the continuation
> contract, the canonical mode name, the approval envelope — and **proved none of it end to end**.
> This sprint closes that gap, and it does so in the only order that works: the gate must be able to
> finish before a run that runs the gate can be trusted to finish. Make it possible, then prove it.

## Scope

**In:** the gate's dominant cost brought back inside its own budget, measured on a clean process table
**and** under load · a Plan an unattended run is *permitted* to execute, seeded with one AFK/J1 task
and one J2 that must park · one real headless run against it, supplying the evidence SPRINT-088's
three carried DoD require. Targets EPIC-015 § Closed-when **1, 3, 4**.

**Out (deferred):** the six-defect gate-accuracy cluster (`TASK-300` — a routing decision, better
taken in `/triage` than mid-sprint) · bounded unattended repair (`TASK-296`) · typed run outcomes
(`TASK-297`, still gated on the EPIC-008 `RunSummary` ruling) · `TD-106`/`TD-107`, which stopped
appearing in the gate only because SPRINT-087 was archived and are **not** fixed · re-opening anything
SPRINT-088 shipped: the machinery is not in question here, only whether it works unwatched.

## Plan

### T1 — Cut the gate's dominant cost so a close stops tripping its own budget `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/qa-check.sh` (leg 12) · `evals/` harnesses · `docs/research/logs/qa-gate-timing.md` · `scripts/lib/conformance-engine.sh` (declared mid-task — the profile found the dominant cost inside the engine, not inside a harness; L-100) · `TECH-DEBT.md` (DoD 5 restates TD-090's re-raise condition, so the ledger is this task's own output, not governance drive-by) · `docs/LEARNINGS.md` (L-175 is T1's own finding, captured per /insights rather than deferred to close)
Depends-on: none
Cites: TASK-302 · TD-090 · TD-084 · SPRINT-086 T2 · EPIC-015 § Closed-when 1

TD-090 has been `severity: high` since Sprint-084 and was re-raised the same day it was lowered, by
its own written re-raise condition. It comes first because **a run cannot be proven while the gate it
runs cannot finish**: SPRINT-088 observed 450s → 510s → 634s against a 450s budget, tripping
`qa-check-budget-exceeded` on three of four runs, and an overnight run's own system-verify would hit
the same wall. **Profile before fixing** — TD-084's instruction, which has now held twice.

**Acceptance:** a default `qa-check.sh` run completes inside the 450s budget with no
`qa-check-budget-exceeded` FAIL and **no harness skipped**, on a clean process table and under load.

**DoD:**
- [x] The dominant term is **measured before anything is changed**, and recorded as a new Round in `docs/research/logs/qa-gate-timing.md` — *Verify: the Round names the term and its share; a fix chosen before the measurement is TD-084's named anti-move*
- [x] A default run completes **inside 450s with zero harnesses skipped** — *Verify: `scripts/qa-check.sh` prints its own verdict line with no `qa-check-budget-exceeded` FAIL; read the printed verdict, never a piped status (L-120)*
- [x] The same holds **under load**, not only on an idle host — *Verify: TD-090's own re-raise condition is load-dependent, so an idle-only measurement cannot clear it*
- [x] **No coverage was traded for time** — *Verify: harness inventory compared name-by-name against the pre-change list, equal count and equal names (SPRINT-086 T2's method: 50 fixture names, zero removed)*
- [x] TD-090's re-raise condition is **cleared or restated against the new figure** — *Verify: a debt row whose trigger still references a superseded number is a guard that cannot fire*

### T2 — Seed a Plan an unattended run may execute, and run it once for real `[size: M · risk: high · class: execution · HITL · J1]`
Layers: a seeded Plan (shape ruled at G2) · `docs/sprint/logs/` · `scripts/night-run.sh` (only if the exercise finds a defect) · `scripts/lib/check-night-run-rollup.sh` (read, not edited — the rollup verdict is checked with it) · no guard code — SPRINT-088 shipped it all · `.claude/settings.json` (declared mid-task — Part 1 pre-flight derives the allowlist from four sources and requires it written into settings, so capability scoping is this task's work; L-100) · `TECH-DEBT.md` (TD-109, the pre-flight contradiction this task's DoD 5 surfaced) · `docs/LEARNINGS.md` (L-176 — the append-only-vs-machine-field finding this task's pre-flight produced; L-100) · `docs/knowledge-index.md` (regenerated interactively — clearing the gate is what TD-110 blocks the run from doing)
Depends-on: T1
Cites: TASK-301 · EPIC-015 § Closed-when 1 · 3 · 4 · D5 · L-111 · L-007 · TASK-188 · T4 (SPRINT-088's T4, whose DoD 3 this closes — not a task of this sprint)

The evidence SPRINT-088 could not produce, because its own Plan was entirely `HITL` and Part 1
pre-flight forbids a run against one. **The vehicle's shape is a G2 decision, deliberately not frozen
here** — a throwaway fixture Plan and making this sprint's own tasks the vehicle are both live, and
freezing the choice at promote would foreclose the design pass that should make it (L-111, the exact
trap this task exists to escape).

**Acceptance:** one real headless run produces, in artifacts rather than assertion: a J1 task executed
unattended inside the recorded envelope with no confirmation, and a **seeded** J2 that parked with its
unblock condition recorded.

**DoD:**
- [x] A **J1 task executes unattended inside the approved envelope with no confirmation** — *Verify: exercised on a real run, not asserted (L-007); closes SPRINT-088 T1 DoD 2*
- [x] A **seeded J2 parks**, recording its unblock condition — *Verify: the seed is required, not a fallback (D5); closes SPRINT-088 T1 DoD 3*
- [x] The run **consumes** the `approval_envelope:` and re-confirms no J0/J1 mid-flight — *Verify: writing an envelope is not consuming one; closes SPRINT-088 T4 DoD 3*
- [x] The run's rollup names a **terminal state that matches its per-task lines** — *Verify: `scripts/lib/check-night-run-rollup.sh` plus a read of the state against the lines; SPRINT-088 shipped a rollup claiming `PLAN_EXHAUSTED` over three `blocked` tasks and the shape check alone did not catch it*
- [x] Every DoD above is checked against **the Plan's own task classes before the run is fired** — *Verify: Part 1 pre-flight item 3; this is the check whose absence made three of SPRINT-088's criteria unreachable at freeze*

## Owner-action checklist
- [x] Sign the batch **G1 + G2** for T1–T2 before execution begins, and record it as `gates_signed: G1,G2 @ <sha>` in this file's frontmatter. **The field is absent until then, and its absence means NOT signed** — an unattended run reads this file and nothing else (L-099).
- [x] Before T2 fires anything, record the `approval_envelope:` covering all ten dimensions. Absence is not approval, and the shipped template's placeholder counts as absent. **Recorded on `SPRINT-090` (`… @ e1e3141`), which is the Plan that actually fired** — an envelope authorises a *run*, and SPRINT-089 was never run unattended, so its own frontmatter correctly has none (`check-approval-envelope.sh` reports it as a `note`, not a FAIL).

## Decisions (pre-locked)
- **D1** — **T1 before T2, and the dependency is real rather than thematic.** A run whose own
  system-verify reds on budget cannot cleanly evidence "the run completed"; the proof would be
  contaminated by a failure that has nothing to do with autonomy.
- **D2** — **The proof vehicle is ruled at G2, not at promote.** Both candidate shapes (a throwaway
  fixture Plan; this sprint's own tasks declared AFK/J1 where they honestly are) stay open until the
  design pass. Freezing it here would repeat L-111 in the sprint written to escape it.
- **D3** — **`HITL` declarations are never relaxed to make a run fire.** If no honest AFK task exists,
  the vehicle is a seeded Plan — re-declaring real work AFK to satisfy pre-flight is reshaping a task
  to dodge a gate, which is itself scope-changing.
- **D4** — **Every task here is ADR-029 Tier G** where it touches guard code or the gate, and T1 is
  squarely that. A false negative in the gate's own budget or coverage is silent by construction.

## Assumptions
- **A1** — The gate's dominant term is still leg 12 (eval harnesses), last measured at ~81% of a 492s
  run. *Confirm: T1's own Round, measured before any change — the assumption is explicitly not
  inherited, since three harnesses were added since that figure and SPRINT-086 T2 already moved it
  once (196.1s → 143.2s).*
- **A2** — Every mechanism T2 exercises already exists and is fixture-guarded; nothing new needs
  building for the proof. *Confirm: SPRINT-088's five harnesses (49 assertions) run green at T2's
  start; if one does not, that is a T2 finding before the run, not after.*
- **A3** — A headless run on this host can complete a Plan of this size within its budget once T1
  lands. *Confirm: T1's under-load measurement is the same evidence — if T1 cannot clear the budget,
  T2's vehicle must shrink rather than the budget being raised to fit.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-089-prove-the-unattended-run.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here
> (STANDARD §9 · ADR-014). Every entry carries its `consequence · Tn · behaviour:… · governance:…`
> line — a task whose consequence is unrecorded is invisible to `check-review-depth.sh`.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/research/logs/qa-gate-timing.md` | T1 | Round 8 — profile before fixing; found the gate's cost host-dependent, not cured | low | append-only, +171/−0 |
| `scripts/lib/conformance-engine.sh` | T1 | Memoise the git probe, 6 spawns → 1 per invocation; `_SEEN` flag closes the empty-key landmine an independent review found | **Tier G** | `run-git-availability-fixtures.sh` (15 assertions), both-direction seeded discrimination |
| `evals/run-git-availability-fixtures.sh` | T1 | NEW — guards the engine's git-availability branch, which had zero discriminating coverage in either direction | **Tier G** | self; seeds redden in disjoint sets, controls green |
| `scripts/qa-check.sh` | T1 | Wire the new guard always-on (30 → 31), with the cheap-and-git-free exception reasoned at the list | low | gate run `195 pass, 0 fail` |
| `TECH-DEBT.md` | T1 · T2 | TD-090 restated host-normalized; TD-095 split on measurement; TD-109/110/111 filed from pre-flight and the run | low | arithmetic reproducible from a named anchor |
| `docs/sprint/SPRINT-090-*.md` + log | T2 | NEW — the seeded run vehicle: one AFK/J1 executed, one J2 parked | med | one real headless run, `AUTHORITY_BOUNDARY` |
| `.claude/settings.json` | T2 | Scope the run's capabilities — exact-file check rules + PowerShell set | low | 66 rules, parsed not eyeballed |
| `docs/LEARNINGS.md` | T1 · T2 | L-175 (host-dependent criteria) · L-176 (append-only vs machine fields) | low | tag vocab checked |
| `docs/knowledge-index.md` | T2 | Regenerated to clear the gate TD-110 blocks the run from clearing | low | `gen-index.sh --check` |

## Retro

**Theme of the sprint: the machinery was proven, and proving it took five attempts to reach the
starting line.** T1's headline cut missed its target and is recorded as missing it. T2's run happened,
and every claim about it was verified against artifacts rather than the run's own report. What the
sprint actually bought is the map of everything standing between a promoted Plan and an executed one.

**Shipped** → `CHANGELOG.md` v1.61.0 (MINOR, by hand — feature sprint, `/release-patch` is PATCH-only).

**What went right**
- **The first real unattended run.** A `J1` executed with no confirmation, a **seeded** `J2` parked with
  its unblock condition, the envelope was consumed, and the run's own rollup named
  `AUTHORITY_BOUNDARY` correctly. EPIC-015 § Closed-when **3 and 4** complete.
- **The run handled a defect nobody designed for.** It hit a red system-verify caused by midnight index
  staleness and **parked its close** rather than repairing — exactly as `repair-policy: none` and D3
  require. The contract held on a case outside its authors' imagination.
- **A Tier G coverage hole closed.** The engine's git-availability branch — twelve gating assertions —
  had *zero* discriminating coverage in either direction. Two seeded breaks reddened nothing. It now
  has 15 assertions that redden in disjoint sets with controls green.
- **Round 8 caught a false conclusion before it was drawn**: a 288s gate run reads as "TD-090 cured",
  but the host was 1.92–2.20× faster than the reference on byte-identical code. Ticking it would have
  cleared a load-dependent debt on a fast afternoon.

**What went wrong, and it is the same shape every time**
- **Five foreclosures of one acceptance**, in five different layers, none found by reading the
  procedure (→ **L-179**). The author read Part 1's checklist item by item, concluded no green-gate
  precondition existed, said so — and `night-run.sh:339` enforces one.
- **Four premature or mis-scoped machine-readable fields**, each caught by a different guard and none
  by the author (→ **L-177**). A schema has no tense, so a plan's claim about a task reads as testimony
  that it happened.
- **A checker passed a false rollup** because it asserts shape and never agreement (→ **L-178**), one
  sprint after [[L-174]] recorded that exact property of that exact checker.
- **An independent reviewer found the author's own reasoning defect**: D4's justification overclaimed
  2 of 3 mechanisms, and the counter-argument (`AFK-safe` and `J2` defined as opposites) was never
  weighed. The owner had already ruled on the overstated version.

**The honest ledger.** Of every defect found this sprint, **not one was caught by recalling a rule that
governed it** — every single one came from a guard firing, a disagreeing second number, or an
independent pass. Rules that were loaded, correct, and on screen: L-045, L-088, L-108 (twice), L-120,
L-151, L-166, L-174. That is now the fourth consecutive sprint reporting this, and it is the strongest
available argument for the guard-and-reviewer discipline over the read-the-rules one.

**Tech debt** → **TD-109** (pre-flight vs a declared J2) · **TD-110** (the launcher's green-gate
catch-22) · **TD-111** (midnight index staleness) · **TD-112** (the reaper's false rollup, passed by its
checker). All `high`. TD-090 restated host-normalized; TD-095 split on measurement.

**Follow-ups** → `TASK-303` · `TASK-304` · `TASK-305` · `TASK-306`, all `origin: close-retro`.

**Learnings** → **L-175** (a wall-clock criterion measures the host) · **L-176** (append-only binds the
prose, not the machine fields) · **L-177** (a schema has no tense) · **L-178** (presence is not
agreement) · **L-179** (some capabilities can only be estimated by attempting them).
