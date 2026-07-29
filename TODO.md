---
owner: Maintainer
last_updated: 2026-07-29
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

> **SPRINT-027 — Night-Run Watchdog & Housekeeping** → docs/sprint/SPRINT-027-watchdog-housekeeping.md

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] **TASK-098 — Night-run resilience: watchdog + morning rollup**  [size: S] [risk: low] [HITL]
      done-when: handoff-on-stall watchdog pattern + "Blocked/needs-human" morning rollup documented and wired into the sprint-bulk/handoff references; exercised on a simulated stall
      touches:   skills/orchestrator/references/night-run.md · skills/handoff/SKILL.md
      assumes:   none — TASK-097 shipped (v1.13.0), dependency cleared
      tracker:   docs/research/night-run.md
      state:     ready

### P2 — Quality / Polish

- [ ] **TASK-091 — Streamline housekeeping: archival, rotation, doc growth**  [size: M] [risk: low] [HITL]
      done-when: sprint-file + changelog archival/rotation is one documented repeatable pass (scripted only where trivial); a growth-compaction pass defined AND exercised once on the current corpus (docs/research/ · LEARNINGS) with a measured line delta — not spec-only (L-007); compaction proposes deletions, human approves
      touches:   docs/ · lean-doc-generator close/§11 wiring
      assumes:   no new SSOT; improves the existing §11 aging + close-sweep, doesn't replace them
      tracker:   none — friction named by maintainer (archival · rotation · doc growth)
      state:     ready
- [ ] **TASK-092 — Delta re-scan: Graphify-Labs/graphify vs prior verdict**  [size: S] [risk: low] [AFK]
      done-when: docs/research/graphify-daily-value.md carries a dated re-verdict — the token-cost / popularity claims tested against the current repo feature set per L-017 (delta over existing surface, not standalone merit); on-demand stance re-affirmed OR an integration task filed with evidence
      touches:   docs/research/graphify-daily-value.md
      assumes:   prior verdict (on-demand only, no integration) is the delta base; TASK-040 guardrails still bind any integration
      tracker:   https://github.com/Graphify-Labs/graphify
      state:     ready
- [ ] **TASK-094 — Scan: OpenAI harness-engineering adaptation**  [size: S] [risk: low] [AFK]
      done-when: delta-scan doc maps each technique to the existing surface first (L-017); only the unmatched remainder kept; fleet-relevant findings cross-referenced into the fog-map's harness-inventory ticket
      touches:   docs/research/
      assumes:   article is provider-agnostic enough to adapt; Claude-harness equivalents count as "already covered"
      tracker:   https://openai.com/index/harness-engineering/
      state:     ready
- [ ] **TASK-095 — Scan: uditakhourii/adhd skill repo**  [size: S] [risk: low] [AFK]
      done-when: delta-scan doc; keepers filed as proposals or a clean reject recorded with per-candidate rationale
      touches:   docs/research/
      assumes:   most candidates reject (L-017 base rate); popularity alone is not a keep signal
      tracker:   https://github.com/uditakhourii/adhd
      state:     ready

### P3 — Long-term

- [ ] **TASK-006 — Evaluate an opt-in PreToolUse gate-guard hook** [size: M] [risk: med] [HITL]
      done-when: decision recorded (ADR/council) on whether enforced gates are worth a hook
      next: **gather data first** — research Claude Code PreToolUse hooks (can a hook block a tool call on gate state? capabilities/limits) → draft a proposed ADR → decide (it touches the agent-free-core principle, so likely /council before the ADR)
      state: blocked   (deferred — research hooks next session)
- [ ] **TASK-040 — Derived, on-demand graph VIEW over the metadata (relational comprehension)**  [size: L] [risk: med] [HITL]
      done-when: a graph view is GENERATED from TASK-036's frontmatter (transitive supersedes lineage · cross-sprint domain clusters · orphan/dangling detection) — a disposable build artifact, never hand-edited, regenerated from the SSOT. Guardrails (ALL mandatory, or don't build): (i) regeneration wired to lean-doc-generator's write step; (ii) read-time staleness check — the view carries a source checksum/mtime and fails LOUD if the frontmatter is newer (a stale CACHE, not a stale fact); (iii) integrity lint (shared with TASK-036). graphify serves this ad-hoc until it's worth automating.
      touches:   docs/ (corpus-wide) · a generation script/skill · graphify (on-demand)
      decision:  (2026-07-02, council-2) REJECT (c) a separately-maintained graph — UNANIMOUS: second source of truth, silent drift, unbuildable agent-free (= the banned codemap rule). This is priority #4 (relational comprehension) — below 036's freshness/precision/context-load. Reject the Expansionist's "gate /prime citations off the graph" — agent-free scope creep; keep the view passive.
      okf:       (2026-07-10, docs/research/okf-adoption.md) an OKF-conformant **export** could be the portable/agent-interop sibling of this graph view — same derived-view/one-SSOT shape; build only if portability becomes a real need (YAGNI). Do NOT adopt OKF as the authoring format (loses typed relations + guts the strict lint).
      tracker:   docs/research/graphify-daily-value.md · docs/research/okf-adoption.md · https://github.com/Egonex-AI/Understand-Anything
      state:     blocked   (build on the TASK-041 signal + only with all 3 guardrails; lower priority than 036)
