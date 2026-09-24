---
owner: Maintainer
last_updated: 2026-09-23
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

> **No active sprint.** Next: `/lean-doc-generator promote` — EPIC-017's next slice lives in `docs/work/`.
>
> Predecessor: **SPRINT-106 — The Store, and the Way In** closed 2026-09-24: 26 of 27 Plan DoD + 1 n/a by
> ruling; TASK-360 and TASK-370 carried open in `docs/work/todo/`. See `CHANGELOG.md` and the sprint pair.

**Standing facts the Backlog depends on** — narrative that used to live here is in
[`CHANGELOG.md`](CHANGELOG.md) and the sprint archive. Pruned at the SPRINT-097, SPRINT-100 and
SPRINT-104 promotes on owner approval (L-008 — a copied narrative drifts from its source).

- **Debt ledger: 103 rows** (99 open · 4 resolved · 7 `severity: high` open) — re-derived
  2026-09-23 at the SPRINT-104 close, by row header, cross-checked by distinct id (both 103),
  by partition (99 + 4 = 103), and high-open as all-high minus resolved-high (8 − 1). The partition only reconciled once the `status:`/`severity:`
  match was made **markup-tolerant** (`\*{0,2}`) — a lowercase-only pattern returned 94 + 1 = 95
  against 99 rows, which is L-108 firing on the very census that documents it. Eight rows resolved at or before SPRINT-100 were **deleted** at that
  promote under §11's 3-sprint clock; **ids stay monotonic — a deleted row never frees its id.**
  **Figures here are a snapshot, never a source: re-derive at each promote** (L-097 · L-130).
- **Two derivation rules this ledger has repeatedly cost people.** *(a)* **Anchor a census to the
  `^- **TD-NNN**` row header** and match the severity token **with its markup optional** — a bare
  `grep 'status: open'` over-counts (rows quote their own status in prose) and a lowercase-only
  severity class silently skips the `severity: **high**` rows, which is four short and reads as
  clean (L-108). Reconcile the halves against the header count every time. *(b)* **Derive an id
  maximum with `.claude/worktrees/` AND `evals/fixtures/` excluded** — the fixture tree reserves a
  git-tracked 900-block of synthetic ids, so excluding only the worktrees still returns that block
  (L-170 · L-204). **Never spell a synthetic id out here**, or this file becomes the next source of
  the contamination.
- **The gate verdicts on this host** (corrected at the SPRINT-097 close; `QA_BUDGET_SECONDS` 520,
  ceiling 600 s, truncation reported as its own third outcome since SPRINT-099 T2). **The number to
  act on is the one the gate prints**, never the visible `FAIL` line count — findings the gate keeps
  informational print as `INFO` since SPRINT-100 T4, so tokens and tally no longer disagree silently
  (L-120). A run under host memory pressure measures swap, not the gate: SPRINT-103's close deferred
  its own total for exactly this reason (`TASK-357`).
- **Backlog ranking** is `/triage`'s output, not this block's: tiers P0–P3 below are the record.
- **This file knowingly exceeds §2's 320-line soft cap** and the gate reports it every run — ruled,
  not neglected. The overage is **task specification, not narrative**: `done-when:` / `why:` /
  `tracker:` density is what lets a task be promoted without re-litigating it, and L-008's remedy
  (collapse duplicated prose to pointers) has now been applied three times, this block included.
  Closing the gap would mean satellite files (a second place to look, which this repo refuses) or
  rejecting work still wanted. **Revisit when the Backlog drops below ~12 tasks** — it is at 15
  (11 ready · 4 needs-info · 0 blocked; re-derived 2026-09-23 after EPIC-017's 9 entries moved to
  `docs/work/` — 24 − 9, partition reconciled against the 15 row headers). It had
  taken EPIC-017's seven. That growth is the epic's own evidence: filing a breakdown pushed this
  file from 536 to ~680 lines against a 320 soft cap, and the cap has no route that does not run
  through rejecting work still wanted (TD-174).

---
## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Blocking

### P1 — Next Phase Required

> **EPIC-017 (the 2.0 plan) lives in the work-item store, not here** — 26 task files under
> [`docs/work/`](docs/work/) carrying `epic: EPIC-017` (`todo/` = in SPRINT-106 · `backlog/` = the rest).
> Moved 2026-09-23 on owner direction: `TASK-359`…`365` · `369` · `370` left this file; `371`…`387` were
> filed there directly after three Codex review rounds. Map → [`EPIC-017`](docs/epic/EPIC-017-work-items-that-fit.md).

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

