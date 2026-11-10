---
id: TASK-646
title: "Owner ruling: ship the row 6 merger and the row 9 reproducer under D5, or record that they stay trial results"
type: feature
epic: EPIC-024
sprint: SPRINT-171
priority: P2
size: S
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: blocked
depends-on: [TASK-641, TASK-642]
---

# TASK-646 — Owner ruling: ship the row 6 merger and the row 9 reproducer under D5, or record that they stay trial results

## Why
SPRINT-170 ended with two passes: row 6 (merger) and row 9 (reproducer). Nothing ships from a pass alone. EPIC-024 D5 needs a separate owner ruling per release, a clean install and, for an agent, a fallback on hosts without agents; row 9 also ships only by owner exception (ADR-053). The owner's ruling at the close: nothing ships as a role yet. This task holds the open EPIC-024 condition "whatever passed has shipped under D5, or the owner ruled not to ship it" as an owner action, with the evidence the ruling needs, including Codex's challenges: row 6 is a provisional go until TASK-641 confirms it, and row 9 stopped `/diagnose` after Phase 2 (TASK-642).

## Done when

- [x] The owner has ruled for each of rows 6 and 9: ship under D5, ship after a named confirmation (TASK-641 or TASK-642), or do not ship, and the ruling is recorded in EPIC-024 with its date. ✓ owner popup 2026-11-10 "Hold both": ship after TASK-641 (row 6) and TASK-642 (row 9); EPIC-024 D15
- [x] If any row ships: a clean install shows it works, a fallback exists for hosts without agents, and README and CHANGELOG say so; if none ships, the epic's last Closed-when box is ticked with "owner ruled not to ship". ✓ none ships, owner popup 2026-11-10: row 6 "Do not ship (Recommended)", row 9 "Do not ship (Recommended)"; EPIC-024's last Closed-when box reads `[x]` with "owner ruled not to ship rows 6 and 9, 2026-11-10, on SPRINT-171 (D21)"
- [x] Negative: nothing from a trial branch (`agents/merger.md`, the reproducer) lands on `main` or in `.claude/agents/` before that ruling. ✓ at the ruling: `git log --oneline 18148168..main -- agents/ .claude/agents/` empty and `git diff 18148168 main -- skills/diagnose` empty (design S4, history not a snapshot)

## Touches
`docs/epic/EPIC-024-agent-roles-one-by-one.md`; on a "ship" ruling, the agent files, README and CHANGELOG.

## Assumes
- **blocked-by:** TASK-641 (row 6) and TASK-642 (row 9), the confirmations the owner's 2026-11-10 ruling names.

## Tracker
SPRINT-170 close Retro · EPIC-024 D5 and its last Closed-when box · TASK-634 and TASK-637 § Results
