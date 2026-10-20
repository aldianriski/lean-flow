---
sprint: 132
slug: expertise-without-the-plugin
owner: Maintainer
last_updated: 2026-10-20
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-132 — Execution Log

> Append-only companion to [`../SPRINT-132-expertise-without-the-plugin.md`](../SPRINT-132-expertise-without-the-plugin.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line budget
> (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry carrying the signed
> governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a `scope-change` entry — what broke ·
> impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-20 | promote | plan locked, governance signed, three members: EPIC-007's first slice
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. The six active entries (L-239 · 238 · 237 · 236 · 234 · 210) are each at count 1. A query that also
  matched L-155 was checked by its header, `[status: promoted]` (its body quotes a status string).
- ☑ TD aging: 103 of 105 open rows aged against sprint 132; none newly aged (no open row was created at Sprint-129); TD-259 · 260
  (Sprint-131) are not aged. Second route: 108 rows − 3 resolved = 105 open. No open row is `high`.
- ☑ doc-aging, §11: TD deletion not due (TD-135 · 154 · 167 resolved at SPRINT-130, due at 133). The store prune of
  `done/TASK-451`–`454` (closed SPRINT-129) is due by age, but all four still have live citations (research docs and their
  cancelled twins), so none is pruned. CHANGELOG rotation ran at the 2.11.0 release.
- ☑ doc-aging, §2: one soft breach, `docs/research/reference-rejudge.md` (170 > 130). Resolved, owner-approved and before this
  commit: § Experiment results moved verbatim to `docs/research/logs/reference-rejudge-experiments.md` (`ef033c9b`; diff-proven
  verbatim), leaving a pointer. The file is now 78 lines.
- ☑ epic rollup currency: EPIC-007 is activated by this promote (no member closed before it), so there is no drift.
- ☑ epic coverage: EPIC-007 has 6 open conditions and 6 marked (C1 → TASK-463, TASK-464 · C2 → TASK-464 + next slice · C3 →
  TASK-465 · C4 → TASK-464 + next slice · C5 → next slice: gate-condition ruling · C6 → TASK-463). Cross-check: 6 = 6 + 0.
- ☑ roadmap coverage: no roadmap. ☑ handoff ledger: none.
Epic refresh (owner-approved): `status: active`; D3 amended (EPIC-006 closed, so the Lane-2 sequencing is moot); D6 and D7
record the intake rulings; open question 4 is answered by D7; the INDEX row is updated; and `docs/epic/logs/EPIC-007-workflow-packs.md`
is created with this sprint's row.
Size check: 2 M + 1 S, no `L`. All three members are `origin: decomposer` (decomposed 2026-10-19, `cc77da66`).
promote-check 10/0 after one fix: T3's prose named `qa-check.sh` (to say no leg is added). A Cites: entry did not satisfy the prose leg, which compares the bare filename literally (TD-257), so the prose was reworded. Dispatch preflight: PASS base-ref · waves T1=0 T2=1 T3=2 · `packs/` and `skills/diagnose/` owned in order T1 → T2 · PREFLIGHT: CLEAR.
