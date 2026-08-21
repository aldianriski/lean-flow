---
sprint: 077
slug: the-decisions-epic-004-is-waiting-on
epic: EPIC-004
owner: Maintainer
last_updated: 2026-08-21
status: active
gates_signed: G1,G2 @ d004526
plan_commit: c97d773
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-077 — The Decisions EPIC-004 Is Waiting On

> **Theme:** EPIC-004 has two exit conditions open, and they are not the same kind of open.
> § Closed-when 2 needs **~32 rules built** — four or five sprints of coverage work. § Closed-when 3
> needs **two rulings and one small spec change**, and SPRINT-076's audit already did the measuring.
> This sprint takes the second one, deliberately, because a condition that is a decision away should
> not wait behind a condition that is a quarter away — and because the artefact fix (T1) makes every
> later coverage sprint report better. **Two tasks. It is a small sprint and says so.**

## Scope

**In:** the §2 loop-row distinction that stops the engine telling a stranger it owes
`.claude/CONTEXT.md` (T1) · the two rulings that make § Closed-when 3 tickable — invocation-error
scope, and the must-REPORT wording (T2).

**Out (deferred):** **the ~32 remaining `build` rules** — the epic's bulk, and it has *no backlog
tasks*, so it needs `/task-decomposer` before it can be planned at all; that is the next sprint's
entry, not this one's silent overflow · **TD-069's register cap decision** (split vs raise by ADR),
filed at this promote and wanting its own thinking · **TD-048/TD-057's matcher work**, deferred a
fifth time and flagged in the aging sweep as a decision nobody is making · **TASK-238**, still
correctly blocked — its trigger needs §6 or §11 coverage, which this sprint does not add ·
**TASK-188**, unrelated and still blocked.

## Plan

### T1 — Mark which §2 rows are lean-flow-loop rows rather than repository-universal ones `[size: S · risk: med · class: decision · HITL]`
Layers: `spec/STANDARD.md` (§2) · `spec/CHANGELOG.md` · `scripts/lib/conformance-engine.sh` ·
        `evals/run-foreign-repo-fixtures.sh` · `evals/run-s2-placement-fixtures.sh` (added at G1 — see Log) ·
        `docs/research/conformance-dispositions.md` (§ Artefacts)
