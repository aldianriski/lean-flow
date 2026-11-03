# A/B pre-registration -- lean-flow 2.x (A1) against no lean-flow (A0)

Status: DRAFT for owner signature (TASK-544). Once signed, its sha256 is recorded in `docs/research/logs/ab-measurements.md` and in the
sprint log, and from then on no value in this document changes without voiding the hash (see "Hashes" and "Change control").
Maintainer-only measurement under ADR-053: never a gate, never a `qa-check.sh` leg.

Design source: `docs/research/lean-flow-3-foundation.md` section 5 (decisions D1-D12) and section 7 (A/B design); owner rulings R-a, R-b,
R-c (2026-10-29) and R2-R6 (2026-10-31, SPRINT-152 T3 G2). Every value below names the file where the harness reads it; where the
value lives only here (the thresholds and the stop rule), this document is its source.

## 1. Where each frozen item lives

| TASK-544 frozen item | Section |
|---|---|
| primary endpoint | 3 |
| symptom measures + -5 pp limits | 4 |
| +10 pp minimum gain | 4 |
| R-b baseline defect rule | 5 |
| task as unit + bootstrap | 6 |
| Unknown = not-passed | 7 |
| inconclusive rule | 8 |
| never-worse-than-A0 | 8 |
| D5 cost definition | 9 |
| cost accounting formula | 9 |
| retry classification | 10 |
| run-validity rule + slot replacement policy | 11 |
| D9 policy | 12 |
| parked trial = not-passed | 12 |
| R-a evidence parity | 13 |
| model inventory (full ids; Opus 5.5 session, 2.x dispatch tiers) | 14 |
| plugin SHA per arm | 15 |
| permission mode + allow-list (R2) | 16 |
| judges and calibration (R3) | 17 |
| spend ceiling + stop rule (R6), operator procedure | 18 |
| frozen schedule and how log rows become slots | 2, 11 |
| every trial exit and how it scores | 12 |
| decision rules for A1 against A0 (gain, interval, regression, floor) | 4, 8 |
| task-corpus manifest hash, arm manifest hashes, prompts lock hash, schedule hash, this document | 19 |

## 2. What is measured

- Arms: **A0** = the repo snapshot with no lean-flow docs and no plugin; **A1** = the same repo with lean-flow 2.19.1 installed and
  initialised (its docs present), plugin loaded from the pin in section 15. Nothing else differs between them (section 16 and 14
  hold the permission list and the model inventory identical). Source: `evals/ab/arms/{workdoo,clinic}-{a0,a1}.json`.
- Repos: workdoo (React/Vite, Node `server/`, SQLite, Node 24.16+) and clinic (Vue 3 + Vite, Go chi, PostgreSQL). Snapshots
  `D:\Research\ab-arm-{workdoo,clinic}-{a0,a1}`, frozen by the arm manifests (section 19).
- Tasks: 16 (8 per repo), listed under `evals/ab/tasks/<repo>/batch-{a,b}/<id>/task.json`; each has a prompt, allowed layers,
  out-of-scope behaviours, deterministic graders and a symptom tag. workdoo: access-activity-type-filter, forecast-month-end,
  self-onboarding-guard, shared-timestamp-format, invitation-issued-by, pilot-seat-limit, reissue-invitation, shared-auth-failure.
  clinic: closed-independence-day, confirmation-time, doctor-day-sheet, series-booking, appointment-lookup, booking-lead-time,
  one-offset-helper, patient-cancel-all. The task corpus is pinned by hash (section 19).
- Trials per task and arm: **k = 3** (foundation section 7: A0/A1 at k = 3). The frozen schedule is therefore
  4 measured arm ids x their 8 tasks x 3 trials = **96 slots** (24 per arm id), written in execution order in
  **`evals/ab/schedule.json`** (hashed, section 19; entries `{arm, repo, task, trial}` with `arm` the arm id as logged, e.g.
  `workdoo-a1`). The first four entries are the pilot: trial 1 of each repo's first task (alphabetical), one per arm x repo
  (`workdoo-a0`, `workdoo-a1`, `clinic-a0`, `clinic-a1`); then trials 1, 2, 3 in turn, workdoo before clinic, tasks alphabetical, A0
  before A1. A slot is exactly one entry. The analysis arms `A0` / `A1` are the arm ids with the repo prefix removed and upper-cased.
  This is also the spend ceiling's slot count (section 18).
- The unit of analysis, the endpoints and the thresholds below apply to A1 against A0 in this run. They are written once so that
  later arms (A2 and up) compared against A1 use the same rules.

## 3. Primary endpoint

Per-task success = **every deterministic grader of the task passes AND the business-correctness judge says PASS**
(`success` in `evals/ab/lib/analyze.ts:31`: `r.graders && r.business === "PASS"`). A trial's success is 0 or 1; a task's score is the
mean over its trials; the arm's endpoint is the mean over tasks. It is computed on the **first pass** (before replacement): an
infra-lost trial counts as not-passed (`primary`, `lib/analyze.ts` `taskMeans(first, success, "fail")`). The value after replacement
is reported as a labelled secondary only (`primaryReplaced`). pass@1, pass@k and pass^k are secondary.

## 4. Symptom measures, regression limit and minimum gain

Each is computed per arm on the first pass, infra-lost trials excluded (not zero), Unknown = not-passed (`SYMPTOMS`,
`lib/analyze.ts:123`):

| Measure | Definition | Tasks included |
|---|---|---|
| generic docs -> convention | convention judge PASS rate | tasks tagged `convention` |
| misreads the business -> business | business judge PASS rate | tasks tagged `business-rule` |
| lost detail -> lostDetail | task success (section 3) | tasks tagged `lost-detail` |
| scope discipline -> scope | scope judge PASS rate | all tasks |

- **Minimum worthwhile gain: +10 percentage points** on the primary endpoint (decision D11).
- **Regression limit: -5 percentage points** on each of the four symptom measures (D11).
- **Decision rules for A1 against A0 in this run.** The targeted measure is the **primary endpoint**. Everything below is read from
  the **pooled** figures (both repos, 16 tasks); per-repo figures are reported and decide nothing, as in R5.
  - **Gain** = pooled primary of A1 minus pooled primary of A0 (the `pooled` entry of `gainVsA0` in the report, bootstrap over tasks,
    90% interval).
  - The hypothesis **holds** iff the point gain is **>= +0.10 (inclusive)** AND the lower end of the 90% interval is **> 0 (strict)**
    AND no symptom measure regresses (next point). Otherwise the result is **inconclusive** (section 8) or, with a regression,
    **regressed**.
  - **Regression test** for each of the four symptom measures: the point difference of the pooled rate, **A1 minus A0**; it is a
    regression when strictly **below -0.05**. Each rate is computed over that arm's own set of tasks, which are the tasks with a
    first-pass trial for the measure; because an infra-lost trial is excluded, the two arms' sets can differ. Unknown counts as
    not-passed in both rates.
  - These thresholds are applied by the person reading the report; `analyze.ts` computes the gain and its interval and the rates
    they are applied to, and does not encode +0.10 or -0.05.

## 5. Baseline defect rule (R-b), pooled

A symptom is a **measured defect** of the baseline when **A1 fails that measure at least 20% and the 90% bootstrap lower bound of
that failure rate is above 10%**; Unknown counts as failure. Source: `rb: { failAt: 0.2, lowerAbove: 0.1 }`,
`lib/analyze.ts:28`. **Ruling R5 (SPRINT-152): R-b is applied pooled over both repos (all 16 tasks).** The per-repo figures are
reported alongside and do not decide.

## 6. Unit of analysis and uncertainty

The unit is the **task**, not the trial: trials estimate each task's reliability. Uncertainty is a **bootstrap over tasks**:
**10 000 resamples, seed 20261030, 90% interval** (`bootstrap: { resamples: 10_000, seed: 20261030, ci: 0.9 }`,
`lib/analyze.ts:25`), reported pooled and per repo. Each interval's resample salt is derived from its measure label, so a rerun on the same
data gives the same interval. The quantile rule is the code's index rule (`quantile`, `lib/analyze.ts`): sort the resampled
statistics ascending and take element `min(n-1, max(0, floor(q*n)))`, with `q = 0.05` for the lower end and `q = 0.95` for the upper
end. A resample whose statistic is NaN (an empty task set) is dropped before sorting; the point estimate is the statistic of the
unresampled tasks. A measure with no tasks is reported `n/a` and decides nothing.

## 7. Unknown verdicts

A judge verdict of **Unknown counts as not-passed** in the primary endpoint and in every symptom measure, and is reported
separately per arm and dimension (`unknowns`, `lib/analyze.ts`). It is never dropped from a denominator and never counted as a pass.
A verdict that is not one clean PASS, FAIL or UNKNOWN, a judge that ran on another model than the pinned one, or a judge call
that failed, is Unknown (`lib/judges.ts` `parseVerdict`, `runJudges`).

## 8. Inconclusive rule and never-worse-than-A0

- A gain that is not "holds" under section 4 is **inconclusive**: the point gain is below +0.10, or the lower end of its 90%
  interval is not above zero (an interval that spans zero is the second case). The comparison does not ship as a quality claim.
- A **regression** is a symptom measure whose pooled point difference (A1 minus A0) is strictly below -0.05.
- **Never worse than A0:** a point comparison of the **pooled** primary endpoints: an arm whose pooled primary is strictly below
  A0's fails regardless of its delta over A1 (`a0Floor`, `lib/analyze.ts`). For A1 against A0 this is the sign of the gain.

## 9. Cost (D5) and the cost accounting formula

- Comparator: **A1's median execution tokens per task**, computed exactly as: for each task, the **mean over its trials** of the
  per-trial figure below; the arm's figure is the **median over tasks** of those means (even count: the mean of the two middle
  values). View: the **first pass**, the same one the primary endpoint uses; an infra-lost slot has no figure, a trial with
  incomplete usage is excluded (below), and a task with no complete trial is left out. Both counts are reported
  (`tokens.trials`, `tokens.tasks`, `tokens.incomplete`). Code: `weightedMedian`, `lib/analyze.ts`; pinned by selftest S31.
- Ceiling: **2.0x A1** (`costCeiling: 2.0`, `lib/analyze.ts:27`). It applies to arms other than A0 and A1, i.e. to later arms. **For
  A1 against A0 in this run no cost verdict exists:** A1's cost relative to A0 is reported (ratio of the figures above), never
  judged against the ceiling or used in the gain decision.
- Execution tokens of a trial = the sum of `modelUsage` (input, output, cache-read, cache-write) **over every model and every
  phase** of the run, so each sub-agent the task dispatched is included (`executionTokens`, `lib/measure.ts:21`).
