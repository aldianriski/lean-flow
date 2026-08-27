---
sprint: 091
slug: full-run-and-first-family
owner: Maintainer
last_updated: 2026-08-27
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-091 — Execution Log

> Append-only companion to [`../SPRINT-091-full-run-and-first-family.md`](../SPRINT-091-full-run-and-first-family.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-27 | scope-change | G1 sized the Plan `L`; split at the T7/T8 seam, T8–T11 deferred

**What broke.** The Plan froze at promote carrying **11 tasks / 35 DoD**. Batch G1 sized that `L`
against this repository's own record — the last eleven sprints average **4.6 tasks** and the maximum
ever completed is **8** (SPRINT-087), so 11 is 37% above the historical ceiling. The corroborating
figure is the sharper one: all **8 of SPRINT-087's tasks were revised once and none cleared first
review**, and every task here carries the same ADR-029 Tier G/X bar. G1's rule is mechanical — an `L`
splits before proceeding — so the Plan could not be run as frozen.

**Why it was not caught at promote.** It should have been. `promote`'s own size-check reads *"a
`[size: L]` **task** is split before it is rendered, never after"*, and it passed on its literal terms:
every one of the eleven tasks is `S` or `M`. The `L` here is a property of the **batch**, which only
G1 measures — and G1 runs after the Plan is frozen and committed. CONTEXT.md § Gates predicts this
exact cost in its own parenthetical. The promote report flagged that G1 *might* rule it `L` and named
the seam, then rendered all eleven anyway: the risk was named and not acted on, which is why this
entry exists rather than a cheaper pull-time adjustment. **Learning candidate → `/insights`:** a
size-check that enumerates task sizes is read as exhaustive and never asks whether the *batch* is `L`
(the L-108 family — an enumeration standing in for the structural question).

**Impact.**
- § Plan drops **T8–T11**; SPRINT-091 becomes **T1–T7, 7 tasks / 24 DoD** — at SPRINT-085's size.
- Deliverable is unchanged in kind and narrower in span: the engine runs *whole* and **F6 §4 migrates
  complete** (all five rules). § Closed-when **2** is still reachable inside this sprint.
- The **speed payoff moves to SPRINT-092** — factories, the harness conversion, parity relocation and
  the measured delta travel together as one coherent 4-task sprint rather than as the tail of an
  over-long one. `TASK-313` · `TASK-314` · `TASK-315` · `TASK-316` were never removed from the
  `TODO.md` Backlog (removal happens at close, not promote), so nothing needs restoring — they are
  promotable as-is once this sprint closes.
- **D5's overlap map narrows** and must be restated, not inherited: `scripts/qa-check.sh` was owned by
  T1 → T9 → T10 and is now touched by **T1 alone**; `docs/research/logs/qa-gate-timing.md` was T2 → T11
  and is now **T2 alone**. A stale ownership map is worse than none, because it names a commit order
  for tasks that are no longer in the Plan.
- **A4 leaves this sprint with T9.** The assumption that the ADR-family harness's git-repo construction
  survives conversion belongs to the conversion; it is re-declared in SPRINT-092, not carried here.
- **A1 stays open and stays owned by T2** — the TS-vs-Shell per-invocation claim is still unmeasured,
  and T2 still exists in this sprint to close it. The split does not defer the measurement.

**Re-confirm G2.** Required before any implementation: the design gate is re-run over the reduced
seven-task Plan with the corrected D5 ownership map, not inherited from the eleven-task sign-off. G1
and G2 were both unsigned at the time of this entry (`gates_signed:` absent), so nothing approved is
being revoked — the batch simply had not been signed yet.

consequence · T0 · behaviour:low · governance:high

### 2026-08-27 | surprise | pre-dispatch preflight HALTed; D5's ownership map was wrong

**What happened.** Step 3's pre-dispatch preflight (extracted from `dispatch.md` and run against this
Plan) returned **5 FAIL · PREFLIGHT: HALT**, so no wave was dispatched. Scope is unchanged — this is a
declaration defect, not a pivot, which is why it is logged as `surprise` rather than `scope-change`.

