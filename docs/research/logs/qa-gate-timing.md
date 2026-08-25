---
owner: Maintainer
last_updated: 2026-08-25
update_trigger: a measurement round is appended
status: active
id: qa-gate-timing-log
tags: [tooling]
domain: governance
related: [qa-gate-timing]
---

# QA gate timing — Measurement Log

> Append-only companion to [`../qa-gate-timing.md`](../qa-gate-timing.md). Uncapped by design: this
> file grows by one round per investigation, which is exactly why it is not inside the decision doc's
> 120-line budget (DOCS_Guide §2 · §6 cap-hit rule · SPRINT-062 T1, following ADR-014's precedent).
> **Never edit a past round** — a later measurement supersedes an earlier one by being appended, and
> the superseded figure stays visible. The series *is* the evidence; deleting a round to meet a cap
> would delete the thing this file exists for (L-106).
>
> The decision doc holds the standing verdict. Rounds are chronological, oldest first.

---

## Round 1 — where does the gate's ~130s go? (SPRINT-058, 2026-08-10)

Measured on Windows 11 / git-bash, this repo. Two samples of everything. Harness counts were read from
`eval_harnesses_always` in `scripts/qa-check.sh`, not assumed — there are **14**, not the twelve
TD-046 records.

| Slice | sample 1 (s) | sample 2 (s) | share |
|---|---|---|---|
| Full bare run (`sh scripts/qa-check.sh`, no `QA_FULL`) | 133.9 | 127.7 | 100% |
| Sum of all 14 always-on harnesses | 45.9 | 42.3 | ~34% |
| Inline checks (sections 1–11), **by subtraction** | 88.0 | 85.4 | ~66% |

Per-harness, only three are material; the other eleven total ~10s combined:

| Harness | s1 | s2 | rescans live repo? |
|---|---|---|---|
| `run-layers-completeness-fixtures.sh` | 18.2 | 14.8 | no — fixtures only |
| `run-dispatch-preflight-fixtures.sh` | 9.3 | 8.9 | no — one read-only `git rev-parse HEAD` |
| `run-doc-caps-fixtures.sh` | 8.3 | 8.2 | **yes** — case 6 |
| `run-manifest-lockstep-fixtures.sh` | 1.4 | 1.5 | **yes** — case 4 |
| remaining 10 harnesses | ~10 combined | ~10 combined | no |

### Findings

- **The "several harnesses rescan the live repo" suspicion is false as stated — it is two of fourteen,
  and they cost ~10s together.** *Source:* `evals/run-doc-caps-fixtures.sh` case 6 invokes
  `sh "$checker"` with no arguments, and `scripts/lib/check-doc-caps.sh` defaults `root=${2:-"$here/../.."}`
  to the live repo; `evals/run-manifest-lockstep-fixtures.sh` case 4 passes `"$repo_root"` explicitly.
  Both verified by reading the source directly, not from the measurement run's report.
- **Both live-repo cases are deliberate zero-coverage guards, and are the last things that should be
  cheapened.** Case 6's own comment: "zero coverage over zero rows would otherwise exit 0 — a PASS
  over an empty input set, which is the L-058 family in its purest form." Case 4 exists because the
  lockstep checker's first live run matched *nothing* (dot-directory glob, L-102). Removing the live
  input from either restores the exact failure it was written to catch. *Source:* both fixture files.
- **Moving every harness behind `QA_FULL=1` buys at most ~44s of ~130s**, and the three that dominate
  are the layers, dispatch-preflight and doc-caps suites — the highest-value checks in the set.
- **The inline half has never been measured and is twice the size.** *Source:* the subtraction above.

### Recommendation (round 1)

**Measure first, move nothing; TD-046's stated lever is retired.** The whole harness category is a
third of the runtime, and the specific suspicion that motivated the proposal — live-repo rescans — is
two harnesses costing ~10s, both of which are zero-coverage controls that must keep their live input.

### Caveats recorded at the time

- **The inline bucket is a subtraction, not a measurement.** Full-run and standalone-harness timings
  are separate process invocations with their own filesystem-cache state, so the two do not reconcile
  exactly — `run-layers-completeness-fixtures.sh` alone varied 18.2s → 14.8s between its own samples.
  The 66% figure is sound as a proportion and should not be quoted to the second.
- **Both full-run samples exited 1**, from that sprint's own in-flight state (a stale knowledge index
  and an undeclared `Layers:` entry), not from any harness — every harness sampled exited 0. Timing is
  unaffected; noted so the raw log is not misread later.
