---
sprint: 103
slug: port-the-measured-hotspots
owner: Maintainer
last_updated: 2026-09-21
status: closed
plan_commit: bfa3fec
close_commit:
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
Cites: Round 16 · TD-090 · L-144 · conformance-engine.sh · qa-gate-timing.md · spec/STANDARD.md · T3

**305 s — 25% of the entire gate, the largest single item by a factor of two.**

**Measure before building.** Round 16 attributes the seconds; it does not say *why*. Profile this
harness specifically: how many checker invocations, how much is `sys`, and is the cost spawn-shaped
at all? A target whose time is real work rather than `fork()` emulation is **ruled unportable and
recorded as such** — that is a successful task, not a failed one.

**Acceptance:** either (a) the harness is ported, byte-identical parity proven against its retained
oracle, and its leg wired; or (b) a recorded ruling naming the mechanism and why porting does not
reach it. Not "attempted".

**Amended 2026-09-20 (scope-change, see Execution Log).** The measurement produced (b) *and* a third
outcome this frame could not express: **(c) ruled unportable, and the cost removed anyway** by
handing the engine an awk-derived spec reduced to the 43 rules the 68 cases actually assert on
(§9+§10+§11+§12, confirmed by two independent derivations). (c) is now T1's acceptance. It is a
Tier G change to a guard harness, so it takes the full bar in its own right even though no port
occurs — and it stays strictly on the **caller** side: `conformance-engine.sh` is read-only for the
rest of this sprint under T3's ruling (ADR-043).

**DoD:**
- [x] Per-target measurement recorded in `qa-gate-timing.md` — invocation count, `sys` share, the mechanism — *Verify: the Round names the figures and how they were derived*
- [x] Ruling: spawn-shaped (port) or not (record + stop), taken **on the measurement**, not on Round 16's rank
- [x] **(c)** Reduced spec is **awk-derived from the shipped `spec/STANDARD.md`**, never hand-authored, and carries a **drift anchor** that FAILS the harness if the reduction loses a required section — *Verify: delete a §11 row from a scratch spec copy and the anchor reddens*
- [x] **(c)** Byte-identical parity: all 68 cases produce the same PASS/FAIL verdicts and the same finding strings under the reduced spec as under the full one — *Verify: the differential reports 68/68 identical*
- [x] **(c)** The 43-rule set is justified in the harness header **from the assertions, not from the section names** — the existing header's §9+§10 claim is wrong and is corrected in the same edit (L-186)
- [x] **(c)** Retained must-FAIL + sibling control + seeded-break proof under ONE stated hash convention
- [~] If ported: `.sh` retained as live oracle; byte-identical differential parity over every fixture **and** the real corpus it applies to — *Verify: the differential reports N/N identical, N stated* — **n/a: no port occurred.** T1 resolved on branch **(c)** (ruled not spawn-shaped; cost removed by an awk-derived reduced spec). The `.sh` was never replaced, so there is no oracle to retain, nothing to prove parity against, and no leg to rewire. The equivalent Tier G bar was met in its own right and is ticked above (drift anchor, 68/68 reduced-vs-full parity, retained must-FAIL + control + seeded break).
- [~] If ported: retained must-FAIL + sibling control + seeded-break proof under ONE stated hash convention — **n/a: no port occurred.** T1 resolved on branch **(c)** (ruled not spawn-shaped; cost removed by an awk-derived reduced spec). The `.sh` was never replaced, so there is no oracle to retain, nothing to prove parity against, and no leg to rewire. The equivalent Tier G bar was met in its own right and is ticked above (drift anchor, 68/68 reduced-vs-full parity, retained must-FAIL + control + seeded break).
- [~] If ported: wiring diff **committed as a reviewable file before being applied** (three reviewers in SPRINT-102 could not audit wiring that lived only in chat — L-151) — **n/a: no port occurred.** T1 resolved on branch **(c)** (ruled not spawn-shaped; cost removed by an awk-derived reduced spec). The `.sh` was never replaced, so there is no oracle to retain, nothing to prove parity against, and no leg to rewire. The equivalent Tier G bar was met in its own right and is ticked above (drift anchor, 68/68 reduced-vs-full parity, retained must-FAIL + control + seeded break).
- [x] Outside reviewer dispatched worktree-isolated (ADR-029 ii · L-165 · L-168)
- [x] Before/after stated as a **range over ≥3 alternating runs**, never a point estimate — this host shows >3× run-to-run variance

