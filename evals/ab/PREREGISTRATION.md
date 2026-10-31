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
| spend ceiling + stop rule (R6) | 18 |
| task-corpus manifest hash, arm manifest hashes, prompts lock hash, this document | 19 |

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
  2 arms x 16 tasks x 3 trials = **96 slots**; this is also the spend ceiling's slot count (section 18).
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
- A hypothesis (an arm compared with its comparator) **holds** only if its targeted measure improves by at least +10 pp with a
  90% interval above zero and no symptom measure regresses past -5 pp. These two numbers are applied by the person reading the
  report; they are not encoded in `analyze.ts`, which computes the deltas and intervals they are applied to.
- In this run the comparison is A1 against A0: the delta reported for a pair is `arm - A1` (`deltaVsA1`, `lib/analyze.ts`), so the
  gain of A1 over A0 is the negative of the `A0` entry, with the interval's ends swapped.

## 5. Baseline defect rule (R-b), pooled

A symptom is a **measured defect** of the baseline when **A1 fails that measure at least 20% and the 90% bootstrap lower bound of
that failure rate is above 10%**; Unknown counts as failure. Source: `rb: { failAt: 0.2, lowerAbove: 0.1 }`,
`lib/analyze.ts:28`. **Ruling R5 (SPRINT-152): R-b is applied pooled over both repos (all 16 tasks).** The per-repo figures are
reported alongside and do not decide.

## 6. Unit of analysis and uncertainty

The unit is the **task**, not the trial: trials estimate each task's reliability. Uncertainty is a **bootstrap over tasks**:
**10 000 resamples, seed 20261030, 90% interval** (`bootstrap: { resamples: 10_000, seed: 20261030, ci: 0.9 }`,
`lib/analyze.ts:25`), reported pooled and per repo. Each interval's resample salt is derived from its measure label, so a rerun on the same
data gives the same interval.

## 7. Unknown verdicts

A judge verdict of **Unknown counts as not-passed** in the primary endpoint and in every symptom measure, and is reported
separately per arm and dimension (`unknowns`, `lib/analyze.ts`). It is never dropped from a denominator and never counted as a pass.
A verdict that is not one clean PASS, FAIL or UNKNOWN, a judge that ran on another model than the pinned one, or a judge call
that failed, is Unknown (`lib/judges.ts` `parseVerdict`, `runJudges`).

## 8. Inconclusive rule and never-worse-than-A0

- A delta below +10 pp, or whose 90% interval spans zero, is **inconclusive**: the comparison does not ship as a quality claim.
- A **regression** is a symptom measure whose delta is below -5 pp.
- **Never worse than A0:** an arm whose primary endpoint is below A0's fails regardless of its delta over A1
  (`a0Floor`, `lib/analyze.ts`).

## 9. Cost (D5) and the cost accounting formula

- Comparator: **A1's median execution tokens per task**. Ceiling: **2.0x A1** (`costCeiling: 2.0`, `lib/analyze.ts:27`); it is
  applied to every arm other than A0 and A1.
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

## 11. Run validity and slot replacement

Source `evals/ab/lib/validity.ts:10`: `maxInfraShare: 0.05`, `cellLimit: 1`, `maxReplacementRounds: 2`, judged on the first pass
against the frozen 96-slot schedule.

- First-pass infra-lost share above 5% of slots, or more than 1 lost slot in any arm x task cell: the run is **INVALID** (no ruling).
- Replacement: only infra-lost slots re-run, completed scores are kept, each slot is filled by its first non-infra attempt, at most 2
  rounds. A slot still lost after the rounds makes the run **FAILED (owner decides)**; the denominator is never shrunk.
- A slot absent from the data counts as lost; an unscheduled or duplicate slot in the data makes the run INVALID.

## 12. D9 policy, G1/G2 in trials, and parked trials

- A1 trials run unattended. **G1** is pre-signed (its subject, the task file, is frozen in section 19). **G2's subject, the design,
  is produced inside the trial, so it cannot be pre-signed; it is signed under the owner's eval-only exception D9**, by a blind
  isolated signer with the policy, verbatim: `approve as written unless the design leaves task scope`
  (`POLICY`, `evals/ab/lib/protocol.ts:21`), plus a mechanical check that the design's `Files:` are inside the task's allowed
  layers. A refusal ends the trial (`g2-refused`). The row records the deviation text `D9 eval-only G2 exception -- never applies to
  product runs` (`protocol.ts:18`). The signer model is pinned independent of the arm: `claude-sonnet-5-5` (`protocol.ts:20`).
