---
owner: Maintainer
last_updated: 2026-08-24
update_trigger: The case is re-run (Last run / Result updated in place), or /orchestrator's gates or scripts/qa-check.sh change
status: current
---

<!-- QA test-case instance — see docs/qa/README.md. Update Last run / Result in place each run. -->

# QA-003 — orchestrator gates, then the structural QA check stays green

- **Area under test:** `/orchestrator sprint-bulk` (G1/G2) + `scripts/qa-check.sh`
- **Preconditions / fixture:** an active sprint with open DoD; a clean tree
- **Last run:** 2026-06-21 — pass

## Steps
1. `/orchestrator sprint-bulk` → Batch G1 (scope) + Batch G2 (design + shared-file ownership), human-approved.
2. Implement each `Tn`; after any doc/count change run `sh scripts/qa-check.sh`.
3. Tick DoD `[x]`, append the Execution Log, commit per task.

## Expected
Gates block on any unknown; `qa-check` exits 0 (caps + claims-vs-disk counts + frontmatter); each task commits with its DoD ticked.

## Result
pass — SPRINT-008 T1–T3: gates approved; `qa-check` 42 pass / 0 fail after each task; commits `d847df1` · `d36e5d8` · `780cb51`.
