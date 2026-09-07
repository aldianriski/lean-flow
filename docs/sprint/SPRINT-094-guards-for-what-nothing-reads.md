---
sprint: 094
slug: guards-for-what-nothing-reads
owner: Maintainer
last_updated: 2026-09-05
status: closed
gates_signed: G1,G2 @ 8681143
plan_commit: 2ab2b63
update_trigger: sprint execute/close events
---

# SPRINT-094 — Guards for What Nothing Reads

> **Theme:** Three defects, one shape. An **epic header** drifted a day out of date at SPRINT-092's
> close and every gate stayed green, because nothing reads epic state. A **handoff** carries the only
> record of a mid-sprint session and nothing converts it, because nothing reads handoff state. A
> **capability** shipped with zero callers three times in one sprint, because nothing reads the seam
> between tasks. None of these is a check that failed — each is a property with no reader at all, and
> a property with no reader cannot go red. This promote produced a fourth instance while running:
> `TD-101` and `TD-113` both escalated as `high` and aged, and both had been fixed for sprints,
> because the aging sweep reads a **status field** rather than the tree. That is the class this
> sprint gives readers to.

## Scope

**In:** an epic-state checker covering rollup completeness · header freshness · condition provenance ·
a tracked handoff status plus the §12(b) conversion step lean-flow prescribes and never performs ·
a mechanical detector for exported or registry-registered symbols with zero non-test callers ·
the 29 merged `worktree-agent-*` branches removed.

**Out (deferred):** EPIC-015's execution-autonomy surface — `TASK-319`'s live overnight run and
`TASK-320`'s fire-time run ledger, both still Backlog · `TASK-321`'s report-shape rule · `TASK-300`'s
one-task-or-five ruling on the gate-accuracy cluster · `TASK-322` (`needs-info`) and `TASK-188` /
`TASK-296` (`blocked`) · **archiving SPRINT-092 and SPRINT-093**, parked at this promote by owner
ruling and still gated on `TD-125` / `TASK-298` · any re-litigation of §12's placement rule, which is
settled and is not this sprint's question · a second stream, unavailable while `TASK-298` is
`needs-info`.

## Plan

### T1 — Check epic status at promote and close `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-epic-archive.sh` (widened at the G2 scope-change, not a second script) · `scripts/qa-check.sh` · `evals/fixtures/epic-state/` · `evals/run-epic-archive-fixtures.sh` (extended) · `skills/lean-doc-generator/SKILL.md` · `docs/epic/EPIC-015-execution-autonomy.md` (declared at execution per L-100 — the 7 real findings this guard produced, which the owner ruled T1 repairs) · `evals/fixtures/epic-archive/live-open/` (declared at execution — one retained control needed an attribution to stay a coherent epic under class (c); its discriminating property is untouched)
Depends-on: none
Cites: STANDARD §3 (ownership header) · §11 (retention) · `S11.EPIC` (the §11 rule this extends — one of the six checkable rules never in the semantic engine, TD-129) · `S3.SCHEMA` (the ownership-header rule this extends past field-presence) · ADR-029 (tier) · ADR-030 (contribution rows) · L-020 · L-166 · L-151 · TD-087 and TD-097 (two rows for one script — why this widens rather than adds) · `docs/epic/EPIC-014-reference-engine.md` (the class-(b) motivating artifact — read at `d43a7a1`, never modified; EPIC-015 moved to Layers at execution once the owner ruled T1 repairs the drift it found)

An epic is the only artifact in this repo whose correctness nobody can observe. `check-epic-archive.sh`
enforces §11 retention in both directions but reads archival eligibility alone; the ownership-header
family asserts `S3.SCHEMA` — that the fields are *present* — and never that `last_updated` tracks the
last body edit. So EPIC-014 sat with a 2026-08-29 header over a body edited 2026-08-31 through a fully
green gate, and would have kept sitting there. The check is cheap; the reason it does not exist is that
nobody was looking, which is the sprint's theme in its smallest form.

**Acceptance:** *(restated at the 2026-09-01 scope-change — the frozen wording claimed EPIC-015 stays
green, and it does not; L-185 · L-088.)* Against the **live tree before the fix**, the check REPORTS
**7 findings on EPIC-015** — 4 member rows carrying no `close_commit` (class a) and 3 ticked
§ Closed-when conditions naming no closing sprint (class c) — while EPIC-014 stays green on both,
and against `d43a7a1` it REPORTS EPIC-014's stale header (class b) while EPIC-015 stays green on that
one. After T1 repairs the drift it found, both epics are green. Each class therefore carries a real
failing artifact and a real passing sibling, and the difference is the drift, never the commit.

