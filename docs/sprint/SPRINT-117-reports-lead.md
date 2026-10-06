---
sprint: 117
slug: reports-lead
owner: Maintainer
last_updated: 2026-10-06
status: active
update_trigger: sprint execute/close events
---

# SPRINT-117 — Reports Lead

> **Theme:** the owner's oldest open complaint about the loop is its reports: long, circular, and with the conclusion buried
> (2026-08-31, TASK-321's tracker). Terseness is already required and did not fix it, because nothing says *where* the conclusion goes.
> This sprint gives every skill report one shape: the verdict first, then its evidence, then exactly one next step.

## Scope

**In:** a report-shape rule for the summaries the loop's three busiest skills emit at a process boundary: `/prime`'s health report,
`/orchestrator`'s task and gate completions, and `/lean-doc-generator`'s close rollup and confirmation prompts (`321`).

**Out (deferred):** a length cap (the member's assumption: terseness exists and did not help) · the other eleven skills' outputs ·
night-run Part 4's machine-read rollup lines (their shape is a checked contract) · workdoo (another session) · any `git push` (owner-reserved).

## Members

- docs/work/todo/TASK-321-make-skill-produced-summaries-lead-with-the-conclusion.md

## Plan

### T1 — Make skill-produced summaries lead with the conclusion `[size: M · risk: low · class: execution · HITL · J2]`
Layers: `skills/prime/SKILL.md` · `skills/orchestrator/SKILL.md` · `skills/lean-doc-generator/SKILL.md`
  · `skills/orchestrator/references/review-scoping.md` (only if the rule lives beside the review-report format)
Depends-on: none
Cites: `TASK-321` · CLAUDE.md § Concise reporting · owner feedback 2026-08-31 (TASK-321's tracker)

Shipped skills, so the Codex review loop applies (owner rule). All three SKILL.md files sit near the ~140-line cap (131 · 135 · 138), so
the rule must cost a line or two each, or live in a `references/` file the skill already owns (ADR-006). J2: the owner judges the result
by reading each skill's output cold.

**Acceptance:** each of the three skills, run cold, emits a boundary report whose first line answers "what happened and what do I do next",
ends with exactly one next-step line, and no SKILL.md exceeds its cap.

## Owner-action checklist
- [ ] Read each skill's cold-run output as a stranger would, and rule pass or fail on it (J2).

## Decisions (pre-locked)
- **D1** — The rule is about shape, not length (the member's assumption, confirmed at G2 before building).

## Assumptions
- **A1** — The fix is a report-shape rule; a length rule alone would not close it. *Confirm: at G2, against this sprint's own reports (which the owner read).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-117-reports-lead.md`, created lazily at the first entry (ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. -->
