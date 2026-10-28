---
sprint: 146
slug: say-what-they-saw
owner: Maintainer
last_updated: 2026-10-28
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-146 — Execution Log

> Append-only companion to [`../SPRINT-146-say-what-they-saw.md`](../SPRINT-146-say-what-they-saw.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-28 | promote | plan locked, governance signed, three members: guards that say what they saw
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: one due, applied at this promote by owner ruling. L-258 (a tick on a member outside its task's declared
  folders commits as bare `sprint(N):`) at count 2 → merged into `.claude/CONTEXT.md` § Sprint model, appended to L-238's
  coordinator-write line, disposition merge (`40e92b16`). Census after: 15 active + 222 promoted + 1 superseded = 238,
  equal to the heading count.
- ☑ TD aging: 101 of 101 open rows aged against sprint 146; TD-276 and TD-277 (Sprint-143, low) newly aged. Second
  route, by severity: 57 + 15 + 24 + 5 = 101. None is `high`. TD-128 and TD-166 resolved the day before (fixed in code
  at SPRINT-099 T2 + ADR-042 and SPRINT-115 T4, rows never closed; `1635712b`).
- ☑ doc-aging, §11 (owner-approved): TASK-513, 514, 516, 519, 521, 522 (SPRINT-143, closed 3 sprints ago) pruned
  (`49b0b065`). No live `.md` citation by two routes (git grep and ripgrep, §11 history paths filtered out); the TASK-367
  control hits on both. None is the store's highest id. No TD deletion is due (TD-278 resolved two sprints ago);
  CHANGELOG already rotated at 2.19.0; no LEARNINGS collapse.
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` prints no FAIL line; `.claude/CLAUDE.md` 79/80, `.claude/CONTEXT.md`
  and `docs/architecture/overview.md` 149/150.
- ☑ epic rollup currency and epic coverage: no active epic. ☑ roadmap: none. ☑ handoff ledger: none.
Intake: the owner chose the false-green guard cluster from the /prime overview (TD-128, 155, 152, 201, 166). Recon found
TD-128 and TD-166 already fixed, so `/task-decomposer` drafted TASK-527..530 (owner `approve`). The intake Codex review
ran after `approve` rather than before it, a coordinator miss: R1 NOT CLEAR (527 is new machinery under ADR-053; 528, 529
and 530 lacked the Other-G real-artifact run; 529 claimed more than it removes), R2 CLEAR after the fixes (`f41b4d73`).
Owner rulings: TASK-527 cancelled (`c07b3006`); TD-152's detection limit resolves as accepted. Size check: three S, no
`L`. All three are `origin: decomposer`. No epic.
