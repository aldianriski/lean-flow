#!/bin/sh
# run-reap-terminal-fixtures.sh -- fixtures for the TERMINAL-STATE DERIVATION in scripts/night-run.sh
# reap() (SPRINT-088 T2, Part 0b). Tier G per this sprint's D4.
#
# --- why this file exists at all ------------------------------------------------------------------
# It was written after an independent review pointed out that `--reap` had NO fixture coverage
# whatsoever -- `grep -r -- --reap evals/` returned nothing -- while carrying Tier G derivation logic
# that decides how a whole unattended run is reported. Every other guard in this sprint had a harness;
# the one piece that EMITS the verdict had none, so its first defect shipped and was reported as a
# clean result on real committed data (`terminal · PLAN_EXHAUSTED` over three `blocked` tasks).
#
# The lesson generalises: a checker that VALIDATES a field is easy to remember to test; the code that
# PRODUCES the field is the half that gets forgotten, because its output looks like data rather than
# like a claim. `check-night-run-rollup.sh` only ever asserted the terminal line's SHAPE -- it cannot
# tell whether the named state is the right one, and nothing else was looking.
#
# Each case builds a throwaway repo-shaped tree under mktemp, drives the real reaper, and asserts the
# state it emits. No git, no network.
#
# Dependency-free POSIX sh. Run bare: sh evals/run-reap-terminal-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
launcher="$repo_root/scripts/night-run.sh"

[ -f "$launcher" ] || { echo "FAIL harness: launcher not found at $launcher"; exit 2; }

fail=0
work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$work"' EXIT INT TERM

# mk_v2 <dir> <t1-box> [<t2-box>] -- a by-reference (v2) tree: one member per unit under docs/work/in_progress, a
# `## Members` list and `Cites:` per unit. Box is the member's single `## Done when` box ("x" ticked, " " open).
# v1 inline-Plan counting was retired at SPRINT-128 (ADR-046), so every reaper tree here is v2.
mk_v2() {
  mv_d=$1; mv_b1=$2; mv_b2=${3-}
  mkdir -p "$mv_d/docs/sprint/logs" "$mv_d/docs/work/in_progress"
  {
    printf -- '---\nsprint: 960\nstatus: active\n---\n\n## Members\n\n- docs/work/in_progress/TASK-9601-a.md\n'
    [ -n "$mv_b2" ] && printf -- '- docs/work/in_progress/TASK-9602-b.md\n'
    printf -- '\n## Plan\n\n### T1 \342\200\224 x `[size: S]`\nLayers: `a.md`\nCites: `TASK-9601`\n'
    [ -n "$mv_b2" ] && printf -- '\n### T2 \342\200\224 y `[size: S]`\nLayers: `b.md`\nCites: `TASK-9602`\n'
  } > "$mv_d/docs/sprint/SPRINT-960-fx.md"
  printf -- '---\nid: TASK-9601\nsprint: SPRINT-960\nstate: ready\n---\n\n# TASK-9601\n\n## Done when\n\n- [%s] a thing\n' "$mv_b1" > "$mv_d/docs/work/in_progress/TASK-9601-a.md"
  [ -n "$mv_b2" ] && printf -- '---\nid: TASK-9602\nsprint: SPRINT-960\nstate: ready\n---\n\n# TASK-9602\n\n## Done when\n\n- [%s] b thing\n' "$mv_b2" > "$mv_d/docs/work/in_progress/TASK-9602-b.md"
  return 0
}

# case <label> <want-state> <dod-box> <log-body> [<exit-code>]
case_reap() {
  label=$1; want=$2; box=$3; body=$4; ec=${5:-}
  d="$work/$label"
  mk_v2 "$d" "$box"
  printf '# log\n%s\n' "$body" > "$d/docs/sprint/logs/SPRINT-960-fx.md"
  : > "$d/run.log"
  [ -n "$ec" ] && printf '%s' "$ec" > "$d/run.log.exit"

  err=$(sh "$launcher" --reap "$d/run.log" "$d" "" 0 2>&1 >/dev/null)
  got=$(grep -oE '^terminal · [A-Z_]+' "$d/docs/sprint/logs/SPRINT-960-fx.md" 2>/dev/null | sed 's/^terminal · //')

  if [ "$got" = "$want" ] && [ -z "$err" ]; then
    echo "PASS fixture($label): terminal · $got"
  else
    echo "FAIL fixture($label): got '${got:-<none>}', wanted '$want'${err:+ -- stderr: $err}"
    fail=1
  fi
}