**DoD:**
- [x] Three drift classes reported for every `status: active` epic: **(a)** a member sprint that closed
      with no contribution row or `close_commit` in § Member sprints; **(b)** an ownership header whose
      `last_updated` predates its own `update_trigger`'s last firing — for an epic, the most recent
      member-sprint close; **(c)** a § Closed-when condition ticked with no member sprint naming what
      closed it — *Verify: judgment at promote, mechanical at close — the checker this task builds does
      not exist yet, so naming its path here would be a criterion whose method is absent. Once it lands
      in the always-on eval list, `sh scripts/qa-check.sh` reaches it and the verdict is that run's own
      printed `QA-CHECK: N pass, M fail` line, where M is the verdict — never a piped or redirected
      status (L-120)*
- [x] **Pointed at its real motivating artifact, not fixtures alone (L-166)** — EPIC-014 at `d43a7a1`
      is REPORTED by class (b). A guard that passes its own motivating case is an absent guard, and
      fixtures cannot tell you the branch is reachable — *Verify: check out `d43a7a1`, run, read the finding*
- [x] Retained must-FAIL fixture **plus a sibling control that stays green in the same run**: EPIC-015
      at `33187dc` is correctly rolled up and must not be reported. Fixtures are **retained**, not
      deleted with the prototype (TD-012) — *Verify: the fixture harness's own printed verdict line.
      Judgment at promote for the same reason as DoD 1; the harness joins the always-on eval list, so
      `sh scripts/qa-check.sh` names it in the run's output once it exists*
- [x] **Seeded-break discrimination proof** — the suite is shown to discriminate, not merely to be
      green: seed a break, confirm the case reddens **while the sibling control stays green**, verify
      the seed landed by `cmp` against the pristine copy, confirm the artifact still parses (`sh -n`)
      and that the break is **targeted** — assertion count unchanged, line count within one of pristine.
      Restored under **ONE stated hash convention**, `git hash-object <path>` against
      `git rev-parse <ref>:<path>`, named in the evidence block (L-137 · L-142 · L-169)
- [x] Wired where it fires, not merely present (L-020): the always-on eval list, a `qa-check.sh` leg,
      **and** `lean-doc-generator`'s § Sprint lifecycle — the close rollup step and the promote
      governance checklist both name it — *Verify: a full gate run naming the new harness in its output*
- [x] **Outside reviewer, dispatched worktree-isolated** (L-165 · L-168) — every Tier G change gets one,
      and the reviewer is isolated because adversarial verification *writes*

### T2 — Track handoff status and perform §12(b)'s conversion `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/handoff/SKILL.md` · `skills/lean-doc-generator/SKILL.md` · `skills/prime/SKILL.md` · `skills/lean-doc-generator/templates/sprint-log.md.template` · `scripts/lib/` · `scripts/qa-check.sh` · `evals/fixtures/handoff-state/` · `evals/run-handoff-state-fixtures.sh` (declared at execution per L-100 — the assertions had to pin field VALUES, not the phrase; asserting the phrase alone is what let a swapped-field finding pass 11 green fixtures) · `skills/lean-doc-generator/references/handoff-reconciliation.md` (declared at execution — written by this task's first pass and never declared)
Depends-on: none — but see **D1** (T1 and T2 share `scripts/qa-check.sh` — narrowed from three at the G2 scope-change) and **D2** (T1 and T2 share a capped SKILL.md)
Cites: STANDARD §12(a)/(b) · ADR-014 (the Execution Log) · L-151 · L-020 · L-015

**The placement is already correct and is not what this task changes.** §12(b)'s *Meeting notes* row
governs a raw session record — *convert outcomes into requirements / ADRs / issues; never commit the
raw notes* — and §12(a) independently excludes anything temporary. A handoff body in the OS temp dir
is right by the standard, and session history is correctly untrackable in-repo. What §12(b) also
prescribes is the **conversion**, and lean-flow ships no step that performs it: the handoff is written,
the session ends, and whether anything in it reached a durable home is answered by nobody. That is
L-020's shape and L-151's consequence in one.

