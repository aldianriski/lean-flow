---
id: TASK-507
title: "Run the gate on a Linux, Windows and macOS CI matrix once a cross-OS defect is on record"
priority: P3
size: M
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: needs-info
depends-on: []
---

# TASK-507 — Run the gate on a Linux, Windows and macOS CI matrix once a cross-OS defect is on record

## Why
anti-slop runs its checks on ubuntu/windows/macos and caught a CRLF bug that way. lean-flow's gate runs on the VPS (Linux)
and the maintainer's Windows host; nothing runs on macOS. ADR-053 needs one of the five reasons, and none is on record yet:
the CRLF learnings (L-011, SPRINT-124) are Windows issues already caught locally.

## Done when
- [ ] The `## Why` names the qualifying reason (the defect that unblocked it) and a G2 review-round cap.
- [ ] The gate runs on all three OSes per push/PR with line endings pinned, and a red job does not cancel the others.
- [ ] A retained must-FAIL case: a seeded CRLF or path-separator break reddens the affected OS job.
- [ ] CHANGELOG line.

## Assumes
- **open:** which of ADR-053's five reasons applies.
- **blocked-by:** a macOS consumer defect, or a CRLF/path regression the VPS + Windows runs did not catch.

## Tracker
anti-slop adoption scan 2026-10-25, item 11 (parked by owner ruling).
