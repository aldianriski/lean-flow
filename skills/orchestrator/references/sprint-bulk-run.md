# Sprint-bulk — sweep and runtime

Loaded by `orchestrator/SKILL.md` steps 1–2 before execution and step 5 during the active sprint.

## Sweep

1. **Open at batch G1.** Read every member's scope and `## Assumes` against the Plan. Collect scope-blocking
   questions (an answer changes what a member delivers) and exclusions across the sprint. Settle them in the rounds
   below before G1 signs; apply owner-approved exclusions through step 5. Build G2's ownership map over the remaining members.
2. **Continue at batch G2.** Across every remaining member, collect builder-check intent residue, every unconfirmed
   `## Assumes` line, foreseeable J2/HITL steps (owner-approved launches, owner actions, proofs needing an owner),
   and owner decisions left open by the designs. An open assumption is a line marked `**open:**` or asking to be
   confirmed; plain informational bullets are not questions. Inspect the designs and verification plans as well as
   the task files: a foreseeable owner decision need not already have an `**open:**` marker to belong in this sweep.
3. **Ask by frontier round.** Settle factual questions and contradictions yourself first (`builder-check.md` step 3).
   Verify credentials/environment as capability facts — CLI logged in, host reachable, key present by name — using
   non-secret status evidence, never secret values or credential-file contents. An unavailable capability remains a
   blocker; do not ask the owner to guess whether it works. Only intent questions go into AskUserQuestion popups,
   at most four questions each, with a recommended answer per question. Batch questions whose prerequisites are
   settled across members; dependent questions wait for their prerequisite answers in a later round. Repeat until
   no foreseeable question remains open for the retained members. No ask channel, denial or no answer leaves the
   gate unsigned and execution stopped; it never means approval.
4. **Record answers where read.** Close each answered member `## Assumes` line in place: replace its open or
   confirmation marker with `**settled (G2 <date>):** <ruling>` (include "settled at G1" in the ruling for a scope
   answer already settled there). Preserve the question's subject so the ruling remains intelligible. Put design
   rulings and each `builder-check · Tn` line in the Execution Log's G2 entry. If an owner ruling amends a design
   after its builder check, amend the design record and record `settled: owner ruling …` in that task's builder-check
   line; do not rerun the check. Workers return evidence; these writes belong to the coordinator.
5. **Scope out an unresolved member only by owner ruling.** If a member is still blocked, surface the blocker and
   ask to exclude it plus its transitive dependents, derived from the Plan's `Depends-on:`. Reuse `dispatch.md`
   § Merge-back queue's backlog-return steps 1–3 by pointer: each departing member gets its own standalone
   `scope-change` entry before the G2 entry, backlog move in its own commit, then cleared sprint stamp and Members
   line. No worktree is needed. This is the existing scope-change path, not permission to silently rewrite the frozen
   Plan; units citing no current member are excluded per `dispatch.md` § Members by reference and never dispatch.
   Known exclusions settle at G1; one discovered at G2 must leave before G2 signs, and the ownership map is updated
   over the retained members. If the owner declines, G2 stays unsigned and no run starts.
6. **Sign only after the sweep closes.** No retained member may carry an open assumption or unresolved foreseeable
   intent question. Record `gates_signed: G1,G2 @ <sha>` in sprint frontmatter only after both approvals (`@ <YYYY-MM-DD>`
   without git); until then omit the field, since its absence means not signed (`/lean-doc-generator` promote). Re-read the retained members'
   `## Assumes`: `night-run.md` Part 1's zero-open-assumes check still applies at launch; a settled marker or a plain
   informational bullet is not open. A declared J2 still blocks overnight launch under Part 1 item 3, even with its
   questions answered. Unforeseeable questions arising after G2 belong to runtime handling, not this sweep.

## Runtime

One **park, continue, ask at the end** rule governs post-G2 sprint execution, attended and overnight.
Pre-execution gates, explicit user stops (including human `block`), budget stops and hard failures halt at once;
never turn one into a park to keep executing. Overnight retains `night-run.md` Part 0's authority limits.