- One figure per trial: `input*1 + output*1 + cacheRead*1 + cacheWrite*1`, **weights {1,1,1,1}** (`tokenWeights`,
  `lib/analyze.ts:24`); each component is also reported.
- A phase that reported no usage makes the trial's total **incomplete**: the known usage is kept and flagged, the trial is left out
  of the token figures and never counted as zero. The count of left-out trials is reported.
- Judge calls are overhead, never execution tokens. Setup (init/migrate) tokens are reported separately and amortised over the
  task set. Infra-lost attempts cost money but never enter D5. Notional `cost-usd` is reported (scored, infra, total); there is no
  dollar cap (section 18).

## 10. Retry classification

Source `evals/ab/lib/retry.ts`. An attempt is exactly one of: `ok`, `task-failure`, or `infra:<kind>` with kind in
`harness-crash` (runner exception, or no result event and no first action), `api-error` (rate limit, 429, overloaded, 5xx,
"api error" in the terminal evidence), `network` (ECONNRESET, ETIMEDOUT, DNS and similar), `sandbox-before-action`. Only the
terminal evidence classifies; task prose, tool output and recovered earlier retries never do. **Infra failures retry at most
`MAX_RETRIES = 2` times (3 attempts); only the first non-infra attempt is scored; a task failure is never retried** (`retry.ts:9`).
A trial killed at the whole-trial limit (section 18, Amendment 1) is classified by exactly the rules above, unchanged: a kill leaves no
result event, so it is `infra:harness-crash` when the agent had not acted, an infra kind when the terminal evidence names one, and
otherwise `task-failure`. Only the exit label is new (section 12).
A failure to provision the trial environment (Amendment 2) is `infra:sandbox-before-action`, set by the harness whatever the error text
says: the sandbox failed before the agent's first action, no agent call was made, and the attempt is never scored.

## 11. Run validity and slot replacement

Source `evals/ab/lib/validity.ts:10`: `maxInfraShare: 0.05`, `cellLimit: 1`, `maxReplacementRounds: 2`, judged on the first pass
against the frozen 96-slot schedule `evals/ab/schedule.json` (section 2). A slot is one schedule entry; the data is judged against
the file, never against itself.

- First-pass infra-lost share above 5% of slots, or more than 1 lost slot in any arm x task cell: the run is **INVALID** (no ruling).
- Replacement: only infra-lost slots re-run, completed scores are kept, each slot is filled by its first non-infra attempt, at most 2
  rounds. A slot still lost after the rounds makes the run **FAILED (owner decides)**; the denominator is never shrunk.
- A slot absent from the data counts as lost; an unscheduled or duplicate slot in the data makes the run INVALID.

**How log rows become a slot's `first` and `final` (the rule the log-to-slots builder implements).** Rows come from the
measurements log, keyed by (arm id, repo, task, trial); each row carries `attempt` (1..3, restarting at 1 in every round) and the
operator passes `--tag "measured round <r>"` with `r = 0` for the first pass and `r = 1, 2` for the replacement rounds, so rows are
never mixed across rounds. Within one slot and round the attempts run in order and stop at the first non-infra attempt
(`runWithRetry`).

1. An attempt row is **infra** when its `measure.attemptClass` starts with `infra:`; otherwise it is **scored**. There is no
   other test.
2. `first` = the first scored attempt of the slot's round 0, as a result `{graders, convention, business, scope, tokens, costUsd}`
   with `graders` = every grader in `measure.graders` is `pass` (`not-applicable` ignored; `fail` or `not-run` makes it false),
   the three verdicts from `measure.judges`, `tokens` and `costUsd` from `measure.exec` (carrying its `incomplete` flag), and the
   slot's symptom tags from `task.json`. If all three attempts of round 0 are infra, `first = null` (infra-lost).
3. `final` = the first scored attempt over rounds 0, 1, 2 in that order (equal to `first` when `first` is not null); `null` if
   every attempt of every round was infra. A replacement round re-runs only slots whose `first` is null.
4. **Which exits are scored:** every row whose attempt class is not infra is scored, whatever its exit: `ok`, `parked`,
   `g2-refused`, `scope-breach`, `cli-error` that classification judged a task failure, and so on (the table in section 12). Their
   judge verdicts are Unknown because the judges did not run, so such a slot is not-passed, counts in the denominators of every
   symptom measure and in the Unknown counts, and is not retried or replaced.
5. `infraCostUsd` of a slot = the sum of `measure.exec.costUsd` over its infra attempts (0 when unknown); it enters the spend
   report and never D5.
6. A scheduled slot with no row at all is absent: it counts as lost in both views.

## 12. D9 policy, G1/G2 in trials, and parked trials

- A1 trials run unattended. **G1** is pre-signed (its subject, the task file, is frozen in section 19). **G2's subject, the design,
  is produced inside the trial, so it cannot be pre-signed; it is signed under the owner's eval-only exception D9**, by a blind
  isolated signer with the policy, verbatim: `approve as written unless the design leaves task scope`
  (`POLICY`, `evals/ab/lib/protocol.ts:21`), plus a mechanical check that the design's `Files:` are inside the task's allowed
  layers (a layer that names a directory of the snapshot covers every file under it; a file layer matches that file only; Amendment 2).
  **A first refusal, mechanical or policy, is fed back to the same session once and the agent revises its design (Amendment 2); the
  revised design is checked again; a second refusal ends the trial (`g2-refused`).** The row records the deviation text `D9 eval-only G2 exception -- never applies to
  product runs` (`protocol.ts:18`). The signer model is pinned independent of the arm: `claude-sonnet-5-5` (`protocol.ts:20`).
- A0 receives the plain task prompt and no lean-flow loop.
- **Any other popup a trial raises is parked and the trial is scored not-passed**, with the parked tool and input recorded. A
  parked trial is a task outcome, not an infra failure: it is not retried and not replaced.
