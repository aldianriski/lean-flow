---
sprint: 132
slug: expertise-without-the-plugin
epic: EPIC-007
owner: Maintainer
last_updated: 2026-10-20
status: closed
plan_commit: 1edfdb8b
gates_signed: G1,G2 @ c730cddf
close_commit: 8eb2871
update_trigger: sprint execute/close events
---

# SPRINT-132 — Expertise Without the Plugin

> **Theme:** EPIC-007's first slice. It writes the contract a workflow pack must meet and proves the contract is not
> software-shaped. Then it extracts the first pack from a procedure this repo really runs (`/tdd`), and has an agent with
> no lean-flow installed follow it. Contract first, because every later pack is judged against it.

## Scope

**In:** the eight-field pack contract with a reader checklist and its domain-neutral proof (`463`) · the software-implementation pack from
`/tdd` (`464`) · the no-plugin exercise (`465`).
**Out (deferred):** packs 2–3 (next slice) · ruling EPIC-007's gate condition 5 (next slice) · any mechanical pack checker
(ADR-053; owner ruling D6) · a runtime other than a fresh Claude agent (owner ruling D7).

## Members

- docs/work/todo/TASK-463-write-the-domain-neutral-pack-contract.md
- docs/work/todo/TASK-464-extract-the-software-implementation-pack-from-tdd.md
- docs/work/todo/TASK-465-exercise-the-first-pack-with-no-plugin.md

## Plan

### T1 — Write the domain-neutral pack contract `[size: M · risk: med · class: decision · HITL · J1]`
Layers: `packs/` · `skills/tdd/` · `docs/adr/` · `docs/DECISIONS.md`
  · `docs/work/todo/TASK-463-write-the-domain-neutral-pack-contract.md`
  · `docs/work/in_progress/TASK-463-write-the-domain-neutral-pack-contract.md`
Depends-on: none
Cites: `TASK-463` · EPIC-007 D1 · D5 · D6 · `docs/strategy/adlc/03-ADLC-ROADMAP.md` § Phase E · ADR-053 · ADR-030 · ADR-031

The contract's placement and its layer (A or E) are ruled at this task's G2. The Layers name the candidate trees, so whichever
one is ruled is already declared. The domain-neutral proof is a non-software skeleton validated by a fresh reader.

**Acceptance:** a contract a fresh reader can check a declaration against, with a non-software skeleton passing it.

### T2 — Extract the software-implementation pack from `/tdd` `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `packs/` · `skills/tdd/` · `README.md`
  · `docs/work/todo/TASK-464-extract-the-software-implementation-pack-from-tdd.md`
  · `docs/work/in_progress/TASK-464-extract-the-software-implementation-pack-from-tdd.md`
Depends-on: T1
Cites: `TASK-464` · EPIC-007 D1 · D2 · `skills/tdd/SKILL.md` · ADR-010 · `CHANGELOG.md` (coordinator-owned)

The pack is extracted from the maintained skill and does not fork it. It routes by role, never by model.

**Acceptance:** a software-implementation pack that passes T1's checklist and names no model.

### T3 — Exercise the pack with no plugin present `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/logs/workflow-pack-exercises.md`
  · `docs/work/todo/TASK-465-exercise-the-first-pack-with-no-plugin.md`
  · `docs/work/in_progress/TASK-465-exercise-the-first-pack-with-no-plugin.md`
Depends-on: T2
Cites: `TASK-465` · EPIC-007 D7 · `evals/run-foreign-repo-fixtures.sh` · L-016

A recorded run, not a retained guard: no new checker or gate leg (ADR-053).

**Acceptance:** a fresh agent in a repo without lean-flow reaches the pack's output contract, with no lean-flow file copied in.

## Decisions (pre-locked)

- **D1** — Shared files: `packs/` and `skills/tdd/` are in both T1's and T2's Layers. They are owned in chain order,
  T1 → T2 → T3 (each depends on the one before), so the tasks run sequentially. CHANGELOG, this file, its log, the member files
  and EPIC-007's files are coordinator-owned.
- **D2** — Owner rulings at intake (2026-10-19): the slice is the contract plus 1 pack · "checkable" means a reader checklist,
  with no checker (EPIC-007 D6) · "reusable without the plugin" means readable alone by any agent (D7) · the first pack is
  software-implementation, from `/tdd` (2026-10-20, replacing `/diagnose`, which D1 disqualified: Execution Log scope-change).
