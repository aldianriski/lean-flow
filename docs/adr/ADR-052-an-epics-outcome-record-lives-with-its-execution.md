---
id: ADR-052
tags: [process, docs]
domain: governance
status: accepted
related: [ADR-041, ADR-045]
---

<!-- One ADR per file · append-only (never edit a decided ADR — mark it deprecated/superseded) · WHY only. -->

# ADR-052 — An epic's outcome record lives with its execution

- **Status:** accepted (2026-10-10, owner)
- **Deciders:** Maintainer
- **Context driver:** four epics built in `workdoo` were filed in lean-flow, and their records drifted and went untriaged here

## Context

ADR-041 (2026-09-09) split the governance of the dashboard pilot by kind of record: lean-flow owned the **outcome record** (EPIC-016,
its Closed-when, its admission) and `workdoo` owned the **execution record** (its tasks, sprints and ADRs). Three more workdoo-built
epics (EPIC-018, EPIC-019, EPIC-020) followed the same placement. ADR-041 named the cost itself: "a cross-repo pointer rots more
quietly than a relative link", and the epic-rollup currency check "reads *this* repository only".

That cost has now been paid, measurably. On 2026-10-10 a full scan found EPIC-019's member pointer still reading workdoo
SPRINT-010 as `active` when it had closed (`5770c6d`), with nothing in either repository flagging it. In lean-flow, `/triage` reads
only lean-flow's backlog, so the four epics' 21 open conditions were invisible to grooming in the repository that held them, while
workdoo's 23-task backlog, the work that could cover them, was in another repository. The owner ruled the move (2026-10-10). Before
the option was offered, ADR-041 was read and named as the decision being reversed (L-220).

Measured blast radius: four epic files (336 lines). workdoo cites them by bare id in 88 lines, with 0 links to the epic files (its README links only the lean-flow repo root), and has
no `docs/epic/` and no id of its own in that range, so it has no collision to resolve. In lean-flow, the live references are the epic
INDEX, the sequencing register, `prose-density-baseline.txt`, ADR-041, ADR-045 and DECISIONS; archived sprints and logs are history.

## Decision

**An epic's outcome record lives in the repository that executes it.** EPIC-016, EPIC-018, EPIC-019 and EPIC-020 move to
`workdoo`'s `docs/epic/` **with their ids unchanged**. lean-flow keeps only a one-line **relation pointer** to each, in its own
`docs/epic/INDEX.md` and where a live doc needs the relation, and never restates their Closed-when.

ADR-041's other rulings stand: workdoo is its own repository, consumes lean-flow as a pinned plugin, and keeps its own
`TASK`/`SPRINT`/`ADR` id-space. Only its "lean-flow owns the outcome record" clause is amended (ADR-041 carries a
`Scope amended by:` marker; its § Decision is untouched). Why this over keeping ADR-041's split: the record and its covering work
then sit in one tracker, so triage, rollup currency and the active-epic coverage rule (TASK-420) each read one repository and can
see everything they judge. Duplication stays forbidden, because the record moves rather than being copied.

## Consequences

**Positive:**
- Rollup currency and coverage are checkable where the work happens: a workdoo sprint that closes without a rollup row is in the
  same repository as the epic it should update.
- lean-flow's epic register returns to lean-flow's own outcomes, and its triage no longer carries four epics it cannot act on.

**Negative (trade-offs accepted):**
- **Epic ids now live in two repositories.** EPIC-016 to 020 are workdoo's while lean-flow continues its own sequence, so the next
  lean-flow epic id must be derived across both repositories, or a duplicate EPIC id appears that nothing rejects (L-143 shape).
- **The cross-repo roadmap view is split.** The sequencing register here keeps lean-flow's lanes; the workdoo chain
  (016 → 019 → 020 → 018) is read in workdoo's INDEX. Anyone planning across both repositories reads two files.
- A workdoo session must now uphold the epic standard (Closed-when, rollups, coverage) without lean-flow's own gate behind it,
  because workdoo runs no conformance check today.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Keep ADR-041's split, fix only the stale pointer | Treats the symptom. ADR-041 already predicted the rot, and nothing in lean-flow can see a workdoo sprint close. |
| Copy the epics to workdoo and keep the originals here | Two SSOTs for the same outcome, which LAW 4 and ADR-041's own "never the same fact twice" both forbid. |
| Move them with new workdoo-local ids | 88 existing citations would break, and the sprint `epic:` stamps would need rewriting, for no gain. |