- **Every trial exit and how it scores** (exit words from `lib/trial.ts` for A0 and `lib/protocol.ts` for A1; attempt class from
  `lib/retry.ts` `classifyAttempt`, which looks at the CLI's terminal evidence, never at the exit word):

| Exit | Produced by | Attempt class | Scoring |
|---|---|---|---|
| `ok` | both | `ok` | scored; passes iff every grader passes and the business judge says PASS; all three judges ran |
| `parked: popup <tool>: ...` | A1 | `task-failure` (a CLI that ended cleanly) | scored **not-passed**; graders `not-run:parked`; not retried, not replaced |
| `g2-refused: scope\|policy: ...` | A1 | `task-failure` | scored **not-passed**; graders `not-run:g2-refused`; not retried, not replaced. Only a SECOND refusal (after the one revise round) produces this exit; the reason is the second refusal's |
| `provision-failed: <step>: ...` (Amendment 2) | both | `infra:sandbox-before-action`, always | **never scored**; graders `not-run:provision-failed`, judges Unknown; no agent call was made; retried up to twice, then replaced |
| `scope-breach: <files>` | A1 | `task-failure` | scored **not-passed** (graders ran and are recorded, but the business verdict is Unknown); not retried, not replaced |
| `cli-error: exit N, <reason>` | both | by terminal evidence: `infra:api-error`, `infra:network`, `infra:sandbox-before-action`, or `infra:harness-crash` (no result event and no action) when the evidence says so; otherwise `task-failure` | infra: **retry up to twice, then replace**; task-failure: scored not-passed |
| `timeout` (Amendment 1) | both | by the same evidence, unchanged: `task-failure` for a run killed after it acted (the usual case), `infra:harness-crash` for one killed before its first action, an infra kind if the terminal evidence names one | task-failure: scored **not-passed**, not retried, not replaced, no owner stop; graders `not-run:timeout`, all three judges Unknown (`not-run: timeout`); the usage the phases reported is kept and the total is flagged incomplete (section 9). Infra (kill before the first action): retried up to twice, then replaced |
| `usage-missing` | both | by the same evidence (usually `task-failure`) | the row is logged and scored like any non-ok exit; **owner-ruling stop**: `run-trial.ts` prints "STOP ... needs an owner ruling" and the record text says the trial stops for one, so the operator halts the run at the first such row |
| `source-mutated: <files>` | both | by the same evidence (usually `task-failure`) | integrity failure of the frozen snapshot; **owner-ruling stop** as above; scored not-passed if the run is allowed to stand |
| `invalid: <reasons>` (a model outside the allowed set, a plugin other than the pinned one, init cwd not the trial copy, no init event) | both | by the same evidence (usually `task-failure`) | **owner-ruling stop** as above; scored not-passed if the run is allowed to stand |

  The two "owner-ruling stop" rows are operator procedure, not enforced by the harness, which only logs and scores them. Judge
  verdicts exist only for `ok` rows (`buildMeasure` runs the judges only when the exit is `ok`); for every other exit all three
  are Unknown with reason `not-run: <exit>`. Such a slot therefore counts as not-passed in the primary endpoint, appears in the
  denominator of every symptom measure it is tagged for (not excluded: only an infra-lost slot is excluded), and is added to the
  Unknown counts.
- Protocol trials are restricted to `evals/ab/fixtures/` by `assertFixtureOnly` (`protocol.ts`); that restriction is lifted by an
  edit to the code after signing and is not part of any hashed file.

## 13. Evidence parity (R-a)

Every arm, A0 included, carries the same raw answers file as `BUSINESS-NOTES.md` (`evals/ab/answers/<repo>.md`, verified: the
`BUSINESS-NOTES.md` blob id is identical in `workdoo-a0.manifest.json` and `workdoo-a1.manifest.json`, and in the two clinic
manifests). A0 therefore means raw business facts without lean-flow. Operator and provenance files (`<repo>-operator.md`,
`<repo>-provenance.md`) and `answers/PROTOCOL.md` are never copied into a trial. The business judge receives the same notes file.

## 14. Model inventory (R4)

Source `evals/ab/arms/inventory.json`, shared by the four measured arms; smoke arms keep their own Haiku/low inventory.

| Pin | Value |
|---|---|
| session model | `claude-opus-5-5` |
| effort | the CLI default (no `--effort` flag; stored as `"default"`) |
| subagent model | **not pinned**: `CLAUDE_CODE_SUBAGENT_MODEL` is not exported |
| allowed model set | `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-5-5` |
| setup model (A1 init, once per repo) | `claude-opus-5-5`, default effort |
| judge model | `claude-sonnet-5-5` |

A trial whose usage shows any model outside the allowed set is **invalid** (`validityProblems`, `lib/trial.ts`, via
`modelInventory`, `lib/arm.ts`). **The 2.x tier map is the routing A1 brings, not something the harness enforces:** in lean-flow
2.19.1 (`skills/orchestrator/references/dispatch.md`) a `decision` step stays on the session model (Opus), an `execution` step is
dispatched to Sonnet and a `mechanical-ingest` step to Haiku. A0 uses Claude Code's own defaults. Both pick from the same set.

## 15. Plugin pins

| Arm | Plugin | sha | content hash |
|---|---|---|---|
| A0 (both repos) | none | - | - |
| A1 (both repos) | lean-flow 2.19.1 at `D:\Research\ab-pins\lean-flow-2.19.1` | `4714da509a454e839ce855e415b96569ca359812` | `6875071c7da33691377d3b3e8cb888346c2ded05fb32f027c6dca1ee8a9a55af` |

The sha is a standalone `git archive` repository of this repository's v2.19.1 release commit `102e8b76`. Every A1 run re-verifies
the pin before it spawns (`lib/pin.ts`, `bun evals/ab/run-trial.ts --print-pin <dir>`) and refuses on any difference; the init event
of each run must list exactly the pinned plugin.

## 16. Permissions (R2) and the allow-list

`permissionMode: acceptEdits` for every measured arm, plus **one `--allowedTools` list, passed by `lib/run.ts`, identical for A0 and A1
of both repos** (Amendments 3 and 4): `Bash`, `PowerShell`, `Write`, `Edit`, `Skill(lean-flow:*)`. `Bash` and `PowerShell` with no pattern
allow every command of that tool; `Write` and `Edit` with no pattern allow those tools on any path (Amendment 4); the curated per-repo command list that this section held before Amendment 3 is dropped. The lists are still built from
`inventory.json` `allow.common` + `allow.<repo>` by the repo name in the arm id, so the two arms of a repo cannot differ. Signature of
the owner on this section is signature of the list. The trial environment of Amendment 2 (Node 24 first on the path, the database
variables) is the same for both arms and adds nothing to the list.

```
Bash        PowerShell        Write        Edit        Skill(lean-flow:*)
```

Why `Skill(lean-flow:*)` stays: the protocol's first call is a Skill call that otherwise parks. Why the shell is open: a curated list
measured what the agent improvises rather than lean-flow (the re-pilot parked A1 on the PowerShell tool and on a compound
`export ... && go run ./cmd/migrate` command), while only a genuine popup should park a trial (section 12). Accepted risk: a trial agent
may run any shell command on the host. The isolated HOME and config directory and the `D:/ab-work` trial copies limit the damage; they do
not prevent it.

Evidence that the open shell does not park (fixture only, Amendment 3): a smoke trial on `evals/ab/fixtures/smoke-repo` under the
measured inventory (copied), whose agent ran a compound Bash command (`export ... && echo ... && ls src`) and a PowerShell command, ended
`exit: ok` with an empty `permission_denials` (row tagged `smoke -- not a measurement` in `docs/research/logs/ab-measurements.md`).

Evidence that Write and Edit outside the trial copy do not park (fixture only, Amendment 4): a smoke trial on the same fixture under a
copy of the measured allow-list, whose agent wrote `D:/ab-work/proof-outside/amend4/scratch.txt` with the `Write` tool and changed it with
the `Edit` tool, ended `exit: ok` with an empty `permission_denials` (stream: tool calls `Write` and `Edit` on that path, no shell). A
`Read` of a path outside the copy is not on the list and is auto-denied without parking the trial.

## 17. Judges and calibration (R3)

- Three blind per-dimension judges (convention, business, scope), each one isolated call to `claude-sonnet-5-5`, no tools, prompt
  carrying the task, the diff, the post-change files (context only), and for business the notes; never the arm id, plugin, model or any
  lean-flow material (`lib/judges.ts`). Context cap: **600 lines per file, 60 000 bytes in all** (`CONTEXT_MAX_LINES`,
  `CONTEXT_MAX_BYTES`, `lib/judges.ts:20-21`); the line cap was raised from 400 because it cut off `createCase` in
  self-onboarding-guard's patched `server/store.ts` (518 lines), which made three judge calls Unknown.
- The business prompt now compares the exact locale, format, time zone or unit a fact names ("en" is not "en-GB"): the earlier
  prompt passed invitation-issued-by's wrong solution.
- The prompt frames are frozen by `evals/ab/judges/prompts.lock.json` (section 19).
- Owner rulings on the three suspect calibration rows (recorded in the sprint log before the re-run) were applied to the reference
  solutions; the expectations stayed: forecast-month-end (reference narrowed to a forecast-local helper, scope PASS),
  reissue-invitation (one shared revoke helper, no bare block, convention PASS), access-activity-type-filter (the 14-value enum in the
  OpenAPI `type` parameter, convention PASS and business PASS, its Unknown reported as Unknown). Each changed reference was
  re-verified on a fresh baseline copy (`evals/ab/tasks/workdoo/batch-*/verify.json`).
- Calibration: judge verdicts against the expectation (reference PASS; the dimension a wrong solution breaks FAIL), the bar **80%**
  (`calibrationBar: 0.8`, `lib/analyze.ts:26`), reported over all tasks and again excluding the three re-ruled tasks:

  | Scope | Rows with an expectation | Judge agrees | Agreement | Unknown | Lost (api_error) |
  |---|---|---|---|---|---|
  | all 16 tasks (96 rows, 64 with an expectation) | 64 | 64 | 100.0% | 0 | 0 |
  | excluding the three re-ruled tasks (78 rows, 52 with an expectation) | 52 | 52 | 100.0% | 0 | 0 |

  Run: `bun evals/ab/judges/calibrate.ts --live --sample 1000`, judge `claude-sonnet-5-5`, prompt hashes convention `3b48f11be43c`,
  business `71bd1effd440`, scope `fa0554eca874`; the table is `evals/ab/judges/calibration.md`. No call was lost, so no call was
  re-run. A row marked "-" (no expectation) is not counted. The owner-read column of that table is still blank; the figures above
  are agreement with the expectation, not with an owner read. **The 100% figure is in-sample:** the business prompt and three
  reference solutions were changed after reading verdicts on these same rows, so it shows the prompts and references now agree
  with each other, not how the judges will perform on unseen diffs. The previous prompts scored 85.5% on 55 judged rows (SPRINT-151).

## 18. Spend ceiling and stop rule (R6)

- At most **96 slots** (the entries of `evals/ab/schedule.json`, section 2); at most **2 infra retries per slot**; at most **2
  replacement rounds**.
- **Operator procedure, not harness-enforced:** the three rules below are followed by whoever runs the trials; the harness
  (`run-trial.ts`, `lib/retry.ts`) enforces the retry limit but has no pilot pause, usage-limit pause or abort counter.
- **Pilot pause:** after the first 4 schedule entries (the pilot, one per arm x repo) the run stops for an owner review of cost and
  behaviour, and resumes only on the owner's word.
- A subscription **usage limit pauses** the run without scoring any slot; the paused slots are re-run afterwards from their first
  attempt.
- **3 consecutive infra failures abort** the run for an owner ruling. "Consecutive" counts infra-classed attempts **in run order
  across slots**, retries included; any scored attempt resets the count to zero.
- **Whole-trial time limit (Amendment 1): 45 minutes** of wall time per trial, identical for A0 and A1 (`TRIAL_TIMEOUT_MS`,
  `lib/run.ts`). It covers every phase of the trial: A1's phase 1, the G2 signer and the build phase share the one deadline, each call
  receives the time left, and the signer's own 180 s cap never extends it. A trial past it is killed and exits `timeout` (section 12).
  A trial that is still running is never scored on a partial result. **The clock starts after provisioning (Amendment 2):** the time
  spent building the trial environment is outside the 45 minutes and is recorded per attempt as setup wall time (`measure.setupWallS`).
  A voided attempt may also be an owner-ruled harness defect (`run-baseline.ts --void <ts> --reason "<text>"`, Amendment 2), recorded as
  `void: owner-ruled: <text>`; it leaves every count exactly as a usage-limit void does, and its slot re-runs from round 0.
- Notional `cost-usd` is reported per run; **there is no dollar cap**.
- No trial runs on an A/B repo or a task-set task before this document's hash is recorded (R-c). The log before the freeze line
  holds only rows tagged `smoke -- not a measurement`, on `evals/ab/fixtures/smoke-repo`.

## 19. Hashes

Produced by `bun evals/ab/hash-prereg.ts` (convention in the script header: text files are hashed as if CRLF were LF; a task-corpus
entry is `<repo-relative path> <git blob id of the LF form>`, sorted by path). **Written last, after every other file was final.
Any later edit to any hashed file voids this section.**

| What | Value |
|---|---|
| task corpus: every file under `evals/ab/tasks/` and `evals/ab/answers/` | 137 files; listing sha256 `fa7de9a89867dff2392a2c21545d546d639a85ca032d2d68333d2f29165a0b45` |
| `evals/ab/arms/workdoo-a0.json` | `024dacd27fdab7d8a614cefdf09ac225c16f7872647bd8ac5f0a903899dd437f` |
| `evals/ab/arms/workdoo-a0.manifest.json` | `f1c92bb69d9dd1c514fe9df54892cba4e69d900ec88d51e2d78dc39346447ca8` |
| `evals/ab/arms/workdoo-a1.json` | `af4512e956590de0a25a6f338b31d75f942eaed2cb226363f6bcddde6376ee33` |
| `evals/ab/arms/workdoo-a1.manifest.json` | `af6ddbdef28291f560e80bcfa6cd62b15806e51e5dd59f2e49e2aacf784ebda8` |
| `evals/ab/arms/clinic-a0.json` | `6160586dbc96c83443189acdfd99b9e1b5147ad4db02548b12729f0e44f9150e` |
| `evals/ab/arms/clinic-a0.manifest.json` | `f1cd523931691828d8a1323b4e38d2e0c8574227e812f596687c60a675133e4f` |
| `evals/ab/arms/clinic-a1.json` | `8a0ddbcc05d85db1b38a3c9cb41addd1c91d3c66a803f4ea5567dcc65117f773` |
| `evals/ab/arms/clinic-a1.manifest.json` | `c746aa2b180a69eca37bfda9463a35458f6df1dea298511f17127c8ff9209f5c` |
| `evals/ab/arms/inventory.json` | `afe379e2d405dead89f4fc051ce6a3d24a50d4a0781d756f29cf0d832c58a96a` |
| `evals/ab/judges/prompts.lock.json` | `68681da287501cdfb8ed800cf903f7c8e6418c00c3e2ce6b06a3795bffa0014b` |
| `evals/ab/schedule.json` | `82bbd6e26af0a47d588eea346ba4ab626d14e485b46124a8c04a64a3a19d627d` |
| plugin pin (A1) sha / content hash | `4714da50...` / `6875071c...` (full values in section 15) |

The sha256 of this document is not inside it: it is printed by `bun evals/ab/hash-prereg.ts --doc evals/ab/PREREGISTRATION.md` and
recorded in `docs/research/logs/ab-measurements.md` at signature.

## 20. Change control

The corpus, the four measured arm files and manifests, `inventory.json`, `prompts.lock.json` and `schedule.json` are hashed in
section 19, and this file is hashed separately at signature. Any edit to any of them after the hash is recorded voids it and
needs a new owner signature. Harness code (`evals/ab/lib/*.ts`) is not
hashed; a change to a rule this document restates (a threshold, a constant, the allow-list) must be reflected here first.

## Amendment 1 (2026-10-31, before any trial)

What changed: a **45-minute whole-trial time limit** and the `timeout` exit label, which wins over `usage-missing` (and loses to
`source-mutated`) for a killed run, with graders and judges not run (sections 10, 12, 18). The retry classification is unchanged. Nothing else in this
document changed except section 19's hashes (this file's own sha256 is, as before, not inside it).

