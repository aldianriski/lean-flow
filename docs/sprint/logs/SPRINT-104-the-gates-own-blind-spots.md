---
sprint: 104
slug: the-gates-own-blind-spots
owner: Maintainer
last_updated: 2026-09-22
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-104 — Execution Log

> Append-only companion to [`../SPRINT-104-the-gates-own-blind-spots.md`](../SPRINT-104-the-gates-own-blind-spots.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-22 | progress | T1 — preflight, G1/G2 signed, blast radius re-derived at 2 (A1 holds)

Run opened as attended `sprint-bulk`. Owner ruled the wave **T1 → T2 → T3 sequential, T4 parked**,
against a host at 0.41 GB available / 35.3 of 38.8 GB commit charge — roughly 7x below A3's ~3 GB
target, so T4's measurement would have measured swap (SPRINT-103's own pre-locked ruling, not a new one).

Pre-dispatch preflight: cycle clean · ownership per D2 · base-ref clean. One preflight scare cleared
by derivation rather than assumption: SPRINT-104's `plan_commit..HEAD` holds **21 commits, 18 of them
SPRINT-105's**, because 105 was promoted and closed on top of an already-promoted 104. `commit_sprint()`
scopes them out by subject ownership and leg 15 prints
`PASS ... layers observed ... base 5216c69`. No action needed — recorded so the next reader does not
re-discover it.

**A1 confirmed, no `scope-change`.** Probe config over `scripts/**` + `evals/**` re-derived the blast
radius as **2 errors, both `TS18047` in `scripts/qa-verdict.ts` (147,5 · 151,5)** — identical to the
figure frozen at promote. Cross-checked by two selection rules that must agree: tsc's own program
enumeration (`--listFiles`) and a filesystem walk (`find`), **26 == 26, identical sets**. The first
attempt returned 28 and was wrong: `--listFiles` prints diagnostics to stdout too, and a path-grep
counted the two error lines as files (L-108, caught by the disagreeing second number).

consequence · T1 · behaviour:material · governance:high

### 2026-09-22 | progress | T1 — TD-169 closed: the typecheck leg's program now holds both trees

Root `tsconfig.json` `include` extended with `scripts/**/*.ts` + `evals/**/*.ts`. **No `qa-check.sh`
edit was required** — the leg runs a bare `tsc --noEmit` against the root config, so extending the
config moved the population without touching the leg (see the open DoD-7 question below).

The two `TS18047` sites fixed with optional chaining. Checked rather than assumed that this is not
fail-open: `judgeOutput("")` returns `ok: false` ("a verdict-less run is reported as a failure, never
inferred as 0 fail" — TD-143), so an absent stream cannot become a green gate. Reasoning recorded at
the code, not only here.

Evidence (DoD 2): the leg's own program contains `scripts/lib/check-layers-observed.ts` = 1 and
`evals/qa-verdict.test.ts` = 1; 26 files from the two new trees alongside 106 from `apps`/`packages`/`test`.
Evidence (DoD 3): the leg's **own printed line** — `PASS  typecheck: tsc --noEmit clean (0 errors)`.
That line was printed before this change too; what makes it *true* now is DoD 2's population proof,
which is the entire point of TD-169.

### 2026-09-22 | progress | T1 — Tier G seeded-break proof, `scripts/lib` arm PASSED

Hash convention for this sprint, stated once and used throughout (L-169): **`git hash-object <path>`
compared against `git rev-parse HEAD:<path>`** — both LF-normalized blob ids, reproducible on a CRLF
checkout. Verified to match on all four seed/control files before being relied on. A raw `sha256sum`
of the working file does **not** match the blob here; that is the trap, and it is why the method is
stated rather than assumed.

Seed A — `scripts/lib/check-prose-density.ts`, control `scripts/lib/check-authority.ts`:
- landed: `f6e0bbc5…` → `2a63c699…`
- targeted: +1 line, non-empty, a genuine `TS2322` **type** error (not a syntax demolition)
- leg reddened, its own printed line naming the seeded file:
  `FAIL  typecheck: tsc --noEmit exited 1 with 1 error(s) -- first: scripts/lib/check-prose-density.ts(262,7): error TS2322`
- sibling control named **0** times — stayed green
- restored to `f6e0bbc5…`, byte-identical to HEAD under the stated convention

### 2026-09-22 | surprise | the gate is not deterministic on this host, and its budget margin is ~5%

Two observations from the seed-A run, neither caused by the seed, both outliving T1:

**(a) A fixture failed with an empty capture.** `run-qa-budget-fixtures.sh` fixture
`over-ceiling-run-prints-info-and-fail-stays-0` reported `FAIL ... got:` with an **empty** got-value
during the gate run, then **passed standalone** on the restored tree (`RESULT pass=0 fail=0`). Not
attributable to the seed. An empty capture on a host at 0.41 GB free points at resource pressure, but
that is a hypothesis and was not verified. It matters beyond this task: this is L-142's "red for the
wrong reason", and the same empty capture landing on a **must-FAIL** fixture would be green for the
wrong reason — silent by construction, which is the Tier G failure mode.

**(b) The budget has ~5% headroom.** The seed-A run took **547s against the 520s `QA_BUDGET_SECONDS`
default** and did not truncate — 27s of margin, on a gate SPRINT-093 sized at ~469s. T4 owns
re-deriving this figure and T4 is parked, so absent a ruling the sprint closes with the gate sitting
just under its truncation threshold and nobody having re-measured it.

### 2026-09-22 | blocker | T1 — Tier G `evals` arm incomplete: gate run killed for low memory

Seed B — `evals/qa-verdict.test.ts`, control `evals/authority.test.ts` — landed and verified targeted
(`0b89e9df…` → `b89adbf3…`, +1 line, `TS2322` at 257,7, control named 0 times). The confirming gate
run was **killed by the harness for critical low memory** before the typecheck leg printed its line.

**The seed was restored immediately** — `evals/qa-verdict.test.ts` back to `0b89e9df…`, byte-identical
to HEAD under the stated convention, and `grep -rn "__seed_type_error"` over `scripts evals apps
packages test` returns nothing. This is L-137's exact recorded failure (a timeout leaving a seeded
break in a shipped file) and it did not happen here only because restoration was treated as the first
action on the kill, not a later cleanup step.

