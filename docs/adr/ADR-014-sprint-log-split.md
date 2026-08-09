---
id: ADR-014
tags: [docs, sprint-model]
domain: sprint-model
related: [ADR-012]
status: accepted
---

# ADR-014 — Split the Execution Log out of the capped sprint file

- **Status:** accepted (2026-08-09)
- **Deciders:** Maintainer
- **Context driver:** an unattended run's throughput is bounded by how much work a human pre-promoted, and that Plan was bounded by a cap the Execution Log was eating.

## Context

An unattended run clean-halts when the promoted Plan's AFK work runs out. It cannot promote more work
for itself — promote is HITL end-to-end, because it *forms* the Plan. So a night run is only ever as
big as the Plan frozen for it, and the Plan is bounded by the sprint file's 400-line hard cap
(ADR-012 · DOCS_Guide §9).

The cap was being consumed by the wrong section. **Measured blast radius**, the six sprints before
this decision:

| Sprint | Tasks | Lines / 400 |
|---|---|---|
| 041 | 2 | 257 |
| 042 | 4 | 357 |
| 043 | 2 | 314 |
| 044 | 6 | 353 |
| 045 | 2 | **368** |
| 046 | 2 | 232 |

Task count does not predict file size: SPRINT-045 reached 368 lines on **two** tasks while SPRINT-044
fit **six** into 353. What varies is the Execution Log, which grows with the work actually done — so
the more a run accomplishes, the closer its file gets to breaching. A Plan of 15 tasks was not
writable, not because 15 task blocks don't fit, but because the Log they would generate would not.

The observed consequence is a night run that burns through two units and halts, at a recorded
$5.42–8.27 per unit delivered, leaving the remaining hours unused.

## Decision

The active sprint becomes **two files**: the Plan keeps `docs/sprint/SPRINT-NNN-<slug>.md` and its
400-line hard cap; the Execution Log moves to `docs/sprint/logs/SPRINT-NNN-<slug>.md`, append-only
and uncapped, created lazily at its first entry.

The **`logs/` subdirectory is load-bearing, not cosmetic.** Four separate legs in
`scripts/qa-check.sh` glob `docs/sprint/SPRINT-*.md` — the 400-line cap (`:33`), the `### Tn`
task-schema check (`:267`), layers-completeness (`:405`), and layers-observed (`:436`). That glob is
non-recursive, so a subdirectory is excluded from all four for free, while a same-directory
`SPRINT-NNN-log.md` suffix would match every one of them: the log would be capped at 400
(reintroducing the exact problem this decision removes) and schema-checked as though it were a Plan.

The alternative — adding an exclusion to each of the four legs — was rejected on TD-031's grounds:
that exclusion list has grown by one entry per sprint for four sprints, and TD-031 already names the
pattern as a design smell whose trigger for redesign is a sixth entry. Four more at once would
detonate it.

## Consequences

**Positive:** the cap governs only the frozen Plan, so Plan size is limited by what a human wants to
commit to rather than by how verbose the run's own record will be. An unattended run can be handed
materially more AFK work in one promote. The Log also stops competing with the Retro for space at
close, when the file was historically fullest. **No check's logic or glob changed** — the only edit to
`qa-check.sh` is registering the new fixture harness that guards this decision.

**Negative (trade-offs accepted):** a reader who wants the full story of a sprint now opens two files
instead of one, and the pairing is a convention the archive step must honour rather than something the
filesystem enforces — a Plan archived without its log strands the evidence its Retro cites. Every
sprint from SPRINT-048 carries the new shape while SPRINT-047 and earlier keep the old one, so the
archive is permanently mixed-format. And the split does not by itself prove throughput improves: it
removes the *measured* ceiling, but whether a run then consumes 15 tasks is untested until a real run
does it (TASK-148, currently blocked on backlog depth).

## Alternatives considered

| Option | Why rejected |
|---|---|
| Raise the 400 cap to ~1200 | One-number change, but caps exist for the AI mid-sprint reader; a 1200-line working doc degrades exactly the consumer §9 serves. Treats the symptom — the Log would keep growing into whatever ceiling is set. |
| Same-directory `SPRINT-NNN-log.md` sibling | Matches `docs/sprint/SPRINT-*.md`, so the log gets capped at 400 and schema-checked as a Plan. Fixing that needs three new gate exclusions — see TD-031. |
| Keep one file, trim Log entries harder | Relies on discipline at exactly the moment a run is busiest, and unattended runs cannot exercise judgement about their own verbosity. Also destroys the audit trail the Retro is written from. |
| Night run spans several pre-promoted sprints | Leaves the cap in place and front-loads several HITL governance checklists into one evening. Addresses throughput without addressing why a single sprint is small. Still available later; not mutually exclusive. |
