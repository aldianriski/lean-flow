# Sprint-bulk — pre-run sweep

Loaded by `orchestrator/SKILL.md` steps 1–2 before execution of the active sprint.

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
   intent question. Record `gates_signed: G1 @ <sha>` in sprint frontmatter only after G1 approval, then
   `gates_signed: G1,G2 @ <sha>` only after G2 approval (`@ <YYYY-MM-DD>` without git). Re-read the retained members'
   `## Assumes`: `night-run.md` Part 1's zero-open-assumes check still applies at launch; a settled marker or a plain
   informational bullet is not open. A declared J2 still blocks overnight launch under Part 1 item 3, even with its
   questions answered. Unforeseeable questions arising after G2 belong to runtime handling, not this sweep.
