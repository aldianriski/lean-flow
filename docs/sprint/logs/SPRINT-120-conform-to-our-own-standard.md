---
sprint: 120
slug: conform-to-our-own-standard
owner: Maintainer
last_updated: 2026-10-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-120 — Execution Log

> Append-only companion to [`../SPRINT-120-conform-to-our-own-standard.md`](../SPRINT-120-conform-to-our-own-standard.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-09 | promote | plan locked, governance signed, seven members: lean-flow passes its own conformance check at Structural
The backlog held nothing `ready` (5 `needs-info`, 1 `blocked`), so the owner chose the shape "Conform to our own standard" and the work was
decomposed in this session (TASK-406–412, `85587948`). `sh conformance.sh .` on lean-flow reported **level: none** with 57 findings, and no
promote since 2.0 had reported it. Ids were derived with worktrees and fixtures excluded: filename max 405; cited tokens ≥ 777 are prose
examples. The owner signed the checklist:
- **L-promotion:** none due. **L-229** (promoted, count 3, recurred after promotion) gets disposition `automate-into-check` → TASK-411.
- **TD aging:** 115 of 121 open rows aged against sprint 120. Second route: 121 − 6 filed at 118 = 115. One `high` row (TD-168) stays
  routed to TASK-404.
- **doc-aging:** §11 prune applied (`dc0fa344`, owner-approved):
  - **25 TD rows** resolved at SPRINT-116 deleted. Census: 148 − 25 = 123 = 121 open + 2 resolved.
  - **36 closed task files** removed. 42 were retention-due by the engine; second route: 42 files stamped sprint ≤ 116.
  - **6 kept:** live-cited TASK-357/360/368/374/386/392, which confirms TD-206 → TASK-410.
  - Conformance FAILs after the prune: 57 → 21. §2 caps: 0 FAIL. CHANGELOG rotated in 2.2.0.
- **epic rollup currency:** current (`check-epic-archive` 0 FAIL; workdoo NOTEs only).
- **handoff ledger:** none.
Size check at pull: 4 S + 3 M, no L. Shared engine file: T4 → T5 (D1).

### 2026-10-09 | progress | pins recorded: `plan_commit` @ `c226d3a`
The freeze point is the `plan locked` commit, the first in which the Plan and the seven stamped members both exist. `gates_signed:` is
omitted until G1+G2 are signed at `/orchestrator sprint-bulk` (absence means NOT signed). No `approval_envelope:`, because this sprint is
attended (T5 is J2).

### 2026-10-09 | g2 | G1 + G2 signed (owner); four rulings, two of them ADR-034 behaviour-change rulings
G1 fast-path (all seven members `origin: decomposer`): scope unchanged since approval. Owner rulings:
- **Waves:** wave 1 has T1, T2 and T3 inline as coordinator (a mechanical delete, two short ADR sections the owner reads, and a fixture
  rename), plus T4 and T6 dispatched in parallel to worktree-isolated Sonnet builders. Wave 2 is T5 on the merged T4 (D1). Wave 3 is T7.
- **T4 (ADR-034 behaviour-change ruling):** every engine file walk skips `.claude/worktrees/`. Findings sourced inside a worktree
  disappear; nothing outside changes.
- **T5 (ADR-034 behaviour-change + §11 spec ruling, J2):** a live citation is a whole-word id match in any tracked `.md` that is not
  history. History means done/cancel task files, every `archive/`, `docs/changelog/`, `CHANGELOG.md`, ADRs, `LEARNINGS.md` and `TECH-DEBT.md`.
- **T6:** the check lives in `check-sprint-by-reference.ts`. A path named in a scope-change entry must appear in that Tn's `Layers:`
  or `Cites:`. The layers-completeness paths leave T6's `Layers:` (scope-change below).
- **Review depth:** T4 and T5 are consequential G (seeded breaks, a worktree-isolated Sonnet reviewer, a Codex gauntlet). T6 is other G
  (fixture plus a real-artifact run, and one scoped reviewer). T1–T3 get self-review.

### 2026-10-09 | scope-change | T6 Layers narrowed to the by-reference checker (G2 ruling)
**What broke:** § Plan T6 named both candidate checkers pending G2. **Impact:** `scripts/lib/check-layers-completeness.ts` and
`evals/run-layers-completeness-fixtures.sh` leave T6's `Layers:`; the by-reference checker, its harness and `evals/fixtures/` stay.
**Re-confirm G2:** this entry is the G2 ruling itself.

### 2026-10-09 | scope-change | T4, T5 and T6 `evals/fixtures/` narrowed to the subdirectory each writes (pre-dispatch preflight)
**What broke:** the pre-dispatch preflight HALTed with 5 `shared-file-unowned` findings. T3–T6 each declared the bare `evals/fixtures/`
directory, so it could not see D2's disjoint subdirectories. **Impact:** T4 and T5 declare `evals/fixtures/conformance-engine/` (the
engine harness builds most fixtures in a temp dir; retained trees go here). T6 declares `evals/fixtures/by-reference/`. T3 already
declared `evals/fixtures/night-run-reaper/`. No work moves. **Re-confirm G2:** none needed, as the D2 ownership is unchanged.

