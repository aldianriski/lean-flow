---
name: orchestrator
description: Use when starting, resuming, or completing any development task or sprint. Drives a gate-driven loop — quick, mvp, and sprint-bulk modes — with a G1 Scope gate and a G2 Design gate before any commit. Self-contained, no specialist agents. Do not use for debugging — use /diagnose; or for converting raw intent into tasks — use /task-decomposer.
argument-hint: "[quick | mvp | sprint-bulk] [task-or-description]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
version: "0.2.0"
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
- [ ] Residual ambiguity grilled (below) until the goal is unambiguous

**Residual grill** — the detailed grill runs at intake (`/task-decomposer` Clarify); here, re-grill
only what is still open — one question at a time, recommend an answer each time. An unconfirmed
`assumes:` or a `needs-info` task **BLOCKS G2** until resolved. A design that must be *felt* →
`/prototype`, fold the verdict back into G2; a high-stakes hard-to-reverse fork → `/council`
(`verdict-<slug>.md`) → ADR.

## Phases

> **Implement routing** — at any Implement step: building *new testable behaviour* → work test-first
> via `/tdd` (red-green-refactor in vertical slices; test type → `tdd/references/test-strategy.md`; if owner declines tests or no harness exists → implement directly + note a manual verification step); chasing a *bug or failing test* → `/diagnose`;
> *code that's hard to change* (shallow modules, leaky seams) → `/refactor-advisor`. Docs / config /
> spikes implement directly.
>
> **Drive with `/goal`** — set a `/goal` equal to the task's done-when / acceptance so execution keeps
> working across turns until it's verifiably met (Goal-Driven Execution, native), then clear it.
>
> **Dispatch by tier** — gates · grill · design · synthesis stay on the session model; send recon and
> *well-specced mechanical* implement work to a cheap-tier `sonnet` subagent (Agent-tool `model:`
> override) with a self-contained brief. Tier map → `.claude/CONTEXT.md`.

### quick
1. **Parse** — restate the task as a verifiable goal; confirm in one line.
2. **G1** — run the checklist; BLOCK on any fail.
3. **Implement** — execute; flag scope creep the moment it appears.
4. **Self-review** — run the review checklist (below) as the floor; heavier isolated `/code-review` / `/verify` passes apply to non-trivial diffs and mvp+sprint-bulk, not quick low-risk tasks.
5. **Commit** — structured message: `type(scope): summary`.

### mvp
1. **Parse** → 2. **G1** → 3. **Grill** (if requirements unclear) → 4. **G2 Design**
→ 5. **Implement** micro-tasks in order, marking each done as its check passes
→ 6. **Self-review** → 7. **Commit**.

### sprint-bulk
Operates on the active sprint file `docs/sprint/SPRINT-NNN-<slug>.md` (its Plan + DoD).
0. **Guard** — verify an active sprint file with open Plan DoD `[ ]` exists. None → halt, redirect to `/lean-doc-generator promote`. More than one active (parallel streams) → ask which sprint to run.
1. **Batch G1** — one combined scope pass over the Plan.
2. **Batch G2** — one design pass; **map shared-file ownership** (every file touched by >1 task → single owner + commit order, before the first task) and note cross-task file overlaps — and **cross-stream** ones: files shared with another stream's active sprint → coordinate or sequence, never parallel-build; at commit, stage shared files per-hunk (`git add -p` + verify `git diff --cached`) — a plain `git add <shared>` stages another task/stream's WIP into your commit (contaminates at the commit phase, not just merge — L-042/L-037); **grill individually any task with an unconfirmed `assumes:`** — a batch sign-off never waves an open assumption through.
3. **Sequence** — tasks (Tn) with overlapping files run sequentially; **disjoint tasks at scale → `/batch`** (decompose → one worktree subagent per unit → PR each; `/workflows` watches it).
4. **Loop** — per Plan task: Implement → Self-review → Commit → tick its DoD `[x]`; **append to the sprint Execution Log** (don't edit § Plan — it's frozen). `/loop` can pace the iteration.
5. **First-blocker halt** — stop on any blocker or human `block`; log it and wait.
6. **Close** — all DoD `[x]` → run `/lean-doc-generator close`; then **fixes-only sprint → `/release-patch` (PATCH); feature sprint → MINOR by hand** (release-patch is PATCH-only, scans `plan_commit..HEAD`).

## Review

Run checks in a **fresh, isolated context** (subagent / separate pass), not inline — a reviewer that
didn't write the code catches more, and the heavy work stays out of the main loop. **Scope every pass
to the diff + its blast radius** (`git diff` + changed files + direct callers) — never survey the whole
repo (the fan-out re-scan is the biggest token sink). A **skip table** decides which passes fire:
docs/trivial → self-review only · no security surface → skip `/security-review` · unchanged behaviour →
skip `/verify` · already-read → skip `Explore`. **Scale depth:** small/medium → **one** scoped `sonnet` reviewer; `/code-review`'s finder fan-out only for **large / high-risk** diffs.

- **Code review** — small/med → one scoped `sonnet` reviewer · large/high-risk → **`/code-review`** · **behaviour change → `/run` + `/verify`** · **cleanup → `/simplify`** · **auth/input/secrets → `/security-review`** · **bug → `/diagnose`**.
- **Doc-only / delete-only / trivial** → the self-review checklist is the floor.

Full routing · skip table · self-review checklist → `references/review-scoping.md`.

## Red flags

❌ **G1 skipped** — unconfirmed scope causes regressions; no exceptions.
❌ **Size L not split** — un-reviewable; split first.
❌ **Self-implementing past the goal** — coordinate the task, do not expand it.
❌ **Grill skipped on ambiguous requirements** — builds the wrong thing.
❌ **Committing through a failing check** — surface the failure, don't bury it.
❌ **Flipping an encoded safeguard/doctrine under autonomy** — `sprint-bulk` / "go autonomous" is momentum, not a licence to silently reverse a safety/policy default; keep it default-OFF + surface the conflict for an owner decision (L-024).
