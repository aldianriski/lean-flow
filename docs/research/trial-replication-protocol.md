---
owner: Maintainer
last_updated: 2026-11-10
update_trigger: A trial is designed, a replication or stop rule is amended, or a cheaper coordinator or fixture is proposed
status: current
id: trial-replication-protocol
tags: [process, tooling]
domain: governance
related: [trial-cost-allocation]
---

# Research — How can an agent-role trial cost less without letting noise buy a verdict?

> **Question.** SPRINT-170's replays cost about 4 USD and 40 minutes each, and trials are the sprint's largest spend. Which levers cut that, and which rules must be fixed before a run?
> **Verdict.** Three levers: a cheaper coordinator only when it is not the subject, a smaller fixture only if it keeps the treatment's conditions, and fixed replication and stop rules. The rules save money on screen-outs, not on a go.

## Why this matters

One run cannot show a saving. Two ordinary runs in SPRINT-170 differed by 28% in time (42.0 and 53.7 minutes). A rule chosen after seeing results can buy either verdict. So the rules are frozen first, and a cheaper design must not change what the trial measures.

## Lever 1: the coordinator

A cheaper coordinator (Sonnet, headless) is allowed only when two things hold. The coordinator is not the subject of the trial. And every arm uses the same model, effort and tools.

If the coordinator or the main-thread shape is the subject, it runs on the model the shipped flow would use, in every arm. Changing the coordinator model is a second change, and D2 allows one change per trial.

## Lever 2: the fixture

A smaller fixture serves screens and cost questions. It does not settle a time effect. To be valid it keeps:
- the dependency shape the treatment acts on, with at least 2 execution-class tasks and a real worktree merge-back;
- the off-host gate, with local `qa-check.sh` denied in every arm (L-310);
- the review step;
- an answer key and oracle kept outside the repo;
- a base commit in this repo, identical for all arms;
- enough work that the treatment's overhead stays a visible share of time and cost.

It drops nothing the treatment touches. No candidate is claimed to meet this list. SPRINT-162 fails it, because TASK-586 is a decision-class task and execution fidelity would go unchecked. Finding a valid smaller fixture belongs to the next trial's own G2.

## Lever 3: replication and stop rules

Frozen before any run and logged with the plan.
- A go needs at least 3 fresh runs per arm, in balanced interleaved order, with the same prompt and host settings, and no pooling with earlier runs (D15).
- A go is read only at 3 per arm. There is no early success stop.
- A screen-out may stop the trial after 1 or 2 runs per arm: the treatment fails the cost bar, exceeds the slowdown margin, or fails the oracle. The owner allowed the stop at 2; a go still needs 3.
- Any early stop is recorded as "screened out (n = k)". It is never "go" and never "no-go".
- "Within about 20 percent of the bar" is not a trigger for an extra run. Distance from a noisy threshold says nothing about variance.
- An extra run is allowed only for a void (host kill, suspend, harness fault), under D16's one-rerun cap.
- The cost bar and the slowdown margin are frozen numbers set at G2, never read from the result.
- The slowdown margin is 1.15 times the ordinary mean time (owner ruling, 2026-11-10).
- Cost is priced from Claude Code transcripts, with cold start reported in both arms (`trial-cost-allocation`). Time is read only after the largest transcript gaps of each run are read (L-310).

## Applied on paper: row 4b's retest design

Arms: ordinary (O) and thin router (R), both on an Opus main. The router is the subject, so lever 1 forbids a cheaper coordinator. The Executor stays Sonnet.

The fixture stays SPRINT-167's 11-box replay: the time effect is the open question, and the Executor's serialisation needs the two-task shape. Order O R R O O R. Local QA denied, off-host gate on. The cost bar is row 4b's existing one (R at least 25% cheaper than O). Oracle: 11/11 boxes, gate, review, merges. No SPRINT-170 run is pooled.

| Item | SPRINT-170 figure | Planned (USD) |
|---|---|---|
| O per run | 3.849 and 4.319, mean 4.084 | 4.1 x 3 = 12.3 |
| R per run | 2.658 (R2 not run) | 2.7 x 3 = 8.0 |
| Six runs | row spend 10.83 of 20 (three runs) | 20.2 |
| Stage 1 only (2 O + 2 R) | none | 13.5 |
| Two probes of changed settings | 0.51 to 0.67 each, first probes 0.51 and 0.43 | 1.0 |
| One full ordinary rerun reserve | none | 4.1 |
| Go path | row limit 20 | 25.3 |
| Screened-out path | row limit 20 | 18.6 |
| Whole sprint, for scale | 31.4 of 60 | not drawn |

The go path, 25.3 USD, exceeds SPRINT-170's row 4b limit of 20 USD. A paid retest therefore needs its own budget ruling. It is not drawn from SPRINT-171's 40 USD cap (D1, D2). The reserve is a full run, the probes are small, so the two lines are not like for like.

The protocol does not cut a go path: six runs cost 20.2 against 10.83 for three. Its saving is the screen-out path, about 6.7 USD (33%) less than running all six. This retest is a design on paper. A real one is a separate trial with its own G2 and budget, and nothing here decides it.

## Negative

No existing verdict is changed, re-read or re-scored under this protocol. Row 4b's recorded outcome is not cited as evidence for, or a prediction of, any later result. SPRINT-170's runs are not pooled. A one-run screen is never recorded as a go.

## Recommendation

Adopt the three levers and the frozen rules for every trial after 2026-11-10. Record the protocol as EPIC-024 D17.

## Out of scope / open questions

- A valid smaller fixture is not found. Settle it at the next trial's G2.
- Whether to run the 4b retest at all, and with what budget, is the owner's call.
