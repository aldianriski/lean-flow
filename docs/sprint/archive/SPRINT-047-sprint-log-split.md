---
sprint: 047
slug: sprint-log-split
owner: Maintainer
last_updated: 2026-08-09
status: closed
plan_commit: 458c76b
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
Layers: `skills/lean-doc-generator/references/DOCS_Guide.md` (§2 · §9 · §11) · `skills/lean-doc-generator/templates/SPRINT.md.template` · `skills/lean-doc-generator/templates/sprint-log.md.template` · `skills/lean-doc-generator/SKILL.md` · `scripts/qa-check.sh` · `evals/run-sprint-log-layout-fixtures.sh` · `evals/fixtures/sprint-log-layout/correct/docs/sprint/SPRINT-900-layout-fixture.md` · `evals/fixtures/sprint-log-layout/correct/docs/sprint/logs/SPRINT-900-layout-fixture.md` · `evals/fixtures/sprint-log-layout/trap/docs/sprint/SPRINT-901-layout-fixture.md` · `evals/fixtures/sprint-log-layout/trap/docs/sprint/SPRINT-901-layout-fixture-log.md` · `docs/sprint/` · `docs/adr/ADR-014-sprint-log-split.md` · `docs/DECISIONS.md` · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `docs/architecture/overview.md`
<!-- Layers: widened 2026-08-09 after the observed-layers check named 8 undeclared paths; see the
     Execution Log's scope-change entry. Declaration corrected, work unchanged (L-071). -->
Layers-note: the three AI-context/architecture files carry the **linted** template-count claims, so they move whenever a template is added.
Depends-on: none

The Log is append-only prose that grows with the work done, so it competes with the Plan for the same
400 lines — the more a run accomplishes, the closer the file gets to breaching. Moving it to a sibling
that is append-only and uncapped, the way a changelog is, leaves the cap governing only what it was
meant to govern: the frozen Plan. The risk sits in `qa-check.sh`, where three separate checks glob
`docs/sprint/SPRINT-*.md`; a change there that silently stops matching real sprints would disable cap
enforcement without any FAIL to show for it.

**Acceptance:** a sprint Plan can hold **~12 tasks** under the 400-line cap — amended 2026-08-09 from
an estimated ≥15 once the overhead was actually measured (see the Execution Log) — with the headroom
reported, and the four sprint-file gate legs proven by retained, negative-tested fixtures to still
select what they selected before.

**DoD:**
- [x] Sibling path chosen as a **subdirectory** and recorded in § Decisions (D1); confirmed not to match `docs/sprint/SPRINT-*.md`
- [x] DOCS_Guide §2 gains the log row — reader · cap · create/update/archive triggers
- [x] DOCS_Guide §9 repointed: the 400 hard cap governs the Plan file; the Log is append-only elsewhere
- [x] DOCS_Guide §11 gains the log's retention leg (archives with its sprint)
- [x] `SPRINT.md.template` § Execution Log repointed to the sibling
- [x] `lean-doc-generator/SKILL.md` "append to the Execution Log" rule repointed
- [x] qa-check cap-400 (`:33`) verified against the new layout — logs/ excluded, Plan still selected; **owner-ruled** satisfied by the layout fixtures, since T1 changes no check logic
- [x] qa-check task-schema (`:267`) verified — same basis; a log file is never schema-checked as a Plan
- [x] qa-check layers-completeness (`:405`) **and** layers-observed (`:436`, the 4th leg this list omitted) verified — both already ship retained must-FAIL harnesses; both green against the new layout
- [x] Fixtures **retained** under `evals/` (TD-012) — `run-sprint-log-layout-fixtures.sh` + 4 fixture files, registered in the gate's always-on harness list, negative-tested both directions
- [x] One **archived** sprint migrated to the split format as the real-input proof (D2) — SPRINT-045: **368 → 220 lines**, 153 log lines moved verbatim, 5 entries preserved
- [x] Measured Plan headroom reported — **~12 task blocks** (fixed overhead 108 · 23.5 lines/block, from migrated SPRINT-045). **Short of the ≥15 in § Acceptance**: Files Changed and the Retro still share the Plan's budget
- [x] `sh scripts/qa-check.sh` green on a **bare** run (never piped — L-057) — 70 pass, 0 fail
- [x] ADR recorded — **ADR-014** + `docs/DECISIONS.md` row (A3 answered yes at G2)
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
- [x] Current source read for `grill-me` (→ `grilling`, which it delegates to) · `writing-for-agents` · `wizard` · `wait-what`
- [x] `wayfinder` re-check row — fog-map still matches; the new mechanics are tracker artefacts scan 1 already rejected
- [x] One delta-map row per skill, each naming the lean-flow surface it duplicates or the gap it fills
- [x] Verdict line states the keeper count — **2 keepers of 5 examined**
- [x] Keepers **filed** as follow-up `TASK-NNN` at close — never adopted inside this task — **TASK-149** (frontier batching) · **TASK-150** (disclosure test + completion criteria)
- [x] Ownership header + `last_updated` refreshed; `sh scripts/gen-index.sh` re-run if metadata changed