Depends-on: none
Cites: SPRINT-076 T3 (the triage that measured it) · the four loop rows named as examples,
       cited not touched — `AGENTS.md` · `TODO.md` · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` ·
       TASK-243 · L-015 · L-016 · L-058

§2's unconditional set mixes two populations and does not say which is which, so `S2.F-FILE` tells a
four-file JS library it owes `AGENTS.md`, `TODO.md`, `.claude/CLAUDE.md` and `.claude/CONTEXT.md` —
**4 artefacts of 8 findings**, measured, not suspected. SPRINT-076 ruled the engine stays faithful and
the fix belongs in the **spec**, because a checker narrowing a rule the standard states is deciding a
question the standard owns. The distinction must be **machine-readable**: the engine reads it, never
infers it.

**Acceptance:** the engine, run against a repository that never installed lean-flow, raises no
`core-file-missing` for a file only a lean-flow repo owes — and the four that vanish are exactly the
four the register names.

**DoD:**
- [ ] §2 distinguishes loop rows from repository-universal rows in a form a checker reads —
      *Verify: the engine derives the distinction from the spec, with no list in code; flipping a row
      in a spec copy changes behaviour with no code edit, the way `--spec` already proves for marks*
- [ ] The artefact count is **re-derived, not copied** — *Verify: run the foreign-repo target and count.
      SPRINT-076 measured 4 of 8; that figure is a query result and gets re-run here (L-130 · L-143)*
- [ ] `run-foreign-repo-fixtures.sh`'s retained artefact-set case is **re-triaged, not widened** —
      *Verify: the case asserts the NEW remainder and the harness is green. It was written to redden
      exactly when this task lands, so silencing it instead of re-triaging defeats its purpose*
- [ ] `conformance-dispositions.md` § Artefacts records the new count and what changed — *Verify: the
      register. **Note TD-069**: it is already 206/130, so add a row and prune, do not just append*
- [ ] The spec version is bumped and the bump **argued** — *Verify: `spec/CHANGELOG.md`. Unlike 0.4.2
      this one CHANGES WHAT A REPORT SAYS about an existing adopter's tree, so PATCH is not obviously
      right; state the reading rather than inheriting the last one (ADR-023)*

### T2 — Rule on §Closed-when 3's two residuals, and tick it or say why not `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/epic/EPIC-004-conformance.md` (§ Closed-when 3) ·
        `docs/research/fixture-coverage-audit.md` (the record being ruled on) ·
        `evals/run-conformance-engine-fixtures.sh` (only if ruling (a) puts the three IN scope)
Depends-on: none
Cites: SPRINT-076 T1 · `S9.GATESABSENT` (a rule id, cited not touched) · TASK-244 · L-088 ·
       STANDARD §14

The measuring is **done** — 24 of 24 checks guarded, 16 of 19 finding identities, gap list named. What
is left is two rulings SPRINT-076 T1 deliberately refused to make inside the audit that would have
benefited from them. **(a)** are the engine's three *invocation-error* identities (`usage` ·
`repo directory not found` · `reader-missing`) in scope for a condition about checks having fixtures?
**(b)** `S9.GATESABSENT` reports *NOT SIGNED* as a note and never FAILs by design, so the condition's
wording is **unsatisfiable** for it.

**Acceptance:** a reader of the epic can tell whether § Closed-when 3 is met, and on what reading —
without re-opening the audit.

**DoD:**
- [ ] Ruling (a) is written with its reason — *Verify: the epic. Either the three are excluded as
      invocation errors, or they are in scope and get fixtures; "not really findings" without a
      recorded reason is the drift, not the ruling*
- [ ] Ruling (b) is written, and the condition **either adopts the wider property or states its
      exception** — *Verify: the epic. The property the corpus actually satisfies is «a retained case
      asserts the named finding on input that must produce it»; must-FAIL is its common case*
- [ ] § Closed-when 3 is **ticked, or the remaining gap is named** — *Verify: the epic. If (a) rules
      the three in scope, it does not tick until they have fixtures — and that is a legitimate outcome*
- [ ] Any wording change to a Closed-when condition is recorded as an **amendment with its reason** —
      *Verify: §4's three-part bar decides ADR vs Retro. **This is the task most exposed to L-088**:
      re-wording a condition while holding the audit that wants it ticked is exactly how a bar moves
      quietly. If the wording changes, the epic says what it used to say*

## Owner-action checklist

_None._

## Decisions (pre-locked)

- **D1 — Two tasks, and the smallness is the point.** The alternative was decomposing coverage work to
  pad the sprint; that mixes a decision sprint with a build sprint and delays both. EPIC-004 reaches
  **4 of 5** on two small tasks, leaving one clearly-scoped condition. **→ no ADR** (a sizing choice).
- **D2 — T1 and T2 are independent and may run in either order.** Neither reads the other's output:
  T1 changes what the engine reports, T2 rules on how checks are guarded. Listed T1-first only because
  its spec change is the one later sprints build on. **→ no ADR.**
- **D3 — Shared files: none.** The two tasks' `Layers:` are disjoint — T1 owns `spec/` + the engine +
  the foreign-repo harness; T2 owns the epic + the audit record. `run-conformance-engine-fixtures.sh`
  appears only under T2 and only conditionally. **No ownership order needed**, which is why this sprint
  has no D-row fixing one. If T1's spec edit turns out to touch the epic, log a `scope-change` first.
- **D4 — The coverage work is NOT silently carried.** ~32 rules remain and have no tasks; naming that
  in § Out rather than half-planning it here is deliberate — the next sprint's entry is
  `/task-decomposer`, not `promote`. **→ no ADR.**

## Assumptions

- **A1** — The 4-of-8 artefact figure is SPRINT-076's measurement and is treated as a **prior, not a
  fact**: T1 re-derives it. *Confirm: T1's DoD 2 — run the target, count, and expect the number to
  have moved if anything else changed.*
- **A2** — §2 can express the loop/universal split without a new rule, so the change stays a **wording
  and column** matter rather than adding to §2's 21. *Confirm: T1 — if it needs a new rule id, that is
  a MINOR spec bump and a bigger conversation than this task holds; stop and surface it.*
- **A3** — The audit's 16-of-19 stands; nothing since SPRINT-076 has added or removed a check.
  *Confirm: T2 — re-run the enumeration (`ls scripts/lib/check-*.sh` + `grep '^assert_'`) before
  ruling on numbers derived from it (L-130).*
- **A4** — Ruling (a) most likely **excludes** invocation errors, since a `usage` message is not a
  finding about a repository. *Confirm: T2 — and note that **disconfirming this is a result**: if they
  are in scope, the condition does not tick this sprint and that is the honest outcome.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-077-the-decisions-epic-004-is-waiting-on.md`,
> rendered from `templates/sprint-log.md.template` and created lazily at the first entry. Append
> there, never here: the Log grows with the work done, so keeping it out of this file is what stops it
> consuming the 400-line budget the Plan needs (STANDARD §9 · ADR-014).

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
