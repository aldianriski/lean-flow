# ADR-003 — Rich, one-file-per-ADR in docs/adr/ + a DECISIONS index

- **Status:** accepted (2026-06-09)
- **Deciders:** Maintainer
- **Context driver:** match how the maintainer actually writes ADRs (detailed, with measured evidence)

## Context

The first ADR format (adapted from mattpocock) was minimal — "a single paragraph is a valid ADR".
But the maintainer's real ADRs (e.g. the umkmindo Prisma→Drizzle decision) are rich: status,
deciders, context *with a measured blast radius*, decision, consequences, alternatives. Three
representations had drifted apart — DOCS_Guide §4 (minimal), `DECISIONS.md.template` (minimal log),
and a maintainer-added rich `ADR.md.template` (per-file). They couldn't all be canonical. A single
`DECISIONS.md` log of rich ADRs also balloons fast (dev-flow itself evolved single-log → per-file).

## Decision

**Rich format is canonical, one file per ADR at `docs/adr/ADR-NNN-<slug>.md` (append-only);
`DECISIONS.md` is a thin index.** Required sections: Status · Deciders · Context (with measured blast
radius where scope drives the call) · Decision · Consequences (≥1 Negative) · Alternatives. The
"offer sparingly" gate is kept — ADRs stay **rare but thorough**.

## Consequences

**Positive:** ADRs match how decisions are actually reasoned (evidence-backed); per-file scales; the
index stays scannable; `≥1 Negative` forces honest trade-off capture.
**Negative (trade-offs accepted):** heavier than a one-paragraph ADR; the index must be kept in sync
with `docs/adr/`.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Minimal single-paragraph ADRs | Doesn't match the maintainer's real, evidence-backed decisions |
| Rich but single `DECISIONS.md` log | Balloons; dev-flow already abandoned this for per-file |
| Tiered (minimal default, rich for big) | Two formats to teach; fuzzier |
