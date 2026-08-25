---
sprint: 959
slug: attended-absent-material
owner: Maintainer
last_updated: 2026-08-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-959 — Execution Log

<!-- MUST FAIL: review-depth-material-absent, reached via the ATTENDED schema (TD-092).

     The behaviour half of the same absence branch, kept as its own fixture the same way the
     original governance/behaviour pair was split (either dimension alone must trip this). The
     narrative below discusses "behaviour change" and "review" in plain sentences and never spells
     either marker as the exact anchored line, so a naive substring scan would false-positive here
     first (L-108) -- only the fixed-format `consequence ·` line is a legitimate hit. -->

### 2026-08-25 | progress | T2 — the running system now writes a second record on save

Added a write path that persists a derived value alongside the primary one. The running system does
something different than it did before this change: any reader of the derived field now sees data
that used to be absent. No independent pass was dispatched this session; the diff went in on the
strength of a self-read.

consequence · T2 · behaviour:material · governance:low
