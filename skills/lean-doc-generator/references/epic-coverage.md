# Coverage — every open condition of an active epic, and every active roadmap row, is covered

The procedure behind the `epic` and `promote` rows of SKILL.md. The rule itself is the standard's
(`spec/STANDARD.md` § 2, *Epic coverage* and *Roadmap coverage*); this is how to apply it. One procedure, two sources: **A** an active epic's open Closed-when lines, **B** a roadmap's `active` rows. **Read-only until the owner acts.**

## The rule in one line

An epic with `status: active` may not carry an open `- [ ]` § Closed-when condition that nothing is
going to deliver. `status: proposed` epics are exempt (a plan, not admitted scope); `[x]` conditions need nothing.

## The mark

Each open condition **ends** with one of (the epic file alone holds its coverage — no condition numbers,
no back-reference from the task):

- `→ TASK-NNN` or `→ TASK-NNN, TASK-MMM` — the open task(s) that deliver it
- `→ next slice: <name>` — a slice named in the epic but not yet cut into tasks

A condition may span several lines; the mark is on the **last** line of the item (the `- [ ]` line plus
its indented continuation lines).

## Check (per active epic)

1. Glob `docs/epic/EPIC-*.md` (not `archive/`). None, or no `docs/epic/` → report `no epics` (source B still runs);
   never an error. Keep only files whose frontmatter has `status: active` — **plus, at promote, any epic this promote would activate** (judge it as active now, never as still-proposed).
2. Take every `- [ ]` item under `## Closed when`. Skip `[x]` items.
3. Read the item's mark and classify it:

| Mark | Verdict |
|---|---|
| none, or an empty `next slice:` | **uncovered** — unmarked |
| `next slice: <name>` | covered |
| `TASK-…` ids | for each id find `docs/work/*/TASK-<id>-*.md` (match by number, zero-padded ids count): covered if **at least one** sits in `backlog/` · `todo/` · `in_progress/` · `review/` |
| every named id is in `done/` or `cancel/`, or has no file | **uncovered** — stale coverage (name which: done · cancelled · missing) |

4. Report one line per uncovered condition: `EPIC-NNN · "<first ~60 chars of the condition>" · uncovered (<unmarked | stale: TASK-NNN done | missing: TASK-NNN>)`; otherwise `EPIC-NNN · fully covered (N open, N mapped)`.
   Cross-check before acting on it: open items counted by the scan = covered + uncovered reported.

## Source B — roadmap rows

Read `docs/product/roadmap.md` (legacy: `docs/roadmap.md`); none → report nothing, never an error. In its
`## Delivery sequence` table take each row whose `Status` is `active` (`planned` and `done` are exempt). Row id
= the leading token of the first cell; read the `Covered by` cell and classify it:

| Covered by | Verdict |
|---|---|
| empty | **uncovered** — unmarked |
| `next slice: <name>` | covered |
| `EPIC-NNN` | covered if `docs/epic/EPIC-NNN-*.md` has `status: active`, else **uncovered** — stale: EPIC-NNN not active |
| `TASK-…` ids | as the task rule above: covered if ≥1 sits in `backlog/` · `todo/` · `in_progress/` · `review/`; else stale (`TASK-NNN done`) or `missing: TASK-NNN` |

Covered if **any** named mark is valid; stale only when none remains. Report one line per uncovered row:
`roadmap · <row> · "<usable outcome, ~60 chars>" · uncovered (<unmarked | stale: TASK-NNN done | stale: EPIC-NNN not active | missing: TASK-NNN>)`;
otherwise `roadmap · fully covered (N active, N mapped)`. Cross-check: active rows counted = covered + uncovered.

## Where each caller uses it

- **Epic activation** (setting `status: active` — at creation or at the first member-sprint promote): run the
  check and list the uncovered conditions. Activation at creation is not blocked, but the next promote is; activation **by** a promote is judged in that same promote (step 1), so it is blocked there.
- **Promote** — emit `☐ epic coverage (every active epic): <findings|none>` and `☐ roadmap coverage: <findings|none>` in the Governance checklist. Roadmap findings are **reported for the owner to sign, never a refusal**; the refusal below is epic-only.
  - An active epic **this sprint touches** (the sprint's `epic:` frontmatter, or any chosen member's `epic:`
    stamp) with an uncovered condition → **refuse to render the sprint**. Resolve by annotating the epic
    (`→ TASK-…` after the task exists, or `→ next slice: …`), or by an **owner override**: the owner says so
    at the checklist, and the first Execution Log entry of the new sprint records it as
    `### <date> | scope-change | epic-coverage override: EPIC-NNN "<condition>" — <owner's reason>`.
  - An uncovered condition in an epic the sprint does **not** touch is listed, never blocking.
  - Unattended: promote already parks (HITL); a headless run never records an override.
- `/triage` and `/prime` run the same read (both sources) for their own reports; they never edit an epic or the roadmap.
