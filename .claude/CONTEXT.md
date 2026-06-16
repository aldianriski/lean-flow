---
owner: Maintainer
last_updated: 2026-06-12
update_trigger: Skill roster, the loop, gates, modes, or tiers changed
status: current
---

# lean-flow — CONTEXT

Single source of truth for the loop, roster, gates, modes, tiers, and sprint model. README and
CLAUDE.md defer here; this file points to their prose rather than duplicating it (cap: ADR-007).

## The loop

`/prime → /lean-doc-generator → /orchestrator → repeat` · session end → `/handoff` (temp-dir doc) →
next `/prime` reads it. Every skill is independently usable; the loop is just the order they reward
most together. (Diagram: README.)

## Skill roster (13 — 11 stage-skills · 1 conductor · 1 decision aid)

| Skill | Role | One-line purpose |
|---|---|---|
| `/flow` | **conductor** | opt-in — drives the whole loop, calling stage-skills in sequence; enforces gates + governance, never auto-approves |
| `/prime` | entry | ordered context load + health check (read-only) |
| `/lean-doc-generator` | plan | WHY/WHERE docs · ADRs · sprint promote/close · **migrate** (adopt + clean) — bundles templates + standard |
| `/orchestrator` | build | gate-driven execution — `quick` · `mvp` · `sprint-bulk` |
| `/task-decomposer` | feed | intent / ticket / PRD → `TASK-NNN` entries — **the detailed grill lives here** (intake) |
| `/triage` | groom | re-prioritise + state the Backlog; flag stale/dupe/conflict; route rejects to `.out-of-scope/` |
| `/prototype` | explore | throwaway code to answer one design question; capture → ADR/PRD, delete |
| `/tdd` | test-first | build NEW behaviour test-first — vertical-slice red-green-refactor |
| `/diagnose` | fix | 6-phase systematic debugging with a regression test |
| `/refactor-advisor` | deepen | find shallow→deep refactors (seams, deletion test); design the deepening |
| `/release-patch` | ship | manifest-detect PATCH bump + changelog; stops before push |
| `/handoff` | continuity | compact the conversation → temp-dir doc for the next session |
| `/council` | decide | **opt-in, agent-using** — pressure-test a hard call via 5 advisors + peer review → `verdict-<slug>.md` → ADR |

**Grill placement:** detailed grill at intake (`/task-decomposer`); G2 re-grills residuals only (an
unconfirmed assumption blocks G2). **Implement routing** (`/orchestrator`): new testable behaviour →
`/tdd` · bug → `/diagnose` · hard-to-change → `/refactor-advisor` · docs/config/spike → direct.
`/prototype` feeds design (G2 can't resolve on paper → prototype → fold into G2 + ADR); `/council`
feeds decisions (hard/ambiguous fork → verdict → ADR §4).

## Built-in leverage

lean-flow ships **no agents/hooks**; it leans on Claude Code's built-ins, dispatched in **isolated
passes** (fresh context, lean main loop):
- *Agents:* recon → `Explore` · review → `/code-review` (large/high-risk; small/med → one scoped `sonnet` reviewer) · behaviour → `/verify` · security → `/security-review` (own uncontaminated pass). `/council` orchestrates sub-agents internally.
- *Commands:* `/goal` (drive-to-DoD at execution + `/flow`) · `/plan` (G2) · `/batch` (large disjoint `sprint-bulk` → worktree-per-unit; `/workflows` watches) · `/loop` (iteration + periodic governance) · `/run`+`/verify` (Review) · `/simplify` (cleanup) · `/fork`/`/background` (the isolated-pass mechanism).
- Out of lean scope (too heavy): custom `/workflows`, `/ultracode`, `/ultraplan` / `/ultrareview` (cloud, billed).

**Standalone contract** — stage-skill cross-refs are routing *suggestions* (`→ /X`), never requirements;
each completes its job invoked cold. Only inherent ordering: the sprint lifecycle. **`/flow` is the sole
exception** — it *sequences* the stages, never re-implements one. **Feed pipeline:** `/task-decomposer`
→ `/triage` → `/lean-doc-generator promote` → `/orchestrator`.

**Curated, not copied** — the discipline is *review*, not a feature ban; every component cleared
"useful **and** important **and** actually used" before adding. Full rationale: CLAUDE.md · ADR-001.

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

## Model tiers (token discipline)

Decide on the **session model**; dispatch bounded work to cheap-tier subagents — never switch mid-session.

| Work | Tier |
|---|---|
| Gates (G1/G2) · grill · design · synthesis · review *judgment* | **session model** (main loop) |
| Council advisors + peer review · recon (`Explore`) · well-specced *mechanical* edits | **cheap-tier** — `sonnet` (`opus` if reasoning-heavy) via Agent-tool `model:` |

**Contract — spawn-with-brief, never a mid-session switch.** Each dispatch carries a self-contained
brief (spec · files · acceptance — the AFK durable-spec rule); G1/G2 + the review pass guard quality.

## Sprint model

- **`TODO.md`** = Backlog pool (P0–P3) + Tech Debt; `/triage` grooms it; § Active Sprint is a pointer.
- **`docs/sprint/SPRINT-NNN-<slug>.md`** = the active sprint (`SPRINT.md.template`): Theme · Scope · Plan (Tn + **DoD `[ ]`**) · Owner-action · Decisions→ADR · Assumptions · **Execution Log** (append-only; plan frozen at promote) · Files Changed · **Retro** (§10).
- Flow: `promote` renders the sprint (sets `plan_commit`) → `sprint-bulk` loops the DoD → execute appends to the Log → `close` writes the Retro, routes buckets, sets `close_commit`. `/prime` counts open DoD.
- **Streams** (optional) — parallel streams run one active sprint *each* (`stream:` frontmatter · one pointer per stream); cross-stream file overlap → coordinate, never parallel-build — and **at commit** stage shared files per-hunk (`git add -p` + verify `git diff --cached`), never a plain `git add <shared>` over another stream's WIP (contaminates at the commit phase, not just merge — L-042). Single-stream omits `stream:`.

## Doc standard

LEAN DOCUMENTATION STANDARD (WHY/WHERE, never HOW) → `skills/lean-doc-generator/references/DOCS_Guide.md`;
templates → `…/templates/`. The domain glossary lives **here** (canonical term + `_Avoid_:` synonyms).
ADRs only when hard-to-reverse **and** surprising **and** a real trade-off (§4).

## Orientation

Where-things-live = **`ARCHITECTURE.md`**. lean-flow ships **no hand-maintained codemap** (it rots —
LAW 3) and **neither integrates nor depends on graphify** — a fine on-demand tool for onboarding an
unfamiliar repo or a pre-refactor audit (verdict: `docs/research/graphify-daily-value.md`). No MCP required.

## Continuous learning governance

Every iteration feeds the next (DOCS_Guide §10). **Sprint Close** Retro auto-files four buckets:
Shipped → `docs/CHANGELOG.md` · Tech debt → `TD-NNN` · Follow-ups → `TASK-NNN` · Learnings → `L-NNN`.
**Sprint Promote** checkpoint: promote any `L-NNN` (`count ≥ 2, promoted: no`) into a durable rule
(CLAUDE.md anti-pattern · CONTEXT rule · skill red-flag); age tech debt (≥3 sprints → re-review; `high`
→ auto P1); doc-aging (§11) — compress ledgers past a retention trigger. Propose → approve, never silent.

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
