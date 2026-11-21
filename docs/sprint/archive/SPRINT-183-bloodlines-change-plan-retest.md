---
sprint: 183
slug: bloodlines-change-plan-retest
owner: Maintainer
last_updated: 2026-11-21
status: closed
plan_commit: 4b8f3b40
close_commit: 078967f9
gates_signed: G1,G2 @ 11afc10f
update_trigger: sprint execute/close events
---

# SPRINT-183 — The graphify and RTK Change-Plan Re-test on a Big Repo

> **Theme:** Re-test graphify and RTK a third time on real change-planning requests taken from the git history of a big
> repo, scored against the real diff, because both Q&A re-tests tied at the ceiling (L-329). The ceiling now gates the run,
> and one 32.00 USD cap covers all five tasks. It adds no governance machinery, and nothing ships without a separate owner ruling.

## Scope

**In:** TASK-679, TASK-680, TASK-681, TASK-682, TASK-683.
**Out (deferred):** any skill, hook, manifest or README change · shipping graphify or RTK (a pass re-files an owner-ruling task) · a global hook of either tool · any change to the live bloodlinesfamilia repo.

## Members

- docs/work/todo/TASK-679-select-6-real-bloodlinesfamilia-commits-as-change-plan.md
- docs/work/todo/TASK-680-write-blind-descriptions-and-keys-for-the-6.md
- docs/work/todo/TASK-681-rebuild-the-throwaway-run-probe-and-gate-the.md
- docs/work/todo/TASK-682-prepare-the-graphify-and-rtk-arms-on-a.md
- docs/work/todo/TASK-683-run-6-scenarios-x-plain-graphify-and-rtk.md

## Plan

### T1 — Select 6 real commits as change-plan scenarios and audit each parent for leaks `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/bloodlines-retest-scenarios.md` · `docs/research/graphify-rtk-retest-results.md` · `docs/knowledge-index.md`
Depends-on: none
Cites: TASK-679, L-329
Nine candidate commits are audited over the whole parent tree and key-aware, six survive with a scrub list, and the export recipe is tried once. Leaks would make every arm look good for the wrong reason.

**Acceptance:** six scenarios with sha, parent, type and scrub list, an export that shows one commit and an empty baseline status, and the 32.00 USD ledger opened.

### T2 — Write blind descriptions and keys and freeze the rules `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/bloodlines-retest-scenarios.md` · `docs/research/graphify-rtk-retest-results.md` · `docs/knowledge-index.md` · `.cap-dispositions`
Depends-on: T1
Cites: TASK-680, L-329
Each scenario gets a leak-free request and an objective key, and the scoring, adoption and noise rules are committed with their hash before any run so the verdict cannot be tuned afterwards.

**Acceptance:** six blind-checked descriptions with keys and one commit holding every frozen rule, its hash recorded.

### T3 — Rebuild the run probe and gate the test on a plain pre-screen `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/bloodlines-retest-scenarios.md` · `docs/research/graphify-rtk-retest-results.md` · `docs/knowledge-index.md`
Depends-on: T2
Cites: TASK-681, L-329
The probe is rebuilt uncommitted. Two plain runs on the hardest-looking scenarios gate the test: a plain mean at the ceiling stops it before any arm is built.

**Acceptance:** a recorded gate verdict (proceed or STOP with the sentence written), the pre-screen priced, and the noise floors recomputed.

