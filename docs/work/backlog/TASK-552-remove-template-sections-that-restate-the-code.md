---
id: TASK-552
title: "Remove template sections that restate the code"
epic: EPIC-023
priority: P2
size: S
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-547]
---

# TASK-552 — Remove template sections that restate the code

## Why
Working rule R1 (don't write the derivable) and the finding that repository overviews do not help (arXiv 2602.11988);
research §9 names this audit as the mitigation for "richer docs reproduce the paper's result". It shares the templates with
TASK-547, so it follows it. Not frozen under ADR-053. G2 review-round cap: 2.

## Done when
- [ ] Every core template section whose content a reader gets from the manifest, file tree or code is removed or reworded to
  ask only for the part they cannot; the change list names each section and the reason.
- [ ] No template section prescribes an architecture (the architecture-baselines verdict stands).
- [ ] A re-run `init` on the portfolio-sveltekit snapshot writes no section that only restates its manifest or file tree.

## Touches
the core templates in lean-doc-generator

## Assumes
- **blocked-by:** TASK-547 (it edits the same templates).
- A removed section's content in an adopter's existing docs is left alone: `migrate` never deletes (TASK-553).

- **open:** the CONTEXT.md template keeps its own Stack list (manifest-style) and a Patterns in Use section, which now overlap
  the profile's Stack and Conventions in use (SPRINT-150 T2, Codex R1 T4): rule which one holds each fact and point the other at it.

## Tracker
EPIC-023 Closed-when S1 · research §4 R1, R4, §9 · S1 intake (2026-10-30)