# --- the clean ending, and it is the only one ----------------------------------------------------
case_reap "done-is-plan-exhausted"      "PLAN_EXHAUSTED"     "x" "T1 · done · 1 of 1 DoD"

# --- work remains that needs a human -------------------------------------------------------------
# `blocked` is the case that shipped WRONG: it satisfies "has a line about it" and, before the fix,
# fell straight through to PLAN_EXHAUSTED -- "the only clean ending" over a run that was not clean.
case_reap "blocked-is-authority-boundary" "AUTHORITY_BOUNDARY" " " "T1 · blocked · needs a human decision"
case_reap "parked-is-authority-boundary"  "AUTHORITY_BOUNDARY" " " "T1 · parked-hitl · waiting on the owner"

# --- the run could not proceed past a step -------------------------------------------------------
case_reap "stalled-is-hard-failure"     "HARD_FAILURE"       " " "T1 · stalled · watchdog fired"
case_reap "denied-is-hard-failure"      "HARD_FAILURE"       " " "T1 · denied-tool · dontAsk refused a call outside the allowlist"

# --- never reached at all ------------------------------------------------------------------------
# No line mentioning T1 anywhere: the reaper must call that `unattempted`, and an exhausted turn is a
# budget stop. The log body deliberately mentions the task in PROSE to confirm the match is anchored
# at column 1 and not a loose substring (L-108).
case_reap "unreached-is-budget-stop"    "BUDGET_STOP"        " " "some prose that mentions T1 · done in passing"

# --- precedence, which is the part most likely to rot ---------------------------------------------
# A non-zero process exit explains the stop and outranks everything derived from the log.
case_reap "nonzero-exit-outranks-all"   "HARD_FAILURE"       "x" "T1 · done · 1 of 1 DoD" "1"

# --- by-reference (v2) sprints: the DoD is the MEMBERS' `## Done when` boxes (SPRINT-110 T4 · TASK-392) ---
# Before the retarget reap() counted `- [x]`/`- [ ]` and `### T` blocks in the sprint FILE, so a
# by-reference sprint (whose Plan carries no boxes) reported `0 of 0` over any run. Each case copies a
# fixture tree from fixtures/night-run-reaper/, appends a log body, runs the real reaper, and asserts
# EVERY pattern given (each `grep -q` on the rollup the reaper appended). v2-by-reference varies the
# SELECTION on purpose: a stale `## Members` path (TASK-9611 listed under todo/, file in in_progress/),
# a member reached only by its `sprint:` stamp (TASK-9613), a unit citing two members (T2), a unit
# citing no current member (T4, scoped out), and a box under `## Touches` that is not DoD.
# Hand count for v2-by-reference: ticked 1+2+0 = 3, open 1+0+2 = 3 -> `3 of 6`; units T1 T2 T3 = 3, none
# delivered (each cites a member with an open box) -> `0 completed / 3 total`.
fxdir="$here/fixtures/night-run-reaper"
# case_fx <label> <fixture> <log-body> <pattern>...   (patterns are fixed strings, ALL must appear)
case_fx() {
  label=$1; fxn=$2; body=$3; shift 3
  d="$work/$label"
  mkdir -p "$d" && cp -R "$fxdir/$fxn/." "$d/" || { echo "FAIL fixture($label): could not copy $fxn"; fail=1; return; }
  mkdir -p "$d/docs/sprint/logs"
  printf '# log\n%s\n' "$body" > "$d/docs/sprint/logs/SPRINT-961-v2.md"
  : > "$d/run.log"
  err=$(sh "$launcher" --reap "$d/run.log" "$d" "" 0 2>&1 >/dev/null)
  rolled=$(cat "$d/docs/sprint/logs/SPRINT-961-v2.md")
  miss=""
  for pat in "$@"; do
    printf '%s\n' "$rolled" | grep -qF -- "$pat" || miss="$miss [$pat]"
  done
  if [ -z "$miss" ] && [ -z "$err" ]; then
    echo "PASS fixture($label): $# assertion(s) on the rollup"
  else
    echo "FAIL fixture($label): missing${miss:- none}${err:+ -- stderr: $err}"
    printf '%s\n' "$rolled" | sed 's/^/    | /'
    fail=1
  fi
}
# must-FAIL: the motivating shape. Not `0 of 0`; the members' boxes, and the two-member unit stays open.
case_fx "v2-counts-member-boxes" "v2-by-reference" "T1 · done · a
T2 · done · b
T3 · blocked · c" \
  "run · 3 of 6 DoD ticked  [mechanical]" "tasks · 3 attempted / 0 completed / 3 total" "0 of 3 units" \
  "terminal · AUTHORITY_BOUNDARY"
