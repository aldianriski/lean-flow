---
sprint: 064
slug: where-it-fires
owner: Maintainer
last_updated: 2026-08-14
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-064 — Execution Log

> Append-only companion to [`../SPRINT-064-where-it-fires.md`](../SPRINT-064-where-it-fires.md). Uncapped
> by design: this file grows with the work done, which is exactly why it is not inside the Plan's
> 400-line budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-14 | promote | Plan locked, batch G1+G2 signed

Three tasks, one theme: mechanisms that exist and do not reach. Gates signed `G1,G2 @ cf56aeb`.
Chain is strictly linear T1→T2→T3 — **no parallelism available**, so nothing was dispatched. T1 runs
inline with a stated reason (ADR-010): dispatch buys no wall-clock when T2 blocks on it.

### 2026-08-14 | surprise | T1 — the guard caught my own audit query, and the promote figure was unproven

T1's first two DoD lines are a measurement. The measurement was taken at promote (A1: "96 entries, 31
promoted, all 31 already carry a pointer") and A1 itself said to re-measure at task start rather than
trust it. That instruction is what saved this task.

**The re-measure agreed. The guard did not.** Two queries were run over the same corpus:

```
promoted entries WITHOUT a pointer bullet  →  0
promoted entries WITH a pointer bullet     →  20
promoted total                             →  31        20 + 0 ≠ 31
```

Eleven entries were unaccounted for, so one of the queries was lying. **The bug was structural, not a
typo:** both used an inner `while((getline nl)>0)` to walk an entry's bullets, and that loop *consumes*
the next `## L-` header before the outer pattern can match it. Every second promoted entry was therefore
never examined at all. The "without pointer" query returned zero because it only inspected twenty of the
thirty-one, and by chance all twenty were clean.

**The negative control had already passed**, which is the part worth recording: breaking `L-108`'s
pointer in a scratch copy *did* produce `DETECTED: L-108`, so the query looked proven. A control only
demonstrates the query can fire on the entries it reaches — it says nothing about the entries it skips.
That is a genuinely new failure mode versus L-108/L-113: not a substring standing in for a structure,
and not a broken escape, but **a correct matcher applied to a silently truncated input set**.

Rewritten as a single-pass state machine with no nested read, and re-controlled:

```
promoted 31 · with pointer 31 · without 0        (corrected)
control: promoted 31 · with 30 · without 1       (L-058 broken → DETECTED)
```

**The conclusion did not change — it was right by luck.** The corpus is clean and the applied count is
zero either way. What changed is that it is now *evidence* rather than a coincidence.

**Feeds T2 directly.** This is the eighth sighting in the L-108 family and the first one caught by a
deliberate guard rather than by an implausible-looking result. It is the counter-example T2 needs: the
rule's value is not "write better greps", it is "cross-check a verification query against a second
query that must agree". T2 should sort it with the other seven.

### 2026-08-14 | progress | T1 — §11 LEARNINGS collapse pass applied, count 0

Corpus: **96 entries — 64 `active`, 31 `promoted`, 1 `superseded`.** All 31 promoted entries carry
their `L-NNN → promoted: <where>` pointer, verified by a query proven to fire on a seeded gap.

**Applied count: 0. Line delta: 0** (738 → 738). Zero is the outcome, not underdelivery — D2 recorded
that at promote precisely so this count would not later read as unfinished work, and SPRINT-063 T2
closed the `docs/research/` half the same way.

`sh scripts/gen-index.sh` re-run (no-op, index already current). `scripts/qa-check.sh` → 151 pass, 0 fail.

**EPIC-002's Closed-when 4 is now satisfiable**: both legs — `docs/research/` (SPRINT-063) and LEARNINGS
(here) — have had one §11 pass *applied*, each returning zero with the evidence rule honoured. The
condition asked for a pass applied, not for a reduction.

### 2026-08-14 | surprise | `complete` is a reserved run-level event, and the template does not say so

T1's entry was first written with event `complete`, meaning "this task is complete". The gate went red:
`check-night-run-rollup.sh` line 42 treats **any** `| complete |` entry header as the announcement that
a *run* finished, and then requires the Part 4 rollup header plus a calibration row. Neither exists
yet, correctly — T2 and T3 are untouched.

**The word is reserved and nothing says it is.** `sprint-log.md.template` lists the valid events as
`promote · progress · surprise · scope-change · park · blocker · complete · close` with no indication
that `complete` carries run-level semantics while the others are entry-level. A task-completion entry is
the obvious thing to write, and it silently arms a run-level assertion.

Corrected to `progress`. The run-level `complete` and its rollup belong at the end of the sprint-bulk
loop, not at the end of a task.

