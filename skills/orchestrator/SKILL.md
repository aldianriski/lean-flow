---
name: orchestrator
description: Use when starting, resuming, or completing any development task or sprint. Drives a gate-driven loop — quick, mvp, and sprint-bulk modes — with a G1 Scope gate and a G2 Design gate before any commit. Self-contained, no specialist agents. Do not use for debugging — use /diagnose; or for converting raw intent into tasks — use /task-decomposer.
argument-hint: "[quick | mvp | sprint-bulk] [task-or-description]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
version: "0.1.0"
---

# orchestrator

Gate-driven execution loop. Coordinate the work; restate intent as a verifiable goal first.
Humans approve gates — never self-approve. No specialist agents: gates are inline checklists
and review is a structured self-pass.

## Mode dispatch

| Mode | Gates | Use when |
|---|---|---|
| `quick` | G1 | single task, small, low risk |
| `mvp` | G1 + G2 | feature work, medium+, multi-step |
| `sprint-bulk` | G1+G2 once | auto-loop the Active Sprint task list |

Freeform input with no mode keyword:
- No tracked task → run `/task-decomposer` first, then return here.
- A task exists → default to `quick`.

## G1 — Scope gate (all modes)

Confirm before touching code. BLOCK if any answer is "unknown":
- [ ] Goal restated as one verifiable sentence ("done when …")
- [ ] Size estimated S / M / L — an **L splits before proceeding**
- [ ] Files likely touched listed; blast radius understood — for unfamiliar / mature code, **recon via the `Explore` agent** (read existing impl + tests + deps in its own context; keeps this loop lean)
- [ ] Out-of-scope explicitly named (what this task will NOT do)
- [ ] Assumptions surfaced and confirmed where they affect behavior

## G2 — Design gate (mvp + sprint-bulk)

Before implementing, draft the design in **`/plan`** (plan mode) and get human sign-off:
- [ ] Approach chosen over alternatives, with a one-line WHY
- [ ] Micro-task list, each independently verifiable
- [ ] Hard-to-reverse decision? → record it (prompt `/lean-doc-generator <adr> <subject>`)
- [ ] Grill ambiguous requirements (moves below) until the goal is unambiguous

**Grill moves** — one question at a time, recommend an answer each time, explore the codebase before asking:
- **Challenge the glossary** — a term that conflicts with `CONTEXT.md`? Surface it: "your glossary says X, you seem to mean Y — which?"
- **Sharpen fuzzy language** — replace an overloaded word ("account", "user") with a precise canonical term.
- **Invent edge-case scenarios** — concrete cases that force the boundaries between concepts to be made explicit.
- **Cross-reference code** — if a claim contradicts the code, surface the contradiction.
- **Capture resolved terms inline** — feed a newly-pinned term straight to `/lean-doc-generator` (glossary); don't batch.
- **Can't resolve a design on paper?** (a state machine / data model / UI that needs to be *felt*) → `/prototype` to answer the question, then fold the verdict back into G2 (and an ADR if it's load-bearing).
- **A hard-to-reverse / ambiguous decision with real stakes?** → `/council` to pressure-test it from 5 angles (`verdict-<slug>.md`), then record the call as an ADR. Reserve for genuinely expensive-to-get-wrong forks — it uses sub-agents.

## Phases

> **Implement routing** — at any Implement step: building *new testable behaviour* → work test-first
> via `/tdd` (red-green-refactor in vertical slices); chasing a *bug or failing test* → `/diagnose`;
> *code that's hard to change* (shallow modules, leaky seams) → `/refactor-advisor`. Docs / config /
> spikes implement directly.
>
> **Drive with `/goal`** — set a `/goal` equal to the task's done-when / acceptance so execution keeps
> working across turns until it's verifiably met (Goal-Driven Execution, native), then clear it.

### quick
1. **Parse** — restate the task as a verifiable goal; confirm in one line.
2. **G1** — run the checklist; BLOCK on any fail.
3. **Implement** — execute; flag scope creep the moment it appears.
4. **Self-review** — run the review checklist (below).
5. **Commit** — structured message: `type(scope): summary`.

### mvp
1. **Parse** → 2. **G1** → 3. **Grill** (if requirements unclear) → 4. **G2 Design**
→ 5. **Implement** micro-tasks in order, marking each done as its check passes
→ 6. **Self-review** → 7. **Commit**.

### sprint-bulk
Operates on the active sprint file `docs/sprint/SPRINT-NNN-<slug>.md` (its Plan + DoD).
0. **Guard** — verify an active sprint file with open Plan DoD `[ ]` exists. None → halt, redirect to `/lean-doc-generator promote`.
1. **Batch G1** — one combined scope pass over the Plan.
2. **Batch G2** — one design pass; note cross-task file overlaps.
3. **Sequence** — tasks (Tn) with overlapping files run sequentially; **disjoint tasks at scale → `/batch`** (decompose → one worktree subagent per unit → PR each; `/workflows` watches it).
4. **Loop** — per Plan task: Implement → Self-review → Commit → tick its DoD `[x]`; **append to the sprint Execution Log** (don't edit § Plan — it's frozen). `/loop` can pace the iteration.
5. **First-blocker halt** — stop on any blocker or human `block`; log it and wait.
6. **Close** — all DoD `[x]` → run `/lean-doc-generator close`, then prompt `/release-patch`.

## Review

Run the checks in a **fresh, isolated context** (a subagent / separate pass), not inline — a reviewer
that didn't write the code catches more, and the heavy work stays out of the main loop:
- **Non-trivial diff → `/code-review`** (independent context beats self-review).
- **Real behaviour change → `/run`** to drive the app + **`/verify`** it does what the goal stated.
- **Cleanup pass → `/simplify`** (reuse / simplification / efficiency; pairs with `/refactor-advisor`).
- **Auth / input / secrets / data exposure → `/security-review` as its own uncontaminated pass** (security in the same session = context contamination — keep it separate).

For **doc-only / delete-only / trivial** diffs the self-review checklist below is enough. A bug suspected → `/diagnose`.

**Self-review checklist** (the trivial-diff floor):
- [ ] Does the diff do exactly what the goal stated — nothing more?
- [ ] Edge cases / error paths handled?
- [ ] No secret, debug print, or commented-out block left behind?
- [ ] Tests or a manual check confirm the behavior?
- [ ] Adjacent files left consistent (no half-renamed symbols)?

## Red flags

❌ **G1 skipped** — unconfirmed scope causes regressions; no exceptions.
❌ **Size L not split** — un-reviewable; split first.
❌ **Self-implementing past the goal** — coordinate the task, do not expand it.
❌ **Grill skipped on ambiguous requirements** — builds the wrong thing.
❌ **Committing through a failing check** — surface the failure, don't bury it.
