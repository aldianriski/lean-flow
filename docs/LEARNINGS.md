---
owner: Maintainer
last_updated: 2026-06-11
update_trigger: A learning confirmed at Sprint Close, or a learning promoted to a durable rule
status: current
---

# lean-flow — Learnings Ledger

Append-only record of confirmed corrections and patterns surfaced at Sprint Close. A learning that
**recurs (count ≥ 2)** is promoted into a *durable* rule — a `CLAUDE.md` anti-pattern, a `CONTEXT.md`
rule, or a skill red-flag — and marked below. Reviewed at every **Sprint Promote** before planning.

<!-- Newest first. Never edit a past entry except to bump `seen` / `count` or set `promoted`. -->

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
