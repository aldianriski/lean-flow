---
sprint: 132
slug: expertise-without-the-plugin
owner: Maintainer
last_updated: 2026-10-20
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-132 — Execution Log

> Append-only companion to [`../SPRINT-132-expertise-without-the-plugin.md`](../SPRINT-132-expertise-without-the-plugin.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line budget
> (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry carrying the signed
> governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a `scope-change` entry — what broke ·
> impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-20 | promote | plan locked, governance signed, three members: EPIC-007's first slice
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. The six active entries (L-239 · 238 · 237 · 236 · 234 · 210) are each at count 1. A query that also
  matched L-155 was checked by its header, `[status: promoted]` (its body quotes a status string).
- ☑ TD aging: 103 of 105 open rows aged against sprint 132; none newly aged (no open row was created at Sprint-129); TD-259 · 260
  (Sprint-131) are not aged. Second route: 108 rows − 3 resolved = 105 open. No open row is `high`.
- ☑ doc-aging, §11: TD deletion not due (TD-135 · 154 · 167 resolved at SPRINT-130, due at 133). The store prune of
  `done/TASK-451`–`454` (closed SPRINT-129) is due by age, but all four still have live citations (research docs and their
  cancelled twins), so none is pruned. CHANGELOG rotation ran at the 2.11.0 release.
- ☑ doc-aging, §2: one soft breach, `docs/research/reference-rejudge.md` (170 > 130). Resolved, owner-approved and before this
  commit: § Experiment results moved verbatim to `docs/research/logs/reference-rejudge-experiments.md` (`ef033c9b`; diff-proven
  verbatim), leaving a pointer. The file is now 78 lines.
- ☑ epic rollup currency: EPIC-007 is activated by this promote (no member closed before it), so there is no drift.
- ☑ epic coverage: EPIC-007 has 6 open conditions and 6 marked (C1 → TASK-463, TASK-464 · C2 → TASK-464 + next slice · C3 →
  TASK-465 · C4 → TASK-464 + next slice · C5 → next slice: gate-condition ruling · C6 → TASK-463). Cross-check: 6 = 6 + 0.
- ☑ roadmap coverage: no roadmap. ☑ handoff ledger: none.
Epic refresh (owner-approved): `status: active`; D3 amended (EPIC-006 closed, so the Lane-2 sequencing is moot); D6 and D7
record the intake rulings; open question 4 is answered by D7; the INDEX row is updated; and `docs/epic/logs/EPIC-007-workflow-packs.md`
is created with this sprint's row.
Size check: 2 M + 1 S, no `L`. All three members are `origin: decomposer` (decomposed 2026-10-19, `cc77da66`).
promote-check 10/0 after one fix: T3's prose named `qa-check.sh` (to say no leg is added). A Cites: entry did not satisfy the prose leg, which compares the bare filename literally (TD-257), so the prose was reworded. Dispatch preflight: PASS base-ref · waves T1=0 T2=1 T3=2 · `packs/` and `skills/diagnose/` owned in order T1 → T2 · PREFLIGHT: CLEAR.

### 2026-10-20 | gate | G1 signed (batch fast-path); one owner ruling before G2
G1: batch fast-path confirm, all three members `origin: decomposer`, scope unchanged since `plan_commit` 1edfdb8b.

### 2026-10-20 | scope-change | TASK-464 and TASK-465: the first pack is /tdd, not /diagnose — D1 disqualified /diagnose (owner ruling)
**What broke:** EPIC-007 D1 admits a pack only when its procedure has real internal use. Three routes over every main-thread and
sub-agent transcript in this project found **0** runs of `/diagnose`: Skill-tool invocations 0, slash invocations 0, sub-agent
files 0. Its archived-log mentions are all edits to the skill itself (SPRINT-050 · 051 · 129). TASK-464's frozen Done-when ("names
the internal use that qualified it under D1") could not be met honestly. `/tdd` ran as the procedure skill in **10** dispatched
builder runs (SPRINT-109 T2–T4 · SPRINT-110 T2–T4 · three on 2026-10-03 · SPRINT-124 T1).
**Impact (owner ruling):** the first pack is **software-implementation ← `/tdd`**. TASK-464's title, Why, first Done-when line,
Touches and Tracker name `/tdd` in place of `/diagnose`. TASK-465's exercise becomes a small feature built test-first instead of
a seeded defect. Both files are renamed to match their titles. § Plan's T1 and T2 Layers name `skills/tdd/` in place of
`skills/diagnose/`, and its Scope, D2 and Members follow. The task ids, the dependency chain and EPIC-007's coverage marks are
unchanged. Re-confirm G2: the G2 being drafted now uses `/tdd`.

### 2026-10-20 | gate | G2 signed by the owner after the builder check; T1 → T2 → T3 sequential
G2 ran the builder check from the repo's own `skills/orchestrator/references/builder-check.md`; the installed plugin is still
2.10.0 (A3). Three fresh Sonnet readers ran in parallel, one per task design, each given the design, the member's frozen
`## Done when` and the touched paths. Before that, a probe settled T3's no-plugin premise: `claude -p --setting-sources local
--disable-slash-commands` from an empty directory loads only the 3 built-in plugins, with `skills: []` and `slash_commands: []`.
builder-check · T1 · 4 contradictions · 6 questions · fixed: the procedure checklist line accepts named steps with their outputs; findings go in this log; greps take ids and word boundaries; Tier P; README/CHANGELOG/epic-scope edits assigned
builder-check · T2 · 5 contradictions · 6 questions · fixed: the pack inlines all of /tdd's rules and names no lean-flow skill, path or id; verification and the output contract are defined exactly; a finding gets one fix and re-read; the approval step goes in escalation; routing is per step
builder-check · T3 · 6 contradictions · 6 questions · fixed: the file count is asserted before the run and hashes are compared before and after; the init lists are the mechanical proof; the output-contract walk reads the pack's own field; test-first uses tool-call order; all 8 fields are walked
Totals: 15 contradictions and 18 questions (4 + 5 + 6 · 6 + 6 + 6).
Owner rulings at G2:
- **Placement:** a top-level `packs/` tree at Layer E (contract + packs + examples), recorded as ADR-055.
- **T3:** binary, one run. A harness fault is fixed and re-run once. An agent miss is recorded as a fail and left for the owner's ruling.
Approved designs:
- **T1** (inline, decision class): `packs/CONTRACT.md`, eight fields each with a checklist line, a domain-neutral required set,
  and routing by role; `packs/examples/non-software-skeleton.md`; ADR-055 and a DECISIONS row.
- **T2** (a dispatched Sonnet builder after T1 merges): `packs/software-implementation.md`, carrying all of /tdd's rules
  inline, the internal-use line (10 runs) and per-step routing; one README passage.
- **T3** (run by the coordinator as a separate `claude -p` process): a printf-built scratch Node repo with its file count
  asserted; the pack's text inline in the prompt; proof from the init lists, hashes both sides, the output-contract walk and
  the 8-field walk; the record in `docs/research/logs/workflow-pack-exercises.md`.
Verification:
- T1: the domain and id greps, plus a fresh-reader skeleton validation.
- T2: the model/id greps, plus a fresh-reader validation.
- T3: a recorded run (judgment tick, plus the mechanical sub-checks).
- System verify after the final merge.
consequence · T1 · behaviour:low · governance:high → scoped Codex + the adversarial floor (D3); Codex from an empty directory (L-239)

### 2026-10-20 | progress | T1 built inline, reviewed (Codex 2 Spec findings, one retry, CLEAR); the strict fresh reader ticks all 8 lines
T1 (TASK-463), coordinator-built because it is decision class: `packs/CONTRACT.md` (eight fields, each a checklist line;
routing by role in plain words; a header with source and internal use), `packs/examples/non-software-skeleton.md` (supplier
shortlist, declaration only), ADR-055 and its DECISIONS row (`7b167d27`).
Verification:
- The greps over the eight-field section (domain words, `\b` bounded) and over both files (model/vendor names; lean-flow
  ids/paths) print nothing. Each was proven to fire on a seeded line, and the section it reads is 31 lines.
- First fresh reader: ALL TICKED, with 4 ambiguity notes; two were fixed (a rule per missing input; a skeleton says so) at
  `a07406ea`.
review · T1 · scoped-reviewer · Codex gpt-6-astra (empty cwd, 0 commands) · Standards CLEAR · Spec FINDINGS (2): F1 "run a command" is software-flavoured; F2 the skeleton read material its inputs did not declare → retry 17fbc646 → re-review CLEAR
Strict re-read after the retry: FINDINGS (1). The skeleton did not cover a missing need or the absence of a requester (a
declaration gap; the field is satisfiable). Fixed at `9fe44d9b`; the final strict re-read is ALL TICKED, with "(a) no field
requires a software concept".

### 2026-10-20 | progress | T2 built (dispatched Sonnet), reviewed (Codex 4 Spec + reader 2, one retry, both CLEAR), merged
T2 (TASK-464): `packs/software-implementation.md`, 48 lines. It has the header (source "/tdd, procedure v0.1.0, plugin 2.11.0";
internal use: the 10 runs), all eight fields, every /tdd SKILL.md rule inline, and routing per step (planning is decision;
the cycles are execution). README gains a "Workflow packs" passage (`b39371c3`).
Verification: the model/vendor grep prints nothing; the name/path/id grep matches only the header's source line; both are
proven to fire on a seeded line.
review · T2 · scoped-reviewer · Codex gpt-6-astra (empty cwd, 0 commands) · Standards CLEAR · Spec FINDINGS (4): F1 the source gave no procedure version · F2 no rule for absent code · F3 the commit half of the whole-suite gate was dropped · F4 change-detector classification turned into a ban
Coordinator ruling on F4: the risk-policy prohibition is in the owner-signed G2 design and stays. Only the procedure
checklist's added "rewrite or drop it" exceeded the source and was softened.
Fresh reader (DoD 3), strict, in parallel: FINDINGS (2). `inputs` lacked absent code and the optional spec; the `output
contract` lacked RED-run evidence and the behaviour list. Folded into the same single retry → `2df2f4c5`.
review · T2 · re-review · Codex · F1–F3 OK, F4 OK under the ruling, no new defect · VERDICT: CLEAR
Strict re-read: ALL TICKED (8 fields + Routing + Header). Merged (`aa318083`); 3 over-long lines re-wrapped by the
coordinator (whitespace only; the word-diff is empty). The duplicate-id check prints nothing.
consequence · T2 · behaviour:low · governance:low → the scoped Codex review (D3) plus the reader validation; no adversarial floor (the first pass had findings)

### 2026-10-20 | progress | T3 run by the coordinator: no-plugin proof and no-copy proof hold; the output contract is partly met (RED 1 of 4) → owner
T3 (TASK-465), coordinator-run as a separate `claude -p` process (the stated reason: a sub-agent would inherit the plugin).
- **Run 1** was a harness fault: the scratch repository sat under `.claude/`, so all 5 edits were refused as sensitive. Re-run
  once (owner rule), with the repository in the system temp directory.
- **Run 2** took 17 turns, 50 s and $0.12.
  - `system/init` lists only the 3 built-in plugins, with `skills: []`.
  - The pre-run tree is exactly 3 files, 0 identical to lean-flow; the post-run tree is 2 files modified, 0 identical. The hash
    control was seed-proven.
  - `npm test` gives 5/5, exit 0.
- **Output contract:** the behaviour list was met in substance. Behaviour 1 has its RED run, then its code, then GREEN.
  Behaviours 2–4 first ran GREEN after the tracer code that covers them, so their RED evidence is missing. Under the binary
  rule: **not met**.
- **Finding:** neither the pack nor `/tdd` has a rule for a new test that passes on its first run. Two searches of
  `skills/tdd/` find none.
- **Record:** `docs/research/logs/workflow-pack-exercises.md`.
review · T3 · scoped-reviewer · Codex gpt-6-astra (empty cwd, 0 commands) · FINDINGS (4): the "at the top" claim, proof limits, run-1 cause, the finding overstated → record retry → re-review FINDINGS (1): the absence claim rests on one search → still-open → owner
  Since then the coordinator ran a second, wider search (no match) and narrowed the wording to what both searches establish.
consequence · T3 · behaviour:low · governance:low → the record reviewed once by Codex (D3)

### 2026-10-20 | scope-change | TASK-464 and TASK-465: one rule for a test that passes on its first run, in the pack and in /tdd; T3 re-run once (owner ruling)
**What broke:** T3's no-plugin run met the output contract only in part. Behaviours 2–4 first ran GREEN because the tracer code
already covered them. Neither the pack nor its source procedure, `/tdd`, says what to do then, so the contract's
RED-per-behaviour evidence could not be met by an honest follower.
**Impact (owner ruling):**
- **TASK-464 (the pack) and `/tdd` gain one rule.** A new test that passes on its first run is not a RED run. It is recorded as
  "already covered", naming the production change that would fail it, and the next behaviour proceeds. The output contract
  accepts either a RED run or that record for each behaviour.
- **The change lives in T2's Layers** (`packs/` · `skills/tdd/`) and is attributed to T2, with `/tdd` and the pack changed in
  one commit so they stay in step. The source line's plugin version is set to the release version at close. `/tdd`'s own
  `version: "0.1.0"` has not been bumped on its earlier edits (SPRINT-051 · 129), so the plugin version is the reliable marker.
- **TASK-465:** the exercise is re-run once (same setup, same prompt, binary rule), and the record appends run 3.
- **Frozen Done-when text:** unchanged. TASK-464's boxes 1–3 stay ticked, and the change is reviewed once by Codex.

### 2026-10-20 | progress | T2's already-covered rule (scope-change 282a127c) reviewed CLEAR; T3 run 3 → owner ruling: met in substance
T2 addendum: `/tdd` and the pack gain one rule (`33493a73`). A new test that passes on its first run is recorded as *already
covered*, naming the production change that would fail it; the output contract accepts that in place of a RED run.
review · T2 · scoped-reviewer · Codex · FINDINGS (1): the tracer bullet still demanded RED unconditionally → retry b541a4f2 (rule extended to the tracer bullet, both files) → re-review CLEAR
T3 run 3 (fresh scratch repository, same request, the updated pack; 16 turns, 36 s, $0.12): the init event shows 3 built-ins
and `skills: []`. Before the run: 3 files, 0 identical. After: 2 modified, 0 identical. `npm test` gives 5/5, exit 0.
Behaviour 1 shows RED → code → GREEN. Behaviours 2–4 are each recorded as already covered.
review · T3 · run-3 record · Codex · FINDINGS (4): behaviour 3's note names no definite failing change (`Math.ceil` still passes); behaviour 4's padding example is wrong (its capping example holds); "no code ahead of a test" was misworded; "every field followed" overreached → record corrected to the evidence (b2c8ed22), verdict "not established" → owner
owner-ruling: review · T3 — met in substance. The agent followed the pack end to end and applied the new rule to all three already-covered behaviours; one note is imprecise, not absent or false. Box 1 is ticked with the caveat, and a follow-up asks the pack for a concrete change in each note.

### 2026-10-20 | gate | system verify FAIL (layers-token-matches-nothing) → owner ruling: fixed-and-rerun
system-verify · FAIL(layers observed) · QA_FULL on the VPS at `fa214454`: 303 pass, 1 fail, 114 s; `bun test` 441/0
owner-ruling: system-verify — fixed-and-rerun. T1 declared `spec/packs/` as a candidate placement before G2. The G2 ruling (`packs/`, ADR-055) left it unused, so the token matches nothing.

### 2026-10-20 | scope-change | § Plan T1 Layers: drop the unused candidate token `spec/packs/` (owner ruling above)
**What broke:** T1's Layers named two candidate trees so that whichever one G2 ruled would already be declared. G2 ruled
`packs/`. The other token, `spec/packs/`, matches no path, which the `layers observed` leg FAILs by design.
**Impact:** § Plan T1's `Layers:` loses `spec/packs/`. Nothing else changes; no member's Done-when is touched.
system-verify · PASS · QA_FULL on the VPS at `3d6e8265`, the final integrated tree after the fix: 304 pass, 0 fail, 114 s (`bun test` 441/0 on the first run)
