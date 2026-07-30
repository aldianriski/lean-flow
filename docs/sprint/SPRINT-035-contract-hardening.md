---
sprint: 035
slug: contract-hardening
owner: Maintainer
last_updated: 2026-07-30
status: closed
plan_commit: 0d12cc0
close_commit: 7469411
update_trigger: sprint execute/close events
---

# SPRINT-035 — Contract Hardening

> **Theme:** Turn prose conventions into machine-verifiable contracts (external-review keeper,
> curated per L-017 delta map). Fix the four verified doc defects first — a contract layer built
> on contradictory wording is sand — then harden the task schema the dispatcher already assumes,
> and decide (not build) the machine-state-artifact fork that gates v1.20. Version target: v1.19.0.

## Scope

**In:** QA count-claim fix + drift lint · agent-terminology alignment · TD-010 resolution ·
harness-verdict revision · task-schema hardening (`depends-on:` + `class:`) · council decision on
the machine-state fork (execution graph / run-state / run events).
**Out (deferred):** implementing any machine-state artifact (T6 decides only — accepted items
graduate to v1.20 tasks) · behavioral eval suite (TASK-116, Backlog) · capability preflight
(TASK-117, needs-info) · combining fleet width with night-run duration (review's own "do not add").

## Plan

### T1 — Fix the QA template-count claim and lint QA.md against qa-check.sh `[size: S · risk: low · class: execution · AFK]` (TASK-112)
Layers: docs/QA.md · scripts/qa-check.sh
Depends-on: none
docs/QA.md claims 1 non-core template; the script defines 2 (DESIGN, QA-TESTCASE). The QA system
never checked its own doc — add QA.md to the claim-consistency surface so drift fails the run.

**Acceptance:** QA.md matches the script's counts and a future divergence fails `qa-check.sh`.

**DoD:**
- [x] docs/QA.md template-count row claims 2 non-core (DESIGN, QA-TESTCASE), matching `noncore=2`
- [x] qa-check.sh claim-consistency checks include docs/QA.md's own counts (mismatch → fail)
- [x] `sh scripts/qa-check.sh` passes

### T2 — Align agent-review terminology across surfaces `[size: S · risk: low · class: execution · HITL]` (TASK-113)
Layers: .claude/CONTEXT.md · .claude/CLAUDE.md · README.md · docs/ARCHITECTURE.md
Depends-on: none
CONTEXT.md both claims isolated `/code-review` passes and "no review agent"; "ships no agents"
reads as false to anyone watching subagents get dispatched. One wording sweep, four files.

**Acceptance:** one precise statement everywhere — gates are inline human-approved checklists;
code review may dispatch built-in/ad-hoc isolated subagents; no custom agent definitions shipped.

**DoD:**
- [x] CONTEXT.md contradiction replaced by the single precise statement
- [x] all four surfaces say "no custom agent definitions" — no bare "ships no agents" remains
      (CLAUDE.md + ARCHITECTURE.md judged already precise, untouched — surgical)
- [x] qa-check passes (line caps hold — CONTEXT.md at 117/130)

### T3 — Resolve TD-010: de-localize the shipped night-run reference `[size: S · risk: low · class: execution · HITL]` (TASK-114)
Layers: skills/orchestrator/references/night-run.md · TECH-DEBT.md
Depends-on: none
Two citations point at `docs/research/night-run.md`, which doesn't exist in a consumer's repo —
the L-015 leak class. Apply the W5 treatment already used in `prime` and `dispatch.md`: inline the
one-line rationale, drop the pointer.

**Acceptance:** a consumer reading night-run.md cold hits zero unresolvable references.

**DoD:**
- [x] both repo-local citations replaced by inline self-contained rationale
- [x] grep for `docs/` repo-local paths in the file comes back clean
- [x] TD-010 → `status: resolved → TASK-114` in TECH-DEBT.md

### T4 — Revise the harness-engineering verdict to name operational keepers `[size: S · risk: low · class: execution · HITL]` (TASK-115)
Layers: docs/research/harness-engineering-adaptation.md
Depends-on: none
The "no keepers" verdict conflated conceptual equivalence with operational equivalence. The
techniques map to existing surfaces, but the operational gaps (evals · machine-readable
scheduling/recovery state · maintenance recipe) are real and now tracked.

**Acceptance:** the verdict reads "no new core stages, but operational keepers" with pointers.

**DoD:**
- [x] verdict revised; keepers listed with pointers to TASK-111 / TASK-116
- [x] `sh scripts/gen-index.sh` re-run if ADR-009 metadata changed (metadata unchanged — skip correct)

### T5 — Harden the task schema with formal `depends-on:` and `class:` fields `[size: M · risk: med · class: execution · HITL]` (TASK-110)
Layers: .claude/CONTEXT.md · skills/task-decomposer · skills/orchestrator (+ references/dispatch.md) ·
skills/lean-doc-generator/templates/SPRINT.md.template · TODO.md header · scripts/qa-check.sh · docs/QA.md
Depends-on: T1, T2
Fleet scheduling and tier routing both assume per-task fields (`depends-on`, classification) that
no writer persists — the schema/runtime mismatch. Make the two fields canonical, wire every writer
and reader, and lint them mandatory on active-sprint tasks (L-020: wired, not just present).

**Acceptance:** a task written by `/task-decomposer` carries both fields; `/orchestrator` dispatch
consumes them; `qa-check.sh` fails an active-sprint task missing a mandatory field.

**DoD:**
- [x] CONTEXT.md § Task entry shape carries `depends-on:` + `class:` (decision | execution | mechanical-ingest)
- [x] writers updated: task-decomposer output shape · SPRINT.md.template (TODO.md: no schema
      artifact exists there — CONTEXT.md owns the shape; grep-verified, no edit needed)
- [x] readers updated: dispatch parallel-wave check uses `depends-on` · tier routing reads `class`
- [x] qa-check.sh fails an active-sprint task missing a mandatory field (sprint-block equivalents:
      class · HITL/AFK · Depends-on · Layers · Acceptance) — negative-tested per L-007
- [x] line caps hold (CONTEXT 119/130 · decomposer 94/110) · consumer-surface check (L-015 —
      reviewer caught one template leak, fixed in fa47d13)

### T6 — Decide the machine-state-artifact fork `[size: M · risk: med · class: decision · HITL]` (TASK-111)
Layers: docs/adr/ · docs/DECISIONS.md · (verdict doc) — decision only, no runtime code
Depends-on: none
Execution graph, checkpointed run-state, and structured run events are one fork: the first
machine-readable state files in a markdown-first plugin — the same axis council-2 held on
TASK-040. Council it once; the verdict gates the whole v1.20 phase.

**Acceptance:** an ADR records adopt/defer/reject per artifact (a: sprint DAG · b: run-state file ·
c: run-event log) with revisit-ifs; accepted items graduate to TASK-NNN, rejected → `.out-of-scope/`.

**DoD:**
- [x] `/council` run on the fork; verdict → docs/research/verdict-machine-state-artifacts.md
- [x] ADR-013 records the three per-artifact outcomes + revisit-ifs; DECISIONS.md row added
- [x] accepted → TASK-118/119 (+ TASK-120 blocked w/ expiry) · rejected → `.out-of-scope/run-event-log.md`

## Decisions (pre-locked)

- **D1** — Task schema stays human-readable markdown; the review's YAML shape is illustrative only.
- **D2** — T6 decides, never implements — no machine-state artifact lands in v1.19 regardless of verdict.
- **D3** — Shared-file ownership + commit order: `qa-check.sh`/`docs/QA.md` → T1 lands before T5
  extends them; `.claude/CONTEXT.md` → T2's wording sweep lands before T5's schema edit. Execution
  is sequential (sprint-bulk); at commit, shared files stage per-hunk (L-042).

## Assumptions

- **A1** — The external review is uncurated input; only delta-mapped keepers entered this sprint. *Confirm: decompose session 2026-07-30 (L-017 delta map).*
- **A2** — `[HITL|AFK]` already covers autonomy — lint only, no new field. *Confirm: T5 G1.*
- **A3** — Persisting `class:` at intake shifts classification earlier than ADR-010's dispatch-time model. *Confirm: T5 G2 must reconcile with ADR-010 before the edit.*
- **A4** — The three machine-state artifacts are one fork, councilled once. *Confirm: T6 council run — if the council splits the fork, log a scope-change.*

## Execution Log

### 2026-07-30 | T6 complete | council verdict ratified → ADR-013
Base run 11 calls (moderator + fact-verify both skipped: genuine split, pure judgment fork).
Verdict: (a) adopt w/ 3 conditions + no-JSON rung first · (b) defer w/ graduation contract +
5-sprint expiry · (c) reject. Owner ratified as recommended; A4 held — the council treated the
three as one fork without splitting it. Routed: TASK-118 (base-ref rule) · TASK-119 (no-JSON
preflight prototype, depends-on 118) · TASK-120 (blocked, expiry SPRINT-040) ·
.out-of-scope/run-event-log.md. New backlog entries dogfood T5's class:/depends-on: fields.
Peer review's all-missed catch (no kill-switch on DEFER items) became ADR-013's expiry clause.

### 2026-07-30 | wave-2 complete | T5 landed + scoped review FIX-FIRST → fixed
T5 `af6d951` (schema wired end-to-end, lint negative-tested). Fresh-context sonnet review on the
diff: FIX-FIRST — (1) shipped SPRINT template comment cited `qa-check.sh` (maintainer-only tooling)
= the exact L-015/TD-010 leak class T3 fixed this same sprint, reintroduced one task later;
(2) autonomy lint false-positived on wrapped headers; (3) `depends-on:` alignment; (4) 244-char
line reflow. All four fixed in `fa47d13`; qa-check 63/0. Informational (not blocking, for Retro):
ADR-010's pre-advisory amendment wording could read as binding on a cold read — candidate for a
future amendment pass. Retro candidate: the L-015 recurrence proves the fresh-context review pass
earns its cost even inside the sprint that fixes the same class.

### 2026-07-30 | wave-1 complete | T2 landed — all four wave-1 tasks merged
T2 `49831e9`: CONTEXT.md + README reworded; CLAUDE.md and ARCHITECTURE.md judged already precise
("no agent definitions of its own" / "no shipped agent files") and left untouched — surgical over
literal. qa-check 57/0. Wave 2 (T5) dispatching sequentially in the main tree — no worktree, so it
sees T1's qa-check.sh changes and T2's CONTEXT.md state (both are T5 inputs per D3).

### 2026-07-30 | wave-1 merge | T1 · T3 · T4 landed; T2 in flight
Agent worktrees branched from session-start HEAD (pre-promote), so merge-back = cherry-pick
(linear history kept): T3 `c073c97` · T1 `7e8e5c0` · T4 `da11d8a`. qa-check 57 pass / 0 fail
including T1's new QA.md-vs-script drift guard. T4 note: its worktree lacked TASK-111/116
TODO entries (branch-point artifact, present on main — no reconcile needed).

### 2026-07-30 | gates | batch G1+G2 signed off; A3 resolved
G1 fast-path (scope unchanged since same-session decompose approval). G2: D1–D3 confirmed;
3-wave sequence (T1·T2·T3·T4 parallel worktrees → T5 → T6). **A3 resolved: `class:` is an
advisory default** — decomposer persists the hint, dispatcher may override; ADR-010's
dispatch-time classification stays authoritative (T5 encodes this wording). Wave 1 dispatched
as 4 cheap-tier worktree-isolated subagents.

### 2026-07-30 | promote | plan locked
Six tasks pulled from Backlog (TASK-110…115 → T1…T6 in dependency order). Governance scan clean
(no L-promotions due · no TD aging · TODO.md 182-line cap accepted: close's archival drains it).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/QA.md` | T1 | claim matched to script (2 non-core) | Low | qa-check 57 pass |
| `scripts/qa-check.sh` | T1 | drift guard: QA.md count vs `noncore` | Low | new check passes |
| `skills/orchestrator/references/night-run.md` | T3 | W5 inline, repo-local refs dropped (L-015) | Low | grep `docs/` clean |
| `TECH-DEBT.md` | T3 | TD-010 → resolved → TASK-114 | Low | L-009 re-read clean |
| `docs/research/harness-engineering-adaptation.md` | T4 | verdict: operational keepers, tracked | Low | table verdicts untouched |
| `.claude/CONTEXT.md` | T2 | review-agent contradiction resolved | Low | qa-check caps 117/130 |
| `README.md` | T2 | "no custom agent definitions" phrasing | Low | qa-check 57 pass |
| `.claude/CONTEXT.md` | T5 | task shape: +`class:` +`depends-on:` | Med | cap 119/130 |
| `skills/task-decomposer/SKILL.md` | T5 | writer sets both fields (advisory class) | Med | cap 94/110 |
| `skills/lean-doc-generator/templates/SPRINT.md.template` | T5 | header meta + Depends-on line | Med | renders valid; leak fixed fa47d13 |
| `skills/orchestrator/references/dispatch.md` | T5 | readers: waves ← depends-on · tier ← class | Med | review clean post-fix |
| `scripts/qa-check.sh` | T5 | active-sprint mandatory-field lint | Med | negative test FAILs, restore PASSes |
| `docs/QA.md` | T5 | new check documented | Low | drift guard passes |
| `docs/sprint/SPRINT-035-contract-hardening.md` | T5 | mechanical header backfill | Low | L-009 re-read clean (review) |
| `docs/research/verdict-machine-state-artifacts.md` | T6 | council verdict (durable — ADR refs it) | Low | — |
| `docs/adr/ADR-013-machine-state-artifacts.md` + `docs/DECISIONS.md` | T6 | the fork decided, indexed | Med | template-conform |
| `TODO.md` (TASK-118/119/120) + `.out-of-scope/run-event-log.md` | T6 | graduation + rejection routed | Low | L-009 re-read + qa-check |

## Retro

**Retrieval check** — no miss: L-015/016/017, L-007, L-009, council-2/TASK-040, and ADR-010 were all
found and load-bearing (the delta map, the negative lint test, the council framing, the A3 grill).

**Worked**
- L-017 delta map at intake: a sprawling external review → 8 curated tasks, most of its roadmap
  folded or rejected before it could bloat the backlog.
- Fresh-context review on the one M-size diff: caught an L-015 recurrence the author provably
  couldn't see (→ L-056), plus a real lint false-positive.
- Council on a genuine fork: the split (reject↔adopt spread on b/c) was the signal; peer review's
  "all-missed" catch became ADR-013's expiry clause — the kill-switch none of the 5 lenses produced.
- Immediate dogfood: T5's `class:`/`depends-on:` fields used by T6's own routed tasks same-session.

**Friction**
- Worktree fleet branched from session-start HEAD → cherry-pick merges, one confused agent (→ L-055,
  TASK-118); the sprint's own live incident became the council's sharpest evidence.
- T5's DoD wording (backlog-entry field names) vs the sprint-block lint's actual field set needed a
  mapping note at tick time — spec'd against one surface, implemented against another.
- ADR-010's older amendment wording now reads ambiguously against advisory-default (→ TD-011).

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- L-055 (worktree base = declared state, verified at spawn) · L-056 (fixing an instance doesn't
  inoculate the sprint against the class) — both filed, count 1.

**Buckets routed:** Shipped → CHANGELOG v1.19.0 (at release) · Tech debt → TD-011 · Follow-ups →
TASK-118/119/120 (filed at T6) · Learnings → L-055 · L-056.
