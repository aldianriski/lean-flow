---
owner: Maintainer
last_updated: 2026-09-10
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

> **SPRINT-097 — Guards That Run Over the Wrong Set** →
> [`docs/sprint/SPRINT-097-guards-that-run-over-the-wrong-set.md`](docs/sprint/SPRINT-097-guards-that-run-over-the-wrong-set.md)
> — promoted 2026-09-10, five tasks, 30 DoD. **`gates_signed:` is absent, which means NOT signed:**
> G1+G2 are unsigned until the owner records them in the sprint frontmatter (L-099).

**Standing facts the Backlog depends on** — everything else that lived here was a narrative of the
SPRINT-096 promote and is now in [`CHANGELOG.md`](CHANGELOG.md) and the archived sprint file. Pruned
again at the SPRINT-097 promote on owner approval (L-008 — a copied narrative drifts from its source).

- **Debt ledger: 76 rows** (75 open · 1 accepted). Re-derive open/closed and the `severity: high` set
  **by anchoring to the `^- **TD-NNN**` row header** — a bare `grep 'status: open'` over-counts,
  because rows quote their own status strings in prose (L-108). Aging figures are derived at each
  promote, never read from here (L-097 · L-130).
- **The gate cannot currently verdict on this host.** SPRINT-096 closed under a recorded ADR-021
  override after a memory kill produced 147 lines and no `QA-CHECK:` line. `qa-budget-default`
  compares the *configured* budget to the ceiling rather than actual runtime (**TD-128**) and passes
  even when the gate dies (**TD-143**); `QA_BUDGET_SECONDS` stays at 520 because the reduction TD-117
  anticipated has no clean whole-gate sample behind it. Assume a close needs targeted evidence until
  SPRINT-097 T4 lands.
- **Backlog ranking** is `/triage`'s output, not this block's: tiers P0–P3 below are the record.

---
## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Blocking

> Re-ranked at the SPRINT-094 `/triage` (2026-09-07). Each entry below blocks work that is otherwise
> ready to start; the reason sits in its own `tracker:` line, not here.

- [ ] TASK-328 — Anchor the dispatch preflight's `Depends-on:` parser to the id list  [size: M] [risk: med] [HITL]
      → **promoted into SPRINT-097 as T2.** Full spec — Layers · Acceptance · 7 DoD · the both-call-sites
        clause · the seeded-break bar — lives in the sprint file. This row is a pointer so the Backlog
        carries no second copy to drift from it (L-008).
      tracker:    TD-132 · TD-043 · L-058 · L-165 · L-168
      origin:     decomposer
      state:      ready
### P1 — Next Phase Required

> **Epic-first**, ruled by the owner at the SPRINT-094 `/triage`: EPIC-015 § Closed-when 1 · 5 · 6
> lead, ahead of the cheaper standalone guards, because the epic cannot close without a real
> unattended run and every sprint that defers it defers the epic.

- [ ] TASK-336 — Make the run rollup unconditional, and lift the continuation contract out of a paragraph  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 — the false negative is silent by construction: a run that ends
                  mid-Plan and emits no rollup is indistinguishable from one that finished, and the
                  artifact that would tell them apart is the one the failure drops)
      authority:  J1
      done-when:  **four clauses.**
                  (1) A sprint whose Plan carries open DoD **and** whose Execution Log has no
                  `run-complete` entry with a `terminal ·` state is a **named FAIL**, and the check
                  is **not gated on run mode**. Today `check-night-run-rollup.sh` is reachable only
                  through the reaper, which fires on unattended runs — so the mode this repo
                  actually runs in has no guard at all.
                  (2) Pointed at its **motivating population**, not only at fixtures: **44 of 50**
                  sprint logs in this repo carry no `run-complete` entry (42 of 48 archived, plus
                  both active ones) — derived three ways that agree, `48 = 42 + 6`. Decide per
                  ADR-021 whether those are grandfathered or backfilled; either ruling is fine, an
                  unstated one is not.
                  (3) Retained must-FAIL **plus** a sibling control that stays green in the same
                  run: an attended sprint missing its rollup FAILs with its named finding, while an
                  attended sprint carrying one PASSes. Without the control, a checker that always
                  reported "missing" would satisfy the first half.
                  (4) The **continuation contract** moves out of `orchestrator/SKILL.md` step 4's
                  ~200-word paragraph into its own headed section, at the same structural level as
                  G1/G2 — the form those two have and that this rule lacks, which is the whole
                  finding of L-192 and not a cosmetic preference.
      touches:    scripts/lib/check-night-run-rollup.sh · scripts/night-run.sh (reap gate) ·
                  skills/orchestrator/SKILL.md · evals/fixtures/
      depends-on: none
      assumes:    that grandfathering the 44 existing logs is acceptable — **UNCONFIRMED**, and it
                  is an owner ruling rather than a measurement, so it is decided at this task's G2
                  and not parked waiting for evidence that will not arrive (L-094)
      tracker:    L-192 · ADR-016 (the launcher writes the rollup) · L-166 (the mode-axis sibling)
      origin:     manual
      state:      ready

