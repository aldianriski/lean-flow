---
sprint: 090
slug: run-evidence-vehicle
epic: EPIC-015
owner: Maintainer
last_updated: 2026-08-27
status: closed
gates_signed: G1,G2 @ e1e3141
approval_envelope: goal · scope · acceptance · design · verification · j1-delegation · capabilities · repair-policy · budget · stop-conditions @ e1e3141
plan_commit: b7437de
close_commit: cc46d18
update_trigger: sprint execute/close events
---

# SPRINT-090 — Run-Evidence Vehicle

> **Theme:** A Plan that exists to *be executed unattended*, not to deliver features. SPRINT-088 wrote
> three DoD requiring a real headless run into a Plan whose every task was `HITL`, so pre-flight
> forbade the only vehicle that could satisfy them (L-111). This Plan is the vehicle: one honestly
> AFK/J1 task the run may execute, and one honestly J2 task it must park. Seeded per `TASK-301`, whose
> `done-when` requires a *separate* Plan — re-declaring SPRINT-089's real work AFK to make a run fire
> would be reshaping a task to dodge a gate (SPRINT-089 D3).

## Scope

**In:** one AFK/J1 task an unattended run executes inside the recorded envelope with no confirmation ·
one J2 task it parks with an unblock condition · the rollup those two produce. Targets EPIC-015
§ Closed-when **1, 3, 4** by supplying SPRINT-089 T2's evidence.

**Out (deferred):** anything requiring judgement beyond T2's own parking · changes to the autonomy
machinery itself (SPRINT-088 shipped it; this Plan exercises it, and a defect found here is a finding,
not a licence to edit the guard mid-run) · the gate's remaining cost (SPRINT-089 T1 closed what it
could; ~36 forks per engine call stay unclaimed).

## Plan

### T1 — Append a dated gate-timing measurement to the timing log `[size: S · risk: low · class: mechanical-ingest · AFK · J1]`
Layers: `docs/research/logs/qa-gate-timing.md`
Depends-on: none
Cites: TASK-301 · SPRINT-089 T2 · TD-110
Replaced at scope-change 2026-08-26 — **the rationale, the measurement behind it, and the options
rejected are in the Execution Log**, deliberately not restated here (the Plan is capped, the Log is
not; a second copy drifts from the one it copied).

The replacement qualifies on every clause of AFK-safe **plus the one its predecessor failed**:
**additive** (appends; deletes nothing), **reversible** (one `git revert` of a pure append),
**already-approved-in-scope** (the timing log is an append-only series this repo maintains, and a Round
was added to it earlier today), and **gate-neutral** — its absence is not a gate FAIL and its presence
cannot create one, which is the property that makes it runnable unattended at all. Gate-neutrality was
**measured by probe, not argued** (Log, same entry).

**The work is transcription, not analysis** — that is what keeps it `J1`. The run records numbers its
own system-verify already produced; it draws no conclusion, opens no Round, and rules on nothing.

**Acceptance:** a dated measurement block naming the gate's own printed verdict line and elapsed
seconds is appended to this task's declared log and committed by the run itself, with no confirmation
asked at any point.

**DoD:**
- [x] The measurement is appended and **committed by the unattended run** — *Verify: the commit exists, its timestamp falls inside the run window, and the diff against the log is additions-only (`git diff --numstat` shows 0 deletions); a block written by hand afterwards proves nothing (L-007)*
- [x] **No confirmation was requested** for this task — *Verify: headless has no ask channel, so an ask would have BLOCKED rather than proceeded; a completed T1 is itself the evidence, and the run log carries no prompt*
- [x] The block records the gate's **own printed verdict line**, transcribed — *Verify: the appended text contains a literal `QA-CHECK: N pass, M fail` line matching the run's system-verify output, never a paraphrase and never a piped exit status (L-120)*

### T2 — Rule where TD-095's worktree exclusion belongs `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `TECH-DEBT.md` · `scripts/lib/` (whichever checker the ruling names)
Depends-on: none
Cites: TD-095 · TASK-287 · SPRINT-089 Round 8 Finding 3

**This task exists to be PARKED, and it is a real question rather than a decoy.** Round 8 measured the
surviving half of TD-095 at 42.8s (82–94s normalized) but did **not** attribute it to specific legs.
Whether the exclusion belongs in shared path discovery or in each checker is a genuine design ruling
with a real trade-off — one place to forget versus many places to forget — and it is exactly the class
an execute-only charter may not take. `J2` is therefore its honest class, not a label chosen to force a
park (SPRINT-089 D3 forbids the reverse move, and it forbids this one by the same logic).

