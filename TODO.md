---
owner: Maintainer
last_updated: 2026-08-25
update_trigger: Sprint completed, task added, or task status changed
status: current
---

# lean-flow — Development Tracker

> **How to use this file**
> - **Session start** — `/prime`; read this before touching code.
> - **`/triage`** grooms the Backlog (re-rank, state, route rejects to `.out-of-scope/`).
> - **`/lean-doc-generator promote`** forms a sprint from `ready` Backlog tasks → `docs/sprint/`.
> - **`/orchestrator sprint-bulk`** builds it; **`/lean-doc-generator close`** runs the Retro → §10 routing.
> - Tech Debt lives in root **`TECH-DEBT.md`**: `TD-NNN`, never deleted; aged at promote (≥3 sprints → re-review; `high` → auto P1).

---

## Active Sprint

> _None._ SPRINT-084 closed 2026-08-25 → [docs/sprint/SPRINT-084-gate-recovery-and-owed-work.md](docs/sprint/SPRINT-084-gate-recovery-and-owed-work.md)

**Next promote is EPIC-014's V3 Sprint B**, and its blocking condition is now met. Sprint B (Markdown
AST parser + Shell parity, H05/H06) has **no Backlog tasks** — EPIC-014 states the post-083 shape is
*"not promoted, and each re-derived at its own promote."* Slicing it is `/task-decomposer --epic
EPIC-014`. It was held because the strangler method rests on *measured* parity and the gate could not
print a verdict line; **SPRINT-084 T1 restored that** (`QA-CHECK: 176 pass, 3 fail`, 492s), so the
condition that deferred it no longer holds.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P1 — Next Phase Required

- [ ] TASK-273 — Close `check-review-depth.sh`'s absence blind spot  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 — a `check-*.sh` in the QA gate; a false negative here is silent by
                  construction, and this row exists because the guard already produced one)
      done-when:  a live sprint log carrying a `governance:high` (or `behaviour:material`) task with
                  **no** `review ·` line is reported as a **FAIL with a named finding**, not as a
                  `nothing to verify` note. One retained must-FAIL fixture per branch (absent-line +
                  governance:high · absent-line + behaviour:material), each failing with its own named
                  finding, plus the discrimination proof ADR-029 requires of Tier G. The archive-skip
                  half is ruled separately and explicitly — either archived paths become readable when
                  passed by name, or recording a review there is forbidden — but it is **ruled**, not
                  left implicit
      touches:    scripts/lib/check-review-depth.sh · evals/run-review-depth-fixtures.sh ·
                  possibly scripts/qa-check.sh (leg 2b wiring)
      depends-on: none
      assumes:    **the defect is reproduced, not inferred** — SPRINT-084 T2 ran it live: a log with a
                  `governance:high · behaviour:material` task and no `review ·` line prints
                  `no review line -- nothing to verify` and exits **0**. SPRINT-082 did exactly this and
                  closed 38 of 38 with zero review lines on the record; SPRINT-084's own live log does
                  the same. Escalated to P1 by the ledger's own rule (`severity: high` → auto-P1), not
                  by preference. Out of scope: re-litigating whether archived history should be
                  re-read — that is the ruling this task must *make*, not assume
      tracker:    TD-085 · L-165 · L-105 · SPRINT-082 T2 · SPRINT-084 T2
      origin:     close-retro
      state:      ready

- [ ] TASK-274 — Rule on `qa-gate-timing.md`'s superseded recommendation  [size: S] [risk: low] [HITL]
      class:      decision
      tier:       P (ADR-029 — a research decision doc; a defect is visible on first read)
      done-when:  `docs/research/qa-gate-timing.md`'s standing Recommendation is either amended or
                  marked superseded with a pointer to § Round 4, so a reader cannot act on a conclusion
                  the measurement overturned. Whichever way it is ruled, the doc stops asserting a
                  recommendation that the evidence below it contradicts
      touches:    docs/research/qa-gate-timing.md · docs/knowledge-index.md (generated)
      depends-on: none
      assumes:    **the supersession is specific, not general.** The doc's Recommendation ("Option C
                  stands... no sub-part of section 4 worth cutting") correctly ruled out
                  *coverage reduction* as a lever and was never wrong about that. It never tested
                  *spawn-count reduction*, which is where SPRINT-084 T1's actual cure came from
                  (271.5s → 23.6s with no coverage removed). So this is a scope correction, not a
                  reversal. Deliberately left for a promote-time ruling rather than edited mid-sprint,
                  because rewriting a decision doc to match a result is how the record stops being one
      tracker:    docs/research/logs/qa-gate-timing.md § Round 4 · TD-090 · SPRINT-084 T1
      origin:     close-retro
      state:      ready