- **Nothing was moved, cheapened or edited.** `scripts/qa-check.sh` and `evals/` were byte-identical.

---

## Round 2 — sections 1–11, measured directly (SPRINT-060 T3, 2026-08-10)

Round 1's open question ("the inline bucket is a subtraction, not a measurement") is closed here with a
direct per-section measurement, 2 samples, taken at **136 checks** — up from the 131 round 1 measured.

**Method — an instrumented copy, not an edit.** `scripts/qa-check.sh` was transformed by `awk` into a
byte-identical copy in a temp directory with one `_qat "<label>"` timestamp emitter inserted before
each `# --- N.` section marker, and run twice. The shipped script was **not** modified, and it and
`evals/` remain byte-identical. Recorded as the method rather than glossed, because T3's own DoD said a
script edit would be a *finding*: no edit turned out to be necessary, since the copy `cd`s to the repo
root via `git rev-parse` and carries no `$0`-relative paths, so it exercises the identical code path.
The residual caveat is honest and small — it is a copy, and a copy is not the artifact.

### Per-section wall-clock (ms)

| Section | Sample 1 | Sample 2 |
|---|---:|---:|
| 1. Line caps | 7883 | 6407 |
| 2. Count consistency | 1100 | 1073 |
| 2b. Epic retention | 346 | 266 |
| 2c. Research retention | 1755 | 1318 |
| 2d. Ephemeral intake | 375 | 308 |
| 2e. Task origin | 573 | 433 |
| 2f. Gate sign-off | 712 | 330 |
| 2g. Night-run rollup | 470 | 250 |
| 3. Frontmatter / ownership | 2528 | 2053 |
| **4. Knowledge metadata (ADR-009)** | **76443** | **75120** |
| 5. TODO hygiene | 70 | 80 |
| 6. README footer version | 206 | 251 |
| 6b. Manifest lockstep | 626 | 649 |
| 7. TD aging | 174 | 151 |
| 8. Temp-tracker lint | 1070 | 1027 |
| 9. QA.md hygiene | 61 | 58 |
| 10. L-NNN citation lint | 6772 | 6465 |
| 11. Active-sprint task schema | 1533 | 1607 |
| *12. Eval harnesses* | *54945* | *46432* |
| *13. Headless park-record cue* | *196* | *158* |
| *14. Layers completeness* | *7273* | *5997* |
| *15. Layers observed* | *3704* | *3251* |
| **Total** | **168818** | **153686** |

### Findings

- **The 66/34 split is confirmed, near enough.** Sections 1–11 are **60.8% / 63.7%** across the two
  samples; 12–15 are 39.2% / 36.3%. The subtraction was sound as a proportion, exactly as round 1's
  caveat claimed.
- **But the proportion was never the interesting number. Section 4 alone is 45.3% / 48.9% of the entire
  gate** — 75–76 seconds, larger than all fifteen eval harnesses put together. One section of eighteen
  carries almost half the runtime; the other seventeen sum to ~14%.
- **Section 4 is also the most stable thing in the gate** (76.4s / 75.1s, <2% apart) while the harness
  section swings 54.9s → 46.4s (16%). Run-to-run variance lives in the harnesses; the *cost* lives in
  section 4.
