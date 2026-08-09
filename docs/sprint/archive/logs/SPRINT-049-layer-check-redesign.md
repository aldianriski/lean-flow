---
sprint: 049
slug: layer-check-redesign
owner: Maintainer
last_updated: 2026-08-09
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-049 — Execution Log

> Append-only companion to [`../SPRINT-049-layer-check-redesign.md`](../SPRINT-049-layer-check-redesign.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-09 | surprise | A1 confirmed with a caveat — attribution needs three subject forms, and five real task commits carry no id at all

T1's premise held, but not in the shape the Plan assumed. Walking `plan_commit..close_commit` for
SPRINT-041 · 042 · 043 · 045 · 046 · 047 · 048 shows the task id reaching a commit by **three**
distinct routes — `sprint(48) T5:` (sequential inline), `feat(qa-check): … (SPRINT-042 T3)`
(trailing parenthetical), and `merge(43): T1 —` (coordinator merge-back) — and **five task commits
carry no id at all** (`c87e9e2` · `29ae7cb` · `aeadc78` · `c94a8c0` · `ba393a3`), reachable only
through the merge-back commit that absorbed them.

Why it matters rather than being trivia: a naive "subject must match `T<n>`" rule would classify
those five as coordinator bookkeeping and pass their files silently — which is TD-035's exact failure
mode rebuilt one layer down. The attribution design must therefore treat *unattributable* as a named
FAIL, never as a default bucket.

### 2026-08-09 | surprise | A2 falsified — TD-032's own mitigation is refuted by TD-032's own evidence

The Plan (and TD-032 before it) proposed narrowing the prose derivation to **DoD/Acceptance lines
only, excluding the free-text rationale paragraph**. Replaying `check-layers-completeness.sh` across
all 11 revisions of the SPRINT-048 Plan file shows every false positive lives **inside a DoD
checkbox item**, not in a rationale paragraph:

| Token | Block | What it actually was |
|---|---|---|
| `fog-fleet-orchestration.md` | T1 DoD | a source *read* while retro-fitting EPIC-001 |
| `requirements.md` · `product-requirements.md.template` | T7 DoD | explaining the feature-PRD → requirements pipeline |
| `T6` (leg c) | T2 + T4 DoD | a retrospective note — "constraint dissolved by T6" |

The narrowing would have fixed **none** of them. The real discriminator is the token's *role in the
sentence* — cited versus touched — which no line-scoped filter separates. Committed history shows at
most one FAIL standing at a time because each was reworded before its commit; the ~11 firings TD-032
counts were paid in the edit loop and are invisible in `git log`, which is why the cost went
unrecorded for two sprints.

This is L-088's shape landing on the sprint that promotes L-088: a premise correct when written,
invalidated by execution. Handled as the rule requires — a ruling, not a quiet reinterpretation.

### 2026-08-09 | surprise | third defect found — `Layers:` is silently single-line

`check-layers-completeness.sh` reads `grep -E '^Layers:'`, so a declaration wrapped across lines
keeps only its first line; every path on the continuation lines is then simultaneously *undeclared*
and *prose-implied*, producing a cascade of false positives under a misleading finding. This is what
actually failed at the SPRINT-049 promote. It was first mis-attributed to TD-032's prose-mention
shape and the Acceptance line was reworded (`qa-check.sh` → `scripts/qa-check.sh`) on that wrong
diagnosis; a direct test then showed the bare basename passes fine, since the check greps by
substring. Recorded because the mis-diagnosis is the instructive part (L-087): the symptom was real,
the mechanism welded to it was inferred and wrong.

### 2026-08-09 | scope-change | T1 splits into T1a + T1b; four G2 rulings recorded

**What broke.** T1 was sized **M** against a DoD whose mitigation premise is now falsified (A2), and
the investigation added a third defect not in the Plan. Re-sized honestly it is an **L**, which G1
requires to split before proceeding.

**Impact.** § Plan is amended — T1 becomes T1a (attribution correctness) + T1b (prose-derived
precision). No DoD item is dropped; item 4's falsified premise is replaced by the ruling below rather
than reinterpreted to fit. T2 is untouched.

**Re-confirmed G2** — owner rulings, this session:
- **R1** — split T1 → **T1a** (attributed per-task observed check: TD-035 + TD-031) + **T1b**
  (prose-derived precision: TD-032 + the single-line `Layers:` defect).
- **R2** — attribution prefers a `Task: T<n>` **git trailer**, falls back to the three observed
  subject forms, and reports an **unattributable** commit's non-bookkeeping paths as a named FAIL.
  Never a silent pass — that is TD-035's shape.
- **R3** — the prose-derived leg (a) **stays a FAIL** at promote rather than being demoted or
  deleted: it is the only validation of `Layers:` that runs *before* any file changes, and the
  worktree dispatch ownership map is derived from `Layers:` at promote. An **explicit inline escape**
  marks cited-not-touched filenames. The observed check cannot substitute here — it fires post-hoc,
  after the collision it exists to prevent.
- **R4** — leg (c) (`Depends-on` completeness) is **in scope** and takes the same escape. It is the
  same defect in the same file; TASK-152's done-when never named it, so this widens the task's
  stated boundary by explicit ruling.

**Dispatch note.** The three tasks are file-disjoint with no `Depends-on`, so they are
parallel-eligible under the worktree protocol. They run **sequential inline** this session: sub-agent
dispatch is disabled by owner instruction, and both split halves are `class: decision` (inline by the
skill's own rule regardless). Recorded so a later reader does not read the sequential shape as a
preflight failure.

### 2026-08-09 | scope-change | correction to the entry above — the split halves are T1 + T3, not T1a + T1b

Appended rather than edited (this file is append-only). The previous entry named the split halves
**T1a** and **T1b**. Both `scripts/qa-check.sh` and `check-layers-completeness.sh` extract a block id
with `grep -oE '^### T[0-9]+'`, so `### T1a` and `### T1b` both reduce to `T1` — two blocks reporting
under one id, which makes a per-block finding ambiguous in exactly the checks this sprint is
tightening. The split is therefore **T1** (attribution correctness: TD-035 + TD-031) and **T3**
(prose-derived precision: TD-032 + the single-line `Layers:` defect); T2 keeps its id and scope. R1's
substance is unchanged — only the labels are.

### 2026-08-09 | surprise | correction — the falsified premise is a DoD item, not assumption A2

Appended rather than edited. Two entries above are headed "A2 falsified". That label is wrong: the
Plan's **A2** is *"the retained SPRINT-041 fixture still reproduces its FAIL against the current
checkers"*, which is untouched by the replay and remains **open** — it is confirmed by the baseline
run, now T3's first DoD item. What the replay actually falsified is the premise sitting inside the
old **T1 DoD item 4** (and inside TD-032's Mitigation line before it): that narrowing the prose
derivation to DoD/Acceptance lines would remove the false positives. The finding and its evidence
stand exactly as recorded; only the identifier attached to them was wrong. Noting it because a
"falsified A2" left standing would read at close as though the fixture baseline had been done.

### 2026-08-09 | progress | T3 ran first — the Plan could not be committed until the check it fixes was fixed

Sequencing was forced, not chosen. The amended Plan made T3's must-PASS fixtures explicit
(`fog-fleet-orchestration.md`, `requirements.md`, the `T6` note), and naming them tripped the very
check T3 exists to repair — three FAILs on T3's own DoD plus one on T1's. Rewording to get green was
available and is exactly the behaviour TD-032 filed, so T3 was executed first and the Plan then
declared its citations through the new escape. The Plan is now the escape's first real consumer.

**A2 confirmed** (baseline, before any edit): both retained fixtures reproduce their FAIL by named
finding on the unchanged checker — `sprint-041-reconstructed` and `depends-on-omitted`, exit 1 each.
A fixture assumed to be guarding is the silent false-negative L-058 is about, so this ran first.

**Shipped.** A `Cites:` declaration line beside `Layers:`/`Depends-on:`; tokens listed there are
exempt from legs (a) and (c) for that block only. Absence changes nothing, so a forgotten escape
yields today's FAIL rather than a silent pass (L-071). Both checkers now read indented continuation
lines, and an unindented continuation is a named FAIL rather than silent prose.

**Ownership.** The continuation defect lives in *both* checkers, so T3 took the parser hunk in
`check-layers-observed.sh` — a file otherwise owned by T1. Single owner per hunk, commit order T3 →
T1; safe here because execution is sequential inline in one working tree, but recorded because the
declaration would otherwise read as an undeclared overlap. T1's attribution work does not touch the
parser.

**What the escape's abuse-case fixture does and does not establish.** `cites-contradiction.md` proves
a token cannot be simultaneously declared in `Layers:` and escaped in `Cites:` — that FAILs by name.
It does **not** prove that a cited-but-actually-changed file is caught, because this checker reads
text and never git history. That protection is structural rather than tested: `check-layers-observed.sh`
derives its set from `^Layers:` alone and never reads `Cites:`, so an escaped file that really changed
still surfaces as "changed but undeclared". Stating the split rather than letting the ticked DoD imply
both were tested (L-087 · TD-029's residual discipline). **Carried to T1** as an explicit assertion,
since T1 owns the observed side.

**Verification.** `evals/run-layers-completeness-fixtures.sh` 5/5 green (2 retained + 3 new) ·
`evals/run-layers-observed-fixtures.sh` 12/12 green after the parser change · `scripts/qa-check.sh`
bare: 71 pass, 0 fail, exit 0 — re-run after the DoD ticks and this entry, not before (L-089).

### 2026-08-09 | complete | T1 — attribution replaces the union, proven in both directions

**The negative test that mattered.** TD-035's shape was built once and run against two checkers in
the same throwaway repo: a Plan where T1's commit edits `bar.txt`, a file only T2 declared.

| Checker | Verdict |
|---|---|
| pre-T1 (`HEAD:scripts/lib/check-layers-observed.sh`) | `PASS … (all changed files declared)` — exit 0 |
| post-T1 | `FAIL … changed by a task that never declared it: T1:bar.txt` — exit 1 |

A fixture that fails on the new code proves nothing on its own; it has to pass on the old code, or
the "newly FAILs" claim is unverified. Both directions were run.

**Attribution probed against real history**, not only fixtures — all four forms resolve, including
the two adversarial cases: `sprint(48): fix gate FAIL committed in T4` → `COORD`, not `T4` (the
subject mentions a task but not in task position), and `c87e9e2 fix(qa): named SKIP …` →
`UNATTRIBUTED`, which is one of the five real id-less task commits that motivated rule 6.

**Exclusion list: ten entries → three** on the committed path. `TECH-DEBT.md`, `TODO.md`,
`CHANGELOG.md`, `docs/LEARNINGS.md`, both settings files and both plugin manifests are now answered
by attribution (`COORD`) rather than enumeration — which is exactly what TD-031 argued for. The three
survivors are re-justified individually in the checker.

**Carried assertion from T3, discharged.** `grep -c Cites scripts/lib/check-layers-observed.sh` → 0.
The observed checker derives its set from `^Layers:` alone and never reads `Cites:`, so a file escaped
as merely-cited that was nonetheless changed still surfaces here. The escape cannot hide a real
change — structural, and now checked rather than argued.

**Residual, explicitly open.** Attribution needs a commit, so uncommitted work in progress is still
tested against the union. This is unchanged behaviour rather than a regression, and the collision
TD-035 describes happens between committed worktree branches at merge-back — the path now covered.
Recorded here, in TD-035's resolution note, and in the checker itself, rather than left to be
rediscovered.

**Verification.** `evals/run-layers-observed-fixtures.sh` 16/16 green (12 retained + 4 new) ·
`evals/run-layers-completeness-fixtures.sh` 5/5 · `scripts/qa-check.sh` bare: 71 pass, 0 fail, exit 0,
re-run after the DoD ticks and this entry (L-089).

### 2026-08-09 | complete | T2 — L-088 promoted to an `/orchestrator` red flag

Placed immediately after the existing scope-change red flag and explicitly distinguished from it in
its own text: that row covers a **pivot** that shifts scope, this one covers a **criterion that went
stale while the scope held**. Without the distinction the two read as duplicates and the new one gets
skimmed past, which is how a promoted rule quietly stops working.

L-088's body collapsed to a pointer line per §11 — the durable rule is the record now, the body is in
git. `skills/orchestrator/SKILL.md` 100 → 101 lines, well under its ~140 cap.
`docs/knowledge-index.md` regenerated, since LEARNINGS metadata changed.

Worth recording: **L-088 fired a fourth time inside the sprint that promoted it.** T1's DoD carried
TD-032's narrowing mitigation as a premise; replaying the check across 11 revisions of the SPRINT-048
Plan falsified it. The new rule was followed rather than merely written — `scope-change` entry, owner
ruling, then the Plan amended. A promoted rule exercised once on real input in its own sprint is the
L-007 bar, met by accident of timing rather than design.

**Verification.** `scripts/qa-check.sh` bare: 71 pass, 0 fail, exit 0, re-run after the DoD ticks and
this entry.
