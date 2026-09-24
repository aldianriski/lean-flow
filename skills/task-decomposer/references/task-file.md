# Task file — the shape `/task-decomposer` writes

One approved task → **one file**, `docs/work/backlog/TASK-NNN-<slug>.md`, in the work-item store.
Status is the folder, title is the filename, membership is frontmatter; readiness is a field. If the
host repo has `docs/work/README.md`, that schema wins over anything restated here.

## Where, and only there

- New tasks land in **`backlog/`** only. `todo/` · `in_progress/` · `review/` belong to a sprint
  (promote moves files there); `done/` · `cancel/` are closed. Never write into any of them.
- One file per task, never a batch file. A 40-task breakdown is 40 files — no single file grows,
  so there is no container for a line cap to fire on.

## Filename

`TASK-NNN-kebab-slug.md`. After the id only `[a-z0-9-]`: lowercase the title, turn every other
run of characters into one `-`, trim `-` at both ends, keep it short (≈ 6 words). No spaces, no `:`,
no case-only renames — hazards on Windows checkouts and concurrent worktree copies.

## The next id — derived, never remembered

1. List every `docs/work/*/TASK-*.md` from the repo root — **all six folders**, not only
   `backlog/`: a `done/` or `cancel/` id is still in use and is never reused.
2. Take the number after `TASK-` in each filename and in each file's `id:`; compare as **integers**
   (`TASK-1000` > `TASK-999` — a string sort gets this wrong).
3. Next id = max + 1, zero-padded to at least 3 digits (`TASK-001` on an empty store).
4. Root the listing at this repo's own `docs/work/`. A recursive search from the repo root also
   walks `.claude/worktrees/*/` — whole repo copies during isolated dispatch — and returns ids that
   are not rows. A maximum far above the neighbours is contamination until shown otherwise.
5. A breakdown takes consecutive ids from there, **blockers first**, so ids read in dependency order.

The layout check has already refused a tree with `TODO.md` in it, so `TODO.md` is never read here.

## File shape

```
---
id: TASK-042
title: "<verb-first title, full prose>"
epic: EPIC-NNN            # only when the work advances an epic; omit otherwise
priority: P2              # P0–P3 initial tier; /triage re-ranks later
size: S | M | L
risk: low | med | high
autonomy: HITL | AFK
class: decision | execution | mechanical-ingest   # advisory default — dispatch may override (ADR-010)
tier: G | X | P           # guard · executable non-guard · prose (verification bar)
authority: J0 | J1 | J2   # J2 = human-reserved; an unattended run parks on it
origin: decomposer        # always — these entries met the grill; it is what earns G1's fast-path
state: ready | needs-info | blocked
depends-on: [TASK-040, TASK-041]   # or []
---

# TASK-042 — <title>

## Why            (optional — one to three lines)

## Done when

- [ ] <observable outcome>

## Touches

<files / layers — omitted for AFK tasks: name types, interfaces, config shapes instead>

## Assumes

- <key assumption>        (or `none`)
- **open:** <question>     (a needs-info task lists each unanswered question here)
- **blocked-by:** <cond.>  (a blocked task whose blocker is not a task names it here)

## Tracker

<source: epic scope item · PRD user story · ticket id>
```

- **No `status:` field, no `sprint:`.** The folder is the status; `sprint:` is stamped at promote.
- **Readiness is `state:`, never a folder.** A `blocked` or `needs-info` task stays in `backlog/`;
  a `blocked` task names its blocker in `depends-on:` or a `blocked-by:` line.
- `assumes:` from the registry → `## Assumes` lines; the done-when → `## Done when` checkboxes;
  touches → `## Touches`. Nothing from the grill is dropped because it has no field.
