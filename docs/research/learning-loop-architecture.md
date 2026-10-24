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
> **Verdict.** Capture, counting and provenance have demonstrated failures: 5 of 15 Retro-named recurrences never reached
> their entry, 42 recurrences were filed as new ids, 98 `promoted` pointers are one pasted line. Promotion itself ran within
> one promote in the three cases checked. The missing step is after placement: a promoted rule that recurs has no reader,
> no denominator and no revise-or-retire route. Fix that route, measure against the S128–S137 baseline, delete prose a tool
> now carries. Do not add a ledger.

## Why this matters
7 of the last 10 sprints closed red on first system verify; 5 of the 10 red runs carry an owner ruling in their gate heading
(S131 also rewrote 10 commit messages). A promoted rule recurred in 8 of 10 Retros. A wrong call adds machinery ADR-053 bars, or repeats the reds.

## Options considered
- **A — Keep the loop, promote harder.** *Trade-off:* no new machinery, but 18 promoted rules kept recurring.
- **B — Rule at the act, a recurrence as an event, measure, then delete.** Uses dispositions, §11 collapse, TD.
  *Trade-off:* needs a baseline and ten sprints, adds no ledger. **Chosen.**
- **C — A recurrence ledger.** *Trade-off:* the direct instrument, but new governance machinery, and the ledger already undercounts (F5).
- **D — Make every recurring rule a checker.** *Trade-off:* strongest at the act; 17 of 35 members were already checker work (F7).

