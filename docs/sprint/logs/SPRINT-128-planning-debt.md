---
sprint: 128
slug: planning-debt
owner: Maintainer
last_updated: 2026-10-18
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-128 — Execution Log

> Append-only companion to [`../SPRINT-128-planning-debt.md`](../SPRINT-128-planning-debt.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-18 | promote | plan locked, governance signed, five members: EPIC-022 S4, the planning-checker debt
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due; the two active entries (L-234 · L-210) are at count 1.
- ☑ TD aging: 112 of 114 open rows, counted against sprint 128. Second route: 122 open − 8 closed at this promote = 114, minus the
  2 filed at 127 (TD-253 · TD-254) = 112. Newly aged: TD-251 · TD-252 (filed at 125). No open row is `high`.
- ☑ doc-aging: §11 TD deletion of the 15 rows resolved at 125 (S11.TDDELETE). 8 rows closed with evidence on each, as approved at
  intake: TD-142 · 119 · 145 already fixed; TD-189 · 151 · 185 · 186 census zero (TD-186's unmeasured shape: 0 of 47 task files,
  with a seeded positive control firing); TD-045 retained by design. Store prune: none due, by the engine's own rule run at sprint
  128 (its citation scan reached 209 ids). CHANGELOG rotated at 2.8.0. No §2 cap breach.
- ☑ epic rollup currency: EPIC-022's rows for 125, 126 and 127 carry their close commits; the header is current.
- ☑ epic coverage: EPIC-022 has one open condition (7), re-marked at this promote → TASK-443 · TASK-444 · TASK-445 · TASK-446 ·
  TASK-447. ☑ roadmap coverage: no roadmap in this repo. ☑ handoff ledger: none.
Size check: 4 M + 1 S, with no `L`. All five members are `origin: decomposer`, so each G1 is the fast-path confirm.
Intake recon (Explore, before the grill) is the source for the census figures above and for D1's ownership map.
promote-check 16/0, after two prose fixes: T3 now declares its T1 ownership dependency, and T4's prose no longer names T1.
Dispatch preflight, first run: HALT. T4 shared the `evals/` token with T1–T3 and had no edge to them; 20 files name the twins,
several of them evals the parser tasks also edit. Re-sequenced so T4 runs first, which spares T1–T3 any Shell mirroring.
Preflight now CLEAR (waves T4 · T1 · T2 · T3 · T5).

### 2026-10-18 | gate | G1 + G2 signed by the owner (two popup rounds); attended sprint-bulk, T4 → T1 → T2 → T3 → T5
G1: all five members are `origin: decomposer`, so each took the fast-path confirm (scope unchanged since intake). Sizes 4 M + 1 S,
with no split. A3 failed its check (below); A1 and A2 stand, confirmed in T1/T2's differentials and at T4.
G2 design:
- **Run shape.** Sequential Sonnet builders, each in its own worktree so a seeding campaign never touches `main`; the
  worktree-base guard runs on every dispatch. Coordinator owns the log, the ticks, the member moves and CHANGELOG/TECH-DEBT.
- **Proof.** T1 and T2 prove behaviour preservation by an old-vs-new differential over all 127 archived plans and every fixture.
  T1 · T2 · T3 · T5's conformance-reached parts take the full bar (seeded breaks, plus an independent coordinator re-seed);
  T4 takes ADR-050's Other-G bar plus self-review. Codex (`gpt-6-astra`) reviews T1 · T2 · T3 · T5, at most 2 rounds each.
- **Rulings (owner, popup), each from a census:**
  - TASK-444: a `Cites:` task id governs a member only in the leading run of ids that opens the line (the template's convention).
    Across 21 by-reference plans, that run holds 89 of 89 member ids and excludes 4 of 6 non-member mentions.
  - TASK-445: every resolver anomaly (duplicate id · listed id with no file · file outside `docs/work/<folder>/`) FAILs, named.
    The census is 0 of each, so no current verdict moves.
  - TASK-446: A3 is only half true, because the reaper's "v1" branch is also its fallback when `bun` is missing. It is replaced
    by named errors with no parsing: a v1 sprint gets "unsupported since 2.0 (ADR-046)", and a missing bun gives zero counts plus
    the existing bun line.
  - TASK-447: TD-177's dead-token finding lives in `check-layers-observed`, after work. A token matching nothing in the tree and
    nothing in the sprint's diff is named, with no new Plan syntax. Admitted under ADR-053 on SPRINT-104's measured miss (glob
    tokens that covered 0 of the files changed, 14 left undeclared).
consequence · T1 · behaviour: med · governance: material (a module conformance.sh reaches)
consequence · T2 · behaviour: med · governance: material (conformance-reached readers)
consequence · T3 · behaviour: med · governance: material (conformance-reached resolver)
consequence · T4 · behaviour: low · governance: low (deletions of maintainer tooling; prose mentions only)
consequence · T5 · behaviour: med · governance: material (engine field readers, the shipped preflight)

### 2026-10-18 | scope-change | T4 TASK-446 box 2: the reaper's v1 branch is reachable (no-bun fallback), so it is replaced, not merely deleted (owner)
**What broke.** Box 2 froze "deleted after showing no supported path reaches it". On a v2 sprint with no `bun`, `rp_v2` stays 0
and the reaper drops into that branch, so the premise is false.
**Impact.** Box 2 is reworded to the owner's ruling: the v1 counting is deleted; a v1 sprint gets a named "unsupported since 2.0"
error, and a missing bun gives zero counts plus the existing bun line. TD-049 still closes.
**Re-confirm G2.** The owner signed G1 + G2 with this rewording in the same popup.

### 2026-10-18 | T4 | TASK-446 — the Shell twins and the reaper's v1 counting retired; merged `53b886d0` (`82057d08` + coordinator fix `f4b69d73`)
Worktree-base guard PASS (`3125766f`). Deleted: `check-layers-observed.sh`, `check-authority.sh`, `evals/run-layers-observed-fixtures.sh`,
`evals/run-authority-differential.ts` (−2,945 lines across 20 files). `layers_tokens` moved into `check-layers-completeness.sh`, which
keeps the dispatch preflight's parity oracle. Reaper: no Plan parsing. A v1 sprint gets "v1 sprint unsupported since 2.0 (ADR-046)",
a missing bun keeps its line, and the counts are zero. The reaper's harnesses were converted from v1 to v2 trees, with a retained
must-FAIL case `v1-is-named-unsupported-beside-store` (the old reaper printed `1 of 3`).
**Coordinator verify caught one defect.** The "byte-equivalent" move wrote a literal newline inside `printf '%s…'` where the original
had `\n`. The output was identical only because `*.sh` is pinned to LF. Restored from a script file (`chr(92)`, one match); the
function body diffed identical to the original, and the completeness, preflight and sprint-close harnesses were re-run green. A scan of
every added line for an unterminated quote or a lost escape found no other case.
Builder findings, ruled:
- A new opt-in wrapper `evals/run-layers-observed-test-fixtures.ts` (13-test floor) is accepted. The deleted runner was the only path
  to `layers-observed.test.ts`, so this replaces existing coverage and is not new machinery.
- The deleted runner's Plan-path cases ran against the Shell only, so the TS leg loses nothing it had. T1 adds must-FAIL fixtures
  for the Plan-path behaviour it moves.
- Comments in `check-authority.ts`, `check-layers-observed.ts`, `check-layers-completeness.ts` and `check-dod-delta.ts` still call
  the twins live. They go to T1 (observed · completeness) and T2 (authority · dod-delta), the tasks that own those files.
- Reaper blind spot (no bun and a v1 sprint, so silent zeros) → TD at close. Census: no v1 sprint exists in a v2 tree.
- Live docs still naming the twins (e.g. `docs/QA.md`) → close-time doc-freshness.
Post-merge: layers-observed, completeness, freeze (6/0) and scope-change (7/0) clean; tsc rc 0 with 0 errors; prose-density 28/0;
duplicate-id check empty. QA_FULL launched on the VPS at `53b886d0` for box 3.
QA_FULL on the VPS at `53b886d0`: **QA-CHECK: 304 pass, 0 fail**, rc 0. It covers every always-on leg, so the bare profile too. Box 3 is
ticked on it. All three ticks went through `tick-box.ts` (freeze 6/0, layers 15/0 after each write).

### 2026-10-18 | T1 | TASK-443 — one shared Plan parser; merged `868765ea` (`63105338`, R1 fix `c3465f68`, owner ruling `8876eef7`); done
Worktree-base guard PASS (`beb9d90d`). `parsePlan()` in `sprint-members.ts` is the one Plan reader, and both Layers checkers read
through it with their own extractors, token and heading regexes deleted. A column-0 continuation is a named anomaly in both. A
Done-when bare filename matches by basename when exactly one declared path has it (ambiguous is named; TD-178 · TD-215). A
`sprint(NNN) Tn:` commit attributes only for its own sprint (TD-248). The twin-oracle comments are gone from both files.
Proof (consequential G): an old-vs-new projection over 145 Plans (127 archived, the live sprint, fixtures) shows 0 differences in
blocks, tokens, Cites, Depends-on or anomalies. The completeness CLI is byte-identical apart from the reworded finding. Observed's
CLI was compared on the live sprint only, since an archived run takes ~7 min; the projection covers its Plan reading. Seeds S1 (drop
the anomaly) · S2 (any basename match) · S3 (ignore NNN) · P1a/P1b · err-loud each reddened exactly their cases. The coordinator
re-seeded S1 independently and got the same 54/4. A first malformed seed threw rather than dropping, and was discarded and redone.
Review: Codex `gpt-6-astra` R1 found 4 items.
- P1: a non-task `###` changed observed's reading. The old checkers disagreed, so `carry` keeps each one's own. Fixed.
- P2: a backtick-led prose line after a declaration is flagged. **Owner ruling: err loud.** In the archive, strict token-only made
  2 real annotated wraps silent drops, against 2 prose lines it would spare. The finding now gives the remedy instead.
- P3: no change; an exact path precedes the basename fallback.
- P5: settled by grep; the deleted functions have no outside callers.
R2 CLEAR. Post-merge: layers-observed / completeness / freeze / scope-change clean, tsc rc 0, suites 68/0, the observed wrapper 27-case
floor green, preflight green, promote-check 16/0. Builder residuals for close: TD-178's Plan-prose leg still compares literally; the
`(SPRINT-N Tn)` trailing form still ignores N; the parser no longer joins a backtick span broken across lines (0 in the corpus).
Ticks via `tick-box` (5/5; freeze 6/0, layers 15/0 after each).

### 2026-10-18 | scope-change | T2 TASK-444 Layers gain the two Layers checkers, where TD-199's `member-layers-undeclared` is emitted
**What broke.** TASK-444 box 2 ("a `Cites:` mention no longer masks `member-layers-undeclared`") is about a finding that
`check-layers-completeness.ts` and `check-layers-observed.ts` emit, and neither is in T2's Layers. T1 deliberately exposed `lead`
without applying it, so its behaviour-preservation proof stayed clean.
**Impact.** T2 Layers gain both files, so the ownership order becomes T1 → T2 → T3 for completeness and T1 → T2 → T3 → T5 for
observed. T3 already depends on T2 and T5 on T2/T3, so no wave moves. No DoD change.
**Re-confirm G2.** Not needed: no new behaviour. The owner's leading-run ruling already covers it, and the box already names the finding.

### 2026-10-19 | T2 | TASK-444 — the remaining Plan readers on parsePlan, Cites governs by leading run; merged `6e0a31a7` (`b973c8cd..70368785`, R1 fix `bfb92d3d`); done
Worktree-base guard PASS (`d78edb1f`). Authority, by-reference (`planDecls` and the frozen-Plan reader), the members CLI and dod-delta
read Plans only through `parsePlan()`; their heading and `Cites:` regexes are gone. Governance uses `cites.lead` in those four and in
both Layers checkers' member legs (TD-199), with a retained must-FAIL plus a leading-id control in each of the six harnesses.
Proof (consequential G): the builder's `conformance.sh .` A/B was identical (114 lines). The coordinator's post-merge run is rc 0
with no FAIL, and its deltas against the promote-time run are sprint progress only. Old-vs-new over 283 Plans: 0 unexplained
differences, and the four readers agree on 283 of 283. Seeds L1a–g (`all` for `lead`) · L2a–d (old heading/suffix) · L3a–e (`tid`
for `carry`) each reddened only their case; the coordinator re-seeded L1f independently (exactly the TD-199 case reddened).
Review: Codex R1 found that `planUnits` dropped `Cites:` under a non-task `###`, where the old CLI carried it to the preceding Tn.
The builder checked every reader's old behaviour (authority and by-reference reset; the CLI and dod-delta carried) and fixed both
carriers, the second one unflagged by Codex, in `bfb92d3d`. R2 left one point open. A block with two `Cites:` lines takes the
leading run of their concatenation, which is neither the old CLI's union nor dod-delta's first line. Census by two routes: 316
`Cites:` lines over 316 blocks, so 0 of 505 real blocks carry two. → TD at close (bounded-review rule; 2-round cap reached).
Coordinator rulings on builder findings: headings outside `## Plan` are no longer read (accepted: the template's contract, 127/127
plans have it, and the result is a visible skip). The `` `A` and `B` `` lead gap and the original dod-delta fixture it weakened are
fixed in T3, the parser's owner. Combined `### T1+T2` headings: census 0, accepted. Stale twin comments in the Layers checkers go
to T3. Ticks via `tick-box` (4/4).
