---
owner: Maintainer
last_updated: 2026-09-11
update_trigger: Sprint completed, task added, or task status changed
status: current
---

# lean-flow — Development Tracker

> **How to use this file** — Backlog pool + a pointer per active stream. The loop that drives it
> (`/prime` → `/triage` → `promote` → `sprint-bulk` → `close`) is documented once in
> [`.claude/CONTEXT.md`](.claude/CONTEXT.md) § The loop; debt lives in [`TECH-DEBT.md`](TECH-DEBT.md),
> never deleted, aged at promote. Pointers rather than a second copy (L-008).

---

## Active Sprint

> **SPRINT-100 — Findings That Mean What They Say** →
> [`docs/sprint/SPRINT-100-findings-that-mean-what-they-say.md`](docs/sprint/SPRINT-100-findings-that-mean-what-they-say.md)
> — promoted 2026-09-13, five tasks, 29 DoD, no owner-action. **Not** an epic sprint: EPIC-015
> § Closed-when 1 waits a fourth sprint, because its precondition is a host that can *finish* a gate
> and SPRINT-099 made truncation honest rather than absent. **`gates_signed:` is absent, which means
> NOT signed** (L-099) — G1/G2 run at `/orchestrator`.

**Standing facts the Backlog depends on** — everything else that lived here was a narrative of the
SPRINT-096 promote and is now in [`CHANGELOG.md`](CHANGELOG.md) and the archived sprint file. Pruned
again at the SPRINT-097 promote on owner approval (L-008 — a copied narrative drifts from its source).

- **Debt ledger: 88 rows** (86 open · 2 resolved — TD-141 accepted, TD-132 → TASK-328; TD-154/TD-155 filed at the SPRINT-099 close) — re-derived at
  the SPRINT-099 promote by row header (74 of 84 open are ≥3 sprints unaddressed; 74 aged + 10 unaged
  = 84). Re-derive open/closed and the `severity: high` set
  **by anchoring to the `^- **TD-NNN**` row header** — a bare `grep 'status: open'` over-counts,
  because rows quote their own status strings in prose (L-108). Aging figures are derived at each
  promote, never read from here (L-097 · L-130).
- **The gate DOES verdict on this host** — corrected at the SPRINT-097 close, where it ran to
  completion four times and printed a verdict every time, ending `QA-CHECK: 230 pass, 0 fail`. The
  previous note here ("cannot currently verdict") was written after SPRINT-096's memory kill and was
  stale; it is replaced rather than annotated, because a standing fact that is false is worse than
  **`qa-budget-default` compared the *configured* budget to the ceiling rather than actual runtime
  (TD-128) until SPRINT-099 T2 added the missing reader** — the gate now asserts its ACTUAL runtime
  against the 600s ceiling on every run, and prints a third outcome when it truncates, so a
  truncated run is no longer byte-indistinguishable from an ordinary red gate.
  `QA_BUDGET_SECONDS` stays at 520.
  read the FAIL-line count as the verdict:** the run above printed `0 fail` over **4** `FAIL` lines,
  all from the conformance engine, which leg 2f-ter keeps deliberately informational (**TD-146**).
  The number to act on is the one the gate prints (L-120).
- **Backlog ranking** is `/triage`'s output, not this block's: tiers P0–P3 below are the record.
- **This file knowingly exceeds §2's 320-line soft cap** (~586 at the SPRINT-097 close) and the gate
  reports it every run. Ruled at that close's `/triage` rather than left as neglect: the overage is
  **task specification, not narrative** — 18 tasks averaging ~32 lines, almost all of it multi-clause
  `done-when:` and `tracker:` blocks. That density is the point, because it is what lets a task be
  promoted without re-litigating it, and L-008's remedy (collapse duplicated prose to pointers) has
  already been applied — the only narrative block left was collapsed at this close. Closing the
  remaining gap would mean either 18 satellite files (a second place to look, which this repo
  refuses) or rejecting work still wanted. **Revisit when the Backlog drops below ~12 tasks**, when
  the arithmetic stops fighting the cap.

---
## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Blocking

> _(empty — `TASK-328` shipped as SPRINT-097 T2 and was pruned at that close.)_

### P1 — Next Phase Required

