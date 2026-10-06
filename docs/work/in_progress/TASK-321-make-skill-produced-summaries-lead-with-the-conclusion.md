---
id: TASK-321
title: "Make skill-produced summaries lead with the conclusion"
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J2
origin: manual
state: ready
sprint: SPRINT-117
---

# TASK-321 — Make skill-produced summaries lead with the conclusion

## Done when

- [ ] every summary a skill emits at a process boundary — `/prime`'s health report, an `/orchestrator` task/gate completion, a close rollup, and any confirmation prompt — opens with the VERDICT (what is true now / what was decided), then its evidence, and ends with exactly ONE explicit next-step line. Context the reader already has is not restated, and no summary buries its conclusion mid-prose. Verified by running each skill cold and reading its output as a stranger would: the first line must answer "what happened and what do I do next" without reading further

## Touches

- skills/prime/SKILL.md · skills/orchestrator/SKILL.md · skills/lean-doc-generator/SKILL.md (§ output/rollup formats only) — and any `references/` report template they own

## Assumes

- the fix is a REPORT-SHAPE rule, not a length cap. Terseness is already required (CLAUDE.md § Concise reporting) and did not prevent this: the reports were long AND circular because nothing said where the conclusion goes. Confirm before building that adding a length rule alone would not close it

## Tracker

- owner feedback, 2026-08-31 — "penjelasan AI tidak runut, kesimpulan final-nya tidak jelas, hanya menjabarkan hal yang berputar-putar tidak to the point"
