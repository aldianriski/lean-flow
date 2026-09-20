---
sprint: 103
slug: port-the-measured-hotspots
owner: Maintainer
last_updated: 2026-09-20
status: active
plan_commit: bfa3fec
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-103 — Port the Measured Hotspots

> **Theme:** SPRINT-102 proved the technique and aimed it wrong. Five checkers were ported, reviewed
> and wired; those harnesses fell from ~170 s to **17 s** and the gate did not visibly move, because
> they were ~10% of it and host variance is ±20%. The targets came from **TD-090's harness timings** —
> the only data anyone had — and Round 16's profile, the first of a *completed* gate, shows not one of
> them in the top 20. This sprint spends the measurement instead of a model: the five items that are
> **63% of the gate**. Its first act per task is to re-measure, because inheriting Round 16's table
> unexamined would repeat the exact mistake it exists to correct.

## Scope

**In:** the five measured hotspots — `run-sprint-family-fixtures.sh` (305 s) ·
`run-layers-observed-fixtures.sh` (153 s) · leg 2f-ter's conformance sweep (139 s) ·
`run-conformance-engine-fixtures.sh` (98 s) · `run-qa-budget-position-fixtures.sh` (66 s). Each is
**measured first and ruled**, then ported only if its cost is spawn-shaped.

**Out (deferred):** anything below rank 5 in Round 16 · re-porting the five checkers SPRINT-102
already shipped (they are 17 s; there is nothing left there) · `doc-caps`' 28 `ls` spawns (~2.8 s,
TASK-355 follow-up — real but now provably noise) · TD-167's flaky fixture (filed, not fixed here) ·
changing WHAT the gate checks, in any form.

## Plan

### T1 — Rule and port `run-sprint-family-fixtures.sh` `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `evals/run-sprint-family-fixtures.sh` · the checker(s) it invokes (named after T1's own measurement, per L-100) · `scripts/qa-check.sh` (leg wiring, applied from a committed diff) · `docs/research/logs/qa-gate-timing.md` (the per-target Round)
Depends-on: none
Cites: Round 16 · TD-090 · L-144

**305 s — 25% of the entire gate, the largest single item by a factor of two.**

**Measure before building.** Round 16 attributes the seconds; it does not say *why*. Profile this
harness specifically: how many checker invocations, how much is `sys`, and is the cost spawn-shaped
at all? A target whose time is real work rather than `fork()` emulation is **ruled unportable and
recorded as such** — that is a successful task, not a failed one.

**Acceptance:** either (a) the harness is ported, byte-identical parity proven against its retained
oracle, and its leg wired; or (b) a recorded ruling naming the mechanism and why porting does not
reach it. Not "attempted".

**DoD:**
- [ ] Per-target measurement recorded in `qa-gate-timing.md` — invocation count, `sys` share, the mechanism — *Verify: the Round names the figures and how they were derived*
- [ ] Ruling: spawn-shaped (port) or not (record + stop), taken **on the measurement**, not on Round 16's rank
- [ ] If ported: `.sh` retained as live oracle; byte-identical differential parity over every fixture **and** the real corpus it applies to — *Verify: the differential reports N/N identical, N stated*
- [ ] If ported: retained must-FAIL + sibling control + seeded-break proof under ONE stated hash convention
- [ ] If ported: wiring diff **committed as a reviewable file before being applied** (three reviewers in SPRINT-102 could not audit wiring that lived only in chat — L-151)
- [ ] Outside reviewer dispatched worktree-isolated (ADR-029 ii · L-165 · L-168)
- [ ] Before/after stated as a **range over ≥3 alternating runs**, never a point estimate — this host shows >3× run-to-run variance

### T2 — Rule and port `run-layers-observed-fixtures.sh` `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `evals/run-layers-observed-fixtures.sh` · `scripts/lib/check-layers-observed.sh` (retained as oracle) · a new `scripts/lib/check-layers-observed.ts` · `scripts/qa-check.sh` (leg 15) · `docs/research/logs/qa-gate-timing.md`
Depends-on: none
Cites: Round 16 · SPRINT-102's `layers-completeness` port (the pattern, not the file)

