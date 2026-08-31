---
sprint: 094
slug: guards-for-what-nothing-reads
owner: Maintainer
last_updated: 2026-08-31
status: active
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
Layers: `scripts/lib/check-epic-archive.sh` (widened at the G2 scope-change, not a second script) · `scripts/qa-check.sh` · `evals/fixtures/epic-state/` · `evals/run-epic-archive-fixtures.sh` (extended) · `skills/lean-doc-generator/SKILL.md`
Depends-on: none
Cites: STANDARD §3 (ownership header) · §11 (retention) · `S11.EPIC` (the §11 rule this extends — one of the six checkable rules never in the semantic engine, TD-129) · `S3.SCHEMA` (the ownership-header rule this extends past field-presence) · ADR-029 (tier) · ADR-030 (contribution rows) · L-020 · L-166 · L-151 · TD-087 and TD-097 (two rows for one script — why this widens rather than adds) · `docs/epic/EPIC-014-reference-engine.md` and `docs/epic/EPIC-015-execution-autonomy.md` (the motivating artifact and its sibling control — read, never modified)

An epic is the only artifact in this repo whose correctness nobody can observe. `check-epic-archive.sh`
enforces §11 retention in both directions but reads archival eligibility alone; the ownership-header
family asserts `S3.SCHEMA` — that the fields are *present* — and never that `last_updated` tracks the
last body edit. So EPIC-014 sat with a 2026-08-29 header over a body edited 2026-08-31 through a fully
green gate, and would have kept sitting there. The check is cheap; the reason it does not exist is that
nobody was looking, which is the sprint's theme in its smallest form.

**Acceptance:** run against the tree at `d43a7a1`, the check REPORTS EPIC-014's stale header; run
against `33187dc`, it stays green on EPIC-015 — and the difference is the drift, not the commit.

**DoD:**
- [ ] Three drift classes reported for every `status: active` epic: **(a)** a member sprint that closed
      with no contribution row or `close_commit` in § Member sprints; **(b)** an ownership header whose
      `last_updated` predates its own `update_trigger`'s last firing — for an epic, the most recent
      member-sprint close; **(c)** a § Closed-when condition ticked with no member sprint naming what
      closed it — *Verify: judgment at promote, mechanical at close — the checker this task builds does
      not exist yet, so naming its path here would be a criterion whose method is absent. Once it lands
      in the always-on eval list, `sh scripts/qa-check.sh` reaches it and the verdict is that run's own
      printed `QA-CHECK: N pass, M fail` line, where M is the verdict — never a piped or redirected
      status (L-120)*
- [ ] **Pointed at its real motivating artifact, not fixtures alone (L-166)** — EPIC-014 at `d43a7a1`
      is REPORTED by class (b). A guard that passes its own motivating case is an absent guard, and
      fixtures cannot tell you the branch is reachable — *Verify: check out `d43a7a1`, run, read the finding*
- [ ] Retained must-FAIL fixture **plus a sibling control that stays green in the same run**: EPIC-015
      at `33187dc` is correctly rolled up and must not be reported. Fixtures are **retained**, not
      deleted with the prototype (TD-012) — *Verify: the fixture harness's own printed verdict line.
      Judgment at promote for the same reason as DoD 1; the harness joins the always-on eval list, so
      `sh scripts/qa-check.sh` names it in the run's output once it exists*
- [ ] **Seeded-break discrimination proof** — the suite is shown to discriminate, not merely to be
      green: seed a break, confirm the case reddens **while the sibling control stays green**, verify
      the seed landed by `cmp` against the pristine copy, confirm the artifact still parses (`sh -n`)
      and that the break is **targeted** — assertion count unchanged, line count within one of pristine.
      Restored under **ONE stated hash convention**, `git hash-object <path>` against
      `git rev-parse <ref>:<path>`, named in the evidence block (L-137 · L-142 · L-169)
- [ ] Wired where it fires, not merely present (L-020): the always-on eval list, a `qa-check.sh` leg,
      **and** `lean-doc-generator`'s § Sprint lifecycle — the close rollup step and the promote
      governance checklist both name it — *Verify: a full gate run naming the new harness in its output*
