---
owner: Maintainer
last_updated: 2026-10-18
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.6.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.8.0 release** (2026-10-18). §11 keeps the
> current and previous minor inline (2.8.x and 2.7.x), so cutting v2.8.0 pushed v2.6.x out.

## v2.6.0 — conformance verdicts tighten (spec 0.16.0); shipped skills stop leaking lean-flow's scripts; the sprint log starts at promote (2026-10-18)

**MINOR** — ships SPRINT-125 (Consumer Maturity and Cleanup) and SPRINT-124 (below). **Upgrade step:** spec 0.16.0 is MINOR carrying
MAJOR meaning (§15): `S4.NEGATIVE` and `S11.TDDELETE` can move a verdict from pass to fail, so re-run `sh conformance.sh <repo>` and
clear any new finding before you rely on the level. Restart the session after installing (a live session keeps its plugin copy).

### SPRINT-125 — Consumer Maturity and Cleanup (2026-10-18)

EPIC-022's first slice: the surface an installed consumer already meets stops misleading them. **Spec 0.16.0.**

**Consumer-facing:**
- **Conformance verdicts move (spec 0.16.0, an ADR-034 behaviour-change ruling).** `S4.NEGATIVE` now FAILs an ADR whose
  § Consequences only *denies* a Negative ("no negatives identified", `Negative: none`, `Negatives: n/a`); an ADR naming any real
  Negative passes, including "No negatives except slower builds.". `S11.TDDELETE` now reads the resolve sprint from every resolved-row
  shape, so an overdue row the old extractor missed now FAILs `resolved-td-row-past-retention` — re-run `conformance.sh` and clear
  it before upgrading. Rows naming no sprint are listed in one `not judged` note. Rule ids and finding ids are unchanged.
- **Shipped skills stop naming lean-flow's own scripts as your mechanism.** Orchestrator steps now say "the host's gate", "a
  reachability checker where the host has one" or "a sprint-close checker"; `night-run.md` opens with a note that its launcher and
  gate scripts are lean-flow's reference implementation and you substitute your own `claude -p` trigger and gate.
- **The sprint Execution Log is created at promote**, with the promote / plan-locked entry first, in the same commit — so a promoted
  sprint is never red by construction. Earlier than STANDARD §9's "first entry" minimum, which it satisfies.
- **Tick a wrapped `## Done when` box on its first line.** The ` ✓ <evidence>` tail goes at the end of the `- [ ]` line, never on a
  continuation line or a line of its own; the freeze check reads those placements as edits (wording fixed; the checker is unchanged).
- **`migrate` withholds an incomplete task file on every run.** A mandatory post-write checklist (11 required fields, id = filename)
  names and withholds any file missing one, plan and apply alike — no script, no bun.
- **`/prime`** reports `fresh` under `claude --plugin-dir <repo>` (it read `n/a`), and offers `sprint-bulk unattended` only when an
  open task is AFK at J0/J1.
- **`/release-patch`** derives the lockstep set from every `*-plugin/*.json` carrying `"version"`, and a new step bumps the other
  current-version references (a README footer or badge) — never CHANGELOG history.
- **Templates:** CODE_OF_CONDUCT and QA-TESTCASE carry the four-field ownership header (no more `S3.SCHEMA` finding on render);
  BUG and DESIGN state why they carry none.

**Maintainer-side:**
- EPIC-022 opened (Plans That Work for Any Consumer). EPIC-006 · 008 · 009 · 011 · 012 closed in place, superseded → workdoo;
  `adlc-epic-sequencing.md` re-ruled (158 → 102 lines).
- TD-078 · 093 · 100 · 118 · 137 · 160 · 161 · 176 · 187 · 214 · 217 · 220 · 229 · 230 · 243 resolved.

---

## SPRINT-124 — Close EPIC-015 and Cut the Engine (2026-10-12) — ships in v2.6.0

**Consumer-facing:**
- **`conformance.sh` runs about three times faster on Windows.** On this repository it went from 417 s to 136 s, and from 23 s to 3 s on
  Linux. Five rules that started processes for every row now read their inputs in one pass. Verdicts, finding ids, report text and
  exit codes are unchanged: the full report is byte-identical before and after, under bash and under dash with gawk and mawk.
- **A stale stop marker is no longer read as a user stop.** The launcher's `<log>.stop` marker now carries the run's start epoch, and
  the reaper reports `USER_STOP` only when it matches the run it is reaping. A foreign or missing id is ignored and named under
  `warnings ·`.

**Maintainer-side:**
- ADR-053: the execution freeze re-arms, widened to new governance machinery (the five admission conditions, a G2 review-round cap).
- EPIC-015 is closed (8 of 8).
- TD-168 resolved · TD-249 · TD-250.

---
