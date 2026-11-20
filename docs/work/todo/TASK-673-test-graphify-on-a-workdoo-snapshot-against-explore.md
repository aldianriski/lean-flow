---
id: TASK-673
title: "Test graphify on a workdoo snapshot against Explore on six fixed repo questions"
sprint: SPRINT-181
type: feature
epic: EPIC-026
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-673 — Test graphify on a workdoo snapshot against Explore on six fixed repo questions

## Why

EPIC-026 D4 as amended by the owner popups of 2026-11-20. Does graphify-out make an AI know a repo better, at no extra cost? lean-flow's own verdict stays untouched.

## Done when

- [ ] About 6 fixed questions (where does X live, what calls Y, what breaks if Z changes) on the `D:\Research\workdoo` TypeScript snapshot (src/app, ui, scene ...), with an answer key built from the code BEFORE any arm runs. `docs/research/graphify-reference-run.md` (an earlier graphify run) is read before the questions are written. The question set and key are retained in `docs/research/` as the fixture.
- [ ] Graph built with `~/.local/bin/graphify`; build cost recorded in tokens and wall time.
- [ ] Two fresh Sonnet subagents answer the same questions, one Explore only and one Explore plus graphify-out. Each reports tokens; answers are scored blind against the key.
- [ ] Verdict recorded in `docs/research/<slug>.md`. Keep only if graphify answers at least as many questions correctly AND uses at most 1.0x Explore's tokens, graph build cost included. Anything else is drop or inconclusive.
- [ ] Negative: a correctness tie with cost above 1.0x, or a confounded run, is recorded as drop or inconclusive, never keep.
- [ ] Negative: workdoo left as found. graphify-out removed from `D:\Research\workdoo`, `git status` there matches its pre-test state, nothing touched in `D:\Project\workdoo`.

## Touches

`docs/research/` (verdict note and question-set fixture); the `D:\Research\workdoo` snapshot, reverted afterwards. Nothing shipped.

## Assumes

- graphify extracts code by AST, so build cost on pure TypeScript may be near zero tokens; any semantic-subagent tokens are counted.
- n=6 and one run per arm is direction, not proof (EPIC-024 D4).
- The arm-B brief tells the agent to read graphify-out/GRAPH_REPORT.md first; TASK-675's wiring is a different mechanism and is not tested here.
- The scorer does not see which arm produced which answer.
- The epic's D4 / Closed-when "during a dashboard sprint" wording needs an amendment (D8), made by /lean-doc-generator at promote.

## Tracker

EPIC-026 D4 (amended); owner popups 2026-11-20 Q2 and Q3; owner approve 2026-11-20.
