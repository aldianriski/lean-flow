---
name: orchestrator
description: Use when starting, resuming, or completing any development task or sprint. Drives a gate-driven loop — quick, mvp, and sprint-bulk modes — with a G1 Scope gate and a G2 Design gate before any commit. Self-contained, no specialist agents. Do not use for debugging — use /diagnose; or for converting raw intent into tasks — use /task-decomposer.
argument-hint: "[quick | mvp | sprint-bulk] [task-or-description]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Agent, Task
user-invocable: true
version: "0.2.0"
---

# orchestrator

Gate-driven execution loop. Coordinate the work; restate intent as a verifiable goal first. Humans approve gates — never
self-approve. No specialist agents: gates are inline checklists and review is a structured self-pass.

## Mode dispatch

| Mode | Gates | Use when |
|---|---|---|
| `quick` | G1 | single task, small, low risk |
| `mvp` | G1 + G2 | feature work, medium+, multi-step |
| `sprint-bulk` | G1+G2 once | auto-loop the Active Sprint task list |

**Intake routing — a mode keyword selects the mode, it never bypasses these routing checks.** Run them on every invocation, named mode or not:
- No tracked task → run `/task-decomposer` first, then return here.
- Intent too **foggy to slice** (decisions unknown — no acceptance criteria writable yet) → `/task-decomposer` **fog-mode** (`--fog`): map the decisions before forcing tasks.
- Task is in an **active sprint** → default to the sprint mode (or `quick` for a single one).
- Task is only in the **Backlog** (not in any active sprint) → **don't silently build**: surface the choice as a popup — `/lean-doc-generator promote` it into a sprint, or proceed as an explicit `quick` one-off (never slide decompose → build unrecorded).
- Asked to **start a night run** on anything that isn't already a promoted Plan → you are the *interactive launcher*, not the run: do feed → promote → pre-flight here, gates and all, and fire the trigger only once pre-flight is green. Never spawn first (→ `${CLAUDE_SKILL_DIR}/references/night-run.md` Part 1a).

## G1 — Scope gate (all modes, always runs)

Confirm before touching code. BLOCK if any answer is "unknown":
- [ ] Goal restated as one verifiable sentence ("done when …")
- [ ] Size estimated S / M / L — an **L splits before proceeding**
- [ ] Files likely touched listed; blast radius understood — for unfamiliar / mature code, **recon via the `Explore` agent** (read existing impl + tests + deps in its own context; keeps this loop lean)
- [ ] Out-of-scope explicitly named (what this task will NOT do)
- [ ] Assumptions surfaced and confirmed where they affect behavior

**Fast-path:** `origin: decomposer` (it met the intake grill) → G1 = one confirm ("scope unchanged since approval?"); changed/unsure → full checklist above.
**Every other origin gets the full checklist** — `close-retro` follow-ups, `/triage`-converted bugs and `manual` entries never passed the intake grill, so there is no prior scope agreement for a fast-path to re-confirm. A **missing** `origin:` is treated as ungrilled, not as decomposer: the fast-path is the exception that must be earned, and the field says so in the task's own text — never inferred from `tracker:` or from how the entry reads.

## G2 — Design gate (mvp + sprint-bulk)

Before implementing, draft the design in **`/plan`** (plan mode) and get human sign-off:
- [ ] Approach chosen over alternatives, with a one-line WHY
- [ ] Micro-task list, each independently verifiable (for an **L** design, present + approve it section-by-section, not one monolith)
- [ ] Hard-to-reverse decision? → record it (prompt `/lean-doc-generator <adr> <subject>`); a `risk: high` task touching auth / input / secrets / data-exposure → sketch its one-line abuse case here at design time (complements the Review-time `/security-review` row — never replaces it)
- [ ] Residual ambiguity grilled (below) until the goal is unambiguous

**Residual grill** — the detailed grill runs at intake (`/task-decomposer` Clarify); here, re-grill only what is still open —
by **frontier round** — batch every still-open question whose prerequisites are settled into one **AskUserQuestion popup**, serialise only the dependents (dependency is the discriminator, not count), recommending an answer each time. An unconfirmed
`assumes:` or a `needs-info` task **BLOCKS G2** until resolved — surface it or mark it `blocked` with an unblock condition, never
park it as a passive note. A design that must be *felt* → `/prototype`, fold the verdict back into G2; a high-stakes hard-to-reverse fork → `/council` (`verdict-<slug>.md`) → ADR.

## Phases

