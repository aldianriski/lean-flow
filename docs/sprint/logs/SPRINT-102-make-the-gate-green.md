---
sprint: 102
slug: make-the-gate-green
owner: Maintainer
last_updated: 2026-09-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-102 — Execution Log

> Append-only companion to [`../SPRINT-102-make-the-gate-green.md`](../SPRINT-102-make-the-gate-green.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a
> new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-16 | promote | Plan locked at `ef02be0`; 4 tasks, 18 DoD

Promoted from the 2026-09-16 `/triage` governance pass. `TASK-349` · `TASK-353` · `TASK-352` ·
`TASK-351`. No `epic:` — gate work, following SPRINT-099's precedent rather than SPRINT-101's
(D1). The unattended run is **not** attempted here (D2).

### 2026-09-16 | scope-change | T4 `Layers:` corrected — two directory prefixes claimed in error

**What broke.** T4's `Layers:` was written at promote as `` `packages/`/`scripts/` `check-dod-delta.ts` ``.
Parsed, that yields the tokens `packages/` and `scripts/` — and a declared token ending in `/` is a
**directory prefix covering every path beneath it** (`check-layers-completeness.sh`, SPRINT-055). So
T4 was claiming ownership of the entire `packages/` and `scripts/` trees, including
`scripts/qa-check.sh` and `scripts/night-run.sh` — **both of which T1 owns**. The dispatch preflight
derives its shared-file ownership map from `Layers:`, so this would have reported T1/T4 as
contending for the gate scripts and forced them sequential for no reason.

**Impact.** No work was done under the wrong declaration — caught at G2, before the first task.
The real path is `scripts/lib/check-dod-delta.ts` (derived via `git ls-files`, and `attributeClaim`
confirmed to live there). `evals/dod-delta.test.ts` is added: T4 extends the suite, and the promote
declaration omitted it.

**Corrected to:** `scripts/lib/check-dod-delta.ts` · `evals/dod-delta.test.ts` · `evals/fixtures/dod-delta/`

**Re-confirm G2.** Logged under **L-100** — `Layers:` is a live declaration corrected per task, not a
frozen prediction to defend. The correction *narrows* T4's blast radius and removes a false overlap;
it does not change what T4 does, so § Scope is untouched and no acceptance criterion moves.

### 2026-09-16 | surprise | the G2 reachability pre-screen passed without examining anything

`sh scripts/lib/check-verify-reaches.sh docs/sprint/SPRINT-102-make-the-gate-green.md` returns
`PASS … (0 claimed target(s) confirmed reachable, 4 judgment-method clause(s) left to G2)`.

**Zero targets confirmed.** Every `*Verify:*` clause in this Plan fell through as a judgment method,
so the pre-screen asserted nothing about any of them and still printed PASS. That is the L-136 shape
the gate exists to catch, arriving in the instrument itself: a green line that says nothing about its
subject. Recorded rather than treated as a pass — **RUNS and PROVES are entirely the coordinator's at
G2 for all four tasks**, and the pre-screen is not evidence for any of them.

### 2026-09-16 | progress | G1 + G2 signed by the owner; D6 and D7 taken

**G1 (batch, full checklist — no task carries `origin: decomposer`, so no fast-path):** goal ·
size (M/S/S/S, no `L`) · files (`check-layers-completeness` 8 PASS / 0 FAIL) · out-of-scope ·
assumptions — all confirmed. A1/A2/A3 stay unconfirmed **by design**, each with a confirm-at-execution
method named in its own task; surfaced at the grill rather than waved through.

**G2 (batch):** ownership map derived from `Layers:` with prefix awareness — **T2's
`evals/fixtures/` covers T4's `evals/fixtures/dod-delta/`**, so T2 owns it and commit order is
T2 → T4 (T4 already `Depends-on: T2`). The coordinator owns the sprint file and this Log; no task is
assigned them. An exact-token overlap query found nothing and was **wrong** — the governing rule is
directory-prefix containment, and only re-running with a prefix test surfaced the real overlap
(L-198: the second query must vary the SELECTION, not the direction).

**Owner decisions:** D6 — mode-aware ceiling in `qa-check.sh`, launch path not restructured.
D7 — the ruling earns an ADR, because it reverses TD-117's recorded direction.

**Review skip-table lookup (TD-092 — recorded at consultation, not at outcome):**
- `consequence · T1 · behaviour: none (a ruling + a threshold) · governance: HIGH (reverses a recorded TD ruling; ships an ADR)` → scoped `sonnet` reviewer, governance axis
- `consequence · T2 · behaviour: HIGH (restores 156 assertions to the gate) · governance: low` → Tier G ⇒ outside reviewer, **worktree-isolated** (L-165 · L-168)
- `consequence · T3 · behaviour: none (prose) · governance: HIGH (a launch precondition three sprints misread)` → scoped `sonnet` reviewer, governance axis
- `consequence · T4 · behaviour: MED (a new FAIL arm) · governance: MED` → Tier G ⇒ outside reviewer, **worktree-isolated**

**Dispatch plan:** T1 stays with the coordinator (decision tier, owner rulings). T2 ∥ T3 dispatch in
parallel, worktree-isolated, disjoint. T4 follows T2.

### 2026-09-16 | surprise | T3 was already satisfied before it was dispatched — a planning defect, not a win

T3 returned **no edit needed**, working tree clean. Every one of its four DoD items was already true
when the Plan froze. Verified independently by the coordinator rather than accepted on the agent's
report:

- **DoD 1–2 (the live copies).** The `TASK-319` row's criterion was corrected at the **2026-09-16
  `/triage`**, which landed in `ef02be0` — *the plan-locked commit itself*. So the coordinator fixed
  the defect at triage **and then filed `TASK-352` to fix it**, promoted that task as T3, and
  dispatched an agent to do work that was already in the commit the agent checked out. The remaining
  `not all-J2` hits are all legitimate: SPRINT-102 describing the defect, `TECH-DEBT.md:334` (TD-164)
  recording it historically, `TODO.md` quoting it in contrast to the STRICT form.
- **DoD 3 (`gates_signed:`).** Pre-flight item 4 has required it since `3a1cfc1` — **SPRINT-057 T5**,
  roughly 45 sprints ago. The criterion could not have failed at any point in this sprint.
- **DoD 4 (TD-164).** Filed by the coordinator at the same `/triage`, hours earlier.

**Why this matters more than the wasted dispatch.** Three of four criteria were **unfalsifiable at
freeze** — not unreachable in L-136's sense (no check was mis-scoped), but *already satisfied*, which
presents identically: the box ticks, the evidence is real, and the task demonstrated nothing. L-111
asks whether a criterion is reachable *after* the decisions it rests on; this is its mirror — **is
the criterion still capable of failing at the moment it is frozen?** A DoD written against a defect
you fixed on the way to writing it is a green box that proves only that you already knew.

The tell was available at promote and was not looked for: `TASK-352`'s own `touches:` line said
*"`TODO.md` (TASK-319 row — **corrected at this triage**, verify it stuck)"*. It said so plainly.

**Not reverted.** T3's four boxes are ticked with evidence naming what actually satisfied them and
when — an honest record beats a vacant one. The dispatch also bought one real thing: an independent
sweep confirming the live population is genuinely clean, which was `A3`'s **UNCONFIRMED** assumption
and is now confirmed. A3 is discharged.

**Brief defect, reported not absorbed.** The brief told the agent to expect
`grep -c '^- \[ \] TASK-' TODO.md` = **14**; it is **15**. The coordinator counted before filing
`TASK-353` and then froze the stale number into a dispatch brief — L-130's shape (a figure entering a
frozen artifact is a query result) at the brief grain. The agent flagged it rather than reconciling
it silently, which is the behaviour the brief asked for and the reason it was caught.

