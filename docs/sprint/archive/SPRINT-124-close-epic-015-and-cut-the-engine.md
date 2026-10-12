---
sprint: 124
slug: close-epic-015-and-cut-the-engine
epic: EPIC-015
owner: Maintainer
last_updated: 2026-10-12
status: closed
plan_commit: 443cc5ac
close_commit: 8e875a6
gates_signed: G1,G2 @ 1c11a350
update_trigger: sprint execute/close events
---

# SPRINT-124 — Close EPIC-015 and Cut the Engine

> **Theme:** SPRINT-122 proved CW5, CW6 and CW7, so EPIC-015 has one open condition left: re-arm the freeze, widened to
> governance work (TASK-417). This sprint first fixes the stale-marker defect its close left behind (TASK-426, TD-247 Option A).
> It then cuts the conformance engine's Windows wall clock against the target TASK-421's profile set (TASK-404, TD-168, the
> ledger's one `high` row), and closes the epic last, so the re-armed freeze lands on a finished execution architecture.

## Scope

**In:** the run-id-stamped USER_STOP marker (`426`) · a ≥50% cut of the engine's Windows wall clock (`404`) · the widened-freeze
ADR and EPIC-015's close (`417`).
**Out (deferred):** TD-247 C6 (the guard accepts an unbacked USER_STOP; it stays open with its census) · bulk disposition of the
aged TD rows · TASK-422 / 366 / 367 / 322 / 402.

## Members

- docs/work/todo/TASK-426-stamp-the-user-stop-marker-with-the-run-id.md
- docs/work/todo/TASK-404-cut-the-shell-conformance-engines-per-file-process-spawning.md
- docs/work/todo/TASK-417-re-arm-the-execution-freeze-widened-to-governance-and-close-epic-015.md

## Plan

### T1 — Stamp the USER_STOP marker with the run's id `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/night-run.sh` · `evals/run-reap-terminal-fixtures.sh` · `evals/fixtures/night-run-reaper/` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-426-stamp-the-user-stop-marker-with-the-run-id.md`
  · `docs/work/in_progress/TASK-426-stamp-the-user-stop-marker-with-the-run-id.md`
Depends-on: none
Cites: `TASK-426` · TD-247 (C3) · TASK-425 (Option A ruled) · ADR-050 (Consequential G) · ADR-016

The launcher decides what an unattended run reports, so this is Consequential Tier G: the full bar, seeded breaks and a
worktree-isolated outside review. Option A was ruled at SPRINT-122 close; Option B was rejected because it changes Part 4.

**Acceptance:** a stale `.stop` marker with a foreign id reads as its log implies, never USER_STOP, and a real TERM still reports
USER_STOP.

### T2 — Cut the Shell engine's per-file process spawning `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-conformance-engine-fixtures.sh` · `docs/research/logs/qa-gate-timing.md`
  · `TECH-DEBT.md` · `evals/run-adr-family-fixtures.sh` · `evals/run-sprint-family-fixtures.sh`
  · `docs/work/todo/TASK-404-cut-the-shell-conformance-engines-per-file-process-spawning.md`
  · `docs/work/in_progress/TASK-404-cut-the-shell-conformance-engines-per-file-process-spawning.md`
Depends-on: none
Cites: `TASK-404` · TD-168 · TASK-421 (the profile) · `qa-gate-timing.md` Round 23 · ADR-034 · ADR-043 · ADR-050 · ADR-051
  · `conformance.sh` (run to measure, not edited)

`conformance.sh` executes this engine, so the change is Consequential Tier G and the compatibility contract (ADR-034) is the bar:
no verdict, finding id or exit meaning may move. Round 23 names five rules' per-row spawn loops as the cost; G2 picks which to
batch.

**Acceptance:** the engine's run against this repo on the Windows host takes ≤ 216.5 s (from 433.1 s), with the before and after
measured on the same host and tree, and every retained engine fixture is unchanged.

### T3 — Re-arm the execution freeze, widened to governance, and close EPIC-015 `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/adr/` · `docs/DECISIONS.md` · `docs/knowledge-index.md` · `docs/research/adlc-epic-sequencing.md`
  · `docs/epic/EPIC-015-execution-autonomy.md` · `.claude/CLAUDE.md` (the placement target, ruled at G2) · `docs/LEARNINGS.md`
  · `docs/work/todo/TASK-417-re-arm-the-execution-freeze-widened-to-governance-and-close-epic-015.md`
  · `docs/work/in_progress/TASK-417-re-arm-the-execution-freeze-widened-to-governance-and-close-epic-015.md`
Depends-on: T1, T2
Cites: `TASK-417` · EPIC-015 CW8 · D1 · V3 §56/§58 · Codex review rounds 1–2 (2026-10-10)

The interim restriction of 2026-10-10 becomes an ADR, so only one version of the rule stays live. T3 runs last, after the
sprint's other work, so the freeze lands on the finished execution architecture.

**Acceptance:** the ADR is live, the interim paragraph has been replaced, and EPIC-015 has all eight conditions `[x]`.

## Owner-action checklist
- [ ] Sign G1 + G2 (`/orchestrator sprint-bulk`) and record `gates_signed:`. At G2, settle T2's batching design and T3's
      placement targets and admission-record shape.
- [ ] Rule the ADR text for T3 (Tier P: G1 + a read-through).

## Decisions (pre-locked)
- **D1** — `TECH-DEBT.md` is shared by T1 (TD-247) and T2 (TD-168). Commit in Plan order, T1 first, and stage per hunk.
- **D2** — The interim governance restriction applies until T3 replaces it. T1 is a defect fix (TD-247 C3). T2 meets a measured
  cost (TD-168: Rounds 17–18 and 23). Neither adds new governance machinery.
- **D3** — T3 runs last (`Depends-on: T1, T2`). The ADR it lands governs work admitted after it, not this sprint's own members.

## Assumptions
- **A1** — The 50% target is reachable by batching the five spawn loops Round 23 names, without changing a rule's verdict.
  *Confirm: G2 recon of the engine. If not reachable, T2 stops for a target ruling, never a quieter acceptance.*
- **A2** — The Windows host's before-figure (433.1 s, Round 23) still holds on today's tree. *Confirm: T2 re-measures before
  it changes the engine.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-124-close-epic-015-and-cut-the-engine.md`, created at promote (ADR-014;
> SPRINT-121 lesson).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/night-run.sh` | T1 | the `.stop` marker carries `<signal> <run start>`; reap() reports USER_STOP only for its own run | High | reap-terminal fixtures 31 PASS + 3 seeds + Codex + isolated seed |
| `evals/run-reap-terminal-fixtures.sh` | T1 | real epochs, plus two stale-marker must-FAIL cases (foreign id, no id) | Med | the harness itself |
| `scripts/lib/conformance-engine.sh` | T2 | five per-row spawn loops batched; Codex R1: quotepath off, byte-exact role hits | High | report `cmp` (Windows; dash+gawk/mawk) + 9 seeds + Codex ×2 + isolated |
| `evals/run-adr-family-fixtures.sh` | T2 | `proposed-then-accepted-passes`, `non-ascii-name-edited-fires` | Med | the harness itself |
| `evals/run-sprint-family-fixtures.sh` | T2 | TDAGING age edges, LOGPAIR re-add, WHENITRUNS unphased close | Med | the harness itself (VPS) |
| `TECH-DEBT.md` | T1 · T2 | TD-247 C3 resolved · TD-168 resolved · TD-249 filed | Low | census per row |
| `docs/research/logs/qa-gate-timing.md` | T2 | Round 24 | Low | figures re-derived from the time files |
| `docs/adr/ADR-053-…` · `docs/DECISIONS.md` · `docs/knowledge-index.md` | T3 | the freeze re-arms, widened to governance machinery | Med | owner read-through |
| `docs/research/adlc-epic-sequencing.md` | T3 | § FROZEN amendment → ADR-053; interim paragraph removed | Low | grep: no second live copy |
| `.claude/CLAUDE.md` | T3 | one Anti-Pattern line for ADR-053 | Med | caps 80/80 · density 4 ≤ 4 · gate 283/0 |
| `docs/LEARNINGS.md` | T3 | L-217 re-disposed to ADR-053 | Low | — |
| `docs/epic/EPIC-015-execution-autonomy.md` | T3 | CW8 `[x]`, epic closed | Low | `check-epic-archive` PASS |

## Retro

**Retrieval check:** mixed. L-130's cross-check caught an unsourced figure ("941 commits") before it froze into ADR-053. The 5.7%
`skills/` share was re-derived, and the governance share is cited to its ruling. Two misses: I joined two CLAUDE.md lines to stay at 80,
against STANDARD 157's "split, never squeeze", and only system verify caught it. And L-217's own stop rule, landing in this sprint's
ADR, was what ended T2's review at the cap.

**Cost:** about 620k sub-agent tokens for 8 DoD across 3 members, plus three G1/G2 recon passes that were not metered:
- T1: builder ~78k · Codex ~24k · isolated verify ~56k.
- T2: builder ~254k · fixture builder ~107k · Codex ~20k + ~19k · isolated verify ~62k.
- T3: inline, no sub-agents.
Shape: coordinator plus 8 agents, sequential and attended. The commit clock ran from `plan_commit` (2026-10-11 17:24) to system verify
(2026-10-12 10:45), mostly builder and gate wall time on a memory-starved host.

**Worked**
- **The signed seed bar did its job.** "Each seed must redden its fixture" turned a green T2 into four named fixture gaps. They were closed
  through a scope-change rather than accepted quietly.
- **Codex found what parity could not.** Byte-identical output over this repo said nothing about non-ASCII ADR paths, because there are
  none. Round 1 reasoned its way to a real adopter-reachable false negative, and a probe confirmed it. At the cap, the three census-zero
  shapes went to TD-249 instead of a third round.
- **The off-host route held when this host could not.** The memory reaper killed a run and forks failed. The VPS gave parity under dash
  with both gawk and mawk, the seed check, and the full gate.

**Friction**
- **Line caps pulled against each other.** Joining two lines kept CLAUDE.md at 80, but `check-doc-caps` does not measure width, and
  prose-density (400 chars) is a gate leg. The first system verify FAILed at 282/1.
- **TASK-426's ✓ tails broke the freeze check.** The tails sat on continuation lines, where `dispatch.md` says "after the frozen text",
  but the checker accepts a tail only on the box line → TASK-427.
- **Escaping and line endings bit again.** A heredoc ate backslashes in Python edit anchors twice (`chr(92)` again). Git Bash
  `grep -c $'\r'` read 0 on CRLF working copies, and a Python count disagreed and was right.
- The first builder edited a file outside T2's `Layers:`. It reported this, and the change was routed by popup and scope-change.

**Pattern candidate:** none new. Every item is a sighting on an existing family: A ×2 (L-130), B ×1 (L-045), C1 ×1 (L-186), C2 ×1 (L-166).

**Buckets:**
- Shipped → `CHANGELOG.md` § SPRINT-124 (unreleased).
- Debt → TD-168 resolved · TD-249 (filed at T2) · TD-250.
- Follow-ups → TASK-427 (`origin: close-retro`).
- Learnings → sightings on L-130 (×2) · L-045 · L-186 · L-166.
- EPIC-015 closed 8/8 and archives with this sprint.
