---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: The reference run is re-executed, or the consumer-path shape changes
status: current
id: graphify-reference-run
tags: [tooling]
domain: knowledge
related: [graphify-daily-value]
---

# graphify — the measured reference run, and the consumer-path shape it produced

> Split verbatim out of [`graphify-daily-value.md`](graphify-daily-value.md) at SPRINT-058 T1 (§7 diet
> — whole sections moved, nothing compressed). The parent keeps the question, options and verdict;
> this file keeps the measurement and the side-by-side rules the measurement produced. The cost model
> below is derived from the reference run above it, which is why the two travel together.

## Reference run (2026-07-29 — first actual execution on this repo)

Prior verdicts were analysis-only; this run exercised the full pipeline on real input (the
anti-spec-only rule) to serve as the **reference implementation + cost baseline** for running
graphify on a consumer *code* repo.

- **Corpus → graph:** 121 files / ~112k words → 579 nodes · 919 edges · 66 communities
  (`graphify-out/` — disposable local artifact, never committed; regenerate on demand).
- **Measured benchmark:** 17.9× fewer tokens per query (~8.4k vs ~149k naive full-corpus load).
  **Build cost:** ~689k input tokens recorded + ~180k unrecorded (one extraction subagent's usage
  lost to a session-limit kill) ≈ **870k total**. Break-even ≈ 5–6 queries — *but only vs. naively
  loading the whole corpus*, which the curated doc set + `Explore` already avoid → **verdict
  unchanged (Option C, on-demand only)**.
- **Shape confirmed the standing analysis:** god nodes are the curated SSOT surface itself
  (`/orchestrator` SKILL, loop-hygiene PRD, changelog archive) — the graph mostly re-derives what
  the doc set already indexes. AST contributed only 36 nodes (6 script/json files); all signal came
  from the LLM semantic pass (5 parallel sonnet subagents ≈ the entire build cost). On a code repo
  the ratio inverts: AST edges are free — expect materially lower cost per node there.
- **Operational note:** one subagent was killed mid-extraction by a session limit *after* writing
  valid chunk JSON — the chunk-file-on-disk success signal recovered it with zero re-extraction (L-049).
- **Real-query spot-check (beyond the synthetic benchmark):** BFS query "how does night-run
  unattended sprint execution recover from a stall" correctly located the full capability chain
  (night-run.md research → `skills/orchestrator/references/night-run.md` → SPRINT-027 watchdog →
  L-044/L-046) in **~830 tokens** with correct source files. Confirms the graph's real value class:
  a cheap **locator** (WHERE), never an explainer (WHY) — you still read the located doc.

## Consumer path — using & maintaining graphify alongside the plugin

*(Decision record for repos that install lean-flow and want graphify too. lean-flow itself neither
integrates nor depends on it — this is the supported side-by-side shape, kept consistent with the
council verdict: passive, on-demand, one SSOT.)*

**When it pays** (run it): onboarding an unfamiliar/undocumented repo *before* lean-flow docs exist
(day-1 map — feeds writing `ARCHITECTURE.md` at `/lean-doc-generator init`/`migrate`) · a
pre-refactor coupling audit (god nodes → `/refactor-advisor` input) · a corpus too large to load.
**When it doesn't:** daily work in a repo with curated lean-flow docs — `/prime` + `CONTEXT.md` +
`Explore` reach the same file in fewer hops, with WHY attached (this run's spot-check above).

**Rules (all mandatory):**
1. **`graphify-out/` is a disposable derived view** — gitignore it, never commit, never hand-edit,
   regenerate on doubt. It is a cached snapshot that can lie (L-006/L-013); treat staleness as
   fail-loud, not degrade-quiet.
2. **Maintenance = opt-in, pick one, cheapest first:** manual `--update` after doc waves (default;
   incremental, re-extracts only changed files) · `graphify hook install` post-commit AST refresh
   (code repos; docs still need a manual `--update`) · `--watch` only for agent-wave workflows.
3. **Never `--strict` mode** (blocks raw file reads, redirects to graph queries) — the exact
   enforced-gate shape council rejected for TASK-040; the graph stays a nudge, never a gate.
4. **The graph never becomes a source of truth** — curated docs (`ARCHITECTURE.md`, `CONTEXT.md`)
   stay the SSOT; graph output is *input evidence* for writing them, and a query answer is a
   pointer to a file you then actually read.

**Cost model (from the reference run):** build ≈ N-files × semantic-pass tokens (~870k for 121
markdown files; materially cheaper on code repos where AST is free) · query ≈ 0.8–8k tokens ·
break-even vs naive full-corpus loading ≈ 5–6 queries. Budget the build as a one-time onboarding
cost, not a recurring one.