- **D3** — Review: T1 and T2 change consumer-facing surface, so each gets a scoped Codex review plus the adversarial floor,
  logged as `review · Tn` lines. T3's record is reviewed once by Codex. Codex runs from an empty working directory with "do not
  run any command" (L-239).

## Assumptions

- **A1** — Placement is a G2 ruling: an ADR if it adds a §2 row or a new tree (ADR-030 · ADR-031 are the precedents).
  *Confirm: T1's G2.*
- **A2** — `security-review` has no lean-flow procedure (it is Claude's built-in), so D1 leaves three eligible families; "3–5
  packs" still holds. *Confirm: the next slice's intake.*
- **A3** — The installed plugin is 2.10.0 and the repo is 2.11.0. The G2 builder check is run from the repo's own
  `skills/orchestrator/references/builder-check.md`. *Confirm: the `Skills:` row at the next `/prime`, after reinstalling.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-132-expertise-without-the-plugin.md`](logs/SPRINT-132-expertise-without-the-plugin.md),
> created at promote. Append there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `packs/CONTRACT.md` · `packs/examples/non-software-skeleton.md` · `docs/adr/ADR-055-*` · `docs/DECISIONS.md` | T1 | the eight-field pack contract (a reader checklist; routing by role) and its domain-neutral proof; the placement ruled at G2 | Med | domain and id greps (seed-proven); a strict fresh reader ALL TICKED; Codex CLEAR after one retry |
| `packs/software-implementation.md` · `README.md` · `skills/tdd/SKILL.md` | T2 | the first pack, extracted from `/tdd` and readable alone; README names `packs/`; the already-covered rule in `/tdd` and the pack (scope-change) | Med | model and id greps; a strict reader ALL TICKED; Codex CLEAR (two reviews, one retry each) |
| `docs/research/logs/workflow-pack-exercises.md` | T3 | the no-plugin exercise record: runs 1–3 | Low | init lists; file count and content hashes before and after (control: a seeded copy is caught); `npm test` 5/5 |
| `docs/research/logs/reference-rejudge-experiments.md` · `docs/research/reference-rejudge.md` | promote | the §2 soft cap: experiment records moved verbatim | Low | diff-proven verbatim |
| `CHANGELOG.md` · `docs/changelog/CHANGELOG-2.10.0.md` · the four `*-plugin/*.json` · `docs/architecture/overview.md` · EPIC-007 files · `docs/LEARNINGS.md` · `docs/knowledge-index.md` · `docs/work/backlog/TASK-466-*` | close | release 2.12.0; v2.10.x rotated; the `packs/` line; the epic rollup; L-240 · L-241; follow-up TASK-466 | Low | system verify 304/0 |

## Retro

**Retrieval check: one hit, one miss.**
- **Hit:** L-238 (commit-subject attribution) held. Every coordinator write to a shared file went under `sprint(132):`, and
  attribution never failed.
- **Miss:** L-240's class, the coordinator's own bookkeeping failing system verify, recurred for a second sprint running. This
  time it was a candidate Layers token nobody pruned after G2 ruled.
- **Precaution that worked:** L-239's empty working directory kept every Codex review static. All runs used 0 commands.

**Cost.**
- G2 builder check: 3 readers, about 185k tokens.
- T1: inline, plus 3 fresh-reader passes (about 170k).
- T2: one Sonnet builder (about 75k) and 2 reader passes (about 120k).
- T3: three headless `claude -p` runs on Sonnet, about $0.33 in all.
- Codex reviewer wrapper: 10 runs.
- Two QA_FULL runs on the VPS (114 s each).

**Worked**
- The builder check paid again: 15 contradictions and 18 questions settled before sign-off. The probe it prompted, a headless
  run with no plugin, is what made T3 possible at all.
- Checking D1 against the transcripts, not memory, overturned the first-pack pick. `/diagnose` had 0 recorded runs; `/tdd` had 10.
- The no-plugin exercise found a real gap in both the pack and its source skill (a test that passes on its first run). It was
  fixed in both and proven by a re-run.

**Friction**
- T3's first run was lost to a harness fault: a scratch repository under `~/.claude/` is "sensitive" (L-241).
- Codex reviews of records keep asking for evidence a record cites but does not quote. Quoting it up front would save a round.

**Pattern candidates**
- L-240 (new): prune losing candidate Layers tokens when G2 rules. L-241 (new): test "without the plugin" with a separate
  headless process, proven from its init event.

**Owner actions**
- Push `main` (release 2.12.0 is committed, not pushed). Reinstall the plugin so G2's builder check runs from the installed skill.
- TASK-466 (a concrete change in each already-covered note) is in the backlog, `state: ready`.
