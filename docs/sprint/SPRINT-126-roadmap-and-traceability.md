---
sprint: 126
slug: roadmap-and-traceability
epic: EPIC-022
owner: Maintainer
last_updated: 2026-10-18
status: closed
plan_commit: 2f224e6e
gates_signed: G1,G2 @ bed1348d
update_trigger: sprint execute/close events
---

# SPRINT-126 — Roadmap and Traceability

> **Theme:** EPIC-022's second slice. workdoo had to hand-roll a phased delivery plan because lean-flow ships no template, no
> STANDARD row and no way to see which plan row nothing is delivering. This sprint ships the roadmap template and its spec row,
> reports uncovered active rows through the same procedure as epic coverage, and lets the decomposer slice one row — wired through
> every job that names the loop. Consumer evidence (ADR-053).

## Scope

**In:** `roadmap.md.template` + STANDARD §2 row + "Roadmap coverage" rule, spec 0.17.0 (`435`) · coverage reports in `/prime`,
`/triage` and the promote checklist (`436`) · `/task-decomposer --roadmap <row>` + loop wiring (`437`).
**Out (deferred):** a conformance rule for roadmap coverage (owner ruling: skills report, promote warns) · writing anything into
workdoo (EPIC-022's last condition) · EPIC-022 S3 (plan-mode G2 record, git-less lifecycle) and S4 · TASK-322 · 366 · 367 · 402.

## Members

- docs/work/todo/TASK-435-ship-a-roadmap-template-and-its-standard-row.md
- docs/work/todo/TASK-436-report-uncovered-active-roadmap-rows.md
- docs/work/todo/TASK-437-decompose-one-roadmap-row-and-wire-it-end-to-end.md

## Plan

### T1 — Ship the roadmap template and its STANDARD row `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `skills/lean-doc-generator/templates/roadmap.md.template` · `skills/lean-doc-generator/SKILL.md` · `spec/STANDARD.md`
  · `spec/CHANGELOG.md` · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `README.md` · `docs/architecture/overview.md`
  · `scripts/lib/check-count-claims.sh`
  · `docs/work/todo/TASK-435-ship-a-roadmap-template-and-its-standard-row.md`
  · `docs/work/in_progress/TASK-435-ship-a-roadmap-template-and-its-standard-row.md`
Depends-on: none
Cites: `TASK-435` · EPIC-022 Closed-when 4 · ADR-053 (consumer evidence) · STANDARD §2 epic-coverage rule (the precedent)
  · workdoo `docs/product/company-workspace-roadmap.md` (read on a scratch copy, never written)
  · bare names as the member's Done when spells them: `roadmap.md.template` · `product/roadmap.md` (the adopter's path the template renders to;
    this repo creates none)
  · adopter paths the 2026-10-18 placement scope-change names as examples (where an adopter's file may sit; read, never created here):
    `docs/` · `docs/product/` · `docs/product/roadmap.md` · `docs/roadmap.md` · `ROADMAP.md` · bare `roadmap.md`
  · evidence paths named in TASK-435's tick tails (the empirical stray case and the scratch conversion; never created in this repo):
    `docs/plans/roadmap.md` · `scratchpad/workdoo-ro/roadmap-in-template.md`

The template carries workdoo's real shape plus the two columns it lacked. The spec change adds a row and a prose rule, but no
rule-table row, so no adopter verdict moves.

**Acceptance:** a repo can render a roadmap whose every row has a Status and a Covered-by cell, and the standard says when one is
owed and which rows must be covered.

### T2 — Report uncovered active roadmap rows `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/references/epic-coverage.md` · `skills/prime/SKILL.md` · `skills/triage/SKILL.md`
  · `skills/lean-doc-generator/SKILL.md`
  · `docs/work/todo/TASK-436-report-uncovered-active-roadmap-rows.md`
  · `docs/work/in_progress/TASK-436-report-uncovered-active-roadmap-rows.md`
Depends-on: T1
Cites: `TASK-436` · EPIC-022 Closed-when 4 · owner ruling 2026-10-18 (report, promote warns) · ADR-006 (line caps)

One procedure serves epics and the roadmap, so the two reports cannot drift apart. `prime` is at 139 of 140 lines, so its row
merges rather than grows.

**Acceptance:** a stale or unmarked active row shows up in `/prime`, `/triage` and the promote checklist, and a planned row does not.

### T3 — Decompose one roadmap row, and wire the roadmap through the loop `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/task-decomposer/SKILL.md` · `skills/flow/SKILL.md` · `.claude/CONTEXT.md` · `README.md`
  · `docs/work/todo/TASK-437-decompose-one-roadmap-row-and-wire-it-end-to-end.md`
  · `docs/work/in_progress/TASK-437-decompose-one-roadmap-row-and-wire-it-end-to-end.md`
Depends-on: T1
Cites: `TASK-437` · EPIC-022 Closed-when 4 · L-020 (shipping is not wiring) · `docs/product/roadmap.md` (an adopter's file, read by the decomposer, never edited)

The decomposer consumes the roadmap and never edits it. The `Covered by` cell is the owner's to fill, or promote's.

**Acceptance:** `--roadmap <row>` decomposes exactly that row, and every doc that describes the loop names the roadmap.

## Decisions (pre-locked)

- **D1** — Shared files and their order: `skills/lean-doc-generator/SKILL.md` goes T1 → T2; `.claude/CONTEXT.md` and `README.md`
  go T1 → T3. `CHANGELOG.md`, `TECH-DEBT.md`, this file, its log and the member files are **coordinator-owned** (SPRINT-125 D1).
- **D2** — Owner rulings at intake (2026-10-18): the roadmap is `docs/product/roadmap.md`, created lazily · it is a table with
  Status and Covered-by columns · only `active` rows must be covered · enforcement is skills reporting with a promote warning,
  and there is no conformance rule.

## Assumptions

- **A1** — The template count moves to 34 core + 2 non-core = 36. *Confirm: re-census the templates and every count claim at
  T1's G1 by two routes.*
- **A2** — No adopter verdict moves, so spec 0.17.0 is a MINOR bump without MAJOR meaning. *Confirm: `conformance.sh .` before and
  after T1 reports the same verdicts.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-126-roadmap-and-traceability.md`, created at promote with its `promote`
> entry first. Append there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `templates/roadmap.md.template`, `spec/STANDARD.md` · `CHANGELOG.md` (0.17.0), `lean-doc-generator/SKILL.md`, count claims (CLAUDE · CONTEXT · README · overview) | T1 | roadmap doc type + coverage rule; legacy `docs/roadmap.md` | **Med** (placement verdict for adopters) | empirical stray pair · conformance A/B · Codex R1→R2 |
| `references/epic-coverage.md`, `prime/SKILL.md`, `triage/SKILL.md`, `lean-doc-generator/SKILL.md` | T2 | one coverage procedure, two sources; promote warns | Low | 5-row scratch exercise · Codex D1–D6 |
| `task-decomposer/SKILL.md`, `flow/SKILL.md`, `.claude/CONTEXT.md`, `README.md` | T3 | `--roadmap <row>` + wiring | Low | P2 / P2b scratch exercise · Codex D4/D5 |
| 4 manifests, README footer, `CHANGELOG.md`, `docs/changelog/CHANGELOG-2.5.0.md` | close | release 2.7.0 | Low | lockstep PASS · step 3b history hits left |

## Retro

**Retrieval check** — yes. L-224 (re-check with the checker the gate runs) misfired again on the coordinator's TASK-435 tick tails,
after being recorded at the previous close; escalated to a tool (TASK-438). L-130 (a frozen value is a query result) also recurred:
TASK-437's DoD named the example row `P2b` without checking the real roadmap's row tokens.

**Cost** — coordinator + 10 dispatches: 1 recon, 3 builders (+ 1 revise round on T1), 4 Codex passes (`gpt-6-astra`, all accepted
first try). Sub-agent spend ≈ 0.62M tokens (dispatch reports; coordinator excluded) for 3 members ≈ 205k per member. One `QA_FULL`
on the VPS (~110 s, 293/0).

**Worked**
- Codex caught a real adopter verdict move the builder's own conformance A/B could not see (no roadmap in this repo): the new §2
  row made S2.R-PLACEMENT flag any `roadmap.md` outside `docs/product/`. Confirmed empirically before ruling; the owner chose a legacy
  path + MAJOR meaning in one popup.
- Builders ran the whole-tree legs on their branches before review (L-235 → L-224): no prose-density or text-contract surprise at
  merge or system verify this time.
- T2 ∥ T3 on disjoint files merged cleanly; T3 correctly flagged that its wiring text had no reader until T2 merged.

**Friction**
- The coordinator's own tick tails reddened promote-check again (L-224 ×6) — fixed by Cites, escalated to TASK-438.
- Two frozen DoD lines were wrong at freeze: "no verdict moves" (box 2, TASK-435) and the `P2b` example (box 3, TASK-437); both
  needed a scope-change and an owner ruling. Both were checkable at authoring time.
- The scope-change checker reads example paths in log prose as file claims; adopter paths had to be declared on `Cites:` twice.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- None new: both frictions are sightings of promoted rules (L-224, L-130); the response is the tool in TASK-438.
