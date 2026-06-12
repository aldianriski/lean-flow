<!-- One ADR per file · append-only · WHY only. -->

# ADR-007 — CONTEXT.md cap raised 100 → 130 (the SSOT is a denser doc-kind)

- **Status:** accepted (2026-06-12)
- **Deciders:** Maintainer
- **Context driver:** standard credibility — `.claude/CONTEXT.md` (the single source of truth) sat at
  151 lines against its own 100-line cap (TD-005); a standard whose anchor doc violates it rots into a
  suggestion. Same shape as ADR-006 (a cap miscalibrated for a special doc-kind).

## Context

The 100-line cap was calibrated for a generic AI-context file. `CONTEXT.md` is the **SSOT** — it carries
ten sections (loop · roster · gates · modes · tiers · sprint model · doc standard · orientation ·
governance · task-shape) that the whole skill set reads directly. A dedup diet first removed every block
that merely duplicated prose living in `CLAUDE.md` / `README.md` (the loop diagram, the curated-not-copied
rationale, built-in-command detail, graphify orientation) — replaced with pointers, **no information
lost** — taking the file 151 → 127. The residue is irreducibly dense and unique. Measured blast radius:
1 doc over cap, 1 open TD row; relocating further would fragment the source-of-truth (skills read it
directly, not via references).

## Decision

**Diet first (dedup), then raise the cap to 130.** The amended rule: `CONTEXT.md` ≤ 130 lines of dense
SSOT content; duplication of `CLAUDE.md` / `README.md` prose is removed in favour of pointers. Recorded
in `DOCS_Guide §2`. Chosen because it resolves TD-005 while keeping the SSOT whole and the standard
honest — a precise cap for the doc's real scope, not a generic one it was always going to break.

## Consequences

**Positive:** the standard is credible again (the SSOT no longer violates it); the dedup removed real
duplication, so the three doc copies (CONTEXT / CLAUDE / README) stop drifting; TD-005 closes.
**Negative (accepted):** a higher cap invites slow re-bloat — additions must prefer pointers over
inlining, and "dense SSOT content" must not become an excuse; the 130 number is a judgment, not a law.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Hard diet to ≤100 | Would compress unique SSOT content past the dedup point — hurts the orientation value the file exists to provide |
| Leave 100, accept the violation (status quo TD-005) | The anchor doc breaking its own standard is the fastest way to make the standard optional |
| Relocate sections to a reference tree | Fragments the single-source-of-truth; skills read `CONTEXT.md` directly, so pointers-out add indirection without saving the reader |
