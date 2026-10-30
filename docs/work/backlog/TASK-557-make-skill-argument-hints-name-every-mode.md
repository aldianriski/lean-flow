---
id: TASK-557
title: "Make the lean-doc-generator and humanizer argument hints name every mode"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-557 — Make the lean-doc-generator and humanizer argument hints name every mode

## Why
A measured consumer defect. On 2026-10-30, while running `init` on the SPRINT-150 snapshot, the owner typed
`/lean-doc-generator` and the suggestion offered only `type subject · promote · close`. The skill's `argument-hint` lists 4 of
its 8 documented modes and omits `init`, `migrate`, `epic` and `prd`, so a consumer cannot discover them from the prompt. An
audit of all 15 skills' hints against their documented modes found one more gap: humanizer's hint omits its audit mode. The
other 13 match. A defect fix in shipped frontmatter, so it is not frozen under ADR-053.

## Done when
- [ ] lean-doc-generator's `argument-hint` names every mode its Modes table documents (blank · `<type> <subject>` · `promote` ·
  `close` · `epic "<outcome>"` · `prd` · `migrate` · `init`), and humanizer's names its pasted-text, file and audit modes.
- [ ] A fresh session on the reinstalled plugin shows the full lean-doc-generator suggestion when `/lean-doc-generator` is typed,
  confirmed by the owner.

## Touches
`skills/lean-doc-generator/SKILL.md` · `skills/humanizer/SKILL.md` (frontmatter only) · `CHANGELOG.md`

## Assumes
- The suggestion text the CLI shows is the `argument-hint` value verbatim (the owner's observation matches the current value).

## Tracker
SPRINT-150 owner observation (2026-10-30) · skill-hint audit in that session
