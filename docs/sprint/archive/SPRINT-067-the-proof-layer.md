---
sprint: 067
slug: the-proof-layer
owner: Maintainer
last_updated: 2026-08-15
status: closed
gates_signed: G1,G2 @ bcc8bd9
plan_commit: 54999a3
close_commit: 7df2d56
update_trigger: sprint execute/close events
---

# SPRINT-067 — The Proof Layer

> **Theme:** build what SPRINT-066's rulings enabled. ADR-021 says a named check's FAIL blocks the
> silent path; this sprint gives the loop the two mechanisms that produce and report that evidence —
> a system-verify pass over the integrated tree after the last wave (T1), and per-criterion
> verdict + evidence lines in the rollup (T2). With these, the second gauntlet audit's remainder is
> fully landed: contract ruled (066), proof built (067).

## Scope

**In:** the system-verify full-gate pass after the final merge-back (T1) · per-criterion evidence
lines in the rollup and review report (T2).

**Out (deferred):** TASK-198 (EPIC-003's opener — different subject) · TASK-188 (opportunistic
trigger, L-111) · any change to the revise loop's ceiling or ADR-022's carve-out conditions ·
concretizing the per-repo policy format (EPIC-005 owns it).

## Plan

### T1 — Wire a system-verify pass after the last wave's merge-back `[size: M · risk: med · class: execution · HITL]`
Layers: `skills/orchestrator/references/dispatch.md` · `skills/orchestrator/SKILL.md` ·
        `skills/orchestrator/references/night-run.md` · `evals/`
Depends-on: none
Cites: ADR-021 (what a FAIL may block) · ADR-016 (rollup contract) · TD-053 (worktree false-positive
       trap — read before the pass runs anywhere a worktree may exist) · TD-051 (the close-commit
       blind spot this narrows) · `qa-check.sh` (this repo's dogfood gate — run, never edited)
Locally-green ≠ globally-green: dispatch.md's merge-back today ends with an "interaction-only smoke
check per wave"; nothing runs the whole gate over the integrated tree after the *last* wave. The
pass gates per ADR-021 — its FAIL blocks the silent close, surfaced for a recorded owner ruling.

**Acceptance:** after a multi-task run's final merge-back, one named full-gate pass (the host repo's
own gate command, discovered — never hard-coded) runs against the integrated tree and its verdict
lands in the rollup; exercised once on real input and once on must-FAIL input, fixtures retained.

**DoD:**
- [x] The pass is defined at dispatch.md § Merge-back queue (post-final-wave, integrated tree,
      host-repo gate command discovered per L-015) with a two-line hook from SKILL.md § sprint-bulk —
      *Verify: the sections exist and `qa-check.sh` layer checks pass on the diff* ✓ 145/0
- [x] Its verdict is one named rollup line (ADR-016 shape; a FAIL blocks the silent close per
      ADR-021 — surface → recorded owner ruling, shape `owner-ruling: system-verify — <ruling>`) —
      *Verify: night-run.md Part 4 carries the line format; review pass confirms no contradiction
      with ADR-021/022* ✓ reviewer + delta re-review
- [x] Exercised on real input: this run's own final merge-back gets the pass, verdict in this run's
      exit rollup — *Verify: the rollup line exists and the gate's output file (not its exit
      channel) shows the run* ✓ `system-verify · PASS · sh scripts/qa-check.sh` (145/0, output read)
- [x] Exercised on must-FAIL input with its named finding; fixtures retained — *Verify:
      `evals/fixtures/system-verify/` exists, both legs run, findings named (L-058 · TD-012)* ✓
      5 legs green incl. archive-skip, coordinator re-ran the harness

### T2 — Per-criterion evidence lines in the rollup and review report `[size: S · risk: low · class: execution · HITL]`
Layers: `skills/orchestrator/references/night-run.md` ·
        `skills/orchestrator/references/review-scoping.md` ·
        `skills/lean-doc-generator/templates/SPRINT.md.template` · `TECH-DEBT.md`
        <!-- TECH-DEBT.md added mid-sprint — TD-055's row is where box 3 records; logged first (L-100) -->
Depends-on: T1 — night-run.md Part 4 is shared; T1 adds the system-verify verdict line first, T2
            extends the per-criterion format around it (single-owner order, D1)
