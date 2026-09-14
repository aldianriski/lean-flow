---
sprint: 100
slug: findings-that-mean-what-they-say
owner: Maintainer
last_updated: 2026-09-13
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-100 — Execution Log

> Append-only companion to [`../SPRINT-100-findings-that-mean-what-they-say.md`](../SPRINT-100-findings-that-mean-what-they-say.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-13 | progress | G1 + G2 batch pass; four Assumptions resolved against the tree

G1 ran the **full** checklist for all five tasks, not the fast-path: `TASK-338/339/340/341/343` are
every one `origin: close-retro`, and only `origin: decomposer` earns the one-line confirm.

Assumptions, derived rather than inherited (L-130):
- **A1 CONFIRMED** — `run-system-verify-fixtures.sh` IS registered in `eval_harnesses_always`
  (`scripts/qa-check.sh:1063`, placed at SPRINT-068 T2 per the comment at `:1094`), and the checker
  lives at `evals/lib/check-system-verify-block.sh`; `scripts/lib/` holds no such file. TD-086's
  Evidence half is stale in exactly the two ways T3's DoD 4 predicts. Its substance — fixtures only,
  never live logs — stands and is unaffected.
- **A2 CONFIRMED as a stale-figure risk.** TD-089's own tracker line already carries re-derived
  figures (195 `S<N>.<CODE>` occurrences vs 38 distinct kebab findings). They are a figure in a row
  and T5 re-derives both at build; neither is quoted forward from here.
- **A3 NOT YET CONFIRMED — deferred to T4's build-time measurement**, but its design was settled at
  G2 (see the scope-change below) so that it holds by construction rather than by assertion.
- **A4 CONFIRMED, and stronger than the Plan assumed.** The live corpus does not report
  "0 confirmed targets"; it short-circuits one step earlier — SPRINT-100 contains **zero**
  `*Verify:*` clauses, so `check-verify-reaches.sh` examines nothing at all on live input
  (`sh scripts/lib/check-verify-reaches.sh docs/sprint/SPRINT-*.md` → one note line, exit 0). T1's
  vacuity argument (L-156) is reinforced; DoD 4's requirement to vary the *selection* rather than the
  verdict is the only thing that can give T1 a non-empty denominator.

consequence · T1 · behaviour:material · governance:high
consequence · T2 · behaviour:material · governance:high
consequence · T3 · behaviour:material · governance:high
consequence · T4 · behaviour:material · governance:high
consequence · T5 · behaviour:low · governance:high

### 2026-09-13 | scope-change | `Layers:` narrowed on T1, T2, T4 — declaration granularity, not scope

**What broke.** The pre-dispatch preflight HALTed on three findings, all of one shape:

```
FAIL shared-file-unowned: evals/fixtures/ in T1 and T2 has no Depends-on edge, direct or transitive
FAIL shared-file-unowned: evals/fixtures/ ~ evals/fixtures/system-verify/ in T1 and T3 ...
FAIL shared-file-unowned: evals/fixtures/ ~ evals/fixtures/system-verify/ in T2 and T3 ...
```

The preflight is correct as written — its `overlaps()` prefix arm (TD-043) treats a directory token
as colliding with anything beneath it, deliberately, so that `evals/` and `evals/fixtures/foo/` do not
read as unrelated. The collision is in the **declaration**, not in the work: derived from the
harnesses themselves, T1 reads only `evals/fixtures/verify-reaches/`, T3 only
`evals/fixtures/system-verify/`, and T2's `run-conformance-engine-fixtures.sh` builds every fixture in
`mktemp -d` and touches no `evals/fixtures/` subdirectory at all. D3's ruling that T1 and T3 are
disjoint is substantively right; the Plan simply declared a parent directory none of the three owns.

**Impact.** No task's scope, acceptance or DoD changes — this narrows three `Layers:` lines to the
paths their own harnesses read, which L-100 names as the expected cost of declaring before the work.
A fourth `Layers:` edit follows from the T4 design ruling below. Logged here **before** § Plan is
edited, per ADR-014 and this file's own header.

**Re-confirm G2.** Owner-approved 2026-09-13 (AskUserQuestion, two-question frontier round). Waves
after the edit: `[T1 T2 T3] → [T4] → [T5]`; D1's `scripts/lib/conformance-engine.sh` ownership
(T2→T4) is untouched and still PASSes.

### 2026-09-13 | scope-change | T4's informational token is drawn gate-side, in leg 2f-ter

**What broke.** T4's `Layers:` names `scripts/lib/conformance-engine.sh` (finding emission) first, and
TD-146 names both the engine and the relay as Location. Building it engine-side does not work: the
engine cannot know the caller's policy. `gates-signed:` and `S13.*` findings are emitted by the *same*
`bad()` at `conformance-engine.sh:92` as every other finding, and which of them count is decided
downstream by two anchored greps in `qa-check.sh` leg 2f-ter (`^(PASS|FAIL)  gates-signed:` and
`^(PASS|FAIL)  S13\.[A-Z]+ `). "Informational" is a property of **this gate's policy**, not of the
finding — the engine already has a finding-level token for the other thing (`GAP`, for unbuilt rules).

**Impact.** The distinction is drawn where the policy lives: leg 2f-ter relabels only the **printed**
copy of `ce_out`, while the two fold-in greps continue to run over the unmodified capture. This makes
**A3 true by construction rather than by measurement** — the arithmetic cannot move, because the lines
it is derived from are not the lines that were rewritten. T4's build-time A3 assertion still runs, now
as confirmation rather than as the only evidence. Two further consequences: `conformance.sh`, the
ADR-027 consumer entry point whose exit code adopters may gate CI on, is untouched — correct, since for
a consumer every finding **is** gating (L-015); and T4's `Layers:` drops
`scripts/lib/conformance-engine.sh`, which dissolves its D1 shared-file edge with T2.

**Re-confirm G2.** Owner-approved 2026-09-13, same round. T4's `Depends-on: T2` is **retained** despite
the shared file disappearing: both tasks still change `evals/run-conformance-engine-fixtures.sh`, so
the ordering constraint survives on that file alone. The policy of which findings gate is unchanged —
a DoD that moved a count would have exceeded this task, and none does.

### 2026-09-13 | surprise | the conformance engine walks into live agent worktrees — a finding untrue of its own subject, on this sprint's own theme

Found incidentally while confirming that the scope-change above satisfied the Plan-freeze check. It
did: `S9.PLANFROZEN` and `S9.SCOPECHANGE` both PASS, the latter reporting *"1 § Plan edit(s) after
freeze, each with its scope-change entry already in the log at that commit"* — the log-before-edit
ordering is mechanically confirmed, not merely intended.

The same unfiltered sweep emitted this, while wave 1's three agents were live:

```
FAIL  file-outside-canonical-placement: HANDOFF-LEDGER.md -- §2 places it here, and the
      repository has a file of that name at: .claude/worktrees/agent-<id>/evals/fixtures/
      handoff-state/ledger-live-reported/HANDOFF-LEDGER.md ... (S2.R-PLACEMENT)
```

Those are **fixture files inside a transient dispatch worktree**, not repository content. The finding
is not true of its subject — SPRINT-100's exact theme, arriving unbidden in the engine two of its
tasks are already touching.

**Derived twice, by different routes (L-198 — vary the selection, not the direction):**
1. `grep -n worktrees scripts/lib/conformance-engine.sh` → **0 hits**.
2. Independently, reading the walk itself: `_repo_files()` at `:1765` prunes exactly
   `.git node_modules vendor .venv dist build` and is a raw `find`, with no `git ls-files` and no
   gitignore awareness of any kind.

`.claude/worktrees/` **is** gitignored (`.gitignore:16`), and **three sibling checkers already exclude
it by name** — `check-ephemeral-intake.sh`, `check-layers-observed.sh`, `check-research-archive.sh`.
The engine is the one that does not. This is L-170's contamination and L-186's population-set blindness
in the same defect: the detection logic is sound, the member set it runs over is not.

**Not fixed here — out of scope.** It is none of the five tasks, and `TECH-DEBT.md` is concurrently
held by T3. Routed to the close Retro's tech-debt bucket. **Whoever files it must derive the next
`TD-NNN` with `.claude/worktrees/` excluded** — a bare `grep -r` for the maximum in use counts those
repo copies as content and has twice returned a number that is not a row (L-170 ×2 · L-143).

**Operational consequence for this sprint, actionable now:** the close-time system-verify runs the
full `qa-check.sh`, which relays this engine. Worktrees MUST be removed and pruned before that run, or
the close gate carries phantom findings. Added to the merge-back cleanup step.

**Two further observations from the same sweep, recorded but not acted on** — pre-existing, neither
caused by nor owned by this sprint's tasks: 7 × `td-row-aged-unreviewed` (TD-142, TD-144…TD-149), and
`promote-checklist-absent` against `plan_commit 7e27c02`. The second is worth a second look at close
rather than a claim now: the promote governance review *did* happen, at commit `be895da`
("resolve the promote review -- L-198 promoted, rotation done, two high rows re-tracked"), which is
not the commit the checker reads. Whether that is a checker defect or the checklist genuinely
belonging in the promote record is a judgement, and it is not mine to make mid-sprint.

### 2026-09-13 | progress | T3 built and independently verified — windowed per-occurrence, live-log leg added, TD-086 resolved

T3 · done · `check-system-verify-block.sh` binds `has_close`/`has_ruling` to each `system-verify ·`
occurrence's own window (that line up to the next occurrence, or EOF); its harness gained a live-log
leg over `docs/sprint/logs/*.md`; TD-086 resolved → `TASK-340`. Three commits on
`worktree-agent-a6f9f5839adc1727b`: `952eaaa` · `5317656` · `3f74d4c`.

**The agent reproduced before fixing**, in both orderings, against the *unpatched* checker — both
returned `PASS`, exit 0, exactly as TD-086's Evidence describes. Its fixture is therefore written
against observed behaviour, not against the row's description of it.

**Coordinator verification — the report is evidence about the reporter, never the artifact (L-045 ·
L-057), so every claim below was re-derived here rather than accepted:**

- **Scope.** 5 files, all inside T3's declared `Layers:`. Worktree clean, nothing uncommitted.
- **Harness re-run by the coordinator**, not read from the report: 12 fixtures, all green, including
  both new two-entry cases. Live-log leg runs and reports (`no system-verify line — nothing to
  verify`, exit 0 — correct, no run-complete entry has landed this sprint yet).
- **Stated hash reproduces.** T3's pristine figure for `952eaaa` verified identical here under its own
  stated convention, and the checker is byte-identical between `952eaaa` and the branch tip —
  confirming the later two commits touched only `TECH-DEBT.md`, as reported.
- **Discrimination re-proved with an INDEPENDENT seed**, because a suite green on its first run has not
  been shown to discriminate and a proof supplied by the author is inside the set it certifies. The
  coordinator reverted the windowing to the original whole-file grep. **Two seeds were rejected before
  one qualified, which is the point of the bar:** the first never landed at all (`cmp` byte-identical —
  L-137's exact shape, a patch that reports green while having done nothing); the second landed but
  failed `sh -n`, so it would have reddened for the wrong reason (L-142). The third landed (`cmp`
  differs at line 113), parsed (`sh -n` clean) and was targeted (161/161 lines, 13/13 `ok`/`bad` call
  sites unchanged). Result: **exactly `second-entry-unruled-fails` reddened while the sibling control
  `second-entry-ruled-passes` stayed green** — 13 PASS / 1 FAIL. The fixture discriminates the fix.
- **Restored under ONE convention, stated** (L-169): `git hash-object <path>` against
  `git rev-parse <ref>:<path>` — normalization-aware by construction rather than by discipline, which
  is what this CRLF working tree needs. Working file `858ef66` == committed ref `858ef66`; worktree
  clean; harness back to all-green.
- **Both new ledger claims spot-checked.** `check-review-depth.sh` does sit at leg 2b of
  `scripts/qa-check.sh` under the verbatim comment TD-086 now quotes; the fixture count is **12**,
  confirming the row's `10 → 12`.

**Exceeded brief, accepted.** T3 was asked to correct two stale clauses and additionally marked the row
`status: resolved → TASK-340` with a dated resolution bullet, on TD-132's precedent. Accepted: the
row's substance (masking bug · fixtures-only) is what this task fixed, so leaving it `open` would be
the false record. It also found that TD-086's *"the Summary names `scripts/lib/`"* clause was **itself
wrong when added at SPRINT-097 T1** — verified against the row as filed (`9ed3fae`), the Summary never
named a path at all. That is L-130's shape inside the row meant to catch it.

**Ledger census note for close:** resolved rows go 2 → 3, so TODO.md's standing `88 rows (86 open · 2
resolved)` figure is now stale. It is re-derived at each promote and never read from there (L-097 ·
L-130), so this is a note, not a correction to make here.

review · T3 · scoped-reviewer (worktree-isolated, agent-dispatched) + coordinator re-verification · behaviour:material · governance:high
consequence · T3 · behaviour:material · governance:high

### 2026-09-13 | progress | T1 built and independently verified — both legs fixed, archive count contested then confirmed at 9

T1 · done · `check-verify-reaches.sh` EXISTS resolves a bare basename against CWD then `scripts/`,
`scripts/lib/`, `evals/`, and reports *unresolvable* as a **distinct finding**
(`verify-method-unresolvable`) from *absent*; REACHES gained `lf_line_touches` (path-segment-boundary
matching) and `lf_is_exclusion_line`, and a token that is itself another method named in the same
clause is filtered out of that clause's targets. Two commits on `worktree-agent-a12fa32b3222ae12f`:
`bc0a2e8` · `4a8b5be`.

**Its own outside reviewer caught a real regression**, which is L-165's whole claim: the first pass's
`lf_line_touches` required the target to match at a token's own front, which broke on the
`$VAR/literal/path` idiom this repository itself uses (`conformance.sh`'s
`$here/scripts/lib/conformance-engine.sh`), reproduced live as a false FAIL against archived
SPRINT-079. Fixed by matching a segment run anywhere inside a token; `variable-prefix-reach` retained
as the regression guard.

**Coordinator verification:**
- **Scope.** 16 files, all inside T1's declared `Layers:`. Worktree clean.
- **Harness re-run here:** 17 fixtures, all green — including the three that vary **selection** rather
  than verdict, which is DoD 4's actual requirement (L-186): `archive-arm-basename-skipped`,
  `two-method-clause-passes`, `variable-prefix-reach-passes`.
- **Independent seeded break.** Disabled `lf_is_exclusion_line`; landed (`cmp` differs), parsed
  (`sh -n`), targeted (238/238 lines, 1/1 `bad(` sites). **Exactly `exclusion-idiom-fails` reddened
  while its sibling `exclusion-idiom-control-passes` stayed green** — 16 PASS / 1 FAIL. Restored under
  ONE convention (L-169): `git hash-object` vs `git rev-parse <ref>:<path>`, working `98fdea1` == ref
  `98fdea1`, worktree clean, harness green.

**The archive count was contested and then confirmed — recording the disagreement, because the
resolution is the useful part.** T1 derived **9** against TD-097's cited **17**. The coordinator's
cross-check, run by a deliberately different selection rule (extracting `.sh` tokens directly rather
than running the checker at all), returned a **different** distinct-token set — 6 root-resolvable
basenames against T1's 5, the extra being `run-adr-family-fixtures.sh` at `SPRINT-076:102`.

Settled empirically by running the **unfixed** checker over all 31 archived Verify-bearing sprints:
**9 findings**, breakdown `qa-check.sh ×3` + `read-spec-rules.sh` + `check-layers-observed.sh` +
`check-gates-signed.sh` + `check-epic-archive.sh` + `check-doc-caps.sh` + `check-attestation.sh` —
exactly T1's number and exactly its breakdown. **T1 was right and the coordinator's cross-check was
the faulty one:** it stripped trailing punctuation from *script* tokens, which the checker does only
for *targets*, so `run-adr-family-fixtures.sh,` (trailing comma, closing `*` on a later physical line)
fails the checker's `^…\.sh$` test and never becomes a finding at all. TD-097's `17` conflates raw
mentions with findings; **9** is the figure, 2 genuinely absent and 7 false positives now resolved.

**Two pre-existing extraction defects surfaced by that reconciliation, neither fixed here** (both sit
outside T1's `Layers:`; flagged rather than silently patched): (a) a `*Verify:…*` clause whose closing
`*` is on a later physical line makes the per-line `sed` fall back to the whole raw line, leaking
surrounding prose into the "clause"; (b) trailing punctuation on a method token makes it silently drop
out of the method set — a real reference the guard never examines and never reports skipping, which is
L-186's population blindness one level down. Both → close Retro's tech-debt bucket.

review · T1 · scoped-reviewer (worktree-isolated, agent-dispatched, found a real regression) + coordinator re-verification · behaviour:material · governance:high
consequence · T1 · behaviour:material · governance:high

### 2026-09-13 | scope-change | T2's `Layers:` corrected again — the S9 fixtures live in the git-backed sibling harness

**What broke.** The G2 narrowing put T2's fixtures at `evals/fixtures/conformance-engine/` and its
harness at `evals/run-conformance-engine-fixtures.sh`. Both were wrong, and the earlier entry was
wrong to imply otherwise: that scope-change resolved a *directory-ownership* preflight collision and
never ruled on **which harness exercises this assertion**. T2 re-derived the answer —
`run-conformance-engine-fixtures.sh` owns zero S9/git-dependent fixtures and states in its own header
that it needs no git; `evals/run-sprint-family-fixtures.sh` is the established home for the git-backed
`assert_S9_*` family and says so in its header too. The fixtures went there. No
`evals/fixtures/conformance-engine/` directory was created, because none was needed.

**Impact.** Declared vs observed now disagree, and that is mechanically consequential rather than
cosmetic: `check-layers-observed.sh` derives the OBSERVED touched-file set from the git diff since
`plan_commit` and reports anything undeclared, so leaving this would surface at close as an undeclared
file — a true finding about a false declaration. Corrected in § Plan. `scripts/qa-check.sh` (T4's
file) was not touched, and `run-conformance-engine-fixtures.sh` was re-run unchanged and still green.

**Re-confirm G2.** No task's scope, acceptance or DoD moves; this is L-100's live-declaration
correction, the second instance this sprint and the expected cost of declaring before the work.

### 2026-09-13 | surprise | T2 met its DoD and missed its Acceptance — 1 of TD-105's 9 findings fixed, 8 left firing

Found by the coordinator building an **independent** fixture rather than re-running T2's, which is the
only reason it surfaced: T2's own fixtures, its outside reviewer and its harness all agree with each
other, because every one of them is scoped to the assertion T2 declared. The gap sits *between*
assertions, where nothing scoped to one can see it (L-172).

**The finding.** T2 normalised checkbox state in `assert_S9_PLANFROZEN` and deliberately left
`assert_S9_SCOPECHANGE` untouched, correctly per its declared `Layers:`. But TD-105's Evidence names
**both** findings — `plan-edited-after-freeze` **plus 8 ×** `scope-change-logged-after-plan-edit`, one
per tick commit, *9 of that run's 17 FAILs* — and `assert_S9_SCOPECHANGE` calls `_plan_section`
with no normalisation, so **every tick commit still registers as a § Plan change**.

Against a purpose-built tick-only fixture (Plan byte-identical but for 2 ticks, `plan_commit` at the
pre-tick state, no scope-change entry), the merged engine reports:

```
PASS  S9.PLANFROZEN       -- 1 Plan(s) unchanged since plan_commit
FAIL  scope-change-logged-after-plan-edit: ... § Plan changed at afab451 with no
      scope-change entry ... (S9.SCOPECHANGE)
```

T2's **Acceptance** reads *"A sprint that ticked every DoD and changed no Plan text passes."* It does
not pass. **The DoD was satisfiable without the Acceptance being met**, which is this sprint's own
theme occurring inside a task written to fix that theme: a change that reports success about a
subject it only half-covers. 1 of 9 findings fixed; the inverted incentive is intact.

**Imminent, not theoretical.** This sprint closes by ticking 29 DoD boxes. Each tick commit edits
§ Plan, so each would fire `scope-change-logged-after-plan-edit` unless accompanied by a scope-change
entry that never happened — the close gate would be red, or need an override, for doing exactly what
`orchestrator/SKILL.md` step 4 prescribes.

**Ruling (owner-approved 2026-09-13, AskUserQuestion): extend T2 with the symmetric fix.** Verified
before proposing, on two fixtures, with the engine's own dependencies present — an earlier attempt
produced *empty* output that read as success and was actually a `reader-missing` loader failure, which
is L-045's shape and was caught only by reading the unfiltered stream:

- **tick-only** → `PLANFROZEN` PASS, `SCOPECHANGE` reports nothing checkable. No finding.
- **genuine text edit, no scope-change entry** → **both** findings fire, unchanged.

So the fix closes the false positive without weakening what the check exists to catch. T2's `Layers:`
is corrected to name both assertions.

### 2026-09-13 | progress | wave 1 complete — T1 · T2 (+extension) · T3 merged and independently verified

Merges on `main`, in ownership order: `803c041` (T1) · `a2b8814` (T3) · `49b027c` (T2) · `804308a`
(T2's extension). Each is `--no-ff`, so any single task reverts cleanly via `git revert -m 1`.

**Post-merge smoke check** — the pass per-branch review cannot do, because it catches cross-task
interaction rather than per-task defects: both T1's and T3's harnesses re-run green against the
*integrated* tree, and the §9 family green after T2's extension.

**Every task was verified by the coordinator re-deriving its claims, not by reading its report.** That
was not ceremony in any of the three cases:
- **T1** — a contested count, resolved *against the coordinator*: the archive figure is **9**, and the
  cross-check was the faulty side.
- **T2** — an **Acceptance gap the task's own instruments could not see** (see the surprise entry
  above). Found only by an independently constructed fixture.
- **T3** — verified clean, and its own outside reviewer had already caught a self-contradiction in its
  TD-086 edit before the coordinator saw it.

**Two of the three tasks shipped a defect that their own green suite did not show.** Both were caught
by an instrument built *outside* the task's declared scope. That is L-165's claim holding twice more
in one wave, and it is the strongest evidence this sprint has produced for its own thesis.

**Host constraint, recorded because it shaped the method (→ close, tech-debt bucket).**
`evals/run-sprint-family-fixtures.sh` runs ~67 cases, each a **full conformance-engine walk of the
whole repo**. This host killed it three times for low memory — twice with agent worktrees live, once
with none, so the worktrees were not the cause; the harness's own cost model is. Worked around with a
scoped §9-only runner in the scratchpad (`head -n 267` of the harness + a root override), which is a
verification tool and touches nothing in the repo. The full-suite cost is a real debt row: a retained
suite nobody on this hardware can run to completion is a suite that will quietly stop being run.

**Worktree hygiene, two findings (→ close).** (a) Agent-dispatched outside reviewers create their own
worktrees — `agent-a90de1db04305435d` appeared at T1's first commit and the coordinator had to remove
it; `dispatch.md` tells the coordinator to check for leftovers *before* dispatch but never says the
reviews it mandates will spawn more. (b) Worktrees are lock-held and refuse `git worktree remove
--force`, needing an explicit `git worktree unlock` first — not written down anywhere. Also observed:
**8 stale `worktree-agent-*` branches from earlier sessions**, left alone as pre-existing and not this
sprint's to prune.

**Still open, carried forward rather than absorbed:**
- TD-105's **"9 of 17 FAILs"** denominator remains un-re-derived. T2 derived the 1+8=9 split and said
  plainly it could not reproduce the 17 without a historical engine run against a checked-out tree.
  Recorded as an explicit gap — it must not read at close as if it had been verified.
- Two pre-existing `check-verify-reaches.sh` extraction defects (multi-line clause; trailing
  punctuation silently dropping a method from the examined set).
- The conformance engine walking into `.claude/worktrees/`.

### 2026-09-13 | progress | T4 built, defect found and fixed in a second round, merged

T4 · done · leg 2f-ter builds a **separate** relabelled copy (`ce_out_display`); any `FAIL` line this
gate does not fold into its tally prints as `INFO`. Merged at `b877e95`; commits `8bb2500` · `8f4bd64`.

**A3 holds by construction, not by measurement.** The two fold-in greps
(`^(PASS|FAIL)  gates-signed:` · `^(PASS|FAIL)  S13\.[A-Z]+ `) keep reading the **unmodified**
`$ce_out`; only the separate display copy is rewritten, so the arithmetic cannot move because the
bytes it is computed from are never touched. Confirmed by the retained `ce-relay-tally-unchanged`
case (`pass=2 fail=2` before and after) and by reading every `ce_out` reader in the file.
`conformance-engine.sh` and `conformance.sh` are at **zero diff** — the ADR-027 consumer contract is
untouched, correct because for an adopter every finding **is** gating (L-015).

**Round 2 fixed a defect the coordinator found reviewing round 1.** The relabel was turning the
engine's own setup failures — `conformance: reader-missing` · `repo` · `spec-table-unreadable` ·
`usage`, four classes — into `INFO`. Those mean **the engine never ran**, so every rule it did or did
not report is meaningless; calling that "informational" is the same label-untrue-of-its-subject class
T4 exists to remove, occurring inside T4's own fix. **Not hypothetical: the coordinator was misled by
that exact line earlier this sprint**, when an engine run from a copied path emitted `reader-missing`
and produced *empty* output that read as a clean pass. Both the builder and its first reviewer had
seen the case and judged it non-blocking; owner ruled to fix it (AskUserQuestion, 2026-09-13). Engine
errors now stay `FAIL`, with a retained fixture **and** control.

**Second owner ruling, same round:** `PASS` lines stay unrelabelled. The failure modes are asymmetric —
an uncounted FAIL misread as "the gate is clean" is the dangerous direction TD-146 exists to fix,
while an uncounted PASS masks no regression — and both the Acceptance text and TD-146's Evidence are
scoped to FAIL lines. Flagged by the builder for a ruling rather than decided silently, which is the
right instinct.

**Coordinator verification:** 49 fixtures green (re-run here, not read from the report). Independent
seeded break removing the `conformance:` arm: landed (`cmp`), parsed (`sh -n`), targeted (exactly −1
line). **Exactly `ce-relay-engine-error-not-relabelled` reddened; all five siblings stayed green**,
including `ce-relay-informational-fail-prints-info` (proving the seed was scoped) and the A3 tally
check. Restored under ONE convention — `git hash-object` vs `git rev-parse <ref>:<path>` — `7584abb`
both sides, worktree clean.

review · T4 · two scoped reviewers (worktree-isolated, both CLEAR; the second found the finding below) + coordinator re-verification · behaviour:material · governance:high
consequence · T4 · behaviour:material · governance:high

### 2026-09-13 | surprise | 27 bootstrap `FAIL ` emissions use a one-space prefix that no two-space selector can reach

Found by T4's **second** reviewer, in a file T4 was forbidden to touch — the fourth finding this
sprint to come from outside the task's declared scope, and none of the four from anything the task
could run.

`scripts/lib/conformance-engine.sh:54` emits `FAIL conformance: shared archive predicate not found`
through a raw `echo` with **one** space, not the two-space column every `bad()`/`ok()`/`gap()` line
uses. It therefore bypasses **every arm** of T4's relabel awk, including the generic one. The outcome
is correct — it stays `FAIL` rather than becoming `INFO` — but **by accident of a spacing
inconsistency, not by the `conformance:` arm added to catch it.**

**Not one line. Derived by three differently-shaped queries that agree (L-198):** `echo`-prefixed
one-space FAILs = **27**; *any* one-space FAIL literal regardless of emitter = **27** (so every one is
echo-emitted); two-space `bad()`-convention literals = **55**. Spread over **15 files** —
`check-approval-envelope` · `check-count-claims` · `check-ephemeral-intake` · `check-epic-archive` ·
`check-handoff-state` · `check-layers-completeness` · `check-layers-observed` · `check-night-run-rollup` ·
`check-qa-budget-default` (×4) · `check-research-archive` (×2) · `check-review-depth` ·
`check-verify-reaches` · `conformance-engine` · `check-system-verify-block` · `harness-common` (×9).
Every one is a bootstrap failure emitted *before or outside* its file's own helper.

**Harmless today**, and that is the trap: `qa-check.sh`'s 12 leg counters use `grep -cE '^FAIL'`, which
tolerates either spacing, so nothing miscounts. But T4 just shipped the **first** selector keyed to the
two-space column, and these 27 lines are structurally invisible to it. That is **L-186's population
blindness exactly** — the detection logic is sound, the member set it runs over is not — arriving in
the sprint's own last guard. → close, tech-debt bucket. Not fixed here: 15 files, far outside T4's
`Layers:`, and the correct fix (route bootstrap failures through a shared emitter) is a design task.

### 2026-09-13 | scope-change | T5 re-tiered P → G for its harness edit, `Layers:` corrected, and A2's stated premise found FALSE

Three findings, all surfaced before a line was edited, all ruled by the owner in one
AskUserQuestion frontier round (2026-09-13).

**1 — What broke: T5's `Layers:` names the two research docs and not the matcher.**
`Layers: docs/research/conformance-coverage.md · docs/research/logs/conformance-coverage.md`. But
the "actionable-findings matcher" DoD 1 must widen is not in either file — it is two `sed`
extractions inside `evals/run-foreign-repo-fixtures.sh` (the path sweep at the
`findings-name-a-path-the-standard-owns` case, and the remainder extraction at
`every-finding-is-actionable-and-clears`). The research docs *record* the sweep; they do not
implement it. Same shape as this sprint's first `scope-change` — a declaration that does not reach
the work, caught by trying to do the work.

**2 — Consequence: the tier is wrong, and D4 is the thing being corrected.** D4 ruled T5 Tier P
because "the subject is a research round's prose, not a guard". That is true of the two declared
files and false of the third: `evals/run-foreign-repo-fixtures.sh` is an eval harness, **Tier G by
name** under ADR-029, and it is precisely the guard whose false-negative this task exists to fix.
ADR-029's re-tier-on-discovery clause is the governing one. **Owner ruling: T5 splits by file** —
the harness edit takes Tier **G** (retained must-FAIL per check with its own named finding · sibling
control green in the same run · seeded-break discrimination proof under ONE stated hash convention ·
outside reviewer, worktree-isolated), the two research docs stay Tier **P** (read-through). D4 is
superseded on this point and not deleted; the sequence is the evidence.

**3 — What broke: DoD 1's parenthetical premise does not survive its own re-derivation.** DoD 1
reads "The kebab convention is the **minority** one — re-derive both counts at build rather than
inheriting the figures recorded at SPRINT-097 (**A2** · L-130)." A2 was confirmed exactly as
written, and the re-derivation **contradicts the premise it was asked to confirm**. Three
differently-shaped queries, each varying the SELECTION rule rather than the direction of the count
(L-198):

| Route | Population | kebab-leading | rule-id-leading |
|---|---|---|---|
| static, `bad "` call sites in `conformance-engine.sh` | 73 emission sites | **58** | 15 (7 literal `S<N>.<CODE>` · 8 via `$_rid`/`$_tid`) |
| runtime, the sweep's own corpus (`acme-widget`, pre-remediation) | 9 FAIL lines | **6** | 3 |
| runtime, the live corpus (this repository, engine direct, complete run) | 12 FAIL lines | **12** | 0 |

Kebab is the **majority** at every grain that bears on a sweep. TD-089's "195 `S<N>.<CODE>`
occurrences against 38 distinct kebab findings" compares *string occurrences anywhere in the file*
against *distinct finding slugs* — two different populations, which is the one comparison that
cannot support a majority/minority claim. Both figures are also stale: re-derived today they are
**216** and **43**. The third static bucket is the reason the row reads as it does — 8 of the 15
rule-id-leading sites emit through a **variable** (`bad "$_rid-- …"`), so a grep for a literal
`bad "S` finds 7 and a grep for a leading lowercase slug finds those 8 as kebab. A query that
buckets on the first literal character cannot see that shape; this one was caught by a second query
that disagreed, never by re-reading the first.

**Impact.** DoD 1's **operative** half is untouched and is what gets built: the matcher must see
`S<N>.<CODE>` findings, not only the bare-kebab convention. Nothing about the fix depends on which
convention is in the minority — 3 of 9 invisible findings is the defect whether 3 is the minority or
not. **Owner ruling: tick DoD 1 against the re-derived numbers and record the premise as false**
rather than re-reading the words to fit what was built (L-088). TD-089's row carries the stale
figures and the incomparable-populations framing; `TECH-DEBT.md` is outside T5's `Layers:` even after
the correction above, so the row is **routed to this sprint's close** (which resolves TD-089 in any
case) rather than edited here. Its Summary and its re-file condition stand unchanged — only the
majority/minority framing and the two figures are wrong.

**4 — Consequence of the widening, ruled in the same round.** The old regex has read
`every-finding-is-actionable-and-clears` as PASS since Round 4 over **3** FAIL lines it could not
see (`S2.R-README` readme-ownership-footer-missing ×1 · `S6.BASE` tier-doc-set-incomplete ×2 —
2 rules, 3 lines; TD-089 and Round 5 both say "2", counting rules). Widening the matcher reddens
that case honestly. **Owner ruling: extend `acme-widget`'s own remediation block** with the README
`<sub>` footer and §6's two Base docs — exactly what `acme-widget-vcs` already does — and keep the
strong `-z "$left"` empty-set assertion. The alternative (freeze the target, assert the 3 lines by
name) was rejected on the harness's own recorded ground: a remainder list can absorb a new artefact
quietly, an empty-set assertion cannot. Round 5's "the original target is untouched" claim is
superseded here, in the open, rather than left to read as still true.

**Re-confirm G2.** Owner-approved 2026-09-13 (AskUserQuestion, one three-question frontier round).
Wave order unchanged: T5 remains last and depends on T4 (D2), which is merged. Logged **before**
§ Plan is edited, per ADR-014 and this file's own header.

consequence · T5 · behaviour:material · governance:high — **revised upward** from the
`behaviour:low · governance:high` recorded at this sprint's dispatch, which was entered under D4's
Tier P reading. The edit changes a shipped guard's verdict on a real corpus, which is a material
behaviour change by `references/dispatch.md` § System verify's own definition.

### 2026-09-13 | surprise | a worktree-isolated reviewer was dispatched at a branch whose tip did not contain the work under review

**What happened.** T5's Tier G bar requires an outside reviewer, worktree-isolated (L-165 · L-168).
The coordinator dispatched one with these instructions for obtaining the artifact:

```
git checkout worktree-agent-a7f34363a51dc4929 -- evals/run-foreign-repo-fixtures.sh
```

The builder had been told — correctly, per `references/dispatch.md` § Worktree dispatch protocol — **not
to commit**; the coordinator merges back. So its branch **tip is byte-identical to `main`**, and that
`git checkout` yields the *pre-change baseline*. The reviewer would have adversarially reviewed the
very file the task exists to change, found it sound (it is: it is the shipped file), and returned
CLEAR. **A review that examines the wrong artifact returns a verdict that is indistinguishable from a
real pass.**

**How it was caught, and how it was not.** Not by the coordinator re-reading its own dispatch brief,
which was on screen. By a *different* agent: the Tier P prose reviewer, asked to fact-check Round 6's
figures, reported as its top finding that `git show HEAD:…` and
`git show worktree-agent-a7f34363a51dc4929:…` are identical and that
`git log --all -S "sweep-population-unreconciled"` matches zero commits. It was checking whether the
prose overstated completion; what it actually surfaced was that the *other* reviewer had been handed a
bad address. Two reviewers on different axes, and the one not looking at the guard is the one that
found the guard's review was void — the same shape as L-165 (nothing the author can run finds these)
applied to the coordinator.

**Why the existing rules did not reach it.** L-168 says isolate the reviewer, and it was isolated.
The protocol says the builder does not commit, and it did not. Both rules were followed; the seam
between them — *an isolated reviewer needs a path to uncommitted work, and a branch ref is not one* —
is owned by neither. This is L-172's shape (a property living between two correctly-executed
declarations) arriving in dispatch rather than in code.

