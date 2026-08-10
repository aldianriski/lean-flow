---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

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

## v1.34.0 — Make Room (2026-08-10)

MINOR — SPRINT-060, **4 of 5 units**. Three tasks were written to confirm something and ended up
overturning it. The sprint's real output is four corrected beliefs, two of which had been sitting in
the ledger for sprints.

**What changed for you:**

- **`CONTEXT.md`'s cap moves 130 → 150** (ADR-017). The task was written to delete duplicated prose —
  TD-006 and L-008 have both described the file as "accreting its satellites' prose" for sprints.
  Diffed section by section, **there was none**: every section touching a satellite's territory already
  ends in a pointer, and the duplication runs the *other* way (README summarises CONTEXT and defers to
  it as SSOT). What actually drives growth is **0.83 lines per sprint of promoted rules** — the
  learning loop depositing durable rules where multi-flow ones belong. The file was at its cap because
  the mechanism works. Kept **hard** on purpose: the forcing function is what produced the measurement.
- **A soft cap can no longer be grandfathered.** ADR-015 ruled the grandfather list records hard-cap
  breaches only, and its own Consequences admitted "nothing enforces rule 2 yet". It does now, with a
  named finding and two fixtures differing in exactly one variable. Failing the rule deliberately does
  *not* suppress the soft-cap report the rule points at.
- **`loop-hygiene-prd.md` is `superseded`.** It had read `current` since July — not because anyone
  judged it current, but because nobody had looked. Nothing moves: §11 archives a superseded doc only
  once nothing live cites it, and five live surfaces cite this one. The corpus just stopped saying
  something untrue about itself.

**For maintainers — the gate's cost is not where two sprints of work assumed it was.** Sections 1–11
were measured **directly** for the first time (two samples, instrumented copy, shipped script untouched
and verifiably byte-identical). The 66/34 split is confirmed at 61–64%. But the split was never the
interesting number: **section 4 alone — knowledge metadata, ADR-009 — is 45–49% of the entire gate**,
75–76 s, larger than all fifteen eval harnesses combined, while seventeen other sections sum to ~14%.
It is also the gate's most *stable* component while the harness half swings 16%. TD-046 is resolved by
this measurement and `TD-050` files the real cost centre, with an explicit warning not to reach for the
obvious narrowing. Gate total re-taken: 130 s @ 131 checks → 154–169 s @ 136.

**Housekeeping:** `L-111` filed (a task's acceptance can depend on a decision no gate has taken yet) and
**`L-107` bumped to count 2** — it recurred inside the sprint that promoted it, one level down. Both it
and `L-108` (count 3) are now promotion-eligible, which the cap raise finally makes possible. `TD-050`
filed, `TD-046` resolved. Three follow-ups (`TASK-188` carried, `189`, `190`). CHANGELOG rotated.
Gate 134 → 135 checks, doc-caps fixtures 7 → 9.

**T5 did not land, and says so.** Exercising the night-run reaper on a genuinely partial Plan needed a
run that stops mid-Plan; the run mode was ruled interactive at G2 — after the Plan froze — which
foreclosed the only vehicle it had. Carried forward with its acceptance explicitly unmet rather than
ticked against its DoD's escape clause. That tension is now `L-111`.

---

_Older releases (**v1.33.0** and earlier) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
