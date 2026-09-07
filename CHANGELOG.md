---
owner: Maintainer
last_updated: 2026-09-07
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

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

## v1.61.0 — Prove the Unattended Run (2026-08-27)

MINOR — SPRINT-089, **10 of 10 DoD**, plus SPRINT-090 (the run vehicle), **6 of 6**. Closed at
`QA-CHECK: 199 pass, 0 fail`. **The loop ran itself unattended for the first time**, and the sprint's
most valuable output is the list of things that stood in the way.

**Consumer-facing — this changes what your gate runs and what your permissions must cover.**

- **New always-on eval harness** (`evals/run-git-availability-fixtures.sh`, ~3.2s) — the always-on set
  goes **30 → 31**, zero removed. It guards the conformance engine's **git-availability branch**, which
  twelve assertions gate on and which had **no discriminating coverage in either direction**: two seeded
  breaks were run against the existing suites and *neither reddened*. If your gate time matters, this is
  where the extra three seconds went, and it is placed always-on deliberately — a guard for an always-on
  code path that itself ran only under `QA_FULL` could not catch the defect it exists for.
- **`scripts/lib/conformance-engine.sh` is faster per call** — the `git rev-parse --git-dir` probe was
  spawned once per *rule that asks* (twelve of them); it is now memoised per target, **6 spawns → 1**.
  Output is byte-identical. The wall-clock share is **not claimed**: on the measuring host it sat inside
  run-to-run variance, and one sample cannot resolve it.
- **An unattended run may now need more permissions than you have granted.** Directory-prefix rules of
  the form `Bash(sh dir/:*)` are **non-functional** (measured, and independently corroborated by prior
  research) — use exact-file or bare-command forms. On a two-shell host, `PowerShell(...)` rules are a
  separate surface from `Bash(...)`: a run silently loses the shell you did not authorize, along with
  whatever work went through it.

**The gate's budget criterion was wrong, and is now reproducible.** A default run measuring 288s against
a 450s budget reads as healthy. It was not: the same **byte-identical** code (verified with
`git hash-object` against `git rev-parse <ref>:<path>`) ran **1.92–2.20× faster** than on the host that
recorded 454s, so normalized the tree was **553–632s** — and a sibling sprint had independently observed
634s. `TD-090`'s re-raise condition is restated as **arithmetic anyone can re-run** against a pinned
calibration anchor, instead of a wall-clock figure that reports the weather (**L-175**).

**Five things stood between a promoted Plan and an executed one, and none was found by reading the
procedure** — each surfaced only by attempting the next step (**L-179**):

- **`TD-109`** — pre-flight requires every task be AFK-class, while the vehicle Plan must carry a
  declared `J2`. The machinery is built for that `J2`; the wording forbids it.
- **`TD-110`** — the launcher refuses to fire unless `qa-check.sh` exits 0, so **no Plan whose task
  repairs a gate FAIL can ever run unattended**. The precondition lives in code the checklist never
  mentions.
- **`TD-111`** — `gen-index.sh` stamps `last_updated:` into the generated index, so **the index goes
  stale at every midnight regardless of content** and reddens the gate on an untouched tree. Combined
  with `TD-110`, an overnight run can be refused by the clock alone.
- **`TD-112`** — with two active sprints the launcher's reaper wrote its rollup into the sprint the run
  did **not** execute, reporting `PLAN_EXHAUSTED` over a run that **parked** a `J2` — and
  `check-night-run-rollup.sh` **passed it**, because it asserts shape and never agreement (**L-178**;
  the same class as the previous release's `L-174`, recurring one sprint later through a different
  route).
- Plus `sprint-bulk` step 0's *"more than one active → ask which sprint"*, in a channel with no ask.

**What the run got right is worth as much as what it exposed.** It executed a `J1` with no
confirmation, parked a **seeded** `J2` with its unblock condition, consumed the ten-dimension approval
envelope without re-confirming anything — and when it met `TD-111` it **parked its own close** rather
than repairing, exactly as `repair-policy: none` required. The contract held on a case its authors had
never considered. EPIC-015 § Closed-when **3 and 4** complete; **1 deliberately left open** until a run
*reports* its ending as truthfully as it reaches it.