**Fix applied.** The reviewer was corrected mid-flight and re-pointed at the absolute working-tree
path of the author's modified file, with a mandated sanity check before it starts: the copy it reviews
must contain `sweep_findings`, `sweep_gate`, `sweep-population-unreconciled` and
`engine-level-failure`, or it has the wrong file. **The sanity check is the durable part** — an
address can be got wrong again; a content assertion fails loudly when it is.

**Pattern candidate → `docs/LEARNINGS.md` at close.** *A dispatched reviewer is given a content
assertion that its artifact must satisfy, never only a path or a ref.* A ref-based handoff of
uncommitted work is silently empty, and every downstream proof — reddened case, sibling control,
verified restore — runs correctly against the wrong file and reports green.

### 2026-09-13 | progress | T5 built and independently verified — matcher widened, Round 6 re-run, two reviewer findings (one fixed, one routed)

**The defect, reproduced before anything was edited.** `evals/run-foreign-repo-fixtures.sh`'s two
`sed` sweeps matched only the engine's bare-kebab finding convention. On the pre-remediation stranger
the engine emits **9** FAIL lines and the sweeps reached **6**. The three they could not see —
`S2.R-README -- readme-ownership-footer-missing` ×1 and `S6.BASE -- tier-doc-set-incomplete` ×2 — are
why `every-finding-is-actionable-and-clears` has reported PASS since Round 4 *over its own
unexamined output*. 2 rules, 3 lines; TD-089 and Round 5 both say "2", counting rules.

