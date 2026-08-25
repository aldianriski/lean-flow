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

---

## Round 5 — per-rule-family cost: tiny-input floor and real-scale attribution (SPRINT-085 T5, 2026-08-25)

Round 4 names itself a **floor**: it measured `qa-check.sh`'s own legs and named only 10 of the
engine's ~45 dispatchable rules individually (`_own_scan`/S1.LAW2 and `assert_S4_APPEND` with spawn
counts; S10.TDAGING, S4.ONEFILE, S4.SECTIONS, S4.NEGATIVE, S6.BASE, S11.SPRINT, S11.TDDELETE, S4.INDEX
by wall-clock only), leaving "~4s" of its own leg total attributed to "all other ~35 dispatched rules"
without individually measuring them. EPIC-014's open question forbids freezing Sprint C's
rule-family migration order before a profile exists (V3 §43 · L-130), and §43 explicitly forbids
ordering by section number — this round closes the rest of that profile: **all 45 mechanical/split
rules**, grouped into the 12 rule families the engine's own section-comment headers define, timed both
against a **tiny purpose-built fixture** (L-144/L-147's own prescribed diagnostic — isolate
per-invocation overhead from workload) and against **this repository at real scale**, with the two
reconciled against each other and against Round 4's numbers.

**Method — three passes, in order, none touching the shipped file.**

**(1) A 12-item tiny fixture repo**, built fresh under `docs/research/logs/`'s companion scratch area
(not part of this repository — a throwaway git repo in the OS temp dir), sized to exercise every
family's loop at least once without approaching real-repo scale: 2 ADRs (3 total revisions across
them), 3 ownership-headed docs, 2 `LEARNINGS.md` entries, 2 `TECH-DEBT.md` rows, 1 active sprint file
+ paired log, 1 archived sprint + paired log, 16 git-tracked files total, 5 commits. Exact counts
recorded here because several families' real-scale cost is `item-count × per-item spawns`, and a tiny
input's value depends on knowing what "tiny" was.

