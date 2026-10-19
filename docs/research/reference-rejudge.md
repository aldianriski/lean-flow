---
owner: Maintainer
last_updated: 2026-10-19
update_trigger: An experiment filed here reports, or a re-judged item is built or killed
status: current
id: reference-rejudge
tags: [process]
domain: governance
related: [mattpocock-scan5, brainstorming-adaptation, loopcraft-adaptation]
---

# Research — were the weak and rejected reference items judged right, and would a bigger change serve better?

> **Question.** The 2026-10-19 scans held two items as weak and rejected five more. The owner asked for an independent re-judgement, proof on real artifacts, and openness to radical change.
> **Verdict.** One verdict overturned by evidence: the **G2 builder check is adopted**. A replay on today's real designs caught 3 of 4 later defects before the build (1 partial) with a clean control. One **radical candidate** (inline execution as the default) and two smaller items go to measured experiments. Three stay rejected.

## Why this matters

Three sprints today spent most of their review rounds on defects in *what to build*, not *how*: 4 of the 5 real defects
traced to a design or contract handoff, and each was found only after building, at the cost of a builder retry and a re-review.
A technique that moves those catches before the build changes the loop's economics; one that adds a call and catches nothing
is cost with no effect. The held verdicts had been reasoned, not measured.

## Options considered

- **A — keep the held/rejected verdicts.** *Trade-off:* no new calls; repeats today's late catches.
- **B — re-judge independently and prove on frozen artifacts.** *Trade-off:* the cost of four probes and one review; replaces opinion with evidence.
- **C — a radical restructure (execution model, contract binding).** *Trade-off:* potentially large savings; unproven, so it needs a controlled experiment, not adoption.

## Findings

**Builder-check replay** (upstream `brainstorming/builder-check-prompt.md`, verbatim; fresh Sonnet readers given only the
owner-signed G2 design, the frozen Done-when and the touched code; later findings withheld):

| Probe | Defect found later at review | Caught before the build? |
|---|---|---|
| SPRINT-130 T1 | Done-when "trailing" vs design "ending or followed by a space" (L-237) | yes — named the contradiction, with `… qa-check.sh extra` as the counterexample |
| SPRINT-130 T1 | tabs not treated as token boundaries | yes — asked about tabs and suggested splitting tokens |
| SPRINT-129 T1+T2 | the new rules absent from the injected reviewer prompt | yes — asked whether the list changes the real output format, quoting "injecting them here is what makes the split fire" |
| SPRINT-130 T2 | the empty-capture line asserting an unknowable cause | partial — asked for the exit status, which was the core of the fix |
| SPRINT-129 T3 (control) | none | "nothing important left" — no false alarm |

Cost: about 52k tokens and 15 s per design. Codex fixed the adoption criterion before seeing these results (≥2 of 3
defective designs including the drift, no false blocker on the control); the replay met it. Noise: some questions were not
defects, one of them caused by a cropped code excerpt in the probe document itself.

**Independent re-judgement (Codex `gpt-6-astra`)** — 1 adopt · 3 adapt · 2 reject · 1 radical:

| Item | Codex | Evidence | Disposition |
|---|---|---|---|
| Builder check (superpowers) | ADAPT → adopt if the replay meets its criterion | met (above) | **adopt, adapted**: also ask for contradictions between design and Done-when |
| Inline execution (superpowers) | **RADICAL** — stop dispatching every task by default | 4 S prose tasks ≈260k builder tokens + worktrees, merges, 12 stale worktrees; T3 ran inline fine | **experiment**: replay today's 6 tasks both ways |
| Question style (mattpocock rejects pickers) | ADAPT — open questions for discovery, pickers for decisions | 3 of 14 answers today came as "Other" and changed scope | **experiment**; L-002's visibility rule stays |
| Loop table (loopcraft) | ADOPT, then test | no recorded failure from its absence | **task with a reader test** |
| Rolling frontier (mattpocock) | reject now; measure | no idle time measured; T3 effectively rolled | stays rejected |
| Workers may not spawn agents | reject | no duplicate reviews seen | stays rejected |
| Software factory (loopcraft) | ADAPT as a finite portfolio checkpoint | overlaps triage and epics | not now |

## Recommendation

Adopt the builder check at G2. Run the inline-vs-dispatch replay before touching the dispatch default; run the
question-style experiment and the loop-table reader test as planned. Each experiment has thresholds fixed before it
runs (in its task). The three structural points Codex raised — one contract that survives every handoff, changing the unit
of work together with where assurance sits, and optimising for the owner's machine (the gate, TASK-367) — are the frame these
experiments test; none is adopted on argument alone.

## Out of scope / open questions

- Four probes and two sprints are a pilot, not a population; the builder check's yield is re-measured over its first sprints.
- Rolling frontier: re-open only if a trace measurement predicts ≥15% sprint-time saving.
- Portfolio checkpoint: re-open if triage and epics are shown to miss an allocation decision.
