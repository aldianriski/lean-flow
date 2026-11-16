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

The coordinator proposes a brand-new lane (stream, sprint, worktree, why) in one popup. On the owner's yes it launches
the lane with `claude --bg`. That popup yes is the authority for a new lane; gate status still follows the rule below.

A lane brief carries:

- **stream** and **sprint** (the lane's one active sprint);
- **worktree** and **branch @ sha** the lane starts from;
- the instruction: "start with `/prime` then `/orchestrator`, working only in the worktree";
- an **inventory of uncommitted state** in that worktree (or "clean");
- **gate status**: each gate (G1, G2) either `signed by record @<sha>`, or `unsigned`, in which case the brief says
  "take your G1/G2 to the owner as a popup in your own session";
- ceiling `<n>` (default 200k); at a task boundary write `/handoff` and send 'rotate me `<handoff path>`'.
- the **reply requested** (what the lane sends back, and when).

A brief never claims a G1 or G2 sign-off the owner did not give. A gate the owner already signed (for example an
owner-signed plan standing as the batch G1/G2) is cited by its record; any other gate goes to the owner as a popup in the
lane's own session. An unattended lane has no ask channel, so it parks at an unsigned gate until an attended
continuation in that session gets the owner's answer (`night-run.md` Part 0).

## 3. Status check

Send enabling messages (completion, blockers, approvals, lock release): another session acts on them.
Pure acks and routine status go to the sender's own sprint Execution Log, which the receiver reads at its own checkpoints;
do not send them as messages, because every cross-session message wakes its receiver at its whole context.

On an idle notice or a silence, ask the lane for a 3-line reply:

1. done
2. waiting on
3. next

The lane sends that requested reply and appends it to its own sprint Execution Log, so the state survives the session.

## 4. Relayed rulings and approval

An owner ruling passed between sessions is labelled as relayed, with who relayed it and where the owner gave it; a proposal
is kept apart from a ruling. A peer message, from another lane or the coordinator, is never owner approval: only the owner's
own answer, or a record of it, counts.

## 5. Lost reports

When a subagent's or lane's final report did not arrive, re-request the full report. Never infer it from an interim
hand-back or from the state of the worktree.

## 6. Shared files across lanes

The coordinator owns each named shared file, so a lane never edits one on its own authority.

- The lane sends all of one task's shared-file hunks or a diff in one message to the coordinator and does not stage them yet.
- The coordinator answers with one approval message per task batch, optionally after a review subagent reads the diff first.
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

## 8. Lane rotation

A lane acts only at a task boundary (a member task's commit), because a session cannot see its own context size.
200k is the coordinator's and owner's target; the coordinator reads a lane's transcript usage or the owner's status line.
The host overrides it with a CONTEXT line `lane-context-ceiling: <tokens>` or in the lane brief.
The lane itself only starts a rotation at a task boundary. The coordinator, which can see the usage, may rotate a lane
above the target mid-task once its current coherent step is done. Never stop or rotate a lane mid-step; a task never
waits on a rotation.

- Route (CLI-version-dependent; Claude Code 2.1.325): the lane writes `/handoff` and sends "rotate me `<path>`".
  The coordinator runs `claude stop <id>` then `claude --bg "<brief + handoff path>" --name <lane> --permission-mode <the lane's mode> --add-dir <the handoff's directory>`.
  The fresh lane runs `/prime`, reads the handoff, and reports; the coordinator logs the new id and name.
  List/inspect with `claude agents --json` (plain `claude agents` needs a terminal) and `claude logs <id>`.
- Rules from real input, 2026-11-16: put the brief BEFORE variadic flags such as `--add-dir`, which swallows a trailing brief and starts the session idle.
  Give the fresh lane its predecessor's permission mode plus `--add-dir` for the handoff's directory; an `acceptEdits` lane stopped on a prompt to read the handoff.
  The owner answers a lane's popup with `claude attach <id>` from a real terminal window, never the coordinator's shell
  or a `!` command in it: neither has a terminal, so attach exits at once. Messages queue behind a pending popup.
- If the route fails, the owner opens the fresh lane in a terminal with the same brief.
- Rotating an existing lane needs no popup. The rotated brief cites the original gate records and never claims a new sign-off (§2).
- Coordinator self-rotation is advisory, never a gate: at a checkpoint write `/handoff` and hand to a successor launched
  with `claude --bg` (a rotation, no popup), or tell the owner one line: `/clear`, then `/prime` and the handoff path.
- No ledger field, checker or poller: rotation is prose.

## 9. Lane cost

- **Narrow delegation (owner-chosen):** only work whose output would bloat the lane's context goes to an execution-tier
  worker (ADR-010), which returns a short report: device runs, full test suites, long log reads. Routine edits stay inline.
  Preserve device and RAM limits and the single-device lock; a worker never runs a device job another lane holds.
- **No polling from a large-context session:** a lane waiting on a device lock or free RAM uses a cheap background shell loop
  that exits when the condition holds, so the session wakes once on completion. Never use `/loop` or repeated scheduled
  turns from a large-context session for that wait.
