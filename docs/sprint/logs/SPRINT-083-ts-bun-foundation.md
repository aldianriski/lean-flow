---
sprint: 083
slug: ts-bun-foundation
owner: Maintainer
last_updated: 2026-08-24
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-083 — Execution Log

> Append-only companion to [`../SPRINT-083-ts-bun-foundation.md`](../SPRINT-083-ts-bun-foundation.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A pivot that shifts scope is logged here as a `scope-change` entry —
> what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-24 | promote | Plan locked — EPIC-014's first member sprint

T1–T4 promoted from TASK-267…270. `plan_commit: 88d31d8`. Opened alongside **EPIC-014** (reference
engine) and **EPIC-015** (execution autonomy), split from
`docs/research/LEAN-FLOW-PRE-EPIC-FOUNDATION-HARDENING-V3.md`'s 40-task set by substrate. H32/H33/H34
are excluded from EPIC-015 because SPRINT-082 shipped them as T1/T2/T3.

Governance review: L-promotion none (140 headings · 99 `count:` · 97 `promoted:`; one row at count ≥ 2,
already promoted) · TD aging 22 of 25, none `severity: high`, carried by owner ruling · TD-073's
deletion clock executed (40 lines, open count verified unchanged before the write) · one §2 soft breach
carried as **TD-082**, because a soft cap has no exemption route by design.

### 2026-08-24 | progress | G1 signed — 5 of 5, fast-path deliberately NOT taken

All four tasks are `origin: manual`, so the full checklist ran rather than the one-line confirm. Origin
is a fact about where a task came from, not a self-assessment: these were authored from V3 by the
session that promoted them and never met `/task-decomposer`'s intake grill, so there is no prior scope
agreement for a fast-path to re-confirm.

**All five `assumes:` rows confirmed at the gate rather than deferred to their tasks**, since an
unconfirmed assumption blocks G2:

- **A1** ✓ `bun 1.3.14` · `node v24.16.0`.
- **A2** ✓ all six TS artifacts absent (`package.json` · `bun.lockb` · `tsconfig.json` · `apps/` ·
  `packages/` · `test/`).
- **A3** ✓ **the hazard is real.** Walked the discovery order in `dispatch.md`'s own terms: rung 1 (six
  manifest shapes) misses · rung 2 (`Makefile`/`justfile`) misses · rung 3 (CI config) misses · rung 4
  reads `.gate-command` → `sh scripts/qa-check.sh`. T2 creates the first rung-1 hit in this
  repository's history, and rung 4 is explicitly last.
- **A4** ✓ **and it narrowed the risk while adding a constraint.** `check-manifest-lockstep.sh` globs
  `.*-plugin/*.json` and `*-plugin/*.json`; a **root** `package.json` matches neither, so it is not
  enrolled. But the checker's own comment reads *"Adding a directory enrolls it automatically"* — so
  **no new directory may be named `*-plugin`**. Carried into G2 as a constraint.
- **A5** ✓ all three rule counts reproduce: `read-spec-rules.sh` **100** unique IDs · `Sn.NAME` grep
  shape **79** · EPIC-004's published **51 of 51**.

### 2026-08-24 | scope-change | T2 — G1 adds a conformance baseline to a Plan frozen minutes earlier

**What broke.** The G2/G1 shared-file and blast-radius map is built from each task's `Layers:`, so it
can only see *files a task declares*. It cannot see a **behaviour** no task declares. Adding three new
top-level trees (`apps/` · `packages/` · `test/`) may move this repository's **conformance report**,
which currently sits at `level: Gated` — and no task in the Plan names it.

**Why it would not have surfaced on its own.** Every task's final DoD reads `sh scripts/qa-check.sh`
reporting `0 fail`. **TD-081**, filed at SPRINT-082's close, records precisely that conformance FAIL
rows do **not** reach that tally — the conformance leg is informational in it. So a conformance
regression caused by T2 would sit behind a green verdict line that four DoD criteria are pointed at.
This is L-105's family at the gate that owns it: the guard exists, and it fires where the change cannot
reach it.

**Impact.** T2 gains a baseline capture as its first step and an assertion as its last. No task is
added, removed or re-scoped; T1, T3 and T4 are untouched. Cost is two conformance runs.

