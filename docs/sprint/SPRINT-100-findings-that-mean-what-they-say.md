---
sprint: 100
slug: findings-that-mean-what-they-say
owner: Maintainer
last_updated: 2026-09-13
status: active
plan_commit: 7e27c02
close_commit: [sha — set at close]
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
- [ ] **EXISTS** (TD-097): a bare basename resolves against the known script roots (`scripts/`, `scripts/lib/`, `evals/`) before being called absent, and *unresolvable reference* is reported as a **different finding** from *method absent*.
- [ ] **REACHES** (TD-087): matching is anchored to path boundaries, and a target whose only occurrence sits in an **exclusion idiom** is rejected. Both reproduce today — an exclusion reads `confirmed reachable`, and `src/db` matches `src/dbtools/`.
- [ ] **The archive exemption becomes a fixture, not an exemption.** Archived Verify clauses hold bare-basename references that would every one of them trip leg (1) — re-derive the count, do not inherit it (L-130). That exemption is why this looked clean for five sprints.
- [ ] **Pointed at its motivating population, not fixtures alone (L-166 · L-186):** the live corpus reports **0 confirmed targets**, a vacuous pass in the denominator sense (L-156), so a fixture-only proof proves nothing here. Vary the **selection**: a target reached through the archive arm, and a clause naming two methods.
- [ ] Retained must-FAIL **per leg**, each failing with its **own named finding**, plus a sibling control green in the same run (L-058 · L-142).
- [ ] **Seeded-break discrimination proof** under ONE stated hash convention (L-169 · L-187).
- [ ] **Outside reviewer, worktree-isolated** (L-165 · L-168).

### T2 — Normalise checkbox state before diffing § Plan, so ticking a DoD is not an unaccounted Plan edit `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/conformance-engine.sh` (the `plan-edited-after-freeze` assertion) · `evals/run-conformance-engine-fixtures.sh` · `evals/fixtures/conformance-engine/`
Depends-on: none
Cites: TD-105 · L-166 · L-142 · L-169 · ADR-029
**Tier G** (ADR-029) — and the incentive is **inverted**, which is worse than a plain false positive:
the check rewards sprints that shifted scope and penalises sprints that did not, and the only ways to
clear it are to log a `scope-change` that never happened or to leave the close gate red.

**Acceptance:** A sprint that ticked every DoD and changed no Plan text passes; a sprint that changed
Plan text without logging a `scope-change` still fails.

**DoD:**
- [ ] § Plan is compared with **checkbox state normalised**, so a tick is not a diff. No normalisation exists anywhere in that file today — re-derive before building (L-091).
- [ ] A genuine **text** change still demands its `scope-change` entry. The check must keep doing what it was written to do.
- [ ] **The control fixture is the load-bearing one here, not the must-FAIL** — a fixture that ticks every box and must stay green is the case that is wrong today. Retain both, each failing with its own named finding.
- [ ] **Pointed at its motivating artifact (L-166):** SPRINT-087's § Plan is byte-identical to its `plan_commit` once checkboxes are normalised — 28 ticks, zero text changes — and still produced `plan-edited-after-freeze` plus 8 × `scope-change-logged-after-plan-edit`, **9 of that run's 17 findings**. Re-derive those figures at build.
- [ ] **Seeded-break discrimination proof** under ONE stated hash convention (L-169 · L-187).
- [ ] **Outside reviewer, worktree-isolated** (L-165 · L-168).

### T3 — Give `check-system-verify-block.sh` a positional link, and point it at live logs `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `evals/lib/check-system-verify-block.sh` · `evals/run-system-verify-fixtures.sh` · `evals/fixtures/system-verify/` · `TECH-DEBT.md` (TD-086's stale Evidence half is corrected, not worked around)
Depends-on: none — disjoint from every other task (**D3**)
Cites: TD-086 · L-166 · L-142 · L-169 · ADR-033 · ADR-029 · `scripts/qa-check.sh` (named in the DoD only to correct a stale claim about it — cited, never touched)
**Tier G** (ADR-029) — this is the silent close ADR-033 exists to stop, occurring inside the mechanism
built to stop it.

**Acceptance:** An unresolved `system-verify` FAIL is not cleared by an *earlier* entry's ruling, and
the guard has been shown to reach this repository's own logs.

