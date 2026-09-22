---
sprint: 104
slug: the-gates-own-blind-spots
owner: Maintainer
last_updated: 2026-09-22
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-104 — Execution Log

> Append-only companion to [`../SPRINT-104-the-gates-own-blind-spots.md`](../SPRINT-104-the-gates-own-blind-spots.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-22 | progress | T1 — preflight, G1/G2 signed, blast radius re-derived at 2 (A1 holds)

Run opened as attended `sprint-bulk`. Owner ruled the wave **T1 → T2 → T3 sequential, T4 parked**,
against a host at 0.41 GB available / 35.3 of 38.8 GB commit charge — roughly 7x below A3's ~3 GB
target, so T4's measurement would have measured swap (SPRINT-103's own pre-locked ruling, not a new one).

Pre-dispatch preflight: cycle clean · ownership per D2 · base-ref clean. One preflight scare cleared
by derivation rather than assumption: SPRINT-104's `plan_commit..HEAD` holds **21 commits, 18 of them
SPRINT-105's**, because 105 was promoted and closed on top of an already-promoted 104. `commit_sprint()`
scopes them out by subject ownership and leg 15 prints
`PASS ... layers observed ... base 5216c69`. No action needed — recorded so the next reader does not
re-discover it.

**A1 confirmed, no `scope-change`.** Probe config over `scripts/**` + `evals/**` re-derived the blast
radius as **2 errors, both `TS18047` in `scripts/qa-verdict.ts` (147,5 · 151,5)** — identical to the
figure frozen at promote. Cross-checked by two selection rules that must agree: tsc's own program
enumeration (`--listFiles`) and a filesystem walk (`find`), **26 == 26, identical sets**. The first
attempt returned 28 and was wrong: `--listFiles` prints diagnostics to stdout too, and a path-grep
counted the two error lines as files (L-108, caught by the disagreeing second number).

consequence · T1 · behaviour:material · governance:high

### 2026-09-22 | progress | T1 — TD-169 closed: the typecheck leg's program now holds both trees

Root `tsconfig.json` `include` extended with `scripts/**/*.ts` + `evals/**/*.ts`. **No `qa-check.sh`
edit was required** — the leg runs a bare `tsc --noEmit` against the root config, so extending the
config moved the population without touching the leg (see the open DoD-7 question below).

The two `TS18047` sites fixed with optional chaining. Checked rather than assumed that this is not
fail-open: `judgeOutput("")` returns `ok: false` ("a verdict-less run is reported as a failure, never
inferred as 0 fail" — TD-143), so an absent stream cannot become a green gate. Reasoning recorded at
the code, not only here.

Evidence (DoD 2): the leg's own program contains `scripts/lib/check-layers-observed.ts` = 1 and
`evals/qa-verdict.test.ts` = 1; 26 files from the two new trees alongside 106 from `apps`/`packages`/`test`.
Evidence (DoD 3): the leg's **own printed line** — `PASS  typecheck: tsc --noEmit clean (0 errors)`.
That line was printed before this change too; what makes it *true* now is DoD 2's population proof,
which is the entire point of TD-169.

### 2026-09-22 | progress | T1 — Tier G seeded-break proof, `scripts/lib` arm PASSED

Hash convention for this sprint, stated once and used throughout (L-169): **`git hash-object <path>`
compared against `git rev-parse HEAD:<path>`** — both LF-normalized blob ids, reproducible on a CRLF
checkout. Verified to match on all four seed/control files before being relied on. A raw `sha256sum`
of the working file does **not** match the blob here; that is the trap, and it is why the method is
stated rather than assumed.

Seed A — `scripts/lib/check-prose-density.ts`, control `scripts/lib/check-authority.ts`:
- landed: `f6e0bbc5…` → `2a63c699…`
- targeted: +1 line, non-empty, a genuine `TS2322` **type** error (not a syntax demolition)
- leg reddened, its own printed line naming the seeded file:
  `FAIL  typecheck: tsc --noEmit exited 1 with 1 error(s) -- first: scripts/lib/check-prose-density.ts(262,7): error TS2322`
- sibling control named **0** times — stayed green
- restored to `f6e0bbc5…`, byte-identical to HEAD under the stated convention

### 2026-09-22 | surprise | the gate is not deterministic on this host, and its budget margin is ~5%

Two observations from the seed-A run, neither caused by the seed, both outliving T1:

**(a) A fixture failed with an empty capture.** `run-qa-budget-fixtures.sh` fixture
`over-ceiling-run-prints-info-and-fail-stays-0` reported `FAIL ... got:` with an **empty** got-value
during the gate run, then **passed standalone** on the restored tree (`RESULT pass=0 fail=0`). Not
attributable to the seed. An empty capture on a host at 0.41 GB free points at resource pressure, but
that is a hypothesis and was not verified. It matters beyond this task: this is L-142's "red for the
wrong reason", and the same empty capture landing on a **must-FAIL** fixture would be green for the
wrong reason — silent by construction, which is the Tier G failure mode.

**(b) The budget has ~5% headroom.** The seed-A run took **547s against the 520s `QA_BUDGET_SECONDS`
default** and did not truncate — 27s of margin, on a gate SPRINT-093 sized at ~469s. T4 owns
re-deriving this figure and T4 is parked, so absent a ruling the sprint closes with the gate sitting
just under its truncation threshold and nobody having re-measured it.

### 2026-09-22 | blocker | T1 — Tier G `evals` arm incomplete: gate run killed for low memory

Seed B — `evals/qa-verdict.test.ts`, control `evals/authority.test.ts` — landed and verified targeted
(`0b89e9df…` → `b89adbf3…`, +1 line, `TS2322` at 257,7, control named 0 times). The confirming gate
run was **killed by the harness for critical low memory** before the typecheck leg printed its line.

**The seed was restored immediately** — `evals/qa-verdict.test.ts` back to `0b89e9df…`, byte-identical
to HEAD under the stated convention, and `grep -rn "__seed_type_error"` over `scripts evals apps
packages test` returns nothing. This is L-137's exact recorded failure (a timeout leaving a seeded
break in a shipped file) and it did not happen here only because restoration was treated as the first
action on the kill, not a later cleanup step.

