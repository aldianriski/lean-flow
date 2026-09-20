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

### 2026-09-20 | progress | T3 RULED by the owner — portable in principle, out of scope here

**Owner ruling (J2, § Owner-action):** the engine's cost is real and a port is the right instrument,
but porting a shipped consumer interface is not a task inside a performance sprint. **T3 closes as a
recorded ruling** — D2's accepted branch — and the port is filed for its own sprint.

Recorded in all three places its different readers reach, which is the whole of L-151 and why one
was not enough:

- **`docs/adr/ADR-043`** — the durable decision, and it records the *constraint the porting sprint
  inherits* rather than the deferral. §4's three-part bar is met by one property specifically: exit-
  code and report-text parity are reversible (a wrong port is fixed by fixing it), but **shipping a
  `bun` requirement to adopters is not** — once they install against it, withdrawing breaks them.
- **`scripts/lib/conformance-engine.sh` header** — 16 comment lines at the top. The ADR is invisible
  to the maintainer who opens this file to make it faster, and that maintainer is the actual reader
  at risk. Verified comment-only: `sh -n` clean and **byte-identical output + identical exit code**
  against the pristine `HEAD` copy over the full 100-rule spec (111 lines, `cmp` clean).
- **`TECH-DEBT.md` TD-168** (high) — the port itself, with the measurement, the three binding
  properties, and an explicit "not measured: whether in-process actually recovers the 81 s of `sys`".

**Id derivation, worth recording because the first query was contaminated.** A bare repo-wide grep
returned maxima of `ADR-999` and `TD-961`. All four high ids trace to `evals/fixtures/` test tokens,
not rows — L-170's exact shape, arriving from `evals/` rather than from `.claude/worktrees/`. Real
maxima are **ADR-042** and **TD-167**, cross-checked by a different selection rule (42 ADR files
against a max of 042 — consecutive, no gaps), so the new ids are **ADR-043** and **TD-168**.

**One near-miss worth keeping.** The first parity check of the engine edit reported a *differing*
exit code (2 vs 1) and 111 lines of divergence. The edit was innocent: the pristine copy had been
written to `/tmp`, so its `dirname $0` sibling lookup for `archive-path.sh` failed and it aborted
before doing any work. Comparing a file against itself across two *locations* is comparing two
environments — CLAUDE.md edit-safety (d). Re-run with both copies in `scripts/lib/`, output is
byte-identical. A less careful read of that first result would have reverted a correct edit.

**Owner also ruled the conditional-DoD disposition:** the `If ported:` criteria that a no-port ruling
leaves inapplicable stay **open now** and are marked `n/a` **at close**, each citing the ruling that
made it inapplicable. Not ticked as satisfied — a sprint closing 31/31 when 14 were never applicable
reads as more work than happened (L-088).

T3 DoD: **4 of 4**. Sprint total **7 of 31**.

consequence · T3 · behaviour:material · governance:high

### 2026-09-20 | progress | T1's 43-rule set confirmed by a second, independent selection rule

The T1 fix rests entirely on one claim — that `run-sprint-family-fixtures.sh` needs §9+§10+§11+§12
and nothing else. That claim was first derived from **case-name prefixes** (`s11-…`), which is a
*naming convention*, not a fact about what the assertions reach. A reduction built on a convention is
the same class of error as one built on the header's prose, one level subtler (L-198: the second
query must vary the SELECTION rule, not the direction of the count).

**Route B, fully independent:** take the 23 distinct finding slugs the 68 cases actually assert on
(the third argument, e.g. `sprint-log-outside-logs-dir`), and map each back to the engine function
that emits it. 20 resolved directly; the remaining three — `closed-sprint-not-archived`,
`promoted-learning-not-collapsed`, `sprint-index-row-missing` — resolve to `assert_S11_SPRINT` and
`assert_S11_LEARNINGS`, i.e. **§11**.

**Both routes return exactly {§9, §10, §11, §12}.** They share no mechanism: one reads a string the
author chose for a case, the other reads which engine function emits the finding the case greps for.
The 43-rule reduction is sound, and a Wave 1 builder can take it as given rather than re-deriving it.

**T4 DoD — T3's ruling read and respected:** the ruling makes `conformance-engine.sh` **read-only for
the remainder of SPRINT-103** (ADR-043, TD-168). T4 may therefore examine and port its *harness*
only, and its ~60 s of fixture-construction residue is the sole part of its 98 s still in play here.

Sprint total **8 of 31**.

consequence · T1,T4 · behaviour:low · governance:high

### 2026-09-20 | scope-change | T1 gains a build step its own acceptance did not require

Logged **before** § Plan is edited, per the frozen-Plan rule.

**What broke.** Nothing failed — the Plan under-specified a branch it could not have foreseen. T1's
acceptance offered two outcomes: *(a)* ported with parity proven, or *(b)* "a recorded ruling naming
the mechanism and why porting does not reach it." The measurement produced (b), so **T1 was already
complete as written**. But the same measurement surfaced a *third* outcome the Plan has no slot for:
the cost is removable without a port, by an awk-derived reduced spec, and the fix is cheap, proven
by two independent derivations, and already templated in T4. The Plan's binary port/don't-port frame
cannot express "don't port, do fix" — which is the actual right answer here.

**Impact.** T1 changes from a ruling task to a ruling **plus a build**. The DoD written under
"If ported:" do not apply (no port), but the build is a Tier G change to a guard harness and takes
the equivalent bar in its own right: retained must-FAIL, sibling control, seeded break under one
stated hash convention, a drift anchor on the reduction, and a worktree-isolated outside reviewer.
Owner ruled the addition in rather than deferring it, on the grounds that a cheap fix discovered at
the cost of measuring it should not become a debt row.

