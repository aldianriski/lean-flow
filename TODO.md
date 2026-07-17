---
owner: Maintainer
last_updated: 2026-07-17
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

> **SPRINT-024 — Loop Hygiene & Wiring** → docs/sprint/SPRINT-024-loop-hygiene.md

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

<!-- Loop-hygiene batch (TASK-073…086) ← docs/research/loop-hygiene-prd.md (audit 2026-07-17) -->
- [ ] **TASK-073 — Execute the one-shot hygiene cleanup (W0)**  [size: S] [risk: low] [AFK]
      done-when: TODO.md holds zero shipped-task tombstone comments and no stale sprint/changelog pointers; README footer matches plugin.json version; .claude/CLAUDE.md carries ownership frontmatter; orphan docs/research/image.png removed; `sh scripts/qa-check.sh` still green
      touches:   TODO.md · README.md · .claude/CLAUDE.md · docs/research/
      assumes:   history lives in CHANGELOG + sprint archive — deletion is safe (§11)
      tracker:   docs/research/loop-hygiene-prd.md §W0
      state:     ready
- [ ] **TASK-074 — Standardize the tombstone + wire close's hygiene sweep (W1)**  [size: M] [risk: med] [HITL]
      done-when: close writes ONE canonical tombstone string that §11's delete rule and a new qa-check lint both match; close's sweep (matured tombstones · refs to the just-closed sprint · rotation links) runs behind an explicit propose→approve verb; exercised once on a real close
      touches:   skills/lean-doc-generator/SKILL.md · references/DOCS_Guide.md §11 · scripts/qa-check.sh
      assumes:   A1 — tombstone survives one sprint vs deleted immediately at close (G2 call)
      tracker:   docs/research/loop-hygiene-prd.md §W1/W3
      state:     ready
- [ ] **TASK-075 — Extend qa-check coverage to the blind drift classes (W1)**  [size: M] [risk: med] [AFK]
      done-when: qa-check FAILs on: README-footer version ≠ plugin.json · missing ownership frontmatter on CLAUDE.md/README · TD ≥3 closed sprints with no re-review annotation · `(temp)` tracker refs in TODO.md · hand-written cap snapshots outside generated docs; each new lint verified FAIL on the pre-cleanup tree and PASS after; gen-index.sh stamps its own `last_updated` on every run
      touches:   scripts/qa-check.sh · scripts/gen-index.sh · docs/QA.md
      assumes:   none
      tracker:   docs/research/loop-hygiene-prd.md §W1
      depends-on: TASK-073
      state:     ready

### P1 — Next Phase Required

- [ ] **TASK-076 — Emit the §10 promote checklist + sign-off (W1/W3)**  [size: S] [risk: med] [HITL]
      done-when: promote outputs explicit checkbox lines (TD aging · L-promotion · dedup-near-cap) and an explicit human sign-off before render/commit; first real firing records TD-008's overdue re-review outcome
      touches:   skills/lean-doc-generator/SKILL.md · references/DOCS_Guide.md §10
      assumes:   A5 — TD-008 re-review rides the first firing
      tracker:   docs/research/loop-hygiene-prd.md §W1/W3
      state:     ready
- [ ] **TASK-077 — Implement bug-intake routing in triage (W2)**  [size: S] [risk: med] [HITL]
      done-when: triage's Flow contains the BUG routing CONTEXT.md claims (trivial known cause → TASK · needs investigation → /diagnose · architectural → TD-NNN), exercised once on a sample BUG doc
      touches:   skills/triage/SKILL.md
      assumes:   A4 — implement the claim, don't delete it
      tracker:   docs/research/loop-hygiene-prd.md §W2
      state:     ready
- [ ] **TASK-078 — Wire the feed pipeline's missing handoffs (W2)**  [size: S] [risk: low] [AFK]
      done-when: promote's intake explicitly pulls `state: ready` tasks only; prime's Next: routing offers /triage when a backlog exists with nothing ready; both traced once on the consumer path
      touches:   skills/lean-doc-generator/SKILL.md · skills/prime/SKILL.md
      assumes:   none
      tracker:   docs/research/loop-hygiene-prd.md §W2
      state:     ready
- [ ] **TASK-079 — Reconcile CONTEXT built-ins + loop statement (W2)**  [size: S] [risk: low] [AFK]
      done-when: CONTEXT.md's built-in list contains only wired commands (/fork dropped · /simplify pointed at its actual home) and the loop headline carries the feed pipeline in the same sentence
      touches:   .claude/CONTEXT.md
      assumes:   A2 — /fork dropped, not wired
      tracker:   docs/research/loop-hygiene-prd.md §W2
      state:     ready
