---
sprint: 047
slug: sprint-log-split
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: [pending — recorded in the follow-up commit]
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-047 — Sprint Log Split

> **Theme:** An unattended run clean-halts when the promoted Plan's AFK work runs out, so a run is
> only ever as big as the Plan a human froze for it. That Plan is bounded by the sprint file's
> 400-line hard cap — which the Execution Log and Retro share. Measured across the last six sprints:
> 232–368 lines while holding only 2–6 tasks, with SPRINT-045 reaching 368 on **two**. Task count is
> not what fills the file; the Log is. Fix the container first, so the epic layer in SPRINT-048 is
> born with real headroom instead of fighting the cap.

## Scope

**In:** the Execution Log split out of the capped sprint file, with its three gate globs re-verified
and negative-tested; the mattpocock adoption re-scan (delta since 2026-07-10).
**Out (deferred):** the EPIC doc layer and its loop wiring (TASK-145 · TASK-146 → SPRINT-048 — they
want the roomier format this sprint creates). Proving bulk on a real night run (TASK-148 — blocked on
backlog depth, see § Assumptions A5). Raising the 400 cap (rejected: caps exist for the AI mid-sprint
reader, and a 1200-line working doc degrades exactly that reader).

## Plan

### T1 — Split the sprint Execution Log into an uncapped sibling `[size: M · risk: high · class: decision · HITL]`
Layers: `skills/lean-doc-generator/references/DOCS_Guide.md` (§2 · §9 · §11) · `skills/lean-doc-generator/templates/SPRINT.md.template` · `skills/lean-doc-generator/SKILL.md` · `scripts/qa-check.sh` · `evals/fixtures/` · `docs/sprint/`
Depends-on: none

The Log is append-only prose that grows with the work done, so it competes with the Plan for the same
400 lines — the more a run accomplishes, the closer the file gets to breaching. Moving it to a sibling
that is append-only and uncapped, the way a changelog is, leaves the cap governing only what it was
meant to govern: the frozen Plan. The risk sits in `qa-check.sh`, where three separate checks glob
`docs/sprint/SPRINT-*.md`; a change there that silently stops matching real sprints would disable cap
enforcement without any FAIL to show for it.

**Acceptance:** a sprint Plan can hold ≥15 tasks under the 400-line cap, with the measured headroom
reported, and all three qa-check globs proven — by retained must-FAIL fixtures — to still catch what
they caught before.

**DoD:**
- [ ] Sibling path chosen as a **subdirectory** and recorded in § Decisions (D1); confirmed not to match `docs/sprint/SPRINT-*.md`
- [ ] DOCS_Guide §2 gains the log row — reader · cap · create/update/archive triggers
- [ ] DOCS_Guide §9 repointed: the 400 hard cap governs the Plan file; the Log is append-only elsewhere
- [ ] DOCS_Guide §11 gains the log's retention leg (archives with its sprint)
- [ ] `SPRINT.md.template` § Execution Log repointed to the sibling
- [ ] `lean-doc-generator/SKILL.md` "append to the Execution Log" rule repointed
- [ ] qa-check cap-400 (`:33`) verified against the new layout — negative fixture: an over-cap Plan FAILs **by name**
- [ ] qa-check task-schema (`:267`) verified — negative fixture: a Plan block missing `class:`/autonomy/`Depends-on:` FAILs **by name**
- [ ] qa-check layers-completeness (`:405`) verified — negative fixture: an undeclared layer FAILs **by name**
- [ ] All three fixtures **retained** under `evals/` — deleting them with the prototype leaves the gate unguarded (TD-012)
- [ ] One **archived** sprint migrated to the split format as the real-input proof (D2)
- [ ] Measured Plan headroom reported (how many task blocks fit under 400)
- [ ] `sh scripts/qa-check.sh` green on a **bare** run (never piped — L-057)
- [ ] ADR recorded if G2 judges the structure change ADR-grade (A3)
<!-- QA: this task edits the gate itself. The negative fixtures ARE the test strategy — a gate change
     verified only by a green run proves nothing about what it stopped catching (L-058). -->

