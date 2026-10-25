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
- [x] The self-review checklist (`orchestrator/references/review-scoping.md` § Self-review checklist) gains the comment ✓ `bef5bb5c`: review-scoping.md § Self-review checklist `- [ ] No code slop:` with comment tells, keep list and comments-only guardrail; intro now says it is the floor under every heavier pass
      tells (decorative banners / ALL-CAPS separators · comments restating the next line or the signature · step-by-step
      workflow narration · empty labels and vague TODOs · decorative emoji and end markers · one comment running past
      two lines for a one-line fact) **and** the preserve list (why, constraint, workaround, edge case, security,
      protocol, licence), with the guardrail that a comment pass changes comments only, never code.
- [x] The same checklist gains three code tells: a feature applied by a script that string-replaces source instead of ✓ `bef5bb5c`: same box, `Code tells:` item (patch-script source edits · fake-looking filler data · stub or TODO shown as finished)
      editing it · fake-looking filler data in seeds/fixtures (`John Doe`, `johndoe@example.com`) instead of an honest
      placeholder · a stub or TODO control presented as finished.
- [x] The dispatch builder brief and `/tdd` step 4 (Refactor) each carry one line pointing at the list, so it fires on ✓ `bef5bb5c`: pointers in dispatch.md builder brief (line 31) and worktree brief (line 475), review-scoping.md reviewer brief, and /tdd step 4 (by title, no path, no second list after Codex R1)
      dispatched and test-first work, not only at self-review (L-020 wiring).
- [x] Exercised on real input: the comment list run over lean-flow's own `scripts/` (findings recorded, comment-only ✓ (a) scripts/: 41 files, T1 175 (about 14 strict banners) · T6 about 120 (8 confirmed) · T2 1 · T3–T5 0; all ruled fix-later to one TD at close (A4) · (b) workdoo copy: headless builder, lean-flow loaded from the repo, real one-line diff, code-slop box reported item by item; file restored, sha256 969901bc7fdef881 before = after
      fixes applied or ruled out), and over one diff in the `D:\Research\workdoo` copy (consumer path, L-015).
- [x] Codex review → fix → re-review until clean (shipped-skill change). ✓ Codex R1 NOT CLEAR (1: tell list repeated in /tdd, README, CHANGELOG) → fixed → R2 VERDICT: CLEAR
- [x] SKILL.md caps hold (≤ ~140); README/CHANGELOG line. ✓ tdd 107/140, review-scoping 264, dispatch 795 (references uncapped); check-doc-caps 0 FAIL; prose-density 28/0; README line 248 + CHANGELOG [Unreleased] bullet in `bef5bb5c`

## Touches
`skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/references/dispatch.md` (builder brief) ·
`skills/tdd/SKILL.md` · `CHANGELOG.md`

## Assumes
- The list lives once, in the orchestrator's reference; `/tdd` carries a one-line self-contained summary rather than a
  cross-skill reference path (no shared reference trees across skills).

## Tracker
anti-slop adoption scan 2026-10-25, items 1 + 5 (merged by owner).