Cites: ADR-016 (the N-of-M this extends) · ADR-021 (the contract whose evidence this reports) ·
       TD-055 (the reserved-event trap — this task touches its surfaces and settles rename-vs-note
       or states why not) · L-015 (template edits ship to consumers)
A tick without its evidence is a claim; ADR-021 made the evidence exist, this makes it legible. The
rollup's `N of M` gains, per criterion, what proved it — test, check, fixture, or review outcome —
and a recorded owner override shows as exactly that.

**Acceptance:** a ticked DoD line names the evidence that ticked it, and the exit rollup carries
verdict + evidence per criterion, extending ADR-016's N-of-M — exercised on this run's own exit
rollup.

**DoD:**
- [x] The per-criterion line shape is defined in night-run.md Part 4 (extends N-of-M; never a new
      task state) and the review report mirrors it in review-scoping.md — *Verify: both sections
      state the same shape; scoped review confirms no contradiction* ✓ review + delta re-review
      (revise loop fixed the ladder mis-reference before commit)
- [x] SPRINT.md.template's DoD guidance shows the evidence-noting convention (consumer surface —
      generic wording, no repo path) — *Verify: template diff + L-015 check in review* ✓ reviewer
      grepped the template for repo paths: none
- [x] TD-055's rename-vs-note question settled in passing or explicitly declined with the reason
      (this task owns its surfaces this sprint) — *Verify: TD-055 row updated either way* ✓ declined
      with reason (no in-scope file is the authoring point; a fourth location repeats L-099);
      rename `complete`→`run-complete` recommended → follow-up task at close
- [x] Exercised on this run's own exit rollup — emitted in-run after the Plan's last task, the
      L-121-safe vehicle (a "real sprint close" clause would be close-phase and untickable here) —
      *Verify: this sprint's rollup carries verdict + evidence per criterion* ✓ the exit rollup's
      Tn.k block (Execution Log, 2026-08-15)

## Owner-action checklist
- [ ] Reinstall the plugin — installed cache is **1.38.0** against a repo now at **1.40.0**, two
      MINORs behind (carried from SPRINT-066, unactioned). This sprint edits dispatch/night-run
      procedures again; the session reads them from repo source (L-021), but the gap closes only by
      reinstalling.
      *Carried open at close again (owner proceeded) — third sprint; now three MINORs behind
      (1.38.0 vs 1.41.0). Re-filed on the next sprint's checklist.*

## Decisions (pre-locked)

- **D1 — Ownership: `night-run.md` is shared → single owner in sequence.** T1 adds the system-verify
  verdict line to Part 4, T2 then extends the per-criterion format around it. Commit order T1 → T2 is
  also dependency order; SKILL.md and dispatch.md are T1-only, review-scoping.md and the template
  T2-only. **→ no ADR.**
