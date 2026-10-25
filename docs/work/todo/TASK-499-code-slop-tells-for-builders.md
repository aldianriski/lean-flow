---
id: TASK-499
title: "Give builders and the self-review floor a list of AI-shaped code tells: comment slop plus three code tells"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-140
---

# TASK-499 — Give builders and the self-review floor a list of AI-shaped code tells: comment slop plus three code tells

## Why
No builder-facing skill says anything about code comments or AI-shaped code ("comment" appears only as a severity-table
row in `orchestrator/references/dispatch.md`), and `/humanizer` explicitly excludes code. anti-slop's `antislop-code`
(github.com/miqdadbadjuber/anti-slop @ 4ca3b11c) is the delta: owner-approved in the 2026-10-25 adoption scan.

## Done when
- [ ] The self-review checklist (`orchestrator/references/review-scoping.md` § Self-review checklist) gains the comment
      tells (decorative banners / ALL-CAPS separators · comments restating the next line or the signature · step-by-step
      workflow narration · empty labels and vague TODOs · decorative emoji and end markers · one comment running past
      two lines for a one-line fact) **and** the preserve list (why, constraint, workaround, edge case, security,
      protocol, licence), with the guardrail that a comment pass changes comments only, never code.
- [ ] The same checklist gains three code tells: a feature applied by a script that string-replaces source instead of
      editing it · fake-looking filler data in seeds/fixtures (`John Doe`, `johndoe@example.com`) instead of an honest
      placeholder · a stub or TODO control presented as finished.
- [ ] The dispatch builder brief and `/tdd` step 4 (Refactor) each carry one line pointing at the list, so it fires on
      dispatched and test-first work, not only at self-review (L-020 wiring).
- [ ] Exercised on real input: the comment list run over lean-flow's own `scripts/` (findings recorded, comment-only
      fixes applied or ruled out), and over one diff in the `D:\Research\workdoo` copy (consumer path, L-015).
- [ ] Codex review → fix → re-review until clean (shipped-skill change).
- [ ] SKILL.md caps hold (≤ ~140); README/CHANGELOG line.

## Touches
`skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/references/dispatch.md` (builder brief) ·
`skills/tdd/SKILL.md` · `CHANGELOG.md`

## Assumes
- The list lives once, in the orchestrator's reference; `/tdd` carries a one-line self-contained summary rather than a
  cross-skill reference path (no shared reference trees across skills).

## Tracker
anti-slop adoption scan 2026-10-25, items 1 + 5 (merged by owner).