- [ ] **Outside reviewer, dispatched worktree-isolated** (L-165 · L-168) — every Tier G change gets one,
      and the reviewer is isolated because adversarial verification *writes*

### T2 — Track handoff status and perform §12(b)'s conversion `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/handoff/SKILL.md` · `skills/lean-doc-generator/SKILL.md` · `skills/prime/SKILL.md` · `skills/lean-doc-generator/templates/sprint-log.md.template` · `scripts/lib/` · `scripts/qa-check.sh` · `evals/fixtures/handoff-state/`
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
- [ ] **The status half.** A handoff carries a tracked status recorded repo-side where the sprint's
      readers already look — `live` (a session may still resume it) · `consumed` (a session resumed it
      and the work continued) · `spent` (superseded, or the sprint closed past it). An **UNKNOWN status
      FAILs**; it is never assumed `spent`, because the assumption is exactly what makes the loss silent
- [ ] **The conversion half.** At close, any handoff not `spent` is reconciled: every item in it not
      already durable (sprint file · Execution Log · TODO · TECH-DEBT · LEARNINGS · a commit) is routed
      to its durable home, or explicitly ruled as needing none. A ruling is a record; silence is not
- [ ] Retained must-FAIL: a sprint closing with a `live` handoff outstanding FAILs **with its named
      finding**, while a sibling control (all handoffs `spent`) passes in the same run — one fixture per
      check, each failing with the finding it is named for (L-058)
- [ ] **Seeded-break discrimination proof** under ONE stated hash convention, seed verified landed by
      `cmp`, artifact still parses, break targeted not demolition (L-137 · L-142 · L-169)
- [ ] **The consumer path is checked, not inferred from our dogfooding** (L-015 · L-016) — nothing
      repo-specific leaks into `handoff/SKILL.md` or `prime/SKILL.md`, both of which ship to consumers,
      and the mechanism is traced on the consumer scenario since this repo may not generate one
- [ ] Outside reviewer, worktree-isolated (L-165 · L-168)

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
- [ ] Any exported or registry-registered symbol in `packages/` or `apps/` with **zero non-test callers**
      is reported — *Verify: the checker's own printed verdict line*
- [ ] **Pointed at the three real artifacts that motivated it, not fixtures alone (L-166)** —
      `attachLevel` before SPRINT-091 T11, `createF4Registry` / `createS4AppendRegistry` before T12, and
      TD-103's `reconcile()` / `marksInStandard()`; each must be reported when run against the tree at
      the commit that shipped it unwired
- [ ] Retained must-FAIL fixture plus a sibling control — a symbol WITH a production caller stays green
- [ ] **Seeded-break discrimination proof** verified landed under ONE stated hash convention
      (L-137 · L-142 · L-169)
- [ ] Outside reviewer, worktree-isolated (L-165 · L-168)

### T4 — Prune the 29 merged `worktree-agent-*` branches `[size: S · risk: low · class: mechanical-ingest · AFK · J1]`
Layers: git refs only — no tracked file changes
Depends-on: none
Cites: SPRINT-092 close (18 worktrees / 178 MB removed, their branches were not)

**Acceptance:** `git branch --list 'worktree-agent-*'` lists only branches that are not ancestors of
`main`, each one reported with why it was kept.

**DoD:**
- [ ] Every `worktree-agent-*` branch **confirmed an ancestor of `main`** is deleted — *Verify:
      `git merge-base --is-ancestor <branch> main` per branch, before the delete, not after*
- [ ] Any branch that is **NOT** an ancestor is **reported rather than removed** — the count of all 29
      is re-derived here, never inherited: 18 were verified merged at SPRINT-092's close and the
      remaining 11 were never checked
- [ ] No tracked file changes (this is a refs-only task, and a diff would mean something went wrong)

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

## Retro

<!-- Written at close. Route the four buckets to their durable homes (STANDARD §10). -->
