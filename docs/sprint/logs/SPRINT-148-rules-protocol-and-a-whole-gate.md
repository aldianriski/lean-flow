---
sprint: 148
slug: rules-protocol-and-a-whole-gate
owner: Maintainer
last_updated: 2026-10-29
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-148 — Execution Log

> Append-only companion to [`../SPRINT-148-rules-protocol-and-a-whole-gate.md`](../SPRINT-148-rules-protocol-and-a-whole-gate.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-10-29 | promote | plan locked, governance signed, four members: clinic rules and spec, the trial protocol, a whole off-host gate
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. Census 17 active + 222 promoted + 1 superseded = 240, equal to the heading count.
- ☑ TD aging: 98 of 100 open rows aged against sprint 148. Second route: 105 rows − 5 resolved = 100 open; TD-279 (146)
  and TD-280 (147) are not aged. Newly aged: none (no row filed at 145). No `high` row.
- ☑ doc-aging, §11: no deletion due (the rows resolved at 146 come due at 149). No pruning: SPRINT-145's TASK-525 and 526
  still have live citations (2 and 1), and TASK-524 still has its fixture mention. git grep and ripgrep agree, and the
  TASK-367 control hits 2 on both. No CHANGELOG rotation, no LEARNINGS collapse.
- ☑ doc-aging, §2: no breach; three `retained:` rows. CLAUDE.md 79/80, CONTEXT.md and overview.md 149/150.
- ☑ epic rollup currency: EPIC-023's SPRINT-147 row is closed with `751df00d`, header current. ☑ epic coverage: 5 of 5
  (condition 1 → TASK-544, 545 in backlog). ☑ roadmap: none. ☑ handoff ledger: none.
Intake: `/triage` (`0b8dec25`, owner `y`) set TASK-535 and 542 ready, since their blockers TASK-534 and 533 are done. TASK-532 stays
`ready` beside its dependency TASK-531 by owner ruling, ordered in this Plan as T4 after T3. Composition by owner popup.
Size check: two M, two S, no `L`. All four are `origin: decomposer`. Epic: EPIC-023 (T1, T2); T3 and T4 carry no epic.
`promote-check`: 13 pass, 0 fail. Pre-dispatch preflight: CLEAR (waves T1 = T2 = T3 = 0, T4 = 1; the four shared files
owned T3 -> T4).

### 2026-10-29 | scope-change | T2 -- `docs/research/logs/ab-measurements.md` joins T2's `Layers:`
What broke: T2's paid real run (P6) appends its smoke row to the harness's default run log, which sits outside `evals/ab/`.
Impact: one Layers token added to T2's Plan line; no other task touches the file, so the overlap map is unchanged. Re-confirm
G2: signed with the G2 entry below (owner popup).

### 2026-10-29 | G2 | G1 fast-path + batch G2 signed for T1-T4 (owner popup), `gates_signed: G1,G2 @ 0c33d7ce`
G1: all four `origin: decomposer`, scope unchanged since intake. G2 designs: T1 adds three clinic rules test-first (page + API + DB
test each) and the spec under six named headings. T2 is a two-phase D9 trial: the design goes to a file, a Layers scope check and an
isolated judge sign it, the session resumes, and the post-build diff is re-checked; any popup or permission denial is parked; the fixture
repo only. T3 runs both stages in one ssh call, judges each from its own log, and pins the stage list to `package.json`. T4 makes
the verdict the last `QA-CHECK:` line, closes the exit set at 0/1/2/5 and warns on a dirty tree.
Owner rulings: A3, the clinic's hours live in **Asia/Jakarta** (fixed, one zone); rule values as proposed (24 h cancellation window
with a hard delete that frees the slot · daily cap default 8 per doctor · a patient record is complete with date of birth + phone);
dispatch T1 ∥ T2 (worktree) ∥ T3→T4 (main tree), sonnet builders. A1 is confirmed at T1's first build step.
- builder-check · T1 · 4 contradictions · 7 questions · settled in the design: each rule gets a page + API + DB test, the six spec headings are named,
  box 3 covers domain/rules/conventions, one migration, seeds backfilled, rule order fixed; intent → popup (zone, values)
