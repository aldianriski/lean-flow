---
owner: Maintainer
last_updated: 2026-09-09
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

> **None.** `SPRINT-096 — Rule the Ownership Tension` closed 2026-09-09 at **17 of 17 DoD**
> (`close_commit: 7dfd573`) and is **archived** with its log →
> [`archive/SPRINT-096-rule-the-ownership-tension.md`](docs/sprint/archive/SPRINT-096-rule-the-ownership-tension.md)
> · [`INDEX.md`](docs/sprint/INDEX.md) · [`CHANGELOG.md`](CHANGELOG.md) for what shipped. Next sprint
> is formed by `/lean-doc-generator promote` from the groomed Backlog.
>
> **Read before the next promote:** `TASK-333` · `TASK-334` · `TASK-335` were filed at this close and
> sit **unranked in § P3** — close routes follow-ups, `/triage` ranks them. `TASK-334` in particular
> may outrank that tier once groomed: it is the one that makes a verdict-less `qa-check.sh` run fail
> loudly instead of reading as zero failures, and this close had to proceed under a recorded ADR-021
> override because the gate could not speak (**TD-143**).

**Standing facts the Backlog depends on** — everything else that lived here was a narrative of the
SPRINT-096 promote and is now in [`CHANGELOG.md`](CHANGELOG.md) and the archived sprint file. Pruned
at the SPRINT-096 close on owner approval (L-008 — a copied narrative drifts from the one it copies).

- **Debt ledger: 78 rows.** Re-derive open/closed and the `severity: high` set **by anchoring to the
  `^- **TD-NNN**` row header** — a bare `grep 'status: open'` over-counts, because rows quote their
  own status strings in prose (L-108). Aging figures are derived at each promote, never read from
  here (L-097 · L-130).
- **`QA_BUDGET_SECONDS` stays at 520.** The reduction TD-117 anticipated is not available on
  evidence: no clean whole-gate sample exists on this host. `qa-budget-default` compares the
  *configured* budget to the ceiling rather than actual runtime (**TD-128**) — and it passes even
  when the gate dies, which is **TD-143**.
- **The gate cannot currently verdict on this host.** SPRINT-096 closed under a recorded ADR-021
  override after a memory kill produced 147 lines and no `QA-CHECK:` line. Assume a close needs
  targeted evidence until `TASK-334` lands.
- **Backlog ranking** is `/triage`'s output, not this block's: tiers P0–P3 below are the record.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Blocking

> Re-ranked at the SPRINT-094 `/triage` (2026-09-07). Each entry below blocks work that is otherwise
> ready to start; the reason sits in its own `tracker:` line, not here.

