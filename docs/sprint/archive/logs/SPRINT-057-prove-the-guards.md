---
sprint: 057
slug: prove-the-guards
owner: Maintainer
last_updated: 2026-08-10
status: closed
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

### 2026-08-10 | complete | T3 — one format across all three Parts; the trade that caused the conflict no longer exists
Part 2's recipe now mandates `--output-format stream-json --verbose`, and the two sections that
consumed the format follow it. This conflict was **ours, not the reporter's** — found while verifying
their finding 7, and worse than what they reported: Part 2 specified no format at all, Part 3's stall
signal was written in terms of `stream-json` lines, and Part 4 told you to read cost off
`--output-format json`. Three sections, three incompatible assumptions, and a documented instance of
the collision already in the ledger (L-083, TD-029: SPRINT-045 fired with `json`, the launcher
reported `DEAD-ON-ARRIVAL … the prompt may have been rejected`, and the run was working normally and
landed both units).

**The reason the conflict existed is now gone, which is what makes this fixable rather than a
trade-off to document.** `json` was chosen in Part 4 precisely because it exposes `total_cost_usd` —
a real need, pulling against liveness. A1's resolution removes the tension: the last line of the
stream is a `result` event carrying the same `total_cost_usd`, `num_turns` and `duration_api_ms`. One
format serves both needs, so Part 4 now reads its numbers from the stream's terminating event and says
why.

Part 3's `UNKNOWN` verdict row was **kept, not deleted**. Under the mandated format it should be rare
— per-event lines mean silence is genuine evidence of a stall rather than an artifact — but the row
documents the case that produced it, and now tells a reader seeing `UNKNOWN` repeatedly to check the
format before diagnosing the run. Deleting it would have removed the explanation for the one recorded
false verdict.

`scripts/night-run.sh` needed no change and was verified rather than assumed (its `Cites:` line said
so): it already detects `--output-format json`, reports `UNKNOWN` instead of `DEAD`, and recommends
`stream-json` in the message. The launcher was ahead of the doc.

Claimed only what is verified (L-052): the `result`-event fields are documented; `--verbose` is the
documented pairing; `--include-partial-messages` is optional and token-level, checked against the
local CLI's own help. Whether `stream-json` alone emits intermediate events without `--verbose` was
**not** verified, so nothing in the doc asserts it.

### 2026-08-10 | complete | T4 — the watchdog now proves it started; half the finding was already ours
Part 3 gains a start-verification bullet. The point that earns it: a watchdog that dies at launch is
**indistinguishable from a healthy one**, because silence is exactly what a working watchdog looks
like all night — the inert-permission-rule family from Part 1, one layer up, with a worse schedule,
since you find out at the only moment it mattered. Confirming it is alive and that its log has a line
is the same evidence-not-assumption move the Part 1 probe makes, applied to the guard instead of the
rules. The consumer's first watchdog died instantly on a parse error and logged nothing.

**The other half of the finding needed no change, and that is the more useful result.** The report
asked for the stall signal to be "log activity *or* new commits, not either alone". Part 3 already
reads: *no new `stream-json` line **and** no new commit for N minutes* — both signals, exactly what was
requested. Verified by reading before writing anything, and left untouched. L-017 is the rule that
caught it: judge an external finding on the **delta over our existing surface**, not on its standalone
merit. Adopting it wholesale would have meant rewriting a correct rule into the same rule, and the
diff would have looked like progress.

### 2026-08-10 | complete | T5 — the sign-off is now a field the run parses, and its ABSENCE is the guarded case
`gates_signed: G1,G2 @ <sha>` in the sprint frontmatter, written by `promote`, pointed at by
night-run Part 1, and checked by `scripts/lib/check-gates-signed.sh`. L-099 arriving from outside:
Part 1 required the gates to be "already signed off by the human" and never said *where*, so a
sign-off living in the launching session's transcript was invisible to the run — which then re-ran
both gates, reached for `AskUserQuestion` (unregistered headless) and parked every task having done
zero work.

**The guarded failure is absence, not malformation, and the check is shaped around that.** A missing
field read as approval would ship an ungated Plan into a run where nothing can ask — the L-058 false
negative at its most expensive. So absence is **reported, visibly, as NOT SIGNED**: not a pass, and
deliberately not a gate FAIL either, because a sprint legitimately sits unsigned between `promote` and
the batch gate pass. Telling those two apart is only possible by asserting on output rather than exit
status, which is L-103 filed one sprint ago and applied here.

**The template's own placeholder had to be handled, and that is the subtle one.** `SPRINT.md.template`
ships the field as `gates_signed: [G1,G2 @ <sha> — …]`. Left unhandled, an unfilled placeholder parses
as *present* and the checker would bless a sprint nobody signed — the guarded failure reintroduced
through the very artifact that creates every sprint, for every consumer. Its own fixture holds it.

**Exercised on real input, not just fixtures** (L-007): SPRINT-057 itself carried no `gates_signed:`
because it was promoted before the field existed, and the checker's first live run said exactly that.
This sprint's own G2 sign-off is now recorded (`G1,G2 @ 6d3811b`) and reads back green — so the
mechanism is proven on the artifact it was built for, not only on constructed ones.

Five fixtures retained: absent · unfilled placeholder · malformed (FAIL — a record nobody can parse
looks like evidence and is worse than none) · well-formed · archived-and-out-of-scope, the last
carrying a deliberately garbled value so a regression that started re-checking archives fails loudly
instead of quietly re-opening settled sprints.

### 2026-08-10 | complete | T6 — promote size-checks before it freezes, because G1 runs too late to be free
`promote` now size-checks the tasks it is about to pull and splits (or returns to `/task-decomposer`)
any `[size: L]` **before** rendering. The rule already existed — G1's "an L splits before proceeding" —
and the defect was purely one of *ordering*: G1 runs after `promote` has rendered, frozen and
committed the Plan as `plan locked`, so by the time the rule fires, acting on it costs a
`scope-change` entry plus a Plan amendment against a commit minutes old. At pull time it costs
nothing. The reporter hit exactly this: one `L` promoted cleanly, was caught at G1, split into two
`M` units, and required a logged scope-change against a Plan committed minutes earlier.

Stated in both places a reader meets it: the `promote` row (what an executing agent follows) and
`CONTEXT.md` § Gates beside G1's own split clause (where the rule already lived, now carrying the
ordering caveat). Two surfaces, one rule — the second is a pointer to the ordering fact rather than a
second copy of the rule, which is the distinction §10 draws when it warns that a stale duplicate
reproduces the failure.

Worth naming as a pattern rather than an incident: this is the third ordering defect this sprint pair
has fixed. SPRINT-056 T4 found checks disarmed by a status flip in the same commit that made the
edit; T5 above found a sign-off written after the artifact the run reads; and this one finds a gate
that fires after the thing it guards is already frozen. Each is a correct rule evaluated at the wrong
moment, and none of them looked wrong in isolation.
