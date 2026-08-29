---
sprint: 093
slug: close-the-autonomy-guard-gap
stream: autonomy
epic: EPIC-015
owner: Maintainer
last_updated: 2026-08-29
status: active
gates_signed: G1,G2 @ 760dc69
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
Layers: `scripts/lib/check-night-run-rollup.sh` · `scripts/night-run.sh` · `evals/run-night-run-rollup-fixtures.sh` · `evals/fixtures/night-run-rollup/` · `evals/fixtures/night-run-reaper/` (fixture trees, declared per L-100 after the observed-layers leg named them)
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
- [x] `check-night-run-rollup.sh` FAILs a rollup whose `terminal ·` state contradicts the per-task lines in the same file — ✓ **after four passes, each of which fixed a real defect and exposed a different one.** The motivating `parked` line under `PLAN_EXHAUSTED` FAILs with its own named finding. The matrix is now **exact in both directions** against `reap()`'s priority order — verified cell by cell by the third reviewer: `BUDGET_STOP` forbids only what outranks it *and* requires ≥1 `unattempted`; `AUTHORITY_BOUNDARY` likewise for `parked-hitl`/`blocked`; `HARD_FAILURE` and `USER_STOP` stay **unasserted** because a bare non-zero exit produces the former with an empty per-task fingerprint and the latter never reaches `reap()` at all. **And it now reads the right window** — `win()` scopes every check to the *last* `run-complete` block, derived the way `reap()` derives its own append window, so a contradiction in a later block can no longer pass by borrowing an earlier block's terminal claim
- [x] The fixture is **grounded in real committed text**, composited across the two artifacts TD-112's own cross-write bug split apart — *Verify: every line grep-extracted verbatim at test-run time from `SPRINT-089`'s and `SPRINT-090`'s committed logs, with a drift guard that FAILs loud if either source changes shape; retained, not deleted with the prototype (TD-012). **Reworded at execution by owner ruling — see the Execution Log's `scope-change`.** The original demanded "the real committed rollup, not a synthetic reconstruction", which no artifact in this repository can satisfy: SPRINT-089's rollup carries no per-task line at all, and the defect erased its own evidence by splitting every real instance across two files. Reachability is proven separately and is what carries L-166 here — on a live log the reaper writes at column 1, where the guard fires*
- [x] The reaper writes into the Plan the run was actually pointed at — ✓ `find_sprint()` now **refuses ambiguity** (0 or >1 `status: active` files) instead of picking the first match, and a new `--sprint FILE` declares the target. Exercised against the **live repo**, not fixtures: this tree currently has two active sprints, so the ambiguity path is reachable today — the reviewer confirmed a two-active run with no declaration writes to neither log, and a declared target writes only its own while the sibling stays byte-identical
- [x] Both guards discriminate — ✓ **proven four times over, by three different people using three different seeding methods**: the builder reverted each file to its pre-fix blob; the second reviewer used targeted in-place edits; the third used a single-token removal from an alternation. Each reddened exactly its own case with every sibling green. One convention throughout (`git hash-object`), every seed verified landed by hash *and* line count, every restore verified byte-identical. The final windowing seed reproduced the reviewer's own probe precisely — both new cases flipping while all 32 others held

### T2 — Stop stamping a wall-clock date into the generated knowledge index `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `scripts/gen-index.sh` · `docs/knowledge-index.md` · `.gitattributes` (added at execution by owner ruling — the CRLF half of the fix; declared per L-100 rather than left as an undeclared touch)
Depends-on: none
Cites: TD-111 · SPRINT-090 (the run that parked its own close on this) · ADR-009
Tier **G**. A daily false FAIL is the noise that trains a reader to skim the failure list — and combined
with TD-110 it converts into a **refused overnight launch**, because the launcher dies on a red gate.
The mode most likely to cross midnight is the one this epic is about. Reproduced live: after rollover
the sole diff was `last_updated:` advancing by one day on an otherwise unchanged tree.

**This stream owns `gen-index.sh` and `docs/knowledge-index.md` exclusively** (§ Decisions D1).

**Acceptance:** the index does not go stale from the passage of time alone.

**DoD:**
- [x] `gen-index.sh --check` returns 0 on an unchanged tree **across a midnight boundary** — ✓ the date cause is fixed (the candidate is built with the *existing* `last_updated` copied byte-for-byte, so the comparison no longer bakes the date in) **and a second, independent cause of the same symptom was found and closed under this DoD.** The reviewer ruled the coordinator's first verification *not faithful*: it backdated a file that earlier test runs had already left in LF state, never the state git hands out. On a genuinely pristine checkout the check FAILed — `git status` empty, `--check` exit 1 — because `.gitattributes` normalized only `*.sh` and `core.autocrlf=true` delivered this index as **CRLF** (35 CR bytes, one per line) against a pure-LF generator. **The gate was red on a fresh clone of this repo and nobody knew**, because every gate run had a working tree holding generator output rather than git's. Fixed both ways by owner ruling — `gen-index.sh` now compares line-ending agnostically (which reaches existing clones) and `.gitattributes` normalizes this one file (which stops it at source). Verified on the exact failing scenario: forced fresh checkout, CR bytes 35 → 0, exit 1 → 0
- [x] The generator's "Idempotent" claim is true of the **whole file**, not only the marked region — ✓ two consecutive regenerates on an unchanged tree are byte-identical, **and the date is correctly NOT re-stamped** — the field advances only on real content change, so the claim is now true of the frontmatter it previously falsified
- [x] A genuine content change still reddens the check — ✓ **the DoD that matters most here, because the cheap wrong fix is to stop checking** (L-058 wearing a new hat). Proven by a pair, neither sufficient alone: a CRLF-only difference now PASSes, while a one-token edit inside the marked region still FAILs with exit 1 and self-heals to the pristine hash on regenerate. The reviewer separately probed the negative paths — missing file, directory-as-file, empty file, reversed markers — and all fail-safe with named findings rather than silent passes

