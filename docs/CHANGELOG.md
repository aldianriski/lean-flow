---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.15.0 — Tech-Debt Split (2026-07-29)

MINOR — SPRINT-031 (TASK-066).

**What changed for you:**
- **Tech Debt gets its own root ledger** — new core template `TECH-DEBT.md.template` renders root `TECH-DEBT.md`; `TODO.md` keeps the Backlog + active-sprint pointer only (a pointer line replaces § Tech Debt). Two big queues no longer crowd one file.
- **Fully wired** — Sprint Close files `TD-NNN` there · Promote ages it · `/triage` grooms it (legacy in-TODO § still read) · `/prime` slot 5 reads it · DOCS_Guide §2/§10/§11 + migration-map updated; adopted repos: `migrate` now splits an in-TODO § Tech Debt out verbatim.
- **De-leak** — repo-specific `TASK-040` pointer removed from the shipped SPRINT template + DOCS_Guide retrieval-miss note (L-015 class).

Repo housekeeping (same day, pre-sprint): TASK-040 + TASK-047 routed to `.out-of-scope/` with revisit conditions — Backlog now empty.

---

## 2026-07-29 — SPRINT-030 Gate-Guard Decision (docs-only · no release, stays v1.14.2)

TASK-006 decided after a same-day PreToolUse feasibility sweep (`docs/research/pretooluse-gate-guard.md`):
**ADR-011 — no gate enforcement**; G1/G2 stay human discipline. The in-core hook died on platform
fact (plugin hooks auto-activate, no per-hook disable ⇒ mandatory for every consumer); the opt-in
sibling plugin was rejected on YAGNI. Concept filed to `.out-of-scope/gate-guard-hook.md` with a
revisit trigger. Council run waived at the gate (logged scope-change — owner decision). +L-048
(release-patch misses non-manifest version echoes).

---

## v1.14.2 — Consumer-Leak Cleanup (2026-07-29)

PATCH — consumer-fit audit (L-015 sweep, triage-driven).

**What changed for you:**
- **Repo-specific leaks removed from shipped surfaces** — the ADR/RESEARCH templates no longer
  hardcode lean-flow's own tag/domain vocab or assert a `scripts/gen-index.sh` / `qa-check.sh`
  pipeline your repo doesn't have (now conditionally framed, matching the LEARNINGS template);
  `/insights` dropped a lean-flow backlog reference; `night-run.md` / `dispatch.md` research
  pointers are labeled as lean-flow-repo decision records, not required reading.

---

## v1.14.1 — Dispatch-Cost Awareness (2026-07-29)

PATCH — **SPRINT-029**, the adhd scan's single keeper (TASK-099).

**What changed for you:**
- **Dispatch cost term** — parallel fan-out cost scales with **branch-count × substrate-size, not
  call-count**: every dispatched branch re-pays the full base substrate (CLAUDE.md + tool context)
  before doing any work. Landed as an ADR-010 addendum, a cost-term note in
  `orchestrator/references/dispatch.md` (Parallel vs sequential), and `/council`'s cost line
  (~11 calls ≈ 11 × context, not 11 small calls).
- Housekeeping at promote: L-009 promoted → CLAUDE.md edit-safety anti-pattern (structure-adjacent
  edits silently fuse neighbors, count 3) · TASK-006's fused TODO.md heading restored.

---

## 2026-07-29 — SPRINT-028 Research Delta-Scan Batch (docs-only · no release, stays v1.14.0)

Three L-017 delta-scans, all research docs: **graphify** re-verdict — on-demand stance re-affirmed
against the current feature set · **OpenAI harness-engineering** — clean reject, 0/12 techniques
unmatched · **uditakhourii/adhd** — 1 micro-keeper (the N×substrate dispatch-cost note → TASK-099),
8 rejects. No skill/template/manifest change.

---

## v1.14.0 — Night-Run Complete & Housekeeping (2026-07-29)

MINOR — bundles **SPRINT-027** (night-run resilience + the §11 housekeeping pass).

**What changed for you:**
- **Night-run is complete** — `night-run.md` gained Part 3 (OS-level watchdog pattern: stall
  detection → SIGTERM → `claude -p --resume <sid> "/handoff"` → morning `/prime` resume) and
  Part 4 (the "Blocked / needs-human" morning rollup: `Tn · state · unblock condition`, riding the
  Execution Log). The whole chain was exercised for real: a headless run killed mid-flight exited
  143 as documented, and the recovery command produced a working handoff doc.
- **§11 retention is now one named propose→approve pass** — archival (sprint archive · INDEX ·
  shipped-entry removal · rotation-link check) + a **compaction sweep** (promoted `L-NNN` bodies →
  pointers · superseded research → archive · measured delta), in `lean-doc-generator`'s close row.
  Exercised on the real corpus: −47 lines from hot files, content archived not deleted.
- **Fleet dispatch hardening** — dispatch.md's base-ref caveat gained the add/add corollary: never
  worktree-dispatch an edit to a file that exists only in unpushed commits; fall back to
  shared-tree parallel dispatch.

Manifests → 1.14.0 lockstep; skill roster unchanged (14). Additive — nothing to migrate.

---

## v1.13.0 — Fleet & Night-Run Build (2026-07-29)

MINOR — bundles **SPRINT-026** (the build sprint for v1.12.0's decisions).

**What changed for you:**
- **Parallel worktree dispatch is first-class in `sprint-bulk`** — disjoint sprint tasks now
  dispatch as worktree-isolated agents (one `Agent(isolation:"worktree")` per task, soft cap 3–5)
  with a coordinator-only **merge-back queue** (G2-order `--no-ff` per task, two-tier review,
  conflict + failure + cleanup paths incl. the Windows handle-lock and remote-base caveats) —
  `orchestrator/references/dispatch.md`, wired from the SKILL Sequence line and CONTEXT §Streams
  (L-042's per-hunk rule now binds intra-tree only).
- **Night-run is operational** — `orchestrator/references/night-run.md` ships the pre-flight
  checklist (all-AFK guard · zero open assumes · scoped `--allowedTools` build · `bypassPermissions`
  never) + the OS-scheduled headless trigger recipe (cron / Task Scheduler). Wired from the
  sprint-bulk Loop line. Watchdog + morning rollup land as TASK-098.
- Both capabilities were **exercised on the sprint's own wave** — the protocol dispatched and
  merged the very tasks that built it; the pre-flight guard correctly *refused* to arm an
  unattended run over HITL tasks.

Manifests → 1.13.0 lockstep; skill roster unchanged (14). Additive — nothing to migrate.

---

_Older releases (**v1.12.0** and earlier) → [`docs/changelog/CHANGELOG-1.12.0.md`](changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](changelog/CHANGELOG-1.7.1.md)._