- [ ] **TASK-047 — Council multi-model diversity backend**  [size: L] [risk: high] [HITL]
      done-when: ≥2 personas route to a different provider/model to recover architectural (uncorrelated-error) diversity — the only fix for shared-weights blind spots (5 personas on one model share its priors).
      touches:   skills/council/SKILL.md · skills/council/references/{advisors,prompts}.md · a provider-routing seam
      assumes:   requires a prior call on whether lean-flow takes a provider dependency at all (likely /council-worthy itself).
      next:      **gate behind cheaper steps, in order** (council verdict, SPRINT-014 T2 exercise): (1) MEASURE — run today's single-model council 3× on one real decision, check if the 5 personas actually diverge (if they already converge, "5 personas" is theater; if they diverge, the ceiling may be overstated); (2) exhaust cheap levers — per-persona temperature/seed/adversarial framing before any dependency; (3) if built, fix the SYNTHESIS BOTTLENECK too — multi-model advisors still funnel through one chairman, so a naive backend is a no-op. Build the provider dependency LAST.
      also:      **data-governance blocker** (moderator, SPRINT-014 T3): a 2nd-provider backend widens the trust boundary — routes repo content to a vendor the host-repo owner never consented to, exposure peaking on exactly the rare high-stakes runs. Weigh (likely a consent/config gate) before any build.
      reframe:   (2026-07-10, TASK-048 1× probe → SPRINT-020 T4) if ever built, the ONLY axiom-consistent shape is a **BYO-provider, opt-in, disabled-by-default** seam — the installer supplies + consents to their own 2nd provider; lean-flow ships an integration seam, never the trust boundary. Prerequisite is now **TASK-065** (measure error-decorrelation on a *factual* decision) — the judgment-fork probe couldn't test shared factual priors.
      tracker:   docs/research/council-improvements.md §§ Divergence measurement · Factual decorrelation probe
      state:     blocked   (deferred, bar RAISED — TASK-048 (judgment) + TASK-065 (cross-tier factual) both found NO exposed crack; before any build, a cross-PROVIDER test must show a real shared factual error that a different provider corrects)

> TASK-007 (tuned recon agent) → routed to `.out-of-scope/tuned-recon-agent.md` (2026-06-12) — `Explore` is the universal recon agent and sufficient; the lever is *optimal usage* (already wired: tier-routing + scoped recon brief; ADR-002).

---

## Tech Debt

<!-- TD-NNN, separate from TASK-NNN. Never deleted — resolved → status: resolved → TASK-NNN.
     Filed by Sprint Close Retro. Aging at Promote: ≥3 sprints → re-review; high → auto P1.
     severity ∈ trivial · minor · medium · high. -->

- **TD-008** severity: minor | status: open | created: Sprint-017 | re-reviewed: 2026-07-17 (SPRINT-024 promote)
  - Summary: `skills/lean-doc-generator/SKILL.md` at 104/110 after the init + migrate-sync + close-sweep adds. Under cap, but the init section is the tightest fit — if the next lean-doc feature needs headroom, relocate init's 4-step procedure to a reference (L-012, as migrate's detail lives in `migration-map.md`). Watch at promote aging.
  - Re-review: kept open — directly load-bearing in SPRINT-024 (T2/T4/T6 add lines to this file); mitigation pre-planned in the sprint (relocate init detail to a reference if the cap is threatened).

<!-- TD-001…007 all resolved (§11 collapse — per-TD summaries live in their sprint files + git). -->
- resolved: **TD-001**→SPRINT-003 · **TD-002/004**→SPRINT-005 · **TD-003**→SPRINT-004 · **TD-005**→SPRINT-006 · **TD-006**→SPRINT-009 · **TD-007**→SPRINT-012 (closed 2026-07-02).

---

## Changelog (current sprint only)

> Move to `docs/CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — Sprint history → [`docs/CHANGELOG.md`](docs/CHANGELOG.md) (rotated archives → `docs/changelog/`).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```
