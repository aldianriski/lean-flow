---
sprint: 100
slug: findings-that-mean-what-they-say
owner: Maintainer
last_updated: 2026-09-13
status: closed
plan_commit: 7e27c02
gates_signed: G1,G2 @ 440ff3b
close_commit: 1774b05
update_trigger: sprint execute/close events
---

# SPRINT-100 — Findings That Mean What They Say

> **Theme:** SPRINT-097 found five guards whose *detection logic* was sound while the *set they ran
> over* was not, and ruled them a cluster to be scheduled together. SPRINT-099 pulled one member
> forward and left the rest. This is the sprint that ruling named. The thread through all five is
> narrower than "guards are wrong": each one **emits a finding that is not true of its own subject** —
> a mention read as a use, a tick read as a scope change, an earlier ruling masking a later failure,
> a matcher blind to the convention its corpus actually uses, and a report that cannot tell a gating
> finding from an informational one. A guard that reports the wrong thing about the right file is
> worse than an absent guard, because its output is believed.

## Scope

**In:**
1. `check-verify-reaches.sh` fixed on **both** legs — EXISTS resolving a basename, REACHES matching
   use rather than mention — with the archive exemption that hid it for five sprints turned into a
   fixture (T1 · TD-087 · TD-097).
2. A ticked DoD stops reading as an unaccounted Plan edit, without weakening the check against a real
   text change (T2 · TD-105).
3. `check-system-verify-block.sh` given a positional link between a FAIL and the ruling that clears
   it, and pointed at live logs for the first time (T3 · TD-086).
4. The conformance engine's **informational** findings given their own token, so the printed verdict
   and the visible `FAIL` lines stop disagreeing with nothing marking the difference (T4 · TD-146).
5. The conformance-coverage sweep's matcher widened to the convention its corpus actually uses, and
   **Round 4 re-run** rather than merely re-matched (T5 · TD-089).

**Out (deferred):**
- **EPIC-015 § Closed-when 1** — `TASK-319` + `TASK-188` stay paired in the Backlog a fourth sprint.
  Their precondition is a host that can finish a gate, and SPRINT-099 measured five whole-gate runs
  spanning **523–560 s around a 520 s budget**: the gate is now *honest* about truncating, which is
  not the same as finishing. Promoting them again would park them again.
- **The gate's cost.** `TASK-349` (TD-117 · TD-090) is filed and P1, and is a decision task, not a
  patch. T4 touches the engine's *report*; nothing here touches its runtime.
- **`TD-143`'s cost half** — `TASK-348`, filed at this promote. The measurement is done; what remains
  is a ruling about the host envelope, not work on the gate.
- **Rewriting the informational policy.** T4 changes the REPORT, never which findings gate. Leg
  2f-ter keeps 27 of 43 unbuilt dispositions informational on purpose, and gating them would hold the
  gate permanently red over tracked coverage gaps.

## Plan

### T1 — Fix both legs of `check-verify-reaches.sh`: EXISTS resolves a basename, REACHES matches use not mention `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-verify-reaches.sh` · `evals/run-verify-reaches-fixtures.sh` · `evals/fixtures/verify-reaches/`
Depends-on: none — disjoint from every other task (**D3**)
Cites: TD-087 · TD-097 · L-136 · L-156 · L-166 · L-186 · L-169 · ADR-029
**Tier G** (ADR-029) — a REACHES false positive is a contract false negative: the criterion goes green
while saying nothing about its subject, which is **L-136's shape occurring inside the guard built to
detect L-136**.

**Acceptance:** A `Verify:` clause naming a script by basename resolves; a clause whose only reference
to its target *prunes* it is reported unreachable; and neither verdict rests on the archive exemption.

**DoD:**
- [x] **EXISTS** (TD-097): a bare basename resolves against the known script roots (`scripts/`, `scripts/lib/`, `evals/`) before being called absent, and *unresolvable reference* is reported as a **different finding** from *method absent*.
- [x] **REACHES** (TD-087): matching is anchored to path boundaries, and a target whose only occurrence sits in an **exclusion idiom** is rejected. Both reproduce today — an exclusion reads `confirmed reachable`, and `src/db` matches `src/dbtools/`.
- [x] **The archive exemption becomes a fixture, not an exemption.** Archived Verify clauses hold bare-basename references that would every one of them trip leg (1) — re-derive the count, do not inherit it (L-130). That exemption is why this looked clean for five sprints.
- [x] **Pointed at its motivating population, not fixtures alone (L-166 · L-186):** the live corpus reports **0 confirmed targets**, a vacuous pass in the denominator sense (L-156), so a fixture-only proof proves nothing here. Vary the **selection**: a target reached through the archive arm, and a clause naming two methods.
- [x] Retained must-FAIL **per leg**, each failing with its **own named finding**, plus a sibling control green in the same run (L-058 · L-142).
- [x] **Seeded-break discrimination proof** under ONE stated hash convention (L-169 · L-187).
- [x] **Outside reviewer, worktree-isolated** (L-165 · L-168).

