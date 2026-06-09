---
name: handoff
description: Use when ending a session mid-work and a fresh agent (or future you) needs to pick it up — context budget running out, a task blocked, or a deliberate stop. Compacts the live conversation into a handoff document saved to the OS temp dir, with a suggested-skills section and references to durable artifacts. Do not use to record durable project state — that is /lean-doc-generator close (sprint record) or a commit.
argument-hint: "[what the next session will focus on]"
allowed-tools: Read, Write, Bash, Glob, Grep
user-invocable: true
version: "0.1.0"
---

# handoff

Compact the current conversation into a handoff document so a fresh agent can continue without
re-deriving everything. **Transient, not durable** — this is the conversation's working state, not a
project record. Pairs with `/prime`: handoff out at session end → `/prime` + read the handoff in.

## When to invoke

- Context budget is running low and work is unfinished.
- A task is blocked and the next session will resume it.
- A deliberate stop mid-task, or a planned agent-to-agent handoff.

Not a substitute for `/lean-doc-generator close` (durable sprint record + CHANGELOG) or a commit.

## Where it saves

Write to the **OS temp directory, not the workspace** — a handoff is throwaway and must not pollute
the repo or git status. Resolve temp per platform:
- Windows: `$env:TEMP` (e.g. `C:\Users\<you>\AppData\Local\Temp`)
- macOS / Linux: `$TMPDIR` or `/tmp`

Filename: `handoff-<short-slug>.md`. Emit the absolute path so the next session can read it.

## What goes in

1. **Goal / focus** — what this work is trying to achieve. If the user passed an argument, treat it as the next session's focus and tailor the doc to it.
2. **State** — what's done, what's in progress, what's left. Be concrete (files touched, decisions made).
3. **Next steps** — the ordered list the next agent should start with.
4. **Blockers / open questions** — anything unresolved, with what's needed to unblock.
5. **Suggested skills** — which skills the next agent should invoke (e.g. `/prime` first, then `/orchestrator` to resume, `/diagnose` for the failing test).
6. **References — do not duplicate** — point to durable artifacts by path or URL (PRDs, ADRs, the sprint file, commits, diffs, issues). Summarize only what is NOT already captured elsewhere.

## Hard rules

- **Redact secrets** — never write API keys, passwords, tokens, or PII into the doc.
- **Reference, don't copy** — if it's already in a commit / ADR / sprint file / issue, link it; don't restate it.
- **Temp dir only** — never write the handoff into the workspace or stage it in git.
- **Transient** — the doc captures conversation state; durable decisions still belong in DECISIONS.md / CHANGELOG via `/lean-doc-generator`.

## Output format

```
=== HANDOFF WRITTEN ===
Path:  <absolute temp path>
Focus: <one line>
Next:  open a fresh session → /prime → read the handoff path above → resume
=======================
```

## Red flags

❌ **Writing into the repo** — handoffs are throwaway; they belong in the OS temp dir.
❌ **Duplicating a PRD / ADR / diff** — reference it by path; don't restate it.
❌ **Leaking a secret** — redact every credential and PII before saving.
❌ **Using this for durable state** — sprint records and decisions go through `/lean-doc-generator`, not here.