- [ ] TASK-188 — Exercise the reaper on a genuinely partial Plan  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  a real unattended run that stops mid-Plan leaves a rollup naming the untouched tasks
                  as `unattempted`, verified end-to-end through `scripts/night-run.sh` rather than via
                  `--reap`
      touches:    scripts/night-run.sh (only if the exercise finds a defect) · a sprint Execution Log
      depends-on: none
      assumes:    **carried from SPRINT-060 T5, acceptance unmet — read the ruling before re-promoting.**
                  The trigger is OPPORTUNISTIC and that is the whole design: the next night run that
                  stops mid-Plan *for its own reasons* is the exercise. Do not schedule a run to produce
                  one, and do not promote this into a sprint whose shape cannot generate it — SPRINT-060
                  promoted it alongside four HITL tasks, the run mode was then ruled interactive at G2,
                  and that foreclosed the only vehicle it had (L-111). Its partial-Plan path is already
                  proven three ways that each stop short of the others: a real log through `--reap`, a
                  zero-ticked-box regression, and an end-to-end launcher run against a complete Plan
      tracker:    SPRINT-060 T5 scope-change + owner ruling · ADR-016 · L-111
      origin:     close-retro
      state:      blocked

- [ ] TASK-275 — Tokenize the Standard to a typed block tree, proven end-to-end on §13  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8 — the parser is named Tier G there; a parser that silently drops a
                  rule is a false negative the whole engine inherits)
      done-when:  the TS reader emits §13's **7 rows** as `(id, level, mark)`, identical to
                  `sh scripts/lib/read-spec-rules.sh spec/STANDARD.md --section 13`, and derives them by
                  **querying a typed block tree** — asking which table sits inside which `## §N` window —
                  rather than by matching lines. A hand-written block tokenizer covering only what the
                  Standard uses: ATX headings, pipe tables, fenced code, paragraphs, each carrying a
                  source location. Branches are enumerated **from the code, not from memory**, and each
                  carries its own seeded break (L-164 came from the layer directly below this one)
      touches:    packages/standard (parser + block model, extending the existing domain model) ·
                  its colocated tests · test/fixtures as needed
      depends-on: none
      assumes:    H04 is delivered — `packages/standard/src/model.ts` exists from SPRINT-083, verified
                  on disk rather than read off the epic's member row. **Zero dependencies is binding**
                  (ADR-035; `package.json` carries no `dependencies` key), so no Markdown library is
                  available and the tokenizer is hand-written. Out of scope: CommonMark completeness —
                  nested lists, blockquotes, setext headings, inline emphasis and lazy continuation are
                  deliberately unmodelled, because every extra branch is one more that must be proven
      tracker:    EPIC-014 · V3 H05 · ADR-035 · L-164
      origin:     decomposer
      state:      ready

- [ ] TASK-276 — Reach full-document parity on the real Standard, row by row  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8)
      done-when:  the TS reader emits **all 100 rows** in document order and agrees with
                  `read-spec-rules.sh` **row-by-row, never in aggregate** (EPIC-014's § Closed-when
                  wording is explicit on this), and reproduces the `position-anchored-not-substring`
                  result: `S13.NOINFER` occurs **twice** in the Standard and is admitted **once**, as a
                  rule. That case is the discriminator that proves a structural parse beat a regex —
                  §14 and §8 both name other sections' rule ids in prose, and a substring match ingests
                  them as rules (L-108)
      touches:    packages/standard (section walk + rule-row extraction) · its colocated tests
      depends-on: TASK-275
      assumes:    the comparand is `<id> <level> <mark>`, read from `read-spec-rules.sh`'s own usage
                  block, and **100** is the frozen denominator settled by ADR-034 (`51` checkable +
                  `49` marked non-evaluated; the circulating `79` is a disproved query whose regex
                  stopped at a hyphen, missing exactly the 21 hyphenated §2 ids). Any Shell/TS
                  difference found here is **ruled, never absorbed** (EPIC-014 D2) — which is why this
                  is HITL despite a mechanically checkable acceptance
      tracker:    EPIC-014 · V3 H05/H06 · ADR-034 · L-108
      origin:     decomposer
      state:      ready

