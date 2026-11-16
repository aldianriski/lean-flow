---
owner: Maintainer
last_updated: 2026-11-16
update_trigger: Question revisited, or a new option/source changes the recommendation
status: current
id: ponytail-delta-review
tags: [tooling]
domain: knowledge
related: [ADR-001, graphify-daily-value]
---

# Research — Does ponytail add anything lean-flow does not already have?

> **Question.** Mapped technique by technique against lean-flow's existing surface (L-017), which parts of ponytail are a
> real delta, and is its "-45% tokens" claim credible for lean-flow's work?
> **Verdict.** **Drop.** Every technique is already matched or deliberately excluded; the two unmatched remainders are
> dropped. The "-45% tokens" figure is **inconclusive** for lean-flow. Nothing is installed and nothing ships
> (EPIC-026 D3, TASK-669).

## Why this matters
EPIC-026 asks for a recorded verdict on ponytail, judged by its delta over lean-flow and not on its own merit (L-017). The
cost of guessing wrong is adopting a second copy of rules lean-flow already carries, or a global hook set, for a saving
measured against a baseline lean-flow does not have.

## Basis
A first-hand read, not a measurement. Source: github.com/DietrichGebert/ponytail at commit
`96608e078b2d5ea607c5c3b8b5a54d1c1fba6846` (plugin 5.3.3, MIT). A worker fetched the files through `gh api`, and the
coordinator re-read the load-bearing quotes (the decision ladder, the `shortcut:` rule, the never-cut line and the
benchmark tables) at the same commit. Files read: `skills/ponytail*/SKILL.md`, `hooks/*.json`, `.claude-plugin/plugin.json`,
`INSTALL.md`, `README.md`, `benchmarks/results/2026-10-07-agentic.md`. No paid re-run (D3).

## Options considered
- **A — Adopt the unmatched remainder** (in-code `shortcut:` markers plus a scan, and a written never-cut floor).
  *Trade-off:* small additions, but each lands in always-loaded text or adds a second debt store.
- **B — Drop: record the mapping, adopt nothing.** *Trade-off:* no new surface; a future measured defect can reopen A.
- **C — Install the plugin.** Out of scope (EPIC-026 D3 and Scope-Out): three global hooks, a per-turn ledger CSV and
  writes under `~/.claude` and `~/.config`.

## Findings — technique map

| ponytail technique (verbatim source) | lean-flow surface | Delta |
|---|---|---|
| Decision ladder, "Take the first option that fully works" (6 rungs, `skills/ponytail/SKILL.md` L25-32) | CLAUDE.md laziness ladder (YAGNI → reuse → stdlib → native → installed dep → one line → minimal code) | none, same ladder |
| "Be lazy about the solution, never about the change itself": list callers, tests, fixtures (L21, L34) | G1 files + blast radius; DoD wiring check (L-020, L-172) | none |
| Bug fix: "grep every caller ... fix the root cause once" (L38) | `/diagnose`; CLAUDE.md "root-cause > symptom" | none |
| "Lazy code without its check is unfinished" (L41) | `/tdd` as the default route; L-007 exercised on real input; the `Negative:` box | none |
| End every reply with what was skipped or not checked (L15) | review and worker reports state their limits (v2.24.0); report shape | none for reviews; per-reply form not needed |
| "Never cut: validation at trust boundaries, ... security, accessibility" (L44) | G2 abuse-case sketch for `risk: high`; `/security-review` routing | **partial, an explicit floor is unwritten → dropped** |
| `shortcut: <the limit>, <when to upgrade>` comment + `/ponytail-debt` scan (L42; debt SKILL L18-39) | `TD-NNN` ledger in `TECH-DEBT.md`, filed at close, aged at promote | **unmatched → dropped** |
| `/ponytail-review`: "No case, no finding"; Verdict, `Lean: -N lines`, `Not checked:` | `/code-review` (failure scenario per finding); `/simplify`; review-scoping "not checked" | none |
| `/ponytail-audit`, a whole-repo pass | `/refactor-advisor`; review-scoping rules out whole-repo scans as the biggest token sink | deliberately excluded |
| `/ponytail-gain`: "NEVER print a per-repo savings number" | EPIC-024 / EPIC-026 measure basis: USD per box from `session-cost.ts`, read as direction | none, same principle |
| Levels; `ultra`: "question the request ... push back" | CLAUDE.md "Push back when a simpler approach exists" | none |
| Hooks (SessionStart, SubagentStart, UserPromptSubmit), band UI, per-turn ledger CSV, statusline edit | lean-flow ships no hooks (ADR-044 bar); EPIC-026 rules out installing | excluded |

**Why the two remainders are dropped.**
- **`shortcut:` markers** would be a second debt store beside `TECH-DEBT.md`, which already carries the limit
  (severity) and the trigger (aging at promote). Two stores drift (one SSOT, LAW 3). A scan for them is new
  governance machinery with no measured defect behind it (ADR-053).
- **The never-cut floor** would go into always-loaded text. CLAUDE.md is at 79 of 80 lines and the token budget has
  about 8 tokens left. Lean-flow has no recorded defect where laziness cut a trust-boundary check. Reopen it if one is
  measured.

## Findings — the "-45% tokens" claim
- **What it measures.** "| Output tokens | -43% | **-45%** [-54..-35] |" is Ponytail 5 against "no skill" (results L38-42):
  output tokens only, the geometric mean of per-task medians over 39 author-written tasks, `claude -p` on Opus 5.5,
  5 runs per arm. Cost is -26% [-36..-16].
- **Why it does not transfer.** The baseline is no ruleset at all. Lean-flow already carries the same ladder, and the
  closest proxy for a ponytail-on-top-of-a-ladder delta is its own v5-vs-v4.13 row: "Output tokens | -2.7% [-8..+3]".
  "No shell, by design: Bash is disabled for every arm" (L28), while EPIC-024 measured 60-69% of lean-flow's
  main-thread cost in shell and edit turns.
- **Why it cannot be checked.** Per-task token figures are not committed (`benchmarks/agentic/runs/` is gitignored), so
  the -45% cannot be recomputed from the repo.
- **Judgement: inconclusive** for lean-flow's work. The figure is likely honest for its own setup, but it does not
  measure a delta over lean-flow.

## Recommendation
Drop ponytail: adopt no technique, install nothing. The mapping above is the record. A later owner ruling may reopen
either remainder, and a kept technique would be a separate ruling, never a change shipped on this verdict (TASK-669).

## Out of scope / open questions
- Installing or trialling ponytail (EPIC-026 D3). The RTK and graphify verdicts are their own EPIC-026 slices.
- The EPIC-026 INDEX summary row of all three verdicts is the epic's "record the verdicts" slice, not written here.
