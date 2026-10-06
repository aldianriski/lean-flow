---
sprint: 116
slug: decision-and-ledger-diet
owner: Maintainer
last_updated: 2026-10-06
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-116 — Execution Log

> Append-only companion to [`../SPRINT-116-decision-and-ledger-diet.md`](../SPRINT-116-decision-and-ledger-diet.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-06 | promote | plan locked, governance signed, four members: the TS port ruled first, then three small repairs
The owner picked the track "Decision + ledger diet" over three alternatives (user-facing quality · autonomy proof · workdoo only).
The size check at pull found no L (four S). T1 is S on a *finish* ruling and M on a *cut*; G1 re-sizes it. The members moved
backlog → todo in their own commit (`b06a482`) and were stamped `sprint: SPRINT-116` in `d6bc35c`. The owner signed the
governance checklist:
- **L-promotion:** none. No `promoted: no` row has count ≥ 2. Census of `- count:` lines: 56 at 1, one at 3, one at 5; the 3 and the 5
  are both `promoted: yes`. Second route: 56 `promoted: no` + 2 `promoted: yes` = 58 rows carrying a count.
- **TD aging:** 130 of 138 open rows have aged against sprint 116 (created ≤ 113). Second route: 138 − 8 filed at 114/115 = 130. The 42
  oldest (created ≤ Sprint-090) were re-checked against the current repo by a read-only agent; I spot-checked the evidence for the
  12 that change the ledger (TD-063 · 106 · 082 · 051 · 107 · 069). The owner approved all 12 (`00c9a3c`): 3 fixed, 4 no longer occur,
  5 merged (050 · 066 · 071 → TD-090; 053 · 095 → TD-100). 30 stay open; 14 turn on T1. One `high` row is open, TD-168 (selector
  matched bold `**high**` too). Its owner TASK-357 is done, so the owner routed it through T1's ruling.
- **doc-aging:** §11: TD-209, resolved at SPRINT-113, has passed its 3-sprint clock and its row is deleted (`00c9a3c`). The ledger now holds
  143 rows (126 open + 17 resolved). A CHANGELOG rotation of v1.66.x was proposed and approved, then **withdrawn before applying**:
  §11 keeps the current and previous minor inline (2.0.x + 1.66.x), as the v2.0.0 rotation file records. It fires at 2.1.0. §2:
  0 OVER-CAP; 3 soft breaches, all with recorded `retain` dispositions (`check-doc-caps.ts`).
- **epic rollup currency:** EPIC-014, EPIC-015 and EPIC-016 are current. EPIC-016's rows cover workdoo SPRINT-001…009.
- **handoff ledger:** no `HANDOFF-LEDGER.md`; no active sprint carried a handoff.

promote-check: first run FAIL (5 findings: a Cites/Layers contradiction, two basename-vs-path Layers misses, a cited fixture missing
from Cites, two lines over 400 chars). Fixed before the lock; final run `PASS -- 13 pass, 0 fail`.

### 2026-10-06 | progress | batch G1 + G2 signed (owner) @ 8e14bb4, with three design rulings
- **T1 ruling (owner, J2): CUT the TypeScript port.** An ADR retires it; `packages/standard` · `apps/cli` · the port's tests go, P5's
  parity goes with them, and EPIC-014 closes as retired. TD-168 gets a new P1 task for the Shell engine's per-file spawn cost. Per
  the Plan, T1 is now **size M**. The deletion's full reach is re-derived by recon before any file moves; any file outside the
  declared `Layers:` gets a `scope-change` entry here and a Plan `Layers:` edit (L-229).
- **T3 design: convert.** `check-handoff-state.sh:145` calls `lf_is_archived_path` and leg 10b's exemption pattern is deleted. Other G
  (no shipped skill names the script): must-FAIL fixture + one real run.
- **T4 design: an external reviewer (Codex) records as `scoped-reviewer`.** The four-word depth vocabulary stays. `check-review-depth.sh`
  accepts any depth except `self-review`, so no regex change. Shipped-skill change → Codex review loop.
- **A1 confirmed:** the 10 basenames re-derived from `9a0bfaad` (`--diff-filter=D`) match TASK-400's census.
- **Sequence:** T2 ∥ T4 (disjoint, worktree-isolated, `worktree.baseRef: head`); T1 inline; T3 after T1 (D1).

### 2026-10-06 | scope-change | T3 Layers narrowed: drop `evals/fixtures/` (the declaration route was not taken)
**What broke:** the pre-dispatch preflight HALTed: T3's directory token `evals/fixtures/` prefixes T2's three fixture paths and T4's
`evals/fixtures/review-depth/`, with no Depends-on edge (4 × `shared-file-unowned`). The token was declared for the *declaration*
route's must-FAIL case; G2 ruled *convert*. **Impact:** T3 touches `scripts/lib/check-handoff-state.sh` · `scripts/qa-check.sh` only.
Leg 10b has **no retained fixture at all** (grep of `evals/` for `archive-predicate`: 0 hits). A retained one would mean extracting the
inline leg into its own script, which is beyond the signed design. T3's proof stays what G2 signed: re-seed the raw `*/archive/*` case,
observe leg 10b red once, restore, verify the restore with `git hash-object`. The missing retained fixture is a **TD candidate for close**.
TASK-346's `## Done when` is unchanged. **Re-confirm G2:** no design change, only a narrower file set.

### 2026-10-06 | progress | T4 built: a closing review loop now records its `review ·` line; external reviewers record as `scoped-reviewer` (babf3791 → merge f2585a5)
- Procedure: review-scoping.md § The revise loop carries the "append the review line when the loop closes" rule and the `scoped-reviewer`
  rule for external reviewers; night-run.md Part 4 carries a pointer clause only. No fifth depth word; `check-review-depth.sh` unchanged.
- Fixtures: case 19 `codex-clear-no-review-line-fails` (exit 1, `review-depth-governance-absent`) and case 20
  `codex-clear-with-review-line-passes` (PASS), differing in exactly one line.
- Discrimination (builder): with the control's `review ·` line deleted, only case 20 reddened; restored, `git hash-object` ==
  `git rev-parse HEAD:<control>` (`dc46b148…`). Coordinator re-run on main after merge: `REVIEW-DEPTH FIXTURES: all green`.
consequence · T4 · behaviour:low · governance:high

### 2026-10-06 | progress | T4 reviewed: Codex round 1 CLEAR; accepted
Codex made one static pass over `babf3791` against a five-item bounded threat model (contract conflict · the DoD's "not both" ·
fixture discrimination · consumer-side leak · wrap format) and returned a bare `CLEAR` with no per-item reasoning. Accepted
under the loop's stop rule; the coordinator's own re-run on main is the mechanical evidence. Both TASK-401 boxes ticked.
review · T4 · scoped-reviewer · behaviour:low · governance:high

### 2026-10-06 | progress | T2 built and merged: stale cut-guard references swept (c2d82fc → merge 22490f3; fix 111f343)
- 12 files reworded or removed; the dead `/assert-` exclusion in `run-emitter-column-fixtures.ts` is gone (`git ls-files evals | grep assert-`: none).
- Coordinator re-grep of the 10 basenames: what remains is history only (archives · research · changelogs · logs · LEARNINGS ·
  ADR-050 · TECH-DEBT rows · TASK-381/400 · `evals/README.md` lines already marked "cut, SPRINT-113 T1" · `sprint-041-reconstructed.md` data).
- Coordinator fix `111f343`: the builder's comment claimed `--no-members` "remains for compatibility"; nothing calls it but its own
  test, so the comment now says that and cites TD-198. **Close-retro TD candidate:** TD-198's premise is stale (its only external
  caller was cut), so `--no-members` is dead outside its test; delete the flag or record why it stays.