- [ ] TASK-357 — Re-measure the gate total after SPRINT-103, then rule ADR-039's deferred `layers-observed` opt-in  [size: S] [risk: low] [HITL]
      class:      decision
      tier:       P
      authority:  J2   # the measurement is J1; the recurring-cost ruling it feeds is owner-reserved
      origin:     close-retro   # SPRINT-103 A3 could not be confirmed at close: the host sat at 3.0%
                                # free memory (428 MB of 14,078 MB), the condition that killed Wave 0,
                                # and a wall-clock figure taken under paging measures swap
      state:      ready
      done-when:  A new Round in `docs/research/logs/qa-gate-timing.md` records the **completed**
                  `QA_FULL=1` gate total post-SPRINT-103, taken on a host with healthy free memory
                  and stated as a range over ≥3 runs (this host shows >3x run-to-run variance —
                  a point estimate is not a measurement here). **Then** the deferred ruling:
                  `layers-observed`'s differential (**189.3 s**) either joins `eval_harnesses_optin`
                  or stays excluded-and-named, decided against the measured total rather than
                  against an estimate. Verify: the Round names the total and the three `optin`
                  harnesses' current cost, and the ruling cites that Round by number.
      why:        Two things are waiting on one number. (1) **SPRINT-103's A3** — "porting all five
                  would put the gate near 8 minutes" was filed as an estimate, not a target, with
                  *"measured at close against the real total, and recorded as a Round whether or not
                  it lands"* as its confirm path; the close could not run it. (2) **ADR-039's split**
                  (SPRINT-103 owner ruling): `authority` (21.2 s) · `doc-caps` (38.8 s) ·
                  `night-run-rollup` (44.0 s) joined the opt-in set, ~104 s, honouring the parity
                  mandate for three of the four ports. `layers-observed` at 189.3 s was left
                  **excluded and named**, its cost written at the site, precisely because deciding a
                  189 s recurring cost against a total nobody has re-measured is the mistake
                  SPRINT-103 existed to stop.
      depends-on: none — but it cannot be run under memory pressure, which is the whole reason it exists
      assumes:    that the sprint's measured savings (T1 median 341.0 → 149.8 s · T2 leg 15
                  21.0 → 3.4 s) survive into the total. UNCONFIRMED — that is the question, and the
                  arithmetic must not be substituted for the run (D2).
      tracker:    ADR-039 · ADR-043 · TD-168 · TD-171 · Round 19/20/21
      carried:    SPRINT-104 T4, parked twice, 0 of 6 DoD. 2026-09-23: `wsl --shutdown` freed 5.35 GB
                  and run 1 completed at **1863 s, `275 pass, 4 fail`** — but under paging (min 311 MB
                  free), so it is an observation, not a range member. Run 2 was reaped for memory at
                  1455 s when Docker restarted WSL. **Unblock: > 3 GB free that STAYS free for ~90 min
                  — WSL/Docker stopped and kept stopped**, not merely freed at the start. The total
                  now measures SPRINT-104's gate too; the Round must say which tree it timed.

<!-- ── EPIC-017 — Work Items That Do Not Outgrow Their File ──────────────────────────────────
     docs/epic/EPIC-017-work-items-that-fit.md. Filed 2026-09-21; promotable since SPRINT-104 closed
     (2026-09-23). Note, and it is the epic's own first piece of evidence: filing this breakdown pushed
     TODO.md from 536 to ~660 lines against a 320 soft cap. The container is the problem. -->

- [ ] TASK-366 — Rebuild the `ask-dont-tell` Stop hook against the real transcript corpus  [size: M] [risk: high] [HITL]
      class:      execution
      tier:       G        # a hook is mandatory for every consumer (no per-hook disable), so a
                           # false positive is imposed, not offered
      authority:  J2
      origin:     close-retro   # withdrawn at SPRINT-105 T1's outside review, re-filed rather than patched
      state:      needs-info    # the pattern set must be DERIVED from the corpus before it can be specified
      done-when:  A `Stop` hook that makes `L-002` fire without imposing noise. **Measured on the
                  real corpus, not asserted**: the first attempt blocked ~35 of 746 real turns with
                  **~22 false positives (≈60%)** and missed ≥9 genuine inline decisions. Required:
                  (a) patterns **derived from the corpus** — drop `would you like` / `let me know` /
                  `option a` (0 real hits), narrow `your call` and `which…would` (16 and 9 hits,
                  almost pure noise: *"per your call"*, *"…which would confirm green"*); keep and
                  extend `want me to` (10 hits, the only reliable one). (b) **Bilingual** — the
                  maintainer writes mixed ID/EN and `Mau saya …?` *is* `want me to …?`; English-only
                  patterns miss the majority of the real cases. (c) Anchor to the **final sentence**,
                  not the last three *lines* — the same words reflowed to one paragraph flipped a
                  must-NOT-catch fixture to BLOCKED. (d) Strip fenced code, `>` blockquotes and
                  headings before matching. (e) `main()` wrapped in try/catch → allow, and entries
                  null-guarded: three inputs currently exit 1 with a stack trace, against ADR-044's
                  fail-open constraint. (f) **Fixtures drawn verbatim from real transcripts**,
                  including the seven recorded false positives, plus a selection-varying case
                  (Indonesian tail · single-paragraph tail · fenced-code tail).
      touches:    hooks/ (re-created) · evals/ · scripts/qa-check.sh · README.md · ADR-044
      depends-on: none
      assumes:    that a measured false-positive rate low enough to impose on every consumer is
                  reachable at all. UNCONFIRMED — if it is not, the honest outcome is `.out-of-scope/`
                  and L-002 stays a written rule. ADR-044's bar is "a consumer would not want to
                  switch this off", and they cannot switch it off selectively.
      tracker:    ADR-044 · ADR-011 (option B) · L-002 · L-186 · SPRINT-105 T1 review


