---
sprint: 074
slug: first-spec-driven-checker
owner: Maintainer
last_updated: 2026-08-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-074 — Execution Log

> Append-only companion to [`../SPRINT-074-first-spec-driven-checker.md`](../SPRINT-074-first-spec-driven-checker.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-16 | promote | spec 0.4.0's rule ids are indistinguishable from filenames to the Layers checker

**Found at promote, by the gate, on the first run of the rendered Plan.** T2's DoD names the seven §13
rules it checks. `check-layers-completeness.sh` extracts file-shaped tokens from DoD prose with
`` `[A-Za-z0-9_./-]+\.[A-Za-z]+` `` — and `S13.TRAILERS` satisfies that pattern exactly: word characters,
a dot, letters after it. So all seven were reported as **files named in the DoD and absent from
`Layers:`**.

**This false-positive class did not exist before SPRINT-073.** Rule ids were minted at spec 0.4.0 — about
a hundred of them — and every one is shaped like `basename.ext` to any matcher that defines "file" by
punctuation. The checker is not wrong about its own contract; the corpus grew a new token shape and
nothing told it.

**Fixed by declaring them on `Cites:`, which is correct rather than expedient.** T2 *answers to* those
rules and does not touch them, and `Cites:` is defined as exactly that — "the sources this task answers
to". The alternative fixes were both worse and both were considered: adding them to `Layers:` would
declare non-files as touched, and un-backticking them in the prose would change how the Plan reads in
order to dodge a matcher. Worth stating that distinction explicitly, because TD-048's re-review this
same promote records the *opposite* case — a `Cites:` line rewritten purely to satisfy the parser, with
the more useful declaration deleted. The tell is whether the corrected declaration is **more** true or
merely more parseable. This one is more true.

**Not filed as a `TD-NNN` here** — §10 files tech debt at Sprint **Close**, and this entry is the sweep
material for that Retro. Related but distinct from **TD-048** (a declared path not matching a bare
basename in prose: under-matching a correct declaration) and from **TD-062** (a §2 cap cell's first digit
run becoming the cap): all three are one checker family deciding what a token *is* from its shape rather
than from its position, which is L-108's rule applied to three different fields. Three sightings across
two sprints is worth naming at close.

Gate after the correction: **150 pass / 0 fail**, run as its own call with its exit code read.

### 2026-08-17 | scope-change | two DoD premises did not survive G1 recon; both ruled at the gate

**What broke — F2, the load-bearing one.** T2's DoD verifies its five finding names against
"the finding name the register **already published**", and D2 states they are "a contract already
published one sprint before any code". The register publishes no such names. Its §13 row reads
`**→ TASK-228**, the §13 attestation checker. Findings specified there, not duplicated here` — every
other `build` rule got its name in that table, and §13's were *deliberately deferred to this task*.
Grepped repo-wide before concluding: the five names exist nowhere.

So the DoD's verify method had no referent. Left alone it would have been ticked green against nothing,
or quietly re-read to match whatever T2 happened to name — L-088's exact shape, and the reason that
rule says get the owner's ruling rather than round the criterion to fit.

**Impact.** T2 now *specifies* the five names (which is what register line 81 instructs) and completes
that row to point at them. The DoD row is restated from *"matches the register verbatim"* to *"the five
names are specified in the checker and register line 81 resolves to them"*. This creates a file overlap
the promote-time map could not see — `docs/research/conformance-dispositions.md` is now touched by T1
and T2 both. **T1 owns it and commits first**; T2 appends to the row afterwards.

**What broke — F1.** `spec/STANDARD.md` says at `:859` and `:874` that **three** of §13's rules are
`implementation-directed`. Its own Conformance table shows **two**, §14 `:918` says **two**, and the
dispositions register `:125` already recorded *"**2** sit in §13, not 3"*. The arithmetic settles it
without a judgement call: `:857` claims 5 mechanical of 7, and 5+3=8. The correction was written into
the register at SPRINT-073 and never landed in the spec it corrects.

**Impact.** Folded into T1, which already opens the spec and writes a `spec/CHANGELOG.md` PATCH for
exactly this class of change. Not deferred to a TD row, because T2's D3 turns on *how many* §13 rules
are excluded from evaluation — building the checker against a spec that answers that question two ways
is the avoidable version of the problem.

**A third, smaller reading — stated so sign-off is informed rather than silent.** T1's DoD row 3 requires
each newly-marked rule to gain a disposition, *"a `build` row names its finding, a `scope-out` row names
its reason"*. `S5.DISCARDLOG` ruled `implementation-directed` gains **neither**: that mark leaves the
checkable set entirely, so the register records it alongside the other five carried rules. Same shape as
F2, one size down.

**Re-confirm G2.** All three ruled by the owner at the gate, before any file was touched:
F2 → T2 specifies + register completed · F1 → folded into T1 · rule-source → **§13's Conformance table
supplies rule ids, levels and marks; the code supplies only the mechanics per id**. Hard-coding was
priced and rejected on the record (it answers D1's question "no" by construction); prose-parsing was
rejected because the machine-readable form already sits in the table below the prose. G1+G2 signed
`G1,G2 @ 296115e`.

### 2026-08-17 | surprise | the QA gate goes red on the calendar, not on the code

**T1's first gate run: 150 pass, 1 fail — `knowledge index STALE`.** Nothing T1 touched feeds that
index: `S4.INDEX` and `S5.DISCARDLOG` are spec rules, and the register's ADR-009 metadata (`id` ·
`tags` · `domain` · `related`) is untouched. Regenerating confirmed it — `sh scripts/gen-index.sh`
changed **one line**, `last_updated: 2026-08-16` → `2026-08-17`, with the index body byte-identical.

**Cause.** `gen-index.sh --check` is `cmp -s "$tmp" "$OUT"` — a byte comparison of a freshly generated
file against the committed one — and the generator stamps `last_updated:` with **today's** date. So the
check fails on any day after the index was last regenerated, whatever the corpus does. The evidence is
two runs of the same tree: this sprint's promote entry records **150 pass / 0 fail** yesterday; today it
is **150 pass / 1 fail**, and the only difference is the date.

**Why it is worth a row rather than a shrug.** This is a gate reporting red on correct code, which is
the failure mode that costs the most downstream: it trains the reader to re-run the generator and move
on, and the day it goes red for a *real* reason it will read the same. It also lands squarely on
`S10.MATCHER`'s territory — a check deciding staleness from a byte compare that includes a field
guaranteed to drift.

**Not fixed here, deliberately.** The cure is a checker change (compare the generated body, exclude the
stamped field — or stamp from the newest corpus mtime rather than from `date`), and T1 is a spec-ruling
task. Mixing a gate-matcher change into it is the same reasoning D4 used to keep TD-048 out of this
sprint: two matcher changes in one sprint make either regression hard to attribute. **Retro material for
a `TD-NNN`**, filed at close per §10. Working-tree cure applied for now: ran the generator, which is
what the FAIL asks for. `docs/knowledge-index.md` is excluded from `check-layers-observed.sh` on both
paths as a GENERATED file, so committing it does not need a `Layers:` declaration.

**Caught only because the artifact was read.** The backgrounded gate reported **exit code 0** — that was
the compound command's status (`sh qa-check.sh > log; echo EXIT=$?`), where the trailing `echo` succeeds
regardless. Trusting it would have committed straight through a red gate. The verdict came from the
output file saying `QA-CHECK: 150 pass, 1 fail` (L-045 · L-057 · L-120).