**D5 was restated wrongly at the split, by me, in the same sentence that warned against exactly this.**
The corrected map claimed *"no file in this Plan is touched by more than one task"*. It is false, and
the preflight named four pairs I had not seen. The claim was derived by eye from the `Layers:` lines
immediately after removing T8–T11; the mechanical check disagreed, and the mechanical check is right.
The general shape is the one this repo keeps recording: **the map was re-derived by reading, and
reading is what fails — every overlap here was found by a disagreeing tool, none by re-reading the
declaration** (L-165's family).

**Two distinct causes, only one of them a real design conflict.**
1. **A tokenisation defect I introduced.** T3 and T4 declare `packages/standard (traversal · mark-driven
   dispatch)` and `packages/standard (result domain · level arithmetic)`. The preflight's tokeniser
   reduces those parenthetical annotations to bare **`packages/`** — a prefix that contains every rule
   file — so T3/T4 collided with T6/T7 on a subtree they do not actually share. The annotation was for
   human readers and silently widened the declared blast radius. **A `Layers:` entry is machine input,
   not prose.**
2. **A genuine overlap.** T3 (flagless full run) and T5 (caller-supplied spec path) both edit
   `apps/cli` — the same argument parsing. No dependency edge existed between them, and the preflight
   is correct to refuse to parallel-build them.

**Fix applied.** Parentheticals removed from `Layers:` so declarations tokenise to the real subtrees,
and two `Depends-on:` edges added — each justified on its merits, not to silence the checker:
`T5 → T3` (both edit the CLI's argument surface; traversal lands before the spec flag) and
`T6 → T4` (a rule evaluator returns a `RuleEvaluation`, which is the result domain T4 settles). Those
two edges also transitively order T3↔T6, T3↔T7 and T4↔T7.

**Cost, stated plainly:** parallelism drops. The wave rank was `T1=0 T2=0 T3=1 T4=2 T5=1 T6=1 T7=2`
and becomes a longer chain. That is the correct trade — the preflight exists because a parallel build
over a shared file contaminates at the commit phase (L-042/L-037), and a faster wave that corrupts a
merge is not faster.

consequence · T0 · behaviour:low · governance:high

### 2026-08-27 | blocker | T1 contradicts ADR-035's zero-dependency clause; halted for an owner ruling

consequence · T1 · behaviour:material · governance:high

**Blocked before any edit.** T1 asks for a type-checker dependency to be *declared*. **ADR-035
§ "What the workspace deliberately does NOT have" already decided the opposite**, in terms that name
this exact thing:

> **Zero dependencies.** Bun executes TypeScript directly, so there is no install step and no
> `node_modules`. This is the consumer-facing decision (L-015): `plugin install` copies the repo
> verbatim, so **any** dependency here would land in every consumer's cache. **Type *checking* needs
> `typescript` and is deferred until something needs it.**

So the missing checker is a **recorded decision with a consumer-facing rationale**, not an oversight.

**Two records disagree and neither reaches the other.** `TD-101` calls the absence *"an absent guard
wearing the shape of a present one"* and never cites ADR-035; ADR-035 calls it a deliberate deferral
and predates TD-101. Whoever filed TD-101 did not reach the ADR that governs it — **L-151's family**,
and the reason the conflict survived intake, promote and G2 unnoticed.

**This is a G2 miss, named as one.** G2 recorded *"no ADR owed this sprint — nothing in T1–T7 is
hard-to-reverse-and-surprising."* That was wrong: T1 reverses a standing ADR. The G2 checklist asks
whether a task *creates* a hard-to-reverse decision; it does not ask whether a task **contradicts one
already recorded**, and nothing mechanical checks a Plan against the ADR corpus. **Learning candidate
→ `/insights`:** a design gate that only looks forward cannot see a decision it is undoing.

**One fact established before escalating, because it changes the answer.** ADR-035's stated mechanism
is that a dependency lands in every consumer's cache. `.gitignore:2` ignores `node_modules/`, and
`git status` does not see it (verified by probe). `plugin install` fetches the marketplace repo, and a
gitignored directory is not in that repo — so **for a dev-only, gitignored dependency the stated
mechanism appears not to bind.** What *would* ship is a `devDependencies` entry and a lockfile, neither
of which installs anything on a consumer who never runs `bun install`. **Stated as evidence, not as a
verdict:** `plugin install`'s copy semantics were not verified from inside this repo, and ADR-035's
authors may have had grounds not recorded there.

**Why this is not mine to decide.** T1 is declared `J1` — delegated *inside the recorded envelope*.
Reversing an ADR that G2 explicitly said was not in play is outside that envelope, and ADR-035 itself
sets the bar for revisiting as **"consumer impact, not purity"** while noting reversal *"is expensive:
deleting the TS tree is easy today, harder every family."* An owner ruling is required.

**Unblock condition:** an owner ruling on whether ADR-035's zero-dependency clause is amended to admit
a dev-only gitignored type checker. Until then T1 does not proceed. **T2 is unblocked and disjoint**
(wave 0, `docs/research/logs/qa-gate-timing.md` alone) and can run without touching this question.

**Explicitly rejected as a workaround:** gating the type check on `tsc` being present so it no-ops when
absent. That satisfies the literal DoD while producing exactly the failure TD-101 exists to name — a
check that cannot fail, reporting green (L-105). Dodging the gate is scope-changing, and scope-changing
is itself HITL.

### 2026-08-27 | scope-change | owner ruled ADR-035 amended; T1 grows to carry the amendment

**Owner ruling (2026-08-27):** amend ADR-035's zero-dependency clause to admit a **dev-only, gitignored
type checker**, then run T1. Recorded here because the launching transcript is not what a later reader
parses (L-099 · L-151).

**Grounds, as ruled.** ADR-035's stated mechanism is that *any* dependency lands in every consumer's
cache; `.gitignore:2` ignores `node_modules/` and `plugin install` fetches the marketplace repo, so the
mechanism does not bind a gitignored devDependency. ADR-035's own revisit bar is **"consumer impact,
not purity"**, and it explicitly anticipated the stance coming under pressure. The caveat stands and is
not being waved away: `plugin install`'s copy semantics were not verified from inside this repo, and
the ruling is taken on that stated basis rather than on a measurement.

**Scope impact.** T1 was "wire a type checker into the gate". It now also carries **an amendment to
ADR-035** — a governance artifact, ADR-029 Tier **P**, in a task otherwise Tier **G**. This widens T1's
`Layers:` to include `docs/adr/` and the amendment must itself satisfy **S4.APPEND**, the §4 rule
governing post-decision markers — which T7 migrates later in this same sprint. The Plan is edited after
this entry, not before.

**Not re-opened:** the zero-dependency stance for **runtime** dependencies. This admits a dev-only
checker and nothing else; `packages/contracts` and the engine stay dependency-free, and D6 (the
consumer must not be required to install Bun) is untouched.

consequence · T1 · behaviour:material · governance:high

### 2026-08-27 | surprise | the checker turned on and the tree does not type-check — 59 real errors

consequence · T1 · behaviour:material · governance:high

**ADR-037 landed, `typescript@7.0.2` + `@types/bun` installed dev-only, `node_modules` confirmed
gitignored and invisible to `git status`. Then the checker ran, and the finding is larger than TD-101
described.**

`bunx tsc --noEmit` exits **1** with **139 error lines**. Split by cause, because the two halves have
very different weight:

| Cause | Count | Nature |
|---|---:|---|
| `TS5097` — `.ts` import extensions | **80** | **Config gap, not defects.** Bun permits `.ts` specifiers; `tsc` requires `allowImportingTsExtensions`. One line in `tsconfig.base.json` clears all 80 |
| Real type errors | **59** | Genuine. `TS2532`×17 · `TS2345`×16 · `TS2769`×9 · `TS18048`×8 · `TS2339`×6 · `TS2322`×3 |

**The 59 are concentrated, not diffuse** — `tokenizer.ts` (20) plus `tokenizer.test.ts` (15) is **35 of
59 (59%)**; then `spec-reader` +test (9), `section.test` (6), `git-boundary-spec` (3), `model.test` (3),
and three singles. Ten files total.

**Not all of them are index-guard noise.** Several name modelling failures rather than strictness
pedantry: `Property 'content' does not exist on type 'HeadingBlock'`, `Property 'rows' does not exist on
type 'FenceBlock'`, `Property 'evaluation' does not exist on type 'ExcludedRule'` — a discriminated
union that is not being narrowed where it is read. And `Argument of type 'string' is not assignable to
parameter of type 'RuleId'` appears repeatedly: **the branded `RuleId` discipline SPRINT-085 recorded as
a guarantee is not holding**, which is precisely TD-101's stated impact reaching further than TD-101 knew.

**The single most useful fact from this task, recorded plainly:** `bun test` reports **266 pass, 0 fail,
784 expect() calls** on the *same tree* that carries 59 type errors. A fully green suite and a tree that
does not type-check, simultaneously. That is TD-101's thesis demonstrated rather than argued, and it is
the strongest available evidence that the deferral in ADR-035 had a real cost.

**Verified safe before proposing anything:** `allowImportingTsExtensions: true` was added and the full
suite re-run — 266 pass, 0 fail, unchanged. The config half carries no risk.

**Why T1 halts again rather than continuing.** T1 is `[size: S]`, scoped "wire a type checker into the
gate". Wiring a *blocking* leg now would red the gate on 59 pre-existing errors — committing through a
failing check, which is a named red flag. Fixing all 59 across ten files is not an `S`; it is plausibly
a sprint. Neither branch is inside what G1/G2 signed, and the third option — wiring the leg
non-blocking — is the un-failable check ADR-037 has just finished rejecting in writing.

**Unblock condition:** an owner ruling on how the 59 are absorbed. **Held, not reverted:** ADR-037,
`docs/DECISIONS.md`, the dev-only install, and the `allowImportingTsExtensions` config fix are all on
disk and uncommitted, pending that ruling.

### 2026-08-27 | scope-change | T8 added for the 59 type errors; T1's gate leg waits for it

**Owner ruling (2026-08-27):** ship the config fix and the checker now, wire the gate leg **blocking**,
and fix the 59 real type errors as their own task. Recorded here, not in the transcript (L-099).

**Plan edit.** A new **T8** — bring the TypeScript tree to zero type errors. SPRINT-091 becomes **8
tasks / 28 DoD**, which is exactly the historical ceiling G1 split this Plan down from. Accepted
knowingly: T8 is concentrated (59% of its work in one module) rather than spread across the Plan, and
the alternative is a gate leg that either reds on pre-existing debt or cannot fail.

**Named T8, not T1b, and the reason is a near-miss worth recording.** The obvious name was `T1b`. Every
guard in this repo matches task blocks with `^### T[0-9]+` — the sprint schema check
(`qa-check.sh:756`), `check-layers-completeness.sh`, and the dispatch preflight all use that exact
pattern. **A `T1b` block would have parsed as no task at all**: no schema check, no Layers/Depends-on
completeness check, no wave rank, no shared-file ownership — silently, with every guard still reporting
green on the other seven. That is L-058's family (a check that cannot fail says nothing) reached by an
innocuous naming choice. Caught by reading the pattern before writing the block rather than after.
**Learning candidate → `/insights`:** an id convention is an interface with every guard that parses it.

**Dependency impact.** T8 fixes code T3 then builds on, and both touch `packages/standard/src` and
`apps/cli/src`. `T3 Depends-on:` gains **T8**, which transitively orders T4–T7 behind it. T8 itself
depends only on T1 (the checker must exist before its output can be driven to zero). **T8 therefore
runs at wave 1 while sitting last in the file** — the block says so in its own text, because file order
is not execution order and a reader should not have to infer that.

**Preflight is re-run after this edit, not assumed.** The last CLEAR was computed against a seven-task
graph that no longer exists.

consequence · T8 · behaviour:material · governance:high

### 2026-08-27 | progress | T8 complete — the TypeScript tree type-checks, 59 → 0

consequence · T8 · behaviour:material · governance:high

**`tsc --noEmit` exits 0 with 0 errors.** Path: 139 total → 80 were a config gap
(`allowImportingTsExtensions`, landed with T1's groundwork) → **59 real**, now zero.

**Where they were, and what they actually were.** One root cause dominated: `noUncheckedIndexedAccess`
types every index read as `T | undefined`, and this codebase indexes inside bounds-checked loops where
the guard proves range but the *type* does not carry that proof. `tokenizer.ts` alone held 20 of the
59. Three loops there were restructured to bind-and-narrow once per iteration; its 12 tests pass
unchanged, so the restructure preserved behaviour rather than merely satisfying the checker.

**Not all of it was index noise, and the exceptions are the interesting part.** Regex capture groups
are `string | undefined` even when non-optional, which reached `spec-reader.ts`'s rule-id extraction —
narrowed there so a future regex edit that drops a group becomes a compile error rather than an
`undefined` id entering a frozen result. And the **branded `RuleId`** appeared repeatedly: fixtures and
expectations were comparing branded values against bare string literals. Those were fixed by
constructing valid ids in the fixtures (`makeRuleId(...)`) rather than by widening the assertions —
widening would have tested *less* than the code promises, which is how a brand stops meaning anything.

**Discrimination proof (Tier G).** Seeded `makeRuleId("S9.Z")` → `"S9.Z"` in **one element of a
two-element expectation**, so the other element is a sibling control inside the same expression.
Result: **exactly one error, at the seeded site**; the control produced none. Seed verified to have
landed before trusting it (differs from pristine, line count unchanged at 157 — targeted, not a
demolition). Restored and verified byte-for-byte: `git hash-object` = `59d11d5877f045f87a896f651c3577b54d88032b`
both before the seed and after the restore, `cmp` identical, `tsc` back to 0. **One hash convention,
named** (`git hash-object` on the working file) — never mixed with a blob hash in the same block (L-169).

**Narrowed, not silenced — measured rather than asserted.** The 115 added lines across nine files
contain **0** `as` casts, **0** `any`, **0** non-null `!`, **0** `@ts-ignore`. Every fix is a real
narrowing: bind-and-guard, `?.` comparison (which narrows the discriminated union *and* excludes
undefined in one step), or a properly constructed branded value.

**Line endings handled explicitly, not incidentally.** Six of the nine files are CRLF in the working
tree while three are LF. Edits matched against an LF-normalised copy and were written back in each
file's **original** ending, so the diffs carry only the intended change (6/1, 10/3, 10/3 on the source
files) and no line-ending churn. An earlier attempt failed its anchor for exactly this reason and wrote
nothing, which is the correct failure mode.

**Still true, and still the point:** `bun test` reported 266 pass / 0 fail *before* any of this, on the
tree carrying all 59 errors. It reports 266 pass / 0 fail now. The suite could not tell the difference —
which is the entire argument for the checker TD-101 asked for.

### 2026-08-27 | progress | T1's gate leg is wired and proven; Layers corrected per L-100

consequence · T1 · behaviour:material · governance:high

**Leg 11b is in `scripts/qa-check.sh`**, placed before leg 12 on purpose: leg 12 is the gate's dominant
cost (TD-090), so a type error should surface in ~0.2s rather than after five minutes of harnesses.
Measured cost of the leg itself: **196–217 ms** across samples — TypeScript 7's native compiler, which
is why the figure is not the seconds ADR-037's trade-off paragraph anticipated. To be recorded in the
timing log beside T2's Round, as ADR-037 requires.

**An absent toolchain FAILS rather than skipping.** That branch is ADR-037's ruling expressed as code:
a check that silently passes when its checker is missing is indistinguishable from a passing check, and
is the exact defect TD-101 names. `tsc`'s own exit status is read from a command substitution, never
through a pipe (L-120), and the error count is re-derived from its own output for the verdict line.

**Proven live against the real gate, both directions.**
- **Must-FAIL:** TD-101's recorded case seeded verbatim (`findings: "not an array"` against
  `readonly Finding[]`, `detail: 42` against `string`). The gate printed
  `FAIL typecheck: tsc --noEmit exited 1 with 3 error(s)` and its verdict line read
  `QA-CHECK: 211 pass, 14 fail`. All three errors named, including a bonus catch — the branded `RuleId`
  rejecting a bare string, which is TD-101's impact paragraph proven rather than argued.
- **Sibling control:** seed removed, same gate run: `PASS typecheck: tsc --noEmit clean (0 errors)`.

**`Layers:` corrected for T1 and T8, not defended (L-100).** `check-layers-observed.sh` named 16 files
changed by tasks that never declared them — T8's ten (the test files, `spec-reader.ts`, the two
`git-boundary` files) and T1's six (`bun.lock`, both ADRs, `DECISIONS.md`, `package.json`,
`tsconfig.base.json`). A promote-time declaration cannot name files the implementation invents; the
declarations now say what the work actually touched. Preflight re-run after the edit: **CLEAR**.

