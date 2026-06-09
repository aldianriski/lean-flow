# Feedback loops — the heart of diagnosis

Companion to `/diagnose` Phase 1. A fast, deterministic, agent-runnable pass/fail signal for the bug
is what makes it findable — bisection, hypothesis-testing, and instrumentation all just *consume*
that signal. Build the right loop and the bug is 90% fixed. Be aggressive, be creative, refuse to
give up. Spend disproportionate effort here.

## Ways to construct one — try roughly in this order

1. **Failing test** at whatever seam reaches the bug — unit, integration, or e2e.
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with a fixture input, diffing stdout against a known-good snapshot.
4. **Headless browser script** (Playwright / Puppeteer) — drives the UI, asserts on DOM / console / network.
5. **Replay a captured trace** — save a real request / payload / event log to disk, replay it through the code path in isolation.
6. **Throwaway harness** — a minimal subset of the system (one service, mocked deps) that hits the bug code path in a single call.
7. **Property / fuzz loop** — for "sometimes wrong output", run 1000 random inputs and look for the failure mode.
8. **Bisection harness** — if the bug appeared between two known states (commit, dataset, version), automate "boot at state X → check → repeat" so `git bisect run` can drive it.
9. **Differential loop** — run the same input through old vs new version (or two configs) and diff outputs.
10. **HITL loop** — last resort. If a human must click, drive *them* with a structured script so the loop stays repeatable; captured output feeds back to you.

## Iterate on the loop itself — treat it as a product

- **Faster?** Cache setup, skip unrelated init, narrow the test scope.
- **Sharper signal?** Assert on the specific symptom, not "didn't crash".
- **More deterministic?** Pin time, seed RNG, isolate the filesystem, freeze the network.

A 30-second flaky loop is barely better than none. A 2-second deterministic loop is a debugging superpower.

## Non-deterministic bugs

The goal is not a clean repro but a **higher reproduction rate**. Loop the trigger 100×, parallelise,
add stress, narrow timing windows, inject sleeps. A 50%-flake bug is debuggable; a 1% one is not —
keep raising the rate until it is.

## When you genuinely cannot build a loop

Stop and say so explicitly. List what you tried. Ask the user for one of: (a) access to an
environment that reproduces it, (b) a captured artifact (HAR file, log dump, core dump, timestamped
screen recording), or (c) permission to add temporary production instrumentation. **Do not proceed
to hypothesise without a loop.**

## Performance regressions

Logs are usually the wrong tool. Establish a **baseline measurement** (timing harness,
`performance.now()`, a profiler, or a query plan), then bisect. **Measure first, fix second.**
