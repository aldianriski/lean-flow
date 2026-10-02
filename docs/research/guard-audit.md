---
owner: Maintainer
last_updated: 2026-10-02
update_trigger: A guard is added, frozen or cut, or the class rules change
status: current
id: guard-audit
tags: [tooling, process]
domain: governance
related: [ADR-050, ADR-029, ADR-043, qa-gate-timing]
---

# Research — Which guards earn their upkeep, judged by the defects they actually caught?

> **Question.** Of every guard in this repo, which caught a real defect, which are consumer-facing, and which should be kept, frozen or cut?
> **Verdict.** 57 guards: **34 keep · 21 freeze · 2 cut**, by six class rules. 22 ever caught a real defect (>=62 recorded catches; E03 only via
> a catch shared with E01); 35 caught none or have no record. Upkeep is ~235 events against those catches. The two cuts are small, so the saving is the proof bar (ADR-050), not deletion.

## Why this matters
SPRINT-111 grew from "delete one file" to five tasks and ~22 agent dispatches because its guards read the retired shape (Retro · Cost). ADR-050
needs the guards' own record to say where the proof bar is worth paying, and `TASK-398` lands the cuts this audit rules.

## Options considered
- **A — Uniform bar, no audit.** *Trade-off:* simple; it is the status quo whose cost the owner measured.
- **B — Class rules over the evidence, exceptions to the owner.** *Trade-off:* one decision per class; a rule can misfire on an edge row (§ Open).
- **C — Rule on each of the 57 guards.** *Trade-off:* exact; one owner decision per guard, and most are obvious from the class.

## Findings
**Unit.** A *guard* is one verdict-producing check: a `qa-check.sh` leg or its `check-*` file, an engine rule family, a skill-procedure check, a
`test/` guard, or a parity harness. A *harness* is its fixture and is attached to exactly one row, never counted twice (64 harnesses -> 57 rows).
Engine rules (45 `assert_*`) are grouped by § into 11 families, because ADR-043 makes every one R1 and per-rule rows would add no decision.

**Population, two selectors (L-198).** A = what the gate names (`eval_harnesses_always` 46 · `_optin` 13 · `_excluded` 5 = **64**); B = what is on
disk (`git ls-files evals/ | grep -E '^evals/(run-|assert-|selftest-).*\.(sh|ts)$'` = **68**). A∩B = 64, **A∖B = 0**, **B∖A = 4**: `assert-boundary-park`,
`assert-judgement-retry`, `assert-noaction-park`, `assert-park-revisit` are the *subjects* the four excluded `selftest-assert-*` run, not harnesses
(they ride with S10). Also on disk, outside both selectors: 10 `evals/*.test.ts` and the `test/` tree (run by `bun test`, which the gate does
not invoke, L-221), `evals/lib/`, and 25 `scripts/lib/check-*` files. The 64 harnesses were mapped to rows and the map diffed against A: empty.
Legs are delimited by `qb_checkpoint "leg ..."`; legs 5, 7 and 8 are retired tombstones and are not rows.

**Catches, two routes, never recall.** Route 1: `git log --name-only` over all 1,591 commits (guard files and fix subjects). Route 2: LEARNINGS,
TECH-DEBT and the sprint archive (112 entries). A catch is a guard FAIL on a real artifact that preceded a fix; a guard's own bug is a *maintenance
event* and is counted apart. Four evidence agents split the rows; I re-checked 7 cited shas and 5 ledger ids against `log.txt`/LEARNINGS (all held) and
refuted one claim (`S11.RESEARCH`/`S2.R-TEMPDIR` "twins" of legs 2c/2d: the engine has no such `assert_`, so they are not R5 duplicates).
Routes disagreed on E07 and E08 (a retention fix a rule might have prompted, no FAIL before it): counted `>=1` and flagged in the table.

**What the record says.**
- Catches cluster in few events: SPRINT-081 T1 (16 ownership headers, shared by E01/E03), `VERIFYCLAUSE` DoD lines (>=4), and **first live runs**
  (SPRINT-055: L-102). G19's catches are all `Layers:` declarations corrected mid-sprint (>=9 sprints), so it measures declaration accuracy.
- 0-catch is common: 15 of 28 legs, 6 of 11 engine families (consumer-only value, L-016), 6 of 13 procedure/test rows (3 more test code), and all 5
  parity harnesses (no record of a port divergence on a real artifact).
