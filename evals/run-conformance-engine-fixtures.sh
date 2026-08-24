#!/bin/sh
# run-conformance-engine-fixtures.sh -- fixtures for scripts/lib/conformance-engine.sh (SPRINT-075
# T2), the engine's registry + mark-driven dispatch + report.
#
# One case per DoD line, must-FAIL where the DoD names a finding, PASS controls alongside so a
# checker regressed into always-failing is caught too (L-058). The doctored specs are edited COPIES
# of the real spec/STANDARD.md, never hand-written stubs -- a stub would test this harness's idea of
# the table, not the shipped one (same discipline as run-spec-reader-fixtures.sh /
# run-attestation-fixtures.sh).
#
# Retained deliberately: these outlive the task that wrote them (TD-012).
#
# Dependency-free POSIX sh, no git needed -- the engine itself needs none of it yet (T2 ships no
# assertions; T4/T6 add the first ones). Run bare: sh evals/run-conformance-engine-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
engine="$repo_root/scripts/lib/conformance-engine.sh"
spec="$repo_root/spec/STANDARD.md"
. "$here/lib/harness-common.sh"

[ -f "$engine" ] || { echo "FAIL harness: engine not found at $engine"; exit 2; }
[ -f "$spec" ]   || { echo "FAIL harness: spec not found at $spec"; exit 2; }

fail=0
work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$work"' EXIT INT TERM

