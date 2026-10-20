# Workflow pack — software implementation

- **Name:** software implementation · **Family:** software-implementation
- **Source:** extracted from lean-flow's `/tdd` skill, plugin version 2.11.0
- **Internal use:** used as the build procedure in 10 dispatched builder runs in lean-flow's own sprints, 2026-09-28 → 2026-10-11
  (SPRINT-109 T2–T4, SPRINT-110 T2–T4, three runs on 2026-10-03, SPRINT-124 T1)

1. **`purpose`** — Build new, testable behaviour test-first, in vertical slices: each behaviour gets a test written before its
   code, and the project's whole test suite passes at the end. Not for fixing an existing failure, nor for documentation,
   configuration or a throwaway spike.
2. **`inputs`** — The behaviour to build, stated by the requester; the code it changes and its public interface; the project's
   test command; and a requester who can say which behaviours matter. No stated behaviour: stop and ask for one. Interface
   unclear: read the code, and ask the requester if it is still unclear. No test command: find how the project runs its
   tests; if there is none, stop and ask. No requester at all: see `escalation`.
3. **`procedure`**
   1. Plan. Confirm the public interface that changes. List the behaviours to test (not implementation steps) in priority
      order. Not everything can be tested, so keep the critical paths and the complex logic, not every edge case → the
      behaviour list, confirmed by the requester (decision).
   2. Tracer bullet. Write ONE test for the first behaviour and run it; it must fail (RED). Write the minimal code that passes
      it (GREEN). This proves the path works end to end → one test and its minimal code (execution).
   3. Incremental loop. For each remaining behaviour: write the next test and see it fail (RED), then write only enough code
      to pass it (GREEN). One test at a time; never write code for a test that does not exist yet → one test and its code
      per behaviour (execution).
   4. Refactor, only while GREEN. Extract duplication, move complexity behind simple interfaces, and run the tests after each
      step → cleaned code with the tests still green (execution).
   5. Close the slice. Run the project's WHOLE test suite once → the exit code and a list of any failing tests (execution).

   Do not write all the tests first and then all the code: tests written in bulk check imagined behaviour, pass when real
   behaviour breaks, and fix a structure before the code is understood. Before leaving each cycle, check that:
   - the test describes behaviour and uses the public interface only, so it would survive an internal refactor;
   - the expected value comes from an independent source (a known-good literal, a worked example computed another way, or
     the spec), not recomputed the way the code computes it;
   - you can name the production change that would fail this test; if only a deliberate decision could, it is a change
     detector, so rewrite or drop it;
   - the code is minimal for this test, with no speculative features.
4. **`capabilities`** — Read and write project files; run the project's test command; ask the requester a question.
5. **`output contract`** — For each behaviour on the list: a test written before its code, and the code that makes it pass. At
   the end, a whole-suite run whose exit code is 0; or, if it is not 0, each failing test listed with whether this change
   caused it.
6. **`verification`** — Run the whole suite once per slice, not every cycle, and gate on the test runner's exit code, never on
   filtered or trimmed output, which can hide a failure. Name every failing test, whether or not this change caused it. A slice
   is done only when the exit code is 0; a failure the slice did not cause is reported, never counted as green.
7. **`escalation`** — Before writing any code, confirm the behaviour list with the requester. If no one can answer, state the
   planned list at the top of the output and proceed with it. A failure this change did not cause goes to the requester. So
   does a behaviour that cannot be tested.
8. **`risk policy`** — Never refactor while a test is failing. Never write a test that only a deliberate decision could fail (a
   change detector), nor one that tests private methods or mocks internal collaborators, since it breaks on a rename that
   changes no behaviour. Never call a slice done on a filtered or partial run.
