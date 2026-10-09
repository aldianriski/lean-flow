### 2026-10-07 | scope-change | T1 Layers corrected before build: the live checkers are TypeScript, and the TD-122 finding fires at close
**What broke:** § Plan T1 names `scripts/lib/check-authority.sh`, but the gate leg runs `scripts/lib/check-authority.ts` (`qa-check.sh:1392`,
TASK-355 port). The `.sh` is now a frozen differential oracle that ADR-050 §3 says must not grow. A fired-but-unreaped finding wired into an
always-on leg would also go red during every live run, including the run's own mid-run system-verify, because `terminal ·` is written
only after the run exits. **Impact:** T1 edits `check-authority.ts` and not the `.sh`. The TD-122 finding lives in the close gate
`scripts/lib/check-sprint-by-reference.ts --close`, where no run can still be in flight, with fixtures under `evals/fixtures/by-reference/`.
**Re-confirm G2:** owner-ruled in the entry below.