**DoD:**
- [ ] `has_close` and `has_ruling` are bound to **their own entry**. They are whole-file greps today with no positional link, so an earlier ruling masks a later unresolved FAIL — reproduced in both orderings at an earlier SPRINT-084 review: `PASS`, exit 0.
- [ ] **The guard is pointed at live logs.** Every invocation in its harness points at a fixture directory, never at `docs/sprint/logs/`; a guard that has only ever seen `evals/fixtures/` has not been shown to reach this repository (L-166), and its own sibling harness carries that sentence as a comment.
- [ ] **A two-entry log fixture exists.** The retained fixtures never exercise one — add it, plus a sibling control green in the same run, each failing with its own named finding.
- [ ] **TD-086's row is corrected where it is stale, not worked around:** its Evidence claims the checker appears nowhere in the gate script, but its harness was registered in `eval_harnesses_always` back at SPRINT-068; and the checker lives at `evals/lib/`, not `scripts/lib/` as its own Summary says. The substance (fixtures only) stands.
- [ ] **Seeded-break discrimination proof** under ONE stated hash convention (L-169 · L-187).
- [ ] **Outside reviewer, worktree-isolated** (L-165 · L-168).

### T4 — Give the conformance engine's informational findings their own token `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `scripts/qa-check.sh` (leg 2f-ter relay — the distinction is drawn gate-side, where the policy lives; scope-change 2026-09-13) · `evals/run-conformance-engine-fixtures.sh`
Depends-on: **T2** — shared `evals/run-conformance-engine-fixtures.sh` (**D1**; the engine-file edge dissolved when T4 moved gate-side — scope-change 2026-09-13)
Cites: TD-146 · L-120 · L-145 · ADR-029
**Tier G** (ADR-029, defaulted **up**): the row declares no tier, and a defect here misreports the
verdict itself — the failure is silent by construction, which is the test ADR-029 applies.

**Acceptance:** A reader of `scripts/qa-check.sh`'s output can tell which `FAIL` lines the verdict counts and
which it does not, **without reading `scripts/qa-check.sh`**.

**DoD:**
- [ ] Informational findings no longer print the same `FAIL ` prefix as gating ones. Today the printed verdict and the visible FAIL lines disagree with nothing marking the difference — `QA-CHECK: 230 pass, 0 fail` over 4 FAIL lines at the SPRINT-097 close.
- [ ] **The policy is unchanged — only the report.** Which findings gate is untouched; leg 2f-ter keeps its informational dispositions deliberately. A DoD that changes what the verdict *counts* has exceeded this task.
- [ ] **The pass/fail arithmetic is asserted unchanged** across the change (**A3**): same counts on the same tree before and after, so a report-only change is proven report-only rather than asserted (L-145 — a moved count is a changed gate).
- [ ] Retained must-FAIL + sibling control: an informational finding and a gating one in the same run are distinguishable from the printed output alone.
- [ ] **Seeded-break discrimination proof** under ONE stated hash convention (L-169 · L-187).
- [ ] **Outside reviewer, worktree-isolated** (L-165 · L-168).

### T5 — Widen the conformance-coverage sweep's matcher, then re-run Round 4 `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `docs/research/conformance-coverage.md` · `docs/research/logs/conformance-coverage.md`
Depends-on: **T4** — a sweep re-run against a token convention that is about to change measures nothing (**D2**)
Cites: TD-089 · L-108 · L-130 · ADR-029
**Tier P** (ADR-029) — the subject is a research round's prose, not a gate checker. It is the one
member of the SPRINT-097 cluster that is not a guard, which is why it sits outside the Tier G group.

**Acceptance:** Round 4's "0 artefacts remain" conclusion rests on a matcher that was re-measured, not
merely re-written.

**DoD:**
- [ ] The actionable-findings matcher sees `S<N>.<CODE>` findings, not only the bare-kebab convention. The kebab convention is the **minority** one — re-derive both counts at build rather than inheriting the figures recorded at SPRINT-097 (**A2** · L-130).
- [ ] **Round 4 is re-run, not merely re-matched.** TD-089's own re-file condition: widening the regex without re-running leaves the conclusion resting on a matcher nobody re-measured — L-108's shape in a sweep rather than a guard.
- [ ] The stranger corpus's 2 unnamed FAIL lines (the README-footer rule and the two-doc-row base rule) are **named** by the widened sweep, **or their absence is explained**. A judgment tick, and it says so — no mechanical check reaches "the explanation is adequate".
- [ ] Read-through by a second pair of eyes (Tier P — no seeded-break proof, no isolated reviewer; inventing one to look rigorous is the failure, not the fix).

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

## Retro

**Retrieval check** —

**Cost** —

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
