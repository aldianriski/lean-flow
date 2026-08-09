---
sprint: 049
slug: layer-check-redesign
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: d5b0fa9
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

### T1 — Attribute each changed path to the task that changed it `[size: M · risk: med · class: decision · HITL]`
Layers: `scripts/lib/check-layers-observed.sh` · `scripts/qa-check.sh` ·
    `evals/run-layers-observed-fixtures.sh` · `TECH-DEBT.md`
Depends-on: none
Cites: T3

<!-- Amended 2026-08-09 by scope-change (log, rulings R1+R2): T1 was an L covering both checkers;
     it split into T1 (attribution) + T3 (prose precision). Substance retained, nothing dropped. -->

TD-035 is a false negative in the check built to prevent concurrent-edit collisions: one union of
every task's `Layers:` means a file declared by *any* task satisfies the check for *all* tasks. TD-031
names the sibling cause — the exclusion list has grown one entry per sprint because the check asks
"did a task declare this?" when it means "was this task work or coordinator bookkeeping?". Attributing
each path to *who* changed it answers the second question directly and retires both.

**Acceptance:** `scripts/qa-check.sh` reports the observed check green on this repo at HEAD, while a
Plan in which task A edits a file only task B declared FAILs by a named finding — a case that passes today.

**DoD:**
- [x] Baseline recorded first: run the observed-fixture harness on the *unchanged* checker and record
      which assertions pass, so a later green cannot be mistaken for a fixture that stopped testing (L-058)
      — 12/12 green before any T1 edit
- [x] Attribution implemented per ruling **R2** and stated **in the checker**: prefer a `Task: T<n>`
      git trailer, fall back to the three observed subject forms (`sprint(NN) T<n>:` ·
      `merge(…): T<n>` · trailing `(SPRINT-NNN T<n>)`), never a silent skip list
- [x] An **unattributable** commit's non-bookkeeping paths FAIL by name — never a default-to-coordinator
      pass, which would rebuild TD-035's shape one layer down (five real task commits carry no id)
- [x] `check-layers-observed.sh` tests **per task**; the all-task union is gone **on the committed
      path** — it remains the only available bound for uncommitted WIP, stated in the checker
- [x] The exclusion list shrinks to what attribution cannot cover; each survivor re-justified in place
      — ten entries → three on the committed path
- [x] Must-FAIL fixture (new): a task editing a file only another task declared **newly** FAILs, by its
      named finding — proven both ways in one repo: old checker `PASS` exit 0, new `FAIL … T1:bar.txt`
- [x] Must-FAIL fixture (new): a commit no rule attributes reports its own named finding
- [x] Must-PASS fixture (new): a `Task:` trailer attributes a commit whose subject says nothing —
      otherwise the trailer branch would ship untested and only the regex fallbacks be exercised
- [x] Fixtures land under `evals/` and run from the harness — retained, not deleted with the change (TD-012)
- [x] `TD-031` · `TD-035` marked `status: resolved → SPRINT-049 T1` in the ledger
- [x] `scripts/qa-check.sh` re-run **bare** immediately before the commit, after the DoD ticks and the log
      entry — those are edits too (L-089)

<!-- QA: gate change → the L-058 bar binds (one must-FAIL fixture per check, each failing by its named
     finding). No security or perf pass indicated; maintainer tooling, no input surface. -->

### T3 — Give the prose-derived checks an explicit escape, and fix the single-line `Layers:` defect `[size: M · risk: med · class: decision · HITL]`
Layers: `scripts/lib/check-layers-completeness.sh` · `scripts/lib/check-layers-observed.sh` ·
    `scripts/qa-check.sh` · `evals/run-layers-completeness-fixtures.sh` ·
    `evals/fixtures/layers-completeness/sprint-048-citations.md` ·
    `evals/fixtures/layers-completeness/cites-contradiction.md` ·
    `evals/fixtures/layers-completeness/unindented-continuation.md` · `TECH-DEBT.md`
Depends-on: none
Cites: `fog-fleet-orchestration.md` `requirements.md` `product-requirements.md.template` T1 T2 T4 T6 T7

<!-- Added 2026-08-09 by scope-change (log, rulings R1+R3+R4). Numbered T3, not T1b: both
     qa-check.sh and the completeness checker extract block ids with `^### T[0-9]+`, under which
     `T1a`/`T1b` collapse to one id and make a per-block finding ambiguous. -->

