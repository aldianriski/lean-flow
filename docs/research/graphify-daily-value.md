---
owner: Maintainer
last_updated: 2026-06-16
update_trigger: Question revisited, or a new option/source changes the recommendation
status: current
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
