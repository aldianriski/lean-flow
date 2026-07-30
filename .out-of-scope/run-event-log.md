# Rejected: structured run-event log (JSONL observability)

- **Rejected:** 2026-07-30 · ADR-013 · council verdict `docs/research/verdict-machine-state-artifacts.md` (SPRINT-035 T6 / TASK-111)
- **What it was:** a JSONL event stream (node_started / node_committed / node_parked / wave_completed) per fleet run — local observability, timelines, stuck-agent detection (external review item 6).
- **Why rejected:** a derived machine view with no firing trigger and no first consumer — council-2's axis (TASK-040) replaying. The sprint Execution Log already is the event log; at 4–8-task scale a human scans it in seconds. Duplication, not capability.
- **Revisit-if:** a real consumer (`/insights` or the Sprint-Close Retro) concretely asks for task-class timing / parking-rate data on **two separate occasions** — then it re-enters as a proposal with a named consumer, never as write-only exhaust. Guardrail: it must never quietly become the input to a run-state resume path (ADR-013 pre-mortem 1).
