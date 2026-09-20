---
sprint: 103
slug: port-the-measured-hotspots
owner: Maintainer
last_updated: 2026-09-20
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-103 — Execution Log

> Append-only companion to [`../SPRINT-103-port-the-measured-hotspots.md`](../SPRINT-103-port-the-measured-hotspots.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote (`bfa3fec`). A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-20 | progress | batch G1 + G2 signed off; two rulings the Plan did not settle

`/orchestrator sprint-bulk`, attended. Base ref `cc3bcc8` == HEAD. Pre-dispatch preflight clean:
dependency graph acyclic (only T4→T3), no wave-rank conflict.

**G1** — goal restated, sizes M/M/M/S/S (no `L`, split already done at promote), blast radius read
off each `Layers:`, § Scope's out-list taken as written. A1/A2/A3 are unconfirmed *by design* (D2
makes each task's own measurement the confirm path), so they do not block G2 — they are this
sprint's subject, not its premise.

**G2 ruling 1 — `docs/research/logs/qa-gate-timing.md` is coordinator-owned.** D3 assigns
`scripts/qa-check.sh` to the coordinator because four tasks share it; it does not name the timing
log, which **all five** tasks write. Same shape as the sprint file and this Log — written by every
task, owned by none — so it takes the same rule: a dispatched agent returns its Round text in its
report and the coordinator appends in merge order. Recorded here rather than inferred at merge time.

**G2 ruling 2 — measurement is serialized; the host is a shared resource no `Layers:` declares.**
T1/T2/T5 are file-disjoint, so the dispatch rule says parallel worktrees. But their first DoD is a
wall-clock measurement and their last is a before/after range over ≥3 runs, on a host Round 16
records at >3× run-to-run variance. Three agents timing three harnesses concurrently would measure
contention, not the targets — the sprint would return numbers it cannot stand behind, which is the
SPRINT-102 failure it exists to correct. File-disjointness is the wrong discriminator when the
deliverable *is* a timing. Sequencing approved by the owner:

    Wave 0  coordinator, serial   measure all five  → one Round
    Rulings T3 → owner (J2); T1/T2/T4/T5 on the numbers
    Wave 1  parallel worktrees    port (no timing inside)
    Wave 2  coordinator, serial   before/after ×3 alternating

Owner also scoped this session: **stop after the rulings**, before any porting starts.

consequence · T0 · behaviour:low · governance:high

### 2026-09-20 | progress | Wave 0 source census — three of the five targets are one program

Static census only; no timings yet (see the `blocker` entry below). Counts derived with
shape-anchored patterns after a substring pattern (`grep -c 'git init'`) undercounted 13 sites as 2
— the lines read `git -C "$d" init -q`, so the literal never matched. Recorded because it is the
CLAUDE.md cross-check rule firing on this sprint's own first query.

| Task | Target | Per-run invocations | Invokes |
|---|---|---|---|
| T1 | `run-sprint-family-fixtures.sh` · 305 s | **68** engine runs (28 `assert_finding` + 40 `assert_absent`) · 13 git repos · ~139 git spawns | `conformance-engine.sh` + full `spec/STANDARD.md` |
| T2 | `run-layers-observed-fixtures.sh` · 153 s | ~55 checker runs · **29** git repos · ~92 git spawns | `check-layers-observed.sh` (644 lines) |
| T3 | leg 2f-ter · 139 s | 1 full sweep, **`QA_FULL=1` only** | `conformance-engine.sh` |
| T4 | `run-conformance-engine-fixtures.sh` · 98 s | **40** engine runs | `conformance-engine.sh` |
| T5 | `run-qa-budget-position-fixtures.sh` · 66 s | 3 real `qa-check.sh` runs inside `WINDOW=60` | itself |

**T1 + T3 + T4 = 542 s — 71% of the top five, and it is one program**, `conformance-engine.sh`: the
consumer-facing file T3 reserves to the owner as `J2`. T1 works out at 305 s / 68 ≈ 4.5 s per engine
invocation against a *tiny fixture dir*, which is far too large to be `fork()` overhead and points
at the engine's own work — most likely re-parsing the whole shipped spec on every one of the 68
calls. If the timings bear that out, "port the harness" is the wrong lever for T1 and T4 alike and
the sprint's question collapses into T3's. **Not yet ruled** — D2 requires the measurement, and this
entry is explicitly the half that is not one.

**Two findings that do not depend on a timing:**

- **T5 looks unportable by construction.** Its 66 s is not overhead: case 2 deliberately runs a
  checkpoint-stripped `qa-check.sh` until a 60 s `timeout` kills it, in order to demonstrate the
  silent-until-the-ceiling shape TD-084 exists to stop. A TypeScript rewrite still has to wait out
  `WINDOW`. The only lever is `WINDOW` itself, which trades directly against flakiness under load.
- **T5 shares TD-167's shape** (its second DoD, discharged either way). Case 2 asserts *no budget
  verdict within 60 s* — an assertion whose input is a wall clock. A host fast enough to reach leg
  12's own loop-internal check inside the window reddens correct code. Second sighting; TD-167's fix
  direction should assume the shape is not isolated to `run-qa-budget-fixtures.sh` case 12.

**Incidental, not touched:** `run-sprint-family-fixtures.sh` defines `learn_entry()` twice (lines 230
and 442); the second silently overrides the first for every call after it. Outside § Scope — named
here, not fixed, per the surgical-changes rule.

consequence · T1-T5 · behaviour:low · governance:low

### 2026-09-20 | blocker | Wave 0 measurement run killed by the harness — no timings taken

`/orchestrator` started the five serial measurements at 15:31. At ~15:33 Claude Code stopped the
background command because **the system was critically low on memory** while the session was idle.
This is a host condition, not a defect in the run: the harness's own note states it says nothing
about the command. T1 pass 1 had not completed, the output file is empty, and **nothing is
salvageable** — no target has a measurement.

Not restarted: the harness instructs that it be re-run only when asked, since memory may still be
short. **Every task's first DoD is therefore still open**, and no ruling in this sprint is reachable
until it is — which is D2 working as designed, not a workaround to route around.

**State for the resuming session:** batch G1 and G2 are signed (entry above) and do not need
re-running. The source census stands. Base ref has moved — HEAD was `cc3bcc8` at preflight and is now
`f011958` (`epic(016): admit workdoo SPRINT-006`, committed by another stream mid-session, touching
no file in any SPRINT-103 `Layers:`). Re-derive the base ref before dispatching Wave 1.

consequence · T0 · behaviour:low · governance:low
