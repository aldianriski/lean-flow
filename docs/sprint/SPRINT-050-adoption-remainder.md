---
sprint: 050
slug: adoption-remainder
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: 6484b47
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-050 — Adoption Remainder

> **Theme:** Two dangling pointers in one research doc, both left by earlier scans that were honest
> about stopping. Scan 2 named 13 skills it did not examine so the gap would be "a recorded boundary
> rather than an implied all-clear" — that boundary has sat unexamined for two sprints. And the
> mechanism B-vs-C question has been open since **scan 1**, carried forward twice with "no new
> evidence either way", which is how a deferral without an expiry drifts toward never (L-068). This
> sprint closes both, and the doc's own over-cap problem (TD-033) with them.

## Scope

**In:** map the 13 unscanned `mattpocock/skills` entries against lean-flow's existing surface, delta
first (L-017) · file keepers as tasks rather than adopting them inline · settle skill self-fork
(mechanism B) versus runtime invocation (mechanism C) either way, with an expiry if deferred ·
resolve TD-033 by restructuring the doc that all of this lands in.

**Out (deferred):** TD-034 (duplicated sections in the SPRINT-045 archive) — owner ruling at this
promote: the aging re-review fired at 3 sprints and it stays deferred, since it edits a closed archive
record and has no bearing on this sprint's subject. TD-036 (the `Cites:` authoring-surface question)
and TD-037 (the uncommitted-WIP union residual) are one sprint old and not yet aged. TASK-155 stays
`needs-info` — a style debate without an evidence source is not plannable. TASK-148 stays blocked.
**Adopting any keeper this scan finds is explicitly out** — keepers are filed, never built here.

## Plan

### T1 — Scan the 10 unexamined `engineering/` skills, and restructure the doc that holds them `[size: M · risk: low · class: decision · HITL]`
Layers: `docs/research/mattpocock.md` · `TODO.md` · `TECH-DEBT.md`
Depends-on: none
Cites: `scripts/qa-check.sh` `SKILL.md` T3 T2

<!-- Amended 2026-08-09 by scope-change (log, rulings R1+R2): the unscanned set is 23, not the 13
     this block originally named, and the doc's own boundary list was short by 5. T1 keeps
     engineering/; T3 takes the remaining 13. Nothing dropped. -->

Scan 2 closed with an explicit "Not scanned" list precisely so this could not be mistaken for
completeness — and then five skills left that list on a same-name assumption rather than a verdict.
`engineering/` is where the delta is most likely, since it mirrors our loop most closely. L-017 exists
because the failure mode here is judging a candidate on its standalone merit instead of the delta over
what we already ship. The doc is simultaneously at 136 lines against its 120 soft cap (TD-033), and a
third scan cannot be appended without making that worse, so the restructure is not separable.

**Acceptance:** each of the 10 `engineering/` skills below carries an explicit Keep or Reject with its
lean-flow equivalent named; keepers exist as `TASK-NNN`; and the doc's corpus figure and boundary list
are corrected to what was actually counted.

**DoD:**
- [x] All 10 mapped — `codebase-design` · `diagnosing-bugs` · `domain-modeling` · `grill-with-docs` ·
      `improve-codebase-architecture` · `prototype` · `research` · `resolving-merge-conflicts` ·
      `tdd` · `triage` — each Keep/Reject with its lean-flow equivalent named (L-017, delta first)
- [x] The 5 name-matched ones (`diagnosing-bugs` · `prototype` · `tdd` · `triage` — plus `handoff`
      in T3) get a **one-line confirm-or-reject each**, per ruling R1: a shared name is a hypothesis
      about coverage, not a finding — **4 checked here, 2 produced keepers**, so the assumption was
      wrong, not merely unverified
- [x] Keepers **filed as `TASK-NNN`**, not adopted inside this task — the discipline SPRINT-047 T2
      set, which is what made its two keepers reviewable before they shipped — TASK-156/157/158
- [x] A Reject states what already covers it; "not useful" alone is not a reason
- [x] The doc's corpus figure corrected — **35** `SKILL.md` files, counted deterministically, not 34
- [x] TD-033 addressed by the restructure: the doc lands **under its 120 soft cap** — 136 → 114 while
      adding scan 3, by collapsing scan 1/2 narrative to pointers; the split-per-file option was
      rejected in the doc with its reason
- [x] `TD-033` marked `status: resolved → SPRINT-050 T1` in the ledger
- [x] `scripts/qa-check.sh` re-run **bare** immediately before the commit, after the DoD ticks and the
      log entry — those are edits too (L-089)

<!-- QA: docs-only, no executable surface — self-review is the floor, no security or perf pass
     indicated. The risk here is judgement (adopting something redundant), not correctness. -->

### T3 — Scan the remaining 13: `productivity/`, `in-progress/`, `misc/` `[size: M · risk: low · class: decision · HITL]`
Layers: `docs/research/mattpocock.md` · `TODO.md`
Depends-on: T1
Cites: `scripts/qa-check.sh` T1

<!-- Added 2026-08-09 by scope-change (log, rulings R1+R2). Depends-on: T1 is file ownership, not
     logical need — T1 restructures the doc both write into (D1, extended). -->