- **This is L-107 repeating one level down.** TD-046 blamed the enumerable list (harnesses) because it
  was the only component you could phrase a hypothesis about. SPRINT-058 measured that list, cleared it,
  and named the remainder — but measured the remainder as a *blob*, so "the inline half is 66%" became
  the new resting place. It is not a blob: it is one section at ~47% plus seventeen at ~14%. The
  cheapest counter is the same one L-107 names — subtract the suspect from the total and ask, out loud,
  what the remainder is made of.
- **The gate grew 130s → 154–169s** while going 131 → 136 checks. Growth is not proportional to check
  count, which is another way of saying the count is not the cost driver.

### Recommendation (round 2)

**The lever, if one is ever pulled, is section 4 — not the harnesses.** Nothing is moved or cheapened
here; that task measures and does not cure, by its own scope. What this does is redirect the next
decision at a component that is ~47% of the gate and has never been examined, instead of at one that is
~33% and has now been cleared twice. A cure for section 4 would need its own re-derivation first
(L-091): the section validates index freshness, dangling refs and frontmatter completeness across the
whole knowledge corpus, and at least the freshness half is a genuine whole-corpus read that cannot be
narrowed without losing what ADR-009 wired it for.

---

## Round 3 — inside section 4 (SPRINT-061 T3, 2026-08-10)

TD-050 asked to split section 4 across *"freshness vs dangling refs vs completeness"*. **Those are not
three separable jobs**, which is the first finding. Reading `scripts/qa-check.sh:250-317`: freshness is
one `gen-index.sh --check` subprocess and is separable; but **dangling refs and completeness are
computed together inside the same two loops** — 4a (`:274-293`) over LEARNINGS ids, 4b (`:300-313`) over
corpus files — each pass producing both verdicts from a shared `allids`. TD-050 also omits a third
component entirely: the corpus enumeration and id-universe build (`:263-272`) they both depend on.
Separating the two named jobs would mean restructuring the shipped gate. Measured **by loop** instead.

**Method** — same as round 2: an `awk` transform of `scripts/qa-check.sh` into a copy in a temp dir
with `_qat "<label>"` emitters inserted at the four boundaries, verified as a pure-addition diff (0
lines removed, 9 added). Shipped script SHA-256 identical before and after (`bd6bb83b…d250`);
`scripts/` and `evals/` clean. Two samples, both exiting 0 at 135 checks.

| Slice of section 4 | s1 (ms) | s2 (ms) | share of §4 | share of run |
|---|---:|---:|---:|---:|
| index freshness (`gen-index.sh --check`) | 34408 | 27693 | 35–40% | ~19% |
| corpus + id-universe setup | 1465 | 1242 | ~1.6% | ~0.9% |
| 4a — LEARNINGS refs **+** metadata | 26287 | 23837 | ~30% | ~16% |
| 4b — corpus refs **+** metadata | 23399 | 26040 | 27–33% | ~16% |
| **section 4 total** | **85583** | **78838** | 100% | **~51.5%** |
| sections 1–3 | 15050 | 13143 | | ~9% |
| sections 5–15 | 65296 | 61113 | | ~39% |
| **full run** | **165929** | **153094** | | 100% |

### Findings

- **Section 4 has no cost centre. It has three comparable thirds.** Freshness ~36%, 4a ~30%, 4b ~30%,
  setup ~2%. This is the answer TD-050 was really asking for, and it is the unwelcome one: there is no
  dominant sub-part to cut. Removing the *largest* slice entirely would buy ~19% of the gate.
- **The largest slice is the one nothing is allowed to touch.** Index freshness is a whole-corpus read,
  which is exactly what ADR-009 wired it for; TD-050 names it as the thing not to cheapen, and it turns
  out to be the biggest single item in the section. The cheapest target and the most protected one are
  the same object.
- **Section 4 has grown: 45–49% → 51.5%** of the run since round 2, on a corpus five entries larger.
  Its absolute cost moved 75–76s → 79–86s. It is scaling with the corpus, as designed.
- **Variance lives in the freshness subprocess**, not in the loops: freshness swung 34.4 → 27.7s (19%)
  while 4a held 26.3 → 23.8s. A discarded smoke run (identical code path, only the emitter's `printf`
  differed) put freshness at 26.5s — a third point in the same spread, recorded because it widens the
  band rather than because it flatters it.

