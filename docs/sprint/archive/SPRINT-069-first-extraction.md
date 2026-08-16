---
sprint: 069
slug: first-extraction
epic: EPIC-003
owner: Maintainer
last_updated: 2026-08-16
status: closed
gates_signed: G1,G2 @ d832200
plan_commit: 0880347
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-069 — First Extraction

> **Theme:** EPIC-003's first member sprint — the standard stops being one skill's reference file
> and becomes a versioned artifact an adopter can pin. T1 rules the conformance levels the epic
> routes here; T2 is the move itself, atomic per ADR-023; T3 is its follow-through. T4 and T5 are
> two small guards carried from SPRINT-068's close, unrelated to the extraction and file-disjoint
> from it.

## Scope

**In:** rule the conformance levels (T1) · move the standard into a versioned `spec/` tree at
v0.1.0, one move+cite commit (T2) · sweep the textual section citations to the new name (T3) ·
guard the two Layers-family checkers against bare invocation (T4) · ignore `.claude/worktrees/`
(T5).

**Out (deferred):** the conformance *engine* that checks a level — EPIC-004, and a level that
cannot be described without it belongs there, not in T1 · the git-native attestation format
(EPIC-003, a later member sprint) · re-pointing skills that *restate* a spec-owned rule rather than
cite it — that is the epic's fourth Scope item and needs the spec to exist first · TD-053 leg 1
(the `find`-walk false positive), which stays routed to EPIC-004 D1.

## Plan

### T1 — Rule the conformance levels and what makes each independently checkable `[size: S · risk: med · class: decision · HITL]`
Layers: `docs/adr/` · `docs/DECISIONS.md` · `docs/epic/EPIC-003-the-standard.md`
Depends-on: none
Cites: EPIC-003 § Open questions (1) — "→ first member sprint's G2" · ADR-018 (names conformance
       levels as what an adopting org pins) · L-094 (a ruling is closed by deciding, not by waiting)
The epic routes this question here by name, and the extraction that follows is shaped by the answer:
levels decide whether the spec is one document or several. Ruling it after the move would mean
re-cutting the tree.

**Acceptance:** a recorded ruling naming the levels, their order, and per level the property that
makes it checkable in principle — with EPIC-003 open question 1 struck through and pointing at it.

