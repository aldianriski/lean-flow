---
sprint: 054
slug: rulings
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: pending
close_commit:
update_trigger: sprint execute/close events
---

# SPRINT-054 — Rulings

> **Theme:** Three questions the repo has been carrying, all of them now answerable, none of them a
> capability. Six base-tier doc rows lean-flow lacks for no substrate reason and has never ruled on;
> a house-style question about ❌ prohibition that literature can close; and a gate-placement tension
> that only an owner ruling can close. What they share is the deliverable: a **recorded decision**,
> where "no change, and here is why" is a complete outcome. That is also the sprint's exposure — the
> failure mode here is manufacturing an edit to make a decision look like work.

## Scope

**In:** rule on each of the six absent base-tier docs (create or exempt, per row, with the reason) ·
close the ❌-negation question by reading the sources · close the push-right vs gate-before-work
tension by owner ruling · leave `docs/research/mattpocock.md` § Still open empty.

**Out (deferred):** the six rows that ARE substrate-gateable (coding-standards, testing-guide) — they
belong to TASK-162, which landed at SPRINT-053, and are excluded by construction. Rewriting skill
`## Red flags` sections if T2 rules "amend" — that is a follow-up TASK, not this sprint (T2 is S-sized
and the SSOT edit is the ruling). TD-037 and TD-038 stay held (D4). No `init`/`migrate` behaviour
changes fall out of T1 unless T1's ruling contradicts DOCS_Guide §6, in which case it is a
scope-change entry, not a silent extra task.

## Plan

### T1 — Rule on the six absent base-tier docs `[size: M · risk: low · class: decision · HITL]`
Layers: `CONTRIBUTING.md` · `SECURITY.md` · `AGENTS.md` · `docs/product/requirements.md` ·
    `docs/product/acceptance-criteria.md` · `docs/development/setup.md` · `README.md` ·
    `.claude/CLAUDE.md` · `docs/architecture/overview.md`
Depends-on: none
Cites: `skills/lean-doc-generator/references/DOCS_Guide.md` · `skills/lean-doc-generator/templates/` ·
    `scripts/qa-check.sh`

TASK-165, unblocked at the SPRINT-053 close. These six are the base-tier rows lean-flow does not have
and cannot blame on absent substrate — the substrate question was settled at SPRINT-053 T1 and took
`coding-standards` and `testing-guide` with it. What is left is a decision nobody has made. LAW 1 says
a doc exists only where its absence causes repeated interruptions or mistakes, so **"create all six" is
one candidate answer, not the default**, and an exemption is a real verdict — but only if it is written
down somewhere a future reader finds it. Silence is the one outcome this task forbids.

**Acceptance:** each of the six rows has a recorded disposition — a created doc, or a written exemption
naming why its absence causes no repeated mistake — and a reader can tell from the repo which of the
six lean-flow deliberately does without, and why.

**DoD:**
- [ ] Confirm A1 at G2 — re-check the six against `DOCS_Guide` §6's base row, which SPRINT-053 T1 made
      authoritative; if any is in fact substrate-gated, it drops out here rather than being exempted
- [ ] Per row, apply LAW 1 **explicitly**: name the repeated interruption or mistake its absence
      causes, or record that there is none. Verdict is `create` or `exempt` — never left silent
- [ ] Every `create` renders from its template under `skills/lean-doc-generator/templates/` before
      writing (Step 6 is mandatory — the named cause of wrong docs)
- [ ] Every `exempt` is recorded in the home chosen at G2 (A2), not in this sprint file alone — a
      closed archive is not a lookup surface
- [ ] **Consumer check (L-015)** — all six are consumer-facing; judge what lands as a consumer who
      installs the plugin sees it, not against dogfooding
- [ ] `README.md` docs-map, `.claude/CLAUDE.md` § File Structure and `docs/architecture/overview.md`
      § Directory structure reflect **whatever actually landed** — and nothing that did not
- [ ] `sh scripts/qa-check.sh` re-run bare immediately before the commit (L-089)

### T2 — Close the ❌-negation question by reading `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/research/mattpocock.md` · `.claude/CLAUDE.md`
Depends-on: T1
Cites: `TECH-DEBT.md`

TASK-155. `writing-for-agents` claims prohibition activates the forbidden behaviour, which cuts against
the ❌ house style every anti-pattern row uses. L-094's test names this a **documented-behaviour**
question: prompting literature on negation exists and is read, not measured — which is why it sat in
`needs-info` waiting for a signal that was never going to arrive. The honest null result ("no change
warranted") is a real outcome and is recorded as one, not treated as a failure to find something.

**Acceptance:** the question is closed in `docs/research/mattpocock.md` with a verdict backed by cited
sources rather than preference, and § Still open no longer carries it.

**DoD:**
- [ ] Sources on negation / prohibition in instruction-following read and **cited** — a verdict with no
      citation is the preference this task exists to avoid
- [ ] Verdict tested against our actual style, not the general claim: confirm A3 by reading
      `.claude/CLAUDE.md` § Anti-Patterns — every ❌ row pairs the trap with a positive rule — and rule
      on whether that pairing neutralises the effect
- [ ] The verdict lands in `docs/research/mattpocock.md`; its § Still open row is removed (closed, not
      re-parked)
- [ ] If the verdict is "amend", the amendment lands in `.claude/CLAUDE.md` only — §10's placement test
      puts a repo-wide style rule where every flow reads it — and skill `## Red flags` rewrites are
      filed as a follow-up `TASK-NNN` rather than swept into an S-sized task. That file sits at **80 of
      its 80 cap**, so an amendment there displaces something — a ruling, not an append
- [ ] If the edit pushes `mattpocock.md` past its 120 soft cap, apply **TD-038's** named remedy (split
      per-scan files behind an index), never a squeeze — and log it as a scope-change first

