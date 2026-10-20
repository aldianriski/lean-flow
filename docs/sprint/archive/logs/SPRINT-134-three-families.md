---
sprint: 134
slug: three-families
owner: Maintainer
last_updated: 2026-10-20
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-134 — Execution Log

> Append-only companion to [`../SPRINT-134-three-families.md`](../SPRINT-134-three-families.md). Uncapped by design
> (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-20 | promote | plan locked, governance signed, three members: EPIC-007's second slice
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: two due, both promoted before this commit (`d5634fe6`). L-238 → `.claude/CONTEXT.md` § Sprint model,
  disposition: merge (a coordinator write commits as bare `sprint(NNN):`). L-242 → `TECH-DEBT.md` § Tech Debt,
  disposition: replace (from this sprint on, the TD aging sweep is recorded only here). Census: 7 active + 213 promoted + 1
  superseded = 221 headers.
- ☑ TD aging (recorded here, per L-242): 105 of 108 open rows aged against sprint 134. Newly aged: TD-259 · 260 (filed at
  131). Not aged: TD-261 (132), TD-262 · 263 (133). No row resolved; no open row is `high`.
- ☑ doc-aging, §11 (owner-approved, applied in `d5634fe6`): TASK-458 (SPRINT-131) pruned. No live citation, checked over the
  live `.md` set and again by `git grep` over every tracked file. TASK-438 stays retained (TD-262). TASK-459, 460, 462 and
  cancelled 461 are cited by a research log. No TD deletion or CHANGELOG rotation is due.
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` exits 0; three over-cap research docs are already dispositioned.
  `.claude/CONTEXT.md` sits at 150 of 150 after the L-238 merge.
- ☑ epic rollup currency: EPIC-007 is current (`epic-state` PASS after the SPRINT-133 archive).
- ☑ epic coverage: 3 open, 3 marked by tasks (C2 → TASK-464, 467, 468 · C4 → TASK-464, 467, 468 · C5 → TASK-469).
  Cross-check: 3 = 3 + 0.
- ☑ roadmap coverage: no roadmap. ☑ handoff ledger: none.
Epic: SPRINT-134 appended to § Member sprints and `member_sprints:`. The coverage marks now name tasks, not "next slice".
Size check: 2 M + 1 S, no `L`. All three are `origin: decomposer` (decomposed 2026-10-20, `87a94c6b`; D1 census at intake).

### 2026-10-20 | gate | batch G1 (fast-path) and G2 signed by popup; T1 ∥ T2 in worktrees, then T3 inline
G1: all three members are `origin: decomposer` and the scope is unchanged since intake (`87a94c6b`).
G2: T1 writes the verification pack and T2 the solution-analysis pack. Two dispatched writers run in parallel in isolated
worktrees, and the coordinator merges each file back. The coordinator rewords the README sentence and commits it T1 then T2 (D1).
T3 runs inline after both land, ending in the owner's ruling. Verify: a model-name search that prints nothing; one fresh reader
per pack for the contract checklist plus the Spec and Standards axes; a README search. DoD 1 and 3 stay judgment ticks.
T1's design was corrected after its builder check, matching its source in five places. The retry fires only on a concrete
violation. The depth table is included. The Spec axis uses the comparand ladder, falls back to the acceptance criteria and says
so. The whole check is discovered in a fixed order, and the "none found" and "unreadable declaration" cases are covered. Internal
use is cited sprint by sprint and re-derived by two routes.
builder-check · T1 · 5 contradictions · 3 questions · design fixed against the source (all five); counts re-derived by the builder; the "no requester" branch goes under escalation (a source extraction, not an intent question)
builder-check · T2 · 0 contradictions · 4 minor (factual) · builder instructions: the steps are derived from the template; the search is spelled out; the coordinator does the README; no lean-flow names in the body
builder-check · T3 · 0 contradictions · 3 questions · runs after T1 and T2; the roadmap's copy of the gate box is not touched (not in the Done-when); the recommendation is formed from evidence at ruling time
consequence · T1 · behaviour:low · governance:high
consequence · T2 · behaviour:low · governance:high
consequence · T3 · behaviour:low · governance:high

### 2026-10-20 | progress | T1 and T2 built in parallel worktrees, merged back, reviewed; all 8 Done-when ticked
T1 (`93308c5c`): `packs/verification.md`, 75 lines. Its internal use was re-derived by the writer with position-anchored routes:
111 review runs in 28 sprints and 13 close-time verify runs in 7. The intake census said 129 in 33 and 19 in 9 because it also
counted prose mentions. The pack cites the anchored figures; TASK-467's Why keeps the intake numbers (not frozen DoD). The fresh
reader found 2 contract findings (inputs, capabilities) and 2 Spec minors (a ruling as the first comparand rung; each revise
outcome names its evidence). All were fixed in the one coordinator retry, and a single re-review returned all FIXED, both items
TICK, no regressions.
T2 (`8e5185bd`): `packs/solution-analysis.md`, 54 lines. 24 template-shaped docs, dated 2026-06-22 → 2026-10-20 (the design's
08-10 start came from a tail-only read). Every contract item ticked. One minor fixed: "23 also carry a verdict" became "all 24",
because two routes (a line-start match and an anywhere match) both found a verdict line in 24 of 24.
Both packs: the model/vendor search prints nothing; the bodies (from `purpose` on) carry no lean-flow id; no line exceeds 130.
README § Workflow packs lists all three packs, committed T1 then T2 (D1).
review · T1 · scoped fresh reader (contract checklist + Spec/Standards) · behaviour:low · governance:high · Spec: 2 minor → fixed · Standards: nits → fixed · retry 1 → re-review all FIXED
review · T2 · scoped fresh reader (contract checklist + Spec/Standards) · behaviour:low · governance:high · Spec: 1 minor → fixed · Standards: none

### 2026-10-20 | progress | T3 ruled by the owner; condition 5 closed as not satisfied by packs alone
owner-ruling: condition 5 — **not satisfied by packs alone.** Three workflow families fit one contract unchanged, on a single
runtime: that shows fit, not pressure. The roadmap gate guards against speculative platform work, so it stays open until a
second runtime, or a family that forces a contract change, appears. Recorded on EPIC-007 § Closed when condition 5 (ticked:
the condition asks for the ruling, either way) and on open question 3. The roadmap's own gate box stays unticked, which agrees
with the ruling.

### 2026-10-20 | gate | system verify FAIL (review-depth-governance-absent) → the owed T3 review was run, not the classification downgraded
system-verify · FAIL(review depth) · QA_FULL on the VPS at `81f55bcd`: 297 pass, 1 fail. T3's consequence line recorded `governance:high` and no review line followed. The review was owed, so it was dispatched (SPRINT-103 precedent: answer the finding with the missing review, never by downgrading the classification).
review · T3 · scoped-sonnet · behaviour:low · governance:high · Spec: met (both places agree; the three families match `packs/`) · Standards: 2 medium → fixed in the one retry (the epic's Why claimed packs "satisfy the workflow half" and "buy a gate condition", contradicting the ruling) · 1 low → fixed (condition 5 vs roadmap item 6 numbering) · still-open → owner: the epic's Outcome sentence ("the ADLC abstraction is under real pressure from more than one workflow family") states a goal the ruling says is not yet met; rewording the outcome is the owner's call
system-verify · PASS · QA_FULL on the VPS at `e862bd50`, the final integrated tree after the owed T3 review: 298 pass, 0 fail

### 2026-10-20 | close | 3 of 3 members in done/, PLAN_EXHAUSTED; Retro + buckets; EPIC-007 closes (6 of 6), Outcome reworded (owner)
run · 10 of 10 DoD ticked
terminal · PLAN_EXHAUSTED
System verify: QA_FULL 298/0 on the VPS at `e862bd50`, after the owed T3 review (the first run was 297/1, review depth).
Buckets: Shipped → CHANGELOG § v2.13.0 / SPRINT-134 · Tech debt → none · Follow-ups → none (the Outcome question was ruled at
close instead of filed) · Learnings → L-243 filed; L-108 sixteenth sighting recorded.
EPIC-007 rollup: conditions 2 and 4 ticked (three packs, each with its internal-use line; none names a model). All six are now
met, so the epic closes. Owner ruling at close: the Outcome's "under real pressure" clause is reworded to "can be tested
against", what was delivered; the roadmap's gate item 6 stays open. Handoff reconciliation: no handoff entry. Doc-freshness:
README was updated in-sprint; no other §2 trigger fired.
Release: 2.13.0 MINOR by hand (two new packs), owner-approved; §11 archive pass and CHANGELOG rotation owner-approved.
