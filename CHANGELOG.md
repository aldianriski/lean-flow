---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

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

## v1.35.0 — Named, Not Answered (2026-08-10)

MINOR — SPRINT-061, **3 of 3 units**. Every task answered a question SPRINT-060 stated and left open.
The sprint's most useful output is a measurement that found nothing — and that turned out to be the
answer rather than a failed search.

**What changed for you:**

- **The documentation standard gains a rule: `DOCS_Guide.md` §10, "Every hygiene rule gets a matcher."**
  A hygiene rule earns either a lint in your project's quality gate or a named checklist line in a
  close/promote sweep; a rule with neither is aspirational and gets deleted or wired. Documentation is
  a legitimate answer — calling it a gate is the error. It had been sitting live inside a research doc
  marked `superseded`, which is exactly what made it unreachable, and it was reworded on the way out:
  the original named our own `qa-check.sh`, a path no consumer has.
- **Nothing else here is consumer-facing.** The other two tasks are internal doc rulings and a
  measurement. Called out because a MINOR bump usually implies more.

**For maintainers — section 4 of the QA gate has no cost centre, and that closes the search.** TD-050
asked to split it across "freshness vs dangling refs vs completeness". Those are not three separable
jobs: dangling refs and completeness are computed *together* inside the same two loops, and the row
omits the corpus setup they both depend on. Measured by loop instead, across two samples on an
instrumented copy (shipped script SHA-256 identical before and after):

| slice | s1 | s2 | share of §4 |
|---|---:|---:|---:|
| index freshness | 34.4s | 27.7s | 35–40% |
| corpus + id-universe setup | 1.5s | 1.2s | ~2% |
| 4a LEARNINGS | 26.3s | 23.8s | ~30% |
| 4b corpus | 23.4s | 26.0s | 27–33% |
| **section 4** | **85.6s** | **78.8s** | **51.5% of run** |

Three comparable thirds. Deleting the largest buys ~19% of the gate — and the largest is the
whole-corpus index read TD-050 itself says not to cheapen. The cheapest target and the most protected
one are the same object, so any real cure is structural rather than a narrowing of what is checked.

**Also:** both sibling loop-hygiene research docs are now `superseded` — reached independently, and by
opposite routes: `workstreams.md` because its proposals shipped, `findings.md` because one of its
*observations was overturned* (its row 24 reports duplication in `CONTEXT.md` that SPRINT-060 T1 went
looking for and did not find). Two learnings promoted at promote: L-108 → `CONTEXT.md` § Gates ("a guard
is matched by shape, not by substring"), L-107 → `TECH-DEBT.md` header. Four aged TD rows re-reviewed
and held, recorded on the rows themselves.

**Filed against ourselves:** the promote governance scan reported doc-aging clean while three §2
soft-cap breaches printed on every gate run — a report with a matcher and no consumer, which is the
inverse of the rule shipped above and invisible to both. L-106 → count 2; TASK-192 and TASK-193 filed.

---

_Older releases (**v1.34.0** and earlier) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
