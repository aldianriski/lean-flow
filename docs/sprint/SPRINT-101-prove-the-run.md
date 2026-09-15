---
sprint: 101
slug: prove-the-run
epic: EPIC-015
owner: Maintainer
last_updated: 2026-09-15
status: active
plan_commit: 87fdfeb
close_commit:
approval_envelope: goal · scope · acceptance · design · verification · j1-delegation · capabilities · repair-policy · budget · stop-conditions @ 2472fab
update_trigger: sprint execute/close events
---

# SPRINT-101 — Prove the Run

> **Theme:** EPIC-015 has been one condition from closing for three sprints, and it is the same
> condition every time — § Closed-when 1, *"a run ends only at one of five named states"*, which is a
> claim about what a **run** does and cannot be ticked on fixtures. SPRINT-093 closed the guard gap;
> SPRINT-098 built the three guards a real run would be judged by and then parked the run itself at
> `AUTHORITY_BOUNDARY` because no `approval_envelope:` existed. This sprint fires the run. Everything
> else in the Plan is here so the run has honest AFK work to execute and someone positioned to claim
> the mid-Plan artifact if it appears (L-111's two halves).

## Scope

**In:**
1. A genuinely unattended run through `--mode overnight` that reaps and writes a `terminal ·` line
   agreeing with its own per-task lines — EPIC-015 § Closed-when 1, ticked on that artifact.
2. The mid-Plan `unattempted` rollup claimed **if** the run produces one (opportunistic, D3).
3. A guard reconciling a `sprint(NNN)` commit's claimed DoD delta against the ticks it actually made.
4. Two stale records cleared — TD-051's line citation and SPRINT-094's satisfied parked ruling.

**Out (deferred):**
- **The three high-severity rulings** — `TASK-348` (TD-143 host envelope) · `TASK-349` (TD-117/090
  gate cost) · `TASK-345` (TD-150 workdoo pin). All three are `class: decision` with no build, and
  the standing epic-first ruling (SPRINT-094 `/triage`) puts § Closed-when 1 ahead of them.
- **§ Closed-when 5 · 6 · 7 · 8** — bounded repair, typed outcomes, both dogfoods and the freeze
  re-arm. Condition 1 is the one that has foreclosed twice; it travels alone.
- **`TASK-350`** (the 27 one-space `FAIL ` sites) and **`TASK-347`** (`needs-info`).

## Plan

### T1 — Prove § Closed-when 1 with a real unattended run against the repaired reaper `[size: M · risk: high · class: execution · tier: G · HITL · J2]`
Layers: `docs/sprint/` (a seeded Plan a run is permitted to execute)
Depends-on: none — **and deliberately not gated on T3 or T4** (**D2**)
Cites: EPIC-015 § Closed-when 1 · TD-112 · TD-110 · L-179 · L-007 · L-166 · `scripts/night-run.sh` · `scripts/lib/check-night-run-rollup.sh` · `scripts/lib/check-approval-envelope.sh` — the three scripts are **read, never modified**

SPRINT-093's two repairs — the reap gate that ignored the canonical mode name, and the
window/agreement matrix — have never been observed together in one live run; its reviewer reproduced
the chain in a throwaway repo, never in this one. A fixture proves a branch works; only the
motivating artifact proves the branch is reachable (L-166).

**Acceptance:** A genuinely unattended run fires via `--mode overnight`, reaps, and writes a
`terminal ·` line whose state agrees with its own per-task lines — verified against the run's **own
committed log**, not a fixture.

**DoD:**
- [ ] The vehicle is a **seeded** Plan (the SPRINT-090 way), not real work re-declared AFK to make a run fire — reshaping a task to dodge a gate is the failure, not the fix.
- [ ] The seeded Plan is **not all-J2**, which pre-flight item 3 refuses outright under SPRINT-093 T4's STRICT ruling.
- [ ] The `approval_envelope:` covering this run is recorded in **this** sprint's frontmatter before launch, all ten dimensions — its absence is what parked SPRINT-098 T4, and a bracketed placeholder counts as absent. — *Verify: `sh scripts/lib/check-approval-envelope.sh .`*
- [ ] The run fires through `--mode overnight` and **reaps** — the canonical name, the one L-183 found the gate ignoring.
- [ ] The `terminal ·` state **agrees** with the run's own per-task lines, checked against the committed log. — *Verify: `sh scripts/lib/check-night-run-rollup.sh .` over that log*
- [ ] EPIC-015 § Closed-when 1 is ticked **on that artifact** and names it.

### T2 — Claim the mid-Plan artifact if the run produces one `[size: S · risk: low · class: execution · tier: G · HITL · J2]`
Layers: `scripts/night-run.sh` (**only if** the exercise finds a defect — a conditional write to a shared file is still a shared-file write, **D1**) · a sprint Execution Log
Depends-on: T1
Cites: SPRINT-060 T5 scope-change + owner ruling · ADR-016 · L-111

Opportunistic by design, and that design is **not** being changed here (**D3**). The trigger is a run
that stops mid-Plan *for its own reasons*; do not schedule a run to produce one. What pairing with T1
fixes is L-111's other half — a run happening in a sprint where nobody is positioned to claim the
artifact. This has already cost the epic once: SPRINT-060 promoted this task alongside four HITL
tasks, G2 correctly ruled the run interactive, and that ruling foreclosed its only vehicle.

**Acceptance:** A real unattended run that stops mid-Plan leaves a rollup naming the untouched tasks
`unattempted`, verified end-to-end through `scripts/night-run.sh` rather than via `--reap`.

**DoD:**
- [ ] The rollup names every untouched task `unattempted`, end-to-end through the launcher. — *Verify: `sh scripts/lib/check-night-run-rollup.sh .`*
- [ ] If T1's run does **not** stop mid-Plan, this task closes `unattempted` with that stated — never reshaped into a scheduled stop (**D3**).

### T3 — Compare a commit's claimed DoD delta against the ticks it actually made `[size: S · risk: low · class: execution · tier: G · AFK · J1]`
Layers: `scripts/lib/` (a new checker) · `scripts/qa-check.sh` (registry + leg) · `evals/fixtures/` + its harness
Depends-on: none
Cites: CLAUDE.md § Anti-Patterns edit-safety (b) · L-009 · L-165 · L-186 · L-195 · TASK-326

SPRINT-094's `6a6aeac` claimed *"5 of 6 DoD"* and flipped **three** boxes, two of them belonging to
tasks it did not touch. Every downstream signal stayed clean — line caps unchanged, no grep tripped,
the commit body itself said "5 of 6" — and it survived a worktree-isolated review an hour later,
because that reviewer read the script it was pointed at. The class then **recurred** at SPRINT-098,
where an `awk` tick pass flipped two byte-identical sibling lines and only the count disagreed
(L-195). A false green on a DoD is the same silent-false-negative class as a guard that never fires.

**Acceptance:** `sh scripts/qa-check.sh` FAILs with a named finding on a commit whose claimed DoD
figure and actual `[ ] → [x]` transitions disagree, including the case where a commit ticks a DoD
belonging to a task it did not touch.

**DoD:**
- [x] The claim's parseability is **re-derived** by sampling real `sprint(NNN)` subjects, not inherited from the Backlog row (L-097 · L-130). If it is not reliably parseable, scope narrows to the *unattributed tick* half and the task says so.
- [x] Retained must-FAIL: SPRINT-094's `6a6aeac` — claimed "5 of 6", flipped three. — *Verify: the fixture reddens with its named finding*
- [x] Sibling control: a commit whose claim and ticks agree stays **green in the same run** (L-142).
- [x] **Population fixture** (L-186): at least one fixture varies the SELECTION, not the verdict — a commit reached by the other arm of whatever glob/regex picks the examined set.
- [x] Seeded-break discrimination proof under **ONE stated hash convention** (`git show <ref>:<path> | sha256sum`), with the seed verified landed and targeted — assertion count unchanged, line count within one of pristine (L-137 · L-142 · L-169).
- [x] **Registration verified from the registry's side**, not by running the harness: `for h in evals/run-*.sh; do grep -q "$h" scripts/qa-check.sh || echo UNREGISTERED; done` (L-196).
- [x] Outside reviewer, dispatched **worktree-isolated**, handed a **content assertion** — a symbol that must be present in the artifact — never only a branch ref (L-165 · L-168 · L-200).

### T4 — Clear two stale records SPRINT-096 found but did not own `[size: S · risk: low · class: mechanical-ingest · tier: P · AFK · J1]`
Layers: `TECH-DEBT.md` (TD-051) · `docs/sprint/archive/SPRINT-094-guards-for-what-nothing-reads.md`
Depends-on: none
Cites: TD-051 · TD-125 · L-130 · `scripts/lib/check-layers-observed.sh` — read only; TD-051's stale citation points *at* it, and this task edits the citation, never the script

Both were observed directly during SPRINT-096's corpus classification and left alone then only
because each was another row's subject. The Backlog row cites SPRINT-094 at its pre-archive path;
the file moved at the SPRINT-096 close and the real path is the one in `Layers:` above.

**Acceptance:** Neither record still asserts something false — TD-051 cites no stale line number, and
SPRINT-094's satisfied parked ruling is ticked or withdrawn.

**DoD:**
- [x] TD-051 no longer cites `Line 225` for `scripts/lib/check-layers-observed.sh`'s subject-sprint `*/archive/*` skip; the figure is **derived at the point of use**, never copied from the entry (L-130). — *Verify: `grep -n 'Line 225' TECH-DEBT.md` returns nothing*
- [x] SPRINT-094's parked-ruling checkbox (*"archiving SPRINT-092 and SPRINT-093"*, line 187) is ticked or withdrawn — the ruling was taken at the SPRINT-096 promote and both sprints are archived, so the item is satisfied and reads as outstanding.
- [x] The structure around each edit is **re-read whole** afterwards — a list-entry edit can fuse neighbouring entries while grep and line caps stay clean (L-009).

## Owner-action checklist
- [x] **Sign the ten-dimension `approval_envelope:` at G2** and record it in this sprint's frontmatter — goal · scope · acceptance · design · verification · j1-delegation · capabilities · repair-policy · budget · stop-conditions, `@ <sha>`. **This is T1's blocker and nothing else's.** SPRINT-098 T4 parked precisely here; an omitted dimension is a dimension the envelope can silently widen along.
- [ ] Confirm the QA gate is **green** before launch — `night-run.sh` refuses to fire on a red gate (SPRINT-093's green-gate precondition, Part 1). The verdict to read is the line the gate **prints** (`N pass, M fail`), never a status handed back through a wrapper (L-120).

## Approval envelope — signed

> Recorded at the owner's sign-off, pinned `@ 2472fab`. The frontmatter line is the index the
> checker verifies; these are the bounds themselves. A run may proceed **inside these and no
> further** without asking — gates say the Plan is sound, an envelope says the run may act (L-099 ·
> L-151).

| dimension | bound |
|---|---|
| `goal` | fire a genuinely unattended `--mode overnight` run that reaps and writes a `terminal ·` line agreeing with its own per-task lines |
| `scope` | **T1 + T2 only.** Vehicle is a **seeded** Plan (the SPRINT-090 way), never real work re-declared AFK. `scripts/night-run.sh` is read-only for T1; T2 may write it **only if** the exercise finds a defect (D1) |
| `acceptance` | the `terminal ·` state agrees with the run's own per-task lines, verified against its **own committed log**, never a fixture |
| `design` | the seeded Plan is **not all-J2** (pre-flight item 3, STRICT per SPRINT-093 T4); T1 is not gated on T3/T4 (D2); T2 is opportunistic and never scheduled (D3) |
| `verification` | `sh scripts/lib/check-approval-envelope.sh docs/sprint/SPRINT-101-prove-the-run.md` · `sh scripts/lib/check-night-run-rollup.sh docs/sprint/logs/SPRINT-101-prove-the-run.md` — **file arguments**, per the logged `scope-change`; the Plan's `.` form can never pass |
| `j1-delegation` | none outstanding — T3/T4 are complete. The seeded Plan's own tasks carry their own declared classes; an absent class reads as J2 and parks |
| `capabilities` | repo read/write and **local** commits. **No `git push`.** No network. No `reset --hard`, no force, no history rewrite |
| `repair-policy` | ADR-022 mechanical-trigger carve-out **only** — one bounded retry on a named-check FAIL under declared repo policy. Judgment findings **park**. No second retry |
| `budget` | **30 minutes wall-clock**, owner-set. Exhaustion is `BUDGET_STOP`, a named terminal state, not a silent stop |
| `stop-conditions` | ends at **exactly one** of the five named terminal states; **park** any HITL/`J2` step rather than asking, answering or engineering around it; halt clean via `/handoff` when no disjoint AFK work remains |

**Not yet launchable.** The envelope is one of T1's two preconditions; the other is a green gate,
and `night-run.sh` refuses to fire on a red one. See the Execution Log for the standing gate state.
## Decisions (pre-locked)
- **D1 — `scripts/night-run.sh` is owned by T2, conditionally.** T1 **reads** it and never modifies it. T2's `Layers:` claims it only if the exercise finds a defect, and a conditional write to a shared file is still a shared-file write: stage per-hunk and verify `git diff --cached`, never a plain `git add` over another task's WIP (L-042 · L-037).
- **D2 — T1's run is NOT gated on T3 or T4 being green.** If either slips, T1 fires anyway, which is all its acceptance requires. SPRINT-060 foreclosed this task's only vehicle by letting an unrelated ruling decide the run's shape; this row exists so that cannot happen a third time (L-111).
- **D3 — T2 is opportunistic and is not scheduled.** Closing it `unattempted` is a correct outcome; manufacturing a mid-Plan stop is not. Carried forward verbatim from SPRINT-098 D5, unchanged.
- **D4 — T1/T2 are `J2`; T3/T4 are `J1`.** The Plan is deliberately not all-J2 so pre-flight item 3 admits a run at all. `J2 ⇒ HITL`; the converse does not hold, so a J1 task run with a human present stays J1 and stays J1 when the Plan is later run unattended.
- **D5 — tiers are declared here, not inferred (ADR-029).** T1/T2/T3 are Tier **G**: T3 builds a guard whose false negative is silent by construction, and T1/T2 are the exercise-on-real-input half for a guard that has only ever seen fixtures. T4 is Tier **P** — prose and records, G1 plus a read-through.

## Assumptions
- **A1** — The gate can reach a green verdict on this host within the 600 s ceiling. *Confirm: the QA_FULL run started at this promote; read its printed verdict line. Five runs at the SPRINT-099 close spanned 523–560 s against a 520 s budget, so a truncation is a live possibility and is now legible rather than silent (TD-117 · TD-128).*
- **A2** — T3's DoD claim is machine-readable from the commit subject/body in the form this repo already writes it. **UNCONFIRMED** — T3's first DoD re-derives it by sampling real subjects rather than trusting this line (L-130).
- **A3** — The `check-night-run-rollup.sh` and `check-approval-envelope.sh` paths T1's `Verify:` clauses name still exist and still verdict. *Confirm: both were exercised at the SPRINT-098 close; re-run each once at G2 before the launch.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-101-prove-the-run.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here
> (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. Route the buckets to durable homes (STANDARD §10). -->
