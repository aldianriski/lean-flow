---
sprint: 176
slug: coordinator-reference-for-lanes
owner: Maintainer
last_updated: 2026-11-15
status: closed
plan_commit: 411b135b
close_commit: b2714ca1
gates_signed: G1,G2 @ 1e254241
update_trigger: sprint execute/close events
---

# SPRINT-176 — A Coordinator Reference for Multi-Session Work

> **Theme:** Ship a generic coordinator reference for multi-session work, taken from the bloodlines coordinator-and-lane run (2026-11-14/15). It carries a scoped one-session rule, cross-lane shared-file hunk approval and per-lane id booking that extends L-143, then a replay of the real run against it.
> Consumer evidence (ADR-053 §4), prose only: no script, checker or ledger field.

## Scope

**In:** TASK-662 (the reference and the scoped rule) · TASK-663 (hunk approval and id booking) · TASK-664 (the replay proof).
**Out (deferred):** TASK-367 (owner ruling 2026-11-15, "Keep out (Recommended)": its Touches and Done-when are fixed first, and it goes in a later sprint) · EPIC-025 Sprint B (workdoo) · any script that derives ids.

## Members

- docs/work/todo/TASK-662-coordinator-reference-and-scoped-rule.md
- docs/work/todo/TASK-663-cross-lane-hunk-approval-and-id-booking.md
- docs/work/todo/TASK-664-coordinator-reference-replay-proof.md

## Plan

### T1 — Add the coordinator reference and scope the one-session rule `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/coordinator.md` · `skills/orchestrator/SKILL.md` · `.claude/CONTEXT.md` · `README.md` · `CHANGELOG.md` · `docs/LEARNINGS.md` · `docs/knowledge-index.md` · `skills/orchestrator/references/dispatch.md`
Depends-on: none
Cites: TASK-662, `references/dispatch.md`, `scripts/gen-index.sh`
Multi-session coordination has no shipped text and the one-session rule is in no shipped surface. The last four Layers are the wiring-check reads, each changed or recorded "no change needed"; prune unused tokens at G2. Per-task meta: its `## Assumes` line "Builds after EPIC-025 Sprint B closes" is superseded by D2.

**Acceptance:** the reference exists and is reachable from the orchestrator SKILL.md pointer and CONTEXT Streams.

### T2 — Add cross-lane hunk approval and id booking, extending L-143 `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/coordinator.md` · `.claude/CONTEXT.md` · `skills/task-decomposer/references/task-file.md` · `CHANGELOG.md`
Depends-on: T1
Cites: TASK-663, TASK-662, `skills/orchestrator/SKILL.md`, `references/dispatch.md`, `.claude/CLAUDE.md`
L-143 is right inside one tree and blind to other lanes; the coordinator's booking prevented a real collision. Per-task meta: its `## Assumes` line "Builds after EPIC-025 Sprint B closes" is superseded by D2.

**Acceptance:** both sections exist and the single-tree id derivation is unchanged.

### T3 — Replay the real lane briefs and id allocation against the reference `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/work/evidence/TASK-664/` · `TECH-DEBT.md`
Depends-on: T1, T2
Cites: TASK-664, `coord.txt`, `mobile.txt`, `web.txt`, `extract.ts`
A behaviour shipped spec-only is the L-007 anti-pattern; the reference is credible only if the real run fits it. Evidence home resolved to `docs/work/evidence/TASK-NNN/` (STANDARD §11, ADR-056), confirm at G2; `TECH-DEBT.md` only for gap TDs.
Box 1's evidence copy is done early, in wave 1, by the coordinator, from the coordinator session's scratchpad digests (`coord.txt`, `mobile.txt`, `web.txt`; `extract.ts` re-extracts them from the bloodlines project transcripts). Its `## Assumes` build-after line is superseded by D2.

**Acceptance:** the message-type table has no unaccounted in-scope requirement, and the produced brief and allocation are compared with the real ones.