- [ ] TASK-348 — Re-file TD-143's cost half against the HOST envelope, not the gate  [size: M] [risk: med] [HITL]
      class:      decision
      authority:  J2
      done-when:  `TD-143`'s open half names a subject that exists. SPRINT-099 T1 measured the gate at
                  **~9.5 MB, moving 320 kB across 547 s**, while system free memory swung **695 MB**
                  around it — so there is no gate memory cost to reduce and the row's remaining half
                  currently points at nothing. Either re-aim it at the host envelope it actually
                  depends on (562 MB free of 14 078 MB, `vmmemWSL` 1 989 MB, three `claude`
                  processes 1 178 MB, commit 41.3/56.7 GB), or rule the row closed on the grounds
                  that the mechanism is now known and the cost is not ours to pay.
      touches:    `TECH-DEBT.md` (TD-143) · possibly an ADR if the ruling is hard-to-reverse
      depends-on: none
      assumes:    none — the measurement is committed at `docs/research/qa-check-memory-profile.md`
      tracker:    TD-143 (severity: high, open — its cost half; the cheap half shipped as SPRINT-097 T4)
      origin:     manual   # re-filed at the SPRINT-100 promote governance review; its predecessor TASK-344 shipped and was pruned
      state:      ready

- [ ] TASK-349 — Decide what to do about a gate whose completion is decided by host noise  [size: M] [risk: med] [HITL]
      class:      decision
      authority:  J2
      done-when:  `TD-117` and `TD-090` have a ruling rather than a standing condition. Five
                  whole-gate runs at the SPRINT-099 close spanned **523–560 s around a 520 s budget**
                  against a 600 s external ceiling — two runs on the *same tree* gave a complete
                  `218 pass, 0 fail` and a truncation 3 s over budget. SPRINT-099 T2 made truncation
                  legible; it did not make the gate finish. Options include reclaiming leg-12 cost
                  (the per-harness table is Round 14 of `docs/research/logs/qa-gate-timing.md`:
                  seven items are ~307 s of ~545 s), moving work behind `QA_FULL=1`, or accepting
                  truncation as normal now that it reports itself. **Do not re-open the fix direction
                  ruled at SPRINT-099 D3 without evidence against it.**
      touches:    `scripts/qa-check.sh` · `evals/` harness set · `TECH-DEBT.md` (TD-117 · TD-090)
      depends-on: none
      assumes:    that closing the cost gap is still wanted — SPRINT-099 showed a truncated run is now
                  honest, which lowers the urgency without removing it. **Confirm before building.**
      tracker:    TD-117 (severity: high, open) · TD-090 (severity: high, open) · TD-128 (reader half shipped SPRINT-099 T2)
      origin:     manual   # re-filed at the SPRINT-100 promote governance review; its predecessor TASK-329 shipped and was pruned
      state:      ready

> **Epic-first**, ruled by the owner at the SPRINT-094 `/triage`: EPIC-015 § Closed-when 1 · 5 · 6
> lead, ahead of the cheaper standalone guards, because the epic cannot close without a real
> unattended run and every sprint that defers it defers the epic.

- [ ] TASK-319 — Prove § Closed-when 1 with a real unattended run against the repaired reaper  [size: M] [risk: high] [HITL]
      → **PARKED at SPRINT-098 (T4), `AUTHORITY_BOUNDARY`** — `J2` and no `approval_envelope:` was ever recorded, which reads as NOT approved. Unattempted, not attempted-and-failed. Still paired with `TASK-188` per the SPRINT-097
        `/triage` ruled. Full spec — the seeded not-all-J2 vehicle · the `--mode overnight` fire ·
        the terminal-state agreement check against the run's own committed log — lives in the sprint
        file, together with **D3** (T4's run is not gated on T2/T3 being green, so no unrelated
        slippage can foreclose its vehicle — L-111). Pointer, not a second copy (L-008).
      tracker:    EPIC-015 § Closed-when 1 · TD-112 (resolved → SPRINT-093 T1) · TD-110 (resolved → T3) · L-179
      pair-with:  **`TASK-188` — promote them into the SAME sprint** (SPRINT-097 `/triage`,
                  2026-09-11). This task's run is the only realistic vehicle TASK-188 has: 188 needs
                  a real unattended run that stops **mid-Plan**, opportunistically, and 319 is the
                  only task that deliberately fires one. Promoting 319 alone spends that artifact
                  and leaves 188 waiting for the next one. **This has already happened**: SPRINT-060
                  promoted 188 alongside four HITL tasks, G2 then correctly ruled the run
                  interactive, and that ruling foreclosed the only vehicle 188 had (L-111). Pairing
                  them does not guarantee 188's trigger — nothing can, it is opportunistic by
                  design — it guarantees that if the trigger occurs, someone is there to claim it.
      origin:     close-retro
      state:      ready

