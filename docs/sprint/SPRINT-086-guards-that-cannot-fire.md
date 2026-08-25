---
sprint: 086
slug: guards-that-cannot-fire
owner: Maintainer
last_updated: 2026-08-25
status: active
gates_signed: G1,G2 @ 835e744
plan_commit: 5ada67e
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-086 — Guards That Cannot Fire

> **Theme:** three of this repository's guards are correct, shipped, proven — and cannot fire on the
> traffic they were built for. The gate does not finish under load; the budget guard that exists to
> report that cannot trip before the run dies; the review-depth guard anchors on a log shape no sprint
> here emits. This sprint makes each of them reach its own subject, and it starts by settling the one
> measurement the first fix would otherwise rest on.

**Not an epic sprint, and that is deliberate.** EPIC-014's Sprint C (H07–H11) is *not* promoted here:
its tasks are undecomposed, and the three carry-forwards already in the Backlog (`TASK-280/281/282`)
are gated on H07/H11 existing. Promoting them now would freeze acceptance criteria that nothing in
this sprint could make reachable — the L-111 shape that has kept `TASK-188` parked since SPRINT-060.
This sprint carries no `epic:` stamp for the same reason SPRINT-084 did not: it is the instrument
sprint that makes the next one verifiable.

## Scope

**In:** settling the Round 4 / Round 5 disagreement to a named verdict · cutting the conformance
engine's spawn count so `qa-check.sh` prints a verdict on a *loaded* process table · making
`qa-budget-check.sh` trip inside the command ceiling and before fork exhaustion · giving attended log
entries a structured consequence classification so `check-review-depth.sh` reaches the case that
motivated it.

**Out (deferred):** EPIC-014 H07–H11 and the three carry-forwards that depend on them
(`TASK-280/281/282`) · **any coverage reduction** — the lever `qa-gate-timing.md` correctly ruled out
and whose exclusion T7 restated as standing · re-opening SPRINT-085 T6's archive-skip ruling (keep the
skip, forbid recording a review into an archived log — already ruled) · the 27 aged TD rows, recorded
and carried at this promote by owner ruling · re-ordering the rule-family cost ranking on a number T1
exists to check.

## Plan

### T1 — Settle the Round 4 / Round 5 disagreement to a named verdict `[size: S · risk: low · class: execution · AFK]`
Layers: `docs/research/logs/qa-gate-timing.md` (append-only — never edit a past round)
Depends-on: none
Cites: TASK-283 · TD-090 · L-094 · L-130 · `docs/research/qa-gate-timing.md` § Caveats · `S11.LOGPAIR` · `S11.WHENITRUNS` (the disputed pair — **read and re-measured, never edited**; they are rules in the engine, not files this task touches) · **T2** (which consumes this verdict — T2 depends on T1, never the reverse)

Two measurements of byte-identical code disagree **19×** on `S11.LOGPAIR` + `S11.WHENITRUNS`, and that
pair sits inside the family Round 5 ranks first. T2 would otherwise spend its effort wherever the
disputed number points. Exactly one of the two rounds is a measurement artefact; saying which is the
deliverable, and it is cheap compared with optimising the wrong family.

**Acceptance:** a **§ Round 6** states which round is wrong and why, with the disagreement reproduced
or dissolved — and the ranking T2 acts on is either confirmed or corrected by name.

**DoD:**
- [x] The disagreement is reproduced under both rounds' conditions, or the difference in conditions is named — *Verify: § Round 6 states the method for each, so a reader can tell a real change from a measurement artefact* ✓ reproduced a **third** time by an independently-built mechanism (`--spec` reduction, 66.85s) against Round 5's two figures (75.6s embedded · 76.1s `QAT_ONLY`-isolated), on code unchanged since `a5feb8a` — before either round ran
- [x] One round is named as wrong, with its cause — *Verify: the round's text names it; "both are plausible" does not satisfy this, since T2's target selection depends on the answer* ✓ **Round 4**, and the cause is structural: its "≤4s" was an *arithmetic residual* for ~35 unnamed rules, never a measurement of the pair. Round 4's own §Method (2) instrumented the identical dispatch loop and could have named them. "Both are plausible" is explicitly ruled out in the text, not merely avoided
- [x] The family ranking T2 will act on is restated post-verdict — *Verify: the ranking either matches Round 5's or names the rows that moved* ✓ unchanged from Round 5 — F11 84.7s › F6 72.1s › F5 56.0s › F9 37.4s, 89% of the real-scale total; **strengthened, not corrected**
- [x] Round 4 and Round 5 are left unedited — *Verify: `git diff` touches only appended lines (ADR-014 append-only)* ✓ coordinator-verified independently: `@@ -617,0 +618,148 @@` — a pure append at EOF, **0** deleted or modified lines

