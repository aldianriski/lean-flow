---
epic: 019
slug: workdoo-works-like-a-work-management-tool
owner: Maintainer
last_updated: 2026-10-06
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-019 — workdoo Works Like a Work-Management Tool

> **Outcome:** an operator runs the whole loop (create work, allow the agent, review and keep the result) from one work-item
> screen, in the design workdoo `docs/DESIGN.md` v0.2.0 "Gate Track" describes, in both themes, without a detour to a separate approvals page.

## Why this, why now

The first real run through the VPS dashboard (2026-10-06) worked end to end, but the owner judged the UI dated, generic and
hard to use: approvals on a separate page, no feedback after a click, a typed filesystem path, and engineer vocabulary on screen
(J1/J2, `AUTHORITY_BOUNDARY`, "roadmap phase 5"). The owner chose a direction from a clickable prototype (three directions,
then a mix) and wanted it in place before EPIC-018 builds its Projects screen. Foundations, primitives, list, detail and composer
each touch most of `apps/web`, which is more than one sprint. Like EPIC-016 and EPIC-018, its member sprints are **workdoo** sprints.

## Scope

**In:** design tokens for both themes, plus fonts · StatusMark and the GateTrack signature · the list (default) and board views · the
run on the work item (inline Ask, live stream, inline Result) replacing the Approval Inbox page · the composer and the ⌘K
menu · the operator-copy pass. **Out (explicitly not):** the Projects registry and repository picker (EPIC-018), the API and the store
(the redesign reads what exists), and any new run capability.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|

## Decisions

- **D1** — Direction: A's calm list as the default view, B's board as a toggle, C's live run panel in the detail, B's rounder
  Outfit style, a cobalt accent, theme from the system setting, and the gate track as workdoo's own signature. Owner, 2026-10-06; recorded as workdoo `DESIGN.md` v0.2.0 (`b56729b`).
- **D2** — v0.1.0's principles are kept: certainty first, `unmeasured` never shown as `0`, shape plus label (never colour alone), and
  *finished ≠ succeeded*. Only the look, the layout and the words change. Owner.
- **D3** — UI copy maps domain terms to plain words (DESIGN.md § Voice), while the domain glossary stays the vocabulary of code and docs. Owner.
- **D4** — Sequenced after workdoo SPRINT-009, and ahead of EPIC-018. Owner, 2026-10-06.
- **D5** — Baselines: the frontend-design skill plus taste-skill's redesign audit, read as reference rather than installed. Owner.

## Closed when

- [ ] workdoo's tokens test asserts WCAG AA for text tokens on every surface, in both themes, and passes.
- [ ] The loop runs end to end from the work-item detail (allow, watch, keep or send back), and the Approval Inbox page is retired.
- [ ] A test fails the build if any domain-jargon string (J1/J2, `AUTHORITY_BOUNDARY`, `PLAN_EXHAUSTED`, "roadmap phase") renders on screen.
- [ ] Every screen works at 400px wide and by keyboard alone (⌘K, visible focus, no trap).
