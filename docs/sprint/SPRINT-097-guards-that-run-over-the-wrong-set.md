---
sprint: 097
slug: guards-that-run-over-the-wrong-set
owner: Maintainer
last_updated: 2026-09-10
status: active
plan_commit: 2789dbd
gates_signed: G1,G2 @ d9f6c3c
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-097 — Guards That Run Over the Wrong Set

> **Theme:** Five checkers gate this repository, and each one's *detection logic* is sound while the
> *set it runs over* is not. L-186 named the class at SPRINT-094 and the tree has produced two fresh
> instances since — a `Depends-on:` parser harvesting phantom ids out of its own field's prose, and an
> epic checker resolving another repository's member sprints against this repository's archive. This
> sprint fixes the set, not the logic, and rules the one decomposition question that has been deferred
> three times.

## Scope

**In:**
1. A recorded ruling on whether the five gate-accuracy defects (TD-086 · 087 · 089 · 097 · 105) are one task or five.
2. The dispatch preflight's `Depends-on:` parser anchored to the id list, at **both** call sites (TD-132).
3. One `Layers:` extractor shared by both checkers, under a counted ruling on backticks (TD-142).
4. A verdict-less `qa-check.sh` run reported as a failure rather than as zero failures (TD-143).
5. The epic-state checker's member set scoped to sprints this repository actually owns (TD-144).

**Out (deferred):**
- **Making the gate finish.** TD-090 · TD-117 · TD-143's cost half are untouched; T4 makes
  not-finishing unmistakable, it does not make finishing likely.
- **Fixing the five defects T1 rules on.** T1 produces a decomposition call and files the chosen
  shape. It is not a fix, and the fixes are not in this sprint.
- **Closing the commit-ownership channel.** ADR-040 accepted it symmetrically at SPRINT-096 and
  TD-141 closed on that basis at this promote. The `Sprint: NNN` trailer route stays rejected on size.
- **The `HANDOFF-LEDGER.md` worktree contamination** surfaced by this promote's gate — same family
  (L-170), different checker, not yet filed as debt.

## Plan

### T1 — Rule whether the five gate-accuracy defects are one task or five `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `TECH-DEBT.md` · `TODO.md`
Depends-on: none
Cites: SPRINT-087 close sweep · TD-086 · TD-087 · TD-089 · TD-097 · TD-105
Deferred at three promotes because it is a judgement, not an edit. The pairing is the evidence the
cluster is a cluster: TD-087 (the REACHES half) and TD-097 (the EXISTS half) are the **same script**,
`check-verify-reaches.sh`, filed three sprints apart with neither row aware of the other until
SPRINT-087's close read them together. Ruling it unblocks four rows that have aged every sweep since.

**Acceptance:** A recorded ruling states whether the five are fixed as one "gate accuracy" task or
separately, and the chosen shape is filed as `TASK-NNN` rows in the Backlog.

