---
sprint: 084
slug: gate-recovery-and-owed-work
owner: Maintainer
last_updated: 2026-08-25
status: active
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
