---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: Question revisited, or a new measurement changes the recommendation
status: current
id: qa-gate-timing
tags: [tooling]
domain: governance
related: [behavioral-eval-feasibility]
---

# Research — where do the QA gate's ~130 seconds actually go, and is moving harnesses behind `QA_FULL=1` the right lever?

> **Question.** TD-046 records the always-on gate at ~126s and proposes moving more eval harnesses
> behind `QA_FULL=1`, on the suspicion that "several harnesses re-run their checker over the entire
> live repo purely to guard a glob". Which harnesses, and how much of the runtime is actually theirs?
> **Verdict.** The proposed lever is the wrong one. The 14 always-on harnesses are **a third** of the
> runtime; the two-thirds nobody has looked at is the inline check half. Measure that before moving
> anything. Recommendation only — nothing was moved or edited.

## Why this matters

Every argument about the gate being too slow has been made against a single number taken once, at one
close. TD-046's own mitigation line flags itself as underived (L-091). Acting on it would mean a
coverage reduction carrying L-076's proof obligation, aimed at a target nobody had measured — and
L-097 exists because this repo has already held decisions on figures that were never re-taken.

## Options considered

- **A — Move harnesses behind `QA_FULL=1`** (TD-046's proposal). *Trade-off:* the obvious lever, but
  it is a coverage reduction and its size was never measured.
- **B — Cheapen the harnesses that rescan the live repo.** *Trade-off:* targets the specific suspicion
  rather than the category — but only if those harnesses are in fact expensive.
- **C — Measure first, move nothing.** *Trade-off:* costs a sprint task and delivers no speedup;
  produces the number every other option needs.

## Findings

Measured on Windows 11 / git-bash, this repo, 2026-08-10. Two samples of everything. Harness counts
were read from `eval_harnesses_always` in `scripts/qa-check.sh`, not assumed — there are **14**, not
the twelve TD-046 records.

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

## Recommendation

**Option C, and TD-046's stated lever is retired.** Do not move any harness behind `QA_FULL=1`: the
whole harness category is a third of the runtime, and the specific suspicion that motivated the
proposal — live-repo rescans — is two harnesses costing ~10s, both of which are zero-coverage controls
that must keep their live input. The next measurement is the inline half (sections 1–11 of
`qa-check.sh`), which is ~66% of the gate and entirely unexamined. Not ADR-grade: nothing is reversed
and nothing hard-to-reverse is decided — this replaces a hypothesis with a number.

## Out of scope / open questions

- **The inline bucket is a subtraction, not a measurement.** Full-run and standalone-harness timings
  are separate process invocations with their own filesystem-cache state, so the two do not reconcile
  exactly — `run-layers-completeness-fixtures.sh` alone varied 18.2s → 14.8s between its own samples.
  The 66% figure is sound as a proportion and should not be quoted to the second. Measuring sections
  1–11 directly is a follow-up.
- **Both full-run samples exited 1**, from this sprint's own in-flight state (a stale knowledge index
  and an undeclared `Layers:` entry), not from any harness — every harness sampled exited 0. Timing is
  unaffected; noted so the raw log is not misread later.
- **Nothing was moved, cheapened or edited.** `scripts/qa-check.sh` and `evals/` are byte-identical.
  An unacted recommendation here is not a rejected one — the inline measurement is what it waits on.

---

## Follow-up measurement — sections 1–11, measured directly (SPRINT-060 T3, 2026-08-10)

The open question above ("the inline bucket is a subtraction, not a measurement") is now closed with a
direct per-section measurement, 2 samples, taken at **136 checks** — up from the 131 the original run
measured.

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
  samples; 12–15 are 39.2% / 36.3%. The subtraction was sound as a proportion, exactly as the original
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

### Recommendation

**The lever, if one is ever pulled, is section 4 — not the harnesses.** Nothing is moved or cheapened
here; T3 measures and does not cure, by its own scope. What this does is redirect the next decision at
a component that is ~47% of the gate and has never been examined, instead of at one that is ~33% and
has now been cleared twice. A cure for section 4 would need its own re-derivation first (L-091): the
section validates index freshness, dangling refs and frontmatter completeness across the whole
knowledge corpus, and at least the freshness half is a genuine whole-corpus read that cannot be
narrowed without losing what ADR-009 wired it for.

**Still not ADR-grade.** Nothing is reversed; a hypothesis is replaced by a number, again.
