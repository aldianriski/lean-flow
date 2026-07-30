---
sprint: 036
slug: preflight-and-verify
owner: Maintainer
last_updated: 2026-07-30
status: closed
plan_commit: 0f34b54
close_commit: [set at close]
update_trigger: sprint execute/close events
---

# SPRINT-036 — Preflight and Verify

> **Theme:** Build ADR-013's adopted leg — the prose cure first (base-ref rule), then the
> laziness-ladder rung that decides whether JSON ever enters the plugin (no-JSON preflight) —
> and close the two standing verification gaps (SPRINT-034's cold read · the unattended contract
> from the installed cache). v1.20 opener; T2's captured answer gates all further graph work.

## Scope

**In:** base-ref branching rule in dispatch + night-run · no-JSON preflight prototype + ADR-013
addendum · SPRINT-034 cold-read (L-006 leg) · headless unattended-contract verify from the plugin
cache (L-016 leg).
**Out (deferred):** the JSON DAG format itself (admitted only if T2's rung fails) · TASK-116 eval
fixture (next — wants T4's fixture) · TASK-117 preflight design (waits on T4's result) · TASK-120
run-state (blocked, ADR-013 expiry SPRINT-040).

## Plan

### T1 — Add the base-ref branching rule to dispatch `[size: S · risk: low · class: execution · HITL]` (TASK-118)
Layers: skills/orchestrator/references/dispatch.md · skills/orchestrator/references/night-run.md
Depends-on: none
The 2026-07-30 incident (L-055): worktrees branched from session-start HEAD, undetected until
merge. The rule is the root-cause fix; any artifact is enforcement only (ADR-013).

**Acceptance:** both references state the rule — worktrees branch from the wave's declared base
commit, verified against live HEAD at spawn, mismatch halts, re-verified at each wave boundary —
and the rule is traced once against the L-055 incident.

**DoD:**
- [x] dispatch.md parallel/worktree section carries the rule (spawn-time verify + wave-boundary re-verify)
- [x] night-run.md carries it at its dispatch step, consumer-legible (no repo-local refs — L-015; inline rationale, zero L-NNN cites by design)
- [x] traced against the L-055 incident (would it have caught the stale branch point?) → Execution Log

### T2 — Prototype the no-JSON dispatch preflight `[size: S · risk: low · class: execution · HITL]` (TASK-119)
Layers: (throwaway prototype — /prototype discipline; capture → ADR-013 addendum)
Depends-on: T1
ADR-013's laziness-ladder precondition: nobody verified markdown+script can't already do the
checks. One question: does a bash/prose preflight over the markdown Plan suffice?

**Acceptance:** a preflight derives cycle + shared-file single-owner + base-ref-vs-HEAD checks
directly from a real active sprint's markdown Plan; the captured answer decides the JSON DAG's
fate in an ADR-013 addendum; the prototype is then deleted.

**DoD:**
- [x] preflight derives all three checks from the active sprint's markdown Plan (this sprint = the real input, L-007) — plus wave computation (T1→w0, T2→w1, T3/T4→w0, matching the G2 sequence)
- [x] exercised once; output verified against the known structure + 3 negative fixtures (cycle · multi-owner · wrong base) each FAILing with the named finding
- [x] ADR-013 addendum records: **rung SUFFICIENT → JSON DAG rejected**; (a) becomes a preflight step; prototype scratch-only, deleted

### T3 — Cold-read SPRINT-034's shipped wording from a fresh context `[size: S · risk: low · class: execution · HITL]` (TASK-109)
Layers: (review — correction only if the cold read finds a gap)
Depends-on: none
SPRINT-034's L-007 exercise was an author-run text trace; no independent reader checked the
wording (L-006). A fresh-context agent that wrote none of it closes that leg.

**Acceptance:** the four SPRINT-034 surfaces are read cold and each is confirmed unambiguous or
corrected.

**DoD:**
- [x] fresh-context read of: orchestrator intake routing + spawn red flag · night-run Part 1a + Part 2 precondition · CONTEXT § Unattended clause · /flow launcher bullet
- [x] each surface confirmed unambiguous or corrected (3 gaps, all S: "feed pipeline"→"routing checks" · mode-note vs Part 0 table contradiction rewritten · flow's night-run.md path qualified; CONTEXT clause clean)
- [x] findings → Execution Log; closes SPRINT-034's stated verification gap

### T4 — Verify the unattended contract from the installed plugin `[size: S · risk: low · class: execution · HITL]` (TASK-106)
Layers: (verification — no source change)
Depends-on: none
SPRINT-033 verified repo source only; the packaged consumer path is unverified (L-016). Version
deliberately unpinned (L-048) — verify whatever current release the cache holds.

**Acceptance:** with the current release in the plugin cache (verified first, never assumed), a
headless `claude -p "/lean-flow:orchestrator sprint-bulk unattended" --permission-mode dontAsk`
run meets a HITL step and parks — proving the contract ships.

**DoD:**
- [x] cache version verified current before the run (updated 1.18.0 → 1.19.0 in-session; probe re-verified)
- [x] headless run meets a HITL step and parks, never self-approves (all four HITL tasks parked; no reshaping, no default-yes; L-042 respected on the shared tree)
- [x] result → Execution Log (probe self-appended its park record; fixture notes kept for TASK-116, incl. the /handoff-allowlist gap)

## Owner-action checklist
- [x] Update the plugin cache to v1.19.0 before T4 — done in-session (`claude plugin update lean-flow@lean-flow`, 1.18.0 → 1.19.0)

## Decisions (pre-locked)

- **D1** — T2 is throwaway: only the captured answer + ADR-013 addendum persist; code deleted at capture.
- **D2** — Overlap map: dispatch.md + night-run.md are T1-owned (T2 reads, never edits); T3/T4 touch no source. Sequence: T1 → T2; T3 · T4 free.

## Assumptions

- **A1** — The cache can be brought to v1.19.0 before T4; if the marketplace lags, T4 verifies the current installed release instead (unpinned, L-048). *Confirm: owner-action tick.*
- **A2** — T2 may REJECT the JSON DAG outright — a valid ADR-013 outcome, not a failure. *Confirm: addendum written either way.*
- **A3** — T3 finds at most S-sized wording gaps. *Confirm: anything larger logs a scope-change before edits.*

## Execution Log

### 2026-07-30 | T2 complete | rung SUFFICIENT — JSON DAG rejected, ADR-013 addendum written
Prototype (163-line POSIX sh, scratch-dir only): positive pass on the real Plan incl. wave
computation; 3 negative fixtures each isolate their named finding. Strongest reason: the drift
surface a JSON schema would guard is already closed by qa-check §11's mandatory-field lint.
Real bug found en route: `while read` on unterminated stream silently drops the last Layers token
— a gate failing silent-false-negative, caught ONLY by the negative fixtures (→ Retro learning
candidate). Follow-up at close: productionize the preflight as the dispatch pre-step (ADR-013
condition 3). All 12 DoD now ticked — sprint ready to close.

### 2026-07-30 | T4 confirmed | coordinator verified the probe result — TASK-106 closed
Probe stdout matches the self-appended entry below; exit 0, clean halt. Contract proven on the
CONSUMER path (installed 1.19.0 cache), closing SPRINT-033's last unverified edge (L-016).
Follow-up for close: /handoff missing from the night-run Part 1 allowlist (probe's denied-tool
record) → file as TASK at Retro. The probe's uncommitted append is folded into this commit.

### 2026-07-30 | T4 probe | unattended run parked — contract held on the consumer path
Written by the headless probe itself (`sprint-bulk unattended` · `dontAsk` · skill served from
plugin cache **v1.19.0** = current, cache precheck holds). Guard green (single active sprint,
open DoD); batch G1+G2 accepted as pre-signed over the frozen Plan (already-approved-in-scope).
Probe then met the per-task loop: **every Plan task is declared `HITL`-class** (header meta =
TODO.md source) → each parks under Part 0 — no self-approval, no default-yes, no task reshaped
to dodge the gate. No disjoint AFK work belongs to the probe → clean halt via `/handoff`.
- T4 · parked-hitl · this entry is the probe's result; owner confirms the contract held and ticks T4's DoD
- Fixture notes (→ TASK-116): mode signal honored from trigger text alone · HITL boundary taken
  from declared tags, not derived consent · probe detected the coordinator's uncommitted WIP in
  the shared tree (T3 fixes + this file) and refused to stage/commit anything (L-042) — this
  append rides uncommitted for the coordinator's own commit · T2 left untouched (coordinator-
  dispatched, T1-owned files read-only to others per D2).
- handoff · denied-tool · `Skill(/handoff)` refused under `dontAsk` (outside the probe's allowlist)
  — recorded, not worked around; this entry stands as the halt record. Morning fix: Part 1
  allowlist builder should include the `/handoff` invocation (fixture note → TASK-116).

### 2026-07-30 | T3 complete | cold read found 3 author-blind gaps — L-006 leg closed
Fresh-context reader on the four SPRINT-034 surfaces: (1) "never bypasses the feed pipeline" read
two ways (checks vs the feed skill itself) → "these routing checks"; (2) night-run.md Mode note
claimed all of steps 1–4 map to ⛔ park rows — cold verification against Part 0's table found
2-of-4 (G1/G2 row is conditional-✅, step 1 has no row) → rewritten via the derivation rule;
(3) flow's bullet cited bare `night-run.md`, unresolvable from flow's own dir → path qualified.
Core contract consistent across all four surfaces (launcher runs pre-flight · trigger last).
Fixes applied inline (trivial wording, coordinator); qa-check at next commit gate.

### 2026-07-30 | T1 complete | base-ref rule shipped + incident trace: CAUGHT
T1 `858eb9d`. Trace: declared base at the 2026-07-30 spawn would have been 4a4ac71 (live HEAD);
worktrees were cut from 3ce0ddd (session start) — mismatch → wave halts pre-spawn; the cherry-pick
merges and the confused agent never happen. Cache updated to 1.19.0 in-session (A1 confirmed —
`claude plugin update lean-flow@lean-flow`); T4 headless probe launched against it. T2 dispatched.

### 2026-07-30 | gates | batch G1+G2 signed off
Fast-path G1 (same-session promote). G2: D1/D2 confirmed; **no worktree isolation** — L-055
applied at design time (worktrees branch from session-start HEAD, here pre-v1.19.0): agents work
in the main tree with base declared = 400866e, verified at start. A1 resolved by attempt (T4
tries the cache update itself). Sequence: T1→T2 · T3 ∥ · T4 after cache check.

### 2026-07-30 | promote | plan locked
Four tasks pulled (TASK-118/119/109/106 → T1–T4). Governance scan clean (no L-promotions · no TD
aging · TODO at cap boundary accepted). First sprint rendered under the T5 schema — header meta
carries class + autonomy; Depends-on explicit.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

**Retrieval check** — no miss; two retrieval WINS: the headless probe applied L-042 (refused to
commit over coordinator WIP) and Part 0 unprompted, from the installed cache; G2 applied L-055 at
design time (no-worktree sequencing) before TASK-118 even shipped the rule.

**Worked**
- The probe as its own scribe: T4's evidence was written by the thing under test, on the consumer
  path — the strongest L-016 verification yet, and it cost one background run.
- Negative fixtures on the T2 gate: caught a silent false-negative the positive run couldn't (→ L-058).
- The cold read (T3): 3 author-blind gaps in supposedly-settled text, incl. a prose-vs-table
  contradiction — L-006's third confirmation.
- Laziness ladder held under pressure: the JSON DAG — the external review's flagship proposal —
  died to a 163-line shell script exercised honestly.

**Friction**
- `/handoff` denied under `dontAsk` — the clean-halt protocol can't complete headless (→ TASK-122).
- `claude plugin update lean-flow` fails unqualified; needs `lean-flow@lean-flow` (minor, noted for
  TASK-116's fixture).

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- L-058 (a gate needs a must-FAIL fixture per check) — filed, count 1.

**Buckets routed:** Shipped → CHANGELOG v1.20.0 (at release) · Tech debt → none · Follow-ups →
TASK-121 (productionize preflight) · TASK-122 (/handoff allowlist) · Learnings → L-058.
