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
