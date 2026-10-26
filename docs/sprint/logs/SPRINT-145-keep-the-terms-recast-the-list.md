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

### 2026-10-26 | gate | G1 + G2 signed by the owner by popup; two builder checks settled
G1: both members are `origin: decomposer`; the owner confirmed scope unchanged since `approve` (fast-path). G2:
`skills/humanizer/references/patterns-id.md` and `CHANGELOG.md` are shared, owned T1 → T2 (D1). Dispatch preflight
CLEAR (T1=0, T2=1, base-ref = HEAD); sequential in the main tree. The owner approved the run spend (T1 six headless runs
and a judge, three more if the baseline does not fail; T2 three runs and a judge; Codex per task, cap 2 rounds).
A2 and A3 confirmed by reading: a document takes the embedded child path (`embedded.md` § Route), and the fixture's fact
list counts each open item.
Settled facts and design fixes (coordinator, from the builder checks):
- T1: the rule uses the frozen wording, with a lead sentence that also covers a test name (the acceptance test row). The
  baseline export is `81a8ef87`, the 2.17.0 release; the three pattern catalogs are byte-identical to `plan_commit` (empty
  diff). The fixture's facts list says the T2 material (to-do list, hedges, fragments) is judged in T1 only as facts;
  "cadangan" joins the anglicization watchlist.
- T2: the ID-18 example's Before carries the same test as its After (uji fio saat acceptance test), so the pair keeps its
  facts equal; ID-18 goes after ID-10; only the two named hedges, with a When-not-to-act for a real approximation
  ("kurang lebih 40 TB"); only the Indonesian pair takes a formal close. T2 records its runs in the T1 fixture NOTES, by
  the scope-change below.
builder-check · T1 · 2 contradictions · 3 questions · frozen wording kept; baseline commit verified; T2 material facts-only; cadangan watched
builder-check · T2 · 1 contradictions · 5 questions · ID-18 example facts equal; placement after ID-10; extra hedges cut; NOTES by scope-change

### 2026-10-26 | scope-change | T2 adds the term-of-art fixture NOTES to its Layers
What broke: T2's box 4 runs on the T1 fixture, and its run record belongs in
`evals/fixtures/humanizer/term-of-art/NOTES.md`, a file T2's `Layers:` did not name. Impact: the path joins T2's
`Layers:`; no Done-when changes. G2 confirmed by the owner in the same popup.
