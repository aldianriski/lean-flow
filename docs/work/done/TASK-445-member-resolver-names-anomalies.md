---
id: TASK-445
sprint: SPRINT-128
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

- [x] `resolveMembers` returns its anomalies (an id matching two files, an id matching none, a file outside ✓ resolveMembersChecked returns members and anomalies; every caller, the CLI included, prints each by its shared name; plain resolver deleted (496b1c76)
      `docs/work/<folder>/`) beside its members, and every caller prints each one as a named finding.
- [x] The task-origin guard and the resolver count the same store population, and `--no-members` prints that member legs are off. ✓ task-origin counts the same store population; --no-members prints its NOTE
- [x] A retained must-FAIL fixture per anomaly, each naming its finding, and a control that resolves cleanly. ✓ mechanical: must-FAIL per kind with a clean control, through four checkers and the CLI; empty-store and CLI later-line cases (Codex R1)
- [x] No verdict moves on today's corpus: 0 duplicate ids and 0 nested files exist, so every existing check stays as it is. ✓ mechanical: old-vs-new on 127 archived + live, zero changed lines; conformance A/B identical; post-merge rc 0, progress counts only
- [x] Full Tier G bar: seeded breaks each redden exactly their case, and an isolated outside review. ✓ mechanical: seeds A1-A5, S1-S2, Q1, Q4 each redden only their case; coordinator re-seeded the ambiguous drop (4 + 3); Codex R1 -> R2 CLEAR

## Touches

- scripts/lib/sprint-members.ts · scripts/lib/check-authority.ts · scripts/lib/check-layers-completeness.ts ·
  scripts/lib/check-layers-observed.ts · scripts/lib/check-verify-reaches.ts · scripts/lib/check-task-origin.sh · evals/

## Assumes

- Shares `sprint-members.ts` with TASK-443, and three checkers with TASK-443/444; the commit order is set at G2.
- Whether an anomaly FAILs or warns is ruled at G2 per finding.

## Tracker

- EPIC-022 Closed-when 7 · TD-188 · TD-190 · TD-198 · SPRINT-127 intake recon (resolver census)
