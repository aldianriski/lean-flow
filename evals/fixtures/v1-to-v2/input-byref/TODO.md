---
owner: Maintainer
last_updated: 2026-09-30
update_trigger: fixture -- static, never refreshed
status: current
---

# v1-to-v2 fixture (by-reference) — TODO.md

> Fixture input for `evals/run-v1-to-v2-fixtures.ts` (SPRINT-111 T1). One synthetic Backlog task; the
> active sprint beside it is by-reference (`## Members`), its members already live in `docs/work/`.

---

## Backlog

### P2 — Follow-on

- [ ] TASK-921 — Log the upload step's retry count  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       X
      authority:  J1
      done-when:  each retry logs its attempt number
      touches:    scripts/upload.ts
      depends-on: none
      assumes:    none
      tracker:    none
      origin:     manual
      state:      ready
