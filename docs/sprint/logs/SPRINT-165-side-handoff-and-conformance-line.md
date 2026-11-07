---
sprint: 165
slug: side-handoff-and-conformance-line
owner: Maintainer
last_updated: 2026-11-07
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-165 — Execution Log

> Append-only companion to [`../SPRINT-165-side-handoff-and-conformance-line.md`](../SPRINT-165-side-handoff-and-conformance-line.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-07 | promote | plan locked, governance signed, two members: the EPIC-024 row 1 host sprint
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: L-290 due (count 2), promoted to `docs/LEARNINGS.md` § Durable rules › consumer-side, disposition: merge. The other 45 `promoted: no` entries are at count 1.
- ☑ TD aging: 113 open rows, none `high` (67 low, 24 minor, 14 medium, 8 trivial). 108 are aged ≥ 3 sprints and were held; nothing auto-escalates to P1.
- ☑ doc-aging, §11: 26 closed task files with no live citation deleted in `d0a9752a` (SPRINT-148 to 162; two selectors agreed on the 25 up to SPRINT-161, and TASK-603 was read on its own). SPRINT-164's promote reported nothing due while 25 of them were already past the limit and uncited today. ☑ doc-aging, §2: no breach (`check-doc-caps`).
- ☑ epic rollup currency: no active epic. ☑ epic coverage: none (EPIC-024 stays `proposed`, owner ruling). ☑ roadmap: none. ☑ handoff ledger: none.
Composition: TASK-614 and TASK-615 (ready, P2, filed for EPIC-024 row 1); single stream. Sizes S, S; no `L`. TASK-613 is not a member. Status moves in `bc41dc66`.
G1 and G2 are not signed; `/orchestrator` signs them.

### 2026-11-07 | progress | opt-in gate green off-host at the recorded plan_commit
`gate-remote.ts` ran `edd24ef5`: `QA-CHECK: 460 pass, 0 fail`, `bun test` 589 pass, 0 fail. The trial head showed 504 pass, so the tally fell by 44 with the 26 task-file deletions in `d0a9752a`; 0 fail held, and the per-leg cause of the drop was not traced. A first launch ran nothing (`LF_GATE_HOST` unset), and its exit 0 was a pipe's; only the run above counts.

### 2026-11-07 | progress | builder check run on the two G2 designs before sign-off
builder-check · T1 · 1 contradiction · 1 question · settled: the design's evidence map was off by one box and now names the CHANGELOG entry and TD-298 row for box 4; the UNKNOWN fixture stays as a pin of existing behaviour; the checker reads the ledger whatever the sprint state and fails it only on UNKNOWN, so A1's wording is wrong and a ledger answer would change its header comment and shipped text, not its logic. The stub home stays open by owner ruling
builder-check · T2 · 3 contradictions · 5 questions · settled: `qb_checkpoint` prints its own verdict and exits, so the line prints before both verdict sites through one function; a setup failure or an empty engine output reads as not run; box 3 compares two separate selections from a `QA_FULL=1` run and reports N of 0 as not discriminating; the line names full or reduced spec, since the default profile's 0 would read as a clean sweep. The truncation question was read as fact from the Done when's "directly before the verdict line", so no intent question reaches the owner

### 2026-11-07 | progress | batch G1 and G2 signed by the owner (popup) on `0a106887`
G1, full checklist (`origin: manual`): both tasks size S, scope as promoted, out of scope a release, TASK-613, the trial branch, `scripts/qa-verdict.ts` and `scripts/gate-remote.ts`. Business facts: `docs/product/requirements.md` says `/handoff` ends a session and the next `/prime` resumes it, which T1 extends and does not change.
G2: preflight CLEAR, T1=0, T2=1, so sequential on the shared tree with no worktree; the coordinator commits and owns the sprint file, this log, ticks and moves. Both builders are Sonnet on `general-purpose` with `/tdd` and the worker contract.
T1: pin the two fixture runs; the builder returns `blocked` with one question on the stub home before any edit, naming `spec/STANDARD.md` § 2 and `handoff-reconciliation.md`, which call the ledger a no-sprint fallback; a path outside `Layers:` takes a `scope-change` first. Then fixtures, skill text in both files under one condition (L-290), and a pinned-clone proof on a scratch repo whose prompt never names the rule. Review: Codex, at most 2 rounds.
T2: one function, called directly before both `QA-CHECK:` prints, prints `conformance: N informational finding(s), <full|reduced> spec, not in the tally`, or `conformance: not run, no informational count` when the leg produced no count. A new TypeScript harness holds the must-FAIL fixtures. Review: one Sonnet reviewer.
`check-verify-reaches`: 0 mechanical `Verify:` clauses, so every box is a judgment tick or a stated query on an artifact.
consequence · T1 · behaviour:material · governance:low
consequence · T2 · behaviour:low · governance:low

### 2026-11-07 | progress | T1 build dispatched
worker · T1 · a7068354b1a6cc1d6 · sonnet · none

### 2026-11-07 | scope-change | T1 adds the spec and reconciliation text after the owner's stub-home ruling
T1's builder (`a7068354b1a6cc1d6`) returned `blocked` with one question before any edit, and the owner ruled by popup: a handoff unrelated to the active sprint goes to the root `HANDOFF-LEDGER.md`, with the spec edits inside T1. Unrelated means the session's focus names no member task of the active sprint, and `/handoff` asks when unsure.
What broke: `spec/STANDARD.md` § 2 and `skills/lean-doc-generator/references/handoff-reconciliation.md` call the ledger a no-sprint fallback, and neither was in T1's `Layers:`. Impact: T1's `Layers:` gains those two and `spec/CHANGELOG.md`. No Done-when text changes. G2 re-confirmed by the same popup. No ADR governs the ledger's trigger; under §15 no verdict moves, so the bump is not MAJOR.

### 2026-11-07 | progress | T1 built: side stubs go to the ledger, proof passed, Codex clear in 2 rounds
Commits `8d099eda` and `750963c0`. Pin: fixtures 27 PASS and store readers 21 pass before; 31 PASS and 21 pass after, the original 27 unchanged. The checker's logic did not change, only its comments.
Return path, worker `a7068354b1a6cc1d6`, same id throughout. Return 1: `blocked`, one question on the stub home, no edits made. The owner ruled by popup, and the answer went back by SendMessage. Return 2: `blocked`, built but the proof not run, because the classifier denied the builder's nested `claude -p` as "Create Unsafe Agents". The builder did not work around it. The coordinator did not launch until the owner approved the three runs by popup. A third SendMessage carried Codex's fixes. Return 3: `ready`.
Proof on pin `8d099eda`, 1.65 USD, three headless runs with no bypass flag, `--verbose` added since stream-json requires it, prompts naming no rule. A: stub in the root ledger, sprint Log untouched. A2: `Handoff:  sprint log: none outstanding · HANDOFF-LEDGER.md: live`. B: stub in the sprint's Log, ledger untouched. Not re-run after `750963c0`, which changes step 2 and the spec version; the resume path of step 2 has no run. Left outside the tree by the proof: `D:\Research\t1-proof` and two `handoff-*.md` in the OS temp dir.
Conformance engine fixtures all green on the T1 edit, from the builder's background run. Gate on T1 runs at system verify.
Spec: the builder chose PATCH and Codex argued MAJOR. The coordinator ruled MINOR from §15's own test and MINOR row, 0.20.0, so the owner's popup "not MAJOR" holds. Not traced to an owner ruling beyond that.
Left unchanged, Codex item 6 OK: `sprint-log.md.template`'s "No sprint to log into" line and `night-run.md` row 3.
review · T1 · Codex read-only (a different model from the writer), 2 rounds, 2 findings fixed by the same worker · behaviour:material · governance:low

### 2026-11-07 | progress | T2 build dispatched
worker · T2 · ad846f93816158134 · sonnet · none
