---
sprint: 140
slug: anti-slop-where-the-work-happens
owner: Maintainer
last_updated: 2026-10-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-140 — Execution Log

> Append-only companion to [`../SPRINT-140-anti-slop-where-the-work-happens.md`](../SPRINT-140-anti-slop-where-the-work-happens.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-25 | promote | plan locked, governance signed, nine members: anti-slop where the work happens
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: three due. L-237 (a G2 design that paraphrases a frozen Done-when can loosen it), L-240 (a `Layers:` token
  declared for an undecided G2 choice must be pruned once G2 rules) and L-241 (a "without the plugin" proof needs a separate
  headless process, judged from its own init event), each at count 2 with `promoted: no`. Owner ruling: they land as one
  task, TASK-508, this sprint's T1, with a disposition on each pointer when T1 closes. Census, position-anchored on the
  header's status field: 14 active + 214 promoted + 1 superseded = 229 headers, equal to the count of `## L-NNN` headers.
  Reading each active entry's own `count:` and `promoted:` lines lists the same 14 ids; the other 11 are at count 1.
- ☑ TD aging: 93 of 98 open rows aged against sprint 140. Second route: 103 rows − 5 resolved = 98 open, 93 aged + 5 young
  (TD-268 · 269 · 270 · 271 · 272) = 98. A bare `grep 'status: open'` returns 103; the five extra are prose quotes inside
  the file, not rows. Newly aged: TD-267 (low, filed at 137). None is `high`.
- ☑ doc-aging, §11 (owner-approved, applied in `e018ea8d`): TD-163 and TD-099 deleted (resolved at 137; ids stay retired).
  TD-222, 212 and 194 were resolved at 138 and are not yet due. TASK-478, 479, 480 and 481 (SPRINT-137) were pruned: no live
  `.md` citation by two routes (a `git grep` pathspec query and a plain recursive grep with the history paths filtered out),
  and both routes, run on TASK-473 as a control, hit `spec/CHANGELOG.md`. The cancelled TASK-322, 347, 366 and 461 stay; each
  is still cited. No CHANGELOG rotation is due (2.15.0 and 2.14.0 are inline). No LEARNINGS collapse is due: the same six
  `promoted: yes` lines as at SPRINT-139.
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` exits 0 with no FAIL line. `.claude/CLAUDE.md` 80/80, `.claude/CONTEXT.md`
  149/150; the always-loaded token budget reads ~14114 of 16087.
- ☑ epic rollup currency and epic coverage: no active epic (seven closed, one proposed). ☑ roadmap: none. ☑ handoff ledger:
  none.
Intake: the owner asked what makes anti-slop (`miqdadbadjuber/anti-slop` @ `4ca3b11c`) special and what lean-flow could take
from it. The scan mapped each anti-slop skill against lean-flow's surface first (L-017). Rulings by popup: take code-comment
hygiene, five copy patterns, an audit mode, Grep counts, three code tells, a UI floor, honest prototype placeholders, a DESIGN
direction field, CLAUDE.md compaction and a cross-OS CI matrix; leave the rulebook and the UI pattern lists in anti-slop. At
the grill: compaction is rule plus pointer with a measured ratchet, and the per-line character cap is dropped (ADR-048's token
budget already covers it); the CI matrix is parked `needs-info` P3 (TASK-507); the comment and code tells merge into one task;
audit mode fires on an explicit request only. Decomposed into TASK-499..507 and filed with TASK-508 in `08d2fbc6`.
Size check: 3 M, 6 S, no `L`. Eight members are `origin: decomposer`; TASK-508 is `origin: manual` (filed from governance,
not grilled at intake). No epic.
