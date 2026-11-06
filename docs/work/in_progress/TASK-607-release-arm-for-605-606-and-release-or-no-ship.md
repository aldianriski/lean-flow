---
id: TASK-607
title: "Release 2.21.0 without an arm, under a one-time D19 exception"
type: feature
priority: P2
size: S
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-605, TASK-606, TASK-608]
gates_signed: G1 @ ced08844
---

# TASK-607 — Release 2.21.0 without an arm, under a one-time D19 exception

## Why
EPIC-023 D19 runs an arm before a release that changes `/orchestrator` or gate behaviour, and TASK-606 changes a G2 line. Owner ruling
(popup, 2026-11-06): no arm for this release, because about 50 USD and a measuring run are not worth it for a change this size. A Codex
review of the whole change stands in: round 1 found four Med and no High, all fixed in `07e2c1b6`; round 2 CLEAR. Codex rated arm risk
Medium for the operator and classifier routing, the Standards setup and review, negative-scenario decomposition, bug readiness and G2
enforcement, since reading cannot show how often they add turns, cost or rejections. The exception covers this release only; D19 stands.

## Done when
- [x] The one-time D19 exception is recorded here and in the CHANGELOG entry, with the owner's reason and Codex's verdict. ✓ 1b1e1a6e
- [x] Every versioned manifest and the README footer read 2.21.0, derived with `grep -l '"version"' .*-plugin/*.json`. ✓ four manifests and the footer, 1b1e1a6e
- [x] CHANGELOG has the 2.21.0 entry, says no arm measured it, and `[Unreleased]` is emptied into it. ✓ 1b1e1a6e; v2.19.x rotated (§11)
- [x] The off-host gate is green at the release commit, and nothing is pushed. ✓ gate at 1b1e1a6e: 487 pass, 0 fail; bun test 589 pass, 0 fail; push is the owner's
- [x] Negative: no trial runs for this release, and TD-289 and TD-290 stay open for the next arm's amendment. ✓ no trial ran; both rows open

## Touches
`CHANGELOG.md` · `.claude-plugin/` · `.codex-plugin/` · `.kimi-plugin/` · `README.md`

## Assumes
- Replaces the arm task as first written; the rewrite and its scope were approved by owner popup at G1, 2026-11-06.
- TD-293 needs no ruling now: with no arm, nothing depends on the operated migrate route until the next one.

## Tracker
TASK-601 (superseded) · EPIC-023 D19 · TD-289 · TD-290 · TD-293 · owner rulings 2026-11-06
