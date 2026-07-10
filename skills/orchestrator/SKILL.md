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
- Task is in an **active sprint** → default to the sprint mode (or `quick` for a single one).
- Task is only in the **Backlog** (not in any active sprint) → **don't silently build**: surface the choice as a popup — `/lean-doc-generator promote` it into a sprint, or proceed as an explicit `quick` one-off (never slide decompose → build unrecorded).

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
- [ ] Micro-task list, each independently verifiable (for an **L** design, present + approve it section-by-section, not one monolith)
- [ ] Hard-to-reverse decision? → record it (prompt `/lean-doc-generator <adr> <subject>`)
- [ ] Residual ambiguity grilled (below) until the goal is unambiguous

**Residual grill** — the detailed grill runs at intake (`/task-decomposer` Clarify); here, re-grill
only what is still open — one question at a time (as an **AskUserQuestion popup**, not inline prose), recommend an answer each time. An unconfirmed
`assumes:` or a `needs-info` task **BLOCKS G2** until resolved — surface it or mark it `blocked` with an unblock condition, never park it as a passive note. A design that must be *felt* →
`/prototype`, fold the verdict back into G2; a high-stakes hard-to-reverse fork → `/council`
(`verdict-<slug>.md`) → ADR.

## Phases

> **Implement routing** — at any Implement step: *new testable behaviour* is built **test-first via
> `/tdd` by default** (red-green-refactor in vertical slices; test type → `tdd/references/test-strategy.md`; decline only with a stated reason — owner opts out or no harness → implement directly + note a manual verification step); chasing a *bug or failing test* → `/diagnose`;
> *code that's hard to change* (shallow modules, leaky seams) → `/refactor-advisor`. Docs / config /
> spikes implement directly.
>
> **Drive with `/goal`** — set a `/goal` equal to the task's done-when / acceptance so execution keeps
> working across turns until it's verifiably met (Goal-Driven Execution, native), then clear it.
>
> **Dispatch by role** — `decision` work (gates · grill · design · synthesis) stays on the session model
> (advisory); dispatch `execution` (implement · recon) → Sonnet · `mechanical-ingest` → Haiku — hand the subagent the relevant **procedure skill** (`/tdd`·`/diagnose`·`/refactor-advisor` via runtime Skill invocation, on a `general-purpose` agent), not a re-described brief;
> escalate manually to Fable / `/council` for an ADR-grade fork. Role map → `.claude/CONTEXT.md` · ADR-010 (+ skill-dispatch amendment).

### quick
1. **Parse** — restate the task as a verifiable goal; confirm in one line.
2. **G1** — run the checklist; BLOCK on any fail.
3. **Implement** — execute per Implement routing (new behaviour → `/tdd` by default); flag scope creep the moment it appears.
4. **Self-review** — run the review checklist (below) as the floor; heavier isolated `/code-review` / `/verify` passes apply to non-trivial diffs and mvp+sprint-bulk, not quick low-risk tasks.
5. **Commit** — structured message: `type(scope): summary`.

### mvp
1. **Parse** → 2. **G1** → 3. **Grill** (if requirements unclear) → 4. **G2 Design**
→ 5. **Implement** micro-tasks in order (route by type — new behaviour → `/tdd`), ticking each as its check passes
→ 6. **Self-review** → 7. **Commit**.

### sprint-bulk
Operates on the active sprint file `docs/sprint/SPRINT-NNN-<slug>.md` (its Plan + DoD).
0. **Guard** — verify an active sprint file with open Plan DoD `[ ]` exists. None → halt, redirect to `/lean-doc-generator promote`. More than one active (parallel streams) → ask which sprint to run.
1. **Batch G1** — one combined scope pass over the Plan.
2. **Batch G2** — one design pass; **map shared-file ownership** (every file touched by >1 task → single owner + commit order, before the first task) and note cross-task file overlaps — and **cross-stream** ones: files shared with another stream's active sprint → coordinate or sequence, never parallel-build; at commit, stage shared files per-hunk (`git add -p` + verify `git diff --cached`) — a plain `git add <shared>` stages another task/stream's WIP into your commit (contaminates at the commit phase, not just merge — L-042/L-037); **grill individually any task with an unconfirmed `assumes:`** — a batch sign-off never waves an open assumption through.
3. **Sequence** — tasks (Tn) with overlapping files run sequentially; **disjoint tasks at scale → `/batch`** (decompose → one worktree subagent per unit → PR each; `/workflows` watches it).
4. **Loop** — per Plan task: Implement (route by type — new behaviour → `/tdd`) → Self-review → Commit → tick its DoD `[x]`; **append to the sprint Execution Log** (don't edit § Plan — it's frozen). `/loop` can pace the iteration.
5. **First-blocker halt** — stop on any blocker or human `block`; log it and wait.
6. **Close** — all DoD `[x]` → run `/lean-doc-generator close`; then **fixes-only sprint → `/release-patch` (PATCH); feature sprint → MINOR by hand** (release-patch is PATCH-only, scans `plan_commit..HEAD`).

## Review

Run checks in a **fresh, isolated context** (a reviewer who didn't write the code catches more) and
**scope every pass to the diff + its blast radius** — never the whole repo (the fan-out re-scan is the
biggest token sink). A **skip table** + **scale-depth** rule decide what fires: docs/trivial → self-review
only · small/med → one scoped `sonnet` reviewer · large/high-risk → `/code-review` · behaviour change →
`/run` + `/verify` · auth/input/secrets → `/security-review` · bug → `/diagnose`.

Full routing · skip table · the Standards-vs-Spec axes · adversarial floor · self-review checklist → `references/review-scoping.md`.

## Red flags

❌ **G1 skipped** — unconfirmed scope causes regressions; no exceptions.
❌ **Size L not split** — un-reviewable; split first.
❌ **Self-implementing past the goal** — coordinate the task, do not expand it.
❌ **Grill skipped on ambiguous requirements** — builds the wrong thing.
❌ **Committing through a failing check** — surface the failure, don't bury it.
❌ **Silently absorbing a mid-sprint scope change** — a pivot that shifts scope is logged (`scope-change`: what broke · impact · re-confirm G2) in the Execution Log *before* editing the frozen § Plan (SPRINT-012 T4).
❌ **Flipping an encoded safeguard/doctrine under autonomy** — `sprint-bulk` / "go autonomous" is momentum, not a licence to silently reverse a safety/policy default; keep it default-OFF + surface the conflict for an owner decision (L-024).
❌ **Sliding decompose → build with no sprint recorded** — a Backlog task not in an active sprint never auto-builds; surface promote-vs-one-off as a popup, never silent (SPRINT-015 T1).
