---
sprint: 102
slug: make-the-gate-green
owner: Maintainer
last_updated: 2026-09-20
status: closed
gates_signed: G1,G2 @ 516c81c
plan_commit: ef02be0
close_commit: 2b1473f
update_trigger: sprint execute/close events
---

# SPRINT-102 — Make the Gate Green

> **Theme:** No configuration of this gate has been green for four sprints, and `night-run.sh`
> refuses to fire on a red one — so the gate, not the envelope, is what now blocks EPIC-015
> § Closed-when 1. This sprint does not fire the run. It produces the one thing every attempt has
> lacked: a gate configuration that is **complete** and **green** and is **the one pre-flight
> actually invokes**. SPRINT-099 was "Make the Gate Finish"; it finished, honestly, and stayed red.

## Scope

**In:** a ruling on the ceiling, backed by the measurement already taken · the three Bun harnesses
returning real test counts · the pre-flight item 3 criterion corrected everywhere it is live · the
`check-dod-delta.ts` silent-exemption seam closed.

**Out (deferred):** firing the unattended run (`TASK-319` / `TASK-188` — SPRINT-103, and they stay
paired) · reclaiming leg-12 runtime by optimisation (T1 may rule it unnecessary; if it does not, it
is its own sprint) · `TASK-348`'s host-envelope re-filing · anything touching `night-run.sh`'s launch
path beyond what T1's ruling requires.

## Plan

### T1 — Rule the ceiling against the measurement, not against the assumption `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `scripts/qa-check.sh` (the `QA_CEILING_SECONDS` block ~:1446-1460) · `scripts/lib/qa-budget-check.sh` · `evals/run-qa-budget-fixtures.sh` · `TECH-DEBT.md` (TD-117 · TD-090) · `docs/research/logs/qa-gate-timing.md` (the new Round) · `docs/adr/ADR-042-the-command-ceiling-is-a-foreground-limit.md` · `docs/DECISIONS.md` · `docs/knowledge-index.md` (generated) · `scripts/night-run.sh` (read-only unless the ruling requires changing how pre-flight invokes the gate — it did not; ADR-042 rejected that path)
<!-- Layers corrected during execution per L-100: the promote declaration named `possibly an ADR` and
     omitted the lib/fixture/index files the ruling turned out to touch. A `Layers:` line cannot name
     files the implementation invents; declaring before the work is what makes the edit expected. -->
Depends-on: none
Cites: L-120 · L-111

TD-117 rejected "raise the budget" on the grounds that *"the 600 s ceiling is external."* The
measurement taken at this promote falsifies that for the mode that matters: a **detached** run
completed in **1263 s**, ran every harness, truncated nothing, and printed its own verdict — while
`qa-runtime-over-ceiling` FAILed it for having taken 1263 s, on the stated grounds that *"a run past
the ceiling is killed from outside with no verdict line."* That message was printed by the run it
says cannot exist. The ceiling is a **foreground-call limit, self-asserted retrospectively**, not a
host limit. Rule what it should be per invocation mode, and make the assertion say something true.

**Acceptance:** a named gate configuration exists that is (a) COMPLETE — zero unrun harnesses, (b)
GREEN, and (c) reachable by the command `scripts/night-run.sh` pre-flight actually invokes. Not "a ruling" —
the row's old wording was satisfiable while leaving the run unreachable (L-111).

