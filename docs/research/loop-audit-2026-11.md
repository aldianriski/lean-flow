---
owner: Maintainer
last_updated: 2026-11-21
update_trigger: Question revisited, or a ranked finding is fixed or disproved
status: current
id: loop-audit-2026-11
tags: [process]
domain: skills
related: [loop-mechanics-audit]
---

# Research — Where is the lane and loop workflow weak, and what should be optimised next? (SPRINT-185 T3)

> **Question.** Across the coordinator and lane workflow and the whole loop (prime · decompose · triage · promote · orchestrate · close · handoff), which weak points does the evidence support, and which should ship first?
> **Verdict.** Fix the coordinator's own writes first: guarded fields go red at the gate, not at write time, in four of the last six sprints. Next, ship one builder brief, and promote only Layers tokens the design is sure of. The lane machinery has no run in the window, so leave it alone until TASK-668 measures one.

## Why this matters

The owner picks the next sprint from this ranking (TASK-697). Guessing costs a sprint spent on a weak point the record does not show, while a measured one keeps recurring.

## Method and limits

Every source was read at `plan_commit` 9478dec4 (the working tree matched it for `skills/`, `docs/LEARNINGS.md`, `TECH-DEBT.md`, `.claude/` and the archived logs). Sources: `coordinator.md`, `dispatch.md`, `night-run.md`, `cross-model-route.md`, `review-scoping.md`, the SKILL.md of prime, task-decomposer, triage, lean-doc-generator, orchestrator, flow and handoff, `.claude/CONTEXT.md`, the Execution Logs of SPRINT-175 to 184 (archived), every `LEARNINGS.md` entry with `count ≥ 2`, the open `TECH-DEBT.md` rows on these stages, EPIC-025 and the November research docs. Repo artefacts only; transcripts are TASK-668's (Assumes). Settled by `loop-mechanics-audit` and not re-filed: README deferred at prime, the handoff no-restate red flag, residual-only G2 re-grill. Evidence cites `file § heading`, which is stable across this sprint's edits.

## Ranked weak points

