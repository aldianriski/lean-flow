---
sprint: 074
slug: first-spec-driven-checker
owner: Maintainer
last_updated: 2026-08-18
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

### 2026-08-18 | progress | T2 — the first spec-driven checker, and what the spec could not supply

**D1's question, answered: yes, and the honest form of yes is a split.** The rule-source ruling went to
the owner at a popup with all three candidates priced. Chosen: **(a) parse §13's Conformance table**.

A correction the pricing forced before the choice could even be stated: **§14 carries no per-rule
table.** It is the legend — levels, marks, the counts — and the per-rule tables live in each section's
own `Conformance.` block. So the DoD's "parse §14's Conformance tables" resolves to *§13's* table, read
under §14's definitions. Worth recording because the promoted DoD and the sprint header both phrase it
as §14's, and a reader coming to the checker later would look in the wrong place.

**What is spec-driven and what is not — stated rather than glossed.** The **rule set and its marks** are
read from the spec at runtime. The **assertion bodies** are the checker's own, because "all three
required together" and "the `Evidence:` value's shape" are simply different code. Claiming both halves
came from the spec would be the theatre §13 spends its longest paragraph warning about, so the header
says which half is which. What the split buys is not code reuse — it is three behaviours no hard-coder
has: a rule **added** to §13 later is reported as `rule-unimplemented` rather than silently vanishing; a
table the checker **cannot parse** is reported as `spec-table-unreadable` rather than checking nothing
and exiting clean (L-058); and `implementation-directed` exclusion is **derived from the Mark column**
rather than remembered by the author — which is D3 enforced by construction rather than by discipline.

**The parse is position-anchored, not substring-matched.** §14 names `S13.NOINFER` and `S13.NOTAUTHOR`
in prose when it explains the category, so a `grep 'S13\.'` would ingest that prose as rules — L-108
exactly, in the one place where a wrong answer is invisible. The matcher requires a line *starting* a
table row with a backticked id, scoped to the §13–§14 window. Cross-checked before it was trusted, with
numbers that could have disagreed: **7 rows in-window · 7 row-shaped file-wide · 10 total `S13.`
mentions** — the 3 excluded are exactly §14's prose.

**A real finding on our own repository, from the first live run — and it was the checker that was
wrong.** `S13.AGREE` failed against T1's own commit: the `Evidence:` pin `296115e` resolves to a version
of the sprint file carrying **no `gates_signed:`**. That is not a defect in the trailer. `gates_signed:
<GATES> @ <sha>` names the commit gates were signed *at*, so the field naming that sha is necessarily
written in a **later** commit than the one it names — meaning the first attested commit of every sprint
would be structurally incapable of clearing the finding. A finding no adopter can ever clear is the one
thing §14 forbids outright. Cured by reading the record at the pin, falling back to the attesting
commit's own tree, and **naming which one answered** in the output. Absent from both is still a FAIL.
Found by running the thing, not by reasoning about it.

**Findings: five names published, two carrying rulings.** `attestation-trailers-incomplete` ·
`attestation-not-on-task-commit` · `evidence-path-unpinned` · `attestation-disagrees-with-sprint` ·
`attestation-unsigned-claim-only`. The register row that *deferred* them (line 87, not 81 as the DoD's
restatement said — the deferral had moved) is replaced by five rows plus both rulings, because an
adopter reading only the table would otherwise meet them as surprises:
- **`attestation-unsigned-claim-only` reports at exit 0.** §14 says a conformant report states a level
  and the findings preventing the next one. An unsigned commit with perfect trailers has reached
  **Gated** and has not reached Attested; that is a level, not a failure. Its fixtures therefore assert
  **output**, never status — the only way to separate "reported honestly" from "silently passed" (L-103).
- **`evidence-path-unpinned` hardens a *strongly recommended* into preventing-Attested.** A ruling with
  a stated cost, not a default: §13a's own worked example exists because a bare path in this repository
  would already be dead. It stays clearable — the adopter adds the sha.

**All-green on the first run proves nothing, so two defects were seeded.** (1) Hard-coding the rule list
— i.e. shipping candidate (c) — reddened **exactly** the two rule-source cases and correctly left the
other fourteen green, since a hard-coder still checks the five rules right. That precision is the point:
those two cases are the only thing separating the chosen design from the rejected one, and without them
the header comment would be the sole evidence. (2) Reporting an unsigned trailer as proof reddened four.
Restore verified clean both times. **16 assertions, all green, retained** (TD-012).

**Wired in both halves, because present-in-its-own-file is half-shipped (L-020).** The *checker* runs
always-on as `qa-check.sh` leg 2f-bis against HEAD — it reads git objects that already exist and builds
nothing. Its *harness* goes to `eval_harnesses_optin`: 6 throwaway repos via `mktemp -d`, which is
precisely TD-016's declared boundary. The split is the declared cost rule applied honestly rather than
the whole task landing on one side of it. The leg firing is visible in the count: **150 pass at T1 → 154
now**, the delta being this checker's four PASS lines.

**Independent corroboration nobody asked for.** Run against this repository, the checker reproduces
§13d's own worked-example verdict unprompted — **Gated, not Attested, `%G? = N`**. The spec's prose and
a tool that never read that prose agree on the same repository.

**Gate: 154 pass / 1 fail → the known stale-index calendar artifact**, already logged as T1's `surprise`
entry this same sprint. Regenerating changed exactly one line (`last_updated`), index body
byte-identical — my register edit touched no ADR-009 metadata, so this is the date drift again and not
a content change. Still a `TD-NNN` for close, now with a second sighting.

**And the trap fired again, one sprint after being written down.** The background runner reported
**exit code 0** while the artifact read `QA-CHECK: 154 pass, 1 fail / QA_EXIT=1` — the wrapper's status,
not the gate's. T1's own entry warns about this in as many words. Read the output file, never the
reporter (L-045 · L-057 · L-120).