### Recommendation (round 3)

**No cure is proposed, and the measurement is now the argument against expecting a cheap one.** Every
remaining lever is either small (setup, ~2%) or protected (freshness, and the two loops that produce the
dangling-ref and completeness verdicts ADR-009 requires). If the gate's runtime ever becomes a real
problem, the honest options are structural — caching the index digest between runs, or accepting that a
whole-corpus integrity check costs proportional to the corpus — not a narrowing of what is checked.
TD-050 stays open on its behavioural concern; what closes is the expectation that splitting it further
would reveal a target.

---

## Round 4 — process-spawn count, not corpus size, is the dominant term (SPRINT-084 T1, 2026-08-25)

TD-084 could not be acted on before this round: `sh scripts/qa-check.sh` no longer completed at all
(three prior sessions killed at a 5min limit, a 10min limit, and a reaped background job — none
reaching the `QA-CHECK: N pass, M fail` line), so Round 3's per-section method could not simply be
re-run. This round re-derives Round 2/3's "section 4" finding from scratch on the current, much larger
script (23 always-on harnesses vs. Round 2's 14; 79 corpus files vs. an unrecorded but smaller count;
143 LEARNINGS entries), and adds the half Round 1–3 did not need at their scale: a **tiny-input
isolation**, per L-144/L-147's own prescribed diagnostic, run before any fix was chosen (TD-084's own
mitigation clause: *"do not act on (a) before (b)"*).

**Method — two passes, in order.** (1) An `awk` transform inserted one `date +%s%N` emitter after each
`# --- N.` section marker directly into the shipped `qa-check.sh` (matching Round 2/3's approach in
spirit; unlike them, done on the file itself rather than a temp-directory copy, verified pure-addition
by `sh -n` and restored to a byte-verified prior state via `cp` immediately after each timed run — SHA-256
`0139…7531` is the file as delivered, both instrumented runs reverted to it). Two full runs taken: one
against the **pre-fix** script (killed before finishing — figures below are the last section boundary
reached, extrapolated for the unreached remainder), one against the **post-fix** script (completed).
(2) Independently, `scripts/lib/conformance-engine.sh`'s own rule-dispatch loop was instrumented the same
way and run once against this repository, to attribute the informational-sweep leg's cost to individual
rule families rather than treat it as a blob (the exact mistake Round 2 names L-107 for, one level down).

### Tiny-input isolation (the half this round adds)

Before touching any code, each spawn type used by the two dominant loops (below) was timed 100× against
a throwaway one-line file, on this host, isolated from any real corpus — the identical diagnostic
TD-073's own fix used (`fn=$(printf … | tr …)`, 9,176ms/100 calls) and the one L-144/L-147 name as the
one that actually distinguishes a measurement from a guess:

| Call | 100× wall-clock | per-call |
|---|---:|---:|
| `awk '{print $1}' <1-line file>` | 5,496 ms | 55.0 ms |
| `sed -n '1p' <1-line file>` | 3,610 ms | 36.1 ms |
| `grep -q … <1-line file>` | 3,798 ms | 38.0 ms |
| bare `$(printf 'x')` (process-creation floor, no work) | 2,110 ms | 21.1 ms |

**This is the finding, before any real-repo number is even read**: on this host, creating a subprocess
costs 20–55ms **regardless of what it does** — over half of even a trivial `awk`/`sed`/`grep` call is the
`fork`/`exec` itself (Windows/git-bash, not the underlying work). Any loop that spawns one process per
corpus item is bounded below by `items × ~25ms`, independent of item size — exactly TD-073's conclusion,
reproduced independently here rather than assumed from precedent.

### Per-item spawn counts at real scale, and what they cost

