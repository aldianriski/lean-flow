---
epic: 025
slug: half-the-bookkeeping
owner: Maintainer
last_updated: 2026-11-11
status: active
member_sprints: [SPRINT-172]
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-025 — Half the Bookkeeping, Every Real Check Kept

> **Outcome:** a lean-flow sprint of five or more members closes with at most half the baseline's
> non-work commits per member and at most half its first-run close-gate FAILs, under the counting rules
> in D4. Every check with a real-defect history still runs and fails its must-FAIL fixture by name, and
> a workdoo sprint runs on the release.

## Why this, why now

**Measured cost (ADR-053 §4).** Sources: `git log`, run 2026-11-11.
- **Since 2026-10-11:** 1,907 commits. 1,698 carry a `sprint(` prefix; 1,157 of those are coordinator subjects (`sprint(N):`, no task named). File touches under `docs/work` (1,579) and `docs/sprint` (978) outnumber those under `skills/` (339) and `spec/` (27), the part a consumer installs, about 7 to 1.
- **SPRINT-171** (`18148168^..ea460465`, 7 members): 59 commits. 16 are a task's own work (subject `sprint(171) Tn:` or `fix(`). The other 43 are moves, ticks, logs, records and index regenerations.
- **SPRINT-171's first close-gate run:** 12 FAILs, and its final run had one FAIL, waived by owner ruling.
  Most were the wording or format of a record line, but one class was real. The consequence-line FAILs showed that T1 and T3 had no record of their completed reviews and that T5 had never been reviewed. T5's review then found a dropped screen-out rule (SPRINT-171 log). A strict check sometimes catches a real defect, so this epic cuts by evidence, never by impression.
- **The gate's size:** `scripts/qa-check.sh` is 1,676 lines, `scripts/lib/` holds 35 files and `evals/` holds 77 entries.

**Why this is admitted against the freeze.** The freeze in `docs/research/adlc-epic-sequencing.md` opens no "workflow optimisation" epic without one of its five conditions, and this one is admitted on a measured cost.
- Most of its scope is outside the freeze altogether. Deleting or merging machinery, and changing shipped skills, are both unfrozen (ADR-053 §3).
- Machine-written record lines change existing tools, so each task carrying them names the measured cost above in its `## Why`.

**Why it spans sprints.** Each step needs the one before it: the census, then the tools that write record lines, then the cuts and skill edits, then the Jev trial, then a measuring sprint. The measuring sprint is the proof, so it cannot sit inside the sprint it measures.

## Scope

**In:**
- **A census** of every check `qa-check.sh` runs, including every harness inside leg 12 and legs that carry no checkpoint, such as leg 15, plus every record step a shipped skill requires. Each row gives the FAILs it raised in the archived sprint logs, how many of those were real defects, and a ruling: keep, merge or cut.
- **Record lines written by a tool.** Every line a gate check parses (consequence, review, scope-change, ticks and status moves) comes from a tool, never typed by hand. A format slip then can't happen, and the check keeps its strictness.
- **Cuts and merges by the census:** checks, fixtures and skill steps with no real-defect history are deleted or folded together. The shipped `/orchestrator` and `/lean-doc-generator` procedures get shorter to match, which a consumer feels.
- **A Jev advisory trial** on consequence classification. Jev suggests whether a change is low or material and whether it needs a reviewer, and never downgrades a review. It runs by hand and stays maintainer-only.
- **One measuring sprint** of five or more members, then a MINOR release, and a workdoo sprint run on it.

**Out (explicitly not):**
- Restoring the A/B system (removed at `53c91a3e`).
- Jev in the gate or on a consumer's path: no paid dependency for an adopter.
- New checkers or ledger fields.
- Cutting a consumer-guard check (manifest lockstep, the conformance engine) whatever its history.
- Workdoo's ClickUp/Jira work management, which comes next. Workdoo already holds a proposed EPIC-019, "workdoo Works Like a Work-Management Tool".

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-172](../sprint/SPRINT-172-process-cost-census.md) | Census every check and record step | active | filled at close |

