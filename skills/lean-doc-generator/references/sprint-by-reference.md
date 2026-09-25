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

An edit is legitimate only when the sprint's Execution Log (its `logs/` file, or the sprint file's own
`## Execution Log`) carries a **`scope-change` entry** — the event field of its
`### date | scope-change [| summary]` heading — that is **new since `plan_commit`** and names that
TASK id, or a `Tn` **in its heading** whose frozen Plan block `Cites:` it. These do not count:
- a prose mention of the id under another event;
- an entry inside an HTML comment;
- an entry that was already in the log at the baseline.

The log is append-only. "New" means **appended after** the baseline's text. If an old entry is
reworded, or the baseline text is no longer a prefix of today's log, that is a finding
(`LOG-REWRITTEN`), and it excuses nothing. The log's frontmatter is metadata, so bumping
`last_updated` is not a rewrite. Naming is lexical: an entry that mentions an id counts as
naming it, whatever the prose around it says. The same holds for the ` ✓ …` tail on a ticked box.
The reader of the log is the check on both.

**The freeze point is fixed too.** `plan_commit` must be an ancestor of `HEAD` and must already
contain the sprint file. It may be no later than any sign that the sprint had started:
- the sprint file first set to `status: active`;
- the sprint file first listing a member;
- the sprint file first recording a `plan_commit`;
- a member file first stamped with the sprint.

A repair that points it **earlier** is fine. Pointing it **later** is not, and neither is recording it
late, because either one re-freezes the edits in between. Every read at an older commit resolves the
sprint file and its log **at that commit**, so archiving or renaming either file changes nothing. A
log that was not renamed with its sprint is found through its own `sprint:` frontmatter. Create the
sprint file **at** promote. A draft committed earlier that already lists members makes any later
`plan_commit` read as late.

**Membership can change, but only on the record.** A member present at `plan_commit` (on
`## Members` or stamped) that has since left both indices is **scoped out**. That needs a
`scope-change` entry naming it. A task that joins after `plan_commit` needs one too, and its
baseline is the first commit that stamps or lists it, so its later edits need a newer entry.

## Detecting a post-promote edit (plain git — run it anywhere)

1. **Population** — every TASK id on `## Members` (any line shape) or stamped `sprint:` with this
   sprint (`SPRINT-NNN`, `NNN`, quoted, with a `# comment`), read **both** at `plan_commit`
   (`git show <plan_commit>:<sprint file>`) and now. Apply the membership rule above to any id in
   only one of the two.
2. Find each member **by id** in its baseline tree so that folder moves do not matter:
   `git ls-tree -r -z --name-only <baseline> docs/work/` gives the one path whose filename starts
   with `TASK-NNN-`. The trailing hyphen keeps `TASK-36` from matching `TASK-360`.
3. Read it at the baseline (`git show <baseline>:<path>`) and from disk now. In each copy, take
   **every** `## Done when` section, ignoring `## ` lines inside code fences. If there is none on
   either side, that is a finding, never a pass.
4. Compare line by line, ignoring blank lines, trailing space, line endings, the tick state of
   `[ ]`/`[x]` boxes (`-`, `*`, `+` or numbered), and the ` ✓ …` tail that a tick appends after the
   frozen text.
5. Equal means the member holds the freeze. Different passes only under the scope-change rule
   above. Otherwise it is an **unlogged post-promote edit**, and the sprint cannot close on it.
6. A member that resolves to no file (or to two) at its baseline or now is itself a finding.

## Close by reference

`close` verifies **every member sits in `docs/work/done/` or `docs/work/cancel/`** — it never counts
Plan boxes (there are none to count) — and re-runs the freeze check above. A member still in
`todo/`, `in_progress/` or `review/` blocks close; first finish it, `git mv` it to `cancel/`, or
scope it out (a `scope-change` entry, then its `sprint:` cleared and its `## Members` line removed).
Then the Retro and the rest of the close row proceed as written.

A project that keeps an automated gate can run steps 1–5 and the folder check as one command; the
procedure above is the contract that command implements.