### T3 — Make the launcher's gate precondition visible, and rule on declared exceptions `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `skills/orchestrator/references/night-run.md` · `scripts/night-run.sh` (the ruling put the launcher in scope) · `evals/run-night-run-gate-exception-fixtures.sh` · `evals/fixtures/night-run-gate-exceptions/` (new retained harness — no existing one covered the launcher pre-flight gate)
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
Layers: `skills/orchestrator/references/night-run.md` · `.claude/CONTEXT.md` (only if the ruling moves the vocabulary — it did not; see the Log) · `TECH-DEBT.md` (declared per L-100 at execution: this ruling is what RESOLVES TD-109, so recording that resolution is part of delivering it, and the promote-time declaration under-named it)
Depends-on: none
Cites: TD-109 · SPRINT-090 D4 (and its correction) · the two definitions in tension at lines 46 and 58 of this task's own Layers file
Tier **P**. **SPRINT-090's D4 ruled the permissive reading and its justification was later corrected:
only ONE of three cited mechanisms is genuinely unreachable under the strict reading, and `AFK-safe`
and `J2` are defined as *opposites* in the same document, which cuts the other way.** So this is a
genuine ambiguity between two defensible readings, and **D4 must not be inherited as settled
precedent** — re-derive before relying on it.

**Acceptance:** item 3 says what the machinery does, and the two definitions no longer contradict.

**DoD:**
- [x] Item 3 says what the machinery actually does — either a declared `J2` that parks satisfies it, or it does not and `TASK-301`'s Plan shape is invalid — *judgment tick: a ruling between two defensible readings*
- [x] The ruling is recorded **where the checklist is read** — *Verify: not in a transcript or a commit message (L-151)*
- [x] `AFK-safe` and `J2` are reconciled — *Verify: the two are no longer defined as opposites while one is said to permit the other; whichever way the ruling goes, both definitions state it consistently*

### T5 — Make the authority leg mode-aware, so it stops failing attended runs `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-authority.sh` · `evals/run-authority-fixtures.sh` · `evals/fixtures/authority/`
Depends-on: none
Cites: TD-123 · L-105 (a guard placed correctly in text and wrongly in time) · L-151 · L-165 (the bypass branch was itself added by an independent reviewer) · ADR-021 · `night-run.md` (the park protocol this leg enforces — read, never modified) · `qa-check.sh` (consumes this leg; the engine stream owns it and this task does not touch it) · T1 · T2 (the motivating attended executions — no dependency either way)
Tier **G**. Added mid-sprint by owner ruling — see the Execution Log's `scope-change`. The leg applies
`night-run.md` Part 0's **park protocol** to every run and never reads the run mode. Parking is what an
*unattended* run does instead of asking; an attended run has an ask channel. So the check inverts on
attended runs, demanding the artifact of an absent ask channel from a run that had one — and because
`qa-check.sh` consumes it, the gate is RED and ADR-021 blocks this sprint's close.

**Declared `J1` while its siblings are `J2`, deliberately:** their rulings are still owed; this one's is
given, leaving execution inside a settled envelope. Declaring it J2 would be circular — the task fixing
the check would be failed by the check it fixes.

**Acceptance:** the park requirement applies where the park protocol applies, and nowhere else.

**DoD:**
- [ ] The `J2` park requirement no longer fails an **attended** execution — *Verify: SPRINT-093 T1 and T2, the real motivating artifacts, pass the leg on the tree as it stands (L-166 — not a fixture built to pass)*
- [ ] The **unattended** case still fails without a park — *Verify: retained must-FAIL; a J2 task executed headless with no park record still FAILs with its named finding*
- [ ] The `authority-j2-park-bypassed` branch survives untouched — *Verify: park + execution + no `owner-ruling` still FAILs. This branch was added after an independent reviewer caught the first version accepting any stale park record (L-165); removing it to simplify the fix would re-open the silent bypass Part 0 step 6 forbids*
- [ ] The fix discriminates — *Verify: seed it and confirm the attended case and the unattended case move independently, siblings green (L-142); seed verified landed by `git hash-object` under ONE convention (L-169)*

## Owner-action checklist
- [x] Sign **G1 + G2** and record `gates_signed: G1,G2 @ <sha>` in this file's frontmatter. Absent means NOT signed and must never be read as approval (L-099). — ✓ signed at `760dc69`. **No fast-path**: every task here is `origin: close-retro`, which never passed the intake grill, so G1 ran its full checklist rather than re-confirming a scope agreement that does not exist. Both assumptions confirmed against evidence first — A1 against the committed SPRINT-089 artifact (log line 194), A2 against `night-run.sh` itself (`bypass`: 0, `--force`: 0, `die_doa` on gate failure present)
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