### 2026-10-09 | progress | wave 1 inline: T1, T2 and T3 committed; a promote miss corrected (aged TD rows named)
- **T1** `96621dfe`: the five wiring-diff scaffolds were deleted. The only citation was between two of the deleted files. Index current.
- **T2** `1be24cc9`: ADR-043 gains a dated Negative and ADR-044 a dated Alternatives table, drawn from its own § Context. Neither
  § Decision was touched.
- **T3** `739872b3`: `run.log`/`.exit` → `run.jsonl`/`.exit` in two fixture trees, plus the rollup harness path. Rollup 11 → 11 PASS,
  reap-terminal 12 → 12 PASS, and no tracked `*.log` remains.
- **conformance.sh, first run: cut off.** My `timeout 400` killed it at §10 with no level line, so it is not proof for the §11/§12 rules.
  Up to the cut: 0 `S1.LAW3`, 0 `S3.SCHEMA`, 0 `S4.NEGATIVE`, 0 `S4.SECTIONS`; `S4.APPEND` unchanged (ADR-044/048 only).
- **Promote miss, corrected:** `S10.TDAGING` reads its "now" from the active sprint. At the prune run there was none (118/119 archived,
  120 not yet rendered), so it skipped with a note. Now it flags **37** aged rows that no sweep names. The SPRINT-120 sweep gave the
  count (115) but not the names. They are now named in the sweep. Second route: 115 − 37 = 78, named by earlier sweeps.
consequence · T1 · behaviour:low · governance:low
consequence · T2 · behaviour:low · governance:low
consequence · T3 · behaviour:low · governance:low
review · T1 · self-review · behaviour:low · governance:low
review · T2 · self-review · behaviour:low · governance:low
review · T3 · self-review · behaviour:low · governance:low

### 2026-10-09 | scope-change | TASK-411 Done-when 3: an unbackticked mention is out of reach by design (owner ruling); T6 builder retry for dotfile tokens
**What broke:** T6's real-artifact run (builder `fa69a1ba`) fired for SPRINT-115 T4/T5, SPRINT-116 T1 and T1+T2, and SPRINT-118 T1. Two
recorded sightings did not fire:
- SPRINT-115's `.dod-delta-exempt` is a dotfile with no extension, which the token shape does not recognise.
- SPRINT-118's fourth entry named TASK-320's member file without backticks, so it named no path at all.
**Impact (owner ruling):** one builder retry so backticked dotfile paths count as tokens, which must make 115's sighting fire. The
unbackticked case is ruled out of reach, because prose is not a path claim. Done-when 3 is read as "each recorded sighting whose path the
entry names as a token", and this entry records that reading before any tick (L-088).
**Also ruled:** keep the builder's `plan_commit` allowance (a path the Tn declared at `plan_commit` passes, so a narrowing entry can name
what it drops). Known blind spot: a path declared and later dropped is never re-flagged.
**Re-confirm G2:** this entry is the ruling.

