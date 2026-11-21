---
sprint: 184
slug: trim-lean-flow-for-maintainers-and-plugin-users
owner: Maintainer
last_updated: 2026-11-21
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-184 — Execution Log

> Append-only companion to [`../SPRINT-184-trim-lean-flow-for-maintainers-and-plugin-users.md`](../SPRINT-184-trim-lean-flow-for-maintainers-and-plugin-users.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.


### 2026-11-21 | promote | plan locked, 10 members: TASK-684, TASK-685, TASK-686, TASK-687, TASK-688, TASK-689, TASK-690, TASK-691, TASK-692, TASK-693 (10 plan steps)
Owner rulings, verbatim. Direction: "ignore the workdoo first. we only focus on optimize lean flow first." Intake popups: "≥15% (Recommended)", "Yes, ratchet (Recommended)", "Also compress rows", "Also trim 5 heaviest bodies", "Split them (Recommended)", "Leave medium uncompressed (Recommended)", "15 USD". The ten tasks were filed at 36cffe59 with owner "approve" after two Codex draft rounds. "promote" ran this promote; it is not the checklist sign-off and not G1 or G2.
The coordinator ran `/lean-flow:lean-doc-generator promote`; a worker did the scan and draft, then the writes after the sign-off.
Promote governance checklist, signed by the owner by popup. Answers, verbatim: "Sign, write it (Recommended)" (the checklist and the sprint and log draft; it is not the G1 or G2 sign-off) · L-293 "Retain, place at SPRINT-185 (Recommended)" · L-255 "Retain (Recommended)".
- ☑ L-promotion: two candidates with count 2 and `promoted: no`: L-293 and L-255; every other active entry is count 1 (a parser over the entry blocks and the SPRINT-183 census agree). L-293: retain, a fourth deferral; end condition: place it at SPRINT-185's promote, after T2 and T9 land the homes it would go in (the always-loaded files and the orchestrator references are both being trimmed here); D5 names the launcher for this sprint. L-255: retain; covered by L-246, L-007 and CLAUDE.md's must-FAIL rule, and T5 and T6 exercise it.
- ☑ TD aging: 123 open rows (79 low, 24 minor, 13 medium, 7 trivial, none high; the row-start count and the `status: open` filter agree and the severities sum to 123). 122 are aged against 184; TD-317 and TD-318 newly cross the line, TD-319 (Sprint-182) is younger. Nothing escalates. Disposition: keep all open, no separate sweep. T3 re-reviews about ten rows by fact, T4 compresses, and T5 and T6 address TD-317, TD-318 and TD-319 (their rows resolve at close).
- ☑ TD deletion, §11: none; no row is `resolved`.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` 106 PASS, 1 FROZEN, 7 retained, no FAIL or WARN. At the edge: `.claude/CONTEXT.md` 150 of 150, `.claude/CLAUDE.md` 79 of 80, tokens ~12634 of 12691 (T2); four SKILL.md bodies at 140 of 140 (T8 to T10). CHANGELOG rotation not due (`[Unreleased]` empty; it fires at the owner's v2.27.0). LEARNINGS pointer-collapse is TASK-684's scope and not applied here: 85 promoted entries over the 6-line form, 248 lines over it (the task's Why says 418; no frozen box carries the figure), L-144 the one deliberate non-collapse. No compression at promote.
- ☑ task-file prune, §11: 134 done and cancel files; 101 stamped 181 or earlier, all with a live citation; 25 unstamped, 8 with no citation (TASK-596, 607, 608, 613, 616, 617, 621, 639). Disposition: leave them, as at SPRINT-183.
- ☑ epic rollup currency: none. EPIC-025 is the only active epic; its rows for SPRINT-172 and SPRINT-173 carry `close_commit` and its header is not older than its newest member close. EPIC-005 is proposed (exempt).
- ☑ epic coverage: EPIC-025 has 1 open condition, covered by `→ next slice: workdoo sprint (Sprint B)`; 0 uncovered, no override. This sprint touches no active epic.
- ☑ roadmap coverage: none (no roadmap file).
- ☑ handoff ledger: none live; the one path's latest entry is `spent`.
Sprint number: 184, the maximum in use plus one. Derived with Glob over `docs/sprint/` and `docs/sprint/archive/` and the INDEX lines (newest SPRINT-183, archived); `.claude/worktrees/` is absent.
Composition: 10 members (9 M, 1 S), no epic, no stream. W1 T1 (TASK-684), T3 (TASK-686), T5 (TASK-688), T6 (TASK-689), T7 (TASK-690); W2 T2 (TASK-685, `Depends-on: T1`), T4 (TASK-687, `Depends-on: T3`), T8 (TASK-691, `Depends-on: T7`); W3 T9 (TASK-692, `Depends-on: T8`); W4 T10 (TASK-693, `Depends-on: T5, T6, T7, T8, T9`). Every blocker joins the sprint, so no state change. Commits: status move 1f96c050. `promote-check` run on the real file before `plan locked`.
Baseline gate (off-host, run by the coordinator on 36cffe59 with a clean tree, its own call, exit code 0):
```
gate-remote: ran 36cffe590d5c808f72a9e1539a84a5e8e401279f
bun test rc: 0
bun test: 638 pass, 0 fail (rc 0)
qa-check rc: 0
qa-check: QA-CHECK: 227 pass, 0 fail (rc 0)
```
G2 notes: (1) Proof-time plugin location: the proofs load `--plugin-dir D:/Project/lean-flow` while Codex builds in a worktree, so a skill change is invisible until merged back; G2 rules merge first, then run, with the transcript showing the repo base dir. (2) The coordinator launches every nested `claude -p` and the owner approves each launch (L-293); workers stage only; a per-task share check runs before every run and a run over its share is refused. (3) L-316: before T5 and T8 to T10 build, grep `evals/` for text contracts pinning the touched skill wording and hand the hits to builder and reviewer. (4) T2's homes are unnamed in the task; G2 names each home and the flow that reads it, and a skill-reference home needs a `scope-change` and a Plan edit. (5) T6: the foreign-path marker form is decided at G2, review-round cap 2; its cause is the host locale (`.` matches 3 bytes under UTF-8 and 1 under the C locale), so the fix stays in the eval and T6 stays other G; re-run `promote-check` on this sprint after it lands. (6) T8 creates `skills/triage/references/` and `skills/prime/references/`. (7) T3 needs the owner's per-row approval mid-W1. (8) T10 writes one README and CHANGELOG entry and no version bump; v2.27.0 and the CHANGELOG rotation are the owner's. (9) Tiers: T1, T2, T4, T5, T8, T9, T10 X; T3, T7 P; T6 G (other G). (10) Codex builds and Claude reviews; T8 to T10 reviews are a different model family, worktree-isolated, at most 2 rounds.
G1 and G2 are not yet signed; `gates_signed` is omitted from the frontmatter until both are signed and relayed verbatim.
consequence · T1 · behaviour:low · governance:low
consequence · T2 · behaviour:low · governance:high
consequence · T3 · behaviour:low · governance:low
consequence · T4 · behaviour:low · governance:low
consequence · T5 · behaviour:material · governance:high
consequence · T6 · behaviour:material · governance:high
consequence · T7 · behaviour:material · governance:high
consequence · T8 · behaviour:material · governance:high
consequence · T9 · behaviour:material · governance:high
consequence · T10 · behaviour:material · governance:high
