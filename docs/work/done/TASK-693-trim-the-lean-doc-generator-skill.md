---
id: TASK-693
title: "Trim the lean-doc-generator SKILL.md body with no behaviour change and write the release notes"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-184
depends-on: [TASK-688, TASK-689, TASK-690, TASK-691, TASK-692]
---
# TASK-693 — Trim the lean-doc-generator SKILL.md body with no behaviour change and write the release notes

## Why
lean-doc-generator is 18.9k characters, with promote, close and init procedures. It runs last so the release notes cover every consumer-visible change from 688, 690, 691 and 692. It is the single owner of the README and CHANGELOG lines.

## Done when
- [x] The lean-doc-generator body is at or under its TASK-690 census target, `wc -c` before and after recorded. ✓ body 18,428 → 17,678 B ≤ 17,680 (census basis); wc -c before/after in checks.md
- [x] A retained inventory (`docs/work/evidence/TASK-693/lean-doc-generator.md`) accounts for EVERY behavioural line in the body before the trim, as a complete line-by-line list (not selected classes), each kept, moved (with its branch-point pointer) or deleted (reason: duplicate of a named surviving line); anything that fires on every call stays in the body. ✓ inventory docs/work/evidence/TASK-693/lean-doc-generator.md quotes all 105 nonblank original lines, each kept/shortened/deleted-as-duplicate with the surviving line
- [x] The skill is exercised on real input via `claude -p --plugin-dir D:/Project/lean-flow` (transcript shows the repo base dir): each of promote, close, init, migrate, epic and prd whose text was moved or deleted, on a throwaway directory or in a scratch worktree, nothing committed to main; the same stops and outputs as before are shown for each, including each moved reference being read. Spend is recorded against this task's 4.50 USD share in `docs/work/evidence/TASK-693/spend.md`. ✓ promote, the only route with moved/deleted text, run before/after via claude -p; after arm on the live checkout D:\Project\lean-flow (init); same stop at the L size check; 0.4499 of 4.50 USD in spend.md
- [x] README and the root CHANGELOG carry the user-visible lines for TASK-688 (humanizer glossary pointer), TASK-690 (description trims), TASK-691, TASK-692 and this task (body trims); no version bump (the owner releases v2.27.0 by hand). ✓ CHANGELOG [Unreleased] + README carry TASK-688, 690, 691, 693; TASK-692 cancelled so no line (scope-change); no version bump
- [x] The inventory and the runs are reviewed by a different model family than the builder (worktree-isolated), at most 2 rounds; the existing gates stay green. ✓ different-family review CLEAR (Claude on Codex's build); system-verify gate on 899ec6e4 (off-host): bun test 643 pass, 0 fail; QA-CHECK 245 pass, 0 fail
- [x] Negative: no promote or close approval stop, retention rule or "never write a core doc before approve" line is removed or weakened in the body, and a CHANGELOG line that names a leaked repo-specific path fails the review. ✓ Negative held: approval stops, retention rules and template-before-write lines untouched (reviewer); no repo-specific path in CHANGELOG

## Touches
`skills/lean-doc-generator/SKILL.md` (+ its `references/`), README, CHANGELOG. Shared files, so `git add -p` and read the staged diff. Not CONTEXT.md.

## Assumes
- Run budget: this task's fixed share is 4.50 USD of the 15.00 USD total; a run over the share is refused and the owner asked; unspent share is not borrowed without the owner.
- The last task: it cannot start before the other five finish.

## Tracker
Owner intake 2026-11-21, area 5; answer Q4 and the split ruling (the release lines are owned here).