| Site | Spawn shape (pre-fix) | Spawn count | Measured cost | Implied per-spawn |
|---|---|---:|---:|---:|
| `scripts/gen-index.sh` (LEARNINGS loop) | `grep` then 2×`sed` per `## L-NNN` heading | 143 × 2 = 286 | — | — |
| `scripts/gen-index.sh` (corpus loop) | 3×`fmv`(awk) per corpus file | 79 × 3 = 237 | — | — |
| `scripts/gen-index.sh` **total** | | **523** | **97.6s** | **187ms** |
| `qa-check.sh` §4 (`resids`, 1 `fmv`/research file) | 1 `fmv`(awk)/file, 79 files | 79 | 5.0s (isolated) | 63ms |
| `qa-check.sh` §4a (LEARNINGS metadata) | 1 `grep` + conditional `sed`/id, 143 ids | ~150–280 | 60.0s (isolated) | ~250ms |
| `qa-check.sh` §4a (refs membership) | 1 `grep -qx`/ref, ~100 refs | 100 | 11.0s (isolated) | 110ms |
| `qa-check.sh` §4b (corpus refs+metadata) | 1 reftoks `awk` + 4×`fmv` + membership `grep`s, 79 files | ~395+ | 93.0s (isolated) | ~235ms |
| `qa-check.sh` §4's own code, **total** | | **~700–850** (floor 717; upper bound not exactly countable — data-dependent membership checks) | **169s** (isolated, sum of the four rows above) | ~215ms |
| conformance-engine.sh `_own_scan` (first call, S1.LAW2) | 1 `awk`/doc, 222 docs | 222 | 57.16s | 257ms |
| conformance-engine.sh `assert_S4_APPEND` | `git log`/`show`/`rev-parse` per ADR/revision, 36 ADRs, 63 revisions | ~167 | 29.39s | ~176ms |

The per-spawn figures at real scale (110–260ms) run **higher** than the tiny-input floor (20–55ms) —
expected: these calls read real files of varying size and compete with the rest of the gate for I/O,
where the tiny-input isolation measures the unavoidable minimum with the workload subtracted out. Both
numbers matter for different reasons: the floor proves the mechanism is spawn count, not work; the
real-scale figure is what a fix has to beat.

### Before/after per-leg wall-clock (s) — current script, matched to `qa-check.sh`'s own `# --- N.` markers

| Leg | Before | After |
|---|---:|---:|
| 1. Line caps | 15.7 | 8.9 |
| 2 – 3 (all, combined) | ~22.1 | ~14.7 |
| **2f-ter. Conformance engine, informational sweep vs. real repo** | **176.6** | **1.9–5** |
| **4. Knowledge metadata (gen-index + corpus + LEARNINGS)** | **271.5** | **23.6** |
| 5 – 9 (all, combined) | ~4.8 | ~3.7 |
| 10. L-NNN citation lint | 15.4 | 11.7 |
| 11. Active-sprint task schema | 3.7 | 1.9 |
| **12. Eval harnesses (23 → 24, one new)** | not reached (killed mid-leg) | **396.3** |
| 13 – 15 (all, combined) | not reached | ~12.4 |
| **Full run (this instrumented sample)** | **~900s, extrapolated** (never completed; see Caveats) | **476s, completes** |
| **Full run (separate clean verification sample, uninstrumented)** | — | **492s** — printed `QA-CHECK: 176 pass, 4 fail` |

### Findings