**(2) Per-rule timing**, both against the tiny fixture and against this repository: a temp-directory
copy of `scripts/lib/conformance-engine.sh` (never the shipped file — Round 2/3's copy method, not
Round 4's instrument-and-revert) with three added lines wrapping the DRIVER's `"$fn" "$repo_abs"`
dispatch call in `date +%s%N` timestamps, appended to a log file keyed by rule id. `sh -n` clean; `diff`
against the shipped file is a **pure 3-line addition, 0 removed**. Tiny-fixture run: 2 samples. Real-repo
run: 1 sample (Round 4's own precedent for the real-scale attribution pass — "run once against this
repository"), after a first attempt was discarded: a foreground invocation was killed at a 2-minute tool
ceiling, and a background relaunch left the killed process's own file handle still appending to the
same path, contaminating 19 of 45 rule ids with doubled entries before the file was rotated aside
(`timing_real.CONTAMINATED.tsv`, kept, not reported from) and a clean single run taken.

**(3) Spawn counts**, empirically, not by static reading alone (Round 4 mixed both; this round leads
with the measured one). A second temp copy adds `##RULE-START <id>##` / `##RULE-END <id>##` markers
around the same dispatch call, run once against the tiny fixture under `sh -x` (this host's `sh` is
bash 5.2 in POSIX mode, confirmed by `--version`; xtrace nests command substitutions as `++`, so a
subprocess launched from inside `$(...)` gets its own traced line — verified by inspecting a raw
segment before trusting the counts). Lines between markers are counted when their first token names an
external binary (`git awk sed grep find wc cut tr sort head tail dirname basename mktemp date cat xargs
uniq comm rev ls`); shell builtins (`[`, `printf`, `case`, `command -v`) are excluded. Cross-checked
against source reading for the two families this round singles out below (S11.LOGPAIR/WHENITRUNS) —
the two methods agree in order of magnitude.

### Tiny-input isolation, per family (avg of 2 samples; families = the engine's own section-comment
groupings)

| Family (§, rule ids) | avg time | spawns (tiny) | implied ms/spawn |
|---|---:|---:|---:|
| F6 — §4 ADR governance (S4.ONEFILE/INDEX/SECTIONS/NEGATIVE/APPEND) | 2360.3 ms | 42 | 56.2 |
| F8 — §9 sprint-file (S9.TWOFILES/LOGDIR/PLANFROZEN/SCOPECHANGE/VERIFYCLAUSE) | 1868.9 ms | 26 | 71.9 |
| F9 — §10 learning-governance (S10.FOURBUCKETS/PROMOTION/TDAGING/PROMOTEREVIEW) | 1264.2 ms | 22 | 57.5 |
| F11 — §11b (S11.SPRINT/LOGPAIR/CHANGELOG/WHENITRUNS) | 1259.8 ms | 16 | 78.7 |
| F3 — §13 attestation (S13.TRAILERS/OWNCOMMIT/EVIDENCESHA/AGREE/UNSIGNEDCLAIM) | 1154.0 ms | 16 | 72.1 |
| F12 — §12 git boundary (S12.SECRETS/BACKUPS/DESIGNSRC/GENERATED) | 1146.1 ms | 15 | 76.4 |
| F5 — §1/§3 ownership-header (S3.SCHEMA/S1.LAW2/S1.LAW3/S3.AGENTS) | 1138.8 ms | 17 | 67.0 |
| F7 — §2 core-file (S2.F-FILE/S2.R-PLACEMENT) | 1104.8 ms | 15 | 73.7 |
| F10 — §11a (S11.TDDELETE/TODOCAP/LEARNINGS/BACKLOG) | 874.9 ms | 16 | 54.7 |
| F2 — §2/§6 tier doc-set (S6.BASE/BACKEND/MEDIUM/MULTISVC, S2.F-TIER) | 827.2 ms | 5 | 165.4* |
| F4 — §9 gates-signed (S9.GATESWELLFORMED/GATESABSENT) | 367.8 ms | 5 | 73.6 |
| F1 — §2 README footer (S2.R-README) | 309.9 ms | 6 | 51.6 |
| **sum of families** | **13,676.7 ms** | **201** | |
| **full-engine wall clock (tiny fixture, 100-rule spec)** | **16,150 / 16,813 ms** (2 samples) | | |

\* F2's per-spawn figure is inflated by a measurement artifact recorded under Caveats — S6.BACKEND,
S6.MEDIUM and S6.MULTISVC produced **zero** external spawns on this fixture (no `.conformance-tier`
declared, so each takes an early `note`-and-return branch) yet still cost 85–96 ms of measured wall
time apiece.

**Reconciliation (tiny input).** 13,676.7 ms of dispatched-rule time against a 16,150–16,813 ms total —
a 2,474–3,136 ms gap. Accounted for, not folded in: ~55 non-dispatched rules' `note()` calls (judgment
/excluded/restated marks), the spec read (~150 ms per the driver's own TD-073 comment), two `cd`/`pwd`
resolutions, and — the largest identified piece — **this round's own instrumentation**: 2 `date`
spawns × 45 dispatched rules = 90 extra process forks, at Round 4's own measured 21.1 ms bare-fork
floor ≈ 1.9 s. That alone accounts for 61–77% of the gap.

### Real-scale attribution, per family (this repository, single clean run, full 100-rule spec)

| Family | real-scale time | rank |
|---|---:|:--|
| F11 — §11b (S11.SPRINT/LOGPAIR/CHANGELOG/**WHENITRUNS**) | **84,715.6 ms** | 1st — not named by Round 4 |
| F6 — §4 ADR governance | **72,134.5 ms** | 2nd — matches Round 4's `_own_scan`+`S4.APPEND` axis |
| F5 — §1/§3 ownership-header (**S1.LAW2**) | **56,017.5 ms** | 3rd |
| F9 — §10 learning-governance (**S10.TDAGING**) | **37,443.8 ms** | 4th |
| F2 — §2/§6 tier doc-set | 12,075.2 ms | 5th |
| F10 — §11a | 6,467.3 ms | 6th |
| F8 — §9 sprint-file | 5,314.8 ms | 7th |
| F12 — §12 git boundary | 2,240.4 ms | 8th |
| F3 — §13 attestation | 1,624.4 ms | 9th |
| F7 — §2 core-file | 1,430.1 ms | 10th |
| F4 — §9 gates-signed | 1,110.9 ms | 11th |
| F1 — §2 README footer | 592.0 ms | 12th |
| **sum of all 12 families (= all 45 dispatched rules, exact partition)** | **281,166.6 ms** | |
| **full-engine wall clock (this repo, single run, exit 0)** | **287,406 ms** | |

**Reconciliation (real scale).** 281,166.6 ms of dispatched-rule time against 287,406 ms total — a
6,239.4 ms (2.2%) gap, smaller in proportion than the tiny-input gap, consistent with per-rule dispatch
overhead being a roughly fixed cost that shrinks as a share once real work dominates. Attributed to the
same categories as above (non-dispatched notes, spec read, this round's 90-spawn instrumentation
overhead, final report/coverage lines) — not individually re-measured at real scale, since the tiny-input
pass already isolates and bounds that overhead.

**The two dominant real-scale rules inside F11 were verified in isolation**, because they are the
biggest departure from Round 4's picture (below): re-running the same instrumented copy with the spec
filtered to *only* `S11.LOGPAIR` and `S11.WHENITRUNS` (`QAT_ONLY` env filter added to the temp copy, same
pure-addition-diff discipline) against this repository gave `S11.LOGPAIR: 31,947.1 ms`,
`S11.WHENITRUNS: 44,137.7 ms` — 76,084.8 ms isolated vs. 75,578.1 ms embedded in the full 45-rule run,
agreeing within 0.7%. Not a scheduling artifact of dispatch order.

### Findings

- **The dominant families differ by which axis you measure.** At **tiny-input** scale (per-invocation
  floor), **F6 — §4 ADR governance is dominant at 2,360.3 ms / 42 spawns**, with F8 (§9 sprint-file,
  1,868.9 ms/26 spawns) and F9 (§10 learning-governance, 1,264.2 ms/22 spawns) next. At **real scale**
  on this repository, the ranking inverts at the top: **F11 — §11b is now dominant at 84,715.6 ms**,
  ahead of F6 (72,134.5 ms), F5/§1-§3 ownership (56,017.5 ms, almost entirely `S1.LAW2`/`_own_scan`),
  and F9/§10 learning-governance (37,443.8 ms, almost entirely `S10.TDAGING`). These four families sum
  to **250,311.4 ms — 89% of the real-scale total** — the other eight sum to 30,855.2 ms (11%), named
  individually in the table above rather than folded into "the rest."
- **F11 (§11 retention family, specifically `S11.LOGPAIR` at 26,971.4 ms and `S11.WHENITRUNS` at
  48,606.5 ms) is this round's central new finding — a high-repeated-process-spawning family V3 §43's
  own criterion 3 names, previously unattributed by Round 4.** Both loop over
  `_s11_archived_plans` — 83 archived sprint plans in this repository — and both call multiple `git`
  subprocesses (`rev-parse`, `log`, `merge-base --is-ancestor` for WHENITRUNS; two `_s11_archived_at`
  lookups plus `_s11_log_predated_archive` for LOGPAIR) **per archived sprint**
  (`scripts/lib/conformance-engine.sh:2581–2723`), the identical one-process-per-item shape L-144 names,
  at git's ~150–250 ms real-scale per-spawn cost (Round 4's own figure) rather than awk/sed/grep's
  ~55–80 ms (this round's tiny-input figures above) — which is *why* two rules with modest item counts
  (83, not hundreds) still cost tens of seconds each.
- **This is not fully reconciled against Round 4, and that gap is reported rather than resolved.**
  Round 4's own arithmetic (176.6 s leg total − 57.16 s `_own_scan` − 29.39 s `S4.APPEND` = "~90 s"
  remaining, of which its 8 named rules summed to ~86.0 s) implies **≤4 s for all ~35 other dispatched
  rules combined** — including S11.LOGPAIR and S11.WHENITRUNS. This round measures those two rules
  alone, on the same code (`git diff 81a31fe HEAD -- scripts/lib/conformance-engine.sh` touching
  `_s11_archived_at`/`assert_S11_LOGPAIR`/`assert_S11_WHENITRUNS`/`_s11_archived_plans`/
  `_s11_log_predated_archive` is **empty** — byte-identical since Round 4's own commit) and on a nearly
  unchanged corpus (120 archived files at Round 4's commit `81a31fe`, 122 now), at **76,084.8 ms
  combined — roughly 19× Round 4's implied ceiling for its entire unnamed remainder.** Two isolation
  reruns above rule out a dispatch-order artifact. The most likely explanation, stated as inference: 
  Round 4's "~4 s" was never itself an individual measurement of the remaining ~35 rules — it was the
  arithmetic remainder of one leg-total figure minus ten explicitly-timed rules, and Round 4's own text
  already flags its own accounting as naming "only some" families and its spawn counts as "a lower
  bound." This round's task was explicitly to close that gap (see task brief); it closes two more of
  the previously-unnamed rules and finds them large, rather than confirming Round 4's implied ceiling.
  Left unresolved and named as a caveat, not papered over.
- **Below process-spawn count, there is a second, smaller mechanism: a per-rule dispatch floor of
  ~85–96 ms even at ZERO external spawns**, visible on the tiny fixture where `S6.BACKEND`, `S6.MEDIUM`
  and `S6.MULTISVC` each cost 85–96 ms of measured time while the empirical spawn counter recorded
  **zero** forks for all three (verified by inspecting the raw `sh -x` trace segment directly — every
  line inside the boundary is a shell builtin: `[`, `case`, `printf`). A synthetic control (a
  builtin-only function called 100× in a tight loop) measured 0.4 ms/call, ruling out bash function-call
  overhead itself as the explanation — the ~90 ms is specific to these three calls, not a general bash
  floor. Not chased further this round (out of scope for an S-size task); named here rather than
  silently absorbed into F2's per-spawn average, which is why F2's implied ms/spawn (165.4) is flagged
  with an asterisk above rather than trusted at face value.
- **The engine's stated caching ("walk once, then filter") holds up empirically, not just as a design
  comment.** The xtrace-based spawn counter recorded **zero new spawns** for `S6.BACKEND`/`MEDIUM`/
  `MULTISVC` after `S6.BASE`'s first call populates `_s2_tier_rows`'s cache, and zero new spawns for
  `S13.OWNCOMMIT`/`EVIDENCESHA`/`AGREE`/`UNSIGNEDCLAIM` after `S13.TRAILERS`'s first call populates
  `_att_scan`'s cache — all 16 of F3's spawns and all but 5 of F2's happen exactly once, on the first
  rule that needs them, exactly as the source comments (`scripts/lib/conformance-engine.sh:405–407`,
  `:702–708`) claim.
- **Round 4's individually-named rules broadly reproduce, with normal run-to-run variance, not a
  contradiction.** `S1.LAW2` 54.8 s here vs. 57.16 s there (−4%); `S4.APPEND` 27.9 s vs. 29.39 s (−5%);
  `S4.INDEX` 2.4 s vs. 2.8 s (−14%) — all within the kind of spread Round 1's own caveat already named.
  `S10.TDAGING` (35.2 s vs. 27.7 s, +27%), `S4.SECTIONS` (19.9 s vs. 15.2 s, +31%), `S4.NEGATIVE`
  (13.4 s vs. 7.6 s, +76%), `S6.BASE` (11.4 s vs. 6.5 s, +75%), `S11.SPRINT` (8.3 s vs. 5.7 s, +45%) and
  `S11.TDDELETE` (6.0 s vs. 4.3 s, +40%) drifted up more than that — plausibly ordinary host/corpus
  variance rather than anything structural, since none of these touch the F11 code path this round
  flags as genuinely new; not chased further, recorded honestly as drift rather than smoothed away.

### Recommendation (round 5)

**Do not choose Sprint C's first family here — that stays V3 §43's call, made at Sprint C's own G2.**
What this round adds to that decision: on **expensive-today** and **high-repeated-process-spawning**
(§43 criteria 1 and 3), the strongest real-scale candidates are, in descending order, **F11's §11
retention pair** (`S11.LOGPAIR` + `S11.WHENITRUNS`, 76.1 s combined, ~83 git-spawns-per-item over 83
archived sprints — this round's own finding, previously unnamed), **F6's §4 ADR family** (72.1 s,
already Round 4's leading candidate and confirmed again here), **`S1.LAW2`/§1's ownership scan** (54.8 s,
already migrated to a single cached awk-per-doc shape, so its remaining cost is closer to a corpus-size
floor than a spawn-count defect), and **`S10.TDAGING`/§10** (35.2–27.7 s across two measurements). §43's
other two criteria — future dashboard relevance and representative architecture needs — are outside
what a timing measurement can answer and are left to Sprint C's own G2 discussion, as V3 §43 requires.
This round's tiny-input table is offered as the complementary per-invocation-floor view for whichever
family is chosen, since real-scale cost and per-invocation cost do not rank the same families first.

### Caveats recorded at the time

- **Every absolute number in this round is host-specific** (Windows 11 / git-bash — `sh` resolved to
  bash 5.2.37 in POSIX mode, confirmed by direct check), the same caveat Rounds 1–4 carry forward.
- **The tiny fixture is a purpose-built throwaway repo, not the retained eval corpus.** Its exact item
  counts are recorded above so the tiny-input table is reproducible and interpretable rather than a
  black box; it is not committed to this repository and was built and discarded in the OS temp
  directory.
- **The real-scale run is a single sample**, not two — matching Round 4's own precedent for its
  real-repo attribution pass, not Rounds 1–3's two-sample standard. A first attempt was discarded after
  discovering contamination from an orphaned killed process still appending to the same log path;
  the reported numbers come from the clean rerun only, and the contaminated file was rotated aside
  rather than edited or silently merged in.
- **Real-scale spawn counts are not individually re-counted for all 12 families this round** — only the
  tiny-input spawn counts are empirical for every family; the real-scale spawn counts implied by
  Round 4's own git-cost figure (~150–260 ms/spawn) and this round's own source-reading are given only
  for the two families this round singles out (S11.LOGPAIR/WHENITRUNS) and for the families Round 4
  already spawn-counted (`_own_scan`, `S4.APPEND`). Named as a gap rather than silently assumed
  complete.
- **The Round 4 vs. Round 5 discrepancy on `S11.LOGPAIR`/`S11.WHENITRUNS` (≤4 s implied vs. 76.1 s
  measured) is reported, not resolved.** Code is byte-identical since Round 4's commit and the archived
  corpus is nearly unchanged (120 → 122 files); the likely explanation is that Round 4's "~4 s" figure
  was an arithmetic remainder rather than an individual measurement, but this round did not go back and
  re-instrument Round 4's exact method at Round 4's exact commit to settle it definitively — flagged as
  the honest limit of this round's evidence, per this task's own "a gap you cannot explain is the
  finding" instruction.
- **This round modified nothing in `scripts/`, `evals/`, `packages/`, `apps/`, or `test/`.** All three
  instrumented copies (per-rule timing, xtrace spawn-marker, and the `QAT_ONLY`-filtered isolation copy)
  live under a scratch temp directory outside this repository; each `diff` against the shipped
  `scripts/lib/conformance-engine.sh` was verified as a pure, small addition (3 lines for the timing
  copy) before being trusted, and the shipped file itself was never touched. `sh scripts/lib/check-doc-caps.sh` was run clean before this round's edit.
- **The "~85–96 ms zero-spawn floor" finding (S6.BACKEND/MEDIUM/MULTISVC) is reported and not explained
  beyond ruling out bash function-call overhead as the cause.** Left as an open, named observation
  rather than a resolved mechanism — consistent with this file's own practice of recording what was
  seen even when the why is incomplete.

---

## Round 6 — the S11 pair reproduces a third way; leg 12 and the engine sweep are disjoint (SPRINT-086 T1, 2026-08-25)

Two disagreements were referred here at promote. **(1)** Round 4's arithmetic implies ≤4s for its
entire unnamed dispatched-rule remainder, of which `S11.LOGPAIR` + `S11.WHENITRUNS` are an unmeasured
subset; Round 5 measured those two rules alone at 76.1s combined, twice (embedded in a 45-rule run and
isolated via a `QAT_ONLY` env filter, agreeing within 0.7%). **(2)** TD-090 (Round 4) reports leg 12
(eval harnesses) at 396.3s of a 492s run; Round 5 reports "the conformance engine" at 281.2s
(dispatched-rule sum) / 287.4s (wall clock) real-scale. Both are settled below, neither by re-running
either round's method verbatim (already done twice each) but by a **third, independently-implemented
check** on each: for (1), a `--spec`-reduction rerun (the mechanism `qa-check.sh`'s own leg 2f-ter
uses, not Round 5's `QAT_ONLY` filter); for (2), reading what leg 12's own harnesses actually invoke.

**Method (1) — spec-reduced isolation, third method, this repository, single sample.** Built a 2-row
spec file (`awk '/^\| \`S11\.LOGPAIR\`/ || /^\| \`S11\.WHENITRUNS\`/ { print; next } $0 !~ /^\| \`S[0-9]/
{ print }' spec/STANDARD.md`, output verified to contain exactly those two `S`-prefixed rows) under the
scratch temp dir, outside the repo. Confirmed no commit has touched `scripts/lib/conformance-engine.sh`
since `a5feb8a` (SPRINT-081) — well before both Round 4 (SPRINT-084) and Round 5 (SPRINT-085), so the
code both rounds measured is still the code measured here. Ran `sh scripts/lib/conformance-engine.sh .
--spec <reduced-spec>` once against this repository, timed by `date +%s%N` immediately before and after
the call (not internal instrumentation — nothing in `scripts/` or `evals/` was touched, read-only run).

**Method (2) — read what leg 12 dispatches.** `qa-check.sh`'s `eval_harnesses_always` (24 harnesses) was
read in full; the 9 that reference `conformance-engine.sh` (`run-conformance-engine-fixtures.sh`,
`run-adr-family-fixtures.sh`, `run-foreign-repo-fixtures.sh`, `run-gates-signed-fixtures.sh`,
`run-ownership-header-fixtures.sh`, `run-s2-placement-fixtures.sh`, `run-spec-reader-fixtures.sh`,
`run-sprint-family-fixtures.sh`, plus opt-in `run-attestation-fixtures.sh`) were grepped for their
target: every one builds its own `mktemp -d` throwaway git repo and points the engine at that, never at
this repository. Separately, `scripts/qa-check.sh:225-260` (leg 2f-ter's own source) was read: on the
default profile (no `QA_FULL`) it hands the engine a **7-rule reduced spec**
(`S9.GATESWELLFORMED`/`S9.GATESABSENT` + `S13`'s five) against target `.` (this repo), costing the
1.9–5s Round 4 already measured post-fix; the **full** ~100-row spec against `.` only runs under
`QA_FULL=1` — a profile setting, not the default 492s run TD-090 cites.

### (1) S11.LOGPAIR + S11.WHENITRUNS, three independent measurements

| Method | `S11.LOGPAIR` | `S11.WHENITRUNS` | combined | vs. Round 4's implied ≤4s |
|---|---:|---:|---:|---:|
| Round 5 — embedded in full 45-rule dispatch | — | — | 75,578.1 ms | ~19× |
| Round 5 — isolated, `QAT_ONLY` env filter | 31,947.1 ms | 44,137.7 ms | 76,084.8 ms | ~19× |
| **Round 6 — isolated, `--spec` reduction (this round)** | — | — | **66,850.8 ms** | **~16.7×** |

Round 6's figure is a single external wall-clock sample around the whole `sh … --spec …` call (process
start to exit), not a per-rule breakdown, so it is not directly comparable line-for-line to Round 5's
per-rule split — it is comparable to Round 5's **combined** figure, which it reproduces within 12%
(66.9s vs. 76.1s), inside the run-to-run drift band this log's own rounds already establish (Round 5
recorded `S4.NEGATIVE` swinging 76% and `S6.BASE` 75% between Round 4 and Round 5 on unrelated rules).
Output was read, not just timed: both rules dispatched and reported `PASS`, scanning 85 archived
sprints, consistent with Round 5's 83 and Round 4's smaller pre-growth corpus — no coverage or dispatch
anomaly in this reduced-spec path.

### (2) leg 12 (TD-090) vs. the conformance-engine real-scale sweep (Round 5) — composition

| Quantity | What it measures | Target | Profile | In the 492s run TD-090 cites? |
|---|---|---|---|---|
| leg 12, 396.3s (TD-090) | 24 always-on eval harnesses; 9 touch the engine, each against **throwaway `mktemp` fixture repos** | fixture repos, never this repo | default (`QA_FULL` unset) | **yes** — this is what TD-090 measured |
| conformance engine, 281.2s sum / 287.4s wall (Round 5) | one direct full-spec (~100-row) engine invocation | `.` (this repository) | full spec — only reachable via `QA_FULL=1` or a standalone call | **no** — the 492s run's own leg 2f-ter costs 1.9–5s on the reduced 7-rule spec |

### Findings

- **The S11.LOGPAIR/WHENITRUNS disagreement reproduces a third time, by a third method, and does not
  dissolve.** 66.85s (this round, `--spec` reduction) sits with Round 5's two figures (75.6s embedded,
  76.1s `QAT_ONLY`-isolated) and against Round 4's implied ≤4s for its *entire* unnamed ~35-rule
  remainder — three measurements, two independently-built isolation mechanisms, one order of magnitude
  apart from Round 4's figure, on code unchanged since before either round ran.
- **Round 4 is the wrong one, and the cause is named: its "~4s" was never a measurement of these two
  rules — it is an arithmetic residual that omitted them from what got individually reported.** Round
  4's own §Method (2) instrumented the *identical* rule-dispatch loop Round 5 later used to name
  `S11.LOGPAIR`/`S11.WHENITRUNS` explicitly — the capability to see these two rules was present in Round
  4's own run. Round 4's write-up named 10 of ~45 dispatched rules from that instrumentation and folded
  everything else into "176.6s leg total − 57.16s `_own_scan` − 29.39s `S4.APPEND` = ~90s, of which 8
  named rules summed to ~86.0s" — leaving "≤4s" as what was left over for the unnamed remainder,
  *including* these two, never as a claim about them specifically. Round 4's own text already flagged
  this as partial ("only some" families named, spawn counts "a lower bound") — this round's contribution
  is confirming, by an independent measurement, that the omitted remainder was not small.
- **"Both are plausible" is ruled out, not just avoided**: Round 4's 176.6s leg-total figure is not in
  dispute (see next finding) — only its *decomposition*, specifically the unstated assumption that the
  ten named rules plus `_own_scan`/`S4.APPEND` accounted for nearly all of the leg, which three
  measurements now show is false for this pair alone.
- **leg 12 and the conformance-engine real-scale sweep do not measure overlapping work — they are
  disjoint by target, and disjoint by profile.** Every eval harness that invokes the engine builds its
  own throwaway `mktemp` repo; none targets this repository. The engine's full-spec sweep against this
  repository (Round 5's 281.2s/287.4s) only runs under `QA_FULL=1`, a profile the 492s run TD-090
  measured does not set — that run's own leg 2f-ter uses the 7-rule reduced spec, at 1.9–5s. `396.3 +
  281.2 = 677.5s`, which does not fit inside a 492s run — consistent with the two figures never having
  been part of the same run rather than one containing the other. Neither round's number is wrong; they
  describe non-overlapping executions under different settings.
- **A secondary, genuinely unreconciled gap is named rather than smoothed over.** Round 4's leg 2f-ter
  pre-fix total (176.6s, one sample, full spec, this repo, measured externally via `qa-check.sh`'s own
  section markers — confirmed a complete measurement, not extrapolated: the pre-fix run was killed
  *mid-leg-12*, after 2f-ter had already finished) and Round 5's full-engine wall clock for what should
  be the same operation (287.4s, one sample, same code, comparable corpus) disagree by 110.8s (63%).
  This is ruled OUT as an alternative explanation for the S11-pair disagreement — a uniform 1.63× scale
  of a genuine ~4s Round-4 figure would land near 6.5s, not the 66–76s measured three times — but it is
  a real, separate gap between two single-sample totals that this task did not chase further (out of
  scope: T1 settles the named disagreement and the leg-12/engine overlap question, not every total in
  the log). Flagged for whoever next re-measures leg 2f-ter's full-spec cost end to end.

### Restated ranking (post-verdict)

**Unchanged from Round 5, strengthened, not corrected.** The verdict above confirms Round 5's numbers
rather than revising them, so the family ranking T2 inherits is Round 5's own, restated by name:

1. F11 — §11 retention (`S11.LOGPAIR` + `S11.WHENITRUNS`) — 84,715.6 ms
2. F6 — §4 ADR governance — 72,134.5 ms
3. F5 — §1/§3 ownership-header (`S1.LAW2`) — 56,017.5 ms
4. F9 — §10 learning-governance (`S10.TDAGING`) — 37,443.8 ms

(top four = 89% of the real-scale total; the remaining eight families sum to 30,855.2 ms / 11%, per
Round 5's table — unchanged here, not re-measured this round.)

leg 12 (TD-090) is **not part of this ranking** — it costs the gate through a different mechanism
(many small process spawns across eval-harness fixture repos, not one large sweep against this
repository) and TD-090 already names it as its own, separately-tracked next-investigation target,
untouched by this verdict.

### Recommendation (round 6)

**The disagreement is settled: Round 4's implied ≤4s was an unreported arithmetic remainder, not a
measurement, and Round 5's 76.1s stands — reconfirmed by a third method at 66.9s.** The leg-12-vs-engine
question is settled the same way: they are not double-counted, because they are not the same work under
the same conditions. Per this task's scope, **no target is chosen here** — T2's first family is a G2
call under V3 §43, which this round supplies evidence for (Round 5's ranking, now cross-checked) and
does not pre-empt.

### Caveats recorded at the time

- **This round's own S11-pair rerun is a single sample**, matching Round 4/5's own precedent for a
  real-scale isolation pass (not the two-sample standard of Rounds 1–3). Host-specific, same
  Windows 11 / git-bash environment as every prior round.
- **The `--spec`-reduction method times the whole external process, not per-rule dispatch** — it is a
  genuine third, independently-implemented mechanism (the same reduction technique `qa-check.sh`'s own
  leg 2f-ter uses for its default-profile 7-rule spec, applied here to 2 rows instead), but it answers
  "do these two rules combined cost order-of-magnitude more than Round 4's implied ceiling," not "what is
  each rule's individual share" — Round 5 already answered the latter and is not re-derived here.
- **The 176.6s vs. 287.4s leg-total gap (Finding, above) is reported and not resolved** — named as an
  open item for a future round, in this log's own established practice of recording a gap rather than
  papering over it, consistent with Round 5's identical treatment of its own unresolved gap against
  Round 4.
- **Nothing in `scripts/`, `evals/`, or `spec/` was modified by this round.** The reduced spec file
  lives under the OS scratch temp directory, outside this repository. `conformance-engine.sh` and
  `qa-check.sh` were read only — no instrument-and-revert was needed because neither was touched.
- **Leg 12's own internal composition (which of its 24 harnesses dominate the 396.3s) was read for
  target/profile only, not independently timed per-harness this round** — out of scope: this task
  needed to know whether leg 12 and the engine sweep overlap, not to profile leg 12 itself. TD-090
  remains the open record for that.

## Round 7 — leg 12's own composition, timed per-harness; the dominant harness cut by spawn count (SPRINT-086 T2, 2026-08-25)

Round 6 left leg 12's internal composition unprofiled (out of its own scope). This round supplies that
profile — the one TD-090 named as the next investigation's starting point — and acts on the harness it
finds dominant, by the SAME mechanism Round 4 proved: cut process-spawn count, delete nothing.

**Method.** Each of the 26 `eval_harnesses_always` scripts was run as its own call
(`sh "evals/$h" >/dev/null 2>&1`, timed by `date +%s%N` immediately before/after), on this host,
single sample per harness, sequentially rather than through `qa-check.sh`'s own loop — isolating
harness cost from leg 12's own (cheap) dispatch overhead. This is a NEW measurement, not a re-run of a
prior round's method.

### Per-harness timing, this host, single sample (pre-fix)

| Harness | ms | Harness | ms |
|---|---:|---|---:|
| run-conformance-engine-fixtures.sh | **196,130** | run-ownership-header-fixtures.sh | 13,306 |
| run-foreign-repo-fixtures.sh | 37,917 | run-s2-placement-fixtures.sh | 13,179 |
| run-adr-family-fixtures.sh | 29,971 | run-dispatch-preflight-fixtures.sh | 11,676 |
| run-layers-completeness-fixtures.sh | 22,811 | run-review-depth-fixtures.sh | 10,757 |
| run-doc-caps-fixtures.sh | 21,453 | run-verify-reaches-fixtures.sh | 8,284 |
| run-spec-reader-fixtures.sh | 6,879 | run-gates-signed-fixtures.sh | 5,356 |
| run-qa-budget-default-fixtures.sh | 2,604 | run-manifest-lockstep-fixtures.sh | 2,234 |
| run-sprint-close-fixtures.sh | 2,165 | run-count-claims-fixtures.sh | 2,224 |
| run-skill-freshness-fixtures.sh | 2,030 | run-research-archive-fixtures.sh | 2,058 |
| run-epic-archive-fixtures.sh | 1,805 | run-system-verify-fixtures.sh | 2,766 |
| run-task-origin-fixtures.sh | 1,114 | run-worktree-usability-fixtures.sh | 1,006 |
| run-night-run-rollup-fixtures.sh | 901 | run-qa-budget-fixtures.sh | 888 |
| run-sprint-log-layout-fixtures.sh | 729 | run-ephemeral-intake-fixtures.sh | 423 |

**Sum: 400,666 ms (400.7s)** — within 1.1% of TD-090's 396.3s (different host session, same order of
magnitude; not claimed as a re-derivation of that figure, just a cross-check that this sweep is
measuring the same thing). `run-conformance-engine-fixtures.sh` alone is **49.0%** of leg 12 and larger
than the next TWO harnesses combined (foreign-repo 37.9s + adr-family 30.0s = 67.9s).

**Root cause, read from the source, then confirmed empirically.** The harness makes 38 `sh "$engine" …`
calls; 25 pass the FULL ~100-row spec. A single such call, timed directly against a near-empty target
(`sh scripts/lib/conformance-engine.sh <tiny-dir> --spec spec/STANDARD.md`), costs **8,546 ms** — the
driver's per-rule dispatch loop is already spawn-free (TD-073), but each of the ~50 dispatchable rows
still calls its `assert_<id>` function, and the fixed per-call cost scales with how many rows are in
the spec, confirmed by an xtrace spawn count (212 external-command lines for one full-spec call).
Three OTHER harnesses that also drive the engine (`run-adr-family-fixtures.sh`,
`run-ownership-header-fixtures.sh`, `run-s2-placement-fixtures.sh`) already hand it a spec REDUCED to
only the rows their cases need — their own header comments name this as deliberate, cost-motivated
design. `run-conformance-engine-fixtures.sh` was the one harness in the codebase that had not adopted
that established pattern for ~19 of its 38 calls (the tier-doc-set family, the reasoned-exemption
family, and the README-ownership-footer family — all of which check only 6 rule ids:
`S2.F-TIER` · `S2.R-README` · `S6.BASE/BACKEND/MEDIUM/MULTISVC`).

**Fix.** `evals/run-conformance-engine-fixtures.sh` now builds one reduced spec (`spec_s2s6`) once,
using the SAME section-preserving awk technique the file's own cases 7/9/10 already use for one
section (`sec == N || $0 !~ /^\| \`S[0-9]/` — drops rule ROWS outside the kept set, leaves every
non-rule line, including §2's own file-listing table that the tier logic reads, untouched) — extended
here to an explicit 6-id keep-list rather than whole sections, since whole-section §2 alone still
carries ~20 unrelated rule rows. 18 direct `--spec "$spec"` call sites plus 2 downstream spec-copy
builds (`spec-plus-base-row.md`, `spec-readme-reworded.md`) now read `$spec_s2s6` instead. No fixture,
target, or assertion was touched; only which OTHER rules ride along on a call these cases never read.

**Verified byte-identical.** Full harness output before/after: 45 lines, 43 PASS / 0 FAIL both times,
`diff` clean (`diff rc=0`). Isolated single-call check (same tiny target, `--spec spec_s2s6` vs. full
`--spec`) reproduces the exact same S6.\*/S2.F-TIER/tier-doc-set-\*/exempt-\* lines, only §3's
`S3.SCHEMA` note and unrelated §2 rows (never asserted by these cases) drop out.

**Timing, after fix, two samples, same host/session:** 143,230 ms and 163,691 ms (43 PASS / 0 FAIL
both times) — a **17–27% reduction** for this harness alone (196,130 ms → 143,230–163,691 ms), i.e.
**32,400–52,900 ms** off leg 12. Applying the more conservative (slower) sample to the Round-7 sweep
total by substitution (the other 25 harnesses are unchanged — confirmed by `git diff` touching only
this one file): 400,666 − 196,130 + 163,691 = **368,227 ms**, vs. the faster sample: **347,766 ms**.
Both are **derived by substitution, not by re-running the full 26-harness sweep after the fix** — a
second full sweep was not run this round (see Caveats).

### Tier G discrimination proof

Seeded a single-token break in the new keep-list regex (`S6\.MULTISVC` → `S6\.MULTISVCX`, one line,
verified by `cmp` against the pre-seed copy — differs at exactly one line, 923=923 lines both files,
`sh -n` still parses). Re-ran the full harness: **2 of 43 named cases reddened** —
`tier-multisvc-incomplete` and `tier-multisvc-clears` (the must-FAIL case and its own PASS control for
the id that was dropped) — while the other **41 case names, in the same order, stayed green**
(`diff` of the extracted `PASS/FAIL fixture(...)/harness(...)` name lists shows exactly those two lines
changed, nothing else). Restored from the pre-seed copy, verified byte-identical by `cmp` AND matching
`sha256sum` (`2922819d…` both before-seed and after-restore), then re-ran the harness a third time:
back to 43 PASS / 0 FAIL, `diff` against the original pre-fix baseline output clean.

### Caveats recorded at the time

- **Single sample for the pre-fix 26-harness sweep and for the isolated single-call profile**; two
  samples for the post-fix harness timing (143.2s, 163.7s) showing real run-to-run variance on this
  host under whatever background load existed at measurement time — consistent with this log's
  standing observation that this host's timings drift run to run.
- **No end-to-end `sh scripts/qa-check.sh` run was completed this round.** A background run was
  started to (a) capture the gate's own post-fix `QA-CHECK: N pass, M fail` line and (b) serve as the
  "issued after substantial agent work in the same session" under-load demonstration DoD 3 asks for,
  but it was stopped before completion when a coordinator correction arrived mid-run instructing no
  further long background waits — the run was killed, and its output was written to a file that was
  also removed as part of a scratch-file cleanup, so nothing from that attempt is usable evidence. **DoD
  3 (completion under load) is therefore NOT demonstrated this round** — only the harness-level
  before/after and the discrimination proof are. This is recorded here rather than left implicit,
  per this doc's own practice of naming a gap instead of smoothing over it.
- **The leg-12 total after the fix (368.2s / 347.8s) is arithmetic (sweep total − old harness sample +
  new harness sample), not a re-measured sweep** — the other 25 harnesses were not re-timed this round
  because they are byte-unchanged (`git diff` confirms only `evals/run-conformance-engine-fixtures.sh`
  was touched); re-summing an unchanged set was judged not to need re-running, but this is a derived
  figure and is named as such rather than presented as a fresh sweep total.
- **19 of the harness's 38 `sh "$engine"` calls still pass the full spec** (case 1's gap-labelling pair,
  case 2's S1.LAW1/S13.NOINFER pair, cases 4c and 8 which the file's own comments document as
  STRUCTURALLY requiring the full spec, and the attribution case) — left untouched this round as lower
  value (smaller individual cost, some entangled with cross-cutting invariants the full spec exists to
  exercise) rather than pursued for a marginally larger number. Named as unclaimed remaining headroom
  in this harness, not silently exhausted.
- **Other harnesses above the ~10s mark** (`run-foreign-repo-fixtures.sh` 37.9s, `run-adr-family-
  fixtures.sh` 30.0s already spec-reduced and git-bound, `run-layers-completeness-fixtures.sh` 22.8s,
  `run-doc-caps-fixtures.sh` 21.5s) were profiled for engine-call count only (foreign-repo and
  adr-family), not fixed this round — foreign-repo's 6 calls all check cross-cutting, full-spec-
  dependent invariants (documented in its own header as exercising "all 43 build dispositions") and
  adr-family already reduces its spec to §4 alone, so neither offered the same low-risk win.
  `run-layers-completeness-fixtures.sh` was profiled far enough to find a real candidate (nested
  per-token `grep` loops inside `scripts/lib/check-layers-completeness.sh`, ~4 spawns/token) but not
  acted on this round — untouched, not ruled out.