| # | Stage | Weakness | Evidence | Cost / defect | Fix size | Governance justification |
|---|---|---|---|---|---|---|
| 1 | orchestrate · close | Coordinator writes to guarded fields (consequence line, commit subject, `related:`, undeclared files) are checked only at the gate, so the first gate pass went red in 4 of 6 sprints | SPRINT-180 log "coordinator correction: … consequence line"; SPRINT-181 Retro (corpus `related:`); SPRINT-183 scope-change T2 (undeclared `.cap-dispositions`); SPRINT-184 "mid-sprint gate on c80a3860" (243 pass / 8 fail, 2 coordinator errors). L-261 ×7, L-234 ×5, L-229 ×3, L-257 ×3; L-238 promoted at count 2, seen again SPRINT-184 | 3 commits rebuilt (SPRINT-184), 10 by `filter-branch` (L-238), a second QA_FULL run per red pass (L-240) | M: route each coordinator write through the existing `scripts/lib/record-line.ts` writer, or run its existing pre-check before commit | repeated failure (≥2 `L-NNN`) + measured defect; reuses existing checks |
| 2 | orchestrate | Two separate tick failures: `record-line tick` runs the full checker set per call and overruns the 120 s tool timeout, and a chained tick whose output is silenced hides a real failure | L-326 ×3 (SPRINT-181 TASK-674, SPRINT-182 TASK-677, recurred after promotion; those runs finished green); SPRINT-182 Retro: the tick reddened `check-layers-completeness` but "the chain's output was redirected to /dev/null" (that checker's foreign-path false positive is fixed, TASK-689) | a one-tick commit 46295349 plus repair c9a755ef | S (skill text: one tick per call, never silence it); M for a fast path | repeated failure; no new check |
| 3 | coordinator | Worktree builder briefs are assembled from a prose list of about eight clauses the coordinator must remember | `dispatch.md` § Worktree dispatch protocol; L-262 ×3 (typecheck leg missing from a brief), L-235 ×2 (cap and pinned-sentence legs missing; two lost rounds), L-251 ×3 (checks omitted from verification; a static review cannot run the harnesses) | lost review rounds and extra gate runs; tokens unmeasured | M: one shipped builder brief for Claude worktree builders, as `worker-brief.md` already is for cross-model builds | repeated failure; no new check |
| 4 | promote | Layers declared at promote miss what the build touches, in both directions: speculative tokens are pruned later, and touched files are added late | prunes of tokens no build touched: SPRINT-179 (`docs/knowledge-index.md`), SPRINT-184 (T1/T2 `docs/knowledge-index.md` + overview, T8 `skills/prime/references/`); late additions: SPRINT-183 (`.cap-dispositions`), SPRINT-184 T6 (`evals/layers-completeness.test.ts`); L-240 ×2, L-229 ×3. (SPRINT-184 T9's prune was a cancellation → TD-320) | 5 non-cancellation entries in 6 sprints, each a frozen-Plan edit + gate pass | S: promote declares only tokens the design is sure of; G2 prunes candidates in its own entry (`builder-check.md` § Two rules) | repeated failure; prose only |
| 5 | orchestrate | A G2 design that paraphrases a frozen Done-when loosens it; the rule lives only in `builder-check.md`, not at the G2 checklist | L-237 ×4, latest SPRINT-184 T4 (five lines dropped, caught by a manual census, restored by retry) | one bounded retry per sighting | S: one net-zero clause at orchestrator G2 (`orchestrator/SKILL.md` is at 140 of 140, TD-313) | repeated failure; prose only |
| 6 | promote | The governance checklist re-derives unchanged findings and re-asks settled questions every sprint | promote entries SPRINT-180 to 184 ("TD aging … keep all open" ×5; "roadmap coverage: none" ×5); 8 stampless done tasks re-asked SPRINT-183 and 184; SPRINT-180 log: the promote worker's scan-and-draft phase took 195,905 tokens (one observation); `model-effort-trial-verdict` § Findings, cumulative over resumes: 210,964, 1.40× the 151k baseline | one measured promote at 195.9k scan tokens; the redundant share is unmeasured | M: carry a standing disposition forward, re-ask only on a delta. Needs an owner ruling: it touches "emit as a checklist the owner signs" | measured cost; adds a disposition field → owner ruling first |
| 7 | coordinator | Agent worktrees accumulate although cleanup is prescribed: removal runs by hand, on owner approval, now and then | `dispatch.md` § Merge-back queue "Cleanup (coordinator-only)"; TD-246 open since SPRINT-121 (14 → 22 registered over sightings, 12 removed by hand once); today 10 registered, 7 of them leftovers from SPRINT-157, 175 and v2.23.0 | stale-base risk (L-219 ×6); manual cleanups | S: a close-time propose-then-approve sweep of merged, unlocked worktrees (TD-246's own mitigation) | measured defect; a step, no ledger |
| 8 | orchestrate | Rules are restated across long references, and the restatements drift | `night-run.md` (938 lines) § Part 0b's correction block ("This paragraph previously said the opposite"); the retry ceiling stated in three files; `dispatch.md` (858 lines) holds a ~190-line inline script with its design history; L-290 ×2 ("a run follows the softer one") | drift defects (SPRINT-088 rollup); read cost unmeasured | M: one statement per rule with pointers elsewhere; the script's history moves out of the reference | repeated failure (L-290); no new check |

## Covered by an owning task or row (not re-filed)

- Mid-run owner questions (about 8 popups across SPRINT-181 to 184 beyond G1/G2) → **covered by TASK-696** (pre-run sweep) and **TASK-698** (park, continue, ask at end).
- Promote and mode offers at hand-offs; init stopping before migrate → **covered by TASK-695** and **TASK-694** (owner notes; no log friction in the window).
- Intake draft check reached in two hops and improvised (about 318k Codex tokens for 3 rounds) → **covered by TD-321**.
- Lane token cost and its two cost interventions → **covered by TASK-668** (re-measure on the next real multi-lane run). TASK-668 does not judge id booking or the CLI route (see Not ranked).
- Boundary behaviour between stage skills → **covered by TASK-523** (waits for a recorded violation).
- A cancelled member trips `check-review-depth.sh` and the two layers checks → already filed as **TD-320**; it is the cheapest checker fix on the list.
- CONTEXT.md at 150 of 150, so durable rules land in `LEARNINGS.md` § Durable rules, which no stage reads by default (L-327 shape) → already filed as **TD-312**.
- `/handoff` step 2's resume path has no run → already filed as **TD-300**.

## Not ranked (no evidence)

- Handoff, prime and `/flow` friction: SPRINT-180, 183 and 184 closes found no `handoff` entry, and the ledger's latest entry was `spent` throughout. These stages were not exercised, so there is nothing to rank.
- Lane rotation and id booking are prose-only with a version-dependent CLI route (`coordinator.md` §7, §8), but there was no lane run in SPRINT-179 to 184 to show a failure. No owning task judges them; revisit when a lane run is on record.
- A `retain` disposition deferring a count ≥ 2 learning without limit: L-293 was deferred four times ("a fourth deferral", SPRINT-184 promote), but SPRINT-184 named its end (SPRINT-185 promote) and it was placed there. A bound existed, so nothing is ranked (L-325 already covers bounds with no end).
- A guard on the trial reviewer pair's cost: trial-scoped (SPRINT-179/180 blind pair, 1.26×), with no spill into ordinary runs on record. No justification under ADR-053, so no guard is proposed.

## Leave alone

- Merge-back queue: sequential `--no-ff` on an integration worktree, a post-merge check, conflict recovery (`dispatch.md` § Merge-back queue). Earned from L-218 ×3 and L-219 ×6, and working ("every landed blob equalled its worktree's", SPRINT-184 Retro).
- The unattended contract and terminal states (`night-run.md` Part 0, 0b), enforced by the reaper with a retained revise-loop fixture.
- Builder check per task and census against the frozen box: SPRINT-182 T1 (8 contradictions · 6 questions, two became owner scope-changes before the build); SPRINT-184 T4's dropped lines were caught by census.
- The two-round stop rule: no third round in the window; the one breach (TD-321) was improvised outside it.
- Freeze and scope-change mechanics: every SPRINT-182 owner pivot was logged before the box moved.
- The close-time §11 archive popup: always answered "(Recommended)", but approval is bound by design (STANDARD §11). Keep it unless the owner wants fewer popups.

## Recommendation

**Coordinator and lane workflow.** First, ship #3 (one builder brief), because every Codex and Claude build pays for the omissions it prevents. Then #7 (worktree sweep, size S). Leave lane rotation, id booking and night-run mechanics alone until TASK-668's run gives evidence. To a later decompose: #3 and #7. To TD: nothing new; TD-320 is due for promotion to a task with #1.

**Whole loop.** First, ship #1: it accounts for most first-gate reds in the window. #2 is a separate defect (a slow tick and silenced output), cheap enough to ride in the same slice. Then #4 and #5 (S, prose only; they fit one small sprint alongside the first slice). #6 needs an owner ruling before any build, since it changes what the owner signs at promote. #8 is M and drifts slowly; take it when a reference is next edited for another reason. Leave alone: the merge-back queue, terminal states, builder checks and the freeze. To a later decompose: #1+#2, #4+#5, #6 after a ruling, #8. To TD: none; every ranked row has a real fix.

## Review

Codex (`gpt-6-astra`, read-only, `cross-model-route.md` draft-review rhythm) reviewed the ranked list and this recommendation. Round 1: `VERDICT: CLEAR`, with 7 medium or low findings, all accepted and fixed: SPRINT-182 dropped from #1's count (5 → 4 of 6) and #2 separated from it; #4 narrowed to its matching entries; #6's unit stated; #7 corrected (cleanup exists, but it is manual); TASK-668's coverage narrowed; L-293 deferred 4 times, not 2; L-218 count 3; L-251 restated. No disagreement is left open, and no round 2 was needed (the stop rule blocks only on a high finding).

## Out of scope / open questions

- Lane token cost and rotation brittleness → TASK-668's measurement.
- `RESEARCH.md.template`'s footer says "≤120 soft" while STANDARD §2 says 130 (ADR-020): a stale template line, not this task's Layers → a TD candidate for the coordinator.
