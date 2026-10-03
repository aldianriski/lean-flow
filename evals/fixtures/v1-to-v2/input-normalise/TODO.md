---
owner: Maintainer
last_updated: 2026-10-03
update_trigger: fixture -- static, never refreshed
status: current
---

# v1-to-v2 fixture (normalise) — TODO.md

> Fixture input for `evals/run-v1-to-v2-fixtures.ts` (SPRINT-113 T4, TASK-397). Three synthetic Backlog
> rows, each carrying one shape the migrate prose must normalise: a decorated enum, a prose
> `depends-on:`, and a lettered done-when.

---

## Backlog

### P2 — Follow-on

- [ ] TASK-931 — Name the guard tier on the upload verifier  [size: S] [risk: low] [HITL]
      class:      execution   # was "spike" before G2
      tier:       G (guard — the verifier gates the upload)
      authority:  J1
      done-when:  the verifier's tier is declared in its header
      why:        the verifier is the only check that runs before upload
      touches:    scripts/verify-upload.ts
      depends-on: none
      assumes:    none
      tracker:    none
      origin:     manual
      state:      ready

- [ ] TASK-932 — Document the upload step's rollback  [size: S] [risk: low] [AFK]
      class:      execution
      tier:       P
      authority:  J1
      done-when:  the deploy guide names the rollback command
      touches:    docs/deployment/deployment-guide.md
      depends-on: none — but the rollback script must exist first
      assumes:    none
      tracker:    none
      origin:     manual
      state:      ready

- [ ] TASK-933 — Check the upload step's three exit paths  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       X
      authority:  J1
      done-when:  (a) exit 0 on success; (b) exit 1 on a transient failure after retries; (c) exit 2 on a bad argument
      touches:    scripts/upload.ts
      depends-on: none
      assumes:    none
      tracker:    none
      origin:     manual
      state:      ready

- [ ] TASK-934 — Pin the retry ceiling  [size: S] [risk: low] [HITL]
      class:      execution
      tier:G(pins the ceiling)
      authority:  J1
      done-when:  (A) the ceiling is set; (B) the ceiling is logged
      touches:    scripts/upload.ts
      depends-on: none
      assumes:    none
      tracker:    none
      origin:     manual
      state:      ready

- [ ] TASK-935 — Log the upload step's outcome  [size: S] [risk: low] [AFK]
      class:      execution
      tier:       X
      authority:  J1
      done-when:  a) log the attempt; b) log the outcome
      touches:    scripts/upload.ts
      depends-on: TASK-931 — after its rollout
      assumes:    none
      tracker:    none
      origin:     manual
      state:      ready