Why: the freeze of the first version did not state any trial time limit. The harness then in place killed a trial (and each D9 protocol
phase) at 300 s, and a killed run has no result event, so it was logged `usage-missing`: not-passed plus an owner-ruling stop, every time.
A session running lean-flow's loop on a real task often needs more than five minutes, so the baseline would have measured the kill, mostly
on A1. A frozen value that changes what is measured has to be written down before any trial; no trial ran before this amendment (the log
holds smoke rows only). The limit is the same for A0 and A1, and the scoring keeps the frozen classification: a run killed mid-work is the
task's failure, a run killed before it acted is infra.

The operator procedure of section 18 (pilot pause, usage-limit pause, the 3-infra abort) and the owner-ruling stops of section 12 are
run mechanically by `bun evals/ab/run-baseline.ts`, and its attempts become slots through `bun evals/ab/build-slots.ts` (section 11).
Neither adds a rule. A usage-limit attempt is voided by an appended void row (`measured round <r> void <ts of the attempt row>`; the log is
never edited) and the builder leaves the voided attempt out of every attempt count; its notional spend is reported as its own line of the
total spend and in no scored or D5 figure. A deadline kill is never voided as a usage limit.

## Amendment 2 (2026-10-31, after the pilot, before any further trial)

What changed, four owner rulings (A-D) and one builder-found item (E), all in the trial harness' behaviour; each is stated here before any
trial under it runs:

- **A. Trial environment.** Every trial, both arms identically, is provisioned **before its 45-minute clock starts**; the provisioning
  time is outside the deadline and is recorded per attempt as setup wall time (`measure.setupWallS`). The environment is the one the
  task authors used (their BRIEF.md Setup section and the clinic README): Node 24 (`D:\Research\ab-tools\node24\bin`) first on the path
  for the agent AND the graders (the host's own Node is 22.22.3; workdoo needs 24.16 or later); dependencies installed from the lockfile
  (`npm ci --prefer-offline` from the shared cache `D:/cache/npm`; workdoo at the repo root, clinic in `web/`); Go caches on D:
  (`GOCACHE=D:/cache/go`, `GOMODCACHE=D:/cache/gomod`); and for clinic its OWN fresh Postgres cluster per trial (`initdb` into the
  trial's isolation directory, a free port, databases `clinic` and `clinic_test` created and migrated with `go run ./cmd/migrate`),
  exported to the agent and the graders as `DATABASE_URL` (the `clinic_test` database, which `go test` and the web gateway test use)
  plus `PGHOST`, `PGPORT`, `PGUSER`. The cluster is stopped and removed after grading, also on a kill, a timeout or an error. The
  repo kind is read from the trial copy's lockfiles, not from the arm, so the two arms of a repo cannot differ; a copy with neither
  lockfile (the smoke fixture) is provisioned with nothing. A provisioning failure is `infra:sandbox-before-action` (section 10), exit
  `provision-failed: <step>: ...` (section 12): no agent call, never scored, retried up to twice, then replaced. Installed
  `node_modules` are not part of the manifest diff of what the agent changed.
- **B. Directory layers.** A task layer that names a directory existing in the snapshot (or ending in `/`) matches every file under that
  directory, in the D9 G2 mechanical scope check and in the post-run `scope-breach` check alike; a file layer matches exactly that file.
  The refusals of `..` segments and absolute paths in a design's `Files:` are kept.
- **C. One G2 revise round (changes the owner's D9 ruling, by the owner).** When the first G2 check of a design is refused, by the
  mechanical scope check or by the policy signer, the refusal reason is fed back to the same session once
  (`revisePrompt`, `lib/protocol.ts`); the agent revises its design; the revised design is checked again; a second refusal ends the trial
  as `g2-refused` (scored exactly as before, with the second refusal's reason; the row's `g2.firstRound` keeps the first check). The
  revise call and the second signer call share the one 45-minute deadline of Amendment 1; a revise call killed at the deadline is a
  `timeout`. The policy text and the signer model are unchanged.
- **D. Voids for owner-ruled harness defects.** `run-baseline.ts --void <ts> --reason "<text>"` appends a void row
  (`measured round <r> void <ts>`) whose exit is `void: owner-ruled: <text>`; without `--reason` the void is the usage-limit one, as
  before. A voided attempt leaves the retry budget, the consecutive-infra counter and every slot count, and its notional cost is reported
  apart from every figure (build-slots names both kinds). A slot whose only attempts are voided re-runs from round 0 as attempt 1, as
  if never run. The four pilot rows (log timestamps `2026-10-31T07:33:48.831Z`, `07:35:31.922Z`, `07:38:29.744Z`, `07:39:51.537Z`) are
  voided under this rule by the coordinator, not by this amendment's commit.
- **E. A grader frozen as `not applicable` (builder-found; the owner confirms it with this signature).** Every workdoo `task.json`
  freezes a grader `lint` whose command is the text `not applicable`. The harness ran that text as a shell command (exit 127), so the
  grader read `fail`, and with it `graders` in section 11 rule 2 could never be true for a workdoo slot: the pilot row at
  `07:33:48.831Z` records `lint:fail`. The harness now neither runs nor fails such a grader and records it `not-applicable`, which
  section 11 rule 2 already says is ignored. No task file changed.

Why: the pilot (four slots, one per arm and repo; rows at the timestamps above) was the first end-to-end run of the harness on a real
A/B task, because R-c had kept every earlier run on the fixture. Both A0 rows exited `ok` with business and convention judged PASS, yet
every Node grader failed (`07:33:48.831Z`: typecheck, build, verify:workspace:access:api, verify:openapi, lint; `07:38:29.744Z`: go
test, web typecheck, web lint, web test, web build), because the trial copy had no dependencies, no database and the wrong Node, which the
agent could not run either. Both A1 rows were refused at the G2 scope check (`07:35:31.922Z`, `07:39:51.537Z`), the clinic one because the
matcher took a layer for a directory only with a trailing slash while `task.json` writes directory layers without one, which also made
the post-run `scope-breach` check misfire; workdoo's refusal was a real out-of-layer edit that A0 made too and paid for only in its scope
verdict, which the revise round (C) answers. Under these conditions the pilot measured the harness, not the arms.

No other rule changed: the endpoints, thresholds, schedule, task corpus, arms, plugin pin, models, judges and their prompts, the
allow-lists, the retry limits, the 45-minute limit, the spend and stop rules and the scoring of every other exit are as frozen. Of the
section 19 hashes, none changes (the corpus, arms, manifests, inventory, prompts lock and schedule files are untouched); this file's own
sha256 changes and is recorded at the owner's re-signature. Harness code (`lib/*.ts`) is not hashed (section 20).

## Amendment 3 (2026-10-31, after the re-pilot, before any further trial)

What changed, two owner rulings, both in the trial harness' behaviour:

- **1. All shell for both arms.** The measured arms (A0 and A1, both repos) keep `permissionMode: acceptEdits` and allow the `Bash` and
  `PowerShell` tools wholesale, with `Skill(lean-flow:*)`; the curated per-repo command list of section 16 is dropped. The list is one and
  the same for all four arms (`inventory.json`, hashed in section 19). Only a genuine popup parks a trial, as D9 already says.
- **2. Build output is not the agent's edit.** `dist`, `build`, `.svelte-kit` and `coverage` directories, at any depth like
  `node_modules`, are left out of the manifest diff: they are not in the changed set the judges see and not in the post-run `scope-breach`
  check. A source file the agent edits is still counted. This matches the freeze manifest, which already excludes build output (`dist`).

Why: the re-pilot under Amendment 2 (the four pilot slots re-run; the A1 rows in `docs/research/logs/ab-measurements.md`, e.g. `2026-10-31T11:05:29.413Z`).
Both A0 trials ran to the end, but both A1 trials parked: workdoo A1 on a call to the PowerShell tool, which the list did not cover, and
clinic A1 on a compound command exporting the database URL and running the migrate step. A list that must anticipate every command an
agent improvises measures the list, not lean-flow. And clinic A0's scope verdict counted `web/dist`, build output the agent's own build
produced, as an edit, although the freeze manifest excludes it.

Accepted risk (owner): a trial agent may run any shell command on the host, including one outside its trial copy. The isolated HOME and
config directory and the `D:/ab-work` copies mitigate this and do not prevent it. Evidence that the open shell does not park is in
section 16.

No other rule changed: the endpoints, thresholds, schedule, task corpus, arms, plugin pin, models, judges and their prompts, the
permission mode, the retry limits, the 45-minute limit, the spend and stop rules and the scoring of every exit are as frozen. Of the
section 19 hashes, only `evals/ab/arms/inventory.json` changes (section 19 is updated last); this file's own sha256 changes and is
recorded at the owner's re-signature. Harness code (`lib/*.ts`) is not hashed (section 20).

## Amendment 4 (2026-10-31, after the second re-pilot, before the full run)

What changed: the measured arms (A0 and A1, both repos) additionally allow the `Write` and `Edit` tools wholesale, with no path pattern,
identical across all four arms (`inventory.json`, hashed in section 19). The one allow-list of section 16 is now `Bash`, `PowerShell`,
`Write`, `Edit`, `Skill(lean-flow:*)`. Smoke arms keep their own list.

Why: the second re-pilot (the A1 rows in `docs/research/logs/ab-measurements.md`, `2026-10-31`): clinic A1 ran clean end to end, but
workdoo A1 parked on the `Write` tool writing a scratch check script to `C:\Users\Public\workdoo-type-filter-check\check.mjs`, a path
outside its trial copy. Only a genuine popup should park a trial (section 12); a scratch file is not one.

Risk: no new class beyond Amendment 3. The open shell of Amendment 3 already writes anywhere on the host, so letting the agent's file tools
write anywhere adds no reach. The isolated HOME and config directory and the `D:/ab-work` copies mitigate this and do not prevent it.

No other rule changed: the endpoints, thresholds, schedule, task corpus, arms, plugin pin, models, judges and their prompts, the permission
mode, the retry limits, the 45-minute limit, the spend and stop rules and the scoring of every exit are as frozen. Of the section 19
hashes, only `evals/ab/arms/inventory.json` changes (section 19 is updated last); this file's own sha256 changes and is recorded at the
owner's re-signature. Harness code (`lib/*.ts`) is not hashed (section 20).

## Amendment 5 (2026-11-01, after the first pass, before re-running its voided slots)

What changed:

- **1. PowerShell's cache file is not the agent's edit.** A file `Microsoft/Windows/PowerShell/ModuleAnalysisCache`, at any depth, is
  left out of the manifest diff like Amendment 3's build output: it is not in the changed set the judges see and not in the post-run
  `scope-breach` check. Any other file, in that directory or elsewhere, is still counted.
- **2. Void and re-run.** The 13 first-pass attempts whose only `scope-breach` was
  `Microsoft/Windows/PowerShell/ModuleAnalysisCache` (all workdoo A1) are voided as an owner-ruled harness defect (Amendment 2 D), and
  their slots re-run from round 0 as attempt 1.
- **3. Carry-over.** The freeze line of this amendment carries over the rows measured since the Amendment 4 freeze
  (`2026-10-31T12:07:44Z`). Those rows stay valid, and a measured row before that instant is still refused. A carry-over names exactly
  one earlier freeze instant and is never followed through that line's own carry-over.

Why: the first pass (`docs/research/logs/ab-measurements.md`, 2026-10-31 to 2026-11-01). In 13 of the 24 workdoo A1 slots, a PowerShell
session wrote its module-analysis cache under the trial copy. The file sits outside every layer, so each trial exited `scope-breach`
before any judge ran. Each one scored UNKNOWN on all three judges and failed the primary endpoint. No other cell had one. Removing the
cache changes nothing the agent did.

Carry-over is safe: no kept row's classification or figure depends on the cache.

- **A1:** a cache file always ended in `scope-breach`, so every A1 row that held one is among the 13 voided.
- **A0:** A0 rows get no breach check. One A0 row held the file in its changed set (`2026-10-31T15:17:44.521Z`), and its scope judge
  named it. The primary endpoint (graders and business), the A0 floor, the gain and R-b (on A1 only) do not read the scope verdict.
  No A0 business or convention verdict cites the cache, so A0's scope figure is reported as frozen, with this caveat.

No other rule changed: the endpoints, thresholds, schedule, task corpus, arms, allow-list, plugin pin, models, judges and their prompts,
the retry limits, the 45-minute limit, the spend and stop rules and the scoring of every exit are as frozen. No section 19 hash changes.
This file's own sha256 changes and is recorded at the owner's re-signature. Harness code (`lib/*.ts`) is not hashed (section 20).

Corrected before its re-run rows were built, after an outside review found two holes in the signed text: item 1 covered the whole
directory, which would hide a real file placed there, and the carry-over boundary was followed transitively. The 13 re-run trials ran
under the directory rule, so a file the agent placed in that directory would have been hidden from their judges and breach check. No
evidence shows one: none of their transcripts names a path in that directory, the one trial copy listed while it ran held only
`ModuleAnalysisCache`, and neither A/B repo's frozen snapshot has such a directory. A file created there under a path the transcripts
do not spell out cannot be ruled out, and the rows are kept with this caveat (owner ruling, after the second outside review). The log
holds one carry-over only, so the boundary is unchanged (`2026-10-31T12:07:44Z`).

## Amendment 6 (2026-11-02, arm A2 before any A2 trial)

What changed:

- **1. Arm A2.** Two new measured arms, `workdoo-a2` and `clinic-a2` (`evals/ab/arms/<repo>-a2.json`). Each snapshot
  (`D:\Research\ab-arm-<repo>-a2`) is a copy of the frozen A1 snapshot (0 drift against the A1 manifest, checked before setup),
  then `/lean-doc-generator migrate` run from the S1 pin: lean-flow at `8299017428b02ef6db7f0374f498b4c92350bf77`, content hash
  `b8c3b484cc8567ae52b3b2392d775cc21ff0e1bf4e0802946123a3555b0e1752`, in `D:\Research\ab-pins\lean-flow-s1-82990174`. The pin is
  loaded by `--plugin-dir` in an isolated config with no user plugins; by owner ruling that is "the installed plugin at the pinned
  S1 revision" (TASK-555), as at A1. Each migrated snapshot is then frozen by its manifest (`<repo>-a2.manifest.json`).
- **2. Setup answered by the operator.** A2's setup runs headless (`evals/ab/setup-arm.ts --auto`). Every popup, and every turn
  that ends asking the user in chat, is answered by the setup operator (`evals/ab/lib/classifier.ts`,
  `evals/ab/lib/operated-session.ts`): a model (`claude-sonnet-5-5`, no tools) only CHOOSES one entry of a fixed catalog (each
  section of `evals/ab/answers/<repo>.md` and `<repo>-operator.md`, each Setup bullet, the four ruling classes below, or NONE),
  and the text sent is that entry's own words, never model-written. NONE, an unknown id or unparsable output stops the session
  with that question unanswered; the owner rules it, and the ruling becomes a ruling class. The ruling classes (owner rulings,
  SPRINT-154):
  - PLAN: `migrate`'s plan is approved for the profile items only (Stack, Conventions in use, the five business topics); every
    other item, including archiving, moving, renaming or slimming an existing file, is declined.
  - CLEANUP (setup deviation 1): an existing file a question offers to edit, archive, move, rename or slim is left untouched.
  - DATES (setup deviation 2): a file that gains a section gets today's `last_updated`; no other file does.
  - UNDECIDED (setup deviation 3): a coding convention the Conventions file does not settle is answered "Not decided yet (owner,
    migrate)".
  Every decision is logged to `operator-<arm>.jsonl`, kept with the session transcript. Ten clinic-a2 sessions stopped before
  writing anything while the operator was built; run 11 completed. workdoo-a2 completed in one session; its closing turn offered to write
  `.cap-dispositions`, which no entry covered; the owner ruled it declined under PLAN (no file written). Both migrates changed exactly `docs/architecture/overview.md`,
  `docs/development/coding-standards.md` and `docs/product/requirements.md` and removed no existing line except `last_updated`
  dates; the migrated snapshots are frozen as migrate left them (workdoo-a2's `requirements.md` keeps its old date, and its
  `overview.md` and `requirements.md` end over their caps, 158/150 and 211/150: recorded as arm output, not corrected).
- **3. Schedule.** `evals/ab/schedule-a2.json`: the A1 entries of `schedule.json` with trial 1 or 2, in their order, renamed to A2:
  2 repos x 8 tasks x k = 2 = 32 slots. Every other rule of section 2 holds.
- **4. Pilot.** Section 18's pilot becomes "the first N schedule entries, N = the number of distinct (arm, repo) pairs, one entry
  each" (the driver refuses a schedule that does not satisfy it). For S0's schedule N = 4, unchanged; for A2's, N = 2.
- **5. Log.** A2 rows go to `docs/research/logs/ab-measurements-a2.md`, whose header carries A2's own freeze line (it carries
  over nothing). S0's log stays closed.
- **6. Validity first.** A2 must pass section 11's run-validity rule on its own 32 slots (its own infra-lost share and cells)
  before any comparison is made. A run that is INVALID or FAILED there gets no ruling.
- **7. Comparison and ruling.** A2 is compared with A1 on the combined slot data (S0's A0 and A1 first pass, frozen, plus A2's) by
  section 4's rules with A1 in place of A0 as the comparator: gain = pooled primary of A2 minus A1 (90% task-bootstrap interval,
  `deltaVsA1`); a symptom regresses when A2 minus A1 is below -0.05. The never-worse-than-A0 floor (section 8) and the 2.0x A1
  cost ceiling (section 9) apply. The ruling is:
  - **ship-eligible**: the gain holds (>= +0.10 and lower end > 0), no symptom regresses, A2 is not below A0, and its cost is within 2.0x A1;
  - **failed**: a symptom regresses, or A2 is below A0, or its cost exceeds 2.0x A1;
  - **inconclusive**: otherwise.
  (These three words are TASK-555's; section 4 and 8's terms map onto them as above.)