- [ ] **TASK-080 — Resolve G1 ownership between decomposer and orchestrator (W2/W3)**  [size: S] [risk: med] [HITL]
      done-when: orchestrator states the rule — decomposer-approved task → G1 fast-path ("scope unchanged since approval? y/n"), else full G1 — and task-decomposer's "approve is the gate" line agrees; no textual contradiction remains
      touches:   skills/orchestrator/SKILL.md · skills/task-decomposer/SKILL.md
      assumes:   none
      tracker:   docs/research/loop-hygiene-prd.md §W2/W3
      state:     ready
- [ ] **TASK-081 — Make L-NNN ids monotonic + fix broken citations (W4)**  [size: M] [risk: med] [HITL]
      done-when: LEARNINGS.md documents never-reuse + retired-id stubs; the L-016/L-017 collisions and dangling L-024/037/042 cites in shipped skills are corrected; qa-check lints that every L-NNN cited under skills/ resolves or is labeled promoted
      touches:   docs/LEARNINGS.md · references/DOCS_Guide.md §11 · skills/{tdd,task-decomposer,orchestrator} · scripts/qa-check.sh
      assumes:   none
      tracker:   docs/research/loop-hygiene-prd.md §W4
      state:     ready
- [ ] **TASK-082 — Archive referenced verdicts durably + repoint trackers (W4)**  [size: S] [risk: low] [AFK]
      done-when: council/DOCS_Guide state the policy (a verdict referenced by a durable doc is copied to docs/research/verdict-<slug>.md at reference time); TASK-040/047 trackers point only at files that exist
      touches:   skills/council/SKILL.md · references/DOCS_Guide.md · TODO.md trackers
      assumes:   none
      tracker:   docs/research/loop-hygiene-prd.md §W4
      state:     ready

### P2 — Quality / Polish

- [ ] **TASK-083 — Sweep consumer-surface leaks from generic skills (W5)**  [size: S] [risk: low] [AFK]
      done-when: insights carries its own inline LEARNINGS entry shape and no scripts/ path; prime + dispatch.md inline their rationale instead of docs/research/ pointers; a cold consumer read of each edited file resolves every reference
      touches:   skills/insights · skills/prime · skills/orchestrator/references/dispatch.md
      assumes:   none
      tracker:   docs/research/loop-hygiene-prd.md §W5
      depends-on: TASK-081 (shared files)
      state:     ready
- [ ] **TASK-084 — Document + apply the canonical SKILL.md skeleton (W6)**  [size: M] [risk: low] [HITL]
      done-when: the skeleton (section names · order · what's optional) is documented once; all 14 skills conform or carry a noted deviation (council argument-hint + ${CLAUDE_SKILL_DIR} · Output-format/When-to-invoke naming · allowed-tools scoping rationale recorded)
      touches:   references/DOCS_Guide.md (or a style note) · several skills/*/SKILL.md
      assumes:   none
      tracker:   docs/research/loop-hygiene-prd.md §W6
      depends-on: TASK-081 · TASK-083
      state:     ready
- [ ] **TASK-085 — Bring templates up to ADR-009 + reconcile counts (W6)**  [size: S] [risk: low] [AFK]
      done-when: ADR + RESEARCH templates carry id/tags/domain/status/related; BUG listed as core row 14 in DOCS_Guide §2; README/CLAUDE/ARCHITECTURE agree on "14 core (+2 non-core = 16)"
      touches:   skills/lean-doc-generator/templates · references/DOCS_Guide.md · README.md · docs/ARCHITECTURE.md
      assumes:   A3 — BUG is core
      tracker:   docs/research/loop-hygiene-prd.md §W6
      state:     ready
- [ ] **TASK-086 — Deduplicate README's modes table to a pointer (W6)**  [size: S] [risk: low] [AFK]
      done-when: README references CONTEXT.md's modes table instead of reproducing it verbatim (ADR-007)
      touches:   README.md
      assumes:   dedup targets byte-identical volatile tables only — showcase prose/diagrams stay (coordinate with TASK-087)
      tracker:   docs/research/loop-hygiene-prd.md §W6
      state:     ready
- [ ] **TASK-087 — Upgrade README.md.template to a showcase-grade front-door template**  [size: M] [risk: low] [HITL]
      done-when: README.md.template models a professional human showcase (hero/pitch · badges · quick start · feature table · architecture diagram · doc links) as a guide-not-gate (explicitly adaptable, no strict section list); DOCS_Guide §2's "no hard cap / signal-dense" stance restated in the template header; one anti-SSOT rule inside (present, don't byte-duplicate volatile CONTEXT tables); AI-context division (README=human · CLAUDE/CONTEXT=agent) stated once
      touches:   skills/lean-doc-generator/templates/README.md.template · references/DOCS_Guide.md §2
      assumes:   the standard keeps README uncapped (already true) — this only upgrades the modeled quality
      tracker:   owner request 2026-07-17 · docs/research/loop-hygiene-prd.md §W6
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

_(SPRINT-024 in progress — nothing accumulated yet)_ — Sprint history → [`docs/CHANGELOG.md`](docs/CHANGELOG.md) (rotated archives → `docs/changelog/`).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```
