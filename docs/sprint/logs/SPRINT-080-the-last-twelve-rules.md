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