## Owner-action checklist
- [x] ~~Only if T2 is run unattended: confirm `WebFetch` is in the headless allowlist~~ — **moot**: T2 ran attended in the interactive session (A4 resolved at G1)

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

### 2026-08-09 | scope-change | T1's Layers: under-declared at promote; DoD 7–9 premise changed by D1
**What broke — three separate things, all surfaced by gates rather than by review.**

1. **`Layers:` was incomplete.** The observed-layers check named eight paths T1 changed but never
   declared: `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `docs/architecture/overview.md` (the three
   linted template-count claims, which move whenever a template is added) · `docs/adr/ADR-014-*.md` +
   `docs/DECISIONS.md` (required by DoD 14, so foreseeable at promote and simply missed) ·
   `templates/sprint-log.md.template` · the new fixture tree and its runner. This is L-071's shape
   exactly: the declaration was internally consistent and incomplete, and only a second
   independently-derived source caught it. **Impact:** declaration only — no unowned concurrent edit
   occurred, since T1 and T2 are disjoint and execution is sequential and single-owner. **G2
   re-confirmed:** the overlap map is unchanged; correcting `Layers:` widens what was declared, not
   what is being built.

2. **D1 dissolved DoD 7–9's premise.** Those items assumed the gate's globs would be *edited* and
   therefore need must-FAIL fixtures. Choosing the `logs/` subdirectory means **no check's logic or
   glob changes at all** — the non-recursive glob excludes the subdirectory for free. Must-FAIL
   fixtures for cap-400 and task-schema would therefore be testing checks this task does not touch,
   and building them requires extracting both out of `qa-check.sh` into `scripts/lib/` first — a
   refactor of a working gate that TD-031 explicitly warns against under no pressure. **Shipped
   instead:** `evals/run-sprint-log-layout-fixtures.sh`, three retained cases guarding the claim D1
   actually rests on, negative-tested in both directions (a widened glob FAILs by name). **Parked for
   the owner:** whether DoD 7–9 are satisfied by that, or whether the checker extraction is in scope.

3. **Four legs, not three.** T1's DoD names three globbing checks; there are four —
   layers-observed (`:436`) was missed. ADR-014 was corrected before it landed.

**Also measured, and short of target:** post-split Plan capacity is **~12 task blocks**, not the ≥15
the Acceptance line asks for. Fixed overhead on a closed sprint is 108 lines because Files Changed and
the Retro still share the Plan's budget; only the Log moved. 12 against the 2–6 observed before is the
real gain, but the stated number is not met — recorded here rather than rounded up.

### 2026-08-09 | decision | owner ruled on both parked items; § Plan amended
**DoD 7–9 → satisfied by the layout fixtures.** T1 changes no check's logic, so the must-FAIL bar
attaches to the claim T1 actually introduces — the subdirectory exclusion — which is fixtured and
negative-tested in both directions. cap-400 and task-schema remain unfixtured, exactly as they were
before this sprint; that is a pre-existing gap T1 neither widens nor inherits.

**Acceptance ≥15 → amended to the measured ~12.** 15 was an estimate written before the overhead was
measured; the measurement supersedes it. The ceiling moved from 2–6 to ~12, which is the outcome the
sprint existed to produce. The further split (Files Changed + Retro out of the Plan file) was
considered and not taken — it would reopen ADR-014 for a gain nothing has yet shown to be needed.

§ Plan edited after this entry, per the frozen-plan rule.

### 2026-08-09 | complete | T2 landed — 2 keepers of 5
Five skills examined against the existing surface (L-017). **Keepers:** `grilling`'s frontier batching
+ fact/decision separation; `writing-for-agents`' branching disclosure test + completion-criteria
sharpness. **Rejects:** `wizard` (Owner-action checklist owns the concept), `wayfinder` (fog-map still
matches; new mechanics are tracker artefacts scan 1 rejected), `wait-what` (conversational move, not a
loop stage).

The `grilling` keeper is the notable one: it **contradicts a rule we currently ship.** Our grill is
"one question at a time"; theirs batches the whole *frontier* of independent decisions and serialises
only the dependent ones. The discriminator is dependency, not count — and this sprint demonstrated the
gap live, sending two popups with two independent questions each, justified ad hoc as "not stacked
ambiguity". Changing that rule is a CLAUDE.md/CONTEXT.md edit and belongs in a follow-up TASK, not here.

Also: scan 1's stale § open questions were refreshed — all three of its keepers had shipped, so its
"follow-up tasks not yet filed" list was spent and said otherwise. The doc is now **136 lines against
its 120 soft cap**, carrying two scans; the split-or-supersede call is doc-aging, for the owner.

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `references/DOCS_Guide.md` (§2·§9·§11) | T1 | the active sprint becomes two files; §9 states WHY with the six-sprint measurement, §11 archives the pair together | med — the standard other skills read | gate green; §2 row consistent with the shipped path |
| `templates/sprint-log.md.template` | T1 | new core template so the generator can render the log at first entry | low | template count lint moved 30→31 and passes |
| `templates/SPRINT.md.template` | T1 | § Execution Log becomes a pointer; names the `logs/` subdir as load-bearing | low | rendered SPRINT-047 unaffected (D2 keeps its log inline) |
| `lean-doc-generator/SKILL.md` | T1 | append rule + archival pass repointed; line-neutral edits (file is at its 110 cap) | low | cap check still 110 ≤ 110 |
| `scripts/qa-check.sh` | T1 | one line: register the new harness. **No check's logic or glob changed** | low | 70 pass, 0 fail |
| `evals/run-sprint-log-layout-fixtures.sh` + 4 fixtures | T1 | guards ADR-014's load-bearing claim; extracts the glob from the gate rather than re-typing it | low | negative-tested: widened glob FAILs naming the offending pattern |
| `docs/adr/ADR-014-sprint-log-split.md` + `docs/DECISIONS.md` | T1 | records the structural decision + its measured driver | low | corpus metadata + index lint green |
| `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `docs/architecture/overview.md` | T1 | linted template counts 30→31; CONTEXT § Sprint model describes the two-file shape (SSOT) | low | all three count claims lint green |
| `docs/sprint/archive/SPRINT-045-*.md` + `archive/logs/` | T1 | real-input migration proof: 368 → 220, log 167 in its own file | low | 5 entries preserved; content conserved |
| `docs/research/mattpocock.md` | T2 | re-scan verdict for 5 skills + refreshed stale open-questions (scan 1's keepers had all shipped) | low | corpus metadata lint green; index regenerated |

## Retro
<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Retrieval check** — **yes, one genuine miss.** `SPRINT.md.template` was edited in the *plugin cache*
(`~/.claude/plugins/cache/…`) instead of the repo source. L-010 is a **promoted** CLAUDE.md
anti-pattern naming exactly that, and it was in context the whole time — the rule was available and
not applied. Caught immediately, reverted, redone against `skills/…` with a fresh read (a cache Read
does not satisfy read-before-edit). Third sighting of L-010, after Sprint-007 and Sprint-009. Nothing
shipped wrong, but the miss is the point: a promoted rule that still gets broken is a retrieval
problem, not a knowledge problem. → count bumped on L-010; retrieval-miss signal recorded.

**Cost** — **shape: fully inline, single interactive session, zero dispatched agents.** The
orchestrator's dispatch doctrine would have sent T2 (`class: execution`) to a sub-agent and run the
two disjoint tasks in parallel worktrees; this session is configured not to use the Agent tool
unless asked, so both ran sequentially in the coordinator's own context. **Dollar cost is not exposed
for an inline session** — recorded as unavailable rather than omitted (degrade rule). What is
observable: 2 units delivered, 3 commits, 1 network-dependent task, gate run 8 times. No calibration
row is added to `night-run.md` — that series is for unattended runs, and quietly mixing an inline
sprint into it would corrupt the comparison it exists to support.

**Worked**
- **D1 turned a three-exclusion change into a zero-exclusion one.** Choosing the subdirectory over a
  `-log.md` suffix meant no check's logic or glob moved at all. The gate stayed untouched precisely
  because the design was chosen against the gate's existing behaviour rather than around it.
- **Gates caught what review didn't** — three separate times. The under-declared `Layers:`, the
  `CHANGELOG.md` analogy, the stale knowledge index: all found by `qa-check`, none by reading.
- **Negative-testing the new fixture found a bug in the fixture.** Its first run failed on locale
  collation, not on the thing under test. A fixture only asserted in the passing direction would have
  shipped that.

**Friction**
- **The DoD encoded two things it could not yet know** — an unmeasured ≥15 as an acceptance target,
  and must-FAIL fixtures premised on a design (glob edits) that D1 then dissolved. Both surfaced only
  during execution, and both needed an owner ruling to resolve. → L-088.
- **`layers-completeness` cannot tell a file *mentioned* from a file *touched*** — it fired three
  times in one task on prose references. TD-020 accepts over-reporting by design, but three in one
  task is a cost worth recording. → TD-032.
- **The observed-layers check requires exact whole-path tokens** — `evals/fixtures/` does not cover
  files beneath it, so a new fixture tree means enumerating every file in `Layers:`. Adjacent to
  TD-031's complaint about the same check.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- **L-088** — a DoD written at promote freezes assumptions execution can invalidate: numbers not yet
  measured become acceptance targets, and premises can be dissolved by a design decision taken later
  in the same sprint. Amend the Plan explicitly through a `scope-change`; never quietly reinterpret
  it, and never round a measurement up to meet a stated figure.
