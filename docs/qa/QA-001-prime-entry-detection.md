---
owner: Maintainer
last_updated: 2026-08-24
update_trigger: The case is re-run (Last run / Result updated in place), or /prime's read order or health-report shape changes
status: current
---

<!-- QA test-case instance — see docs/qa/README.md. Update Last run / Result in place each run. -->

# QA-001 — prime detects the loop's context slots on a fresh repo

- **Area under test:** `/prime` read-order + health check
- **Preconditions / fixture:** a throwaway repo with README · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `TODO.md` (Active Sprint pointer + a Backlog task) · `docs/sprint/SPRINT-NNN.md` (open DoD)
- **Last run:** 2026-06-21 — pass

## Steps
1. Scaffold the fixture (see Preconditions); `git init`.
2. Run prime's read-order — resolve each of the 6 slots in order, mark `[OK]`/`[MISSING]`.
3. Count open DoD in the active sprint and open Backlog `- [ ]` tasks.

## Expected
All present slots report `[OK]`, missing ones `[MISSING]` (never fatal); the open-DoD and Backlog counts match what the fixture seeded.

## Result
pass — all 5 scaffolded slots `[OK]`; DoD=2, Backlog=1 as seeded (SPRINT-008 T4 fixture run, deleted after).
