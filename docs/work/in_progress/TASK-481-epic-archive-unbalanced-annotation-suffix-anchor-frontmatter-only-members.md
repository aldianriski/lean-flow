---
id: TASK-481
title: "epic-archive: unbalanced annotation, suffix anchor, member list read from frontmatter only"
sprint: SPRINT-137
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-481 — epic-archive: unbalanced annotation, suffix anchor, member list read from frontmatter only

## Why
TD-148 (medium; item 1 done at SPRINT-136) items 2, 4, 5 against the live `check-epic-archive.ts` (the `.sh` is a frozen twin).
(2) `[SPRINT-801, (closed 802]` strips only balanced parens, tokenises `(closed` as a repo qualifier and `802` as its number, so
802 is classed foreign: it gets a foreign-member NOTE and, in direction (b), the foreign exemption, so a closed live epic whose
conditions are all met is reported rather than required to archive. (4) The `SPRINT-0*N([^0-9]|$)` suffix anchors (two sites: the § Member sprints id cell and the Closed-when
attribution) have no test; removing either leaves every existing result unchanged. (5) `parseMemberEntries` takes the first `member_sprints:` line anywhere in the file,
fences included; `frontmatterValue` is frontmatter-scoped but unused here. Latent: every real epic has the key once, in
frontmatter.

## Done when
- [x] An entry whose annotation leaves an unbalanced parenthesis is not classed as a foreign repo; it is reported by the existing ✓ `9d762603` + retry `14b0b15c`: `(closed 802` and `closed) 802` read as unparsed, no foreign NOTE, direction-(b) verdict reported -> FAIL; the `)` case reddens with the guard removed
      `unparsed` NOTE arm and earns no foreign exemption. A case asserts the direction-(b) verdict moves from reported to FAIL.
- [x] Tests assert the suffix anchor at each site separately (member id cell, Closed-when attribution): `SPRINT-91` does not ✓ seeded removal re-verified 2026-10-24: id-cell anchor -> only anchor-member-id-cell fails; Closed-when anchor -> only anchor-closed-when fails (59/1 each), restored (hash-object == HEAD)
      match `SPRINT-910`; removing either anchor reddens its own test.
- [x] `member_sprints:` is read from the frontmatter only; a body or fenced `member_sprints:` line is ignored. Real run over the ✓ body/fenced key ignored (suite); real run over the repo's epics before (`9d762603^`) vs after: 17 lines each, exit 0, byte-identical
      repo's epics: verdicts byte-identical before and after, exit 0.
- [x] The regression cases live in the TypeScript test suite, not as new fixture directories, so the frozen differential's ✓ cases in evals/epic-archive.test.ts (60/0), no new fixture directory; differential untouched
      population does not grow (it stays 34/0).
- [x] TD-148 narrowed to items 3, 6 and 7 in `TECH-DEBT.md`. ✓ `8f8b5425`: items 2, 4, 5 done; 3, 6, 7 open

## Touches
the epic-archive checker (TypeScript) · its TypeScript test suite · `TECH-DEBT.md`

## Assumes
- The frozen `.sh` twin and the differential stay untouched; the divergence on these new inputs is documented in the code, as
  SPRINT-136 T1 did.

## Tracker

- TD-148 · intake draft reviewed by Codex 2026-10-22 (APPROVE WITH FIXES, folded in before approve)