- **D2 — The pass gates by applying ADR-021, not by re-ruling it.** A system-verify FAIL blocks the
  *silent* close; the owner's recorded override is always available. Unattended behaviour follows
  ADR-022 unchanged (a system-verify FAIL is a mechanical verdict; whether anything retries on it
  is governed by the carve-out's three conditions — nothing new is decided here). **→ no ADR.**
- **D3 — Exercise vehicles chosen L-121-safe.** T1's real-input leg is this run's own final
  merge-back; T2's is this run's own exit rollup — both in-run events, neither close-phase. A DoD
  box must never depend on an event after the sprint's own work (L-121). **→ no ADR.**

## Assumptions

- **A1** — No cap blocks: orchestrator `SKILL.md` **107/140** · `CONTEXT.md` **132/150** · `TODO.md`
  **152/320**; dispatch.md, night-run.md, review-scoping.md and the template are references/assets,
  uncounted (ADR-006). *Confirm: measured at promote 2026-08-15.*
- **A2** — This sprint runs **sequential, no worktrees** (two dependent tasks), so TD-053's
  find-walk false positive cannot fire here — but T1's pass definition must still read TD-053, since
  consumers will run it where worktrees exist. *Confirm: TD-053 row + D1 sequence.*
- **A3** — "Host repo's own gate command, discovered": this repo dogfoods via `sh scripts/qa-check.sh`;
  the generic reference describes discovery (manifest scripts · Makefile · CI config · ask), never a
  hard-coded path (L-015/L-016). *Confirm: T1 review checks the consumer surface.*
- **A4** — Governance resolved at this promote: L-promotion **none** (two agreeing queries, 101
  entries all count 1) · **six** TD rows re-reviewed and held with unblock conditions (TD-037 ·
  TD-045 · TD-047 · TD-048 · TD-051 · TD-055) · doc-aging clean (TODO 152/320 · rotation current ·
  no pending collapse). *Confirm: governance review 2026-08-15, owner-signed.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-067-the-proof-layer.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (DOCS_Guide §9 · ADR-014). The `logs/` subdirectory is load-bearing —
> the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-directory
> `-log.md` sibling would be capped and schema-checked as if it were a Plan.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/references/dispatch.md` | T1 | § System verify — final-wave full gate: discovery order, verdict semantics (ADR-021 applied, ADR-022 deferred-to), `owner-ruling:` recorded shape, TD-053 caveat | med | scoped review + delta re-review |
| `skills/orchestrator/references/night-run.md` | T1 | Part 4 gains the `system-verify · …` rollup line + the morning-after ruling reference (supplementary, no new state) | med | scoped review + delta re-review |
| `skills/orchestrator/SKILL.md` | T1 | Step 6 runs system-verify before close (folded in, 107/140) | low | scoped review |
| `evals/lib/check-system-verify-block.sh` + `evals/fixtures/system-verify/` | T1 | Retained must-FAIL contract fixtures — 5 legs incl. named-finding FAIL and archive-skip; harness nested to stay in declared Layers (wiring into qa-check.sh = stated gap) | low | harness run, all green ×2 |
| `evals/README.md` | T1 | Documents the fixture family + nested-harness placement rationale | low | review |
| `skills/orchestrator/references/night-run.md` | T2 | Part 4 gains the per-criterion evidence block (`Tn.k · ticked\|open\|overridden · <evidence>`), reconciled with the done-task rule; the ladder relation stated accurately after the revise loop | med | scoped review + delta re-review |
| `skills/orchestrator/references/review-scoping.md` | T2 | Revise-loop outcome lines name their evidence in the rollup's vocabulary | low | scoped review |
| `skills/lean-doc-generator/templates/SPRINT.md.template` | T2 | DoD comment teaches ✓-evidence ticks + *Verify:* clauses (generic wording — L-015 clean) | low | scoped review (template grep: no repo path) |
| `TECH-DEBT.md` | T2 | TD-055 ruled: note declined with reason, rename recommended → follow-up at close | low | row updated |

## Retro

<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?
Yes, twice, both by dispatched builders against *fresh* rulings: T1's checker asserted a format no
procedure documented, and T2's prose misdescribed the one-sprint-old comparand ladder ("the same
four" — only two overlap). Both caught in-session by reviewers briefed with the decisions as
comparands — the second sighting of L-122's pattern, **count 2 → promotable at the next promote**.
The two misses are mirror images and yield one new pattern (→ L-123).

**Cost** — coordinator + 2 dispatched `sonnet` builders (each resumed once for its revise fix) +
4 `sonnet` review passes (2 scoped · 2 delta re-reviews); ≈0.9M subagent tokens for 2 of 2 units
delivered. The revise loop fired twice and closed at its one-retry ceiling both times — no spiral,
no second firing.

**Worked** — detailed builder briefs with hard file boundaries (neither builder strayed; T1's one
deviation was reasoned, in-scope, and accepted with its gap named). The revise loop on dispatched
work: both concrete violations per task were caught before commit, fixed on the single retry, and
confirmed by delta re-review. The exit ate its own dogfood — system-verify and the Tn.k evidence
block first fired on the run that built them.

**Friction** — both builders' *first* passes shipped a concrete violation per axis despite carrying
the rulings in their briefs — the builder reads the decision and still drifts; only the
comparand-briefed *reviewer* caught it (L-122's case strengthening). `Layers:` needed two mid-sprint
corrections (TECH-DEBT.md for the TD-055 ruling; T1's evals placement) — L-100's expected cost, both
logged first. The reinstall owner-action is now three sprints unactioned.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`) — **L-123** filed: a machine-asserted
shape and its checker are born together, or not at all — T1 shipped the assertion without the
documented shape, T2 the shape-reference without an asserting checker; one rule covers both
directions. **L-122 → count 2** (promotable).
