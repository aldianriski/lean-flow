---
sprint: 088
slug: execution-autonomy-foundation
owner: Maintainer
last_updated: 2026-08-26
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-088 — Execution Log

> Append-only companion to [`../SPRINT-088-execution-autonomy-foundation.md`](../SPRINT-088-execution-autonomy-foundation.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-26 | progress | T1 `Cites:` corrected to clear a red gate carried since promote

`scripts/lib/check-layers-completeness.sh` (qa-check leg 14) FAILed T1: its prose references T2 and
T4, absent from both `Depends-on:` and `Cites:`. Substantively the checker's designed over-report
(TD-020 — T2 and T4 depend on T1, not the reverse), and the checker names its own remedy. Added
`· T2 · T4` to T1's existing `Cites:` line; the checker now reports 8/8 block-checks PASS, true
exit 0 (read from the gate's own verdict, not a piped status — L-120).

**Not a `scope-change`**: no scope, DoD, acceptance or `Layers:` moved — only a citation the checker
demands was declared. Owner-ruled before the edit.

**The finding that outlives the fix**: T1's block is byte-unchanged since `757b2a8`, so this gate has
been red since the Plan was locked. Promote froze a Plan over a FAIL nobody read — the L-120 shape,
at the promote step rather than the commit step.

**Classification note**: first written `governance:high`, corrected before commit. That conflated the
*finding* (a Plan frozen over an unread FAIL — governance-weighty) with the *change* (one citation
token in a sprint file). The skip table's governance axis is spec/STANDARD semantics · an
implementation-binding ADR · a workflow or protocol contract; a sprint `Cites:` line is none of the
three. Recorded here rather than silently, since the first value was caught by
`check-review-depth.sh` rather than by me.

consequence · T1 · behaviour:low · governance:low

### 2026-08-26 | progress | batch G1 + G2 signed for T1–T4 — `gates_signed: G1,G2 @ 1502e00`

Owner signed the batch gates in conversation; recorded in the sprint frontmatter, which is the only
place an unattended run reads (L-099 · L-151). Owner-action checklist item ticked.

**G1** — all four tasks are `origin: decomposer` / `state: ready`, so the fast-path applies. Sizes
M/M/S/M, no `L`. T3's `S` was re-derived rather than accepted: the mode-name surface is ~79
occurrences across 15 files, of which 45 of the 74 `night-run` hits are file paths, not the mode
name; `S` holds because aliases make the change additive.

**G2** — ownership map is **fully sequential**: zero disjoint task pairs. All four touch
`skills/orchestrator/SKILL.md`, `night-run.md` ×4, `.claude/CONTEXT.md` ×3,
`SPRINT.md.template` ×2. **No parallel worktree dispatch.** Order **T1 → T2 → T3 → T4** satisfies
every `Depends-on` and D1's declared CONTEXT.md commit order. Preflight: no dependency cycle,
`plan_commit 757b2a8` an ancestor of HEAD, working tree clean.

**Assumptions** — **A1 CONFIRMED** against `night-run.md` Part 0: its boundary table already encodes
mechanical / delegated / human, so T1 *declares* existing behaviour rather than inventing it. **A2**
correctly deferred to T3's own per-alias fixtures. **A3 premise dissolved** — the sprint was planned
as this repo's first parallel stream, but SPRINT-087 closed the same day, so one stream is active and
D2's cross-stream coordination is moot. Recorded, not silently absorbed; no scope moved.

**Reachability** — `check-verify-reaches.sh` reports **0 claimed targets, 16 judgment clauses**: not
one DoD names a mechanical method, though several describe one ("fails its schema check with a named
finding"). With D4 making every task Tier G, EXISTS/REACHES went unscreened across the whole Plan.
Owner ruled: resolve per-task at each task's own design step, so the naming is done by whoever has
just built the thing.

**Constraint carried into execution**: `skills/orchestrator/SKILL.md` is at 113 of ~140 lines and all
four tasks edit it. Additions must be net-tight or move to `references/` (ADR-006).

consequence · T1 · behaviour:low · governance:low

### 2026-08-26 | progress | T1 — J0/J1/J2 declared and guarded; 3 of 5 DoD ticked

**Shipped.** The authority classes now exist where a run can read them:
`night-run.md` Part 0 § Authority classes (the definition + derivation from the existing boundary
table) · `orchestrator/SKILL.md` § G2 (declared per task at the gate) · `SPRINT.md.template` (header
meta + the promote-time rule) · `.claude/CONTEXT.md` § Task entry shape (`authority:` field) ·
`scripts/lib/check-authority.sh` + `evals/run-authority-fixtures.sh` (new) · `scripts/qa-check.sh`
(leg 14-bis + the always-on harness list).

**A1 held under contact.** The three classes needed no new behaviour — every row of Part 0's boundary
table already sorted into one and none moved. What was missing was a place a run could *read* them.

**Two modelling calls, both resolved from the sprint's own text rather than by preference.**
(i) `J0` is **run bookkeeping** (Log append, DoD tick, Retro auto-file) and `J1` is **a Plan task the
approval covers** — settled by EPIC-015 § Closed-when 1 and T2's own title, which both say
*"already-authorized tasks"*, making the task the J1 unit. (ii) I first wrote that the J-class is
*orthogonal* to `HITL`/`AFK`; that is wrong and was corrected in all four files before commit. It is a
**one-way implication**: `J2` ⇒ `HITL` always, `HITL` ⇏ `J2`. Reading `HITL` as "therefore J2" would
make every attended sprint incapable of producing a J1, which is what makes the class look redundant.

**Tier G proof (D4).** The suite went green on its first run, which by CLAUDE.md's own bar shows
nothing — checker and fixtures written in one session agree by construction. So: two seeded breaks,
each verified landed by `cmp`, still parsing under `sh -n`, and targeted (103 lines and 5 verdict
`printf`s, both unchanged from pristine; 1 line modified). Seed A — an undeclared class silently
defaults to J0, the design this guard exists to reject — reddened **exactly** the 2 declaration cases.
Seed B — the honoured half inverted — reddened **exactly** the 2 J2 cases. **Disjoint case sets**, so
each half is proven independently and neither is a demolition. Hash convention, stated and used for
every figure: `sha256sum` over the raw working file — pristine `678e5cdf00ba8b84`, restored
`678e5cdf00ba8b84`, `cmp` byte-identical, suite green after restore.

**Two guard failures worth recording, because both were caught by the protocol and not by care.**
The *first* Seed A never applied — `cmp` reported the file byte-identical while the suite ran green.
That is L-137 exactly: an unapplied patch is indistinguishable from a discriminating suite. The first
Seed B *did* apply but produced garbage (awk's `&` expanded to the whole match) — and `cmp`, the line
count **and** the verdict-`printf` count all accepted it. Only `sh -n` rejected it. Each guard in the
L-142 stack caught something a sibling guard missed, which is the argument for keeping all of them.

**DoD 2 and 3 are NOT ticked, and the reason is structural, not effort.** Both require *a real
unattended run inside the approved envelope* — and the envelope is **T4's** deliverable. The declared
`Depends-on` graph is acyclic; the *criteria* graph is not. This is L-111 (a criterion is reachable
only after the decisions it rests on are taken) landing on the very task that cites it. Resolution,
which moves no scope and needs no Plan edit: build the declaration now, and tick DoD 2 + 3 after T4
via **one** real run that serves T1's two criteria and T4's third together. Flagged here so a later
reader does not read two unticked boxes as unattempted work.

**Reachability, per the G2 ruling.** DoD 1's clause named "its schema check" without identifying one;
that method is now `scripts/lib/check-authority.sh` and is recorded in the tick evidence rather than
by rewriting a frozen criterion.

consequence · T1 · behaviour:material · governance:high

### 2026-08-26 | surprise | T1 — wiring the guard exposed a scope defect in the guard itself

**Correcting the entry above, not editing it.** Its evidence block (pristine `678e5cdf00ba8b84`, 103
lines, two seeds) described the checker as it stood then. The checker has since changed, so those
figures no longer reproduce and are superseded by the block below. An unreproducible proof of
reproducibility is worse than none, because it looks checkable (L-169).

**What the wiring found.** `check-authority.sh` fires correctly end-to-end — `PASS eval harness
run-authority-fixtures.sh`, and leg 14-bis emitted a real finding on the first gate run after wiring
(L-020 satisfied: it fires, it is not merely present). The finding was against **SPRINT-087**, which
closed before the J-class existed. Enforcing a promote/G2-time declaration on a sprint whose promote
and G2 are both behind it emits a finding nobody can clear — precisely what §14 forbids, and the
ruling the gates-signed family had already made for `docs/sprint/archive/`. My checker's scope was
simply wrong, and **only wiring it into the gate revealed that**: every fixture passed, because I had
written fixtures for the cases I was thinking about. L-166's own lesson, arriving on the task that
cites L-166.

**Fix:** a sprint with frontmatter `status: closed` is skipped, and the skip is an *unlabelled note* —
never a PASS — so it cannot be counted as a verified task-check (TD-042's zero-verified discipline).
Real tree now: SPRINT-087 skipped, SPRINT-088's four tasks declared, exit 0.

**Re-proof after the change — hash convention stated once and used for every figure here:
`sha256sum` over the raw working-tree file.** Pristine `8ee7106d7acbbe1e`, 116 lines, 5 verdict
`printf`s. Three seeds, each verified landed by `cmp`, still parsing under `sh -n`, and targeted
(116/116 lines, 5/5 printfs, one line modified in each):

| Seed | The rejected design it restores | Cases reddened |
|---|---|---|
| A | an undeclared class silently defaults to J0 | 3 — `undeclared-is-refused` · `undeclared-discriminates` · `active-still-enforced` |
| B | the honoured half inverted (a J2 that ran is accepted) | 2 — `j2-executed-is-refused` · `j2-executed-discriminates` |
| C | the closed-sprint scoping rule removed | 1 — `closed-is-out-of-scope` |

**Disjoint sets, and the three controls** (`all-classes-accepted` · `j2-held-is-accepted` ·
`no-log-is-not-an-honoured-verdict`) **stayed green under all three** — so each half is proven
independently and none of the three is a demolition. Restored `8ee7106d7acbbe1e`, `cmp`
byte-identical, suite 9 of 9 green.

**The generalisable bit:** a guard's *scope* is not exercised by its fixtures, because the fixture
author picks the scope. Only pointing it at the real corpus does. The retained fixture
`closed-out-of-scope/` exists now so the next person does not have to rediscover it from a gate run.

consequence · T1 · behaviour:material · governance:high

### 2026-08-26 | progress | T2 — the continuation contract and five terminal states; 1 of 3 DoD

**Shipped.** `night-run.md` **Part 0b** (new — the contract: no pause between already-authorized
tasks, and the five terminal states with their morning actions) · Part 4 (the `terminal · <STATE> ·
<reason>` line in the rollup block) · `orchestrator/SKILL.md` step 4 · `.claude/CONTEXT.md` § Modes ·
`scripts/night-run.sh` `reap()` (derives and emits the state) · `check-night-run-rollup.sh` +
`run-night-run-rollup-fixtures.sh` (5 → 9 assertions).

**Part 0b is separate from Part 0 on purpose.** They guard different failures: Part 0 says what a run
may *do*, Part 0b says when it may *stop*. A run can respect every authority boundary and still halt
after task one — obeying Part 0 perfectly and wasting the night.

**The derivation order in `reap()` is load-bearing and is documented as such.** non-zero exit →
`HARD_FAILURE`; any `unattempted` → `BUDGET_STOP` (Part 4 already defines `unattempted` as "just an
exhausted turn", and a turn ceiling is a budget) ranked **above** parks, because if tasks were never
reached the run was not bounded by authority whatever else happened; any `parked-hitl` →
`AUTHORITY_BOUNDARY`; otherwise `PLAN_EXHAUSTED`. The exit code needed no new parameter — the wrapper
already writes it to `$logfile.exit` before invoking the reaper.

**`USER_STOP` is named as out-of-scope for the reaper rather than left silently unemitted.** An
external kill never reaches that code path; it is `die_doa()`'s to report. A state named in the
contract that nothing can ever produce is L-166's shape, so the gap is written down where the reader
of the derivation will hit it.

**Scope checked BEFORE writing this time**, which is T1's lesson applied rather than re-learned: all
four Execution Logs carrying a `run-complete` entry live under `docs/sprint/archive/logs/`, which the
checker already skips by path — so the new requirement reddens **no live artifact**. That also means
its motivating case is not in the corpus yet: the real artifact is **this run's own terminal rollup**,
written after T4. Stated rather than claimed as satisfied.

**Tier G proof (D4).** Two seeds, each landed (`cmp`), parsing (`sh -n`), targeted (73/73 lines, 3/3
verdict calls, 1 line changed): D (terminal requirement removed) reddened 2 cases; E (state token no
longer validated, shape only) reddened 1 — **a strict subset**, which is the interesting result: the
nesting shows the token assertion does independent work rather than duplicating the presence check.
Controls green throughout. Convention: `sha256sum` over the raw working file — pristine
`5497faa8bc5ebf62`, restored `5497faa8bc5ebf62`, `cmp` byte-identical.

**A second-order guard, added because adding a required field to a shared checker is quietly
destructive:** every pre-existing must-FAIL fixture (`missing-rollup`, `missing-calibration`) would
now fail for *two* reasons, at which point neither isolates the failure it is named for. Both were
given a valid `terminal ·` line, and two new assertions (`*-stays-isolated`) fail if that ever rots
back. A suite where every case fails for every reason discriminates nothing.

**DoD 1 and 2 are not ticked yet** — both say *"exercised on a real run"*, and the honest real
artifact is this sprint's own run-complete rollup, which does not exist until the Plan is exhausted.
They tick together with T1's DoD 2/3 after T4.

consequence · T2 · behaviour:material · governance:high