**Re-confirm G2.** Owner ruled at G1 sign-off (2026-08-24): *add a baseline capture to T2*. The
alternative offered — ruling the three trees outside the engine's doc-set surface — was declined
because it would have been a claim about the engine made without reading it.

**The Plan edit follows this entry, not the other way round.** G1 runs *after* `promote` freezes the
Plan (`88d31d8`), which is the ordering CONTEXT names as the reason a G1 finding costs a
`scope-change` at all.

### 2026-08-24 | progress | G2 signed — D4/D5/D7 ruled; the reachability test fires on its first use

`gates_signed: G1,G2 @ 2dd1edb` (the tree the gates reviewed, per SPRINT-082's precedent; the gate pass
then amended the Plan, and that amendment is the `scope-change` entry above).

**D4 was answered by reading §2, not by defaulting.** §2 is a documentation lifecycle standard
(ADR-012) enumerating four scopes — Root files · `spec/` · `.claude/` · the `docs/` tree — with **no
code-tree rows at all**; `scripts/`, `evals/` and `skills/` already sit outside it here. So `apps/`,
`packages/` and `test/` owe no rows and no placement ADR. **D5** rules the run mode attended, naming
what that forecloses rather than leaving it implicit. **D7** rules implementation inline, and records
that Review is therefore a structured self-pass with no fresh-context reviewer.

**Shared-file ownership map** (built before the first task): `package.json` T2→T3 ·
`test/architecture/dependency-direction.test.ts` T3→T4 · `docs/DECISIONS.md` and
`docs/knowledge-index.md` T1→T2. No task pair is disjoint, so the run is **fully sequential**
T1 → T2 → T3 → T4 — no parallel worktrees, and L-042's per-hunk staging rule binds intra-tree.

**Two findings from the verification-reachability test SPRINT-082 T3 shipped into G2 — its first live
use, and it caught something both times it was applied:**

1. **`sh scripts/qa-check.sh` reports `0 fail` appears as the closing DoD of T2, T3 and T4, and does
   not PROVE what its position implies.** It EXISTS, RUNS and REACHES — but what it reaches is docs and
   governance, not `.ts` files. Green qa-check proves *no governance regression*; TypeScript
   correctness is proven by `bun test` and the fitness suite. The criterion is kept (the governance
   claim is real and worth holding) and is **not** to be read as validating the workspace. This is
   exactly the EXISTS-but-does-not-REACH shape L-136 records.
2. **T2's `Layers:` omitted `docs/DECISIONS.md` and `docs/knowledge-index.md`,** both required by
   ADR-035. Corrected at the gate rather than at execution — L-100 makes a `Layers:` correction a live
   declaration, not a `scope-change`, so it is logged and declared without a Plan amendment. The same
   edit **removed** `spec/STANDARD.md` §2 from that list, since D4 closed the conditional path.

Judgment/manual verification left as legitimate where no mechanical method exists (the test does not
force a checker into being): T2's four-rung discovery walk, T1's denominator ruling, and T3's
seeded-break targeting are all human judgements and are recorded as such.

### 2026-08-24 | scope-change | T1 — DoD-4's method is falsified; the Finding-ID half becomes a named gap

**What broke.** DoD-4 read: *"Finding IDs are enumerated from the live engine, not from memory — Verify:
the list is produced by a command recorded in the ADR, and a second, differently-shaped query agrees on
the count."* The criterion is sound. **The premise underneath it is false: no such command exists.**

`conformance-engine.sh` emits findings through at least **four** distinct message shapes, with the id
as free text at a position that varies by call site:

```
bad "conformance: <id> -- …"      bad "$_rid-- <id>: …"
bad "S13.TRAILERS   -- <id>: …"   bad "<id>: $p -- …"
```

Three successive anchored extractions returned **4**, then **14**, then a wide net of **78** tokens
mixing real ids (`adr-edited-after-decision` · `changelog-not-rotated-at-minor` · `core-file-missing`)
with prose (`append-only` · `comma-separated` · `cost-free`). **Every wrong answer was caught only by a
disagreeing second query** — the 14 was falsified by checking one id known from SPRINT-082's own logs,
`dod-criterion-names-no-check`, which is in the engine and which the anchor missed. Without that
check the contract would have frozen a confidently incomplete list, and nothing downstream would have
noticed until a cutover.

