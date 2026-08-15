---
sprint: 940
slug: quiet-index
owner: Maintainer
last_updated: 2026-08-15
status: active
plan_commit: [sha — set at promote]
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-940 — Quiet Index

> **Theme:** generate a by-tag index for the notes directory so lookups stop being a manual scan.

## Scope

**In:** one generator pass over `notes/` producing `notes/INDEX.md`.
**Out:** watching for changes; anything touching the publishing pipeline.

## Plan

### T1 — Generate the by-tag index `[size: S · risk: low · class: execution · AFK]`
Layers: `notes/INDEX.md`
Depends-on: none

**Acceptance:** `notes/INDEX.md` lists every note under each of its tags, one line per note.

**DoD:**
- [ ] Every note file appears under at least one tag
- [ ] Regenerating twice produces identical output

## Owner-action checklist
- [ ] none

## Decisions (pre-locked)

- **D1 — Tags come from frontmatter only.** Inline hashtags are ignored; one source, no merge rules. **→ no ADR.**

## Assumptions

- **A1** — every note carries a `tags:` frontmatter list. *Confirm: spot-checked 2026-08-15.*

## Execution Log

> Lives in its own file — `docs/sprint/logs/SPRINT-940-quiet-index.md`, created lazily at the first entry.
