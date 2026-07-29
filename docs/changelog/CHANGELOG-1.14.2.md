---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: Never — rotated archive (DOCS_Guide §11); append-only history
status: current
---

# lean-flow — Changelog archive (v1.14.0 – v1.14.2 era)

<!-- Rotated verbatim from docs/CHANGELOG.md at the v1.16.0 MINOR (§11). Never edit past blocks. -->

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
