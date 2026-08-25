---
sprint: 084
slug: gate-recovery-and-owed-work
owner: Maintainer
last_updated: 2026-08-25
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-084 — Execution Log

> Append-only companion to [`../SPRINT-084-gate-recovery-and-owed-work.md`](../SPRINT-084-gate-recovery-and-owed-work.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-25 | progress | Batch G1+G2 signed; tiers declared, waves sequenced
G1 ran the **full** checklist on all five tasks, not the fast path: origins are `close-retro` ×4 and
`manual` ×1, and none is `origin: decomposer`, so no task had a prior intake grill to re-confirm.
No `L`; no split needed. A1 confirmed against TD-084's own evidence. A2 confirmed by checking the five
`Layers:` sets pairwise — disjoint; all declared files exist except `harness-delta.md`, which T5 creates.

**D5 closed** — tiers declared at G2 beside `class:`: T1 **G** · T2 **P** · T3 **P** · T4 **G** · T5 **P**.
T4 is G because ADR-029 names eval harnesses under Tier G explicitly and `evals/run-foreign-repo-fixtures.sh`
is one.

**Preflight:** cycle PASS (no `depends-on` anywhere) · ownership PASS (disjoint) · base-ref PASS (clean
tree at `1da48ea`, `plan_commit af7e517` an ancestor) · wave rank all 0.

**Finding the ownership map could not see — T1 and T4 are file-disjoint but runtime-coupled.** T1 edits
`scripts/lib/conformance-engine.sh`; T4's foreign-repo harness *executes* that engine via `conformance.sh`.
Run concurrently, T4 would measure a moving target and its Round 5 record would be untrustworthy. Maps
built from `Layers:` see files, never execution edges. T4 held until T1 settles — waves are
1a: T1 ∥ T3 ∥ T5 · 1b: T2 · 2: T4.

Dispatch shape: agents edit and verify, the coordinator commits. Disjoint files make a shared tree safe,
and single-hand commits remove index races and the mis-attribution L-042 warns about.

**Stale-plugin routing.** This session primed at base-dir 1.55.0 against a 1.57.0 repo (Owner-action item,
still open). Dispatched agents were told to read `skills/<name>/SKILL.md` **from the repo** rather than
invoke the cached slash-command, so they follow 1.57.0 procedures. The orchestrator itself is still
running the 1.55.0 procedure — stated, not hidden (L-021).

### 2026-08-25 | progress | T3 — ADR-034/ADR-036 realigned to ADR.md.template (commit 580e434)
Converted § Consequences (bullet lists → single-paragraph Positive/Negative) and § Alternatives considered
(bullet lists → `| Option | Why rejected |` table) in both files, matching ADR-033/ADR-035.
§ Decision verified **byte-identical** in both by extracting the `## Decision`..`## Consequences` span from
`git show HEAD:` and from the working tree and comparing directly — both `status: accepted`, and §4 is
append-only, so a rewrite there trips `S4.APPEND`.

**Reclassified `governance:high` at review time, against the task's own `risk: low`.** T3 reads as "docs",
but the conformance engine defines `S4.SECTIONS -> adr-required-section-missing` and
`S4.NEGATIVE -> adr-no-negative-consequence`, so ADR section structure *is* mechanically parsed, and
ADR-034 is itself a contract other work is measured against. Under SPRINT-082 T2's routing that forbids
the self-review floor — recording `self-review` would have been false *and* would have reddened
`check-review-depth.sh`. An independent scoped reviewer was dispatched instead; verdict **clean**,
Alternatives row counts 4→4 in both files with no fusion (L-009 re-read of the whole structure).

Noted for future diffs: ADR-034's Consequences carried a statement duplicated in HEAD (once unlabeled,
once under Negative); the conversion merged it into Negative where it belongs. 9 unique claims in, 9 out.

### 2026-08-25 | progress | T2 — four independent reviews dispatched; all four returned findings
Owner ruled **dispatch**, not an accepting self-review ruling. Four scoped reviewers ran against
SPRINT-082 T1/T2/T3/T5, each pinned to the shipped refs (`git show e39473e:` / `7cb20bf` / `cb4e887` /
`161f841`) rather than the working tree, because T1 of this sprint is concurrently editing
`qa-check.sh` and `conformance-engine.sh` and an unpinned reviewer would have reviewed a moving target.

**Four for four returned `findings`, not `clean`** — three silent-false-negative defects in shipped
guards plus one unreachable decision. Summarised in the `review ·` record appended to
`docs/sprint/archive/logs/SPRINT-082-foundation-hardening.md`; routed to `TD-NNN` rows at close per owner
ruling, ids to be derived from the ledger maximum rather than incremented from memory (L-143).

