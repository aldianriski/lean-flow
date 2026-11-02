---
id: TASK-583
title: "Every task-done report carries a progress line with percentages"
epic: EPIC-023
sprint: SPRINT-158
priority: P1
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
state: ready
depends-on: []
gates_signed: G1 @ 12ae19fc
---

# TASK-583 — Every task-done report carries a progress line with percentages

## Why
Owner, 2026-11-02 ("krusial"): through SPRINT-154 to 156 the owner kept having to ask for status and how far the work had got,
because reports gave a verdict and a next step but no position in the whole. The orchestrator's report shape (TASK-321) fixes
where the conclusion goes; it says nothing about progress.

## Done when
- [x] `/orchestrator`'s report shape adds, after the verdict line of every task-done, gate and waiting report, one `Progress:` line: the active sprint's members done of total (with %), and when the sprint advances an epic, its Closed-when conditions ticked of total (with %); a running long job adds slots or steps done of total (with %) and an ETA. The sprint-bulk exit rollup keeps its machine-read first line. ✓ 2026-11-02: Report shape now names a `Progress:` line after the verdict, defined on the next line (TASK-583); the rollup keeps its machine-read first line
- [ ] Shown on real input: a task completed with the changed skill prints the line with figures that match the sprint file and
      the epic (read by the owner).
- [x] CHANGELOG `[Unreleased]` entry; `skills/orchestrator/SKILL.md` stays within its ~140-line cap. ✓ 2026-11-02: CHANGELOG [Unreleased] Changed line; SKILL.md 140 lines, density baseline 13

## Touches
`skills/orchestrator/SKILL.md` (Report shape) · CHANGELOG.md

## Assumes
- It joins the next S3 bundle and is measured with it (EPIC-023 D14); a report line is not expected to move the A/B endpoints.

## Tracker
Owner request 2026-11-02 (SPRINT-156) · TASK-321 (report shape) · memory: report-leads-with-conclusion