The three directories the delta map has never touched. `in-progress/` and `misc/` were skipped by both
prior scans as presumptively unfinished or off-topic — plausible, and never checked, which is the same
assumption that removed five skills from the boundary list. Cheap to settle definitively.

**Acceptance:** each of the 13 carries an explicit Keep or Reject with a reason, and § Not scanned is
**empty** — the boundary closed rather than restated.

**DoD:**
- [x] `productivity/` (3) mapped — `handoff` · `teach` · `to-questionnaire`; `handoff` got the
      name-match confirm-or-reject treatment per R1 and came back **covered, including redaction**
- [x] `in-progress/` (6) mapped — `claude-handoff` · `loop-me` · `setup-ts-deep-modules` ·
      `writing-beats` · `writing-fragments` · `writing-shape`. "Unfinished upstream" is a valid Reject
      **only if checked** and stated as the reason — and it was **not used**: every one was read and
      rejected on domain or ethos grounds, never on being in-progress
- [x] `misc/` (4) mapped — `git-guardrails-claude-code` · `migrate-to-shoehorn` ·
      `scaffold-exercises` · `setup-pre-commit`
- [x] Keepers filed as `TASK-NNN`, not adopted in-task — **none found**; 0 keepers of 13, recorded as
      a result rather than an absence
- [x] § Not scanned **empty**, with the count reconciled: 12 previously scanned + 10 (T1) + 13 (T3) = 35
- [x] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

### T2 — Settle mechanism B vs C, with an expiry if it is deferred again `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/research/mattpocock.md` · `docs/adr/ADR-010-model-tier-dispatch.md`
Depends-on: T1 T3
Cites: `scripts/qa-check.sh`

Open since scan 1 and carried through two re-scans unchanged. Mechanism C (runtime `Skill` invocation
on a `general-purpose` sub-agent) is shipped and working as ADR-010's spawn-with-brief contract, so
this is an optimisation question, not a gap — B (`context: fork` skill self-fork) trades a per-run
fork cost for not needing the runtime invocation step. The reason it keeps surviving is that nobody
has priced it. A third "no new evidence" would make it permanent by default, which L-068 names
directly: write what would have to happen and by when, so the null result is itself a verdict.

**Acceptance:** the § Still open entry for mechanism B is gone — replaced either by an adoption with
its cost stated, or by a rejection carrying a named revisit-if condition and a dated expiry.

**DoD:**
- [ ] The question is answered in one of exactly two shapes: **adopt B** (with the per-run fork cost
      measured, not estimated — a stated figure that was never measured is L-088's trap), or **reject
      B** with a revisit-if condition and a dated expiry after which it auto-closes
- [ ] If rejected, the trail goes to `.out-of-scope/` following the pattern TASK-047 and TASK-120 set,
      so the decision is retrievable rather than only absent
- [ ] ADR-010 amended **only if** the answer changes it — an unchanged ADR is the correct outcome of a
      rejection and must not be edited to look busy
- [ ] § Still open no longer lists mechanism B vs C
- [ ] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

## Decisions (pre-locked)

- **D1** — **`docs/research/mattpocock.md` is shared by T1 and T2; T1 owns it, commit order T1 → T2.**
  T1 restructures the whole file (TD-033), so a concurrent T2 edit would land in a layout that no
  longer exists. T2 therefore declares a `Depends-on: T1` edge that is about *file ownership* rather
  than logical need — the two questions are independent, the file is not. If they are ever dispatched
  in parallel worktrees this edge is what prevents SPRINT-041's collision; under sequential inline
  execution it is simply the order.
- **D2** — **keepers are filed, never adopted in-task.** SPRINT-047 T2 established this and it is why
  its two keepers were reviewable as TASK-149/150 before shipping in SPRINT-048. A scan that adopts
  as it goes has no gate between "interesting" and "shipped".
- **D3** — **TD-034 stays deferred** despite its 3-sprint aging re-review firing at this promote.
  *(Owner ruling, SPRINT-050 promote.)* It edits a closed archive record and is unrelated to this
  sprint's subject; recorded here so the deferral is a decision rather than an oversight.

## Assumptions

- **A1** — the two prior scans' hit rate roughly holds (5 keepers from 12 examined), so most of the 13
  are fast rejects and T1 is an M rather than an L. *Confirm: after the first 4 skills are mapped. If
  the keeper rate is materially higher, T1 is an L and splits — through a `scope-change` entry and an
  owner ruling, never by quietly narrowing the list (L-088).*
- **A2** — mechanism C is working in practice, making T2 an optimisation question. *Confirm: stated in
  the research doc and in ADR-010. If C is in fact failing in real dispatch, T2 is the wrong frame and
  becomes a `/diagnose`, not a comparison.*
- **A3** — the 13 skills are still present and readable in the upstream repo. *Confirm: T1's first
  step. If the repo has moved on, the scan is against a different corpus and the § Not scanned list
  needs restating rather than clearing.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-050-adoption-remainder.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (DOCS_Guide §9 · ADR-014).

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| | | | | |

## Retro
<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md. -->