- builder-check · T2 · 5 contradictions · 6 questions · settled in the design: the popup set is stated whole (incl. any permission denial), the post-build diff is
  checked against Layers (S12), a deviation is recorded on every protocol row, harness files are excluded from judge and diff; Layers → scope-change above;
  the two-phase stability fact is left to P6, and a park there is surfaced to the owner, never retried
- builder-check · T3 · 0 contradictions · 4 questions · settled in the design: the pin compares exact segments; both-fail output; `cd` failure → exit 5;
  TD-224/225 resolved at SPRINT-115 (fact)
- builder-check · T4 · 0 contradictions · 3 questions · nothing important left (porcelain counts untracked paths, as intended)

### 2026-10-29 | execute | T3 done -- gate-remote runs and judges both declared stages (TASK-531, TD-279 resolved)
Commits `54eed65d` (code + tests) · `cfbb748c` (strict-index typecheck fix) · `31b85143` (TD-279 + CHANGELOG). Builder: sonnet, `/tdd`.
Checks re-run by the coordinator: `bunx tsc --noEmit` clean; `bun test evals/gate-remote.test.ts` 54 pass, 0 fail. Builder's full `bun test`
579 pass, 0 fail. VPS at `cfbb748c`: `bun test: 579 pass, 0 fail (rc 0)` · `QA-CHECK: 329 pass, 0 fail` · exit 0.
Deviation: two VPS runs, not one. The first, at `54eed65d`, was red on `typecheck` (7 strict-index errors in the new code) with bun test green; it was fixed
and re-run once. The gate caught a real defect, which is the tool doing its job.
- skip-table · T3: the maintainer tool's exit verdict changes; Other G (D2) → coordinator self-review at execute, the scoped review it owed ran at close (record corrected in place at close per L-176: the bulleted form was unreadable to `check-review-depth` and its `med`/`high` tokens are outside the vocabulary; every task is `behaviour:material` by the dispatch classifier, since each changes behaviour)
consequence · T3 · behaviour:material · governance:low
- review finding · T3 · 1 finding, routed: `judgeBun` reads the FIRST bun summary match, so a nested summary printed earlier could mask the real one
  (the same class as TD-268). It goes to T4 as a scope note, because T4 owns the same file next and the fix is the same last-match rule.
- scope-change · T4 · `judgeBun` also reads the LAST summary lines, with a two-order test. What broke: the review finding above. Impact: one function and
  one test, inside T4's `Layers:` (`scripts/gate-remote.ts` · `evals/gate-remote.test.ts`); no box changes. G2 re-confirm: coordinator, in scope as the
  same last-match rule TD-268 names.

### 2026-10-29 | execute | T4 done -- the verdict is the last line, the exit set is 0/1/2/5, a dirty tree warns (TASK-532, TD-268 resolved)
Commits `5759a853` (code + tests) · `0065c26f` (TD-268 + CHANGELOG). Builder: sonnet, `/tdd`, continuing from T3. Caller grep (`judgeOutput|VERDICT_RE`
over `scripts/` `evals/`): the three named callers only. Coordinator re-run: `tsc --noEmit` clean; the two test files 88 pass, 0 fail. Builder: full
`bun test` 587 pass, 0 fail. VPS at `5759a853`: on a clean tree, no warning and exit 0; with one untracked probe file, the warning line printed and exit 0.
The logged scope addition landed: `judgeBun` reads the last summary, with a two-order test.
- skip-table · T4: exit codes and verdict selection change; Other G (D2) → coordinator self-review at execute (no finding), the scoped review it owed ran at close (record corrected in place at close per L-176: the bulleted form was unreadable to `check-review-depth` and its `med`/`high` tokens are outside the vocabulary; every task is `behaviour:material` by the dispatch classifier, since each changes behaviour)
consequence · T4 · behaviour:material · governance:low

