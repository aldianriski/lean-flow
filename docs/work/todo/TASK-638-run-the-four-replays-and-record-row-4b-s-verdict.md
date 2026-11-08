---
id: TASK-638
title: "Run the four SPRINT-167 replays, two ordinary and two thin-router, and record row 4b's verdict"
type: feature
epic: EPIC-024
sprint: SPRINT-170
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
state: ready
depends-on: [TASK-632]
---

# TASK-638 — Run the four SPRINT-167 replays, two ordinary and two thin-router, and record row 4b's verdict

## Why
Second half of row 4b, split from TASK-632 at promote (SPRINT-170) because the whole was size L. TASK-632 builds the thin router and Executor files and proves the shared harness; this task runs the matched replay with them and records the verdict, held to row 4's cost bar.
The two ordinary runs are the shared baseline: TASK-634 consumes them, and an invalid baseline run voids both verdicts.

## Done when
- [ ] The four replay runs of SPRINT-167 from `6a7cadf2`, two ordinary and two thin-router, alternated, each starting cold from a fresh session on the settings TASK-632's G2 froze, finish within the sprint cap. Each records USD, elapsed minutes, boxes ticked, gate verdict and review result, or each deviation is recorded. Each run builds both tasks in worktrees inside its own scratch repository and merges both back; an ordinary run that misses any of the 11 boxes, the gate, the review or either merge-back is invalid.
- [ ] Each router run is audited for the router's tool use, unchanged relays and Executor identity.
- [ ] The verdict is recorded in EPIC-024 row 4b. Go only if both thin-router runs cost at least 25% less than the ordinary mean, elapsed time does not exceed the ordinary mean, and every box, the gate and review pass. Missing evidence, a treatment violation, drift, an abort or an incomplete sample cannot yield a go. Anything else, including inconclusive, is no-go.
- [ ] Negative: no router or Executor file reaches `main` or `.claude/agents/` before a go, and no replay run merges outside its own scratch repository, pushes, or writes outside it. Harness logs go to the operator's scratch folder only, never a run's worktree or its parent.

## Assumes
- **A1** — The replay set-up of TASK-630 § Results is reusable: worktrees `D:\Project\lean-flow-worktrees\replay-*`, VPS gate dirs `~/lf-gate-*`, `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0`, gate settings passed so Git Bash cannot rewrite them, and a replay prompt that allows worktree isolation inside each run's scratch repository. *Confirm: G2 recon (the VPS dirs were not checked).*
- **A2** — All-in spend is charged to the sprint's 60 USD cap, shared with TASK-632 to 637. Row limits are frozen at G2; reruns are cut first. *Confirm: sprint decisions SD2.*

## Touches
Scratch worktrees; the trial branch's `agents/*.md` (read only). `main`: this file, `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Tracker
EPIC-024 row 4b, D14 · TASK-632 (files, harness, settings freeze) · TASK-634 (consumes the ordinary runs) · TASK-630 § Results