# a unit with an open member and no log line is unattempted; the scoped-out T4 and a logged T1 are not
case_fx "v2-unattempted-from-members" "v2-by-reference" "T1 · done · a" \
  "terminal · BUDGET_STOP" "tasks · 1 attempted / 0 completed / 3 total" \
  "T2 · unattempted ·" "T3 · unattempted ·"
# sibling control: every member ticked -> every unit delivered, the only clean ending
case_fx "v2-all-ticked-delivered" "v2-all-ticked" "T1 · done · a
T2 · done · b
T3 · done · c" \
  "run · 6 of 6 DoD ticked  [mechanical]" "tasks · 3 attempted / 3 completed / 3 total" "3 of 3 units" \
  "terminal · PLAN_EXHAUSTED"
# must-FAIL: a listed member that resolves to no file is HARD_FAILURE, named -- never a clean 0 of 0
case_fx "v2-unresolved-member-hard-failure" "v2-unresolved-member" "T1 · done · a
T2 · done · b
T3 · done · c" \
  "terminal · HARD_FAILURE · " "SPRINT-MEMBER-UNRESOLVED" "member DoD unreadable: SPRINT-MEMBER-UNRESOLVED: TASK-9619"
# v1 is a NAMED error since SPRINT-128 (ADR-046), never a count -- even beside an unrelated docs/work store.
# must-FAIL against the old reaper, which counted the inline Plan boxes (`1 of 3`) and said nothing.
case_fx "v1-is-named-unsupported-beside-store" "v1-with-unrelated-store" "T1 · done · a
T2 · done · b" \
  "run · 0 of 0 DoD ticked  [mechanical]" "v1 sprint unsupported since 2.0 (ADR-046)"