**Re-confirm G2.** The two G2 rulings still hold and neither is disturbed:

- *Timing is serialized, coordinator-run* — unchanged, and now the binding constraint: the host is at
  303 MB free of 14,078 MB, so the before/after range over ≥3 alternating runs cannot be taken yet.
  Owner is freeing memory; the build proceeds meanwhile and the measurement follows.
- *`qa-gate-timing.md` is coordinator-owned* — unchanged.
- **New, and the reason this is a re-confirm rather than a note:** the build touches
  `evals/run-sprint-family-fixtures.sh` only. `scripts/lib/conformance-engine.sh` is **read-only for
  the rest of this sprint** under T3's ruling (ADR-043), and the reduction deliberately stays on the
  *caller* side for exactly that reason — it changes which spec the harness hands the engine, never
  the engine. No consumer surface is touched, so L-015's check is satisfied by construction rather
  than by inspection.

**Not in scope even so:** the same reduction for T4 (it is already 18/38 reduced), and any change to
what the 68 cases assert. D6 holds — same rules, same fixtures, same named findings.

consequence · T1 · behaviour:material · governance:high

### 2026-09-20 | progress | T1 branch (c) built and proven — 319 s → 184 s, output byte-identical

**Measured, both runs this session on the same host, memory still constrained (597 MB free):**

| | real | user | sys |
|---|---:|---:|---:|
| full shipped spec (baseline, from `HEAD`) | **319.2 s** | 109.1 | 165.8 |
| reduced 43-rule spec | **184.0 s** | 50.4 | 76.9 |

Baseline 319 s against Round 16's 305 s for the same harness — two routes, same answer, within this
host's variance. **A point estimate each, not the ≥3-run range the DoD requires** — that DoD stays
open and is what the freed memory is for.

**Parity: the entire run is byte-identical**, not merely the verdicts. 69/69 verdict lines match and
`cmp` on the whole output is clean, 0 FAIL both sides. No case, fixture, assertion or finding
changed; only which other rules rode along on calls no case reads (D6 holds).

**Three drift modes proven to redden, each with its own named finding, control green:**

| case | outcome |
|---|---|
| control — unmodified reduction | green |
| seed — awk narrowed to §9+§10 | `reduced spec has 0 §11 rule rows, shipped spec has 11` |
| seed — §2 leaks through | `holds 64 rule rows but only 43 belong to §9/§10/§11/§12` |
| seed — spec loses all §11 rows | `shipped spec carries NO §11 rule rows, but cases here assert on §11` |

Retained as `evals/run-sprint-family-spec-reduction-fixtures.ts` (TypeScript, 1.38 s, `tsc` clean).
It lifts **both the anchor bytes and the awk program from the live harness** rather than
transcribing them, so it cannot drift into testing a lookalike. No tracked file is seeded — the
seeds vary the anchor's *inputs* — so no restore and **no hash convention applies here**; that bar
(L-137, L-169) governs seeds that patch a tracked file, which these deliberately do not.

**L-142 fired twice against this fixture, and that is the reason to trust it.** Draft 1 passed the
awk program through a double-quoted shell string; the backtick in `` `S9. `` was
command-substituted, and one seed "reddened" **for the quoting bug rather than for its seed** —
scoring as a pass. Draft 2 mangled the escape a different way and a *different* seed passed
spuriously. Both were caught only because the **control also reddened** — the seeds alone would
have read as three green discriminations. The rewrite removed the class by extracting the program
instead of quoting it, and the fixture now refuses any seed byte-identical to the control.

**Wiring is NOT applied** — `docs/research/logs/qa-check-ts-harness-dispatch-wiring.diff.md`, three
changes, reviewable per D3 and L-151. It surfaces a **pre-existing** gate defect worth its own
attention: leg 12's run loop hardcodes `sh "$hp"` and its census globs `evals/run-*.sh`, so a `.ts`
harness is neither run **nor reported as unregistered**. The census cannot answer the question it
exists to ask for 12 files already in `evals/` — L-186 at the gate's own level, and the reason the
census change must not be applied without writing each exclusion by hand.

T1: **6 of 11**. Open: outside reviewer (worktree-isolated), before/after over ≥3 runs.
Sprint total **12 of 35**.

consequence · T1 · behaviour:material · governance:high

### 2026-09-20 | progress | outside review returned three findings; all three confirmed and fixed

Worktree-isolated reviewer dispatched per ADR-029 (ii) and L-168. It attacked the population claim,
the parity claim, the drift anchor, and the fixture's extraction mechanism. **Every finding was
re-verified here before acting on it** — a subagent report is model output, not evidence.

**Finding 3 first, because it is mine and it is the worst of the three.** The header tally I wrote
read **§11 x29**, summing to **66 against the 68 cases stated in the same paragraph**. Two cases
unaccounted for, in a header whose entire thesis is that a file's prose about its own population is
not evidence. Verified: the true tally is **§11 x31 · §9 x16 · §12 x11 · §10 x10 = 68**. Cause: two
calls are written `assert_absent  "s11-…` with **two spaces**, and my counting pattern required one.

This is the cross-check rule failing in the exact way it documents. I had both numbers — 68, and a
tally — in one paragraph, and never added the tally up. **A negative control would not have caught
it either**: every case my query reached was classified correctly; the query simply did not reach
two of them (L-198 — the second query must vary the selection, and the cheapest one here was
addition). The reduction's correctness is **unaffected**: the section set is still {§9,§10,§11,§12},
and all 31 §11 cases were independently confirmed to map to `assert_S11_*` functions. Corrected in
the harness header, with the reason recorded there rather than silently patched.

