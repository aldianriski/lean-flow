# Per-harness case-variant archive fixtures

- date: 2026-10-10
- decision: out of scope
- reason: the task's own `## Assumes` set the condition — close it if gate leg 10b is judged sufficient. Leg 10b (the SPRINT-099 answer to the same review finding) guards every archive-dependent site against a revert in any shape across the whole set, so five near-duplicate per-harness fixtures would re-cover a property already guarded, for a finding that named a guard hole and no live bug. Ruled at /triage, then confirmed by an independent Codex review (2026-10-10).
- revisit-if: a real single-site revert at one of the five harnesses (`run-approval-envelope-fixtures` · `run-night-run-rollup-fixtures` · `run-review-depth-fixtures` · `run-verify-reaches-fixtures` · `run-system-verify-fixtures`) is shown to pass leg 10b.
- prior-requests: TASK-347
