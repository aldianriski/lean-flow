---
owner: Maintainer
last_updated: 2026-09-21
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---
## v1.66.1 — The gate's truncation costs the fewest guards (2026-09-22)

**Released — PATCH.** All four `*-plugin/*.json` manifests and the `README.md` footer moved
together, derived with `grep -l '"version"' .*-plugin/*.json`.

### Fixed
- **`qa_budget_check` refused nothing.** A non-numeric budget made `[ "$elapsed" -gt "$budget" ]`
  error, the `if` read that as false, and the function fell through to `OK` / exit 0 — forever.
  Measured: `qa_budget_check 0 abc 0` returned **`OK 1790032685 abc`**, reporting OK at 1.79
  billion seconds elapsed. A silent false negative in the mechanism whose only job is bounding a
  run, reachable from any caller passing an env var through unvalidated. Now refuses by name with
  a distinct exit 2 (`UNUSABLE`), so a caller can tell "over budget" from "budget unusable".
  5 retained fixtures incl. a must-NOT-catch control, proven to discriminate by a seeded break.

### Changed
- **The always-on eval-harness set is ordered cheapest-first.** It was chronological, so
  truncation dropped whichever harnesses happened to be newest. Now, if a run exceeds its budget,
  it drops the dearest instead — verified live: at a 200s budget the skipped set is exactly the
  expensive tail. Per-harness costs are recorded beside the list and flagged as a snapshot (L-130).

### Reverted before release
- **A `night-run.sh` budget raise, which was a regression.** It read ADR-042's "a caller that
  knows it is detached may raise it" as licence — but that sentence's antecedent is
  `QA_CEILING_SECONDS`, a different variable, and **the pre-flight gate call is not detached**
  (it is synchronous; the only `nohup` is 144 lines below). Unbounded, the launcher reached ~955s
  in one foreground call against a 600s ceiling: killed mid-pre-flight with no verdict, strictly
  worse than the bounded refusal at ~560s it replaced. Caught by an outside review before it ran
  anywhere real. The correct fix — the caller **declaring** detachment — is `TASK-367`.

## v1.66.0 — Hooks become admissible; the first candidate is withdrawn at review (2026-09-21)

**Released — MINOR.** All four `*-plugin/*.json` manifests and the `README.md` footer moved to
`1.66.0` together, derived with `grep -l '"version"' .*-plugin/*.json` rather than from a list
(the DoD line that enumerated a subset was read as exhaustive twice).

### Added
- **`scripts/lib/check-prose-density.ts`** — gate leg 2b-ter. `check-doc-caps` counts newlines, and
  a markdown file satisfies a newline cap by writing longer lines: `.claude/CLAUDE.md` held 63 lines
  against a cap of 80 while its content grew **2.62x** after the cap was reached, longest line
  **6,681 characters**. `STANDARD` §157 already forbade the squeeze and nothing checked it. Built as
  a **ratchet** (FAIL only when a file gets denser than its recorded baseline), because `TD-174`
  records what report-only achieves. It caught its own author within minutes of being wired.
  Population **derived** from the same source `check-doc-caps` uses — 84 files, after an outside
  review found the first version examined 16 against 78 capped ones (L-186). Table rows are measured
  by longest **cell**, closing a `| `-prefix bypass that was already live. 10 retained fixtures,
  each branch proven to discriminate by a seeded break.

### Changed
- **`ADR-044` — hooks and agent definitions are admissible**, held to `ADR-001`'s curation bar.
  `ADR-001` had explicitly **rejected** "no agents / no hooks, ever" as too extreme; the blanket
  line was a *proxy* for curated that began being enforced in place of it. `ADR-011` is
  **superseded in part** on the record — its real objection was the platform fact that hooks
  auto-activate with **no per-hook disable**, making any shipped hook mandatory for every consumer.
  That sets a new standing bar: a hook must be worth being mandatory, measured on real input.
  `ADR-002` is **untouched** — it contains no hook clause (`grep -ci hook` → 0).
- **The `"no X"` banner is retired across the consumer surface**, and one member was **flatly
  false**: `/lean-doc-generator init` is titled *"Scaffold a fresh repo"* and has shipped for a long
  time, while the README's second line denied it. A negative claim has no diff that ever makes it
  look wrong. Component claims now **describe the roster**.

