---
sprint: 088
slug: execution-autonomy-foundation
stream: autonomy
epic: EPIC-015
owner: Maintainer
last_updated: 2026-08-26
status: active
plan_commit: 757b2a8
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-088 — Execution Autonomy Foundation

> **Theme:** EPIC-015's **first member sprint**, and this repo's **first parallel stream** — it runs
> beside EPIC-014's stream rather than after it. The outcome is the authority model everything else
> in the epic rests on: a task declares whether it is J0, J1 or J2; an unattended run executes J1
> inside an approved envelope without asking; and a J2 **parks**, proven by a seeded control because
> a natural one cannot be scheduled. Foundations before features — the envelope, the repair loop and
> the run-outcome vocabulary are all meaningless until authority is declared and provable.

## Scope

**In:** the J0/J1/J2 authority classes declared per task · the `sprint-bulk` continuation contract
and its five terminal states · `overnight` as the canonical mode name with today's names as aliases ·
one recorded pre-launch approval covering the whole envelope. Targets EPIC-015 § Closed-when **1–4**.

**Out (deferred):** bounded unattended repair (TASK-296, `blocked` on this sprint) · typed run
outcomes (TASK-297, `needs-info` — the EPIC-008 `RunSummary` boundary must be ruled first) · both V3
§56 dogfoods and the freeze re-arm, which are terminal work for a later member sprint · any new agent
definition, hook or reviewer role · re-opening H32/H33/H34, shipped at SPRINT-082 and exercised here,
never re-implemented (EPIC-015 D2).

## Plan

### T1 — Declare J0/J1/J2 authority on every task, and prove a J2 parks `[size: M · risk: med · class: execution · HITL]`
Layers: `skills/orchestrator/references/night-run.md` (Part 0 authority table) · `skills/orchestrator/SKILL.md` (the G2 declaration) · `skills/lean-doc-generator/templates/SPRINT.md.template` · `.claude/CONTEXT.md` § Task entry shape · a retained fixture pair
Depends-on: none
Cites: TASK-292 · EPIC-015 § Closed-when 3 · D3 · D4 · D5 · V3 H29 · L-111

The foundation the rest of the epic rests on. The three classes already describe how the loop
behaves — mechanical, delegated, human — so this **declares** them rather than inventing them. It is
first because the envelope (T4) is expressed in J-classes, and the continuation contract (T2) has no
definition of "already authorized" without them.

**Acceptance:** a promoted Plan carries a J-class per task; an unattended run executes a J1 without
asking and **parks** a seeded J2 with its unblock condition recorded.

**DoD:**
- [ ] Every task in a promoted Plan carries a `J0` / `J1` / `J2` declaration — *Verify: a sprint file missing one fails its schema check with a named finding*
- [ ] A J1 task executes unattended inside the approved envelope with no confirmation — *Verify: exercised on a real run, not asserted (L-007)*
- [ ] A **seeded** J2 parks, recording its unblock condition — *Verify: the seed is required, not a fallback (D5); TASK-188 is standing evidence that waiting for a natural park foreclosed this criterion once already (L-111)*
- [ ] **Tier G**: retained must-FAIL — a J2 task that does NOT park fails with its named finding while a sibling J1 control stays green — *Verify: seeded-break discrimination; seed verified landed by `cmp`, artifact still parses, break targeted, restored under a hash whose convention is stated and used consistently (L-169)*
- [ ] Pointed at its own motivating case, not fixtures alone — *Verify: L-166 — a fixture proves a branch works, only the real artifact proves it is reachable*

### T2 — Stop sprint-bulk pausing between already-authorized tasks `[size: M · risk: med · class: execution · HITL]`
Layers: `skills/orchestrator/SKILL.md` (the sprint-bulk loop) · `skills/orchestrator/references/night-run.md` · `scripts/night-run.sh` · `.claude/CONTEXT.md` § Modes
Depends-on: T1
Cites: TASK-293 · EPIC-015 § Closed-when 1 · V3 H27 · ADR-016

A run that pauses between tasks the owner already approved is why an approved Plan still needs a
human sitting beside it. The contract is that a run ends **only** at a named terminal state —
anything else is a stop nobody declared.

**Acceptance:** a `sprint-bulk` run moves task to task without re-confirming approved work, and its
exit names one of the five terminal states.

**DoD:**
- [ ] A run continues past a completed task with no confirmation — *Verify: exercised on a real multi-task run*
- [ ] A run ends **only** at `PLAN_EXHAUSTED` · `AUTHORITY_BOUNDARY` · `HARD_FAILURE` · `BUDGET_STOP` · `USER_STOP`, with the terminal reason in the rollup — *Verify: ADR-016's rollup stays the launcher's job; this changes when a run stops, never who records it*
- [ ] **Tier G**: retained must-FAIL — a run halting with no terminal state fails with its named finding while a clean-exhaustion control passes — *Verify: seeded-break discrimination, hash convention stated (L-169)*