**Acceptance:** after a handoff is taken, "was this actioned, or is it still live?" is answerable from
the repository alone, without opening the temp file or having been in the session.

**DoD:**
- [x] **The status half.** A handoff carries a tracked status recorded repo-side where the sprint's
      readers already look — `live` (a session may still resume it) · `consumed` (a session resumed it
      and the work continued) · `spent` (superseded, or the sprint closed past it). An **UNKNOWN status
      FAILs**; it is never assumed `spent`, because the assumption is exactly what makes the loss silent
- [x] **The conversion half.** At close, any handoff not `spent` is reconciled: every item in it not
      already durable (sprint file · Execution Log · TODO · TECH-DEBT · LEARNINGS · a commit) is routed
      to its durable home, or explicitly ruled as needing none. A ruling is a record; silence is not
- [x] Retained must-FAIL: a sprint closing with a `live` handoff outstanding FAILs **with its named
      finding**, while a sibling control (all handoffs `spent`) passes in the same run — one fixture per
      check, each failing with the finding it is named for (L-058)
- [x] **Seeded-break discrimination proof** under ONE stated hash convention, seed verified landed by
      `cmp`, artifact still parses, break targeted not demolition (L-137 · L-142 · L-169)
- [x] **The consumer path is checked, not inferred from our dogfooding** (L-015 · L-016) — nothing
      repo-specific leaks into `handoff/SKILL.md` or `prime/SKILL.md`, both of which ship to consumers,
      and the mechanism is traced on the consumer scenario since this repo may not generate one
- [x] Outside reviewer, worktree-isolated (L-165 · L-168)

### T3 — Detect a shipped capability that nothing calls `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `test/architecture/` (the new unwired-exports fitness rule, beside `dependency-direction.test.ts`) · `test/fixtures/`
Depends-on: none — and no longer part of **D1**: `scripts/qa-check.sh` left this task's Layers at the G2 scope-change, so the shared-file map is now T1–T2 only
Cites: L-172 (`count: 2`, promoted at SPRINT-092) · L-020 · L-166 · TD-103 · TD-129 (the migration's measured condition — why this is TS, not Shell) · `CLAUDE.md` § Definition of Done (where L-172's durable form already lives — read, never modified) · SPRINT-091 T11 and SPRINT-091 T12 (the motivating commits — cited, no dependency either way) · `scripts/qa-check.sh` (the gate that invokes the Bun runner, per ADR-035 — read, never modified)

`L-172`'s durable form is already in `CLAUDE.md` § Definition of Done: the wiring property is asked *of
the repository, never of the author*, because a per-task DoD cannot enforce something living **between**
tasks — each builder was correct inside their declared `Layers:` and the seam sat outside all of them.
That rule has now been promoted and live through three sprints that shipped the class anyway. The
promotion's own text names the fix: the property is mechanically detectable, so derive it.

**Acceptance:** run against the tree at each of the three commits that shipped an unwired capability,
the check reports it — and stays green on a symbol with a real production caller.

**DoD:**
- [x] Any exported or registry-registered symbol in `packages/` or `apps/` with **zero non-test callers**
      is reported — *Verify: the checker's own printed verdict line*
- [x] **Pointed at the three real artifacts that motivated it, not fixtures alone (L-166)** —
      `attachLevel` before SPRINT-091 T11, `createF4Registry` / `createS4AppendRegistry` before T12, and
      TD-103's `reconcile()` / `marksInStandard()`; each must be reported when run against the tree at
      the commit that shipped it unwired
- [x] Retained must-FAIL fixture plus a sibling control — a symbol WITH a production caller stays green
- [x] **Seeded-break discrimination proof** verified landed under ONE stated hash convention
      (L-137 · L-142 · L-169)
- [x] Outside reviewer, worktree-isolated (L-165 · L-168)

### T4 — Prune the 29 merged `worktree-agent-*` branches `[size: S · risk: low · class: mechanical-ingest · AFK · J1]`
Layers: git refs only — no tracked file changes
Depends-on: none
Cites: SPRINT-092 close (18 worktrees / 178 MB removed, their branches were not)

**Acceptance:** `git branch --list 'worktree-agent-*'` lists only branches that are not ancestors of
`main`, each one reported with why it was kept.

**DoD:**
- [x] Every `worktree-agent-*` branch **confirmed an ancestor of `main`** is deleted — *Verify:
      `git merge-base --is-ancestor <branch> main` per branch, before the delete, not after*
