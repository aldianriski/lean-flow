---
owner: Maintainer
last_updated: 2026-08-29
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

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
