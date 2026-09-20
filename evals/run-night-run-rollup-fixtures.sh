#!/bin/sh
# run-night-run-rollup-fixtures.sh -- fixtures for scripts/lib/check-night-run-rollup.sh (SPRINT-059 T3)
# AND its TypeScript port scripts/lib/check-night-run-rollup.ts (TASK-355: cut the QA gate's
# wall-clock cost).
#
# The checker exists because a headless sprint-bulk run can end mid-Plan and exit `success`: measured
# at 4 of 7 units on a consumer's host, every commit correct, three tasks never begun, nothing written
# about them. Part 4 now mandates a rollup at every exit and ADR-016 puts the writing of it in the
# launcher's wrapper; this checker refuses to let a missing one pass review, which is what makes the
# step gated rather than merely requested.
#
# TASK-355 moved every case that ONLY spawns this checker (cases 1-8, 10, 11 of this file's prior
# shape -- ~31 shell subprocess spawns, each costing ~2.75s of Windows fork() emulation regardless of
# how little text-matching work the checker does) into evals/night-run-rollup.test.ts, which calls the
# TS port's exported functions directly in ONE Bun process. Every one of those cases still asserts on
# the checker's OWN NAMED FINDING, not merely a non-zero exit (L-058); nothing about WHAT is checked
# changed, only HOW it is invoked (a speed change, not a coverage change). scripts/lib/check-night-run-
# rollup.sh remains the shipped oracle -- unchanged, still what qa-check.sh leg 2g calls -- and
# evals/run-night-run-rollup-differential-parity.ts (opt-in, not part of this file) is what proves the
# TS port stays bug-for-bug identical to it, over every fixture AND every real committed Execution Log
# in this repo.
#
# What STAYS here, spawning subprocesses same as before: case 9 (the reaper family) drives
# scripts/night-run.sh --reap directly -- a different script, out of this task's scope; case 12 (the
# qa-check.sh leg 2g family) extracts and re-executes qa-check.sh's own leg 2g body verbatim, which
# still calls the checker via `sh scripts/lib/check-night-run-rollup.sh` -- qa-check.sh is a
# hard-constraint file this task must not modify, so leg 2g's own invocation shape is exercised
# exactly as shipped.
#
# Dependency-free POSIX sh, no git needed (case 12 still needs `sh`; the checker cases above now need
# `bun`, already a hard repo dependency post-SPRINT-101). Run bare: sh evals/run-night-run-rollup-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-night-run-rollup.sh"
fx="$here/fixtures/night-run-rollup"

fail=0

# --- checker-only cases (formerly cases 1-8, 10, 11 -- ~31 `sh $checker` spawns) ------------------
# Now ONE Bun process: evals/night-run-rollup.test.ts, calling checkNightRunRollup()/evaluateLog()
# directly against the SAME fixture files and the SAME two real committed archives (SPRINT-089/090,
# SPRINT-082) this file used to feed the shell checker. A test-COUNT floor, not just an exit code --
# `bun test` exits 0 on a file with zero live tests (a renamed test, a dropped describe), which would
# report this suite green having verified nothing (same shape run-dod-delta-fixtures.sh already
# guards). RAISE THIS when adding cases to evals/night-run-rollup.test.ts, in the same commit.
if ! command -v bun >/dev/null 2>&1; then
  echo "FAIL harness: bun not found on PATH -- the night-run-rollup checker cases cannot run, and skipping"
  echo "              them silently would report this suite green with ~31 cases unexercised"
  fail=1
