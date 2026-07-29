---
name: prime
description: Use when starting a new session and want to load project context in a deterministic order — CLAUDE.md, CONTEXT.md, README, MEMORY index, active sprint, ARCHITECTURE map. Emits a health check showing which files were found versus missing. Everything degrades gracefully; nothing aborts. Do not use for mid-session orientation — re-read the specific file instead.
argument-hint: ""
allowed-tools: Read, Glob, Grep
user-invocable: true
version: "0.2.0"
---

# prime

Ordered context loader + health check. One-shot session priming. Read-only — never writes.

## When to invoke

- First action of a fresh session, before any code-touching work.
- After `/clear` to reload context without restarting.
- When the session feels stale and you want to confirm what state you are operating against.

## Read order

Read each that exists, in order. Mark `[OK]` / `[MISSING]` per item. All are optional —
absence is reported, never fatal. Canonical placement (DOCS_Guide §2) is listed first; legacy
locations second. Adapt the globs to the host project's layout.

| # | Path (first match wins) | Purpose |
|---|---|---|
| 1 | `.claude/CLAUDE.md`, `CLAUDE.md` | Project instructions, anti-patterns, conventions |
| 2 | `.claude/CONTEXT.md`, `CONTEXT.md` | Vocabulary · gates · modes (if the project uses one) |
| 3 | `README.md` — *presence-check by default* | Front-door (humans); overlaps 1·2·6 → **full read deferred** (note below) |
| 4 | MEMORY index (harness-resolved; fallback: `memory/MEMORY.md`, `.claude/memory/MEMORY.md`) | Sprint state, feedback, references |
| 5 | `TODO.md`, `TECH-DEBT.md`, `docs/sprint/SPRINT-*.md` | Active task list + debt ledger — frontmatter + open `- [ ]` items only |
| 6 | `docs/architecture/overview.md`, `docs/ARCHITECTURE.md`, `ARCHITECTURE.md` | Module map / where-things-live (the durable map) |

**README is a fallback (token discipline).** It is the human front-door and overlaps CLAUDE.md (1) +
CONTEXT.md (2) + ARCHITECTURE.md (6). Stat its presence for the health line, but **read its full
content only when CLAUDE.md *or* CONTEXT.md is MISSING** (then it is the best available overview).
Why: the README duplicates CLAUDE.md/CONTEXT.md/ARCHITECTURE.md content, so reading it in full doubles
the priming token cost for near-zero new signal.

**Resolution**: read `TODO.md` (the Backlog pool); follow its § Active Sprint pointer (format: `> **SPRINT-NNN — <name>** → docs/sprint/SPRINT-NNN-<slug>.md`) — a
multi-stream repo lists one pointer per stream — to each active `docs/sprint/SPRINT-NNN-<slug>.md`
and read only its frontmatter + Plan (~50 lines). Count open **DoD `[ ]`** across all active
sprints (report per stream when more than one, e.g. `Tasks: 5 open (main: 3 · payments: 2)`); if
no sprint is active, fall back to the Backlog.
**Resuming from a `/handoff`?** Also read the handoff doc at the temp path it printed.

## Steps

1. Read each path in order; track found/missing.
2. From the active task list, count open `- [ ]` tasks.
3. Emit the health report (below) — health check ONLY, no inline file summaries.
4. Emit one `Next:` line:
   - open tasks exist → `/orchestrator` to continue
   - no open tasks but the backlog has `state: ready` tasks → `/lean-doc-generator` to promote / close
   - backlog exists but nothing is `state: ready` (blocked/needs-info/ungroomed) → `/triage` to groom
   - nothing tracked yet → `/task-decomposer "<intent>"`

## Output format

```
=== PRIME HEALTH ===
[OK]      CLAUDE.md
[OK]      CONTEXT.md
[OK]      README.md
[MISSING] MEMORY index
[OK]      TODO.md
[OK]      ARCHITECTURE.md
Tasks:    3 open
Next:     /orchestrator — continue the 3 open tasks
====================
```

## Red flags

❌ **Reading files outside the declared slots** (beyond a referenced handoff) — adds noise; not this skill's job.
❌ **Aborting on a missing file** — everything is optional; `[MISSING]` is the correct response.
❌ **Summarizing file contents inline** — emit the health check only; files are already in context for downstream skills.
❌ **Reading a full sprint file** — frontmatter + active section is enough for priming.
❌ **Running mid-task** — this is for session priming; mid-task use signals context drift.
