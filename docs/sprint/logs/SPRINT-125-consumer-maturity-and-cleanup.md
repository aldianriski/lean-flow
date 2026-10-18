---
sprint: 125
slug: consumer-maturity-and-cleanup
owner: Maintainer
last_updated: 2026-10-18
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-125 — Execution Log

> Append-only companion to [`../SPRINT-125-consumer-maturity-and-cleanup.md`](../SPRINT-125-consumer-maturity-and-cleanup.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-18 | promote | plan locked, governance signed, nine members: EPIC-022 S1, consumer maturity and cleanup
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion (count≥2, promoted:no): none due. L-210 is the only active entry (count 1). Two routes agree: the heading
  census and the engine's S10.PROMOTION PASS.
- ☑ TD aging (≥3 sprints unaddressed): 131 of 133 open rows, counted against sprint 125 (133 − 2 filed at 124). Newly aged and
  named for re-review: TD-247 · TD-248 (filed at 122). No open row is `high`. Eleven aged rows ride this sprint (`1a29d155`).
- ☑ doc-aging (§11 retention + §2 caps): no cap breach (`check-doc-caps.ts`: 79 PASS, three `retain` dispositions). The
  `adlc-epic-sequencing.md` disposition names EPIC-015's close as its revisit point, which is now due; it is folded into TASK-434.
  §11: no TD deletion is due (engine S11.TDDELETE PASS; TD-168 is due at 127). The store prune is re-checked by the engine
  against this file below.
- ☑ epic rollup currency: none. EPIC-022 is the only active epic, and it has no closed member. ☑ epic coverage: EPIC-022 is
  fully covered (8 open = 3 → tasks + 5 → next slice). ☑ handoff ledger: none.
Size check: 3 M + 6 S, no `L`. TASK-422 (needs-info) and TASK-427 were ruled by popup and flipped to `ready` in `8035702b`,
before the move (`sprint(125): promote`). Epic opened in the same commit. The Log is created at promote, per TASK-422's ruling.

### 2026-10-18 | gate | G1 + G2 signed by the owner (two popup rounds), attended sprint-bulk in parallel waves
Recon: four read-only `Explore` passes (sonnet), covering T4 · T7 · T2+T3 · T1+T5+T6+T8+T9. G1: goals are the Plan's Acceptance lines.
Sizes are 3 M + 6 S, with no split. Out of scope as in § Scope. Every member is `origin: manual`, so each got the full checklist.
G2 rulings (popup):
- **T3 (TASK-422): procedure only.** The template, promote, handoff and CONTEXT wording create the log at promote. STANDARD
  §2/§9's "lazily, at the first entry" is read as the latest point the log must exist. The spec, the engine (S9.TWOFILES) and
  ADR-014 are untouched, and leg 2g already FAILs a log-less open sprint.
- **T7 (TASK-432): narrow tighten + spec 0.16.0.** S4.NEGATIVE FAILs only when every Negative mention is a denial ("no
  negatives", or "none" / "n/a" right after the label). Today 0 of 53 ADRs would newly fail. This is a behaviour-change ruling
  recorded under ADR-034; §15 counts a tightened rule as MAJOR in meaning, which at 0.x is a MINOR bump. S11.TDDELETE gets a wider
  extractor plus a named `not judged` note, which moves no verdict and needs no bump (94 of 103 historical resolved-row shapes
  extract empty today).
- **T8 (TASK-433): explicit post-write checklist** in migration-map.md, which works with no bun and no `scripts/`.
- **Run shape: parallel waves.** Wave A runs in isolated worktrees: T1 · T5 · T6 · T7 · T8. Wave B is sequential, T2 → T3 → T4.
  T9 runs last and is exercised by the close release.
Designs that need no ruling: T2 adds "on the box's first line" plus a case pair in `run-by-reference-fixtures.ts`. T4 adds one
lean-flow-tooling note at the top of night-run.md and makes 7 R1 rewords. T5 adds the live-checkout row and the AFK+J0/J1 offer
rule within 139 lines. T6 gives CODE_OF_CONDUCT and QA-TESTCASE a header; BUG and DESIGN are exempt, and AGENTS keeps its footer.
T9 adds step 3b.
Review depth: T7 is Consequential G, so it gets seeded breaks, a `cmp` restore and a worktree-isolated Codex review. Every other
task gets one scoped sonnet reviewer.
consequence · T1 · behaviour: none · governance: low (epic status, ledger rows)
consequence · T2 · behaviour: low · governance: material (shipped tick wording)
consequence · T3 · behaviour: low · governance: material (shipped template + promote procedure)
consequence · T4 · behaviour: low · governance: material (shipped skill wording)
consequence · T5 · behaviour: low · governance: material (shipped /prime rule)
consequence · T6 · behaviour: low · governance: material (shipped templates)
consequence · T7 · behaviour: material (adopter verdicts) · governance: material (spec 0.16.0, ADR-034 ruling)
consequence · T8 · behaviour: low · governance: material (shipped migrate procedure)
consequence · T9 · behaviour: low · governance: material (shipped release procedure)

### 2026-10-18 | scope-change | Plan meta corrected after the preflight HALT; TASK-434 box 1 re-scoped from archive to close-in-place
**What broke.** The pre-dispatch preflight HALTed (base-ref PASS, waves computed). Two separate causes:
1. Every task's `Layers:` named `CHANGELOG.md` and `TECH-DEBT.md`, and four named the bare `evals/`, so parallel tasks read as
   unowned overlaps.
2. T9's `Depends-on: T1–T8` range was not parsed, which put T9 at rank 0 alongside wave A.

Recon also showed that §11 cannot archive EPIC-006 · 008 · 009 · 011 · 012. Archiving needs `status: closed` **and** every
Closed-when ticked, and the five have unticked conditions and no members. The precedent is EPIC-010 · 013, closed in place.
**Impact.** These are Plan meta edits only. No member's `## Done when` changes except TASK-434's box 1:
- `CHANGELOG.md` · `TECH-DEBT.md` leave every `Layers:` and become coordinator-owned (D1).
- `evals/` narrows to each task's exact harness and fixture paths.
- T9 lists T1 to T8 explicitly.
- T3 gains `skills/handoff/SKILL.md` · `.claude/CONTEXT.md` (both say "create lazily").
- T7 gains `spec/STANDARD.md` · `spec/CHANGELOG.md` · `docs/architecture/overview.md` (spec 0.16.0 and its quoted version).
- **TASK-434** box 1 becomes: closed in place, superseded → workdoo, with no archive move.
**Re-confirm G2.** These follow from the rulings signed above. They narrow the bounds and add no scope; the owner confirmed by
signing the run shape.