**Finding 1 — the fixture's extraction was fragile.** It located the anchor by a hardcoded `+3`
line offset and the awk program by "first line starting with `awk '`". The reviewer inserted a
plausible diagnostic `awk` line and the extraction grabbed the decoy. In their reproduction the
suite failed *loudly*, so this was fragility rather than a demonstrated silent pass — but on a
Tier G guard the distinction is luck, not design. **Hardened:** the harness now carries three
sentinels (`SPEC-REDUCTION-BEGIN` / `-AWK` / `-END`), each required to appear **exactly once** or
the fixture throws; extraction is bracketed by them instead of counted; the awk line is parsed by
plain string slicing rather than a regex (four drafts were lost to escaping); and the captured
program is now **behaviourally probed** — it must actually reduce the real spec to the expected row
count, since a comment merely *containing* the sections pattern satisfied the old substring check.
**Re-ran the reviewer's own decoy against the hardened fixture: all four cases behave correctly and
extraction stays on target.** Harness restored and `cmp`-verified identical after the test.

**Finding 2 — stale rationale in `scripts/qa-check.sh` (:1169).** Verified: it still claimed "~5 min
for 23 cases", "~15s each against the SHIPPED spec", and that `run-attestation-fixtures.sh` "takes
the other side" by reducing. All three are now false. Corrected in place. **Comment-only** — the
non-comment diff against the pristine file is empty, so this is not a D3 wiring change and the
unapplied wiring diff still stands on its own.

**Also from the review, and worth keeping:** the reviewer independently reproduced the parity claim
rather than trusting the commit, and clarified something the commit message overstated. "Whole-run
output byte-identical" is true of the harness's own PASS/FAIL lines; the engine's internal
rule-count summary *does* differ between full and reduced spec, but no fixture reads it. Not a gap —
but the commit said more than it had measured, and the correction belongs on the record.

**Post-hardening re-run: 136.7 s, 69/69 verdicts, parity against the full-spec baseline identical.**
Reduced-spec runs now stand at **184.0 s and 136.7 s** against one baseline of 319.2 s — a 35%
spread between two runs of identical code, which is exactly why the DoD asks for a range and why it
stays open.

T1: **6 of 11**, unchanged — the reviewer DoD needs the re-review of these fixes, not just the pass.
Sprint total **12 of 35**.

consequence · T1 · behaviour:material · governance:high
review · T1 · outside-reviewer-worktree-isolated · behaviour:material · governance:high

### 2026-09-20 | progress | T1 before/after settled as a non-overlapping range over six alternating runs

Full figures → `qa-gate-timing.md` **Round 19**. Six runs, strictly alternating R/F/R/F/R/F so
neither arm sits in a quieter part of the session; baseline arm taken from `a1505f3^` (the genuine
pre-reduction file, 706 lines, zero `spec_full` refs).

| arm | range | median |
|---|---:|---:|
| full shipped spec (100 rules) | **319.2 – 354.6 s** | 341.0 |
| reduced spec (43 rules) | **136.7 – 184.0 s** | 149.8 |

**The ranges do not overlap** — the slowest reduced run is 135 s faster than the fastest full run.
On a host showing 35% spread between two runs of byte-identical code, that non-overlap is what
makes this a measurement rather than an anecdote, and it is precisely why the DoD refused a point
estimate. Median to median: **341.0 → 149.8 s, 191 s (56%)**; conservative reading 135 s (42%).
Round 17's micro-benchmark projected ~150 s and the observed saving brackets it.

Parity held on every pairing checked, 0 FAIL across all six runs. Round 17's §11 tally corrected
there too (29 → 31).

**Stated against the change, not for it:** the baseline arm trends upward across the session
(319 → 341 → 355) while the reduced arm does not, consistent with the host degrading rather than
with anything about the change — so the *median* saving is flattered by the later baseline runs.
The non-overlap claim uses the best baseline run and is unaffected. Host was 485–782 MB free of
14,078 MB throughout; that bounds the absolute figures, not the comparison.

T1: **7 of 11**. Sprint total **13 of 35**.

consequence · T1 · behaviour:material · governance:low

### 2026-09-20 | progress | T2, T4, T5 measured — three different mechanisms, three different rulings

Two runs each, serial. Full figures → `qa-gate-timing.md` **Round 20**. Every figure cross-checks
against Round 16 within this host's drift, and the three that read high do so **together**, which
is host degradation rather than three independent errors.

| target | runs | sys share of CPU | CPU as % of wall | Round 16 | mechanism |
|---|---|---:|---:|---:|---|
| T5 qa-budget-position | 68.7 · 68.8 s | — | **24% / 52%** | 66 s | wait-bound |
| T4 conformance-engine-fixtures | 110.3 · 106.0 s | 61% | 92% | 98 s | spawn-shaped, half unreachable |
| T2 layers-observed | 185.7 · 182.9 s | 59% | 68% | 153 s | spawn-shaped |

**T5 — the ruling is now proven, not read.** Two runs **0.1 s apart** while their CPU totals
differed by **more than 2×** (16.5 s vs 35.6 s). Wall time invariant to a doubling of CPU is not
working, it is waiting; only 24% of the first run's wall is CPU at all. The cost is the `WINDOW=60`
`timeout` case 2 must sit out. A port cannot reach it — the wait *is* the assertion.

