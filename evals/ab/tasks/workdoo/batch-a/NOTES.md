# Batch notes

- Every task here was re-run by the coordinator in a fresh baseline copy, independent of the author (`verify.json`): the
  acceptance test fails before the reference patch and passes after it, with every frozen grader green.
- Runtime: workdoo needs Node 24.16+ (its server refuses older Node). Verification ran on Node 24.22.2; every trial
  environment for workdoo must provide Node 24.16+ too.
- Workdoo's docs are thorough, so a lost-detail fact is rarely absent everywhere; the lost-detail task here rests on a
  statement found only in the notes, with the behaviour partly visible in code.
- Both workdoo lost-detail tasks (one per batch) rest on the same fact, date-times shown in UTC en-GB style; owner accepted
  this as the workdoo limit (2026-10-30).