- [ ] TASK-328 — Anchor the dispatch preflight's `Depends-on:` parser to the id list  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 — the false HALT is the loud half; the false `PASS shared-file-owned`
                  issued off a phantom edge is the silent one, and it green-lights a wave that has no
                  ownership order at all)
      authority:  J1
      done-when:  **five observable clauses.**
                  (1) The snippet extracted from `dispatch.md` by its own anchors, run against
                  **SPRINT-094's sprint file** — the motivating artifact, not a fixture (L-166) —
                  yields `PASS wave-computation: T1=0 T2=0 T3=0 T4=0` and **no** `FAIL cycle-detected`.
                  Today that same input yields `FAIL cycle-detected: tasks unresolved -> T2 T3` plus
                  three `PASS shared-file-owned … order=T1->T2` derived from edges that do not exist.
                  (2) A literal `none` short-circuits the field: no id is harvested from it, or from
                  any line continuing it.
                  (3) **BOTH call sites are fixed, each proved by its own fixture.** The
                  `"Depends-on:"*)` field arm and the indented-continuation `D)` arm run the same bare
                  `grep -oE 'T[0-9]+'`; fixing one leaves the other leaking, and a fixture that only
                  exercises the field arm passes over that (L-058). SPRINT-094's prose ran onto
                  continuation lines, so the continuation arm is where most phantom ids came from.
                  (4) Declared ids still parse — `Depends-on: T1 · T2 — but see **D1** (…)` yields
                  exactly `[T1,T2]`, neither more nor fewer.
                  (5) Retained must-FAIL + a sibling control that stays green in the same run, added to
                  the EXISTING harness. Seeded-break discrimination proof: seed verified landed, the
                  artifact still parses, the break is targeted not a demolition, and a landed seed that
                  reddens nothing is reported as untested rather than scored as a pass — all under ONE
                  stated hash convention (L-137 · L-142 · L-169 · L-187)
      touches:    skills/orchestrator/references/dispatch.md (the `<!-- dispatch-preflight:start/end -->`
                  snippet — the `"Depends-on:"*)` arm AND the indented `D)` continuation arm) ·
                  evals/run-dispatch-preflight-fixtures.sh (8 cases today) ·
                  evals/fixtures/dispatch-preflight/**
      depends-on: none
      assumes:    **three, each resolved at intake by reading rather than asked or inferred.**
                  (A1) Explanatory prose FOLLOWS the ids or `none` on the field; it never precedes
                  them — confirmed against SPRINT-094's four tasks, every one of which writes
                  `none — <prose>`. The anchored design tolerates either order, so A1 being wrong
                  costs nothing.
                  (A2) Both call sites carry the defect — confirmed by reading the snippet, not
                  inherited from TD-132's Location line, which names only the field arm.
                  (A3) The harness extracts the REAL shipped snippet by anchor, never a hand-copied
                  duplicate, so a fixture cannot pass against a stale copy of the code.
                  **Contract ruled at intake, not left for G2:** the parser tolerates prose; the
                  `Depends-on:` field keeps carrying reasoning. The alternative — lint the field down
                  to bare ids — was rejected: it deletes a field authors demonstrably use and makes
                  every existing sprint file non-conforming
      tracker:    **TD-132** (`severity: high`, open, Sprint-094; reproduced two independent ways —
                  reading the code, and running it: `T2 -> [T1,T2,T1,T2]`, a self-edge no topological
                  sort resolves) · **TD-043** — the same hardening already applied to the `Layers:`
                  side of this very snippet via `TOK`, while `Depends-on:` was left unanchored ·
                  L-058 · L-165/L-168 (Tier G ⇒ worktree-isolated outside reviewer) ·
                  ships to consumers inside the plugin, and `orchestrator/SKILL.md` § sprint-bulk
                  step 3 tells every run to execute it before dispatching a wave
      origin:     decomposer
      state:      ready
### P1 — Next Phase Required

> **Epic-first**, ruled by the owner at the SPRINT-094 `/triage`: EPIC-015 § Closed-when 1 · 5 · 6
> lead, ahead of the cheaper standalone guards, because the epic cannot close without a real
> unattended run and every sprint that defers it defers the epic.

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
      class:      decision
      done-when: a recorded ruling says whether TD-086 · TD-087 · TD-089 · TD-097 · TD-105 are fixed
                  as one "gate accuracy" task or separately, and the chosen shape is filed — not a fix,
                  a decomposition call
      touches:   TECH-DEBT.md · TODO.md (no code)
      depends-on: none
      assumes:   **the cluster is real, not an artifact of one sprint noticing things.** All five are
                  accuracy defects in the checkers that gate this repo, and two of them —
                  TD-087 (REACHES half) and TD-097 (EXISTS half) — are the *same script*,
                  `check-verify-reaches.sh`, filed three sprints apart with neither aware of the other
                  until SPRINT-087's close sweep read both rows together. That pairing is the evidence
                  the cluster is a cluster; the rest is judgement.
      tracker:   SPRINT-087 close sweep · TD-086 · TD-087 · TD-089 · TD-097 · TD-105
      origin:    close-retro
      state:     ready

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
      class:      decision
      tier:       G (ADR-029 — both subjects are gate checkers; the ruling changes what "declared"
                  means for every sprint file in the tree, so a wrong call is silent in one
                  direction and noisy in the other)
      done-when:  one recorded ruling says whether a `Layers:` token must be backtick-quoted, and
                  `check-layers-observed.sh` and `check-layers-completeness.sh` derive their tokens
                  from **one** extractor rather than two that disagree while both claim parity in
                  comments (**TD-142**). The ruling is taken on a **counted** basis, not a stylistic
                  one: derive how many live and archived sprint Plans carry unbackticked `Layers:`
                  before choosing, because requiring backticks makes every one of them undeclared.
                  Both directions are defects and both must be closed — the observed checker
                  over-reports on a bare path, and the completeness checker's `grep -qF` is a
                  **substring** test that accepts a token appearing anywhere in the line, including
                  inside a longer path or a trailing comment (L-108, failing green)
      touches:    scripts/lib/check-layers-observed.sh · scripts/lib/check-layers-completeness.sh ·
                  evals/run-layers-observed-fixtures.sh ·
                  evals/run-layers-completeness-fixtures.sh · docs/sprint/SPRINT-*.md (if the ruling
                  requires backticking existing Plans — count first, that may be the larger half)
      depends-on: none
      assumes:    **The divergence is real and measured, not inferred:** SPRINT-096's Plan yields 0
                  declared tokens to the observed checker where SPRINT-095's yields 14, backticks
                  being the only difference. Pre-existing, not introduced by SPRINT-096 T3 — a
                  pristine-vs-patched A/B returned byte-identical output. *Confirm both figures
                  against the tree before designing; they will have moved if any Plan is edited*
      tracker:    **TD-142** · L-108 (matched by shape, not substring) · L-189 (a SPRINT-095 fixture
                  was silently green for exactly this reason) · L-058
      origin:     close-retro
      state:      ready

- [ ] TASK-334 — Make a verdict-less `qa-check.sh` run FAIL loudly instead of reading as 0 failures  [size: S] [risk: low] [AFK]
      class:      execution
      tier:       G (ADR-029 — this is the gate's own report; a run that cannot speak currently
                  presents as a clean partial, which is the silent-false-negative shape)
      done-when:  a `qa-check.sh` run that terminates without printing its `QA-CHECK: N pass, M fail`
                  verdict line is reported as a FAILURE by whatever invokes it, rather than leaving
                  the caller to infer a result from "0 FAILs so far" (**TD-143**). Deliberately
                  scoped to the *reporting*, not the *cost*: this does not attempt to make the gate
                  finish (TD-090 · TD-117), it makes not-finishing unmistakable. **Exercised on a
                  real verdict-less run**, not only a fixture — kill a run mid-flight and confirm the
                  wrapper reports failure (L-007 · L-166)
      touches:    scripts/qa-check.sh (or its callers) · evals/ (retained must-FAIL fixture)
      depends-on: none — independent of the memory cost itself
      assumes:    **The wall-clock guard does not cover this and that is measured, not assumed:** the
                  SPRINT-096 system-verify run printed `PASS qa-budget-default: 520s < 600s` and was
                  then killed by the host for memory, emitting 147 lines and 0 FAIL with no verdict.
                  *Confirm the budget guard still passes on a memory kill before building on it*
      tracker:    **TD-143** · TD-090 · TD-117 · TD-084 (the wall-clock mode this does NOT duplicate)
                  · L-120 (the number to read is the one the gate prints)
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

