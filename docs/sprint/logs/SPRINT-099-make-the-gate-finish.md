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
