---
owner: Maintainer
last_updated: 2026-10-03
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v1.65.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.0.0 release** (2026-10-03). §11 keeps the
> current and previous minor inline (2.0.x and 1.66.x), so cutting v2.0.0 pushed v1.65.x out.

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

