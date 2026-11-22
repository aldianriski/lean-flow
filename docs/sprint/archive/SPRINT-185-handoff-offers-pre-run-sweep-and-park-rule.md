---
sprint: 185
slug: handoff-offers-pre-run-sweep-and-park-rule
owner: Maintainer
last_updated: 2026-11-22
status: closed
plan_commit: 9478dec4
close_commit: eb93a68c
gates_signed: G1,G2 @ c812fcfb
update_trigger: sprint execute/close events
---

# SPRINT-185 — Hand-off Offers, a Pre-run Sweep, One Park Rule and the Loop Audit

> **Theme:** Five owner notes from 2026-11-21 about the loop's seams. Init stops instead of handing over to migrate, a decomposed backlog ends without offering promote,
> sprint-bulk asks mid-run what it could ask once, and attended and overnight runs park blockers by two different rules.
> A fifth task audits the lane and loop workflow and ranks what to optimise next, so the owner picks the following sprint from evidence.

## Scope

**In:** TASK-694 to TASK-698: init hand-over and reviewed suggestions · promote and mode offers at each hand-off · the pre-run question sweep · the park-continue-ask-at-end rule for both run kinds · the ranked loop audit.
**Out (deferred):** any workdoo product work and EPIC-025's open condition · a version bump, tag or push · new hooks, agents, gate legs or scripts · lane token re-measurement (TASK-668) · fixes for what the audit ranks (a later decompose).

## Members

- docs/work/todo/TASK-694-init-hands-over-into-migrate-and-drafts-reviewed-suggestions.md
- docs/work/todo/TASK-695-offer-promote-and-a-recommended-execute-mode-at-each-hand-off.md
- docs/work/todo/TASK-697-audit-the-lane-and-loop-workflow-and-recommend-what-to-optimize.md
- docs/work/todo/TASK-696-sprint-bulk-resolves-every-foreseeable-question-before-first-dispatch.md
- docs/work/todo/TASK-698-one-park-continue-ask-at-end-rule-for-attended-and-overnight-runs.md

## Plan

### T1 — Hand init over into migrate and draft reviewed suggestions `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/SKILL.md` · `skills/lean-doc-generator/references/init.md` · `skills/lean-doc-generator/references/migration-map.md` · `skills/lean-doc-generator/templates/product-requirements.md.template` · `skills/lean-doc-generator/templates/development-coding-standards.md.template`
Depends-on: none
Cites: TASK-694 · `lean-doc-generator/SKILL.md` · L-293
Init writes nothing and stops when migrate is chosen, and both skills offer the owner no starting point when evidence is absent. The sole writer of the lean-doc-generator skill body in this sprint.

**Acceptance:** init on a repo with docs, migrate chosen, runs migrate's plan in the same session with no init writes, and an init and a migrate round each show a reviewed suggestion.

### T2 — Offer promote and a recommended execute mode at each hand-off `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/task-decomposer/SKILL.md` · `skills/task-decomposer/references/intake-brief.md` · `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/mode-choice.md` · `skills/orchestrator/references/dispatch.md` · `skills/lean-doc-generator/references/sprint-by-reference.md` · `skills/lean-doc-generator/references/promote-brief.md` · `skills/prime/SKILL.md` · `skills/flow/SKILL.md`
Depends-on: none
Cites: TASK-695 · `orchestrator/references/mode-choice.md` · `references/sprint-by-reference.md` · `lean-doc-generator/SKILL.md` · `orchestrator/SKILL.md` · L-293
Nothing suggests promote after decomposing, and the orchestrator picks a mode silently. First of three writers of the orchestrator, prime and flow skill bodies.

**Acceptance:** through `/flow`, decompose leads to a promote popup, then a mode popup with a recommendation, and "Stop here" ends the chain with no sprint created.

### T3 — Audit the lane and loop workflow and rank what to optimise `[size: M · risk: low · class: decision · HITL · J1]`
Layers: `docs/research/loop-audit-2026-11.md` · `docs/knowledge-index.md`
Depends-on: none
Cites: TASK-697 · `templates/RESEARCH.md.template` · `coordinator.md` · `night-run.md` · `dispatch.md` · `LEARNINGS.md`
The owner asked what is weak in the coordinator and lane workflow and the whole loop. Recon and ranking come before fixes so the owner chooses what ships. Built inline on the session model, Codex reviews.

**Acceptance:** a research doc ranks evidence-backed weak points for both scopes with a recommendation, Codex-reviewed within two rounds, and no skill, ADR or core doc is edited.

