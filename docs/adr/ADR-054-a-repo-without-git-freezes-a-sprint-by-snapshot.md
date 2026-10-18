---
id: ADR-054
tags: [process]
domain: governance
status: accepted
related: [ADR-014, ADR-034, ADR-045, ADR-047]
---

<!-- One ADR per file · append-only (never edit a decided ADR — mark it deprecated/superseded) · WHY only. -->

# ADR-054 — A repo without git freezes a sprint by a snapshot in its promote entry

- **Status:** accepted (2026-10-18, owner)
- **Deciders:** Maintainer
- **Context driver:** `plan_commit` is the freeze, so a repository without git cannot promote, sign or close a sprint at all

## Context

ADR-047 made `plan_commit` the freeze: git already holds every member's `## Done when` exactly as approved, so nothing is copied
beside it. That is the right call wherever git exists, and it leaves the lifecycle undefined wherever it does not. Without git there
is no `plan_commit` to set, no `git show <plan_commit>:<file>` to compare a member against, no sha for `gates_signed:` and no
`close_commit`. ADR-045 D6's "a status change is its own commit" has no commit to be.

The first outside consumer, workdoo, has no `.git`. It records its gates as dated prose under `## Assumes` on one-off tasks and
cannot freeze a sprint, because the freeze is a git object it does not have (consumer evidence, ADR-053). The standard has no
sentence for this case, so an adopter in that position either invents a record or skips the freeze. Either way, nothing a later
reader can check says what was approved.

## Decision

1. **Git-less mode is detected, never declared.** A procedure is in git-less mode when `git rev-parse --git-dir` fails in the repo
   root. There is no flag and no config: a setting can drift from the tree it describes, and the command cannot.
2. **The freeze is a verbatim snapshot in the promote entry.** Without git, `promote` copies each member's `## Done when` into the
   Execution Log's `promote` entry, one block per member headed by its TASK id, and sets `plan_commit: none (no git)`. That block is
   the approved text. Tick and close compare each member's live `## Done when` against it, with ADR-047's normalisation (tick state,
   the ` ✓ <evidence>` a tick appends, and line endings are ignored). Any other difference needs a `scope-change` entry naming the
   id, written **after** the promote entry. The order of entries in the append-only log stands in for the order of commits.
3. **Dates stand in for shas.** `gates_signed: <GATE>[,<GATE>] @ <YYYY-MM-DD>` records a sign-off, on a sprint or on a task.
   `close_commit: none (no git) · closed <YYYY-MM-DD>` records a close, and the archive INDEX line carries the same date.
   Status moves are plain file moves. With no commit to bound them, the move itself is the record.
4. **One engine behaviour change, ruled under ADR-034.** `S9.GATESWELLFORMED` accepts the date form **only when the tree is not a git
   repository**. In a git repository a date is still malformed, so no git tree's verdict moves. A git-less tree's correctly dated
   record moves fail → pass. The rule id, its finding ids and its severity are unchanged (owner ruling at SPRINT-127 G2).
5. **No rule reads the snapshot yet.** `S9.PLANFROZEN` and `S9.SCOPECHANGE` stay "history unavailable" notes without git; the
   `S9.PLANFROZEN` note names the promote-entry snapshot as where the frozen text lives. A rule that compares against it is debt,
   to be built when a git-less adopter needs a tool rather than a reader to hold the freeze (owner ruling 2026-10-18).

## Consequences

**Positive:**
- A repository without git can run promote → execute → close by the shipped procedures, and its approvals live in its files.
- A git repository is untouched: every git-mode rule, field and procedure keeps its meaning, and the engine's verdicts on it do not
  move.
- The snapshot holds the approved text itself, so a reviewer can show what changed, not only that something did.

**Negative (trade-offs accepted):**
- The freeze is only as strong as the log's append-only discipline. Git makes an edited past entry visible, and a git-less tree
  does not, so a rewritten promote entry passes unseen.
- Without git the freeze has no mechanical check: until the debt in decision 5 is paid, it holds only if the procedure is followed.
- The snapshot is a copy, which ADR-047 avoided. It can drift from the member only by an edit, and that edit is exactly what the
  freeze exists to catch.

## Alternatives considered

| Option | Why rejected |
|---|---|
| A content hash of each `## Done when` in the sprint frontmatter | It proves that a box changed and loses what it said. With no history, the approved text is gone and a scope-change review has nothing to compare against (owner ruling 2026-10-18). |
| No freeze without git | The DoD becomes silently editable mid-sprint, which is the failure ADR-047 exists to stop. |
| Require git to run a sprint | The standard governs documentation, not version control, and its first outside consumer has no git. A one-off task would still lose its sign-off. |
| A `vcs: none` config field | A declared mode can disagree with the tree. Detection by command cannot. |
