---
sprint: 055
slug: wiring-the-standard
owner: Maintainer
last_updated: 2026-08-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-055 — Execution Log

> Append-only companion to [`../SPRINT-055-wiring-the-standard.md`](../SPRINT-055-wiring-the-standard.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a
> new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-09 | promote | Plan locked at `c4eebef`; G1 + G2 signed at the first `sprint-bulk` pass

Seven tasks, sequential T1→T7 per D1. G1 ran as fast-path (all seven arrived via `/task-decomposer`
approve in the same session and promoted unchanged). G2 signed with one ruling: **A1 resolved —
the CODE_OF_CONDUCT template bases on Contributor Covenant 2.1**, chosen over a hand-written text
because a plugin should not push its own conduct policy onto consumers, and over a link-only stub
because that is not scaffolding. T7's DoD item "A1 ruled on before writing the template" is satisfied
by this entry.

Execution runs **inline on the session model**, not dispatched. ADR-010 would route T1/T2/T5/T7 to
briefed Sonnet subagents; the owner ruled inline for this sprint because the work is cross-file
consistency editing over a shared-file chain that D1 already forbids parallelising — the briefing
cost exceeds the benefit when nothing can run concurrently anyway. Recorded because it is a
deliberate deviation from the dispatch default, not an oversight.

### 2026-08-09 | surprise | pre-dispatch preflight HALTed on the Plan's own declaration gap

Running the preflight before the first task (base ref `0380f47`) returned **HALT** with two named
findings:

```
FAIL shared-file-unowned: scripts/qa-check.sh in T1 and T2 — no Depends-on edge, direct or transitive
FAIL shared-file-unowned: .claude/CONTEXT.md in T5 and T6 — no Depends-on edge, direct or transitive
```

Twelve other shared-file pairs resolved clean, four of them by transitive chain, so the checker was
working — the Plan was wrong. **Cause:** D1 states "strictly sequential T1→T7", but D1 is prose in
§ Decisions and the preflight derives ownership from the `Depends-on:` field. The decision was signed
and then not written where the checker reads. That is the same defect class the whole sprint exists
to fix (T2's §11 row, T6's G1 clause), found in the sprint's own Plan before a line of work was done.

Worth recording for the Retro: the preflight is *not* redundant with D1. A human-readable ownership
decision and a machine-checkable one are different artifacts, and only the second one halts a wave.

### 2026-08-09 | scope-change | two `Depends-on:` edges added to the frozen § Plan

**What broke:** nothing in scope — the ordering was already decided at G2 (D1) and signed. What
changed is the *declaration*: T2 and T6 under-declared their dependencies relative to that decision.

**Impact:** T2 gains `Depends-on: T1` (both touch `scripts/qa-check.sh`; T1 extends the count check,
T2 wires a fixture into the same file, so T1 owns it first). T6 gains `Depends-on: T5` alongside its
existing T4 (both touch `.claude/CONTEXT.md`; T5 may edit § Gates, T6 edits the task entry shape).
Wave ranks shift — T2 0→1, and everything downstream of it by one — but the execution order D1
mandates is unchanged, because D1 forbids parallel dispatch regardless of rank.

**Re-confirm G2:** the owner approved this correction explicitly at the G2 pass, choosing it over
narrowing the `Layers:` declarations (which would have hidden the overlap rather than owning it —
TD-031's pattern of narrowing a guard under no pressure) and over overriding the FAIL.

Logged here **before** § Plan is edited, per the freeze rule.

### 2026-08-09 | scope-change | T1 `Layers:` gains the two files implementation invented

**What broke:** the `layers observed` check FAILed —
`changed but undeclared in any task's Layers:: scripts/lib/check-count-claims.sh`. T1's `Layers:`
named `scripts/qa-check.sh`, because at promote time the plan was "extend the existing checker". It
turned out the count block was inline and bound to this repo's own paths, so it could not be pointed
at a fixture — and a check that cannot be run against input that must FAIL cannot satisfy T1's own
L-058 DoD item. Extracting it to `scripts/lib/check-count-claims.sh` was the enabling means, and
`evals/run-count-claims-fixtures.sh` came with it.

This is **TD-022's shape exactly**: a DoD written at promote cannot name a file invented during
implementation. Leg 15 exists because leg 14's prose-derived source shares an author and a moment
with the Layers line (L-074) and so cannot catch invention — only the observed-diff source can. It
caught this within one task of the sprint starting.

**Impact:** T1 `Layers:` gains `scripts/lib/check-count-claims.sh` and
`evals/run-count-claims-fixtures.sh`. No behaviour change and no new acceptance criterion — the
extraction is refactoring in service of a DoD item already written, not added scope. T1's stated
acceptance ("changing any one count claim out of lockstep makes `qa-check.sh` fail with a named
finding") is unchanged and now demonstrable.

**Re-confirm G2:** D1's sequential order is unaffected — the new files are touched by T1 alone, and
the preflight re-run confirms no new shared-file overlap.

*Also recorded, for the Retro:* the `python` heredoc used for the first attempt at this edit failed
outright (`Python was not found`) while the surrounding `sh` pipeline still printed a full green
count-claims report from the **unmodified** inline block. Read as a self-report it looked like the
edit had landed and passed. The artifact said otherwise. CLAUDE.md Edit-safety trap (c), live.

### 2026-08-09 | scope-change | `Layers:` directory tokens taught to both layers checkers (T1)

**What broke:** T1's fixture set is 24 files. `layers observed` matches whole paths exactly, so the
`evals/fixtures/` token already sitting in T1's `Layers:` matched **nothing** — it read as a
declaration while guarding zero files. Not a new defect introduced by this sprint: any directory
token ever written into a `Layers:` line has been silently inert. T1's fixture tree is simply the
first thing large enough to make it visible.

**Impact:** a `Layers:` token ending in `/` is now a directory prefix in both
`scripts/lib/check-layers-completeness.sh` and `scripts/lib/check-layers-observed.sh`. The two are
kept deliberately identical — they read the same declaration, so a parsing rule that differed
between them would make one of the two lie (the file's own existing comment says so). Covered by a
new fixture, `evals/fixtures/layers-completeness/dir-token-prefix.md`, asserted in **both**
directions: T1's block must PASS (implied paths beneath the declared tree) and T2's must FAIL naming
the path outside it. A prefix rule that swallowed everything would satisfy a PASS-only test.

**Known boundary, recorded not hidden:** the dispatch preflight extracts only dot-bearing tokens
from `Layers:`, so a directory token is invisible to its shared-file overlap check. Declaring a
directory is therefore safe only for a tree ONE task owns; a path two tasks could both touch must
still be named in full. Written into both checkers' comments. This asymmetry deserves a `TD-NNN` at
close — the feature is sound but its blind spot is currently guarded by a comment, not a check.

**Re-confirm G2:** owner ruled explicitly, choosing this over enumerating 24 paths, over excluding
fixture trees in `is_excluded()` (TD-031's narrow-a-guard-under-no-pressure pattern), and over
shrinking the fixture set. T1 `Layers:` additionally gains the two checker files.

### 2026-08-09 | progress | T2 — the §11 epic row executed for the first time, on EPIC-001

**A3 confirmed before wiring:** the §11 row is correct as written — two conditions (every member
sprint closed **and** every § Closed when `[x]`), move → `docs/epic/archive/`, keep the `INDEX.md`
row. No redesign, so no scope-change on that front.

`scripts/lib/check-epic-archive.sh` enforces the row in **both** directions, and the second one is
the reason this task exists: an epic archived without earning it (what §11's text warns about), and
an epic that earned it and never moved (what actually happened). Written against the live repo, the
checker's first run FAILed on `docs/epic/EPIC-001-parallel-worktree-fleet.md` — the real drift,
caught by the guard before the fix. Five fixtures: three must-FAIL (premature · eligible-unarchived ·
archived-with-no-conditions, since "all met" is vacuously true for an epic stating none) and two
must-PASS controls.

**Exercised on real input (L-007):** EPIC-001 moved via `git mv`, its two relative links re-based
`../sprint/archive/` → `../../sprint/archive/` and both verified to resolve, `INDEX.md` row left in
place per §11. The checker now PASSes on the live repo. The move surfaced something T2's DoD did not
anticipate — an archived epic sits one directory deeper, so its relative links break unless re-based.
That is now stated in the `close` procedure, not left for the next person to rediscover.

**§ Plan edit:** T2 `Layers:` gains `scripts/lib/check-epic-archive.sh` and swaps the EPIC-001 path
for the directory token `docs/epic/`, which covers the file on both sides of its own move. Logged
before the edit, per the freeze rule.

**Pattern worth carrying to the Retro:** this is the third `Layers:` correction in two tasks. Every
one had the same cause — a file invented during implementation that a promote-time declaration could
not have named (TD-022). Leg 15 is catching them all, which is the system working, but three in two
tasks suggests the cost is in writing `Layers:` at promote as though implementation were already
known, rather than in the checker.
