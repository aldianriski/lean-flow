#!/bin/sh
# run-night-run-gate-exception-fixtures.sh -- fixtures for the NAMED GATE-EXCEPTION mechanism in
# scripts/night-run.sh's Part 1 pre-flight qa-check.sh gate (TD-110, owner ruling at SPRINT-093 T3).
#
# --- what this guards --------------------------------------------------------------------------
# Before this task, night-run.sh died on ANY non-zero exit from scripts/qa-check.sh -- verified:
# `bypass` 0 occurrences, `--force` 0 (SPRINT-093 G2 A2). A Plan whose whole purpose is repairing a
# red gate could therefore never run (SPRINT-090 hit this for real). The owner's ruling: a run may
# fire against SPECIFIC, NAMED, PRE-APPROVED failing checks -- never a blanket bypass. This harness
# is the discrimination proof for that mechanism: it must let a run through when every failing check
# is named, and refuse it when even one is not, and refuse by default when no grant exists at all.
#
# --- both directions, plus the sibling controls that keep them honest (L-142) -------------------
#   covered    -- every FAIL line is named in gate_exceptions:            -> must PROCEED (ALIVE)
#   uncovered  -- one FAIL line ("knowledge index STALE") is NOT named    -> must REFUSE, naming it
#   absent     -- no gate_exceptions: field at all                       -> must REFUSE (no bypass by default)
#   short-pin  -- names correct, pin below git's 7-char floor            -> must REFUSE (weak pin = no grant)
#   placeholder-- the shipped template's own unfilled bracket            -> must REFUSE (absent, not a grant)
#   clean      -- 0 FAILing checks                                       -> must PROCEED, gate_exceptions: never read
# `covered` and `uncovered` share the IDENTICAL gate output (qa-check-two-fails.sh) and differ only
# in the sprint's own gate_exceptions: line -- that is what makes them siblings rather than two
# unrelated cases: whichever one breaks, the other is the control that proves the breakage is real
# and not the harness itself going dark.
#
# --- and the two L-058 traps: a pass reached by failing to look ---------------------------------
#   no-summary-line     -- the gate dies before printing 'QA-CHECK: N pass, M fail' at all
#   fail-count-no-lines -- the summary says 2 fail, but no 'FAIL  ...' line names either one
# Both must REFUSE. Falling through to "no unnamed check was found" on either would silently read
# an unparseable report as a clean one -- the exact false-negative shape this whole file exists to
# close (CLAUDE.md L-058).
#
# --- bounded retry (coordinator review, two findings) --------------------------------------------
# Finding 1 (pre-existing, this file's Layer): the REAPER'S mode gate tested a literal substring
# ("sprint-bulk") stale since SPRINT-088 T3 renamed the canonical mode to `overnight` -- firing the
# documented canonical form skipped the reaper silently, and check-authority.sh (T5) trusts the
# `terminal ·` line it writes as its ONLY unattended-mode signal. `reap-fires-on-canonical-overnight`
# below is the retained must-PASS proof: a `--mode overnight` run that never says "sprint-bulk"
# must still produce a rollup.
# Finding 2 (this mechanism's own defect): the ORIGINAL canonicalised-prefix match let qa-check.sh
# leg 13's three distinct per-file FAILs (file-not-found / ask-channel-probe-missing /
# park-record-instruction-missing) collapse to one shared name, so a grant naming that name silently
# pre-approved whichever of the three actually failed. The fix moved matching to the gate's FULL,
# VERBATIM FAIL line (never a truncated prefix) and `gate_exceptions:` to a newline-delimited block
# list (a punctuation delimiter can no longer safely join full lines -- qa-check.sh's own FAIL text
# routinely embeds ' · ' and '|'). `collision-*` below reproduces leg 13's exact shape and proves
# both the old vulnerability is closed (`collision-prefix-only-refuses`) and the new mechanism still
# discriminates named-vs-unnamed within it (`collision-partial-refuses` / `collision-all-covered`).
#
# --- the fire-time ledger line (SPRINT-118 T1, TD-122 + TD-124) -----------------------------------
# Cases 13-16 at the bottom ride this harness because it is the one that already drives the REAL launcher
# end to end through a throwaway repo. Every case that reaches the fire step needs a log to write the
# `fired · ` line into, so make_case seeds a minimal one.
#
# --- why a throwaway git-inited repo per case ----------------------------------------------------
# night-run.sh's gate block resolves `repo_root` via `git rev-parse --show-toplevel` and only runs
# the gate at all when `$repo_root/scripts/qa-check.sh` exists -- so exercising it needs a real
# (if empty) git repo, not merely a directory. `mktemp -d` + `git init -q`, no commit, is the same
# idiom and the same ~95ms cost run-git-availability-fixtures.sh already priced; this harness NEVER
# invokes the real scripts/qa-check.sh (~200-390s, TD-117) -- every case gets a canned stub instead,
# committed under evals/fixtures/night-run-gate-exceptions/ so the meaningful content (the stub
# output, the sprint frontmatter shapes) is retained (TD-012) even though the git scaffolding around
# it is rebuilt fresh each run.
#
# Retained deliberately: this outlives the task that wrote it (TD-012).
#
# Dependency-free POSIX sh (plus `git`, already required by night-run.sh itself). No network.
# Run bare: sh evals/run-night-run-gate-exception-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
launcher="$repo_root/scripts/night-run.sh"
fx="$here/fixtures/night-run-gate-exceptions"
. "$here/lib/harness-common.sh"

