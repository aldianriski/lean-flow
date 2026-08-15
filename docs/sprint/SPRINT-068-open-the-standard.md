---
sprint: 068
slug: open-the-standard
owner: Maintainer
last_updated: 2026-08-15
status: active
plan_commit: [sha — set at promote]
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-068 — Open the Standard

> **Theme:** clear the ready pool and open EPIC-003's door. T1 makes the ruling that must exist
> before the first extraction commit — what `CONTEXT.md` becomes once the spec leaves it. T2 and T3
> are the Proof Layer's two ruled follow-ups: the system-verify checker joins the gate, and TD-055's
> reserved-word collision becomes impossible by rename. Three S tasks, file-disjoint.

## Scope

**In:** rule CONTEXT.md's post-extraction role (T1) · wire `check-system-verify-block.sh` into the
QA gate (T2) · rename the run-level `complete` event to `run-complete` (T3).

**Out (deferred):** the extraction itself — EPIC-003's member sprints start only after T1's ruling
lands · TASK-188 (`blocked`, opportunistic trigger — L-111) · any change to ADR-021/022's semantics.

## Plan

### T1 — Rule what CONTEXT.md becomes once the spec is extracted `[size: S · risk: med · class: decision · HITL]`
Layers: `.claude/CONTEXT.md` · `docs/adr/` · `docs/epic/EPIC-003-the-standard.md`
Depends-on: none
Cites: ADR-018 (accepts the migration risk and names this ruling as how it retires) · EPIC-003
       open question 3
Extraction that leaves the same rule in two places mid-migration is the second SSOT that LAW 4 and
the anti-SSOT rule forbid — ADR-018 took that risk explicitly, on condition this ruling lands
**before** the first extraction commit, not during it.

**Acceptance:** a recorded ruling on whether `.claude/CONTEXT.md` stays the SSOT or becomes a
consumer of the extracted spec, with the migration-window risk named and its mitigation stated.

**DoD:**
- [ ] The fork stated and ruled — SSOT-stays (spec generated/derived from it) vs
      CONTEXT-becomes-consumer (spec is the new SSOT) — with the WHY over the alternative —
      *Verify: ruling recorded (ADR if it qualifies, §4); review vs ADR-018 as comparand*
- [ ] The migration-window risk named with a stated mitigation (what prevents the two-places state,
      or bounds it to one commit) — *Verify: the ruling names the window and the mechanism*
- [ ] EPIC-003 open question 3 marked answered with a pointer to the ruling —
      *Verify: the epic file's § Open questions*
- [ ] CONTEXT.md cost stated: the ruling itself spends ~0 lines pre-extraction (132/150 at promote) —
      *Verify: `wc -l .claude/CONTEXT.md`*

### T2 — Wire check-system-verify-block.sh into the QA gate `[size: S · risk: low · class: execution · AFK]`
Layers: `scripts/qa-check.sh` · `evals/`
Depends-on: none
Cites: SPRINT-067 T1 builder deviation (the stated gap) · `evals/README.md` § system-verify · L-058
SPRINT-067 T1 deliberately deferred this — "qa-check.sh: run, never edited" bound that task. The
checker exists, five legs green, nothing runs it in-gate.

**Acceptance:** the system-verify contract checker runs inside `sh scripts/qa-check.sh`, its five
fixture legs green in-gate, and a deliberate violation FAILs the gate with the named finding.

**DoD:**
- [ ] Registered per the gate's own harness conventions (always-on vs `QA_FULL=1` judged against
      measured runtime; harness moved to the standard location if registration requires it) —
      *Verify: the gate's output names the harness leg*
- [ ] Five legs green in-gate, findings unchanged from the retained fixtures — *Verify: gate run
      output, legs 5/5*
