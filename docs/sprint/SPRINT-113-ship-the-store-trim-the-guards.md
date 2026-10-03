---
sprint: 113
slug: ship-the-store-trim-the-guards
epic: EPIC-017
owner: Maintainer
last_updated: 2026-10-03
status: closed
gates_signed: G1,G2 @ 7e9a9cf
plan_commit: 4f21040
close_commit: CLOSE_SHA
update_trigger: sprint execute/close events
---

# SPRINT-113 — Ship the Store, Trim the Guards

> **Theme:** EPIC-017's step 1. A fresh repo and every shipped template now produce the store (`378`), the durable docs describe the v2
> loop (`379`), and migrate's prose carries the ten rulings an agent had to ask for (`397`). Together these unblock `371`, the workdoo
> migration. Alongside: land SPRINT-112's audit cuts (`398`). This is the first sprint run under ADR-050's lighter bar for maintainer-only work.

## Scope

**In:** a task template, the TODO template retired (TD-209), and `init` exercised on an empty directory (`378`) · the v2 loop in
CONTEXT/CLAUDE/overview/README/QA plus the council "TODO tracker" wording (`379`) · the ten migrate gaps written into
the migration map with fixtures (`397`) · S10, P4 and P7 cut, with the gate lists and the comments that name them (`398`).

**Out (deferred):** `TASK-371` (workdoo migration, next) · `TASK-399` (K01, EPIC-014) · TD-214 (skills naming `scripts/` paths) ·
TD-206 and the store prune it holds · any release (D3).

## Members

- docs/work/todo/TASK-398-land-the-governance-diet-cuts.md
- docs/work/todo/TASK-378-templates-and-init-for-the-store.md
- docs/work/todo/TASK-379-update-loop-docs.md
- docs/work/todo/TASK-397-close-the-migrate-prose-gaps-the-first-agent-run-found.md

## Plan

### T1 — Land the governance-diet cuts `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `evals/selftest-assert-boundary-park.sh` · `evals/selftest-assert-judgement-retry.sh` · `evals/selftest-assert-noaction-park.sh` ·
  `evals/selftest-assert-park-revisit.sh` · `evals/assert-boundary-park.sh` · `evals/assert-judgement-retry.sh` · `evals/assert-noaction-park.sh` ·
  `evals/assert-park-revisit.sh` · `evals/run-layers-observed-differential.ts` · `evals/layers-completeness-differential.ts` ·
  `evals/layers-completeness.test.ts` · `evals/run-layers-completeness-fixtures.sh` · `scripts/qa-check.sh` · `evals/README.md`
Depends-on: none
Cites: `TASK-398` · ADR-050 · `docs/research/guard-audit-rest.md` (S10 · P4 · P7, owner-ruled cuts) · L-221

Tier: maintainer-only G (ADR-050). It removes guards no runner or gate needs, so the bar is a must-FAIL proof that nothing still reaches
them plus one full-gate run. **The cut is checked by the gate's own completeness leg**: every remaining `evals/` harness must stay gated or
excluded, and no list may name a deleted file.

**Acceptance:** the 3 cut groups are gone from the tree and from every list and comment that names them; `qa-check`'s completeness leg is
green; the full gate (default + opt-in) reads the same verdict as before apart from the removed guards, read from its own verdict line.

### T2 — Ship the store in templates and greenfield init `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/templates/TASK.md.template` · `skills/lean-doc-generator/templates/TODO.md.template` ·
  `skills/lean-doc-generator/templates/` · `skills/lean-doc-generator/references/init.md` · `skills/lean-doc-generator/SKILL.md` ·
  `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `README.md` · `TECH-DEBT.md`
Depends-on: none
Cites: `TASK-378` · `TODO.md` (named, not touched) · TD-209 · ADR-045 (the task-file schema) · `skills/task-decomposer/references/task-file.md` · L-015

Tier X (templates and an init procedure; it builds no guard). It is a shipped skill and template change, so it gets the Codex loop (owner ruling).
`skills/lean-doc-generator/templates/TASK.md.template` replaces `skills/lean-doc-generator/templates/TODO.md.template`, one in and one out, so the "35 templates" claim should hold; count-claims checks it either way.

**Acceptance:** `skills/lean-doc-generator/templates/TASK.md.template` matches the task-file schema the store uses; `skills/lean-doc-generator/templates/TODO.md.template` is deleted (or kept only as migrate's
tombstone, ruled at G2) and TD-209 is closed; `init` run once on an empty directory produces `docs/work/` and no `TODO.md`; no shipped template
routes a follow-up to `TODO.md` or leaks a lean-flow path.

### T3 — Update the durable docs that describe the loop `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `.claude/CONTEXT.md` · `.claude/CLAUDE.md` · `docs/architecture/overview.md` · `README.md` ·
  `docs/qa/QA-001-prime-entry-detection.md` · `docs/qa/QA-002-intake-to-plan-pipeline.md` · `skills/council/SKILL.md` ·
  `skills/refactor-advisor/SKILL.md`
Depends-on: T2 (shared `.claude/CLAUDE.md`, `.claude/CONTEXT.md`, `README.md`; T2 owns the template counts)
Cites: `TASK-379` · SPRINT-111 T4 (already updated CONTEXT:103, overview:72, QA-001/002, README:477)

Tier P. Recon shows most of it landed in SPRINT-111 T4. What remains is the council's "TODO tracker" wording and a re-read of each doc
against the v2 loop.

