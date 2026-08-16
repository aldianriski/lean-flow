---
name: task-decomposer
description: Use when converting a freeform feature request, ticket URL, PRD, or epic into structured TASK-NNN entries in TODO.md. Enforces an assumption registry, risk scoring, vertical-slice granularity, and validation before writing. Self-contained, no specialist agents. Do not use when a task already exists and is ready to build — use /orchestrator instead.
argument-hint: "[freeform intent | TICKET-ID | --prd file.md | --epic \"Name\" | --fog \"foggy goal\"]"
allowed-tools: Read, Write, Edit, Glob, Grep
user-invocable: true
version: "0.2.0"
---

# Task Decomposer

Translate any form of human intent into fully-formed `TASK-NNN` entries. The approved output
serves as the scope gate — `/orchestrator` G1 then runs as a fast-path confirm (scope unchanged?),
not a re-grill.

## Input types

| Input | Detection |
|---|---|
| Freeform — `"add Google OAuth login"` | no URL, no `--` flag |
| Ticket — `JIRA-123` or a Linear/GitHub URL | matches `[A-Z]+-[0-9]+` or a URL |
| PRD — `--prd docs/feature.md` | `--prd` flag + path |
| Epic — `--epic "Payments"` or `--epic EPIC-003` | `--epic` flag + name or id |

For a ticket, fetch the description first (ask the user to paste if credentials are missing — never block on env vars).
**For an epic**, resolve the flag to `docs/epic/EPIC-NNN-<slug>.md` (match on id, else slug, else the
`INDEX.md` row) and **read it before grilling**. **Check `docs/epic/archive/` before concluding it does
not exist** — a closed epic is archived there (§11) and resolving only the live directory would report
a finished epic as never-created, sending the owner to `/lean-doc-generator epic` to re-open work that
is already done. A match in `archive/` is a *closed* epic: say so, and note that new work toward that
outcome opens a **new** epic rather than reopening this one — its Outcome, Scope-Out and Open questions are already-settled
context, so re-asking them is the interview a resolved epic exists to prevent. Decompose only the slice
the owner names, never the whole epic at once: an epic spans sprints by definition, and a Plan holds
~12 tasks. No epic doc for that name → it is not an epic yet; say so and offer `/lean-doc-generator epic`
(nameable outcome) or `--fog` (not yet nameable). **Never create the epic here** — creation is the
generator's job; this skill consumes.

## Procedure

1. **Clarify — the grill** *(freeform / ticket only)* — ambiguity is cheapest to kill at intake. Decisions form a dependency tree; work it in **rounds by frontier**. The frontier is every decision whose prerequisites are already settled — ask **all of it at once** as one **AskUserQuestion popup** (each option with a recommended answer), then recompute the frontier from the answers. **The discriminator is dependency, not count:** batching *dependent* questions is what produces vague answers, because the user must guess at inputs they have not given yet; batching *independent* ones costs nothing and saves a round-trip. Stop when the frontier is empty — every branch visited, nothing silently assumed. **Finding *facts* is your job, never the user's:** an unresolved fact is a prerequisite in the tree, not a question — resolve it yourself (for mature / unfamiliar code, **recon via the `Explore` agent** — existing impl + tests + deps → a tight brief in its own context, a cheap-tier `sonnet` pass; the grill itself stays on the session model. Tier map → `CONTEXT.md`). Only the branch *downstream* of an open exploration waits; the rest of the frontier proceeds. Moves:
   - **Challenge the glossary** — a term conflicts with `CONTEXT.md`? Surface it: "your glossary says X, you seem to mean Y — which?"
   - **Sharpen fuzzy language** — replace an overloaded word ("account", "user") with a precise canonical term; feed a newly-pinned term straight to `/lean-doc-generator` (glossary), don't batch.
   - **Invent edge-case scenarios** — concrete cases that force the boundaries between concepts to be made explicit.
   - **Cross-reference code** — a claim contradicts the code? Surface the contradiction.
   - **A design that must be *felt*, or a high-stakes fork** — don't resolve it here: record it on the task (`assumes:`) so G2 routes to `/prototype` / `/council`.

   Stop when the goal is unambiguous. **Synthesize from context instead of re-interviewing ONLY when step 2's registry comes back with zero open assumptions** (a design discussion just happened and nothing is open); otherwise grill the open ones.
