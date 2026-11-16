---
sprint: 180
slug: humanizer-keeps-infra-terms-english
owner: Maintainer
last_updated: 2026-11-16
status: closed
close_commit: d5eeea85
plan_commit: 4579e335
gates_signed: G1,G2 @ 374b0fca
update_trigger: sprint execute/close events
---

# SPRINT-180 — Humanizer Keeps Infra Terms in English

> **Theme:** The `/humanizer` Indonesian catalog leaves ordinary infra and process words (gate, branch, window, secret,
> container) open to word-for-word translation, and the bnpt-68 owner rejected a deck twice for it. This sprint widens
> the one existing domain-terms rule, adds an optional host-glossary override, and proves both on a synthetic fixture.
> It is skill work, so ADR-053's freeze does not apply. It is also the dispatch trial's named sprint.

## Scope

**In:** TASK-672.
**Out (deferred):** every other backlog item (TASK-402, 489, 668 and 671 are blocked; 507 and 523 need info). TASK-671
rules the trial cells on this sprint's numbers, so it follows this sprint's close. Also out: any new guard, checker or
ledger field, an `embedded.md` edit, and the v2.24.0 push (owner action).

## Members

- docs/work/todo/TASK-672-indonesian-infra-text-uses-english-term-not-calque.md

## Plan

### T1 — Widen the domain-calque rule and add the optional host-glossary route `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/humanizer/references/patterns-id.md` · `skills/humanizer/SKILL.md` · `README.md` · `CHANGELOG.md` · `evals/fixtures/humanizer/domain-calque/`
Depends-on: none
Cites: TASK-672, TASK-525, `skills/humanizer/references/embedded.md`, `skills/humanizer/references/patterns-lf.md`, `evals/fixtures/humanizer/term-of-art/`, `embedded.md`, `patterns-lf.md`, `.claude/CONTEXT.md`, `CONTEXT.md`, `lean-doc-generator/templates/CONTEXT.md.template`, `term-of-art/NOTES.md`
One rule in its one existing home covers infra and process words, with an optional host glossary that wins only for
terms it names. The fixture is synthetic and fails on the baseline.

**Acceptance:** the rule is in the Indonesian catalog and reaches every catalog path with no caller edit. Three of three runs
fix 8 of 8 seeds and both `kunci` seeds with zero leftovers, the baseline fails the sample, and the `term-of-art` fixture still passes 3 of 3.

## Owner-action checklist

- [ ] Push v2.24.0 (committed, unpushed; owner-reserved).

## Decisions (pre-locked)

- **D1** — TASK-672 is the only member; no other backlog item is ready.
- **D2** — This sprint is the dispatch trial's named sprint: every dispatch adds a Log row (at most 6 strongest-tier; 2 used before promote).
- **D3** — The task commits as `sprint(180) T1: …`; coordinator writes (moves, ticks, Log, sprint file) commit as bare `sprint(180):`.
- **D4** — The build route, the baseline sha convention and the 11 G2 notes in the task's Assumes are settled at G2, in the member file.

## Assumptions

- **A1** — The fixture directory name `domain-calque/`. *Confirm: G2.*
- **A2** — `skills` is byte-identical between `3e31706d` and `plan_commit`. *Confirm: `git diff` at the build.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-180-humanizer-keeps-infra-terms-english.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/humanizer/references/patterns-id.md` | T1 | Widen the domain-calque rule to infra and process words, 15-row table, kunci rule, host-glossary step at the top of the file (WHY: the owner rejected a deck twice for word-for-word calques) | low | 13 baseline and after runs plus a blind judge and a mechanical grep, recorded in `evals/fixtures/humanizer/domain-calque/NOTES.md` |
| `skills/humanizer/SKILL.md` | T1 | One line: search the draft and final text for rejected forms left over (WHY: a swap can leave the old form elsewhere) | low | zero leftovers in every after final |
| `README.md` | T1 | One clause naming the infra calque rule and the optional host-glossary override (WHY: consumer-facing surface) | low | `check-doc-caps` pass |
| `CHANGELOG.md` | T1 / close | One `[Unreleased]` line, with the commit-path caveat added at close (WHY: shipped behaviour stated accurately) | low | grep |
| `evals/fixtures/humanizer/domain-calque/` | T1 | Synthetic memo with 8 seeds and 2 kunci seeds, controls, three glossary folders, commit message, NOTES (WHY: the claim is model behaviour, so only runs prove it) | low | baseline fails 8 of 8, after-runs pass; term-of-art re-run 3 of 3 |

## Retro
**Retrieval check** — yes, a miss. L-261 and L-294 were in context, and the coordinator still glued prose onto a machine-read `consequence ·` line; system verify at `78612591` failed `review-depth-consequence-vocab` (fixed in `d6e1568e`). L-255 held: the baseline was run before the fix, and the pin caught a weak sample.

**Cost** — 1 member, size S, coordinator plus workers, Codex as builder. Per-dispatch tokens are in the Log's trial rows 1 to 19. Cells over the 1.25x cap: intake 1.45x and promote 1.40x; the close-scan row ran 1.11x. Strongest-tier dispatches used: 4 of 6. Eval spend about 13 headless runs plus a judge at roughly $0.2 a run. A per-sprint token total is not derivable (the coordinator's own tokens are not recorded), so none is stated.

**Worked**
- The fixture was committed before the baseline, and the pin caught a sample the old rule already half-fixed; it was strengthened openly.
- A blind judge and a mechanical second query agreed on every seed and control.
- The box-4 scope-change was logged and ruled by the owner before the tick.
- The blind Fable and Codex review pair found real defects in the first diff; round 2 was CLEAR.

**Friction**
- The headless Skill call was denied, so baseline round 1 was discarded; the working route was naming the skill folder in the prompt.
- The glossary step sat at line 173 of 188 and fired in 1 of 7 runs; moved to the top, it fired on two of three paths.
- The commit-inline path still ignores the host glossary (TD-317).
- Two dispatch cells (intake, promote) ran over their token cap.

**Pattern candidate**
- L-327 new (an action instruction deep in a catalog is not acted on); count bumps on L-293 (now 2), L-255 (now 2) and L-261 (now 7).

**Routed**
- Shipped: the `[Unreleased]` CHANGELOG line, with the commit-path caveat. Tech debt: TD-317. Follow-ups: no new task file; TASK-671 (dispatch-trial verdict) is unblockable now and its state change goes to `/triage`. The CONTEXT `dispatch-trial:` line is left for TASK-671 to retire (owner ruling).
- Release: a feature sprint, so a MINOR by hand (`release-patch` is PATCH-only); not done here. The v2.24.0 push stays owner-reserved.
- Raw eval evidence sits outside the repo at `D:\Research\s180-evals` (run transcripts, baseline and after exports, `discarded/after-r1/`); it is never deleted.
