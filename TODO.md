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

> **SPRINT-020 — Workflow Hardening** → docs/sprint/SPRINT-020-workflow-hardening.md

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

<!-- (TASK-055 · 052 · 059 shipped in SPRINT-017 → v1.7.0; see docs/CHANGELOG.md) -->
<!-- (TASK-056 shipped in SPRINT-019 → v1.8.0 · ADR-010; see docs/CHANGELOG.md) -->

### P3 — Long-term

<!-- (TASK-049 · 050 · 051 promoted → SPRINT-016 active 2026-07-10; live plan + DoD in docs/sprint/SPRINT-016-research-spikes.md) -->
<!-- (TASK-058 · 060 shipped in SPRINT-018 → v1.7.1; see docs/CHANGELOG.md) -->
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
<!-- (TASK-062 · 061 · 063 · 048 promoted → SPRINT-020 active 2026-07-10; live plan + DoD in docs/sprint/SPRINT-020-workflow-hardening.md) -->
- [ ] **TASK-064 — Design spike: wayfinder-style fog-mode for /task-decomposer**  [size: M] [risk: med] [HITL]
      done-when: decision recorded on whether foggy work too big to slice needs a pre-decomposition "fog map" mode (decision-resolving tickets + fog-graduation) in /task-decomposer, or whether /prototype + research-spike already cover it. Needs a real foggy problem to test against.
      touches:   skills/task-decomposer/ (design only) · docs/research/mattpocock.md (findings)
      assumes:   fold into /task-decomposer as a mode, NOT a new skill (roster stays 14)
      tracker:   docs/research/mattpocock.md § Out of scope (wayfinder fog-mode)
      state:     needs-info   (worth building vs already covered — settle at next promote)
<!-- TASK-008 done → /insights shipped v1.2.0 (friction → L-NNN candidate); see CHANGELOG. -->

> TASK-007 (tuned recon agent) → routed to `.out-of-scope/tuned-recon-agent.md` (2026-06-12) — `Explore` is the universal recon agent and sufficient; the lever is *optimal usage* (already wired: tier-routing + scoped recon brief; ADR-002).

---

## Tech Debt

<!-- TD-NNN, separate from TASK-NNN. Never deleted — resolved → status: resolved → TASK-NNN.
     Filed by Sprint Close Retro. Aging at Promote: ≥3 sprints → re-review; high → auto P1.
     severity ∈ trivial · minor · medium · high. -->

- **TD-008** severity: minor | status: open | created: Sprint-017
  - Summary: `skills/lean-doc-generator/SKILL.md` at 104/110 after the init + migrate-sync + close-sweep adds. Under cap, but the init section is the tightest fit — if the next lean-doc feature needs headroom, relocate init's 4-step procedure to a reference (L-012, as migrate's detail lives in `migration-map.md`). Watch at promote aging.

<!-- TD-001…007 all resolved (§11 collapse — per-TD summaries live in their sprint files + git). -->
- resolved: **TD-001**→SPRINT-003 · **TD-002/004**→SPRINT-005 · **TD-003**→SPRINT-004 · **TD-005**→SPRINT-006 · **TD-006**→SPRINT-009 · **TD-007**→SPRINT-012 (closed 2026-07-02).

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