**Process.** An independent Tier G reviewer found a latent silent-direction defect in the engine change
that 43 green assertions missed, and a second reviewer found the author's own reasoning defect in a
governance ruling (two of three cited mechanisms overclaimed). **Of every defect this sprint, not one
was caught by recalling the rule that governed it** — all came from a guard firing, a disagreeing second
number, or an independent pass. `L-175` · `L-176` · `L-177` · `L-178` · `L-179` filed;
`TASK-303`–`TASK-306` routed.

## v1.60.0 — The First Rule Through the Engine (2026-08-26)

MINOR — SPRINT-087, **29 of 29 DoD** — closed at `QA-CHECK: 210 pass, 2 fail`, both counted failures
ruled and neither this sprint's (a known false positive, and another stream's commits). A rule now runs
end-to-end in TypeScript and is **proven equal to the Shell engine that still holds authority**.

**Consumer-facing — this changes what your gate reports.** Two checkers stopped scanning agent
worktrees under `.claude/worktrees/`, which are full repo copies created by the worktree-isolated
dispatch this project itself prescribes:
- `check-ephemeral-intake.sh` was walking them and reporting fixture files inside them as committed BUG
  reports — six live worktrees produced five false FAILs and pushed a run over its own budget.
- `check-research-archive.sh` was counting a worktree copy as a *live citer*, so a superseded research
  doc cited by nothing real reported **PASS**. That one is a silent false negative, the worse direction,
  and it was found by independent review rather than by the fix's author.
Both exclusions are anchored to path-start shape, not substring, and each retains a lookalike control
proving a genuinely resembling path is still reported. **A third site remains** — the conformance engine
still walks worktrees (`TD-100`), deliberately untouched because it is the live oracle every parity test
spawns.

**The TS engine** (internal; Shell keeps authority throughout — no cutover here): a result domain, a
switch-free registry, a repository port with a real adapter and an in-memory fake, and `--rule` /
`--section` targeting. All six of `spec/STANDARD.md` §14's marks resolve to their own outcome, driven by
a parser that reads §14 itself rather than a re-derived list. The §12 git-boundary family is migrated
whole — four rules, each with a retained must-FAIL **and** a sibling control. **A partial invocation
carries no global conformance level at all**, as a property of a frozen result rather than of the
printer. Three carry-forwards closed: `ok:false → exit 1` at the process boundary, permission-denied
distinguished from `spec-not-found`, and `--reconcile` carrying every mismatch rather than the first.

**Filed, not fixed:** ten `TD-` rows and four learnings, including three capabilities shipped with no
consumer (`TD-103`) — which no per-task DoD could see, because the gap was *between* tasks (`L-172`).

---
## v1.59.0 — Guards That Cannot Fire (2026-08-25)

MINOR — SPRINT-086, **17 of 18 DoD** — closed at `QA-CHECK: 183 pass, 0 fail`. Three shipped guards
were correct, fixture-proven, and could not fire on the traffic they were built for. Each now reaches
its own subject. **Consumer-facing, and one of these will change what your gate reports.**

**The review-depth gate got stricter, and consumer repos will feel it.** A task recording
`governance:high` or `behaviour:material` work with **no review line at all** used to pass as
`no review line -- nothing to verify`, exit 0. It now FAILs with a named finding. The carrier is a new
whole-line field in the sprint-log schema — `consequence · Tn · behaviour:… · governance:…` — written
when the review skip table is consulted, **independent of whether a review then happens**. That
independence is the whole fix: the old `review ·` line only existed *after* a review, so work whose
review never happened was structurally invisible. Documented in `sprint-log.md.template`,
`orchestrator/SKILL.md` § Review, and `review-scoping.md`. The detector normalises whitespace and field
case before matching, so hand-transcription drift is caught rather than silently ignored — while
staying whole-line anchored, so prose *about* the schema still does not match.

