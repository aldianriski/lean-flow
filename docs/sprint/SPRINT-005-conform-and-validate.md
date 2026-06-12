---
sprint: 005
slug: conform-and-validate
owner: Maintainer
last_updated: 2026-06-12
status: active
plan_commit: 45c6200
close_commit: TBD
update_trigger: sprint execute/close events
---

# SPRINT-005 — Conform & Validate

> **Theme:** Clear the SPRINT-004 follow-ups and the overdue council debt. Conform `/council` under
> ADR-006 (resolving TD-002/004), fix the close→release-patch sprint-scope gap, and **exercise the
> spec-only additions on real input** (migrate consolidation · changelog-only · diff-scoped review) —
> directly honouring the new L-007 rule. Toward v1.0 (unblocks TASK-017).

## Scope

**In:** TASK-005 (council conform) · TASK-025 (close→release-patch fix) · TASK-023 (exercise migrate
consolidation) · TASK-024 (exercise changelog-only + diff-scoped review).
**Out (deferred):** TD-005 explicit CONTEXT diet (not in chosen scope — but T1 must not worsen it) ·
CHANGELOG rotation (§11 trigger fired but deferred — changelog still small) · TASK-017 (v1.0, still
blocked until TASK-005 + TD-005 land).

## Plan

### T1 — Conform `/council` under ADR-006 `[size: S · risk: low]`
Layers: `skills/council/` (+ `references/`) · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `skills/lean-doc-generator/references/DOCS_Guide.md`
Council's SKILL is 341 lines (TD-002) and the cap rule reads absolute despite council being the
documented exception (TD-004). ADR-006 settled it: the cap counts the procedure only; executable
artifacts move to `references/`. Restructure accordingly. (TASK-005)

**Acceptance:** council SKILL ≤ ~110 with artifacts in `references/`; amended cap rule recorded; TD-002 + TD-004 resolved.

