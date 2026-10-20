---
sprint: 133
slug: name-the-failing-edit
epic: EPIC-007
owner: Maintainer
last_updated: 2026-10-20
status: closed
plan_commit: 594bf15e
close_commit: e01e549
update_trigger: sprint execute/close events
---

# SPRINT-133 — Name the Failing Edit

> **Theme:** a close-Retro follow-up to SPRINT-132. The no-plugin exercise recorded an *already covered* note that named a class
> of edits ("something other than `Math.floor`"), and some edits in that class still pass the test. The note should name one
> concrete edit that fails it, so a reader can check the claim. The rule lives in `/tdd` and in the pack, so both get the change.

## Scope

**In:** the already-covered rule in `skills/tdd/SKILL.md` and `packs/software-implementation.md`, worded alike (`466`).
**Out (deferred):** a new no-plugin exercise run (the task's assumption: the wording is reviewed once) · packs 2–3 and EPIC-007's
gate-condition ruling (next slices) · any mechanical check of note wording (ADR-053).

## Members

- docs/work/todo/TASK-466-already-covered-notes-name-a-concrete-change.md

## Plan

### T1 — Make an already-covered note name one concrete failing edit `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/tdd/SKILL.md` · `packs/software-implementation.md`
  · `docs/work/todo/TASK-466-already-covered-notes-name-a-concrete-change.md`
  · `docs/work/in_progress/TASK-466-already-covered-notes-name-a-concrete-change.md`
  · `docs/work/done/TASK-466-already-covered-notes-name-a-concrete-change.md`
Depends-on: none
Cites: `TASK-466` · EPIC-007 condition 3 · ADR-055 · `docs/research/logs/workflow-pack-exercises.md` · `done/` (a log-heading
  fragment, TD-263)

A wording change in two files that must stay alike. The pack must still name no lean-flow skill, path or id outside its header.

**Acceptance:** both files require an already-covered note to name one concrete edit (an expression or value) that would fail
the test, in matching words.

## Decisions (pre-locked)

- **D1** — `skills/tdd/SKILL.md` and the pack are edited in one commit, so the two never disagree at any commit.

## Assumptions

- **A1** — no new exercise run is needed; one review of the wording is enough. *Confirm: G2 (owner).*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-133-name-the-failing-edit.md`](logs/SPRINT-133-name-the-failing-edit.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/tdd/SKILL.md` | T1 | step 3: an already-covered note names one concrete edit, checked against the test's inputs | Low | phrase count, review |
| `packs/software-implementation.md` | T1 | the same phrase at step 3 and in the output contract | Low | phrase count, body scan, review |

## Retro

**Retrieval check** — yes, once, and it was caught. A phrase count read 0 because of CRLF line endings. It was re-run rather than
trusted, and a second route agreed (L-130's family; SPRINT-124 hit the same Git Bash trap). Nothing was missed.

**Cost** — inline coordinator plus three dispatched `sonnet` agents (builder check about 60k tokens, scoped review about 54k) and
one QA_FULL run on the VPS. One member delivered: one S task, two DoD.

**Worked**
- The G2 builder check earned its cost even on an S wording task. It showed that a concrete edit can still pass (`Math.round`
  gives 1 for 3600), and that became the owner's "checked against the test's inputs" ruling.
- One shared phrase made "worded alike" checkable by a count instead of by eye.

**Friction**
- §11's live-citation rule counts only `.md` files. TASK-438 is cited from code and was retained against the letter of the rule
  (TD-262).
- The TECH-DEBT aging-sweep note was missing again, from the SPRINT-132 promote (L-242, count 3).
- System verify failed 292/1 on `layers observed`. A coordinator done-move was committed under a task's `T1:` subject (L-238,
  now count 2). This is the third close in a row to fail on bookkeeping rather than content (131 · 132 · 133). Fixed by a
  Layers scope-change and a rerun. That scope-change's own heading then tripped `scope-change layers`: it read a backticked
  prose fragment as a path. Fixed by a Cites edit and a second rerun (TD-263). Two QA_FULL reruns for one done-move.

**Pattern candidate**
- L-242: a step that lives only in custom keeps getting skipped. It is due at the next promote (count 3).
- L-238: a coordinator's commit subject is the attribution record. It is due at the next promote (count 2).