### T2 — Cut the gate's spawn count so it completes under load `[size: M · risk: med · class: execution · HITL]`
Layers: `scripts/qa-check.sh` § leg 12 · the `evals/run-*.sh` harnesses it drives — **retargeted mid-sprint from `conformance-engine.sh`; see the `scope-change` entry 2026-08-25**, T1 proved leg 12 (396.3s of 492s) and the engine sweep (`QA_FULL=1` only) are disjoint, so the frozen target could not reach this task's own Acceptance (L-100 · L-088)
Depends-on: T1
Cites: TASK-284 · TD-090 · TD-084 · L-144 · L-120 · § Round 5 · SPRINT-084 T1 (the mechanism, proven)

The gate blocked SPRINT-085's close for a full session. The characterisation is narrower than
"unrunnable": it **completes on a clean process table and fails after accumulated session load**, which
is why a fork-health probe passing immediately beforehand did not predict surviving the run. The
mechanism is not in dispute — SPRINT-084 T1 cut one leg 271.5s → 23.6s on spawn count alone with
nothing deleted. Only the target is, and T1 settles that.

**Acceptance:** `sh scripts/qa-check.sh` prints its `QA-CHECK:` verdict line on a **loaded** process
table — the condition it currently fails on — with no check deleted and no coverage lowered.