- [x] Any branch that is **NOT** an ancestor is **reported rather than removed** — the count of all 29
      is re-derived here, never inherited: 18 were verified merged at SPRINT-092's close and the
      remaining 11 were never checked
- [x] No tracked file changes (this is a refs-only task, and a diff would mean something went wrong)

## Owner-action checklist
- [x] **Sign G1 + G2**, then record `gates_signed: G1,G2 @ <sha>` in this file's frontmatter. Omitted
      until signed — its absence means NOT signed and must never be read as approval (L-099)
      — ✓ **signed at `8681143`**, the tree the gates were reviewed against, recorded in this file's
      frontmatter where an unattended run would read it rather than in a session transcript (L-099 ·
      L-151). G1 ran the **full** checklist on all four tasks, not the fast-path: none is
      `origin: decomposer`, read from each task's own `origin:` field. Promote entry in the Execution Log
- [x] **Rule at G2 on T2's one open design question**, which §12 does not settle: where the repo-side
      handoff stub lives when a handoff is taken with **no sprint file to log into** — governance work,
      a `/triage` pass, a research session. The Execution Log is the obvious home when a sprint exists
      and is unavailable when one does not. Note that `lean-doc-generator`'s own headless-park
      instruction resolves that case *to the handoff doc*, which is circular here and must not be
      inherited as the answer. **The ruling is the deliverable of this line** — without it T2's first
      DoD has no reachable target, which is L-111's shape
      — ✓ **owner ruled: Execution Log `handoff` event where a sprint exists, plus one named fallback
      ledger for the no-sprint case**, both carrying the same three-state status. The fallback is not
      optional trimming: without it an UNKNOWN status in the no-sprint case would have to be assumed
      `spent`, which is the silent-loss shape T2 exists to close. The circular headless-park answer was
      explicitly not inherited. Recorded in the Execution Log's promote entry, not only here
- [ ] **Ruling still outstanding from this promote (not a blocker for T1–T4):** archiving SPRINT-092
      and SPRINT-093. Parked by owner ruling; they share `plan_commit: c52496f`, so it is archive both
      together or measure again — `check-layers-observed.sh:397` drops `*/archive/*` from the sibling
      list `:429` uses, which is what re-attributed one sprint's history to the other (214 pass / 0 fail
      in place vs 202 pass / 1 fail archived). `TD-125` · `TASK-298`

## Decisions (pre-locked)
- **D1 — `scripts/qa-check.sh` is single-owned and committed in task order T1 → T2, never in
  parallel.** **Narrowed at the G2 scope-change from three tasks to two:** T3 moved to
  `test/architecture/` under `bun test`, so it no longer declares this file and drops out of the
  shared-file map entirely. Two tasks still add a leg to it. A plain `git add` over another task's WIP
  stages their uncommitted work into your commit and mis-attributes history (L-042 · L-037); the
  dispatch overlap map is built from `Layers:`, which is why both declare it. Serialize, or stage
  per-hunk with `git add -p` and verify `git diff --cached` before committing.
- **D2 — `skills/lean-doc-generator/SKILL.md` is owned by T1; T2 appends after T1 commits.** It sits at
  **126 lines against ADR-006's ~140 cap**, so two tasks share 14 lines of headroom. If both additions
  will not fit, the content moves to that skill's `references/` (uncounted, ADR-006) rather than the cap
  being raised — a cap is never raised to fit content.
- **D3 — no new decision task for the handoff placement question.** STANDARD §12(a)/(b) already rules
  it: the temp-dir body is correct and session history is correctly untracked. Filing an ADR to
  re-decide a settled rule would be the failure, not the rigour; only the *unwired conversion* is work.
  Recorded because "is this optimal?" was asked and answered, and an answer nobody can find was not given.
- **D4 — all four tasks are Tier G except T4, and the tier is declared here, not inferred (ADR-029).**
  T1 · T2 · T3 are guards — a false negative in any of them is silent by construction, which is the
  entire reason they exist — so each takes the full bar: retained must-FAIL, sibling control,
  seeded-break discrimination proof under one hash convention, and an outside reviewer dispatched
  worktree-isolated. T4 is `mechanical-ingest` over git refs and takes L-007's exercise-on-real-input
  half alone.

