---
sprint: 154
slug: a2-migrate-arm
owner: Maintainer
last_updated: 2026-11-01
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-154 — Execution Log

> Append-only companion to [`../SPRINT-154-a2-migrate-arm.md`](../SPRINT-154-a2-migrate-arm.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-01 | promote | plan locked, governance signed, one member: arm A2 through a real migrate, its own amendment and log
Promote governance checklist, signed by the owner by popup (one scan for SPRINT-154 and SPRINT-155, promoted together):
- ☑ L-promotion: none due. Census 253 headings = 225 promoted + 27 active + 1 superseded; no active entry at count 2 or more.
- ☑ TD aging: 102 open, 100 aged against sprint 154 (created at 151 or earlier); TD-283 and TD-284 are new (152). Second
  route: 102 matching lines; by severity 59 low + 24 minor + 14 medium + 5 trivial = 102. No `high` row, none resolved.
- ☑ doc-aging, §11: TASK-537..540 pruned (SPRINT-151, closed three sprints ago; no live citation by two queries, a scripted
  whole-word scan and `git grep -w`, with TASK-536 and 541 as positive controls). The other 46 closed files from sprint 151 or
  earlier keep a live citation. No CHANGELOG rotation (no new MINOR), no LEARNINGS collapse due. Commit `9b4fd30a`.
- ☑ doc-aging, §2: no breach (`check-doc-caps`: retained and frozen rows only); the token budget passed at `4a381b64`.
- ☑ epic rollup currency: EPIC-023 current (checker PASS). ☑ epic coverage: 3 open, all covered. ☑ roadmap: none.
  ☑ handoff ledger: none.
Composition by owner popup: TASK-555 alone, stream s1-discovery, beside stream codex-pilot (SPRINT-155). TASK-555 was set
`ready` by triage (`84fd3c1c`), both blockers in `done/`. Size M, no `L`. Origin: decomposer. Epic: EPIC-023 (S1).
Box 1 still reads `init`; the owner's ruling (migrate) is applied by a `scope-change` entry right after this lock.
promote-check: 4 pass, 0 fail.

### 2026-11-01 | scope-change | T1: TASK-555 box 1 sets A2 up through a real `migrate`, not `init`
What changed: owner ruling 2026-11-01 (D1). The A1 snapshots carry 2.x docs, so the upgrade an adopter would really run is
`migrate`; `init` would scaffold beside existing docs. Impact: box 1's verb and its subject change ("a real `migrate` on the
frozen A1 snapshots"); boxes 2 and 3, the trial count and the ruling are unchanged. G2 is re-confirmed with the design, which has
not been signed yet.

### 2026-11-01 | progress | G1 and G2 signed for T1 after a Codex builder check; three owner rulings for Amendment 6
G1: goal, size M, risk high, blast radius (`evals/ab/`, the new A2 log, and outside the repo `D:/Research/ab-pins/` and the A2
snapshot copies), out of scope (S0's log and freeze, the A0/A1 arms, tasks, judges and rules, S3). G2: the runbook's nine steps
(pin, snapshot copies, arm files, a generalised `setup-arm.ts`, the owner's migrate sessions, freeze, Amendment 6, run, analysis).
builder-check · T1 · 3 contradictions · 2 questions · settled: A2 passes the run-validity rule on its own 32 slots before any combined analysis (a loss share must not be diluted by S0's 96); deltaVsA1 already carries the pooled bootstrap interval section 4 needs; intent ruled by owner (below)
Owner rulings by popup: (1) the S1 pin loaded by `--plugin-dir` in an isolated config with no user plugins counts as "the
installed plugin at the pinned S1 revision", as at A1; (2) setup popups the frozen answers files do not cover: migrate's plan is
approved for the profile items only and anything else declined; any other unanswered popup stops the session for an owner ruling,
logged in the A2 log as a setup deviation; (3) the pilot is one slot per arm-repo pair, derived from the schedule (S0 stays 4, A2
becomes 2), a driver change with a selftest fixture. All three are stated in Amendment 6. G2 signed.
