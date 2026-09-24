---
owner: Maintainer
last_updated: 2026-09-24
update_trigger: fixture -- static, never refreshed
status: current
---

# v1-to-v2 fixture — TODO.md

> Fixture input for `evals/run-v1-to-v2-fixtures.ts` (SPRINT-106 T4). Not a real project tracker —
> three synthetic Backlog tasks, one of which (`TASK-915`) also appears in the Plan of the paired
> fixture sprint file `docs/sprint/SPRINT-903-fixture-sprint.md`.

---

## Backlog

### P1 — Next Phase Required

- [ ] TASK-913 — Add a retry to the flaky upload step  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       X
      authority:  J1
      done-when:  the upload step retries twice on a transient failure before giving up
      why:        one flaky CI run a week traces to this step
      touches:    scripts/upload.ts
      depends-on: none
      assumes:    none
      tracker:    TD-901
      origin:     manual
      state:      ready

### P2 — Follow-on

- [ ] TASK-914 — Document the retry backoff in the deploy guide  [size: S] [risk: low] [AFK]
      class:      execution
      tier:       P
      authority:  J1
      done-when:  docs/deployment/deployment-guide.md names the retry/backoff behaviour
      touches:    docs/deployment/deployment-guide.md
      depends-on: TASK-913
      assumes:    none
      tracker:    none
      origin:     manual
      state:      ready

- [ ] TASK-915 — Cap the upload step's total wall time  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       X
      authority:  J1
      done-when:  the upload step aborts past a fixed wall-clock ceiling
      why:        an unbounded retry once hung a whole run
      touches:    scripts/upload.ts
      depends-on: TASK-913
      assumes:    none
      tracker:    TD-902
      origin:     manual
      state:      ready
