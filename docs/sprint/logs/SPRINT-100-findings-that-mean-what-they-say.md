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