else
  test_file="$here/night-run-rollup.test.ts"
  min_tests=46
  if [ ! -f "$test_file" ]; then
    echo "FAIL harness: test file not found at $test_file"
    fail=1
  else
    (cd "$repo_root" && bun test "evals/night-run-rollup.test.ts" 2>&1) > "$here/.tmp-nrr-bun-out.txt"
    nrr_code=$?
    nrr_out=$(cat "$here/.tmp-nrr-bun-out.txt")
    rm -f "$here/.tmp-nrr-bun-out.txt" 2>/dev/null
    printf '%s\n' "$nrr_out"
    # Bun colours its summary even when captured (an ESC/CSI byte precedes the digits) -- stripped
    # before the anchor below, otherwise `^` binds to the escape byte and never matches (SPRINT-102 T2).
    n_pass=$(printf '%s\n' "$nrr_out" | sed 's/\x1b\[[0-9;]*m//g' | grep -oE '^ *[0-9]+ pass' | grep -oE '[0-9]+' | head -1)
    [ -n "$n_pass" ] || n_pass=0
    if [ "$nrr_code" -ne 0 ]; then
      echo "FAIL fixture(night-run-rollup-ts): the checker suite is red (bun test exit $nrr_code)"
      fail=1
    elif [ "$n_pass" -lt "$min_tests" ]; then
      echo "FAIL fixture(night-run-rollup-ts): only $n_pass test(s) ran, expected at least $min_tests --"
      echo "              coverage SHRANK while bun still exited 0 (a skipped describe, a renamed"
      echo "              file, or a dropped case all look exactly like this)"
      fail=1
    else
      echo "PASS fixture(night-run-rollup-ts): checker green -- $n_pass tests, 0 fail (retained: cases 1-8/10/11 of this harness's prior shape, incl. the real SPRINT-089/090/082 archived-artifact fixtures)"
    fi
  fi
fi

# --- case 9 family: the reaper writes into the Plan the run was actually pointed at (SPRINT-093 T1,
# DoD 3/4) ------------------------------------------------------------------------------------------
# TD-112: SPRINT-089's reaper found two `status: active` sprint files (SPRINT-089, SPRINT-090) and
# silently wrote into the alphabetically-first one -- the WRONG sprint's log got the rollup, and the
# terminal state it derived (`PLAN_EXHAUSTED`) was internally consistent with THAT file's empty
# task-state history, which is why it read as correct until someone checked which file it landed in.
# Fixed in night-run.sh: find_sprint() now refuses ambiguity (0 or >1 active matches -> return 1,
# same safe failure as "not found") instead of picking the first match, and a new `--sprint FILE`
# launcher option lets the target be DECLARED rather than re-inferred. Exercised here directly
# against night-run.sh's `--reap` re-entry point -- the exact code path the launcher's detached
# wrapper invokes at exit -- each case copied into a scratch dir first so the checked-in fixture
# tree is never mutated by the test itself (it would otherwise accumulate a rollup block on every
# run of this suite).
fx2="$here/fixtures/night-run-reaper"
night_run="$repo_root/scripts/night-run.sh"

reaper_scratch() {
  rs_name=$1
  rs_dir=$(CDPATH= cd -- "$here" && pwd)/.tmp-reaper-$rs_name
  rm -rf "$rs_dir" 2>/dev/null
  mkdir -p "$rs_dir"
  (cd "$fx2/$rs_name" && tar cf - .) | (cd "$rs_dir" && tar xf -)
  printf '%s' "$rs_dir"
}

# Case 9a (must-NOT-write, both sides): two active sprints, no --sprint declared. The reaper must
# refuse to guess -- neither log may gain a line. This is the ambiguity SPRINT-089 hit for real.
rs=$(reaper_scratch two-active-refuses)
logA_before=$(cat "$rs/docs/sprint/logs/SPRINT-950-a.md")
logB_before=$(cat "$rs/docs/sprint/logs/SPRINT-951-b.md")
sh "$night_run" --reap "$rs/run.log" "$rs" "1700000000" "0" "" >/dev/null 2>&1
logA_after=$(cat "$rs/docs/sprint/logs/SPRINT-950-a.md")
logB_after=$(cat "$rs/docs/sprint/logs/SPRINT-951-b.md")
if [ "$logA_before" = "$logA_after" ] && [ "$logB_before" = "$logB_after" ]; then
  echo "PASS fixture(two-active-refuses): ambiguous target -- neither SPRINT-950's nor SPRINT-951's log gained a line"
else
  echo "FAIL fixture(two-active-refuses): the reaper wrote somewhere despite an ambiguous (2-active) target -- SPRINT-089's cross-write recurred"
  fail=1
fi
rm -rf "$rs" 2>/dev/null