**BLOCKED — 12 review-depth FAILs, and they are correct.** The gate reports, once per logged task:
`review-depth-governance-absent … review was owed and silence is not a clean record`. Every entry in
this log records `governance:high` and most record `behaviour:material`, and **no `review · Tn · …`
line has ever been appended, because no review pass has been run.** The gate is right.

The obstruction is a standing conflict, not an oversight. `.claude/CLAUDE.md` requires that **every
Tier G change gets an outside reviewer, dispatched worktree-isolated** (L-165 ×2 · L-168), and
`orchestrator` § Review routes governance-impact work to a scoped reviewer in a fresh isolated context.
**This session operates under an instruction not to dispatch sub-agents unless the owner asks.** A
self-review by the author is precisely what L-165 records as insufficient — across two sprints every
guard defect was found by an independent pass and none by the author recalling the rule.

**Unblock condition:** an owner decision on how review is obtained for this sprint's Tier G work.
Recorded rather than worked around: ticking T1 with the gate red would be committing through a failing
check, and appending a `review` line for a review that did not happen would be a false record of
exactly the kind this log exists to prevent.

### 2026-08-27 | progress | T2 complete — Round 10, and A4 is DISPROVEN

consequence · T2 · behaviour:low · governance:high

Round 10 is in `docs/research/logs/qa-gate-timing.md`. Three findings, one of which corrects this
sprint's own assumption and one of which corrects something the author told the owner out loud.