**T2 — portable, and the only one of the five with that profile.** `sys` is 59% of CPU and a third
of wall is not CPU at all: blocking on subprocesses and the filesystem. 29 throwaway git repos, ~92
further git spawns, ~55 checker calls, and the checker itself is 11–12 s per real sprint file with
10 git calls inside 8 loops. This is the shape SPRINT-102's successful ports had.

**T4 — portable for about half, and the other half is out of scope.** Decomposing against Round
17's per-call engine costs: ~50 s of its ~106 s is engine invocations (18 on a 6-rule spec, 7 full,
13 tiny) and ~56 s is fixture construction. **That split is arithmetic over separately measured
per-call costs, not a direct measurement of either half** — enough to rule on, not enough to quote.
The engine half is unreachable under T3's ruling (ADR-043); the fixture-construction half is
ordinary spawn-shaped harness work and is portable.

**T2 DoD 2 — the two checkers are now disambiguated in a Round**, which is where a reader choosing
a target from a ranking actually looks; both source headers already cross-referenced each other.
`completeness` (leg 14) compares `Layers:` against files implied by **DoD/Acceptance prose**;
`observed` (leg 15) against files **actually touched in git** since `plan_commit`. SPRINT-102 ported
leg 14; this sprint's T2 is leg 15.

**Found while confirming that, not fixed (outside scope):**
`scripts/lib/check-layers-completeness.ts`'s header still calls its fixture harness "the slowest
harness in the gate (~55-70s)" — Round 16 retired that. Same stale-rationale shape as the
`qa-check.sh:1169` comment corrected this sprint. Follow-up, named not silently patched.

Sprint total **17 of 35**.

consequence · T2,T4,T5 · behaviour:low · governance:low

### 2026-09-20 | progress | stale-rationale follow-up filed as TASK-356 — in the Backlog, not only here

Two entries above named the stale cost comments as "follow-up, named not silently patched". **That
was not enough and the rule says so.** A follow-up recorded only in a sprint's own log is invisible
to every `promote` that follows, because the Backlog is what `promote` reads — L-151's fourth
recorded sighting, where `TASK-254/255/256` were satisfied later by coincidence of scope rather
than by routing. Filed properly as **TASK-356** (P2).

Id derived with `.claude/worktrees/` **and** `evals/fixtures/` excluded: a bare scan returned
`TASK-908`, which is a documented example token in `docs/LEARNINGS.md` and an archived sprint. Real
maximum is **TASK-355**, agreed by two selection rules (TODO.md alone; `docs/` + TODO + TECH-DEBT).
Third sighting of L-170 this session, and the first where the contamination came from **eight live
agent worktrees** rather than from fixtures alone.

The row is scoped as an *enumeration* problem rather than an editing one: two instances were found
by accident this sprint, which says nothing about how many exist. Its plan requires two
disagreeing-by-construction derivations of the candidate set, because a stale figure can be a
duration, a rank, a count or a superlative and only the last is greppable.

consequence · T0 · behaviour:low · governance:low

### 2026-09-20 | progress | second outside review — fixes hold; one confirmed gap closed

