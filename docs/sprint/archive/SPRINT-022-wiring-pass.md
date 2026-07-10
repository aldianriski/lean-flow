---
sprint: 022
slug: wiring-pass
owner: Maintainer
last_updated: 2026-07-10
status: closed
plan_commit: 81b5dff
close_commit: 5e827b2
update_trigger: sprint execute/close events
---

# SPRINT-022 — Wiring Pass

> **Theme:** Make the v1.9.0/v1.10.0 additions actually *fire and chain* across the loop. A wiring audit
> found three shipped-but-half-connected features: skill-powered dispatch is orphaned from the Implement
> steps, the Standards-vs-Spec split is never injected into the reviewer brief, and nothing routes foggy
> intent to fog-mode. Fixes only — no new capability → **PATCH v1.10.1**.

## Scope

**In:** wire the dispatch note into the Implement steps; inject the two-axis split into the reviewer
brief (+ record in CONTEXT); route foggy intent to fog-mode from orchestrator + flow + CONTEXT.
**Out (deferred):** expand–contract cross-refs (by design — scan scoped it to `/refactor-advisor` only);
the CHANGELOG v1.8.0-block rotation (file is lean); any new capability.

## Plan

### T1 — Wire skill-powered dispatch into the Implement steps `[size: S · risk: low]`
Layers: `skills/orchestrator/SKILL.md`
The "Dispatch by role" note (`:62-64`) is orphaned — quick/mvp/sprint-bulk Implement steps reference the
*Implement-routing* note (pick the skill) but never *dispatch*. Give the dispatch note an "at any Implement
step" hook (parallel to the routing note) and/or link the steps to it, so dispatch-with-skill actually fires.

**Acceptance:** reading any Implement step leads to "dispatch execution to a sub-agent handed its procedure skill."

**DoD:**
- [x] "Dispatch by role" note carries an "at any Implement step" hook (*"fires at every Implement step"*)
- [x] explicit link from the Implement-routing note to dispatch-with-skill (*"the routed skill is what the dispatched sub-agent runs — see Dispatch by role"*)
- [x] `orchestrator/SKILL.md` ≤110 (107)

### T2 — Inject Standards-vs-Spec into the reviewer brief + record in CONTEXT `[size: S · risk: low]`
Layers: `skills/orchestrator/references/review-scoping.md` · `.claude/CONTEXT.md`
The two-axis principle (`review-scoping.md:17-28`) is never in the *dispatched* reviewer's brief. Add it to
the brief-injection ("Scope every pass to the diff" / "When a pass fires"); record the split in CONTEXT's
gates/review prose (currently absent from the SSOT).

**Acceptance:** a dispatched reviewer is instructed to report Standards vs Spec separately; CONTEXT records it.

**DoD:**
- [x] reviewer brief instructs: report Standards vs Spec separately, never merged (review-scoping.md "Scope every pass" brief)
- [x] CONTEXT.md records the two-axis split (§ Built-in leverage, `/code-review` mention)
- [x] `CONTEXT.md` ≤130 (127)

### T3 — Route foggy intent to fog-mode (orchestrator + flow + CONTEXT) `[size: S · risk: low]`
Layers: `skills/orchestrator/SKILL.md` (freeform routing) · `skills/flow/SKILL.md` (Feed) · `.claude/CONTEXT.md` (feed-pipeline)
Neither upstream router points foggy intent at fog-mode; the `/flow` conductor is unaware of it.

**Acceptance:** a foggy intent is routed toward fog-mode from both the conductor and the build loop.

**DoD:**
- [x] orchestrator freeform routing mentions foggy / un-sliceable → `/task-decomposer` fog-mode
- [x] `/flow` Feed step (step 2) offers fog-mode for foggy intent
- [x] CONTEXT feed-pipeline line acknowledges fog-map
- [x] caps: orchestrator 108 · flow 48 · CONTEXT 127; qa 48/0 (skills 14=14)

## Owner-action checklist
- [ ] none

