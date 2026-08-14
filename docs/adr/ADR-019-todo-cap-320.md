---
id: ADR-019
tags: [docs, process]
domain: doc-standard
status: accepted
related: [ADR-015, ADR-017, ADR-007]
---

# ADR-019 — `TODO.md`'s cap moves to 320, because the schema costs more than the cap ever budgeted

- **Status:** accepted (2026-08-14)
- **Deciders:** Maintainer
- **Context driver:** a cap that no honest prune could reach, breached continuously for sprints.

## Context

`TODO.md` has sat over its `~150 soft` cap long enough that the breach reads as background noise. At
SPRINT-063 promote it measured **256 lines**. The standing assumption was drift — a backlog nobody had
pruned.

**The arithmetic says otherwise, and it is the standard's own arithmetic.** Measured at SPRINT-063 T1:

| Component | Lines |
|---|---|
| § Backlog entries (10 tasks) | 176 |
| Everything else — header, how-to-use, § Active Sprint, priority headers, § P3 note, Tech Debt pointer, § Changelog, Quick Rules | ~80 |
| **Total** | **256** |

That is **~17.6 lines per task entry**, and it is not padding. `CONTEXT.md` § Task entry shape mandates
ten fields per entry — `class:` · `done-when:` · `touches:` · `depends-on:` · `assumes:` · `tracker:` ·
`origin:` · `state:`, plus the title line and its size/risk/autonomy tags. A backlog of eight costs
~141 lines of entries before a single line of scaffolding. **The cap and the schema cannot both hold.**

This is L-106's shape exactly: *a figure a checker reads is exact — and a breach that resists every
honest fix means the number is wrong, not the file.* Every route back under 150 runs through deleting
backlog entries that are live work, or through shrinking the entry schema the standard itself requires.
§2's Growth rule sorts a breach into *drift* or *a cap that was never reachable*; this is the second.

**The satellite split was ruled first, then re-ruled on measurement.** §6's split route was the initial
decision — move § Backlog behind a pointer. Measuring its cost retired it: `TODO.md` is referenced **72
times across 25 files**, and **22 of those name § Backlog specifically** — `/prime`, `/triage`,
`/task-decomposer`, `/lean-doc-generator` (SKILL + DOCS_Guide §2/§11 + `init` + `migration-map`),
`dispatch.md`, three `scripts/lib/check-*.sh`, `qa-check.sh`, `CONTEXT.md`, `README.md`, and nine eval
fixtures. A split that rewires 25 files to move one section is not a diet; and a split that *doesn't*
rewire them is L-020's half-shipped capability, with the three checkers that glob `TODO.md` breaking first.

## Decision

**`TODO.md`'s cap moves from `~150 soft` to `320 soft`**, cited inline in DOCS_Guide §2.

**320 is derived, not chosen.** Scaffolding measured at ~80 lines, entries at ~17.6 each; 320 budgets a
working backlog of **13–14 tasks** (80 + 13.6 × 17.6 ≈ 319). At today's 256 that is **20% headroom**,
and §11's close-time prune of this sprint's four promoted entries returns roughly 66 more.

It stays **soft**, and that is the opposite call to ADR-017's. `CONTEXT.md` took a hard cap because the
forcing function is what produced its diet pass. `TODO.md` already has a different mechanism pointed at
it: §11's `TODO.md whole file > cap at promote → flag in the governance review; prune with the user`.
The action there is a *prune conversation*, which needs the breach **reported**, not the gate failed. A
hard cap would redden the build on a backlog that legitimately grew between two prunes — punishing the
loop for working, which is what ADR-017 refused to do for a different file.

No row is added to `scripts/lib/doc-caps-grandfathered.txt`: ADR-015 rule 2 makes a soft-capped path
illegal there, and the file stays empty.

## Consequences

**Positive:** the §2 cap report stops emitting a breach nobody can act on, so the doc-aging line
SPRINT-062 T2 wired to a consumer now carries signal instead of a standing false alarm. The entry
schema and the cap stop contradicting each other. The number is derived from a measured per-entry cost,
so the next occupant of this decision can re-measure rather than re-argue.

**Negative (trade-offs accepted):**

- **A 320-line `TODO.md` is more to read**, and `/prime` reads it every session. The per-entry cost is
  the thing to attack if that bites; the cap was never what kept the file short.
- **Soft means it can drift again.** §11's prune is the only brake, and it fires at promote — so a long
  gap between sprints is a long gap without one.
- **The satellite split is deferred, not refuted.** If the backlog outgrows ~14 entries the split
  becomes right again, and its 25-file wiring cost is recorded here so the next attempt starts from a
  measurement instead of an estimate.

## Alternatives considered

| Option | Why rejected |
|---|---|
| §6 split — § Backlog → satellite behind a pointer | Correct in shape, and the first ruling. Retired on measurement: 25 files and 72 references would need rewiring, against T1's six declared `Layers:` paths. Deferred, not refuted — see Consequences. |
| Split now, rewire as a follow-up `TASK` | L-020 by construction. Three `check-*.sh` glob `TODO.md` directly and break on the first run; the satellite would read as shipped while being unwired. |
| Prune harder under §11 | Measured: close-time prune of this sprint's four promoted entries buys ~66 lines, leaving ~190 against 150. Does not reach the cap, and the entries it would need to delete are live work. |
| Raise to 320 **hard** | Matches ADR-017's shape, and is wrong here. §11's response to this cap is a prune *conversation* with the owner, which requires a report; a hard cap fails the gate instead of starting that conversation. |
| Shrink § Task entry shape | The schema is why entries are informative — `assumes:`/`origin:`/`depends-on:` each exist because a specific failure produced them (L-114, G1's fast-path provenance). Cheapening it to fit a line count trades a real guard for a number. |