### 2026-08-25 | scope-change | T2's named verification method cannot reach its own criterion
**What broke.** T2's DoD says *"the outcome is written as a `review ·` line in the log — Verify:
`sh scripts/lib/check-review-depth.sh` stays green on the result"*, and its `Layers:` names
`docs/sprint/archive/logs/SPRINT-082-foundation-hardening.md`. But the checker skips archived paths by
design — `check-review-depth.sh:53`, `case "$lg" in */archive/*) continue ;; esac`. So the named check
would report green **because it never read the file**, not because the lines are valid.

**Impact.** This is a vacuous green of exactly the shape the four reviews just found in three other
guards, sitting in this sprint's own frozen DoD. It is L-111's case — a criterion whose reachability
depends on where the artifact lands — and SPRINT-082 T3's subject verbatim: naming a check is not
reaching the criterion it claims. Not reinterpreted quietly (L-088); surfaced for ruling.

**Owner ruling.** Write the four lines to the archive log, where SPRINT-082's record actually lives, and
record here that `check-review-depth.sh` **cannot** verify them. The DoD's named verify is reported
**not-applicable**, never ticked on a vacuous green. The archive-blindness is filed as new debt at close.

**Re-confirm G2.** Design unchanged for the remaining tasks; no Plan edit required. The affected DoD row
is ticked on the dispatch-and-record evidence its first and third clauses name, with its second clause
recorded n/a and the reason stated here.

### 2026-08-25 | surprise | Both halves of the vacuity were demonstrated, not argued — and this sprint reproduces the blind spot on itself
Run as its own call, reading the checker's own printed output (L-120):

- `sh scripts/lib/check-review-depth.sh docs/sprint/archive/logs/SPRINT-082-foundation-hardening.md`
  → **prints nothing, exits 0**, with four syntactically valid `review ·` lines in the file. Not "green
  because the lines are good" — green because the file was never opened. The vacuity is now demonstrated
  rather than inferred from reading line 53.
- `sh scripts/lib/check-review-depth.sh docs/sprint/logs/SPRINT-084-gate-recovery-and-owed-work.md`
  → `has no review line -- nothing to verify`, exit 0. **This live log is SPRINT-084's own**, and this
  sprint's T1/T2/T3/T5 carry `governance:high` work. So the exact defect the T2 reviewer found is
  reproducing here, on this sprint, right now: a `governance:high` sprint passes the review-depth gate
  with zero review evidence on the record.

Also checked the inverse before appending, because a markdown corpus is self-describing and this log
discusses the `review ·` format at length: `grep -nE '^review · '` over the live log returns **empty**, so
none of the prose above accidentally matches the anchored pattern (L-108). The record and the checker
disagree in the safe direction here, but only by luck of line-wrapping — SPRINT-066's archive log already
contains a wrapped line that *does* match at column 0.

### 2026-08-25 | progress | T5 — harness-delta.md written, reviewed, revised once, re-reviewed clean
`docs/research/harness-delta.md` (101 lines, ≤130, ADR-009 frontmatter) rules `05`'s four candidates.
Final: **A keep** (no mechanism derives a canonical dispatch brief from durable inputs) · **B defer**
(blocked on A shipping — `worktree-base-guard.sh` proves the compare pattern at SHA scope only) ·
**C defer** (no genuinely *unowned* repeat effect on record) · **D defer**.

**The review changed a ruling, which is the point of having run it.** First draft ruled D **reject** on
the claim that all six of `05`'s experiment classes were already shipped as local batch and there was
"no unmatched remainder". Independent review found that false: only 2 of 6 are matched (rule inventory ·
cross-reference validation); **repo census, general dependency scans, fixture scans and coverage mapping
are unmatched**. D moved reject → defer, gated on running `05`'s own prescribed loop-vs-batch measurement.

**A stale figure, caught the way CLAUDE.md says these get caught.** The draft wrote "`qa-check.sh`'s 11
`check-*.sh`". Disk has **12**. The 11 matches what `fixture-coverage-audit.md` recorded at SPRINT-077,
before `check-verify-reaches.sh` shipped — copied from an older doc rather than counted. This is L-130/
L-136 exactly: a value entering a frozen artifact is a query result, and authoring feels like planning
rather than querying, so the guard does not fire on its own. Corrected by re-deriving from disk, and the
correction is stated in the doc so the next reader sees the provenance.