- **The dominant term is named and it is not corpus size, section identity, or check count — it is
  external process-spawn count, at 20–260ms per spawn on this host.** Two legs (4 and 2f-ter) held 448s
  of the ~900s extrapolated pre-fix total (>50%). The four sites individually spawn-counted above sum to
  **~1,690** process spawns (gen-index 523 + qa-check.sh §4 ~700–850 + `_own_scan` 222 + `assert_S4_APPEND`
  ~167) doing work a single cached pass per item could do in one spawn each — and that is a FLOOR, not
  the whole picture: leg 2f-ter's remaining ~90s (176.6s minus `_own_scan`'s 57.2s and `assert_S4_APPEND`'s
  29.4s) comes from other conformance-engine families (`S10.TDAGING` 27.7s, `S4.ONEFILE` 16.2s,
  `S4.SECTIONS` 15.2s, `S4.NEGATIVE` 7.6s, `S6.BASE` 6.5s, `S11.SPRINT` 5.7s, `S11.TDDELETE` 4.3s,
  `S4.INDEX` 2.8s — timed by the same per-rule instrumentation but not individually spawn-counted this
  round, named here rather than folded silently into "the rest"). This generalises Round 2's "section 4
  is not a blob, it's three comparable thirds" one level further: none of the three thirds had a
  *computational* cost centre either — all three were the same mechanism (one-process-per-item) at
  different call sites, and neither is leg 2f-ter's remainder.
- **This is at minimum the fifth and sixth sighting of this exact shape in this codebase, not the third
  and fourth.** L-144 itself documents two by name — SPRINT-075's ownership family (sighting 1, ~2,800
  awk processes) and SPRINT-076's `S2.R-PLACEMENT` (sighting 2, a `find` per spec row) — but L-147 names
  a third (a tier-rank resolution loop, 13s→18s on a four-file repo) and L-155 a fourth (the engine's own
  dispatch driver, fixed as TD-073: two command substitutions plus an external `tr`, per rule, spawn-free
  after the fix). `scripts/gen-index.sh` and `qa-check.sh` §4's own code — fixed this round — are a fifth
  and sixth appearance, both undiscovered until this task because the gate never lived long enough to be
  profiled past leg 4.
