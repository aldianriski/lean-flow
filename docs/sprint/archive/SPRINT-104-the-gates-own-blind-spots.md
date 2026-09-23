---
sprint: 104
slug: the-gates-own-blind-spots
owner: Maintainer
last_updated: 2026-09-23
status: closed
plan_commit: 5216c69
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-104 — The Gate's Own Blind Spots

> **Theme:** SPRINT-103 found two gate legs that are correct in their logic and blind in their
> population — a typecheck reporting `clean (0 errors)` over a program that holds none of the ported
> checkers, and a census that could not see a `.ts` harness. The second was fixed in passing. This
> sprint closes the first, closes its sibling in `FAIL`-line emission, corrects the cost comments a
> maintainer reads when choosing the next target, and only then measures the gate all three changed.
> The measurement comes last on purpose: SPRINT-103's A3 was deferred for a host at 3.0% free memory,
> and a total taken before these changes answers a question nobody will ask again.

## Scope

**In:** `TASK-358` (put `scripts/` and `evals/` inside the gate's typecheck, fix what surfaces) ·
`TASK-350` (route bootstrap failures through a shared emitter, so a one-space `FAIL ` line cannot
hide from a column-keyed selector) · `TASK-356` (re-audit the gate's own cost/ranking comments
against Round 16 and give the stale ones an expiry) · `TASK-357` (re-measure the gate total, then
rule ADR-039's deferred `layers-observed` opt-in against it).

**Out (deferred):** porting `conformance-engine.sh` — ruled out of scope by **ADR-043**, carried as
**TD-168**, and nothing here reopens it · `TD-171`'s fixture-construction half of
`run-conformance-engine-fixtures.sh` · `TD-172`'s duplicate `learn_entry()` · `TD-167`'s clock-input
fixture class · changing WHAT the gate checks, in any form · `TASK-319`/`TASK-188` (EPIC-015's
unattended run), which wait on the green gate this sprint measures rather than on this sprint.

## Plan

### T1 — Put `scripts/` and `evals/` inside the gate's typecheck `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `tsconfig.json` (or a leg-local config) · `scripts/qa-check.sh` (typecheck leg, :1008 — applied from a committed diff per D2) · `scripts/qa-verdict.ts` · a retained fixture under `evals/`
Depends-on: none
Cites: TD-169 · ADR-037 · TD-101 · L-136 · L-186 · L-058 · SPRINT-103 T2 · `qa-check.sh` · `qa-verdict.ts` — bare-name DoD references to the two Layers: paths above; the checker matches exact strings, so the bare spelling needs its own declaration

`qa-check.sh` runs a bare `tsc --noEmit`, so the program is the root `tsconfig.json`'s
`apps/** · packages/** · test/**` — **every ported checker in `scripts/lib/` and every harness in
`evals/` is outside it while the leg reports `clean (0 errors)`.** ADR-037/TD-101 hardened this same
leg so a *skip* could not read as a pass; it is blind by **population** instead. Found at SPRINT-103
T2, where a `tsc` clean claim made three times turned out to be a statement about a program that
never held the file.

**Acceptance:** the leg's `tsc` program demonstrably **contains** files from both trees, the errors
that surfaces are fixed, and a seeded type error in each tree reddens the leg.

**DoD:**
- [x] Blast radius re-derived before any edit — *Verify: a probe config over `scripts/**` + `evals/**` prints its error count and file list; the promote measured **2**, both `TS18047` in `qa-verdict.ts` (147,5 · 151,5), and a different number is a scope-change, not a surprise to absorb (L-130)*
- [x] The leg's program contains both trees — *Verify: `tsc --noEmit --listFiles | grep -c` returns ≥ 1 for a named `scripts/lib/*.ts` **and** for a named `evals/*.ts`. An exit code of 0 says nothing about which files were in the program — that is exactly how this was missed (L-136)*
- [x] Both surfaced errors fixed, and the leg reports a **true** clean — *Verify: the leg's own printed line, not its exit status (L-120)*
- [x] **Tier G bar**: seed a type error into one `scripts/lib/*.ts` and one `evals/*.ts`; each reddens the leg, a sibling control file stays green — *Verify: seed confirmed landed (targeted, parses, line count within one of pristine) and restored under ONE stated hash convention (L-137 · L-142 · L-169)*
- [x] Fixture **retained**, not deleted with the proof (TD-012)
- [x] Outside reviewer dispatched worktree-isolated (ADR-029 ii · L-165 · L-168)
- [x] Edit to `scripts/qa-check.sh` committed as a reviewable diff before being applied (D2 · L-151)

### T2 — Route bootstrap failures through a shared emitter `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `evals/lib/harness-common.sh` · `evals/lib/check-system-verify-block.sh` · `scripts/lib/check-approval-envelope.sh` · `scripts/lib/check-count-claims.sh` · `scripts/lib/check-ephemeral-intake.sh`
  · `scripts/lib/check-epic-archive.sh` · `scripts/lib/check-epic-archive.ts` · `scripts/lib/check-handoff-state.sh` · `scripts/lib/check-layers-completeness.sh` · `scripts/lib/check-layers-observed.sh`
  · `scripts/lib/check-night-run-rollup.sh` · `scripts/lib/check-qa-budget-default.sh` · `scripts/lib/check-research-archive.sh` · `scripts/lib/check-review-depth.sh` · `scripts/lib/check-verify-reaches.sh`
  · `scripts/lib/conformance-engine.sh` (**consumer-facing, ADR-027 — see D5**) · `scripts/qa-check.sh` (per D2)
  · `evals/run-emitter-column-fixtures.ts` (added mid-sprint — the retained Tier G fixture DoD 5/6 require; a `Layers:` written at promote cannot name a file the implementation invents, L-100)
<!-- The fifteen checkers were `scripts/lib/check-*.sh` until SPRINT-104 T2 execution. That token
     matched NOTHING: covers() takes an exact path or a trailing-slash directory prefix and supports
     no globs, so T2 carried a declaration covering zero of the files it rewrote — and it would have
     missed `check-epic-archive.ts` even if globs worked. Enumerated rather than widened to
     `scripts/lib/`, because the checker's own header records a directory token "swallowing every
     undeclared file beneath it" (L-151 · L-186). -->

Depends-on: none
Cites: TD-157 · L-186 · L-198 · L-108 · ADR-027 · ADR-043 · SPRINT-100 T5 · `check-epic-archive.ts` (bare-name reference to its Layers: path) · `conformance.sh` (the adopter channel D5 reasons about — read, never modified)

A failure emitted *before or outside* a file's own `bad()`/`ok()` helper lands at a one-space `FAIL `
column, and a selector keyed to the two-space finding column cannot see it. That is not cosmetic:
SPRINT-100 T5 found `conformance-engine.sh:54`'s one-space line leaving `sweep_gate` returning
`rc=0` **on a crashed engine**. **The shape of the fix is the decision, not the edit** — one shared
`fatal()` every bootstrap check calls, versus teaching each file's helper to be callable before its
own setup completes. `J2` because that choice binds every checker and one of the files is shipped.

**Acceptance:** no `FAIL ` line in `scripts/` or `evals/` is emitted at a one-space column, and the
chosen shape is recorded with its reasoning where the next maintainer reads it.

**DoD:**
- [x] The site set re-derived by **two disagreeing selection rules**, not by inheriting TD-157's `27 sites / 15 files` — *Verify: both routes state a count and they agree; a shared selector shape in both is not a cross-check (L-198)*
- [x] Owner ruling on the shape recorded **at the code**, not only in the ledger (L-151)
- [x] Every rewritten site is a genuine bootstrap failure, checked per site — *Verify: the assumption A2 names is discharged site by site, and any site that is a finding rather than a bootstrap failure is named and left alone*
- [x] **Consumer check (L-015)**: what an adopter of root `conformance.sh` observes after this change, stated explicitly — exit code and report text, in one line, or an explicit "nothing"
- [x] **Tier G bar**: retained must-FAIL per rewritten emitter path with its **named** finding, sibling control green, seeded break verified landed and restored under ONE stated hash convention
- [x] A **population** fixture, not only branch fixtures — one site reached by the other selection arm (L-186 · L-207)
- [x] Outside reviewer, worktree-isolated
- [x] Shared-file edits committed as reviewable diffs before being applied (D2)

### T3 — Give the gate's stale cost comments an expiry `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/qa-check.sh` (comments only) · `scripts/lib/check-layers-completeness.ts` (comments only) · `scripts/lib/conformance-engine.sh` (comments only) · `docs/research/logs/qa-gate-timing.md` (the Round it reconciles against)
<!-- Was `scripts/lib/*.ts|sh`. `check-layers-observed.sh`'s covers() matches an EXACT path or a
     trailing-slash DIRECTORY PREFIX and supports no globs at all, so that token matched nothing and
     T3 carried a declaration covering zero files while reading as complete (L-151). Named exactly
     rather than widened to `scripts/lib/`: the checker's own header records that a directory token
     "swallowed every undeclared file beneath it", which is the failure this sprint is about. -->

Depends-on: T2 (it audits the comment surface T2 rewrites; auditing first would audit a file about to change)
Cites: TASK-356 · Round 16 · Rounds 19–21 · L-130 · `check-layers-completeness.ts` (bare-name reference to its Layers: path) · `check-layers-observed.sh` (named in the note above to explain covers() — read, never modified)

A cost comment is what a maintainer reads when deciding whether to promote a harness from opt-in to
always-on, or which target to attack next — and **SPRINT-102 lost a day to exactly that failure at
the ledger grain.** Two instances were corrected by accident in SPRINT-103 (`qa-check.sh:1169`'s
"~5 min for 23 cases" against a 68-case harness; `check-layers-completeness.ts`'s "slowest harness in
the gate", retired by Round 16). Two found by accident says nothing about how many exist.

**Acceptance:** every surviving comment naming a cost, a rank or a superlative is either re-derived
against the latest Round or deleted, and the count examined is stated.

**DoD:**
- [x] Candidate set derived by **two disagreeing routes** — a stale figure can be a duration, a rank, a count or a superlative, and only the last is greppable (L-198)
- [x] Every hit reconciled against the latest Round, corrected or deleted — *Verify: the count examined and the count changed are both stated; "no surviving comment contradicts the Round" is a claim about a set, so the set is named*
- [x] Comment-only confirmed — *Verify: the non-comment diff against pristine is empty, line-level (the check SPRINT-103 used for the same claim)*
- [x] Tier **P**: G1 plus a read-through; no discrimination proof is owed and this DoD says so rather than leaving it ambiguous (ADR-029)

### T4 — Re-measure the gate total, then rule ADR-039's deferred opt-in `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `docs/research/logs/qa-gate-timing.md` (a new Round) · `scripts/qa-check.sh` (`eval_harnesses_optin`/`_excluded`, only if the ruling moves one) · `docs/adr/ADR-039-*.md` (annotation, if the ruling changes its standing)
Depends-on: T1, T2, T3 — it measures the gate **after** they change it
Cites: TASK-357 · ADR-039 · SPRINT-103 A3 · Rounds 16–21 · D4 · `qa-check.sh` (bare-name reference to its Layers: path)

SPRINT-103's A3 — *"porting all five would put the gate near 8 minutes"* — was filed as an estimate
with "measured at close against the real total" as its confirm path, and the close could not run it
(host at 3.0% free memory; a figure taken under paging measures swap). ADR-039's split left
`layers-observed`'s differential at **189.3 s excluded and named**, its own ruling deferred *until a
re-measured total exists*, because deciding a 189 s recurring cost against a total nobody has
re-derived is the mistake SPRINT-103 was built to stop.

**Acceptance:** a Round records the completed `QA_FULL=1` total as a range, and the `layers-observed`
ruling is taken against that Round and cites it by number.

**DoD:**
- [ ] Host memory checked **before** measuring — *Verify: free memory stated in the Round; below ~3 GB the task **parks** with its unblock condition and measures nothing (SPRINT-103's own ruling, not a new one)*
- [ ] Completed `QA_FULL=1` total recorded as a **range over ≥3 runs**, never a point estimate — this host has shown 35% spread between two runs of byte-identical code
- [ ] SPRINT-103's measured savings reconciled against the total — *Verify: the Round states what the arithmetic predicted (T1 median 341.0 → 149.8 s · T2 leg 15 21.0 → 3.4 s) and what the run actually shows, and does not substitute one for the other (D2)*
- [ ] **A3 dispositioned explicitly** — confirmed or refuted, recorded either way, never left silent
- [ ] Owner ruling on `layers-observed` (189.3 s): opt-in or excluded-and-named, with the three current `optin` harnesses' cost stated beside it
- [ ] If the ruling moves a harness, the `qa-check.sh` edit goes through D2's diff-then-apply

## Owner-action checklist

- [x] **Rule T2's shape** — shared `fatal()` vs per-file helper. `J2`: it binds every checker, and one of the files is shipped to adopters through `conformance.sh`
- [ ] **Rule ADR-039's `layers-observed` opt-in at T4**, against the measured total rather than against an estimate
- [x] **Free host memory before T4** (target > 3 GB free) — or rule T4 parked and let it carry to the next sprint with its unblock condition intact — *ruled parked 2026-09-23 after a measurement attempt was reaped for memory; see Execution Log*

## Decisions (pre-locked)

- **D1** — **No `epic:` frontmatter.** Gate-correctness work, contributing to no § Closed-when
  condition of EPIC-014, EPIC-015 or EPIC-016. Same precedent as SPRINT-099, SPRINT-102 and
  SPRINT-103.
- **D2** — **`scripts/qa-check.sh` and `scripts/lib/*.sh` are coordinator-owned.** Three tasks touch
  them, so no task edits them directly: each commits a reviewable diff and the coordinator applies in
  merge order **T1 → T2 → T3**. This is what let SPRINT-102's four parallel worktrees and
  SPRINT-103's wave merge with zero conflicts, and it is also L-042's protection — never a plain
  `git add` over another task's WIP in a shared file.
- **D3** — **Tiers (ADR-029), declared not inferred: T1 = G · T2 = G · T3 = P · T4 = P.** T1 and T2
  change guards whose false negative is silent by construction, so both take the full bar (retained
  must-FAIL, sibling control, seeded break under one stated hash convention, worktree-isolated
  outside reviewer). T3 is prose and takes G1 plus a read-through. T4 changes no guard logic; its
  risk is a wrong *number*, which its own range requirement addresses. **Re-tier on discovery** if
  something turns out to guard — SPRINT-102 re-tiered P → G mid-execution and was right to.
- **D4** — **T4 measures last.** A total taken before T1–T3 describes a gate that will not exist by
  the close, and this sprint's whole premise is that a figure is about the artifact it was taken from.
- **D5** — **`conformance-engine.sh` stays consumer-facing and un-ported.** ADR-043 and TD-168 own
  the port; T2 may change how it *emits* a bootstrap failure, and only with L-015's consumer check
  stated in its DoD. Nothing here reopens the port question.
- **D6** — **No coverage change.** Same checks, same fixtures, same named findings. This sprint
  changes what the gate can *see* and *say*, never what it asks. Carried forward from SPRINT-103 D6.

## Assumptions

- **A1** — T1's blast radius is **2 errors**, both `TS18047` in `scripts/qa-verdict.ts`. **MEASURED
  at this promote** with a probe config over `scripts/**` + `evals/**`; the other 20 `.ts` files in
  those trees are clean. *Confirm: re-derived as T1's first DoD — a different number is a logged
  `scope-change`, not a surprise absorbed silently (L-097 · L-130).*
- **A2** — T2's site set is TD-157's **27 sites across 15 files**. **UNCONFIRMED and deliberately not
  inherited** — the figure was derived at SPRINT-100 and nothing has re-measured it since, while the
  tree has gained two ported checkers. *Confirm: T2's first DoD re-derives it by two selection rules
  that must agree (L-198).*
- **A3** — The host will be healthy enough for T4's runs. **UNCONFIRMED** — it was at 3.0% free at
  SPRINT-103's close and 7.5% at this promote, against a target above ~3 GB. *Confirm: T4's first
  DoD checks free memory and parks rather than measuring under paging.*
- **A4** — The gate is green once T1–T3 land. **UNCONFIRMED, and it is T4's subject** — the last
  completed run was `214 pass, 9 fail` with every finding dispositioned, and T1 is expected to turn
  it red on purpose before fixing it. *Confirm: T4's Round reports the verdict line the gate prints.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-104-the-gates-own-blind-spots.md`, rendered
> from `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never
> here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `tsconfig.json` | T1 · TD-169 | `include` gains `scripts/**/*.ts` + `evals/**/*.ts` — the typecheck leg reported clean over a program holding neither tree | med | `--listFiles` names a file from each tree; seeded type error in each reddens the leg, sibling control green |
| `scripts/qa-verdict.ts` | T1 | the two `TS18047` the widened program surfaced (147 · 151), fixed fail-closed | low | leg's own printed line: true clean |
| `evals/typecheck-population.test.ts` · `evals/run-typecheck-population-fixtures.ts` · `evals/fixtures/typecheck-population/tsconfig.narrow.json` | T1 | **new, retained** — population fixture: a narrowed config must redden it; wrapped so the gate runs it, not only `bun test` | med | discrimination proven; wired into `eval_harnesses_always` |
| `evals/lib/harness-common.sh` · 14 `scripts/lib/check-*` · `evals/lib/check-system-verify-block.sh` · `scripts/lib/conformance-engine.sh` | T2 · TD-157 | bootstrap failures moved to the two-space column: 5 via a shared `fatal()`, 15 inline; 8 sites named and left alone with the reason at the code | med | adopter path run: `conformance.sh` now prints `FAIL  conformance: …` (was one space) |
| `evals/run-emitter-column-fixtures.ts` | T2 | **new, retained** — emitter-column population guard, three layers after two outside-review rounds (language-aware skip · distinct-dir floor · every file scanned or ruled out by name) | med | 9 pass on clean tree; 4 named defeats each redden |
| `scripts/qa-check.sh` · `scripts/lib/check-layers-completeness.ts` · `scripts/lib/conformance-engine.sh` | T3 | 94 cost/rank comments examined against Rounds 16/19/21, 4 corrected, **comments only** | low | non-comment added lines: 0 |
| `scripts/qa-check.sh` | T1 · T2 (coordinator, D2) | harness registration for the two new fixtures, applied from a displayed diff | low | fixtures run in the gate |
| `docs/sprint/SPRINT-104-*.md` · `docs/sprint/logs/SPRINT-104-*.md` | T0 | Plan ticks, `Layers:`/`Cites:` corrections (logged), the append-only Log | — | layers-completeness 8/0 · prose-density 32/0 · review-depth PASS |

## Retro

**Retrieval check** — one retrieval miss. T1's log records the `discovery-order.test.ts`
`bypassed: true` failure as a new `TD-NNN` candidate; it is **TD-154**, filed at SPRINT-099 with the
same cause. The ledger was not searched before the candidate was written. Caught at this close's
sweep, not filed twice.

**Cost** — two worktree-isolated outside-review rounds covering T1 + T2 (per the Log). Gate runs: one seeded default-profile run (547 s), repeated kills for memory, and
one completed `QA_FULL=1` run today at **1863 s, under paging** (min 311 MB free). Per DoD
**delivered: 19 of 25 ticked · 6 open, all T4, carried** to `TASK-357`.

**Worked**

- **Two disagreeing selectors, used as the plan said.** T2 re-derived TD-157's frozen `27 / 15` as
  **28 / 16** before editing anything; T3 reached 94 comments by a numeric and a lexical route with
  76 and 13 hits the other could not see. Neither figure was inherited.
- **A ruled shape that could not be built was surfaced, not bent.** The owner's first ruling (one
  shared `fatal()`) met 21 of 22 sites with nothing sourced yet. It went back as a premise change and
  came back as the hybrid, recorded at the code where the next maintainer will read it.
- **Outside review found what nothing else did, twice (L-165 held again).** Round 1: the T2 fixture
  was blind to its own motivating artifact. Round 2: the same class inside the fix — a shell `case`
  default arm read as a comment, and a floor that missed a duplicated directory.

**Friction**

- **The sprint's own Plan failed a gate leg from promote to close.** Six layers-completeness findings
  existed at `5216c69` (re-run against the promote-time file) and were first written down today.
  Bare filenames in prose against full paths in `Layers:`, which the matcher treats as undeclared.
  SPRINT-099's close hit the same shape. → **TD-178**, **TASK-368**, **L-212**.
- **`Layers:` tokens that match nothing read as complete.** T2 and T3 both carried globs
  (`check-*.sh`, `*.ts|sh`) covering zero files; fixed one at a time over three rounds before the
  set was enumerated in one query — sampling instead of population, in the sprint about it. → **TD-177**.
- **T4 never got a host.** Parked at wave open (0.41 GB free), re-attempted today after
  `wsl --shutdown`, reaped at run 2 when Docker restarted WSL. A3 and the `layers-observed` ruling are
  still open, now for two sprints.
- **A review happened and was not recorded.** T1's outside review existed; its `review ·` line did not,
  so the gate read it as owed. Same finding pair as SPRINT-103's close, different cause.

**Pattern candidate** (→ `docs/LEARNINGS.md`)

- **L-212 filed** — a per-file check whose only runner is the full gate is unread whenever the full gate
  cannot finish; run it on the artifact at the moment it is written. Count 1.
- **Not filed, watched:** *"a recorded fact (review done) with no machine line reads as absent"* —
  second sighting after SPRINT-103, but with a different cause each time (there: no review; here: no
  line). Filed if a third close repeats either.
