---
sprint: 080
slug: the-last-twelve-rules
owner: Maintainer
last_updated: 2026-08-23
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-080 — Execution Log

> Append-only companion to [`../SPRINT-080-the-last-twelve-rules.md`](../SPRINT-080-the-last-twelve-rules.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-23 | progress | G2 baseline: the engine was run before any task was planned against it

D2 says each task runs its rules against this repository before writing fixtures. Applied to the
sprint as a whole at G2, it produced two findings before T1 began — both recorded below.

Baseline (`sh conformance.sh .`, ~78s): exit 1 · 35 FAIL lines · 18 GAP · `level: none` ·
`coverage: 33 checkable have an assertion; 18 unchecked`. The 34 pre-existing FAILs are `S1.LAW3` /
`S3.SCHEMA` (docs/qa/ + docs/research/ ownership headers) and `S6.BASE` (two absent `docs/product/`
files). **All predate this sprint and none is in its Scope** — named here so a later red gate is not
mistaken for a regression this sprint caused.

### 2026-08-23 | scope-change | T0 inserted — `S9.VERIFYCLAUSE` false-positives on every unticked Plan

**What broke.** The baseline reported `dod-criterion-names-no-check` against
`SPRINT-080-the-last-twelve-rules.md` — *"ticked criterion names no evidence: `""`"* — on a Plan with
**zero** ticked boxes. Not a finding about this repository: a defect in a check SPRINT-079 T4 shipped.

Cause, at `conformance-engine.sh:2044`: the ticked criteria were read as `$(grep '^- \[x\]' …)`
**inside a heredoc**. An empty command substitution there still yields **one empty line**, so the loop
read a phantom criterion, matched neither evidence form, and fell through to `bad`. Confirmed
directly — the loop ran once on a grep that matched zero lines. Its consequence compounds: `bad` sets
`last_bad`, and the function returns on it, so the `no ticked DoD criteria in any active sprint yet`
branch written for exactly this state was **unreachable dead code**.

**Impact.** Every sprint fires this between promote and its first tick. It arrived with this sprint's
own promote (`ad4932d`) and would have sat red under all four tasks, making any later "did the gate go
red?" reading ambiguous — the reason it was fixed rather than filed.

**Why the family's controls missed it.** Both existing `S9.VERIFYCLAUSE` controls hand the rule a Plan
that *has* a ticked box, so neither could ever reach the zero-tick path. The gap was a missing
control, not a wrong assertion (L-058).

**Fix + proof.** Read the ticks into `ticked` first and `continue` when empty. Retained control added —
`s9-dod-names-no-check-control-zero-ticks`. Discrimination shown per L-137 · L-142: against the
**unfixed** engine the new control **reddens** (`FAIL dod-criterion-names-no-check … ""`) while its
sibling (ticked + `*Verify:*`) stays **PASS** — a targeted break, not a demolition; the swap was done
in place so sibling libs resolved, and the restore was verified by `sha256sum` against the fixed copy.
Harness `run-sprint-family-fixtures.sh`: **24 pass, 0 fail** (was 23 cases). Repo report: FAIL 35 → 34,
exactly the phantom, and `S9.VERIFYCLAUSE` now reaches its note branch.

**Re-confirm G2.** Owner-approved as T0 with this entry (AskUserQuestion, 2026-08-23). § Plan is
**not** edited — T0 is additive and recorded here, per the frozen-Plan rule.

### 2026-08-23 | scope-change | T3's coverage DoD ruled unsatisfiable as written, and amended

**What broke.** T3's DoD reads *"`build` reaches 0 and coverage reads **51 of 51** — Verify: the
engine's `coverage:` line"*. The engine's line counts only assertions **inside the engine**: today
`33 checkable / 18 unchecked`. Six of those 18 — `S2.F-CAP` · `S2.R-TEMPDIR` · `S7.MEGA` ·
`S7.SPRINT400` · `S11.EPIC` · `S11.RESEARCH` — are covered by **standalone checkers**
(`check-doc-caps.sh` · `check-ephemeral-intake.sh` · `check-epic-archive.sh` ·
`check-research-archive.sh`), are recorded as covered in `conformance-coverage.md`, and are **not** in
the register's § `build`. Cross-checked both ways: the register's § `build` holds exactly 12 rows and
they are exactly T1+T2+T3's targets, so **A1 holds** and the Plan's repo-wide "39 of 51" is right
(33 in-engine + 6 standalone). What is wrong is the **named verification method**: after this sprint
the engine will print **45 / 6**, never `51 of 51`.

**Impact.** The criterion could not be ticked honestly by any amount of correct work — the L-136
grain: a structural claim about another artefact, frozen without being queried.

**Ruling (owner, 2026-08-23).** Amend the method, not the claim. T3 ticks when: the engine prints
**45 checkable / 6 unchecked**; each of the 6 is shown covered by its named standalone checker in
`conformance-coverage.md`; and the register's § `build` is empty. T1/T2's *"counts reconcile to 51"*
stands as written — 51 is the **denominator**, which both `33+18` and `45+6` satisfy. T4's
*"the two counts sum to 51"* was already correct and is unchanged.

### 2026-08-23 | progress | T1 — §11's four ledger-retention rules, and two defects real input found

**Shipped.** `S11.TDDELETE` → `resolved-td-row-past-retention` · `S11.TODOCAP` →
`todo-over-cap-at-promote` · `S11.LEARNINGS` → `promoted-learning-not-collapsed` · `S11.BACKLOG` →
`shipped-backlog-entry-retained`. Ids and findings re-derived from the register's § `build` §11 rows,
not copied from the Plan: 12 rows there, the four §11 ledger ones are these.

**D2 paid for itself twice — both defects were in the check, not the repository.**

*First draft: 39 findings, every one on a conformant entry.* §11's action is *"collapse it to a
pointer line — `L-NNN → promoted: <where>`"*, and this corpus satisfies it in **two** stored forms:
**(a)** the heading itself is the pointer (`L-143`, `L-142`); **(b)** the heading keeps a one-line
gist and the pointer is the first body bullet — `- **L-137 → promoted: … ** — the durable rule is the
record now` — which is §11's literal shape, id and all. The draft recognised only (a), so 39 entries
using (b) were reported. Fixed by testing for both, with (b) anchored to *the scanned entry's own id*
so a neighbour's pointer quoted in prose cannot satisfy it.

*Second draft: one finding, on `L-114` — which is `[status: active]`.* Its heading is a several-
hundred-word narrative that **quotes the literal string `[status: promoted]`**, and the status test
was an unanchored substring scan of the whole line. This is L-108 arriving inside code written by
someone who had just cited L-108 in the comment above it. Fixed by splitting the heading at its first
`]:` and judging status on the metadata half only.

**Result on this repository: all four PASS**, and the DoD's two predictions both hold —
`S11.TDDELETE` reports TD-048/057/065 have **not** reached the trigger (resolved at SPRINT-078, 2
sprints back, against a delay of 3), and `S11.LEARNINGS` identifies **L-144** as the one promoted
entry still carrying its body, then clears it on the exception recorded at `LEARNINGS.md:114`.

**Cross-check, per the rule that a query acted on immediately needs a second that agrees.** An
independent metadata-anchored census: **91 active + 41 promoted + 1 superseded = 133 = the heading
count.** The naive corpus grep said **43** promoted; the gap of two is exactly the prose
contamination the second draft tripped on. Coverage `33 → 37` in-engine, unchecked `18 → 14`, and
`37 + 14 = 51` — the denominator is unmoved, so **A2 holds**.

**Every threshold read from the spec, none written in the checker.** The retention delay is parsed
from §11's own `S11.TDDELETE` row; the TODO cap from §2's row; the collapse-exception markers from
§11's exception clause. Demonstrated rather than asserted: against a scratch spec with the delay
loosened `3 → 2`, the *same repository* and *unchanged code* flip from `PASS S11.TDDELETE` to
`FAIL resolved-td-row-past-retention` (`s11-td-threshold-read`).

**Two spec/parser changes this task required, both recorded.** (1) §11's LEARNINGS row gains a
**Deliberate non-collapse is recorded** clause — the exception form the G2 ruling chose, stated in
the spec so the check *derives* the markers instead of hard-coding them. It is an exception clause of
an existing action, not a further rule: §11 still states **11 rules** and its conformance table still
has 11 rows. (2) `_s2_cap_for` gained an optional column argument and now takes a **leading** integer
rather than every digit in the cell — `TODO.md` sits in §2's root table (Cap at c[4], not c[5]) and
its cell reads `320 soft (ADR-019)`, which the old `gsub` would have read as **320019**. Generalised
rather than duplicated, so TD-070's parser count stays at six.

**Layers correction (L-100).** T1's declared `Layers:` did not name `spec/STANDARD.md`; the exception
clause put it there. Declared here, not defended.

**Retained fixtures: 13 new cases, 37 → 38 total.** Four must-FAIL, the spec-read mechanism case, and
eight controls — including the two that encode the defects above (`control-form-b` for the 39, and
`control-prose` for L-114), retained as fixtures rather than treated as fixed bugs (L-140).

### 2026-08-23 | surprise | D4's trip-wire is live — the harness reached 9m26s

`run-sprint-family-fixtures.sh` went **5m41s (24 cases) → 9m26s (37 cases)**, which is D4's *"passes
~10 minutes"* condition arriving one task earlier than the Out section expected. The scaling is
roughly linear in cases, so T2's five findings and T3's four-plus-four would land it near **15
minutes**.

D4 already rules this — *"stop and fix TD-073 before adding the rest. A cost that doubles mid-sprint
stops being debt and becomes this sprint's problem"* — so it is not re-opened here, only recorded as
having fired. **TD-073 is the next action, before T2 adds cases.** Root cause is known and named in
L-144: every case runs the whole engine against the shipped spec, so cost is dominated by engine
invocations, not by the assertions themselves.

### 2026-08-23 | scope-change | § Plan gains a `### T0` section, because a gate required the declaration

**What broke.** The pre-commit gate came back **`QA-CHECK: 159 pass, 1 fail`** — its own printed
verdict, not the wrapper's exit code, which was **0**. A textbook L-120 split: reading the status
would have committed through a red gate.

The finding is `layers observed`, and it is correct on both halves: `spec/STANDARD.md` was changed
but named in no task's `Layers:`, and T0's two files were *"changed by a task that never declared
it"* — T0 was approved and logged, but it had no `### T0` section for the checker to read.

**Impact.** None shipped: the gate caught it before the commit. It does mean the earlier claim that
§ Plan stayed byte-identical held only until the gate demanded otherwise.

**Ruling.** L-100 governs — `Layers:` is a live declaration corrected per task, not a frozen
prediction to defend. So `spec/STANDARD.md` is declared on T1 with its reason inline, and T0 is
recorded in § Plan with its own Layers and DoD. Both edits follow the `scope-change` entries already
on this log rather than preceding them, which is the order the frozen-Plan rule asks for.

**Worth noting for the Retro:** `layers observed` found the undeclared spec edit that this log had
already confessed in prose. The prose was not a substitute for the declaration, and only the
mechanical check treated it as missing.

### 2026-08-23 | progress | T5 — TD-073 fixed, and its stated cause was wrong

D4's trip-wire fired at the end of T1 (9m23s / 38 cases), so TD-073 was fixed before T2 added any
case. Ran out of numeric order because the trigger was, and declared as `### T5` because the fix
edits `TECH-DEBT.md` — coordinator-exempt at **close**, but reported during execution since TD-044's
phase split, which is correct and caught it.

**The row's stated cause did not survive measurement.** TD-073 said the cost was *"every case runs
the whole engine against the SHIPPED spec, ~15s each"*, and proposed either reducing the spec or
splitting the family. Timing per L-144's own diagnostic — each part in isolation against a **tiny**
input, which is what makes overhead visible — said otherwise:

| measured on this host | |
|---|---|
| 100 × `fn="assert_$(printf '%s' "$id" \| tr '.-' '__')"` | **9,176 ms** |
| 100 × `pid=$(printf '%-20s' "$id")` | **1,909 ms** |
| `read-spec-rules.sh`, all 100 rules | 150 ms |
| **one whole engine run** | **10,859 ms** |

The driver's own per-rule bookkeeping **was** the engine's runtime. Two command substitutions and an
external `tr`, on every one of 100 rules, doing no work that a parameter expansion could not. The
shipped-spec question TD-073 named is worth about **2.2s of 10.9s** — real, but not the term that
mattered, and neither proposed mitigation was needed. The `sys`/`user` split said so before any
theory did: **11.2s system against 4.3s user** is process creation, not computation.

**Fix:** both lines rewritten with parameter expansion only — no subshell, no external binary.
Equivalence proven over all 100 ids *before* the swap, both transforms, **zero mismatches**,
including the 21 hyphen-bearing ids that produced a silent false negative the last time this mangling
changed. Engine output verified **byte-identical** on two repositories (116 and 144 report lines): a
speedup that moves a verdict is a regression, not an optimisation.

**Result: 9m24s → 3m20s** for the same 38 cases, all green — 65% faster, trip-wire cleared with room
for T2 and T3. Engine cost on a fixture-sized repo roughly halves; this repository's own report ~24%
faster. The gate should benefit more than either, since it invokes the engine dozens of times.

**Ledger.** TD-073 → `resolved`, with the wrong cause **kept as written** and the correction appended
— being wrong is the instructive part, and rewriting the summary would hide that a plausible,
well-argued hypothesis went untested for a sprint. TD-075 filed for the half that did **not** get
fixed: the ten git-free cases still parked behind `QA_FULL`. TD-073's own *Re-file fresh if* clause
predicted exactly that split. New id derived from the ledger maximum (074), not incremented from
memory (L-143).

**Retro candidate.** L-144 has now recurred a fourth time, one level below where it was last found —
in the *driver* rather than in an assertion — and L-147 already says why: the rule is prose, and
nothing **measures** the thing it protects. This sprint has now paid that cost twice (T1's harness
scaling, T5's root cause). A cost regression check that times the engine against a fixed tiny input
and fails on a threshold read from somewhere would have caught both at authorship. That is TD-071's
subject and it is now overdue rather than theoretical.

### 2026-08-23 | progress | T2 — §11's archival rules, and two more artefacts real input caught

**Shipped.** `S11.SPRINT` → `closed-sprint-not-archived` · `sprint-index-row-missing` ·
`S11.LOGPAIR` → `sprint-log-archived-apart-from-plan` · `S11.CHANGELOG` →
`changelog-not-rotated-at-minor` · `S11.WHENITRUNS` → `retention-trigger-ran-in-wrong-phase`.
Four rules, five findings, re-derived from the register rather than from the Plan.

**D2 again, and again the first draft was wrong about this repository rather than the reverse.**

*Artefact one — 79 findings, one per archived sprint.* `sid=${base%%-*}` stops at the **first**
hyphen, so every `SPRINT-045-gate-precision.md` resolved to the bare word `SPRINT`, matched no INDEX
row, and reported the entire archive as unindexed. The tell was the count, not the logic: a rule that
fires on every row is reporting itself.

*Artefact two — 24 sprints reported as split Plan/log pairs.* The draft compared
`git log -1 --follow` for each file, which returns the **newest commit to touch** the path — for
SPRINT-045 that was a later release commit for the Plan and a later labelling commit for the log,
neither of them the archive. Replaced with oldest-first `--diff-filter=A`, the commit each file
*first appeared* at its archive path, which is the event §11 constrains.

*And a third thing, which is not an artefact.* Even with the correct commit, pre-`logs/` sprints
still differ — `logs/` arrived with **ADR-014 at SPRINT-047**, so earlier sprints had no separate log
to move and their archived logs were written by that one-time migration. Judging them reports a
decade of correct closes against a rule about a file that did not exist. So the same-commit half now
binds only when the live log existed in the archive commit's **parent**, and the report counts those
sprints separately rather than as passes.

**One real finding, and it was repaired.** `S11.CHANGELOG` reported that `docs/changelog/` holds
**38 rotated files** and root `CHANGELOG.md` carried **no link line** to them. §11 pairs the move
with one pointer, and without it rotation does not compress the record — it hides it, since the root
file is the only entry point. Triaged as real (not artefact) and fixed by adding the pointer.
`CHANGELOG.md` is declared on T2's `Layers:` accordingly (L-100).

**Result on this repository: all four PASS**, and the counts reconcile against the archive three
ways — `S11.SPRINT` 79 archived each with a row; `S11.LOGPAIR` **32 + 46 + 1 = 79**;
`S11.WHENITRUNS` **76 + 3 = 79**. The 32 pairs plus the 1 predating equal the 33 archived logs on
disk, which is the second query the first one needed.

**`S11.WHENITRUNS` is deliberately narrow, and the narrowness is the design.** Only the sprint
archive is phase-checked, against the sprint's own `close_commit` — two commits, no interpretation.
The scan-based triggers are **not** phase-checked: promote is a window rather than a commit, and a
rotation landing just outside it would be a finding no adopter could act on (§14). **Not-run is a
different state and stays under S11.SPRINT**, pinned by two retained cases.

**A fixture bug worth recording, because it failed in both directions at once.** The
`S11.WHENITRUNS` must-FAIL case did not fire *and* its control passed — both were reading nothing,
because `close_commit` was appended to the **end** of the sprint file rather than into the
frontmatter `_fm_real` reads. A green control that is green for the wrong reason is exactly L-142's
shape, and only the must-FAIL failing made it visible. Fixed with a `close_at` helper that writes
into the header; the existing `close_the_sprint` now delegates to it.

**Discrimination (L-137 · L-142): four seeded breaks against TWO conformant probe repos** — one with
a normal pair, one with the migration shape. Each seed reddens exactly one repo and leaves the other
green; restore hash-verified each time. **Two seeds initially failed to redden and were rebuilt
rather than accepted**: the LOGPAIR guard needed the migration-shaped repo to be exercised at all,
and the CHANGELOG seed was a no-op `sed` that would have scored as a pass.

**Harness: 38 → 56 cases, and 9m24s → 5m06s.** More than twice the cases in a bit over half the
time, which is T5's fix showing up where the trip-wire was set. Coverage `37 → 41` in-engine,
unchecked `14 → 10`, `41 + 10 = 51`. Register § `build` **8 → 4** — only §12 remains.

### 2026-08-23 | progress | T3 — §12's git boundary, and the controls that came first

**Shipped.** `S12.SECRETS` → `secret-committed` · `S12.BACKUPS` → `database-backup-committed` ·
`S12.DESIGNSRC` → `design-source-committed` · `S12.GENERATED` → `generated-artifact-committed`.
Ids and findings re-derived from the register; **reason (c) read before the first detector was
written**, not after — a scan flagging `contract.md` in a contract-testing repo is *"worse than no
scan"*, and that sentence is what produced the design rather than being cited to justify it.

**The rule: two signals that agree.** A finding needs a **shape** (extension · filename · path) *and*
a **confirmation** read from the file's content or its git state. One signal alone is the heuristic
§12 refused, which is why its other six categories stay `judgment-only`.

| rule | shape | confirmation |
|---|---|---|
| `S12.SECRETS` | `.env` (never `.env.example`) · `*.pem` · `id_rsa` · `service-account.json` | a non-placeholder assignment · a `PRIVATE KEY` block · a `"private_key"` field |
| `S12.BACKUPS` | `*.sql` · `*.dump` · `*.bak` | a dump-tool preamble the file writes about itself |
| `S12.DESIGNSRC` | `.psd` · `.ai` · `.sketch` · video | **not** under the asset directories §12 names |
| `S12.GENERATED` | §12c's classes, read from the spec | the path is **tracked** — ignored is the compliant state |

**What was refused, and why it is recorded rather than merely decided.** **Size thresholds**, for both
BACKUPS and DESIGNSRC. §12 says *"large"* and *"small"* and states **no number anywhere**; a figure
written into the checker would be a threshold the standard never set, drifting from a spec that has
nothing to drift from (L-097 · L-130) — and "large" is exactly the judgement §14 says not to fake.
Replaced by signals §12 *does* state: a dump-tool banner, and the asset directories it names by path.
**Bare filename matching** refused throughout.

**The controls were built first, and that ordering did real work.** `lookalike_repo` was committed
before any detector existed: `.env.example`, a `.pem` holding only a public **CERTIFICATE**, a small
fake `db/seed.sql`, `public/hero.mp4`, a shared `.vscode/extensions.json`, and an **untracked**
`dist/`. Every one is a shape a filename heuristic flags. Each detector was then written to clear a
concrete file rather than judged against one afterwards, and each now reports a **non-zero
shape-match examined and cleared** — which is what distinguishes a control that is reached from one
that passes because nothing got that far.

**One design trap, caught before it shipped.** §12c names its classes and its single
`MAY be committed` carve-out **in one sentence**, with the carve-out appearing *before* the
permission. The first reader trimmed at `"MAY be committed"` and therefore **kept**
`.vscode/extensions.json` in the prohibited set — the rule would have fired on the one file §12
explicitly allows. Replaced with an explicit **subtraction**, and the subtraction was verified
load-bearing (the allowed token is provably a member of the class list) rather than assumed. An
exclusion is judged by what it lets through, never by where it sits in a sentence (L-140). Both
halves of §12c's personal-vs-shared VS Code split are now retained cases.

**A4 confirmed by measurement: lean-flow is clean on all four.** With an honest caveat recorded on
the DoD — three of the four report **0 shape-matches examined**, meaning this tree holds no
candidates at all, so our own repository cannot exercise the content confirmation. That verification
happens on the lookalike repo instead, which is L-016's rule: when the substrate is absent, verify on
the consumer path rather than reading "didn't fire here" as either broken or fine.

**Discrimination (L-137 · L-142): four seeded breaks, each removing exactly one confirmation.** Every
one reddens **only its own finding** on the lookalike repo and leaves the other three silent;
0-line-delta, still parsing, restore hash-verified each time.

**Harness 56 → 67 cases, 5m06s → 6m45s** — still well inside D4's trip-wire, which T5 bought.

**`build` reaches 0.** The register's bucket is **emptied and kept**, with a note that an empty bucket
is a fact about the standard's state and that a reader finding the heading gone could not tell that
from a register which never partitioned its rules. It also records what empty does **not** mean:
`45 + 6 = 51`, where the 6 are covered by standalone checkers — the amendment ruled at G2, because
the frozen criterion asked for `51 of 51` from a line that counts only in-engine assertions and could
never print it (L-088 · L-136).

### 2026-08-23 | scope-change | T4 edits `check-epic-archive.sh`, which its Cites said to run and never edit

**What broke.** Ruling § Closed-when 2 meant closing the epic, and closing it made the gate red:
`check-epic-archive.sh` FAILs the moment an epic is `status: closed` with every condition met, and
demands the move to `docs/epic/archive/`. But **SPRINT-080 is itself a member sprint and is still
open**, and §11's trigger is *"every member sprint closed **and** the epic's Closed-when conditions
all `[x]`"* — a test its own Conformance row calls **"a genuine TWO-PART test"** in those words.

**The checker read `member_sprints` zero times.** It enforced one half. That is wrong in both
directions: it demanded an archive §11 forbids (the false positive that fired here), and it would
accept an epic archived while a member sprint was still running — the silent case §11 explicitly
warns about, *"never archive on member-sprint count alone"*.

**Impact.** The correct state — *epic finished, the sprint that finished it not yet closed* — was
**unrepresentable**. Neither leaving the epic open nor archiving it early is honest.

**Ruling.** Owner-approved (AskUserQuestion, 2026-08-23): close the epic and fix the missing half.
T4's `Layers:` now names the checker and its harness; its `Cites:` had said *run, never edited*, and
running it is exactly what found the defect (L-100).

### 2026-08-23 | progress | T4 — § Closed-when 2 ticks, EPIC-004 closes, and the checker gains its second half

**The condition ticked on the evidence, with no amendment.** It had refused two looser readings at
SPRINT-076 and re-worded itself twice on the record; it was ruled here on the same terms and its
wording is byte-unchanged by this sprint. Both halves re-derived rather than carried forward:

| half | count | how |
|---|---|---|
| maps to a check | **51** | 45 in-engine (the engine's own `coverage:` line) + 6 standalone — and each of those six checkers was **run** at this ruling, not merely looked up in the register |
| explicitly marked | **49** | position-anchored from the spec: 32 `judgment-only` · 7 `restated` · 6 `implementation-directed` · 4 `standard-directed` — exactly the four marks the row names, no fifth |
| | **100** | the full classified set |

`check-epic-archive.sh` reported **`0 of 5 condition(s) open`** with the epic still `active`, before
any close was written — which is the order DoD 4 asked for.

**The epic is closed and deliberately NOT archived.** §11's second half has not fired, because
SPRINT-080 is a member and is open. Archival executes at this sprint's close, which is also what
resolves the §2 cap breach D3 deferred — the file grew 216 → 236 adding the evidence the DoD required.

**Three defects found while fixing one.**
1. **The missing half itself** — `member_sprints` never read.
2. **Two id formats coexist.** EPIC-001/002 write `[SPRINT-025, SPRINT-026]`; EPIC-004 writes
   `[072, 073]`. Globbing the raw token built `SPRINT-SPRINT-025-*` and reported **three correctly
   archived epics** as having open members. Normalised, and both shapes stay legal.
3. **"Unfindable member" is not "open member."** The first draft treated a member with no Plan as not
   closed. That is the conservative reading, and it blocks archival on a fact nobody can establish —
   an adopter who prunes old sprints could never archive again — and it broke two **retained**
   fixtures whose epics name sprints they never modelled. Split: `open` gates, `unknown` is **named
   on the report** and does not, which is how `S11.WHENITRUNS` already handles a sprint it cannot
   phase (L-058 — never silently skipped).

**L-152 arrived on schedule.** Growing the finding text disarmed **two retained assertions** that
matched the old sentence's tail — behaviour unchanged, guards silently satisfied. Caught because they
went red, not because anyone remembered; both trimmed to the stable prefix so the next reword does not
repeat it.

**And the edit-safety trap fired twice in one task.** A line-range replacement dropped the `opn=` and
`tot=` assignments while inserting the new branch, so the second loop would have read the first
loop's values — caught only by re-reading the whole block (L-009). Then an errored `awk` wrote the
fixture harness **empty**, which `sh -n` accepts; restored from the pre-edit copy (L-142's
"errored `sed` wrote an empty file" shape, verbatim).

**Fixtures: 5 → 7, all green.** Discrimination: reverting the member half reddens **exactly** the two
new cases and leaves `premature` and `properly-archived` green; restore hash-verified.
