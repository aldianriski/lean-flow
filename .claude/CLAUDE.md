---
owner: Maintainer
last_updated: 2026-10-02
update_trigger: Project shape, anti-patterns, or conventions changed
status: current
---

# lean-flow — AI Context

## Project Overview
- **Name**: lean-flow
- **Type**: Claude Code plugin · lean skill library
- **Stack**: Markdown · Claude Code skills system
- **Architecture**: Plugin-first — components at repo root per the Claude Code plugin spec.
  Roster today: **14 skills** (incl. `/lean-doc-generator init`, which *does* scaffold a fresh
  repo) · **no hooks** · **no agent definitions** — the loop dispatches Claude's built-ins
  (`Explore` · `/code-review` · `/verify` · `/security-review`), and `/council` orchestrates
  sub-agents internally.
- **Hooks and agents are admissible**, held to ADR-001's curation bar (ADR-044) — *admissible* is
  not *present*: the first hook candidate was **withdrawn at outside review** (60% false positives
  on real transcripts, and English-only patterns that missed the maintainer's own bilingual cases —
  `TASK-366`). "No hooks / no scaffold / no agents" was a *proxy* for *curated* that began being
  enforced in place of it, and "no scaffold" was flatly **false** for as long as `init` has shipped,
  because a negative claim has no diff that ever makes it look wrong. **Describe the roster; never
  advertise an absence — and never describe a roster you have not re-checked.**

## File Structure
→ **`docs/architecture/overview.md` § Directory structure** — the where-things-live map, and the only one.
A second tree here is a hand-maintained codemap, which § Orientation of CONTEXT.md rules out (it rots — LAW 3).
Shape: **14 SKILL.md** auto-discovered at root · **33 canonical doc templates** + 2 non-core (DESIGN · QA-TESTCASE) **= 35 total**.

## The loop
`/prime → /lean-doc-generator → /orchestrator → repeat`. `/handoff` ends a session; `/prime`
resumes it. Every skill is also usable standalone. See `.claude/CONTEXT.md` for the roster.

## Design Principles
- **Curated, not copied** — the core discipline. Every component was reviewed ("genuinely useful + important + actually used?") and approved before adding. The opposite of dev-flow, which bulk-imported from every reference and bloated. The bar is review — not a ban on any component type.
- **Lean** — each SKILL.md ≤ ~140 lines of **procedure + scaffolding**; executable artifacts (prompt templates, persona/advisor definitions, schemas) live in the skill's own `references/` and don't count (ADR-006). No shared reference trees *across* skills.
- **Self-contained** — gates/checklists inlined; `lean-doc-generator` bundles its own templates and cites the standard from the versioned `spec/` tree (ADR-023), rather than owning a copy.
- **Adaptable** — skills read whatever context the host repo has and degrade gracefully when a file is missing.
- **Human-gated** — G1 Scope + G2 Design need explicit sign-off; `release-patch` never pushes.