### T4 — Resolve every foreseeable sprint-bulk question before the first dispatch `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/sprint-bulk-run.md` · `skills/orchestrator/references/builder-check.md` · `skills/orchestrator/references/night-run.md`
Depends-on: T2
Cites: TASK-696 · `orchestrator/references/sprint-bulk-run.md` · `orchestrator/SKILL.md` · L-293
Batch G2 grills only tasks with an open `assumes:`, so questions surface mid-run. The `Depends-on: T2` is a shared-file sequence, not a logical one. Creates the sprint-bulk run reference.

**Acceptance:** a workdoo sprint with a scope-blocking assumption, an open assumes, a dependent question pair and one unresolvable member has every foreseeable question asked before dispatch.

### T5 — One park, continue, ask-at-end rule for attended and overnight runs `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/sprint-bulk-run.md` · `skills/orchestrator/references/night-run.md` · `skills/orchestrator/references/dispatch.md` · `skills/lean-doc-generator/references/sprint-by-reference.md` · `skills/flow/SKILL.md` · `skills/prime/SKILL.md` · `skills/handoff/SKILL.md`
Depends-on: T4
Cites: TASK-698 · `scripts/night-run.sh` · `orchestrator/SKILL.md` · `coordinator.md` · L-293
Attended runs halt at the first blocker while overnight parks, which is two processes. One rule: park, continue disjoint work, ask at the end. The `Depends-on: T4` is a shared-file sequence, not a logical one.

**Acceptance:** against the unchanged launcher and reaper, a seeded mid-run blocker parks, disjoint work continues, and one round is asked at exit, with the same rule for an overnight halt.

## Decisions (pre-locked)

- **D1** — Waves: W1 T1, T2, T3 · W2 T4 · W3 T5. Every blocker joins, so no state change.
- **D2** — Shared-file order, single writer at a time: `orchestrator/SKILL.md` T2 then T4 then T5 · `sprint-bulk-run.md` and `night-run.md` T4 then T5 · `dispatch.md`, `sprint-by-reference.md`, `prime/SKILL.md`, `flow/SKILL.md` T2 then T5. Commit stage per hunk.
- **D3** — README, CHANGELOG and CONTEXT are coordinator-owned, written once in a bare `sprint(185):` commit, in no Tn's Layers. Each task's report returns its proposed lines.
- **D4** — No epic and no stream: none of the five tasks advances EPIC-025, whose open condition is a workdoo sprint.
- **D5** — Builders: Codex in worktrees for T1, T2, T4, T5; Claude inline for T3.
- **D6** — T5 carries a G2 review-round cap of 2 and stays size M (owner ruling).
- **D7** — Consumer proofs: a 15 USD spend cap for the sprint. Proofs run serialised through the coordinator, one workdoo copy at a time, after merge-back. The builder stages, the coordinator launches, the owner approves each launch, and the child's tool route is named at G2 (L-293, `headless-proof-launcher`).

## Assumptions

- **A1** — No ADR governs init's "never generates candidate answers". *Confirm: re-derive at G2 (L-220).*

## Execution Log

