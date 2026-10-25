---
sprint: 142
slug: keep-every-fact
owner: Maintainer
last_updated: 2026-10-25
status: closed
gates_signed: G1,G2 @ c123f2c0
plan_commit: 07f10d29
update_trigger: sprint execute/close events
---

# SPRINT-142 — Keep Every Fact

> **Theme:** The humanizer pass that runs inside other skills is lean-flow's last measured defect on the consumer path:
> on one fixed sample it added or dropped a fact in 3 of 6 runs (TD-274), so every writing job lean-flow composes can
> lose a claim while it removes AI tells. This sprint makes the embedded child check its own facts and proves the fix over
> several runs of a retained input. It also promotes L-234, the scope-change slip that reddened system verify twice.

## Scope

**In:** promote L-234 into a durable rule and one generic sprint-log template line (T1) · the embedded humanizer's fact
self-check, a retained sample, and a 3-run baseline plus a 6-run proof at 0 of 6 (T2).
**Out (deferred):** the standalone humanizer (it kept every fact) · a caller-side fact check · any new qa-check leg or
checker · TASK-489 (blocked on the owner's workdoo bump) · TASK-367, TASK-402, TASK-498 (blocked) · TASK-507 (`needs-info`).

## Members

- docs/work/todo/TASK-512-promote-l-234-scope-change-declares-what-it-names.md
- docs/work/todo/TASK-511-embedded-humanizer-keeps-every-fact.md

## Plan

### T1 — Promote L-234 into a durable rule and a template line `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/LEARNINGS.md` · `skills/lean-doc-generator/templates/sprint-log.md.template` · `CHANGELOG.md`
  · `docs/work/todo/TASK-512-promote-l-234-scope-change-declares-what-it-names.md`
  · `docs/work/in_progress/TASK-512-promote-l-234-scope-change-declares-what-it-names.md`
  · `docs/work/done/TASK-512-promote-l-234-scope-change-declares-what-it-names.md`
Depends-on: none
Cites: `TASK-512` · L-234 · `merge-check.ts` · `check-sprint-by-reference.ts` · STANDARD §10

Both sightings reached system verify because nothing ran the scope-change leg when the entry was written. The rule goes
where the CLAUDE.md edit-safety line already points; the template line carries the adopter-neutral half.

**Acceptance:** L-234 is promoted with a pointer and a disposition, and the template's scope-change guidance carries the
generic line with no lean-flow path.

### T2 — Make the embedded humanizer check its own facts, proven 0 of 6 `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/humanizer/references/embedded.md` · `evals/fixtures/humanizer/` · `TECH-DEBT.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-511-embedded-humanizer-keeps-every-fact.md`
  · `docs/work/in_progress/TASK-511-embedded-humanizer-keeps-every-fact.md`
  · `docs/work/done/TASK-511-embedded-humanizer-keeps-every-fact.md`
Depends-on: T1
Cites: `TASK-511` · TD-274 · L-252 · L-248 · L-249 · `skills/humanizer/SKILL.md`

The child brief lists the text's facts before it rewrites and checks its final against that list (owner ruling at
intake). A retained sample makes the before and after comparable across later changes. Depends on T1 only for
`CHANGELOG.md` order (D1).

**Acceptance:** six separate headless embedded runs on the retained sample, each judged from its own transcript, keep
every listed fact, after a 3-run baseline on the same sample has shown the old rate.

## Owner-action checklist

- [ ] T2: read the retained sample and its fact list before the runs start (the fact list is the comparand).
- [ ] Close: push the release.

## Decisions (pre-locked)

- **D1** — `CHANGELOG.md` is shared: T1 opens `## [Unreleased]`, T2 adds after it, so T2 depends on T1. Execution is
  sequential in the main tree. Status moves, log and sprint-file edits commit as bare `sprint(142):` (L-238).
