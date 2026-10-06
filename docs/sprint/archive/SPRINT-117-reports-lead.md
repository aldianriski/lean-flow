---
sprint: 117
slug: reports-lead
owner: Maintainer
last_updated: 2026-10-06
status: closed
plan_commit: 12361ed
gates_signed: G1,G2 @ 8ab8d54
close_commit: 2c32d95
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
| `skills/prime/SKILL.md` | T1 | the banner carries the verdict + next step; the report ends on `Next:` | Low | two cold runs; Codex R1–R4 |
| `skills/orchestrator/SKILL.md` | T1 | a Report shape rule; the sprint-bulk rollup keeps its machine-read shape | Low | cold runs; Codex R4 CLEAR |
| `skills/lean-doc-generator/SKILL.md` | T1 | step 8: one opening line with the verdict + next step; popups the same | Low | cold runs |
| `.claude/CONTEXT.md` | promote | L-229 merged into the `Layers:` bullet, rewritten under 400 chars | Low | prose-density 30/0 |

## Retro

**Retrieval check** — no miss. L-229 was promoted at this promote (its first promotion). L-007 (exercised on real input) is the rule
the cold run applied, and it held: two Codex rounds passed a text that the first cold run showed missing the done-when.

**Cost** — coordinator inline (gates, build, close) plus 6 dispatched agents, ≈ 240k subagent tokens as each reported it: four Codex
rounds 18–20k each (≈ 75k) and two Sonnet cold runs (82k · 84k). Delivered: 1 of 1 member, so ≈ 240k per member. One VPS gate run.

**Worked**
- The cold run was the check that counted. Review read the rule, and only running it as a stranger showed the next step missing from
  two opening lines, which is exactly what the done-when tests.
- Declining a review finding with the frozen done-when as the reason (R1 finding 2) held up: R2 agreed.

**Friction**
- The L-229 merge at promote broke prose-density (a 490-char line) on a file sitting at its line cap, so it could not be split; caught by
  this sprint's own run and rewritten shorter.
- Codex proposed changing a parsed contract (the rollup header) twice in different forms; the G1 out-of-scope line was what settled it.
- A scripted multi-replace failed silently on one of four edits; caught by re-reading the file, not by the script's report.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- none new: the cold-run catch is L-007's rule working; the silent script miss is the edit-safety rule (c), report vs artifact.