**A negative claim with a missing witness.** C's evidence asserted no `L-NNN` at count ≥2 for an unowned
live effect. `L-044` (Windows worktree handle-lock, seen Sprint-025 + Sprint-026, count 2) is exactly that
category and went unmentioned. The revise surfaces it and *argues* the ruling: L-044 has an owner and a
named dispose procedure (`dispatch.md:456-459`) that needs retrying, not an effect with no owner — so C's
own bar is still unmet. Defer stands, now earned rather than asserted by omission.

Re-reviewed narrowly on the changed content only. Verdict **clean**: the coverage-mapping flip is the
better-supported call (`fixture-coverage-audit.md` is a *manual* audit that missed 7 of 12 checkers on its
first pass — evidence against an automated equivalent, not for one), and "all defer" is earned because
each carries a distinct falsifiable unblock condition rather than a shared hedge.

`check-doc-caps.sh` printed `PASS cap docs/research/harness-delta.md (101 <= 130) [§2]`. Index regenerated.

### 2026-08-25 | progress | T4 — the absent-attestation hold fires against a foreign repo with real history
Added a **second** target (`acme-widget-vcs`) alongside the existing git-less stranger rather than
`git init`-ing the original: the original's four-file invariant, actionable-findings sweep and
every-finding-clears remediation are already green, and layering history plus remediation files onto it
would have silently changed what those assertions measure. The new target is built to the same
fully-remediated shape, `git init`-ed, and committed once with a plain `chore:` message carrying none of
§13's three trailers.

Harness read directly, its own call — **10 of 10 PASS**, including the three the DoD names:
`attestation-absent` reported · `level: Gated -- 1 finding(s) at Attested prevent Attested` ·
**exit code unmoved**, asserted as an A/B on the byte-identical tree: `0` before git history existed
(§13 `not evaluated`, falling through to a false `level: Attested`) and `0` after the hold fires. That
assertion is better than the DoD asked for — it pins the **L-159 bug shape** in the "before" state and
shows the hold corrects the *level claim* while never touching the exit code.

This is consumer-path coverage, the thing dogfooding structurally cannot check here (L-016): the rule was
already exercised against *this* repository, never against a foreign tree.

**Discrimination proof (Tier G):** seeded a substring swap on `attestation-absent-against-real-history`;
`cmp` confirmed the seed landed (line 246), `sh -n` parsed clean, line count unchanged (276=276) and
assertion count unchanged (10=10) — a targeted break, not a demolition. The seeded case reddened while
its sibling `attestation-absent-caps-at-gated` and all 8 pre-existing assertions stayed green. Restored
and verified byte-identical by `cmp` **and** `sha256sum`.

**Surprise, recorded unrouted.** Building the precondition surfaced that the *original* stranger's
fully-remediated state still carries **2 unnamed FAIL lines** (`S2.R-README` footer · `S6.BASE` two doc
rows) which Round 4's sweep cannot see: its regex `^FAIL  [a-z-]*: ` matches the bare-kebab finding
convention, and these use `S<N>.<CODE>`. So a coverage sweep reported clean over findings it could not
match — L-108's shape again, in the sweep rather than in a guard. Left unrouted because it is outside
T4's `Layers:`; belongs in the close buckets, not absorbed here.

### 2026-08-25 | progress | T1 — the gate finishes: ~900s never-completing → 492s with a printed verdict
**Profiled before fixing, because TD-084 said so in as many words** (*"Do not act on (a) before (b)"*).
The measurement overturned the assumption: the dominant term is **process-spawn count on this host**,
not corpus size, section identity, or check count. A tiny-input isolation — each spawn type timed 100×
against a 1-line file, run *before* any fix was chosen — put the bare process-creation floor at **21.1ms**
and the range at 20–55ms; at real scale the same spawns cost 110–260ms each. Both numbers are recorded
because they answer different questions: the floor proves the *mechanism* is spawn count with workload
subtracted out; the real-scale figure prices it. Had a split been chosen before measuring, it would have
optimised the wrong half — TD-073's exact mistake, avoided here by following its own lesson.

| Leg | Before | After |
|---|---:|---:|
| 4 · knowledge metadata (gen-index + corpus + LEARNINGS) | **271.5s** | 23.6s |
| 2f-ter · conformance engine informational sweep | **176.6s** | 1.9s |
| 1 · line caps | 15.7s | 8.9s |
| 10 · L-NNN citation lint | 15.4s | 11.7s |
| 12 · eval harnesses | not reached (killed) | **396.3s** ← now dominant |
| total | ~900s extrapolated, never completed | **492s, completes** |

Spawn counts behind it: `gen-index.sh` 523 · `qa-check.sh` §4 ~700–850 · `_own_scan` 222 ·
`assert_S4_APPEND` ~167 — recorded as a **floor**, not a whole-leg account, with the remaining
conformance-engine families named rather than folded into "the rest".

