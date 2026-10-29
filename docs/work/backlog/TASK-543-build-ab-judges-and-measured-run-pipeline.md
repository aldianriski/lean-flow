---
id: TASK-543
title: "Build the blinded A/B judges and the full measured-run pipeline"
epic: EPIC-023
priority: P2
size: M
risk: high
autonomy: HITL
class: decision
tier: G
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-533, TASK-537, TASK-538, TASK-539, TASK-540]
---

# TASK-543 — Build the blinded A/B judges and the full measured-run pipeline

## Why
Turns single smoke runs into scored, costed, analysable measurements; every decision rule the pre-registration freezes must already work on fixture data. Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [ ] Per-dimension judges (convention adherence · business correctness · scope discipline), isolated, blind to arm identity, with an explicit "Unknown".
- [ ] Calibration on reference and deliberately-wrong solutions (not trials): agreement with the owner's read recorded; prompts fixed before the freeze.
- [ ] The measured-run record per trial carries every grader its task froze (lint, or not applicable for workdoo), all three judge verdicts, and execution tokens across every agent call the task triggers — sub-agent inclusion proven on a fixture run that dispatches one; setup tokens separate.
- [ ] Retry classification: infra failures (harness crash · API/rate-limit error · network · sandbox error before the agent's first action) retry up to 2 times; a task failure never retries; the scored trial is the first non-infra attempt. Cost: scored cost (the only figure in D5's comparator and 2.0× ceiling) · infra cost (reported, never in D5) · total spend = scored + infra. Must-FAILs: simulated infra failure → retried · task failure → not retried · third infra failure → infra-lost, not-passed.
- [ ] Run-validity rule: infra-lost trials count not-passed operationally but are excluded from every symptom measure and from R-b; valid only if infra-lost ≤ 5% of scored trials and no arm × task cell lost more than 1 of 3; else invalid, no ruling. Replacement: only infra-lost slots re-run, completed scores kept, each slot filled by its first non-infra attempt, at most 2 rounds, then run failed and the owner decides. Must-FAIL: fixture data breaching each limit → invalid; control → ruled.
- [ ] The analysis report computes, on fixture data: primary endpoint · symptom measures · pass@1 + pass^k · Unknowns separately · bootstrap over tasks · cost vs D5 · the R-b rule; a must-FAIL fixture for Unknown handling.

## Touches
`evals/ab/` · `docs/research/logs/`

## Assumes
- **blocked-by:** TASK-533 (harness), TASK-537..540 (task corpus).
- **G2 note (Codex intake R5, carried by owner ruling, not fixed at intake):** the "exactly 3 slots per cell (96)" denominator conflicts with the validity limits when a slot is still infra-lost after 2 replacement rounds (95 filled + 1 lost passes both limits). G2 rules one: every slot filled before any ruling (unfilled after round 2 → run failed), or a frozen reduced denominator.

## Tracker
research §7 Graders + Pre-registered decision procedure
