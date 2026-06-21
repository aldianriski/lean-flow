# Test strategy — choosing the test type per task

Companion to `testability.md` (which covers *what to mock* + design-for-testability). This one answers
*which kind of test* a task wants — on the **host project's real code**, not lean-flow itself.
Guidance, not law: lean-flow suggests, the owner decides (the no-enforcement spine). `/tdd` writes the
unit/behaviour tests; `/orchestrator` Review raises the suggestion; this doc picks the level.

## The default shape

Lean toward many fast tests low in the stack, few slow ones high up — but **match the test to the
risk**, don't chase a ratio. A test earns its place by catching a failure that matters, cheaply enough
to run often.

| Type | Tests… | Reach for it when… | Cost / caveat |
|---|---|---|---|
| **Unit** | one function/module in isolation | pure logic · branching · edge cases · a bug's regression | cheap + fast; mocks can drift from reality |
| **Integration** | 2+ units across a real seam (DB, queue, API client) | the risk is *between* units — wiring, queries, serialization | medium; needs a real-ish dependency (container/fake) |
| **E2E** | a whole user flow through the running system | a critical path must work end-to-end (login→checkout) | slow + flaky-prone; keep to a few smoke paths |
| **Perf** | latency/throughput against a budget | a hot path with a stated budget, or a regression risk | needs a baseline + stable env; measure, don't guess |
| **Load** | behaviour under concurrency/volume | scaling limits · capacity planning · pre-launch | heaviest; a separate harness, run occasionally not per-commit |

## How to choose (per task)

1. **What breaks if this is wrong, and where?** Failure inside one unit → unit. Failure at a seam →
   integration. Failure only when the whole flow runs → one E2E. Failure only under load/latency → perf/load.
2. **Pick the lowest level that reproduces the real risk.** A unit test at a false seam gives false
   confidence (cf. `/diagnose` Phase 5); an E2E for logic a unit could cover is slow waste.
3. **One tracer E2E beats ten.** E2E is for *the path works at all*, not branch coverage — push the
   branches down to unit/integration.
4. **Perf/load only with a budget.** "Is it fast?" isn't testable; "p95 < 200ms at 100 rps" is.

## Anti-patterns

- **Ice-cream cone** — mostly E2E, few unit: slow, flaky, costly to maintain; invert it.
- **Testing the framework / mocks** — asserting a mock returns what you told it to. Test *your* logic.
- **One type as dogma** — "everything E2E" or "100% unit" both miss; the level follows the risk.
- **Perf numbers with no baseline/env** — noise, not signal. Establish the baseline first.

## In the loop

- `/tdd` — writes unit + behaviour tests test-first (the bulk).
- `/diagnose` — writes the regression test at the correct seam for a bug.
- `/orchestrator` Review — *raises* "which test type?" as a suggestion (`review-scoping.md`).
- This doc — the menu to pick from. New per-test-type skills are **out of scope** (guidance, not tooling).
