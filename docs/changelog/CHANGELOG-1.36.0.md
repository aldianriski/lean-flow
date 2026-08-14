---
owner: Maintainer
last_updated: 2026-08-14
update_trigger: a MINOR version rotates out of the root CHANGELOG
status: current
---

# lean-flow — Changelog v1.36.0

> Rotated out of the root `CHANGELOG.md` when **v1.38.0** landed (§11: keep current + previous minor
> inline). Older releases → [`CHANGELOG-1.35.0.md`](CHANGELOG-1.35.0.md).

## v1.36.0 — Room to Write (2026-08-10)

MINOR — SPRINT-062, **3 of 3 units**, the first member sprint of **EPIC-002 Make Room**. Three
governance signals, and in each case the question was whether anything was listening: a cap that could
not be met, a report with a matcher and no consumer, and a count that turned out to be measuring its
own query.

**What changed for you:**

- **A new doc-kind: `docs/research/logs/<slug>.md`.** When a research question accretes a second
  measurement round, the series now splits into an append-only, uncapped sibling and the decision doc
  keeps the cap. This is ADR-014's sprint Plan/log mechanism applied outside `docs/sprint/` for the
  first time — and it works for the same structural reason: the cap check derives its globs from §2's
  own File cells, and `docs/research/*.md` is non-recursive, so a `logs/` sibling is excluded for free.
  Placement rule only, no template; never name it as a `related:` id, or it dangles the corpus-ref check.
- **§2's Growth rule now tells you how to rule a cap breach, not just to split.** A breach sorts into
  **drift** (removable content past a reachable cap → trim or split) or **a cap that was never
  reachable** (the standard mandates content the number never budgeted for, or the growth is an
  append-only series). They need opposite actions and the report cannot tell them apart. The tell is a
  breach where every route back under the cap runs through deleting signal or re-wrapping prose.
- **The promote governance check now reports cap breaches.** `doc-aging` reads **two** sources — §11's
  retention triggers *and* every §2 cap breach — where it previously enumerated only §11's four
  triggers. If you run `promote`, you will now see breaches you were never shown before. §11's ledger
  owns retention; §2 owns caps; restating a §2 cap figure inside the checklist is now prohibited,
  because a copied number is a second SSOT that drifts from the row it copied.
- **§11's LEARNINGS row documents a trap that had been silently misleading readers.** The collapse
  *consumes the trigger it fires on*: a promoted entry becomes `[status: promoted]` plus a pointer, so
  `promoted: yes` is never the stored form. Grepping for it returns zero on a perfectly healthy corpus.
  Count by `[status: promoted]`, position-anchored.
- **`docs/research/qa-gate-timing.md` went 223 → 87 lines** with all three measurement rounds preserved
  verbatim in its new log. No measurement was deleted to meet a number.

**Fixed:** `.claude/CONTEXT.md` claimed **32** core templates against 33 on disk — the count-claim
checker matches the phrase `N canonical doc templates`, which CONTEXT does not use, so no matcher ever
reached it.

**Known gaps, named rather than closed:** the promote doc-aging fix is procedural text, and nothing in
`evals/` exercises skill prose — so it has no retained must-FAIL fixture and a future edit that
re-narrows it goes uncaught (`TD-052`; the same gap covers every procedural gate: G1, G2, the promote
checklist, close's §11 pass). `TODO.md` (210) and two research docs remain over their soft caps,
scoped to `TASK-196` and `TASK-199`.

---