**A4 is disproven — do NOT re-declare it in SPRINT-092.** A4 held that the ADR-family harness's
git-repo construction was its dominant term (~27s of ~30s) and would *survive* conversion, leaving only
a small engine term to remove. Measured over three samples: **engine invocation is 88–89%; all git-repo
construction, fixture setup and assertions together are ~2.3s.** The inverse of what was assumed. The
G1-split note said A4 "is re-declared in SPRINT-092" — it must instead be re-declared **as disproven**,
with Round 10 as the evidence, or 092 inherits a false premise about its own headline task.

**The error's origin was a reading, not a measurement.** `qa-check.sh`'s comment says the harness
*"BUILDS GIT REPOSITORIES — three of them"* and, separately, *"It costs 27s."* Two adjacent true
statements read as one causal claim. That reading was then repeated to the owner as fact during this
sprint's intake. **A cost attribution inherited from prose sitting beside a number is not a
measurement**, and this is the same shape as Round 6's finding, where an arithmetic residual was read as
a claim about two named rules.

**The proxy needed a second measurement to be worth anything.** First attempt compared TS and Shell on a
near-empty directory and got ~2.9× — but that measures *startup*, not workload. Given real content,
Shell's cost rises 3× (398 → 1,200ms) while TS's is flat (135 → 141ms), giving **~7.3–8.6×**. Both
figures are reported so the gap between them is on the record; the flat TS curve is the migration's
actual thesis, visible in two numbers.

