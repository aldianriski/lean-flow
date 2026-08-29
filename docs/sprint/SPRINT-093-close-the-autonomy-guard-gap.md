---
sprint: 093
slug: close-the-autonomy-guard-gap
stream: autonomy
epic: EPIC-015
owner: Maintainer
last_updated: 2026-08-29
status: active
plan_commit: c52496f
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-093 — Close the Autonomy Guard Gap

> **Theme:** EPIC-015 § Closed-when 1 has been open since SPRINT-089 for one reason: the reaper
> published a **false `PLAN_EXHAUSTED`** into a different sprint's log, and `check-night-run-rollup.sh`
> **PASSED it** — because it asserts the terminal line's *shape* and never its *agreement* with the
> per-task lines beside it. A guard that passes a false rollup is a silent false negative in the one
> artifact an unattended run leaves behind. This sprint closes that, and clears the three smaller
> foreclosures found alongside it that between them can refuse a night run outright.

## Scope

**In:** the rollup checker taught to compare **agreement**, not shape, and the reaper taught which Plan
it actually ran · the generated knowledge index stopped from going stale on the passage of time alone ·
the launcher's green-gate precondition made visible where the checklist is read, with a ruling on
declared exceptions · pre-flight item 3's wording ruled against a declared `J2`.

**Out (deferred):** every remaining EPIC-015 § Closed-when condition — bounded unattended repair runs,
the `DELIVERED`/`PARTIAL`/`FAILED` rollup vocabulary, the two dogfoods, and the re-arming of the freeze
in `adlc-epic-sequencing.md` · `TASK-300`'s "one task or five" decision on the gate-accuracy defects,
which stays in the Backlog · `TASK-188` and `TASK-296`, still `blocked` · EPIC-014's conversion work,
which runs concurrently as the `engine` stream.