## Anti-Patterns
❌ Adding *anything* unreviewed — copied wholesale from a reference, or added "just in case" (the dev-flow mistake that bloated its docs). Every addition clears the bar first: genuinely useful **and** important **and** actually used. Agents/hooks aren't banned — they're held to that same bar (`/council` cleared it; nothing's been bulk-imported).
❌ A core doc generated without reading its template (`lean-doc-generator` Step 6 is mandatory); HOW content in a doc — move it to a code comment instead.
❌ Skill count or the loop changing without updating `.claude/CONTEXT.md` + README.
❌ `git push` inside `release-patch` — it stops at the gate, always.
❌ Shipping a new behaviour **spec-only** — its DoD is *exercised once on real input*; a **gate** is also exercised on input that **must FAIL** (one retained
  fixture per check, each with its *named* finding), and a green first run proves nothing until a seeded break reddens exactly the cases that carry the claim, and one fixture must vary the guard's *selection* (the set it runs over), not only its verdict.
  Tier **G/X/P** is declared at G2, default up (ADR-029); every Tier G change gets a worktree-isolated outside review and states ONE hash convention. → `docs/LEARNINGS.md` § Durable rules › spec-only
❌ Edit-safety — **the report and the artifact disagree**: (a) `git add <shared-file>` over another stream's WIP · (b) a structure-adjacent Edit fusing table rows or
  list entries · (c) trusting a command's self-report — run the gate as its own call and read the verdict line **it prints**, never a wrapper's status · (d) an env
  workaround inherited by children. → `docs/LEARNINGS.md` § Durable rules › edit-safety
❌ Letting an SSOT doc (`CONTEXT.md`) accrete duplication of its satellites until it nears its cap — run a periodic dedup pass (prose duplicating CLAUDE.md/README → pointers) at promote doc-aging (L-008 · TD-006).
❌ Plugin-cache traps (`~/.claude/plugins/cache/…`): never **edit** it (read-only output, edits don't ship) and never **run** from a stale copy — read the `Skills:` freshness row or the base-dir version at session start. → `docs/LEARNINGS.md` § Durable rules › plugin-cache
❌ Parking a **flow-blocking open question** in a doc (a `TBD` / silent `assumes:`) instead of surfacing it — a question that blocks scope/design is asked (in its frontier round) or made an explicit `blocked`/owner-action with an unblock condition; never a passive placeholder that stalls dev (SPRINT-012 T1).
❌ Evaluating a change only against lean-flow's **own dogfooding**, never the **consumer who installs it** — check self-contained + adaptable, README/CHANGELOG, no repo-specific path leaked; a feature the repo can't dogfood is verified on the consumer path. → `docs/LEARNINGS.md` § Durable rules › consumer-side
❌ Judging an external tool/skill for adoption on its **standalone merit** instead of the **delta over lean-flow's existing surface** — map each candidate technique to what we already have *first*; only the unmatched remainder is a keeper (most scans → fast rejects). Seen across the bmad · structarmed · brainstorming scans (L-017).
❌ Shipping a new capability **without wiring it into the jobs that trigger/chain it** (entry routing · dispatch/reviewer brief · `/flow` · CONTEXT SSOT) — verify it *fires* end-to-end; shipping ≠ wiring. → `docs/LEARNINGS.md` § Durable rules › wiring
❌ Skipping design because a task **"looks too simple"** — the "too simple to need a design" rationalization is exactly where unexamined assumptions cause wasted work; a quick design (scaled to size) still applies, regardless of perceived simplicity (brainstorming K1, TASK-058).

## Naming Conventions — files: kebab-case

## Definition of Done
- [ ] Acceptance criteria met
- [ ] `.claude/CONTEXT.md` + README updated if the skill roster or the loop changed
- [ ] **All FOUR versioned manifests** stay equal (lockstep) — `.claude-plugin/plugin.json` · `.claude-plugin/marketplace.json` · `.codex-plugin/plugin.json` · `.kimi-plugin/plugin.json` — **plus the README footer**, which no lockstep check covers. This line read "plugin.json + marketplace.json" for two releases and *both* under-bumped: a DoD that enumerates a subset is read as exhaustive, and the enumeration is the thing people follow (v1.60.0 missed both siblings and the footer; v1.61.0 missed the siblings again while quoting that very sentence). Derive the set with `grep -l '"version"' .*-plugin/*.json`, never from this list.
- [ ] Line caps respected: SKILL.md ≤ ~140 (procedure + scaffolding; artifacts → `references/`, uncounted — ADR-006) · CLAUDE.md ≤ 80
- [ ] **Consumer-facing surface checked** — generic skills/templates stay self-contained + adaptable (no leaked `scripts/…` path); README + CHANGELOG reflect any user-visible change (L-015)
- [ ] **Wiring check** — a new capability *fires* end-to-end through every job that triggers or chains it (entry routing · dispatch/reviewer brief · `/flow` conductor · CONTEXT SSOT), not merely present in its own file (L-020). **Ask it of the repository, never of the author** — this line has been promoted and live through three sprints that shipped the class anyway (`attachLevel`, the two §4 registries, TD-103's pair), because each builder was correct within their declared `Layers:` and the seam sat outside all of them: a per-task DoD cannot enforce a property that lives *between* tasks, and the person who just wired what they were assigned is the one who cannot see it. The property is mechanically detectable — an exported or registry-registered symbol with **zero non-test callers** — so derive it, do not ask it (L-172 ×2 → TASK-318).

## Behavioral Guidelines
- **Think before acting** — surface assumptions; ask on ambiguous requirements; never fabricate. Multiple interpretations? Present them — don't pick silently. **A blocking/clarifying question is *asked* — surface it as an AskUserQuestion popup, never buried in inline prose; everywhere, not only inside skill flows (L-002).** Ask by **frontier**: batch every open question whose prerequisites are settled into one round, serialise only dependents — *dependency* is what makes a batch vague, not count; and finding **facts** is your job, never the user's. Push back when a simpler approach exists.
- **Simplicity first** — minimum content that satisfies the goal; no speculative sections. Climb the *laziness ladder*: YAGNI → reuse existing → stdlib → native → installed dep → one line → minimal code — **stop at the first working rung**. Delete > add; root-cause > symptom. If it reads overcomplicated, rewrite it shorter.
- **Surgical changes** — touch only what the task requires; match adjacent style. Clean up only your own mess — **don't delete pre-existing content/sections you didn't touch; mention them instead**. Every changed line traces to the request.
- **Cross-check a query before acting on it** — a search/count/grep whose result you will act on *immediately* gets a **second query that must agree**: an inverse whose sum is the known total, a count reconciled against a census, or a seeded gap the query must detect. Run it before the conclusion, not after it surprises you. **Why an action and not a caution:** the "match by shape, not substring" rule was promoted, correctly placed and *loaded in context* for all eleven sightings, and reached none — 8 of them ad-hoc queries inside a governance pass, where a wrong answer is acted on with no review between query and conclusion. Every one that was caught was caught by a *disagreeing second number*, never by recalling the rule. A negative control alone is not enough: it proves the query fires on rows it reaches, never that it reached them all (SPRINT-064 T1 — a nested `getline` silently examined 20 of 31 and returned "clean"). **A value entering a *frozen artifact* — an assumption, a DoD, an acceptance threshold — is a query result and gets the same treatment at the moment it is written, then again at execution.** Both grains count: a **figure** (SPRINT-071 wrote `~121` sites into A1; the real number was 39, so the DoD built on it was unsatisfiable the moment it froze) and a **structural claim about another document** (SPRINT-074 froze "the checker reads §14's tables" into three artifacts; §14 has no per-rule table). The guard does not fire on its own because *authoring* feels like planning, not querying — but the number is acted on later, by someone who cannot re-derive it, against a Plan nobody can amend cheaply. A **third grain: an identifier for a new row** — a `TD-NNN`, `TASK-NNN` or `L-NNN` — is a query result too, so **derive the maximum in use; never increment the one you remember**. Twice in one sprint the assumed id was wrong: a register cited `TASK-241`, which was that task's own twin, and a debt row filed as `TD-066` collided with an existing row whose subject was the very bug another task was fixing. Nothing rejects a duplicate id, and a second row with the same number reads as an edit to the first (L-143 ×2). **And derive it with the worktrees excluded** — `.claude/worktrees/` holds complete repo copies during isolated dispatch, so a bare `grep -r` over this repo counts them as content and returns a maximum that is not a row. It has now returned `L-999` (SPRINT-013's deliberate dangling-reference *negative-test token*) twice: once against a real max of `L-168`, once against `L-180` — the second time inside a close Retro, in a session that had already derived two `TD-NNN` correctly minutes earlier, because id-derivation feels like bookkeeping rather than querying. Treat a suspiciously high maximum as contamination before treating it as a row (L-170 ×2). **And the second query must vary the SELECTION rule, not the direction of the count.** An inverse whose two halves sum to the known total proves only that the rows were *partitioned* — both halves run the same selector, so they agree perfectly on the wrong population. SPRINT-098 got `37 open + 60 closed = 97` against a real figure of **5**; SPRINT-099 derived ten archive-exclusion call sites by grepping one predicate SHAPE and cross-checked by grepping the same shape, while an eleventh site written as `grep -v` sat outside what either query could reach — on a live gate leg, failing silently. Both were caught only by a number derived through a *different route*. The cheap tell: would both halves of your check break identically if the selector were wrong? (L-198 ×2). Full family → CONTEXT.md § Gates (L-105 · L-108 · L-130 · L-136 · L-143 · L-170 · L-198).
- **Goal-driven** — restate the task as a verifiable goal before acting; for multi-step work, a brief plan with a check per step, loop until verified.
- **Concise reporting** — terse by default (status/verify/lists); full sentences only where a caveat or tradeoff is load-bearing; drop filler, never connectives.
