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
- [x] All 9 `docs/adr/*.md` carry per-file frontmatter (`id · tags · domain · status · supersedes/superseded-by · related`) per ADR-009
- [x] All `docs/research/*.md` carry the same frontmatter (6 — council-improvements.md added this sprint)
- [x] A generated index (`gen-index.sh` → `docs/knowledge-index.md`) covers ADRs + research, regenerated from the SSOT (INDEX markers, idempotent, `--check`)
- [x] `qa-check.sh` dangling-ref lint extends to ADR/research `related`/`supersedes` refs
- [x] `qa-check.sh` metadata-completeness lint (id+tags+domain+status, known vocab) extends to ADRs + research
- [x] `lean-doc-generator` write step regenerates the extended index (Step 7 wiring; parity with LEARNINGS via /insights)
<!-- QA: run `sh scripts/qa-check.sh` green as the exercised-on-real-input check (L-007). -->

### T2 — Council adopt-now hardening bundle `[size: M · risk: low]`
Layers: `skills/council/SKILL.md` · `skills/council/references/{advisors,prompts}.md`
Council peer-reviews *reasoning* but never fact-checks, and 5 personas on one model share its blind
spots — so unanimity is weaker evidence than it looks. The near-free bundle closes the cheap gaps
(WHY → `docs/research/council-improvements.md` Option A). Reworded existing-step lines; bulk → `references/` (L-012).

**Acceptance:** a real council run yields a verdict carrying calibrated confidence + dissent + named single-model ceiling, with the pre-mortem and dialectical Contrarian reflected. `SKILL.md` ≤110.

**DoD:**
- [x] Chairman synthesis adds a pre-mortem ("assume this failed in 6 months — what killed it?")
- [x] Contrarian reframed to attack the *emerging consensus* (dialectical), not just an opposite position
- [x] Verdict carries calibrated confidence (recommendation *before* the score) + a dissent/divergence summary
- [x] Each lens emits its top 1–2 decision-critical *questions* before its verdict
- [x] Verdict names the single-model ceiling (reduces *framing*, not *knowledge*, blind spots)
- [x] Judge-bias hardening: reviewer-order rotation · rubric-scored review · persona length cap
- [x] Exercised once on a real decision (L-007); `SKILL.md` ≤110 (62 lines)

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
- **D2** *(resolved at G2, 2026-07-02)* — **One shared generator.** `gen-learnings-index.sh` → `gen-index.sh` that indexes the whole corpus (LEARNINGS `## L-NNN` headings + ADR/research frontmatter) into a single generated **`docs/knowledge-index.md`**; the in-`LEARNINGS.md` index block becomes a pointer to it. No second generator / second SSOT.
- **D3** *(overlap map)* — **T2 and T3 both edit `skills/council/SKILL.md` + `skills/council/references/prompts.md`.** Single owner, serialized: **T2 commits first, then T3** (T3 depends-on T2). At the T3 commit, stage the shared files per-hunk (`git add -p` + verify `git diff --cached`) — never a plain `git add` over T2's lines (L-042). T1 touches a disjoint fileset (docs/ + scripts/) — no overlap with T2/T3.

## Assumptions
- **A1** *(confirmed at G2, 2026-07-02)* — **Reuse** the 5 LEARNINGS tags (`process · docs · tooling · edit-safety · sprint-model`) for `tags`; **add a lean `domain` axis** (`skills · doc-standard · governance · knowledge · sprint-model`). Both vocabularies sourced in `gen-index.sh` (single origin) and enforced by the qa-check completeness lint.
- **A2** — The per-entry LEARNINGS half shipped in SPRINT-013; this extends the same pattern with no schema change. *Confirm: SPRINT-013 archive + ADR-009.*

## Execution Log

### 2026-07-02 | promote | SPRINT-014 planned from TASK-044
Single `ready` Backlog task (TASK-044) promoted. Governance review clean (no `count ≥ 2` learnings to promote; TD-007 <3 sprints; no doc-aging trigger). Plan frozen.