**DoD:**
- [x] advisor definitions + prompt templates + worked example → `skills/council/references/` (advisors.md · prompts.md · example.md)
- [x] `council/SKILL.md` trimmed to **60** ≤ ~110 (when-to-use · 6-step outline · red flags · per-step read pointers) — resolves **TD-002**
- [x] amended cap rule written into `CLAUDE.md` (×2) + `DOCS_Guide §2` — resolves **TD-004**. *(CONTEXT.md skipped: the cap rule was never stated there — grep-confirmed — and A2 says don't worsen TD-005.)*
- [x] ADR-006 / DECISIONS linkage intact; SKILL cap-note cites ADR-006; no broken pointers

### T2 — Fix close→release-patch handoff for sprint scope `[size: S · risk: med]`
Layers: `skills/release-patch/SKILL.md` · `skills/lean-doc-generator/SKILL.md` · `skills/orchestrator/SKILL.md`
Discovered at SPRINT-004 close: release-patch scans `HEAD~1..HEAD` (one commit), so a multi-commit
sprint whose close commit is docs-only gets wrongly skipped; and a feature sprint (MINOR) is refused/
mis-bumped. Close the gap. (TASK-025)

**Acceptance:** the close→release path handles a multi-commit sprint and routes MINOR by hand correctly.

**DoD:**
- [ ] release-patch (or the close step) scans the sprint range `plan_commit..HEAD`, not `HEAD~1..HEAD`
- [ ] a feature sprint (MINOR) routes to a documented by-hand MINOR path, not a PATCH bump / skip
- [ ] documented in release-patch + the close step (lean-doc / orchestrator); caps held

### T3 — Exercise the migrate consolidation sweep on a real repo `[size: S · risk: low]`
Layers: validation run (exercises `migration-map.md`; fixes only if a bug surfaces)
T5 shipped consolidate/retire spec-only. Run it on a real repo with dupes/orphans/stale docs and
confirm the gated behaviour. (TASK-023) **Needs an owner-provided target repo.**

**Acceptance:** consolidate + retire run on real input; archive-default + gated hard-delete confirmed; zero un-approved deletions.

**DoD:**
- [ ] `/lean-doc-generator migrate` run on a real repo with known duplicate / orphan / stale docs
- [ ] consolidate + retire proposed, approved per-item, applied
- [ ] archive-default + gated hard-delete confirmed; zero un-approved deletions (diff verified)

### T4 — Exercise changelog-only release-patch + diff-scoped review on real code `[size: S · risk: low]`
Layers: validation run (exercises `release-patch` + `orchestrator/references/review-scoping.md`)
T3 + T1b shipped spec/doc-exercised only. Confirm on real input. (TASK-024) **Needs an owner-provided
manifestless repo + a real code diff.**

**Acceptance:** changelog-only entry produced on a manifestless repo; the skip table fires correctly on a real code diff.

**DoD:**
- [ ] manifestless repo → release-patch emits a changelog-only entry (no bump), confirmed
- [ ] real code diff → diff-scoped review skip table fires (security surface → `/security-review` · behaviour unchanged → skip `/verify` · already-read → skip `Explore`)
- [ ] both confirmed on real input

## Owner-action checklist
- [ ] **Provide a target repo for T3** — one with duplicate / orphan / stale docs (a dev-flow copy served prior migrate validation).
- [ ] **Provide a target for T4** — a manifestless project + a real code diff to review.

## Decisions (pre-locked)
- **D1** — `/council` restructure follows **ADR-006** (cap counts procedure only; executable artifacts → `references/`). Already recorded; no new ADR.

## Assumptions
- **A1** — T3/T4 require an owner-provided target repo. *Confirm: owner-action checklist (blocks those tasks at G2 until supplied).*
- **A2** — T1's `CONTEXT.md` edits must not worsen TD-005 (151 lines); diet if feasible. *Confirm: G2 (T1).*
- **A3** — T2's release-patch change must not break the existing single-commit hotfix path. *Confirm: G2 (T2).*

## Execution Log

### 2026-06-12 | promote | plan locked
SPRINT-005 rendered from the Backlog (TASK-005 · 023 · 024 · 025) via `/lean-doc-generator promote`.
Governance: **L-007 promoted** → CLAUDE.md anti-pattern (spec-only behaviour must be exercised once),
collapsed to a pointer; TD-002/004 covered by T1, TD-005 re-review (medium, not in scope — T1 must not
worsen); CHANGELOG rotation triggered but deferred (small). Plan frozen.

### 2026-06-12 | T1 | council conformed under ADR-006 (4/4 DoD)
Session model. Extracted the executable artifacts to `skills/council/references/` (advisors · prompts ·
example); `council/SKILL.md` trimmed **341 → 60** (procedure outline + per-step pointers). Cap rule
amended in CLAUDE.md (×2) + DOCS_Guide §2 to ADR-006 wording (artifacts in `references/` don't count);
council-exception dropped — it now conforms. **TD-002 + TD-004 resolved** (route at close). CONTEXT.md
intentionally untouched (cap rule wasn't there; A2 — don't worsen TD-005).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/council/SKILL.md` | T1 | trimmed 341 → 60 (procedure-only per ADR-006) | Low | 60 ≤ 110 |
| `skills/council/references/advisors.md` | T1 | new — the 5 advisor definitions (artifact) | Low | SKILL points to it |
| `skills/council/references/prompts.md` | T1 | new — 4 sub-agent templates + verdict structure (artifact) | Low | SKILL points to it |
| `skills/council/references/example.md` | T1 | new — worked example (artifact) | Low | SKILL points to it |
| `.claude/CLAUDE.md` | T1 | cap rule amended (procedure + scaffolding; artifacts → references/, ADR-006); council exception dropped | Low | 64 ≤ 80 |
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T1 | §2 SKILL cap statement (ADR-006) added | Low | reads cleanly |

## Retro
<!-- Written at close. Route the buckets (DOCS_Guide §10): shipped → CHANGELOG · tech debt → TD-NNN ·
     follow-ups → TASK-NNN · learnings → LEARNINGS. Then archive (§11). -->

**Worked**
-

**Friction**
-

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
-
