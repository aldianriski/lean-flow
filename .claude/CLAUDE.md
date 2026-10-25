---
owner: Maintainer
last_updated: 2026-10-25
update_trigger: Project shape, anti-patterns, or conventions changed
status: current
---

# lean-flow — AI Context

## Project Overview
- **Name**: lean-flow
- **Type**: Claude Code plugin · lean skill library
- **Stack**: Markdown · Claude Code skills system
- **Architecture**: Plugin-first — components at repo root per the Claude Code plugin spec.
  Roster today: **15 skills** (incl. `/lean-doc-generator init`, which scaffolds a fresh repo) · **no hooks** ·
  **no agent definitions** — the loop dispatches Claude's built-ins (`Explore` · `/code-review` · `/verify` ·
  `/security-review`), and `/council` orchestrates sub-agents internally.
- **Hooks and agents are admissible**, held to ADR-001's curation bar (ADR-044) — *admissible* is not *present*.
  **Describe the roster; never advertise an absence — and never describe a roster you have not re-checked** (L-210).
  → `docs/LEARNINGS.md` § Durable rules › roster

## File Structure
→ **`docs/architecture/overview.md` § Directory structure** — the where-things-live map, and the only one.
A second tree here is a hand-maintained codemap, which § Orientation of CONTEXT.md rules out (it rots — LAW 3).
Shape: **15 SKILL.md** auto-discovered at root · **34 canonical doc templates** + 2 non-core (DESIGN · QA-TESTCASE) **= 36 total**.

## The loop
`/prime → /lean-doc-generator → /orchestrator → repeat`. `/handoff` ends a session; `/prime`
resumes it. Every skill is also usable standalone. See `.claude/CONTEXT.md` for the roster.

## Design Principles
- **Curated, not copied** — the core discipline: every component is reviewed ("genuinely useful + important + actually used?") and approved before adding (ADR-001). The bar is review — not a ban on any component type.
- **Lean** — each SKILL.md ≤ ~140 lines of **procedure + scaffolding**; executable artifacts (prompt templates, persona/advisor definitions, schemas) live in the skill's own `references/` and don't count (ADR-006). No shared reference trees *across* skills.
- **Self-contained** — gates/checklists inlined; `lean-doc-generator` bundles its own templates and cites the standard from the versioned `spec/` tree (ADR-023), rather than owning a copy.
- **Adaptable** — skills read whatever context the host repo has and degrade gracefully when a file is missing.
- **Human-gated** — G1 Scope + G2 Design need explicit sign-off; `release-patch` never pushes.

