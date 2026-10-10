---
id: TASK-419
title: "Clean up the learnings ledger: complete the metadata, close the lint gap, consolidate repeat families"
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-121
depends-on: []
---

# TASK-419 — Clean up the learnings ledger: complete the metadata, close the lint gap, consolidate repeat families

## Why

`docs/LEARNINGS.md` holds 62 active entries, each at count 1, and none is ready to promote. Many repeat one family ("a value
you act on is a query result: cross-check it"), so recurrences are filed as new singletons instead of bumping one count, and the
promotion trigger never fires. Three entries (L-209 · L-210 · L-211) have no `seen` / `count` / `promoted` lines, and the gate
does not notice: the metadata check reads only each heading's `[tags][status]`. Codex ranked this H3 (2026-10-10). It is
admissible under the interim governance restriction as the fix for a measured defect.

## Done when

- [x] L-209, L-210 and L-211 carry complete body metadata (`seen` · `count` · `promoted` · `related`) taken from their own text ✓ `6dd4f1c0`: L-209/210/211 carry seen · count · promoted · related (seen = their 2026-09-22 filing commits)
      and the sprints they cite.
- [x] The gate's learnings metadata check FAILs, naming the entry, on any entry missing a body `count:` or `promoted:` line, ✓ `3cf400a5`: gate leg `learnings body metadata` (active entries; owner ruling: active-only) + 5 fixtures in run-learnings-metadata-fixtures.ts (always-on): 5 pass/0 fail; real ledger red (L-209/210/211) → green; VPS QA_FULL at b306e52a: `PASS learnings body metadata complete`
      proven by a retained must-FAIL fixture plus a passing sibling control. It PASSes on the repaired ledger.
- [x] A census partitions the 62 active entries into families, recorded with each member's id. Every family of ≥2 members is ✓ census 10 families + 1 singleton = 62 (owner-signed at G2); `6dd4f1c0`: 58 `merged into` pointers + 3 survivors = 61 family members (second route agrees); strict active count 4; VPS conformance `PASS S11.LEARNINGS`
      consolidated through the ledger's own route: one surviving entry carries the summed sightings, and each folded entry is
      marked `promoted` with `disposition: merge` naming the survivor. No past entry's text is rewritten or deleted.
- [x] Any family whose summed count reaches ≥2 is listed for the next promote checkpoint as a promotion candidate. It is ✓ survivors L-185 (6) · L-219 (4) · L-217 (4) are count ≥ 2, promoted: no — they surface at the next promote scan (owner: promote there, not here)
      proposed there, not promoted here.

## Touches

- `docs/LEARNINGS.md` · `scripts/qa-check.sh` (learnings metadata check) · `evals/` (fixture) · `docs/knowledge-index.md`
  (regenerated)

## Assumes

- The census is checked by a second route (its family counts must sum to the 62 active entries), per the cross-check rule.
- Family membership is a judgement and needs owner sign-off at G2 before any `merge` is written.

## Tracker

- Codex review H3 (2026-10-10) · owner approval 2026-10-10 · LEARNINGS § disposition (TASK-384)