1. **Park the affected work.** A new blocker, including a worker's `blocked` question, holds that unit and
   anything sharing its ownership, files or dependencies (including transitive dependents), using the G2 map.
   Keep partial work in the sprint and its worktree outside the merge queue; do not return it to backlog.
   Never self-answer, work around, reshape or narrow a park. Workers return their question, recommendation
   and unblock condition; the coordinator owns the record and the final ask.
2. **Record a temporary park in the existing `progress` entry**, as one sentence naming the unit, blocker,
   unblock condition and held work. Start with prose, e.g. `Parked T1 pending …`; neither this sentence nor
   any line in an `open questions at exit` entry may start with `Tn · ` (the reaper's task-line shape).
   A review's BLOCKED/CRITICAL finding first follows `review-scoping.md` § The revise loop: one bounded
   retry where permitted (overnight only ADR-022's mechanical carve-out). Still open after that retry,
   or a retry not authorized → park for the owner, never a second retry or a silent resolution.
3. **Continue approved disjoint work by readiness, not whole-wave completion.** A unit can advance when
   its own `Depends-on:` predecessors have merged and its shared-file ownership predecessors have committed.
   A parked wave-mate alone cannot hold it. Merge each ready unit in ownership order (`dispatch.md`
   § Merge-back queue); declare and verify the live base at each spawn (§ Declared-base rule).
4. **Re-check every open park at each task boundary, in both modes.** If its recorded unblock condition is
   now satisfied by completed work, resume it within the approved scope; needing an owner answer is not
   satisfied by a recommendation. Re-dispatch the same held worker to rebase onto the current tip before
   continuing (§ Merge-back queue's expected-conflict rule). If it cannot resume, use `dispatch.md`'s
   worker-resume fallback with its report and the resolved condition. A retry-still-open park needs the
   owner and remains parked through the unattended exit.
5. **Deliver the ready question frontier at exit**, after approved in-flight work finishes and no runnable work remains. Exit pass, in order:
   the digest below; step 6's canonical line for each unit still parked, in its own `progress` entry (overnight: before
   `/handoff`; attended: after the round, for parks its answers left open); then `/handoff`. Omitting that line makes
   the reaper read a parked unit as `unattempted`. Batch questions
   whose prerequisites are settled, with one recommended answer and the affected unit/unblock condition each;
   dependent questions wait for their prerequisite answers in later rounds. Always append the ready frontier
   to the Execution Log as `### <date> | progress | open questions at exit` (write `none` if empty), before
   attempting `/handoff`. This digest survives a denied handoff or a temp file that later disappears.
   - **Attended:** ask that frontier in one AskUserQuestion round (up to four questions per popup); send
     answers via `SendMessage` to the same held workers. Record the owner's answers under
     `### <date> | questions answered`, then re-check parks and resume authorized work. Ask dependents only
     once their prerequisites settle. Denial, missing channel or no answer leaves the work parked.
   - **Overnight:** never ask; put the same ready frontier in `/handoff`'s **Blockers / open questions** slot
     and halt cleanly. If `/handoff` fails or is denied, keep the Log digest and report the failure once in a new
     Log entry; never delete or rewrite lines already appended (the Log is append-only), and do not retry it
     through another tool route.
   In either mode, immediate halts preserve any pending frontier on the exit path when possible,
   without delaying the stop, opening a popup or dispatching more work.
6. **Finalize parks only at the actual exit** (step 5's exit pass). Only a unit still parked then gets the canonical
   `Tn · parked-hitl|blocked · <unblock>` line (choose one state) for `night-run.md` Part 4. A cleared park
   gets no such line; a retry-still-open park gets `parked-hitl` here too. The reaper checks the whole run
   window at exit, so that line satisfies its retry-escalation check. The launcher still owns the terminal
   state and rollup (ADR-016); this rule changes its evidence timing, not its writer or format.

**Resuming questions.** Record owner answers in a `questions answered` entry in the resuming session too.
Only that later entry or a newer `open questions at exit` entry retires a digest; a handoff stub, progress,
or rollup never does. If answers leave questions open, append the remaining ready frontier as a new digest
after the answers so `/prime` can recover it. Prime surfaces questions read-only, ahead of mode advice,
after reconciling any uncertain writes; it does not ask or record answers itself.
