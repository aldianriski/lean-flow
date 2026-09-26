---
sprint: 108
slug: guard-the-freeze
owner: Maintainer
last_updated: 2026-09-26
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-108 — Execution Log

> Append-only companion to [`../SPRINT-108-guard-the-freeze.md`](../SPRINT-108-guard-the-freeze.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-09-26 | promote | plan locked at `96865d2`, governance signed
Two tasks from the SPRINT-107 outside review (worktree-isolated, 2026-09-26, NOT CLEAR): T1 `TASK-388`
(Tier G, the by-reference freeze checker) · T2 `TASK-389` (Tier X, knowledge-index order). No epic.
Governance: L-promotion none (46 `promoted: no`, all count < 2) · 3 high TD aged (TD-128 · TD-168 ·
TD-174), 98 open rows created at or before Sprint-104 · 5 soft cap breaches (TODO.md 570 > 320,
EPIC-017, three research docs), 0 hard · epic rollups current · no handoff ledger. Owner: carry as-is.
First lock `4eb604a` failed layers-completeness 4 FAIL (unindented wrapped `Layers:` lines; a bare
`qa-check.sh` token), re-locked at `96865d2` before any gate was signed → 4 PASS. Preflight CLEAR
(T1 = 0, T2 = 0, base `4eb604a` = HEAD at the time).

### 2026-09-26 | gate | batch G1 + G2 signed (attended) at `96865d2`
G1: scope confirmed by owner popup, before the tasks were filed; the four excluded findings are TD-182…185 (D3).
D1 (owner): an edit inside an HTML comment in Done when is still FREEZE-EDIT, and masking only finds boundaries.
G2: design approved in plan mode. T1 and T2 are disjoint, so they dispatch in parallel, worktree-isolated;
T1 is `/tdd` fixture-first with seeded-break proof and outside review; T2 is direct with a retained
fixture and a locale control that prints INVALID when the host cannot discriminate.
consequence · T1 · behaviour:material · governance:high → worktree-isolated outside review
consequence · T2 · behaviour:low · governance:med → coordinator re-run + read of the diff

### 2026-09-26 | progress | T2 accepted — the knowledge index is built in byte order under any locale
Worktree commits `6c4ddb5` and `fdf4427`, cherry-picked as `0afbac2` and `aabe874`. The generator enumerates the ADR and
research globs, then orders them with a `LC_ALL=C sort` scoped to that one pipeline. `IFS` is restored
after the loop even when there are no matches. There are no other locale-sensitive steps (builder checked).
The committed index regenerates byte-identical, which confirms A2. New retained harness registered always-on in
leg 12, beside the git-availability harness (git init only, no commits built, ~9 s).
**Coordinator re-run on main:** `--check` → `PASS … knowledge index current` rc=0 under the host default locale;
`gen-index-locale-fixtures: 5 pass, 0 fail`. The locale control confirms the raw glob order differs on this host,
so the byte-identical case discriminates. Builder seed (sort removed) reddened `byte-identical-index`; restored,
`git hash-object` = `git rev-parse HEAD:` = `27dabd38`.
Read of the diff: the only locale change is the prefix on `sort`; nothing is exported.

### 2026-09-26 | scope-change | T2 "no leak" criterion names a shape no caller uses
What broke: the DoD reads "a variable read after *sourcing* the vocab". The gate never sources the
generator. It runs it as a subprocess and greps its `TAGS=`/`DOMAINS=` lines, so the premise was the
coordinator's error at G1. Impact: none on scope. The criterion's intent (nothing reaches the caller) is fixtured
in both real shapes. **A3 (owner ruling, 2026-09-26):** amend the premise to the two real invocation shapes
and tick on that basis. § Plan's criterion text itself is unedited.

### 2026-09-26 | progress | T1 built — CommonMark fences, comment-blind boundaries, real-path spelling; review dispatched
Worktree commit `358447e`, cherry-picked `90081d8`. `unfenced()` closes a fence only on a line with the same character,
a run at least as long as the opener's, and nothing but whitespace after it. A shared `blankComments()` now serves both parsers.
`section()` finds boundaries on blanked text and keeps raw lines (D1). Both paths are resolved with
`realpathSync.native` before being made relative. There are 9 new fixtures, and the orchestrator-store host check now needs the
verdict line (`NO-VERDICT` otherwise). The reference gains one sentence in step 3.
**Coordinator re-run on main, default TMP (8.3 short path):** `by-reference-fixtures: 82 pass, 0 fail` ·
`orchestrator-store-fixtures: 42 pass, 0 fail` · live SPRINT-107 `--close` → `11 pass, 0 fail`. That confirms A1.
**Builder seeds** (restored to `2484da9f` = HEAD blob, `git hash-object`):
- `unfenced()` full revert → the 2 fence cases redden
- the comment-blanking revert → the 2 comment cases redden
- realpath dropped → 80 of 82 go `CHECK-ERROR` (host TMP is itself 8.3)
- `!l.ticked` dropped → only `unticked-box-with-check-tail` reddens
- the no-verdict stub → 3 orchestrator-store cases redden

**Open:** a one-clause seed dropping only the run-length condition left the suite at 82/0, so that clause may be
unguarded. `section()` also unfences raw text while the log parser unfences blanked text. Both have gone to the
worktree-isolated outside review (Tier G bar), which is dispatched on `90081d8`.

### 2026-09-26 | review | T1 outside review (worktree-isolated) — NOT CLEAR, revise round 1 dispatched
Reviewer on `90081d8`, verdict lines first: `82 pass, 0 fail` · `42 pass, 0 fail` · live SPRINT-107 `11 pass, 0 fail`.
Six probe inputs pass SILENTLY on a real Done-when edit:
- **F1:** neither closing clause is guarded. One-clause seeds (drop run-length / drop the trailing-whitespace test) both
  leave the suite at 82/0, because every fence fixture's inner opener is both shorter *and* carries an info string
  (L-186's shared incidental property).
- **F2:** `section()` unfences raw text while the log parser blanks comments first, so a ``` inside a comment
  flips fence parity.
- **F3:** a closer indented 4 or more spaces still closes a fence, in Done when and in the log.
- **F4, a regression this commit introduced:** an inline `<!--` (in a code span) blanks to EOF, so a later Done when is
  skipped silently, or `NO-DONE-WHEN` fires falsely. This repo is not affected today (0 of 26 task files contain `<!--`);
  consumer repos can be.
- **F5 (low):** a line starting with an inline ```x``` span opens a fence.

Not defects: tilde nesting · a 4-space opener (loud only) · realpath shapes (ENOENT/EISDIR stay named findings; `subst`
drive 11/0) · a member-varying probe. D1 is guarded (both reviewer seeds C and D reddened exactly their cases).
Restored `2484da9f` (`git hash-object` = HEAD blob).
**Revise round 1** (the one bounded retry): one CommonMark block scanner shared by both parsers. It has three states
(normal · fence · comment); fences take ≤3 spaces of indent; a backtick info string may not contain a backtick; only a
line-start `<!--` opens a comment. Each clause gets a discriminating fixture and a one-clause seed.

### 2026-09-26 | progress | T1 revise round 1 landed — one scanner for fences, indent and comments; re-review dispatched
Worktree commits `fe5f83e` and `f515a1e`, cherry-picked as `ffaca28` and `878993b`. `scanBlocks()` (normal · fence · comment) now backs
`section()`, the log parser and the Plan `Cites:` reader. There are 17 new fixtures. Five were red on a pristine
`358447e` rerun (F2 · P4a · P8 · P5 · P6). P1, P2, P9 and P4d were already green by design: they isolate one closing clause each.
P4d was redesigned once (`878993b`) because its first shape did not discriminate seed (d).
**Builder seeds** (one clause each, restored to `62f31929` = HEAD blob, `git hash-object`):
- (a) run-length → P1
- (b) trailing whitespace → P2, P9
- (c) 4+ indent → P4a, P8
- (d) backtick info string → P4d
- (e) inline `<!--` → P5, P6
- (f) a fence opening inside a comment → F2

Seed (f) is +6 lines (a real branch), with its parse and targeting verified.
**Coordinator re-run on main, default TMP:** `by-reference-fixtures: 99 pass, 0 fail` · `orchestrator-store-fixtures:
42 pass, 0 fail` · live SPRINT-107 `--close` → `11 pass, 0 fail`. The stash stack was checked empty after the builder's
tagged stash/apply/drop.
The single bounded re-review is dispatched, worktree-isolated, on `878993b`.

### 2026-09-26 | review | T1 re-review (worktree-isolated) — NOT CLEAR: F1–F5 closed, five new silent misses; retry budget spent
Reviewer on `878993b`: `99 pass, 0 fail` · `42 pass, 0 fail` · live SPRINT-107 `11 pass, 0 fail`. All of F1–F5 are CLOSED on
the reviewer's own probes. **New, all silent at `878993b` and all caught at `1bd9c71`:** `scanBlocks()` returns raw lines,
so comment text now counts in places D1 never covered:
- (1) `## Done when <!-- stretch -->` no longer matches its heading → that section is skipped
- (2) `## Members <!-- … -->` → a listed-only member leaves the population
- (3) comment text now excuses an edit: a scope-change entry whose only id is inside `<!-- -->`; an id in a heading
  comment; a commented-out `| scope-change |` field that becomes the entry's event

Low severity: two loud false positives (a commented heading → `NO-DONE-WHEN`, a commented `## Execution Log`), and two
pre-existing misses outside the claimed rules (a `<pre>` block, a heading indented 1–3 spaces).
Reviewer seeds S1–S3 each reddened exactly their cases; restored to `62f31929` (`git hash-object` = HEAD blob).
**Surprise, the coordinator's own:** the revise brief specified "raw lines" for the whole scanner, when D1 covered only
the Done-when *body*. The regression was designed in, not built in. The builder implemented the brief exactly.
The one bounded retry is spent → **owner ruling required** before T1 can move.

### 2026-09-26 | gate | owner authorizes T1 revise round 2 (beyond the one-retry bound)
Owner ruling (popup, 2026-09-26): one more builder round with the corrected rule, then a fresh isolated re-review.
**A4 (the rule):** whatever ENDS or NAMES a section, or EXCUSES an edit, reads rendered text (comments blanked);
whatever SELECTS members or COMPARES Done-when text reads raw text, so an error always lands on the loud side. D1 is unchanged.
The pre-existing `<pre>` block and 1–3-space indented heading misses go to TD at close, not into this round.
consequence · T1 · behaviour:material · governance:high → fresh worktree-isolated re-review after round 2

### 2026-09-26 | progress | T1 revise round 2 landed — rendered text for boundaries and excuses, raw for selection and body; re-review dispatched
Worktree commits `3383845` · `1a2f697` · `c2a3ba0` · `02c6543` · `585246f`, cherry-picked as `f84f5fc` · `28b51d2` · `9e3481c` · `5fcd241` · `b615868`.
`scanBlocks()` now also returns `rendered`: block comments hidden, and inline comment spans blanked within a paragraph,
skipping code spans and unclosed comments. Heading match, scope-change event/id/Tn reads and the Plan `Cites:` reader
use it; the Done-when and Members bodies stay raw (A4).
Test-first: the R1–R5 fixtures were committed alone, then run on `f515a1e` → 103 pass, 8 fail, exactly the claimed misses.
Three fixture or definition corrections were made after seeds failed to discriminate:
- R5 was masked by the stamp arm, so TASK-902 is now unstamped
- P5/P6 never reach the code-span branch, so a new reachable-`-->` case was added
- a hidden line's `rendered` is now fully blank

**Seeds** (restored to `a8d51c2b` = HEAD blob, `git hash-object`):
- (g) headings read raw → R1, R2, R4a, R4b
- (h) scope-change reads raw → R3a–d
- (i) Members ids read rendered → R5
- (j) no code-span mask → the new j case
- (k) Done-when body read rendered → `comment-guidance-edit-inside` + R5 (they share one path)

**Coordinator re-run on main, default TMP:** `by-reference-fixtures: 112 pass, 0 fail` · `orchestrator-store-fixtures:
42 pass, 0 fail` · live SPRINT-107 `--close` → `11 pass, 0 fail`. The stash stack is empty.
A fresh worktree-isolated re-review is dispatched on `b615868`.

### 2026-09-26 | review | T1 round-2 re-review (worktree-isolated) — NOT CLEAR: R1–R5 and round 1 closed; 2 regressions, 1 in-claim miss
Reviewer on `b615868`: `112 pass, 0 fail` · `42 pass, 0 fail` · live SPRINT-107 `11 pass, 0 fail`. R1–R5 and P1–P9/F2/P4a/P8/P5/P6/P4d
are all CLOSED on the reviewer's own spellings, and the L-186 selection probes (stamp-only, cancel/, in_progress/) hold.
**Silent misses found:**
- (1) REGRESSION: the code-span model assumes single backticks on one line. ``` ``a`b`` ``` and an escaped `` \` `` make a
  `<!-- TASK-901 -->` read as code, so a hidden id excuses an edit. `1bd9c71` caught this.
- (2) IN-CLAIM: `## Done <!-- x --> when` renders "Done when", but the rendered name is only trimmed, so interior spaces are not collapsed.
- (3) PRE-EXISTING: `## Done when ##`, a 1–3-space indent, `##  Done when`, `## Members ##`.
- (4) inline-log heading unrecognised at promote and recognised later → every pre-promote entry counts as new. The unclosed-comment
  variant is a REGRESSION, since `1bd9c71` was loud; the plain rename is pre-existing.
- (5) low, pre-existing: list-item containers are not modelled.

Reviewer seeds A–C each reddened exactly one case; restored to `a8d51c2b` (`git hash-object` = HEAD blob).
Pattern: three rounds of a hand-rolled CommonMark subset, and each round closes its set and opens the next set at a new
boundary. Owner ruling required on direction.

### 2026-09-26 | gate | owner authorizes T1 revise round 3 — A5: err loud, stop parsing
Owner ruling (popup, 2026-09-26), chosen over adopting a real parser and over stopping with TDs. **A5:** the checker stops
modelling inline Markdown; wherever the rendered meaning is uncertain, it takes the reading that produces a finding.
- Excuses match against the entry text with every comment span removed (no code-span exception; an unclosed `<!--` strips
  to the end of the entry).
- Heading names allow a 0–3-space indent and closing `#`s, with whitespace collapsed.
- A log heading that is unrecognised at the baseline yields `LOG-HEADING-CHANGED`, never "all entries new".
- One deliberate flip is allowed: `j-backtick-protects-a-reachable-arrow` may turn loud.
- List-item containers and `<pre>` blocks go to TD at close.
