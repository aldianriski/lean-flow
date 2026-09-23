---
id: TASK-364
title: "Budget the tokens actually consumed by the always-loaded read set"
epic: EPIC-017
priority: P1
size: M
risk: high
autonomy: HITL
class: decision
tier: G
authority: J2
origin: manual
state: ready
depends-on: [TASK-374]
---

# TASK-364 — Budget the tokens actually consumed by the always-loaded read set

## Done when

- [ ] check-doc-caps measures tokens over the always-loaded read set (tokenizer named), line counts kept as a secondary signal; retained must-FAIL fixture; an ADR supersedes ADR-015 · ADR-017 · ADR-019.

## Amended 2026-09-23

- **Narrowed 2026-09-23.** The long-line guard already shipped in SPRINT-105 (scripts/lib/check-prose-density.ts). Remaining: the token budget over the always-loaded read set (tokenizer named) in check-doc-caps, and the ADR superseding ADR-015 · ADR-017 · ADR-019. The disposition rule, the demotion and closing the soft OVER-CAP rows moved to TASK-384.
- Superseded done-when (was, under the title "Budget the resource actually consumed, and require a disposition per promoted rule"): `check-doc-caps` measures tokens over the always-loaded read set (**tokenizer named**), warns on long prose lines so density gaming is detectable, and keeps line counts as a secondary signal. Promotion requires a stated disposition — *replace · merge · move to an on-demand reference · automate into a check · retain with justification* — never deletion to turn a counter green. §157's "split, never squeeze" becomes **enforced**, which is the actual root cause: the rule already exists and only the counter beside it is checked. Closes the 3 standing OVER-CAP rows, each by a recorded disposition. ADR-015 · ADR-017 · ADR-019 superseded.

## Touches

spec/STANDARD.md · scripts/lib/check-doc-caps.{sh,ts} · .claude/CLAUDE.md

## Assumes

that a token budget is not merely a new metric to game. MITIGATED, not solved, by
the disposition requirement; the exit criterion measures effectiveness, and
explicitly does not count lines or checkboxes as success

## Tracker

EPIC-017 D3 · TD-174 (the three standing soft breaches this must close)
