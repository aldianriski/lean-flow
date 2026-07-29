---
sprint: 028
slug: research-delta-scan-batch
owner: Maintainer
last_updated: 2026-07-29
status: active
plan_commit: 558fb1d
close_commit: —
update_trigger: sprint execute/close events
---

# SPRINT-028 — Research Delta-Scan Batch

> **Theme:** Clear the pooled P2 research scans in one batch. Every scan runs the L-017 discipline —
> map each candidate technique onto lean-flow's existing surface FIRST; only the unmatched remainder
> is a keeper (most candidates → fast rejects). Scans decide, they don't build: keepers land as
> Backlog proposals, never direct edits.

## Scope

**In:** three delta-scan docs under `docs/research/` — graphify re-verdict (TASK-092) · OpenAI
harness-engineering adaptation (TASK-094) · uditakhourii/adhd skill repo (TASK-095).
**Out (deferred):** implementing any keeper (files as `TASK-NNN` proposals) · any graphify
integration (TASK-040 guardrails bind; blocked on the TASK-041 signal) · touching skills/templates.

## Plan

### T1 — Re-scan Graphify-Labs/graphify against the prior verdict `[size: S · risk: low · AFK]` <!-- TASK-092 -->
Layers: `docs/research/graphify-daily-value.md`
The prior verdict (on-demand only, no integration) is the delta base; the repo's feature set has
moved since. Test the token-cost / popularity claims against the CURRENT feature set per L-017.

**Acceptance:** the research doc carries a dated re-verdict — on-demand stance re-affirmed OR an
integration task filed with evidence.

**DoD:**
- [ ] `graphify-daily-value.md` re-verdict dated 2026-07-29+, claims tested against the current repo feature set (delta over existing surface, not standalone merit)
- [ ] Outcome routed: stance re-affirmed in place, or an evidenced `TASK-NNN` integration proposal filed (TASK-040 guardrails cited)

### T2 — Scan: OpenAI harness-engineering adaptation `[size: S · risk: low · AFK]` <!-- TASK-094 -->
Layers: `docs/research/` (new scan doc)
Article techniques may overlap what the Claude harness already provides — Claude-harness
equivalents count as "already covered"; only the provider-agnostic unmatched remainder is a keeper.

**Acceptance:** a delta-scan doc mapping each technique → existing surface, keepers isolated.

**DoD:**
- [ ] Scan doc maps every technique to the existing surface first (L-017); only the unmatched remainder kept
- [ ] Fleet-relevant findings cross-referenced into the fog-map's harness-inventory ticket

### T3 — Scan: uditakhourii/adhd skill repo `[size: S · risk: low · AFK]` <!-- TASK-095 -->
Layers: `docs/research/` (new scan doc)
Popularity alone is not a keep signal; the L-017 base rate says most candidates reject.

**Acceptance:** a delta-scan doc; keepers filed as proposals or a clean reject recorded.

**DoD:**
- [ ] Scan doc written; per-candidate delta mapping against the existing surface
- [ ] Keepers filed as Backlog proposals OR a clean reject recorded with per-candidate rationale

## Decisions (pre-locked)
- **D1** — Overlap map: T1 edits an existing doc; T2/T3 each create a new file — fully disjoint,
  no `depends-on` → parallel-dispatch eligible (all AFK). No shared-file owner needed.

## Assumptions
- **A1** — Prior graphify verdict is the delta base; TASK-040 guardrails still bind any integration. *Confirm: `docs/research/graphify-daily-value.md` at T1 start.*
- **A2** — The harness-engineering article is provider-agnostic enough to adapt; Claude-harness equivalents count as covered. *Confirm: during the T2 scan.*
- **A3** — Most adhd candidates reject (L-017 base rate). *Confirm: during the T3 scan.*

## Execution Log

### 2026-07-29 | promote | plan locked
Governance review signed off (TD-008 re-reviewed + stamped · CHANGELOG v1.10.0–v1.12.0 rotated to
`docs/changelog/CHANGELOG-1.12.0.md` with the lost v1.12/v1.11 headings restored · no L-promotion due).
Three ready P2 scans pulled; disjoint per D1.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint? (yes → a Learnings-bucket friction + the TASK-040 signal)

**Worked**
- _(at close)_

**Friction**
- _(at close)_

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- _(at close)_