Why: EPIC-023 D6 ships S1 only once its own arm passes, and D10 has S3 compare against A2. The A1 snapshots carry 2.x docs, so the
upgrade an adopter would run is `migrate` (owner ruling, 2026-11-01). The operator answers setup from the same frozen files an owner
would read, choosing an entry and never writing one, so the setup is reproducible.

No other rule changed: the endpoints, thresholds, task corpus, the A0 and A1 arms, the allow-list, models, judges and their
prompts, the retry limits, the 45-minute limit, the spend and stop rules and the scoring of every exit are as frozen. Section 19
gains the rows below; no existing row changes. This file's own sha256 changes and is recorded at the owner's re-signature in the
A2 log's header. Harness code (`lib/*.ts`) is not hashed (section 20); `hash-prereg.ts` now also pins the A2 files.

| What | Value |
|---|---|
| `evals/ab/arms/workdoo-a2.json` | `d144edfe15a3d1ae0e840fede4448b926c1c562f903e4b927904c2751642057d` |
| `evals/ab/arms/workdoo-a2.manifest.json` | `f71a220af1bea50708f131aaed837a6196c6580fba1966053869f46d4eaacbff` |
| `evals/ab/arms/clinic-a2.json` | `60fd3aa6e9ea30184f5d5ae1ce219df311767f09c477cea43bf276cd53db0459` |
| `evals/ab/arms/clinic-a2.manifest.json` | `e0d69b7edfca30230226c68e53f8fb065ea3e5a4ed6682f9ebbd15d865f16697` |
| `evals/ab/schedule-a2.json` | `d87e435b094291579df9a2a9213a2af7caa05da12d973dc61357b8b5e73b2eba` |
| plugin pin (A2, S1) sha / content hash | `8299017428b02ef6db7f0374f498b4c92350bf77` / `b8c3b484cc8567ae52b3b2392d775cc21ff0e1bf4e0802946123a3555b0e1752` |

## Amendment 7 (2026-11-02, arm A4a before any A4a trial)

What changed:

- **1. Arm A4a.** Two new measured arms, `workdoo-a4a` and `clinic-a4a` (`evals/ab/arms/<repo>-a4a.json`). Their snapshots are A2's,
  unchanged (`D:\Research\ab-arm-<repo>-a2`), checked by `<repo>-a4a.manifest.json`, a byte copy of the A2 manifest (same sha256).
  Only the plugin differs: lean-flow at `56964ce239aa1a243cda97a9062773c03ad933a4`, content hash
  `758044c9ea2be27addf805ffba41a31691690fdaf42c10064ed6829efe0ca81c`, a clone in `D:\Research\ab-pins\lean-flow-156-56964ce2`, loaded
  by `--plugin-dir` in an isolated config with no user plugins, as at A2. No setup runs: A4a's docs are A2's migrated docs.
