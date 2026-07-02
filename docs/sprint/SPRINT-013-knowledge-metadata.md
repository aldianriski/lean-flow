---
sprint: 013
slug: knowledge-metadata
owner: Maintainer
last_updated: 2026-07-02
status: active
plan_commit: fb73a65
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-013 — Knowledge Metadata

> **Theme:** Realize ADR-009 — make the knowledge corpus fresh, precise, and cheap to load. Write-time
> frontmatter metadata becomes the single source of truth, a categorized index is generated from it,
> and a one-line retrieval-miss signal is added so the deferred graph view (TASK-040) is triggered by
> real evidence, not a guess.

## Scope

**In:** T1 metadata SSOT + generated index + dangling-reference lint (TASK-036) · T2 retrieval-miss
signal in the Sprint-Close Retro + /insights (TASK-041).
**Out (deferred):** TASK-040 (derived graph view — stays blocked behind the T2 signal firing ≥2×) ·
TASK-006 (gate-guard hook — blocked) · the CHANGELOG §11 rotation (proposed separately, not this sprint).

## Plan

### T1 — Structured write-time metadata (SSOT) + generated index `[size: M · risk: low]`
Layers: `docs/LEARNINGS.md` · `skills/lean-doc-generator/templates/LEARNINGS.md.template` · `skills/lean-doc-generator/SKILL.md` (write-step field requirement + index generation) · `.claude/CONTEXT.md` (§ continuous-learning) · possibly `scripts/qa-check.sh` (dangling-ref lint)
Realizes ADR-009. Frontmatter (`id · tags · domain · status · supersedes/superseded-by · related`) is
the SSOT; the index is *generated* from it, never hand-kept. **Reconcile with the existing L-NNN fields
(`seen/count/promoted/related`) — extend, don't duplicate.** Has a real code component (index generation
+ lint) → its Review exercises the generator/lint on the real 13 entries, not docs-only.

**Acceptance:** the 13 LEARNINGS entries carry the schema; the index regenerates from frontmatter; the dangling-reference lint passes; caps hold.

**DoD:**
- [x] Schema defined + reconciled — heading `[tags][status]` extends the existing `seen/count/promoted/related` (no duplication); vocab: process·docs·tooling·edit-safety·sprint-model
- [x] Applied to all 13 LEARNINGS entries; `LEARNINGS.md.template` updated (schema + markers + examples)
- [x] Fields required at creation — `/insights` step 4/5 + the template; **enforced** by qa-check's metadata-completeness lint (not just convention)
- [x] Index **generated** from the headings — `scripts/gen-learnings-index.sh` (in-file, between markers; idempotent + `--check`)
- [x] Dangling-reference lint — **home: `qa-check.sh`** (decided G2); + metadata-completeness (tags/status present, known vocab). Both negative-tested (caught L-999 ref + bogus tag)
- [x] `CONTEXT.md` § continuous-learning notes the metadata/index (124/130)
- [x] Exercised on real input — generator + all 3 lints ran over the real 13 (positive) + negative tests; qa-check 45/0
<!-- QA: has code (generation + lint) → run it + qa-check.sh at Review; not docs-only. -->

### T2 — Retrieval-miss signal in the Sprint-Close Retro + /insights `[size: S · risk: low]`
Layers: `skills/lean-doc-generator/references/DOCS_Guide.md` (§10 Retro) · `skills/insights/SKILL.md` · `skills/lean-doc-generator/templates/SPRINT.md.template` (§10, if the checklist is inlined)
One line so the trigger for building TASK-040's derived graph view is *observed*, not guessed on corpus size.

**Acceptance:** the Sprint-Close Retro + /insights carry the retrieval-miss question; SPRINT template §10 reflects it.

**DoD:**
- [x] DOCS_Guide §10 Retro gains: "did we fail to find, or contradict, a prior L-NNN / ADR this sprint?"
- [x] /insights notes the same signal (a retrieval miss is a fileable friction)
- [x] SPRINT.md.template §10 reflects it (Retro "Retrieval check" line)

## Owner-action checklist
<!-- None — all dev/doc edits. -->

## Decisions (pre-locked)
- **D1 — No shared-file lock.** T1 and T2 touch disjoint files (T1: LEARNINGS + LEARNINGS template + lean-doc SKILL + CONTEXT [+ qa-check.sh]; T2: DOCS_Guide + insights + SPRINT template). Run in any order; no per-hunk staging needed.