### T4 — Prepare the graphify and RTK arms and price the 18-run set `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/graphify-rtk-retest-results.md` · `docs/knowledge-index.md`
Depends-on: T3
Cites: TASK-682, `.rtk/pipeline.toml` (the bloodlines export's, written by the arm and cited by box 2, never a lean-flow file)
Both arms must be shown to fire on this repo before money is spent on them, and the real run price is the second gate. An affordable projection proceeds; only a non-fit asks.

**Acceptance:** each arm installs and removes back to the baseline, three smokes are priced, and the paid-set projection fits the remaining cap or the owner is asked.

### T5 — Run 6 scenarios x 3 arms, score blind and rule on graphify and RTK `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/research/graphify-rtk-retest-results.md` · `docs/research/graphify-workdoo-test.md` · `docs/research/rtk-trial-verdict.md` · `docs/knowledge-index.md` · `docs/work/backlog/`
Depends-on: T4
Cites: TASK-683, L-329
Paired scenario blocks give six independent comparisons per tool. The ship decision stays the owner's (J2).

**Acceptance:** a keep, drop or inconclusive verdict per tool under the frozen rules, the ledger at most 32.00 USD, the exports and probe deleted, and the live repo unchanged.

## Decisions (pre-locked)

- **D1** — Five members in five waves, a linear chain (T1 to T5). One 32.00 USD cap is shared: T1 2.50, T2 2.50, T3 5.00, T4 1.50 and T5 the rest, 19.00 with a 1.50 hold-back.
- **D2** — Commits: a task commits as `sprint(183) Tn: …`; coordinator writes (moves, ticks, Log, sprint file) commit as bare `sprint(183):`. All five tasks share the results file and the generated `docs/knowledge-index.md`, so regenerate the index once per task commit.
- **D3** — The throwaway probe lives in a root-level `retest-probe/`, uncommitted until T5 deletes it; every coordinator commit stages by explicit path and it is not added to `.gitignore`. It sits outside `scripts/`, `test/` and `evals/`, which `tsconfig.json` includes.
- **D4** — Launcher (L-293): the coordinator session launches every nested `claude -p` through the probe and the owner approves each launch in manual mode. Workers write files only.
- **D5** — Two stops end the chain early. If T3's gate says plain aces the scenarios, T4 and T5 leave by their own `scope-change` entries and the sprint closes on the written sentence. If T4's projection does not fit, T4 ends `blocked` and the owner is asked.

## Assumptions

- **A1** — At least 6 of the 9 pool candidates survive the audit. *Confirm: T1 box 4.*
- **A2** — A planning run costs 0.7 to 1.1 USD. *Confirm: T3 pre-screen.*
- **A3** — graphify code-only AST runs on a ~1,300-file export without LLM tokens. *Confirm: T4 box 1.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-183-bloodlines-change-plan-retest.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/research/bloodlines-retest-scenarios.md` | T1, T2 | Six audited bloodlines commits with blind descriptions, keys and the frozen rules (WHY: fixed at 634a74fb before any arm ran) | Low | leak grep, blind check |
| `docs/research/graphify-rtk-retest-results.md` | T1–T5 | Run ledger, pre-screen and price gates, per-run table, paired tables, RTK audit (WHY: the evidence both verdicts rest on) | Low | blind score, F1 by script |
| `docs/research/graphify-workdoo-test.md` | T5 | Big-repo verdict for graphify: INCONCLUSIVE (WHY: tokens +1.7%, C +0.026, both ties) | Low | paired 2SE rule |
| `docs/research/rtk-trial-verdict.md` | T5 | Big-repo verdict for RTK: DROP (WHY: tokens +16.4%, real and higher; 3 audit losses) | Low | paired 2SE rule, info-loss audit |
| `docs/work/` task moves, `docs/knowledge-index.md`, `.cap-dispositions`, `docs/LEARNINGS.md` | COORD | Status moves, two retain rows (scenarios file at T2, results file at close), L-330 and an L-100 sighting | Low | gen-index, check-doc-caps |

## Retro

**Retrieval check** — Yes. L-329's ceiling rule (promoted at this sprint's promote) gated the run as written: T3's plain pre-screen scored C 0.844 and 0.821, under the ceiling, so the arms ran and the correctness leg was live (plain mean 0.858). L-045 was applied to the probe's own void flags, each checked against its transcript before a run was thrown away (L-330). TD-319 was sidestepped at promote by declaring `.rtk/pipeline.toml` on T4's Cites line. L-100 fired once more (T2's undeclared `.cap-dispositions`, caught by the gate).

**Cost** — 5 members (all M), coordinator plus Sonnet workers, no Codex builder. The ledger spent 9.2249 of 32.00 USD (about 0.181 USD per box over 51 boxes): 15 paid runs, 3 smokes, a capability run, two pre-screen runs and one void, plus dispatch estimates. Reported worker tokens sum to 974,432: T1 builder 96,898 and auditors 304,114, T2 key 180,952 and blind check 64,746, T3 probe builder 124,248 and pre-screen scorer 66,126, T5 scorer 137,348. The G2 builder checks' tokens were not recorded.

**Worked**
- Real commits from a big repo, scored against their own diffs, gave a live correctness leg for the first time in three re-tests (plain 0.858, a +0.1 gain detectable at 2SE 0.051).
- Paired blocks with a seeded order, a single blind scoring pass with shuffled labels and arm cues removed, and F1 computed by script from the scorer's mapping.
- The futility look after block 3 stopped RTK early by owner ruling and saved three runs.
- Every arm installed and removed cleanly; global `~/.claude` and RTK hashes were unchanged and the live bloodlines repo stayed at b8fea870.

**Friction**
- The probe's fence produced seven false positives (L-330). Six scored runs were flagged void and kept as overturned after transcript checks; the frozen rule said "void and repeat once", so this is a coordinator judgment surfaced to the owner (repeating them would cost about 2 USD).
- Agents in every arm attempted edits (Write, python heredocs) under a plan-only prompt; the deny list held every time. The RTK smoke tried four Writes, plausibly prompted by RTK's own CLAUDE.md block.
- The first system-verify run was red on T2's undeclared `.cap-dispositions` (L-100 sighting), fixed by a scope-change entry and 3a45c801.
- `export.ts` needs Git Bash (Windows tar lacks `--force-local`), and heredoc backslash loss hit the helper scripts again (the known host trap; written via chr(92) and the Write tool).
- `graphify-rtk-retest-results.md` grew to 333 lines against the §2 soft cap of 130.

**Pattern candidate**
- L-330 new: void a paid run from what ran and what it read, never from a parse of a command that never ran. Count 1, `promoted: no`.
- Sighting: L-100 (promoted; recorded on its entry).

**Routed**
- Shipped: none (research docs only), so no CHANGELOG entry. Tech debt: none new. Follow-ups: none (no tool passed, so no ship task). Learnings: L-330 new; L-100 sighting.
- Verdicts: graphify INCONCLUSIVE on the big repo (third non-pass after SPRINT-181 Drop and SPRINT-182 inconclusive). RTK DROP.
- §2 cap: a `retain` row in `.cap-dispositions` for `graphify-rtk-retest-results.md`.
- Release: none from this sprint; v2.26.0 is already cut (4ab339d6) and unpushed with the rest of main.