- [ ] TASK-326 — Compare a commit's claimed DoD delta against the ticks it actually made  [size: S] [risk: low] [AFK]
      class:      execution
      tier:       G (ADR-029 — a false green on a DoD is the same silent-false-negative class as a
                  guard that never fires; the artifact and the report disagree and nothing compares them)
      done-when:  a check reads each `sprint(NNN)` commit's own message for a claimed DoD figure
                  (`N of M DoD`) and reconciles it against the `[ ] → [x]` transitions that commit
                  made in the sprint file, FAILing with a named finding when they disagree — including
                  the case where a commit ticks a DoD belonging to a task it did not touch. Retained
                  must-FAIL: SPRINT-094's `6a6aeac`, which claimed "5 of 6 DoD" and flipped **three**
                  boxes, two of them T2's and T3's. Sibling control: a commit whose claim and ticks
                  agree, green in the same run. Seeded-break discrimination proof under ONE stated hash
                  convention, and a landed-but-targeted seed that reddens nothing is reported as
                  untested, never scored as a pass (L-137 · L-142 · L-169 · L-187)
      touches:    scripts/lib/ (a new checker) · scripts/qa-check.sh · evals/fixtures/ + its harness
      depends-on: none
      assumes:    the claim is machine-readable from the commit subject/body in the form this repo
                  already writes it. **Re-derive before building on it** — sample the actual
                  `sprint(NNN)` subjects rather than trusting this line (L-097). If the claim is not
                  reliably parseable, the scope narrows to the *unattributed tick* half (a commit
                  flipping a DoD outside the tasks whose `Layers:` it touched), which is the half that
                  carries the real defect, and says so
      tracker:   SPRINT-094 Execution Log, 2026-09-03 surprise — `6a6aeac` flipped three DoD sharing
                  an identical bold lead where one was intended; a replace-all matched three siblings.
                  Every downstream signal stayed clean (line caps unchanged, no grep tripped, the
                  commit body itself said "5 of 6"), and it survived a worktree-isolated review pass of
                  T1 an hour later — that reviewer read T1's script, which is where it was told to
                  look. CLAUDE.md § Anti-Patterns edit-safety (b) · L-009 · L-165
      origin:     close-retro
      state:      ready

