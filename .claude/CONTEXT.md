---
owner: Maintainer
last_updated: 2026-06-09
update_trigger: Skill roster, the loop, gates, or modes changed
status: current
---

# lean-flow — CONTEXT

Single source of truth for vocabulary, the loop, gates, and modes. README and CLAUDE.md defer here.

## The loop

```
  /prime ──▶ /lean-doc-generator ──▶ /orchestrator ──┐
   load           plan & document        build, gated │
     ▲                                                 │
     └──────────────── repeat ◀────────────────────────┘

  session end → /handoff  (temp-dir doc)  → next session /prime reads it
```

Every skill is independently usable; the loop is just the order they reward most together.

## Skill roster (13 — 11 stage-skills · 1 conductor · 1 decision aid)

| Skill | Role | One-line purpose |
|---|---|---|
| `/flow` | **conductor** | opt-in — drives the whole loop, calling the stage-skills in sequence; enforces gates + governance, never auto-approves |
| `/prime` | entry | ordered context load + health check (read-only) |
| `/lean-doc-generator` | plan | WHY/WHERE docs · ADRs · sprint promote/close · **migrate** existing docs to the standard — bundles its templates + standard |
| `/orchestrator` | build | gate-driven execution — `quick` · `mvp` · `sprint-bulk` |
| `/task-decomposer` | feed | intent / ticket / PRD → `TASK-NNN` backlog entries |
| `/triage` | groom | re-prioritise + state the Backlog; flag stale/dupe/conflict; route rejects to `.out-of-scope/` |
| `/prototype` | explore | throwaway code to answer one design question (logic TUI / web UI variants); capture → ADR/PRD, delete |
| `/tdd` | test-first | build NEW behaviour test-first — vertical-slice red-green-refactor |
| `/diagnose` | fix | 6-phase systematic debugging with a regression test |
| `/refactor-advisor` | deepen | find shallow→deep refactors (seams, deletion test); design the deepening |
| `/release-patch` | ship | manifest-detect PATCH bump + changelog; stops before push |
| `/handoff` | continuity | compact the conversation → temp-dir doc for the next session |
| `/council` | decide | **opt-in, agent-using** — pressure-test a hard/ambiguous call via 5 advisors + peer review → `verdict-<slug>.md` → feed an ADR |

`/prototype` feeds the design stage: when `/orchestrator`'s Grill can't resolve a design on paper, prototype → fold the verdict into G2 + an ADR. `/council` feeds the decision stage: a hard-to-reverse / ambiguous call → pressure-test → `verdict-<slug>.md` → record as an ADR (§4).

**Implement routing** (from `/orchestrator`): new testable behaviour → `/tdd` · bug / failing test → `/diagnose` · hard-to-change code → `/refactor-advisor` · docs/config/spike → direct.

**Built-in leverage** — lean-flow ships **no agent definitions**; it leans on Claude Code's built-in agents *and* commands, so it duplicates nothing.

*Built-in agents* (dispatched in an **isolated pass**, not inline — fresh context + lean main loop): recon (mature/unfamiliar code) → `Explore` · review (non-trivial diff) → `/code-review` · verify behaviour → `/verify` · security (auth/input/secrets) → `/security-review` **as its own uncontaminated pass**. (`/council` is the one skill that orchestrates sub-agents *internally*.)

*Built-in commands* wired at loop points:
- `/goal <condition>` — drive across turns until met → set it to the DoD/acceptance at `/orchestrator` execution + `/flow` (Goal-Driven Execution, native).
- `/plan` — plan mode at the **G2 Design** gate.
- `/batch <instruction>` — parallel worktree execution for **large, disjoint `sprint-bulk`** runs (decompose → unit-per-subagent → PR each). The native parallel engine; `/workflows` watches it.
- `/loop [interval]` — `sprint-bulk` iteration + **periodic governance** (drift / learnings review; `.claude/loop.md`).
- `/run` + `/verify` — drive + confirm the app at **Review**.
- `/simplify` — cleanup-only pass alongside `/refactor-advisor`.
- `/fork` / `/background` — the mechanism for the isolated recon/review passes above.

Out of lean scope (too heavy): authoring full custom `/workflows`, `/ultracode` auto-orchestration, `/ultraplan` / `/ultrareview` (cloud, billed).

**Standalone contract** — every cross-reference between the **stage-skills** is a routing/handoff *suggestion* (`→ /X`), never a requirement; each completes its own job when invoked cold. The pipeline + routing are the optimal composition, not a dependency graph. Only inherent ordering: the sprint lifecycle (`promote` → execute → `close`). Keep it this way — a *stage-skill* that needs another to function breaks the contract. **`/flow` is the sole exception**: as the conductor it depends on the stages by design — but it only *sequences* them (calls each standalone skill), never re-implements a stage. So: à la carte (any skill alone) **or** conducted (`/flow` runs the lot).

