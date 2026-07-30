#!/bin/sh
# harness-common.sh -- shared plumbing for evals/run-*-fixtures.sh runners (TASK-124, SPRINT-038 T2).
#
# Generalises what T1's two runners (skill-freshness, worktree-usability) each hand-rolled: extract
# the real shipped snippet from a doc between stable markers (never a hand-copied duplicate that can
# drift), then assert exit code + a named-finding substring per fixture case. Sourced, not executed —
# `. "$(dirname "$0")/lib/harness-common.sh"` from a runner script.
set -u

# extract_between_anchors <doc> <start-anchor-literal> <end-anchor-literal> <out-file>
# Pulls the fenced snippet shipped between two `<!-- name:start/end -->` HTML-comment anchors (the
# pattern T1 shipped in night-run.md) and strips the ``` fence lines. Fails loud if nothing matches.
extract_between_anchors() {
  doc=$1; start=$2; end=$3; out=$4
  [ -f "$doc" ] || { echo "FAIL harness: doc not found at $doc"; exit 2; }
  awk -v s="$start" -v e="$end" '
    index($0, s) { f=1; next }
    index($0, e) { f=0 }
    f' "$doc" | grep -v '^```' > "$out"
  [ -s "$out" ] || { echo "FAIL harness: no snippet extracted between '$start' and '$end' in $doc"; exit 2; }
}

# extract_sole_fenced_block <doc> <fence-lang> <out-file>
# For a doc with exactly ONE ```<fence-lang> ... ``` block and no comment anchors around it (e.g.
# dispatch.md's pre-dispatch preflight, which predates the anchor convention and lives under
# skills/**, out of scope for this task to retrofit) -- extracts between the first ```<fence-lang>
# line and the next bare ``` line. Verifies uniqueness so a future second fenced block of the same
# language fails loud instead of silently extracting the wrong one.
extract_sole_fenced_block() {
  doc=$1; lang=$2; out=$3
  [ -f "$doc" ] || { echo "FAIL harness: doc not found at $doc"; exit 2; }
  count=$(grep -c "^\`\`\`$lang\$" "$doc")
  [ "$count" -eq 1 ] || {
    echo "FAIL harness: expected exactly one \`\`\`$lang fence in $doc, found $count -- extraction is no longer unambiguous"
    exit 2
  }
  awk -v lang="$lang" '
    $0 == "```" lang { f=1; next }
    f && $0 == "```" { exit }
    f' "$doc" > "$out"
  [ -s "$out" ] || { echo "FAIL harness: no snippet extracted from the sole \`\`\`$lang fence in $doc"; exit 2; }
}

# run_case_firstline <label> <want-exit> <want-finding-substring> -- <cmd...>
# Asserts exit code + the named finding on the CALLER-supplied command's first output line (the
# skill-freshness / worktree-usability check shape: one finding, printed first, before any exit).
# Sets/reads the shared `fail` variable the calling runner declares.
run_case_firstline() {
  label=$1; want_exit=$2; want_find=$3; shift 3
  [ "$1" = "--" ] && shift
  out=$("$@" 2>&1); got_exit=$?
  first_line=$(printf '%s\n' "$out" | head -n1)
  if [ "$got_exit" != "$want_exit" ]; then
    echo "FAIL fixture($label): exit $got_exit, expected $want_exit -- output: $first_line"
    fail=1
    return
  fi
  case "$first_line" in
    *"$want_find"*) echo "PASS fixture($label): exit $got_exit, finding matches '$want_find' -- $first_line" ;;
    *)
      echo "FAIL fixture($label): exit matched but finding missing '$want_find' -- got: $first_line"
      fail=1
      ;;
  esac
}

# run_case_anywhere <label> <want-exit> <want-finding-substring> -- <cmd...>
# Same contract as run_case_firstline, but the named finding may appear ANYWHERE in the command's
# output rather than only its first line -- needed for the dispatch preflight, whose base-ref /
# cycle / shared-file findings each surface on a different line of a multi-check report.
run_case_anywhere() {
  label=$1; want_exit=$2; want_find=$3; shift 3
  [ "$1" = "--" ] && shift
  out=$("$@" 2>&1); got_exit=$?
  if [ "$got_exit" != "$want_exit" ]; then
    echo "FAIL fixture($label): exit $got_exit, expected $want_exit -- output:"
    printf '%s\n' "$out"
    fail=1
    return
  fi
  case "$out" in
    *"$want_find"*) echo "PASS fixture($label): exit $got_exit, finding matches '$want_find'" ;;
    *)
      echo "FAIL fixture($label): exit matched but finding '$want_find' missing -- got:"
      printf '%s\n' "$out"
      fail=1
      ;;
  esac
}
