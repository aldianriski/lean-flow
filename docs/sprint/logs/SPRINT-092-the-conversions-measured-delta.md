---
sprint: 092
slug: the-conversions-measured-delta
stream: engine
owner: Maintainer
last_updated: 2026-08-29
status: active
update_trigger: appended at each execute/close event — append-only, never edited
---

# SPRINT-092 — Execution Log

> Append-only sibling of the frozen Plan (ADR-014). The § Plan is frozen at promote; a mid-sprint
> scope shift is logged **here** before the Plan is edited.

---

### 2026-08-29 | progress | G1 + G2 signed; one Layers declaration corrected before the first task

**Gates signed at `760dc69`** — the tree they were reviewed against, not a later one. G1 took the
**fast-path**: all four tasks are `origin: decomposer` and met the intake grill, so the question was
"scope unchanged since approval?" rather than the full checklist. The only delta since decomposition is
that `TASK-313`/`TASK-314`'s dependencies were *delivered* by SPRINT-091 and their `depends-on` lines
were repaired at promote.

**Both assumptions confirmed before G2, because an unconfirmed `assumes:` blocks it.**
**A1** (only the engine-spawn term is removed) — confirmed **as a magnitude, not a precise split**:
Round 10 measured engine share at 88.2–89.6%, but Round 11's own correction heading records that
`non-engine` is *derived by subtraction* and wrapper overhead is unquantified, so unaccounted cost lands
silently in that residual. Carried into G2 with that limit stated rather than as a clean confirm.
**A2** (the always-on leg is where §4's cost sits) — confirmed directly:
`run-adr-family-fixtures.sh` is present in `eval_harnesses_always` (1 of 31 harnesses) and is recorded
at 30.0 s.

**Owner ruling at G2 — T2's coverage relocation is acceptable as designed.** What moves to the opt-in
profile is the *differential parity against Shell*, not §4 coverage: SPRINT-091 T12 wired the §4
evaluators into `composedDispatch`, so §4 still evaluates in TS on every gate run. **T2's fourth DoD
stays the binding one** — semantic coverage unchanged, not merely relocated — and its FAIL blocks the
tick rather than being read around (ADR-021).

**A `Layers:` declaration was corrected at G2, before any task ran (L-100).** T3 declared a bare
`evals/` directory, which the ownership map derives from — and a directory declaration *swallows*
`evals/run-night-run-rollup-fixtures.sh`, which the concurrent `autonomy` stream owns. The D-rows
already fixed this in prose, but the pre-dispatch preflight reads `Layers:`, not prose, so the
declaration would have reported a genuine cross-stream collision. Narrowed to
`evals/run-adr-family-fixtures.sh`. **L-100's point exactly: a `Layers:` line is a live declaration
corrected per task, not a frozen prediction to defend** — so this is logged and continued, not argued.

**And the correction had to be made twice, which is the part worth recording.** The first narrowing left
the phrase "narrowed from the bare `evals/`" in the explanatory tail — backticked — and
`check-layers-completeness.sh` parses backticked tokens on a declaration line as declarations. The
directory came straight back in through prose *about* removing it. That is **TD-119's class for the
fourth time this session** and L-108's shape underneath it: a parser matching a token wherever it
appears, including inside the note explaining why the token should not be there.

Checkers after the correction: `check-layers-completeness` · `check-verify-reaches` · `check-authority`
— **0 FAIL each** across both Plans.

---

### 2026-08-31 | T1 | fixture factories landed and verified — three DoD ticked, bookkeeping reconciled

**T1's work was already in the tree; its bookkeeping was not.** Three commits — `043a7d6` (the
factories), `211fbf3` (close a DoD-1 gap: `f4-registry`/`s4-append-registry` migrated), `ab75b2c`
(revise: correct the input-side bypass description, comments only) — are all ancestors of `HEAD`, yet
every T1 DoD was `[ ]` and this Log had no T1 entry. The `engine` and `autonomy` streams interleaved
and 092's ticks were dropped when the session turned to 093's close. **Logged rather than quietly
tidied:** a Plan whose criteria are satisfied in the artifact but unticked in the record is the same
disagreement class as the reverse, and the reverse is the one CLAUDE.md names (L-045 · L-060).

**Verified against the artifact, not against the commits.** A commit message is evidence about the
committer; each DoD was re-derived here:

- **DoD 1** — nine of ten §4 test files import the factory. The tenth, `adr-family.test.ts`, is
  deliberately out and carries its own in-file rationale from the coordinator review: it asserts
  `canonicalAdrs(...)` return values, never a `.verdict`, so the verdict-blindness guardrail has
  nothing there to guard. Worth noting the grep that found it also matched `s4-onefile.test.ts` — on a
  *comment* mentioning `new InMemoryAdrFamilyPort({...})`, i.e. prose about the thing being removed.
  **L-108's shape again, in this sprint's own verification**, and the reason the hit list was read
  rather than counted.
