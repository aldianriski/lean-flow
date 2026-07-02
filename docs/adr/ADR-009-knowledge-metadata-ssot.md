# ADR-009 — Knowledge corpus: write-time metadata SSOT + a derived, on-demand graph view

- **Status:** accepted (2026-07-02)
- **Deciders:** Maintainer
- **Context driver:** AI-comprehension **quality** as the knowledge corpus scales — ranked freshness/trust > retrieval precision > context-load performance > relational comprehension; implementation leanness explicitly secondary.

## Context

The accumulated-knowledge corpus (LEARNINGS + ADRs + `docs/research` + sprint history) grows every
sprint, and an AI reads it to work in the repo. The maintainer prioritizes how well/fast the AI
understands and retrieves the right knowledge — and never being misled by a superseded fact — over
minimal implementation effort.

**Blast radius:** small today (13 LEARNINGS entries, 9 ADRs, a handful of research docs) but growing
monotonically; today every `/prime` and several skills re-read a flat `LEARNINGS.md` in full — a
context-load cost that compounds every session as the corpus grows. **Chief quality risk:** a stale or
superseded fact surfaced as current, fed back into `/council`/`/orchestrator`, is *worse than no
memory*. Pressure-tested via a quality-first `/council` run (verdict recommendation folded in here).

## Decision

Capture knowledge relationships as **write-time frontmatter metadata** — `id · tags · domain · status ·
supersedes/superseded-by · related` — as the **single source of truth**, at the moment (and place) the
fact changes; **generate** the index and any graph *from* it. Any graph is a **derived, on-demand view**
over that metadata — regenerated from the SSOT, never separately hand-maintained — and built only with
(i) regeneration wired to the doc write step, (ii) a read-time staleness check that fails loud, and
(iii) a dangling-reference integrity lint. Chosen because freshness and relational structure are then
the *same* artifact (the `supersedes` field **is** the edge), so they cannot drift apart.

Realized as **TASK-036** (metadata SSOT + generated index, near-term) and **TASK-040** (the derived
view, deferred behind the **TASK-041** retrieval-miss signal).

## Consequences

**Positive:** freshness is structural — `status`/`supersedes` answer "is this current?" at read time;
selective loading cuts the per-session context tax instead of re-reading a growing file; relational
comprehension is available on demand without a maintained artifact; a stale derived view is a
*detectable, rebuildable cache miss*, not a silent lie.
**Negative (trade-offs accepted):** write-time discipline cost — every doc must carry and maintain
frontmatter, and `lean-doc-generator` must enforce it at creation; more moving parts than flat grep;
a dangling-reference lint is now *required*, because the SSOT metadata itself can rot (a `supersedes`
pointing at a renamed/deleted doc).

## Alternatives considered

| Option | Why rejected |
|---|---|
| Flat markdown + grep | Can't express "superseded" — retrieves the dead note with equal confidence (fails the #1 freshness priority); whole-file context tax grows every session. |
| Separately-maintained knowledge graph (graphify / Understand-Anything kept in sync) | A second source of truth that drifts *silently* — manufactures the chief risk; unbuildable in an agent-free repo (no daemon); the banned hand-maintained-codemap pattern (LAW 3) in a graph costume. |
| Understand-Anything / Tree-sitter+AST | Code-comprehension tooling; a markdown corpus has no AST to parse — a category error. |
