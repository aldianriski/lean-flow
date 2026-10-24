---
owner: Maintainer
last_updated: 2026-10-24
update_trigger: SPRINT-148 re-runs the cost extraction, or a promoted rule's recurrence changes the verdict
status: current
id: learning-loop-architecture
tags: [process, tooling]
domain: governance
related: [epic-017-effectiveness, loop-hygiene-prd, loop-hygiene-findings, loop-hygiene-workstreams, loop-mechanics-audit, night-run-cost, ADR-053]
---

# Research — How does a lean-flow learning become changed behaviour, and where does it stop?

> **Question.** How does a lesson travel from sighting to a rule that changes what the next actor does, where does
> that sync break, and what makes each iteration measurably better, for lean-flow and for a repo that installs it?
> **Verdict.** Capture and promotion work. The break is after placement: a recurrence of a promoted rule has no
> reader, no denominator and no revise-or-retire step; 98 of 213 `promoted` pointers are one pasted line; adopters
> receive about one rule in nine. Fix the update route, measure against the S128–S137 baseline, delete prose a tool
> now carries. Do not add a ledger.

## Why this matters
7 of the last 10 sprints closed red on first system verify, and a promoted rule recurred in 8 of 10 Retros (L-224 ×9,
L-218 ×3, L-108 ×18). Each red cost an owner ruling and a rerun. A wrong call adds machinery ADR-053 bars, or repeats the reds.

## Options considered
- **A — Keep the loop, promote harder.** *Trade-off:* no new machinery, but 18 promoted rules kept recurring.
- **B — Rule at the act, a recurrence as an event, measure, then delete.** Uses dispositions, §11 collapse, TD.
  *Trade-off:* needs a baseline and ten sprints of patience, adds no ledger. **Chosen.**
- **C — A recurrence or effectiveness ledger.** *Trade-off:* the direct instrument, but new governance machinery,
  and the ledger already undercounts what Retros name (F5).
- **D — Make every recurring rule a checker.** *Trade-off:* strongest at the act; 17 of 35 members in the window
  were already checker work and 11 of 13 new TD rows are checker defects (F7).

