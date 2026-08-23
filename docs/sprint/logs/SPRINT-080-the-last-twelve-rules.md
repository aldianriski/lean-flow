---
sprint: 080
slug: the-last-twelve-rules
owner: Maintainer
last_updated: 2026-08-23
status: active
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