> **Auto-escalated at the SPRINT-098 promote (2026-09-11).** The ledger's own rule sends a
> `severity: high` row to P1; the aging sweep found five open high rows and two of them — **TD-143**
> and **TD-150** — had no Backlog row at all, so the rule had no consumer for them (L-020's shape).
> TD-090 · TD-117 · TD-128 were already carried by `TASK-329` and are left where `/triage` ranked them.

> **Re-escalated at the SPRINT-100 promote (2026-09-13).** `TASK-329` and `TASK-344` shipped as
> SPRINT-099 T2/T1 and were pruned at that close — but **TD-117** and **TD-143** stay open on their
> *cost* halves, so both high-severity rows were left with no Backlog row at all: the same L-020 shape
> the SPRINT-098 note below records, recreated by a correct retention pass. Re-filed as `TASK-348`
> (TD-143, host envelope) and `TASK-349` (TD-117/TD-090, gate cost) in P1. **TD-090** keeps its
> existing tracker; **TD-150** keeps `TASK-345`.

- [ ] TASK-345 — Give `workdoo` the pinned-plugin mechanism ADR-041 already rules it has  [size: M] [risk: med] [HITL]
      class:      execution
      authority:  J2
      done-when:  `workdoo` consumes lean-flow at a **recorded version** and the pin is verifiable from
                  that repository — today ADR-041's ruling exists only as prose in `workdoo`'s
                  `CLAUDE.md`, with no `.claude-plugin/`, no plugins block in `.claude/settings.json`
                  and no version reference anywhere. Two named failures at once: the capability is
                  written only in its own file (L-020) and the decision sits where its reader — that
                  repository's install — cannot reach it (L-151).
      touches:    `workdoo` (another repository — this row is the lean-flow-side tracker, not the edit)
      depends-on: none
      assumes:    **that the fix lands in `workdoo`, not here.** lean-flow owns the ADR and the
                  consumer contract; it does not own the consumer's install. Rule at G2 whether this
                  repository owes anything beyond the ruling — a *check* for the pin would be
                  lean-flow's, and `check-skill-freshness` is the shape one level over.
      tracker:    TD-150 (severity: high, open) · ADR-041 · L-020 · L-151
      origin:     manual   # filed by hand at the SPRINT-098 promote governance review (severity: high escalation)
      state:      ready

### P2 — Follow-on

- [ ] TASK-346 — Rule `check-handoff-state.sh`'s archive glob: convert it, or record the exemption where the guard reads it  [size: S] [risk: low] [HITL]
      class:      execution
      authority:  J1
      done-when:  `scripts/lib/check-handoff-state.sh:145` either calls `lf_is_archived_path` like the
                  other eleven sites, or its exemption stops living as a comment inside
                  `qa-check.sh`'s leg 10b allow-list regex and becomes a declaration the guard reads.
                  Today the reason is sound — it MAPS a Plan path to its log path rather than
                  excluding, and self-enumerates via a literal archived-sprint glob, so it never
                  tests a caller-supplied string of unknown casing (independently verified at
                  SPRINT-099 T3 review) — but the exemption is hardcoded in a regex two files away,
                  which is L-151's shape: a ruling recorded where its reader must be told about it.
      touches:    `scripts/lib/check-handoff-state.sh` · `scripts/qa-check.sh` (leg 10b allow-list)
      depends-on: none
      assumes:    none — the mapping-vs-exclusion distinction was verified, not assumed
      tracker:    SPRINT-099 T3 (ruled OUT of scope at G2 by the owner; the eleventh exclusion site was folded in, this mapping site was not)
      origin:     close-retro
      state:      ready

- [ ] TASK-347 — Give the five archive-dependent harnesses their own case-variant fixture  [size: M] [risk: low] [AFK]
      class:      execution
      authority:  J1
      done-when:  `run-approval-envelope-fixtures.sh` · `run-night-run-rollup-fixtures.sh` ·
                  `run-review-depth-fixtures.sh` · `run-verify-reaches-fixtures.sh` ·
                  `run-system-verify-fixtures.sh` each exercise a case-variant archive path, at the
                  two-level-deeper `…/Archive/logs/…` shape the log checkers actually use. Only
                  `run-layers-completeness-fixtures.sh` has one today, so a revert at any single one
                  of those five sites is invisible to its own suite.
      touches:    the five `evals/run-*-fixtures.sh` named above
      depends-on: none
      assumes:    that per-harness coverage is still wanted GIVEN leg 10b already guards the whole
                  set against a revert in any shape — the cross-site guard was the SPRINT-099 answer
                  to this finding, and this row is the per-harness half it deliberately did not do.
                  **Confirm that before building: if leg 10b is judged sufficient, close this row
                  rather than write five near-duplicate fixtures.**
      tracker:    SPRINT-099 T3 outside review, Finding 2 (guard hole, no live bug found)
      origin:     close-retro
      state:      needs-info


> **The SPRINT-097 T1 cluster ruling (2026-09-10)** — five gate-accuracy defects ruled **four tasks,
> grouped by artifact**, with a loser named on both sides. The full reasoning lives in the archived
> sprint file (`docs/sprint/archive/SPRINT-097-guards-that-run-over-the-wrong-set.md`, T1 DoD 2) and
> in its `docs/sprint/INDEX.md` row; the rows it produced are `TASK-338`–`341` below. A pointer, not
> a second copy — a copied narrative drifts from its source (L-008).
>
> **Moved P1 → P2 at the SPRINT-097 `/triage` (2026-09-11), by owner ruling.** T1 filed these into P1
> on *cluster* grounds — they are one family and should be scheduled together — while the standing
> SPRINT-094 ruling that governs the tier is **epic-first**: EPIC-015 § Closed-when 1 · 5 · 6 lead,
> *"ahead of the cheaper standalone guards"*, which is exactly what these are. Two rulings that were
> never reconciled, and P1 had drifted to nine items with four of them non-epic work. The cluster
> stays intact and stays together; it now sits behind the epic work the tier exists to protect.

- [ ] TASK-338 — Fix both legs of `check-verify-reaches.sh`: EXISTS resolves a basename, REACHES matches use not mention  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 — a REACHES false positive is a contract false negative: an unreachable
                  criterion goes green while saying nothing about its subject, which is L-136's
                  shape inside the guard built to detect L-136)
      authority:  J1
      done-when:  **one script, two legs, fixed together.**
                  (1) **EXISTS** (TD-097): `[ ! -f "$scr" ]` at `check-verify-reaches.sh:89`
                  resolves the extracted token relative to CWD, so a Verify clause naming a script
                  by **basename** — this repo's dominant convention — is reported
                  `verify-method-absent` while the file is present. Resolve a bare basename against
                  the known script roots (`scripts/`, `scripts/lib/`, `evals/`) first, and separate
                  the findings: *unresolvable reference* is not *method absent*.
                  (2) **REACHES** (TD-087): `grep -qF` at `:102` and the `case` substring test at
                  `:96` match on mention, not use. Both reproduce: an **exclusion idiom** (the
                  script's only reference to the path *prunes* it) reads `confirmed reachable`; a
                  **prefix collision** (`src/db` matching `src/dbtools/`) reads the same. Anchor to
                  path boundaries and reject a target whose only occurrence sits in an exclusion.
                  (3) **The archive exemption at `:55` is why this looked clean for five sprints**
                  and is itself part of the fix: archived Verify clauses hold **17 bare-basename
                  references** that would every one of them trip leg (1). Re-point the exemption at
                  a retained fixture so the basename case is exercised, not exempted.
                  (4) Pointed at its motivating population, not only fixtures (L-166 · L-186): the
                  live corpus reports **0 confirmed targets** — a vacuous pass in the denominator
                  sense (L-156), so a fixture-only proof here proves nothing. Vary the
                  **selection**, not just the verdict: a target reached through the archive arm, a
                  clause naming two methods.
                  (5) Retained must-FAIL per leg, each failing with its **own named finding**, plus
                  a sibling control green in the same run; seeded-break discrimination proof under
                  ONE stated hash convention (L-169); outside reviewer dispatched worktree-isolated
                  (L-165 · L-168).
      tracks:     TD-087 · TD-097
      origin:     close-retro (SPRINT-097 T1 ruling, 2026-09-10)
      state:      ready

- [ ] TASK-339 — Normalise checkbox state before diffing § Plan, so ticking a DoD is not an unaccounted Plan edit  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       G (ADR-029 — the incentive is inverted, which is worse than a plain false
                  positive: the check rewards sprints that shifted scope and penalises sprints that
                  did not, and the only ways to clear it are to log a scope-change that never
                  happened or to leave the close gate red)
      authority:  J1
      done-when:  (1) `plan-edited-after-freeze` (`conformance-engine.sh:2078`) compares § Plan with
                  **checkbox state normalised**, so a tick is not a diff. Re-derived at SPRINT-097
                  T1: no normalisation exists anywhere in that file today.
                  (2) A genuine **text** change still demands its `scope-change` entry — the check
                  must keep doing what it was written to do.
                  (3) **The control fixture is the load-bearing one**, not the must-FAIL: a fixture
                  that ticks every box and must stay green is the case that is wrong today. Retain
                  both, each failing with its own named finding.
                  (4) Pointed at its motivating artifact (L-166): SPRINT-087's § Plan is
                  byte-identical to `plan_commit 3c14a37` once checkboxes are normalised — 28 ticks,
                  zero text changes — and still produced `plan-edited-after-freeze` plus 8 ×
                  `scope-change-logged-after-plan-edit`, 9 of that run's 17 findings.
                  (5) Seeded-break discrimination proof under ONE stated hash convention (L-169);
                  outside reviewer dispatched worktree-isolated (L-165 · L-168).
      tracks:     TD-105
      origin:     close-retro (SPRINT-097 T1 ruling, 2026-09-10)
      state:      ready

- [ ] TASK-340 — Give `check-system-verify-block.sh` a positional link, and point it at live logs  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 — the silent close that ADR-033 exists to stop, occurring inside the
                  mechanism built to stop it)
      authority:  J1
      done-when:  (1) `has_close` and `has_ruling` (`evals/lib/check-system-verify-block.sh:75-76`)
                  are whole-file greps with no positional link to the `system-verify ·` line they
                  gate, so an earlier entry's ruling masks a later unresolved FAIL. Reproduced in
                  both orderings at Sprint-084 T2 review: `PASS`, exit 0. Bind each verdict to its
                  own entry.
                  (2) **The guard has never seen a real log** — every invocation in
                  `run-system-verify-fixtures.sh` points at `$fx/…`, never at `docs/sprint/logs/`.
                  A guard that only ever sees `evals/fixtures/` has not been shown to reach this
                  repository (L-166), and its own sibling harness carries that sentence as a
                  comment. Point it at the live corpus.
                  (3) **Correction to the row as filed:** TD-086's Evidence says the checker
                  "appears nowhere in `qa-check.sh`". That half is **stale** — its harness
                  `run-system-verify-fixtures.sh` was registered in `eval_harnesses_always` at
                  SPRINT-068 T2. The substance stands (fixtures only), the wording moved; and the
                  checker still lives at `evals/lib/`, not `scripts/lib/` as the Summary says.
                  (4) The 10 retained fixtures never exercise a **two-entry log** — add one, plus a
                  sibling control green in the same run, each failing with its own named finding.
                  (5) Seeded-break discrimination proof under ONE stated hash convention (L-169);
                  outside reviewer dispatched worktree-isolated (L-165 · L-168).
      tracks:     TD-086
      origin:     close-retro (SPRINT-097 T1 ruling, 2026-09-10)
      state:      ready