## Decisions (pre-locked)
- **D1 — overlap-ownership.** `orchestrator/SKILL.md`: T1 (Implement/dispatch, ~L54-64) + T3 (freeform, ~L24-27) — *disjoint hunks*; **T1 before T3**, `git add -p`. `.claude/CONTEXT.md`: T2 (gates/review) + T3 (feed-pipeline, ~L51-52) — *disjoint hunks*; **T2 before T3**, per-hunk (L-042/L-037).
- **D2** — fixes only (wiring/reword), no new behaviour → close as **PATCH v1.10.1** (`/release-patch` eligible).

## Assumptions
- **A1** — all three are wiring/reword edits within caps; no new capability, no roster change (stays 14). *Confirm: cap check at each task.*

## Execution Log

### 2026-07-10 | promoted | plan locked
Rendered from the wiring audit (3 tasks, audit-derived). Governance: no unpromoted count≥2 learnings
(L-016 promoted earlier this session); TD-008 re-review flagged (minor); CHANGELOG v1.8.0-block rotation
deferred (file lean). Plan frozen.

### 2026-07-10 | T1 done | dispatch ↔ Implement wired
Scoped "Dispatch by role" with "fires at every Implement step" + Implement-routing note now points to it
— the dispatch-with-skill mechanism is no longer orphaned from the steps that trigger it.

### 2026-07-10 | T2 done | Standards-vs-Spec injected
Two-axis instruction now IN the reviewer's brief-injection line (review-scoping.md) — a dispatched
reviewer is told to report Standards vs Spec separately, never merged. Recorded in CONTEXT § Built-in
leverage. The principle now fires, not just documents.

### 2026-07-10 | T3 done | foggy → fog-mode routed
Entry wiring added: orchestrator freeform routing + `/flow` step-2 Feed both route *foggy* intent to
`/task-decomposer` fog-mode (`--fog`); CONTEXT feed-pipeline acknowledges the fog-map. Fog-mode now has
an entry from the conductor and the build loop, not just self-trigger inside task-decomposer.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/SKILL.md` | T1 | dispatch note scoped to Implement steps + routing note links to it | Low | cap 107/110 |
| `skills/orchestrator/references/review-scoping.md` | T2 | two-axis instruction injected into the reviewer brief | Low | reference |
| `.claude/CONTEXT.md` | T2 | § Built-in leverage records Standards-vs-Spec split | Low | cap 127/130 |
| `skills/orchestrator/SKILL.md` | T3 | freeform routing: foggy → fog-mode | Low | cap 108/110 |
| `skills/flow/SKILL.md` | T3 | step-2 Feed offers fog-mode for foggy intent | Low | cap 48/110 |
| `.claude/CONTEXT.md` | T3 | feed-pipeline acknowledges fog-map | Low | cap 127/130 |

## Retro

**Retrieval check** — no miss. Dogfooded **L-020** immediately (the rule we wrote this session), plus
L-042/L-037 (disjoint-hunk overlap on orchestrator + CONTEXT, sequenced T1→T2→T3), L-012 (caps). No prior L/ADR contradicted.

**Worked**
- The independent wiring audit (`Explore`) pinpointed each gap at file:line — author-blind self-review would have missed them (L-006 pattern). Once pinpointed, the fixes were one-liners.
- Landing the review-split in the *brief* (not just the reference prose) is the difference between documented and firing — the core lesson of the whole pass.

**Friction**
- The gaps existed at all because v1.9.0/v1.10.0 shipped features without a wiring check — now codified (L-020 → CLAUDE.md anti-pattern + DoD "Wiring check"), so future additions won't repeat it.

**Pattern candidate** (→ `docs/LEARNINGS.md`)
- **L-020** — already filed *and* promoted this session (owner-directed): shipping ≠ wiring; wire a new capability into every job that triggers/chains it and verify it fires.

---

### Retro buckets filed (§10)
- **Shipped** → `docs/CHANGELOG.md` v1.10.1 (written by `/release-patch`, next step).
- **Tech debt** → none new (TD-008 stays open).
- **Follow-ups** → none — the wiring gaps are fully closed.
- **Learnings** → L-020 (filed + promoted earlier this session).