- **D2** — One `consequence · Tn ·` line per task in this sprint's log.
- **D3** — Both tasks change a shipped file, so each takes the Codex review → fix → re-review loop; cap 2 rounds, a third
  only by owner ruling.
- **D4** — Headless runs go in the trusted `D:\Research\workdoo` copy with long paths (L-249), judged from each run's own
  tool calls and final result (L-248); never `D:\Project\workdoo`. Every brief names secret files as off-limits (L-247).
- **D5** — After appending any scope-change entry this sprint, the coordinator runs the scope-change leg before committing
  (the rule T1 lands).

## Assumptions

- **A1** — `embedded.md` is a reference file, uncounted by ADR-006's SKILL.md cap; `skills/humanizer/SKILL.md` (117/140)
  is not edited. *Confirm: T2 G2.*
- **A2** — The retained sample is an input for a manual run protocol, not a gate leg: nothing is wired into qa-check.
  *Confirm: T2 G2.*
- **A3** — If 0 of 6 is not met after 2 review rounds, the owner rules and TD-274 stays open with the measured rate.
  *Confirm: owner at T2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-142-keep-every-fact.md`](logs/SPRINT-142-keep-every-fact.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/LEARNINGS.md` | T1 · close | L-234 promoted to edit-safety; L-254, L-255 filed | Low | Codex R1 CLEAR; prose-density 26/0 |
| `skills/lean-doc-generator/templates/sprint-log.md.template` | T1 | scope-change heading and path line | Low | 3 sprint-log harnesses green |
| `skills/humanizer/references/embedded.md` | T2 | fact list before rewriting, checked after, nothing returned but the final | Med | 6 + 6 after-fix runs, fresh judge; Codex R1-R3 |
| `evals/fixtures/humanizer/fact-keep/` | T2 | retained sample, fact list, run notes | Low | baseline 0/3 on each version |
| `TECH-DEBT.md` | T2 | TD-274 narrowed | Low | read-through |
| `CHANGELOG.md` | T1 · T2 | `[Unreleased]` lines | Low | read-through |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Outcome** — 2 of 2 members delivered (TASK-512, TASK-511); 9 of 9 DoD boxes ticked. System verify on the VPS gate: 310/0 on
`6500361e` at the first run (316 last sprint; 8 pruned task files and 2 new ones change the per-file origin lines).

**Retrieval check** — yes. L-234's rule, promoted in T1, caught a scope-change entry naming an undeclared path on its first
use in T2, before any commit. L-252 (judge over several runs) shaped T2's bar, and it found that TD-274's recorded loss
did not reproduce.

**Cost** — coordinator inline (Opus) plus: two Sonnet builder checks (~51k each), three Sonnet judge passes (~51k, ~51k,
~53k), one Codex rescue agent reused across four rounds (~15k to ~19k each), and 21 headless Opus runs (3 discarded, 3 on
the first sample, 3 strengthened baseline, 6 after-fix round 1, 6 round 2). One VPS gate run. Coordinator tokens were not
measured. Most of the cost went to proving a negative: TD-274 did not reproduce.

**Worked**
- The baseline ran before any judged after-fix run, so "the sample cannot tell a fix from no fix" was found, not assumed.
- Pinning the plugin directory to an export made every run's input checkable from its own transcript.
- A fresh judge given only the fact list and the finals, rather than the coordinator's read alone.

**Friction**
- The first baseline was contaminated by editing the live `embedded.md` during the runs (L-254).
- The new step caused a progress-remark leak in one after-fix run; the round-1 fix closed it.
- Codex round 1 went NOT CLEAR because the review input left out `sample.md`.
- One parallel run failed to load its skill and returned `UNAVAILABLE`; waves of three did not repeat it.

**Buckets** — Shipped → CHANGELOG `[Unreleased]` (T1, T2). Tech debt → TD-274 narrowed (no new row). Follow-ups → none.
Learnings → L-254 · L-255 new; L-234 promoted.