- [ ] TASK-367 — Let the caller declare detachment, so the pre-flight gate can run complete  [size: M] [risk: high] [HITL]
      class:      decision
      tier:       G        # it decides whether an unattended run fires; a wrong verdict here
                           # launches or blocks a whole night's work
      authority:  J2
      origin:     close-retro   # SPRINT-105 T3's raise was reverted as a regression; this is the real fix
      state:      needs-info    # the detachment signal's shape is the open question
      done-when:  `night-run.sh` can run the pre-flight gate to COMPLETION without exceeding the
                  foreground command ceiling, and does so only when the caller has **declared**
                  detachment rather than a script assuming it. The reverted attempt raised
                  `QA_BUDGET_SECONDS` unconditionally: the gate call at `:589` is synchronous (the
                  only `nohup` is 144 lines below), so an unbounded gate took the launcher to ~955s
                  in one foreground call against a 600s ceiling — killed mid-pre-flight with no
                  verdict, strictly worse than the bounded refusal it replaced.
                  Required: (a) an explicit signal — a `--detached` flag or an env var the caller
                  sets — never inferred; (b) raise `QA_CEILING_SECONDS` alongside the budget, since
                  that is the variable ADR-042 actually licensed a detached caller to raise and
                  night-run.sh has **zero** hits for it; (c) a bound on the un-raised path so a
                  slow host gets a **named refusal** rather than a kill; (d) retained fixtures incl.
                  a must-NOT-raise sibling and a selection-varying case (a repo with no
                  `scripts/qa-check.sh`, the other arm of the `[ -f ... ]` test, which no fixture
                  currently reaches).
      touches:    scripts/night-run.sh · scripts/qa-check.sh · evals/run-night-run-gate-exception-fixtures.sh · ADR-042
      depends-on: none
      assumes:    that a complete pre-flight is worth its wall-clock at all. UNCONFIRMED — the
                  alternative is that the launcher should keep refusing on a bounded gate and the
                  completeness problem belongs to the gate's cost, not to the launcher. Rule that
                  before building; `TD-090` and `TASK-357` (carried from SPRINT-104 T4) own the cost side.
      tracker:    ADR-042 · TD-084 · TD-175 · SPRINT-105 T3 review (F1 · F2 · F9)

### P2 — Follow-on

- [ ] TASK-368 — Run the sprint file's own per-file checkers at promote, before `plan locked`  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       X        # run plumbing, not a guard: it calls existing checkers earlier
      authority:  J1
      origin:     close-retro   # SPRINT-104: its own Plan failed layers-completeness from plan_commit
                                # to close (six findings, re-run against the promote-time file) and it
                                # was first written down at close
      state:      ready
      done-when:  Before `promote` commits `plan locked`, lean-flow runs layers-completeness and
                  prose-density over the **new sprint file alone** and a FAIL blocks the commit.
                  Verify: a sprint file with a bare-name prose token and a >400-char line is refused
                  at promote with both named findings; a clean one passes.
      why:        Both checks take under a second on one file, but their only runner is the full gate,
                  which this host has repeatedly failed to finish (SPRINT-103 and -104 closes). A finding in
                  the Plan is cheapest at the moment the Plan is written, and costs a logged Plan
                  amendment every time after it.
      touches:    this repo's promote procedure only — `scripts/…` paths must NOT leak into the generic
                  `lean-doc-generator` skill (L-015); a consumer hook point, if any, is a separate ruling
      depends-on: none
      tracker:    TD-178 · TD-177 · L-212 · L-166

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

