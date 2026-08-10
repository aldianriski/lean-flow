---
id: ADR-016
tags: [tooling, process]
domain: skills
status: accepted
related: [ADR-002]
---

# ADR-016 — The night-run rollup is emitted by the launcher, not requested from the run

- **Status:** accepted (2026-08-10)
- **Deciders:** Maintainer
- **Context driver:** a run that ends mid-Plan reports `success`, and the reporting step that would
  expose it is the one step an agent reliably drops.

## Context

An unattended `sprint-bulk` run on a consumer's host landed 4 of 7 units — every one correct,
reviewed and committed, tree clean — and exited `subtype: success`, `stop_reason: end_turn`, no error.
Three tasks were never started and nothing was written about them. Part 4's rollup existed, but it
spoke only for non-green tasks, and an unstarted task was in none of its states.

The obvious repair is to ask the run for a rollup. **That was tried, and measured.** A second run's
trigger carried three added instructions: continue until every DoD is ticked or has a rollup line;
write the calibration row before stopping; re-check any park whose unblock condition was met. The
**work** instruction held — 3 of 3 units delivered, the mid-Plan exit did not recur. **Both bookkeeping
instructions were ignored**, in a run that otherwise did everything asked of it.

That asymmetry is the whole context. A step that happens *after* the work, and that no gate depends
on, is the first thing an agent drops as its turn winds down. Both calibration rows in the field
report were ultimately written by the human coordinator, which is the same finding stated as an
outcome rather than a hypothesis.

Blast radius is small and known: one shell script (`scripts/night-run.sh`, ~250 lines), one reference
document, and no consumer-visible interface change — the rollup lands where Part 4 already said it
would, in the sprint's Execution Log.

## Decision

**The rollup and the calibration row are emitted by the launcher's process wrapper, after the fired
command exits — not requested from the model in the trigger prompt.**

The wrapper already exists and already outlives the model: it is what captures the run's exit code to
a sibling file today. A reaper invoked from inside it runs on *every* exit — clean finish, early
end-of-turn, or crash — which is precisely the property a bookkeeping step needs and an instruction
cannot provide.

The trigger keeps its continue-until-exhausted clause, because that one governs *work* and the
evidence says work instructions hold. It is no longer asked to carry the bookkeeping.

Two constraints fall out of the decision and are part of it:

- **Only constrained numeric fields cross from the log into the committed doc.** The reaper lifts
  `total_cost_usd`, `num_turns` and a wall-clock it computes itself, each bounded by its own
  extraction pattern. The log is the run's own output landing in a sprint record; nothing free-text
  makes that crossing, so a malformed or crafted log line cannot inject structure into a doc.
- **The reaper states facts and never guesses states.** It reports the DoD count, and marks
  `unattempted` only those tasks the run wrote no line about at all — a fact about the log, not an
  inference about intent. A task the run *did* report as blocked, parked or denied keeps its own line.

## Consequences

**Positive:** the completion signal stops depending on the model's sense of completion. A short run
becomes visible from its header line alone (`run · N of M DoD ticked`), which matters because the
failure being fixed is a reader who stops early on a page that looks fine. The calibration series
starts accumulating without anyone remembering to transcribe it.

**Negative (trade-offs accepted):**

- **It reaches only consumers who use the launcher.** `scripts/night-run.sh` is a working reference,
  not a required component; a consumer firing `claude -p` from cron directly gets none of this. The
  documented path in Part 4 therefore still has to stand on its own for them, and it does — the format
  is specified there, the reaper merely guarantees it. This is the real cost of the decision and it is
  not mitigated, only bounded.
- **A second place that knows the sprint-file layout.** The reaper parses DoD boxes and `### Tn`
  headings, which the QA checkers also parse. That duplication is deliberate rather than shared: the
  launcher is dependency-free POSIX sh a consumer can read in one sitting, and pointing it at
  `scripts/lib/` would ship a maintainer-only path into a consumer-facing reference (L-015) — the same
  trade already accepted for the dispatch preflight snippet (TD-045).
- **The reaper is itself a guard, and guards fail silently.** Its first exercise proved the point: a
  whole-file grep matched a *worked example in documentation prose* and dropped a task from the
  rollup. It is therefore gated by must-FAIL fixtures rather than trusted (T3 of SPRINT-059).

## Alternatives considered

| Option | Why rejected |
|---|---|
| Ask the run for the rollup in the trigger prompt | Measured to fail. A run asked in plain language wrote neither its calibration row nor its park re-check while completing all of its work. This is the alternative the decision exists to replace. |
| Let the Part 3 watchdog own the rollup | The watchdog fires on a *stall*. A run that ends cleanly and early — the exact failure — never stalls, so the watchdog stays silent precisely when the rollup is needed. |
| A separate reaper script wired into the OS scheduler | More moving parts for the consumer to install correctly, and the one most likely to be omitted is the one that reports omissions. Putting it inside the wrapper means it ships with the launcher or not at all. |
| A lean-flow hook | The plugin ships no hooks (ADR-002), and a hook would be a larger, less inspectable commitment than a dozen lines in a script the consumer already runs. |
