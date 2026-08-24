---
sprint: 083
slug: ts-bun-foundation
owner: Maintainer
last_updated: 2026-08-24
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-083 — Execution Log

> Append-only companion to [`../SPRINT-083-ts-bun-foundation.md`](../SPRINT-083-ts-bun-foundation.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A pivot that shifts scope is logged here as a `scope-change` entry —
> what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-24 | promote | Plan locked — EPIC-014's first member sprint

T1–T4 promoted from TASK-267…270. `plan_commit: 88d31d8`. Opened alongside **EPIC-014** (reference
engine) and **EPIC-015** (execution autonomy), split from
`docs/research/LEAN-FLOW-PRE-EPIC-FOUNDATION-HARDENING-V3.md`'s 40-task set by substrate. H32/H33/H34
are excluded from EPIC-015 because SPRINT-082 shipped them as T1/T2/T3.

Governance review: L-promotion none (140 headings · 99 `count:` · 97 `promoted:`; one row at count ≥ 2,
already promoted) · TD aging 22 of 25, none `severity: high`, carried by owner ruling · TD-073's
deletion clock executed (40 lines, open count verified unchanged before the write) · one §2 soft breach
carried as **TD-082**, because a soft cap has no exemption route by design.

### 2026-08-24 | progress | G1 signed — 5 of 5, fast-path deliberately NOT taken

All four tasks are `origin: manual`, so the full checklist ran rather than the one-line confirm. Origin
is a fact about where a task came from, not a self-assessment: these were authored from V3 by the
session that promoted them and never met `/task-decomposer`'s intake grill, so there is no prior scope
agreement for a fast-path to re-confirm.

**All five `assumes:` rows confirmed at the gate rather than deferred to their tasks**, since an
unconfirmed assumption blocks G2:

- **A1** ✓ `bun 1.3.14` · `node v24.16.0`.
- **A2** ✓ all six TS artifacts absent (`package.json` · `bun.lockb` · `tsconfig.json` · `apps/` ·
  `packages/` · `test/`).
- **A3** ✓ **the hazard is real.** Walked the discovery order in `dispatch.md`'s own terms: rung 1 (six
  manifest shapes) misses · rung 2 (`Makefile`/`justfile`) misses · rung 3 (CI config) misses · rung 4
  reads `.gate-command` → `sh scripts/qa-check.sh`. T2 creates the first rung-1 hit in this
  repository's history, and rung 4 is explicitly last.
- **A4** ✓ **and it narrowed the risk while adding a constraint.** `check-manifest-lockstep.sh` globs
  `.*-plugin/*.json` and `*-plugin/*.json`; a **root** `package.json` matches neither, so it is not
  enrolled. But the checker's own comment reads *"Adding a directory enrolls it automatically"* — so
  **no new directory may be named `*-plugin`**. Carried into G2 as a constraint.
- **A5** ✓ all three rule counts reproduce: `read-spec-rules.sh` **100** unique IDs · `Sn.NAME` grep
  shape **79** · EPIC-004's published **51 of 51**.

### 2026-08-24 | scope-change | T2 — G1 adds a conformance baseline to a Plan frozen minutes earlier

**What broke.** The G2/G1 shared-file and blast-radius map is built from each task's `Layers:`, so it
can only see *files a task declares*. It cannot see a **behaviour** no task declares. Adding three new
top-level trees (`apps/` · `packages/` · `test/`) may move this repository's **conformance report**,
which currently sits at `level: Gated` — and no task in the Plan names it.

**Why it would not have surfaced on its own.** Every task's final DoD reads `sh scripts/qa-check.sh`
reporting `0 fail`. **TD-081**, filed at SPRINT-082's close, records precisely that conformance FAIL
rows do **not** reach that tally — the conformance leg is informational in it. So a conformance
regression caused by T2 would sit behind a green verdict line that four DoD criteria are pointed at.
This is L-105's family at the gate that owns it: the guard exists, and it fires where the change cannot
reach it.

**Impact.** T2 gains a baseline capture as its first step and an assertion as its last. No task is
added, removed or re-scoped; T1, T3 and T4 are untouched. Cost is two conformance runs.

**Re-confirm G2.** Owner ruled at G1 sign-off (2026-08-24): *add a baseline capture to T2*. The
alternative offered — ruling the three trees outside the engine's doc-set surface — was declined
because it would have been a claim about the engine made without reading it.

**The Plan edit follows this entry, not the other way round.** G1 runs *after* `promote` freezes the
Plan (`88d31d8`), which is the ordering CONTEXT names as the reason a G1 finding costs a
`scope-change` at all.

### 2026-08-24 | progress | G2 signed — D4/D5/D7 ruled; the reachability test fires on its first use

`gates_signed: G1,G2 @ 2dd1edb` (the tree the gates reviewed, per SPRINT-082's precedent; the gate pass
then amended the Plan, and that amendment is the `scope-change` entry above).

**D4 was answered by reading §2, not by defaulting.** §2 is a documentation lifecycle standard
(ADR-012) enumerating four scopes — Root files · `spec/` · `.claude/` · the `docs/` tree — with **no
code-tree rows at all**; `scripts/`, `evals/` and `skills/` already sit outside it here. So `apps/`,
`packages/` and `test/` owe no rows and no placement ADR. **D5** rules the run mode attended, naming
what that forecloses rather than leaving it implicit. **D7** rules implementation inline, and records
that Review is therefore a structured self-pass with no fresh-context reviewer.

**Shared-file ownership map** (built before the first task): `package.json` T2→T3 ·
`test/architecture/dependency-direction.test.ts` T3→T4 · `docs/DECISIONS.md` and
`docs/knowledge-index.md` T1→T2. No task pair is disjoint, so the run is **fully sequential**
T1 → T2 → T3 → T4 — no parallel worktrees, and L-042's per-hunk staging rule binds intra-tree.

**Two findings from the verification-reachability test SPRINT-082 T3 shipped into G2 — its first live
use, and it caught something both times it was applied:**

1. **`sh scripts/qa-check.sh` reports `0 fail` appears as the closing DoD of T2, T3 and T4, and does
   not PROVE what its position implies.** It EXISTS, RUNS and REACHES — but what it reaches is docs and
   governance, not `.ts` files. Green qa-check proves *no governance regression*; TypeScript
   correctness is proven by `bun test` and the fitness suite. The criterion is kept (the governance
   claim is real and worth holding) and is **not** to be read as validating the workspace. This is
   exactly the EXISTS-but-does-not-REACH shape L-136 records.
2. **T2's `Layers:` omitted `docs/DECISIONS.md` and `docs/knowledge-index.md`,** both required by
   ADR-035. Corrected at the gate rather than at execution — L-100 makes a `Layers:` correction a live
   declaration, not a `scope-change`, so it is logged and declared without a Plan amendment. The same
   edit **removed** `spec/STANDARD.md` §2 from that list, since D4 closed the conditional path.

Judgment/manual verification left as legitimate where no mechanical method exists (the test does not
force a checker into being): T2's four-rung discovery walk, T1's denominator ruling, and T3's
seeded-break targeting are all human judgements and are recorded as such.
