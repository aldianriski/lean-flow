---
sprint: 021
slug: fog-mode-council-probe
owner: Maintainer
last_updated: 2026-07-10
status: active
plan_commit: 4ee5b5a
close_commit:
update_trigger: sprint execute/close events
---

# SPRINT-021 — Fog-Mode + Council Decorrelation Probe

> **Theme:** Ship the last mattpocock keeper — a wayfinder-style **fog-map mode** in `/task-decomposer`
> for work too foggy to plan up front — and run the **factual** cross-model decorrelation probe that the
> SPRINT-020 judgment probe (TASK-048) structurally couldn't, to properly gate TASK-047.

## Scope

**In:** (1) a fog-map mode in `/task-decomposer` (decision-tickets + fog-graduation, routing to existing
skills); (2) a probe of whether a genuinely different model catches factual errors the single-model
council shares.
**Out (deferred):** the multi-model council *backend* itself (TASK-047 — this only measures); a new
standalone skill (fog-mode is a *mode*, roster stays 14); OKF-export / graph view (TASK-040).

## Plan

### T1 — Build wayfinder fog-map mode in `/task-decomposer` `[size: M · risk: med]`
Layers: `skills/task-decomposer/SKILL.md` (mode entry) · `skills/task-decomposer/references/fog-map.md` (detail, uncounted L-012)
An optional **pre-decomposition** mode for foggy work too big to plan: produce a fog-map (Destination ·
Decisions-so-far · Not-yet-specified · Out-of-scope) of **decision-tickets** (research / prototype /
grilling / task · AFK|HITL) that **route to existing skills** (`/prototype`, grill, research-spike) and
**graduate into `TASK-NNN`** as the fog clears. It *sequences* what we have — it doesn't reimplement it.

**Acceptance:** `/task-decomposer` has a fog-map mode, exercised once on a real foggy problem.

**DoD:**
- [ ] fog-map mode added (SKILL.md mode entry + `references/fog-map.md` detail)
- [ ] fog-map artifact defined: Destination · Decisions-so-far · Not-yet-specified · Out-of-scope + decision-ticket types (research/prototype/grilling/task · AFK|HITL) routing to existing skills
- [ ] graduation defined: a resolved decision-ticket → `TASK-NNN` (feeds the normal decompose pipeline)
- [ ] roster stays 14 (a mode, not a skill); CONTEXT.md/README touched only if wording needs it; qa 14=14
- [ ] `task-decomposer/SKILL.md` ≤110 (detail in `references/`, L-012)
- [ ] **exercised once on a real foggy problem** (L-007) — the graph-view + OKF fog-map from this session is the candidate

### T2 — Probe cross-model factual decorrelation `[size: S · risk: low]`
Layers: `/council` (exercise only) · `docs/research/council-improvements.md` (findings)
Run a council-style comparison on a decision resting on **external facts** (knowable ground truth):
single-model personas vs **at least one genuinely different model**. Record whether the different model
catches factual errors the single-model set all share — the datapoint TASK-048's judgment fork couldn't
produce. Result gates TASK-047.

**Acceptance:** a findings note records whether a different model catches shared factual errors, on a real factual decision.

**DoD:**
- [ ] pick a real decision resting on external facts with a knowable ground truth
- [ ] run single-model personas + ≥1 genuinely different model on it
- [ ] record whether the different model catches factual errors the single-model set shares
- [ ] findings → `council-improvements.md`; result gates TASK-047

## Owner-action checklist
- [ ] none

## Decisions (pre-locked)
- **D1** — T1 fog-mode is a **mode** in `/task-decomposer`, not a new skill (roster stays 14); detail in
  `references/` (L-012). It routes to existing skills, never reimplements them (owner-confirmed at TASK-064's needs-info resolution).
- **D2** — no shared files between T1 (`task-decomposer/`) and T2 (`council`/`research`) → no overlap-ownership coordination needed.

## Assumptions
- **A1** — the fog-mode fills a real gap (foggy work too big to plan) — owner-confirmed; not re-grilled.
- **A2** — T2's "cross-model" is limited to **cross-tier Anthropic** (Opus/Sonnet/Haiku/Fable) — no external provider is available or consented (cf. TASK-047 data-governance). This is a *weaker* proxy for architectural diversity than cross-provider; the findings note the limit. *Confirm: at T2 execution.*

## Execution Log

### 2026-07-10 | promoted | plan locked
Rendered from TASK-064 + TASK-065. Governance at promote: **L-016 promoted** (count 2 → CLAUDE.md L-015
anti-pattern extension) + collapsed to pointer; **CHANGELOG rotated** (§11 — v1.7.1 & older → `docs/changelog/CHANGELOG-1.7.1.md`,
main 447→53 lines); TD-008 re-review flagged (minor, out of scope). Plan frozen.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route buckets (§10): shipped→CHANGELOG · debt→TD-NNN · follow-ups→TASK-NNN · learnings→L-NNN. Then archive (§11). -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**

**Friction**

**Pattern candidate** (→ `docs/LEARNINGS.md`)
