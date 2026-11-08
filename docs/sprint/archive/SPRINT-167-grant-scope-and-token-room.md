---
sprint: 167
slug: grant-scope-and-token-room
owner: Maintainer
last_updated: 2026-11-08
status: closed
plan_commit: 8fe3592b
gates_signed: G1,G2 @ ea0e636d
close_commit: a64bde11
update_trigger: sprint execute/close events
---

# SPRINT-167 — Grant Scope and Token Room

> **Theme:** two small debts left by SPRINT-166. `/diagram` asks for plain `Bash` though it needs only read-only git, and the always-loaded context has 3 tokens of headroom. Both are fixed without a release, a push or a budget raise.

## Scope

**In:** narrow `/diagram`'s Bash grant and move its SECURITY.md row (TASK-622, TD-301); replace CONTEXT.md text its satellites already hold with pointers (TASK-623, TD-302).
**Out (deferred):** any release or push; raising the token budget; changing CONTEXT.md § Gates; TASK-621, which sits outside the sprint.

## Members

- docs/work/todo/TASK-622-scope-diagram-bash-grant-to-read-only-git.md
- docs/work/todo/TASK-623-win-back-token-budget-by-deduping-context-md.md

## Plan

### T1 — Scope /diagram's Bash grant to read-only git `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/diagram/SKILL.md` · `SECURITY.md` · `CHANGELOG.md`
Depends-on: none
Cites: TASK-622 · TD-301
A prose "read-only git only" is not a grant, and SECURITY.md lists the skill as unscoped. Scoping to the two git commands the skill names makes the limit real and moves its row.

**Acceptance:** under only the scoped grant, `git rev-parse HEAD` and `git status --short` run, a `git commit` is not pre-approved, and SECURITY.md lists `diagram` as scoped.

### T2 — Replace CONTEXT.md duplicates with pointers `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `.claude/CONTEXT.md`
Depends-on: none
Cites: TASK-623 · TD-302 · TD-006 · L-008 · `orchestrator/SKILL.md` · `night-run.md` · `check-doc-caps.ts` · `scripts/lib/token-budget.txt`
Three passages (`overnight` name, Continuation contract, Authority) restate facts that `orchestrator/SKILL.md` and `night-run.md` already hold. Pointers return room without touching the budget file or § Gates, which keeps TASK-621's measuring basis stable.

**Acceptance:** `check-doc-caps.ts` prints token-budget N ≤ 12440 against 12691, the budget file is unchanged, § Gates has no diff, and each removed passage's phrase greps to the section its pointer cites.

## Owner-action checklist
none

## Decisions (pre-locked)
- **D1** — Order T1 then T2; no dependency. Disjoint files, so no shared-file rule.
- **D2** — No release, no push (owner constraint). The CHANGELOG-visible change goes under `[Unreleased]`.
- **D3** — TASK-623 must not change CONTEXT.md § Gates, and `scripts/lib/token-budget.txt` stays untouched.
- **D4** — TASK-623 review cap is 2 rounds. A candidate outside § Gates beyond the three passages goes back to the owner.

## Assumptions
- **A1** — A scoped `Bash(git rev-parse *), Bash(git status *)` pair parses in frontmatter, as release-patch's `Bash(git diff *)` entries show (`skills/release-patch/SKILL.md:5`). *Confirm: T1's real-input box.*
- **A2** — The three CONTEXT.md passages are about 830 tokens, so a 250-token win is reachable. *Confirm: T2's check-doc-caps run.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-167-grant-scope-and-token-room.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/diagram/SKILL.md` | T1 | grant scoped to `Bash(git rev-parse *), Bash(git status *)`; the prose limit is now enforced | low | headless probe, with and without the change; scoped review |
| `SECURITY.md` · `CHANGELOG.md` | T1 | `diagram` moved to the scoped-Bash row; `[Unreleased]` bullet | low | row greps; scoped review |
| `.claude/CONTEXT.md` | T2 | three passages its satellites hold became pointers; headroom 3 → 275 tokens | med | doc-caps `~12416 <= 12691`; fact-to-hit table; scoped review |

## Retro

**Retrieval check:** two misses, both this stage-misses-a-fact case. TASK-621 records them against the bundle.
- Coordinator: `/prime` read § Gates, and the orchestrator read § Model tiers, but nobody opened § Sprint model. So the move to `in_progress/` went out under `docs(task):`, the `consequence ·` lines used free text, and no `review ·` lines were logged. The gate caught all three across two QA_FULL runs (4 fail, then 2).
- Promote worker: it froze T2's Plan block without running `check-layers-completeness`, so `Cites:` lacked four files the Done-when names. That surfaced at the first merge-check.

**Cost:** coordinator on Opus. Sonnet workers did intake, promote, two G2 builder checks, two builds and two reviews. There were two headless probe runs (~$0.18) and three off-host QA_FULL runs. USD per box is not available at close.

**Worked**
- The G2 builder checks found no contradictions, and their factual questions changed the design before the build: the probe isolates host settings, and the Authority pointer cites the heading that actually exists.
- The T1 probe discriminates. The control arm with plain `Bash` made a real commit, and the change denied the same command.
- Both builds ran in parallel, isolated worktrees and merged without conflict. Both reviews were clean in one round.
- T2 won back 272 tokens with § Gates and the budget file untouched.

**Friction**
- The coordinator's commit subject cost a rebuild of unpushed history (owner ruling). Trees were identical, and the old history is kept on `backup/sprint-167-pre-rebuild`.
- Nine leftover worktrees with uncommitted work stay; TASK-624 owns the review.

**Pattern candidate:** L-294 now at count 2, and due a promotion ruling at the next promote. L-238 (count 4) and L-224 (count 10) recur despite being promoted.
