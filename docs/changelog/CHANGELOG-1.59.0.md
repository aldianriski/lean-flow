---
owner: Maintainer
last_updated: 2026-09-08
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v1.59.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **SPRINT-096 promote** (2026-09-08).
> Late: §11 keeps current + previous minor inline and **five** had accumulated (v1.58–v1.62), so
> v1.58.0 · v1.59.0 · v1.60.0 were rotated in one pass rather than one per release. Reachable only
> from the root changelog's link line (STANDARD §11).

---

## v1.59.0 — Guards That Cannot Fire (2026-08-25)

MINOR — SPRINT-086, **17 of 18 DoD** — closed at `QA-CHECK: 183 pass, 0 fail`. Three shipped guards
were correct, fixture-proven, and could not fire on the traffic they were built for. Each now reaches
its own subject. **Consumer-facing, and one of these will change what your gate reports.**

**The review-depth gate got stricter, and consumer repos will feel it.** A task recording
`governance:high` or `behaviour:material` work with **no review line at all** used to pass as
`no review line -- nothing to verify`, exit 0. It now FAILs with a named finding. The carrier is a new
whole-line field in the sprint-log schema — `consequence · Tn · behaviour:… · governance:…` — written
when the review skip table is consulted, **independent of whether a review then happens**. That
independence is the whole fix: the old `review ·` line only existed *after* a review, so work whose
review never happened was structurally invisible. Documented in `sprint-log.md.template`,
`orchestrator/SKILL.md` § Review, and `review-scoping.md`. The detector normalises whitespace and field
case before matching, so hand-transcription drift is caught rather than silently ignored — while
staying whole-line anchored, so prose *about* the schema still does not match.

**The QA budget default drops 900s → 450s**, with the arithmetic stated beside it (`600s ceiling −
150s headroom`). The old default could only trip after fifteen minutes in an environment where nothing
survives ten — a guard that could not fire, shipped to prevent exactly the failure it then failed to
prevent. It is now checked at **22 points across legs 2–12** rather than only inside leg 12, and a new
`check-qa-budget-default.sh` runs as a gate leg so the value cannot drift back above the ceiling. It
**fired on live traffic during this sprint**: a 461s run named its three skipped harnesses instead of
dying past an external timeout with no verdict line.

**The gate now completes under load.** It printed a verdict on a process table carrying six live
worktrees, seven agent dispatches and four prior full runs — where three attempts under comparable
load in the previous sprint died at 204 / 117 / 100 lines without ever printing one. Leg 12's dominant
harness adopted the spec-reduction pattern its own siblings already used (196.1s → 143.2s), with the
check inventory verified identical before and after: **50 fixture names, zero removed**.

**Also:** a measurement dispute settled — Round 4's implied ≤4s for two §11 rules was an *arithmetic
residual* for ~35 unnamed rules, not a measurement, reproduced a third time by an independent
mechanism; and leg 12 and the conformance-engine sweep proved **disjoint by target and by profile**,
so two figures that appeared to contradict each other never described the same run. Three `severity:
high` debt rows closed (TD-085 · TD-091 · TD-092); TD-090 remains open and `high` — the gate now sits ~1% under its own budget, so a sprint's own close output can still trip it.