**Why this is a scope-change and not a quiet re-read.** DoD-4 could be satisfied *verbally* by recording
one of the falsified commands and its number. That is precisely the L-088 failure — re-reading a
criterion to fit what was built. The criterion went stale because execution disproved its premise, so
it gets an owner ruling, not a reinterpretation.

**Impact.** T1 freezes the **rule-ID** surface (denominator **100**, derived and reconciled two
independent ways) and records the **Finding-ID** surface as a named gap closing at H07/H08, where
findings become typed data rather than strings. No task is added or removed. **The accepted cost is
stated in ADR-034 rather than buried:** until H07/H08 a family can pass rule parity while a finding id
drifts undetected.

**Alternatives rejected, each because it collides with a standing ruling:** editing the engine to
self-report (D2 forbids touching Shell this sprint) · harvesting from the fixture corpus (runs the eval
suites this session is not running) · hand-reconciling 78 tokens (a judgement call, not the *command*
the criterion asks for).

**Re-confirm G2.** Owner ruled 2026-08-24: *freeze Rule IDs now, defer Finding IDs.* The Plan edit
follows this entry.

**This is a finding about the migration, not only about the task.** A compatibility contract that cannot
enumerate half its own surface is the stringly-typed failure V3 §19 names, and it is the clearest
evidence yet for the typed `FindingId` EPIC-014 exists to build.

### 2026-08-24 | progress | T1 complete — 5 of 5; rule surface frozen at 100

`docs/adr/ADR-034-semantic-compatibility-contract.md` · `evals/fixtures/compat/rule-ids-v0.10.0.txt`
(100 rows / 100 unique ids, regeneration `cmp`-identical) · `docs/DECISIONS.md` · regenerated
`docs/knowledge-index.md`.

**The denominator was derived, and all three circulating numbers are now accounted for** — which was the
point, because an unexplained remainder is where a wrong denominator hides. **100** is the contract's
(`51 + 49 = 100`) · **51** is *checkable* (`mechanical 40 + split 11`, agreeing independently with
EPIC-004's `45 in-engine + 6 standalone`) · **79** is disproved: the `S[0-9]+\.[A-Z][A-Z0-9]+` shape
stops at a hyphen and misses exactly the 21 hyphenated §2 ids, `79 + 21 = 100`, zero false positives.
Two independent routes agree on 51, which is what makes 100 safe to freeze.

**Not verified, and recorded rather than ticked past (ADR-021):** DoD-5 names
`sh scripts/qa-check.sh` and the gate **was not run** — standing owner instruction this session to skip
qa-check/eval scripts, since EPIC-014 replaces them. The criterion's substance (DECISIONS.md row,
regenerated index) was verified directly. **The gate verdict is absent, and absence is not a pass.**

### 2026-08-24 | park | T1 — review parked: governance:high, no independent reviewer (D7)

`review-scoping.md` § Skip table routes a **governance-impact diff, any size** — explicitly naming *"an
ADR that binds implementation"* — to **one scoped `sonnet` reviewer**, and says in as many words:
**"never the self-review floor, whatever the file extension."** ADR-034 binds EPIC-014's entire parity
approach, so T1 is squarely in that row.

**D7 ruled implementation inline with no sub-agents**, which leaves no reviewer that did not write the
code. The rule does not offer self-review as a degraded option here, so T1's review is **parked**, not
downgraded — recording a self-pass as if it satisfied this row is the silent false-negative the rule was
written to stop.

**This is the second sighting of the same collision.** SPRINT-082 T5 parked on identical grounds
(`governance:high`, no independent reviewer this session) and its close filed **TASK-266** to discharge
the owed review. It will recur on T2, T3 and T4 — all Tier G, all governance- or behaviour-impacting —
so it is surfaced now as a sprint-wide question rather than discovered four times.

**Unblock condition:** either one scoped reviewer per governance-impact task, or a recorded owner ruling
accepting self-review for this sprint (the shape TASK-266 exists to close for 082).