### T2 — Rule and port `run-layers-observed-fixtures.sh` `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `evals/run-layers-observed-fixtures.sh` · `scripts/lib/check-layers-observed.sh` (retained as oracle) · a new `scripts/lib/check-layers-observed.ts` · `scripts/qa-check.sh` (leg 15) · `docs/research/logs/qa-gate-timing.md`
Depends-on: none
Cites: Round 16 · SPRINT-102's `layers-completeness` port (the pattern, not the file) · T1

**153 s.** Note carefully: this is `check-layers-observed`, a **different checker** from the
`check-layers-completeness` SPRINT-102 spent a day porting. The near-identical names are why the
wrong one was chosen; the shipped port is not reusable here beyond its shape.

**Acceptance:** same two-branch form as T1 — ported with parity proven, or ruled unportable with the
mechanism recorded.

**DoD:**
- [x] Per-target measurement recorded before any code is written
- [x] The two checkers' names are disambiguated wherever both appear, so the next reader cannot repeat the substitution — *Verify: `layers-observed` vs `layers-completeness` are distinguished in the Round and in the port's header*
- [x] If ported: oracle retained · byte-identical parity over fixtures **and** all real sprint Plans, **including non-archived copies** — the archived corpus is SKIPPED by the sibling checker and comparing it yields two empty outputs that agree while proving nothing (L-198, hit twice in SPRINT-102)
- [x] If ported: retained must-FAIL + sibling control + seeded break, one hash convention
- [x] If ported: wiring diff committed before applied
- [x] Outside reviewer, worktree-isolated
- [x] Before/after as a range over ≥3 runs

### T3 — Rule leg 2f-ter, the conformance engine sweep `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `scripts/qa-check.sh` (leg 2f-ter) · `scripts/lib/conformance-engine.sh` (**consumer-facing per ADR-027 — read-only unless the ruling requires otherwise**) · `docs/research/logs/qa-gate-timing.md` · an ADR if the ruling is hard-to-reverse
Depends-on: none
Cites: ADR-027 · Round 16 · conformance.sh · conformance-engine.sh

**139 s, and the riskiest of the five.** `conformance-engine.sh` is **consumer-facing** — ADR-027
amended ADR-008 to make it answer for *any* repository through the root `conformance.sh`, and its
exit code is a documented contract an adopter may gate CI on. A port here is not an internal
refactor; it is a change to a shipped interface, and L-015's consumer check binds.

**`J2` and `class: decision` on purpose:** the likely outcome is a ruling about *whether* this is
portable at all, not a port. Deciding that is human-reserved.

**Acceptance:** a recorded ruling on whether leg 2f-ter's cost can be reduced without touching the
consumer-facing surface, with the mechanism measured. A port is permitted only if the ruling says so.

