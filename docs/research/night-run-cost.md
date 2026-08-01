---
owner: Maintainer
last_updated: 2026-08-01
update_trigger: A new calibration row lands, or a cost-reduction change is measured
status: current
id: night-run-cost
tags: [process, tooling]
domain: governance
related: L-073, L-077, TD-023
---

# Research — where does an unattended run's money actually go?

> **Question.** SPRINT-043 cost $16.54 for two ~25-line changes across 64 turns, against SPRINT-041's
> 15 turns for comparable work. Which driver dominates, so a cut targets the real one?
> **Verdict.** **Cache reads dominate, and turns drive cache reads — so the cost lever is turn count.**
> Roughly 40% of the turns were spent on permission denials the run could not act on. The fix already
> shipped this sprint as T2's bare-invocation rule; the second-order fix is to stop retrying a denial.

## Why this matters

A 6–8h window has ample wall-clock — 22 minutes bought two units — but at $8.27 per unit delivered a
full night is a $300-class decision. Scaling throughput before knowing the driver is how an unattended
run becomes expensive, so this had to be measured before any "more tasks per night" work.

## Options considered

- **A — output generation** — the run wrote a lot of code and prose. *Trade-off:* the obvious suspect,
  and the easiest to attack by asking for terser work.
- **B — fan-out substrate** — every dispatched agent re-pays the full project context before starting
  (ADR-010's cost term, L-073). *Trade-off:* real, but bounded by agent count.
- **C — turn count × context size** — each turn re-reads the accumulated context, so cost grows with
  how many turns happen, not with what they produce. *Trade-off:* least visible; nothing in the
  interface displays it.

## Findings

- **Cache reads are 139× output.** 26,497,076 cache-read tokens against 190,846 output tokens and
  13,198 real input tokens — a ~2,000:1 ratio of cache-read to genuine input. *Source:* SPRINT-043's
  captured `--output-format json`, `modelUsage`.
- **Split is near-even by tier, which rules out "the agents did it".** Coordinator (Opus) **$8.49** ·
  dispatched agents (Sonnet) **$8.05**. Neither half is the anomaly on its own → favours **C** over B.
- **Cache reads per turn ≈ 414K.** 26.5M over 64 turns. A turn is expensive *whatever it does*, because
  it re-reads everything accumulated so far — a denied one-line command costs nearly what a
  productive turn costs. → favours **C** decisively.
- **~40% of turns were spent on denials.** The run recorded **25 permission denials**, 23 of them form
  failures on commands that were individually permitted (21 behind a `cd` prefix, 2 behind a variable
  assignment). Each denial burns a turn and produces nothing. *Source:* `permission_denials` in the
  same captured result.
- **Output volume was unremarkable.** 190,846 output tokens for two ~25-line changes is high but is a
  rounding error against 26.5M cache reads → **rules out A**.
- **Wall-clock was never the constraint.** 22 minutes for two units. *Not* a driver; recorded so the
  next investigation does not re-derive it.

## Recommendation

**Target turn count, not verbosity or agent count.** Cost ≈ turns × accumulated-context size, so the
cheapest run is the one that wastes fewest turns — and the largest single source of wasted turns was
denials the run kept re-attempting in different wrappers.

Two changes, both landed in SPRINT-044:

1. **The bare-invocation rule (T2)** removes the cause of 23 of 25 denials. It was adopted to fix
   correctness; this note is the evidence that it is *also* the cost fix.
2. **Do not re-attempt a denied operation in a different wrapper (T4).** The wrapper is not the
   problem, so each retry buys another denial at full turn price. Record it once and move on.

Not promoted to an ADR: nothing here is hard-to-reverse, and the trade-off is not genuine — cheaper
runs at equal output is not a trade.

## Out of scope / open questions

- **Proof of the reduction.** Deliberately not settled here: it is the next run's calibration row.
  Attaching it to this note would make the finding un-closeable without firing a paid run.
- **Coordinator context growth.** The coordinator re-reads a transcript that grows all sprint. Whether
  a mid-sprint compaction or a per-wave fresh context would pay for itself is unmeasured.
- **Whether inline beats dispatch below some task size.** L-073 asserts it; no threshold is measured.
