# Lean Flow — Harness Research Brief

> Status: Research only  
> Do not treat this document as approval to implement a custom agent runtime.

## Research Question

Which harness principles materially improve Lean Flow at the layer it actually controls?

Lean Flow currently operates as a portable workflow/plugin layer on top of agent runtimes.

It does not own:

- complete model request serialization,
- provider caching,
- full conversation storage,
- model context compaction internals,
- underlying host agent loop.

Therefore research must distinguish:

```text
Lean-controlled
Host-controlled
Future-control-plane controlled
```

---

## Candidate A — Reconstructible Lean-Controlled Dispatch

Question:

> Can Lean Flow reconstruct the execution brief it intentionally gave a worker from durable authoritative inputs?

Candidate inputs:

```text
work item
plan
done-when
verification
dependencies
governing decisions
workflow
repo revision
runtime policy
```

Target:

```text
derive_dispatch(input, revision)
→ canonical brief
```

Proof:

```text
same input
same revision
→ same canonical brief
```

This is dispatch reproducibility.

It is not full LLM-request reproducibility.

---

## Candidate B — Independent Dispatch Replay

Live dispatch should not prove itself.

Possible invariant:

```text
live dispatch brief
        ↓
      compare
        ↑
fresh derivation from authoritative state
```

Possible named finding:

```text
dispatch-envelope-drift
```

Potential defects caught:

- missing constraint,
- omitted governing decision,
- stale revision,
- missing Verify method,
- wrong dependency,
- wrong workflow,
- coordinator paraphrase drift.

---

## Candidate C — Reversible Effects

Research whether execution should explicitly account for runtime side effects.

Invariant:

> No successful execution leaves an unowned live effect behind.

Candidate effect model:

```text
effect
owner
created_at
lifetime
dispose action
final state
```

Measure current incidents involving:

- stale worktrees,
- surviving processes,
- orphan servers,
- temporary state,
- locks,
- background jobs.

Do not add an effect ledger if evidence shows no meaningful friction.

---

## Candidate D — Programmatic Mechanical Batching

Question:

> Which current multi-tool operations can be collapsed into deterministic local computation without losing evidence?

Experiment classes:

```text
repo census
rule inventory
dependency scans
fixture scans
coverage mapping
cross-reference validation
```

Compare:

```text
individual model/tool loop
vs
one local batch
```

Measure:

```text
tool_calls
round_trips
returned_tokens
wall_time
cost
accuracy
findings
```

Do not define a permanent threshold before measurements.

---

## Explicit Non-Goals

Do not implement:

```text
custom provider cache system
full session event log
byte-identical complete LLM replay
custom compaction engine
new generic plugin runtime
replacement agent loop
```

unless Lean Flow later owns the runtime and separate evidence justifies it.

---

## Research Output

Produce:

```text
docs/research/harness-delta.md
```

with one row per mechanism:

| Mechanism | Current Equivalent | Owner | Delta? | Adopt/Adapt/Reject/Defer | Evidence | Proof Vehicle |
|---|---|---|---|---|---|---|

End with no more than a few real deltas.

If the answer becomes "adopt everything", the research failed to preserve Lean Flow's admission discipline.
