# Gate-guard enforcement (PreToolUse hook / sibling plugin)

- date: 2026-07-29
- decision: out of scope
- reason: gates are human discipline by design (ADR-002 lineage → ADR-011). Platform fact rules out an opt-in in-core hook — plugin hooks auto-activate with no per-hook disable, so in-core = mandatory for every consumer. A sibling plugin (`lean-flow-gate-guard`) is certain cost (second maintained artifact · marker-file public contract · Windows portability work) against zero demand signal. Feasibility facts: `docs/research/pretooluse-gate-guard.md`.
- revisit-if: consumers report gate-skipping as a recurring real failure, or Claude Code ships per-hook opt-in for plugin hooks
- prior-requests: TASK-006
