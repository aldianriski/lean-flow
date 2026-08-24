---
sprint: 942
slug: no-gate-material-parked
owner: Maintainer
last_updated: 2026-08-24
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-942 — Execution Log

<!-- CONTROL: must stay PASS. The correctly-parked unattended shape.

     A material change, no gate discovered, and the run PARKED the close rather than deciding
     anything -- so no `| close |` event was ever written. This is what obeying the rule looks like
     in the log, not a separate branch. It mirrors the existing parked-unattended case for the FAIL
     family, and exists so a future regression that started failing on the marker alone (rather than
     on marker + close) would redden here instead of parking every honest run. -->

### 2026-08-24 | run-complete | run exited

run · 2 of 3 DoD ticked

system-verify · no-gate-discovered(material) · no gate declared

T3 · parked-hitl · close parked: material change with no discovered gate, owner ruling required

run · $2.10 · 12 turns · 5 min · 2 of 3 units · inline