[ -f "$launcher" ] || { echo "FAIL harness: launcher not found at $launcher"; exit 2; }
[ -d "$fx" ] || { echo "FAIL harness: fixture dir not found at $fx"; exit 2; }
command -v git >/dev/null 2>&1 || { echo "FAIL harness: git not found on PATH"; exit 2; }

fail=0
work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$work"' EXIT INT TERM

# run_launcher <case-dir> [launcher-args...] -- fires the REAL launcher with cwd inside the
# case's throwaway repo, isolated in a subshell so this runner's own cwd is never disturbed.
run_launcher() {
  ld=$1; shift
  ( cd "$ld" && sh "$launcher" "$@" )
}

# make_case <label> <qa-check-stub> <sprint-fixture> -- scaffolds a throwaway git-inited repo,
# copies in the named stub as scripts/qa-check.sh and the named sprint fixture as the active
# sprint, and echoes the case dir.
make_case() {
  cl=$1; stub=$2; spr=$3
  d="$work/$cl"
  mkdir -p "$d/scripts" "$d/docs/sprint"
  ( cd "$d" && git init -q ) || { echo "FAIL harness: git init failed in $d"; exit 2; }
  cp "$fx/scripts/$stub" "$d/scripts/qa-check.sh"
  cp "$fx/sprints/$spr" "$d/docs/sprint/SPRINT-990-fx.md"
  # A promoted Plan always has an Execution Log (its promote entry creates it), and the launcher now
  # refuses to fire without one (SPRINT-118 T1, TD-122): every case here that reaches -- or is meant to be
  # refused AT -- the qa-check gate needs it present, or the earlier no-log refusal would shadow the finding
  # under test. Case 14 removes it again on purpose.
  mkdir -p "$d/docs/sprint/logs"
  printf '# SPRINT-990 fx -- Execution Log\n' > "$d/docs/sprint/logs/SPRINT-990-fx.md"
  printf '%s' "$d"
}

# make_case_tree <label> <qa-check-stub> <tree-name> -- like make_case, but for a fixture that
# carries a FULL docs/sprint/ tree (a Plan plus a pre-existing Execution Log) rather than a single
# sprint file -- needed for the reaper, which refuses to write into a log that does not already
# exist (night-run.sh reap(): "No Execution Log means the run never opened one"). Echoes the case
# dir.
make_case_tree() {
  cl=$1; stub=$2; tree=$3
  d="$work/$cl"
  mkdir -p "$d/scripts"
  ( cd "$d" && git init -q ) || { echo "FAIL harness: git init failed in $d"; exit 2; }
  cp "$fx/scripts/$stub" "$d/scripts/qa-check.sh"
  cp -r "$fx/$tree/docs" "$d/docs"
  printf '%s' "$d"
}

# Every case below shares the same launcher args: fast observation window (the fired command is a
# no-op `true`, so 2s/1poll is generous, not tight), dontAsk + a scoped allowlist (Part 1's other
# pre-flight items, satisfied so the run reaches the qa-check gate under test), --no-reap (the
# reaper is T1's territory, not this harness's). Each is passed as its OWN positional parameter,
# never a reconstructed string, so a space anywhere in $work (a real risk on some hosts' temp
# paths) can never split an argument in two.

# --- case 1: clean gate -> proceeds, gate_exceptions: never consulted --------------------------
d=$(make_case "clean" "qa-check-clean.sh" "clean.md")
run_case_anywhere "clean-gate-proceeds" 0 "ALIVE" -- \
  run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
    --wait-seconds 2 --poll-seconds 1 --no-reap -- true --permission-mode dontAsk --allowedTools Bash

