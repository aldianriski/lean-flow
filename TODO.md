---
owner: Maintainer
last_updated: 2026-09-20
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

> **SPRINT-103 — Port the Measured Hotspots** → [docs/sprint/SPRINT-103-port-the-measured-hotspots.md](docs/sprint/SPRINT-103-port-the-measured-hotspots.md)
>
> Promoted 2026-09-20. Five tasks, one per item in **Round 16**'s measured top five — 761 s, **63% of
> the gate**. Split from `TASK-355` (`[size: L]`) at promote, per the size-check that runs before
> rendering. Every task is **measure-then-rule**: its first DoD is a per-target measurement, and
> *"ruled unportable, mechanism recorded"* is an accepted outcome (D2). T3 is `J2` — it touches the
> **consumer-facing** conformance engine (ADR-027), so the ruling is human-reserved.
>
> Predecessor: **SPRINT-102 — Make the Gate Green** closed 2026-09-20 at **17 of 18 DoD** + 1 `[~]`.
> It proved the technique and aimed it wrong: five checkers ported, reviewed and wired, their
> harnesses down from ~170 s to **17 s**, and **the gate unmoved** — they were ~10% of it. The targets
> came from `TD-090`'s harness timings; Round 16, the first profile of a *completed* gate, shows none
> of them in the top 20. That is the whole reason this sprint measures first.

**Standing facts the Backlog depends on** — everything else that lived here was a narrative of the
SPRINT-096 promote and is now in [`CHANGELOG.md`](CHANGELOG.md) and the archived sprint file. Pruned
again at the SPRINT-097 promote on owner approval (L-008 — a copied narrative drifts from its source).

- **Debt ledger: 99 rows** (91 open · 8 resolved · 5 `severity: high` open) — re-derived at the
  2026-09-16 `/triage` by row header, cross-checked by distinct id (both routes give 97); **re-derived
  at the SPRINT-102 close to 99** after TD-165 and TD-166 were filed, by the same two routes plus a
  status census. **That census is itself an L-108 sighting worth carrying here:** selecting
  `severity: [a-z]+ | status: (...)` returns **87 open, four short**, because the `severity: **high**`
  rows carry bold markup — the shape a census most needs is the one a lowercase-only class silently
  skips. It was caught only because open + resolved failed to reach the header count. Match the
  severity token with its markup optional, and reconcile the two halves against the total every time.
  figure here (92 / 84) was written at the SPRINT-100 close and did not carry SPRINT-101's
  TD-160/161/162; this pass then filed **TD-163** and **TD-164**. A third row was drafted for the
  promote-time red gate and **withdrawn before filing** — `TD-160` already covers it, with a better
  fix direction; the ledger search that catches this is the point of L-127. **Derive the id maximum with BOTH
  `.claude/worktrees/` AND `evals/` excluded** — the fixture tree reserves a git-tracked 900-block of
  synthetic ids, so a query that excludes only the worktrees (L-170's recorded remedy) still returns
  that **900-block** instead of the real maxima (L-204). **Never spell a synthetic id out here** —
  doing so makes this file a third source of the contamination, which is exactly what happened
  between the first and second derivations of this same session.
  SPRINT-100 filed TD-156/157/158/159 and resolved TD-086/087/089/097/105/146. The aging
  breakdown that used to sit here was SPRINT-099's and is deliberately not carried forward: four rows
  were added and five resolved since, so it no longer describes this ledger. Re-derive open/closed and
  the `severity: high` set
  **by anchoring to the `^- **TD-NNN**` row header** — a bare `grep 'status: open'` over-counts,
  because rows quote their own status strings in prose (L-108). Aging figures are derived at each
  promote, never read from here (L-097 · L-130).
- **The gate DOES verdict on this host** — corrected at the SPRINT-097 close, where it ran to
  completion four times and printed a verdict every time, ending `QA-CHECK: 230 pass, 0 fail`. The
  previous note here ("cannot currently verdict") was written after SPRINT-096's memory kill and was
  stale; it is replaced rather than annotated, because a standing fact that is false is worse than
  absent. **`qa-budget-default` compared the *configured* budget to the ceiling rather than actual
  runtime (TD-128) until SPRINT-099 T2 added the missing reader** — the gate now asserts its ACTUAL
  runtime against the 600s ceiling on every run, and prints a third outcome when it truncates, so a
  truncated run is no longer byte-indistinguishable from an ordinary red gate.
  `QA_BUDGET_SECONDS` stays at 520. **What a close must not do is
  read the FAIL-line count as the verdict:** at the SPRINT-097 close the gate printed `0 fail` over
  **4** `FAIL` lines, all from the conformance engine, which leg 2f-ter keeps deliberately
  informational. **SPRINT-100 T4 removed that particular trap** (TD-146, resolved): a finding this
  gate does not fold into its tally now prints as `INFO`, so the visible tokens and the printed
  verdict no longer disagree with nothing marking the difference. The rule is unchanged and is the
  durable part — the number to act on is the one the gate prints (L-120).
- **Backlog ranking** is `/triage`'s output, not this block's: tiers P0–P3 below are the record.
- **This file knowingly exceeds §2's 320-line soft cap** (~586 at the SPRINT-097 close; **433 at the
  SPRINT-100 close**, after five shipped tasks were pruned) and the gate reports it every run. Ruled
  at that close's `/triage` rather than left as neglect: the overage is
  **task specification, not narrative** — then 18 tasks averaging ~32 lines, almost all of it multi-clause
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