## Findings
Selectors, per-case traces and the second query behind each figure → [`logs/learning-loop-architecture.md`](logs/learning-loop-architecture.md)
(R# = Round #). **[C#]** marks what a candidate rests on.

| hop | record | read by, to act | where the sync breaks |
|---|---|---|---|
| 1 capture | `/insights`; close Retro (10 of 10 have a Retrieval check) | the next `/insights` scan | the match scans a 1,483-line file whose promoted bodies are one-line titles: 42 of 58 recurrences were refiled as new ids |
| 2 count | `seen` / `count` on the entry | the promote scan | Retros name 15 recurrences (S128–S137), 10 reached the entry; workdoo 5 of 8 missed |
| 3 checkpoint | promote `☐ L-promotion` line, owner sign-off | coordinator, owner | ran within one promote (L-218, L-238, L-242); scans `promoted:no` only, so no line reads a promoted entry |
| 4 placement | `promoted:` pointer + `disposition:` | whoever follows it | 98 identical pointers; 145 pre-S112 promotions carry no disposition |
| 5 rule | CLAUDE / CONTEXT / `dispatch.md` / ADR | session start or dispatch start | the act comes later, in another phase, with no prompt |
| 6 fire | prime loads CLAUDE + CONTEXT; dispatch reads references | the actor at the act | no artifact records that the rule was in context (observed for 2 cohort entries) |
| 7 sighting | Retro check; a gate red | coordinator at close | after the damage: the gate in 7 of 10 closes, a disagreeing second number for L-108's sightings |
| 8 update | a bullet on the entry, or a new id | nobody | one disposition re-check (L-229) and one tool escalation (L-224); `superseded` used once (L-084) |
| 9 outcome | none | none | no denominator; "no sighting" is silence, not proof |

**Delta over the six prior docs.** `epic-017-effectiveness` counted recorded count-bumps (22 → 13) and found effectiveness
not demonstrated; here the unit is a sighting after promotion, and F5 shows the record undercounts. `loop-hygiene-*` found
promotion fires and added "every rule gets a matcher" (S10.MATCHER): that proves a rule exists, not that it fired.
`loop-mechanics-audit` and `night-run-cost` price context per turn; nothing prices what a rule buys (always-loaded: 41,851 bytes).

- **F1 Inventory** [C1]. 225 headers = 11 active + 213 promoted + 1 superseded (status token in position; a substring
  count gives 13 active). Not the break. *R1.*
- **F2 Cohort** [C1 C2]. 18 of 213 promoted entries (a lower bound) logged a sighting after promotion. Counting units differ:
  L-224 ×9 = events, 7 after promotion = 6 failures + 1 hold; L-108 ×18 = numbered sightings, 15 after promotion in 11
  sprints; L-218 1 in 21 proxy sprints; L-229 3 runs in S118, none of its shape after automation; L-238 0 (control).
  Reached observed only for L-108 (5 of 15) and L-229; acted on observed yes once (L-224 S128); overall effectiveness remains
  unknown, despite one observed successful intervention (L-224, S128). *R2.*
- **F3 No denominator** [C1 C3]. Opportunities are recorded nowhere; proxies exist for two rules only (R2).
- **F4 What worked** [C1 C2]. L-242 (3 of 3 promotes cite it), L-238 (every plan's D1), L-217 (round cap declared): the rule
  sits at the step and the actor writes a trace into an artifact they already produce.
- **F5 Update route** [C1]. 42 of 58 folded recurrences were filed as new ids; 5 of 15 Retro-named recurrences are not on
  the entry (S131 ×3, S133, S136). *R2b, R2c.*
- **F6 False provenance** [C4]. Commit `c52496fd` (2026-08-29, subject "plan locked") set one pointer on 98 entries, 96 at
  count 1; `825fac01` collapsed them to `promoted`. No detection is recorded before this research, 56 days on; earlier
  detection is not excluded. The S137 promote checklist quotes the 213. *R1.*
- **F7 Checker cost** [C2 C3]. 10 red runs in 7 closes: 5 bookkeeping, 1 process skip, 1 mixed; 1 content defect found by
  the gate. 17 of 35 members touched checker code (subject route and path route agree). *R3.*
- **F8 Cost data** [C3]. 10 of 10 Retros have a Cost line, 6 give tokens, none on a common scope. Comparable: members, DoD,
  QA_FULL runs (21 stated, 24 by logs; S132 and S133 differ), reds, reviews. First-run red 7 of 10, S137 included. *R4.*
- **F9 Consumer** [C5]. 8 releases in 10 sprints, 19 adopter-visible files, the 2.13.2 PATCH none; 16 of 114 known-home
  promotions target adopter-visible surfaces (installation and exposure unproven); shipped skills carry 71 references to 35
  repo-private L-ids. workdoo: worker pin `2.0.0` (host record) vs 2.13.2; the pin action listed S127–S128, then absent. No
  adopter origin exists among 49 tasks, and none carries `triage-bug` (older `done/` files are pruned). *R5, R6.*

## Recommendation
**Target architecture (WHY and WHERE).** Four joints, all existing mechanisms:
1. **Place at the act.** A rule's home is the step that performs the act, and the actor leaves a one-line trace in the
   artifact they already write. A reference read earlier is documentation. §10's test asks "which flows"; add "which step".
2. **A recurrence is an event on the entry.** `/insights` appends a dated held/failed sighting to a matched promoted entry;
   the promote line lists promoted entries with a sighting since the latest disposition review; each is re-dispositioned.
3. **Revise or retire through the ledger's own states.** The re-check assigns the change as an ordinary backlog task (as
   TASK-411 and TASK-438 were), named on the pointer's `disposition re-check:` line; closure is read as in the paragraph
   under the tables, not from new sightings. Kinds: `automate-into-check`, `replace`, `move-to-reference`, `retain` with reason;
   an obsolete rule goes `superseded`; a tool carrying a rule collapses it (§11) to the tool's one line; a costly checker ages as TD.
4. **Measure against a baseline.** S128–S137 (R4) is the pre-change baseline; SPRINT-148 re-reads it.

**Evidence to ranking** (ruled order: recurrence × consequence, ties by lower operating cost). Recurrence = recorded events in
the window; consequence: 3 red close, 2 wrong figure signed, 1 none observed. Units differ per row, so a one-event defect ranks low by construction (R8).

| # | recurrence (unit · window) | consequence observed | score | operating cost |
|---|---|---|---|---|
| 1 | 15 Retro-named recurrences · S128–S137 | 3: red closes S129, S137; re-scope S131 | 45 | one selector per promote |
| 2 | 10 failures of L-224/L-218/L-229 · S115–S137 | 3: red close S137 and earlier | 30 | one edit and a review |
| 3 | 7 first-run reds · S128–S137 | 3: 5 owner rulings | 21 | a Cost-line sentence |
| 4 | 1 bulk edit · 56 days | 2: the 213 signed at S137 | 2 | one M task |
| 5 | 1 dropped owner action · S129–S137 | 1: none observed | 1 | a few lines |

Priority is the rank; execution order differs: C4 before C1 (honest counts), C3 from S139, C2 after C3 and S138 T3.

| # | intervention · owner · scope | admission (ADR-053) · deps | success (proposal, not finding) | benefit · cost · reversal |
|---|---|---|---|---|
| 1 | A recurrence of a promoted rule is an event: `/insights` step 3 appends held/failed; promote line lists sightings since the latest disposition review. Maintainer. `insights` SKILL, one line in `lean-doc-generator` (140 of 140: replace text), one §10 clause; adopter-visible. The one added step: promote reads each re-check line's task | repeated failure (L-224 ×9, L-108 ×18). After C4 | recorded/named ≥ 90% by S148 (10/15); 0 new ids later folded (42); every re-check line closed (task in `done/`, or `cancel/` with a reason) or still open and named at each promote | revision gets a trigger. Reading burden per promote; sightings can accrete as in L-108. Ships to adopters; a wrong clause needs a release to undo | 
| 2 | Delete prose a tool now carries: after 5 merge-backs with no same-leg red, replace L-218/L-224/L-229 prose with the command line. Maintainer at promote. `dispatch.md`, CONTEXT § Sprint model | unfrozen (deletion); repeated failure. After C3 and S138 T3 | command logged at every observed merge-back, 0 same-leg reds over ≥ 10 sprints; if merge-backs are unlogged, untestable | shorter read path. One edit, Codex loop. A wrong deletion shows as a red close |
| 3 | Effect test: from S139 the Cost line states members, QA_FULL runs, reds with cause, reviews, first-run verdict, and merge-backs run; S148 appends a log round. Coordinator | measured defect (24 runs, 10 red). After S138 | first-run red ≤ 3 of 10 (baseline 7), runs ≤ 1.5 (2.4), and reds on a leg the command passed on that revision = 0; exposure ≥ 10 sprints | "improves" becomes a number. A Cost-line sentence per Retro. A miss reopens S138 T3 |
| 4 | Repair the 98 pasted pointers from `c52496fd^` / `825fac01^`: one script file, one reviewed diff, two-selector census; count-1 entries `active` or `retain` by owner ruling (J2). `docs/LEARNINGS.md` | measured defect (fix, unfrozen). None | each of the 98 verified restored to its own record or an owner-ruled home (shared homes allowed) | promoted census drops from 213 and the figure signed at S137 changes. One M task. Originals stay in git; external citations of 213 break |
| 5 | Resolve the workdoo pin action (owner: bump or decline, recorded as a task). Intake wording: a task from an adopter names it in `## Why`; reports go to the README's GitHub issues, read at `/triage` bug-intake; a skill-procedure failure becomes a plugin change, a repo-specific one stays in the adopter's ledger. Maintainer | **unmet**: workdoo is the maintainer's repo, ADR-053 names an adopter who is not us. Defer the 71 repo-private L-id references (31 resolve to the unshipped ledger, 4 to nothing). After C1 | after workdoo's pin is on a release carrying C1, at its next two promotes ≥ 90% of Retro-named recurrences are on its entries (baseline 3 of 8), pin shown in the run record | the route exists and is exercised. Maintainer reads issues; one wording edit. Nothing arriving is itself the finding |

**C1 closure reader (verified in the repo).** The assigned change is an ordinary `TASK-NNN` file. While in `backlog/` it is
visible to `/triage` (backlog only, `skills/triage/SKILL.md:12-13`) and to promote, which pulls `state: ready` tasks into a
sprint (`skills/lean-doc-generator/SKILL.md:106`); once a member, `/prime` counts its open `- [ ]` boxes (`skills/prime/SKILL.md:44-46`)
and treats a task outside `done/`/`cancel/` as open (`:50-51`); a sprint cannot close until every member sits in `done/` or
`cancel/` (`SKILL.md:108`). The `disposition re-check:` line (the form at `docs/LEARNINGS.md:206`) is closed only when its named
task is in `done/`, or `cancel/` with a reason recorded on the line; while the task is open it stays open, with or without new
sightings. **Not existing today:** promote's L-promotion review does not read that line (no "re-check" text in either skill file).
Reading it, and listing each open one, is the one small step C1 adds.

**ADR candidate: none.** C1 and C4 are the weakest to reverse (shipped text, a changed census), but neither is surprising.

## Out of scope / open questions
- Per-rule cost: bytes known, tokens per rule and what a rule buys not measured. Whether a rule was in context needs the transcript.
- Whether the 96 count-1 entries deserve promotion on merit: an owner ruling inside C4.
- One consumer, the maintainer's own: nothing here tests a second adopter. Two Codex rounds follow.
