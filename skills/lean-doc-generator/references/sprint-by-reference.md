# Sprint by reference — promote, the freeze, close

A v2 sprint (`docs/work/` store) **references** its member task files; it never copies them. Each
task's DoD lives in exactly one place — the member file's `## Done when` — so there is no second copy
to tick, mirror or drift (ADR-047). This file is the procedure behind the `promote` and
`close` rows of the Sprint lifecycle table.

## Promote by reference

1. Pick the `state: ready` tasks from `docs/work/backlog/` (governance review and size-check first, as
   the lifecycle row says).
2. **Move** each member `backlog/ → todo/` with `git mv`, all moves in **their own commit** — a
   status change never shares a commit with a content edit (ADR-045).
3. **Stamp** each member's frontmatter `sprint: SPRINT-NNN`, and write the sprint file from
   `templates/SPRINT.md.template`:
   - `## Members` — one path per member file, by reference.
   - `## Plan` — one `Tn` block per unit of work carrying **only sprint-scoped meta**: the header
     meta (`size · risk · class · HITL|AFK · J-class`), `Layers:`, `Depends-on:`, `Cites:` (naming
     the member `TASK-NNN` it delivers), one to three lines of WHY, and `**Acceptance:**`. **No DoD
     checkboxes** — those are the member file's, and a copy here drifts, because only one of the two
     ever gets ticked.
4. Commit the stamp + sprint file as `sprint(N): plan locked`, then record **that commit's sha** as
   `plan_commit:` — the first commit in which both the Plan and the stamped members exist.

## What `plan locked` pins — the freeze

`plan_commit` **is** the frozen snapshot. No hash or copy is stored beside it: git already holds every
member exactly as approved, at that commit. What is frozen is each member's `## Done when` **text**:

- **Not an edit:** ticking a box (`[ ]` → `[x]`) and the ` ✓ <evidence>` a tick appends · moving the
  file between status folders · a `## Amended <date>` section (it sits outside `## Done when`) ·
  frontmatter changes · line endings.
- **An edit:** any other change to the `## Done when` body — a box added, removed or reworded.

An edit is legitimate only when the sprint's Execution Log carries a **`scope-change` entry** — the
event field of its `### date | scope-change | summary` heading — **naming that TASK id**, appended
before or with the edit. A prose mention of "scope-change" under another event does not count.

## Detecting a post-promote edit (plain git — run it anywhere)

For each member id (the ids on `## Members`, plus every `docs/work/*/TASK-*.md` stamped with this
sprint — take the union, so drift in one index still selects the member):

1. Find the member **by id** in the frozen tree, so later folder moves do not matter:
   `git ls-tree -r --name-only <plan_commit> docs/work/` → the one path whose filename starts
   `TASK-NNN-` (the trailing hyphen keeps `TASK-36` from matching `TASK-360`).
2. Read it as frozen: `git show <plan_commit>:<that path>`; read the current file from disk.
3. Take the `## Done when` section of each (up to the next `## ` heading); in both, rewrite `[x]`/`[X]`
   to `[ ]`, drop the ` ✓ …` tail of a ticked line, normalise line endings, trim trailing space.
4. Equal → the member holds the freeze. Different → it passes only if a `scope-change` entry names
   that id; otherwise it is an **unlogged post-promote edit**, and the sprint cannot close on it.
5. A member that resolves to no file (or to two) at `plan_commit` or now is itself a finding.

## Close by reference

`close` verifies **every member sits in `docs/work/done/` or `docs/work/cancel/`** — it never counts
Plan boxes (there are none to count) — and re-runs the freeze check above. A member still in
`todo/`, `in_progress/` or `review/` blocks close; first finish it, `git mv` it to `cancel/`, or
scope it out (a `scope-change` entry, then its `sprint:` cleared and its `## Members` line removed).
Then the Retro and the rest of the close row proceed as written.

A project that keeps an automated gate can run steps 1–5 and the folder check as one command; the
procedure above is the contract that command implements.
