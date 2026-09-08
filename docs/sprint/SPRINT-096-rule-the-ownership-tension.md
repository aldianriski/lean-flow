---
sprint: 096
slug: rule-the-ownership-tension
owner: Maintainer
last_updated: 2026-09-08
status: active
plan_commit: 896fc18
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-096 — Rule the Ownership Tension

> **Theme:** Three designs for "does an archived sprint own its own commits?" were each broken by an
> independent review, and each was the same laundering class one level deeper — cited number, then
> number + window, then number + declarations (**L-190**). The decisive fact was found by looking
> *outside* the task: the **active**-sibling skip has always trusted the cited number with no test at
> all (**TD-141**), so all three designs were held to a bar the surrounding code never met. That
> reframes the work from *fix the guard* to *rule a tension the codebase never stated* — an owner
> decision, not an engineering one. This sprint takes the ruling first, corrects the cause every
> artifact repeats second, and only then touches code.

## Scope

**In:**
1. A recorded ruling on which failure this repo accepts, covering **both** sibling kinds.
2. TD-125's stated cause corrected in every artifact that repeats it.
3. `check-layers-observed.sh` brought into line with the ruling — whatever the ruling is.

**Out (deferred):** a fourth attempt at a subject-based ownership heuristic (L-190 — the loop ends by
re-scoping, not by refining) · EPIC-015's § Closed-when 1 · 5 · 6 (`TASK-319`/`296`/`297`, still P1
and untouched here) · the `TODO.md` prune, offered at this promote and not taken · archiving
SPRINT-094/095 · shortening the 103 collapsed LEARNINGS headings to a gist.

## Plan

### T1 — Rule the archived-sprint ownership tension, then re-scope TASK-298 `[size: M · risk: high · class: decision · HITL · J2]`
Layers: TECH-DEBT.md · TODO.md
Depends-on: none
Cites: TD-141 · TD-125 · L-190 · SPRINT-095 T1 (closed at 0 of 6) · `scripts/lib/check-layers-observed.sh`

The repo cannot avoid both failures: report commits citing an archived sprint and TD-125's false
positives make archiving turn the gate red; skip them and a commit subject launders real undeclared
work. The pre-existing code already chose the second for **active** siblings and never said so, so a
ruling that covers only archived siblings is inconsistent by construction. Not a fix — a ruling, plus
the re-scoped shape T3 inherits.

**Acceptance:** a reader can point at one recorded decision that says which failure this repo accepts
and why, and it answers for archived **and** active siblings in the same sentence.

**DoD:**
- [ ] The tension is stated as a genuine fork, with the cost of each side named — not a preference
- [ ] The ruling covers **both** sibling kinds, and says so explicitly — *Verify: the recorded ruling
      names `sibling_sprints`' active arm as well as the archive arm; a ruling silent on one is
      incomplete, which is the defect TD-141 records*
- [ ] The three broken designs are listed as **rejected with their breaking reason**, so a fourth
      attempt costs a re-read rather than a review cycle (L-190)
- [ ] At least one option outside the three is costed — make archival not change the checker's input
      set at all; accept the channel explicitly for both kinds; or find a signal that is not the
      commit subject
- [ ] TD-141 records the ruling and its consequence; `TASK-298`'s Backlog entry is re-scoped to the
      shape that follows, or withdrawn if the ruling makes it moot
- [ ] The ruling is recorded where the **code's** reader meets it, not only in the ledger — *Verify:
      `check-layers-observed.sh` carries the rule in a comment at the `sibling_sprints` build*

### T2 — Correct TD-125's stated cause and every artifact that repeats it `[size: S · risk: low · class: mechanical-ingest · AFK · J1]`
Layers: TECH-DEBT.md · TODO.md · docs/sprint/SPRINT-095-guards-that-misreport.md
Depends-on: none — independent of T1's ruling; the cause is wrong either way
Cites: TD-125 · TD-131 · SPRINT-095 T1 Execution Log

TD-125 names `check-layers-observed.sh`'s `*/archive/*` filter as the mechanism. Measured, that line
alone changes nothing: 092 is blamed for 85 commit:path pairs with the filter present **and** deleted.
The operative mechanism is upstream — `qa-check.sh` hands the checker a non-recursive
`ls docs/sprint/SPRINT-*.md`, so an archived sprint never reaches `"$@"` to be filtered at all.

**Acceptance:** no live artifact still names the `*/archive/*` filter as TD-125's cause, and the
upstream glob is named in its place.

**DoD:**
- [ ] TD-125's Summary names the non-recursive glob in `qa-check.sh`'s layers-observed leg as the
      mechanism, with the measured disproof of the old claim beside it
