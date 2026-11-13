---
sprint: 174
slug: review-rules-and-cross-model-route
owner: Maintainer
last_updated: 2026-11-13
status: closed
plan_commit: 1296be50
gates_signed: G1,G2 @ bd372167
update_trigger: sprint execute/close events
---

# SPRINT-174 — Review Rules and the Cross-Model Route

> **Theme:** Workflow code only, nothing for workdoo (owner ruling, 2026-11-13). Three review rules from the claudex-loop delta land first: coverage and limitations statements, a fixer who becomes a builder, and the replaced-behaviour sweep.
> Then the opt-in cross-model route ships, so a Claude host can hand a review, a build or a diagnosis to another provider's CLI.

## Scope

**In:** the three review rules (TASK-659) · the cross-model route, review half then build-and-diagnosis half (TASK-660, one task file, two plan steps)
**Out (deferred):** any workdoo work, including TASK-489 · Codex hosting with Claude reviewing (TASK-660 A3) · a runner script for the route (TASK-660 A4) · EPIC-025's open release condition, an owner action (push v2.23.0)

## Members

- docs/work/todo/TASK-659-add-three-review-rules-from-claudex-loop.md
- docs/work/todo/TASK-660-ship-the-cross-model-route.md

## Plan

### T1 — Add the three review rules `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/references/builder-check.md` · `CHANGELOG.md`
Depends-on: none
Cites: TASK-659, `docs/research/claudex-loop-delta.md` (keepers 2 to 4, read only)
The rules are reviewer-brief and procedure text, so they land in `references/`; `skills/orchestrator/references/builder-check.md` is touched only if its brief needs the two statements.

**Acceptance:** every review result states coverage and limitations, and a bare "CLEAR" with no coverage statement is not recorded as a passed review.

