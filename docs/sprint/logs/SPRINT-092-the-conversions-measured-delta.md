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
