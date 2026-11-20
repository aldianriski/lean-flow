---
id: TASK-675
title: "Wire graphify-out into /prime and Explore recon, only if graphify passed"
type: feature
epic: EPIC-026
priority: P3
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-673]
---

# TASK-675 — Wire graphify-out into /prime and Explore recon, only if graphify passed

## Why

Owner ruling 2026-11-20 (Q4, "Ship in lean-flow"), which counts as the separate ruling EPIC-026 requires. It applies only if TASK-673 says keep.

## Done when

- [ ] /prime and the Explore recon briefs (task-decomposer, orchestrator, dispatch reference) read graphify-out when present and degrade gracefully, with no error, when absent.
- [ ] Wiring check: the new reading fires end-to-end through every job that triggers or chains it (entry routing, dispatch/reviewer brief, /flow, CONTEXT SSOT); no symbol or reference has zero callers.
- [ ] Consumer-facing check: no repo-specific path leaked; README and CHANGELOG updated; .claude/CONTEXT.md updated if the roster or loop text changes.
- [ ] A real run in a repo with graphify-out and a real run in one without it each behave as stated.
- [ ] Negative: with no graphify-out, /prime and Explore recon report no error and no changed output.
- [ ] Negative: any SKILL.md that grows stays at or under about 140 lines.

## Touches

The prime SKILL.md and the Explore recon brief lines in task-decomposer, orchestrator and the dispatch reference; README, CHANGELOG, CONTEXT.

## Assumes

- **blocked-by:** a TASK-673 keep verdict. On drop or inconclusive it is cancelled.
- Runs in the sprint after the RTK trial sprint (owner popup 2026-11-20, "Next sprint, if kept"), so the RTK measurement stays clean.
- Tier P with a read-through, as it adds no governance machinery, so ADR-053's freeze does not apply. Split at G2 if the wiring spans more than two skills.

## Tracker

Owner popups 2026-11-20 Q4 and "Next sprint, if kept"; owner approve 2026-11-20.

## Cancelled
2026-11-20, SPRINT-181 close: TASK-673 ruled graphify drop (6 of 6 correct, a tie with Explore, at 1.038x its tokens against the 1.0x bar), so the graphify wiring is not taken up.
