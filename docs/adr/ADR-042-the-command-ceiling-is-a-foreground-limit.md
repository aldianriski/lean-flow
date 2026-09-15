---
id: ADR-042
tags: [tooling]
domain: governance
status: accepted
related: [ADR-039]
---

# ADR-042 — The command ceiling is a foreground limit, and the gate's ceiling check may not FAIL on it

- **Status:** accepted (2026-09-16)
- **Deciders:** Maintainer
- **Context driver:** EPIC-015 § Closed-when 1 has foreclosed three times; the third blocker is that no configuration of the QA gate is green, and `night-run.sh` refuses to fire on a red gate.

## Context

**TD-117 recorded a ruling that has shaped four sprints:** *"raising the budget cannot work, the 600 s
ceiling being external."* Everything downstream followed from it — SPRINT-099 made truncation
*legible* rather than making the gate finish, and SPRINT-101's T1 was deferred on the reasoning that
only cost reclamation could help. The gate needs ~945 s (default profile) and **1263–1370 s** (opt-in
profile) against a stated 600 s ceiling: bare, it truncates with 13 harnesses unrun and is silent
about a fifth of its own checks; raised, it completes and is red **for having taken the time to
complete**. Neither state can launch a run.

Two measurements taken at the SPRINT-102 promote falsify the premise
(`docs/research/logs/qa-gate-timing.md` § Round 15):

1. **The limit is external to a *foreground call*, not to the host.** Two **detached** full-profile
   runs — 1263 s and 1370 s, at 2.1× and 2.3× the ceiling — completed normally, ran every harness,
   truncated nothing, and printed their own verdict lines. Nothing killed either. The agent harness
   caps a blocking shell invocation; it does not cap a detached process. TD-117 was correct about the
   constraint it had measured and wrong about that constraint's **scope**.

2. **The assertion is structurally unfalsifiable in the direction it claims.** `scripts/qa-check.sh`
   runs `qa_ceiling_check` at `:1453`; the verdict prints at `:1473`, **twenty lines later**. A run
   killed at the ceiling reaches neither. So the FAIL branch fires **only** in runs that were not
   killed — while its own message reads *"a run past the ceiling is killed from outside with no
   verdict line."* That sentence is printed, in full, by the very run it says cannot speak. The check
   has never been capable of describing the run it fires on.

Blast radius is one leg of one script: the `QA_CEILING_SECONDS` block, ~15 lines. Two eval harnesses
already guard this area (`run-qa-budget-fixtures.sh`, `run-qa-budget-default-fixtures.sh`).

## Decision

**The command ceiling is a property of the *invocation mode*, not of the run, and the gate's ceiling
check reports it rather than failing on it.**

A run that reaches the ceiling check demonstrably survived; the only honest thing that check can say
about *this* run is how long it took, and the only useful thing it can say about a *future* run is
that a **foreground** invocation of this duration would be killed. That is a warning addressed to the
next caller, not a verdict on the present one — so it prints as `INFO` (the idiom SPRINT-100 T4
established at `qa-check.sh:447` for findings the gate does not fold into its tally) and does not
enter the `fail` count.

`QA_CEILING_SECONDS` stays configurable and keeps its 600 s default, because the default invocation
is foreground and 600 s is true there. A caller that knows it is detached may raise it; what changes
is that not raising it no longer reddens a gate that completed.

**Chosen over making `night-run.sh` invoke the gate detached** (SPRINT-102 G2, D6). That would have
re-plumbed the launch path so pre-flight reads a verdict from a file — the L-045/L-120 self-report
surface this repo has been bitten by five times. Keeping the change inside the assertion leaves the
launch path exactly as it is.

## Consequences

**Positive:** a complete, green gate configuration becomes reachable for the first time in four
sprints, which is EPIC-015 § Closed-when 1's remaining blocker — and it is reachable **without
reclaiming a second of runtime**, so the cost work can be scheduled on its merits instead of as an
epic blocker. The gate stops asserting something false about itself. `night-run.sh` is untouched.

**Negative (trade-offs accepted):**
- **A genuinely too-slow gate now reports `INFO` where it reported `FAIL`.** The runtime figure is
  still printed on every run, but nothing forces a reader to act on it, and this repo has recorded
  what happens to a line nobody must act on (TD-117's own *"cheaper still to learn to ignore, which
  is how a guard dies"*). The cost pressure that the red gate applied is real pressure being given up.
- **The 600 s default is now a claim about a mode nobody declares.** `qa-check.sh` cannot detect how
  it was invoked, so the default is an assumption, not a measurement. A detached caller that forgets
  to raise it gets an `INFO` line quoting a ceiling that does not apply to it.
- **The true detached limit is unmeasured.** Both runs completed, so nothing bounded them from above;
  what is established is that it exceeds 1370 s, not what it is.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Reclaim leg-12 runtime until the gate fits 600 s | Needs a ~36% cut from 944 s (~45% to reach the 520 s budget). Round 14's "307 s in seven harnesses" figure is drawn from **truncated** runs, so it is not a valid baseline (L-130). Round 15 found the real mechanism — 272 checker spawns at ~2 s each, `sys`-dominated — which is a fixable but sprint-sized piece of work, and it would not have made the false assertion true. |
| Move harnesses behind `QA_FULL=1` | Saves nothing at promote or close, which is where the cost is actually paid — the full profile runs both sets (`qa-check.sh:1161`). It would also trade a coverage claim for a schedule, which is the shape L-058 warns about. |
| Grant a `gate_exceptions:` entry for the timing FAIL | Exceptions match the **whole message**, which embeds the elapsed seconds — a run at 1371 s invalidates a grant written at 1370 s. Brittle by construction, and it would leave the false assertion standing while papering over it. |
| Make `night-run.sh` invoke the gate detached | Ruled out at G2 (D6). Re-plumbs the launch path so pre-flight reads a verdict from a file rather than from the command it ran — the L-045/L-120 trap, five sightings. |
| Accept truncation as normal | Incompatible with a **complete** gate: a truncated run is silent about ~13 checks, and `gate_exceptions:` would have to pre-approve a FAIL whose entire content is *13 checks did not run*. |
