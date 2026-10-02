---
owner: Maintainer
last_updated: 2026-10-02
update_trigger: A guard is added, frozen or cut, or the class rules change
status: current
id: guard-audit
tags: [tooling, process]
domain: governance
related: [ADR-050, ADR-029, ADR-043, qa-gate-timing, guard-audit-legs, guard-audit-rest, guard-audit-runtime]
---

# Research — Which guards earn their upkeep, judged by the defects they actually caught?

> **Question.** Of every guard in this repo, which caught a real defect, which are consumer-facing, and which should be kept, frozen or cut?
> **Verdict.** 60 guards: **39 keep · 19 freeze · 2 cut**, by six class rules. 23 ever caught a real defect (>=63 recorded catches; E03 only via a catch
> shared with E01); 37 caught none or have no record. Upkeep is ~235 events against those catches. The two cuts are small, so the saving is the proof bar (ADR-050).

## Why this matters
SPRINT-111 grew from "delete one file" to five tasks and ~22 agent dispatches because its guards read the retired shape (Retro · Cost). ADR-050
needs the guards' own record to say where the proof bar is worth paying, and `TASK-398` lands the cuts this audit rules.

## Options considered
- **A — Uniform bar, no audit.** *Trade-off:* simple; it is the status quo whose cost the owner measured.
- **B — Class rules over the evidence, exceptions to the owner.** *Trade-off:* one decision per class; a rule can misfire on an edge row (§ Open).
- **C — Rule on each guard.** *Trade-off:* exact; one owner decision per guard, and most are obvious from the class.

## Findings
**Unit.** A *guard* is one verdict-producing check: a `qa-check.sh` leg or its `check-*` file, an engine rule family, a skill-procedure check, a
`test/` guard, the TS port, or a parity harness. A *harness* is its fixture, attached to exactly one row and never counted twice. Engine rules
(45 `assert_*`) are grouped by § into 11 families, because ADR-043 makes every one R1. Legs 5, 7, 8 are retired tombstones, not rows.
Per-guard records: [`guard-audit-legs`](guard-audit-legs.md) (28) · [`guard-audit-rest`](guard-audit-rest.md) (32) · [`guard-audit-runtime`](guard-audit-runtime.md) (64 harnesses).

**Population, three selectors (L-186, L-198).** A = what the gate names: `eval_harnesses_always` 46 + `_optin` 13 + `_excluded` 5 = **64**. B = prefix on disk:
`git ls-files evals/ | grep -E '^evals/(run-|assert-|selftest-).*\.(sh|ts)$'` = **68**; A∩B = 64, A∖B = 0, B∖A = 4 (the `assert-*.sh` subjects the four excluded
selftests run). **C = every non-fixture `.sh`/`.ts` under `evals/ test/ scripts/ apps/ packages/` regardless of name = 197**, which B cannot see: 68 + 47 `.test.ts` (evals 10 ·
test 5 · packages 30 · apps 2) + 32 `scripts/lib` + 4 `scripts/` + 40 `packages/`+`apps/` sources + 3 `evals/` other + 3 `test/` helpers (sum 197).
**C∖B = 129; C found what A and B missed:** `epic-archive-differential.test.ts` (P6), `layers-completeness-differential.ts` (P7), and the whole TS port in
`packages/standard` + `apps/cli` (K01: 72 files, 10,802 lines, 32 tests, run only by `bun test`). Every one of the 197 maps to a row or is *not a guard*:
the 64 harnesses and 4 subjects by name (S10); `.test.ts` to their row (evals: G17 G01 G20 P6 G03 G16 G19 G23 T03 G14; test: E04 x2, T01 x2, T02; packages/apps: K01);
`scripts/lib` 25 `check-*` to G/P rows, `conformance-engine` to E01-E11, `read-spec-rules` to E11, `qa-budget-check` to G21, `resolve-run-mode` to S05,
`sprint-members(-cli)` to G22; `scripts/`: `gen-index` G10, `night-run` S03, `qa-verdict` T03. **Not guards (named):** `qa-check.sh` (the driver; its legs are the rows),
`archive-path.sh` and `evals/lib/harness-common.sh` (shared libs), `evals/lib/check-system-verify-block.sh` (G25 helper), `test/architecture/layers.ts` ·
`unwired-exports.ts` · `test/gate-discovery/discover.ts` (subjects of T01/T02).

**Catches, two routes, never recall.** Route 1: `git log --name-only` over 1,591 commits. Route 2: LEARNINGS, TECH-DEBT and the sprint archive. A catch is a guard
FAIL on a real artifact that preceded a fix; a guard's own bug is a *maintenance event*, counted apart. Four evidence agents split the rows; I re-checked
7 shas and 5 ledger ids (all held). Codex round 1 then found one miss (G17, confirmed: L-176 / 0e2ae9d) and one false premise (below); the rows added by
selector C (K01, P1-P7) were not ledger-mined. Routes disagreed on E07 and E08 (flagged). Catches are lower bounds: engine FAILs reach the gate as informational.