### 2026-08-24 | surprise | T2 DoD-1 — the baseline immediately caught four defects, three of them mine

**Correction to two entries above, which the append-only rule requires be made here rather than by
editing them (§9):** they state this repository sits at `level: Gated`. **It does not — it is
`level: none`.** I read "Gated" off `TODO.md`'s changelog note, which recorded SPRINT-081 *raising* it
to Gated; it has since fallen back. The G1 finding those entries carry is unaffected — if anything it
is stronger — but the figure was wrong and is corrected here.

**Baseline, captured before any new tree lands** (`sh conformance.sh .`):

```
level: none -- Structural not yet reached. 6 finding(s) at Structural prevent it
coverage: 45 checkable rules have an assertion; 6 unchecked (GAP)
counts: 28 passed · 32 judgment-required · 6 excluded (implementation-directed)
        · 7 excluded (restated) · 4 excluded (standard-directed) · 6 engine-gap · 11 no verdict
FAIL x6, GAP x6, PASS x30
```

**The G1 ruling that added this step paid for itself before T2 wrote a line of code.** Four of the six
FAILs were introduced by *this session*, and **none of them would have been visible**: TD-081 records
that conformance FAIL rows never reach `qa-check`'s tally, and `qa-check` was not being run anyway.

- `update-trigger-absent` + `ownership-header-missing` — **mine.** The promote commit added
  `docs/research/…V3.md` with no frontmatter. I had flagged that committing it needed handling and then
  committed it without doing so. Fixed: ownership header added, body verified byte-identical (`cmp`).
- `adr-no-negative-consequence` — **mine.** ADR-034 § Consequences listed only upsides; §4 requires a
  Negative because no decision is cost-free. Fixed.
- `todo-over-cap-at-promote` — **mine** (403 vs 320; my 93 lines took it over). Unfixed: §11 says this
  is pruned *with the owner*, never silently.
- `changelog-not-rotated-at-minor` · `closed-sprint-not-archived` — SPRINT-082's close; §11 retention
  is propose→approve and was not applied. Not mine to take.

### 2026-08-24 | progress | T1 reviewed independently — every number held, one real defect

Reviewer: fresh scoped `sonnet` over commit `5bd330f` only, under D7 as amended. **It did not write the
code.**

**Spec axis — all numeric claims independently re-derived and confirmed exactly:** 100 = 51 + 49 ·
51 = mechanical 40 + split 11 · 49 = 32 + 7 + 6 + 4 · 79 misses exactly the 21 hyphenated §2 ids with
zero residue in either direction · EPIC-004's independent `45 + 6 = 51` · snapshot `cmp`-identical.
These are the load-bearing facts and they are solid.

**Spec axis — one MAJOR, upheld.** ADR-034's **Severity** row froze `note`/`warn`/`hold`/`fail`, which
is V3 §9's *target-state TypeScript type* — not what the engine being preserved does (`ok()`→`PASS` ·
`bad()`→`FAIL` · `gap()`→`GAP`, `note()` untagged and reused by `hold()`). **`warn` exists nowhere in
the implementation, and "severity" does not occur in `spec/STANDARD.md` at all.** Six rows point at a
real referent; that one pointed at nothing — and it is the row a differential-parity harness leans on
hardest. Reviewer also noted the "at least four emission shapes" claim is a true *floor* (it counted
5–6), so that stands.

**Standards axis — two minor, both upheld.** (a) DoD-5 was ticked while its own evidence said the named
check had not run; the letter of ADR-021 keeps that box open, so it is **unticked**. (b) ADR-034's
`related:` omitted ADR-024 (levels) and ADR-027 (exit meaning) though two frozen rows restate them.

### 2026-08-24 | scope-change | T1 revise — the fix tripped S4.APPEND, which is the rule working

**What broke.** The bounded revise corrected the Severity row **in place**, inside ADR-034 § Decision.
The next conformance run returned a new FAIL: `adr-edited-after-decision` — *"§4 is append-only: a
decided ADR is marked deprecated or superseded, never rewritten, because the record of what was decided
is the only thing that makes the reasoning auditable later."* The guard fired on the same session that
wrote the ADR, which is the shortest possible feedback loop and exactly what it is for.