# --- case 2 (must-PROCEED): every FAIL line named -> fires, naming the grant it used ------------
d=$(make_case "covered" "qa-check-two-fails.sh" "covered.md")
run_case_anywhere "named-check-proceeds" 0 "pre-approved by gate_exceptions" -- \
  run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
    --wait-seconds 2 --poll-seconds 1 --no-reap -- true --permission-mode dontAsk --allowedTools Bash

# --- case 3 (must-FAIL, the motivating case): one FAIL line unnamed -> refuses, naming it --------
d=$(make_case "uncovered" "qa-check-two-fails.sh" "uncovered.md")
run_case_anywhere "unnamed-check-refuses" 1 "NOT on the pre-approved exception list: knowledge index STALE" -- \
  run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
    --wait-seconds 2 --poll-seconds 1 --no-reap -- true --permission-mode dontAsk --allowedTools Bash

# --- case 4 (must-FAIL): no gate_exceptions: at all -> refuses (no blanket bypass by default) ----
d=$(make_case "absent" "qa-check-two-fails.sh" "absent.md")
run_case_anywhere "no-grant-refuses" 1 "NOT on the pre-approved exception list" -- \
  run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
    --wait-seconds 2 --poll-seconds 1 --no-reap -- true --permission-mode dontAsk --allowedTools Bash

# --- case 5 (must-FAIL): names correct, pin below the 7-char floor -> refuses --------------------
d=$(make_case "short-pin" "qa-check-two-fails.sh" "short-pin.md")
run_case_anywhere "short-pin-refuses" 1 "NOT on the pre-approved exception list" -- \
  run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
    --wait-seconds 2 --poll-seconds 1 --no-reap -- true --permission-mode dontAsk --allowedTools Bash

# --- case 6 (must-FAIL): the shipped template's own unfilled placeholder -> refuses --------------
d=$(make_case "placeholder" "qa-check-two-fails.sh" "placeholder.md")
run_case_anywhere "placeholder-refuses" 1 "NOT on the pre-approved exception list" -- \
  run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
    --wait-seconds 2 --poll-seconds 1 --no-reap -- true --permission-mode dontAsk --allowedTools Bash

# --- case 7 (must-FAIL, L-058): no readable QA-CHECK summary line at all -> refuses --------------
d=$(make_case "no-summary" "qa-check-no-summary.sh" "absent.md")
run_case_anywhere "unparseable-summary-refuses" 1 "no readable 'QA-CHECK: N pass, M fail' summary line" -- \
  run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
    --wait-seconds 2 --poll-seconds 1 --no-reap -- true --permission-mode dontAsk --allowedTools Bash

# --- case 8 (must-FAIL, L-058 one level down): summary says 2 fail, no FAIL line names either ----
d=$(make_case "no-fail-lines" "qa-check-fail-count-no-lines.sh" "absent.md")
run_case_anywhere "fail-count-with-no-lines-refuses" 1 "printed no 'FAIL  ...' line naming them" -- \
  run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
    --wait-seconds 2 --poll-seconds 1 --no-reap -- true --permission-mode dontAsk --allowedTools Bash

# --- case 9 (must-PASS, Finding 1's retained proof): canonical `overnight` form -> reap fires ----
# No --no-reap here -- this is exactly the shape the pre-existing defect broke: a trigger that never
# says the literal word "sprint-bulk" anywhere. reap() runs ASYNCHRONOUSLY, chained after the fired
# command's exit code is recorded and after the launcher has already printed ALIVE and returned, so
# this polls the log briefly rather than asserting immediately.
d=$(make_case_tree "reap-mode-canonical" "qa-check-clean.sh" "reap-mode-canonical")
r9_out=$(run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
  --wait-seconds 2 --poll-seconds 1 -- true --permission-mode dontAsk --allowedTools Bash 2>&1)
r9_rc=$?
r9_logdoc="$d/docs/sprint/logs/SPRINT-990-fx.md"
r9_found=0
r9_i=0
while [ "$r9_i" -lt 20 ]; do
  grep -q '^terminal · ' "$r9_logdoc" 2>/dev/null && { r9_found=1; break; }
  r9_i=$((r9_i + 1))
  sleep 1
done
if [ "$r9_rc" -eq 0 ] && [ "$r9_found" -eq 1 ]; then
  echo "PASS fixture(reap-fires-on-canonical-overnight): terminal · line written after a --mode overnight run that never says 'sprint-bulk'"