**The consumer contract, traced (Codex finding 3, confirmed).** `conformance.sh` `exec`s `conformance-engine.sh`, which executes `read-spec-rules.sh`, sources
`archive-path.sh`, and spawns `sprint-members-cli.ts` and `check-sprint-by-reference.ts` under `bun`. The `check-doc-caps` mentions (`:1766-1774`) are
comments; its only executable call is `qa-check.sh:166`. So **G01 is not R1** (it keeps through R2) and **P2 is not a contract parity port**. The one parity pair
whose Shell side an adopter runs is the engine's §4 against the TS port (P5).

**What the record says.** Catches cluster in few events: SPRINT-081 T1 (16 headers), `VERIFYCLAUSE` lines (>=4), and **first live runs** (SPRINT-055, L-102).
Maintenance leaders: G19 ~20, G22 ~15 (0 catches), E11 >=10, G03 ~10, G23 ~10, S01 ~9. **Unknowable, not zero:** G12b, G13. 0-catch is common: 14 of 28 legs, 6 of 11
engine families, 6 of 13 procedure/test rows, and every parity harness and K01 (no record).

**Runtime** (every harness alone, once; ordinary not exact; table in `guard-audit-runtime`). All 64 = **2,351 s**: keep 1,480 · **freeze 679 · cut 192 = 871 s (37%)**.
Default always-on profile: freeze 70 s of 645 (11%). Opt-in: freeze 609 of 1,514. The cut set is all excluded (runs in no gate), so it saves upkeep, not gate time.

## Class rules (order R1 > R2 > R5 > R3 > R4; counts are rows)
- **R1 consumer-facing -> keep (20).** (a) executed by `conformance.sh` per the trace (engine E01-E11, G22's checker, P5), or (b) a script a shipped skill names as the
  mechanism of an adopter-run step (S01-S05, G18, G25; Codex finding 2, confirmed: `orchestrator/SKILL.md:50`, `review-scoping.md:218`). (b) is broad; see Q10.
- **R2 caught >=1 real defect on a shape still produced -> keep (15).** *Changed from "in its life":* a catch on a retired shape (G08) does not count.
  G01 G02 G03 G04 G10 G11 G12a G14 G15a G16 G17 G19 G23 G24 T03.
- **R3 0 catches, not consumer, shape retired -> cut (1).** S10, the v1 park/retry selftests (+ their 4 subjects, 1,403 lines).
- **R4 0 or unknowable, not consumer, shape live -> freeze (14).** Freeze = existing fixtures stay, no new cases, no parity port, ADR-029 Tier X bar.
- **R5 duplicate -> cut the weaker (0).** None: G10/S4.INDEX overlap but S4.INDEX is R1; legs 2b-2d are the only implementers of their spec rows. K01 duplicates the Shell engine (Q9).
- **R6 row types.** Tests of non-guard tooling S07-S09 are Tier X keep (3). A parity harness is kept iff its Shell oracle is a consumer contract (P5), frozen
  otherwise (P1 P2 P3 P6 P7), cut if no gate runs it (P4).
- **Owner rulings:** T01 keep (exception, +1 keep). Totals: keep 20 + 15 + 3 + 1 = **39** · freeze 14 + 5 = **19** · cut 1 + 1 = **2**. Second query: legs 17/11/0, rest 22/8/2.

## Recommendation
Adopt ADR-050 (proposed). `TASK-398` cuts: **S10** (4 selftests + 4 subjects, 1,403 lines) and **P4** (`run-layers-observed-differential.ts`, 714 lines, 154 s). Apply the freezes by edit-bar,
not deletion. Re-run the audit when a sprint adds a guard.

## Out of scope / open questions
- **Ruled (owner, 2026-10-02):** Q1 G08 freeze · Q2 G22 keep checker, freeze harness · Q3 keep G10 and S4.INDEX · Q4 P4 cut · Q5 T01 keep · Q6 G21 freeze ·
  Q8 G23 keep, re-rule at the next audit.
- **Q7 G17 authority + P1.** G17 is now R2 keep (a real catch, L-176). P1 (its parity harness) is R6 freeze: the oracle `check-authority.sh` is not an adopter contract.
  *Rec: freeze P1; ADR-039 covers §4 only, so nothing needs amending.*
- **Q9 K01 TS port.** R4 freeze, but R5 (it duplicates the Shell engine, which keeps authority, and no adopter runs it) would cut 72 files and 10,802 lines. Not touched since 2026-08-29.
  *Rec: freeze now; the cut-or-finish call belongs to EPIC-014's owner, not this diet.*
- **Q10 R1(b) breadth.** Applying "a skill names it" to G25 also moved G18, S03 and S05 from freeze to keep. *Rec: keep (b) but treat a skill naming a repo-only `scripts/` path as its own consumer-leak finding (L-015).*
- Not settled: whether `bun test` joins the gate (TD-212); the freezes' touch-twice review is a proposal, not an ADR-050 clause.