**DoD:**
- [x] The five rows are re-read against the current tree, not against their Summary lines — TD-036's Summary was false the day it was filed and TD-101's was false for three sprints (L-091). — ✓ each re-derived by running or reading the named artifact: **TD-087** `grep -qF` at `check-verify-reaches.sh:102` plus a second substring test at `:96`, live verbatim · **TD-097** `[ ! -f "$scr" ]` at `:89` and the archive exemption at `:55`, live verbatim · **TD-105** `plan-edited-after-freeze` at `conformance-engine.sh:2078`, no checkbox normalisation anywhere in the file, live verbatim · **TD-089** live and **wider than filed** — the engine now emits 195 `S<N>.<CODE>` occurrences against 38 distinct kebab findings · **TD-086** the masking bug at `evals/lib/check-system-verify-block.sh:75-76` is live and every harness invocation still points at `$fx/…` never `docs/sprint/logs/`, but **two clauses of its Evidence are stale** — its harness was registered in `eval_harnesses_always` at SPRINT-068 T2, and the checker lives at `evals/lib/`, not the `scripts/lib/` its Summary names. Corrections recorded on the rows themselves.
- [x] A ruling is recorded with its reasoning, naming a loser on the side taken. — ✓ **four tasks, grouped by artifact.** The full ruling with both losers named is the P1 block header in `TODO.md`: the **one-task side loses** because bundling gives a single L task across three subsystems plus a research round (CLAUDE.md splits an L before proceeding) and because TD-089's subject is not a guard, so a Tier G task containing it mis-tiers under ADR-029; the **five-task side loses** on the cluster's own founding evidence, TD-087 and TD-097 being the same script filed three sprints apart with each row's `Re-file fresh if` clause forbidding a solo fix. One merge, because exactly one is forced.
- [x] The chosen shape is filed in `TODO.md`, ids derived from the maximum in use with worktrees excluded (L-143 · L-170). — ✓ `TASK-338` (TD-087 + TD-097, Tier G, P1) · `TASK-339` (TD-105, Tier G, P1) · `TASK-340` (TD-086, Tier G, P1) · `TASK-341` (TD-089, **Tier P**, P2). Ids derived, not remembered: max in use is `TASK-337`, agreed by two differently-shaped queries (the `docs/` + ledger sweep and `TODO.md` alone). **L-170 fired as predicted** — the raw sweep surfaced `TASK-905`–`908`, which are `evals/fixtures/boundary-rows/` tokens; SPRINT-094's own log records the same contamination catching a previous sweep. All five TD rows carry a back-pointing `Tracker:` line, and `TD-132` closes as `resolved → TASK-328`.

### T2 — Anchor the dispatch preflight's `Depends-on:` parser to the id list `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/dispatch.md` (the `<!-- dispatch-preflight:start/end -->` snippet — the `"Depends-on:"*)` arm AND the indented `D)` continuation arm) · `evals/run-dispatch-preflight-fixtures.sh` · `evals/fixtures/dispatch-preflight/`
Depends-on: none
Cites: TD-132 · TD-043 · L-058 · L-165 · L-168
**Tier G** (ADR-029) — the false HALT is the loud half; the false `PASS shared-file-owned` issued off
a phantom edge is the silent one, and it green-lights a wave with no ownership order at all. The
`Layers:` side of this same snippet was already hardened via `TOK`; `Depends-on:` was left unanchored.

**Acceptance:** The snippet extracted from `dispatch.md` by its own anchors, run against SPRINT-094's
sprint file, yields `PASS wave-computation: T1=0 T2=0 T3=0 T4=0` and no `FAIL cycle-detected`.

**DoD:**
> **CLOSED at the batch gate as already-satisfied — no code change.** TD-132 was fixed in code at
> SPRINT-095 T2 (`4cd494d` → `843ccdb` → `60fdf1b` → `82eb0cd`, third design, two review rounds
> rejected the first two). Every line below was re-derived against `HEAD` at the G1+G2 pass rather
> than inherited; the ruling and the full reproduction are in the `scope-change` entry of
> 2026-09-10. `TD-132` closes as resolved-by-`82eb0cd`.