### 2026-10-29 | execute | T1 done -- the clinic repo enforces five invariants, its spec is complete, realism signed (TASK-535)
App `D:\Research\clinic-ab` `4eabb74..ac4ede3` (12 commits, test-first per rule), spec `D:\Research\clinic-ab-spec\spec.md`. Builder: sonnet, `/tdd`.
A1 confirmed: green at `4eabb74` before any change. Fresh clone: `go test -count=1 ./...`, `go vet`, web `npm ci`/`typecheck`/`lint`/`test`/`build` all exit 0
(builder-run). Coordinator check: commit order, a clean tree, the cluster stopped, the six headings, 5 `[not in code]` facts. The A3 bug is gone: working hours are
Asia/Jakarta wall-clock. Owner realism review: signed by popup.
Builder notes kept as facts: three tests passed on first run (already covered by earlier code: unknown patient via the FK backstop, cap-is-per-doctor,
cap-must-be-positive), each with a named edit that would fail it; the working-hours red commit carried one wrong case, fixed in its implementation commit.
- skip-table · T1: business rules in the external A/B repo, not shipped; tier X → read-through + owner realism review at execute, the scoped review it owed ran at close (record corrected in place at close per L-176: the bulleted form was unreadable to `check-review-depth` and its `med`/`high` tokens are outside the vocabulary; every task is `behaviour:material` by the dispatch classifier, since each changes behaviour)
consequence · T1 · behaviour:material · governance:low

### 2026-10-29 | execute | T2 done -- the D9 two-phase trial protocol on the fixture repo (TASK-542)
Worktree commits `e40d2509` (protocol + S7-S13) · `afe2d0dc` (smoke-a1 arm) · `7b56705d` (P6 + P4 rows) · `650adb4d` (synced-plugin clear, S14, `--only`)
· `49ac10e9` (P6 re-run row) · `412ce889` (review round, S15); merged `5b541121`; `c6503711` type-only fix after the merge. Builder: sonnet, `/tdd`.
Free checks 16 of 16 (coordinator re-run, worktree and main). P5: the real judge refused the out-of-scope rename and signed the control.
P6, first run: G2 signed, build passed 3/3 graders, row **invalid**: the CLI synced an account plugin (`codex`) into the isolated config between
phases, caught by the existing init check. Owner ruling (popup): fix in T2, re-run once. The harness now clears `plugins/synced` before every spawn
(no supported switch: `--bare` drops OAuth); S14 pins it.
P6 re-run: valid, G2 signed, then **parked** on a Bash permission denial in phase 2 (the model ran the graders itself under `acceptEdits`). This
is the protocol working, and a finding for TASK-544: under `acceptEdits` headless, a lean-flow arm parks on any Bash call, so the arm's permission
mode is a pre-registration decision. Pin: the smoke arm pins a clean clone at `%TEMP%\abp` (owner: keep, smoke-only).
- skip-table · T2: risk high, new measurement-harness behaviour; Other G, maintainer-only → one scoped sonnet review (record corrected in place at close per L-176: the bulleted form was unreadable to `check-review-depth` and its `med`/`high` tokens are outside the vocabulary; every task is `behaviour:material` by the dispatch classifier, since each changes behaviour)
consequence · T2 · behaviour:material · governance:low
review · T2 · scoped-reviewer · behaviour:material · governance:low
- review finding · T2 · round 1: 6 findings (2 CONFIRMED fail-open on the signing inputs: multi-path `Files:` entries passed `startsWith`; a two-object judge reply
  signed). Spec worst + Standards worst + a one-line `--protocol` guard went to one builder retry (`412ce889`). Re-review: all four CLOSED, no new fail-open.
  Routed to close as TD: the `docs/work/` + `.ab/` breach exemption is wider than the two harness files; a post-build manifest throw leaves no row.
