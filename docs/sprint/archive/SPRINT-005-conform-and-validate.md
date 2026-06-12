---
sprint: 005
slug: conform-and-validate
owner: Maintainer
last_updated: 2026-06-12
status: closed
plan_commit: 45c6200
close_commit: 185b749
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
- [x] release-patch scans the sprint range `plan_commit..HEAD` at close (default `HEAD~1..HEAD` kept for standalone hotfix — A3)
- [x] feature sprint (MINOR) routes to a documented by-hand path at all 3 close callsites (orchestrator · lean-doc · flow), not a PATCH bump / skip
- [x] documented in release-patch (step 1 + when-to-invoke) + the close steps; caps held (orchestrator 107)

### T3 — Exercise the migrate consolidation sweep on a real repo `[size: S · risk: low]`
Layers: validation run (exercises `migration-map.md`; fixes only if a bug surfaces)
T5 shipped consolidate/retire spec-only. Run it on a real repo with dupes/orphans/stale docs and
confirm the gated behaviour. (TASK-023) **Needs an owner-provided target repo.**

**Acceptance:** consolidate + retire run on real input; archive-default + gated hard-delete confirmed; zero un-approved deletions.

**DoD:**
- [x] detect run on a real repo (umkm-indo): dupes/orphans/stale + out-of-scope scan all fired; caught a **false-positive** (adlc-flow `.claude/CONTEXT.md` wrongly looked like a consolidate target — gate + out-of-scope rule blocked it)
- [x] consolidate + retire proposed, approved per-item, applied (apply-path on a throwaway manifestless fixture — umkm-indo had no safe target)
- [x] archive-default + gated hard-delete confirmed; **zero un-approved deletions** (git verified: 2 archives as renames, 1 delete = only the explicitly-approved item)

### T4 — Exercise changelog-only release-patch + diff-scoped review on real code `[size: S · risk: low]`
Layers: validation run (exercises `release-patch` + `orchestrator/references/review-scoping.md`)
T3 + T1b shipped spec/doc-exercised only. Confirm on real input. (TASK-024) **Needs an owner-provided
manifestless repo + a real code diff.**

**Acceptance:** changelog-only entry produced on a manifestless repo; the skip table fires correctly on a real code diff.

**DoD:**
- [x] manifestless fixture → changelog-only entry prepended, **no bump**, push-gate `Version: n/a (changelog-only)` — confirmed (umkm-indo has `package.json`, so the fixture supplied the manifestless case)
- [x] real code diff → diff-scoped review skip table fires correctly: code+behaviour-change → `/code-review` + `/verify`, no security surface → skip `/security-review`; behaviour-unchanged → skip `/verify`; docs-only → self-review only
- [x] both confirmed on real input (throwaway fixture, deleted after)

## Owner-action checklist
- [x] **Provide a target repo for T3** — owner gave `D:\Project\temidev-project\umkm-indo` (used for the detect pass; apply-path on a throwaway fixture since umkm-indo had no safe target).
- [x] **Provide a target for T4** — umkm-indo is not manifestless (`package.json`); used a throwaway manifestless fixture for the changelog-only leg.

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

### 2026-06-12 | T2 | close→release-patch handoff fixed (3/3 DoD)
Session model. release-patch step 1 now scans `plan_commit..HEAD` at sprint close (default
`HEAD~1..HEAD` kept for standalone hotfix — A3); when-to-invoke notes the close routing. The 3 close
callsites (orchestrator step 6 · lean-doc close row · flow close) route **fixes-only → `/release-patch`
(PATCH) · feature sprint → MINOR by hand**. Caps held (orchestrator 107 · release-patch 97). This is
the exact gap hit at SPRINT-004 close.

### 2026-06-12 | T3 | migrate consolidation sweep exercised (3/3 DoD)
**Detect on umkm-indo (real):** dupe/orphan/stale + out-of-scope scans all fired; repo is well-maintained
(no dupes, no stale). Surfaced a **false positive** — root `CONTEXT.md` vs `.claude/CONTEXT.md` looked
like a consolidate target, but `.claude/CONTEXT.md` is **adlc-flow's SSOT** (out of scope). The gate +
out-of-scope rule blocked the merge → correct outcome: LEAVE both. **Refinement applied:** migration-map
clean-sweep now runs the out-of-scope filter *before* flagging consolidate candidates (two frameworks'
same-named files = coexistence, not a dupe). **Apply-path on a throwaway manifestless fixture** (umkm-indo
had no safe target): consolidate→archive · retire→archive (default) · retire→hard-delete (explicit
approval only); git verified **zero un-approved deletions**. Fixture deleted.

