---
sprint: 944
slug: no-gate-unmarked-closed
owner: Maintainer
last_updated: 2026-08-24
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-944 — Execution Log

<!-- MUST FAIL: no-gate-risk-unmarked.

     The legacy / forgetful shape: a bare `no-gate-discovered` with no class, followed by a close.
     Reading this as `low` would silently reinstate the exact defect ADR-033 closed, and would do it
     for every run that simply forgot the marker -- absence read as consent, which is the same
     reasoning that makes a missing ask channel a BLOCK rather than a default-yes.

     This case is why the marker is required rather than optional. Without it the rule would be
     opt-in, and the runs most likely to skip it are the ones least likely to have thought about
     risk at all. -->

### 2026-08-24 | run-complete | run exited

run · 4 of 4 DoD ticked

system-verify · no-gate-discovered · no gate declared

run · $3.10 · 18 turns · 8 min · 4 of 4 units · inline

### 2026-08-24 | close |

Sprint closed. Retro filed, four-bucket routing complete.
