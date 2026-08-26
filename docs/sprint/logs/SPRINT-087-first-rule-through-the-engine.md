---
sprint: 087
slug: first-rule-through-the-engine
owner: Maintainer
last_updated: 2026-08-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-087 — Execution Log

> Append-only companion to [`../SPRINT-087-first-rule-through-the-engine.md`](../SPRINT-087-first-rule-through-the-engine.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-25 | surprise | A5 attributes the six marks to ADR-036; they are STANDARD §14's

Found while confirming assumptions at Batch G1, before any task started. A5 reads *"The six marks are
frozen by ADR-036. Confirm: ADR-036 § Decision"* — and § Decision freezes the **verdict vocabulary**
`PASS` · `FAIL` · `GAP`, deferring severity to H15. It names no marks. The same attribution repeats in
§ Scope "Out", **D6**, and **T2's DoD 3** — four sites.

The *count* is correct: `spec/STANDARD.md` §14 defines exactly six marks — `mechanical` ·
`judgment-only` · `split` · `implementation-directed` · `restated` · `standard-directed`.

**Why it is bounded:** T2 DoD 3's `Verify:` clause already names *"the Standard's own"* mark set, so
the check reaches §14 and the criterion stays satisfiable as written. What breaks is the reader — an
implementer following the citation lands on an ADR that cannot answer the question (L-151). Noted for
the Retro: this is the failure **ADR-036 itself codifies** — *"point at the artifact; a row that can
point at nothing is a design intention wearing a contract's clothes"* — reproduced inside the sprint
that cites it.

**Owner ruling (G1):** citation defect, **not** a scope change — no criterion becomes unreachable, so
§ Plan is not edited and no `scope-change` is owed. Filed as **TD-096** (id derived from the ledger
max, not incremented from memory — L-143) and execution proceeds.

consequence · pre-T1 · behaviour:low · governance:low

### 2026-08-25 | progress | Owner-action closed at G2 — first rule family is F12 (§12 git boundary)

The Plan deferred this to G2 by **D4** precisely so it could not be absorbed silently into T3.
Recorded as **D7** in § Decisions, which is where T3's DoD 1 requires it (*"a D-row names the family
and which criterion selected it; an unrecorded pick is the L-151 shape"*) — the Execution Log alone
would not have satisfied it.

**The evidence inverts the obvious reading.** Round 5's recommendation ranks families
*expensive-first* per V3 §43 — but § Scope assigns §43 to families **2..n**, and the Owner-action's
criterion for family 1 is *cheap + representative*. Ranking by §43 here would have selected F11
(84.7 s) or F6 (72.1 s), the opposite of what this sprint wants. Chosen instead on the stated
criterion: **F12**, 2,240 ms real-scale (8th of 12), four rules, Structural level, one filesystem
port. Reasoning and runners-up in D7.

consequence · pre-T1 · behaviour:low · governance:high

### 2026-08-25 | surprise | G2 pre-screen FAILs on T4 — the guard is wrong, not the criterion

`sh scripts/lib/check-verify-reaches.sh` on the Plan emits `verify-method-absent` for T4 DoD 1, which
names `read-spec-rules.sh --section N`. **The finding is false.** `scripts/lib/read-spec-rules.sh` is
present, offers `--section`, and ADR-034 §64 records a working invocation. The guard extracts the
`*.sh` token and tests `[ -f ]` against CWD, so a **bare basename** — this repo's dominant convention —
resolves to nothing and is reported as *"does not exist in this repository"*.

**Why five sprints of green did not catch it.** The checker exempts `*/archive/*` (line ~55), so it
only ever inspects the active sprint. Archived Verify clauses carry **17 bare-basename references**
(`conformance.sh` ×8, `check-manifest-lockstep.sh` ×3, `check-doc-caps.sh` ×3, `check-epic-archive.sh`
×2, `qa-check.sh` ×1) — every one would trip this. The convention and the guard have disagreed since
the guard shipped at Sprint-082 T3; the disagreement was structurally invisible.

Worth recording for the Retro: my first control run — the checker against five archived sprints —
returned silence and I read it as *"they pass"*. It was **vacuous**: the archive exemption meant nothing
was examined. A negative control proves a query fires on rows it reaches, never that it reached them
(L-108). The real discriminator was grepping the archived clauses directly for path style.

**Ruled:** false positive on a Tier G guard, same class as TD-095 — filed **TD-097**. § Plan is not
edited; T4 is wave 2, and its DoD 1 will need an explicit ADR-021 owner ruling at tick time, since its
named check FAILs for a reason unrelated to what the criterion asserts. T1 and T8 are unaffected.

consequence · T4 · behaviour:low · governance:high

### 2026-08-25 | progress | T1 — one rule (S9.LOGDIR) through the TS engine, agreeing with Shell

Built the result domain (`Finding`/`RuleEvaluation`/`ConformanceResult`), a `Map`-backed switch-free
rule-id→evaluator registry, one repository port (`SprintDirPort`) with a real Bun adapter and an
in-memory fake, and `apps/cli --rule`. Rule chosen: **`S9.LOGDIR`** (`sprint-log-outside-logs-dir`),
selected because it needs **zero spec-derived configuration** — its shape is fixed by the Standard's
own path convention, making it a pure function over a directory listing. Deliberately not a §12 rule;
§12 is T3's family and the tracer should not pre-empt it.

Parity proved by spawning `scripts/lib/conformance-engine.sh` **live inside the test** via
`execFileSync` for FAIL/PASS/NOTE, never a copied literal, so it cannot rot silently. Tier G: six
targeted breaks seeded across the evaluator's branches, each `cmp`-confirmed landed, line count
unchanged at 73/73, each reddening only its own case with siblings green, restored under checked
`sha256sum`.

**Verified independently, not taken on report.** T1's run showed `110 pass, 2 fail`, with the two
attributed to a pre-existing flake. I re-ran `spec-reader.test.ts` on the clean base commit `2eee4d3`
with a clean tree and none of T1's changes: **`24 pass, 2 fail`**, the same two `reconcile` timeouts
(6558 ms / 5006 ms against bun:test's 5000 ms default). Two agents, two methods, same answer — the
claim holds. Filed as **TD-098**, because a red baseline taxes every later task in this sprint: T2,
T3, T4 and T7 all run this suite and must now separate their own failures from a standing pair.

Commit `11efdaa` on `worktree-agent-a7992b044559a92fa`. **DoD not yet ticked — review pending.**

consequence · T1 · behaviour:material · governance:low
review · T1 · independent-adversarial-reviewer (worktree-isolated) · behaviour:material · governance:low

### 2026-08-25 | surprise | my own `consequence · T4` line is mis-keyed, and the gate caught it

`sh scripts/lib/check-review-depth.sh` on this file emits **`review-depth-governance-absent`** for T4.
The cause is mine: the entry above keyed `consequence · T4 · behaviour:low · governance:high`, but that
entry records **G2 pre-screen work about T4's criterion**, not execution of T4. The two earlier gate
findings in this file are keyed `pre-T1`; that one should have been too. Keying it `T4` asserts T4 was
worked on, so the gate correctly demands a review line for a task that has not been built.

**Not edited — this log is append-only, and a mis-key is corrected with a new entry, not a silent
rewrite** (owner ruling, this session). The FAIL therefore stands until T4 is genuinely built and
independently reviewed in wave 2, at which point a real `review · T4 · …` line clears it. The red is
accurate: T4 does have governance:high material logged against it with no review behind it.

**A second, worse finding came out of checking the first.** `check-review-depth.sh` matches the
classification with an anchored full-line pattern — `^consequence · T[0-9]+ · behaviour:… ·
governance:…$`. `pre-T1` does not match `T[0-9]+`, so **both** earlier gate lines are invisible to it,
including line 56's `governance:high`. Verified empirically, not read off the regex: with the T4 line
deleted, a file still containing a `pre-T1 · governance:high` line reports **`PASS`**. That is L-148's
exact shape — a declaration the consumer's parser cannot read fails *green* — and L-148's own
prescription is violated too: a reader deriving an empty set from a non-empty source must emit a named
finding rather than silence. Filed as **TD-099**.

Note for the Retro: the invented key was mine, but the guard's silence about it is the repo's. One of
these two lines FAILED loudly and got fixed; the other passed silently and would never have been
noticed. Same defect, opposite outcomes, decided entirely by whether the key happened to match a regex.

consequence · pre-T1 · behaviour:low · governance:low

### 2026-08-25 | progress | T8 — the gate no longer scans agent worktrees

Root cause re-derived rather than taken from TD-095's mitigation line: of every checker under
`scripts/`, only `check-ephemeral-intake.sh` does unscoped tree-wide discovery
(`find "$root" -type f -name 'BUG-*.md'`); the rest scope their globs to fixed subdirectories and
cannot reach `.claude/worktrees/`. Exclusion added at the discovery step, anchored to path-start shape
(`^\.claude/worktrees/`) rather than substring — the substring form being the very defect class under
repair. `conformance-engine.sh` carries the same class of bug in `_repo_files` but is an oracle for
other tasks this sprint and was correctly left alone.

Gate read as its own foreground call, verdict line read directly: **`QA-CHECK: 178 pass, 4 fail`**
(cross-check run: `176 pass, 4 fail`; the PASS delta is which eval harnesses completed before the
budget trip, the 4 FAILs identical and pre-budget). All four enumerated and **none names a
`.claude/worktrees/` path**. Retained control `worktree-lookalike/docs/worktrees/BUG-real.md` proves the
anchor does not swallow a resembling real path. Seed removed exactly the new line, `sh -n` clean,
53→52 lines, reddened only `worktree-excluded` with three siblings holding, restored byte-identical
under checked `sha256sum`.

**One of T8's four "unrelated, pre-existing" FAILs was neither** — `review-depth-governance-absent` was
created by me thirty minutes earlier (previous entry). Reported as noise, it was in fact this session's
own bookkeeping defect. Recorded because it is the second time today an agent's confident
"pre-existing" needed independent checking, and the first time it was wrong.

Commit `47e2f2b` on `worktree-agent-a27df2927375f6c6f`. **DoD not yet ticked — review pending.**

consequence · T8 · behaviour:material · governance:low
review · T8 · independent-adversarial-reviewer (worktree-isolated) · behaviour:material · governance:low

### 2026-08-25 | progress | Both wave-1 reviews returned — one DoD refuted, one divergence found

Two independent worktree-isolated reviewers, one per Tier G task. **Both found things their author did
not, which is the entire content of L-165** — and in both cases the author had run more tests than the
reviewer did.

**T8 — DoD 1 REFUTED.** T8 claimed `check-ephemeral-intake.sh` was the only checker doing unscoped
tree-wide discovery. The reviewer re-derived the enumeration by a different method and found two more,
both reproduced in isolated fixtures, and I confirmed both by reading the code directly rather than
accepting either account:
- `check-research-archive.sh:39` — `live_citer()` greps `$root`, filtering only archive, changelog,
  knowledge-index and fixtures. A worktree copy counts as a live citer, so a superseded doc cited by
  nothing real reports **PASS**. A **silent false negative** — the opposite and worse direction from
  the false positives T8 fixed.
- `conformance-engine.sh:1722–1731` — `_repo_files()` prunes six directories, not `.claude/worktrees`.
  Emits `file-outside-canonical-placement` naming a `.claude/worktrees/` path, which violates T8's DoD
  1 wording literally.

Revise dispatched for the first only. The second is **knowingly deferred to TD-100**: the engine is the
live oracle T1/T3/T5 spawn inside their parity tests and A4 fixes it as the never-edited comparand.
Fixing it mid-sprint would move the reference every parity test is measured against — a silent change
to the artifact that proves correctness. DoD 2 and the Tier G seed/restore **survived** attack: five
lookalike paths and two real worktree depths all resolved correctly.

**T1 — a real TS/Shell divergence, in cardinality.** DoD 1, 2 and 5 survived; the reviewer wired a
third evaluator through the real CLI with one `register()` call and zero dispatch-site edits, a
stronger proof than the shipped unit tests. But Shell's `assert_S9_LOGDIR` calls `bad()` **once per
misplaced file** while TS returns a single `RuleEvaluation`, comma-joining both filenames into one
finding. Every shipped test uses exactly one misplaced file, so nothing caught it.

DoD 4's literal wording — same named finding, same exit meaning — survives. **EPIC-014 D2 does not:**
every TS/Shell difference is to be *ruled*, never absorbed, and a comma-join absorbs a structural
divergence behind a string. Revise dispatched to widen the result to N findings. This is not local
cleanup — T7 needs the same widening for `--reconcile`, and T2/T3/T4 all build on whatever shape T1
leaves. T1's stated purpose is that the shape is right *before* anything is widened onto it.

Two smaller findings folded into the same retry: the port's differentiating case (a *directory* named
like a log file, which `isFile` excludes and Shell's `[ -f ]` agrees on) has no test, and the Tier G
seed evidence exists only in a commit message rather than in the tree.

consequence · pre-T1 · behaviour:low · governance:low

### 2026-08-25 | progress | T8 re-reviewed clean, merged, DoD ticked 3/3

The revise fixed `check-research-archive.sh`'s `live_citer()` with a single anchored filter line, in
the same chain position as its existing exclusions. Re-review by the same reviewer that refuted DoD 1:
**all three attacks survived.** Five lookalike citer placements (`worktrees-backup`, `worktreesX`,
`docs/worktrees/`, root-level `worktrees/`, non-root-nested `lib/.claude/worktrees/`) each correctly
kept their doc alive; real worktree citers at shallow and deep nesting were correctly excluded;
seed/restore reproduced byte-identically against `sha256 b070c808…`. The enumeration was re-run over
the revised tree, this time drilling into `_sprint_plans()` and `_s12_tracked()` which the first pass
had not: **no third vulnerable checker exists.**

Merged as `7ee21b1`. File sets were disjoint from main's own commits — checked before merging rather
than discovered during it. Fixtures then re-run **in the integrated tree**, not trusted from the
worktree they were written in: `EPHEMERAL-INTAKE FIXTURES: all green` and `RESEARCH-ARCHIVE FIXTURES:
all green`, both verdict lines read directly.

**The reviewer flagged that it could not find TD-100 anywhere in the tree** — correct, and exactly the
right instinct: it verified the filing existed rather than accepting "filed as TD-100" on trust. The
explanation is structural, not a missing row. TD-100 lives on `main` at `8dbc549`; T8's branch forked
from `2eee4d3`, so it was invisible from where the reviewer stood. Confirmed by `git log -S`. Worth
keeping in mind when briefing worktree-isolated reviewers: a coordinator's bookkeeping commits are not
in their world, so anything they must verify has to be given to them or merged first.

**T8 DoD 3/3 ticked.** One of TD-095's three sites remains open by design (TD-100, the engine).

consequence · T8 · behaviour:material · governance:low
review · T8 · independent-adversarial-reviewer · re-reviewed once · clean · behaviour:material · governance:low

### 2026-08-25 | surprise | TD-098 was wrong — I filed a load-dependent failure as a standing one

T1's revise reported the whole workspace at `127 pass, 0 fail`, which contradicts the `2 fail` I filed
as TD-098 earlier today. Re-measured on **the same commit** (`1123671`, T1 still unmerged, tree clean):
**`26 pass, 0 fail`**, whole file **9.31 s**. My original measurement was `24 pass, 2 fail` at
**16.51 s** — taken while three worktrees were live and two agents were building.

The two `reconcile` tests do not fail at rest. They fail **under contention**, because they spawn
`read-spec-rules.sh` and the spawn crosses bun:test's 5000 ms default only when the host is loaded.

**The correction matters more than the fact.** I wrote "the TS suite is red at baseline" into a durable
ledger row and then cited it in a commit message as a standing tax on T2/T3/T4/T7 — a figure another
reader would have inherited and acted on without being able to re-derive it. That is **L-130's exact
shape, committed by the author while actively applying the guard elsewhere in the same session**: I
had just cross-checked the TD id, the mark count and the `read-spec-rules.sh` claim, and still filed a
one-measurement conclusion as a fact. The gap is that *measuring it myself* felt like verification, and
"I measured it" is not "I measured it twice". Row corrected in place, both measurements kept side by
side rather than the wrong one deleted.

**The corrected finding is more interesting than the original.** The suite is reliable for a single
sequential task and unreliable exactly when several tasks build in parallel — the dispatch pattern
`dispatch.md` recommends and this sprint used. That is the **same perverse shape as TD-095/TD-100**:
the tooling penalises the concurrency the repo prescribes. And its failure mode is a trap — a task that
reddens under a parallel wave and greens on re-run reads as a flake, so the re-run "fixes" it and the
real signal is discarded.

consequence · pre-T1 · behaviour:low · governance:low

### 2026-08-25 | progress | T1 re-reviewed clean, merged; wave 1 complete at 8/8 DoD

Re-review confirmed all three actioned items. The reviewer re-ran **seed 7** — the one that reverts
`evaluate()` to the exact rejected comma-joined design — and got precisely the two cardinality tests
reddening with 16 siblings green, then spot-checked seed 6 independently and matched the recorded
evidence block exactly. Cardinality verified live at **N=3**, beyond the N=2 the builder tested. The
absence-vs-emptiness question was asked directly and answered: `findings: []` is disambiguated by
`verdict`, and this evaluator has no "checked nothing due to failure" state, so the widening does not
reintroduce SPRINT-085's ambiguity.

Merged as `25f5c6e`; disjointness checked before merging, not discovered during it. Full suite in the
**integrated** tree: **`127 pass, 0 fail`** across 12 files.

**Two secondary findings, neither refuting a DoD, both filed.**

**TD-101 (high) — nothing in this repository type-checks TypeScript.** The gate is
`qa-check.sh && bun test`; `bun` strips types without checking them. No `tsc` anywhere, and **no
`typescript` entry in `package.json` at all** — while `tsconfig.json` and `tsconfig.base.json` both
exist. Configuration for a checker that cannot run. Confirmed independently after the reviewer executed
a scratch file assigning a bare string to `findings: readonly Finding[]` without complaint.

This one reaches backwards. `EPIC-014` line 60 records SPRINT-085 as closing with *"absence vs
emptiness is enforced by a **TYPE**, not a convention"* — and **T4 DoD 2 in this very sprint leans on
that same guarantee**. A type no gate evaluates is L-105's family: an absent guard wearing the shape of
a present one, in its most dangerous variant, because the record already describes it as the *strong*
form. ADR-035 forbids dependencies, so whether a type-checker counts as one is a decision to rule, not
a detail to settle inside a task.

**TD-102 (minor) — TS and Shell order findings differently.** Shell exhausts glob 1 before glob 2; TS
sorts alphabetically. Same count, membership and name, so DoD 4's wording holds and no shipped test
asserts order. Recorded rather than fixed — EPIC-014 D2 requires every difference to be *ruled, never
absorbed*, and this entry is that ruling. It becomes active at the H24/H25 cutover, when diffing whole
outputs is the obvious way to prove equality.

**Wave 1 complete: T1 5/5, T8 3/3.** Both Tier G, both independently reviewed, both revised once, both
re-reviewed. In both cases the reviewer found something the author did not, having run fewer tests.

consequence · T1 · behaviour:material · governance:low
review · T1 · independent-adversarial-reviewer · re-reviewed once · clean · behaviour:material · governance:low

### 2026-08-25 | progress | T6 — permission-denied reports `spec-table-unreadable`, not `spec-not-found`

New boundary adapter `apps/cli/src/spec-file-reader.ts`; `packages/standard/src` untouched, as DoD 2
requires. `attemptRead()` branches **only** on `code === "ENOENT"` → the domain's existing pure
`specNotFound()`; every other failure becomes "present but nothing readable" and feeds empty content
into `readAll()`, which already classifies zero rows as `spec-table-unreadable`. No new domain logic —
it reuses the path an empty-but-readable spec takes.

**The premise in the task title turned out to be half wrong, and finding that out was the work.** Shell
never reported `spec-not-found` for a permission-denied spec: `read-spec-rules.sh`'s `[ -f "$spec" ]`
passes for an unreadable regular file, `awk` then fails with stderr swallowed (`2>/dev/null`), zero
rows result, and the oracle says `spec-table-unreadable`. The conflation was on the TS side only.
Verified by running the real script against a genuinely denied file rather than reasoning from its
source.

**Two platform findings that would each have produced a silently vacuous pass.**
`chmod 000` **does not deny read** on this Windows/git-bash host — verified live (`ls -la` showed
`r--r--r--`, `cat` succeeded at exit 0). A real denial needed `icacls <file> /deny` with an explicit
NTFS DENY ACE, which wins over the inherited ALLOW. Had the fixture used `chmod`, the permission-denied
test would have asserted a branch it never reached and passed. Second: Bun/Node surface the denial as
**`EPERM`, not the POSIX-canonical `EACCES`** — so the adapter's "is it ENOENT" shape is load-bearing;
an allow-list of `EACCES` would have mis-classified every case on this platform. Both were caught only
because the fixture's denial was checked *before* anything was built on it.

Full suite `130 pass, 0 fail`. Commit `f8ef4aa`. **DoD not ticked — review pending.**

consequence · T6 · behaviour:material · governance:low
review · T6 · independent-adversarial-reviewer (worktree-isolated) · behaviour:material · governance:low

### 2026-08-25 | progress | T6 re-reviewed clean, merged, DoD ticked 3/3

Re-review survived all four attacks, including the one that worried me most. The revise replaced
reactive error-code classification with `statSync(specPath).isFile()` checked **before** any read — a
positive mirror of Shell's `-f` guard rather than a guess at which error code each failure produces —
which fixes the class rather than the instance, but calls `stat` on a path whose read is denied. If
`statSync` were itself blocked by the DENY ACE, the code would report not-found and **silently regress
the exact defect T6 exists to fix**, while the suite stayed green. The reviewer built an independent
probe (not the shipped fixture) and established why it does not: on Windows, `DENY(R)` blocks content
read but **not** metadata read, so `statSync` succeeds and the permission-denied path is reached
correctly.

Cleanup verified on the failing path, not just the happy one: a forced mid-test failure still removed
the DENY ACE and its directory, with no swallowed error. Sixteen litter directories from earlier runs
were purged.

**One gap is disclosed rather than assumed.** Dangling-symlink parity is untested — `ln -s` lacks
symlink privilege on this host, and the reviewer independently confirmed it with a *different tool*
(PowerShell `New-Item -ItemType SymbolicLink`, same privilege error). The claim that `statSync` agrees
with `-f` there rests on both resolving through the OS's shared `stat()`, not on a live comparison, and
is recorded that way in the code. That is the correct handling of an unprovable claim: state the limit,
do not let a green suite imply coverage it does not have.

Merged as a merge commit; disjointness checked first. Integrated suite: **`131 pass, 0 fail`**.

**A live sighting of TD-098, and it behaved exactly as the corrected row predicts.** The first
integrated run after merging read **`130 pass, 1 fail`** while T2's reviewer was running concurrently;
re-run at rest, twice, it read `131 pass, 0 fail`. This is the trap TD-098 names — red under a parallel
wave, green on re-run, so the re-run reads as a fix and the signal is discarded. The re-run was
legitimate here **only because the failure was identified before it was dismissed**. Had I reasoned
"probably the known flake" and moved on, the procedure would have been indistinguishable from ignoring
a real regression.

consequence · T6 · behaviour:material · governance:low
review · T6 · independent-adversarial-reviewer · re-reviewed once · clean · behaviour:material · governance:low

### 2026-08-25 | progress | T2 re-reviewed clean, merged, DoD ticked 4/4

Re-review cleared all six attacks. Two worth recording. **Absence was verified by construction, not by
trusting the type** — the reviewer built each of the four failure cases and inspected the live returned
keys: `["ok","finding","message"]`, with no `marks` key present on any failure. That runtime proof is
what TD-101 makes necessary; the `MarksReadOk | SpecReadFail` union is a *type*, and nothing in this
repo evaluates types. Second, my worry that the new fixture mutates the real `spec/STANDARD.md` was
**unfounded** — the strip is in-memory (`readFileSync` → split → slice → `tokenize`), `writeFileSync`
is never called on `SPEC_PATH`, and the fixture's filename is a synthetic label. Worth having checked:
a Tier G test that wrote to the SSOT would have been severe and would have read as a spec change.

The revise also moved the L-058 guarantee **out of the test and into the function**. A guarantee living
in a test protects only the caller who happens to run that test; `marksInStandard()` had zero
production callers, which is exactly why fixing it now was cheap and later would not have been.

Merged; disjointness checked first. Sprint DoD now **16 ticked / 13 open**.

**An unresolved observation, recorded rather than smoothed over.** The first integrated run after
merging read **`150 pass, 1 fail`**; two immediate re-runs read `151 pass, 0 fail`. I could not capture
which test failed — it did not reproduce, and the failure line was gone by the time I grepped for it.

I had told myself "no agents are running", and that was **wrong**: my subagents had finished, but the
peer session `lean-flow-0e` is actively working in this same repository, which is load I discounted
because it was not *my* load. The signature matches TD-098 (intermittent, timing-sensitive, oracle-
spawning), but **matching a signature is not an identification**, and TD-098's own warning is that a
re-run which greens is indistinguishable from a fix. So this is logged as unidentified, not as the
known flake. If it recurs, the next sighting should capture the failing test name before re-running —
the re-run destroys the evidence.

consequence · T2 · behaviour:material · governance:low
review · T2 · independent-adversarial-reviewer · re-reviewed once · clean · behaviour:material · governance:low

### 2026-08-25 | progress | T7 — `reconcile` carries every mismatching section; TD-098's mechanism refined

The defect was real and **self-documented**: `reconcile()` carried a comment stating it "surfaces the
FIRST section (lowest number) that disagrees… a deliberate, reported TS/Shell difference (deliverable
d)". SPRINT-085 knew and deferred it under EPIC-014 D2's rule that a difference be ruled rather than
absorbed; T7 closed it. Widened `SpecReadFail` with an optional `mismatches?: readonly SectionCount[]`
and changed the loop to collect every disagreeing row. `finding` stays the single string
`"section-rows-mismatch"` and the verdict stays `ok: false`, so ADR-034 D3's frozen surface is
untouched. Commit `fc9510e`. **DoD not ticked — review pending.**

The seed that mattered reverts `reconcile` to the exact pre-T7 single-finding shape; only the new
two-mismatch test reddened, with the §2-only single-mismatch control staying green. That control is the
point — a one-mismatch fixture passes whether the bug is present or absent, which is why DoD 1 words
itself as *"one mismatch proves nothing here"*.

**TD-098's mechanism is now materially better understood, and the news is worse.** T7 hit the timeout
running `bun test packages/standard` **alone** — no other agent, no external load. Bun runs test *files*
in parallel, so several files spawn shell oracles simultaneously and contend with each other; isolated
single-file runs of the same test pass in 7–11 s. **The suite is its own load generator.** The failure
therefore needs no external cause and can fire on any machine running the documented command. It also
retro-explains the unidentified `150 pass, 1 fail` at T2's merge — I had reached for "the peer session
is load", which was true but probably not the cause.

Worth recording as process, not just fact: **two agents independently declined to re-run until green.**
T7 reported the timeout rather than quietly retrying, and I logged the T2-merge failure as
*unidentified* rather than attributing it on signature alone. Both are the behaviour TD-098 exists to
protect, and neither is what the path of least resistance suggests.

consequence · T7 · behaviour:material · governance:low
review · T7 · independent-adversarial-reviewer (worktree-isolated) · behaviour:material · governance:low

### 2026-08-25 | progress | T7 re-reviewed clean, merged, DoD ticked 2/2

Five attacks, none refuted. Two went past the brief and are worth recording because they proved things
T7's own tests did not. The reviewer built a **4-section fixture with sections stripped out of order**
(T7 used two, in order) and confirmed membership, count and ordering all agree with Shell — then
established *why* ordering is safe here structurally: both engines walk a fixed `1..13` loop, so
TD-102's ordering divergence cannot arise in this function, unlike `RuleEvaluation.findings` where order
tracks discovery. And it measured `reconcile()` directly at 20,000 iterations, pre- and post-widening,
on both the no-mismatch and 4-mismatch paths: overlapping ranges, no regression. The dominant cost is
`rulesInSection` re-running `sectionsOf(doc)` for each of 13 calls — identical before and after, and
untouched by T7.

**Absence-vs-emptiness held, verified by construction.** Only the `section-rows-mismatch` branch sets
`mismatches`, and only inside `if (mismatches.length > 0)`; no path returns `mismatches: []`, and a
probe confirmed the key is genuinely omitted rather than `undefined`-valued. One durable note, not a
finding against T7 as shipped: `mismatches?` is optional across the whole `SpecReadFail` interface
rather than narrowed to its finding via a discriminated union, so nothing stops a *future* producer
attaching `mismatches: []` to a different failure. With TD-101 in force that invariant is held by
discipline alone. It holds today because no other producer exists — worth a debt row if H07 adds any.

**Two learnings filed while fresh** (`/insights` rather than waiting for close):
- **L-169** (count **2**, promotion candidate) — a Tier G evidence block that records a hash without
  naming its method is not reproducible, and an unreproducible proof of reproducibility is worse than
  none because it looks checkable. Both sightings are this sprint, T2 and T7, and both cost a reviewer
  real time reconciling a mismatch that meant nothing. The Tier G discipline's own evidence trail
  failing the standard the discipline exists to enforce.
- **L-170** (count 1) — an ad-hoc `grep -r` walks the agent worktrees. Deriving the next `L-NNN` returned
  **L-999** against a real maximum of **L-168**: SPRINT-013's deliberate dangling-reference negative-test
  token, read out of three live worktrees. **TD-095's class at a third site, and the first that is not a
  checker** — the gate was taught to exclude worktrees, the engine still walks them (TD-100), and here it
  hit a hand-written query whose answer was about to become a durable identifier. Caught only by the
  L-105-family rule that a value entering a durable artifact earns a second query; the id would have been
  wrong by 831, and nothing downstream rejects an out-of-range one.

Sprint DoD now **18 ticked / 11 open**. Knowledge index regenerated for the two new entries.

consequence · T7 · behaviour:material · governance:low
review · T7 · independent-adversarial-reviewer · re-reviewed once · clean · behaviour:material · governance:low

### 2026-08-25 | progress | T4 re-reviewed clean, merged, DoD ticked 4/4

`--section N` matches the oracle at §1, §8, §9, §12, §13, §14 and §99 — id set *and* order — with §8's
legitimate zero rows staying distinct from §99's named failure. §14 FAILs on both sides, which is
inherited SPRINT-085 behaviour (the reader tabulates §1..§13 only) and correct under DoD 1's bar of
matching the oracle rather than of being independently sensible.

**DoD 2 produced the strongest proof in this sprint.** Baking `globalLevel` into `classifySection`'s
return reddens the structural checks while **all 28 CLI tests stay green — including both printer-only
"never contains a `level:` line" assertions.** That does not merely show the code works; it demonstrates
the criterion's own premise, that a renderer-only guard misses this defect entirely. DoD 2 asked for
exactly that and got it.

Review found the claim outran the enforcement: the comment said no field *could* occupy the key, but the
object was extensible and TD-101 leaves the interface enforcing nothing at runtime. `Object.freeze` was
added at revise — making the claim true rather than softening the wording, since freezing is the only
runtime lever available here.

**My own hypothesis about the freeze test was refuted, and the refutation is the useful part.** T4
disclosed that its `toThrow` assertion stayed green under the DoD 2 seed, because assigning to an
existing property of a frozen object throws regardless. I inferred the test might therefore be vacuous
and asked the reviewer to delete the `Object.freeze` wrapper and report what reddened. It reddens
**1 of 6** — the `isFrozen` assertion catches it. So the test is meaningful and only the `toThrow` half
is redundant against that defect class, exactly as narrowly as the builder had described it. **The
builder's self-description was accurate and my generalisation from it was not** — worth recording,
because the failure mode I was reaching for is real and common, and reaching for it was still wrong here.
The experiment was worth running: it was informative either way.

Two further claims verified rather than accepted: `Object.freeze` is **shallow** — `report.outcomes` can
still be pushed to — but the comment scopes itself correctly and the sole production consumer only
iterates it, so this is not a second overclaim; and freezing a previously-mutable return **did not break
a consumer**, established by enumerating all four files referencing `classifySection` and confirming
every access is read-only.

`--section abc` exits **2** where Shell exits **1**. Kept — T1 established exit 2 for CLI-argument
failures before this task, and ADR-027/034 freeze the *evaluation-result* exit meaning, which T4 reuses
verbatim. Now **recorded as a deliberate divergence** at the exit-mapping site per EPIC-014 D2, modelled
on ADR-036, so the H24/H25 cutover harness does not read it as a regression. It was previously absorbed;
D2 requires ruled.

Integrated suite **`175 pass, 0 fail`** across 15 files. Sprint DoD **22 ticked / 7 open**.

consequence · T4 · behaviour:material · governance:low
review · T4 · independent-adversarial-reviewer (worktree-isolated) · re-reviewed once · clean · behaviour:material · governance:low

### 2026-08-26 | progress | T5 — exit mapping proven over every SpecFinding, and a reach limit found

`runSection`'s inline `return 1` extracted into a named exported `specReadExitCode()`, typed structurally
on `{ ok: boolean }` so one rule covers both `SpecReadResult` and `MarksReadResult`, and tested at
runtime (TD-101) against all five `SpecFinding` values using the **domain's own constructors and
fixtures**, not hand-rolled literals. Commit `e706db8`. **DoD not ticked — review pending.**

Much of DoD 1 and all of DoD 2 were **already satisfied by T4** and T5 said so plainly rather than
manufacturing work: `--section 99` → exit 1 against the live oracle, `--section 8` → exit 0. It added
the coverage T4's `--section` path could not reach.

**Seed 2 is the one worth naming.** It gives `runSection` an early `if (rows.length === 0) return 1`,
and reddens **exactly one** test — the §8 control — while the §99 fail test and the mapping-level §8
test both stay green. That proves DoD 2 is load-bearing *at this boundary specifically*: a mapping that
exited 1 on everything would satisfy DoD 1 completely while silently breaking DoD 2. The two criteria
have to be tested against each other, which is precisely why §8 is written into the Plan as its own DoD
rather than folded into the first.

**The reach limit, disclosed rather than papered over.** Only **2 of 5** `SpecFinding` values are
reachable through any current CLI invocation: `--rule` never touches the spec reader, and nothing wires
`--reconcile` or marks-checking in. So three findings were proved at the mapping function, not against
the Shell oracle end-to-end. I verified this independently — `reconcile()` and `marksInStandard()` have
**zero production callers**, only their own definitions.

Filed as **TD-103**, and the reason it earns a row is not that it is wrong. § Scope defers H12+, so
domain work landing ahead of its CLI surface is the plan working. But **L-020 is explicit that shipping
is not wiring**, and nothing else tracks that these two are owed a consumer. T7 widened `reconcile` from
one finding to N this sprint and T2 built the typed marks reader this sprint; both were independently
reviewed, and neither has ever been *used*. Their correctness is first exercised at H12, by someone who
did not write them.

Also worth carrying forward: T5 found this sprint's `Layers: \`apps/cli/src\`` token has **no trailing
slash**, so `check-layers-observed.sh`'s directory-prefix match never fires for nested files — the WIP
leg reports them "changed but undeclared" until the commit lands and COORD attribution sweeps it up.
L-148's shape again (a declaration whose consumer's parser cannot read it); the other session owns that
checker and has been told.

consequence · T5 · behaviour:material · governance:low
review · T5 · independent-adversarial-reviewer (worktree-isolated) · behaviour:material · governance:low

### 2026-08-26 | progress | T5 re-reviewed clean, merged, DoD ticked 3/3

Both findings independently confirmed closed. The oracle comparison is **genuine, not theatre** — the
reviewer verified a real `sh` subprocess against a genuinely missing path, real captured stderr, both
sides consuming the *same* path variable, and the governing assertion comparing two independently
derived values rather than a literal with a spawn beside it. That mattered because the fix remedied the
reviewer's own finding, and the failure mode there is a test that satisfies the letter of a finding and
none of its intent.

`specReadExitCode` is now total: only a strict boolean `true` means success. `{ ok: "false" }` — a
truthy string that reads as false — previously returned **0**. Unreachable today, since every one of
the eight real construction sites uses a literal boolean, but with TD-101 in force the annotation
enforced nothing. **The false-assurance shape this task exists to prevent, sitting inside the function
meant to prevent it.**

**The arithmetic dispute resolved in the builder's favour, and I was half right.** I flagged that seed 1's
itemisation summed to 12 against a claimed 11. The reviewer re-ran it: **11/41 is correct**; the prose
mislabels 4 tests as 5, because `spec-not-found`'s mapping-level test was *converted* into the oracle
test rather than kept alongside it. So the total was right and the explanation was wrong — the opposite
of the usual failure, and only distinguishable by re-running. Fourth evidence-block arithmetic problem
this sprint; L-169's family.

Sprint DoD **25 ticked / 4 open** — only T3 remains.

**A near-miss worth more than the tick, filed as L-171.** On its resumed turn the harness placed T5's
reviewer in **T3's worktree**, which T3 was actively building in with **15 uncommitted staged files**.
The reviewer seeded breaks in `apps/cli/src/main.ts` inside that tree, noticed the unrelated staged
entries and a stray `_test_out2.txt`, deliberately left them alone, and verified `git status` before and
after. Nothing was lost — **but nothing in the protocol arranged that; the reviewer's own care did.** A
single `git add -A` (precisely L-168's gesture) or a tidy-up `git checkout .` would have swept fifteen
files of another agent's work into an unrelated operation or reverted them.

L-168 says dispatch every reviewer worktree-isolated. **This is its unstated second half: verify the
worktree is *unshared*.** And the failure would have been worse than L-168's original — there the
corruption at least lived in a diff; here the victim is uncommitted work with no diff to inspect and no
commit to recover from. I verified T3's 15 files are intact and `apps/cli` correctly restored.

consequence · T5 · behaviour:material · governance:low
review · T5 · independent-adversarial-reviewer · re-reviewed once · clean · behaviour:material · governance:low

### 2026-08-26 | progress | T3 reviewed — the "not a difference" ruling held; a claimed control does not exist

The attack most likely to have hidden a real divergence **survived**. T3 ruled that
`extractAllowedAssetDirs` picking up `.ai`/`.psd` as spurious "allowed dirs" is a quirk **shared** with
Shell rather than a TS defect. The reviewer extracted Shell's `assert_S12_DESIGNSRC` awk verbatim, ran
it against the live spec, and got byte-for-byte identical output. Confirmed — and worth noting that a
wrong "not a difference" call is precisely how EPIC-014 D2's *absorbed* failure mode happens, so this
one deserved the independent check it got.

Also confirmed: parity failures name the specific rule rather than a bare count, the engine is spawned
live per test, `registry.ts` remains byte-untouched (five reviews now), and `S12.DESIGNSRC`'s "same
extension INSIDE public/" control genuinely discriminates on **location** rather than passing trivially.

**The finding: `s12-secrets.ts` claims a control that does not exist.** Breaking the PEM check
(`content.includes("PRIVATE KEY")`) reddens exactly **one** test — a combined cardinality test that
merely happens to include an `id_rsa` fixture. There is no dedicated FAIL and no sibling PASS control
for the pem/key shape's *public certificate vs private key* distinction, and none for the `sa` shape;
only `env` has a full pair. **Both Shell's comment and T3's own TS comment state "the lookalike control
pins that."** The claim is in the code; the control is not in the tests.

This does not breach DoD 3's literal wording — one must-FAIL and one control per rule *id* is present,
four of each. It is being fixed anyway, because it is **T4's overclaim defect in a second location**,
and worse here: an explicit statement that the distinction is already pinned is exactly what stops the
next reader checking.

**A third unwired capability, and the pattern is now the finding.** `createF12Registry()` has zero
production callers — `main.ts` hardcodes `createBuiltInRegistry()`, so `--rule S12.*` and `--section 12`
are unreachable and **none of T3's four evaluators can be executed by anyone**. Recorded under TD-103
alongside T2's `marksInStandard()` and T7's widened `reconcile()`.

Filed **L-172**, and the reason it is not just another L-020 sighting: **L-020 is already promoted** —
*shipping ≠ wiring* sits in CLAUDE.md's Definition of Done as an explicit "Wiring check", present in
every brief this sprint — and it missed all three. The cause is structural, not careless. The check is a
**per-task** DoD item and each task's scope was correctly the domain layer; T3's `Layers:` is
`packages/standard/src` and its DoD has no wiring item, so T3 satisfied its DoD *completely* while
leaving 1,765 lines unreachable. **No task owned the gap because the gap is between tasks.** The durable
form is about placement: ask once at sprint close, across the whole Plan — *what did this sprint add
that nothing can yet call?* Eight tasks and eleven review passes could not answer that from inside a
task.

consequence · T3 · behaviour:material · governance:low
review · T3 · independent-adversarial-reviewer (worktree-isolated) · behaviour:material · governance:low
