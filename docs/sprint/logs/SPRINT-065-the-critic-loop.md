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

### 2026-08-14 | surprise | a bare `check-layers-observed.sh` exits 0 having checked nothing
Re-running the checker after the `Layers:` fix returned `LAYERS_EXIT=0` and printed **no output at
all**. Taken alone that reads as a pass. It is not: the checker's own must-FAIL fixtures show a clean
run prints `PASS … layers observed (all changed files declared, base <sha>)`, so silence means it
never examined a sprint — it needs the file as an argument, which `qa-check.sh` supplies and a bare
invocation does not. Re-run as `check-layers-observed.sh docs/sprint/SPRINT-065-…md` it printed the
real PASS. Caught by the cross-check rule (CLAUDE.md § Behavioral Guidelines): the second query was
the fixtures' expected output shape, and it *disagreed* with the bare run's silence. An exit code with
no report behind it is not a verdict — L-045/L-057's family again, twice inside one task.

### 2026-08-14 | progress | T2 ruled — condition 1 re-worded to sprints-of-growth, then judged; all four now `[x]`
**Ruling (owner-approved at G2):** the `≥ 15% headroom` wording was the wrong *instrument*, not an
unmet target, and ADR-017 had already ruled so before this task and independent of it — which is what
makes this applying a prior ruling rather than inventing an escape. Re-worded to **sprints of growth**
and judged: `.claude/CLAUDE.md` 63/80 = 17 lines ≈ **20 sprints**; `.claude/CONTEXT.md` 132/150 = 18
lines ≈ **21 sprints**, at the measured 0.83 lines/sprint. Both clear what the epic wants. The gap was
**not** closed by trimming — `CONTEXT.md` is unchanged at 132 lines and T1 deliberately spent 0 of
them. `check-epic-archive.sh` now reports EPIC-002 `correctly live (status 'active', 0 of 4 open)`,
confirming all-conditions-met with a live status is a legitimate state and not a lingering-archive
violation.

### 2026-08-14 | scope-change | T2's archive DoD cannot fire inside T2 — the criterion went stale, the scope did not
**What broke.** T2's third DoD reads "If all four conditions end `[x]`: epic archived →
`docs/epic/archive/`, its `docs/epic/INDEX.md` row kept and relative links re-based one level deeper
(§11)". Written at promote, it assumes ticking the last condition is sufficient for archival. It is
not. §11 — in both `check-epic-archive.sh`'s header and `/lean-doc-generator`'s close row — archives an
epic when **every member sprint has closed AND every § Closed when condition is `[x]`**, and warns
explicitly: "Never archive on member-sprint count alone." **SPRINT-065 is itself a member sprint of
EPIC-002** (`epic: EPIC-002` in frontmatter, its row in § Member sprints still reading
`_(completed at close)_`). So the archive is not merely premature inside T2 — it is structurally
impossible, because the sprint performing it is one of the things that must have closed first.

**Impact.** No scope change: the ruling T2 exists to make is *made*, recorded, and green. What is
stale is the criterion's placement — archival is close-time work that `/lean-doc-generator close`
already performs as its documented epic rollup ("If the sprint carries `epic:`, roll up before
committing … close the epic only when **every** condition is `[x]`"). The fourth DoD is the else-branch
of the third ("If it stays open: the reason is stated as a condition") and its antecedent is now false,
so it cannot fire either — two mutually exclusive branches were both written as tickable boxes, and
`/prime` counts both.

**Re-confirm G2.** Ruled by the owner, not absorbed silently (L-088): a DoD frozen at promote carried a
premise a later reading of §11 dissolved, so it goes back for a ruling rather than being re-read to fit
what was built.

### 2026-08-15 | progress | T2 closed — owner ruled the stale archive DoD: re-word, tick, commit
The scope-change above went to the owner as a popup with three resolutions; ruling: **re-word boxes 3+4
per the logged scope-change, tick all four, commit**. Box 3 now reads "archival delegated to
`/lean-doc-generator close`" (§11 member-sprint rule); box 4 is recorded antecedent-false. The archive
itself fires at this sprint's close, where every member sprint of EPIC-002 will in fact have closed.
T2 committed in D1 order (T1 → **T2** → T3).

### 2026-08-15 | progress | T3 — revise loop shipped; residuals ruled; must-FAIL fixture ran both legs
Owner ruled the three G2 residuals in one frontier popup: **ceiling = one retry per review pass**
(both axes' worst findings travel together, never a second retry) · **fires automatically** in
attended modes on a concrete violation, outcome surfaced before commit · **exercise in-session** via
`sonnet` dispatches. Shipped: `review-scoping.md` § The revise loop + a two-line hook in
`SKILL.md` § Review (83/140 after edit). Fixture: `evals/fixtures/revise-loop/` (planted violation
per axis, tells kept out of `input/`).

**Leg 1 (detection):** both planted violations surfaced named. The Standards run also caught an
*accidental* third violation — the status file's own text parked an open question, a real CLAUDE.md
anti-pattern — which outranked the planted one; removed from the retained input so it carries exactly
one planted violation per axis, and the README asserts "surfaces as a violation" rather than "worst"
on Standards (two runs showed that ranking is reviewer-mood-dependent; the Spec planted finding *is*
asserted worst). **Leg 2 (ceiling):** scripted-partial builder (haiku) renamed the file, declined the
Spec finding; re-review (sonnet) reported naming clean, re-flagged the missing sections →
`Standards: naming-convention → fixed · Spec: template-sections-absent → still-open → owner`. One
retry total; no second firing. Fixtures retained (TD-012), exercised per L-058.

### 2026-08-15 | progress | revise · T3
The real-input firing: a scoped `sonnet` reviewer took T3's own diff and returned a concrete violation
per axis — the loop's first genuine run, on the change that built it. `Standards: undefined-event-kind
→ fixed` (the prescribed log line invented a `revise` event kind the sprint-log taxonomy doesn't
define — TD-055's trap, caught against the template comparand; now logs as a `progress` entry) ·
`Spec: unverified-exercise-claim → fixed` (the fixture README asserted results "recorded in the
Execution Log" before the entry existed — the L-057 family, a report ahead of its artifact; README
now states actuals and the cited entry exists). One retry, one re-review, both cleared; the reviewer
also confirmed no contradiction with `night-run.md` Part 0 (unattended never retries — TASK-203's
question, explicitly deferred). Secondary suggestion (hook-line bolding) applied in the same pass.

### 2026-08-15 | progress | Plan exhausted — close deferred to next session, owner-ruled
12/12 Plan DoD ticked (T1 · T2 · T3), QA 148/0, tree clean at `4945321`. Owner ruling: **reinstall
the plugin first** (the open Owner-action box, 1.34.0 installed vs 1.38.0 repo), then the next
session runs `/lean-doc-generator close` on fresh procedure — Retro, the EPIC-002 archival T2
delegated to close, `close_commit`, and the feature-sprint MINOR bump (1.38.0 → 1.39.0) all land
there rather than off a stale cache.