Second worktree-isolated pass, scoped to `6c5721a` only (the first pass's fixes) so nothing already
cleared was re-litigated. Verdict: **the three fixes hold.** One real gap found and now closed.

**Independently reproduced, not taken on trust:**

- **Fix 2 (the tally)** — re-derived by a **spacing-agnostic** query (`assert_…[[:space:]]*"`), which
  is the thing my original pattern got wrong: 68 total, §9 ×16 · §10 ×10 · §11 ×31 · §12 ×11, no
  case name outside those four, all 68 names distinct. Then by a second route — all 23 distinct
  finding slugs mapped to the `bad "…"` line that emits them, every one in §9/§10/§11/§12. Two
  routes, same answer, neither of them mine.
- **Fix 3** — comment-only confirmed by line-level diff filtering on `a1505f3..6c5721a`.
- **Round 19's parity** — reproduced end-to-end rather than read: both arms run, 69/69 verdict lines
  `cmp`-identical in file order. It also explains the 69th line, which I had never accounted for:
  `s11-td-threshold-read` is a one-off inline diagnostic, not one of the 68 `assert_*` calls.
- **Sentinel attacks** — duplicated sentinel, indented sentinel, moved target line, reordered
  BEGIN/END: all four throw loudly, as designed.

**CONFIRMED GAP — the behavioural probe checked quantity, not identity.** The reviewer crafted
`S(1|5|6|10|11|12)`, which reduces the shipped spec to **exactly 43 rows** (4+2+4+10+11+12) while
**dropping §9 entirely** and admitting §1/§5/§6 — and the total-only probe passed it silently.
Verified here independently: §1=4 · §5=2 · §6=4 · §9=10 · §10=10 · §11=11 · §12=12, decoy total 43,
decoy §9 rows 0.

Not a Tier G silent false negative end-to-end — the per-section drift anchor inside `BODY` runs in
every case *and* in a real harness invocation, and it reddens on this. But **my commit claimed the
probe proved "it is the reduction program", and it did not** — it was redundant with, and weaker
than, the check backstopping it. The reviewer proposed a clarifying comment; I made the probe
actually do what was claimed instead, since that is five lines and leaves nothing overstated:
**per-section counts for all four sections, plus the total to catch leakage.**

**Proven against the reviewer's own decoy**, spliced by string substitution on the real line so its
escaping is preserved exactly (an earlier attempt built the decoy through `awk` and the `\|` was
eaten, which would have tested nothing — L-142 again):

    captured awk produced 0 §9 rule rows, shipped spec has 10 -- it is not the reduction program   (exit 1)

Harness restored and verified under **one** convention: `git hash-object <working file>` against
`git rev-parse HEAD:<path>` — both `ecc3f31808e273da5898ade0729baefbdb892034`, normalization-aware
by construction rather than by discipline (L-169).

T1: **8 of 11** — the three remaining are `If ported:` conditionals, n/a under branch (c), to be
dispositioned at close per the owner's ruling. Sprint total **18 of 35**.

review · T1 · outside-reviewer-worktree-isolated-x2 · behaviour:material · governance:high

### 2026-09-20 | progress | T2 ported and independently verified; a false claim of mine corrected

`check-layers-observed.sh` (644 lines) → `scripts/lib/check-layers-observed.ts` (512), built
worktree-isolated. Oracle retained and untouched; `qa-check.sh` and `conformance-engine.sh`
untouched as instructed. **Re-verified here rather than accepted:**

- **Parity, run by me: 25/25 identical** (exit code + stdout), 37/37 fixture assertions, over 19
  TS-built git fixtures plus **103 real sprint files** (1 active + 102 archived). The L-198 trap the
  brief named is explicitly guarded: a `population-3a-non-empty` case asserts the active-corpus
  comparison produced **real output (2 lines)**, not the two-empty-outputs-agree shape that passed
  twice in SPRINT-102.
- **Discrimination, seeded by me:** disabling the ADR-040 ownership guard on line 448
  (`if (false && …)`, 512→512 lines, still typechecks) took the differential from **25/25 → 21/25**
  and **37/37 → 35/37**, with **exactly 4** divergences — ownership legs A/B/F and archived-sibling,
  all and only the cases downstream of that guard. Every other fixture and the whole 103-file
  corpus stayed green, which is the sibling control. Restored and verified under **one** stated
  convention — `sha256sum` on the working file, before and after, both
  `4197aa518434d99c5afb707ddf8176eadaf5d9418556019f5998d5e831924b00`. The git-blob convention used
  elsewhere in this sprint does not apply to a file with no commit yet, and swapping conventions is
  stated rather than silent (L-169).
- Wiring: `docs/research/logs/qa-check-layers-observed-wiring.diff.md`, **NOT APPLIED**.

**A claim of mine was false and is corrected here.** I reported "`tsc` clean" for the T1 fixture
three times. The root `tsconfig.json` includes only `apps/**`, `packages/**`, `test/**` — so
`tsc --noEmit` **never had my file in its program**, and its exit 0 was a statement about nothing.
Proven: `tsc --noEmit --listFiles | grep -c run-sprint-family-spec-reduction` returns **0**. Under a
config that actually covers `scripts/**` and `evals/**`, my fixture had a real error
(`(48,10) TS2532`), now fixed. This is L-136 in my own work, and I had written the L-136 warning
into this sprint's own G2 notes hours earlier.

**It is not only my file — filed as `TD-169` (high).** The gate's typecheck leg (`qa-check.sh:1008`)
runs bare `tsc --noEmit`, so **every ported checker in `scripts/lib/` and every harness in `evals/`
is outside the gate's typecheck**, while the leg reports `clean (0 errors)`. ADR-037/TD-101
hardened that same leg so a *skip* could not read as a pass; it is blind by **population** instead.
Two pre-existing `scripts/qa-verdict.ts` errors have been invisible to it, which is why the fix and
those errors are one task — widening the glob turns the gate red.

**Second gate leg this sprint with the same shape**, which is why it is filed rather than patched:
leg 12's census globs `evals/run-*.sh`, so a `.ts` harness is neither run nor reported as
unregistered. Both legs are correct in their logic and both examine the wrong set (L-186).

T2: **5 of 7** — outside review and the before/after range remain. The builder was worktree-isolated
but a builder is not a reviewer (L-165). Sprint total **21 of 35**.

consequence · T2 · behaviour:material · governance:high

### 2026-09-20 | surprise | outside review found a REAL port defect that every prior proof missed

The T2 review found one confirmed defect, and it is the most valuable finding of this sprint
because of *where* it hid rather than what it was.

**The defect.** The oracle's `attribute()` rule 4 is an unanchored greedy sed —
`s/.*(SPRINT-[0-9]\{1,\}[ ]\{1,\}\(T[0-9]\{1,\}\)).*/\1/p`. POSIX leftmost-longest makes that `.*`
select the **LAST** parenthetical in a subject. The port used `/\(SPRINT-…\)/.exec(subject)` — no
greedy prefix, not global — which returns the **FIRST**. Reproduced here directly:

    subject: 'apply the same fix as before (SPRINT-100 T1) and again (SPRINT-101 T2)'
    oracle sed -> T2          port .exec -> T1

End-to-end that is a **false-positive FAIL the oracle never raises**: a squash/merge commit citing
two tasks, touching only T2's declared file, gets blamed on T1. Fixed by mirroring the oracle's
greedy prefix (`/.*\(SPRINT-…\)/`), with the reasoning written at the line so it cannot be
"tidied" back out.

**Why every proof above it was blind, and this is the part worth keeping.** `git log --all` over
this repo's entire history returns **zero** subjects carrying two citations, so the 103-file real
corpus structurally cannot reach the shape. None of the 19 constructed fixtures built one either.
So 25/25 parity, 37/37 assertions and a seeded-break proof were all satisfied — **first-match and
last-match agree on every single-citation input, which was the entire tested population.**

This is L-186 one turn sharper than the rule states it. The brief sent the reviewer after the
branches the builder had *admitted skipping* — seven of them, plus real-commit extraction — and
**every one of those came back clean.** The defect sat on an axis nobody had enumerated at all:
*how many citations does one subject carry*. Enumerating known-skipped branches is necessary and
was not sufficient; the gap was orthogonal to the list. A fixture population can be complete over
every branch and still be a single point on a dimension no one named.

**Fixture added and retained** — `two-parentheticals-last-wins` plus a `one-parenthetical-control`
sibling, in the differential's own population. It is the only case in the suite that varies that
axis, and the comment says so.

**Discrimination proved, and the proof needed two attempts.** First seeding attempt: my `sed`
pattern errored, the file was untouched, and the suite reported **27/27 green** — a passing
"discrimination proof" from a seed that never landed. Caught only by the `cmp`-against-pristine
guard, which is exactly L-137's stated failure and the second time today a seeding attempt was
silently inert. Re-seeded via string replace (no regex), **verified landed** (2 lines changed, 521
lines both, still parses, `attribute()` demonstrably returns T1):

| | pristine | seeded |
|---|---:|---:|
| differential | 27/27 | **26/27** |
| fixture assertions | 40/40 | **38/40** |

Exactly the two new assertions reddened; `one-parenthetical-control` stayed **green**. Restored
under one convention throughout — `sha256sum` on the working file,
`532a2416dcd3973018e47daa86db24f0abdc4e2f2473c060d3d4ea4d8c1d001e` before and after.

**Also from the review, not acted on:** the builder's report claimed it "memoizes
`git rev-parse --short` per commit". The reviewer read all 512 lines and found no such
memoization; I confirmed it never reached the repo (no `memoi` in any committed file or message),
so there is nothing to correct in the tree — but a builder describing an optimization it did not
write is a reason to keep verifying reports rather than relaying them. The other stated
optimization (hoisting WIP computation out of the per-argument loop) the reviewer checked and
found safe: every git call here is read-only, so nothing mutates the tree mid-run.

Everything else attacked came back clean: `covers()` glob-injection, `sort -u` locale fidelity,
eight text-processing functions read against the oracle's source, and the differential's documented
archived-content exclusion.

T2: **6 of 7** — only the before/after range remains. Sprint total **22 of 35**.

review · T2 · outside-reviewer-worktree-isolated · behaviour:material · governance:high

### 2026-09-20 | progress | T2 before/after — 21.0 s → 3.4 s on the leg-15 workload; T2 complete

Full figures → `qa-gate-timing.md` **Round 21**.

**The measured subject is leg 15, not the fixture harness, and that distinction is the whole point.**
Round 20 timed `evals/run-layers-observed-fixtures.sh` at 185.7/182.9 s — but that harness exercises
the **`.sh` oracle**, which is retained unchanged under D5, so the port neither does nor should move
it. What the port changes is the gate leg running the checker over real sprint files. Measuring the
harness here would have produced a "no improvement" result that was true of the wrong thing.

Three alternating pairs on leg 15's exact call shape (`$(ls docs/sprint/SPRINT-*.md)`):

| | range over 3 runs | median |
|---|---:|---:|
| oracle `check-layers-observed.sh` | **20.57 – 21.14 s** | 21.03 |
| port `check-layers-observed.ts` | **2.76 – 3.69 s** | 3.40 |

Non-overlapping by ~6×; output byte-identical and exit code equal on all three pairs. ~17.6 s off
each gate run once leg 15 is wired. CPU tells the same story: oracle `sys` 10.3–11.4 s, port `sys`
≤0.02 s — the ~30 non-git forks per file are gone and only git remains.

**T2: 7 of 7.** Sprint total **23 of 35**.

### 2026-09-20 | surprise | the timing run surfaced TD-170 — and it blocks close

Both implementations exit **1** on the current tree, identically, naming 5 of 22 in-range commits
`UNATTRIBUTED`. Investigated rather than waved through: `is_governance_commit()` requires **every**
file in a commit to be a governance artifact, and its allow-list omits `docs/sprint/` — even though
the per-file reporting loop excludes `docs/sprint/` immediately afterwards. So the sprint's own
Execution Log cannot be *reported*, but it can still *disqualify* the commit, which drops it to
`UNATTRIBUTED` and gets its governance sibling named instead.

Every affected commit is `{governance file} + {docs/sprint/logs/SPRINT-103-…md}` and nothing else —
i.e. exactly the shape of routine sprint bookkeeping, since appending to the Log is mandatory.

**Not a port defect** (oracle and port agree byte-for-byte), **not new**, and **invisible until
now**: leg 15 walks only `plan_commit..HEAD`, so research commits normally fall outside the window.
SPRINT-103 is the first sprint to write four Rounds and a Backlog entry *during* its own execution.
L-105's temporal sibling — the rule is sound, the window it runs over decides whether it ever fires.

Filed as **TD-170** with two non-equivalent fix options (widen the governance allow-list, a Tier G
semantics change; or rule that sprint work must use `sprint(NNN):` subjects, a convention change
needing a home where committers read it). **It is a ruling, not a quiet patch**, and it blocks
`sprint-bulk`'s system-verify at close.

consequence · T2 · behaviour:material · governance:high

### 2026-09-20 | progress | TD-170 ruled and fixed in both implementations — leg 15 now green

**Owner ruling: widen `is_governance_commit()`'s allow-list to include `docs/sprint/`.** The
argument that decided it: that path is *already* unreportable via `is_excluded_committed()`, so the
omission let a file that cannot be named still **disqualify** the commit containing it. A file that
cannot be reported should not be able to disqualify — which is the same argument the
`docs/knowledge-index.md` and `docs/epic/`|`docs/research/` arms already make in that function.

Applied to **both** implementations, one line each, comment-documented at the site:

    oracle  scripts/lib/check-layers-observed.sh   `docs/sprint/*) ;;`
    port    scripts/lib/check-layers-observed.ts   `if (f.startsWith("docs/sprint/")) continue;`

Non-comment diff is exactly one line per file. **Leg 15 now exits 0 on both**, byte-identical
output, on the real tree — the close blocker is cleared.

**Tier G bar, and the control is the part that matters here.** Widening an allow-list risks
exempting too much, so the retained pair is:

- `governance-plus-sprintlog` — `{TODO.md} + {docs/sprint/logs/...}` must NOT be unattributed. This
  is the motivating case, taken from the real shape that fired (L-166: a guard is pointed at its own
  motivating artifact, not only at a fixture that exercises the branch).
- `governance-plus-real-file` — **the over-exemption control**: `{TODO.md} + {scripts/real-code.sh}`
  must STILL be reported, naming the code file. Without it the first fixture would pass equally
  well against a rule that exempted everything, which is the failure mode a widening invites.

Full suite after: **29/29 differential, 43/43 assertions.**

**Discrimination proved** by reverting the one line from the port only (seed verified landed: 1 line
changed, 527→526, still parses):

| | with fix | seeded |
|---|---:|---:|
| differential | 29/29 | **32/41** (9 divergences; the bisector widens the comparison set) |
| assertions | 43/43 | **42/43** |

Exactly `governance-plus-sprintlog` reddened; **both over-exemption control assertions stayed
green**. The nine divergences include real-corpus comparisons, so the instrument catches this on
live data and not only on the fixture. Restored under one convention — `sha256sum` on the working
file, `086defe965c982aedb57fa98e7d0c5dbd2991171402461211d5f9a5d707849d3` before and after.

Outside review still owed on this change (ADR-029 ii) — dispatched next.

consequence · TD-170 · behaviour:material · governance:high

### 2026-09-20 | progress | both wiring diffs applied; the gate found nine things, all mine

**Owner ruled: apply both.** Done, and verified by running the gate rather than by reading the diff.

**Leg 15 → the port.** `lo_script` now names the `.ts`, with the `bun`-not-found FAIL-not-skip guard
folded in as an `elif` on the existing test rather than a new block (my first attempt opened an
`if/else` without a closing `fi` and broke the file; caught by `sh -n` before it went anywhere).

**Leg 12 now dispatches `.ts` harnesses** (`case "$hp" in *.ts) … bun … ;; *) … sh … ;; esac`) and
its census glob admits `evals/run-*.ts`. **The `.ts` fixture now actually runs:**
`PASS  eval harness run-sprint-family-spec-reduction-fixtures.ts` in the gate output — which is the
whole of L-020 and the reason the diff existed.

**My own wiring diff overstated the blast radius and I corrected it on measurement.** It warned that
admitting `.ts` would force exclusion entries for "12 files". The glob is `evals/run-*.ts`, which
matches **5**, not 12 — the eight `*.test.ts` files do not match it. Four of the five are
differential-parity harnesses, one is the new fixture.

**A cost decision I did NOT take on my own.** ADR-039 says parity is mandatory at promote and close,
which argues the four differentials belong in `eval_harnesses_optin`. Measured first:
authority 21.2 s · doc-caps 38.8 s · night-run-rollup 44.0 s · layers-observed 189.3 s —
**~294 s together**, which would more than cancel this sprint's own saving at exactly those two
moments. That trade is an owner ruling with a measured cost, not a wiring decision, so they are in
`eval_harnesses_excluded` **named, with the cost and the open ADR-039 question written at the site**.
Nothing pretends they ran. Flagged for the owner.

**Gate result: `214 pass, 9 fail`, and all nine are this sprint's own work.** No census complaints,
so the registration is complete. The nine:

| # | finding | disposition |
|---|---|---|
| 1 | knowledge index stale | regenerated via `scripts/gen-index.sh` |
| 2 | `corpus metadata: ADR-043(tag:performance)` | `performance` was a tag of one; changed to `process` |
| 3–7 | `layers/depends-on completeness` ×5 | added to each task's **`Cites:`** line — the checker's own prescribed remedy for "prose cites it rather than touching it". None of these files is touched by the task citing it |
| 8–9 | `review-depth-*-absent` for T0 and T3 | **not patched** — see below |
| 10 | `layers observed` on `ccd6c6c` | **not patched** — see below |

**The two I am not quietly fixing.** The review-depth check is correct: I marked T0's G2 entry and
both T3 entries `governance:high` / `behaviour:material` and appended no `review ·` line. T3's
ruling was the owner's (J2) and its artifacts include a Tier G file edit that no independent pass
has seen; TD-170's fix likewise. **Downgrading the classification to clear the check would be
exactly the quiet reinterpretation L-088 names**, so instead an outside review of TD-170 + T3's
engine edit is dispatched, and the `review ·` lines get written from what it finds.

And `ccd6c6c` is genuinely unattributable: subject `fix(TD-170): …` matches no attribution rule
while touching three real code files. TD-170's fix addressed the *governance* shape; this is a code
commit that should have carried a `sprint(103) Tn:` subject. The commit is written, so this needs an
owner ruling (exempt, or amend history) — recorded, not worked around.

consequence · T0 · behaviour:material · governance:high

### 2026-09-20 | surprise | a claim I froze in a commit message was false — outside review caught it

**Correction, and it is the durable kind.** Commit `ccd6c6c` asserts *"Leg 15 now exits 0 on both …
the close blocker is cleared."* **That is false.** Verified now: both oracle and port exit **1**,
byte-identically, on the real tree.

**How it happened, because the mechanism matters more than the slip.** I ran the leg-15 check while
the TD-170 fix was still *uncommitted*. In that state the checker takes its WIP leg, which applies
the weaker all-task-union rule, and it exited 0 — correctly, for that state. **Committing the fix
is what invalidated the verification**, because the new commit was itself unattributable. The claim
was true when measured and false by the time it was written, and the act of recording it is what
broke it. Round 21's own figures were taken the same way and are unaffected (they compare two
implementations, not an exit code), which is exactly why this slipped: the differential asserts
`oracle == port`, never `exit == 0`.