## Assumptions
- **A1** — The three drift classes in T1 are not already covered by an existing checker. *Confirm: at
  G2, re-derive against `check-epic-archive.sh` (archival eligibility only) and the `S3.SCHEMA`
  ownership-header family (field presence only) before writing a new script. If the header half is
  reachable by widening an existing checker, prefer that and say so — a second checker with an
  overlapping subject is how TD-087 and TD-097 came to be two rows for one script.*
- **A2** — The handoff status can live in a repo-side record without re-inventing the Execution Log.
  *Confirm: at G2, read `templates/sprint-log.md.template`'s event vocabulary (`promote · progress ·
  surprise · scope-change · park · blocker · run-complete · close`) and rule whether `handoff` is a new
  event or an existing one already carries the fact. If it already does, the scope narrows to reading it.*
- **A3** — T3's class is mechanically detectable from imports and registrations without running the
  code. *Confirm: at G2, re-derive against the three motivating artifacts before designing. If a symbol
  reached only through a registry string proves undetectable statically, the scope narrows to exported
  symbols and says so — narrowing on evidence, not quietly.*
- **A4** — All 29 `worktree-agent-*` branches are merged. *Confirm: T4 re-derives per branch. This is
  known true for only 18 of them (verified at SPRINT-092's close); the other 11 were never checked, so
  the figure is inherited and must not be.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-094-guards-for-what-nothing-reads.md`, rendered
> from `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never
> here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/lib/check-epic-archive.sh` | T1 | +169 — a second direction, `epic-state:`, so rollup drift is distinguishable from a retention finding without parsing the sentence (L-058) | med | `evals/run-epic-archive-fixtures.sh` — 17 cases |
| `evals/run-epic-archive-fixtures.sh` | T1 | +91 — 10 new cases, 5 of them reachability cases the independent pass proved were missing | low | itself (always-on leg 2b) |
| `docs/epic/EPIC-015-execution-autonomy.md` | T1 | the 7 real findings the new guard produced, repaired — 4 `close_commit` values derived from each member sprint's own frontmatter, 3 condition attributions read from the member rows' own text | low | the guard that found them |
| `scripts/lib/check-handoff-state.sh` | T2 | +202 — a handoff carries `live`/`consumed`/`spent`; UNKNOWN is never assumed `spent`; a sprint may not close over a non-`spent` handoff (§12(b)'s conversion, prescribed and never performed) | **high** | `evals/run-handoff-state-fixtures.sh` — 25 cases |
| `evals/run-handoff-state-fixtures.sh` | T2 | +240 — every assertion pins the finding's **values**, not its phrase (L-108 applied to the test's own assertion) | med | itself (always-on) |
| `skills/handoff/SKILL.md` · `skills/prime/SKILL.md` | T2 | write and read sides of the vocabulary, inlined — no repo path, so a consumer gets the mechanism rather than our gate (L-015) | low | consumer trace, end-to-end |
| `skills/lean-doc-generator/SKILL.md` (+ `references/handoff-reconciliation.md`) | T1·T2 | promote + close checklist lines; the reconciliation protocol moved to `references/` rather than raising the cap — **138/140** under D2 | low | line count |
| `skills/lean-doc-generator/templates/sprint-log.md.template` | T2 | `handoff` event + the two-field shape; the leaked `scripts/lib/…` path removed (DoD 5) | low | 35-template sweep: **zero** `scripts/` / `evals/` references |
| `spec/STANDARD.md` · `spec/CHANGELOG.md` | T2 | `HANDOFF-LEDGER.md` registered with its lifecycle contract; **0.10.0 → 0.11.0** | med | `read-spec-rules.sh` emits **100 rows byte-identical by `cmp`** to the frozen surface — no rule added, amended or reclassified, so no verdict can move |
| `test/architecture/unwired-exports.ts` (+ `.test.ts`) | T3 | +340 / +349 — an exported symbol with zero non-test callers is reported, off resolved ES import **edges**, never a bare-identifier grep | med | 39 tests · `bun test test/architecture/` |
| `test/architecture/layers.ts` | T3 | the `fixtures` exclusion removed — the two readers returned different file sets for the same tree | low | a test that builds a real throwaway commit and asserts both readers agree |
| `scripts/qa-check.sh` | T1·T2 | both new harnesses joined `eval_harnesses_always`; leg 2b relabelled `epic retention + rollup currency` — a leg whose label under-describes it is a capability nobody finds | low | the gate's own printed verdict line |
| `TECH-DEBT.md` | close | TD-130 · TD-131 (extended) · TD-132 · TD-133 · TD-134 · TD-135 · TD-136 filed in-session; TD-137 at close | low | — |
| git refs only | T4 | 29 `worktree-agent-*` branches deleted, each verified an ancestor of `main` individually first | low | `git branch --list 'worktree-agent-*'` → 0 |

