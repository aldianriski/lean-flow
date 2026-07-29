---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.13.0 — Fleet & Night-Run Build (2026-07-29)

MINOR — bundles **SPRINT-026** (the build sprint for v1.12.0's decisions).

**What changed for you:**
- **Parallel worktree dispatch is first-class in `sprint-bulk`** — disjoint sprint tasks now
  dispatch as worktree-isolated agents (one `Agent(isolation:"worktree")` per task, soft cap 3–5)
  with a coordinator-only **merge-back queue** (G2-order `--no-ff` per task, two-tier review,
  conflict + failure + cleanup paths incl. the Windows handle-lock and remote-base caveats) —
  `orchestrator/references/dispatch.md`, wired from the SKILL Sequence line and CONTEXT §Streams
  (L-042's per-hunk rule now binds intra-tree only).
- **Night-run is operational** — `orchestrator/references/night-run.md` ships the pre-flight
  checklist (all-AFK guard · zero open assumes · scoped `--allowedTools` build · `bypassPermissions`
  never) + the OS-scheduled headless trigger recipe (cron / Task Scheduler). Wired from the
  sprint-bulk Loop line. Watchdog + morning rollup land as TASK-098.
- Both capabilities were **exercised on the sprint's own wave** — the protocol dispatched and
  merged the very tasks that built it; the pre-flight guard correctly *refused* to arm an
  unattended run over HITL tasks.

Manifests → 1.13.0 lockstep; skill roster unchanged (14). Additive — nothing to migrate.

MINOR — bundles **SPRINT-025** (decide-before-build for two capability epics + a G2 security prompt).

**What changed for you:**
- **G2 now prompts a design-time abuse case** — a `risk: high` task touching auth / input /
  secrets / data-exposure gets a one-line abuse-case sketch at the Design gate (merged into the
  hard-to-reverse bullet, `orchestrator/SKILL.md`); complements — never replaces — the Review-time
  `/security-review` row. Exercised on a real high-risk task the day it shipped.
- **Fleet orchestration decided (not yet built)** — parallel worktree execution is fully
  de-fogged: dispatch unit = the sprint task, sequential merge queue in G2-ownership order,
  two-tier review, Claude-only v1; the merge path was prototyped end-to-end on Windows. Build
  lands as TASK-096. Decision record → `docs/research/fog-fleet-orchestration.md`.
- **Night-run mechanism chosen** — unattended overnight `sprint-bulk` via OS-scheduled headless
  `claude -p` with `dontAsk` + a scoped allowlist (never `bypassPermissions`); gates front-loaded,
  zero mid-run prompts. Build lands as TASK-097/098. → `docs/research/night-run.md`.
- **AGENTS.md verdict** — no hand-authored template (dupe/drift); a *generated* stub + AGENTS.md
  as the non-Claude brief carrier are parked until the fleet seam has a real consumer.
  → `docs/research/agents-md-adoption.md`.

Manifests → 1.12.0 lockstep; skill roster unchanged (14). Additive — nothing to migrate.

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

_Older releases (**v1.9.0** and earlier) → [`docs/changelog/CHANGELOG-1.9.0.md`](changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](changelog/CHANGELOG-1.7.1.md)._
