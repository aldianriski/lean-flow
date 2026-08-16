---
owner: Maintainer
last_updated: 2026-07-10
status: current
id: brainstorming-adaptation
tags: [process]
domain: governance
related: []
---

# obra `brainstorming` skill — adaptation scan (TASK-050)

Evaluate the obra *superpowers* `brainstorming` skill
([github.com/obra/superpowers](https://github.com/obra/superpowers) · `skills/brainstorming/SKILL.md`)
for adoption. It encodes a **design-before-implementation gate**: raw idea → structured dialogue →
approved written spec, with a `<HARD-GATE>` blocking any implementation until the design is approved.
**Evaluate-first per curated-not-copied** (owner call at intake) — do not build wholesale.

## Verdict summary

**Do NOT add a standalone `brainstorming` skill — ~90% duplicates existing lean-flow surface.** Its
discipline (gate design before build, one question at a time, options-with-a-recommendation,
decompose big scope, YAGNI, spec self-review) is already distributed across G2, `/task-decomposer`,
`/prototype`, and `/council`. **2 micro-keepers** are worth folding into what we have; the visual
companion (a browser mockup server) is rejected as heavy scaffold against the agent-free/no-scaffold
ethos. **1 follow-up filed: TASK-058.**

## Already covered (why no new skill)

| brainstorming technique | lean-flow already has it |
|---|---|
| Hard gate: no implementation before approved design | **G2 Design gate** (human sign-off) + SPRINT-015 T1 build-behind-sprint gate |
| One clarifying question at a time | `/task-decomposer` grill + SPRINT-015 T3 **AskUserQuestion popup** discipline |
| Propose 2-3 approaches, lead with a recommendation | G2 "approach chosen over alternatives + WHY"; `/council` for hard forks |
| Explore project context / respect existing patterns | `/prime` + G1 recon (`Explore`) + "surgical changes" guideline |
| Scope-triage → decompose big requests, one cycle each | `/task-decomposer` vertical slices + "L splits" at G1 |
| Design-for-isolation (small interface, hidden internals) | `/refactor-advisor` (deepening / seams) |
| Spec self-review (placeholders/contradiction/ambiguity/scope) | `/orchestrator` self-review + close Retro |
| YAGNI / strip unnecessary features | CLAUDE.md **laziness ladder** |
| Written spec doc, committed | `/lean-doc-generator` (ADR / sprint / research) |
| `writing-plans` as the sole downstream | native `/plan` + `/orchestrator` implement routing |
| Visual companion — browser server serving HTML mockups | `/prototype` (throwaway UI to *feel* a design) — leaner; the server (`server.cjs`, scripts) is **rejected scaffold** |

## Keepers (ADAPT → folded, not imported)

| # | brainstorming source | Idea (slimmed) | Where it lands |
|---|---|---|---|
| K1 | "Too simple to need a design" **anti-pattern** block | Explicitly name + pre-empt the rationalization for skipping design on a "simple" task — the exact excuse behind decompose→build-unrecorded (SPRINT-015 T1) | a **red-flag** in `/orchestrator` (G2) and/or CLAUDE.md anti-patterns |
| K2 | Section-by-section design approval | Present a non-trivial design in discrete chunks (approach · components · data flow · errors · testing) and confirm each, vs one monolithic sign-off | a one-line note in `/orchestrator` G2 (offer chunked approval for L designs) |

## Rejects

- **A standalone `brainstorming` skill** — duplicates G2 + `/task-decomposer` + `/prototype` +
  `/council`; adding it violates curated-not-copied (a 15th skill covering owned ground).
- **Visual companion server** (`server.cjs`, `start/stop-server.sh`, `frame-template.html`) — a running
  local web server + scripts is exactly the scaffold lean-flow refuses; `/prototype` covers "feel the
  design" without a resident process.
- **`docs/superpowers/specs/…` + `.superpowers/` conventions** — lean-flow already has doc placement
  (STANDARD §2); no second convention.
- **`writing-plans` / `elements-of-style` sub-skill dependencies** — external skill graph; native
  `/plan` and the doc standard cover it.

## Follow-up filed

- **TASK-058** (P3) — fold K1 (+ K2) into `/orchestrator` G2 / CLAUDE.md anti-patterns. Small, additive,
  clears the useful+important+used bar (the "too simple" excuse is a real recurring failure). Nothing
  else from this skill is built.
