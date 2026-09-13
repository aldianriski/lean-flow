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