### T3 — Make `overnight` the canonical mode name, with today's names as aliases `[size: S · risk: low · class: execution · HITL]`
Layers: `skills/orchestrator/SKILL.md` · `skills/flow/SKILL.md` · `skills/orchestrator/references/night-run.md` · `.claude/CONTEXT.md` § Modes · `README.md`
Depends-on: T2
Cites: TASK-294 · EPIC-015 § Closed-when 2 · V3 H28 · L-015 · L-016

The mode that exists is not the mode anyone can find. Named after the contract it runs, which is why
it follows T2 rather than leading it.

**Acceptance:** `overnight` is discoverable in `/orchestrator` and `/flow`, and every current trigger
still reaches it.

**DoD:**
- [ ] `overnight` is the documented mode name in `/orchestrator` and `/flow` — *Verify: consumer-facing surface checked; README + CHANGELOG reflect the user-visible rename (L-015)*
- [ ] `night-run` · `unattended` · `sprint-bulk unattended` each resolve to it — *Verify: one fixture per alias, each reaching the same mode*
- [ ] **Tier G**: retained must-FAIL — an unknown mode string fails loudly rather than falling through to a default — *Verify: seeded-break discrimination, sibling control green*
- [ ] The rename is **additive** for consumers: no installed trigger breaks — *Verify: traced on the consumer path, never inferred from this repo's dogfooding (L-016)*

### T4 — Record one pre-launch approval that covers the whole envelope `[size: M · risk: med · class: execution · HITL]`
Layers: `skills/orchestrator/references/night-run.md` (Part 1a pre-flight) · `skills/lean-doc-generator/templates/SPRINT.md.template` (frontmatter) · `skills/orchestrator/SKILL.md`
Depends-on: T1
Cites: TASK-295 · EPIC-015 § Closed-when 4 · V3 H30 · L-099 · L-151

An envelope that silently widens is the failure mode, and nothing in a run reports having exceeded an
approval it never re-read. The approval is written **where the run reads it** — the sprint
frontmatter — not in the launching transcript, which an unattended run cannot see.

**Acceptance:** one recorded approval covers all ten dimensions, and a run consuming it re-confirms
no J0/J1 mid-flight.

**DoD:**
- [ ] One approval covers goal · scope · acceptance · design · verification · J1 delegation · capabilities · repair policy · budget · stop conditions — *Verify: a fixture approval missing one dimension is rejected at pre-flight and names which one*
- [ ] It lives in the sprint frontmatter, not the transcript — *Verify: L-099 · L-151 — a ruling its reader cannot reach governs nothing*
- [ ] A run consuming it re-confirms no J0/J1 mid-flight — *Verify: exercised on a real run*
- [ ] **Tier G**: retained must-FAIL + sibling control, seeded-break discrimination — *Verify: hash convention stated and used consistently (L-169)*

## Owner-action checklist
- [ ] Sign the batch **G1 + G2** for T1–T4 before execution begins, and record it as `gates_signed: G1,G2 @ <sha>` in this file's frontmatter. **The field is absent until then, and its absence means NOT signed** — an unattended run reads this file and nothing else (L-099).

## Decisions (pre-locked)
- **D1** — **`.claude/CONTEXT.md` is single-owned by T1 for this sprint.** T1, T2 and T3 all touch it (§ Task entry shape, § Modes), and EPIC-014's stream touches § Sprint model at cutover. Commit order is T1 → T2 → T3, each staging per-hunk (`git add -p`) with `git diff --cached` verified — never a plain `git add` over the other stream's WIP (L-042 · L-037).
- **D2** — **Cross-stream coordination is by commit ownership.** SPRINT-087 owns `packages/standard/src`, `apps/cli/src`, `TECH-DEBT.md` and its own sprint files; this sprint owns `skills/orchestrator/**`, `skills/flow/**` and `scripts/night-run.sh`. The surfaces are disjoint by construction, which is what makes the parallel stream admissible at all.
- **D3** — **J2 stays human; absence is never consent.** Inherited from EPIC-015 D3 and restated because this is the sprint that could weaken it: a missing ask channel, a denial or a timeout is a BLOCK, never a default-yes, and never reasoned out by the run.
- **D4** — **Every task here is ADR-029 Tier G** (EPIC-015 D4). A false negative in an authority classification or a park is silent by construction — the run reports success and the omission leaves no trace.

## Assumptions
- **A1** — The three authority classes already describe how the loop behaves. *Confirm: `orchestrator/references/night-run.md` Part 0's existing HITL/AFK boundary, read at T1's design.*
- **A2** — Renaming to `overnight` is additive for consumers, every existing trigger surviving as an alias. *Confirm: T3's per-alias fixtures plus a consumer-path trace (L-016).*
- **A3** — The two streams' file surfaces stay disjoint. *Confirm: measured at promote against SPRINT-087's declared `Layers:` — zero overlap — and re-checked by `check-layers-observed.sh`, whose ownership scoping (TASK-299) is exercised for the first time on real input by this sprint's existence.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-088-execution-autonomy-foundation.md`, rendered
> from `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never
> here (STANDARD §9 · ADR-014). Every entry carries its `consequence · Tn · behaviour:… · governance:…`
> line — a task whose consequence is unrecorded is invisible to `check-review-depth.sh`.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro
