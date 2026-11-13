# Cross-model route

Loaded by `/orchestrator` for a declared cross-model handoff. Goal: hand one job from a Claude-host coordinator
to another provider's CLI and get a scoped review with evidence the coordinator can use.

## When it fires

The route is off by default. Use it only when the host repo's CONTEXT file declares it or the owner asks in
the session. With neither, make no cross-model call and review exactly as before. Attended modes only:
an unattended run never uses this route. A host that is not Claude is out of scope.

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

End the brief by asking for one verdict line and the two statements in `review-scoping.md`,
**What every review result states**: what the reviewer read (files and criteria judged against), and what
it could not read or check. Keep Standards and Spec separate, as that reference requires.

## Launching a review

Write the brief to a file outside the working tree. Pass it by stdin or as a file, never inside a shell
command string. Set read-only project permissions with the CLI's own flag; a sentence in the prompt does
not enforce them. Name the model explicitly. Run in the foreground to completion under a bounded timeout,
with output and errors in separate files outside the working tree.

Keep one launch line per provider proven on a real run in this block. Codex is the proven provider so far.
Replace `<model>` with the requested model and the file names with paths outside the working tree.
Run this line under the host's timeout command with an explicit finite limit:

```sh
codex exec --model <model> -s read-only --skip-git-repo-check - < brief.txt > result.txt 2> err.txt
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

Record a completed review with the existing `review ·` line as `scoped-reviewer`, retaining the existing
behaviour and governance classifications. Add no new record line, field, script or check.