**T1 halts here, at DoD 4, un-ticked.** The `scripts/lib` arm is proven; the `evals` arm is not. What
remains unproven is specifically the *population* half (L-186): that the leg reddens for the second
tree, not merely the first. DoD 2 shows an `evals/*.ts` file is in the program and the standalone
`tsc` invocation the leg runs reports the seeded error — but the leg's own printed FAIL line for the
`evals` arm has not been observed, and inferring it from the `scripts/lib` arm is the substitution
this sprint exists to stop.

Not restarted: the harness advises memory may still be short, and re-running is the owner's call.

### 2026-09-22 | scope-change | T1 DoD 7 ruled **n/a** — its premise dissolved, the work was not skipped

**What broke.** DoD 7 reads *"Edit to `scripts/qa-check.sh` committed as a reviewable diff before
being applied (D2 · L-151)"*. It presupposes that putting `scripts/` and `evals/` inside the
typecheck requires editing the leg. It does not: the leg runs a bare `tsc --noEmit`, which resolves
the **root** `tsconfig.json`, so extending that file's `include` moved the population with zero
changes to `qa-check.sh`. The criterion went stale against execution, not against scope — the Plan's
own § Scope and Acceptance are untouched and fully met.

**Impact.** One DoD is unsatisfiable as literally written. The two ways to make it *look* satisfied
were both rejected: manufacturing a `qa-check.sh` edit (adds a second config surface to drift, purely
to dress a criterion) and silently re-reading the words to fit what was built — which is the failure
L-088 names, and this sprint's § Red flags calls out by name.

**Ruling (owner, 2026-09-22): tick `[~]` n/a with the reason recorded.** D2 itself is untouched and
still binds — T2 and T3 both genuinely edit `scripts/qa-check.sh` and both go through diff-then-apply
in merge order.

**Re-confirm G2.** No design change. T1's `Layers:` named `scripts/qa-check.sh` as a prediction;
implementation did not need it, which is L-100's expected case (a `Layers:` is a live declaration,
not a frozen prediction to defend) and is why leg 15 still passes on the narrower file set.

### 2026-09-22 | park | T4 parked at wave open — host memory, pre-locked ruling

T4 parks with its unblock condition intact: **host free memory above ~3 GB**. Measured at wave open:
0.41 GB available, 35.3 of 38.8 GB commit charge. A3's confirm path and SPRINT-103's own ruling both
say measure nothing under paging — a total taken there measures swap. Nine DoD carry forward.

Note for whoever resumes: T4's subject got sharper during T1. The gate measured **547s against the
520s `QA_BUDGET_SECONDS` default** on this host — 27s of margin, ~5%, without truncating. That is a
live figure for T4's Round and a reason not to let the parked task drift.

### 2026-09-22 | progress | T1 DoD 5 — retained population fixture, discrimination proven

`evals/typecheck-population.test.ts` + `evals/fixtures/typecheck-population/tsconfig.narrow.json`.

**What it guards, and why it is not the typecheck leg again.** The leg asserts a property of the
*verdict* (`tsc` reported no errors) and was hardened twice so a missing checker could not read as a
pass (ADR-037 · TD-101). Neither is a property of the *set the verdict ranges over*. This fixture
asserts the set: named members from both trees are in the program, both arms separately, with the
original three trees as a control. L-186's axis — the cases vary the **selection rule** (the tsconfig
handed to tsc), never the verdict.

**Cheap by construction.** `--listFilesOnly` enumerates the program without typechecking it (~1s vs
~6s). The whole file runs in **2.0s**, which is what made the discrimination proof affordable to
actually run rather than argue about.

