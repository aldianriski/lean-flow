---
id: TASK-319
title: "Prove § Closed-when 1 with a real unattended run against the repaired reaper"
epic: EPIC-015
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: X
authority: J2
origin: close-retro
state: ready
sprint: SPRINT-118
---

# TASK-319 — Prove § Closed-when 1 with a real unattended run against the repaired reaper

## Why

→ **PARKED again at SPRINT-101 (T1) — but NOT on the same blocker, and that is the news.** The ten-dimension `approval_envelope:` is now **signed, recorded in frontmatter and verifying** (`all 10 dimensions covered, pinned @ 2472fab`), so the `AUTHORITY_BOUNDARY` that parked SPRINT-098 T4 is **cleared**. What stands instead is the **gate**: `night-run.sh` refuses to fire on a red one, and no configuration of this gate is green — bare it truncates with 13 harnesses unrun, raised it completes in 945 s against a 600 s external ceiling (measured, **TD-117**; owned by **`TASK-349`**). Unattempted, not attempted-and-failed. Still paired with `TASK-188` per the SPRINT-097
`/triage` ruled. **CRITERION CORRECTED at the 2026-09-16 `/triage` — the spec this row
pointed at misstates the rule it cites.** It read *"the seeded **not-all-J2** vehicle"*;
pre-flight item 3 (`night-run.md:295`, STRICT per TD-109) actually requires *"**every** task
in the run is declared `J0` or `J1` — a declared `J2` task **FAILS** this item."* A Plan that
is merely "not all-J2" can still carry a declared `J2` and is **not launchable**, so the old
criterion was satisfiable by a vehicle that could never fire. Build the vehicle as **all
`J0`/`J1`, zero declared `J2`**, and record `gates_signed:` in its frontmatter (item 4 —
absent from SPRINT-101, the foreclosure that was queued behind the gate). Fixed by
`TASK-352`, which is a **prerequisite** for this row. Full spec — the seeded vehicle · the `--mode overnight` fire ·
the terminal-state agreement check against the run's own committed log — lives in the sprint
file, together with **D3** (T4's run is not gated on T2/T3 being green, so no unrelated
slippage can foreclose its vehicle — L-111). Pointer, not a second copy (L-008).

## Done when

- [x] A real unattended run (`--mode overnight`, `gates_signed:` recorded, an all-J0/J1 vehicle) fires against the repaired reaper, and the terminal-state agreement check passes against that run's committed log — closing EPIC-015 Closed-when 1. ✓ fired 2026-10-07T03:09:34Z on the VPS (`~/lf-run`, owner-delegated) against SPRINT-119 (all-J0, `gates_signed: G1,G2 @ 85b3ffc`); launcher `ALIVE`, exit 0; reaper wrote `terminal · PLAN_EXHAUSTED … [derived]`; `check-night-run-rollup.ts` on the committed log: `PASS … agrees with its per-task lines`; `--close` 4 pass 0 fail incl. `close fired-line`; merged `312ddea`

## Assumes

- none

## Tracker

- EPIC-015 § Closed-when 1 · TD-112 (resolved → SPRINT-093 T1) · TD-110 (resolved → T3) · L-179
- pair-with: **`TASK-188` — promote them into the SAME sprint** (SPRINT-097 `/triage`, 2026-09-11). This task's run is the only realistic vehicle TASK-188 has: 188 needs a real unattended run that stops **mid-Plan**, opportunistically, and 319 is the only task that deliberately fires one. Promoting 319 alone spends that artifact and leaves 188 waiting for the next one. **This has already happened**: SPRINT-060 promoted 188 alongside four HITL tasks, G2 then correctly ruled the run interactive, and that ruling foreclosed the only vehicle 188 had (L-111). Pairing them does not guarantee 188's trigger — nothing can, it is opportunistic by design — it guarantees that if the trigger occurs, someone is there to claim it.