**T1 halts here, at DoD 4, un-ticked.** The `scripts/lib` arm is proven; the `evals` arm is not. What
remains unproven is specifically the *population* half (L-186): that the leg reddens for the second
tree, not merely the first. DoD 2 shows an `evals/*.ts` file is in the program and the standalone
`tsc` invocation the leg runs reports the seeded error — but the leg's own printed FAIL line for the
`evals` arm has not been observed, and inferring it from the `scripts/lib` arm is the substitution
this sprint exists to stop.

Not restarted: the harness advises memory may still be short, and re-running is the owner's call.

### 2026-09-22 | scope-change | T1 DoD 7 ruled **n/a** — its premise dissolved, the work was not skipped

**What broke.** DoD 7 reads *"Edit to `scripts/qa-check.sh` committed as a reviewable diff before
being applied (D2 · L-151)"*. It presupposes that putting `scripts/` and `evals/` inside the
typecheck requires editing the leg. It does not: the leg runs a bare `tsc --noEmit`, which resolves
the **root** `tsconfig.json`, so extending that file's `include` moved the population with zero
changes to `qa-check.sh`. The criterion went stale against execution, not against scope — the Plan's
own § Scope and Acceptance are untouched and fully met.

**Impact.** One DoD is unsatisfiable as literally written. The two ways to make it *look* satisfied
were both rejected: manufacturing a `qa-check.sh` edit (adds a second config surface to drift, purely
to dress a criterion) and silently re-reading the words to fit what was built — which is the failure
L-088 names, and this sprint's § Red flags calls out by name.

**Ruling (owner, 2026-09-22): tick `[~]` n/a with the reason recorded.** D2 itself is untouched and
still binds — T2 and T3 both genuinely edit `scripts/qa-check.sh` and both go through diff-then-apply
in merge order.

**Re-confirm G2.** No design change. T1's `Layers:` named `scripts/qa-check.sh` as a prediction;
implementation did not need it, which is L-100's expected case (a `Layers:` is a live declaration,
not a frozen prediction to defend) and is why leg 15 still passes on the narrower file set.

### 2026-09-22 | park | T4 parked at wave open — host memory, pre-locked ruling

T4 parks with its unblock condition intact: **host free memory above ~3 GB**. Measured at wave open:
0.41 GB available, 35.3 of 38.8 GB commit charge. A3's confirm path and SPRINT-103's own ruling both
say measure nothing under paging — a total taken there measures swap. Nine DoD carry forward.

Note for whoever resumes: T4's subject got sharper during T1. The gate measured **547s against the
520s `QA_BUDGET_SECONDS` default** on this host — 27s of margin, ~5%, without truncating. That is a
live figure for T4's Round and a reason not to let the parked task drift.

### 2026-09-22 | progress | T1 DoD 5 — retained population fixture, discrimination proven

`evals/typecheck-population.test.ts` + `evals/fixtures/typecheck-population/tsconfig.narrow.json`.

**What it guards, and why it is not the typecheck leg again.** The leg asserts a property of the
*verdict* (`tsc` reported no errors) and was hardened twice so a missing checker could not read as a
pass (ADR-037 · TD-101). Neither is a property of the *set the verdict ranges over*. This fixture
asserts the set: named members from both trees are in the program, both arms separately, with the
original three trees as a control. L-186's axis — the cases vary the **selection rule** (the tsconfig
handed to tsc), never the verdict.

**Cheap by construction.** `--listFilesOnly` enumerates the program without typechecking it (~1s vs
~6s). The whole file runs in **2.0s**, which is what made the discrimination proof affordable to
actually run rather than argue about.

**Placement is a cost ruling, not an accident.** It runs in the `bun test` phase, deliberately NOT in
qa-check.sh leg 12: the gate measured 547s against a 520s budget on this host, and an always-on
harness shelling to tsc twice would spend that margin. Recorded in the file's own header so the next
maintainer sees the ruling, not just the placement (L-151).

**Wiring derived, not assumed (L-020).** A bare `bun test -t "gate typecheck population"` — no path
argument — ran the 7 cases across 48 discovered files, so `package.json`'s `test` script
(`gate && bun test`) reaches it end-to-end. The `evals/run-*` registration guard at qa-check.sh:1333
globs `run-*.sh|ts` and `selftest-*.sh` only, so a `*.test.ts` neither needs registration nor trips it.