# --- USER_STOP: a signal caught by the detached wrapper (SPRINT-122 T1 · TASK-423) ----------------
# The wrapper is `night-run.sh --wrap` (the process the launcher prints as `fired detached: pid=`).
# Only a signal IT catches is a human stop; a bare child exit, or a TERM sent straight to the child
# (the watchdog's way, exit 143), stays HARD_FAILURE. Fixtures drive the real --wrap, bounded: every
# wait is a capped poll and every background pid is killed on the way out.
wait_for() { # <file> : up to ~10 s
  n=0; while [ ! -e "$1" ] && [ "$n" -lt 100 ]; do sleep 0.1; n=$((n + 1)); done; [ -e "$1" ]
}
# case_wrap <label> <want-terminal> <how: term-wrapper|exit3|term-child> <log-body> [<pattern>...]
case_wrap() {
  label=$1; want=$2; how=$3; body=$4; shift 4
  d="$work/$label"
  mk_v2 "$d" " "
  printf '# log\n%s\n' "$body" > "$d/docs/sprint/logs/SPRINT-960-fx.md"
  doc="$d/docs/sprint/logs/SPRINT-960-fx.md"
  cpid=""; wstart=1760180000   # the run id the wrapper binds its stop marker to
  if [ "$how" = exit3 ]; then
    sh "$launcher" --wrap "$d/run.log" "$d/run.log.exit" "$d" "$wstart" 0 "" 1 -- sh -c 'exit 3' &
  elif [ "$how" = term-wrapper-slowchild ]; then
    # the child catches TERM itself, lingers ~1 s, then exits 7
    sh "$launcher" --wrap "$d/run.log" "$d/run.log.exit" "$d" "$wstart" 0 "" 1 -- sh -c 'echo $$ >"$0"; trap "sleep 1; exit 7" TERM; sleep 30 & wait' "$d/child.pid" &
  else
    sh "$launcher" --wrap "$d/run.log" "$d/run.log.exit" "$d" "$wstart" 0 "" 1 -- sh -c 'echo $$ >"$0"; exec sleep 30' "$d/child.pid" &
  fi
  wpid=$!
  if [ "$how" != exit3 ]; then
    wait_for "$d/child.pid" || echo "note($label): child never recorded its pid"
    cpid=$(cat "$d/child.pid" 2>/dev/null)
    sleep 0.3
    if [ "$how" != term-child ]; then kill -TERM "$wpid" 2>/dev/null; else kill -TERM "$cpid" 2>/dev/null; fi
  fi
  n=0; while kill -0 "$wpid" 2>/dev/null && [ "$n" -lt 100 ]; do sleep 0.1; n=$((n + 1)); done
  if kill -0 "$wpid" 2>/dev/null; then kill -KILL "$wpid" 2>/dev/null; echo "note($label): wrapper hung, killed"; fi
  [ -n "$cpid" ] && kill -KILL "$cpid" 2>/dev/null
  got=$(grep -oE '^terminal · [A-Z_]+' "$doc" 2>/dev/null | sed 's/^terminal · //')
  miss=""
  for pat in "$@"; do grep -qF -- "$pat" "$doc" || miss="$miss [$pat]"; done
  if [ -n "${want_ec:-}" ] && [ "$(cat "$d/run.log.exit" 2>/dev/null)" != "$want_ec" ]; then
    miss="$miss [exit file holds '$(cat "$d/run.log.exit" 2>/dev/null)', wanted $want_ec]"
  fi
  if [ "$got" = "$want" ] && [ -z "$miss" ]; then
    echo "PASS fixture($label): terminal · $got"
  else
    echo "FAIL fixture($label): got '${got:-<none>}', wanted '$want'${miss:+ -- missing$miss}"
    fail=1
  fi
}
# must-FAIL against the pre-wrapper code: the TERM'd wrapper yields USER_STOP, PARTIAL, and every field
# the reaper emits for the other four states (the field list is reap()'s own emitted block).
case_wrap "wrapper-term-is-user-stop" "USER_STOP" term-wrapper "" \
  "run-complete" "run · 0 of 1 DoD ticked  [mechanical]" \
  "outcome · PARTIAL · derived from terminal USER_STOP  [derived]" "terminal · USER_STOP · " \
  "tasks · 0 attempted / 0 completed / 1 total  [mechanical]" "parks · 0  [model-reported]" \
  "repair-cycles · 0  [model-reported]" "verification · none logged  [model-reported]" "warnings · " \
  "T1 · unattempted ·" "Calibration row (Part 4)"
# controls: a bare non-zero exit, and a TERM straight to the child (the watchdog), are NOT a human stop
case_wrap "wrapped-exit3-is-hard-failure" "HARD_FAILURE" exit3 "" "outcome · FAILED" "status 3"
case_wrap "term-to-child-is-hard-failure" "HARD_FAILURE" term-child "" "outcome · FAILED" "status 143"
# rank: a revise-ceiling breach outranks the stop marker
case_wrap "ceiling-breach-outranks-stop" "HARD_FAILURE" term-wrapper "T1 · retry · Spec: a → fixed
T1 · retry · Spec: b → fixed
T1 · done" "revise-loop-ceiling-exceeded"
# the exit file holds the CHILD's status (7), not the interrupted wait's 143, and the stop still reads USER_STOP
want_ec=7 case_wrap "stop-keeps-child-exit-status" "USER_STOP" term-wrapper-slowchild "" "terminal · USER_STOP · "
# rank: an unresolvable by-reference member outranks a stop marker, with its own named reason
d="$work/stop-unresolved-member"; mkdir -p "$d" && cp -R "$fxdir/v2-unresolved-member/." "$d/" && mkdir -p "$d/docs/sprint/logs"
printf '# log\nT1 · done · a\n' > "$d/docs/sprint/logs/SPRINT-961-v2.md"; : > "$d/run.log"; printf 'TERM 1760180000' > "$d/run.log.stop"; printf 143 > "$d/run.log.exit"
sh "$launcher" --reap "$d/run.log" "$d" 1760180000 0 "" >/dev/null 2>&1
if grep -q '^terminal · HARD_FAILURE · member DoD unreadable: SPRINT-MEMBER-UNRESOLVED' "$d/docs/sprint/logs/SPRINT-961-v2.md"; then
  echo "PASS fixture(stop-plus-unresolved-member-is-hard-failure): terminal · HARD_FAILURE, member reason named"
else
  echo "FAIL fixture(stop-plus-unresolved-member-is-hard-failure): $(grep '^terminal ·' "$d/docs/sprint/logs/SPRINT-961-v2.md")"; fail=1
