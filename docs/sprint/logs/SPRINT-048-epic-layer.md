---
sprint: 048
slug: epic-layer
owner: Maintainer
last_updated: 2026-08-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-048 — Execution Log

> Append-only companion to [`../SPRINT-048-epic-layer.md`](../SPRINT-048-epic-layer.md). Uncapped by
> design: this file grows with the work done, which is exactly why it is not inside the Plan's
> 400-line budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
>
> *First sprint born in the split format. SPRINT-047 kept its log inline by design (its D2).*

### 2026-08-09 | G2 | batch gates run; two Plan defects found before any work started
**A5 is false.** The Plan asserts "T1–T5 are mutually disjoint except T2→T1; no shared file across
tasks." Deriving the map from the Plan's own `Layers:` lines gives **four shared files and one declared
edge**: `.claude/CONTEXT.md` (T1·T2·T3) · `.claude/CLAUDE.md` (T1·T3) · `DOCS_Guide.md` (T1·T4) ·
`task-decomposer/SKILL.md` (T2·T3). Three unowned pairs — T1↔T3, T1↔T4, T2↔T3 — each of which the
pre-dispatch preflight would HALT on. **Impact:** none material, because inline execution is strictly
sequential and single-owner, so no concurrent edit is possible; the defect is that the Plan claimed a
property it does not have, and would have blocked a parallel run. Ownership resolved by ordering
rather than by splitting tasks.

**A4's confirmation method was unreachable.** A4 asks that T3's new grill rule be used for T1/T2's own
grilling, but shared-file ordering naturally places T3 third. Fixed by running **T3 first** — it has no
dependencies, and sequencing resolves its shared files at either end. T3's own grill necessarily runs
under the old rule; recorded rather than papered over.

**Owner-approved execution order:** T3 → T1 → T2 → T4 → T5 *(superseded later this entry — see below)*.

### 2026-08-09 | scope-change | PRD/epic entry point split; cap raised; T6 + T7 added
**What broke.** A1 (which skill creates an epic) could not be answered without settling a prior
inconsistency the owner spotted: **`/lean-doc-generator` would create epics while `/task-decomposer`
creates PRDs.** Investigating found the state worse than "two entry points":

- **`--prd` means two things.** `task-decomposer/SKILL.md:22` documents it as an *input* (a path to an
  existing PRD); `:70-73` has the same flag **synthesize** a PRD and write `docs/product/requirements.md`.
- **Two PRD templates exist** — `task-decomposer/references/prd-and-slices.md § PRD template` and
  `lean-doc-generator/templates/product-requirements.md.template`.
- **The latter is orphaned**: `lean-doc-generator/SKILL.md` contains zero occurrences of "PRD". The
  skill that owns doc generation does not know its own product template exists.

Adding epic creation on top would have made this a third pattern.

**Decision (owner).** `/lean-doc-generator` owns creation of **all** core docs, PRD included;
`/task-decomposer` consumes them and emits tasks. That is the single principle; the intake-vs-lifecycle
split was offered as an alternative reading and rejected.

**Cap raised to 140, repo-wide — and the duplication reclaimed too.** I argued against raising it: the
cap is repo-wide across 14 skills, ADR-006 exists precisely to answer "this SKILL.md is full" with
"move artifacts to `references/`", DOCS_Guide carries an explicit red flag against raising a cap to fit
content, and ~15 lines were recoverable here from Migrate (14) and Init (10), whose full procedures
already live in `references/migration-map.md` and `references/init.md`. **The owner's call is to do
both** — reclaim the duplication *and* lift the cap — on the grounds that the generator legitimately
does more than the other skills and the extra headroom is worth having. Recorded with the argument
attached so the reasoning is inspectable later; this amends ADR-006.

**Impact on the Plan.** Two tasks added:
- **T6** — raise the SKILL cap to 140 (ADR-006 amendment · `qa-check.sh` lint · CLAUDE.md DoD) **and**
  compress Migrate/Init to dispatch entries. Kept separate from T7 because it is a repo-wide policy
  change touching the gate, and deserves its own review.
- **T7** — move PRD creation into `/lean-doc-generator`: add the `prd` verb, wire the orphaned
  template, reduce `task-decomposer` to consumer, disambiguate `--prd`, and keep only the slicing half
  of `prd-and-slices.md`. Depends on T6 for headroom.

Splitting rather than folding into T1/T2 keeps what was signed off intact, and avoids an L-sized task.

**G2 re-confirmed** with the new overlap map. ADR-006 is now shared by T4 and T6;
`lean-doc-generator/SKILL.md` by T2, T6, T7. **Revised order: T3 → T6 → T1 → T2 → T7 → T4 → T5** —
T6 moves early so the headroom exists before T1/T2/T7 edit the generator, and T4's ADR-006 amendment
lands after T6's. Seven tasks against ~12 capacity.
