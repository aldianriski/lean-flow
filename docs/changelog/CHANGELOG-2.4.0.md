---
owner: Maintainer
last_updated: 2026-10-18
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.4.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.6.0 release** (2026-10-18). §11 keeps the
> current and previous minor inline (2.6.x and 2.5.x), so cutting v2.6.0 pushed v2.4.x out.

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