fi

# TD-247 C3: the stop marker is bound to the run that wrote it. must-FAIL against the pre-change reaper
# (any marker was a stop). stale_stop <label> <marker> <warning-text>: a wrapped exit-3 run whose marker was
# left by another run (or carries no id), reaped as run 1760180000 -> HARD_FAILURE from the log, marker named.
stale_stop() {
  label=$1; marker=$2; warn=$3
  d="$work/$label"; mk_v2 "$d" " "
  printf '# log\n' > "$d/docs/sprint/logs/SPRINT-960-fx.md"; : > "$d/run.log"
  printf '%s' "$marker" > "$d/run.log.stop"; printf 3 > "$d/run.log.exit"
  sh "$launcher" --reap "$d/run.log" "$d" 1760180000 0 "" >/dev/null 2>&1
  doc="$d/docs/sprint/logs/SPRINT-960-fx.md"
  if grep -q '^terminal · HARD_FAILURE · wrapped process exited with status 3' "$doc" && grep '^warnings ·' "$doc" | grep -qF "$warn" && ! grep -q 'USER_STOP' "$doc"; then
    echo "PASS fixture($label): HARD_FAILURE from the log, marker ignored and named"
  else
    echo "FAIL fixture($label): $(grep '^terminal ·' "$doc") / $(grep '^warnings ·' "$doc")"; fail=1
  fi
}
stale_stop "stale-marker-foreign-id-is-not-user-stop" "TERM 1760099999" "stop marker ignored (id 1760099999 != run 1760180000)"
stale_stop "stale-marker-without-id-is-not-user-stop" "TERM" "stop marker ignored (no run id)"

