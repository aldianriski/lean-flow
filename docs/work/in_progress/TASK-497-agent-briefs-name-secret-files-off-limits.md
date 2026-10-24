---
id: TASK-497
title: "Every agent brief a lean-flow skill writes names secret files as off-limits (promote L-247)"
sprint: SPRINT-139
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
- [x] A census lists every lean-flow procedure that writes a brief for a subagent (builder, reviewer, recon, measurement, ✓ census in § Census, two selectors + block-level third route, 11 briefs (d70586f5, fc5439c8)
      advisor). It is derived by two different selectors that agree, and is listed in this task.
- [x] Each brief site names secret files as off-limits in host-generic words (`.env`, `.env.*`, key and credential files, ✓ rule at 11 briefs across 5 sites (e2865e83 + moderator eda9b5a6); case-insensitive git grep 11 = table 11
      anything the host's ignore rules mark secret) and says a needed value is read from a non-secret record or asked
      for, never opened.
- [x] SKILL.md caps hold; branch-specific wording sits in `references/` behind a read pointer. ✓ task-decomposer 130/140, orchestrator untouched 140; check-doc-caps PASS; detail lives in orchestrator/council references
- [x] Exercised: one real brief from orchestrator dispatch and one from task-decomposer recon carry the line. ✓ real T1 builder dispatch brief + real Explore recon brief (T2 checks) both carried the line
- [x] L-247 is marked `promoted: yes → <where>` with `disposition: move-to-reference`, then collapsed per §11. ✓ L-247 [status: promoted] + pointer naming the sites, disposition: move-to-reference (e2865e83); qa learnings legs PASS
- [x] CHANGELOG line; Codex gauntlet review clean. ✓ CHANGELOG [Unreleased] bullet (e2865e83); Codex CLEAR at round 4 (R3 + R4 owner-authorised)

## Census (brief sites, settled at G2 and re-checked at Codex round 1)

Selector A: a wording grep across `skills/` for sub-agent · dispatch · reviewer · reader · Explore · advisor. Selector B: a
read of each skill's steps that spawn an agent. They agree on five sites, eleven briefs:

| Site | Brief(s) carrying the rule |
|---|---|
| `skills/orchestrator/references/dispatch.md` | builder brief · worktree dispatch protocol |
| `skills/orchestrator/references/review-scoping.md` | reviewer brief |
| `skills/orchestrator/references/builder-check.md` | reader prompt |
| `skills/task-decomposer/SKILL.md` | `Explore` recon (step 1) |
| `skills/council/references/prompts.md` | research · advisor · reviewer · chairman · moderator · fact-check |

Excluded, with reason: `night-run.md` and `night-run-checks.md` dispatch through `dispatch.md`'s briefs; orchestrator
`SKILL.md` names the routing, not a brief; refactor-advisor's "Explore" is a phase, not an agent; diagnose, flow, prototype
and prime spawn no briefed agent; the council's verdict-file block is an output format, not a brief. A third route, an awk
pass over every fenced block in `prompts.md`, found the moderator missing at Codex round 1; it was fixed in `eda9b5a6`.

## Touches
`skills/orchestrator/references/dispatch.md` · `skills/task-decomposer/SKILL.md` (or its references) · other brief sites
the census finds · `docs/LEARNINGS.md` · CHANGELOG

## Assumes
- Placement test (§10): every flow that dispatches an agent can hit the failure, so the rule goes where each one writes its
  brief, not in one skill's red-flags.

## Tracker
L-247 · SPRINT-139 promote governance (owner ruling, 2026-10-24).