- [ ] TASK-319 — Prove § Closed-when 1 with a real unattended run against the repaired reaper  [size: M] [risk: high] [HITL]
      class:      execution
      authority:  J2
      done-when:  a genuinely unattended run fires via `--mode overnight`, reaps, and writes a
                  `terminal ·` line whose state AGREES with its own per-task lines — verified by
                  `check-night-run-rollup.sh` against the run's own committed log, not a fixture. The
                  run must exercise the two defects SPRINT-093 repaired but never observed together in
                  one live run: the reap gate that ignored the canonical mode name (T3) and the
                  window/agreement matrix (T1). EPIC-015 § Closed-when 1 is ticked only on that
                  artifact — SPRINT-093 closed the GUARD gap and proved each half separately, which is
                  not the same claim as "a run ends only at one of five named states" (L-007's
                  exercise-on-real-input half; L-166 — fixtures prove a branch works, the motivating
                  artifact proves it is reachable)
      touches:    docs/sprint/ (a seeded Plan a run is permitted to execute) · scripts/night-run.sh (read, not modified)
      depends-on: none — but it needs a Plan that is NOT all-J2, since pre-flight item 3 now refuses
                  one outright under SPRINT-093 T4's STRICT ruling. Seed the vehicle the way SPRINT-090
                  did, rather than re-declaring real work AFK to make a run fire (that is reshaping a
                  task to dodge a gate)
      assumes:    the reap-gate and agreement fixes hold under a live run — UNCONFIRMED by construction,
                  which is the entire point of this task; T3's reviewer reproduced the chain in a
                  throwaway repo, never in this one
      tracker:    EPIC-015 § Closed-when 1 · TD-112 (resolved → SPRINT-093 T1) · TD-110 (resolved → T3) · L-179
      origin:     close-retro
      state:      ready

- [ ] TASK-296 — Run bounded unattended repair on one J1 finding  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 · D4 — an unbounded or silently-skipped repair both end in a green run)
      done-when:  a concrete J1 critic finding drives repair → re-review → continue, with the retry
                  ceiling **exactly** what ADR-022 admits and no more; a second failure escalates
                  rather than looping. Retained must-FAIL: a repair that exceeds the ceiling fails
                  with its named finding while a within-ceiling sibling passes
      touches:    skills/orchestrator/references/review-scoping.md § The revise loop ·
                  skills/orchestrator/references/night-run.md · scripts/night-run.sh
      depends-on: none — TASK-292 and TASK-293 both closed at SPRINT-088 (`dc3690a`); the block
                  was stale, cleared at the SPRINT-094 /triage
      assumes:    the ceiling is **not** re-decided here. Whether unattended repair inherits ADR-022's
                  single retry or earns its own is a **measurement** that accumulates from EPIC-006's
                  records (L-094); freezing a number before those exist is L-130. This task ships the
                  loop at the ceiling ADR-022 already admits
      tracker:    EPIC-015 § Closed-when 5 · V3 H31 · ADR-022
      origin:     decomposer
      state:      ready

- [ ] TASK-297 — Emit a typed run outcome with the evidence behind it  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 · D4)
      done-when:  every run emits `DELIVERED` / `PARTIAL` / `FAILED` **plus** DoD counts, tasks
                  attempted/completed, parks, repair cycles, verification state, warnings and terminal
                  reason. Retained must-FAIL: a run ending mid-Plan that reports `DELIVERED` fails
                  with its named finding while a genuinely-exhausted sibling passes
      touches:    skills/orchestrator/references/night-run.md · scripts/night-run.sh ·
                  templates/sprint-log.md.template
      depends-on: none — TASK-293 closed at SPRINT-088 (`dc3690a`). The outcome is still a function of
                  the terminal state that task shipped
      assumes:    **open question, ruled at this task's G2, not assumed here:** whether the
                  run-outcome vocabulary belongs to EPIC-015 or to EPIC-008's Run Protocol. V3 §11
                  says build only what hardening needs and leaves EPIC-008 owning the portable
                  protocol — so the ruling must land before a `RunSummary` shape is minted, or the two
                  epics mint competing ones
      tracker:    EPIC-015 § Closed-when 6 · V3 H37 · EPIC-008
      origin:     decomposer
      state:      ready   # /triage, SPRINT-094: the open EPIC-015-vs-EPIC-008 question is a
                  # JUDGEMENT CALL, closed by ruling, not by waiting for evidence (L-094) — and this
                  # row already schedules that ruling at its own G2, which is where CONTEXT.md puts an
                  # unconfirmed assumption. Parking it on needs-info parked it forever.

