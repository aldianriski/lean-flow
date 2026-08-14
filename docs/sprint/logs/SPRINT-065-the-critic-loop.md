---
sprint: 065
slug: the-critic-loop
owner: Maintainer
last_updated: 2026-08-14
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-065 — Execution Log

> Append-only companion to [`../SPRINT-065-the-critic-loop.md`](../SPRINT-065-the-critic-loop.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-14 | progress | G1 + G2 signed off; preflight CLEAR, sequence T1 → T2 → T3
Batch G1 ran the **full** checklist on all three tasks — no fast-path anywhere, since the origins are
`manual` (T1, T3) and `close-retro` (T2), none of which met the intake grill. A1–A4 were re-verified
live rather than trusted from promote: A1 by two agreeing queries (one occurrence of "worst finding"
in `review-scoping.md`; **zero** occurrences of `retry|comparand|reference:|revise|hand-back` in that
file), A2 by measurement (CONTEXT 132/150 · CLAUDE 63/80 · orchestrator SKILL 102/140), A3 by
`check-epic-archive.sh`'s own report. Dispatch preflight run bare: `PREFLIGHT: CLEAR` — base-ref
`8282c3b` == live HEAD, waves T1=0 / T2=1 / T3=1, ownership `.claude/CONTEXT.md` T1→T2 and
`review-scoping.md` T1→T3. T2 and T3 are file-disjoint and could have dispatched in parallel at rank
1; ruled **sequential** anyway because D2 makes T1's ruling gate T3's *content*, and both are HITL —
worktree isolation would have bought nothing and cost a merge queue.

### 2026-08-14 | surprise | `Cites:` is an external comparand that already exists, in 17 of 65 sprints, defined nowhere
T1's recon went looking for whether a `reference:` field was needed and found the field already
present under another name. `Cites:` appears in **17 of 65** sprint files (live + archive), is
*parsed* by the dispatch preflight, and is then **deliberately discarded** by it (`dispatch.md` line
136: "those tokens are cited, not touched"). It is defined in **neither** `SPRINT.md.template` — which
mandates only `Layers:`, `Depends-on:` and `**Acceptance:**` — **nor** `.claude/CONTEXT.md` § Task
entry shape. So the sprint's own framing of T3 ("a computed value never wired to a consumer", the
L-020 shape) turned out to describe T1 as well: two instances of the same failure, one sprint apart,
found by looking for a *different* thing. This is what moved T1 off the tidy answer.

### 2026-08-14 | progress | T1 ruled — null answer, plus the comparand ladder and a defined `Cites:`
**Ruling (owner-approved at G2): no new `reference:` field.** The Spec axis gains a **comparand
ladder** in `review-scoping.md` § Two axes — take the first rung that exists: the **template** the
artifact renders against · a retained **must-FAIL fixture** (L-058) · a **`check-*.sh` named finding**
· the task's own **`Cites:`** line. `done-when` is the **fallback, not the default**, and when the
axis falls back to it the report must *say so* — an unremarked fallback reads as an external check
that never happened.

The null answer was tested **first, not last** (L-091), and it held on its own evidence rather than by
default: the doc-vs-template hypothesis (L-016) is not merely true for this repo's substrate, it is
rung 1 — a doc rendered by `/lean-doc-generator` against a template it did not write is measured
against an artifact that predates it and was authored by someone else, which is the entire property
an external comparand is wanted for. The defect was never a missing field; it was that the Spec axis
never read the comparands the repo already had.

`Cites:` is now documented in `SPRINT.md.template` as optional-but-load-bearing, with the preflight's
exclusion stated inline so a path belonging in `Layers:` is not parked there — the one way a defined
`Cites:` could otherwise degrade the shared-file overlap map into a silent false PASS.

**CONTEXT.md cost: 0 lines** (132/150 unchanged) — the ruling adds no field, so § Task entry shape is
untouched and TASK-196's cap work is not re-spent. Home is a `references/` file, uncounted (ADR-006).

### 2026-08-14 | progress | T1 `Layers:` corrected to declare `SPRINT.md.template` (L-100)
`qa-check.sh` returned **147 pass, 1 fail** — `layers observed: skills/lean-doc-generator/templates/
SPRINT.md.template changed but undeclared in any task's Layers:`. Correct finding, and the expected
shape: T1's `Layers:` was written at promote against the *assumption* that the ruling would land in
`review-scoping.md` and possibly `.claude/CONTEXT.md`. The ruling instead went to a template — a file
the declaration could not have named before the decision was made. Per **L-100** a `Layers:` line is a
live declaration, not a frozen prediction to defend: logged here first, then declared, then continued.
`.claude/CONTEXT.md` stays declared but **untouched** (the null answer spends 0 lines of it), which
also leaves T2 free to take it under the D1 ownership order without a per-hunk stage.

Worth recording separately: the gate was run in the background and the harness reported the wrapper's
`exited with code 0` while the gate itself returned `QA_EXIT=1`. The FAIL was read off the **output
file**, not the reply channel — CLAUDE.md § Edit-safety (c), and the fifth sighting of that family.
