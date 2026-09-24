---
owner: Maintainer
last_updated: 2026-09-24
update_trigger: fixture -- static, never refreshed
status: current
---

# v1-to-v2 conflict fixture — TODO.md

> Fixture input for `evals/run-v1-to-v2-fixtures.ts` § conflict-blocks-removal (SPRINT-106 T4
> revise round, HIGH #2). One clean Backlog task (`TASK-918`, resolves fine) plus one Plan task
> (`TASK-917`, cited by `docs/sprint/SPRINT-904-conflict-fixture-sprint.md`) whose store file
> **already exists** in `docs/work/` with a tick state that disagrees with the Plan — a real
> conflict, owner-unresolved.

---

## Backlog

### P2 — Follow-on

- [ ] TASK-918 — Log the upload step's retry count  [size: S] [risk: low] [AFK]
      class:      execution
      tier:       P
      authority:  J1
      done-when:  the upload step logs how many retries it took
      touches:    scripts/upload.ts
      depends-on: none
      assumes:    none
      tracker:    none
      origin:     manual
      state:      ready
