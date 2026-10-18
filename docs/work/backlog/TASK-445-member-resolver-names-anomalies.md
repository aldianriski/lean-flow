---
id: TASK-445
title: "Make the member resolver name every anomaly instead of dropping the member"
epic: EPIC-022
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-445 — The member resolver names anomalies

## Why

`resolveMembers` skips any id that matches zero or two files (`matches.length !== 1 → continue`), so a stray duplicate mid-move
makes every caller that relies on it (authority, completeness, observed, verify-reaches) silently check less (TD-188). The
task-origin guard and the resolver disagree on what the store is (TD-190), and `--no-members` turns legs off without a word
(TD-198). EPIC-022 Closed-when 7 asks for a resolver that names anomalies. `sprint-members.ts` is reached by `conformance.sh`.

## Done when

- [ ] `resolveMembers` returns its anomalies (an id matching two files, an id matching none, a file outside
      `docs/work/<folder>/`) beside its members, and every caller prints each one as a named finding.
- [ ] The task-origin guard and the resolver count the same store population, and `--no-members` prints that member legs are off.
- [ ] A retained must-FAIL fixture per anomaly, each naming its finding, and a control that resolves cleanly.
- [ ] No verdict moves on today's corpus: 0 duplicate ids and 0 nested files exist, so every existing check stays as it is.
- [ ] Full Tier G bar: seeded breaks each redden exactly their case, and an isolated outside review.

## Touches

- scripts/lib/sprint-members.ts · scripts/lib/check-authority.ts · scripts/lib/check-layers-completeness.ts ·
  scripts/lib/check-layers-observed.ts · scripts/lib/check-verify-reaches.ts · scripts/lib/check-task-origin.sh · evals/

## Assumes

- Shares `sprint-members.ts` with TASK-443, and three checkers with TASK-443/444; the commit order is set at G2.
- Whether an anomaly FAILs or warns is ruled at G2 per finding.

## Tracker

- EPIC-022 Closed-when 7 · TD-188 · TD-190 · TD-198 · SPRINT-127 intake recon (resolver census)