### 2026-09-16 | progress | T2 merged and independently re-verified; TD-165 filed for the retained-fixture gap

**Fix.** One `sed 's/\x1b\[[0-9;]*m//g'` before each existing `grep`, in all three harnesses. The
count floor is untouched. Population re-derived by two differently-routed queries (parse-shape grep ·
`bun test`-invocation grep): 4 hits reconciled to 3 — `qa-check.sh`'s two were comment prose, not
code. Matches the declared `Layers:`; no widening, nothing to correct.

**Coordinator verification, run independently rather than accepted on the report** (one hash
convention: `git hash-object <path>` vs `git rev-parse HEAD:<path>`):
- green path — `run-dod-delta` **48 tests**, `run-s4-ts-evaluators` **87 tests**
- seeded `test(` → `test.skip(`: 569 lines unchanged, 72 `expect(` unchanged (a skip, not a
  demolition), hash moved — the seed landed and was *targeted*
- **discriminates** — `FAIL … only 47 test(s) ran`. The **real** count, not the old stuck-at-0. That
  is the evidence that matters: it proves the fix works on a *red* run, not only a green one
- sibling control `run-s4-ts-evaluators` stayed green in the same pass
- restore verified byte-identical to the HEAD blob

**Merge-back hazard, caught before it landed.** `git diff main worktree-…` showed the worktree would
**revert T3's four ticks and delete 37 lines of this Log** — not because the agent touched them (it
did not; the brief forbade it and it complied) but because its branch base predates those commits. A
blanket merge would have silently undone coordinator-owned work while reporting success. Merged the
three harness files by path instead (L-042).