### T3 — Rule on push-right vs gate-before-work `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/research/mattpocock.md` · `.claude/CONTEXT.md` · `skills/orchestrator/SKILL.md`
Depends-on: T2

TASK-159. `loop-me` argues for deferring a human checkpoint as far as it will go — ask once, late,
fully prepared — against our G1/G2 model, which gates before work starts. L-094 names this a
**judgement call**: it is settled by argument about our own gate placement, and no instrument for it
exists or will, so "unblock when a measurable signal appears" parks it forever. The likely answer is
in the task's own `assumes:` — the two may not be opposed at all — but that is the first thing the
argument has to test, not assume.

**Acceptance:** the tension is closed in `docs/research/mattpocock.md` with a ruling that states where
each of G1 and G2 sits and why, and `.claude/CONTEXT.md` § Gates either changes or is confirmed
unchanged **with the reason recorded** — an unchanged gate with no recorded reason is the question
re-parked.

**DoD:**
- [ ] Ruled as a judgement call — an outcome of "wait for evidence" is explicitly unavailable (L-094)
- [ ] The ruling separates approving *direction* (G1/G2, before wasted work) from deferring
      *verification* (push-right, until work is presentable) and says whether they conflict at all —
      A4 tested, not assumed; "both, at different points" is a legitimate verdict
- [ ] Verdict in `docs/research/mattpocock.md`; § Still open is now empty
- [ ] If gate placement changes, `.claude/CONTEXT.md` § Gates is the SSOT edit and
      `skills/orchestrator/SKILL.md` follows **in the same commit** (L-020 — a rule on one surface is
      half-shipped). `CONTEXT.md` sits at 124 of its 130 cap (ADR-007): any addition fits or displaces,
      never raises the cap
- [ ] If nothing changes, both files are left untouched and the reason is in the verdict

## Owner-action checklist
- [ ] **Reinstall the plugin before the next session** — this promote ran on 1.25.2 skills against a
      1.27.3 repo (`/prime` freshness row said STALE). The repo source was read directly to avoid
      L-021, but that is a workaround, not a fix.

## Decisions (pre-locked)

- **D1** — Every task here is `class: decision` and each may legitimately end in **no change**. A
  recorded null result is a completed task. Manufacturing an edit to make the sprint look productive
  is the specific failure this sprint is exposed to, and is named so the Retro can check for it.
- **D2** — **Overlap-ownership map.** `.claude/CLAUDE.md` is reachable by T1 (File Structure line, if
  docs land) and T2 (house-style amendment, if the verdict says amend); `docs/research/mattpocock.md`
  by T2 and T3. Resolution: **serialize T1 → T2 → T3, no parallel build.** Each stages its own hunks
  on a shared file (`git add -p` + verify `git diff --cached`), never a plain `git add` over another
  task's WIP (L-042 · L-037). Declared by hand because **TD-040** makes the dispatch preflight snippet
  blind to the indented continuation lines these `Layers:` blocks use — the check cannot be relied on
  to surface this overlap.
- **D3** — TD-034's row is deleted at this promote (§11: resolved at SPRINT-051, three sprints past).
  Id 034 stays retired and is never reused; the substance survives in `CHANGELOG.md`, the SPRINT-051
  archive and git.
- **D4** — TD-037 and TD-038 held. Both were re-reviewed within the last two promotes with their
  triggers unchanged (TD-038 fires at the next `mattpocock.md` re-scan — T2 is an edit, not a re-scan;
  TD-037's next re-review falls at SPRINT-055). Re-reviewing again now would be ceremony.
- **D5** — No `epic:` stamp. EPIC-001 closed 2026-08-09 and nothing here advances a multi-sprint
  outcome; these are three independent rulings, not a destination.

## Assumptions

- **A1** — The six rows are genuinely not substrate-gateable; checked at the SPRINT-053 G2 against all
  18 base rows. *Confirm: T1's first DoD line, re-checked against `DOCS_Guide` §6's base row — the
  SPRINT-053 change is what made that row the authority.*
- **A2** — The home for an `exempt` verdict is **undecided** (candidates: `docs/architecture/overview.md`
  § Boundaries · `.claude/CLAUDE.md`). *Confirm: T1's G2 design step — it depends on which rows exempt,
  so it is a dependent question and serialises there rather than being asked at promote.*
- **A3** — Our ❌ rows already pair each trap with a positive rule, which the research doc notes blunts
  the negation effect. *Confirm: T2's read of `.claude/CLAUDE.md` § Anti-Patterns against the sources.*
- **A4** — Gates and push-right are not actually opposed — ours approve direction, push-right defers
  verification. *Confirm: T3's ruling, where it is the proposition under test, not a premise.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-054-rulings.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here
> (DOCS_Guide §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Cost** — what this sprint cost to run, and in what shape (inline · coordinator + N agents).

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
