---
sprint: 144
slug: wire-the-milestone-cut-the-cost
owner: Maintainer
last_updated: 2026-10-26
status: closed
gates_signed: G1,G2 @ f93bcdef
plan_commit: 79ff7e89
close_commit: 121d8ce0
update_trigger: sprint execute/close events
---

# SPRINT-144 — Wire the Milestone, Cut the Cost

> **Theme:** 2.17.0 shipped a First-milestone proof goal that nothing reads yet, and SPRINT-143's largest cost was a
> humanizer child per commit message that changed none of fifteen. This sprint gives the proof goal its reader, moves
> commit messages to the inline humanizer path, and lands the three small template deltas left from the Codex research.

## Scope

**In:** commit messages humanized inline with the catalogs read once per session (T1) · the decomposer builds the
riskiest ready slice first, reading the proof goal (T2) · an optional Revisit-when line in the ADR template (T3) · step
owners in the flows template (T4) · data scope in the authentication role table (T5).
**Out (deferred):** TASK-523 and TASK-507 (`needs-info`) · TASK-367, 402, 489, 498 (blocked) · TD-276 and TD-277
(filed, not scheduled) · PR bodies and documents (they keep the child humanizer pass).

## Members

- docs/work/todo/TASK-524-humanize-commit-messages-inline-once-per-session.md
- docs/work/todo/TASK-520-build-the-riskiest-ready-slice-first.md
- docs/work/todo/TASK-515-add-an-optional-revisit-when-line-to-the-adr-template.md
- docs/work/todo/TASK-517-record-the-owner-and-next-owner-of-each-step-in-the-flows-template.md
- docs/work/todo/TASK-518-add-data-scope-to-the-authentication-role-table.md

## Plan

### T1 — Humanize commit messages inline, catalogs once per session `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/humanizer/references/embedded.md` · `CHANGELOG.md` · `TECH-DEBT.md`
  · `skills/humanizer/SKILL.md` · `evals/fixtures/humanizer/fact-keep/NOTES.md`
  · `docs/work/todo/TASK-524-humanize-commit-messages-inline-once-per-session.md`
  · `docs/work/in_progress/TASK-524-humanize-commit-messages-inline-once-per-session.md`
  · `docs/work/review/TASK-524-humanize-commit-messages-inline-once-per-session.md`
  · `docs/work/done/TASK-524-humanize-commit-messages-inline-once-per-session.md`
Depends-on: none
Cites: `TASK-524` · TD-278 · L-252 · `evals/fixtures/humanizer/fact-keep/`

Fifteen child passes in SPRINT-143 cost ~73k tokens each and changed nothing. Owner ruling at intake: commit messages use
the existing inline path; PR bodies and documents keep the child. First in the sprint so every later commit uses it.

**Acceptance:** commit messages after T1 spawn no humanizer child, and the retained fact-keep sample keeps every fact
over three inline runs.

### T2 — Build the riskiest ready slice first, reading the proof goal `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/task-decomposer/SKILL.md` · `skills/lean-doc-generator/templates/product-requirements.md.template`
  · `CHANGELOG.md`
  · `docs/work/todo/TASK-520-build-the-riskiest-ready-slice-first.md`
  · `docs/work/in_progress/TASK-520-build-the-riskiest-ready-slice-first.md`
  · `docs/work/done/TASK-520-build-the-riskiest-ready-slice-first.md`
Depends-on: T1
Cites: `TASK-520` · `TASK-516` · `docs/research/codex-run-project-pipeline.md` (9)

The proof goal shipped in 2.17.0 has no reader. This task is it, and it re-adds the template sentence that SPRINT-143
removed because it claimed a reader ahead of the code. Depends on T1 for `CHANGELOG.md` order only (D1).

**Acceptance:** one real decomposition lists the slice that removes the most uncertainty first, citing the proof goal.

### T3 — Add an optional Revisit-when line to the ADR template `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/templates/ADR.md.template` · `skills/lean-doc-generator/references/ADR-example.md`
  · `CHANGELOG.md`
  · `docs/work/todo/TASK-515-add-an-optional-revisit-when-line-to-the-adr-template.md`
  · `docs/work/in_progress/TASK-515-add-an-optional-revisit-when-line-to-the-adr-template.md`
  · `docs/work/done/TASK-515-add-an-optional-revisit-when-line-to-the-adr-template.md`
