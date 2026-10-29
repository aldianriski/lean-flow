---
owner: Maintainer
last_updated: 2026-10-29
update_trigger: An epic slice (S0-S4) promotes or closes, an A/B arm reports, or an owner ruling changes D1-D12
status: current
id: lean-flow-3-foundation
tags: [process, docs]
domain: skills
related: [architecture-baselines, init-vs-migrate, ADR-001, ADR-010, ADR-050, ADR-053]
---

# Research — lean-flow 3.0: specific, not short

> Status: owner-approved proposal (2026-10-29) after a 4-round Codex review (12 → 7 → 2 → 0 open, R4 CLEAR); feeds the 3.0 epic. Base: v2.19.1 · STANDARD v0.18.1.
> Codex moved it from a thesis to tested hypotheses, a staged A/B with ablations, ADR-053 admission
> routed through S0's measurement, R5 scoped to maintainers, and explicit loading, wiring and
> consumer exercises.

## 1. Problem (owner's thesis, 2026-10-29)

lean-flow's trimming sometimes degrades results into generic output. Lean matters for context
management, but quality is not to be sacrificed for cost. Owner-observed symptoms (a judgement, not yet
a measurement):

1. **Generic docs** — init/architecture output reads as a generic skeleton; the agent gets little real guidance.
2. **Misreads the business** — the agent misunderstands domain, goal or business rules.
3. **Lost detail in the loop** — detail drops between stages (task files, Plan rules, handoff, caps).

## 2. What the code says today (facts, re-checked 2026-10-29)

- `init` step 1 reads manifests + the file tree "to infer stack", but the only **structured** outputs of
  detection are four substrate conditions (has code · publishes artifact · DB · auth/API) that select
  docs. Nothing records which framework patterns or conventions the repo uses as data a later step reads.
- One architecture template for every stack (style line · dependency rule · dir tree · integrations,
  `[CUSTOMIZE]` placeholders). It **already** says "split … never squeeze to stay under the cap", and
  LAW 4 **already** excludes what the code states.
- Business intake at init = 3 "First milestone" questions; glossary create-lazily; main flow optional;
  no invariants, quality attributes or non-goals captured at init.
- Dispatch hands the builder its procedure skill, not a re-described brief; the brief adds the
  secret-files rule, the slop box and the pin contract — no repo/framework/business context pointer,
  no return-size cap.
- `docs/research/architecture-baselines.md` (2026-07-17): lean-flow must not **prescribe** a consumer's
  architecture.
- ADR-053: execution architecture (gates · dispatch · review routing · revise · system verify · run
  protocol) and any **new Standard requirement** are frozen — admitted only on one of five conditions
  named in the task's `## Why`. Skill and template work, defect fixes and deletions are not frozen.

**So the principles largely exist on paper; the gap is that no mechanism produces specific content
and carries it to the step that needs it.** Which existing instruction fails in practice is S0's job
to measure, not this proposal's to assert.

## 3. External evidence (verified unless marked)

- **arXiv 2602.11988** (Gloaguen et al., v3 2026-09-29) "Evaluating AGENTS.md": context files *do not
  generally improve task success* and raise inference cost *over 20%*; repository overviews are not
  helpful; context files help for **non-standard practices**; improvements should be rigorously
  evaluated before deployment. (Abstract verified; per-number deltas in secondary summaries unverified.)
- Anthropic, *Effective context engineering for AI agents* (2025-09-29): just-in-time retrieval via
  lightweight identifiers; condensed sub-agent returns.
- Anthropic, *Demystifying evals for AI agents* (2026-01-09): deterministic graders first, outcome
  grading, isolated per-dimension LLM judges with "Unknown", multiple trials, pass@1 + pass^k.
- Anthropic, *Multi-agent research system* (2025-06-13): brief = objective + output format +
  tools/sources + boundary; explicit effort-scaling rules.
- Cross-model review (arXiv 2607.21656): **results unverified** — not relied on.

## 4. Hypotheses (to be tested, not assumed)

The evidence says context files *on average* do not help and overviews do not help, while
non-standard practices do. It does **not** show that generic detail is worse than none, nor that
trimming caused the owner's symptoms. 3.0 therefore tests three hypotheses:

| H | Hypothesis | Mechanism under test |
|---|---|---|
| H1 Specificity | Recording the repo's *non-derivable* facts (chosen conventions, invariants, domain rules, goal, non-goals, quality bar) improves outcomes on the three symptoms over 2.x | S2 discovery + profiles |
| H2 Carry-through | Delivering those facts to the step that needs them, by resolved section pointer, improves outcomes over the same facts left in docs | S3 pointer contract |
| H3 Expertise | Specialist briefs / reviewers / tiers / agents improve outcomes beyond H1+H2 within the cost cap | S3 candidates, admitted at S4 |