- [ ] Must-FAIL proof: a deliberate violation FAILs the whole gate with
      `system-verify-fail-silently-closed`, then reverted — *Verify: the red run's output captured
      in the Execution Log (L-058: the gate's worst failure is the silent false-negative)*
- [ ] `evals/README.md` matches reality after any move — *Verify: README diff*
      *(TD-056 piggyback: while in the gate's neighbourhood, run the one-command family scan its
      re-review names — which `check-*.sh` take file arguments, what does each do bare — and report.)*

### T3 — Rename the reserved `complete` event to `run-complete` `[size: S · risk: med · class: execution · HITL]`
Layers: `scripts/lib/check-night-run-rollup.sh` · `evals/fixtures/` ·
        `skills/lean-doc-generator/templates/sprint-log.md.template` · `TECH-DEBT.md`
Depends-on: none
Cites: TD-055 (ruled 2026-08-15 — rename, not a note) · L-015 · L-123 · `qa-check.sh` (run to prove the archive stays green — never edited by this task)
`complete` written to mean "this task finished" silently arms the run-level rollup assertions.
Renaming the run-level event makes the collision impossible instead of documented.

**Acceptance:** the run-level Execution Log event is `run-complete` in the checker, its fixtures,
and the template's taxonomy comment, with a task-level `complete` no longer arming the rollup
assertions; TD-055 marked resolved.

**DoD:**
- [ ] Checker + fixtures + template renamed in **one commit** (L-123: the shape and its asserting
      checker are born — and renamed — together) — *Verify: the commit's file list*
- [ ] A task-level `| complete |` entry no longer arms the run-level assertions — *Verify: a fixture
      leg proves it (the TD-055 misfire shape, now passing)*
- [ ] Archives are not re-litigated: historical `complete` logs stay valid — *Verify: the checker's
      archive handling + `qa-check.sh` green over the real archive*
- [ ] TD-055 → `status: resolved → TASK-211` — *Verify: the row*

## Owner-action checklist
- [ ] Reinstall the plugin — installed cache is **1.38.0** against a repo now at **1.41.0**, three
      MINORs behind (carried from SPRINT-066 and 067, unactioned). T2/T3 change gate behaviour a
      future session will want fresh; the session reads repo source meanwhile (L-021).

## Decisions (pre-locked)

- **D1 — No epic stamp.** TASK-198 is EPIC-003's *prerequisite ruling*, not member work — SPRINT-066
  D3's owner-signed reasoning applies unchanged; the extraction sprints themselves will be the
  members, and EPIC-003 activates when the first of them promotes. **→ no ADR.**
- **D2 — All three tasks are file-disjoint** (preflight confirms): T1 is an inline decision
  (stated reason: rulings are the coordination tier's job, ADR-010); T2/T3 dispatch and may run in
  parallel if the preflight agrees — final call at the orchestrator's G2. **→ no ADR.**
- **D3 — T3 is a contract rename, so its pieces move atomically** — checker, fixtures, template,
  one commit; a split rename recreates exactly the undocumented-assertion / unasserted-definition
  halves L-123 names. **→ no ADR.**

## Assumptions

- **A1** — No cap blocks: `CONTEXT.md` **132/150** (T1 spends ~0 pre-extraction) · `TODO.md`
  ~150/320 · every other target is a script/reference/template, uncounted (ADR-006).
  *Confirm: measured at promote 2026-08-15.*
- **A2** — TD-055's ruling (SPRINT-067 T2) is T3's spec — the rename, not a note; the row already
  carries the reasoning. *Confirm: TD-055 row, "Ruled 2026-08-15".*
- **A3** — L-122 was promoted at this promote: T2/T3 builder briefs and every review brief quote the
  governing rulings verbatim (TD-055's cure text · SPRINT-067 T1's gap statement), and the reviewers
  get them as Spec comparands. *Confirm: review-scoping.md § Scope every pass.*
- **A4** — Governance resolved at this promote: **L-122 promoted → review-scoping.md § Scope every
  pass** (entry collapsed per §11) · TD-052 + TD-056 re-reviewed and held with conditions ·
  doc-aging otherwise clean. *Confirm: governance review 2026-08-15, owner-signed.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-068-open-the-standard.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (DOCS_Guide §9 · ADR-014). The `logs/` subdirectory is load-bearing —
> the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-directory
> `-log.md` sibling would be capped and schema-checked as if it were a Plan.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Cost** — what this sprint cost to run, and in what shape (inline · coordinator + N agents). Cost per
unit **delivered**, not per unit attempted.

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