- Harnesses: emitter-column 9/0 · layers-completeness 25/0 · layers-observed 13/0 (after the fix).
consequence · T2 · behaviour:low · governance:low
review · T2 · self-review · behaviour:low · governance:low

### 2026-10-06 | scope-change | T1 Layers widened to the cut's measured reach (recon + coordinator re-grep), and three owner rulings
**What broke:** the Plan's T1 `Layers:` was written before the cut's reach was measured. Read-only recon plus a coordinator re-grep found
live files outside it: the two harnesses the cut deletes (`evals/run-s4-ts-evaluators.sh` (E04) · `evals/run-s4-differential-parity.sh` (P5)),
`evals/typecheck-population.test.ts` (it asserts `apps|packages|test` files are in the tsc program), seven `evals/` harness comments that
cross-reference the deleted pair, the ADRs the cut supersedes (038 · 039), `docs/epic/INDEX.md`, and `TASK-393` (retired to `cancel/`).
**Impact:** T1 stays M. File count measured by `git ls-files`: 103 files deleted (`packages/` 68 · `apps/` 4 · `test/` 31 of 40, where
`test/gate-discovery/` and its fixtures stay) plus the 2 harnesses. **Owner rulings (popup):** (1) §4 coverage: `run-adr-family-fixtures.sh`
moves back to the always-on set (+~23–28 s per default run); (2) EPIC-014 closes with its six open conditions marked *dropped by ADR-051*;
(3) the port-only TD rows resolve in T1. The coordinator checked 16 candidates by Summary: 13 fully moot (TD-083 · 098 · 102 · 103 · 104 ·
114 · 115 · 120 · 121 · 126 · 127 · 129 · 133); TD-118 · TD-165 keep only their Shell half; **TD-116 stays open** (its reviewer saw it
reproduce on the flagless run, so it is not proven port-only). **Side-finding for the ADR:** `test/architecture/unwired-exports.ts` is the
mechanism behind CLAUDE.md's wiring-check DoD line and scans `packages/`·`apps/` only, so the cut leaves that line without a detector
(recorded as an accepted cost in ADR-051). TASK-399's `## Done when` is unchanged. **Re-confirm G2:** ADR-051 goes to the owner before any file moves.

