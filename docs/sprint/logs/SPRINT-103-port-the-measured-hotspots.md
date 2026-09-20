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

### 2026-09-20 | progress | T1 ruled on a measured mechanism — NOT spawn-shaped, do not port

Wave 0 was not restarted: memory is still at **2.2% free** (303 MB of 14,078 MB), which is the
condition that killed it, and a wall-clock figure taken under paging measures swap rather than the
target. Instead the mechanism question was answered by **micro-benchmark**, which reaches it at
sub-second cost. Full figures and derivation → `docs/research/logs/qa-gate-timing.md` **Round 17**.

**Measured:** `conformance-engine.sh` against an *empty* directory costs **2.93 s with the shipped
100-rule spec and 0.35 s with 0 rules** — ~26 ms per rule of dispatch paid whether or not anything
is checked. `sys` tracks `user` (1.55 vs 1.32), i.e. subprocess-per-rule, not computation.

**T1 ruling — not spawn-shaped; ported nothing.** The harness makes 68 engine invocations with the
full spec: 68 × 2.93 ≈ **199 s of a measured 305 s is dispatch inside the engine**. A TypeScript port
removes 68 `sh` spawns and leaves all 199 s, because the cost is inside the program the port would
still have to call 68 times. The lever is the **awk-derived reduced spec** — already shipped in this
repo three times (leg 2f-ter, `run-gates-signed-fixtures.sh`, `run-attestation-fixtures.sh`), so
reuse, not new machinery. Projected 68 × 0.72 ≈ **49 s**, saving ~150 s, no port, no coverage change.

**This ruling is D2 working exactly as written.** A1 said the five would respond as SPRINT-102's did;
for T1 they do not, and inheriting that would have bought a port worth a small fraction of the cost.

**The trap, recorded because it nearly shipped:** the harness header claims §9 + §10. Its 68 cases
are **§11 ×29 · §9 ×16 · §12 ×11 · §10 ×10** — §9+§10 is 26 of 68. A reduction built on the header
would leave 40 assertions with no rule to fire, and 40 of the 68 are `assert_absent`, which **passes
when a finding does not appear**. All of them would go green testing nothing — the Tier G silent
false negative, reached by trusting a file's prose about its own population instead of enumerating
it (L-186). Required set is **§9+§10+§11+§12 = 43 rules**. The first estimate written this session
(§9+§10, ~126 s saving) was wrong on exactly this and is superseded.

**Not claimed:** no end-to-end re-derivation of any target exists. 49 s is arithmetic over a
micro-benchmark, not an observed run — which by this sprint's own theme is a hypothesis awaiting
measurement, not a result. T1's remaining DoD stay open.

consequence · T1 · behaviour:low · governance:high

### 2026-09-20 | progress | T5 ruled · T2 and T4 mechanisms measured, rulings provisional

Same constraint as the entry above: no end-to-end harness run was attempted (2.2% free memory), so
these are mechanism findings from source plus sub-second micro-benchmarks, and the two that need a
total to be sure say so.

**T5 — RULED UNPORTABLE. Mechanism recorded; nothing to port.** Its 66 s is not overhead. Case 2
deliberately runs a checkpoint-stripped `qa-check.sh` until a 60 s `timeout` kills it, to demonstrate
the silent-until-the-ceiling shape TD-084 exists to stop; case 1 trips early and case 3 is
`head`-truncated. The harness is **wait-bound by construction** — a TypeScript rewrite still has to
sit out `WINDOW`, because the wait *is* the assertion. The only lever is `WINDOW` itself, which
trades directly against flakiness under load and is a coverage decision (D6), not a port. This is
D2's "ruled unportable" branch and counts as a completed task, not a failed one.

**T5 second DoD — TD-167's shape is present.** Case 2 asserts *no budget verdict within 60 s*: an
assertion whose input is a wall clock. A host fast enough to reach leg 12's own loop-internal check
inside the window reddens correct code. Second sighting of the shape, so TD-167's fix direction
should not assume it is isolated to `run-qa-budget-fixtures.sh` case 12.

**T2 — measured, leans portable, ruling provisional.** `check-layers-observed.sh` costs **11.1–12.2 s
for one real sprint file** (bare guard path: 0.07 s), and `sys` **exceeds** `user` (5.9 vs 3.9) —
the opposite profile from the engine, which is user-dominant. Source: 10 `git` calls, all inside
loops, across 8 loops; the fixture harness adds 29 throwaway git repos and ~92 further git spawns.
That is genuinely spawn/IO-shaped and is the one target of the five where a port is the right
instrument. **Held provisional** because the 153 s total has not been re-derived here, and the split
between process overhead and real history traversal decides how much a port actually recovers.

**T4 — measured, and it is already half-reduced.** Of its 38 engine calls (2 of the earlier 40 were
comment lines), **18 use a 6-rule `spec_s2s6`, 13 use tiny purpose-built specs, and only 7 use the
full shipped spec** — so T1's lever is largely spent here already. Measured: the 6-rule spec costs
1.26–1.33 s against an empty dir. Engine time works out near 7×2.93 + 18×1.3 + 13×~0.4 ≈ **35 s of
a measured 98 s**, leaving ~60 s in fixture construction rather than in the engine. **Ruling held**
for its stated dependency on T3, and because that ~60 s residue is the part no measurement here
touches.

**T4 also supplies T1's implementation template, including the part that is easy to omit.** Its
reduction is awk-derived from the shipped spec *and* carries a drift anchor — a `grep -qE` that
fails the harness if the reduction ever loses `S2.F-TIER`. T1's reduction needs the same guard, or a
§9/§10/§11/§12 row that moves silently empties the reduced spec and 68 cases go green against
nothing. That is the L-186 failure a second time, in the fix rather than in the analysis.

consequence · T2,T4,T5 · behaviour:low · governance:high

### 2026-09-20 | progress | T3 measured — corpus work, kernel-bound; ruling surfaced to the owner

Full figures → `docs/research/logs/qa-gate-timing.md` **Round 18**.

**Measured:** the engine's full-spec sweep against this repo — leg 2f-ter's `QA_FULL=1` work — runs
**173.1 s real / 53.8 user / 81.1 sys**. Round 16 independently measured the same leg at 139 s; 173 s
sits inside this host's ±20% in the direction memory pressure predicts, so two routes agree. Fixed
dispatch is **2.9 s of 173 s (1.7%)**, so T1's dominant cost is nearly absent here.

**Mechanism (DoD 1): corpus size, executed as spawns.** 60% of CPU time is `sys` — the engine shells
out per file per rule, and on Windows each of those pays `fork()` emulation. A computing engine
would be user-dominant; this is not one.

**This inverts Round 17's conclusion for T1, and both hold.** Two different costs in one program:
T1 pays fixed dispatch 68× against tiny dirs (reduced spec fixes it); T3 pays per-file spawns once
against a large corpus (no spec reduction reaches it without dropping rules, which D6 forbids).

**Consumer-facing blast radius (DoD 2, L-015):** an adopter of root `conformance.sh` would observe
the same exit code and report text if a port is correct — and a **new `bun` dependency on their
machine**, where today `sh` suffices. That is a change in what the product requires of its consumer,
and nothing inside this repo's parity testing would surface it.

**DoD 3 and 4 stay open by design** — they require the ruling, which is `J2`. Surfaced to the owner
now with the measurement behind it, per § Owner-action. Not decided here.

consequence · T3 · behaviour:material · governance:high