**DoD:**
- [ ] Spawn counts are cut in the families T1 confirms as dominant — *Verify: per-family spawn counts re-measured, appended as a round rather than edited in* — **reinterpreted by owner ruling (ADR-021), recorded in the `scope-change` entry**: T1 confirmed the dominant cost of the *default* profile is **leg 12 (396.3s of 492s)**, not Round 5's F11/F6/F5/F9 (which cost 1.9–5s there and 281.2s only under `QA_FULL=1`). Ticked against leg 12's harnesses. Not a silent re-read — DoD 3 was unachievable via the frozen target
- [ ] **No check deleted, no coverage lowered** — *Verify: the check inventory before and after is diffed and identical; a quieter gate is the shape of a check that stopped running (observed: 183 → 168 at SPRINT-085's close, which reconciled exactly)*
- [ ] The gate completes **under load**, not only on a clean table — *Verify: a run issued after substantial agent work in the same session prints its verdict line; a pristine-table run does not satisfy this because it already passes*
- [ ] **Tier G**: the discrimination proof — *Verify: seed a break that makes a moved check silently not run; the suite reddens while a sibling control stays green (L-142 · L-137: confirm the seed landed by `cmp`, restore under a checked hash)*

### T3 — Make the budget guard fire before the thing it guards `[size: S · risk: med · class: execution · HITL]`
Layers: `scripts/lib/qa-budget-check.sh` · `scripts/qa-check.sh` (the invocation point) · its retained fixture
Depends-on: none
Cites: TASK-285 · TD-091 · TD-084 · L-105 · SPRINT-085 blocker entry

The guard was shipped so an over-budget gate would name its skipped harnesses instead of dying mute.
Its own FAIL text says *"rather than left to run past an external timeout with no verdict line"* —
verbatim what then happened, three times. It is late in **two independent ways**, so a fix that closes
one leaves the other open: a 900s default under a 600s ceiling, and a check placed after the loop that
fork exhaustion kills first.

**Acceptance:** a deliberately over-budget run **trips the guard and names its skipped harnesses**,
inside the command ceiling and before fork exhaustion.

**DoD:**
- [x] The default budget is below the command ceiling — *Verify: the arithmetic is stated in the script beside the value, so the next reader can check it against the ceiling it exists to beat* ✓ `QA_BUDGET_SECONDS=${QA_BUDGET_SECONDS:-450}  # 600s ceiling - 150s headroom = 450s (TD-091)` at `qa-check.sh:27`, coordinator-verified on the merged tree. Backed by a **new mechanical self-check** (`check-qa-budget-default.sh`) running as a gate leg, so the value cannot drift back into stale prose
- [x] The check is reached before the eval-harness loop can exhaust forks — *Verify: an over-budget run under fork pressure still prints the guard's finding* ✓ `qb_checkpoint()` threaded through **22 sites across legs 2–12**. Proven rather than argued: a bare gate run took **9m12s** with leg 12 not starting until ~84% of output, so legs 1–11 alone can exhaust the budget before the old leg-12-only check is reached
- [x] One retained must-FAIL fixture **per lateness path**, each failing with its own named finding — *Verify: both fixtures run and name distinct findings; one fixture covering both paths does not satisfy this* ✓ two separate suites, 3 cases each, distinct findings: `qa-budget-default-exceeds-ceiling` (path a) · `qa-check-budget-exceeded-early` (path b). Both run as their own calls on the merged tree
- [x] **Tier G**: the suite is shown to discriminate — *Verify: seed each path's guard away in turn; that path's case reddens while its sibling and a control stay green* ✓ each seed verified landed by `cmp`, parsed by `sh -n`, restored under `sha256sum -c`. Stronger than asked: path (b)'s **case 2 is a retained fixture that reproduces TD-084's original silent shape** with the checkpoints seeded away — the bug is pinned, not merely guarded against

### T4 — Give attended log entries a structured consequence classification `[size: M · risk: med · class: execution · HITL]`
Layers: the sprint-log entry schema (`sprint-log.md.template` + the skills that append to it) · `scripts/lib/check-review-depth.sh` · `evals/run-review-depth-fixtures.sh`
Depends-on: none
Cites: TASK-286 · TD-092 · TD-085 · L-166 · L-108 · SPRINT-085 T6 `surprise` entry

SPRINT-085 T6's detector is correct, fixture-proven and discrimination-proven — and blind to every
sprint this repository runs, because it anchors on the **unattended** `^Tn · ` contract while every
sprint here is attended. The fix is a **schema**, not a better pattern: matching a classification
stated in prose is the substring heuristic that produced TD-085's siblings and fails green.

**Acceptance:** a live **attended** sprint log carrying `governance:high` or `behaviour:material` work
with no review line is reported as a **FAIL with a named finding** — proven on SPRINT-084's own log,
the case that motivated the work, which currently exits 0.

**DoD:**
- [x] Attended log entries carry a structured consequence classification — *Verify: the template and the appending skills emit it; a field only the template knows about is not wired (L-020)* ✓ wired at three points — `sprint-log.md.template` · `review-scoping.md` § Two dimensions · `orchestrator/SKILL.md` § Review. **And the L-020 gap that remained was found and closed**: the schema was wired into every file that *documents* it and none that *produces* traffic, so the coordinator now emits it — this sprint's own log carries the lines
- [x] The motivating case FAILs — *Verify: SPRINT-084's log at a live path is reported with a named finding, not `nothing to verify`; this is the check that SPRINT-085 T6 could not pass* — **ticked on an ADR-021 surfaced ruling, not silently.** SPRINT-084's log **unmodified still exits 0**, and always will: the schema postdates it, so no historical log can carry a line that did not exist when it was written. The criterion is unsatisfiable as literally worded. It was met in a **stronger** form instead — **SPRINT-086's own live attended log**, a real sprint carrying `governance:high` work, was reported `FAIL review-depth-governance-absent` + `FAIL review-depth-material-absent` before T4's review line existed, and PASSes now that it does. Live traffic caught in real time beats a retrofitted historical file
- [x] One retained must-FAIL fixture per branch, each with its own named finding — *Verify: the fixtures run and name distinct findings* ✓ **6 absence fixtures**: 2 attended branches + 4 transcription-drift classes added by the revise pass, each with its own named finding, all retained on disk (TD-012)
- [x] **Tier G**: the suite is shown to discriminate — *Verify: seed the classification read away; the new cases redden while the existing siblings, including the self-reviewed control, stay green* ✓ proven twice — original pass (seed at line 170, `cmp` byte 11519, 216=216 lines, cases 11+12 red, 10 siblings green) **independently reproduced by the reviewer**, and again after the revise (exactly the 4 drift cases red, all 13 siblings green, restored under `sha256`). Suite **17 green / 0 red** on the merged tree
- [ ] **TD-085's remaining reach closes with TD-092** — *Verify: both rows are dispositioned at close; they are one surface, and closing one while leaving the other open would misreport the state*

## Owner-action checklist
- [x] **Reinstall the plugin** — ✓ done 2026-08-25, before the first task started. `/plugin` reports
      1.58.0 and `/orchestrator`'s own invocation header now reads
      `…/lean-flow/1.58.0/skills/orchestrator` against a 1.58.0 repo — **verified from the base-dir
      version the skill prints, not from `/plugin`'s report** (L-021 names that report as the thing not
      to trust). Carried unaddressed through SPRINT-084 and SPRINT-085; this run is the first since
      SPRINT-083 executing procedures that match the repo.

