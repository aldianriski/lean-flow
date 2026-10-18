---
owner: Maintainer
last_updated: 2026-10-18
update_trigger: fixture -- static, never refreshed
status: current
---

# v1-to-v2 fixture — TODO.md (withheld: missing tier)

> Fixture input for `evals/run-v1-to-v2-fixtures.ts` (SPRINT-125 T8, TASK-433). Two synthetic Backlog
> tasks: `TASK-941` complete, `TASK-942` lacks `tier:`.

---

## Backlog

### P2 — Follow-on

- [ ] TASK-941 — Add a timeout to the sync step  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       X
      authority:  J1
      done-when:  the sync step aborts after 60 seconds
      why:        a hung sync blocks the nightly run
      touches:    scripts/sync.ts
      depends-on: none
      assumes:    none
      tracker:    none
      origin:     manual
      state:      ready

- [ ] TASK-942 — Log the sync step's duration  [size: S] [risk: low] [AFK]
      class:      execution
      authority:  J1
      done-when:  the sync step logs its wall time on exit
      why:        no timing data exists for the sync step
      touches:    scripts/sync.ts
      depends-on: none
      assumes:    none
      tracker:    none
      origin:     manual
      state:      ready
