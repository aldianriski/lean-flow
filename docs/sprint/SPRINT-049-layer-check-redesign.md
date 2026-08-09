---
sprint: 049
slug: layer-check-redesign
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: [sha — set at promote]
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-049 — Layer-Check Redesign

> **Theme:** The two layer checks have been patched once per sprint for four sprints — an exclusion
> here, a narrowing there — and each patch was individually correct. TD-032 wrote its own kill-switch
> into the ledger ("if a third arrives, the checks want a rethink rather than another narrowing"), and
> TD-035 fired it at SPRINT-048 close. What makes this urgent rather than tidy is TD-035's direction:
> it is a **false negative in the check built to prevent concurrent-edit collisions**, so the guard
> reports green on exactly the shape that corrupted SPRINT-041's merge. Both checks ask *"did some
> task declare this file?"* when the question is *"who changed it?"* — this sprint changes the
> question instead of the answer.

## Scope

**In:** attribute changed paths to the task that changed them and test per task, not against the
all-task union · stop a filename mentioned in explanatory prose from registering as a touch ·
retained must-FAIL fixtures in both directions (L-058) · promote L-088 into a durable `/orchestrator`
red flag.

**Out (deferred):** TD-033 (`mattpocock.md` over its soft cap) and TD-034 (the duplicated sections in
the SPRINT-045 archive) — both trivial, neither in this family. TASK-148 (bulk-throughput proof run)
stays blocked: its `done-when` needs a ≥10-task Plan the backlog cannot supply. No release is
promised here — the checks are maintainer tooling, so the version decision waits for close.

## Plan

### T1 — Redesign the two layer checks as one attribution-based check `[size: M · risk: med · class: decision · HITL]`
Layers: `scripts/lib/check-layers-completeness.sh` · `scripts/lib/check-layers-observed.sh` · `scripts/qa-check.sh` · `evals/run-layers-completeness-fixtures.sh` · `evals/run-layers-observed-fixtures.sh` · `evals/fixtures/layers-completeness/` · `TECH-DEBT.md`
Depends-on: none

TD-031, TD-032 and TD-035 are three symptoms of one design error: a declaration-driven gate cannot
tell task work from coordinator bookkeeping, so every new class of legitimate change arrives as a
false positive and is answered with another exclusion — while the union it tests against hides a real
collision. Deriving the answer from *who* changed a path replaces both the exclusion list and the
union. TD-031 explicitly warned against redesigning a working guard under no pressure; TD-035 is that
pressure, and it is a false negative, so this is correctness rather than polish.

**Acceptance:** `scripts/qa-check.sh` reports the layer checks green on this repo at HEAD, while a Plan in
which task A edits a file only task B declared FAILs by a named finding — a case that passes today.

**DoD:**
- [ ] Baseline recorded first: run both fixture harnesses on the *unchanged* checkers and record which
      assertions pass, so a later green cannot be mistaken for a fixture that stopped testing (L-058)
- [ ] Attribution source established and stated **in the checker** — how a changed path is attributed
      to the task that changed it (task commit on an agent branch vs coordinator bookkeeping), never a
      silent skip list; the exclusion list shrinks to what attribution cannot cover, each survivor
      re-justified
- [ ] `check-layers-observed.sh` tests **per task**; the all-task union is gone
- [ ] `check-layers-completeness.sh` no longer registers a backtick-quoted filename that appears only
      in explanatory prose
- [ ] Must-FAIL fixture (retained): SPRINT-041's real miss — a TD marked resolved with the debt ledger
      undeclared — still FAILs, by its *named* finding, not merely non-zero
- [ ] Must-FAIL fixture (new): a task editing a file only another task declared **newly** FAILs, by its
      named finding
- [ ] Must-PASS fixture: SPRINT-048's prose-mention instances (analogy · cross-reference · coordination
      note · research citation) report clean
- [ ] All fixtures land under `evals/` and run from the harness scripts — retained, not deleted with
      the change (TD-012)
- [ ] `TD-031` · `TD-032` · `TD-035` marked `status: resolved → SPRINT-049 T1` in the ledger
- [ ] `scripts/qa-check.sh` re-run **bare** immediately before the commit, after the DoD ticks and the log
      entry — those are edits too (L-089)