Depends-on: T2
Cites: `TASK-515` · STANDARD §4 · `scripts/lib/conformance-engine.sh` (S4 checks)

A decision should name what would reopen it. An optional header line only; making it required would change §4 and the
engine. Depends on T2 for `CHANGELOG.md` order only (D1).

**Acceptance:** the example ADR fills the line and the engine's S4 checks still pass on it.

### T4 — Record step owners in the flows template `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/templates/flows.md.template` · `CHANGELOG.md`
  · `docs/work/todo/TASK-517-record-the-owner-and-next-owner-of-each-step-in-the-flows-template.md`
  · `docs/work/in_progress/TASK-517-record-the-owner-and-next-owner-of-each-step-in-the-flows-template.md`
  · `docs/work/review/TASK-517-record-the-owner-and-next-owner-of-each-step-in-the-flows-template.md`
  · `docs/work/done/TASK-517-record-the-owner-and-next-owner-of-each-step-in-the-flows-template.md`
Depends-on: T3
Cites: `TASK-517` · `docs/research/codex-run-project-pipeline.md` (6)

Business flows break at handovers; each step names the record it changes, its owner and the next owner. Depends on T3 for
`CHANGELOG.md` order only (D1).

**Acceptance:** the template's steps carry record changed, owner and next owner, within its line cap.

### T5 — Add data scope to the authentication role table `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/templates/architecture-authentication.md.template` · `CHANGELOG.md`
  · `docs/work/todo/TASK-518-add-data-scope-to-the-authentication-role-table.md`
  · `docs/work/in_progress/TASK-518-add-data-scope-to-the-authentication-role-table.md`
  · `docs/work/done/TASK-518-add-data-scope-to-the-authentication-role-table.md`
Depends-on: T4
Cites: `TASK-518` · `docs/research/codex-run-project-pipeline.md` (7)

Permission bugs live in which data a role reaches; hiding a control is not enforcement. Depends on T4 for `CHANGELOG.md`
order only (D1).

**Acceptance:** the role table gains a data-scope column and the enforcement line.

## Owner-action checklist

- [ ] T2: name one real decomposition to exercise on (or approve a scratch intent).
- [ ] Close: push the release.

## Decisions (pre-locked)

- **D1** — `CHANGELOG.md` is shared by all five: each adds its `## [Unreleased]` line in T order, so execution is
  sequential in the main tree (T1 → T5). Status moves, log and sprint-file edits commit as bare `sprint(144):` (L-238).
- **D2** — Every task changes a shipped file, so each takes the Codex review → fix → re-review loop; cap 2 rounds, a
  third only by owner ruling. One `consequence · Tn ·` line per task in the log.
- **D3** — Before ticking, run every check that reads the touched file: `evals/` harnesses and gate legs alike, each as
  itself (L-251, promoted at this promote).

## Assumptions

- **A1** — TASK-524's box 3 says "the next sprint's commit messages". Read as the commits after T1 lands, which include
  the rest of this sprint; otherwise the box can only close in SPRINT-145. *Confirm: owner ruling at G2.*
- **A2** — TASK-520 also re-adds the template sentence that names the decomposer as the proof goal's reader, which is
  why T2's `Layers:` names the requirements template. *Confirm: T2 G2.*
- **A3** — TASK-515's line is optional and outside §4's required sections, so the conformance engine needs no change.
  *Confirm: T3 G2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-144-wire-the-milestone-cut-the-cost.md`](logs/SPRINT-144-wire-the-milestone-cut-the-cost.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/humanizer/references/embedded.md` | T1 | § Inline path for commit messages; Route bullet; fallback scoped to docs and PR bodies | Med | 3 inline runs on the fact-keep sample; Codex R2 CLEAR |
