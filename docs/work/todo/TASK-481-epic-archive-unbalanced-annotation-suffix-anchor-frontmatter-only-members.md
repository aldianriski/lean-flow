---
id: TASK-481
title: "epic-archive: unbalanced annotation, suffix anchor, member list read from frontmatter only"
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
- [ ] An entry whose annotation leaves an unbalanced parenthesis is not classed as a foreign repo; it is reported by the existing
      `unparsed` NOTE arm and earns no foreign exemption. A case asserts the direction-(b) verdict moves from reported to FAIL.
- [ ] Tests assert the suffix anchor at each site separately (member id cell, Closed-when attribution): `SPRINT-91` does not
      match `SPRINT-910`; removing either anchor reddens its own test.
- [ ] `member_sprints:` is read from the frontmatter only; a body or fenced `member_sprints:` line is ignored. Real run over the
      repo's epics: verdicts byte-identical before and after, exit 0.
- [ ] The regression cases live in the TypeScript test suite, not as new fixture directories, so the frozen differential's
      population does not grow (it stays 34/0).
- [ ] TD-148 narrowed to items 3, 6 and 7 in `TECH-DEBT.md`.

## Touches
the epic-archive checker (TypeScript) · its TypeScript test suite · `TECH-DEBT.md`

## Assumes
- The frozen `.sh` twin and the differential stay untouched; the divergence on these new inputs is documented in the code, as
  SPRINT-136 T1 did.

## Tracker

- TD-148 · intake draft reviewed by Codex 2026-10-22 (APPROVE WITH FIXES, folded in before approve)
