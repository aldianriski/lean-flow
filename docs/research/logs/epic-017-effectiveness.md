---
owner: Maintainer
last_updated: 2026-10-03
update_trigger: a measurement round is appended
status: active
id: epic-017-effectiveness-log
tags: [process, tooling]
domain: governance
related: [epic-017-effectiveness]
---

# EPIC-017 effectiveness — the "after" measurement log (SPRINT-114 T5, TASK-386)

> Append-only companion to [`../epic-017-effectiveness.md`](../epic-017-effectiveness.md), which holds the method and the
> "before" baseline at `4136ded` and sits at a `retain` disposition over its cap. That is why the "after" figures land here
> (STANDARD §2 `research/logs/` row · ADR-014's mechanism). **Never edit a past round**; a correction is a new round.
> The method is re-run **unchanged**. A key that moved is a method failure, not a miss.

## Round 1 — "after" retrieval key (committed before any answer is collected)

Re-verified at HEAD `8a6a989` (each key path exists on disk). Probes R3–R12 keep the "before" keys verbatim. **R1 and R2 move
to their v2 locations**, as the baseline itself recorded ("R1/R2 keys are layout-dependent, so the after-run scores the same
probes against the v2 locations"):

| # | Probe (verbatim) | "after" answer key |
|---|---|---|
| R1 | Where does a new TASK get written today? | `docs/work/backlog/` (`docs/work/backlog/TASK-NNN-<slug>.md`) |
| R2 | Which file points to the currently active sprint? | the top-level `docs/sprint/SPRINT-NNN-<slug>.md` whose frontmatter is `status: active` (v2 has no separate pointer file) |
| R3–R12 | unchanged | unchanged (see the parent's § 2 Retrieval) |

Scoring is unchanged: **hit** = names the key path exactly, or names the key's directory for a directory-level key; anything else
is a **miss**. For R2, naming `docs/sprint/` plus `status: active` is the hit; naming `TODO.md` is a miss, because that file no longer
exists.

**Completeness is not re-run (owner ruling 2026-10-03).** The metric is *first decomposition pass ÷ settled set* for one epic.
Since the store landed there has been no new epic decomposition, so there is no "after" event to measure. A synthetic
re-decomposition was offered and declined (it would have been an artificial, contaminated input). The comparison is recorded as **not
measurable**, the verdict rests on retrieval + recurrence, and the gap is carried to the next real epic decomposition.