# the wiring: the REAL launcher's fire site must hand the wrapper pid it prints a TERM-catching wrapper.
# Throwaway git repo + the gate-exception harness's clean qa stub; the command is a long sleep.
d="$work/fire-site"; gfx="$here/fixtures/night-run-gate-exceptions"
mkdir -p "$d/scripts" "$d/docs/sprint/logs"; ( cd "$d" && git init -q ) || { echo "FAIL harness: git init"; exit 2; }
cp "$gfx/scripts/qa-check-clean.sh" "$d/scripts/qa-check.sh"; cp "$gfx/sprints/clean.md" "$d/docs/sprint/SPRINT-990-fx.md"
printf '# SPRINT-990 fx -- Execution Log\n' >"$d/docs/sprint/logs/SPRINT-990-fx.md"
# output goes to a FILE: the wrapper inherits the launcher's stdout, so a $(...) capture would block until it exits
( cd "$d" && sh "$launcher" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" --log "$d/run.log" \
  --wait-seconds 1 --poll-seconds 1 --no-reap -- sh -c 'echo $$ >"$0"; exec sleep 30' "$d/child.pid" --permission-mode dontAsk --allowedTools Bash ) >"$d/launcher.out" 2>&1
fs_out=$(cat "$d/launcher.out")
fs_pid=$(printf '%s\n' "$fs_out" | sed -n 's/.*fired detached: pid=\([0-9]*\).*/\1/p')
wait_for "$d/child.pid" >/dev/null; fs_cpid=$(cat "$d/child.pid" 2>/dev/null)
[ -n "$fs_pid" ] && kill -TERM "$fs_pid" 2>/dev/null
n=0; while [ ! -e "$d/run.log.exit" ] && [ "$n" -lt 100 ]; do sleep 0.1; n=$((n + 1)); done
[ -n "$fs_pid" ] && kill -KILL "$fs_pid" 2>/dev/null; [ -n "$fs_cpid" ] && kill -KILL "$fs_cpid" 2>/dev/null
if printf '%s' "$(cat "$d/run.log.stop" 2>/dev/null)" | grep -qE '^TERM [0-9]+$'; then
  echo "PASS fixture(fire-site-wrapper-catches-term): pid=$fs_pid left run.log.stop = $(cat "$d/run.log.stop")"
else
  echo "FAIL fixture(fire-site-wrapper-catches-term): pid='${fs_pid:-<none>}' stop marker='$(cat "$d/run.log.stop" 2>/dev/null)' -- output: $fs_out"; fail=1
fi

# --- the rollup block carries the run's non-green lines (SPRINT-122 T2 scope-change) --------------
# check-night-run-rollup.ts reads ONLY the last run-complete block, and for AUTHORITY_BOUNDARY demands
# a `Tn · parked-hitl|blocked ·` line INSIDE it (ADR-016: a park is one line inside the rollup block).
# reap() used to copy only `unattempted`, so every reaped AUTHORITY_BOUNDARY run failed its own guard.
# blk <label> <t1-box> <t2-box> <log-body> [<base>] -- builds a v2 two-member tree, reaps it, sets $bdoc
blk() {
  bl=$1; b1=$2; b2=$3; bbody=$4; bbase=${5:-0}
  d="$work/$bl"; mk_v2 "$d" "$b1" "$b2"
  bdoc="$d/docs/sprint/logs/SPRINT-960-fx.md"
  printf '%s\n' "$bbody" > "$bdoc"; : > "$d/run.log"
  sh "$launcher" --reap "$d/run.log" "$d" "" "$bbase" "" >/dev/null 2>&1
}
# the LAST run-complete entry only (what the guard reads)
lastblock() { # awk is fed on stdin: on this Windows host gawk itself intermittently fails to open a just-written /tmp file (seen even with retries); cat does not
  cat "$1" | awk '/^### .*\| run-complete \| run exited/{b=""} {b=b $0 "\n"} END{printf "%s", b}'
}
chk() { # <label> <ok-condition-rc> <detail>
  if [ "$2" -eq 0 ]; then echo "PASS fixture($1): $3"; else echo "FAIL fixture($1): $3"; fail=1; fi
}
# M1 (must-FAIL on the old reaper): a parked task is copied into the block, and the real guard PASSes
blk "block-copies-park" "x" " " "# log
T1 · done · a
T2 · parked-hitl · needs the owner's decision"
lastblock "$bdoc" | grep -qF 'T2 · parked-hitl · needs the owner'; r1=$?
gv=$(bun "$repo_root/scripts/lib/check-night-run-rollup.ts" "$bdoc" 2>&1); echo "$gv" | grep -q '^PASS'; r2=$?
chk "block-copies-park-guard-passes" $((r1 + r2)) "park in block rc=$r1; guard: $(echo "$gv" | head -1 | cut -c1-110)"
# C1 control: a clean ending copies nothing
blk "block-clean-copies-nothing" "x" "x" "# log
T1 · done · a
T2 · done · b"
n=$(lastblock "$bdoc" | grep -cE '^T[0-9]+ · '); lastblock "$bdoc" | grep -q '^terminal · PLAN_EXHAUSTED'
chk "block-clean-copies-nothing" $((n + $?)) "task lines in block: $n"
# C2 controls: a park BEFORE the base (an earlier run), and one inside a fence, are not this run's
blk "block-ignores-earlier-run" "x" " " "# log
T2 · parked-hitl · from an earlier run
T1 · done · a" 2
n=$(lastblock "$bdoc" | grep -c 'parked-hitl'); lastblock "$bdoc" | grep -q '^T2 · unattempted'
chk "block-ignores-earlier-run" $((n + $?)) "parked lines copied: $n (want 0), T2 unattempted"
# K1: the block mirrors what the counters counted. A park written ONLY inside the run's own fenced rollup is
# counted by rp_parked (that reading predates this change), so it must be copied too -- else the terminal says
# AUTHORITY_BOUNDARY and the block carries no park line for the guard to find. Copied once.
blk "block-copies-counted-fenced-park" "x" " " "# log
T1 · done · a

### 2026-10-10 | progress | rollup
\`\`\`
T2 · parked-hitl · only inside a fence
\`\`\`"
lastblock "$bdoc" | grep -q '^terminal · AUTHORITY_BOUNDARY'; k1=$?
k2=$(lastblock "$bdoc" | grep -c 'T2 · parked-hitl · only inside a fence'); [ "$k2" -eq 1 ]; k2=$?
gv=$(bun "$repo_root/scripts/lib/check-night-run-rollup.ts" "$bdoc" 2>&1); echo "$gv" | grep -q '^PASS'; k3=$?
chk "block-copies-counted-fenced-park" $((k1 + k2 + k3)) "AUTHORITY_BOUNDARY=$k1 copied-once=$k2 guard=$k3 (0 = ok)"
# K2: the cut is anchored to the END of the header; a model header that merely CONTAINS the reaper's title
# and adds a suffix is not the reaper's, so its park line still counts
blk "block-header-suffix-not-cut" "x" " " "# log
T1 · done · a

### 2026-10-10 | run-complete | run exited — rollup emitted by the launcher (corrected)

T2 · parked-hitl · kept despite the look-alike header"
lastblock "$bdoc" | grep -q '^terminal · AUTHORITY_BOUNDARY'; s1=$?
lastblock "$bdoc" | grep -q '^parks · 1  '; s2=$?
chk "block-header-suffix-not-cut" $((s1 + s2)) "AUTHORITY_BOUNDARY=$s1 parks1=$s2 (0 = ok)"
# S6: every alternative of the copy regex is exercised
blk "block-copies-blocked" "x" " " "# log
T1 · done · a
T2 · blocked · waiting on an external credential"
lastblock "$bdoc" | grep -q '^terminal · AUTHORITY_BOUNDARY'; b1=$?
lastblock "$bdoc" | grep -qF 'T2 · blocked · waiting on an external credential'; b2=$?
gv=$(bun "$repo_root/scripts/lib/check-night-run-rollup.ts" "$bdoc" 2>&1); echo "$gv" | grep -q '^PASS'; b3=$?
chk "block-copies-blocked" $((b1 + b2 + b3)) "AUTHORITY_BOUNDARY=$b1 copied=$b2 guard=$b3 (0 = ok)"
blk "block-copies-stalled-and-denied" " " " " "# log
T1 · stalled · watchdog fired
T2 · denied-tool · dontAsk refused a call"
lastblock "$bdoc" | grep -q '^terminal · HARD_FAILURE'; h1=$?
lastblock "$bdoc" | grep -qF 'T1 · stalled · watchdog fired'; h2=$?
lastblock "$bdoc" | grep -qF 'T2 · denied-tool · dontAsk refused a call'; h3=$?
chk "block-copies-stalled-and-denied" $((h1 + h2 + h3)) "HARD_FAILURE=$h1 stalled=$h2 denied=$h3 (0 = ok)"
# C3: re-reaping a window that already holds a block with a copied (fenced) park line must not recount it
blk "block-recount" "x" " " "# log
T1 · done · a
T2 · parked-hitl · needs the owner"
sh "$launcher" --reap "$work/block-recount/run.log" "$work/block-recount" "" 0 "" >/dev/null 2>&1
lastblock "$bdoc" | grep -q '^parks · 1  '; chk "block-recount" $? "second reap over its own earlier block: $(lastblock "$bdoc" | grep '^parks ·')"
# R2 (Codex round 2): the same re-reap after the log went CRLF (a Windows checkout with core.autocrlf).
# The reaper's earlier header then ends in `\r`, which must not defeat the end-anchored cut.
blk "block-recount-crlf" "x" " " "# log
T1 · done · a
T2 · parked-hitl · needs the owner"
sed -i 's/$/\r/' "$bdoc"
sh "$launcher" --reap "$work/block-recount-crlf/run.log" "$work/block-recount-crlf" "" 0 "" >/dev/null 2>&1
lastblock "$bdoc" | grep -q '^parks · 1  '; chk "block-recount-crlf" $? "second reap over its own earlier CRLF block: $(lastblock "$bdoc" | grep '^parks ·')"
# M2 (must-FAIL if the reaper's cut is too broad): a MODEL-written `run-complete` entry is evidence, not
# the reaper's block. Its park line is the run's only T2 line, so it must still count and still be copied.
blk "block-keeps-model-runcomplete" "x" " " "# log
T1 · done · a

### 2026-10-10 | run-complete | T2 parked (rollup below)

T2 · parked-hitl · needs the owner's decision"
lastblock "$bdoc" | grep -q '^terminal · AUTHORITY_BOUNDARY'; m1=$?
lastblock "$bdoc" | grep -q '^parks · 1  '; m2=$?
lastblock "$bdoc" | grep -qF 'T2 · parked-hitl · needs the owner'; m3=$?
gv=$(bun "$repo_root/scripts/lib/check-night-run-rollup.ts" "$bdoc" 2>&1); echo "$gv" | grep -q '^PASS'; m4=$?
chk "block-keeps-model-runcomplete" $((m1 + m2 + m3 + m4)) "AUTHORITY_BOUNDARY=$m1 parks1=$m2 copied=$m3 guard=$m4 (0 = ok)"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "REAP-TERMINAL FIXTURES: all green"; else echo "REAP-TERMINAL FIXTURES: FAILURES above"; fi
exit $fail
