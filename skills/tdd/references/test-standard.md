# Test-quality standard (host-project guidance)

Guidance the skills **emit to the host project** — lean-flow itself is a markdown library with no test
suite, so this is never a lean-flow gate. Surfaced (never enforced) from `/task-decomposer`'s Testing
Decisions and `/orchestrator`'s Review `qa:` hint. The owner decides. Pairs with `test-strategy.md`
(which *kind* of test) and `testability.md` (design-for-testability).

## The pyramid — spend coverage where it pays

```
        /\        10%  E2E                 — only critical user journeys
       /  \       20%  component / UI       — rendered behaviour, contracts
      /____\      70%  unit · API · integration — the bulk; fast, deterministic
```

Most value per second of CI is at the base. E2E is slow and flaky-prone → reserve it for the few flows
whose failure is unacceptable. If the pyramid is inverted (mostly E2E), the suite is slow and brittle.

## Risk tier → depth (pick the mix per task)

Tag each testable unit by risk, then match depth (from bmad-method's risk-based testing, TASK-039 K2):

| Tier | What | Depth |
|---|---|---|
| **P0** critical / blocking (auth, payments, data loss) | E2E (happy + 1–2 error paths) **+** unit/integration |
| **P1** core behaviour | integration **+** unit |
| **P2** edge / secondary | unit (or a thin integration) |
| **P3** low-risk / cosmetic | unit, or skip with a one-line why |

## The 12-point quality checklist (per test)

- [ ] **Stable selector** — `data-testid` / `data-cy`, never brittle CSS/text selectors
- [ ] **Clear purpose** — the test name states the behaviour it protects
- [ ] **Strong assertion** — asserts the actual outcome, not just "no error thrown"
- [ ] **Controlled data** — fixtures/factories, not shared mutable or production data
- [ ] **Runs independently** — no order dependence; passes in isolation and in any order
- [ ] **No hardcoded sleep** — wait on a condition/event, never `sleep(n)`
- [ ] **Predictable environment** — pinned time/locale/seed; no reliance on ambient state
- [ ] **External deps mocked or controlled** — network/3rd-party stubbed at a boundary
- [ ] **Runs in CI** — not local-only; part of the pipeline
- [ ] **Failure gives a trace** — screenshot / trace / log on failure, so it's diagnosable
- [ ] **Easy to maintain** — reads like a spec; survives an internal refactor (behaviour, not implementation)
- [ ] **E2E only for critical flows** — see the pyramid; don't E2E what a unit test covers

## Regression gate (at Review — a suggestion, not a gate)

Before a task ticks done (bmad K3): its tests **match the risk tier** above, and **ALL existing tests
still pass — zero regressions**. Surface this at Review; the owner enforces it in their CI.
