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
write_core_set() {   # write_core_set <dir>
  for p in $(core_set "$spec"); do
    mkdir -p "$1/$(dirname "$p")" 2>/dev/null
    # AGENTS.md is §3's thin-pointer EXCEPTION: it carries its ownership as a footer <sub> line, not
    # a YAML block, precisely because a 6-line header would defeat a ~10-line pointer file. Writing
    # it with a header made S3.AGENTS fire against a fixture that was supposed to be clean.
    case "$p" in
      AGENTS.md)
        printf -- '# AGENTS\n\nSee `.claude/CLAUDE.md`.\n\n<sub>Doc owner: Maintainer · last updated: 2026-08-20 · status: current</sub>\n' > "$1/$p"
        ;;
      *)
        printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When it changes\nstatus: current\n---\n\n# %s\n\nBody.\n' "${p##*/}" > "$1/$p"
        ;;
    esac
  done
}

target="$work/target-repo"
mkdir -p "$target"
write_core_set "$target"

# A second target that DOES have a real defect: one doc with no ownership header. Needed since
# SPRINT-075 T3 separated engine gaps from repository findings -- before that, any spec with an
# unimplemented rule produced a "finding" and a blocked level against ANY target, so a repo with
# nothing wrong could not be told apart from one with something wrong. The cases below that assert a
# blocked level or a non-zero exit now need an actual defect, which is the point.
target_bad="$work/target-repo-with-a-defect"
mkdir -p "$target_bad/docs"
write_core_set "$target_bad"
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

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "CONFORMANCE ENGINE FIXTURES: all green"
else
  echo "CONFORMANCE ENGINE FIXTURES: FAILURES ABOVE"
fi
exit $fail
