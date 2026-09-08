---
owner: Maintainer
last_updated: 2026-09-08
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v1.58.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **SPRINT-096 promote** (2026-09-08).
> Late: §11 keeps current + previous minor inline and **five** had accumulated (v1.58–v1.62), so
> v1.58.0 · v1.59.0 · v1.60.0 were rotated in one pass rather than one per release. Reachable only
> from the root changelog's link line (STANDARD §11).

---

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