**A second, self-inflicted slip on the way to fixing it, recorded because the artifact briefly held
it:** the first restore spliced the accepted file's line offsets onto the *current* file, duplicating
the Finding-ID block. Caught by re-reading the section markers rather than trusting the splice
(L-009). Rebuilt from section boundaries instead of line numbers; § Decision verified `cmp`-identical
to the accepted text, duplicate-block count back to 1.

**Impact.** ADR-034 § Decision stands exactly as decided, wrong Severity row included. The correction
is **ADR-036**, which supersedes that one row and states the general rule the defect revealed: *every
row of a compatibility contract must point at an artifact the current system has.* A marker in
ADR-034 § Consequences and its `related:` entry route a reader of the old file to the new one (L-151 —
a correction its reader cannot reach is not a correction).

**Re-confirm G2.** No task added, removed or re-scoped. Bounded revise used: one retry, both axes.
Conformance FAIL count 6 → 3; the three that remain are §11 retention items the rules themselves say
are pruned *with the owner*.

### 2026-08-24 | progress | §11 retention applied — conformance 6 FAIL → 0, level none → Gated

Owner authorised all three §11 items at the T1/T2 checkpoint. Each is an action §11 routes to the owner
rather than one a run may take silently, which is why they were surfaced instead of swept up.

