---
sprint: 068
slug: open-the-standard
owner: Maintainer
last_updated: 2026-08-15
status: closed
plan_commit: c574fda
gates_signed: G1,G2 @ 622f420
close_commit: 9fef02d
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
Layers: `.claude/CONTEXT.md` · `docs/adr/` · `docs/DECISIONS.md` · `docs/epic/EPIC-003-the-standard.md`
Depends-on: none
Cites: ADR-018 (accepts the migration risk and names this ruling as how it retires) · EPIC-003
       open question 3
Extraction that leaves the same rule in two places mid-migration is the second SSOT that LAW 4 and
the anti-SSOT rule forbid — ADR-018 took that risk explicitly, on condition this ruling lands
**before** the first extraction commit, not during it.

**Acceptance:** a recorded ruling on whether `.claude/CONTEXT.md` stays the SSOT or becomes a
consumer of the extracted spec, with the migration-window risk named and its mitigation stated.

**DoD:**
- [x] The fork stated and ruled — SSOT-stays (spec generated/derived from it) vs
      CONTEXT-becomes-consumer (spec is the new SSOT) — with the WHY over the alternative —
      *Verify: ruling recorded (ADR if it qualifies, §4); review vs ADR-018 as comparand*
      ✓ ADR-023 (owner ruled consumer + chose ADR, popup 2026-08-15); reviewer: consistent vs ADR-018
- [x] The migration-window risk named with a stated mitigation (what prevents the two-places state,
      or bounds it to one commit) — *Verify: the ruling names the window and the mechanism*
      ✓ ADR-023 § Decision: move+cite atomic commits — window bounded to zero at commit granularity
- [x] EPIC-003 open question 3 marked answered with a pointer to the ruling —
      *Verify: the epic file's § Open questions*
      ✓ struck through + pointer, verified by scoped review
- [x] CONTEXT.md cost stated: the ruling itself spends ~0 lines pre-extraction (132/150 at promote) —
      *Verify: `wc -l .claude/CONTEXT.md`*
      ✓ measured 132 post-ruling — 0 lines spent (cross-checked by reviewer)

### T2 — Wire check-system-verify-block.sh into the QA gate `[size: S · risk: low · class: execution · AFK]`
Layers: `scripts/qa-check.sh` · `evals/`
Depends-on: none
Cites: SPRINT-067 T1 builder deviation (the stated gap) · `evals/README.md` § system-verify · L-058
SPRINT-067 T1 deliberately deferred this — "qa-check.sh: run, never edited" bound that task. The
checker exists, five legs green, nothing runs it in-gate.

**Acceptance:** the system-verify contract checker runs inside `sh scripts/qa-check.sh`, its five
fixture legs green in-gate, and a deliberate violation FAILs the gate with the named finding.

**DoD:**
- [x] Registered per the gate's own harness conventions (always-on vs `QA_FULL=1` judged against
      measured runtime; harness moved to the standard location if registration requires it) —
      *Verify: the gate's output names the harness leg*
      ✓ `PASS eval harness run-system-verify-fixtures.sh` in-gate; 0.66s measured → always-on (TD-016)
- [x] Five legs green in-gate, findings unchanged from the retained fixtures — *Verify: gate run
      output, legs 5/5*
      ✓ 5/5 standalone + in-gate; reviewer matched names/findings to SPRINT-067 fixtures verbatim