- merge · T2 · the post-merge `merge-check` typecheck leg went red (9 `exactOptionalPropertyTypes` errors in `evals/ab/lib/`); the worktree builder had never run
  `tsc`. Coordinator applied a type-only fix inline (stated reason: mechanical, no behaviour change); tsc clean, 16/16, merge-check 4 green + 1 WIP skip, then clean.
  Second sighting this sprint of a builder skipping `tsc` (T3's VPS run caught the first) → Retro learning candidate.

### 2026-10-29 | system-verify | the integrated tree passes both declared stages off-host, at `054beacd`
Members closed (plain-git check; this repo has no `check-sprint-by-reference.ts`): TASK-535, 542, 531, 532 all in `docs/work/done/`.
`gate-remote.ts` (now running both stages, T3/T4): `bun test: 587 pass, 0 fail (rc 0)` · `qa-check: QA-CHECK: 329 pass, 0 fail (rc 0)` · exit 0.
D4 met: the close verify ran `bun test` through the tool itself, not by hand, the first close to do so (TD-279 is closed in practice).
run · 19 of 19 DoD ticked · terminal state PLAN_EXHAUSTED.

### 2026-10-29 | review | close-time scoped reviews owed by T1, T3 and T4, and the fix rounds the owner ruled
Found at close while reading `check-review-depth` before writing the Retro: the five consequence records above were bulleted prose
with `med`/`high` tokens, so the checker saw none of them, and by the dispatch classifier every task is `behaviour:material`. T1, T3 and
T4 had had only a self-review, which that check FAILs for material work. D2's default does not override the classifier. Records corrected in
place (L-176); the owed reviews ran rather than downgrading the class.
review · T3 · scoped-reviewer · behaviour:material · governance:low
review · T4 · scoped-reviewer · behaviour:material · governance:low
review · T1 · scoped-reviewer · behaviour:material · governance:low
- T3+T4 (one reviewer over the gate-remote diff since `a241c29e`): no fail-open path traced. CONFIRMED: the pin test checked each stage's declared text, never
  its command, so dropping `QA_FULL=1` stayed green; a bun-only failure printed the qa rc as `remote rc: 0`; a dead clause in the verdict guard.
  PLAUSIBLE: the last-verdict rule can trust a nested line when the real verdict never prints at rc 0 (owner kept it → TD-282).
  Owner ruling (popup): fix now. Commit `90c2be61` (T4's builder): the stage command is pinned to its declared text, the rc is labelled per stage
  (`qa-check rc:` / `bun test rc:`; T4's tick evidence quotes the earlier label, true when ticked), the dead clause is dropped. Coordinator re-run:
  tsc clean, 90 pass and 0 fail across the two files; builder's full `bun test` 589 pass, 0 fail.
- T1 (one reviewer over the clinic diff): zone, day and 24 h boundaries sound; conventions held. CONFIRMED: the daily cap can be exceeded by two
  concurrent bookings for different slots. PLAUSIBLE: chi's default 404/405 bodies skip the fault envelope the spec promises. Owner ruling (popup):
  fix both, test-first. Clinic repo `7ef8859` (red: a concurrent-booking test, cap 3 with 16 bookings, failing 5 of 5 before the fix; router
  envelope test) → `28aa247` (checks and insert in one transaction under a doctor row lock) → `aab2fa6` (404/405 through the envelope, two codes
  declared once). Spec updated. Fresh clone all exit 0 (builder-run); the coordinator checked the commit order, a clean tree and the cluster stopped.
- Close filings: TD-281 (T2 harness gaps routed by its capped review) · TD-282 (above) · L-262 new (builder briefs omit the typecheck, count 2) ·
  L-261 bumped to count 2 (the consequence records are its second sighting) · CHANGELOG [Unreleased] line for T2 · TASK-544 note on the arms'
  permission mode.
