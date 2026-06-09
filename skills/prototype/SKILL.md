---
name: prototype
description: Use when a design question needs to be felt before committing — sanity-check a state machine / data model / API shape, or mock up a few UI options. Builds throwaway code that answers ONE question, then captures the answer and is deleted. Routes to a terminal logic prototype or web UI variants. Do not use to build the real thing (use /tdd) or to debug (use /diagnose).
argument-hint: "[the design question to answer]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
user-invocable: true
version: "0.1.0"
---

# prototype

A prototype is **throwaway code that answers a question.** The question decides the shape. It slots
into the design stage — when `/orchestrator`'s Grill can't resolve a design on paper, prototype to
feel the answer, then feed it into the plan.

## Pick a branch

Identify the question — from the prompt, the surrounding code, or by asking:

- **"Does this logic / state model / API feel right?"** → terminal logic prototype. A tiny interactive TUI that drives a state machine by hand through cases that are hard to reason about on paper. Full process → `${CLAUDE_SKILL_DIR}/references/logic.md`.
- **"What should this look like?"** → web UI prototype *(web projects only)*. Several radically different UI variations on one route, switchable from a floating bar. Full process → `${CLAUDE_SKILL_DIR}/references/ui.md`.

Wrong branch = wasted prototype. If genuinely ambiguous and the user is unreachable, match the surrounding code (backend module → logic; page/component → UI) and state the assumption at the top.

## Rules (both branches)

1. **Throwaway from day one, clearly marked.** Locate it next to where it'll be used so context is obvious; name it so a casual reader sees it's a prototype, not production.
2. **One command to run** — via the project's existing task runner. No path to remember.
3. **No persistence by default** — state lives in memory. Persistence is the thing being *checked*, not depended on. If the question is about the DB, use a scratch store named `PROTOTYPE — wipe me`.
4. **Skip the polish** — no tests, no error handling beyond runnable, no abstractions, no "what if we need X later". One question.
5. **Surface the state** — after every action (logic) or variant switch (UI), render the full relevant state so the user sees what changed.
6. **Delete or absorb when done** — never leave it rotting in the repo.

## State the question first

Before any code, write the question + the model you're prototyping (one paragraph, at the top of the
prototype or its `NOTES.md`). A prototype that answers the wrong question is pure waste — make it
explicit so it's checkable later, including AFK.

## Capture the answer (the only thing worth keeping)

When it's answered its question, record **the answer + the question** somewhere durable, then delete
or absorb the prototype:
- A genuine design decision → an **ADR** (hard-to-reverse + surprising + a real trade-off).
- A decision-rich snippet (state machine, schema, type shape) → feed it into `/task-decomposer`'s PRD (its Implementation Decisions already cite "a prototype produced a snippet").
- Otherwise → a `NOTES.md` next to the prototype with the verdict, filled before deletion.

## Red flags

❌ **A prototype with tests** — it's no longer a prototype; that's `/tdd`.
❌ **Wiring to the real database / real mutations** — use an in-memory or stub store.
❌ **Generalising** — "support X later" defeats the point; answer one question.
❌ **Shipping the shell to production** — the TUI shell / variant switcher is hand-driven scaffolding; only the validated logic (or winning variant, rewritten) folds in.
❌ **Leaving it in the repo unanswered** — capture the verdict, then delete or absorb.
