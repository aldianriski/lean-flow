---
sprint: 004
slug: token-and-doc-hardening
owner: Maintainer
last_updated: 2026-06-12
status: active
plan_commit: 5d7db71
close_commit: TBD
update_trigger: sprint execute/close events
---

# SPRINT-004 — Token & Doc Hardening

> **Theme:** Cut the post-change token cost and harden the doc/flow specs surfaced across SPRINT-003
> + the owner's improvement list. Tier-routing + diff-scoped review (the headline token leak),
> release-patch for unversioned repos, an optional design-system template, and a migrate clean-house
> pass. Foundations — token cost and spec correctness — before more features.

## Scope

**In:** the post-change token leak (tier-routing + diff-scoped review) · the 9 SPRINT-003 cold-run
frictions · release-patch auto-handoff + a changelog-only path for manifestless repos · an optional
frontend-only DESIGN.md template · a migrate consolidation (dedup/retire) sweep.

**Out (deferred):** TASK-005 (council conform under ADR-006 — clears overdue TD-002/004; separate
theme) · TASK-017 (v1.0 checklist — blocked) · TD-005 (CONTEXT cap — not yet due).

## Plan

### T1 — Cut token cost: model-tier routing + diff-scoped review discipline `[size: M · risk: med]`
Layers: `skills/orchestrator/SKILL.md` · `skills/council/SKILL.md` · `skills/task-decomposer/SKILL.md` · `.claude/CONTEXT.md` · a new orchestrator review reference
The post-change review fan-out re-scans the repo in each isolated pass **and** runs every pass on the
session model — the headline token leak. Route advisor / bounded mechanical work to cheap-tier
subagents, and scope each review pass to the diff + blast radius. (TASK-018)

**Acceptance:** orchestrator / council / task-decomposer carry explicit tier-dispatch **and**
diff-scoped review guidance; tier map in CONTEXT.md; exercised once on real work; orchestrator SKILL
stays ≤ cap (detail lives in a reference — resolves the TD-003 overflow risk).

**DoD:**
- [ ] Tier-dispatch guidance added (session model for gates · grill · design · synthesis; `sonnet`/`opus` subagents via the Agent-tool `model:` override for advisors + bounded mechanical work; **spawn-with-brief, never a mid-session switch**)
- [ ] Tier mapping recorded in `.claude/CONTEXT.md`
- [ ] Diff-scoped review discipline added to orchestrator Review (each pass scoped to `git diff` + changed files + direct callers; skip table — docs/config/trivial → self-review · no security surface → skip `/security-review` · behaviour unchanged → skip `/verify` · already-read → skip `Explore`; small diffs folded; security separate only with a real surface)
- [ ] Review-discipline detail pushed to a reference so `orchestrator/SKILL.md` stays ≤ ~110 (closes the TD-003 risk)
- [ ] Exercised once on real work (a live review pass or subagent dispatch) and confirmed

### T2 — Spec-polish bundle: 9 SPRINT-003 cold-run frictions `[size: S · risk: low]`
Layers: `skills/prime` · `skills/task-decomposer` · `skills/orchestrator` · `skills/lean-doc-generator/references/migration-map.md` · `templates/TODO.md.template` · `README.md`
A cold fresh-install run surfaced 9 spec gaps the authors couldn't see (L-006). Fix them so the next
cold agent doesn't trip on the same edges. (TASK-019)

**Acceptance:** all 9 frictions fixed.

**DoD:**
- [ ] prime: MEMORY-index fallback path + Active-Sprint pointer format stated inline
- [ ] task-decomposer: positive AFK criterion added
- [ ] orchestrator: owner-declined-tests escape hatch on TDD routing + quick-mode/Review ordering note
- [ ] `${CLAUDE_SKILL_DIR}` reader note added where skills reference it
- [ ] single-task-sprint exception documented for dogfood/validation runs
- [ ] README: install/update uses the marketplace-qualified id (`lean-flow@lean-flow`)
- [ ] migration-map: per-move inbound-link fixing made an explicit apply step

### T3 — release-patch: auto-handoff + changelog-only fallback `[size: S · risk: low]`
Layers: `skills/release-patch/SKILL.md` · `skills/lean-doc-generator/SKILL.md` · `skills/orchestrator/SKILL.md`
Manifestless repos hit `[skip] no manifest` and get nothing; and close only *prompts* release-patch.
Make close invoke it, and give unversioned repos a changelog-only path. Not merged — release-patch
stays a separate, standalone skill. (TASK-020)

**Acceptance:** close (lean-doc + sprint-bulk) invokes `/release-patch`; no-manifest → changelog-only
entry; worked examples for flat `VERSION` + changelog-only; release-patch unmerged.

