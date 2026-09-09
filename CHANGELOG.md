---
owner: Maintainer
last_updated: 2026-09-09
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---
## v1.63.0 — Guards That Answer for Themselves (2026-09-09)

**MINOR, bundling six closed sprints** — `SPRINT-088` · `092` · `093` · `094` · `095` · `096`, each
written up in full below and left byte-for-byte as closed (this file is append-only). MINOR rather
than PATCH because the bundle carries feature work: the TypeScript engine's §4 conversion (092) and
the execution-autonomy foundation (088) are not fixes.

**The through-line, and it is the reason the six belong in one release.** Across these sprints the
repository stopped asking *does the guard work?* and started asking *can the guard be wrong in a way
that looks right?* Each answered a different layer of that, and each answer was found by an
independent pass rather than by the author:

| Layer | Sprint | What it established |
|---|---|---|
| A property nothing reads cannot go red | 094 | guards were shipped for properties no artifact produced — a guard keyed to a shape the system never emits is an absent guard that clears every proof (**L-166**) |
| A guard that misreports goes **green**, and the green becomes evidence | 095 | a checker that captures a number and prints it without comparing it is not a check (**L-184**); a fixture that fails tells you nothing about *which* of code or fixture is wrong (**L-189**) |
| Refining a proxy for an unverifiable claim never converges | 095 → 096 | three designs, three reviews, three CRITICALs, all the same class one level deeper — the loop ends by re-scoping, not refining (**L-190**) |
| The detection logic can be sound while the **member set** is not | 094 | three independent reviews returned the same verdict in different words (**L-186**, promoted to the Tier-G bar) |
| …and the **branches** can be untested even when the set is right | 096 | the full ladder was met and a load-bearing branch still had no case (**L-191**) |

**`ADR-040` is the release's centrepiece and its most uncomfortable decision.** Commit ownership
cannot be decided from a commit subject — it is prose a human typed, so every mechanism that tries to
verify it is another proxy for the same unverifiable claim. The repository now **accepts** the
resulting laundering channel, symmetrically for archived and active siblings, and says so where the
code's reader meets it: `check-layers-observed.sh` is **not** a guard against a dishonest commit
subject and must not be cited as one. Naming a bounded hole is what makes it a decision rather than
an accident — the previous state had the same hole on one arm and called it *"the pre-existing
behaviour"*. The route that would actually close it (a `Sprint: NNN` trailer written by tooling) is
recorded with an explicit re-open condition, rejected on size and not on merit.

**Known limitation shipped with this release, stated rather than buried:** `scripts/qa-check.sh`
cannot reliably produce a verdict on a developer host — it exceeds its budget under load (`TD-117`),
leg 12 dominates its cost (`TD-090`), and it can be killed for memory *after* its wall-clock guard
passes, emitting a partial run with zero failures and no verdict line (`TD-143`). SPRINT-096 closed
under a recorded ADR-021 override for exactly this. Until `TASK-334` lands, **a green-looking partial
gate run is not a pass** — read the `QA-CHECK: N pass, M fail` line or treat the run as inconclusive.
Consumers are unaffected: the gate is this repository's own tooling, and the consumer-facing entry
point is `conformance.sh` (ADR-027).

**Also in the bundle:** the unattended-run authority contract and its five terminal states (088 ·
`ADR-016`) · the §4 differential-parity split with its measured delta (092 · `ADR-039`) · the
autonomy guard gap closed (093) · `ADR-029`'s tier bar gaining clauses (iii) and (iv) from `L-169`
and `L-186` · `conformance.sh` reaching foreign repositories with real history (`L-159`).

Detail for each sprint is in its own block below, unedited.

---
## SPRINT-096 — Rule the Ownership Tension (closed 2026-09-09)

Unreleased. **17 of 17 DoD.** Three designs for *"does an archived sprint own its own commits?"* had
each been broken by an independent review, each the same laundering class one level deeper (L-190).
This sprint stopped designing and ruled: the decisive fact was found outside the task — the **active**
sibling arm had always trusted the cited number with no test at all (TD-141) — so all three designs
were being held to a bar the surrounding code never met.

