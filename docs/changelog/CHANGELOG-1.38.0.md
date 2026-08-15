---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: a MINOR version rotates out of the root CHANGELOG
status: current
---

# lean-flow — Changelog v1.38.0

> Rotated out of the root `CHANGELOG.md` when **v1.40.0** landed (§11: keep current + previous minor
> inline). Older releases → [`CHANGELOG-1.37.0.md`](CHANGELOG-1.37.0.md).

## v1.38.0 — Where It Fires (2026-08-14)

MINOR — SPRINT-064, **3 of 3 units**, the third member sprint of **EPIC-002 Make Room** (only its T1 is
epic-tracked). Three governance mechanisms that existed and did not reach. In all three the rule was
already written, already correct, and gated on something that could not reach the failure.

**What changed for you**

- **Worktree-dispatched agents no longer write the Execution Log.** `dispatch.md` previously said an
  agent "never touches a file the overlap map marks shared". That map is derived from each task's
  `Layers:`, and **sprint infrastructure is declared by no task** — so it could never be marked, and the
  clause could never fire for it. `coordinator-owned` is now defined as a **class** with its members
  named: the sprint **Plan file** (DoD ticks · § Files Changed) and its **Execution Log** sibling. A
  dispatched agent **returns its Log entry inside its report**; the coordinator appends at merge-back.
  Wired at both decision points — `orchestrator/SKILL.md` step 2 (where the overlap map is built) and
  `dispatch.md` § Worktree dispatch protocol (where the brief is written).
  *Symptom this fixes:* SPRINT-063 dispatched one agent and ended with **two copies of one Execution
  Log**, merged by hand — from a brief that correctly banned editing § Plan and ticking DoD and said
  nothing about the Log.

**Maintainer-facing**

- **A promoted rule became an action.** The "match by shape, not substring" guard (L-108) had been
  correctly placed in `CONTEXT.md` § Gates and *loaded in context* for all eleven of its sightings,
  reaching none. Sorting them by the flow that was running showed **8 of 11 were ad-hoc verification
  queries inside a governance pass** — where § Gates is already loaded, so the file was never the
  defect. Every instance ever caught was caught by **a second number that disagreed**, never by recalling
  the rule. It is now `.claude/CLAUDE.md` § Behavioral Guidelines, phrased as a required cross-check.
- **One §11 collapse pass applied to `docs/LEARNINGS.md` — applied count 0.** 96 entries (64 active, 31
  promoted, 1 superseded); all 31 promoted already carry their pointer. With SPRINT-063's
  `docs/research/` pass, **both §11 legs are now applied**, each returning zero with the evidence rule
  honoured.
- `L-108` → count 6 · `L-113` → count 2 (promotable at the next promote).

**Known gaps, named rather than closed:** `complete` is a reserved run-level event in the Execution Log
and the template does not say so — writing it to mean "this task finished" silently arms the Part 4
rollup assertions (`TD-055`). The new cross-check rule is procedural text and skill prose has no fixture
harness, so it ships with a walkthrough rather than a retained test (`TD-052`, whole category).
