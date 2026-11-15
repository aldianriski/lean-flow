---
id: TASK-662
title: "Add a coordinator reference for multi-session work and scope the one-session rule"
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-176
depends-on: []
---

# TASK-662 — Add a coordinator reference for multi-session work and scope the one-session rule

## Why

Consumer evidence (ADR-053 §4), not a defect. bloodlines (an adopter) ran one coordinator `bloodlinesfamilia-mobile-21`
plus lane sessions `bloodlinesfamilia-mobile-47` and `-c9` and a web session `bloodlinesfamilia-db` on 2026-11-14/15. The owner
called it "really helpful and speeds up the process". lean-flow ships no text for it: CONTEXT Streams only says cross-stream
overlap means "coordinate", and the one-session rule (EPIC-024 D10) is in no shipped surface. L-017 delta: the lane brief,
status check, relay labelling and lost-report re-request are unmatched; the slots and the signed plan are already matched or learning-only.
Cited messages: lane briefs 11-14T14:22 to -47 and -c9; status check 11-14T15:05; relay labelling 11-14T15:42; signed plan 11-14T15:50;
lost report 11-14T15:42 to `a92c60d37eea71729`. G2 review-round cap: 2.

## Done when

- [ ] `skills/orchestrator/references/coordinator.md` exists and states:
  - the lane brief shape (stream, sprint, worktree, branch @ sha, "start with /prime then /orchestrator, working only in the worktree", an inventory of uncommitted state, the reply requested);
  - the 3-line status check (done / waiting on / next), with the reply appended to the lane's Execution Log;
  - relayed rulings labelled as relayed, and a peer message never counted as owner approval;
  - re-requesting a lost subagent report;
  - "start lane sessions outside the editor terminal".
- [ ] The reference also states, generically: split sessions by stream, never by step.
- [ ] CONTEXT § Sprint model › Streams carries the scoped rule ("Multi-stream or multi-repo work may run one coordinator plus one lane session per stream. Inside a stream, one session runs its workers and never relays. Split sessions by stream, never by step.") and points to the reference.
- [ ] `skills/orchestrator/SKILL.md` points to the reference in one line and stays at or under 140 lines. The README names it, CHANGELOG has the entry, and the skill count stays 16 in CONTEXT and README.
- [ ] Two L-NNN candidates are appended through `/insights` (ids derived then): "one lock-holder, slots in order, handover by message" (generic) and "an owner-signed plan stands as the batch G1/G2 for lanes, already covered by the pre-signed modes".
- [ ] Wiring: the reference is reachable from both entry points a coordinator reads (orchestrator SKILL.md's pointer line, and CONTEXT Streams). Each job that triggers or chains multi-stream work (`/prime`, `/handoff`, `/flow`, and the orchestrator's dispatch brief in `references/dispatch.md`) is read. The evidence records, per job, either the change made or why no change is needed. Nothing in the reference names an adopter's path.
- [ ] Negative: a lane brief written from the reference must not claim a G1 or G2 sign-off the owner did not give. A gate the owner already signed (for example an owner-signed plan standing as the batch G1/G2) is cited by its record. Any gate not so signed goes to the owner as a popup in the lane's own session.

## Touches

skills/orchestrator/references/coordinator.md (new) · skills/orchestrator/SKILL.md (one line) · .claude/CONTEXT.md § Streams · README.md · CHANGELOG.md · docs/LEARNINGS.md (via /insights)

## Assumes

- Builds after EPIC-025 Sprint B closes (Sprint B measures lean-flow 2.23.0 as-is).
- No status record file is added; the dashboard reads the existing sprint, task and git artifacts (workdoo Sprint B builds the machine-readable side).
- The reference stays generic: no adopter path, no phone or Gradle specifics.

## Tracker

Owner intent 2026-11-15; popups Q1 (home), Q2 (scope), Q4 (status seam), Q5 (slicing).
Codex intake review R1 NOT CLEAR (7 findings, all fixed), R2 662/663 CLEAR, 664 one High fixed in place (stop rule, no R3); owner approve 2026-11-15