## Assumptions
- **A1** — the new schema **extends** the existing L-NNN fields (`seen/count/promoted/related`), it doesn't replace or duplicate them. *Confirm: at G2, inspecting `docs/LEARNINGS.md`.*
- **A2** — index-generation mechanism is open: a small deterministic **script** (like `qa-check.sh`) vs a **skill-procedure** in lean-doc-generator. Same question for the dangling-ref lint (extend `qa-check.sh` vs new). *Confirm: G2 design decision — this is the main T1 fork.*
- **A3** — TASK-040 (derived graph view) stays **blocked**, out of scope; this sprint only builds the SSOT + index + the signal that will later trigger it.

## Execution Log
<!-- Append-only, dated. Scope change → a `scope-change` entry before editing § Plan (T4/SPRINT-012 convention). -->

### 2026-07-02 | promote | Sprint planned + locked
Formed from Backlog ready tasks TASK-036 + TASK-041 (ADR-009 realization). Governance clean (no L-promotions; TD-007 new, not aging; TODO 107/150). CHANGELOG §11 rotation proposed separately.

### 2026-07-02 | design (provisional) | A2 index-generation mechanism
Recommended default while owner AFK: a **deterministic script** regenerates the index from frontmatter (alongside `scripts/qa-check.sh`), and the dangling-reference lint **extends `qa-check.sh`** — deterministic + testable, faithful to ADR-009 ("derived, regenerated, not hand-kept") and the ADR-008 code precedent. **Confirm at execution G2** before building (this is the T1 fork). Not locked; recorded here so it isn't parked.

### 2026-07-02 | T2 done | Retrieval-miss signal
Landed at 3 homes: DOCS_Guide §10 (close-time retrieval-miss check → Learnings bucket + TASK-040 signal), /insights when-to-invoke (a miss is fileable), SPRINT.md.template Retro ("Retrieval check" line). Doc-only. T1 (036) remains — presenting its G2 design fork next.

### 2026-07-02 | G2 | T1 forks approved
Owner approved (a) index-gen = deterministic script, (b) schema = lean subset (tags+status, extend existing fields), (c) index = in-file regenerated section. Built on those.

### 2026-07-02 | T1 done | Metadata SSOT + generated index + lints
Migrated 13 LEARNINGS headings to `[tags][status]` (bodies untouched); new `scripts/gen-learnings-index.sh` generates the by-tag index in-file (idempotent, `--check`); `qa-check.sh` gained 3 checks (index freshness · dangling refs · metadata completeness). Self-review (assume-guilty) caught that the schema was only convention-enforced → added the completeness lint so a missing/typo'd tag FAILs rather than silently dropping from the index; negative-tested both lints (L-999 ref, bogus tag). qa-check 45/0; caps held (CONTEXT 124/130); UTF-8 integrity verified after a sed round-trip. **Known limitation (follow-up candidate):** ADRs/research don't yet carry the frontmatter (ADR-009 "over time") — this sprint scoped to LEARNINGS.

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/LEARNINGS.md` | T1 | migrate 13 headings → `[tags][status]` + generated index block | Med | qa-check 45/0; UTF-8 integrity verified |
| `scripts/gen-learnings-index.sh` | T1 | NEW — regenerate the by-tag index (idempotent · `--check`) | Med | ran + `--check` PASS |
| `scripts/qa-check.sh` | T1 | +index-freshness, +dangling-ref, +metadata-completeness lints | Med | positive + negative tested |
| `skills/lean-doc-generator/templates/LEARNINGS.md.template` | T1 | schema + INDEX markers + examples | Low | self-review |
| `skills/insights/SKILL.md` | T1 | require `[tags][status]` on new entries + regenerate index | Low | self-review; 57/110 |
| `.claude/CONTEXT.md` | T1 | §continuous-learning: metadata/index note | Low | 124/130 |
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T2 | §10: retrieval-miss check at close (feeds TASK-040 signal) | Low | self-review |
| `skills/insights/SKILL.md` | T2 | when-to-invoke: a retrieval miss is fileable | Low | self-review |
| `skills/lean-doc-generator/templates/SPRINT.md.template` | T2 | Retro "Retrieval check" line | Low | self-review |

## Retro
<!-- Written at close. Route buckets to durable homes (DOCS_Guide §10). -->

**Worked**
-

**Friction**
-

**Pattern candidate** (surface → `docs/LEARNINGS.md`)
-