- [ ] TASK-277 — Match the Shell reader's error semantics on the malformed corpus  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8)
      done-when:  for the retained cases `spec-table-unreadable-whole`, `spec-table-unreadable-section`,
                  `spec-not-found` and `zero-rule-section-is-not-a-finding`, the TS reader agrees with
                  the Shell reader on the **named finding and the exit meaning**, not merely on rows.
                  An unreadable table is a *named finding on stderr with a non-zero exit*, never an
                  empty rule set — a reader that returns nothing checks nothing and exits clean, which
                  is the false negative the whole engine would inherit (L-058). A zero-rule section
                  (§8) exits **0 silently**, because §14 publishes 0 for it: absence and emptiness are
                  different answers and must stay distinguishable
      touches:    packages/standard (error model + findings) · its colocated tests
      depends-on: TASK-275
      assumes:    the parity corpus **already exists and is retained** — `evals/run-spec-reader-fixtures.sh`
                  holds 9 green cases, confirmed by running it as its own call, so no new fixture corpus
                  is owed and these tasks assert against the comparand the Shell engine is already held
                  to. Out of scope: inventing new malformed shapes beyond the retained set
      tracker:    EPIC-014 · V3 H06 · L-058
      origin:     decomposer
      state:      ready

- [ ] TASK-278 — Reproduce `--reconcile` against §14's published counts  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8)
      done-when:  the TS reader reproduces the per-section count table and the mismatch **FAIL**,
                  agreeing with the Shell reader on `reconciles-with-section-14`, `section-rows-mismatch`
                  and `spec-counts-unreadable`. A section returning zero rows while §14's own counts say
                  it has some is a **FAIL, not an empty result** — that comparison is the only way a
                  silently-dropped section is distinguishable from a section that legitimately has none
      touches:    packages/standard (reconcile mode) · its colocated tests
      depends-on: TASK-276
      assumes:    §14 is the published-counts source and stays the comparand; this migrates a **mode**
                  of the existing reader, not a new capability. Out of scope: changing what §14
                  publishes, or reconciling anything beyond per-section rule counts
      tracker:    EPIC-014 · V3 H06
      origin:     decomposer
      state:      ready

- [ ] TASK-279 — Profile `conformance-engine.sh` per rule family → § Round 5  [size: S] [risk: low] [AFK]
      class:      execution
      tier:       P (ADR-029 — a measurement record; a defect is visible on first read)
      done-when:  per-rule-family runtime and process-spawn counts for the conformance engine are
                  appended as **§ Round 5** to `docs/research/logs/qa-gate-timing.md`, matching Rounds
                  1–4's established shape (per-unit table · Findings · Recommendation · Caveats), with
                  the dominant families **named with their numbers** and the measurement method stated.
                  Seeds V3 §43's migration matrix columns (Rule · Shell · TS · Parity · Authority) so
                  the first family to migrate is chosen on evidence
      touches:    docs/research/logs/qa-gate-timing.md (append-only — never edit a past round)
      depends-on: none
      assumes:    **Round 4 is a partial answer, not the answer.** SPRINT-084 T1 measured `qa-check.sh`
                  legs and named only some conformance-engine families, flagging its own spawn counts
                  as a **floor**; EPIC-014's open question requires the family order not be frozen
                  before a profile exists (V3 §43 · L-130), and §43 forbids ordering by section number.
                  Method is established: time each family in isolation against a tiny input so
                  per-invocation overhead is not masked by workload (L-144 · L-147). Out of scope:
                  *acting* on the profile — choosing the first family is Sprint C's G2 call, not this
                  task's, and freezing an order here would repeat the mistake the question guards
      tracker:    EPIC-014 open question · V3 §43 · L-130 · L-144 · docs/research/logs/qa-gate-timing.md § Round 4
      origin:     decomposer
      state:      ready

### P3 — Long-term

> Rejected work lives in **`.out-of-scope/`** — each file carries its own reasoning, revisit-if and
> expiry, and `/triage` step 1 scans that directory before keeping any resembling task. The per-task
> pointer lines that used to sit here were breadcrumbs to those files, pruned under §11's TODO cap on
> the same reasoning §11 uses for shipped Backlog entries — the durable home is the `.out-of-scope/`
> file, plus git. Ids stay monotonic: 006 · 007 · 040 · 047 · 120 · 148 are not reused.

---

## Tech Debt

> Moved → **`TECH-DEBT.md`** (root) — split 2026-07-29. Filed at Sprint Close, aged at Sprint Promote.

---

## Changelog (current sprint only)

> Move to root `CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — SPRINT-082's shipped changes are written up as **v1.56.0** in [`CHANGELOG.md`](CHANGELOG.md), MINOR by hand (feature sprint; `/release-patch` is PATCH-only). Consumer-facing surfaces: the root `.gate-command` declaration (ADR-033) and review depth keyed on consequence rather than file extension.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

