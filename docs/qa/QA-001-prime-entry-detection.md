---
owner: Maintainer
last_updated: 2026-11-02
update_trigger: The case is re-run (Last run / Result updated in place), or /prime's read order or health-report shape changes
status: current
---

<!-- QA test-case instance — see docs/qa/README.md. Update Last run / Result in place each run. -->

# QA-001 — prime detects the loop's context slots on a fresh repo

- **Area under test:** `/prime` read-order + health check
- **Preconditions / fixture:** a throwaway repo with README · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · one `docs/work/backlog/` task file · an active sprint `docs/sprint/SPRINT-NNN-<slug>.md` (`status: active`) whose `## Members` names one task file that exists under `docs/work/<status>/` with 2 `- [ ]` boxes under `## Done when`
- **Last run:** 2026-06-21 — pass

## Steps
1. Scaffold the fixture (see Preconditions); `git init`.
2. Run prime's read-order — resolve each of its 7 slots in order, mark `[OK]`/`[MISSING]`.
3. Resolve the active sprint (`status: active` under `docs/sprint/`, its `## Members`); count open `- [ ]` under each member task file's `## Done when` (the `Tasks:` row; open `type: bug` items add `· bugs: N open`).

## Expected
All present slots report `[OK]`, missing ones `[MISSING]` (never fatal); open DoD = 2 (the member file's boxes, found by id), exactly the seeded set; the backlog count is only a fallback when no sprint is active. *Expected updated 2026-11-02 to prime's current report (7 slots, the `Tasks:` row); not re-run since.*

## Result
pass — all 5 scaffolded slots `[OK]`; DoD=2, Backlog=1 as seeded (SPRINT-008 T4 fixture run, deleted after).