- **2. The treatment.** Against A2's pin (`82990174`) the plugin's skills differ in 11 files. Two edits to
  `skills/orchestrator/SKILL.md` are the fixes under test (EPIC-023 D12 and D13; SPRINT-156 T1 and T2, TASK-573 and TASK-575):
  - evidence for a criterion ticked on judgment comes from the repo's existing runners first, and a throwaway probe script lives
    inside the working tree and is deleted before the report, never in a system temp dir;
  - a design's file list holds only what the change needs, inside the task's declared layers (ticking or moving the task file is
    bookkeeping; a doc only when the task or the change's behaviour needs it), and a pin that belongs outside the declared layers
    is named as an open point, not added.
  The other 10 files are `lean-doc-generator` templates and its init reference (SPRINT-155). In all 32 A2 sessions the only skill
  invoked was `lean-flow:orchestrator` and no plugin file was read (from the kept streams), so those files are not expected to
  reach a trial. Exposure is measured, not assumed: from each A4a slot's kept streams, any `Skill` call other than the
  orchestrator and any read of one of the ten files counts as exposure. With zero exposure the ruling is stated as the effect of
  the two orchestrator edits; with any, the exposed slots are named and the ruling is stated as the effect of the A4a plugin
  against the A2 plugin, the two edits being its intended treatment. Either way S4's leave-one-out attributes components.
- **3. Schedule.** `evals/ab/schedule-a4a.json`: `schedule-a2.json` with each arm renamed to A4a, same order: 2 repos x 8 tasks x
  k = 2 = 32 slots. Amendment 6 item 4's pilot applies (N = 2).
- **4. Log.** A4a rows go to `docs/research/logs/ab-measurements-a4a.md`, whose header carries A4a's own freeze line (it carries over
  nothing). The S0 and A2 logs stay closed.
- **5. Validity first.** A4a must pass section 11's run-validity rule on its own 32 slots before any comparison; a run that is
  INVALID or FAILED there gets no ruling.
- **6. Comparison and ruling.** A4a is compared with A2 on the combined slot data (S0's A0 and A1, A2's, A4a's, all first pass) by
  Amendment 6 item 7's rules with A2 in place of A1 as the comparator: gain = pooled primary of A4a minus A2 (90% task-bootstrap
  interval, `analyze.ts --comparator A2`, "Delta vs A2"); a symptom regresses when A4a minus A2 is below -0.05. The
  never-worse-than-A0 floor (section 8) applies, and the cost ceiling stays 2.0x A1 (section 9, unchanged). The ruling is:
  - **ship-eligible**: the gain holds (>= +0.10 and lower end > 0), no symptom regresses, A4a is not below A0, and its cost is
    within 2.0x A1;
  - **failed**: a symptom regresses, or A4a is below A0, or its cost exceeds 2.0x A1;
  - **inconclusive**: otherwise.
- **7. Park rate (reported, not decisive).** The share of A4a's 32 scored slots whose exit is `parked:`, beside A2's 3 of 32, read
  from the log rows. It explains the result and rules nothing.