- [ ] TASK-300 — Decide whether the five gate-accuracy defects are one task or five  [size: S] [risk: low] [HITL]
      → **promoted into SPRINT-097 as T1.** Full spec lives in the sprint file. A decomposition
        ruling, not a fix — the five fixes are explicitly § Out of that sprint.
      tracker:    SPRINT-087 close sweep · TD-086 · TD-087 · TD-089 · TD-097 · TD-105
      origin:     close-retro
      state:      ready

- [ ] TASK-334 — Make a verdict-less `qa-check.sh` run FAIL loudly instead of reading as 0 failures  [size: S] [risk: low] [AFK]
      → **promoted into SPRINT-097 as T4**, and **escalated P3 → P1 at that promote** because TD-143
        is `severity: high` and the ledger auto-escalates a high row. Full spec in the sprint file;
        scoped to the gate's *reporting*, never its cost.
      tracker:    TD-143 · TD-090 · TD-117 · TD-084 · L-120
      origin:     close-retro
      state:      ready

- [ ] TASK-337 — Scope the epic-state checker's member set to sprints this repository owns  [size: M] [risk: med] [HITL]
      → **filed and promoted at the SPRINT-097 promote, as T5.** Full spec in the sprint file.
        `member_plan()` resolves a member sprint number by globbing *this* repo's archive, so
        EPIC-016's workdoo members (ADR-041) resolve to lean-flow's own same-numbered sprints and
        report two false `close_commit` mismatches on a correct artifact. L-186's shape exactly:
        the detection logic is sound, the member set it runs over is not.
      tracker:    TD-144 · ADR-041 · L-186 · L-166
      origin:     manual
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

### P2 — Follow-on

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

