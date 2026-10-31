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
of both repos** (Amendment 3): `Bash`, `PowerShell`, `Skill(lean-flow:*)`. `Bash` and `PowerShell` with no pattern allow every command of
that tool; the curated per-repo command list that this section held before Amendment 3 is dropped. The lists are still built from
`inventory.json` `allow.common` + `allow.<repo>` by the repo name in the arm id, so the two arms of a repo cannot differ. Signature of
the owner on this section is signature of the list. The trial environment of Amendment 2 (Node 24 first on the path, the database
variables) is the same for both arms and adds nothing to the list.

```
Bash        PowerShell        Skill(lean-flow:*)
```

Why `Skill(lean-flow:*)` stays: the protocol's first call is a Skill call that otherwise parks. Why the shell is open: a curated list
measured what the agent improvises rather than lean-flow (the re-pilot parked A1 on the PowerShell tool and on a compound
`export ... && go run ./cmd/migrate` command), while only a genuine popup should park a trial (section 12). Accepted risk: a trial agent
may run any shell command on the host. The isolated HOME and config directory and the `D:/ab-work` trial copies limit the damage; they do
not prevent it.

Evidence that the open shell does not park (fixture only, Amendment 3): a smoke trial on `evals/ab/fixtures/smoke-repo` under the
measured inventory (copied), whose agent ran a compound Bash command (`export ... && echo ... && ls src`) and a PowerShell command, ended
`exit: ok` with an empty `permission_denials` (row tagged `smoke -- not a measurement` in `docs/research/logs/ab-measurements.md`).

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
| `evals/ab/arms/inventory.json` | `a8beacab0ccc08328316ba1091fd05a6db2d1ff41e605d8ba10bd87b900b090b` |
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