## Decisions (pre-locked)

- **D1** — **T2 is sequenced behind T1 by evidence, not by file overlap.** Round 5 ranks F11 §11
  retention first, but `S11.LOGPAIR` + `S11.WHENITRUNS` *inside that family* are the pair the two
  rounds disagree on 19×. Acting on a ranking that rests on the disputed number is the L-130 shape,
  and TASK-283's own scope forbids it. The dependency was added at promote; it is not in the Backlog rows.
- **D2** — **T1, T3 and T4 are disjoint and may parallel-build from day one** (`docs/research/logs/`,
  `scripts/lib/qa-budget-check.sh` + its fixture, and the log schema + `check-review-depth.sh`). Only
  T2 shares `scripts/lib/` with T3, and they touch different files there — but **both may touch
  `scripts/qa-check.sh`** at their wiring points, so that file is a **single-owner chain: T3 commits
  before T2**, per-hunk staging, never a plain `git add` over the other's WIP (L-042 · L-037).
- **D3** — **TD-092 and TD-085 take one task, not two.** They are one surface: TD-085's remaining
  reach *is* the attended-mode schema gap. Two tasks would edit one file and collide, and would let
  the sprint close with one row green and the other stale on identical work.
- **D4** — **No `epic:` stamp.** This sprint advances no EPIC-014 § Closed-when condition. Stamping it
  would put a row in the epic's member table that contributed nothing to the outcome, which is exactly
  the bookkeeping the epic's close condition reads.
- **D5** — **No new ADR is owed.** Tier assignments come from ADR-029, the gate's authority from
  ADR-033, and the exit/finding contract from ADR-034. Cutting spawn count is an implementation of a
  constraint already decided, not a new hard-to-reverse call.
- **D6** — **Coverage reduction stays out.** `qa-gate-timing.md`'s Recommendation ruled that lever out
  and SPRINT-085 T7 restated the ruling as **standing** while adding Option E. A spawn-count fix that
  quietly drops a check would satisfy T2's headline and violate its second DoD.

## Assumptions

- **A1** — **The gate currently completes on a clean process table and fails under load.** *Confirm:
  SPRINT-085's close ran it twice, first-try, 222 lines, `183 pass, 0 fail` then `168 pass, 0 fail`;
  the preceding session failed three times at 204 / 117 / 100 lines. Both observations are on record.*
- **A2** — **The spawn-count mechanism transfers.** *Confirm: SPRINT-084 T1 cut leg 4 271.5s → 23.6s
  and the conformance sweep 176.6s → 1.9s by spawn count alone, coverage intact — § Round 4.*
- **A3** — **`QA_BUDGET_SECONDS` defaults to 900s and the command ceiling is 600s.** *Confirm: the
  default is stated at `scripts/qa-check.sh:23`; the ceiling was hit live by SPRINT-085 attempt 1.*
- **A4** — **`check-review-depth.sh` anchors on `^Tn · ` and every sprint here is attended.**
  *Confirm: SPRINT-085 T6 tested it directly — SPRINT-084's log at a live path prints
  `no review line -- nothing to verify`, exit 0.*
- **A5** — **The retained review-depth corpus is 9 green cases.** *Confirm: run
  `sh evals/run-review-depth-fixtures.sh` as its own call before extending it — never a wrapper's status.*
- **A6** — **No `[size: L]` task is being pulled.** *Confirm: checked at promote against the Backlog
  rows, before rendering — splitting after the Plan freezes costs a `scope-change`.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-086-guards-that-cannot-fire.md`, rendered
> from `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never
> here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro

_(written at close)_
