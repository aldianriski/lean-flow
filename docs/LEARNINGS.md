---
owner: Maintainer
last_updated: 2026-06-21
update_trigger: A learning confirmed at Sprint Close, or a learning promoted to a durable rule
status: current
---

# lean-flow — Learnings Ledger

Append-only record of confirmed corrections and patterns surfaced at Sprint Close. A learning that
**recurs (count ≥ 2)** is promoted into a *durable* rule — a `CLAUDE.md` anti-pattern, a `CONTEXT.md`
rule, or a skill red-flag — and marked below. Reviewed at every **Sprint Promote** before planning.

<!-- Newest first. Never edit a past entry except to bump `seen` / `count` or set `promoted`. -->

---

## L-011: A committed shell script must be pinned to LF (`*.sh eol=lf` in `.gitattributes`). On a Windows checkout with `autocrlf`, git rewrites the file to CRLF and the `#!/usr/bin/env sh` shebang gains a trailing `\r` — the interpreter becomes `sh\r` and the script fails to run. Caught only by git's "LF will be replaced by CRLF" warning, not by any test. Pattern: when a markdown/config repo gains its first executable script, add the `eol=lf` attribute in the same change.
- seen: Sprint-008
- count: 1
- promoted: no
- related: L-005 (edit-mechanism discipline — text round-trips corrupt files)

---

## L-010: When editing a plugin that is ALSO installed, the edit target is the REPO SOURCE (e.g. `D:\Project\lean-flow\skills\…`), never the install CACHE (`~/.claude/plugins/cache/lean-flow/…`) — and a Read of the cache copy (a skill loaded into context, or read in a prior step) does NOT satisfy the per-path read-before-edit requirement, so the first edit errors ("not read yet") or risks touching a read-only copy. Pattern: before editing any plugin file, Read its repo path explicitly; treat the cache tree as read-only output of `claude plugin install`.
- seen: Sprint-007, Sprint-009
- count: 2
- promoted: no   (count ≥ 2 → promote at next promote: a skill red-flag / CLAUDE.md anti-pattern — edit the repo source, never the install cache)
- related: L-005 (use the Write/Edit tools on the right file, not a shell pipeline — both are edit-mechanism discipline)

---

## L-009: A row-deletion Edit on a markdown TABLE can silently FUSE adjacent rows — removing the graphify row in `ARCHITECTURE.md` matched the wrong newline and merged the built-in-commands + Hooks rows (the Hooks row vanished from the render); grep and line-caps stayed clean, so it was caught ONLY by the fresh-context review. Pattern: after deleting a table row, re-read the table (diff the rendered rows) — don't trust the edit; and a reviewer who didn't write the edit catches author-blind structural defects.
- seen: Sprint-007
- count: 1
- promoted: no
- related: L-006 (fresh/cold eyes catch author-blind issues — this is a 2nd occurrence of that pattern)

---

## L-008 → promoted: yes → CLAUDE.md anti-pattern (periodic SSOT dedup at promote) + TD-006. SSOT docs accrete duplication of their satellites until they near the cap; seen Sprint-006 + Sprint-008 (count 2 — CONTEXT hit 129/130).

---

## L-007 → promoted: yes → CLAUDE.md anti-pattern ("a new behaviour's final DoD must be exercised once on real input"). Spec-only-debt trap; seen Sprint-003 (TD-001) + Sprint-004 (T3/T5); validation follow-ups TASK-023 · TASK-024.

---

## L-006 → promoted: yes → orchestrator § Review (the fresh-context Review pass). Cold-context agents surface author-blind spec gaps (7 in one fresh-install run); seen Sprint-003 + Sprint-007 (count 2). Related: L-009 (table-row deletion fused neighbors — caught only by that review).

---

## L-005: PowerShell `Get-Content`→`Set-Content` round-trips corrupt UTF-8 markdown (em-dashes → mojibake) — edit files with the Write/Edit tools, never shell text pipelines
- seen: Sprint-002
- count: 1
- promoted: no

---

## L-004: Append-only-forever ledgers contradict LAW 3 — no archive trigger exists anywhere, so TODO.md / CHANGELOG.md bloat in a long agentic loop → fix: TASK-012 (§11 Retention)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-003: The sprint model assumes a single work stream — one Active Sprint pointer + the "one sprint at a time" rule make two parallel streams in one repo collide on TODO/ledgers → fix: TASK-011 (stream concept)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-002: The detailed grill never fires on the conducted path — task-decomposer's "don't re-interview" escape hatch + sprint-bulk's batch-G2 collapse it to one pass, and G2 is too late anyway (tasks already written) → fix: TASK-010 (grill at intake)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-001: DOCS_Guide §2 defines no placement — generated docs pile up at the host-repo root, and the standard contradicts lean-flow's own repo (docs/ARCHITECTURE, docs/CHANGELOG) → fix: TASK-009 (placement column + prime/migrate alignment)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no
