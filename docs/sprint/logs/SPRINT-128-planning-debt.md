---
sprint: 128
slug: planning-debt
owner: Maintainer
last_updated: 2026-10-18
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-128 — Execution Log

> Append-only companion to [`../SPRINT-128-planning-debt.md`](../SPRINT-128-planning-debt.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-18 | promote | plan locked, governance signed, five members: EPIC-022 S4, the planning-checker debt
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due; the two active entries (L-234 · L-210) are at count 1.
- ☑ TD aging: 112 of 114 open rows, counted against sprint 128. Second route: 122 open − 8 closed at this promote = 114, minus the
  2 filed at 127 (TD-253 · TD-254) = 112. Newly aged: TD-251 · TD-252 (filed at 125). No open row is `high`.
- ☑ doc-aging: §11 TD deletion of the 15 rows resolved at 125 (S11.TDDELETE). 8 rows closed with evidence on each, as approved at
  intake: TD-142 · 119 · 145 already fixed; TD-189 · 151 · 185 · 186 census zero (TD-186's unmeasured shape: 0 of 47 task files,
  with a seeded positive control firing); TD-045 retained by design. Store prune: none due, by the engine's own rule run at sprint
  128 (its citation scan reached 209 ids). CHANGELOG rotated at 2.8.0. No §2 cap breach.
- ☑ epic rollup currency: EPIC-022's rows for 125, 126 and 127 carry their close commits; the header is current.
- ☑ epic coverage: EPIC-022 has one open condition (7), re-marked at this promote → TASK-443 · TASK-444 · TASK-445 · TASK-446 ·
  TASK-447. ☑ roadmap coverage: no roadmap in this repo. ☑ handoff ledger: none.
Size check: 4 M + 1 S, with no `L`. All five members are `origin: decomposer`, so each G1 is the fast-path confirm.
Intake recon (Explore, before the grill) is the source for the census figures above and for D1's ownership map.
promote-check 16/0, after two prose fixes: T3 now declares its T1 ownership dependency, and T4's prose no longer names T1.
Dispatch preflight, first run: HALT. T4 shared the `evals/` token with T1–T3 and had no edge to them; 20 files name the twins,
several of them evals the parser tasks also edit. Re-sequenced so T4 runs first, which spares T1–T3 any Shell mirroring.
Preflight now CLEAR (waves T4 · T1 · T2 · T3 · T5).