**Built.** Both sweeps now parse either convention through one shared `sweep_findings`, gated by a
shared `sweep_gate`. Two structural additions beyond the regex, which are the part that outlives this
fix: a **population reconciliation** (`total` vs `reached`, failing by name as
`sweep-population-unreconciled` and printing what it could not reach, so a line shape neither arm
parses becomes a finding rather than a silent skip), and **engine-level bootstrap failures routed to
their own `engine-level-failure` class** rather than parsed as findings. The stranger's remediation
block was extended with §3's README `<sub>` footer and §6's two Base docs, mirroring
`acme-widget-vcs`, so the newly-visible findings are *applied* rather than listed — the `-z` empty-set
assertion is retained, never weakened into a remainder list.

**Measured after:** 9/9 swept pre-remediation, 0/0 post. Round 4's verdict reproduces unchanged —
9 findings across 5 rules, tally `S2.F-FILE` 4 · `S6.BASE` 2 · `S3.SCHEMA` 1 · `S2.R-README` 1 ·
`S1.LAW3` 1, 9 actionable, 0 artefacts. Written up as **Round 6** in
`docs/research/logs/conformance-coverage.md`; the parent's § Artefacts verdict sentence was corrected
in place, and the parent still sits exactly at its 130-line cap.

**Two findings from the coordinator's own pass, before review.** (a) The engine's four
`bad "conformance: …"` sites emit at the finding column, so the widened kebab arm parsed
`FAIL  conformance: spec-table-unreadable -- …` as `slug=conformance, path=spec-table-unreadable` — a
path complaint about the stranger when the truth is *the engine never ran*. Reproduced live against a
deliberately unparseable spec, then fixed. (b) T5's `Layers:` and tier were both wrong; logged
separately above.