- **Round 3's "no cure is proposed" no longer holds, but not for a reason Round 3 could have found.**
  Round 3 correctly ruled out narrowing *what* is checked (the coverage-reduction axis) — every lever on
  that axis really was small or ADR-009-protected, exactly as it concluded. What Round 3's method could
  not see is a second, orthogonal axis: *how many processes* the SAME check spawns to do the SAME work.
  Section 4 (now §4) still reads the whole corpus; it just no longer spawns 700+ processes to do it.
  271.5s → 23.6s with **zero reduction in what is verified** (§10's coverage-reduction fixture family
  was not touched, and the same real defects were confirmed still caught before/after — see this
  sprint's own T1 report).
- **The conformance-engine informational sweep (leg 2f-ter, 176.6s pre-fix) was cut on the OTHER axis —
  scope, not spawn count** — by handing it a reduced spec (the 2 rules + 7 rules that actually gate,
  of ~100 total) on the default profile, deferring the full ~90-rule sweep to `QA_FULL=1`. This is
  distinct from the §4 fix and is the one place this round's cure IS a narrowing — but of an
  *informational* sweep whose own header comment already states almost none of it enters the gate's
  tally, not of a coverage guarantee.
- **Leg 12 (eval harnesses, 396.3s) is now the single largest leg in the gate — ~83% of this round's
  instrumented post-fix sample (476s), ~81% of the separate clean-verification sample (492s).** This
  round does not attribute leg 12's cost the way it attributes legs 4 and 2f-ter (that
  would be a seventh sighting to chase, and was out of this task's measured scope: leg 12 was never the
  historically-stalling leg — TD-084's own killed runs died inside leg 2f-ter/leg 4's territory, never
  reaching leg 12). Recording this explicitly so the next investigation does not start from zero: if the
  gate's runtime is revisited again, leg 12 — not section/leg 4 — is where Round 2's method (measure
  per-harness, don't treat the leg as a blob) should be pointed next.

### Recommendation (round 4)

**The cure Round 1–3 could not find exists, was on a different axis than any of them tested, and has
been applied to the two dominant legs.** `docs/research/qa-gate-timing.md`'s standing recommendation
("Option C stands; nothing is moved... no sub-part of section 4 worth cutting") is **materially
superseded** by this round on its central claim — see the note below; this log records that fact but
does not rewrite the decision doc. For any future investigation of gate runtime: **isolate spawn count
from work size before accepting "the corpus is just big" as an explanation** — the tiny-input table
above is the cheap test that would have found this three rounds ago, and it costs under 20 seconds to
run. Leg 12 is the named next target if this is ever revisited; this round did not touch it.

### Caveats recorded at the time

- **The pre-fix "~900s" full-run figure is extrapolated, not measured end-to-end.** No pre-fix run of
  the current script ever completed (that is TD-084 itself) — the pre-fix per-leg figures above are each
  independently measured (legs 1–11 from an instrumented run killed mid-leg-12 at the 10-minute tool
  ceiling; leg 12's pre-fix cost is inferred from the post-fix measurement of the same 23 harnesses,
  since none of this round's fixes touched leg 12 or any harness's own logic) and then summed. Should not
  be quoted to the second, in Round 1's own words.
- **The two post-fix full-run samples disagree by 16s (476s instrumented vs. 492s clean) for the same
  reason Round 1's samples did** — separate process invocations, separate filesystem-cache state, and
  (for leg 12 specifically) 23–24 independent harnesses whose own git/mktemp costs vary run to run.
  Neither figure should be read as more precise than the other; both are cited above rather than
  averaged, so neither reads as falsely exact.
- **This round instrumented the SHIPPED file directly, then reverted it, rather than working from a
  temp-directory copy the way Rounds 2–3 did.** Verified by `sh -n` after instrumenting and by `cp`
  from a saved pristine snapshot afterward (not a diff-based revert), so the residual risk is different
  in kind from Round 2/3's "a copy is not the artifact" caveat — here the artifact WAS instrumented,
  temporarily, and the claim is that the revert is exact rather than that the code path was never
  touched. Confirmed for the coordinator's own re-run: `sh scripts/qa-check.sh` and
  `scripts/lib/conformance-engine.sh` were both re-verified byte-identical to their delivered state
  after every timed run in this round.
- **Every absolute number in this round is host-specific.** Measured on Windows 11 / git-bash, the same
  environment as Rounds 1–3 — but this round's *central claim* (spawn count dominates) is specifically
  about `fork`/`exec` cost on this platform, which is known to run far higher than native Linux process
  creation. The MECHANISM generalises (spawn count is always a term); the 20–260ms figures likely do not
  to a Linux CI runner, where the same fixes would still help but by a smaller margin.
- **The tiny-input isolation used a 1-line throwaway file, not the zero-byte case §4's own comments warn
  a single cross-file awk pass can silently drop.** This round's fixes stayed at one-process-per-FILE
  (never one process for a whole corpus), the same precedented boundary the ownership family and
  `S2.R-PLACEMENT` already drew, for exactly that reason — not re-litigated here, cited.
- **Leg 2f-ter's post-fix figure (1.9–5s) and leg 4's (23.6s) both include real work, not just fewer
  spawns** — leg 2f-ter's reduced-spec run still dispatches and evaluates the 9 rules that gate; leg 4
  still reads all 79 corpus files and 143 LEARNINGS entries once each. Neither figure is "nothing ran".
- **Nothing in `docs/adr/`, `docs/research/*.md` (outside this log), or `evals/run-foreign-repo-fixtures.sh`
  was touched by this round or by T1** — confirmed by a concurrent T4 session actively editing the latter
  two; this round's own edit is scoped to this file only, append-only.

### Note for the decision doc (`docs/research/qa-gate-timing.md`)

Its Recommendation section states *"Option C stands; nothing is moved... there is no sub-part of
section 4 worth cutting."* That conclusion was correct on the axis it tested (coverage reduction) and
is now **outdated on an axis it never tested** (spawn-count reduction) — Option C's own three rounds
never asked "does the same check need this many processes," only "is there less to check." This is not
a one-line pointer fix (the doc's § Options table, § Findings, and § Recommendation would all need a
new row/finding to stay honest about what changed and why), so per this task's own instruction it is
**not edited here** — left for a promote-time ruling on whether to add an Option E and revise the
verdict, or to fold this round's summary into the doc's Findings as a superseding entry.
