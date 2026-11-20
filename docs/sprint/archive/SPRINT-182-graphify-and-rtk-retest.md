---
sprint: 182
slug: graphify-and-rtk-retest
owner: Maintainer
last_updated: 2026-11-20
status: closed
plan_commit: f6639005
gates_signed: G1,G2 @ 3ce17ee0
update_trigger: sprint execute/close events
---

# SPRINT-182 — The graphify and RTK Re-test

> **Theme:** Re-test graphify and RTK the way their READMEs intend, on a frozen question set and one workdoo snapshot,
> because the SPRINT-181 tests reached only single-hop questions and the OSS RTK edition. Both verdicts are re-ruled against
> a fixed bar with one shared 8.00 USD cap. It adds no governance machinery, so ADR-053's freeze does not apply, and nothing
> ships without a separate owner ruling.

## Scope

**In:** TASK-676, TASK-677, TASK-678.
**Out (deferred):** TASK-402, 489, 507, 523 and 668 · any skill, hook, manifest or README change · shipping graphify or
RTK (a pass re-files an owner-ruling task) · a global hook of either tool · D:\Project\workdoo.

## Members

- docs/work/todo/TASK-676-build-the-question-set-and-run-harness-for-the-graphify-and-rtk-re-test.md
- docs/work/todo/TASK-677-run-plain-and-graphify-abba-score-blind-and-rule-on-graphify.md
- docs/work/todo/TASK-678-run-rtk-posthook-terse-against-plain-score-blind-and-rule-on-rtk.md

## Plan

### T1 — Build the key-checked question set and the run harness `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/graphify-rtk-retest-questions.md` · `docs/research/graphify-rtk-retest-results.md` · `docs/knowledge-index.md`
Depends-on: none
Cites: TASK-676, `docs/research/graphify-workdoo-questions.md`, `docs/research/graphify-workdoo-test.md`
Six questions with an answer key checked by a second pass, a frozen token formula, and a budget-capped probe, all fixed before any arm runs.

**Acceptance:** the fixture and key are committed with their hash recorded, and a smoke run reports USD, tokens and tool calls with the snapshot unchanged.

### T2 — Run plain and graphify ABBA, score blind, rule on graphify `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/research/graphify-workdoo-test.md` · `docs/research/graphify-rtk-retest-results.md` · `docs/knowledge-index.md`
Depends-on: T1
Cites: TASK-677, `docs/research/graphify-rtk-retest-questions.md`
The first test installed no integration and ran no query. This runs the README's query-first use against a plain baseline, scored blind.

**Acceptance:** a graphify verdict against the bar (correctness at least plain, tokens at most 1.0x plain) with spread and USD reported separately, and the snapshot back at baseline.

