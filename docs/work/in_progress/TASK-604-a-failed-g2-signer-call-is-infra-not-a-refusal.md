---
id: TASK-604
title: "Treat a failed G2 signer call in an A/B protocol trial as infra, never as a refusal"
type: bug
sprint: SPRINT-163
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: X
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-604 — Treat a failed G2 signer call in an A/B protocol trial as infra, never as a refusal

## Why
Follow-up from SPRINT-162. TASK-602 made a failed scoring-judge call an infra attempt; at G2 the owner kept the G2 signer out of
it. The signer (`policyCheck` in `evals/ab/lib/protocol.ts`) is also a judge call, and when it throws it refuses: the trial ends
`g2-refused: policy: judge reply unusable: …` and the slot is scored as not-passed. A login lapse during a protocol arm can still
lower the score that way, as TD-290 did before TASK-602.

## Repro
1. Run a protocol trial (`runProtocolTrial`) whose signer judge throws `judge run failed: exit 1, api_error`.
2. The row ends `g2-refused`, `attemptClass` is not infra, and the slot is scored not-passed.

## Done when
- [ ] A signer call that fails (CLI exit, API or auth error, no reply) marks the attempt `infra:judge-failed`, so the slot retries or
      stops for a ruling under section 18; a signer that replies `refuse` still refuses, and a reply that does not parse still refuses.
- [ ] Selftest S44 and the fail-closed check are updated to the new rule, and a new check fails on a thrown signer scored as a refusal.
- [ ] The change is recorded for the next arm's amendment, like TD-290 (harness code is not hashed).

## Touches
`evals/ab/lib/protocol.ts` · `evals/ab/selftest.ts` · `TECH-DEBT.md`

## Tracker
SPRINT-162 G2 ruling (signer out of TASK-602) · TASK-602 · TD-290