> **Every task here is `authority: J2` — human-reserved.** Two are `class: decision` and need owner
> rulings, not implementations. **This Plan is not a candidate for an unattended run**: a J2 task parks
> rather than executing, so a night run against this sprint would park 4 of 4 and deliver nothing
> (L-111's shape, refused at pre-flight rather than discovered mid-run).

## Plan

### T1 — Teach the rollup checker to compare agreement, and the reaper which Plan it ran `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/lib/check-night-run-rollup.sh` · `scripts/night-run.sh` · `evals/run-night-run-rollup-fixtures.sh`
Depends-on: none
Cites: TD-112 · L-178 · L-174 (the same class one sprint earlier, by a different route) · L-166 · SPRINT-089's committed rollup artifact (the motivating case — read, never modified)
Tier **G**, and **the discrimination bar applies twice**: the checker is a guard, and the reaper is a
guard too because it *produces* the field the checker reads. L-174 named exactly this asymmetry and its
fix still shipped a defect — fixtures were written for the derivation while the bug moved upstream, to
*which file* the derivation was handed. So the fixture must point at the **real committed artifact**,
not only a synthetic one (L-166).

**Acceptance:** a rollup whose terminal state contradicts its own per-task lines FAILs, and the reaper
writes into the Plan the run was pointed at rather than one it inferred.

**DoD:**
- [ ] `check-night-run-rollup.sh` FAILs a rollup whose `terminal ·` state contradicts the per-task lines in the same file — *Verify: a `parked` line under `PLAN_EXHAUSTED` is the motivating case and must FAIL with its own named finding*
- [ ] The **SPRINT-089 artifact is the retained fixture** — *Verify: pointed at the real committed rollup, not a synthetic reconstruction (L-166); retained, not deleted with the prototype (TD-012)*
- [ ] The reaper writes into the Plan the run was actually pointed at — *Verify: a run pointed at sprint A leaves no line in sprint B's log; the SPRINT-089 cross-write is the case that must not recur*
- [ ] Both guards discriminate — *Verify: seed a break in the checker AND a break in the reaper, separately; each reddens its own case while a sibling control stays green (L-142), seeds verified landed by `git hash-object` under ONE convention (L-169)*

### T2 — Stop stamping a wall-clock date into the generated knowledge index `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `scripts/gen-index.sh` · `docs/knowledge-index.md`
Depends-on: none
Cites: TD-111 · SPRINT-090 (the run that parked its own close on this) · ADR-009
Tier **G**. A daily false FAIL is the noise that trains a reader to skim the failure list — and combined
with TD-110 it converts into a **refused overnight launch**, because the launcher dies on a red gate.
The mode most likely to cross midnight is the one this epic is about. Reproduced live: after rollover
the sole diff was `last_updated:` advancing by one day on an otherwise unchanged tree.

**This stream owns `gen-index.sh` and `docs/knowledge-index.md` exclusively** (§ Decisions D1).

**Acceptance:** the index does not go stale from the passage of time alone.

**DoD:**
- [ ] `gen-index.sh --check` returns 0 on an unchanged tree **across a midnight boundary** — *Verify: exercised against a simulated rollover, not argued from the code*
- [ ] The generator's "Idempotent" claim is true of the **whole file**, not only the marked region — *Verify: two consecutive runs on an unchanged tree produce byte-identical output*
- [ ] A genuine content change still reddens the check — *Verify: the sibling control that proves the fix removed the false positive without removing the guard (L-142)*

### T3 — Make the launcher's gate precondition visible, and rule on declared exceptions `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `skills/orchestrator/references/night-run.md` · `scripts/night-run.sh` (only if the ruling says so)
Depends-on: none
Cites: TD-110 · L-179 · L-151 (a decision its reader cannot reach is not a decision)
Tier **P** for the wording, and the ruling half is a **decision, not a fix**. The launcher dies on any
non-zero gate exit and `grep -n bypass` is empty — so a Plan whose purpose is *repairing a gate FAIL*
can never run, which SPRINT-090 hit for real. The wording half is cheap. The ruling half is not: the
gate's whole job is refusing to run on a red tree, so permitting gate-repair work **trades a guard for
a convenience**.

**Acceptance:** the precondition is stated where the checklist is read, and an owner ruling exists on
named pre-approved exceptions.

**DoD:**
- [ ] Part 1's checklist states the green-gate precondition **where the checklist is read** — *Verify: a reader following the checklist top to bottom meets it; today it lives only in `scripts/night-run.sh` (L-151 — a decision its reader cannot reach is not a decision)*
- [ ] An owner ruling is recorded on whether a run may fire against a **named, pre-approved** failing check — never a blanket `--force` — *judgment tick: this is a ruling, and recording it is the deliverable*
- [ ] If the ruling permits an exception, the mechanism is narrow by construction — *Verify: a named check only; a blanket bypass flag is out of scope by the ruling's own terms*

### T4 — Rule pre-flight item 3's wording against a declared `J2` `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `skills/orchestrator/references/night-run.md` · `.claude/CONTEXT.md` (only if the ruling moves the vocabulary)
Depends-on: none
Cites: TD-109 · SPRINT-090 D4 (and its correction) · the two definitions in tension at lines 46 and 58 of this task's own Layers file
Tier **P**. **SPRINT-090's D4 ruled the permissive reading and its justification was later corrected:
only ONE of three cited mechanisms is genuinely unreachable under the strict reading, and `AFK-safe`
and `J2` are defined as *opposites* in the same document, which cuts the other way.** So this is a
genuine ambiguity between two defensible readings, and **D4 must not be inherited as settled
precedent** — re-derive before relying on it.

**Acceptance:** item 3 says what the machinery does, and the two definitions no longer contradict.

**DoD:**
- [ ] Item 3 says what the machinery actually does — either a declared `J2` that parks satisfies it, or it does not and `TASK-301`'s Plan shape is invalid — *judgment tick: a ruling between two defensible readings*
- [ ] The ruling is recorded **where the checklist is read** — *Verify: not in a transcript or a commit message (L-151)*
- [ ] `AFK-safe` and `J2` are reconciled — *Verify: the two are no longer defined as opposites while one is said to permit the other; whichever way the ruling goes, both definitions state it consistently*

## Owner-action checklist
- [ ] Sign **G1 + G2** and record `gates_signed: G1,G2 @ <sha>` in this file's frontmatter. Absent means NOT signed and must never be read as approval (L-099).
- [ ] **Two rulings are the deliverable, not a step toward one** — T3's exception policy and T4's item-3 reading. Both are `class: decision`; neither can be discharged by an implementation.

## Decisions (pre-locked)

- **D1 — this stream owns `scripts/gen-index.sh`, `docs/knowledge-index.md`, `scripts/night-run.sh`,
  `scripts/lib/check-night-run-rollup.sh`, `evals/run-night-run-rollup-fixtures.sh` and
  `skills/orchestrator/references/night-run.md`** for the sprint's duration. The `engine` stream owns
  `scripts/qa-check.sh` and the rest of `evals/`. Cross-stream overlap is coordinated, never
  parallel-built (CONTEXT.md § Sprint model).
- **D2 — the `engine` stream's ADR writes will regenerate `docs/knowledge-index.md`** as a derived
  artifact while T2 is changing how it is generated. That is expected: the *file* is derived, the
  *generator* is this stream's. If T2 changes the file's shape, the other stream re-runs the generator
  rather than hand-editing — a generated view is never hand-edited (ADR-009).
- **D3 — SPRINT-090's D4 is NOT inherited.** T4 re-derives it. A correction landed on its justification
  after the fact, and a ruling whose reasoning was shown wrong in two of three parts is not precedent.

## Assumptions

- **A1** — The false-`PLAN_EXHAUSTED` artifact is committed and reproducible. *Confirm: quoted in
  SPRINT-089's log; re-derive against the real file at G2 rather than inheriting this line.*
- **A2** — `night-run.sh` dies on any non-zero gate exit and no bypass exists. *Confirm: re-run
  `grep -n bypass` and read the precondition's own line at G2 — it was true at SPRINT-090 and this
  sprint may itself change it.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-093-close-the-autonomy-guard-gap.md`, rendered
> from `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never
> here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the four buckets to their durable homes (STANDARD §10). -->