**Discrimination proof (L-142), run rather than asserted.** Seed: root `tsconfig.json` reverted to its
pre-fix include. The seed is **byte-identical to the real pre-fix artifact** — `45082de0…` →
`5ad9f2b8…`, and `5ad9f2b8` is the exact blob T1's own commit replaced (visible as `index 5ad9f2b..45082de`
in that diff). That is stronger than a synthetic one-line break and is L-166's bar: the guard is
pointed at the artifact the debt row cites, not merely at a shape. Note the line-count rule is
deliberately not applied here — "within one line of pristine" exists to stop a demolition standing in
for a discrimination, and a verbatim historical config is the opposite of a demolition.

Result under the seed: **3 fail, 4 pass**. The three reddened are exactly the three LIVE population
assertions; the four green are the sibling controls — the original-three-trees control and all three
must-FAIL cases, which read the fixture config and are correctly unaffected. Restored to `45082de0…`,
byte-identical to HEAD under the stated convention.

### 2026-09-22 | surprise | the gate's TEST population is blind the same way its TYPECHECK population was

Found by running `bun test` — which no gate leg does — while chasing an unexplained failure.

**Finding 1: lean-flow's own gate-discovery guard has reported that this repository bypasses its
declared gate, continuously, since SPRINT-097 T4.** `test/gate-discovery/discovery-order.test.ts`'s
case *"the rung-1 command still runs the gate `.gate-command` declares"* asserts `bypassed === false`
and gets `true`. Deterministic, reproduced standalone in 7.7ms.

Cause, traced rather than guessed. `invokes()` splits the discovered command on `&& || ; |` and
requires a segment to EQUAL the declared command or start with it plus a space:
- before `3404422` (SPRINT-097 T4): `sh scripts/qa-check.sh && bun test` → segment 1 is exactly the
  declared command → PASS
- after: `bun scripts/qa-verdict.ts sh scripts/qa-check.sh && bun test` → the gate became an
  ARGUMENT to the verdict wrapper, so no segment equals or starts with it → `invokes()` false →
  `bypassed: true` → FAIL

T4's change was correct on its own terms (it made a verdict-less run fail loudly, TD-143). It simply
re-shaped the very string another guard pattern-matches, and nothing connected the two. This is
L-166 exactly — a guard keyed to a shape the system no longer emits — and L-020's shipping-≠-wiring
at the seam between two sprints. It fails RED, not green, so it is not silent; it is merely unread,
because the only phase that runs it is one no sprint invokes.

Not fixed here: out of T1's scope and out of this sprint's § Scope (D6 — same checks, same coverage).
Recorded for the close Retro as a `TD-NNN` candidate. Id deliberately NOT assigned now: the maximum
must be derived at filing with `.claude/worktrees/` excluded (L-143 · L-170).

**Finding 2, and it corrects this task's own DoD 5 claim.** `qa-check.sh` reaches a `.test.ts` file
only through an explicit wrapper harness registered in `eval_harnesses_always` — there are nine such
wrappers, each a thin `bun test <one file>`. The registration guard at qa-check.sh:1333 globs
`evals/run-*.sh|ts` and `selftest-*.sh` only, so a bare `*.test.ts` is neither required to register
nor reported when it does not.

`evals/typecheck-population.test.ts` has no wrapper. It therefore runs in `bun test` and **not** in
`sh scripts/qa-check.sh`, which is what `promote` and `close` run (`QA_FULL=1`). The wiring claim in
the DoD-5 entry above was derived against `bun test` discovery and is true of that path only; it does
not establish that the guard fires where this repo actually verifies. A retained guard nothing runs
is L-105's absent guard wearing the shape of a present one, so the earlier entry overstated it.

The cost reasoning in that entry was also wrong in magnitude: the whole file runs in **2.0s**, which
is 0.4% of the 520s budget, not a threat to it. The placement argument it recorded does not survive
its own measurement.

