---
sprint: 063
slug: headroom
epic: EPIC-002
owner: Maintainer
last_updated: 2026-08-14
status: active
gates_signed: G1,G2 @ 222b437
plan_commit: 124e05b
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-063 — Headroom

> **Theme:** SPRINT-062 built the *procedure* for ruling a cap and delivered no headroom — its own
> member row says so. This sprint spends that procedure. Every task here maps to one of EPIC-002's four
> Closed-when conditions, so the epic is answerable at close rather than one condition closer. The
> ordering constraint is that subtraction runs before adjudication: a doc that archives never needed its
> cap ruled.

## Scope

**In:** rule the cap structure on `CLAUDE.md` · `CONTEXT.md` · `TODO.md` (T1) · apply one §11 archive
pass to `docs/research/` (T2) · re-sort whatever §2 breaches survive that pass (T3) · rule whether the
11 checkers consolidate now or wait for EPIC-004 (T4).

**Out (deferred):** TASK-200 (L-108 placement widening — its own `assumes:` says it may be blocked
behind T1; re-rank it once T1 has ruled) · TASK-198 (EPIC-003, blocks nothing here) · TASK-201/202/203
(EPIC-004-shaped, from `docs/research/gauntlet-loop-delta.md`) · the LEARNINGS §11 collapse (SPRINT-062
established the corpus is healthy; no new promotions this cycle) · any trim that buys a green number by
re-wrapping prose (§2 Growth rule forbids it).

## Plan

