---
sprint: 099
slug: make-the-gate-finish
owner: Maintainer
last_updated: 2026-09-12
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-099 — Execution Log

> Append-only companion to [`../SPRINT-099-make-the-gate-finish.md`](../SPRINT-099-make-the-gate-finish.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-12 | scope-change | T3 — A4 refuted: the archive predicate has ten call sites, not three

**What broke.** Assumption **A4** states the `*/archive/*` predicate has exactly three call sites and
instructs the builder to derive the set rather than inherit the count (L-186). Derived it. The set is
**ten** exclusion sites, not three:

| # | Site | In T3's DoD? |
|---|---|---|
| 1 | `scripts/lib/check-layers-observed.sh:373` | yes (cited as `:344` — stale line) |
| 2 | `scripts/lib/check-layers-observed.sh:431` | yes (cited as `:401` — stale line) |
| 3 | `scripts/lib/check-layers-completeness.sh:234` | yes (cited as `:183` — stale line) |
| 4 | `scripts/lib/check-approval-envelope.sh:44` | **no** |
| 5 | `scripts/lib/check-night-run-rollup.sh:72` | **no** |
| 6 | `scripts/lib/check-review-depth.sh:126` | **no** |
| 7 | `scripts/lib/check-verify-reaches.sh:55` | **no** |
| 8 | `scripts/lib/conformance-engine.sh:948` | **no** |
| 9 | `scripts/qa-check.sh:789` | **no** |
| 10 | `evals/lib/check-system-verify-block.sh:68` | **no** |

An eleventh site, `scripts/lib/check-handoff-state.sh:145`, uses the same case-sensitive glob to
**map** a Plan path to its log path rather than to exclude. Same defect class, different failure mode
(a mis-mapped log rather than a stale-content FAIL). Ruled **out of T3** and filed as a follow-up.

**Motivating case re-verified on this host.** `docs/sprint/archive` and `docs/sprint/Archive` report
inode `5066549582447480` — one directory under two spellings, excluded by one and not the other. The
sprint file quotes inode `5910974512661248`; the identity claim holds, that figure does not, and it is
not re-used below (L-130).

**Impact.** T3's declared `size: S` was scaled to three single-line edits. Ten sites under one shared
predicate, each needing a call-site enumeration and a seeded break (L-193), is an **M**. More
consequentially, the enlarged set **includes `scripts/qa-check.sh:789`, which T2 owns** — so **D2's
"T3 is disjoint … eligible for a parallel worktree-isolated build" no longer holds.** The wave
collapses from `T1 ∥ T3, then T2` to a single ownership chain.

**Re-confirm G2.** Owner ruled both open questions in one frontier round:
- **T3 scope → all ten exclusion sites under one shared predicate**, mapping site deferred.
- **T1 → three instrumented gate runs happen in-session**, nothing else concurrent.

Sequencing re-derived from the enlarged set and recorded as the overlap map: **T1 → T2 → T3**,
sequential, `scripts/qa-check.sh` owned in that order (extends **D1**, which ordered it T1 → T2 only).
Per-hunk staging on that file at every commit; never a plain `git add` over another task's WIP
(L-042 · L-037).

### 2026-09-12 | progress | T1 complete — the gate's memory was measured, and the premise did not survive

consequence · T1 · behaviour:low · governance:low

**Tier X** (ADR-029), declared at G2: a measurement harness that is off by default is not a guard, so
the retained-fixture bar applies and the discrimination proof does not. The off-by-default property is
the one claim that had to be shown mechanically, and it was.

**Built inline rather than dispatched**, with the reason stated at G2: the measurement needs exclusive
use of the host, which a worktree-isolated agent cannot guarantee by construction, and perturbing the
profile is what T1 DoD 1 forbids.

**Instrument.** `QA_PROFILE=1 QA_PROFILE_OUT=<file>` samples `memfree · swapfree · self_rss · procs`
at every leg checkpoint and every eval harness. Fork-free by necessity — the first `ps`+`awk` shape
measured ~150 ms per sample against ~0.9 ms for reading `/proc` through shell built-ins.

**Six runs, serial, nothing else dispatched.** Five completed, one killed.

| Run | File | profile | Wall | Verdict | Outcome |
|---|---|---|---|---|---|
| R0 | pristine | off | — | **absent** | KILLED for memory, 129 lines, 0 FAIL |
| R5 | pristine | off | 558 s | `199 pass, 1 fail` | truncated at 538 s |
| R1 | instrumented | off | 572 s | `202 pass, 1 fail` | truncated at 554 s |
| R2/R3/R4 | instrumented | **on** | 547/546/562 s | `201`/`201`/`204 pass, 1 fail` | all truncated |

**Findings.** (1) `self_rss_kb` spans 9 408–9 920 kB — a **320 kB spread over 547 s** — while system
MemFree swung **695 MB**. The gate is not the consumer. (2) Process count oscillates 4–20 with no
climb, so `qa-check.sh:50`'s fork-exhaustion rival does not accumulate either. (3) Three runs of the
identical file gave 201/201/204 passes at two different trip harnesses; **no run completed the harness
set**, and all five printed `N pass, 1 fail`. (4) Seven items are ~307 s of ~545 s.

**A1 tested, NOT confirmed — and that is the recorded finding, not a failure.** R0 reproduced the
artifact on the *pristine* file, so it is real and not the instrument's doing; its kill came from the
session harness's low-memory watchdog. The four earlier kills were never instrumented and nothing here
shows they share that door. What is settled: whichever door it is, **it is not the gate's own
consumption**, which eliminates the entire class of fixes aimed at making `qa-check.sh` lighter.

**Off-by-default, proven two ways and one way discarded.** (a) `QA_PROFILE` unset with
`QA_PROFILE_OUT` pointed at a path → **no file created**. (b) `git diff` is 46 insertions, 0
deletions. (c) A byte-diff of instrumented-default against pristine-default was **discarded as an
invalid instrument**: three runs of the *identical* file differ in pass count and trip harness, so the
diff's noise floor exceeds any instrumentation effect. Recording the discard matters more than the
two passes — a diff that "looked clean" here would have been measuring host variance, not the change.

**Cross-task finding, handed to T2.** T2's motivating condition reproduced five times over without
being sought: every completed run truncated and printed a verdict indistinguishable from an ordinary
single failure. The skipped set was **13** harnesses, not the six TD-117 records — and it included
`run-qa-budget-fixtures.sh` and `run-qa-budget-default-fixtures.sh`, the guards of the budget
mechanism itself, plus `run-s2-placement-fixtures.sh`, the harness T2's own DoD names as where the
real checkpoint tripped. T2 must not inherit the figure "six" from TD-117 (L-130).

Artifacts: `docs/research/qa-check-memory-profile.md` (verdict, 104 lines) · Round 14 of
`docs/research/logs/qa-gate-timing.md` (raw series) · `TECH-DEBT.md` TD-143 updated to point at both.

### 2026-09-12 | progress | T2 — truncation is now an outcome, and the review found a defect chain

consequence · T2 · behaviour:material · governance:high

**Tier G** (ADR-029), declared in the Plan. Review depth: worktree-isolated outside reviewer, which
is mandatory here and not a judgement call (L-165 · L-168).

**Built inline rather than dispatched, with the reason stated:** the risk was concentrated in a
cross-file verdict contract — `scripts/qa-verdict.ts` anchors `/^QA-CHECK: (\d+) pass, (\d+) fail$/m`
at BOTH ends, four stub gates emit that shape, and `evals/qa-verdict.test.ts` pins it — which the
coordinator had just enumerated. Handing a builder a partial map of that contract is L-020's
half-wired shipping. The full weight went on the outside pass instead, and it earned its place.

**Design.** The verdict line is untouched; truncation arrives as an ADDITIONAL line naming elapsed
seconds, the budget, where it stopped, and every unrun item by name. The early checkpoint names all
21 remaining legs, derived from the file's own `qb_checkpoint` calls so the list cannot drift from
the calls — they ARE the list. Leg 12 names every unrun harness. TD-128's missing reader asserts the
ACTUAL runtime against the 600 s ceiling; `check-qa-budget-default.sh` is byte-untouched (DoD 3).

**A defect fixtures structurally could not see.** The item counter word-split, reporting **94 items
while naming 21 legs**. Every fixture used space-free names like `run-foo.sh` — an incidental
property nobody chose — while the real caller passes `"leg 2: count consistency"`. Found only by
pointing the guard at the real gate (L-166), fixed to per-line counting, and case 10 now varies that
axis deliberately (L-186).

**Discrimination, one stated hash convention — `git hash-object`** (the changes were uncommitted when
proven; the convention is stated once and not mixed, per L-169). Four shell seeds + two TS seeds,
each: landed (`cmp` differs) · still parses/builds · targeted (line delta 0) · target case red while
a sibling control **from a different function** stayed green · restored to the pristine hash. Two
seeds were reported **UNTESTED rather than scored as passes** when their `sed` failed to apply, and
one "control" was replaced after it reddened alongside its target — which made it no control at all.

**The outside review returned a two-link chain, both CONFIRMED, neither visible from inside:**
1. `qb_all_legs` read `"$0"` *after* `cd "$ROOT"`, so a relative invocation from a subdirectory
   yielded an EMPTY leg list — a truncation that could not name one thing it skipped.
2. `TRUNCATED_RE` required `N item(s) UNRUN` immediately after `budget --`, so the shell side's
   deliberate "unrun set came back EMPTY" **defect message did not match**, fell through, and was
   announced as *"an ordinary red gate … not truncated"*. The guard's own distress signal was filed
   as exactly the thing it exists to distinguish.

Fixed at the root in `dc2dd08`: `QA_SELF` resolved before the `cd`; `TRUNCATED_RE` widened with the
tail parsed separately, yielding `unrun: null` — **null, never 0**, because the gate did not skip zero
checks, it could not say how many, and a number where there is no number is the false-negative shape
again. Three tests pin the anomaly (19 green). The reviewer verified outcome ORDERING as CLEAR by
seeding the reorder: 2 tests reddened, 14 stayed green.

**Cross-task correction carried from T1, not inherited from the row (L-130):** TD-117 records six
skipped harnesses. A real trip at the live budget skipped **13**; seeded at 200 s it skipped **27**,
cross-checked against an independent count of the skip notes (27 = 27). The figure "six" is not used
anywhere in this task.

Commits: `d498324` (build) · `dc2dd08` (revise, after review).

### 2026-09-12 | progress | T3 — one predicate for ten sites, and A4 was wrong by seven

consequence · T3 · behaviour:material · governance:high

**Tier G** (ADR-029) — the set predicate itself, not a branch inside one.

**The motivating case, verified against the PRE-FIX commit rather than inherited from the debt row:**
`docs/sprint/Archive/SPRINT-001-…md` fed to `check-layers-completeness.sh` at `HEAD` produced exactly
**3 FAILs** against a closed sprint's stale content, and **0** for the lowercase spelling. Both now
report 0, with a live sprint still examined as the control.

**Why not lowercase the comparison.** It would be WRONG on Linux, where `Archive/` is a genuinely
different directory that must not be excluded. Case is not the question; identity is. The predicate
asks the filesystem (`test -ef`) and is correct on both platforms by construction rather than by
picking a side. Where `-ef` is absent it degrades to the literal match — no regression, and no claim
to a correctness the shell cannot deliver. The ancestor walk uses `${d%/*}` rather than `dirname`
because callers run it inside loops over 98 archived sprints, and process spawning is this repo's
measured cost centre.

**The fixture is platform-aware for the same reason** — it asks whether the two spellings ARE one
directory on the host, then asserts the answer that host warrants. Asserting exclusion
unconditionally would make the fixture wrong on Linux, which is a fixture that passes for the wrong
reason.

**Verified at all ten sites, not only the fixtured one.** Each loads the predicate at runtime and
excludes both spellings identically; a missing shared file is FATAL at every site rather than a local
fallback, because a fallback copy would rebuild the ten copies this task exists to remove.

**Seeded-break discrimination, same stated convention (`git hash-object`):** removing the identity
branch reddens the case-variant case while three controls stay green; forcing always-archived reddens
the live-sibling controls instead. The two failure directions — under-exclusion and over-exclusion —
are detected separately, which one seed alone would not have shown. Six harnesses guarding the
touched checkers: **96 PASS, 0 FAIL**.

Commit: `9ef32bc`.

### 2026-09-13 | progress | T2 + T3 outside reviews returned, and T3's found an eleventh site

review · T2 · independent-adversarial-reviewer (worktree-isolated) · behaviour:material · governance:high
review · T3 · independent-adversarial-reviewer (worktree-isolated) · behaviour:material · governance:high

**T2 — re-reviewed once (the bounded retry), both findings CONFIRMED closed.** The reviewer
reproduced the original subdirectory break against the fixed code (21 legs named, `qa-verdict.ts`
correctly reporting `TRUNCATED … 21 check(s) NEVER RAN`), then probed `QA_SELF`'s construction for
holes: directory-with-spaces, symlink, and PATH-resolved bare command all came back clean. One
residual, reproduced but ruled out of contract: sourcing the file rather than executing it leaves
`$0` as the parent shell, so `QA_SELF` points at a non-file — but `qa-check.sh` calls raw `exit`
throughout, so sourcing was never a viable invocation mode for it. Accepted, not chased. The widened
`TRUNCATED_RE` was attacked for over-matching (digit-leading prose tails, reordered lines, missing
newline, `.truncated` consumers repo-wide) and held; the whitespace skip preserves an item with
leading spaces verbatim.

**T3 — CONFIRMED defect, and it is L-186 a second time inside the same task.**
`scripts/lib/check-research-archive.sh:48` carried the SAME bug class through a DIFFERENT mechanism:
`grep -v "^docs/sprint/archive/"` — a case-sensitive string exclusion over paths `grep -rl` reports
with real on-disk casing. **The first derivation could never have found it, because the derivation
searched for the case-glob SHAPE.** The search pattern defined the population it was able to find.
Worse, this one is on a live gate leg (2c) and fails in the silent direction: a superseded research
doc cited only by a closed sprint under the case-variant spelling reports *"correctly left in
place"* instead of demanding archival. Its own harness has zero mentions of `Archive` and ran green
throughout.

Fixed: the eleventh site now calls the shared predicate. Broadened from `docs/sprint/archive/` to any
archived path deliberately — the function's own contract is "historical and generated surfaces never
count" — and verified a **no-op on this tree**, output byte-identical to the pre-change baseline.

**Reviewer's Finding 2 (guard hole, no live bug): five of the six touched harnesses have no
case-variant fixture**, so a revert at any single site would go unnoticed there. Answered with a
**cross-site guard** rather than five near-duplicate fixtures — new gate leg **10b**, which asserts no
raw archive exclusion survives anywhere outside the shared predicate. It catches a revert at EVERY
site at once, including a revert written in a *different shape*, which is the failure that produced
this finding. Its search token is assembled from fragments so it cannot match its own source line.
Two exemptions, each with a stated reason rather than because they were noisy: `archive-path.sh`
(it IS the predicate) and `check-handoff-state.sh:145` (MAPS rather than excludes, and
self-enumerates via a literal glob so it never tests a caller-supplied string — independently
verified; it remains a filed follow-up).

Leg 10b proven **reachable, not merely present**: a run at `QA_BUDGET_SECONDS=260` executed it and
printed its PASS line. Discrimination: seeding the raw case-glob back into one site names that site;
seeding the `grep -v` form back into the eleventh names that one; the clean tree reports neither.

**Reviewer's Finding 3**, fixed: `qa-check.sh` sourced the predicate with no `[ -f ]` guard while all
nine other sites had one — fatal either way, but the failure arrived as a raw interpreter message
instead of this gate's own `FAIL` grammar.

**The gate then caught the coordinator.** That same run reported `189 pass, 6 fail`: four
`review-depth-*-absent` FAILs for T2/T3 consequence lines with no `review ·` line yet appended (this
entry is that line), and one `layers observed` FAIL naming `scripts/lib/check-research-archive.sh` as
changed but undeclared — the eleventh site, added to T3's `Layers:` as the live declaration it is
(L-100). The sixth was the deliberate budget trip. Every one was a real gap in this session's own
bookkeeping, surfaced by the checks this sprint exists to sharpen.