- [ ] TASK-343 — Give the conformance engine's informational findings their own token  [size: S] [risk: low] [AFK]
      class:      execution
      authority:  J1
      done-when:  a reader of `qa-check.sh`'s output can tell which `FAIL` lines the verdict counts
                  and which it does not, without reading `qa-check.sh`. Today the engine's
                  informational findings print the same `FAIL ` prefix as gating ones, so the printed
                  verdict and the visible FAIL lines disagree with nothing marking the difference —
                  `QA-CHECK: 230 pass, 0 fail` over 4 FAIL lines at the SPRINT-097 close. The
                  informational design itself is correct and stays (leg 2f-ter: 27 of 43 dispositions
                  are unbuilt, and gating on them would hold the gate permanently red over tracked
                  coverage gaps) — this changes the REPORT, never the policy.
      touches:    `scripts/qa-check.sh` (leg 2f-ter relay) · `scripts/lib/conformance-engine.sh`
      depends-on: none
      assumes:    none — both readings are already known to occur, see tracker
      tracker:    TD-146 — and the misread is already recorded twice: this file's own SPRINT-097
                  promote note read `225 pass, 33 fail` against 82 FAIL lines as "33 of the 82", a
                  subset rather than a different population; and A4's reconciliation was built on
                  that number, which is why A4 cannot be reconciled as written. L-120 instructs
                  readers to trust the printed verdict and T4 shipped `qa-verdict.ts` to enforce it,
                  so the ambiguity now sits under a rule the repo actively relies on.
      origin:     close-retro
      state:      ready

