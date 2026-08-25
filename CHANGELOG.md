---
owner: Maintainer
last_updated: 2026-08-25
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---
## v1.59.0 — Guards That Cannot Fire (2026-08-25)

MINOR — SPRINT-086, **17 of 18 DoD** — closed at `QA-CHECK: 183 pass, 0 fail`. Three shipped guards
were correct, fixture-proven, and could not fire on the traffic they were built for. Each now reaches
its own subject. **Consumer-facing, and one of these will change what your gate reports.**

**The review-depth gate got stricter, and consumer repos will feel it.** A task recording
`governance:high` or `behaviour:material` work with **no review line at all** used to pass as
`no review line -- nothing to verify`, exit 0. It now FAILs with a named finding. The carrier is a new
whole-line field in the sprint-log schema — `consequence · Tn · behaviour:… · governance:…` — written
when the review skip table is consulted, **independent of whether a review then happens**. That
independence is the whole fix: the old `review ·` line only existed *after* a review, so work whose
review never happened was structurally invisible. Documented in `sprint-log.md.template`,
`orchestrator/SKILL.md` § Review, and `review-scoping.md`. The detector normalises whitespace and field
case before matching, so hand-transcription drift is caught rather than silently ignored — while
staying whole-line anchored, so prose *about* the schema still does not match.

**The QA budget default drops 900s → 450s**, with the arithmetic stated beside it (`600s ceiling −
150s headroom`). The old default could only trip after fifteen minutes in an environment where nothing
survives ten — a guard that could not fire, shipped to prevent exactly the failure it then failed to
prevent. It is now checked at **22 points across legs 2–12** rather than only inside leg 12, and a new
`check-qa-budget-default.sh` runs as a gate leg so the value cannot drift back above the ceiling. It
**fired on live traffic during this sprint**: a 461s run named its three skipped harnesses instead of
dying past an external timeout with no verdict line.

**The gate now completes under load.** It printed a verdict on a process table carrying six live
worktrees, seven agent dispatches and four prior full runs — where three attempts under comparable
load in the previous sprint died at 204 / 117 / 100 lines without ever printing one. Leg 12's dominant
harness adopted the spec-reduction pattern its own siblings already used (196.1s → 143.2s), with the
check inventory verified identical before and after: **50 fixture names, zero removed**.

**Also:** a measurement dispute settled — Round 4's implied ≤4s for two §11 rules was an *arithmetic
residual* for ~35 unnamed rules, not a measurement, reproduced a third time by an independent
mechanism; and leg 12 and the conformance-engine sweep proved **disjoint by target and by profile**,
so two figures that appeared to contradict each other never described the same run. Three `severity:
high` debt rows closed (TD-085 · TD-091 · TD-092); TD-090 remains open and `high` — the gate now sits ~1% under its own budget, so a sprint's own close output can still trip it.

## v1.58.0 — Standard Parser and Shell Parity (2026-08-25)

MINOR — SPRINT-085, **26 of 26 DoD** — closed at `QA-CHECK: 183 pass, 0 fail`. EPIC-014's **first
§ Closed-when condition, closed whole**. **Consumer-facing: one gate got stricter.**
`check-review-depth.sh` now FAILs with a named finding when a task records `governance:high` or
`behaviour:material` and carries **no** review line at all — previously that passed as
`no review line -- nothing to verify`, exit 0. A consumer repo that closed clean may now see a named
FAIL; that is the fix working. The TS engine below is **not** consumer-reachable — it has no CLI until
H11 and `package.json` still declares zero dependencies, so the no-toolchain install guarantee holds.

**The Standard is read by a parser now, not by a regex.** A hand-written block tokenizer (headings,
pipe tables, fenced code, paragraphs — each with a source location, zero imports, because ADR-035
leaves no Markdown library to reach for) feeds a reader that finds rules by asking *which table sits
inside which `## §N` window*. It emits all **100** rows in document order and agrees with
`scripts/lib/read-spec-rules.sh` **row-by-row, never in aggregate** — the assertion names the offending
row, and was demonstrated by perturbing one mark until exactly one test reddened. The discriminator
that proves a structural parse beat a substring match: `S13.NOINFER` appears **twice** in the Standard
and is admitted **once**. Given a denominator rather than a bare zero (L-156): **148** rule-id-shaped
tokens exist in the document, 100 admitted, 48 prose and duplicate mentions filtered.

**Absence and emptiness are now different answers, enforced by a type.** `SpecReadFail` carries no
`rows` field *at all*, so a caller cannot confuse "checked nothing and found a finding" with "checked
and found zero". An unreadable table is a named finding with a non-zero exit; §8 — which genuinely has
no rules — exits **0 silently**, because §14 publishes 0 for it. `--reconcile` reproduces the
per-section count table and the mismatch FAIL, which is the only thing that tells a silently-dropped
section apart from a legitimately empty one. Parity is held against the **9 retained fixtures the Shell
reader already answers to**, with the Shell reader spawned as a live oracle inside the TS tests rather
than its output frozen as a literal — so parity cannot rot silently.

**A guard was fixed, and then shown not to reach the case that motivated it.** `check-review-depth.sh`'s
absence branch is real — two named findings, two retained must-FAIL fixtures, and a seeded break that
reddens exactly those cases while seven siblings stay green. Pointed at the log that motivated it, it
still passes: the detector anchors on the *unattended* rollup contract, and every sprint here is
attended. Accepted for the branch it proves and the gap filed (TD-092 · L-166) rather than papered
over. Also: the conformance engine profiled per rule family (§ Round 5 — 281.2s, 89% in four families),
and `qa-gate-timing.md`'s recommendation **amended, not superseded**, with its coverage-reduction
ruling explicitly left standing.
