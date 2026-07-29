# Derived graph VIEW over the knowledge metadata (relational comprehension)

- date: 2026-07-29
- decision: out of scope
- reason: council-2 (2026-07-02) unanimously rejected a separately-maintained graph (second source of truth · silent drift · the banned-codemap rule); the *derived* view survived only as priority #4, gated on the TASK-041 retrieval-miss signal — which has never fired. Zero demand evidence against a real build + guardrail cost (regeneration wiring · loud staleness check · integrity lint). graphify already serves the need ad-hoc, on demand (docs/research/graphify-daily-value.md).
- revisit-if: the TASK-041 retrieval-miss signal fires (a real question the flat metadata couldn't answer that a graph view would have) — then build only with ALL 3 guardrails (regeneration wired to lean-doc-generator's write step · read-time staleness check that fails loud · integrity lint). An OKF-conformant export (docs/research/okf-adoption.md) rides the same condition; never adopt OKF as the authoring format.
- prior-requests: TASK-040