### Withdrawn
- **`ask-dont-tell`, a `Stop` hook for `L-002`** — built, reviewed worktree-isolated, and **not
  shipped**. Measured against 48 real transcripts (5,451 assistant blocks, 746 completed turns) it
  would have blocked ~35 turns with **~22 false positives (≈60%)** while missing ≥9 genuine inline
  decisions — 8 of those because its patterns were English-only and the maintainer works
  bilingually (`Mau saya …?` *is* "Want me to …?"). Its 7 fixtures could not see any of this: both
  blocking fixtures were keyed to patterns firing **0 and 2 times** in the corpus, and deleting
  every pattern that *does* fire left the suite fully green. Withdrawn under ADR-044's own clause —
  narrow it or withdraw it, never widen the fixtures until it looks green — and re-filed as
  **`TASK-366`**. No consumer-visible change: the roster is unchanged and Bun remains not required.

---
## SPRINT-103 — Port the Measured Hotspots (2026-09-21)

**Unreleased — no version bump.** `skills/`, the four `*-plugin/*.json` manifests, `README.md` and
`spec/` are untouched (derived from `git diff --name-only bfa3fec..HEAD`, not judged). The one
consumer-facing file in the diff, `scripts/lib/conformance-engine.sh` (ADR-027), changed by **16
comment lines only** — `sh -n` clean, byte-identical output and exit code against the pristine copy
over the full 100-rule spec. No consumer-visible change ⇒ nothing to release. Spec unchanged at
0.11.0. **23 of 34 DoD `[x]`, 11 `[~]` n/a, 0 open** — each n/a carries inline the ruling that made
it inapplicable, because closing 34/34 when 11 were never applicable reads as more work than
happened (L-088).

**The sprint measured first and ruled four of its five targets unportable — and that is the result,
not a shortfall.** SPRINT-102 inherited TD-090's harness ranking, ported five checkers and moved the
gate by nothing; Round 16, the first profile of a *completed* gate, held none of them in the top 20.
So every task here opened with its own measurement, and "ruled unportable, mechanism recorded" was an
accepted outcome (D2). It happened four times, and each ruling names a different mechanism.

**T1 — 305 s, and a port would have recovered almost none of it.** `conformance-engine.sh` costs
**2.93 s against an empty directory** with the shipped 100-rule spec and 0.35 s with zero rules —
~26 ms per rule of dispatch paid whether or not anything is checked. The harness makes **68** engine
invocations, so **199 s of its 305 s is dispatch inside the program the port would still have to
call 68 times**. Ruled not spawn-shaped. The cost was then removed anyway, on the caller side: the
harness now hands the engine an **awk-derived 43-rule spec** (§9+§10+§11+§12), reduced from the
shipped `spec/STANDARD.md` at run time and carrying a per-section drift anchor. Six alternating runs,
**319.2–354.6 s → 136.7–184.0 s, non-overlapping**; median 341.0 → 149.8 s. Output byte-identical,
69/69 verdict lines, 0 FAIL both arms, same cases and same findings (D6 holds). **The trap that
nearly shipped:** the harness header claimed §9+§10, which is 26 of its 68 cases — a reduction built
on that prose would have left 40 assertions with no rule to fire, and **40 of the 68 are
`assert_absent`**, which passes when a finding does not appear. All of them would have gone green
testing nothing. The required set was derived twice, by two mechanisms sharing nothing (case-name
prefixes, then the 23 distinct finding slugs mapped back to the emitting engine function), and both
returned exactly {§9, §10, §11, §12}.

**T2 — the one target of five whose cost was genuinely spawn-shaped, ported.**
`check-layers-observed.sh` (644 lines) → `check-layers-observed.ts` (512), oracle **retained** under
D5. 59% of its CPU is `sys` and a third of its wall is not CPU at all: 29 throwaway git repos, ~92
git spawns, ~30 non-git forks per file. Gate **leg 15** now runs the port: **20.57–21.14 s →
2.76–3.69 s** over three alternating pairs, ~6× and non-overlapping, output byte-identical and exit
code equal on every pair, `sys` 10.3–11.4 s → ≤0.02 s. Parity: 25/25 identical (exit code + stdout)
over 19 built git fixtures **plus 103 real sprint files**, with a `population-3a-non-empty` case
asserting the active-corpus comparison produced real output — the two-empty-outputs-agree shape that
passed twice in SPRINT-102 is explicitly guarded.