**Ceiling for SPRINT-092's conversion: ≈15–17s off a ~20s harness, roughly 5% of the gate** — a
ceiling built on a proxy ratio, labelled as one, and to be *measured* rather than restated at T9/T11.

**An instrumented run that failed for the wrong reason was recorded, not retried away.** The first
instrumented copy died resolving `lib/harness-common.sh` from outside `evals/` — 0 PASS, 0 FAIL, rc=1,
150ms. A harness failing for the wrong reason still produces a number that looks like a measurement
(L-142), so the valid runs were only trusted after checking they returned 12 PASS / 0 FAIL / rc=0.

**ADR-037's owed figure is in the Round:** the typecheck leg costs **196–261ms** on a ~300s gate.
ADR-037 accepted "the gate gets slower" as a real trade-off against TD-090; it was accepted at a price
roughly three orders of magnitude above what it cost.

### 2026-08-27 | progress | T8 independently reviewed — clean, and the review did real work

review · T8 · independent-adversarial-reviewer · behaviour:material · governance:high

Dispatched worktree-isolated per L-168, because adversarial verification *writes* — it seeds breaks in
the tree it reviews, and a non-isolated reviewer plus any `git add -A` ships a corrupted guard inside an
unrelated commit. Scoped to commit `cfffaab` and its blast radius, never the repo.

**Verdict: clean — no behaviour-changing defect.** What makes that verdict worth having is the method,
not the result:

- **A differential harness**, written by the reviewer, importing pre-commit and post-commit `tokenize()`
  side by side: **24 named edge cases + 5,000 seeded fuzz trials over an 8-line grammar (LF and CRLF),
  0 mismatches.** The three restructured loops were also shown to be exact **De Morgan negations** of
  the original compound `while` conditions — proved on paper *and* exercised.
- **The reviewer seeded its own regression** (inverting `!rowLine.includes("|")`) and confirmed the
  retained suite reddens on it (11 pass, 1 fail, wrong block-type sequence), then restored and verified
  clean. That answers a question the author's own green run cannot: **the suite is not vacuous for this
  exact bug class.**
- The "0 assertions introduced" claim was **re-derived independently**, not taken from the commit.

**One nuance worth carrying forward:** the reviewer found the added `undefined` guards in
`git-boundary-spec.ts`, `spec-reader.ts` and `git-boundary-port.fake.ts` are **unreachable dead code** —
non-optional regex capture groups in a successful match are never `undefined`, and the fake's index read
is constrained by its own `Record<string, string>` type. They are type-level satisfaction, not behaviour
changes. That is the right outcome (the alternative, a reachable silent-skip, would have been the real
defect), but it means those three guards can never fire and should not be mistaken for runtime
protection.

Also confirmed: `RuleId`'s brand is compile-time only, so `String(makeRuleId(x))` and `makeRuleId(x)` are
byte-identical at runtime — the fixture changes tightened the types without weakening a single assertion.

### 2026-08-27 | progress | review record for the T0 coordinator entries

review · T0 · owner-ruling · behaviour:low · governance:high

**Correcting a record rather than editing one** (this log is append-only). Several entries above are
tagged `consequence · T0 · …` — the G1 split, the preflight HALT, the ADR-035 blocker and the T8 scope
ruling. **`T0` is not a task in the Plan**; it was used for coordinator-level events that belong to no
single `Tn`, and the effect was to create a phantom task the review checker then reported as owing a
review. The classification itself was right — those decisions *are* `governance:high`.

Each of them was independently ruled by the **owner**, not by the author: the split point, the amendment
of ADR-035, how the 59 type errors were absorbed, and the authorisation of isolated reviewers. An owner
ruling is an independent pass in the sense this check guards — the author did not self-certify any of
them. **Follow-up for the close Retro:** coordinator-level log events need either their own tag or an
explicit convention, because `T0` currently reads to the checker as an undeclared task.

### 2026-08-27 | progress | T1 independently reviewed — one real finding, fixed under the bounded retry

review · T1 · independent-adversarial-reviewer · behaviour:material · governance:high

Dispatched worktree-isolated (L-168), scoped to commits `b5ece54` and `9adb922` plus ADR-037. The leg is
a **guard**, so the brief pointed the reviewer at the one failure that matters — a false negative:
reporting PASS while type errors exist, or being unreachable so it never runs.

**No false negative found.** Seven checks came back clean, and two of them answer questions the author
could not answer about their own work:
- **The leg cannot be silently skipped.** `qb_checkpoint()` does a hard `exit 1` on a budget trip, so it
  terminates the gate rather than skipping later legs. Leg 11b sits unconditionally between the leg-11
  and leg-12 checkpoints. There is no path where it is passed over while the gate still reports overall
  PASS — which was the sharpest false-negative hypothesis in the brief.
- **The `$?` capture is genuinely tsc's.** Assignment-only command substitution, no pipe, and the script
  sets only `set -u`, so no `set -e` interaction. The L-120 trap is not present here.
- Error counting is accurate: TypeScript 7 prints exactly one line per diagnostic in captured output and
  emits no `Found N errors` summary — tested at 1, 2, 3 and 10 errors.
- `sh -n` clean, `eol: lf` confirmed, no CRLF contamination.
- The reviewer independently reproduced the must-FAIL/control pair, and its background full-gate run
  completed **exit 0** with `PASS typecheck` sitting correctly between legs 11 and 12 — end-to-end
  integration confirmed by someone other than the author.