### 2026-10-09 | scope-change | T4 gains the handoff-state ledger fixtures: the last placement finding is real, not a worktree artifact (owner ruling)
**What broke:** T4's builder (`eea6a67a`, harness 65 → 69 PASS; seed 1 reddened only `worktree-placement-ignored`, seed 2 only
`worktree-s12-ignored`) removed the worktree-sourced hits, but one `S2.R-PLACEMENT` FAIL remains. Its source is three TRACKED fixtures,
`evals/fixtures/handoff-state/ledger-*/HANDOFF-LEDGER.md`. The coordinator called this finding "a worktree false positive" at decompose.
That was wrong: the engine prints only the first 3 hits, all worktree copies, and they hid the real source. A sample was read as the
population (L-198's family). **Impact (owner ruling):** `run-handoff-state-fixtures.sh` writes those three ledgers into a temp dir at
run time, and the tracked files are deleted, with no engine change and the same case count. T4 `Layers:` gains the harness and that
fixture directory. **Re-confirm G2:** this entry is the ruling.

### 2026-10-09 | scope-change | T6 check made opt-in for lean-flow's own gate; T6 gains the gate script (owner ruling after its scoped review)
**What broke:** T6's scoped reviewer found that the shipped conformance engine's S9.PLANFROZEN leg runs the by-reference checker on every
active sprint and reports ANY FAIL line as `plan-edited-after-freeze`, which ADR-034 freezes as a finding id. The new
`scope-change-outside-layers` finding would therefore reach adopters under a wrong label. T6 was classified maintainer-only (Other G) at
decompose, and that was wrong. The reviewer also found that this sprint's own log trips the new check: the entry recording the DoD 3 ruling
backticks SPRINT-115's dotfile as an example, and T6 does not cite it.
**Impact (owner ruling):** the check fires only behind an opt-in flag. lean-flow's own gate script passes that flag for active sprints, so
T6 `Layers:` gains `scripts/qa-check.sh`. The adopter engine's output stays unchanged, and T6 stays Other G. T6 `Cites:` gains the dotfile
example, since it is cited, not touched. **Re-confirm G2:** this entry is the ruling.

### 2026-10-09 | progress | T4 done: the engine skips worktrees (bracket-safe); main reaches conformance level Structural
consequence · T4 · behaviour:material · governance:high
Builder (worktree, Sonnet; about 120k tokens):
- `eea6a67a`: the `_repo_files` prune plus the `_s12_tracked` filter. Engine harness 65 → 69 PASS. Seed 1 reddened only the placement
  case and seed 2 only the S12 case; controls stayed green.
- `fdc6f23c`: the three handoff-state ledgers are generated at test time and the tracked copies deleted. Harness 25 → 25 PASS, same verdicts.
- `31b88f09`: a review retry. The walk now runs from inside the root, so glob characters in the root path cannot defeat the prune or the
  prefix strip. Engine harness 71 PASS; a seed of the old walk reddened both bracketed-root cases.
Review (consequential G):
- Isolated Sonnet `REVIEW: CLEAR`, 8 of 8 items, including old vs new engine byte-identical on a tree with no worktrees.
- Codex round 1, 2 findings: (a) a bracketed root (fixed in `31b88f09`); (b) Git-quoted paths under worktrees escape the filter, which
  has 0 occurrences and no adopter path, so it goes to a TD.
- Codex re-review: (a) closed and no cwd leak. One low remains, a newline in a directory name; 0 occurrences, so TD.
review · T4 · scoped-reviewer · behaviour:material · governance:high
Merged `8e227bba`. Full `conformance.sh .` on main with **17 agent worktrees present**: `S2.R-PLACEMENT` PASS, **level: Structural**.
The remaining findings are Gated: 2 ADR edits and 7 retention.

### 2026-10-09 | progress | T6 done: the scope-change check is behind an opt-in flag and wired into lean-flow's gate
consequence · T6 · behaviour:material · governance:low
Builder (worktree, Sonnet; about 195k tokens): `fa69a1ba` (the check, 134 → 144/0); `a41813af` (dotfile tokens, 146/0); `e353cbb7` (behind
`--scope-change`, qa-check leg 14-a, 147/0). Without the flag, the checker's output is byte-identical to the pre-T6 checker on the live
sprint and on a fixture with findings.
Real-artifact run, Plans as promoted:
- fired: SPRINT-115 T4+T5 (including its dotfile), SPRINT-116 T1 and T1+T2, SPRINT-118 T1;
- not fired: the unbackticked SPRINT-118 member-file mention (out of reach by ruling).
Corrected final Plans still FAIL on read-only mentions until those are cited.
Scoped Sonnet review: 1 med finding. This sprint's own log tripped the check (an uncited dotfile example), and the shipped engine's freeze
leg would have relabelled the finding for adopters. Fixed by owner ruling (the opt-in flag, plus the dotfile cited on T6).
Re-check after merge `8feb0f39`: with the flag, `9 pass, 0 fail`; without it, `8 pass, 0 fail` (the pre-T6 shape).
review · T6 · scoped-reviewer · behaviour:material · governance:low
TD candidates for close: Git-quoted worktree paths · a newline in a directory name (T4) · scope-change path tokens with trailing
punctuation are dropped (T6) · the flag-on gate leg also reddens on freeze FAILs (overlaps S9, by design for now).