**Acceptance:** CONTEXT, CLAUDE and overview describe the v2 loop and directory map; README carries the hard-cut upgrade path (install 2.x
→ restart the session → `/lean-doc-generator migrate` → resume); QA-001/002 test v2 behaviour; no skill says "TODO tracker".

### T4 — Close the migrate prose gaps the first agent-run found `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/references/migration-map.md` · `evals/run-v1-to-v2-fixtures.ts` · `evals/fixtures/v1-to-v2/`
Depends-on: none
Cites: `TASK-397` · `migration-map.md` (the member Done-when's bare name for the Layers path above) · SPRINT-111 T4 plan-step rulings (archived Log, 2026-10-02) · L-015

Tier X (a shipped reference plus its harness). Shipped, so it gets the Codex loop. Each of the ten gaps becomes a stated rule, the owner's SPRINT-111 ruling unless re-ruled.

**Acceptance:** all ten gaps have a rule in `skills/lean-doc-generator/references/migration-map.md` § v1 → v2; `run-v1-to-v2-fixtures` passes and gains a fixture for each rule a
script can check (enum normalisation · `none — but …` · lettered split).

## Decisions (pre-locked)
- **D1** — No new `.sh` file; executable logic is TypeScript on Bun (owner rule 2026-09-09).
- **D2** — No release at close; `[Unreleased]` holds 2.0.
- **D3** — Review (owner ruling, SPRINT-113 promote): the Codex loop covers consequential Tier G and every shipped skill/template change
  (T2 · T3's skill edits · T4). Maintainer-only work (T1) takes ADR-050's bar plus a coordinator self-review. All runners of a changed file
  are run (L-221), and after each merge the gate's cross-cutting legs run on `main` (L-218, promoted).
- **D4** — `TASK-359/360/361/362/369/374` stay until `TD-206` is ruled.

## Assumptions
- **A1** — `TASK.md.template` replacing `TODO.md.template` leaves the 35-template claim unchanged. *Confirm: count-claims after T2.*
- **A2** — Deleting S10, P4 and P7 removes nothing a live runner reads. *Confirm: T1 greps every list and comment and runs the gate's
  completeness leg (the audit says so; verify, don't trust).*

## Execution Log

> **Lives in its own file**: `docs/sprint/logs/SPRINT-113-ship-the-store-trim-the-guards.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| 10 `evals/` asserts, selftests and differentials (deleted) · `scripts/qa-check.sh` · `evals/README.md` · 2 layers-completeness files | T1 | owner-ruled audit cuts land (ADR-050) | Med | 2-route census (0 runners) · seeded restore named · full gate |
| `skills/lean-doc-generator/templates/TASK.md.template` (new) · `TODO.md.template` (deleted) · `QA-TESTCASE.md.template` · `TECH-DEBT.md` | T2 | the store ships in templates; TD-209 resolved | Med | count-claims 35 · init on an empty dir · Codex CLEAR |
| `.claude/CONTEXT.md` · `docs/architecture/overview.md` · `docs/qa/QA-001/002` · `skills/council/SKILL.md` | T3 | the durable docs describe the v2 loop | Low | caps 150/150 · Codex + fixes |
| `skills/lean-doc-generator/references/migration-map.md` · `evals/run-v1-to-v2-fixtures.ts` · `evals/fixtures/v1-to-v2/` | T4 | 10 migrate rules + store-derived id-set verification; CRLF-safe harness | Med | 96/0 incl. a CRLF run · Codex 3 rounds |

## Retro

**Retrieval check:** two hits and one miss. **Hits:** L-218 (promoted at this promote) ran the cross-cutting legs right after each merge and caught
T4's CRLF red within minutes. L-221 had builders enumerate every runner of what they changed. **Miss:** L-182 (verifying on a tree your own tooling
wrote is not verifying what git hands out) was on file, and T4's builder still certified 62/0 on the LF files it had just written. It is now at
count 3 (SPRINT-093 · 111 · 113), a promotion candidate.

**Cost:** coordinator (Opus) + 4 Sonnet builder lines (T1 ×1 · T2 ×1 · T3 ×2 · T4 ×5 rounds incl. the CRLF repair) + 6 Codex passes (T2 ×1 ·
T3 ×1 · T4 ×3 + 1 helper). T1 was not sent to Codex: it is maintainer-only under ADR-050 and the owner's D3 ruling, so it got a coordinator
self-review, the first sprint at the lighter bar. Dispatched-agent tokens ≈ 0.9M. Delivered: 4 members, 11 of 11 DoD, EPIC-017 step 1 (unblocks `371`).

**Worked**
- The ADR-050 split: T1's 2,442-line cut needed no Codex round. Its two-route census plus a seeded restore and the full gate carried it.
- Post-merge legs (L-218): a red on main was found and fixed inside the same hour.
- Codex on the shipped migrate reference found 8 real procedure defects across 3 rounds (id-set equality, the missing `kept`/`replaced` outcomes).

**Friction**
- Line endings again (L-182 ×3), plus a Shell/TS checker divergence (TD-215) that only the gate's TS port showed, and that the coordinator's own
  evidence suffix tripped a second time (L-224).
- CONTEXT.md is at its 150-line cap with no headroom, so the next doc that has to grow there needs a disposition first (ADR-050 clause 2).

**Pattern candidate**
- L-182 (count 3): promote at the next promote. Placement: wherever a builder certifies a harness (the dispatch brief's evidence bar, "run on a
  fresh checkout or a CRLF copy, not only your own written files").
- L-224 (count 2): promote alongside it ("verify with the checker the gate runs, and re-run it after any write, evidence included").
