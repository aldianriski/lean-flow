---
sprint: 064
slug: where-it-fires
epic: EPIC-002
owner: Maintainer
last_updated: 2026-08-14
status: active
plan_commit: 730a10f
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-064 — Where It Fires

> **Theme:** three governance mechanisms that exist and do not reach. A promoted rule that is loaded,
> correctly placed, and still misses the moment it is needed (T2). An ownership map that cannot see a
> file every task writes and no task owns (T3). A retention sweep never applied, whose result is the
> only thing that closes an epic condition (T1). SPRINT-063 ruled *numbers*; this one asks whether the
> mechanisms already written actually fire.

## Scope

**In:** apply the §11 LEARNINGS collapse pass and report its count (T1) · widen L-108's placement so a
matcher rule reaches ad-hoc verification, not only authoring (T2) · rule how the G2 overlap map handles
sprint infrastructure no task declares (T3).

**Out (deferred):** TASK-198 (EPIC-003 — blocks nothing here) · TASK-201/202/203, the gauntlet chain
(EPIC-004-shaped; 201 gates the other two, and none is on this theme) · TASK-188 (still `blocked`; its
trigger is opportunistic and this sprint's shape cannot generate one — L-111) · **EPIC-002's headroom
condition**, which is an owner ruling on the epic, not a task, and is not attempted here.

**Epic note:** only **T1** is EPIC-002-tracked (its Closed-when 4). T2 and T3 are Retro follow-ups from
SPRINT-062 and SPRINT-063 that share this sprint's theme, not the epic's scope. Named so the epic
rollup at close does not over-claim.

## Plan

### T1 — Apply one §11 collapse pass to docs/LEARNINGS.md `[size: S · risk: low · class: execution · AFK]`
Layers: `docs/LEARNINGS.md` · `docs/knowledge-index.md`
Depends-on: none
Cites: `scripts/gen-index.sh` · `scripts/qa-check.sh`
Closes the remaining leg of EPIC-002's fourth Closed-when condition — SPRINT-063 applied the
`docs/research/` half in its own second task and returned zero there. **Measured at promote: 96 entries — 64 `active`, 31 `promoted`,
1 `superseded` — and all 31 promoted entries already carry their pointer bullet.** So the expected
applied count is **zero**, and this task is a verification-and-report, not a rewrite. It still earns its
slot: the condition asks for a pass *applied*, and an unapplied pass is what has been blocking it.

**Acceptance:** every `L-NNN` at `[status: promoted]` is confirmed to carry a one-line pointer and no
body; the applied count and measured line delta are reported, zero included.

**DoD:**
- [ ] Promotion state counted by `[status: promoted]` **anchored to the header's own bracket** — not a
      bare substring; L-114's body quotes that exact string, so a loose matcher reports it as promoted
      when it is `active` (observed at this promote)
- [ ] Each promoted entry checked for its pointer bullet; any without one collapsed per §11
- [ ] `sh scripts/gen-index.sh` re-run; `scripts/qa-check.sh` green
- [ ] Applied count **and line delta** reported, zero included and not treated as underdelivery

### T2 — Widen L-108's placement to reach verification, not just authoring `[size: S · risk: med · class: decision · HITL]`
Layers: `.claude/CONTEXT.md` · `.claude/CLAUDE.md` · `docs/LEARNINGS.md`
Depends-on: T1 (owns `docs/LEARNINGS.md` — see D1)
**The evidence base grew sharply this session and should be read before designing.** L-113 recorded
three L-108-class misfires in SPRINT-062. SPRINT-063 and this promote produced **four more**, every one
inside a governance or verification pass: a `find`-based fixture exclusion defeated by a nested repo
copy; a `status: resolved` grep matching the ledger's own header; a `[status: promoted]` regex matching
`L-114`, whose body documents that string while being `active`; and an `awk` whose broken escaping
returned empty and was caught only because blank output was implausible. Seven sightings, one rule,
still not firing.

**Acceptance:** a rule about matcher shape is reachable from the moment someone is running an ad-hoc
verification query — not only when authoring a checker or naming a fixture.

**DoD:**
- [ ] The seven sightings sorted by *which flow was running* — authoring vs verifying — before any
      placement is chosen; §10's placement test applied to the result
- [ ] **"Add another sentence to § Gates" re-derived, not assumed** — that is the obvious move and is
      precisely what already failed to fire seven times (L-091)
- [ ] Placement recorded, and `L-108`'s entry updated with the new sighting count
- [ ] Headroom confirmed at the chosen destination before writing (`CLAUDE.md` 61/80 · `CONTEXT.md` 132/150)

### T3 — Give the G2 overlap map a rule for files no task owns `[size: S · risk: low · class: decision · HITL]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/dispatch.md` · `.claude/CONTEXT.md`
Depends-on: T2 (owns `.claude/CONTEXT.md` — see D1)
Cites: `docs/sprint/logs/SPRINT-063-headroom.md`
SPRINT-063 hit this live: the inline coordinator and the worktree agent **both created**
`docs/sprint/logs/SPRINT-063-headroom.md`, and it was merged by hand. The overlap map enumerates shared
files from each task's `Layers:`, and the Execution Log is in nobody's `Layers:` — sprint infrastructure
is invisible to the map by construction.

**Acceptance:** a recorded rule covering files every task writes and no task declares — at minimum the
Execution Log — such that a parallel dispatch does not produce two versions needing a hand merge.

**DoD:**
- [ ] **Not** solved by making tasks declare the log — that makes every task an owner of the one file
      every task appends to, which is the opposite of an ownership map (rejected reason recorded)
- [ ] `Files Changed` and the sprint file itself checked for the same shape before ruling — the rule
      covers the class, or names why the Log is the only member
- [ ] Rule placed by §10's placement test and wired where the G2 overlap map is actually built
- [ ] Exercised once against SPRINT-063's actual collision as the worked example

## Owner-action checklist
- [ ] Reinstall the plugin — session skills have now run at **1.34.0** against a **1.37.0** repo across
      three sprints (L-021). Carried unresolved from SPRINT-063; the known divergence is the promote
      doc-aging line, which has been worked around by reading repo source each time.

## Decisions (pre-locked)

- **D1 — Ownership: T1 owns `docs/LEARNINGS.md`; T2 owns `.claude/CONTEXT.md`.** Both files are touched
  by two tasks. Commit order is T1 → T2 → T3, which is also the dependency order, so no per-hunk staging
  is needed provided that order holds. If it does not, stage shared files with `git add -p` and verify
  `git diff --cached` (L-042). **→ no ADR** (procedural, reversible).
- **D2 — T1 is expected to deliver zero collapses, and that is a pass.** Recorded at promote so the
  count is not later read as an unfinished task. The deliverable is the applied pass and its evidence,
  matching how SPRINT-063 T2 closed the `docs/research/` half. **→ no ADR.**

## Assumptions

- **A1** — `docs/LEARNINGS.md` holds **96** entries: 64 `active`, 31 `promoted`, 1 `superseded`, and all
  31 promoted already carry a pointer bullet. *Confirm: measured at promote 2026-08-14 with a matcher
  anchored to the header's own `[status: …]` bracket; re-measure at T1 start rather than trusting this.*
- **A2** — T2 is **unblocked**: `CLAUDE.md` is 61/80 and `CONTEXT.md` 132/150, so a destination with room
  exists. The task's original `assumes:` predicted it might be blocked behind the cap work; SPRINT-063
  delivered that room. *Confirm: `scripts/qa-check.sh` cap lines.*
- **A3** — No `L-NNN` is promotable this cycle: every active entry sits at `count: 1`, verified twice
  (count≥2 with `promoted: no`, and count≥2 regardless of state). *Confirm: promote governance scan,
  2026-08-14.*
- **A4** — Five TD rows were re-reviewed at this promote (TD-051 first-ever; TD-048/047/045/037 second),
  all **held** with unblock conditions stated. TD-051 and TD-037 each gained a live sighting from
  SPRINT-063. *Confirm: `TECH-DEBT.md`, entries dated 2026-08-14.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-064-where-it-fires.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (DOCS_Guide §9 · ADR-014). The `logs/` subdirectory is load-bearing —
> the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-directory
> `-log.md` sibling would be capped and schema-checked as if it were a Plan.
>
> **This sprint's T3 is about this file.** SPRINT-063 produced two of it from one sprint.

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
