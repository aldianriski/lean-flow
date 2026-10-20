---
sprint: 133
slug: name-the-failing-edit
owner: Maintainer
last_updated: 2026-10-20
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-133 — Execution Log

> Append-only companion to [`../SPRINT-133-name-the-failing-edit.md`](../SPRINT-133-name-the-failing-edit.md). Uncapped by design
> (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-20 | promote | plan locked, governance signed, one member: an EPIC-007 close-Retro follow-up
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. The eight active entries (L-241 · 240 · 239 · 238 · 237 · 236 · 234 · 210) are each at count 1.
  Cross-check: 8 active + 211 promoted + 1 superseded = 220 headers.
- ☑ TD aging: 103 of 106 open rows aged against sprint 133; none newly aged (no row was filed at 130). TD-259 · 260 (131) and
  TD-261 (132) are not aged. Second route: 109 rows − 3 resolved = 106 open. No open row is `high`.
- ☑ doc-aging, §11 (owner-approved, applied in `640624c7` before this commit): TD-135 · 154 · 167 deleted (resolved at 130).
  9 task files pruned (cancel/345 · 363 · 393 · 448 · 449 · 450, done/455 · 456 · 457). None has a live citation, checked by
  a whole-word search of the live `.md` set and again by `git grep` over every tracked file. TASK-438 (127) has no live `.md`
  citation but is cited from code (`tick-box.ts` · `run-tick-box-fixtures.ts` · `qa-check.sh`), so it is retained (owner
  ruling). The CHANGELOG rotation already ran at 2.12.0 (`bbac9a57`).
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` exits 0; its two retained research docs have `.cap-dispositions` rows.
- ☑ epic rollup currency: EPIC-007 is current. The SPRINT-132 row carries `8eb2871`, `last_updated` 2026-10-20 equals the
  newest member close, and all three ticked conditions name SPRINT-132.
- ☑ epic coverage: EPIC-007 has 3 open conditions and 3 marked (C2 · C4 · C5, each with `next slice:`). Cross-check: 3 = 3 + 0.
- ☑ roadmap coverage: no roadmap. ☑ handoff ledger: none.
Epic: `epic: EPIC-007` set; SPRINT-133 appended to § Member sprints and `member_sprints:`.
Size check: 1 S, no `L`. The member is `origin: close-retro`, so G1 takes the full checklist (no fast-path).
Skill freshness: the installed copy is 2.11.0 and the repo is 2.12.0. `lean-doc-generator/SKILL.md` and both sprint templates are
byte-identical between the two, so this promote ran the current procedure.

### 2026-10-20 | gate | T1 G1 (full checklist, `origin: close-retro`) and G2 signed by popup; one owner ruling
G1: size S; files `skills/tdd/SKILL.md:76` and `packs/software-implementation.md:26-27, :44`. Out of scope: the per-cycle "name the
production change" check (`tdd:96` · `pack:37`), a version bump, the pack's Source line, a new exercise run (A1), and a checker.
G2: one shared phrase at all three sites, in one commit (D1), implemented inline because a three-sentence edit costs less than a
dispatch brief. Verify: DoD1 is a judgment tick plus a grep showing the phrase at 3 of 3 sites; DoD2 compares the sentences by
eye, plus a body scan (`awk 'NR>6'` over the pack for lean-flow ids) that is clean at baseline and fires on header line 6.
Owner ruling: the phrase adds "checked against the test's inputs", because a concrete edit can still pass the test
(`Math.round` gives 1 for 3600, as `Math.ceil` did).
builder-check · T1 · 0 contradictions · 0 missed sites · 1 fact settled (parentheses, not a dash, at all three sites) · 1 intent question → owner ruling above
consequence · T1 · behaviour:low · governance:high

### 2026-10-20 | progress | T1 built (`97775f05`), reviewed clean, both Done-when ticked
The phrase "name one concrete edit, checked against the test's inputs, that would fail it (a specific expression or value, not a class
of edits)" is at `/tdd` step 3 and at the pack's step 3 and output contract. Two counting routes agree: a joined-text count with CR
stripped (1 + 2) and a per-line count. A first count read 0 because of CRLF line endings; it was re-run, not trusted. The pack body
scan is clean and its control fires. `tdd/SKILL.md` stays at 107 lines (cap 140).
review · T1 · scoped-sonnet · behaviour:low · governance:high · Spec: none · Standards: none (only the line wrap differs between the files)

### 2026-10-20 | gate | system verify FAIL (layers observed) → owner ruling: Layers scope-change and rerun
system-verify · FAIL(layers observed) · QA_FULL on the VPS at `8a393ea5`: 292 pass, 1 fail. The pass count reconciles with SPRINT-132's 304: minus 9 `task-origin` lines for the pruned task files, minus 2 for fewer members (304 − 9 − 2 = 293)
owner-ruling: system-verify — Layers scope-change and rerun. The `in_progress → done` move of TASK-466 was committed under `sprint(133) T1:`, so it is attributed to T1, whose `Layers:` declare only the `todo/` and `in_progress/` paths. SPRINT-132 committed its done-moves under a bare `sprint(132):` subject (COORD). This is L-238's class, so its count goes to 2.

### 2026-10-20 | scope-change | § Plan T1 Layers: add the `done/` path of TASK-466 (owner ruling above)
**What broke:** T1's done-move commit touched `docs/work/done/TASK-466-already-covered-notes-name-a-concrete-change.md`, which
T1's `Layers:` do not declare, so the `layers observed` leg fails it.
**Impact:** § Plan T1's `Layers:` gains that exact path. Nothing else changes; no member's Done-when is touched. G2 is unaffected,
because it is a bookkeeping path, not a design change.

### 2026-10-20 | gate | system verify rerun FAIL (scope-change layers) → owner ruling: add the fragment to T1 Cites, file TD-263, rerun
system-verify · FAIL(scope-change layers) · QA_FULL on the VPS at `e4950dc1`: 292 pass, 1 fail. The `layers observed` leg now passes
owner-ruling: system-verify — Cites edit and rerun. The previous scope-change heading names the prose fragment `done/` in backticks. The leg reads any backticked span ending in a slash as a repo path, and only an exact token or a prefix declares it. The log is append-only, so T1's Cites (which the dead-token check does not read) gains `done/`, the fix the finding itself names. TD-263 records the false positive.

### 2026-10-20 | scope-change | § Plan T1 Cites: add the fragment `done/` (owner ruling above)
**What broke:** the previous scope-change heading's fragment is read as an undeclared path for T1.
**Impact:** § Plan T1's `Cites:` gains it. Layers, Done-when and G2 are unchanged.
system-verify · PASS · QA_FULL on the VPS at `5ccb4c23`, the final tree after both rulings: 293 pass, 0 fail

### 2026-10-20 | close | 1 of 1 member in done/, PLAN_EXHAUSTED; Retro + buckets; EPIC-007 rolled up (stays active)
run · 2 of 2 DoD ticked
terminal · PLAN_EXHAUSTED
System verify: QA_FULL 293/0 on the VPS at `5ccb4c23`, after two owner-ruled reruns (a Layers path, then a Cites fragment).
Buckets: Shipped → CHANGELOG § SPRINT-133 · Tech debt → TD-262 (§11 live citation counts only `.md` files), TD-263 (the
scope-change leg reads a prose fragment as a path) · Follow-ups → none · Learnings → L-242 (count 3), L-238 bumped to count 2.
Both are due at the next promote. Handoff reconciliation: no handoff entry. Doc-freshness: no §2 trigger fired.
Release: `skills/` changed, so this is PATCH 2.12.1 through `/release-patch` after the archive.
