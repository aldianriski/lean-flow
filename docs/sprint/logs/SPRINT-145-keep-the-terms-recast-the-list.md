---
sprint: 145
slug: keep-the-terms-recast-the-list
owner: Maintainer
last_updated: 2026-10-26
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-145 — Execution Log

> Append-only companion to [`../SPRINT-145-keep-the-terms-recast-the-list.md`](../SPRINT-145-keep-the-terms-recast-the-list.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-26 | promote | plan locked, governance signed, two members: keep the terms, recast the list
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: one due, applied at this promote by owner ruling. L-257 (a scope-change body's backticked spans are all
  read as paths) at count 2 → merged into LEARNINGS § Durable rules › edit-safety, appended to the scope-change line
  (L-234's), disposition merge. Census after: 16 active + 221 promoted + 1 superseded = 238, equal to the heading count.
- ☑ TD aging: 101 of 103 open rows aged against sprint 145. Second route, by severity: 57 + 17 + 24 + 5 = 103. None newly
  aged. Young: TD-276, 277. None is `high`. TD-278 resolved at SPRINT-144.
- ☑ doc-aging, §11 (owner-approved): TASK-512 (SPRINT-142, closed 3 sprints ago) pruned. No live `.md` citation by two
  routes (tracked-file grep with the §11 history paths filtered out, and ripgrep over the working tree); the TASK-473
  control hits on both. TASK-511 kept: cited by `TECH-DEBT.md` and the fact-keep fixture NOTES. No TD deletion is due
  (TD-278 resolved one sprint ago), CHANGELOG already rotated at 2.18.0, no LEARNINGS collapse.
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` prints no FAIL line; `.claude/CLAUDE.md` 79/80, `.claude/CONTEXT.md` and
  `docs/architecture/overview.md` 149/150; the token budget reads ~12688 of 12691.
- ☑ epic rollup currency and epic coverage: no active epic. ☑ roadmap: none. ☑ handoff ledger: none.
Intake: a peer session's feedback from a real BNPT memo became TASK-525 and TASK-526 (intake draft Codex R2 CLEAR, owner
`approve`); the peer could not supply the pre-correction memo text, so the owner ruled a synthetic fixture and `/triage`
readied TASK-525. The owner chose both tasks; TASK-526's `blocked` state clears inside the sprint once T1 is done. Size
check: two S, no `L`. Both are `origin: decomposer`. No epic.
