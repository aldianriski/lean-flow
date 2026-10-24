---
id: TASK-497
title: "Every agent brief a lean-flow skill writes names secret files as off-limits (promote L-247)"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: manual
state: ready
depends-on: []
---

# TASK-497 — Every agent brief a lean-flow skill writes names secret files as off-limits (promote L-247)

## Why
L-247 reached count 2 at the SPRINT-139 promote. Two SPRINT-138 agents briefed as "read-only" opened `.env` files: the recon
agent read lean-flow's root `.env`, and T7's research builder read workdoo's. Neither brief forbade secret files. The owner
ruled that the promotion lands as this task, the sprint's first member, so the embedded humanizer brief (TASK-493) inherits
the rule.

## Done when
- [ ] A census lists every lean-flow procedure that writes a brief for a subagent (builder, reviewer, recon, measurement,
      advisor). It is derived by two different selectors that agree, and is listed in this task.
- [ ] Each brief site names secret files as off-limits in host-generic words (`.env`, `.env.*`, key and credential files,
      anything the host's ignore rules mark secret) and says a needed value is read from a non-secret record or asked
      for, never opened.
- [ ] SKILL.md caps hold; branch-specific wording sits in `references/` behind a read pointer.
- [ ] Exercised: one real brief from orchestrator dispatch and one from task-decomposer recon carry the line.
- [ ] L-247 is marked `promoted: yes → <where>` with `disposition: move-to-reference`, then collapsed per §11.
- [ ] CHANGELOG line; Codex gauntlet review clean.

## Touches
`skills/orchestrator/references/dispatch.md` · `skills/task-decomposer/SKILL.md` (or its references) · other brief sites
the census finds · `docs/LEARNINGS.md` · CHANGELOG

## Assumes
- Placement test (§10): every flow that dispatches an agent can hit the failure, so the rule goes where each one writes its
  brief, not in one skill's red-flags.

## Tracker
L-247 · SPRINT-139 promote governance (owner ruling, 2026-10-24).
