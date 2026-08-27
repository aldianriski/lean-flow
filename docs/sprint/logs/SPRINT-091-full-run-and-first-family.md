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
