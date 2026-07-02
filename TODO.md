---
owner: Maintainer
last_updated: 2026-07-02
update_trigger: Sprint completed, task added, or task status changed
status: current
---

# lean-flow — Development Tracker

> **How to use this file**
> - **Session start** — `/prime`; read this before touching code.
> - **`/triage`** grooms the Backlog (re-rank, state, route rejects to `.out-of-scope/`).
> - **`/lean-doc-generator promote`** forms a sprint from `ready` Backlog tasks → `docs/sprint/`.
> - **`/orchestrator sprint-bulk`** builds it; **`/lean-doc-generator close`** runs the Retro → §10 routing.
> - Tech Debt: `TD-NNN`, never deleted; aged at promote (≥3 sprints → re-review; `high` → auto P1).

---

## Active Sprint

> **SPRINT-014 — Knowledge Corpus + Council Hardening** → docs/sprint/SPRINT-014-metadata-extend.md

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

<!-- (prior P1 batch — TASK-009 · 013 · 017 · 010 — shipped in SPRINT-008; TASK-035 shipped in SPRINT-012; see docs/CHANGELOG.md) -->

_(empty)_

### P2 — Quality / Polish

<!-- (SPRINT-008…011 batches shipped; see docs/CHANGELOG.md) -->

- [ ] **TASK-045 — Council adopt-now hardening bundle**  [size: M] [risk: low] [HITL]
      done-when: a real council run produces a verdict carrying calibrated confidence + dissent summary + named single-model ceiling, with the pre-mortem and dialectical Contrarian (attack the emerging consensus) reflected and perspective-guided questions emitted before verdicts; judge-bias hardening in place (reviewer-order rotation · rubric-scored · persona length cap). Exercised once on a real decision (L-007). SKILL.md stays ≤110.
      touches:   skills/council/SKILL.md · skills/council/references/{advisors,prompts}.md
      assumes:   near-free items are reworded existing-step lines; bulk → references/ (L-012). none blocking.
      tracker:   docs/research/council-improvements.md (Option A)
      state:     ready → promoted to SPRINT-014 (2026-07-02)
- [ ] **TASK-046 — Council gated passes: adversarial fact-verify + unknown-unknowns moderator**  [size: M] [risk: med] [HITL]
      done-when: on a fact-dependent decision, council runs a refuter that extracts load-bearing claims + verifies cited URLs and flags/corrects an unsupported one; on a pure-judgment decision both passes skip (correctly gated); the unknown-unknowns moderator surfaces one consideration no lens raised. Exercised once each way.
      touches:   skills/council/SKILL.md (2 conditional steps) · skills/council/references/prompts.md
      assumes:   the two conditional passes ship as one cohesive task; both fire only when warranted (token discipline).
      depends-on: TASK-045 (shared file — serialize per L-042)
      tracker:   docs/research/council-improvements.md (Option B)
      state:     ready → promoted to SPRINT-014 (2026-07-02)

### P3 — Long-term

- [ ] **TASK-006 — Evaluate an opt-in PreToolUse gate-guard hook** [size: M] [risk: med] [HITL]
      done-when: decision recorded (ADR/council) on whether enforced gates are worth a hook
      next: **gather data first** — research Claude Code PreToolUse hooks (can a hook block a tool call on gate state? capabilities/limits) → draft a proposed ADR → decide (it touches the agent-free-core principle, so likely /council before the ADR)
      state: blocked   (deferred — research hooks next session)
- TASK-039 — Scan bmad-method → **done** 2026-07-02: [docs/research/bmad-adaptation.md](docs/research/bmad-adaptation.md) — 5 keepers, rest rejected (agent/config machinery + duplicates of leaner lean-flow equivalents). Keepers folded into TASK-037 (risk-tier + regression gate) · TASK-042 (mid-sprint scope-change) · TASK-043 (anti-sycophancy Review) · TASK-035 (halt-contract wording).
- [ ] **TASK-040 — Derived, on-demand graph VIEW over the metadata (relational comprehension)**  [size: L] [risk: med] [HITL]
      done-when: a graph view is GENERATED from TASK-036's frontmatter (transitive supersedes lineage · cross-sprint domain clusters · orphan/dangling detection) — a disposable build artifact, never hand-edited, regenerated from the SSOT. Guardrails (ALL mandatory, or don't build): (i) regeneration wired to lean-doc-generator's write step; (ii) read-time staleness check — the view carries a source checksum/mtime and fails LOUD if the frontmatter is newer (a stale CACHE, not a stale fact); (iii) integrity lint (shared with TASK-036). graphify serves this ad-hoc until it's worth automating.
      touches:   docs/ (corpus-wide) · a generation script/skill · graphify (on-demand)
      decision:  (2026-07-02, council-2) REJECT (c) a separately-maintained graph — UNANIMOUS: second source of truth, silent drift, unbuildable agent-free (= the banned codemap rule). This is priority #4 (relational comprehension) — below 036's freshness/precision/context-load. Reject the Expansionist's "gate /prime citations off the graph" — agent-free scope creep; keep the view passive.
      tracker:   verdict (temp) verdict-knowledge-library.md · refs docs/research/graphify-daily-value.md · https://github.com/Egonex-AI/Understand-Anything
      state:     blocked   (build on the TASK-041 signal + only with all 3 guardrails; lower priority than 036)
