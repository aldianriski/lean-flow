---
id: TASK-677
title: "Run plain x2 and graphify x2 (ABBA) in the workdoo snapshot, score them blind, and rule on graphify"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-676]
---

# TASK-677 — Run plain x2 and graphify x2 (ABBA) in the workdoo snapshot, score them blind, and rule on graphify

## Why

The first test installed no integration, told its arm to read GRAPH_REPORT.md first, and ran no query, so it did not test the README's query-first use. The plain runs here are the baseline that TASK-678 also compares against.

## Done when

- [ ] The plain arm (no graphify files) runs twice and the graphify arm runs twice, in the order plain, graphify, graphify, plain; each run is a fresh `claude -p`, and the snapshot is reset to its baseline before each.
- [ ] The graphify arm is installed as its README says: `graphify update` (code-only; build time and node/edge counts recorded) with a temporary `.graphifyignore` for `.claude/worktrees/`, then `graphify claude install --project`; the hook reaching the agent is shown by at least one `graphify query` call in each graphify run's tool log.
- [ ] All 24 answers (6 questions x 4 runs) are scored by a fresh Sonnet blind to arm, against the committed key; the coordinator holds the label map.
- [ ] `docs/research/graphify-rtk-retest-results.md` holds per-run correctness, reported tokens (the unit for the bar), cache-aware USD beside it, tool-choice counts, wall time and the spread between each arm's two runs; the ledger total, key worker and scorer included, stays under 8.00 USD.
- [ ] `docs/research/graphify-workdoo-test.md` states the graphify verdict against the bar (correctness at least equal to plain, tokens at most 1.0x plain), with spread and USD reported separately.
- [ ] If graphify passes, a new backlog task re-files the owner's earlier "Ship in lean-flow" ruling (like cancelled TASK-675) citing this evidence; if it fails or is inconclusive, no ship task is filed and the note says so.
- [ ] Read-through of both notes: every figure traces to the results file.
- [ ] The snapshot's HEAD and `git status --porcelain --ignored` equal the baseline, the temporary `.graphifyignore` and the graphify project files are gone, no ~/.claude hook was added, the throwaway probe is deleted and D:\Project\workdoo is untouched.
- [ ] Negative: if the ledger reaches 8.00 USD before the 4 runs finish, the remaining runs do not start, the note records the result as inconclusive, and no verdict is extrapolated from partial data.
- [ ] Negative: a graphify run with no `graphify query` call in its log is recorded as "hook did not reach the agent" and is not counted as evidence against graphify's query-first claim.
- [ ] Negative: a result inside the noise (the two runs of an arm differ by more than the gap to plain) is written as inconclusive, never as pass or fail.
- [ ] Negative: no skill, hook, manifest or README is changed by this task; a ship decision goes only to a re-filed task.

## Touches

D:\Research\workdoo (temporary install files, reverted); docs/research/graphify-workdoo-test.md; docs/research/graphify-rtk-retest-results.md (new, retained for 678); at most one new docs/work/backlog/ file; the throwaway probe (deleted). If `graphify claude install --project` is unsupported, stop and ask; never use the global form.

## Assumes

- graphify 0.8.13 supports `claude install --project`.
- The 8.00 USD cap is shared with TASK-678, which may use only what this task leaves.
- The ship ruling is the owner's (J2).

## Tracker

Owner popups 2026-11-20 (graphify re-test, Harness, Questions, Budget, Split); owner ruling "if it passes, the earlier Ship in lean-flow ruling applies again via a re-filed task".