**Two findings from the independent reviewer, worktree-isolated (L-165 · L-168).** Neither was
findable by anything the author could run, which is the whole argument for the rule:

1. **FIXED — a fifth bootstrap shape was invisible, and the gate passed silently on it.**
   `conformance-engine.sh:54` bypasses `bad()` with a raw `echo "FAIL conformance: …"` at **one**
   space. The sweep anchors `^FAIL  ` (two), so the line entered no bucket: fed a crashed engine's
   output, `sweep_findings` returned `total=0 reached=0 engine_error=[] unreached=[]` and `sweep_gate`
   returned rc=0 — the one outcome its own docstring forbids. Independently reproduced by the
   coordinator before dispatching the fix. Masked today only because the unrelated
   `level-and-named-findings` fixture also fails on that crash; an accident is not a guard. The
   detector now matches one-or-two spaces for the bootstrap class only, while both finding conventions
   stay anchored at two. **This is the T4-close one-space finding arriving inside the very engine this
   gate sweeps** — the sweep is made robust to the emission, which is not a fix of the emitter (15
   files, outside `Layers:`, still TD-bound).
2. **ROUTED, not fixed → filed at close as `TD-156`.** Eight `bad "<slug>: <prose>"` sites
   (`conformance-engine.sh` 1530 · 1817 · 1855 · 2420 · 2461 · 2475 · 2961 · 2971) put English where
   the regex expects a path — `core-file-missing: no unconditional rows parsed from §2` yields
   `path=no`. They parse, so they count as `reached`: the population reconciles while being
   semantically wrong. Dormant (they fire only if `STANDARD.md`'s own tables are malformed) and they
   fail **noisy, not silent** — a prose token is neither a file the target has nor a §2 canonical
   path, so the actionability check reports it unactionable and the case goes red. A path-vs-prose
   heuristic on a guard whose entire purpose is not to lie would cost more than it buys. Next id
   derived, not remembered: ledger max is TD-155 across 88 rows by two selectors, after discarding a
   `TD-9xx` maximum that is `evals/fixtures/` content (L-170, the second sighting this month).

**What the reviewer checked that held up** — recorded because a clean result on a real check is
evidence too: the reconciliation partitions with no double-count (the two arms are mutually exclusive
by construction, `[a-z]` vs `S[0-9]`); the `grep -v` exclusions do not drift from the `sed`
extractions; the two remediation blocks are byte-identical in content; `sweep_findings` is never
called inside a subshell that would discard its assignments; no stale-variable read path; and all
five then-new fixtures are non-vacuous, seeded three ways — including
`sweep-gate-clean-passthrough`, whose "no output, exit 0" shape looks vacuous and is not.

**Seeded-break discrimination proof (Tier G, ADR-029). ONE hash convention: `git hash-object`,
used exclusively — no `sha256sum`, no mixing of committed-blob and working-tree hashes (L-169).**
- Pristine `87acd15a90e9504cf26418a8a3a7b4e3ace869a4` — 483 lines, 34 `fixture(` labels.
- Seed: the bootstrap detector reverted to its two-space-only form (the pre-fix regex).
- **Parses** — `sh -n` clean. **Targeted** — line count 483 → 483, label count 34 → 34; a demolition
  is not a discrimination.
- **Reddened with a sibling green** — `sweep-excludes-engine-level-failure-one-space` failed alone;
  `sweep-engine-error-two-space-still-caught` stayed PASS, which is the control that proves the
  widening did not trade one blind spot for another (it varies the SELECTION — one space vs two — not
  the verdict, L-186).
- **Restored** — `git hash-object` re-read `87acd15a90e9504cf26418a8a3a7b4e3ace869a4`, matching
  pristine. The same hash was re-checked at merge-back into the coordinator tree and matched again.

**Verified by the coordinator, not accepted from a report (L-045 · L-060).** The one-space, two-space
and real-finding shapes were each fed through the *shipped* `sweep_findings` and routed correctly
(`engine_error`, `engine_error`, `reached=1`). The suite was then run from the coordinator tree and
read from **its own printed verdict line** — `FOREIGN-REPO FIXTURES: all green`, 17 fixtures.

consequence · T5 · behaviour:material · governance:high — review depth: two independent scoped
reviewers, one worktree-isolated adversarial (Tier G harness) and one read-through (Tier P prose),
plus coordinator re-verification. Both returned findings; both sets were acted on.

### 2026-09-13 | progress | `review ·` lines supplied for T5 and, back-filled, T2 — the gate named both

**How this surfaced.** The post-merge system-verify run against the integrated tree printed
`QA-CHECK: 219 pass, 3 fail` — read from the gate's own verdict line, not from an exit code, which the
background wrapper reported as 0 (L-120, the shape that keeps working). All three failures are
`check-review-depth.sh`:

```
FAIL  review-depth-governance-absent: ... T2's consequence line records governance:high and no review · line was ever appended for T2
FAIL  review-depth-material-absent:   ... T2's consequence line records behaviour:material and no review · line was ever appended for T2
FAIL  review-depth-governance-absent: ... T5's consequence line records governance:high and no review · line was ever appended for T5
```

Both are accurate. **Neither is a missing review; both are a missing record** — which is exactly the
distinction TD-085 put into this checker, because "no review line" is silence, and silence about a
governance:high task is indistinguishable from a review that never happened.

**T5.** The coordinator wrote its review depth as trailing prose on the `consequence ·` line instead of
as its own `^review · ` line. The checker anchors at column 1 and is right to: a depth recorded inside
another line's prose is not machine-readable, and this repository's own rule is that the record is what
counts, not the intent behind it. Supplied below in the declared vocabulary.

**T2, back-filled — and why that is a record correction rather than an invention.** T2's review is
attested twice in this log by the people who ran it, in entries written before this one:
*"T2's own fixtures, **its outside reviewer** and its harness all agree with each other"* (the
`surprise` entry on T2's Acceptance gap), and wave 1's completion entry, which lists T2 among the tasks
**merged and independently verified** and records that agent-dispatched outside reviewers create their
own worktrees. The line below records what those entries already establish and adds nothing to it —
depth and classification only, no claim about what the reviewer found. **Appended, never inserted next
to T2's own entry**, per this file's header: a past entry is corrected by a later one, so the gap and
its repair both stay visible.

review · T2 · scoped-reviewer (worktree-isolated, agent-dispatched) + coordinator re-verification · behaviour:material · governance:high
review · T5 · two scoped reviewers — one worktree-isolated adversarial (Tier G harness, two confirmed findings) and one read-through (Tier P prose, one confirmed correction) — + coordinator re-verification · behaviour:material · governance:high

**Worth keeping: the gate caught a governance gap that four humans-plus-agents did not.** T1, T3 and
T4 each got their `review ·` line at merge; T2 and T5 did not, and in both cases the review itself was
real and thorough. The failure mode is not laziness — it is that *writing the record* is a separate act
from *doing the thing*, and the second one feels like it discharges the first. That is the same shape
as this sprint's whole theme, one level up: a report that does not say what actually happened.

### 2026-09-13 | progress | DoD audit for T1–T4 — 24 of 25 ticked against per-box evidence, 1 left open

**Why this entry exists.** T1–T4 merged and were independently verified, but none of their 25 DoD
boxes was ticked. Owner directed an audit rather than a bulk tick (AskUserQuestion, 2026-09-13): read
each criterion against its own evidence, tick only what the record supports, and leave anything it
does not. The evidence is recorded **here**, not as annotations inside § Plan, so the Plan edit that
follows is a **pure checkbox change** — the exact case T2's normalisation makes safe, and therefore
no `scope-change` entry is owed for it. This entry lands before the ticks, per this file's header.

**T1 — 7 of 7 ticked.** Harness re-run by the coordinator at audit time: **17 fixtures, all green**
(`VERIFY-REACHES FIXTURES: all green`, read from its own verdict line).
- *EXISTS / distinct finding* — `basename-resolves-passes` · `basename-unresolvable-fails` →
  `verify-method-unresolvable`, distinct from `method-absent-fails` → `verify-method-absent`. The two
  findings are separate strings, which is what the criterion asks.
- *REACHES / boundaries + exclusion* — `exclusion-idiom-fails` and `prefix-collision-fails`, the two
  shapes the criterion names (an exclusion reading as reachable; `src/db` matching `src/dbtools/`),
  each with its own passing control. *Noted:* the discrimination seed exercised the exclusion arm; the
  prefix-collision arm rests on its retained pair, not on a separate seeded break.
- *Archive exemption → fixture* — `archive-arm-basename-skipped`, and the count re-derived to **9**,
  settled empirically against the unfixed checker over all 31 archived Verify-bearing sprints, with
  the breakdown itemised. The contest resolved **against** the coordinator's cross-check.
- *Motivating population, selection varied* — `archive-arm-basename-skipped` (the archive arm) and
  `two-method-clause-passes` (a clause naming two methods): exactly the two the criterion specifies.
- *Must-FAIL per leg + sibling control* — satisfied on both legs, per the pairs above.
- *Seeded break, one convention* — `git hash-object` vs `git rev-parse <ref>:<path>`, `98fdea1` both
  sides; landed, parsed, targeted (238/238 lines, 1/1 `bad(` sites), reddened alone with its sibling
  green.
- *Outside reviewer, worktree-isolated* — dispatched, and it caught a real regression (the
  `$VAR/literal/path` idiom) before merge.

**T2 — 5 of 6 ticked, 1 left OPEN.** Evidence for this task lives in its two commit bodies
(`49b027c`, `804308a`) rather than in a log entry, which is why the audit had to read the commits.
- *Normalised comparison* — `_norm_dod_checkbox` on both sides of `assert_S9_PLANFROZEN`, extended to
  both of `assert_S9_SCOPECHANGE`'s comparison lines. Ticked.
- *A genuine text change still demands its entry* — proven on a two-fixture A/B: tick-only → no
  finding; genuine text edit with no scope-change entry → **both** findings still fire. Ticked.
- *Control fixture load-bearing, both retained with own findings* —
  `s9-plan-frozen-tick-only-control`, `s9-scope-change-tick-only-control`, must-FAIL
  `s9-scope-change-after-edit`. Ticked.
- *Seeded break, one convention* — `git hash-object` (stated once, chosen because the content was
  uncommitted); landed, parsed, targeted (3167/3167 lines, 45/45 `assert_` fns), scoped to SCOPECHANGE
  alone; `s9-scope-change-tick-only-control` reddened while T2's own control stayed green and the
  must-FAIL still fired; restored byte-identical. Ticked.
- *Outside reviewer, worktree-isolated* — dispatched. Ticked.
- **LEFT OPEN — *pointed at its motivating artifact*.** The criterion names SPRINT-087's figures and
  says *re-derive those figures at build*: 28 ticks, zero text changes, `plan-edited-after-freeze`
  plus 8 × `scope-change-logged-after-plan-edit`, **9 of that run's 17 findings**. T2 derived the
  **1 + 8 = 9** split and said plainly it could not reproduce the **17** without a historical engine
  run against a checked-out tree. Wave 1 recorded that as an explicit carry-forward with the words
  *"it must not read at close as if it had been verified"*. Ticking it would do precisely that. Left
  open for an owner ruling (ADR-021: surface, never tick past quietly).

**T3 — 6 of 6 ticked.**
- *Positional binding* — `has_close`/`has_ruling` bound to each `system-verify ·` occurrence's own
  window. The agent **reproduced the masking bug before fixing it**, in both orderings, against the
  unpatched checker (`PASS`, exit 0 both times), so its fixture is written against observed behaviour
  rather than the debt row's description of it.
- *Pointed at live logs* — harness gained a leg over `docs/sprint/logs/*.md`; it runs and reports.
- *Two-entry fixture + control* — `second-entry-unruled-fails` / `second-entry-ruled-passes`.
- *TD-086 corrected where stale* — both stale clauses fixed; the audit also found the SPRINT-097 T1
  clause was itself wrong when added, verified against the row as filed (`9ed3fae`).
- *Seeded break, one convention* — `git hash-object` vs `git rev-parse`, `858ef66` both sides. **Two
  seeds were rejected before one qualified** (one never landed — `cmp` byte-identical; one failed
  `sh -n`), which is the guarding-the-seed bar doing its job rather than a formality.
- *Outside reviewer, worktree-isolated* — dispatched; caught a self-contradiction in the TD-086 edit
  before the coordinator saw it.

**T4 — 6 of 6 ticked.**
- *Informational findings carry their own token* — leg 2f-ter builds a separate `ce_out_display`; a
  FAIL this gate does not fold into its tally prints as `INFO`.
- *Policy unchanged, report only* — the fold-in greps read the unmodified `$ce_out`;
  `conformance-engine.sh` and `conformance.sh` are at **zero diff**, so the ADR-027 consumer contract
  is untouched.
- *A3 asserted, not assumed* — `ce-relay-tally-unchanged` holds `pass=2 fail=2` across the change,
  and every `ce_out` reader in the file was read.
- *Must-FAIL + control, distinguishable from printed output alone* —
  `ce-relay-informational-fail-prints-info` plus `ce-relay-engine-error-not-relabelled` and its
  control, the latter added in round 2 after the coordinator found the relabel was turning the
  engine's four setup-failure classes into `INFO`.
- *Seeded break, one convention* — `git hash-object` vs `git rev-parse`, `7584abb` both sides; exactly
  one case reddened, all five siblings green.
- *Outside reviewer, worktree-isolated* — two of them.

**A live confirmation of T2's Acceptance, obtained incidentally and worth recording.** T5's commit
ticked 4 DoD boxes — a real § Plan checkbox edit on this very sprint — and the full gate run
immediately after printed **`QA-CHECK: 220 pass, 0 fail`** with `S9.SCOPECHANGE` silent. T2's fix is
therefore confirmed on the artifact it was written for, not only on fixtures. That is the consumer-path
check (L-016) arriving for free, and it is stronger evidence than either of T2's own harnesses.

**What this audit did not do.** It did not re-run T2's or T4's full harnesses at audit time. T1's and
T3's were re-run; `evals/run-sprint-family-fixtures.sh` (~67 full-repo engine walks) is the suite this
host has killed three times for memory, which is already a filed close-time debt. The whole-tree
evidence used instead is the integrated gate run above — 220 pass, 0 fail — which exercises both.

### 2026-09-13 | progress | TD-105's denominator re-derived historically — the 9 reproduces exactly, the 17 does not exist at any measured point

**What was open.** T2's DoD 4 asks that SPRINT-087's figures be **re-derived at build**:
*"28 ticks, zero text changes, `plan-edited-after-freeze` plus 8 × `scope-change-logged-after-plan-edit`,
**9 of that run's 17 findings**."* T2 derived the **1 + 8 = 9** split and said plainly it could not
reproduce the **17** without a historical engine run against a checked-out tree. Wave 1 carried that
forward with the words *"it must not read at close as if it had been verified"*, so the box was left
unticked at the DoD audit rather than waved through.

**The run T2 could not do, done.** A detached worktree was created **outside the repository** (in the
session scratchpad, so the engine's known walk into `.claude/worktrees/` could not contaminate
anything) at two historical commits, and **each tree's own engine** was run against **that same tree** —
the historical engine, not today's, because the figure was produced by the engine of the day:

| Commit | What it is | SPRINT-087 state | `plan-edited-after-freeze` | `scope-change-logged-after-plan-edit` | **total FAIL** | GAP | FAIL+GAP |
|---|---|---|---|---|---|---|---|
| `c7687d3` | *"correct TD-105 — informational, not blocking; gate is 210/2"* — the commit that records the row's own gate figure | live, DoD ticked | 1 | 8 | **10** | 6 | 16 |
| `e3decef` | `sprint(087): close` | live, closing | 1 | 8 | **13** | 6 | 19 |

**The numerator reproduces exactly, at both commits.** `1 + 8 = 9`, with the finding names and the
per-tick-commit multiplicity precisely as TD-105 records them. That is the figure T2's fix was built
against, and it holds — which is the half that was load-bearing.

**The denominator does not reproduce, and cannot: it is not a fixed quantity.** It reads **10** at the
TD-105 correction commit and **13** two commits later, and the four lines that arrive in between are
all close-in-progress artifacts — `closed-sprint-not-archived` · `changelog-not-rotated-at-minor` ·
`retro-bucket-unrouted` · `dod-criterion-names-no-check`. `FAIL+GAP` moves 16 → 19 over the same span
and therefore passes **through 17** somewhere inside the close, which is the likeliest origin of the
row's figure. Not asserted as the answer: no commit measured here yields 17 by any selector tried.

**The finding, which is worth more than the number.** `9 of that run's 17` is a **ratio frozen against
a moving denominator**. The numerator is a property of the defect; the denominator is a property of
*when during a close someone happened to look*. Recording them as a ratio makes a stable fact look
contingent and an incidental fact look load-bearing — and it is unfalsifiable after the fact, because
"that run" names no commit. This is the sprint's own theme landing on a debt row: **a figure that does
not mean what it says**. The lesson is not "the row was wrong" — its substance and its numerator are
both right — but that **a count entering a frozen artifact should name the commit it was taken at**,
or it cannot be re-derived by anyone, which is precisely what stalled this box for two sprints.

**Disposition — ticked as re-derived-and-corrected, not as satisfied.** The criterion asked for a
re-derivation and got one: the 9 confirmed, the 17 refuted with two measurements and an explanation of
why no single value exists. This applies the standing ruling the owner gave for T5's DoD 1 earlier
today — *tick on the re-derived numbers and record the premise as corrected* (L-088: never re-read the
words to fit what was built; never round a measurement to meet a stated figure). **Surfaced rather
than absorbed**, so the owner can reverse it: nothing here depends on the denominator, and if the
preference is to leave the box open until 17 is located, the tick comes back off at no cost to T2's fix.

**TD-105's row is corrected at close**, alongside TD-089's: the `9 of the run's 17 FAILs` clause gains
the commit-anchored figures above. `TECH-DEBT.md` is outside T2's and T5's `Layers:` either way.
