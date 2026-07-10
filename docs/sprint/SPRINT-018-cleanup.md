---
sprint: 018
slug: cleanup
owner: Maintainer
last_updated: 2026-07-10
status: active
plan_commit: 7a1cb9d
close_commit: pending
update_trigger: sprint execute/close events
---

# SPRINT-018 — Cleanup

> **Theme:** Two cheap, ready P3 cleanups — fold the brainstorming-scan keepers into the G2 gate, and
> scope qa-check's corpus lint to tracked files (which also clears the stray-file false failure that's
> nagged the last two closes). Small refinements → a PATCH.

## Scope

**In:**
- Fold brainstorming keepers K1 ("too simple to need a design" anti-pattern) + K2 (section-by-section
  approval) into the gate guidance (TASK-058).
- Scope `qa-check.sh`'s corpus metadata lint to **git-tracked** files so a stray untracked `.md` no
  longer fails the gate (TASK-060).

**Out (deferred):** recon+tiers (TASK-056 → `/council`) · blocked P3 (006 · 040 · 047) · TD-008 (watch).

## Plan

### T1 — Fold brainstorming keepers (K1/K2) into the gate `[size: S · risk: low]`  *(TASK-058)*
Layers: `.claude/CLAUDE.md` · `skills/orchestrator/SKILL.md`
From the TASK-050 verdict: **K1** — name + pre-empt the "too simple to need a design" rationalization
(the exact excuse behind decompose→build-unrecorded); **K2** — offer section-by-section approval for L
designs. Land K1 as a CLAUDE.md anti-pattern (has headroom); K2 as a one-line note in orchestrator G2.

**Acceptance:** CLAUDE.md names the "too simple" rationalization as an anti-pattern; orchestrator G2
offers chunked approval for L designs. Nothing else from the obra skill is built.

**DoD:**
- [x] K1 "too simple to need a design" → CLAUDE.md anti-pattern
- [x] K2 section-by-section approval noted in orchestrator G2 (for L designs)
- [x] caps respected — CLAUDE 71→72/80; orchestrator held 107/110 (K2 in-place, no new line)

### T2 — Scope qa-check's corpus lint to tracked files `[size: S · risk: low]`  *(TASK-060)*
Layers: `scripts/qa-check.sh`
The corpus metadata lint currently scans every `docs/**/*.md` in the working tree, so a stray untracked
file (e.g. a WIP research doc) fails the gate. Scope it to **git-tracked** files (`git ls-files`) so
working-tree cruft is ignored — a tracked corpus doc missing metadata must still fail.

**Acceptance:** with an untracked stray `docs/research/*.md` present, `qa-check.sh` passes; a *tracked*
corpus doc missing metadata still fails. Exercised on the real working tree (mattpocock.md present).

**DoD:**
- [ ] corpus metadata lint scoped to git-tracked files
- [ ] exercised — qa-check passes with the untracked `mattpocock.md` present (L-007)
- [ ] no regression — a tracked corpus doc missing metadata still FAILS (guard not weakened)

## Owner-action checklist
- (none)

## Decisions (pre-locked)
- **D1 — No shared files.** T1 (`CLAUDE.md` + `orchestrator/SKILL.md`) and T2 (`scripts/qa-check.sh`)
  are disjoint → parallel-capable; run either order, no ownership contention.
- **D2 — Cap landing.** `orchestrator/SKILL.md` is at 107/110 — put K1 in `CLAUDE.md` (headroom), keep
  the orchestrator edit to ~1 line for K2 (L-012).
- **D3 — PATCH at close.** Small refinements (a guidance fold + a tooling fix), not a new capability →
  **v1.7.1 by `/release-patch`** (fixes-only) unless it reads as docs-only.

## Assumptions
- **A1** — `qa-check.sh` can scope its corpus scan via `git ls-files`. *Confirm: the script's structure
  at build.*
- **A2** — K1 → CLAUDE.md anti-pattern, K2 → orchestrator G2 note. *Confirm: at build (cap-driven).*

## Execution Log

### 2026-07-10 | promote | plan locked
Formed after SPRINT-017 close (user chose the P3 cleanup batch). Governance: nothing to promote/age.
No shared-file overlap (D1).

### 2026-07-10 | T1 done | brainstorming keepers folded into the gate
K1 → new CLAUDE.md anti-pattern ("too simple to need a design" — the rationalization behind wasted
work); K2 → orchestrator G2 note (present + approve an **L** design section-by-section, in-place, no
new line). Caps: CLAUDE 71→72/80; orchestrator held 107/110. Guidance-only (no runtime); closes
TASK-058 and drains the last brainstorming-scan keeper.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro
<!-- Written at close. Route buckets (DOCS_Guide §10): shipped → CHANGELOG · tech debt → TD-NNN ·
     follow-ups → TASK-NNN · learnings → LEARNINGS. Then archive → docs/sprint/archive/ + INDEX line. -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**
-

**Friction**
-

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
-