## Findings
Evidence, selectors and the second query behind each figure → [`logs/learning-loop-architecture.md`](logs/learning-loop-architecture.md)
(R# = Round #). **[C#]** marks a finding a candidate rests on; the coordinator cross-checks those by another route.

| hop | record | read by, to act | where the sync breaks |
|---|---|---|---|
| 1 capture | `/insights`; close Retro (10 of 10 have a Retrieval check) | the next `/insights` scan | the match scans a 1,483-line file whose promoted bodies are one-line titles: 42 of 58 recurrences were refiled as new ids |
| 2 count | `seen` / `count` on the entry | the promote scan | Retros name 15 recurrences (S128–S137), 10 reached the entry; workdoo 5 of 8 missed |
| 3 checkpoint | promote `☐ L-promotion` line, owner sign-off | coordinator, owner | works (one promote); scans `promoted:no` only, so no line reads a promoted entry |
| 4 placement | `promoted:` pointer + `disposition:` | whoever follows it | 98 identical pointers; 145 pre-S112 promotions carry no disposition |
| 5 rule | CLAUDE / CONTEXT / `dispatch.md` / ADR | session start or dispatch start | the act comes later, in another phase, with no prompt |
| 6 fire | prime loads CLAUDE + CONTEXT; dispatch reads references | the actor at the act | no artifact records that the rule was in context |
| 7 sighting | Retro check; a gate red | coordinator at close | after the damage: the gate in 7 of 10 closes, a disagreeing second number for L-108's 18 |
| 8 update | a bullet on the entry, or a new id | nobody | one disposition re-check ever (L-229); `superseded` used once (L-084) |
| 9 outcome | none | none | no denominator; "no sighting" is silence, not proof |

**Delta over the six prior docs.** `epic-017-effectiveness` counted recorded count-bumps (22 → 13) and found
effectiveness not demonstrated; the unit here is a sighting after promotion, and F5 shows the record undercounts.
`loop-hygiene-*` found promotion fires and added "every rule gets a matcher" (S10.MATCHER); that matcher proves a rule
exists, not that it fired. `loop-mechanics-audit` and `night-run-cost` price context per turn; nothing prices what a
rule buys (CLAUDE.md + CONTEXT.md are 41,851 bytes always loaded; tokens per rule are not measured).

- **F1 Inventory** [C1]. 225 headers = 11 active + 213 promoted + 1 superseded (position-anchored; a substring count
  gives 13 active). The 11 are count 1. Promotion latency is one promote (L-218, L-238, L-242). Not the break. *R1.*
- **F2 Cohort** [C1 C3]. 18 of 213 promoted entries logged a sighting after promotion. Traced: L-224 6 failures and
  1 hold in 5 sprints; L-108 15 in 11; L-229 3 then 0 in 40 scope-changes once automated; L-218 1 in 21 worktree
  sprints; L-238 0 (control). Available yes in all; reached recorded for 2; acted on no; effective no. *R2.*
- **F3 No denominator** [C1 C2]. Nothing records opportunities or whether the rule was in context. L-224's count mixes
  a hold (S128) with failures; for 40 own-pointer entries "no sighting" is all there is.
- **F4 What worked** [C1 C3]. L-242 (3 of 3 promotes cite it), L-238 (cited in every plan D1), L-217 (round cap
  declared): the rule sits at the step and the actor writes a trace into the artifact they already produce.
- **F5 Update route** [C1]. 42 of 58 folded recurrences were filed as new ids; 5 of 15 Retro-named recurrences never
  reached the entry; one tool escalation (TASK-438) and one re-check (L-229) in the whole cohort. *R2b, R2c.*
- **F6 False provenance** [C4]. Commit `c52496fd` (2026-08-29, subject "plan locked") set one pointer on 98 entries, 96 at
  count 1; `825fac01` collapsed them as `promoted`. Undetected 56 days; the S137 promote census quotes the 213. *R1.*
- **F7 Checker cost** [C2 C3]. 10 red runs in 7 closes: 5 bookkeeping, 1 process skip, 1 mixed; one content defect
  found by the gate. 17 of 35 members touched checker code. *R3.*
- **F8 Cost data** [C2]. 10 of 10 Retros have a Cost line, 6 give tokens, none on a common scope; comparable: members,
  DoD, QA_FULL runs (21 stated, 24 by logs), reds, reviews. First-run red 7 of 10 (logs 6). SPRINT-138's "5 of 8" is 6. *R4.*
- **F9 Consumer** [C5]. 8 releases in 10 sprints, 19 adopter-visible files, the 2.13.2 PATCH none; 13 of 114
  known-home promotions land on an adopter-visible surface; shipped skills cite 35 repo-private L-ids. workdoo: pin
  `2.0.0` vs 2.13.2, the pin owner action listed S127, S128 and then dropped. **No upstream path**: no adopter
  origin exists among 49 tasks; 2 TD rows from lean-flow sprints exercising workdoo; roll-up "by hand". *R5, R6.*

## Recommendation
**Target architecture (WHY and WHERE).** Four joints, all existing mechanisms:
1. **Place at the act.** A rule's home is the step that performs the act, and the actor leaves a one-line trace in the
   artifact they already write. A reference read earlier is documentation. §10's test asks "which flows"; add "which step".
2. **A recurrence is an event on the entry.** `/insights` appends a dated sighting to a matched promoted entry, saying
   held or failed; the promote line lists promoted entries with a sighting since promotion; each gets a disposition
   re-check from the existing vocabulary.
3. **Revise or retire through the ledger's own states.** `automate-into-check` when a tool can carry it, `replace` with a
   shorter form, `move-to-reference`, or `retain` with a reason. A rule a tool now carries collapses (§11) to the
   tool's one line; an obsolete rule goes `superseded`; a checker that costs more than it catches ages as TD.
4. **Measure against a baseline.** S128–S137 (R4) is the pre-change baseline; SPRINT-148 re-reads the same five quantities.
For an adopter the same two skill edits ship; an adopter report is an `origin: manual` task whose `## Why` names the adopter.

**Ranked next-intake candidates** (recurrence × consequence, ties by lower cost; targets are proposals, not findings).
**ADR candidate: none** (every item is reversible by git).

1. **A recurrence of a promoted rule becomes an event.** *Problem:* F2, F5: 18 rules recurred, 15 Retro-named
   recurrences vs 10 recorded, 1 re-check. *Intervention:* `/insights` step 3 appends a held/failed sighting to a promoted
   match; the promote L-promotion line lists post-promotion sightings. *Owner:* Maintainer. *Scope:* `insights` SKILL,
   that line in `lean-doc-generator` (140/140: net-zero), one §10 clause; adopter-visible. *Deps:* C4 first. *ADR-053:*
   repeated failure (L-224 ×9, L-108 ×18). *Success:* by S148 recorded/named ≥ 90% (10/15) and 0 new ids later folded
   (42). *Benefit:* revision gets a trigger. *Cost:* one selector per promote.
2. **Effect test at SPRINT-148.** *Problem:* F8: S138's changes rest on 7 of 10 first-run reds; success is unstated.
   *Intervention:* from S139 the Cost line states members, QA_FULL runs, red runs with cause, reviews, first-run
   verdict; S148 appends a log round beside R4. *Owner:* coordinator at close. *Scope:* Retro convention, no checker or
   field. *Deps:* S138. *ADR-053:* measured defect (24 runs, 10 red). *Success:* first-run red ≤ 3 of 10, runs ≤ 1.5
   per sprint (baseline 7, 2.4); a miss reopens S138 T3. *Benefit:* "improves" becomes a number. *Cost:* a line per Retro.
3. **Delete prose a tool now carries** (merge). *Problem:* F2, F7: L-218, L-224, L-229 have 12+ sightings and 6 red
   closes, while S138 T3 builds the command that carries the act. *Intervention:* after 5 merge-backs with no same-leg
   red, replace each rule's prose with the command line (`replace`, §11 collapse). *Owner:* Maintainer at promote.
   *Scope:* `dispatch.md` (Codex loop), CONTEXT § Sprint model, 3 pointers. *Deps:* C2, S138 T3. *ADR-053:* unfrozen
   (deletion); also repeated failure. *Success:* net deletion in always-read files, 0 sightings in 10 sprints.
   *Benefit:* shorter read path. *Cost:* one edit and review.
4. **Repair the 98 pasted pointers.** *Problem:* F6. *Intervention:* restore each pointer from `c52496fd^` / `825fac01^`
   by one script file and one reviewed diff, two-selector census before and after; count-1 entries return to `active`
   or get `retain` at the owner's ruling (J2). *Owner:* Maintainer. *Scope:* `docs/LEARNINGS.md`. *Deps:* none.
   *ADR-053:* measured defect (a fix, unfrozen). *Success:* 0 duplicate pointers, 225 headers by two selectors.
   *Benefit:* census and promote checklist become true. *Cost:* one M task; no new checker.
5. **Give the adopter a path upstream.** *Problem:* F9. *Intervention:* an open owner action repeats in every Retro
   until closed; an adopter report is filed as above. *Owner:* Maintainer. *Scope:* close Retro text (net-zero), no field.
   *Deps:* C1. *ADR-053:* **unmet**, since workdoo is the maintainer's own repo and the condition names an adopter who is
   not us; the Retro sentence is not machinery. *Success:* the pin action closed or ruled next Retro; one adopter-named
   `## Why` in 10 sprints or drop it. *Benefit:* the path exists. *Cost:* negligible.

## Out of scope / open questions
- What a rule costs per turn: bytes are known, tokens per rule and what a rule buys are not measured.
- Whether a rule was in context at a failure needs the transcript; C1's sightings start the record.
- Whether the 96 count-1 entries deserve promotion on merit: an owner ruling inside C4.
- One consumer, the maintainer's own: nothing here tests a second adopter. Two Codex rounds follow.
