---
id: TASK-483
title: "worktree builders and reviewers run the host's dependency-needing gate leg before they report"
sprint: SPRINT-138
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-482]
---

# TASK-483 — worktree builders and reviewers run the host's dependency-needing gate leg before they report

## Why
TD-194 (medium) is a **measured defect**. A worktree has no installed dev dependencies, so a TypeScript error a task introduces is
invisible to its builder and reviewer: SPRINT-109 T3, and SPRINT-137 T2, whose two errors were found only at system verify.
Unfrozen defect fix. It is a shipped-skill procedure, so the Codex review loop applies. It depends on TASK-482 for the remote
branch below.
Consumer: any adopter whose gate needs installed dependencies (Node, Python, Bun…) has the same blind worktree; the fix ships to them.

## Done when
- [x] `dispatch.md` § Worktree dispatch protocol says: when the host's gate has a leg that needs installed dev dependencies, the ✓ `b64dde5b` + Codex retry `77fe54b8`: § Worktree dispatch protocol paragraph — the brief has each builder/reviewer install by the host's own dependency-install procedure before dependent work, run the leg and quote its result (failures/blockers reported too), and the coordinator checks the report; host-generic examples; no install or leg may overlap any task's wall-clock run. Codex round 2 CLEAR
      brief has each builder/reviewer install them first in its worktree by the host's own install procedure, then run that leg
      and report its result in the host's format before reporting, and the coordinator checks that the report quotes the install
      and the leg's result. Host-generic, and reconciled with the existing "run nothing host-heavy while a task measures
      wall-clock" line.
- [x] Exercised, either branch: (a) the in-worktree typecheck runs on this host, and a seeded TypeScript error is reported by the ✓ branch (a): a real worktree probe briefed with the paragraph verbatim (round-1 text; the retry changed wording only, not the install → leg → report path) installed (0.9 s), ran tsc clean, reported a seeded `error TS2322` (exit 1) before merge-back, removed it, left `git status` empty
      builder before merge-back, then removed; or (b) a recorded local resource failure, followed by the same check, seeded error
      included, run remotely on the EXACT worktree commit through TASK-482's command. A local failure alone does not satisfy this box.
- [x] Peak memory and wall-clock of the in-worktree typecheck on this host are recorded, whichever branch ran. ✓ native tsc.exe (TypeScript 7; the .bin shim resolves to it), peak working set 122 MB (polled every 20 ms), 0.3 s, with 0.57 GB free
- [x] Consumer path: applied read-only to workdoo, the wording resolves to that repo's own install command and gate leg, with no ✓ workdoo read-only: its bun lockfile + its package.json `"typecheck": "tsc --noEmit && tsc --noEmit -p apps/web"` → the wording resolves to `bun install --frozen-lockfile` + `bun run typecheck`, no lean-flow path required
      lean-flow path in it.
- [x] README and CHANGELOG describe the worktree change; TD-194 resolved in `TECH-DEBT.md`. ✓ README § How it works (`ffce25bc`) and CHANGELOG v2.14.0 (`d7252dd0`) describe the worktree dependency step; TD-194 resolved

## Touches
`skills/orchestrator/references/dispatch.md` · `TECH-DEBT.md` · README · CHANGELOG

## Assumes
- An in-worktree typecheck can run on this Windows host at the 0.3–0.5 GB typically free. UNCONFIRMED, which is why the second
  Done-when box takes either branch.
- Shipped wording is host-generic: lean-flow's own command or path appears only as an example ("lean-flow's own: …").
- workdoo is a lean-flow adopter (bun, a `verify` script). Consumer-path checks read it and never write to it.

## Tracker
- TD-194 · owner selection 2026-10-24 (candidate B); intake draft reviewed by Codex 2026-10-24 (APPROVE WITH FIXES, folded in)