### T2 — Normalise checkbox state before diffing § Plan, so ticking a DoD is not an unaccounted Plan edit `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/conformance-engine.sh` (**both** freeze assertions — `assert_S9_PLANFROZEN` *and* `assert_S9_SCOPECHANGE`; TD-105's Evidence names both findings, and fixing one leaves 8 of its 9 firing — scope-change 2026-09-13) · `evals/run-sprint-family-fixtures.sh` (the git-backed home for the `assert_S9_*` family — scope-change 2026-09-13)
Depends-on: none
Cites: TD-105 · L-166 · L-142 · L-169 · ADR-029
**Tier G** (ADR-029) — and the incentive is **inverted**, which is worse than a plain false positive:
the check rewards sprints that shifted scope and penalises sprints that did not, and the only ways to
clear it are to log a `scope-change` that never happened or to leave the close gate red.

**Acceptance:** A sprint that ticked every DoD and changed no Plan text passes; a sprint that changed
Plan text without logging a `scope-change` still fails.

**DoD:**
- [x] § Plan is compared with **checkbox state normalised**, so a tick is not a diff. No normalisation exists anywhere in that file today — re-derive before building (L-091).
- [x] A genuine **text** change still demands its `scope-change` entry. The check must keep doing what it was written to do.
- [x] **The control fixture is the load-bearing one here, not the must-FAIL** — a fixture that ticks every box and must stay green is the case that is wrong today. Retain both, each failing with its own named finding.
- [x] **Pointed at its motivating artifact (L-166):** SPRINT-087's § Plan is byte-identical to its `plan_commit` once checkboxes are normalised — 28 ticks, zero text changes — and still produced `plan-edited-after-freeze` plus 8 × `scope-change-logged-after-plan-edit`, **9 of that run's 17 findings**. Re-derive those figures at build.
- [x] **Seeded-break discrimination proof** under ONE stated hash convention (L-169 · L-187).
- [x] **Outside reviewer, worktree-isolated** (L-165 · L-168).

### T3 — Give `check-system-verify-block.sh` a positional link, and point it at live logs `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `evals/lib/check-system-verify-block.sh` · `evals/run-system-verify-fixtures.sh` · `evals/fixtures/system-verify/` · `TECH-DEBT.md` (TD-086's stale Evidence half is corrected, not worked around)
Depends-on: none — disjoint from every other task (**D3**)
Cites: TD-086 · L-166 · L-142 · L-169 · ADR-033 · ADR-029 · `scripts/qa-check.sh` (named in the DoD only to correct a stale claim about it — cited, never touched)
**Tier G** (ADR-029) — this is the silent close ADR-033 exists to stop, occurring inside the mechanism
built to stop it.

**Acceptance:** An unresolved `system-verify` FAIL is not cleared by an *earlier* entry's ruling, and
the guard has been shown to reach this repository's own logs.

**DoD:**
- [x] `has_close` and `has_ruling` are bound to **their own entry**. They are whole-file greps today with no positional link, so an earlier ruling masks a later unresolved FAIL — reproduced in both orderings at an earlier SPRINT-084 review: `PASS`, exit 0.
- [x] **The guard is pointed at live logs.** Every invocation in its harness points at a fixture directory, never at `docs/sprint/logs/`; a guard that has only ever seen `evals/fixtures/` has not been shown to reach this repository (L-166), and its own sibling harness carries that sentence as a comment.
- [x] **A two-entry log fixture exists.** The retained fixtures never exercise one — add it, plus a sibling control green in the same run, each failing with its own named finding.
- [x] **TD-086's row is corrected where it is stale, not worked around:** its Evidence claims the checker appears nowhere in the gate script, but its harness was registered in `eval_harnesses_always` back at SPRINT-068; and the checker lives at `evals/lib/`, not `scripts/lib/` as its own Summary says. The substance (fixtures only) stands.
- [x] **Seeded-break discrimination proof** under ONE stated hash convention (L-169 · L-187).
- [x] **Outside reviewer, worktree-isolated** (L-165 · L-168).

