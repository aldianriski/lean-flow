---
sprint: 097
slug: guards-that-run-over-the-wrong-set
owner: Maintainer
last_updated: 2026-09-10
status: active
plan_commit: 2789dbd
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-097 — Guards That Run Over the Wrong Set

> **Theme:** Five checkers gate this repository, and each one's *detection logic* is sound while the
> *set it runs over* is not. L-186 named the class at SPRINT-094 and the tree has produced two fresh
> instances since — a `Depends-on:` parser harvesting phantom ids out of its own field's prose, and an
> epic checker resolving another repository's member sprints against this repository's archive. This
> sprint fixes the set, not the logic, and rules the one decomposition question that has been deferred
> three times.

## Scope

**In:**
1. A recorded ruling on whether the five gate-accuracy defects (TD-086 · 087 · 089 · 097 · 105) are one task or five.
2. The dispatch preflight's `Depends-on:` parser anchored to the id list, at **both** call sites (TD-132).
3. One `Layers:` extractor shared by both checkers, under a counted ruling on backticks (TD-142).
4. A verdict-less `qa-check.sh` run reported as a failure rather than as zero failures (TD-143).
5. The epic-state checker's member set scoped to sprints this repository actually owns (TD-144).

**Out (deferred):**
- **Making the gate finish.** TD-090 · TD-117 · TD-143's cost half are untouched; T4 makes
  not-finishing unmistakable, it does not make finishing likely.
- **Fixing the five defects T1 rules on.** T1 produces a decomposition call and files the chosen
  shape. It is not a fix, and the fixes are not in this sprint.
- **Closing the commit-ownership channel.** ADR-040 accepted it symmetrically at SPRINT-096 and
  TD-141 closed on that basis at this promote. The `Sprint: NNN` trailer route stays rejected on size.
- **The `HANDOFF-LEDGER.md` worktree contamination** surfaced by this promote's gate — same family
  (L-170), different checker, not yet filed as debt.

## Plan

### T1 — Rule whether the five gate-accuracy defects are one task or five `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `TECH-DEBT.md` · `TODO.md`
Depends-on: none
Cites: SPRINT-087 close sweep · TD-086 · TD-087 · TD-089 · TD-097 · TD-105
Deferred at three promotes because it is a judgement, not an edit. The pairing is the evidence the
cluster is a cluster: TD-087 (the REACHES half) and TD-097 (the EXISTS half) are the **same script**,
`check-verify-reaches.sh`, filed three sprints apart with neither row aware of the other until
SPRINT-087's close read them together. Ruling it unblocks four rows that have aged every sweep since.

**Acceptance:** A recorded ruling states whether the five are fixed as one "gate accuracy" task or
separately, and the chosen shape is filed as `TASK-NNN` rows in the Backlog.

**DoD:**
- [ ] The five rows are re-read against the current tree, not against their Summary lines — TD-036's Summary was false the day it was filed and TD-101's was false for three sprints (L-091).
- [ ] A ruling is recorded with its reasoning, naming a loser on the side taken.
- [ ] The chosen shape is filed in `TODO.md`, ids derived from the maximum in use with worktrees excluded (L-143 · L-170).

### T2 — Anchor the dispatch preflight's `Depends-on:` parser to the id list `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/dispatch.md` (the `<!-- dispatch-preflight:start/end -->` snippet — the `"Depends-on:"*)` arm AND the indented `D)` continuation arm) · `evals/run-dispatch-preflight-fixtures.sh` · `evals/fixtures/dispatch-preflight/`
Depends-on: none
Cites: TD-132 · TD-043 · L-058 · L-165 · L-168
**Tier G** (ADR-029) — the false HALT is the loud half; the false `PASS shared-file-owned` issued off
a phantom edge is the silent one, and it green-lights a wave with no ownership order at all. The
`Layers:` side of this same snippet was already hardened via `TOK`; `Depends-on:` was left unanchored.

**Acceptance:** The snippet extracted from `dispatch.md` by its own anchors, run against SPRINT-094's
sprint file, yields `PASS wave-computation: T1=0 T2=0 T3=0 T4=0` and no `FAIL cycle-detected`.

