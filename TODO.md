---
owner: Maintainer
last_updated: 2026-09-08
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

> **SPRINT-096 — Rule the Ownership Tension** → [`docs/sprint/SPRINT-096-rule-the-ownership-tension.md`](docs/sprint/SPRINT-096-rule-the-ownership-tension.md)
>
> Promoted 2026-09-08 from the P0/P2 unblock path, not the P1 epic lead: `TASK-331` (rule the
> tension) → `TASK-332` (correct TD-125's cause) → `TASK-298` (bring the sibling skip into line).
> **Single stream** — `stream:` stays omitted. `epic:` is omitted too: these are attribution-guard
> tasks, not EPIC-015 members. **Gates are NOT signed** — `gates_signed:` is absent from the sprint
> frontmatter and its absence means exactly that; an unattended run reads the sprint file and nothing
> else (L-099).
>
> **Read `TASK-331` first.** Three designs were each broken by an independent review, each the same
> laundering class one level deeper — cited number, then number + window (windows nest: SPRINT-089/090
> share a close commit), then number + declarations (`docs/LEARNINGS.md` is declared by **74 of 91**
> archived sprints). A commit subject is an unverifiable claim, so refining it produces another proxy,
> not a fix (**L-190**). The decisive fact is that **the laundering channel is pre-existing** — the
> active-sibling skip has always trusted the cited number with no test at all (**TD-141**, `high`). A
> fourth attempt without a ruling repeats the loop.
>
> **`L-186` was promoted at this promote** → `.claude/CLAUDE.md` § Anti-Patterns, clause **(iv)** of
> the Tier-G bar. Nothing else is promotable: 7 of 169 entries carry `count ≥ 2` and it was the only
> one still `promoted: no`.

**§11 retention — four actions applied at the SPRINT-096 promote, on owner approval.**
**SPRINT-092 and 093 are ARCHIVED** (Plans → `docs/sprint/archive/`, logs → `archive/logs/`, one
commit, INDEX rows for both). Moved as a **pair** per TD-125, and measured rather than assumed: clean
HEAD reported 6 FAILs across the four sprints; after the move, what `qa-check` passes (094 + 095 only)
reports the same 4 — two removed, none added. **SPRINT-094 and 095 remain unarchived.** Also applied:
CHANGELOG rotation (v1.58.0 · v1.59.0 · v1.60.0 → `docs/changelog/`, root 416 → 310 lines, two minors
inline as §11 requires); five 093-cohort debt rows deleted on the clock S-094 set (**TD-109 · TD-110 ·
TD-111 · TD-112 · TD-123**; `TD-101`/`TD-113` stay, due SPRINT-097); and 103 promoted learnings
collapsed to their §11 pointers (`docs/LEARNINGS.md` 1226 → 916). **Not taken:** the `TODO.md` prune —
this file stays **551** against a 320 soft cap, and this § Active Sprint narrative is still the
remaining prune candidate (it restates `CHANGELOG.md` — L-008; owner-gated).

**The debt ledger holds 76 rows — 74 open, 2 not-open**, of which **5 open rows are `severity: high`**
and all five carry a Backlog entry: `TD-141` → `TASK-331` · `TD-132` → `TASK-328` · `TD-128` and
`TD-117` → `TASK-329` · `TD-090` → `TASK-322`. **Derive those counts by anchoring to the row header** —
a bare `grep 'status: open'` over this ledger over-counts, because the rows quote their own status
strings in prose (L-108). The ≥3-sprints aging figure is **61 of 74**, derived at this promote and
recorded in the ledger's own sweep note; re-derive it next promote rather than reading it from here
(L-097 · L-130). **One row is flagged rather than closed: `TD-132` is still `open` although its
tracker `TASK-328` shipped at SPRINT-095** — a sweep closes a row by reading the tree, and this one
did not re-derive TD-132's claim.

**SPRINT-092 shipped the §4 conversion and measured it.** Default-profile saving **22.4–27.9 s**
(23.4–28.2 s removed, 0.37–0.98 s added), with §4 rules still evaluating on every bare run. The saving
exceeds Round 12's 9.5–13.6 s ceiling by ~2× and **that is not the conversion outperforming** — the
ceiling costed twelve cases converted, and the shipped leg does not carry S4.APPEND's four git cases at
all (they moved to opt-in, D4). Total work across both profiles went **up** ~76–85 s.

**`QA_BUDGET_SECONDS` stays at 520 — the reduction TD-117 anticipated is NOT available on evidence.**
No clean whole-gate sample was obtained: the default profile exceeds the 600 s command ceiling on this
host and the opt-in profile measures 1450 s, while `qa-budget-default` passes by comparing the
*configured* budget to the ceiling rather than the actual runtime (**TD-128**). A pruning of 18 stale
worktrees (178 MB) was tried as the cause and **disproved** — 1413 s before, 1450 s after. Three have
accumulated again under `.claude/worktrees/`.

**The §11 prune is DONE — ruled by the owner at the 2026-09-07 `/triage`.** `TASK-318` · `323` ·
`324` · `325` shipped at SPRINT-094 (T3 · T4 · T1 · T2) and their Backlog entries are removed; the
durable home is `CHANGELOG.md` + the sprint file + git, and the ids are recorded as never-reused in
§ P3 below. They had been re-proposed at three consecutive closes.

**The Backlog is ranked, epic-first (owner ruling, same pass).** Four tiers replace the single
undifferentiated P1: **P0** `TASK-298`/`328` (each blocks work that is otherwise ready) · **P1**
`TASK-319`/`296`/`297`/`300`/`326` (EPIC-015 § Closed-when 1 · 5 · 6 lead) · **P2**
`TASK-320`/`321`/`322`/`329` · **P3** `TASK-188`/`327`, opportunistic by ruling and not
schedulable. Route **`TD-120`** next: the S4.APPEND git-spawn cost, **before** H24–H26.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Blocking

> Re-ranked at the SPRINT-094 `/triage` (2026-09-07). Each entry below blocks work that is otherwise
> ready to start; the reason sits in its own `tracker:` line, not here.

- [ ] TASK-298 — Make both sibling arms trust the cited number, per ADR-040  [size: S] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 — this IS the attribution guard. The ruling NARROWS what it claims
                  rather than widening an exclusion, but a guard that stops checking something must
                  still fail loudly on everything it still checks)
      done-when:  archived and active siblings are decided by **one** rule — the cited sprint number
                  alone, no declaration test and no window test — per
                  [`ADR-040`](docs/adr/ADR-040-commit-ownership-accepts-the-subject-claim.md), while
                  every genuinely undeclared path still FAILs with its named finding. Concretely:
                  SPRINT-095 T1's declaration + window machinery and its temp-file map are
                  **reverted** (`2335eab` · `f1fdf02` · `e4547b3`, +94 lines / 0 removed, currently
                  on `main` at 0 of 6 DoD), and archived sprint numbers are discovered from their
                  **filenames** — no `git`, no frontmatter read, no window — so they land in
                  `sibling_sprints` beside the active ones. A *literal* revert is NOT the task: it
                  would drop archived sprints from the trusted set entirely and flip the asymmetry
                  instead of removing it. The rule is named in a comment where the code's reader
                  meets it, and it cites ADR-040 rather than restating it
      touches:    scripts/lib/check-layers-observed.sh (the `sibling_sprints` build and the
                  per-commit skip — re-derive both line numbers, do not quote them from here) ·
                  evals/fixtures/layers-observed/** · evals/run-layers-observed-fixtures.sh
      depends-on: TASK-331 — SHIPPED as SPRINT-096 T1, ADR-040 recorded 2026-09-08
      assumes:    **The archival half of this task's original motivation is already resolved, and
                  measured — do not rebuild it.** SPRINT-092 and 093 were archived as a pair at the
                  SPRINT-096 promote and the gate did not go red: clean HEAD reported 6 FAILs across
                  the four sprints; after the move, what `qa-check` passes (094 + 095 only) reports
                  the same 4 — two removed, none added. What remains is making the RULE consistent,
                  not making archival possible. **The earlier `assumes:` on this row is superseded**:
                  its active-sibling half shipped as `TASK-299`, and its statement that the
                  `*/archive/*` filter at the `sibling_sprints` build is the operative mechanism is
                  **false and measured false** — 092 is blamed for 85 commit:path pairs both with
                  that line present and with it deleted; the mechanism is `qa-check.sh` handing the
                  checker a non-recursive `ls docs/sprint/SPRINT-*.md`. Correcting that claim
                  wherever it still appears is `TASK-332`'s subject, not this row's
      tracker:    **ADR-040** (the ruling) · **TD-141** (stays `open` until this lands — the tree
                  still runs the rejected design) · TD-125 · TASK-299 + TD-107 · L-020 ·
                  L-165/L-168 (worktree-isolated reviewer, mandatory — Tier G) · L-166 · L-186
                  (vary the SELECTION, not the verdict) · L-190
      origin:     manual
      state:      ready

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

- [ ] TASK-331 — Rule the archived-sprint ownership tension, then re-scope TASK-298  [size: M] [risk: high] [HITL]
      class:      decision
      done-when:  a recorded ruling on **which failure this repo accepts**, because it cannot avoid
                  both: (a) report commits citing an archived sprint → TD-125's false positives make
                  archiving turn the gate red; (b) skip them → a commit subject launders real
                  undeclared work. **The pre-existing code already chose (b) for ACTIVE siblings and
                  never said so** — the skip trusts the cited number with no declaration or window
                  test (verified at `2335eab~1`), so any ruling must cover BOTH sibling kinds or it
                  is inconsistent by construction. Not a fix: a ruling, plus the re-scoped shape of
                  TASK-298 that follows from it
      touches:    TECH-DEBT.md · TODO.md · possibly scripts/lib/check-layers-observed.sh (no code
                  change is made under this task)
      depends-on: none
      assumes:    **three designs were each broken by an independent review — do NOT attempt a
                  fourth without re-scoping first (L-190).** Cited number → 91 numbers exempt
                  anything. Number + window → windows nest (SPRINT-089/090 share a close commit).
                  Number + declarations → declarations are shared (`docs/LEARNINGS.md` is declared by
                  74 of 91 archived sprints). Options worth costing, none taken: make archival not
                  change the checker's input set at all (a `qa-check.sh` glob change rather than
                  ownership logic); accept the channel explicitly and document it for both sibling
                  kinds; or find a signal that is not the commit subject
      tracker:    **TD-141** · TD-125 · TASK-298 · SPRINT-095 T1 (closed at 0 of 6) · L-190
      origin:     close-retro
      state:      ready

- [ ] TASK-332 — Correct TD-125's stated cause and every artifact that repeats it  [size: S] [risk: low] [AFK]
      class:      mechanical-ingest
      done-when:  TD-125, `TASK-298` and SPRINT-095's T1 text no longer name
                  `check-layers-observed.sh:397`'s `*/archive/*` filter as the mechanism. **Measured,
                  not argued:** deleting that line alone changes nothing — 092 is blamed for 85
                  commit:path pairs both with the filter present and deleted. The operative mechanism
                  is upstream — `qa-check.sh`'s layers-observed leg hands the checker a NON-recursive
                  `ls docs/sprint/SPRINT-*.md`, so an archived sprint never reaches `"$@"` to be
                  filtered at all, which makes that filter UNREACHABLE for archived sprints rather
                  than merely ineffective. **Re-derive every line number at the point of use** — this
                  row cited `qa-check.sh:1013` and the real figure was `:1198`, the third stale
                  citation in this family (L-130). Also record on TD-131 that SPRINT-095 T1 added an
                  archived-file `fmv()` call site and SPRINT-096 T3 reverted it, so the row's
                  exposure is unchanged — the frozen wording ("gained a call site") was restated at
                  SPRINT-096's batch G2, because ADR-040 discovers archived sprints from FILENAMES
                  and the call site does not survive the sprint
      touches:    TECH-DEBT.md · TODO.md · docs/sprint/SPRINT-095-guards-that-misreport.md
      depends-on: none — independent of TASK-331's ruling; the cause is wrong either way
      assumes:    none. The correction is measured and recorded in SPRINT-095's Execution Log
      tracker:    TD-125 · TD-131 · SPRINT-095 T1
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

