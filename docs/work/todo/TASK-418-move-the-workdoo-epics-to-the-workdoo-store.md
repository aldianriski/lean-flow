---
id: TASK-418
title: "Move the workdoo-built epics to workdoo's store, keeping only relation pointers here"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: manual
state: ready
sprint: SPRINT-121
depends-on: []
---

# TASK-418 — Move the workdoo-built epics to workdoo's store, keeping only relation pointers here

## Why

Owner ruling 2026-10-10: epics built in workdoo's sprints live in workdoo's store. lean-flow keeps only the relation, and only where it
needs one. Four epics qualify: EPIC-016 (active), EPIC-019 (active), EPIC-018 and EPIC-020 (proposed). Their records sit here while
their work and member sprints are in workdoo, which is why EPIC-019's member pointer went stale (it says workdoo SPRINT-010 is
active, but SPRINT-010 is closed). EPIC-009 stays here: it is lean-flow's own local projection, not workdoo work. EPIC-010 and
EPIC-013 stay as closed history.

## Done when

- [ ] workdoo holds the four epics under its own `docs/epic/` with **the same ids**, so its existing citations (≈142 across its
      docs and sprint `epic:` stamps) resolve unchanged, plus an INDEX. Relative links inside the moved files resolve in workdoo.
      EPIC-019's member list states only verified linkage (SPRINT-010 closed; SPRINT-011/012 carry no epic stamp, so they are not
      listed unless an explicit mapping is recorded).
- [ ] lean-flow no longer carries the four files. Its epic INDEX, the sequencing register and any live doc that needs the
      relation carry a one-line pointer to the workdoo path; archived sprints and logs stay unedited as history; the
      `scripts/lib/prose-density-baseline.txt` row for EPIC-016 is removed.
- [ ] Both repositories' gates are green after the move: lean-flow `sh conformance.sh .` reports no new finding and its gate passes.
      workdoo's commit-attribution rule is checked **before** committing there, because workdoo's SPRINT-012 is active, and the
      workdoo commit is shaped to satisfy it.

## Touches

- workdoo: `docs/epic/` (new) · lean-flow: `docs/epic/` (4 files removed, INDEX) · `docs/research/adlc-epic-sequencing.md` ·
  `scripts/lib/prose-density-baseline.txt` · live docs that cite the four epics (ADR-041 · ADR-045 · DECISIONS)

## Assumes

- Archived sprint files and logs are history: they keep their old references and are not rewritten.
- `check-epic-archive.sh` names EPIC-016 only in comments. After the move its foreign-member branch has no live subject, so
  deleting that branch is a candidate cleanup but outside this task.

## Tracker

- Owner rulings 2026-10-10 (popup: move workdoo-related epics; next-sprint member) · Codex review round 2 (EPIC-018/020 MOVE,
  EPIC-019 pointer) · ADR-041 (workdoo is its own repository)