**Acceptance:** the run **parks** this task, recording its unblock condition, and continues to any
disjoint AFK work rather than halting on it.

**DoD:**
- [x] The run **parks** T2 rather than asking, deciding, or working around it — *Verify: a park line inside the step-4 rollup block naming T2, and no commit touching this task's Layers inside the run window*
- [x] The park records an **unblock condition** — *Verify: the line states what would make T2 actionable (an owner ruling), not merely that it was skipped*
- [x] The rollup's **terminal state matches its per-task lines** — *Verify: `scripts/lib/check-night-run-rollup.sh` plus a read of the state against the lines; a run ending with a park is not `PLAN_EXHAUSTED` (SPRINT-088 shipped exactly that error)*

## Owner-action checklist
- [x] Sign **G1 + G2** and record `gates_signed: G1,G2 @ <sha>` in this file's frontmatter. Absent means NOT signed; the run reads this file and nothing else (L-099).
- [x] Record the `approval_envelope:` covering all ten dimensions, pinned to a sha. Absence is not approval, and a bracketed placeholder counts as absent.

## Decisions (pre-locked)
- **D1** — **T1 and T2 are disjoint.** No shared file, no `depends-on`. T2 parking therefore cannot
  block T1, which is the property the continuation contract needs to demonstrate: a run that parks one
  task and completes another is the difference between `AUTHORITY_BOUNDARY` and a halt nobody declared.
- **D2** — **The J2 is a real question, seeded but not fabricated.** D5's requirement is that a park be
  *seeded* rather than hoped for; it is not a licence to invent a fake task. TD-095's unattributed cost
  is a question this repo actually owes an answer to.
- **D3** — **A defect found during the run is a finding, not a repair.** The charter is execute-only.
  If the run misbehaves, that is SPRINT-089 T2's evidence and is recorded, not patched mid-flight.
- **D4** — **Pre-flight item 3 reads "no task needs a human to be REACHED", not "no task may be J2".**
  *Ruled by the owner 2026-08-26, recorded here because the run reads this file and nothing else
  (L-099 · L-151).* Part 1 item 3 says *"every task in the run is AFK-class"*, while `TASK-301`
  requires a seeded J2 and CONTEXT.md states `J2 ⇒ HITL` — so a declared J2 fails pre-flight by the
  letter, and this Plan could never fire.
  **CORRECTED 2026-08-27 after independent review — this argument was overstated as first written.**
  It claimed the strict reading makes *three* shipped mechanisms unreachable. It makes **one**:
  `check-authority.sh`'s HONOURED assertion, which fires only on a task whose header meta is literally
  `J2`. The other two are reachable with no declared J2 anywhere — `AUTHORITY_BOUNDARY` is defined at
  `night-run.md:148` as "all of it is J2 **or blocked behind a park**", and `:89` parks an ordinary
  **J1** on a critic judgment finding.
  **And the counter-argument, which the original never weighed:** `AFK-safe` (`:46` — additive +
  reversible + already-approved-in-scope) and `J2` (`:58` — approval · judgement · lossy ·
  scope-changing) are defined as **opposites in the same document**, so item 3 read against its own
  vocabulary is internally consistent as the *strict* reading.
  **So D4 is a judgement between two defensible readings, not a forced conclusion.** It is still
  plausibly right — a maximal-strict reading forecloses every unattended run, which cannot be the
  intent, and SPRINT-088 is that precedent — but **it should not be cited as settled precedent in the
  stronger form**, and the owner ruled on the overstated version. `check-authority.sh` does pass this
  Plan with `T2 J2` today, which remains a fact in its favour.
  **Not fixed here, deliberately.** SPRINT-089 § Scope defers re-opening SPRINT-088's machinery, so
  amending `night-run.md` would be a scope-change rather than this task's work. Filed as **TD-109**.
  This is [[L-173]]'s shape exactly — a contract that disagrees with itself, where the looser reading
  wins silently because it needs no extra code — so the reading is *ruled and written down* rather
  than assumed, which is the whole point of that learning.

