# lean-flow — AI Context

## Project Overview
- **Name**: lean-flow
- **Type**: Claude Code plugin · lean skill library
- **Stack**: Markdown · Claude Code skills system
- **Architecture**: Plugin-first — components at repo root per the Claude Code plugin spec. Skills-first: no hooks, no scaffold, **no agent definitions of its own** — the loop dispatches Claude's built-in agents (`Explore` · `/code-review` · `/verify` · `/security-review`) at key steps; `/council` is the one skill that orchestrates sub-agents internally.

## File Structure
```
.claude-plugin/
  plugin.json        # plugin manifest (lockstep version with marketplace.json)
  marketplace.json
skills/              # 14 SKILL.md files (plugin auto-discovers)
  flow/    prime/   lean-doc-generator/  orchestrator/  task-decomposer/  triage/
  prototype/  tdd/  diagnose/  refactor-advisor/  release-patch/  handoff/  insights/  council/
  #  flow = opt-in conductor · 12 standalone stage-skills · council = opt-in agent-using decision aid
  lean-doc-generator/
    references/DOCS_Guide.md      # the LEAN DOCUMENTATION STANDARD
    templates/*.md.template       # 14 canonical doc templates (core, incl. SPRINT · ADR · RESEARCH · DEPLOY · BUG)
  tdd/references/testability.md          # what to mock · design-for-testability · refactor candidates
  diagnose/references/feedback-loops.md  # 10 ways to build a loop · determinism · perf
  task-decomposer/references/prd-and-slices.md  # PRD template · tracer-bullet slices · breakdown quiz
  refactor-advisor/references/deepening.md      # seam/depth vocab · dependency categories · design-it-twice
  prototype/references/{logic,ui}.md            # throwaway TUI over a portable module · web UI variants
.claude/
  CLAUDE.md          # this file — project shape for maintainers
  CONTEXT.md         # vocabulary · the loop · gates · modes (single source of truth)
README.md            # full front-door (no line cap)
```

## The loop
`/prime → /lean-doc-generator → /orchestrator → repeat`. `/handoff` ends a session; `/prime`
resumes it. Every skill is also usable standalone. See `.claude/CONTEXT.md` for the roster.

## Design Principles
- **Curated, not copied** — the core discipline. Every component was reviewed ("genuinely useful + important + actually used?") and approved before adding. The opposite of dev-flow, which bulk-imported from every reference and bloated. The bar is review — not a ban on any component type.
- **Lean** — each SKILL.md ≤ ~110 lines of **procedure + scaffolding**; executable artifacts (prompt templates, persona/advisor definitions, schemas) live in the skill's own `references/` and don't count (ADR-006). No shared reference trees *across* skills.
- **Self-contained** — gates/checklists inlined; `lean-doc-generator` bundles its own templates + standard.
- **Adaptable** — skills read whatever context the host repo has and degrade gracefully when a file is missing.
- **Human-gated** — G1 Scope + G2 Design need explicit sign-off; `release-patch` never pushes.

## Anti-Patterns
❌ Adding *anything* unreviewed — copied wholesale from a reference, or added "just in case" (the dev-flow mistake that bloated its docs). Every addition clears the bar first: genuinely useful **and** important **and** actually used. Agents/hooks aren't banned — they're held to that same bar (`/council` cleared it; nothing's been bulk-imported).
❌ A core doc generated without reading its template (`lean-doc-generator` Step 6 is mandatory).
❌ HOW content in a doc — move it to a code comment.
❌ Skill count or the loop changing without updating `.claude/CONTEXT.md` + README.
❌ `git push` inside `release-patch` — it stops at the gate, always.
❌ Shipping a new behaviour **spec-only** — a new capability's final DoD must be *exercised once on real input* (the spec-only-debt trap: TD-001 · SPRINT-004 T3/T5 → L-007).
❌ `git add <shared-file>` while another stream/task has WIP in it — stages their uncommitted work into your commit (contaminates at the **commit** phase, not just merge → mis-attributed, hard-to-reverse history). Serialize the stream, or `git add -p <shared>` + verify `git diff --cached` first (L-042 · cf. L-037: overlap locked at G2).

## Naming Conventions — files: kebab-case

## Definition of Done
- [ ] Acceptance criteria met
- [ ] `.claude/CONTEXT.md` + README updated if the skill roster or the loop changed
- [ ] plugin.json + marketplace.json versions stay equal (lockstep)
- [ ] Line caps respected: SKILL.md ≤ ~110 (procedure + scaffolding; artifacts → `references/`, uncounted — ADR-006) · CLAUDE.md ≤ 80

## Behavioral Guidelines
- **Think before acting** — surface assumptions; ask on ambiguous requirements; never fabricate. Multiple interpretations? Present them — don't pick silently. Push back when a simpler approach exists.
- **Simplicity first** — minimum content that satisfies the goal; no speculative sections. If it reads overcomplicated, rewrite it shorter.
- **Surgical changes** — touch only what the task requires; match adjacent style. Clean up only your own mess — **don't delete pre-existing content/sections you didn't touch; mention them instead**. Every changed line traces to the request.
- **Goal-driven** — restate the task as a verifiable goal before acting; for multi-step work, a brief plan with a check per step, loop until verified.
- **Concise reporting** — terse by default (status/verify/lists); full sentences only where a caveat or tradeoff is load-bearing; drop filler, never connectives.
