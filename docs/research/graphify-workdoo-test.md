---
owner: Maintainer
last_updated: 2026-11-20
update_trigger: Question revisited, or a new graphify release or a harder question set changes the recommendation
status: current
id: graphify-workdoo-test
tags: [tooling]
domain: knowledge
related: [graphify-workdoo-questions, graphify-daily-value, graphify-reference-run]
---

# Research — Does a graphify graph help an AI know a TypeScript repo better, at no extra cost?

> **Question.** On a real TypeScript repo, does handing Explore a graphify graph get more questions right for
> no more tokens than Explore alone?
> **Verdict.** **Do not ship the wiring tested here** (report-first, graph optional): it gave equal accuracy
> (6/6 each) at 1.04× the plain arm's tokens in one comparison, which fails the owner's 1.0× bar. **Query-first
> graphify, the use its README recommends, is untested**, so this is not a verdict on graphify itself; a re-test
> was ordered on 2026-11-20. TASK-675 (ship the wiring) is cancelled. lean-flow's own verdict
> (`graphify-daily-value.md`, redundant) is untouched. — TASK-673, SPRINT-181; reworded after a Codex review.

## Why this matters
The owner ruled on 2026-11-20 that graphify ships in lean-flow if it passes this test. A wrong keep would put
a generated, unmaintained code map in every adopter's recon path. A wrong drop would cost a cheap locator.

## Options considered
- **A — Explore only** — live search of the code (grep and reads). *Trade-off:* no build, never stale.
- **B — Explore plus graphify-out** — the same agent, told to read `GRAPH_REPORT.md` first and to use
  `graph.json` or `graphify query|path|explain`. *Trade-off:* a build step, plus whatever the graph saves.

## Findings
- **Method.** Snapshot `D:\Research\workdoo` at `884d897`. Six questions fixed before any arm ran (2 where,
  2 calls, 2 what-breaks), with a key the coordinator checked against the code
  (`graphify-workdoo-questions.md`). Each arm was a fresh `Explore` dispatch on Sonnet with the same scope.
  Both excluded `.claude/` (two stale worktree copies of the code), `.workdoo/`, `node_modules/` and `dist/`.
  A fresh Sonnet scorer saw the two answer sets as X and Y; the coordinator alone held the mapping (X = B).
- **Correctness: tie.** A 6/6, B 6/6, no partials. *Source:* scorer report, SPRINT-181 Log.
- **Cost: B is higher.** A 41,375 reported subagent tokens (7 tool uses). B 42,932 (11 tool uses). The
  build was `graphify update` (code-only, "no LLM needed"): 0 LLM tokens, 9 s wall, 6,874 nodes, 13,478 edges,
  381 communities. The temporary `.graphifyignore` kept the `.claude/` copies out. B ÷ A = 1.038×.
- **B did not use the graph.** It read the first 60 lines of the 87 KB `GRAPH_REPORT.md`. Those lines list
  community hubs. It judged them not useful, ran no graphify query and answered from grep and reads. That is
  the measured behaviour of an agent offered the graph, not an arm failure, so it is not a confound under
  the G2 definition (an arm errors, skips a question or reads outside scope).
- **Ceiling.** Explore alone already scored 6/6, so this set could not show a correctness gain; it could still
  have shown an efficiency gain, and did not. One run per arm cannot establish a stable 4% penalty.
- **Not the README's use.** graphify's README says to run `graphify claude install` (a hook that nudges the agent
  to the graph before searches and reads) and to prefer scoped `graphify query` over reading the full report or
  grepping. No integration was installed, arm B was told to read `GRAPH_REPORT.md` first, and it ran no query.
  The README's own code benchmark (ERPNext cross-tool, n=6: 82.0% key-fact coverage vs 70.8% for grep/read) is
  a cross-file coverage claim these single-hop questions could not reach. "80% fewer tokens" is a Graphify Cloud
  claim, out of scope. *Source:* graphify README (v0.8.13), Codex review 2026-11-20.
- **RTK.** The project's RTK hook was active for both arms equally (same session hooks).
- **Snapshot left as found.** HEAD, `git status --porcelain --ignored` and the absence of `~/.graphify`
  match the pre-test record. Nothing was touched in `D:\Project\workdoo`.

## Recommendation
Do not ship the tested wiring. Under the owner's bar (at least as many correct answers, at no more than 1.0×
tokens), a tie at 1.04× fails. TASK-675 is cancelled at close, by its own condition. Re-test graphify as its
README directs (query-first integration, cross-file and multi-hop questions, two paired runs with the order
reversed) before ruling on graphify itself. No ADR is needed: nothing is adopted, and the decision is easy to reverse.

## Out of scope / open questions
- The query-first re-test (owner ruling 2026-11-20) settles graphify's main claim. This test is n=6 with one
  run per arm, which shows direction, not proof (EPIC-024 D4).