else
  echo "FAIL fixture(reap-fires-on-canonical-overnight): launcher exit=$r9_rc, terminal-line-found=$r9_found -- reap must fire for any validated mode signal, not only literal 'sprint-bulk' text -- launcher output: $r9_out"
  fail=1
fi

# --- cases 10-12 (Finding 2, the collision family): leg 13's real three-siblings-one-prefix shape -
# All three share qa-check.sh's actual identical prefix "headless park-record cue <path>" before
# their first ': ' -- the exact text a pre-fix grant would have matched all three with.

# case 10 (must-FAIL, the motivating case): only one of three named -> refuses, naming another -----
d=$(make_case "collision-partial" "qa-check-headless-cue-collision.sh" "collision-partial.md")
run_case_anywhere "collision-partial-refuses" 1 "ask-channel probe (ToolSearch select:AskUserQuestion) missing" -- \
  run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
    --wait-seconds 2 --poll-seconds 1 --no-reap -- true --permission-mode dontAsk --allowedTools Bash

# case 11 (must-PASS, sibling control): all three named verbatim -> proceeds -----------------------
d=$(make_case "collision-all-named" "qa-check-headless-cue-collision.sh" "collision-all-named.md")
run_case_anywhere "collision-all-covered-proceeds" 0 "pre-approved by gate_exceptions" -- \
  run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
    --wait-seconds 2 --poll-seconds 1 --no-reap -- true --permission-mode dontAsk --allowedTools Bash

# case 12 (must-FAIL, proves the OLD vulnerability is closed): the shared prefix alone, exactly what
# a pre-fix canonicalised match would have equalled -> refuses all three, naming one -------------
d=$(make_case "collision-prefix-only" "qa-check-headless-cue-collision.sh" "collision-prefix-only.md")
run_case_anywhere "collision-prefix-only-refuses" 1 "NOT on the pre-approved exception list" -- \
  run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
    --wait-seconds 2 --poll-seconds 1 --no-reap -- true --permission-mode dontAsk --allowedTools Bash

# --- cases 13-17 (SPRINT-118 T1, TD-122 + TD-124): the FIRED line -------------------------------------
# night-run.sh appends `fired · <ISO-8601 UTC> · <mode>` at column 1 to the target sprint's Execution
# Log BEFORE the wrapped command runs, independent of reap(). Before this, a run that fired and died
# before the reaper left a log byte-identical to "no run happened" (TD-122), and check-authority.ts
# could only INFER attendedness (TD-124). The fired command is `touch <marker>` so "did it actually
# fire" is read off the filesystem, never off the launcher's own verdict (L-058): a refusal that still
# fired would pass an exit-code-only assertion.
#
# count_fired <logdoc> -- column-1 fired lines, 0 if the file is absent
count_fired() { grep -c '^fired · ' "$1" 2>/dev/null || true; }
# The fired command is `sh -c 'touch "$0"' <marker> ...`: <marker> becomes $0, so no path is ever spliced
# into script text, and every positional stays its own argument.

# case 13 (must-FIRE): the line lands once, ahead of the run, well-formed -----------------------------
d=$(make_case_tree "fired-line-written" "qa-check-clean.sh" "reap-mode-canonical")
r13_log="$d/docs/sprint/logs/SPRINT-990-fx.md"
r13_before=$(count_fired "$r13_log")
r13_out=$(run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
  --wait-seconds 2 --poll-seconds 1 --no-reap -- sh -c 'touch "$0"' "$d/marker" --permission-mode dontAsk --allowedTools Bash 2>&1)
r13_rc=$?
r13_after=$(count_fired "$r13_log")
r13_line=$(grep '^fired · ' "$r13_log" 2>/dev/null | head -n1)
if [ "$r13_rc" -eq 0 ] && [ -f "$d/marker" ] && [ "$r13_before" -eq 0 ] && [ "$r13_after" -eq 1 ] &&
   printf '%s\n' "$r13_line" | grep -qE '^fired · [0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z · overnight$'; then
  echo "PASS fixture(fired-line-written-once): exactly one well-formed fired line, run fired, --no-reap did not gate it"
else
  echo "FAIL fixture(fired-line-written-once): rc=$r13_rc marker=$([ -f "$d/marker" ] && echo yes || echo no) fired-lines before=$r13_before after=$r13_after line='$r13_line' -- the launcher must record a run FIRED at fire time, not only when the reaper later decides to append -- output: $r13_out"
  fail=1
fi

