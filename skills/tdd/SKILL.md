---
name: tdd
description: Use when building NEW testable behavior test-first — feature work, business logic, an API surface, a tool wrapper. Runs behaviour-driven red-green-refactor in vertical slices (tracer bullet, then one test → one implementation → repeat). Do not use to debug an existing failure or fix a bug — use /diagnose (it already writes the regression test first). Not for docs, config, or throwaway spikes.
argument-hint: "[behaviour / feature to build test-first]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
version: "0.1.0"
---

# tdd

Behaviour-driven test-first development. Build in **vertical slices**: one test → one implementation
→ repeat. Each test responds to what the last cycle taught you.

For fixing a bug, use `/diagnose` (it writes the failing regression test before the fix). This skill
is for *new* behaviour.

## Philosophy

> Tests verify **behaviour through public interfaces**, not implementation details. Code can change
> entirely; the tests shouldn't.

- **Good test** — integration-style, exercises a real code path through the public API, reads like a
  spec ("user can checkout with a valid cart"). Survives refactors because it ignores internal shape.
- **Bad test** — coupled to implementation: mocks internal collaborators, tests private methods, or
  verifies through a side channel (querying the DB instead of the interface). The tell: it breaks
  when you rename an internal function but behaviour hasn't changed.

When a test is hard to write, or you're unsure **what to mock** / how to shape an interface for
testability → `${CLAUDE_SKILL_DIR}/references/testability.md` (mock-at-boundaries · DI · good/bad
examples · refactor candidates). Unsure **which kind of test** (unit/integ/e2e/perf/load) fits the
task → `${CLAUDE_SKILL_DIR}/references/test-strategy.md`. What makes a test *good* — the quality
checklist + the 70/20/10 pyramid + risk-tier→depth, as **host-project** guidance → `${CLAUDE_SKILL_DIR}/references/test-standard.md`.

## Anti-pattern: the tautological test

An assertion that **recomputes the expected value the way the code does** passes by construction and
can never disagree with the code — `expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand using
the same formula, a constant asserted equal to itself. It is green on day one and stays green through
the bug it was written to catch, so it reads as coverage while testing nothing.

**The tell:** ask *what would have to be wrong for this to fail?* If the only answer is "the language",
it is tautological. Same family as L-058 — a check that can only pass is the failure it exists to
prevent, and a test suite hides it better than a gate does.

**The fix:** the expected value comes from an **independent source of truth** — a known-good literal, a
worked example computed by hand or by a different method, or the spec. If you cannot produce one, that
is a finding about the requirement, not a reason to assert the implementation against itself.

## Anti-pattern: horizontal slicing

**Do NOT write all tests first, then all implementation.** Bulk-written tests verify *imagined*
behaviour — they test the *shape* of things, pass when behaviour breaks, and lock you into a
structure before you understand the implementation.

```
WRONG (horizontal):  RED: test1..test5   then  GREEN: impl1..impl5
RIGHT (vertical):    test1→impl1 · test2→impl2 · test3→impl3 …
```

## Workflow

### 1. Plan (get approval before writing code)
- [ ] Confirm the public interface that's changing.
- [ ] List the **behaviours** to test (not implementation steps), in priority order.
- [ ] **You can't test everything** — confirm with the user which behaviours matter most (critical paths, complex logic), not every edge case.

### 2. Tracer bullet
Write ONE test for the first behaviour → it fails (RED) → write the **minimal** code to pass (GREEN).
This proves the path works end-to-end.

### 3. Incremental loop
For each remaining behaviour: **RED** (write the next test, it fails) → **GREEN** (minimal code to
pass). One test at a time. Only enough code to pass the current test. Don't anticipate future tests.

### 4. Refactor
Only once GREEN — **never refactor while RED**. Extract duplication, move complexity behind simple
interfaces, apply patterns where natural (candidate list → `${CLAUDE_SKILL_DIR}/references/testability.md`). Run the
tests after each refactor step.

## Per-cycle checklist

```
[ ] Test describes behaviour, not implementation
[ ] Test uses the public interface only
[ ] Test would survive an internal refactor
[ ] Expected value comes from an independent source — not recomputed the way the code does
[ ] Code is minimal for this test — no speculative features
```

## Red flags

❌ **Writing all tests up front** — horizontal slicing; produces tests insensitive to real change.
❌ **Testing private methods / mocking internal collaborators** — couples tests to implementation.
❌ **Refactoring while RED** — get to GREEN first; one change at a time.
❌ **Writing more code than the current test needs** — speculative code has no test driving it; the simplicity ladder says stop at the first working rung (CLAUDE).
❌ **Using this to fix a bug** — that's `/diagnose` (test-first regression, then fix).
❌ **Gating the commit on filtered test output** — `… | grep -E '^(OK|FAIL)'` can swallow `FAILED` and let a red suite through; gate on the runner's **exit code** (promoted rule).
