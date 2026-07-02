---
sprint: 014
slug: metadata-extend
owner: Maintainer
last_updated: 2026-07-02
status: active
plan_commit: cfc84a2
close_commit: TBD
update_trigger: sprint execute/close events
---

# SPRINT-014 — Metadata SSOT extends to ADRs & Research

> **Theme:** SPRINT-013 shipped write-time metadata + a generated index for LEARNINGS. The same
> freshness/relational discipline (ADR-009) must cover the rest of the knowledge corpus — ADRs and
> research docs — or half the corpus stays flat and un-checkable. Finish the ADR-009 rollout before
> the derived graph view (TASK-040) is built on top of it.

## Scope

**In:** per-file ADR-009 frontmatter on all `docs/adr/*.md` + `docs/research/*.md`; a generated index
covering them (extend the existing generator or a sibling); qa-check's dangling-ref + metadata-completeness
lints extended to the new corpus.
**Out (deferred):** the derived graph VIEW over the metadata (TASK-040 — blocked on the TASK-041 signal +
its 3 guardrails); sprint-history metadata; any change to the LEARNINGS schema itself (shipped in 013).

## Plan

### T1 — Extend the metadata SSOT + generated index + lints to ADRs & research `[size: M · risk: low]`
Layers: `docs/adr/*.md` (9) · `docs/research/*.md` (5) · `scripts/gen-learnings-index.sh` (generalize or add a sibling) · `scripts/qa-check.sh`
ADR-009 made write-time frontmatter the SSOT and the index/lints derived from it, but only wired
LEARNINGS. Extend the same three mechanisms to the ADR + research corpus so freshness (`status`/
`supersedes`) and relations (`related`) are structural and lint-checked there too — closing the
"half the corpus is flat" gap before TASK-040 depends on it.

**Acceptance:** `sh scripts/qa-check.sh` passes with the new corpus carrying ADR-009 frontmatter, a
generated index covering ADRs + research, and dangling-ref + completeness lints green over them.

**DoD:**
- [ ] All 9 `docs/adr/*.md` carry per-file frontmatter (`id · tags · domain · status · supersedes/superseded-by · related`) per ADR-009
- [ ] All 5 `docs/research/*.md` carry the same frontmatter
- [ ] A generated index (extend `gen-learnings-index.sh` or a sibling `gen-index`) covers ADRs + research, regenerated from the SSOT (INDEX markers, idempotent, `--check`)
- [ ] `qa-check.sh` dangling-ref lint extends to ADR/research `related`/`supersedes` refs
- [ ] `qa-check.sh` metadata-completeness lint (tags+status, known vocab) extends to ADRs + research
- [ ] `lean-doc-generator` write step regenerates the extended index (wiring parity with LEARNINGS)
<!-- QA: run `sh scripts/qa-check.sh` green as the exercised-on-real-input check (L-007). -->

## Owner-action checklist
<!-- none -->

## Decisions (pre-locked)
- **D1** — Follow ADR-009's existing schema verbatim (`id · tags · domain · status · supersedes/superseded-by · related`); no new fields. This is a rollout of an accepted ADR, not a new decision — no ADR needed.
- **D2** — Prefer generalizing the existing `gen-learnings-index.sh` into a shared `gen-index` over a second script (avoid a duplicate generator / second SSOT). Confirm the shared-vs-sibling call at G2 by reading the current script's coupling to LEARNINGS.

## Assumptions
- **A1** — ADR-009's tag vocabulary (`process · docs · tooling · edit-safety · sprint-model`, sourced in the gen script) is reusable for ADRs/research, possibly with a domain axis. *Confirm: at G2, decide whether ADR/research need their own tag/domain vocab or share the LEARNINGS set.*
- **A2** — The per-entry LEARNINGS half shipped in SPRINT-013; this extends the same pattern with no schema change. *Confirm: SPRINT-013 archive + ADR-009.*

## Execution Log

### 2026-07-02 | promote | SPRINT-014 planned from TASK-044
Single `ready` Backlog task (TASK-044) promoted. Governance review clean (no `count ≥ 2` learnings to promote; TD-007 <3 sprints; no doc-aging trigger). Plan frozen.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. -->