**One real finding, and it is now fixed (the bounded builder retry, attended mode).** When `tsc` exits
nonzero while printing **no `error TS` diagnostic** — a crashed or corrupted binary, a missing runtime,
an unreadable config — the leg still FAILed correctly, but its message read
`exited 127 with 0 error(s) -- first: ` with an empty field. It described a **broken checker** as a
zero-count **code** failure. Confirmed by the reviewer by corrupting the binary.

That is the L-045 / L-057 shape exactly: *an exit code is evidence about the reporter, never about the
artifact*. The leg now separates the two, and says which one it is looking at.

**Discrimination proof for the fix.** The branch logic was **extracted from the shipped file** (not
re-typed) and driven with three stubs: clean → `PASS`; two real diagnostics → `FAIL … 2 error(s) …
first: …`; exit 127 with no diagnostic → `FAIL typecheck: THE CHECKER ITSELF FAILED …`. Two controls and
the new branch, each producing its own distinct verdict. Real tree re-checked after the edit: exit 0,
0 errors, PASS.

**Carried, not fixed:** the absent-toolchain test checks the bare name `node_modules/.bin/tsc`. On this
Windows/git-bash host MSYS resolves that to `tsc.exe` at the syscall level (the reviewer verified this
directly, and that the true-absent case still FAILs). On a POSIX shell without that resolution it would
misreport "absent" — a **false FAIL, never the false PASS** this leg exists to prevent. Left alone
deliberately: hardening it is not this task's scope, and the failure direction is the safe one. Worth a
`TD` row at close.

**Also confirmed by the reviewer, independently of the ADR's own text:** `package.json`'s
`devDependencies` and `bun.lock` *are* git-tracked and do reach a consumer, while `node_modules/` does
not — and no plugin-lifecycle hook was found that would auto-run an install. That is consistent with
ADR-037's argument and with the caveat ADR-037 states about its own unverified premise.

### 2026-08-27 | surprise | T2's review STRUCK its central figures — Round 11 corrects them

review · T2 · independent-adversarial-reviewer · behaviour:low · governance:high

**The review invalidated Round 10's headline comparison before it could reach SPRINT-092's acceptance
criteria.** That is the outcome an independent Tier G pass exists to produce, and it is worth recording
that no amount of author re-reading would have produced it.

**The defect (CONFIRMED, verified again by the author before acting on it).** `runSection()` builds its
registry with `createBuiltInRegistry()`, which registers exactly **one** rule — `S9.LOGDIR`. The F12
registry is never wired into the CLI. So `bun apps/cli/src/main.ts --section 12 .` emits
`gap … rule-unimplemented` for all four mechanical §12 rules, while Shell genuinely evaluates them
(`PASS S12.SECRETS -- … 0 shape-match(es) examined and cleared on content`). **The 141–161ms was
spec-parse plus twelve stub prints.** The "7.3–8.6×" was Shell's real work against TS's no-op, and the
entire derived ceiling — 4.3–4.9s, ≈15–17s, "roughly 5%" — is struck.

**The self-indictment, stated plainly because it is the useful part.** Round 10's agreement check
counted lines matching `S12.` and found 12 on each side. That check **cannot fail**: both engines print
one line per spec row whatever the verdict. Diffing verdicts shows all four mechanical rules disagreeing.
This is **L-108 — a substring match standing in for a claim about shape** — and the author had written
that exact warning into the reviewer's own brief (*"that is a COUNT, not an agreement"*) and then shipped
the count. The rule was loaded, correctly stated, and unfired. **L-165's content, reproduced live.**

**A second correction the review forced.** Round 10 attributed the harness's 29,971ms → 18,191ms drop to
host speed "on unchanged bytes". The harness is unmodified, but `scripts/lib/conformance-engine.sh`
changed **twice** in that window — including `298c1e1 perf(engine): memoise the git-repo probe — 6 spawns
per invocation become 1`. Verified by the author: blob hashes `ef811a3eb9c91cca` → `a5e618a5dc33eee7`
(`git show <ref>:<path> | sha256sum`, one convention). **A performance commit landed inside a window
whose entire delta was attributed to the host.** Round 8 used byte-identity for exactly this reason;
Round 10 did not.

**What survived, independently reproduced rather than merely defended:** engine dominance (the reviewer
re-implemented the instrumentation and got 89.6% / 88.2%), the A4 disproof (non-engine ~1.8–2.0s), the
12-call count, and §(3)'s range-construction method. One framing was conceded — calling the A4 error "a
reading failure" was uncharitable; `qa-check.sh`'s comment does juxtapose the two claims causally.

**T2 is re-opened: 2 of its 4 DoD are struck and un-ticked.** The proxy is **blocked on T3**, which wires
real dispatch. Re-derivation must diff **per-rule verdicts** before timing, and must count git spawns on
both sides — the reviewer notes `FsGitBoundaryPort.trackedFiles()` calls `isGitRepo()` uncached, so four
real evaluators would pay 8 git spawns against Shell's 4, which could erode much of the apparent win.

**Consequence for SPRINT-092: no acceptance criterion may cite a conversion saving.** There is no valid
measurement of one today. This is L-130 — a figure entering a frozen artifact unverified — caught one
step before it froze, by the review rather than by the author.

### 2026-08-27 | surprise | three format contracts bit in a row; `Layers:` declarations were invisible

consequence · T0 · behaviour:low · governance:high
review · T0 · owner-ruling · behaviour:low · governance:high

**`check-layers-observed.sh` was reporting T1's and T8's files as undeclared while their `Layers:` lines
named them.** Cause: line 340 builds its union from **backtick-quoted** tokens only. Every `Layers:`
line in this Plan wrote bare paths, so the checker parsed **zero declared tokens** and every changed
file read as undeclared. The archived sprints get this right — `` `packages/standard/src` (annotation) ``
— paths inside backticks, annotations outside. All eight lines are corrected.

