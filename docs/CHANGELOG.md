---
owner: Maintainer
last_updated: 2026-07-10
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.10.0 — Fog-Mode (2026-07-10)

MINOR — bundles **SPRINT-021**.

**What changed for you:**
- **`/task-decomposer` gains a fog-map mode** (`--fog`, or offered when the intake grill reveals the
  frontier is unknowable) — for work *too foggy/large to plan up front*, where you can't write acceptance
  criteria because the decisions aren't known yet. It produces a living **fog-map** (Destination ·
  Decisions-so-far · Not-yet-specified · Out-of-scope) of **decision-tickets** (research / prototype /
  grilling / task) that **route to existing skills** (`/prototype`, grill, research-spike) and **graduate
  into `TASK-NNN`** as the fog clears — then you decompose normally. It sequences what lean-flow already
  has; it doesn't add a skill (roster stays 14). Detail → `task-decomposer/references/fog-map.md`.

**Maintainer-side only:** a cross-tier factual-decorrelation probe (TASK-065) found no divergence — the
base dispatch tier was already correct, so different Anthropic tiers confirmed rather than corrected;
combined with TASK-048 it raises the bar on the deferred multi-model backend (TASK-047), which now needs a
*cross-provider* test showing a corrected error before any build. Recorded in `council-improvements.md`.

Manifests → 1.10.0 lockstep; skill roster unchanged (14 — fog-map is a mode). Additive — nothing to migrate.

---

## v1.9.0 — Workflow Hardening (2026-07-10)

MINOR — bundles **SPRINT-020** (mattpocock-scan keepers + a `/council` divergence probe).

**What changed for you:**
- **Skill-powered execution dispatch** (ADR-010 amendment): when `/orchestrator` dispatches execution
  work to a sub-agent, it now hands the sub-agent the relevant **procedure skill** (`/tdd` · `/diagnose` ·
  `/refactor-advisor`, invoked at runtime via the Skill tool) instead of a re-described prose brief — the
  skill is the maintained procedure, so it can't drift. Stays agent-free (no agent definitions; runtime
  invocation on a `general-purpose` sub-agent).
- **Standards-vs-Spec review split:** review guidance now separates two independent axes — Standards
  (repo conventions) vs Spec (builds the *right thing*) — reported without merging, so neither masks the other.
- **expand–contract** named for wide refactors in `/refactor-advisor` (add-new alongside old → migrate in
  batches → remove old).

**Maintainer-side only:** a 1× `/council` probe (TASK-048) measured that its single-model personas diverge
on *framing* but not on shared *factual* priors — recorded in `docs/research/council-improvements.md`; it
reframes the deferred multi-model backend (TASK-047) toward a BYO-provider, opt-in, disabled-by-default shape.

Manifests → 1.9.0 lockstep; skill roster unchanged (14). Additive — nothing to migrate.

---

## v1.8.0 — Model Tiers (2026-07-10)

MINOR — bundles **SPRINT-019** (implements ADR-010).

**What changed for you:** the model-tier doctrine (`.claude/CONTEXT.md`) is now **role-based and
remappable**, routed by task *nature* not size ("ambiguity & consequence up, volume & repetition down"):
`decision`→Opus · `execution`→Sonnet · `mechanical-ingest`→Haiku. It governs the models lean-flow
**dispatches** (the session model stays your choice — advisory only); an **undefined role falls back to
the next-strongest defined role**, so a repo without a given model still runs. The strongest model is a
**manual** escalation (no auto-ladder — that's agent behaviour lean-flow won't own). Rationale +
alternatives → **ADR-010**.

Manifests → 1.8.0 lockstep; skill roster unchanged (14). Additive — nothing to migrate.

---

_Older releases (**v1.7.1** and earlier) → [`docs/changelog/CHANGELOG-1.7.1.md`](changelog/CHANGELOG-1.7.1.md)._