**T3 — ruled, not ported, and the ruling is recorded in all three places its different readers
reach (ADR-043 · the engine's own header · TD-168).** Leg 2f-ter's sweep runs **173.1 s real / 53.8
user / 81.1 sys** — 60% `sys`, corpus size executed as per-file spawns, with fixed dispatch only 1.7%
of it. That **inverts T1's conclusion for the same program, and both hold**: two different costs in
one binary. A port is the right instrument and was ruled out of scope here for a reason that survives
the sprint — exit-code and report-text parity are reversible, but **shipping a `bun` requirement to
adopters is not**, and `conformance.sh` answers for any repository under ADR-027. **T4** split
(~50 s engine, out of reach under ADR-043; ~56 s portable fixture construction → **TD-171**).
**T5** is wait-bound by construction: two runs **0.1 s apart while their CPU totals differed by more
than 2×**, because case 2 must sit out a 60 s `timeout` to demonstrate the silent shape TD-084
exists to stop. The wait *is* the assertion.

**Four worktree-isolated outside reviews; four confirmed defects; none found by the author.** The
sharpest was a real port defect that **25/25 parity, 37/37 assertions, 103 real files and a seeded
break were all structurally blind to**: the oracle's unanchored greedy `sed` takes the **last**
`(SPRINT-N Tn)` citation in a subject, the port's `.exec()` took the **first**, and `git log --all`
over this repository's entire history holds **zero** two-citation subjects — first-match and
last-match agree on every input that exists. The reviewer's brief named seven admitted-skipped
branches and all seven came back clean; the defect sat on an axis nobody had enumerated (**L-207**).
The others: a header tally reading 66 against the 68 cases in its own paragraph (two `assert_absent`
calls written with two spaces, in a header whose thesis is that a file's prose about its population
is not evidence); a fixture whose anchor extraction grabbed a planted decoy `awk` line, now bracketed
by three exactly-once sentinels and behaviourally probed **per section**, since a 43-row decoy that
drops §9 entirely passed the total-only probe; and a stale rationale comment in `qa-check.sh`.

**Also shipped.** **TD-170 resolved** — `is_governance_commit()`'s allow-list now admits
`docs/sprint/` in both implementations, so a file that is already unreportable can no longer
*disqualify* the commit carrying it; retained pair includes an **over-exemption control**
(`{TODO.md} + {scripts/real-code.sh}` must still be reported), and the discrimination proof reddened
exactly the motivating fixture with both control assertions green. Leg 12 now dispatches `.ts`
harnesses and its census glob admits them — the new fixture actually runs in the gate, which was the
whole point of the wiring diff. `.claude/CONTEXT.md` § Sprint model now states leg 15's attribution
rules in prose: they were enforced in code and written nowhere a committer reads (L-151). ADR-039's
opt-in split applied for three differentials (~104 s); `layers-observed` (189.3 s) stays excluded and
named, its ruling deferred to **TASK-357** until a re-measured gate total exists.

**Closed without a full-profile gate run**, on the record: the host sat at **3.0% free memory
(428 MB of 14,078 MB)** — the condition that killed this sprint's Wave 0 — and a wall-clock figure
taken under paging measures swap, which is the same ruling Round 17 made. The sprint's own **A3 is
therefore recorded NOT confirmed**, and TASK-357 owns both it and the deferred ADR-039 ruling. The
last completed gate read `214 pass, 9 fail`, every finding dispositioned in the Execution Log: seven
fixed, two `review-depth-*-absent` answered by dispatching the missing review rather than by
downgrading the classification that triggered them, and one commit ruled genuinely unattributable.

**A claim frozen in a commit message was false, and the retraction is part of this record.**
`ccd6c6c` asserts *"leg 15 now exits 0 on both … the close blocker is cleared."* The check ran while
the fix was **uncommitted**, where the checker takes its WIP leg; committing the fix added a commit
that was itself unattributable, and both implementations then exited 1. The claim was true when
measured and false by the time it was written — **the act of recording it is what broke it**
(**L-206**). `ccd6c6c` and `e9c7e14` are exempted for this sprint only, history not rewritten,
because their shas are cited by name in ADR-043 and TD-170's evidence trail.

`TD-168` (high) · `TD-169` (high) · `TD-171` · `TD-172` filed · `TD-170` **resolved** · `TD-167`
annotated with its second sighting · `TASK-356` filed mid-run, `TASK-357` filed `origin: close-retro`
· **L-206** · **L-207** · **L-208** filed · `ADR-043` written.

---
## SPRINT-102 — Make the Gate Green (2026-09-20)

**Unreleased — no version bump.** `skills/`, the four `*-plugin/*.json` manifests, `README.md` and
`spec/` are untouched (derived from `git diff --name-only ef02be0..HEAD`, not judged), and the three
changed scripts are this repo's own tooling rather than ADR-027's consumer-facing conformance
engine. No consumer-visible change ⇒ nothing to release. Spec unchanged at 0.11.0. **17 of 18 DoD
`[x]`, 1 `[~]`.**

**The ceiling was ruled against the measurement (`ADR-042`, T1 · TD-117 · TD-090).** For four sprints
the direction rested on TD-117's *"raising the budget cannot work, the 600 s ceiling being
external."* Two detached full-profile runs completed at **1263 s** and **1370 s** — 2.1× and 2.3× the
ceiling — ran every harness, truncated nothing, and printed their own verdicts. The constraint is a
**foreground-call** limit, and the assertion was unfalsifiable in the direction it claimed:
`qa_ceiling_check` runs ~20 lines before the verdict, so its FAIL branch could only ever fire in runs
that were *not* killed, while its message read *"a run past the ceiling is killed from outside with
no verdict line."* The branch now prints an **uncounted INFO** naming the elapsed figure, the
not-killed fact and the foreground caveat. The trade-off is recorded rather than smoothed: a
genuinely too-slow gate now reports where it used to fail, and TD-117's own *"cheaper still to learn
to ignore, which is how a guard dies"* applies to the line this creates.

**Three Bun harnesses were reporting `only 0 test(s) ran` over green suites (T2).** `run-dod-delta-`,
`run-s4-ts-evaluators` and `run-s4-differential-parity` parsed `bun test` output without stripping
ANSI, so **156 assertions ran and were never counted**. Fixed; discrimination proven live and then
reverted, which is filed honestly as **TD-165** rather than claimed as a retained fixture — these
three wrap real production test files instead of a fixtures directory, so retaining a must-FAIL would
mean a permanently broken shipped test or new shell scaffolding.

**An unmatched task-shaped commit subject now FAILs loudly (T4 · `TASK-351` · L-202).** Rule 7 in
`attributeClaim`: a first token that looks like a task but matches no structural arm returns
`unmatched-shape` and names the subject, instead of falling through to a silent coord/unscoped pass.
Its first fix **reintroduced the class it closed** — the exclusion scanned arbitrary free text
case-insensitively, so any subject whose prose merely contained a `T<digit>` substring was re-exempted
— caught by a worktree-isolated outside review and sent back as a bounded retry rather than patched
by the coordinator. Reach, re-derived by that reviewer over four independent populations (commit
ancestry, `main`, `git log --all` including ~90 unmerged agent branches, and `git fsck --unreachable`):
**exactly 1 subject in this repository's entire history**, which is the retained fixture.

**The close found two defects nothing else had.** The first completed system-verify in this sprint
printed `226 pass, 2 fail`: a harness file changed twice by T4 and declared by no task (fixed, fourth
`Layers:` correction of the sprint), and a commit that ticked another task's DoD under its own
subject. The second is true and cannot be fixed forward — filed as **TD-166** with **L-205**, because
the leg's population is scoped to the *active* sprint, so the finding clears by closing while ADR-021
blocks the close on it. Closed on an owner ruling, with the defect carried rather than waived.

`TD-165` · `TD-166` filed · `TASK-354` filed `origin: close-retro` · **L-205** filed · **L-108**
bumped to count 15, **L-120** to ×6 and **L-151** to ×5 — every one of those three a sighting where
the promoted rule was loaded and cited in the same session it failed to reach.

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
