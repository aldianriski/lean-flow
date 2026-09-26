---
sprint: 108
slug: guard-the-freeze
owner: Maintainer
last_updated: 2026-09-26
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-108 — Execution Log

> Append-only companion to [`../SPRINT-108-guard-the-freeze.md`](../SPRINT-108-guard-the-freeze.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-09-26 | promote | plan locked at `96865d2`, governance signed
Two tasks from the SPRINT-107 outside review (worktree-isolated, 2026-09-26, NOT CLEAR): T1 `TASK-388`
(Tier G, the by-reference freeze checker) · T2 `TASK-389` (Tier X, knowledge-index order). No epic.
Governance: L-promotion none (46 `promoted: no`, all count < 2) · 3 high TD aged (TD-128 · TD-168 ·
TD-174), 98 open rows created at or before Sprint-104 · 5 soft cap breaches (TODO.md 570 > 320,
EPIC-017, three research docs), 0 hard · epic rollups current · no handoff ledger. Owner: carry as-is.
First lock `4eb604a` failed layers-completeness 4 FAIL (unindented wrapped `Layers:` lines; a bare
`qa-check.sh` token), re-locked at `96865d2` before any gate was signed → 4 PASS. Preflight CLEAR
(T1 = 0, T2 = 0, base `4eb604a` = HEAD at the time).

### 2026-09-26 | gate | batch G1 + G2 signed (attended) at `96865d2`
G1: scope confirmed by owner popup, before the tasks were filed; the four excluded findings are TD-182…185 (D3).
D1 (owner): an edit inside an HTML comment in Done when is still FREEZE-EDIT, and masking only finds boundaries.
G2: design approved in plan mode. T1 and T2 are disjoint, so they dispatch in parallel, worktree-isolated;
T1 is `/tdd` fixture-first with seeded-break proof and outside review; T2 is direct with a retained
fixture and a locale control that prints INVALID when the host cannot discriminate.
consequence · T1 · behaviour:material · governance:high → worktree-isolated outside review
consequence · T2 · behaviour:low · governance:med → coordinator re-run + read of the diff

### 2026-09-26 | progress | T2 accepted — the knowledge index is built in byte order under any locale
Worktree commits `6c4ddb5` and `fdf4427`, cherry-picked as `0afbac2` and `aabe874`. The generator enumerates the ADR and
research globs, then orders them with a `LC_ALL=C sort` scoped to that one pipeline. `IFS` is restored
after the loop even when there are no matches. There are no other locale-sensitive steps (builder checked).
The committed index regenerates byte-identical, which confirms A2. New retained harness registered always-on in
leg 12, beside the git-availability harness (git init only, no commits built, ~9 s).
**Coordinator re-run on main:** `--check` → `PASS … knowledge index current` rc=0 under the host default locale;
`gen-index-locale-fixtures: 5 pass, 0 fail`. The locale control confirms the raw glob order differs on this host,
so the byte-identical case discriminates. Builder seed (sort removed) reddened `byte-identical-index`; restored,
`git hash-object` = `git rev-parse HEAD:` = `27dabd38`.
Read of the diff: the only locale change is the prefix on `sort`; nothing is exported.

### 2026-09-26 | scope-change | T2 "no leak" criterion names a shape no caller uses
What broke: the DoD reads "a variable read after *sourcing* the vocab". The gate never sources the
generator. It runs it as a subprocess and greps its `TAGS=`/`DOMAINS=` lines, so the premise was the
coordinator's error at G1. Impact: none on scope. The criterion's intent (nothing reaches the caller) is fixtured
in both real shapes. **A3 (owner ruling, 2026-09-26):** amend the premise to the two real invocation shapes
and tick on that basis. § Plan's criterion text itself is unedited.