Third instance of this sprint's own theme in one task: a mechanism that fires where it should not,
because its trigger is documented in the checker and not at the point of authoring (L-099's shape).
Carried to the Retro's tech-debt bucket rather than fixed inline — the fix touches a template that
ships to consumers, which is not T1's declared blast radius.

### 2026-08-14 | surprise | committed through a red gate — process failure, recorded not buried

T1's commit `08e9182` landed **while the gate was failing** on the two rollup findings above. The
qa-check ran immediately before it in the same shell line but the commit was not gated on its exit
status, so the failure printed and the commit proceeded anyway.

This is the `orchestrator` § Red flags entry *"Committing through a failing check — surface the failure,
don't bury it"*, and it is the same family as L-057: a command's exit status was available and simply
not consumed. Nothing is corrupt — the two findings were about the log's own event word, not about T1's
work — but the discipline failed and the record says so rather than the history reading clean.
Fixed forward in the next commit rather than amended, so the sequence stays visible.

### 2026-08-14 | progress | T2 — the rule was never in the wrong file; it was the wrong *kind* of rule

Sorted all sightings by the flow that was running — what the DoD asked for and what L-113 said had
never been done. **Eleven instances across six episodes**; the Plan said "seven", written before T1 and
this sprint's promote each produced more. Sorting eleven satisfies and exceeds a criterion that asked
for seven, so this is a figure that *grew*, not one that went stale — no `scope-change` raised, and the
tick states the corrected number rather than the frozen one.

```
ad-hoc verification query inside a governance/gate pass   8
authoring a checker or fixture                            2
automated checker at runtime                              1
```

**The obvious move was re-derived and rejected on evidence.** "Add another sentence to `CONTEXT.md`
§ Gates" fails for a reason now statable: § Gates **was loaded** during all eight governance-pass
failures. The rule was present, correctly placed by §10's test, and in context. The file was never the
defect — so extending it cannot be the fix.

**What the evidence shows.** Not one of the eleven was caught by recalling a rule. Every one that was
caught was caught by **a second number that disagreed** — a count that would not reconcile, an inverse
whose sum was wrong, output too implausible to be real. That makes the durable form an *action taken at
query time*, not a caution held in memory, and it moves the placement question: it fires whenever any
flow is about to act on a query result, which is every flow. §10's test therefore lands on
`.claude/CLAUDE.md` § Behavioral Guidelines, beside "finding facts is your job", not on § Gates.

**A negative control is named insufficient**, because T1 proved it: the control passed while the query
was examining 20 of 31 entries. A control shows the query fires on rows it *reaches*; it says nothing
about rows it skips. That distinction is the new content this widening carries.

Written: `CLAUDE.md` 61 → **63 / 80** (21% headroom, clear of the 68 line Closed-when 1 wants).
`CONTEXT.md` untouched at 132/150. `L-108` → count 6 with the five new instances; `L-113` bumped
1 → **2** with its second sighting, since its own phenomenon recurred — making it promotable at the
next promote by the ordinary count≥2 trigger.

### 2026-08-14 | surprise | my own shell habits were generating every permission prompt

Not sprint work; recorded because it cost the owner repeated interruptions and the cause was mine.

`.claude/settings.json` allows Bash by **command prefix** — `Bash(git add:*)`, `Bash(sh scripts/:*)`
and so on. Three habits defeated every match: prefixing nearly every command with
`cd "D:/Project/lean-flow"` when the working directory was already correct and `cd` is not allowlisted;
invoking `bash scripts/qa-check.sh` when the rule names `sh`; and wrapping commits in `if … then … fi`,
a compound that matches no prefix at all. The environment notes warn about the first one explicitly.

Corrected habits: no `cd`, `sh` not `bash`, one command per call, and file appends via the Edit tool
rather than `cat >>` heredocs. The last one has a second benefit — running the gate as its own call
forces its output to be read before a commit is issued, which is exactly the discipline that failed at
`08e9182`.

### 2026-08-14 | progress | T2 — the rule was never in the wrong file; it was the wrong *kind* of rule

Sorted all sightings by the flow that was running, which is what the DoD asked for and what L-113 said
had never been done. **Eleven instances across six episodes** — the Plan said "seven", written before
T1 and this sprint's promote each produced more. Sorting eleven satisfies and exceeds a criterion that
asked for seven, so this is a figure that grew, not one that went stale; no `scope-change` was raised
and the tick states the corrected number rather than the frozen one.

```
ad-hoc verification query inside a governance/gate pass   8
authoring a checker or fixture                            2
automated checker at runtime                              1
```

**The obvious move was re-derived and rejected on evidence, not on taste.** "Add another sentence to
`CONTEXT.md` § Gates" fails for a reason now statable: § Gates **was loaded** during all eight
governance-pass failures. The rule was present, correctly placed by §10's test, and in context. The
file was never the defect — so moving or extending the text in that file cannot be the fix.

**What the evidence actually shows.** Not one of the eleven was caught by recalling a rule. Every one
that was caught was caught by **a second number that disagreed** — a count that would not reconcile, an
inverse whose sum was wrong, output too implausible to be real. That makes the durable form an *action
taken at query time*, not a caution held in memory, and it relocates the placement question: it fires
whenever any flow is about to act on a query result, which is every flow — so §10's test lands on
`.claude/CLAUDE.md` § Behavioral Guidelines, beside "finding facts is your job", not on § Gates.

**A negative control is explicitly named as insufficient**, because T1 proved it: the control passed
while the query was examining 20 of 31 entries. A control shows the query fires on rows it *reaches*;
it says nothing about rows it skips. That distinction is the new content this widening carries.

Written: `CLAUDE.md` 61 → **63 / 80** (21% headroom, clear of the 68 line that Closed-when 1 wants).
`CONTEXT.md` untouched at 132/150. `L-108` → count 6 with the five new instances recorded; `L-113`
bumped 1 → **2** with its second sighting, since its own phenomenon recurred — which makes it
promotable at the next promote by the ordinary count≥2 trigger.