- **Byte-identical verdicts, two independent proofs.** *Structural:* `git diff --name-only 817f391
  ab75b2c` is 13 files, every one a `*.test.ts` or a new `test/fixtures/` factory — no
  verdict-producing code changed, so the verdicts cannot have. *Live:* the retained-fixture parity
  suite spawns the **real Shell oracle** per row and matches on the **named finding**, not a bare
  verdict — 11 `(fixture, rule)` rows, four sibling controls, plus `empty-slug`'s owner-ruled
  divergence. All nine retained fixtures are reached. Printed verdict read directly off the run:
  `22 pass, 0 fail`.
- **DoD 2/3 — the guard was seeded, because green-on-first-run proves nothing.** The guardrail's
  mechanism is unusually strong: rejection is *compile-time*, and an unused `@ts-expect-error` is
  itself an error, so `bunx tsc --noEmit == 0` is a **standing** proof the guard still fires rather
  than a one-time seeding. That is exactly the property that makes it worth checking is real, so the
  two smuggling calls were re-seeded **without** their directives into a scratch file: tsc reddened
  `TS2353` on `expectedVerdict` and `shouldPass` at precisely those lines while the legitimate
  state-only sibling controls stayed green — a *targeted* break, not a demolition (L-142). Seed
  removed, removal verified (`git status --short` empty, tsc back to `0`), **one hash convention
  stated and used** — `git hash-object` on the working-tree blob (L-169).

**Review — skip-table lookup recorded, per TD-092.** `consequence · T1 · behaviour: none shipped (test
wiring + two new test-only factories; zero production files touched) · governance: **material** — Tier
G, a guard whose false negative is silent by construction`. Depth chosen: **outside reviewer, Tier G
(CLAUDE.md L-165)** — and one already ran. Its finding is legible in the artifact: the factory header's
"Known limit of (2), CORRECTED after independent review" paragraph, which walks back an overstated
claim that bypassing the excess-property check required visibly unsafe syntax, and names the
pull-into-a-`const` refactor that defeats it silently. `ab75b2c` is that revise. **The record is
reconstructed from the commits and the artifact, not written at review time** — stated plainly so a
later reader does not read it as a contemporaneous sign-off.

**Nothing was re-run for the reviewer's sake and nothing re-reviewed** — the revise loop's one bounded
retry had already fired and closed.

**And the tick itself tripped TD-119 — a fifth sighting, inside the entry above.** Writing the DoD
evidence named `` `adr-family.test.ts` `` and `` `adr-fixture-factory-guardrail.test.ts` `` in
backticks; `check-layers-completeness.sh` reads a file-shaped backticked token in DoD prose as an
*implied touched file* and reddened the gate — `209 pass, 1 fail`, the only failure being one this
bookkeeping introduced. The declaration was never wrong: T1's `Layers:` says
`` `packages/standard/src/rules/` ``, and `covered_by_dir()` matches a token against directory
**prefixes**, so a bare *basename* cannot match a directory that genuinely contains it. Both files are
touched (one created by T1, one modified), so `Cites:` would have been the false escape — the honest
fix is the full path, which the existing declaration already covers. Corrected in prose; `Layers:`
unchanged, because it was correct.

**Two process notes worth keeping.** The gate exited `1`, but the number read was its own printed
`209 pass, 1 fail` — the exit code was never the verdict (L-120). And re-running the checker
standalone first reported `exit=0` with **no output at all**: it takes sprint files as arguments and
says `no sprint files given -- nothing verified`. A vacuous pass, indistinguishable from a real one by
exit code alone, and it would have "confirmed" the fix without examining anything (L-136). Re-run with
the file named, it prints `PASS ... ### T1 Layers completeness` — the check reaching its target is the
part worth reading.

---

### 2026-08-31 | T2 | scope-change — DoD 4's premise was false; owner re-ruled before any edit

**What broke.** The G2 owner ruling accepted T2's relocation on this basis: *"§4 still evaluates in TS
on every run through the evaluators SPRINT-091 T12 wired — so what moves to opt-in is the differential
parity against Shell, not §4 coverage itself."* That is true of `bun test`. **The gate is
`sh scripts/qa-check.sh`, and it never invokes `bun test`.** Verified three independent ways rather
than argued:

1. `qa-check.sh`'s conformance-engine leg (:287–300) reduces the spec on a bare run to
   `S9.GATESWELLFORMED` / `S9.GATESABSENT` + `S13.*` only. Re-running that exact `awk` against
   `spec/STANDARD.md` keeps **0 of the 7** `S4.` rows. `QA_FULL=1` uses the full spec; the default
   profile does not.