# Case 9b (must-write, correctly targeted): the SAME two-active-sprint tree, but with the target
# DECLARED via the 5th --reap positional (what --sprint resolves to before firing). Only the
# declared sprint's log may change; the other must stay byte-identical to its pristine copy -- this
# is the SPRINT-089 cross-write's exact negative space: "a run pointed at sprint A leaves no line in
# sprint B's log."
rs=$(reaper_scratch two-active-refuses)
logA_before=$(cat "$rs/docs/sprint/logs/SPRINT-950-a.md")
sh "$night_run" --reap "$rs/run.log" "$rs" "1700000000" "0" "$rs/docs/sprint/SPRINT-951-b.md" >/dev/null 2>&1
logA_after=$(cat "$rs/docs/sprint/logs/SPRINT-950-a.md")
if [ "$logA_before" != "$logA_after" ]; then
  echo "FAIL fixture(two-active-declared-targets-correctly): SPRINT-950's (undeclared) log changed when the run was pointed at SPRINT-951"
  fail=1
elif ! grep -qE '^### .*\| *run-complete *\|' "$rs/docs/sprint/logs/SPRINT-951-b.md" 2>/dev/null; then
  echo "FAIL fixture(two-active-declared-targets-correctly): SPRINT-951's (declared) log did NOT gain a rollup"
  fail=1
else
  echo "PASS fixture(two-active-declared-targets-correctly): declared target SPRINT-951 got the rollup; SPRINT-950 stayed untouched"
fi
rm -rf "$rs" 2>/dev/null

# Case 9c (backward-compat control): a single active sprint, no --sprint declared -- the pre-fix
# mainline shape. Must still resolve and write, proving the ambiguity refusal did not also disable
# the ordinary (unambiguous) case.
rs=$(reaper_scratch single-active-baseline)
sh "$night_run" --reap "$rs/run.log" "$rs" "1700000000" "0" "" >/dev/null 2>&1
out=$(sh "$checker" "$rs/docs/sprint/logs/SPRINT-960-solo.md" 2>&1); ec=$?
if [ "$ec" -eq 0 ] && printf '%s\n' "$out" | grep -q 'agrees with its per-task lines'; then
  echo "PASS fixture(single-active-baseline-unaffected): the sole-active-sprint case still resolves and writes a well-formed rollup"
else
  echo "FAIL fixture(single-active-baseline-unaffected): the ambiguity fix broke the ordinary single-sprint case -- output:"
  printf '%s\n' "$out"
  fail=1
fi
rm -rf "$rs" 2>/dev/null

# --- case 12 family: qa-check.sh leg 2g's OWN population derivation (SPRINT-098 T1, DoD 1/2/4) ---
# Everything above proves check-night-run-rollup.sh itself FAILs on a nonexistent path (its own
# file-not-found guard). What was never exercised is the CALLER, scripts/qa-check.sh leg 2g: before
# SPRINT-098 T1, a sprint whose log was missing was silently dropped out of the checker's input list
# before it ever saw the path -- so the one failure this whole file exists to catch never had a
# chance to surface -- the checker already FAILs on a nonexistent path
# (check-night-run-rollup.sh's own file-not-found guard), it just never used to be handed one.
# Extracted here from the REAL committed scripts/qa-check.sh at run time -- between the leg's own
# `qb_checkpoint` marker and the next one -- never hand-typed, so a future edit to the leg cannot
# drift silently out of sync with this proof (the same discipline the retained fixtures above apply
# one file down). qa-check.sh is a hard-constraint file this task does not modify -- leg 2g still
# calls the SHELL checker (`sh scripts/lib/check-night-run-rollup.sh`), so this family still spawns it.
qa_check="$repo_root/scripts/qa-check.sh"
leg2g_wrapper="$here/.tmp-leg2g-wrapper.sh"
# The extracted BODY is captured on its own first, and emptiness is asserted against THAT -- not
# against the assembled wrapper. The wrapper always contains HARNESS_HEAD and HARNESS_TAIL, so a
# `-s` test on it can never be false however completely the extraction failed: the guard below was
# asserted to name marker drift and structurally could not fire (SPRINT-098 T1, outside review).
# Proven by seeding the drift it names (`leg 2g` -> `Leg 2g`): all three fixtures went red and the
# named diagnostic never appeared, so a maintainer saw three generic mismatches and no cause.
leg2g_body="$here/.tmp-leg2g-body.sh"
awk '
  /qb_checkpoint "leg 2g: recorded-run rollup"/ {f=1; next}
  f && /qb_checkpoint/ {exit}
  f
