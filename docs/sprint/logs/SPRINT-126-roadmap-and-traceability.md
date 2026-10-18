---
sprint: 126
slug: roadmap-and-traceability
owner: Maintainer
last_updated: 2026-10-18
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-126 — Execution Log

> Append-only companion to [`../SPRINT-126-roadmap-and-traceability.md`](../SPRINT-126-roadmap-and-traceability.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-18 | promote | plan locked, governance signed, three members: EPIC-022 S2, roadmap and traceability
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion (count≥2, promoted:no): none due. Every active entry is at count 1; L-235 was promoted at the SPRINT-125 close.
- ☑ TD aging (≥3 sprints unaddressed): 116 of 120 open rows, counted against sprint 126 (120 − 2 filed at 124 − 2 filed at 125).
  Newly aged: none, because nothing was filed at sprint 123. No open row is `high`.
- ☑ doc-aging (§11 retention + §2 caps): no cap breach. No TD deletion is due (TD-168 is due at 127). The store prune is
  re-checked by the engine against this file below.
- ☑ epic rollup currency: EPIC-022's SPRINT-125 row carries `ff04f84`, and its ticked conditions name their closing sprint.
- ☑ epic coverage: EPIC-022 is fully covered (5 open, all mapped). Condition 4 is re-marked here from `→ next slice: S2` to
  `→ TASK-435, TASK-436, TASK-437`.
- ☑ handoff ledger: none.
Size check: M + M + S, with no `L`. The members were filed by `/task-decomposer --epic EPIC-022` (`3378ef5e`, owner-approved),
and the Log is created at promote. Correction to the SPRINT-125 close report: it resolved **15** TD rows, not 18. The CHANGELOG
lists the right 15; the 18 appeared only in the closing summary.
Engine re-check with this file present: S10.TDAGING PASS (116, the same as the ledger count) · S9.TWOFILES PASS. The store prune
found `done/TASK-424` and `done/TASK-425` (closed at SPRINT-123) past retention; both were deleted with owner approval in
`a38180c8`. promote-check 10/0 (two bare adopter paths were declared on Cites:) · dispatch preflight CLEAR.

### 2026-10-18 | gate | G1 + G2 signed by the owner (one popup round); attended sprint-bulk, T1 then T2 ∥ T3
G1: all three members are `origin: decomposer`, so G1 was the fast-path confirm (scope unchanged since intake approval `3378ef5e`).
Sizes M · M · S, with no split.
G2 design:
- **T1.** `roadmap.md.template` is a core template (34 + 2 = 36). STANDARD §2 gets a lazy `product/roadmap.md` row and a
  "Roadmap coverage" prose rule, as spec 0.17.0 MINOR. A2 is confirmed by running `conformance.sh .` before and after. `init`
  never scaffolds the file (§7, create-lazily). The real-input test re-expresses workdoo's 16 rows on a scratch copy. No ADR: the
  doc type is additive and follows the 0.15.0 epic-coverage pattern, so it misses §4's hard-to-reverse bar.
- **T2.** `epic-coverage.md` is generalised in place, because five files cite it by name. `/prime` keeps one `Coverage:` row,
  `/triage` reports in the epic line shape, and promote gains a `☐ roadmap coverage` line (warn only). The test is a scratch repo
  with covered · stale · unmarked · planned rows.
- **T3.** `--roadmap <row-id>` is read-only on the roadmap, and the roadmap is wired through `/flow`, CONTEXT, README and CHANGELOG.
  It is exercised with `--roadmap P2b` on the scratch copy.
- **Owner ruling: no `docs/product/roadmap.md` in lean-flow.** The epics already hold its delivery sequence, so one would be a
  second SSOT. The proof runs on workdoo's real roadmap (scratch) and on a scratch repo.
- **Run shape.** T1 runs first, owning `lean-doc-generator/SKILL.md`, CONTEXT and README first (D1). T2 and T3 then run in parallel
  worktrees with disjoint files. CHANGELOG, TECH-DEBT, the ticks and this log are coordinator-owned.
- **Review.** Each task gets the Codex gauntlet (`gpt-6-astra`). Builders run prose-density, caps and the text-contract harnesses on
  their branch before review (L-235 → L-224). System verify runs on the VPS.
- **Out of scope:** `migrate` mapping a hand-rolled roadmap, and any conformance rule.
consequence · T1 · behaviour: low · governance: material (spec 0.17.0, shipped template)
consequence · T2 · behaviour: low · governance: material (shipped prime/triage/promote procedure)
consequence · T3 · behaviour: low · governance: material (shipped decomposer input)

### 2026-10-18 | scope-change | T1 TASK-435 box 2: spec 0.17.0 moves a verdict (Codex C3, confirmed) — legacy path + MAJOR meaning (owner)
**What broke.** Codex review of T1 (`225fa9ad`, gpt-6-astra) found that S2.R-PLACEMENT reads §2 dynamically, so the new
`product/roadmap.md` row flags any same-named file outside `docs/product/`. Confirmed empirically in T1's worktree: an untracked
`docs/roadmap.md` FAILs `file-outside-canonical-placement: docs/product/roadmap.md`. A root `ROADMAP.md` is not flagged, because
the match is case-sensitive. Box 2 froze "MINOR, no rule-table row, no verdict moves", and that is false.
**Owner ruling (popup).** The row names `docs/roadmap.md` as its legacy path, which is matched second and tolerated with a note.
0.17.0 is declared MINOR carrying MAJOR meaning (§15), with a CHANGELOG upgrade note: a `roadmap.md` anywhere else under `docs/`
is now flagged.
**Impact.** TASK-435 box 2 is reworded to match. T1 takes one revise round, covering C3 plus C1: "stale" must apply only when no
valid coverage remains, since a done task plus an active epic is covered. C6 (CONTEXT.md:104) is TD-252, already filed.
**Re-confirm G2.** The owner confirmed by popup. This adds no new capability.
