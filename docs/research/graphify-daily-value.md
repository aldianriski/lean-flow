---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: Question revisited, or a new option/source changes the recommendation
status: current
id: graphify-daily-value
tags: [tooling]
domain: knowledge
related: [ADR-009]
---

# Research — Is generated `graphify-out/` useful for daily lean-flow work, or is the curated doc set enough?

> **Question.** Once generated, does the `graphify-out/` artifact help daily task execution — or does
> lean-flow's curated doc set already cover orientation, making the integration redundant?
> **Verdict.** Redundant day-to-day. Remove the integration; keep one on-demand pointer (onboarding /
> pre-refactor audit). → SPRINT-007 T6 (decision D2).

## Why this matters
lean-flow wires graphify into 6 places as an "optional orientation source." If it doesn't earn daily
use, those mentions are maintenance + cognitive surface for nothing — the "nothing ships unreviewed"
smell the project exists to kill. Guessing wrong means either carrying dead wiring or dropping a
genuinely useful tool.

## Options considered
- **A — Keep + maintain a standing graph** — regenerate on change so it stays fresh. *Trade-off:* a
  maintained code-map is exactly the rot LAW 3 rejects; stale-but-confident is worse than absent.
- **B — Remove entirely** — strip all 6 mentions. *Trade-off:* loses an honest pointer for the cases
  where it genuinely helps.
- **C — Remove integration, keep one on-demand pointer** — no standing artifact, no maintenance.
  *Trade-off:* the user must know to run it — which is the point (on-demand).

## Findings
- Graphify's daily value (where-things-live, coupling) overlaps `ARCHITECTURE.md` — but ARCHITECTURE
  is *curated*, graphify is *mechanical/unfiltered*. For a repo you know, curated wins.
  *Source:* `.claude/CONTEXT.md` § Orientation (no hand-maintained codemap — it rots, LAW 3).
- Daily work is WHY-bound (intent, prior decisions); graphify is structure-only — no WHY. The hard
  part lives in ADRs / LEARNINGS, which a graph can't produce. *Source:* this session's task flow.
- lean-flow is a markdown repo — there's almost no code graph to build; the doc set *is* the
  structure. *Source:* repo layout.
- `Explore` gives live, never-stale recon on demand; a graph is a cached snapshot that can lie
  (cf. L-006 / L-013: verify the real signal, not a proxy). *Source:* `docs/LEARNINGS.md`.

## Recommendation
**Option C.** Remove the graphify integration; leave one honest line — it's a fine on-demand tool for
onboarding an unfamiliar repo or a pre-refactor audit, but lean-flow neither integrates nor depends on
it. WHY: redundant vs the curated doc set + `Explore` for daily work; its only real payoff (god-nodes,
coupling audit) is a non-daily, run-once moment. Easy to reverse → no ADR (recorded as SPRINT-007 D2).

## Out of scope / open questions
- Whether onboarding *large unfamiliar* repos becomes a common enough lean-flow use case to
  reintroduce a first-class integration — revisit if so.

## Re-verdict (2026-07-29, SPRINT-028 T1)

> **Verdict: re-affirmed.** Option C (on-demand pointer, no integration) still holds against
> graphify's current feature set. Delta-scanned per L-017: judged against lean-flow's existing
> surface (curated docs + `Explore`), never the tool's standalone merit.

**Method.** Diffed `README.md` at commit `be3dcfca` (2026-06-16, the commit nearest the prior
verdict's date) against the current `main` HEAD, plus `CHANGELOG.md` (0.9.25→0.9.29) and repo
metadata — all fetched live via `gh api repos/Graphify-Labs/graphify/...` and
`gh repo view Graphify-Labs/graphify`.

**What changed since 2026-06-16:**
- Org rebrand — `safishamsi/graphify` → `Graphify-Labs` org, `graphify.com`, Trendshift "trending"
  badge, Discord link. Stars 97,931 / forks 9,510, YC S26. Popularity signal only — not a keep
  criterion (L-017; same base rate this sprint's TASK-095 assumes).
- New **Benchmarks** section — LOCOMO/LongMemEval recall/QA numbers vs mem0/supermemory, "Graph
  build: 0 LLM credits." These are multi-session memory/RAG benchmarks for large corpora; lean-flow
  has no such corpus (markdown repo, curated docs already *are* the structure) — not relevant to
  the daily-value question either way.
- New **strict mode** (`graphify install --project --strict`, README L.201) — blocks an agent's
  first raw source-file read of a session and redirects it to `graphify query`; default install is
  unchanged (soft nudge). This is the exact hook-enforced-gate shape council already rejected for
  TASK-040 ("keep the view passive," reject gating `/prime` citations off a graph) — live evidence
  the enforcement-vs-suggestion tension (TASK-006) is real elsewhere, but doesn't change lean-flow's
  own answer: any future integration still must stay on the nudge/passive side, never `--strict`.
- CLI/engineering hardening only (incremental-extraction correctness, path-normalization fixes,
  merge-driver robustness across 0.9.25–0.9.29) — no change to the maintenance-burden shape: still
  opt-in (`graphify hook install`), never a standing default.

**Per-claim test:**

| Prior claim | Evidence fetched | Result |
|---|---|---|
| Token-cost of generation | README "Local-first" line + Benchmarks table, unchanged between `be3dcfca` and HEAD | Still **0 LLM credits** for code-only extraction (local tree-sitter AST) — true in June, true now. Cost only applies to the optional docs/PDF/image semantic pass, same as before. |
| Staleness / maintenance burden | `CHANGELOG.md` 0.9.25–0.9.29 | Several correctness fixes harden the cached-snapshot problem (incremental rebuild, stale-source pruning) — they reduce *bugs* in staleness handling, not the *inherent* staleness of any persisted artifact, and only for installs that opt into `hook install`. `Explore`'s live-recon argument is unaffected — it has nothing to go stale. |
| Feature claims ("what it does now") | current `README.md` fetched directly | Core surface unchanged in kind: god nodes, Leiden communities, cross-file AST edges (~40 languages), `query`/`path`/`explain` over `graph.json`, EXTRACTED/INFERRED tags. New in kind: quantified benchmarks (marketing) + opt-in strict mode (noted above). Neither addresses the structural objection: structure-only, no WHY; a markdown repo has ~no code graph to build. |

**Conclusion.** Nothing in the delta touches the two reasons Option C held: lean-flow's doc set is
curated and WHY-bound where graphify is mechanical and structure-only, and lean-flow's own repo has
almost no code graph to build. No integration task filed.

**Untestable claims:** none — every claim above traces to a fetched source (commit-pinned README
diff, CHANGELOG, `gh repo view`); no claim asserted from memory (L-014).

**Sources fetched:** `github.com/Graphify-Labs/graphify` (repo metadata) ·
`github.com/Graphify-Labs/graphify/blob/main/README.md` (current + pinned to `be3dcfca`) ·
`github.com/Graphify-Labs/graphify/blob/main/CHANGELOG.md` ·
`api.github.com/repos/Graphify-Labs/graphify/releases`.

## Reference run + consumer path

The 2026-07-29 reference run (measured build cost, token benchmark, real-query spot-check) and the
side-by-side rules for repos that install lean-flow and want graphify too →
[`graphify-reference-run.md`](graphify-reference-run.md).