| `skills/humanizer/SKILL.md` | T1 | embedded summary names the commit-message exception | Low | read-through |
| `evals/fixtures/humanizer/fact-keep/NOTES.md` | T1 | inline-path recipe and the three recorded runs | Low | Codex R2 CLEAR |
| `TECH-DEBT.md` | T1 | TD-278 resolved with the measured cost; TD-274 sighting | Low | read-through |
| `skills/task-decomposer/SKILL.md` | T2 | step 4 Build order: ready slices, proof goal first (133/140) | Low | workdoo P3 exercise; prose-density 3/3 |
| `skills/lean-doc-generator/templates/product-requirements.md.template` | T2 | names the decomposer as the proof goal's reader | Low | workdoo P3 exercise |
| `skills/lean-doc-generator/templates/ADR.md.template` | T3 | optional Revisit when header line | Low | S4 run with control; adr-family fixtures |
| `skills/lean-doc-generator/references/ADR-example.md` | T3 | example fills Revisit when | Low | S4 run; Codex R2 CLEAR |
| `skills/lean-doc-generator/templates/flows.md.template` | T4 | Steps table with record changed, owner, next owner (49/100) | Low | `wc -l`; Codex R1 CLEAR |
| `skills/lean-doc-generator/templates/architecture-authentication.md.template` | T5 | Data scope column and enforcement line | Low | Codex R1 CLEAR |
| `CHANGELOG.md` | T1–T5 | five `[Unreleased]` lines | Low | read-through |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Outcome** — 5 of 5 members delivered (TASK-524, 520, 515, 517, 518); 17 of 17 DoD boxes ticked. System verify on the
VPS gate FAILed once on `e36eca1d` (`layers observed`: T1 and T4 ticked their member files in `review/`, a folder their
`Layers:` did not name), was fixed by scope-change and passed 317/0 on `bbf74f98` (owner ruling: fixed-and-rerun). Every
task was exercised on real input: three inline humanizer runs on the retained fact-keep sample (T1), a headless
decomposition of workdoo's roadmap row P3 with the owner's proof goal (T2), and a conformance run of the edited example
ADR beside an unedited control (T3). T4 and T5 are template-only, judged by read-through and Codex.

**Retrieval check** — two misses. L-229/L-234 (the scope-change leg reads the paths an entry names) were loaded, yet two
entries reddened the leg before commit: one with shortened paths, one with backticked folder words (L-257, count 2). L-238
says a coordinator write in a folder a task does not declare commits as bare `sprint(N):`; a tick in `review/` is that
write, and it reached system verify (L-258). L-252 and L-254 shaped the T1 runs (three runs, plugin dir pinned to an
export); L-240 kept `Layers:` free of unused tokens; L-251 drove the per-task check runs.

**Cost** — coordinator inline (Opus) for all five builds, no builder dispatch. Sub-agents: five Sonnet builder checks
(~53k each); one Codex rescue agent reused for six rounds (T1 ×2, T2 ×1, T3 ×2, T4+T5 ×1 joint; 15k–20k agent tokens
each). Headless: three inline humanizer runs ($0.27–$0.29, ~77k tokens each) and one decomposer exercise ($0.89, ~500k
tokens, mostly cache reads). Humanizer on commit messages: 18 inline passes, no child; the catalogs were read once
(~22k). Gate: one local default-profile run (549 s, truncated at the 520 s budget, TD-117) and three VPS runs, one of which
lost ssh mid-run and was read back rather than retried. Coordinator tokens were not measured.

**Worked**
- The inline route did what TD-278 asked: about 3.1k tokens per commit message against ~73k, with no child started.
- Codex caught what the coordinator's own read missed: run 1's added rollout actor (L-259).
- The uncertain-writes rule paid off at once: the dropped ssh run was read back, found still running, and finished green.
- Five builder checks settled every contradiction before G2 (the `[Unreleased]` block, step 3 vs step 4, the T3 line
  placement) without a builder retry.

**Friction**
- Two scope-change entries and one joint `T4 T5` tick commit had to be rewritten before commit to satisfy the
  attribution checkers; all three were caught before they landed.
- T3's first Codex round lacked the example's body and returned NOT CLEAR on missing input (also seen in SPRINT-142).
- The local gate still overruns its 520 s budget on this host; the VPS route is the working default.

**Buckets** — Shipped → CHANGELOG `[Unreleased]` (five lines, T1–T5). Tech debt → none new; TD-278 resolved; TD-274 gains
a sighting; the gate overrun is TD-117's. Follow-ups → none. Learnings → L-257 (scope-change paths, count 2, promotable at
the next promote), L-258 (a tick in `review/`), L-259 (a self-judged run).
