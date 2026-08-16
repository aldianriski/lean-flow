---
sprint: 069
slug: first-extraction
owner: Maintainer
last_updated: 2026-08-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-069 — Execution Log

> Append-only companion to [`../SPRINT-069-first-extraction.md`](../SPRINT-069-first-extraction.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a
> new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-16 | scope-change | Plan amended pre-execution: three Depends-on edges added so the preflight can read D3's ownership ruling

**What broke.** The batch-G2 pre-dispatch preflight HALTed on **7 findings** before any task started,
run against `docs/sprint/SPRINT-069-first-extraction.md` at declared base `b53b8e2` (== live HEAD):

- `docs/epic/EPIC-003-the-standard.md` shared by **T1 and T2** with no `Depends-on` edge, direct or
  transitive.
- T3's directory-level `Layers:` (`docs/` · `scripts/lib/` · `evals/`) subsuming **T1**'s three
  specific doc paths (3 findings) and **T4**'s two checkers plus `evals/` (3 findings), no edge in
  either case.

The first is the load-bearing one. **§ Decisions D3 already ruled that ownership** — *"T1 owns the
file and commits first"* — so the decision was made, correctly, at promote. It was written as prose
in § Decisions, and the preflight derives ownership from `Depends-on:` edges, which is the one place
it was not written. **L-099's shape exactly: a rule placed where its checker cannot read it** — and
it was authored in the same session that re-reviewed TD-051, whose whole subject is a guard that
cannot see what it guards. Prose ruling, machine-read field, no bridge between them.

**Impact.** Nothing built yet, so the cost is this entry plus a two-line Plan edit — the cheapest
point in the sprint at which this could surface, and the reason the preflight runs before the first
dispatch rather than after the first merge. Had it been overridden instead, T1 and T2 could have been
dispatched in parallel against one epic file, which is SPRINT-041's corruption shape.

**The amendment** (owner-approved 2026-08-16, before § Plan was touched):

- **T2** `Depends-on: none` → `Depends-on: T1` — makes D3's prose ruling machine-readable; T1 commits
  the epic file first, T2 follows.
- **T3** `Depends-on: T2` → `Depends-on: T2 · T4` — makes "T3 runs last" explicit rather than implied.
  T3's `Layers:` are deliberately directory-level (its file set is re-derived at execution, since a
  path list written at promote goes stale before an AFK task is picked up), so the honest fix is an
  ordering edge, not a narrower declaration that would contradict the task's own design.

**Re-confirm G2.** Scope is unchanged — no task gained, lost or altered a DoD line, an acceptance
criterion or a file. What changed is execution *order*, from three parallel waves to two plus a
sequential tail. Batch G1 was signed before this entry (2026-08-16, all five tasks); G2 is signed
against the amended Plan, with the preflight re-run to CLEAR as its evidence.
