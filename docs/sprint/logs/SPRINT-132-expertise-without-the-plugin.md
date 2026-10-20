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
