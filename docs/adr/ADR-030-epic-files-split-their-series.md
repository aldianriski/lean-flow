---
id: ADR-030
tags: [docs, process]
domain: doc-standard
status: accepted
related: [ADR-014, ADR-020, ADR-026]
---

# ADR-030 — Epic files split their append-only series instead of raising the cap

- **Status:** accepted (2026-08-23)
- **Deciders:** Maintainer
- **Context driver:** `EPIC-004` breaches `200 soft` on every run and has been deferred twice; the
  ADLC roadmap's platform epics will be longer-lived than any epic so far.

## Context

An epic outlives a sprint and governs several of them, yet §2 caps it at **200 soft** against the
sprint file's **400 hard**. That inversion is real and it is what the recurring warning feels like
from the authoring side: the file that needs the most room has the least.

**But the breach is not distributed, and that changes the remedy.** Measured on `EPIC-004` at 236
lines:

| Section | Lines | Nature |
|---|---|---|
| `## Closed when` | 124 (53%) | grows by one evidence block per condition ruled |
| `## Why this, why now` | 31 | durable |
| `## Open questions` | 30 | durable, shrinks as questions close |
| `## Member sprints` | 14 rows-worth (9 rows, avg **1,358 chars** each, 12,223 total) | grows by one row per member sprint |
| `## Scope` + `## Decisions` | 21 | durable |

Durable content is **~82 lines**. The remaining ~154 are two **append-only series**: one row per
member sprint, one evidence block per condition ruled. Both grow without bound in the number of member
sprints, and both are the reason the file exists — the template says so of the roll-up in as many
words (*"without it, epic status is reconstructable only by reading N sprint archives"*).

§2's own Growth rule already classifies this case and prescribes the fix:

> **The cap was never reachable.** … the doc's growth is an **append-only series** whose rounds are
> the whole point … Fix the *number* — restate it exactly by ADR — or split the series into a `logs/`
> sibling so the cap lands on the decision and never on the series (ADR-014's mechanism).

The same rule forbids the intuitive move: *"never raise the cap to fit content (§7 — a cap moves only
by ADR, diet first)."* And trimming the evidence is the "squeezing" it names — every route back under
200 runs through deleting the record of why a condition was ruled the way it was.

The mechanism has been applied twice and works: `docs/sprint/logs/` (ADR-014) and `docs/research/logs/`
(SPRINT-062). This is its third application.

## Decision

**`docs/epic/logs/EPIC-NNN-<slug>.md`** — append-only, uncapped — carries the member-sprint
contribution rows and the per-condition ruling evidence. Created lazily at the first member sprint's
close.

The epic file keeps Outcome, Why, Scope, Decisions, Open questions, and the **bare** Closed-when
checkboxes with a pointer to the log. At `EPIC-004`'s measurements that lands an epic near **110
lines**, leaving ~90 lines of headroom under the unchanged `200 soft` — which is the room the platform
epics need for richer Scope and Decisions, and it arrives without moving a number a checker reads.

**The `logs/` subdirectory is load-bearing, exactly as it was twice before.** The cap check derives its
glob from §2's File cell and `docs/epic/*.md` is non-recursive, so a subdirectory is excluded for free
while a same-directory `EPIC-NNN-<slug>-log.md` suffix would be capped at 200 and schema-checked as an
epic — reproducing the defect this ADR removes.

§11 archives the pair together, the way `sprint/` and `sprint/logs/` already move as one.

## Consequences

**Positive:** epic files stay readable at a glance; the series grows freely; the cap becomes a
meaningful signal again instead of a standing warning that trains everyone to ignore it; no number a
checker reads has to move; the pattern is already proven twice, so §2's row, the archival rule and the
tier logic all have working precedent to copy.

**Negative (trade-offs accepted):**
- A third `logs/` tree, and epic status now takes two files to read in full rather than one. That is
  the same cost ADR-014 accepted for sprints and it has not bitten there.
- Existing epics need retrofitting — `EPIC-004` (236 lines, closing now) and `EPIC-005`. **`EPIC-004`
  is being closed in a concurrent session; its retrofit must not race that close** (L-042), so it
  happens after, or not at all if archival makes it moot.
- §2 gains a row, §11 gains an archival pair, and the epic template gains a section pointer — three
  edits to the standard for a problem that a one-line cap change would appear to solve.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Raise the cap `200 → 400` | §2 forbids raising a cap to fit content, and it does not fix the growth: both series are unbounded in member-sprint count, so 400 just relocates the warning to a longer epic. The platform epics are the longest yet. |
| Trim the Closed-when evidence | This is §2's "squeezing". The evidence is *why* a condition was ruled — SPRINT-077's amendment is auditable only because the prior wording was preserved (L-088). Deleting it is deleting the audit trail. |
| Restate the number exactly by ADR, after a diet | §2 permits this and it stays the fallback if the split proves wrong in practice. Rejected as the first move because the diagnosis is *append-only series*, and §2 names the split as that class's remedy while naming the restatement as the other class's. |
| Give the epic no numeric cap, as `spec/STANDARD.md` has | That exemption was ruled (ADR-026) on a file with no working split escape. An epic has one — this ADR is it — so the precondition for exemption is absent. |