**The QA budget default drops 900s → 450s**, with the arithmetic stated beside it (`600s ceiling −
150s headroom`). The old default could only trip after fifteen minutes in an environment where nothing
survives ten — a guard that could not fire, shipped to prevent exactly the failure it then failed to
prevent. It is now checked at **22 points across legs 2–12** rather than only inside leg 12, and a new
`check-qa-budget-default.sh` runs as a gate leg so the value cannot drift back above the ceiling. It
**fired on live traffic during this sprint**: a 461s run named its three skipped harnesses instead of
dying past an external timeout with no verdict line.

**The gate now completes under load.** It printed a verdict on a process table carrying six live
worktrees, seven agent dispatches and four prior full runs — where three attempts under comparable
load in the previous sprint died at 204 / 117 / 100 lines without ever printing one. Leg 12's dominant
harness adopted the spec-reduction pattern its own siblings already used (196.1s → 143.2s), with the
check inventory verified identical before and after: **50 fixture names, zero removed**.

**Also:** a measurement dispute settled — Round 4's implied ≤4s for two §11 rules was an *arithmetic
residual* for ~35 unnamed rules, not a measurement, reproduced a third time by an independent
mechanism; and leg 12 and the conformance-engine sweep proved **disjoint by target and by profile**,
so two figures that appeared to contradict each other never described the same run. Three `severity:
high` debt rows closed (TD-085 · TD-091 · TD-092); TD-090 remains open and `high` — the gate now sits ~1% under its own budget, so a sprint's own close output can still trip it.

## v1.58.0 — Standard Parser and Shell Parity (2026-08-25)

MINOR — SPRINT-085, **26 of 26 DoD** — closed at `QA-CHECK: 183 pass, 0 fail`. EPIC-014's **first
§ Closed-when condition, closed whole**. **Consumer-facing: one gate got stricter.**
`check-review-depth.sh` now FAILs with a named finding when a task records `governance:high` or
`behaviour:material` and carries **no** review line at all — previously that passed as
`no review line -- nothing to verify`, exit 0. A consumer repo that closed clean may now see a named
FAIL; that is the fix working. The TS engine below is **not** consumer-reachable — it has no CLI until
H11 and `package.json` still declares zero dependencies, so the no-toolchain install guarantee holds.

**The Standard is read by a parser now, not by a regex.** A hand-written block tokenizer (headings,
pipe tables, fenced code, paragraphs — each with a source location, zero imports, because ADR-035
leaves no Markdown library to reach for) feeds a reader that finds rules by asking *which table sits
inside which `## §N` window*. It emits all **100** rows in document order and agrees with
`scripts/lib/read-spec-rules.sh` **row-by-row, never in aggregate** — the assertion names the offending
row, and was demonstrated by perturbing one mark until exactly one test reddened. The discriminator
that proves a structural parse beat a substring match: `S13.NOINFER` appears **twice** in the Standard
and is admitted **once**. Given a denominator rather than a bare zero (L-156): **148** rule-id-shaped
tokens exist in the document, 100 admitted, 48 prose and duplicate mentions filtered.

**Absence and emptiness are now different answers, enforced by a type.** `SpecReadFail` carries no
`rows` field *at all*, so a caller cannot confuse "checked nothing and found a finding" with "checked
and found zero". An unreadable table is a named finding with a non-zero exit; §8 — which genuinely has
no rules — exits **0 silently**, because §14 publishes 0 for it. `--reconcile` reproduces the
per-section count table and the mismatch FAIL, which is the only thing that tells a silently-dropped
section apart from a legitimately empty one. Parity is held against the **9 retained fixtures the Shell
reader already answers to**, with the Shell reader spawned as a live oracle inside the TS tests rather
than its output frozen as a literal — so parity cannot rot silently.

**A guard was fixed, and then shown not to reach the case that motivated it.** `check-review-depth.sh`'s
absence branch is real — two named findings, two retained must-FAIL fixtures, and a seeded break that
reddens exactly those cases while seven siblings stay green. Pointed at the log that motivated it, it
still passes: the detector anchors on the *unattended* rollup contract, and every sprint here is
attended. Accepted for the branch it proves and the gap filed (TD-092 · L-166) rather than papered
over. Also: the conformance engine profiled per rule family (§ Round 5 — 281.2s, 89% in four families),
and `qa-gate-timing.md`'s recommendation **amended, not superseded**, with its coverage-reduction
ruling explicitly left standing.
