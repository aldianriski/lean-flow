---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: Question revisited, or the fleet epic (TASK-089) graduates a non-Claude consumer
status: current
id: agents-md-adoption
tags: [docs, tooling, process]
domain: skills
related: [fog-fleet-orchestration, okf-adoption]
---

# Research — should lean-flow adopt the AGENTS.md standard?

> **Question.** (a) Should `lean-doc-generator` emit an AGENTS.md template for consumer repos
> alongside CLAUDE.md/CONTEXT.md? (b) Should AGENTS.md be the brief carrier for non-Claude agents
> (codex/kimi/glm) in the future BYO fleet seam (`docs/research/fog-fleet-orchestration.md`)?
> **Verdict.** (a) **No, not now** — CLAUDE.md + CONTEXT.md already cover its content; a full
> parallel template duplicates, doesn't add. (b) **Yes, conditionally** — AGENTS.md is the one
> genuine gap on lean-flow's surface and is the right answer *if/when* the fleet epic graduates.

## Why this matters

TASK-089's fog-map lists "AGENTS.md as the brief carrier for non-Claude agents" as an open
decision ticket blocking graduation; this doc resolves it. Guessing wrong on (a) means either a
second authoring surface that drifts from CLAUDE.md/CONTEXT.md (maintenance debt), or missing a
cheap, low-risk consumer win (a repo running codex alongside Claude Code gets nothing today).

## Options considered

- **A — No adoption.** Status quo; AGENTS.md ignored entirely. *Trade-off:* zero cost, but leaves
  the fleet epic's brief-carrier ticket unresolved.
- **B — Full AGENTS.md authoring template**, added to `lean-doc-generator`'s optional set,
  duplicating CLAUDE.md/CONTEXT.md content. *Trade-off:* immediate non-Claude discoverability, but
  two hand-maintained sources of the same truth (violates LAW 4 signal-density).
- **C — Thin generated AGENTS.md stub** (a few lines pointing to `.claude/CLAUDE.md` +
  `.claude/CONTEXT.md`), offered at `init`/`migrate` once a non-Claude consumer need is real.
  *Trade-off:* near-zero duplication (derived view, not authored), but only useful once something
  actually reads it.
- **D — AGENTS.md as the fleet dispatch brief format** for non-Claude CLI agents, separate from
  doc generation — parallel to the Claude "spawn-with-skill" contract (ADR-010). *Trade-off:*
  fills a real gap (non-Claude agents have no Skill-invocation mechanism), but is fleet-epic scope,
  not buildable standalone.

## Findings

- **AGENTS.md is a plain-markdown, no-required-schema "README for agents"** — build/test/style/
  security/PR-convention sections, free-form headings, monorepo-nestable with closest-wins
  precedence. *Source:* agents.md (fetched 2026-07-29).
- **Every content category AGENTS.md proposes already has a lean-flow home.** Project
  overview/stack → `CLAUDE.md.template` §Project Overview + `CONTEXT.md.template` §Stack; build/
  test commands → `CLAUDE.md.template` §Commands; conventions/anti-patterns → both templates'
  §Anti-Patterns; PR/DoD conventions → `CLAUDE.md.template` §Definition of Done. *Source:*
  `skills/lean-doc-generator/templates/{CLAUDE,CONTEXT}.md.template`.
- **The unmatched remainder is filename discoverability, not content** — `CLAUDE.md` is a
  Claude-specific convention; nothing in lean-flow's surface is found by convention by a
  non-Claude tool. Native-AGENTS.md tooling is broad (Codex, Jules, Aider, Cursor, VS Code, Devin,
  Zed, Copilot, Warp, Gemini CLI, +20 more) and now anchored industry-wide — the Linux
  Foundation's Agentic AI Foundation (Dec 2025) lists AGENTS.md alongside MCP as a founding
  convention. *Source:* agents.md; web search, "State of CLI Coding Agents, Mid-2026".