This also **half-corrects an earlier entry in this log.** The preflight HALT was diagnosed as
"parenthetical annotations tokenise to a bare prefix". The real defect was the missing backticks; with
them, the archived format carries annotations without harm. The earlier diagnosis produced a working
fix for the wrong reason, which is its own kind of failure and is recorded rather than left standing.

**Three instances of one failure mode, in a single stretch of work:**
1. `T1b` as a task id — every guard matches `^### T[0-9]+`, so the block would have parsed as **no task
   at all**. Caught *before* writing it, by reading the pattern.
2. `sprint(091) T1+T2:` as a commit subject — the attributor matches `sprint(NNN) T<digits>:` and stops
   at the `+`, so that commit was **attributable to no task**. Caught by the gate, after committing.
3. Bare paths in `Layers:` and in `Cites:` — both unions are backtick-delimited, so both declarations
   were **invisible**. Caught by the gate, after two rounds of wrong diagnosis.

**The generalisation, and it is not "be careful":** *an identifier or declaration format is an
interface with every guard that parses it, and every one of these fails **silently and green** — the
guard does not error, it simply finds nothing and reports clean on what it did reach.* Instance 1 was
caught only because the pattern was read first; 2 and 3 were caught only because a checker disagreed.
**Learning candidate → `/insights`**, and a strong one: this is L-058's family reached through
formatting rather than through logic, three times in one sprint.

After the fix: layers completeness 16 pass / 0 fail, `PREFLIGHT: CLEAR`, waves `T1=0 T8=1 T3=2 T2=3
T4=3 T5=3 T6=4 T7=5`.

### 2026-08-27 | progress | wave 2 opens: A3 confirmed, preflight re-run, T3 dispatched

consequence · T3 · behaviour:high · governance:high
review · T3 · planned: independent adversarial reviewer, worktree-isolated

**Resume, not a fresh sprint.** `gates_signed: G1,G2 @ f24abde` stands. T1 and T8 are complete; T2 is
re-opened with 2 of 4 DoD struck and blocked on T3. The preflight was re-run rather than read off D5,
per D5's own instruction that a grown `Layers:` invalidates the prose row: `PREFLIGHT: CLEAR`, base-ref
matches live HEAD `7d71749`, waves `T1=0 T8=1 T3=2 T2=3 T4=3 T5=3 T6=4 T7=5`. **Wave 2 is T3 alone**,
and it is the critical path — T2's re-derivation, T4 and T5 all sit behind it.

**A3 is CONFIRMED, re-derived rather than inherited** (its own `Confirm:` clause required exactly
that). Two queries that had to agree, per the cross-check rule:
`sh scripts/lib/read-spec-rules.sh spec/STANDARD.md --section 4` returns **7 rows** — `S4.BAR` (Gated,
judgment-only) · `S4.ONEFILE` · `S4.APPEND` (Gated, **mechanical via git history**) · `S4.INDEX` ·
`S4.SECTIONS` · `S4.NEGATIVE` (Structural, mechanical) · `S4.NOINVENT` (Gated, judgment-only). The
independent second number: `--reconcile` against §14's own counts table prints `PASS  §4    7 rules`.
**S4.APPEND is §4's only git-defined rule** — the sole row whose mark names git. This also reconciles
§ Scope's "all five rules": five mechanical, two judgment-only, and the judgment pair is not migrated.

*Recorded because a query error nearly stood:* the first attempt ran `read-spec-rules.sh` with no spec
argument and returned **zero** `S4.` rows. Zero is exactly what a genuinely empty section returns, so
had it been acted on it would have read as a finding about the spec rather than about the invocation.
It was caught by the second query disagreeing, which is the point of the rule (L-105 family).

**Review depth for T3, logged at the moment the skip table was consulted** (TD-092 — the outcome alone
is unreachable to `check-review-depth.sh`). T3 is Tier G, `class: execution`, size M, risk med;
behaviour impact **high** (a whole-repository traversal that does not exist today) and governance
impact **high** (it is the conformance engine — a guard whose false negative is silent by
construction). Both the skip table's governance arm and CLAUDE.md's standing Tier G rule land on the
same depth: **an independent adversarial reviewer, dispatched worktree-isolated** (L-168 — adversarial
verification writes, so a non-isolated reviewer plus any `git add -A` ships a corrupted guard inside an
unrelated commit). Not a self-pass: across the last two sprints every guard defect here was caught by
an independent pass or a disagreeing second number, and **none** by recalling the governing rule.

