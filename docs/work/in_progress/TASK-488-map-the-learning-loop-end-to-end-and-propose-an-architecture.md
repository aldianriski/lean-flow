---
id: TASK-488
title: "map the learning loop end to end and propose an architecture where each iteration measurably improves the workflow"
sprint: SPRINT-138
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-488 — map the learning loop end to end and propose an architecture where each iteration measurably improves the workflow

## Why
Owner request 2026-10-24: "every iteration the workflow more better", integrated with the existing learning pattern end to end,
with a proper architecture, reviewed twice by Codex, from the consumer's point of view too. Evidence: promoted rules keep recurring
(L-108 ×18, L-224 ×9, L-218 ×3; "loaded and reached none"), and about 8 consecutive sprints changed only maintainer checkers.
Research builds nothing; each recommendation names its ADR-053 admission, or that it has none yet.
Consumer: maps the same loop as it runs in an adopter repo (workdoo), and the route by which an adopter's learning reaches lean-flow.

## Done when
- [x] `docs/research/<slug>.md` (RESEARCH template) maps the loop end to end: capture (`/insights`, close Retro) → `L-NNN` and its ✓ `c365670f`→`86ad67e8`: docs/research/learning-loop-architecture.md maps the loop as a 9-hop table (capture → L-NNN/count → promote → §10 placement → rule → firing flow → recurrence → update route), each hop with record, reader and break; delta over the 6 prior docs, cited
      count → promote checkpoint → §10 placement → durable rule → the flow that should fire it → a recurrence sighting → the route by
      which that sighting updates the existing learning. Each hop names where the record lives, who reads it to act, and where the sync
      breaks. It is a delta over epic-017-effectiveness · loop-hygiene-* · loop-mechanics-audit · night-run-cost, not a restatement.
- [x] Every promoted `L-NNN` is inventoried, and a declared cohort and named cases are traced in detail. Each traced learning gets its ✓ all 225 headers inventoried (11 active · 213 promoted · 1 superseded; L-155 and L-127 quote the status string); cohort of 18 post-promotion recurrences (lower bound) + control set; per-case blocks in log Round 2 with available/reached/acted-on/effective each observed or unknown, windows, proxy opportunities or missing denominators
      promotion decision, placement owner, firing trigger, required action, outcome evidence, and the update route for a later
      sighting, distinguishing a rule that is available, reached, acted on and effective. Recurrence is reported relative to
      observable opportunities and exposure time; a missing sighting is not read as proof that the placement worked.
- [x] One documented extraction each for: checker catches vs their TD rows and fix commits; ceremony and review cost per sprint from ✓ log Rounds 3–5: checker catches vs TD/fix commits (17 of 32 sprint-commit members by a path route), ceremony/review cost over S128–S137 (QA_FULL 21 vs 24 reconciled), consumer-visible change per sprint (packs/ included); coordinator cross-checked F1, F6 (98 by a third route), F7 (7/10: 6 by gate headings + S137 gate body), F9 pin (host record); missing data stated as findings
      at least 8 completed pre-change Retros (the baseline); consumer-visible change and release per sprint. Findings that drive a
      recommendation get an independent cross-check. Missing data is reported as a finding, never estimated.
- [x] Consumer side: the same loop traced read-only in workdoo (its LEARNINGS, Retros and gate verdicts), and the upstream path from ✓ workdoo traced read-only (LEARNINGS, Retros, gate verdicts): Retros name 8 recurrences, ledger holds 3; pin 2.0.0 vs 2.13.2 with the S127/S128 owner action then dropped; upstream route = README issues → /triage bug intake, unexercised (finding)
      an adopter's learning to a lean-flow change, or its absence, stated as a finding.
- [x] A target-architecture section (WHY/WHERE, no HOW) shows how a learning moves from sighting to a change that measurably stops it, ✓ target architecture (four joints, WHY/WHERE); evidence-to-ranking table under the owner-ruled recurrence × consequence: C1 45 · C3 30 · C2 21 · C4 2 · C5 1, each with problem, smallest intervention, owner, scope, dependencies, ADR-053 status, success criterion, benefit, operating cost; priority separated from execution order (C4 before C1)
      including how an ineffective rule is revised or retired through existing mechanisms. Then ranked next-intake candidates, each
      with the evidenced problem, smallest intervention, owner, scope, dependencies, ADR-053 admission (or unmet), an observable
      success criterion, expected benefit and operating cost.
- [x] Two Codex review rounds (review → fix → re-review), the second leaving no unresolved blocking finding. The knowledge index is ✓ Codex: r1 FIX → retry; r2 FIX (item 5 blocking) → owner-authorised narrow r3 → CLEAR (VERDICT-T7), last nit applied `86ad67e8`; gen-index --check PASS; no candidate is both hard to reverse and surprising (ADR flag none, with reason), so no ADR proposal is owed
      regenerated. Any hard-to-reverse, surprising recommendation is proposed to the owner as an ADR, not written here.

## Touches
`docs/research/<slug>.md` · `docs/knowledge-index.md`

## Assumes
- workdoo is read, never written.
- Observations after TASK-482–486 land are kept separate from the pre-change baseline.

## Tracker
- Owner request 2026-10-24 (item R); intake draft reviewed by Codex 2026-10-24 (APPROVE WITH FIXES, folded in)