Append-only, in [`logs/SPRINT-185-handoff-offers-pre-run-sweep-and-park-rule.md`](logs/SPRINT-185-handoff-offers-pre-run-sweep-and-park-rule.md).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/lean-doc-generator/SKILL.md`, `references/init.md`, `references/migration-map.md`, `templates/product-requirements.md.template`, `templates/development-coding-standards.md.template` | T1 | Init on a repo with docs hands over to migrate in the same session; open profile prompts get independently reviewed suggestions, cited when accepted (WHY: init stopped where migrate should start) | Med | consumer proof legs a, b, c (trimmed); Codex r2 CLEAR |
| `skills/orchestrator/references/mode-choice.md` (new), `skills/task-decomposer/SKILL.md`, `references/intake-brief.md`, `skills/lean-doc-generator/references/sprint-by-reference.md`, `references/promote-brief.md`, `skills/orchestrator/SKILL.md`, `references/dispatch.md`, `skills/prime/SKILL.md`, `skills/flow/SKILL.md` | T2 | One offer per hand-off: promote or stop, then a recommended mode; the caller runs it once (WHY: a decomposed backlog ended without offering promote) | Med | consumer proof legs a to f; Codex r1 CLEAR |
| `docs/research/loop-audit-2026-11.md` (new), `docs/knowledge-index.md` | T3 | Ranked audit of the lane and loop workflow (WHY: the owner picks the next sprint from evidence) | Low | Codex draft review r1 CLEAR |
| `skills/orchestrator/references/sprint-bulk-run.md` (new, § Sweep), `references/builder-check.md`, `references/night-run.md`, `skills/orchestrator/SKILL.md` | T4 | Pre-run sweep asks every foreseeable question at batch G1/G2 before the first dispatch (WHY: sprint-bulk asked mid-run what it could ask once) | Med | consumer proof legs 1, 2; Codex r2 CLEAR |
| `sprint-bulk-run.md` (§ Runtime), `night-run.md`, `dispatch.md`, `skills/orchestrator/SKILL.md`, `skills/flow/SKILL.md`, `skills/prime/SKILL.md`, `skills/handoff/SKILL.md`, `sprint-by-reference.md` | T5 | One park, continue, ask-at-end rule for attended and overnight runs; units advance on their own readiness; `/prime` surfaces the exit questions; 6c98f393 orders the exit pass after a proof run omitted the canonical park line (WHY: two park rules disagreed) | Med | consumer proof legs a to f, e2, unchanged launcher and reaper; night-run-rollup 46/0; Codex r1 and r2 CLEAR |
| `README.md`, `CHANGELOG.md`, `.claude/CONTEXT.md` | COORD | `[Unreleased]` lines and roster-neutral wording for TASK-694 to 698 (WHY: D3, coordinator-owned) | Low | gate |
| `docs/work/` moves, sprint file and Log; `TECH-DEBT.md`, `docs/LEARNINGS.md` | COORD | Ticks, status moves, proof records; close files TD-322 to 325, L-331 and three L-219 sightings | Low | check-sprint-by-reference `--close` 12/0, layers-observed PASS, gate |

## Retro

**Retrieval check** — Yes, one miss. L-219's durable rule (`git -C`, never `cd`) is in `dispatch.md` and still fired three times this sprint: twice in this coordinator, once in the consumer session. Each was caught before a dispatch, so the cost was nothing beyond the slip itself. L-293 held: every headless proof launch named its tool route first, and no run was voided by a blocked `Skill` call.

**Cost** — 5 members (T5 size M, the rest S or M); coordinator plus Codex builders (T1, T2, T4, T5) and Claude inline for T3. Reviews: scoped Sonnet reviewers per build, Codex on each shipped diff (T1 and T4 needed round 2; T5 needed a second round for the exit-order fix). Consumer-proof spend: 5.00 of 15.00 USD (T2 leg f 0.30; T5 runs b 0.89, c+d+f 1.37, d 0.88, d re-run 0.87; three `/prime` checks 0.69), all other legs interactive. DoD: 36 of 36. Builder and reviewer token counts were not recorded this session.

**Worked**
- The consumer proofs found a real defect the reviews missed. Two of three overnight exits wrote the canonical park line; one left it out, and the unchanged reaper derived a false BUDGET_STOP. The fix shipped inside the sprint, checked by Codex replaying the reaper's rules over the failed Log.
- Folding legs by shared seed (T1 trimmed, T5 seven legs into four runs plus `/prime` checks) kept spend at a third of the cap with every frozen leg still exercised.
- Throwaway proof branches in workdoo, reverted by checkout plus a manifest compare, were safer than moving the work store aside, which once lost a held copy before it was compared.

**Friction**
- Headless `/handoff` could not write its temp doc until the long temp path was used (TD-323); two proof runs reached the exit path blind.
- workdoo has no `## Stack`, so the first `/flow` session detoured through migrate and exposed two migrate defects (TD-324, TD-325).
- The owner had to relay `/clear` and "go" for each interactive leg, because a cleared session loses the run request.

**Pattern candidate**
- L-331 (new, count 1): a rule a run must follow at its exit is not proven by one passing run; the same exit order held twice and failed once.

**Routed**
- Shipped: CHANGELOG `[Unreleased]` carries one line per member (TASK-694 to 698). No `type: bug` member.
- Tech debt: TD-322 (research template cap figure), TD-323 (headless handoff temp path), TD-324 (single-option migrate popup), TD-325 (migrate backup popup hides its commands).
- Follow-ups: none filed. The T3 audit's ranking (`docs/research/loop-audit-2026-11.md`) is the input for picking the next sprint: #3 (one builder brief), then #7 (close-time worktree sweep, TD-246).
- Learnings: L-331 filed; L-219 count 6 to 9.
- Release: feature sprint (shipped skills changed), so MINOR by hand. Nothing is pushed.
