---
id: ADR-053
tags: [process]
domain: governance
status: accepted
related: [ADR-001, ADR-044, ADR-050]
---

<!-- One ADR per file · append-only (never edit a decided ADR — mark it deprecated/superseded) · WHY only. -->

# ADR-053 — The execution freeze re-arms, widened to governance machinery

- **Status:** accepted (2026-10-12, owner)
- **Deciders:** Maintainer
- **Context driver:** governance machinery took ~69% of commits while the freeze covered only the execution loop

## Context

SPRINT-082 froze the core execution architecture (`docs/research/adlc-epic-sequencing.md` § FROZEN). It froze the Gauntlet loop:
gates · dispatch · review routing · revise · system verify · run protocol. A change was admitted only on one of five conditions.
V3 suspended the freeze for EPIC-015's execution-autonomy scope (2026-08-25), and it re-arms once V3 §56's two dogfoods pass (V3
§58). Both have now passed: Dogfood 1 at SPRINT-121, and Dogfood 2 with CW5 at SPRINT-122 on vehicle SPRINT-123.

The freeze never covered governance, and that is where the work went. The interim ruling measured that since SPRINT-090 ~6% of
commits touched `skills/`, the surface adopters install, and ~69% touched governance docs (the categories overlap). Re-derived at
this ADR for the first figure: 61 of 1,077 commits from SPRINT-090's `plan_commit` to SPRINT-124 T3 (5.7%). Guards, checkers, gate legs and ledgers grew
without any admission bar beyond ADR-001's curation review. SPRINT-108 T1 shows the cost of an unbounded loop on that work: three
builder rounds and four reviews (~2.4M sub-agent tokens) chased parser edges that 0 of 26 live task files contained, and ~80% of
the value landed in the first pass (L-217, family H ×4). The owner restricted new governance machinery to the five conditions in an
interim ruling on 2026-10-10, after two Codex review rounds. That ruling was recorded in the sequencing file, which no skill and no
AI-context file reads (L-151).

## Decision

**The freeze re-arms now, and it covers governance machinery as well as the execution loop.**

1. **Frozen:**
   - The execution architecture: the Gauntlet loop above, plus what EPIC-015 added (the unattended launcher, authority classes and
     the continuation contract).
   - **New governance machinery:** a new guard, checker, gate leg, `qa-check.sh` leg, ledger, or ledger field.
2. **Admitted only on one of the five conditions:**
   - a **measured defect**
   - a **measured cost**
   - a **repeated workflow failure** (≥2 sightings, `L-NNN`)
   - a **security issue**
   - **consumer evidence** from an adopter who is not us

   All three classes of fact count (L-094): a measurement, a documented behaviour, and a judgement call ruled by the owner. V3
   §58's six-item list maps onto these five. Performance or cost evidence is a measured cost, and repeated consumer friction is a
   repeated failure or consumer evidence. A new Standard requirement or Run Evidence admits work only through one of the five.
3. **Not frozen:**
   - consumer-facing skill and template work
   - defect fixes
   - deletions or merges of existing machinery

   Those are the work the freeze exists to make room for.
4. **How an admission is recorded:** the task's `## Why` names its condition and the evidence for it: a measurement with its source,
   an `L-NNN` at count ≥2, a security finding, or an adopter's report. G1 reads that line. A task proposing new governance machinery
   without it is not promotable. This uses the existing task file and adds no field: a field would itself be new machinery.
5. **Bounded review for admitted governance work** (L-217):
   - Each item declares a review-round cap at G2. The default is 2: one review and one re-review.
   - Cumulative sub-agent spend is shown at every round.
   - Before any further round is authorised, the finding's shape is censused against the real corpus. A census-zero shape routes to
     `TD-NNN`, not another builder round.
   - Reviewers are briefed against a threat model and the listed items, never "find anything".
6. **Placement:** one line in `.claude/CLAUDE.md` § Anti-Patterns, which every flow in this repository reads, promote and
   decomposer intake included. Shipped skills stay out of it, because this is lean-flow's own development rule and would leak to
   every consumer (L-015). This ADR replaces the interim paragraph of 2026-10-10. The sequencing file's § FROZEN keeps a pointer here.

The freeze opening recorded on 2026-10-07 for EPIC-020's scope stays with that epic, which now lives in `workdoo` (ADR-052).

## Consequences

**Positive:**
- Governance work now has to justify its recurring cost before it lands.
- The rule sits where the flows that propose such work actually read it.
- A review loop on admitted work has a declared end.

**Negative (trade-offs accepted):**
- A guard that would have caught a real class of failure waits until that class has a sighting or a measurement. Some prevention
  becomes repair.
- The line between "new machinery" and "defect fix" is a judgement. The owner rules it at G1, so the boundary costs a question.
- Consumers get no freeze from lean-flow. A consumer who wants one writes their own.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Adopt V3 §58's six conditions verbatim | It admits a new Standard requirement and Run Evidence on their own. Those are the doors governance growth came through. Owner ruled the five (SPRINT-124 G2). |
| No widening: rely on ADR-001's curation bar | That bar was in force for the whole ~69% governance-share period, so it demonstrably did not hold the line. |
| Place the rule in the shipped promote / decomposer skills | It would leak lean-flow's own freeze to every adopter (L-015), and `lean-doc-generator` SKILL.md has 2 lines of headroom. |
| A mechanical admission checker (frontmatter field + gate leg) | That is new governance machinery with no sighting of the failure it would catch, so this ADR's own rule would refuse it. |
