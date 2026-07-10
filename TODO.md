---
owner: Maintainer
last_updated: 2026-07-10
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

> _(no active sprint — SPRINT-015 closed 2026-07-10 → v1.6.0; archived per §11.)_

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

<!-- (prior P1 batch — TASK-009 · 013 · 017 · 010 — shipped in SPRINT-008; TASK-035 shipped in SPRINT-012; see docs/CHANGELOG.md) -->

<!-- (TASK-053 · 057 · 054 shipped in SPRINT-015 → v1.6.0; see docs/CHANGELOG.md) -->
_(empty)_

### P2 — Quality / Polish

<!-- (SPRINT-008…011 batches shipped; see docs/CHANGELOG.md) -->

- TASK-045 — Council adopt-now hardening bundle → **done** 2026-07-02 (SPRINT-014 T2): pre-mortem · dialectical Contrarian · calibrated verdict · questions-first · ceiling · judge-bias hardening. See CHANGELOG.
- TASK-046 — Council gated passes (fact-verify + unknown-unknowns moderator) → **done** 2026-07-02 (SPRINT-014 T3). See CHANGELOG.

<!-- P2 batch (from 2026-07-10 decompose) — sequence AFTER the P1 loop-hardening sprint; 056 shares orchestrator/SKILL.md so it must not parallel-build with the P1 set (L-042). -->
- [ ] **TASK-052 — Make `migrate` re-runnable as a plugin-update sync**  [size: M] [risk: med] [HITL]
      done-when: re-running migrate on an already-adopted repo pulls forward new standard/template changes from a plugin update — idempotent, reports what changed, never clobbers user edits
      touches:   skills/lean-doc-generator/SKILL.md (migrate) · references/DOCS_Guide.md
      assumes:   overlaps TASK-051 (init) — coordinate the migrate/init split before either builds
      state:     ready
- [ ] **TASK-055 — close: sweep the full session for TD + follow-ups**  [size: M] [risk: med] [HITL]
      done-when: /lean-doc close's §10 Retro routing captures ALL tech-debt + follow-up items surfaced during the session into TD-NNN / TASK-NNN — not only items already written down
      touches:   skills/lean-doc-generator/SKILL.md (close) · references/DOCS_Guide.md §10
      state:     ready
- [ ] **TASK-056 — Wire recon-delegation + per-phase model tiers into orchestrator**  [size: M] [risk: med] [HITL]
      done-when: orchestrator's procedure explicitly triggers a read-only recon (Explore, cheap tier) before implementing on mature/unfamiliar code, AND assigns model tiers per phase (plan=session/large · build=cheap/small · recon+ingest=fast) so tiering actually fires — not just documented. Mirrors kalasuara L-026.
      touches:   skills/orchestrator/SKILL.md · .claude/CONTEXT.md (Model tiers)
      assumes:   builds on the existing tier table (TASK-018); likely /council (changes the loop); shares orchestrator/SKILL.md with the P1 set — serialize
      state:     ready

### P3 — Long-term

<!-- Research / decide-first batch (from 2026-07-10 decompose) — independent, docs-only, fully parallel. -->
- [ ] **TASK-049 — Scan structarmed repo for adaptable patterns**  [size: S] [risk: low] [HITL]
      done-when: docs/research/structarmed-adaptation.md lists keepers vs rejects (curated-not-copied bar), mirroring the bmad scan (TASK-039)
      touches:   docs/research/
      tracker:   https://github.com/boundwize/structarmed
      state:     ready
- [ ] **TASK-050 — Evaluate obra 'brainstorming' skill (spike, don't build)**  [size: S] [risk: low] [HITL]
      done-when: docs/research/brainstorming-adaptation.md — keepers/rejects; a follow-up build task filed ONLY for what clears the useful+important+used bar
      touches:   docs/research/
      tracker:   https://crossaitools.com/skills/obra/superpowers/brainstorming
      state:     ready
- [ ] **TASK-051 — Decide whether lean-flow needs an `init` (new-repo adaptation)**  [size: M] [risk: med] [HITL]
      done-when: recorded decision (ADR or note) on whether to add an init/onboarding command that scaffolds a fresh repo's context docs (+ optional .claude/settings.json safe-command allowlist) — the greenfield twin of migrate
      touches:   skills/lean-doc-generator/ or /prime · docs/adr/ (if adopted)
      assumes:   overlaps TASK-052 (migrate); decide the split before either builds
      state:     ready   (decide-first; do NOT build settings.json scaffolding until approved)
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
      also:      **data-governance blocker** (moderator, SPRINT-014 T3): a 2nd-provider backend widens the trust boundary — routes repo content to a vendor the host-repo owner never consented to, exposure peaking on exactly the rare high-stakes runs. Weigh (likely a consent/config gate) before any build.
      tracker:   docs/research/council-improvements.md (Option C, deferred) · verdict-council-multimodel.md (temp) · gated by TASK-048
      state:     blocked   (deferred — revisit only after TASK-048 measurement shows the ceiling is a real crack)
- TASK-044 — Extend metadata SSOT + index to ADRs & research → **done** 2026-07-02 (SPRINT-014 T1): 9 ADR + 6 research carry ADR-009 frontmatter; `gen-index.sh` → `docs/knowledge-index.md`; qa-check corpus lints. See CHANGELOG.
- [ ] **TASK-048 — Measure whether /council's 5 personas actually diverge**  [size: S] [risk: low] [HITL]
      done-when: run today's single-model /council 3× on one real past decision; record whether the 5 personas substantively DISAGREE or just converge — the datapoint that says if the single-model ceiling is a real crack (→ unblocks or kills TASK-047) or a footnote.
      touches:   /council (exercise only) · a short findings note in docs/research/council-improvements.md
      tracker:   verdict-council-multimodel.md (the verdict's "one thing to do first") · gates TASK-047
      state:     ready
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
- **TD-007** severity: medium | status: resolved (2026-07-02) | created: Sprint-012
  - Summary: `skills/orchestrator/SKILL.md` was at 109/110. **Resolved** — compressed the § Review block (skip-table/scale-depth/routing detail already lived in `references/review-scoping.md`, a pure L-008 dedup) to a lean summary + pointer; recovered ~5 lines. Now well under cap.

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