# case 14 (must-REFUSE, sibling of 13): the sprint resolves but its log does not exist ----------------
# Same tree as 13 minus the log. The launcher must not create one (reap() refuses to invent a record
# for the same reason) and must not fire.
d=$(make_case "fired-no-log" "qa-check-clean.sh" "clean.md")
rm -rf "$d/docs/sprint/logs"
r14_out=$(run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
  --wait-seconds 2 --poll-seconds 1 --no-reap -- sh -c 'touch "$0"' "$d/marker" --permission-mode dontAsk --allowedTools Bash 2>&1)
r14_rc=$?
if [ "$r14_rc" -eq 1 ] && printf '%s\n' "$r14_out" | grep -q 'DEAD-ON-ARRIVAL' && printf '%s\n' "$r14_out" | grep -q 'TD-122' &&
   [ ! -f "$d/marker" ] && [ ! -e "$d/docs/sprint/logs" ]; then
  echo "PASS fixture(fired-no-log-refuses): DOA naming TD-122, nothing fired, no log invented"
else
  echo "FAIL fixture(fired-no-log-refuses): rc=$r14_rc marker=$([ -f "$d/marker" ] && echo FIRED || echo none) logs-dir=$([ -e "$d/docs/sprint/logs" ] && echo CREATED || echo none) -- output: $r14_out"
  fail=1
fi

# case 15 (must-REFUSE): no sprint resolves at all (no --sprint, no active Plan) ----------------------
d="$work/fired-no-sprint"
mkdir -p "$d"
( cd "$d" && git init -q ) || { echo "FAIL harness: git init failed in $d"; exit 2; }
r15_out=$(run_launcher "$d" --mode overnight \
  --wait-seconds 2 --poll-seconds 1 --no-reap -- sh -c 'touch "$0"' "$d/marker" --permission-mode dontAsk --allowedTools Bash 2>&1)
r15_rc=$?
if [ "$r15_rc" -eq 1 ] && printf '%s\n' "$r15_out" | grep -q 'TD-122' && [ ! -f "$d/marker" ]; then
  echo "PASS fixture(fired-no-sprint-refuses): DOA naming TD-122, nothing fired"
else
  echo "FAIL fixture(fired-no-sprint-refuses): rc=$r15_rc marker=$([ -f "$d/marker" ] && echo FIRED || echo none) -- output: $r15_out"
  fail=1
fi

# case 16 (must-PASS): with the reaper ON, the fired line sits AHEAD of the rollup and the rollup still reads clean
# The reaper's own window is "lines appended since logdoc_base"; the fired line is written before that mark is
# measured so it is never part of what the run is judged on. Polls like case 9: reap() is asynchronous.
d=$(make_case_tree "fired-then-reaped" "qa-check-clean.sh" "reap-mode-canonical")
r16_log="$d/docs/sprint/logs/SPRINT-990-fx.md"
r16_out=$(run_launcher "$d" --mode overnight --sprint "$d/docs/sprint/SPRINT-990-fx.md" \
  --wait-seconds 2 --poll-seconds 1 -- true --permission-mode dontAsk --allowedTools Bash 2>&1)
r16_rc=$?
r16_found=0
r16_i=0
while [ "$r16_i" -lt 20 ]; do
  grep -q '^terminal · ' "$r16_log" 2>/dev/null && { r16_found=1; break; }
  r16_i=$((r16_i + 1))
  sleep 1
done
r16_fired_at=$(grep -n '^fired · ' "$r16_log" 2>/dev/null | head -n1 | cut -d: -f1)
r16_rollup_at=$(grep -n '| run-complete |' "$r16_log" 2>/dev/null | head -n1 | cut -d: -f1)
if [ "$r16_rc" -eq 0 ] && [ "$r16_found" -eq 1 ] && [ "$(count_fired "$r16_log")" -eq 1 ] &&
   [ -n "$r16_fired_at" ] && [ -n "$r16_rollup_at" ] && [ "$r16_fired_at" -lt "$r16_rollup_at" ]; then
  echo "PASS fixture(fired-precedes-rollup): one fired line, then the reaper's run-complete block"
else
  echo "FAIL fixture(fired-precedes-rollup): rc=$r16_rc terminal-found=$r16_found fired-at=${r16_fired_at:-none} rollup-at=${r16_rollup_at:-none} fired-count=$(count_fired "$r16_log") -- output: $r16_out"
  fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "PASS run-night-run-gate-exception-fixtures: all cases as expected"
else
  echo "FAIL run-night-run-gate-exception-fixtures: see FAIL lines above"
fi
exit "$fail"