### T2 — Re-scan mattpocock/skills for adoption delta `[size: M · risk: low · class: execution · AFK]`
Layers: `docs/research/mattpocock.md`
Depends-on: none

The 2026-07-10 scan shipped all three of its keepers (Standards-vs-Spec · skill-powered dispatch ·
wayfinder→fog-map) and explicitly listed what it did **not** scan. Four of the five skills now named
fall in that unscanned remainder, so this is a delta re-scan of an existing verdict rather than a new
question. L-017 governs the judgement: map each candidate onto the surface we already have first, and
only the unmatched remainder counts.

**Acceptance:** `docs/research/mattpocock.md` states a Keeper|Reject verdict for each of the five
skills against the specific lean-flow surface it maps to, and a keeper count.

**DoD:**
- [ ] Current source read for `grill-me` · `writing-for-agents` · `wizard` · `wait-what`
- [ ] `wayfinder` re-check row — already adopted as fog-map; has it changed since 2026-07-10?
- [ ] One delta-map row per skill, each naming the lean-flow surface it duplicates or the gap it fills
- [ ] Verdict line states the keeper count
- [ ] Keepers **filed** as follow-up `TASK-NNN` at close — never adopted inside this task
- [ ] Ownership header + `last_updated` refreshed; `sh scripts/gen-index.sh` re-run if metadata changed

## Owner-action checklist
- [ ] Only if T2 is run unattended: confirm `WebFetch` is in the headless allowlist — without it T2 reverts to HITL (A4)

## Decisions (pre-locked)
- **D1** — the Log sibling lives in a **subdirectory**, not a same-directory `-log.md` suffix. A suffix
  matches `docs/sprint/SPRINT-*.md` and would need exclusions in three separate checks; a subdirectory
  escapes all three for free, the same non-recursive reason `archive/` already does. TD-031 names the
  growing exclusion list as a design smell at four entries — this avoids adding three more.
- **D2** — the "one real sprint migrated" proof targets an **archived** sprint. Migrating the live one
  would mean restructuring the very file this sprint appends its own Execution Log to. SPRINT-048 is
  the first sprint *born* in the new format.

## Assumptions
- **A1** — a subdirectory escapes the glob because shell `*` does not cross `/`. *Confirm: `qa-check.sh:33,267,405` plus a fixture that proves a log file is not picked up.*
- **A2** — the Plan file keeps its 400 hard cap; only the Log moves. *Confirm: DOCS_Guide §2 · §9.*
- **A3** — the split alters ADR-012's repo structure and may be ADR-grade (hard-to-reverse: every future sprint adopts it). *Confirm: G2 design gate.*
- **A4** — T2's AFK classification holds only if a headless run can reach the network. *Confirm: pre-flight allowlist, or run T2 attended.*
- **A5** — TASK-148 (prove bulk on a real run) cannot be satisfied yet: its done-when needs a ≥10-task Plan and the backlog holds three tasks. *Confirm: revisit once the backlog has depth; it is marked `blocked` in TODO.md with that unblock condition.*

## Execution Log
<!-- Append-only, dated. Surprises, scope additions, completions. Log here rather than editing § Plan —
     the plan is frozen at promote. Scope change: a mid-sprint pivot that shifts scope is logged as a
     `scope-change` entry — what broke · impact · re-confirm G2 — BEFORE editing the Plan. -->

### 2026-08-09 | promote | plan locked
Formed from TODO.md Backlog: T1 ← TASK-147, T2 ← TASK-144. Governance review signed off by the owner;
three §11 doc-aging items applied in the same pass (TD-014/023/024 deleted, v1.24.0 rotated, 16 promoted
LEARNINGS entries collapsed). Composition chosen deliberately over carrying the epic pair: fixing the
container first means SPRINT-048 is written in the roomier format rather than migrating mid-flight.

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| | | | | |

## Retro
<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Cost** — what this sprint cost to run, and in what shape (inline · coordinator + N agents). Cost per unit **delivered**, not attempted. Unavailable → say so rather than omitting the line.

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