## Decisions
- **D1** — Owner rulings, 2026-11-11, by popup. Slim and optimize, without reducing quality: "both, not only slim, but optimize, dont reduce quality". Slim now, before the workdoo work: "Slim now, before workdoo". The scope covers both shipped skills and lean-flow's own checks.
- **D2** — The cut bar: "No real defect caught → cut (Recommended)". A check or step whose census FAILs were all wording, format or bookkeeping is cut. One with a real defect stays, possibly merged. A check whose history can't be read is **unknown**, not zero: it is never cut on the bar alone, only by a recorded owner ruling. Consumer-guard checks always stay.
- **D3** — Jev's role: "Advisory trial in the epic (Recommended)". It covers consequence classification only, after the record lines become tool-written. It is kept only if it saves turns and misses no review on the trial sample. TASK-627 folds into this trial; TASK-629 is cancelled at the next `/triage`, because its roles were no-go in EPIC-024.
- **D4** — Done means: "Half the bookkeeping (Recommended)". The counting rules are frozen here and apply to the baseline and the measuring sprint alike:
  - A **non-work commit** is any commit in `<plan_commit>^..<close_commit>` whose subject matches neither `sprint(N) Tn:` nor `fix(`. It is a proxy for bookkeeping.
  - **Close-gate FAILs** are counted on the **first** `check-sprint-by-reference.ts --close` and system-verify run of the close.
  - SPRINT-171 gives 43 non-work commits over 7 members (6.1 per member) and 12 first-run FAILs, so the targets are at most 3 per member and at most 6 FAILs.
  - If the open question below swaps the baseline, both targets are re-derived as half of the new one.
- **D5** — The A/B system stays removed. Codex review, 2026-11-11: cheap judging does not remove the cost of the arm runs.
- **D6** — Most format FAILs are fixed by a tool writing the line, not by Jev judging it (Codex review, 2026-11-11). The plan's biggest risk is a slimmer process that turns visible, fixable FAILs into confident wrong passes that silently skip review. That risk is why the writer refuses a missing or ambiguous input and never defaults to `low`.

## Open questions
- **Is SPRINT-171 a fair baseline?** Its T6 trial ran long. → The census sprint measures SPRINT-169 and SPRINT-170 under D4's rules. If they differ from SPRINT-171 by more than a third, the baseline becomes the median of the three, by recorded owner ruling, and D4's targets are re-derived.
- **Which Jev question type and sample?** → Fixed in the trial sprint's G2: Noul per question, the 0.7/0.3 thresholds, past sprints' consequence lines as the sample, and the 5 USD cap shared with every Jev spend so far.

## Closed when
- [ ] `docs/research/process-cost-census.md` holds one row per check and per skill-required record step, taken at a pinned revision before any cut.
  Each row has its FAILs, real defects, fixture and ruling, and an unreadable history is recorded as unknown. The population is reconciled by identity, not by count: every PASS/FAIL check name `qa-check.sh` prints at that revision, every harness in leg 12 and every leg without a checkpoint has its row. → TASK-648, TASK-649, TASK-650
- [ ] Every cut has zero real defects in the census, and nothing marked unknown is cut without a recorded owner ruling. Every check with one or more still runs, and its must-FAIL fixture still fails with its named finding. Manifest lockstep and the conformance engine still run. → next slice: cuts and skill edits
- [ ] Every record line a gate check parses is written by a tool. A fixture replays the census's real-defect cases (SPRINT-171 T5 among them) through the writer and then the gate, and the gate still demands the review. Given a missing or ambiguous input, the writer refuses and never writes a default. → next slice: record writers
- [ ] The Jev trial's result and spend are recorded. Jev is either kept as advisory beside `check-review-depth.sh` or dropped, and it is never a gate leg. → next slice: Jev trial
- [ ] A measuring sprint of five or more members meets D4's targets under D4's counting rules, and no census-kept check was skipped. → next slice: measuring sprint
- [ ] Released as a MINOR on a Codex review plus the off-host gate. TASK-489 is retargeted from 2.16.0 to this release. A workdoo run record shows a workdoo sprint promoted and closed with `/prime`'s `Skills:` row naming this release, and workdoo's own gate green. → next slice: release and workdoo run