A hypothesis **holds** only when (§7): the primary endpoint gains ≥ the minimum worthwhile gain, the
symptom measure it targets improves, and no other dimension regresses past its pre-registered limit.

Working design rules (become STANDARD text only if H1/H2 hold): **R1** don't write the derivable ·
**R2** write the non-derivable at the depth the task needs, never trimmed to fit a cap · **R3** context
budget is set by what each step *loads*, not by trimming the source · **R4** describe, never prescribe.
**R5** (every context change ships with A/B evidence) is a **maintainer release policy for lean-flow
itself** — recorded in an ADR + CLAUDE.md, never a STANDARD rule imposed on adopters.

## 5. Owner decisions taken (2026-10-29)

| # | Decision |
|---|---|
| D1 | Scope = whole loop (docs · discovery · carry-through · delegation), one epic sliced into sprints |
| D2 | Framework knowledge = **hybrid**: few curated shipped question sets + deep repo scan; unknown framework → scan-only fallback |
| D3 | Proof = A/B on real repos |
| D4 | Expertise = specialist briefs, shipped expert agents (ADR-001 bar, ADR-044), stronger tiers, specialist review; plus outside current practice |
| D5 | Cost cap ≈ 2× tokens per task, only where the A/B shows a gain; spend reported per run (operationalised in §7) |
| D6 | Migration = `/lean-doc-generator migrate` upgrades a 2.x repo in place, keeping existing docs |
| D7 | A/B repos = workdoo snapshot (`D:\Research\workdoo`, React 18 + Vite + `server/` + Postgres) and a new repo in `D:\Research\` (Vue 3 + Vite + Go chi + PostgreSQL) |
| D8 | Business discovery = read existing docs (PRD/README/tickets) first, then interview only the unknowns, by frontier round |
| D9 | G2 in trials = **eval-only exception** to night-run Part 0: signed by the written policy (approve as written unless the design leaves task scope) + mechanical scope check (files touched ⊆ task `Layers:`); recorded as a deviation; never applies to product runs |
| D10 | A/B budget = full design accepted (240 + 32c runs + setup) |
| D11 | Minimum worthwhile gain = **+10 pp** on the primary endpoint; regression limit = **−5 pp** per symptom measure |
| D12 | First profile set = React/Vite · Vue/Vite · Go/chi · Postgres; every other stack takes the scan-only fallback |

## 6. Epic slicing

Each slice ends with **its own staged A/B arm** (§7). Two permissions are kept apart: a slice whose arm
misses its threshold still **continues as an experimental prerequisite** of the next arm (H1 may only
pay off once H2 delivers the facts), but it **ships** only on a passing arm of its own or as part of a
later passing combination.
Every slice's DoD carries the **wiring check** (entry routing · dispatch/reviewer brief · `/flow` ·
CONTEXT SSOT · README + CHANGELOG) **exercised on a real run**, not satisfied by prose.

| S | Sprint | Delivers | Done when (outcome) | Freeze / tier |
|---|---|---|---|---|
| S0 | Baseline | Maintainer-only A/B harness (measurement, never a gate or `qa-check.sh` leg); Vue/Go repo built; task set; pre-registration (§7); arms A0 + A1 run | Pre-registration frozen **before** any A1 run; A0/A1 results per symptom recorded in a research log; each symptom marked *measured defect* or *not reproduced* | Not frozen (no new governance machinery). Other G: fixture + real run |
| S1 | Discovery | `init`/`migrate` produce a **repo profile** (stack · conventions actually used · invariants · business goal · flows · quality attributes · non-goals) as section-addressable docs; hybrid question sets (React/Vite · Vue/Vite · Go/chi · Postgres); scan-only fallback; template audit removing overview sections that restate code | Real `init` on both A/B repos + an **unprofiled-stack** repo via the installed plugin; `migrate` on a real 2.x repo preserves every existing decision and leaves valid pointers; no lean-flow-internal path in output; **arm A2 measured vs A1 and recorded** (ship-eligible alone only if it meets threshold) | Skill/template work: not frozen. Tier per task at G2 (ADR-050) |
| S2 | Carry-through | **Pointer contract**: format (`path § heading`), resolver (load that section only), missing/renamed section → explicit failure surfaced in the brief, never silent; task file, Plan, review brief and handoff use it; lost-detail audit | A traced run shows each required fact **read** by the builder (transcript evidence), not merely pointed at; every *blocking* loss from the audit fixed, only *deferrable* ones may go to TD; **arm A3 measured vs A2 and vs A1** (H1+H2 judged jointly on A3 vs A1 when A2 alone missed) | Dispatch/brief change → **frozen**: admitted on S0's *measured defect* (symptom 3) named in `## Why`; G2 review cap 2 |
| S3 | Expertise candidates | Dispatch brief fields (objective · output format · sources · boundary · profile pointers · return cap); fan-out budget; specialist reviewers; tier-policy amendment (ADR-010); expert-agent **candidates** (not shipped) | Each candidate runnable in the harness; **arm A4 (all candidates) measured vs A3** | Dispatch · review routing · tiers → **frozen**: admitted on S0 measurement in `## Why`; G2 review cap 2 |
| S4 | Admit + STANDARD + release | Ablation per candidate (A4 minus one) → admit only those with positive delta within cost cap (ADR-001 record each); STANDARD MAJOR carrying R1–R4 **only if H1/H2 held**; R5 in maintainer ADR; 3.0.0 release (grep-derived manifests + README footer) + migration notes | Shipped set = only components whose own ablation delta is positive; Final measured vs A1 **and** vs A3 on both repos (Final must beat A3 by the minimum gain, else no expertise component ships); if any candidate was excluded, each admitted one is re-checked as Final-minus-one; anything not admitted recorded with its numbers | New Standard requirement → frozen: admitted on S0/S1 measurement. Conformance-engine logic changes (if any) = consequential G, full ADR-050 bar |

