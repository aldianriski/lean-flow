---
sprint: 125
slug: consumer-maturity-and-cleanup
owner: Maintainer
last_updated: 2026-10-18
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-125 — Execution Log

> Append-only companion to [`../SPRINT-125-consumer-maturity-and-cleanup.md`](../SPRINT-125-consumer-maturity-and-cleanup.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-18 | promote | plan locked, governance signed, nine members: EPIC-022 S1, consumer maturity and cleanup
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion (count≥2, promoted:no): none due. L-210 is the only active entry (count 1). Two routes agree: the heading
  census and the engine's S10.PROMOTION PASS.
- ☑ TD aging (≥3 sprints unaddressed): 131 of 133 open rows, counted against sprint 125 (133 − 2 filed at 124). Newly aged and
  named for re-review: TD-247 · TD-248 (filed at 122). No open row is `high`. Eleven aged rows ride this sprint (`1a29d155`).
- ☑ doc-aging (§11 retention + §2 caps): no cap breach (`check-doc-caps.ts`: 79 PASS, three `retain` dispositions). The
  `adlc-epic-sequencing.md` disposition names EPIC-015's close as its revisit point, which is now due; it is folded into TASK-434.
  §11: no TD deletion is due (engine S11.TDDELETE PASS; TD-168 is due at 127). The store prune is re-checked by the engine
  against this file below.
- ☑ epic rollup currency: none. EPIC-022 is the only active epic, and it has no closed member. ☑ epic coverage: EPIC-022 is
  fully covered (8 open = 3 → tasks + 5 → next slice). ☑ handoff ledger: none.
Size check: 3 M + 6 S, no `L`. TASK-422 (needs-info) and TASK-427 were ruled by popup and flipped to `ready` in `8035702b`,
before the move (`sprint(125): promote`). Epic opened in the same commit. The Log is created at promote, per TASK-422's ruling.

### 2026-10-18 | gate | G1 + G2 signed by the owner (two popup rounds), attended sprint-bulk in parallel waves
Recon: four read-only `Explore` passes (sonnet), covering T4 · T7 · T2+T3 · T1+T5+T6+T8+T9. G1: goals are the Plan's Acceptance lines.
Sizes are 3 M + 6 S, with no split. Out of scope as in § Scope. Every member is `origin: manual`, so each got the full checklist.
G2 rulings (popup):
- **T3 (TASK-422): procedure only.** The template, promote, handoff and CONTEXT wording create the log at promote. STANDARD
  §2/§9's "lazily, at the first entry" is read as the latest point the log must exist. The spec, the engine (S9.TWOFILES) and
  ADR-014 are untouched, and leg 2g already FAILs a log-less open sprint.
- **T7 (TASK-432): narrow tighten + spec 0.16.0.** S4.NEGATIVE FAILs only when every Negative mention is a denial ("no
  negatives", or "none" / "n/a" right after the label). Today 0 of 53 ADRs would newly fail. This is a behaviour-change ruling
  recorded under ADR-034; §15 counts a tightened rule as MAJOR in meaning, which at 0.x is a MINOR bump. S11.TDDELETE gets a wider
  extractor plus a named `not judged` note, which moves no verdict and needs no bump (94 of 103 historical resolved-row shapes
  extract empty today).
- **T8 (TASK-433): explicit post-write checklist** in migration-map.md, which works with no bun and no `scripts/`.
- **Run shape: parallel waves.** Wave A runs in isolated worktrees: T1 · T5 · T6 · T7 · T8. Wave B is sequential, T2 → T3 → T4.
  T9 runs last and is exercised by the close release.
Designs that need no ruling: T2 adds "on the box's first line" plus a case pair in `run-by-reference-fixtures.ts`. T4 adds one
lean-flow-tooling note at the top of night-run.md and makes 7 R1 rewords. T5 adds the live-checkout row and the AFK+J0/J1 offer
rule within 139 lines. T6 gives CODE_OF_CONDUCT and QA-TESTCASE a header; BUG and DESIGN are exempt, and AGENTS keeps its footer.
T9 adds step 3b.
Review depth: T7 is Consequential G, so it gets seeded breaks, a `cmp` restore and a worktree-isolated Codex review. Every other
task gets one scoped sonnet reviewer.
consequence · T1 · behaviour: none · governance: low (epic status, ledger rows)
consequence · T2 · behaviour: low · governance: material (shipped tick wording)
consequence · T3 · behaviour: low · governance: material (shipped template + promote procedure)
consequence · T4 · behaviour: low · governance: material (shipped skill wording)
consequence · T5 · behaviour: low · governance: material (shipped /prime rule)
consequence · T6 · behaviour: low · governance: material (shipped templates)
consequence · T7 · behaviour: material (adopter verdicts) · governance: material (spec 0.16.0, ADR-034 ruling)
consequence · T8 · behaviour: low · governance: material (shipped migrate procedure)
consequence · T9 · behaviour: low · governance: material (shipped release procedure)

### 2026-10-18 | scope-change | Plan meta corrected after the preflight HALT; TASK-434 box 1 re-scoped from archive to close-in-place
**What broke.** The pre-dispatch preflight HALTed (base-ref PASS, waves computed). Two separate causes:
1. Every task's `Layers:` named `CHANGELOG.md` and `TECH-DEBT.md`, and four named the bare `evals/`, so parallel tasks read as
   unowned overlaps.
2. T9's `Depends-on: T1–T8` range was not parsed, which put T9 at rank 0 alongside wave A.

Recon also showed that §11 cannot archive EPIC-006 · 008 · 009 · 011 · 012. Archiving needs `status: closed` **and** every
Closed-when ticked, and the five have unticked conditions and no members. The precedent is EPIC-010 · 013, closed in place.
**Impact.** These are Plan meta edits only. No member's `## Done when` changes except TASK-434's box 1:
- `CHANGELOG.md` · `TECH-DEBT.md` leave every `Layers:` and become coordinator-owned (D1).
- `evals/` narrows to each task's exact harness and fixture paths.
- T9 lists T1 to T8 explicitly.
- T3 gains `skills/handoff/SKILL.md` · `.claude/CONTEXT.md` (both say "create lazily").
- T7 gains `spec/STANDARD.md` · `spec/CHANGELOG.md` · `docs/architecture/overview.md` (spec 0.16.0 and its quoted version).
- **TASK-434** box 1 becomes: closed in place, superseded → workdoo, with no archive move.
**Re-confirm G2.** These follow from the rulings signed above. They narrow the bounds and add no scope; the owner confirmed by
signing the run shape.

### 2026-10-18 | dispatch | wave A — five worktree builders (sonnet) from declared base `0ef06517`; every base verified
Each builder reported `git rev-parse HEAD` = `0ef06517` as its first output, and `git merge-base <branch> HEAD` agreed for every branch.
The worktree-base guard intent is met: under `worktree.baseRef: "head"` no base was stale. Fifteen leftover agent worktrees from
earlier sessions (several `locked`) were left alone, because they may belong to live sessions (TD-246); new agent ids did not collide.

### 2026-10-18 | review | wave A — one scoped sonnet reviewer over T1 · T5 · T6 · T8, Standards and Spec separately
- Spec: CLEAR ×4.
- Standards: T1 med. `skills/orchestrator/references/night-run.md:692` and `scripts/night-run.sh:184` still call EPIC-008 `status:
  proposed`. These are routed to T4, which owns night-run.md; the `.sh` comment sits outside every Layers line, so T4's scope-change
  adds it. T1 low: pre-closure admission callouts in EPIC-009 · 011 · 012 are marked historical, and EPIC-010's stale line is fixed.
  T6 low: DESIGN cites §2/§3. T8 low: plan mode checks planned frontmatter.
- Before review, the coordinator also caught that T1 had dropped F4, which harness-delta.md:34 cites; it was restored at `eb17680c`.
  T8's 878-char bullet was wrapped at `39bc7ba6`.
Each builder had one bounded retry per finding.

### 2026-10-18 | merge | wave A merged on an integration worktree, `--no-ff` per task (T1 → T5 → T6 → T8); main fast-forwarded to `a5ba6204`
The post-merge cross-cutting legs ran on the merged tree:
- check-doc-caps: no breach.
- check-epic-archive: PASS.
- check-sprint-by-reference: 10/0.
- layers-observed: PASS.
- duplicate-id check: none.
- prose-density: **5 FAIL**. The new Closed banners in EPIC-006 · 008 · 009 · 011 · 012 were single lines over 400 chars, which the
  per-branch review missed. T1 wrapped them at `034cd442`, they were re-merged, and prose-density is now 28/0.
The typecheck leg was not run here (no node_modules in the integration worktree); it runs at system verify.

### 2026-10-18 | T1 | TASK-434 — platform epics closed in place, superseded → workdoo; sequencing register re-ruled
EPIC-006 · 008 · 009 · 011 · 012 are `status: closed` with a superseded banner, and their Closed-when boxes are left unticked (not
delivered). EPIC-005 · 007 are untouched. INDEX rows and preamble are updated. adlc-epic-sequencing.md went from 158 to 102 lines,
and its `.cap-dispositions` retain line is deleted. TD-100 · 161 · 176 were re-verified still fixed; TD-243 moved to workdoo
(`48c3119f`). No CHANGELOG line: this is maintainer-side.

### 2026-10-18 | T5 | TASK-429 — /prime live-checkout freshness + night-run offer gated on AFK J0/J1
Only `skills/prime/SKILL.md` changed (`83684fa6`), and it stays at 139 lines. The live-checkout row was checked by reading: no live
`--plugin-dir` run was possible from a cached-install session. CHANGELOG (consumer): `/prime` reports `fresh` under `claude
--plugin-dir <repo>`, where it used to report `n/a`, and names `sprint-bulk unattended` only when an open AFK J0/J1 task exists.

### 2026-10-18 | T6 | TASK-431 — ownership headers on governed templates
CODE_OF_CONDUCT and QA-TESTCASE gained the §3 header; BUG and DESIGN carry exemption comments; AGENTS is unchanged.
`conformance.sh`: S3.SCHEMA PASSes on a rendered QA doc and FAILs on the header-less control. CHANGELOG (consumer): the
CODE_OF_CONDUCT and QA-TESTCASE templates carry the four-field ownership header, so an adopter rendering them no longer collects
S3.SCHEMA findings.

### 2026-10-18 | T8 | TASK-433 — migrate post-write required-field checklist
migration-map.md § Verification has a mandatory checklist (11 fields, plus id = filename) for both plan and apply. A file failing it
is withheld and named; it is never defaulted. The check was hand-run on a fixture (TASK-942 withheld), and the harness reads 101/0,
including the must-FAIL tree. CHANGELOG (consumer): `migrate` withholds and names any incomplete task file on every run, and needs no
script or bun.

### 2026-10-18 | scope-change | T4 Layers gain `scripts/night-run.sh` (one stale EPIC-008 comment, wave A review finding)
**What broke.** T1 closed EPIC-008, which left two sentences false: `skills/orchestrator/references/night-run.md:692` (already T4's
file) and a comment at `scripts/night-run.sh:184`. Both say EPIC-008 is `status: proposed`.
**Impact.** T4's `Layers:` gains `scripts/night-run.sh`, for that comment only. The script's behaviour is unchanged, and no member's
`## Done when` changes.
**Re-confirm G2.** This adds no scope: it corrects a status claim that this sprint's own T1 falsified.

### 2026-10-18 | T2 | TASK-427 — tick tail goes on the box's first line (wording moves, checker unchanged); merged `8a69988a`
dispatch.md rule 5 and sprint-by-reference.md step 4 (stated once, with two pointers) now name the placement. A retained pair guards
it: `multiline-box-tail-on-first-line` PASSes and `multiline-box-tail-on-continuation` FAILs with `FREEZE-EDIT TASK-901`. The harness
reads 149/0. A seeded tail-strip break reddened the PASS case; the checker hash was restored, and a8315bc9 = HEAD. Post-merge:
prose-density 28/0, layers-observed PASS, freeze 10/0. This sprint's own ticks have used the first-line placement since wave A, so it
is exercised on real input. TD-229 is resolved. The task is in `review/` until its Codex pass, which is batched with T3/T4.
CHANGELOG (consumer): when a `## Done when` box wraps, append the ` ✓ <evidence>` tail to its first line, never to a continuation line
or a line of its own; the freeze check treats those placements as edits.

### 2026-10-18 | review | Codex gauntlet (gpt-6-astra, read-only, diff pasted) — wave A skills CLEAR; T7 R1 five medium findings
The owner's standing ruling puts consequential G and every shipped skill/template change through Codex; the wave A sonnet pass had
not covered that. The default Codex model (`gpt-6.1-sol`) was rejected on this ChatGPT-account login (HTTP 400), so both reviews
re-ran with `--model gpt-6-astra --effort high`.
- **Wave A skills (T5 · T6 · T8): W1–W6 CLEAR.** Caveat: the referenced exemption and resume rules could not be checked beyond the
  pasted diff.
- **T7 R1 (engine + spec + evals).** T1 portability: CLEAR. Findings, each medium:
  - T2: false FAIL on "No negatives except slower builds." (unrestricted suffix).
  - T3: false PASS on "Negative: None identified." (punctuation order).
  - T4: the first sprint in a status field naming two sprints is taken as the resolve sprint.
  - T5: the spec CHANGELOG says S11.TDDELETE "moves no verdict", but wider extraction can turn an overdue row from a silent PASS
    into a FAIL.
  - T6: the recent-row controls are vacuous if a row is skipped, and the combined borderline control masks itself.
**Disposition:**
- T2 · T3 · T5 · T6 → one builder round, then one Codex re-review (cap).
- T4 → TD at close, by census: 0 of 112 historical resolved rows carry two sprint ids in the status field (bounded-review rule).
**Correction to the G2 entry above.** It said the S11.TDDELETE change "moves no verdict and needs no bump". That is wrong (Codex T5).
Overdue rows in shapes the old extractor missed now FAIL. Spec 0.16.0 already carries MAJOR meaning for S4.NEGATIVE, so the version
stands; the spec text and CHANGELOG are corrected in the T7 revise.

### 2026-10-18 | T3 | TASK-422 — Execution Log created at promote (procedure only); merged `9fb8fa5a`
The templates, the promote row, by-reference step 4, the handoff fallback ("only if absent"), CONTEXT and README now say the log is
rendered at promote, with the promote entry first. STANDARD §9, the engine, the rollup check and ADR-014 are untouched. The new
fixture `qa-leg2g-v2-promoted-log-promote-entry-only` is not FAILed: the leg skips with "no completed-run entry yet", pass=0 fail=0,
and the harness is all green. Post-merge: prose-density 28/0, layers-observed PASS, caps PASS (lean-doc-generator 138, handoff 100).
TD-160 is resolved. Box 3 (README/CHANGELOG) stays open: README is done and the CHANGELOG lands at close. The task is in `review/`
until its Codex pass, batched with T2/T4.
CHANGELOG (consumer): the sprint Execution Log is created at promote, with the promote / plan-locked entry first in the same commit,
instead of lazily at the first entry. That is earlier than STANDARD §9's minimum, which it satisfies.

### 2026-10-18 | T4 | TASK-428 — shipped skills mark lean-flow's scripts as its own; adopter steps name the property; merged `eaf8cc7b`
Re-census found 19 occurrences in 5 files on two selectors (occurrences, and lines per file), before and after; paths were marked,
not deleted.
- R1 (5), reworded to the property: orchestrator/SKILL.md:50 · review-scoping.md:223 · dispatch.md:81 · the night-run.md 4c row
  and gate items.
- R2 (10), marked lean-flow's own. R3 (3), left as already marked.
- night-run.md now opens with a note: the scripts are lean-flow's reference implementation, and an adopter substitutes their own
  trigger and gate.
- The stale "EPIC-008 status: proposed" is fixed in night-run.md and in one scripts/night-run.sh comment (`sh -n` ok).
Post-merge: prose-density 28/0, layers-observed PASS, caps 138/138. TD-137 and TD-214 are resolved. Box 3 (CHANGELOG) stays open
until close. The task is in `review/` until the wave B Codex pass.
CHANGELOG (consumer): orchestrator references no longer present lean-flow's `scripts/` tooling as the mechanism of an adopter step.
Those steps now name the property, and night-run.md opens with a note that an adopter uses their own `claude -p` trigger and gate.

### 2026-10-18 | review | Codex gauntlet, wave B (T2 · T3 · T4 shipped diffs; gpt-6-astra, read-only) — B1–B5 CLEAR, B6 low pre-existing
B6: `.claude/CONTEXT.md:104` exceeds 400 chars. The line was already overlong before T3 and sits under its prose-density baseline
(gate 28/0); T3 only lengthened it. It is recorded for the close Retro's doc-aging rather than fixed here (outside every Layers line's
intent: an SSOT dedup pass, L-008). TASK-427 has every box ticked and Codex CLEAR → `done/`. TASK-422 and TASK-428 keep box 3
(CHANGELOG) open until close.

### 2026-10-18 | T7 | TASK-432 — S4.NEGATIVE bare-denial FAIL + S11.TDDELETE all-shape extractor, spec 0.16.0; merged `ef9e96ab`
**Consequential G bar met:**
- Regression-first fixtures.
- A 10-seed campaign on the first build plus 4 seeds on the revise, each reddening only its own cases, with sibling controls green.
  The engine was restored by hash each time; the final hash equals HEAD.
- Outside review: Codex R1 (5 findings) → one builder round → Codex R2. T2 · T3 · T5 came back FIXED and nothing new was found.
  R2-T6 was "unverifiable": my R2 brief omitted the evals diff. The coordinator verified it directly: recent controls FAIL if
  listed as not judged, the borderline control is split per shape, and the pending-label sibling is present.
- R1-T4 goes to debt at close, by census (0 of 112).
**Post-merge:** the always-on adr-family harness is all green, prose-density 28/0, layers-observed PASS. `conformance.sh .` shows
S4.NEGATIVE PASS 53/53 and S11.TDDELETE PASS plus a note naming TD-168. The run also raised one §11 finding,
`closed-task-past-retention: done/TASK-423`, which came due once TASK-427, its last live citer, moved to `done/`. It is routed to
the close retention pass (owner approval).
TD-187 and TD-118 are resolved. Box 3 (CHANGELOG) stays open until close, so the task is in `review/`.
CHANGELOG (consumer, spec 0.16.0):
- S4.NEGATIVE now FAILs an ADR whose § Consequences only denies a Negative; an ADR naming any real Negative passes.
- S11.TDDELETE reads the resolve sprint from every resolved-row shape, so an overdue row the old extractor missed now FAILs. Rows
  naming no sprint are listed in one note.
- Rule ids and finding ids are unchanged.

### 2026-10-18 | T9 | TASK-430 — release-patch derives the lockstep set and bumps sibling current-version references; merged `61e0da9d`
`skills/release-patch/SKILL.md` grew from 98 to 100 lines. Plugin mode derives its lockstep set from `grep -l '"version"' .*-plugin/*.json`.
The new step 3b runs `git grep -nF '<old>'` and bumps only the hits that state the current version (never CHANGELOG history); the
output gains a `[siblings]` line. Dry-run on 2.5.0 selected 4 manifests plus the README footer and left 2 history hits. Caps and
prose-density pass. Box 2 is exercised by this sprint's own release. Codex T9 pass pending.

### 2026-10-18 | close-prep | CHANGELOG SPRINT-125 block written (`4a29e70f`); box 3 ticked on TASK-422 · 428 · 432; TASK-430 box 1
TASK-422 · 428 · 432 have every box ticked and a CLEAR Codex verdict (wave B, and T7 R2), so they move `review/ → done/`.
TASK-430 waits in `in_progress/`: its Codex pass is pending, and box 2 needs the real release.

### 2026-10-18 | system-verify | QA_FULL on the VPS at `d1dc165b`: 295 pass, 4 fail — close blocked (ADR-021)
1. The orchestrator-store text contract pins "**The script follows this contract (TASK-392).**" in night-run.md, and T4 had reworded
   it. Restored with T4's intent kept (`sprint(125) T4:` commit); the store harness reads 42/0.
2. Layers completeness: the coordinator's tick tails named harness files by bare name, and those names are absent from the blocks'
   `Cites:`.
3. Scope-change layers: the "Plan meta corrected" entry names TASK-434 in its heading, so the checker attributes all of its paths
   (which belong to T3 · T7 · D1) to T1.
4. Authority: the T2 and T3 Plan headers declare J1, while members TASK-427 and TASK-422 declare J2.
Fixes 2–4 are the Plan-meta scope-change below. Re-verify on the VPS after them.

### 2026-10-18 | scope-change | T1 T2 T3 T8 Plan meta after system verify: J2 on T2/T3, bare harness names on Cites, T1 attribution note
**What broke.** See the system-verify entry above, findings 2–4.
**Impact.** These are Plan meta edits only; no member's `## Done when` changes.
- T2 and T3 headers move J1 → J2, matching their members (the safe end; both ran attended).
- T2 `Cites:` gains `run-by-reference-fixtures.ts`.
- T3 `Cites:` gains `run-night-run-rollup-fixtures.sh`.
- T8 `Cites:` gains `run-v1-to-v2-fixtures.ts`.
- T1 `Cites:` gains a note naming the paths the earlier Plan-meta entry listed, cited only because that entry's heading names
  TASK-434: `CHANGELOG.md` · `evals/` · `skills/handoff/SKILL.md` · `.claude/CONTEXT.md` · `spec/STANDARD.md` · `spec/CHANGELOG.md`
  · `docs/architecture/overview.md`.
**Re-confirm G2.** This adds no scope. It brings the declarations in line with what was already ruled and built.