### T1 — Rule the cap structure on all three governance files `[size: M · risk: med · class: decision · HITL]`
Layers: `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `TODO.md` · `docs/adr/` · `docs/DECISIONS.md`
        · `docs/architecture/overview.md` · `skills/lean-doc-generator/references/DOCS_Guide.md`
        · `scripts/lib/doc-caps-grandfathered.txt`
Depends-on: none
Cites: `scripts/qa-check.sh`
The caps are the epic's blocker: EPIC-003/004/005 are three epics of incoming rules and there is
nowhere to write them. §2's Growth rule (shipped SPRINT-062 T1) already sorts a breach into *drift* vs
*a cap that was never reachable* — apply it rather than re-deriving one. ADR-015 forbids grandfathering
a soft cap, and ADR-017 already raised CONTEXT 130→150 once, so a second raise needs a genuinely
different argument or it is trimming-by-ADR.

**Acceptance:** `CLAUDE.md`, `CONTEXT.md` and `TODO.md` each carry ≥15% headroom by a recorded ruling —
a raised cap with an ADR, a §6 split, or content moved to a satellite behind a pointer.

**DoD:**
- [x] Each of the three files sorted into drift or never-reachable, per §2's Growth rule, with evidence
- [x] L-008/TD-006's hypothesis (CONTEXT accreting duplication of its satellites) tested before any
      number moves — confirmed or falsified in writing, per L-091 — **falsified**, in ADR-017 (SPRINT-060 T1)
- [x] The ruling recorded: ADR where the number moves, §6 split where it does not — **ADR-019** (TODO 320)
- [x] ≥15% headroom verified by `scripts/qa-check.sh`, not by a hand count — CLAUDE 24% · TODO 20% ·
      **CONTEXT 12%, ticked under the owner's ruling that 15% is the wrong instrument for it, not under
      literal satisfaction** (scope-change logged before the tick — L-088)
- [x] `doc-caps-grandfathered.txt` left empty of soft-cap rows (ADR-015 rule 2 FAILs on the row's existence)

### T2 — Apply one §11 archive pass to docs/research/ `[size: S · risk: low · class: execution · HITL]`
Layers: `docs/research/*` · `docs/research/loop-hygiene-prd.md` · `docs/research/archive/` · `docs/knowledge-index.md`
Depends-on: none
Cites: T3
Runs **before** T3 deliberately: `loop-hygiene-prd.md` is both a §2 cap breach and a `status: superseded`
archive candidate, and an archived doc's breach dissolves rather than needing a ruling. §11 is explicit
that supersession alone is not sufficient — a spent verdict is usually the WHY-trail for whatever
replaced it — so the deliverable is the *applied pass and its count*, not a reduction target.

**Acceptance:** every research doc that is `status: superseded` **and** has no live citer sits in
`archive/`, marked in the generated index; the applied count is reported either way, including zero.

**DoD:**
- [x] Citer check run per candidate; closed history and the generated index do not count as citers
- [x] Each of the 4 superseded docs either moved or kept with its live citer named — all 4 **kept**
- [x] `sh scripts/gen-index.sh` re-run; index links resolve
- [x] Applied count reported to the owner, zero included — **applied count: 0**

### T3 — Re-sort the surviving §2 research breaches against the Growth rule `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/research/graph-engineering.md` · `docs/research/loop-hygiene-prd.md`
        · `skills/lean-doc-generator/references/DOCS_Guide.md` · `docs/adr/` · `docs/DECISIONS.md`
        · `scripts/lib/check-doc-caps.sh` · `evals/run-doc-caps-fixtures.sh` · `evals/fixtures/doc-caps/`
Depends-on: T2 (subtraction first) · T1 (owns `DOCS_Guide` §2 and `docs/adr/` — see D1)
Cites: `scripts/qa-check.sh`
**Do not inherit "ordinary drift" from TASK-192's text — that phrase is the error L-106 was written to
correct, and TASK-192 repeated it while citing it.** L-106's own body records `graph-engineering.md` as
having no movable section and no whitespace slack. Sort each surviving doc fresh; neither diagnosis is
currently evidence-backed.

**Acceptance:** each research doc still over its §2 cap after T2 is sorted into drift or
never-reachable and ruled accordingly.

**DoD:**
- [x] T2's outcome read first — a doc that archived is struck from this task, not ruled — **0 archived,
      so both survivors were ruled**
- [x] Each survivor sorted with its evidence, not by inherited label — git history per doc; **neither
      was drift**, and the two breaches had unrelated causes
- [x] Ruling recorded (ADR where a number moves; §6/`logs/` split where the growth is a series) —
      **ADR-020**; `logs/` split explicitly checked and rejected (the growth is woven, not appended)
- [x] `scripts/qa-check.sh` cap report reflects the ruling — checker + retained must-catch fixture

### T4 — Rule whether the 11 checkers consolidate now, or wait for EPIC-004 `[size: S · risk: low · class: decision · HITL]`
Layers: `scripts/lib/check-*.sh` · `scripts/qa-check.sh` · `docs/epic/EPIC-002-make-room.md` · `docs/epic/EPIC-004-conformance.md`
Depends-on: none
**Deferral may be the right answer and must stay on the table.** EPIC-004 D1 makes the engine
spec-driven; consolidating now into a non-spec-driven engine is work EPIC-004 would redo. Do not assume
consolidation because it is the tidy move (L-091). The contract being protected is the **named finding
per check** (L-058), never the file count.

**Acceptance:** a recorded decision — one engine, split by concern, or stand alone — with a one-line
reason per survivor; or an explicit deferral to EPIC-004 with its reason.

**DoD:**
- [x] Each of the 11 checkers' named findings enumerated before any merge is proposed — **~82 asserted
      across 16 retained fixture harnesses**; table of all 11 in EPIC-002 D3
- [x] Decision recorded against EPIC-002 **and** EPIC-004's shared open question (they share it — the
      answer is written once and cited twice, never re-decided) — **written in EPIC-002 D3, cited by EPIC-004**
- [x] If deferred: the deferral names the class of fact that would close it (L-094), not "when a signal
      appears" — **a documented behaviour**: EPIC-003's spec in a form a checker can read as its rule source

## Owner-action checklist
- [ ] Reinstall the plugin — session skills ran at **1.34.0** against a **1.36.0** repo during promote
      (L-021). The promote procedure differed materially: the cached copy omits the §2 cap-breach half
      of the doc-aging line. Repo source was followed instead; do not run T1–T4 off the stale cache.

## Decisions (pre-locked)

- **D1 — T1 owns `DOCS_Guide` §2 and `docs/adr/`; T3 commits after it.** Both tasks may write a §2
  ruling and an ADR. Single owner + commit order fixed here, before the first task, per the G2
  overlap-ownership rule. At commit, stage shared files per-hunk (`git add -p` + verify
  `git diff --cached`) — a plain `git add` over another task's WIP contaminates at the commit phase
  (L-042/L-037). **→ no ADR** (procedural, reversible).
- **D2 — Subtraction precedes adjudication.** T2 runs before T3 because archiving a doc dissolves its
  cap question, and ruling a cap on a doc that then archives is wasted work. Discovered at promote by
  discharging T3's factual `assumes:` (L-114), not mid-sprint. **→ no ADR.**

## Assumptions

- **A1** — TODO.md's cap pressure is arithmetic, not drift: **measured at promote — 253 lines total,
  176 of them backlog entries across 10 tasks (~17.6 lines/entry), 77 lines of scaffolding.** The
  standard's own § Task entry shape is what costs it. *Confirm: measured 2026-08-14; re-measure at T1
  start rather than trusting this figure — the backlog moves.*
- **A2** — `docs/research/` holds **33** docs, 29 `current` and 4 `superseded`
  (`behavioral-eval-feasibility` · `loop-hygiene-findings` · `loop-hygiene-prd` ·
  `loop-hygiene-workstreams`). TASK-195's inherited figure of 31 was stale. *Confirm: measured
  2026-08-14; the citer check is T2's own work and may keep any of the four.*
- **A3** — `platform-readiness-audit.md` is `current` and cited by four epics — not an archive
  candidate. *Confirm: frontmatter + epic citations.*
- **A4** — No `L-NNN` is promotable this cycle: every active entry sits at `count: 1`, verified by a
  second pass for `count >= 2` regardless of promoted-state. *Confirm: promote governance scan,
  2026-08-14 — the second pass is what makes "none" an absence rather than a matcher that failed green
  (L-113).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-063-headroom.md`, rendered from
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

<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Cost** — what this sprint cost to run, and in what shape (inline · coordinator + N agents).

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