- A0 receives the plain task prompt and no lean-flow loop.
- **Any other popup a trial raises is parked and the trial is scored not-passed**, with the parked tool and input recorded. A
  parked trial is a task outcome, not an infra failure: it is not retried and not replaced.
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

`permissionMode: acceptEdits` for every measured arm, plus **one allow-list per repo, passed as `--allowedTools` by `lib/run.ts`,
identical for A0 and A1 of that repo** (the lists are built from `inventory.json` `allow.common` + `allow.<repo>` by the repo name
in the arm id, so the two arms cannot differ). Drafted from each repo's grader commands (`task.json`), its package scripts, `go`
tooling, and the read-plus-commit git and file commands the lean-flow 2.19.1 skills tell an agent to run. No blanket `Bash(*)`;
no `git push`; no `git worktree`. Signature of the owner on this section is signature of the lists.

Common to both repos:

```
Bash(git status *)          Bash(git diff *)            Bash(git log *)             Bash(git show *)
Bash(git rev-parse *)       Bash(git ls-files *)        Bash(git grep *)            Bash(git branch --show-current)
Bash(git add *)             Bash(git mv *)              Bash(git commit *)          Bash(mkdir *)
Bash(cat *)                 Bash(echo *)                Skill(lean-flow:*)
```

workdoo, in addition:

```
Bash(npm run typecheck)     Bash(npm run build)         Bash(npm run verify:*)      Bash(node scripts/*)
Bash(npx tsc *)
```

clinic, in addition:

```
Bash(go test *)             Bash(go vet *)              Bash(go build *)            Bash(gofmt *)
Bash(npm run typecheck)     Bash(npm run lint)          Bash(npm run test)          Bash(npm run build)
Bash(npx vitest run *)      Bash(npx vue-tsc *)         Bash(npx eslint *)
```

Evidence this list stops the Bash-park failure (SPRINT-148): the fixture smoke arm, with its own list, went from parking on Bash
to a clean `exit: ok` run (rows tagged `smoke -- not a measurement` in `docs/research/logs/ab-measurements.md`). `Skill(lean-flow:*)`
is in the common list because the protocol's first call is a Skill call that otherwise parks.

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
  are agreement with the expectation, not with an owner read. The previous prompts scored 85.5% on 55 judged rows (SPRINT-151).

## 18. Spend ceiling and stop rule (R6)

- At most **96 slots** (section 2); at most **2 infra retries per slot**; at most **2 replacement rounds**.
- **Pilot pause:** after the first 4 slots (one per arm x repo) the run stops for an owner review of cost and behaviour, and
  resumes only on the owner's word.
- A subscription **usage limit pauses** the run without scoring any slot; the paused slots are re-run afterwards from their first
  attempt.
- **3 consecutive infra failures abort** the run for an owner ruling.
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
| `evals/ab/arms/inventory.json` | `b04840fdd43326519735c8ba32c95bfd1c194cd6f93038aad58684b2b633e3e7` |
| `evals/ab/judges/prompts.lock.json` | `68681da287501cdfb8ed800cf903f7c8e6418c00c3e2ce6b06a3795bffa0014b` |
| plugin pin (A1) sha / content hash | `4714da50...` / `6875071c...` (full values in section 15) |

The sha256 of this document is not inside it: it is printed by `bun evals/ab/hash-prereg.ts --doc evals/ab/PREREGISTRATION.md` and
recorded in `docs/research/logs/ab-measurements.md` at signature.

## 20. Change control

This file, the corpus, the four measured arm files and manifests, `inventory.json` and `prompts.lock.json` are hashed above. Any
edit to any of them after the hash is recorded voids it and needs a new owner signature. Harness code (`evals/ab/lib/*.ts`) is not
hashed; a change to a rule this document restates (a threshold, a constant, the allow-list) must be reflected here first.