## Retro

**Closed at 22 of 23 DoD.** The single open box is the owner-action ruling on archiving SPRINT-092/093,
recorded at promote as *not a blocker for T1–T4* and still gated on `TD-125` / `TASK-298`.
T1 6/6 · T2 6/6 · T3 5/5 · T4 3/3 · Owner-action 2/3.

**The theme held, and then landed on the sprint itself.** Three properties with no reader got one. But
the instructive result is not the three guards — it is that **every CRITICAL defect inside them was found
by an independent pass and none by the author**, with the governing rules loaded and on screen the whole
time. T1's review found 3 HIGH / 3 MEDIUM / 1 LOW inside DoD the author had already ticked, minutes
after its own seeded-break proof ran clean. T2 needed **five** review rounds on one 40-line function;
rounds 1–3 each found a silent false negative, and round 2's finding was a regression *round 1's fix had
introduced*. T3's review found a HIGH the author's proof could not have reached.

**One through-line explains all three reviews:** the detection logic was sound in every case; the **set
of artifacts it was applied to** was not. Which row is selected, which sprints count as closed, which
paths are searched, which export forms are seen — and not one fixture varied that set. Fixtures
discriminate *branches*; nothing discriminated *reachability*. → `L-186`.

### Buckets (STANDARD §10) — all four routed

| Bucket | Routed to |
|---|---|
| **Shipped** | `CHANGELOG.md` § SPRINT-094 — the three guards, the branch prune, `spec/` 0.11.0 |
| **Tech debt** | `TD-130` · `TD-131` (extended) · `TD-132` · `TD-133` · `TD-134` · `TD-135` · `TD-136` filed in-session; **`TD-137`** filed at close — 13 `scripts/…` references leak this repo's paths into 4 consumer-facing `skills/orchestrator/` files |
| **Follow-ups** | **`TASK-326`** (nothing compares a commit's claimed DoD delta against the ticks it actually made) · **`TASK-327`** (`check-handoff-state.sh` is proven on fixtures and has never fired on live input) — both `origin: close-retro` |
| **Learnings** | **`L-186`** · **`L-187`** · **`L-188`** new; `L-165` → count 5 · `L-166` → count 4 · `L-120` seventh sighting · `L-060` two further sightings |

### Retrieval-miss check — yes, twice, and both are filed

Two prior rules were **loaded, correct, and contradicted in this session's own hands**. `L-120`: the
gate was backgrounded as `sh scripts/qa-check.sh 2>&1 | tail -3`, so the harness reported `tail`'s exit
0 for a run whose gate had failed and every FAIL detail was discarded — piping a gate into `tail` reads
as *capturing output*, not as *discarding the evidence*, which is exactly why the rule keeps not firing.
`L-142`: `cmp` was trusted as a seed-landing guard on a CRLF checkout, where the local `awk` / `sed`
rewrite line endings, so a semantically inert seed reported as landed. Both → `L-187`, and the `L-120`
entry carries its seventh channel.

### What is NOT evidence this sprint may close, stated rather than smoothed

**System-verify produced no usable verdict, and `TD-135` is why** — two full `bun test` runs over the
same unchanged tree disagreed (`496 pass, 1 fail`, then `497 pass, 0 fail`) with no test code changed
between them. The close therefore rests on the **opt-in gate profile** (`QA_FULL=1 sh scripts/qa-check.sh`)
read off the line the gate itself prints, plus each harness's own printed verdict — never a piped or
redirected status (L-120).

### One authoring convention this sprint's own log now owes

T2's parser is strict by ruling: **nothing is skipped, because anything a parser skips it can be made to
skip over a real violation.** The cost is that a fenced block containing a complete, correctly-shaped
example record would now be read as real. A sweep of all 48 `docs/sprint/**/logs/SPRINT-*.md` found zero
current matches, and this log was checked directly. The convention that follows: **never write a literal
handoff heading followed by two field lines when illustrating the format** — describe it, or break the
shape. Recorded here rather than defended in more parser code.