### 2026-10-06 | progress | T1: ADR-051 accepted (owner); TASK-404 filed for TD-168; TASK-393 cancelled; cut dispatched
- **ADR-051 accepted** (owner popup, `17d80f8`): the TypeScript port is retired and the Shell engine is the only engine. It supersedes ADR-038 and
  ADR-039, supersedes ADR-035's engine decision only, and narrows ADR-050 clause 3 to zero pairs. Accepted costs: a slower default gate;
  CLAUDE.md's wiring-check DoD loses its detector; a future port restarts from scratch.
- **TASK-404 filed** (P1, `needs-info` by owner ruling): cut the Shell engine's per-file spawning. id derived from the store (max 403, by two
  routes; mentions in fixtures up to 999 ignored as L-170 contamination).
- **TASK-393 → `cancel/`** (`998eea4`): the *finish* path, superseded by ADR-051.
- **EPIC-014's dropped conditions** are written `- ~~…~~ **dropped, not met**` rather than `- [ ]`/`- [x]`: `check-epic-archive.ts` counts
  only those two shapes, so a retired epic can archive at close without a dropped condition reading as either met or open.
- Cut dispatched to a Sonnet builder (worktree, base `998eea4`); system verify (`QA_FULL=1`) runs off-host after merge.

### 2026-10-06 | progress | T1 built and merged: the TypeScript port retired per ADR-051 (1a7361f → merge 6c0c109)
- 105 files deleted (`packages/` 68 · `apps/` 4 · `test/` 31 · the 2 §4 harnesses); 126 files changed, +102/−12,882. Nothing kept imports a deleted file.
- `qa-check.sh`: 47 always-on + 11 opt-in = 58 = `ls evals/run-*` (0 duplicates, 0 missing). `run-adr-family-fixtures.sh` is always-on
  and absent from opt-in; coordinator re-run on main: `ADR-FAMILY FIXTURES: all green`.
- `tsc --noEmit` exit 0; `typecheck-population` 7/0 with the retained narrow must-FAIL fixture untouched (the builder did not re-seed it).
- TD census: 143 rows, 113 open, 30 resolved (13 resolved here; TD-118 · TD-165 narrowed; TD-168 → TASK-404). EPIC-014 `status: closed`,
  its 6 open conditions struck as dropped. ADR-038 · ADR-039 superseded; the DECISIONS rows marked.
- **Pre-existing, not T1:** `test/gate-discovery/discovery-order.test.ts:57` fails on main before the merge too (9 pass, 1 fail). It is TD-154,
  open since Sprint-099: `scripts.test` is wrapped by `bun scripts/qa-verdict.ts`. Out of scope.
