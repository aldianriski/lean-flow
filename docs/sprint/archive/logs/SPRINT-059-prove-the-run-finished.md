---
sprint: 059
slug: prove-the-run-finished
owner: Maintainer
last_updated: 2026-08-10
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-059 — Execution Log

> Append-only companion to [`../SPRINT-059-prove-the-run-finished.md`](../SPRINT-059-prove-the-run-finished.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a
> new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-10 | promote | Plan locked; preflight corrected the wave map

Five P1 tasks promoted (TASK-183→187 → T1–T5), closing findings 10–12 of the first-unattended-run
field report. Findings 1–9 were verified closed at 1.32.0 by reading night-run.md Parts 0–4 and the
v1.31.0 CHANGELOG block — not inferred from the version number.

The pre-dispatch preflight found something the Plan's `Depends-on:` does not show: **T5 has no
dependency but shares `night-run.md` with T1**, so it cannot wave-1 parallel. Dependency and file
overlap are different constraints and only one of them is written in the task header. Corrected waves:
T1 alone → then T3 (disjoint) alongside the serial chain T2 → T4 → T5.

### 2026-08-10 | progress | T1 — the rollup speaks at every exit, and `unattempted` has a name

Part 4 rewritten so the rollup block is emitted at **every** exit, headed by `run · N of M DoD ticked`,
with `unattempted` added to the state vocabulary and distinguished from the two states it is easiest to
confuse it with: `parked-hitl` and `denied-tool` were both *reached*, `unattempted` never was. Part 2's
trigger gained the continue-until-exhausted clause, and — this is the load-bearing half — an explicit
statement of how far that clause reaches, because the field report measured its limit rather than
guessing at it. Wired into `sprint-bulk` steps 4 and 5.

**The trace this DoD asked for — run 1's real outcome, before and after.**

Run 1 ended having landed 4 of 7 units. Every commit was correct, every one reviewed, the tree clean.
The harness result carried `subtype: success`, `stop_reason: end_turn`, no error. Three tasks were
never started.

*What the morning reader saw then:* nothing. Part 4 as written produced one line per **non-green**
task, and a run that never reached a blocker has no non-green task to report — the three unstarted
units were not blocked, not parked, not denied, not stalled. There was no state for "never began", so
they generated no line. The reader followed Part 4's own instruction, read the Execution Log rollup,
and found a clean page. The shortfall was discoverable only by counting DoD boxes by hand.

*What the same run emits now:*

```
run · 4 of 7 DoD ticked
T5 · unattempted · run ended before this task was started — re-fire; the Plan is unchanged
T6 · unattempted · run ended before this task was started — re-fire; the Plan is unchanged
T7 · unattempted · run ended before this task was started — re-fire; the Plan is unchanged
```

The header line alone is sufficient — `4 of 7` is legible without reading a single task line, which
matters because the failure mode being fixed is a reader who stops early on a page that looks fine.

**Finding recorded rather than silently skipped.** T1's last DoD item was written conditionally: the
CONTEXT § Gates unattended block agrees *if it quotes the states*. It does not quote them — the
apparent grep match was `in-stalled` inside the word "installed", which is worth writing down because
it is exactly the kind of substring hit that would have justified an unnecessary edit. So the item is
vacuously satisfied and CONTEXT.md is untouched. That is also the right outcome on a second axis:
CONTEXT is at 129/130 lines and TASK-182 exists to give it headroom, so an edit here would have spent
the last line of a file already flagged as over-full, to restate a Part 4 mechanism that the SSOT has
no reason to carry. The contract belongs in CONTEXT; the reporting format belongs in Part 4.

### 2026-08-10 | progress | T2 — the rollup is emitted by the wrapper, not asked for

`scripts/night-run.sh` gained a reaper: re-entrant `--reap`, invoked from inside the same wrapper that
already captures the fired command's exit code, so it runs on every exit — clean, early or bad. It
counts the sprint's DoD boxes, lifts the cost figures off the log's last `result` event, and appends
the Part 4 block. `--no-reap` opts out; it fires only for a `sprint-bulk` run. ADR-016 records the
decision and its cost — this reaches only consumers who use the launcher, which is not mitigated,
only bounded and stated.

**Exercised on a real run, and the exercise earned its keep.** A genuine `claude -p ... --output-format
stream-json` run produced a real `result` event ($0.224166, 1 turn); the reaper ran against a scratch
copy of the sprint layout so nothing touched the live log. It found **two defects that reading would
not have**:

1. **A task went missing from the rollup.** The check for "did the run already write a line for this
   task?" grepped the *whole* Execution Log — and T1's entry above contains a worked example of the
   format, including `T5 · unattempted · …` at line start. The reaper read documentation prose as this
   run's output and silently dropped T5. Fixed by scoping the search to what *this run* appended, via
   a line-count baseline the launcher records before firing. The bug is the protocol's own subject
   matter: a guard reading the wrong window fails exactly like one that is absent.
2. **`units` was reporting DoD boxes.** The calibration series reads "4 of 7 units" and means *tasks*;
   the first draft emitted `5 of 26 units`, which would have silently rescaled every existing row.
   Units are now Plan tasks, a task counting as delivered when its block has no open box left — and
   the distinction is now stated in Part 4 so the next writer cannot make the same substitution.

Post-fix output on the same real log: `run · 5 of 26 DoD ticked`, all four unattempted tasks listed,
`run · $0.224166 · 1 turns · 6 min · 1 of 5 units · inline`.

**`Layers:` corrected (L-100).** T2's declaration named `docs/adr/ADR-016-<slug>.md` — a placeholder
written at promote, when the slug did not exist. Corrected to the real filename, plus
`docs/knowledge-index.md`, which is regenerated whenever a metadata-carrying doc is added. Declaring
before the work means the declaration gets corrected by the work; that is the expected cost, not a
scope change. Caught by `check-layers-observed.sh`, not by me.

### 2026-08-10 | progress | T3 — the rollup is now gated, not merely emitted

`check-night-run-rollup.sh` + `run-night-run-rollup-fixtures.sh` + four retained fixtures, following
the existing checker/fixture-runner convention. Two separately-named findings (missing DoD header ·
missing calibration row), each asserted on by name rather than on exit status alone (L-058). The
fourth fixture is the load-bearing non-failure: a mid-flight sprint has no `complete` entry, and a
checker that fired there would paint every live sprint red and be switched off within a week.

**Cost, stated because TD-046/TASK-180 is measuring exactly this:** harness 940 ms, inline check
122 ms on the live logs. Full gate 173 s wall on this host.

**Two guards caught this task, and one of them was worth more than the code.**

1. **The corpus-metadata check rejected an invented vocabulary.** ADR-016 was filed with
   `tags: [tooling, night-run]` / `domain: night-run`; neither exists in `gen-index.sh`'s vocab. The
   right fix was to use the small existing vocab (`tooling, process` / `skills`), not to widen it for
   one document — vocab sprawl is how an index stops being navigable.
2. **The ADR-014 glob guard refused a second sprint pattern in `qa-check.sh`.** The new section
   globbed `docs/sprint/logs/SPRINT-*.md`, and `run-sprint-log-layout-fixtures.sh` case 1 requires
   this file to carry *exactly one* sprint pattern, the non-recursive one. The guard could not tell a
   legitimate logs glob from the widening it exists to prevent — and rather than weaken it, each log
   is now **derived from its already-globbed Plan** (`docs/sprint/logs/$(basename "$sp")`). That is
   the better design independently of the guard: the Plan and its log are one record (§11), and
   deriving means they cannot drift apart. A guard that forced a better implementation rather than
   merely permitting a worse one is the argument for keeping guards narrow and loud.

`Layers:` corrected again (L-100) — the promote-time declaration used `check-*.sh (new)` placeholders.
Gate 140 pass, 0 fail.

### 2026-08-10 | progress | T4 — a park the run itself unblocks is now re-checked

Part 0's park protocol gained step 4: at each task boundary, walk the open parks; if a park's unblock
condition names a task that has since completed, it is actionable *now*. Still not actionable at exit
→ a rollup line rather than silence. Unattended only (A2) — an interactive run halts at the first
blocker with a human present, which is the whole difference. Wired into `sprint-bulk` step 5.
`assert-park-revisit.sh` + a retained fixture pair + `selftest-assert-park-revisit.sh` in the opt-in
harness list, encoding the field report's real case: a field parked for the renderer, the renderer
owned later in the same run, nobody going back.

**The must-FAIL fixture earned its existence twice over — the assertion's first draft was broken in
two independent ways, and a green run would have hidden both.**

1. **It could only ever exit 0.** The loop was fed by a pipe, so every `fail=1` was set in a subshell
   and discarded. A checker that cannot fail is worse than no checker, because it reports.
2. **Then it passed the violation.** With the exit code fixed, the must-FAIL fixture still came back
   green: the revisit was detected by grepping the whole log for `revisit|resolved|…`, and the
   fixture's own slug was `unrevisited`. The word it searched for was in the fixture's name. Replaced
   with a structural contract — a later line for the same task reaching `done`, or one explicitly
   saying it stayed blocked — and the fixtures renamed so no fixture name contains a matched token.

That is the same substring family as `in-stalled` matching "installed" in T1, twice in one sprint.
Worth carrying forward: a contract is a line in a known shape, never a word appearing somewhere.

**A latent bug fell out of it.** `grep -c … || printf 0` prints `0` *and* exits 1, so the fallback
appended a second zero and arithmetic broke. Harmless in every test so far only because every sprint
tested had ≥1 ticked box. Fixed in both the reaper and the assertion, and regression-tested against a
sprint with zero ticked boxes: `run · 0 of 1 DoD ticked`, `cost unavailable`, degrade rule honoured.

**Attribution caught a cross-task edit.** `check-layers-observed.sh` flagged that the T3 commit
changed ADR-016, which T2 had declared. True: T3's gate run surfaced the ADR's invented tag/domain
vocab, and fixing it was T3's work. Declared where the work happened rather than argued away.
Gate 140 pass, 0 fail (144 with QA_FULL=1).

### 2026-08-10 | progress | T5 — the consumer's two runs join the calibration series

Both rows added ($23.04 / 178 turns / 64 min / 4 of 7 · $18.26 / 140 turns / 45 min / 3 of 3, both
inline), with three caveats attached rather than a bare per-unit figure. The $5.90/unit comparison
against the table's $8.27 and $5.42 is **loose** — those are two-unit dispatched runs on a lighter
repo; these are seven- and three-unit inline ones on a host that is not ours. What does transfer is
zero denials across 318 turns after $1.77 of probing, against a predecessor that lost ~40% of turns
to denials.

`Layers:` corrected a third time (L-100) — T4's `grep -c` fix touched `night-run.sh`, declared under
T2. Three corrections in five tasks is worth carrying to the Retro: the promote-time declaration is
reliably wrong in one specific way, which is that a *fix* surfaces in whichever task's gate run
exposes it, not in the task that owns the file.

### 2026-08-10 | complete | Part 4 rollup — the Plan is exhausted; close is denied-tool

```
run · 26 of 26 DoD ticked
close · denied-tool · both Bash and PowerShell refused under dontAsk — `/lean-doc-generator close`
        cannot run its gate or write `close_commit`. Next: authorize a shell and close interactively;
        no Plan work is outstanding.
run · cost unavailable · turns unavailable · wall-clock unavailable · 5 of 5 units · inline
```

All five Plan tasks carry every DoD box ticked (26 of 26), each with a `progress` entry above and a
commit (`dd5c0c3` T1 → `638cab3` T5). Per Part 4 a `done` task needs no per-task line, so the header
count carries them; the one non-green line is the close step, which is not a Plan task.

**Verified rather than trusted, because this sprint's whole subject is a report disagreeing with its
artifact.** The ticked boxes were spot-checked against the tree instead of read: `check-night-run-rollup.sh`,
`run-night-run-rollup-fixtures.sh`, `assert-park-revisit.sh`, `selftest-assert-park-revisit.sh`,
`night-run.sh` and `ADR-016-rollup-at-the-exit-path.md` all exist, and `qa-check.sh` carries the
checker at line 196 with both harnesses in its always-on and opt-in lists. The DoD claims hold at the
artifact level. What could **not** be verified is behavioural: no gate run was possible this session.

**T4's park re-check ran and found nothing.** Walking the open parks at the exit boundary: this sprint
logged no `park` event at any task boundary, so there is no park to re-examine and none to carry into a
rollup line. The step fired and returned empty — recorded because a silent no-op and an unwired step
look identical afterwards (L-020).

**Why the calibration row degrades on all three figures.** The row is honoured with its gap stated
rather than omitted (Part 4 degrade rule). Cost, turns and wall-clock are read off the last `result`
event of the stream-json log — which is written *after* the process exits and is therefore unreadable
from inside it, and the shell that would read it is denied here anyway. This is precisely the case
ADR-016 exists for: under the launcher, the reaper appends its own block post-exit with the real
figures. If this run was fired through `scripts/night-run.sh`, expect a second, better-populated block
below this one; that duplication is the intended belt-and-braces, and the reaper's figures are the
authoritative ones.

**Not attempted, and why.** The § Files Changed table is still empty. It is derivable only from the
`Layers:` declarations, which this sprint corrected three times (L-100) — reconstructing an attribution
table from a source known to be wrong in exactly that way, with no `git` available to check it against,
would be fabrication. It is left for close, where a shell can derive it from the commit range.

### 2026-08-10 | complete | run exited — rollup emitted by the launcher

```
run · 26 of 26 DoD ticked
```

Calibration row (Part 4), transcribed from the harness result event:

```
run · $1.3692605 · 16 turns · 2 min · 5 of 5 units · inline
```

### 2026-08-10 | surprise | the end-to-end night run, and a figure that was quietly low

Fired through `scripts/night-run.sh` against the completed Plan — the wrapper→reaper path was the one
thing T2 had reasoned about but never executed. Prediction was stated before firing: `26 of 26 DoD
ticked`, zero `unattempted` lines, real cost and turns. All three matched.

**What the unattended run did on its own is the better result.** It applied the protocol shipped hours
earlier: emitted the Part 4 block in the new format, reported `close · denied-tool` as a real denial
rather than working around it, ran T4's park re-check and recorded that it fired and found nothing
("a silent no-op and an unwired step look identical afterwards"), applied the degrade rule to figures
it could not read from inside the process, and **refused to fabricate** the § Files Changed table
because its only source is the `Layers:` declarations this sprint corrected three times. Then the
reaper appended the authoritative figures post-exit, exactly as ADR-016 says it should:
`run · $1.3692605 · 16 turns · 5 of 5 units · inline`. Two blocks, the second better-populated — the
belt-and-braces the run itself predicted.

**The gate then closed the loop**: T3's checker validated the run's own entry (`PASS night-run rollup
… DoD header + calibration row present`). Emitter, reaper and gate all exercised on one real run.

**And checking a green result found a defect, which is this sprint's whole thesis applied to itself.**
The wall-clock read `2 min`. Measured: 163 s elapsed, harness `duration_ms` 156987. So the figure was
*correct* — and truncating. Integer division under-stated a 2.7-minute run by 40%, always in the same
direction. Negligible at 64 minutes, material at three, and a series used for estimating must not lean
low by construction. Now rounds; re-verified at 163 s → `3 min`. Nobody would have found this from the
row alone, because a plausible number is exactly what a wrong number looks like.