| Shipped | What |
|---|---|
| **ADR-040** | **A commit citing another sprint's number belongs to that sprint — archived or active, with no further test — and this repository ACCEPTS the laundering channel that follows.** The choice was never *which proxy* but *which failure to accept*: a commit subject is prose a human typed, so every mechanism that tries to verify it is another proxy for the same unverifiable claim. Names a loser on the side taken; records the `Sprint: NNN` trailer as the only route that would *close* the channel, rejected on size with an explicit re-open condition |
| **T3 — the guard** | `check-layers-observed.sh` **-86/+70**. SPRINT-095 T1's declaration + window machinery and its temp-file map reverted (they were on `main` **unticked at 0 of 6 DoD**, having been broken by review); archived sprint numbers now discovered from **filenames** and held in the same `sibling_sprints` list as active ones, so one membership test decides both arms. Not a literal revert — that would have dropped archived sprints from the trusted set and *flipped* the asymmetry |
| **T2 — the record** | TD-125's stated cause corrected in every artifact repeating it. The named mechanism was **measured false** (85 blamed pairs with the filter present *and* deleted) and is in fact **unreachable**: the filter operates on `"$@"`, which `qa-check.sh`'s non-recursive `ls` never puts an archived file into. **Three of four cited line numbers were already stale** |
| **Fixtures** | 59 → **61**, 0 FAIL. The `archived-window` case **inverted rather than deleted**, so it now pins the accepted hole and fails loudly if anyone silently re-narrows the rule |

**The independent review changed the outcome, and that is the entry worth keeping.** T3 met the full
Tier-G bar — motivating artifact, population coverage, retained must-FAIL per check with sibling
controls, two seeded-break proofs under one hash convention — and its worktree-isolated reviewer
still found a **load-bearing branch with no case**: the archived loop's self-sibling guard. Seeding
its removal left all 59 fixtures green while real undeclared work was swallowed at **exit 0**. Fixed
and re-proven; a third seed reddens **exactly one of 61**. → **L-191**: every bar in the ladder tests
at the level of the artifact *set*, and a guard's own *branches* can still ship untested — the tell
being a comment claiming parity with a sibling that has a named case, written by the author, on
screen, and unread.

