---
owner: Maintainer
last_updated: 2026-09-24
update_trigger: A field, section, folder, or the filename rule changes under docs/work/
status: current
---

# docs/work/ — work-item store schema

The schema for `docs/work/`. One fact, one place — status in the folder, title in the filename,
membership in frontmatter (EPIC-017 D1, `ADR-045`). Formalises the provisional schema the 26
task files already used; it does not redesign it.

## The three axes (+ one orthogonal field)

- **Status** — which folder a file sits in. Exactly one of the six below. Never restated in
  frontmatter or in the file body.
- **Title** — the filename slug (`TASK-NNN-kebab-slug.md`). The frontmatter `title:` field carries
  the same title as full prose for display; it is not a second, independently-renameable title.
- **Membership** (sprint, epic) — frontmatter only: `sprint:` / `epic:`. See § Membership below.
- **Readiness** (`state:`) — orthogonal to status. A `ready` task can sit in any of the six
  folders; `state:` and the folder never encode the same fact.

## The six folders

| Folder | Meaning |
|---|---|
| `backlog/` | Not yet scheduled into a sprint |
| `todo/` | Scheduled (`sprint:` set), not yet started |
| `in_progress/` | Actively being worked |
| `review/` | Work done, awaiting review or merge-back |
| `done/` | Closed, complete |
| `cancel/` | Closed, will not be done |

Vocabulary adopted verbatim from `kerjaan` (EPIC-017 "Reference adopted").

## Filename rule

`TASK-NNN-kebab-slug.md`. After the id: `[a-z0-9-]` only. No spaces, no reserved characters (e.g.
`:`), no case-only renames — live hazards on Windows checkouts with concurrent
`.claude/worktrees/` copies.

## Frontmatter fields

`id · title · epic · sprint · priority · size · risk · autonomy · class · tier · authority ·
origin · state · depends-on`. `sprint:` / `epic:` may be absent (a plain backlog file usually has
neither).

## Membership

`sprint:` at most one per file, `epic:` at most one per file — a task belongs to a single sprint
and a single epic at a time (re-scoping a task is an edit to the field, not a second value beside
the first). Membership is never nested under a status folder (a `docs/work/<sprint>/<status>/` or
`<status>/<sprint>/` layout) — status is the one axis a folder encodes for free; nesting a second
axis under it would answer "what does this sprint contain?" with one glob but cost the query that
matters more: "what is in `review/`, across every sprint?" would then require scanning every
sprint's subtree instead of staying one glob (ADR-045 D1).

## Sections

`## Why` (optional) · `## Done when` · `## Amended <date>` (optional) · `## Touches` ·
`## Assumes` · `## Tracker`.

## Transitions

A status change is a `git mv` to the destination folder, in its own commit; a content edit never
shares that commit (D6, ruled at SPRINT-106 G2). `git mv` keeps rename detection, so
`git log --follow` shows the file's full history across every folder it has occupied.