**DoD:**
- [x] The sweep's cost mechanism measured and recorded — is it spawns, corpus size, or real work?
- [x] Consumer-facing blast radius stated explicitly: what an adopter of `conformance.sh` would observe, if anything (L-015)
- [x] Ruling recorded **where its reader reaches it** — the engine's own header or an ADR, never only the ledger (L-151)
- [x] If the ruling is hard-to-reverse **and** surprising **and** a real trade-off → ADR (§4's three-part bar), else explicitly not

### T4 — Rule and port `run-conformance-engine-fixtures.sh` `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `evals/run-conformance-engine-fixtures.sh` · `docs/research/logs/qa-gate-timing.md` · `scripts/qa-check.sh` only if a leg change follows
Depends-on: T3 (its ruling bounds what may be touched on the engine side)
Cites: ADR-027 · Round 16

**98 s.** Distinct from T3: this is the fixture harness, not the gate leg. It may be portable even if
T3 rules the engine itself untouchable — the harness can batch or move in-process without the engine's
interface changing.

**Acceptance:** ported with parity proven, or ruled unportable with the mechanism recorded.

**DoD:**
- [x] Per-target measurement recorded before any code is written
- [x] T3's ruling read and respected — state in one line what it permits here
- [~] If ported: oracle retained · byte-identical parity · retained must-FAIL + sibling control + seeded break, one hash convention — **n/a: no port occurred.** T4 resolved on a recorded **split ruling** (Round 20): ~50 s of its ~106 s is `conformance-engine.sh` invocation, out of reach under ADR-043, and the reachable ~56 s of fixture construction is filed as **TD-171** for its own sprint. Nothing was ported, so there is no parity, wiring, review or before/after to state.
- [~] If ported: wiring diff committed before applied — **n/a: no port occurred.** T4 resolved on a recorded **split ruling** (Round 20): ~50 s of its ~106 s is `conformance-engine.sh` invocation, out of reach under ADR-043, and the reachable ~56 s of fixture construction is filed as **TD-171** for its own sprint. Nothing was ported, so there is no parity, wiring, review or before/after to state.
- [~] Outside reviewer, worktree-isolated — **n/a: no port occurred.** T4 resolved on a recorded **split ruling** (Round 20): ~50 s of its ~106 s is `conformance-engine.sh` invocation, out of reach under ADR-043, and the reachable ~56 s of fixture construction is filed as **TD-171** for its own sprint. Nothing was ported, so there is no parity, wiring, review or before/after to state.
- [~] Before/after as a range over ≥3 runs — **n/a: no port occurred.** T4 resolved on a recorded **split ruling** (Round 20): ~50 s of its ~106 s is `conformance-engine.sh` invocation, out of reach under ADR-043, and the reachable ~56 s of fixture construction is filed as **TD-171** for its own sprint. Nothing was ported, so there is no parity, wiring, review or before/after to state.

### T5 — Rule and port `run-qa-budget-position-fixtures.sh` `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `evals/run-qa-budget-position-fixtures.sh` · `docs/research/logs/qa-gate-timing.md`
Depends-on: none
Cites: Round 16 · TD-167 · run-qa-budget-fixtures.sh

**66 s.** The smallest of the five and the one most likely to be cheap. Its sibling
`run-qa-budget-fixtures.sh` carries **TD-167**, a timing race that reddens under load — **do not fix
TD-167 here** (it is out of scope), but if this harness shares the wall-clock-derived-input shape,
say so in the Round so TD-167's fix direction is informed by a second sighting.

**Acceptance:** ported with parity proven, or ruled unportable with the mechanism recorded.

**DoD:**
- [x] Per-target measurement recorded before any code is written
- [x] Checked for TD-167's shape (an assertion whose input is a clock) and the finding recorded either way
- [~] If ported: oracle retained · byte-identical parity · retained must-FAIL + sibling control + seeded break, one hash convention — **n/a: ruled unportable.** T5's 66 s is a deliberate `WINDOW=60` `timeout` that case 2 must sit out to demonstrate TD-084's silent shape — proven on measurement (two runs 0.1 s apart while CPU differed >2×, only 24% of wall being CPU). The wait *is* the assertion, so no port exists to give an oracle, parity, wiring, review or range.
- [~] If ported: wiring diff committed before applied — **n/a: ruled unportable.** T5's 66 s is a deliberate `WINDOW=60` `timeout` that case 2 must sit out to demonstrate TD-084's silent shape — proven on measurement (two runs 0.1 s apart while CPU differed >2×, only 24% of wall being CPU). The wait *is* the assertion, so no port exists to give an oracle, parity, wiring, review or range.
- [~] Outside reviewer, worktree-isolated — **n/a: ruled unportable.** T5's 66 s is a deliberate `WINDOW=60` `timeout` that case 2 must sit out to demonstrate TD-084's silent shape — proven on measurement (two runs 0.1 s apart while CPU differed >2×, only 24% of wall being CPU). The wait *is* the assertion, so no port exists to give an oracle, parity, wiring, review or range.
- [~] Before/after as a range over ≥3 runs — **n/a: ruled unportable.** T5's 66 s is a deliberate `WINDOW=60` `timeout` that case 2 must sit out to demonstrate TD-084's silent shape — proven on measurement (two runs 0.1 s apart while CPU differed >2×, only 24% of wall being CPU). The wait *is* the assertion, so no port exists to give an oracle, parity, wiring, review or range.

## Owner-action checklist

- [x] Rule T3 if it asks — the consumer-facing engine is the one place in this sprint where a wrong call reaches adopters
- [x] **Ruled TD-170** — widen `is_governance_commit()`'s allow-list to include `docs/sprint/`; applied to both implementations, fixtures retained, outside-reviewed
- [x] **Ruled ADR-039 split** — `authority` · `doc-caps` · `night-run-rollup` differentials (~104 s) join the opt-in set; `layers-observed` (189.3 s) stays excluded and named, its own ruling deferred until the post-sprint gate total is known
- [x] **EXEMPTION, recorded: two commits leg 15 correctly rejects.** `ccd6c6c` (`fix(TD-170): …`) matches no attribution rule while touching three code files; `e9c7e14` (`sprint(103) T2: …`) carries `docs/adr/ADR-043…`, which T2's `Layers:` does not declare. Both are mixed-concern subjects written before the convention was load-bearing anywhere a committer reads. **Exempted for this sprint only**, history not rewritten — the shas are cited by name in ADR-043, TD-170's evidence trail and this Log, and amending them would falsify those references. The convention is now written in `.claude/CONTEXT.md` § Sprint model, so the next commit that does this reddens against a rule that exists in prose as well as in code.

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
| `evals/run-sprint-family-fixtures.sh` | T1 | hands the engine an **awk-derived 43-rule spec** (§9+§10+§11+§12) instead of the shipped 100-rule one — dispatch is ~26 ms/rule paid per call, and this harness makes 68 calls | med | 69/69 verdict lines `cmp`-identical against the full spec; `run-sprint-family-spec-reduction-fixtures.ts` |
| `evals/run-sprint-family-spec-reduction-fixtures.ts` | T1 | **new, retained** — must-FAIL fixture for the reduction: three drift modes, each with its named finding, plus a control. Extracts the anchor and the awk program from the live harness between three `exactly once` sentinels, and **behaviourally probes per-section counts** so a 43-row decoy that drops §9 cannot pass | med | 4 cases; control green; the reviewer's own decoy rejected |
| `scripts/lib/check-layers-observed.ts` | T2 · TD-170 | **new** — port of the 644-line oracle (the one target of five whose cost is genuinely spawn-shaped: 59% `sys`, ~30 non-git forks per file). Carries TD-170's `docs/sprint/` allow-list arm | med | 29/29 differential (exit code + stdout) over 19 built git fixtures + 103 real sprint files; 43/43 assertions |
| `scripts/lib/check-layers-observed.sh` | T2 · TD-170 | **oracle retained** under D5, untouched by the port; one-line governance allow-list widening applied to both implementations | low | same differential, both directions |
| `evals/run-layers-observed-differential.ts` · `evals/fixtures/layers-observed/git-fixtures.ts` | T2 | **new** — the differential and its fixture builder, incl. the `two-parentheticals-last-wins` case + `one-parenthetical-control` that the outside review's defect made necessary | med | seeded break 29/29 → 26/27, control green, restored to a stated hash |
| `scripts/lib/conformance-engine.sh` | T3 | 16 **comment-only** lines recording ADR-043 where the maintainer who opens this file to make it faster will read it (L-151) | low | `sh -n` clean; byte-identical output + exit code vs pristine over the full 100-rule spec |
| `scripts/qa-check.sh` | T0 (coordinator, D3) | leg 15 → the `.ts` port with a `bun`-missing FAIL-not-skip guard; leg 12 dispatches `.ts` harnesses and its census glob admits them; ADR-039 opt-in split applied; one stale rationale comment corrected | med | gate run `214 pass, 9 fail`, every finding dispositioned in the Log; no census complaints |
| `docs/adr/ADR-043-…the-engine-is-the-gates-cost-centre…md` | T3 | **new** — the ruling, recording the constraint the porting sprint inherits rather than the deferral | — | — |
| `docs/research/logs/qa-gate-timing.md` | T1–T5 | Rounds 17–21 — every per-target measurement and both before/after ranges | — | two routes per figure |
| `docs/research/logs/qa-check-ts-harness-dispatch-wiring.diff.md` · `…-layers-observed-wiring.diff.md` | T1 · T2 | wiring diffs committed as reviewable files **before** being applied (L-151) | low | applied, then verified by running the gate rather than by reading the diff |
| `.claude/CONTEXT.md` | T0 | § Sprint model now states leg 15's attribution rules in prose — the convention was enforced in code and written nowhere a committer reads | low | the two exempted commits name exactly what it would have caught |
| `TECH-DEBT.md` · `TODO.md` | T0 | TD-168 · TD-169 · TD-170 · TD-171 filed; TASK-356 filed mid-run rather than left in the Log | — | — |
| `docs/sprint/SPRINT-103-*.md` · `docs/sprint/logs/SPRINT-103-*.md` | T0 | Plan ticks + the append-only Log | — | — |

> `docs/epic/EPIC-016-*.md` and `docs/knowledge-index.md` also moved in this commit range. The epic
> edits (`ad75b72`, `8b541d1`) belong to the **workdoo stream**, not to this sprint; the index is
> generated.

## Retro

**Retrieval check** — no retrieval miss, and two contradictions of prior rules, both caught rather
than missed. **L-136 fired inside my own work**: I reported `tsc` clean for the T1 fixture three
times while `tsconfig.json`'s `include` never held the file, having written the L-136 warning into
this sprint's own G2 notes hours earlier — found by an outside reviewer, and filed as **TD-169**
because the gate's typecheck leg is blind by the same population. **L-170 fired three times in one
session** (`ADR-999` · `TD-961` · `TASK-908`, every one a fixture or example token), each caught by
the promoted rule working as written. Neither is a retrieval failure: both rules were found, cited,
and one was still not carried across a selector.

**Cost** — coordinator inline + 4 worktree-isolated passes (1 builder, 3 outside reviewers). Six
alternating timing runs for T1's range, three pairs for T2's, plus one full gate run. **No
full-profile gate run at close**: the host sat at **3.0% free memory (428 MB of 14,078 MB)**, the
condition that killed Wave 0, and a wall-clock figure taken under paging measures swap rather than
the gate — the same ruling Round 17 made. Per DoD **delivered**: 23 ticked · 11 `[~]` n/a · 0 open,
across 5 tasks + 4 owner-action rows.

**Worked**

- **Measure-then-rule (D2) paid for itself on the first target.** A1 said the five would respond as
  SPRINT-102's did. For T1 they do not: 199 s of its 305 s is dispatch **inside** the engine the port
  would still have to call 68 times. Inheriting A1 would have bought a port worth a small fraction of
  the cost — the SPRINT-102 mistake, avoided by the measurement that exists to avoid it.
- **The same program carried two opposite cost mechanisms, and both rulings hold.** T1 pays fixed
  dispatch 68× against tiny dirs (a reduced spec fixes it); T3 pays per-file spawns once against a
  large corpus (no reduction reaches it without dropping rules, which D6 forbids). A per-target
  *ranking* attributes seconds and answers neither.
- **Every guard defect this sprint was found by an independent pass, none by recalling the rule.**
  Four reviews, four confirmed defects: a 66-vs-68 tally in a header whose own thesis is that a
  file's prose about its population is not evidence; a fixture extracting a decoy `awk` line; a
  behavioural probe checking quantity where the commit claimed identity; and the port defect below.
  L-165 held 4 of 4.
- **The non-overlapping range is what made T1 a measurement rather than an anecdote.** On a host
  showing 35% spread between two runs of byte-identical code, six alternating runs put the arms at
  319.2–354.6 s and 136.7–184.0 s — the slowest reduced run 135 s faster than the fastest full one.
  The DoD's refusal of a point estimate is the whole reason that claim survives.
- **Refusing to reinterpret a check in order to clear it.** The gate's `review-depth-*-absent`
  findings were correct: T0 and T3 carried `governance:high` with no `review ·` line. Downgrading the
  classification would have cleared the check; an outside review was dispatched instead and the
  `review ·` lines were written from what it found.

**Friction**

- **A claim was true when measured and false by the time it was written — and the act of recording it
  is what broke it.** `ccd6c6c` asserts *"leg 15 now exits 0 on both … the close blocker is
  cleared."* The check ran while the fix was **uncommitted**, where the checker takes its WIP leg;
  committing the fix added a commit that was itself unattributable, and both implementations then
  exited 1. The fact was caught independently by the next gate run — what was not done is retracting
  the commit message, until a review forced it → **L-206**.
- **A port defect survived 25/25 parity, 37/37 assertions, 103 real files and a seeded break**,
  because `git log --all` over this repo's entire history holds **zero** commit subjects carrying two
  `(SPRINT-N Tn)` citations. The oracle's unanchored greedy `sed` takes the **last** match; the
  port's `.exec` took the **first**. The brief sent the reviewer after seven admitted-skipped
  branches and every one came back clean — the gap was orthogonal to that list → **L-207**.
- **Round 20 measured the wrong subject, and would have reported the result honestly.** It timed
  `run-layers-observed-fixtures.sh` (185.7 s) — a harness that exercises the **retained oracle**,
  which D5 says must not move. The port's real subject is leg 15: 21.0 s → 3.4 s → **L-208**.
- **Two commits this sprint are unattributable under the convention the sprint itself enforces**
  (`ccd6c6c`, `e9c7e14`), exempted on the record rather than amended because their shas are cited by
  name in ADR-043 and TD-170's evidence trail. The convention now lives in `.claude/CONTEXT.md`
  § Sprint model — it had been enforced in code and written nowhere a committer reads (L-151).
- **Two seeding attempts were silently inert or spuriously green** (a `sed` that errored leaving the
  file untouched while the suite reported 27/27; an `awk`-built decoy whose `\|` was eaten). Both
  caught by the guards L-137 and L-142 prescribe — `cmp` against pristine, and the control reddening
  alongside the seed.
- **A rollup figure I reported all sprint was wrong** — "35 DoD" swept the Owner-action checklist row
  into a `grep -c '^- \[ \]'` over the Plan. The Plan holds 34. Nothing downstream depended on it,
  but every rollup figure I gave carried the error.

**Pattern candidate** (→ `docs/LEARNINGS.md`)

- **L-206 filed** — a verification whose subject includes the act of recording it: the check ran
  against a dirty tree, and committing changed the population it read. Count 1.
- **L-207 filed** — a fixture population complete over every *enumerated branch* and still a single
  point on a dimension nobody named. Extends L-186 / L-202. Count 1.
- **L-208 filed** — under a retain-the-oracle policy the fixture harness is deliberately off the
  changed path; measure the leg the change is in the path of. Count 1.
- **Not filed, watched:** *"a fix derived from one target's measurement does not transfer to another
  target of the same program"* (T1's reduced spec against T3's corpus spawns). The measure-then-rule
  discipline already covers the ranking grain; if a second sprint applies one target's fix to a
  sibling target of the same program, that is the second sighting and it earns a row.