Order is load-bearing: S0 before everything (it is the admission evidence for every frozen change and
the baseline for every arm); S1 → S2 → S3 because each arm stacks on the previous; STANDARD changes
last, once the hypotheses are tested. The STANDARD rewrite moved from first to last: writing R1–R4 into
the standard before H1 is measured would be a new Standard requirement without one of the five.

## 7. A/B design (design frozen at S0 promote; pre-registration hash at TASK-544)

**Freeze timing (owner ruling R-c, 2026-10-29):** the design below freezes at S0 promote; the
pre-registration hash freezes before any trial on an A/B repo or a task-set task. Harness smoke runs use
a separate fixture repo only. **Evidence parity (R-a):** every arm, A0 included, carries the same raw
answers file as `BUSINESS-NOTES.md`, so A0 means raw facts without lean-flow. **Baseline defect rule
(R-b):** a symptom is a *measured defect* when A1 fails its measure ≥ 20% and the 90% bootstrap lower
bound of that failure rate is > 10%; Unknown counts as failure. S0 tasks: TASK-533..545.

**Arms (staged, cumulative):** A0 no lean-flow docs · A1 2.x (pinned 2.19.x) · A2 = A1 + S1 discovery ·
A3 = A2 + S2 carry-through · A4 = A3 + S3 candidates · A4−x ablations (S4) · Final = admitted set.

**Controls (identical across arms):** pinned plugin revision per arm · one fixed, version-pinned
**model inventory** · same tool permissions · same task prompt · same business evidence (an
**answers file**) · fresh repo snapshot + fresh session per trial · judges blinded to arm identity.

**Treatment variables (declared per arm, never silently varied):** the docs produced by setup ·
model **routing and effort** (A0–A3 use 2.x routing; A4 and ablations use the S3 candidate routing,
drawn from the same inventory) · brief shape · reviewers.

**Two phases, so no live human is needed and no gate is skipped:**
- *Setup* (A1 and A2 only, once per repo): `init`/`migrate` run interactively; an operator answers
  every popup **verbatim from the answers file** (no answer in the file → "not decided yet"),
  transcript retained. A0 has no setup.
- *Artifact reuse*: **A2's discovery docs are the single discovery artifact for every downstream arm**
  (A3 · A4 · ablations · Final). Downstream arms add only their declared treatment (pointers, briefs,
  routing, reviewers); they never re-run discovery. Shared docs are verified identical by
  `git hash-object` per file against the frozen A2 set before each arm runs; a slice that must change
  doc structure applies it as a declared mechanical transform whose content diff is reviewed empty.
  Limitation recorded: one setup sample per repo, so A2 − A1 includes discovery's run-to-run variance.
- *Trials*: each task runs unattended (A0: the plain task prompt, no lean-flow loop). **G1** is
  pre-signed per `night-run.md` Part 0 — its subject, the task file, is frozen at S0. **G2's subject
  (the design) is produced inside the trial, so G2 is not pre-signable**; it is signed under the
  owner's eval-only exception D9. Any other popup a
  trial raises is **parked** and the trial scored as not-passed, with the park recorded.