### 2026-07-02 | scope-change | +T2 +T3 (council hardening) added by owner request
**What broke:** the frozen single-task plan — TASK-045/046 (`docs/research/council-improvements.md`) added as T2/T3.
**Impact:** theme broadened from "Metadata SSOT" to "Knowledge Corpus + Council Hardening" (off-theme to T1, batched by owner choice over a separate SPRINT-015); Scope In/Out updated; overlap map D3 added (T2/T3 share `council/SKILL.md` + `references/prompts.md` → serialize, T2 before T3). TASK-047 (multi-model) stays deferred in Backlog.
**G2 re-confirm:** approach + WHY per the research doc; T2/T3 DoD are verifiable micro-tasks; no ADR (refines an existing skill, not a reversible decision); overlap owned via D3; no open blocking assumptions. Re-confirmed.

### 2026-07-02 | G2 | batch design signed off; T1 forks resolved
D2 → one shared `gen-index.sh` + generated `docs/knowledge-index.md` (LEARNINGS block → pointer). A1 → reuse 5 tags + add `domain` axis (skills·doc-standard·governance·knowledge·sprint-model). T2/T3 landing-spot per L-012 (prompts → references). Sequence: T1 (disjoint) → T2 → T3.

### 2026-07-02 | T1 done | metadata SSOT + shared generator + corpus lints
9 ADRs + 6 research docs carry ADR-009 frontmatter (reused 5 tags + new `domain` axis). `gen-learnings-index.sh` generalized → `gen-index.sh` producing `docs/knowledge-index.md` (by-tag across LEARNINGS+ADR+research; by-domain for ADR+research); LEARNINGS in-file index → pointer. `qa-check.sh` gained corpus dangling-ref + completeness lints (48 pass, 0 fail — L-007 exercise). Live refs renamed (CONTEXT · insights · LEARNINGS template); historical mentions (CHANGELOG · archived SPRINT-013 · L-013) left intact. lean-doc-gen Step 7 wired to regen.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/gen-index.sh` | T1 | renamed from gen-learnings-index.sh + generalized to whole corpus | Med | ran + `--check` PASS |
| `docs/knowledge-index.md` | T1 | NEW — generated by-tag/-domain corpus index | Low | regenerated, idempotent |
| `scripts/qa-check.sh` | T1 | +corpus dangling-ref + completeness lints; renamed gen call | Med | 48 pass / 0 fail |
| `docs/adr/*.md` (9) | T1 | +ADR-009 frontmatter | Low | completeness lint green |
| `docs/research/*.md` (6) | T1 | +ADR-009 frontmatter | Low | completeness lint green |
| `docs/LEARNINGS.md` | T1 | in-file index → pointer to knowledge-index | Low | index still generated |
| `.claude/CONTEXT.md` · `skills/insights/SKILL.md` · `skills/lean-doc-generator/{SKILL.md,templates/LEARNINGS.md.template}` | T1 | live gen-script refs renamed; write-step regen wired | Low | qa-check caps green |
| `skills/council/SKILL.md` | T2 | steps 2–5 + red flags: questions-first · rubric review · pre-mortem · confidence · ceiling | Low | 62/110; exercised |
| `skills/council/references/{advisors,prompts}.md` | T2 | dialectical Contrarian; advisor/reviewer/chairman/verdict templates updated | Low | real council run |
| `TODO.md` (TASK-047) | T2 | verdict fed forward — measurement-first gating | Low | n/a |

### 2026-07-02 | T2 done | council adopt-now hardening bundle + real exercise
Landed pre-mortem · dialectical Contrarian · calibrated confidence+dissent (rec before score) · questions-first advisors · single-model ceiling · judge-bias hardening (per-reviewer A–E rotation · rubric · length cap). All in `references/` per L-012; SKILL 60→62. **L-007 exercise:** ran a full real council (5 advisors + 3 rubric reviewers + chairman) on the TASK-047 multi-model question — every new mechanism fired; verdict (temp `verdict-council-multimodel.md`) fed forward into TASK-047's gating. Emergent finding: the council flagged it cannot certify its own diversity (the unmeasured-premise blind spot).

## Retro
<!-- Written at close. -->