TD-032's own mitigation is falsified by its own evidence (log, A2): every SPRINT-048 false positive
sits **inside a DoD checkbox item**, so narrowing to DoD/Acceptance lines fixes none of them. The
discriminator is the token's role — cited versus touched — which no line-scoped filter separates. Leg
(a) still earns its FAIL because it is the only validation of `Layers:` that runs *before* any file
changes, and the dispatch ownership map is derived from `Layers:` at promote; so the author declares
intent through an explicit escape rather than by rewording the documentation.

**Acceptance:** the three SPRINT-048 false positives report clean without their prose being reworded,
while a genuinely forgotten declaration still FAILs by name.

**DoD:**
- [x] Explicit inline escape defined and documented in the checker — marks a backtick-quoted filename
      as cited-not-touched; absent the marker, behaviour is unchanged (a FAIL) — a `Cites:` line
- [x] Escape applies to leg (c) `Depends-on` completeness as well, per ruling **R4** — a retrospective
      note naming another task is not a dependency
- [x] Multi-line `Layers:` no longer silently truncates: either continuation lines are read, or a
      multi-line declaration is its own named FAIL — never silently reclassified as prose — **both**
      checkers fixed, since both parse the same declaration
- [x] Must-PASS fixtures from real history: `fog-fleet-orchestration.md` (T1 DoD) ·
      `requirements.md` + `product-requirements.md.template` (T7 DoD) · the `T6` retrospective note
      (T2 + T4 DoD) all report clean once escaped
- [x] Must-FAIL fixture (retained): SPRINT-041's real miss — a TD marked resolved with the debt ledger
      undeclared — still FAILs, by its *named* finding, not merely non-zero
- [x] Must-FAIL fixture (new): an escape marker does **not** suppress a path that was actually changed
      — the escape must not become a blanket silencer. **Delivered as the `Cites:`/`Layers:`
      contradiction fixture; read the log entry for what that does and does not establish**
- [x] Fixtures land under `evals/` and run from the harness — retained, not deleted with the change (TD-012)
- [x] `TD-032` marked `status: resolved → SPRINT-049 T3` in the ledger
- [x] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

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
- [x] Red flag added to `skills/orchestrator/SKILL.md` § Red flags: a DoD criterion invalidated by
      execution earns a `scope-change` entry and an owner ruling, never a quiet reinterpretation — and
      a measurement is never rounded up to meet a stated figure
- [x] Distinct from the adjacent scope-change red flag, which covers a *pivot*; this one covers a
      criterion that went stale while the scope held — the distinction is stated in the rule itself
- [x] `L-088` marked `promoted: yes → <where>` and its body collapsed to a pointer line (§11)
- [x] `skills/orchestrator/SKILL.md` stays ≤ ~140 lines — 101
- [x] `docs/knowledge-index.md` regenerated (`sh scripts/gen-index.sh`) — LEARNINGS metadata changed

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
- **D5** *(added 2026-08-09 by scope-change)* — rulings **R1**–**R4** are recorded in the Execution
  Log's `scope-change` entry, which is their authoritative statement: R1 split T1 → T1 + T3 · R2
  trailer-preferred attribution with a named FAIL for the unattributable · R3 leg (a) keeps its FAIL
  behind an explicit escape · R4 leg (c) takes the same escape, widening TASK-152's stated boundary.

## Assumptions

- **A1** — ✅ **confirmed with a caveat (2026-08-09)** — a changed path can be attributed to *who*
  changed it under both execution shapes, but by **three** subject forms plus a trailer, not one rule;
  five real task commits carry no id and are reachable only through their merge-back commit, so
  *unattributable* must be a named FAIL rather than a default bucket. Evidence + commit shas → the
  Execution Log's first entry. Folded into T1's DoD as ruling R2.
- **A2** — ⬜ **still open** — the retained SPRINT-041 fixture still reproduces its FAIL against the
  *current* checkers. *Confirm: the baseline run, now T3's first DoD item, before any edit — a fixture
  assumed to be guarding is the silent false-negative L-058 is about.* (The premise falsified during
  G2 was a DoD item's, not this one — see the Log's correction entry.)
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