- [ ] TASK-355 — Cut the QA gate's wall-clock cost by moving hot checkers in-process under Bun  [size: L] [risk: med] [HITL]
      class:      execution
      tier:       G
      authority:  J1
      origin:     manual   # owner-raised 2026-09-20; NOT grilled at intake, so no G1 fast-path
      state:      ready
      done-when:  `QA_FULL=1 sh scripts/qa-check.sh` completes in a time the owner will sit through,
                  with **zero** change to what is checked — every assertion still runs and can still
                  FAIL, and `QA-CHECK: N pass, M fail` is byte-unchanged. Each ported checker keeps
                  its `.sh` as a live ORACLE and is accepted only on **byte-identical differential
                  parity** (same exit code, same stdout) across every fixture AND every real sprint
                  Plan including `docs/sprint/archive/`.
      why:        The gate takes **1263–1397 s** and is mandated at promote and close, which is the
                  owner's stated top blocker on development speed. **`[size: L]` — split before
                  promote**; it is filed whole because the sequencing matters and the split points
                  are the rows below.
      plan:       **RE-RANKED against measurement at the SPRINT-102 close — the original ranking,
                  inherited from TD-090's harness timings, targeted the wrong five.** Round 16
                  (`docs/research/logs/qa-gate-timing.md`, raw series beside it) is the first per-leg
                  profile of a COMPLETED gate: 118 samples, all 47 harnesses. Remaining targets, by
                  measured seconds:
                  **1.** `run-sprint-family-fixtures.sh` — **305 s, 25% of the gate** ·
                  **2.** `run-layers-observed-fixtures.sh` — **153 s** (note: a DIFFERENT checker
                  from the `layers-completeness` already ported) ·
                  **3.** leg 2f-ter, the conformance engine sweep — **139 s** ·
                  **4.** `run-conformance-engine-fixtures.sh` — **98 s** ·
                  **5.** `run-qa-budget-position-fixtures.sh` — **66 s**.
                  Top five = **761 s / 63%**; top ten = 77%. **Re-measure each target before
                  committing to it** — three of the five are conformance/sweep work whose shape may
                  not be spawn-dominated at all, and inheriting this table unexamined is the exact
                  mistake this row is correcting.
      done-so-far: **Five checkers ported, reviewed, merged and WIRED** (SPRINT-102 close):
                  `epic-archive` · `night-run-rollup` · `doc-caps` · `authority` ·
                  `layers-completeness`. Each keeps its `.sh` as a live oracle; each was accepted on
                  byte-identical differential parity; all five gate legs invoke Bun and all five
                  oracles stay on disk. **Measured result: those five harnesses now total 17 s
                  (0/1/4/6/6), down from ~170 s** — the technique is proven. **The gate is still
                  ~20 min**, because they were ~10% of it and host variance is ±20%.
      assumes:    ~~UNCONFIRMED — ~1000 s unmeasured~~ **RESOLVED at Round 16.** The distribution is
                  now measured and concentrated. The remaining assumption is narrower and stated as
                  such: *that the top five respond to porting the way the first five did.* **Estimate,
                  not forecast:** 761 s → ~50 s would put the gate near 8 minutes.
                  *Confirm: re-measure each target individually before it is promoted, per the plan.*
      touches:    `evals/run-layers-completeness-fixtures.sh` · `scripts/lib/check-layers-completeness.sh`
                  (retained as oracle) · new `scripts/lib/check-layers-completeness.ts` · later rows
                  add `check-epic-archive` · `check-night-run-rollup` · `evals/lib/harness-common.sh`
      depends-on: none
      tracker:    TD-090 (the cost mechanism: spawn-count-shaped, `sys`-dominated, Windows `fork()`)
                  · L-144 (already-promoted: "when a check is slow the dominant term is the number
                  of PROCESSES" — with hundreds of live counter-examples, L-020's shape) · ADR-039
                  (the differential-parity pattern this reuses) · ADR-033
      scope-note: **Speed only.** Checking fewer files, sampling history, mocking the Git/reaper
                  integration, dropping the live Shell/TS differential, or raising the budget in
                  place of reducing runtime are all OUT — each needs its own owner ruling and none
                  is authorised by this row. A faster gate that checks less is worthless.
      caution:    **2 s is not the cost of a shell launch** (a bare `sh -c true` is 76 ms). A checker
                  costs ~2.75 s because it launches `grep`/`sort`/`tr`/`sed`/`awk` dozens of times
                  INTERNALLY. Batching arguments into the same shell loop therefore preserves most
                  of the cost — only moving the logic in-process removes it. An earlier estimate in
                  this session claimed ~160 s from batching alone and was wrong by ~5x.

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

> **Epic-first**, ruled by the owner at the SPRINT-094 `/triage`: EPIC-015 § Closed-when 1 · 5 · 6
> lead, ahead of the cheaper standalone guards, because the epic cannot close without a real
> unattended run and every sprint that defers it defers the epic.
>
> **Reconciled against the roadmap at the 2026-09-16 `/triage`.** This ruling predates the
> 2026-09-09 Governance Roadmap § 10, which reprioritises delivery around the dashboard pilot and
> *supersedes the prior platform-investment ordering* — `docs/epic/INDEX.md` already records EPIC-016
> as **P0, the critical path**. The two are not in conflict once scoped: **EPIC-016 holds P0 overall
> and runs its member sprints in `workdoo`**, so it does not consume a lean-flow sprint slot;
> epic-first continues to govern **lean-flow's own** sprints, where it now means EPIC-015. Roadmap
> § 10 also states the pilot subset does **not** auto-close EPIC-005–015 — existing § Closed-when
> still governs formal closure — so nothing here is discharged by the pilot shipping.
>
> **Epic-first now means `TASK-349` first.** TD-117's own closing line records that SPRINT-101
> deferred it under this ruling and that it was *"the very task the epic turned out to be blocked
> on."* Deferring the blocker in the epic's name defers the epic.

- [ ] TASK-319 — Prove § Closed-when 1 with a real unattended run against the repaired reaper  [size: M] [risk: high] [HITL]
      → **PARKED again at SPRINT-101 (T1) — but NOT on the same blocker, and that is the news.** The ten-dimension `approval_envelope:` is now **signed, recorded in frontmatter and verifying** (`all 10 dimensions covered, pinned @ 2472fab`), so the `AUTHORITY_BOUNDARY` that parked SPRINT-098 T4 is **cleared**. What stands instead is the **gate**: `night-run.sh` refuses to fire on a red one, and no configuration of this gate is green — bare it truncates with 13 harnesses unrun, raised it completes in 945 s against a 600 s external ceiling (measured, **TD-117**; owned by **`TASK-349`**). Unattempted, not attempted-and-failed. Still paired with `TASK-188` per the SPRINT-097
        `/triage` ruled. **CRITERION CORRECTED at the 2026-09-16 `/triage` — the spec this row
        pointed at misstates the rule it cites.** It read *"the seeded **not-all-J2** vehicle"*;
        pre-flight item 3 (`night-run.md:295`, STRICT per TD-109) actually requires *"**every** task
        in the run is declared `J0` or `J1` — a declared `J2` task **FAILS** this item."* A Plan that
        is merely "not all-J2" can still carry a declared `J2` and is **not launchable**, so the old
        criterion was satisfiable by a vehicle that could never fire. Build the vehicle as **all
        `J0`/`J1`, zero declared `J2`**, and record `gates_signed:` in its frontmatter (item 4 —
        absent from SPRINT-101, the foreclosure that was queued behind the gate). Fixed by
        `TASK-352`, which is a **prerequisite** for this row. Full spec — the seeded vehicle · the `--mode overnight` fire ·
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

- [ ] TASK-350 — Route bootstrap failures through a shared emitter, so one-space `FAIL ` lines stop existing  [size: M] [risk: med] [HITL]
      class:      decision
      authority:  J2
      done-when:  No `FAIL ` line in `scripts/` or `evals/` is emitted at a one-space column, and a
                  selector keyed to the two-space finding column can no longer miss a bootstrap
                  failure. **27 sites across 15 files**, each a failure emitted *before or outside*
                  its file's own `bad()`/`ok()`/`gap()` helper — re-derive both figures at build
                  rather than inheriting them (L-130). The shape of the fix is the decision, not the
                  edit: a shared `fatal()` in `harness-common.sh` that every bootstrap check calls,
                  versus teaching each file's helper to be callable before its own setup completes.
                  A judgment tick on whichever is chosen, and it says so.
      touches:    `evals/lib/harness-common.sh` (×9) · `scripts/lib/conformance-engine.sh` ·
                  `check-approval-envelope` · `check-count-claims` · `check-ephemeral-intake` ·
                  `check-epic-archive` · `check-handoff-state` · `check-layers-completeness` ·
                  `check-layers-observed` · `check-night-run-rollup` · `check-qa-budget-default` (×4) ·
                  `check-research-archive` (×2) · `check-review-depth` · `check-verify-reaches` ·
                  `check-system-verify-block`
      depends-on: none
      assumes:    that every one of the 27 is genuinely a bootstrap failure and none is a finding that
                  merely looks like one. UNCONFIRMED — re-derive per site before rewriting any of them.
      tracker:    TD-157 (severity: medium, open) · L-186 · L-198
      origin:     close-retro   # SPRINT-100: surfaced at T4's close, then confirmed live at T5 where
                                # conformance-engine.sh:54's one-space line left sweep_gate returning
                                # rc=0 silently on a crashed engine
      state:      ready

### P2 — Follow-on

- [ ] TASK-356 — Re-audit the gate's own rationale comments against Round 16, and give the stale ones an expiry  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       P
      authority:  J1
      origin:     manual   # found during SPRINT-103 T1/T2 execution; NOT grilled at intake
      state:      ready
      done-when:  Every comment in `scripts/qa-check.sh` and `scripts/lib/*.ts|sh` that states a
                  COST or a RANKING is either re-derived against Round 16 and corrected, or deleted.
                  Verify: no surviving comment names a figure contradicted by
                  `docs/research/logs/qa-gate-timing.md`'s latest Round — checked by grepping for
                  second-figures (`~Ns`, `N min`, "slowest", "most expensive") and reconciling each
                  hit against the Round, with the count of hits examined stated.
      why:        **Two confirmed instances in one sprint, both found by accident rather than by a
                  check.** (1) `scripts/qa-check.sh:1169` justified `run-sprint-family-fixtures.sh`'s
                  opt-in placement with "~5 min for 23 cases … ~15s each against the SHIPPED spec" —
                  the harness has **68** cases and now uses a reduced spec at 137–184 s. Corrected
                  at SPRINT-103 T1. (2) `scripts/lib/check-layers-completeness.ts`'s header still
                  calls `evals/run-layers-completeness-fixtures.sh` "the slowest harness in the gate
                  (measured ~55-70s)" — Round 16 retired that: it is not in the top 20, and the five
                  ported checkers now total **17 s**. Still uncorrected.
                  These are not cosmetic. A cost comment is what a maintainer reads when deciding
                  whether to promote a harness from opt-in to always-on, or which target to attack
                  next — and **SPRINT-102 lost a day to exactly that failure at the ledger grain**,
                  choosing five targets from TD-090's stale figures. The same rot at the comment
                  grain is one `git blame` away from the same mistake. L-151's shape: a figure
                  recorded where its reader reaches it, left true-at-writing and never re-derived.
      plan:       Enumerate first, then fix — the population is the hard part, not the edits. A
                  figure can be a duration, a rank, a count, or a superlative, and only the last is
                  greppable. Derive the candidate set two ways that disagree by construction (grep
                  for numeric-plus-unit; and read every `# ---` block header in `qa-check.sh`), and
                  state both counts. Then consider whether a cost comment should carry the Round it
                  was derived from, so the next reader can tell staleness from disagreement.

- [ ] TASK-354 — Give the `dod-delta` leg a ruled-exemption declaration, so a historical mis-attribution stops blocking every close  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       G
      authority:  J1
      origin:     close-retro   # SPRINT-102 close; NOT grilled at intake, so no G1 fast-path
      state:      ready
      done-when:  A commit whose cross-task DoD tick has been **ruled** by the owner can be declared
                  in a file the checker reads — `.conformance-exempt`'s ADR-031 shape (a reasoned
                  exemption the tool parses), never a prose note in a sprint log — and
                  `check-dod-delta.ts` reports it as a named, visible exemption rather than either a
                  FAIL or a silent pass. Fixture: a declared commit reports the exemption and a
                  sibling UNDECLARED cross-task tick still FAILs in the same run.
      why:        SPRINT-102's close ran on a true FAIL it could not fix forward — `b89d6f0` ticked
                  one of T2's DoD under a `sprint(102) T4:` subject, and a tick lives in a commit's
                  diff, so no later commit un-ticks it. The leg's only exemptions are structural, so
                  the remedies were a five-commit history rewrite or an owner ruling. **TD-166** is
                  the row; **L-205** is the class: the leg's population is `plan_commit..HEAD` over a
                  NON-recursive `docs/sprint/SPRINT-*.md` glob, and `close` archives the Plan out of
                  that glob — so the finding clears *by closing*, while ADR-021 blocks the close on
                  it. A guard whose findings are cleared only by passing it generates rulings, not
                  fixes.
      touches:    `scripts/lib/check-dod-delta.ts` · `evals/dod-delta.test.ts` ·
                  `evals/fixtures/dod-delta/` · `evals/run-dod-delta-fixtures.sh` (the `min_tests`
                  floor moves with any new case — declared here because SPRINT-102 twice changed it
                  undeclared, L-100)
      depends-on: none
      assumes:    none
      tracker:    TD-166 · L-205 · ADR-031 (the declaration shape to mirror) · ADR-021 (the rule that
                  makes this blocking)

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
      guardrail:  **Surfaced at the 2026-09-16 `/triage` against `.out-of-scope/run-event-log.md`**
                  (structured JSONL run-event stream, rejected 2026-07-30 · ADR-013). Ruled
                  *related but distinct*, so this row proceeds: the rejection's stated defects were
                  "no firing trigger and no first consumer", and this row has both — TD-122/TD-124
                  are the trigger, `check-authority.sh` is the named consumer. **Carry the
                  rejection's guardrail verbatim into the design:** the ledger *"must never quietly
                  become the input to a run-state resume path"* (ADR-013 pre-mortem 1). If the
                  design drifts toward a general event stream, it has re-entered the rejected
                  concept and belongs back in `.out-of-scope/`.

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

### P3 — Long-term

> **Filed at the SPRINT-096 close (2026-09-09) and deliberately UNRANKED.** Close routes
> follow-ups to the Backlog; `/triage` ranks them. They are parked here rather than in P0 so an
> unranked row is never mistaken for a blocking one — `TASK-334` in particular affects every
> close and may well outrank this tier once groomed.

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