## Anti-Patterns
❌ Adding *anything* unreviewed — copied wholesale from a reference, or added "just in case" (dev-flow's mistake, ADR-001). Every addition clears the bar first: genuinely useful **and** important **and** actually used. Agents/hooks are held to that same bar, not banned.
❌ New **governance machinery** (guard · checker · gate or `qa-check.sh` leg · ledger · ledger field) without one of the five — measured defect · measured cost · repeated failure (≥2 `L-NNN`) · security · consumer evidence — named in the task's `## Why`. Admitted work declares a G2 review-round cap (default 2); a census-zero finding → TD. Defect fixes, deletions, skill work: unfrozen (ADR-053).
❌ A core doc generated without reading its template (`lean-doc-generator` Step 6 is mandatory); HOW content in a doc — move it to a code comment instead.
❌ Skill count or the loop changing without updating `.claude/CONTEXT.md` + README. ❌ `git push` inside `release-patch` — it stops at the gate, always.
❌ Shipping a new behaviour **spec-only** — DoD: *exercised on real input* (L-007, all tiers). **Gates** need a retained **must-FAIL** fixture per check, failing with its named finding. Point a guard at its motivating real artifact before ticking it; enumerate the population it must cover and vary the **selection** in a fixture, not only the verdict.
  Declare Tier **G/X/P** at G2, default up (ADR-029); re-tier on discovery. **Consequential G**: its false negative would reach an adopter or gate a merge for one (an engine rule or file `conformance.sh` executes, or a script a shipped skill names as the mechanism of an adopter-run step; ADR-050).
  It takes the full bar: **seed the rejected design or break each assertion in turn**; `cmp` the seed landed vs pristine; it must parse, keep its assertion count, stay within ±1 line; exactly the claim-bearing cases redden while a sibling control stays green; restore under ONE hash convention (`git hash-object <p>` == `git rev-parse <ref>:<p>`) — plus a **worktree-isolated** outside review.
  **Other G** (maintainer-only legs/checks): must-FAIL fixture + one run on its real artifact, no mutation campaign, no mandatory review. **Frozen G** and **X**: retained fixtures, no discrimination proof. **P**: G1 + a read-through. → `docs/LEARNINGS.md` § Durable rules › spec-only
❌ Edit-safety — **the report and the artifact disagree**: (a) `git add <shared-file>` over another stream's WIP — serialise, or `git add -p` then read `git diff --cached` · (b) a structure-adjacent Edit fuses table rows or list entries — re-read the whole structure after the edit · (c) trusting a command's self-report —
  inspect what it was meant to produce, never its status; run the gate as its own call and read the verdict line **it prints**, not a wrapper's; for a fan-out the per-unit output **file** is the signal · (d) an env workaround inherited by children — scope it to the one invocation that needs it,
  and when a check differs between contexts, diff the environments before the code. → `docs/LEARNINGS.md` § Durable rules › edit-safety
❌ Letting an SSOT doc (`CONTEXT.md`) accrete duplication of its satellites until it nears its cap — run a periodic dedup pass (prose duplicating CLAUDE.md/README → pointers) at promote doc-aging (L-008 · TD-006).
❌ Plugin-cache traps (`~/.claude/plugins/cache/…`): never **edit** it (read-only output, edits don't ship; a cache Read does not satisfy read-before-edit on the repo source) and never **run** from a stale copy — read the `Skills:` freshness row or base-dir version at session start, never `/plugin`'s report. → `docs/LEARNINGS.md` § Durable rules › plugin-cache
❌ Parking a **flow-blocking open question** in a doc (a `TBD` / silent `assumes:`) instead of surfacing it — ask it in its frontier round, or make it an explicit `blocked`/owner-action with an unblock condition; never a passive placeholder. → `docs/LEARNINGS.md` § Durable rules › flow-blocking-question
❌ Evaluating a change only against lean-flow's **own dogfooding**, never the **consumer who installs it** — check self-contained + adaptable, README/CHANGELOG, no repo-specific path leaked; a feature the repo can't dogfood is verified on the consumer path. → `docs/LEARNINGS.md` § Durable rules › consumer-side
❌ Judging an external tool/skill for adoption on its **standalone merit** instead of the **delta over lean-flow's existing surface** — map each candidate technique to what we already have *first*; only the unmatched remainder is a keeper (L-017).
❌ Shipping a new capability **without wiring it into the jobs that trigger/chain it** (entry routing · dispatch/reviewer brief · `/flow` · CONTEXT SSOT) — verify it *fires* end-to-end; shipping ≠ wiring. → `docs/LEARNINGS.md` § Durable rules › wiring
❌ Skipping design because a task **"looks too simple"** — a quick design (scaled to size) still applies, regardless of perceived simplicity. → `docs/LEARNINGS.md` § Durable rules › too-simple

## Naming Conventions — files: kebab-case

## Definition of Done
- [ ] Acceptance criteria met
- [ ] `.claude/CONTEXT.md` + README updated if the skill roster or the loop changed
- [ ] **Every versioned manifest** stays equal (lockstep) **plus the README footer**, which no lockstep check covers — derive the set with `grep -l '"version"' .*-plugin/*.json`, never from a remembered list. → `docs/LEARNINGS.md` § Durable rules › manifest-lockstep
- [ ] Line caps respected: SKILL.md ≤ ~140 (procedure + scaffolding; artifacts → `references/`, uncounted — ADR-006) · CLAUDE.md ≤ 80
- [ ] **Consumer-facing surface checked** — generic skills/templates stay self-contained + adaptable (no leaked `scripts/…` path); README + CHANGELOG reflect any user-visible change (L-015)
- [ ] **Wiring check** — a new capability *fires* end-to-end through every job that triggers or chains it (entry routing · dispatch/reviewer brief · `/flow` conductor · CONTEXT SSOT), not merely present in its own file (L-020).
  **Ask it of the repository, never of the author**: derive it — an exported or registry-registered symbol with **zero non-test callers** is unwired (L-172 → TASK-318). → `docs/LEARNINGS.md` § Durable rules › wiring-check

## Behavioral Guidelines
- **Think before acting** — surface assumptions; ask on ambiguous requirements; never fabricate. Multiple interpretations? Present them — don't pick silently. **A blocking/clarifying question is *asked* — surface it as an AskUserQuestion popup, never buried in inline prose; everywhere, not only inside skill flows (L-002).**
  Ask by **frontier**: batch every open question whose prerequisites are settled into one round, serialise only dependents — *dependency* is what makes a batch vague, not count; and finding **facts** is your job, never the user's. Push back when a simpler approach exists.
- **Simplicity first** — minimum content that satisfies the goal; no speculative sections. Climb the *laziness ladder*: YAGNI → reuse existing → stdlib → native → installed dep → one line → minimal code — **stop at the first working rung**. Delete > add; root-cause > symptom. If it reads overcomplicated, rewrite it shorter.
- **Surgical changes** — touch only what the task requires; match adjacent style. Clean up only your own mess — **don't delete pre-existing content/sections you didn't touch; mention them instead**. Every changed line traces to the request.
- **Cross-check a query before acting on it** — a search/count/grep whose result you act on *immediately* gets a **second query that must agree**, run before the conclusion: a count reconciled against a census, a seeded gap it must detect, or an inverse summing to the known total.
  The second must **vary the SELECTION rule, not the direction of the count** — would both halves break identically if the selector were wrong? A negative control proves only the rows it reached (L-198).
  A value entering a *frozen artifact* (assumption · DoD · acceptance threshold), whether a **figure** or a **structural claim about another document**, is a query result: check it when written and again at execution (L-130 · L-136).
  So is a **new row id** (`TD-NNN` · `TASK-NNN` · `L-NNN`): **derive the maximum in use, never increment the one you remember** (L-143), **with `.claude/worktrees/` excluded**; treat a suspiciously high maximum as contamination, not a row (L-170). Family → CONTEXT.md § Gates (L-105 · L-108). → `docs/LEARNINGS.md` § Durable rules › cross-check
- **Goal-driven** — restate the task as a verifiable goal before acting; for multi-step work, a brief plan with a check per step, loop until verified.
- **Concise reporting** — terse by default (status/verify/lists); full sentences only where a caveat or tradeoff is load-bearing; drop filler, never connectives.
