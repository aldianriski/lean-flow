---
owner: Maintainer
last_updated: 2026-07-17
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.11.0 — Loop Hygiene & Wiring (2026-07-17)

MINOR — bundles **SPRINT-024** (every hygiene rule gets a matcher; the claimed loop wirings actually fire).

**What changed for you:**
- **Hygiene is now enforced, not remembered** — `qa-check.sh` grew 49→56 checks (README-footer-vs-manifest version · ownership headers incl. CLAUDE.md + README's footer line · TD aging past 3 sprints · temp-dir tracker refs · hand-written cap snapshots · TODO breadcrumb comments · unresolvable L-NNN citations); `gen-index.sh` now stamps its own `last_updated`.
- **Close + promote gained propose→approve sweeps** — close removes shipped Backlog entries outright (no breadcrumb comments ever; history = CHANGELOG + sprint archive) and scrubs stale sprint refs; promote emits its §10 governance review as an owner-signed checklist before rendering.
- **Feed pipeline wired end-to-end** — `/triage` implements bug-intake (BUG → TASK · `/diagnose` · TD); promote pulls `state: ready` only; `/prime` routes an ungroomed backlog to `/triage`; G1 gets a fast-path for decomposer-approved tasks (rule stated in orchestrator + decomposer + CONTEXT); `/fork` dropped from the built-ins list.
- **Knowledge integrity** — `L-NNN` ids are monotonic and never reused (retired-ids ledger; next id continues from highest-ever); broken/dangling citations in shipped skills corrected; council verdicts referenced by durable docs must be archived to `docs/research/verdict-*.md`.
- **Format standard** — canonical SKILL.md skeleton documented (DOCS_Guide) and all 14 skills conform; ADR/RESEARCH templates carry ADR-009 metadata; BUG is core template row 14 (14 core +2 non-core = 16, counts reconciled); README modes table deduplicated to a CONTEXT pointer (ADR-007); **README.md.template rewritten as a showcase-grade front-door** (guide-not-gate: hero · why · quick start · features · docs map; anti-SSOT rule; README=human · CLAUDE/CONTEXT=agent).

Audit + rationale → `docs/research/loop-hygiene-prd.md`. Manifests → 1.11.0 lockstep; skill roster unchanged (14). Additive — nothing to migrate.

---

## v1.10.2 — Dispatch & Parallelization (2026-07-10)

PATCH — bundles **SPRINT-023** (makes the dispatch doctrine actually operate).

**What changed for you:** `/orchestrator` now genuinely *dispatches* and *parallelizes* execution instead of doing it all inline —
- it acts as the `decision`-tier **coordinator** and **dispatches** `execution`→Sonnet / `mechanical`→Haiku work to sub-agents **by each task's classification** (route by *nature*, not size), each handed its procedure skill;
- `sprint-bulk` now **decides parallel vs sequential** from the overlap map — independent tasks (no shared file, no `depends-on`) fan out in parallel; shared/dependent run sequentially;
- the dispatching skills (`orchestrator`·`council`·`flow`) list `Agent, Task` in `allowed-tools`, so dispatch **auto-approves** instead of stalling on a per-spawn permission prompt.

Full rules → `skills/orchestrator/references/dispatch.md`; doctrine → **ADR-010** (2nd amendment). It's a strong *default*, not a guarantee (prompt-driven ceiling) — for deterministic large fan-out use `/batch`·`/workflows`.

**Note:** if a prior version seemed to "not spawn," your session was likely running a **stale cached skill** — restart Claude Code so it loads the current version (L-021).

Manifests → 1.10.2 lockstep; skill roster unchanged (14). Additive — nothing to migrate.

---

## v1.10.1 — Wiring Pass (2026-07-10)

PATCH — bundles **SPRINT-022** (wiring fixes; no new capability).

**What changed for you:** the v1.9.0/v1.10.0 additions now actually *fire* across the loop —
- execution dispatch **hands the sub-agent its procedure skill** (the "Dispatch by role" note is now wired into every Implement step, not orphaned from it);
- a dispatched code reviewer is **told to report Standards vs Spec separately** (the two-axis split is injected into the reviewer's brief, not just documented);
- **foggy intent routes to the fog-map mode** from both `/orchestrator` and the `/flow` conductor (previously it self-triggered only inside `/task-decomposer`).

**Maintainer-side only:** new discipline codified — a CLAUDE.md anti-pattern + a DoD "Wiring check" (**L-020**): shipping a capability ≠ wiring it; a new behaviour must be connected into every job that triggers/chains it and verified to fire.

Manifests → 1.10.1 lockstep; skill roster unchanged (14). No behaviour change beyond the wiring — nothing to migrate.

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
