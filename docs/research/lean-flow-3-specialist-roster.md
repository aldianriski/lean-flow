---
owner: Maintainer
last_updated: 2026-10-31
update_trigger: A specialist's trigger fires, an S3 arm reports, or an owner ruling changes D13-D15
status: current
id: lean-flow-3-specialist-roster
tags: [process, docs]
domain: skills
related: [lean-flow-3-foundation, EPIC-023, ADR-001, ADR-002, ADR-010, ADR-044, ADR-053]
---

# Research — Which specialist roles does lean-flow 3.0 test, across the whole loop?

> **Question.** Which specialist roles does EPIC-023's S3 name now, for every stage of the loop (intake,
> design, build, review, close, release), and which of them get measured first?
> **Verdict.** Name fourteen roles now. Three go to the S3 pilot (domain and invariants, architecture and
> integration, QA). Six are already served by a shipped skill or built-in and get only the S3 brief
> fields. Five are deferred behind named triggers. A standing diagram agent is dropped.

## Why this matters

The owner directed specialist agents for 3.0 (D4), but the roster was never written down, so S3 read as
unnamed "candidates" (L-151). Naming every role per stage, each with its status, lets S0-S2 results
route to a role, and keeps any role from shipping or being dropped unmeasured.

## Options considered

- **A — the five roles the owner first named** (architect, diagram, design system, backend, frontend).
  *Trade-off:* matches intent but covers build only. Intake, QA and release have no owner.
- **B — Codex's two pilots only** (domain/invariants, architecture/integration). *Trade-off:* cheapest
  to measure, but silent on the rest of the loop.
- **C — a full-loop roster with a status per role** (chosen, owner ruling D13). *Trade-off:* more to
  name now; measurement stays staged, so the cost stays with the pilots.

## Findings

- More context does not help on average; specific non-standard facts can → favours pilots that check
  the *repo's own* facts over generic expertise. *Source:* arXiv 2602.11988 (foundation §3).
- A brief needs an objective, an output format, sources, a boundary and effort scaling → every role,
  existing ones included, gets S3a's brief fields first. *Source:* Anthropic, multi-agent research
  system (foundation §3).
- A specialist fed incomplete context repeats the error across more handoffs → S3 stays after S1/S2.
  *Source:* Codex review, 2026-10-31.
- The S0 corpus (16 tasks, two repos) exercises domain, architecture, QA, frontend, backend and data
  work. It barely touches security, performance, release or design systems → those roles cannot be
  admitted by A/B alone. They take ADR-053's other routes (repeated failure, consumer evidence).
  *Source:* `evals/ab/tasks/`, ADR-053.
- ADR-002 and ADR-044: an agent definition must clear the curation bar; reuse and context isolation
  come first → a pilot runs as a role brief through existing dispatch, never as a new agent file.

## Recommendation — the roster (owner rulings D13-D15, 2026-10-31)

| Stage | Role | Status | Targets | Served today by / trigger to start |
|---|---|---|---|---|
| Intake | Domain and invariants analyst (intake grill + review) | **PILOT** | misreads the business | `/task-decomposer` grill; S1 profile's business and invariants sections |
| Design | Architecture and integration reviewer (describes, never prescribes, R4) | **PILOT** | generic docs · lost detail | G2 design check against the profile's real architecture |
| Design + review | QA engineer / test strategist (owner-named) | **PILOT** | lost detail | G2 reachability (exists · runs · reaches · proves); review checks the tests prove the Done-when |
| Review | Security reviewer | EXISTING | — | `/security-review`; S3a brief fields only |
| Review | Code reviewer | EXISTING | — | `/code-review`; S3a brief fields only |
| Build | Test-first builder | EXISTING | — | `/tdd` |
| Build | Debugger | EXISTING | — | `/diagnose` |
| Build | Refactorer | EXISTING | — | `/refactor-advisor` |
| Close | Technical writer | EXISTING | generic docs | `/lean-doc-generator` + `/humanizer` (S1 changes it) |
| Build | Frontend engineer | DEFERRED | — | after S3b, residual convention or business failures concentrate in web layers |
| Build | Backend engineer | DEFERRED | — | after S3b, residual failures concentrate in server or API layers |
| Build | Data and database engineer | DEFERRED | — | after S3b, residual failures concentrate in schema, migration or query work |
| Design | UI and design-system designer | DEFERRED | — | a repo with `DESIGN.md` shows UI convention failures; until then `/prototype` + the DESIGN template. Not in the S0 corpus: consumer evidence route |
| Release | Release and DevOps engineer | DEFERRED | — | `/release-patch` + deployment templates today; repeated release failures or consumer evidence (not in the S0 corpus) |
| — | Standing diagram agent | DROPPED | none | diagrams are drawn on demand by the architecture reviewer's describe step |

Coordination stays with the session model (`/orchestrator`, `/flow`). It is a role, not a specialist.

**D14 — S3 splits into three measured steps** (each at k = 2, 32 runs, stacked on A3): **S3a**
brief fields and fan-out budget for every dispatch (arm A4a vs A3) · **S3b** the three pilots as role
briefs through existing dispatch (A4b vs A4a) · **S3c**, optional, agent definitions or tier changes for
a deferred role whose trigger fired (A4c vs A4b). S4 ablates each admitted role (leave one out).
**D15 — the version is decided at S4 on a named break.** S1 and S2 may ship earlier as 2.x MINORs on a
passing arm; S3 roles ship only after S4 admits them. 3.0.0 and a STANDARD major come only if a named
consumer contract breaks (conforming docs now fail, rule ids removed or renumbered — STANDARD §15).

## Out of scope / open questions

- Each pilot's brief content (sources, boundary, output format) → S3 intake (`/task-decomposer --epic`).
- Whether the QA pilot overlaps `/tdd`'s test strategy → S4's leave-one-out answers it.
- Benchmark reach: a narrow corpus must not decide a universal STANDARD rule (Codex's main risk) → S4
  states each admitted rule's evidence scope.
