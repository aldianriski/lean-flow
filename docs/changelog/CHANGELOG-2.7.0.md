---
owner: Maintainer
last_updated: 2026-10-19
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.7.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.9.0 release** (2026-10-19). §11 keeps the
> current and previous minor inline (2.9.x and 2.8.x), so cutting v2.9.0 pushed v2.7.x out.

## v2.7.0 — a phased roadmap with row coverage (spec 0.17.0) (2026-10-18)

**MINOR** — ships SPRINT-126 (Roadmap and Traceability). **Upgrade step:** spec 0.17.0 is MINOR carrying MAJOR meaning (§15): a
`roadmap.md` outside `docs/product/` (with neither `docs/product/roadmap.md` nor the legacy `docs/roadmap.md` present) is now flagged
by `S2.R-PLACEMENT` — re-run `sh conformance.sh <repo>` and move or rename it. Restart the session after installing.

### SPRINT-126 — Roadmap and Traceability (2026-10-18)

EPIC-022's second slice: a repo can write a phased delivery plan and see which rows nothing is delivering. **Spec 0.17.0.**

**Consumer-facing:**
- **New `roadmap.md.template`** for a phased delivery plan at `docs/product/roadmap.md`, created lazily when a delivery sequence
  spans two or more sprints or epics. Each row of its table carries a `Status` (done · active · planned) and a `Covered by` cell
  naming the tasks, the epic or the next slice that delivers it.
- **Spec 0.17.0 — MINOR carrying MAJOR meaning (§15).** STANDARD §2 gains the `product/roadmap.md` row (legacy `docs/roadmap.md`,
  matched second) and a **roadmap coverage** rule: an `active` row must be covered by an open task, an active epic or a named next
  slice; `planned` rows are exempt. **Upgrade step:** with neither file in place, a `roadmap.md` elsewhere (outside `docs/product/`)
  is now flagged by `S2.R-PLACEMENT` — move or rename it. A root `ROADMAP.md` is not flagged.
- **`/prime`, `/triage` and the promote checklist report uncovered active rows** through the same procedure as epic coverage
  (unmarked · stale task · epic not active). Promote warns for the owner to sign and never refuses on a roadmap row.
- **`/task-decomposer --roadmap <row>`** decomposes a single row, reading its outcome, dependencies and acceptance evidence as
  settled context, and tells you what to put in its `Covered by` cell — it never edits the roadmap. `/flow`, CONTEXT and README
  name the roadmap as a feed source.

**Maintainer-side:** EPIC-022 Closed-when 4 delivered. TASK-424 · TASK-425 pruned (§11).

---