<!-- QA: this is a gate change, so the L-058 bar binds — one must-FAIL fixture per check, each failing
     with its named finding. A security or perf pass is not indicated; maintainer tooling, no input
     surface. -->

### T2 — Promote L-088 into an `/orchestrator` red flag `[size: S · risk: low · class: execution · HITL]`
Layers: `skills/orchestrator/SKILL.md` · `docs/LEARNINGS.md` · `docs/knowledge-index.md`
Depends-on: none

L-088 reached `count: 2` at SPRINT-048 close (Sprint-047, then three separate instances in
Sprint-048) and is overdue by the §10 rule. Its home is the `/orchestrator` red-flag list rather than
a CLAUDE.md anti-pattern for two reasons: CLAUDE.md is already at its cap, and the mistake happens
where the DoD is looped and ticked, not where the project's shape is described.

**Acceptance:** an agent reading `/orchestrator` before ticking a DoD box encounters the rule, and
L-088 reads `promoted: yes → skills/orchestrator/SKILL.md § Red flags`.

**DoD:**
- [ ] Red flag added to `skills/orchestrator/SKILL.md` § Red flags: a DoD criterion invalidated by
      execution earns a `scope-change` entry and an owner ruling, never a quiet reinterpretation — and
      a measurement is never rounded up to meet a stated figure
- [ ] Distinct from the adjacent scope-change red flag, which covers a *pivot*; this one covers a
      criterion that went stale while the scope held
- [ ] `L-088` marked `promoted: yes → <where>` and its body collapsed to a pointer line (§11)
- [ ] `skills/orchestrator/SKILL.md` stays ≤ ~140 lines
- [ ] `docs/knowledge-index.md` regenerated (`sh scripts/gen-index.sh`) — LEARNINGS metadata changed

## Decisions (pre-locked)

- **D1** — TD-031 · TD-032 · TD-035 are handled as **one redesign, not three patches**. TD-032's own
  stated trigger fired at SPRINT-048 close. Not ADR-grade: the checks are maintainer tooling, the
  change is reversible, and the trade-off was pre-agreed in the ledger rows themselves.
- **D2** — L-088's durable home is `skills/orchestrator/SKILL.md` § Red flags, **not** a CLAUDE.md
  anti-pattern — CLAUDE.md sits at 81 lines against its ≤80 cap, and the failure occurs at the point
  the DoD is ticked. *(Owner ruling, SPRINT-049 promote.)*
- **D3** — the L-088 promotion runs as a **sprint task** (T2) rather than a promote-time governance
  edit, so it carries a DoD and a review pass of its own. *(Owner ruling — the governance checklist's
  L-promotion line is resolved by scheduling, not by editing at promote.)*
- **D4** — the §11 doc-aging pass was **applied at this promote** on owner approval: `TD-027`,
  `TD-028` and `TD-030` deleted (resolved ≥3 sprints ago; ids stay retired), and the three `v1.25.x`
  CHANGELOG blocks rotated verbatim to `docs/changelog/CHANGELOG-1.25.2.md` (root 177 → 78 lines).
  LEARNINGS pointer-collapse had nothing pending; `TODO.md` at 99 lines is under its ~150 trigger.

## Assumptions

- **A1** — a changed path can be attributed to *who* changed it in **both** execution shapes this repo
  uses: worktree-parallel dispatch (agent branch vs coordinator commits) and sequential inline
  execution, where there are no branches to discriminate on. *Confirm: T1's first step, against a real
  sequential sprint's commit range and a worktree run's branch set. If inline execution cannot yield
  the discriminator, T1 re-scopes through a `scope-change` entry and an owner ruling — never by
  quietly reinterpreting the DoD (this is L-088, which T2 promotes).*
- **A2** — the retained SPRINT-041 fixture still reproduces its FAIL against the *current* checkers.
  *Confirm: the baseline run in T1's first DoD item, before any edit — a fixture assumed to be
  guarding is the silent false-negative L-058 is about.*
- **A3** — TD-035's collision scenario is presently harmless because execution is sequential; the
  exposure is real only under the worktree-parallel dispatch this repo ships. *Confirm: stated in
  TD-035 and unchanged — this bounds the risk of the sprint, not its necessity.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-049-layer-check-redesign.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (DOCS_Guide §9 · ADR-014).

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| | | | | |

## Retro
<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md. -->
