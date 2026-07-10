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

> **SPRINT-016 — Research Spikes** → docs/sprint/SPRINT-016-research-spikes.md  (active · 3 tasks: T1 structarmed · T2 brainstorming · T3 init-decision)

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

<!-- (prior P1 batch — TASK-009 · 013 · 017 · 010 — shipped in SPRINT-008; TASK-035 shipped in SPRINT-012; see docs/CHANGELOG.md) -->

<!-- (TASK-053 · 057 · 054 shipped in SPRINT-015 → v1.6.0; see docs/CHANGELOG.md) -->
_(empty)_

### P2 — Quality / Polish

<!-- (SPRINT-008…011 batches + TASK-045 · 046 [SPRINT-014 council hardening] shipped; see docs/CHANGELOG.md) -->

<!-- P2 batch (from 2026-07-10 decompose) — sequence AFTER the P1 loop-hardening sprint; 056 shares orchestrator/SKILL.md so it must not parallel-build with the P1 set (L-042). -->
- [ ] **TASK-052 — Make `migrate` re-runnable as a plugin-update sync**  [size: M] [risk: med] [HITL]
      done-when: re-running migrate on an already-adopted repo pulls forward new standard/template changes from a plugin update — idempotent, reports what changed, never clobbers user edits
      touches:   skills/lean-doc-generator/SKILL.md (migrate) · references/DOCS_Guide.md
      assumes:   init/migrate split DECIDED (docs/research/init-vs-migrate.md) — migrate stays adopt-existing; greenfield → TASK-059. No overlap.
      state:     ready
- [ ] **TASK-059 — Add `/lean-doc-generator init` mode (scope-interactive greenfield scaffold)**  [size: M] [risk: med] [HITL]
      done-when: `/lean-doc-generator init` scaffolds a fresh repo's docs — always the core set, and INTERACTIVELY scopes which optional docs (DESIGN/RESEARCH/DEPLOY/…) to include by repo type; docs-only (never writes .claude/settings.json). Distinct from migrate (adopt-existing).
      touches:   skills/lean-doc-generator/SKILL.md · references/DOCS_Guide.md · templates/
      tracker:   docs/research/init-vs-migrate.md (TASK-051 decision)
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

<!-- (TASK-049 · 050 · 051 promoted → SPRINT-016 active 2026-07-10; live plan + DoD in docs/sprint/SPRINT-016-research-spikes.md) -->
- [ ] **TASK-058 — Fold brainstorming keepers (K1/K2) into G2 / anti-patterns**  [size: S] [risk: low] [HITL]
      done-when: /orchestrator G2 (and/or CLAUDE.md anti-patterns) names the "too simple to need a design" rationalization as a red-flag (K1); optionally K2 — offer section-by-section approval for L designs. Nothing else from the obra brainstorming skill is built.
      touches:   skills/orchestrator/SKILL.md · .claude/CLAUDE.md
      tracker:   docs/research/brainstorming-adaptation.md (TASK-050 verdict)
      state:     ready
- [ ] **TASK-006 — Evaluate an opt-in PreToolUse gate-guard hook** [size: M] [risk: med] [HITL]
      done-when: decision recorded (ADR/council) on whether enforced gates are worth a hook
      next: **gather data first** — research Claude Code PreToolUse hooks (can a hook block a tool call on gate state? capabilities/limits) → draft a proposed ADR → decide (it touches the agent-free-core principle, so likely /council before the ADR)
      state: blocked   (deferred — research hooks next session)
<!-- TASK-039 done 2026-07-02 → docs/research/bmad-adaptation.md (5 keepers folded into TASK-037/042/043/035, rest rejected); see CHANGELOG. -->
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
<!-- TASK-044 done (SPRINT-014 T1) → metadata SSOT + index extended to ADR/research; see CHANGELOG. -->
- [ ] **TASK-048 — Measure whether /council's 5 personas actually diverge**  [size: S] [risk: low] [HITL]
      done-when: run today's single-model /council 3× on one real past decision; record whether the 5 personas substantively DISAGREE or just converge — the datapoint that says if the single-model ceiling is a real crack (→ unblocks or kills TASK-047) or a footnote.
      touches:   /council (exercise only) · a short findings note in docs/research/council-improvements.md
      tracker:   verdict-council-multimodel.md (the verdict's "one thing to do first") · gates TASK-047
      state:     ready
<!-- TASK-008 done → /insights shipped v1.2.0 (friction → L-NNN candidate); see CHANGELOG. -->

> TASK-007 (tuned recon agent) → routed to `.out-of-scope/tuned-recon-agent.md` (2026-06-12) — `Explore` is the universal recon agent and sufficient; the lever is *optimal usage* (already wired: tier-routing + scoped recon brief; ADR-002).

---

## Tech Debt

<!-- TD-NNN, separate from TASK-NNN. Never deleted — resolved → status: resolved → TASK-NNN.
     Filed by Sprint Close Retro. Aging at Promote: ≥3 sprints → re-review; high → auto P1.
     severity ∈ trivial · minor · medium · high. -->

<!-- TD-001…007 all resolved (§11 collapse — per-TD summaries live in their sprint files + git). -->
_(no open tech debt)_ — resolved: **TD-001**→SPRINT-003 · **TD-002/004**→SPRINT-005 · **TD-003**→SPRINT-004 · **TD-005**→SPRINT-006 · **TD-006**→SPRINT-009 · **TD-007**→SPRINT-012 (closed 2026-07-02).

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