**DoD:**
- [x] The levels named and ordered, with the WHY for the count over the alternatives —
      *Verify: ruling recorded (ADR if §4's three tests all hold); reviewer reads ADR-018 as comparand*
      ✓ ADR-024 (all three §4 tests hold; owner ruled three levels by popup 2026-08-16). The WHY is
      evidence-class distinctness, not a preferred count; 3-row alternatives table
- [x] Each level carries the property that makes it independently checkable **in principle**, with
      the engine explicitly out of scope — *Verify: no level's description requires EPIC-004 to exist*
      ✓ per-level evidence class stated (file tree · planning record · git history alone); the
      exclusion is stated outright in § Decision. All three descriptions re-read for an engine
      dependency: none found
- [x] EPIC-003 open question 1 struck through with a pointer to the ruling —
      *Verify: the epic's § Open questions*
      ✓ struck through + pointer to ADR-024; epic cap 87/200 after the edit

### T2 — Extract the standard to `spec/` v0.1.0 in one move+cite commit `[size: M · risk: med · class: execution · HITL]`
Layers: `spec/` (new) · `skills/lean-doc-generator/references/DOCS_Guide.md` ·
        `skills/lean-doc-generator/SKILL.md` · `scripts/lib/check-doc-caps.sh` ·
        `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `README.md` ·
        `docs/architecture/overview.md` · `docs/epic/EPIC-003-the-standard.md` ·
        `SECURITY.md` · `docs/LEARNINGS.md`   (both added mid-sprint — L-100, logged)
Depends-on: T1
Cites: ADR-023 (move+cite atomic; the extracted tree becomes SSOT, CONTEXT.md a consumer) ·
       ADR-018 § Decision · EPIC-003 § Scope · L-097 (re-derive a stated figure before acting on it)
The epic's claim — an adopter can take the standard without the plugin — is false while the spec is
a file inside one skill's `references/`. This is the commit that makes it true. It also unlocks the
epic's fourth Scope item: today only `lean-doc-generator` may cite the guide, because a skill never
points into another skill's `references/`.

**Acceptance:** the standard lives in a versioned `spec/` tree under a name that reads as a standard,
every path reference resolves, and the gate is green — in one commit, with no commit in history
leaving a rule stated in two places.

**DoD:**
- [x] The document moved and renamed, carrying `version: 0.1.0` in its ownership header, beside
      `spec/CHANGELOG.md` — *Verify: `git show --stat` shows an `R` rename; the gate's ownership leg*
      ✓ `spec/STANDARD.md` 497 lines (rename detected 99% similar in the builder's commit), header
      carries `version: 0.1.0`; `spec/CHANGELOG.md` created; old path confirmed absent
- [x] Every **path** reference re-pointed, count re-derived at execution rather than taken from any
      figure written at promote (L-097) — *Verify: a repo-wide search for the old path returns only
      history (archived sprints · rotated changelogs), reconciled by a second query that sums*
      ✓ builder: 85 pre-edit = 12 fixed + 73 history/frozen. Coordinator re-derived independently
      post-merge: 5 live refs remain, each accounted for — ADR-018 (append-only) · loop-hygiene-prd
      (frozen, superseded) · platform-readiness-audit (F3's evidence, flagged) · this Plan's own
      T2 Layers line · `spec/CHANGELOG.md`'s deliberate historical citation
- [x] `check-doc-caps.sh`'s default guide path follows the move — *Verify: the gate's cap legs still
      report per-file caps, not a parse failure; a deliberate wrong path FAILs*
      ✓ one-line default fix; cap legs report per-file caps in the integrated gate run, and the
      builder verified a deliberate wrong path FAILs loudly ("standard not readable")
- [x] `.claude/CLAUDE.md`'s self-contained principle states what is true after the move —
      *Verify: the line no longer claims lean-doc-generator bundles the standard*
      ✓ now reads "bundles its own templates **and cites the standard from the versioned `spec/`
      tree (ADR-023), rather than owning a copy**"; CLAUDE.md 63/80
- [x] Nothing is stated twice — *Verify: named review check "is any rule now stated twice?" (ADR-023
      requires it per member sprint); the old home is a citation, never a copy*
      ✓ `git mv` left no content at the old path (confirmed absent), so there is no old home to
      restate from; every fix is a pointer. Asked and answered explicitly by the builder, re-checked
      by the coordinator against the 5 surviving references — all citations, none a copy
- [x] Whole gate green in one run over the committed tree — *Verify: `sh scripts/qa-check.sh`*
      ✓ **151 pass / 0 fail** over the integrated tree (the builder's own worktree run was
      unrepresentative — stale base, see the Log)

### T3 — Sweep the standard's textual section citations to the new name `[size: M · risk: low · class: mechanical-ingest · AFK]`
Layers: `skills/` · `skills/lean-doc-generator/templates/` · `docs/` · `scripts/lib/` · `evals/` ·
        `AGENTS.md` · `scripts/qa-check.sh` · `.claude/CONTEXT.md` · `README.md` · `SECURITY.md` ·
        `run-doc-caps-fixtures.sh`   (all added mid-sprint — L-100, logged. The sweep reaches root
        files and the gate script's own comments, and the two Layers checkers match by explicit path
        or token identity where the preflight's ownership map reads directory globs — so a
        directory-level declaration satisfies one and fails the others)
Depends-on: T2 · T4
Cites: ADR-023 (a name lagging is not a rule stated twice — which is why this is separate) ·
       L-118 (a single query's zero means clean **or** unreached) · L-009 (re-read the whole
       structure after a table-row or list-entry edit)
These are stale names rather than broken links, so folding them into T2 would turn an atomic move
into a ~70-file commit — the shape where a structure-adjacent edit fuses neighbouring rows unseen.

**Acceptance:** no live surface cites the standard by its pre-extraction document name.

**DoD:**
- [x] The citation set re-derived at execution, never read off this Plan — *Verify: two queries that
      reconcile (total mentions = renamed + legitimately-unchanged); a bare zero is not evidence*
      ✓ re-derived **140 live** (the Plan's 128 was an estimate and was not used). Before:
      live 140 + history 276 = 416. After: live 54 + history 276 = 330. **86 sites swept** = 88
      sweepable − 2 reverted. Both totals reconcile in both directions
- [x] **Frozen and historical surfaces deliberately not swept** — archived sprints · rotated
      changelogs · the generated index · append-only ADRs · past `LEARNINGS` entries · `superseded`
      research · past `TECH-DEBT` rows · this sprint's own frozen Plan and append-only Log ·
      fixture data. *(Exclusion clause amended 2026-08-16 from three categories to nine, owner-ruled,
      scope-change logged: the original was unsatisfiable — see the Log.)*
      *Verify: each class appears in the unchanged column of the reconciliation, by name, with the
      rule that freezes it*
      ✓ 54 unswept live mentions account for exactly: 42 frozen (14 ADR · 10 LEARNINGS · 9
      superseded research · 3 TD rows · 4 this Plan+Log · 2 changelog/index/fixture) + 10 fixture
      **data filenames** in `run-doc-caps-fixtures.sh` (throwaway temp paths, not citations) + 2
      historical statements reverted after the sweep corrupted them (below)
- [x] Every touched table row / list entry re-read whole after editing (L-009) —
      *Verify: block re-read; the gate's schema + cap legs green*
      ✓ mechanical check rather than eyeballing: `git diff --numstat` — every one of the 54 swept
      files shows added == deleted, so no row was fused or dropped (a fusion changes the balance).
      The only imbalance in the diff is this Plan's own amended DoD (+7 −2), which is intended
- [x] Gate green — *Verify: `sh scripts/qa-check.sh`*
      ✓ **151 pass / 0 fail**

### T4 — Guard the two Layers-family checkers against bare invocation `[size: S · risk: low · class: execution · AFK]`
Layers: `scripts/lib/check-layers-completeness.sh` · `scripts/lib/check-layers-observed.sh` ·
        `evals/` (the proving legs)
Depends-on: none
Cites: TD-056 (family scoped by SPRINT-068 T2's scan) · `check-gates-signed.sh` (the note-line shape
       to match) · `qa-check.sh` (run to prove the gate path is unaffected — never edited by this
       task; spelled bare to match the DoD's token, per TD-048) ·
       L-058 (a gate is exercised once on input that must FAIL)
Both exit 0 silently when invoked with no arguments, so a bare run reads as a pass. SPRINT-068's own
coordinator ran one bare and read the silence as clean — the row's second sighting, which is what
vehicled it.

**Acceptance:** each checker invoked bare prints a "nothing verified" note in its guarded siblings'
shape instead of exiting 0 silently, with a proving leg per checker.

**DoD:**
- [x] Both checkers print the note when invoked with no arguments — *Verify: run each bare; output
      names what was not verified*
      ✓ verified by the coordinator in the **integrated** tree, not from the builder's report:
      `layers completeness: no sprint files given -- nothing verified` / `layers observed: …`,
      both exit 0, matching `check-gates-signed.sh`'s note shape
- [x] A must-note leg per checker, wired into the harness the gate runs (an unwired fixture guards
      nothing — TD-012) — *Verify: the harness leg count rises by two and the gate names it*
      ✓ one leg per harness, both green post-merge; builder ran the RED/GREEN guard proof
      (guard commented out → leg red with its named finding → restored)
- [x] The gate path is unaffected — `qa-check.sh` always supplies arguments —
      *Verify: gate output for both legs unchanged from before the change*
      ✓ builder diffed with-args output against `git show HEAD:…` of the pre-change checkers,
      repo state held fixed — byte-identical

### T5 — Ignore `.claude/worktrees/` so a stray `git add -A` cannot commit a repo copy `[size: S · risk: low · class: execution · AFK]`
Layers: `.gitignore`
Depends-on: none
Cites: TD-053 leg 2 (split out at SPRINT-069's promote review) · L-042 (staging discipline) ·
       T4 (cited, not depended on: its dispatched worktree was the live subject T5 verified
       against — added mid-sprint, L-100, logged)
The dispatch protocol places a full repo copy inside the repo and nothing ignores it; SPRINT-068's
close ran `git add -A` and was safe only because the worktrees had already been removed.

**Acceptance:** with a worktree present, `git status --short` stays clean.

**DoD:**
- [x] `.claude/worktrees/` ignored — *Verify: `git check-ignore -v .claude/worktrees/probe` resolves
      to the new rule*
      ✓ resolves to `.gitignore:16`
- [x] Verified against a real dispatched worktree, not a `mkdir`'d stand-in —
      *Verify: `git status --short` clean while the worktree exists*
      ✓ T4's live worktree used as the subject; before ` ?? .claude/worktrees/`, after only
      ` M .gitignore` — both states observed, neither simulated
- [x] Leg 1 explicitly untouched — the `find`-walk false positive stays routed to EPIC-004 D1 —
      *Verify: no checker changed by this task*
      ✓ `git status -- scripts/ evals/` empty at commit; leg 1 then fired for real minutes later
      (Execution Log, 2026-08-16 surprise) — the ignore does not stop a `find` walk, as predicted

## Decisions (pre-locked)

- **D1 — The move is wholesale, not section-at-a-time.** The document is already standalone, so one
  `git mv` leaves no split-document state; a section-first move would create exactly the two-homes
  condition ADR-023 exists to prevent, for the rest of the epic. **→ no ADR** (ADR-023 already owns
  the mechanism).
- **D2 — Rename now, sweep citations after.** 15 path references break on the move and are fixed
  atomically with it; the 128 textual `§N` citations survive a move but not a rename, and folding
  them in would make the atomic commit ~70 files wide. A lagging *name* is not a rule stated twice.
  **→ no ADR.**
- **D3 — `docs/epic/EPIC-003-the-standard.md` is shared by T1 and T2** (T1 strikes open question 1;
  T2 re-points a path reference in it). **T1 owns the file and commits first**; T2 touches only its
  path line, staged per-hunk (L-042). No other file is shared across tasks — T2/T3 are sequential by
  `depends-on`, T4 and T5 are disjoint from everything.
- **D4 — The spec starts at 0.1.0, not 1.0.0.** Four of EPIC-003's five Closed-when conditions are
  still open and each will move the text; 1.0.0 is reserved for the epic's close, where it carries a
  real signal. **→ no ADR.**

## Assumptions

- **A1** — `spec/` reaches consumers with no packaging work: the plugin manifest declares no file
  list, so `plugin install` copies the whole repo. *Confirm: verified against a real install
  (SPRINT-042), restated in `docs/architecture/overview.md`.*
- **A2** — The move costs one line in the cap checker, which takes the guide path as its first
  parameter with a default. *Confirm: `scripts/lib/check-doc-caps.sh` line 39, read 2026-08-16.*
- **A3** — The other three checkers naming the guide do not open it — comments and output strings
  only, so they fall to T3's sweep rather than T2's move. *Confirm: read 2026-08-16;
  `check-ephemeral-intake.sh` mentions it in two `printf` findings, the other two in headers.*
- **A4** — Extraction makes `.claude/CLAUDE.md`'s "lean-doc-generator bundles its own templates +
  standard" **false**, so correcting it is inside T2's commit, not a follow-up. *Confirm:
  `.claude/CLAUDE.md` § Design Principles, read 2026-08-16.*
- **A5** — No cap blocks: `TODO.md` 186/320 · `CLAUDE.md` 63/80 · `CONTEXT.md` 132/150 (T2 *reduces*
  CONTEXT.md per ADR-023) · `spec/` is a new tree with no §2 row yet — T1's ruling or T2 decides
  whether it gets one. *Confirm: gate cap legs, measured 2026-08-16.*
- **A6** — Governance resolved at this promote: L-promotion none · TD-054/053/050/049 re-reviewed
  and held (TD-053 leg 2 split → TASK-213 = T5) · TD-051 observation recorded · doc-aging clean.
  *Confirm: governance review 2026-08-16, owner-signed; commit `b03ada4`.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-069-first-extraction.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (DOCS_Guide §9 · ADR-014). The `logs/` subdirectory is load-bearing —
> the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-directory
> `-log.md` sibling would be capped and schema-checked as if it were a Plan.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint? **Yes,
three times, and all three were rules that were loaded and still did not fire.** (a) D3 ruled T1/T2's
file ownership in § Decisions prose, where the preflight cannot read it — **L-099's own shape**,
authored in the session that had just re-reviewed TD-051 for being a guard that cannot see what it
guards. (b) A literal `T3` inside T3's own `Depends-on` annotation was read as a self-edge — **L-108**,
in the sprint whose T4 exists to fix a checker-token defect. (c) The T3 sweep rewrote two historical
statements into falsehoods — L-108's family again, one level up. Every one was caught by a checker or
a diff, never by recalling the rule. That is the pattern CLAUDE.md's cross-check clause already
predicts, now with three more instances.

**Cost** — coordinator (session model; T1 + T3 + all gates, merges and verification inline) + 2
worktree builders (sonnet, ~188k each) ≈ **376k dispatched tokens + coordinator**, 5 of 5 units
delivered. Both dispatches needed union-verification after merge because of TD-054, and T3's
dispatch was abandoned for inline work — so the *effective* dispatch yield this sprint was 2 of 3
planned, at full token cost for the two that ran.

**Worked**
- **The preflight paid for itself before a single task ran.** It HALTed on 7 findings, one of which
  (T1/T2 sharing the epic file with no edge) would have put two agents on one file in parallel —
  SPRINT-041's corruption shape. Cost to fix at that moment: two lines.
- **System-verify blocked the close twice on findings the per-task runs missed**, including one that
  could only appear once the work had a commit to attribute. ADR-021 earning its mandate again.
- **A builder's hard file boundary turned a defect into a flag, twice.** T2 found `SECURITY.md` and
  `docs/LEARNINGS.md` genuinely broken, fixed them, and reported the `Layers:` gap instead of editing
  the Plan; T4 diagnosed its own gate FAIL as a worktree artifact, proved it identical with
  pre-change code, and refused to work around it.
- **Verifying the union rather than trusting the merge.** T4's base lacked 68 lines of SPRINT-068
  close-time work on two files it edited; the check that both survived was run, not assumed.

**Friction**
- **TD-054's stale-base pin** — four worktrees, two sprints, one identical sha. It caused T2's merge
  conflict, forced T3 inline, and made every merge require union-verification.
- **Four `Layers:` corrections on one task** (T3), plus one each on T2 and T5. Not carelessness: a
  directory-glob declaration satisfies the preflight and fails the two Layers checkers. → **TD-057**.
- **TD-048 fired three times in one sprint** (token spelling vs path identity) — at promote, at G2,
  and at system-verify.
- **The T3 sweep damaged two files** by rewriting statements about the past. Caught by reading the
  diff; the reconciliation was green and would have stayed green.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`) — **L-125 filed**: a self-describing
corpus is unsafe to edit by token, because some of its sentences are assertions about the past that
stay true only if left alone. **L-126 filed**: a declaration convention read by two consumers with
different matching semantics passes one gate and fails the other, and the mismatch is invisible until
both have run.