### 2026-06-12 | T4 | changelog-only + diff-scoped review exercised (3/3 DoD)
umkm-indo has `package.json` (not manifestless), so the changelog-only leg ran on the **fixture**:
no manifest + a code diff → dated CHANGELOG entry, **no bump**, push-gate `n/a (changelog-only)`.
Diff-scoped review skip-table classified all three diff shapes correctly (code+behaviour → code-review +
verify, no security surface → skip security-review; behaviour-unchanged → skip verify; docs-only →
self-review). Validates T3/T1b spec on real input (L-007 honoured).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/council/SKILL.md` | T1 | trimmed 341 → 60 (procedure-only per ADR-006) | Low | 60 ≤ 110 |
| `skills/council/references/advisors.md` | T1 | new — the 5 advisor definitions (artifact) | Low | SKILL points to it |
| `skills/council/references/prompts.md` | T1 | new — 4 sub-agent templates + verdict structure (artifact) | Low | SKILL points to it |
| `skills/council/references/example.md` | T1 | new — worked example (artifact) | Low | SKILL points to it |
| `.claude/CLAUDE.md` | T1 | cap rule amended (procedure + scaffolding; artifacts → references/, ADR-006); council exception dropped | Low | 64 ≤ 80 |
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T1 | §2 SKILL cap statement (ADR-006) added | Low | reads cleanly |
| `skills/release-patch/SKILL.md` | T2 | sprint-range scan (`plan_commit..HEAD`) + close-routing note | Med | 97 ≤ 110 |
| `skills/orchestrator/SKILL.md` | T2 | step 6: PATCH-vs-MINOR close routing | Low | 107 ≤ 110 |
| `skills/lean-doc-generator/SKILL.md` | T2 | close row: PATCH-vs-MINOR routing | Low | 89 ≤ 110 |
| `skills/flow/SKILL.md` | T2 | close step: PATCH-vs-MINOR routing | Low | 47 ≤ 110 |
| `skills/lean-doc-generator/references/migration-map.md` | T3 | clean-sweep runs out-of-scope filter before consolidate flagging (from the umkm-indo false-positive) | Low | reads cleanly |

> **T3/T4 note:** validation runs — umkm-indo (real, read-only; untouched) for detect; a throwaway manifestless fixture (created + deleted) for the apply-paths. No lean-flow product files changed beyond the migration-map refinement above.

## Retro
<!-- Written at close. Route the buckets (DOCS_Guide §10): shipped → CHANGELOG · tech debt → TD-NNN ·
     follow-ups → TASK-NNN · learnings → LEARNINGS. Then archive (§11). -->

**Worked**
- **ADR-006 made T1 mechanical** — a clear prior decision turned the council restructure into a clean extraction (341 → 60).
- **Real-repo validation earned its keep** — T3 on umkm-indo caught a false positive a synthetic test wouldn't have (an adlc-flow `CONTEXT.md` masquerading as a consolidate target); the gate + out-of-scope rule blocked it and the fix was applied on the spot.
- **Throwaway fixture** exercised both apply-paths (consolidate/retire + changelog-only) with zero risk to the real repo, then was deleted.

**Friction**
- umkm-indo had **no safe consolidate/retire target** (well-maintained; the one overlap was cross-framework) — so the consolidation *apply-path* on genuine real-repo dupes is still unexercised (fixture stood in).
- T4's changelog-only couldn't use the provided repo (`package.json` present) — the fixture filled the manifestless gap.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- Real-repo validation surfaces false positives that synthetic/spec review misses — reinforces L-006 (cold-run) + L-007 (exercise-on-real-input). Keep a real repo as the validation target, not only fixtures. *(Not filed as new L — reinforces existing; promote if it recurs.)*