- [ ] `TASK-298`'s Backlog entry and SPRINT-095's T1 text carry the same correction — *Verify: a
      corpus grep for the old claim over live paths returns zero, with `.claude/worktrees/` excluded
      (a bare `grep -r` counts three repo copies as content — L-170)*
- [ ] TD-131 notes that `fmv()` gained a call site (archived sprint files) — reachable from one more
      place, unchanged in nature
- [ ] The line number is **derived, not quoted from either artifact** — TD-125 cites 429 and
      `TASK-298` cites 430 for the same statement, so at least one is already stale (L-130)

### T3 — Bring the sibling skip into line with the ruling `[size: S · risk: med · class: execution · HITL · J1]`
Layers: scripts/lib/check-layers-observed.sh · evals/fixtures/layers-observed/** · evals/run-layers-observed-fixtures.sh
Depends-on: T1
Cites: TD-141 · TD-125 · ADR-029 (Tier **G**) · L-142 · L-166 · L-169 · L-186

Tier **G** — this is the attribution guard, and a false negative in it is silent by construction.
The DoD below is deliberately written against *whatever* T1 rules, because a criterion frozen to one
mechanism is unreachable the moment the ruling picks another (L-111 · L-160).

**Acceptance:** archived and active siblings are decided by the **same** named rule — T1's — and a
genuinely undeclared path still FAILs with its named finding.

**DoD:**
- [ ] Both sibling arms are decided by one rule, named in the code, matching T1's ruling
- [ ] Proven on the **real 092/093 pair** and not fixtures alone (L-166) — the archived pair is
      already in `docs/sprint/archive/`, so the motivating artifact exists in-tree
- [ ] Retained must-FAIL fixture **per check**, each failing with its named finding, plus a sibling
      control that stays green in the same run (L-058 · L-142)
- [ ] **A fixture that varies the SELECTION, not the verdict** (L-186) — a member reached by the
      other glob arm, so the guard is proven reachable for artifacts of the same kind and not only
      for its motivating one
- [ ] Seeded-break discrimination proof: seed verified landed (`diff --strip-trailing-cr`, at least
      one changed content line — `cmp` is not a landing guard on a CRLF checkout, L-187), artifact
      still parses, break targeted not a demolition, and the case reddens while a sibling control
      stays green — *Verify: a landed seed that reddens nothing is reported as untested*
- [ ] Evidence block states **one** hash convention and uses it throughout (L-169) — prefer
      `git show <ref>:<path> | sha256sum`, never mixed with a working-tree hash
- [ ] An **outside reviewer**, dispatched worktree-isolated, passes the change (L-165 · L-168) —
      *Verify: the review runs in its own worktree, and no `git add -A` crosses it*

## Decisions (pre-locked)

- **D1 — T1 rules before T3 writes code, and T3's DoD is written mechanism-free.** Three attempts
  have now failed by designing first; the fourth without a ruling repeats the loop (L-190).
- **D2 — `TECH-DEBT.md` and `TODO.md` are shared by T1 and T2. T2 goes first and commits alone; T1
  then edits.** Serialize rather than stage per-hunk — the two touch the same TD-125/TASK-298
  neighbourhood, and `git add` over another task's WIP contaminates at the commit phase (L-042 ·
  L-037). Re-read the whole row after either edit: a markdown list-entry edit can fuse neighbours
  while grep and line caps stay clean (L-009).
- **D3 — T3 is Tier G and takes the full bar, including the outside isolated reviewer.** Declared
  here, not inferred (ADR-029).

## Assumptions

- **A1 — archiving SPRINT-092/093 as a pair does not turn the gate red, and this is measured, not
  assumed.** Done at this promote: clean HEAD reported 6 FAILs across the four sprints; after the
  move, what `qa-check` now passes (094 + 095 only) reports the same 4, with 092's and 093's two
  removed and none added. *Confirm: re-derive at close rather than inheriting this line — the tree
  will have moved.*
- **A2 — the operative mechanism is `qa-check.sh`'s non-recursive glob, not the `*/archive/*`
  filter.** Independently reproduced at this promote by reading the leg. *Confirm: T2 re-derives it;
  it is that task's subject, not a fact inherited from here.*
- **A3 — TD-141's channel is pre-existing, so T3 is not repairing a regression SPRINT-095 introduced.**
  *Confirm: T1's ruling rests on this; verify at `2335eab~1` as TASK-331's entry records.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-096-rule-the-ownership-tension.md`, created
> lazily at the first entry. Append there, never here: § Plan is frozen at promote.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. Route the buckets to their durable homes (STANDARD §10). -->
