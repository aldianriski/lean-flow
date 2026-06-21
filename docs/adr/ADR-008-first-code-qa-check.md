<!-- One ADR per file · append-only (never edit a decided ADR — mark it deprecated/superseded) · WHY only. -->

# ADR-008 — Admit the first executable code: a hybrid QA check

- **Status:** accepted (2026-06-21)
- **Deciders:** Maintainer
- **Context driver:** structural drift in a 14-skill / 14-template markdown plugin was catchable only by eye

## Context

lean-flow has been a markdown-only plugin — skills + JSON manifests, zero executable code. As the
surface grew (14 skills, 14 template files, and several cross-referenced count claims spread across
CLAUDE.md / CONTEXT.md / ARCHITECTURE.md), structural drift — a breached line cap, a stale "N
templates" claim, a missing frontmatter field — became a real, recurring risk catchable today only by
manual review (cf. L-009: a structural defect that both grep and the line-caps passed). The
"extend & harden" direction calls for a repeatable guard. Putting the first executable code into a
library whose whole identity is "prose, not software" is a notable departure, so it is recorded here.

## Decision

Adopt a **hybrid** QA check. A small, dependency-free POSIX-sh script (`scripts/qa-check.sh`) enforces
the **mechanical** rules — line caps, claims-vs-disk counts, frontmatter presence. A checklist in
`docs/QA.md` carries the **judgment** rules — no-HOW, cross-ref sanity, description-trigger quality —
that a script cannot decide without false confidence. The script is deterministic and CI-able but is
run manually at sprint-close / release; wiring it into CI stays out of scope (ARCHITECTURE boundary:
lean-flow does not own CI/CD).

## Consequences

**Positive:** drift is caught deterministically rather than by eye; the count check compares claims to
disk, so it survives future skill/template additions; one command yields a release-time green light.
**Negative (trade-offs accepted):** the plugin is no longer pure-markdown — contributors now need a
POSIX sh (Git Bash on Windows); the script is a new artifact to maintain; and its single non-core
template special-case (DESIGN) must be updated if the template taxonomy changes.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Agent-run checklist only (no code) | leanest, but non-deterministic and easy to skip; caps + counts are exactly what a script does reliably |
| Full script (everything automated) | the judgment rules (no-HOW, trigger quality) can't be mechanized without false confidence — over-reach |
| Wire into CI | lean-flow explicitly does not own CI/CD (ARCHITECTURE boundary); a release-time manual run fits the plugin's scope |