Wiring it requires adding a wrapper and registering it in `scripts/qa-check.sh` — which would make
T1's DoD 7 (`the qa-check.sh edit goes through D2's diff-then-apply`) applicable again, reversing the
`[~] n/a` ruling taken earlier today. That is an owner call, not a silent correction, and is where
T1 stands.

### 2026-09-23 | progress | T1 DoD 5 wiring corrected, DoD 7 un-ruled and genuinely satisfied

Owner ruled: wire the fixture into the gate, reversing the `[~] n/a` on DoD 7.

`evals/run-typecheck-population-fixtures.ts` added and registered in `eval_harnesses_always`.
Thin by design — it spawns the `.test.ts` rather than restating its assertions, so the two cannot
drift — and it carries a **test-COUNT floor** (>= 7), because `bun test` exits 0 on a file with zero
live tests and an exit-code-only wrapper would report PASS over a suite whose cases had been deleted.
That is the same reasoning `run-authority-fixtures.sh` records for its own floor (L-058).

Findings emitted at the **two-space** column, not one: a one-space `FAIL ` is invisible to a
column-keyed selector and has already left `sweep_gate` returning rc=0 on a crashed engine (TD-157 —
this sprint's own T2).

**Both failure branches proven to fire, not just the happy path.**
- *red suite*: seeded the pre-fix tsconfig (hash `5ad9f2b8…`, byte-identical to the real pre-fix
  blob) → `FAIL  typecheck-population: the population fixture suite is red (bun test exit 1)`, harness
  exit 1. Restored, verified.
- *count floor*: seeded `MIN_CASES = 7` → `99` (delta 0 lines — a targeted value change, not a
  demolition) → `FAIL  typecheck-population: only 7 case(s) ran, floor is 99`, harness exit 1.
- *control*: with both restored, harness green again.

**A near-miss worth the ink.** The count-floor seed was restored with `git checkout --`, which failed
silently-ish (`pathspec ... did not match any file(s)`) because the harness was still **untracked** —
so the seeded `MIN_CASES = 99` stayed live through what looked like a restore. It was caught by the
**sibling control run placed after the restore**, which came back `0 pass, 1 fail` instead of green.
The rule this generalises to: the restore mechanism must be chosen for the file's *tracked state*
(`git checkout --` for tracked, a pristine `cp` for untracked — the latter works for both), and a
control run belongs **after** restoration, not only after seeding. Recording the pristine hash before
seeding is what made the failure legible (L-137 · L-142).

**Placement.** Inserted 3rd in a list that is ordered cheapest-first and load-bearing (SPRINT-105 T3):
measured **2.0s** standalone. Exact position within the cheap cluster is approximate — the per-harness
costs it would be ranked against are a 2026-09-21 snapshot and SPRINT-104 T4 owns the re-measure
(L-130). Placing it early is right for 2.0s regardless of its exact neighbours.

**Wiring derived from the file, not asserted (L-020).** Leg 12 dispatches `*.ts` through `bun "$hp"`,
and the harness is entry 3 of the 39 in `eval_harnesses_always`. What is NOT yet observed is the
gate printing its PASS line in a real run — that needs a full gate run, which this host has failed to
complete twice. The claim here is membership-plus-dispatch, and it is stated at that strength.

**Commit shape.** D2 asks for a reviewable diff before application; its mechanism (worktree branch →
coordinator merge) presupposes the parallel dispatch the owner's memory ruling removed. In a single
tree, harness and registration land in ONE commit on purpose: splitting them would leave a
transiently-red commit, because an unregistered `evals/run-*.ts` fails the registration guard at
qa-check.sh:1333. The `qa-check.sh` change is a single line and was displayed for review before
landing. Stated rather than silently reinterpreted.

### 2026-09-23 | progress | T2 DoD 1 — site set re-derived, 28/16, A2 discharged

**Result: 28 sites across 16 files.** TD-157's `27 sites / 15 files` was correct when taken and is
now one short: the delta is exactly `scripts/lib/check-epic-archive.ts`, a checker ported since, with
one site. 28 − 1 = 27, 16 − 1 = 15. A2 is discharged, not inherited.

**Two selection rules that genuinely disagree in shape (L-198), not an inverse of one rule.**
- **Route A′ — by COLUMN.** Emission whose string starts `FAIL` + exactly one space, across every
  emission construct (`echo`/`printf`/`console.log`/`out.push`/`return`). → **28 sites / 16 files**.
- **Route C — by POSITION.** Every `FAIL` emission located *before* the file defines its two-space
  helper (or in a file that defines none), regardless of spacing. → **71 sites / 27 files**.
- Reconciliation: **A′ ⊆ C with zero exceptions** (no one-space site sits after a helper), and
  **C ∩ one-space = 28, an identical set to A′**. Two different axes, same population.
- **Route B — by OBSERVATION** (third signal, not the cross-check): ran every checker with no args
  and with a nonexistent path, selecting one-space `FAIL` lines from real stdout. → 8 lines / 7 files.
  Deliberately a *lower bound* — it reaches only the bootstrap paths those two invocations trigger —
  and it is reported as reachability evidence, never as a competing census. 8 of the 28 are proven live.

**Two wrong selectors were caught on the way, both by disagreement rather than by inspection.**
*(a)* The first Route A returned **580 hits / 86 files** because it matched the token `FAIL` anywhere,
including prose *about* FAIL in comments (`// Prints one PASS/FAIL/note line`). L-108 — the corpus is
self-describing. *(b)* The first refinement matched only `echo|printf|console.log`, so the `.ts`
checkers' `out.push(\`FAIL …\`)` and `return \`FAIL …\`` shapes could never enter the examined set —
L-186's exact failure. Widening to all constructs left the count at 28, which is itself the finding:
the ported `.ts` checkers already emit at the correct column.

**Population definition corrected mid-derivation, and this is the substantive result.** An unscoped
sweep returns **414 sites / 66 files**, dominated by `evals/run-*` fixture harnesses. Those are NOT at
risk: leg 12 selects harness output with `grep -E '^FAIL'` — **not column-keyed** — so a one-space line
there is fully visible. The risk lives only where a *column-keyed* parser reads. That parser is
`sweep_findings()`, which uses two selectors of different tolerance:
- `_sweep_engine_error` → `grep '^FAIL [ ]*conformance: '` — tolerant, already hardened
- `_fail_findings` → `grep '^FAIL  '` — **two-space keyed**

A one-space line not named `conformance:` is invisible to both, so `_sweep_total` and `_sweep_reached`
miss it *equally*, stay equal, and the gate passes clean. That is the silent false-negative TD-157
describes, and it is why `conformance-engine.sh`'s own site is already covered while the other 27 are not.

