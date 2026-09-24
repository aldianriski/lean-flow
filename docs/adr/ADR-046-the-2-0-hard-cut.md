---
id: ADR-046
tags: [process, docs]
domain: doc-standard
status: accepted
related: [ADR-045, ADR-023]
---

# ADR-046 — The 2.0 hard cut: `2.0.0` is v2-only

- **Status:** accepted (2026-09-24)
- **Deciders:** Maintainer
- **Context driver:** EPIC-017 D7 was ruled twice in three days. The first ruling (2026-09-21) chose
  dual-layout support — v1 and v2 both readable through the whole `2.x` line, v1 support dropped only
  at `3.0.0`. A `/task-decomposer --epic EPIC-017` pass on 2026-09-23, reviewed by Codex across three
  adversarial rounds, found that ruling directly contradicts EPIC-017's own Closed-when 2 (`TODO.md`
  deleted, zero executable readers) — dual support keeps v1 readers alive for an entire major, so the
  epic could never close by its own criterion. The owner superseded the first ruling the same day.

## Context

`docs/work/<status>/TASK-NNN-slug.md` (ADR-045) replaces the single `TODO.md` + sprint-Plan-copy
layout. Seven skills read or write that queue: `prime`, `triage`, `task-decomposer`,
`lean-doc-generator`, `orchestrator`, `handoff`, `flow` (`TASK-369`). Two shapes were on the table for
how those skills behave against an installed repo mid-migration:

- **Dual-layout through `2.x`** (the 2026-09-21 ruling) — every queue skill reads/writes both `TODO.md`
  and `docs/work/`, v1 support removed only at `3.0.0`. Cost: two read paths live in every skill for a
  whole major version, and EPIC-017 Closed-when 2 (`TODO.md` deleted, no executable reads it) can never
  be satisfied while `2.x` ships, because satisfying it would break every `2.x` consumer still on v1.
- **Hard cut at `2.0.0`** — a `2.x` queue skill detects a v1 or mixed tree, names it, and refuses to
  perform its queue operation; `/lean-doc-generator migrate` is the one `2.x` path that accepts a v1 or
  mixed tree and converts it. No dual-read code ever ships.

The blast radius is exactly the 7 skills above (`TASK-369`) plus the migrate procedure itself
(`TASK-370`) — no other component reads the queue.

## Decision

**`2.0.0` is v2-only. It is a hard cut, not a graceful migration window.** MAJOR, because the break is
real and a consumer must be told by the version number rather than discover it via a broken install
(SemVer's own contract for a breaking change). A `2.x` queue skill that finds a v1 (`TODO.md` present,
no `docs/work/`) or mixed (both present) tree **refuses by name** — it reports which layout it found
and performs none of its queue operation — and **points to `/lean-doc-generator migrate`**, the only
`2.x` path that accepts a v1 or mixed tree. `/prime` is the one exception to "refuse": it is read-only
and must never abort by its own standing rule, so on v1/mixed it reports a `Layout:` health row naming
the layout and skips the task count, but keeps priming.

**Upgrade sequence:** install `2.x` → restart the session (a live session keeps whatever plugin copy it
started with, ADR-044's freshness concern) → run `/lean-doc-generator migrate` → resume normal queue
use. Neither direction may corrupt anything — an installed `1.x` writer running against an
already-migrated `2.x` tree must work harmlessly or refuse cleanly, never corrupt (`TASK-372`,
EPIC-017 Closed-when 9).

This supersedes the 2026-09-21 ruling recorded against EPIC-017 D7 (dual-layout support through `2.x`,
removed at `3.0.0`), which is not separately filed as its own ADR — it was reversed two days later,
before this record was written, on the same review pass that produced this decision.

## Consequences

**Positive:** every `2.x` queue skill carries exactly one read path (`docs/work/`) — no dual-layout
branch to maintain, test, or explain for the length of a major version. EPIC-017 Closed-when 2 becomes
satisfiable: once a consumer runs `migrate`, `TODO.md` has zero executable readers left in `2.x`.
Detection is existence-only (`TODO.md` present? `docs/work/` present?) — never a content read — so the
same three-line rule is cheap to inline verbatim in all 7 skills (ADR-006: inlined procedure counts
against the line cap; each skill stays self-contained, no shared reference tree across skills).
Verified: `evals/run-layout-fixtures.ts` classifies four retained fixture trees (`v1` · `v2` · `mixed` ·
`none`) correctly, proves the rule is existence-only (a v1 fixture with a real 0-byte `TODO.md` still
classifies `v1`; a `v2` fixture with an empty `docs/work/` still classifies `v2`), and checks all 7
`SKILL.md` files for the rule's anchor phrase plus a literal pointer to `/lean-doc-generator migrate`.

**Negative (trade-offs accepted):** **no grace period.** A consumer who upgrades to `2.x` without
running `migrate` first gets every queue skill refusing to work the moment it detects `TODO.md` still
present — there is no version where "mostly still v1, some skills upgraded" is a supported state. This
is a deliberate reversal of the softer 2026-09-21 posture, accepted because the alternative (dual
support) makes the epic's own exit criterion unreachable. The cost lands once, at upgrade time, and is
mitigated by `migrate` being idempotent and re-runnable as an update sync (existing behaviour, unchanged
by this ADR) rather than a one-shot destructive operation.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Dual-layout support through `2.x`, drop v1 at `3.0.0` (the superseded 2026-09-21 ruling) | Keeps two read paths live in every queue skill for a whole major, and directly contradicts EPIC-017 Closed-when 2 (`TODO.md` deleted, zero readers) — the epic could never close while `2.x` was still shipping (Codex review round 1, 2026-09-23) |
| Silent auto-migration on first `2.x` invocation (no `migrate` step, no refusal) | Removes the human checkpoint a structural rewrite of the task store needs (HITL + surgical is `migrate`'s existing contract, ADR-045's D6 transition discipline) — a queue skill is the wrong place to trigger a one-way tree rewrite as a side effect |
| Refuse v1 silently (no named-layout message) | Fails L-002 / the standing rule that a blocking condition is surfaced, never silently swallowed — a consumer needs to know *why* the skill did nothing and *what* to run next |