- Maintenance leaders: G19 ~20, G22 ~15 (0 catches), E11 >=10, G03 ~10, G23 ~10, S01 ~9, G16 ~9, G05 ~8, G20 ~8, G21 ~8, G25 ~8, S03 ~8.
- **Unknowable, not zero:** G12b (QA.md hygiene), G13 (task schema), S05 (run-mode) have no derivable record either way.
- Catches are lower bounds: engine FAILs reach the gate as informational (leg 2f-ter), so a fix they prompted may leave no ledger trace.

**Runtime** (every one of the 64 harnesses run alone, once; Windows/git-bash, load varied, so seconds are ordinary, not exact; per-harness table in the log).
All 64 = **2,344 s**: always-on 641 · opt-in 1,511 · excluded 192. By disposition: keep 1,759 s · **freeze 393 s · cut 192 s = 585 s (25%)**.
In the default always-on profile the freeze set is 192 s of 641 s (30%). The cut set is all excluded (runs in no gate), so it saves upkeep, not gate time.
`qa-gate-timing` Round 4 found process spawns, not corpus size, the dominant cost, so the larger gate lever stays the engine (ADR-043), not these rows.

## Class rules (applied in order R1 > R2 > R5 > R3 > R4; counts are rows)
- **R1 consumer-facing -> keep (18).** Reached by the adopter-run engine/`conformance.sh` (ADR-043) or a procedure a shipped skill tells an adopter to run.
  Engine families E01-E11, `check-doc-caps`, `check-sprint-by-reference`, 2 contract parity harnesses, dispatch preflight, skill freshness, worktree base.
- **R2 caught >=1 real defect on a shape still produced -> keep (13).** *Changed from "in its life":* a catch on a retired shape (G08's 7 TODO.md
  entries) is not evidence for a guard now reading the store; it falls to R4. Own-bug finds never count.
- **R3 0 catches, not consumer-facing, shape no longer produced -> cut (1).** S10, the v1 park/retry selftests.
- **R4 0 catches or unknowable, not consumer-facing, shape still live -> freeze (21).** Freeze = existing fixtures stay, no new cases, no parity
  port, ADR-029 Tier X bar (a retained fixture, no seeded-mutation proof); a freeze is revisited when a sprint touches it twice.
- **R5 duplicate of a stronger guard on the same population -> cut the weaker (0).** Checked and found none: G10/S4.INDEX overlap, but S4.INDEX is R1.
- **R6 (new, from the evidence) row types.** Tests of non-guard tooling (S07-S09) are Tier X: keep, outside this diet (3). A parity harness is kept iff
  its Shell oracle is a consumer contract (P2, P5), frozen otherwise (P1, P3), cut if no gate runs it (P4, 189 s). Cut total: S10 + P4 = **2**.

## Recommendation
Adopt ADR-050 (proposed) with these rules. Land the 2 cuts in `TASK-398` (S10: 4 selftests + 4 subjects = 1,403 lines; P4: 714 lines). Apply the freezes
by edit-bar, not deletion. Re-run the audit when a sprint adds a guard. The 8 exceptions below are the only rows needing the owner.

## Out of scope / open questions (exception rows; each with a recommended answer)
- **Q1 G08 task-origin.** Literal R2 keeps (7 catches); refined R2 freezes (all on the retired shape). *Rec: freeze.*
- **Q2 G22 sprint-by-reference.** R1 keep, but 0 catches, ~15 upkeep, a 1,575-line opt-in harness. *Rec: keep the code (engine-called); freeze its harness.*
- **Q3 G10 vs engine S4.INDEX.** R5 would cut the weaker but S4.INDEX is R1 (consumer). *Rec: keep both; no action.*
- **Q4 P4 layers-observed-differential.** Owner deferred it at SPRINT-103 (189 s, ungated). R6 cuts. *Rec: cut.*
- **Q5 T01 unwired-exports.** R4 freeze, but the Wiring-check DoD cites it as the mechanical replacement for an author-asked rule (L-172). *Rec: keep.*
- **Q6 G21 gate budget.** 0 strict catches; its one event is a report that raised a default. *Rec: freeze its 3 harnesses, keep the cases.*
- **Q7 G17 authority + P1.** R4 freeze vs ADR-039's mandatory parity at promote/close for ports. *Rec: freeze both; ADR-050 narrows ADR-039 to the contract ports.*
- **Q8 G23 night-run rollup.** R2 keeps on one catch while every sprint is attended; ~10 upkeep. *Rec: keep; re-rule if still one catch at the next audit.*
- Not settled: whether `bun test` joins the gate (TD-212); the freezes' touch-twice trigger is a proposal, not an ADR-050 clause.
