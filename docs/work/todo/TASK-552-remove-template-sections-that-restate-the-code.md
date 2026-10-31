---
id: TASK-552
title: "Remove template sections that restate the code"
epic: EPIC-023
sprint: SPRINT-153
priority: P2
size: S
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
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
- **was blocked-by:** TASK-547 (it edits the same templates); TASK-547 is done, triaged ready 2026-10-31.
- A removed section's content in an adopter's existing docs is left alone: `migrate` never deletes (TASK-553).
- **ruled (owner, 2026-10-31):** the CONTEXT.md template's own Stack list and Patterns in Use section overlap the profile's
  Stack and Conventions in use (SPRINT-150 T2, Codex R1 T4). The repo profile holds both facts; the CONTEXT template drops the
  two sections and points at the profile.
- **ruled (owner, 2026-10-31):** 15 templates carry an HTML comment citing lean-flow's own ADR-012 ("Lives at … (STANDARD §2,
  ADR-012)"), which `init` copies into every consumer doc, where the id resolves to nothing (SPRINT-150 T2 box-3 run). Drop
  the ADR id and keep the placement citation as "(lean-flow STANDARD §2)".

## Tracker
EPIC-023 Closed-when S1 · research §4 R1, R4, §9 · S1 intake (2026-10-30)