**TD-165 filed** — the retained must-FAIL fixture bar was met by a *live* seed-and-revert, not a
persisted artifact. The builder flagged this itself rather than presenting live proof as satisfying
the bar. Accepted as a judgement, not waved: the alternatives are a permanently-broken shipped test
or new `.sh` scaffolding against the standing no-new-shell rule, and repo precedent exists
(`run-s4-ts-evaluators.sh`'s header documents the same live proof from SPRINT-092). The residual risk
is real and named in the row: a revert of the one `sed` is undetectable until someone reads a count.

### 2026-09-16 | progress | T2 Tier G outside review: CLEAR, with one coverage gap it closed itself

Dispatched worktree-isolated per L-165/L-168. Verdict **CLEAR** — no defects in `f650e57`. Every
check was executed against real Bun 1.3.14 output, not reasoned about.

**The review's own catch, and it is a real one.** The coordinator's verification block named only
`run-dod-delta-fixtures.sh` (green + seeded red) and `run-s4-ts-evaluators.sh` (green + sibling
control). **`run-s4-differential-parity.sh` — the third file in the diff — had never been exercised
RED by anyone.** The reviewer seeded the same class of break into a row-driven loop generating 11 of
its 21 cases and got `FAIL … only 10 test(s) ran, expected at least 21` — the real reduced count,
not a stuck 0 — then restored and verified byte-identical under the same stated convention. This is
**L-186 at the verification grain**: the fixtures proved the branch, and two of three *members* were
exercised while the third was assumed to behave like its siblings. Nobody inside the change could see
it; it took the independent pass, which is exactly L-165's claim.

**Attempts to defeat the guard, all failed correctly** (import crash · `-t` filter matching zero ·
zero-test file · `process.exit(7)` mid-run · `test.todo`): each either hits the `$code -ne 0` branch
before `n_pass` is consulted, or falls back to 0 via the existing guard. `todo` counts print on a
separate line and are correctly excluded rather than inflating the count. No shrinkage scenario
produced a plausible-but-wrong non-zero count.

**Portability question, raised PLAUSIBLE and now CLOSED.** `\x1b` in a `sed` pattern is a GNU
extension; on BSD/macOS sed it would be taken literally, making the strip a silent no-op and
**resurrecting the exact original bug**. The reviewer could not test another userland and correctly
flagged it as a question rather than a defect. Closed by measurement: **75 of 89 shell scripts in
`scripts/` + `evals/` already use GNU `\x` hex escapes** (705 occurrences), plus GNU-form `sed -i` in
four. There is no CI matrix and no declared macOS/BSD support. GNU userland is therefore a pervasive
pre-existing dependency and T2 adds **no new** portability risk. A POSIX form
(`[[:cntrl:]]\[[0-9;]*m`) was validated as an equivalent drop-in should the repo ever need it — but
changing one line of 705 would be theatre, not portability. **Not changed; recorded.**

**Out of scope, noticed and passed on:** two zero-byte files at repo root — `**Outcome:**` and `get`
— present before this sprint and unrelated to it. Named here so the next reader does not have to
rediscover them.

### 2026-09-16 | surprise | T4's Tier G review found a fix for silent exemption that REINTRODUCED silent exemption

Outside review (worktree-isolated, L-168) returned **NOT CLEAR**. One CONFIRMED defect, reproduced by
the coordinator against the merged code before any action was taken:

```
"sprint(099) T5 untick T2 false DoD test"        => unscoped          WRONG
"sprint(100) T3 add t9 predictive text support"  => unscoped          WRONG  (t9, via /i)
"sprint(103) T7 landing page copy tweak"         => unmatched-shape   correct control
```

Both wrong cases name a task unambiguously at the head, claim no second task, carry no adjacent `+` —
and fell back to `unscoped` **silently** (`ok: true`, no finding) purely because their prose contained
a `T<digit>`-shaped substring.

**Root cause.** Rule 7's exclusion claimed to mirror Rule 5's "qualifier names a SECOND task" refusal.
It was strictly broader on two axes: Rule 5 scans a **constrained capture** (`[A-Za-z][A-Za-z0-9 ]*`
terminated by `:`) case-**sensitively**; Rule 7 scanned **arbitrary free text** to any `:`/`.`
case-**insensitively**.

**Why no instrument caught it.** Every Tier G proof passed *before* the review: 54/54 green, `tsc`
clean, retained must-FAIL + sibling control drawn from real history, a seeded break reddening exactly
the right two cases, a byte-identical restore, and a full-history scan finding exactly one hit —
which the coordinator had re-derived independently. The defect is invisible to all of them because
each instrument sits **inside the shape the author wrote**; the reviewer had to *invent subjects that
do not exist yet* to expose it. **L-186 one level in:** fixtures test the branch, and the branch was
wrong in a direction no fixture drawn from current history could reach. It is a live landmine, not a
current miscount — no subject in today's history takes the swallow path.

**Fourth consecutive defect found by an independent pass and none by recalling the rule (L-165).**

### 2026-09-16 | progress | T4 retry merged and re-verified; 61 tests, history count still 1

Sent back to the builder as the **bounded revise-loop retry** rather than patched by the coordinator,
keeping author and reviewer separate — the only thing that has actually been catching these.

Fix: the exclusion now mirrors Rule 5's shape exactly — a `\s+`-then-letter-led clause terminated by
`:`, tested case-**sensitively**. No colon ⇒ no qualifier ⇒ flags unconditionally, whatever the prose
contains.

**Coordinator re-verification, run independently:** all six specified cases classify as designed
(2 defects fixed, motivating case and T7 control preserved, both deliberate refusals still excluded);
`bun` over `git log --all` → **1269 subjects scanned, exactly 1 `unmatched-shape` hit**, still
`sprint(094) T4 + record fix: …`. The narrowed predicate neither over-flags nor was tuned to hide
anything — the bar the retry brief set. 61 tests green, `tsc --noEmit` clean, `min_tests` 54 → 61.

### 2026-09-16 | progress | T1 ruled, implemented and merged — ADR-042; Plan exhausted at 17 [x] + 1 [~]

**The ruling.** ADR-042: the command ceiling is a property of the **invocation mode**, not of the run.
Two falsifications carry it, both measured at this sprint (`qa-gate-timing.md` § Round 15):

1. **The limit is external to a FOREGROUND call, not to the host.** Two detached full-profile runs
   completed at **1263 s** and **1370 s** — 2.1× and 2.3× the ceiling — ran every harness, truncated
   nothing, printed their own verdicts. TD-117's *"raising the budget cannot work, the 600 s ceiling
   being external"* was right about the constraint it measured and wrong about its **scope**. Four
   sprints of direction rested on the wider reading.
2. **The assertion was unfalsifiable in the direction it claimed.** `qa_ceiling_check` runs at
   `:1460`, the verdict prints at `:1480`. A killed run reaches neither — so the FAIL branch fired
   only in runs that were *not* killed, while its message read *"a run past the ceiling is killed from
   outside with no verdict line."* Printed, in full, by the run it said could not speak.

**Implementation** (dispatched; the ruling was the coordinator's, the code was not): the branch calls
a new `qa_ceiling_info_line` and prints an **uncounted INFO** naming the elapsed figure, the
not-killed fact and the foreground caveat. `QA_CEILING_SECONDS` keeps its 600 s default;
`night-run.sh` untouched, per ADR-042's rejection of re-plumbing the launch path (L-045/L-120).

**Re-tiered to G during execution**, as its own DoD anticipated — a gate leg whose false negative is
silent. Bar cleared: three retained fixtures in `run-qa-budget-fixtures.sh`; case 12 **extracts the
real shipped case-statement** (sed between its own anchors, not a hand copy) and runs it at Round
15's measured 1263 s → `pass=0 fail=0`; case 13 is the in-ceiling sibling, green in the same run;
seeded break (reverting the arm to `bad`) reddened 12 while 13 stayed green, line count unchanged,
`sh -n` parsing, restore byte-identical under one stated convention.

**The trade-off is recorded, not smoothed.** A genuinely too-slow gate now reports INFO where it
reported FAIL. TD-117's own words — *"cheaper still to learn to ignore, which is how a guard dies"* —
apply to the line this change creates. The cost pressure the red gate applied is real pressure given
up, and ADR-042 says so under Negative.

**`Layers:` corrected again (L-100)** — the promote declaration said `possibly an ADR` and omitted the
lib, fixture and index files the ruling turned out to touch. Third `Layers:` correction this sprint;
each was the declaration meeting the work, which is the cost of declaring first.

**Plan exhausted:** 17 DoD `[x]`, 1 `[~]` (T2's retained fixture, TD-165). System-verify running.