### T4 — Give the conformance engine's informational findings their own token `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `scripts/qa-check.sh` (leg 2f-ter relay — the distinction is drawn gate-side, where the policy lives; scope-change 2026-09-13) · `evals/run-conformance-engine-fixtures.sh`
Depends-on: **T2** — ordering retained deliberately, though **no shared file remains** (**D1**): the engine-file edge dissolved when T4 moved gate-side, and the fixtures-harness edge dissolved when T2's fixtures moved to `run-sprint-family-fixtures.sh`. Kept because D2 sequences T5 behind T4, and because both tasks read the same engine output surface — scope-change 2026-09-13
Cites: TD-146 · L-120 · L-145 · ADR-029
**Tier G** (ADR-029, defaulted **up**): the row declares no tier, and a defect here misreports the
verdict itself — the failure is silent by construction, which is the test ADR-029 applies.

**Acceptance:** A reader of `scripts/qa-check.sh`'s output can tell which `FAIL` lines the verdict counts and
which it does not, **without reading `scripts/qa-check.sh`**.

**DoD:**
- [x] Informational findings no longer print the same `FAIL ` prefix as gating ones. Today the printed verdict and the visible FAIL lines disagree with nothing marking the difference — `QA-CHECK: 230 pass, 0 fail` over 4 FAIL lines at the SPRINT-097 close.
- [x] **The policy is unchanged — only the report.** Which findings gate is untouched; leg 2f-ter keeps its informational dispositions deliberately. A DoD that changes what the verdict *counts* has exceeded this task.
- [x] **The pass/fail arithmetic is asserted unchanged** across the change (**A3**): same counts on the same tree before and after, so a report-only change is proven report-only rather than asserted (L-145 — a moved count is a changed gate).
- [x] Retained must-FAIL + sibling control: an informational finding and a gating one in the same run are distinguishable from the printed output alone.
- [x] **Seeded-break discrimination proof** under ONE stated hash convention (L-169 · L-187).
- [x] **Outside reviewer, worktree-isolated** (L-165 · L-168).

### T5 — Widen the conformance-coverage sweep's matcher, then re-run Round 4 `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `docs/research/conformance-coverage.md` · `docs/research/logs/conformance-coverage.md` · `evals/run-foreign-repo-fixtures.sh`
Depends-on: **T4** — a sweep re-run against a token convention that is about to change measures nothing (**D2**)
Cites: TD-089 · L-108 · L-130 · L-186 · L-198 · ADR-029
**Tier P for the two research docs · Tier G for the harness** (ADR-029's re-tier-on-discovery clause;
scope-change 2026-09-13). D4 ruled the whole task Tier P on the reading that its subject is a research
round's prose. That holds for the two docs and not for `evals/run-foreign-repo-fixtures.sh`, which is
an eval harness — Tier G by name, and the very guard whose false-negative this task exists to fix. The
harness edit therefore carries the full Tier G bar; the two docs carry a read-through.

**Acceptance:** Round 4's "0 artefacts remain" conclusion rests on a matcher that was re-measured, not
merely re-written.

**DoD:**
- [x] The actionable-findings matcher sees `S<N>.<CODE>` findings, not only the bare-kebab convention. The kebab convention is the **minority** one — re-derive both counts at build rather than inheriting the figures recorded at SPRINT-097 (**A2** · L-130). — *operative half met: both sweeps parse either convention, 6/9 → 9/9. **The parenthetical premise is FALSE and is ticked as corrected, not as satisfied** (owner ruling, scope-change above): re-derived three ways, kebab is the MAJORITY (58 of 73 call sites · 6 of 9 corpus lines · 12 of 12 live). Of the row's two figures only one was stale (195 → 216); 38 is unchanged, and this task's own first draft wrote 43 by silently changing population — caught by a second reader, recorded in Round 6.*
- [x] **Round 4 is re-run, not merely re-matched.** TD-089's own re-file condition: widening the regex without re-running leaves the conclusion resting on a matcher nobody re-measured — L-108's shape in a sweep rather than a guard. — *re-run against a rebuilt stranger, not re-matched over a stored report. Verdict reproduces unchanged (9 findings / 5 rules / 0 artefacts, tally re-derived) and is now measured over 9 of 9 rather than 6 of 9. Written up as **Round 6**.*
- [x] The stranger corpus's 2 unnamed FAIL lines (the README-footer rule and the two-doc-row base rule) are **named** by the widened sweep, **or their absence is explained**. A judgment tick, and it says so — no mechanical check reaches "the explanation is adequate". — ***Judgment tick, and it says so.*** *Named, then cleared rather than merely listed: the remediation block now applies §3's README `<sub>` footer and §6's two Base docs, and the `-z` empty-set assertion holds over the full population. Count corrected on the record — 2 **rules**, **3** lines.*
- [x] Read-through by a second pair of eyes (Tier P — no seeded-break proof, no isolated reviewer; inventing one to look rigorous is the failure, not the fix). — *read-through returned ACCURATE-WITH-CORRECTIONS and caught a real error (the 43-vs-38 population slip), applied. **The harness half additionally took the full Tier G bar** — seeded-break proof under one `git hash-object` convention plus a worktree-isolated adversarial reviewer, which returned two confirmed findings: one fixed, one routed to TD-156. That is the re-tier at work, not a Tier P DoD inflated to look rigorous.*