- [x] Must-FAIL proof: a deliberate violation FAILs the whole gate with
      `system-verify-fail-silently-closed`, then reverted — *Verify: the red run's output captured
      in the Execution Log (L-058: the gate's worst failure is the silent false-negative)*
      ✓ red run captured in the Log (T2 entry); revert verified byte-identical, gate green again
- [x] `evals/README.md` matches reality after any move — *Verify: README diff*
      ✓ reviewer read § system-verify in full — location, registration, table, runbook all current
      *(TD-056 piggyback: while in the gate's neighbourhood, run the one-command family scan its
      re-review names — which `check-*.sh` take file arguments, what does each do bare — and report.)*

### T3 — Rename the reserved `complete` event to `run-complete` `[size: S · risk: med · class: execution · HITL]`
Layers: `scripts/lib/check-night-run-rollup.sh` · `evals/fixtures/` ·
        `skills/lean-doc-generator/templates/sprint-log.md.template` · `TECH-DEBT.md`
Depends-on: none
Cites: TD-055 (ruled 2026-08-15 — rename, not a note) · L-015 · L-123 · `qa-check.sh` (run to prove the archive stays green — never edited by this task)
Writing `complete` to mean "this task finished" silently arms the run-level rollup assertions.
Renaming the run-level event makes the collision impossible instead of documented.

**Acceptance:** the run-level Execution Log event is `run-complete` in the checker, its fixtures,
and the template's taxonomy comment, with a task-level `complete` no longer arming the rollup
assertions; TD-055 marked resolved.

**DoD:**
- [x] Checker + fixtures + template renamed in **one commit** (L-123: the shape and its asserting
      checker are born — and renamed — together) — *Verify: the commit's file list*
      ✓ `f449e6b` (6 files: checker + 3 fixtures + new fixture + template); writer joined in `b3d8c03`
      (owner-ruled scope-change, logged first)
- [x] A task-level `| complete |` entry no longer arms the run-level assertions — *Verify: a fixture
      leg proves it (the TD-055 misfire shape, now passing)*
      ✓ leg 5 `task-level-complete-does-not-arm` green, wired into the harness (TD-012)
- [x] Archives are not re-litigated: historical `complete` logs stay valid — *Verify: the checker's
      archive handling + `qa-check.sh` green over the real archive*
      ✓ two real archived logs on the old token skipped silently; gate green over the repo
- [x] TD-055 → `status: resolved → TASK-211` — *Verify: the row*
      ✓ row updated `877fbd0`, resolution note appended, row retained

## Owner-action checklist
- [x] Reinstall the plugin — installed cache is **1.38.0** against a repo now at **1.41.0**, three
      MINORs behind (carried from SPRINT-066 and 067, unactioned). T2/T3 change gate behaviour a
      future session will want fresh; the session reads repo source meanwhile (L-021).
      ✓ actioned by owner 2026-08-15 this session: `/plugin` reports 1.41.0; the `/orchestrator`
      invocation header confirmed the 1.41.0 base dir (the signal L-021 says to trust)

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
| `docs/adr/ADR-023-context-becomes-consumer.md` | T1 | The pre-extraction ruling: spec/ becomes SSOT, CONTEXT.md a consumer; move+cite atomic commits close the migration window | med | reviewed vs ADR-018 as comparand |
| `docs/epic/EPIC-003-the-standard.md` | T1 | Open question 3 marked answered → ADR-023 | low | review |
| `docs/DECISIONS.md` + `docs/knowledge-index.md` | T1 | ADR-023 indexed (Layers corrected — L-100, logged first) | low | layers-observed PASS · index grep |
| `scripts/qa-check.sh` | T2 | `run-system-verify-fixtures.sh` joins `eval_harnesses_always` (measured 0.66s, git-free — TD-016 axis) | low | gate run before/after violation |
| `evals/run-system-verify-fixtures.sh` | T2 | Harness promoted from nested location into the `evals/run-*.sh` glob the gate scans | low | 5/5 in-gate + must-FAIL proof |
| `evals/README.md` | T2 | Placement + how-to-run match the wired state | none | diff review |
| `scripts/lib/check-night-run-rollup.sh` | T3 | Run-level event match → `run-complete`, anchored to the delimited field (L-108) | med | 5-leg harness + archive green |
| `evals/fixtures/night-run-rollup/*` | T3 | 3 fixtures renamed + new `task-level-complete-does-not-arm` (the TD-055 misfire, now passing) | low | leg output |
| `skills/lean-doc-generator/templates/sprint-log.md.template` | T3 | Event taxonomy renamed in the same commit (L-123); ships to consumers (L-015) | med | block re-read (L-009) |
| `TECH-DEBT.md` | T3 | TD-055 → `resolved → TASK-211` | low | row diff |
| `scripts/night-run.sh` | T3 (scope-change) | The event's live writer emits `run-complete` — writer and checker renamed together, no dark-gate window | med | census grep + harness |
| `evals/run-night-run-rollup-fixtures.sh` | T3 (scope-change) | New fixture wired as leg 5 (an unwired fixture guards nothing — TD-012) | low | 5/5 green |
| `evals/fixtures/system-verify/*` (4 logs) | T3 (scope-change) | Inert scenery off the dead token (census catch) | none | system-verify 5/5 green |
| `scripts/lib/check-layers-observed.sh` | close | `docs/changelog/*` joins the close-time exclusion list: the CHANGELOG rotation artifact is the same bookkeeping as `CHANGELOG.md`, one file over — the row was never added when the rotation convention shipped (L-020) | low | new fixture leg + guard proof (row stripped → at-close leg red) |
| `evals/run-layers-observed-fixtures.sh` | close | Case 4e pins the row both ways — reported during execution, excluded at close (the 4d width guard, reused) | low | 15/15 green |

## Retro

<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint? No
contradiction. One retrieval *gap* with prior art adjacent: L-123 (shape+checker born together) was
loaded and briefed, yet its rename corollary — the shape's **writer** — was in nobody's census;
TD-055's own ruling under-scoped it. Filed as L-124 rather than stretched onto L-123.

**Cost** — coordinator (session model, inline T1 + gates + merges) + 2 worktree builders (sonnet,
~145k + ~168k tokens) + 1 scoped reviewer (sonnet, ~93k) ≈ **410k dispatched tokens, ~65 min wall,
3 of 3 units delivered**. First sprint where every proof-layer mechanism ran for real: revise loop
(1 firing, closed at ceiling), system-verify (1 real RED then PASS), per-criterion evidence rollup.

**Worked** — the builder's hard file boundary turned a would-be defect into a *flag*: T3 could not
touch `night-run.sh`, so the writer-miss surfaced as a report instead of merging dark. The
second-query census then caught the fixture-scenery remainder all prior passes missed. System-verify
earned its wiring on its own sprint — blocked the close on ADR-023's out-of-vocabulary tag, a leg
neither builders nor the briefed reviewer had as a comparand (ADR-021 doing exactly its job).

**Friction** — TD-055's ruling under-scoped its own cure (three files named, the writer absent) →
owner-ruled scope-change mid-sprint (L-124). The coordinator ran `check-layers-observed.sh` bare and
read silence — TD-056's exact shape, second sighting, now scoped and vehicled (TASK-212). `tail`
piped onto the gate swallowed 2 of 3 FAIL lines (L-057's shape; the exit code belonged to `tail`).
The close itself went red on `layers observed` for its own `docs/changelog/CHANGELOG-1.40.0.md`:
`CHANGELOG.md` sat on the close-time exclusion list, its §11 rotation sibling never did. SPRINT-067's
close created `CHANGELOG-1.39.0.md` and tripped the identical leg unnoticed — a second sighting of
L-020 found only because this sprint's own T2 work made the gate worth re-reading at close. Fixed in
this close with the width guard its neighbour case already had, rather than deferred.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`) — **L-124 filed**: a contract rename's
census enumerates producers, not only asserters and docs (writer + instantiated-from-template both
missed in one sprint). TD-056 sighting bumped in its row rather than a new entry.