2. Sweeping every harness named in `eval_harnesses_always` for `S4.`/`adr-family`, exactly **one**
   matches — `run-adr-family-fixtures.sh`, the harness this task removes.
3. The green gate run taken minutes earlier (`210 pass, 0 fail`) contains **zero** `S4.` lines.

So removing the harness from the always-on leg does not *relocate* §4 coverage — it **deletes §4 from
the default gate**. DoD 4 ("semantic coverage unchanged, not merely relocated") fails as designed, and
it is the DoD the owner explicitly named binding.

**This is L-130/L-136's shape at owner-ruling grain.** A structural claim about another artifact —
"the TS evaluators run on every gate run" — was frozen into a G2 ruling and inherited rather than
queried. It reads exactly like a satisfied premise. Nothing in the gate would have reported its
falsity: the harness would have been removed, the gate would have gone green, and §4 would have been
silently unguarded on every default run — the silent-false-negative shape ADR-029 Tier G exists for.

**Impact.** T2 cannot be executed as written without a coverage loss the owner did not agree to.
Surfaced as a popup rather than reinterpreted in place: CLAUDE.md's own red flag is *"quietly
reinterpreting a DoD that execution invalidated"*, and re-reading DoD 4's second branch ("or § Decisions
records exactly which coverage moved") as permission would have been precisely that — the escape hatch
used to paper over a premise failure rather than to document a deliberate trade.

**Owner ruling: add a fast TS §4 leg to the always-on gate.** Register an eval harness running only the
oracle-free §4 tests, so §4 stays semantically covered on every gate run while the 30.0 s
oracle-spawning shell harness leaves the always-on leg. Measured before building: those 9 files are
**63 tests in 119 ms** — against 30.0 s, the coverage is very nearly free, which is what makes this the
option that costs the sprint's saving almost nothing.

**G2 re-confirmed on the corrected premise.** Approach unchanged in shape; what changed is that
"§4 still evaluates" is now something the gate *does* rather than something the ruling *assumed*.

---

### 2026-08-31 | T2 | converted, swapped, and proved — 4 of 4 DoD

**Built under the owner's re-ruling.** Three new files, one edit:

- `evals/run-s4-ts-evaluators.sh` — the always-on §4 leg. Oracle-free, **83 pass / 0 fail in ~0.12 s**
  against the 30.0 s harness it replaces. It FAILs rather than skips on a missing `bun` *and* on a
  missing test file, because `bun test` exits 0 when handed only files that exist — a renamed-away
  test would otherwise shrink the leg silently and still report green (TD-101 / ADR-037's rule).
  The file list is explicit rather than a glob: a glob would adopt the next oracle-spawning §4 test
  someone adds and hand this always-on leg a 20 s subprocess.
- `test/s4-retained-fixtures.test.ts` — the nine retained fixtures through the TS evaluators, **no
  oracle spawn**. This is what keeps real-tree §4 evaluation in the default profile rather than
  letting it leave with the differential.
- `test/adr-family-harness-parity.test.ts` — DoD 1. Parses the harness's own `run_case_anywhere`
  call sites **anchored to line start** and diffs them against a declared map in both directions.
- `scripts/qa-check.sh` — the bucket swap, plus the stale justification paragraph.

**The guard was seeded in both directions, because green-on-first-run proves nothing.** A 13th case
appended to the harness reddened **only** the list-diff test — and named `seeded-thirteenth-case` in
its failure — with four siblings green. An anchor renamed inside the retained-fixture suite reddened
**only** the anchor test, list-diff still green. Each seed verified *landed* (`cmp` differs), still
*parsing* (`sh -n`), and *targeted* (+2 lines and ±0 lines respectively — a demolition is not a
discrimination, L-142). Both restored to their exact pristine blobs, **one convention throughout**:
`git hash-object` on the working-tree file — harness `bfb652cf…c156`, fixture suite `99655cad…2083`,
each re-derived after restore and compared to the figure taken before seeding (L-169).

**Two corrections this task made to its own declarations, both logged rather than argued (L-100).**
The new harness was undeclared in any task's `Layers:`, which `check-layers-observed.sh` caught —
added as the **specific file**, never as a bare `evals/`, since the directory form is what swallowed
the autonomy stream's rollup harness at G2. And the `scripts/qa-check.sh` comment declaring
`run-adr-family-fixtures.sh` a "DELIBERATE EXCEPTION" to the cost rule was left stale by the swap;
replacing it also revealed it had been inserted **mid-sentence** into the `run-foreign-repo-fixtures.sh`
paragraph above it, whose closing clause had been orphaned nine lines below its own subject. Removing
the interloper rejoined that sentence — a pre-existing defect, repaired only because this edit was
already in that block.

**Review — skip-table lookup, per TD-092.** `consequence · T2 · behaviour: **material** — removes a
harness from the gate and adds its always-on replacement · governance: **material** — Tier G, and the
one place this sprint trades a guard for time`. Depth: this is the task that most warrants an
independent pass, and it did not get one — executing inline under a standing instruction not to
dispatch subagents. **Recorded as a known gap, not as a completed review**: every guard defect across
the last two sprints was caught by an outside pass and none by the author recalling the rule (L-165),
so the absence is worth naming precisely here rather than leaving the depth row to imply coverage that
was never taken.

**Gate: `209 pass, 1 fail` → the single FAIL was `layers observed` on files still uncommitted, plus
the genuine undeclared-harness gap now fixed.** Read from the gate's own printed verdict line, with
output redirected to a file and the file read afterwards. Re-verified after this commit.

---

### 2026-08-31 | T3 | differential relocated under ADR-039 — 4 of 4 DoD

**T3 was not a list move.** The DoD reads "it sits in the opt-in eval set", which presumes the parity
tests were gated somewhere to begin with. They were not: `adr-family-fixtures.test.ts` and
`s4-append-oracle.test.ts` appear in **no** eval harness — grepping `evals/` for either filename
returns nothing — so they ran only under a bare `bun test`, which `scripts/qa-check.sh` never invokes.
"Relocating to opt-in" therefore required *creating* `evals/run-s4-differential-parity.sh` first;
without it the criterion would have been ticked against a profile membership that did not exist. The
same shape as T2's DoD 4, one level down, and found the same way — by asking what the criterion is
true *of* rather than whether the words are satisfiable.

**DoD 1 proved by removing the oracle.** "A real oracle spawn, not a copied literal" cannot be shown
by a green run — a copied literal is green too. With `scripts/lib/conformance-engine.sh` moved aside,
the two files went **17 fail / 4 pass**, and the four survivors are exactly the assertions that need
no oracle: the TS-only sibling controls and the TS half of the owner-ruled `empty-slug` divergence.
That is the discrimination, not the redness — a *total* wipeout would have proved only that the files
break when something is missing. Engine restored, hash re-derived identical
(`74ea1ef5…3178`, `git hash-object`, one convention).

**DoD 2 proved by running both profiles.** Absent from always-on (0 occurrences); present and green
under a real `QA_FULL=1` run — `PASS eval harness run-s4-differential-parity.sh`, verdict
`220 pass, 1 fail`, cost **1413 s**.

**A number that needed a second reading before it could be used.** That full-profile run printed
`1 fail` while the output contains **27** `FAIL` lines. Both are correct: 26 of them are the full
profile's own *informational* conformance sweep (its leg note says so — "informational except the two
FULLY-COVERED families"), and only the last, `layers observed` on files still uncommitted, is counted.
Recorded because the naive read is available in both directions: a reader trusting the summary alone
would miss that the sweep surfaced real governance debt, and one trusting the FAIL count alone would
report a badly red gate. Neither number means anything without knowing which leg emitted it.

**Governance debt the sweep surfaced, NOT touched here** (out of this sprint's scope, listed so it is
not lost): 15 `td-row-aged-unreviewed` rows (TD-093…TD-108), `TODO.md` at 325 lines against §2's cap
of 320, `CHANGELOG.md` holding 5 minor series inline, two tracked `run.log` fixtures under §12c, and
`closed-sprint-not-archived` for SPRINT-093 — the last being **deliberately deferred** until 092
closes (TD-125), so it is expected rather than new.

**Scope call, recorded rather than silent:** `s4-append-shallow-reachability.test.ts` is a §4 test
that spawns the engine, but it clones this repo's real remote to prove the shallow branch is reachable
on a live artifact (L-166) — network-dependent. It is deliberately excluded from the differential
harness and named as excluded in both the harness header and ADR-039, because a harness that reddens
on a flaky connection teaches people to ignore it. Consequence to own: that one test now sits in
neither profile and is reachable only by a plain `bun test`.

**Two declarations corrected mid-task, both logged (L-100).** `evals/run-s4-differential-parity.sh`
added to T3's `Layers:` as a specific file — G2 anticipated exactly this ("a new parity harness file,
if T3 creates one, is declared here too and logged"). And `docs/knowledge-index.md`, which the new ADR
regenerates: D2 forbids changing *generation logic*, not the derived artifact, and `gen-index.sh` is
untouched (`git status` clean for it).

**Review — skip-table lookup, per TD-092.** `consequence · T3 · behaviour: **material** (a guard
changes profile) · governance: **material** — Tier G for the harness move, Tier P for the ADR text,
declared separately because the bars differ (ADR-029)`. Depth: executed inline, no independent pass —
**the same recorded gap as T2**, carried forward rather than restated as covered.