**I did catch the fact independently** — the subsequent full gate run surfaced it and it was
reported as an open finding needing an owner ruling. **What I did not do is retract the commit
message**, and a false claim frozen in the record is worse than one never made, because it reads as
verified. That is the defect here, not the red leg.

**A second instance has since appeared** from the wiring commit: `T2:docs/adr/ADR-043-…` — changed
by a task that never declared it. My ADR-043 tag fix rode along in a commit subjected
`sprint(103) T2:`, and T2's `Layers:` does not name `docs/adr/`. Two instances now, different
shapes, same root: **my commit subjects and the files they carry do not line up with the attribution
convention leg 15 enforces.** Still the owner's ruling; now with two data points, not one.

**Everything else in the review reproduced clean**, independently rather than re-read:

- **Shell/TS boundary parity on `docs/sprint/`** — 9 cases including `docs/sprintfoo`,
  `docs/sprint-notes/`, nested `archive/`, double-slash, case-difference and `..`. No divergence.
- **The widening cannot over-exempt** — traced and fixture-confirmed: any non-allow-listed file
  still forces the whole commit non-governance, so `{sprint log} + {scripts/real-code.sh}` is
  reported exactly as `{TODO.md} + {scripts/real-code.sh}` is.
- **The seeded-break discrimination reproduced exactly** — 29/29→32/41 and 43/43→42/43, the
  motivating fixture reddening and both control assertions green, restored to the stated hash.
