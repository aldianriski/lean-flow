---
sprint: 121
slug: cover-what-is-open
owner: Maintainer
last_updated: 2026-10-10
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-121 — Execution Log

> Append-only companion to [`../SPRINT-121-cover-what-is-open.md`](../SPRINT-121-cover-what-is-open.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-10 | promote | plan locked at `4d82a8f`, governance signed, seven members: give every open item a home, run as EPIC-015 Dogfood 1
The backlog held nothing promotable until a full scan, which the owner asked for after a backlog-only triage, found four EPIC-015
conditions with no tasks and four workdoo epics filed in this repository. Two Codex review rounds ranked the work. The owner ruled the
grill (CW6 via a ruling task; CW5 and Dogfood 2 in one overnight run; this sprint as Dogfood 1; the re-armed freeze widened to
governance) and the governance checklist (aging sweep `448641e`; §11 deletion of TD-122/124). TASK-404 was split at size-check so
only its profile (TASK-421) joins. `promote-check.ts` returned 22 pass, 0 fail after two member files' bare filenames were written
as full paths.

System verify at promote (`QA_FULL=1`, VPS fresh clone of `7679f3f6`): `301 pass, 3 fail`, 116 s. That run had two causes.
(1) **This log was absent**: the sprint file said "created lazily", but the night-run rollup leg treats an active sprint without a
log as a FAIL, so this entry creates the log. (2) **The fresh clone had no `node_modules`**, so `typecheck` and
`typecheck-population` could not find `tsc`. That is a property of the run environment, not of the tree, and the re-run installs
dependencies first.

### 2026-10-10 | progress | system verify at promote is green after the log fix
`QA_FULL=1` on a VPS fresh clone of `d38a4f71`, with `bun install --frozen-lockfile` run first: `QA-CHECK: 303 pass, 0 fail`, rc 0,
120 s, read from the run's own `gate121.rc` and `gate121.secs` files. The two typecheck FAILs from the first run were the
environment (no `node_modules` on a fresh clone). The rollup FAIL was the missing log, which the promote entry above created.

### 2026-10-10 | g2 | G1 + G2 signed (owner); every J2 ruling settled up front, all seven tasks re-declared J1 for a continuous run
G1, as a batch: no member is size L. TASK-414, 416, 419 and 420 are `origin: decomposer` and confirmed unchanged. TASK-413, 418 and
421 took the full checklist. TASK-418's scope changed (see the scope-change below). Recon ran before G2: an Explore census of the
62 active learnings, an Explore pass over workdoo's commit gate and epic citations, and the ADR-044/048 Decision diffs.
Owner rulings, taken by popup before execution so that nothing pauses between tasks (Dogfood 1):
- **T1 (TASK-414), pre-delegated:** tick CW6 only if every field maps to a rollup line AND the emitter emits every field on all
  five terminal paths (file:line). Otherwise leave it open and file the gap.
- **T2 (TASK-413), restore + appended correction, for both ADRs:** the engine compares the § Decision BODY against its accepted
  text, so neither a header marker nor `superseded` clears S4.APPEND. Each ADR gets its accepted body restored, a header
  `Corrected:` marker, and an appended dated § Correction that carries today's corrected text.
- **T3 (TASK-421), target rule pre-set:** TASK-404's target is a ≥50% cut of the engine's Windows wall clock, or the measured
  share of the top spawn sites if that is lower. It is recorded in TASK-404 as ruled by this rule.
- **T4 (TASK-419), census approved with the fold rule:** 10 families plus 1 singleton = 62 (A 6 · B 6 · C1 10 · C2 7 · D 5 · E 10 ·
  F 6 · G 4 · H 4 · I 3; L-210 singleton). Members of A, B, C1, C2, D, E and I fold into their existing promoted rule as
  sightings (`disposition: merge`). In F, G and H the newest member survives with the summed count and is listed as a promotion
  candidate. The census's uncertain placements stand. L-198 and L-229 headings say `[status: active]` while their bodies say
  `promoted: yes`, and are repaired.
- **T5 (TASK-420), naming:** each open Closed-when line of an active epic ends with `→ TASK-NNN[, …]` or `→ next slice: <name>`.
  The epic alone holds its coverage, and /triage, /prime and promote read only the epic. There are no positional condition numbers.
- **T6 (TASK-418), move plus an amending ADR:** see the scope-change below.
- **Log-template defect:** filed separately as TASK-422 (`fe339ee`) rather than widening this vehicle.
Waves: T1 and T2 inline, with T3, T4 and T5 dispatched to isolated worktrees in parallel, then T6, then T7. Shared-file owners per
§ Decisions D1/D2. The coordinator owns the sprint file, this Log, member ticks and `git mv`s. Review: T5 gets the Codex loop
(shipped skills/spec). T4 gets a must-FAIL fixture, a run on the real ledger, and a scoped reviewer. T2 and T6 get a scoped
reviewer. T1, T3 and T7 get self-review. Estimated cost: about 1.5–2.5M sub-agent tokens.

### 2026-10-10 | scope-change | TASK-418 (T6) gains an ADR amending ADR-041; T6 Layers widened to `docs/adr/`
What broke: ADR-041's accepted Decision says "lean-flow owns the outcome record — EPIC-016 … workdoo owns the execution record",
and workdoo's `.claude/CLAUDE.md:22` repeats it. The owner's move ruling reverses that, so the move cannot land without a
decision record (L-220: the ADR was read before the option was offered). Impact: T6 writes a new ADR that amends ADR-041 (an
epic's outcome record lives with its execution), adds a `Scope amended by:` header marker to ADR-041, and updates workdoo's
`.claude/CLAUDE.md` and `AGENTS.md`. TASK-418 gains one Done-when box for it, and T6's `Layers:` gains `docs/adr/`. Recon:
workdoo has no attribution gate, no `docs/epic/` and no conformance run, and its 88 citations are bare ids, so there is no id
collision. G2 re-confirmed: owner signed, same popup round.

### 2026-10-10 | scope-change | T6 Depends-on gains T2 (pre-dispatch preflight: shared `docs/adr/` and `docs/DECISIONS.md`)
What broke: the preflight HALTed with `shared-file-unowned` on `docs/adr/` and `docs/DECISIONS.md`, which T2 and T6 share with no
Depends-on edge. § Decisions D2 already orders T2 first, but the Plan never declared the edge, and the edge is what the preflight
reads (L-151). Impact: T6 `Depends-on: T1 · T2`. Scope is unchanged and the wave ranks are unchanged (T6 is already wave 1).
G2 is unaffected.

### 2026-10-10 | scope-change | T4 fixture runner is `.ts`, not `.sh`; T3 runs alone after T4 and T5 (dispatch shape)
What broke: T4's `Layers:` named `evals/run-learnings-metadata-fixtures.sh`, but this repo writes no new shell scripts (executable
logic is TypeScript run by Bun, owner rule 2026-09-09), and the gate already wires `run-*-fixtures.ts` harnesses. Impact: T4
`Layers:` names `evals/run-learnings-metadata-fixtures.ts`, the same role in a different file. Dispatch shape: T3 measures wall
clock, so it runs alone after T4 and T5 rather than beside them, and the host load it states is uncontaminated by sibling builders.
Wave ranks are unchanged and G2 is unaffected. Declared base for wave 0 is the commit that carries this entry.

### 2026-10-10 | progress | T1 done: CW6 stays OPEN under the pre-delegated rule; USER_STOP is produced by no code path (TASK-423 filed)
consequence · T1 · behaviour:low · governance:med
review · T1 · self-review · behaviour:low · governance:low
Field map: every CW6 field has a line in SPRINT-119's committed rollup (archived log :103–110). The emitter check, which the owner
made a condition at G2 (Codex: one run proves one run), failed on one path. `reap()` derives four terminal states (`night-run.sh`
:340–359) and prints all eight fields (:414–421), but **USER_STOP is produced by no path**. The comment at :312 hands it to
`die_doa()`, every `die_doa()` call site (:485–516) is a pre-launch error, and it prints only `DEAD-ON-ARRIVAL` (:461). A user
interrupt therefore reads as HARD_FAILURE, or as no rollup at all. CW6 is not ticked. The gap is filed as **TASK-423** (backlog,
P1, Consequential G, epic EPIC-015), which also gives CW6 a covering task under the new active-epic coverage rule (TASK-420).
Line numbers were re-derived by a second grep before this entry (the first draft cited :329–345, which was wrong).

### 2026-10-10 | progress | promote governance checklist, recorded late, as the owner signed it at promote (S10.PROMOTEREVIEW)
The checklist was shown to the owner and signed by popup at promote, but it was never written to the promote record: this log did
not exist at `plan_commit`, and the plan-lock message did not carry it. Conformance on the VPS (at `1aaf8085`) named this gap,
`promote-checklist-absent`, and this entry is the record:
- ☑ L-promotion (count≥2, promoted:no): none. Two routes agree. 62 active entries, each count 1, are handled by T4 (TASK-419).
- ☑ TD aging (≥3 sprints unaddressed): 120 of 126 open rows are aged. TD-231 to TD-236 are newly aged and named in the
  SPRINT-121 sweep (`448641e`). TD-168 (`high`) is routed to TASK-404 and TASK-421.
- ☑ doc-aging (§11 retention + §2 caps): TD-122 and TD-124 deleted (owner-approved, `448641e`). CHANGELOG rotated at 2.3.0. No
  cap breach. **MISSED at promote:** the store prune. `TASK-327` (`done/`, closed at SPRINT-118) became retention-due when the
  current sprint reached 121, and nothing live names it (S11.BACKLOG). It is proposed for §11 deletion now, pending owner approval.
- ☑ epic rollup currency: EPIC-015 current. EPIC-019's member pointer is stale, which TASK-418 (T6) owns.
- ☑ handoff ledger: none exists.

### 2026-10-10 | progress | T2 done: S4.APPEND clean, with corrections kept as an appended record
consequence · T2 · behaviour:low · governance:med
review · T2 · scoped-reviewer · behaviour:low · governance:med
ADR-044 and ADR-048 each have their accepted § Decision body restored (hash-identical to `f1efa36b` / `3e725ef4`), a header
`Corrected:` marker, and an appended `## Correction 2026-10-10` that quotes the formerly in-force text verbatim (`1aaf8085`). The
scoped reviewer was CLEAR on 6/6 bounded checks. VPS conformance at `1aaf8085`: `PASS S4.APPEND -- 51 ADR(s) unedited`. That run
also surfaced two Gated findings outside T2: the promote checklist (recorded in the entry above) and TASK-327's retention (proposed).

### 2026-10-10 | progress | §11 store prune: TASK-327 deleted (owner-approved); named pause, cause: a promote miss, not a gap between tasks
The one pause in this run so far: the owner was asked by popup to approve §11 deletion of `docs/work/done/TASK-327-*` (closed at
SPRINT-118, nothing live names it). It became due when the current sprint reached 121, and the promote doc-aging line missed it.
Approved, and the file was removed in its own commit. Its record stays in CHANGELOG, the sprint archive and git, and the id is
retired. For Dogfood 1 (TASK-416) this is a named pause with its cause, not a confirmation between authorized tasks.

### 2026-10-10 | progress | T5 built and merged (`45a13010` → `313a9a41`); real-input run on live EPIC-015: fully covered
consequence · T5 · behaviour:med · governance:high
A builder in an isolated worktree, base `105a8ea8` verified. Spec 0.15.0 gains an "Epic coverage" paragraph in § 2 (prose only, no
rule-table row). `/lean-doc-generator` gains epic activation listing, promote refusal unless an owner override is recorded, and
`☐ epic coverage`, with the procedure in the new `references/epic-coverage.md` (SKILL.md stays at 138 lines). `/triage` lists
uncovered conditions (132 lines). `/prime` adds a `Coverage:` row (139 lines). CONTEXT, README and the root CHANGELOG
(`## Unreleased`) are updated. Five fixture cases, walked by hand, match the expected verdict 5/5. The builder's bare gate
truncated on this host at 528 s, so system verify runs on the VPS. **Real input (coordinator, `e735c590`):** EPIC-015's four
open lines are annotated CW5 → 415 · CW6 → 423 · CW7 → 415, 416 · CW8 → 417, and the procedure reports it fully covered
(4 open, 4 mapped; cross-check 4 = 4 + 0). TASK-414 sits in `done/`, so CW6 needed re-pointing to TASK-423, which is the
stale-coverage case the rule exists to catch. Codex review round 1 dispatched.

### 2026-10-10 | progress | T6 built: four epics moved to workdoo (`16252b2`), ADR-052 amends ADR-041 (`4a634592`)
consequence · T6 · behaviour:low · governance:high
workdoo (committed by explicit path while another session was committing there; owner ruled path-scoped): `docs/epic/` gains
EPIC-016/018/019/020 with ids unchanged and an INDEX. Its GitHub links became relative, lean-flow refs are prefixed, and
EPIC-019's SPRINT-010 row is corrected (closed, `5770c6d`). `.claude/CLAUDE.md` and `AGENTS.md` now point to `docs/epic/`.
lean-flow: the four files are removed. INDEX rows became relation pointers, the sequencing register got an amendment (the next
epic id is derived across both repositories), ADR-041 got a `Scope amended by:` marker (Decision untouched), and ADR-052 and its
DECISIONS row were added. The prose-density baseline row is dropped. Two ADR figures were re-derived before freezing (336 lines,
not 339; 21 open conditions, not 13). The GitHub pointer links resolve once workdoo is pushed (push is owner-reserved). Gates:
pending system verify.

### 2026-10-10 | progress | T5 reviewed: Codex round 1 7/7 PASS + 2 findings, fixed inline (`b306e52a`), round 2 RESOLVED; 4 of 5 boxes ticked
review · T5 · codex · behaviour:med · governance:high
Round 1 (static, packet-fed): items 1–7 PASS. F1: /triage's "read other folders only to resolve a `depends-on:` id" blocked the
coverage lookup. F2: an epic activated *by* a promote could pass that same promote. Both were fixed as the one bounded retry,
coordinator-inline, with the spec, the reference and /triage aligned. Round 2: F1 RESOLVED, F2 RESOLVED, no new contradiction.
Box 4 (real input) is held for an owner ruling. Its text names "TASK-414–417", but T1 closed TASK-414 with CW6 still open, so
the live run reports EPIC-015 fully covered by 415, 416, 417 and **423**: the stale-coverage rule doing its job. Ticking it as
written would be re-reading the criterion to fit (L-088), so it waits for a recorded ruling.

### 2026-10-10 | scope-change | T1, T2, T4, T5, T6 `Layers:` gain their own member-file paths; members re-declared J1 to match the Plan (system-verify findings)
What broke: VPS `QA_FULL=1` at `b306e52a` read `293 pass, 5 fail`. Three of the five were my own coordination errors.
(1) `layers observed`: I committed member-file moves and ticks under `sprint(121) Tn:` subjects. Member files are
coordinator-owned and belong under bare `sprint(121):` (the SPRINT-120 convention), so leg 15 charged them to tasks that never
declared them. The commits stand (the Log cites their shas), so each task's `Layers:` now names its own member paths
(L-229: a widened scope is wired only when the Plan line says so). From here on, member moves and ticks go under bare
`sprint(121):`. (2) `authority-plan-member-mismatch`: G2 re-declared the Plan rows J1 but left the seven member files at J2.
They are now J1, as G2 ruled. (3) The knowledge index was stale after ADR-052 and the LEARNINGS changes, and is regenerated in
the next commit. The other two findings are review-depth: T6's owed review (dispatched) and T1's unclassifiable self-review
line, which is held for an owner ruling (see the next entry). G2 is unaffected.

### 2026-10-10 | progress | consequence lines re-recorded with the checker's vocabulary (low|material · low|high)
consequence · T1 · behaviour:low · governance:low
consequence · T2 · behaviour:low · governance:high
consequence · T5 · behaviour:material · governance:high
The earlier T1, T2 and T5 consequence lines used `med`, which is not a value the checker recognises, so those lines were
unreadable as records. T1's earlier `review · T1 · self-review · … · governance:med` line is graded unclassified, and an
append-only log cannot retract it. That is put to the owner rather than edited in place.

### 2026-10-10 | scope-change | owner rulings: T1 log token fixed in place; TASK-420 box 4 met with a changed covering set; TASK-419 box 2 met as active-only; promotions deferred to the next promote
- **T1 log line, corrected in place (owner):** the line `review · T1 · self-review · behaviour:low · governance:med` (the T1 entry
  above) now reads `governance:low`. `med` is not a value the review-depth checker accepts, the gate grades every self-review line,
  and an append-only log could not otherwise retract it. T1 changed no spec, skill or ADR (governance:low). This is the only
  in-place edit to this log, and it is named here.
- **TASK-420 box 4 (owner):** the criterion names "TASK-414–417". The live run reports EPIC-015 fully covered by 415, 416, 417 and
  **423**, because T1 closed TASK-414 with CW6 still open, so CW6 was re-pointed to TASK-423. The substance holds: the epic is
  fully covered, and a seeded removal (fixture `b-one-missing`) reports exactly that condition. Ticked as met with the changed set
  named.
- **TASK-419 box 2 (owner):** "FAILs … on any entry" collided with §11's collapse rule. About 150 promoted entries are collapsed
  to pointers and legitimately carry no body metadata. The lint covers `[status: active]` entries, and the
  `promoted-pointer-exempt` fixture pins that scope. Ticked as met.
- **Promotions (owner):** the three survivors at count ≥ 2 (F L-185 ×6, G L-219 ×4, H L-217 ×4) are proposed at the next
  promote's checkpoint, as TASK-419 box 4 states. H feeds TASK-417's stop rule. Conformance keeps three Gated S10.PROMOTION
  findings until then.