- **kimi-cli ships its own AGENTS.md** (MoonshotAI/kimi-cli repo) confirming the convention is
  live for at least one of the three named fleet candidates; GLM 5.2's day-one compatibility is
  via Claude-Code/Cline/Goose API shims, not confirmed AGENTS.md reads — an open verification
  item if/when GLM joins the fleet. *Source:* github.com/MoonshotAI/kimi-cli/blob/main/AGENTS.md.
- **This is the same shape as the OKF-adoption call** (`docs/research/okf-adoption.md`) — an
  external standard that overlaps lean-flow's own corpus almost entirely, whose one real value
  (cross-tool portability) is a *generated derived view*, never an authoring format. Same
  resolution pattern applies. *Source:* `docs/research/okf-adoption.md`.
- **The dispatch contract has no non-Claude equivalent today.** ADR-010's "spawn-with-brief"
  hands a subagent its procedure via a runtime Skill invocation — a Claude-only mechanism. A
  non-Claude CLI agent needs a file-based brief instead, and AGENTS.md is the one file such
  agents already look for unprompted. *Source:* `.claude/CONTEXT.md` §Model tiers.

**Delta table**

| Candidate (AGENTS.md) | Existing lean-flow surface | Verdict |
|---|---|---|
| Free-form instructions content (build/test/conventions/DoD) | `CLAUDE.md.template` + `CONTEXT.md.template` | reject — duplicate |
| No-schema, bracket-placeholder looseness | Same posture already used in lean-flow's own templates | no delta |
| Nested per-directory AGENTS.md, closest-wins scoping | No analog — lean-flow's AI-context isn't subdirectory-scoped | reject — not lean-flow's model |
| Filename read natively by non-Claude CLI tools | Nothing — `CLAUDE.md` is Claude-only by convention | **keep (conditional)** — genuine gap |
| Cross-tool "de facto standard" portability | Same shape as OKF; resolved there as generated-export-only | reject full adoption — reuse OKF pattern (C) |
| File-based brief for agents with no Skill-invocation mechanism | Nothing — ADR-010's spawn-with-brief assumes Claude | **keep (conditional)** — feeds fleet seam |

## Recommendation

**(a) No — do not ship a full AGENTS.md authoring template now.** CLAUDE.md + CONTEXT.md already
carry 100% of its content categories; a second hand-maintained file duplicating them drifts
(LAW 4) for no consumer who's asked. **(b) Yes, conditionally** — AGENTS.md is the correct
brief-carrier for non-Claude fleet agents *when the fleet epic graduates a non-Claude consumer*;
it is the only convention on the table with zero existing lean-flow analog and a genuine wide
native-read footprint. Neither is buildable today: (a)'s trigger (a demonstrated non-Claude
consumer) and (b)'s trigger (TASK-089's consent-gate + dispatch-unit tickets resolving) haven't
fired. This resolves fog-fleet-orchestration.md's open "AGENTS.md as the brief carrier" ticket —
answer is **yes, deferred to fleet graduation**, not a rejection.

**Keeper proposals (NOT filed — proposals only):**
- *Proposed TASK* — Add an optional, generated (not hand-authored) AGENTS.md stub to
  `lean-doc-generator`'s `init`/`migrate` scope-interactive offering, pointing to
  `.claude/CLAUDE.md` + `.claude/CONTEXT.md` — gated on a real non-Claude consumer signal (mirrors
  the OKF-export "derived view" pattern). **NOT FILED.**
- *Proposed TASK* — When TASK-089 graduates the fleet's dispatch mechanism, define AGENTS.md as
  the file-based brief format for non-Claude CLI agents (parallel to the Claude spawn-with-skill
  contract) — scoped to TASK-089's build sprint, not standalone. **NOT FILED.**

## Out of scope / open questions

- GLM's actual AGENTS.md support is unconfirmed (only API-shim compatibility verified) — verify
  before the fleet build sprint if GLM is a target agent.
- Nested/per-directory AGENTS.md scoping (monorepo pattern) has no lean-flow use case today; not
  evaluated further.
- The consent-gate and dispatch-unit fog-map tickets (fog-fleet-orchestration.md) still gate
  whether/how the fleet seam is built at all — this doc only resolves the brief-carrier sub-question.