**Tasks:** 8 per repo (feature touching a convention ×2 · business-rule change ×2 · bug · refactor ·
cross-layer change · task on an under-documented area), frozen at S0, written by an isolated agent
that never sees 3.0 material, owner-reviewed for realism.

**Graders:** deterministic first (tests · typecheck · lint · build · task-specific acceptance tests);
then isolated per-dimension judges (convention adherence · business correctness · scope discipline)
with "Unknown"; a sample calibrated against the owner's read.

**Pre-registered decision procedure:**
- *Primary endpoint*: per-task success (all deterministic graders pass AND business-correctness judge ≥ pass), averaged over trials, then over tasks.
- *Symptom measures (secondary, each pre-registered with a regression limit)*:
  - **generic docs** → convention-adherence judge pass rate
  - **misreads the business** → business-correctness pass rate on the business-rule tasks
  - **lost detail** → success on the tasks whose acceptance depends on a fact present only in the docs/answers file (marked at S0)
  - plus scope discipline.

  A hypothesis holds only if its targeted measure improves and no measure regresses past its limit.
- *Unit of analysis*: the task, not the run — trials estimate per-task reliability; uncertainty by bootstrap over tasks; pass^k reported as secondary.
- *Minimum worthwhile gain*: +10 pp (D11), regression limit −5 pp per symptom measure; a delta below it, or whose interval spans zero, is **inconclusive** — the slice does not ship as a quality claim.
- *"Unknown"* judge verdicts count as not-passed for the primary endpoint and are reported separately.
- *Cost (D5)*: comparator = A1 median execution tokens per task; included = every agent call the task triggers (builder, reviewers, sub-agents); one-off discovery/init tokens reported separately and amortised over the task set; ceiling = 2.0× A1.
- *Never worse than A0*: an arm below A0 on the primary endpoint fails regardless of its delta over A1.

**Run budget (accepted, D10):** A0/A1/Final at k = 3, intermediate arms (A2/A3/A4/ablations) at
k = 2 → 2 repos × 8 tasks × (3 arms × 3 + 3 arms × 2) = 240 runs, plus ablations at
2 × 8 × 2 = **32 runs per candidate** → **240 + 32c** (c = candidate count), plus 32 per admitted
candidate for the Final-minus-one re-check when any candidate was excluded. Setup runs are extra
(one per arm × repo, operator-attended).

## 8. Governance fit

- **ADR-053**: S0 and S1 are measurement + skill/template work (not frozen). S2, S3 and the STANDARD
  change in S4 are frozen surfaces; each task's `## Why` names S0's measured defect with its log
  reference; a symptom S0 does not reproduce admits nothing; G2 review-round cap 2 by default.
- **ADR-001 / ADR-044**: profiles = short curated question sets; each expert agent admitted only on its
  own ablation delta.
- **ADR-050**: tier classified per task at G2. Consequential G only where conformance-engine logic or an
  adopter-run script changes (likely only if S4's STANDARD MAJOR changes engine rules) — those take the
  full bar (must-FAIL fixtures, mutation discrimination, worktree-isolated review). Shipped skill and
  template changes take the owner's Codex review loop.
- **Consumer side (L-015)**: S1's unprofiled-stack and 2.x-upgrade exercises run through the installed
  plugin; no maintainer path in consumer output; README + CHANGELOG + migration notes per slice.
- **Versioning**: 3.0.0 + STANDARD MAJOR together at S4. Only S1 and S2 outputs may ship early as 2.x
  MINORs, and only on a passing arm of their own; S3 candidates never ship before S4 admission.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Richer docs reproduce the paper's result (more cost, no gain) | hypotheses tested per slice; A0 floor; overview sections removed in S1 |
| A/B too costly to finish | staged k; owner budget at S0 promote; a slice can stop early on an inconclusive delta |
| Rigged A/B | isolated task author; scripted answers file; blinded judges; pre-registration before any run |
| Profile library bloats / rots | small curated set; scan-only fallback exercised on an unprofiled stack |
| 2.x adopters broken | migrate exercise on a real 2.x repo; content-preservation check |
| Hypotheses fail | the epic then ships only the measurement harness + findings, recorded as such — a valid outcome |

## 10. Open questions for the owner (each must close by the named point)

Q1, Q2, Q3, Q5 ruled 2026-10-29 → D9–D12.

4. Ship S1/S2 as 2.x MINORs as each proves out, or hold everything for 3.0.0? (S1 promote)
