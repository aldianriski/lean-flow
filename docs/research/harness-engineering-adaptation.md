---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: A new OpenAI/harness-engineering follow-up publishes, or lean-flow's dispatch/doc surface changes enough to reopen a rejected row
status: current
id: harness-engineering-adaptation
tags: [process, tooling]
domain: skills
related: [fog-fleet-orchestration, agents-md-adoption, structarmed-adaptation]
---
<!-- Frontmatter is the ADR-009 knowledge metadata SSOT — tags/domain vocab sourced from
     scripts/gen-index.sh TAGS/DOMAINS (single origin); qa-check.sh lints id/tags/domain/status
     against it, so keep values inside the listed vocab. -->

# Research — does OpenAI's "harness engineering" article have anything to adapt into lean-flow? [TASK-094]

> **Question.** OpenAI's "Harness engineering: leveraging Codex in an agent-first world" describes
> practices from a 5-month, ~1500-PR, zero-manually-written-code internal project. Does any named
> technique add capability lean-flow doesn't already have (its own skills/gates, or a Claude Code
> harness equivalent)?
> **Verdict.** No keepers. Every technique maps onto an already-shipped lean-flow surface, an
> already-tracked open question, or is out of scope (host-project infra, not a dev-loop concept).

## Why this matters

TASK-089's fog-map named this scan (↔ TASK-094) to sanity-check the fleet/dispatch surface against
a first-party "how we actually run agents at scale" account before treating that surface as settled.
Guessing wrong here means either missing a real capability gap or, worse, importing OpenAI's
full-autonomy stance into a plugin whose axiom is human-gated.

## Options considered
- **A — Adopt selected techniques as new TASKs** — pull whichever rows don't map onto existing surface.
- **B — Reject wholesale, cite deltas already closed** — confirm coverage, file nothing new.

## Fetch status

`WebFetch` on `openai.com/index/harness-engineering/` returned `403 Forbidden` (bot-blocked) on two
attempts. Per instructions, fell back to `WebSearch` → found a GitHub Gist mirror
(`gist.github.com/rianjs/61503602eb42266bb0e125fe8912be5f`) whose header attributes it to
`https://openai.com/index/harness-engineering/`; fetched and cross-checked in two passes. All
techniques below are cited from that fetched text.

## Findings — per-technique delta table

| Technique (article) | Already covered by | Verdict |
|---|---|---|
| "Humans steer, agents execute" / zero-manually-written-code goal | Human-gated axiom (CLAUDE.md) + default-spawn dispatch (ADR-010, `dispatch.md`) — same direction, lean-flow just keeps gates human-signed | reject |
| "Ralph Wiggum Loop" — agent self/peer review, iterate until agent reviewers satisfied, no human in the loop | `dispatch.md` two-tier review (pre-merge full review, post-merge smoke check) + `/code-review` Standards-vs-Spec pass — but lean-flow deliberately keeps merge **coordinator-owned, never a blind sub-agent**; full loop-to-merge autonomy is the same enforcement-vs-suggestion tension TASK-006 already tracks | reject — no new info beyond confirming a tracked tension |
| Per-worktree app boot + Chrome DevTools Protocol for agent self-validation | `/run` skill (launch/drive the app to confirm a change works) + `claude-in-chrome` MCP — both generic Claude-harness equivalents, usable inside any worktree dispatch today | reject |
| Observability (logs/metrics/traces) wired into agent runtime | Host-project infra, not a workflow-loop concept — out of scope, same axis as structarmed's rejected PHP-tooling rows | reject |
| Repo-local `docs/` as system of record, replacing external docs | Exactly the LEAN DOCUMENTATION STANDARD (`DOCS_Guide.md`) — versioned in-repo markdown is already the whole model | reject |
| `AGENTS.md` as a brief, stable table-of-contents (progressive disclosure) | CLAUDE.md → CONTEXT.md → skill `references/` layering already is progressive disclosure; the AGENTS.md question itself is settled by TASK-093 (`agents-md-adoption.md` — conditional, deferred until a non-Claude consumer) | reject |
| Mechanical doc-freshness linting in CI | `scripts/gen-index.sh` + `qa-check.sh` already lint id/tags/domain/status + generate the cross-linked knowledge index | reject |
| Strict layered architecture, mechanically-enforced dependency direction | App-code architecture concern, not lean-flow's surface (a markdown skill library has no app layers to enforce) — same domain-mismatch as structarmed | reject |
| Encode human taste/style into linters; enforce invariants mechanically, leave style free | Same enforcement-vs-suggestion axis as TASK-006 (already open); lean-flow's ADR is gates-as-suggestion, not gates-as-code | reject — no new info |
| Garbage-collection workflows — recurring background agent scans, continuous small refactor PRs against entropy | TD-NNN aging (`≥3 sprints → re-review`, CONTEXT.md) is lean-flow's periodic-drift analog; the *mechanism* (recurring dispatch) is composable today from `/refactor-advisor` + built-in `/schedule`/`/loop` — lean-flow ships no scheduler itself by design (no hooks) | reject |
| End-to-end agent autonomy — reproduce, fix, validate, handle review, merge, escalate only on judgment | AFK task class + `night-run.md` (unattended `sprint-bulk`, stall/escalate path) covers the unattended-execution half; the merge-autonomy half is a deliberate divergence, not a gap (`dispatch.md`: "resolution is coordinator-owned, never a blind sub-agent") | reject |
| Reduced merge friction — minimal blocking gates, short-lived PRs, flaky-test reruns instead of blocking | Host CI concern, out of lean-flow's scope; `dispatch.md`'s per-task (not whole-wave) halt is the loop-level analog already shipped | reject |

## Recommendation

**Clean reject — file nothing new.** Every technique in the article either (a) is already the shape
of an existing lean-flow mechanism, (b) restates a tension TASK-006 already tracks without adding
new information, or (c) is host-project/app-code infrastructure outside a markdown skill library's
scope. The one real philosophical divergence — OpenAI's fully autonomous merge vs lean-flow's
coordinator-owned merge — is a considered design choice (Human-gated axiom), not an oversight; no
ADR needed since nothing here is *new* information changing that call.

## Out of scope / open questions

- If lean-flow ever reopens TASK-006 (enforced vs suggested gates), this doc's two enforcement-axis
  rows (taste-into-linters, Ralph Wiggum full-autonomy) are corroborating evidence to attach there —
  not a new question on their own.