**DoD:**
- [ ] Run against **SPRINT-094's sprint file** — the motivating artifact, not a fixture (L-166) — yields the clean wave computation. Today it yields `FAIL cycle-detected: tasks unresolved -> T2 T3` plus three `PASS shared-file-owned … order=T1->T2` off edges that do not exist. — *Verify: extract by anchor and run against `docs/sprint/archive/SPRINT-094-guards-for-what-nothing-reads.md`*
- [ ] A literal `none` short-circuits the field: no id harvested from it or from any line continuing it.
- [ ] **Both call sites fixed, each proved by its own fixture** — the `"Depends-on:"*)` field arm and the indented-continuation `D)` arm run the same bare `grep -oE 'T[0-9]+'`; a fixture exercising only the field arm passes over the leak (L-058). SPRINT-094's prose ran onto continuation lines, which is where most phantom ids came from.
- [ ] Declared ids still parse: `Depends-on: T1 · T2 — but see **D1** (…)` yields exactly `[T1,T2]`, neither more nor fewer.
- [ ] Retained must-FAIL **plus a sibling control that stays green in the same run**, added to the existing harness. — *Verify: `sh evals/run-dispatch-preflight-fixtures.sh`*
- [ ] **Seeded-break discrimination proof**: seed verified landed, artifact still parses, break targeted not a demolition, a landed seed that reddens nothing reported as untested rather than scored as a pass — all under ONE stated hash convention (L-137 · L-142 · L-169 · L-187).
- [ ] **Outside reviewer, dispatched worktree-isolated** (L-165 · L-168).

### T3 — Rule which `Layers:` parser is correct, then make both checkers read one extractor `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `scripts/lib/check-layers-observed.sh` · `scripts/lib/check-layers-completeness.sh` · `evals/run-layers-observed-fixtures.sh` · `evals/run-layers-completeness-fixtures.sh` · `docs/sprint/SPRINT-*.md` (only if the ruling requires backticking existing Plans)
Depends-on: none
Cites: TD-142 · L-108 · L-189 · L-058
**Tier G** (ADR-029) — both subjects are gate checkers, and the ruling changes what "declared" means
for every sprint file in the tree: silent in one direction, noisy in the other. Both files carry the
line *"kept deliberately identical … a parsing rule that differs between them would make one of the
two lie."* One of them is lying.

**Acceptance:** One recorded ruling on backtick-quoting, and both checkers derive their tokens from a
single extractor rather than two that disagree while both claim parity in comments.

**DoD:**
- [ ] The count is derived **before** the ruling: how many live and archived Plans carry unbackticked `Layers:`. Requiring backticks makes every one of them undeclared, so the ruling is taken on a counted basis, not a stylistic one. — *Verify: a second query that agrees (L-108 · L-130)*
- [ ] Both directions closed. The observed checker over-reports on a bare path (loud); the completeness checker's `grep -qF` is a **substring** test accepting a token anywhere in the line — inside a longer path or a trailing comment — which fails *green* (L-108).
- [ ] Both checkers read one extractor; the parity comments are true afterwards or removed.
- [ ] Retained must-FAIL per direction **plus a sibling control** staying green in the same run.
- [ ] **Seeded-break discrimination proof** under ONE stated hash convention (L-169).
- [ ] **A fixture that varies the SELECTION, not the verdict** (L-186) — a Plan reached by the other glob arm, a token declared in the other syntax.
- [ ] **Outside reviewer, dispatched worktree-isolated** (L-165 · L-168).

### T4 — Make a verdict-less `qa-check.sh` run FAIL loudly instead of reading as 0 failures `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `scripts/qa-check.sh` · `package.json` (the `gate` / `test` script chain — its real callers) · `scripts/qa-verdict.ts` (new · TS/Bun per the 2026-09-10 ruling) · `evals/qa-verdict.test.ts`
Depends-on: none — independent of the memory cost itself
Cites: TD-143 · TD-090 · TD-117 · TD-084 · L-120
**Tier G** (ADR-029) — this is the gate's own report, and a run that cannot speak currently presents
as a clean partial, which is the silent-false-negative shape. Scoped to the *reporting*, never the
*cost*: it does not attempt to make the gate finish, it makes not-finishing unmistakable.

**Acceptance:** A `qa-check.sh` run terminating without its `QA-CHECK: N pass, M fail` line is
reported as a failure by whatever invokes it, rather than leaving the caller to infer from "0 FAILs so far".

**DoD:**
- [ ] The wall-clock guard is confirmed **not** to cover this before anything is built on it: SPRINT-096's system-verify printed `PASS qa-budget-default: 520s < 600s` and was then killed for memory at 147 lines, 0 FAIL, no verdict. — *Verify: reproduce the budget guard passing on a memory kill*
- [ ] A verdict-less run is reported as a failure by its caller.
- [ ] **Exercised on a real verdict-less run**, not only a fixture — kill a run mid-flight and confirm the wrapper reports failure (L-007 · L-166).
- [ ] Retained must-FAIL fixture **plus a sibling control** — a run that *does* print its verdict stays green in the same run.
- [ ] **Seeded-break discrimination proof** under ONE stated hash convention (L-169).
- [ ] **Outside reviewer, dispatched worktree-isolated** (L-165 · L-168).