## Decisions (pre-locked)

- **D1** — Shared files, single owner and commit order: `coordinator.md` T1 creates, T2 extends; `CONTEXT.md` T1 edits § Streams, T2 edits § Gates (separate hunks); `CHANGELOG.md` T1 then T2, one entry each. Stage per hunk (`git add -p`), read `git diff --cached`. Commits are `sprint(176) Tn: …`; only the promote moves are bare.
- **D2** — Owner ruling 2026-11-15, verbatim "Frozen 2.23.0 worktree (Recommended)" (EPIC-025 D9, `d170295e`): Sprint B loads lean-flow from a frozen worktree, so TASK-662..664 may build now. Each task's `## Assumes` line "Builds after EPIC-025 Sprint B closes" is superseded; the task files are not rewritten.
- **D3** — T1 and T2 change shipped skills, so each takes a Codex review before sign-off, at most 2 rounds (the tasks' G2 cap). Builder choice is ruled at G2. T3 is Tier X.
- **D4** — Owner ruling 2026-11-15, verbatim "Net-zero rule (Recommended)": T1 and T2 add no new line to the always-loaded docs (`.claude/CONTEXT.md` 150 of 150, `.claude/CLAUDE.md` 79 of 80). They append to existing bullets, about 440 characters in total; the SKILL.md pointer replaces an existing line (140 of 140). If a cap check fails mid-build, stop and ask.

## Assumptions

- **A1** — No script derives a next id. *Confirm: T2 at G2, by reading the id-parsing scripts (a first grep found only the conformance engine's retention read of the highest id).*
- **A2** — Both always-loaded additions fit the token-budget headroom (about 170 tokens). *Confirm: `check-doc-caps.ts` at T1 and T2.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-176-coordinator-reference-for-lanes.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/references/coordinator.md` | T1, T2 | New shipped reference: lane brief, status check, relayed rulings, lost reports (T1); shared files across lanes and id booking (T2). Multi-session work had no shipped text. | Low | Codex R1/R2 CLEAR (T1, T2); replay, 0 gaps (T3) |
| `skills/orchestrator/SKILL.md` | T1 | One pointer line, net-zero, so the reference is reachable from the entry skill. | Low | `check-doc-caps.ts` 140 of 140 |
| `skills/orchestrator/references/dispatch.md` | T1 | Cross-reference opening the worktree dispatch protocol, pointing separate lane sessions to the reference. | Low | wiring read |
| `skills/task-decomposer/references/task-file.md` | T2 | Rule 4 says a lane derives its task ids inside its booked range; single-tree derivation unchanged. | Low | Codex R2 CLEAR |
| `.claude/CONTEXT.md` | T1, T2 | Streams bullet carries the scoped one-session rule and the pointer (T1); Gates L-143 grain gains the multi-lane clause (T2). Both appended, net-zero lines. | Low | `check-doc-caps.ts` 0 FAIL; token budget 12683 of 12691 |
| `README.md` | T1 | One line naming the coordinator reference (user-visible change). | Low | wiring read |
| `CHANGELOG.md` | T1, T2 | Two [Unreleased] entries, one per task (TASK-662, TASK-663). | Low | read at close |
| `docs/LEARNINGS.md` | T1 | L-317 and L-318 filed from the bloodlines consumer evidence; L-317's `related` repointed at a live id. | Low | system verify `learnings dangling refs` |
| `docs/knowledge-index.md` | T1 | Regenerated by `sh scripts/gen-index.sh` with the LEARNINGS change (derived view). | Low | qa-check index lint |
| `docs/work/evidence/TASK-664/` | T3 | Retained inputs (redacted lane briefs, approvals, allocations) and the replay table: 20 rows, 0 gaps. | Low | read-through; coordinator self-review |

## Retro

**Verdict.** TASK-662, TASK-663 and TASK-664 are done, every box ticked. lean-flow now ships a generic coordinator reference (`skills/orchestrator/references/coordinator.md`, seven sections) for multi-session work, with the one-session rule scoped to a stream, cross-lane shared-file hunk approval and per-lane id booking that extends L-143. Replaying the real bloodlines run against it found 0 gaps. System verify, off-host `QA_FULL=1` on `7e833382`: `QA-CHECK: 232 pass, 0 fail`, `bun test` 621 pass, 0 fail.

**Delivery.** Claude Sonnet workers built all three, serially (W1 T1, W2 T2, W3 T3). Codex reviewed the two shipped-skill tasks: T1 R1 NOT CLEAR (3 High, fixed), R2 CLEAR; T2 R1 NOT CLEAR (1 High, both maxima omitted the coordinator's own tree, fixed), R2 CLEAR. T3 got self-review (Tier X). No release is cut here: this is a feature sprint, so it goes out as a MINOR by hand.

**Cost.** Coordinator plus 3 Sonnet builders and 4 Codex review rounds; no token or dollar figure is recorded in the Log, so unavailable. By commit count, from `plan_commit^` to HEAD before this close: 12 commits, 5 task work (`sprint(176) Tn:`) and 7 coordinator bookkeeping (`sprint(176):`), for 3 members.

**Retrieval check.** Yes, twice. L-234 (a scope-change entry's paths must sit in Layers or Cites) fired again at system verify, now its fifth sighting. And the retired id L-042 was cited as a live one: CONTEXT's Streams bullet still names it, and L-317 copied it into `related:` (new L-319).

**Worked**
- The G2 builder-check settled 6 contradictions and 12 questions in the design before any build, none to the owner.
- Codex R1 caught real defects in both shipped tasks (a non-verbatim CONTEXT rule, a missing evidence table, an omitted coordinator tree in the id maxima), each fixed in place within the 2-round cap.
- T3's worker stopped `blocked` when the 900-character digest cut hid the reply-requested field, instead of guessing; the coordinator re-extracted whole briefs and resumed.
- The net-zero rule (D4) held: no always-loaded file gained a line.

**Friction**
- The first system verify went red with 2 FAILs: L-317's dangling `related: L-042`, and the T1 scope-change naming `scripts/gen-index.sh` outside Layers and Cites. Both were authoring slips a first-pass check would have caught.
- T1's `consequence` and `review` lines were recorded after the T1 commit, so the record trailed the work (logged in the T1 entry).
- The always-loaded token budget ended at 12683 of 12691 (8 tokens of headroom) after T2.
- The coordinator launched the workdoo Sprint B session twice with a broken path (a printf `\v` escape in a `.cmd` launcher) before the third launch worked.

**Pattern candidate** (surface to user, `docs/LEARNINGS.md`)
- Escape-layer corruption now has three sightings (L-266, count 3), the first outside source code: a launcher script. Already promoted to the edit-safety rule; the rule's scope may need to name launchers.

**Routing** (filed above, STANDARD §10)
- Shipped: CHANGELOG [Unreleased] already carries both entries (TASK-662, TASK-663), read against the diff and the reference's sections; T3 is retained evidence with no user-visible change, so no third entry.
- Tech debt: TD-315 (always-loaded token budget at 8 tokens of headroom; TD-312 covers CONTEXT's line cap and TD-313 the SKILL.md cap, neither the token budget). No gap TD from T3.
- Follow-ups: TASK-665 (fix TASK-367's stale Touches and Done-when, `origin: close-retro`), a condition of the owner's "Keep out" ruling.
- Learnings: L-319 new (a live doc can cite a retired id; resolve `related:` ids against the ledger). Bumped: L-234 to count 5 (scope-change outside Layers) and L-266 to count 3 (the `.cmd` launcher escape). The late T1 review lines are a one-off against L-268's inverse shape, ruled no entry.
- Handoff reconciliation: no `handoff` entry in the log, so nothing to make `spent`. No `epic:` on this sprint, so no rollup.