## Owner-action checklist
<!-- none this sprint: no unattended run, no external credential, no envelope. -->

## Decisions (pre-locked)
- **D1 — `scripts/lib/conformance-engine.sh` is owned T2 → T4.** T2's change is a localised
  normalisation inside one assertion; T4's touches finding emission across the file. Smaller and more
  localised goes first, so T4 rebases onto a settled file rather than the reverse. Stage per-hunk and
  verify `git diff --cached`; never a plain `git add` over the other's WIP (L-042 · L-037).
- **D2 — T5 runs after T4, and this is a real dependency, not politeness.** T5 re-runs Round 4 to
  measure which findings a matcher sees. T4 changes the token those findings carry. Re-running the
  sweep first would measure a convention about to change and bake the stale figure into a research
  round — the exact shape TD-089's re-file condition exists to prevent.
- **D3 — T1 and T3 are disjoint** (different files, no `depends-on`) and are therefore eligible for a
  **parallel worktree-isolated build**, at the coordinator's discretion. T2 → T4 → T5 is the one
  ownership chain.
- **D4 — T5 is Tier P and `J2`, deliberately.** It is the cluster's only non-guard, and its final DoD
  is a judgement — whether an absence is adequately explained — which no mechanical check reaches.
  Declaring it Tier G to match its four siblings would buy ceremony, not assurance.
- **D5 — T4's tier is defaulted UP.** `TASK-343` declares none. ADR-029 says default up when unsure,
  and a misreported verdict fails silently, so it is Tier G rather than Tier X.

## Assumptions
- **A1** — **TD-086's Evidence is partly STALE** and T3's DoD says so: the harness *is* registered in
  `eval_harnesses_always`, and the checker lives at `evals/lib/`. *Confirm: read the row against disk
  before building on it (L-091 · L-130).*
- **A2** — TD-089's convention counts were derived at SPRINT-097 T1 and are a figure in a row.
  *Confirm: re-derive both at build; quote neither from the row (L-130).*
- **A3** — That T4 can change the informational token **without** changing what the verdict counts.
  UNCONFIRMED and load-bearing. *Confirm: assert the pass/fail arithmetic is identical on the same
  tree before and after — a moved count is a changed gate (L-145).*
- **A4** — That `check-verify-reaches.sh` still reports **0 confirmed targets** on the live corpus.
  T1's vacuity argument rests on it. *Confirm: re-derive at build; if the figure is now non-zero, the
  denominator argument changes and T1's DoD 4 must be re-read before it is ticked.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-100-findings-that-mean-what-they-say.md`,
> rendered from `templates/sprint-log.md.template` and created lazily at the first entry. Append
> there, never here (STANDARD §9 · ADR-014). **Do not paste a run-complete header at line start into
> that file** — it arms `check-night-run-rollup.sh`, which parses it (L-197).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `evals/run-foreign-repo-fixtures.sh` | T5 | Both FAIL-line sweeps read either finding convention through one shared `sweep_findings`/`sweep_gate`; population reconciliation fails by name on a shape neither arm parses; engine bootstrap failures (one- **and** two-space) routed to `engine-level-failure`; stranger's remediation extended so the newly-visible findings clear. WHY: the sweep examined 6 of 9 FAIL lines while asserting a property over all 9 (TD-089) | med — Tier G guard whose verdict on a real corpus changes | 17 fixtures incl. 7 retained for the sweep itself; seeded-break proof under `git hash-object`; worktree-isolated adversarial review |
| `docs/research/logs/conformance-coverage.md` | T5 | Round 6 appended — the Round 4 re-run, the three-route A2 re-derivation, and the population/bootstrap additions. WHY: TD-089's re-file condition makes a widened regex without a re-run its own defect | low | read-through (Tier P), figures re-derived independently by the reviewer |
| `docs/research/conformance-coverage.md` | T5 | § Artefacts verdict sentence corrected in place to point at Round 6. WHY: the parent stated `9 actionable, 0 artefacts` with no sign its mechanical half covered two thirds of the population | low | doc at 130 lines, still exactly at cap |

