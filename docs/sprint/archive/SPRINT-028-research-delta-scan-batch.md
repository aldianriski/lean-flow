---
sprint: 028
slug: research-delta-scan-batch
owner: Maintainer
last_updated: 2026-07-29
status: closed
plan_commit: 558fb1d
close_commit: pending
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
- [x] `graphify-daily-value.md` re-verdict dated 2026-07-29+, claims tested against the current repo feature set (delta over existing surface, not standalone merit)
- [x] Outcome routed: stance re-affirmed in place, or an evidenced `TASK-NNN` integration proposal filed (TASK-040 guardrails cited)

### T2 — Scan: OpenAI harness-engineering adaptation `[size: S · risk: low · AFK]` <!-- TASK-094 -->
Layers: `docs/research/` (new scan doc)
Article techniques may overlap what the Claude harness already provides — Claude-harness
equivalents count as "already covered"; only the provider-agnostic unmatched remainder is a keeper.

**Acceptance:** a delta-scan doc mapping each technique → existing surface, keepers isolated.

**DoD:**
- [x] Scan doc maps every technique to the existing surface first (L-017); only the unmatched remainder kept
- [x] Fleet-relevant findings cross-referenced into the fog-map's harness-inventory ticket

### T3 — Scan: uditakhourii/adhd skill repo `[size: S · risk: low · AFK]` <!-- TASK-095 -->
Layers: `docs/research/` (new scan doc)
Popularity alone is not a keep signal; the L-017 base rate says most candidates reject.

**Acceptance:** a delta-scan doc; keepers filed as proposals or a clean reject recorded.

**DoD:**
- [x] Scan doc written; per-candidate delta mapping against the existing surface
- [x] Keepers filed as Backlog proposals OR a clean reject recorded with per-candidate rationale

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

### 2026-07-29 | dispatch | T1+T2+T3 fanned out in parallel
Batch G1 (fast-path) + G2 owner-approved. 3 Sonnet `general-purpose` agents, shared tree (worktrees
rejected: unpushed base → L-046 hazard); L-043 git-ban + L-014 fetch-to-cite briefed verbatim.
T2's cross-ref target resolved during G1: the fog-map = `fog-fleet-orchestration.md`, harness-inventory
ticket already resolved + pre-linked to TASK-094. Coordinator owns knowledge-index regen + commits.

### 2026-07-29 | T1 done | graphify re-verdict: RE-AFFIRMED (Option C holds)
Commit-pinned README diff (be3dcfca → HEAD) + CHANGELOG 0.9.25–0.9.29, all fetched. Delta: rebrand +
benchmarks (marketing, RAG-corpus-shaped) + opt-in `--strict` mode (the exact enforced-gate shape
council rejected for TASK-040 — corroborates the TASK-006 tension, doesn't flip the stance). Token-cost
claim (0 LLM credits, local AST) unchanged. No integration task. Doc 101/120 lines, append-only kept.

### 2026-07-29 | T2 done | harness-engineering: CLEAN REJECT (0 keepers / 12 techniques)
All 12 mapped to existing surface, the tracked TASK-006 tension, or host-infra out-of-scope. The one
philosophical divergence (autonomous merge vs coordinator-owned) is a considered reject. **Source
caveat:** openai.com 403'd (bot-blocked); scanned from an attributed gist mirror — noted in the doc's
Fetch status. **Review catch (L-009 class):** agent inserted the fog-map cross-ref blockquote
MID-TABLE, splitting the ticket table — relocated below the table, rows re-verified contiguous.

### 2026-07-29 | T3 done | adhd repo: 1 micro-keeper (doc addendum) / 8 rejects
Core mechanism (isolated parallel frames → separate critic) duplicates `/council`'s architecture;
ideation use-case already ruled out by `brainstorming-adaptation.md` (~90% owned). Sole unmatched
remainder — the N×substrate dispatch-cost multiplier (absent from ADR-010 + dispatch.md) — filed as
**TASK-099** (P3 · S · ready). Popularity explicitly not weighed (L-017).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/research/graphify-daily-value.md` | T1 | dated re-verdict appended — stance re-affirmed | Low | per-claim fetched evidence · self-review · qa-check |
| `docs/research/harness-engineering-adaptation.md` | T2 | new delta-scan doc (clean reject 0/12) | Low | self-review · qa-check |
| `docs/research/fog-fleet-orchestration.md` | T2 | fleet cross-ref note (repositioned below ticket table) | Low | table rows re-read contiguous (L-009) |
| `docs/research/adhd-adaptation.md` | T3 | new delta-scan doc (1 micro-keeper / 8 rejects) | Low | self-review · qa-check |
| `TODO.md` | T3 | TASK-099 filed (the keeper) | Low | qa-check |
| `docs/knowledge-index.md` | all | regenerated over the 3 new/updated research docs | Low | gen-index.sh · qa-check "index current" |

## Retro

**Retrieval check** — none: L-009 · L-014 · L-017 · L-043 · L-046 were all found and actively
applied (no miss, no contradiction; no TASK-040 signal).

**Worked**
- 3-wide shared-tree parallel dispatch: zero collisions, git-ban held, both new-file agents and the
  edit-in-place agent stayed inside their assigned files. Worktrees correctly rejected at G2 (L-046).
- Fetch-to-cite briefs (L-014) produced commit-pinned evidence (T1 diffed the README at the prior
  verdict's date) — the re-verdict is checkable, not vibes.
- Scoped per-task commits off one settled wave; qa-check gated on its own exit (L-045 applied).

**Friction**
- gen-index run mid-wave → stale-index QA FAIL; had to regenerate after the wave settled (→ L-047).
- T2's cross-ref landed mid-table, splitting the ticket table — L-009's second occurrence, caught
  only by coordinator review (→ L-009 count 2, promotion due next promote).
- openai.com bot-blocked (403 ×2); T2 scanned an attributed gist mirror — provenance caveat recorded
  in the doc's Fetch status, not ledger-worthy.

**Buckets routed** — Shipped → CHANGELOG (docs-only dated note, no release) · Tech debt → none ·
Follow-ups → TASK-099 (filed mid-run) · Learnings → L-009 bump + L-047 (docs/LEARNINGS.md).