**153 s.** Note carefully: this is `check-layers-observed`, a **different checker** from the
`check-layers-completeness` SPRINT-102 spent a day porting. The near-identical names are why the
wrong one was chosen; the shipped port is not reusable here beyond its shape.

**Acceptance:** same two-branch form as T1 — ported with parity proven, or ruled unportable with the
mechanism recorded.

**DoD:**
- [ ] Per-target measurement recorded before any code is written
- [ ] The two checkers' names are disambiguated wherever both appear, so the next reader cannot repeat the substitution — *Verify: `layers-observed` vs `layers-completeness` are distinguished in the Round and in the port's header*
- [ ] If ported: oracle retained · byte-identical parity over fixtures **and** all real sprint Plans, **including non-archived copies** — the archived corpus is SKIPPED by the sibling checker and comparing it yields two empty outputs that agree while proving nothing (L-198, hit twice in SPRINT-102)
- [ ] If ported: retained must-FAIL + sibling control + seeded break, one hash convention
- [ ] If ported: wiring diff committed before applied
- [ ] Outside reviewer, worktree-isolated
- [ ] Before/after as a range over ≥3 runs

### T3 — Rule leg 2f-ter, the conformance engine sweep `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `scripts/qa-check.sh` (leg 2f-ter) · `scripts/lib/conformance-engine.sh` (**consumer-facing per ADR-027 — read-only unless the ruling requires otherwise**) · `docs/research/logs/qa-gate-timing.md` · an ADR if the ruling is hard-to-reverse
Depends-on: none
Cites: ADR-027 · Round 16

**139 s, and the riskiest of the five.** `conformance-engine.sh` is **consumer-facing** — ADR-027
amended ADR-008 to make it answer for *any* repository through the root `conformance.sh`, and its
exit code is a documented contract an adopter may gate CI on. A port here is not an internal
refactor; it is a change to a shipped interface, and L-015's consumer check binds.

**`J2` and `class: decision` on purpose:** the likely outcome is a ruling about *whether* this is
portable at all, not a port. Deciding that is human-reserved.

**Acceptance:** a recorded ruling on whether leg 2f-ter's cost can be reduced without touching the
consumer-facing surface, with the mechanism measured. A port is permitted only if the ruling says so.

