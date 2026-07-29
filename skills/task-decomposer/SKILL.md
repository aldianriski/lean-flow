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
| Epic — `--epic "Payments"` | `--epic` flag + name |

For a ticket, fetch the description first (ask the user to paste if credentials are missing — never block on env vars).

## Procedure

1. **Clarify — the grill** *(freeform / ticket only)* — ambiguity is cheapest to kill at intake. Ask ONE question at a time (surface it as an **AskUserQuestion popup**, never inline prose), each with a recommended answer; explore the codebase before asking. For mature / unfamiliar code, **recon first via the `Explore` agent** (existing impl + tests + deps → a tight brief, in its own context — a cheap-tier `sonnet` pass; the grill itself stays on the session model. Tier map → `CONTEXT.md`). Moves:
   - **Challenge the glossary** — a term conflicts with `CONTEXT.md`? Surface it: "your glossary says X, you seem to mean Y — which?"
   - **Sharpen fuzzy language** — replace an overloaded word ("account", "user") with a precise canonical term; feed a newly-pinned term straight to `/lean-doc-generator` (glossary), don't batch.
   - **Invent edge-case scenarios** — concrete cases that force the boundaries between concepts to be made explicit.
   - **Cross-reference code** — a claim contradicts the code? Surface the contradiction.
   - **A design that must be *felt*, or a high-stakes fork** — don't resolve it here: record it on the task (`assumes:`) so G2 routes to `/prototype` / `/council`.

   Stop when the goal is unambiguous. **Synthesize from context instead of re-interviewing ONLY when step 2's registry comes back with zero open assumptions** (a design discussion just happened and nothing is open); otherwise grill the open ones.
2. **Assumption registry** — list every assumption that affects behavior (auth model, data shape, third-party limits). Confirm the risky ones explicitly.
3. **Decompose into tracer-bullet vertical slices** — each task is a thin path through *every* layer end-to-end (schema → API → UI → tests), independently demoable. Prefer many thin slices over few thick ones; record `depends-on`. Horizontal layers ("write all the models", "all the tests") are NOT valid tasks.
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
      done-when: <observable outcome>
      touches: <files / layers>
      assumes: <key assumptions>
      state:   ready | needs-info   (set ready only if done-when is concrete)
```

Set the initial `state:` (`ready` if the done-when is concrete, else `needs-info`). Re-prioritising,
re-stating, and pruning the backlog later is `/triage`'s job — don't re-rank existing tasks here.

**Large features / `--prd`**: synthesize a PRD first (Problem · Solution · exhaustive User Stories ·
Implementation + Testing Decisions · Out-of-scope · seams), get approval, then decompose. Full PRD
template + seams + the breakdown quiz → `${CLAUDE_SKILL_DIR}/references/prd-and-slices.md` (`${CLAUDE_SKILL_DIR}` resolves to this skill's install directory at load time). The approved PRD's
durable home is `docs/product/requirements.md` (+ acceptance criteria →
`docs/product/acceptance-criteria.md`), per DOCS_Guide §2 — sanitize before saving, never the
conversation alone. Task output stays local (TODO.md Backlog) — no external issue tracker.

## Hard rules

- Never write to `TODO.md` before the human types `approve`.
- After `approve`: Backlog only; never write directly into an Active Sprint.
- Identical acceptance criteria on two tasks → merge or differentiate first.
- A task with no observable acceptance criterion fails validation — rewrite it.
- A question that BLOCKS scope/design is asked here (one at a time) or recorded as an explicit `needs-info`/`blocked` with its unblock condition — never parked as a silent `assumes:` or a passive doc note that stalls dev.

## Red flags

| Rationalization | What it actually means |
|---|---|
| "I'll guess the acceptance criteria" | "works correctly" fails validation — write the observable outcome |
| "Skip the assumption registry, it's small" | unconfirmed auth assumptions are the top source of regressions |
| "Four questions at once is faster" | stacked questions get vague answers — one at a time forces precision |
| "These two are related, I'll merge them" | related ≠ same concern — verify the criteria are truly identical |
| "I'll slice it by layer" | horizontal layers aren't demoable — slice vertically |
| "A multiple-choice question pins the term" | an MCQ captures a *preference*, not a *definition* — pin a domain term with a concrete example, then confirm (promoted rule) |
