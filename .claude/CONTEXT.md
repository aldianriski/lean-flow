---
owner: Maintainer
last_updated: 2026-07-30
update_trigger: Skill roster, the loop, gates, modes, or tiers changed
status: current
---

# lean-flow — CONTEXT

SSOT for the loop, roster, gates, modes, tiers, and sprint model. README and CLAUDE.md defer here; this file points to their prose rather than duplicating it (cap: ADR-007).

## The loop

`/prime → (/task-decomposer → /triage →) /lean-doc-generator promote → /orchestrator → repeat` · session end → `/handoff` (temp-dir doc) → next `/prime` reads it.
Every skill works standalone; the loop is just the order they reward most together. (Diagram → README.)

## Skill roster (14 — 12 stage-skills · 1 conductor · 1 decision aid)

| Skill | Role | One-line purpose |
|---|---|---|
| `/flow` | **conductor** | opt-in — drives the whole loop, calling stage-skills in sequence; enforces gates + governance, never auto-approves |
| `/prime` | entry | ordered context load + health check (read-only) |
| `/lean-doc-generator` | plan | WHY/WHERE docs · ADRs · sprint promote/close · **migrate** (adopt + clean) · **init** (scaffold fresh) — bundles templates + standard |
| `/orchestrator` | build | gate-driven execution — `quick` · `mvp` · `sprint-bulk` |
| `/task-decomposer` | feed | intent / ticket / PRD → `TASK-NNN` (or a **fog-map** when work's too foggy to plan) — **the detailed grill lives here** (intake) |
| `/triage` | groom | re-prioritise + state the Backlog; flag stale/dupe/conflict; route rejects to `.out-of-scope/` |
| `/prototype` | explore | throwaway code to answer one design question; capture → ADR/PRD, delete |
| `/tdd` | test-first | build NEW behaviour test-first — vertical-slice red-green-refactor |
| `/diagnose` | fix | 6-phase systematic debugging with a regression test |
| `/refactor-advisor` | deepen | find shallow→deep refactors (seams, deletion test); design the deepening |
| `/release-patch` | ship | manifest-detect PATCH bump + changelog; stops before push |
| `/handoff` | continuity | compact the conversation → temp-dir doc for the next session |
| `/insights` | learn | anytime — a friction → an `L-NNN` candidate in `LEARNINGS` (or bump a match's `count`); complements the Sprint-Close Retro |
| `/council` | decide | **opt-in, agent-using** — pressure-test a hard call via 5 advisors + peer review → `verdict-<slug>.md` → ADR |

**Grill** at intake (`/task-decomposer`); G2 re-grills residuals (an unconfirmed assumption blocks G2). **Implement routing** (`/orchestrator`):
new behaviour→`/tdd` **(default, test-first)** · bug→`/diagnose` · hard-to-change→`/refactor-advisor` · docs/spike→direct. `/prototype` feeds design (can't resolve on paper → fold into G2 + ADR); `/council` feeds a hard fork → verdict → ADR §4.

## Built-in leverage

lean-flow ships **no custom agents/hooks** — it dispatches Claude's built-ins in **isolated passes** (fresh context): recon→`Explore` ·
`/code-review` (small/med → one scoped `sonnet`; **Standards vs Spec** reported separately) · `/verify` · `/security-review` ·
`/council` (internal sub-agents); commands `/goal /plan /batch /loop /run /simplify`. Wiring → docs/architecture/overview.md § Key integration points.

**Standalone contract** — stage-skill cross-refs are routing *suggestions* (`→ /X`), never requirements; each completes its job
invoked cold. Only inherent ordering: the sprint lifecycle. **`/flow` is the sole exception** — it *sequences* the stages, never
re-implements one. **Bug intake** — a bug (`BUG.md.template`) enters at `/triage` → trivial known cause = `TASK` · needs investigation = `/diagnose` · architectural = `TD-NNN`.

**Curated, not copied** — review, not a feature ban; cleared "useful **and** important **and** actually used" (full rationale → CLAUDE.md · ADR-001).

## Gates

| Gate | Name | Where | Checks |
|---|---|---|---|
| G1 | Scope | all `/orchestrator` modes | goal restated · size S/M/L (L splits) · files/blast-radius · out-of-scope named · assumptions confirmed · decomposer-approved task → fast-path confirm (scope unchanged?) |
| G2 | Design | `mvp` · `sprint-bulk` | approach + WHY · verifiable micro-tasks · ADR if hard-to-reverse · `risk:high` on auth/input/secrets/data → one-line abuse-case sketch · **overlap-ownership map** (shared files → single owner + commit order, before first task) · residual grill until unambiguous |

Humans approve gates — the skill never self-approves; G1/G2 are inline, human-approved checklists. Review may dispatch an isolated built-in or ad-hoc subagent (`/code-review` et al.) — lean-flow ships no custom agent definitions.

**Unattended** (headless night-run) — charter **execute-only**: run a promoted Plan, decide nothing. **Declared** at trigger (`sprint-bulk unattended`), never inferred. **Absence ≠ consent**: headless has *no ask channel* (`AskUserQuestion` unregistered; `dontAsk` auto-denies) — missing channel/denial/timeout = BLOCK, never a default-yes, and never reason the answer out yourself.
A HITL step is **parked** (record → continue disjoint AFK → clean halt via `/handoff`), never asked, decided, or worked around; boundary derives from **AFK-safe = additive + reversible + already-approved-in-scope**; a gate is pre-signable only if its subject is frozen at pre-flight. Table + protocol → `orchestrator/references/night-run.md` Part 0.
**Prepare, then launch** — "run a night run for `<X>`" is compound: the *interactive* session runs feed → promote → pre-flight (gates and all) and fires the trigger only once pre-flight is green. A mode keyword never bypasses the feed pipeline, and the run is never spawned against an unpromoted Plan — step 0's guard sits inside the spawned process, too late to ask (Part 1a).

## Modes (`/orchestrator`)

| Mode | Gates | Use when |
|---|---|---|
| `quick` | G1 | single small low-risk task |
| `mvp` | G1 + G2 | feature work, medium+, multi-step |
| `sprint-bulk` | G1+G2 once | auto-loop the Active Sprint task list |

## Model tiers (dispatch discipline · ADR-010)

Route by **nature, not size — ambiguity & consequence up, volume & repetition down**. lean-flow controls only the models it **dispatches** (Agent-tool `model:`); the session model is advisory. **Role-based + remappable** — undefined role → next-strongest defined.

| Role (default) | Fires on |
|---|---|
| `decision` → **Opus** *(session · advisory)* | gates · grill · design · synthesis · review judgment · council chairman |
| `execution` → **Sonnet** *(dispatched)* | implement · recon (`Explore`) · council advisors + review · research |
| `mechanical-ingest` → **Haiku** *(dispatched)* | bulk extraction · validation · triage · high-volume reads |

**Fable = manual escalation, no dispatch row** — invoke by hand when execution fails twice or a fork is ADR-grade (opt. `/council`); **no automated ladder** (a fail point may dispatch a built-in — never a hook). Contract: spawn-with-brief — execution dispatch hands the subagent its **procedure skill** (runtime Skill invocation on a `general-purpose` agent), not a re-described brief; G1/G2 + review guard quality. Full doctrine → ADR-010; dispatch-by-classification + parallel/sequential + the **pre-dispatch preflight** (cycle · ownership · base-ref · waves) → `orchestrator/references/dispatch.md`.

## Sprint model

- **`TODO.md`** = Backlog pool (P0–P3); § Active Sprint is a pointer. **`TECH-DEBT.md`** (root) = the `TD-NNN` ledger — filed at close, aged at promote. `/triage` grooms both.
- **`docs/sprint/SPRINT-NNN-<slug>.md`** = the active sprint (`SPRINT.md.template`): Theme · Scope · Plan (Tn + **DoD `[ ]`**) · Owner-action · Decisions→ADR · Assumptions · **Execution Log** (append-only; plan frozen at promote — a mid-sprint scope shift logs a `scope-change`: what broke · impact · re-confirm G2, before editing the Plan) · Files Changed · **Retro** (§10).
- Flow: `promote` renders the sprint (sets `plan_commit`) → `sprint-bulk` loops the DoD → execute appends to the Log → `close` writes the Retro, routes buckets, sets `close_commit`. `/prime` counts open DoD.
- **Streams** (optional) — parallel streams run one active sprint *each* (`stream:` frontmatter · one pointer per stream); cross-stream file overlap → coordinate, never parallel-build. **Disjoint tasks may parallel-build in isolated worktrees** (one `Agent(isolation:"worktree")` per task + coordinator merge-back queue → `orchestrator/references/dispatch.md`); L-042's per-hunk staging rule (`git add -p` + verify `git diff --cached`, never a plain `git add <shared>` over another's WIP) binds **intra-tree** — one shared working tree, or the coordinator staging merge resolutions. Single-stream omits `stream:`.

## Doc standard

LEAN standard on the **TemiDev repo-structure core** (ADR-012; WHY/WHERE, never HOW) → `skills/lean-doc-generator/references/DOCS_Guide.md`: §2 lifecycle-bound core · §6 four-tier scaffold (cap-hit → split into tree) · §12 Git boundary; templates → `…/templates/` (30 core + 2 non-core). Domain glossary lives **here** (canonical term + `_Avoid_:` synonyms). ADRs only when hard-to-reverse **and** surprising **and** a real trade-off (§4).

## Orientation

Where-things-live = **`docs/architecture/overview.md`**; no hand-maintained codemap (it rots — LAW 3). graphify: not integrated — on-demand only, for onboarding or a pre-refactor audit (verdict → `docs/research/graphify-daily-value.md`).

## Continuous learning governance

Every iteration feeds the next (full rules → DOCS_Guide §10/§11). **Close** Retro auto-files four buckets: Shipped→CHANGELOG · Tech debt→`TD-NNN` ·
Follow-ups→`TASK-NNN` · Learnings→`L-NNN`. **Promote** checkpoint: promote any `L-NNN` (`count ≥ 2, promoted: no`) → durable rule (CLAUDE anti-pattern ·
CONTEXT rule · skill red-flag); age TD; doc-aging. Propose → approve, never silent. Learnings + ADRs + research carry ADR-009 metadata; the by-tag/-domain index is **generated** into `docs/knowledge-index.md`, lint-checked by `qa-check.sh`.

## Task entry shape

```
- [ ] TASK-NNN — <verb-first title>  [size: M] [risk: med] [HITL|AFK]
      class:     decision | execution | mechanical-ingest   (advisory default — dispatch may override, ADR-010)
      done-when: <observable outcome>
      touches:   <files / layers>
      depends-on: <TASK-NNN/Tn list, or none>
      assumes:   <key assumptions, or none>
      tracker:   <ticket URL, or none — justification>
      state:     ready | needs-info | blocked   (Backlog only; set by /triage)
```

**States** — `ready` (promotable) · `needs-info` (open questions) · `blocked` (`depends-on`). Orthogonal to `HITL`/`AFK` (who acts). Rejected work → `.out-of-scope/<slug>.md` (lazily created by `/triage`).
**QA (optional, never a gate)** — a task may note a `qa:` hint (tests/lint/security/perf to suggest at Review) — a suggestion for the owner, not a requirement.
