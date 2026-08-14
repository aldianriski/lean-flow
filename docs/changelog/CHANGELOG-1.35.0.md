---
owner: Maintainer
last_updated: 2026-08-14
update_trigger: a MINOR version rotates out of the root CHANGELOG
status: current
---

# lean-flow — Changelog v1.35.0

> Rotated out of the root `CHANGELOG.md` when **v1.37.0** landed (§11: keep current + previous minor
> inline). Older releases → [`CHANGELOG-1.34.0.md`](CHANGELOG-1.34.0.md).

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