- [ ] TASK-320 — Give the launcher a fire-time run ledger, closing TD-122 and TD-124 together  [size: M] [risk: med] [HITL]
      class:      execution
      authority:  J1
      done-when:  the launcher records that a run FIRED at the moment it fires, independent of
                  `reap()`'s later decision to append — so (a) a run that fires but never reaches the
                  reaper is distinguishable from one that never happened (**TD-122**), and (b)
                  `check-authority.sh` can read attendedness from a written fact instead of inferring
                  it from two defeatable signals (**TD-124**). Retained must-FAIL: a fired-but-unreaped
                  run must be detectable as such; sibling control: a never-fired tree stays green.
                  Seeded-break discrimination proof under ONE hash convention (L-142 · L-169)
      touches:    scripts/night-run.sh · scripts/lib/check-authority.sh · evals/fixtures/
      depends-on: none
      assumes:    the two rows genuinely share one mechanism — CONFIRM at G2 by re-deriving both
                  rows' evidence rather than inheriting this line; TD-122's own row states it is
                  explicitly NOT closable by better parsing, and TD-124's residual is named in
                  `check-authority.sh`'s own header comment (L-091 — a Mitigation is a hypothesis)
      tracker:    TD-122 · TD-124 · L-178
      origin:     close-retro
      state:      ready

- [ ] TASK-321 — Make skill-produced summaries lead with the conclusion  [size: M] [risk: low] [HITL]
      class:      execution
      authority:  J2
      done-when:  every summary a skill emits at a process boundary — `/prime`'s health report, an
                  `/orchestrator` task/gate completion, a close rollup, and any confirmation prompt —
                  opens with the VERDICT (what is true now / what was decided), then its evidence, and
                  ends with exactly ONE explicit next-step line. Context the reader already has is not
                  restated, and no summary buries its conclusion mid-prose. Verified by running each
                  skill cold and reading its output as a stranger would: the first line must answer
                  "what happened and what do I do next" without reading further
      touches:    skills/prime/SKILL.md · skills/orchestrator/SKILL.md ·
                  skills/lean-doc-generator/SKILL.md (§ output/rollup formats only) — and any
                  `references/` report template they own
      depends-on: none
      assumes:    the fix is a REPORT-SHAPE rule, not a length cap. Terseness is already required
                  (CLAUDE.md § Concise reporting) and did not prevent this: the reports were long
                  AND circular because nothing said where the conclusion goes. Confirm before
                  building that adding a length rule alone would not close it
      tracker:    owner feedback, 2026-08-31 — "penjelasan AI tidak runut, kesimpulan final-nya tidak
                  jelas, hanya menjabarkan hal yang berputar-putar tidak to the point"
      origin:     manual
      state:      ready

