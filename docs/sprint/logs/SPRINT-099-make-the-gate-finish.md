---
sprint: 099
slug: make-the-gate-finish
owner: Maintainer
last_updated: 2026-09-12
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-099 — Execution Log

> Append-only companion to [`../SPRINT-099-make-the-gate-finish.md`](../SPRINT-099-make-the-gate-finish.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-12 | scope-change | T3 — A4 refuted: the archive predicate has ten call sites, not three

**What broke.** Assumption **A4** states the `*/archive/*` predicate has exactly three call sites and
instructs the builder to derive the set rather than inherit the count (L-186). Derived it. The set is
**ten** exclusion sites, not three:

| # | Site | In T3's DoD? |
|---|---|---|
| 1 | `scripts/lib/check-layers-observed.sh:373` | yes (cited as `:344` — stale line) |
| 2 | `scripts/lib/check-layers-observed.sh:431` | yes (cited as `:401` — stale line) |
| 3 | `scripts/lib/check-layers-completeness.sh:234` | yes (cited as `:183` — stale line) |
| 4 | `scripts/lib/check-approval-envelope.sh:44` | **no** |
| 5 | `scripts/lib/check-night-run-rollup.sh:72` | **no** |
| 6 | `scripts/lib/check-review-depth.sh:126` | **no** |
| 7 | `scripts/lib/check-verify-reaches.sh:55` | **no** |
| 8 | `scripts/lib/conformance-engine.sh:948` | **no** |
| 9 | `scripts/qa-check.sh:789` | **no** |
| 10 | `evals/lib/check-system-verify-block.sh:68` | **no** |

An eleventh site, `scripts/lib/check-handoff-state.sh:145`, uses the same case-sensitive glob to
**map** a Plan path to its log path rather than to exclude. Same defect class, different failure mode
(a mis-mapped log rather than a stale-content FAIL). Ruled **out of T3** and filed as a follow-up.

**Motivating case re-verified on this host.** `docs/sprint/archive` and `docs/sprint/Archive` report
inode `5066549582447480` — one directory under two spellings, excluded by one and not the other. The
sprint file quotes inode `5910974512661248`; the identity claim holds, that figure does not, and it is
not re-used below (L-130).

**Impact.** T3's declared `size: S` was scaled to three single-line edits. Ten sites under one shared
predicate, each needing a call-site enumeration and a seeded break (L-193), is an **M**. More
consequentially, the enlarged set **includes `scripts/qa-check.sh:789`, which T2 owns** — so **D2's
"T3 is disjoint … eligible for a parallel worktree-isolated build" no longer holds.** The wave
collapses from `T1 ∥ T3, then T2` to a single ownership chain.

**Re-confirm G2.** Owner ruled both open questions in one frontier round:
- **T3 scope → all ten exclusion sites under one shared predicate**, mapping site deferred.
- **T1 → three instrumented gate runs happen in-session**, nothing else concurrent.

Sequencing re-derived from the enlarged set and recorded as the overlap map: **T1 → T2 → T3**,
sequential, `scripts/qa-check.sh` owned in that order (extends **D1**, which ordered it T1 → T2 only).
Per-hunk staging on that file at every commit; never a plain `git add` over another task's WIP
(L-042 · L-037).