**Two results were recorded as limits rather than passes — and the close resolved one of them.** The
real 092/093 pair (21 `sprint(093)` commits inside 092's window) showed **no regression and no
discrimination**: both designs agree there, and no live sprint window cited any archived number, so
the case where they differ did not exist in the tree. **Archiving this sprint at close created it.**
14 `sprint(096)` commits sit inside each of 094's and 095's windows, and a controlled A/B on the same
tree gives the pre-T3 checker **9 extra blamed items** — `check-layers-observed.sh`,
`run-layers-observed-fixtures.sh`, `TECH-DEBT.md`, `ADR-040` — every one of them SPRINT-096's own work
re-attributed onto its siblings, which is TD-125's defect live, against a clean shipped checker. The
mechanism sharpens the ruling: the old design failed here **because** 096's `Layers:` are
unbackticked, so it dropped 096 from its ownership map entirely — its correctness depended on the
parser divergence **TD-142** records, and the shipped design reads no declarations at all. The second
limit stands: T2's corpus-grep `Verify:` could not be run as written, since a negative grep over this
corpus matches prose *about* the claim (L-108), so it became a shape classification of all 24 hits
with the positive half checked directly.

**Closed under a recorded ADR-021 owner override: system-verify produced NO VERDICT.** `qa-check.sh`
emitted 147 lines with 0 FAIL and was killed by the host for **memory** — after its wall-clock budget
guard had **passed** (`520s < 600s`). A new debt (**TD-143**) separates that mechanism from TD-084's
time-out and TD-117's budget checkpoint: same artifact, different door, and nothing watches this one.
Close proceeded on targeted evidence — `check-layers-completeness.sh` 6/0 and the 61/0 fixture suite,
which on this sprint's own subject is the stronger evidence anyway, since that harness is **opt-in**
and a *completed* bare gate would not have run it either.

**Also found:** the two `Layers:` checkers parse declarations differently while each carries a comment
asserting they are identical — SPRINT-096's own Plan yields **0** declared tokens where SPRINT-095's
yields 14 (**TD-142**). Pre-existing, over-reporting, and left unrepaired by owner ruling: backticking
this sprint's Plan to quiet its own gate is L-088's shape.

Filed: **TD-142 · TD-143** · **TASK-333 · TASK-334 · TASK-335** (`origin: close-retro`, unranked
pending `/triage`) · **L-191**. `TD-125` and `TD-141` stay `open` — a sweep closes a row by reading
the tree, and this close did not re-derive them.

---
## SPRINT-095 — Guards That Misreport (closed early 2026-09-07)

Unreleased. Closed by owner decision at **7 of 27 DoD** — one task shipped, one held unticked on a
structural finding, two never started. The theme was the adjacent failure to SPRINT-094's: that
sprint shipped guards for properties nothing read; these are guards that *do* read their subject and
report something the artifact contradicts. A property with no reader cannot go red; a guard that
misreports goes **green**, and the green is then treated as evidence.

| Shipped | What |
|---|---|
| **The dispatch preflight stops inventing dependency edges** | `TD-132`. `Depends-on:` was parsed with a bare `grep -oE 'T[0-9]+'` over the whole line, harvesting ids out of the field's own prose and ignoring a literal `none` — on SPRINT-094 it built `T2 -> [T1,T2,T1,T2]`, FAILed `cycle-detected` on an acyclic Plan, and issued three `shared-file-owned` PASSes off edges it invented. It now walks the field: an exact `Tn` is a dependency, a balanced `(…)`/`[…]` group is an annotation and is stepped over, anything else ends the list; wrapping markup is stripped, and an unbalanced bracket is reported as `depends-on-unreadable` rather than silently swallowing the line. Ships to consumers inside the plugin. **25 fixtures / 27 assertions**, the 3×2 mechanism×call-site matrix complete |

**The instructive result is the cost, and it is the reason this sprint stopped.** Two tasks scoped
`[size: S]` and `[size: M]` consumed **six independent review rounds and ~800k subagent tokens**, and
those reviews returned **eight CRITICALs — every one found by an independent pass and none by the
author's own seeded-break proofs**, each of which had run clean minutes beforehand. Four rounds
rejected outright. `L-165` reaches **count 6**.

**`TASK-298` (archived-sprint ownership) is held unticked, and not for want of a fourth attempt.**
Three designs were each broken by review, and each was the same mistake wearing a new mechanism:
trust the cited sprint **number** (91 archived numbers exempted anything) → number **+ window**
(windows legitimately nest — SPRINT-089 and SPRINT-090 share a close commit, so 090's window sits
inside 089's) → number **+ declarations** (declarations are shared — `docs/LEARNINGS.md` is declared
by **74 of 91** archived sprints). A commit subject is an unverifiable claim, so every refinement of
it is another proxy (**`L-190`**). The decisive fact came from outside the task: **the laundering
channel is pre-existing** — the active-sibling skip has always trusted the cited number with no test
at all — so all three designs were held to a bar the surrounding code never met (**`TD-141`**, `high`).
That is a tension for the owner to rule on, not an engineering fix, and `TASK-331` carries it.

**Also found, and worth more than the task that found it:** a `Layers:` declaration wrapping at
column 0 is **silently dropped** by the preflight parser, so the shared-file ownership map is built
from each task's first line only — a silent false negative in the direction that matters, caught only
because a `PASS` line *vanished* between two runs (**`TD-138`**). And TD-125's own stated cause is
wrong: deleting the `*/archive/*` filter it blames changes nothing (85 pairs before and after); the
real mechanism is a non-recursive glob upstream (`TASK-332`).

**Named rather than smoothed:** the close could not run its own gate — the opt-in profile exceeds the
600 s command ceiling, which is `TD-128`, which T4 existed to fix and which went unstarted. Four
fixture defects in a single case, each presenting as an identical red line and each passing `sh -n`,
produced **`L-189`**; `L-186` reaches count 2 and is now promotable.

---
## SPRINT-094 — Guards for What Nothing Reads (closed 2026-09-05)

Unreleased (bundles into the next version — **feature sprint, so MINOR by hand**, not
`/release-patch`). Closed at **22 of 23 DoD**; the one open box is the owner-action ruling on
archiving SPRINT-092/093, recorded at promote as not a blocker for T1–T4. Three defects, one shape:
none was a check that failed — each was a **property with no reader at all**, and a property with no
reader cannot go red.

| Shipped | What |
|---|---|
| **Epic state has a reader** | `check-epic-archive.sh` widened 143 → 312 lines with a second direction, `epic-state:` — a member sprint that closed with no rollup row or no `close_commit` · an ownership header older than its own newest member close · a ticked § Closed-when condition naming no closing sprint. Pointed at real artifacts before any fixture existed: **7 findings on EPIC-015** and EPIC-014's stale header at `d43a7a1`, each with a real passing sibling. All 7 repaired, so the gate is green rather than red-with-a-note. **17 retained fixtures** |
| **Handoff state has a reader, and §12(b)'s conversion finally happens** | A handoff carries `live` / `consumed` / `spent` in a two-field record — the sprint's Execution Log where a sprint exists, root `HANDOFF-LEDGER.md` (create-lazily) otherwise, both read by one shared function. An **UNKNOWN status is unconditionally FAILed and never assumed `spent`**, and a sprint may not close over a non-`spent` handoff. §12(b) has prescribed this conversion since the standard was written and lean-flow shipped no step that performed it. **25 retained fixtures** |
| **A capability nothing calls has a reader** | `test/architecture/unwired-exports.ts` — any exported symbol with **zero non-test callers**, detected off resolved ES import *edges* on a comment-stripped skeleton, never a bare-identifier grep. Pointed at five real symbols across three historical commits (`attachLevel`, `createF4Registry` / `createS4AppendRegistry`, `reconcile` / `marksInStandard`), each green in the current tree as its own control. **39 tests** |
| **`spec/STANDARD.md` 0.10.0 → 0.11.0** | `HANDOFF-LEDGER.md` registered in §2 with its full lifecycle contract. MINOR proven rather than argued: `read-spec-rules.sh` over 0.11.0 emits **100 rows byte-identical by `cmp`** to the frozen surface — no rule added, amended or reclassified, so no verdict can move |
| **29 merged `worktree-agent-*` branches pruned** | Each tested individually with `git merge-base --is-ancestor` *before* its delete; 29 of 29 ancestors, cross-checked against `git branch --merged main`. The 18 SPRINT-092 verified and the 11 it never checked are both now measured rather than inherited |

**The instructive result is not the three guards — it is that every CRITICAL inside them was found by
an independent pass and none by an author.** T1's review returned 3 HIGH / 3 MEDIUM / 1 LOW **inside
DoD already ticked**, minutes after its own seeded-break proof ran clean. T2 needed **five**
worktree-isolated rounds on one 40-line function: rounds 1–3 each found a silent false negative, round
2's being a regression *round 1's fix had introduced* — an unclosed code fence that **erased** a real
outstanding handoff rather than misreporting it, `PASS`, exit 0. Round 3 found the *design*, the owner
ruled the fence mechanism deleted, and the parser was rewritten strict: nothing is skipped, because
anything a parser skips it can be made to skip over a real violation. Round 4 cleared the design and
found one MEDIUM; round 5 found nothing. `L-165` → **count 5**, and `L-188` draws the dosage corollary:
for a Tier G guard, one review pass is a **floor**, not a ceiling.

**One through-line explains all three reviews:** the detection logic was sound every time; the **set of
artifacts it ran over** was not — which row is selected, which sprints count as closed, which paths are
searched, which export forms are seen. Not one fixture varied that set. Fixtures discriminate
*branches*; nothing discriminated *reachability* → `L-186`. And of the four guards the seeded-break bar
prescribes, **exactly one has ever caught anything** — the rule that a landed, targeted seed reddening
nothing has tested nothing. It fired five times this sprint; `cmp`, the line count and the parse check
passed every false seed it caught, and `cmp` is not a landing guard at all on a CRLF checkout →
`L-187`.

**Not shipped, and named rather than smoothed:** system-verify produced **no usable verdict** — two
full `bun test` runs over the same unchanged tree disagreed (`496 pass, 1 fail`, then `497 pass, 0
fail`) with no test code changed between them (`TD-135`). The close rests on the opt-in gate profile
read off the line the gate itself prints. Seven debt rows were filed in-session (`TD-130`–`TD-136`,
with `TD-131` extended) plus `TD-137` at close; `TD-132` is `high` — the dispatch preflight parses a
task's explanatory *prose* as dependencies, inventing a cycle **and** issuing shared-file ownership
PASSes off the phantom edges.

---
## SPRINT-092 — The Conversion's Measured Delta (closed 2026-08-31)

Unreleased (bundles into the next version — **feature sprint, so MINOR by hand**, not
`/release-patch`). EPIC-014's fifth member sprint, closed at **19 of 19 DoD**. The half SPRINT-091
deferred by name: it converts §4's always-on coverage off the Shell engine **and** measures what that
bought, because a conversion shipped without its measurement is an unmeasured claim recorded as fact.

| Shipped | What |
|---|---|
| **§4's always-on leg no longer spawns the Shell engine** | `evals/run-s4-ts-evaluators.sh` replaces `run-adr-family-fixtures.sh` in `eval_harnesses_always` — **23.4–28.2 s → 0.37–0.98 s**. §4 rule semantics *and* the nine retained fixture directories still evaluate on every bare gate run |
| **The differential moved to opt-in, under an ADR** | `evals/run-s4-differential-parity.sh` (new, `QA_FULL=1`) keeps the row-by-row TS-vs-Shell comparison against a **live** oracle. **ADR-039** names the §4 drift window this opens and fixes parity as mandatory at promote, close and any full-profile run — wired into `.claude/CONTEXT.md`, not into the shipped skills, so no repo path leaks to consumers |
| **Fixture factories that structurally cannot decide a verdict** | `test/fixtures/adr-family-factory.ts` + `git-repo-factory.ts`. Verdict-blindness is enforced at **compile time**: a smuggled `expectedVerdict` does not type-check, and an unused `@ts-expect-error` is itself an error, so `tsc --noEmit == 0` is a standing proof rather than a one-time one |
| **A case-for-case equivalence guard** | `test/adr-family-harness-parity.test.ts` diffs the Shell harness's own case list against its TS counterparts in both directions, pins each to a verbatim source anchor, and FAILs on any invocation form it cannot parse |
| **The delta, measured and named** | Round 13 in `docs/research/logs/qa-gate-timing.md`: default-profile saving **22.4–27.9 s**, extremes paired. It exceeds Round 12's 9.5–13.6 s ceiling by ~2× and **that is not the conversion outperforming** — the ceiling costed twelve cases converted; the shipped leg does not carry S4.APPEND's four git cases at all. Total work across both profiles went **up** ~76–85 s |

**Seven Tier G defects were found by an independent review after the sprint self-verified green**, and
fixed before close. Three were single-line edits that remove real coverage while every guard the sprint
built stays green: a harness that PASSed with **zero tests run** (`bun test` exits 0 on files with no
live tests, and the summary was echoed rather than asserted), a parity regex blind to any prefixed
call, and an `alwaysOn` flag compared only to a hardcoded copy of itself. All three sat in code written
to prevent silent false negatives. `L-165` → `count: 4`.

**Not shipped, and named rather than smoothed:** `TD-117`'s budget reduction is **not** available —
`QA_BUDGET_SECONDS` stays at 520 because no clean whole-gate sample could be taken (the default profile
exceeds the 600 s command ceiling on this host; the opt-in profile measures 1450 s). `TD-128` records
that `qa-budget-default` compares the *configured* budget to the ceiling and never the actual runtime,
so it passes precisely when runs overrun. Pruning 18 stale worktrees (178 MB) was tried as the cause and
**disproved**: 1413 s before, 1450 s after.

`TD-126`–`TD-128` · `TASK-322`/`TASK-323` (`origin: close-retro`) · `L-184`, `L-185` · `L-165` → 4.

---
## SPRINT-093 — Close the Autonomy Guard Gap (closed 2026-08-30)

Unreleased (bundles into the next version — **feature sprint, so MINOR by hand**, not
`/release-patch`). EPIC-015's fourth member sprint, closed at **19 of 19 DoD**. It closes the *guard*
gap that had held **§ Closed-when 1** open since SPRINT-089, and deliberately does **not** tick that
condition — see below.

| Shipped | What |
|---|---|
| **The rollup checker compares agreement, not shape** | `check-night-run-rollup.sh` now FAILs a rollup whose `terminal ·` state contradicts the per-task lines beside it, requires positive corroborating evidence per state, and scopes every check to the **last** `run-complete` block. A shape-only assertion passes any well-formed lie; four passes were needed to make this one discriminate |
| **The reaper writes into the Plan it was pointed at** | `find_sprint()` refuses ambiguity (0 or >1 active sprints) instead of silently picking the first match, and a new **`--sprint FILE`** declares the target explicitly |
| **The canonical mode name actually reaps** | `night-run.sh` gated the reaper on a literal `*sprint-bulk*` substring while **`overnight`** has been canonical since SPRINT-088 — so a run fired the documented way never reaped and never wrote a `terminal ·` line, for five sprints. The gate is **deleted**, not extended: reaching it already proves a validated mode signal passed |
| **The knowledge index no longer goes stale on the clock — or on a fresh clone** | `gen-index.sh --check` no longer bakes the wall-clock date into its comparison, **and** compares line-ending agnostically. `.gitattributes` normalizes the index at source: `core.autocrlf=true` had been delivering CRLF against a pure-LF generator, so **the gate was red on every fresh clone of this repository** and no one had seen it, because every gate run had a working tree holding generator output rather than git's |
| **The launcher's green-gate precondition is where its reader meets it** | stated in `night-run.md` Part 1's checklist rather than only in `night-run.sh` — a Plan whose purpose is *repairing* a gate FAIL previously could never run at all |
| **`gate_exceptions:` — a narrow, named grant** ⚠️ *consumer-facing* | a run may fire against **specific, pre-approved failing checks**, never a blanket bypass; no `--force`/`--skip-gate` flag exists or is added. **Format:** a newline-delimited block list of **complete, verbatim `FAIL` lines** (copy each exactly from a fresh `qa-check.sh` run), plus a `gate_exceptions_pin: <sha>`. Whole-line, not a shortened name — `qa-check.sh` leg 13 prints three semantically distinct FAILs sharing an identical prefix, so a prefix grant silently pre-approved all three |
| **Pre-flight item 3 ruled STRICT against a declared `J2`** | a Plan carrying a **declared** `J2` task fails pre-flight and is not launchable unattended. `AFK-safe` and `J2` are reconciled as *the same rule read at two moments*: parking describes a J2 shape a run **meets** mid-run and could not have declared at G2; a declared J2 is excluded earlier. Both definitions survive — only the implication that one permits the other is removed. Supersedes SPRINT-090 D4 |
| **The authority leg is mode-aware** | `check-authority.sh`'s `J2` park requirement applies where the park protocol applies and nowhere else. Parking is what an *unattended* run does **instead of asking**; enforced against an attended run it demanded the artifact of an absent ask channel from a run that had one. All four anchored patterns are now fence-immune |

**Consumer note:** the one user-visible format is `gate_exceptions:` above — it is new, so nothing you
have already written changes. If you launch overnight runs by the canonical `--mode overnight`, note
that **your runs were not being reaped** before this sprint and now are; a `terminal ·` line will start
appearing in your sprint logs where none did before.

**Guards added/repaired:** three retained harnesses (rollup 34 cases · gate-exceptions 10 fixtures ·
authority extended), all wired into `qa-check.sh` (31 → 32 always-on). `QA_BUDGET_SECONDS` 450 → 520
**on loan** — this sprint added ~37 s of always-on coverage before EPIC-014's saving landed, and
SPRINT-092 T2/T4 should bring it back down (**TD-117**).

**Not ticked, deliberately: EPIC-015 § Closed-when 1.** The guard gap is closed and each half is
proven, but *"a run ends only at one of five named states"* is a claim about what a **run** does, and no
unattended run has fired since the reap gate was repaired. Carried by **`TASK-319`**.

**Found by independent review, not by the authors:** the reap-gate rename bug, the fresh-clone CRLF
failure, the canonical-name collision in `gate_exceptions`, and a composite fixture the coordinator had
already judged acceptable. Three coordinator judgements were overturned; all three are recorded in the
Execution Log rather than smoothed. Debt: **TD-124** filed, **TD-110/111/112/123** resolved. Follow-ups:
`TASK-319` · `TASK-320`. Learnings: **L-181** · **L-182** · **L-183**.

---
## SPRINT-088 — Execution Autonomy Foundation (closed 2026-08-26)

Unreleased (bundles into the next version — **feature sprint, so MINOR by hand**, not `/release-patch`).
EPIC-015's first member sprint, closed at **13 of 16 DoD** and reported as such: three criteria need a
real unattended run and are carried by `TASK-301`, not ticked. Completes **§ Closed-when 2** of eight.
The authority model the rest of the epic rests on:

| Shipped | What |
|---|---|
| **Authority classes `J0` / `J1` / `J2`** | declared per task in the sprint header meta, at G2. `J0` needs no approval (run bookkeeping) · `J1` is delegated in advance by a recorded pre-launch approval and runs unattended **inside that envelope only** · `J2` is human-reserved and **parks**. Declared, never inferred — an **absent** class reads as `J2`, the safe end. Guarded by `scripts/lib/check-authority.sh` (qa-check leg 14-bis) |
| **Continuation contract** | a run does **not** pause between tasks the owner already approved, and ends at exactly one of five named terminal states — `PLAN_EXHAUSTED` · `AUTHORITY_BOUNDARY` · `HARD_FAILURE` · `BUDGET_STOP` · `USER_STOP` — recorded in the rollup by the launcher (`night-run.md` Part 0b) |
| **`overnight` is the canonical mode name** | **user-visible.** It names the contract the mode runs, not the launching script. `night-run` · `unattended` · `sprint-bulk unattended` **all still work** — the rename is additive and no existing trigger breaks. An **unrecognised** mode string is refused, never defaulted to `overnight`. New: `night-run.sh --mode <name>`, resolved by `scripts/lib/resolve-run-mode.sh` |

**Consumer note:** nothing you have already scripted needs changing. The one behaviour that *widened*
is the launcher's mode-signal pre-flight, which previously demanded the literal word `unattended` and
now also accepts `overnight` and `night-run` — without that, adopting the new canonical name would
have been rejected by the tool while the docs said it was supported.

**Guards added** (all wired into `qa-check.sh`, five retained harnesses, 49 assertions):
`check-authority.sh` · `check-approval-envelope.sh` · `resolve-run-mode.sh` ·
`run-reap-terminal-fixtures.sh` (new coverage for the terminal-state derivation, which previously had
none) · extended `check-night-run-rollup.sh`.

**Found and fixed by an independent Tier G review**, after 39 assertions and 11 seeded breaks had all
gone green: the terminal-state derivation reported `PLAN_EXHAUSTED` over `blocked` tasks (it handled
two of six task states), and a `J2` task parked and then executed anyway was accepted as honoured.
Both are corrected; a J2 park now needs an `owner-ruling · Tn ·` line to resolve it. Debt filed:
`TD-106` · `TD-107` · `TD-108`. Learnings: `L-173` · `L-174`.

---
## v1.62.0 — Full Run and the First Family (2026-08-29)

SPRINT-091, closed at **41 of 41 DoD**. EPIC-014's fourth member sprint, completing **§ Closed-when 2**:
the TypeScript engine runs *whole*, and the first rule family evaluates at parity with Shell.

**The gate is not faster, and that is the promise kept rather than broken.** § Scope said so from the
start: the conversion that turns this capability into a faster gate is SPRINT-092's, travelling with the
measurement that proves it. Shipping a saving apart from its evidence is how an unmeasured claim gets
recorded as fact.

| Shipped | What |
|---|---|
| **A type checker, admitted and gated** | The repo stated guarantees "enforced by a TYPE" while nothing evaluated one. `tsc --noEmit` now runs as its own gate leg and FAILs on the exact case TD-101 recorded. An absent toolchain **FAILs rather than skips** — a skip is indistinguishable from a pass (ADR-037) |
| **Full Standard traversal in TypeScript** | Mark-driven dispatch, gap and hold reporting, full-run level arithmetic, at parity with the Shell engine. `--section` composes through the *same* multi-family seam the flagless run uses (ADR-038) |
| **The §4 ADR-governance family, migrated whole** | All five rules — `S4.ONEFILE` · `S4.INDEX` · `S4.SECTIONS` · `S4.NEGATIVE` · `S4.APPEND` — evaluating in TS and agreeing with Shell on nine retained fixtures. S4.APPEND reads real git history behind a port, with an in-memory fake |
| **`--spec <path>`** | **User-visible.** `leanflow` now evaluates a caller-supplied spec instead of the one shipped beside it, composing with `--section` and the flagless run. Threaded to *every* spec-consuming port, including the §12 prose reader — verified by doctoring the prose itself, not by reading the code |
| **`hold` renders distinctly, and the level reaches the CLI** | `hold` no longer prints identically to a plain note at any of the three render sites, and `leanflow <repo-dir>` prints a conformance level matching Shell's |

**Consumer note.** `--spec` is additive; every existing invocation behaves exactly as before, defaulting
to the bundled Standard. The one behaviour that *changed* for an existing invocation is that
`leanflow <repo-dir>` and `--section 4` now actually evaluate §4 rather than reporting five
`rule-unimplemented` gaps — so a repository with an ADR-governance violation will now be told about it.
That is slower: S4.APPEND spawns git per ADR, and a full run on a 38-ADR repo went 0.689s → 6.948s.
Correct behaviour billed at a real price, tracked as **TD-120** and to be paid down before §4 authority
moves off Shell.

**The sprint's own worst defect was structural, not a bug: three capabilities shipped that nothing
called.** `attachLevel` (fixed by T11), the two §4 registries (fixed by T12), and TD-103's pair before
them. Each builder was blameless — the seam sat outside every task's declared `Layers:`, so no task
owned it and no diff-scoped reviewer could see it. **`L-020` was already promoted and live in the DoD as
a "Wiring check", and the class shipped three times anyway**, because a prose DoD asking *"is it wired?"*
is answered by the one person who cannot see the seam. `TASK-318` proposes detecting it mechanically.

**Found only by independent review, never by recalling the rule:** the §4 registries composed into
nothing (which, because `gap` never moves the level counter, laundered a real `S4.INDEX` violation into
`level: Attested`); two DoD that reviewers **weakened rather than confirmed** — T12's level match being
over-determined, T7's plugin-installer framing being asserted; and a `check-layers-completeness` FAIL
caused by the tick evidence itself, three times. Every one was caught by a guard firing, a disagreeing
second number, or an outside pass.

`TD-117`–`TD-120` filed · `TASK-318` filed `origin: close-retro` · `L-170` bumped to `count: 2` after
recurring **inside this sprint's own close** — the identical worktree-contaminated `grep` returning
`L-999` against a real maximum of `L-180`.