2. **Assumption registry** — list every assumption that affects behavior (auth model, data shape, third-party limits). Confirm the risky ones explicitly.
3. **Decompose into tracer-bullet vertical slices** — each task is a thin path through *every* layer end-to-end (schema → API → UI → tests), independently demoable. Prefer many thin slices over few thick ones; record `depends-on` (or `none`). Set `class:` by nature — ambiguity/consequence → `decision` · implement/research → `execution` · bulk mechanical reads/extraction → `mechanical-ingest`; it's an advisory default the dispatcher may override (ADR-010). Horizontal layers ("write all the models", "all the tests") are NOT valid tasks.
4. **Risk score** — per task, rate impact × likelihood (low / med / high); note the blast radius (files / layers touched).
5. **Classify HITL / AFK** — `HITL` = a human must review the output before proceeding; `AFK` = autonomous completion is safe (acceptance is mechanically checkable · no irreversible side effects · no product/UX judgment call · spec is durable). Default to `HITL` when uncertain. **For `AFK` tasks, spec durably** — an AFK task may sit in the backlog for weeks before an agent picks it up: write behavioral contracts (name the types / interfaces / config shapes to change) + testable acceptance + explicit out-of-scope; **never reference file paths or line numbers** — they go stale.
6. **Validate** — every task has an observable acceptance criterion ("done when …"); no two tasks share identical criteria (merge or differentiate). For multi-slice breakdowns, run the **breakdown quiz** (reference) — confirm granularity, dependencies, merge/split, HITL/AFK — before Write.
7. **Write** — only after the human types `approve`, append entries to `TODO.md` **Backlog** in dependency order (blockers first). Touch no other file. Sprint formation happens later via `/lean-doc-generator promote`.

## Fog-map mode (foggy work too big to plan up front)

When the work is too large/foggy to slice — you can't write acceptance criteria because the *decisions
aren't known* — don't force premature `TASK-NNN`. Run a **pre-decomposition fog-map** (`--fog`, or offer
it when the grill reveals the frontier is unknowable): a living map — **Destination · Decisions-so-far ·
Not-yet-specified (fog) · Out-of-scope** — of **decision-tickets** that resolve *decisions, not
deliverables* (Research·AFK / Prototype·HITL / Grilling·HITL / Task). Each ticket **routes to an existing
skill** (research-spike/`Explore` · `/prototype` · the intake grill · normal decompose) and **graduates
into `TASK-NNN`** once resolved. Loop until no decision is uncertain, then decompose the now-clear work
normally. Full artifact + loop → `${CLAUDE_SKILL_DIR}/references/fog-map.md`.

## Task entry shape

```
- [ ] TASK-042 — <verb-first title>  [size: M] [risk: med] [HITL]
      class:      decision | execution | mechanical-ingest   (advisory default — dispatch may override, ADR-010)
      done-when:  <observable outcome>
      touches:    <files / layers>
      depends-on: <TASK-NNN/Tn list, or none>
      assumes:    <key assumptions>
      origin:     decomposer            (always — these entries met the grill above; that is what earns G1's fast-path)
      state:      ready | needs-info   (set ready only if done-when is concrete)
```

Set the initial `state:` (`ready` if the done-when is concrete, else `needs-info`). Re-prioritising,
re-stating, and pruning the backlog later is `/triage`'s job — don't re-rank existing tasks here.

**`--prd <path>` = CONSUME that file.** It never means "write one" — creation of core docs belongs to
`/lean-doc-generator`. Read the PRD, then decompose it; do not re-interview what it already settles.

**Large features with no PRD yet**: synthesize a **working feature PRD** (Problem · Solution ·
exhaustive User Stories · Implementation + Testing Decisions · Out-of-scope · seams) and get approval,
then decompose against it. That artifact is *intake scaffolding*, not a §2 core file — format + seams +
the breakdown quiz → `${CLAUDE_SKILL_DIR}/references/prd-and-slices.md` (`${CLAUDE_SKILL_DIR}` resolves to this
skill's install directory at load time). Its approved residue belongs in the durable, project-scoped
`docs/product/requirements.md` (+ `acceptance-criteria.md`) — **hand that write to
`/lean-doc-generator prd`**, sanitized, never the raw conversation and never written from here. Task
output stays local (TODO.md Backlog) — no external issue tracker. **End of life:** the working PRD is
temp-dir scaffolding with no durable file of its own — once sliced and its residue sanitized into
`requirements.md`, it is gone, and §11 has no row for it because retention acts on committed files
(STANDARD §2 temp-dir note). Same shape as a `BUG-<slug>.md` report.

## Hard rules

- Never write to `TODO.md` before the human types `approve`.
- After `approve`: Backlog only; never write directly into an Active Sprint.
- Identical acceptance criteria on two tasks → merge or differentiate first.
- A task with no observable acceptance criterion fails validation — rewrite it.
- A question that BLOCKS scope/design is asked here (with its frontier round) or recorded as an explicit `needs-info`/`blocked` with its unblock condition — never parked as a silent `assumes:` or a passive doc note that stalls dev.

## Red flags

| Rationalization | What it actually means |
|---|---|
| "I'll guess the acceptance criteria" | "works correctly" fails validation — write the observable outcome |
| "Skip the assumption registry, it's small" | unconfirmed auth assumptions are the top source of regressions |
| "I'll ask all four now, batching is allowed" | only if they are **independent**. A question whose answer depends on another still-open one makes the user guess — that is what produces vague answers, not the count. Serialise dependents; batch the frontier |
| "These two are related, I'll merge them" | related ≠ same concern — verify the criteria are truly identical |
| "I'll slice it by layer" | horizontal layers aren't demoable — slice vertically |
| "A multiple-choice question pins the term" | an MCQ captures a *preference*, not a *definition* — pin a domain term with a concrete example, then confirm (promoted rule) |
