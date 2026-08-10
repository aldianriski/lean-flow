---
sprint: 059
slug: prove-the-run-finished
owner: Maintainer
last_updated: 2026-08-10
status: active
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
