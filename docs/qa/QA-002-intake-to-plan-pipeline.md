---
owner: Maintainer
last_updated: 2026-08-24
update_trigger: The case is re-run (Last run / Result updated in place), or the /task-decomposer -> /triage -> promote pipeline changes
status: current
---

<!-- QA test-case instance — see docs/qa/README.md. Update Last run / Result in place each run. -->

# QA-002 — intake-to-plan pipeline yields a sprint with DoD

- **Area under test:** `/task-decomposer` → `/triage` → `/lean-doc-generator promote`
- **Preconditions / fixture:** a repo with a `TODO.md` Backlog and a freeform feature intent
- **Last run:** 2026-06-21 — pass

## Steps
1. `/task-decomposer "<intent>"` → after `approve`, append `TASK-NNN` entries (vertical slices, `assumes:`, observable done-when).
2. `/triage` → rank into P-tiers, set states, route rejects to `.out-of-scope/`.
3. `/lean-doc-generator promote` → render `docs/sprint/SPRINT-NNN` with each task as a Plan `Tn` + DoD checkboxes; set the Active Sprint pointer.

## Expected
TODO gains well-formed `TASK` entries; a sprint file exists with one `Tn` per promoted task and DoD `[ ]`; the Active Sprint pointer resolves to it.

## Result
pass — exercised on the real repo this session: TASK-009…017 decomposed → triaged (P1/P2/P3) → SPRINT-008 promoted (4 tasks, DoD rendered, pointer set).
