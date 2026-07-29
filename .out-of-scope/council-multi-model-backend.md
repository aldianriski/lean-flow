# Council multi-model diversity backend (2nd-provider routing)

- date: 2026-07-29
- decision: out of scope
- reason: two probes found no exposed crack to fix — TASK-048 (judgment fork) and TASK-065 (cross-tier factual) both surfaced NO shared-weights blind spot a second model would correct, so the premise ("5 personas on one model share its priors" costs us real decisions) is unproven. Against that: a 2nd-provider backend is a certain trust-boundary widening (routes repo content to a vendor the host-repo owner never consented to, peaking on exactly the rare high-stakes runs) and the synthesis bottleneck remains (all advisors funnel through one chairman — a naive backend is a no-op). Evidence: docs/research/council-improvements.md §§ Divergence measurement · Factual decorrelation probe.
- revisit-if: a cross-PROVIDER test shows a real shared factual error that a different provider corrects. If ever built, the only axiom-consistent shape is a BYO-provider, opt-in, disabled-by-default seam (SPRINT-020 T4 reframe) — the installer supplies + consents to their own 2nd provider; lean-flow ships the seam, never the trust boundary.
- prior-requests: TASK-047