**DoD:**
- [ ] `lean-doc-generator close` + `sprint-bulk` close **invoke** `/release-patch` (not just prompt)
- [ ] no-manifest fallback prepends a dated `docs/CHANGELOG.md` entry, no version bump (docs-only-diff abort still wins — A1)
- [ ] worked example added for the flat `VERSION` case **and** the changelog-only case
- [ ] release-patch remains a separate skill (NOT merged into lean-doc-generator)

### T4 — Optional frontend-only DESIGN.md (design-system / tokens) template `[size: S · risk: low]`
Layers: `skills/lean-doc-generator/templates/DESIGN.md.template` · `skills/lean-doc-generator/SKILL.md` · `skills/lean-doc-generator/references/DOCS_Guide.md`
Capture a UI design-system / token contract as a reusable, optional template for frontend host-repos —
outside the core doc set, never auto-created (it's stack-specific + part-HOW, a spec artifact). (TASK-021)

**Acceptance:** renamed + genericized template registered as optional / non-core / frontend-only;
DOCS_Guide notes it + a one-line WHY/WHERE carve-out.

**DoD:**
- [ ] `DESIGN.MD.template` renamed → `DESIGN.md.template` (casing)
- [ ] NYT-specific values genericized to `[CUSTOMIZE]`/`[bracket]` placeholders per template convention
- [ ] registered in lean-doc-generator as **OPTIONAL, non-core, frontend-only** (offered only for UI projects, never auto-created)
- [ ] DOCS_Guide notes it as a tier/optional doc **outside the core set**, with its create trigger + a one-line carve-out from the WHY/WHERE rule (spec/contract artifact)

### T5 — migrate: consolidation sweep (adopt + clean) `[size: M · risk: med]`
Layers: `skills/lean-doc-generator/references/migration-map.md` · `skills/lean-doc-generator/SKILL.md`
migrate today only *aligns* related docs; extend it to find and retire duplicate / orphan / stale docs
so adoption also cleans house — gated, never silent, never deleting content without approval. (TASK-022)

**Acceptance:** migrate gains a consolidation phase + two actions (consolidate / retire); every
proposal HITL.

**DoD:**
- [ ] migrate consolidation phase added: detect duplicates (same content 2+ places), orphans (no inbound links), stale/superseded (contradicts code / very old)
- [ ] migration-map.md gains **consolidate** (merge dupes) + **retire** (archive by default; hard-delete only on explicit per-item approval)
- [ ] every proposal HITL, never silent, never deletes content without approval
- [ ] SKILL.md migrate blurb updated to "adopt + clean"

## Owner-action checklist
- [ ] None — all tasks are dev/spec work.

## Decisions (pre-locked)
- **D1** — DESIGN.md ships as an OPTIONAL, frontend-only template, **not** a core doc (stack-specific + part-HOW; a spec/contract artifact). **→ no ADR** (easily reversible).
- **D2** — release-patch is **not** merged into lean-doc-generator; close auto-invokes it (it hard-stops at the push gate, so auto-invoke bypasses no human gate). **→ no ADR.**
- **D3** — point-1 token fix folds into T1; the review-discipline detail lives in a **reference** to keep `orchestrator/SKILL.md` ≤ cap (closes TD-003). Planning constraint, not an ADR.

## Assumptions
- **A1** — release-patch's docs-only-diff abort wins over the changelog-only fallback (a docs-only, manifestless diff has nothing to log → still skip). *Confirm: G2 (T3).*
- **A2** — T1 carries two legs (tier-routing + review-scoping); if size reads L at G1, split before proceeding. *Confirm: G1 (T1).*
- **A3** — migrate dedup/staleness detection is heuristic (link-graph + `last_updated` + content similarity) — flags for human judgment, never auto-decides. *Confirm: G2 (T5).*
- **A4** — the Agent-tool `model:` override is available in the host. *Confirm: at first cheap-tier dispatch (T1).*

## Execution Log

### 2026-06-12 | promote | plan locked
SPRINT-004 rendered from the Backlog (TASK-018·019·020·021·022) via `/lean-doc-generator promote`.
Governance: no learnings at count ≥ 2 (no promotions); TD-002/003/004 flagged overdue (≥3 sprints) —
TD-003 folded into T1's DoD, TD-002/004 deferred with TASK-005; no doc-aging due. Plan frozen.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro
<!-- Written at close. Route the buckets (DOCS_Guide §10): shipped → CHANGELOG · tech debt → TD-NNN ·
     follow-ups → TASK-NNN · learnings → LEARNINGS. Then archive (§11). -->

**Worked**
-

**Friction**
-

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
-
