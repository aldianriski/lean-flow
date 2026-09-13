---
sprint: 099
slug: make-the-gate-finish
owner: Maintainer
last_updated: 2026-09-13
status: closed
gates_signed: G1,G2 @ 7701c8b
plan_commit: a43d1e6
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-099 — Make the Gate Finish

> **Theme:** The gate not finishing is now the most reliable blocker in this loop. SPRINT-096 closed
> under an ADR-021 override after a memory kill; SPRINT-098 closed under one after **three of six**
> attempts died. Two consecutive closes have rested on targeted evidence because the instrument that
> should decide them could not speak. This sprint does not make the gate faster — it makes a
> truncated run *say so*, and replaces three sprints of inference about why it dies with one
> measurement. `TD-143`'s own **Re-file fresh if** condition asks for exactly that.

## Scope

**In:**
1. The gate's memory profile **measured**, so a kill is a known mechanism rather than an inference
   carried across four sprints (TASK-344 · TD-143's cost half).
2. Truncation reported as an outcome **distinct from failure**, naming the elapsed seconds and every
   leg and harness it did not reach (TASK-329 · TD-117 · TD-128).
3. The `*/archive/*` exclusion made a **filesystem-identity** predicate rather than a case-sensitive
   string glob, at all three call sites under one shared predicate (TASK-342 · TD-145).

**Out (deferred):**
- **Making the gate FASTER.** Speed is a separate, unfiled concern. T2 fixes the report, because the
  report is what is lying; `TD-117`'s "cap dispatch concurrency" option is explicitly rejected at
  intake — it would slow the worktree-isolated review this repo mandates for Tier G.
- **EPIC-015 § Closed-when 1.** `TASK-319` + `TASK-188` stay paired in the Backlog for a third sprint.
  The run needs a recorded ten-dimension envelope *and* a host that can finish a gate; this sprint is
  the second half of that precondition.
- **`TD-152` and `TD-153`** — the limits qualifying § Closed-when 5 and 6. Both fixes are new Tier G
  surfaces (a retry-firing choke point; a machine-only sidecar plus a cross-file guard), not patches.
- **`check-qa-budget-default.sh`.** Correct within its declared scope. TD-128 is a *missing reader*,
  not a broken checker — do not "fix" it by widening that script (T2 DoD 3).
- The rest of the gate-accuracy cluster (`TASK-338` · 339 · 340 · 341 · 343) — see **D4**.

## Plan

### T1 — Measure the gate's memory profile, so a kill is a known mechanism `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `scripts/qa-check.sh` (instrumentation only) · `docs/research/` (a measurement record)
Depends-on: none
Cites: TD-143 · TD-090 · TD-117 · L-091 · L-094
Four kills are now on record — three in SPRINT-098 alone, one in SPRINT-096 — and every account of
*why* is inference. TD-143's row says so itself: its **Re-file fresh if** condition is that the profile
be measured, so the mechanism is known rather than read off three artifacts that merely look alike.
A measurement is the class of fact that closes this and it accumulates, so it is deferrable without
being parked forever (L-094).

**Acceptance:** A committed measurement record states where the gate's memory actually goes, derived
from instrumented runs rather than from the shape of the kills.

**DoD:**
- [x] Instrumentation lands in `scripts/qa-check.sh` and is **off by default** — a measurement harness that changes the default profile has changed the thing it measures.
- [x] At least **three** instrumented runs, and the record says how many completed and how many were killed. A profile built only from runs that survived is a profile of the survivors.
- [x] The record names **where** the memory goes — per-leg or per-harness, not a single total. A total reproduces the inference this task exists to replace.
- [x] **A1 is tested, not assumed:** whether the four recorded kills share one mechanism. If the measurement says they do not, that is the finding and it is recorded as such.
- [x] TD-143's Mitigation line is **not** carried in as a plan — it is the filer's hypothesis, written while the cost was being felt (L-091). Re-derive before building on it.
- [x] The record lands in `docs/research/` with an ownership header, and `TD-143` is updated to point at it.

### T2 — Make truncation a distinct outcome from failure `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/qa-check.sh` (the `qb_checkpoint` truncation path **and** the § Summary block — the two places that print the verdict) · `scripts/lib/qa-budget-check.sh` · `evals/run-qa-budget-fixtures.sh` · `evals/fixtures/qa-budget/`
Depends-on: T1 — **D1** (shared `scripts/qa-check.sh`)
Cites: TD-117 · TD-128 · TD-084 · TD-091 · L-120 · L-166 · ADR-029 · `scripts/lib/check-qa-budget-default.sh` (named in DoD 3 as explicitly NOT widened — cited, never touched) · `evals/run-s2-placement-fixtures.sh` (where the real checkpoint tripped; read as the motivating condition, never modified)
**Tier G** (ADR-029) — a skipped harness is an **unrun** guard, and the run still prints a verdict in
the same shape a completed run prints. The gate cannot currently report on itself: truncation and
failure are byte-indistinguishable, which is how six skipped harnesses went unnoticed, two of them
guards of the gate itself. The fix direction is **ruled at intake** (**A2**), not re-opened here.

**Acceptance:** A reader distinguishes *completed-and-passed*, *completed-and-failed*, and *truncated*
from the printed verdict line alone — never from a wrapper's exit code.

**DoD:**
- [x] A run that trips the budget checkpoint no longer prints the same verdict shape a genuinely-failing run prints.
- [x] The truncation verdict names the **actual elapsed seconds** and **every** leg or harness it did not reach, **enumerated by name** — today the message names none.
- [x] The **actual** runtime is asserted against the ceiling (TD-128's half, a missing *reader*). `scripts/lib/check-qa-budget-default.sh` is not widened.
- [x] The three outcomes are distinguishable from the printed line alone (L-120). — *Verify: `sh evals/run-qa-budget-fixtures.sh`*
- [x] Retained must-FAIL + sibling control: a seeded checkpoint trip reports truncation and names its unrun harnesses, while a genuinely-failing run in the same suite still reports FAIL (L-058 · L-142).
- [x] **Pointed at the motivating condition, not fixtures alone (L-166):** reproduce TD-117's measurement — a run under concurrent worktree agents, or a checkpoint seeded to trip where the real one tripped (`evals/run-s2-placement-fixtures.sh`) — and show the same six harnesses named. **Reproduced at the real trip point; the figure SIX is stale and was re-derived, not inherited (A3 · L-130):** the live 520 s budget skipped **13** harnesses, a 200 s trip skipped **27**, and `evals/run-s2-placement-fixtures.sh` is named in both. Count cross-checked against an independent tally of the skip notes (27 = 27).
- [x] **Seeded-break discrimination proof** under ONE stated hash convention; a landed, targeted seed that reddens nothing is reported **untested**, never scored as a pass (L-137 · L-142 · L-169 · L-187).
- [x] **Outside reviewer, worktree-isolated** (L-165 · L-168), after the author enumerates every call site touched and seeds a break in each fix (L-193).
- [x] **The new harness is registered** in `eval_harnesses_always`/`_optin`/`_excluded`, verified **from the registry's side** — enumerate the registry against `evals/`, never confirm by running the new thing (L-196). **No new harness was created** (the standing no-new-`.sh` rule; the six new cases extend `evals/run-qa-budget-fixtures.sh`), so this was ticked on the owner's ruling against the registry check actually run: registry→disk, all 35 present; disk→registry, none unregistered; and the harness carrying the new cases sits in `eval_harnesses_always`.

### T3 — Make the `*/archive/*` exclusion a filesystem-identity predicate `[size: M · risk: low · class: execution · HITL · J1]`
<!-- size S -> M and Layers widened at the 2026-09-12 `scope-change`: A4 was refuted (ten call sites, not three). -->
Layers: `scripts/lib/archive-path.sh` (new, the shared predicate) · `scripts/lib/check-layers-observed.sh` · `scripts/lib/check-layers-completeness.sh` · `scripts/lib/check-approval-envelope.sh` · `scripts/lib/check-night-run-rollup.sh` · `scripts/lib/check-review-depth.sh` · `scripts/lib/check-verify-reaches.sh` · `scripts/lib/conformance-engine.sh` · `scripts/qa-check.sh` · `evals/lib/check-system-verify-block.sh` · `scripts/lib/check-research-archive.sh` (added mid-task: the ELEVENTH site, found by the outside review — a `grep -v` exclusion the case-glob derivation could not reach, L-100) · `evals/run-conformance-engine-fixtures.sh` (the doctored-engine copy must carry the new sibling, or it fails predicate-missing and proves nothing) · `evals/fixtures/` + its harness
Depends-on: T2 — the enlarged set shares `scripts/qa-check.sh`, so **D2's disjointness no longer holds** (`scope-change`, 2026-09-12)
Cites: TD-145 · TD-151 · L-186 · L-165 · L-168 · ADR-029
**Tier G** (ADR-029) — this is the **set predicate itself**, not a branch inside one. Ten gate
checkers depend on it to keep closed sprints out of their examined set, and SPRINT-098's A1
grandfathering ruling explicitly inherits its defect.

**Acceptance:** `docs/sprint/Archive/…` and `docs/sprint/archive/…` — the same directory on this
host, one inode under two spellings — are excluded identically, at every site.

**DoD:**
- [x] The case-variant path is excluded. Today `case "$sp" in */archive/*)` returns `NOT-EXCLUDED` for it, and feeding that path to `scripts/lib/check-layers-completeness.sh` produces **3 real FAILs against a closed sprint's stale content**.
- [x] **All ELEVEN sites** fixed under **one shared predicate**, not eleven copies — `check-layers-observed.sh:373` and `:431` · `check-layers-completeness.sh:234` · `check-approval-envelope.sh:44` · `check-night-run-rollup.sh:72` · `check-review-depth.sh:126` · `check-verify-reaches.sh:55` · `conformance-engine.sh:948` · `qa-check.sh:789` · `evals/lib/check-system-verify-block.sh:68` · **`check-research-archive.sh:48`**. **Derived at G2, not inherited** (L-186 · A4 refuted): the Plan named three, the derivation found ten — and the outside review found an **eleventh** the derivation structurally could not reach, because it searched for the case-glob SHAPE while that site used `grep -v`. Amended mid-task under the owner's ruling that every *exclusion* site is in scope; `check-handoff-state.sh:145` MAPS rather than excludes and stays the filed follow-up. A new gate leg **10b** now guards the whole set against a revert in any shape.
- [x] A retained must-FAIL varying path **casing** as its selection axis, plus a lowercase sibling control green in the same run. The existing `archive-path-excluded` fixture **passes** and proves nothing here — it validates a *string* predicate where the real job is *filesystem identity*.
- [x] **Seeded-break discrimination proof** under ONE stated hash convention (L-169 · L-187).
- [x] **Outside reviewer, worktree-isolated** (L-165 · L-168).

## Owner-action checklist
<!-- none this sprint: no unattended run, no external credential, no envelope. -->

## Decisions (pre-locked)
- **D1 — `scripts/qa-check.sh` is owned T1 → T2.** Measure before changing the thing measured: T2 edits the verdict path T1 is instrumenting, and the reverse order would profile a file that no longer exists. Stage per-hunk and verify `git diff --cached`; never a plain `git add` over the other's WIP (L-042 · L-037).
- **D2 — T3 is disjoint** (different files, no `depends-on`) and is therefore eligible for a **parallel worktree-isolated build** alongside T1/T2, at the coordinator's discretion. **Superseded at the 2026-09-12 `scope-change`** — the derived ten-site set includes `scripts/qa-check.sh`, which T2 owns, so T3 is no longer disjoint and runs third in the ownership chain. The discretion clause is moot, not overruled.
- **D3 — T2's fix direction is ruled, not open.** TD-117 offers three options and rules none; the third (make the skipped-harness list its own named outcome) is chosen. Capping dispatch concurrency would slow the worktree-isolated review this repo mandates for Tier G, and rests on a concurrency figure nobody has measured; raising the budget cannot work, since the 600 s ceiling is external and `qa-check.sh:27` already calls the current 520 *"NOT a permanent figure"*.
- **D4 — `TASK-342` is promoted APART from its cluster, deliberately.** Its `grouped:` line says schedule it with `TASK-338` (SPRINT-097 T1's ruling). It is pulled forward because `TD-151` and SPRINT-098's A1 grandfathering ruling **both already inherit its defect**, so leaving it costs correctness in two shipped guards. The cluster ruling is not withdrawn — `TASK-338` · 339 · 340 · 341 · 343 stay grouped for a later sprint.
- **D5 — T1 is `J2`, T2 and T3 are `J1`.** T1 produces a *record that a later sprint will act on*, which is a judgement; the Plan is deliberately not all-J2.

## Assumptions
- **A1** — That the four recorded gate kills share one mechanism. **UNCONFIRMED, and T1's measurement is what tests it** — it is the task's subject, not its premise. *Confirm: T1's instrumented runs; a negative result is a finding, not a failure.*
- **A2** — T2's fix direction is settled at intake (**D3**) and is not re-opened at G2. *Confirm: read `TASK-329`'s `assumes:` block before designing.*
- **A3** — **TD-117's quoted 450 s default is STALE**; `qa-check.sh:27` has read 520 since SPRINT-093. *Confirm: re-derive at build and quote neither figure from a row (L-130).* **CONFIRMED at G2 (2026-09-12):** `qa-check.sh:27` reads 520; neither figure is quoted from a row anywhere in this sprint.
- **A4** — The `*/archive/*` predicate has exactly three call sites. Two were named by review, the third found by an independent grep. *Confirm: derive the set before editing, do not inherit this count (L-186).* **REFUTED at G2 (2026-09-12):** the derivation found **ten** exclusion sites, plus one mapping site ruled out of scope. See the `scope-change` entry in the Execution Log.

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-099-make-the-gate-finish.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here
> (STANDARD §9 · ADR-014). **Do not paste a `### <date> | run-complete | …` header at line start into
> that file** — it arms `check-night-run-rollup.sh`, which parses it (L-197, learned the hard way at
> SPRINT-098).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/qa-check.sh` | T1 | `QA_PROFILE` sampler, off by default — four kills had been diagnosed by inference and TD-143's re-file condition asks for a measurement | low (46 insertions, 0 deletions; no-op when unset) | `QA_PROFILE_OUT` set with profile off creates no file; 3 instrumented runs |
| `docs/research/qa-check-memory-profile.md` | T1 | New verdict doc — the gate is not the memory consumer, so the fix class aimed at it is eliminated | none (doc) | 104 lines ≤ 130 cap |
| `docs/research/logs/qa-gate-timing.md` | T1 | Round 14 — raw series, host state and the limits the missing `VmHWM` imposes | none (append-only) | series convention, uncapped |
| `TECH-DEBT.md` | T1 | TD-143 pointed at the record; its cost half re-routed from the gate to the host envelope | none (doc) | row re-read whole after edit (L-009) |
| `scripts/lib/qa-budget-check.sh` | T2 | Truncation formatting + unrun selection + TD-128's ceiling reader, as pure functions — the logic is otherwise testable only by a 550 s run that truncates | med (Tier G) | `sh evals/run-qa-budget-fixtures.sh` 10/10; 4 seeded breaks discriminate |
| `scripts/qa-check.sh` | T2 · T3 | `QA_SELF` + derived leg list + truncation line + ceiling assertion (T2); predicate source + site + new leg 10b (T3) | med (Tier G) | leg 10b proven reachable at `QA_BUDGET_SECONDS=260`; both truncation paths exercised |
| `scripts/qa-verdict.ts` | T2 | Third outcome for the only AUTOMATED reader; widened after review so the EMPTY-set alarm is not filed as an ordinary red gate | med (Tier G) | `bun test evals/qa-verdict.test.ts` 19/19; 2 seeded breaks discriminate |
| `evals/run-qa-budget-fixtures.sh` · `evals/qa-verdict.test.ts` | T2 | Retained must-FAIL + sibling controls + a selection-axis case and an anomaly case | low | run above |
| `scripts/lib/archive-path.sh` | T3 | **New.** The one archive predicate — filesystem identity, not string casing; fork-free ancestor walk | med (Tier G) | 2 seeded breaks; both failure directions detected |
| 10 checker sites + `scripts/lib/check-research-archive.sh` | T3 | All eleven exclusion sites routed through the shared predicate; the eleventh found by outside review | med (Tier G) | per-site runtime check, both spellings; 96 PASS 0 FAIL across six harnesses |
| `evals/run-layers-completeness-fixtures.sh` | T3 | Platform-aware casing fixture + lowercase/live control pair | low | `sh evals/run-layers-completeness-fixtures.sh` 16/16 |

## Retro

**Retrieval check** — The rules that fired unprompted: L-130 (re-derived TD-117's "six" harnesses to
13/27 and A3's 450 s to 520 s rather than quoting either), L-042 (per-hunk staging when
`scripts/qa-check.sh` carried both a T2 and a T3 hunk), L-169 (one hash convention, `git hash-object`,
stated once and not mixed), L-170 (three id derivations, each cross-checked; `TASK-908` and `L-999`
correctly rejected as fixture and negative-test tokens rather than treated as rows). The rules that
did **not** fire until something external forced them: **L-186 twice** — the site derivation was run
in one query shape and cross-checked in the same shape, and the outside review found the eleventh
site both times over; and **L-120 in the coordinator's own shell**, where `bun build … | tail -3 &&
echo "BUILD OK"` printed `BUILD OK` after a failed build because `&&` read `tail`'s status. That rule
is promoted, correct, and was on screen. It still did not fire, which is its sixth sighting of
exactly that shape.

**Cost** — Coordinator inline for all three tasks, with stated reasons (T1 needed exclusive host
access; T2's risk sat in a cross-file contract the coordinator had just enumerated). Three dispatched
agents, all review: two worktree-isolated adversarial passes plus one bounded re-review, ≈527k
subagent tokens. **Eleven full or partial gate runs**, ~1h20m of wall clock in gate time alone — the
dominant cost of this sprint was running the instrument it was fixing.

**Worked**

- **Measuring before theorising killed a four-sprint inference in one session.** TD-143 had been
  reasoned about from the *shape* of four kills. Three instrumented runs showed the gate holds
  ~9.5 MB and moves 320 kB across 547 s while system free memory swings 695 MB around it. The debt's
  whole premise — that there is a gate memory cost to reduce — is false, which eliminates the entire
  class of fixes aimed at it. The task's own DoD demanded A1 be *tested, not assumed*, and testing it
  is what produced the finding.
- **Discarding an instrument mid-proof.** The off-by-default byte-diff was abandoned after three runs
  of the *identical* file produced 201/201/204 passes at two different trip harnesses: the diff's
  noise floor exceeded any instrumentation effect. Recording the discard was worth more than the two
  proofs that did hold — a diff that "looked clean" would have been measuring host variance.
- **The outside review earned its cost, three for three.** Every defect it found was one the author
  could not see: a `$0` resolved after a `cd`, an alarm message its own consumer misfiled, and an
  eleventh call site invisible to the query shape that found the first ten. None came from recalling
  a rule; all came from someone else running the code.
- **Answering a guard-hole finding with a cross-site guard, not five fixtures.** Leg 10b catches a
  revert at every site at once *and in any shape* — which is the failure that produced the finding.

**Friction**

- **The instrument kept being killed by the thing it measures.** The first measurement chain died
  mid-R0 to the host's low-memory watchdog, taking four queued runs with it. Serial foreground runs
  survived where one long background chain did not.
- **Five of five completed runs truncated before the fix; the close's own system-verify truncated
  too** — and then, once the three regressions it caught were fixed, produced `218 pass, 0 fail`,
  the first untruncated green gate of the session. The sprint's thesis was demonstrated on the sprint
  itself.
- **The gate caught the coordinator twice**: four `review-depth-*-absent` FAILs for consequence lines
  with no `review ·` line, and a `layers observed` FAIL naming the eleventh site as undeclared. Both
  were real bookkeeping gaps, surfaced by checks this sprint exists to sharpen.
- **Three of my own edits regressed the gate in ways only a full run showed**: a literal sprint glob
  inside a *comment* tripping ADR-014's single-pattern rule, a relocated engine copy missing its new
  sibling, and DoD annotations citing files by bare basename where Layers declares them prefixed.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)

- **`L-199` filed** — a guard's ALARM branch has a consumer too, and only the happy path is ever run
  through it. The defect message and the matcher that reads it were written in the same session by
  the same author and never introduced to each other.
- **`L-198` bumped to `count: 2`** — a cross-check must vary the SELECTION rule, not the direction of
  the count. The eleventh archive site is that rule's second sighting, and this time on a live gate
  leg, failing silently. **It is now a promotion candidate at the next promote.**