**Placement is a cost ruling, not an accident.** It runs in the `bun test` phase, deliberately NOT in
qa-check.sh leg 12: the gate measured 547s against a 520s budget on this host, and an always-on
harness shelling to tsc twice would spend that margin. Recorded in the file's own header so the next
maintainer sees the ruling, not just the placement (L-151).

**Wiring derived, not assumed (L-020).** A bare `bun test -t "gate typecheck population"` — no path
argument — ran the 7 cases across 48 discovered files, so `package.json`'s `test` script
(`gate && bun test`) reaches it end-to-end. The `evals/run-*` registration guard at qa-check.sh:1333
globs `run-*.sh|ts` and `selftest-*.sh` only, so a `*.test.ts` neither needs registration nor trips it.

**Discrimination proof (L-142), run rather than asserted.** Seed: root `tsconfig.json` reverted to its
pre-fix include. The seed is **byte-identical to the real pre-fix artifact** — `45082de0…` →
`5ad9f2b8…`, and `5ad9f2b8` is the exact blob T1's own commit replaced (visible as `index 5ad9f2b..45082de`
in that diff). That is stronger than a synthetic one-line break and is L-166's bar: the guard is
pointed at the artifact the debt row cites, not merely at a shape. Note the line-count rule is
deliberately not applied here — "within one line of pristine" exists to stop a demolition standing in
for a discrimination, and a verbatim historical config is the opposite of a demolition.

Result under the seed: **3 fail, 4 pass**. The three reddened are exactly the three LIVE population
assertions; the four green are the sibling controls — the original-three-trees control and all three
must-FAIL cases, which read the fixture config and are correctly unaffected. Restored to `45082de0…`,
byte-identical to HEAD under the stated convention.

### 2026-09-22 | surprise | the gate's TEST population is blind the same way its TYPECHECK population was

Found by running `bun test` — which no gate leg does — while chasing an unexplained failure.

**Finding 1: lean-flow's own gate-discovery guard has reported that this repository bypasses its
declared gate, continuously, since SPRINT-097 T4.** `test/gate-discovery/discovery-order.test.ts`'s
case *"the rung-1 command still runs the gate `.gate-command` declares"* asserts `bypassed === false`
and gets `true`. Deterministic, reproduced standalone in 7.7ms.

Cause, traced rather than guessed. `invokes()` splits the discovered command on `&& || ; |` and
requires a segment to EQUAL the declared command or start with it plus a space:
- before `3404422` (SPRINT-097 T4): `sh scripts/qa-check.sh && bun test` → segment 1 is exactly the
  declared command → PASS
- after: `bun scripts/qa-verdict.ts sh scripts/qa-check.sh && bun test` → the gate became an
  ARGUMENT to the verdict wrapper, so no segment equals or starts with it → `invokes()` false →
  `bypassed: true` → FAIL

T4's change was correct on its own terms (it made a verdict-less run fail loudly, TD-143). It simply
re-shaped the very string another guard pattern-matches, and nothing connected the two. This is
L-166 exactly — a guard keyed to a shape the system no longer emits — and L-020's shipping-≠-wiring
at the seam between two sprints. It fails RED, not green, so it is not silent; it is merely unread,
because the only phase that runs it is one no sprint invokes.

Not fixed here: out of T1's scope and out of this sprint's § Scope (D6 — same checks, same coverage).
Recorded for the close Retro as a `TD-NNN` candidate. Id deliberately NOT assigned now: the maximum
must be derived at filing with `.claude/worktrees/` excluded (L-143 · L-170).

**Finding 2, and it corrects this task's own DoD 5 claim.** `qa-check.sh` reaches a `.test.ts` file
only through an explicit wrapper harness registered in `eval_harnesses_always` — there are nine such
wrappers, each a thin `bun test <one file>`. The registration guard at qa-check.sh:1333 globs
`evals/run-*.sh|ts` and `selftest-*.sh` only, so a bare `*.test.ts` is neither required to register
nor reported when it does not.

`evals/typecheck-population.test.ts` has no wrapper. It therefore runs in `bun test` and **not** in
`sh scripts/qa-check.sh`, which is what `promote` and `close` run (`QA_FULL=1`). The wiring claim in
the DoD-5 entry above was derived against `bun test` discovery and is true of that path only; it does
not establish that the guard fires where this repo actually verifies. A retained guard nothing runs
is L-105's absent guard wearing the shape of a present one, so the earlier entry overstated it.

The cost reasoning in that entry was also wrong in magnitude: the whole file runs in **2.0s**, which
is 0.4% of the 520s budget, not a threat to it. The placement argument it recorded does not survive
its own measurement.

Wiring it requires adding a wrapper and registering it in `scripts/qa-check.sh` — which would make
T1's DoD 7 (`the qa-check.sh edit goes through D2's diff-then-apply`) applicable again, reversing the
`[~] n/a` ruling taken earlier today. That is an owner call, not a silent correction, and is where
T1 stands.