- [ ] TASK-322 — Test Round 12's ceiling apples-to-apples  [size: M] [risk: low] [AFK]
      class:      execution
      authority:  J1
      done-when:  S4.APPEND's four git-history cases are converted to TS and kept ALWAYS-ON, then the
                  always-on §4 leg is re-measured against Round 12's derived ceiling of 9.5–13.6 s on a
                  quiet host with host-load stated. SPRINT-092's 22.4–27.9 s saving is NOT a valid test
                  of that ceiling — it beat it only because those four cases moved to opt-in, so the leg
                  carries less work than the ceiling costed (Round 13 §5)
      touches:    evals/run-s4-ts-evaluators.sh · test/ · docs/research/logs/qa-gate-timing.md
      depends-on: none
      assumes:    converting the git cases keeps them cheap enough for the always-on leg. Round 13 §3
                  measured the oracle-spawning differential at 52.8–57.1 s; the git-repo construction
                  term alone is unmeasured and could dominate. Measure before promoting this
      tracker:    SPRINT-092 T4 Round 13 §5 · TD-090
      origin:     close-retro
      state:      needs-info   # /triage, SPRINT-094: HELD, and the unblocking fact is named so it
                  # can be taken — time the git-repo CONSTRUCTION term of S4.APPEND's four cases in
                  # isolation (Round 13 §3 measured the oracle-spawning differential at 52.8–57.1 s and
                  # left this term unmeasured). It is a MEASUREMENT, so it legitimately accumulates
                  # (L-094) — unlike TASK-297, which was parked on a ruling.

- [ ] TASK-341 — Widen the conformance-coverage sweep's matcher to the `S<N>.<CODE>` convention, then re-run Round 4  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       P (ADR-029 — the subject is `docs/research/conformance-coverage.md`, a research
                  round's prose, not a gate checker. It is the one member of the SPRINT-097 T1
                  cluster that is not a guard, which is why it was ruled out of the Tier G group)
      authority:  J2
      done-when:  (1) The sweep's actionable-findings matcher sees `S<N>.<CODE>` findings, not only
                  the bare-kebab convention. Re-derived at SPRINT-097 T1: `conformance-engine.sh`
                  now emits **195** `S<N>.<CODE>` occurrences against **38** distinct kebab findings,
                  so the convention the matcher was written for is the minority one and the gap is
                  wider than when the row was filed.
                  (2) **Round 4 is re-run**, not merely re-matched. TD-089's own re-file condition:
                  widening the regex without re-running leaves the round's "0 artefacts remain"
                  conclusion resting on a matcher nobody re-measured — L-108's shape in a sweep
                  rather than a guard.
                  (3) The stranger corpus's 2 unnamed FAIL lines (`S2.R-README` footer · `S6.BASE`
                  two doc rows) are named by the widened sweep, or their absence is explained.
      tracks:     TD-089
      origin:     close-retro (SPRINT-097 T1 ruling, 2026-09-10)
      state:      ready

### P3 — Long-term

> **Filed at the SPRINT-096 close (2026-09-09) and deliberately UNRANKED.** Close routes
> follow-ups to the Backlog; `/triage` ranks them. They are parked here rather than in P0 so an
> unranked row is never mistaken for a blocking one — `TASK-334` in particular affects every
> close and may well outrank this tier once groomed.

- [ ] TASK-335 — Clear two stale records SPRINT-096 found but did not own  [size: S] [risk: low] [AFK]
      class:      mechanical-ingest
      done-when:  (a) `TD-051` no longer cites `Line 225` for `check-layers-observed.sh`'s
                  subject-sprint `*/archive/*` skip — the same staleness class SPRINT-096 T2 fixed in
                  TD-125, left alone then only because it was another row's subject; the figure is
                  **derived at the point of use**, never copied from this entry (L-130). (b)
                  SPRINT-094's parked-ruling checkbox — *"archiving SPRINT-092 and SPRINT-093"* — is
                  ticked or withdrawn: the ruling was taken at the SPRINT-096 promote and both
                  sprints are archived, so the item is satisfied and reads as outstanding. Closing a
                  closed sprint's item is a governance action, which is why SPRINT-096 T2 corrected
                  its prose and left the box alone
      touches:    TECH-DEBT.md · docs/sprint/SPRINT-094-guards-for-what-nothing-reads.md
      depends-on: none
      assumes:    none — both were observed directly during SPRINT-096 T2's corpus classification
      tracker:    TD-051 · TD-125 · L-130
      origin:     close-retro
      state:      ready


> **Opportunistic by ruling, not by priority.** Neither entry below can be scheduled — each is taken
> when a run or a session produces the vehicle for it. Promoting one into a sprint whose shape cannot
> generate that vehicle is what foreclosed SPRINT-060 T5 (L-111).

