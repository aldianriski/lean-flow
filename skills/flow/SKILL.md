---
name: flow
description: Conduct the full lean-flow loop end-to-end — assess context, ensure a backlog and sprint exist, build through the gates with the right per-task technique, then close with governance. The opt-in conductor: it sequences the standalone skills as stages and enforces the gates/governance, but never auto-approves a human gate. Use when you want the disciplined workflow run for you; use the individual skills for à la carte work.
argument-hint: "[intent, or blank to continue from current state]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
version: "0.2.0"
---

# flow

The opt-in **conductor** for the lean-flow loop. It drives the standalone skills through the proper
sequence so the discipline *runs* instead of being remembered — **à la carte still works; this is the
conducted path.** It sequences; it never bypasses a gate.

> Every skill stays standalone (nothing requires another). `/flow` is the one component *allowed* to
> depend on the others — conducting them is its whole job. It does not re-implement any stage; it calls them.

## What it conducts

Assess the current state first, then run only the stages whose precondition is unmet — state which you're running and why you're skipping the rest:

1. **Orient** — context missing/stale → `/prime`. Resuming from a handoff? read it first.
2. **Feed** — no open work → `/task-decomposer "<intent>"` — **the detailed grill fires here, at intake** (the build gates re-grill only residuals); backlog drifted / noisy → `/triage`.
3. **Plan** — no active sprint but a `ready` backlog exists → `/lean-doc-generator promote` (the governance review fires here).
4. **Build** — `/orchestrator sprint-bulk` through G1 / G2. Route each task by type: new behaviour → `/tdd` · bug → `/diagnose` · hard-to-change → `/refactor-advisor` · a design that must be *felt* → `/prototype` first.
5. **Close** — all DoD ticked → `/lean-doc-generator close` (Retro → §10 buckets), then **`/release-patch` (PATCH) for a fixes-only sprint · MINOR by hand for a feature sprint**.
6. **Continuity** — stopping mid-loop or context budget low → `/handoff`, so the next `/flow` resumes cleanly.

**Pin the target with `/goal`** — set a `/goal` to the active task/sprint's DoD so the conducted run
keeps driving across turns until it's verifiably met; clear it at close. That's the native engine
behind "conduct the loop".

## Conductor, not autopilot

- **Never self-approve a gate.** G1 Scope and G2 Design still need explicit human sign-off — `/flow` pauses at each; it does not wave them through.
- **Halt on first blocker** (BLOCKED / CRITICAL / human `block`) — report and wait.
- **One sprint per stream** — never a second sprint in a stream that already has one; parallel streams (sprint `stream:` frontmatter) each run their own. Single-stream repos: exactly one active sprint, as before.
- The conducted path produces the **same artifacts** as à la carte — it only guarantees the sequence and that the Close governance actually runs.

## Red flags

❌ **Auto-approving G1/G2** — the conductor sequences; the human gates.
❌ **Skipping the Close governance** (Retro / §10) because "the build's done" — that's the part that compounds.
❌ **Re-running a stage whose output already exists** — assess first; skip with a stated reason.
❌ **Conducting when one skill was wanted** — `/flow` is opt-in; a single `/tdd` is not a reason to drive the whole loop.
❌ **Re-implementing a stage inline** — always call the standalone skill, never inline its logic.
