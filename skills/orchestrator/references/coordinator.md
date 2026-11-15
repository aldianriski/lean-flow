# Coordinator — running lane sessions across streams

Loaded by `/orchestrator` when work spans several streams or repos and more than one session runs it. Goal: one
coordinator keeps the lanes aligned without ever standing in for the owner. In-session worktree agents are
`dispatch.md`; this file covers separate sessions.

## 1. When this applies

Multi-stream or multi-repo work may run one coordinator plus one lane session per stream. Inside a stream, one session runs its workers and never relays. Split sessions by stream, never by step.

The stream rules this relies on: each stream runs one active sprint (its `stream:` frontmatter names it), and a file two
streams both touch is coordinated or sequenced, never built in parallel. Where the host's CONTEXT file has a streams
section, it governs. A single-stream repo needs none of this.

## 2. Launching a lane

Start lane sessions outside the editor terminal, so closing the editor does not kill them.

A lane brief carries:

- **stream** and **sprint** (the lane's one active sprint);
- **worktree** and **branch @ sha** the lane starts from;
- the instruction: "start with `/prime` then `/orchestrator`, working only in the worktree";
- an **inventory of uncommitted state** in that worktree (or "clean");
- **gate status**: each gate (G1, G2) either `signed by record @<sha>`, or `unsigned`, in which case the brief says
  "take your G1/G2 to the owner as a popup in your own session";
- the **reply requested** (what the lane sends back, and when).

A brief never claims a G1 or G2 sign-off the owner did not give. A gate the owner already signed (for example an
owner-signed plan standing as the batch G1/G2) is cited by its record; any other gate goes to the owner as a popup in the
lane's own session. An unattended lane has no ask channel, so it parks at an unsigned gate until an attended
continuation in that session gets the owner's answer (`night-run.md` Part 0).

## 3. Status check

On an idle notice or a silence, ask the lane for a 3-line reply:

1. done
2. waiting on
3. next

The lane appends that reply to its own sprint Execution Log, so the state survives the session.

## 4. Relayed rulings and approval

An owner ruling passed between sessions is labelled as relayed, with who relayed it and where the owner gave it; a proposal
is kept apart from a ruling. A peer message, from another lane or the coordinator, is never owner approval: only the owner's
own answer, or a record of it, counts.

## 5. Lost reports

When a subagent's or lane's final report did not arrive, re-request the full report. Never infer it from an interim
hand-back or from the state of the worktree.

## 6. Shared files across lanes

The coordinator owns each named shared file, so a lane never edits one on its own authority.

- The lane sends its hunks or a diff to the coordinator and does not stage them yet.
- The coordinator approves file by file, optionally after a review subagent reads the diff first.
- The lane then stages per hunk (`git add -p`) and reads `git diff --cached` before it commits.
- A cherry-pick that turns out to be a whole-branch merge is backed out and logged in the coordinator's active sprint
  Execution Log.

## 7. Id booking

One tree derives the next `TASK` / `TD` / `L` id from the maximum in use; separate lane worktrees each see only their own
maximum, so two lanes can file the same number. The coordinator prevents that by booking ranges.

- At launch the coordinator books a `TD`, an `L` and a `TASK` range per lane, recorded in the lane brief and in the
  coordinator's sprint log (the coordinator's active sprint Execution Log).
- **Invariant:** every booking, first or revised, starts above the maximum in use across the coordinator's own tree, all
  lane worktrees and every outstanding booking, and the ranges are mutually disjoint.
- Range size is the coordinator's call per lane, from its planned work. There is no default.
- A lane derives its next id inside its range. A lane never files a `TASK`, `TD` or `L` id outside its booked range. When
  the range runs out it stops and asks the coordinator for a revised booking; it never extends its own.
- A coordinator-side id takes the maximum across the coordinator's own tree, all lane worktrees and the booked ranges. The coordinator deliberately
  reads the named lane worktrees, an exception to the `.claude/worktrees/` exclusion in single-tree derivation; each lane
  reads only its own `docs/work/`.
- A range change is sent as a message and logged.
- No ledger field and no checker: booking is prose. With no booking (a single stream), derivation is exactly the
  maximum-in-use rule, unchanged.