- [ ] TASK-188 — Exercise the reaper on a genuinely partial Plan  [size: S] [risk: low] [HITL]
      → **PARKED at SPRINT-098 (T5)** — it rides T4's run, and T4 never fired, so its opportunistic trigger never arose. **D5 makes `unattempted` a correct outcome here, not a miss.** Still paired with `TASK-319`; spec in the
        sprint file, with **D5** recording that the opportunistic design is unchanged: the run is not
        scheduled to stop, and closing this `unattempted` is a correct outcome rather than a miss.
        Pointer, not a second copy (L-008).
      tracker:    SPRINT-060 T5 scope-change + owner ruling · ADR-016 · L-111
      pair-with:  **`TASK-319` — promote them into the SAME sprint** (SPRINT-097 `/triage`,
                  2026-09-11). 319 is the only task that deliberately fires a real unattended run,
                  and this one's trigger is a run that stops mid-Plan. The opportunistic design
                  stands and is not being changed: do not schedule a run to produce the stop. What
                  pairing fixes is the *other* half of L-111 — 319's run happening in a sprint where
                  nobody is positioned to claim the artifact if it does stop.
      origin:     close-retro
      state:      ready   # corrected blocked → ready at the SPRINT-098 promote, owner-ruled
                  # 2026-09-11. `blocked` was standing in for "opportunistic, cannot be scheduled",
                  # which is not what the state means here — `depends-on:` is `none`, and only a
                  # `ready` task is promotable, so the state as written made the 2026-09-11 pairing
                  # ruling unexecutable. The opportunistic design is unchanged and now lives in
                  # SPRINT-098 **D5**.

- [ ] TASK-327 — Exercise `check-handoff-state.sh` on the first real handoff  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       G (ADR-029 — the guard is proven on fixtures and has never seen live input)
      done-when:  a real `/handoff` is taken, its two-field record is written by `handoff/SKILL.md` to
                  the sprint's Execution Log (or to `HANDOFF-LEDGER.md` when no sprint pointer exists),
                  `prime` reports it on the next session, and the close-side reconciliation flips it to
                  `spent` — each step observed on the live artifact, not a fixture. The DoD is met when
                  `check-handoff-state.sh .` has printed a verdict about a record **it did not ship
                  with**; today it prints `skip (no handoff records)`
      touches:    no code expected — this is L-007's exercise-on-real-input half, deliberately deferred
                  because the vocabulary is new. Any fix it provokes lands in `scripts/lib/check-handoff-state.sh`
      depends-on: none — but it cannot be scheduled, only taken when a session genuinely ends mid-work
      assumes:    the write · read · reconcile path traced end-to-end at SPRINT-094 T2 is correct.
                  That trace was a **reading** of three skills, not an execution of them, which is
                  exactly the gap this task closes (L-016: when the repo cannot dogfood a feature,
                  verify on the consumer path — here the path finally becomes available)
      tracker:   SPRINT-094 T2, 2026-09-04 review round 2 — "the first real `/handoff` after this
                  sprint is what converts it from proven-on-fixtures to proven-in-place" · L-166
                  (a fixture proves a branch works; only the motivating case proves it is reachable) ·
                  TD-134 (the archive-side half of the same gap, ruled acceptable and forward-looking)
      origin:     close-retro
      state:      ready

> Rejected work lives in **`.out-of-scope/`** — each file carries its own reasoning, revisit-if and
> expiry, and `/triage` step 1 scans that directory before keeping any resembling task. The per-task
> pointer lines that used to sit here were breadcrumbs to those files, pruned under §11's TODO cap on
> the same reasoning §11 uses for shipped Backlog entries — the durable home is the `.out-of-scope/`
> file, plus git. Ids stay monotonic and are never reused: 006 · 007 · 040 · 047 · 120 · 148 (routed
> out), 318 · 323 · 324 · 325 (shipped at SPRINT-094 and pruned at the 2026-09-07 `/triage`), and 330
> (escalated then merged into `TASK-329` the same day; see § P2). For the shipped four, their
> durable home is `CHANGELOG.md` + the sprint file + git.
---

## Changelog (current sprint only)

> Move to root `CHANGELOG.md` once reflected in docs, then delete here.

**094 closed 2026-09-05 at 22 of 23**, **093 closed 2026-08-30 at 19 of 19** and **092 closed 2026-08-31 at 19 of 19** — all three written up in full in [`CHANGELOG.md`](CHANGELOG.md), unreleased, bundling into the next MINOR alongside SPRINT-088; not restated here (L-008). The previous released entry, SPRINT-091 → **v1.62.0**, is likewise there.

---

## Quick Rules

> Collapsed to a pointer at the SPRINT-092/093 promote (L-008 — this file had accreted a copy of rules
> its satellites own): curated-not-copied, built-in leverage and the ADR bar live in
> [`.claude/CLAUDE.md`](.claude/CLAUDE.md) § Design Principles + § Anti-Patterns; reporting style in its
> § Behavioral Guidelines. A copied rule drifts from the one it copied.