- [ ] **TASK-047 — Council multi-model diversity backend**  [size: L] [risk: high] [HITL]
      done-when: ≥2 personas route to a different provider/model to recover architectural (uncorrelated-error) diversity — the only fix for shared-weights blind spots (5 personas on one model share its priors).
      touches:   skills/council/SKILL.md · skills/council/references/{advisors,prompts}.md · a provider-routing seam
      assumes:   requires a prior call on whether lean-flow takes a provider dependency at all (likely /council-worthy itself).
      next:      **gate behind cheaper steps, in order** (council verdict, SPRINT-014 T2 exercise): (1) MEASURE — run today's single-model council 3× on one real decision, check if the 5 personas actually diverge (if they already converge, "5 personas" is theater; if they diverge, the ceiling may be overstated); (2) exhaust cheap levers — per-persona temperature/seed/adversarial framing before any dependency; (3) if built, fix the SYNTHESIS BOTTLENECK too — multi-model advisors still funnel through one chairman, so a naive backend is a no-op. Build the provider dependency LAST.
      tracker:   docs/research/council-improvements.md (Option C, deferred) · verdict-council-multimodel.md (temp)
      state:     blocked   (deferred — revisit only after step (1) measurement shows the ceiling is a real crack)
- [ ] **TASK-044 — Extend the metadata SSOT + index to ADRs & research docs**  [size: M] [risk: low] [HITL]
      done-when: ADRs (docs/adr/) + research (docs/research/) carry per-file frontmatter (id · tags · domain · status · supersedes/superseded-by · related) per ADR-009; the generated index (or a sibling) covers them; qa-check's dangling-ref + completeness lints extend to them.
      touches:   docs/adr/*.md · docs/research/*.md · scripts/gen-learnings-index.sh (or a generalized gen-index) · scripts/qa-check.sh
      assumes:   ADR-009's "over time" extension; the per-entry LEARNINGS half shipped in SPRINT-013. none blocking.
      tracker:   SPRINT-013 Retro friction (docs/sprint/archive/SPRINT-013-knowledge-metadata.md)
      state:     ready → promoted to SPRINT-014 (2026-07-02)
- TASK-008 — Define `/insights` → **built** 2026-06-16, **shipped in v1.2.0** (2026-06-22): anytime friction → `L-NNN` candidate (bumps a match's `count`) into `docs/LEARNINGS.md` (the §10 feed).

> TASK-007 (tuned recon agent) → routed to `.out-of-scope/tuned-recon-agent.md` (2026-06-12) — `Explore` is the universal recon agent and sufficient; the lever is *optimal usage* (already wired: tier-routing + scoped recon brief; ADR-002).

---

## Tech Debt

<!-- TD-NNN, separate from TASK-NNN. Never deleted — resolved → status: resolved → TASK-NNN.
     Filed by Sprint Close Retro. Aging at Promote: ≥3 sprints → re-review; high → auto P1.
     severity ∈ trivial · minor · medium · high. -->

<!-- TD-001…004 collapsed at SPRINT-008 promote (resolved ≥3 sprints ago, §11) — full history in git + sprint files. -->
- **TD-001** resolved → SPRINT-003 T1+T2 (migrate · council · verdict→ADR-006 feed — all exercised on real input)
- **TD-002** resolved → SPRINT-005 T1 (council SKILL 341→60; artifacts → references/, ADR-006)
- **TD-003** resolved → SPRINT-004 T1 (orchestrator SKILL → 107 ≤110; Review → references/)
- **TD-004** resolved → SPRINT-005 T1 (cap-rule wording fixed — artifacts in references/ don't count; ADR-006)
- **TD-005** resolved → SPRINT-006 T2 (CONTEXT 151→127 + cap 100→130, ADR-007)
- **TD-006** severity: medium | status: resolved → SPRINT-009 T1 (2026-06-21)
  - Summary: CONTEXT.md deduped 130 → 122 (built-in detail → ARCHITECTURE pointer; curated/loop/governance compressed); 8 lines recovered, no info lost. L-008 promoted at SPRINT-009 promote.
- **TD-007** severity: medium | status: open | created: Sprint-012
  - Summary: `skills/orchestrator/SKILL.md` is at 109/110 — the next addition can't fit in the body. Do a references extraction (move a section → `references/`) or a compression pass before the next orchestrator change. Surfaced at SPRINT-012 close (Friction · L-012).

---

## Changelog (current sprint only)

> Move to `docs/CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — Sprints 001–002 are recorded in [`docs/CHANGELOG.md`](docs/CHANGELOG.md).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```