**Per-kind classification (DoD 3's groundwork; the "left alone" set is real):**
- **22 BOOTSTRAP** — repo root absent, shared archive predicate absent, required arg missing, harness
  doc/snippet unextractable. Genuine pre-flight failures; these are the rewrite candidates.
- **2 FINDINGS, not bootstrap** — `check-qa-budget-default.sh:29` (`no QA_BUDGET_SECONDS default
  assignment found`) and `:34` (`exceeds-ceiling`). These are verdicts about the target emitted at
  one space. They are the most dangerous two in the set and they are *not* a `fatal()` candidate,
  because routing a finding through a bootstrap emitter would misclassify it.
- **4 FIXTURE REPORTS** — `harness-common.sh:54/61/76/84`, `FAIL fixture(<label>): exit N, expected M`.
  This is the harnesses' own report format, consumed by leg 12's non-column-keyed grep and matched
  by the `selftest-assert-*` files. Changing their column risks breaking the selftests that assert
  on the exact string, for no gain against a selector that never keyed on the column.

Owner ruling on the shape (J2) outstanding; the counts above are what it should be taken against.

### 2026-09-23 | progress | T2 — hybrid shape applied: 5 via fatal(), 15 columned inline, 8 left alone

Owner ruling (2026-09-23), taken after the first ruling's premise did not survive derivation: a shared
`fatal()` where it is reachable, a correctly-columned inline `printf` where it is not.

**Why the first ruling could not be executed as written.** The owner first ruled one shared `fatal()`
that every bootstrap check calls. Derivation then showed **21 of 22 bootstrap sites have nothing
sourced yet** — only `check-research-archive.sh:44` sits after a `.` source — and 8 of them are the
guards *around sourcing the very file* that would define the function. You cannot source an emitter to
report that sourcing failed. Surfaced as a premise change rather than silently built differently.

**Disposition of all 28 sites (DoD 3, discharged per site):**
- **5 → shared `fatal()`** in `evals/lib/harness-common.sh`. This is the one place the ruled shape
  genuinely works: the file is sourced by **30 harnesses** before any of them does setup, and its own
  5 sites sit inside functions, so a helper defined at the top is in scope for all of them.
- **15 → inline `printf 'FAIL  %s\n'`** across 14 checkers. 15 of those files carry exactly ONE
  bootstrap site, so a per-file helper would add a definition to save nothing.
- **8 → named and LEFT ALONE**, which is the half of DoD 3 that does real work:
  - **4 in `scripts/lib/check-qa-budget-default.sh`** (2 bootstrap + 2 findings). This file is an
    INNER checker whose column nothing reads: `qa-check.sh:101` takes the verdict from the **exit
    code** and re-wraps the message through its own `ok()`/`bad()` using a sed that strips **exactly
    one space**. Widening the column here would deliver every message with a stray leading space —
    `FAIL` + three. Its sibling consumers at qa-check.sh:1398/1435/1468/1521/1564 use `s/^FAIL +//`
    and are tolerant; this one is not, and `run-qa-budget-default-fixtures.sh:47,59` anchor on the
    one-space prefix too. **Initially rewritten, then reverted** once the consumer was read.
  - **4 fixture-report sites in `harness-common.sh`** (`FAIL fixture(<label>): …`). Leg 12 selects
    harness output with `grep -E '^FAIL'` — not column-keyed — so there is no gain, and the
    `selftest-assert-*` files match the exact string.

**The ruling is recorded at the code, not only here (L-151, DoD 2):** the `fatal()` header states why
the shared emitter lives in `harness-common.sh` and cannot serve `scripts/lib/`; a 15-line header in
`check-qa-budget-default.sh` states why its one-space column is deliberate and must not be widened,
naming the exact consumer and sed. That second note is the one that matters — without it the next
maintainer "fixes" those four lines and breaks the wrapper. Confirmed comment-only: the non-comment
added-line count for that file is **0**.

**Consumer check (L-015, DoD 4), measured on the adopter path rather than reasoned.**
`conformance-engine.sh` is one of the 15 and ships to adopters through root `conformance.sh`. Hid
`archive-path.sh`, ran `sh conformance.sh .`:
- adopter sees `FAIL  conformance: shared archive predicate not found at <path>` (was one space)
- **exit code 2, unchanged**
- `sweep_findings`' `_sweep_engine_error` selector is `'^FAIL [ ]*conformance: '` and matches BOTH
  forms, so no reader changes behaviour
- `archive-path.sh` restored and hash-verified

In one line: **an adopter observes one extra space in one bootstrap message, the same exit code, and
no change in any selector's verdict.**

**Three self-inflicted corruptions, all from the same cause, all caught.** Writing these edits through
a shell heredoc into a node script consistently ate one backslash, so `\n` reached JavaScript as a
real newline: twice it wrote a literal line break into a `printf` format string (splitting lines and
changing file line counts), and once it broke a shell comment into a non-comment line. **`sh -n`
accepted the first two** — L-142's exact warning that a syntax check is not a correctness check. Fixed
by building the escape as `String.fromCharCode(92) + "n"` and by adding two refusals to the patch
script: reject any replacement containing a real newline, and reject any file whose line count
changes. Verified after: line counts identical to HEAD for all 14 checkers, all files parse, `tsc`
clean, and three checkers were RUN to confirm they emit at the two-space column.

### 2026-09-23 | progress | T2 DoD 5+6 — retained emitter-column fixture, all three arms discriminated

`evals/run-emitter-column-fixtures.ts`, registered 4th in `eval_harnesses_always`. Measured **1816ms**.

**Population, not just branches (DoD 6 · L-186 · L-207).** T2's rewrite has three distinct emitter
arms and a suite drawn from one proves nothing about the others, so each case is reachable ONLY
through its own arm:
- arm 1 — inline `printf` in a POSIX sh checker (two files, because one file passing does not speak
  for fourteen)
- arm 2 — template literal in a **TypeScript** checker: different language, different emit construct,
  different runner
- arm 3 — the shared `fatal()`, reached through a **sourced function** rather than a script invocation

The cheap tell this guards against is a suite where every case is "a .sh checker invoked with a bad
path". None of arms 2 or 3 is reachable that way.

**The must-NOT-catch control is load-bearing and fails in both directions.** A suite that simply
required two spaces everywhere would pass while silently endorsing a change that breaks
`check-qa-budget-default.sh`'s wrapper. Its case asserts the line is **still one-space**.

**Seeded-break proof (DoD 5), run per arm. Hash convention, stated once: `git hash-object <path>`
against `git rev-parse HEAD:<path>` — both LF-normalized blob ids, reproducible on this CRLF checkout.**

| seed | line delta | reddened | siblings green | restored |
|---|---|---|---|---|
| arm 1 `check-count-claims.sh` two-space → one | 0 | `sh-checker-repo-root` only | 4 | hash OK |
| arm 2 `check-epic-archive.ts` two-space → one | 0 | `ts-checker-repo-root` only | 4 | hash OK |
| arm 3 `harness-common.sh` `fatal()` two → one | 0 | `shared-fatal-missing-doc` only | 4 | hash OK |
| control: WIDEN the excluded file one → two | 0 | `MUST-NOT-CATCH-…` only | 4 | hash OK |

Every seed reddened **exactly one** case and left four green — targeted discrimination, not a
demolition (zero line delta in all four). The fourth seed is the one that matters most: it proves the
control can fail, and a control that cannot fail is not a control.

Wiring derived from the file, not asserted (L-020): entry 4 of the 40 in `eval_harnesses_always`, and
leg 12 dispatches `*.ts` through `bun "$hp"`.

T2 stands at 7 of 8 DoD. Only the worktree-isolated outside reviewer remains, blocked on host memory.

### 2026-09-23 | progress | T3 — 94 cost/rank comments examined, 4 corrected, comment-only

**Counts, both stated as the DoD requires: 94 examined, 4 corrected, 0 deleted.**

**Two routes that disagree in kind (DoD 1 · L-198).** A stale figure can be a duration, a rank, a
count or a superlative, and only the last is greppable as a word — so one selector cannot reach them:
- **numeric** — comment lines carrying a duration or a count-with-unit → **81 hits / 12 files**
- **lexical** — comment lines carrying a rank or superlative claim → **18 hits / 10 files**
- overlap **5**; numeric-only **76**, lexical-only **13**; union **94**. Each route reaches a set the
  other cannot: the lexical route alone finds 13 claims with no number in them, and the numeric route
  finds 76 with no superlative. That is the disagreement the rule asks for, not an inverse partition.

**Reconciled against Round 16 (the first per-leg profile over a COMPLETED run, 2026-09-20) and
Rounds 19/21 (SPRINT-103's before/after).** Round 16's ranking: `run-sprint-family-fixtures.sh` 305 s
(25%) · `run-layers-observed-fixtures.sh` 153 s · leg 2f-ter 139 s · `run-conformance-engine-fixtures.sh`
98 s · `run-qa-budget-position-fixtures.sh` 66 s; top five **761 s, 63%**.

**The 4 corrected, each given an expiry rather than deleted (the mechanism they describe is still true;
only the numbers and ranks went stale):**
1. `qa-check.sh:426` — leg 2f-ter "176.6s" (SPRINT-084). Round 16 puts it at **139 s, rank 3**.
2. `qa-check.sh:672` — "271.5s … the single largest leg in the whole gate" (SPRINT-084). Round 16 does
   not place this leg in the **top ten at all** (entry 10 is 30 s), and the largest item is
   `sprint-family` at 305 s. Both the figure and the superlative are refuted.
3. `conformance-engine.sh:8` — "single largest cost centre — 542 s, 71% of Round 16's top five". The
   arithmetic is right *for Round 16* (305+139+98 = 542, /761 = 71%), but its largest component is
   `sprint-family`, which **SPRINT-103 T1 then cut 341.0 → 149.8 s median** (Round 19, non-overlapping
   ranges). The share overstates the engine as it stands, so it now expires at the next total.
4. `check-layers-completeness.ts:6` — "the slowest harness in the gate". **Refuted by Round 16, which
   names this exact mistake as its own costliest finding**: TASK-355's targets came from TD-090's
   harness timings, which nominated `layers-completeness`; the real top three were `sprint-family`,
   `layers-observed` and the conformance sweep, and none was on that list. The ~55-70 s cost is real
   and still justifies the port — **the RANK was never measured.** Reworded to drop the superlative.

The sprint's § Theme said two instances had been "corrected by accident in SPRINT-103". One had
(`qa-check.sh:1218`, which carries an `UPDATED SPRINT-103 T1` expiry). **The other had not** —
`check-layers-completeness.ts:6` was still asserting the superlative, which is item 4 above. Two found
by accident said nothing about how many exist, exactly as the Theme predicted.

**Not corrected, and why:** `qa-check.sh:1022` ("leg 12 is the gate's dominant cost") is confirmed by
Round 16, whose top ten is almost entirely leg-12 harnesses. The per-harness table at
`qa-check.sh:1163-1167` is dated 2026-09-21, already carries a re-measure caveat naming SPRINT-104 T4,
and is current. The remaining lexical hits ("dominant term", "dominant convention", "majority of the
machinery") are claims about algorithms and conventions, not about gate cost, and are out of scope.

**Comment-only confirmed line-level (DoD 3):** comments stripped from both pristine and current, the
remaining lines compared — **identical in all three files**. Shell parses, `tsc` clean, and T2's
emitter-column fixture still 5 pass / 0 fail.

**Tier P (DoD 4), declared not inferred:** G1 plus a read-through. No discrimination proof is owed and
this entry says so rather than leaving it ambiguous (ADR-029).

### 2026-09-23 | surprise | outside review found the T2 fixture blind to its OWN motivating artifact

Worktree-isolated outside reviewer dispatched per ADR-029 (ii). **One HIGH finding, verified live by
the reviewer and then independently reproduced here before acting on it.**

**The finding.** `run-emitter-column-fixtures.ts`'s five live cases sampled **2 of the 15 rewritten
files**, both carrying the same message template ("repo root not found", 6 files). The other template
— "shared archive predicate not found", **9 files** — had **ZERO** coverage, and that set includes
`scripts/lib/conformance-engine.sh`, the literal artifact TD-157 / SPRINT-100 T5 was filed against and
which this fixture's own header names. Seeding a one-space break there left the suite reporting
**5 pass, 0 fail**. Reproduced here exactly before fixing.

So: any of ~11 rewritten sites, **including the one the whole task exists for**, could have been
reverted to one space and the gate would have stayed green. L-166 (a guard pointed at its own
motivating case) and L-186 (the SET the branches run over) — both were loaded, quoted in the fixture's
own header, and neither fired for the author. That is L-165's finding for the fourth time this
session: the defect was found by an independent pass, never by recalling the rule.

**The fix is structural, not two more samples.** Adding cases for the missing template would leave the
same class of gap one file later. Two changes:

1. **A POPULATION SCAN.** Enumerates every emission line in `scripts/lib` + `evals/lib` and requires
   two-space, minus a *named* exception set (`check-qa-budget-default.sh`, and `FAIL fixture(` lines).
   Complete by construction rather than by sampling.
2. **Live cases for the uncovered template, including the motivating artifact.** Fired without touching
   the shipped tree: the guard resolves its dependency as `$(dirname $0)/archive-path.sh`, so copying
   the checker ALONE into an empty temp dir makes that path absent and **the real file executes its
   real guard**. No mock, no re-implementation, nothing moved in `scripts/lib/`.

**The scan hit L-108 on its first run** and the trap is recorded in its code: it flagged
`harness-common.sh:19` — the `fatal()` header comment, which literally contains the words "ONE-space
`FAIL `". A corpus that documents its own formats reports its documentation as a defect. Comment lines
are now skipped, with that reason written at the line that skips them.

**ANTI-VACUITY FLOOR, because a scan that reaches nothing is indistinguishable from a clean one
(L-058).** The scan asserts it examined >= 25 files and >= 40 emission lines. Proven by seeding a
broken extension filter: it reports `FAIL emitter-column(POPULATION-vacuity): scanned only 0 file(s)`
rather than passing.

**Re-proof after the fix — all four seeds now caught, each restored hash-verified, zero line delta:**

| seed | before fix | after fix |
|---|---|---|
| `conformance-engine.sh` (the motivating artifact) | 5 pass, 0 fail — MISSED | 6 pass, **2 fail** |
| `check-handoff-state.sh` (no live case exists for it) | 5 pass, 0 fail — MISSED | 7 pass, **1 fail** |
| `check-verify-reaches.sh` | not covered | 6 pass, **2 fail** |
| `harness-common.sh` `fatal()` | caught | 6 pass, **2 fail** |
| extension filter broken (vacuity) | n/a | 7 pass, **1 fail** |

`check-handoff-state.sh` is the row that proves the scan earns its place: it has no live case and is
caught by population membership alone.

**Claims the reviewer independently CONFIRMED correct** (useful, and recorded so they are not
re-litigated): the 4 `check-qa-budget-default.sh` exclusions — they simulated the wrapper and got
`FAIL` + three spaces, exactly as its header warns; the 4 `harness-common.sh` fixture-report
exclusions; the 28-site enumeration for the two templates it covers; T1's fail-closed optional
chaining; T1's two `TS18047` reproduced by reverting and re-running `tsc`; and that all 15 rewritten
sites pass the message via `%s` so no `%`-injection is possible.

### 2026-09-23 | surprise | re-review found the SAME defect class inside the fix; three-layer hardening

The single bounded re-review of the revise loop. It confirmed the original finding was closed for its
concrete instances, and found **two more, both verified live, both the same failure mode one level
down**. Reproduced here before acting on either.

**(a) The comment skip hid real emissions.** The scan skipped any line whose trimmed text began `#`,
`//` or `*`. The `*` was meant for JSDoc continuations — but **in POSIX sh `*` is not a comment, it
opens a `case` default arm**, and this repo emits real findings from them:
`check-task-origin.sh:60` and `read-spec-rules.sh:50`. Seeding a one-space break at the first left the
suite at **8 pass, 0 fail with its emission count unmoved at 98** — the scan could not see the line at
all. L-186 recurring *inside the instrument written to close L-186*: the examined set narrowed by a
shape nobody chose to exclude. Fixed by making the skip language-aware (`#` for shell; `//`, `*`,
`/*` for TypeScript). Emission count moved 98 → **100**, which is the two recovered lines.

**(b) The vacuity floor caught collapse but not scope-narrowing.** Changing `scanDirs` from
`["scripts/lib", "evals/lib"]` to `["scripts/lib", "scripts/lib"]` — an ordinary copy-paste typo —
scanned **58 files / 176 lines**, cleared the 25/40 floor comfortably, and reported a clean population
while `evals/lib` went entirely unexamined. Fixed with **layer 2**: directories must be distinct and
each must contribute its own minimum.

**Layer 3, for the thing neither layer could see: is this the right SET of directories at all?** The
two-directory scope was previously asserted in a comment. It is now derived — every `.sh`/`.ts` under
`scripts/` and `evals/` must be either scanned or matched by a **named** out-of-scope rule, each rule
carrying its reason, and anything fitting neither is reported by name.

**Layer 3 fired on its first run and found 5 files nobody had classified**, which is precisely its
purpose: the four `evals/assert-*.sh` night-run assertion scripts (checked: their selftests match on
the FINDING NAME, never the column) and `layers-completeness-differential.ts` (checked: emits no FAIL
line and is in no harness list). All five are genuinely out of scope — but nothing said so until a
mechanism demanded it.

**Re-proof, every seed verified to LAND before its verdict was read:**

| defeat | result |
|---|---|
| case-arm seed `check-task-origin.sh:60` | 8 pass, **1 fail** — was silently missed before |
| case-arm seed `read-spec-rules.sh:50` | 8 pass, **1 fail** |
| scope defeat: duplicated directory | 8 pass, **1 fail** |
| scope defeat: dropped a directory | 8 pass, **1 fail** |
| clean tree | **9 pass, 0 fail** |

**One near-miss in my own test harness, recorded because it is the trap this repo has filed twice.**
The first `read-spec-rules.sh` seed reported 9 pass / 0 fail and I almost wrote it up as "still
missed". The seed had **never applied**: it substituted `printf 'FAIL  %s`, and that line embeds its
message in the format string rather than passing it through `%s`. An unapplied patch reports the suite
green, which is indistinguishable from a suite that discriminates (L-137). Caught only by checking the
seed's shape against the actual line — the `t()` helper verified *restoration* but not *landing*,
which is exactly the half that matters.

### 2026-09-23 | progress | T1 DoD 4 COMPLETE — the evals arm observed at last, on a third attempt

The `evals` arm of the Tier G seeded-break proof, open since the first session hour and blocked three
times by host memory. Obtained on the third attempt, and the evidence is sound despite the run dying.

Seed: `evals/qa-verdict.test.ts`, `0b89e9df…` → seeded, **+1 line**, verified to LAND before the run
started (hash moved, and `tsc` was confirmed to name the file). The leg's **own printed line**:

```
FAIL  typecheck: tsc --noEmit exited 1 with 1 error(s) -- first:
      evals/qa-verdict.test.ts(257,7): error TS2322: Type 'string' is not assignable to type 'number'.
```

Sibling control: the line names **no** `scripts/lib` file — the other tree stayed green.

**Why a killed run still carries the claim.** The harness stopped the gate for critical low memory
after 304 lines of output, inside leg 12's harness loop (last two lines: `run-foreign-repo-fixtures.sh`,
`run-dispatch-preflight-fixtures.sh`). The typecheck leg runs **before** leg 12 by deliberate design
(qa-check.sh:1022 — "a type error should surface in ~0.2s rather than after five minutes of eval
harnesses"), so it had already executed and printed its verdict. The kill is downstream of the
evidence. What the killed run cannot support is a claim about the gate's TOTAL or its final verdict —
and no such claim is made here; that is T4's subject and T4 is parked.

**The seed was restored as the FIRST action on the kill**, not as later cleanup: back to `0b89e9df…`,
byte-identical to HEAD under the stated convention, `grep -rn "__seed_type_error"` over `scripts evals
apps packages test` returning nothing, `tsc` clean, working tree clean. This is the third time this
session a kill has left a seeded break live in a shipped file and the third time restoration came
first (L-137).

**DoD 4 now rests on both arms, each observed rather than inferred:**
- `scripts/lib` arm — `FAIL typecheck: … scripts/lib/check-prose-density.ts(262,7) TS2322`, control
  `check-authority.ts` named 0 times, complete 547 s run
- `evals` arm — the line above, no `scripts/lib` control named

Both seeds: landed (hash-verified), targeted (+1 line, a genuine TYPE error rather than a syntax
demolition), restored byte-identical under ONE stated convention (`git hash-object <path>` against
`git rev-parse HEAD:<path>`).

**T1 is complete at 7 of 7.**

### 2026-09-23 | progress | T2 `Layers:` corrected mid-sprint — the fixture the DoD invented

Leg 15 went red after T2's fixture work: `changed by a task that never declared it:
T2:evals/run-emitter-column-fixtures.ts`. Declared rather than defended.

This is L-100's expected case, not a scope change. T2's `Layers:` was written at promote and named
the emitter sites it would rewrite; the **retained fixture** that DoD 5 and 6 require did not exist as
a path until the work was done, so no prediction could have contained it. A `Layers:` is a live
declaration corrected per task, and the cost of declaring before the work is exactly this edit.

Caught by running the leg after the last commit rather than at close — which is the only reason it did
not reach the close as a surprise.
