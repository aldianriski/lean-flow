---
sprint: 094
slug: guards-for-what-nothing-reads
owner: Maintainer
last_updated: 2026-08-31
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-094 — Execution Log

> Append-only sibling of the frozen Plan (ADR-014). The § Plan is frozen at promote; a mid-sprint
> scope shift is logged **here** before the Plan is edited.

---

### 2026-08-31 | promote | G1 + G2 signed at `8681143`; full checklist, no fast-path

**G1 ran the full checklist on all four tasks, and the reason is a fact about them rather than a
judgement:** none is `origin: decomposer`. `TASK-324`/`325` are `manual`, `TASK-318`/`323` are
`close-retro` — neither passed `/task-decomposer`'s intake grill, so there is no prior scope agreement
for a fast-path to re-confirm. Read from each task's own `origin:` field, never inferred from how the
entry reads. No `L` size; nothing to split. Shared-file map pre-locked as **D1** (`scripts/qa-check.sh`,
T1→T2→T3 order) and **D2** (`lean-doc-generator/SKILL.md`, 126 lines against a ~140 cap).

**Three of four assumptions confirmed against artifacts before G2; the fourth was ruled.**

**A4 — derived, not inherited, exactly as the task demanded.** 29 `worktree-agent-*` branches, all 29
ancestors of `main`, zero unmerged. Cross-checked against `git branch --merged main --list` which
returns the same 29. The inherited figure was right; it is now *known* right, and the 11 branches
SPRINT-092 never checked are covered.

**A2 — confirmed, and the scope does NOT narrow.** The Execution Log's event vocabulary is
`promote · progress · surprise · scope-change · park · blocker · run-complete · close`. The string
`handoff` occurs **0 times** in `templates/sprint-log.md.template` and **0 times** in both existing
logs (092, 093). The log does not already carry the fact, so T2 builds rather than reads.

**A3 — confirmed and stronger than the Plan assumed.** The class is statically detectable: every
motivating symbol is reached by a literal ES import. And **two of the three motivating artifacts are
live in the working tree right now** — `reconcile` (`packages/standard/src/spec-reader.ts:386`) and
`marksInStandard` (`:278`) are both exported with zero non-test callers outside their own defining
file. T3's must-FAIL can therefore point at the current tree rather than a historical checkout, which
is L-166's bar met the strong way. `attachLevel` · `createF4Registry` · `createS4AppendRegistry` are
wired today and become the sibling controls. **A design constraint fell out of confirming this:**
`marksInStandard` appears four times inside its own file (three doc comments plus the export), so a
naive "is it referenced anywhere" query reports it as having a caller. The detector must exclude the
defining module's self-references — L-108's match-by-shape-not-substring shape, and the case that
would silently defeat the guard.

**A1 — ruled, not confirmed** (see the scope-change below).

**T2's open design question, ruled by the owner at G2 and recorded because a ruling nobody can find is
not a ruling (L-151):** the repo-side handoff stub is an Execution Log **`handoff` event** where a
sprint exists, plus **one named fallback ledger** for the no-sprint case (governance, `/triage`, a
research pass), carrying the same three-state status. Both halves are required: without the fallback,
an UNKNOWN status in the no-sprint case would have to be assumed `spent`, which is precisely the
silent-loss shape T2 exists to close. `lean-doc-generator`'s own headless-park instruction resolves
that case *to the handoff doc* and was explicitly **not** inherited as the answer, being circular here.

**Not signed as an approval envelope.** `approval_envelope:` is absent and stays absent — this sprint
is attended, and G1/G2 signing does not imply it (different grants).

---

### 2026-08-31 | scope-change | T1's `Layers:` — widen `check-epic-archive.sh` rather than add a second script

**What broke:** nothing in the goal; the *implementation shape* frozen in `Layers:` was the wrong one.
The Plan named a new `scripts/lib/check-epic-state.sh` and put `check-epic-archive.sh` in `Cites:`
("read, never modified"). Re-derived at G2 as `A1` required: that script is 143 lines and already
parses § Closed-when tick/untick counts, `member_sprints:`, per-member closed-state (archive/ **or**
`status: closed`) and `status:` — the majority of T1's machinery. Building a second script would
re-implement working parsing and leave two Shell checkers reading one artifact, which is how
**TD-087** and **TD-097** became two rows for one script three sprints apart, neither aware of the
other.

**Impact:** `check-epic-archive.sh` moves from T1's `Cites:` to its `Layers:` — a token in both is
itself a named FAIL, so this is not optional bookkeeping. `check-epic-state.sh` and
`run-epic-state-fixtures.sh` leave `Layers:`; `run-epic-archive-fixtures.sh` joins it. The three drift
classes and every DoD are unchanged — only where they land.

**Re-confirm G2:** yes, owner-ruled at sign-off. The task's own `assumes:` anticipated both outcomes
and stated the preference ("if the header half turns out reachable by widening an existing checker,
prefer that over a new script and say so"), so this is the Plan resolving as written, not a pivot.

---

### 2026-08-31 | scope-change | T3's `Layers:` — TypeScript in `test/architecture/`, not Shell

**What broke:** the Plan froze T3 as `scripts/lib/` + `scripts/qa-check.sh` + `evals/fixtures/`, and
that was my error at promote rather than a change of mind. T3 analyses the **TypeScript module graph**
in `packages/` and `apps/`. It is not a Standard rule id, so EPIC-014 **D2**'s strangler — which is
what legitimately keeps Shell authoritative per unmigrated rule family — does not bind it at all.
`test/architecture/` already exists for exactly this shape: `dependency-direction.test.ts` is an
architecture-fitness rule in TS carrying "one must-FAIL fixture per rule, each with ITS finding" plus
controls, which is T3's vocabulary verbatim. Precedent for TS reading source structurally is
`test/adr-family-harness-parity.test.ts`.

**Impact:** `Layers:` becomes `test/architecture/` + `test/fixtures/`; `scripts/qa-check.sh` leaves
T3's `Layers:`, which **dissolves D1's three-way share down to T1–T2**. Runs under `bun test`, already
invoked by the gate through `package.json` `scripts.test` (a requirement of ADR-035, not a
convenience). A real module graph also handles A3's self-reference constraint directly instead of
special-casing it in `grep`.

**Re-confirm G2:** yes, owner-ruled at sign-off, and informed by **TD-129** filed in the same session:
TypeScript covers **10 of 51** checkable Standard rules (~20%), so a Shell T3 would have added to the
41-rule remainder for no benefit, while a TS T3 adds to neither side of that ledger.

---
