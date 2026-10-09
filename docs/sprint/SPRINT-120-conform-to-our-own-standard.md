---
sprint: 120
slug: conform-to-our-own-standard
owner: Maintainer
last_updated: 2026-10-09
status: closed
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
  · `evals/run-handoff-state-fixtures.sh` · `evals/fixtures/handoff-state/`
Depends-on: none
Cites: `TASK-409` · ADR-050 · ADR-034 · L-170 · `S2.R-PLACEMENT` · `conformance.sh`

Consequential G: `conformance.sh` runs this engine for adopters. The scope of the exclusion (every file walk, or placement only) is ruled at G2.

**Acceptance:** a canonical-named file found only inside `.claude/worktrees/` raises no finding, while the same file at a wrong real path still does.

### T5 — Widen §11's live-named rule in spec and engine (TD-206) `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `scripts/lib/conformance-engine.sh` · `evals/run-conformance-engine-fixtures.sh`
  · `evals/fixtures/conformance-engine/` · `TECH-DEBT.md`
Depends-on: T4
Cites: `TASK-410` · TD-206 · STANDARD §11 · `S11.BACKLOG` · `S11.RESEARCH` · ADR-050 · ADR-034 · `conformance.sh` · `docs/sprint/INDEX.md` · `Archive/` (history examples quoted in the Execution Log)

J2: the owner signs the new definition of a live citation. Consequential G plus a spec version bump.

**Acceptance:** a closed task cited in prose by a live file is kept, while one cited only from the archive is still proposed for deletion.

### T6 — Fail a scope-change whose files are outside its `Layers:` (L-229) `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-sprint-by-reference.ts` · `evals/run-by-reference-fixtures.ts` · `evals/fixtures/by-reference/` · `scripts/qa-check.sh`
Depends-on: none
Cites: `TASK-411` · L-229 · `.claude/CONTEXT.md` § Sprint model · `.dod-delta-exempt` (an example quoted in the Execution Log)

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
- [x] Sign T5's new §11 definition (J2). ✓ 2026-10-09: signed; history set re-ruled with data (see the Execution Log)

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
| `scripts/lib/conformance-engine.sh` | T4 · T5 | skips `.claude/worktrees/` on every walk (bracket-safe); §11 store prune keeps a task cited by any non-history doc; a failed scan proposes nothing | High (adopter engine) | engine harness 65 → 98; seeds; Sonnet + Codex |
| `spec/STANDARD.md` · `spec/CHANGELOG.md` | T5 | §11 live-citation definition for task files (J2 signed), spec 0.14.0 MINOR; research rows unchanged | Med | §15 test; rows byte-checked |
| `scripts/lib/check-sprint-by-reference.ts` · `scripts/qa-check.sh` | T6 | `scope-change-outside-layers` behind `--scope-change`; gate leg 14-a | Med | by-reference harness 134 → 147; real-artifact run |
| `evals/` (engine, handoff-state, by-reference harnesses + fixtures; reaper fixtures renamed) | T3 · T4 · T5 · T6 | must-FAIL cases + controls; ledgers generated at test time | Low | each seed reddens only its claim cases |
| `docs/adr/ADR-043…` · `docs/adr/ADR-044…` | T2 | dated Negative / Alternatives appended; Decision untouched | Low | S4.NEGATIVE / S4.SECTIONS 0 |
| `docs/research/logs/` (5 wiring diffs) | T1 | spent SPRINT-103 scaffolds deleted | Low | LAW3 / SCHEMA 0 |
| `TECH-DEBT.md` · `docs/LEARNINGS.md` · `docs/work/` | promote · close | §11 prune (25 TDs, 36 task files); TD-206 resolved; TD-237–242; L-233; L-198 → 4; TASK-413 | Low | census reconciled |

## Retro

**Retrieval check:** three misses, each caught by a gate or a reviewer, never by recalling the rule.
- **L-198** (count 4, after promotion): I read a capped output (the engine's first 3 "found at" hits, all worktree copies) as the whole
  population and called a real finding a false positive.
- **L-151** (a decision recorded where its reader cannot parse it): the promote aging sweep gave a count, and the check reads names.
- **L-229** did NOT recur. The new check (T6) caught my own two scope-change entries at once, which is the point of `automate-into-check`.

**Cost:** about 850k subagent tokens.
- Builders: T4 ≈ 120k · T6 ≈ 195k · T5 ≈ 184k.
- Reviews: Sonnet ≈ 273k · Codex ≈ 78k.
- T1–T3 and T7 ran inline. About 10 VPS runs.
- Delivered 7 of 7 members, so ≈ 120k per member.

**Worked**
- **The outcome holds on two hosts.** lean-flow went from `level: none` (57 findings) to Structural on its own `conformance.sh`, both on a
  fresh VPS clone and on this host with 17 worktrees present.
- **Outside reviews earned their cost.** Every consequential slice had a finding a green harness hid: a bracketed root, Unicode paths, a
  scan that failed toward flagging, and a checker the adopter engine already called.
- **Asking with data changed a signed ruling for the better.** The INDEX-history re-rule came from a census, after J2 had been signed
  on a definition nobody had measured.

**Friction**
- **Host memory:** three local conformance runs were killed for low memory, and two seeds had to move to the VPS. The full engine
  harness takes over 10 minutes on this host.
- **A hung review:** the Codex re-review hung, and the T5 re-review fell back to the coordinator, which is not a fresh context.
- **Scope-change entries:** eight. Four came from G2/preflight; the rest record wrong decompose-time facts (my tiering of T6, the
  "worktree" claim) or are ruling records.

**ADR-034 behaviour-change rulings (recorded):**
- T4: findings sourced inside worktrees disappear.
- T5: the §11 task-file live-citation set. Spec 0.14.0 MINOR.
- T6: kept OFF the adopter engine by an opt-in flag, so no adopter-visible change.

**Buckets (routed):**
- **Shipped:** `CHANGELOG.md` § SPRINT-120.
- **Tech debt:** TD-237–242 filed; TD-206 resolved → TASK-410; the 25 SPRINT-116 rows deleted at promote.
- **Follow-up:** TASK-413 (`origin: close-retro`), the ADR-044/048 Decision ruling that stands between Structural and Gated.
- **Learnings:** L-233 is new (a checker's tier is set by its callers). L-198 → count 4, a post-promotion recurrence that is due a
  disposition re-check at the next promote.

**Pattern candidate:** L-233, above.