- [ ] TASK-329 — Make gate truncation a distinct outcome from gate failure  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 — a skipped harness is an UNRUN guard, and the run still prints a verdict
                  in the same shape a completed run prints. The gate cannot report on itself)
      authority:  J1
      done-when:  **MERGES TASK-330 (TD-117) into this row — ruled at the 2026-09-07 decompose.** One
                  mechanism serves both rows: the run's actual duration and what it failed to reach
                  become first-class output. Six clauses.
                  (1) A run that trips the budget checkpoint no longer prints the SAME verdict shape a
                  genuinely-failing run prints. Today `qb_checkpoint` calls `bad`, prints
                  `QA-CHECK: <pass> pass, <fail> fail` — byte-identical in shape to the Summary block —
                  and exits 1, so truncation and failure are indistinguishable to any reader or script.
                  (2) The truncation verdict NAMES the actual elapsed seconds and every leg or harness
                  it did not reach, **enumerated by name**. Today the message says *"Every leg from
                  here on, including all eval harnesses, is skipped"* and names not one — which is how
                  six skipped harnesses went unnoticed, two of them (`run-verify-reaches-fixtures.sh`,
                  `run-qa-budget-fixtures.sh`) guards of the gate itself.
                  (3) The ACTUAL runtime is asserted against the ceiling — TD-128's half. **Explicitly
                  out of scope: `check-qa-budget-default.sh` is correct within its declared scope**
                  (configured default < ceiling) and is NOT what changes; TD-128 is a *missing* reader,
                  not a broken checker. Do not "fix" it by widening that script.
                  (4) A reader distinguishes the three outcomes off the printed verdict line alone —
                  the line the gate prints, never a wrapper's exit code (L-120).
                  (5) Retained must-FAIL + sibling control: a run seeded to trip the checkpoint reports
                  the truncation outcome and names its unrun harnesses, while a genuinely-failing run
                  in the same suite still reports FAIL. Seeded-break discrimination proof under ONE
                  stated hash convention, seed verified landed, artifact still parses, break targeted
                  not demolition, and a landed seed that reddens nothing reported as untested rather
                  than scored as a pass (L-137 · L-142 · L-169 · L-187).
                  (6) **Pointed at the motivating condition, not fixtures alone (L-166):** reproduce
                  TD-117's measurement — a run under concurrent worktree agents, or a checkpoint seeded
                  to trip where the real one tripped (`run-s2-placement-fixtures.sh`) — and show the
                  same six harnesses named in the output
      touches:    scripts/qa-check.sh (the `qb_checkpoint` truncation path and the § Summary block —
                  the two places that print the verdict) · scripts/lib/qa-budget-check.sh ·
                  evals/run-qa-budget-fixtures.sh · evals/fixtures/qa-budget/**
      depends-on: none
      assumes:    **the fix DIRECTION is ruled at intake, not left to G2.** TD-117's row offers three
                  and rules none: cap dispatch concurrency · raise the budget with the ceiling raised ·
                  make the skipped-harness list its own named outcome. **The third is chosen.** The
                  first slows the worktree-isolated parallel review this repo mandates for Tier G
                  (L-165 · L-168) and would rest on a concurrency figure nobody has measured; the
                  second cannot work — the 600 s ceiling is external and not ours to raise, and
                  `qa-check.sh:27`'s own comment already calls the current 520 "NOT a permanent
                  figure". The third fixes the REPORT rather than the speed, and it is the report that
                  is lying. Speed remains a separate, unfiled concern.
                  Note the merged rows disagree on one number: TD-117 quotes a 450 s default, which is
                  stale — `qa-check.sh:27` has read 520 since SPRINT-093. Re-derive at build; quote
                  neither
      tracker:    **TD-128** (`severity: high`, open, Sprint-092 — the guard passes precisely when the
                  thing it guards is failing; one hypothesis already DISPROVED, do not re-run it:
                  pruning 18 worktrees measured 1413 s before, 1450 s after) ·
                  **TD-117** (`severity: high`, open, Sprint-091 — 533 s against a 469 s checkpoint
                  under 5 concurrent agents, six harnesses skipped, reproduced independently by a
                  second observer at 499 s/460 s tripping at the same harness) ·
                  **supersedes TASK-330**, retired into this row · TD-084 · TD-091 · L-120 · L-166
      origin:     decomposer
      state:      ready

> **`TASK-330` is retired into `TASK-329`** (2026-09-07 decompose). TD-117 and TD-128 are one
> mechanism — the gate's own duration and what it failed to reach are both unreported — so two rows
> would have meant two passes over the same code with a stale dependency between them. The id is
> **not reused**; TD-117's escalation note in `TECH-DEBT.md` points here.

### P3 — Long-term

> **Filed at the SPRINT-096 close (2026-09-09) and deliberately UNRANKED.** Close routes
> follow-ups to the Backlog; `/triage` ranks them. They are parked here rather than in P0 so an
> unranked row is never mistaken for a blocking one — `TASK-334` in particular affects every
> close and may well outrank this tier once groomed.

- [ ] TASK-333 — Rule which `Layers:` parser is correct, then make both checkers read one extractor  [size: M] [risk: med] [HITL]
      → **promoted into SPRINT-097 as T3.** Full spec lives in the sprint file, including the clause
        that the ruling is taken on a *counted* basis — derive how many Plans carry unbackticked
        `Layers:` before choosing, since requiring backticks makes every one of them undeclared.
      tracker:    TD-142 · L-108 · L-189 · L-058
      origin:     close-retro
      state:      ready


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
      class:      execution
      done-when:  a real unattended run that stops mid-Plan leaves a rollup naming the untouched tasks
                  as `unattempted`, verified end-to-end through `scripts/night-run.sh` rather than via
                  `--reap`
      touches:    scripts/night-run.sh (only if the exercise finds a defect) · a sprint Execution Log
      depends-on: none
      assumes:    **carried from SPRINT-060 T5, acceptance unmet — read the ruling before re-promoting.**
                  The trigger is OPPORTUNISTIC and that is the whole design: the next night run that
                  stops mid-Plan *for its own reasons* is the exercise. Do not schedule a run to produce
                  one, and do not promote this into a sprint whose shape cannot generate it — SPRINT-060
                  promoted it alongside four HITL tasks, the run mode was then ruled interactive at G2,
                  and that foreclosed the only vehicle it had (L-111). Its partial-Plan path is already
                  proven three ways that each stop short of the others: a real log through `--reap`, a
                  zero-ticked-box regression, and an end-to-end launcher run against a complete Plan
      tracker:    SPRINT-060 T5 scope-change + owner ruling · ADR-016 · L-111
      origin:     close-retro
      state:      blocked

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

