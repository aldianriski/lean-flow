---
owner: Maintainer
last_updated: 2026-09-12
update_trigger: A further measurement changes where the gate's memory is shown to go
status: current
id: qa-check-memory-profile
tags: [tooling]
domain: governance
related: [qa-gate-timing]
<!-- The raw series is Round 14 of logs/qa-gate-timing.md and is deliberately NOT a `related:` id:
     gen-index.sh globs docs/research/*.md non-recursively, so naming a log would dangle §4b's
     corpus-ref check. The doc → log coupling is a body link, same as docs/sprint/. -->
---

# Research — where does `qa-check.sh`'s memory actually go?

> **Question.** TD-143 (`severity: high`, open since SPRINT-096) records the gate being killed by the
> host for memory, emitting output but no `QA-CHECK:` verdict line. Four kills are on record and every
> account of the mechanism is inference from the artifact. TD-143's own **Re-file fresh if** condition
> asks for one thing: measure the profile, so the mechanism is known rather than inferred.
> **Verdict. The gate has no memory profile worth the name, and the question as posed has no
> answer — because its premise is false.** `qa-check.sh` holds ~9.5 MB and moves by 320 kB across a
> 547-second run, while system free memory swings 695 MB around it. It is not the consumer. It is the
> process that happens to be running, and spawning, when a loaded host runs out.

Raw series, method, host state and limits: **Round 14** of
[`logs/qa-gate-timing.md`](logs/qa-gate-timing.md).

## Why this matters

Three sprints have reasoned about this mechanism from the *shape* of the kills. TD-143 says so itself
and flags its own Mitigation line as the filer's hypothesis, written while the cost was being felt
(L-091). Two consecutive closes (SPRINT-096, SPRINT-098) rested on targeted evidence under ADR-021
overrides because the instrument that should decide them could not speak. A wrong mechanism is worse
than an unknown one here: it routes the fix at the gate, which is the one component now shown to be
innocent.

## What was measured

Six serial runs on the working host, three of them instrumented, with nothing else dispatched by the
session. The instrument is `QA_PROFILE=1` (SPRINT-099 T1), off by default and fork-free, sampling
`memfree · swapfree · self_rss · procs` at every leg checkpoint and every eval harness.

**A1 is the sprint's own assumption** — *that the four recorded kills share one mechanism* — and it was
the subject of this task, not its premise. It is **not confirmed**, and it is not cleanly refuted
either. See § A1 below; the distinction is the finding.

## Findings

1. **The gate's memory is flat and small.** `self_rss_kb` spans 9 408–9 728 kB (R2), 9 600–9 920 kB
   (R4) — a 320 kB spread over ~547 s. System `MemFree` moved 695 MB in that same window. Nothing in
   the series shows the gate reaching for memory at any leg, harness, or boundary.
2. **Fork exhaustion does not accumulate.** `qa-check.sh:50` names it as the rival mechanism. The live
   MSYS process count oscillates 4–20 with no monotonic climb and deltas as often negative as
   positive. Children are short-lived and reaped.
3. **Truncation is the steady state, and the verdict is non-deterministic.** Three runs of the
   identical file produced 201/201/204 passes and tripped at two different harnesses; across five
   completed runs, 199–204 passes and four trip points between 523 s and 554 s. **No run completed the
   harness set.** Every one printed `N pass, 1 fail` — the shape of an ordinary single failure.
4. **The cost centre has moved into leg 12.** Seven items account for ~307 s of ~545 s (56%), led by
   `run-layers-completeness-fixtures.sh` at 70 s. Round 13's §4 conversion holds: leg 4 is 37 s.

## What this means for the open rows

- **TD-143** — its cost half should be **re-filed against the host, not the gate**. There is no gate
  memory cost to reduce; a fix aimed at `qa-check.sh`'s consumption would be aimed at 9.5 MB. What is
  actionable is the *environment* the gate runs in: 562 MB free with WSL at 1 989 MB, three `claude`
  processes at 1 178 MB, Docker and Code resident. Its cheap half already shipped
  (`scripts/qa-verdict.ts`, SPRINT-097 T4) and is unaffected.
- **TD-117** — confirmed live and worse than recorded. It describes six skipped harnesses; this
  session skipped **13**, including `run-qa-budget-fixtures.sh` and
  `run-qa-budget-default-fixtures.sh` — the guards of the budget mechanism itself — and
  `run-s2-placement-fixtures.sh`. A skipped harness is an unrun guard, and the gate is currently
  unable to guard its own budget on this host.
- **TD-128** — the missing *reader* is the live gap. Runs at 547 s pass a check written against a
  520 s default while the actual runtime is asserted nowhere.
- **TD-090** — leg 12 is where the remaining runtime is; Finding 4 gives the per-harness table.

## A1 — tested, and the answer is "not as stated"

A1 asked whether the four recorded kills share one mechanism. What can be said:

- **R0 reproduced the artifact on the pristine file** — 129 lines, 0 FAIL, no verdict line, against
  TD-143's recorded 147 lines. The artifact is real and reproducible, and is not caused by the
  instrumentation.
- **R0's kill was delivered by the session harness's low-memory watchdog**, which reported it as such.
- **The four earlier kills were never instrumented.** Nothing here establishes that they came through
  that same door rather than a Windows-level one.

So A1 is **not confirmed**: one kill's mechanism is now known, three remain inferred, and the honest
statement is that they share an *artifact* — which is precisely what TD-143 already warned is why this
has been read as three other debts. What *is* settled, and is the durable result, is that **whatever
door the kill comes through, it is not the gate's own consumption.** That eliminates the whole class
of fixes aimed at making `qa-check.sh` lighter.

## Recommendation

1. **Do not optimise the gate for memory.** There is nothing there to reclaim.
2. **Re-file TD-143's cost half against the host envelope**, and treat "run the gate with the machine
   quiet" as the operational mitigation until a host that reports `VmHWM` can say more.
3. **Fix the report before the cost** — SPRINT-099 T2's ruling (D3) is independently supported here:
   five of five completed runs printed a truncated verdict indistinguishable from a genuine failure.
4. **Re-measure on a host that reports a peak.** Finding 1 is the one most exposed to the missing
   high-water mark, and it is the finding everything else rests on.