- **8. Development runs, disclosed.** Before this amendment, five development runs used the A4a plugin on research copies of the A2
  snapshots (`D:\Research\dev156\`), one each of workdoo self-onboarding-guard, reissue-invitation, pilot-seat-limit,
  access-activity-type-filter and clinic appointment-lookup, into a scratch log that no analysis reads. Section 18's R-c (no trial
  on an A/B repo or a task-set task before this document's hash is recorded) is not breached: they ran after Amendment 6's hash
  was recorded, under its freeze line. They are not A4a trials and contribute no row. Because they checked the fixes on five of
  the sixteen tasks, the A4a report also gives, as a labelled secondary that decides nothing, A4a minus A2 on the eleven tasks no
  development run touched. Its use is predeclared: the decisive ruling stays the one over all sixteen tasks, and if A4a is
  ship-eligible there while its point gain over A2 on the eleven untouched tasks is below +0.10, the ruling is reported as
  **ship-eligible, tuning-sensitive**, and A4a does not ship under EPIC-023 D6 without the owner's ruling.

Why: EPIC-023 D8 measures each S3 step on its own arm, D10 has S3 compare against A2, and D12/D13 bundle the two fixes into one arm.
A2's kept streams showed lean-flow sessions writing probes outside the repo (A1 33 of 61, A2 18 of 32, A0 3 of 49; 6 parked) and
first designs failing the scope check (82 of 93), each a revise round.

No other rule changed: the endpoints, thresholds, task corpus, the A0, A1 and A2 arms, the allow-list, models, judges and their
prompts, the retry limits, the 45-minute limit, the spend and stop rules and the scoring of every exit are as frozen. Section 19
gains the rows below; no existing row changes. This file's own sha256 changes and is recorded at the owner's re-signature in the
A4a log's header. Harness code (`lib/*.ts`) is not hashed (section 20); `hash-prereg.ts` now also pins the A4a files.

| What | Value |
|---|---|
| `evals/ab/arms/workdoo-a4a.json` | `f55409fd7503e9cdc7b38f7a4e5a82e2bfcb0c545e29d3ec39079bc38f47d50a` |
| `evals/ab/arms/workdoo-a4a.manifest.json` | `f71a220af1bea50708f131aaed837a6196c6580fba1966053869f46d4eaacbff` |
| `evals/ab/arms/clinic-a4a.json` | `97422feeecc10ab28c660b5a828ded935501a7cc34c17a7e73c19b11df4b6869` |
| `evals/ab/arms/clinic-a4a.manifest.json` | `e0d69b7edfca30230226c68e53f8fb065ea3e5a4ed6682f9ebbd15d865f16697` |
| `evals/ab/schedule-a4a.json` | `1359855622b35d94f55f89ed890f349316064549e83f696ff98a3789d2cf9cc3` |
| plugin pin (A4a) sha / content hash | `56964ce239aa1a243cda97a9062773c03ad933a4` / `758044c9ea2be27addf805ffba41a31691690fdaf42c10064ed6829efe0ca81c` |

## Amendment 8 (2026-11-02, two workers for later arms and arm A4b, before any A4b trial)

What changed:

- **1. Two workers from arm A4b on.** `run-baseline.ts --workers 2` runs up to two slots at once inside one driver, under its one
  lock and one log (SPRINT-158 T1, TASK-582, `15012173`). Slots are dispatched in schedule order, so section 2's "execution order"
  is the dispatch order; rows are appended as trials finish. A stop (a usage limit, an owner-ruling exit, three consecutive infra
  attempts, the pilot) starts no further slot; a trial already running finishes and records its row, scored by the unchanged
  rules. Section 18's "consecutive ... in run order" counts infra attempts in the order they finish. The pilot (Amendment 6 item
  4) still stops the run before any non-pilot slot starts, and a pilot slot that ends without a scored attempt stops it for an
  owner ruling (exit 12) before any non-pilot slot, as the serial three-infra abort would. The 45-minute limit, provisioning outside it, the retry limits, the
  classification and the scoring of every exit are unchanged; a trial that shares the PC runs slower, inside the same limit.
  Earlier arms (A0, A1, A2, A4a) stay as measured at one worker. Capacity check, disclosed: before this amendment, 4 slots of
  A4a's arms and pin (workdoo access-activity-type-filter and clinic patient-cancel-all, trials 1 and 2) ran at two workers into a
  scratch log that no analysis reads; all 4 ended `ok` and passed, as in A4a's serial trials of the same slots, with no timeout,
  no infra attempt and the pilot stop holding (owner accepted, 2026-11-02). They are not A4a trials and contribute no row.
- **2. Arm A4b.** Two new measured arms, `workdoo-a4b` and `clinic-a4b` (`evals/ab/arms/<repo>-a4b.json`). Their snapshots are
  A2's, unchanged (`D:\Research\ab-arm-<repo>-a2`), checked by `<repo>-a4b.manifest.json`, a byte copy of the A4a manifest (itself
  a byte copy of A2's). Only the plugin differs: lean-flow at `c10eeb8fcebf0153d1c4773968c6fb16e04c7099`, content hash
  `6389b7c11b37a38d58cce6ddd1f0fb0b979f49e0b4ce46686796fde8ebf174a5`, a clone in `D:\Research\ab-pins\lean-flow-158-c10eeb8f`,
  loaded by `--plugin-dir` in an isolated config with no user plugins, as at A4a. No setup runs.
- **3. The treatment.** Against A4a's pin (`56964ce2`) exactly one plugin file differs, `skills/orchestrator/SKILL.md`, with three
  edits under test (EPIC-023 D14 and D15; SPRINT-158 T2 to T4, TASK-583, TASK-584 and TASK-585):
  - every boundary report carries a `Progress:` line after its verdict (sprint members done, epic conditions ticked, a running
    job's done/total and ETA);
  - in every mode, before the report, anything a check created in the working tree is removed unless the task's declared files
    include it, and what the repo's own tests leave outside the working tree is named in the report, never deleted;
  - G2 gains a business-facts box: the design reads the repo's stated business facts first, names each one the change touches and
    how it honours it, and where a fact and the neighbouring code disagree, the fact wins.
  The same file also joins two pairs of lines of its continuation-contract paragraph with no word changed (to stay within its
  140-line cap) and renumbers one task id. With one file differing, A4a's exposure measure (Amendment 7 item 2) does not apply:
  the ruling is stated as the effect of these edits.
- **4. Schedule.** `evals/ab/schedule-a4b.json`: `schedule-a4a.json` with each arm renamed to A4b, same order, checked slot by
  slot: 2 repos x 8 tasks x k = 2 = 32 slots. Amendment 6 item 4's pilot applies (its 2 slots run together at two workers).
- **5. Log.** A4b rows go to `docs/research/logs/ab-measurements-a4b.md`, whose header carries A4b's own freeze line (it carries
  over nothing). The S0, A2 and A4a logs stay closed.
- **6. Validity first.** A4b must pass section 11's run-validity rule on its own 32 slots before any comparison; a run that is
  INVALID or FAILED there gets no ruling.
- **7. Comparison and ruling, by non-inferiority.** A4b is compared with A4a on the combined slot data (S0's A0 and A1, A2's, A4a's
  and A4b's, all first pass), `analyze.ts --comparator A4A`, "Delta vs A4A": the difference is the pooled primary of A4b minus A4a
  with its 90% task-bootstrap interval. A gain rule cannot be used: A4a scores 90.6%, so no arm can gain more than +9.4 points
  over it, under Amendment 7's +0.10 (L-279). The never-worse-than-A0 floor (section 8) applies, and the cost ceiling stays 2.0x
  A1 (section 9). A symptom regresses when A4b minus A4a is below -0.05. The ruling is:
  - **ship-eligible**: the interval's lower end is above -0.05, no symptom regresses, A4b is not below A0, and its cost is within
    2.0x A1;
  - **failed**: a symptom regresses, or A4b is below A0, or its cost exceeds 2.0x A1, or the interval's upper end is below -0.05;
  - **inconclusive**: otherwise.
  Reported beside it, deciding nothing: the business and scope symptoms of A4b minus A4a (the measures the edits target) and the
  park rate, the share of A4b's 32 scored slots whose exit is `parked:`, beside A4a's 1 of 32.
- **8. Development runs, disclosed.** Before this amendment, development runs used earlier builds of the treatment (plugin pins
  `11c768c3` and `a9b7097f`) on research copies of the A2 snapshots (`D:\Research\dev156\`): workdoo invitation-issued-by,
  self-onboarding-guard (twice) and reissue-invitation, and clinic appointment-lookup, into a scratch log that no analysis reads;
  and one headless run of the changed skill on lean-flow's own repository, not an A/B repo. Section 18's R-c is not breached: they
  ran after Amendment 7's hash was recorded, under its freeze line. They are not A4b trials and contribute no row. On the twelve
  tasks no development run touched, A4a passed all 24 slots, so a gain cannot show there; the labelled secondary looks for harm
  instead and decides nothing: A4b minus A4a on those twelve tasks. Its use is predeclared: if A4b is ship-eligible while that
  point difference is below -0.05 (two or more of the 24 slots lost), the ruling is reported as **ship-eligible, untouched-task
  regression**, and A4b does not ship under EPIC-023 D6 without the owner's ruling.

Why: EPIC-023 D14 tests related fixes as one bundle with one arm, run unattended after its pilot; D15 makes A4a the base and the
comparator for the next bundle; L-279 checks a predeclared bar against the comparator's ceiling before it is frozen. Two workers
take about a quarter off an arm's wall time (the capacity check: 4 slots in 13 minutes against about 17 serially).

No other rule changed: the endpoints, thresholds, task corpus, the A0, A1, A2 and A4a arms, the allow-list, models, judges and
their prompts, the retry limits, the 45-minute limit, the spend and stop rules and the scoring of every exit are as frozen.
Section 19 gains the rows below; no existing row changes. This file's own sha256 changes and is recorded at the owner's
re-signature in the A4b log's header. Harness code (`lib/*.ts`, `run-baseline.ts`) is not hashed (section 20); `hash-prereg.ts`
now also pins the A4b files.

| What | Value |
|---|---|
| `evals/ab/arms/workdoo-a4b.json` | `92f77e9015b9c46d9b8c4cc252ca751b531327ffb5ee88ff7b5e36bd050152e5` |
| `evals/ab/arms/workdoo-a4b.manifest.json` | `f71a220af1bea50708f131aaed837a6196c6580fba1966053869f46d4eaacbff` |
| `evals/ab/arms/clinic-a4b.json` | `4571dace24eefe27ce5294fba9664bc35602effd9d7577237714bde560c57cb6` |
| `evals/ab/arms/clinic-a4b.manifest.json` | `e0d69b7edfca30230226c68e53f8fb065ea3e5a4ed6682f9ebbd15d865f16697` |
| `evals/ab/schedule-a4b.json` | `16ad90fb54321afa9e5d747b723e6a4f629d2f8256ff9fbdc4b3cd04329e0762` |
| plugin pin (A4b) sha / content hash | `c10eeb8fcebf0153d1c4773968c6fb16e04c7099` / `6389b7c11b37a38d58cce6ddd1f0fb0b979f49e0b4ce46686796fde8ebf174a5` |

## Amendment 9 (2026-11-03, arms Final and Final-on-A1 before any of their trials)

What changed:

- **1. Arm Final.** Two new measured arms, `workdoo-final` and `clinic-final` (`evals/ab/arms/<repo>-final.json`). Their snapshots
  are A2's, unchanged (`D:\Research\ab-arm-<repo>-a2`), checked by `<repo>-final.manifest.json`, a byte copy of the A2 manifest
  (the A4b manifest is the same bytes). Only the plugin differs: lean-flow at `cea7ffb8e5d46b70bd77504a51015804b4b573f5`, content
  hash `b979ae44d3dd410a8f57cb418a2f0e603f09b9a0f2d326c99c7fe991645ddeb3`, a clone in `D:\Research\ab-pins\lean-flow-161-cea7ffb8`,
  loaded by `--plugin-dir` in an isolated config with no user plugins, as at A4b. No setup runs. Analysis label `FINAL`.
- **2. Arm Final-on-A1.** Two new measured arms, `workdoo-final-a1` and `clinic-final-a1`. Their snapshots are A1's, unchanged
  (`D:\Research\ab-arm-<repo>-a1`), checked by `<repo>-final-a1.manifest.json`, a byte copy of the A1 manifest; the plugin is
  Final's pin. Their docs are the ones lean-flow 2.19.1's `init` wrote for A1, not S1's (EPIC-023 intake ruling R2). S1's code is
  inert in a trial (no trial runs `init` or `migrate`), so this arm measures the shipped set as an adopter who never re-runs
  `migrate` meets it. Analysis label `FINAL-A1`. Before this amendment all four snapshots matched their manifests (no-spend
  preflight, 2026-11-03).
- **3. The treatment.** Against A4b's pin (`c10eeb8f`) ten plugin skill files differ. `skills/orchestrator/SKILL.md` carries S3's
  bundle 3 and its residual (SPRINT-160 T1 and T2, SPRINT-161 T1; TASK-587, TASK-588, TASK-597): the design finds each
  business-facts source by file name, reads every fact and quotes the line of each fact the change touches; and no delete command
  names a path outside the working tree. The other nine files (`diagnose`, `flow`, `prime`, `triage`, `lean-doc-generator` with its
  init and migration-map references and BUG template, and `task-decomposer`'s task-file reference) are work outside EPIC-023
  (SPRINT-157, SPRINT-159) that ships in the same release. Exposure is measured as in Amendment 7 item 2: from each slot's kept
  streams, any `Skill` call other than the orchestrator, or a read of one of the nine files, counts. With zero exposure the
  bundle-3 ruling is stated as the effect of the orchestrator edits; with any, the exposed slots are named and it is stated as the
  effect of Final's plugin against A4b's.
- **4. Schedules.** `evals/ab/schedule-final.json`: `schedule-a4b.json` with each arm renamed to Final, same order (32 slots), then
  trial 3 of each of the 16 tasks in the order the tasks first appear: 2 repos x 8 tasks x k = 3 = 48 slots.
  `evals/ab/schedule-final-a1.json`: `schedule-a4b.json` with each arm renamed to Final-on-A1, same order: 32 slots (k = 2). Each
  has Amendment 6 item 4's pilot (N = 2) and runs at two workers (Amendment 8 item 1; TASK-586 found no clean N above 2). Run
  order: Final's pilot, then Final-on-A1's pilot, an owner review of both, then Final's remaining slots and then Final-on-A1's, one
  driver run after the other, each under its own log and lock.
- **5. Logs.** Rows go to `docs/research/logs/ab-measurements-final.md` and `ab-measurements-final-a1.md`, each header carrying its
  own freeze line (it carries over nothing). The S0, A2, A4a and A4b logs stay closed.
- **6. Validity first.** Each arm must pass section 11's run-validity rule on its own schedule (48 and 32 slots) before any
  comparison. An INVALID or FAILED arm gets no ruling, nothing ships on it, and the owner rules whether it re-runs.
- **7. Rulings.** Every comparison reads the combined slot data (S0's A0 and A1, A2's, A4a's, A4b's, Final's and Final-on-A1's, all
  first pass), one `analyze.ts --comparator <arm>` report per comparator; a task's score is the mean over its own trials, so k = 3
  and k = 2 arms compare task by task as before. "Difference" is the pooled primary of the first arm minus the comparator's, with
  its 90% task-bootstrap interval; a symptom regresses when its difference is below -0.05. The never-worse-than-A0 floor (section
  8) and the cost ceiling of 2.0x A1 (section 9) apply to every arm ruled on.
  - **a. Final against A2, minimum gain** (Amendment 7 item 6): the point difference is >= +0.10, its lower end is > 0, and no
    symptom regresses.
  - **b. Final against A1, non-inferiority** (owner ruling, SPRINT-161 G2): the lower end of the difference is above -0.05, and no
    symptom regresses. The gain over A1 is reported and decides nothing.
  - **c. Final passes** when a and b hold, it is not below A0 and its cost is within 2.0x A1. A Final that does not pass means
    nothing from EPIC-023 ships, whatever bundles 1 and 2 measured (EPIC-023 D6). When it passes:
  - **d. Bundles 1 and 2** ship on their measured deltas (D15, D17).
  - **e. Bundle 3 with TASK-597** ships when Final against A4b has a point difference above 0, a lower end above -0.05 and no
    symptom regressing (D17's rule with a positive point). Otherwise it is ruled out, and the shipped set without it is unmeasured:
    it needs a further arm before any release, or the outcome is no-ship.
  - **f. S1** (the repo profile, question sets and template changes; owner ruling, SPRINT-161 G2: the point difference decides)
    ships when the pooled point difference of Final minus Final-on-A1 is >= -0.05; the interval is reported. Otherwise S1 is ruled
    out, and Final-on-A1, the shipped set without S1's docs, must itself pass a, b and c in Final's place, or nothing ships.
- **8. Park rate (reported, not decisive).** The share of each arm's scored slots whose exit is `parked:`, beside A4b's 0 of 32.
- **9. Development runs, disclosed.** After Amendment 8's hash was recorded, under its freeze line: SPRINT-160's development runs of
  bundle 3 (plugin pins `4c840af5` and `2249c701`) on research copies of the A2 snapshots (`D:\Research\dev156\`), workdoo
  self-onboarding-guard four times and invitation-issued-by and reissue-invitation twice each; TASK-586's capacity check, A4a's
  arms and pin at N = 3 and N = 4 on workdoo access-activity-type-filter and shared-auth-failure and clinic patient-cancel-all and
  confirmation-time; and SPRINT-161 T1's two runs of Final's own pin on self-onboarding-guard. All went into scratch logs that no
  analysis reads. Section 18's R-c is not breached; they are not trials of any arm and contribute no row. As a labelled secondary
  that decides nothing, the report gives Final minus A4b on the 13 tasks no development run of the treatment touched (all but
  self-onboarding-guard, invitation-issued-by and reissue-invitation; the capacity check ran A4a's plugin). Its use is predeclared:
  if bundle 3 is ship-eligible under item 7e while that point difference is below -0.05, the ruling is reported as
  **ship-eligible, untouched-task regression**, and bundle 3 does not ship without the owner's ruling.
- **10. Judge context, a harness fix disclosed.** `lfDocsOf` (`lib/judges.ts`) found an arm's lean-flow docs list only for arm ids
  ending `-a<digits>`, so A4a's and A4b's judges did not leave lean-flow docs out of their context while A0's, A1's and A2's did.
  A judge's context holds only files the trial's diff writes; from the kept streams, no A2, A4a or A4b trial wrote a listed
  lean-flow doc with Write or Edit (A4b: 239 such writes, none listed), and every A4b shell command that names a listed doc reads
  it (`cat`, `grep`, `sed -n`, `head`; checked by hand, 5 trials), so no listed doc is expected in the judge context of A4b,
  the comparator of item 7e, and the gap is not expected to have changed its verdicts. A4a's verdicts (D15) are not re-examined here.
  Fixed before this amendment: the repo is the arm id's first segment, and selftest S37 asserts that every arm of a repo reads its
  list. Final's and Final-on-A1's judges leave lean-flow docs out, as A0's to A2's did.

Why: EPIC-023 S4 measures the final set against A1 and A2 before any release (D6, D16); intake rulings R1 (admission by stacked
add-one deltas, recorded as D18) and R2 (S1 measured on A1's docs); SPRINT-161 G2 rulings (2026-11-03): non-inferiority against
A1, S1 decided by the point difference, these schedules and this run order.

No other rule changed: the endpoints, thresholds, task corpus, the A0, A1, A2, A4a and A4b arms, the allow-list, models, judges and
their prompts, the retry limits, the 45-minute limit, the spend and stop rules and the scoring of every exit are as frozen.
Section 19 gains the rows below; no existing row changes. This file's own sha256 changes and is recorded at the owner's
re-signature in both new logs' headers. Harness code (`lib/*.ts`, `run-baseline.ts`) is not hashed (section 20); `hash-prereg.ts`
now also pins the Final and Final-on-A1 files.

| What | Value |
|---|---|
| `evals/ab/arms/workdoo-final.json` | `4c833efdd7baf8c546b0ba3959366a6ba9108190126414fc59e25e8888c8b5fa` |
| `evals/ab/arms/workdoo-final.manifest.json` | `f71a220af1bea50708f131aaed837a6196c6580fba1966053869f46d4eaacbff` |
| `evals/ab/arms/clinic-final.json` | `df61892718c03de5a800f6d321f4d8a34ec666b5040b214be4684ab9377165e8` |
| `evals/ab/arms/clinic-final.manifest.json` | `e0d69b7edfca30230226c68e53f8fb065ea3e5a4ed6682f9ebbd15d865f16697` |
| `evals/ab/arms/workdoo-final-a1.json` | `5de00f32f08a0499444f277f74768e14c2a66707fe346990b601175c42b264c4` |
| `evals/ab/arms/workdoo-final-a1.manifest.json` | `af6ddbdef28291f560e80bcfa6cd62b15806e51e5dd59f2e49e2aacf784ebda8` |
| `evals/ab/arms/clinic-final-a1.json` | `f8184f3f6184dfe6f3d93b1e86a7ab20bcf9cf849745766a9bd650fe53974066` |
| `evals/ab/arms/clinic-final-a1.manifest.json` | `c746aa2b180a69eca37bfda9463a35458f6df1dea298511f17127c8ff9209f5c` |
| `evals/ab/schedule-final.json` | `b1eb7ef13af0ebb35768abaebe5412cc82f1bad369c1c4afe3b5a7cf2477dde1` |
| `evals/ab/schedule-final-a1.json` | `ea6d334cb62856517dfd118fdfb46ba1b3dbc26c47c07fb2a62bafba95ec91f5` |
| plugin pin (Final, Final-on-A1) sha / content hash | `cea7ffb8e5d46b70bd77504a51015804b4b573f5` / `b979ae44d3dd410a8f57cb418a2f0e603f09b9a0f2d326c99c7fe991645ddeb3` |

## Amendment 10 (2026-11-03, arm Final cut to k = 2 while running, before any trial-3 slot)

What changed:

- **1. Final at k = 2.** `evals/ab/schedule-final.json` becomes its own first 32 entries, unchanged: `schedule-a4b.json` with each
  arm renamed to Final, same order. The 16 trial-3 slots are dropped before any of them started. Amendment 9 item 4's "2 repos x
  8 tasks x k = 3 = 48 slots" reads "k = 2 = 32 slots", and item 6's "(48 and 32 slots)" reads "(32 and 32 slots)". Final-on-A1,
  every ruling of Amendment 9 item 7, the secondary of item 9 and everything else in Amendment 9 are unchanged.
- **2. When and on what it was decided.** Owner ruling, 2026-11-03 (SPRINT-161 T2), on cost and wall time after an outside
  review of the release-testing process (Codex): a third trial per task answered no question declared in advance and cost about
  38 minutes and 27 USD. It was decided with 7 of Final's 48 slots scored. Beyond the two pilot slots the owner reviewed under
  Amendment 9, no Final result (verdict, grader or score) was read before this amendment's signature: only row counts were.
- **3. How it applies to the running arm.** Changing this file makes the driver refuse to start any further slot (section 18's
  freeze check before every slot); the trials already running finish and are scored by the unchanged rules. The driver then
  restarts on the 32-slot schedule under this amendment's freeze line, which carries over the Final and Final-on-A1 rows measured
  since Amendment 9's freeze (2026-11-03T03:17:08Z). No trial is killed, and a slot already scored is not re-run.

Why: the policy adopted with it (EPIC-023 D19): a release arm is k = 2 unless k = 3 answers a question declared in advance.

No other rule changed. Section 19's row for `evals/ab/schedule-final.json` is superseded by the one below; no other row changes.
This file's own sha256 changes and is recorded at the owner's re-signature in both logs' headers.

| What | Value |
|---|---|
| `evals/ab/schedule-final.json` (Amendment 10, 32 slots) | `a37b2f7700303a06b142096ba5551b75b3b6af16022d70b5e8672525f6c7d517` |

## Amendment 11 (2026-11-03, arm Release on the exact release set, before any Release trial)

What changed:

- **1. Arm Release.** Two new measured arms, `workdoo-release` and `clinic-release`. Their snapshots are A2's, unchanged
  (`D:\Research\ab-arm-<repo>-a2`), checked by `<repo>-release.manifest.json`, a byte copy of the A2 manifest. The plugin is
  lean-flow at `1d6b616a0862a1977731f028f15222870340870e`, content hash
  `89123cabe51e3332e212fa86c28e641fc0d90a82257c8e084c0aaae8e96ca73a`, a clone in `D:\Research\ab-pins\lean-flow-161-1d6b616a`, loaded
  as at A4b. No setup runs. Analysis label `RELEASE`.
- **2. Why this arm.** Amendment 9 item 7e ruled bundle 3 with TASK-597 out (Final vs A4B +3.1 [-6.3, 15.6], convention -11.5),
  and the owner ruled it off `main` (commit `1d6b616a`: `skills/orchestrator/SKILL.md` back to A4b's pin, byte for byte). The set
  that would ship (bundles 1 and 2, S1, and the SPRINT-157 and SPRINT-159 work) was not measured as a set; item 7e requires a
  further arm before any release.
- **3. The treatment.** Against A4b's pin (`c10eeb8f`) exactly nine plugin files differ, all work outside EPIC-023: `diagnose`,
  `flow`, `prime`, `triage`, `lean-doc-generator` with its init and migration-map references and BUG template, and
  `task-decomposer`'s task-file reference. Exposure is measured as in Amendment 9 item 3 (any `Skill` call other than the
  orchestrator, or a read of one of the nine files), and reported.
- **4. Schedule.** `evals/ab/schedule-release.json`: `schedule-a4b.json` with each arm renamed to Release, same order, 32 slots
  (k = 2, EPIC-023 D19), at two workers, with Amendment 6 item 4's pilot (N = 2).
- **5. Log.** Rows go to `docs/research/logs/ab-measurements-release.md`, whose header carries its own freeze line. Every earlier
  log stays closed.
- **6. Validity first.** Release must pass section 11's run-validity rule on its own 32 slots; an INVALID or FAILED arm gets no
  ruling, nothing ships on it, and the owner rules whether it re-runs.
- **7. Ruling.** On the combined slot data (S0's A0 and A1, A2's, A4a's, A4b's, Final's, Final-on-A1's and Release's, all first
  pass), Release takes Amendment 9 items 7a, 7b and 7c in Final's place: against A2 the point difference is >= +0.10 with its
  lower end > 0 and no symptom regressing; against A1 the lower end is above -0.05 and no symptom regresses; it is not below A0
  and its cost is within 2.0x A1. Release passes all three: the release set ships (EPIC-023 D6). Otherwise nothing from EPIC-023
  ships. Reported beside it, deciding nothing: Release minus A4B (the nine non-epic files plus nothing else) with its interval
  and symptoms, and the park rate. S1's ruling (item 7f, measured with bundle 3 in the plugin) stands; this arm carries S1's docs
  in its snapshots, so a Release that passes also measures S1 within the shipped set.
- **8. Development runs, disclosed.** None since Amendment 10's freeze ran on this pin.
- **9. Selection, disclosed (Codex review).** This arm was added after Final's results were read, and it reuses the earlier
  arms as comparators, so its intervals are nominal, not adjusted for that selection. Stopping is fixed in advance: a VALID
  Release that fails item 7 is final for this release (no-ship, no further arm for it), and only an INVALID or FAILED run may
  re-run, by section 11's replacement rounds.

Why: EPIC-023 D6 (nothing ships without a passing arm) and Amendment 9 item 7e; owner ruling 2026-11-03 (strict).

No other rule changed. Section 19 gains the rows below; no existing row changes. This file's own sha256 changes and is recorded
at the owner's re-signature in the Release log's header. `hash-prereg.ts` now also pins the Release files.

| What | Value |
|---|---|
| `evals/ab/arms/workdoo-release.json` | `8efcba3d242df6d364e69b231d177b63879d8511c7f0842d399e098bab2ccbf4` |
| `evals/ab/arms/workdoo-release.manifest.json` | `f71a220af1bea50708f131aaed837a6196c6580fba1966053869f46d4eaacbff` |
| `evals/ab/arms/clinic-release.json` | `9e0e5f9660c401add75af75f16af4049f6f3588d1c5266c55dea2c94ee2f328b` |
| `evals/ab/arms/clinic-release.manifest.json` | `e0d69b7edfca30230226c68e53f8fb065ea3e5a4ed6682f9ebbd15d865f16697` |
| `evals/ab/schedule-release.json` | `0563938b12ce3073577ca605508bd57676310468098ce64ea9c7c498df032d09` |
| plugin pin (Release) sha / content hash | `1d6b616a0862a1977731f028f15222870340870e` / `89123cabe51e3332e212fa86c28e641fc0d90a82257c8e084c0aaae8e96ca73a` |
