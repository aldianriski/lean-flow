---
owner: Maintainer
last_updated: 2026-10-12
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## SPRINT-125 — Consumer Maturity and Cleanup (2026-10-18) — unreleased

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

## SPRINT-124 — Close EPIC-015 and Cut the Engine (2026-10-12) — unreleased

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

## v2.5.0 — stopping an unattended run reports USER_STOP; a run that parks passes its own rollup guard (2026-10-11)

**MINOR** — ships SPRINT-122 (Finish EPIC-015). Installing the next release is enough; no upgrade step. The standard is unchanged
(spec 0.15.0).

**Consumer-facing (unattended runs):**
- **Stopping a run now reports `USER_STOP`.** Send TERM to the pid the launcher prints as `fired detached: pid=`. The wrapper catches
  it, stops the run, and the rollup reads `terminal · USER_STOP` / `PARTIAL` with every field. INT and HUP are ignored on entry to a
  detached shell, so use TERM. Killing the `claude -p` process itself still reads `HARD_FAILURE`, the same as the watchdog
  (`night-run.md` Part 3 and Part 4).
- **A run that parks now passes its own rollup guard.** The launcher's rollup block carries every non-green task line (parked,
  blocked, stalled, denied-tool), as Part 4 requires. Before this, every reaped `AUTHORITY_BOUNDARY` failed `check-night-run-rollup`.
  A re-reap no longer double-counts, and a CRLF checkout no longer defeats it.

**Maintainer-side:** EPIC-015 CW5, CW6 and CW7 proven. The first unattended repair cycle and Dogfood 2 ran on vehicle SPRINT-123
($1.32, one ADR-022 retry, one seeded park). TD-247 (Option A → TASK-426) · TD-248.

---

## v2.4.0 — an active epic's open conditions must each be covered; workdoo epics move to workdoo; spec 0.15.0 (2026-10-10)

**MINOR** — ships SPRINT-121 (T5 · TASK-420 is the consumer-facing change). Installing the next release is enough; no upgrade step. The standard moves to
**spec 0.15.0** (MINOR: prose rule, no conformance rule added, no verdict changes).

- **The rule (STANDARD § 2):** while an epic is `status: active`, every open `- [ ]` Closed-when condition ends with
  `→ TASK-NNN[, TASK-MMM]` or `→ next slice: <name>`. A named task that is done, cancelled or missing does not cover it.
  `proposed` epics are exempt.
- **`/lean-doc-generator`** lists uncovered conditions when an epic is activated and at promote (new `☐ epic coverage` line),
  and promote refuses to form a sprint while an epic it touches has one, unless the owner records an override.
- **`/triage`** reads active epics alongside the backlog and lists each uncovered condition with its epic;
  **`/prime`** reports a `Coverage:` count.
- An epic that a promote **activates** is judged as active in that same promote (Codex review fix), and `/triage` may read beyond
  `backlog/` to resolve a coverage mark.

**Also in SPRINT-121 (Cover What Is Open), maintainer-side:**
- **The workdoo-built epics moved to workdoo** (EPIC-016 · 018 · 019 · 020, ids unchanged). **ADR-052** amends ADR-041: an epic's
  outcome record lives with its execution. lean-flow keeps relation pointers in `docs/epic/INDEX.md`.
- **ADR-044 and ADR-048** have their accepted § Decision text restored, and their later corrections are kept as appended, dated
  § Correction sections. The S4.APPEND findings are cleared.
- **Learnings ledger:** a new gate leg FAILs an active entry with no body `count:` or `promoted:` line (5 retained fixtures). 58
  repeat entries are folded into their family heads (`disposition: merge`), so the ledger carries 4 active entries, not 62.
- **The engine's Windows cost is measured** (`qa-gate-timing.md` Round 23): five rules' per-row spawn loops, at about 100 ms per
  spawn. TASK-404's target is a 50% cut.
- **EPIC-015:** Dogfood 1 is proven on this sprint. CW6 is still open because no code path emits `USER_STOP` (TASK-423).

---