# A throwaway target repo-dir -- the engine takes a directory, not necessarily a git repo (nothing
# T2 ships needs git). The point of every case here is the ENGINE's dispatch and report, never the
# target's content.
#
# WHY IT CARRIES §2's CORE SET (SPRINT-076 T3). Until T3 a lone README was enough, because no
# implemented rule had anything to say about a file's ABSENCE. `S2.F-FILE` does, and it is right to:
# a bare directory genuinely lacks eight of the nine files §2 marks "always". So the cases below --
# which assert that GAP lines do not set the exit code -- started failing on findings that were
# correct. That is a fixture going stale under new coverage, not a regression, and quietening
# `S2.F-FILE` to keep an old fixture green would be the tail wagging the dog (L-088).
#
# The set is derived from the SPEC, exactly as the engine derives it, so this cannot drift: a §2 row
# whose `Create ←` cell stops saying "always" changes both sides in the same edit.
core_set() {
  awk '
    /^## §2/ { in2 = 1; next }
    /^## §/  { in2 = 0 }
    !in2     { next }
    /^\*\*Conformance/        { in2 = 0; next }
    /^\*\*Root files/         { pfx = "";         next }
    /^\*\*AI context/         { pfx = ".claude/"; next }
    /^\*\*`docs\/` tree\*\*/  { pfx = "docs/";    next }
    /^\|/ {
      if ($0 ~ /^\|[ ]*File[ ]*\|/) next
      if ($0 ~ /^\|[-| ]*\|$/)      next
      n = split($0, c, "|"); if (n < 5) next
      file = c[2]; cre = (pfx == "docs/") ? c[6] : c[5]
      if (match(file, /`[^`]+`/)) p = substr(file, RSTART + 1, RLENGTH - 2); else next
      if (p ~ /[<>*]/) next
      if (cre ~ /always/) print pfx p
    }' "$1"
}
# base_tier_set <spec> -- the docs §6 makes every dev repo owe that are NOT already `always` rows.
# Derived exactly as the engine derives it -- §2's Tier column for the assignment, §6's own
# substrate-conditional clause for the subtraction -- so a spec edit moves both sides together and
# this cannot drift into testing the harness's idea of the table (SPRINT-078 T2).
base_tier_set() {
  _sub=$(awk '
    /^## /{h=$0; sub(/^## [^0-9]*/,"",h); sec=h+0}
    sec==6 && /^\| \*\*Base\*\*/ {
      i = index($0, "substrate-conditional"); if (i == 0) next
      t = substr($0, i)
      while (match(t, /`[^`]+`/)) { print substr(t, RSTART+1, RLENGTH-2); t = substr(t, RSTART+RLENGTH) }
    }' "$1" | while read -r _st; do
      # Brace expansion, done the way the engine does it -- `deployment/{deployment,rollback}-guide`
      # is TWO paths, each keeping the prefix AND the suffix. A cheaper sed that split on the comma
      # alone produced `deployment/deployment` and `rollback-guide`, which silently un-subtracted
      # deployment-guide and put a substrate-conditional row back into the owed set. Caught by this
      # helper's output disagreeing with the engine's `skipped not owed` line, which is the second
      # number this repo keeps being saved by.
      case "$_st" in
        *"{"*) _p=${_st%%\{*}; _m=${_st#*\{}; _a=${_m%%\}*}; _s=${_m#*\}}
               _o=$IFS; IFS=','
               for _x in $_a; do IFS=$_o; printf '%s%s%s\n' "$_p" "$_x" "$_s"; IFS=','; done
               IFS=$_o ;;
        *)     printf '%s\n' "$_st" ;;
      esac
    done)
  awk '
    /^## §2/ { in2=1; next }  /^## §/ { in2=0 }  !in2 { next }
    /^\*\*Conformance/       { in2=0; next }
    /^\*\*`docs\/` tree\*\*/ { intree=1; next }
    /^\*\*/                  { intree=0 }
    !intree { next }
    /^\|/ {
      if ($0 ~ /^\|[ ]*File[ ]*\|/) next
      if ($0 ~ /^\|[-| ]*\|$/) next
      n=split($0,c,"|"); if (n<7) next
      file=c[2]; tier=c[3]; cre=c[6]
      if (match(file, /`[^`]+`/)) p=substr(file,RSTART+1,RLENGTH-2); else next
      if (p ~ /[<>*]/) next
      if (cre ~ /always/) next
      if (tier !~ /base/) next
      print "docs/" p
    }' "$1" | while read -r _p; do
      _n=${_p#docs/}; _n=${_n%.*}; _b=${_n##*/}; _skip=0
      for _s in $_sub; do
        case "$_s" in
          */) case "$_n/" in "$_s"*) _skip=1 ;; esac ;;
          *) [ "$_n" = "$_s" ] && _skip=1; [ "$_b" = "$_s" ] && _skip=1 ;;
        esac
      done
      [ "$_skip" -eq 0 ] && printf '%s\n' "$_p"
    done
}

write_core_set() {   # write_core_set <dir>
  for p in $(core_set "$spec"); do
    mkdir -p "$1/$(dirname "$p")" 2>/dev/null
    # AGENTS.md and README.md are §3's TWO stated exceptions: each carries its ownership as a footer
    # <sub> line rather than a YAML block -- AGENTS.md because a 6-line header would defeat a ~10-line
    # pointer file, README.md because a top metadata table renders badly on the front-door. Writing
    # AGENTS.md with a header made S3.AGENTS fire against a fixture meant to be clean (SPRINT-075 T6);
    # README.md was still being written with one, and S2.R-README caught it the moment it shipped
    # (SPRINT-078 T3). Twice now the fixture, not the rule, was what needed teaching (L-088).
    case "$p" in
      AGENTS.md)
        printf -- '# AGENTS\n\nSee `.claude/CLAUDE.md`.\n\n<sub>Doc owner: Maintainer · last updated: 2026-08-20 · status: current</sub>\n' > "$1/$p"
        ;;
      README.md)
        printf -- '# Project\n\nFront door.\n\n<sub>Doc owner: Maintainer · last updated: 2026-08-20 · status: current</sub>\n' > "$1/$p"
        ;;
      *)
        printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When it changes\nstatus: current\n---\n\n# %s\n\nBody.\n' "${p##*/}" > "$1/$p"
        ;;
    esac
  done
}
# write_doc <path-under-dir> <dir> -- one conformant doc with §3's ownership header.
write_doc() {
  mkdir -p "$2/$(dirname "$1")" 2>/dev/null
  printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When it changes\nstatus: current\n---\n\n# %s\n\nBody.\n' "${1##*/}" > "$2/$1"
}

# write_base_tier <dir> -- the §6-Base docs that are NOT `always` rows. Added at SPRINT-078 T2 for
# the same reason write_core_set grew §2's core set at SPRINT-076 T3: a new rule started having
# something to say about these files' absence, and a fixture that goes stale under new coverage is
# fixed by teaching the fixture, never by quietening the rule (L-088).
write_base_tier() {
  for p in $(base_tier_set "$spec"); do write_doc "$p" "$1"; done
}

target="$work/target-repo"
mkdir -p "$target"
write_core_set "$target"
write_base_tier "$target"

# A second target that DOES have a real defect: one doc with no ownership header. Needed since
# SPRINT-075 T3 separated engine gaps from repository findings -- before that, any spec with an
# unimplemented rule produced a "finding" and a blocked level against ANY target, so a repo with
# nothing wrong could not be told apart from one with something wrong. The cases below that assert a
# blocked level or a non-zero exit now need an actual defect, which is the point.
target_bad="$work/target-repo-with-a-defect"
mkdir -p "$target_bad/docs"
write_core_set "$target_bad"
write_base_tier "$target_bad"
printf '# Architecture\n\nNo ownership header, no update trigger.\n' > "$target_bad/docs/architecture.md"
# --- case 1 (must-report): a mechanical rule with no assertion is NAMED as a gap ------------------
# DoD 3, re-pointed at the gap class (SPRINT-075 T3). The contract this guards is unchanged and is the
# whole of L-058: a rule the spec states and the engine cannot answer must never be silently absent.
# What changed is only where the fact is counted -- a GAP line says something about THIS ENGINE, so it
# no longer sets the adopter's exit code or blocks the adopter's level.
run_case_anywhere "rule-unimplemented-is-named" 0 "rule-unimplemented" -- \
  sh "$engine" "$target" --spec "$spec"

# ...and the line carries the GAP label, not a FAIL one. Asserted separately from the text above for
# the reason T4 learned the hard way: a substring assertion cannot see a relabelled verdict, and the
# label IS the contract here -- FAIL would put our missing work back on the adopter's report.
out=$(sh "$engine" "$target" --spec "$spec" 2>&1); rc=$?
n_gap_lines=$(printf '%s\n' "$out" | grep -c '^GAP   ')
n_fail_lines=$(printf '%s\n' "$out" | grep -c '^FAIL  ')
if [ "$rc" -eq 0 ] && [ "$n_gap_lines" -gt 0 ] && [ "$n_fail_lines" -eq 0 ] &&
   printf '%s\n' "$out" | grep -q 'coverage:'; then
  echo "PASS fixture(gap-is-labelled-gap-and-does-not-set-exit): $n_gap_lines GAP line(s), 0 FAIL, exit 0, coverage line present"
else
  echo "FAIL fixture(gap-is-labelled-gap-and-does-not-set-exit): exit $rc, $n_gap_lines GAP, $n_fail_lines FAIL -- output:"
  printf '%s\n' "$out"; fail=1
fi

# A repo WITH a defect must still exit 1 and name it -- the separation must not have made the engine
# quiet, which is the failure mode the Plan warned about ("do not tune the engine to look quiet").
run_case_anywhere "real-finding-still-fails" 1 "ownership-header-missing: docs/architecture.md" -- \
  sh "$engine" "$target_bad" --spec "$spec"

# --- case 2 (PASS control): judgment-only / implementation-directed never produce a verdict line --
# DoD 2. S1.LAW1 (judgment-only) and S13.NOINFER (implementation-directed) are real rules in the
# shipped spec. Neither may appear as a PASS or FAIL line -- only as an excluded/judgment-required
# note -- because emitting either as a verdict is a finding no adopter could ever clear (§14).
out=$(sh "$engine" "$target" --spec "$spec" 2>&1)
if printf '%s\n' "$out" | grep -qE '^(PASS|FAIL)  S1\.LAW1' ||
   printf '%s\n' "$out" | grep -qE '^(PASS|FAIL)  S13\.NOINFER'; then
  echo "FAIL fixture(judgment-and-impl-directed-never-verdicts): a judgment-only or implementation-directed rule produced a PASS/FAIL line"
  fail=1
elif printf '%s\n' "$out" | grep -qE 'S1\.LAW1 *-- judgment-required' &&
     printf '%s\n' "$out" | grep -qE 'S13\.NOINFER *-- excluded by mark: implementation-directed'; then
  echo "PASS fixture(judgment-and-impl-directed-never-verdicts): both reported, neither as a verdict"
else
  # Reached when the rules produced no verdict line AND no correct note either -- e.g. a mark arm
  # removed, dropping them into the unclassified path. Written as an explicit arm because the earlier
  # `grep && grep && echo` chain SHORT-CIRCUITED SILENTLY here: it could print PASS or print nothing,
  # never FAIL, and `fail` was left unset. A case that goes quiet exactly when its subject regresses
  # cannot tell "passed" from "never ran" (L-103) -- found by seeding the missing-arm break (L-137).
  echo "FAIL fixture(judgment-and-impl-directed-never-verdicts): neither a verdict line nor the expected judgment-required/excluded notes -- output:"
  printf '%s\n' "$out" | grep -E 'S1\.LAW1|S13\.NOINFER'
  fail=1
fi

# --- case 3 (PASS control, mark-driven dispatch, forward direction) -------------------------------
# DoD 1. S13.NOINFER is implementation-directed in the real spec and today never evaluated. Re-marked
# `mechanical` in a spec COPY, with NO code change to the engine, it must flip to rule-unimplemented
# -- proving the exclusion is read from the Mark column each run, never a remembered id list (the
# same shape SPRINT-074 used for check-attestation.sh's mark-derived-exclusion case, one level up).
awk '
  /^\| `S13\.NOINFER` \|/ { print "| `S13.NOINFER` | Attested | **mechanical** | re-marked by the fixture |"; next }
  { print }
' "$spec" > "$work/spec-remark-to-mechanical.md"
out=$(sh "$engine" "$target" --spec "$work/spec-remark-to-mechanical.md" 2>&1); rc=$?
if printf '%s\n' "$out" | grep -qE '^GAP   S13\.NOINFER *-- rule-unimplemented'; then
  echo "PASS fixture(mark-driven-forward): re-marking S13.NOINFER mechanical made the engine dispatch it -- no code change"
else
  echo "FAIL fixture(mark-driven-forward): exit $rc; S13.NOINFER did not flip to rule-unimplemented -- output:"
  printf '%s\n' "$out"; fail=1
fi

# --- case 4 (PASS control, mark-driven dispatch, reverse direction) -------------------------------
# S1.LAW2 is mechanical in the real spec (unimplemented today, so it reports rule-unimplemented).
# Re-marked `implementation-directed` in a spec COPY, it must flip to excluded-by-mark and stop
# producing a FAIL line -- the same claim, proven in the other direction.
awk '
  /^\| `S1\.LAW2` \|/ { print "| `S1.LAW2` | Structural | **implementation-directed** | re-marked by the fixture |"; next }
  { print }
' "$spec" > "$work/spec-remark-to-impldirected.md"
out=$(sh "$engine" "$target" --spec "$work/spec-remark-to-impldirected.md" 2>&1)
if printf '%s\n' "$out" | grep -qE 'S1\.LAW2 *-- excluded by mark: implementation-directed' &&
   ! printf '%s\n' "$out" | grep -qE '^(PASS|FAIL)  S1\.LAW2'; then
  echo "PASS fixture(mark-driven-reverse): re-marking S1.LAW2 implementation-directed stopped the engine dispatching it -- no code change"
else
  echo "FAIL fixture(mark-driven-reverse): S1.LAW2 still produced a verdict after being re-marked -- output:"
  printf '%s\n' "$out"; fail=1
fi


# --- case 4a (PASS control, the `restated` mark, SPRINT-079 T1) -----------------------------------
# `restated` says the constraint is carried by ANOTHER rule and checked under that id -- so the rule
# must be excluded by mark, never reported as a gap someone can close. S1.LAW2 is mechanical and
# unimplemented in the real spec, so before this arm existed it fell to the `*)` catch-all and said
# `unrecognized mark`, which reads to an adopter as a defect in the standard. Both halves are
# asserted: the named exclusion appears AND the catch-all wording does not.
awk '
  /^\| `S1\.LAW2` \|/ { print "| `S1.LAW2` | Structural | **restated** | re-marked by the fixture |"; next }
  { print }
' "$spec" > "$work/spec-remark-to-restated.md"
out=$(sh "$engine" "$target" --spec "$work/spec-remark-to-restated.md" 2>&1)
if printf '%s\n' "$out" | grep -qE 'S1\.LAW2 *-- excluded by mark: restated' &&
   ! printf '%s\n' "$out" | grep -qE 'S1\.LAW2 *-- (unrecognized mark|rule-unimplemented)' &&
   ! printf '%s\n' "$out" | grep -qE '^(PASS|FAIL)  S1\.LAW2'; then
  echo "PASS fixture(mark-restated): re-marking S1.LAW2 restated excluded it by name -- not a gap, not unrecognized"
else
  echo "FAIL fixture(mark-restated): S1.LAW2 did not report as excluded-by-mark restated -- output:"
  printf '%s\n' "$out"; fail=1
fi

# --- case 4b (PASS control, the `standard-directed` mark, SPRINT-079 T1) --------------------------
# Same claim for the second mark added at 0.6.0. Kept as its own case rather than folded into 4a:
# they are two independent `case` arms, and one arm deleted while the other survives must redden
# exactly one line here (L-058 -- a finding per check, not a check per family).
awk '
  /^\| `S1\.LAW2` \|/ { print "| `S1.LAW2` | Structural | **standard-directed** | re-marked by the fixture |"; next }
  { print }
' "$spec" > "$work/spec-remark-to-stddirected.md"
out=$(sh "$engine" "$target" --spec "$work/spec-remark-to-stddirected.md" 2>&1)
if printf '%s\n' "$out" | grep -qE 'S1\.LAW2 *-- excluded by mark: standard-directed' &&
   ! printf '%s\n' "$out" | grep -qE 'S1\.LAW2 *-- (unrecognized mark|rule-unimplemented)' &&
   ! printf '%s\n' "$out" | grep -qE '^(PASS|FAIL)  S1\.LAW2'; then
  echo "PASS fixture(mark-standard-directed): re-marking S1.LAW2 standard-directed excluded it by name"
else
  echo "FAIL fixture(mark-standard-directed): S1.LAW2 did not report as excluded-by-mark standard-directed -- output:"
  printf '%s\n' "$out"; fail=1
fi

# --- case 4c (must-FAIL: no rule may fall to the catch-all, SPRINT-079 T1) ------------------------
# The regression this pair exists to prevent. Against the SHIPPED spec, every mark value must have an
# arm: a single `unrecognized mark` line means the spec introduced a mark the engine cannot name, and
# an adopter's report then advertises our own inconsistency. This is the case that would have failed
# the moment T1's eleven re-marks landed without the arms -- which is precisely the half-shipped
# state the scope-change ruling refused (TD-001, L-007).
out=$(sh "$engine" "$target" --spec "$spec" 2>&1)
if ! printf '%s\n' "$out" | grep -qE 'unrecognized mark'; then
  echo "PASS fixture(no-unrecognized-mark): every mark value in the shipped spec has an engine arm"
else
  echo "FAIL fixture(no-unrecognized-mark): the shipped spec carries a mark the engine cannot name --"
  printf '%s\n' "$out" | grep -E 'unrecognized mark' | sed 's/^/    /'; fail=1
fi
# --- case 5 (must-FAIL + PASS, the registry actually calls a registered assertion) -----------------
# Cases 1-4 only exercise the "no assertion found" branch. This case proves the OTHER branch: when
# `assert_<id>` IS defined, the driver calls it and its own verdict (not a generic rule-unimplemented)
# is what the report carries. A copy of the shipped engine gets one PASSING and one FAILING test
# assertion appended at the registry's insertion point -- the driver code under test is byte-identical
# to the shipped file; only the registry gains two functions, which is exactly how T4/T6 are meant to
# extend it.
grep -q '^# registry:insert-point$' "$engine" || { echo "FAIL harness: registry:insert-point anchor not found in $engine"; fail=1; }
# The doctored engine resolves its reader BESIDE ITSELF (D1's own rule -- the copy must carry a copy
# of the reader too, or it fails reader-missing rather than proving anything about the registry).
cp "$repo_root/scripts/lib/read-spec-rules.sh" "$work/read-spec-rules.sh"
awk '
  /^# registry:insert-point$/ {
    print
    print "assert_S1_TESTOK() { ok \"S1.TESTOK -- fixture-only assertion, always passes\"; }"
    print "assert_S1_TESTBAD() { bad \"S1.TESTBAD -- fixture-injected-failure: a deliberately failing test assertion\"; }"
    next
  }
  { print }
' "$engine" > "$work/engine-with-test-rules.sh"
awk '
  /^\| `S1\.LAW2` \|/ {
    print
    print "| `S1.TESTOK` | Structural | `mechanical` | fixture-injected passing rule |"
    print "| `S1.TESTBAD` | Structural | `mechanical` | fixture-injected failing rule |"
    next
  }
  { print }
' "$spec" > "$work/spec-with-test-rules.md"
out=$(sh "$work/engine-with-test-rules.sh" "$target" --spec "$work/spec-with-test-rules.md" 2>&1); rc=$?
if [ "$rc" -eq 1 ] &&
   printf '%s\n' "$out" | grep -qE '^PASS  S1\.TESTOK *-- fixture-only assertion, always passes' &&
   printf '%s\n' "$out" | grep -qE '^FAIL  S1\.TESTBAD *-- fixture-injected-failure'; then
  echo "PASS fixture(registered-assertion-dispatched): a defined assert_<id> is called and its own verdict (not rule-unimplemented) is reported, for both a PASS and a FAIL"
else
  echo "FAIL fixture(registered-assertion-dispatched): exit $rc -- output:"
  printf '%s\n' "$out"; fail=1
fi
# The regression this case exists to catch: `fail` is a single flag, not a counter, so a naive
# before/after comparison across the WHOLE loop stops detecting new failures once ANY prior rule has
# failed (found live in this task -- SPRINT-075 T2). Confirms the FAILING test rule is still counted
# as ITS OWN failure (not silently absorbed) even though rule-unimplemented findings already fired
# earlier in the same run.
if printf '%s\n' "$out" | grep -qE '^FAIL  S1\.TESTBAD'; then
  echo "PASS fixture(per-rule-failure-not-absorbed): S1.TESTBAD's own FAIL line printed despite prior FAILs earlier in the same run"
else
  echo "FAIL fixture(per-rule-failure-not-absorbed): S1.TESTBAD's failure was absorbed by an earlier one -- output:"
  printf '%s\n' "$out"; fail=1
fi

# --- case 6 (must-FAIL): spec-table-unreadable propagates from the reader ---------------------------
printf '# not a standard\n\nNo conformance tables here.\n' > "$work/empty-spec.md"
run_case_anywhere "spec-table-unreadable" 1 "spec-table-unreadable" -- \
  sh "$engine" "$target" --spec "$work/empty-spec.md"

# --- case 7 (report states a level + the findings preventing the next one) -------------------------
# DoD 4. A reduced spec keeping §1's real 4-row table (position-anchored, window-scoped -- the
# reader's own technique) and stripping every OTHER section's rule rows, so the engine dispatches
# only §1: `S1.LAW1`/`S1.LAW4` (judgment-only, excluded) and `S1.LAW2`/`S1.LAW3` (mechanical/split,
# unimplemented). Both unimplemented rules are Structural, so the level line is predictable: Structural
# cannot be reached. The engine never calls --reconcile, so §14's now-mismatched counts are harmless.
awk '
  /^## / { h = $0; sub(/^## [^0-9]*/, "", h); sec = h + 0 }
  sec == 1 || $0 !~ /^\| `S[0-9]/ { print }
' "$spec" > "$work/spec-section1-only.md"
# Run against the DEFECTIVE target: since T3 separated the axes, an unimplemented rule no longer
# blocks a level, so a level line can only be exercised by a real finding. §1's S1.LAW3 (split,
# Structural) has an assertion as of T6 and fires update-trigger-absent on the header-less doc.
out=$(sh "$engine" "$target_bad" --spec "$work/spec-section1-only.md" 2>&1); rc=$?
if [ "$rc" -eq 1 ] && printf '%s\n' "$out" | grep -qE 'level: none -- Structural not yet reached'; then
  echo "PASS fixture(level-line-states-blocked-level): level: none, naming Structural as not yet reached"
else
  echo "FAIL fixture(level-line-states-blocked-level): exit $rc -- output:"
  printf '%s\n' "$out"; fail=1
fi

# --- case 8 (no score, grade or percentage anywhere) ------------------------------------------------
# DoD 5. Checked on the LARGEST run this suite makes (the real spec, all 100 rules) rather than a
# reduced one, so a stray literal introduced anywhere in the report has nowhere to hide. Grepped,
# never trusted (L-058): the header comments say "never a score" -- this is what checks it.
full_out=$(sh "$engine" "$target" --spec "$spec" 2>&1)
bad_tokens=0
printf '%s\n' "$full_out" | grep -q '%'                              && { echo "FAIL fixture(no-percentage): a literal % appears in the output"; bad_tokens=1; }
printf '%s\n' "$full_out" | grep -qi 'score'                         && { echo "FAIL fixture(no-score): the word 'score' appears in the output"; bad_tokens=1; }
printf '%s\n' "$full_out" | grep -qi 'grade'                         && { echo "FAIL fixture(no-grade): the word 'grade' appears in the output"; bad_tokens=1; }
printf '%s\n' "$full_out" | grep -qE '[0-9]+ */ *[0-9]+|[0-9]+ +of +[0-9]+' && { echo "FAIL fixture(no-ratio-shape): a N/M or N-of-M ratio shape appears in the output"; bad_tokens=1; }
if [ "$bad_tokens" -eq 0 ]; then
  echo "PASS fixture(no-score-grade-percentage-or-ratio): none of %, score, grade, or a ratio shape appear anywhere in the report"
else
  fail=1
fi

# --- case 9 (exit 0 clean / exit 1 findings, CI-usable, on the SAME repo) --------------------------
# DoD 6. Same target repo-dir both times; only the spec varies, so the target is held constant while
# the engine's own coverage is what changes -- proving the exit code tracks FINDINGS, not the target.
# "Clean" needs a spec with zero mechanical/split rules to dispatch (T2 ships no assertions, so any
# dispatched mechanical/split rule is unimplemented by construction) -- built from case 7's §1-only
# spec, with its two mechanical/split rows (`S1.LAW2`, `S1.LAW3`) also removed, leaving only the two
# judgment-only rows.
awk '
  /^\| `S1\.LAW2` \|/ { next }
  /^\| `S1\.LAW3` \|/ { next }
  { print }
' "$work/spec-section1-only.md" > "$work/spec-clean.md"
# [|] not \| -- GNU grep's BRE reads \| as ALTERNATION (a non-POSIX extension), which would make
# this match every line via the empty left branch, not a literal pipe. The bracket expression is the
# reader's own house technique for exactly this reason (read-spec-rules.sh's row anchor).
n_left=$(grep -c '^[|] *`S[0-9]' "$work/spec-clean.md")
[ "$n_left" -eq 2 ] || { echo "FAIL harness: spec-clean.md carries $n_left rule rows, expected exactly 2 (S1.LAW1, S1.LAW4)"; fail=1; }
run_case_anywhere "exit-0-clean" 0 "level: Attested" -- \
  sh "$engine" "$target" --spec "$work/spec-clean.md"
# Same target, a spec with ONE MORE row added -- a mechanical rule with no assertion.
awk '
  /^\| `S1\.LAW4` \|/ { print; print "| `S1.EXTRA` | Structural | `mechanical` | added by the fixture |"; next }
  { print }
' "$work/spec-clean.md" > "$work/spec-dirty.md"
# Exit 1 comes from a REPOSITORY finding, never from a gap (T3's separation). spec-dirty adds a
# mechanical rule with no assertion, which is now a GAP and must leave the exit code alone; the
# non-zero exit below is earned by S1.LAW3 firing on target_bad's header-less doc instead.
run_case_anywhere "gap-alone-does-not-set-exit" 0 "rule-unimplemented" -- \
  sh "$engine" "$target" --spec "$work/spec-dirty.md"
run_case_anywhere "exit-1-findings" 1 "update-trigger-absent: docs/architecture.md" -- \
  sh "$engine" "$target_bad" --spec "$work/spec-section1-only.md"

# Case 8's check ran only against the real spec, whose report never reaches the "level: Attested"
# branch (something is always unimplemented there) -- so that branch's own wording was never
# actually checked for a stray token. spec-clean.md above DOES reach it; check it here too.
clean_out=$(sh "$engine" "$target" --spec "$work/spec-clean.md" 2>&1)
clean_bad=0
printf '%s\n' "$clean_out" | grep -q '%'                              && { echo "FAIL fixture(no-percentage-attested-branch): a literal % appears in the clean/Attested-level report"; clean_bad=1; }
printf '%s\n' "$clean_out" | grep -qi 'score'                         && { echo "FAIL fixture(no-score-attested-branch): 'score' appears in the clean/Attested-level report"; clean_bad=1; }
printf '%s\n' "$clean_out" | grep -qi 'grade'                         && { echo "FAIL fixture(no-grade-attested-branch): 'grade' appears in the clean/Attested-level report"; clean_bad=1; }
if [ "$clean_bad" -eq 0 ]; then
  echo "PASS fixture(no-score-grade-percentage-attested-branch): the level:-Attested wording (only reachable on a clean spec) carries none of them either"
else
  fail=1
fi

# --- case 10 (must-FAIL, level-bucketing survives a PRIOR failure in document order) --------------
# The regression this case exists to catch (found live by seeding it, SPRINT-075 T2, L-137): if the
# per-level counters used a global before/after `$fail` comparison instead of a per-call flag,
# `$fail` is a single flag, not a counter -- once ANY earlier rule has failed, a LATER rule's own
# failure stops changing it, so that later rule is silently uncounted in ITS level's bucket. The
# danger is not a missing FAIL line (bad() always prints one, unconditionally) -- it is the LEVEL
# LINE inflating: a Gated-level rule injected BEFORE `S1.LAW2` in document order fails first, and
# with the bug, `S1.LAW2`'s own (Structural) failure never reaches struct_fail, so the closing line
# would read "level: Structural" -- claiming Structural is CLEARED while a Structural rule is failing
# on the very same report. Confirmed live: reverting to the before/after-$fail comparison reproduces
# exactly this misreport ("level: Structural -- 1 finding(s) at Gated..." with LAW2/LAW3 both still
# FAILing above it); restoring the per-call flag fixes it back to "level: none".
#
# REBUILT at T3: the original injected an UNIMPLEMENTED Gated rule to produce the earlier failure, and
# an unimplemented rule is now a GAP that deliberately fails nothing -- so the case would have gone on
# passing while testing nothing, the exact silent-decay this suite exists to prevent. It now injects a
# rule that really fails: `S3.SCHEMA` re-marked Gated and placed before `S1.LAW3` in document order
# (the id drives which assertion runs, the Level column drives which bucket counts it), run against the
# defective target so both rules genuinely fail.
awk '
  /^\| `S1\.LAW3` \|/ { print "| `S3.SCHEMA` | Gated | `mechanical` | injected: a REAL failure, earlier in document order |"; print; next }
  { print }
' "$work/spec-section1-only.md" > "$work/spec-level-bucket.md"
out=$(sh "$engine" "$target_bad" --spec "$work/spec-level-bucket.md" 2>&1); rc=$?
if [ "$rc" -eq 1 ] &&
   printf '%s\n' "$out" | grep -qE '^FAIL  update-trigger-absent' &&
   printf '%s\n' "$out" | grep -qE 'level: none -- Structural not yet reached'; then
  echo "PASS fixture(level-bucket-survives-prior-failure): a Gated failure earlier in document order did not mask S1.LAW2's later Structural failure -- level correctly stays 'none', not inflated to 'Structural'"
else
  echo "FAIL fixture(level-bucket-survives-prior-failure): exit $rc -- output:"
  printf '%s\n' "$out"; fail=1
fi


# ==================================================================================================
# §2/§6 TIER DOC-SET FAMILY (SPRINT-078 T2) -- one retained must-FAIL fixture per tier, each asserting
# THAT TIER'S named finding, plus a sibling control that must stay green.
#
# The four tiers do not all fire the same finding, and pretending they did would have been the easy
# lie. `tier-doc-set-incomplete` is Base's and Backend's, because those two have literal-path rows in
# §2 that a repo can be missing. Medium's rows are all FAMILIES (`adr/ADR-NNN-<slug>.md`,
# `flows/<slug>.md`) and a family cannot be missing. Multi-service has no §2 row at all, which is a
# hole in the standard and fires `tier-doc-set-underivable`. So: four tiers, four retained fixtures,
# three finding strings -- see the sprint's Execution Log for the DoD correction this forced.
# ==================================================================================================

tier_repo() {   # tier_repo <dir> [tier-token]
  mkdir -p "$1"; write_core_set "$1"; write_base_tier "$1"
  [ "$#" -ge 2 ] && printf '%s\n' "$2" > "$1/.conformance-tier"
  return 0
}

# --- Base: must-FAIL, and its control ------------------------------------------------------------
# No declaration on purpose: §6's trigger for Base is *every dev repo*, so Base is the one tier that
# must answer without one. A regression that made Base wait for a declaration would pass every other
# case in this file.
t_base="$work/tier-base-missing"
tier_repo "$t_base"
# THE VICTIM IS DERIVED, AND ITS EXISTENCE IS ASSERTED BEFORE IT IS REMOVED (L-146). A hard-coded
# `rm -f docs/product/requirements.md` would keep this case green after §2 renamed or dropped the row:
# the file would simply never have been there, the removal would be a no-op, and the "must-FAIL"
# assertion would pass for a reason that has nothing to do with the rule. `rm -f` cannot tell those
# apart, which is why the check is here and not in the flags.
base_victim=$(base_tier_set "$spec" | head -1)
[ -n "$base_victim" ] || { echo "FAIL harness(tier-base-incomplete): §6's Base tier derived an EMPTY unconditional set, so there is nothing to remove and this case would pass vacuously"; fail=1; }
[ -f "$t_base/$base_victim" ] || { echo "FAIL harness(tier-base-incomplete): derived victim '$base_victim' was never written, so removing it proves nothing (L-146)"; fail=1; }
rm -- "$t_base/$base_victim"
[ -e "$t_base/$base_victim" ] && { echo "FAIL harness(tier-base-incomplete): '$base_victim' survived removal"; fail=1; }
run_case_anywhere "tier-base-incomplete" 1 "tier-doc-set-incomplete: $base_victim" -- \
  sh "$engine" "$t_base" --spec "$spec"

t_base_ok="$work/tier-base-complete"
tier_repo "$t_base_ok"
out=$(sh "$engine" "$t_base_ok" --spec "$spec" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && ! printf '%s\n' "$out" | grep -q 'tier-doc-set-incomplete'; then
  echo "PASS fixture(tier-base-control): a complete Base doc set reports no tier finding, exit 0"
else
  echo "FAIL fixture(tier-base-control): exit $rc with a tier finding on a complete Base set -- output:"; printf '%s\n' "$out"; fail=1
fi

# --- the substrate rows are SKIPPED, not owed ----------------------------------------------------
# §6's own words. The control above already lacks `docs/testing/testing-guide.md` and every other
# substrate-conditional row -- write_base_tier deliberately does not write them -- so the case is
# simply that their absence produced no finding, and that they were NAMED rather than silently
# dropped. A skip nobody can see is indistinguishable from a pass.
if printf '%s\n' "$out" | grep -q 'substrate-conditional, skipped not owed' &&
   ! printf '%s\n' "$out" | grep -q 'tier-doc-set-incomplete: docs/testing/testing-guide.md'; then
  echo "PASS fixture(tier-substrate-skipped): substrate-conditional rows named as skipped, never as missing"
else
  echo "FAIL fixture(tier-substrate-skipped): a substrate-conditional row was reported missing, or the skip was silent -- output:"; printf '%s\n' "$out"; fail=1
fi


# --- Backend: must-FAIL, control, and the tier-below case ----------------------------------------
t_be="$work/tier-backend-missing"
tier_repo "$t_be" backend
# Backend's victim is derived too, though nothing is removed here: tier_repo never writes Backend's
# docs, so the absence is the fixture's initial state rather than an edit. The path is still read from
# the spec, so a §2 rename moves the assertion with it instead of leaving it asserting a string the
# standard no longer uses.
be_victim=$(awk '
  /^## §2/{in2=1;next} /^## §/{in2=0} !in2{next}
  /^\*\*Conformance/{in2=0;next}
  /^\*\*`docs\/` tree\*\*/{t=1;next} /^\*\*/{t=0} !t{next}
  /^\|/ { n=split($0,c,"|"); if (n<7) next
    f=c[2]; tier=c[3]; cre=c[6]
    if (match(f,/`[^`]+`/)) p=substr(f,RSTART+1,RLENGTH-2); else next
    if (p ~ /[<>*]/) next
    if (cre ~ /always/) next
    if (tier !~ /API exists/) next
    print "docs/" p; exit }' "$spec")
[ -n "$be_victim" ] || { echo "FAIL harness(tier-backend-incomplete): no Backend-tier row derived from §2, so this case would assert nothing"; fail=1; be_victim="docs/api/openapi.yaml"; }
[ -e "$t_be/$be_victim" ] && { echo "FAIL harness(tier-backend-incomplete): '$be_victim' exists in the fixture, so its absence cannot be what the finding reports"; fail=1; }
run_case_anywhere "tier-backend-incomplete" 1 "tier-doc-set-incomplete: $be_victim" -- \
  sh "$engine" "$t_be" --spec "$spec"

t_be_ok="$work/tier-backend-complete"
tier_repo "$t_be_ok" backend
write_doc "docs/architecture/data-flow.md"    "$t_be_ok"
write_doc "docs/architecture/integrations.md" "$t_be_ok"
write_doc "docs/api/openapi.yaml"             "$t_be_ok"
out=$(sh "$engine" "$t_be_ok" --spec "$spec" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && ! printf '%s\n' "$out" | grep -q 'tier-doc-set-incomplete'; then
  echo "PASS fixture(tier-backend-control): a complete Backend doc set reports no tier finding, exit 0"
else
  echo "FAIL fixture(tier-backend-control): exit $rc -- output:"; printf '%s\n' "$out"; fail=1
fi

# A repo BELOW a tier does not owe that tier's docs. This is the case that would catch a check which
# quietly made every tier cumulative-downward -- it would report Backend's docs against a Base repo,
# which is precisely the "telling a four-file JS library it owes docs/database/erd.md" failure the
# engine is on record refusing.
t_low="$work/tier-declared-base"
tier_repo "$t_low" base
out=$(sh "$engine" "$t_low" --spec "$spec" 2>&1); rc=$?
if [ "$rc" -eq 0 ] &&
   printf '%s\n' "$out" | grep -q "S6.BACKEND .*not evaluated: this repository declares tier 'base', below Backend" &&
   ! printf '%s\n' "$out" | grep -q 'tier-doc-set-incomplete: docs/api/openapi.yaml'; then
  echo "PASS fixture(tier-below-not-owed): a Base repo is not asked for Backend's doc set"
else
  echo "FAIL fixture(tier-below-not-owed): exit $rc -- output:"; printf '%s\n' "$out"; fail=1
fi

# --- Medium: DECISIONS.md is addressable, and substrate-gated so it cannot fire falsely ----------
# SPRINT-079 T3 REPLACED the `tier-medium-family` case that lived here. It asserted that every §2 row
# at Medium names a FAMILY -- true only while `DECISIONS.md` was reachable solely inside a pattern
# row's File cell, which is the defect T3 fixed. Splitting that row gives Medium a LITERAL row, so
# the old assertion is now false and the case would fail rather than decay quietly (L-146).
# Two claims, because the fix has two halves that can break independently:
#   (a) the engine ADDRESSES docs/DECISIONS.md -- it names it instead of saying it cannot;
#   (b) it does NOT demand it from a Medium repo that has taken no qualifying decision. §2 says
#       don't pre-create it before the first real entry, so an unconditional assertion here would be
#       a false positive -- and a false positive is a false negative about the contract (L-108).
t_med="$work/tier-medium"
tier_repo "$t_med" medium
out=$(sh "$engine" "$t_med" --spec "$spec" 2>&1); rc=$?
if printf '%s\n' "$out" | grep -q 'S6.MEDIUM .*substrate-conditional, skipped not owed.*docs/DECISIONS.md' &&
   ! printf '%s\n' "$out" | grep -q 'S6.MEDIUM .*cannot address' &&
   ! printf '%s\n' "$out" | grep -q 'S6.MEDIUM .*tier-doc-set-incomplete' &&
   ! printf '%s\n' "$out" | grep -q 'S6.MEDIUM .*tier-doc-set-underivable'; then
  echo "PASS fixture(tier-medium-decisions-addressable): docs/DECISIONS.md is named and substrate-gated -- addressable, and not demanded of a repo with no decisions"
else
  echo "FAIL fixture(tier-medium-decisions-addressable): exit $rc -- output:"; printf '%s\n' "$out"; fail=1
fi
# --- Multi-service: §2 carries the tier's rows, so the finding is about the REPO ------------------

# SPRINT-079 T2 REPLACED the case that used to live here. It asserted `tier-doc-set-underivable` --
# "§6 names a doc set §2 carries not one row for" -- which was a finding about the STANDARD that no
# adopter could ever clear. T2 closed that hole (two §2 rows + the rank-4 mapping the Tier cell had
# no branch for), so the old case would now fail rather than decay quietly into a vacuous pass. It is
# replaced, not deleted: the must-FAIL bar still holds, the finding it names is simply the right one.
t_ms="$work/tier-multisvc"
tier_repo "$t_ms" multi-service
run_case_anywhere "tier-multisvc-incomplete" 1 "tier-doc-set-incomplete: docs/architecture/service-registry.md" -- \
  sh "$engine" "$t_ms" --spec "$spec"

# --- Multi-service PASS control: the finding is actionable, not merely named ----------------------
# The other half of the same claim (SPRINT-075 T3's discipline): creating exactly what the findings
# asked for must clear them. A must-FAIL case alone cannot tell a real check from one that always
# fires, and an unclearable finding is the failure this task existed to fix.
mkdir -p "$t_ms/docs/architecture"
for f in service-registry service-dependencies; do
  printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-23\nupdate_trigger: a service changes\nstatus: current\n---\n\n# %s\n' "$f" > "$t_ms/docs/architecture/$f.md"
done
out=$(sh "$engine" "$t_ms" --spec "$spec" 2>&1)
if printf '%s\n' "$out" | grep -q 'S6.MULTISVC .*all 2 unconditional Multi-service doc' &&
   ! printf '%s\n' "$out" | grep -q 'S6.MULTISVC .*tier-doc-set-'; then
  echo "PASS fixture(tier-multisvc-clears): creating the two docs the findings named takes S6.MULTISVC to a pass"
else
  echo "FAIL fixture(tier-multisvc-clears): S6.MULTISVC did not clear after its findings were satisfied -- output:"
  printf '%s\n' "$out"; fail=1
fi

# --- an unreadable declaration is a finding, never a silent fallback to Base ---------------------
t_bad="$work/tier-bogus"
tier_repo "$t_bad" not-a-tier
run_case_anywhere "tier-declaration-unreadable" 1 "tier-declaration-unreadable" -- \
  sh "$engine" "$t_bad" --spec "$spec"

# --- DoD 2: the required set comes from §2's table, not from this engine -------------------------
# A base-tier row is ADDED to a copy of the real spec. No code changes. The engine must start
# requiring it. If this case fails, the required set is hard-coded whatever the comments claim --
# the same test SPRINT-074 used on §13's Mark column, applied to §2's Tier column.
awk '
  /^\| `product\/acceptance-criteria\.md` \|/ {
    print
    print "| `product/glossary.md` | base | Dev | 100 | init | the vocabulary changes |"
    next
  }
  { print }
' "$spec" > "$work/spec-plus-base-row.md"
grep -q 'product/glossary.md' "$work/spec-plus-base-row.md" || { echo "FAIL harness: could not inject a §2 base row"; fail=1; }
out=$(sh "$engine" "$t_base_ok" --spec "$work/spec-plus-base-row.md" 2>&1); rc=$?
if [ "$rc" -eq 1 ] && printf '%s\n' "$out" | grep -q 'tier-doc-set-incomplete: docs/product/glossary.md'; then
  echo "PASS fixture(tier-set-is-spec-derived): a row added to §2 changed the required set with no code edit"
else
  echo "FAIL fixture(tier-set-is-spec-derived): exit $rc; the required set did not follow the spec -- output:"; printf '%s\n' "$out"; fail=1
fi


# ==================================================================================================
# §6 REASONED EXEMPTION (SPRINT-081 T2, TD-077) -- a repository may rule a Base doc unnecessary and
# say why. Tier G under ADR-029: this is the conformance engine, where a false negative is silent by
# construction, so the must-FAIL case, its control, and the discrimination proof are all required.
#
# THE FAILURE THIS FAMILY EXISTS TO CATCH is the exemption that silences a Structural finding without
# saying anything -- a bare path switching a rule off. That is why the reason-less row is a FINDING
# and not merely ignored, and why the accepted exemption is NAMED in the output with its reason: an
# exclusion nobody can see is indistinguishable from a pass (L-058).
# ==================================================================================================

# Both victims are DERIVED from the spec and their existence asserted before removal (L-146). The
# second one is derived to contain a HYPHEN, deliberately: the first implementation read the reason
# with `sed 's/^[^-]*--.*//'`, which stops at the hyphen INSIDE `acceptance-criteria.md` and emitted
# the path as part of its own reason. `requirements.md` has no hyphen and rendered correctly, so a
# family that tested only the head of the list would have gone green over a live bug (L-142). Caught
# on real input, then pinned here.
x_victim=$(base_tier_set "$spec" | head -1)
x_hyphen=$(base_tier_set "$spec" | while read -r _p; do case "${_p##*/}" in *-*) printf '%s\n' "$_p"; break ;; esac; done)
[ -n "$x_victim" ] || { echo "FAIL harness(exempt): §6's Base tier derived an EMPTY unconditional set, so every case below would pass vacuously"; fail=1; }
[ -n "$x_hyphen" ] || { echo "FAIL harness(exempt): no unconditional Base row has a hyphen in its basename, so the reason-parsing regression cannot be pinned here -- do not delete this guard, re-derive a victim"; fail=1; }
[ "$x_victim" != "$x_hyphen" ] || { echo "FAIL harness(exempt): the plain and hyphenated victims resolved to the SAME path, so the two cases test one thing"; fail=1; }

# --- must-FAIL: a declared path with NO reason is a finding, and the doc is STILL owed ------------
t_xnr="$work/exempt-no-reason"
tier_repo "$t_xnr"
[ -f "$t_xnr/$x_victim" ] || { echo "FAIL harness(exempt-reason-missing): derived victim '$x_victim' was never written, so removing it proves nothing (L-146)"; fail=1; }
rm -- "$t_xnr/$x_victim"
printf '%s\n' "$x_victim" > "$t_xnr/.conformance-exempt"     # a bare path: no `--`, no reason
run_case_anywhere "exempt-reason-missing" 1 "exemption-reason-missing: $x_victim" -- \
  sh "$engine" "$t_xnr" --spec "$spec"

# The other half of that claim, and the one a careless implementation gets wrong: a reason-less row
# must not ALSO suppress the doc. If it did, the bare path would still have switched the finding off
# and the new finding would just be noise beside it.
out=$(sh "$engine" "$t_xnr" --spec "$spec" 2>&1)
if printf '%s\n' "$out" | grep -q "tier-doc-set-incomplete: $x_victim"; then
  echo "PASS fixture(exempt-reason-missing-still-owed): a reason-less row ADDS a finding, it does not replace one"
else
  echo "FAIL fixture(exempt-reason-missing-still-owed): a bare path suppressed the tier finding -- the exemption is a switch, not a ruling -- output:"; printf '%s\n' "$out"; fail=1
fi

# --- PASS control: a reasoned exemption is accepted, and NAMED with its reason --------------------
# The control reports its own DENOMINATOR (L-156): how many exemption rows it declared and how many
# the engine named back. A control that says only "no finding" cannot distinguish "the exemption was
# accepted" from "the case was never reached at all".
t_xok="$work/exempt-reasoned"
tier_repo "$t_xok"
rm -- "$t_xok/$x_victim" "$t_xok/$x_hyphen"
x_declared=2
{ printf '# a comment line, skipped\n\n'
  printf '%s -- owned elsewhere; a second copy would be a second SSOT\n' "$x_victim"
  printf '%s -- dependent on the row above and exempt for exactly as long\n' "$x_hyphen"
} > "$t_xok/.conformance-exempt"
out=$(sh "$engine" "$t_xok" --spec "$spec" 2>&1); rc=$?
x_named=$(printf '%s\n' "$out" | grep -c 'exempt by declaration')
if [ "$rc" -eq 0 ] &&
   [ "$x_named" -eq "$x_declared" ] &&
   ! printf '%s\n' "$out" | grep -q "tier-doc-set-incomplete: $x_victim" &&
   ! printf '%s\n' "$out" | grep -q "tier-doc-set-incomplete: $x_hyphen" &&
   printf '%s\n' "$out" | grep -q "exempt by declaration (.conformance-exempt): $x_hyphen -- dependent on the row above"; then
  echo "PASS fixture(exempt-reasoned-control): $x_named of $x_declared declared exemption(s) accepted and named with their reasons, exit 0"
else
  echo "FAIL fixture(exempt-reasoned-control): exit $rc, $x_named of $x_declared exemption(s) named -- output:"; printf '%s\n' "$out"; fail=1
fi

# The hyphen regression, asserted as its own line so it cannot be lost inside the control's `&&`
# chain. The reason must come back WITHOUT the path repeated inside it.
if printf '%s\n' "$out" | grep -q "exempt by declaration (.conformance-exempt): $x_hyphen -- $x_hyphen"; then
  echo "FAIL fixture(exempt-reason-hyphen): the reason for '$x_hyphen' repeated its own path -- the `--` separator was matched inside the filename"; fail=1
else
  echo "PASS fixture(exempt-reason-hyphen): a hyphenated path's reason is read from the separator, not from the first hyphen"
fi

# --- must-FAIL: the path is matched WHOLE, never as a prefix --------------------------------------
# `docs/` in the declaration must not exempt everything beneath it. A prefix match here would let one
# row switch off the entire tier -- the blanket exemption §6 refuses, arrived at by accident.
t_xpfx="$work/exempt-prefix"
tier_repo "$t_xpfx"
rm -- "$t_xpfx/$x_victim"
printf 'docs/ -- a blanket exemption, which must not work\n' > "$t_xpfx/.conformance-exempt"
run_case_anywhere "exempt-not-a-prefix" 1 "tier-doc-set-incomplete: $x_victim" -- \
  sh "$engine" "$t_xpfx" --spec "$spec"

# --- PASS control: no declaration file at all changes nothing -------------------------------------
# The mechanism must be inert for the repositories that never opt into it -- most of them.
t_xnone="$work/exempt-absent"
tier_repo "$t_xnone"
rm -- "$t_xnone/$x_victim"
out=$(sh "$engine" "$t_xnone" --spec "$spec" 2>&1); rc=$?
if [ "$rc" -eq 1 ] &&
   printf '%s\n' "$out" | grep -q "tier-doc-set-incomplete: $x_victim" &&
   ! printf '%s\n' "$out" | grep -q 'exempt by declaration' &&
   ! printf '%s\n' "$out" | grep -q 'exemption-reason-missing'; then
  echo "PASS fixture(exempt-absent-control): with no .conformance-exempt the tier finding is unchanged and no exemption line appears"
else
  echo "FAIL fixture(exempt-absent-control): exit $rc; the exemption machinery fired on a repo that declared nothing -- output:"; printf '%s\n' "$out"; fail=1
fi

# --- PASS control: a doc that EXISTS is never reported as exempt ----------------------------------
# The declaration is consulted only for an absent doc. A repo that declares an exemption and then
# writes the file anyway has not lied, and reporting the present file as excluded would be noise.
t_xboth="$work/exempt-but-present"
tier_repo "$t_xboth"
printf '%s -- declared exempt, but the file is here anyway\n' "$x_victim" > "$t_xboth/.conformance-exempt"
out=$(sh "$engine" "$t_xboth" --spec "$spec" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && ! printf '%s\n' "$out" | grep -q 'exempt by declaration'; then
  echo "PASS fixture(exempt-present-not-reported): a present doc is counted present, never announced as exempt"
else
  echo "FAIL fixture(exempt-present-not-reported): exit $rc; a doc that exists was reported as exempt -- output:"; printf '%s\n' "$out"; fail=1
fi


# ==================================================================================================
# §2's README OWNERSHIP FOOTER (SPRINT-078 T3) -- one retained must-FAIL fixture and a PASS control.
# ==================================================================================================

# The footer this fixture writes is DERIVED from §3's own example, not typed here. A hard-coded
# footer would keep passing after §3 re-worded the shape -- the control would go on proving that the
# engine accepts a string the standard no longer asks for (L-146's sibling: a fixture that stops
# testing what it names).
readme_footer() {
  awk '
    /^## /{h=$0; sub(/^## [^0-9]*/,"",h); sec=h+0}
    sec != 3 { next }
    /README exception/ { inx = 1 }
    inx && match($0, /<sub>[^<]*<\/sub>/) { print substr($0, RSTART, RLENGTH); exit }
  ' "$1" | sed 's/…/Maintainer/; s/…/2026-08-20/; s/…/current/'
}

t_rm="$work/readme-no-footer"
mkdir -p "$t_rm"; write_core_set "$t_rm"; write_base_tier "$t_rm"
# The victim's EXISTENCE is asserted before it is removed (L-146). write_core_set now writes the
# footer -- it must, since §3 requires it of every front-door and a fixture that ships a
# non-conformant README makes every other case in this file report a finding it never meant to
# create. So the absence this case needs is an EDIT, and an edit that silently no-ops would leave a
# must-FAIL fixture passing because the file never had a footer to lose.
grep -qE '^<sub>.*</sub>' "$t_rm/README.md" || { echo "FAIL harness(readme-footer-missing): the fixture README carries no footer to remove, so this case would pass vacuously (L-146)"; fail=1; }
grep -vE '^<sub>.*</sub>' "$t_rm/README.md" > "$t_rm/README.tmp" && mv "$t_rm/README.tmp" "$t_rm/README.md"
grep -qE '^<sub>.*</sub>' "$t_rm/README.md" && { echo "FAIL harness(readme-footer-missing): the footer survived removal"; fail=1; }
run_case_anywhere "readme-footer-missing" 1 "readme-ownership-footer-missing" -- \
  sh "$engine" "$t_rm" --spec "$spec"

# PASS control: the same repo with §3's own footer appended.
# strip_footer <dir> -- remove README.md's footer line, asserting it was there (L-146). Both cases
# below replace the footer write_core_set now writes, and an append-without-strip would leave the
# complete footer as the FIRST <sub> line -- which is the one the engine reads -- so the partial case
# would have been testing a complete footer.
strip_footer() {
  grep -qE '^<sub>.*</sub>' "$1/README.md" || { echo "FAIL harness(strip_footer): no footer in $1/README.md to replace"; fail=1; }
  grep -vE '^<sub>.*</sub>' "$1/README.md" > "$1/README.tmp" && mv "$1/README.tmp" "$1/README.md"
}

t_rm_ok="$work/readme-with-footer"
mkdir -p "$t_rm_ok"; write_core_set "$t_rm_ok"; write_base_tier "$t_rm_ok"
strip_footer "$t_rm_ok"
rf=$(readme_footer "$spec")
[ -n "$rf" ] || { echo "FAIL harness(readme-footer-control): could not derive §3's footer example, so the control would prove nothing"; fail=1; }
printf '\n%s\n' "$rf" >> "$t_rm_ok/README.md"
out=$(sh "$engine" "$t_rm_ok" --spec "$spec" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && printf '%s\n' "$out" | grep -qE '^PASS  S2\.R-README' &&
   ! printf '%s\n' "$out" | grep -q 'readme-ownership-footer-missing'; then
  echo "PASS fixture(readme-footer-control): §3's own footer shape satisfies §2's rule, exit 0"
else
  echo "FAIL fixture(readme-footer-control): exit $rc -- output:"; printf '%s\n' "$out"; fail=1
fi

# A PARTIAL footer records less than it appears to, and must not pass. This is the case that separates
# "has a <sub> line" from "carries the ownership": the first is trivially satisfiable by any footnote.
t_rm_part="$work/readme-partial-footer"
mkdir -p "$t_rm_part"; write_core_set "$t_rm_part"; write_base_tier "$t_rm_part"
strip_footer "$t_rm_part"
printf '\n<sub>Doc owner: Maintainer</sub>\n' >> "$t_rm_part/README.md"
run_case_anywhere "readme-footer-partial" 1 "readme-ownership-footer-missing" -- \
  sh "$engine" "$t_rm_part" --spec "$spec"

# The required shape is READ FROM §3 -- re-word §3's example in a spec copy and the check follows it,
# with no code edit. This is what keeps S3.README's scope-out ("restates a rule checked elsewhere")
# true: one shape, stated once, checked once.
awk '
  /^## /{h=$0; sub(/^## [^0-9]*/,"",h); sec=h+0}
  sec == 3 && /README exception/ { inx = 1 }
  inx && /<sub>/ { sub(/<sub>[^<]*<\/sub>/, "<sub>Doc owner: … · last updated: … · status: … · steward: …</sub>"); inx = 0 }
  { print }
' "$spec" > "$work/spec-readme-reworded.md"
grep -q 'steward' "$work/spec-readme-reworded.md" || { echo "FAIL harness(readme-shape-from-spec): could not re-word §3's footer example"; fail=1; }
out=$(sh "$engine" "$t_rm_ok" --spec "$work/spec-readme-reworded.md" 2>&1); rc=$?
if [ "$rc" -eq 1 ] && printf '%s\n' "$out" | grep -q 'readme-ownership-footer-missing.*steward'; then
  echo "PASS fixture(readme-shape-from-spec): adding a field to §3's example made §2's check require it -- no code edit"
else
  echo "FAIL fixture(readme-shape-from-spec): exit $rc; the required shape did not follow §3 -- output:"; printf '%s\n' "$out"; fail=1
fi

# --- SPRINT-079 T6: every FAIL line about a repository names the rule that raised it -------------
# The invariant, asserted over a repo built to produce findings from SEVERAL different assertions at
# once -- one finding would prove only that one call site was fixed. A line qualifies if it either
# LEADS with a rule id (the dispatch loop's own shape) or ENDS with a `(Sn.KEY)` marker.
#
# Why this case exists: 23 of 54 verdict lines carried a finding with no rule id, and a failing
# assertion returns before its `ok` line -- so a failing rule could be entirely un-attributable. It
# cost a wrong diagnosis in the sprint that fixed it: a grep by rule id over a report returned nothing
# and was read as "the check does not fire" (L-108). A report an adopter cannot trace back to a rule
# is a report they cannot act on.
t_att="$work/attribution"
mkdir -p "$t_att/docs/architecture" "$t_att/docs/adr" "$t_att/src"
printf '# r\n'                   > "$t_att/README.md"
printf '# no frontmatter\n'      > "$t_att/docs/architecture/overview.md"
printf -- '---\nid: ADR-001\n---\n# ADR-001\n' > "$t_att/docs/adr/ADR-001-d.md"
printf '# stray\n'               > "$t_att/src/erd.md"
out=$(sh "$engine" "$t_att" --spec "$spec" 2>&1)
n_fail_att=$(printf '%s\n' "$out" | grep -c '^FAIL' || true)
n_unattr=$(printf '%s\n' "$out" | grep '^FAIL' | grep -vE '^FAIL  S[0-9]' | grep -cE -v '\(S[0-9]+\.[A-Z0-9-]+\)$' || true)
if [ "$n_fail_att" -gt 3 ] && [ "$n_unattr" -eq 0 ]; then
  echo "PASS fixture(every-fail-names-its-rule): $n_fail_att finding(s) from several assertions, 0 un-attributed"
else
  echo "FAIL fixture(every-fail-names-its-rule): $n_unattr of $n_fail_att FAIL line(s) name no rule (and >3 findings were required, to prove more than one call site) -- output:"
  printf '%s\n' "$out" | grep '^FAIL' | sed 's/^/    /'; fail=1
fi

# --- T6 control: the negative assertions the SUFFIX form exists to preserve ----------------------
# Three retained fixtures elsewhere assert the ABSENCE of a finding at line start. Prefixing the rule
# id would have satisfied those negations unconditionally -- a vacuous pass (L-146). This case proves
# the patterns still MATCH a real finding, which is what makes their negation meaningful.
miss=""
printf '%s\n' "$out" | grep -qE '^FAIL +ownership-header' || miss="$miss ownership-header"
printf '%s\n' "$out" | grep -qE '^FAIL +file-outside-canonical-placement' || miss="$miss file-outside-canonical-placement"
printf '%s\n' "$out" | grep -qE '^FAIL  [a-z-]+: ' || miss="$miss lowercase-finding-at-line-start"
if [ -z "$miss" ]; then
  echo "PASS fixture(suffix-preserves-negations): every line-start pattern the retained harnesses negate still matches a real finding"
else
  echo "FAIL fixture(suffix-preserves-negations): no longer matched:$miss -- the negations in run-ownership-header/run-s2-placement/run-foreign-repo would now pass vacuously"
  fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "CONFORMANCE ENGINE FIXTURES: all green"
else
  echo "CONFORMANCE ENGINE FIXTURES: FAILURES ABOVE"
fi
exit $fail
