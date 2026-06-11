---
sprint: 003
slug: validate-and-harden
owner: Maintainer
last_updated: 2026-06-11
status: active
plan_commit: c777fec
close_commit: pending
update_trigger: sprint execute/close events
---

# SPRINT-003 — Validate & Harden

> **Theme:** Earn v1.0 the curated way — every shipped component exercised once on real input.
> Sprint-002 fixed the dogfood frictions; this sprint proves the fixes and the never-run paths
> (`migrate` · `/council` · streams · fresh install) before TASK-017 unblocks the 1.0.0 bump.

## Scope

**In:** `migrate` on a real legacy repo · one real `/council` run → ADR · two-stream exercise in a test repo · fresh marketplace install · re-dogfood the full loop on the published v0.2.0.
**Out (deferred):** TASK-005 council-size decision (`needs-info` — though T2 may *produce* its answer, the slimming itself stays out) · TD-005 CONTEXT diet (TASK-017's DoD) · hooks / recon / insights (TASK-006–008) · the 1.0.0 bump itself (TASK-017, after close).

## Plan

### T1 — Test `/lean-doc-generator migrate` on a real legacy repo `[size: M · risk: med]` — from TASK-003
Layers: external legacy repo (dev-flow / adlc-flow / ad-hoc) · `references/migration-map.md`
The last medium-severity spec-only path (TD-001). Detect → plan → approve → apply, surgically.

**Acceptance:** migrate run end-to-end on a real repo; content provably intact; `/prime` reads the result cleanly.

**DoD:**
- [x] Target legacy repo selected and migrate run: detect → per-file plan → approval → apply (dev-flow copy)
- [x] No pre-existing content deleted (diff-verified: 669 → 685 = exactly the 16 created files; CHANGELOG/blueprint hash-identical)
- [x] `/prime` reads the migrated repo cleanly (canonical placement throughout; 35-link ADR index resolves; README cross-ref fixed)
- [x] TD-001 migrate leg recorded as burned in the TD row

### T2 — Run `/council` once on a real high-stakes decision `[size: S · risk: low]` — from TASK-014
Layers: `docs/adr/` · `docs/DECISIONS.md`
The council has never executed (TD-001). Suggestion: use TASK-005's open question — "slim `/council` toward the cap vs formalise the exception" — as the subject; one run then both exercises the skill and produces the TASK-005 decision input.

**Acceptance:** `verdict-<slug>.md` produced by the full 5-advisor + peer-review path; the call recorded as an ADR.

**DoD:**
- [x] Real decision selected (owner confirmed: TASK-005's question)
- [x] Council run end-to-end → `verdict-skill-cap-executable-artifacts.md` (temp dir)
- [x] Verdict folded into a recorded ADR (ADR-006) + `docs/DECISIONS.md` row
- [x] TD-001 council leg recorded as burned (TD-001 now fully resolved — all three legs)

### T3 — Exercise streams: two parallel sprints in a test repo `[size: M · risk: med]` — from TASK-015
Layers: throwaway test repo
T3 of Sprint-002 has never seen a second stream; validate before v1 claims it.

**Acceptance:** two active sprints with distinct `stream:` coexist and the tooling behaves per spec; single-stream path regression-free.

**DoD:**
- [x] Test repo with two streams, one active sprint each (per-stream TODO pointers)
- [x] `/prime` reports open DoD per stream; `sprint-bulk` asks which sprint
- [x] Cross-stream file overlap flagged at batch-G2 when files are shared
- [x] Single-stream repo re-checked: zero behavioral change

### T4 — Fresh-install test from the marketplace `[size: S · risk: med]` — from TASK-016
Layers: clean test repo · plugin cache
What users actually run is the cache, not this working tree.

**Acceptance:** v0.2.0 installs clean and the loop runs in a host repo that is not lean-flow itself.

**DoD:**
- [ ] `claude plugin marketplace add` on a clean repo; 13 skills auto-discover
- [ ] `${CLAUDE_SKILL_DIR}` template/reference paths resolve from the cache
- [ ] `/prime` degrades gracefully on an empty repo (all `[MISSING]`, no abort)
- [ ] Loop stages run in the non-lean-flow host

### T5 — Re-dogfood the fixed loop on a real feature `[size: M · risk: low]` — from TASK-013
Layers: external repo · `docs/LEARNINGS.md`
The validation half of the friction→fix cycle: confirm the four Sprint-002 fixes from the user side.

**Acceptance:** full loop run on the published v0.2.0; the original four frictions verifiably gone.

**DoD:**
- [ ] Full loop (prime → decompose → promote → orchestrate → close) on a real feature
- [ ] Grill verifiably fires at intake; generated docs land per §2 placement
- [ ] L-001…004 confirmed fixed (or count-bumped + re-filed)
- [ ] Any new friction filed (L-NNN / TD-NNN / TASK-NNN)

## Owner-action checklist
- [ ] `git push origin main` (13 commits — the skills never push)
- [ ] Update/reinstall the plugin so the cache serves v0.2.0 (T4/T5 precondition)
- [ ] Pick the council subject for T2 (TASK-005's question recommended)

## Decisions (pre-locked)
- **D1** — T4/T5 run against the *published* v0.2.0, not the working tree — what users run is the cache; testing the tree validates nothing about distribution.
- **D2** — T2 may use TASK-005's question as its subject, but TASK-005 itself stays in the Backlog until its decision is recorded — task scopes don't merge.

## Assumptions
- **A1** — v0.2.0 is pushed and the plugin cache updated *before* T4/T5 execute (T1–T3 don't need it). *Confirm: owner (checklist above).*
- **A2** — A real legacy repo (dev-flow / adlc-flow / ad-hoc docs) is available for T1. *Confirm: owner.*

## Execution Log

### 2026-06-11 | promote | sprint planned
Promoted TASK-003 + TASK-013…016 (all `ready`; TASK-005 stays — `needs-info`). Dependency order:
local-first (T1 migrate · T2 council · T3 streams), push-gated last (T4 install · T5 re-dogfood).
Governance review: L-001…005 all count 1 — none promotable; TD aging — none ≥ 3 sprints, no high;
**first §11 doc-aging run: proposed + owner-approved archiving SPRINT-001 → `docs/sprint/archive/`
(`c777fec`) — the propose-before-act behavior verified live.** Plan frozen.

### 2026-06-11 | T1 deferred | owner call — token budget
G1+G2 approved (T1–T3 sequence, dev-flow copy, council on TASK-005, push after T1–T3). T1 recon +
copy + per-file migrate plan completed and approved-pending, but the **apply** step (~3k lines read /
~1.5k rewritten: CLAUDE/CONTEXT/TODO reformats, 15-ADR split, codemap fold, 46-sprint archive) is
token-heavy; owner deferred it to prioritize improvement-per-token. Copy retained at
`%TEMP%\migrate-test-dev-flow`; the plan in this session's log is reusable verbatim. T1 DoD stays open.

### 2026-06-11 | T3 complete | streams exercised — 4/4 checks pass
Throwaway repo (`%TEMP%\streams-test-repo`): two streams (`checkout` · `reporting`), one active
sprint each, planted overlap on `src/shared/api-client.ts`. Results: per-stream prime count
(`4 open (checkout: 3 · reporting: 1)`) ✓ · sprint-bulk guard asks-which on >1 active ✓ ·
cross-stream overlap detected from Layers lines alone ✓ · single-stream zero-diff (this repo is the
control — pointer format byte-identical) ✓. Caveat logged: spec followed by its own author;
fresh-context validation lands with T4/T5.

### 2026-06-11 | halt | T2 deferred (owner: token budget) — sprint paused
Council run (~11 sub-agent calls) deferred like T1. Sprint state: **T3 done** · T1/T2 deferred
(owner call, resumable any session — T1's migrate plan is in this log; T2's subject is confirmed:
TASK-005) · T4/T5 awaiting owner push + plugin-cache update (A1). Resume with
`/orchestrator sprint-bulk` after the push.

### 2026-06-11 | T1 complete | migrate validated on dev-flow copy — via a sonnet executor
Resumed after owner reset the token budget. The approved plan's **apply was delegated to a fresh
`sonnet` subagent with a self-contained brief (TASK-018's spawn-with-brief pattern, validated live
pre-implementation: ~96k tokens spent on the cheap tier).** Result: R1–R8 all done — 15 ADRs split
from the 381-line log → thin 43-line index · TODO reformatted + refined-task-list folded · 44 sprints
archived + INDEX · codemap folded → ARCHITECTURE, original archived · leave-list verified untouched
(hash checks). Strong-model verify pass caught two nits: stale README→CODEMAP link (fixed — the
brief should make per-move link-fixing explicit) and the over-cap flag placed *above* frontmatter
(fixed — flag must go below the header or it breaks parsing). Mojibake scare was PS5.1 console
decoding only — files clean UTF-8; no L-005 recurrence. Executor flags all legitimate (incl. a real
ADR-017/018 numbering gap in dev-flow's own history).

### 2026-06-11 | T2 complete | first live /council run → ADR-006
Full method executed: 5 advisors (sonnet, parallel) → 5 anonymized peer reviews (sonnet) → chairman
synthesis inline on the session model (TASK-018 tiering: ~10 of 11 calls on the cheap tier).
Genuine 3-way advisor split (slim / exception / fix-the-rule); peer review converged 5/5 on
First-Principles' reframe, and 4/5 reviewers independently demanded the missing access-pattern
audit — chairman ran it (templates+advisors = executable artifacts; worked example = separable).
**Verdict: amend the cap rule (procedure-only count; executable artifacts in references/ by
convention), then conform /council — no exception remains.** → ADR-006 · TD-001 fully resolved ·
TASK-005 re-scoped to "conform under ADR-006", state ready. The council→verdict→ADR feed worked
end-to-end on first contact.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `%TEMP%\migrate-test-dev-flow\*` (external) | T1 | migrate plan applied by sonnet executor; verified | Low | inventory diff + hashes |
| `docs/adr/ADR-006-skill-cap-executable-artifacts.md` | T2 | NEW — cap-rule amendment, council-pressure-tested | Low | §4 template |
| `docs/DECISIONS.md` | T2 | ADR-006 row | Low | link check |
| `TODO.md` | T1+T2 | TD-001 resolved · TASK-005 re-scoped ready | Low | self |

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
_(written at close)_
