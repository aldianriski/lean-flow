---
owner: Maintainer
last_updated: 2026-07-10
update_trigger: The decision is revisited, or /lean-doc-generator init changes what it scaffolds
status: current
id: init-vs-migrate
tags: [process]
domain: governance
related: []
---

# Does lean-flow need an `init`? — decision (TASK-051)

**Question:** lean-flow's `migrate` adopts an *existing* repo's docs into the standard. A fresh/greenfield
repo has nothing to adopt — is a dedicated `init` (the greenfield twin) worth adding, and should it touch
`.claude/settings.json`?

## Decision (owner, 2026-07-10)

**Add `init` as a `/lean-doc-generator` MODE** (not a new skill — keeps the roster at 14), and make it
**scope-interactive**: lean-flow ships many templates (core + optional DESIGN · RESEARCH · DEPLOY · …),
so a blind full scaffold would dump docs a repo doesn't need. `init` asks **which docs this repo wants**
at first initiate — always the core set, optional docs offered by repo type — so the scaffold is clear
and minimal from the start. **Docs-only: `init` never writes `.claude/settings.json`** (intrusive, can
clobber the consumer's config; the safe-command allowlist stays a documented opt-in snippet).

## Options considered

| Option | Verdict |
|---|---|
| **A — extend `migrate` to cover greenfield** | Rejected. Leaner on paper, but conflates two intents (adopt-existing vs scaffold-fresh) in one command and hides the "which optional docs?" scoping the owner wants surfaced. |
| **B — add `init` as a lean-doc-generator mode** *(chosen)* | Clear intent, scope-interactive at bootstrap, no roster growth (a mode, like promote/close/migrate). |
| **C — no init, document the recipe** | Rejected. Per-file `/lean-doc-generator <type>` works but gives no guided, scoped first-run experience. |

## init ↔ migrate boundary

| | `init` (new) | `migrate` (existing) |
|---|---|---|
| **Precondition** | greenfield — no/empty lean-flow docs | repo already has docs (dev-flow / adlc-flow / ad-hoc) |
| **Action** | scope-interactive scaffold from templates | detect → adopt + clean (consolidate dupes, retire dead) |
| **settings.json** | never | never |
| **Overlap** | none — disjoint preconditions | none |

## Follow-ups

- **TASK-059** — build the `/lean-doc-generator init` mode (scope-interactive, docs-only).
- **TASK-052** (migrate re-runnable) is **unblocked** — migrate stays adopt-existing; the greenfield
  path is TASK-059, so TASK-052's "coordinate the split" assumption is resolved (no overlap).

*Recorded as a decision note, not an ADR — adding a mode is not hard-to-reverse. Graduate to an ADR
only if the init scoping proves a surprising, hard-to-reverse trade-off when built (TASK-059).*
