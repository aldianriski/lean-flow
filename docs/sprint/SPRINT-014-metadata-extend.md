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

# SPRINT-014 — Knowledge Corpus + Council Hardening

> **Theme:** Two maintenance streams batched into one sprint. (1) SPRINT-013 shipped write-time
> metadata + a generated index for LEARNINGS; the same freshness/relational discipline (ADR-009) must
> cover the rest of the knowledge corpus — ADRs and research docs — before the derived graph view
> (TASK-040) sits on top of it. (2) Harden `/council` per `docs/research/council-improvements.md` — the
> near-free reliability bundle + the two gated passes. Off-theme to (1) but batched by owner request.

## Scope

**In:** (T1) per-file ADR-009 frontmatter on all `docs/adr/*.md` + `docs/research/*.md`, a generated
index covering them, qa-check lints extended to the new corpus; (T2) council adopt-now hardening bundle
(pre-mortem · dialectical Contrarian · calibrated verdict · perspective-guided questions · named ceiling
· judge-bias hardening); (T3) council gated passes (adversarial fact-verify + unknown-unknowns moderator).
**Out (deferred):** the derived graph VIEW over the metadata (TASK-040 — blocked on the TASK-041 signal +
its 3 guardrails); sprint-history metadata; any change to the LEARNINGS schema itself (shipped in 013);
council multi-model diversity backend (TASK-047 — blocked, needs a provider-dependency call).

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

### T2 — Council adopt-now hardening bundle `[size: M · risk: low]`
Layers: `skills/council/SKILL.md` · `skills/council/references/{advisors,prompts}.md`
Council peer-reviews *reasoning* but never fact-checks, and 5 personas on one model share its blind
spots — so unanimity is weaker evidence than it looks. The near-free bundle closes the cheap gaps
(WHY → `docs/research/council-improvements.md` Option A). Reworded existing-step lines; bulk → `references/` (L-012).

**Acceptance:** a real council run yields a verdict carrying calibrated confidence + dissent + named single-model ceiling, with the pre-mortem and dialectical Contrarian reflected. `SKILL.md` ≤110.

**DoD:**
- [ ] Chairman synthesis adds a pre-mortem ("assume this failed in 6 months — what killed it?")
- [ ] Contrarian reframed to attack the *emerging consensus* (dialectical), not just an opposite position
- [ ] Verdict carries calibrated confidence (recommendation *before* the score) + a dissent/divergence summary
- [ ] Each lens emits its top 1–2 decision-critical *questions* before its verdict
- [ ] Verdict names the single-model ceiling (reduces *framing*, not *knowledge*, blind spots)
- [ ] Judge-bias hardening: reviewer-order rotation · rubric-scored review · persona length cap
- [ ] Exercised once on a real decision (L-007); `SKILL.md` ≤110

### T3 — Council gated passes: adversarial fact-verify + unknown-unknowns moderator `[size: M · risk: med]`
Layers: `skills/council/SKILL.md` (2 conditional steps) · `skills/council/references/prompts.md` — **depends-on T2** (shared file, serialize — see D3)
Reasoning peer-review does not catch hallucinated facts; an independent refuter that checks cited
sources does. Both passes are *conditional* to stay token-disciplined (WHY → research doc Option B).

**Acceptance:** on a fact-dependent decision the verify pass flags/corrects an unsupported claim; on a pure-judgment decision both passes correctly skip.

**DoD:**
- [ ] Adversarial fact-verify pass: extracts load-bearing factual claims + verifies cited URLs/sources; fires only when the verdict rests on external facts
- [ ] Unknown-unknowns moderator: one cheap pass surfaces a consideration no lens raised
- [ ] Both passes gated (skip on pure-judgment forks); prompt templates in `references/prompts.md`
- [ ] Exercised once each way — fact-dependent (fires) and pure-judgment (skips) — (L-007); `SKILL.md` ≤110

## Owner-action checklist
<!-- none -->

## Decisions (pre-locked)
- **D1** — Follow ADR-009's existing schema verbatim (`id · tags · domain · status · supersedes/superseded-by · related`); no new fields. This is a rollout of an accepted ADR, not a new decision — no ADR needed.
- **D2** — Prefer generalizing the existing `gen-learnings-index.sh` into a shared `gen-index` over a second script (avoid a duplicate generator / second SSOT). Confirm the shared-vs-sibling call at G2 by reading the current script's coupling to LEARNINGS.
- **D3** *(overlap map)* — **T2 and T3 both edit `skills/council/SKILL.md` + `skills/council/references/prompts.md`.** Single owner, serialized: **T2 commits first, then T3** (T3 depends-on T2). At the T3 commit, stage the shared files per-hunk (`git add -p` + verify `git diff --cached`) — never a plain `git add` over T2's lines (L-042). T1 touches a disjoint fileset (docs/ + scripts/) — no overlap with T2/T3.

## Assumptions
- **A1** — ADR-009's tag vocabulary (`process · docs · tooling · edit-safety · sprint-model`, sourced in the gen script) is reusable for ADRs/research, possibly with a domain axis. *Confirm: at G2, decide whether ADR/research need their own tag/domain vocab or share the LEARNINGS set.*
- **A2** — The per-entry LEARNINGS half shipped in SPRINT-013; this extends the same pattern with no schema change. *Confirm: SPRINT-013 archive + ADR-009.*

## Execution Log

### 2026-07-02 | promote | SPRINT-014 planned from TASK-044
Single `ready` Backlog task (TASK-044) promoted. Governance review clean (no `count ≥ 2` learnings to promote; TD-007 <3 sprints; no doc-aging trigger). Plan frozen.

### 2026-07-02 | scope-change | +T2 +T3 (council hardening) added by owner request
**What broke:** the frozen single-task plan — TASK-045/046 (`docs/research/council-improvements.md`) added as T2/T3.
**Impact:** theme broadened from "Metadata SSOT" to "Knowledge Corpus + Council Hardening" (off-theme to T1, batched by owner choice over a separate SPRINT-015); Scope In/Out updated; overlap map D3 added (T2/T3 share `council/SKILL.md` + `references/prompts.md` → serialize, T2 before T3). TASK-047 (multi-model) stays deferred in Backlog.
**G2 re-confirm:** approach + WHY per the research doc; T2/T3 DoD are verifiable micro-tasks; no ADR (refines an existing skill, not a reversible decision); overlap owned via D3; no open blocking assumptions. Re-confirmed.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. -->