- [x] Run against **SPRINT-094's sprint file** — the motivating artifact, not a fixture (L-166) — yields the clean wave computation. — ✓ re-derived at `d06edf8`: the anchor-extracted snippet returns `PASS wave-computation: T1=0 T2=0 T3=0 T4=0` and **no** `FAIL cycle-detected`. The three residual `FAIL shared-file-unowned` rows are genuine unowned overlaps in SPRINT-094's own Plan, not the phantom `PASS shared-file-owned … order=T1->T2` this line predicted. **The present-tense claim in the promoted line was false the day it was written** (L-091).
- [x] A literal `none` short-circuits the field: no id harvested from it or from any line continuing it. — ✓ SPRINT-094 declares `none` on every task with prose running onto continuation lines, and the wave computation is all-zero. Fixtures `deps-prose-field` · `deps-prose-continuation`.
- [x] **Both call sites fixed, each proved by its own fixture.** — ✓ `evals/fixtures/dispatch-preflight/` carries six `deps-cont-*` cases (`deps-cont-bracket` · `-markup` · `-unbalanced` · `-close-without-open` · `-markup-welds-id` · `deps-prose-continuation`) against the indented `D)` arm, alongside the field-arm cases. The L-058 shape this line names is the one SPRINT-095's fixtures were built for.
- [x] Declared ids still parse: `Depends-on: T1 · T2 — but see **D1** (…)` yields exactly `[T1,T2]`, neither more nor fewer. — ✓ exercised live at the gate on a purpose-built two-dependency Plan: `Depends-on: T1 · T3 — but see **D1** (…)` returns `PASS wave-computation: T1=0 T2=1 T3=0` — T2 ranked behind **both** declared ids, and nothing harvested from the annotation.
- [x] Retained must-FAIL **plus a sibling control that stays green in the same run**, added to the existing harness. — ✓ `sh evals/run-dispatch-preflight-fixtures.sh` → **all green**, 25 fixtures, exit-0 and exit-1 expectations in the same run.
- [x] **Seeded-break discrimination proof** under ONE stated hash convention. — ✓ done at SPRINT-095 T2, not re-run here: convention stated once (`git hash-object` on the working file), every seed guarded for landing (`cmp`), parsing (`sh -n`) and being targeted; `dispatch.md` restored to a pristine hash after each. **One negative result was recorded rather than smoothed** — a seed removing the `none` short-circuit reddened nothing and was reported as untested (L-187's own shape).
- [x] **Outside reviewer, dispatched worktree-isolated** (L-165 · L-168). — ✓ done at SPRINT-095 T2: five rounds, four rejections, **6 CRITICALs, every one found by review and none by the seeded proofs**. Re-reviewing an unchanged artifact would add nothing; this sprint makes no edit to it.

### T3 — Rule which `Layers:` parser is correct, then make both checkers read one extractor `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `scripts/lib/check-layers-observed.sh` · `scripts/lib/check-layers-completeness.sh` · `evals/run-layers-observed-fixtures.sh` · `evals/run-layers-completeness-fixtures.sh` · `docs/sprint/SPRINT-*.md` (only if the ruling requires backticking existing Plans)
Depends-on: none
Cites: TD-142 · L-108 · L-189 · L-058
**Tier G** (ADR-029) — both subjects are gate checkers, and the ruling changes what "declared" means
for every sprint file in the tree: silent in one direction, noisy in the other. Both files carry the
line *"kept deliberately identical … a parsing rule that differs between them would make one of the
two lie."* One of them is lying.

**Acceptance:** One recorded ruling on backtick-quoting, and both checkers derive their tokens from a
single extractor rather than two that disagree while both claim parity in comments.

**DoD:**
- [x] The count is derived **before** the ruling: how many live and archived Plans carry unbackticked `Layers:`. Requiring backticks makes every one of them undeclared, so the ruling is taken on a counted basis, not a stylistic one. — *Verify: a second query that agrees (L-108 · L-130)* — ✓ **51 unbackticked `Layers:` lines across 15 files, every one archived; no live Plan carries one.** The premise in this line is **false against the set that matters**: requiring backticks makes none of them undeclared *to a checker that reads them*, because both checkers are excluded from the archive **twice over** — `qa-check.sh:1092` passes a **non-recursive** `ls docs/sprint/SPRINT-*.md`, and each script additionally guards `*/archive/*` (`check-layers-observed.sh:344` · `check-layers-completeness.sh:183`). Cost against the examined set: **0**. Cross-check (L-108): 5 live + 370 archived = 375 lines, while a recursive `grep -r` returns 380 — the 5-line gap is `Layers:` quoted inside sprint **log** files, which the non-recursive caller never reaches either. **A2 re-derived and confirmed**: SPRINT-096 = **0** declared tokens, SPRINT-095 = **14** (13 unique — `scripts/qa-check.sh` is declared by two of its tasks and the observed checker emits per-task lines; the first query deduped and disagreed at 13, and that disagreement is what surfaced the reason).
- [x] Both directions closed. The observed checker over-reports on a bare path (loud); the completeness checker's `grep -qF` is a **substring** test accepting a token anywhere in the line — inside a longer path or a trailing comment — which fails *green* (L-108). — ✓ **the silent direction is the one that changed**: every live membership test now runs `grep -qxF` (exact) against the shared extractor's output. Confirmed independently by the outside reviewer with fresh probes it built itself — a token appearing only as a substring of a longer declared path, and one appearing only inside a trailing remark, are both now correctly reported undeclared, while an exact backticked declaration stays a clean PASS. The loud direction was already correct under the ruling and is now **pinned** by a must-FAIL + sibling control so the refactor cannot quietly loosen it.
- [x] Both checkers read one extractor; the parity comments are true afterwards or removed. — ✓ `layers_tokens()` is defined **once**, in `check-layers-observed.sh`; `check-layers-completeness.sh` **sources** that file under a `LAYERS_OBSERVED_SOURCED` guard (which suppresses the sourced file's bare-invocation check and its `for sp in "$@"` main loop) rather than carrying a second copy that can drift again. The comment both files carried — *"a parsing rule that differs between them would make one of the two lie"* — is now true **by construction**, not by discipline. Verified at merge: the function has exactly one definition across both files, and the only surviving `grep -qF` is inside a comment describing the old behaviour.
- [x] Retained must-FAIL per direction **plus a sibling control** staying green in the same run. — ✓ `LAYERS-COMPLETENESS FIXTURES: all green` (14 cases) and `LAYERS-OBSERVED FIXTURES: all green` (62 PASS, 0 FAIL), each verdict read from the harness's own printed line. The observed count is **+2 against a main baseline of 60**, and the two added are exactly the must-FAIL and its sibling control — so the delta is accounted for rather than assumed.
- [x] **Seeded-break discrimination proof** under ONE stated hash convention (L-169). — ✓ **six seeds total, three by the author and three independent.** The reviewer's, which are the load-bearing ones: breaking the extractor's backtick anchor reddened the trailing-comment case; reverting `grep -qxF` → `grep -qF` reddened the longer-path case; neutralising the unbackticked-token guard reddened only its own case — each with four named siblings staying green in the same run. Convention stated once and used throughout: `git hash-object <path>` against `git rev-parse HEAD:<path>`, both git blob ids, so the LF/CRLF split cannot enter the trail. Every seed landed (`cmp`), parsed (`sh -n`), was targeted (637→637 and 255→255 lines), and was restored to the pristine blob with the hash re-checked after. **One seed was thrown away for being a demolition rather than a discrimination** — a first attempt over-fired and reddened unrelated cases, was recognised as such, and was redone as a proper guard-clause removal.
- [x] **A fixture that varies the SELECTION, not the verdict** (L-186) — a Plan reached by the other glob arm, a token declared in the other syntax. — ✓ `archive-path-excluded`, chosen after enumerating the population: `check-layers-observed.sh` already carried **four** archive-selection fixtures from SPRINT-096 T3, while `check-layers-completeness.sh` had **zero** — its own `*/archive/*` guard had never been reached by any fixture, only assumed safe because the caller's glob never reaches `archive/` either. The new case hands an archived Plan to the checker as a **direct path argument**, bypassing the glob a real caller uses, so the checker's own guard is what must exclude it; a live sibling with the identical undeclared-file shape must still FAIL in the same run. Both hold.
- [x] **Outside reviewer, dispatched worktree-isolated** (L-165 · L-168). — ✓ **two independent reviewers.** The author dispatched one against `d6a4cdc` (no CRITICAL; two precision notes on the file-shaped regex, addressed in `7370b7b`). I dispatched a second against both commits: **CLEAR on the core claim**, with three findings — one **pre-existing** archive-case selection defect now filed as **`TD-145`** (loud, out of T3's scope, three sites), and two Low: the disclosed bare-directory-token residual, and a narrow env-boundary footgun where a pre-set `LAYERS_OBSERVED_SOURCED` silently no-ops a *direct* invocation of the observed checker (unreachable via `qa-check.sh`, which never exports it).

### T4 — Make a verdict-less `qa-check.sh` run FAIL loudly instead of reading as 0 failures `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `scripts/qa-check.sh` · `package.json` (the `gate` / `test` script chain — its real callers) · `scripts/qa-verdict.ts` (new · TS/Bun per the 2026-09-10 ruling) · `evals/qa-verdict.test.ts`
Depends-on: none — independent of the memory cost itself
Cites: TD-143 · TD-090 · TD-117 · TD-084 · L-120
**Tier G** (ADR-029) — this is the gate's own report, and a run that cannot speak currently presents
as a clean partial, which is the silent-false-negative shape. Scoped to the *reporting*, never the
*cost*: it does not attempt to make the gate finish, it makes not-finishing unmistakable.

**Acceptance:** A `qa-check.sh` run terminating without its `QA-CHECK: N pass, M fail` line is
reported as a failure by whatever invokes it, rather than leaving the caller to infer from "0 FAILs so far".

**DoD:**
- [x] The wall-clock guard is confirmed **not** to cover this before anything is built on it. — ✓ reproduced live: `timeout 15s sh scripts/qa-check.sh` printed `PASS qa-budget-default: 520s < 600s` and was then killed with **no** `QA-CHECK:` line. The budget guard passes and the run still ends verdict-less, so nothing was built on a guard that already covered it.
- [x] A verdict-less run is reported as a failure by its caller. — ✓ `scripts/qa-verdict.ts` (TS/Bun) wraps the gate and judges from the **printed** `QA-CHECK: N pass, M fail` line, never the child's exit code. `package.json`'s `gate` and `test` — the only two real callers in the repo — now run `bun scripts/qa-verdict.ts sh scripts/qa-check.sh`.
- [x] **Exercised on a real verdict-less run**, not only a fixture — kill a run mid-flight and confirm the wrapper reports failure (L-007 · L-166). — ✓ `bun scripts/qa-verdict.ts timeout 15 sh scripts/qa-check.sh` against the **real** gate, killed mid-flight: wrapper exits 1 with `qa-verdict: no QA-CHECK line found…(TD-143)`. A full-length `bun run gate` run to completion reported `QA-CHECK: 200 pass, 5 fail` and was read as an ordinary red gate, so the normal path does not regress.
- [x] Retained must-FAIL fixture **plus a sibling control** — a run that *does* print its verdict stays green in the same run. — ✓ 12 tests in `evals/qa-verdict.test.ts`, one `bun test` invocation, 12 pass / 0 fail. Re-verified at merge with four live probes that discriminate in both directions: no verdict + **exit 0** → FAIL · clean verdict → green · red verdict → red *for the stated reason* · clean verdict + **exit 3** → **green**. The last is the load-bearing one — it proves the wrapper reads the number the gate prints rather than the status handed back, which is what L-120 actually instructs.
- [x] **Seeded-break discrimination proof** under ONE stated hash convention (L-169). — ✓ convention stated once and used throughout: `git hash-object <path>` against `git rev-parse HEAD:<path>`, both git blob ids, so the LF/CRLF split cannot enter the evidence. Seed `fail > 0` → `fail > 1` in `judgeOutput`: landed (`a4ccfb6a…` → `b0ed72a4…`), targeted (117 lines before and after, single-line diff), still parses; exactly **1 of 12** tests reddened with its own named finding while 11 stayed green, including both review-driven regression fixtures. Restored to `a4ccfb6a…`, matching `HEAD:scripts/qa-verdict.ts`.
- [x] **Outside reviewer, dispatched worktree-isolated** (L-165 · L-168). — ✓ **two rounds.** Round 1 found a **CRITICAL** — a spawn failure left the wrapper hanging forever, the ENOENT-never-resolves shape, which is *worse than the defect being fixed* — and a **MAJOR**: stdout and stderr merged into one judged buffer, so pipe interleaving could desync the verdict regex and misreport a real pass as verdict-less. Both reproduced RED, fixed, committed separately (`da7d139`). Round 2, an independent reviewer with its own seed, returned **CLEAR**. L-165 again: neither defect was reachable by the author, and both were found by an outside pass.

### T5 — Scope the epic-state checker's member set to sprints this repository owns `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-epic-archive.sh` (the two inline member-number globs at :79 and :210, and the `epic-state:` leg — there is no `member_plan()` helper; A3 corrected 2026-09-10) · `evals/run-epic-archive-fixtures.sh` · `evals/fixtures/epic-state/`
Depends-on: none
Cites: TD-144 · ADR-041 · L-186 · L-166
**Tier G** (ADR-029) — a checker reporting a false `close_commit` mismatch on a correct artifact
teaches its reader to disregard the leg, which is how a true finding gets skipped later.
`member_plan()` resolves a member sprint number by globbing `docs/sprint/archive/SPRINT-<num>-*.md`
against **this** repo. EPIC-016's members live in `workdoo` (ADR-041), so `SPRINT-001` resolves to
lean-flow's own `SPRINT-001-ship-and-validate`. The epic file's own comment anticipated the checker
being *blind* to workdoo; nobody anticipated it would *collide* with same-numbered local sprints.

**Acceptance:** `EPIC-016` produces no `epic-state:` findings, and an epic whose members genuinely
live in this repository still produces them.

**DoD:**
- [x] The false positive is reproduced first, against the real artifact: `EPIC-016` SPRINT-001's cell cites `eb3d9e7` while lean-flow's own `SPRINT-001-ship-and-validate.md` carries `close_commit: b0f2695`; SPRINT-002's cell cites `28c5203` against local `007869e`. — *Verify: `QA_FULL=1 sh scripts/qa-check.sh` names both today* — ✓ reproduced against the real artifact with **both figures matching this line exactly**. The `Verify:` method was **not reachable as written** and this is recorded rather than worked around: the fix was already committed when the gate was first run to completion, so the gate cannot name a defect that is gone. Reproduced instead by running the checker leg at `b255f87^` — `exit 1`, both FAIL lines, both sha pairs verbatim — which examines the same artifact through the same code, and is the half a whole-gate run would have contributed anyway (L-136: a method that cannot reach its target is recorded as not-valid-proof, not accepted).
- [x] A member row that links **out of this repository** is not resolved against a local sprint of the same number. Whether that means skipping it, or reporting it as unverifiable, is a **ruling** — an out-of-repo member the checker silently ignores is an unchecked row, which is the failure one level down. — ✓ **owner ruled: named by a non-gating `NOTE`**, never silently skipped. A second ruling followed from a finding outside the Plan — `unknown_members()` had **zero callers repo-wide** while its own header declared unknown members *"NAMED on the report … never silently skipped (L-058)"*; wired to the same emitter, and it fires on five retained fixtures. The ruling also **deviates from the 2026-09-10 owner ruling's prescribed mechanism** (resolve the href relative to the epic's directory): locality is read from the frontmatter qualifier instead, surfaced before merge and approved on evidence that C1 is unreachable by construction.
- [x] An epic with genuinely local members still produces `epic-state:` findings — proven by the existing fixtures staying green. — ✓ all 17 original cases green throughout, and the stronger form verified independently: the full old-vs-new report diff over the live tree shows **EPIC-016 as the only change**, every other epic's lines byte-identical, **no epic lost a check**. EPIC-001 · 002 · 003 · 004 keep their full local member sets — C1's exact subject.
- [x] **A fixture that varies the SELECTION, not the verdict** (L-186): an out-of-repo member row whose number collides with a local sprint. This is the case with no reader today. — ✓ `s-foreign-collision`, plus a sibling differing by **exactly one token** (`workdoo `) on the identical colliding number. Four further selection axes were found by review, each invisible to the round before it, and each now has a fixture: **id shape** (`s-bare-number-member`) · **epic file depth** (`s-archived-depth-open/closed`) · **all-local-or-all-foreign** (`s-mixed-local-foreign`) · **member order** (`s-local-first-mixed`) · **the `END{}` flush arm** (`s-tick-at-eof`, the arm all 16 real epics actually use).
- [x] Retained must-FAIL **plus a sibling control** staying green in the same run. — ✓ suite **17 → 38 cases**, one run, all green. Retained per TD-012.
- [x] **Seeded-break discrimination proof** under ONE stated hash convention (L-169). — ✓ convention stated once and used throughout: `git hash-object <path>` against `git rev-parse HEAD:<path>`, both git blob ids, so the working tree's CRLF cannot enter the evidence. Every seed verified **landed** (blob differs), **parsing** (`sh -n`), **targeted** (line delta ≤ 1), and restored to its HEAD blob. **Four of my own seeds were invalid and scored as results until checked** — one `sed 's///2'` never applied at all, and three broke syntax rather than logic, reddening every case for the wrong reason (L-137 · L-142, both firing for real).
- [x] **Outside reviewer, dispatched worktree-isolated** (L-165 · L-168). — ✓ **five passes, all worktree-isolated, each with its own seeds.** Four unrestricted rounds returned NOT CLEAR; the fifth, scoped to the repair delta with an explicit acceptance boundary, returned **CLEAR**. L-165 held five times out of five: not one finding was reachable from inside the work, and two were regressions the author had introduced and could not see — round 2 reintroduced a bug round 1 had incidentally fixed, and round 3 turned the gate red on EPIC-016 itself. **Half the findings, though, were author-side slips a call-site enumeration would have caught** (fix-without-a-test ×3, 2-of-3-call-sites ×2) — reviewer attention spent on what the author should check first. Recorded for the Retro.

## Owner-action checklist
- [x] Sign the batch **G1 + G2** pass over all five tasks, then record `gates_signed: G1,G2 @ <sha>` in this file's frontmatter. Absence of the field means NOT signed (L-099). — ✓ signed at `d9f6c3c` over the **amended four-task** Plan (T2 closed as already-satisfied, T4's `Layers:` narrowed, both logged as `scope-change`). The signature covers the Plan **as it will be executed**, not as promoted — SPRINT-091's re-signature precedent.
- [x] Reinstall the plugin before trusting any skill procedure this sprint — the promote session ran skills at base-dir **1.62.0** against a repo manifest at **1.63.0** (L-021). — ✓ this session primed at `1.63.0 base-dir == 1.63.0 repo → fresh`; the staleness is gone and no procedure here was read from a 1.62.0 copy.

## Decisions (pre-locked)

- **D1 — `scripts/qa-check.sh` is owned by T4; T5 commits after it.** T5 may need to register a new
  fixture harness in the gate's always-on list. One owner, one commit order — never a plain
  `git add` over the other's WIP (L-042 · L-037).
- **D2 — T1 and T3 are `J2`, T2/T4/T5 are `J1`.** T1 and T3 each *produce a ruling*, which is
  human-reserved by definition; the other three execute inside the frozen Plan. Declared here, never
  inferred (an absent class would read J2 and park).
- **D3 — this sprint carries no `epic:` stamp.** Gate accuracy advances neither EPIC-014 nor
  EPIC-015; guessing one to get a rollup row is worse than standing alone (SPRINT-096's precedent).

## Assumptions

- **A1** — The five gate-accuracy rows T1 rules on are still open and still describe live defects.
  *Confirm: re-read each row against the tree at T1, not against its Summary (L-091).*
- **A2** — TD-142's divergence figures (SPRINT-096's Plan yields 0 declared tokens, SPRINT-095's 14)
  still hold. *Confirm: re-derive both at T3 — SPRINT-094 and 095 were archived at this promote, so
  any path-sensitive figure has moved.*
- **A3** — `member_plan()` is the only place the epic-state leg resolves a member number.
  *Confirm: read the whole leg at T5 before editing; TD-132's Location line named one arm of two.*
- **A4** — The gate's pre-existing red is fully accounted for by this promote's retention pass plus
  the five rows above. *Confirm: re-run `QA_FULL=1 sh scripts/qa-check.sh` after the promote commit
  and reconcile the FAIL count against 33 — a residue nobody predicted is a finding, not noise.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-097-guards-that-run-over-the-wrong-set.md`,
> rendered from `templates/sprint-log.md.template` and created lazily at the first entry. Append
> there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro

<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, this file moves → docs/sprint/archive/ and its log → docs/sprint/archive/logs/ in the
     same commit, plus a one-line entry in docs/sprint/INDEX.md (§11). -->
