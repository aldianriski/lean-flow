---
sprint: 113
slug: ship-the-store-trim-the-guards
owner: Maintainer
last_updated: 2026-10-03
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-113 — Execution Log

> Append-only companion to [`../SPRINT-113-ship-the-store-trim-the-guards.md`](../SPRINT-113-ship-the-store-trim-the-guards.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-03 | promote | plan locked, governance signed, four members: EPIC-017 step 1 (378 · 379 · 397) + the audit cuts (398)
Scope ruled by the owner: 398 + 378 + 379 + 397 ("add 397 too"). Size check at pull: none is L. 379 is effectively S (SPRINT-111 T4
landed most of it), 378 stays M (no TASK.md.template yet; TODO.md.template still exists, TD-209), 398 is M, 397 is S. Members were moved
backlog → todo by `git mv` in their own commit (`9cdbbd3`), then stamped `sprint: SPRINT-113`. The signed governance checklist (owner-signed;
applied in `df8982d`):
- **L-promotion:** L-218 (count 2) → promoted into `skills/orchestrator/references/dispatch.md` § Merge-back queue, the post-merge line, with
  `disposition: merge` (it sharpens the existing smoke-check line rather than adding a rule, per ADR-050 clause 2). Body collapsed to a pointer.
- **TD aging:** 126 of 132 open rows aged against sprint 113. Second route: 132 − 6 filed at 111/112 = 126. 6 `high` rows are open, all owned
  (TD-143 → 348 · TD-150 → 345 · TD-090/117/128/168 → 357). TD-174 resolved (TASK-384). No new escalation.
- **doc-aging:** §11 has no TD deletion due and no CHANGELOG rotation; the store prune stays held (D4). §2: 0 OVER-CAP; the 4 soft breaches are
  recorded `retain` dispositions (EPIC-017 now 236 > 200, covered until §11 archive). Token budget ~13419 ≤ 16087.
- **epic rollup currency:** EPIC-017 current (`5b43e65`). EPIC-014 gains a backlog task (TASK-399), no member sprint. EPIC-015 current.
  EPIC-016: foreign uncommitted WIP, not assessed.
- **handoff ledger:** none.
**Review ruling (owner):** the Codex loop covers consequential Tier G and every shipped skill/template change. Maintainer-only work takes ADR-050's
bar plus a coordinator self-review (D3). G1/G2 are not signed yet.

### 2026-10-03 | progress | plan_commit recorded: 4f21040
The `plan locked` commit is `4f21040`; this entry and the frontmatter field land in the next commit.

### 2026-10-03 | progress | G1/G2 signed (owner); TODO.md.template ruled DELETE
**G1** (full checklist for all four: 398 is manual, 397 close-retro, and 378/379 are decomposer-origin but SPRINT-111 already did part of their scope).
Goal, size, files, out-of-scope and assumptions confirmed. **G2:** T1 ∥ T2 ∥ T4 in parallel, worktree-isolated; T3 after T2 (shared CLAUDE/CONTEXT/README;
preflight CLEAR, waves T1 = T2 = T4 = 0, T3 = 1). Owner ruling: `TODO.md.template` is **deleted** (not a tombstone); TD-209 closes with T2.
**Consequence lookups (TD-092):** T1 · behaviour: guards removed · governance: gate composition, maintainer-only → ADR-050 bar (no runner reaches
the cut + full gate default/opt-in) + coordinator self-review · T2 · behaviour: shipped templates + init procedure · governance: consumer-facing
skill contract → Codex loop · T3 · behaviour: doc prose + one skill wording · governance: consumer-facing skill text → Codex loop · T4 · behaviour:
shipped migrate reference + harness · governance: consumer-facing procedure → Codex loop.

### 2026-10-03 | progress | T2 (TASK-378) built + Codex CLEAR; merged b3b8cef
- `b3ca35d`: `templates/TASK.md.template` matches task-file.md field for field (frontmatter order, enums, sections; no lean-flow ids or paths).
  `templates/TODO.md.template` deleted (owner ruling); TD-209 resolved. The one live template leak (QA-TESTCASE's "TODO gains…") fixed.
- init (already store-first after SPRINT-111 T5) exercised on an empty OS-temp dir, following the base tier literally: 13 files, `docs/work/` left
  lazy per §2, no TODO.md. Two small ambiguities in init.md noted (the substrate-condition count; the headless branch was not exercised).
- A1 held: count-claims gives 33 core + 2 non-core = 35, unchanged. Codex static review: CLEAR. On main after the merge: typecheck 0 · count-claims
  green · caps 0 FAIL · v1-to-v2 24/0 · freeze 5/0.

### 2026-10-03 | progress | T4 (TASK-397) built, 3 Codex rounds; merged d80c207 + CRLF repair 80c380e
- `8bc8b78`: migration-map.md § v1→v2 states the 10 rules; the owner accepted the builder's wording where the SPRINT-111 Log held only the substance.
  Codex r1 (5 findings, all confirmed) → `16d2f0c`: the id-set Verification was wrong for mixed trees · a missing member contradicted itself · `none — but`
  vs annotated ids · selection gaps (`tier:G(x)`, `(A)`, `a)`) · lossy checks. Codex r2 (2) → `f4f884a6`: `output` derived from the store (`output ⊆ meant`),
  plus a `kept` category; the dead `TODO.md.template` pointer reworded. Codex r3 (1) → `40df68b7`: a `replaced` category ("apply the delta"),
  `meant = output ∪ kept ∪ replaced ∪ pending`.
- **Merged red:** on main's autocrlf checkout the harness read 52 pass, 10 fail. The builder's 62/0 ran on the LF files it had just written in its worktree.
  Found within minutes by the post-merge legs (L-218, promoted at this promote). Repaired `50d99479`: one CRLF-normalising reader for all text reads,
  plus a full Scenario-5 run on a CRLF copy. Main is now 96/0. The harness still checks hand-built trees, not an agent following the prose (stated).

### 2026-10-03 | progress | T3 (TASK-379) built + Codex fixes; merged ec2a3d2
- `e6c21c97`: CONTEXT § Task entry shape is now the v2 file frontmatter (CONTEXT at 150/150), the overview map gains `work/`, QA-001/002 have v2
  steps, council:52 "TODO tracker" → "a task file". CLAUDE.md, README (§ Upgrading to 2.x already in the right order) and refactor-advisor
  were verified unchanged. Codex r1: threats 1/3/4 clean; 2 QA findings (QA-001's fixture lacked the v2 structure its count needs; QA-002 expected
  backlog growth after promotion) → `ed1cfe6f`, self-reviewed (repo QA docs, not shipped; D3).
- On main after the merge: typecheck 0 · caps ~13482 tokens · v1-to-v2 96/0 · freeze 5/0 · count-claims green. The only red is prose-density on the foreign EPIC-016.

### 2026-10-03 | scope-change | T4 Cites names the member's bare `migration-map.md`; the Shell and TS layers-completeness checkers disagree
The gate's TS `check-layers-completeness.ts` FAILs `member-layers-incomplete` for T4/TASK-397: its Done-when names the bare `migration-map.md`, and
T4's Layers carry the full path. The Shell `check-layers-completeness.sh` PASSes the same Plan (it matches by basename). The coordinator ran only
the Shell checker at plan lock, which is why it read 8/0. This is a parity divergence (TS stricter: a false positive on a declared file), and the
harness that would have caught it (P7 `layers-completeness-differential.ts`) was never run by anything and is cut this sprint by owner ruling.
**Fix (Plan, no DoD change):** T4's `Cites:` names the bare token, the route the finding itself recommends. The divergence goes to a TD row at close.

### 2026-10-03 | progress | T1 (TASK-398) built + coordinator self-review (ADR-050 bar); merged abe269c
- `9a0bfaad`: S10 (4 selftests + 4 asserts), P4 `run-layers-observed-differential.ts` and P7 `layers-completeness-differential.ts` deleted (2,442 lines),
  plus the qa-check excluded block (left as a tombstone; the list is now empty), evals/README and the comments naming them.
- Census by two routes: names/stems (~75 hits in 40 files, classified delete · edit · history) and source/exec/import (0 runners). The only machine reach
  was qa-check's excluded list. Seed A (a deleted selftest restored on disk, unlisted) → the completeness leg names it. **Seed B (an excluded name with no
  file) is NOT detected: qa-check has no listed-but-missing check for `eval_harnesses_excluded`** → TD at close (moot while the list is empty; census-zero → TD).
- Full gate (QA_FULL, worktree): `304 pass, 5 fail`, none from T1. Typecheck ×2 (no node_modules in the worktree) · qa-budget (an inherited
  QA_BUDGET_SECONDS, an L-067 shape; passes alone) · orchestrator-store (TD-211, pre-existing) · the T4 Cites false positive (fixed `0466ba4`).
- On main after the merge: typecheck 0 · `sh -n` ok · layers-completeness TS + Shell 0 FAIL · its test 0 fail · fixtures PASS · count-claims · caps
  0 FAIL · v1-to-v2 96/0. ~12 live comments and fixture READMEs outside T1's Layers still name the cut files → follow-up sweep task at close.
- Review (D3): maintainer-only, so the ADR-050 bar (no runner reaches the cut + seeded proof + a full gate) plus a coordinator self-review of the
  diff and census. No Codex required.
