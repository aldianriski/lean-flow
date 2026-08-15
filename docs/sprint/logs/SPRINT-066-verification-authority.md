---
sprint: 066
slug: verification-authority
owner: Maintainer
last_updated: 2026-08-15
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-066 — Execution Log

> Append-only companion to [`../SPRINT-066-verification-authority.md`](../SPRINT-066-verification-authority.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-15 | progress | G1 + G2 signed off; preflight CLEAR; T1 ruled in the same frontier round
Batch G1 ran the **fast-path** — both tasks are `origin: decomposer`, grilled and approved earlier
today in this session; owner confirmed scope unchanged. G2 signed with the inline-decision design
(both tasks are `class: decision`, and per ADR-010 rulings are the coordination tier's own job — the
stated reason for no Implement dispatch). Preflight run from the Plan: no cycle · no shared file
(T1 owns `review-scoping.md` + ADR-021, T2 owns `night-run.md` + the next id; `docs/adr/` is
different files) · waves T1=0 / T2=1 · base `f208aad` == live HEAD → **CLEAR**, sequential T1 → T2
per D1/D2. `gates_signed: G1,G2 @ f208aad` stamped. **T1's fork was ruled in the same popup** (its
prerequisites were settled; T2's fork serialises behind T1's answer per frontier discipline):
**owner chose "gate the silent path" → ADR-021.** Boundary: where a `done-when` names a mechanical
check, a FAIL blocks the *silent* tick — surface → recorded owner ruling, override always available;
the consumer's CI is never run as a blocker on lean-flow's own authority; at G2 each `done-when`
notes its verification method where a mechanical one exists.

### 2026-08-15 | progress | T1 `Layers:` corrected — the ruling's wiring reaches three undeclared files (L-100)
Recording before declaring: T1's `Layers:` named `docs/adr/` and `review-scoping.md`, written when
the ruling's *content* was unknown. The chosen ruling wires into G2 itself, which lives in
`skills/orchestrator/SKILL.md` (the checklist that fires) and is summarised in `.claude/CONTEXT.md`
§ Gates (the SSOT row, extended in place — 0 new lines); `docs/DECISIONS.md` gains the index row
every ADR gets. All three are the L-020 wiring the ruling needs to *fire*, not scope growth: the
Plan's Acceptance is unchanged. `Layers:` amended next, then the edits.

### 2026-08-15 | progress | T1 shipped — ADR-021 recorded and wired; review clean on both axes; 4/4 DoD ticked
ADR-021 written against the template (the Spec comparand, rung 1), the boundary paragraph landed in
`review-scoping.md` § QA suggestion, the G2 checklist line in `orchestrator/SKILL.md` (106/140), the
CONTEXT.md § Gates G2 cell extended in place (132/150 — 0 new lines), the DECISIONS index row added,
knowledge index regenerated. Scoped `sonnet` review of the full diff: **Standards clean · Spec
clean**, each after the adversarial forced second look — all four ruling conditions traced into all
four touchpoints, and the reviewer independently verified the `gates_signed`/`plan_commit` shas
against git. No concrete violation → the revise loop correctly did not fire. T2's fork was ruled by
the owner while the review ran (frontier open once T1's answer existed): **mechanical-trigger
carve-out → ADR-022** — implementation follows in D1 commit order.

### 2026-08-15 | progress | T2 `Layers:` corrected — the ruling reaches the revise loop's own text (L-100)
Recording before declaring: T2's `Layers:` named `night-run.md` and `docs/adr/`, but the revise
loop's section in `review-scoping.md` carries the literal line "**Unattended: never** … is TASK-203's
ruling, not this section's" — which the ruling just made stale. Leaving it would ship a contradiction
between the two references (the exact wiring gap L-020 names, and the one the T1 reviewer was told to
watch for). `review-scoping.md` and `docs/DECISIONS.md` (the index row every ADR gets) added to
`Layers:`; T1's ownership of `review-scoping.md` ended at its commit (`d7a86e7`), so the D1 sequence
holds — no shared WIP.

**On the task's own warning** ("do not resolve the collision by reading the retry as mere
execution"): the carve-out does not read *the retry* as execution — it splits the **verdict classes**
ADR-021 created. A critic's "not good enough" stays a decision and still parks, always. A
`done-when`-named check's FAIL is a decision the human already made — at G2, when they named the
check — so acting on it once, under a ceiling the owner also set, inside a policy the repo explicitly
declared, is executing three prior human decisions, not making a new one. Absence of the declared
policy = never (absence ≠ consent).

### 2026-08-15 | progress | revise · T2
The scoped review of T2's diff returned a concrete violation per axis, and the loop fired on its own
subject matter. `Standards: night-run-last-updated-stale → fixed` (the file's own `update_trigger`
names "pre-flight/trigger/rollup logic" and this edit touched two of the three; frontmatter bumped to
2026-08-15) · `Spec: stale-unattended-wiring → fixed` (the superseded rule survived in the two
consumer touchpoints CLAUDE.md's wiring check names — `orchestrator/SKILL.md` § Review still said
"unattended never retries — TASK-203" and CONTEXT.md § Built-in leverage said "attended only"; both
now carry the ADR-022 carve-out, SKILL.md 107/140, CONTEXT.md in-place at 132/150). T2's `Layers:`
amended a second time for the two files the fix touched — the revise loop's Spec axis caught the
exact L-020 gap on the change that extends the revise loop, which is the mechanism working where it
was built to. One retry total; re-review on the delta follows.

### 2026-08-15 | progress | T2 shipped — ADR-022 recorded and wired; re-review confirms both fixes; 4/4 DoD ticked
The delta re-review reported `Standards: night-run-last-updated-stale → fixed` and
`Spec: stale-unattended-wiring → fixed`, no new violations introduced, SKILL.md confirmed 107/140,
and the log's `revise · T2` entry confirmed taxonomy-clean (title text, not an invented event kind).
All four touchpoints now agree on the carve-out's three conditions: ADR-022 · night-run.md Part 0
rows + Part 4 retry-line · review-scoping.md § revise loop · SKILL.md § Review + CONTEXT.md § Built-in
leverage. `/council` was not needed — the fork settled decisively at G2. Commit follows in D1 order.