**Feed pipeline**: `/task-decomposer` (intake) → `/triage` (groom + re-prioritise) → `/lean-doc-generator promote` (form sprint) → `/orchestrator` (build).

**Curated, not copied** — lean-flow's discipline is *review*, not a feature ban. dev-flow was brutal
copy-everything-from-every-reference → doc/skill bloat. Here, every component was reviewed against
"genuinely useful **and** important **and** actually used", and approved before adding. The bar is the
review, not a rule against agents or hooks. So: the core loop is agent-free and there are no hooks —
**because none earned their place yet**, not because they're forbidden. `/council` is in *because it
cleared the bar* (a reviewed, opt-in agent skill). Anything new — including a hook or another agent —
must clear the same bar first; never bulk-import from a reference.

## Gates

| Gate | Name | Where | Checks |
|---|---|---|---|
| G1 | Scope | all `/orchestrator` modes | goal restated · size S/M/L (L splits) · files/blast-radius · out-of-scope named · assumptions confirmed |
| G2 | Design | `mvp` · `sprint-bulk` | approach + WHY · verifiable micro-tasks · ADR if hard-to-reverse · grill until unambiguous |

Humans approve gates — the skill never self-approves. Review is a self-review checklist (no review agent).

## Modes (`/orchestrator`)

| Mode | Gates | Use when |
|---|---|---|
| `quick` | G1 | single small low-risk task |
| `mvp` | G1 + G2 | feature work, medium+, multi-step |
| `sprint-bulk` | G1+G2 once | auto-loop the Active Sprint task list |

## Sprint model

- **`TODO.md`** = the **Backlog pool** (P0–P3) + Tech Debt; `/triage` grooms it. Its § Active Sprint is just a pointer.
- **`docs/sprint/SPRINT-NNN-<slug>.md`** = the **active sprint** working doc (`templates/SPRINT.md.template`): Theme · Scope · Plan (Tn + **DoD `[ ]`**) · Owner-action · Decisions→ADR · Assumptions · **Execution Log** (append-only; plan frozen at promote) · Files Changed · **Retro** (routed per §10).
- Flow: `promote` renders the sprint file from the Backlog (sets `plan_commit`) → `sprint-bulk` loops its Plan DoD → execute appends to the Log → `close` writes the Retro, routes the buckets, sets `close_commit`. `/prime` counts open DoD in the active sprint file.

## Doc standard

The LEAN DOCUMENTATION STANDARD (WHY/WHERE, never HOW) lives in
`skills/lean-doc-generator/references/DOCS_Guide.md`; canonical templates in
`skills/lean-doc-generator/templates/`. The domain glossary lives in **`CONTEXT.md`** (this kind of file — opinionated canonical
term + `_Avoid_:` synonyms). ADRs are offered only when a decision is hard-to-reverse **and**
surprising **and** a real trade-off.

## Orientation / code mapping

Where-things-live = **`ARCHITECTURE.md`** (the durable, high-level map). lean-flow ships **no
hand-maintained codemap** — a granular manual map rots without a refresh hook (LAW 3). A granular,
queryable graph is **generated on demand, never hand-written**: if `graphify-out/graph.json` exists
(the user runs [graphify](https://github.com/safishamsi/graphify)), `/prime` may use it for
orientation — **optional, never a dependency**. No MCP / no external tool is required to run lean-flow.

## Continuous learning governance

Every iteration feeds the next (DOCS_Guide §10). At **Sprint Close**, the Retro auto-files four buckets:
Shipped → `CHANGELOG.md` · Tech debt → `TD-NNN` (TODO § Tech Debt) · Follow-ups → `TASK-NNN` (Backlog) ·
Learnings → `L-NNN` (`LEARNINGS.md`). At **Sprint Promote** (governance checkpoint):

- **Promote learnings** — any `L-NNN` with `count ≥ 2, promoted: no` → write it into a durable rule
  (a CLAUDE.md anti-pattern · a CONTEXT.md rule · a skill red-flag); mark `promoted: yes → <where>`.
- **Age tech debt** — any `TD-NNN` unaddressed ≥ 3 sprints → re-review; `severity: high` → auto P1.

## Task entry shape

```
- [ ] TASK-NNN — <verb-first title>  [size: M] [risk: med] [HITL|AFK]
      done-when: <observable outcome>
      touches:   <files / layers>
      assumes:   <key assumptions, or none>
      tracker:   <ticket URL, or none — justification>
      state:     ready | needs-info | blocked   (Backlog only; set/groomed by /triage)
```

**Task states** (Backlog) — `ready` (promotable) · `needs-info` (open questions) · `blocked`
(waiting on `depends-on`). Orthogonal to `HITL`/`AFK` (who acts). Rejected work leaves the backlog →
`.out-of-scope/<slug>.md` (negative-space knowledge base, created lazily by `/triage`).
