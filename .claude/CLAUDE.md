---
owner: Maintainer
last_updated: 2026-07-30
update_trigger: Project shape, anti-patterns, or conventions changed
status: current
---

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
    templates/*.md.template       # 31 canonical doc templates (core, incl. SPRINT/sprint-log/ADR/RESEARCH/DEPLOYMENT/ROLLBACK/BUG/TECH-DEBT/CONTRIBUTING/SECURITY/AGENTS/database-{erd,schema,migration-guide}/architecture-{data-flow,authentication,integrations}/product-{requirements,acceptance-criteria}/flows/testing-guide/development-coding-standards; +2 non-core: DESIGN·QA-TESTCASE = 33 total)
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
❌ A core doc generated without reading its template (`lean-doc-generator` Step 6 is mandatory); HOW content in a doc — move it to a code comment instead.
❌ Skill count or the loop changing without updating `.claude/CONTEXT.md` + README.
❌ `git push` inside `release-patch` — it stops at the gate, always.
❌ Shipping a new behaviour **spec-only** — a new capability's final DoD must be *exercised once on real input* (the spec-only-debt trap: TD-001 · SPRINT-004 T3/T5 → L-007); for a **gate** that is only half the bar — a gate is also exercised once on input that **must FAIL**, one fixture per check, each failing with its *named* finding, because a gate's worst failure is the silent false-negative that passes a real violation (L-058 ×2: proven live when one stripped guard clause made a shipped preflight report CLEAR on a real overlap). **Retain those fixtures** — deleting them with the prototype leaves the gate unguarded (TD-012).
❌ Edit-safety — four traps where **the report and the artifact disagree**: **(a)** `git add <shared-file>` while another stream/task has WIP in it — stages their uncommitted work into your commit (contaminates at the **commit** phase → mis-attributed history); serialize, or `git add -p <shared>` + verify `git diff --cached` (L-042 · L-037). **(b)** Trusting a **structure-adjacent Edit** — a markdown table-row / list-entry edit can silently fuse neighbouring entries while grep and line caps stay clean; re-read the whole structure after (L-009 ×3). **(c)** Trusting a command's **self-report** — an exit code or reply channel is evidence about the *reporter*, never the artifact: a gate piped into a formatter returns the formatter's status · a failed redirect reports non-zero before the gate ran · `commit` stores a mangled subject at exit 0 · a killed subagent reports failure over valid output already on disk. Non-zero with no report behind it is not a verdict; zero is not a pass — inspect what the command was meant to produce, and for a fan-out treat the per-unit output **file** as the signal (L-045 · L-049 · L-057 · L-059 · L-060, 5× / 4 sprints). **(d)** Trusting a **result across an environment boundary** — an env workaround is *inherited*, so it silently changes children it was never meant to reach, and the failure surfaces far from where it was set: `MSYS_NO_PATHCONV=1` (set so a `/skill` prompt isn't path-rewritten) propagated into the QA gate and broke `git -C`, producing a red gate on correct code that survived two wrong diagnoses. Scope a workaround to the one invocation needing it; when a check differs between two contexts, **diff the environments before the code** (L-067 ×2 · L-081).
❌ Letting an SSOT doc (`CONTEXT.md`) accrete duplication of its satellites until it nears its cap — run a periodic dedup pass (prose duplicating CLAUDE.md/README → pointers) at promote doc-aging (L-008 · TD-006).
❌ Plugin-cache traps (`~/.claude/plugins/cache/…`), both directions: **editing** it instead of the repo source (`skills/…`) — the cache is read-only output of `plugin install`, edits there don't ship, and a cache Read doesn't satisfy read-before-edit (L-010); and **running** from a stale copy of it — a live session keeps the cached version it started with, so at session start read the `Skills:` freshness row `/prime` now emits (base-dir version vs `plugin.json` — v1.23.0), or check the **base-dir version printed in each skill's invocation header** when priming is skipped; never `/plugin`'s report (L-021 ×2: Sprint-023 read as a code gap; Sprint-039 ran a whole sprint on 1.18.0 skills against a 1.22.0 repo, surviving only because references were read from the repo — reaching *past* the stale procedure, not following it).
❌ Parking a **flow-blocking open question** in a doc (a `TBD` / silent `assumes:`) instead of surfacing it — a question that blocks scope/design is asked (in its frontier round) or made an explicit `blocked`/owner-action with an unblock condition; never a passive placeholder that stalls dev (SPRINT-012 T1).
❌ Evaluating a change only against lean-flow's **own dogfooding**, never the **consumer who installs it** — every change checks its consumer-facing surface (skills self-contained **and** adaptable · README/CHANGELOG reflect user-visible changes · no repo-specific path — `scripts/…`, `docs/knowledge-index.md` — leaked into a generic skill/template). We repeatedly shipped maintainer-correct-but-consumer-leaky changes (SPRINT-014 → L-015). **Corollary (L-016):** when the repo *can't* dogfood a feature — its substrate is absent (a markdown repo has no testable code, so `/tdd` never fires) — verify on the **consumer path** (trace the consumer scenario / exercise the mechanism), never read "didn't fire in our repo" as either broken *or* fine.
❌ Judging an external tool/skill for adoption on its **standalone merit** instead of the **delta over lean-flow's existing surface** — map each candidate technique to what we already have *first*; only the unmatched remainder is a keeper (most scans → fast rejects). Seen across the bmad · structarmed · brainstorming scans (L-017).
❌ Shipping a new capability **without wiring it into the jobs that trigger/chain it** — a behaviour written only in its own file is half-shipped. Wire every trigger point + downstream consumer (entry routing · dispatch/reviewer brief · the `/flow` conductor · the `CONTEXT.md` SSOT) and verify it *fires* end-to-end. Shipping ≠ wiring (SPRINT-022 audit: dispatch · review-split · fog-mode all shipped half-connected → L-020).
❌ Skipping design because a task **"looks too simple"** — the "too simple to need a design" rationalization is exactly where unexamined assumptions cause wasted work; a quick design (scaled to size) still applies, regardless of perceived simplicity (brainstorming K1, TASK-058).

## Naming Conventions — files: kebab-case

## Definition of Done
- [ ] Acceptance criteria met
- [ ] `.claude/CONTEXT.md` + README updated if the skill roster or the loop changed
- [ ] plugin.json + marketplace.json versions stay equal (lockstep)
- [ ] Line caps respected: SKILL.md ≤ ~110 (procedure + scaffolding; artifacts → `references/`, uncounted — ADR-006) · CLAUDE.md ≤ 80
- [ ] **Consumer-facing surface checked** — generic skills/templates stay self-contained + adaptable (no leaked `scripts/…` path); README + CHANGELOG reflect any user-visible change (L-015)
- [ ] **Wiring check** — a new capability is wired into every related job (entry routing · dispatch/reviewer brief · `/flow` conductor · CONTEXT SSOT) and *fires* end-to-end, not just present in its own file (L-020)

## Behavioral Guidelines
- **Think before acting** — surface assumptions; ask on ambiguous requirements; never fabricate. Multiple interpretations? Present them — don't pick silently. **A blocking/clarifying question is *asked* — surface it as an AskUserQuestion popup, never buried in inline prose; everywhere, not only inside skill flows (L-002).** Ask by **frontier**: batch every open question whose prerequisites are settled into one round, serialise only dependents — *dependency* is what makes a batch vague, not count; and finding **facts** is your job, never the user's. Push back when a simpler approach exists.
- **Simplicity first** — minimum content that satisfies the goal; no speculative sections. Climb the *laziness ladder*: YAGNI → reuse existing → stdlib → native → installed dep → one line → minimal code — **stop at the first working rung**. Delete > add; root-cause > symptom. If it reads overcomplicated, rewrite it shorter.
- **Surgical changes** — touch only what the task requires; match adjacent style. Clean up only your own mess — **don't delete pre-existing content/sections you didn't touch; mention them instead**. Every changed line traces to the request.
- **Goal-driven** — restate the task as a verifiable goal before acting; for multi-step work, a brief plan with a check per step, loop until verified.
- **Concise reporting** — terse by default (status/verify/lists); full sentences only where a caveat or tradeoff is load-bearing; drop filler, never connectives.