' "$qa_check" | sed "s#scripts/lib/check-night-run-rollup.sh#$repo_root/scripts/lib/check-night-run-rollup.sh#" > "$leg2g_body"
[ -s "$leg2g_body" ] || {
  echo "FAIL harness: leg 2g extraction from $qa_check produced nothing -- the leg's shape (or its qb_checkpoint marker text) changed, re-derive the awk pattern"
  fail=1
}
{
  cat <<'HARNESS_HEAD'
#!/bin/sh
set -u
fail=0
pass=0
note() { printf '      %s\n' "$1"; }
ok()   { pass=$((pass + 1)); printf 'PASS  %s\n' "$1"; }
bad()  { fail=$((fail + 1)); printf 'FAIL  %s\n' "$1"; }
HARNESS_HEAD
  cat "$leg2g_body"
  cat <<'HARNESS_TAIL'
printf 'LEG2G-SUMMARY pass=%s fail=%s\n' "$pass" "$fail"
HARNESS_TAIL
} > "$leg2g_wrapper"

run_leg2g() { ld=$1; ( cd "$ld" && sh "$leg2g_wrapper" 2>&1 ); }

# case 12a (must-FAIL, the motivating shape): a live sprint with open DoD whose Execution Log does
# not exist at all -- the missing path now reaches the checker instead of being filtered out, and
# its own file-not-found FAIL fires, named.
d="$fx/qa-leg2g-open-dod-no-log"
out=$(run_leg2g "$d"); ec12a=$?
if [ "$ec12a" -eq 0 ] \
   && printf '%s\n' "$out" | grep -q 'no Execution Log found at docs/sprint/logs/SPRINT-973-qa-leg2g-open-no-log.md' \
   && printf '%s\n' "$out" | grep -q 'LEG2G-SUMMARY pass=0 fail=1'; then
  echo "PASS fixture(qa-leg2g-open-no-log-fails): an absent log for an open-DoD sprint reaches the checker and FAILs named"
else
  echo "FAIL fixture(qa-leg2g-open-no-log-fails): expected a named 'no Execution Log found' FAIL -- got exit $ec12a:"
  printf '%s\n' "$out"
  fail=1
fi

# case 12b (sibling control, L-142): the SAME open-DoD shape, but the log exists and is wellformed
# -> stays green. Without this, a leg that always failed would satisfy 12a alone.
d="$fx/qa-leg2g-open-dod-with-log"
out=$(run_leg2g "$d"); ec12b=$?
if [ "$ec12b" -eq 0 ] \
   && printf '%s\n' "$out" | grep -q 'PASS  night-run rollup' \
   && printf '%s\n' "$out" | grep -q 'LEG2G-SUMMARY pass=1 fail=0'; then
  echo "PASS fixture(qa-leg2g-open-with-log-ok): an open-DoD sprint whose log exists stays green"
else
  echo "FAIL fixture(qa-leg2g-open-with-log-ok): expected a clean PASS -- got exit $ec12b:"
  printf '%s\n' "$out"
  fail=1
fi

# case 12c (must-vary-SELECTION, L-186): the IDENTICAL missing-log condition as 12a, but this
# sprint's DoD is fully ticked (closed, awaiting archive -- check-layers-observed.sh's own "at
# close" shape). The verdict must differ even though the file-existence fact does not: this sprint
# must never reach the checker at all, because "open DoD" is the selection criterion DoD 1 states,
# not bare log-existence. Being the sole sprint file in its scratch tree, total exclusion collapses
# nr_files to empty and the aggregate skip note fires instead -- proof the sprint was dropped from
# the population, not merely evaluated and passed (a silent PASS on a wrong population would look
# identical to a correct one without the second assertion below).
d="$fx/qa-leg2g-closed-dod-no-log"
out=$(run_leg2g "$d"); ec12c=$?
if [ "$ec12c" -eq 0 ] \
   && printf '%s\n' "$out" | grep -q 'skip -- no active sprint Plan found' \
   && ! printf '%s\n' "$out" | grep -q 'SPRINT-975'; then
  echo "PASS fixture(qa-leg2g-closed-no-log-excluded): a closed-DoD sprint's missing log is never handed to the checker (selection, not verdict)"
else
  echo "FAIL fixture(qa-leg2g-closed-no-log-excluded): expected total exclusion from the population -- got exit $ec12c:"
  printf '%s\n' "$out"
  fail=1
fi

rm -f "$leg2g_wrapper" "$leg2g_body" 2>/dev/null

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "NIGHT-RUN-ROLLUP FIXTURES: all green"; else echo "NIGHT-RUN-ROLLUP FIXTURES: at least one FAIL"; fi
exit $fail