- **T3's comment-only claim holds** — all 16 lines comment-prefixed, `sh -n` clean, and the engine's
  full 100-rule output byte-identical to the pre-edit copy (154 lines, matching SHA-256).

**Acted on the one SUSPECTED finding:** the new arm carried no ASSUMPTION caveat, unlike its
`docs/epic/*|docs/research/*` sibling — and `docs/sprint/` is the most actively written tree here.
Added, noting that the reporting-side exposure predates TD-170 and this arm only changes the
commit's overall verdict. Comment-only; non-comment diff is zero lines.
`find docs/sprint -type f ! -name '*.md'` is currently empty.

review · T3 · outside-reviewer-worktree-isolated · behaviour:material · governance:high
review · T0 · owner-approved-at-g2-and-outside-reviewed · behaviour:material · governance:high

### 2026-09-20 | progress | T4 ruled, ADR-039 split applied, convention written, Plan exhausted

**T4 — recorded split ruling (owner).** Its acceptance was two-branch and the measurement fit
neither: ~50 s of ~106 s is engine invocation, out of reach under ADR-043; ~56 s is portable fixture
construction. Filed as **TD-171** with the split labelled as *arithmetic over separately measured
per-call costs, not a direct measurement of either half* — good enough to rule on, not to quote.
D2's "a recorded ruling is a successful task", applied to a case the Plan did not anticipate.

