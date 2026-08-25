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
