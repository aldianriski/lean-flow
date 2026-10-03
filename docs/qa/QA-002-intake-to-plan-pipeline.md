---
owner: Maintainer
last_updated: 2026-08-24
update_trigger: The case is re-run (Last run / Result updated in place), or the /task-decomposer -> /triage -> promote pipeline changes
status: current
---

<!-- QA test-case instance — see docs/qa/README.md. Update Last run / Result in place each run. -->

# QA-002 — intake-to-plan pipeline yields a sprint with DoD

- **Area under test:** `/task-decomposer` → `/triage` → `/lean-doc-generator promote`
- **Preconditions / fixture:** a repo with a `docs/work/backlog/` store and a freeform feature intent
- **Last run:** 2026-06-21 — pass

## Steps
1. `/task-decomposer "<intent>"` → after `approve`, write one `docs/work/backlog/TASK-NNN-<slug>.md` per task (vertical slices, `assumes:`, observable done-when).
2. `/triage` → rank into P-tiers, set states, route rejects to `.out-of-scope/`.
3. `/lean-doc-generator promote` → render `docs/sprint/SPRINT-NNN` (`status: active`) listing each task under `## Members` by reference, with only sprint-scoped meta in each Plan `Tn`; each task's DoD stays in its own file's `## Done when`.

## Expected
after step 1 the new task files exist in `docs/work/backlog/`; after step 3 the promoted files sit in `docs/work/todo/` with `sprint: SPRINT-NNN` stamped (`git mv` in its own commit) and only unpromoted tasks remain in `backlog/`; the sprint file has one `## Members` entry and one `Tn` per promoted task, member DoD `[ ]` in the task files, and is found by `status: active`.

## Result
pass — exercised on the real repo this session: TASK-009…017 decomposed → triaged (P1/P2/P3) → SPRINT-008 promoted (4 tasks, DoD rendered, pointer set).