- **TODO.md pruned** — `TASK-261…265` removed outright (no shipped-in comments, §11). SPRINT-082 shipped
  them as T1–T5, yet they still sat in the Backlog as `state: ready`, where a later promote could have
  re-promoted finished work. 403 → **240 lines**, under the 320 cap. Verified before applying: 13 → 8
  task rows (exactly the five), `state:` lines 8 = task rows 8 (1:1, so no entry fused — L-009), three
  `### P` headings intact. Survivors: 267–270 (this sprint) · 266 (082's owed review) · 260 · 259 · 188.
- **SPRINT-082 archived** — `docs/sprint/archive/` and its log to `docs/sprint/archive/logs/` in the
  same commit, plus an `INDEX.md` line naming what it contributed. Left in place it kept answering the
  globs that look for *active* work, so every check reading "the current sprint" was reading a finished
  one.
- **CHANGELOG rotated** — `v1.54.0` moved verbatim to `docs/changelog/CHANGELOG-1.54.0.md`; root keeps
  current + previous (1.56.0, 1.55.0). Body verified `cmp`-verbatim, 143 → 111 lines.

**Result: 6 FAIL → 0, `level: none` → `Gated`.** The single remaining finding is `attestation-absent`
at the Attested rung — commit signing, which §13 states is optional and explicitly *not* a defect; it
caps the level, it does not fault the repository.

**T2's baseline is therefore re-taken here, and this is the one its closing assertion measures
against** — `0 FAIL · level: Gated · 45 checkable with an assertion · 6 GAP`, captured with no new tree
on disk. The earlier 6-FAIL capture remains on the record above as what the state actually was; using it
as the comparand would have let T2 introduce a regression and still "match baseline", which is the
failure mode a baseline exists to stop.

### 2026-08-24 | progress | T2 — the workspace lands, and the predicted hazard happens exactly as predicted

`package.json` · `tsconfig.base.json` + `tsconfig.json` · `bunfig.toml` · `apps/cli/` · `test/` ·
ADR-035. **Zero dependencies** — Bun runs TypeScript directly, so there is no install, no
`node_modules` and no lockfile. That is a consumer decision, not a taste one (L-015): `plugin.json`
declares no `files` manifest, so anything added here lands in every consumer's cache.

**DoD-4, the reason this task was tiered G: discovery now stops at rung 1 and never reaches
`.gate-command`.** Walked all four rungs by hand, before and after. It is safe *only* because
`scripts.test` is `sh scripts/qa-check.sh && bun test`. Had it been the obvious `bun test`, System
verify would have silently re-pointed at a suite covering almost nothing and still printed a verdict —
the exact silent false negative ADR-033 was written to stop, arriving one sprint after it, through a
JSON field rather than through anything that looks like governance.

**The guard is a bun test, not another shell harness.** The must-FAIL fixture
(`manifest-bypasses-gate/`, `"test": "echo ok"` beside a `.gate-command`) plus two controls, one of
which differs in exactly one field so a pass proves discrimination rather than "returns false
sometimes". Building it in Shell would have added to the surface EPIC-014 exists to retire.

**Both seeded-break proofs held** — the CLI suite (a dropped `-v` reddened its own test, 6 siblings
green) and the guard itself (`bypassed: false` reddened the must-FAIL case, both controls green,
12 pass / 1 fail). Each restored `cmp`-identical.

**A guard-of-the-guard was itself broken, which is worth more than the proof it was checking.** The
"does the seeded file still parse?" step used `bun build --no-bundle … --outdir`, which printed
*"Transpiled file in 3ms"* and then failed writing output (`EEXIST: failed to write file '""'`). Read
as a parse failure, it reported **NO** on a file `bun test` had just executed successfully. That is
L-045 exactly — *a command's self-report is evidence about the reporter, never the artifact* — and it
would have blocked a valid discrimination proof, or worse, been "fixed" by weakening the seed. Replaced
with a check that actually loads the module (`import` + `typeof`).

**Conformance unmoved: `0 FAIL · 6 GAP · level: Gated`**, identical to the baseline. The three new
top-level trees moved nothing — which is what the G1 finding asked and what `qa-check`'s tally could
not have answered (TD-081).

**Consumer path traced by parsing, not grepping.** `grep -c hooks` on `plugin.json` returned 1 — on the
word inside the *description* (L-108's substring trap). Parsed: no `hooks` key, no `files` manifest.
So no install, no build, no Bun needed to use the skills; but the cache does now carry six more
entries, and that is stated rather than folded into "unchanged".

**Left open deliberately:** DoD-10 names `sh scripts/qa-check.sh`, not run this session by standing
owner instruction. Same treatment as T1 DoD-5 — the substance is verified elsewhere, the gate verdict
is absent, and absence is not a pass.

### 2026-08-24 | surprise | T2 revise — the guard against substring matching was itself a substring match

Independent review of `71d5168` (fresh scoped reviewer, D7 as amended) returned a **BLOCKER**, and it
is the defect this session had already named twice.

**`bypassesDeclaredGate` used `command.includes(declared)`.** The reviewer constructed and ran:

```json
"test": "echo 'not running sh scripts/qa-check.sh, just printing' && exit 0"
```

The declared command appears as literal text inside an `echo` argument, is never executed, and the
guard reported `bypassed: false`. **A false PASS in the guard whose only purpose is to prevent a false
PASS.** This is L-108 — *match by shape, not substring* — written into a guard during a session that
cited that same rule twice in its own commit messages (the `grep -c hooks` false positive an hour
earlier, and the `79` rule count in T1). Being loaded did not prevent it; the machinery caught it.
Nothing in the suite could have: the only fixture covered the exact `"test": "echo ok"` shape, so the
attack had no test to fail.

**Fixed by shape:** `invokes()` strips quoted spans *before* splitting on shell separators, then
requires a resulting segment to **begin** with the declared command. Quote-stripping precedes splitting
deliberately — otherwise `echo 'a && sh scripts/qa-check.sh'` splits into a segment that begins with
the declared command and the bypass returns. Retained fixture `manifest-mentions-gate/` plus four
regression cases (either-order invocation · single-quoted · double-quoted · separator-inside-quotes ·
prefix `qa-check.sh.bak`).

**Discrimination proven against the original bug, not an invented one:** restoring `includes()` verbatim
reddens the new MUST-FAIL case, 16 pass / 1 fail, while the *older* must-FAIL fixture stays green —
which is precisely why it never caught this. Restored `cmp`-identical; 17 pass / 0 fail.

**MAJOR, also upheld — rungs 2/3 diverge from dispatch.md's spec.** It says rungs 2 and 3 read the
actual Makefile/justfile target and CI test step; this implementation only detects that the rung hit
and returned a bare `command: null`. Now an explicit `extractable: false`, because *"no gate"* and
*"I could not read the gate"* are different facts and conflating them is how a guard reports safety it
never established. Behaviour stays conservative — unknown is bypassed, never safe. Latent here (no
Makefile, justfile or CI dir), and now stated rather than accidental.

**MINOR, upheld:** a real I/O failure reading `.gate-command` would have thrown and aborted the whole
walk; now caught, because a guard that crashes reports nothing.

**MINOR, upheld:** ADR-035's Consequences/Alternatives did not follow `ADR.md.template` (single-paragraph
`**Positive:** / **Negative (trade-offs accepted):**` and an `| Option | Why rejected |` table). Realigned
with § Decision verified `cmp`-identical to the accepted text, since ADR-035 is `status: accepted` and
§4 is append-only. **Follow-up, not done here:** ADR-034 and ADR-036 carry the same deviation — same
root cause, that I wrote three ADRs without re-reading their template, which CLAUDE.md names as an
anti-pattern outright.

**What the reviewer confirmed clean**, stated so a vacuous pass is visible: rung order against
dispatch.md:472-490 · `bun test` 13/13 at the time · an *independent* seeded break (removing
`examined.push(4)`) reddening only its own control · `check-manifest-lockstep.sh` genuinely excluding a
root `package.json` (4 manifests, all 1.56.0) · no `version` field consumed anywhere · `import.meta.main`
correctly gating the side-effecting block · **D2 intact — no `.sh` file appears in the diff at all** ·
`overview.md` 147/150 against the cap declared at `spec/STANDARD.md:121`.

Conformance unmoved: `0 FAIL · level: Gated`.

### 2026-08-24 | progress | T3 — the dependency direction becomes a test; three seeds prove it discriminates

`test/architecture/layers.ts` (rule engine) · `test/architecture/dependency-direction.test.ts` ·
`test/fixtures/architecture/` (6 trees, retained). **32 pass / 0 fail.**

**Five rules, each a data entry with its own finding name** — `domain-imports-app` ·
`domain-imports-infrastructure` · `contracts-imports-adapter` · `contracts-imports-app` ·
`adapter-imports-app`. Adding a rule is an entry, not a branch (V3 §2.1's O). Layer assignment is
explicit: an unrecognised path is `unassigned`, never silently domain — defaulting it *in* would apply
a layer's rules to files nobody classified, defaulting it *out* would exempt them, and both are silent.

**T2's blocker set this task's design.** The guard reads source text, so it matches by **shape**: block
comments, line comments and string literals are stripped by a single-pass state machine *before*
imports are read. Independent regexes would have been the same mistake one level down — a
commented-out import registering as a real edge, or a mention inside a string counting as a dependency.

**Three independent seeded breaks, each reddening exactly its own case with every sibling green:**

| Seed | Reddened | Result |
|---|---|---|
| `domain-imports-infrastructure` rule disabled | only that MUST-FAIL fixture | 30 pass / 1 fail |
| line-comment stripping disabled | only the `stripNonCode` test | 30 / 1 |
| block-comment stripping disabled | only the multi-line block-comment test | 31 / 1 |

Each verified to **land** (`cmp` against pristine), still **parse**, and be **targeted** (line delta 0);
each restored `cmp`-identical.

**A fourth seed silently failed to apply, and the landed-check caught it.** A `sed` whose pattern did
not match left the file untouched; the suite reported **31 pass / 0 fail** — which is exactly what a
non-discriminating suite reports. Without the `cmp` landed-check that would have been recorded as a
successful discrimination proof. This is L-137 verbatim, on its first opportunity to happen here.

**Seed B taught something about the tests themselves, and it is recorded rather than smoothed over.**
Disabling line-comment stripping did *not* redden "a commented-out import is not an edge" — because the
anchored import regex already refuses `// import` (it requires `import` at line start). That test
passes for a different reason than its name suggests. Stripping is only load-bearing for a **multi-line
block comment** whose inner line begins with `import`, so that case was added and then proven by seed C.
Two independent defences is fine; believing the wrong one is doing the work is not.

**Note for T4 — a `Layers:` prediction that execution dissolved (L-100).** T4's Layers says it will
"register the package" in the fitness suite. It will not need to: `checkLayers` walks `packages/`
recursively, so `packages/standard` is registered **by existing**. The T3→T4 shared-file dependency the
G2 overlap map recorded therefore does not materialise. Recorded here rather than silently skipped.
