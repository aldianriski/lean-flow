---
sprint: 120
slug: conform-to-our-own-standard
owner: Maintainer
last_updated: 2026-10-09
status: active
gates_signed: G1,G2 @ 583848b
plan_commit: c226d3a
update_trigger: sprint execute/close events
---

# SPRINT-120 — Conform to Our Own Standard

> **Theme:** lean-flow ships `conformance.sh` to adopters, and on its own tree that check reports **level: none**. No promote since 2.0
> reported it. This sprint clears the six Structural rules that block the level. It also fixes the two engine defects adopters would hit
> too: worktree contamination, and TD-206's over-claiming "nothing live names it". Finally, it turns L-229's thrice-missed prose rule
> into a check.

## Scope

**In:** the spent wiring-diff scaffolds (`406`) · the ADR-043/044 section gaps (`407`) · the reaper `run.log` fixtures (`408`) · an
engine that skips `.claude/worktrees/` (`409`) · §11's live-named rule widened in spec and engine (`410`, TD-206) · the L-229
scope-change check (`411`) · Structural verified on a clean clone (`412`).

**Out (deferred):** the Gated level's `S4.APPEND` (ADR-044/048 Decision edits, to be ruled separately) · the six GAP rules the
engine does not implement · TASK-404 (engine spawn cost, same file) · any `git push` (owner-reserved).

## Members

- docs/work/todo/TASK-406-delete-the-five-spent-qa-check-wiring-diff-scaffolds.md
- docs/work/todo/TASK-407-append-the-missing-adr-043-and-adr-044-sections.md
- docs/work/todo/TASK-408-rename-the-two-reaper-run-log-fixtures.md
- docs/work/todo/TASK-409-make-the-conformance-engine-skip-claude-code-worktrees.md
- docs/work/todo/TASK-410-widen-section-11s-live-named-rule-td-206.md
- docs/work/todo/TASK-411-fail-a-scope-change-whose-files-are-outside-its-layers.md
- docs/work/todo/TASK-412-verify-lean-flow-reaches-conformance-level-structural.md

## Plan

### T1 — Delete the five spent wiring-diff scaffolds `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `docs/research/logs/`
Depends-on: none
Cites: `TASK-406` · STANDARD §1 LAW 3 · §3 · `S1.LAW3` · `S3.SCHEMA` · `conformance.sh`

They are SPRINT-103 hand-off diffs whose content has since landed in the gate. Deleting them clears 8 findings.

**Acceptance:** 0 `S1.LAW3` and 0 `S3.SCHEMA` findings, with nothing live citing the deleted files.

### T2 — Append the missing ADR-043 and ADR-044 sections `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/adr/ADR-043-the-engine-is-the-gates-cost-centre-and-its-consumer-contract-bounds-the-fix.md`
  · `docs/adr/ADR-044-hooks-are-admissible.md`
Depends-on: none
Cites: `TASK-407` · STANDARD §4 · `S4.NEGATIVE` · `S4.SECTIONS` · `S4.APPEND` · `conformance.sh`

Append only, dated, with § Decision untouched (owner ruling, SPRINT-120 decompose).

**Acceptance:** 0 `S4.NEGATIVE` and 0 `S4.SECTIONS` findings, and `S4.APPEND` is unchanged.

### T3 — Rename the two reaper `run.log` fixtures `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `evals/fixtures/night-run-reaper/` · `evals/run-night-run-rollup-fixtures.sh`
Depends-on: none
Cites: `TASK-408` · STANDARD §12(c) · `S12.GENERATED` · `conformance.sh`

They are inputs, not generated output; the reaper takes any path.

**Acceptance:** 0 `S12.GENERATED` findings, with both reaper harnesses at their prior counts.

### T4 — The conformance engine skips Claude Code worktrees `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-conformance-engine-fixtures.sh` · `evals/fixtures/conformance-engine/`
Depends-on: none
Cites: `TASK-409` · ADR-050 · ADR-034 · L-170 · `S2.R-PLACEMENT` · `conformance.sh`

Consequential G: `conformance.sh` runs this engine for adopters. The scope of the exclusion (every file walk, or placement only) is ruled at G2.

**Acceptance:** a canonical-named file found only inside `.claude/worktrees/` raises no finding, while the same file at a wrong real path still does.

### T5 — Widen §11's live-named rule in spec and engine (TD-206) `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `scripts/lib/conformance-engine.sh` · `evals/run-conformance-engine-fixtures.sh`
  · `evals/fixtures/conformance-engine/` · `TECH-DEBT.md`
Depends-on: T4
Cites: `TASK-410` · TD-206 · STANDARD §11 · `S11.BACKLOG` · `S11.RESEARCH` · ADR-050 · ADR-034 · `conformance.sh`

J2: the owner signs the new definition of a live citation. Consequential G plus a spec version bump.

**Acceptance:** a closed task cited in prose by a live file is kept, while one cited only from the archive is still proposed for deletion.

### T6 — Fail a scope-change whose files are outside its `Layers:` (L-229) `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-sprint-by-reference.ts` · `evals/run-by-reference-fixtures.ts` · `evals/fixtures/by-reference/`
Depends-on: none
Cites: `TASK-411` · L-229 · `.claude/CONTEXT.md` § Sprint model

G2 placed it in the by-reference checker (see the Execution Log). Other G (maintainer-only leg).

**Acceptance:** SPRINT-118's real `.sh` → `.ts` scope-change entry FAILs with a named finding, and the edited-`Layers:` control passes.

### T7 — Verify level Structural on the integrated tree `[size: S · risk: low · class: execution · AFK · J1]`
Layers: (verification — no source change)
Depends-on: T1 · T2 · T3 · T4 · T5
Cites: `TASK-412` · STANDARD §14 · `conformance.sh`

Runs both locally and on a clean VPS clone, so host contamination cannot hide a finding.

**Acceptance:** `conformance.sh` prints level Structural or higher on both.

## Owner-action checklist
- [x] Sign G1 + G2 (`/orchestrator sprint-bulk`) and record `gates_signed:`. ✓ 2026-10-09, see the g2 entry
- [ ] Sign T5's new §11 definition (J2).

## Decisions (pre-locked)
- **D1** — `scripts/lib/conformance-engine.sh` is shared by T4 and T5. Owner: T4 lands first, and T5 builds on the merged T4. Both are
  sequenced behind any TASK-404 work, which stays in the backlog this sprint.
- **D2** — `evals/fixtures/` is shared by T3, T4, T5 and T6 at directory level, but each writes a disjoint subdirectory (declared in
  each `Layers:`). Stage per-hunk at each commit.

## Assumptions
- **A1** — Reaching Structural needs zero FAILs on Structural rules; GAP lines do not block. *Confirm: the engine's own level line, at T7.*
- **A2** — Appending a dated section to a decided ADR satisfies §4. *Confirmed: owner ruling, SPRINT-120 decompose.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-120-conform-to-our-own-standard.md`, created at promote (ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. -->