**DoD:**
- [x] The 1263 s detached run is recorded in `docs/research/logs/qa-gate-timing.md` as a new Round, with host load stated and the raw log's location named — *Verify: the Round exists and names `START_EPOCH`/`END_EPOCH`* ✓ **§ Round 15**, carrying **two** runs (1263 s · 1370 s) rather than one — A1 required a second observation because TD-090 records 1.92–2.20× host variance on byte-identical code
- [x] `QA_CEILING_SECONDS`' meaning is ruled: what it asserts, for which invocation mode, and why — recorded where the assertion is read, not only in the ledger (L-151) ✓ **ADR-042**, indexed in `docs/DECISIONS.md` (42 rows = 42 files), and the ruling is written into `scripts/qa-check.sh`'s own block comment where the next reader of the assertion meets it
- [x] The ceiling assertion no longer FAILs a run that demonstrably completed and verdicted — *Verify: a detached full-profile run prints `N pass, 0 fail` for this reason* ✓ branch now calls `qa_ceiling_info_line`, uncounted. Fixture case 12 extracts the **real shipped case-statement** (sed between its own anchors, not a hand copy) and runs it at Round 15's measured 1263 s → `pass=0 fail=0`; case 13 is the in-ceiling sibling, green in the same run. **End-to-end confirmation is the close's system-verify run**
- [x] TD-117 and TD-090 carry the ruling and the measurement; neither is left as a standing condition ✓ TD-117 carries ADR-042, both falsifications, and keeps its **cost half explicitly OPEN**; TD-090 carries the 272-spawn mechanism
- [x] **Re-sized at G2 if the chosen fix is Tier G implementation rather than a ruling** — `[size: M]` is inherited, not derived (codex, 2026-09-16) ✓ **re-tiered to G during execution** and the full bar applied: retained fixtures, sibling control, seeded-break proof under one stated hash convention. `[size: M]` held — the implementation was ~11 lines plus a new pure formatting function
- [x] The 272-spawn finding is recorded against TD-090 as the cost mechanism — ~2 s per checker invocation, `sys`-dominated, 272 × ~2 s ≈ the measured runtime. **Not fixed here**; recorded so the next cost sprint starts from a mechanism instead of a table ✓ filed with the arithmetic, the per-harness spawn counts, and the note that this is **L-144 — an already-promoted learning — with 272 live counter-examples** (L-020's shape)

### T2 — Strip ANSI before parsing `bun test` counts `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `evals/run-s4-ts-evaluators.sh` · `evals/run-dod-delta-fixtures.sh` · `evals/run-s4-differential-parity.sh` · `evals/fixtures/`
Depends-on: none
Cites: L-108 · `TASK-353`

Three Tier G harnesses report `only 0 test(s) ran` while their suites are green. Bun emits ANSI
colour even when captured, so `grep -oE '^ *[0-9]+ pass'` anchors onto an escape byte and matches
nothing. 156 assertions are effectively unrun. This is L-108's fourth live instance — a position
anchor defeated by invisible bytes — and it was reachable only once the gate ran to completion.

**Acceptance:** all three harnesses report their real counts, and a genuinely shrunken suite still
reddens.

**DoD:**
- [x] All three parse a real count — *Verify: `sh evals/run-dod-delta-fixtures.sh` prints `48 tests`, not `0`* ✓ re-run by the coordinator: `48 tests` · `87 tests` (and `21 tests` by the builder on the opt-in differential leg)
- [x] The population is **re-derived**, not inherited: every harness parsing Bun output is checked, not only the three that FAILed (L-186) — *Verify: the derivation is shown, with its cross-check varying the selection (L-198)* ✓ Q1 parse-shape grep → 3; Q2 `bun test`-invocation grep → 4, reconciled to 3 (the gate script's two hits are comment prose, confirmed by `grep -v '^\s*#'` returning nothing)
- [~] Retained must-FAIL: a dropped `describe` still trips the count floor — stripping colour must not defeat the guard it feeds — *Verify: the fixture reddens* — **NOT retained; proven live and reverted.** The harness wraps real production test files rather than a fixtures dir, so retaining one means a permanently-broken shipped test or new `.sh` scaffolding. Accepted as a judgement and filed as **TD-165** with the residual risk named. Flagged by the builder, not discovered in review
- [x] Sibling control stays green in the same run ✓ `run-s4-ts-evaluators` green while `run-dod-delta` reddened, same pass — coordinator-reproduced
- [x] Seeded-break discrimination proof under ONE stated hash convention (L-142 · L-169) ✓ convention: `git hash-object <path>` vs `git rev-parse HEAD:<path>`, used throughout. Seed landed (hash moved) and was *targeted* (569 lines unchanged, 72 `expect(` unchanged). **Reddened on the REAL count — `only 47 test(s) ran`, not the old stuck-at-0** — which is what proves the fix holds on a red run. Restore verified byte-identical

### T3 — Correct the pre-flight item 3 criterion, and require `gates_signed:` with it `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `TODO.md` (TASK-319 row) · the vehicle sprint's `approval_envelope:` design wording
Depends-on: none
Cites: `skills/orchestrator/references/night-run.md:295` · TD-109 · TD-164 · L-111 · **SPRINT-057 T5** (a different sprint's T5 — where pre-flight item 4 was introduced; cited, never depended on)

Three sprints were designed against *"the seeded Plan is **not all-J2**"*, while item 3 requires
*"**every** task declared `J0` or `J1` — a declared `J2` **FAILS** this item."* A Plan that is merely
not all-J2 can still carry a declared J2 and is refused. SPRINT-098 launched one anyway and parked;
SPRINT-101 designed another and was saved only by the gate failing first. **Prerequisite for
SPRINT-103** — promoting the vehicle on the current spec rebuilds an unlaunchable Plan a fourth time.

**Acceptance:** no live artifact states the precondition as "not all-J2", and the vehicle checklist
also requires `gates_signed:` in frontmatter.

**DoD:**
- [x] The live set is re-derived by shape, cross-checked with a varied selection (L-108 · L-198) — the archived SPRINT-098/099/101 are history and are **not** edited ✓ two independently-selected queries (plain substring · varied-shape regex over hyphen/space/paraphrase variants) converged on the same 3 live files, and the varied query found one hit the plain one missed (`**not-all-J2**`, hyphenated) — evidence the second selection did real work rather than re-running the same shape
- [x] Every live copy states the STRICT form ✓ re-verified independently by the coordinator: the remaining hits are SPRINT-102 describing the defect, TD-164 recording it historically, and TODO.md rows stating the STRICT form while quoting the old phrase in contrast. **Satisfied by the 2026-09-16 `/triage` (`ef02be0`), not by T3** — see this Log's `surprise` entry
- [x] The vehicle checklist requires `gates_signed:` recorded in frontmatter — absent from SPRINT-101, where it sat as the *next* foreclosure behind the red gate ✓ `night-run.md:302-303`, pre-flight item 4, traced to `3a1cfc1` (**SPRINT-057 T5**). **This criterion was already true when the Plan froze** — it could not have failed
- [x] TD-164 records why the signed SPRINT-101 envelope stands unedited and is not precedent ✓ row present; states that editing it *"would invalidate the pin and forge a signature onto a design the owner did not approve"*, and records it as **not precedent**

### T4 — Make an unmatched commit-subject shape FAIL loudly in `check-dod-delta.ts` `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/check-dod-delta.ts` · `evals/dod-delta.test.ts` · `evals/fixtures/dod-delta/` · `evals/run-dod-delta-fixtures.sh` (the `min_tests` floor, 48 → 54 → 61 — declared late, per L-100; the gate's `layers observed` leg named it)
Depends-on: T2 (its fixtures run through the harness T2 repairs)
Cites: L-202 · `TASK-351` · **SPRINT-101 T3** (a different sprint's T3 — cited as the origin of the finding, never depended on)

Before `attributeClaim` returns `coord`, test whether the subject's first token after `sprint(NNN):`
matches the task-token shape, and FAIL naming it rather than silently exempting it. SPRINT-101 T3
needed four rounds to reach an exhaustive population; the largest gap was **137 of 701** commits
silently exempt. Proposed by its own builder when asked to report rather than build.

**Acceptance:** a subject in a shape no current arm admits reddens, naming the subject.

**DoD:**
- [x] An unmatched task-shaped subject FAILs and names itself ✓ new Rule 7 in `attributeClaim`, between Rule 6a and the `coord` fallback; returns `{kind:"unmatched-shape"}` and `checkDodDelta` FAILs naming the subject verbatim. Preserves rules 5/6a's *examined* refusals (adjacent `+combined` token · a qualifier naming a second task) — those are deliberate, not silent gaps, and two exclusion-sibling tests confirm they still resolve `unscoped`
- [x] Fixture: such a subject reddens, with a genuine coordinator subject staying green in the same run ✓ both fixtures drawn from **real history**, retained under `evals/fixtures/dod-delta/`. **L-166 discharged by a full `git log --all` scan**: exactly one subject newly resolves `unmatched-shape` — `sprint(094) T4 + record fix: prune 29 merged branches, untick two false DoD` — previously silent. Coordinator re-derived independently: the subject exists and the shape count across all history is **1**. Seeded break (one convention: `git hash-object` vs `git rev-parse HEAD:<path>`): one-token seed, line count unchanged, **52 pass / 2 fail** — exactly the two new cases reddened while the sibling and 52 others stayed green; restore byte-identical. `min_tests` 48 → 54, `54 tests, 0 fail` re-run by the coordinator, `tsc --noEmit` clean
- [x] **Not oversold at G2** — this closes the coord/task boundary only, not the general class; its proposer recorded that honestly and the scope-note stands ✓ **held, after one correction.** The sprint file, the Execution Log, `TASK-351`'s `scope-note:` and Rule 7's own block comment all state the narrow reach. One shipped line did not: the FAIL-branch comment at `check-dod-delta.ts:310` credited Rule 7 with *"the exact silent-exemption seam SPRINT-101 T3 found 137/701 commits falling through"* — **rule 6a** (`:215`) closed those 137, and Rule 7's reach is the residual shapes no arm above examined: **1** subject in this repo's full history. Narrowed at `38d02a1` (comment-only, 5+/1−, no logic touched; 61 tests pass, `tsc --noEmit` clean). Found by reading the artifact a reader of the rule actually meets, not the ledger that already said it right (L-151)

## Decisions (pre-locked)

- **D1** — **No `epic:` frontmatter.** This is gate work, not an EPIC-015 condition. Precedent is SPRINT-099 "Make the Gate Finish", also gate work, also no `epic:`; SPRINT-101 carried it because it fired the run. A member row that contributes to no § Closed-when condition is noise in the rollup.
- **D2** — **The run is NOT attempted this sprint.** Every task here is `HITL`, and T1/T3 are declared `J2` — so this Plan **fails pre-flight item 3 by construction** and is not launchable unattended. That is deliberate: the J2 decision work and the all-`J0`/`J1` vehicle cannot be the same Plan, which is the error SPRINT-101 made under the corrected reading T3 ships.
- **D3** — **T1 is not gated on T2/T4 being green** (L-111's lesson from SPRINT-089 D3): no unrelated slippage may foreclose the ruling this sprint exists to take.
- **D4** — **Tiers declared (ADR-029):** T2 and T4 are Tier **G** — a false negative in a count floor or an exemption arm is silent by construction, so both take the retained must-FAIL + sibling control + seeded-break proof, and both get an outside reviewer dispatched worktree-isolated (L-165 · L-168). T1 is a **decision** and T3 is Tier **P**.
- **D6** *(taken at G2, 2026-09-16)* — **T1's fix is a MODE-AWARE ceiling in `scripts/qa-check.sh`; the launch path is not restructured.** `QA_CEILING_SECONDS` keeps asserting ~600 s for a foreground call, where the limit is real, and asserts the measured limit otherwise — so the gate stops FAILing runs that demonstrably completed, without touching how pre-flight invokes it. **Reachability caveat, surfaced now rather than at T1's DoD (L-111):** `qa-check.sh` cannot detect its own invocation mode, so the mode must be **declared by the caller**. If that needs `night-run.sh` to export one variable, it is inside T1's existing `Layers:` allowance (*read-only unless the ruling requires it*) and is **not** the rejected option (b), which was re-plumbing pre-flight to run detached and read a verdict file — the L-045/L-120 surface this deliberately avoids.
- **D7** *(taken at G2, 2026-09-16)* — **T1's ruling earns an ADR.** It reverses TD-117's recorded *"raising the budget cannot work, the ceiling being external"*, which shaped four sprints. Hard-to-reverse · surprising · a real trade-off — §4's three-part bar, met. Without it the next reader finds two contradictory rulings and no record of which won (L-151: the decision must reach the consumer).
- **D5** — **Cost reclamation is out of scope.** The 272-spawn mechanism is recorded by T1 but not fixed. If T1's ruling makes the gate green without it, optimising runtime is a separate, later question — and Round 14's figures are drawn from *truncated* runs, so they are not a valid baseline anyway (L-130).

## Assumptions

- **A1** — A detached run is not killed by any host limit. **Measured once** (1263 s, complete, 2026-09-16). *Confirm: T1 re-runs it at least once more before the ruling freezes — one observation is an anecdote (TD-090 records 1.92–2.20× host variance on byte-identical code).*
- **A2** — The three Bun harnesses share one cause. **CONFIRMED for `dod-delta`** by direct reproduction; the other two are inferred from an identical symptom. *Confirm: T2 verifies each independently rather than inheriting this line (L-130).*
- **A3** — No live artifact beyond `TODO.md:118` carries the "not all-J2" misreading. **UNCONFIRMED** — the sighting came from reading one row, not a sweep. *Confirm: T3's first DoD.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-102-make-the-gate-green.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here
> (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/qa-check.sh` | T1 | the ceiling branch reports instead of failing — it was FAILing runs it also proved were not killed (ADR-042) | Med | fixture cases 12/13 + a detached full-profile run printing its own verdict |
| `scripts/lib/qa-budget-check.sh` · `evals/run-qa-budget-fixtures.sh` | T1 | new `qa_ceiling_info_line`; case 12 extracts the **shipped** case-statement by its own anchors rather than copying it | Med | seeded break reddened 12, sibling 13 green, restore byte-identical |
| `docs/adr/ADR-042-*.md` · `docs/DECISIONS.md` · `docs/knowledge-index.md` | T1 | the ruling recorded where the assertion's reader meets it, not only in the ledger (L-151) | Low | 42 index rows = 42 files |
| `docs/research/logs/qa-gate-timing.md` · `TECH-DEBT.md` (TD-117 · TD-090) | T1 | Round 15's two detached runs (1263 s · 1370 s) + the 272-spawn cost mechanism | Low | Round names `START_EPOCH`/`END_EPOCH` |
| `evals/run-dod-delta-fixtures.sh` · `run-s4-ts-evaluators.sh` · `run-s4-differential-parity.sh` | T2 | strip ANSI before parsing `bun test` counts — all three reported `only 0 test(s) ran` over green suites, 156 assertions silently unrun | Med | discrimination proven live (seeded `test(`→`test.skip(`), **not retained** → TD-165 |
| `scripts/lib/check-dod-delta.ts` | T4 | Rule 7: a task-shaped first token no arm admits becomes a **loud** exemption; its scope comment narrowed to what it actually closes | Med | 61 tests; full-history scan = 1 subject, re-derived by an outside reviewer over 4 populations |
| `evals/dod-delta.test.ts` · `evals/fixtures/dod-delta/` (4 dirs) | T4 | retained must-FAIL ×3 + sibling control, all drawn from real history | Med | seeded break reddened exactly the new cases; `min_tests` 48 → 54 → 61 |
| `docs/sprint/SPRINT-102-*.md` + `logs/` sibling | T1–T4 | Plan ticks · four `Layers:` corrections · the Execution Log | Low | `check-layers-observed.sh` PASS; `dod-delta` clean on every commit but `b89d6f0` |

> **T3 changed no file.** It was found already satisfied before dispatch — recorded as a planning
> defect in the Log, not as a win.

## Retro

**Retrieval check** — yes, twice, and both are filed. **L-196's own derivation command was wrong**
was inherited knowledge from SPRINT-101 and did not recur here. What did: the `severity: **high**`
census miss is a fifteenth sighting of **L-108**, whose promoted rule was loaded and being applied to
the *ids* in the same command that mis-selected the *statuses*; and the wrapper-exit shape is a sixth
sighting of **L-120**, assembled by the coordinator in the session that quoted (c) verbatim. Neither
was a retrieval miss in the "could not find it" sense — both were found, cited, and still not
carried across one selector. That is the more expensive failure mode and the reason both are recorded
as sightings rather than new rules.

**Cost** — coordinator inline + 1 worktree-isolated reviewer (~116k subagent tokens, 48 tool calls,
~6.6 min) for the close's Tier G change; 2 full-profile gate runs (~23 min each; one discarded
because it was launched against a tree still being edited, and it died with its parent shell before
printing a verdict — no result from it was used). Per DoD **delivered**: 18 DoD across 4 tasks.

**Worked**
- **Running the gate to a printed verdict is the only instrument that found two of this sprint's defects.** The undeclared `Layers:` file survived four commits and two builder-side reviews; the cross-task tick survived the same. Both fell to the first system-verify that actually completed. The previous entry's "System-verify running" with no verdict was not a cosmetic gap.
- **The outside reviewer disagreed usefully by deriving, not by reading.** Asked to check "rule 6a closed the 137, Rule 7 reaches 1", it proved the first *structurally* (6a returns before 7 can be reached) and the second over **four** independently derived populations including `git fsck --unreachable`. A reviewer told to verify a claim will read; one told to derive a number will compute.
- **Verifying a judgment DoD found a real defect.** "Not oversold at G2" reads like a formality. Checking it against the artifact a consumer meets — rather than the four artifacts a reviewer meets — surfaced the one overselling line in the shipped code.

**Friction**
- **A rollup count that is asserted rather than derived defeats ADR-016 entirely.** `80f1122` declared `PLAN_EXHAUSTED` in both the Log and the commit subject over an open DoD, because the number was written from memory. The count exists precisely to make a mid-Plan ending visible, and it cannot do that job while it is a claim.
- **Four `Layers:` corrections in one sprint, three caught by builders and one only by the gate** — the L-100 cost is real and predictable, but the one that escaped was a file (`run-dod-delta-fixtures.sh`) touched twice by the *same* task, which is the case a builder is least likely to re-read.
- **The close ran on a true FAIL nobody can fix forward** → TD-166 · L-205.

**Pattern candidate** (→ `docs/LEARNINGS.md`)
- **L-205 filed** — a guard whose only clearing condition is the action it blocks is a deadlock, and its escape is always an owner ruling, so it trains the ruling instead of the fix. Count 1; promote if it recurs.
- **Not filed, watched:** "a count written by the actor is not evidence about the actor's own run" — this is ADR-016's premise rather than a new learning, and L-120's family already owns the reporter-vs-artifact shape. If a second rollup is asserted rather than derived, that is the second sighting and it earns a row.