**DoD:**
- [ ] The sweep's cost mechanism measured and recorded — is it spawns, corpus size, or real work?
- [ ] Consumer-facing blast radius stated explicitly: what an adopter of `conformance.sh` would observe, if anything (L-015)
- [ ] Ruling recorded **where its reader reaches it** — the engine's own header or an ADR, never only the ledger (L-151)
- [ ] If the ruling is hard-to-reverse **and** surprising **and** a real trade-off → ADR (§4's three-part bar), else explicitly not

### T4 — Rule and port `run-conformance-engine-fixtures.sh` `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `evals/run-conformance-engine-fixtures.sh` · `docs/research/logs/qa-gate-timing.md` · `scripts/qa-check.sh` only if a leg change follows
Depends-on: T3 (its ruling bounds what may be touched on the engine side)
Cites: ADR-027 · Round 16

**98 s.** Distinct from T3: this is the fixture harness, not the gate leg. It may be portable even if
T3 rules the engine itself untouchable — the harness can batch or move in-process without the engine's
interface changing.

**Acceptance:** ported with parity proven, or ruled unportable with the mechanism recorded.

**DoD:**
- [ ] Per-target measurement recorded before any code is written
- [ ] T3's ruling read and respected — state in one line what it permits here
- [ ] If ported: oracle retained · byte-identical parity · retained must-FAIL + sibling control + seeded break, one hash convention
- [ ] If ported: wiring diff committed before applied
- [ ] Outside reviewer, worktree-isolated
- [ ] Before/after as a range over ≥3 runs

### T5 — Rule and port `run-qa-budget-position-fixtures.sh` `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `evals/run-qa-budget-position-fixtures.sh` · `docs/research/logs/qa-gate-timing.md`
Depends-on: none
Cites: Round 16 · TD-167

**66 s.** The smallest of the five and the one most likely to be cheap. Its sibling
`run-qa-budget-fixtures.sh` carries **TD-167**, a timing race that reddens under load — **do not fix
TD-167 here** (it is out of scope), but if this harness shares the wall-clock-derived-input shape,
say so in the Round so TD-167's fix direction is informed by a second sighting.

**Acceptance:** ported with parity proven, or ruled unportable with the mechanism recorded.

**DoD:**
- [ ] Per-target measurement recorded before any code is written
- [ ] Checked for TD-167's shape (an assertion whose input is a clock) and the finding recorded either way
- [ ] If ported: oracle retained · byte-identical parity · retained must-FAIL + sibling control + seeded break, one hash convention
- [ ] If ported: wiring diff committed before applied
- [ ] Outside reviewer, worktree-isolated
- [ ] Before/after as a range over ≥3 runs

## Owner-action checklist

- [ ] Rule T3 if it asks — the consumer-facing engine is the one place in this sprint where a wrong call reaches adopters

## Decisions (pre-locked)

- **D1** — **No `epic:` frontmatter.** Gate performance work, contributing to no EPIC-015 § Closed-when condition. Same precedent as SPRINT-099 and SPRINT-102.
- **D2** — **Measure-then-rule is the task shape, not a preamble.** Every task's first DoD is a per-target measurement, and "ruled unportable, mechanism recorded" is an ACCEPTED outcome. This is the direct correction of SPRINT-102, which inherited TD-090's ranking and spent a day on five checkers that were not in the top 20. A sprint that returns five measurements and two ports has succeeded.
- **D3** — **`scripts/qa-check.sh` is coordinator-owned.** Four tasks may need a leg wired, and it is the one file they share. No task edits it; each commits a wiring diff as a reviewable file and the coordinator applies them in merge order. SPRINT-102 established this and it is why that wave's four parallel worktrees merged with zero conflicts.
- **D4** — **Tiers (ADR-029): every task is Tier G.** These are guards; a false negative is silent by construction. Full bar per port — retained must-FAIL, sibling control, seeded break under one stated hash convention, and a worktree-isolated outside reviewer. T3 is additionally `class: decision`.
- **D5** — **The oracle stays.** Every ported checker keeps its `.sh` as a live parity reference. Deleting one removes the only instrument that can catch a port diverging — and in SPRINT-102 that instrument found six defects no fixture reached, including a silent false negative in a shipped oracle.
- **D6** — **No coverage change.** Speed only. Checking fewer files, sampling, mocking integration tests, or raising budgets in place of reducing runtime are each out and need their own owner ruling.

## Assumptions

- **A1** — The top five respond to porting as SPRINT-102's five did (~170 s → 17 s). **UNCONFIRMED and deliberately not inherited** — three of the five are conformance/sweep work whose cost may not be spawn-shaped at all. *Confirm: each task's first DoD is its own measurement; A1 is never the basis for a port.*
- **A2** — Round 16's ranking is stable across runs. **PARTIALLY CONFIRMED** — the ranking is derived from one completed profile, and that run was 1216 s against 1490 s for identical code, so absolute figures carry ±20%. *Confirm: each per-target measurement re-derives its own figure; if a target's measured cost contradicts Round 16's rank, the rank is wrong and the Plan is amended via a logged `scope-change`.*
- **A3** — Porting all five would put the gate near 8 minutes. **AN ESTIMATE, NOT A TARGET.** Nothing in this sprint's DoD depends on it. *Confirm: measured at close against the real total, and recorded as a Round whether or not it lands.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-103-port-the-measured-hotspots.md`, rendered
> from `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never
> here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->