## Assumptions
- **A1** — `scripts/gen-index.sh` is deterministic, and the index is **stale at pre-flight**, so T1 has
  real work to do and its only variable is whether the *run* executes it. *Confirm: `sh
  scripts/gen-index.sh --check` exits **1**. Confirmed 2026-08-26.*
  **The `--check` form is load-bearing, not a convenience.** The obvious confirm — run the generator
  interactively and see that it works — **consumes the very work T1 exists to perform**: the generator
  is idempotent, so a verified-by-running index is a current index, and the unattended run would then
  regenerate nothing, commit nothing, and satisfy DoD 1 vacuously while looking green. Drafted that way
  first and corrected here, before the criterion froze (L-130: a value entering a frozen artifact is a
  query result, and gets queried at the moment it is written).
  **Staleness is caused, not waited for**: `L-175` was appended to `docs/LEARNINGS.md` interactively,
  which is genuine close-Retro work this session owed anyway (`/insights` is explicitly anytime) and
  which the generator reads. Recorded plainly so the ordering is not mistaken for a contrivance — the
  learning stands on its own, and making T1 satisfiable is its side effect rather than its purpose.

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-090-run-evidence-vehicle.md`, created lazily at
> the first entry. Append there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/research/logs/qa-gate-timing.md` | T1 | Round 9 appended — transcribes this run's own gate verdict line and elapsed, which is the evidence SPRINT-089 T2 needs | low | `git diff --numstat` = 46/0 at `7cc19fb`; literal verdict line grep = 1 |
| `docs/sprint/logs/SPRINT-090-run-evidence-vehicle.md` | coordinator | Execution Log entries + the Part 4 rollup block (never assigned to a task — SKILL.md § sprint-bulk step 2) | low | rollup · authority · review-depth checkers all PASS |
| `docs/sprint/SPRINT-090-run-evidence-vehicle.md` | coordinator | six Plan DoD ticked; the two Owner-action boxes deliberately left for the owner | low | tick census 6 ticked / 2 unticked, reconciled against the rollup header |

## Retro

**A Plan that existed to be executed, and was.** Both tasks resolved as designed: `T1` (AFK/J1) ran
unattended and committed its work with no confirmation asked; `T2` (HITL/J2) **parked**, recording the
owner ruling it needs. Terminal state `AUTHORITY_BOUNDARY`, `1 of 2 units` landed — which is the
correct reading of a run that completes one task and parks another, not a partial failure.

**What this Plan proved, for SPRINT-089 T2 and EPIC-015 § Closed-when 3 · 4**
- A `J1` task executes inside a recorded envelope with **no confirmation** — headless has no ask
  channel, so an ask would have blocked rather than proceeded.
- A **seeded** `J2` parks rather than being asked, decided, or worked around — `check-authority.sh`
  reports `1 park, 0 execution, 0 owner-ruling`, and **0 commits touched T2's Layers** in the window.
- The rollup's terminal state matches its per-task lines, verified by reading them against each other
  and not only by the shape checker — which is precisely how the reaper's contradicting rollup
  (**TD-112**) was caught.

**What it cost to make this Plan runnable at all.** T1 was rewritten once, mid-sprint: its first form
regenerated a deliberately stale index, and `night-run.sh` refuses to fire unless the gate is green —
so the run could not start until the work it existed to do was already done (**TD-110**). The
replacement had to be **gate-neutral**, a property measured by probe rather than argued. Before that,
the Plan's declared `J2` failed pre-flight by the letter (**TD-109**), and `sprint-bulk` step 0 would
have asked which of two active sprints to run, in a channel with no ask.

**The run found what its authors had not.** It parked its close on a red system-verify caused by
midnight index staleness (**TD-111**) — a gate that reddens on an untouched tree as the clock rolls
over. It parked rather than repairing, because `repair-policy` granted nothing. That is the contract
working on a case outside its design.

**D4 is not settled precedent.** Its justification overclaimed two of three mechanisms and was
corrected after independent review; the counter-argument (`AFK-safe` and `J2` defined as opposites in
the same document) supports the *strict* reading. Routed to `TASK-306` for a ruling that can be
inherited.

**Buckets** — this Plan's findings are filed against SPRINT-089, which owns the epic slice: tech debt
**TD-109/110/111/112**, follow-ups **TASK-303–306**, learnings **L-177/178/179**. Shipped content:
`docs/research/logs/qa-gate-timing.md` § Round 9, appended by the run itself.
