---
sprint: 057
slug: prove-the-guards
owner: Maintainer
last_updated: 2026-08-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-057 — Execution Log

> Append-only companion to [`../SPRINT-057-prove-the-guards.md`](../SPRINT-057-prove-the-guards.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-09 | progress | G2 signed — A1 closed by reading, not by waiting for a measurement
A1 asked whether the terminating `stream-json` event carries the cost fields Part 4 needs. L-094's
rule applies directly: name the class of fact first. This is a **documented behaviour**, so it closes
by reading and never accumulates evidence by waiting. The headless docs say it outright — *"The last
line of the stream is a `result` message with the final response text, cost, and session metadata"* —
so T3's premise holds and its degrade branch will not be needed.

Two facts came back that the field report did not carry, and one of them changes T3's output:
`--include-partial-messages` is token-level and optional (verified against the local CLI's own help),
and `--output-format stream-json --verbose` is the documented pairing. What is **not** verified is
whether `stream-json` alone emits intermediate events without `--verbose`, so T3 will state the
documented pairing and claim nothing beyond it (L-052 — platform facts get run or read, never
inferred).

A3 and A4 were confirmed at promote; A2 is exercised by T5 rather than asserted. Ownership map is in
`Depends-on:` and the preflight is CLEAR, so G2 is signed on the design approved in the promote round
(D1–D4) plus this resolution.

### 2026-08-09 | complete | T1 — the probe exists now, and the deferral that swallowed it is closed
Part 1 gains a pre-flight item that **proves** the allowlist is live rather than assuming it, built
around the negative control: a deliberate must-deny action, plus a three-row table for reading the two
results together. The row that matters is the middle one — permitted calls succeed **and** the
must-deny call also succeeds, which means rules are not being enforced at all and the spellings are
the wrong place to look. Without the control, that state is indistinguishable from success.

Both preconditions were sharpened rather than restated. **Trust** now says to check *the key the
headless launcher resolves*, and carries the counter-intuitive part: the remedy the CLI itself prints
— run interactively once and accept — **cannot** fix a key mismatch, because the interactive session
lands on the key that is already trusted, so following the printed advice produces no change and no
error. **Rule form** gains the file-tool caveat: the measured rows were `Bash` only, and the natural
extrapolation to `Write(<abs>/**)` denied on a consumer's host while the bare tool name allowed. The
transferable claim is "measure the file-tool forms on your host", never a spelling — and the trade is
named, because the working form is broader than a path fence, so containment moves onto the deny list
and the task scope.

**The deferral that caused this.** `night-run-checks.md`'s heading read *"the probing mechanism
graduates to its own task"* for four sprints. No such task was ever filed, so there was no probe for a
control to live in, and both preconditions stayed measured-but-unverifiable at trigger time. The
heading now records what happened, next to L-068's inverse: a deferral *with* a written kill-switch
closes itself; one without a filed task is an intention.

**L-086 promoted** → Part 1, and its ledger body collapsed to a pointer (§11). Placed by §10's test —
the flows that can hit it are pre-flight and any headless run consuming an allowlist, and both read
Part 1. What landed there is the **method** (the negative control), not the host measurements, which
is the distinction the report's own generalizes/host-specific table insists on.

Nothing host-specific encoded: no Store-stub interpreter, no separator spelling, no BOM/ANSI note, no
matcher string presented as portable (L-015 — and the report is *from* a consumer, which makes the
leak-check the primary one here rather than an afterthought).

### 2026-08-10 | complete | T2 — DoD commands are a claim about the host, so pre-flight runs them
One checklist item in Part 1. The framing that earns it a line: a DoD command is not only about the
code, it asserts that an interpreter, task runner or binary **exists and resolves** on the box the run
will use. When one does not, the failure surfaces as a broken script rather than a missing tool, so
the morning report blames the work.

The asymmetry is what makes it worth a pre-flight slot rather than a footnote: these are the commands
used to *prove* a task is finished, so a single missing binary fails **every** task's gate for a
reason unrelated to any of them, and an otherwise-correct run delivers a page of red. Cost is one
invocation per command, stated inline so it reads as a line to tick rather than a decision to weigh.

Generic by construction — the reporter's two unrunnable commands are evidence in this log, not
content in the doc (L-015 · the report's own generalizes/host-specific split). L-052 cited: a platform
fact gets run, never inferred.
