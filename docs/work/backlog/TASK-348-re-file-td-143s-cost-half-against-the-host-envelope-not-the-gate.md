---
id: TASK-348
title: "Re-file TD-143's cost half against the HOST envelope, not the gate"
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
state: ready
---

# TASK-348 — Re-file TD-143's cost half against the HOST envelope, not the gate

## Why

origin note: re-filed at the SPRINT-100 promote governance review; its predecessor TASK-344 shipped and was pruned

## Done when

- [ ] `TD-143`'s open half names a subject that exists. SPRINT-099 T1 measured the gate at **~9.5 MB, moving 320 kB across 547 s**, while system free memory swung **695 MB** around it — so there is no gate memory cost to reduce and the row's remaining half currently points at nothing. Either re-aim it at the host envelope it actually depends on (562 MB free of 14 078 MB, `vmmemWSL` 1 989 MB, three `claude` processes 1 178 MB, commit 41.3/56.7 GB), or rule the row closed on the grounds that the mechanism is now known and the cost is not ours to pay.

## Touches

- `TECH-DEBT.md` (TD-143) · possibly an ADR if the ruling is hard-to-reverse

## Assumes

- none — the measurement is committed at `docs/research/qa-check-memory-profile.md`

## Tracker

- TD-143 (severity: high, open — its cost half; the cheap half shipped as SPRINT-097 T4)
