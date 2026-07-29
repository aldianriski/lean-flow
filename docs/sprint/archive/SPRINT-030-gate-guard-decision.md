---
sprint: 030
slug: gate-guard-decision
owner: Maintainer
last_updated: 2026-07-29
status: closed
plan_commit: 5d52450
close_commit: 76ea8f3
update_trigger: sprint execute/close events
---

# SPRINT-030 — Gate-Guard Decision

> **Theme:** Decide TASK-006. The PreToolUse research (`docs/research/pretooluse-gate-guard.md`)
> settled feasibility and killed the in-core option on platform fact; what remains is the
> principle-level fork — does enforcement enter the lean-flow ecosystem at all — and recording
> that durably. Decision sprint, not a build sprint.

## Scope

**In:** the `/council` run on the A-vs-C fork · the ADR recording the outcome · routing TASK-006 by the verdict
**Out (deferred):** building the hook or sibling plugin (a follow-up TASK only if C wins) · marker-file protocol design · any hook in lean-flow core (ruled out — D1)

## Plan

### T1 — Decide the gate-guard fork (A status-quo vs C sibling plugin) `[size: M · risk: med]`
Layers: reads `docs/research/pretooluse-gate-guard.md` <!-- scope-change 2026-07-29: council waived → owner decision; see Execution Log -->
It touches the hook-free-core principle (ADR-002 lineage) — hard-to-reverse and principle-level.
The research doc is the evidence base.

**Acceptance:** the A-vs-C fork is decided by the owner, explicitly.

**DoD:**
- [x] fork surfaced as an explicit owner decision (research doc as input)
- [x] decision recorded: **A — status quo** (2026-07-29)

### T2 — Record the decision as ADR-011 `[size: S · risk: low]`
Layers: `docs/adr/ADR-011-<slug>.md` · `docs/DECISIONS.md` · `docs/knowledge-index.md` (regen)
Clears the ADR bar (§4): hard-to-reverse + surprising (no per-hook opt-in on the platform) + a
real trade-off. The research doc becomes the ADR's Context.

**Acceptance:** ADR-011 accepted and indexed; knowledge index regenerated.

**DoD:**
- [x] ADR-011 written from the decision (research doc linked as Context)
- [x] `DECISIONS.md` entry + `sh scripts/gen-index.sh` run

### T3 — Route TASK-006 by outcome `[size: S · risk: low]`
Layers: `TODO.md` · `.out-of-scope/` (only if A wins)
Close the loop so the backlog reflects the verdict — no zombie task.

**Acceptance:** TASK-006 resolved — A: closed with an `.out-of-scope/gate-guard-hook.md` entry ·
C: follow-up build TASK filed (`ready`, sized) and TASK-006 removed.

**DoD:**
- [x] TASK-006 removed from Backlog with a trail matching the verdict (out-of-scope entry + pointer)

## Decisions (pre-locked)

- **D1** — Option B (hook inside lean-flow core) ruled out on platform fact: plugin hooks auto-activate with no per-hook disable ⇒ in-core = mandatory for every consumer, violating the opt-in requirement + hook-free core. → folds into ADR-011.

## Assumptions

- **A1** — The hook facts (fail-open · deny overrides all permission modes · all-or-nothing activation) hold as of the 2026-07-29 docs. *Confirm: re-check `hooks.md`/`plugins-reference.md` at ADR write if a Claude Code release lands in between.*

## Execution Log

### 2026-07-29 | promote | sprint formed from TASK-006 (unblocked by PreToolUse research)
Research ran same-session (claude-code-guide sweep → `docs/research/pretooluse-gate-guard.md`);
TASK-006 → `ready`; single-task decision sprint promoted.

### 2026-07-29 | scope-change | T1 council run waived → owner decision at the gate
What broke: nothing technical — at the G1+G2 popup the owner chose "approve, but skip council"
(cost-aware: ~11 calls ≈ 11× base context vs a fork already reduced to two options with B
pre-ruled-out). Impact: T1's council/verdict DoD replaced by a direct owner decision; no
`verdict-gate-guard.md` is produced — ADR-011's Context leans on the research doc alone. G2
re-confirmed in the same popup exchange before this edit.

### 2026-07-29 | T1 done | fork decided by owner: **A — status quo, no enforcement**
Surfaced as an AskUserQuestion fork (A recommended on YAGNI); owner picked A.

### 2026-07-29 | T2 done | ADR-011 written + DECISIONS indexed + knowledge index regenerated

### 2026-07-29 | T3 done | TASK-006 routed out — `.out-of-scope/gate-guard-hook.md` (revisit-if recorded) · Backlog pointer left

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/research/pretooluse-gate-guard.md` | pre-T1 | feasibility facts that unblocked TASK-006 | Low | qa-check frontmatter lint |
| `docs/adr/ADR-011-no-gate-enforcement.md` | T2 | the decision, durably | Low | qa-check + index regen |
| `docs/DECISIONS.md` | T2 | index row | Low | qa-check |
| `.out-of-scope/gate-guard-hook.md` | T3 | rejection memory + revisit trigger | Low | read-back |
| `TODO.md` | T3 | TASK-006 removed with pointer | Low | structure re-read (L-009) |

## Retro

**Retrieval check** — no misses; the research correctly built on ADR-002 and the D1 pre-lock.

**Worked**
- Research-first unblock: a task blocked since ~Sprint-017 became a same-day decision once the
  feasibility facts landed (one claude-code-guide dispatch, ~86k tokens).
- Cost-labeled gate options: pricing the council run (~11× context) in the G2 popup let the owner
  take the cheap path deliberately — the scope-change was informed, not silent.

**Friction**
- release-patch (run earlier this session) bumped the manifests but not the README footer version
  echo; qa-check caught it one commit later → L-048.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- L-048 filed (count 1): version echoes outside the manifest cascade escape release-patch's
  stale-doc clear — grep the old version string repo-wide before the push gate.
