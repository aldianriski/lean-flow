---
sprint: 090
slug: run-evidence-vehicle
owner: Maintainer
last_updated: 2026-08-26
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-090 — Execution Log

> Append-only companion to [`../SPRINT-090-run-evidence-vehicle.md`](../SPRINT-090-run-evidence-vehicle.md). Uncapped by design
> (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-26 | promote | Plan seeded as SPRINT-089 T2's run vehicle, frozen at b7437de

Created per `TASK-301`, whose `done-when` requires a **separate** Plan: re-declaring SPRINT-089's
honestly-`HITL` tasks as AFK to make a run fire would be reshaping a task to dodge a gate (SPRINT-089
D3). One AFK/J1 task the run may execute, one J2 it must park.

Two hazards were found **before the Plan froze**, which is the only place they are cheap:

1. **T1's DoD was unsatisfiable as first drafted.** `gen-index.sh` produced *no change* — the index was
   already current — so "its output is committed by the unattended run" could never be met. Fixed by
   causing staleness honestly rather than contriving it: `L-175` was appended to `docs/LEARNINGS.md`,
   which is close-Retro work this session owed anyway and which the generator reads.
2. **A1's confirm method would have consumed T1's work.** "Run the generator interactively and check
   it works" leaves the index *current*, so the run would regenerate nothing, commit nothing, and
   satisfy DoD 1 vacuously while looking green. Now `gen-index.sh --check` (exit 1 = stale, no write).
   Verified stale, index untouched.

consequence · T1 · behaviour:low · governance:high

### 2026-08-26 | blocker | pre-flight item 3 forbids the Plan shape the machinery is built for — ruled, not patched

Checking this Plan's task classes against Part 1 pre-flight item 3 — which is SPRINT-089 T2's DoD 5,
doing precisely the job it was written for — found a contradiction in the **shipped** contract.

Item 3 reads *"every task in the run is AFK-class"*; `CONTEXT.md` states `J2 ⇒ HITL always`; `TASK-301`
requires a seeded J2. So this Plan fails pre-flight **by the letter**, and no Plan satisfying TASK-301
could ever fire. That is the same acceptance being foreclosed a **second** time — SPRINT-088's three
DoD died on an all-`HITL` Plan (L-111), the fix was a purpose-built Plan, and the purpose-built Plan is
blocked by a different clause with the same effect.

**Owner ruling: the intended reading.** Item 3 means *no task needs a human to be **reached***; a
declared `J2` that parks by design satisfies it. What settles it is that the strict reading makes three
shipped mechanisms unreachable code — `check-authority.sh`'s HONOURED assertion, the
`AUTHORITY_BOUNDARY` terminal state, and Part 0 step 2's park record are all written for a J2 **task in
a Plan**. `check-authority.sh` passes this Plan with `T2 J2` today.

**Ruled and written down rather than assumed** — this is [[L-173]]'s exact shape, a contract that
disagrees with itself where the looser reading wins silently because it needs no extra code. Recorded
at D4 in the Plan itself, because the run reads that file and nothing else (L-099 · L-151).

**Not patched here.** SPRINT-089 § Scope defers re-opening SPRINT-088's machinery, so the wording is
untouched and filed as **TD-109** (`severity: high`) instead. Noted there: item 3 is today a human
checklist line that `night-run.sh` does not enforce, so the defect currently costs a *refused* launch
rather than a wrong one — a checker built from the strict wording would make it a hard block.

consequence · T2 · behaviour:material · governance:high