- **For the close rollup:** EPIC-014's SPRINT-116 member row still reads `active`, and `docs/epic/INDEX.md`'s EPIC-014 line keeps stale prose
  ("2 of 8") beside the new status; both are the coordinator's at close.
consequence · T1 · behaviour:material · governance:high

### 2026-10-06 | scope-change | T1 Layers add `evals/run-adr-family-fixtures.sh`: Codex round 1 found a §4 case the cut dropped
**What broke:** Codex round 1 on `1a7361f` (finding P2): the deleted `packages/standard/src/rules/adr-family-fixtures.test.ts` was the only
assertion over the retained `evals/fixtures/adr-family/empty-slug` fixture (`docs/adr/ADR-001-.md`). The Shell harness ADR-051 names as the
replacement runs 8 of the 9 fixture dirs, not `empty-slug` (`grep -c empty-slug`: 0), so ADR-051's "the same nine retained cases" was false.
Coordinator confirmed: the Shell engine on that fixture prints `FAIL adr-path-noncanonical: docs/adr/ADR-001-.md` (S4.ONEFILE) and PASSes
S4.INDEX/SECTIONS/NEGATIVE on the same file, the self-inconsistency the deleted test documented as an owner-ruled TS/Shell divergence.
**Impact:** T1 adds one harness case asserting S4.ONEFILE's named finding on `empty-slug`. The INDEX/SECTIONS/NEGATIVE re-admission is the
engine's own inconsistency, now documented nowhere live → **close-retro TD candidate**. Finding P3 (TD-165's narrowing names the wrong
boundary) is fixed in `TECH-DEBT.md`, already in T1's Layers. TASK-399's `## Done when` is unchanged. **Re-confirm G2:** no design change.

### 2026-10-06 | progress | T3 built (inline, a two-line conversion): the handoff check maps Plan → log through the shared predicate (b2f20a7)
- `check-handoff-state.sh` sources `archive-path.sh` (fatal if missing, the house idiom) and calls `lf_is_archived_path "$planrel"`
  instead of a raw `*/archive/*` case; leg 10b's `_ag_exempt` now names only `archive-path.sh`, and the comment says why the second went.
- Proof (ADR-050, other G): leg 10b's real code extracted by line range (937–950) and run verbatim with stub `ok`/`bad`: PASS on the converted
  tree; with the raw case re-seeded at line 149, `FAIL archive-predicate: 1 site(s) carry a raw archive exclusion …`; restored, `git hash-object`
  == the pre-seed hash (`bfb0ed97`). The checker's output on this repo is byte-identical before and after; `HANDOFF-STATE FIXTURES: all green`.
- **Close-retro TD candidate:** leg 10b still has **no retained** must-FAIL fixture (it is inline in `qa-check.sh`); today's proof was a
  one-off seed, which the scope-change of 2026-10-06 recorded.
consequence · T3 · behaviour:low · governance:low
review · T3 · self-review · behaviour:low · governance:low

### 2026-10-06 | scope-change | T1 and T2 `Layers:` re-spelled in the token forms `check-layers-observed` reads (system-verify finding)
**What broke:** system verify (`QA_FULL=1`, VPS, on `60d7ed5`, 106 s from the run's own clock) read `317 pass, 4 fail`. One FAIL was
`layers observed`: 105 of T1's deleted paths and T2's seven fixture READMEs were "changed by a task that never declared it". The files
*were* declared, but as `packages/**` · `apps/cli/**` · `test/**` and `evals/fixtures/boundary-rows/*/README.md`, and the checker
matches only an exact path or a directory token ending in `/` (`covers()`, `check-layers-observed.ts:245`). `docs/work/cancel/TASK-393-…`
(the cancel move's destination) was not declared at all. **Impact:** the tokens become `packages/` · `apps/` · `test/` and
`evals/fixtures/boundary-rows/`, plus the cancel path. Same files, readable spelling, no scope change in substance. The other three FAILs:
two `review-depth-*-absent` for T1 (its Codex loop has not closed, so its `review ·` line is owed, which is T4's new rule firing as designed)
and `knowledge index STALE` (ADR-051 added without `gen-index.sh`; regenerated now). **Re-confirm G2:** none needed.
