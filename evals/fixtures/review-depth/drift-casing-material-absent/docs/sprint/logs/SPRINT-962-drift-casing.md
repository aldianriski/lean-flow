---
sprint: 962
slug: drift-casing
owner: Maintainer
last_updated: 2026-08-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-962 — Execution Log

<!-- MUST FAIL: review-depth-material-absent, reached through a DRIFTED consequence line
     (SPRINT-086 T4 revise). The line below capitalises both field names -- `Behaviour:material ·
     Governance:high`, the exact drift shape the independent review named. Before T4 revise, the
     fixed-string anchor required the literal lowercase tokens `behaviour:` / `governance:`, so a
     capitalised field name meant the whole line failed to match and the checker read the file as
     carrying no consequence line at all, silently. Field-name casing is folded before the anchor is
     applied, so this now matches and both dimensions -- governance:high too -- correctly FAIL. -->

### 2026-08-25 | progress | T2 — a shared retry helper rewritten

Rewrote the shared retry/backoff helper every command wrapper calls; running behaviour changes for
every caller. No independent pass examined the change this session.

consequence · T2 · Behaviour:material · Governance:high