> **Every Implement step dispatches.** The orchestrator is the `decision` tier — it **coordinates** (gates · grill · design · synthesis · merge) and does not execute inline: `execution`→Sonnet · `mechanical-ingest`→Haiku go **by default** to a `general-purpose` sub-agent handed its **procedure skill** (new behaviour→`/tdd` test-first · bug→`/diagnose` · hard-to-change→`/refactor-advisor` · docs/config/spikes→direct); a `decision`/trivial step stays inline only with a stated reason. Drive the task with `/goal` (its done-when), clear it at the end. Escalate by hand to Fable / `/council` for an ADR-grade fork.
>
> **Routing table · `/goal` · dispatch + parallel/sequential rules → `${CLAUDE_SKILL_DIR}/references/dispatch.md`**; role map → `.claude/CONTEXT.md` · ADR-010.

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
2. **Batch G2** — one design pass; **map shared-file ownership** (every file touched by >1 task → single owner + commit order, before the first task) and note cross-task file overlaps — and **cross-stream** ones: files shared with another stream's active sprint → coordinate or sequence, never parallel-build; at commit, stage shared files per-hunk (`git add -p` + verify `git diff --cached`) — a plain `git add <shared>` stages another task/stream's WIP into your commit (contaminates at the commit phase, not just merge — promoted rule); **grill individually any task with an unconfirmed `assumes:`** — a batch sign-off never waves an open assumption through. **The map is built from `Layers:`, so it cannot see files no task declares** — the sprint file (DoD ticks · § Files Changed) and its Execution Log are written by every task and owned by the **coordinator**, never assigned to one; a dispatched agent returns its Log entry in its report instead of writing it (SPRINT-063 produced two copies of one Log → `${CLAUDE_SKILL_DIR}/references/dispatch.md` § Worktree dispatch protocol).
3. **Sequence** — **run the pre-dispatch preflight first** (cycle · shared-file ownership · base-ref-vs-HEAD · wave rank, all derived from each task's `### Tn`/`Layers:`/`Depends-on:`); any FAIL halts the wave with its named finding, never a bare fail. Then from the G2 overlap map decide per task: **disjoint (no shared file, no `depends-on`) → dispatch in PARALLEL, worktree-isolated** (one `Agent(isolation:"worktree")` per task, one message; coordinator merge-back queue) · **shared/dependent → SEQUENTIAL** (ownership order); large fan-out → `/batch` · `/workflows`. Protocol + queue + rules → `${CLAUDE_SKILL_DIR}/references/dispatch.md`.
4. **Loop** — per Plan task: Implement (route by type — new behaviour → `/tdd`) → Self-review → Commit → tick its DoD `[x]`; **append to the sprint Execution Log** (don't edit § Plan — it's frozen). `/loop` can pace it; unattended overnight run → `${CLAUDE_SKILL_DIR}/references/night-run.md` (pre-flight + trigger + **the unattended contract, Part 0**). **Run the loop until the Plan is exhausted — every task ticked or carrying a rollup line — then emit the rollup block at exit, always, headed by `run · N of M DoD ticked`** (night-run.md Part 4). Nothing outside this loop checks the Plan is finished, so a turn that ends mid-Plan ends the session reporting `success`; the count is what makes that visible (`unattempted` is its state).
5. **First-blocker halt** — stop on any blocker or human `block`; log it and wait. **Unattended** (the trigger said so — never inferred): don't wait and don't decide — **park** it (rollup line → Execution Log), carry on with disjoint AFK work, halt clean via `/handoff` when none is left. Charter is execute-only: a HITL step is parked, never asked, answered, or engineered around. **Re-check open parks as each later task takes ownership** — a park whose unblock condition names a task *this same run* completes is actionable now, not a morning to-do (Part 0 step 4; unattended only). A park is one line *inside* the step-4 rollup block, which is emitted whether or not anything parked — a rollup that speaks only on trouble cannot distinguish "nothing went wrong" from "most of the Plan was never attempted". Contract → `night-run.md` Part 0.
6. **Close** — all DoD `[x]` → run `/lean-doc-generator close`; then **fixes-only sprint → `/release-patch` (PATCH); feature sprint → MINOR by hand** (release-patch is PATCH-only, scans `plan_commit..HEAD`).

## Review

Run checks in a **fresh, isolated context** (a reviewer who didn't write the code catches more) and **scope every pass to
the diff + its blast radius** — never the whole repo (the fan-out re-scan is the biggest token sink). A **skip table** +
**scale-depth** rule decide what fires: docs/trivial → self-review only · small/med → one scoped `sonnet` reviewer · large/high-risk → `/code-review` · behaviour change → `/run` + `/verify` · auth/input/secrets → `/security-review` · bug → `/diagnose`.

Full routing · skip table · the Standards-vs-Spec axes · adversarial floor · self-review checklist → `${CLAUDE_SKILL_DIR}/references/review-scoping.md`.

## Red flags

❌ **G1 skipped** — unconfirmed scope causes regressions; no exceptions.
❌ **Size L not split** — un-reviewable; split first.
❌ **Self-implementing past the goal** — coordinate the task, do not expand it.
❌ **Grill skipped on ambiguous requirements** — builds the wrong thing.
❌ **Committing through a failing check** — surface the failure, don't bury it.
❌ **Silently absorbing a mid-sprint scope change** — a pivot that shifts scope is logged (`scope-change`: what broke · impact · re-confirm G2) in the Execution Log *before* editing the frozen § Plan (SPRINT-012 T4).
❌ **Quietly reinterpreting a DoD that execution invalidated** — distinct from the row above: the scope holds, the *criterion* went stale. A DoD frozen at promote can carry a number estimated before it was measured, or a premise a later decision dissolved. Log a `scope-change` and get the owner's ruling before ticking it; never round a measurement up to meet a stated figure, and never re-read the words to fit what was built. A sprint that closes green against criteria nobody re-agreed to is the failure (L-088).
❌ **Treating autonomy as authority** — `sprint-bulk` / "go autonomous" is momentum, not a licence to silently reverse a safety/policy default (keep it default-OFF + surface the conflict for an owner decision — promoted rule), nor to read an **unanswerable question as approval**: headless has no ask channel at all (`AskUserQuestion` unregistered; `dontAsk` auto-denies) — a missing channel, a denial, or no human is a **BLOCK**, so park it. Never "proceed with the recommended option", never self-approve, never reshape a task to dodge the gate (dodging is scope-changing → itself HITL) (SPRINT-033).
❌ **Sliding decompose → build with no sprint recorded** — a Backlog task not in an active sprint never auto-builds; surface promote-vs-one-off as a popup, never silent (SPRINT-015 T1).
❌ **Spawning an unattended run before its Plan is promoted and pre-flight is green** — step 0's guard runs *inside* the spawned process, where there is no ask channel to halt into; the check that matters is the interactive one, before the spawn. "Run a night run for `<intent>`" is a compound instruction — prepare, then launch — never launch alone (SPRINT-034).