## Retro

**Retrieval check** — The rules that fired did so because an *instrument* fired them, not because
anyone recalled them. L-186 (population blindness) was cited in T5's own dispatch brief and still did
not stop the builder from anchoring a new detector at two spaces while a one-space emission existed in
the file it swept; the isolated reviewer found it. L-198 was applied deliberately three times and
earned its keep each time — most sharply when a second reader re-derived `38` against this
coordinator's `43` and exposed a population change mid-sentence, **inside the round whose subject is
matchers blind to populations**. L-170's contamination trap fired **three** times in one session
(`TD-9xx`, `L-999`, `TASK-905`–`908`), which is the strongest evidence yet that id-derivation still
feels like bookkeeping rather than querying. The one rule that reached nobody until the gate said so:
recording the `review ·` line is a separate act from doing the review, and two of five tasks skipped it.

**Cost** — Five tasks, four waves, ~29 DoD. Two full gate runs at the close (one red, one green) at
~9 min each. Four dispatched agents (two builders' rounds, one worktree-isolated adversarial reviewer,
one prose reviewer) plus two historical engine runs against checked-out trees. The expensive part was
not building; it was **verifying**, and every hour of it returned a defect.

**Worked**

- **The isolated adversarial review is now unambiguously load-bearing.** Across this sprint, *every*
  guard defect was found by an independent pass or a disagreeing second number, and **none** by
  recalling the governing rule, which was loaded and on screen each time. T1's reviewer caught a real
  regression; T3's caught a self-contradiction; T4's second reviewer found the finding that became
  TD-157; T5's found two, one of which left a gate silently clean on a crashed engine.
- **Tier declaration as a live decision rather than a label.** T5 was promoted Tier P on a defensible
  reading (its subject is research prose) that turned out false the moment the work started — the
  matcher lives in an eval harness. Re-tiering on discovery cost one ruling and bought the seeded-break
  proof and the isolated review that then found the one-space hole.
- **Ticking a DoD stopped being a scope change, and the proof arrived for free.** T2's fix was
  confirmed not by its own fixtures but by this sprint's own close: 29 boxes ticked, gate green,
  `S9.SCOPECHANGE` silent. The consumer-path check (L-016) that the repo usually has to construct.
- **Refusing to invent a mechanism.** T5's reviewer found 8 sites emitting prose where a path is
  expected; the fix would have been a path-vs-prose heuristic inside a guard whose purpose is not to
  lie. Filed as TD-156 instead, with the reason on the record.

**Friction**

- **Two tasks shipped a defect their own green suite could not show** (T2's Acceptance gap, T5's
  one-space hole). Both were found by an instrument built *outside* the task's declared scope. A green
  suite scoped to what the author declared is not evidence about what sits between declarations.
- **A review was very nearly performed against the wrong artifact** — the coordinator dispatched an
  isolated reviewer at a branch ref whose tip equalled `main`, because the builder had correctly been
  told not to commit. Caught by the *other* reviewer. → L-200.
- **A figure blocked a DoD box for two sprints because it named no commit.** TD-105's `9 of 17` cost a
  parked criterion; re-derived here, the 9 is exact and the 17 exists at no commit. → L-201.
- **The close's own gate found governance silence the humans-plus-agents did not** — T2 and T5 both
  merged without a `review ·` line, in both cases over a review that genuinely happened.
- **`run-sprint-family-fixtures.sh` (~67 full-repo engine walks) could not be run to completion on this
  host**, three kills; the §9 evidence came from a scoped runner and the integrated gate instead.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)

Both filed at this close:
- **`L-200`** — hand a dispatched reviewer a **content assertion**, never only a path or a ref; a
  ref-based handoff of uncommitted work is silently empty and every downstream proof then certifies
  the wrong file.
- **`L-201`** — a count frozen into a durable artifact must **name the commit it was taken at**, and a
  *ratio* freezes two numbers of which usually only one belongs to the defect.

Neither is promoted yet (`count: 1` each). L-201 sits beside the cross-check family already promoted
into CLAUDE.md; L-200 belongs with the dispatch rules if it recurs.
