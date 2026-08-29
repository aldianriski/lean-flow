---
sprint: 093
slug: close-the-autonomy-guard-gap
stream: autonomy
owner: Maintainer
last_updated: 2026-08-29
status: active
update_trigger: appended at each execute/close event — append-only, never edited
---

# SPRINT-093 — Execution Log

> Append-only sibling of the frozen Plan (ADR-014). The § Plan is frozen at promote; a mid-sprint
> scope shift is logged **here** before the Plan is edited.

---

### 2026-08-29 | progress | G1 + G2 signed; full checklist, no fast-path

**Gates signed at `760dc69`.** G1 ran its **full checklist** rather than the fast-path, and the reason
is a fact about these tasks rather than a judgement: all four are `origin: close-retro`. A close-Retro
follow-up is filed from a Retro and never passed `/task-decomposer`'s intake grill, so there is no prior
scope agreement for a fast-path to re-confirm. The `origin:` field is what says so — never inferred from
`tracker:` or from how well the entry reads.

**Both assumptions confirmed against artifacts before G2.**
**A1** (the false-`PLAN_EXHAUSTED` artifact is committed and reproducible) — confirmed at
`docs/sprint/archive/logs/SPRINT-089-prove-the-unattended-run.md:194`:
`terminal · PLAN_EXHAUSTED · every task reached a resolved state`, with `:213` recording that T2
**parked**, which makes the correct state `AUTHORITY_BOUNDARY`. The artifact is real, committed and
quotable — so T1's retained fixture points at it rather than at a synthetic reconstruction (L-166).
**A2** (the launcher dies on a red gate and no bypass exists) — confirmed by counting rather than by
eye: `bypass` 0 occurrences, `--force` 0, and `die_doa "pre-flight gate scripts/qa-check.sh failed"`
present. **The first attempt at this check was wrong and is recorded as such**: it read
`grep -c ... | head -3 || echo "EMPTY"`, where `||` binds to `head` — which succeeds on empty input, so
the fallback could never fire and an absent match would have read as a confirmed presence. That is
L-045's own shape inside the confirmation of an assumption, caught by re-deriving with a count.

**Every task here is `authority: J2` and two are `class: decision`.** Recorded at G2 rather than
discovered later: T3's exception policy and T4's item-3 reading are **rulings, and the ruling IS the
deliverable** — neither can be discharged by an implementation. This Plan is therefore not a night-run
candidate, and saying so here is what stops a future pre-flight from parking 4 of 4 and calling it a run
(L-111).

**SPRINT-090's D4 is explicitly not inherited** (§ Decisions D3). Its justification was corrected after
the fact — only one of three cited mechanisms is genuinely unreachable under the strict reading, and
`AFK-safe` and `J2` are defined as opposites in the same document, which cuts the other way. T4
re-derives rather than citing it as precedent.

**Cross-stream ownership fixed before either stream started.** This stream owns `gen-index.sh`,
`docs/knowledge-index.md`, `night-run.sh`, `check-night-run-rollup.sh`,
`evals/run-night-run-rollup-fixtures.sh` and `night-run.md`; the `engine` stream owns
`scripts/qa-check.sh` and the ADR-family harness. The `engine` stream's T3 had declared a bare `evals/`
directory that swallowed this stream's rollup harness — corrected there at G2, logged in its own Log.

Checkers: `check-layers-completeness` · `check-verify-reaches` · `check-authority` — **0 FAIL each**.
---

### 2026-08-29 | scope-change | T1's DoD 2 is unsatisfiable as written; owner ruled it reworded

**The criterion demanded something the repository does not contain.** DoD 2 read: *"The SPRINT-089
artifact is the retained fixture — pointed at the real committed rollup, not a synthetic
reconstruction (L-166)."* The independent reviewer checked the archive and found that SPRINT-089's
committed rollup carries **only** `run · 12 of 12 DoD ticked` and the `terminal · PLAN_EXHAUSTED` line.
It has **no per-task line at all** — T2's parked state exists there in prose only. Feeding that real,
unmodified file to the checker **PASSes**, because there is nothing present to contradict.

**And no other committed artifact can serve either.** The reviewer went looking, including at
SPRINT-088's rollup, which Part 0b's own margin note cites by name: that file shows only the
*corrected* `AUTHORITY_BOUNDARY` reading, with the false one again in prose. **No single committed file
in this repository's history carries a contradicting terminal + per-task pair at column 1** — every real
instance was either corrected before commit, or split across two files by the very cross-write bug
TD-112 describes. The defect erased its own evidence.

**What the harness actually builds** is a composite: SPRINT-089's `run` and `terminal` lines plus
SPRINT-090's `T2 · parked-hitl` line, each grep-extracted verbatim at test-run time, with an
`extract_ok` guard that FAILs loud if either source drifts. Assembled into a `SPRINT-989` file that
never existed. The `12 of 12` DoD count beside that particular `T2` line was never true of anything.

**Owner ruling: reword DoD 2 to what is provable, rather than tick a false claim or leave the sprint
carrying a permanently unsatisfiable checkbox.** The original wording is preserved above so the change
is auditable. Two things made the rewording the right call rather than a convenience: the extraction is
genuinely verbatim and drift-guarded, which is materially stronger than a hand-typed fixture; and the
*fact* it encodes — T2 parked under a `PLAN_EXHAUSTED` terminal — is attested by SPRINT-089's own log,
just in prose rather than in rollup syntax.

**The coordinator's earlier judgement was wrong and is recorded as such.** Reviewing the composite
before dispatch, the coordinator judged it L-166-satisfying and asked the reviewer to *test rather than
echo* that judgement. The reviewer refuted it. That is the review working as designed — and it is the
second time this sprint an outside pass has overturned a coordinator judgement, after the CRLF finding
below, where the coordinator's own instrument (`grep -c $'\r'`, which counts matching *lines*) reported
0 CR bytes against `tr -cd '\r' | wc -c`'s 35 and nearly dismissed a live gate defect.

**Reachability was separately confirmed, and this is what keeps L-166 satisfied in substance.** The
archived quote cannot trip the checker for three independent reasons — the `*/archive/*` path skip, the
entry heading having been retroactively corrected from `run-complete` to `surprise`, and the rollup
being indented four spaces inside a fenced block. Any one alone would suffice. On a live log the
reaper's `printf` writes at column 1, so the guard is reachable exactly where it must be.

