---
owner: Maintainer
last_updated: 2026-07-02
update_trigger: A learning confirmed at Sprint Close, or a learning promoted to a durable rule
status: current
---

# lean-flow — Learnings Ledger

Append-only record of confirmed corrections and patterns surfaced at Sprint Close. A learning that
**recurs (count ≥ 2)** is promoted into a *durable* rule — a `CLAUDE.md` anti-pattern, a `CONTEXT.md`
rule, or a skill red-flag — and marked below. Reviewed at every **Sprint Promote** before planning.

<!-- Newest first. Never edit a past entry except to bump `seen` / `count` or set `promoted`. -->

<!-- Per-entry metadata (schema, ADR-009): the heading carries `[tags: <tag>] [status: active|promoted|superseded]`;
     the body keeps `seen · count · promoted · related`. Tags: process · docs · tooling · edit-safety · sprint-model.
     The by-tag index is GENERATED corpus-wide into docs/knowledge-index.md — `sh scripts/gen-index.sh`. -->

> **By-tag index** → [`docs/knowledge-index.md`](knowledge-index.md) — generated corpus-wide by
> `scripts/gen-index.sh` (LEARNINGS + ADRs + research). This file is the LEARNINGS SSOT; the index is derived.

---

## L-013 [tags: tooling] [status: active]: Convention isn't enforcement — a field/rule called "required" is only required if a check enforces it. SPRINT-013 T1's `[tags][status]` schema was "required" only via template + skill prose until an assume-guilty self-review flagged it; a `qa-check.sh` metadata-completeness lint made it real (a missing/typo'd tag now FAILs, instead of silently dropping from the generated index). Pattern: back any "required" field with a lint, or it silently rots.
- seen: Sprint-013
- count: 1
- promoted: no
- related: L-007 (spec/convention isn't trusted until exercised on real input)

---

## L-012 [tags: docs] [status: active]: References-first under a SKILL cap — when a skill is near its ≤110 cap, add behaviour via `references/` (uncounted, ADR-006) or reword existing lines in place, rather than append a section. SPRINT-012 landed 5 behaviours with `orchestrator/SKILL.md` held at 109/110; a naive "append per task" would have busted the cap. Pattern: at G2, choose the landing spot (references vs body) before editing a near-cap skill.
- seen: Sprint-012
- count: 1
- promoted: no
- related: L-008 (SSOT dedup near cap) · ADR-006 (references uncounted)

---

## L-011 [tags: tooling] [status: active]: A committed shell script must be pinned to LF (`*.sh eol=lf` in `.gitattributes`). On a Windows checkout with `autocrlf`, git rewrites the file to CRLF and the `#!/usr/bin/env sh` shebang gains a trailing `\r` — the interpreter becomes `sh\r` and the script fails to run. Caught only by git's "LF will be replaced by CRLF" warning, not by any test. Pattern: when a markdown/config repo gains its first executable script, add the `eol=lf` attribute in the same change.
- seen: Sprint-008
- count: 1
- promoted: no
- related: L-005 (edit-mechanism discipline — text round-trips corrupt files)

---

## L-010 [tags: tooling] [status: promoted] → promoted: yes → CLAUDE.md anti-pattern (edit the repo source, never the install cache). When editing an installed plugin the target is the REPO SOURCE (`skills/…`), not the cache (`~/.claude/plugins/cache/…`); a cache Read doesn't satisfy read-before-edit. Seen Sprint-007 + Sprint-009 (count 2). Related: L-005.

---

## L-009 [tags: edit-safety] [status: active]: A row-deletion Edit on a markdown TABLE can silently FUSE adjacent rows — removing the graphify row in `ARCHITECTURE.md` matched the wrong newline and merged the built-in-commands + Hooks rows (the Hooks row vanished from the render); grep and line-caps stayed clean, so it was caught ONLY by the fresh-context review. Pattern: after deleting a table row, re-read the table (diff the rendered rows) — don't trust the edit; and a reviewer who didn't write the edit catches author-blind structural defects.
- seen: Sprint-007
- count: 1
- promoted: no
- related: L-006 (fresh/cold eyes catch author-blind issues — this is a 2nd occurrence of that pattern)

---

## L-008 [tags: docs] [status: promoted] → promoted: yes → CLAUDE.md anti-pattern (periodic SSOT dedup at promote) + TD-006. SSOT docs accrete duplication of their satellites until they near the cap; seen Sprint-006 + Sprint-008 (count 2 — CONTEXT hit 129/130).

---

## L-007 [tags: process] [status: promoted] → promoted: yes → CLAUDE.md anti-pattern ("a new behaviour's final DoD must be exercised once on real input"). Spec-only-debt trap; seen Sprint-003 (TD-001) + Sprint-004 (T3/T5); validation follow-ups TASK-023 · TASK-024.

---

## L-006 [tags: process] [status: promoted] → promoted: yes → orchestrator § Review (the fresh-context Review pass). Cold-context agents surface author-blind spec gaps (7 in one fresh-install run); seen Sprint-003 + Sprint-007 (count 2). Related: L-009 (table-row deletion fused neighbors — caught only by that review).

---

## L-005 [tags: edit-safety] [status: active]: PowerShell `Get-Content`→`Set-Content` round-trips corrupt UTF-8 markdown (em-dashes → mojibake) — edit files with the Write/Edit tools, never shell text pipelines
- seen: Sprint-002
- count: 1
- promoted: no

---

## L-004 [tags: sprint-model] [status: active]: Append-only-forever ledgers contradict LAW 3 — no archive trigger exists anywhere, so TODO.md / CHANGELOG.md bloat in a long agentic loop → fix: TASK-012 (§11 Retention)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-003 [tags: sprint-model] [status: active]: The sprint model assumes a single work stream — one Active Sprint pointer + the "one sprint at a time" rule make two parallel streams in one repo collide on TODO/ledgers → fix: TASK-011 (stream concept)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-002 [tags: process] [status: active]: The detailed grill never fires on the conducted path — task-decomposer's "don't re-interview" escape hatch + sprint-bulk's batch-G2 collapse it to one pass, and G2 is too late anyway (tasks already written) → fix: TASK-010 (grill at intake)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-001 [tags: docs] [status: active]: DOCS_Guide §2 defines no placement — generated docs pile up at the host-repo root, and the standard contradicts lean-flow's own repo (docs/ARCHITECTURE, docs/CHANGELOG) → fix: TASK-009 (placement column + prime/migrate alignment)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no
