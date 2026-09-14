---
owner: Maintainer
last_updated: 2026-09-13
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---
## v1.65.1 — Findings That Mean What They Say (2026-09-14)

**PATCH — `SPRINT-100`, 29 of 29 DoD.** Five guards whose *detection logic* was sound while the
**set they ran over** was not. The thread through all five is narrower than "guards are wrong": each
emitted a finding that was **not true of its own subject** — a mention read as a use, a tick read as
a scope change, an earlier ruling masking a later failure, a matcher blind to the convention its
corpus actually uses, and a report that could not tell a gating finding from an informational one. A
guard that reports the wrong thing about the right file is worse than an absent guard, because its
output is believed. Fixes only; the spec is unchanged at 0.11.0.

**`check-verify-reaches.sh`, both legs (TD-087 · TD-097).** EXISTS resolves a bare basename against
the known script roots before calling it absent, and reports an *unresolvable reference* as
`verify-method-unresolvable` — a **different finding** from `verify-method-absent`, so one absence is
never reported as the other. REACHES is anchored to path boundaries and rejects a target whose only
occurrence sits in an **exclusion idiom**; a token that is itself another method named in the same
clause no longer counts as that clause's target. The archive exemption that hid all of this for five
sprints became the retained fixture `archive-arm-basename-skipped`. **TD-097's cited `17` was wrong
and is corrected to `9`**, settled by running the *unfixed* checker over all 31 archived
Verify-bearing sprints — the old figure conflated raw mentions with findings.

**A ticked DoD is no longer an unaccounted Plan edit (TD-105).** Checkbox state is normalised on both
sides of the comparison in **both** freeze assertions. A genuine text change with no `scope-change`
entry still fails exactly as before. The inverted incentive this removes was the point: the check had
rewarded sprints that shifted scope and penalised sprints that did not.

**`check-system-verify-block.sh` gained a positional link and live logs (TD-086).** `has_close` and
`has_ruling` are bound to each `system-verify ·` occurrence's own window, so an earlier ruling can no
longer clear a later unresolved FAIL, and the harness runs over `docs/sprint/logs/` for the first
time rather than fixtures alone.

**Informational findings carry their own token (TD-146).** A `FAIL` line the gate does not fold into
its tally now prints as `INFO`, so the printed verdict and the visible tokens stop disagreeing with
nothing marking the difference. **The policy is unchanged — only the report:** which findings gate is
untouched, the pass/fail arithmetic is asserted identical across the change, and
`conformance-engine.sh` / `conformance.sh` are at **zero diff**, so the consumer contract is
unaffected (for an adopter every finding *is* gating).

**The conformance-coverage sweep sees both finding conventions (TD-089).** It examined **6 of 9**
FAIL lines while asserting a property over all nine; now 9 of 9, and the remediated stranger reaches
zero. Round 4 was **re-run rather than re-matched** — the verdict reproduces unchanged at 9 findings
across 5 rules, 0 artefacts. Two structural additions outlive the regex fix: a **population
reconciliation** that fails by name when a line shape neither arm parses appears, and engine-level
bootstrap failures routed to their own class instead of being parsed as findings.

**Known and filed, not silently carried:** `TD-156` (eight sites emitting prose where a path is
expected — fails noisy, not silent), `TD-157` (27 one-space `FAIL` emissions across 15 files, one of
which left a sweep reporting clean on a *crashed* engine), `TD-158` (two clause-extraction defects
that drop real references out of an examined set), `TD-159` (worktree-review mechanics documented
nowhere). `TASK-350` routes the emitter fix.

**Adopter-facing:** nothing in this release changes a command, a skill's interface, or the standard.
`conformance.sh`'s exit code and output are byte-unchanged.

---
## v1.65.0 — Make the Gate Finish (2026-09-13)

**MINOR — `SPRINT-099`, 20 of 20 DoD.** Two consecutive closes had rested on targeted evidence
because the instrument that should decide them could not speak. This sprint did not make the gate
faster; it made a truncated run **say so**, and replaced four sprints of inference about why the gate
dies with one measurement. Both were demonstrated on the sprint's own close.