### T2 — Cross-model route, review half `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `skills/orchestrator/references/cross-model-route.md`
Depends-on: T1
Cites: TASK-660 (the Review heading, and the negative for no policy and empty output), TASK-659, `docs/research/claudex-loop-delta.md` (keeper 1, read only), `skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/references/dispatch.md` · `.claude/CONTEXT.md` · `review-scoping.md` · `dispatch.md` (named by the member's Done when, owned by the later step)
Owner override of the size-L split rule, kept as one task with two plan steps; this step is reviewed on its own. The file is new and stays off by default, so nothing fires it until the later wiring step.

**Acceptance:** the new file lets a Claude host hand a review to another provider's CLI, off by default, and an empty, timed-out or verdict-less result is never an approval.

### T3 — Cross-model route, build and diagnosis half `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `skills/orchestrator/references/cross-model-route.md` · `skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/references/dispatch.md` · `README.md` · `CHANGELOG.md` · `.claude/CONTEXT.md` · `docs/adr/ADR-010-model-dispatch-role-tiers.md`
Depends-on: T2
Cites: TASK-660 (Build and diagnosis, Opt-in and wiring, and the other Proof boxes), TASK-659, `docs/research/claudex-loop-delta.md` (read only)
Reviewed on its own. It owns the opt-in and wiring boxes, the four real exercises (T2's two review runs are cited as evidence), the consumer check, the permission and dirty-checkout negative, and the README, CHANGELOG and CONTEXT box. G2 rules whether ADR-010 needs an amendment (TASK-660 A2).

**Acceptance:** delegated build and diagnosis handoff are specified, wired from `/orchestrator` and `/task-decomposer`, and exercised on real input with the opt-in on.

## Owner-action checklist

- [ ] No owner action at promote. Pushing v2.23.0 and the `/triage` retarget of TASK-489 stay owner-reserved and outside this sprint.

## Decisions (pre-locked)

- **D1** — Shared files, one owner each in order: `CHANGELOG.md` T1 → T3, `skills/orchestrator/references/review-scoping.md` T1 → T3, and the new `cross-model-route.md` T2 → T3. The three steps run strictly in sequence, so no two build at once.
- **D2** — TASK-660 is size L by owner ruling at intake. At promote the owner chose "Keep one task, two plan steps (Recommended)": one task file, a Plan of T2 and T3 each reviewed on its own, no task file rewritten. The override covers TASK-660 only.
- **D3** — No release between T2 and T3: the route file is unreachable from `/orchestrator` until T3 wires it.

## Assumptions

- **A1** — Claude host only; the route fires on drafts and code, off by default, on by declared repo policy or owner request (owner popups at intake). *Confirm: G2.*
- **A2** — Codex CLI is installed on this host (`codex-cli 0.166.0` at promote) for T2 and T3's real exercises. *Confirm: T2's first real run.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-174-review-rules-and-cross-model-route.md`](logs/SPRINT-174-review-rules-and-cross-model-route.md). Append there, never here (STANDARD §9).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/references/review-scoping.md` | T1, T3 | T1: a section on what every review result states (coverage, limitations, the replaced-behaviour sweep) and the fixer-becomes-builder bullet. T3: pointers to the cross-model route from draft reviews, the skip table and the pass trigger | med | scoped review CLEAR each step; both rules exercised on this sprint's own reviews |
| `skills/orchestrator/references/builder-check.md` | T1 | the reader prompt asks for both statements, so a builder check cannot pass silently | low | scoped review CLEAR on the second pass |
| `skills/orchestrator/references/cross-model-route.md` (new) | T2, T3 | the opt-in route: review (T2), then delegated build, builder-never-grades and diagnosis handoff (T3) | med | two real Codex reviews, a build after a real dirty-worktree refusal, a seeded diagnosis; five gaps fixed in `8229cb31` |
| `skills/orchestrator/references/dispatch.md` | T3 | § Escalation points to the route after two failed attempts | low | scoped review CLEAR |
| `.claude/CONTEXT.md`, `README.md` | T3 | the route and its `cross-model:` opt-in line named in the SSOT and the README | low | consumer check; CONTEXT held at 150 lines |
| `docs/adr/ADR-010-model-dispatch-role-tiers.md` | T3 | Amendment: a declared-policy handoff to another provider's CLI sits beside Decision items 2 and 4 | med | G2 owner ruling; scoped review CLEAR |
| `CHANGELOG.md` | T1, T3 | two `[Unreleased]` entries: the review rules and the cross-model route | low | read against the shipped text |

## Retro

**Verdict.** Both members are done and all 19 Done-when boxes are ticked. Three review rules shipped (coverage and limitations in every review result, the fixer becomes the builder, the replaced-behaviour sweep) and the opt-in cross-model route shipped (review, delegated build, diagnosis handoff), wired from `review-scoping.md` and `dispatch.md`, with ADR-010 amended. Not released: the next call is the owner's.

**Delivery.** Every step was built by Codex in a worktree, reviewed by a scoped Sonnet reviewer and landed by the coordinator. The two entries sit under CHANGELOG `[Unreleased]`. A feature sprint is a MINOR by hand, and v2.23.0 itself is still unpushed.

**Measured.** From `plan_commit^` to HEAD there are 16 commits: 7 are task work (`sprint(174) Tn:`) and 9 are coordinator bookkeeping (`sprint(174):`), for 2 members. System verify off-host on `e7521aff`: `QA-CHECK: 232 pass, 0 fail` and `bun test` 621 pass, 0 fail. The close check printed `check-sprint-by-reference: 6 pass, 0 fail`.

**Retrieval check.** Yes, L-315 missed once. The research note said reviewer briefs asked for neither coverage nor limitations, from one keyword search; the brief already asked what the reviewer declined to judge. It was caught only when the section was read for the G2 design. Bumped on L-315.

**Worked**
- Builder checks before sign-off turned 11 contradictions into design fixes with no Done-when change (T1 4, T2 2, T3 5).
- Each step's review was CLEAR on the first pass.
- The new rules were exercised on this sprint's own reviews, so they were run on real input before they shipped.

**Friction**
- The slip in `936eb3e7`: a `git add` naming a moved path failed as a whole, so the commit carried only the task file under a subject that named more. `git status` showed it afterwards and `1c6a3798` fixed it forward. Bumped on L-045.
- TASK-660's permission negative rests on the text plus one low-stakes denial (the user's global git ignore file). No build-critical permission was denied in five Codex builds.
- The diagnosis exercise was seeded, by owner ruling at G2.
- A cold agent holding only the shipped references found five gaps three scoped reviews had passed; fixed in `8229cb31`. Bumped on L-006.

**Routing**
- Shipped: both entries are already under CHANGELOG `[Unreleased]`; nothing added. The `/humanizer` entry there is from TASK-498 and was left alone.
- Tech debt: TD-312 (CONTEXT at its 150-line cap), TD-313 (G2 gate names no cross-model route), TD-314 (no prose-only rule for pinning tests and the Spec comparand).
- Follow-ups: none filed. The open items are owner actions (push, release) and the three TD rows. "Codex hosts, Claude reviews" stays out of scope by owner ruling at intake, recorded in TASK-660 A3 and the research note.
- Learnings: no new entry. The three candidates were second sightings, counted on L-315 (count 2), L-045 and L-006.
