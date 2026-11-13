# Cross-model route

Loaded by `/orchestrator` for a declared cross-model handoff. Goal: hand one job from a Claude-host coordinator
to another provider's CLI for review, build or diagnosis, with evidence the coordinator can check.

## When it fires

The route is off by default. Use it only when the host repo's CONTEXT file declares it or the owner asks in
the session. With neither, make no cross-model call and work exactly as before. Attended modes only:
an unattended run never uses this route. A host that is not Claude is out of scope.

A host repo opts in with one line under any heading in its CONTEXT file: `cross-model: <cases> via <cli>`.
Cases are any of `draft-review` (intake drafts), `design-review` (G2 designs), `code-review` (post-build),
`build` or `diagnose`, comma-separated. A case not listed never fires from policy. With no such line, or no
CONTEXT file, only an owner's request in the session turns a case on, for that session.

## Before any call

Check that the CLI exists and is logged in using its own version and login-status commands. Read its own
help for the flags below because flags drift. Never install, upgrade or reconfigure the CLI to make a call
work; report the problem and use the fallback below.

## The review brief

Build the same brief as for the same-provider reviewer in `review-scoping.md`, **Scope every pass to the diff**
and **Draft reviews**. Supply the diff or draft and its comparands, including the governing ruling and repo
standards; for a draft, include the altitude line. Keep that brief's scope and secret-file restrictions.
Paste in every file the verdict depends on: the other CLI cannot see the conversation. If a required source
is secret or inaccessible, report that limitation instead of opening it.

End the brief by asking for a last line reading `VERDICT: CLEAR` or `VERDICT: NOT CLEAR` and the two
statements in `review-scoping.md`,
**What every review result states**: what the reviewer read (files and criteria judged against), and what
it could not read or check. Keep Standards and Spec separate, as that reference requires.
The other CLI runs read-only and cannot run the host's pinning tests: it names the commands, and the
coordinator runs them into the review's **Pinning tests** section, as `review-scoping.md` requires.

## Launching a review

Write the brief to a file outside the working tree. Pass it by stdin or as a file, never inside a shell
command string. Set read-only project permissions with the CLI's own flag; a sentence in the prompt does
not enforce them. Name the model explicitly. Run in the foreground to completion under a bounded timeout,
with output and errors in separate files outside the working tree.

Keep one launch line per provider proven on a real run in this block. Codex is the proven provider so far.
Replace `<model>` with the requested model and `<outside-dir>` with a directory outside the working tree;
paths with spaces must be quoted. Run the call under the host's own bounded-timeout mechanism with an explicit
finite limit; a host with no such mechanism must not make the call and uses the fallback.

```sh
codex exec --model <model> -s read-only --skip-git-repo-check - < "<outside-dir>/brief.txt" > "<outside-dir>/result.txt" 2> "<outside-dir>/err.txt"
```

## What counts as a result

A result is a completed turn whose output has the verdict line and both statements. Empty output, a timeout,
a permission failure, or exit code 0 without a verdict line is never an approval. If a verdict lacks either
statement, follow **What every review result states**: ask the same reviewer once only for the missing text.
That re-ask is not a code retry. Until both statements arrive, no CLEAR and no `review ·` line; if either is
still missing, count the review as not run and tell the owner.

Never silently retry on another model or provider. If the CLI is missing or the call fails, name the failure
in the review report and fall back to the same-provider scoped reviewer. Name the provider and model requested
in the report. Mark a failed or empty cross-model call as failed, never CLEAR; it gets no `review ·` line of
its own. Only the fallback reviewer's completed result gets that line, attributed to the reviewer that ran.

## Rounds and record

Drafts follow `review-scoping.md`, **Draft reviews**: at most two rounds, with round 2 blocking only on a high
finding that would change the outcome. Code follows **The revise loop**: one bounded retry on a concrete
violation, then any still-open finding goes to the owner. Send that declared retry to the same other-provider
reviewer on the revised delta; it is not a silent model or provider switch.
If the first call failed and the review fell back, send the revise-loop retry to the fallback reviewer,
since that reviewer produced the result. A failed call is not a round; for a draft, the fallback review is the round.

Record a completed review with the existing `review ·` line as `scoped-reviewer`, retaining the existing
behaviour and governance classifications. Add no new record line, field, script or check.

## Delegated build

Build only in an isolated clean worktree. Before launch, run `git status --porcelain` in that worktree;
any output means dirty, and the build is refused before any CLI call.

Paste `worker-brief.md` verbatim, then the task's acceptance criteria and approved design, with an instruction
to leave the work uncommitted. Use the same explicit model, bounded timeout, foreground completion and
outside-tree brief, output and error files as for a review. Write permission comes from the CLI's own flag
and is scoped to that worktree, never a permission bypass. For Codex:

```sh
codex exec --model <model> -s workspace-write -C "<worktree>" - < "<outside-dir>/brief.txt" > "<outside-dir>/result.txt" 2> "<outside-dir>/err.txt"
```

The coordinator reads the whole diff and runs the task's checks itself; the builder's own success report
is not verification. The coordinator then lands and commits the diff, because the other CLI may be unable
to write `.git`. Report a permission the CLI denies to the owner as it is; the coordinator never answers
a denial by turning on a bypass or a wider sandbox.

## The builder never grades

A diff built by the other provider is reviewed by a Claude reviewer under `review-scoping.md`, never by
the provider that built it. Record authorship per commit: the commit body names who built it. A coordinator
fix on top is its own commit, and the fixer-becomes-the-builder rule in `review-scoping.md` § The revise loop
then applies to it.

## Diagnosis handoff

For work that has failed twice on the same task, make one read-only diagnosis handoff, launched exactly
like a review. The brief carries the reproduction, the evidence, and each approach that failed and why;
ask for one testable alternative explanation and the check that would confirm or refute it.

The answer is evidence for the coordinator, not a verdict; the coordinator runs the named check. There is
no further automatic escalation. The answer ends with the same two statements as a review: what it read
(files and criteria judged against), and what it could not read or check.