**Measured — the gate has no memory profile worth the name, and `TD-143`'s premise does not survive
it.** `QA_PROFILE=1` (off by default, fork-free, ~0.9 ms per sample) profiles every leg boundary and
eval harness. Across three instrumented runs `qa-check.sh` holds **~9.5 MB and moves 320 kB over
547 s**, while system free memory swings **695 MB** around it; the live process count oscillates 4–20
with no climb, so `qa-check.sh:50`'s fork-exhaustion rival does not accumulate either. **There is no
gate memory cost to reduce** — a fix aimed at this file's consumption would be aimed at 9.5 MB. The
kill artifact was reproduced on the *pristine* file (129 lines, 0 FAIL, no verdict line), so it is
real and not the instrument's doing. **A1 is NOT confirmed and says so**: one kill's mechanism is now
known (the host's low-memory watchdog), three remain uninstrumented, and the honest statement is that
they share an *artifact*. Record: `docs/research/qa-check-memory-profile.md`, raw series as Round 14
of `docs/research/logs/qa-gate-timing.md`. The off-by-default byte-diff proof was **discarded as an
invalid instrument** — three runs of the identical file gave 201/201/204 passes at two different trip
harnesses, so the diff's noise floor exceeded any instrumentation effect.

**Added — truncation is a third outcome, distinct from failure (`TD-117`).** A run that trips the
budget now prints `QA-CHECK: TRUNCATED at <where> after <N>s against a <B>s budget — <K> item(s)
UNRUN, named: …`, enumerating every leg or harness it never reached. The early checkpoint names all
21 remaining legs, **derived from the file's own `qb_checkpoint` calls** so the list cannot drift from
the calls. The `QA-CHECK: N pass, M fail` line is deliberately **byte-unchanged** — `qa-verdict.ts`
anchors on it at both ends — and that reader gains the third outcome too, carrying `unrun: null`
(never `0`) when the gate cannot derive what it skipped. Before this, five of five completed runs
printed `N pass, 1 fail` while skipping up to 27 harnesses, two of them the guards of this very
budget mechanism.

**Added — the ACTUAL runtime is asserted against the 600 s command ceiling (`TD-128`'s missing
reader).** `check-qa-budget-default.sh` asserts the *configured* budget and is correct within that
scope; it is byte-untouched. The new assertion is the one that can go red when a run is genuinely too
slow, rather than restating its own configuration.

**Fixed — the archive exclusion is a filesystem-identity predicate, at eleven sites (`TD-145`).**
`case "$x" in */archive/*)` is a *string* predicate standing in for a *filesystem* question: on any
case-insensitive filesystem `docs/sprint/archive` and `docs/sprint/Archive` are one directory sharing
one inode, and the glob excluded the first spelling while admitting the second — producing **3 real
FAILs against a closed sprint's stale content**, verified against the pre-fix commit. One predicate
now asks the filesystem (`test -ef`), correct on case-sensitive hosts *and* case-insensitive ones by
construction rather than by picking a side, with a fork-free ancestor walk because callers loop over
98 archived sprints. The Plan named three sites; derivation found ten; **outside review found an
eleventh** that used `grep -v` instead of a case-glob and was therefore unreachable to the query shape
that found the first ten. New gate **leg 10b** guards the whole set against a revert in any shape.

**Governance.** `L-199` filed (a guard's alarm branch has a consumer too, and only the happy path is
ever run through it). `L-198` bumped to **count 2** — a promotion candidate. `TD-154`/`TD-155` filed;
`TASK-346`/`TASK-347` filed `origin: close-retro`. `TD-143` updated to point at the measurement.
Three worktree-isolated review passes returned a defect each, **none found by the author**.

---
## v1.64.0 — Prove the Run, Then Report It (2026-09-11)

**MINOR — `SPRINT-098`, 20 of 27 DoD.** EPIC-015 has three conditions a guard cannot satisfy — they
need a run. This sprint built the three guards that a run would be judged by, and then **did not fire
the run**: T4 is `J2` and its approval envelope was never recorded, so it and its paired T5 parked at
`AUTHORITY_BOUNDARY`. § Closed-when **1 stays open**; **5 and 6 are contributed but qualified**.

**Added — an absent Execution Log is now a named FAIL rather than a skip.** `qa-check.sh` leg 2g built
its input from live sprint Plans that *already had* a log, so a sprint whose log did not exist was
filtered out before `check-night-run-rollup.sh` ever saw it. That is precisely the failing state — a
run that dies before writing anything writes no log — so the one case the leg exists to catch was the
one it skipped. The checker's own file-not-found guard, previously unreachable from this leg, now
fires. Open-DoD derivation reuses `check-layers-observed.sh`'s rather than inventing a fourth copy.
The **continuation contract** also moves out of `orchestrator/SKILL.md` step 4's paragraph into its own
headed section at G1/G2's structural level (**L-192** — form, not wording). Archived sprints stay out
of scope by construction rather than by an allowlist, ruled at G2.

**Added — the ADR-022 revise-loop ceiling is enforced where the run's terminal state is derived.**
`check_revise_ceiling()` is called from `reap()` before `terminal ·`, ranked under the exit-code arm,
so a second retry in one review pass — or a `still-open` outcome that never escalates — becomes
`HARD_FAILURE` instead of a silent `PLAN_EXHAUSTED`. The ceiling is read from ADR-022 § Decision item
2, never re-chosen. **Documented limit (`TD-152`):** nothing mechanically emits the `Tn · retry ·` line
it reads, so an unlogged retry and no retry are indistinguishable and both pass. An earlier draft
claimed the opposite; an independent review ruled that sentence false and it was removed.

**Added — a typed run outcome with per-field provenance.** Every reaped run now emits
`outcome · DELIVERED | PARTIAL | FAILED` from a **fail-closed** pure function of `terminal` (an
unrecognised state maps to `FAILED`), beside DoD counts, tasks attempted/completed, parks, repair
cycles, verification state, warnings and terminal reason. Each line is tagged `[mechanical]`,
`[model-reported]` or `[derived]` **in the artifact itself** — a verdict that presented a counted
figure and a model-written one at equal confidence would repeat TD-152's overclaim in the one artifact
whose job is to say what the run did. The name `RunSummary` is deliberately **not** minted; EPIC-008
keeps the portable protocol (ADR-041 ruling at G2). **Documented limit (`TD-153`):** a hand-written
`run-complete` entry placing an example above its real evidence defeats the outcome/DoD selection —
ruled inherent to reading a markdown log the model also writes prose into, with the real fix (a
machine-only sidecar plus a cross-file guard) named rather than attempted.

**Fixed — two fixture suites were in `evals/` and in no harness list**, so the gate never ran either.
Green by hand through two builders, two worktree-isolated outside reviews and the coordinator; caught
only by the first gate run that survived to print a verdict (**L-196**).

**Fixed** — a fenced documentation example forcing a false ceiling breach (**L-108**, this repository's
own recorded incident recurring one function over); a standalone checker entry that printed a shell
error and then `PASS` at exit 0, failing **open**; `verification ·`'s extraction silently passing a
whole raw line through where its own comment claimed truncation; and `Layers:`/prose path spellings
that never met because one used basenames and the other full paths.

**Filed** — `TD-151` (the shared `## Plan` derivation is a prefix match that also counts fenced
checkboxes, now gating a hard FAIL across three call sites) · `TD-152` · `TD-153` ·
`TASK-344` · `TASK-345` (both `severity: high` escalations) · **L-195** – **L-198**.

**Known** — the gate is not reliably runnable on this host: three of six attempts died of memory, and
this close is recorded under an **ADR-021 owner override** against a last verdict of
`QA-CHECK: 229 pass, 1 fail` whose single finding was then fixed and verified directly. The cost half
of `TD-090` · `TD-117` · `TD-143` remains out of scope for a fourth sprint.

---