**ADR-039 split (owner).** `authority` (21.2 s) · `doc-caps` (38.8 s) · `night-run-rollup` (44.0 s)
join `eval_harnesses_optin` — ~104 s, honouring the parity mandate for three of the four ports.
`layers-observed` (189.3 s) stays **excluded and named**, its cost written at the site, its own
ruling deferred until the post-sprint gate total exists. Deciding a 189 s recurring cost against a
total nobody has re-measured is the mistake this sprint was built to stop.

**The convention now has a home.** `.claude/CONTEXT.md` § Sprint model states how leg 15 attributes
a commit, in rule order, and that `research:`/`todo:`/`fix(...)` belong to commits made *outside* an
active sprint's range — plus the half I got wrong twice: the files must be covered by **that task's**
`Layers:`, so a mixed-concern commit fails even with a correct subject. It was enforced in code and
written nowhere a committer reads, which is L-151 exactly.

**Exemption recorded, history not rewritten.** `ccd6c6c` and `e9c7e14` are exempted for this sprint
only. Amending them would falsify the shas cited by name in ADR-043, TD-170's evidence trail and
this Log. The next commit of that shape reddens against a rule that now exists in prose as well.

**A counting error of mine, corrected.** I have been reporting "35 DoD" all sprint. The Plan holds
**34**; the 35th was the Owner-action checklist's single row, which my `grep -c '^- \[ \]'` swept up
because it uses the same syntax. Separated now — Plan and Owner-action counted apart. Nothing
downstream depended on it, but every rollup figure I gave carried the error.

**Plan exhausted: 23 ticked · 11 `[~]` n/a · 0 open.** Each n/a carries the ruling that made it
inapplicable, inline — T1 took branch (c) so there is no port to retain an oracle for; T4 was split
and its reachable half filed; T5's wait *is* its assertion. Marked `[~]` rather than `[x]`: closing
34/34 when 11 were never applicable reads as more work than happened (L-088).

consequence · T0 · behaviour:low · governance:high
review · T0 · owner-ruled-and-outside-reviewed · behaviour:low · governance:high
