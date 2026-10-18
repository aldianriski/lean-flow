---
id: TASK-447
sprint: SPRINT-128
title: "Close the live freeze and declaration edge cases: CRLF fields, member-edit ordering, dead Layers tokens, preflight wraps"
epic: EPIC-022
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-444]
---

# TASK-447 — Close the live freeze and declaration edge cases

## Why

Four edge cases have real occurrences. The Shell `fmv` readers depend on the host's awk build to read a CRLF file, and 7 plans
plus 3 task files are CRLF in the working tree (TD-131). The ordering half of S9.SCOPECHANGE is lost for member-file edits
(TD-205). A `Layers:` token that matches no file reads exactly like a correct one (TD-177). The shipped dispatch preflight drops a
column-0 wrapped `Layers:` line silently (TD-138's shipped side).

## Done when

- [x] Every Shell frontmatter reader strips a trailing CR itself, with a retained CRLF fixture; no verdict on the 7 CRLF plans ✓ mechanical: every Shell frontmatter reader strips CR itself; CRLF twin fixtures read through a BINMODE awk shim (the host awk hid it); seeds C1a-c
      depends on the host's awk.
- [x] A member `## Done when` edit counts as covered only by a `scope-change` entry that comes before the edit, as § Plan edits ✓ mechanical: ordering walks the baseline's descendants; after-edit must-FAIL, before-edit and side-branch controls; census 5 covered, 0 late, of 127 sprints
      already are, with a must-FAIL fixture for the out-of-order case.
- [x] A `Layers:` token that matches no file or directory is named, with a must-FAIL fixture (admitted under ADR-053 as a ✓ mechanical: layers-token-matches-nothing for finished tasks only, merge diffs included; 5 must-FAILs plus rename, delete and merge controls; live sprint clean
      measured defect).
- [x] The dispatch preflight in `dispatch.md` names a column-0 wrapped `Layers:` line instead of dropping it, its parity ✓ mechanical: the preflight names a column-0 wrap with the remedy; parity harness green; Codex R1 -> R2 CLEAR on the shipped wording
      harness stays green, and the shipped wording passes the Codex review.
- [x] Full Tier G bar on the conformance-reached parts: seeded breaks each redden exactly their case. ✓ mechanical: seeds C1-C6 each redden only their case; coordinator re-seeded C1b (one case); conformance A/B identical

## Touches

- scripts/lib/conformance-engine.sh · scripts/lib/check-handoff-state.sh · scripts/lib/check-research-archive.sh ·
  scripts/lib/check-sprint-by-reference.ts · scripts/lib/check-layers-observed.ts · skills/orchestrator/references/dispatch.md ·
  evals/

## Assumes

- A census of member-edit ordering on the archived sprints is taken at G2; zero real out-of-order cases keeps the fixture but
  is recorded as such.
- TD-177's finding is new machinery and is admitted only if G1 confirms a measured defect behind it.

## Tracker

- EPIC-022 Closed-when 7 · TD-131 · TD-205 · TD-177 · TD-138 (preflight side) · SPRINT-127 intake recon