### T3 — Run RTK posthook and terse against its own plain pair, rule on RTK `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/research/rtk-trial-verdict.md` · `docs/research/graphify-rtk-retest-results.md` · `docs/knowledge-index.md`
Depends-on: T2
Cites: TASK-678, `docs/research/graphify-rtk-retest-questions.md`, `.rtk/pipeline.toml` (the workdoo snapshot's, cited by box 3, never a lean-flow file)
The OSS edition has no pipeline engine, so this installs the full edition apart from it and compares RTK with its own plain runs.

**Acceptance:** an RTK keep, drop or inconclusive verdict against the bar, the probe deleted, and the snapshot back at baseline.

## Decisions (pre-locked)

- **D1** — Three members in three waves, a linear chain (T1, then T2, then T3). The 8.00 USD cap is shared, and T3 may use only what T2 leaves.
- **D2** — Commits: a task commits as `sprint(182) Tn: …`; coordinator writes (moves, ticks, Log, sprint file) commit as bare `sprint(182):`. T1 to T3 share only the generated `docs/knowledge-index.md` and the results file.
- **D3** — The throwaway probe lives in a root-level `retest-probe/` directory, stays uncommitted until TASK-678 closes, then is deleted; no commit carries it, and every coordinator commit stages by explicit path. It is not added to `.gitignore`. The directory sits outside `scripts/`, `test/` and `evals/`, which `tsconfig.json` includes.
- **D4** — Launcher: T1 to T3 start nested headless `claude -p` runs, which the auto-mode classifier denied at SPRINT-165 and SPRINT-180 (L-293). G2 names the launcher and the approval route; a builder stages the proof only.

## Assumptions

- **A1** — `claude -p` JSON reports USD and tokens. *Confirm: T1 smoke run.*
- **A2** — graphify 0.9.103 (owner-upgraded 2026-11-20, newest stable at least 14 days old) installs project-scoped with `graphify install --project`; without the flag it writes `~/.claude`, which is forbidden. *Confirm: T2 install box.*
- **A3** — The full RTK edition with pipelines exists as a stable release at least 14 days old. *Confirm: T3 first box, else the arm reports "not run".*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-182-graphify-and-rtk-retest.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/research/graphify-rtk-retest-questions.md`, `docs/research/graphify-rtk-retest-results.md` | T1 | Key-checked question set and the run ledger (WHY: fixed before any arm ran) | Low | key check, smoke run |
| `docs/research/graphify-workdoo-test.md` | T2 | Re-test verdict for graphify (WHY: tie 12/12, tokens 1.22× inside the noise) | Low | blind score, snapshot reverted |
| `docs/research/rtk-trial-verdict.md` | T3 | Re-test verdict for RTK (WHY: tie 12/12, USD 1.02× inside the noise) | Low | blind score, snapshot reverted |
| `docs/work/` task moves, `docs/LEARNINGS.md`, `docs/knowledge-index.md`, `TECH-DEBT.md`, `.cap-dispositions` | COORD | Status moves, and L-326 promoted to the host-tooling rule (WHY: count reached 2 at SPRINT-181 close) | Low | gen-index, check-doc-caps |

## Retro

**Retrieval check** — Partly yes. L-279 (check a predeclared threshold against what the comparator already scores) existed, and T1's key check scored 6/6 before any arm ran, which is exactly that measurement. It was logged as a ceiling signal and the arms ran anyway (L-329). L-326, L-045 and L-224 were also hit again.

**Cost** — 3 members (M, M, M), coordinator plus Sonnet workers, no Codex builder. The ledger spent 3.21 of 8.00 USD, about 0.097 USD per box over 33 boxes. The runs cost about 2.5 USD; dispatch figures are labelled estimates. Reported worker tokens sum to 386,230: T1 builder 153,486 and key check 94,674, T2 scorer 68,949, T3 scorer 69,121. SPRINT-181 ran at 0.686 USD per box, but that was session cost, so the two figures are not like for like.

**Worked**
- The key was fixed and checked by a second blind pass before any arm ran, and every scorer was blind with tool names redacted.
- The snapshot returned to its baseline (HEAD and `--ignored` status) after every run, and the ledger cap refused nothing.
- Each owner popup (stream-json, drop the skills flag, "Test what v1.1.0 supports") was logged as a scope-change entry before the box wording moved.
- The kept intake-draft-check cell fired once on the TASK-676..678 draft (Fable high plus a Codex blind pair). Fable found 4 real issues Codex missed, including the High on posthook Read rules; Codex rated two shared ones higher. That is cell evidence, and no trial bookkeeping is needed.

**Friction**
- Both tools tied on correctness. The key check and every arm scored full marks in both re-tests, so the "harder" questions still did not discriminate, and the verdicts fell on token and USD noise: graphify 1.22× tokens and 0.89× USD, RTK 1.02× USD, both inconclusive.
- graphify followed the README and its hooks fired, but the agent ran one `graphify query` in 13 Bash calls.
- RTK v1.1.0 and v1.2.0 have no Claude Code PostToolUse processor, so the Read/Grep compression the README sells was untestable. The owner ruled "Test what v1.1.0 supports", and T3 tested the Bash rewrite and terse prose only.
- A tick chain failed silently. TASK-678 box 2's tick reddened `check-layers-completeness` (member-layers-incomplete: the box named workdoo's `.rtk/pipeline.toml`), but the chain's output was redirected to /dev/null. The `&&` chain stopped, a later `git add` over a missing done/ path aborted, and commit 46295349 carried one tick. It was fixed by declaring the path on T3's Cites line (c9a755ef).
- The layers checker reads another repo's cited path as a lean-flow file. Promote hit it with workdoo's `.claude/CLAUDE.md`, T3 with `.rtk/pipeline.toml`.
- TASK-677's last `record-line tick` ran past 120 s (backgrounded, finished green): L-326's third sighting, after the rule was promoted at this sprint's promote.
- `graphify install --project` also refreshed the global `~/.claude/skills/graphify`, and RTK v1.1.0's project `rtk init` registers no hooks (`rtk init --show` reads only global settings). Both are already in `graphify-rtk-retest-results.md`.
- `docs/research/graphify-rtk-retest-questions.md` is 167 lines against the §2 soft cap of 130.

**Pattern candidate**
- L-329 new: a re-test whose key check already scores full marks cannot discriminate on correctness, so the ceiling should gate the run. Count 2 (SPRINT-181 graphify 6/6, SPRINT-182 12/12), `promoted: no`; placed at the next promote.
- Count bumps: L-326 (now 3), L-045 (+1), L-224 (+1).

**Routed**
- Shipped: none. Tech debt: TD-319. Follow-ups: none (owner ruling "None (Recommended)"). Learnings: L-329 new; L-326, L-045 and L-224 bumped.
- Verdicts: graphify inconclusive, no ship task. RTK inconclusive, maintainer-environment only.
- §2 cap: a `retain` row in `.cap-dispositions` for the questions fixture, whose commit hash the results file records.
- Release: none, nothing shipped.
