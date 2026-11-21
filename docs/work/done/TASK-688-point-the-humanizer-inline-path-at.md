---
id: TASK-688
title: "Point the humanizer inline path at the host glossary (TD-317)"
priority: P2
size: S
risk: low
autonomy: AFK
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-184
depends-on: []
---
# TASK-688 — Point the humanizer inline path at the host glossary (TD-317)

## Why
`embedded.md` § Inline path sends the pass to three catalogs and never to the host glossary, so an override ("dry run") is ignored in commit messages (2 of 2 runs, SPRINT-180). L-327: an instruction deep in a file is not acted on.

## Done when
- [x] `embedded.md` § Inline path carries one pointer line to the host-glossary step, at the top of that section. ✓ one pointer line first in embedded.md § Inline path, naming patterns-id.md § Host glossary (optional); Claude review CLEAR
- [x] The commit-inline override case in `evals/fixtures/humanizer/domain-calque/` is re-run on real input after the edit, loading the live checkout via `claude -p --plugin-dir D:/Project/lean-flow` (transcript shows the repo base dir), and the output uses the host term "dry run", not "rehearsal"; spend is recorded against this task's 1.50 USD share in `docs/work/evidence/TASK-688/spend.md`. ✓ R1 on the live checkout (init: D:\Project\lean-flow) wrote 'dry run' and 'di-scan', no 'rehearsal'; 0.1639 of 1.50 USD in docs/work/evidence/TASK-688/spend.md
- [x] Negative: with no host glossary present the inline path still completes with no error, and no repo-specific path appears in the shipped skill text. ✓ Negative held: R2 with no host glossary completed with no error and no UNAVAILABLE; no repo-specific path in the shipped line (reviewer scan)

## Touches
The humanizer skill's `references/embedded.md` (shipped; its CHANGELOG line is written by TASK-693).

## Assumes
- Run budget: this task's fixed share is 1.50 USD of the 15.00 USD total; a run over the share is refused and the owner asked; unspent share is not borrowed without the owner.
- Builder choice is a dispatch decision; the reviewer is a different model family; the wording is decided at G2.

## Tracker
TD-317 (SPRINT-180 close retro); owner intake area 4.
