---
owner: Maintainer
last_updated: 2026-08-10
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