### T5 — Scope the epic-state checker's member set to sprints this repository owns `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-epic-archive.sh` (the two inline member-number globs at :79 and :210, and the `epic-state:` leg — there is no `member_plan()` helper; A3 corrected 2026-09-10) · `evals/run-epic-archive-fixtures.sh` · `evals/fixtures/epic-state/`
Depends-on: none
Cites: TD-144 · ADR-041 · L-186 · L-166
**Tier G** (ADR-029) — a checker reporting a false `close_commit` mismatch on a correct artifact
teaches its reader to disregard the leg, which is how a true finding gets skipped later.
`member_plan()` resolves a member sprint number by globbing `docs/sprint/archive/SPRINT-<num>-*.md`
against **this** repo. EPIC-016's members live in `workdoo` (ADR-041), so `SPRINT-001` resolves to
lean-flow's own `SPRINT-001-ship-and-validate`. The epic file's own comment anticipated the checker
being *blind* to workdoo; nobody anticipated it would *collide* with same-numbered local sprints.

**Acceptance:** `EPIC-016` produces no `epic-state:` findings, and an epic whose members genuinely
live in this repository still produces them.

**DoD:**
- [ ] The false positive is reproduced first, against the real artifact: `EPIC-016` SPRINT-001's cell cites `eb3d9e7` while lean-flow's own `SPRINT-001-ship-and-validate.md` carries `close_commit: b0f2695`; SPRINT-002's cell cites `28c5203` against local `007869e`. — *Verify: `QA_FULL=1 sh scripts/qa-check.sh` names both today*
- [ ] A member row that links **out of this repository** is not resolved against a local sprint of the same number. Whether that means skipping it, or reporting it as unverifiable, is a **ruling** — an out-of-repo member the checker silently ignores is an unchecked row, which is the failure one level down.
- [ ] An epic with genuinely local members still produces `epic-state:` findings — proven by the existing fixtures staying green.
- [ ] **A fixture that varies the SELECTION, not the verdict** (L-186): an out-of-repo member row whose number collides with a local sprint. This is the case with no reader today.
- [ ] Retained must-FAIL **plus a sibling control** staying green in the same run.
- [ ] **Seeded-break discrimination proof** under ONE stated hash convention (L-169).
- [ ] **Outside reviewer, dispatched worktree-isolated** (L-165 · L-168).

## Owner-action checklist
- [ ] Sign the batch **G1 + G2** pass over all five tasks, then record `gates_signed: G1,G2 @ <sha>` in this file's frontmatter. Absence of the field means NOT signed (L-099).
- [ ] Reinstall the plugin before trusting any skill procedure this sprint — the promote session ran skills at base-dir **1.62.0** against a repo manifest at **1.63.0** (L-021).

## Decisions (pre-locked)

- **D1 — `scripts/qa-check.sh` is owned by T4; T5 commits after it.** T5 may need to register a new
  fixture harness in the gate's always-on list. One owner, one commit order — never a plain
  `git add` over the other's WIP (L-042 · L-037).
- **D2 — T1 and T3 are `J2`, T2/T4/T5 are `J1`.** T1 and T3 each *produce a ruling*, which is
  human-reserved by definition; the other three execute inside the frozen Plan. Declared here, never
  inferred (an absent class would read J2 and park).
- **D3 — this sprint carries no `epic:` stamp.** Gate accuracy advances neither EPIC-014 nor
  EPIC-015; guessing one to get a rollup row is worse than standing alone (SPRINT-096's precedent).

## Assumptions

- **A1** — The five gate-accuracy rows T1 rules on are still open and still describe live defects.
  *Confirm: re-read each row against the tree at T1, not against its Summary (L-091).*
- **A2** — TD-142's divergence figures (SPRINT-096's Plan yields 0 declared tokens, SPRINT-095's 14)
  still hold. *Confirm: re-derive both at T3 — SPRINT-094 and 095 were archived at this promote, so
  any path-sensitive figure has moved.*
- **A3** — `member_plan()` is the only place the epic-state leg resolves a member number.
  *Confirm: read the whole leg at T5 before editing; TD-132's Location line named one arm of two.*
- **A4** — The gate's pre-existing red is fully accounted for by this promote's retention pass plus
  the five rows above. *Confirm: re-run `QA_FULL=1 sh scripts/qa-check.sh` after the promote commit
  and reconcile the FAIL count against 33 — a residue nobody predicted is a finding, not noise.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-097-guards-that-run-over-the-wrong-set.md`,
> rendered from `templates/sprint-log.md.template` and created lazily at the first entry. Append
> there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro

<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, this file moves → docs/sprint/archive/ and its log → docs/sprint/archive/logs/ in the
     same commit, plus a one-line entry in docs/sprint/INDEX.md (§11). -->
