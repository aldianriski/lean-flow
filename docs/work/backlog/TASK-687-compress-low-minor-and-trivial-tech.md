---
id: TASK-687
title: "Compress low, minor and trivial TECH-DEBT rows to Summary, Mitigation and an evidence pointer"
priority: P2
size: M
risk: med
autonomy: AFK
class: mechanical-ingest
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-686]
---
# TASK-687 — Compress low, minor and trivial TECH-DEBT rows to Summary, Mitigation and an evidence pointer

## Why
Rows average 13.3 lines in a 2,028-line file. The owner chose to compress verbose rows. The TECH-DEBT header says to cite evidence for the problem, so a one-line `Evidence:` pointer (sprint or commit id) stays.

## Done when
- [ ] Every open row of severity low, minor or trivial is reduced to header line + Summary + Mitigation + a one-line `Evidence:` pointer + any line carrying an open condition (`Re-file fresh if`, `route`, `blocked`, `unblock` or another condition), which is kept byte-identical even when it sits in Impact or Evidence; other Impact and Evidence text is removed. The 13 medium rows stay uncompressed. The measured line delta is reported.
- [ ] Field census before/after: the `TD-NNN` id set is identical; every row's severity, status and created are byte-identical; Summary and Mitigation are byte-identical; every line containing `Re-file fresh if`, `route`, `blocked`, `unblock` or another open condition is present after.
- [ ] Negative: a line carrying an open condition is never removed or reworded, even when it sits in Impact or Evidence (the census names each such row).

## Touches
`TECH-DEBT.md` only.

## Assumes
- Runs after TASK-686's closures; already-closed rows are skipped.
- Compression is one pass; git keeps the removed text.

## Tracker
Owner intake 2026-11-21, area 2; answer Q3.