**Nothing deleted, nothing downgraded.** Every heavy leg stays reachable under `QA_FULL=1` — verified:
the default profile hands the engine a reduced spec (S9.GATESWELLFORMED/GATESABSENT + S13, the only
families whose verdict folds into the tally today), and the full informational sweep plus the four opt-in
selftest harnesses run under the flag.

**Retained fixture + discrimination proof (Tier G).** New `scripts/lib/qa-budget-check.sh` and
`evals/run-qa-budget-fixtures.sh`: a run that would exceed the budget is **reported and its skipped
harnesses named**, rather than dying past an external timeout with no verdict line — TD-084's failure
mode closed at the root. Seeded the over-budget comparison inverted: `cmp` confirmed the seed landed,
`sh -n` parsed, line count 38=38 (targeted), the case reddened while both sibling controls stayed green,
then restored. Verified by the coordinator on its own call: 4 of 4 PASS including an explicit
`harness: qa-budget-check discriminates` assertion.

**A real flaky test was found and fixed while building it** — case 1 asserted an exact `OK 0 300`, which
tips to `OK 1 300` when a wall-clock second falls between the harness's `date +%s` and the function's own.
It surfaced as the whole-gate verdict flipping 175/176 across otherwise identical runs. Fixed with a
pattern match, re-verified 8 consecutive green runs. A guard that changes its own answer between runs is
worse than no guard.

**Coordinator's sighting count was wrong and the task corrected it.** I recorded this as the third and
fourth sighting of the spawn-count shape; L-144/L-147/L-155 already document **four** priors (ownership
family · `S2.R-PLACEMENT` · a tier-rank loop · TD-073's own driver fix), making these the **fifth and
sixth**. My figure came from an agent report neither of us had derived — the identifier-and-figure rule
(L-143 · L-130) applies to counts cited in a log exactly as it does to ids in a register.

**Companion decision doc superseded, stated not edited.** `docs/research/qa-gate-timing.md`'s standing
recommendation ("Option C stands... no sub-part of section 4 worth cutting") correctly ruled out
coverage-reduction as a lever but never tested spawn-count reduction, which is where the cure came from.
Left for a promote-time ruling rather than rewritten mid-sprint.

### 2026-08-25 | progress | System-verify: `QA-CHECK: 176 pass, 3 fail` → owner ruling splits the three
Run once against the integrated tree after the final commit, as its own call, verdict read from the line
the gate itself prints (L-120). **The gate that could not finish now finishes** — this is the first
system-verify in this repository since SPRINT-083 to produce a verdict line at all, which is the whole
point of T1 going first.

Three FAILs, all standing against **already-ticked** DoD — ADR-021's exact situation, so none was ticked
past silently. The owner ruled them **split by character, not treated alike**:

**(1) `layers completeness` on T2 — FIXED, using the checker's own documented remedy.** The checker says:
*"if the prose only cites it rather than touching it, declare it on a Cites: line."* That is exactly true
here — T2 **ran** `check-review-depth.sh` and referenced SPRINT-082's T1/T2/T3/T5; it edited neither. Both
declared on `Cites:`. This is completing metadata, not rewriting a criterion.
*Sub-finding worth its own note:* the first attempt failed. `check-layers-completeness.sh:145` matches
with `grep -qxF` — an **exact whole-token** match — and the implied token is the *bare filename*, so a
`Cites:` entry carrying the full path (`scripts/lib/check-review-depth.sh`) never matched and the FAIL
stood. Caught by re-running the checker rather than assuming the edit worked. Path form is load-bearing
in a matcher documented only as "declare it on a Cites: line".

**(2)+(3) `verify-does-not-reach-target` ×2 on T5 — RULED, deliberately NOT edited.** T5's DoD row names
**two** scripts in one `Verify:` clause (`check-doc-caps.sh` **and** `gen-index.sh`); the checker pairs
them as target/method, so each reads as unreachable from the other. Both scripts genuinely ran and passed
— the criterion is met; only the reachability metadata cannot model a two-method clause.
The checker offers a remedy here too (*"state the criterion as a judgment tick"*), and it was **declined**:
editing a frozen Plan's criterion text after the fact so a gate turns green is the L-088 shape —
*never re-read the words to fit what was built* — and it stays that shape even when the checker suggests
it. A recorded override plus a debt row is the honest close; a green tally bought by rewording is not.

**Close state: 176 pass, 2 fail, both ruled and both filed as debt.** Stated plainly rather than rounded
to green.
