# v1-to-v2 migrate fixture

Retained proof for the v1 → v2 work-item-store mapping in
`skills/lean-doc-generator/references/migration-map.md` § v1 → v2 work-item store (2.0)
(SPRINT-106 T4, `TASK-370`; revised after a read-only outside review). Migrate is an **agent-run
procedure** (ADR-043's consumer contract — no Bun/TS script ships to consumers), so this fixture
does not check the procedure by *executing* it; it checks the **invariants** the procedure's
output must satisfy, against hand-built `expected*/` trees that a correct run of the mapped
procedure would produce from the paired `input*/` tree.

## Scenario 1 — the happy path: `input/` → `expected/`

### input/ — the v1 tree

- `TODO.md` — three synthetic Backlog tasks: `TASK-913` (P1), `TASK-914` (P2, `depends-on:
  TASK-913`), `TASK-915` (P2, `depends-on: TASK-913`).
- `docs/sprint/SPRINT-903-fixture-sprint.md` — a two-task Plan:
  - `### T1` cites `TASK-915` — **one `## Done when` box, ticked**. `TASK-915` is deliberately the
    **overlap case** (§ Overlap rule): it sits in both the Backlog and the Plan.
  - `### T2` cites `TASK-916` — **one `## Done when` box, unticked**. `TASK-916` has **no Backlog
    row anywhere** — the **Plan-only case** (revise-round HIGH #1): `priority:`/`state:`/`origin:`
    have no v1 source for it, so `expected/`'s file carries **owner-supplied** values (this
    fixture simulates the owner answering the migrate plan's per-field prompt): `priority: P2`,
    `origin: manual`, `state: ready` — chosen values, not defaults; there is no rule that derives
    them, which is the point being proved.

### expected/ — the v2 tree a correct migrate run produces

| File | Status folder | Why there |
|---|---|---|
| `TASK-913-add-a-retry-to-the-flaky-upload-step.md` | `backlog/` | Backlog-only, no Plan `Tn` cites it |
| `TASK-914-document-the-retry-backoff-in-the-deploy-guide.md` | `backlog/` | Backlog-only |
| `TASK-915-cap-the-upload-steps-total-wall-time.md` | `done/` | the **overlap** task — Plan wins tick state (1/1 boxes ticked), `sprint: SPRINT-903` set, and *every* box ticked routes it to `done/` (not `todo/`, which is for a Plan member with at least one open box) |
| `TASK-916-retry-the-upload-steps-auth-handshake.md` | `todo/` | the **Plan-only** task — 0/1 boxes ticked → `todo/`; `priority:`/`origin:`/`state:` are the owner-supplied values named above, not derived |

No `TODO.md` in `expected/` — every Backlog row and every Plan `Tn` resolved to a file with no open
conflict, so migrate removes it (owner ruling, `docs/sprint/logs/
SPRINT-106-the-store-and-the-way-in.md` "owner ruling — migrate removes TODO.md; no tombstone").

**Hand-counted expected figures** (what the harness's reference implementation is checked
against):

- **Id set**: `{TASK-913, TASK-914, TASK-915, TASK-916}` before (Backlog ∪ Plan `Cites:`) must
  equal the same set after (every `docs/work/**/TASK-*.md` filename in `expected/`). Diffed both
  ways, both empty.
- **Ticked-box count**: **1** before (`SPRINT-903` T1's single `- [x]`; T2 contributes 0) must
  equal **1** after (`TASK-915`'s single `- [x]` — the only ticked box anywhere in `expected/`,
  since `TASK-916` is unticked).
- **Overlap**: `TASK-915` produces **exactly one** file (not one in `backlog/` *and* one in
  `todo/`/`done/`).

## expected-missing-task/ — must-FAIL sibling (a): id-set case

Same as `expected/` (including `TASK-916`), minus `TASK-914` entirely. The id-set check must
redden: `v1_ids ∖ v2_ids = {TASK-914}`, not empty. Every other file is left untouched so the
*other* invariants (ticked-box count, overlap) still hold on this tree — only the id-set case
should fail.

## expected-duplicate-overlap/ — must-FAIL sibling (b): overlap case

Same as `expected/` (including `TASK-916`), plus a second copy of `TASK-915`'s file placed in
`todo/` (so it now exists in **both** `done/` and `todo/`). The overlap check must redden:
`TASK-915` maps to 2 files, not 1. Id set is unaffected (a *set* dedupes the two files' shared id),
so only the overlap case should fail on this tree.

## Scenario 2 — a conflict blocks removal: `conflict-input/` → `conflict-expected/`

Revise-round HIGH #2: an unresolved conflict must block `TODO.md` removal outright, not just get
"reported" while removal proceeds anyway.

### conflict-input/

- `TODO.md` — one clean Backlog task, `TASK-918` (resolves with no pre-existing file).
- `docs/sprint/SPRINT-904-conflict-fixture-sprint.md` — `### T1` cites `TASK-917`, DoD **ticked**.
- `docs/work/todo/TASK-917-*.md` — a **pre-existing store file**, simulating a tree already
  partway onto the store: its `## Done when` box is **unticked**, disagreeing with the Plan's
  ticked state. This is a real conflict (content differs from what the mapping would produce) —
  correctly **left alone**, never overwritten.

### conflict-expected/ — the correct output

- `TODO.md` — **still present**, **byte-identical** to `conflict-input/TODO.md` — removal is
  blocked by `TASK-917`'s unresolved conflict, even though `TASK-918` resolved cleanly on its own.
- `docs/work/backlog/TASK-918-*.md` — written (the one id that had no conflict).
- `docs/work/todo/TASK-917-*.md` — **unchanged**, byte-identical to the pre-existing file in
  `conflict-input/` — never overwritten to match the Plan's tick state.

**Asserted**: `TODO.md` exists in `conflict-expected/`, and `TASK-917`'s file is byte-identical
between `conflict-input/` and `conflict-expected/`.

## conflict-expected-wrongly-removed/ — must-FAIL sibling (c): removal-precedence case

Same as `conflict-expected/`, minus `TODO.md` (simulating a migrate that removed it despite the
open conflict). The check must redden: `TODO.md` is absent although `TASK-917` is still
unresolved.

## Discrimination proof (run by hand, not baked into the harness — TD-012 / L-142 convention)

The fixture trees above already prove the checks redden on real broken data (that *is* the
must-FAIL sibling). The extra proof CLAUDE.md requires is that the **comparison logic itself** is
what does the catching, not an accident of the fixture — done by temporarily breaking the id-set
comparison in `evals/run-v1-to-v2-fixtures.ts`, confirming the missing-task case wrongly PASSES,
then restoring and verifying the restore with `git diff --no-index` against a saved pristine copy.
Verbatim output + the stated method are in the SPRINT-106 T4 report, not committed here.

## Schema cross-check against `docs/work/README.md` (revise-round MED #4)

`REQUIRED_FIELDS` / `REQUIRED_SECTIONS` / `FILENAME_RULE` in the harness were a **literal copy** of
`docs/work/README.md`'s § Frontmatter fields / § Sections / § Filename rule — free to drift
silently. The harness now also reads the real `docs/work/README.md` at run time and asserts its
declared field list / required-section list / filename-rule text still match those constants,
diffed both ways. Proof that this cross-check itself discriminates: point it at a **scratch copy**
of the README (`WORK_STORE_README_OVERRIDE` env var — the real file is never edited) with one
field dropped from § Frontmatter fields; the `schema-cross-check-fields` case must redden.
Verbatim output is in the SPRINT-106 T4 report, not committed here.
