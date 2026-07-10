---
owner: Maintainer
last_updated: 2026-06-21
update_trigger: Skill roster, the loop, gates, modes, or tiers changed
status: current
---

# lean-flow — CONTEXT

Single source of truth for the loop, roster, gates, modes, tiers, and sprint model. README and
CLAUDE.md defer here; this file points to their prose rather than duplicating it (cap: ADR-007).

## The loop

`/prime → /lean-doc-generator → /orchestrator → repeat` · session end → `/handoff` (temp-dir doc) → next `/prime` reads it.
Every skill works standalone; the loop is just the order they reward most together. (Diagram → README.)

## Skill roster (14 — 12 stage-skills · 1 conductor · 1 decision aid)

| Skill | Role | One-line purpose |
|---|---|---|
| `/flow` | **conductor** | opt-in — drives the whole loop, calling stage-skills in sequence; enforces gates + governance, never auto-approves |
| `/prime` | entry | ordered context load + health check (read-only) |
| `/lean-doc-generator` | plan | WHY/WHERE docs · ADRs · sprint promote/close · **migrate** (adopt + clean) · **init** (scaffold fresh) — bundles templates + standard |
| `/orchestrator` | build | gate-driven execution — `quick` · `mvp` · `sprint-bulk` |
| `/task-decomposer` | feed | intent / ticket / PRD → `TASK-NNN` entries — **the detailed grill lives here** (intake) |
| `/triage` | groom | re-prioritise + state the Backlog; flag stale/dupe/conflict; route rejects to `.out-of-scope/` |
| `/prototype` | explore | throwaway code to answer one design question; capture → ADR/PRD, delete |
| `/tdd` | test-first | build NEW behaviour test-first — vertical-slice red-green-refactor |
| `/diagnose` | fix | 6-phase systematic debugging with a regression test |
| `/refactor-advisor` | deepen | find shallow→deep refactors (seams, deletion test); design the deepening |
| `/release-patch` | ship | manifest-detect PATCH bump + changelog; stops before push |
| `/handoff` | continuity | compact the conversation → temp-dir doc for the next session |
| `/insights` | learn | anytime — a friction → an `L-NNN` candidate in `LEARNINGS` (or bump a match's `count`); complements the Sprint-Close Retro |
| `/council` | decide | **opt-in, agent-using** — pressure-test a hard call via 5 advisors + peer review → `verdict-<slug>.md` → ADR |

**Grill** at intake (`/task-decomposer`); G2 re-grills residuals (an unconfirmed assumption blocks G2).
**Implement routing** (`/orchestrator`): new behaviour→`/tdd` **(default, test-first)** · bug→`/diagnose` · hard-to-change→`/refactor-advisor` · docs/spike→direct.
`/prototype` feeds design (can't resolve on paper → fold into G2 + ADR); `/council` feeds a hard fork → verdict → ADR §4.

## Built-in leverage

lean-flow ships **no agents/hooks** — it dispatches Claude's built-ins in **isolated passes** (fresh
context): recon→`Explore` · `/code-review` (small/med → one scoped `sonnet`) · `/verify` ·
`/security-review` · `/council` (internal sub-agents); commands `/goal /plan /batch /loop /run /simplify
/fork`. Full wiring + cloud tools out of lean scope (`/workflows` · `/ultracode` · `/ultraplan` /
`/ultrareview`) → ARCHITECTURE.md § Key integration points.

**Standalone contract** — stage-skill cross-refs are routing *suggestions* (`→ /X`), never requirements;
each completes its job invoked cold. Only inherent ordering: the sprint lifecycle. **`/flow` is the sole
exception** — it *sequences* the stages, never re-implements one. **Feed pipeline:** `/task-decomposer`
→ `/triage` → `/lean-doc-generator promote` → `/orchestrator`.
**Bug intake:** a bug (`BUG.md.template`) enters at `/triage` → trivial known cause = `TASK` · needs investigation = `/diagnose` · architectural = `TD-NNN`.

**Curated, not copied** — review, not a feature ban; cleared "useful **and** important **and** actually used" (full rationale → CLAUDE.md · ADR-001).

## Gates

| Gate | Name | Where | Checks |
|---|---|---|---|
| G1 | Scope | all `/orchestrator` modes | goal restated · size S/M/L (L splits) · files/blast-radius · out-of-scope named · assumptions confirmed |
| G2 | Design | `mvp` · `sprint-bulk` | approach + WHY · verifiable micro-tasks · ADR if hard-to-reverse · **overlap-ownership map** (shared files → single owner + commit order, before first task) · residual grill until unambiguous |

Humans approve gates — the skill never self-approves. Review is a self-review checklist (no review agent).

## Modes (`/orchestrator`)

| Mode | Gates | Use when |
|---|---|---|
| `quick` | G1 | single small low-risk task |
| `mvp` | G1 + G2 | feature work, medium+, multi-step |
| `sprint-bulk` | G1+G2 once | auto-loop the Active Sprint task list |

## Model tiers (dispatch discipline · ADR-010)

Route by **nature, not size — ambiguity & consequence up, volume & repetition down**. lean-flow controls
only the models it **dispatches** on (Agent-tool `model:`); the session model is advisory (the installer's).
**Role-based + remappable** — undefined role → next-strongest defined (a repo lacking a model still runs).

| Role (default) | Fires on |
|---|---|
| `decision` → **Opus** *(session · advisory)* | gates · grill · design · synthesis · review judgment · council chairman |
| `execution` → **Sonnet** *(dispatched)* | implement · recon (`Explore`) · council advisors + review · research |
| `mechanical-ingest` → **Haiku** *(dispatched)* | bulk extraction · validation · triage · high-volume reads |

**Fable = manual escalation, no dispatch row** — invoke by hand when execution fails twice or a fork is ADR-grade (opt. `/council`); **no automated ladder** (a fail point may dispatch a built-in — never a hook). Contract: spawn-with-brief; G1/G2 + review guard quality. Full doctrine → ADR-010.

## Sprint model

- **`TODO.md`** = Backlog pool (P0–P3) + Tech Debt; `/triage` grooms it; § Active Sprint is a pointer.
- **`docs/sprint/SPRINT-NNN-<slug>.md`** = the active sprint (`SPRINT.md.template`): Theme · Scope · Plan (Tn + **DoD `[ ]`**) · Owner-action · Decisions→ADR · Assumptions · **Execution Log** (append-only; plan frozen at promote — a mid-sprint scope shift logs a `scope-change`: what broke · impact · re-confirm G2, before editing the Plan) · Files Changed · **Retro** (§10).
- Flow: `promote` renders the sprint (sets `plan_commit`) → `sprint-bulk` loops the DoD → execute appends to the Log → `close` writes the Retro, routes buckets, sets `close_commit`. `/prime` counts open DoD.
- **Streams** (optional) — parallel streams run one active sprint *each* (`stream:` frontmatter · one pointer per stream); cross-stream file overlap → coordinate, never parallel-build — and **at commit** stage shared files per-hunk (`git add -p` + verify `git diff --cached`), never a plain `git add <shared>` over another stream's WIP (contaminates at the commit phase, not just merge — L-042). Single-stream omits `stream:`.

## Doc standard

LEAN DOCUMENTATION STANDARD (WHY/WHERE, never HOW) → `skills/lean-doc-generator/references/DOCS_Guide.md`; templates → `…/templates/`.
Domain glossary lives **here** (canonical term + `_Avoid_:` synonyms). ADRs only when hard-to-reverse **and** surprising **and** a real trade-off (§4).

## Orientation

Where-things-live = **`ARCHITECTURE.md`**; no hand-maintained codemap (it rots — LAW 3). graphify: not
integrated/depended-on — an on-demand option for onboarding or a pre-refactor audit (verdict →
`docs/research/graphify-daily-value.md`). No MCP required.

## Continuous learning governance

Every iteration feeds the next (DOCS_Guide §10). **Close** Retro auto-files four buckets: Shipped→CHANGELOG ·
Tech debt→`TD-NNN` · Follow-ups→`TASK-NNN` · Learnings→`L-NNN`. **Promote** checkpoint: promote any `L-NNN`
(`count ≥ 2, promoted: no`) → durable rule (CLAUDE anti-pattern · CONTEXT rule · skill red-flag); age TD
(≥3 sprints → re-review; `high`→P1); doc-aging §11. Propose → approve, never silent.
Learnings + ADRs + research carry ADR-009 metadata; the by-tag/-domain index is **generated** corpus-wide into `docs/knowledge-index.md` (`scripts/gen-index.sh`), lint-checked by `qa-check.sh`.

## Task entry shape

```
- [ ] TASK-NNN — <verb-first title>  [size: M] [risk: med] [HITL|AFK]
      done-when: <observable outcome>
      touches:   <files / layers>
      assumes:   <key assumptions, or none>
      tracker:   <ticket URL, or none — justification>
      state:     ready | needs-info | blocked   (Backlog only; set by /triage)
```

**States** — `ready` (promotable) · `needs-info` (open questions) · `blocked` (`depends-on`). Orthogonal
to `HITL`/`AFK` (who acts). Rejected work → `.out-of-scope/<slug>.md` (lazily created by `/triage`).
**QA (optional, never a gate)** — a task may note a `qa:` hint (tests/lint/security/perf to suggest at Review) — a suggestion for the owner, not a requirement.