**Dispatch note.** The builder was briefed with Round 11's defect as ground truth — `runSection()`
wires `createBuiltInRegistry()`, which registers only `S9.LOGDIR`, while `createF12Registry()`'s four
rules are never connected — and told that wiring real dispatch is T3's core job precisely because T2's
blocked re-measurement depends on it. It was also handed the design problem T3 actually turns on:
`Registry<TPort>` is single-port, a whole-spec traversal must cross `SprintDirPort` and
`GitBoundaryPort`, and DoD 3 forbids resolving that with a switch. `built-in.ts`'s own header predicted
this seam and deferred it. The builder owns no sprint-file writes: it returns its Log entry in its
report (SPRINT-063's two-copies failure), and the coordinator writes here.

### 2026-08-27 | progress | T3 independently reviewed — three findings, and the gate disagreed with itself

review · T3 · independent-adversarial-reviewer (worktree-isolated) · behaviour:high · governance:high

**All three DoD are substantively TRUE, re-derived independently rather than accepted.** The reviewer
rebuilt the proofs rather than reading the builder's: it constructed the real row-by-row mark diff for
all 100 rules against `read-spec-rules.sh` (0 mismatches) and against `conformance-engine.sh`'s own
live-spawned mark annotations for the 55 rows carrying them (0 mismatches), and it performed DoD 2's
seed-one-out live — which **the builder never actually did**, having tested only a rule that was
already gapped. Three findings, one bounded retry fired.

**Finding 1 — DoD 1's shipped proof is weaker than the DoD as written. CONFIRMED, and it is L-108 for
the second time in this sprint.** The test compares aggregate mark-category **totals** parsed from
Shell's `counts:` line, plus true per-rule verdicts for 6 of 100 rows. The reviewer built the
counter-example and ran it: swap two rules between `implementation-directed` and `restated` and both
assertions still pass while both rows are wrong. Round 11 struck Round 10 for exactly this — a count
standing in for a claim about shape — and the coordinator's dispatch brief for T3 quoted that entry as
ground truth. **The rule was loaded, correctly stated, and unfired, in the very task briefed on it.**
The cheap oracle that gives the exact row-by-row answer (`read-spec-rules.sh`) is named in T3's own
`Cites:` and went unused. L-165's content again: no author re-reading produced this; an independent
pass did.

**Finding 2 — the composed seam silently shadows a duplicate rule id. CONFIRMED design gap.**
`composeFamilies` is first-family-wins with no collision detection — tested as behaviour, guarded
nowhere. It is the single place in the diff that breaks this codebase's otherwise-universal
name-yourself-loudly rule (`gap()` names itself; `BoundDispatcher.dispatch` throws rather than
returning `undefined`). Scenario: during a strangler handoff F5 registers `S3.SCHEMA` while an
earlier-listed family still holds it — the second evaluator becomes dead code forever, no test failure,
no warning. **This seam is what F5 · F2 · F1 · F7 all plug into**, so it is closed now rather than
after. Retried.

**Finding 3 — ADR-023 is miscited, and the coordinator verified it independently.** `main.ts:246`
cites ADR-023 for "the Standard ships beside the engine, never vendored". ADR-023 is *"CONTEXT.md
becomes a consumer of the extracted spec"* — governance/docs, no such language. `grep -rl 'beside the
engine\|vendored' docs/adr/` returns **nothing**. The same miscitation pre-exists at
`spec-file-reader.ts:51` from SPRINT-087 T4 and was inherited, not introduced. Both fixed in the retry;
recorded here so the pre-existing one is not silently swept up with T3's.

**The gate disagreed with itself across an environment boundary — a new `high` debt row.** The reviewer
reported `QA-CHECK: 213 pass, 1 fail` against the coordinator's `214 pass, 0 fail`, on the *same
commit* and a clean tree. Both numbers are correct: `gen-index.sh --check` uses a byte-exact `cmp -s`,
`.gitattributes` pins `*.sh eol=lf` but nothing for `*.md`, and `core.autocrlf=true` — so a **fresh
worktree** materialises `docs/knowledge-index.md` as CRLF while regeneration always emits LF. `git
diff` shows zero content difference. Neither file is touched by `4e5b320`. Filed **TD-113 (high)**: the
population most exposed to this false FAIL is exactly the worktree-isolated Tier G reviewers whose job
is to trust the gate. **This is L-067/L-081 — diff the environments before the code — and it was caught
only because two numbers disagreed.** Also filed **TD-114 (medium)**: `run-foreign-repo-fixtures.sh`,
the harness whose whole subject is a repo that has never seen lean-flow, never invokes the TS engine at
all — L-166's shape, and the reason it surfaced is that it was the natural place to look for coverage
of T3's foreign-repo fix.

**REFUTED, and worth recording as refuted:** the `classify.ts` extraction is behaviour-preserving (the
coordinator flagged it as an agrees-by-construction risk — the reviewer proved it independently, every
branch textually unchanged); `sectionNumberOfRuleId` throws loudly on any id outside `^S(\d+)\.` and no
id in the Standard breaks it; the gap text is genuinely NAMED, carrying both rule id and mark; and the
`BUNDLED_SPEC_PATH` fix is correct and live-reachable, proved by revert-and-redden.

**Held out of the retry deliberately, not forgotten:** `runSection()`/`--section`, `evals/`, and the
`gen-index.sh` CRLF issue. A bounded retry is bounded; the first is a scope question (below), the other
two are outside T3's `Layers:` and now carry debt rows.

### 2026-08-27 | blocker | T2 is NOT unblocked by T3 — wave 3 must not assume it is

**Round 11 recorded T2's re-derivation as "blocked on T3, which wires real dispatch." T3 has landed and
T2 is still blocked.** T3 wired the **flagless** full run; `runSection()` is byte-for-byte unchanged and
still hardcodes `createBuiltInRegistry()`, so `bun apps/cli/src/main.ts --section 12 <repo>` continues
to emit `rule-unimplemented` for all four F12 rules. Verified live by the reviewer, not inferred.

**Why this matters more than a leftover:** Round 10's struck measurement was taken specifically on
`--section 12`. That comparand is *untouched*. **If T2 resumes on the invocation its own log names, it
reproduces the struck defect a third time** — Shell's real work against TS's no-op, with a fresh set of
numbers that look plausible.

What T3 *did* deliver is a valid comparand of a different shape: the flagless run dispatches all five
wired rules for real, confirmed live. So T2 is not blocked on capability any more — it is blocked on a
**decision** T2 cannot take for itself: re-derive against the flagless full run (a different invocation
shape than its own Plan text names, and one whose per-invocation cost includes traversing 95 rules it
will gap), or extend `--section` to compose families the way the flagless path now does (~2 lines by
the builder's estimate, but scope T3's DoD does not cover and the coordinator declined to widen at
retry). Either way the re-derivation must diff **per-rule verdicts before timing anything**, and count
git spawns on both sides — the reviewer's standing note that `FsGitBoundaryPort.trackedFiles()` calls
`isGitRepo()` uncached still stands, and four real evaluators paying 8 git spawns against Shell's 4
could erode much of the apparent win.

**Surfaced to the owner rather than decided here.** T2 is `J1`, but its authority covers *executing*
its Plan, not *rewriting which invocation its acceptance is measured on* — that is a scope change to a
frozen DoD, which is HITL by ADR-021 and the L-088 rule against quietly reinterpreting a DoD execution
invalidated. Wave 3 does not start until it is answered.
